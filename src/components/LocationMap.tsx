'use client';

import React, { useEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

export type MapProps = {
  location: [number, number];
};

export default function LocationMap({ location }: MapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [mapId] = useState(() => `map-view-${Math.random().toString(36).substring(7)}`);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    // Initialize map
    const map = L.map(containerRef.current, {
      zoomControl: false,
      scrollWheelZoom: false,
      dragging: false,
      attributionControl: false
    }).setView(
      location,
      13
    );

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

    // Add marker
    L.marker(location).addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []); // Run once on mount

  // Update view if location prop changes
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setView(location, 13);
      // Clear existing markers and add new one
      mapRef.current.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          layer.remove();
        }
      });
      L.marker(location).addTo(mapRef.current);
    }
  }, [location[0], location[1]]);

  return (
    <div
      id={mapId}
      ref={containerRef}
      className="w-full h-full rounded-lg overflow-hidden"
    />
  );
}
