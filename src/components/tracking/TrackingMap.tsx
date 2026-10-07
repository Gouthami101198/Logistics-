import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Vehicle, Shipment } from '../../types';
import { ZoomIn, ZoomOut, Crosshair } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface TrackingMapProps {
  vehicles: Vehicle[];
  selectedShipment?: Shipment | null;
  selectedVehicle?: Vehicle | null;
  onSelectVehicle?: (vehicle: Vehicle) => void;
  onSelectShipment?: (shipment: Shipment) => void;
  className?: string;
}

export const TrackingMap: React.FC<TrackingMapProps> = ({
  vehicles,
  selectedShipment,
  selectedVehicle,
  onSelectVehicle,
  className = 'h-full w-full',
}) => {
  const { isDark } = useTheme();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const routeLayerRef = useRef<L.LayerGroup | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return; // already initialized

    // Center of US / East Corridor
    const initialCenter: [number, number] = [40.7128, -74.006];
    const map = L.map(mapContainerRef.current, {
      center: initialCenter,
      zoom: 6,
      zoomControl: false,
    });

    const tileUrl = isDark
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

    const tileLayer = L.tileLayer(tileUrl, {
      attribution: '&copy; <a href="https://carto.com/">CARTO</a>, &copy; OpenStreetMap',
      maxZoom: 19,
    }).addTo(map);

    tileLayerRef.current = tileLayer;

    const markersLayer = L.layerGroup().addTo(map);
    const routeLayer = L.layerGroup().addTo(map);

    markersLayerRef.current = markersLayer;
    routeLayerRef.current = routeLayer;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      tileLayerRef.current = null;
    };
  }, []);

  // Update Tile Layer when theme switches
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    const tileUrl = isDark
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

    const newTileLayer = L.tileLayer(tileUrl, {
      attribution: '&copy; <a href="https://carto.com/">CARTO</a>, &copy; OpenStreetMap',
      maxZoom: 19,
    }).addTo(map);

    tileLayerRef.current = newTileLayer;
  }, [isDark]);

  // Update Markers & Routes
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    const routeLayer = routeLayerRef.current;

    if (!map || !markersLayer || !routeLayer) return;

    markersLayer.clearLayers();
    routeLayer.clearLayers();

    const bounds = L.latLngBounds([]);

    // 1. Add Vehicle Markers
    vehicles.forEach((veh) => {
      const lat = veh.currentLocation.lat;
      const lng = veh.currentLocation.lng;
      if (typeof lat !== 'number' || typeof lng !== 'number') return;

      const isSelected =
        selectedVehicle?.id === veh.id ||
        (selectedShipment && selectedShipment.assignedVehicleId === veh.id);

      const statusColor =
        veh.status === 'In Transit'
          ? '#6366f1' // indigo-500
          : veh.status === 'Available'
          ? '#10b981' // emerald-500
          : veh.status === 'Maintenance'
          ? '#f59e0b' // amber-500
          : '#ef4444'; // red-500

      const markerBg = isDark ? '#0f172a' : '#ffffff';

      const iconHtml = `
        <div style="position: relative; display: flex; align-items: center; justify-content: center;">
          ${
            veh.status === 'In Transit'
              ? `<div style="position: absolute; width: 36px; height: 36px; border-radius: 9999px; background-color: ${statusColor}; opacity: 0.35; animation: radar-pulse 2s infinite ease-out;"></div>`
              : ''
          }
          <div style="
            width: ${isSelected ? '38px' : '30px'};
            height: ${isSelected ? '38px' : '30px'};
            border-radius: 10px;
            background-color: ${markerBg};
            border: 2px solid ${statusColor};
            box-shadow: 0 4px 15px ${statusColor}55;
            display: flex;
            align-items: center;
            justify-content: center;
            color: ${statusColor};
            cursor: pointer;
            transition: transform 0.2s;
          ">
            <svg xmlns="http://www.w3.org/2000/svg" width="${isSelected ? '20' : '16'}" height="${
        isSelected ? '20' : '16'
      }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/>
              <path d="M15 18H9"/>
              <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/>
              <circle cx="17" cy="18" r="2"/>
              <circle cx="7" cy="18" r="2"/>
            </svg>
          </div>
          ${
            isSelected
              ? `<div style="position: absolute; bottom: -20px; background: #4f46e5; color: white; font-size: 10px; font-weight: bold; padding: 1.5px 6px; border-radius: 4px; white-space: nowrap; box-shadow: 0 0 10px rgba(99,102,241,0.5);">
                  ${veh.plateNumber}
                </div>`
              : ''
          }
        </div>
      `;

      const customIcon = L.divIcon({
        html: iconHtml,
        className: 'vehicle-marker-icon',
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });

      const marker = L.marker([lat, lng], { icon: customIcon });

      const popupContent = `
        <div style="font-family: 'Inter', sans-serif; padding: 4px; min-width: 210px; color: ${isDark ? '#f1f5f9' : '#0f172a'};">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px; border-bottom: 1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}; padding-bottom: 6px;">
            <strong style="color: ${isDark ? '#ffffff' : '#0f172a'}; font-size: 13px;">${veh.plateNumber}</strong>
            <span style="font-size: 10px; padding: 2px 6px; border-radius: 4px; background: rgba(99,102,241,0.15); color: #6366f1; font-weight: 600;">
              ${veh.status}
            </span>
          </div>
          <div style="font-size: 11px; color: ${isDark ? '#94a3b8' : '#64748b'}; line-height: 1.6;">
            <div>Model: <span style="color: ${isDark ? '#e2e8f0' : '#1e293b'}; font-weight: 500;">${veh.model}</span></div>
            <div>Driver: <span style="color: ${isDark ? '#e2e8f0' : '#1e293b'}; font-weight: 500;">${veh.currentDriverName || 'Unassigned'}</span></div>
            <div>Speed: <span style="color: #0284c7; font-weight: 600;">${veh.speed} km/h</span></div>
            <div>Fuel Level: <span style="color: ${veh.fuelLevel < 30 ? '#ef4444' : '#10b981'}; font-weight: 600;">${veh.fuelLevel}%</span></div>
            <div style="margin-top: 4px; color: ${isDark ? '#64748b' : '#94a3b8'}; font-size: 10px;">${veh.currentLocation.address}, ${veh.currentLocation.city}</div>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);

      if (onSelectVehicle) {
        marker.on('click', () => {
          onSelectVehicle(veh);
        });
      }

      markersLayer.addLayer(marker);
      bounds.extend([lat, lng]);
    });

    // 2. If a shipment is selected, render Origin, Destination & Route Polyline
    if (selectedShipment) {
      const orig = selectedShipment.origin;
      const dest = selectedShipment.destination;
      const curr = selectedShipment.currentCoordinates;

      // Origin Pin (Emerald Green)
      const originIcon = L.divIcon({
        html: `
          <div style="background: #10b981; width: 28px; height: 28px; border-radius: 9999px; border: 2px solid white; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(16,185,129,0.5);">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
          </div>
        `,
        className: 'origin-marker',
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });
      const origMarker = L.marker([orig.lat, orig.lng], { icon: originIcon }).bindPopup(`
        <div style="font-size: 12px; color: ${isDark ? '#f1f5f9' : '#0f172a'}; padding: 2px;">
          <strong style="color: #10b981;">Pickup / Origin</strong>
          <div style="color: ${isDark ? '#94a3b8' : '#64748b'}; margin-top: 2px;">${orig.address}, ${orig.city}, ${orig.state}</div>
        </div>
      `);
      markersLayer.addLayer(origMarker);
      bounds.extend([orig.lat, orig.lng]);

      // Destination Pin (Rose/Pink Flag)
      const destIcon = L.divIcon({
        html: `
          <div style="background: #f43f5e; width: 28px; height: 28px; border-radius: 9999px; border: 2px solid white; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(244,63,94,0.5);">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>
          </div>
        `,
        className: 'dest-marker',
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });
      const destMarker = L.marker([dest.lat, dest.lng], { icon: destIcon }).bindPopup(`
        <div style="font-size: 12px; color: ${isDark ? '#f1f5f9' : '#0f172a'}; padding: 2px;">
          <strong style="color: #f43f5e;">Delivery Destination</strong>
          <div style="color: ${isDark ? '#94a3b8' : '#64748b'}; margin-top: 2px;">${dest.address}, ${dest.city}, ${dest.state}</div>
          <div style="color: #64748b; font-size: 10px; margin-top: 3px;">ETA: ${new Date(selectedShipment.estimatedDelivery).toLocaleDateString()}</div>
        </div>
      `);
      markersLayer.addLayer(destMarker);
      bounds.extend([dest.lat, dest.lng]);

      // Draw polyline connecting: Origin -> Current Position -> Destination
      const routePoints: [number, number][] = [
        [orig.lat, orig.lng],
        [curr.lat, curr.lng],
        [dest.lat, dest.lng],
      ];

      // Outer glow line
      const glowLine = L.polyline(routePoints, {
        color: '#6366f1',
        weight: 6,
        opacity: 0.35,
      });
      // Dashed active route line with animated electricity flow
      const activeLine = L.polyline(routePoints, {
        color: '#6366f1',
        weight: 3.5,
        dashArray: '8, 8',
        className: 'leaflet-route-animated',
        opacity: 0.95,
      });

      routeLayer.addLayer(glowLine);
      routeLayer.addLayer(activeLine);
    }

    // Auto fit bounds if points exist
    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 });
    }
  }, [vehicles, selectedShipment, selectedVehicle, onSelectVehicle, isDark]);

  const handleZoomIn = () => {
    mapInstanceRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapInstanceRef.current?.zoomOut();
  };

  const handleRecenter = () => {
    if (selectedShipment) {
      mapInstanceRef.current?.setView(
        [selectedShipment.currentCoordinates.lat, selectedShipment.currentCoordinates.lng],
        9
      );
    } else if (selectedVehicle) {
      mapInstanceRef.current?.setView(
        [selectedVehicle.currentLocation.lat, selectedVehicle.currentLocation.lng],
        9
      );
    } else if (vehicles.length > 0) {
      const bounds = L.latLngBounds(vehicles.map((v) => [v.currentLocation.lat, v.currentLocation.lng]));
      mapInstanceRef.current?.fitBounds(bounds, { padding: [50, 50] });
    }
  };

  return (
    <div className={`relative overflow-hidden rounded-2xl ${className}`}>
      {/* Map DOM target */}
      <div ref={mapContainerRef} className="h-full w-full" />

      {/* Floating Control Toolbar */}
      <div className="absolute top-4 right-4 z-[400] flex flex-col gap-2 pointer-events-auto">
        <button
          type="button"
          onClick={handleZoomIn}
          className="p-2.5 rounded-xl bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-md backdrop-blur-md transition-all cursor-pointer hover:scale-105 active:scale-95"
          title="Zoom In"
        >
          <ZoomIn className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={handleZoomOut}
          className="p-2.5 rounded-xl bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-md backdrop-blur-md transition-all cursor-pointer hover:scale-105 active:scale-95"
          title="Zoom Out"
        >
          <ZoomOut className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={handleRecenter}
          className="p-2.5 rounded-xl bg-white/90 dark:bg-slate-900/90 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-md backdrop-blur-md transition-all cursor-pointer hover:scale-105 active:scale-95"
          title="Recenter on Active Focus"
        >
          <Crosshair className="h-4 w-4" />
        </button>
      </div>

      {/* Map Legend Overlay */}
      <div className="absolute bottom-4 left-4 z-[400] glass-card border border-slate-200/90 dark:border-slate-800/80 backdrop-blur-md rounded-xl p-3 text-xs shadow-xl pointer-events-auto transition-colors duration-300">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">Fleet Map Legend</p>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
            <span className="text-slate-700 dark:text-slate-300 font-medium">In Transit</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            <span className="text-slate-700 dark:text-slate-300 font-medium">Available</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
            <span className="text-slate-700 dark:text-slate-300 font-medium">Maintenance</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-4 border-b-2 border-dashed border-indigo-500 dark:border-indigo-400" />
            <span className="text-slate-700 dark:text-slate-300 font-medium">Route Waypoint</span>
          </div>
        </div>
      </div>
    </div>
  );
};
