import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { SURVEY_QUESTIONS, RATING_LEVELS } from '../constants/questions';
import { submitFeedback, hasAlreadySubmitted, resetDeviceSubmissionStatus } from '../services/storage';
import { CheckCircle2, Send, RotateCcw, ArrowRight, Shield, HeartHandshake, Sparkles, AlertCircle } from 'lucide-react';

interface SurveyViewProps {
  onGoToDashboard: () => void;
}

export const SurveyView: React.FC<SurveyViewProps> = ({ onGoToDashboard }) => {
  const [alreadySubmitted, setAlreadySubmitted] = useState<boolean>(false);
  const [ratings, setRatings] = useState<{ [key: string]: number }>({});
  const [comments, setComments] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [justSubmitted, setJustSubmitted] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setAlreadySubmitted(hasAlreadySubmitted());
  }, []);

  const handleSelectScore = (questionId: string, score: number) => {
    setRatings(prev => ({
      ...prev,
      [questionId]: score
    }));
    if (errorMessage) setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check all 5 questions
    const unanswered = SURVEY_QUESTIONS.filter(q => !ratings[q.id]);
    if (unanswered.length > 0) {
      setErrorMessage(`กรุณาตอบคำถามให้ครบทุกข้อ (ยังไม่ได้ให้คะแนนข้อ: ${unanswered.map(u => u.number).join(', ')})`);
      // Scroll to first unanswered
      const el = document.getElementById(`card-${unanswered[0].id}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);

    try {
      await submitFeedback({
        ratings: {
          q1: ratings.q1,
          q2: ratings.q2,
          q3: ratings.q3,
          q4: ratings.q4,
          q5: ratings.q5,
        },
        comments
      });

      // Confetti celebration
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 }
      });

      setJustSubmitted(true);
      setAlreadySubmitted(true);
    } catch (err) {
      console.error('Error submitting feedback:', err);
      setErrorMessage('เกิดข้อผิดพลาดในการส่งข้อมูล กรุณาลองใหม่อีกครั้ง');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetForTesting = () => {
    resetDeviceSubmissionStatus();
    setAlreadySubmitted(false);
    setJustSubmitted(false);
    setRatings({});
    setComments('');
    setErrorMessage(null);
  };

  // State: Already submitted (Duplicate prevention)
  if (alreadySubmitted && !justSubmitted) {
    return (
      <div className="max-w-lg mx-auto px-4 py-8 animate-fade-in">
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-slate-150 text-center">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center text-4xl mx-auto mb-5 shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            คุณได้ส่งแบบประเมินเรียบร้อยแล้ว
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed mb-6">
            เครื่องนี้ได้ทำการบันทึกความคิดเห็นเข้าระบบแล้ว ขอบพระคุณสำหรับข้อเสนอแนะอันมีค่าเพื่อนำไปพัฒนาการอบรมครั้งต่อไป
          </p>

          <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs text-slate-600 flex items-center justify-center space-x-2 mb-6">
            <Shield className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>ระบบป้องกันการตอบซ้ำ (1 เครื่องต่อ 1 คำตอบ)</span>
          </div>

          <div className="space-y-3">
            <button
              onClick={onGoToDashboard}
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-200 flex items-center justify-center space-x-2 transition text-sm"
            >
              <span>ดูผลลัพธ์บนจอ Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={handleResetForTesting}
              className="text-xs text-slate-400 hover:text-indigo-600 flex items-center justify-center space-x-1 mx-auto pt-2 underline"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>(สำหรับผู้ทดสอบ: รีเซ็ตเพื่อลองตอบใหม่อีกครั้ง)</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // State: Just submitted celebration screen
  if (justSubmitted) {
    return (
      <div className="max-w-lg mx-auto px-4 py-8 animate-fade-in">
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-emerald-100 text-center">
          <div className="w-20 h-20 bg-gradient-to-tr from-emerald-500 to-teal-400 text-white rounded-3xl flex items-center justify-center text-4xl mx-auto mb-5 shadow-lg shadow-emerald-200 animate-bounce">
            <Sparkles className="w-10 h-10" />
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            บันทึกแบบประเมินสำเร็จ! 🎉
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed mb-6">
            ข้อมูลของคุณถูกส่งต่อไปยังหน้าจอวิทยากรแบบสด (Real-time) เรียบร้อยแล้ว ขอขอบคุณที่ร่วมเป็นส่วนหนึ่งของการพัฒนา
          </p>

          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-xs text-emerald-800 text-left mb-6 space-y-1">
            <div className="font-bold flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>สรุปคะแนนที่คุณให้:</span>
            </div>
            <div className="grid grid-cols-5 gap-1.5 pt-2 text-center font-bold">
              {SURVEY_QUESTIONS.map(q => (
                <div key={q.id} className="bg-white/80 p-1.5 rounded-lg border border-emerald-200">
                  <span className="text-[10px] text-slate-500 block">ข้อ {q.number}</span>
                  <span className="text-sm text-emerald-700">{ratings[q.id]}⭐</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={onGoToDashboard}
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-200 flex items-center justify-center space-x-2 transition text-sm"
            >
              <span>ไปที่หน้า Dashboard ดูผลรวมสด</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={handleResetForTesting}
              className="text-xs text-slate-400 hover:text-indigo-600 flex items-center justify-center space-x-1 mx-auto pt-2 underline"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>(สำหรับผู้ทดสอบ: รีเซ็ตเพื่อลองตอบใหม่อีกครั้ง)</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main Survey Form (Mobile-first)
  return (
    <div className="max-w-lg mx-auto px-4 py-6">

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-3xl p-6 text-white shadow-xl shadow-indigo-600/15 mb-6 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center space-x-2 text-indigo-200 text-xs font-semibold uppercase tracking-wider mb-1">
            <HeartHandshake className="w-4 h-4" />
            <span>แบบประเมินความพึงพอใจ</span>
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold tracking-tight">
            โครงการอบรมเชิงปฏิบัติการ
          </h1>
          <p className="text-xs md:text-sm text-indigo-100/90 mt-2 leading-relaxed">
            โปรดเลือกให้คะแนนความพึงพอใจตามความเป็นจริงในแต่ละหัวข้อ (1 = น้อยที่สุด ถึง 5 = มากที่สุด)
          </p>
        </div>
        <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
      </div>

      {/* Error alert if missing answers */}
      {errorMessage && (
        <div className="mb-5 p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-xs flex items-start space-x-2.5 animate-shake">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-500 mt-0.5" />
          <span className="font-semibold leading-relaxed">{errorMessage}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">

        {SURVEY_QUESTIONS.map((question) => {
          const selectedScore = ratings[question.id];

          return (
            <div
              key={question.id}
              id={`card-${question.id}`}
              className={`bg-white rounded-3xl p-5 md:p-6 shadow-sm border transition-all ${
                selectedScore
                  ? 'border-indigo-400/80 ring-2 ring-indigo-50/80 shadow-md'
                  : 'border-slate-200/90'
              }`}
            >
              {/* Question Title */}
              <div className="flex items-start space-x-3 mb-2">
                <span className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center flex-shrink-0 transition-colors ${
                  selectedScore ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'
                }`}>
                  {question.number}
                </span>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm md:text-base leading-snug">
                    {question.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {question.subtitle}
                  </p>
                </div>
              </div>

              {/* 1-5 Score Buttons (Mobile-first large touch targets) */}
              <div className="grid grid-cols-5 gap-1.5 md:gap-2.5 mt-4">
                {RATING_LEVELS.map((level) => {
                  const isSelected = selectedScore === level.value;

                  return (
                    <button
                      key={level.value}
                      type="button"
                      onClick={() => handleSelectScore(question.id, level.value)}
                      className={`relative py-3.5 px-1 rounded-2xl border-2 flex flex-col items-center justify-center transition-all cursor-pointer ${
                        isSelected
                          ? `${level.activeBg} shadow-md scale-[1.04] ring-2 ring-indigo-400/30`
                          : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span className="text-xl md:text-2xl transition-transform transform active:scale-125">
                        {level.emoji}
                      </span>
                      <span className="text-sm font-extrabold mt-1">
                        {level.value}
                      </span>
                      <span className="text-[10px] hidden md:block opacity-80 font-medium">
                        {level.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Selected Label Display */}
              <div className="mt-2.5 flex justify-between items-center text-xs text-slate-500 pt-2 border-t border-slate-100">
                <span>1 = น้อยที่สุด</span>
                {selectedScore && (
                  <span className="font-bold text-indigo-600">
                    เลือก: {RATING_LEVELS[selectedScore - 1].label} ({selectedScore} คะแนน)
                  </span>
                )}
                <span>5 = มากที่สุด</span>
              </div>
            </div>
          );
        })}

        {/* Optional Comments */}
        <div className="bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-slate-200/90">
          <label htmlFor="comments" className="block font-bold text-slate-900 text-sm mb-1">
            ข้อเสนอแนะเพิ่มเติมสำหรับการอบรม <span className="text-slate-400 font-normal">(ไม่บังคับ)</span>
          </label>
          <p className="text-xs text-slate-500 mb-3">
            เช่น ความประทับใจ จุดที่อยากให้พัฒนา หรือหัวข้ออบรมที่สนใจในครั้งถัดไป
          </p>
          <textarea
            id="comments"
            rows={3}
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="พิมพ์ความคิดเห็นของคุณที่นี่..."
            className="w-full text-sm p-3.5 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:outline-none placeholder:text-slate-400 resize-none transition"
          />
        </div>

        {/* Submit Button */}
        <div className="pt-2 pb-6">
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 px-6 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-extrabold rounded-2xl shadow-xl shadow-indigo-600/25 flex items-center justify-center space-x-2 transition-all active:scale-[0.98] text-base disabled:opacity-70"
          >
            {submitting ? (
              <span>กำลังส่งข้อมูล...</span>
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span>ส่งแบบประเมินความพึงพอใจ</span>
              </>
            )}
          </button>
          <p className="text-[11px] text-center text-slate-400 mt-2.5">
            🔒 ข้อมูลของคุณจะไม่ถูกระบุชื่อ และส่งต่อประมวลผลทางสถิติแบบเรียลไทม์
          </p>
        </div>

      </form>

    </div>
  );
};
