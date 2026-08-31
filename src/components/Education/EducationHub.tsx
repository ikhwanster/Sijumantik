import React, { useState } from 'react';
import { 
  BookOpen, 
  Activity, 
  Award, 
  HelpCircle, 
  ShieldCheck, 
  Sparkles, 
  Layers,
  Thermometer,
  Film
} from 'lucide-react';
import { MosquitoLifecycle } from './MosquitoLifecycle';
import { SymptomTriage } from './SymptomTriage';
import { JumantikQuiz } from './JumantikQuiz';
import { MediaSlider } from '../Media/MediaSlider';

interface EducationHubProps {
  onOpenSos: () => void;
  onNavigateTab?: (tabName: string) => void;
}

export const EducationHub: React.FC<EducationHubProps> = ({ onOpenSos, onNavigateTab }) => {
  const [activeEduTab, setActiveEduTab] = useState<'galeri' | 'triase' | 'siklus' | 'perbedaan' | 'kuis'>('galeri');

  return (
    <div className="space-y-5">
      {/* Top Media Slider Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-2xs">
        <MediaSlider onNavigateTab={onNavigateTab} />
      </div>

      {/* Navigation Subtabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
        <button
          onClick={() => setActiveEduTab('galeri')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-colors cursor-pointer ${
            activeEduTab === 'galeri'
              ? 'bg-slate-900 text-white'
              : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <Film className="w-3.5 h-3.5 text-emerald-400" />
          <span>Film & Poster 1R1J</span>
        </button>

        <button
          onClick={() => setActiveEduTab('triase')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-colors cursor-pointer ${
            activeEduTab === 'triase'
              ? 'bg-slate-900 text-white'
              : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <Thermometer className="w-3.5 h-3.5 text-rose-500" />
          <span>Fase Demam & Triase</span>
        </button>

        <button
          onClick={() => setActiveEduTab('siklus')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-colors cursor-pointer ${
            activeEduTab === 'siklus'
              ? 'bg-slate-900 text-white'
              : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <Activity className="w-3.5 h-3.5 text-emerald-500" />
          <span>Siklus Nyamuk Aedes</span>
        </button>

        <button
          onClick={() => setActiveEduTab('perbedaan')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-colors cursor-pointer ${
            activeEduTab === 'perbedaan'
              ? 'bg-slate-900 text-white'
              : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-cyan-500" />
          <span>Perbandingan Nyamuk</span>
        </button>

        <button
          onClick={() => setActiveEduTab('kuis')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-colors cursor-pointer ${
            activeEduTab === 'kuis'
              ? 'bg-slate-900 text-white'
              : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <Award className="w-3.5 h-3.5 text-amber-500" />
          <span>Kuis Jumantik</span>
        </button>
      </div>

      {/* Render Subtab Content */}
      {activeEduTab === 'galeri' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 space-y-4">
          <div>
            <h3 className="text-sm sm:text-base font-semibold text-slate-900">
              Pusat Edukasi Multimedia: Video Pembelajaran & Poster 3M Plus
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Materi visual resmi dari Kementerian Kesehatan RI dan Pokja DBD untuk edukasi keluarga dan kader jumantik lingkungan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="font-semibold text-slate-900 block text-xs sm:text-sm">
                🎥 Panduan Video Praktik 3M+ di Rumah
              </span>
              <p className="text-slate-600 leading-relaxed text-xs">
                Video tutorial langkah demi langkah menguras bak mandi, menutup drum penampungan toren air, dan memanfaatkan kembali barang bekas untuk menghentikan perkembangbiakan nyamuk.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="font-semibold text-slate-900 block text-xs sm:text-sm">
                📑 Poster & Infografis Edukasi Warga
              </span>
              <p className="text-slate-600 leading-relaxed text-xs">
                Poster dapat diunduh atau dibagikan ke grup WhatsApp RT/RW sebagai materi sosialisasi pencegahan demam berdarah dengue di lingkungan permukiman.
              </p>
            </div>
          </div>
        </div>
      )}

      {activeEduTab === 'triase' && <SymptomTriage onOpenSos={onOpenSos} />}
      {activeEduTab === 'siklus' && <MosquitoLifecycle />}
      {activeEduTab === 'kuis' && <JumantikQuiz />}

      {activeEduTab === 'perbedaan' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-7 shadow-xs space-y-6">
          <div>
            <h3 className="text-xl font-black text-slate-900">Perbedaan Spesies Nyamuk (Vektor Penyakit)</h3>
            <p className="text-xs text-slate-500">Mengenali morfologi, habitat bertelur, dan waktu menggigit nyamuk</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl border-2 border-emerald-400 bg-emerald-50/40 space-y-2 text-xs">
              <span className="text-xs font-black text-emerald-800 uppercase tracking-wider block">
                1. Aedes aegypti (Vektor DBD & Chikungunya)
              </span>
              <ul className="space-y-1 text-slate-700">
                <li>• <strong>Warna:</strong> Hitam legam dengan belang putih di kaki & punggung (lyre-shape).</li>
                <li>• <strong>Habitat:</strong> <u>Hanya di air jernih</u> (bak mandi, vas bunga, toren, ban).</li>
                <li>• <strong>Waktu Gigit:</strong> Pagi (08.00-10.00) & Sore (15.00-17.00).</li>
                <li>• <strong>Posisi Istirahat:</strong> Sejajar dengan permukaan dinding.</li>
              </ul>
            </div>

            <div className="p-4 rounded-2xl border border-slate-300 bg-slate-50 space-y-2 text-xs">
              <span className="text-xs font-black text-slate-800 uppercase tracking-wider block">
                2. Culex quinquefasciatus (Nyamuk Rumah Biasa / Kaki Gajah)
              </span>
              <ul className="space-y-1 text-slate-700">
                <li>• <strong>Warna:</strong> Cokelat kelabu kusam polos tanpa belang putih.</li>
                <li>• <strong>Habitat:</strong> Air kotor, selokan mampet, genangan got berbusa.</li>
                <li>• <strong>Waktu Gigit:</strong> Malam hari (22.00 - 04.00) saat tidur.</li>
                <li>• <strong>Suara:</strong> Dengung bising khas di telinga.</li>
              </ul>
            </div>

            <div className="p-4 rounded-2xl border border-slate-300 bg-slate-50 space-y-2 text-xs">
              <span className="text-xs font-black text-slate-800 uppercase tracking-wider block">
                3. Anopheles (Vektor Malaria)
              </span>
              <ul className="space-y-1 text-slate-700">
                <li>• <strong>Warna:</strong> Cokelat gelap dengan bercak pada sayap.</li>
                <li>• <strong>Habitat:</strong> Rawa-rawa, kubangan air berlumpur pedesaan, muara.</li>
                <li>• <strong>Waktu Gigit:</strong> Senja hingga subuh.</li>
                <li>• <strong>Posisi Istirahat:</strong> Menungging 45° dari permukaan.</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
