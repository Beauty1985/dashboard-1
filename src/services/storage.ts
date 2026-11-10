import { FeedbackSubmission, OverallStats, QuestionStats, FirebaseCustomConfig } from '../types/feedback';
import { SURVEY_QUESTIONS, getLikertInterpretation } from '../constants/questions';

const STORAGE_KEY = 'training_feedback_submissions_v1';
const SUBMITTED_TOKEN_KEY = 'training_feedback_device_token_v1';
const FIREBASE_CONFIG_KEY = 'training_feedback_firebase_config_v1';
const BROADCAST_CHANNEL_NAME = 'training_feedback_sync_channel';

// BroadcastChannel instance for zero-latency multi-tab sync
let broadcastChannel: BroadcastChannel | null = null;
if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
  try {
    broadcastChannel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
  } catch (e) {
    console.warn('BroadcastChannel not supported in this environment', e);
  }
}

/**
 * Check if current device/browser has already submitted
 */
export function hasAlreadySubmitted(): boolean {
  if (typeof window === 'undefined') return false;
  return Boolean(localStorage.getItem(SUBMITTED_TOKEN_KEY));
}

/**
 * Mark device as submitted
 */
export function markDeviceAsSubmitted(submissionId: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SUBMITTED_TOKEN_KEY, JSON.stringify({
    submittedAt: Date.now(),
    submissionId
  }));
}

/**
 * Reset submission token on this device (for testing/re-submitting)
 */
export function resetDeviceSubmissionStatus(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(SUBMITTED_TOKEN_KEY);
}

/**
 * Retrieve saved Firebase Realtime DB config from localStorage
 */
export function getSavedFirebaseConfig(): FirebaseCustomConfig | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(FIREBASE_CONFIG_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * Save Firebase Realtime DB config
 */
export function saveFirebaseConfig(config: FirebaseCustomConfig | null): void {
  if (typeof window === 'undefined') return;
  if (!config) {
    localStorage.removeItem(FIREBASE_CONFIG_KEY);
  } else {
    localStorage.setItem(FIREBASE_CONFIG_KEY, JSON.stringify(config));
  }
  notifySubscribers();
}

/**
 * Fetch all submissions stored locally
 */
export function getLocalSubmissions(): FeedbackSubmission[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error('Error parsing stored submissions:', e);
    return [];
  }
}

/**
 * Calculate full aggregated statistics
 */
export function calculateOverallStats(submissions: FeedbackSubmission[]): OverallStats {
  const total = submissions.length;

  if (total === 0) {
    const emptyQuestionStats: QuestionStats[] = SURVEY_QUESTIONS.map(q => ({
      questionId: q.id,
      title: q.title,
      average: 0,
      count: 0,
      distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      interpretation: getLikertInterpretation(0)
    }));

    return {
      totalResponses: 0,
      overallAverage: 0,
      overallInterpretation: getLikertInterpretation(0),
      questionStats: emptyQuestionStats,
      latestComments: []
    };
  }

  // Calculate stats for each question
  let grandTotalScoreSum = 0;
  let totalRatingEntries = 0;

  const questionStats: QuestionStats[] = SURVEY_QUESTIONS.map(q => {
    const key = q.id as keyof FeedbackSubmission['ratings'];
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let questionScoreSum = 0;
    let questionCount = 0;

    submissions.forEach(sub => {
      const score = sub.ratings[key];
      if (score >= 1 && score <= 5) {
        distribution[score as 1 | 2 | 3 | 4 | 5] = (distribution[score as 1 | 2 | 3 | 4 | 5] || 0) + 1;
        questionScoreSum += score;
        questionCount += 1;
        grandTotalScoreSum += score;
        totalRatingEntries += 1;
      }
    });

    const average = questionCount > 0 ? Number((questionScoreSum / questionCount).toFixed(2)) : 0;

    return {
      questionId: q.id,
      title: q.title,
      average,
      count: questionCount,
      distribution,
      interpretation: getLikertInterpretation(average)
    };
  });

  const overallAverage = totalRatingEntries > 0
    ? Number((grandTotalScoreSum / totalRatingEntries).toFixed(2))
    : 0;

  // Extract latest comments
  const latestComments = submissions
    .filter(s => s.comments && s.comments.trim().length > 0)
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 50)
    .map(s => {
      const avg = (s.ratings.q1 + s.ratings.q2 + s.ratings.q3 + s.ratings.q4 + s.ratings.q5) / 5;
      return {
        id: s.id,
        text: s.comments!.trim(),
        createdAt: s.createdAt,
        overallRating: Number(avg.toFixed(1))
      };
    });

  return {
    totalResponses: total,
    overallAverage,
    overallInterpretation: getLikertInterpretation(overallAverage),
    questionStats,
    latestComments
  };
}

