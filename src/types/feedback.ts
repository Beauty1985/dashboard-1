export interface SurveyQuestion {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  category: 'content' | 'speaker' | 'materials' | 'venue' | 'overall';
}

export interface FeedbackSubmission {
  id: string;
  createdAt: number;
  ratings: {
    q1: number; // 1-5
    q2: number;
    q3: number;
    q4: number;
    q5: number;
  };
  comments?: string;
  deviceFingerprint?: string;
}

export interface QuestionStats {
  questionId: string;
  title: string;
  average: number;
  count: number;
  distribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  interpretation: LikertInterpretation;
}

export interface LikertInterpretation {
  level: string;
  description: string;
  colorClass: string;
  badgeBg: string;
  badgeText: string;
}

export interface OverallStats {
  totalResponses: number;
  overallAverage: number;
  overallInterpretation: LikertInterpretation;
  questionStats: QuestionStats[];
  latestComments: Array<{
    id: string;
    text: string;
    createdAt: number;
    overallRating: number;
  }>;
}

export interface FirebaseCustomConfig {
  apiKey?: string;
  authDomain?: string;
  databaseURL?: string;
  projectId?: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
}
