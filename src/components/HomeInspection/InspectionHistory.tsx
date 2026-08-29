import React, { useState } from 'react';
import { 
  History, 
  CheckCircle2, 
  AlertTriangle, 
  Calendar, 
  MapPin, 
  User, 
  FileText, 
  FileSpreadsheet,
  Printer, 
  Share2, 
  Eye,
  X,
  Award,
  Download
} from 'lucide-react';
import { HomeInspectionRecord } from '../../types/jumantik';
import { exportInspectionsToPdf, exportInspectionsToExcel, exportSingleInspectionToPdf } from '../../utils/reportExporter';
import { playAlertTone } from '../../utils/audioAlert';

interface InspectionHistoryProps {
  inspections: HomeInspectionRecord[];
  onNewInspection: () => void;
}

export const InspectionHistory: React.FC<InspectionHistoryProps> = ({
  inspections,
  onNewInspection,
}) => {
  const [selectedInspection, setSelectedInspection] = useState<HomeInspectionRecord | null>(null);
  const [showCertificate, setShowCertificate] = useState(false);

  const cleanInspections = inspections.filter((i) => i.status === 'bebas_jentik').length;
  const complianceRate = Math.round((cleanInspections / Math.max(inspections.length, 1)) * 100);

  const handlePrintCertificate = () => {
    window.print();
  };

  const handleDownloadPdf = () => {
    exportInspectionsToPdf(inspections);
    playAlertTone('success');
  };

  const handleDownloadExcel = () => {
    exportInspectionsToExcel(inspections);
    playAlertTone('success');
  };

  const handleDownloadSinglePdf = (item: HomeInspectionRecord) => {
    exportSingleInspectionToPdf(item);
    playAlertTone('success');
  };

  return (
    <div className="space-y-6">
      {/* Top summary stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <p className="text-xs text-slate-500 font-medium">Total Pemantauan 1R1J</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-slate-900">{inspections.length}</span>
            <span className="text-xs text-slate-500">kali inspeksi</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <p className="text-xs text-slate-500 font-medium">Tingkat Bebas Jentik Rumah</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-emerald-600">{complianceRate}%</span>
            <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
              Target Kemenkes ≥ 95%
            </span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-medium">Sertifikat 1R1J</p>
            <p className="text-sm font-bold text-slate-800">Keluarga Bebas Jentik</p>
          </div>
          <button
            onClick={() => setShowCertificate(true)}
            className="flex items-center gap-1 text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white px-3 py-2 rounded-xl shadow-xs"
          >
            <Award className="w-4 h-4" />
            <span>Lihat Sertifikat</span>
          </button>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-emerald-600" />
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">Riwayat Kartu Pantau Jentik Rumah</h3>
              <p className="text-xs text-slate-500">Tercatat dan terintegrasi otomatis ke Puskesmas setempat</p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleDownloadPdf}
              className="bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold px-3 py-2 rounded-xl shadow-2xs flex items-center gap-1.5 transition-colors"
              title="Unduh Rekap Format PDF"
            >
              <FileText className="w-3.5 h-3.5 text-red-600" />
              <span>Unduh PDF</span>
            </button>

            <button
              onClick={handleDownloadExcel}
              className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold px-3 py-2 rounded-xl shadow-2xs flex items-center gap-1.5 transition-colors"
              title="Unduh Rekap Format Excel XLSX"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span>Unduh XLSX</span>
            </button>

            <button
              onClick={onNewInspection}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-xs flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>+ Buat Pantauan Baru</span>
            </button>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {inspections.map((item) => (
            <div
              key={item.id}
              className="p-4 hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`text-xs font-black px-2 py-0.5 rounded-full ${
                      item.status === 'bebas_jentik'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {item.status === 'bebas_jentik' ? '✅ BEBAS JENTIK (100%)' : '⚠️ DITEMUKAN JENTIK'}
                  </span>
                  <span className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {item.date}
                  </span>
                  {item.verifiedByKader && (
                    <span className="text-[10px] font-bold text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200">
                      Terverifikasi Kader
                    </span>
                  )}
                </div>

                <p className="text-xs font-bold text-slate-900">
                  {item.houseAddress}, RT {item.rt}/RW {item.rw}, {item.kelurahan}
                </p>
                <p className="text-xs text-slate-600">
                  Jumantik: <strong>{item.inspectorName}</strong> | Wadah Tergenang: <strong>{item.totalContainers}</strong> | Positif Jentik: <strong>{item.positiveContainers}</strong>
                </p>
                <p className="text-[11px] text-slate-500 italic line-clamp-1">{item.notes}</p>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  onClick={() => setSelectedInspection(item)}
                  className="flex items-center gap-1 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors"
                >
                  <Eye className="w-3.5 h-3.5 text-slate-500" />
                  <span>Rincian</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Details Modal */}
      {selectedInspection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full p-5 max-h-[85vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-black text-slate-900 text-base">Rincian Kartu Pantau 1R1J</h3>
              <button
                onClick={() => setSelectedInspection(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl text-xs space-y-1">
              <p><strong>Alamat:</strong> {selectedInspection.houseAddress}, RT {selectedInspection.rt}/RW {selectedInspection.rw}</p>
              <p><strong>Tanggal:</strong> {selectedInspection.date}</p>
              <p><strong>Jumantik:</strong> {selectedInspection.inspectorName}</p>
              <p><strong>Status:</strong> {selectedInspection.status.toUpperCase()}</p>
              <p><strong>Catatan:</strong> {selectedInspection.notes}</p>
              {selectedInspection.photoUrl && (
                <div className="pt-2">
                  <p className="font-bold mb-1">Foto Bukti Wadah:</p>
                  <img
                    src={selectedInspection.photoUrl}
                    alt="Foto Wadah"
                    className="w-full max-h-48 object-cover rounded-xl border border-slate-300 shadow-2xs"
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-900">Titik Wadah yang Diperiksa:</h4>
              <div className="space-y-1.5 text-xs max-h-60 overflow-y-auto">
                {selectedInspection.points.map((pt) => (
                  <div
                    key={pt.id}
                    className={`p-2 rounded-lg border flex items-center justify-between ${
                      pt.hasLarvae ? 'bg-red-50 border-red-200' : 'bg-white border-slate-200'
                    }`}
                  >
                    <span className="font-semibold text-slate-800">{pt.name}</span>
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                        pt.hasLarvae ? 'bg-red-600 text-white' : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {pt.hasLarvae ? 'Positif Jentik' : 'Bebas Jentik'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => handleDownloadSinglePdf(selectedInspection)}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-1.5 shadow-xs"
              >
                <FileText className="w-4 h-4" />
                <span>Unduh Kartu Pantau (PDF)</span>
              </button>
              <button
                onClick={() => setSelectedInspection(null)}
                className="bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold py-2.5 px-4 rounded-xl"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Certificate Modal */}
      {showCertificate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 border-8 border-amber-400 relative">
            <button
              onClick={() => setShowCertificate(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Certificate Header */}
            <div className="text-center space-y-2 border-b-2 border-amber-300 pb-4">
              <div className="w-14 h-14 bg-amber-500 text-white rounded-full flex items-center justify-center mx-auto shadow-md">
                <Award className="w-8 h-8" />
              </div>
              <span className="text-xs font-black text-amber-700 uppercase tracking-widest">
                KEMENTERIAN KESEHATAN RI & PUSKESMAS KECAMATAN
              </span>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                SERTIFIKAT RUMAH BEBAS JENTIK (1R1J)
              </h2>
              <p className="text-xs text-slate-600">Nomor Registrasi: 1R1J-SKMJ-2026-08821</p>
            </div>

            {/* Certificate Body */}
            <div className="text-center space-y-3 py-2">
              <p className="text-xs text-slate-600">Diberikan dengan penuh apresiasi kepada:</p>
              <h3 className="text-xl font-black text-emerald-800">KELUARGA IBU SITI RAHAYU</h3>
              <p className="text-xs text-slate-700 max-w-md mx-auto">
                Atas dedikasi dan ketaatan aktif dalam Gerakan <strong>Satu Rumah Satu Jumantik</strong> serta keberhasilan menjaga seluruh titik penampungan air bebas dari jentik nyamuk Aedes aegypti dengan skor Angka Bebas Jentik <strong>100%</strong>.
              </p>
            </div>

            {/* Certificate Signatures */}
            <div className="grid grid-cols-2 gap-6 pt-4 border-t border-slate-200 text-center text-xs">
              <div>
                <p className="text-slate-500 font-medium">Ketua Satgas DBD RW 02</p>
                <div className="h-10 flex items-center justify-center font-serif text-slate-800 italic font-bold">
                  Bpk. Joko Susilo, S.Sos
                </div>
                <p className="text-[11px] text-slate-600">Kader Jumantik Utama</p>
              </div>
              <div>
                <p className="text-slate-500 font-medium">Kepala Puskesmas Sukamaju</p>
                <div className="h-10 flex items-center justify-center font-serif text-slate-800 italic font-bold">
                  dr. Budi Setiawan, M.Kes
                </div>
                <p className="text-[11px] text-slate-600">NIP. 19820514 200801 1 004</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={handlePrintCertificate}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak Sertifikat</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
