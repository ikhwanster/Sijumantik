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
import { setSpeechEnabled } from './utils/speechHelper';

import { 
  INITIAL_ZONES, 
  INITIAL_FASKES, 
  INITIAL_INSPECTIONS, 
  INITIAL_CASES, 
  INITIAL_COMMUNITY_REPORTS, 
  INITIAL_LOGISTICS 
} from './data/initialData';
import { 
  AreaZone, 
  CommunityReport, 
  DengueCaseReport, 
  FaskesFacility, 
  HomeInspectionRecord, 
  LogisticsItem 
} from './types/jumantik';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('jumantik');
  const [userRole, setUserRole] = useState<'warga' | 'kader' | 'puskesmas'>('warga');

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

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-emerald-500 selection:text-white pb-16 md:pb-0">
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openSosModal={() => setIsSosOpen(true)}
        openReminderModal={() => setIsReminderOpen(true)}
        openExportModal={() => setIsExportModalOpen(true)}
        unreadAlertCount={2}
        userRole={userRole}
        setUserRole={setUserRole}
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
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-5 sm:py-6 space-y-6">
        {/* Tab 1: Jumantik Mandiri (1 Rumah 1 Jumantik) */}
        {activeTab === 'jumantik' && (
          <div className="space-y-6">
            {/* Sub navigation between Checklist Form and History */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-2 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setInspectionSubTab('form')}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                    inspectionSubTab === 'form'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-white text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  📝 Form Ceklist 3M+ Rumah
                </button>
                <button
                  onClick={() => setInspectionSubTab('history')}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                    inspectionSubTab === 'history'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-white text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  📜 Riwayat & Kartu Pantau ({inspections.length})
                </button>
              </div>

              <span className="text-xs font-semibold text-slate-500">
                Mode: <strong className="text-emerald-700 uppercase">{userRole}</strong>
              </span>
            </div>

            {/* Gamification Badge Display */}
            <JumantikBadge />

            {/* Form or History */}
            {inspectionSubTab === 'form' ? (
              <InspectionChecklist
                onSaveInspection={handleSaveInspection}
                onOpenAiScanner={() => {}}
              />
            ) : (
              <InspectionHistory
                inspections={inspections}
                onNewInspection={() => setInspectionSubTab('form')}
              />
            )}
          </div>
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
        {activeTab === 'edukasi' && <EducationHub onOpenSos={() => setIsSosOpen(true)} />}

        {/* Tab 7: Evakuasi & Mitigasi */}
        {activeTab === 'evakuasi' && <EvacuationGuide onOpenSos={() => setIsSosOpen(true)} />}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <p className="font-bold text-white text-sm">
              SiJumantik - Sistem Informasi Satu Rumah Satu Jumantik Nasional
            </p>
            <p className="text-slate-400">
              Mendukung Program Kementerian Kesehatan RI dalam Pengendalian Vektor Penyakit Tular Nyamuk.
            </p>
          </div>

          <div className="flex items-center gap-4 text-slate-400 text-xs">
            <span>Puskesmas Terpadu</span>
            <span>•</span>
            <span>Hotline Darurat 119</span>
            <span>•</span>
            <span>ABJ Target ≥95%</span>
          </div>
        </div>
      </footer>

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

      {/* Bottom Sticky Navigation for Mobile Smartphones */}
      <BottomMobileNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openSosModal={() => setIsSosOpen(true)}
      />
    </div>
  );
}
