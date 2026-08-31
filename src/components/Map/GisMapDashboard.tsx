import React, { useState } from 'react';
import { 
  MapPin, 
  Layers, 
  Compass, 
  Radio,
  Locate,
  Activity,
  ShieldCheck,
  Building2,
  Sparkles,
  Smartphone
} from 'lucide-react';
import { AreaZone, DengueCaseReport, FaskesFacility, HomeInspectionRecord } from '../../types/jumantik';
import { RealtimeLeafletMap } from './RealtimeLeafletMap';
import { useLiveLocation } from '../../hooks/useLiveLocation';

interface GisMapDashboardProps {
  zones: AreaZone[];
  cases: DengueCaseReport[];
  facilities: FaskesFacility[];
  inspections: HomeInspectionRecord[];
  onSelectCase?: (c: DengueCaseReport) => void;
  onOpenSos?: () => void;
}

export const GisMapDashboard: React.FC<GisMapDashboardProps> = ({
  zones,
  cases,
  facilities,
  inspections,
  onSelectCase,
  onOpenSos,
}) => {
  const { location: userLocation, refreshLocation, setManualLocation } = useLiveLocation();
  const [mapMode, setMapMode] = useState<'realtime_gps' | 'spatial_overview'>('realtime_gps');

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-blue-100 text-blue-700 rounded-xl">
              <Locate className="w-5 h-5 animate-pulse" />
            </span>
            <h2 className="text-lg font-black text-slate-900">Peta Wilayah Real-Time Sesuai Lokasi HP</h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Sistem Pemetaan Spasial Real-Time GPS: Melacak lokasi HP Anda secara langsung, zona kerawanan jentik, dan radius Faskes terdekat.
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200 w-full sm:w-auto">
          <button
            onClick={() => setMapMode('realtime_gps')}
            className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              mapMode === 'realtime_gps'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>📍 Peta GPS HP Live</span>
          </button>

          <button
            onClick={() => setMapMode('spatial_overview')}
            className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              mapMode === 'spatial_overview'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>📊 Ringkasan Spasial RW</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Real-time GPS Leaflet Map */}
      <RealtimeLeafletMap
        userLocation={userLocation}
        onRefreshLocation={refreshLocation}
        onSelectManualCity={(lat, lng, name) => setManualLocation(lat, lng, name)}
        zones={zones}
        cases={cases}
        facilities={facilities}
        inspections={inspections}
        onOpenSos={onOpenSos}
      />

      {/* Spatial Overview Stats when in overview tab */}
      {mapMode === 'spatial_overview' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">Angka Bebas Jentik Rata-rata</span>
              <span className="p-1.5 bg-emerald-100 text-emerald-700 rounded-lg">
                <ShieldCheck className="w-4 h-4" />
              </span>
            </div>
            <p className="text-2xl font-black text-slate-900">96.4%</p>
            <p className="text-[11px] text-emerald-600 font-bold">✓ Memenuhi Target Kemenkes (≥95%)</p>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">Total Kasus Aktif Terpantau</span>
              <span className="p-1.5 bg-red-100 text-red-700 rounded-lg">
                <Activity className="w-4 h-4" />
              </span>
            </div>
            <p className="text-2xl font-black text-red-600">{cases.length} Pasien</p>
            <p className="text-[11px] text-slate-500">Tersebar di 6 RW binaan Puskesmas</p>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">Fasilitas Kesehatan Siaga</span>
              <span className="p-1.5 bg-teal-100 text-teal-700 rounded-lg">
                <Building2 className="w-4 h-4" />
              </span>
            </div>
            <p className="text-2xl font-black text-teal-700">{facilities.length} Faskes</p>
            <p className="text-[11px] text-slate-500">Siap rujukan rawat inap & trombosit</p>
          </div>
        </div>
      )}
    </div>
  );
};
