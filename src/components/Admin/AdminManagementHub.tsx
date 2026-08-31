import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Users, 
  Home, 
  AlertTriangle, 
  MessageSquare, 
  Plus, 
  Edit3, 
  Trash2, 
  Save, 
  X, 
  Search, 
  Filter, 
  CheckCircle2, 
  Download, 
  UserPlus, 
  Sparkles, 
  Star, 
  Phone, 
  Mail, 
  MapPin, 
  Key, 
  Activity,
  Award,
  Database,
  AlertCircle,
  Stethoscope,
  Building2,
  Calendar,
  Check,
  RefreshCw
} from 'lucide-react';
import { UserProfile, UserRole } from '../../types/auth';
import { 
  HomeInspectionRecord, 
  DengueCaseReport, 
  CommunityReport,
  InspectionPoint 
} from '../../types/jumantik';
import { AVATAR_OPTIONS } from '../../data/defaultUsers';
import { playAlertTone } from '../../utils/audioAlert';

interface AdminManagementHubProps {
  currentUser: UserProfile;
  allUsers: UserProfile[];
  inspections: HomeInspectionRecord[];
  cases: DengueCaseReport[];
  communityReports: CommunityReport[];
  onSaveUser: (user: UserProfile) => Promise<void>;
  onDeleteUser: (userId: string) => Promise<void>;
  onSaveInspection: (inspection: HomeInspectionRecord) => Promise<void>;
  onDeleteInspection: (inspectionId: string) => Promise<void>;
  onSaveCase: (c: DengueCaseReport) => Promise<void>;
  onDeleteCase: (caseId: string) => Promise<void>;
  onSaveCommunityReport: (report: CommunityReport) => Promise<void>;
  onDeleteCommunityReport: (reportId: string) => Promise<void>;
  onResetDatabase: () => Promise<void>;
}

type AdminTab = 'users' | 'inspections' | 'cases' | 'reports' | 'tools';

