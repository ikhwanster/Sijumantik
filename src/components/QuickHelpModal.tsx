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
            className="w-full flex items-center justify-center gap-2 bg-amber-50 hover:bg-amber-100 border-2 border-amber-300 text-amber-950 font-bold p-3 rounded-2xl text-sm transition-all"
          >
            <Volume2 className="w-5 h-5 text-amber-700" />
            <span>🔊 Tekan Disini Untuk Mendengarkan Suara Panduan</span>
          </button>

          {/* 3 Simple Steps with large visual icons */}
          <div className="space-y-3">
            {/* Step 1 */}
            <div className="flex items-start gap-3.5 p-3.5 bg-emerald-50/80 rounded-2xl border border-emerald-200">
              <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white font-black text-lg flex items-center justify-center shrink-0">
                1
              </div>
              <div>
                <h4 className="font-extrabold text-sm sm:text-base text-emerald-950">Lihat Wadah Air di Rumah</h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-0.5">
                  Cek bak mandi, ember, tatakan pot bunga, atau penampung air kulkas apakah ada jentik (jentik nyamuk berenang).
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start gap-3.5 p-3.5 bg-teal-50/80 rounded-2xl border border-teal-200">
              <div className="w-10 h-10 rounded-2xl bg-teal-600 text-white font-black text-lg flex items-center justify-center shrink-0">
                2
              </div>
              <div>
                <h4 className="font-extrabold text-sm sm:text-base text-teal-950">Pilih Bersih atau Ada Jentik</h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-0.5">
                  Bila semua bersih, cukup klik tombol besar <strong>"🌟 Alhamdulillah, Semua Bersih"</strong>.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start gap-3.5 p-3.5 bg-cyan-50/80 rounded-2xl border border-cyan-200">
              <div className="w-10 h-10 rounded-2xl bg-cyan-700 text-white font-black text-lg flex items-center justify-center shrink-0">
                3
              </div>
              <div>
                <h4 className="font-extrabold text-sm sm:text-base text-cyan-950">Tekan Kirim Laporan</h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-0.5">
                  Klik tombol hijau besar <strong>"Kirim Laporan"</strong>. Laporan otomatis tercatat dan bisa dibagikan ke WhatsApp RT!
                </p>
              </div>
            </div>
          </div>

          <div className="bg-amber-100/70 p-3 rounded-2xl border border-amber-300 text-xs text-amber-950 flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500 fill-red-500 shrink-0" />
            <span>
              <strong>Pesan Sayang:</strong> Luangkan waktu 5 menit setiap Jumat pagi untuk menguras bak mandi demi kesehatan cucu dan keluarga!
            </span>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl text-xs sm:text-sm"
          >
            Tutup
          </button>

          <button
            onClick={() => {
              onClose();
              onStartInspection();
            }}
            className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black py-2.5 sm:py-3 px-4 rounded-xl text-sm sm:text-base shadow-md shadow-emerald-600/30"
          >
            <span>Mulai Isi Form Sekarang</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
