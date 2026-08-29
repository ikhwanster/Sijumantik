export type InspectionLocation = 
  | 'bak_mandi'
  | 'dispenser'
  | 'tatakan_pot'
  | 'talang_air'
  | 'tempat_minum_hewan'
  | 'tatakan_kulkas'
  | 'penampungan_ac'
  | 'drum_toren'
  | 'ban_bekas'
  | 'barang_bekas_luar';

export interface InspectionPoint {
  id: string;
  location: InspectionLocation;
  name: string;
  icon: string;
  hasStandingWater: boolean;
  hasLarvae: boolean;
  actionTaken: 'kuras' | 'tutup' | 'abate' | 'pelihara_ikan' | 'bersihkan' | 'aman' | 'belum';
  notes?: string;
  photoUrl?: string;
}

export interface HomeInspectionRecord {
  id: string;
  date: string;
  inspectorName: string;
  houseAddress: string;
  rt: string;
  rw: string;
  kelurahan: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  points: InspectionPoint[];
  totalContainers: number;
  positiveContainers: number;
  status: 'bebas_jentik' | 'waspada_jentik' | 'positif_jentik';
  abjScore: number; // 100 if clean, 0 if positive for single house, or % for aggregated
  notes: string;
  verifiedByKader?: boolean;
  photoUrl?: string;
}

export interface CommunityReport {
  id: string;
  reporterName: string;
  title: string;
  description: string;
  category: 'genangan_liar' | 'selokan_mampet' | 'sampah_plastik' | 'fasilitas_umum' | 'dugaan_kasus_dbd';
  address: string;
  rtRw: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  photoUrl: string;
  createdAt: string;
  upvotes: number;
  status: 'menunggu_verifikasi' | 'terverifikasi' | 'dalam_tindakan' | 'selesai';
  actionNote?: string;
  verifiedBy?: string;
}

export interface DengueCaseReport {
  id: string;
  patientInitials: string;
  age: number;
  gender: 'L' | 'P';
  address: string;
  rtRw: string;
  feverDay: number;
  symptoms: string[];
  warningSigns: string[];
  diagnosis: 'Demam Dengue' | 'DBD Derajat I' | 'DBD Derajat II' | 'DBD Derajat III (DSS)' | 'Dugaan Gejala';
  plateletCount?: number; // Trombosit (normal 150.000 - 450.000)
  hematocrit?: number;
  status: 'rawat_jalan' | 'rawat_inap' | 'rujukan_icu' | 'sembuh';
  faskesName: string;
  reportedAt: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  foggingScheduled?: boolean;
  foggingDate?: string;
}

export interface FaskesFacility {
  id: string;
  name: string;
  type: 'Puskesmas' | 'Rumah Sakit' | 'Klinik Satgas';
  address: string;
  phone: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  dengueBedCapacity: number;
  availableBeds: number;
  abateStockKg: number;
  rdtDengueStock: number;
  foggingTeamsAvailable: number;
  bloodPlateletStock: number; // Kantong Trombosit
  distanceKm?: number;
}

export interface AreaZone {
  id: string;
  name: string;
  rtRw: string;
  kelurahan: string;
  totalHouses: number;
  inspectedHouses: number;
  positiveHouses: number;
  abj: number; // Angka Bebas Jentik (% target >= 95%)
  houseIndex: number; // HI %
  containerIndex: number; // CI %
  breteauIndex: number; // BI per 100 houses
  riskLevel: 'aman' | 'waspada' | 'bahaya_klb';
  activeCases: number;
  coordinates: {
    lat: number;
    lng: number;
  };
  polygon?: [number, number][];
}

export interface EmergencyNotification {
  id: string;
  title: string;
  message: string;
  level: 'info' | 'warning' | 'danger';
  affectedArea: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  radiusMeters: number;
}

export interface LogisticsItem {
  id: string;
  name: string;
  category: 'Larvasida (Abate)' | 'RDT Dengue NS1' | 'Kelambu Insektisida' | 'Mesin & Cairan Fogging' | 'Cairan Infus Ringer Lactate' | 'Kassa Nyamuk';
  quantity: number;
  unit: string;
  allocatedTo: string;
  lastUpdated: string;
  status: 'cukup' | 'menipis' | 'kritis';
}

export interface PredictionFactor {
  period: string;
  rainfallMm: number; // Curah Hujan
  humidityPct: number; // Kelembaban
  avgTempC: number; // Suhu
  predictedLarvaDensity: number; // Estimasi Kepadatan Jentik
  projectedRiskScore: number; // 0 - 100
  recommendedAction: string;
}