export const AdminManagementHub: React.FC<AdminManagementHubProps> = ({
  currentUser,
  allUsers,
  inspections,
  cases,
  communityReports,
  onSaveUser,
  onDeleteUser,
  onSaveInspection,
  onDeleteInspection,
  onSaveCase,
  onDeleteCase,
  onSaveCommunityReport,
  onDeleteCommunityReport,
  onResetDatabase
}) => {
  const [activeSubTab, setActiveSubTab] = useState<AdminTab>('users');
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Modal / Form States for Users
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [userForm, setUserForm] = useState<Partial<UserProfile>>({
    name: '',
    role: 'warga',
    phone: '',
    email: '',
    address: '',
    rt: '01',
    rw: '02',
    kelurahan: 'Kelurahan Sukamaju',
    avatar: '🧕🌸',
    points: 100,
    stars: 20,
    badgeTitle: 'Warga Peduli Lingkungan',
    pin: '1234'
  });

  // Modal / Form States for Inspection
  const [inspectionModalOpen, setInspectionModalOpen] = useState(false);
  const [editingInspection, setEditingInspection] = useState<HomeInspectionRecord | null>(null);
  const [inspectionForm, setInspectionForm] = useState<{
    id?: string;
    houseAddress: string;
    rt: string;
    rw: string;
    kelurahan: string;
    inspectorName: string;
    date: string;
    status: 'bebas_jentik' | 'waspada_jentik' | 'positif_jentik';
    totalContainers: number;
    positiveContainers: number;
    abjScore: number;
    notes: string;
    verifiedByKader: boolean;
  }>({
    houseAddress: '',
    rt: '01',
    rw: '02',
    kelurahan: 'Kelurahan Sukamaju',
    inspectorName: currentUser.name,
    date: new Date().toISOString().split('T')[0],
    status: 'bebas_jentik',
    totalContainers: 4,
    positiveContainers: 0,
    abjScore: 100,
    notes: '',
    verifiedByKader: true
  });

  // Modal / Form States for Dengue Cases
  const [caseModalOpen, setCaseModalOpen] = useState(false);
  const [editingCase, setEditingCase] = useState<DengueCaseReport | null>(null);
  const [caseForm, setCaseForm] = useState<{
    id?: string;
    patientInitials: string;
    age: number;
    gender: 'L' | 'P';
    address: string;
    rtRw: string;
    feverDay: number;
    diagnosis: 'Demam Dengue' | 'DBD Derajat I' | 'DBD Derajat II' | 'DBD Derajat III (DSS)' | 'Dugaan Gejala';
    status: 'rawat_jalan' | 'rawat_inap' | 'rujukan_icu' | 'sembuh';
    faskesName: string;
    reportedAt: string;
    plateletCount: number;
    foggingScheduled: boolean;
  }>({
    patientInitials: '',
    age: 20,
    gender: 'L',
    address: '',
    rtRw: 'RT 01 / RW 02',
    feverDay: 3,
    diagnosis: 'DBD Derajat I',
    status: 'rawat_inap',
    faskesName: 'Puskesmas Kecamatan Sukamaju',
    reportedAt: new Date().toISOString().split('T')[0],
    plateletCount: 95000,
    foggingScheduled: true
  });

  // Confirmation Delete States
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    type: 'user' | 'inspection' | 'case' | 'report' | 'reset';
    id: string;
    title: string;
  } | null>(null);

  const [savingLoading, setSavingLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  // --- USER CRUD HANDLERS ---
  const handleOpenAddUser = () => {
    setEditingUser(null);
    setUserForm({
      name: '',
      role: 'warga',
      phone: '',
      email: '',
      address: '',
      rt: '01',
      rw: '02',
      kelurahan: 'Kelurahan Sukamaju',
      avatar: '🧕🌸',
      points: 100,
      stars: 20,
      badgeTitle: 'Warga Bebas Jentik',
      pin: '1234'
    });
    setUserModalOpen(true);
  };

  const handleOpenEditUser = (user: UserProfile) => {
    setEditingUser(user);
    setUserForm({ ...user });
    setUserModalOpen(true);
  };

  const handleSaveUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userForm.name?.trim()) {
      showToast('Nama pengguna tidak boleh kosong!');
      return;
    }

    setSavingLoading(true);
    try {
      const userId = editingUser ? editingUser.id : `user-${Date.now()}`;
      const payload: UserProfile = {
        id: userId,
        name: userForm.name.trim(),
        role: userForm.role || 'warga',
        phone: userForm.phone?.trim() || '',
        email: userForm.email?.trim() || '',
        authProvider: userForm.authProvider || (userForm.email ? 'email' : 'phone'),
        address: userForm.address?.trim() || 'Wilayah Sukamaju',
        rt: userForm.rt?.trim() || '01',
        rw: userForm.rw?.trim() || '02',
        kelurahan: userForm.kelurahan?.trim() || 'Kelurahan Sukamaju',
        avatar: userForm.avatar || '🧕🌸',
        points: Number(userForm.points) || 0,
        stars: Number(userForm.stars) || 0,
        badgeTitle: userForm.badgeTitle || 'Keluarga Bebas Jentik',
        pin: userForm.pin?.trim() || '1234',
        registeredAt: userForm.registeredAt || new Date().toISOString().split('T')[0],
        completedMissions: userForm.completedMissions || []
      };

      await onSaveUser(payload);
      setUserModalOpen(false);
      playAlertTone('success');
      showToast(editingUser ? 'Data pengguna berhasil diperbarui!' : 'Pengguna baru berhasil ditambahkan!');
    } catch (err: any) {
      showToast(`Gagal menyimpan: ${err.message}`);
    } finally {
      setSavingLoading(false);
    }
  };

  // --- INSPECTION CRUD HANDLERS ---
  const handleOpenAddInspection = () => {
    setEditingInspection(null);
    setInspectionForm({
      houseAddress: '',
      rt: '01',
      rw: '02',
      kelurahan: 'Kelurahan Sukamaju',
      inspectorName: currentUser.name,
      date: new Date().toISOString().split('T')[0],
      status: 'bebas_jentik',
      totalContainers: 4,
      positiveContainers: 0,
      abjScore: 100,
      notes: '',
      verifiedByKader: true
    });
    setInspectionModalOpen(true);
  };

  const handleOpenEditInspection = (insp: HomeInspectionRecord) => {
    setEditingInspection(insp);
    setInspectionForm({
      id: insp.id,
      houseAddress: insp.houseAddress,
      rt: insp.rt,
      rw: insp.rw,
      kelurahan: insp.kelurahan,
      inspectorName: insp.inspectorName,
      date: insp.date,
      status: insp.status,
      totalContainers: insp.totalContainers,
      positiveContainers: insp.positiveContainers,
      abjScore: insp.abjScore,
      notes: insp.notes,
      verifiedByKader: Boolean(insp.verifiedByKader)
    });
    setInspectionModalOpen(true);
  };

  const handleSaveInspectionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inspectionForm.houseAddress?.trim()) {
      showToast('Alamat rumah wajib diisi!');
      return;
    }

    setSavingLoading(true);
    try {
      const inspId = editingInspection ? editingInspection.id : `insp-${Date.now()}`;
      const isPositive = inspectionForm.status === 'positif_jentik';
      const posContainers = isPositive ? Math.max(1, inspectionForm.positiveContainers || 1) : 0;
      const totalCont = Math.max(1, inspectionForm.totalContainers || 4);
      const calculatedAbj = isPositive ? Math.round(((totalCont - posContainers) / totalCont) * 100) : 100;

      const dummyPoints: InspectionPoint[] = [
        {
          id: 'p1',
          location: 'bak_mandi',
          name: 'Bak Mandi Utama',
          icon: '🛁',
          hasStandingWater: true,
          hasLarvae: isPositive,
          actionTaken: isPositive ? 'kuras' : 'aman',
          notes: isPositive ? 'Ditemukan jentik halus di dasar' : 'Air jernih dan disikat rutin'
        },
        {
          id: 'p2',
          location: 'dispenser',
          name: 'Tatakan Dispenser',
          icon: '💧',
          hasStandingWater: false,
          hasLarvae: false,
          actionTaken: 'aman'
        }
      ];

      const payload: HomeInspectionRecord = {
        id: inspId,
        date: inspectionForm.date || new Date().toISOString().split('T')[0],
        inspectorName: inspectionForm.inspectorName?.trim() || currentUser.name,
        houseAddress: inspectionForm.houseAddress.trim(),
        rt: inspectionForm.rt?.trim() || '01',
        rw: inspectionForm.rw?.trim() || '02',
        kelurahan: inspectionForm.kelurahan?.trim() || 'Kelurahan Sukamaju',
        coordinates: {
          lat: -6.21 + (Math.random() - 0.5) * 0.01,
          lng: 106.84 + (Math.random() - 0.5) * 0.01
        },
        points: dummyPoints,
        totalContainers: totalCont,
        positiveContainers: posContainers,
        status: inspectionForm.status,
        abjScore: calculatedAbj,
        notes: inspectionForm.notes?.trim() || (isPositive ? 'Perlu pengurasan & bubuk abate' : 'Rumah bersih & bebas jentik'),
        verifiedByKader: inspectionForm.verifiedByKader
      };

      await onSaveInspection(payload);
      setInspectionModalOpen(false);
      playAlertTone('success');
      showToast(editingInspection ? 'Catatan pemeriksaan berhasil diubah!' : 'Pemeriksaan jentik baru tersimpan!');
    } catch (err: any) {
      showToast(`Gagal menyimpan: ${err.message}`);
    } finally {
      setSavingLoading(false);
    }
  };

  // --- CASE CRUD HANDLERS ---
  const handleOpenAddCase = () => {
    setEditingCase(null);
    setCaseForm({
      patientInitials: '',
      age: 20,
      gender: 'L',
      address: '',
      rtRw: 'RT 01 / RW 02',
      feverDay: 3,
      diagnosis: 'DBD Derajat I',
      status: 'rawat_inap',
      faskesName: 'Puskesmas Kecamatan Sukamaju',
      reportedAt: new Date().toISOString().split('T')[0],
      plateletCount: 95000,
      foggingScheduled: true
    });
    setCaseModalOpen(true);
  };

  const handleOpenEditCase = (c: DengueCaseReport) => {
    setEditingCase(c);
    setCaseForm({
      id: c.id,
      patientInitials: c.patientInitials,
      age: c.age,
      gender: c.gender,
      address: c.address,
      rtRw: c.rtRw,
      feverDay: c.feverDay || 3,
      diagnosis: c.diagnosis,
      status: c.status,
      faskesName: c.faskesName,
      reportedAt: c.reportedAt,
      plateletCount: c.plateletCount || 100000,
      foggingScheduled: Boolean(c.foggingScheduled)
    });
    setCaseModalOpen(true);
  };

  const handleSaveCaseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!caseForm.patientInitials?.trim()) {
      showToast('Nama/Inisial Pasien wajib diisi!');
      return;
    }

    setSavingLoading(true);
    try {
      const caseId = editingCase ? editingCase.id : `case-${Date.now()}`;
      const payload: DengueCaseReport = {
        id: caseId,
        patientInitials: caseForm.patientInitials.trim(),
        age: Number(caseForm.age) || 20,
        gender: caseForm.gender || 'L',
        address: caseForm.address?.trim() || 'Jl. Mawar Sukamaju',
        rtRw: caseForm.rtRw?.trim() || 'RT 01 / RW 02',
        feverDay: Number(caseForm.feverDay) || 3,
        symptoms: ['Demam Tinggi Mendadak', 'Nyeri Otot/Sendi', 'Bintik Merah'],
        warningSigns: ['Nyeri Perut Hebat', 'Lemas / Trombosit Turun'],
        diagnosis: caseForm.diagnosis,
        plateletCount: Number(caseForm.plateletCount) || 95000,
        status: caseForm.status,
        faskesName: caseForm.faskesName?.trim() || 'Puskesmas Sukamaju',
        reportedAt: caseForm.reportedAt || new Date().toISOString().split('T')[0],
        coordinates: {
          lat: -6.212 + (Math.random() - 0.5) * 0.01,
          lng: 106.845 + (Math.random() - 0.5) * 0.01
        },
        foggingScheduled: caseForm.foggingScheduled,
        foggingDate: caseForm.foggingScheduled ? new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0] : undefined
      };

      await onSaveCase(payload);
      setCaseModalOpen(false);
      playAlertTone('success');
      showToast(editingCase ? 'Data kasus DBD diperbarui!' : 'Kasus DBD baru berhasil dicatat!');
    } catch (err: any) {
      showToast(`Gagal menyimpan: ${err.message}`);
    } finally {
      setSavingLoading(false);
    }
  };

  // --- DELETE CONFIRMATION EXECUTOR ---
  const handleExecuteDelete = async () => {
    if (!deleteConfirmation) return;
    setSavingLoading(true);

    try {
      if (deleteConfirmation.type === 'user') {
        await onDeleteUser(deleteConfirmation.id);
        showToast('Pengguna berhasil dihapus!');
      } else if (deleteConfirmation.type === 'inspection') {
        await onDeleteInspection(deleteConfirmation.id);
        showToast('Pemeriksaan berhasil dihapus!');
      } else if (deleteConfirmation.type === 'case') {
        await onDeleteCase(deleteConfirmation.id);
        showToast('Kasus DBD berhasil dihapus!');
      } else if (deleteConfirmation.type === 'report') {
        await onDeleteCommunityReport(deleteConfirmation.id);
        showToast('Laporan komunitas dihapus!');
      } else if (deleteConfirmation.type === 'reset') {
        await onResetDatabase();
        showToast('Database berhasil direset ke kondisi awal!');
      }
      playAlertTone('warning');
    } catch (err: any) {
      showToast(`Gagal menghapus: ${err.message}`);
    } finally {
      setSavingLoading(false);
      setDeleteConfirmation(null);
    }
  };

  // Filtered lists
  const filteredUsers = allUsers.filter((u) => {
    const matchesSearch = 
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.phone && u.phone.includes(searchQuery)) ||
      (u.email && u.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      u.rt.includes(searchQuery) ||
      u.rw.includes(searchQuery);
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const filteredInspections = inspections.filter((i) => {
    const matchesSearch = 
      i.houseAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.inspectorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.notes.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = 
      statusFilter === 'all' || 
      i.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredCases = cases.filter((c) => {
    const matchesSearch = 
      c.patientInitials.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.faskesName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.diagnosis.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl border border-emerald-500/40 flex items-center gap-2 text-sm font-medium animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-indigo-800/40 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-1/4 -translate-y-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-xs font-semibold mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
              <span>Pusat Manajemen Administrator (Super Admin)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Kelola Data & Hak Akses Wilayah
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              Kontrol penuh operasi basis data Cloud Firestore: Tambah (Add), Ubah (Edit), Simpan (Save), dan Hapus (Delete) akun pengguna, catatan jentik, kasus DBD, serta laporan warga.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleOpenAddUser}
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm shadow-md transition-colors cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>+ Tambah Pengguna</span>
            </button>
            <button
              onClick={handleOpenAddInspection}
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm shadow-md transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Catat Pemeriksaan</span>
            </button>
          </div>
        </div>

        {/* Quick Database Stat Pill Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-indigo-900/60">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-3">
            <div className="text-[11px] text-slate-400">Total Akun Terdaftar</div>
            <div className="text-xl font-black text-white mt-0.5">{allUsers.length} <span className="text-xs font-normal text-slate-400">user</span></div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-3">
            <div className="text-[11px] text-slate-400">Pemeriksaan Rumah</div>
            <div className="text-xl font-black text-emerald-400 mt-0.5">{inspections.length} <span className="text-xs font-normal text-slate-400">catatan</span></div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-3">
            <div className="text-[11px] text-slate-400">Kasus DBD Terpantau</div>
            <div className="text-xl font-black text-rose-400 mt-0.5">{cases.length} <span className="text-xs font-normal text-slate-400">kasus</span></div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-3">
            <div className="text-[11px] text-slate-400">Laporan Got & Genangan</div>
            <div className="text-xl font-black text-amber-400 mt-0.5">{communityReports.length} <span className="text-xs font-normal text-slate-400">laporan</span></div>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200">
        <button
          onClick={() => { setActiveSubTab('users'); setSearchQuery(''); }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm whitespace-nowrap transition-colors cursor-pointer ${
            activeSubTab === 'users'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Kelola Pengguna ({allUsers.length})</span>
        </button>

        <button
          onClick={() => { setActiveSubTab('inspections'); setSearchQuery(''); }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm whitespace-nowrap transition-colors cursor-pointer ${
            activeSubTab === 'inspections'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Home className="w-4 h-4" />
          <span>Pemeriksaan Jentik ({inspections.length})</span>
        </button>

        <button
          onClick={() => { setActiveSubTab('cases'); setSearchQuery(''); }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm whitespace-nowrap transition-colors cursor-pointer ${
            activeSubTab === 'cases'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Kasus DBD ({cases.length})</span>
        </button>

        <button
          onClick={() => { setActiveSubTab('reports'); setSearchQuery(''); }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm whitespace-nowrap transition-colors cursor-pointer ${
            activeSubTab === 'reports'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Laporan Warga ({communityReports.length})</span>
        </button>

        <button
          onClick={() => { setActiveSubTab('tools'); }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm whitespace-nowrap transition-colors cursor-pointer ${
            activeSubTab === 'tools'
              ? 'bg-slate-800 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Kontrol Basis Data</span>
        </button>
      </div>

      {/* --- TAB 1: KELOLA PENGGUNA (USERS) --- */}
      {activeSubTab === 'users' && (
        <div className="space-y-4">
          {/* Controls / Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama, HP, email, RT/RW..."
                className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:outline-none focus:border-indigo-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
              <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">Filter Peran:</span>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-3 py-2 text-xs font-medium border border-slate-300 rounded-xl bg-slate-50 focus:outline-none cursor-pointer"
              >
                <option value="all">Semua Peran ({allUsers.length})</option>
                <option value="admin">Admin 🛡️</option>
                <option value="kader">Kader Jumantik 👩‍⚕️</option>
                <option value="warga">Warga / Lansia 🧕</option>
                <option value="anak">Jumantik Cilik 👦</option>
                <option value="puskesmas">Puskesmas / Nakes 🏥</option>
              </select>

              <button
                onClick={handleOpenAddUser}
                className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-2 rounded-xl text-xs font-semibold shrink-0 cursor-pointer shadow-xs"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Tambah Akun</span>
              </button>
            </div>
          </div>

          {/* Users Table / Grid */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3.5">Pengguna & Peran</th>
                    <th className="px-4 py-3.5">Kontak & Alamat</th>
                    <th className="px-4 py-3.5">Wilayah</th>
                    <th className="px-4 py-3.5 text-center">Poin / Bintang</th>
                    <th className="px-4 py-3.5 text-center">PIN</th>
                    <th className="px-4 py-3.5 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-10 text-slate-400 text-xs">
                        Tidak ada pengguna yang cocok dengan pencarian.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((u) => {
                      const getRoleBadge = (role: UserRole) => {
                        switch (role) {
                          case 'admin':
                            return 'bg-indigo-100 text-indigo-700 border-indigo-300 font-bold';
                          case 'kader':
                            return 'bg-teal-100 text-teal-700 border-teal-300 font-semibold';
                          case 'puskesmas':
                            return 'bg-cyan-100 text-cyan-700 border-cyan-300 font-semibold';
                          case 'anak':
                            return 'bg-amber-100 text-amber-700 border-amber-300 font-semibold';
                          default:
                            return 'bg-emerald-100 text-emerald-700 border-emerald-300 font-medium';
                        }
                      };

                      return (
                        <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl p-1 bg-slate-100 rounded-xl shrink-0">
                                {u.avatar || '👤'}
                              </span>
                              <div>
                                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                                  <span>{u.name}</span>
                                  {u.id === currentUser.id && (
                                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-500 text-white font-medium">
                                      Anda
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                  <span className={`text-[10px] px-2 py-0.5 rounded-full border ${getRoleBadge(u.role)}`}>
                                    {u.role.toUpperCase()}
                                  </span>
                                  <span className="text-[11px] text-slate-400 truncate max-w-[120px]">
                                    {u.badgeTitle}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="px-4 py-3">
                            <div className="text-xs text-slate-700">
                              {u.email && (
                                <div className="flex items-center gap-1 text-slate-600">
                                  <Mail className="w-3 h-3 text-slate-400" />
                                  <span>{u.email}</span>
                                </div>
                              )}
                              {u.phone && (
                                <div className="flex items-center gap-1 text-slate-600 mt-0.5">
                                  <Phone className="w-3 h-3 text-slate-400" />
                                  <span>{u.phone}</span>
                                </div>
                              )}
                              <div className="text-[11px] text-slate-400 truncate max-w-[180px] mt-0.5">
                                {u.address}
                              </div>
                            </div>
                          </td>

                          <td className="px-4 py-3">
                            <div className="text-xs font-semibold text-slate-800">
                              RT {u.rt} / RW {u.rw}
                            </div>
                            <div className="text-[11px] text-slate-400">{u.kelurahan}</div>
                          </td>

                          <td className="px-4 py-3 text-center">
                            <div className="inline-flex items-center gap-1 font-bold text-amber-600">
                              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                              <span>{u.stars || 0}</span>
                            </div>
                            <div className="text-[10px] text-slate-400">{u.points || 0} poin</div>
                          </td>

                          <td className="px-4 py-3 text-center">
                            <code className="bg-slate-100 px-2 py-1 rounded text-xs font-mono text-slate-700 font-bold">
                              {u.pin || '1234'}
                            </code>
                          </td>

                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleOpenEditUser(u)}
                                className="p-1.5 rounded-lg bg-slate-100 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 transition-colors cursor-pointer"
                                title="Edit Pengguna"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>

                              <button
                                onClick={() => setDeleteConfirmation({
                                  type: 'user',
                                  id: u.id,
                                  title: `Hapus Akun "${u.name}"`
                                })}
                                disabled={u.id === currentUser.id}
                                className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                                title={u.id === currentUser.id ? 'Tidak dapat menghapus akun sendiri' : 'Hapus Pengguna'}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 2: KELOLA PEMERIKSAAN JENTIK --- */}
      {activeSubTab === 'inspections' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari alamat, pemeriksa, catatan..."
                className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:outline-none focus:border-emerald-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 text-xs font-medium border border-slate-300 rounded-xl bg-slate-50 focus:outline-none cursor-pointer"
              >
                <option value="all">Semua Status Hasil ({inspections.length})</option>
                <option value="bebas_jentik">Bebas Jentik ✅</option>
                <option value="waspada_jentik">Waspada Jentik 🟡</option>
                <option value="positif_jentik">Positif Jentik ⚠️</option>
              </select>

              <button
                onClick={handleOpenAddInspection}
                className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-xl text-xs font-semibold shrink-0 cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Catat Pemeriksaan</span>
              </button>
            </div>
          </div>

          {/* Inspections Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3.5">Alamat & Wilayah</th>
                    <th className="px-4 py-3.5">Tanggal</th>
                    <th className="px-4 py-3.5">Pemeriksa</th>
                    <th className="px-4 py-3.5 text-center">Status Jentik</th>
                    <th className="px-4 py-3.5 text-center">Skor ABJ</th>
                    <th className="px-4 py-3.5">Catatan</th>
                    <th className="px-4 py-3.5 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredInspections.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-10 text-slate-400 text-xs">
                        Belum ada catatan pemeriksaan jentik.
                      </td>
                    </tr>
                  ) : (
                    filteredInspections.map((insp) => (
                      <tr key={insp.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-4 py-3">
                          <div className="font-bold text-slate-900">{insp.houseAddress}</div>
                          <div className="text-[11px] text-slate-500">RT {insp.rt} / RW {insp.rw} • {insp.kelurahan}</div>
                        </td>

                        <td className="px-4 py-3 text-xs text-slate-600 font-mono">
                          {insp.date}
                        </td>

                        <td className="px-4 py-3">
                          <div className="font-medium text-slate-800">{insp.inspectorName}</div>
                          {insp.verifiedByKader && (
                            <span className="text-[10px] bg-teal-50 text-teal-700 px-1.5 py-0.2 rounded border border-teal-200">
                              Terverifikasi Kader
                            </span>
                          )}
                        </td>

                        <td className="px-4 py-3 text-center">
                          {insp.status === 'bebas_jentik' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Bebas Jentik</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-100 text-rose-700 font-bold text-xs border border-rose-200">
                              <AlertCircle className="w-3 h-3" />
                              <span>Positif ({insp.positiveContainers}/{insp.totalContainers} wadah)</span>
                            </span>
                          )}
                        </td>

                        <td className="px-4 py-3 text-center">
                          <span className={`font-mono font-bold text-xs ${insp.abjScore === 100 ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {insp.abjScore}%
                          </span>
                        </td>

                        <td className="px-4 py-3">
                          <div className="text-xs text-slate-600 truncate max-w-[200px]">
                            {insp.notes || 'Kondisi wadah air tertata'}
                          </div>
                        </td>

                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenEditInspection(insp)}
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-600 transition-colors cursor-pointer"
                              title="Edit Catatan"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => setDeleteConfirmation({
                                type: 'inspection',
                                id: insp.id,
                                title: `Hapus Pemeriksaan "${insp.houseAddress}"`
                              })}
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                              title="Hapus Catatan"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 3: KELOLA KASUS DBD --- */}
      {activeSubTab === 'cases' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari pasien, faskes, diagnosa..."
                className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:outline-none focus:border-rose-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>

            <button
              onClick={handleOpenAddCase}
              className="inline-flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white px-3.5 py-2 rounded-xl text-xs font-semibold cursor-pointer shadow-xs shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Catat Kasus DBD</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3.5">Pasien (Inisial)</th>
                    <th className="px-4 py-3.5">Usia / Gender</th>
                    <th className="px-4 py-3.5">Lokasi & RT/RW</th>
                    <th className="px-4 py-3.5">Diagnosa & Faskes</th>
                    <th className="px-4 py-3.5 text-center">Status Rawat</th>
                    <th className="px-4 py-3.5 text-center">Fogging</th>
                    <th className="px-4 py-3.5 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredCases.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-10 text-slate-400 text-xs">
                        Tidak ada catatan kasus DBD saat ini.
                      </td>
                    </tr>
                  ) : (
                    filteredCases.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-4 py-3 font-bold text-slate-900">{c.patientInitials}</td>
                        <td className="px-4 py-3 text-xs text-slate-600">{c.age} thn ({c.gender})</td>
                        <td className="px-4 py-3 text-xs text-slate-700">
                          <div>{c.address}</div>
                          <div className="text-[11px] text-slate-400">{c.rtRw}</div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-semibold text-rose-700 block text-xs">
                            {c.diagnosis}
                          </span>
                          <div className="text-[11px] text-slate-400">{c.faskesName}</div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                            c.status === 'sembuh'
                              ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                              : 'bg-rose-100 text-rose-700 border border-rose-200'
                          }`}>
                            {c.status.replace('_', ' ').toUpperCase()}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          {c.foggingScheduled ? (
                            <span className="text-[11px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                              Terjadwal 💨
                            </span>
                          ) : (
                            <span className="text-[11px] text-slate-400">-</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenEditCase(c)}
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 transition-colors cursor-pointer"
                              title="Edit Kasus"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDeleteConfirmation({
                                type: 'case',
                                id: c.id,
                                title: `Hapus Kasus "${c.patientInitials}"`
                              })}
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                              title="Hapus Kasus"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 4: KELOLA LAPORAN KOMUNITAS --- */}
      {activeSubTab === 'reports' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">Laporan Hotspot / Genangan Warga</h3>
            <span className="text-xs text-slate-500">{communityReports.length} laporan masuk</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {communityReports.length === 0 ? (
              <div className="col-span-3 text-center py-12 bg-white rounded-2xl border border-slate-200 text-slate-400 text-xs">
                Belum ada laporan genangan dari warga.
              </div>
            ) : (
              communityReports.map((rep) => (
                <div key={rep.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{rep.title}</h4>
                      <p className="text-[11px] text-slate-500">{rep.address} ({rep.rtRw})</p>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                      rep.status === 'selesai'
                        ? 'bg-emerald-100 text-emerald-700'
                        : rep.status === 'dalam_tindakan'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {rep.status.replace('_', ' ')}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2">{rep.description}</p>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-400 text-[11px]">Oleh: {rep.reporterName}</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={async () => {
                          const nextStatus = rep.status === 'menunggu_verifikasi' 
                            ? 'terverifikasi' 
                            : rep.status === 'terverifikasi' 
                            ? 'dalam_tindakan' 
                            : 'selesai';
                          await onSaveCommunityReport({ ...rep, status: nextStatus as any });
                          showToast(`Status laporan diubah ke ${nextStatus}`);
                        }}
                        className="px-2 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-[11px] font-semibold hover:bg-indigo-100 cursor-pointer"
                      >
                        Ubah Status ➔
                      </button>
                      <button
                        onClick={() => setDeleteConfirmation({
                          type: 'report',
                          id: rep.id,
                          title: `Hapus Laporan "${rep.title}"`
                        })}
                        className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* --- TAB 5: KONTROL BASIS DATA & TOOLS --- */}
      {activeSubTab === 'tools' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-100 text-emerald-700 rounded-2xl">
                <Download className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Ekspor Seluruh Basis Data</h3>
                <p className="text-xs text-slate-500">Unduh data pengguna, pemeriksaan, dan kasus dalam format JSON</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Ekspor ini dapat digunakan sebagai arsip kelurahan, laporan resmi ke Dinas Kesehatan, atau cadangan offline.
            </p>

            <button
              onClick={() => {
                const fullData = {
                  exportedAt: new Date().toISOString(),
                  users: allUsers,
                  inspections,
                  cases,
                  communityReports
                };
                const blob = new Blob([JSON.stringify(fullData, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `sijumantik-full-backup-${new Date().toISOString().split('T')[0]}.json`;
                a.click();
                URL.revokeObjectURL(url);
                showToast('Cadangan data JSON berhasil diunduh!');
              }}
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl font-semibold text-xs cursor-pointer shadow-xs"
            >
              <Download className="w-4 h-4" />
              <span>Download JSON Backup</span>
            </button>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-rose-200 shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-rose-100 text-rose-700 rounded-2xl">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-rose-900 text-base">Reset Data Aplikasi (Mulai Dari 0)</h3>
                <p className="text-xs text-rose-600">Hapus semua data dummy dan mulai sistem dengan data bersih</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Tindakan ini akan mengosongkan seluruh riwayat pemeriksaan warga dan laporan di Cloud Firestore, menyisakan akun admin aktif Anda untuk input baru.
            </p>

            <button
              onClick={() => setDeleteConfirmation({
                type: 'reset',
                id: 'all',
                title: 'RESET TOTAL: Kosongkan data warga dan pemeriksaan (Mulai dari 0)'
              })}
              className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-4 py-2.5 rounded-xl font-semibold text-xs cursor-pointer shadow-xs"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reset Database ke 0</span>
            </button>
          </div>
        </div>
      )}

      {/* --- MODAL 1: ADD / EDIT USER --- */}
      {userModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-base">
                  {editingUser ? 'Edit Akun Pengguna' : 'Tambah Akun Pengguna Baru'}
                </h3>
              </div>
              <button
                onClick={() => setUserModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveUserSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Lengkap:
                </label>
                <input
                  type="text"
                  value={userForm.name || ''}
                  onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                  placeholder="Nama Lengkap Warga / Kader"
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              {/* Peran & Avatar */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Peran (Role):
                  </label>
                  <select
                    value={userForm.role || 'warga'}
                    onChange={(e) => setUserForm({ ...userForm, role: e.target.value as UserRole })}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium bg-slate-50 focus:outline-none"
                  >
                    <option value="admin">Admin Wilayah 🛡️</option>
                    <option value="kader">Kader Jumantik 👩‍⚕️</option>
                    <option value="warga">Warga / Lansia 🧕</option>
                    <option value="anak">Jumantik Cilik 👦</option>
                    <option value="puskesmas">Puskesmas / Nakes 🏥</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Avatar Emoji:
                  </label>
                  <select
                    value={userForm.avatar || '🧕🌸'}
                    onChange={(e) => setUserForm({ ...userForm, avatar: e.target.value })}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium bg-slate-50 focus:outline-none"
                  >
                    {AVATAR_OPTIONS.map((opt) => (
                      <option key={opt.emoji} value={opt.emoji}>
                        {opt.emoji} {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Kontak */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nomor HP / WhatsApp:
                  </label>
                  <input
                    type="text"
                    value={userForm.phone || ''}
                    onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })}
                    placeholder="081234567890"
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email:
                  </label>
                  <input
                    type="email"
                    value={userForm.email || ''}
                    onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                    placeholder="nama@email.com"
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Alamat & RT/RW */}
              <div className="space-y-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Alamat Rumah:
                  </label>
                  <input
                    type="text"
                    value={userForm.address || ''}
                    onChange={(e) => setUserForm({ ...userForm, address: e.target.value })}
                    placeholder="Jl. Melati No. 12"
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[11px] text-slate-500">RT:</label>
                    <input
                      type="text"
                      value={userForm.rt || ''}
                      onChange={(e) => setUserForm({ ...userForm, rt: e.target.value })}
                      className="w-full border border-slate-300 rounded-xl p-2 text-xs text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-500">RW:</label>
                    <input
                      type="text"
                      value={userForm.rw || ''}
                      onChange={(e) => setUserForm({ ...userForm, rw: e.target.value })}
                      className="w-full border border-slate-300 rounded-xl p-2 text-xs text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-500">PIN 4-Digit:</label>
                    <input
                      type="text"
                      maxLength={6}
                      value={userForm.pin || ''}
                      onChange={(e) => setUserForm({ ...userForm, pin: e.target.value })}
                      className="w-full border border-slate-300 rounded-xl p-2 text-xs text-center font-mono font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* Gamifikasi: Poin, Bintang, Gelar */}
              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 space-y-2">
                <div className="text-xs font-bold text-amber-800 flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-600" />
                  <span>Poin & Pencapaian Jumantik:</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] text-amber-700">Total Bintang ⭐:</label>
                    <input
                      type="number"
                      value={userForm.stars ?? 0}
                      onChange={(e) => setUserForm({ ...userForm, stars: Number(e.target.value) })}
                      className="w-full bg-white border border-amber-300 rounded-xl p-1.5 text-xs text-center font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-amber-700">Poin ABJ:</label>
                    <input
                      type="number"
                      value={userForm.points ?? 0}
                      onChange={(e) => setUserForm({ ...userForm, points: Number(e.target.value) })}
                      className="w-full bg-white border border-amber-300 rounded-xl p-1.5 text-xs text-center font-bold"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] text-amber-700">Gelar Penghargaan (Badge):</label>
                  <input
                    type="text"
                    value={userForm.badgeTitle || ''}
                    onChange={(e) => setUserForm({ ...userForm, badgeTitle: e.target.value })}
                    className="w-full bg-white border border-amber-300 rounded-xl p-1.5 text-xs"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setUserModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={savingLoading}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm py-2 px-5 rounded-xl transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan ke Firestore</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 2: ADD / EDIT INSPECTION --- */}
      {inspectionModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Home className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-base">
                  {editingInspection ? 'Edit Catatan Pemeriksaan' : 'Tambah Pemeriksaan Jentik'}
                </h3>
              </div>
              <button
                onClick={() => setInspectionModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveInspectionSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Alamat Lengkap Rumah:
                </label>
                <input
                  type="text"
                  value={inspectionForm.houseAddress}
                  onChange={(e) => setInspectionForm({ ...inspectionForm, houseAddress: e.target.value })}
                  placeholder="Contoh: Jl. Anggrek No. 14, Rumah Ibu Siti"
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tanggal:</label>
                  <input
                    type="date"
                    value={inspectionForm.date}
                    onChange={(e) => setInspectionForm({ ...inspectionForm, date: e.target.value })}
                    className="w-full border border-slate-300 rounded-xl p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">RT:</label>
                  <input
                    type="text"
                    value={inspectionForm.rt}
                    onChange={(e) => setInspectionForm({ ...inspectionForm, rt: e.target.value })}
                    className="w-full border border-slate-300 rounded-xl p-2 text-xs text-center"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">RW:</label>
                  <input
                    type="text"
                    value={inspectionForm.rw}
                    onChange={(e) => setInspectionForm({ ...inspectionForm, rw: e.target.value })}
                    className="w-full border border-slate-300 rounded-xl p-2 text-xs text-center"
                  />
                </div>
              </div>

              {/* Status Bebas vs Positif */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Hasil Status Jentik:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setInspectionForm({ ...inspectionForm, status: 'bebas_jentik', positiveContainers: 0, abjScore: 100 })}
                    className={`p-3 rounded-2xl border text-center transition-colors cursor-pointer ${
                      inspectionForm.status === 'bebas_jentik'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-800 font-bold'
                        : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    <div className="text-xl mb-0.5">✅</div>
                    <div className="text-xs">Bebas Jentik (100% Bersih)</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setInspectionForm({ ...inspectionForm, status: 'positif_jentik', positiveContainers: 1, abjScore: 75 })}
                    className={`p-3 rounded-2xl border text-center transition-colors cursor-pointer ${
                      inspectionForm.status === 'positif_jentik'
                        ? 'bg-rose-50 border-rose-500 text-rose-800 font-bold'
                        : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    <div className="text-xl mb-0.5">🦟⚠️</div>
                    <div className="text-xs">Positif Ditemukan Jentik</div>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Total Wadah Diperiksa:
                  </label>
                  <input
                    type="number"
                    value={inspectionForm.totalContainers}
                    onChange={(e) => setInspectionForm({ ...inspectionForm, totalContainers: Number(e.target.value) })}
                    className="w-full border border-slate-300 rounded-xl p-2 text-xs text-center font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Wadah Positif Jentik:
                  </label>
                  <input
                    type="number"
                    value={inspectionForm.positiveContainers}
                    onChange={(e) => setInspectionForm({ ...inspectionForm, positiveContainers: Number(e.target.value) })}
                    className="w-full border border-slate-300 rounded-xl p-2 text-xs text-center font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Catatan / Tindakan 3M Plus:
                </label>
                <textarea
                  value={inspectionForm.notes}
                  onChange={(e) => setInspectionForm({ ...inspectionForm, notes: e.target.value })}
                  placeholder="Kuras bak mandi berkala, tabur bubuk abate, tutup penampungan..."
                  rows={2}
                  className="w-full border border-slate-300 rounded-xl p-2 text-xs focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setInspectionModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={savingLoading}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm py-2 px-5 rounded-xl transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Pemeriksaan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 3: ADD / EDIT CASE --- */}
      {caseModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-400" />
                <h3 className="font-bold text-base">
                  {editingCase ? 'Edit Data Kasus DBD' : 'Catat Kasus DBD Baru'}
                </h3>
              </div>
              <button
                onClick={() => setCaseModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCaseSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Inisial / Nama Pasien:
                </label>
                <input
                  type="text"
                  value={caseForm.patientInitials}
                  onChange={(e) => setCaseForm({ ...caseForm, patientInitials: e.target.value })}
                  placeholder="Contoh: An. B (7 th) / Tn. R"
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm focus:outline-none focus:border-rose-500"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] text-slate-500">Usia:</label>
                  <input
                    type="number"
                    value={caseForm.age}
                    onChange={(e) => setCaseForm({ ...caseForm, age: Number(e.target.value) })}
                    className="w-full border border-slate-300 rounded-xl p-2 text-xs text-center"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-500">Gender:</label>
                  <select
                    value={caseForm.gender}
                    onChange={(e) => setCaseForm({ ...caseForm, gender: e.target.value as 'L' | 'P' })}
                    className="w-full border border-slate-300 rounded-xl p-2 text-xs"
                  >
                    <option value="L">Laki-laki (L)</option>
                    <option value="P">Perempuan (P)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] text-slate-500">Status Rawat:</label>
                  <select
                    value={caseForm.status}
                    onChange={(e) => setCaseForm({ ...caseForm, status: e.target.value as any })}
                    className="w-full border border-slate-300 rounded-xl p-2 text-xs font-semibold"
                  >
                    <option value="rawat_inap">Rawat Inap</option>
                    <option value="rawat_jalan">Rawat Jalan</option>
                    <option value="rujukan_icu">Rujukan ICU</option>
                    <option value="sembuh">Sembuh</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Diagnosa Medis:
                </label>
                <select
                  value={caseForm.diagnosis}
                  onChange={(e) => setCaseForm({ ...caseForm, diagnosis: e.target.value as any })}
                  className="w-full border border-slate-300 rounded-xl p-2 text-xs font-semibold bg-rose-50 border-rose-300 text-rose-800"
                >
                  <option value="DBD Derajat I">DBD Derajat I</option>
                  <option value="DBD Derajat II">DBD Derajat II</option>
                  <option value="DBD Derajat III (DSS)">DBD Derajat III (DSS)</option>
                  <option value="Demam Dengue">Demam Dengue</option>
                  <option value="Dugaan Gejala">Dugaan Gejala</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Alamat Pasien:</label>
                  <input
                    type="text"
                    value={caseForm.address}
                    onChange={(e) => setCaseForm({ ...caseForm, address: e.target.value })}
                    placeholder="Jl. Mawar No. 8"
                    className="w-full border border-slate-300 rounded-xl p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Wilayah RT/RW:</label>
                  <input
                    type="text"
                    value={caseForm.rtRw}
                    onChange={(e) => setCaseForm({ ...caseForm, rtRw: e.target.value })}
                    placeholder="RT 01 / RW 02"
                    className="w-full border border-slate-300 rounded-xl p-2 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Fasilitas Kesehatan (RS / Puskesmas):
                </label>
                <input
                  type="text"
                  value={caseForm.faskesName}
                  onChange={(e) => setCaseForm({ ...caseForm, faskesName: e.target.value })}
                  placeholder="Puskesmas Kecamatan Sukamaju"
                  className="w-full border border-slate-300 rounded-xl p-2 text-xs"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCaseModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={savingLoading}
                  className="bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs sm:text-sm py-2 px-5 rounded-xl transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Kasus</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- CONFIRMATION MODAL FOR DELETE --- */}
      {deleteConfirmation && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md p-6 space-y-4 animate-in fade-in zoom-in-95 text-center">
            <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div>
              <h3 className="font-bold text-slate-900 text-base">Konfirmasi Tindakan Admin</h3>
              <p className="text-xs text-slate-500 mt-1">
                Apakah Anda yakin ingin melakukan tindakan berikut pada basis data?
              </p>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 mt-3">
                {deleteConfirmation.title}
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmation(null)}
                className="flex-1 py-2.5 px-4 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-100 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={savingLoading}
                onClick={handleExecuteDelete}
                className="flex-1 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold cursor-pointer disabled:opacity-50"
              >
                {savingLoading ? 'Menjalankan...' : 'Ya, Eksekusi'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
