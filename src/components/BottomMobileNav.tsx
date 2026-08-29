import React from 'react';
import { 
  CheckCircle2, 
  MapPin, 
  Building2, 
  Users, 
  BookOpen, 
  PhoneCall,
  Sparkles
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
    { id: 'jumantik' as NavTab, label: 'Pantau 1R1J', icon: CheckCircle2, color: 'text-emerald-600' },
    { id: 'peta' as NavTab, label: 'Peta Wilayah', icon: MapPin, color: 'text-teal-600' },
    { id: 'puskesmas' as NavTab, label: 'Puskesmas', icon: Building2, color: 'text-cyan-600' },
    { id: 'komunitas' as NavTab, label: 'Lapor Got', icon: Users, color: 'text-emerald-600' },
    { id: 'edukasi' as NavTab, label: 'Edukasi 3M+', icon: BookOpen, color: 'text-amber-600' },
  ];

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 bg-white/98 backdrop-blur-md border-t-2 border-emerald-200 shadow-2xl md:hidden px-2 py-1.5 flex items-center justify-around">
      {tabs.map((t) => {
        const Icon = t.icon;
        const isActive = activeTab === t.id;
        return (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-2xl transition-all cursor-pointer ${
              isActive
                ? 'bg-emerald-100/90 text-emerald-950 font-black scale-105 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-700' : 'text-slate-500'}`} />
            <span className={`text-[10px] tracking-tight mt-0.5 ${isActive ? 'font-black' : 'font-semibold'}`}>
              {t.label}
            </span>
          </button>
        );
      })}

      {/* SOS Button on Mobile bar */}
      <button
        onClick={openSosModal}
        className="flex flex-col items-center justify-center py-1 px-2.5 bg-red-600 text-white rounded-2xl font-black text-[10px] shadow-md shadow-red-600/30 active:scale-95 animate-pulse"
      >
        <PhoneCall className="w-4 h-4 text-amber-300" />
        <span className="mt-0.5">SOS</span>
      </button>
    </div>
  );
};
