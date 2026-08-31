import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Bath, 
  CupSoda, 
  Flower2, 
  Bird, 
  Refrigerator, 
  Wind, 
  Database, 
  CircleDot, 
  Trash2, 
  MapPin, 
  CheckCircle2, 
  AlertTriangle, 
  Camera, 
  Sparkles, 
  Send, 
  Share2, 
  Info,
  Layers,
  Award,
  Volume2,
  Heart,
  Smile,
  Edit3,
  Check,
  ThumbsUp,
  Image as ImageIcon,
  Clock,
  User
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { HomeInspectionRecord, InspectionLocation, InspectionPoint } from '../../types/jumantik';
import { playAlertTone } from '../../utils/audioAlert';
import { speakIndonesian } from '../../utils/speechHelper';
import { AiJentikScanner } from './AiJentikScanner';

import { UserProfile } from '../../types/auth';

interface InspectionChecklistProps {
  onSaveInspection: (record: HomeInspectionRecord) => void;
  onOpenAiScanner?: () => void;
  currentUser?: UserProfile | null;
  onAwardPoints?: (stars: number, points: number) => void;
}

const CONTAINER_ITEMS: Array<{ 
  location: InspectionLocation; 
  title: string; 
  subtitle: string;
  emoji: string;
  icon: any; 
  defaultWater: boolean;
  tips: string;
}> = [
  { 
    location: 'bak_mandi', 
    title: '1. Bak Mandi & Ember Kamar Mandi', 
    subtitle: 'Wadah air yang paling sering ada di rumah',
    emoji: '🛁',
    icon: Bath, 
    defaultWater: true,
    tips: 'Kuras dan sikat dinding bak minimal seminggu sekali.'
  },
  { 
    location: 'dispenser', 
    title: '2. Tatakan Tetesan Dispenser Air', 
    subtitle: 'Laci kecil penampung tetesan air galon',
    emoji: '🥤',
    icon: CupSoda, 
    defaultWater: false,
    tips: 'Buang air tetesan dan lap kering setiap 3 hari.'
  },
  { 
    location: 'tatakan_pot', 
    title: '3. Tatakan Bawah Pot Bunga & Tanaman', 
    subtitle: 'Piringan bawah pot bunga di teras atau ruang tamu',
    emoji: '🪴',
    icon: Flower2, 
    defaultWater: false,
    tips: 'Beri pasir atau buang sisa air siraman pot.'
  },
  { 
    location: 'tatakan_kulkas', 
    title: '4. Tatakan Penampung Air Belakang Kulkas', 
    subtitle: 'Wadah di belakang kulkas tempat embun mencair',
    emoji: '🧊',
    icon: Refrigerator, 
    defaultWater: false,
    tips: 'Cek bagian belakang kulkas, lap bersih jika basah.'
  },
  { 
    location: 'drum_toren', 
    title: '5. Toren / Drum Cadangan Air', 
    subtitle: 'Tangki air besar di atas rumah atau dapur',
    emoji: '🛢️',
    icon: Database, 
    defaultWater: true,
    tips: 'Pastikan tutup toren selalu rapat tanpa celah.'
  },
  { 
    location: 'tempat_minum_hewan', 
    title: '6. Tempat Minum Burung / Kucing / Ayam', 
    subtitle: 'Mangkuk minum hewan peliharaan di teras',
    emoji: '🐦',
    icon: Bird, 
    defaultWater: true,
    tips: 'Ganti air minum hewan peliharaan setiap hari.'
  },
  { 
    location: 'penampungan_ac', 
    title: '7. Ember / Pipa Buangan Air AC', 
    subtitle: 'Ember penampung tetesan pendingin ruangan',
    emoji: '💨',
    icon: Wind, 
    defaultWater: false,
    tips: 'Alirkan selang AC langsung ke pembuangan air.'
  },
  { 
    location: 'talang_air', 
    title: '8. Talang Air & Saluran Atap Rumah', 
    subtitle: 'Saluran air hujan di atap genteng',
    emoji: '🏠',
    icon: Home, 
    defaultWater: false,
    tips: 'Bersihkan daun-daun kering yang menyumbat talang.'
  },
  { 
    location: 'ban_bekas', 
    title: '9. Ban Bekas & Kaleng di Pekarangan', 
    subtitle: 'Barang tidak terpakai yang menampung air hujan',
    emoji: '🛞',
    icon: CircleDot, 
    defaultWater: false,
    tips: 'Kubur, tutup terpal, atau serahkan ke bank sampah.'
  },
  { 
    location: 'barang_bekas_luar', 
    title: '10. Botol, Gelas Plastik & Sampah Halaman', 
    subtitle: 'Sampah plastik di kebun atau pekarangan luar',
    emoji: '🗑️',
    icon: Trash2, 
    defaultWater: false,
    tips: 'Daur ulang atau buang ke tempat sampah tertutup.'
  },
];

