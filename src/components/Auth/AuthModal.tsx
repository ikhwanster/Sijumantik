import React, { useState } from 'react';
import { 
  X, 
  User, 
  Lock, 
  Phone, 
  MapPin, 
  Sparkles, 
  Smile, 
  Heart, 
  CheckCircle2, 
  LogIn, 
  UserPlus, 
  ArrowRight,
  ShieldCheck,
  Star,
  Award,
  Zap
} from 'lucide-react';
import { UserProfile, UserRole } from '../../types/auth';
import { AVATAR_OPTIONS, INITIAL_USERS } from '../../data/defaultUsers';
import { playAlertTone } from '../../utils/audioAlert';
import { speakIndonesian } from '../../utils/speechHelper';
import confetti from 'canvas-confetti';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  onLogin: (user: UserProfile) => void;
  onRegister: (newUser: UserProfile) => void;
  allUsers: UserProfile[];
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLogin,
  onRegister,
  allUsers
}) => {
  const [tab, setTab] = useState<'login' | 'register'>('login');

  // Login form state
  const [loginPhoneOrName, setLoginPhoneOrName] = useState('');
  const [loginPin, setLoginPin] = useState('');
  const [loginError, setLoginError] = useState('');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('warga');
  const [regPhone, setRegPhone] = useState('');
  const [regAddress, setRegAddress] = useState('');
  const [regRt, setRegRt] = useState('02');
  const [regRw, setRegRw] = useState('02');
  const [regKelurahan, setRegKelurahan] = useState('Kelurahan Sukamaju');
  const [regAvatar, setRegAvatar] = useState('🧕🌸');
  const [regPin, setRegPin] = useState('');
  const [regError, setRegError] = useState('');

  if (!isOpen) return null;

  // Handle direct 1-tap quick login for demo users
  const handleQuickLogin = (user: UserProfile) => {
    onLogin(user);
    playAlertTone('success');
    speakIndonesian(`Selamat datang kembali ${user.name}! SiJumantik siap digunakan.`);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 }
    });
    onClose();
  };

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!loginPhoneOrName.trim()) {
      setLoginError('Mohon masukkan Nama atau Nomor HP.');
      return;
    }

    const found = allUsers.find(
      (u) =>
        (u.phone === loginPhoneOrName.trim() ||
          u.name.toLowerCase().includes(loginPhoneOrName.trim().toLowerCase())) &&
        (!loginPin || u.pin === loginPin.trim())
    );

    if (found) {
      handleQuickLogin(found);
    } else {
      setLoginError('Akun tidak ditemukan atau PIN salah. Silakan coba lagi atau daftar baru.');
      playAlertTone('warning');
    }
  };

  const handleManualRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');

    if (!regName.trim()) {
      setRegError('Mohon isi Nama Lengkap atau Panggilan.');
      return;
    }
    if (!regPhone.trim()) {
      setRegError('Mohon isi Nomor HP / WhatsApp.');
      return;
    }

    let defaultTitle = 'Warga Siaga 1R1J 🏡';
    let initStars = 10;
    let initPoints = 50;

    if (regRole === 'anak') {
      defaultTitle = 'Pahlawan Cilik Jumantik ⭐';
      initStars = 25;
      initPoints = 100;
    } else if (regRole === 'kader') {
      defaultTitle = 'Kader Jumantik Terpercaya 📋';
      initStars = 50;
      initPoints = 200;
    } else if (regRole === 'puskesmas') {
      defaultTitle = 'Satgas Medis Puskesmas 🏥';
      initStars = 100;
      initPoints = 500;
    }

    const newUser: UserProfile = {
      id: `user-${Date.now()}`,
      name: regName.trim(),
      role: regRole,
      phone: regPhone.trim(),
      address: regAddress.trim() || 'Jl. Mawar Melati No. 1',
      rt: regRt.trim() || '01',
      rw: regRw.trim() || '01',
      kelurahan: regKelurahan.trim() || 'Kelurahan Sukamaju',
      avatar: regAvatar,
      points: initPoints,
      stars: initStars,
      badgeTitle: defaultTitle,
      pin: regPin.trim() || '1234',
      registeredAt: new Date().toISOString().split('T')[0],
      completedMissions: ['m-1']
    };

    onRegister(newUser);
    playAlertTone('success');
    speakIndonesian(`Selamat bergabung ${newUser.name}! Akun berhasil dibuat.`);
    confetti({
      particleCount: 80,
      spread: 80,
      origin: { y: 0.6 }
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full border-2 border-emerald-500 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-400 text-emerald-950 flex items-center justify-center text-2xl shadow-md shrink-0">
              🏡
            </div>
            <div>
              <h3 className="font-black text-lg sm:text-xl leading-tight">
                {tab === 'login' ? 'Masuk ke SiJumantik' : 'Daftar Akun Baru'}
              </h3>
              <p className="text-xs text-emerald-100 mt-0.5">
                Mudah untuk Anak-anak, Ibu-ibu & Lansia
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-2 rounded-xl hover:bg-white/10 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tab Selector: Masuk vs Daftar */}
        <div className="flex border-b border-slate-200 bg-slate-50 p-1.5 gap-1.5">
          <button
            type="button"
            onClick={() => {
              setTab('login');
              setLoginError('');
            }}
            className={`flex-1 py-2.5 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
              tab === 'login'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>1. Masuk (Login)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setTab('register');
              setRegError('');
            }}
            className={`flex-1 py-2.5 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
              tab === 'register'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>2. Daftar Baru</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-slate-800">
          {tab === 'login' ? (
            <div className="space-y-4">
              {/* Quick 1-Tap Login for Kids & Elderly */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black text-emerald-900 flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                    <span>PILIH AKUN CEPAT (1 KALI KLIK):</span>
                  </span>
                  <span className="text-[10px] text-slate-400">Tanpa ribet sandi</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {allUsers.slice(0, 4).map((u) => {
                    const isSelected = currentUser?.id === u.id;
                    return (
                      <button
                        key={u.id}
                        type="button"
                        onClick={() => handleQuickLogin(u)}
                        className={`p-3 rounded-2xl border-2 text-left transition-all flex items-center gap-2.5 cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-50 border-emerald-500 shadow-md ring-2 ring-emerald-400/30'
                            : 'bg-slate-50 border-slate-200 hover:bg-emerald-50/60 hover:border-emerald-300'
                        }`}
                      >
                        <span className="text-2xl shrink-0">{u.avatar}</span>
                        <div className="overflow-hidden">
                          <p className="font-extrabold text-xs text-slate-900 truncate">
                            {u.name}
                          </p>
                          <p className="text-[10px] text-emerald-700 font-bold truncate">
                            {u.role === 'anak'
                              ? '🧒 Jumantik Cilik'
                              : u.role === 'warga'
                              ? '🧕 Warga / Lansia'
                              : u.role === 'kader'
                              ? '📋 Kader RT'
                              : '🏥 Puskesmas'}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="relative flex items-center justify-center">
                <div className="border-t border-slate-200 w-full" />
                <span className="bg-white px-3 text-[11px] font-bold text-slate-400 uppercase">
                  Atau Masuk Manual
                </span>
                <div className="border-t border-slate-200 w-full" />
              </div>

              {/* Manual Login Form */}
              <form onSubmit={handleManualLogin} className="space-y-3">
                {loginError && (
                  <div className="p-3 bg-red-50 border border-red-300 text-red-700 text-xs rounded-xl font-bold">
                    ⚠️ {loginError}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1">
                    Nama atau Nomor HP:
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={loginPhoneOrName}
                      onChange={(e) => setLoginPhoneOrName(e.target.value)}
                      placeholder="Contoh: Rafi atau 081234567890"
                      className="w-full text-xs sm:text-sm font-semibold bg-slate-50 border border-slate-300 rounded-2xl p-3 pl-10 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                    />
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1">
                    PIN / Sandi Sederhana (Opsional):
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      maxLength={6}
                      value={loginPin}
                      onChange={(e) => setLoginPin(e.target.value)}
                      placeholder="Contoh: 1234 (Boleh dikosongkan)"
                      className="w-full text-xs sm:text-sm font-semibold bg-slate-50 border border-slate-300 rounded-2xl p-3 pl-10 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                    />
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm py-3.5 px-4 rounded-2xl shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
                >
                  <LogIn className="w-4 h-4" />
                  <span>MASUK SEKARANG</span>
                </button>
              </form>
            </div>
          ) : (
            /* REGISTER FORM */
            <form onSubmit={handleManualRegister} className="space-y-3.5">
              {regError && (
                <div className="p-3 bg-red-50 border border-red-300 text-red-700 text-xs rounded-xl font-bold">
                  ⚠️ {regError}
                </div>
              )}

              {/* 1. Pilih Kategori Peran */}
              <div>
                <label className="block text-xs font-black text-slate-800 mb-1.5">
                  1. Pilih Jenis Pengguna:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setRegRole('anak');
                      setRegAvatar('👦🎒');
                    }}
                    className={`p-2.5 rounded-2xl border-2 text-center transition-all flex flex-col items-center gap-1 ${
                      regRole === 'anak'
                        ? 'bg-amber-50 border-amber-500 ring-2 ring-amber-400/30'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <span className="text-2xl">👦🎒</span>
                    <span className="text-xs font-black text-amber-900">Jumantik Cilik</span>
                    <span className="text-[10px] text-slate-500">Anak & Siswa Sekolah</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setRegRole('warga');
                      setRegAvatar('🧕🌸');
                    }}
                    className={`p-2.5 rounded-2xl border-2 text-center transition-all flex flex-col items-center gap-1 ${
                      regRole === 'warga'
                        ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-400/30'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <span className="text-2xl">🧕🌸</span>
                    <span className="text-xs font-black text-emerald-900">Warga / Lansia</span>
                    <span className="text-[10px] text-slate-500">Ibu-Ibu & Kakek/Nenek</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setRegRole('kader');
                      setRegAvatar('👩‍⚕️📋');
                    }}
                    className={`p-2.5 rounded-2xl border-2 text-center transition-all flex flex-col items-center gap-1 ${
                      regRole === 'kader'
                        ? 'bg-teal-50 border-teal-500 ring-2 ring-teal-400/30'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <span className="text-2xl">👩‍⚕️📋</span>
                    <span className="text-xs font-black text-teal-900">Kader Jumantik</span>
                    <span className="text-[10px] text-slate-500">Kader RT / RW / Posyandu</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setRegRole('puskesmas');
                      setRegAvatar('👨‍⚕️🏥');
                    }}
                    className={`p-2.5 rounded-2xl border-2 text-center transition-all flex flex-col items-center gap-1 ${
                      regRole === 'puskesmas'
                        ? 'bg-cyan-50 border-cyan-500 ring-2 ring-cyan-400/30'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <span className="text-2xl">👨‍⚕️🏥</span>
                    <span className="text-xs font-black text-cyan-900">Puskesmas</span>
                    <span className="text-[10px] text-slate-500">Dokter & Nakes</span>
                  </button>
                </div>
              </div>

              {/* 2. Pilih Karakter Avatar */}
              <div>
                <label className="block text-xs font-black text-slate-800 mb-1">
                  2. Pilih Karakter Lucu:
                </label>
                <div className="flex items-center gap-2 overflow-x-auto p-1">
                  {AVATAR_OPTIONS.map((opt) => (
                    <button
                      key={opt.emoji}
                      type="button"
                      onClick={() => setRegAvatar(opt.emoji)}
                      className={`p-2 rounded-2xl border-2 text-xl shrink-0 transition-all ${
                        regAvatar === opt.emoji
                          ? 'bg-emerald-100 border-emerald-500 scale-110 shadow-xs'
                          : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                      }`}
                      title={opt.label}
                    >
                      {opt.emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Nama & No HP */}
              <div className="space-y-2">
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1">
                    Nama Lengkap / Nama Panggilan:
                  </label>
                  <input
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="Contoh: Ibu Hj. Farida atau Farhan"
                    className="w-full text-xs sm:text-sm font-semibold bg-slate-50 border border-slate-300 rounded-2xl p-2.5 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1">
                    Nomor WhatsApp / HP:
                  </label>
                  <input
                    type="tel"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="Contoh: 081234567890"
                    className="w-full text-xs sm:text-sm font-semibold bg-slate-50 border border-slate-300 rounded-2xl p-2.5 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
              </div>

              {/* 4. Alamat & RT/RW */}
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-3">
                  <label className="block text-xs font-extrabold text-slate-700 mb-1">
                    Alamat Rumah (Jalan / No):
                  </label>
                  <input
                    type="text"
                    value={regAddress}
                    onChange={(e) => setRegAddress(e.target.value)}
                    placeholder="Contoh: Jl. Anggrek No. 5"
                    className="w-full text-xs font-semibold bg-slate-50 border border-slate-300 rounded-xl p-2 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-0.5">RT:</label>
                  <input
                    type="text"
                    value={regRt}
                    onChange={(e) => setRegRt(e.target.value)}
                    className="w-full text-xs font-bold text-center bg-slate-50 border border-slate-300 rounded-xl p-2"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-0.5">RW:</label>
                  <input
                    type="text"
                    value={regRw}
                    onChange={(e) => setRegRw(e.target.value)}
                    className="w-full text-xs font-bold text-center bg-slate-50 border border-slate-300 rounded-xl p-2"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-0.5">Kelurahan:</label>
                  <input
                    type="text"
                    value={regKelurahan}
                    onChange={(e) => setRegKelurahan(e.target.value)}
                    className="w-full text-xs font-bold text-center bg-slate-50 border border-slate-300 rounded-xl p-2 truncate"
                  />
                </div>
              </div>

              {/* 5. PIN Sederhana */}
              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">
                  Buat 4 Angka PIN Mudah (Opsional):
                </label>
                <input
                  type="password"
                  maxLength={4}
                  value={regPin}
                  onChange={(e) => setRegPin(e.target.value)}
                  placeholder="1234"
                  className="w-full text-xs sm:text-sm font-semibold bg-slate-50 border border-slate-300 rounded-2xl p-2.5 text-center tracking-widest focus:bg-white focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-800 text-white font-black text-sm sm:text-base py-3.5 px-4 rounded-2xl shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 border border-emerald-400"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>DAFTAR & MULAI SEKARANG</span>
              </button>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-center text-xs text-slate-500">
          🌱 Bersama Berantas Jentik Nyamuk DBD untuk Indonesia Sehat
        </div>
      </div>
    </div>
  );
};
