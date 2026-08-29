import React, { useState } from 'react';
import { 
  FileText, 
  FileSpreadsheet, 
  Download, 
  X, 
  CheckCircle2, 
  Building2, 
  Users, 
  Boxes, 
  AlertTriangle, 
  Sparkles,
  Layers,
  Calendar,
  Share2
} from 'lucide-react';
import { 
  HomeInspectionRecord, 
  DengueCaseReport, 
  LogisticsItem, 
  CommunityReport, 
  AreaZone 
} from '../../types/jumantik';
import { 
  exportInspectionsToPdf, 
  exportInspectionsToExcel, 
  exportSingleInspectionToPdf, 
  exportDengueCasesToPdf, 
  exportDengueCasesToExcel, 
  exportLogisticsToPdf, 
  exportLogisticsToExcel, 
  exportCommunityReportsToPdf, 
  exportCommunityReportsToExcel, 
  exportComprehensiveMasterExcel 
} from '../../utils/reportExporter';
import { playAlertTone } from '../../utils/audioAlert';

interface ExportReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  inspections: HomeInspectionRecord[];
  cases: DengueCaseReport[];
  logistics: LogisticsItem[];
  communityReports: CommunityReport[];
  zones: AreaZone[];
  initialType?: 'all' | 'inspections' | 'cases' | 'logistics' | 'community';
}

