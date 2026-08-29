export interface MosquitoStage {
  id: string;
  name: string;
  nameIndo: string;
  duration: string;
  habitat: string;
  description: string;
  howToEradicate: string;
  icon: string;
  imageUrl: string;
  tips: string[];
}

export const MOSQUITO_STAGES: MosquitoStage[] = [
  {
    id: 'stage-telur',
    name: 'Egg Stage',
    nameIndo: '1. Fase Telur (1 - 2 Hari)',
    duration: '1-2 hari menetas (bisa bertahan kering hingga 6 bulan!)',
    habitat: 'Menempel di dinding penampungan air bersih, 1 cm di atas permukaan air.',
    description: 'Telur Aedes aegypti berbentuk lonjong kecil berwarna hitam pekat. Seekor nyamuk betina bisa bertelur 100-200 butir sekaligus. Telur yang kering di dinding bak mandi tidak mati dan akan langsung menetas saat tergenang air kembali!',
    howToEradicate: 'Sikat dinding bak mandi dan penampungan air secara menyeluruh, jangan hanya dibilas/dikuras airnya.',
    icon: 'Egg',
    imageUrl: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=600&q=80',
    tips: [
      'Menyikat dinding bak mandi dengan spon kasar/sikat minimal 1x seminggu',
      'Bersihkan lekukan dispenser dan tatakan kulkas yang lembap',
      'Tutup rapat toren atau drum air penampungan'
    ]
  },
  {
    id: 'stage-jentik',
    name: 'Larva Stage',
    nameIndo: '2. Fase Jentik / Larva (6 - 8 Hari)',
    duration: '6-8 hari',
    habitat: 'Berenang lincah di air jernih, bergerak naik-turun tegak lurus (vertikal) ke permukaan air.',
    description: 'Jentik bernapas dengan tabung udara (sifon) pendek di ekornya. Gerakannya sangat aktif meliuk-liuk seperti huruf S. Nyamuk Aedes aegypti HANYA berkembang biak di AIR BERSIH / relatif jernih (bukan selokan kotor/got berbusa).',
    howToEradicate: 'Gunakan bubuk Abate (1 gram untuk 10 liter air), pelihara ikan pemakan jentik (guppy/cupang), atau kuras rutin.',
    icon: 'Activity',
    imageUrl: 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=600&q=80',
    tips: [
      'Gunakan senter saat memeriksa bak mandi untuk melihat gerakan jentik',
      'Satu gram bubuk larvasida (Abate) efektif melindungi air selama 2-3 bulan',
      'Ikan cupang atau guppy dapat memakan 50-100 jentik per hari'
    ]
  },
  {
    id: 'stage-pupa',
    name: 'Pupa Stage',
    nameIndo: '3. Fase Kepompong / Pupa (1 - 2 Hari)',
    duration: '1-2 hari',
    habitat: 'Mengapung di permukaan air, berbentuk koma / tanda tanya (?), tidak makan.',
    description: 'Pupa adalah fase transisi sebelum menjadi nyamuk dewasa yang bisa terbang. Sangat lincah menyelam ke dasar air jika merasakan getaran atau bayangan.',
    howToEradicate: 'Kuras dan buang air ke tanah kering agar pupa mati dan tidak sempat menetas menjadi nyamuk.',
    icon: 'Layers',
    imageUrl: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=600&q=80',
    tips: [
      'Jangan buang air kurasan ke selokan jika masih ada pupa/jentik, buang ke tanah berpasir/tanaman',
      'Pasang kassa nyamuk pada lubang ventilasi dan pipa pembuangan air'
    ]
  },
  {
    id: 'stage-dewasa',
    name: 'Adult Mosquito',
    nameIndo: '4. Fase Nyamuk Dewasa (2 - 4 Minggu)',
    duration: 'Umur 2-4 minggu (bisa menggigit puluhan orang)',
    habitat: 'Hinggap di pakaian yang tergantung di ruangan gelap, tirai, dan sudut rumah.',
    description: 'Hanya nyamuk BETINA yang menghisap darah manusia untuk mematangkan telurnya. Memiliki ciri belang loreng hitam-putih di tubuh dan kakinya. Paling aktif menggigit pada JAM 08.00 - 10.00 PAGI dan 15.00 - 17.00 SORE.',
    howToEradicate: 'Gunakan lotion anti nyamuk, hindari menggantung pakaian kotor, pasang kassa, dan fogging bila ada klaster kasus.',
    icon: 'ShieldAlert',
    imageUrl: 'https://images.unsplash.com/photo-1551884831-bbf3cdc6469e?auto=format&fit=crop&w=600&q=80',
    tips: [
      'Pakaikan lotion anti nyamuk pada anak saat jam sekolah pagi dan sore hari',
      'Hindari menumpuk atau menggantung pakaian bekas di kamar tidur',
      'Tanam tanaman pengusir nyamuk seperti lavender, serai wangi, zodia, dan rosemary'
    ]
  }
];

