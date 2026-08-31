export interface MediaSlide {
  id: string;
  type: 'movie' | 'image';
  title: string;
  subtitle: string;
  category: 'Video Edukasi' | 'Poster 3M+' | 'Panduan Lapangan' | 'Film Komunitas';
  badge: string;
  duration?: string;
  thumbnailUrl: string;
  videoUrl?: string; // Optional embedded/streaming video
  description: string;
  keyPoints: string[];
  actionLabel?: string;
  source: string;
  author: string;
}

export const MEDIA_SLIDES: MediaSlide[] = [
  {
    id: 'slide-1',
    type: 'movie',
    title: 'Gerakan 1 Rumah 1 Jumantik (1R1J) & PSN 3M Plus',
    subtitle: 'Animasi Edukasi Resmi Kemenkes RI',
    category: 'Video Edukasi',
    badge: '🎬 VIDEO UTAMA',
    duration: '2:45 Menit',
    thumbnailUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80',
    description: 'Panduan lengkap cara memutus siklus hidup nyamuk Aedes aegypti dari dalam rumah. Kenali tempat perindukan tersembunyi seperti dispenser, tatakan pot, dan talang air.',
    keyPoints: [
      'Kuras bak mandi & sikat dinding telur minimal seminggu sekali',
      'Tutup rapat semua penampungan toren air',
      'Daur ulang barang bekas yang berpotensi menampung air hujan',
      'Tabur bubuk larvasida (Abate) pada penampungan air sulit dikuras'
    ],
    actionLabel: 'Tonton Video 1R1J',
    source: 'Kementerian Kesehatan RI • Direktorat P2PTV',
    author: 'Tim Promkes & Jumantik Nasional'
  },
  {
    id: 'slide-2',
    type: 'image',
    title: 'Anatomi & Ciri Khas Nyamuk Aedes aegypti',
    subtitle: 'Poster Identifikasi Vektor Demam Berdarah',
    category: 'Poster 3M+',
    badge: '🖼️ INFOGRAFIS',
    thumbnailUrl: 'https://images.unsplash.com/photo-1551884831-bbf3cdc6469e?auto=format&fit=crop&w=1200&q=80',
    description: 'Nyamuk betina bercorak loreng hitam-putih di kaki dan tubuhnya. Aktif menghisap darah pada pukul 08.00-10.00 pagi dan 15.00-17.00 sore di lingkungan teduh dalam rumah.',
    keyPoints: [
      'Hanya berkembang biak di AIR BERSIH jernih (bukan got kotor)',
      'Telur menempel di dinding bak kering hingga 6 bulan',
      'Jentik berenang vertikal lincah saat terkena cahaya senter',
      'Jangkauan terbang nyamuk dewasa mencapai radius 100 meter'
    ],
    actionLabel: 'Lihat Poster Resolusi Tinggi',
    source: 'Ikatan Dokter Anak Indonesia (IDAI)',
    author: 'Pusat Riset Penyakit Tropis'
  },
  {
    id: 'slide-3',
    type: 'movie',
    title: 'Tutorial Lapangan: Cara Tepat Menabur Bubuk Abate',
    subtitle: 'Takaran Standar & Uji Efektivitas 3 Bulan',
    category: 'Panduan Lapangan',
    badge: '🎥 TUTORIAL KADER',
    duration: '3:10 Menit',
    thumbnailUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80',
    description: 'Video peragaan kader Jumantik cara menakar 1 sendok teh (10 gram) bubuk Abate untuk 100 liter air tanpa merubah bau dan rasa air bersih.',
    keyPoints: [
      'Dosis: 1 gram Abate untuk setiap 10 Liter air',
      'Aman untuk air mandi dan air cuci perabot keluarga',
      'Daya tahan membasmi jentik efektif hingga 2-3 bulan',
      'Jangan menguras bak hingga 1 minggu setelah penaburan'
    ],
    actionLabel: 'Putar Video Tutorial',
    source: 'Puskesmas Siaga & Kader Jumantik RW',
    author: 'Nakes Sanitarian Puskesmas'
  },
  {
    id: 'slide-4',
    type: 'image',
    title: 'Deteksi Dini Fase Kritis DBD: Hari ke 4 s/d 5',
    subtitle: 'Waspada Siklus Pelana Kuda (Saddleback Fever)',
    category: 'Poster 3M+',
    badge: '⚠️ PERINGATAN MEDIS',
    thumbnailUrl: 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&w=1200&q=80',
    description: 'Banyak warga terkecoh saat demam anak turun di hari ke-4 dan mengira sembuh, padahal justru memasuki fase kritis kebocoran plasma dan risiko syok (DSS).',
    keyPoints: [
      'Waspadai nyeri perut hebat yang makin memberat',
      'Muntah terus-menerus dan anak tampak gelisah/lemas',
      'Ujung tangan dan kaki teraba dingin serta pucat',
      'Perdarahan gusi, mimisan, atau bintik merah tak pudar saat ditekan'
    ],
    actionLabel: 'Buka Protokol Triage',
    source: 'Rumah Sakit Darurat Infeksi Nasional',
    author: 'Dokter Spesialis Penyakit Dalam'
  },
  {
    id: 'slide-5',
    type: 'movie',
    title: 'Aksi Jumantik Cilik: Detektif Pemburu Jentik',
    subtitle: 'Dokumenter Semangat Anak Sekolah Bebas DBD',
    category: 'Film Komunitas',
    badge: '🏆 FILM INSPIRASI',
    duration: '2:15 Menit',
    thumbnailUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80',
    description: 'Kisah seru regu Jumantik Cilik SD Harapan Bangsa berburu jentik dengan senter mini dan membagikan stiker bintang bersih kepada warga RT.',
    keyPoints: [
      'Pemeriksaan rutin setiap hari Jumat pagi',
      'Pemberian stiker bebas jentik di pintu rumah warga',
      'Kuis cerdas cermat 3M+ antar kelas',
      'Mencapai Angka Bebas Jentik (ABJ) 98% di lingkungan sekolah'
    ],
    actionLabel: 'Tonton Kisah Cilik',
    source: 'Gerakan Sekolah Sehat Kemenkes RI',
    author: 'Regu Jumantik Cilik Binaan'
  }
];