export const ExportReportModal: React.FC<ExportReportModalProps> = ({
  isOpen,
  onClose,
  inspections,
  cases,
  logistics,
  communityReports,
  zones,
  initialType = 'inspections',
}) => {
  const [selectedCategory, setSelectedCategory] = useState<
    'inspections' | 'single_inspection' | 'cases' | 'logistics' | 'community' | 'master_bundle'
  >(initialType === 'all' ? 'master_bundle' : initialType as any);

  const [selectedInspectionId, setSelectedInspectionId] = useState<string>(
    inspections[0]?.id || ''
  );
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccessMsg, setExportSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleExport = (format: 'pdf' | 'xlsx') => {
    setIsExporting(true);
    setExportSuccessMsg(null);

    try {
      if (selectedCategory === 'inspections') {
        if (format === 'pdf') exportInspectionsToPdf(inspections);
        else exportInspectionsToExcel(inspections);
      } else if (selectedCategory === 'single_inspection') {
        const item = inspections.find((i) => i.id === selectedInspectionId) || inspections[0];
        if (item) {
          if (format === 'pdf') exportSingleInspectionToPdf(item);
          else exportInspectionsToExcel([item]);
        }
      } else if (selectedCategory === 'cases') {
        if (format === 'pdf') exportDengueCasesToPdf(cases);
        else exportDengueCasesToExcel(cases);
      } else if (selectedCategory === 'logistics') {
        if (format === 'pdf') exportLogisticsToPdf(logistics);
        else exportLogisticsToExcel(logistics);
      } else if (selectedCategory === 'community') {
        if (format === 'pdf') exportCommunityReportsToPdf(communityReports);
        else exportCommunityReportsToExcel(communityReports);
      } else if (selectedCategory === 'master_bundle') {
        if (format === 'xlsx') {
          exportComprehensiveMasterExcel(inspections, cases, logistics, communityReports, zones);
        } else {
          // Export main PDF
          exportInspectionsToPdf(inspections);
        }
      }

      playAlertTone('success');
      setExportSuccessMsg(`Laporan berhasil diunduh dalam format ${format.toUpperCase()}!`);
      setTimeout(() => setExportSuccessMsg(null), 4000);
    } catch (err) {
      console.error(err);
      alert('Gagal mengekspor laporan. Silakan coba lagi.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-teal-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/20 text-emerald-300 rounded-2xl border border-emerald-400/30">
              <Download className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-black text-lg sm:text-xl">Pusat Unduh Laporan Resmi</h3>
              <p className="text-xs text-emerald-200/90">
                Ekspor data kesehatan & pemantauan jentik ke dokumen PDF & spreadsheet Excel (XLSX)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-white/70 hover:text-white p-1.5 rounded-lg hover:bg-white/10"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
          {/* Category selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Pilih Jenis Laporan yang Ingin Diunduh:
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Option 1: Rekap 1R1J */}
              <button
                type="button"
                onClick={() => setSelectedCategory('inspections')}
                className={`p-3 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                  selectedCategory === 'inspections'
                    ? 'bg-emerald-50/80 border-emerald-500 ring-2 ring-emerald-500/30'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                }`}
              >
                <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900">Rekap Pemantauan Jentik (1R1J)</h4>
                  <p className="text-[11px] text-slate-500">Semua kartu pantau warga, skor ABJ, dan status verifikasi kader ({inspections.length} data)</p>
                </div>
              </button>

              {/* Option 2: Kartu Pantau Single Rumah */}
              <button
                type="button"
                onClick={() => setSelectedCategory('single_inspection')}
                className={`p-3 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                  selectedCategory === 'single_inspection'
                    ? 'bg-emerald-50/80 border-emerald-500 ring-2 ring-emerald-500/30'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                }`}
              >
                <div className="p-2 bg-amber-100 text-amber-800 rounded-xl mt-0.5">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900">Kartu Kontrol Pantau Per Rumah</h4>
                  <p className="text-[11px] text-slate-500">Cetak lembar kendali individual 10 titik wadah per kepala keluarga</p>
                </div>
              </button>

              {/* Option 3: Kasus DBD Puskesmas */}
              <button
                type="button"
                onClick={() => setSelectedCategory('cases')}
                className={`p-3 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                  selectedCategory === 'cases'
                    ? 'bg-red-50/80 border-red-500 ring-2 ring-red-500/30'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                }`}
              >
                <div className="p-2 bg-red-100 text-red-800 rounded-xl mt-0.5">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900">Surveilans Pasien DBD Puskesmas</h4>
                  <p className="text-[11px] text-slate-500">Data klinis trombosit, hematokrit, derajat DBD, dan fogging ({cases.length} pasien)</p>
                </div>
              </button>

              {/* Option 4: Logistik */}
              <button
                type="button"
                onClick={() => setSelectedCategory('logistics')}
                className={`p-3 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                  selectedCategory === 'logistics'
                    ? 'bg-cyan-50/80 border-cyan-500 ring-2 ring-cyan-500/30'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                }`}
              >
                <div className="p-2 bg-cyan-100 text-cyan-800 rounded-xl mt-0.5">
                  <Boxes className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900">Stok Logistik & Abate</h4>
                  <p className="text-[11px] text-slate-500">Inventaris bubuk abate, RDT, infus RL, dan mesin fogging ({logistics.length} item)</p>
                </div>
              </button>

              {/* Option 5: Laporan Komunitas */}
              <button
                type="button"
                onClick={() => setSelectedCategory('community')}
                className={`p-3 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                  selectedCategory === 'community'
                    ? 'bg-teal-50/80 border-teal-500 ring-2 ring-teal-500/30'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                }`}
              >
                <div className="p-2 bg-teal-100 text-teal-800 rounded-xl mt-0.5">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900">Laporan Titik Rawan Publik</h4>
                  <p className="text-[11px] text-slate-500">Pengaduan genangan liar dan selokan tersumbat warga ({communityReports.length} laporan)</p>
                </div>
              </button>

              {/* Option 6: Bundel Master (Multi-Sheet XLSX) */}
              <button
                type="button"
                onClick={() => setSelectedCategory('master_bundle')}
                className={`p-3 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                  selectedCategory === 'master_bundle'
                    ? 'bg-indigo-50/80 border-indigo-500 ring-2 ring-indigo-500/30'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                }`}
              >
                <div className="p-2 bg-indigo-100 text-indigo-800 rounded-xl mt-0.5">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900">Master Report Komprehensif</h4>
                  <p className="text-[11px] text-slate-500">Bundel lengkap seluruh modul terpadu dalam satu file Excel multi-sheet</p>
                </div>
              </button>
            </div>
          </div>

          {/* Sub-selector if Single Inspection is chosen */}
          {selectedCategory === 'single_inspection' && (
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
              <label className="text-xs font-bold text-slate-700 block">
                Pilih Rumah / Kartu Pantau:
              </label>
              <select
                value={selectedInspectionId}
                onChange={(e) => setSelectedInspectionId(e.target.value)}
                className="w-full text-xs bg-white border border-slate-300 rounded-xl p-2.5 font-medium text-slate-900"
              >
                {inspections.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.houseAddress} (RT {item.rt}/RW {item.rw}) - {item.inspectorName} ({item.date}) - [{item.status === 'bebas_jentik' ? 'BEBAS JENTIK' : 'POSITIF JENTIK'}]
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Success Banner */}
          {exportSuccessMsg && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-2xl text-xs font-bold text-emerald-800 flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{exportSuccessMsg}</span>
            </div>
          )}

          {/* Download Action Buttons */}
          <div className="pt-2 border-t border-slate-100 space-y-3">
            <p className="text-xs font-bold text-slate-600">Pilih Format Berkas:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* PDF Button */}
              <button
                onClick={() => handleExport('pdf')}
                disabled={isExporting}
                className="flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-red-600/20 active:scale-98 transition-all disabled:opacity-50 cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                <span>Unduh Dokumen PDF (.pdf)</span>
              </button>

              {/* Excel XLSX Button */}
              <button
                onClick={() => handleExport('xlsx')}
                disabled={isExporting}
                className="flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-700/20 active:scale-98 transition-all disabled:opacity-50 cursor-pointer"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Unduh Spreadsheet Excel (.xlsx)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Format sesuai standar pelaporan Kemenkes RI</span>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl font-bold transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
