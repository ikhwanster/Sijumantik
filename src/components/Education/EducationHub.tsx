import React, { useState } from 'react';
import { 
  BookOpen, 
  Activity, 
  Award, 
  HelpCircle, 
  ShieldCheck, 
  Sparkles, 
  Layers,
  Thermometer
} from 'lucide-react';
import { MosquitoLifecycle } from './MosquitoLifecycle';
import { SymptomTriage } from './SymptomTriage';
import { JumantikQuiz } from './JumantikQuiz';

interface EducationHubProps {
  onOpenSos: () => void;
}

export const EducationHub: React.FC<EducationHubProps> = ({ onOpenSos }) => {
  const [activeEduTab, setActiveEduTab] = useState<'siklus' | 'triase' | 'perbedaan' | 'kuis'>('triase');

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-emerald-900 to-slate-900 text-white rounded-2xl p-5 sm:p-7 shadow-lg">
        <div className="space-y-2 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 bg-teal-500/20 border border-teal-400/30 text-teal-200 text-xs font-bold px-3 py-1 rounded-full">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Pusat Edukasi Visual & Interaktif DBD</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-black tracking-tight">
            Edukasi Pencegahan & Pengenalan Gejala DBD Keluarga
          </h2>
          <p className="text-xs sm:text-sm text-teal-100/90 leading-relaxed">
            Pahami siklus metamorfosis nyamuk, kenali fase kritis pelana kuda, hitung kebutuhan hidrasi cairan, dan uji wawasan keluarga Anda melalui kuis cerdas berhadiah sertifikat.
          </p>
        </div>
      </div>

      {/* Navigation Subtabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        <button
          onClick={() => setActiveEduTab('triase')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
            activeEduTab === 'triase'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Thermometer className="w-4 h-4 text-rose-500" />
          <span>Fase Demam & Triase Kritis</span>
        </button>

        <button
          onClick={() => setActiveEduTab('siklus')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
            activeEduTab === 'siklus'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Activity className="w-4 h-4 text-emerald-500" />
          <span>Siklus Nyamuk Aedes</span>
        </button>

        <button
          onClick={() => setActiveEduTab('perbedaan')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
            activeEduTab === 'perbedaan'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Layers className="w-4 h-4 text-cyan-500" />
          <span>Perbandingan Nyamuk</span>
        </button>

        <button
          onClick={() => setActiveEduTab('kuis')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
            activeEduTab === 'kuis'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Award className="w-4 h-4 text-amber-500" />
          <span>Kuis Jumantik Cerdas</span>
        </button>
      </div>

      {/* Render Subtab Content */}
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
