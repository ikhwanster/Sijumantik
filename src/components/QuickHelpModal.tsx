import React from 'react';
import { X, CheckCircle2, Heart, Volume2, ShieldCheck, Sparkles, Smile, ArrowRight } from 'lucide-react';
import { speakIndonesian } from '../utils/speechHelper';

interface QuickHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartInspection: () => void;
}

export const QuickHelpModal: React.FC<QuickHelpModalProps> = ({
  isOpen,
  onClose,
  onStartInspection,
}) => {
  if (!isOpen) return null;

  const handleReadGuide = () => {
    speakIndonesian(
      "Panduan mudah 3 langkah untuk Ibu dan Bapak. Pertama, periksa bak mandi, toren, dan pot bunga di rumah. " +
      "Kedua, jika semua bersih, tekan tombol hijau Semua Wadah Bersih. " +
      "Ketiga, tekan tombol Kirim Laporan. Selesai! Rumah Ibu aman dari demam berdarah."
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full border-2 border-emerald-500 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/20 rounded-2xl">
              <Smile className="w-7 h-7 text-amber-300" />
            </div>
            <div>
              <h3 className="font-black text-lg sm:text-xl">Panduan Mudah Ibu-Ibu & Lansia</h3>
              <p className="text-xs text-emerald-100">3 Langkah Cepat Cek Rumah Bebas Jentik Nyamuk</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-2 rounded-xl hover:bg-white/10"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-slate-800">
          {/* Audio read button */}
          <button
            onClick={handleReadGuide}
            className="w-full flex items-center justify-center gap-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 font-medium p-2.5 rounded-xl text-xs sm:text-sm transition-colors cursor-pointer"
          >
            <Volume2 className="w-4 h-4 text-emerald-600" />
            <span>Dengarkan Suara Panduan</span>
          </button>

          {/* 3 Simple Steps with large visual icons */}
          <div className="space-y-3">
            {/* Step 1 */}
            <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="w-7 h-7 rounded-lg bg-emerald-700 text-white font-semibold text-xs flex items-center justify-center shrink-0">
                1
              </div>
              <div>
                <h4 className="font-semibold text-xs sm:text-sm text-slate-900">Periksa Wadah Air di Rumah</h4>
                <p className="text-xs text-slate-600 leading-relaxed mt-0.5">
                  Cek bak mandi, ember, tatakan pot bunga, atau penampung air kulkas apakah ada jentik nyamuk.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="w-7 h-7 rounded-lg bg-emerald-700 text-white font-semibold text-xs flex items-center justify-center shrink-0">
                2
              </div>
              <div>
                <h4 className="font-semibold text-xs sm:text-sm text-slate-900">Tentukan Kondisi Wadah</h4>
                <p className="text-xs text-slate-600 leading-relaxed mt-0.5">
                  Pilih status bersih atau ada jentik, atau gunakan tombol cepat "Tandai Semua Bersih".
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="w-7 h-7 rounded-lg bg-emerald-700 text-white font-semibold text-xs flex items-center justify-center shrink-0">
                3
              </div>
              <div>
                <h4 className="font-semibold text-xs sm:text-sm text-slate-900">Kirim Laporan 1R1J</h4>
                <p className="text-xs text-slate-600 leading-relaxed mt-0.5">
                  Tekan tombol kirim. Laporan tersimpan dan siap dibagikan ke kader atau grup WhatsApp RT.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs text-slate-700 flex items-center gap-2">
            <Heart className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Luangkan waktu 5 menit secara berkala untuk lingkungan sehat bebas demam berdarah.
            </span>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-2">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 font-medium rounded-lg text-xs border border-slate-200 cursor-pointer"
          >
            Tutup
          </button>

          <button
            onClick={() => {
              onClose();
              onStartInspection();
            }}
            className="flex-1 flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white font-medium py-1.5 sm:py-2 px-3.5 rounded-lg text-xs sm:text-sm transition-colors cursor-pointer"
          >
            <span>Mulai Pemeriksaan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
