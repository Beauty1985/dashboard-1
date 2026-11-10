import { SurveyQuestion, LikertInterpretation } from '../types/feedback';

export const SURVEY_QUESTIONS: SurveyQuestion[] = [
  {
    id: 'q1',
    number: 1,
    title: 'เนื้อหาหลักสูตรมีความเหมาะสมและตรงตามวัตถุประสงค์',
    subtitle: 'ความชัดเจน ความครอบคลุม และประโยชน์ของเนื้อหาที่อบรม',
    category: 'content'
  },
  {
    id: 'q2',
    number: 2,
    title: 'วิทยากรมีความเชี่ยวชาญและถ่ายทอดเข้าใจง่าย',
    subtitle: 'เทคนิคการสอน การตอบข้อซักถาม และการมีปฏิสัมพันธ์กับผู้เรียน',
    category: 'speaker'
  },
  {
    id: 'q3',
    number: 3,
    title: 'เอกสารและสื่อประกอบการอบรมมีคุณภาพ',
    subtitle: 'สไลด์ ตัวอย่างประกอบ เวิร์กช็อป หรือสื่อการสอนที่ได้รับ',
    category: 'materials'
  },
  {
    id: 'q4',
    number: 4,
    title: 'ความเหมาะสมของระยะเวลา สถานที่ และระบบอำนวยความสะดวก',
    subtitle: 'การบริหารเวลา อุปกรณ์ สภาพแวดล้อม และการสนับสนุนตลอดการจัดงาน',
    category: 'venue'
  },
  {
    id: 'q5',
    number: 5,
    title: 'ความพึงพอใจในภาพรวมและสามารถนำไปประยุกต์ใช้ได้จริง',
    subtitle: 'ความคุ้มค่า และการนำความรู้ไปต่อยอดในการทำงานหรือชีวิตประจำวัน',
    category: 'overall'
  }
];

export const RATING_LEVELS = [
  { value: 1, label: 'น้อยที่สุด', emoji: '😞', shortText: '1 - น้อยที่สุด', color: 'from-rose-500 to-red-600', activeBg: 'bg-rose-500 text-white border-rose-600' },
  { value: 2, label: 'น้อย', emoji: '🙁', shortText: '2 - น้อย', color: 'from-amber-500 to-orange-500', activeBg: 'bg-amber-500 text-white border-amber-600' },
  { value: 3, label: 'ปานกลาง', emoji: '😐', shortText: '3 - ปานกลาง', color: 'from-yellow-400 to-amber-500', activeBg: 'bg-yellow-500 text-white border-yellow-600' },
  { value: 4, label: 'มาก', emoji: '😊', shortText: '4 - มาก', color: 'from-teal-500 to-emerald-500', activeBg: 'bg-teal-500 text-white border-teal-600' },
  { value: 5, label: 'มากที่สุด', emoji: '🤩', shortText: '5 - มากที่สุด', color: 'from-emerald-500 to-green-600', activeBg: 'bg-emerald-600 text-white border-emerald-700' },
];

/**
 * แปลผลตามเกณฑ์มาตราส่วน 5 ระดับ (Likert Scale)
 * 4.50 – 5.00: มากที่สุด (ระดับยอดเยี่ยม)
 * 3.50 – 4.49: มาก (ระดับดี)
 * 2.50 – 3.49: ปานกลาง (ระดับพอใช้)
 * 1.50 – 2.49: น้อย (ควรปรับปรุง)
 * 1.00 – 1.49: น้อยที่สุด (เร่งด่วน)
 */
export function getLikertInterpretation(score: number): LikertInterpretation {
  if (score >= 4.50) {
    return {
      level: 'มากที่สุด',
      description: 'ระดับดีเยี่ยม (Excellent)',
      colorClass: 'text-emerald-600',
      badgeBg: 'bg-emerald-100 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-700',
      badgeText: 'text-emerald-700 dark:text-emerald-300'
    };
  } else if (score >= 3.50) {
    return {
      level: 'มาก',
      description: 'ระดับดี (Good)',
      colorClass: 'text-teal-600',
      badgeBg: 'bg-teal-100 dark:bg-teal-950/60 border-teal-300 dark:border-teal-700',
      badgeText: 'text-teal-700 dark:text-teal-300'
    };
  } else if (score >= 2.50) {
    return {
      level: 'ปานกลาง',
      description: 'ระดับปานกลาง / พอใช้ (Fair)',
      colorClass: 'text-amber-600',
      badgeBg: 'bg-amber-100 dark:bg-amber-950/60 border-amber-300 dark:border-amber-700',
      badgeText: 'text-amber-700 dark:text-amber-300'
    };
  } else if (score >= 1.50) {
    return {
      level: 'น้อย',
      description: 'ระดับควรปรับปรุง (Needs Improvement)',
      colorClass: 'text-orange-600',
      badgeBg: 'bg-orange-100 dark:bg-orange-950/60 border-orange-300 dark:border-orange-700',
      badgeText: 'text-orange-700 dark:text-orange-300'
    };
  } else if (score > 0) {
    return {
      level: 'น้อยที่สุด',
      description: 'ระดับควรปรับปรุงเร่งด่วน (Poor)',
      colorClass: 'text-rose-600',
      badgeBg: 'bg-rose-100 dark:bg-rose-950/60 border-rose-300 dark:border-rose-700',
      badgeText: 'text-rose-700 dark:text-rose-300'
    };
  } else {
    return {
      level: 'ยังไม่มีข้อมูล',
      description: 'รอผู้ตอบแบบสอบถามชุดแรก',
      colorClass: 'text-slate-400',
      badgeBg: 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700',
      badgeText: 'text-slate-600 dark:text-slate-400'
    };
  }
}
