import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { X, Copy, Check, ExternalLink, QrCode } from 'lucide-react';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  surveyUrl: string;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({ isOpen, onClose, surveyUrl }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen && canvasRef.current && surveyUrl) {
      QRCode.toCanvas(canvasRef.current, surveyUrl, {
        width: 320,
        margin: 2,
        color: {
          dark: '#0f172a',
          light: '#ffffff',
        },
      }, (error) => {
        if (error) console.error('Error generating QR Code', error);
      });
    }
  }, [isOpen, surveyUrl]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(surveyUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-lg w-full p-6 md:p-8 text-center shadow-2xl relative text-white">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition"
          aria-label="ปิดหน้าต่าง"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 mb-3">
          <QrCode className="w-3.5 h-3.5" />
          <span>PROJECTOR SCAN MODE</span>
        </div>

        <h2 className="text-2xl font-extrabold text-white mb-2">
          สแกนทำแบบประเมินความพึงพอใจ
        </h2>
        <p className="text-sm text-slate-300 mb-6 max-w-sm mx-auto">
          เปิดกล้องบนมือถือส่องที่ QR Code เพื่อเข้าสู่หน้าตอบแบบประเมินได้ทันทีโดยไม่ต้องดาวน์โหลดแอป
        </p>

        {/* QR Canvas */}
        <div className="bg-white p-5 rounded-3xl inline-block shadow-2xl mx-auto mb-5 border-4 border-indigo-500/30">
          <canvas ref={canvasRef} className="max-w-full h-auto rounded-xl" />
        </div>

        {/* URL Link Box */}
        <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700 flex items-center justify-between gap-2 mb-6 text-left">
          <div className="overflow-hidden">
            <span className="text-[11px] text-slate-400 block font-medium">ลิงก์แบบสอบถาม:</span>
            <span className="text-xs text-indigo-300 font-mono truncate block">{surveyUrl}</span>
          </div>
          <button
            onClick={handleCopy}
            className="flex-shrink-0 px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-xl text-xs font-medium flex items-center space-x-1.5 transition text-white"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">คัดลอกแล้ว</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-300" />
                <span>คัดลอกลิงก์</span>
              </>
            )}
          </button>
        </div>

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold transition shadow-lg shadow-indigo-600/30"
          >
            ปิดหน้าจอ QR Code
          </button>
          <a
            href={surveyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-medium flex items-center space-x-1.5 transition"
          >
            <span>เปิดทดลองในแท็บใหม่</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
};
