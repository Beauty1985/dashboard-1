import React, { useState } from 'react';
import { X, Database, Check, AlertCircle, HelpCircle } from 'lucide-react';
import { FirebaseCustomConfig } from '../types/feedback';
import { getSavedFirebaseConfig, saveFirebaseConfig } from '../services/storage';

interface FirebaseConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigSaved: () => void;
}

export const FirebaseConfigModal: React.FC<FirebaseConfigModalProps> = ({
  isOpen,
  onClose,
  onConfigSaved
}) => {
  const current = getSavedFirebaseConfig() || {};
  const [dbUrl, setDbUrl] = useState(current.databaseURL || '');
  const [apiKey, setApiKey] = useState(current.apiKey || '');
  const [projectId, setProjectId] = useState(current.projectId || '');
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dbUrl.trim()) {
      saveFirebaseConfig(null);
    } else {
      const config: FirebaseCustomConfig = {
        databaseURL: dbUrl.trim(),
        apiKey: apiKey.trim() || undefined,
        projectId: projectId.trim() || undefined,
      };
      saveFirebaseConfig(config);
    }
    setIsSaved(true);
    onConfigSaved();
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1200);
  };

  const handleReset = () => {
    saveFirebaseConfig(null);
    setDbUrl('');
    setApiKey('');
    setProjectId('');
    onConfigSaved();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 md:p-8 text-white shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold">ตั้งค่า Firebase Realtime Database</h2>
            <p className="text-xs text-slate-400">เชื่อมต่อฐานข้อมูลคลาวด์จริงสำหรับใช้งานข้ามอุปกรณ์</p>
          </div>
        </div>

        <div className="bg-indigo-950/40 border border-indigo-500/20 rounded-2xl p-4 text-xs text-indigo-200 mb-5 leading-relaxed">
          <div className="flex items-start space-x-2">
            <HelpCircle className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
            <div>
              <strong>หมายเหตุ:</strong> ระบบมีตัวซิงค์แบบเรียลไทม์จำลอง (BroadcastChannel + LocalStorage) ให้พร้อมทดสอบได้ทันทีแม้ไม่ได้กรอก Firebase! หากต้องการใช้ข้ามอินเทอร์เน็ตจริง เพียงนำ Database URL จาก Firebase Console มาใส่ด้านล่าง
            </div>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4 text-sm">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Firebase Realtime Database URL <span className="text-rose-400">*</span>
            </label>
            <input
              type="url"
              value={dbUrl}
              onChange={(e) => setDbUrl(e.target.value)}
              placeholder="https://your-project-default-rtdb.firebaseio.com"
              className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-xs"
            />
            <span className="text-[11px] text-slate-400 mt-1 block">
              ดูได้จากเมนู <strong>Realtime Database</strong> บน Firebase Console
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Project ID (ถ้ามี)
              </label>
              <input
                type="text"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                placeholder="my-feedback-app"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                API Key (ถ้ามี)
              </label>
              <input
                type="text"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-xs"
              />
            </div>
          </div>

          <div className="pt-3 flex items-center justify-between">
            <button
              type="button"
              onClick={handleReset}
              className="text-xs text-rose-400 hover:text-rose-300 underline"
            >
              ล้างค่าและใช้โหมด Local Realtime
            </button>

            <button
              type="submit"
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold flex items-center space-x-2 transition shadow-lg shadow-indigo-600/30"
            >
              {isSaved ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>บันทึกสำเร็จ</span>
                </>
              ) : (
                <span>บันทึกการตั้งค่า</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
