// @ts-nocheck
'use client';

import React, { useEffect, useState, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface DriftData {
  [key: string]: { drift_pct: number };
}

interface GeorgiaCountyMapLeafletProps {
  onCountyClick?: (county: string) => void;
}

export default function GeorgiaCountyMapLeaflet({ onCountyClick }: GeorgiaCountyMapLeafletProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const geoJsonLayer = useRef<L.GeoJSON | null>(null);
  const [driftData, setDriftData] = useState<DriftData>({});
  const [geoData, setGeoData] = useState<any>(null);
  const [hoveredCounty, setHoveredCounty] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch drift data
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
        const response = await fetch('/data/georgia-counties-detailed.json');
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

  // Get color based on drift
  const getColor = (countyName: string): string => {
    const data = driftData[countyName];
    if (!data) return '#dcfce7';

    const drift = data.drift_pct;

    if (drift >= -0.5 && drift <= 0.5) return '#22c55e';
    if (drift > 0.5 && drift <= 3) return '#fca5a5';
    if (drift > 3 && drift <= 6) return '#ef4444';
    if (drift > 6 && drift <= 10) return '#dc2626';
    if (drift > 10) return '#7f1d1d';
    if (drift < -0.5 && drift >= -3) return '#93c5fd';
    if (drift < -3 && drift >= -6) return '#3b82f6';
    if (drift < -6 && drift >= -10) return '#1d4ed8';
    if (drift < -10) return '#1e40af';

    return '#dcfce7';
  };

  const getDriftLabel = (drift: number): string => {
    if (drift >= -0.5 && drift <= 0.5) return 'Baseline';
    return `${drift > 0 ? '+' : ''}${drift.toFixed(1)}%`;
  };

  // Calculate centroid of a polygon
  const getCentroid = (coordinates: any[]): [number, number] | null => {
    if (!coordinates || coordinates.length === 0) return null;

    // Handle different coordinate formats
    let coords = coordinates;
    if (coordinates[0] && Array.isArray(coordinates[0]) && Array.isArray(coordinates[0][0])) {
      coords = coordinates[0]; // For Polygon type
    }

    if (coords.length === 0) return null;

    let minX = coords[0][0];
    let minY = coords[0][1];
    let maxX = coords[0][0];
    let maxY = coords[0][1];

    for (let coord of coords) {
      minX = Math.min(minX, coord[0]);
      minY = Math.min(minY, coord[1]);
      maxX = Math.max(maxX, coord[0]);
      maxY = Math.max(maxY, coord[1]);
    }

    return [(minX + maxX) / 2, (minY + maxY) / 2];
  };

  // Initialize map and add layers
  useEffect(() => {
    if (!mapContainer.current || !geoData) return;

    // Initialize map only once
    if (!map.current) {
      map.current = L.map(mapContainer.current).setView([32.5, -83.5], 6.5);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map.current);
    }

    // Remove old GeoJSON layer if it exists
    if (geoJsonLayer.current) {
      map.current.removeLayer(geoJsonLayer.current);
    }

    // Add GeoJSON layer
    geoJsonLayer.current = L.geoJSON(geoData, {
      style: (feature) => {
        const countyName = feature?.properties?.name;
        return {
          fillColor: getColor(countyName),
          fillOpacity: hoveredCounty === countyName ? 0.9 : 0.7,
          color: '#333',
          weight: hoveredCounty === countyName ? 3 : 1,
          opacity: 1,
        };
      },
      onEachFeature: (feature, layer) => {
        const countyName = feature.properties?.name;
        if (!countyName) return;

        const drift = driftData[countyName];
        const driftLabel = drift ? getDriftLabel(drift.drift_pct) : 'No data';

        layer.bindPopup(`<div class="font-semibold">${countyName}</div><div>${driftLabel}</div>`);

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

        // Add county name label at centroid
        if ((feature.geometry.type === 'Polygon' || feature.geometry.type === 'MultiPolygon') && feature.geometry.coordinates) {
          let coordinates = feature.geometry.coordinates;
          
          // For MultiPolygon, use the first polygon's coordinates
          if (feature.geometry.type === 'MultiPolygon' && coordinates.length > 0) {
            coordinates = coordinates[0];
          }
          
          const centroid = getCentroid(coordinates);
          if (centroid) {
            const labelMarker = L.marker(
              [centroid[1], centroid[0]],
              {
                icon: L.divIcon({
                  html: `<div style="
                    background: rgba(255, 255, 255, 0.92);
                    padding: 1px 2px;
                    border-radius: 2px;
                    font-size: 9px;
                    font-weight: bold;
                    color: #334155;
                    text-align: center;
                    border: 1px solid #cbd5e1;
                    white-space: nowrap;
                    pointer-events: none;
                    box-shadow: 0 1px 2px rgba(0,0,0,0.08);
                    line-height: 1;
                  ">${countyName}</div>`,
                  className: 'county-label-marker',
                  iconSize: [auto, 'auto'],
                  iconAnchor: [undefined, undefined],
                }),
              }
            );
            if (map.current) {
              labelMarker.addTo(map.current);
            }
          }
        }
      },
    }).addTo(map.current);

    return () => {
      // Cleanup
    };
  }, [geoData, driftData, hoveredCounty, getColor, onCountyClick]);

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

  return (
    <div className="w-full border-2 border-red-600 rounded-lg overflow-hidden shadow-lg">
      <div
        ref={mapContainer}
        className="w-full bg-slate-50 relative"
        style={{ position: 'relative', minHeight: '700px', height: '700px' }}
      />

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
}
