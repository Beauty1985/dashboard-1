/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { SurveyView } from './components/SurveyView';
import { DashboardView } from './components/DashboardView';
import { QRCodeModal } from './components/QRCodeModal';
import { FirebaseConfigModal } from './components/FirebaseConfigModal';
import { StandaloneCodeGuideModal } from './components/StandaloneCodeGuideModal';
import {
  subscribeToFeedbackUpdates,
  calculateOverallStats,
  getSavedFirebaseConfig,
  getLocalSubmissions,
  seedSampleResponses
} from './services/storage';
import { FeedbackSubmission } from './types/feedback';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'survey' | 'dashboard'>('dashboard');
  const [submissions, setSubmissions] = useState<FeedbackSubmission[]>([]);
  const [isQrOpen, setIsQrOpen] = useState(false);
  const [isFirebaseModalOpen, setIsFirebaseModalOpen] = useState(false);
  const [isCodeGuideOpen, setIsCodeGuideOpen] = useState(false);
  const [hasFirebase, setHasFirebase] = useState(false);

  // Initialize and listen to hash or query parameter
  useEffect(() => {
    const handleUrlState = () => {
      const hash = window.location.hash.toLowerCase();
      const params = new URLSearchParams(window.location.search);
      const mode = params.get('mode');

      if (hash === '#survey' || mode === 'survey') {
        setCurrentTab('survey');
      } else if (hash === '#dashboard' || mode === 'dashboard') {
        setCurrentTab('dashboard');
      }
    };

    handleUrlState();
    window.addEventListener('hashchange', handleUrlState);

    // Initial check for Firebase config
    const conf = getSavedFirebaseConfig();
    setHasFirebase(Boolean(conf?.databaseURL));

    // Seed initial demo data on first visit if storage is totally empty
    const existing = getLocalSubmissions();
    if (existing.length === 0) {
      seedSampleResponses(6);
    }

    return () => window.removeEventListener('hashchange', handleUrlState);
  }, []);

  // Sync tab change with URL hash
  const handleTabChange = (tab: 'survey' | 'dashboard') => {
    setCurrentTab(tab);
    window.location.hash = tab;
  };

  // Subscribe to real-time feedback updates
  useEffect(() => {
    const unsubscribe = subscribeToFeedbackUpdates((newSubmissions) => {
      setSubmissions(newSubmissions);
    });

    return () => unsubscribe();
  }, []);

  const handleConfigSaved = () => {
    const conf = getSavedFirebaseConfig();
    setHasFirebase(Boolean(conf?.databaseURL));
  };

  // Calculate statistics in real-time
  const stats = useMemo(() => calculateOverallStats(submissions), [submissions]);

  // Construct survey URL for QR Code and sharing
  const surveyUrl = useMemo(() => {
    if (typeof window === 'undefined') return '';
    const base = window.location.origin + window.location.pathname;
    return `${base}#survey`;
  }, []);

  return (
    <div className={`min-h-screen ${currentTab === 'dashboard' ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'} antialiased flex flex-col transition-colors duration-300`}>

      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={handleTabChange}
        submissions={submissions}
        onOpenQR={() => setIsQrOpen(true)}
        onOpenFirebaseConfig={() => setIsFirebaseModalOpen(true)}
        onOpenCodeGuide={() => setIsCodeGuideOpen(true)}
        hasFirebase={hasFirebase}
      />

      {/* View Content */}
      <main className="flex-1">
        {currentTab === 'survey' ? (
          <SurveyView onGoToDashboard={() => handleTabChange('dashboard')} />
        ) : (
          <DashboardView
            stats={stats}
            submissions={submissions}
            surveyUrl={surveyUrl}
            onOpenQR={() => setIsQrOpen(true)}
            onGoToSurvey={() => handleTabChange('survey')}
          />
        )}
      </main>

      {/* Footer */}
      <footer className={`py-4 px-6 border-t text-center text-xs ${
        currentTab === 'dashboard'
          ? 'bg-slate-950/80 border-slate-800 text-slate-500'
          : 'bg-white border-slate-200 text-slate-500'
      }`}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>ระบบประเมินความพึงพอใจการอบรมสด (Live Training Feedback System)</span>
          <div className="flex items-center space-x-3 text-[11px]">
            <button
              onClick={() => setIsCodeGuideOpen(true)}
              className="hover:underline text-indigo-400 font-medium"
            >
              ดูโค้ด survey.html &amp; dashboard.html
            </button>
            <span>•</span>
            <button
              onClick={() => setIsFirebaseModalOpen(true)}
              className="hover:underline text-slate-400"
            >
              ตั้งค่า Firebase RTDB
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <QRCodeModal
        isOpen={isQrOpen}
        onClose={() => setIsQrOpen(false)}
        surveyUrl={surveyUrl}
      />

      <FirebaseConfigModal
        isOpen={isFirebaseModalOpen}
        onClose={() => setIsFirebaseModalOpen(false)}
        onConfigSaved={handleConfigSaved}
      />

      <StandaloneCodeGuideModal
        isOpen={isCodeGuideOpen}
        onClose={() => setIsCodeGuideOpen(false)}
      />

    </div>
  );
}