/**
 * Save a new submission
 */
export async function submitFeedback(data: {
  ratings: { q1: number; q2: number; q3: number; q4: number; q5: number };
  comments?: string;
}): Promise<FeedbackSubmission> {
  const submission: FeedbackSubmission = {
    id: 'fb_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8),
    createdAt: Date.now(),
    ratings: data.ratings,
    comments: data.comments?.trim() || undefined
  };

  // 1. Save to localStorage
  const current = getLocalSubmissions();
  current.unshift(submission);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(current));

  // 2. Mark this device as submitted
  markDeviceAsSubmitted(submission.id);

  // 3. Broadcast to other tabs/windows
  notifySubscribers();

  // 4. If Firebase Realtime Database is configured, push to it as well
  const firebaseConfig = getSavedFirebaseConfig();
  if (firebaseConfig?.databaseURL) {
    try {
      const endpoint = `${firebaseConfig.databaseURL.replace(/\/$/, '')}/feedbacks.json`;
      fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submission)
      }).catch(err => console.warn('Firebase RTDB POST error:', err));
    } catch (e) {
      console.warn('Firebase RTDB push error', e);
    }
  }

  return submission;
}

/**
 * Notification listeners for real-time changes
 */
type Listener = (submissions: FeedbackSubmission[]) => void;
const listeners = new Set<Listener>();

function notifySubscribers() {
  const data = getLocalSubmissions();
  listeners.forEach(fn => fn(data));

  if (broadcastChannel) {
    broadcastChannel.postMessage({ type: 'FEEDBACK_UPDATED', timestamp: Date.now() });
  }
}

/**
 * Subscribe to real-time updates
 */
export function subscribeToFeedbackUpdates(callback: Listener): () => void {
  listeners.add(callback);
  // Send initial data
  callback(getLocalSubmissions());

  // Listen to BroadcastChannel
  const handleBroadcast = (event: MessageEvent) => {
    if (event.data?.type === 'FEEDBACK_UPDATED' || event.data?.type === 'DATA_RESET') {
      callback(getLocalSubmissions());
    }
  };

  // Listen to standard window storage event
  const handleStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) {
      callback(getLocalSubmissions());
    }
  };

  if (broadcastChannel) {
    broadcastChannel.addEventListener('message', handleBroadcast);
  }
  window.addEventListener('storage', handleStorage);

  // Optional: If Firebase Realtime DB is set up, poll or stream via Server-Sent Events (SSE)
  const firebaseConfig = getSavedFirebaseConfig();
  let eventSource: EventSource | null = null;
  if (firebaseConfig?.databaseURL) {
    try {
      const sseUrl = `${firebaseConfig.databaseURL.replace(/\/$/, '')}/feedbacks.json`;
      eventSource = new EventSource(sseUrl);
      eventSource.addEventListener('put', (e) => {
        try {
          const parsed = JSON.parse(e.data);
          if (parsed && parsed.data) {
            // Merge or sync
            const cloudItems: FeedbackSubmission[] = Object.values(parsed.data);
            if (Array.isArray(cloudItems) && cloudItems.length > 0) {
              const localMap = new Map(getLocalSubmissions().map(i => [i.id, i]));
              cloudItems.forEach(item => {
                if (item && item.id) localMap.set(item.id, item);
              });
              const merged = Array.from(localMap.values()).sort((a, b) => b.createdAt - a.createdAt);
              localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
              callback(merged);
            }
          }
        } catch (err) {
          console.warn('SSE parsing error', err);
        }
      });
    } catch (e) {
      console.warn('SSE connection error', e);
    }
  }

  return () => {
    listeners.delete(callback);
    if (broadcastChannel) {
      broadcastChannel.removeEventListener('message', handleBroadcast);
    }
    window.removeEventListener('storage', handleStorage);
    if (eventSource) {
      eventSource.close();
    }
  };
}

/**
 * Export responses as CSV with UTF-8 BOM for Thai language Excel support
 */
