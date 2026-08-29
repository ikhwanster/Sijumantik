import React, { useState } from 'react';
import { 
  Activity, 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  Droplet, 
  Thermometer, 
  Heart, 
  Calculator, 
  PhoneCall,
  Info
} from 'lucide-react';
import { DENGUE_PHASES, SymptomPhase } from '../../data/educationData';
import { playAlertTone } from '../../utils/audioAlert';

interface SymptomTriageProps {
  onOpenSos: () => void;
}

export const SymptomTriage: React.FC<SymptomTriageProps> = ({ onOpenSos }) => {
  const [selectedDay, setSelectedDay] = useState(4); // Default to Critical phase Day 4
  const [patientWeightKg, setPatientWeightKg] = useState(50);
  const [checkedWarningSigns, setCheckedWarningSigns] = useState<string[]>([]);

  // Find active phase according to day
  const currentPhase: SymptomPhase =
    selectedDay <= 3
      ? DENGUE_PHASES[0]
      : selectedDay <= 5
      ? DENGUE_PHASES[1]
      : DENGUE_PHASES[2];

  // Fluid calculator formula (Holiday-Segar standard for Dengue maintenance fluid):
  // 100 ml/kg for first 10kg + 50 ml/kg for next 10kg + 20 ml/kg for remaining weight
  const calculateMaintenanceFluid = (weight: number) => {
    let totalMl = 0;
    if (weight <= 10) totalMl = weight * 100;
    else if (weight <= 20) totalMl = 1000 + (weight - 10) * 50;
    else totalMl = 1500 + (weight - 20) * 20;

    const mlPerHour = Math.round(totalMl / 24);
    const dropsPerMinute = Math.round(mlPerHour * (20 / 60)); // Micro/macro factor approx
    return { totalMl, mlPerHour, dropsPerMinute };
  };

  const fluidData = calculateMaintenanceFluid(patientWeightKg);

  const WARNING_LIST = [
    'Nyeri perut hebat atau nyeri tekan pada ulu hati',
    'Muntah terus-menerus (> 3 kali dalam 24 jam)',
    'Perdarahan mukosa (mimisan hidung, gusi berdarah, BAB hitam)',
    'Letargi / sangat lemas, gelisah, mengantuk abnormal',
    'Ujung tangan dan kaki teraba dingin dan lembab (akral dingin)',
    'Tidak buang air kecil (kencing) lebih dari 6 jam',
    'Sesak napas atau napas menjadi cepat terengah-engah',
  ];

  const toggleWarning = (item: string) => {
    if (checkedWarningSigns.includes(item)) {
      setCheckedWarningSigns(checkedWarningSigns.filter((s) => s !== item));
    } else {
      setCheckedWarningSigns([...checkedWarningSigns, item]);
      playAlertTone('emergency');
    }
  };

  const hasCriticalWarning = checkedWarningSigns.length > 0;

  return (
    <div className="space-y-6">
      {/* Interactive Saddleback Fever Curve Explorer */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-7 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-rose-50 text-rose-700 text-xs font-bold px-3 py-1 rounded-full border border-rose-200">
              <Thermometer className="w-3.5 h-3.5" />
              <span>Simulasi Fase Pelana Kuda (Saddleback Fever Curve)</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
              Perjalanan Demam Berdarah Hari demi Hari
            </h3>
          </div>

          {/* Day selection slider */}
          <div className="bg-slate-100 p-2 rounded-2xl flex items-center gap-1 w-full md:w-auto overflow-x-auto">
            {[1, 2, 3, 4, 5, 6, 7].map((day) => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                  selectedDay === day
                    ? day <= 3
                      ? 'bg-amber-500 text-white shadow-xs'
                      : day <= 5
                      ? 'bg-red-600 text-white shadow-xs animate-pulse'
                      : 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-white'
                }`}
              >
                Hari {day}
              </button>
            ))}
          </div>
        </div>

        {/* Visual Graph Curve of Saddleback Fever */}
        <div className="bg-slate-950 rounded-2xl p-4 sm:p-6 text-white relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Kurva Suhu Tubuh (°C) & Risiko Kebocoran Plasma</span>
            <span className="font-bold text-amber-400">
              Hari Terpilih: <strong>Hari ke-{selectedDay} ({currentPhase.title})</strong>
            </span>
          </div>

          {/* SVG Curve */}
          <svg viewBox="0 0 700 180" className="w-full h-36 sm:h-44">
            <defs>
              <linearGradient id="curveFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ef4444" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Temperature lines */}
            <line x1="40" y1="30" x2="680" y2="30" stroke="#334155" strokeDasharray="3 3" />
            <text x="10" y="34" fill="#94a3b8" fontSize="10">40°C</text>

            <line x1="40" y1="80" x2="680" y2="80" stroke="#334155" strokeDasharray="3 3" />
            <text x="10" y="84" fill="#94a3b8" fontSize="10">38°C</text>

            <line x1="40" y1="130" x2="680" y2="130" stroke="#334155" strokeDasharray="3 3" />
            <text x="10" y="134" fill="#94a3b8" fontSize="10">36.5°C</text>

            {/* Critical Phase Highlight Zone (Day 4 - 5) */}
            <rect x="310" y="15" width="190" height="135" fill="#ef4444" fillOpacity="0.18" rx="8" />
            <text x="405" y="30" textAnchor="middle" fill="#f87171" fontSize="10" fontWeight="bold">
              FASE KRITIS (WASPADA SYOK)
            </text>

            {/* Temperature Path (Saddleback dip) */}
            <path
              d="M 50 40 Q 150 30 240 55 T 400 135 T 520 85 T 660 120"
              fill="none"
              stroke="#fb7185"
              strokeWidth="4"
              strokeLinecap="round"
            />

            {/* Day indicator circles */}
            {[
              { d: 1, cx: 80, cy: 38 },
              { d: 2, cx: 160, cy: 35 },
              { d: 3, cx: 240, cy: 55 },
              { d: 4, cx: 350, cy: 120 },
              { d: 5, cx: 440, cy: 130 },
              { d: 6, cx: 540, cy: 90 },
              { d: 7, cx: 640, cy: 120 },
            ].map((p) => {
              const isCurrent = p.d === selectedDay;
              return (
                <g key={p.d} className="cursor-pointer" onClick={() => setSelectedDay(p.d)}>
                  {isCurrent && (
                    <circle cx={p.cx} cy={p.cy} r="12" fill="#38bdf8" fillOpacity="0.3" className="animate-ping" />
                  )}
                  <circle
                    cx={p.cx}
                    cy={p.cy}
                    r={isCurrent ? '7' : '5'}
                    fill={isCurrent ? '#38bdf8' : p.d <= 3 ? '#fbbf24' : p.d <= 5 ? '#ef4444' : '#10b981'}
                    stroke="#ffffff"
                    strokeWidth="2"
                  />
                  <text x={p.cx} y="165" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="bold">
                    H-{p.d}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Phase Details Card */}
        <div
          className={`p-5 rounded-2xl border transition-all ${
            currentPhase.dangerLevel === 'kritis'
              ? 'bg-red-50/80 border-red-300 ring-1 ring-red-400'
              : currentPhase.dangerLevel === 'sedang'
              ? 'bg-amber-50/80 border-amber-300'
              : 'bg-emerald-50/80 border-emerald-300'
          }`}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
            <div>
              <span
                className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                  currentPhase.dangerLevel === 'kritis'
                    ? 'bg-red-600 text-white animate-pulse'
                    : currentPhase.dangerLevel === 'sedang'
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-emerald-600 text-white'
                }`}
              >
                {currentPhase.dangerLevel.toUpperCase()}
              </span>
              <h4 className="text-lg font-black text-slate-900 mt-1">{currentPhase.title}</h4>
              <p className="text-xs font-bold text-slate-600">{currentPhase.temperature}</p>
            </div>

            {currentPhase.dangerLevel === 'kritis' && (
              <button
                onClick={onOpenSos}
                className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-md animate-pulse flex items-center gap-1.5"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Panggil Ambulans / Puskesmas</span>
              </button>
            )}
          </div>

          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mb-4">
            {currentPhase.description}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="bg-white/80 p-3.5 rounded-xl border border-slate-200/80 space-y-1.5">
              <p className="font-bold text-slate-900">Gejala Khas yang Muncul:</p>
              <ul className="space-y-1">
                {currentPhase.symptomsList.map((sym, idx) => (
                  <li key={idx} className="flex items-start gap-1.5 text-slate-700">
                    <span className="text-red-500 font-bold">•</span>
                    <span>{sym}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white/80 p-3.5 rounded-xl border border-slate-200/80 space-y-1.5">
              <p className="font-bold text-slate-900">Tindakan Medis & Hidrasi:</p>
              <ul className="space-y-1">
                {currentPhase.medicalActions.map((act, idx) => (
                  <li key={idx} className="flex items-start gap-1.5 text-slate-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{act}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-2 pt-2 border-t text-[11px] text-slate-600 font-medium">
                💧 <strong>Kebutuhan Cairan:</strong> {currentPhase.fluidGuideline}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Warning Signs Triage (Tanda Bahaya Syok) */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-7 shadow-xs space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-red-100 text-red-800 text-xs font-bold px-3 py-1 rounded-full border border-red-300">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Triase Mandiri: Cek Tanda Bahaya DBD (Warning Signs WHO)</span>
            </div>
            <h3 className="text-lg font-black text-slate-900 mt-1">
              Apakah Pasien Mengalami Salah Satu Gejala Bahaya Ini?
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {WARNING_LIST.map((sign, idx) => {
            const isChecked = checkedWarningSigns.includes(sign);
            return (
              <label
                key={idx}
                className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                  isChecked
                    ? 'bg-red-50 border-red-400 ring-1 ring-red-400 font-bold text-red-900'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleWarning(sign)}
                  className="mt-0.5 rounded text-red-600 focus:ring-red-500 w-4 h-4"
                />
                <span className="text-xs leading-snug">{sign}</span>
              </label>
            );
          })}
        </div>

        {/* Warning signs result action */}
        {hasCriticalWarning && (
          <div className="bg-red-600 text-white p-4 rounded-2xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3 animate-in fade-in">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-8 h-8 text-amber-300 shrink-0 animate-bounce" />
              <div>
                <h4 className="font-black text-sm sm:text-base">
                  TERDETEKSI TANDA BAHAYA SYOK ({checkedWarningSigns.length} Tanda)
                </h4>
                <p className="text-xs text-white/90">
                  Pasien berada dalam kondisi kegawatdaruratan medis. JANGAN DITUNDA, segera bawa ke IGD Puskesmas / Rumah Sakit!
                </p>
              </div>
            </div>

            <button
              onClick={onOpenSos}
              className="bg-white hover:bg-red-50 text-red-700 font-black text-xs px-4 py-2.5 rounded-xl shrink-0 shadow-md"
            >
              Lihat Alur Evakuasi & Hotline
            </button>
          </div>
        )}
      </div>

      {/* Interactive Fluid Hydration Calculator */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-7 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b pb-3">
          <div className="p-2 bg-cyan-100 text-cyan-700 rounded-xl">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">Kalkulator Kebutuhan Cairan Pasien DBD (Holliday-Segar)</h3>
            <p className="text-xs text-slate-500">Mencegah dehidrasi dan syok hipovolemik tanpa kelebihan cairan</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Berat Badan Pasien (Kg):</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="5"
                max="120"
                value={patientWeightKg}
                onChange={(e) => setPatientWeightKg(Math.max(1, Number(e.target.value)))}
                className="w-full text-sm font-black bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900"
              />
              <span className="text-xs font-bold text-slate-500">Kg</span>
            </div>
          </div>

          <div className="bg-cyan-50 border border-cyan-200 p-3.5 rounded-2xl text-center">
            <span className="text-[11px] font-bold text-cyan-800">Total Cairan 24 Jam:</span>
            <div className="text-2xl font-black text-cyan-950 mt-0.5">{fluidData.totalMl.toLocaleString()} mL</div>
            <span className="text-[10px] text-cyan-700">Air putih, oralit, jus, atau infus</span>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-2xl text-center">
            <span className="text-[11px] font-bold text-emerald-800">Laju Minum per Jam:</span>
            <div className="text-2xl font-black text-emerald-950 mt-0.5">~{fluidData.mlPerHour} mL/jam</div>
            <span className="text-[10px] text-emerald-700">Setara ~1 gelas kecil per jam</span>
          </div>
        </div>

        {/* Medication warning reminder */}
        <div className="bg-amber-50 border border-amber-300 rounded-xl p-3 text-xs text-amber-900 flex items-start gap-2">
          <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <strong>PERINGATAN OBAT:</strong> Gunakan HANYA <strong>Parasetamol</strong> untuk penurun panas. <u>DILARANG</u> mengonsumsi Ibuprofen, Aspirin, atau Asam Mefenamat karena dapat memicu iritasi lambung dan perdarahan hebat.
          </div>
        </div>
      </div>
    </div>
  );
};
