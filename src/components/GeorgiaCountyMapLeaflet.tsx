// @ts-nocheck
'use client';

import React, { useEffect, useState, useRef, Suspense } from 'react';
import dynamic from 'next/dynamic';

interface DriftData {
  [key: string]: { drift_pct: number };
}

interface GeorgiaCountyMapLeafletProps {
  onCountyClick?: (county: string) => void;
}

export default function GeorgiaCountyMapLeaflet({ onCountyClick }: GeorgiaCountyMapLeafletProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any | null>(null);
  const geoJsonLayer = useRef<any | null>(null);
  const [driftData, setDriftData] = useState<DriftData>({});
  const [geoData, setGeoData] = useState<any>(null);
  const [hoveredCounty, setHoveredCounty] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const labelsLayerGroup = useRef<any | null>(null);
  const [zoomLevel, setZoomLevel] = useState(6.5);
  const labelMarkersRef = useRef<Map<string, any>>(new Map());
  const L = useRef<any>(null);

  // Load Leaflet dynamically
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    import('leaflet').then((module) => {
      L.current = module.default;
    });

    // Load CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css';
    document.head.appendChild(link);
  }, []);

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
        const response = await fetch('/data/georgia-counties-all-159.json');
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
    if (!mapContainer.current || !geoData || !L.current) return;

    // Initialize map only once
    if (!map.current) {
      map.current = L.current.map(mapContainer.current).setView([32.5, -83.5], 6.5);

      L.current.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map.current);

      // Create labels layer group
      labelsLayerGroup.current = L.current.layerGroup().addTo(map.current);
    }

    // Remove old GeoJSON layer if it exists
    if (geoJsonLayer.current) {
      map.current.removeLayer(geoJsonLayer.current);
    }

    // Clear old labels
    if (labelsLayerGroup.current) {
      labelsLayerGroup.current.clearLayers();
    }

    // Add GeoJSON layer
    geoJsonLayer.current = L.current.geoJSON(geoData, {
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
          // Show this county's label with full opacity
          const marker = labelMarkersRef.current.get(countyName);
          if (marker) {
            marker.setOpacity(1);
            marker.setZIndexOffset(1000);
          }
        });

        layer.on('mouseout', () => {
          setHoveredCounty(null);
          layer.setStyle({ weight: 1, fillOpacity: 0.7 });
          // Dim this county's label
          const marker = labelMarkersRef.current.get(countyName);
          if (marker) {
            marker.setOpacity(0.4);
            marker.setZIndexOffset(0);
          }
        });

        // Add county name label at centroid using text instead of markers for better performance
        if ((feature.geometry.type === 'Polygon' || feature.geometry.type === 'MultiPolygon') && feature.geometry.coordinates) {
          let coordinates = feature.geometry.coordinates;
          
          // For MultiPolygon, use the first polygon's coordinates
          if (feature.geometry.type === 'MultiPolygon' && coordinates.length > 0) {
            coordinates = coordinates[0];
          }
          
          const centroid = getCentroid(coordinates);
          if (centroid && labelsLayerGroup.current) {
            const labelDiv = L.current.divIcon({
              html: `<div class="leaflet-county-label" style="
                font-size: 7px;
                font-weight: 700;
                color: #0f172a;
                text-align: center;
                white-space: nowrap;
                pointer-events: none;
                cursor: default;
                line-height: 1;
                font-family: system-ui, -apple-system, sans-serif;
                text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.8), -1px -1px 2px rgba(255, 255, 255, 0.8), 1px -1px 2px rgba(255, 255, 255, 0.8), -1px 1px 2px rgba(255, 255, 255, 0.8);
              ">${countyName}</div>`,
              className: '',
              iconSize: [45, 14],
              iconAnchor: [23, 7],
            });

            const labelMarker = L.current.marker([centroid[1], centroid[0]], { 
              icon: labelDiv,
              opacity: 0.4,
              interactive: false
            });
            labelMarker.addTo(labelsLayerGroup.current);
            labelMarkersRef.current.set(countyName, labelMarker);
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
