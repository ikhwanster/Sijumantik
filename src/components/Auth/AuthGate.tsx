import React, { useState } from 'react';
import { 
  User, 
  Lock, 
  Phone, 
  Mail, 
  MapPin, 
  Sparkles, 
  LogIn, 
  UserPlus, 
  ShieldCheck, 
  Zap, 
  Loader2, 
  Database, 
  CheckCircle2, 
  Trash2,
  HelpCircle,
  AlertTriangle,
  HeartHandshake
} from 'lucide-react';
import { 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword 
} from 'firebase/auth';
import { auth, googleProvider } from '../../lib/firebase';
import { UserProfile, UserRole } from '../../types/auth';
import { AVATAR_OPTIONS } from '../../data/defaultUsers';
import { playAlertTone } from '../../utils/audioAlert';
import { speakIndonesian } from '../../utils/speechHelper';
import { 
  saveUserToDb, 
  findUserByPhoneOrName, 
  findUserByEmail,
  clearAllUsersAndInspectionsInDb 
} from '../../services/dbService';
import confetti from 'canvas-confetti';

interface AuthGateProps {
  onLogin: (user: UserProfile) => void;
  onRegister: (newUser: UserProfile) => void;
  allUsers: UserProfile[];
  onResetAllData?: () => void;
}

type AuthMethod = 'google' | 'email' | 'phone';
type AuthMode = 'login' | 'register';

