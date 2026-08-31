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
    <div className="bg-slate-50 border-b border-slate-200 px-3 py-1.5 text-xs text-slate-700">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        {/* Minimalist accessibility indicator */}
        <div className="flex items-center gap-2">
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-emerald-100 text-emerald-800">
            <Sparkles className="w-3 h-3" />
          </span>
          <span className="font-medium text-xs text-slate-700">
            SiJumantik • Aksesibilitas & Ramah Keluarga
          </span>
        </div>

        {/* Controls: Text Size, Voice Audio, Help */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Text Size Adjuster */}
          <div className="inline-flex items-center gap-0.5 bg-white p-0.5 rounded-lg border border-slate-200">
            <span className="text-[11px] font-medium text-slate-500 px-1 flex items-center gap-1">
              <Type className="w-3 h-3 text-slate-500" />
              <span>Huruf:</span>
            </span>
            <button
              type="button"
              onClick={() => {
                setTextSize('normal');
                if (voiceEnabled) speakIndonesian("Ukuran huruf standar.");
              }}
              className={`px-2 py-0.5 rounded text-xs font-medium transition-colors ${
                textSize === 'normal'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
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
              className={`px-2 py-0.5 rounded text-xs font-semibold transition-colors ${
                textSize === 'large'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
              title="Huruf Besar"
            >
              A+
            </button>
            <button
              type="button"
              onClick={() => {
                setTextSize('xlarge');
                if (voiceEnabled) speakIndonesian("Ukuran huruf sangat besar.");
              }}
              className={`px-2 py-0.5 rounded text-xs font-bold transition-colors ${
                textSize === 'xlarge'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
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
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
              voiceEnabled
                ? 'bg-emerald-600 text-white border-emerald-700'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {voiceEnabled ? (
              <>
                <Volume2 className="w-3.5 h-3.5" />
                <span>Panduan Suara Aktif</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                <span>Panduan Suara</span>
              </>
            )}
          </button>

          {/* Petunjuk Mudah */}
          <button
            type="button"
            onClick={onOpenQuickHelp}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-medium text-xs transition-colors cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
            <span>Panduan Singkat</span>
          </button>
        </div>
      </div>
    </div>
  );
};
