import React, { useState } from 'react';
import { 
  Building2, 
  Users, 
  ShieldAlert, 
  CheckCircle2, 
  BedDouble, 
  Activity, 
  Wind, 
  Plus, 
  Send, 
  Share2, 
  FileText,
  FileSpreadsheet, 
  Search, 
  Boxes, 
  Calendar, 
  UserCheck, 
  X,
  Printer,
  Download
} from 'lucide-react';
import { DengueCaseReport, FaskesFacility, HomeInspectionRecord, LogisticsItem } from '../../types/jumantik';
import { LogisticsManager } from './LogisticsManager';
import { exportDengueCasesToPdf, exportDengueCasesToExcel } from '../../utils/reportExporter';
import { playAlertTone } from '../../utils/audioAlert';

interface PuskesmasDashboardProps {
  cases: DengueCaseReport[];
  onUpdateCases: (updated: DengueCaseReport[]) => void;
  facilities: FaskesFacility[];
  inspections: HomeInspectionRecord[];
  logistics: LogisticsItem[];
  onUpdateLogistics: (updated: LogisticsItem[]) => void;
}

export const PuskesmasDashboard: React.FC<PuskesmasDashboardProps> = ({
  cases,
  onUpdateCases,
  facilities,
  inspections,
  logistics,
  onUpdateLogistics,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'pasien' | 'logistik' | 'inspeksi_warga'>('pasien');
  const [showAddCaseModal, setShowAddCaseModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Form states for new patient
  const [patientInitials, setPatientInitials] = useState('');
  const [age, setAge] = useState<number>(10);
  const [gender, setGender] = useState<'L' | 'P'>('L');
  const [address, setAddress] = useState('');
  const [rtRw, setRtRw] = useState('RT 03 / RW 03');
  const [feverDay, setFeverDay] = useState(3);
  const [diagnosis, setDiagnosis] = useState<DengueCaseReport['diagnosis']>('DBD Derajat II');
  const [plateletCount, setPlateletCount] = useState(85000);
  const [hematocrit, setHematocrit] = useState(44);
  const [status, setStatus] = useState<DengueCaseReport['status']>('rawat_inap');

  const filteredCases = cases.filter(
    (c) =>
      c.patientInitials.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.rtRw.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeInpatients = cases.filter((c) => c.status === 'rawat_inap' || c.status === 'rujukan_icu').length;
  const criticalCases = cases.filter((c) => c.diagnosis.includes('DSS') || c.status === 'rujukan_icu').length;

  const handleAddNewCase = (e: React.FormEvent) => {
    e.preventDefault();
    const newCase: DengueCaseReport = {
      id: `case-${Date.now()}`,
      patientInitials,
      age,
      gender,
      address,
      rtRw,
      feverDay,
      symptoms: ['Demam Tinggi Biphasic', 'Nyeri Sendi & Kepala', 'Mual'],
      warningSigns: diagnosis.includes('DSS') ? ['Akral Dingin', 'Nyeri Perut Hebat'] : [],
      diagnosis,
      plateletCount,
      hematocrit,
      status,
      faskesName: 'Puskesmas Sukamaju',
      reportedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      coordinates: { lat: -6.2130, lng: 106.8425 },
      foggingScheduled: status === 'rawat_inap' || status === 'rujukan_icu',
      foggingDate: '2026-08-23 06:30',
    };

    onUpdateCases([newCase, ...cases]);
    setShowAddCaseModal(false);
    setPatientInitials('');
    setAddress('');
  };

  const handleUpdateStatus = (id: string, newStatus: DengueCaseReport['status']) => {
    const next = cases.map((c) => (c.id === id ? { ...c, status: newStatus } : c));
    onUpdateCases(next);
  };

  const handleToggleFogging = (id: string) => {
    const next = cases.map((c) =>
      c.id === id
        ? {
            ...c,
            foggingScheduled: !c.foggingScheduled,
            foggingDate: !c.foggingScheduled ? '2026-08-23 06:30' : undefined,
          }
        : c
    );
    onUpdateCases(next);
  };

  const sendReferralWhatsApp = (c: DengueCaseReport) => {
    const text = encodeURIComponent(
      `*SURAT RUJUKAN DARURAT DBD - PUSKESMAS SUKAMAJU*\n` +
      `👤 Pasien: ${c.patientInitials} (${c.gender}/${c.age} tahun)\n` +
      `🏠 Alamat: ${c.address} (${c.rtRw})\n` +
      `🩺 Diagnosis: *${c.diagnosis}* (Demam Hari ke-${c.feverDay})\n` +
      `🩸 Trombosit: ${c.plateletCount?.toLocaleString()} /uL | Hematokrit: ${c.hematocrit}%\n` +
      `🚨 Status: *${c.status.toUpperCase()}*\n` +
      `Mohon kesiapan Ruang Rawat / ICU & Transfusi Trombosit RSUD Rujukan.`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Top Welcome Header */}
      <div className="bg-gradient-to-r from-cyan-900 via-teal-900 to-slate-900 text-white rounded-2xl p-5 sm:p-7 shadow-lg">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 text-xs font-bold px-3 py-1 rounded-full">
              <Building2 className="w-3.5 h-3.5" />
              <span>Sistem Integrasi Faskes & Satgas Pengendalian Vektor</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-black tracking-tight">
              Puskesmas Kecamatan & Dasbor Penanggulangan DBD
            </h2>
            <p className="text-xs sm:text-sm text-cyan-100/90 max-w-2xl">
              Koordinasi real-time verifikasi kartu pantau jentik warga (1R1J), triase gawat darurat, jadwal fogging fokus, dan alokasi logistik abate.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => {
                exportDengueCasesToPdf(cases);
                playAlertTone('success');
              }}
              className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-3.5 py-2.5 rounded-xl border border-white/20 flex items-center gap-1.5 transition-colors"
              title="Unduh Laporan Pasien PDF"
            >
              <FileText className="w-4 h-4 text-red-400" />
              <span>Unduh PDF</span>
            </button>

            <button
              onClick={() => {
                exportDengueCasesToExcel(cases);
                playAlertTone('success');
              }}
              className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-3.5 py-2.5 rounded-xl border border-white/20 flex items-center gap-1.5 transition-colors"
              title="Unduh Rekap Pasien Excel"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>Unduh XLSX</span>
            </button>

            <button
              onClick={() => setShowAddCaseModal(true)}
              className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-md shadow-red-600/30 flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>+ Input Kasus Pasien Baru</span>
            </button>
          </div>
        </div>
      </div>

      {/* Key Health Metrics Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <p className="text-xs font-medium text-slate-500">Pasien Rawat Inap Aktif</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-red-600">{activeInpatients}</span>
            <span className="text-xs text-slate-600">pasien di bangsal</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <p className="text-xs font-medium text-slate-500">Kasus Kritis / Syok (DSS)</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-rose-700">{criticalCases}</span>
            <span className="text-xs text-rose-700 font-bold bg-rose-50 px-1.5 py-0.5 rounded">
              Rujukan RSUD
            </span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <p className="text-xs font-medium text-slate-500">Kapasitas Bed DBD Puskesmas</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-emerald-600">8 / 25</span>
            <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
              Tersedia
            </span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <p className="text-xs font-medium text-slate-500">Laporan 1R1J Terintegrasi</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-cyan-700">{inspections.length}</span>
            <span className="text-xs text-slate-500">kartu masuk</span>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveSubTab('pasien')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeSubTab === 'pasien'
              ? 'bg-cyan-700 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Daftar Kasus & Triase Pasien ({cases.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('logistik')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeSubTab === 'logistik'
              ? 'bg-cyan-700 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Boxes className="w-4 h-4" />
          <span>Distribusi Logistik & Abate</span>
        </button>

        <button
          onClick={() => setActiveSubTab('inspeksi_warga')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeSubTab === 'inspeksi_warga'
              ? 'bg-cyan-700 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Validasi Pantauan 1R1J Warga</span>
        </button>
      </div>

      {/* Subtab Content: Pasien & Triase */}
      {activeSubTab === 'pasien' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden space-y-4 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Cari pasien, alamat, RW..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-3 py-2 focus:bg-white focus:outline-hidden"
              />
            </div>

            <div className="text-xs text-slate-500">
              Menampilkan <strong>{filteredCases.length}</strong> pasien tercatat
            </div>
          </div>

          {/* Patient Cards List */}
          <div className="divide-y divide-slate-100 border rounded-xl overflow-hidden">
            {filteredCases.map((c) => (
              <div
                key={c.id}
                className="p-4 hover:bg-slate-50 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-black text-sm text-slate-900">{c.patientInitials}</span>
                    <span className="text-xs text-slate-500">({c.gender}, {c.age} th)</span>
                    <span
                      className={`text-xs font-black px-2 py-0.5 rounded-full ${
                        c.diagnosis.includes('DSS') || c.diagnosis.includes('III')
                          ? 'bg-red-600 text-white animate-pulse'
                          : c.diagnosis.includes('II')
                          ? 'bg-amber-100 text-amber-900'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {c.diagnosis}
                    </span>
                    <span className="text-xs text-slate-600 bg-slate-100 px-2 py-0.5 rounded font-medium">
                      Demam Hari ke-{c.feverDay}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 font-medium">
                    📍 {c.address} ({c.rtRw}) | Faskes: <strong>{c.faskesName}</strong>
                  </p>

                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-slate-600">
                      Trombosit: <strong className="text-red-600">{c.plateletCount ? `${c.plateletCount.toLocaleString()} /uL` : '-'}</strong>
                    </span>
                    <span className="text-slate-600">
                      Hematokrit: <strong className="text-slate-900">{c.hematocrit}%</strong>
                    </span>
                    <span className="text-slate-400">| Lapor: {c.reportedAt}</span>
                  </div>
                </div>

                {/* Actions & Status Dropdown */}
                <div className="flex flex-wrap items-center gap-2">
                  <select
                    value={c.status}
                    onChange={(e) => handleUpdateStatus(c.id, e.target.value as any)}
                    className="text-xs font-bold bg-slate-50 border border-slate-300 rounded-lg p-1.5 text-slate-800"
                  >
                    <option value="rawat_inap">Rawat Inap</option>
                    <option value="rawat_jalan">Rawat Jalan</option>
                    <option value="rujukan_icu">Rujukan ICU RSUD</option>
                    <option value="sembuh">Sembuh</option>
                  </select>

                  <button
                    onClick={() => handleToggleFogging(c.id)}
                    className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1.5 rounded-lg transition-colors ${
                      c.foggingScheduled
                        ? 'bg-purple-100 text-purple-800 border border-purple-300'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    <Wind className="w-3.5 h-3.5" />
                    <span>{c.foggingScheduled ? 'Fogging Terjadwal' : '+ Jadwal Fogging'}</span>
                  </button>

                  <button
                    onClick={() => sendReferralWhatsApp(c)}
                    className="flex items-center gap-1 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1.5 rounded-lg shadow-xs"
                    title="Kirim Rujukan WhatsApp"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Rujuk WA</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subtab Content: Logistik */}
      {activeSubTab === 'logistik' && (
        <LogisticsManager logistics={logistics} onUpdateLogistics={onUpdateLogistics} />
      )}

      {/* Subtab Content: Validasi Pantauan Warga */}
      {activeSubTab === 'inspeksi_warga' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 text-sm">Daftar Laporan 1R1J dari Warga untuk Diverifikasi Kader</h3>
          <div className="divide-y divide-slate-100">
            {inspections.map((insp) => (
              <div key={insp.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                <div>
                  <p className="font-bold text-slate-900">{insp.houseAddress}, RT {insp.rt}/RW {insp.rw}</p>
                  <p className="text-slate-500">Jumantik: {insp.inspectorName} | Status: {insp.status.toUpperCase()}</p>
                </div>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                  Sudah Terintegrasi
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal Add New Case */}
      {showAddCaseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <form onSubmit={handleAddNewCase} className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-5 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Plus className="w-5 h-5 text-red-600" />
                <span>Input Data Pasien DBD Baru</span>
              </h3>
              <button type="button" onClick={() => setShowAddCaseModal(false)} className="text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Inisial / Nama Pasien:</label>
                <input
                  type="text"
                  required
                  value={patientInitials}
                  onChange={(e) => setPatientInitials(e.target.value)}
                  placeholder="Contoh: An. Farhan (10 th)"
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Usia (th):</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Gender:</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2"
                  >
                    <option value="L">Laki-laki</option>
                    <option value="P">Perempuan</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Alamat Domisili:</label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Jl. Melati No. 12"
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2 focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Wilayah RT / RW:</label>
                <input
                  type="text"
                  value={rtRw}
                  onChange={(e) => setRtRw(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Demam Hari ke-:</label>
                <input
                  type="number"
                  value={feverDay}
                  onChange={(e) => setFeverDay(Number(e.target.value))}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Diagnosis Klinis:</label>
                <select
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value as any)}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2"
                >
                  <option value="Demam Dengue">Demam Dengue (Ringan)</option>
                  <option value="DBD Derajat I">DBD Derajat I</option>
                  <option value="DBD Derajat II">DBD Derajat II (Spontan)</option>
                  <option value="DBD Derajat III (DSS)">DBD Derajat III (Syok / DSS)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Status Perawatan:</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2"
                >
                  <option value="rawat_inap">Rawat Inap Puskesmas</option>
                  <option value="rujukan_icu">Rujukan RSUD</option>
                  <option value="rawat_jalan">Rawat Jalan</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Jumlah Trombosit (/uL):</label>
                <input
                  type="number"
                  value={plateletCount}
                  onChange={(e) => setPlateletCount(Number(e.target.value))}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Hematokrit (%):</label>
                <input
                  type="number"
                  value={hematocrit}
                  onChange={(e) => setHematocrit(Number(e.target.value))}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs py-2.5 rounded-xl shadow-xs"
            >
              Simpan & Integrasikan ke GIS Map
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
