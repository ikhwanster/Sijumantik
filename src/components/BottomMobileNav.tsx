import React from 'react';
import { 
  CheckCircle2, 
  MapPin, 
  Building2, 
  Users, 
  BookOpen, 
  PhoneCall,
  Trophy,
  AlertTriangle
} from 'lucide-react';
import { NavTab } from './Navbar';

interface BottomMobileNavProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  openSosModal: () => void;
}

export const BottomMobileNav: React.FC<BottomMobileNavProps> = ({
  activeTab,
  setActiveTab,
  openSosModal,
}) => {
  const tabs = [
    { id: 'jumantik' as NavTab, label: 'Pantau', emoji: '🏡', icon: CheckCircle2 },
    { id: 'misi' as NavTab, label: 'Misi Cilik', emoji: '🏆', icon: Trophy },
    { id: 'peta' as NavTab, label: 'Peta RT', emoji: '🗺️', icon: MapPin },
    { id: 'komunitas' as NavTab, label: 'Lapor Got', emoji: '📢', icon: Users },
    { id: 'puskesmas' as NavTab, label: 'Puskesmas', emoji: '🏥', icon: Building2 },
  ];

  return (
    <nav 
      aria-label="Navigasi Bawah Layar HP"
      className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 md:hidden px-2 py-1 flex items-center justify-around"
    >
      {tabs.map((t) => {
        const Icon = t.icon;
        const isActive = activeTab === t.id;
        return (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-lg transition-colors cursor-pointer ${
              isActive
                ? 'text-slate-950 font-semibold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <div className="text-base leading-none">{t.emoji}</div>
            <span className={`text-[10px] tracking-tight mt-0.5 ${isActive ? 'font-semibold text-slate-900' : 'font-normal text-slate-500'}`}>
              {t.label}
            </span>
          </button>
        );
      })}

      {/* SOS Button on Mobile bar */}
      <button
        onClick={openSosModal}
        className="flex flex-col items-center justify-center py-1 px-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-medium text-[10px] cursor-pointer"
      >
        <span className="text-sm leading-none">🚨</span>
        <span className="mt-0.5 text-white font-semibold">SOS</span>
      </button>
    </nav>
  );
};
