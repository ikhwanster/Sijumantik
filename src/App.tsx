/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Navbar, 
  NavTab 
} from './components/Navbar';
import { EmergencyBanner } from './components/EmergencyBanner';
import { ReminderModal } from './components/ReminderModal';
import { InspectionChecklist } from './components/HomeInspection/InspectionChecklist';
import { InspectionHistory } from './components/HomeInspection/InspectionHistory';
import { JumantikBadge } from './components/HomeInspection/JumantikBadge';
import { GisMapDashboard } from './components/Map/GisMapDashboard';
import { PuskesmasDashboard } from './components/Puskesmas/PuskesmasDashboard';
import { CommunityReports } from './components/Community/CommunityReports';
import { PredictiveAnalysis } from './components/Prediction/PredictiveAnalysis';
import { EducationHub } from './components/Education/EducationHub';
import { SosEmergencyModal } from './components/Emergency/SosEmergencyModal';
import { EvacuationGuide } from './components/Emergency/EvacuationGuide';
import { ExportReportModal } from './components/Export/ExportReportModal';
import { AccessibilityBar } from './components/AccessibilityBar';
import { QuickHelpModal } from './components/QuickHelpModal';
import { BottomMobileNav } from './components/BottomMobileNav';
import { AuthModal } from './components/Auth/AuthModal';
import { KidsMissionHub } from './components/Kids/KidsMissionHub';
import { setSpeechEnabled } from './utils/speechHelper';

