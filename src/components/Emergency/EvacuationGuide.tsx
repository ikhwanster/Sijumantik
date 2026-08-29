import React, { useState } from 'react';
import { 
  AlertTriangle, 
  ShieldCheck, 
  CheckSquare, 
  Square, 
  PhoneCall, 
  FileText, 
  LifeBuoy, 
  CloudRain, 
  Sparkles, 
  ArrowRight,
  Printer
} from 'lucide-react';
import { playAlertTone } from '../../utils/audioAlert';

interface EvacuationGuideProps {
  onOpenSos: () => void;
}

export const EvacuationGuide: React.FC<EvacuationGuideProps> = ({ onOpenSos }) => {
  const [checkedDocs, setCheckedDocs] = useState<{ [key: string]: boolean }>({
    'ktp_bpjs': true,
    'catatan_demam': false,
    'hasil_lab': false,
    'baju_ganti': false,
    'air_minum': true,
  });

  const toggleDoc = (key: string) => {
    setCheckedDocs({ ...checkedDocs, [key]: !checkedDocs[key] });
  };

  const EVACUATION_STEPS = [
    {
      step: 1,
      title: 'Identifikasi Tanda Kegawatan Pasien (Triase Cepat)',
      desc: 'Periksa apakah pasien mengalami akral dingin (ujung jari dingin/lembab), muntah terus menerus, nyeri perut hebat, atau penurunan kesadaran. Jika ada satu saja tanda ini, pasien harus segera dievakuasi dalam waktu <30 menit!',
      tag: 'Kritis'
    },
    {
      step: 2,
      title: 'Pemberian Hidrasi Darurat Pra-Transportasi',
      desc: 'Beri minum 1-2 gelas larutan oralit, air kelapa muda, atau jus buah manis sebelum berangkat. Jika pasien mual parah, berikan sedikit-sedikit menggunakan sendok setiap 2 menit.',
      tag: 'Hidrasi'
    },
    {
      step: 3,
      title: 'Posisi Pasien Selama Perjalanan (Posisi Syok)',
      desc: 'Baringkan pasien di jok belakang mobil atau tandu dengan posisi kaki ditinggikan 15-30 derajat dari kepala (posisi Trendelenburg) untuk memaksimalkan aliran darah ke otak dan jantung.',
      tag: 'Posisi'
    },
    {
      step: 4,
      title: 'Hubungi IGD Faskes Tujuan Sebelum Tiba',
      desc: 'Telepon Puskesmas atau IGD RSUD untuk memastikan ketersediaan bed, infus Ringer Lactate, dan dokter jaga agar tindakan resusitasi cairan langsung siap saat pasien tiba.',
      tag: 'Koordinasi'
    },
    {
      step: 5,
      title: 'Serah Terima Data Medis di IGD',
      desc: 'Sampaikan catatan hari ke berapa demam dimulai, jumlah urine terakhir, obat yang telah diberikan (pastikan hanya Parasetamol), dan hasil tes darah jika ada.',
      tag: 'Rujukan'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-rose-900 via-red-900 to-slate-900 text-white rounded-2xl p-5 sm:p-7 shadow-lg">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-1.5 bg-red-500/20 border border-red-400/30 text-red-200 text-xs font-bold px-3 py-1 rounded-full">
              <LifeBuoy className="w-3.5 h-3.5" />
              <span>Standar Operasional Prosedur (SOP) Mitigasi & Evakuasi</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-black tracking-tight">
              Panduan Langkah demi Langkah Evakuasi Pasien & Mitigasi DBD
            </h2>
            <p className="text-xs sm:text-sm text-red-100/90 leading-relaxed">
              Petunjuk resmi tanggap darurat evakuasi kegawatan Demam Berdarah Dengue (DSS) dan mitigasi sanitasi pasca-bencana banjir/musim hujan.
            </p>
          </div>

          <button
            onClick={onOpenSos}
            className="bg-red-600 hover:bg-red-700 text-white font-black text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-md shadow-red-600/30 flex items-center gap-1.5 shrink-0 animate-pulse"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Panggil Bantuan SOS</span>
          </button>
        </div>
      </div>

      {/* Step-by-Step Timeline Cards */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-7 shadow-xs space-y-6">
        <div>
          <h3 className="text-lg font-black text-slate-900">Alur Evakuasi Pasien Gawat Darurat DBD (Dengue Shock Syndrome)</h3>
          <p className="text-xs text-slate-500">Ikuti urutan 5 langkah berikut untuk menyelamatkan nyawa pasien</p>
        </div>

        <div className="space-y-4">
          {EVACUATION_STEPS.map((step) => (
            <div
              key={step.step}
              className="p-4 sm:p-5 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-red-300 transition-all flex flex-col sm:flex-row items-start gap-4"
            >
              <div className="w-10 h-10 rounded-2xl bg-red-600 text-white flex items-center justify-center font-black text-base shrink-0 shadow-xs">
                {step.step}
              </div>

              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm sm:text-base text-slate-900">{step.title}</h4>
                  <span className="text-[10px] font-black bg-red-100 text-red-700 px-2 py-0.5 rounded-full uppercase">
                    {step.tag}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Checklist Dokumen & Logistik Evakuasi */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
              <CheckSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">Checklist Tas Darurat Pasien</h3>
              <p className="text-xs text-slate-500">Siapkan dalam 5 menit sebelum berangkat ke Faskes</p>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            {[
              { id: 'ktp_bpjs', label: 'Kartu Identitas (KTP) & Kartu BPJS Kesehatan / Asuransi' },
              { id: 'catatan_demam', label: 'Buku Catatan Riwayat Demam & Waktu Minum Obat' },
              { id: 'hasil_lab', label: 'Hasil Tes Darah / Laboratorium Sebelumnya (jika ada)' },
              { id: 'air_minum', label: 'Botol Air Minum / Larutan Oralit Siap Minum' },
              { id: 'baju_ganti', label: 'Baju Ganti Longgar & Selimut Hangat' },
            ].map((item) => {
              const isChecked = checkedDocs[item.id];
              return (
                <div
                  key={item.id}
                  onClick={() => toggleDoc(item.id)}
                  className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                    isChecked
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-bold'
                      : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  {isChecked ? (
                    <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                  <span>{item.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mitigasi Bencana Lingkungan Pasca-Hujan / Banjir */}
        <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-100 text-indigo-700 rounded-xl">
              <CloudRain className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">Mitigasi Sanitasi Pasca-Banjir / Hujan</h3>
              <p className="text-xs text-slate-500">Mencegah lonjakan telur nyamuk menetas massal</p>
            </div>
          </div>

          <div className="space-y-2 text-xs text-slate-700">
            <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 space-y-1">
              <p className="font-bold text-indigo-900">1. Kuras & Keringkan Penampungan Air Banjir</p>
              <p className="text-slate-600">Air sisa banjir yang terperangkap di ember dan cekungan tanah harus segera dialirkan atau diserap ke tanah berpasir.</p>
            </div>

            <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 space-y-1">
              <p className="font-bold text-indigo-900">2. Disinfeksi & Tabur Bubuk Larvasida (Abate)</p>
              <p className="text-slate-600">Taburkan 1 bungkus abate untuk setiap toren atau bak air bersih yang tidak memungkinkan dikuras setiap hari.</p>
            </div>

            <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 space-y-1">
              <p className="font-bold text-indigo-900">3. Kerja Bakti Massal RT/RW di Akhir Pekan</p>
              <p className="text-slate-600">Angkut seluruh sampah botol, ban bekas, dan plastik terbuka yang teronggok di halaman warga ke TPS.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
