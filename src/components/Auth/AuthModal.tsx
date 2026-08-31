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
  Zap,
  Loader2,
  Database,
  Check
} from 'lucide-react';
import { UserProfile, UserRole } from '../../types/auth';
import { AVATAR_OPTIONS, INITIAL_USERS } from '../../data/defaultUsers';
import { playAlertTone } from '../../utils/audioAlert';
import { speakIndonesian } from '../../utils/speechHelper';
import { saveUserToDb, findUserByPhoneOrName } from '../../services/dbService';
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
  const [isLoggingIn, setIsLoggingIn] = useState(false);

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
  const [isRegistering, setIsRegistering] = useState(false);

  if (!isOpen) return null;

  // Handle direct 1-tap quick login for users
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

  const handleManualLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const searchKey = loginPhoneOrName.trim();
    if (!searchKey) {
      setLoginError('Mohon masukkan Nama atau Nomor HP.');
      return;
    }

    setIsLoggingIn(true);

    try {
      // 1. Search in existing in-memory/synced users first
      let found = allUsers.find(
        (u) =>
          (u.phone === searchKey ||
            u.name.toLowerCase().includes(searchKey.toLowerCase()) ||
            u.id.toLowerCase() === searchKey.toLowerCase()) &&
          (!loginPin || u.pin === loginPin.trim())
      );

      // 2. If not found in local memory, search live in Firestore database
      if (!found) {
        const dbUser = await findUserByPhoneOrName(searchKey);
        if (dbUser && (!loginPin || dbUser.pin === loginPin.trim())) {
          found = dbUser;
        }
      }

      if (found) {
        handleQuickLogin(found);
      } else {
        setLoginError('Akun tidak ditemukan di Database Cloud. Silakan periksa kembali Nama / No HP atau daftar baru.');
        playAlertTone('warning');
      }
    } catch (err) {
      console.error('Error during login:', err);
      setLoginError('Gagal memverifikasi akun ke database. Silakan coba lagi.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleManualRegister = async (e: React.FormEvent) => {
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

    setIsRegistering(true);

    try {
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

      const generatedId = `user-${Date.now()}`;
      const newUser: UserProfile = {
        id: generatedId,
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

      // Save directly to Firestore Cloud Database
      await saveUserToDb(newUser);

      onRegister(newUser);
      playAlertTone('success');
      speakIndonesian(`Selamat bergabung ${newUser.name}! Akun berhasil disimpan di Cloud Firestore.`);
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.6 }
      });
      onClose();
    } catch (err) {
      console.error('Registration error:', err);
      setRegError('Terjadi kendala saat menyimpan akun ke Cloud Database. Silakan coba lagi.');
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-xl shrink-0">
              🏡
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-base sm:text-lg leading-tight">
                  {tab === 'login' ? 'Masuk ke SiJumantik' : 'Daftar Akun Baru'}
                </h3>
                <span className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-300 text-[10px] px-1.5 py-0.2 rounded border border-emerald-500/30">
                  <Database className="w-2.5 h-2.5" />
                  <span>Cloud Sync</span>
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Tersinkronisasi otomatis antar HP & Laptop
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
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
            className={`flex-1 py-2 rounded-lg font-medium text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
              tab === 'login'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>1. Masuk (Login)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setTab('register');
              setRegError('');
            }}
            className={`flex-1 py-2 rounded-lg font-medium text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
              tab === 'register'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>2. Daftar Baru</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-slate-800">
          {tab === 'login' ? (
            <div className="space-y-4">
              {/* Quick 1-Tap Login */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-900 flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span>PILIH AKUN CEPAT (1 KLIK):</span>
                  </span>
                  <span className="text-[11px] text-emerald-700 font-medium">
                    {allUsers.length} Akun Terdaftar
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-0.5">
                  {allUsers.map((u) => {
                    const isSelected = currentUser?.id === u.id;
                    return (
                      <button
                        key={u.id}
                        type="button"
                        onClick={() => handleQuickLogin(u)}
                        className={`p-2.5 rounded-xl border text-left transition-colors flex items-center gap-2 cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-50 border-emerald-500'
                            : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <span className="text-xl shrink-0">{u.avatar}</span>
                        <div className="overflow-hidden min-w-0">
                          <p className="font-semibold text-xs text-slate-900 truncate">
                            {u.name}
                          </p>
                          <p className="text-[10px] text-slate-500 truncate">
                            {u.phone ? `📱 ${u.phone}` : u.role}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="relative flex items-center justify-center">
                <div className="border-t border-slate-200 w-full" />
                <span className="bg-white px-2.5 text-[11px] font-medium text-slate-400 uppercase">
                  Atau Masuk via Nama / No HP
                </span>
                <div className="border-t border-slate-200 w-full" />
              </div>

              {/* Manual Login Form */}
              <form onSubmit={handleManualLogin} className="space-y-3">
                {loginError && (
                  <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg font-medium">
                    ⚠️ {loginError}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nama Lengkap atau Nomor HP:
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={loginPhoneOrName}
                      onChange={(e) => setLoginPhoneOrName(e.target.value)}
                      placeholder="Contoh: Farida atau 081234567890"
                      className="w-full text-xs sm:text-sm font-medium bg-slate-50 border border-slate-200 rounded-lg p-2.5 pl-9 focus:bg-white focus:ring-1 focus:ring-slate-900"
                    />
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    PIN / Sandi (Opsional):
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      maxLength={6}
                      value={loginPin}
                      onChange={(e) => setLoginPin(e.target.value)}
                      placeholder="Contoh: 1234 (Boleh dikosongkan)"
                      className="w-full text-xs sm:text-sm font-medium bg-slate-50 border border-slate-200 rounded-lg p-2.5 pl-9 focus:bg-white focus:ring-1 focus:ring-slate-900"
                    />
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs sm:text-sm py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isLoggingIn ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Memeriksa Cloud Database...</span>
                    </>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4" />
                      <span>Masuk Sekarang</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          ) : (
            /* REGISTER FORM */
            <form onSubmit={handleManualRegister} className="space-y-3">
              {regError && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg font-medium">
                  ⚠️ {regError}
                </div>
              )}

              {/* 1. Pilih Kategori Peran */}
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  1. Pilih Jenis Pengguna:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setRegRole('anak');
                      setRegAvatar('👦🎒');
                    }}
                    className={`p-2 rounded-xl border text-center transition-colors flex flex-col items-center gap-0.5 cursor-pointer ${
                      regRole === 'anak'
                        ? 'bg-amber-50 border-amber-400'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-xl">👦🎒</span>
                    <span className="text-xs font-semibold text-amber-900">Jumantik Cilik</span>
                    <span className="text-[10px] text-slate-500">Anak Sekolah</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setRegRole('warga');
                      setRegAvatar('🧕🌸');
                    }}
                    className={`p-2 rounded-xl border text-center transition-colors flex flex-col items-center gap-0.5 cursor-pointer ${
                      regRole === 'warga'
                        ? 'bg-emerald-50 border-emerald-500'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-xl">🧕🌸</span>
                    <span className="text-xs font-semibold text-emerald-900">Warga / Lansia</span>
                    <span className="text-[10px] text-slate-500">Ibu-Ibu & Warga</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setRegRole('kader');
                      setRegAvatar('👩‍⚕️📋');
                    }}
                    className={`p-2 rounded-xl border text-center transition-colors flex flex-col items-center gap-0.5 cursor-pointer ${
                      regRole === 'kader'
                        ? 'bg-teal-50 border-teal-500'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-xl">👩‍⚕️📋</span>
                    <span className="text-xs font-semibold text-teal-900">Kader Jumantik</span>
                    <span className="text-[10px] text-slate-500">Kader RT / RW</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setRegRole('puskesmas');
                      setRegAvatar('👨‍⚕️🏥');
                    }}
                    className={`p-2 rounded-xl border text-center transition-colors flex flex-col items-center gap-0.5 cursor-pointer ${
                      regRole === 'puskesmas'
                        ? 'bg-cyan-50 border-cyan-500'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-xl">👨‍⚕️🏥</span>
                    <span className="text-xs font-semibold text-cyan-900">Puskesmas</span>
                    <span className="text-[10px] text-slate-500">Tenaga Medis</span>
                  </button>
                </div>
              </div>

              {/* 2. Pilih Karakter Avatar */}
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  2. Pilih Karakter Avatar:
                </label>
                <div className="flex items-center gap-1.5 overflow-x-auto p-1">
                  {AVATAR_OPTIONS.map((opt) => (
                    <button
                      key={opt.emoji}
                      type="button"
                      onClick={() => setRegAvatar(opt.emoji)}
                      className={`p-1.5 rounded-lg border text-lg shrink-0 transition-colors cursor-pointer ${
                        regAvatar === opt.emoji
                          ? 'bg-emerald-100 border-emerald-500'
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
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nama Lengkap / Panggilan:
                  </label>
                  <input
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="Contoh: Ibu Farida atau Budi"
                    className="w-full text-xs sm:text-sm font-medium bg-slate-50 border border-slate-200 rounded-lg p-2 focus:bg-white focus:ring-1 focus:ring-slate-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nomor WhatsApp / HP:
                  </label>
                  <input
                    type="tel"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="Contoh: 081234567890"
                    className="w-full text-xs sm:text-sm font-medium bg-slate-50 border border-slate-200 rounded-lg p-2 focus:bg-white focus:ring-1 focus:ring-slate-900"
                    required
                  />
                </div>
              </div>

              {/* 4. Alamat & RT/RW */}
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-3">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Alamat Rumah (Jalan / No):
                  </label>
                  <input
                    type="text"
                    value={regAddress}
                    onChange={(e) => setRegAddress(e.target.value)}
                    placeholder="Contoh: Jl. Melati No. 12"
                    className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg p-2 focus:bg-white focus:ring-1 focus:ring-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-0.5">RT:</label>
                  <input
                    type="text"
                    value={regRt}
                    onChange={(e) => setRegRt(e.target.value)}
                    className="w-full text-xs font-medium text-center bg-slate-50 border border-slate-200 rounded-lg p-1.5"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-0.5">RW:</label>
                  <input
                    type="text"
                    value={regRw}
                    onChange={(e) => setRegRw(e.target.value)}
                    className="w-full text-xs font-medium text-center bg-slate-50 border border-slate-200 rounded-lg p-1.5"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Kelurahan:</label>
                  <input
                    type="text"
                    value={regKelurahan}
                    onChange={(e) => setRegKelurahan(e.target.value)}
                    className="w-full text-xs font-medium text-center bg-slate-50 border border-slate-200 rounded-lg p-1.5 truncate"
                  />
                </div>
              </div>

              {/* 5. PIN Sederhana */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  PIN Sederhana 4 Digit (Opsional):
                </label>
                <input
                  type="password"
                  maxLength={4}
                  value={regPin}
                  onChange={(e) => setRegPin(e.target.value)}
                  placeholder="1234"
                  className="w-full text-xs sm:text-sm font-medium bg-slate-50 border border-slate-200 rounded-lg p-2 text-center tracking-widest focus:bg-white focus:ring-1 focus:ring-slate-900"
                />
              </div>

              <button
                type="submit"
                disabled={isRegistering}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs sm:text-sm py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isRegistering ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Menyimpan ke Cloud Firestore...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Daftar & Simpan ke Cloud</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="p-2.5 bg-slate-50 border-t border-slate-200 text-center text-xs text-slate-500 flex items-center justify-center gap-1.5">
          <Database className="w-3.5 h-3.5 text-emerald-600" />
          <span>Tersimpan di Cloud Firestore (Real-time Multi-Device)</span>
        </div>
      </div>
    </div>
  );
};

