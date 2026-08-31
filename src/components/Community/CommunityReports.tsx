import React, { useState } from 'react';
import { 
  Users, 
  ThumbsUp, 
  MapPin, 
  Calendar, 
  Plus, 
  CheckCircle2, 
  AlertTriangle, 
  MessageSquare, 
  Trash2, 
  ShieldCheck, 
  X,
  Send,
  FileText,
  FileSpreadsheet
} from 'lucide-react';
import { CommunityReport } from '../../types/jumantik';
import { exportCommunityReportsToPdf, exportCommunityReportsToExcel } from '../../utils/reportExporter';
import { playAlertTone } from '../../utils/audioAlert';

interface CommunityReportsProps {
  reports: CommunityReport[];
  onAddReport: (newRep: CommunityReport) => void;
  onUpvote: (id: string) => void;
}

export const CommunityReports: React.FC<CommunityReportsProps> = ({
  reports,
  onAddReport,
  onUpvote,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [reporterName, setReporterName] = useState('Warga Peduli Lingkungan');
  const [category, setCategory] = useState<CommunityReport['category']>('genangan_liar');
  const [address, setAddress] = useState('');
  const [rtRw, setRtRw] = useState('RT 03 / RW 03');
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number }>({ lat: -6.2135, lng: 106.8422 });
  const [isGettingGps, setIsGettingGps] = useState(false);
  const [photoUrl, setPhotoUrl] = useState('https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=600&q=80');

  const handleCaptureGps = () => {
    if (!('geolocation' in navigator)) {
      alert('GPS tidak didukung oleh browser Anda.');
      return;
    }
    setIsGettingGps(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setCoordinates({ lat: latitude, lng: longitude });
        setIsGettingGps(false);
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          if (res.ok) {
            const data = await res.json();
            if (data.display_name) {
              setAddress(data.display_name.split(',').slice(0, 3).join(', '));
            }
          }
        } catch {
          // Keep current address if reverse geo fails
        }
      },
      () => {
        setIsGettingGps(false);
        alert('Gagal mengambil titik koordinat GPS HP. Pastikan izin lokasi diaktifkan.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const filteredReports = reports.filter((r) => {
    if (filterCategory !== 'all' && r.category !== filterCategory) return false;
    return true;
  });

  const handleCreateReport = (e: React.FormEvent) => {
    e.preventDefault();
    const created: CommunityReport = {
      id: `rep-${Date.now()}`,
      reporterName,
      title,
      description,
      category,
      address,
      rtRw,
      coordinates: coordinates,
      photoUrl,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      upvotes: 1,
      status: 'menunggu_verifikasi',
    };

    onAddReport(created);
    setShowAddModal(false);
    playAlertTone('success');
    setTitle('');
    setDescription('');
    setAddress('');
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-cyan-900 text-white rounded-2xl p-5 sm:p-7 shadow-lg">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs font-bold px-3 py-1 rounded-full">
              <Users className="w-3.5 h-3.5" />
              <span>Partisipasi Gotong Royong & Validasi Publik</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-black tracking-tight">
              Lapor Sarang Jentik & Fasilitas Publik
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/90 max-w-2xl">
              Laporkan genangan liar, selokan tersumbat, dan tempat pembuangan sampah berpotensi DBD di lingkungan Anda. Suara warga mempercepat tindakan Satgas.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap shrink-0">
            <button
              onClick={() => {
                exportCommunityReportsToPdf(reports);
                playAlertTone('success');
              }}
              className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-3.5 py-2.5 rounded-xl border border-white/20 flex items-center gap-1.5 transition-colors"
              title="Unduh Laporan Warga PDF"
            >
              <FileText className="w-4 h-4 text-red-400" />
              <span>Unduh PDF</span>
            </button>

            <button
              onClick={() => {
                exportCommunityReportsToExcel(reports);
                playAlertTone('success');
              }}
              className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-3.5 py-2.5 rounded-xl border border-white/20 flex items-center gap-1.5 transition-colors"
              title="Unduh Laporan Warga XLSX"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>Unduh XLSX</span>
            </button>

            <button
              onClick={() => setShowAddModal(true)}
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-md shadow-emerald-500/20 flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>+ Lapor Titik Rawan Baru</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Category Bar */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {[
          { id: 'all', label: 'Semua Laporan' },
          { id: 'genangan_liar', label: 'Genangan Air Liar' },
          { id: 'selokan_mampet', label: 'Selokan / Got Tersumbat' },
          { id: 'fasilitas_umum', label: 'Fasilitas Terbengkalai' },
          { id: 'sampah_plastik', label: 'Tumpukan Sampah Wadah' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterCategory(tab.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              filterCategory === tab.id
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredReports.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow"
          >
            <div>
              {/* Photo */}
              <div className="relative aspect-16/9 bg-slate-900 overflow-hidden">
                <img
                  src={item.photoUrl}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <span
                  className={`absolute top-2.5 left-2.5 text-[10px] font-black uppercase px-2 py-0.5 rounded-full shadow-sm ${
                    item.status === 'selesai'
                      ? 'bg-emerald-600 text-white'
                      : item.status === 'dalam_tindakan'
                      ? 'bg-amber-500 text-slate-950'
                      : item.status === 'terverifikasi'
                      ? 'bg-cyan-600 text-white'
                      : 'bg-slate-800 text-white'
                  }`}
                >
                  {item.status.replace('_', ' ')}
                </span>
              </div>

              {/* Body */}
              <div className="p-4 space-y-2">
                <h3 className="font-bold text-sm text-slate-900 leading-snug">{item.title}</h3>
                <p className="text-xs text-slate-600 line-clamp-2">{item.description}</p>

                <div className="text-[11px] text-slate-500 space-y-0.5 pt-1">
                  <p className="flex items-center gap-1 font-medium text-slate-700">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="line-clamp-1">{item.address} ({item.rtRw})</span>
                  </p>
                  <p className="flex items-center gap-1 text-slate-400">
                    <Calendar className="w-3.5 h-3.5 shrink-0" />
                    <span>{item.createdAt} oleh {item.reporterName}</span>
                  </p>
                </div>

                {item.actionNote && (
                  <div className="bg-emerald-50 border border-emerald-200 p-2 rounded-lg text-[11px] text-emerald-900">
                    <strong>Tindak Lanjut Satgas:</strong> {item.actionNote}
                  </div>
                )}
              </div>
            </div>

            {/* Footer / Upvote action */}
            <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">
                {item.upvotes} Warga memvalidasi
              </span>

              <button
                onClick={() => {
                  onUpvote(item.id);
                  playAlertTone('success');
                }}
                className="flex items-center gap-1.5 text-xs font-bold bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-300 px-3 py-1.5 rounded-lg transition-all active:scale-95 shadow-2xs"
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>Validasi Benar (+1)</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Report Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <form onSubmit={handleCreateReport} className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-5 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-bold text-slate-900 text-base">Laporkan Titik Rawan Jentik Publik</h3>
              <button type="button" onClick={() => setShowAddModal(false)} className="text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Judul Laporan:</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: Genangan Ban Bekas di Samping Pos Ronda"
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2 focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Kategori Genangan:</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2"
                >
                  <option value="genangan_liar">Genangan Air Liar</option>
                  <option value="selokan_mampet">Selokan Tersumbat</option>
                  <option value="fasilitas_umum">Fasilitas Terbengkalai</option>
                  <option value="sampah_plastik">Sampah Wadah Plastik</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Wilayah RT / RW:</label>
                <input
                  type="text"
                  value={rtRw}
                  onChange={(e) => setRtRw(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700">Alamat / Patokan Lokasi:</label>
                <button
                  type="button"
                  onClick={handleCaptureGps}
                  disabled={isGettingGps}
                  className="text-[11px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-200 cursor-pointer"
                >
                  <MapPin className="w-3 h-3" />
                  <span>{isGettingGps ? 'Mengambil GPS...' : '📍 Ambil GPS HP Saya'}</span>
                </button>
              </div>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Contoh: Depan Balai RW 03 Dekat Lapangan"
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Deskripsi Kondisi:</label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ceritakan temuan jentik, bau, atau kondisi wadah yang tergenang air..."
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nama Pelapor:</label>
              <input
                type="text"
                value={reporterName}
                onChange={(e) => setReporterName(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 rounded-xl shadow-xs"
            >
              Kirim Laporan Komunitas
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
