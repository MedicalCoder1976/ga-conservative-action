// @ts-nocheck
'use client';

import React, { useEffect, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';

// Import Leaflet CSS
import 'leaflet/dist/leaflet.css';

// Dynamic imports with proper typing
const DynamicMapContainer = dynamic(async () => {
  const { MapContainer } = await import('react-leaflet');
  return MapContainer;
}, { ssr: false });

const DynamicTileLayer = dynamic(async () => {
  const { TileLayer } = await import('react-leaflet');
  return TileLayer;
}, { ssr: false });

const DynamicGeoJSON = dynamic(async () => {
  const { GeoJSON } = await import('react-leaflet');
  return GeoJSON;
}, { ssr: false });

interface DriftData {
  [key: string]: { drift_pct: number };
}

interface GeorgiaCountyMapLeafletProps {
  onCountyClick?: (county: string) => void;
}

export default function GeorgiaCountyMapLeaflet({ onCountyClick }: GeorgiaCountyMapLeafletProps) {
  const [driftData, setDriftData] = useState<DriftData>({});
  const [geoData, setGeoData] = useState<any>(null);
  const [hoveredCounty, setHoveredCounty] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const geoJsonLayerRef = React.useRef<any>(null);

  // Fetch drift data from API
  useEffect(() => {
    const fetchDriftData = async () => {
      try {
        const response = await fetch('/api/voter-drift?year=2026');
        if (!response.ok) throw new Error('Failed to fetch drift data');
        const data = await response.json();
        setDriftData(data);
      } catch (err) {
        console.error('Error fetching drift data:', err);
      }
    };

    fetchDriftData();
  }, []);

  // Fetch GeoJSON data
  useEffect(() => {
    const fetchGeoData = async () => {
      try {
        const response = await fetch('/georgia-counties-simplified.geojson');
        if (!response.ok) throw new Error('Failed to fetch map data');
        const data = await response.json();
        setGeoData(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching GeoJSON:', err);
        setError('Failed to load map data');
        setLoading(false);
      }
    };

    fetchGeoData();
  }, []);

  // Get color based on drift percentage
  const getColor = useCallback((countyName: string): string => {
    const data = driftData[countyName];
    if (!data) return '#dcfce7'; // Light green - no data

    const drift = data.drift_pct;

    // Green = Baseline (±0.5%)
    if (drift >= -0.5 && drift <= 0.5) return '#22c55e';

    // Red shades = Republican gains
    if (drift > 0.5 && drift <= 3) return '#fca5a5';
    if (drift > 3 && drift <= 6) return '#ef4444';
    if (drift > 6 && drift <= 10) return '#dc2626';
    if (drift > 10) return '#7f1d1d';

    // Blue shades = Democratic gains
    if (drift < -0.5 && drift >= -3) return '#93c5fd';
    if (drift < -3 && drift >= -6) return '#3b82f6';
    if (drift < -6 && drift >= -10) return '#1d4ed8';
    if (drift < -10) return '#1e40af';

    return '#dcfce7';
  }, [driftData]);

  const getDriftLabel = (drift: number): string => {
    if (drift >= -0.5 && drift <= 0.5) return 'Baseline';
    return `${drift > 0 ? '+' : ''}${drift.toFixed(1)}%`;
  };

  // Handle GeoJSON features
  const onEachFeature = useCallback((feature: any, layer: any) => {
    const countyName = feature.properties?.name;
    if (!countyName) return;

    const drift = driftData[countyName];
    const isHovered = hoveredCounty === countyName;

    // Set feature style
    const fillColor = getColor(countyName);
    layer.setStyle({
      fillColor,
      fillOpacity: isHovered ? 0.9 : 0.7,
      color: '#333',
      weight: isHovered ? 3 : 1,
      opacity: 1,
    });

    // Create popup
    const driftLabel = drift ? getDriftLabel(drift.drift_pct) : 'No data';
    layer.bindPopup(`<div class="font-semibold">${countyName}</div><div>${driftLabel}</div>`);

    // Add event listeners
    layer.on('click', () => {
      onCountyClick?.(countyName);
    });

    layer.on('mouseover', () => {
      setHoveredCounty(countyName);
      layer.setStyle({ weight: 3, fillOpacity: 0.9 });
    });

    layer.on('mouseout', () => {
      setHoveredCounty(null);
      layer.setStyle({ weight: 1, fillOpacity: 0.7 });
    });
  }, [driftData, hoveredCounty, getColor, onCountyClick]);

  if (loading) {
    return (
      <div className="w-full h-96 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center rounded-lg border-2 border-red-600">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-slate-700 font-semibold">Loading map...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-96 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center rounded-lg border-2 border-red-600">
        <div className="text-center">
          <p className="text-red-600 font-semibold mb-2">Error loading map</p>
          <p className="text-slate-600 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  // @ts-ignore - using any type to bypass react-leaflet type issues
  const MapContent = () => (
    <div className="w-full border-2 border-red-600 rounded-lg overflow-hidden shadow-lg">
      <div className="w-full h-96 md:h-[500px] bg-slate-50 relative">
        {geoData && (
          <DynamicMapContainer
            center={[32.9866, -83.6487]}
            zoom={7}
            style={{ height: '100%', width: '100%' }}
            className="z-0"
          >
            <DynamicTileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
            <DynamicGeoJSON data={geoData} onEachFeature={onEachFeature} />
          </DynamicMapContainer>
        )}
      </div>

      <div className="bg-gradient-to-r from-slate-50 to-slate-100 border-t-2 border-red-600 px-4 py-3">
        <h3 className="text-xs font-bold text-slate-900 mb-2">Voter Drift (2026 vs 2016)</h3>
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-green-400 border border-green-600"></div>
            <span className="text-slate-700">Baseline</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-red-500 border border-red-700"></div>
            <span className="text-slate-700">GOP Gains</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-blue-500 border border-blue-700"></div>
            <span className="text-slate-700">Dem Gains</span>
          </div>
        </div>
      </div>
    </div>
  );

  return <MapContent />;
}
