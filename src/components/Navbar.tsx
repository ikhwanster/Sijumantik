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
  FileSpreadsheet,
  User,
  Star,
  Trophy,
  LogIn,
  LogOut,
  Flame,
  HelpCircle
} from 'lucide-react';
import { UserProfile, UserRole } from '../types/auth';

export type NavTab = 'jumantik' | 'misi' | 'peta' | 'puskesmas' | 'komunitas' | 'prediksi' | 'edukasi' | 'evakuasi' | 'admin';

interface NavbarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  openSosModal: () => void;
  openReminderModal: () => void;
  openExportModal: () => void;
  openAuthModal: () => void;
  unreadAlertCount: number;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  currentUser: UserProfile | null;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  openSosModal,
  openReminderModal,
  openExportModal,
  openAuthModal,
  unreadAlertCount,
  userRole,
  setUserRole,
  currentUser,
  onLogout
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-xs">
      {/* Top Mobile Status & Emergency Strip */}
      <div className="bg-slate-900 text-white px-3 sm:px-4 py-1.5 text-xs font-medium border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* User Status / Greeting Pill */}
          <div className="flex items-center gap-2">
            <button
              onClick={openAuthModal}
              className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 px-2.5 py-1 rounded-lg text-xs transition-colors text-left cursor-pointer"
              title="Klik untuk Ganti Akun / Masuk"
            >
              <span className="text-sm">{currentUser?.avatar || '👤'}</span>
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-white text-xs">
                  {currentUser?.name || 'Tamu / Warga'}
                </span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-medium px-1.5 py-0.2 rounded border border-emerald-500/30">
                  {currentUser?.role === 'admin'
                    ? 'Super Admin 🛡️'
                    : currentUser?.role === 'anak'
                    ? 'Cilik'
                    : currentUser?.role === 'warga'
                    ? 'Warga'
                    : currentUser?.role === 'kader'
                    ? 'Kader'
                    : 'Nakes'}
                </span>
              </div>
            </button>

            <span className="hidden sm:inline text-slate-400 text-xs">
              • Satu Rumah Satu Jumantik
            </span>
          </div>

          {/* Quick Actions (Auth, Export, Reminder, SOS) */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {/* Admin Quick Button if logged in as admin */}
            {currentUser?.role === 'admin' && (
              <button
                onClick={() => setActiveTab('admin')}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer border ${
                  activeTab === 'admin'
                    ? 'bg-indigo-600 text-white border-indigo-400 shadow-sm'
                    : 'bg-indigo-950/80 text-indigo-200 border-indigo-700/80 hover:bg-indigo-900'
                }`}
                title="Kelola Data Administrator"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-300" />
                <span>Kelola Data</span>
              </button>
            )}

            {/* Login / Switch Account Button */}
            <button
              onClick={openAuthModal}
              className="inline-flex items-center gap-1 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer"
            >
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span>Ganti Akun</span>
            </button>

            {currentUser && (
              <button
                onClick={onLogout}
                className="inline-flex items-center gap-1 text-rose-300 hover:text-rose-100 bg-rose-950/60 hover:bg-rose-900/80 border border-rose-800/60 px-2 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                title="Keluar ke Halaman Masuk"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Keluar</span>
              </button>
            )}

            {/* Export Reports */}
            <button
              onClick={openExportModal}
              className="hidden sm:inline-flex items-center gap-1 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer"
              title="Unduh Laporan PDF & Excel"
            >
              <Download className="w-3.5 h-3.5 text-slate-400" />
              <span>Unduh Laporan</span>
            </button>

            {/* Reminder */}
            <button
              onClick={openReminderModal}
              className="inline-flex items-center gap-1 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer"
            >
              <Bell className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden xs:inline">Alarm PSN</span>
              {unreadAlertCount > 0 && (
                <span className="bg-red-500 text-white text-[10px] px-1.5 rounded font-semibold">
                  {unreadAlertCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2">
        <div className="flex items-center justify-between gap-3">
          {/* Brand Logo */}
          <div
            className="flex items-center gap-2.5 cursor-pointer"
            onClick={() => setActiveTab('jumantik')}
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-700 flex items-center justify-center text-white text-base shrink-0">
              🏡
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                  SiJumantik
                </h1>
                <span className="bg-slate-100 text-slate-700 text-[10px] font-medium px-1.5 py-0.2 rounded border border-slate-200">
                  Kemenkes RI
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-normal leading-none">
                Pemantauan Jentik Nyamuk & 1R1J
              </p>
            </div>
          </div>

          {/* Navigation Links for Desktop */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              onClick={() => setActiveTab('jumantik')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeTab === 'jumantik'
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Pantau 1R1J</span>
            </button>

            <button
              onClick={() => setActiveTab('misi')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeTab === 'misi'
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Trophy className="w-3.5 h-3.5 text-amber-600" />
              <span>Misi Cilik</span>
            </button>

            <button
              onClick={() => setActiveTab('peta')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeTab === 'peta'
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MapPin className="w-3.5 h-3.5 text-teal-600" />
              <span>Peta Wilayah</span>
            </button>

            <button
              onClick={() => setActiveTab('komunitas')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeTab === 'komunitas'
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-cyan-600" />
              <span>Lapor Got</span>
            </button>

            <button
              onClick={() => setActiveTab('puskesmas')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeTab === 'puskesmas'
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-3.5 h-3.5 text-blue-600" />
              <span>Puskesmas</span>
            </button>

            <button
              onClick={() => setActiveTab('edukasi')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeTab === 'edukasi'
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
              <span>Edukasi 3M+</span>
            </button>

            <button
              onClick={() => setActiveTab('evakuasi')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeTab === 'evakuasi'
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
              <span>Gejala & Triage</span>
            </button>

            {currentUser?.role === 'admin' && (
              <button
                onClick={() => setActiveTab('admin')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                  activeTab === 'admin'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-indigo-700 bg-indigo-50 hover:bg-indigo-100'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
                <span>Admin</span>
              </button>
            )}
          </nav>

          {/* SOS Emergency Call - Minimalist */}
          <div className="flex items-center gap-2">
            <button
              onClick={openSosModal}
              className="inline-flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white px-3 py-1.5 rounded-lg font-medium text-xs transition-colors cursor-pointer"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>SOS Darurat</span>
            </button>
          </div>
        </div>

        {/* Mobile Horizontal Quick Tab Scroller */}
        <div className="flex lg:hidden overflow-x-auto no-scrollbar gap-1 pt-2 pb-0.5 border-t border-slate-100 mt-2">
          {[
            { id: 'jumantik', label: '1R1J Pantau', icon: CheckCircle2 },
            ...(currentUser?.role === 'admin' ? [{ id: 'admin', label: '🛡️ Admin Data', icon: ShieldCheck }] : []),
            { id: 'misi', label: 'Misi Cilik', icon: Trophy },
            { id: 'peta', label: 'Peta Wilayah', icon: MapPin },
            { id: 'komunitas', label: 'Lapor Got', icon: Users },
            { id: 'puskesmas', label: 'Puskesmas', icon: Building2 },
            { id: 'edukasi', label: 'Edukasi', icon: BookOpen },
            { id: 'evakuasi', label: 'Gejala DBD', icon: AlertTriangle },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSel = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as NavTab)}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  isSel
                    ? 'bg-slate-900 text-white font-semibold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
