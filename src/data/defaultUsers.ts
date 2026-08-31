import { UserProfile } from '../types/auth';

export const INITIAL_USERS: UserProfile[] = [
  {
    id: 'user-anak-1',
    name: 'Rafi si Pemburu Jentik',
    role: 'anak',
    phone: '081234567890',
    address: 'Jl. Mawar Indah No. 12',
    rt: '02',
    rw: '02',
    kelurahan: 'Kelurahan Sukamaju',
    avatar: '👦🎒',
    points: 150,
    stars: 18,
    badgeTitle: 'Duta Cilik Jumantik ⭐⭐',
    pin: '1234',
    registeredAt: '2026-08-15',
    completedMissions: ['m-1', 'm-2']
  },
  {
    id: 'user-warga-1',
    name: 'Ibu Hj. Siti Aminah',
    role: 'warga',
    phone: '085712345678',
    address: 'Jl. Mawar Melati No. 18',
    rt: '02',
    rw: '02',
    kelurahan: 'Kelurahan Sukamaju',
    avatar: '🧕🌸',
    points: 320,
    stars: 35,
    badgeTitle: 'Pahlawan Rumah Sehat',
    pin: '1234',
    registeredAt: '2026-08-01',
    completedMissions: ['m-1', 'm-2', 'm-3']
  },
  {
    id: 'user-kader-1',
    name: 'Ibu Dewi Kartika',
    role: 'kader',
    phone: '081398765432',
    address: 'Posyandu Melati RT 02/02',
    rt: '02',
    rw: '02',
    kelurahan: 'Kelurahan Sukamaju',
    avatar: '👩‍⚕️📋',
    points: 850,
    stars: 90,
    badgeTitle: 'Kader Jumantik Teladan',
    pin: '1234',
    registeredAt: '2026-07-10',
    completedMissions: ['m-1', 'm-2', 'm-3', 'm-4']
  },
  {
    id: 'user-puskesmas-1',
    name: 'dr. Hendra Pratama',
    role: 'puskesmas',
    phone: '082111223344',
    address: 'Puskesmas Sukamaju Indah',
    rt: '01',
    rw: '01',
    kelurahan: 'Kelurahan Sukamaju',
    avatar: '👨‍⚕️🏥',
    points: 1200,
    stars: 150,
    badgeTitle: 'Satgas DBD Puskesmas',
    pin: '1234',
    registeredAt: '2026-06-01',
    completedMissions: ['m-1', 'm-2', 'm-3', 'm-4']
  }
];

export const AVATAR_OPTIONS = [
  { emoji: '👦🎒', label: 'Anak Hebat (L)' },
  { emoji: '👧🎀', label: 'Anak Pintar (P)' },
  { emoji: '🧕🌸', label: 'Ibu Siaga' },
  { emoji: '👵👓', label: 'Nenek Sehat' },
  { emoji: '👴🧢', label: 'Kakek Bugar' },
  { emoji: '👨‍🦰🏡', label: 'Bapak Sigap' },
  { emoji: '👩‍⚕️📋', label: 'Kader Posyandu' },
  { emoji: '👨‍⚕️🏥', label: 'Dokter / Nakes' },
];
