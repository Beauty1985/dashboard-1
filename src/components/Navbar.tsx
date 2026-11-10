import React from 'react';
import { LayoutDashboard, Smartphone, QrCode, Download, Settings, BookOpen, Sparkles, Trash2 } from 'lucide-react';
import { exportToCSV, seedSampleResponses, clearAllSubmissions } from '../services/storage';
import { FeedbackSubmission } from '../types/feedback';

interface NavbarProps {
  currentTab: 'survey' | 'dashboard';
  setCurrentTab: (tab: 'survey' | 'dashboard') => void;
  submissions: FeedbackSubmission[];
  onOpenQR: () => void;
  onOpenFirebaseConfig: () => void;
  onOpenCodeGuide: () => void;
  hasFirebase: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  submissions,
  onOpenQR,
  onOpenFirebaseConfig,
  onOpenCodeGuide,
  hasFirebase
}) => {
  const handleSeed = () => {
    seedSampleResponses(5);
  };

  const handleClear = () => {
    if (confirm('ต้องการล้างข้อมูลคำตอบทั้งหมดในระบบหรือไม่?')) {
      clearAllSubmissions();
    }
  };

  const handleExport = () => {
    exportToCSV(submissions);
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 border-b border-slate-800 backdrop-blur-md text-white transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">

        {/* Logo and App Title */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-xl shadow-lg shadow-indigo-600/30">
            📊
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-base md:text-lg tracking-tight">Live Feedback &amp; Dashboard</span>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1 animate-pulse"></span>
                {hasFirebase ? 'FIREBASE RTDB' : 'REALTIME SYNC'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              ระบบประเมินความพึงพอใจการอบรมสด แปลผลสถิติทันทีที่มีคนส่ง
            </p>
          </div>
        </div>

        {/* View Mode Switcher (Pill style toggle) */}
        <div className="flex items-center bg-slate-800/90 p-1 rounded-2xl border border-slate-700/80">
          <button
            onClick={() => setCurrentTab('survey')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all ${
              currentTab === 'survey'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>หน้าตอบ (มือถือ)</span>
          </button>

          <button
            onClick={() => setCurrentTab('dashboard')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all ${
              currentTab === 'dashboard'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>หน้า Dashboard (จอใหญ่)</span>
            {submissions.length > 0 && (
              <span className="ml-1 px-1.5 py-0.2 bg-indigo-500/80 rounded-full text-[10px]">
                {submissions.length}
              </span>
            )}
          </button>
        </div>

        {/* Right Tools & Actions */}
        <div className="flex items-center space-x-1.5 md:space-x-2">

          {/* QR Code button */}
          <button
            onClick={onOpenQR}
            className="p-2 md:px-3 md:py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-medium flex items-center space-x-1.5 transition"
            title="เปิด QR Code ขึ้นจอ"
          >
            <QrCode className="w-4 h-4 text-indigo-400" />
            <span className="hidden md:inline">QR Code</span>
          </button>

          {/* CSV Download */}
          <button
            onClick={handleExport}
            className="p-2 md:px-3 md:py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-medium flex items-center space-x-1.5 transition"
            title="ดาวน์โหลดข้อมูลเป็นไฟล์ CSV (รองรับ Excel ภาษาไทย)"
          >
            <Download className="w-4 h-4 text-teal-400" />
            <span className="hidden md:inline">ดาวน์โหลด CSV</span>
          </button>

          {/* Seed demo data */}
          <button
            onClick={handleSeed}
            className="p-2 md:px-2.5 md:py-2 bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/60 rounded-xl text-xs transition"
            title="จำลองคำตอบทดสอบ 5 รายการ"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
          </button>

          {/* Clear data */}
          {submissions.length > 0 && (
            <button
              onClick={handleClear}
              className="p-2 bg-slate-800/80 hover:bg-rose-950/60 hover:text-rose-300 text-slate-400 border border-slate-700/60 rounded-xl text-xs transition"
              title="ล้างข้อมูลทั้งหมด"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}

          {/* Standalone Code & Guide */}
          <button
            onClick={onOpenCodeGuide}
            className="px-3 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-md shadow-violet-900/40 transition"
          >
            <BookOpen className="w-4 h-4" />
            <span className="hidden sm:inline">โค้ด 2 ไฟล์ &amp; ติดตั้ง</span>
            <span className="sm:hidden">โค้ด 2 ไฟล์</span>
          </button>

          {/* Firebase Settings */}
          <button
            onClick={onOpenFirebaseConfig}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 rounded-xl text-xs transition"
            title="ตั้งค่า Firebase Realtime Database"
          >
            <Settings className="w-4 h-4" />
          </button>

        </div>

      </div>
    </header>
  );
};
