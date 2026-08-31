import { UserProfile } from '../types/auth';

export const DEFAULT_ADMIN_USER: UserProfile = {
  id: 'admin-utama',
  name: 'Admin Utama Jumantik',
  role: 'admin',
  phone: '081122334455',
  email: 'admin@sijumantik.id',
  authProvider: 'email',
  address: 'Posko SiJumantik / Kantor Kelurahan',
  rt: '00',
  rw: '00',
  kelurahan: 'Kelurahan Sukamaju',
  avatar: '🛡️👑',
  points: 1000,
  stars: 500,
  badgeTitle: 'Super Administrator 🛡️',
  pin: '1234',
  registeredAt: '2026-08-01',
  completedMissions: ['m-1', 'm-2', 'm-3']
};

export const INITIAL_USERS: UserProfile[] = [DEFAULT_ADMIN_USER];

export const AVATAR_OPTIONS = [
  { emoji: '🛡️👑', label: 'Admin / Pengelola' },
  { emoji: '👩‍⚕️📋', label: 'Kader Posyandu' },
  { emoji: '👨‍⚕️🏥', label: 'Dokter / Nakes' },
  { emoji: '🧕🌸', label: 'Ibu Siaga' },
  { emoji: '👨‍🦰🏡', label: 'Bapak Sigap' },
  { emoji: '👦🎒', label: 'Anak Hebat (L)' },
  { emoji: '👧🎀', label: 'Anak Pintar (P)' },
  { emoji: '👵👓', label: 'Nenek Sehat' },
  { emoji: '👴🧢', label: 'Kakek Bugar' },
];

