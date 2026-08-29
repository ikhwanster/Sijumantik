import React, { useState } from 'react';
import { 
  PhoneCall, 
  AlertOctagon, 
  MapPin, 
  ShieldAlert, 
  Building2, 
  Droplet, 
  Volume2, 
  X, 
  ExternalLink,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { playAlertTone } from '../../utils/audioAlert';
import { FaskesFacility } from '../../types/jumantik';

interface SosEmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  facilities: FaskesFacility[];
  onOpenEvacuationGuide: () => void;
}

export const SosEmergencyModal: React.FC<SosEmergencyModalProps> = ({
  isOpen,
  onClose,
  facilities,
  onOpenEvacuationGuide,
}) => {
  const [callingState, setCallingState] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleTriggerEmergencyCall = (name: string, phone: string) => {
    setCallingState(name);
    playAlertTone('emergency');
    setTimeout(() => {
      window.location.href = `tel:${phone.replace(/[^0-9]/g, '')}`;
      setCallingState(null);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full overflow-hidden border-2 border-red-500 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/20 flex items-center justify-center animate-pulse">
              <AlertOctagon className="w-7 h-7 text-amber-200" />
            </div>
            <div>
              <h3 className="font-black text-lg sm:text-xl leading-tight">PUSAT DARURAT MEDIS DBD</h3>
              <p className="text-xs text-red-100">Hotline Siaga 24 Jam Puskesmas & Evakuasi Gawat Darurat</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1.5 rounded-lg hover:bg-white/10"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
          {/* Quick 112 / 119 Emergency Grid */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleTriggerEmergencyCall('Ambulans Gawat Darurat (119)', '119')}
              className="p-4 rounded-2xl bg-red-600 hover:bg-red-700 text-white text-left font-black transition-all shadow-md active:scale-98 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs uppercase bg-white/20 px-2 py-0.5 rounded font-bold">Nasional</span>
                <PhoneCall className="w-5 h-5 text-amber-300 animate-bounce" />
              </div>
              <div>
                <span className="text-2xl font-black">119</span>
                <p className="text-[11px] text-red-100 font-normal">Ambulans & IGD 24 Jam</p>
              </div>
            </button>

            <button
              onClick={() => handleTriggerEmergencyCall('Panggilan Darurat BPBD / Polisi (112)', '112')}
              className="p-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-left font-black transition-all shadow-md active:scale-98 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs uppercase bg-white/20 px-2 py-0.5 rounded font-bold">Bebas Pulsa</span>
                <PhoneCall className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <span className="text-2xl font-black">112</span>
                <p className="text-[11px] text-slate-300 font-normal">Panggilan Darurat Terpadu</p>
              </div>
            </button>
          </div>

          {/* Local Faskes Hotlines */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Fasilitas Kesehatan Terdekat Sukamaju:
            </h4>

            <div className="space-y-2">
              {facilities.map((f) => (
                <div
                  key={f.id}
                  className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-3 hover:bg-white hover:border-red-300 transition-all"
                >
                  <div className="space-y-0.5">
                    <h5 className="font-bold text-xs sm:text-sm text-slate-900">{f.name}</h5>
                    <p className="text-[11px] text-slate-500">
                      📍 {f.address} | Bed DBD: <strong>{f.availableBeds} Kosong</strong>
                    </p>
                  </div>

                  <button
                    onClick={() => handleTriggerEmergencyCall(f.name, f.phone)}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-3 py-2 rounded-xl shrink-0 flex items-center gap-1.5 shadow-xs"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Hubungi</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* First Aid before evacuation banner */}
          <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 text-xs space-y-2 text-amber-950">
            <p className="font-bold flex items-center gap-1.5 text-amber-900">
              <Droplet className="w-4 h-4 text-amber-700 shrink-0" />
              <span>Tindakan Pertolongan Pertama Sebelum Sampai di RS:</span>
            </p>
            <ul className="list-disc list-inside space-y-1 text-amber-900">
              <li>Berikan minum cairan elektrolit / oralit sebanyak mungkin (jangan biarkan haus).</li>
              <li>Posisikan pasien berbaring dengan kaki sedikit lebih tinggi jika tampak lemas/pucat.</li>
              <li>Kompres air hangat pada dahi, ketiak, dan lipatan paha.</li>
              <li>Jangan berikan makanan berlemak atau obat pereda nyeri selain Parasetamol.</li>
            </ul>
          </div>

          {/* Action to Evacuation Guide */}
          <div className="pt-2">
            <button
              onClick={() => {
                onClose();
                onOpenEvacuationGuide();
              }}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold py-3 rounded-2xl flex items-center justify-center gap-2 shadow-md"
            >
              <span>Buka Panduan Langkah-demi-Langkah Evakuasi Pasien</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
