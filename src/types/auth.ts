export type UserRole = 'anak' | 'warga' | 'kader' | 'puskesmas';

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  phone: string;
  address: string;
  rt: string;
  rw: string;
  kelurahan: string;
  avatar: string;
  points: number;
  stars: number;
  badgeTitle: string;
  pin: string;
  registeredAt: string;
  completedMissions?: string[];
}

export interface KidMission {
  id: string;
  title: string;
  description: string;
  emoji: string;
  starsReward: number;
  targetLocation: string;
  completed: boolean;
}
