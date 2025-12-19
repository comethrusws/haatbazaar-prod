'use client';

import React, { useEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png',
});

export type Location = {
  lat: number;
  lng: number;
};

type Props = {
  defaultLocation: Location;
  onChange: (location: Location) => void;
  gpsCoords: Location | null;
};

export default function LocationPicker({ defaultLocation, onChange, gpsCoords }: Props) {
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [mapId] = useState(() => `map-${Math.random().toString(36).substring(7)}`);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    // Initialize map
    const map = L.map(containerRef.current).setView(
      [defaultLocation.lat, defaultLocation.lng],
      6
    );

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // Add draggable marker
    const marker = L.marker([defaultLocation.lat, defaultLocation.lng], {
      draggable: true
    }).addTo(map);

    marker.on('dragend', () => {
      const pos = marker.getLatLng();
      onChange({ lat: pos.lat, lng: pos.lng });
    });

    map.on('click', (e) => {
      marker.setLatLng(e.latlng);
      onChange({ lat: e.latlng.lat, lng: e.latlng.lng });
    });

    mapRef.current = map;
    markerRef.current = marker;

    return () => {
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
  }, []);

  // Update marker position when GPS coords change
  useEffect(() => {
    if (gpsCoords && markerRef.current && mapRef.current) {
      markerRef.current.setLatLng([gpsCoords.lat, gpsCoords.lng]);
      mapRef.current.setView([gpsCoords.lat, gpsCoords.lng], 13);
    }
  }, [gpsCoords]);

  return (
    <div
      id={mapId}
      ref={containerRef}
      className="w-full h-[200px] rounded-lg overflow-hidden border"
    />
  );
}