import { useState, useEffect, useCallback, useRef } from 'react';

export interface UserLocationState {
  lat: number;
  lng: number;
  accuracy: number | null;
  altitude: number | null;
  heading: number | null;
  speed: number | null;
  timestamp: number;
  addressName: string;
  isLive: boolean;
  status: 'idle' | 'locating' | 'locked' | 'denied' | 'error';
  errorMessage: string | null;
}

// Default fallback location (Jakarta Pusat / Kemendagri / Gambir area)
const DEFAULT_LOCATION = {
  lat: -6.2100,
  lng: 106.8480,
  addressName: 'Kelurahan Sukamaju, Jakarta',
};

export function useLiveLocation() {
  const [location, setLocation] = useState<UserLocationState>({
    lat: DEFAULT_LOCATION.lat,
    lng: DEFAULT_LOCATION.lng,
    accuracy: 15,
    altitude: null,
    heading: null,
    speed: null,
    timestamp: Date.now(),
    addressName: DEFAULT_LOCATION.addressName,
    isLive: false,
    status: 'idle',
    errorMessage: null,
  });

  const watchIdRef = useRef<number | null>(null);
  const isFetchingAddress = useRef<boolean>(false);

  // Reverse geocoding helper using OSM Nominatim
  const fetchAddress = useCallback(async (lat: number, lng: number) => {
    if (isFetchingAddress.current) return;
    isFetchingAddress.current = true;
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        { headers: { 'Accept-Language': 'id, en' } }
      );
      if (response.ok) {
        const data = await response.json();
        const addr = data.address || {};
        const road = addr.road || addr.pedestrian || addr.street || addr.village || '';
        const suburb = addr.suburb || addr.neighbourhood || addr.quarter || addr.city_district || '';
        const city = addr.city || addr.town || addr.municipality || addr.county || '';
        
        const full = [road, suburb, city].filter(Boolean).join(', ');
        if (full) {
          setLocation((prev) => ({ ...prev, addressName: full }));
        } else if (data.display_name) {
          setLocation((prev) => ({ ...prev, addressName: data.display_name.split(',').slice(0, 3).join(',') }));
        }
      }
    } catch {
      // Fallback gracefully
    } finally {
      isFetchingAddress.current = false;
    }
  }, []);

  const startWatchingLocation = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setLocation((prev) => ({
        ...prev,
        status: 'error',
        errorMessage: 'Perangkat atau browser Anda tidak mendukung fitur GPS.',
      }));
      return;
    }

    setLocation((prev) => ({ ...prev, status: 'locating', errorMessage: null }));

    // Request immediate position first
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude, accuracy, altitude, heading, speed } = pos.coords;
        setLocation((prev) => ({
          ...prev,
          lat: latitude,
          lng: longitude,
          accuracy: accuracy || 10,
          altitude,
          heading,
          speed,
          timestamp: pos.timestamp,
          isLive: true,
          status: 'locked',
          errorMessage: null,
        }));
        fetchAddress(latitude, longitude);
      },
      (err) => {
        let msg = 'Gagal mendeteksi lokasi GPS HP.';
        if (err.code === err.PERMISSION_DENIED) {
          msg = 'Izin akses lokasi GPS ditolak oleh browser/HP. Aktifkan izin lokasi.';
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          msg = 'Sinyal GPS tidak tersedia saat ini.';
        } else if (err.code === err.TIMEOUT) {
          msg = 'Waktu pencarian sinyal GPS habis (timeout).';
        }
        setLocation((prev) => ({
          ...prev,
          status: err.code === err.PERMISSION_DENIED ? 'denied' : 'error',
          errorMessage: msg,
        }));
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      }
    );

    // Then start continuous high-accuracy watch
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
    }

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude, accuracy, altitude, heading, speed } = pos.coords;
        setLocation((prev) => ({
          ...prev,
          lat: latitude,
          lng: longitude,
          accuracy: accuracy || 10,
          altitude,
          heading,
          speed,
          timestamp: pos.timestamp,
          isLive: true,
          status: 'locked',
          errorMessage: null,
        }));
      },
      (err) => {
        console.warn('Geolocation watch error:', err);
      },
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 5000,
      }
    );
  }, [fetchAddress]);

  const stopWatchingLocation = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setLocation((prev) => ({ ...prev, isLive: false }));
  }, []);

  const setManualLocation = useCallback((lat: number, lng: number, name?: string) => {
    setLocation((prev) => ({
      ...prev,
      lat,
      lng,
      accuracy: 10,
      isLive: false,
      status: 'locked',
      addressName: name || `Koordinat (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
      errorMessage: null,
    }));
    fetchAddress(lat, lng);
  }, [fetchAddress]);

  useEffect(() => {
    startWatchingLocation();
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, [startWatchingLocation]);

  return {
    location,
    startWatchingLocation,
    stopWatchingLocation,
    setManualLocation,
    refreshLocation: startWatchingLocation,
  };
}
