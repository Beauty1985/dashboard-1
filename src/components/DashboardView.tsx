import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { OverallStats, FeedbackSubmission } from '../types/feedback';
import { exportToCSV, seedSampleResponses } from '../services/storage';
import {
  Users,
  Award,
  BarChart3,
  PieChart,
  MessageSquare,
  QrCode,
  Download,
  Maximize2,
  Minimize2,
  Sparkles,
  TrendingUp,
  Star,
  CheckCircle,
  Clock
} from 'lucide-react';

interface DashboardViewProps {
  stats: OverallStats;
  submissions: FeedbackSubmission[];
  surveyUrl: string;
  onOpenQR: () => void;
  onGoToSurvey: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  stats,
  submissions,
  surveyUrl,
  onOpenQR,
  onGoToSurvey
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [chartType, setChartType] = useState<'donut' | 'bar'>('donut');
  const [qrMiniDataUrl, setQrMiniDataUrl] = useState<string>('');

  useEffect(() => {
    if (surveyUrl) {
      QRCode.toDataURL(surveyUrl, {
        width: 180,
        margin: 1,
        color: { dark: '#0f172a', light: '#ffffff' }
      }).then(setQrMiniDataUrl).catch(console.error);
    }
  }, [surveyUrl]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(console.error);
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(console.error);
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">

      {/* Top Banner & Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-800/80 border border-slate-700/80 rounded-3xl p-5 shadow-xl backdrop-blur-sm">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              LIVE REALTIME DASHBOARD
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold text-white mt-1">
            ผลการประเมินความพึงพอใจการอบรมสด
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            ข้อมูลจะปรับปรุงบนกราฟและสถิติในทันทีที่มีผู้ส่งแบบสอบถาม
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          {/* Giant QR Button */}
          <button
            onClick={onOpenQR}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs md:text-sm font-semibold flex items-center space-x-2 shadow-lg shadow-indigo-600/30 transition cursor-pointer"
          >
            <QrCode className="w-4 h-4" />
            <span>ฉาย QR Code จอใหญ่</span>
          </button>

          {/* Download CSV */}
          <button
            onClick={() => exportToCSV(submissions)}
            className="px-3.5 py-2.5 bg-slate-700/90 hover:bg-slate-600 text-slate-100 rounded-xl text-xs md:text-sm font-medium flex items-center space-x-1.5 transition border border-slate-600 cursor-pointer"
          >
            <Download className="w-4 h-4 text-teal-400" />
            <span>ดาวน์โหลด CSV</span>
          </button>

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            className="p-2.5 bg-slate-700/90 hover:bg-slate-600 text-slate-200 rounded-xl transition border border-slate-600 cursor-pointer"
            title={isFullscreen ? 'ออกจากโหมดเต็มจอ' : 'แสดงเต็มจอโปรเจกเตอร์'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Top 3 KPI Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

        {/* KPI 1: Overall Average Score */}
        <div className="bg-gradient-to-br from-slate-800/90 via-slate-800/60 to-slate-900 border border-slate-700 rounded-3xl p-6 shadow-xl relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold flex items-center space-x-1.5">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span>คะแนนความพึงพอใจเฉลี่ยรวม</span>
              </span>
              <div className="flex items-baseline space-x-2.5 mt-2">
                <span className="text-5xl md:text-6xl font-black text-white tracking-tight font-mono">
                  {stats.overallAverage > 0 ? stats.overallAverage.toFixed(2) : '0.00'}
                </span>
                <span className="text-slate-400 text-sm font-medium">/ 5.00</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center text-2xl shadow-inner">
              ⭐
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-700/60 flex items-center justify-between">
            <span className="text-xs text-slate-400">ระดับความพึงพอใจ:</span>
            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${stats.overallInterpretation.badgeBg} ${stats.overallInterpretation.badgeText}`}>
              {stats.overallInterpretation.level}
            </span>
          </div>
        </div>

        {/* KPI 2: Total Respondents */}
        <div className="bg-gradient-to-br from-slate-800/90 via-slate-800/60 to-slate-900 border border-slate-700 rounded-3xl p-6 shadow-xl relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold flex items-center space-x-1.5">
                <Users className="w-3.5 h-3.5 text-indigo-400" />
                <span>จำนวนผู้เข้าร่วมตอบทั้งหมด</span>
              </span>
              <div className="flex items-baseline space-x-2 mt-2">
                <span className="text-5xl md:text-6xl font-black text-indigo-400 tracking-tight font-mono">
                  {stats.totalResponses}
                </span>
                <span className="text-slate-400 text-sm font-medium">คน</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 flex items-center justify-center text-2xl shadow-inner">
              👥
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs text-slate-400">
            <span>สถานะระบบ:</span>
            <span className="text-emerald-400 font-semibold flex items-center">
              <span className="w-2 h-2 rounded-full bg-emerald-400 mr-1.5 animate-pulse"></span>
              เชื่อมต่อและพร้อมรับข้อมูลสด
            </span>
          </div>
        </div>

        {/* KPI 3: Likert Benchmark Guide */}
        <div className="bg-gradient-to-br from-slate-800/90 via-slate-800/60 to-slate-900 border border-slate-700 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold flex items-center space-x-1.5">
              <Award className="w-3.5 h-3.5 text-teal-400" />
              <span>เกณฑ์มาตรฐาน Likert Scale</span>
            </span>
            <span className="text-[10px] bg-slate-700/60 text-slate-300 px-2 py-0.5 rounded-full font-mono">
              5 ระดับ
            </span>
          </div>

          <div className="space-y-1.5 my-2 text-xs">
            <div className="flex justify-between items-center text-emerald-400 font-medium">
              <span>4.50 – 5.00: มากที่สุด (ดีเยี่ยม)</span>
              <span>★★★★★</span>
            </div>
            <div className="flex justify-between items-center text-teal-400">
              <span>3.50 – 4.49: มาก (ดี)</span>
              <span>★★★★</span>
            </div>
            <div className="flex justify-between items-center text-amber-400">
              <span>2.50 – 3.49: ปานกลาง (พอใช้)</span>
              <span>★★★</span>
            </div>
            <div className="flex justify-between items-center text-orange-400">
              <span>1.50 – 2.49: น้อย (ควรปรับปรุง)</span>
              <span>★★</span>
            </div>
            <div className="flex justify-between items-center text-rose-400">
              <span>1.00 – 1.49: น้อยที่สุด (เร่งด่วน)</span>
              <span>★</span>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-700/60 flex items-center justify-between">
            <span>การตีความผลทางสถิติ</span>
            <span className="text-indigo-400 font-medium">คำนวณอัตโนมัติ</span>
          </div>
        </div>

      </div>

      {/* Main Grid: Bar Charts & Comments */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left (2 Cols): Question Breakdown Charts (Circular Donut & Bar toggle) */}
        <div className="lg:col-span-2 bg-slate-800/70 border border-slate-700 rounded-3xl p-6 shadow-xl space-y-5">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <div className="flex items-center space-x-2">
                {chartType === 'donut' ? (
                  <PieChart className="w-5 h-5 text-indigo-400" />
                ) : (
                  <BarChart3 className="w-5 h-5 text-indigo-400" />
                )}
                <h2 className="text-lg font-bold text-white">ผลคะแนนเฉลี่ยรายข้อ (1.00 – 5.00)</h2>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                ประเมินความพึงพอใจครอบคลุมเนื้อหา วิทยากร สื่อ สถานที่ และการนำไปใช้
              </p>
            </div>

            {/* View Switcher: Donut vs Bar */}
            <div className="flex items-center space-x-2">
              <div className="bg-slate-900/90 p-1 rounded-2xl border border-slate-700/80 flex items-center space-x-1">
                <button
                  type="button"
                  onClick={() => setChartType('donut')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition ${
                    chartType === 'donut'
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="แสดงผลแบบกราฟวงกลม"
                >
                  <PieChart className="w-3.5 h-3.5" />
                  <span>กราฟวงกลม</span>
                </button>
                <button
                  type="button"
                  onClick={() => setChartType('bar')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition ${
                    chartType === 'bar'
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="แสดงผลแบบกราฟแท่ง"
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>กราฟแท่ง</span>
                </button>
              </div>

              <span className="text-xs px-3 py-1.5 bg-slate-700/80 text-slate-200 rounded-xl font-medium hidden sm:inline-block">
                คะแนนเต็ม 5.00
              </span>
            </div>
          </div>

          {stats.totalResponses === 0 ? (
            <div className="text-center py-16 text-slate-400 space-y-3 bg-slate-900/40 rounded-2xl border border-slate-750">
              <div className="w-14 h-14 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto text-2xl">
                📋
              </div>
              <h3 className="font-bold text-slate-200">ยังไม่มีผู้ตอบแบบสอบถาม</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                เปิด QR Code ขึ้นจอให้ผู้เข้าอบรมสแกน หรือคลิกปุ่มด้านล่างเพื่อสุ่มข้อมูลจำลองสำหรับการทดสอบ
              </p>
              <div className="pt-2 flex justify-center space-x-3">
                <button
                  onClick={() => seedSampleResponses(8)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>สุ่มข้อมูลทดสอบ (8 รายการ)</span>
                </button>
                <button
                  onClick={onGoToSurvey}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl text-xs font-medium transition"
                >
                  ลองทำแบบประเมินเอง
                </button>
              </div>
            </div>
          ) : chartType === 'donut' ? (
            /* CIRCULAR GRAPH VIEW (DONUT & PIE CHARTS) */
            <div className="space-y-4">
              {stats.questionStats.map((q, idx) => {
                // Circular Gauge calculation
                const radius = 38;
                const circumference = 2 * Math.PI * radius; // ~238.76
                const percentage = (q.average / 5.0) * 100;
                const strokeDashoffset = circumference - (percentage / 100) * circumference;

                // Color based on average score
                let strokeColor = '#10b981'; // emerald
                if (q.average < 2.5) strokeColor = '#f43f5e'; // rose
                else if (q.average < 3.5) strokeColor = '#f59e0b'; // amber
                else if (q.average < 4.5) strokeColor = '#14b8a6'; // teal

                // Multi-segment Donut Chart calculation for 1-5 stars
                const totalVotes = q.count || 1;
                const starConfigs = [
                  { star: 5, label: 'มากที่สุด', count: q.distribution[5] || 0, color: '#10b981', textColor: 'text-emerald-400' },
                  { star: 4, label: 'มาก', count: q.distribution[4] || 0, color: '#14b8a6', textColor: 'text-teal-400' },
                  { star: 3, label: 'ปานกลาง', count: q.distribution[3] || 0, color: '#f59e0b', textColor: 'text-amber-400' },
                  { star: 2, label: 'น้อย', count: q.distribution[2] || 0, color: '#f97316', textColor: 'text-orange-400' },
                  { star: 1, label: 'น้อยที่สุด', count: q.distribution[1] || 0, color: '#f43f5e', textColor: 'text-rose-400' },
                ];

                const donutRadius = 34;
                const donutCircumference = 2 * Math.PI * donutRadius; // ~213.63
                let accumulatedLength = 0;

                const donutSegments = starConfigs.map(s => {
                  const ratio = q.count > 0 ? s.count / totalVotes : 0;
                  const strokeLength = ratio * donutCircumference;
                  const dashArray = `${strokeLength} ${donutCircumference - strokeLength}`;
                  const dashOffset = -accumulatedLength;
                  accumulatedLength += strokeLength;
                  const pct = q.count > 0 ? Math.round(ratio * 100) : 0;
                  return { ...s, dashArray, dashOffset, pct };
                });

                return (
                  <div
                    key={q.questionId}
                    className="bg-slate-900/75 p-5 rounded-2xl border border-slate-700/80 transition-all hover:border-slate-600 shadow-md"
                  >
                    {/* Header */}
                    <div className="flex flex-wrap justify-between items-start gap-2 mb-4">
                      <div className="flex items-start space-x-3 max-w-xl">
                        <span className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-300 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <div>
                          <h3 className="font-semibold text-slate-100 text-sm md:text-base leading-snug">
                            {q.title}
                          </h3>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${q.interpretation.badgeBg} ${q.interpretation.badgeText}`}>
                          {q.interpretation.level}
                        </span>
                        <div className="flex items-baseline space-x-1 font-mono">
                          <span className="text-xl font-black text-white">
                            {q.average.toFixed(2)}
                          </span>
                          <span className="text-xs text-slate-400">/ 5.0</span>
                        </div>
                      </div>
                    </div>

                    {/* Circular Charts Body: Score Gauge + Rating Distribution Donut */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center pt-2 border-t border-slate-800">

                      {/* Circle 1: Score Gauge (มาตรวัดวงกลมคะแนนเฉลี่ย) */}
                      <div className="md:col-span-4 flex items-center space-x-3.5 bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80">
                        <div className="relative w-24 h-24 flex-shrink-0">
                          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                            {/* Background track */}
                            <circle
                              cx="50"
                              cy="50"
                              r={radius}
                              fill="transparent"
                              stroke="#1e293b"
                              strokeWidth="8"
                            />
                            {/* Animated Progress Ring */}
                            <circle
                              cx="50"
                              cy="50"
                              r={radius}
                              fill="transparent"
                              stroke={strokeColor}
                              strokeWidth="8"
                              strokeDasharray={circumference}
                              strokeDashoffset={strokeDashoffset}
                              strokeLinecap="round"
                              className="transition-all duration-1000 ease-out"
                            />
                          </svg>

                          {/* Center Score */}
                          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                            <span className="text-xl font-black text-white font-mono leading-none">
                              {q.average.toFixed(2)}
                            </span>
                            <span className="text-[10px] text-slate-400 font-medium mt-0.5">
                              / 5.00
                            </span>
                          </div>
                        </div>

                        <div>
                          <span className="text-xs text-slate-400 font-medium block">มาตรวัดความพึงพอใจ</span>
                          <div className="text-base font-extrabold text-white mt-0.5">
                            {percentage.toFixed(1)}%
                          </div>
                          <span className={`text-[11px] font-semibold mt-1 inline-block ${q.interpretation.colorClass}`}>
                            {q.interpretation.description}
                          </span>
                        </div>
                      </div>

                      {/* Circle 2: Star Distribution Donut (กราฟวงกลมสัดส่วนคะแนน 1-5 ดาว) */}
                      <div className="md:col-span-8 flex flex-col sm:flex-row items-center gap-4 bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80">

                        {/* Multi-segment Donut SVG */}
                        <div className="relative w-24 h-24 flex-shrink-0">
                          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                            {/* Base circle */}
                            <circle
                              cx="50"
                              cy="50"
                              r={donutRadius}
                              fill="transparent"
                              stroke="#1e293b"
                              strokeWidth="10"
                            />
                            {/* Slices for each star */}
                            {donutSegments.map(s => (
                              <circle
                                key={s.star}
                                cx="50"
                                cy="50"
                                r={donutRadius}
                                fill="transparent"
                                stroke={s.color}
                                strokeWidth="10"
                                strokeDasharray={s.dashArray}
                                strokeDashoffset={s.dashOffset}
                                className="transition-all duration-700 ease-out"
                              />
                            ))}
                          </svg>

                          {/* Center Text */}
                          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                            <span className="text-sm font-black text-white font-mono leading-none">
                              {q.count}
                            </span>
                            <span className="text-[10px] text-slate-400 mt-0.5">
                              คนตอบ
                            </span>
                          </div>
                        </div>

                        {/* Legend & Count Breakdown */}
                        <div className="flex-1 w-full grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
                          {donutSegments.map(s => (
                            <div
                              key={s.star}
                              className="flex items-center space-x-1.5 bg-slate-900/90 px-2 py-1 rounded-xl border border-slate-800"
                            >
                              <span
                                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                                style={{ backgroundColor: s.color }}
                              />
                              <div className="truncate">
                                <span className="font-bold text-slate-300">{s.star}⭐</span>
                                <span className="text-slate-400 text-[10px] ml-1">
                                  {s.count} คน ({s.pct}%)
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>

                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* LINEAR BAR CHART VIEW */
            <div className="space-y-4">
              {stats.questionStats.map((q, idx) => {
                const percentage = (q.average / 5.0) * 100;

                let gradientClass = 'from-emerald-500 to-teal-400';
                if (q.average < 2.5) gradientClass = 'from-rose-500 to-red-500';
                else if (q.average < 3.5) gradientClass = 'from-amber-500 to-yellow-400';
                else if (q.average < 4.5) gradientClass = 'from-teal-500 to-emerald-400';

                return (
                  <div
                    key={q.questionId}
                    className="bg-slate-900/70 p-4 md:p-5 rounded-2xl border border-slate-700/80 transition-all hover:border-slate-600 shadow-md"
                  >
                    <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
                      <div className="flex items-start space-x-3 max-w-xl">
                        <span className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-300 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <div>
                          <h3 className="font-semibold text-slate-100 text-sm leading-snug">
                            {q.title}
                          </h3>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${q.interpretation.badgeBg} ${q.interpretation.badgeText}`}>
                          {q.interpretation.level}
                        </span>
                        <div className="flex items-baseline space-x-1 font-mono">
                          <span className="text-lg md:text-xl font-black text-white">
                            {q.average.toFixed(2)}
                          </span>
                          <span className="text-xs text-slate-400">/ 5.0</span>
                        </div>
                      </div>
                    </div>

                    <div className="w-full bg-slate-800 h-4 rounded-full overflow-hidden p-0.5 flex items-center my-2 shadow-inner">
                      <div
                        className={`bg-gradient-to-r ${gradientClass} h-full rounded-full transition-all duration-700 shadow-sm`}
                        style={{ width: `${Math.max(percentage, 4)}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                      <span>การกระจายคะแนน ({q.count} คน):</span>
                      <div className="flex space-x-2 sm:space-x-4">
                        <span>1⭐ <strong className="text-slate-300 font-mono">{q.distribution[1]}</strong></span>
                        <span>2⭐ <strong className="text-slate-300 font-mono">{q.distribution[2]}</strong></span>
                        <span>3⭐ <strong className="text-slate-300 font-mono">{q.distribution[3]}</strong></span>
                        <span>4⭐ <strong className="text-slate-300 font-mono">{q.distribution[4]}</strong></span>
                        <span>5⭐ <strong className="text-emerald-400 font-bold font-mono">{q.distribution[5]}</strong></span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right (1 Col): Live Comments & QR Code Box */}
        <div className="space-y-6">

          {/* Embedded Mini QR Card */}
          <div className="bg-gradient-to-br from-indigo-950/40 via-slate-800/80 to-slate-900 border border-indigo-500/30 rounded-3xl p-5 text-center shadow-xl">
            <h3 className="text-sm font-bold text-white mb-1 flex items-center justify-center space-x-1.5">
              <QrCode className="w-4 h-4 text-indigo-400" />
              <span>สแกนทำแบบประเมิน</span>
            </h3>
            <p className="text-xs text-slate-400 mb-3">
              ใช้กล้องสมาร์ทโฟนสแกนเพื่อเริ่มตอบได้ทันที
            </p>

            {qrMiniDataUrl && (
              <div className="bg-white p-3 rounded-2xl inline-block shadow-lg mx-auto border-2 border-indigo-500/20">
                <img src={qrMiniDataUrl} alt="Scan Survey QR" className="w-36 h-36 rounded-lg" />
              </div>
            )}

            <div className="mt-3">
              <button
                onClick={onOpenQR}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold underline inline-flex items-center space-x-1"
              >
                <span>ขยาย QR Code ขึ้นจอโปรเจกเตอร์</span>
                <span>↗</span>
              </button>
            </div>
          </div>

          {/* Latest Comments Stream */}
          <div className="bg-slate-800/70 border border-slate-700 rounded-3xl p-6 shadow-xl flex flex-col h-[480px]">
            <div className="flex items-center justify-between mb-4 flex-shrink-0">
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-4 h-4 text-teal-400" />
                <h3 className="text-sm font-bold text-white">ข้อเสนอแนะล่าสุด</h3>
              </div>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-700 text-slate-300 font-mono">
                {stats.latestComments.length} ข้อความ
              </span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {stats.latestComments.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-500 text-xs text-center p-6">
                  <MessageSquare className="w-8 h-8 text-slate-600 mb-2" />
                  <span>ยังไม่มีข้อเสนอแนะเพิ่มเติม</span>
                  <span className="text-[10px] text-slate-600 mt-1">
                    เมื่อผู้เข้าร่วมพิมพ์ความเห็น จะปรากฏที่นี่แบบเรียลไทม์
                  </span>
                </div>
              ) : (
                stats.latestComments.map((comment) => {
                  const date = new Date(comment.createdAt);
                  const timeStr = date.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });

                  return (
                    <div
                      key={comment.id}
                      className="bg-slate-900/80 border border-slate-750 rounded-2xl p-3.5 text-xs text-slate-200 transition hover:border-slate-600 shadow-sm"
                    >
                      <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
                        <span className="font-semibold text-indigo-400 flex items-center space-x-1">
                          <span>ผู้เข้าอบรม</span>
                          <span className="text-amber-400 font-mono">★ {comment.overallRating}</span>
                        </span>
                        <span className="flex items-center text-slate-500">
                          <Clock className="w-3 h-3 mr-1" />
                          {timeStr} น.
                        </span>
                      </div>
                      <p className="leading-relaxed text-slate-300">
                        &ldquo;{comment.text}&rdquo;
                      </p>
                    </div>
                  );
                })
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
