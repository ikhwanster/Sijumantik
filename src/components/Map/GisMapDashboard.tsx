import React, { useState, useMemo } from 'react';
import { 
  MapPin, 
  Layers, 
  Filter, 
  ZoomIn, 
  ZoomOut, 
  Compass, 
  ShieldAlert, 
  Building2, 
  Flame, 
  CheckCircle2, 
  AlertOctagon, 
  Wind, 
  Search, 
  Maximize2, 
  Info,
  Navigation,
  Activity,
  BedDouble,
  Droplet,
  X
} from 'lucide-react';
import { AreaZone, DengueCaseReport, FaskesFacility, HomeInspectionRecord } from '../../types/jumantik';

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
  // Layer toggles
  const [showCases, setShowCases] = useState(true);
  const [showLarvae, setShowLarvae] = useState(true);
  const [showFacilities, setShowFacilities] = useState(true);
  const [showFogging, setShowFogging] = useState(true);
  const [showBufferRadius, setShowBufferRadius] = useState(true);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [selectedZoneFilter, setSelectedZoneFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Map state (Center and Zoom)
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Selected item for popup inspection
  const [selectedEntity, setSelectedEntity] = useState<{
    type: 'case' | 'larva' | 'faskes' | 'zone';
    data: any;
  } | null>(null);

  // Coordinate projection helper to convert lat/lng to SVG canvas coordinates
  // Center: Sukamaju area approx lat: -6.2100, lng: 106.8480
  const centerLat = -6.2100;
  const centerLng = 106.8480;
  const scale = 22000; // SVG coordinate scaling

  const projectCoords = (lat: number, lng: number) => {
    const x = 500 + (lng - centerLng) * scale;
    const y = 350 - (lat - centerLat) * scale;
    return { x, y };
  };

  // Filtered lists
  const filteredCases = useMemo(() => {
    return cases.filter((c) => {
      if (selectedZoneFilter !== 'all' && !c.rtRw.includes(selectedZoneFilter)) return false;
      if (searchQuery && !c.patientInitials.toLowerCase().includes(searchQuery.toLowerCase()) && !c.address.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  }, [cases, selectedZoneFilter, searchQuery]);

  const filteredInspections = useMemo(() => {
    return inspections.filter((i) => {
      if (selectedZoneFilter !== 'all' && i.rw !== selectedZoneFilter.replace('RW ', '')) return false;
      return true;
    });
  }, [inspections, selectedZoneFilter]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPanOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  const resetView = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  return (
    <div className="space-y-4">
      {/* Top Header and GIS Stats Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-teal-100 text-teal-700 rounded-lg">
              <Compass className="w-5 h-5" />
            </span>
            <h2 className="text-lg font-black text-slate-900">Dasbor Geospasial (GIS) Pantau DBD & Jentik</h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Peta digital real-time persebaran kasus demam berdarah, sarang jentik, dan kapasitas logistik Faskes
          </p>
        </div>

        {/* Zone Summary Chips */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 border border-red-200 text-xs font-bold text-red-700">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
            <span>Zona Merah (KLB): RW 03</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-xs font-bold text-amber-700">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>Waspada: RW 01, RW 05</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-700">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Aman (ABJ ≥95%): RW 02, 04, 06</span>
          </div>
        </div>
      </div>

      {/* Control Bar: Filter, Layer Toggles, Search */}
      <div className="bg-slate-900 text-white rounded-2xl p-3 sm:p-4 shadow-md space-y-3">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
          {/* Search & Zone Dropdown */}
          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
            <div className="relative flex-1 sm:w-60">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Cari pasien, alamat, RW..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-teal-400"
              />
            </div>

            <select
              value={selectedZoneFilter}
              onChange={(e) => setSelectedZoneFilter(e.target.value)}
              className="text-xs bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-hidden focus:ring-2 focus:ring-teal-400"
            >
              <option value="all">Semua Wilayah RW</option>
              <option value="RW 01">RW 01 (Dusun Mawar)</option>
              <option value="RW 02">RW 02 (Kp. Melati - Aman)</option>
              <option value="RW 03">RW 03 (Bantaran Kali - KLB)</option>
              <option value="RW 04">RW 04 (Griya Asri)</option>
              <option value="RW 05">RW 05 (Pasar Lama)</option>
              <option value="RW 06">RW 06 (Cempaka Putih)</option>
            </select>
          </div>

          {/* Layer toggles */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <button
              onClick={() => setShowCases(!showCases)}
              className={`px-2.5 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
                showCases ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-400'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-white" />
              <span>Kasus DBD ({filteredCases.length})</span>
            </button>

            <button
              onClick={() => setShowLarvae(!showLarvae)}
              className={`px-2.5 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
                showLarvae ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Sarang Jentik</span>
            </button>

            <button
              onClick={() => setShowFacilities(!showFacilities)}
              className={`px-2.5 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
                showFacilities ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-400'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Puskesmas & RS ({facilities.length})</span>
            </button>

            <button
              onClick={() => setShowFogging(!showFogging)}
              className={`px-2.5 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
                showFogging ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-400'
              }`}
            >
              <Wind className="w-3.5 h-3.5" />
              <span>Jadwal Fogging</span>
            </button>

            <button
              onClick={() => setShowBufferRadius(!showBufferRadius)}
              className={`px-2.5 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
                showBufferRadius ? 'bg-rose-900 text-rose-200 border border-rose-600' : 'bg-slate-800 text-slate-400'
              }`}
            >
              <AlertOctagon className="w-3.5 h-3.5" />
              <span>Radius Bahaya (500m)</span>
            </button>

            <button
              onClick={() => setShowHeatmap(!showHeatmap)}
              className={`px-2.5 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
                showHeatmap ? 'bg-gradient-to-r from-yellow-500 to-red-500 text-white' : 'bg-slate-800 text-slate-400'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Heatmap Kerawanan</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Interactive Map Canvas */}
      <div className="relative w-full h-[550px] bg-slate-950 rounded-2xl overflow-hidden border border-slate-300 shadow-inner select-none cursor-grab active:cursor-grabbing">
        {/* Map Watermark & Info */}
        <div className="absolute top-4 left-4 z-20 bg-slate-900/90 backdrop-blur-md p-3 rounded-xl border border-slate-700 text-white space-y-1 text-xs pointer-events-auto">
          <div className="flex items-center gap-1.5 font-bold text-teal-400">
            <Compass className="w-4 h-4 animate-spin" />
            <span>Peta Spasial Vektor Sukamaju</span>
          </div>
          <p className="text-[11px] text-slate-400">Pusat: -6.2100, 106.8480 | Zoom: {(zoomLevel * 100).toFixed(0)}%</p>
        </div>

        {/* Floating Zoom & Reset Tools */}
        <div className="absolute top-4 right-4 z-20 flex flex-col gap-1.5 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-xl border border-slate-700 text-white pointer-events-auto shadow-lg">
          <button
            onClick={() => setZoomLevel((z) => Math.min(z + 0.3, 2.5))}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-200 hover:text-white"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoomLevel((z) => Math.max(z - 0.3, 0.7))}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-200 hover:text-white"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={resetView}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-teal-400"
            title="Reset Posisi Peta"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>

        {/* Legend Overlay at Bottom Left */}
        <div className="absolute bottom-4 left-4 z-20 bg-slate-900/90 backdrop-blur-md p-3 rounded-xl border border-slate-700 text-white text-[11px] space-y-1.5 hidden sm:block pointer-events-none">
          <p className="font-bold text-slate-300 uppercase tracking-wider text-[10px]">Legenda GIS:</p>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500 border border-white" />
            <span>Kasus DBD Terkonfirmasi (Rawat Inap/ICU)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-400" />
            <span>Temuan Sarang Jentik Positif</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-md bg-cyan-500" />
            <span>Puskesmas / Rumah Sakit Rujukan</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-purple-500 animate-ping" />
            <span>Target Fogging Fokus Terjadwal</span>
          </div>
        </div>

        {/* SVG GIS Layer Render */}
        <svg
          viewBox="0 0 1000 700"
          className="w-full h-full"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <g
            transform={`translate(${panOffset.x}, ${panOffset.y}) scale(${zoomLevel})`}
            transform-origin="500 350"
          >
            {/* Background Map Grid & Roads */}
            <defs>
              <pattern id="gisGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="0.7" />
              </pattern>

              {/* Heatmap gradients */}
              <radialGradient id="heatGradientKLB" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ef4444" stopOpacity="0.65" />
                <stop offset="60%" stopColor="#f59e0b" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
              </radialGradient>

              <radialGradient id="heatGradientWarning" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.5" />
                <stop offset="80%" stopColor="#10b981" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Base Tile Layer */}
            <rect width="1000" height="700" fill="#0f172a" />
            <rect width="1000" height="700" fill="url(#gisGrid)" />

            {/* River feature (Kali Sukamaju) */}
            <path
              d="M 120 150 Q 300 300 420 420 T 750 620"
              fill="none"
              stroke="#0369a1"
              strokeWidth="16"
              strokeLinecap="round"
              opacity="0.75"
            />
            <text x="350" y="360" fill="#38bdf8" fontSize="11" fontStyle="italic" opacity="0.6">
              Aliran Sungai / Kali Sukamaju (Titik Rawan Genangan)
            </text>

            {/* Main Road Networks */}
            <path d="M 50 350 L 950 350" stroke="#334155" strokeWidth="10" strokeLinecap="round" />
            <path d="M 500 50 L 500 650" stroke="#334155" strokeWidth="8" strokeLinecap="round" />
            <path d="M 200 100 L 800 600" stroke="#1e293b" strokeWidth="6" />
            <path d="M 200 600 L 800 100" stroke="#1e293b" strokeWidth="6" />

            {/* Zone Polygons / Areas */}
            {zones.map((zone) => {
              const { x, y } = projectCoords(zone.coordinates.lat, zone.coordinates.lng);
              const isKLB = zone.riskLevel === 'bahaya_klb';
              const isWaspada = zone.riskLevel === 'waspada';
              const fillColor = isKLB ? '#ef4444' : isWaspada ? '#f59e0b' : '#10b981';

              return (
                <g key={zone.id} className="cursor-pointer" onClick={() => setSelectedEntity({ type: 'zone', data: zone })}>
                  {/* Zone boundary ellipse */}
                  <ellipse
                    cx={x}
                    cy={y}
                    rx="110"
                    ry="80"
                    fill={fillColor}
                    fillOpacity={showHeatmap ? '0.35' : '0.12'}
                    stroke={fillColor}
                    strokeWidth={isKLB ? '2.5' : '1.5'}
                    strokeDasharray={isKLB ? 'none' : '4 4'}
                  />

                  {/* Buffer Zone of 500 meters if KLB */}
                  {isKLB && showBufferRadius && (
                    <circle
                      cx={x}
                      cy={y}
                      r="140"
                      fill="url(#heatGradientKLB)"
                      stroke="#ef4444"
                      strokeWidth="1.5"
                      strokeDasharray="6 4"
                      className="animate-pulse"
                    />
                  )}

                  {/* Zone Label */}
                  <rect
                    x={x - 55}
                    y={y - 50}
                    width="110"
                    height="24"
                    rx="6"
                    fill="#0f172a"
                    fillOpacity="0.85"
                    stroke={fillColor}
                    strokeWidth="1"
                  />
                  <text
                    x={x}
                    y={y - 34}
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="10"
                    fontWeight="bold"
                  >
                    {zone.name} (ABJ: {zone.abj}%)
                  </text>
                </g>
              );
            })}

            {/* Inspections / Larvae Points */}
            {showLarvae &&
              filteredInspections.map((insp) => {
                const { x, y } = projectCoords(insp.coordinates.lat, insp.coordinates.lng);
                const hasLarvae = insp.status !== 'bebas_jentik';

                return (
                  <g
                    key={insp.id}
                    className="cursor-pointer"
                    onClick={() => setSelectedEntity({ type: 'larva', data: insp })}
                  >
                    <circle
                      cx={x}
                      cy={y}
                      r={hasLarvae ? '7' : '5'}
                      fill={hasLarvae ? '#f97316' : '#10b981'}
                      stroke="#ffffff"
                      strokeWidth="1.5"
                    />
                    {hasLarvae && (
                      <circle
                        cx={x}
                        cy={y}
                        r="14"
                        fill="none"
                        stroke="#f97316"
                        strokeWidth="1"
                        opacity="0.6"
                      />
                    )}
                  </g>
                );
              })}

            {/* Active Dengue Cases */}
            {showCases &&
              filteredCases.map((c) => {
                const { x, y } = projectCoords(c.coordinates.lat, c.coordinates.lng);
                const isICU = c.diagnosis.includes('DSS') || c.diagnosis.includes('III');

                return (
                  <g
                    key={c.id}
                    className="cursor-pointer group"
                    onClick={() => setSelectedEntity({ type: 'case', data: c })}
                  >
                    {/* Pulsing hazard ring */}
                    <circle
                      cx={x}
                      cy={y}
                      r={isICU ? '16' : '12'}
                      fill="#ef4444"
                      fillOpacity="0.3"
                      className="animate-ping"
                    />
                    {/* Case Pin Marker */}
                    <circle
                      cx={x}
                      cy={y}
                      r="8"
                      fill="#dc2626"
                      stroke="#ffffff"
                      strokeWidth="2"
                    />
                    <text
                      x={x}
                      y={y + 3}
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize="8"
                      fontWeight="bold"
                    >
                      !
                    </text>

                    {/* Patient Initials Tag */}
                    <text
                      x={x}
                      y={y + 20}
                      textAnchor="middle"
                      fill="#fca5a5"
                      fontSize="9"
                      fontWeight="bold"
                    >
                      {c.patientInitials}
                    </text>
                  </g>
                );
              })}

            {/* Fogging Teams Scheduled Targets */}
            {showFogging &&
              cases
                .filter((c) => c.foggingScheduled)
                .map((c) => {
                  const { x, y } = projectCoords(c.coordinates.lat, c.coordinates.lng);
                  return (
                    <g key={`fog-${c.id}`} transform={`translate(${x + 12}, ${y - 12})`}>
                      <circle cx="0" cy="0" r="9" fill="#9333ea" stroke="#ffffff" strokeWidth="1.5" />
                      <path
                        d="M -4 -2 L 4 -2 M -2 0 L 2 0 M -3 2 L 3 2"
                        stroke="#ffffff"
                        strokeWidth="1.2"
                      />
                    </g>
                  );
                })}

            {/* Healthcare Facilities (Puskesmas & RSUD) */}
            {showFacilities &&
              facilities.map((f) => {
                const { x, y } = projectCoords(f.coordinates.lat, f.coordinates.lng);
                const isRS = f.type === 'Rumah Sakit';

                return (
                  <g
                    key={f.id}
                    className="cursor-pointer"
                    onClick={() => setSelectedEntity({ type: 'faskes', data: f })}
                  >
                    <rect
                      x={x - 14}
                      y={y - 14}
                      width="28"
                      height="28"
                      rx="7"
                      fill={isRS ? '#0284c7' : '#0d9488'}
                      stroke="#ffffff"
                      strokeWidth="2"
                      className="shadow-lg"
                    />
                    {/* Red Cross / Hospital symbol */}
                    <path
                      d={`M ${x - 4} ${y} L ${x + 4} ${y} M ${x} ${y - 4} L ${x} ${y + 4}`}
                      stroke="#ffffff"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    <text
                      x={x}
                      y={y + 24}
                      textAnchor="middle"
                      fill="#38bdf8"
                      fontSize="9"
                      fontWeight="bold"
                    >
                      {f.name.split(' ')[0]} {f.name.split(' ')[1]}
                    </text>
                  </g>
                );
              })}
          </g>
        </svg>
      </div>

      {/* Selected Entity Card Detail Drawer */}
      {selectedEntity && (
        <div className="bg-white rounded-2xl border-2 border-teal-500/40 p-4 sm:p-5 shadow-lg relative animate-in fade-in slide-in-from-bottom-2">
          <button
            onClick={() => setSelectedEntity(null)}
            className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 p-1"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Case Detail Popup */}
          {selectedEntity.type === 'case' && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="p-2 bg-red-100 text-red-700 rounded-xl">
                  <ShieldAlert className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    Kasus DBD: {selectedEntity.data.patientInitials} ({selectedEntity.data.age} th)
                  </h3>
                  <p className="text-xs text-red-600 font-bold">
                    {selectedEntity.data.diagnosis} | Demam Hari ke-{selectedEntity.data.feverDay}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-slate-50 p-3 rounded-xl">
                <div>
                  <p className="text-slate-500 font-medium">Alamat:</p>
                  <p className="font-bold text-slate-800">{selectedEntity.data.address}, {selectedEntity.data.rtRw}</p>
                </div>
                <div>
                  <p className="text-slate-500 font-medium">Faskes Rawat:</p>
                  <p className="font-bold text-slate-800">{selectedEntity.data.faskesName}</p>
                </div>
                <div>
                  <p className="text-slate-500 font-medium">Trombosit / Hematokrit:</p>
                  <p className="font-bold text-red-600">
                    {selectedEntity.data.plateletCount ? `${selectedEntity.data.plateletCount.toLocaleString()} /uL` : '-'} | Ht: {selectedEntity.data.hematocrit}%
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t text-xs">
                <span className="text-slate-500">
                  Fogging Fokus: <strong>{selectedEntity.data.foggingScheduled ? `Terjadwal (${selectedEntity.data.foggingDate})` : 'Belum Dijadwalkan'}</strong>
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={onOpenSos}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold px-3 py-1.5 rounded-lg shadow-xs"
                  >
                    Bantuan Darurat SOS
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Faskes Facility Popup */}
          {selectedEntity.type === 'faskes' && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="p-2 bg-cyan-100 text-cyan-700 rounded-xl">
                  <Building2 className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-base font-black text-slate-900">{selectedEntity.data.name}</h3>
                  <p className="text-xs text-slate-500">{selectedEntity.data.address} | Hotline: {selectedEntity.data.phone}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                  <span className="text-emerald-700 font-medium">Bed Khusus DBD:</span>
                  <p className="text-lg font-black text-emerald-900">
                    {selectedEntity.data.availableBeds} / {selectedEntity.data.dengueBedCapacity} <span className="text-xs font-normal">Tersedia</span>
                  </p>
                </div>
                <div className="bg-cyan-50 p-2.5 rounded-xl border border-cyan-200">
                  <span className="text-cyan-700 font-medium">Stok Bubuk Abate:</span>
                  <p className="text-lg font-black text-cyan-900">{selectedEntity.data.abateStockKg} Kg</p>
                </div>
                <div className="bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                  <span className="text-amber-700 font-medium">RDT NS1 Test Kits:</span>
                  <p className="text-lg font-black text-amber-900">{selectedEntity.data.rdtDengueStock} Set</p>
                </div>
                <div className="bg-rose-50 p-2.5 rounded-xl border border-rose-200">
                  <span className="text-rose-700 font-medium">Kantong Trombosit:</span>
                  <p className="text-lg font-black text-rose-900">{selectedEntity.data.bloodPlateletStock} Kantong</p>
                </div>
              </div>
            </div>
          )}

          {/* Zone Detail Popup */}
          {selectedEntity.type === 'zone' && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span
                  className={`p-2 rounded-xl text-white ${
                    selectedEntity.data.riskLevel === 'bahaya_klb'
                      ? 'bg-red-600'
                      : selectedEntity.data.riskLevel === 'waspada'
                      ? 'bg-amber-500'
                      : 'bg-emerald-600'
                  }`}
                >
                  <MapPin className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-base font-black text-slate-900">{selectedEntity.data.name}</h3>
                  <p className="text-xs text-slate-600">
                    {selectedEntity.data.kelurahan} | Status: <strong className="uppercase">{selectedEntity.data.riskLevel.replace('_', ' ')}</strong>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="bg-slate-50 p-2.5 rounded-lg">
                  <p className="text-slate-500">Angka Bebas Jentik (ABJ):</p>
                  <p className="text-base font-black text-slate-900">{selectedEntity.data.abj}%</p>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-lg">
                  <p className="text-slate-500">House Index (HI):</p>
                  <p className="text-base font-black text-slate-900">{selectedEntity.data.houseIndex}%</p>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-lg">
                  <p className="text-slate-500">Breteau Index (BI):</p>
                  <p className="text-base font-black text-slate-900">{selectedEntity.data.breteauIndex}</p>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-lg">
                  <p className="text-slate-500">Kasus DBD Aktif:</p>
                  <p className="text-base font-black text-red-600">{selectedEntity.data.activeCases} Pasien</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
