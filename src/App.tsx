/**
 * AI-Powered Mobile Platform for Democratizing Sports Talent Assessment
 * Complete Interactive Prototype
 */

import React, { useState, useEffect } from 'react';
import { TopNavigationBar } from './components/common/TopNavigationBar';
import { MobileFrame } from './components/mobile/MobileFrame';
import { AthleteHome } from './components/mobile/AthleteHome';
import { TestInstructionsModal } from './components/mobile/TestInstructionsModal';
import { TestRecordingScreen } from './components/mobile/TestRecordingScreen';
import { ProcessingScreen } from './components/mobile/ProcessingScreen';
import { ResultScreen } from './components/mobile/ResultScreen';
import { HistoryScreen } from './components/mobile/HistoryScreen';
import { SyncStatusScreen } from './components/mobile/SyncStatusScreen';
import { ProfileScreen } from './components/mobile/ProfileScreen';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { MonorepoViewer } from './components/common/MonorepoViewer';
import { OfflineStorageManager } from './services/offlineStorage';
import { FITNESS_TESTS, INITIAL_ATHLETES } from './services/mockData';
import {
  FitnessTest,
  AthleteProfile,
  TestSubmission,
  NetworkCondition,
} from './types';

export default function App() {
  // Main Navigation State
  const [currentTab, setCurrentTab] = useState<'mobile' | 'admin' | 'code'>('mobile');
  const [activeMobileNav, setActiveMobileNav] = useState<'home' | 'tests' | 'history' | 'sync' | 'profile'>('home');
  const [mobileScreen, setMobileScreen] = useState<'home' | 'instructions' | 'recording' | 'processing' | 'result'>('home');
  const [isPhoneFrame, setIsPhoneFrame] = useState(true);

  // Network Simulator State
  const [networkCondition, setNetworkCondition] = useState<NetworkCondition>(OfflineStorageManager.getNetworkCondition());
  const [isSyncing, setIsSyncing] = useState(false);

  // Athletes & Submissions Data State
  const [athletes, setAthletes] = useState<AthleteProfile[]>(INITIAL_ATHLETES);
  const [activeAthlete, setActiveAthlete] = useState<AthleteProfile>(INITIAL_ATHLETES[0]);
  const [submissions, setSubmissions] = useState<TestSubmission[]>(OfflineStorageManager.getSubmissions());
  const [selectedAdminAthlete, setSelectedAdminAthlete] = useState<AthleteProfile | null>(null);

  // Active Test Workflow State
  const [selectedTest, setSelectedTest] = useState<FitnessTest>(FITNESS_TESTS[0]);
  const [recordedResultPayload, setRecordedResultPayload] = useState<any>(null);

  // Sync state subscription
  useEffect(() => {
    const unsubscribe = OfflineStorageManager.subscribe(() => {
      setSubmissions(OfflineStorageManager.getSubmissions());
      setNetworkCondition(OfflineStorageManager.getNetworkCondition());
    });
    return unsubscribe;
  }, []);

  const pendingSyncCount = submissions.filter(
    s => s.syncStatus === 'pending' || s.syncStatus === 'retry' || s.syncStatus === 'failed'
  ).length;

  const handleNetworkChange = (newCondition: NetworkCondition) => {
    OfflineStorageManager.setNetworkCondition(newCondition);
    setNetworkCondition(newCondition);
  };

  // Mobile Test Flow
  const handleSelectTest = (test: FitnessTest) => {
    setSelectedTest(test);
    setMobileScreen('instructions');
  };

  const handleStartRecording = () => {
    setMobileScreen('recording');
  };

  const handleRecordingComplete = (payload: any) => {
    setRecordedResultPayload(payload);
    setMobileScreen('processing');
  };

  const handleProcessingFinished = () => {
    setMobileScreen('result');
  };

  const handleSaveAndReturn = () => {
    if (!recordedResultPayload) return;

    const newSubmission: TestSubmission = {
      id: `sub_${Date.now()}`,
      athleteId: activeAthlete.id,
      athleteName: activeAthlete.fullName,
      testId: selectedTest.id,
      testName: selectedTest.name,
      recordedAt: new Date().toISOString(),
      durationSeconds: recordedResultPayload.durationSeconds || selectedTest.durationSeconds,
      status: recordedResultPayload.authenticityReport?.isAuthentic ? 'verified' : 'needs_review',
      authenticityStatus: recordedResultPayload.authenticityReport?.isAuthentic ? 'authentic' : 'suspicious',
      authenticityConfidence: recordedResultPayload.authenticityReport?.confidence || 0.92,
      aiConfidence: recordedResultPayload.aiConfidence || 0.94,
      primaryScore: recordedResultPayload.primaryScore,
      primaryUnit: recordedResultPayload.primaryUnit,
      validReps: recordedResultPayload.validReps || 0,
      invalidReps: recordedResultPayload.invalidReps || 0,
      jumpHeightCm: recordedResultPayload.jumpHeightCm,
      lapTimes: recordedResultPayload.lapTimes,
      warnings: recordedResultPayload.authenticityReport?.warnings || [],
      authenticityReport: recordedResultPayload.authenticityReport,
      syncStatus: networkCondition === 'offline' ? 'pending' : (networkCondition === 'slow2g' ? 'pending' : 'synced'),
      syncedAt: networkCondition === 'online' ? new Date().toISOString() : undefined,
    };

    OfflineStorageManager.saveSubmissionLocally(newSubmission);
    setRecordedResultPayload(null);
    setMobileScreen('home');
    setActiveMobileNav('history');
  };

  const handleSyncAll = async () => {
    setIsSyncing(true);
    try {
      await OfflineStorageManager.syncPendingSubmissions();
    } finally {
      setIsSyncing(false);
    }
  };

  // Trigger Cheating / Tampering Demo Test
  const handleTriggerTamperDemo = () => {
    setCurrentTab('mobile');
    setSelectedTest(FITNESS_TESTS[0]); // Sit-ups
    setRecordedResultPayload({
      primaryScore: 52,
      primaryUnit: 'reps',
      validReps: 48,
      invalidReps: 4,
      durationSeconds: 42,
      aiConfidence: 0.81,
      authenticityReport: {
        isAuthentic: false,
        confidence: 0.62,
        warnings: [
          'Detected irregular timestamp interval discontinuities (video splice / speedup anomaly)',
          'Multiple individuals detected in testing area during 6 frames (coaching assistance)',
          'Kinematic speed jump: Torso velocity exceeded physiological threshold (14.2 m/s)'
        ],
        scoreBreakdown: {
          frameIntegrity: 58,
          poseContinuity: 65,
          biomechanicalValidity: 60,
          soloCandidateRating: 65,
        }
      }
    });
    setMobileScreen('result');
  };

  const handleUpdateSubmissionStatus = (submissionId: string, status: any) => {
    const updated = submissions.map(s => (s.id === submissionId ? { ...s, status } : s));
    setSubmissions(updated);
    localStorage.setItem('sports_talent_submissions_v1', JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Application Bar with Navigation Tabs and Network Simulator */}
      <TopNavigationBar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        networkCondition={networkCondition}
        setNetworkCondition={handleNetworkChange}
        pendingSyncCount={pendingSyncCount}
        onSyncNow={handleSyncAll}
        isSyncing={isSyncing}
        onTriggerTamperDemo={handleTriggerTamperDemo}
        isPhoneFrame={isPhoneFrame}
        setIsPhoneFrame={setIsPhoneFrame}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentTab === 'mobile' && (
          <MobileFrame
            activeNav={activeMobileNav}
            setActiveNav={(nav) => {
              setActiveMobileNav(nav);
              setMobileScreen('home');
            }}
            networkCondition={networkCondition}
            pendingSyncCount={pendingSyncCount}
            isPhoneFrame={isPhoneFrame}
          >
            {mobileScreen === 'instructions' && (
              <TestInstructionsModal
                test={selectedTest}
                onBack={() => setMobileScreen('home')}
                onStartRecording={handleStartRecording}
              />
            )}

            {mobileScreen === 'recording' && (
              <TestRecordingScreen
                test={selectedTest}
                onCancel={() => setMobileScreen('home')}
                onComplete={handleRecordingComplete}
              />
            )}

            {mobileScreen === 'processing' && (
              <ProcessingScreen
                test={selectedTest}
                onAnalysisFinished={handleProcessingFinished}
              />
            )}

            {mobileScreen === 'result' && recordedResultPayload && (
              <ResultScreen
                athlete={activeAthlete}
                test={selectedTest}
                result={recordedResultPayload}
                onSaveAndReturn={handleSaveAndReturn}
                onRetest={() => setMobileScreen('recording')}
                isOnline={networkCondition === 'online'}
              />
            )}

            {mobileScreen === 'home' && activeMobileNav === 'home' && (
              <AthleteHome
                athlete={activeAthlete}
                tests={FITNESS_TESTS}
                submissions={submissions.filter(s => s.athleteId === activeAthlete.id)}
                onSelectTest={handleSelectTest}
                onNavigateToSync={() => setActiveMobileNav('sync')}
                pendingSyncCount={pendingSyncCount}
              />
            )}

            {mobileScreen === 'home' && activeMobileNav === 'tests' && (
              <div className="p-4 space-y-3">
                <h2 className="text-base font-bold text-white">Select Fitness Protocol</h2>
                <div className="space-y-3">
                  {FITNESS_TESTS.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => handleSelectTest(t)}
                      className="bg-slate-900 border border-slate-800 rounded-2xl p-4 cursor-pointer hover:bg-slate-800 transition"
                    >
                      <span className="text-[10px] text-emerald-400 font-bold uppercase">{t.category}</span>
                      <h3 className="text-sm font-bold text-white mt-0.5">{t.name}</h3>
                      <p className="text-xs text-slate-400 mt-1">{t.description}</p>
                      <div className="mt-3 flex items-center justify-between text-xs font-semibold text-slate-300">
                        <span>Target: {t.nationalBenchmarkMale} {t.unit}</span>
                        <span className="text-emerald-400 font-bold">Start Test →</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {mobileScreen === 'home' && activeMobileNav === 'history' && (
              <HistoryScreen
                submissions={submissions.filter(s => s.athleteId === activeAthlete.id)}
              />
            )}

            {mobileScreen === 'home' && activeMobileNav === 'sync' && (
              <SyncStatusScreen
                submissions={submissions.filter(s => s.athleteId === activeAthlete.id)}
                networkCondition={networkCondition}
                onSyncAll={handleSyncAll}
                isSyncing={isSyncing}
              />
            )}

            {mobileScreen === 'home' && activeMobileNav === 'profile' && (
              <ProfileScreen
                athlete={activeAthlete}
                onUpdateProfile={(updated) => {
                  setActiveAthlete(updated);
                  setAthletes(athletes.map(a => (a.id === updated.id ? updated : a)));
                }}
              />
            )}
          </MobileFrame>
        )}

        {currentTab === 'admin' && (
          <AdminDashboard
            athletes={athletes}
            submissions={submissions}
            tests={FITNESS_TESTS}
            onSelectAthlete={setSelectedAdminAthlete}
            selectedAthlete={selectedAdminAthlete}
            onCloseAthleteModal={() => setSelectedAdminAthlete(null)}
            onUpdateSubmissionStatus={handleUpdateSubmissionStatus}
          />
        )}

        {currentTab === 'code' && <MonorepoViewer />}
      </main>
    </div>
  );
}
