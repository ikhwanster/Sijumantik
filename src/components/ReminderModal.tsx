import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  Volume2, 
  Sparkles, 
  ShieldCheck, 
  X,
  AlertCircle
} from 'lucide-react';
import { playAlertTone } from '../utils/audioAlert';

interface ReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInspectionNow: () => void;
}

export const ReminderModal: React.FC<ReminderModalProps> = ({
  isOpen,
  onClose,
  onInspectionNow,
}) => {
  const [dayOfWeek, setDayOfWeek] = useState<'Jumat' | 'Minggu' | 'Setiap Hari'>('Jumat');
  const [time, setTime] = useState('07:30');
  const [enabled, setEnabled] = useState(true);
  const [hasNotificationPermission, setHasNotificationPermission] = useState<boolean | null>(null);
  const [testSent, setTestSent] = useState(false);
  const [streakWeeks, setStreakWeeks] = useState(4);

  useEffect(() => {
    if ('Notification' in window) {
      setHasNotificationPermission(Notification.permission === 'granted');
    }
  }, []);

  const requestPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setHasNotificationPermission(permission === 'granted');
      if (permission === 'granted') {
        sendTestNotification();
      }
    }
  };

  const sendTestNotification = () => {
    playAlertTone('reminder');
    setTestSent(true);

    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('🔔 Pengingat SiJumantik (1R1J)', {
        body: 'Waktunya Gerakan Jumat Bersih! Periksa bak mandi, dispenser, dan genangan air di rumah sekarang.',
        icon: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=128&q=80',
      });
    }

    setTimeout(() => setTestSent(false), 4000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-xs">
              <Bell className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">Pengingat Pantau Jentik Rutin</h3>
              <p className="text-xs text-emerald-100">Otomatisasi Gerakan 1 Rumah 1 Jumantik (1R1J)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1.5 rounded-lg hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5">
          {/* Streak Banner */}
          <div className="bg-gradient-to-r from-amber-50 to-emerald-50 border border-amber-200/80 rounded-xl p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-500 text-white flex items-center justify-center font-black text-sm shadow-sm">
                🔥 {streakWeeks}x
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">Streak Ketaatan Jumantik</p>
                <p className="text-[11px] text-slate-600">4 Minggu berturut-turut rumah Anda bebas jentik!</p>
              </div>
            </div>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
              Keluarga Teladan
            </span>
          </div>

          {/* Toggle reminder */}
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <p className="text-sm font-bold text-slate-800">Aktifkan Alarm Pengingat</p>
              <p className="text-xs text-slate-500">Kirim notifikasi otomatis saat jadwal inspeksi tiba</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={enabled}
                onChange={(e) => setEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          {/* Day & Time Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                Hari Pemantauan
              </label>
              <select
                value={dayOfWeek}
                onChange={(e) => setDayOfWeek(e.target.value as any)}
                className="w-full text-xs font-medium bg-white border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              >
                <option value="Jumat">Setiap Hari Jumat (Jumat Bersih)</option>
                <option value="Minggu">Setiap Hari Minggu (Pagi)</option>
                <option value="Setiap Hari">Harian (Zona Rawan KLB)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-emerald-600" />
                Waktu Alarm
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full text-xs font-medium bg-white border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Browser Permission Prompt */}
          <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-emerald-900">Izin Notifikasi Perangkat</p>
                  <p className="text-[11px] text-emerald-700">
                    {hasNotificationPermission
                      ? '✅ Notifikasi aktif di browser/perangkat Anda'
                      : 'Izinkan browser untuk memunculkan notifikasi pop-up & suara'}
                  </p>
                </div>
              </div>
              {!hasNotificationPermission && (
                <button
                  onClick={requestPermission}
                  className="px-2.5 py-1 bg-emerald-600 text-white rounded text-xs font-bold hover:bg-emerald-700 shrink-0 shadow-xs"
                >
                  Izinkan
                </button>
              )}
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-emerald-200/50">
              <span className="text-[11px] text-slate-600">Simulasi bunyi bel & notifikasi:</span>
              <button
                onClick={sendTestNotification}
                className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-white hover:bg-emerald-100 px-2 py-1 rounded border border-emerald-300 transition-colors"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>{testSent ? 'Terkirim & Berbunyi!' : 'Uji Bunyi Alarm'}</span>
              </button>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={() => {
                onClose();
                onInspectionNow();
              }}
              className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Mulai Inspeksi Sekarang</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs sm:text-sm"
            >
              Simpan Jadwal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