export interface SymptomPhase {
  phaseNumber: number;
  title: string;
  days: string;
  temperature: string;
  description: string;
  dangerLevel: 'sedang' | 'kritis' | 'pemulihan';
  symptomsList: string[];
  warningSigns: string[];
  medicalActions: string[];
  fluidGuideline: string;
}

export const DENGUE_PHASES: SymptomPhase[] = [
  {
    phaseNumber: 1,
    title: 'Fase Demam (Febrile Phase)',
    days: 'Hari ke 1 - 3',
    temperature: 'Demam Mendadak Sangat Tinggi (39°C - 40.5°C)',
    description: 'Demam mendadak tinggi terus-menerus yang sulit turun meski diberi parasetamol. Disertai pegal linu berat (breakbone fever), nyeri di belakang bola mata, mual, dan bintik merah.',
    dangerLevel: 'sedang',
    symptomsList: [
      'Demam tinggi mendadak (biphasic/pelana kuda)',
      'Nyeri kepala hebat dan nyeri di belakang bola mata',
      'Nyeri sendi, otot, dan tulang yang intens',
      'Mual, muntah, nafsu makan turun drastis',
      'Bintik-bintik merah (petekie) pada kulit yang tidak hilang saat ditekan'
    ],
    warningSigns: [
      'Dehidrasi akibat asupan minum kurang dan muntah',
      'Lemah dan lesu berlebihan'
    ],
    medicalActions: [
      'Kompres air hangat (jangan air dingin/es)',
      'Berikan Parasetamol sesuai dosis (HINDARI Aspirin / Ibuprofen karena memicu perdarahan lambung!)',
      'Cek darah lengkap di Puskesmas (Hemoglobin, Hematokrit, Leukosit, Trombosit, NS1 Ag)'
    ],
    fluidGuideline: 'Minum air putih, oralit, jus buah, atau air kelapa minimal 2-3 liter/hari untuk mencegah kebocoran plasma.'
  },
  {
    phaseNumber: 2,
    title: 'Fase Kritis (Critical Phase - Waspada Syok!)',
    days: 'Hari ke 4 - 5',
    temperature: 'Suhu Turun ke 37°C (Sering Dikira Sudah Sembuh!)',
    description: 'PERINGATAN: Ini adalah fase paling mematikan. Demam turun drastis, tetapi terjadi kebocoran plasma darah keluar pembuluh. Trombosit anjlok dan hematokrit melonjak. Risiko Dengue Shock Syndrome (DSS).',
    dangerLevel: 'kritis',
    symptomsList: [
      'Suhu tubuh seolah kembali normal atau turun drastis',
      'Ujung tangan dan kaki terasa dingin dan basah/lembab (akral dingin)',
      'Detak nadi cepat tetapi teraba lemah',
      'Penurunan volume buang air kecil (jarang kencing > 6 jam)',
      'Trombosit anjlok drastis (< 100.000 /uL) dan Hematokrit naik > 20%'
    ],
    warningSigns: [
      '🚨 Nyeri perut hebat / ulu hati yang tak tertahankan',
      '🚨 Muntah terus-menerus (>3 kali dalam 24 jam)',
      '🚨 Perdarahan: Mimisan, gusi berdarah, muntah hitam/darah, BAB hitam',
      '🚨 Gelisah, mengantuk berlebih, bicara meracau, atau sangat lemas',
      '🚨 Napas cepat atau sesak napas akibat cairan menumpuk di paru-paru'
    ],
    medicalActions: [
      'SEGERA bawa ke IGD Puskesmas 24 Jam atau Rumah Sakit!',
      'Pasien WAJIB mendapatkan infus cairan kristaloid (Ringer Lactate) secara terkontrol',
      'Pantau ketat tanda vital, produksi urin, dan cek darah tiap 6-12 jam'
    ],
    fluidGuideline: 'Wajib dipantau dokter via infus intravena seimbang untuk mencegah syok hipovolemik maupun overload cairan.'
  },
  {
    phaseNumber: 3,
    title: 'Fase Pemulihan (Recovery Phase)',
    days: 'Hari ke 6 - 7+',
    temperature: 'Suhu Normal Stabil (36.5°C - 37.2°C)',
    description: 'Cairan plasma diserap kembali ke dalam pembuluh darah. Trombosit mulai naik perlahan, nafsu makan kembali, dan muncul ruam pemulihan (white islands in a sea of red).',
    dangerLevel: 'pemulihan',
    symptomsList: [
      'Keadaan umum membaik, nafsu makan dan minum meningkat pesat',
      'Jumlah air kencing normal dan jernih',
      'Trombosit meningkat stabil (> 100.000 - 150.000 /uL)',
      'Muncul ruam kulit kemerahan dengan pulau-pulau putih gatal (ruam konvalesens)'
    ],
    warningSigns: [
      'Waspadai kelebihan cairan (hipervolemia) jika pemberian infus tidak diturunkan tepat waktu'
    ],
    medicalActions: [
      'Turunkan laju infus secara bertahap sesuai anjuran dokter',
      'Makan makanan bergizi tinggi protein (telur, ikan, sup kaldu)',
      'Istirahat tirah baring cukup sampai stamina pulih total'
    ],
    fluidGuideline: 'Cukupi kebutuhan cairan oral secara alami melalui makanan berkuah dan minuman segar bernutrisi.'
  }
];

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  category: 'PSN 3M' | 'Gejala & Triage' | 'Biologi Nyamuk' | 'Pertolongan Pertama';
}

