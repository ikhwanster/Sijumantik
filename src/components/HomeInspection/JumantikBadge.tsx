import React from 'react';
import { Award, ShieldCheck, Flame, Star, CheckCircle, Zap } from 'lucide-react';

interface BadgeItem {
  id: string;
  title: string;
  level: string;
  icon: any;
  unlocked: boolean;
  progress: string;
  description: string;
}

export const JumantikBadge: React.FC = () => {
  const badges: BadgeItem[] = [
    {
      id: 'b1',
      title: 'Ksatria Jumantik 1R1J',
      level: 'Gold',
      icon: ShieldCheck,
      unlocked: true,
      progress: '4/4 Minggu Aktif',
      description: 'Melakukan inspeksi mandiri 4 minggu berturut-turut.',
    },
    {
      id: 'b2',
      title: 'Bebas Jentik 100%',
      level: 'Platinum',
      icon: Award,
      unlocked: true,
      progress: '10 Titik Aman',
      description: 'Seluruh 10 titik penampungan air di rumah nihil larva nyamuk.',
    },
    {
      id: 'b3',
      title: 'Pelopor Gotong Royong',
      level: 'Silver',
      icon: Star,
      unlocked: true,
      progress: '3 Laporan Terverifikasi',
      description: 'Melaporkan dan membersihkan genangan liar di lingkungan publik.',
    },
    {
      id: 'b4',
      title: 'Pakar 3M Plus Kemenkes',
      level: 'Gold',
      icon: Zap,
      unlocked: true,
      progress: 'Skor Kuis 100/100',
      description: 'Lulus Kuis Cerdas Jumantik dengan nilai sempurna.',
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900">Lencana Prestasi Jumantik Mandiri</h3>
            <p className="text-xs text-slate-500">Apresiasi Ketaatan Pencegahan DBD Rumah Tangga</p>
          </div>
        </div>
        <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full border border-emerald-300">
          Level 4 - Teladan
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {badges.map((badge) => {
          const Icon = badge.icon;
          return (
            <div
              key={badge.id}
              className={`p-3.5 rounded-xl border transition-all ${
                badge.unlocked
                  ? 'bg-gradient-to-br from-amber-50/70 to-emerald-50/50 border-amber-300 shadow-2xs'
                  : 'bg-slate-50 border-slate-200 opacity-60'
              }`}
            >
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold shadow-xs">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900 leading-tight">{badge.title}</h4>
                  <span className="text-[10px] text-amber-700 font-black uppercase tracking-wider">
                    {badge.level}
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-slate-600 mb-2 leading-tight">{badge.description}</p>
              <div className="flex items-center justify-between text-[10px] font-bold text-emerald-800 bg-white/80 px-2 py-1 rounded border border-slate-200">
                <span>Progress:</span>
                <span>{badge.progress}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
