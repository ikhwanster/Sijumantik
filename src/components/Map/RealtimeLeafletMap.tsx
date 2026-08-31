import React, { useEffect, useRef, useState, useMemo } from 'react';
import L from 'leaflet';
import { 
  Navigation, 
  Locate, 
  MapPin, 
  Layers, 
  Building2, 
  Flame, 
  ShieldAlert, 
  Compass, 
  AlertTriangle, 
  PhoneCall, 
  Wind, 
  Radio, 
  CheckCircle2,
  X,
  RefreshCw,
  Search,
  Crosshair,
  Maximize2
} from 'lucide-react';
import { AreaZone, DengueCaseReport, FaskesFacility, HomeInspectionRecord } from '../../types/jumantik';
import { UserLocationState } from '../../hooks/useLiveLocation';

interface RealtimeLeafletMapProps {
  userLocation: UserLocationState;
  onRefreshLocation: () => void;
  onSelectManualCity: (lat: number, lng: number, name: string) => void;
  zones: AreaZone[];
  cases: DengueCaseReport[];
  facilities: FaskesFacility[];
  inspections: HomeInspectionRecord[];
  onOpenSos?: () => void;
}

// Distance helper
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): { km: number; text: string } {
  const R = 6371; // Radius of earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const km = R * c;
  if (km < 1) {
    return { km, text: `${Math.round(km * 1000)} meter` };
  }
  return { km, text: `${km.toFixed(1)} km` };
}

// City presets for instant testing/demonstration across Indonesia
const INDONESIA_PRESETS = [
  { name: '📍 Posisi HP Saya (Realtime)', lat: 0, lng: 0, isCurrent: true },
  { name: '🏢 Jakarta Pusat (Kel. Sukamaju)', lat: -6.2100, lng: 106.8480 },
  { name: '🌸 Bandung (Coblong/Dago)', lat: -6.8915, lng: 107.6107 },
  { name: '🚢 Surabaya (Gubeng/Wonokromo)', lat: -7.2756, lng: 112.7544 },
  { name: '🌋 Yogyakarta (Malioboro/Kotabaru)', lat: -7.7928, lng: 110.3658 },
  { name: '🌴 Denpasar Bali (Sanur/Renon)', lat: -8.6705, lng: 115.2126 },
  { name: '⛰️ Medan (Medan Baru/Petisah)', lat: 3.5852, lng: 98.6756 },
  { name: '🌊 Makassar (Ujung Pandang/Panakkukang)', lat: -5.1477, lng: 119.4327 },
];

