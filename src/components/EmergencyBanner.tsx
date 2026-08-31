import React, { useState } from 'react';
import { 
  AlertOctagon, 
  CloudRain, 
  ShieldAlert, 
  Volume2, 
  ChevronRight, 
  MapPin, 
  X,
  Radio
} from 'lucide-react';
import { playAlertTone } from '../utils/audioAlert';

interface EmergencyBannerProps {
  onOpenEvacuation: () => void;
  onOpenMap: () => void;
  onOpenSos: () => void;
}

export const EmergencyBanner: React.FC<EmergencyBannerProps> = ({
  onOpenEvacuation,
  onOpenMap,
  onOpenSos,
}) => {
  const [dismissed, setDismissed] = useState(false);
  const [isAlarmPlaying, setIsAlarmPlaying] = useState(false);

  const handleTestAlarm = () => {
    setIsAlarmPlaying(true);
    playAlertTone('emergency');
    setTimeout(() => setIsAlarmPlaying(false), 2000);
  };

  if (dismissed) return null;

  return (
    <div className="bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white shadow-md relative overflow-hidden">
      {/* Background visual elements */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 py-2.5 sm:py-3 relative z-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          {/* Main warning info */}
          <div className="flex items-start gap-3">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-xs shrink-0 mt-0.5 animate-pulse">
              <AlertOctagon className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-white text-red-700 text-[11px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                  PERINGATAN DINI (EWS) DBD
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-semibold bg-red-900/40 px-2 py-0.5 rounded-full border border-red-300/30">
                  <Radio className="w-3 h-3 text-red-300 animate-ping" />
                  Radius Bahaya 500m dari RW 03
                </span>
              </div>
              <p className="text-xs sm:text-sm font-medium text-white/95 mt-1">
                <strong>Waspada KLB:</strong> Ditemukan 7 kasus aktif DBD & Angka Bebas Jentik 79.1% di RW 03 Bantaran Kali. Diprediksi hujan lebat 3 hari ke depan. Lakukan 3M+ serentak & waspadai tanda syok!
              </p>
            </div>
          </div>

          {/* Quick action buttons */}
          <div className="flex items-center flex-wrap gap-1.5 w-full md:w-auto justify-end">
            <button
              onClick={handleTestAlarm}
              className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-md border border-white/30 hover:bg-white/10 transition-colors cursor-pointer ${
                isAlarmPlaying ? 'bg-amber-400 text-slate-950 font-semibold' : 'bg-transparent text-white'
              }`}
              title="Bunyikan Sirene Peringatan Warga"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>{isAlarmPlaying ? 'Sirene Aktif...' : 'Tes Sirene'}</span>
            </button>

            <button
              onClick={onOpenMap}
              className="inline-flex items-center gap-1 text-xs font-medium bg-white text-slate-900 hover:bg-slate-100 px-2.5 py-1 rounded-md transition-colors cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5 text-rose-600" />
              <span>Peta Klaster</span>
            </button>

            <button
              onClick={onOpenEvacuation}
              className="inline-flex items-center gap-1 text-xs font-medium bg-slate-900 text-white hover:bg-slate-800 px-2.5 py-1 rounded-md transition-colors cursor-pointer"
            >
              <span>Alur Rujukan</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setDismissed(true)}
              className="text-white/80 hover:text-white p-1 rounded-md hover:bg-white/10 cursor-pointer"
              aria-label="Tutup Peringatan"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
