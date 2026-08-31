import React, { useState } from 'react';
import { 
  X, 
  User, 
  Lock, 
  Phone, 
  Mail,
  MapPin, 
  Sparkles, 
  LogIn, 
  UserPlus, 
  Zap,
  Loader2,
  Database,
  CheckCircle2,
  AlertTriangle
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
  findUserByEmail 
} from '../../services/dbService';
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
  const [method, setMethod] = useState<'google' | 'email' | 'phone'>('google');
  const [tab, setTab] = useState<'login' | 'register'>('login');

  // Login form state
  const [loginPhoneOrName, setLoginPhoneOrName] = useState('');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginPin, setLoginPin] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('warga');
  const [regPhone, setRegPhone] = useState('');
  const [regAddress, setRegAddress] = useState('');
  const [regRt, setRegRt] = useState('02');
  const [regRw, setRegRw] = useState('02');
  const [regKelurahan, setRegKelurahan] = useState('Kelurahan Sukamaju');
  const [regAvatar, setRegAvatar] = useState('🧕🌸');
  const [regPin, setRegPin] = useState('1234');
  const [regError, setRegError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  if (!isOpen) return null;

  const handleQuickLogin = (user: UserProfile) => {
    onLogin(user);
    playAlertTone('success');
    speakIndonesian(`Selamat datang kembali ${user.name}!`);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 }
    });
    onClose();
  };

  const handleGoogleSignIn = async () => {
    setLoginError('');
    setIsLoggingIn(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const email = user.email || '';
      const name = user.displayName || 'Pengguna Google';

      let existing = allUsers.find(
        (u) => (u.email && u.email.toLowerCase() === email.toLowerCase()) || u.id === user.uid
      );
      if (!existing && email) {
        existing = (await findUserByEmail(email)) || undefined;
      }

      if (existing) {
        handleQuickLogin(existing);
      } else {
        const newUser: UserProfile = {
          id: user.uid,
          name: name,
          role: 'warga',
          email: email,
          authProvider: 'google',
          phone: '08xxxxxxxxxx',
          address: 'Kelurahan Sukamaju',
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
        handleQuickLogin(newUser);
      }
    } catch (err: any) {
      console.error('Google Sign In in modal error:', err);
      setLoginError('Kendala login Google: ' + (err.message || 'Silakan coba lagi.'));
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);

    try {
      if (tab === 'login') {
        const email = loginEmail.trim();
        if (!email) {
          setLoginError('Mohon isi Email.');
          return;
        }
        try {
          if (loginPassword) {
            await signInWithEmailAndPassword(auth, email, loginPassword);
          }
        } catch (authE) {
          console.warn(authE);
        }

        let found = allUsers.find((u) => u.email && u.email.toLowerCase() === email.toLowerCase());
        if (!found) {
          found = (await findUserByEmail(email)) || undefined;
        }
        if (found) {
          handleQuickLogin(found);
        } else {
          setLoginError('Akun email tidak ditemukan di database.');
        }
      } else {
        // Register Email
        if (!regName.trim() || !regEmail.trim()) {
          setRegError('Mohon lengkapi Nama dan Email.');
          return;
        }
        let uid = `user-${Date.now()}`;
        try {
          const cred = await createUserWithEmailAndPassword(auth, regEmail.trim(), regPassword || '123456');
          uid = cred.user.uid;
        } catch (e) {
          console.warn(e);
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
          points: 50,
          stars: 10,
          badgeTitle: 'Warga Siaga 1R1J',
          pin: regPin.trim() || '1234',
          registeredAt: new Date().toISOString().split('T')[0],
          completedMissions: ['m-1']
        };
        await saveUserToDb(newUser);
        onRegister(newUser);
        handleQuickLogin(newUser);
      }
    } catch (err: any) {
      setLoginError(err.message || 'Gagal login email');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handlePhoneAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);

    try {
      if (tab === 'login') {
        const searchKey = loginPhoneOrName.trim();
        if (!searchKey) {
          setLoginError('Mohon masukkan Nama atau Nomor HP.');
          return;
        }
        let found = allUsers.find(
          (u) =>
            (u.phone === searchKey ||
              u.name.toLowerCase().includes(searchKey.toLowerCase()) ||
              u.id.toLowerCase() === searchKey.toLowerCase()) &&
            (!loginPin || u.pin === loginPin.trim())
        );
        if (!found) {
          const dbUser = await findUserByPhoneOrName(searchKey);
          if (dbUser && (!loginPin || dbUser.pin === loginPin.trim())) {
            found = dbUser;
          }
        }
        if (found) {
          handleQuickLogin(found);
        } else {
          setLoginError('Akun HP tidak ditemukan di database.');
        }
      } else {
        if (!regName.trim() || !regPhone.trim()) {
          setRegError('Mohon isi Nama Lengkap dan Nomor HP.');
          return;
        }
        const newUser: UserProfile = {
          id: `user-${Date.now()}`,
          name: regName.trim(),
          role: regRole,
          phone: regPhone.trim(),
          authProvider: 'phone',
          address: regAddress.trim() || 'Jl. Mawar Melati No. 1',
          rt: regRt.trim() || '01',
          rw: regRw.trim() || '01',
          kelurahan: regKelurahan.trim() || 'Kelurahan Sukamaju',
          avatar: regAvatar,
          points: 50,
          stars: 10,
          badgeTitle: 'Warga Siaga 1R1J',
          pin: regPin.trim() || '1234',
          registeredAt: new Date().toISOString().split('T')[0],
          completedMissions: ['m-1']
        };
        await saveUserToDb(newUser);
        onRegister(newUser);
        handleQuickLogin(newUser);
      }
    } catch (err: any) {
      setLoginError(err.message || 'Gagal login HP');
    } finally {
      setIsLoggingIn(false);
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
                <h3 className="font-semibold text-base leading-tight">
                  {tab === 'login' ? 'Ganti / Masuk Akun' : 'Daftar Akun Baru'}
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

        {/* Auth Method Tabs */}
        <div className="grid grid-cols-3 gap-1 p-2 bg-slate-100 border-b border-slate-200">
          <button
            type="button"
            onClick={() => setMethod('google')}
            className={`py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer ${
              method === 'google' ? 'bg-white shadow text-slate-900' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <span className="text-sm">🌐</span>
            <span>Google</span>
          </button>
          <button
            type="button"
            onClick={() => setMethod('email')}
            className={`py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer ${
              method === 'email' ? 'bg-white shadow text-blue-700' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Mail className="w-3.5 h-3.5 text-blue-600" />
            <span>Email</span>
          </button>
          <button
            type="button"
            onClick={() => setMethod('phone')}
            className={`py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer ${
              method === 'phone' ? 'bg-white shadow text-emerald-700' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Phone className="w-3.5 h-3.5 text-emerald-600" />
            <span>No HP</span>
          </button>
        </div>

        {/* Tab Selector: Masuk vs Daftar */}
        {method !== 'google' && (
          <div className="flex border-b border-slate-200 bg-slate-50 p-1.5 gap-1.5">
            <button
              type="button"
              onClick={() => { setTab('login'); setLoginError(''); }}
              className={`flex-1 py-1.5 rounded-lg font-medium text-xs flex items-center justify-center gap-1 transition-colors cursor-pointer ${
                tab === 'login' ? 'bg-slate-900 text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Masuk (Login)</span>
            </button>

            <button
              type="button"
              onClick={() => { setTab('register'); setRegError(''); }}
              className={`flex-1 py-1.5 rounded-lg font-medium text-xs flex items-center justify-center gap-1 transition-colors cursor-pointer ${
                tab === 'register' ? 'bg-slate-900 text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Daftar Baru</span>
            </button>
          </div>
        )}

        {/* Body Content */}
        <div className="p-4 overflow-y-auto space-y-4 text-slate-800 flex-1">
          {loginError && (
            <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg font-medium">
              ⚠️ {loginError}
            </div>
          )}

          {/* Quick 1-Tap if Accounts Exist */}
          {allUsers.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-900 flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span>PILIH AKUN CEPAT:</span>
                </span>
                <span className="text-[11px] text-emerald-700 font-medium">
                  {allUsers.length} Akun
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto pr-0.5">
                {allUsers.map((u) => {
                  const isSelected = currentUser?.id === u.id;
                  return (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => handleQuickLogin(u)}
                      className={`p-2 rounded-xl border text-left transition-colors flex items-center gap-2 cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-50 border-emerald-500'
                          : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <span className="text-xl shrink-0">{u.avatar || '👤'}</span>
                      <div className="overflow-hidden min-w-0">
                        <p className="font-semibold text-xs text-slate-900 truncate">
                          {u.name}
                        </p>
                        <p className="text-[10px] text-slate-500 truncate">
                          {u.email ? u.email : u.phone ? u.phone : u.role}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Google Auth in Modal */}
          {method === 'google' && (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-center space-y-3">
              <p className="text-xs text-slate-600">
                Masuk instan menggunakan Akun Google Anda:
              </p>
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isLoggingIn}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs py-2.5 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow disabled:opacity-50"
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Menghubungkan...</span>
                  </>
                ) : (
                  <>
                    <span className="text-base">🌐</span>
                    <span>Masuk dengan Google</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Email Auth in Modal */}
          {method === 'email' && (
            <form onSubmit={handleEmailAuth} className="space-y-3">
              {tab === 'login' ? (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Alamat Email:
                    </label>
                    <input
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="nama@email.com"
                      className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg p-2 focus:bg-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Kata Sandi (Opsional):
                    </label>
                    <input
                      type="password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Kata Sandi"
                      className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg p-2 focus:bg-white"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Nama Lengkap:
                    </label>
                    <input
                      type="text"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="Nama Lengkap"
                      className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg p-2 focus:bg-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Alamat Email:
                    </label>
                    <input
                      type="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="nama@email.com"
                      className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg p-2 focus:bg-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Peran:
                    </label>
                    <select
                      value={regRole}
                      onChange={(e) => setRegRole(e.target.value as UserRole)}
                      className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg p-2"
                    >
                      <option value="warga">Warga / Lansia 🧕🌸</option>
                      <option value="anak">Jumantik Cilik 👦🎒</option>
                      <option value="kader">Kader Jumantik 👩‍⚕️📋</option>
                      <option value="puskesmas">Puskesmas 👨‍⚕️🏥</option>
                      <option value="admin">Super Admin (Kelola Data) 🛡️</option>
                    </select>
                  </div>
                </>
              )}

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs py-2.5 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isLoggingIn ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <span>{tab === 'login' ? 'Masuk via Email' : 'Daftar Akun Email'}</span>
                )}
              </button>
            </form>
          )}

          {/* Phone Auth in Modal */}
          {method === 'phone' && (
            <form onSubmit={handlePhoneAuth} className="space-y-3">
              {tab === 'login' ? (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Nama atau Nomor HP:
                    </label>
                    <input
                      type="text"
                      value={loginPhoneOrName}
                      onChange={(e) => setLoginPhoneOrName(e.target.value)}
                      placeholder="081234567890 atau Budi"
                      className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg p-2 focus:bg-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      PIN (Opsional):
                    </label>
                    <input
                      type="password"
                      maxLength={6}
                      value={loginPin}
                      onChange={(e) => setLoginPin(e.target.value)}
                      placeholder="1234"
                      className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg p-2 focus:bg-white text-center"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Nama Lengkap:
                    </label>
                    <input
                      type="text"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="Nama Lengkap"
                      className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg p-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Nomor HP / WhatsApp:
                    </label>
                    <input
                      type="tel"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="081234567890"
                      className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg p-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Peran:
                    </label>
                    <select
                      value={regRole}
                      onChange={(e) => setRegRole(e.target.value as UserRole)}
                      className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg p-2"
                    >
                      <option value="warga">Warga / Lansia 🧕🌸</option>
                      <option value="anak">Jumantik Cilik 👦🎒</option>
                      <option value="kader">Kader Jumantik 👩‍⚕️📋</option>
                      <option value="puskesmas">Puskesmas 👨‍⚕️🏥</option>
                      <option value="admin">Super Admin (Kelola Data) 🛡️</option>
                    </select>
                  </div>
                </>
              )}

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs py-2.5 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isLoggingIn ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <span>{tab === 'login' ? 'Masuk via No HP' : 'Daftar Akun No HP'}</span>
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
