import React from 'react';
import { 
  ShieldCheck, 
  MapPin, 
  Building2, 
  Users, 
  TrendingUp, 
  BookOpen, 
  AlertTriangle, 
  Bell, 
  CheckCircle2,
  PhoneCall,
  Sparkles,
  Download,
  FileSpreadsheet
} from 'lucide-react';

export type NavTab = 'jumantik' | 'peta' | 'puskesmas' | 'komunitas' | 'prediksi' | 'edukasi' | 'evakuasi';

interface NavbarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  openSosModal: () => void;
  openReminderModal: () => void;
  openExportModal: () => void;
  unreadAlertCount: number;
  userRole: 'warga' | 'kader' | 'puskesmas';
  setUserRole: (role: 'warga' | 'kader' | 'puskesmas') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  openSosModal,
  openReminderModal,
  openExportModal,
  unreadAlertCount,
  userRole,
  setUserRole,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-xs">
      {/* Top emergency & community badge strip */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-cyan-900 text-white px-3 sm:px-4 py-2 text-xs font-medium">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 bg-amber-400 text-emerald-950 px-2.5 py-0.5 rounded-full font-black text-[11px] tracking-wide uppercase shadow-xs">
              🌸 Gerakan 1R1J
            </span>
            <span className="font-bold text-emerald-100 hidden sm:inline">Satu Rumah Satu Jumantik</span>
            <span className="hidden md:inline text-emerald-300">|</span>
            <span className="hidden md:inline text-emerald-200 font-medium">Lindungi Anak & Cucu dari Nyamuk DBD</span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <button
              onClick={openExportModal}
              className="flex items-center gap-1.5 text-amber-200 hover:text-white transition-colors bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 px-3 py-1 rounded-xl text-xs font-bold shadow-2xs"
              title="Unduh Laporan PDF & Excel"
            >
              <Download className="w-3.5 h-3.5 text-amber-300" />
              <span>Unduh Laporan</span>
            </button>

            <button
              onClick={openReminderModal}
              className="flex items-center gap-1.5 text-emerald-100 hover:text-white transition-colors bg-white/15 hover:bg-white/25 px-2.5 py-1 rounded-xl text-xs font-bold shadow-2xs"
            >
              <Bell className="w-3.5 h-3.5 text-amber-300" />
              <span>Alarm PSN Jumat</span>
              {unreadAlertCount > 0 && (
                <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                  {unreadAlertCount}
                </span>
              )}
            </button>

            {/* Quick Role switcher */}
            <div className="flex items-center gap-1 bg-emerald-950/80 p-1 rounded-xl border border-emerald-500/40">
              <button
                onClick={() => setUserRole('warga')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  userRole === 'warga'
                    ? 'bg-emerald-500 text-white shadow-xs'
                    : 'text-emerald-200 hover:text-white'
                }`}
              >
                🏠 Ibu/Warga
              </button>
              <button
                onClick={() => setUserRole('kader')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  userRole === 'kader'
                    ? 'bg-teal-500 text-white shadow-xs'
                    : 'text-emerald-200 hover:text-white'
                }`}
              >
                📋 Kader RT
              </button>
              <button
                onClick={() => setUserRole('puskesmas')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  userRole === 'puskesmas'
                    ? 'bg-cyan-600 text-white shadow-xs'
                    : 'text-emerald-200 hover:text-white'
                }`}
              >
                🏥 Puskesmas
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 sm:py-3">
        <div className="flex items-center justify-between gap-3">
          {/* Logo & title */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('jumantik')}>
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-400 border-2 border-white rounded-full flex items-center justify-center">
                <span className="w-1.5 h-1.5 bg-emerald-800 rounded-full animate-ping" />
              </span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-xl font-black text-slate-900 tracking-tight">SiJumantik</h1>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded border border-emerald-300">
                  v2.5 Digital
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium leading-none">
                Pantau Jentik Mandiri & Mitigasi Tanggap DBD
              </p>
            </div>
          </div>

          {/* Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/60">
            <button
              onClick={() => setActiveTab('jumantik')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'jumantik'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Pantau Mandiri</span>
            </button>

            <button
              onClick={() => setActiveTab('peta')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'peta'
                  ? 'bg-white text-teal-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <MapPin className="w-4 h-4 text-teal-600" />
              <span>Peta GIS & Hotspot</span>
            </button>

            <button
              onClick={() => setActiveTab('puskesmas')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'puskesmas'
                  ? 'bg-white text-cyan-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Building2 className="w-4 h-4 text-cyan-600" />
              <span>Dasbor Faskes</span>
            </button>

            <button
              onClick={() => setActiveTab('komunitas')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'komunitas'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Users className="w-4 h-4 text-emerald-600" />
              <span>Lapor Komunitas</span>
            </button>

            <button
              onClick={() => setActiveTab('prediksi')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'prediksi'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <TrendingUp className="w-4 h-4 text-indigo-600" />
              <span>Analisis Risiko AI</span>
            </button>

            <button
              onClick={() => setActiveTab('edukasi')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'edukasi'
                  ? 'bg-white text-amber-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <BookOpen className="w-4 h-4 text-amber-600" />
              <span>Edukasi & Kuis</span>
            </button>

            <button
              onClick={() => setActiveTab('evakuasi')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'evakuasi'
                  ? 'bg-white text-rose-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>Evakuasi & Triage</span>
            </button>
          </nav>

          {/* Action SOS and Mobile quick bar */}
          <div className="flex items-center gap-2">
            <button
              onClick={openSosModal}
              className="flex items-center gap-1.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl font-bold text-xs sm:text-sm shadow-md shadow-red-500/20 active:scale-95 transition-all animate-pulse"
            >
              <PhoneCall className="w-4 h-4" />
              <span>SOS DBD</span>
            </button>
          </div>
        </div>

        {/* Mobile Horizontal Scroll Navigation */}
        <div className="flex lg:hidden overflow-x-auto no-scrollbar gap-1.5 pt-2 pb-1 border-t border-slate-100 mt-2">
          {[
            { id: 'jumantik', label: '1R1J Mandiri', icon: CheckCircle2 },
            { id: 'peta', label: 'Peta GIS', icon: MapPin },
            { id: 'puskesmas', label: 'Puskesmas', icon: Building2 },
            { id: 'komunitas', label: 'Komunitas', icon: Users },
            { id: 'prediksi', label: 'Prediksi AI', icon: TrendingUp },
            { id: 'edukasi', label: 'Edukasi & Kuis', icon: BookOpen },
            { id: 'evakuasi', label: 'Evakuasi', icon: AlertTriangle },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSel = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as NavTab)}
                className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  isSel
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
