import React, { useState } from 'react';
import { X, Copy, Check, Download, FileCode, BookOpen, Layers, ShieldCheck, Globe, ExternalLink } from 'lucide-react';

interface StandaloneCodeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StandaloneCodeGuideModal: React.FC<StandaloneCodeGuideModalProps> = ({
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'survey' | 'dashboard' | 'guide'>('guide');
  const [copiedSurvey, setCopiedSurvey] = useState(false);
  const [copiedDashboard, setCopiedDashboard] = useState(false);
  const [copiedRules, setCopiedRules] = useState(false);

  if (!isOpen) return null;

  const downloadFile = (filename: string, path: string) => {
    const link = document.createElement('a');
    link.href = path;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyToClipboard = async (text: string, setCopied: (v: boolean) => void) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const firebaseRulesJson = `{
  "rules": {
    "feedbacks": {
      ".read": true,
      ".write": true,
      ".indexOn": ["createdAt"]
    }
  }
}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-4xl w-full h-[90vh] flex flex-col text-slate-100 shadow-2xl relative overflow-hidden">

        {/* Modal Header */}
        <div className="p-5 md:px-7 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-xl shadow-lg shadow-indigo-600/30">
              📦
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-bold text-white">โค้ดแยก 2 ไฟล์ & คู่มือติดตั้ง Firebase</h2>
              <p className="text-xs text-slate-400">survey.html (หน้าตอบ) + dashboard.html (หน้าจอสรุป) พร้อมใช้งานฟรี</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 border-b border-slate-800 flex space-x-2 bg-slate-900/40">
          <button
            onClick={() => setActiveTab('guide')}
            className={`py-3.5 px-4 font-semibold text-xs md:text-sm flex items-center space-x-2 border-b-2 transition ${
              activeTab === 'guide'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>วิธีตั้งค่า Firebase & Deploy ทีละสเต็ป</span>
          </button>

          <button
            onClick={() => setActiveTab('survey')}
            className={`py-3.5 px-4 font-semibold text-xs md:text-sm flex items-center space-x-2 border-b-2 transition ${
              activeTab === 'survey'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileCode className="w-4 h-4" />
            <span>1. survey.html (หน้าตอบมือถือ)</span>
          </button>

          <button
            onClick={() => setActiveTab('dashboard')}
            className={`py-3.5 px-4 font-semibold text-xs md:text-sm flex items-center space-x-2 border-b-2 transition ${
              activeTab === 'dashboard'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileCode className="w-4 h-4" />
            <span>2. dashboard.html (จอโปรเจกเตอร์)</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-5 md:p-7 space-y-6">

          {/* TAB 1: GUIDE */}
          {activeTab === 'guide' && (
            <div className="space-y-6 max-w-3xl">

              {/* Intro Banner */}
              <div className="bg-gradient-to-r from-indigo-950/60 to-purple-950/40 border border-indigo-500/30 rounded-2xl p-5">
                <h3 className="text-base font-bold text-white mb-2 flex items-center space-x-2">
                  <span>💡</span>
                  <span>ทำไมถึงใช้ HTML + Firebase Realtime Database?</span>
                </h3>
                <p className="text-xs md:text-sm text-indigo-200/90 leading-relaxed">
                  สแต็กนี้เบาที่สุด ใช้งานฟรี 100% (Spark Plan ของ Firebase ให้โควตา Realtime Database ฟรี 1 GB Storage และ 10 GB/เดือน ซึ่งเพียงพอสำหรับการอบรมหลายร้อยครั้ง) โดยไม่ต้องตั้งค่า Backend Server เลย โค้ดแบ่งออกเป็น 2 ไฟล์อิสระ นำไปเปิดในเครื่องหรืออัปโหลดขึ้นเว็บได้ทันที
                </p>
              </div>

              {/* Step 1 */}
              <div className="bg-slate-850 bg-slate-800/40 border border-slate-700/80 rounded-2xl p-5 space-y-3">
                <div className="flex items-center space-x-3">
                  <span className="w-7 h-7 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">1</span>
                  <h4 className="font-bold text-white text-base">สร้างโปรเจกต์บน Firebase Console (ฟรี)</h4>
                </div>
                <div className="text-xs md:text-sm text-slate-300 space-y-2 pl-10">
                  <p>1. เข้าไปที่ <a href="https://console.firebase.google.com" target="_blank" rel="noreferrer" className="text-indigo-400 underline font-semibold inline-flex items-center">Firebase Console <ExternalLink className="w-3 h-3 ml-1" /></a> และล็อกอินด้วย Google Account</p>
                  <p>2. คลิก <strong>&quot;Add project&quot;</strong> (เพิ่มโปรเจกต์)</p>
                  <p>3. ตั้งชื่อโปรเจกต์ เช่น <code>training-feedback-app</code> จากนั้นกด Continue</p>
                  <p>4. ปิดการใช้งาน Google Analytics (เพื่อความง่ายและรวดเร็ว) แล้วคลิก <strong>Create Project</strong></p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="bg-slate-800/40 border border-slate-700/80 rounded-2xl p-5 space-y-3">
                <div className="flex items-center space-x-3">
                  <span className="w-7 h-7 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">2</span>
                  <h4 className="font-bold text-white text-base">เปิดใช้งาน Realtime Database</h4>
                </div>
                <div className="text-xs md:text-sm text-slate-300 space-y-2 pl-10">
                  <p>1. ในเมนูด้านซ้าย เลือก <strong>Build &gt; Realtime Database</strong></p>
                  <p>2. คลิกปุ่ม <strong>&quot;Create Database&quot;</strong></p>
                  <p>3. เลือกตำแหน่งเซิร์ฟเวอร์ (Realtime Database Location) แนะนำเลือก <code>Singapore (asia-southeast1)</code> หรือ <code>United States (us-central1)</code></p>
                  <p>4. ในขั้นตอน Security Rules ให้เลือก <strong>&quot;Start in test mode&quot;</strong> ไปก่อน แล้วกด <strong>Enable</strong></p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="bg-slate-800/40 border border-slate-700/80 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="w-7 h-7 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">3</span>
                    <h4 className="font-bold text-white text-base">ตั้งค่า Security Rules สำหรับแบบสอบถาม</h4>
                  </div>
                  <button
                    onClick={() => copyToClipboard(firebaseRulesJson, setCopiedRules)}
                    className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-xs text-white rounded-lg flex items-center space-x-1"
                  >
                    {copiedRules ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedRules ? 'คัดลอกแล้ว' : 'คัดลอก Rules'}</span>
                  </button>
                </div>
                <div className="text-xs md:text-sm text-slate-300 space-y-2 pl-10">
                  <p>เนื่องจากแบบสอบถามของผู้เข้าอบรม <strong>ไม่จำเป็นต้องล็อกอิน</strong> เราจะเปิดให้เขียนและอ่านที่พาธ <code>feedbacks</code> ได้:</p>
                  <p>ไปที่แท็บ <strong>Rules</strong> บนหน้า Realtime Database วางโค้ดนี้แล้วกด <strong>Publish</strong>:</p>
                  <pre className="p-3 bg-slate-950 rounded-xl text-emerald-400 font-mono text-xs overflow-x-auto border border-slate-800">
                    {firebaseRulesJson}
                  </pre>
                </div>
              </div>

              {/* Step 4 */}
              <div className="bg-slate-800/40 border border-slate-700/80 rounded-2xl p-5 space-y-3">
                <div className="flex items-center space-x-3">
                  <span className="w-7 h-7 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">4</span>
                  <h4 className="font-bold text-white text-base">นำ firebaseConfig มาวางในไฟล์ survey.html และ dashboard.html</h4>
                </div>
                <div className="text-xs md:text-sm text-slate-300 space-y-2 pl-10">
                  <p>1. ไปที่ <strong>Project Settings (รูปเฟือง) &gt; General</strong></p>
                  <p>2. เลื่อนลงมาที่หัวข้อ <strong>&quot;Your apps&quot;</strong> แล้วคลิกไอคอน Web (<strong>&lt;/&gt;</strong>)</p>
                  <p>3. ตั้งชื่อแอป เช่น <code>feedback-web</code> แล้วคลิก <strong>Register app</strong></p>
                  <p>4. คัดลอกค่าในอ็อบเจกต์ <code>const firebaseConfig = &#123; ... &#125;;</code></p>
                  <p>5. เปิดไฟล์ <code>survey.html</code> และ <code>dashboard.html</code> แล้วนำไปวางทับตัวแปร <code>firebaseConfig</code> ในแท็ก <code>&lt;script&gt;</code></p>
                </div>
              </div>

              {/* Step 5 */}
              <div className="bg-slate-800/40 border border-slate-700/80 rounded-2xl p-5 space-y-3">
                <div className="flex items-center space-x-3">
                  <span className="w-7 h-7 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">5</span>
                  <h4 className="font-bold text-white text-base">การ Deploy ขึ้นใช้งานจริง (ฟรี 100%)</h4>
                </div>
                <div className="text-xs md:text-sm text-slate-300 space-y-3 pl-10">
                  <div>
                    <h5 className="font-semibold text-indigo-300 mb-1">ตัวเลือก A: Firebase Hosting (แนะนำ)</h5>
                    <p className="text-slate-400 text-xs leading-relaxed">
                      ติดตั้ง Firebase CLI ด้วย <code>npm install -g firebase-tools</code> จากนั้นพิมพ์ <code>firebase login</code> และ <code>firebase init hosting</code> เลือกโฟลเดอร์ที่มีไฟล์ทั้ง 2 แล้วสั่ง <code>firebase deploy</code> จะได้ URL เว็บไซต์ เช่น <code>https://your-project.web.app/survey.html</code>
                    </p>
                  </div>
                  <div>
                    <h5 className="font-semibold text-indigo-300 mb-1">ตัวเลือก B: GitHub Pages หรือ Netlify Drag & Drop (ง่ายสุด ไม่ต้องพิมพ์คำสั่ง)</h5>
                    <p className="text-slate-400 text-xs leading-relaxed">
                      นำไฟล์ <code>survey.html</code> และ <code>dashboard.html</code> ไปลากใส่ใน <a href="https://app.netlify.com/drop" target="_blank" rel="noreferrer" className="text-teal-400 underline font-semibold">Netlify Drop</a> หรืออัปขึ้น GitHub แล้วเปิดใช้งาน GitHub Pages คุณจะได้ลิงก์พร้อมใช้งานภายใน 1 นาที
                    </p>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: survey.html */}
          {activeTab === 'survey' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <h3 className="text-base font-bold text-white">survey.html</h3>
                  <p className="text-xs text-slate-400">ไฟล์หน้าแบบประเมิน สเกล 1-5 บนมือถือ ป้องกันตอบซ้ำ และส่งลง Firebase Realtime Database</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => downloadFile('survey.html', '/standalone/survey.html')}
                    className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition shadow"
                  >
                    <Download className="w-4 h-4" />
                    <span>ดาวน์โหลด survey.html</span>
                  </button>
                  <a
                    href="/standalone/survey.html"
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-medium flex items-center space-x-1.5 transition"
                  >
                    <span>เปิดดูตัวอย่าง</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              <div className="relative">
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs font-mono text-slate-300 overflow-x-auto max-h-[460px]">
                  <p className="text-slate-500 mb-2">// ไฟล์นี้สามารถเปิดได้โดยตรง หรือนำไปโฮสต์บน Web Server ใดๆ</p>
                  <p className="text-slate-500 mb-4">// ดูโค้ดฉบับเต็มได้โดยคลิกปุ่ม &quot;ดาวน์โหลด survey.html&quot; ด้านบน</p>
                  <code className="text-indigo-300">
                    &lt;!DOCTYPE html&gt;<br />
                    &lt;html lang=&quot;th&quot;&gt;<br />
                    &lt;head&gt;<br />
                    &nbsp;&nbsp;&lt;meta charset=&quot;UTF-8&quot;&gt;<br />
                    &nbsp;&nbsp;&lt;meta name=&quot;viewport&quot; content=&quot;width=device-width, initial-scale=1.0&quot;&gt;<br />
                    &nbsp;&nbsp;&lt;title&gt;แบบประเมินความพึงพอใจการอบรม&lt;/title&gt;<br />
                    &nbsp;&nbsp;&lt;!-- Tailwind CSS CDN &amp; Firebase SDK --&gt;<br />
                    &nbsp;&nbsp;&lt;script src=&quot;https://cdn.tailwindcss.com&quot;&gt;&lt;/script&gt;<br />
                    &nbsp;&nbsp;&lt;script src=&quot;https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js&quot;&gt;&lt;/script&gt;<br />
                    &nbsp;&nbsp;&lt;script src=&quot;https://www.gstatic.com/firebasejs/9.23.0/firebase-database-compat.js&quot;&gt;&lt;/script&gt;<br />
                    &lt;/head&gt;<br />
                    &lt;body class=&quot;bg-slate-50 min-h-screen text-slate-800&quot;&gt;<br />
                    &nbsp;&nbsp;&lt;!-- Form 5 ข้อ สเกล 1-5 พร้อมปุ่มใหญ่สำหรับมือถือ --&gt;<br />
                    &nbsp;&nbsp;...<br />
                    &lt;/body&gt;<br />
                    &lt;/html&gt;
                  </code>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: dashboard.html */}
          {activeTab === 'dashboard' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <h3 className="text-base font-bold text-white">dashboard.html</h3>
                  <p className="text-xs text-slate-400">ไฟล์หน้าแดชบอร์ดจอภาพโปรเจกเตอร์ แสดงผลแบบ Realtime ทันทีที่มีคนส่งคะแนนเข้ามา</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => downloadFile('dashboard.html', '/standalone/dashboard.html')}
                    className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition shadow"
                  >
                    <Download className="w-4 h-4" />
                    <span>ดาวน์โหลด dashboard.html</span>
                  </button>
                  <a
                    href="/standalone/dashboard.html"
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-medium flex items-center space-x-1.5 transition"
                  >
                    <span>เปิดดูตัวอย่าง</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              <div className="relative">
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs font-mono text-slate-300 overflow-x-auto max-h-[460px]">
                  <p className="text-slate-500 mb-2">// ไฟล์นี้เหมาะสำหรับเปิดขึ้นจอโปรเจกเตอร์ในห้องสัมมนา</p>
                  <p className="text-slate-500 mb-4">// ดูโค้ดฉบับเต็มได้โดยคลิกปุ่ม &quot;ดาวน์โหลด dashboard.html&quot; ด้านบน</p>
                  <code className="text-indigo-300">
                    &lt;!DOCTYPE html&gt;<br />
                    &lt;html lang=&quot;th&quot;&gt;<br />
                    &lt;head&gt;<br />
                    &nbsp;&nbsp;&lt;meta charset=&quot;UTF-8&quot;&gt;<br />
                    &nbsp;&nbsp;&lt;meta name=&quot;viewport&quot; content=&quot;width=device-width, initial-scale=1.0&quot;&gt;<br />
                    &nbsp;&nbsp;&lt;title&gt;Live Training Feedback Dashboard&lt;/title&gt;<br />
                    &nbsp;&nbsp;&lt;!-- Tailwind CSS CDN &amp; QR Code Library &amp; Firebase SDK --&gt;<br />
                    &nbsp;&nbsp;&lt;script src=&quot;https://cdn.tailwindcss.com&quot;&gt;&lt;/script&gt;<br />
                    &nbsp;&nbsp;&lt;script src=&quot;https://cdn.jsdelivr.net/npm/qrcode@1.5.3/build/qrcode.min.js&quot;&gt;&lt;/script&gt;<br />
                    &nbsp;&nbsp;&lt;script src=&quot;https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js&quot;&gt;&lt;/script&gt;<br />
                    &nbsp;&nbsp;&lt;script src=&quot;https://www.gstatic.com/firebasejs/9.23.0/firebase-database-compat.js&quot;&gt;&lt;/script&gt;<br />
                    &lt;/head&gt;<br />
                    &lt;body class=&quot;bg-slate-900 text-slate-100 min-h-screen&quot;&gt;<br />
                    &nbsp;&nbsp;&lt;!-- KPI Summary + กราฟแท่งรายข้อ + สตรีมข้อคิดเห็นสด + QR Code --&gt;<br />
                    &nbsp;&nbsp;...<br />
                    &lt;/body&gt;<br />
                    &lt;/html&gt;
                  </code>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 px-6 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between text-xs text-slate-400">
          <span>✨ ทั้ง 2 ไฟล์เป็น Standalone HTML ทำงานได้สมบูรณ์โดยไม่ต้องคอมไพล์</span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition"
          >
            ปิดหน้าต่าง
          </button>
        </div>

      </div>
    </div>
  );
};