export const JUMANTIK_QUIZ: QuizQuestion[] = [
  {
    id: 1,
    question: 'Kapan waktu nyamuk Aedes aegypti paling aktif menggigit manusia?',
    options: [
      'Tengah malam jam 24.00 - 03.00',
      'Pagi hari (08.00-10.00) dan Sore hari (15.00-17.00)',
      'Hanya saat siang bolong jam 12.00',
      'Saat subuh sebelum matahari terbit saja'
    ],
    correctAnswerIndex: 1,
    explanation: 'Aedes aegypti adalah nyamuk diurnal yang memiliki puncak aktivitas menggigit pada pagi (08.00-10.00) dan sore (15.00-17.00).',
    category: 'Biologi Nyamuk'
  },
  {
    id: 2,
    question: 'Mengapa dinding bak mandi HARUS DISIKAT saat menguras, bukan hanya sekadar dibuang airnya?',
    options: [
      'Agar bak mandi wangi seperti sabun',
      'Karena telur nyamuk menempel kuat di dinding dan bisa bertahan kering berbulan-bulan',
      'Supaya air bak mandi lebih hangat',
      'Hanya untuk membersihkan lumut saja'
    ],
    correctAnswerIndex: 1,
    explanation: 'Telur Aedes aegypti menempel di dinding wadah tepat di atas permukaan air. Telur ini memiliki cangkang kuat yang tahan kekeringan hingga 6 bulan dan akan langsung menetas saat terisi air kembali.',
    category: 'PSN 3M'
  },
  {
    id: 3,
    question: 'Kapan fase paling berbahaya / kritis pada pasien yang terinfeksi Demam Berdarah (DBD)?',
    options: [
      'Hari ke-1 saat demam baru mulai naik',
      'Hari ke 4 - 5 ketika suhu tubuh tiba-tiba turun mendekati normal',
      'Hari ke-10 setelah keluar dari rumah sakit',
      'Saat timbul bintik gatal di seluruh tubuh di hari ke-7'
    ],
    correctAnswerIndex: 1,
    explanation: 'Fase Kritis terjadi pada hari ke 4-5 saat demam turun mendadak. Pada fase ini terjadi kebocoran plasma yang dapat memicu penurunan trombosit drastis dan syok (DSS) jika tidak ditangani segera.',
    category: 'Gejala & Triage'
  },
  {
    id: 4,
    question: 'Obat penurun panas manakah yang TIDAK BOLEH diberikan kepada pasien yang dicurigai DBD?',
    options: [
      'Parasetamol',
      'Ibuprofen dan Asam Mefenamat / Aspirin',
      'Kompres air hangat',
      'Air kelapa muda murni'
    ],
    correctAnswerIndex: 1,
    explanation: 'Obat golongan NSAID seperti Ibuprofen, Asam Mefenamat, dan Aspirin dilarang keras karena dapat memicu iritasi lambung dan memperparah risiko perdarahan internal pada pasien DBD.',
    category: 'Pertolongan Pertama'
  },
  {
    id: 5,
    question: 'Berapakah target nasional Angka Bebas Jentik (ABJ) suatu wilayah agar aman dari ancaman penularan DBD?',
    options: [
      'Minimal 50%',
      'Minimal 75%',
      'Minimal 95%',
      'Cukup 80%'
    ],
    correctAnswerIndex: 2,
    explanation: 'Kementerian Kesehatan RI menetapkan standar Angka Bebas Jentik (ABJ) minimal 95%. Jika ABJ di bawah 95%, wilayah tersebut berstatus waspada hingga rawan KLB DBD.',
    category: 'PSN 3M'
  },
  {
    id: 6,
    question: 'Berapakah takaran bubuk Abate (Temephos 1%) yang tepat untuk penampungan air?',
    options: [
      '1 sendok makan penuh untuk 1 gayung air',
      '1 gram (1 sendok takar kecil) untuk setiap 10 liter air (atau 10 gram per 100 liter)',
      '1 bungkus langsung dituangkan tanpa takaran',
      '10 gram untuk 1 liter air'
    ],
    correctAnswerIndex: 1,
    explanation: 'Dosis standar larvasida Abate adalah 1 gram untuk 10 liter air (atau 100 gram untuk 1.000 liter / 1 m3 air). Satu dosis efektif membunuh larva selama 2-3 bulan.',
    category: 'PSN 3M'
  }
];
