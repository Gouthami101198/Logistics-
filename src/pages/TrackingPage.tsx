import React, { useState } from 'react';
import { 
  Radio, 
  Truck, 
  Package, 
  User, 
  Navigation, 
  Fuel, 
  Gauge, 
  Search
} from 'lucide-react';
import { useLogistics } from '../context/LogisticsContext';
import { TrackingMap } from '../components/tracking/TrackingMap';
import { StatusBadge } from '../components/common/StatusBadge';
import { Shipment, Vehicle } from '../types';

export const TrackingPage: React.FC = () => {
  const { 
    vehicles, 
    shipments, 
    selectedShipment, 
    setSelectedShipment,
    selectedVehicle,
    setSelectedVehicle,
    isLiveSimulationActive,
    toggleLiveSimulation
  } = useLogistics();

  const [activeTab, setActiveTab] = useState<'shipments' | 'vehicles'>('shipments');
  const [searchTerm, setSearchTerm] = useState('');

  // Filter lists
  const filteredShipments = shipments.filter(
    (s) =>
      s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.origin.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.destination.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredVehicles = vehicles.filter(
    (v) =>
      v.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (v.currentDriverName && v.currentDriverName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSelectShipment = (shp: Shipment) => {
    setSelectedShipment(shp);
    const linkedVehicle = vehicles.find((v) => v.id === shp.assignedVehicleId);
    if (linkedVehicle) setSelectedVehicle(linkedVehicle);
  };

  const handleSelectVehicle = (veh: Vehicle) => {
    setSelectedVehicle(veh);
    const linkedShipment = shipments.find((s) => s.assignedVehicleId === veh.id);
    if (linkedShipment) setSelectedShipment(linkedShipment);
  };

  // Currently focused entity
  const focusShipment = selectedShipment || shipments[0];
  const focusVehicle =
    selectedVehicle ||
    (focusShipment?.assignedVehicleId ? vehicles.find((v) => v.id === focusShipment.assignedVehicleId) : null) ||
    vehicles[0];

  return (
    <div className="space-y-4 h-[calc(100vh-100px)] flex flex-col animate-fade-in-up">
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <span>Fleet Geospatial Radar</span>
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real-time interactive GPS tracking, multi-point routes, and active telemetry feeds
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={toggleLiveSimulation}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              isLiveSimulationActive
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-500/30 dark:text-emerald-400 shadow-xs'
                : 'bg-slate-100 border-slate-200 text-slate-600 dark:bg-slate-800/80 dark:border-slate-700 dark:text-slate-400 shadow-xs'
            }`}
          >
            <Radio className={`h-3.5 w-3.5 ${isLiveSimulationActive ? 'animate-pulse text-emerald-500 dark:text-emerald-400' : ''}`} />
            <span>{isLiveSimulationActive ? 'Live Telemetry Active' : 'Simulation Paused'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Drawer (List of Shipments/Vehicles) + Center Map + Right Telemetry Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 min-h-0">
        {/* Left Column: Selector Drawer (3 cols) */}
        <div className="lg:col-span-3 rounded-2xl glass-card border border-slate-200/90 dark:border-slate-800/80 p-4 flex flex-col min-h-0 shadow-xs dark:shadow-lg dark:shadow-black/20 transition-colors duration-300">
          {/* Tab buttons */}
          <div className="flex rounded-xl bg-slate-100 dark:bg-slate-950/70 p-1 border border-slate-200 dark:border-slate-800 mb-3 shrink-0">
            <button
              onClick={() => setActiveTab('shipments')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'shipments'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <Package className="h-3.5 w-3.5" />
              <span>Shipments ({shipments.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('vehicles')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'vehicles'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <Truck className="h-3.5 w-3.5" />
              <span>Vehicles ({vehicles.length})</span>
            </button>
          </div>

          {/* Search bar */}
          <div className="relative mb-3 shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder={`Filter ${activeTab}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 py-1.5 pl-9 pr-3 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-950 transition-colors"
            />
          </div>

          {/* List items */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {activeTab === 'shipments' ? (
              filteredShipments.map((shp) => {
                const isSelected = focusShipment?.id === shp.id;
                return (
                  <div
                    key={shp.id}
                    onClick={() => handleSelectShipment(shp)}
                    className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-indigo-50 border-indigo-300 ring-1 ring-indigo-400/40 dark:bg-indigo-600/15 dark:border-indigo-500/40 dark:ring-indigo-500/30 shadow-xs animate-border-glow'
                        : 'bg-white dark:bg-slate-900/60 border-slate-200/90 dark:border-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-slate-900 dark:text-white font-mono">{shp.id}</span>
                      <StatusBadge status={shp.status} size="sm" />
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 font-medium truncate">{shp.customerName}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                      {shp.origin.city} → {shp.destination.city}
                    </p>
                    <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500">
                      <span>Prog: {shp.routeProgress}%</span>
                      <span>{shp.assignedVehiclePlate || 'No Truck'}</span>
                    </div>
                  </div>
                );
              })
            ) : (
              filteredVehicles.map((veh) => {
                const isSelected = focusVehicle?.id === veh.id;
                return (
                  <div
                    key={veh.id}
                    onClick={() => handleSelectVehicle(veh)}
                    className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-indigo-50 border-indigo-300 ring-1 ring-indigo-400/40 dark:bg-indigo-600/15 dark:border-indigo-500/40 dark:ring-indigo-500/30 shadow-xs animate-border-glow'
                        : 'bg-white dark:bg-slate-900/60 border-slate-200/90 dark:border-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-slate-900 dark:text-white font-mono">{veh.plateNumber}</span>
                      <StatusBadge status={veh.status} size="sm" />
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 font-medium truncate">{veh.model}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                      Driver: {veh.currentDriverName || 'Unassigned'}
                    </p>
                    <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500">
                      <span>Speed: {veh.speed} km/h</span>
                      <span>Fuel: {veh.fuelLevel}%</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Center: Leaflet Interactive Map (6 cols) */}
        <div className="lg:col-span-6 rounded-2xl overflow-hidden border border-slate-200/90 dark:border-slate-800 relative min-h-[350px] shadow-xs dark:shadow-lg dark:shadow-black/20">
          <TrackingMap
            vehicles={vehicles}
            selectedShipment={focusShipment}
            selectedVehicle={focusVehicle}
            onSelectVehicle={handleSelectVehicle}
          />
        </div>

        {/* Right Column: Telemetry & Route Inspector (3 cols) */}
        <div className="lg:col-span-3 rounded-2xl glass-card border border-slate-200/90 dark:border-slate-800/80 p-4 flex flex-col min-h-0 shadow-xs dark:shadow-lg dark:shadow-black/20 overflow-y-auto space-y-4 transition-colors duration-300">
          <div className="border-b border-slate-200/90 dark:border-slate-800/80 pb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Active Focus Telemetry
            </span>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
              {focusShipment ? focusShipment.id : focusVehicle?.plateNumber}
            </h3>
            {focusShipment && (
              <p className="text-xs text-slate-500 dark:text-slate-400">{focusShipment.customerName}</p>
            )}
          </div>

          {/* Quick Metrics */}
          {focusVehicle && (
            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/90 dark:border-slate-800/80">
                <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-[11px] mb-1">
                  <Gauge className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" />
                  <span>Current Speed</span>
                </div>
                <p className="text-lg font-bold text-slate-900 dark:text-white">{focusVehicle.speed} km/h</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/90 dark:border-slate-800/80">
                <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-[11px] mb-1">
                  <Fuel className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Fuel / Battery</span>
                </div>
                <p className="text-lg font-bold text-slate-900 dark:text-white">{focusVehicle.fuelLevel}%</p>
              </div>
            </div>
          )}

          {/* Assigned Driver */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/90 dark:border-slate-800/80 space-y-1.5 text-xs">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" /> Operator
            </span>
            <p className="font-bold text-slate-900 dark:text-white">
              {focusShipment?.assignedDriverName || focusVehicle?.currentDriverName || 'No Driver Assigned'}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Vehicle: {focusShipment?.assignedVehiclePlate || focusVehicle?.plateNumber || 'Unassigned'}
            </p>
          </div>

          {/* Route Progression */}
          {focusShipment && (
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/90 dark:border-slate-800/80 space-y-2 text-xs">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Navigation className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" /> Route & Transit
              </span>

              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{focusShipment.origin.city}</span>
                  <span className="text-slate-400">→</span>
                  <span className="text-rose-600 dark:text-rose-400 font-semibold">{focusShipment.destination.city}</span>
                </div>

                <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full transition-all duration-500 animate-progress-stream"
                    style={{ width: `${focusShipment.routeProgress}%` }}
                  />
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 text-right">
                  {focusShipment.routeProgress}% en route
                </p>
              </div>

              <div className="pt-2 border-t border-slate-200/90 dark:border-slate-800/80 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
                <span>Estimated ETA:</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {new Date(focusShipment.estimatedDelivery).toLocaleDateString([], {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </div>
          )}

          {/* Current GPS coordinates */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/90 dark:border-slate-800/80 text-[11px] text-slate-700 dark:text-slate-300 font-mono">
            <span className="text-slate-500 block mb-0.5">CURRENT TELEMETRY COORDS:</span>
            <span>
              {focusShipment
                ? `${focusShipment.currentCoordinates.lat.toFixed(4)}, ${focusShipment.currentCoordinates.lng.toFixed(4)}`
                : `${focusVehicle?.currentLocation.lat.toFixed(4)}, ${focusVehicle?.currentLocation.lng.toFixed(4)}`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
