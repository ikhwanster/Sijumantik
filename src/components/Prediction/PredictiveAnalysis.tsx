import React, { useState } from 'react';
import { 
  TrendingUp, 
  CloudRain, 
  Thermometer, 
  Droplets, 
  AlertTriangle, 
  CheckCircle2, 
  Activity, 
  Sparkles, 
  Calendar, 
  ShieldAlert, 
  FileText,
  Calculator
} from 'lucide-react';
import { PREDICTION_FACTORS } from '../../data/initialData';
import { AreaZone } from '../../types/jumantik';

interface PredictiveAnalysisProps {
  zones: AreaZone[];
}

export const PredictiveAnalysis: React.FC<PredictiveAnalysisProps> = ({ zones }) => {
  const [selectedPeriodIndex, setSelectedPeriodIndex] = useState(1); // Next week (Peak rain)

  // Interactive Entomological Calculator state
  const [calcHousesInspected, setCalcHousesInspected] = useState(100);
  const [calcHousesPositive, setCalcHousesPositive] = useState(8);
  const [calcContainersInspected, setCalcContainersInspected] = useState(320);
  const [calcContainersPositive, setCalcContainersPositive] = useState(14);

  // Formulas
  const calculatedABJ = Math.max(0, Math.min(100, Number((((calcHousesInspected - calcHousesPositive) / Math.max(calcHousesInspected, 1)) * 100).toFixed(1))));
  const calculatedHI = Number(((calcHousesPositive / Math.max(calcHousesInspected, 1)) * 100).toFixed(1));
  const calculatedCI = Number(((calcContainersPositive / Math.max(calcContainersInspected, 1)) * 100).toFixed(1));
  const calculatedBI = Number(((calcContainersPositive / Math.max(calcHousesInspected, 1)) * 100).toFixed(1));

  const activePeriod = PREDICTION_FACTORS[selectedPeriodIndex];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 text-white rounded-2xl p-5 sm:p-7 shadow-lg">
        <div className="space-y-2 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 text-xs font-bold px-3 py-1 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>AI Predictive Modeling & Entomologi Kemenkes RI</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-black tracking-tight">
            Analisis Prediksi Risiko Wabah DBD (14 - 30 Hari)
          </h2>
          <p className="text-xs sm:text-sm text-indigo-100/90 leading-relaxed">
            Sistem permodelan cerdas mengintegrasikan parameter meteorologi (curah hujan BMKG, suhu, kelembaban) dengan densitas jentik lapangan untuk mengantisipasi lonjakan kasus secara preventif.
          </p>
        </div>
      </div>

      {/* Period Timeline Selector */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          Pilih Periode Proyeksi Prediksi:
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {PREDICTION_FACTORS.map((item, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedPeriodIndex(idx)}
              className={`p-3 rounded-xl border text-left transition-all ${
                selectedPeriodIndex === idx
                  ? 'bg-indigo-50/80 border-indigo-500 ring-2 ring-indigo-500/30'
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
              }`}
            >
              <p className="font-bold text-xs text-slate-900 mb-1">{item.period}</p>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-500">Skor Risiko:</span>
                <span
                  className={`font-black px-1.5 py-0.2 rounded ${
                    item.projectedRiskScore >= 80
                      ? 'bg-red-100 text-red-700'
                      : item.projectedRiskScore >= 60
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {item.projectedRiskScore} / 100
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Detailed Forecast Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Curah Hujan Proyeksi</span>
            <CloudRain className="w-5 h-5 text-indigo-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{activePeriod.rainfallMm}</span>
            <span className="text-xs font-bold text-slate-500">mm / minggu</span>
          </div>
          <p className="text-[11px] text-slate-600">
            {activePeriod.rainfallMm > 150
              ? '⚠️ Curah hujan tinggi memicu genangan masif di wadah luar rumah.'
              : 'Curah hujan sedang, genangan air relatif stabil.'}
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Suhu & Kelembaban</span>
            <Thermometer className="w-5 h-5 text-amber-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{activePeriod.avgTempC}°C</span>
            <span className="text-xs font-bold text-slate-500">| RH {activePeriod.humidityPct}%</span>
          </div>
          <p className="text-[11px] text-slate-600">
            Suhu 28-30°C adalah temperatur optimal pemendekan siklus telur ke nyamuk dewasa menjadi hanya 7 hari.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Estimasi Densitas Jentik</span>
            <Activity className="w-5 h-5 text-red-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-red-600">{activePeriod.predictedLarvaDensity}%</span>
            <span className="text-xs font-bold text-red-700 bg-red-50 px-1.5 py-0.5 rounded">
              Risiko Tinggi
            </span>
          </div>
          <p className="text-[11px] text-slate-600">
            Kenaikan populasi larva per 100 wadah jika tidak dilakukan gerakan 3M+ serentak.
          </p>
        </div>
      </div>

      {/* AI Decision & Tactical Recommendations Card */}
      <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl p-5 sm:p-6 shadow-md space-y-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 bg-indigo-500/20 text-indigo-300 rounded-xl border border-indigo-400/30">
            <Sparkles className="w-6 h-6 text-amber-300" />
          </div>
          <div>
            <h3 className="font-black text-base sm:text-lg">Rekomendasi Taktis Pengambilan Keputusan (Satgas & Lurah)</h3>
            <p className="text-xs text-indigo-200">Berdasarkan hasil analisis komputasi prediksi risiko periode {activePeriod.period}</p>
          </div>
        </div>

        <div className="bg-white/10 rounded-xl p-4 border border-white/10 space-y-2 text-xs">
          <p className="font-bold text-amber-300">Tindakan Prioritas:</p>
          <p className="text-white/95 leading-relaxed text-sm">{activePeriod.recommendedAction}</p>
        </div>
      </div>

      {/* Interactive Entomological Index Calculator (Kemenkes RI Standard) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-5">
        <div className="flex items-center gap-2 border-b pb-3">
          <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">Kalkulator Indeks Entomologi Kemenkes RI</h3>
            <p className="text-xs text-slate-500">Hitung nilai ABJ, House Index (HI), Container Index (CI), dan Breteau Index (BI)</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Jumlah Rumah Diperiksa:</label>
            <input
              type="number"
              value={calcHousesInspected}
              onChange={(e) => setCalcHousesInspected(Math.max(1, Number(e.target.value)))}
              className="w-full text-xs font-bold bg-slate-50 border border-slate-300 rounded-lg p-2.5"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Rumah Positif Jentik:</label>
            <input
              type="number"
              value={calcHousesPositive}
              onChange={(e) => setCalcHousesPositive(Number(e.target.value))}
              className="w-full text-xs font-bold bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-red-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Total Kontainer Diperiksa:</label>
            <input
              type="number"
              value={calcContainersInspected}
              onChange={(e) => setCalcContainersInspected(Math.max(1, Number(e.target.value)))}
              className="w-full text-xs font-bold bg-slate-50 border border-slate-300 rounded-lg p-2.5"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Kontainer Positif Jentik:</label>
            <input
              type="number"
              value={calcContainersPositive}
              onChange={(e) => setCalcContainersPositive(Number(e.target.value))}
              className="w-full text-xs font-bold bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-red-600"
            />
          </div>
        </div>

        {/* Calculated Results Table */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div
            className={`p-4 rounded-xl border text-center ${
              calculatedABJ >= 95 ? 'bg-emerald-50 border-emerald-300' : 'bg-red-50 border-red-300'
            }`}
          >
            <span className="text-[11px] font-bold uppercase text-slate-600">Angka Bebas Jentik (ABJ)</span>
            <div className="text-2xl font-black my-1 text-slate-900">{calculatedABJ}%</div>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                calculatedABJ >= 95 ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
              }`}
            >
              {calculatedABJ >= 95 ? 'Target Kemenkes Tercapai' : 'Di Bawah Standar (<95%)'}
            </span>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-center">
            <span className="text-[11px] font-bold uppercase text-slate-600">House Index (HI)</span>
            <div className="text-2xl font-black my-1 text-slate-900">{calculatedHI}%</div>
            <span className="text-[10px] text-slate-500">Persentase rumah positif</span>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-center">
            <span className="text-[11px] font-bold uppercase text-slate-600">Container Index (CI)</span>
            <div className="text-2xl font-black my-1 text-slate-900">{calculatedCI}%</div>
            <span className="text-[10px] text-slate-500">Persentase wadah positif</span>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-center">
            <span className="text-[11px] font-bold uppercase text-slate-600">Breteau Index (BI)</span>
            <div className="text-2xl font-black my-1 text-slate-900">{calculatedBI}</div>
            <span className="text-[10px] text-slate-500">Wadah positif per 100 rumah</span>
          </div>
        </div>
      </div>
    </div>
  );
};