export const InspectionChecklist: React.FC<InspectionChecklistProps> = ({
  onSaveInspection,
  currentUser,
  onAwardPoints
}) => {
  // Stored profile for elderly & moms so they don't have to re-type
  const [inspectorName, setInspectorName] = useState(() => {
    return currentUser?.name || localStorage.getItem('sijumantik_warga_name') || 'Ibu Hj. Siti Aminah';
  });
  const [houseAddress, setHouseAddress] = useState(() => {
    return currentUser?.address || localStorage.getItem('sijumantik_warga_address') || 'Jl. Mawar Melati No. 18';
  });
  const [rt, setRt] = useState(() => {
    return currentUser?.rt || localStorage.getItem('sijumantik_warga_rt') || '02';
  });
  const [rw, setRw] = useState(() => {
    return currentUser?.rw || localStorage.getItem('sijumantik_warga_rw') || '02';
  });
  const [kelurahan, setKelurahan] = useState(() => {
    return currentUser?.kelurahan || localStorage.getItem('sijumantik_warga_kelurahan') || 'Kelurahan Sukamaju';
  });

  useEffect(() => {
    if (currentUser) {
      setInspectorName(currentUser.name);
      setHouseAddress(currentUser.address);
      setRt(currentUser.rt);
      setRw(currentUser.rw);
      setKelurahan(currentUser.kelurahan);
    }
  }, [currentUser]);

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [notes, setNotes] = useState('');
  const [proofPhoto, setProofPhoto] = useState<string | null>(null);
  const [isAiScannerOpen, setIsAiScannerOpen] = useState(false);
  const [activePointIndex, setActivePointIndex] = useState<number | null>(null);
  const [justSubmittedClean, setJustSubmittedClean] = useState(false);

  const [gpsCoordinates, setGpsCoordinates] = useState({ lat: -6.2048, lng: 106.8515 });

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setGpsCoordinates({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        () => {
          // Fallback to default
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    }
  }, []);

  // Inspection Points state
  const [points, setPoints] = useState<InspectionPoint[]>(() =>
    CONTAINER_ITEMS.map((item, idx) => ({
      id: `point-${idx}`,
      location: item.location,
      name: item.title,
      icon: item.location,
      hasStandingWater: item.defaultWater,
      hasLarvae: false,
      actionTaken: item.defaultWater ? 'kuras' : 'aman',
      notes: '',
    }))
  );

  // Save profile to LocalStorage on change
  const handleSaveProfile = () => {
    localStorage.setItem('sijumantik_warga_name', inspectorName);
    localStorage.setItem('sijumantik_warga_address', houseAddress);
    localStorage.setItem('sijumantik_warga_rt', rt);
    localStorage.setItem('sijumantik_warga_rw', rw);
    localStorage.setItem('sijumantik_warga_kelurahan', kelurahan);
    setIsEditingProfile(false);
    playAlertTone('success');
    speakIndonesian("Data rumah Ibu sudah berhasil disimpan.");
  };

  const updatePoint = (index: number, updates: Partial<InspectionPoint>) => {
    setPoints((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], ...updates };
      return next;
    });
  };

  // ONE-CLICK QUICK ACTION: "Alhamdulillah Semua Bersih"
  const handleSetAllClean = () => {
    const cleanPoints = points.map((p) => ({
      ...p,
      hasStandingWater: false,
      hasLarvae: false,
      actionTaken: 'aman' as const,
      notes: 'Semua wadah sudah dicek dan bersih bebas jentik.',
    }));
    // Keep bak mandi & toren marked as water container but larvae-free
    cleanPoints[0].hasStandingWater = true;
    cleanPoints[0].actionTaken = 'kuras';
    cleanPoints[4].hasStandingWater = true;
    cleanPoints[4].actionTaken = 'tutup';

    setPoints(cleanPoints);
    onAwardPoints?.(5, 15);
    playAlertTone('success');
    speakIndonesian("Alhamdulillah! Semua wadah ditandai bersih dan bebas jentik nyamuk.");
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.5 },
    });
  };

  const totalContainersWithWater = points.filter((p) => p.hasStandingWater).length;
  const positiveContainers = points.filter((p) => p.hasStandingWater && p.hasLarvae).length;
  const isClean = positiveContainers === 0;

  // Handle Photo Upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProofPhoto(reader.result as string);
        playAlertTone('success');
        speakIndonesian("Foto wadah berhasil diunggah.");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Auto save profile
    localStorage.setItem('sijumantik_warga_name', inspectorName);
    localStorage.setItem('sijumantik_warga_address', houseAddress);
    localStorage.setItem('sijumantik_warga_rt', rt);
    localStorage.setItem('sijumantik_warga_rw', rw);
    localStorage.setItem('sijumantik_warga_kelurahan', kelurahan);

    const record: HomeInspectionRecord = {
      id: `insp-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      inspectorName,
      houseAddress,
      rt,
      rw,
      kelurahan,
      coordinates: gpsCoordinates,
      points,
      totalContainers: totalContainersWithWater,
      positiveContainers,
      status: isClean ? 'bebas_jentik' : positiveContainers >= 2 ? 'positif_jentik' : 'waspada_jentik',
      abjScore: isClean ? 100 : 0,
      notes: notes || (isClean ? 'Alhamdulillah semua titik air di rumah sudah diperiksa dan 100% bebas jentik.' : `Ditemukan ${positiveContainers} titik jentik nyamuk dan sudah ditindaklanjuti.`),
      verifiedByKader: true,
      photoUrl: proofPhoto || undefined,
    };

    onSaveInspection(record);
    onAwardPoints?.(15, 35);

    if (isClean) {
      setJustSubmittedClean(true);
      playAlertTone('success');
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 },
      });
      speakIndonesian(
        `MasyaAllah hebat ${inspectorName}! Laporan rumah Ibu sudah berhasil dikirim. Rumah Ibu 100% Bebas Jentik Nyamuk DBD!`
      );
    } else {
      playAlertTone('warning');
      speakIndonesian(
        `Laporan terkirim. Harap segera kuras wadah yang ada jentik dan taburkan bubuk abate ya Bu.`
      );
    }
  };

  const shareToWhatsapp = () => {
    const text = encodeURIComponent(
      `*LAPORAN 1R1J (SATU RUMAH SATU JUMANTIK)* 🏡✨\n\n` +
      `📅 *Tanggal:* ${new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}\n` +
      `👤 *Nama Warga:* ${inspectorName}\n` +
      `🏠 *Alamat:* ${houseAddress}, RT ${rt}/RW ${rw}, ${kelurahan}\n` +
      `🔍 *Total Wadah Diperiksa:* ${points.length} titik\n` +
      `💧 *Wadah Tergenang:* ${totalContainersWithWater}\n` +
      `🦟 *Wadah Positif Jentik:* ${positiveContainers}\n` +
      `🛡️ *Status Rumah:* *${isClean ? '✅ 100% BEBAS JENTIK (AMAN)' : '⚠️ DITEMUKAN JENTIK (SUDAH DIKURAS)'}*\n` +
      `💬 *Catatan:* ${notes || 'Kondisi rumah bersih & rutin PSN 3M Plus.'}\n\n` +
      `_Dilaporkan melalui Aplikasi SiJumantik Digital._`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const handleReadFormAloud = () => {
    speakIndonesian(
      `Selamat datang ${inspectorName}. Silakan periksa sepuluh wadah air di rumah Ibu. ` +
      `Jika semua wadah bersih dari jentik, tekan tombol hijau Alhamdulillah Semua Bersih. ` +
      `Lalu tekan tombol Kirim Laporan di bagian bawah.`
    );
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* 1. Warm Greeting & Household Card (Ramah Lansia & Ibu-Ibu) */}
      <div className="bg-gradient-to-br from-emerald-800 via-teal-800 to-emerald-900 text-white rounded-3xl p-5 sm:p-7 shadow-xl relative overflow-hidden border-2 border-emerald-600/50">
        <div className="relative z-10 space-y-3">
          {/* Header Tag */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="inline-flex items-center gap-1.5 bg-emerald-700 text-white text-xs font-semibold px-2.5 py-1 rounded-md border border-emerald-600">
              <Smile className="w-3.5 h-3.5" />
              <span>Gerakan 1 Rumah 1 Jumantik (1R1J)</span>
            </div>

            {/* Voice Audio Readout Button */}
            <button
              type="button"
              onClick={handleReadFormAloud}
              className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white font-medium text-xs px-2.5 py-1 rounded-md border border-white/20 transition-colors cursor-pointer"
            >
              <Volume2 className="w-3.5 h-3.5 text-emerald-300" />
              <span>Dengarkan Panduan Suara</span>
            </button>
          </div>

          {/* Title */}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight leading-snug">
              Formulir Pantau Jentik Rumah Tangga
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100 mt-1 leading-relaxed">
              Assalamu'alaikum <strong>{inspectorName}</strong>. Pemeriksaan berkala 5 menit seminggu sekali untuk melindungi keluarga dari Demam Berdarah (DBD).
            </p>
          </div>

          {/* Household Profile Banner (Stored Profile) */}
          <div className="mt-3 p-3 bg-emerald-950/60 border border-emerald-500/30 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-700 flex items-center justify-center text-white shrink-0">
                <Home className="w-4 h-4 text-emerald-200" />
              </div>
              <div>
                <div className="font-semibold text-white text-xs sm:text-sm flex items-center gap-1.5">
                  <span>{inspectorName}</span>
                  <span className="text-[11px] font-medium text-emerald-300 bg-emerald-900 px-1.5 py-0.2 rounded border border-emerald-600/40">
                    RT {rt} / RW {rw}
                  </span>
                </div>
                <div className="text-xs text-emerald-200 mt-0.5">
                  {houseAddress}, {kelurahan}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsEditingProfile(!isEditingProfile)}
              className="inline-flex items-center gap-1 bg-white/10 hover:bg-white/20 text-emerald-100 font-medium px-2.5 py-1 rounded-md border border-white/20 text-xs transition-colors shrink-0 cursor-pointer"
            >
              <Edit3 className="w-3 h-3 text-emerald-300" />
              <span>{isEditingProfile ? 'Batal' : 'Ubah Data'}</span>
            </button>
          </div>

          {/* Editable Household Profile Drawer */}
          {isEditingProfile && (
            <div className="p-4 bg-white text-slate-900 rounded-2xl shadow-lg border border-emerald-300 space-y-3 animate-in fade-in">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                <User className="w-4 h-4" />
                <span>Ubah Identitas Rumah (Tersimpan Otomatis):</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nama Ibu / Bapak:</label>
                  <input
                    type="text"
                    value={inspectorName}
                    onChange={(e) => setInspectorName(e.target.value)}
                    className="w-full text-sm font-semibold bg-slate-50 border border-slate-300 rounded-xl p-2.5 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Alamat Rumah:</label>
                  <input
                    type="text"
                    value={houseAddress}
                    onChange={(e) => setHouseAddress(e.target.value)}
                    className="w-full text-sm font-semibold bg-slate-50 border border-slate-300 rounded-xl p-2.5 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">RT:</label>
                    <input
                      type="text"
                      value={rt}
                      onChange={(e) => setRt(e.target.value)}
                      className="w-full text-sm font-semibold bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-center focus:bg-white focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">RW:</label>
                    <input
                      type="text"
                      value={rw}
                      onChange={(e) => setRw(e.target.value)}
                      className="w-full text-sm font-semibold bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-center focus:bg-white focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Kelurahan / Desa:</label>
                  <input
                    type="text"
                    value={kelurahan}
                    onChange={(e) => setKelurahan(e.target.value)}
                    className="w-full text-sm font-semibold bg-slate-50 border border-slate-300 rounded-xl p-2.5 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={handleSaveProfile}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm px-4 py-2 rounded-xl shadow-xs"
                >
                  Simpan Perubahan
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 2. ONE-TOUCH MAGIC BUTTON: "Alhamdulillah Semua Wadah Bersih" */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3 text-center sm:text-left">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-xl shrink-0">
            ✨
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Pemeriksaan Cepat Seluruh Wadah
            </h3>
            <p className="text-xs text-slate-600">
              Jika semua 10 wadah air di rumah sudah diperiksa dan bersih dari jentik:
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSetAllClean}
          className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs sm:text-sm px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
        >
          <ThumbsUp className="w-4 h-4" />
          <span>Tandai Semua Bersih</span>
        </button>
      </div>

      {/* 3. Main Form Checklist Cards */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
            <div>
              <h3 className="text-sm sm:text-base font-semibold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Pemeriksaan 10 Titik Wadah Air di Rumah:</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Pilih status wadah air di bawah ini untuk pencatatan Satu Rumah Satu Jumantik.
              </p>
            </div>

            <div className="flex items-center gap-1.5 self-start sm:self-auto bg-slate-100 text-slate-800 font-medium text-xs px-2.5 py-1 rounded-md border border-slate-200">
              <span>Status Rumah:</span>
              <strong className={isClean ? 'text-emerald-700 font-semibold' : 'text-rose-600 font-semibold'}>
                {isClean ? '100% Bebas Jentik' : `${positiveContainers} Positif Jentik`}
              </strong>
            </div>
          </div>

          {/* 10 Container Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {points.map((point, index) => {
              const itemInfo = CONTAINER_ITEMS[index];
              const PointIcon = itemInfo?.icon || Bath;
              const hasLarvae = point.hasStandingWater && point.hasLarvae;

              return (
                <div
                  key={point.id}
                  className={`p-3.5 rounded-xl border transition-colors space-y-2.5 ${
                    hasLarvae
                      ? 'bg-rose-50/70 border-rose-300'
                      : point.hasStandingWater
                      ? 'bg-emerald-50/40 border-emerald-200'
                      : 'bg-slate-50/70 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2.5">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0 ${
                          hasLarvae
                            ? 'bg-rose-600 text-white'
                            : point.hasStandingWater
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        <span>{itemInfo?.emoji || '💧'}</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-xs sm:text-sm text-slate-900 leading-snug">
                          {point.name}
                        </h4>
                        <p className="text-[11px] text-slate-500">
                          {itemInfo?.subtitle}
                        </p>
                      </div>
                    </div>

                    {/* AI Scan button per item */}
                    <button
                      type="button"
                      onClick={() => {
                        setActivePointIndex(index);
                        setIsAiScannerOpen(true);
                      }}
                      className="p-1 rounded-md bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs transition-colors shrink-0 cursor-pointer"
                      title="Pindai Wadah Ini dengan AI"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    </button>
                  </div>

                  {/* Minimalist Buttons for Warga: Bersih vs Ada Jentik */}
                  <div className="grid grid-cols-2 gap-2 pt-0.5">
                    {/* Button 1: Bersih / Aman */}
                    <button
                      type="button"
                      onClick={() => {
                        updatePoint(index, {
                          hasStandingWater: true,
                          hasLarvae: false,
                          actionTaken: 'aman',
                        });
                        playAlertTone('success');
                      }}
                      className={`py-2 px-2 rounded-lg font-medium text-xs flex items-center justify-center gap-1 transition-colors cursor-pointer ${
                        point.hasStandingWater && !point.hasLarvae
                          ? 'bg-emerald-600 text-white'
                          : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Bersih / Aman</span>
                    </button>

                    {/* Button 2: Ada Jentik */}
                    <button
                      type="button"
                      onClick={() => {
                        updatePoint(index, {
                          hasStandingWater: true,
                          hasLarvae: true,
                          actionTaken: 'kuras',
                        });
                        playAlertTone('warning');
                        speakIndonesian(`Perhatian: ${point.name} ditemukan jentik.`);
                      }}
                      className={`py-2 px-2 rounded-lg font-medium text-xs flex items-center justify-center gap-1 transition-colors cursor-pointer ${
                        hasLarvae
                          ? 'bg-rose-600 text-white'
                          : 'bg-white hover:bg-rose-50 text-slate-700 border border-slate-200'
                      }`}
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Ada Jentik</span>
                    </button>
                  </div>

                  {/* Action selector if positive larvae */}
                  {hasLarvae && (
                    <div className="p-2.5 bg-rose-100/70 border border-rose-200 rounded-lg space-y-1 text-xs text-rose-950">
                      <span className="font-semibold text-[11px] block">Tindakan PSN 3M+:</span>
                      <select
                        value={point.actionTaken}
                        onChange={(e) => updatePoint(index, { actionTaken: e.target.value as any })}
                        className="w-full text-xs font-medium bg-white border border-rose-300 rounded-md p-1.5 text-slate-900"
                      >
                        <option value="kuras">Dikuras & Disikat Bersih</option>
                        <option value="tutup">Ditutup Rapat</option>
                        <option value="abate">Ditaburi Bubuk Abate</option>
                        <option value="pelihara_ikan">Diberi Ikan Pemakan Jentik</option>
                        <option value="bersihkan">Dibuang / Dikeringkan</option>
                      </select>
                    </div>
                  )}

                  {/* Friendly health tip */}
                  <div className="text-[11px] text-slate-500 bg-white/60 px-2 py-0.5 rounded border border-slate-100">
                    Tips: {itemInfo?.tips}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. Optional Photo Upload (Bukti Foto Wadah Bersih) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h4 className="font-semibold text-xs sm:text-sm text-slate-900 flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-emerald-600" />
                <span>Foto Bukti Wadah Air (Opsional)</span>
              </h4>
              <p className="text-xs text-slate-500">
                Ambil foto bak mandi atau wadah yang sudah bersih sebagai lampiran.
              </p>
            </div>

            <label className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-medium text-xs px-3 py-1.5 rounded-lg cursor-pointer transition-colors">
              <Camera className="w-3.5 h-3.5 text-slate-600" />
              <span>{proofPhoto ? 'Ganti Foto' : 'Pilih Foto'}</span>
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </label>
          </div>

          {proofPhoto && (
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3">
              <img
                src={proofPhoto}
                alt="Bukti Wadah"
                className="w-14 h-14 object-cover rounded-lg border border-slate-200"
              />
              <div className="text-xs text-slate-700">
                <p className="font-medium text-emerald-700">✓ Foto terlampir</p>
                <p className="text-slate-500 text-[11px]">Tercatat dalam rekam inspeksi 1R1J.</p>
              </div>
            </div>
          )}
        </div>

        {/* 5. Catatan Tambahan (Simpel) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 space-y-2">
          <label className="block font-medium text-xs sm:text-sm text-slate-800">
            Catatan Tambahan (Opsional):
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Tulis catatan kondisi lingkungan rumah jika ada..."
            rows={2}
            className="w-full text-xs sm:text-sm font-normal bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:bg-white focus:ring-1 focus:ring-slate-900"
          />
        </div>

        {/* 6. Big Encouraging Result & Submit Button - Minimalist */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0 ${
                isClean ? 'bg-emerald-600' : 'bg-rose-600'
              }`}
            >
              {isClean ? '100%' : '⚠️'}
            </div>
            <div>
              <h4 className="font-semibold text-sm sm:text-base">
                {isClean ? 'Kondisi Rumah: Bebas Jentik' : 'Kondisi Rumah: Ditemukan Jentik'}
              </h4>
              <p className="text-xs text-slate-300">
                {isClean
                  ? 'Semua wadah terbebas dari potensi sarang nyamuk Aedes aegypti.'
                  : `${positiveContainers} wadah perlu tindakan penaburan abate atau pengurasan.`}
              </p>
            </div>
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs sm:text-sm px-5 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
          >
            <Send className="w-4 h-4" />
            <span>Kirim Laporan 1R1J</span>
          </button>
        </div>
      </form>

      {/* 7. Success Banner with WhatsApp Button after submission */}
      {justSubmittedClean && (
        <div className="bg-emerald-900 text-white rounded-2xl p-5 border border-emerald-700 text-center space-y-3 animate-in fade-in">
          <div>
            <h3 className="text-base sm:text-lg font-bold">
              Laporan Berhasil Disimpan
            </h3>
            <p className="text-xs text-emerald-100 mt-0.5 max-w-md mx-auto">
              Terima kasih {inspectorName}. Data inspeksi Satu Rumah Satu Jumantik telah diperbarui.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            <button
              type="button"
              onClick={shareToWhatsapp}
              className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs sm:text-sm px-4 py-2 rounded-lg transition-colors cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>Bagikan ke Grup WA RT</span>
            </button>

            <button
              type="button"
              onClick={() => setJustSubmittedClean(false)}
              className="inline-flex items-center bg-white/10 hover:bg-white/20 text-white font-medium text-xs px-3 py-2 rounded-lg transition-colors cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {/* AI Scanner Modal Integration */}
      <AiJentikScanner
        isOpen={isAiScannerOpen}
        onClose={() => {
          setIsAiScannerOpen(false);
          setActivePointIndex(null);
        }}
        onApplyResult={(res) => {
          if (activePointIndex !== null) {
            updatePoint(activePointIndex, {
              hasStandingWater: true,
              hasLarvae: res.hasLarvae,
              notes: res.notes,
              actionTaken: res.actionTaken,
            });
            playAlertTone(res.hasLarvae ? 'warning' : 'success');
            speakIndonesian(
              res.hasLarvae
                ? "AI mendeteksi kemungkinan jentik nyamuk. Harap dikuras ya Bu."
                : "Hasil scan AI: Wadah bersih dan bebas jentik!"
            );
          }
        }}
      />
    </div>
  );
};