export function exportToCSV(submissions: FeedbackSubmission[]): void {
  if (submissions.length === 0) {
    alert('ยังไม่มีข้อมูลการตอบแบบสอบถามสำหรับดาวน์โหลด');
    return;
  }

  const headers = [
    'ลำดับ',
    'รหัสการตอบ',
    'วันเวลาที่ส่ง',
    'ข้อ 1 (เนื้อหาหลักสูตร)',
    'ข้อ 2 (วิทยากร)',
    'ข้อ 3 (เอกสารและสื่อ)',
    'ข้อ 4 (สถานที่และระบบ)',
    'ข้อ 5 (ความพึงพอใจรวม)',
    'คะแนนเฉลี่ย',
    'การแปลผล',
    'ข้อเสนอแนะเพิ่มเติม'
  ];

  const rows = submissions.map((s, index) => {
    const avg = ((s.ratings.q1 + s.ratings.q2 + s.ratings.q3 + s.ratings.q4 + s.ratings.q5) / 5).toFixed(2);
    const interp = getLikertInterpretation(Number(avg)).level;
    const dateStr = new Date(s.createdAt).toLocaleString('th-TH', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    const cleanComment = (s.comments || '').replace(/"/g, '""').replace(/\r?\n/g, ' ');

    return [
      index + 1,
      `"${s.id}"`,
      `"${dateStr}"`,
      s.ratings.q1,
      s.ratings.q2,
      s.ratings.q3,
      s.ratings.q4,
      s.ratings.q5,
      avg,
      `"${interp}"`,
      `"${cleanComment}"`
    ].join(',');
  });

  const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const now = new Date().toISOString().slice(0, 10);
  link.setAttribute('href', url);
  link.setAttribute('download', `training_feedback_results_${now}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Seed realistic demo data for presentations and testing
 */
export function seedSampleResponses(count: number = 12): void {
  const sampleComments = [
    'วิทยากรอธิบายเนื้อหาได้เห็นภาพชัดเจนมากครับ มีตัวอย่างกรณีศึกษาจริงทำให้เข้าใจเร็วขึ้น',
    'สไลด์สวยงาม เข้าใจง่าย อยากให้เพิ่มเวลาฝึกปฏิบัติ (Workshop) อีกสัก 30 นาทีครับ',
    'สถานที่สะอาด แอร์เย็นสบาย ระบบเสียงคมชัด การจัดเบรกของว่างดีมากค่ะ',
    'ได้รับประโยชน์มาก สามารถนำกลับไปปรับใช้กับการทำงานในแผนกได้ทันที',
    'เนื้อหาเข้มข้นดีมาก ตอบโจทย์ความต้องการของผู้เรียน ขอชมเชยทีมงานจัดเตรียมงานอย่างดี',
    'อยากให้มีหลักสูตรระดับ Advance ต่อยอดจากคอร์สนี้อีกรอบค่ะ วิทยากรเก่งมาก',
    'การจัดเวลาค่อนข้างกระชับดีมาก บรรยากาศเป็นกันเอง ไม่น่าเบื่อเลย',
    'ระบบการลงทะเบียนและแบบสอบถามออนไลน์ใช้งานง่ายและสะดวกมากครับ',
    'ชอบช่วง Q&A มาก ได้คำตอบที่ตรงประเด็นและช่วยแก้ปัญหาหน้างานได้จริง'
  ];

  const now = Date.now();
  const generated: FeedbackSubmission[] = [];

  for (let i = 0; i < count; i++) {
    // Generate predominantly high ratings typical of good training (4 or 5, occasionally 3)
    const randScore = (baseWeight: number = 4.2) => {
      const r = Math.random();
      if (r > 0.65) return 5;
      if (r > 0.20) return 4;
      if (r > 0.05) return 3;
      return 2;
    };

    const hasComment = Math.random() > 0.3;
    const comment = hasComment ? sampleComments[i % sampleComments.length] : undefined;

    generated.push({
      id: 'demo_' + (now - (count - i) * 180000) + '_' + Math.random().toString(36).substring(2, 6),
      createdAt: now - (count - i) * (120000 + Math.floor(Math.random() * 60000)),
      ratings: {
        q1: randScore(),
        q2: Math.random() > 0.3 ? 5 : 4,
        q3: randScore(),
        q4: randScore(),
        q5: Math.random() > 0.25 ? 5 : 4
      },
      comments: comment
    });
  }

  const current = getLocalSubmissions();
  const merged = [...generated, ...current];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
  notifySubscribers();
}

/**
 * Clear all submissions data
 */
export function clearAllSubmissions(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
  notifySubscribers();
  if (broadcastChannel) {
    broadcastChannel.postMessage({ type: 'DATA_RESET', timestamp: Date.now() });
  }
}