import { 
  INITIAL_ZONES, 
  INITIAL_FASKES, 
  INITIAL_INSPECTIONS, 
  INITIAL_CASES, 
  INITIAL_COMMUNITY_REPORTS, 
  INITIAL_LOGISTICS 
} from './data/initialData';
import { INITIAL_USERS } from './data/defaultUsers';
import { 
  AreaZone, 
  CommunityReport, 
  DengueCaseReport, 
  FaskesFacility, 
  HomeInspectionRecord, 
  LogisticsItem 
} from './types/jumantik';
import { UserProfile, UserRole } from './types/auth';
import { Smartphone, Monitor, Star, Sparkles } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('jumantik');
  
  // Mobile device container view toggle (for desktop users who want to preview the exact phone experience)
  const [mobilePhoneFrame, setMobilePhoneFrame] = useState<boolean>(() => {
    return localStorage.getItem('sijumantik_phone_frame') === 'true';
  });

  // User Authentication State
  const [allUsers, setAllUsers] = useState<UserProfile[]>(() => {
    try {
      const saved = localStorage.getItem('sijumantik_users');
      return saved ? JSON.parse(saved) : INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  });

  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('sijumantik_current_user');
      return saved ? JSON.parse(saved) : INITIAL_USERS[0];
    } catch {
      return INITIAL_USERS[0];
    }
  });

  const [userRole, setUserRole] = useState<UserRole>(() => {
    return currentUser?.role || 'warga';
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // App persistent states
  const [inspections, setInspections] = useState<HomeInspectionRecord[]>(() => {
    try {
      const saved = localStorage.getItem('sijumantik_inspections');
      return saved ? JSON.parse(saved) : INITIAL_INSPECTIONS;
    } catch {
      return INITIAL_INSPECTIONS;
    }
  });

  const [cases, setCases] = useState<DengueCaseReport[]>(() => {
    try {
      const saved = localStorage.getItem('sijumantik_cases');
      return saved ? JSON.parse(saved) : INITIAL_CASES;
    } catch {
      return INITIAL_CASES;
    }
  });

  const [communityReports, setCommunityReports] = useState<CommunityReport[]>(() => {
    try {
      const saved = localStorage.getItem('sijumantik_community_reports');
      return saved ? JSON.parse(saved) : INITIAL_COMMUNITY_REPORTS;
    } catch {
      return INITIAL_COMMUNITY_REPORTS;
    }
  });

  const [logistics, setLogistics] = useState<LogisticsItem[]>(() => {
    try {
      const saved = localStorage.getItem('sijumantik_logistics');
      return saved ? JSON.parse(saved) : INITIAL_LOGISTICS;
    } catch {
      return INITIAL_LOGISTICS;
    }
  });

  const [zones] = useState<AreaZone[]>(INITIAL_ZONES);
  const [facilities] = useState<FaskesFacility[]>(INITIAL_FASKES);

  // Modals state
  const [isSosOpen, setIsSosOpen] = useState(false);
  const [isReminderOpen, setIsReminderOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isQuickHelpOpen, setIsQuickHelpOpen] = useState(false);
  const [inspectionSubTab, setInspectionSubTab] = useState<'form' | 'history'>('form');

  // Accessibility state for elderly and moms
  const [textSize, setTextSize] = useState<'normal' | 'large' | 'xlarge'>(() => {
    return (localStorage.getItem('sijumantik_text_size') as any) || 'large';
  });
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(() => {
    return localStorage.getItem('sijumantik_voice_enabled') !== 'false';
  });

  useEffect(() => {
    localStorage.setItem('sijumantik_text_size', textSize);
    document.body.classList.remove('text-size-normal', 'text-size-large', 'text-size-xlarge');
    document.body.classList.add(`text-size-${textSize}`);
  }, [textSize]);

  useEffect(() => {
    localStorage.setItem('sijumantik_voice_enabled', String(voiceEnabled));
    setSpeechEnabled(voiceEnabled);
  }, [voiceEnabled]);

  // Save users & current user
  useEffect(() => {
    try {
      localStorage.setItem('sijumantik_users', JSON.stringify(allUsers));
    } catch (e) {
      console.error(e);
    }
  }, [allUsers]);

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('sijumantik_current_user', JSON.stringify(currentUser));
        setUserRole(currentUser.role);
      }
    } catch (e) {
      console.error(e);
    }
  }, [currentUser]);

  // Save to LocalStorage on updates
  useEffect(() => {
    try {
      localStorage.setItem('sijumantik_inspections', JSON.stringify(inspections));
    } catch (e) {
      console.error(e);
    }
  }, [inspections]);

  useEffect(() => {
    try {
      localStorage.setItem('sijumantik_cases', JSON.stringify(cases));
    } catch (e) {
      console.error(e);
    }
  }, [cases]);

  useEffect(() => {
    try {
      localStorage.setItem('sijumantik_community_reports', JSON.stringify(communityReports));
    } catch (e) {
      console.error(e);
    }
  }, [communityReports]);

  useEffect(() => {
    try {
      localStorage.setItem('sijumantik_logistics', JSON.stringify(logistics));
    } catch (e) {
      console.error(e);
    }
  }, [logistics]);

  // Handle Login & Register
  const handleLoginUser = (user: UserProfile) => {
    setCurrentUser(user);
    setUserRole(user.role);
  };

  const handleRegisterUser = (newUser: UserProfile) => {
    const updatedUsers = [newUser, ...allUsers];
    setAllUsers(updatedUsers);
    setCurrentUser(newUser);
    setUserRole(newUser.role);
  };

  const handleLogoutUser = () => {
    setCurrentUser(null);
  };

  const handleAwardStars = (starsToAdd: number, pointsToAdd: number, missionId?: string) => {
    if (!currentUser) return;
    const updatedMissions = missionId && currentUser.completedMissions
      ? Array.from(new Set([...currentUser.completedMissions, missionId]))
      : currentUser.completedMissions || [];

    const updatedUser: UserProfile = {
      ...currentUser,
      stars: currentUser.stars + starsToAdd,
      points: currentUser.points + pointsToAdd,
      completedMissions: updatedMissions
    };

    setCurrentUser(updatedUser);
    setAllUsers(allUsers.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
  };

  const handleSaveInspection = (newRecord: HomeInspectionRecord) => {
    setInspections([newRecord, ...inspections]);
    setInspectionSubTab('history');
  };

  const handleAddCommunityReport = (newRep: CommunityReport) => {
    setCommunityReports([newRep, ...communityReports]);
  };

  const handleUpvoteReport = (id: string) => {
    setCommunityReports(
      communityReports.map((r) => (r.id === id ? { ...r, upvotes: r.upvotes + 1 } : r))
    );
  };

  const togglePhoneFrame = () => {
    const next = !mobilePhoneFrame;
    setMobilePhoneFrame(next);
    localStorage.setItem('sijumantik_phone_frame', String(next));
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans selection:bg-emerald-500 selection:text-white pb-20 md:pb-0">
      {/* Desktop Helper Bar: Quick Switch Mobile View vs Fullscreen */}
      <div className="hidden lg:flex bg-slate-900 text-slate-300 px-4 py-1.5 text-xs items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold text-slate-200">
            Mode Tampilan Aplikasi SiJumantik (Mobile-First UX)
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={togglePhoneFrame}
            className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg font-bold transition-all text-xs cursor-pointer ${
              mobilePhoneFrame
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>{mobilePhoneFrame ? '📱 Bingkai Layar HP Aktif' : '📱 Tampilkan Layar HP'}</span>
          </button>
          
          <button
            onClick={() => setMobilePhoneFrame(false)}
            className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg font-bold transition-all text-xs cursor-pointer ${
              !mobilePhoneFrame
                ? 'bg-teal-600 text-white shadow-xs'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>💻 Tampilan Layar Penuh</span>
          </button>
        </div>
      </div>

      {/* Outer wrapper that optionally frames as a sleek smartphone in desktop view */}
      <div className={mobilePhoneFrame ? 'py-4 sm:py-8 flex justify-center bg-slate-200 min-h-screen' : 'w-full'}>
        <div
          className={`bg-slate-50 w-full transition-all duration-300 ${
            mobilePhoneFrame
              ? 'max-w-md rounded-[2.5rem] shadow-2xl border-8 border-slate-800 overflow-hidden relative min-h-[840px] flex flex-col'
              : 'min-h-screen flex flex-col'
          }`}
        >
          {/* Simulated Mobile Status Bar if in Phone Frame */}
          {mobilePhoneFrame && (
            <div className="bg-emerald-900 text-white text-[11px] px-6 pt-2 pb-1 flex items-center justify-between font-bold select-none">
              <span>08:30</span>
              <div className="w-20 h-3.5 bg-black/40 rounded-full mx-auto" />
              <div className="flex items-center gap-1.5">
                <span>5G</span>
                <span>📶</span>
                <span>🔋 100%</span>
              </div>
            </div>
          )}

          {/* Navigation Header */}
          <Navbar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            openSosModal={() => setIsSosOpen(true)}
            openReminderModal={() => setIsReminderOpen(true)}
            openExportModal={() => setIsExportModalOpen(true)}
            openAuthModal={() => setIsAuthModalOpen(true)}
            unreadAlertCount={2}
            userRole={userRole}
            setUserRole={setUserRole}
            currentUser={currentUser}
            onLogout={handleLogoutUser}
          />

          {/* Elderly & Mom Friendly Accessibility Bar */}
          <AccessibilityBar
            textSize={textSize}
            setTextSize={setTextSize}
            voiceEnabled={voiceEnabled}
            setVoiceEnabled={setVoiceEnabled}
            onOpenQuickHelp={() => setIsQuickHelpOpen(true)}
            onOpenSos={() => setIsSosOpen(true)}
          />

          {/* Early Warning Alert Banner */}
          <EmergencyBanner
            onOpenEvacuation={() => setActiveTab('evakuasi')}
            onOpenMap={() => setActiveTab('peta')}
            onOpenSos={() => setIsSosOpen(true)}
          />

          {/* Main Container */}
          <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-4 py-4 sm:py-5 space-y-5">
            {/* Tab 1: Jumantik Mandiri (1 Rumah 1 Jumantik) */}
            {activeTab === 'jumantik' && (
              <div className="space-y-5">
                {/* Sub navigation between Checklist Form and History */}
                <div className="flex items-center justify-between border-b border-slate-200 pb-2 flex-wrap gap-2">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setInspectionSubTab('form')}
                      className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                        inspectionSubTab === 'form'
                          ? 'bg-slate-900 text-white'
                          : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
                      }`}
                    >
                      Form Ceklist 3M+
                    </button>
                    <button
                      onClick={() => setInspectionSubTab('history')}
                      className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                        inspectionSubTab === 'history'
                          ? 'bg-slate-900 text-white'
                          : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
                      }`}
                    >
                      Riwayat ({inspections.length})
                    </button>
                  </div>

                  {currentUser && (
                    <div className="flex items-center gap-1.5 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-800">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                      <span>{currentUser.stars} ⭐ ({currentUser.points} Poin)</span>
                    </div>
                  )}
                </div>

                {/* Gamification Badge Display */}
                <JumantikBadge />

                {/* Form or History */}
                {inspectionSubTab === 'form' ? (
                  <InspectionChecklist
                    onSaveInspection={handleSaveInspection}
                    onOpenAiScanner={() => {}}
                    currentUser={currentUser}
                    onAwardPoints={handleAwardStars}
                  />
                ) : (
                  <InspectionHistory
                    inspections={inspections}
                    onNewInspection={() => setInspectionSubTab('form')}
                  />
                )}
              </div>
            )}

            {/* Tab: Misi Cilik & Kuis Gamifikasi (Kids & Lansia Friendly) */}
            {activeTab === 'misi' && (
              <KidsMissionHub
                currentUser={currentUser}
                onUpdateUserStars={handleAwardStars}
                onNavigateToChecklist={() => {
                  setActiveTab('jumantik');
                  setInspectionSubTab('form');
                }}
              />
            )}

            {/* Tab 2: Peta GIS & Hotspot */}
            {activeTab === 'peta' && (
              <GisMapDashboard
                zones={zones}
                cases={cases}
                facilities={facilities}
                inspections={inspections}
                onOpenSos={() => setIsSosOpen(true)}
              />
            )}

            {/* Tab 3: Dasbor Puskesmas */}
            {activeTab === 'puskesmas' && (
              <PuskesmasDashboard
                cases={cases}
                onUpdateCases={setCases}
                facilities={facilities}
                inspections={inspections}
                logistics={logistics}
                onUpdateLogistics={setLogistics}
              />
            )}

            {/* Tab 4: Lapor Komunitas */}
            {activeTab === 'komunitas' && (
              <CommunityReports
                reports={communityReports}
                onAddReport={handleAddCommunityReport}
                onUpvote={handleUpvoteReport}
              />
            )}

            {/* Tab 5: Prediksi Risiko AI */}
            {activeTab === 'prediksi' && <PredictiveAnalysis zones={zones} />}

            {/* Tab 6: Edukasi & Kuis */}
            {activeTab === 'edukasi' && (
              <EducationHub
                onOpenSos={() => setIsSosOpen(true)}
                onNavigateTab={(tab) => setActiveTab(tab as any)}
              />
            )}

            {/* Tab 7: Evakuasi & Mitigasi */}
            {activeTab === 'evakuasi' && <EvacuationGuide onOpenSos={() => setIsSosOpen(true)} />}
          </main>

          {/* Footer */}
          <footer className="bg-slate-900 text-slate-400 py-6 border-t border-slate-800 text-xs mt-auto">
            <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
              <div className="space-y-0.5">
                <p className="font-bold text-white text-xs sm:text-sm">
                  SiJumantik - Satu Rumah Satu Jumantik Nasional
                </p>
                <p className="text-slate-400 text-[11px]">
                  Ramah Anak, Lansia & Warga • Kemenkes RI 1R1J
                </p>
              </div>

              <div className="flex items-center gap-3 text-slate-400 text-[11px]">
                <span>Hotline 119</span>
                <span>•</span>
                <span>Puskesmas Siaga</span>
                <span>•</span>
                <span>Bebas Jentik 100%</span>
              </div>
            </div>
          </footer>

          {/* Bottom Sticky Navigation for Mobile Smartphones */}
          <BottomMobileNav
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            openSosModal={() => setIsSosOpen(true)}
          />
        </div>
      </div>

      {/* User Login & Register Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUser}
        onLogin={handleLoginUser}
        onRegister={handleRegisterUser}
        allUsers={allUsers}
      />

      {/* Emergency SOS Modal */}
      <SosEmergencyModal
        isOpen={isSosOpen}
        onClose={() => setIsSosOpen(false)}
        facilities={facilities}
        onOpenEvacuationGuide={() => {
          setIsSosOpen(false);
          setActiveTab('evakuasi');
        }}
      />

      {/* Reminder Scheduler Modal */}
      <ReminderModal
        isOpen={isReminderOpen}
        onClose={() => setIsReminderOpen(false)}
        onInspectionNow={() => {
          setIsReminderOpen(false);
          setActiveTab('jumantik');
          setInspectionSubTab('form');
        }}
      />

      {/* Export Report PDF & Excel Modal */}
      <ExportReportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        inspections={inspections}
        cases={cases}
        logistics={logistics}
        communityReports={communityReports}
        zones={zones}
      />

      {/* Quick Help Modal for Elderly and Moms */}
      <QuickHelpModal
        isOpen={isQuickHelpOpen}
        onClose={() => setIsQuickHelpOpen(false)}
        onStartInspection={() => {
          setActiveTab('jumantik');
          setInspectionSubTab('form');
        }}
      />
    </div>
  );
}