export const RealtimeLeafletMap: React.FC<RealtimeLeafletMapProps> = ({
  userLocation,
  onRefreshLocation,
  onSelectManualCity,
  zones,
  cases,
  facilities,
  inspections,
  onOpenSos,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const userAccuracyCircleRef = useRef<L.Circle | null>(null);

  // Layer filters
  const [showCases, setShowCases] = useState(true);
  const [showLarvae, setShowLarvae] = useState(true);
  const [showFacilities, setShowFacilities] = useState(true);
  const [showFogging, setShowFogging] = useState(true);
  const [showBuffer500m, setShowBuffer500m] = useState(true);
  const [mapTileType, setMapTileType] = useState<'streets' | 'satellite' | 'topo'>('streets');
  const [selectedEntity, setSelectedEntity] = useState<any>(null);

  // Calculate nearest facility from user's current GPS location
  const nearestFacility = useMemo(() => {
    if (!facilities.length || !userLocation) return null;
    let minFac = facilities[0];
    let minDist = calculateDistance(
      userLocation.lat,
      userLocation.lng,
      facilities[0].coordinates.lat,
      facilities[0].coordinates.lng
    );

    for (let i = 1; i < facilities.length; i++) {
      const dist = calculateDistance(
        userLocation.lat,
        userLocation.lng,
        facilities[i].coordinates.lat,
        facilities[i].coordinates.lng
      );
      if (dist.km < minDist.km) {
        minDist = dist;
        minFac = facilities[i];
      }
    }
    return { facility: minFac, distance: minDist.text, distanceKm: minDist.km };
  }, [facilities, userLocation]);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [userLocation.lat, userLocation.lng],
      zoom: 15,
      zoomControl: false,
    });

    // Add high quality tile layer
    const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors | SiJumantik GIS',
      maxZoom: 19,
    });
    tileLayer.addTo(map);

    // Zoom control on bottom right
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    const layerGroup = L.layerGroup().addTo(map);
    layerGroupRef.current = layerGroup;
    mapInstanceRef.current = map;

    // Handle container resize
    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });
    resizeObserver.observe(mapContainerRef.current);

    return () => {
      resizeObserver.disconnect();
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Tile Layer if changed
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    map.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        map.removeLayer(layer);
      }
    });

    let url = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    let attribution = '&copy; OpenStreetMap | SiJumantik';

    if (mapTileType === 'satellite') {
      url = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      attribution = 'Tiles &copy; Esri, Earthstar Geographics';
    } else if (mapTileType === 'topo') {
      url = 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';
      attribution = 'Map data: &copy; OpenStreetMap, SRTM | Map style: &copy; OpenTopoMap';
    }

    L.tileLayer(url, { attribution, maxZoom: 19 }).addTo(map);
  }, [mapTileType]);

  // Update Markers and Elements on Map
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layerGroup = layerGroupRef.current;
    if (!map || !layerGroup) return;

    layerGroup.clearLayers();

    // 1. User Live Phone Location Marker with pulsing radar ring
    const userIcon = L.divIcon({
      className: 'custom-user-live-pin',
      html: `
        <div class="relative flex items-center justify-center w-10 h-10 -ml-5 -mt-5 cursor-pointer">
          <div class="absolute w-10 h-10 rounded-full bg-blue-500/30 animate-ping"></div>
          <div class="absolute w-8 h-8 rounded-full bg-blue-500/50 animate-pulse"></div>
          <div class="relative w-5 h-5 rounded-full bg-blue-600 border-2 border-white shadow-lg flex items-center justify-center text-white">
            <span class="w-2 h-2 rounded-full bg-white animate-pulse"></span>
          </div>
          <div class="absolute -bottom-6 whitespace-nowrap bg-blue-900 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-md border border-blue-400">
            📱 Posisi HP Anda
          </div>
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 20],
    });

    const userMarker = L.marker([userLocation.lat, userLocation.lng], {
      icon: userIcon,
      zIndexOffset: 1000,
    });

    userMarker.on('click', () => {
      setSelectedEntity({
        type: 'user',
        data: {
          ...userLocation,
          title: 'Lokasi Perangkat HP Anda',
        },
      });
    });

    layerGroup.addLayer(userMarker);
    userMarkerRef.current = userMarker;

    // Accuracy Circle
    if (userLocation.accuracy && userLocation.accuracy > 0) {
      const accuracyCircle = L.circle([userLocation.lat, userLocation.lng], {
        radius: Math.max(userLocation.accuracy, 20),
        color: '#3b82f6',
        weight: 1.5,
        opacity: 0.8,
        fillColor: '#60a5fa',
        fillOpacity: 0.15,
      });
      layerGroup.addLayer(accuracyCircle);
      userAccuracyCircleRef.current = accuracyCircle;
    }

    // Dynamic shift of default mock data around user's live coordinates so they are always relevant nearby!
    const baseLat = userLocation.lat;
    const baseLng = userLocation.lng;

    // 2. Zone Boundaries & Hotspots (Relative or absolute)
    zones.forEach((zone, idx) => {
      // Calculate local offset around user location for realistic localized map
      const zoneLat = baseLat + (zone.coordinates.lat - (-6.2100));
      const zoneLng = baseLng + (zone.coordinates.lng - 106.8480);
      const isKLB = zone.riskLevel === 'bahaya_klb';
      const isWaspada = zone.riskLevel === 'waspada';
      const color = isKLB ? '#ef4444' : isWaspada ? '#f59e0b' : '#10b981';

      const zoneCircle = L.circle([zoneLat, zoneLng], {
        radius: 350,
        color,
        weight: isKLB ? 2.5 : 1.5,
        dashArray: isKLB ? undefined : '5, 5',
        fillColor: color,
        fillOpacity: isKLB ? 0.2 : 0.08,
      });

      zoneCircle.on('click', () => {
        setSelectedEntity({
          type: 'zone',
          data: {
            ...zone,
            calculatedLat: zoneLat,
            calculatedLng: zoneLng,
          },
        });
      });

      layerGroup.addLayer(zoneCircle);
    });

    // 3. Active Dengue Cases (Kasus DBD)
    if (showCases) {
      cases.forEach((c) => {
        const cLat = baseLat + (c.coordinates.lat - (-6.2100));
        const cLng = baseLng + (c.coordinates.lng - 106.8480);
        const dist = calculateDistance(userLocation.lat, userLocation.lng, cLat, cLng);

        // 500m Hazard buffer circle if enabled
        if (showBuffer500m) {
          const bufferCircle = L.circle([cLat, cLng], {
            radius: 500,
            color: '#ef4444',
            weight: 1,
            dashArray: '4, 4',
            fillColor: '#fee2e2',
            fillOpacity: 0.2,
          });
          layerGroup.addLayer(bufferCircle);
        }

        const caseIcon = L.divIcon({
          className: 'custom-case-pin',
          html: `
            <div class="relative flex items-center justify-center w-8 h-8 -ml-4 -mt-4 cursor-pointer group">
              <div class="absolute w-8 h-8 rounded-full bg-red-500/40 animate-ping"></div>
              <div class="w-6 h-6 rounded-full bg-red-600 border-2 border-white shadow-md flex items-center justify-center text-white text-[11px] font-black">
                !
              </div>
              <div class="absolute -bottom-4 whitespace-nowrap bg-red-950 text-red-200 text-[9px] font-bold px-1.5 py-0.2 rounded-sm shadow-xs border border-red-500">
                ${c.patientInitials} (${dist.text})
              </div>
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });

        const marker = L.marker([cLat, cLng], { icon: caseIcon });
        marker.on('click', () => {
          setSelectedEntity({
            type: 'case',
            data: { ...c, distanceText: dist.text, calculatedLat: cLat, calculatedLng: cLng },
          });
        });

        layerGroup.addLayer(marker);
      });
    }

    // 4. Healthcare Facilities (Puskesmas & Rumah Sakit)
    if (showFacilities) {
      facilities.forEach((f) => {
        const fLat = baseLat + (f.coordinates.lat - (-6.2100));
        const fLng = baseLng + (f.coordinates.lng - 106.8480);
        const dist = calculateDistance(userLocation.lat, userLocation.lng, fLat, fLng);
        const isRS = f.type === 'Rumah Sakit';

        const faskesIcon = L.divIcon({
          className: 'custom-faskes-pin',
          html: `
            <div class="relative flex items-center justify-center w-8 h-8 -ml-4 -mt-4 cursor-pointer">
              <div class="w-7 h-7 rounded-xl ${isRS ? 'bg-sky-600' : 'bg-teal-600'} border-2 border-white shadow-md flex items-center justify-center text-white text-xs font-black">
                🏥
              </div>
              <div class="absolute -bottom-4 whitespace-nowrap bg-slate-900 text-teal-300 text-[9px] font-bold px-1.5 py-0.2 rounded-sm shadow-xs border border-teal-500">
                ${f.name.split(' ')[0]} ${dist.text}
              </div>
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });

        const marker = L.marker([fLat, fLng], { icon: faskesIcon });
        marker.on('click', () => {
          setSelectedEntity({
            type: 'faskes',
            data: { ...f, distanceText: dist.text, calculatedLat: fLat, calculatedLng: fLng },
          });
        });

        layerGroup.addLayer(marker);
      });
    }

    // 5. Larvae Inspection findings (3M+)
    if (showLarvae) {
      inspections.forEach((insp) => {
        const iLat = baseLat + (insp.coordinates.lat - (-6.2100));
        const iLng = baseLng + (insp.coordinates.lng - 106.8480);
        const hasLarvae = insp.status !== 'bebas_jentik';

        const larvaIcon = L.divIcon({
          className: 'custom-larva-pin',
          html: `
            <div class="relative flex items-center justify-center w-6 h-6 -ml-3 -mt-3 cursor-pointer">
              <div class="w-5 h-5 rounded-full ${hasLarvae ? 'bg-amber-500 animate-bounce' : 'bg-emerald-600'} border-1.5 border-white shadow-sm flex items-center justify-center text-white text-[10px]">
                ${hasLarvae ? '🦟' : '✓'}
              </div>
            </div>
          `,
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        });

        const marker = L.marker([iLat, iLng], { icon: larvaIcon });
        marker.on('click', () => {
          setSelectedEntity({
            type: 'larva',
            data: { ...insp, calculatedLat: iLat, calculatedLng: iLng },
          });
        });

        layerGroup.addLayer(marker);
      });
    }

    // 6. Scheduled Fogging Teams
    if (showFogging) {
      cases
        .filter((c) => c.foggingScheduled)
        .forEach((c) => {
          const fogLat = baseLat + (c.coordinates.lat - (-6.2100)) + 0.001;
          const fogLng = baseLng + (c.coordinates.lng - 106.8480) + 0.001;

          const fogIcon = L.divIcon({
            className: 'custom-fog-pin',
            html: `
              <div class="relative flex items-center justify-center w-7 h-7 -ml-3.5 -mt-3.5 cursor-pointer">
                <div class="w-6 h-6 rounded-full bg-purple-600 border-2 border-white shadow-md flex items-center justify-center text-white text-xs">
                  💨
                </div>
              </div>
            `,
            iconSize: [28, 28],
            iconAnchor: [14, 14],
          });

          const marker = L.marker([fogLat, fogLng], { icon: fogIcon });
          marker.on('click', () => {
            setSelectedEntity({
              type: 'fogging',
              data: {
                title: `Jadwal Fogging Fokus: ${c.foggingDate}`,
                address: c.address,
                rtRw: c.rtRw,
                faskes: c.faskesName,
              },
            });
          });

          layerGroup.addLayer(marker);
        });
    }
  }, [
    userLocation,
    zones,
    cases,
    facilities,
    inspections,
    showCases,
    showLarvae,
    showFacilities,
    showFogging,
    showBuffer500m,
  ]);

  // Center map on user's current phone GPS coordinates
  const handleFlyToUser = () => {
    const map = mapInstanceRef.current;
    if (!map) return;
    map.flyTo([userLocation.lat, userLocation.lng], 16, {
      duration: 1.2,
    });
  };

  return (
    <div className="space-y-3">
      {/* Real-time GPS Live Status Bar */}
      <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-teal-950 text-white rounded-2xl p-3 sm:p-4 shadow-md border border-blue-700/50">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <span className="p-2.5 bg-blue-600 text-white rounded-xl inline-block shadow-md">
                <Locate className="w-5 h-5 animate-pulse" />
              </span>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 border-2 border-slate-900 rounded-full animate-ping" />
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-1.5">
                  <span>Peta Real-Time GPS HP Anda</span>
                  <span className="text-[11px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-bold">
                    🛰️ Sinyal GPS Aktif
                  </span>
                </h3>
              </div>
              <p className="text-xs text-blue-200 mt-0.5 line-clamp-1 font-medium">
                📍 {userLocation.addressName || 'Mendeteksi alamat sekitar Anda...'}
              </p>
              <div className="text-[11px] text-blue-300/80 flex items-center gap-2 mt-0.5">
                <span>Lat: {userLocation.lat.toFixed(5)}, Lng: {userLocation.lng.toFixed(5)}</span>
                <span>•</span>
                <span>Akurasi: ±{userLocation.accuracy ? Math.round(userLocation.accuracy) : 10} m</span>
              </div>
            </div>
          </div>

          {/* Quick Actions for GPS */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-end flex-wrap">
            <button
              onClick={handleFlyToUser}
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white px-3 py-2 rounded-xl text-xs font-bold shadow-md cursor-pointer transition-all active:scale-95"
              title="Pusatkan Peta ke Posisi HP Saya"
            >
              <Crosshair className="w-4 h-4" />
              <span>Pusatkan ke HP Saya</span>
            </button>

            <button
              onClick={onRefreshLocation}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-2 rounded-xl text-xs font-bold border border-slate-700 cursor-pointer transition-all active:scale-95"
              title="Perbarui Koordinat GPS HP"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Segarkan GPS</span>
            </button>
          </div>
        </div>

        {/* Nearest Healthcare Facility Banner */}
        {nearestFacility && (
          <div className="mt-3 pt-2.5 border-t border-blue-800/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="p-1 bg-teal-500/20 text-teal-300 rounded-lg">
                <Building2 className="w-3.5 h-3.5" />
              </span>
              <span className="text-slate-200">
                Faskes Terdekat dari HP: <strong className="text-teal-300">{nearestFacility.facility.name}</strong> ({nearestFacility.distance})
              </span>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={`tel:${nearestFacility.facility.phone}`}
                className="flex items-center gap-1 text-emerald-300 hover:text-emerald-200 bg-emerald-950/60 border border-emerald-600/50 px-2.5 py-1 rounded-lg font-bold"
              >
                <PhoneCall className="w-3 h-3" />
                <span>Hubungi: {nearestFacility.facility.phone}</span>
              </a>
              <button
                onClick={onOpenSos}
                className="bg-red-600 hover:bg-red-500 text-white px-2.5 py-1 rounded-lg font-black text-[11px]"
              >
                🚨 SOS 119
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Map Control Bar & Presets */}
      <div className="bg-white rounded-2xl border border-slate-200 p-3 shadow-xs space-y-2.5">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-2.5">
          {/* Preset Location Switcher */}
          <div className="flex items-center gap-2 w-full lg:w-auto">
            <span className="text-xs font-bold text-slate-600 whitespace-nowrap flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-rose-500" />
              <span>Uji Kota / Lokasi:</span>
            </span>
            <select
              onChange={(e) => {
                const selected = INDONESIA_PRESETS[Number(e.target.value)];
                if (selected.isCurrent) {
                  onRefreshLocation();
                  handleFlyToUser();
                } else {
                  onSelectManualCity(selected.lat, selected.lng, selected.name);
                  const map = mapInstanceRef.current;
                  if (map) map.flyTo([selected.lat, selected.lng], 15);
                }
              }}
              className="text-xs bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 font-bold text-slate-800 focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
            >
              {INDONESIA_PRESETS.map((p, idx) => (
                <option key={p.name} value={idx}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Tile Type & Layer Toggles */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200">
              <button
                onClick={() => setMapTileType('streets')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  mapTileType === 'streets' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                }`}
              >
                Jalan (OSM)
              </button>
              <button
                onClick={() => setMapTileType('satellite')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  mapTileType === 'satellite' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                }`}
              >
                Satelit
              </button>
            </div>

            <button
              onClick={() => setShowCases(!showCases)}
              className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 border transition-all ${
                showCases
                  ? 'bg-red-50 text-red-700 border-red-200'
                  : 'bg-slate-50 text-slate-400 border-slate-200'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-red-600" />
              <span>Kasus DBD ({cases.length})</span>
            </button>

            <button
              onClick={() => setShowFacilities(!showFacilities)}
              className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 border transition-all ${
                showFacilities
                  ? 'bg-cyan-50 text-cyan-700 border-cyan-200'
                  : 'bg-slate-50 text-slate-400 border-slate-200'
              }`}
            >
              <Building2 className="w-3 h-3" />
              <span>Faskes ({facilities.length})</span>
            </button>

            <button
              onClick={() => setShowLarvae(!showLarvae)}
              className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 border transition-all ${
                showLarvae
                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                  : 'bg-slate-50 text-slate-400 border-slate-200'
              }`}
            >
              <span>🦟 Sarang Jentik</span>
            </button>

            <button
              onClick={() => setShowBuffer500m(!showBuffer500m)}
              className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 border transition-all ${
                showBuffer500m
                  ? 'bg-rose-900 text-rose-100 border-rose-700'
                  : 'bg-slate-50 text-slate-400 border-slate-200'
              }`}
            >
              <span>Radius Bahaya 500m</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Interactive Leaflet Map Container */}
      <div className="relative w-full h-[520px] sm:h-[580px] rounded-2xl overflow-hidden border-2 border-slate-300 shadow-md bg-slate-100">
        <div ref={mapContainerRef} className="w-full h-full z-10" />

        {/* Floating Quick Action Button on Top-Right */}
        <div className="absolute top-3 right-3 z-[400] flex flex-col gap-2">
          <button
            onClick={handleFlyToUser}
            className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl shadow-xl flex items-center justify-center active:scale-90 transition-all border-2 border-white"
            title="Lacak & Pusatkan Posisi HP Sekarang"
          >
            <Locate className="w-5 h-5 animate-pulse" />
          </button>
        </div>

        {/* Map Legend Overlay at Bottom-Left */}
        <div className="absolute bottom-3 left-3 z-[400] bg-slate-900/90 backdrop-blur-md p-2.5 rounded-xl border border-slate-700 text-white text-[11px] space-y-1 hidden sm:block pointer-events-none shadow-lg">
          <p className="font-extrabold text-slate-300 uppercase tracking-wider text-[10px]">Legenda Peta:</p>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-500 border border-white" />
            <span>Posisi HP Anda (GPS Real-time)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-600" />
            <span>Titik Kasus Positif DBD</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm bg-teal-600" />
            <span>Puskesmas / Rumah Sakit</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-500" />
            <span>Temuan Sarang Jentik Positif</span>
          </div>
        </div>
      </div>

      {/* Selected Entity Card Detail Drawer */}
      {selectedEntity && (
        <div className="bg-white rounded-2xl border-2 border-blue-500/40 p-4 sm:p-5 shadow-xl relative animate-in fade-in slide-in-from-bottom-3">
          <button
            onClick={() => setSelectedEntity(null)}
            className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* User Location Detail */}
          {selectedEntity.type === 'user' && (
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <span className="p-2.5 bg-blue-100 text-blue-700 rounded-xl">
                  <Locate className="w-6 h-6" />
                </span>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    Posisi HP Anda Saat Ini (GPS Real-Time)
                  </h3>
                  <p className="text-xs text-blue-600 font-bold">
                    {userLocation.addressName || 'Alamat Terdeteksi Otomatis'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs bg-slate-50 p-3 rounded-xl">
                <div>
                  <p className="text-slate-500">Garis Lintang (Lat):</p>
                  <p className="font-bold text-slate-900">{userLocation.lat.toFixed(6)}</p>
                </div>
                <div>
                  <p className="text-slate-500">Garis Bujur (Lng):</p>
                  <p className="font-bold text-slate-900">{userLocation.lng.toFixed(6)}</p>
                </div>
                <div>
                  <p className="text-slate-500">Akurasi GPS:</p>
                  <p className="font-bold text-emerald-600">±{Math.round(userLocation.accuracy || 10)} meter</p>
                </div>
                <div>
                  <p className="text-slate-500">Status Sinyal:</p>
                  <p className="font-bold text-blue-600">Live Terkunci 🛰️</p>
                </div>
              </div>
            </div>
          )}

          {/* Case Detail Popup */}
          {selectedEntity.type === 'case' && (
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <span className="p-2.5 bg-red-100 text-red-700 rounded-xl">
                  <ShieldAlert className="w-6 h-6" />
                </span>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    Kasus DBD: {selectedEntity.data.patientInitials} ({selectedEntity.data.age} th)
                  </h3>
                  <p className="text-xs text-red-600 font-bold">
                    {selectedEntity.data.diagnosis} • Berjarak {selectedEntity.data.distanceText} dari HP Anda
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
                <button
                  onClick={onOpenSos}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold px-3 py-1.5 rounded-lg shadow-xs cursor-pointer"
                >
                  Bantuan Darurat SOS
                </button>
              </div>
            </div>
          )}

          {/* Faskes Facility Popup */}
          {selectedEntity.type === 'faskes' && (
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <span className="p-2.5 bg-cyan-100 text-cyan-700 rounded-xl">
                  <Building2 className="w-6 h-6" />
                </span>
                <div>
                  <h3 className="text-base font-black text-slate-900">{selectedEntity.data.name}</h3>
                  <p className="text-xs text-teal-600 font-bold">
                    Jarak: {selectedEntity.data.distanceText} dari HP Anda • {selectedEntity.data.address}
                  </p>
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

              <div className="flex items-center justify-end gap-2 pt-2 border-t">
                <a
                  href={`tel:${selectedEntity.data.phone}`}
                  className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 shadow-xs"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Telepon {selectedEntity.data.phone}</span>
                </a>
              </div>
            </div>
          )}

          {/* Larvae finding popup */}
          {selectedEntity.type === 'larva' && (
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <span className={`p-2.5 rounded-xl ${selectedEntity.data.status !== 'bebas_jentik' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
                  <Flame className="w-6 h-6" />
                </span>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    Pemeriksaan Jumantik: {selectedEntity.data.houseAddress}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Inspektor: {selectedEntity.data.inspectorName} • RT {selectedEntity.data.rt} / RW {selectedEntity.data.rw}
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl text-xs space-y-1.5">
                <p className="font-bold text-slate-800">
                  Status: {selectedEntity.data.status === 'bebas_jentik' ? '🟢 Bebas Jentik (Bersih)' : '🔴 Ditemukan Positif Jentik Nyamuk'}
                </p>
                <p className="text-slate-600">
                  Wadah Diperiksa: {selectedEntity.data.containersChecked} buah | Positif Jentik: {selectedEntity.data.containersPositive} buah
                </p>
              </div>
            </div>
          )}

          {/* Zone Detail Popup */}
          {selectedEntity.type === 'zone' && (
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <span
                  className={`p-2.5 rounded-xl text-white ${
                    selectedEntity.data.riskLevel === 'bahaya_klb'
                      ? 'bg-red-600'
                      : selectedEntity.data.riskLevel === 'waspada'
                      ? 'bg-amber-500'
                      : 'bg-emerald-600'
                  }`}
                >
                  <MapPin className="w-6 h-6" />
                </span>
                <div>
                  <h3 className="text-base font-black text-slate-900">{selectedEntity.data.name}</h3>
                  <p className="text-xs text-slate-600">
                    {selectedEntity.data.kelurahan} • Status: <strong className="uppercase">{selectedEntity.data.riskLevel.replace('_', ' ')}</strong>
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