export const AuthGate: React.FC<AuthGateProps> = ({
  onLogin,
  onRegister,
  allUsers,
  onResetAllData
}) => {
  const [method, setMethod] = useState<AuthMethod>('google');
  const [mode, setMode] = useState<AuthMode>('login');

  // Phone Form State
  const [phoneLogin, setPhoneLogin] = useState('');
  const [phonePin, setPhonePin] = useState('');

  // Email Form State
  const [emailLogin, setEmailLogin] = useState('');
  const [passwordLogin, setPasswordLogin] = useState('');

  // Register Form State (Shared for Email & Phone & Google setup)
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('warga');
  const [regAddress, setRegAddress] = useState('');
  const [regRt, setRegRt] = useState('02');
  const [regRw, setRegRw] = useState('02');
  const [regKelurahan, setRegKelurahan] = useState('Kelurahan Sukamaju');
  const [regAvatar, setRegAvatar] = useState('🧕🌸');
  const [regPin, setRegPin] = useState('1234');

  // Google In-Progress Registration State (if Google user needs role selection)
  const [googlePendingUser, setGooglePendingUser] = useState<{
    uid: string;
    email: string;
    displayName: string;
    photoURL?: string;
  } | null>(null);

  // Status & loading
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showWipeConfirm, setShowWipeConfirm] = useState(false);

  const triggerSuccess = (user: UserProfile, msg: string) => {
    playAlertTone('success');
    speakIndonesian(msg);
    confetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  // 1. GOOGLE SIGN IN
  const handleGoogleSignIn = async () => {
    setErrorMessage('');
    setSuccessMessage('');
    setLoading(true);

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      const email = user.email || '';
      const name = user.displayName || 'Pengguna Google';

      // Check if this user already exists in synced database or memory
      let existing = allUsers.find(
        (u) => (u.email && u.email.toLowerCase() === email.toLowerCase()) || u.id === user.uid
      );

      if (!existing && email) {
        existing = await findUserByEmail(email) || undefined;
      }

      if (existing) {
        // User already has profile -> log them in
        onLogin(existing);
        triggerSuccess(existing, `Selamat datang kembali, ${existing.name}!`);
      } else {
        // User is new -> Prompt for Role and RT/RW completion
        setGooglePendingUser({
          uid: user.uid,
          email: email,
          displayName: name,
          photoURL: user.photoURL || undefined
        });
        setRegName(name);
        setRegEmail(email);
        setSuccessMessage('Akun Google terhubung! Silakan tentukan Peran & Wilayah RT/RW Anda di bawah.');
      }
    } catch (err: any) {
      console.error('Google Sign In Error:', err);
      if (err.code === 'auth/popup-blocked') {
        setErrorMessage('Jendela pop-up Google terblokir peramban. Silakan izinkan pop-up atau gunakan opsi masuk via Email/HP.');
      } else if (err.code === 'auth/cancelled-popup-request' || err.code === 'auth/popup-closed-by-user') {
        setErrorMessage('Proses login Google dibatalkan.');
      } else {
        setErrorMessage(`Kendala login Google: ${err.message || 'Silakan gunakan login Email / No HP'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Complete Google Profile Registration
  const handleCompleteGoogleReg = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!googlePendingUser) return;
    setErrorMessage('');
    setLoading(true);

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
      } else if (regRole === 'admin') {
        defaultTitle = 'Super Administrator 🛡️';
        initStars = 150;
        initPoints = 1000;
      }

      const newUser: UserProfile = {
        id: googlePendingUser.uid,
        name: regName.trim() || googlePendingUser.displayName,
        role: regRole,
        email: googlePendingUser.email,
        authProvider: 'google',
        phone: regPhone.trim() || '08xxxxxxxxxx',
        address: regAddress.trim() || 'Sukamaju',
        rt: regRt.trim() || '01',
        rw: regRw.trim() || '01',
        kelurahan: regKelurahan.trim() || 'Kelurahan Sukamaju',
        avatar: regAvatar,
        points: initPoints,
        stars: initStars,
        badgeTitle: defaultTitle,
        pin: '1234',
        registeredAt: new Date().toISOString().split('T')[0],
        completedMissions: ['m-1']
      };

      await saveUserToDb(newUser);
      onRegister(newUser);
      triggerSuccess(newUser, `Selamat bergabung ${newUser.name}! Akun Google Anda tersimpan.`);
    } catch (err: any) {
      console.error('Google profile creation error:', err);
      setErrorMessage('Gagal menyimpan profil ke database: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // 2. EMAIL LOGIN & REGISTER
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const email = emailLogin.trim();
    if (!email) {
      setErrorMessage('Mohon masukkan alamat Email Anda.');
      return;
    }
    setLoading(true);

    try {
      // 1. Try Firebase Auth sign in
      let authenticated = false;
      try {
        if (passwordLogin) {
          await signInWithEmailAndPassword(auth, email, passwordLogin);
          authenticated = true;
        }
      } catch (authErr) {
        console.warn('Firebase Auth email sign in fallback:', authErr);
      }

      // 2. Find user profile from Firestore or synced memory
      let found = allUsers.find(
        (u) => u.email && u.email.toLowerCase() === email.toLowerCase()
      );

      if (!found) {
        found = await findUserByEmail(email) || undefined;
      }

      // Also fallback search by name or phone if entered
      if (!found) {
        found = (await findUserByPhoneOrName(email)) || undefined;
      }

      if (found) {
        onLogin(found);
        triggerSuccess(found, `Selamat datang ${found.name}!`);
      } else if (authenticated) {
        // Auth success but no doc found yet: create basic profile
        const newUser: UserProfile = {
          id: `user-${Date.now()}`,
          name: email.split('@')[0],
          role: 'warga',
          email: email,
          authProvider: 'email',
          phone: '081234567890',
          address: 'Jl. Mawar Melati',
          rt: '02',
          rw: '02',
          kelurahan: 'Kelurahan Sukamaju',
          avatar: '🧕🌸',
          points: 50,
          stars: 10,
          badgeTitle: 'Warga Siaga 1R1J',
          pin: '1234',
          registeredAt: new Date().toISOString().split('T')[0],
          completedMissions: ['m-1']
        };
        await saveUserToDb(newUser);
        onRegister(newUser);
        triggerSuccess(newUser, `Selamat datang ${newUser.name}!`);
      } else {
        setErrorMessage('Akun dengan email tersebut belum terdaftar. Silakan klik "Daftar Baru" untuk membuat akun.');
        playAlertTone('warning');
      }
    } catch (err: any) {
      console.error('Email login error:', err);
      setErrorMessage('Kendala saat masuk: ' + (err.message || 'Silakan cek kembali email & sandi'));
    } finally {
      setLoading(false);
    }
  };

  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!regName.trim()) {
      setErrorMessage('Mohon masukkan Nama Lengkap Anda.');
      return;
    }
    if (!regEmail.trim()) {
      setErrorMessage('Mohon masukkan alamat Email.');
      return;
    }
    if (regPassword.length < 6) {
      setErrorMessage('Kata sandi minimal 6 karakter.');
      return;
    }

    setLoading(true);
    try {
      let uid = `user-${Date.now()}`;
      try {
        const userCred = await createUserWithEmailAndPassword(auth, regEmail.trim(), regPassword);
        uid = userCred.user.uid;
      } catch (authErr: any) {
        console.warn('Firebase Auth user creation note:', authErr);
        if (authErr.code === 'auth/email-already-in-use') {
          // If already in use, check if we can update profile
        }
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
      } else if (regRole === 'admin') {
        defaultTitle = 'Super Administrator 🛡️';
        initStars = 150;
        initPoints = 1000;
      }

      const newUser: UserProfile = {
        id: uid,
        name: regName.trim(),
        role: regRole,
        email: regEmail.trim().toLowerCase(),
        authProvider: 'email',
        phone: regPhone.trim() || '08xxxxxxxxxx',
        address: regAddress.trim() || 'Sukamaju',
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

      await saveUserToDb(newUser);
      onRegister(newUser);
      triggerSuccess(newUser, `Selamat bergabung ${newUser.name}! Akun berhasil dibuat.`);
    } catch (err: any) {
      console.error('Email registration error:', err);
      setErrorMessage('Kendala saat mendaftar: ' + (err.message || 'Silakan periksa input form'));
    } finally {
      setLoading(false);
    }
  };

  // 3. PHONE / HP LOGIN & REGISTER
  const handlePhoneLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const query = phoneLogin.trim();
    if (!query) {
      setErrorMessage('Mohon masukkan Nomor HP atau Nama terdaftar.');
      return;
    }

    setLoading(true);
    try {
      let found = allUsers.find(
        (u) =>
          (u.phone === query ||
            u.name.toLowerCase().includes(query.toLowerCase()) ||
            u.id.toLowerCase() === query.toLowerCase()) &&
          (!phonePin || u.pin === phonePin.trim())
      );

      if (!found) {
        const dbUser = await findUserByPhoneOrName(query);
        if (dbUser && (!phonePin || dbUser.pin === phonePin.trim())) {
          found = dbUser;
        }
      }

      if (found) {
        onLogin(found);
        triggerSuccess(found, `Selamat datang ${found.name}!`);
      } else {
        setErrorMessage('Nomor HP atau Nama tidak ditemukan. Pastikan data benar atau klik "Daftar Baru".');
        playAlertTone('warning');
      }
    } catch (err: any) {
      console.error('Phone login error:', err);
      setErrorMessage('Gagal memverifikasi akun: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!regName.trim()) {
      setErrorMessage('Mohon masukkan Nama Lengkap / Panggilan.');
      return;
    }
    if (!regPhone.trim()) {
      setErrorMessage('Mohon masukkan Nomor HP / WhatsApp.');
      return;
    }

    setLoading(true);
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
      } else if (regRole === 'admin') {
        defaultTitle = 'Super Administrator 🛡️';
        initStars = 150;
        initPoints = 1000;
      }

      const generatedId = `user-${Date.now()}`;
      const newUser: UserProfile = {
        id: generatedId,
        name: regName.trim(),
        role: regRole,
        phone: regPhone.trim(),
        authProvider: 'phone',
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

      await saveUserToDb(newUser);
      onRegister(newUser);
      triggerSuccess(newUser, `Selamat bergabung ${newUser.name}! Akun HP berhasil didaftarkan.`);
    } catch (err: any) {
      console.error('Phone registration error:', err);
      setErrorMessage('Kendala saat mendaftar: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Wipe Data Handler
  const handleWipeData = async () => {
    setLoading(true);
    try {
      localStorage.clear();
      await clearAllUsersAndInspectionsInDb();
      if (onResetAllData) {
        onResetAllData();
      }
      setSuccessMessage('Semua data berhasil dibersihkan. Memulai data dari 0.');
      setShowWipeConfirm(false);
      playAlertTone('success');
    } catch (err: any) {
      setErrorMessage('Gagal membersihkan data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-3 sm:p-6 relative overflow-x-hidden">
      {/* Subtle Background Glows */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden relative z-10 flex flex-col my-auto">
        {/* Top Header & Branding */}
        <div className="p-6 sm:p-8 bg-gradient-to-b from-slate-850 to-slate-900 border-b border-slate-800 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-600/20 border border-emerald-500/30 text-3xl mb-3 shadow-inner">
            🦟🏡
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center justify-center gap-2">
            <span>SiJumantik Pantau</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              1R1J
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-md mx-auto">
            Satu Rumah Satu Jumantik: Pemantauan Jentik Mandiri & Kewaspadaan Dini Demam Berdarah (DBD)
          </p>

          <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-emerald-400 font-medium">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/60">
              <Database className="w-3 h-3 animate-pulse text-emerald-400" />
              <span>Cloud Firestore Terhubung • Multi-Perangkat (HP & Laptop)</span>
            </span>
          </div>
        </div>

        {/* Pending Google Registration Form */}
        {googlePendingUser ? (
          <div className="p-6 sm:p-8 space-y-5 bg-slate-900">
            <div className="p-4 bg-emerald-950/40 border border-emerald-800/60 rounded-2xl flex items-center gap-3">
              <span className="text-2xl">✨</span>
              <div>
                <h4 className="text-sm font-bold text-emerald-300">Langkah Terakhir: Akun Google Terhubung</h4>
                <p className="text-xs text-slate-300">
                  Halo <strong>{googlePendingUser.displayName}</strong> ({googlePendingUser.email}), silakan pilih peran dan domisili RT/RW Anda.
                </p>
              </div>
            </div>

            <form onSubmit={handleCompleteGoogleReg} className="space-y-4">
              {/* Role Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  1. Pilih Peran Anda:
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => { setRegRole('anak'); setRegAvatar('👦🎒'); }}
                    className={`p-3 rounded-xl border text-left transition-colors cursor-pointer ${
                      regRole === 'anak'
                        ? 'bg-amber-500/20 border-amber-400 text-amber-200'
                        : 'bg-slate-800/60 border-slate-700 hover:bg-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="text-xl mb-0.5">👦🎒</div>
                    <div className="text-xs font-bold">Jumantik Cilik</div>
                    <div className="text-[10px] opacity-75">Siswa Sekolah</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setRegRole('warga'); setRegAvatar('🧕🌸'); }}
                    className={`p-3 rounded-xl border text-left transition-colors cursor-pointer ${
                      regRole === 'warga'
                        ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200'
                        : 'bg-slate-800/60 border-slate-700 hover:bg-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="text-xl mb-0.5">🧕🌸</div>
                    <div className="text-xs font-bold">Warga / Lansia</div>
                    <div className="text-[10px] opacity-75">Ibu Rumah Tangga / Warga</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setRegRole('kader'); setRegAvatar('👩‍⚕️📋'); }}
                    className={`p-3 rounded-xl border text-left transition-colors cursor-pointer ${
                      regRole === 'kader'
                        ? 'bg-teal-500/20 border-teal-400 text-teal-200'
                        : 'bg-slate-800/60 border-slate-700 hover:bg-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="text-xl mb-0.5">👩‍⚕️📋</div>
                    <div className="text-xs font-bold">Kader Jumantik</div>
                    <div className="text-[10px] opacity-75">Kader RT / RW / Posyandu</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setRegRole('puskesmas'); setRegAvatar('👨‍⚕️🏥'); }}
                    className={`p-3 rounded-xl border text-left transition-colors cursor-pointer ${
                      regRole === 'puskesmas'
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200'
                        : 'bg-slate-800/60 border-slate-700 hover:bg-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="text-xl mb-0.5">👨‍⚕️🏥</div>
                    <div className="text-xs font-bold">Puskesmas / Nakes</div>
                    <div className="text-[10px] opacity-75">Satgas DBD</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setRegRole('admin'); setRegAvatar('🛡️💻'); }}
                    className={`p-3 rounded-xl border text-left transition-colors cursor-pointer col-span-2 ${
                      regRole === 'admin'
                        ? 'bg-indigo-500/25 border-indigo-400 text-indigo-200'
                        : 'bg-slate-800/60 border-slate-700 hover:bg-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="text-xl">🛡️💻</div>
                      <div>
                        <div className="text-xs font-bold">Super Admin (Pengelola Data)</div>
                        <div className="text-[10px] opacity-75">Akses Penuh Edit, Hapus & Tambah Data Warga/Laporan</div>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Avatar Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  2. Pilih Avatar Karakter:
                </label>
                <div className="flex items-center gap-2 overflow-x-auto p-1">
                  {AVATAR_OPTIONS.map((opt) => (
                    <button
                      key={opt.emoji}
                      type="button"
                      onClick={() => setRegAvatar(opt.emoji)}
                      className={`p-2 rounded-xl border text-xl shrink-0 transition-colors cursor-pointer ${
                        regAvatar === opt.emoji
                          ? 'bg-emerald-600/30 border-emerald-400'
                          : 'bg-slate-800 border-slate-700 hover:bg-slate-750'
                      }`}
                    >
                      {opt.emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* RT / RW & Address */}
              <div className="grid grid-cols-3 gap-2.5">
                <div className="col-span-3">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Alamat Rumah:
                  </label>
                  <input
                    type="text"
                    value={regAddress}
                    onChange={(e) => setRegAddress(e.target.value)}
                    placeholder="Contoh: Jl. Melati Indah No. 12"
                    className="w-full bg-slate-850 border border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-0.5">RT:</label>
                  <input
                    type="text"
                    value={regRt}
                    onChange={(e) => setRegRt(e.target.value)}
                    className="w-full bg-slate-850 border border-slate-700 rounded-xl p-2 text-xs text-center text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-0.5">RW:</label>
                  <input
                    type="text"
                    value={regRw}
                    onChange={(e) => setRegRw(e.target.value)}
                    className="w-full bg-slate-850 border border-slate-700 rounded-xl p-2 text-xs text-center text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-0.5">Kelurahan:</label>
                  <input
                    type="text"
                    value={regKelurahan}
                    onChange={(e) => setRegKelurahan(e.target.value)}
                    className="w-full bg-slate-850 border border-slate-700 rounded-xl p-2 text-xs text-center text-white truncate"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setGooglePendingUser(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 text-xs font-medium hover:bg-slate-800 cursor-pointer"
                >
                  Kembali
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm py-2.5 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Menyimpan ke Cloud...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Selesaikan & Masuk</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="p-6 sm:p-8 space-y-6">
            {/* Error / Success Notifications */}
            {errorMessage && (
              <div className="p-3 bg-rose-950/60 border border-rose-800 text-rose-300 text-xs rounded-xl flex items-start gap-2 animate-in fade-in">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="p-3 bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs rounded-xl flex items-start gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Quick 1-Tap Login if Accounts Exist */}
            {allUsers.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span>AKUN TERDAFTAR DI DATABASE ({allUsers.length}):</span>
                  </span>
                  <span className="text-[11px] text-emerald-400 font-medium">1-Klik Masuk</span>
                </div>
                <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto pr-1">
                  {allUsers.map((u) => (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => {
                        onLogin(u);
                        triggerSuccess(u, `Selamat datang kembali ${u.name}!`);
                      }}
                      className="p-2.5 rounded-xl border border-slate-800 bg-slate-850/80 hover:bg-slate-800 hover:border-emerald-500/50 transition-all text-left flex items-center gap-2.5 cursor-pointer group"
                    >
                      <span className="text-2xl shrink-0 group-hover:scale-110 transition-transform">
                        {u.avatar || '👤'}
                      </span>
                      <div className="min-w-0 overflow-hidden">
                        <p className="text-xs font-semibold text-white truncate">{u.name}</p>
                        <p className="text-[10px] text-slate-400 capitalize truncate">
                          {u.email ? `✉️ ${u.email}` : u.phone ? `📱 ${u.phone}` : u.role}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 3 AUTH CHANNEL TABS */}
            <div className="space-y-3">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider text-center">
                PILIH METODE MASUK / DAFTAR
              </div>

              {/* Method Switcher Tabs */}
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-950 rounded-2xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => { setMethod('google'); setErrorMessage(''); }}
                  className={`py-2 px-1 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    method === 'google'
                      ? 'bg-slate-800 text-white shadow-sm border border-slate-700'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Google</span>
                </button>

                <button
                  type="button"
                  onClick={() => { setMethod('email'); setErrorMessage(''); }}
                  className={`py-2 px-1 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    method === 'email'
                      ? 'bg-slate-800 text-white shadow-sm border border-slate-700'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Mail className="w-3.5 h-3.5 text-blue-400" />
                  <span>Email</span>
                </button>

                <button
                  type="button"
                  onClick={() => { setMethod('phone'); setErrorMessage(''); }}
                  className={`py-2 px-1 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    method === 'phone'
                      ? 'bg-slate-800 text-white shadow-sm border border-slate-700'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Nomor HP</span>
                </button>
              </div>

              {/* METHOD 1: GOOGLE SIGN-IN */}
              {method === 'google' && (
                <div className="p-5 bg-slate-850/70 border border-slate-800 rounded-2xl text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mx-auto text-2xl">
                    🌐
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Masuk Instan dengan Akun Google</h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Gunakan akun Google Anda untuk akses cepat tanpa perlu mengingat PIN.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                    className="w-full bg-white hover:bg-slate-100 text-slate-900 font-semibold text-xs sm:text-sm py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2.5 cursor-pointer shadow-md disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-slate-800" />
                        <span>Menghubungkan Google...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                          <path
                            fill="#4285F4"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          />
                          <path
                            fill="#34A853"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                          />
                          <path
                            fill="#EA4335"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                          />
                        </svg>
                        <span>Lanjutkan dengan Akun Google</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* METHOD 2: EMAIL */}
              {method === 'email' && (
                <div className="p-5 bg-slate-850/70 border border-slate-800 rounded-2xl space-y-4">
                  {/* Mode Selector: Masuk vs Daftar */}
                  <div className="flex border-b border-slate-800 pb-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setMode('login')}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer ${
                        mode === 'login'
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <LogIn className="w-3.5 h-3.5" />
                      <span>Masuk (Login)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setMode('register')}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer ${
                        mode === 'register'
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Daftar Baru</span>
                    </button>
                  </div>

                  {mode === 'login' ? (
                    <form onSubmit={handleEmailLogin} className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          Alamat Email:
                        </label>
                        <div className="relative">
                          <input
                            type="email"
                            value={emailLogin}
                            onChange={(e) => setEmailLogin(e.target.value)}
                            placeholder="nama@email.com"
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 pl-9 text-xs sm:text-sm text-white focus:outline-none focus:border-blue-500"
                            required
                          />
                          <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          Kata Sandi:
                        </label>
                        <div className="relative">
                          <input
                            type="password"
                            value={passwordLogin}
                            onChange={(e) => setPasswordLogin(e.target.value)}
                            placeholder="Minimal 6 karakter"
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 pl-9 text-xs sm:text-sm text-white focus:outline-none focus:border-blue-500"
                            required
                          />
                          <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs sm:text-sm py-2.5 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Memverifikasi Email...</span>
                          </>
                        ) : (
                          <>
                            <LogIn className="w-4 h-4" />
                            <span>Masuk dengan Email</span>
                          </>
                        )}
                      </button>
                    </form>
                  ) : (
                    /* Email Register Form */
                    <form onSubmit={handleEmailRegister} className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          Nama Lengkap / Panggilan:
                        </label>
                        <input
                          type="text"
                          value={regName}
                          onChange={(e) => setRegName(e.target.value)}
                          placeholder="Contoh: Ibu Rina atau dr. Andi"
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-blue-500"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs font-medium text-slate-300 mb-1">
                            Email:
                          </label>
                          <input
                            type="email"
                            value={regEmail}
                            onChange={(e) => setRegEmail(e.target.value)}
                            placeholder="nama@email.com"
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-300 mb-1">
                            Sandi (min. 6):
                          </label>
                          <input
                            type="password"
                            value={regPassword}
                            onChange={(e) => setRegPassword(e.target.value)}
                            placeholder="Sandi kuat"
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                            required
                          />
                        </div>
                      </div>

                      {/* Peran & Avatar */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Pilih Jenis Peran:
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => { setRegRole('anak'); setRegAvatar('👦🎒'); }}
                            className={`p-2 rounded-xl border text-center transition-colors cursor-pointer ${
                              regRole === 'anak' ? 'bg-amber-500/20 border-amber-400' : 'bg-slate-900 border-slate-800'
                            }`}
                          >
                            <span className="text-base">👦🎒</span>
                            <span className="text-xs font-semibold block text-amber-200">Jumantik Cilik</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => { setRegRole('warga'); setRegAvatar('🧕🌸'); }}
                            className={`p-2 rounded-xl border text-center transition-colors cursor-pointer ${
                              regRole === 'warga' ? 'bg-emerald-500/20 border-emerald-400' : 'bg-slate-900 border-slate-800'
                            }`}
                          >
                            <span className="text-base">🧕🌸</span>
                            <span className="text-xs font-semibold block text-emerald-200">Warga / Lansia</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => { setRegRole('kader'); setRegAvatar('👩‍⚕️📋'); }}
                            className={`p-2 rounded-xl border text-center transition-colors cursor-pointer ${
                              regRole === 'kader' ? 'bg-teal-500/20 border-teal-400' : 'bg-slate-900 border-slate-800'
                            }`}
                          >
                            <span className="text-base">👩‍⚕️📋</span>
                            <span className="text-xs font-semibold block text-teal-200">Kader Jumantik</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => { setRegRole('puskesmas'); setRegAvatar('👨‍⚕️🏥'); }}
                            className={`p-2 rounded-xl border text-center transition-colors cursor-pointer ${
                              regRole === 'puskesmas' ? 'bg-cyan-500/20 border-cyan-400' : 'bg-slate-900 border-slate-800'
                            }`}
                          >
                            <span className="text-base">👨‍⚕️🏥</span>
                            <span className="text-xs font-semibold block text-cyan-200">Puskesmas</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => { setRegRole('admin'); setRegAvatar('🛡️💻'); }}
                            className={`p-2 rounded-xl border text-center transition-colors cursor-pointer col-span-2 ${
                              regRole === 'admin' ? 'bg-indigo-500/25 border-indigo-400 text-indigo-200' : 'bg-slate-900 border-slate-800 text-slate-300'
                            }`}
                          >
                            <span className="text-base">🛡️💻</span>
                            <span className="text-xs font-semibold block">Super Admin (Kelola Semua Data)</span>
                          </button>
                        </div>
                      </div>

                      {/* RT / RW */}
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[11px] text-slate-400">RT:</label>
                          <input
                            type="text"
                            value={regRt}
                            onChange={(e) => setRegRt(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-xs text-center text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] text-slate-400">RW:</label>
                          <input
                            type="text"
                            value={regRw}
                            onChange={(e) => setRegRw(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-xs text-center text-white"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs sm:text-sm py-2.5 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Mendaftarkan ke Cloud...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4" />
                            <span>Daftar Akun Email</span>
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </div>
              )}

              {/* METHOD 3: PHONE / HP */}
              {method === 'phone' && (
                <div className="p-5 bg-slate-850/70 border border-slate-800 rounded-2xl space-y-4">
                  {/* Mode Selector */}
                  <div className="flex border-b border-slate-800 pb-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setMode('login')}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer ${
                        mode === 'login'
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <LogIn className="w-3.5 h-3.5" />
                      <span>Masuk No HP</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setMode('register')}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer ${
                        mode === 'register'
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Daftar No HP</span>
                    </button>
                  </div>

                  {mode === 'login' ? (
                    <form onSubmit={handlePhoneLogin} className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          Nomor HP / WhatsApp atau Nama:
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={phoneLogin}
                            onChange={(e) => setPhoneLogin(e.target.value)}
                            placeholder="Contoh: 081234567890 atau Budi"
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 pl-9 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500"
                            required
                          />
                          <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          PIN 4-Digit (Opsional):
                        </label>
                        <div className="relative">
                          <input
                            type="password"
                            maxLength={6}
                            value={phonePin}
                            onChange={(e) => setPhonePin(e.target.value)}
                            placeholder="1234"
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 pl-9 text-xs sm:text-sm text-white tracking-widest focus:outline-none focus:border-emerald-500"
                          />
                          <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm py-2.5 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Mencari Akun Cloud...</span>
                          </>
                        ) : (
                          <>
                            <LogIn className="w-4 h-4" />
                            <span>Masuk dengan Nomor HP</span>
                          </>
                        )}
                      </button>
                    </form>
                  ) : (
                    /* Phone Register Form */
                    <form onSubmit={handlePhoneRegister} className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          Nama Lengkap / Panggilan:
                        </label>
                        <input
                          type="text"
                          value={regName}
                          onChange={(e) => setRegName(e.target.value)}
                          placeholder="Contoh: Ibu Siti Aminah"
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          Nomor HP / WhatsApp:
                        </label>
                        <input
                          type="tel"
                          value={regPhone}
                          onChange={(e) => setRegPhone(e.target.value)}
                          placeholder="Contoh: 081234567890"
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500"
                          required
                        />
                      </div>

                      {/* Peran & Avatar */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Pilih Jenis Peran:
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => { setRegRole('anak'); setRegAvatar('👦🎒'); }}
                            className={`p-2 rounded-xl border text-center transition-colors cursor-pointer ${
                              regRole === 'anak' ? 'bg-amber-500/20 border-amber-400' : 'bg-slate-900 border-slate-800'
                            }`}
                          >
                            <span className="text-base">👦🎒</span>
                            <span className="text-xs font-semibold block text-amber-200">Jumantik Cilik</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => { setRegRole('warga'); setRegAvatar('🧕🌸'); }}
                            className={`p-2 rounded-xl border text-center transition-colors cursor-pointer ${
                              regRole === 'warga' ? 'bg-emerald-500/20 border-emerald-400' : 'bg-slate-900 border-slate-800'
                            }`}
                          >
                            <span className="text-base">🧕🌸</span>
                            <span className="text-xs font-semibold block text-emerald-200">Warga / Lansia</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => { setRegRole('kader'); setRegAvatar('👩‍⚕️📋'); }}
                            className={`p-2 rounded-xl border text-center transition-colors cursor-pointer ${
                              regRole === 'kader' ? 'bg-teal-500/20 border-teal-400' : 'bg-slate-900 border-slate-800'
                            }`}
                          >
                            <span className="text-base">👩‍⚕️📋</span>
                            <span className="text-xs font-semibold block text-teal-200">Kader Jumantik</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => { setRegRole('puskesmas'); setRegAvatar('👨‍⚕️🏥'); }}
                            className={`p-2 rounded-xl border text-center transition-colors cursor-pointer ${
                              regRole === 'puskesmas' ? 'bg-cyan-500/20 border-cyan-400' : 'bg-slate-900 border-slate-800'
                            }`}
                          >
                            <span className="text-base">👨‍⚕️🏥</span>
                            <span className="text-xs font-semibold block text-cyan-200">Puskesmas</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => { setRegRole('admin'); setRegAvatar('🛡️💻'); }}
                            className={`p-2 rounded-xl border text-center transition-colors cursor-pointer col-span-2 ${
                              regRole === 'admin' ? 'bg-indigo-500/25 border-indigo-400 text-indigo-200' : 'bg-slate-900 border-slate-800 text-slate-300'
                            }`}
                          >
                            <span className="text-base">🛡️💻</span>
                            <span className="text-xs font-semibold block">Super Admin (Kelola Semua Data)</span>
                          </button>
                        </div>
                      </div>

                      {/* RT / RW */}
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[11px] text-slate-400">RT:</label>
                          <input
                            type="text"
                            value={regRt}
                            onChange={(e) => setRegRt(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-xs text-center text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] text-slate-400">RW:</label>
                          <input
                            type="text"
                            value={regRw}
                            onChange={(e) => setRegRw(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-xs text-center text-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          PIN Sederhana (4 Angka):
                        </label>
                        <input
                          type="password"
                          maxLength={4}
                          value={regPin}
                          onChange={(e) => setRegPin(e.target.value)}
                          placeholder="1234"
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-xs text-center tracking-widest text-white"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm py-2.5 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Mendaftarkan Akun HP...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4" />
                            <span>Daftar Akun No HP</span>
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </div>
              )}
            </div>

            {/* Bottom Tools & Wipe / Reset Cloud */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-1">
                <Database className="w-3.5 h-3.5 text-emerald-500" />
                <span>Data tersimpan aman di Cloud Firestore</span>
              </div>

              {!showWipeConfirm ? (
                <button
                  type="button"
                  onClick={() => setShowWipeConfirm(true)}
                  className="text-slate-500 hover:text-rose-400 text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Reset / Bersihkan Data</span>
                </button>
              ) : (
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] text-rose-400">Yakin mulai data dari 0?</span>
                  <button
                    type="button"
                    onClick={handleWipeData}
                    className="px-2 py-0.5 bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-bold rounded cursor-pointer"
                  >
                    Ya, Bersihkan
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowWipeConfirm(false)}
                    className="px-2 py-0.5 bg-slate-800 text-slate-300 text-[10px] rounded cursor-pointer"
                  >
                    Batal
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
