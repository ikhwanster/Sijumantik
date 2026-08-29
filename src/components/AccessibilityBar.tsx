import React from 'react';
import { Volume2, VolumeX, Type, Sparkles, Heart, HelpCircle, PhoneCall } from 'lucide-react';
import { speakIndonesian } from '../utils/speechHelper';

interface AccessibilityBarProps {
  textSize: 'normal' | 'large' | 'xlarge';
  setTextSize: (size: 'normal' | 'large' | 'xlarge') => void;
  voiceEnabled: boolean;
  setVoiceEnabled: (enabled: boolean) => void;
  onOpenQuickHelp: () => void;
  onOpenSos: () => void;
}

export const AccessibilityBar: React.FC<AccessibilityBarProps> = ({
  textSize,
  setTextSize,
  voiceEnabled,
  setVoiceEnabled,
  onOpenQuickHelp,
  onOpenSos
}) => {
  const handleToggleVoice = () => {
    const next = !voiceEnabled;
    setVoiceEnabled(next);
    if (next) {
      speakIndonesian("Panduan suara aktif. SiJumantik siap membantu Ibu dan Bapak.");
    }
  };

  return (
    <div className="bg-amber-50/90 border-b border-amber-200/80 px-3 py-2 text-xs text-amber-950">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2.5">
        {/* Friendly greeting for moms & elderly */}
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-200 text-amber-900 shadow-xs">
            <Heart className="w-3.5 h-3.5 fill-amber-600 text-amber-600 animate-pulse" />
          </span>
          <span className="font-semibold text-[13px] text-amber-900">
            Tampilan Khusus <strong>Ibu-Ibu & Lansia</strong>: Nyaman dibaca, tulisan jelas & pengisian mudah
          </span>
        </div>

        {/* Controls: Text Size, Voice Audio, Help */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Text Size Adjuster */}
          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-amber-300 shadow-2xs">
            <span className="text-[11px] font-bold text-slate-500 px-1.5 flex items-center gap-1">
              <Type className="w-3.5 h-3.5 text-slate-600" />
              <span>Huruf:</span>
            </span>
            <button
              type="button"
              onClick={() => {
                setTextSize('normal');
                if (voiceEnabled) speakIndonesian("Ukuran huruf standar.");
              }}
              className={`px-2 py-1 rounded-lg text-xs font-bold transition-colors ${
                textSize === 'normal'
                  ? 'bg-amber-500 text-white shadow-2xs'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
              title="Huruf Normal"
            >
              A
            </button>
            <button
              type="button"
              onClick={() => {
                setTextSize('large');
                if (voiceEnabled) speakIndonesian("Ukuran huruf diperbesar agar nyaman dibaca.");
              }}
              className={`px-2.5 py-1 rounded-lg text-sm font-bold transition-colors ${
                textSize === 'large'
                  ? 'bg-amber-500 text-white shadow-2xs'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
              title="Huruf Besar"
            >
              A+
            </button>
            <button
              type="button"
              onClick={() => {
                setTextSize('xlarge');
                if (voiceEnabled) speakIndonesian("Ukuran huruf sangat besar untuk lansia.");
              }}
              className={`px-3 py-1 rounded-lg text-base font-extrabold transition-colors ${
                textSize === 'xlarge'
                  ? 'bg-amber-500 text-white shadow-2xs'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
              title="Huruf Sangat Besar"
            >
              A++
            </button>
          </div>

          {/* Voice Guidance Toggle */}
          <button
            type="button"
            onClick={handleToggleVoice}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-bold text-xs transition-all shadow-2xs ${
              voiceEnabled
                ? 'bg-emerald-600 text-white border-emerald-700 ring-2 ring-emerald-400/30'
                : 'bg-white text-slate-700 border-amber-300 hover:bg-amber-100'
            }`}
          >
            {voiceEnabled ? (
              <>
                <Volume2 className="w-4 h-4 text-amber-200" />
                <span>🔊 Suara Aktif</span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4 text-slate-400" />
                <span>🔇 Suara Mati</span>
              </>
            )}
          </button>

          {/* Petunjuk Mudah */}
          <button
            type="button"
            onClick={onOpenQuickHelp}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs transition-colors shadow-2xs"
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
            <span>Cara Pakai</span>
          </button>
        </div>
      </div>
    </div>
  );
};
