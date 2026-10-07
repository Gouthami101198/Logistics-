import React, { useState } from 'react';
import { 
  Truck, 
  Users, 
  Package, 
  Clock, 
  AlertTriangle, 
  ExternalLink,
  ChevronRight,
  TrendingUp,
  MapPin,
  Plus
} from 'lucide-react';
import { useLogistics } from '../context/LogisticsContext';
import { StatsCard } from '../components/common/StatsCard';
import { StatusBadge } from '../components/common/StatusBadge';
import { TrackingMap } from '../components/tracking/TrackingMap';
import { ShipmentDetailsModal } from '../components/shipments/ShipmentDetailsModal';
import { AddEditShipmentModal } from '../components/shipments/AddEditShipmentModal';
import { Shipment, Vehicle } from '../types';
import { useNavigate } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { 
    vehicles, 
    drivers, 
    shipments, 
    alerts, 
    stats, 
    setSelectedShipment,
    setSelectedVehicle,
    deleteShipment
  } = useLogistics();

  const [activeModalShipment, setActiveModalShipment] = useState<Shipment | null>(null);
  const [isNewShipmentOpen, setIsNewShipmentOpen] = useState(false);
  const [editingShipment, setEditingShipment] = useState<Shipment | null>(null);

  // Recent shipments (last 5)
  const recentShipments = shipments.slice(0, 5);
  // Active in-transit shipment for preview map
  const activeShipment = shipments.find((s) => s.status === 'In Transit') || shipments[0];

  const handleInspectShipment = (shp: Shipment) => {
    setActiveModalShipment(shp);
  };

  const handleSelectVehicleOnMap = (veh: Vehicle) => {
    setSelectedVehicle(veh);
    navigate('/tracking');
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Top Banner / Welcome */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Logistics Command Center
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time fleet telemetry, active consignments, driver rosters, and operational alerts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsNewShipmentOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all hover:scale-102 cursor-pointer active:scale-98"
          >
            <Plus className="h-4 w-4" />
            <span>Create Shipment</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('/tracking')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold shadow-xs transition-all hover:scale-102 cursor-pointer"
          >
            <MapPin className="h-4 w-4 text-emerald-500 dark:text-emerald-400" />
            <span>Live Radar</span>
          </button>
        </div>
      </div>

      {/* Visual Hero Image Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/90 dark:border-slate-800/80 bg-slate-900 shadow-xl shadow-slate-900/10 dark:shadow-black/40 min-h-[320px] sm:min-h-[360px] flex items-center">
        <div className="absolute inset-0">
          <img
            src="/images/hero-banner.jpg"
            alt="Intelligent Logistics Network"
            className="h-full w-full object-cover object-center opacity-75 brightness-110 filter hover:scale-105 transition-transform duration-700"
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=1600';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/80 to-blue-950/40" />
        </div>

        <div className="relative z-10 w-full flex flex-col justify-between p-7 sm:p-9 lg:p-12 md:flex-row md:items-center gap-6">
          <div className="max-w-xl space-y-2.5">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/15 px-3 py-1 text-xs font-medium text-blue-300 backdrop-blur-md">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              <span>AI Autonomous Telemetry v4.2 Active</span>
            </div>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white tracking-tight leading-tight">
              Next-Gen Autonomous Freight & Fleet Operations
            </h2>
            <p className="text-xs text-slate-300/90 leading-relaxed">
              Monitoring 8 commercial haul corridors with real-time IoT sensors, automated delivery ETA calibration, and predictive vehicle maintenance.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => navigate('/tracking')}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2 shadow-md shadow-blue-600/30 transition-all hover:scale-105 cursor-pointer"
              >
                <MapPin className="h-4 w-4" />
                <span>Live Route Radar</span>
              </button>
              <button
                type="button"
                onClick={() => navigate('/shipments')}
                className="inline-flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold px-4 py-2 backdrop-blur-xs transition-all cursor-pointer"
              >
                <Package className="h-4 w-4 text-blue-300" />
                <span>View All Consignments</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:w-72 shrink-0">
            <div className="rounded-xl border border-white/15 bg-black/40 p-3 backdrop-blur-md">
              <p className="text-[11px] font-medium text-slate-300">Dispatch Speed</p>
              <p className="text-base font-bold text-white mt-0.5">98.4%</p>
              <p className="text-[10px] text-emerald-400 mt-0.5">↑ +1.8% this week</p>
            </div>
            <div className="rounded-xl border border-white/15 bg-black/40 p-3 backdrop-blur-md">
              <p className="text-[11px] font-medium text-slate-300">Satellite Uplink</p>
              <p className="text-base font-bold text-white mt-0.5">Optimal</p>
              <p className="text-[10px] text-blue-300 mt-0.5">24/7 Encrypted</p>
            </div>
            <div className="rounded-xl border border-white/15 bg-black/40 p-3.5 backdrop-blur-md">
              <p className="text-[11px] font-medium text-slate-300">Payload En Route</p>
              <p className="text-lg font-bold text-white mt-0.5">48.2 Ton</p>
              <p className="text-[10px] text-cyan-300 mt-0.5">100% capacity balance</p>
            </div>
            <div className="rounded-xl border border-white/15 bg-black/40 p-3.5 backdrop-blur-md">
              <p className="text-[11px] font-medium text-slate-300">Fleet Security</p>
              <p className="text-lg font-bold text-emerald-400 mt-0.5">Level 4</p>
              <p className="text-[10px] text-slate-300 mt-0.5">Zero active incidents</p>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Fleet Vehicles"
          value={stats.totalVehicles}
          subtitle={`${stats.activeVehicles} in transit • ${stats.availableVehicles} available`}
          icon={Truck}
          accentColor="indigo"
          trend={{ value: '+4.2%', isPositive: true, label: 'utilization this week' }}
          onClick={() => navigate('/vehicles')}
        />
        <StatsCard
          title="Active Drivers"
          value={stats.totalDrivers}
          subtitle={`${stats.onDutyDrivers} on duty or on delivery`}
          icon={Users}
          accentColor="emerald"
          trend={{ value: '100%', isPositive: true, label: 'compliance score' }}
          onClick={() => navigate('/drivers')}
        />
        <StatsCard
          title="Active Shipments"
          value={stats.activeShipments}
          subtitle={`${stats.inTransitShipments} in transit • ${stats.delayedShipments} delayed`}
          icon={Package}
          accentColor="cyan"
          trend={{ value: '+12%', isPositive: true, label: 'vs last month' }}
          onClick={() => navigate('/shipments')}
        />
        <StatsCard
          title="On-Time Delivery Rate"
          value={`${stats.onTimeDeliveryRate}%`}
          subtitle={`${stats.deliveredShipments} successfully fulfilled`}
          icon={Clock}
          accentColor="amber"
          trend={{ value: '+0.8%', isPositive: true, label: 'target >96%' }}
          onClick={() => navigate('/analytics')}
        />
      </div>

      {/* Grid: Map Preview & Fleet Performance Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Live Operations Mini Map (8 cols) */}
        <div className="lg:col-span-8 rounded-2xl glass-card border border-slate-200/90 dark:border-slate-800/80 p-5 flex flex-col shadow-xs dark:shadow-lg dark:shadow-black/20 transition-colors duration-300">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Active Fleet Geo-Tracking</span>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Monitoring {vehicles.length} power units across US logistics corridors
              </p>
            </div>
            <button
              onClick={() => navigate('/tracking')}
              className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors cursor-pointer"
            >
              <span>Full Screen Radar</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="h-[360px] w-full rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-inner">
            <TrackingMap
              vehicles={vehicles}
              selectedShipment={activeShipment}
              onSelectVehicle={handleSelectVehicleOnMap}
            />
          </div>

          {activeShipment && (
            <div className="mt-4 pt-3 border-t border-slate-200/90 dark:border-slate-800/80 space-y-2 text-xs">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 dark:text-slate-400">Featured Active Route:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{activeShipment.id}</span>
                  <span className="text-slate-500 dark:text-slate-400">
                    ({activeShipment.origin.city} → {activeShipment.destination.city})
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-indigo-600 dark:text-indigo-400 font-semibold">{activeShipment.routeProgress}% completed</span>
                  <button
                    onClick={() => {
                      setSelectedShipment(activeShipment);
                      navigate('/tracking');
                    }}
                    className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium cursor-pointer"
                  >
                    Inspect in Radar
                  </button>
                </div>
              </div>

              <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className="h-full bg-indigo-600 rounded-full transition-all duration-500 animate-progress-stream"
                  style={{ width: `${activeShipment.routeProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Fleet Performance & Status Breakdown (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Shipment Status Breakdown */}
          <div className="rounded-2xl glass-card border border-slate-200/90 dark:border-slate-800/80 p-5 shadow-xs dark:shadow-lg dark:shadow-black/20 transition-colors duration-300">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">Consignment Statuses</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">Delivered</span>
                  <span className="text-slate-900 dark:text-white font-bold">{stats.deliveredShipments}</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    style={{
                      width: `${(stats.deliveredShipments / Math.max(1, stats.totalShipments)) * 100}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-indigo-600 dark:text-indigo-400 font-medium">In Transit</span>
                  <span className="text-slate-900 dark:text-white font-bold">{stats.inTransitShipments}</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full transition-all duration-500 animate-progress-stream"
                    style={{
                      width: `${(stats.inTransitShipments / Math.max(1, stats.totalShipments)) * 100}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-amber-600 dark:text-amber-400 font-medium">Delayed</span>
                  <span className="text-slate-900 dark:text-white font-bold">{stats.delayedShipments}</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full transition-all duration-500"
                    style={{
                      width: `${(stats.delayedShipments / Math.max(1, stats.totalShipments)) * 100}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Pending Dispatch</span>
                  <span className="text-slate-900 dark:text-white font-bold">
                    {stats.totalShipments - (stats.deliveredShipments + stats.inTransitShipments + stats.delayedShipments)}
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-slate-400 dark:bg-slate-600 rounded-full transition-all duration-500"
                    style={{
                      width: `${
                        ((stats.totalShipments -
                          (stats.deliveredShipments + stats.inTransitShipments + stats.delayedShipments)) /
                          Math.max(1, stats.totalShipments)) *
                        100
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Fleet Operations Overview Card */}
          <div className="rounded-2xl glass-card border border-slate-200/90 dark:border-slate-800/80 p-5 shadow-xs dark:shadow-lg dark:shadow-black/20 transition-colors duration-300">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">Fleet Performance Overview</h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/90 dark:border-slate-800/80">
                <span className="text-[11px] text-slate-500 dark:text-slate-400">Avg Cruise Speed</span>
                <p className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">{stats.averageSpeedKmh} km/h</p>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5 mt-1 font-medium">
                  <TrendingUp className="h-3 w-3" /> Optimum tier
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/90 dark:border-slate-800/80">
                <span className="text-[11px] text-slate-500 dark:text-slate-400">Total Distance Today</span>
                <p className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">{(stats.totalDistanceTodayKm).toLocaleString()} km</p>
                <span className="text-[10px] text-indigo-600 dark:text-indigo-400 mt-1 block font-medium">Across 6 states</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/90 dark:border-slate-800/80">
                <span className="text-[11px] text-slate-500 dark:text-slate-400">Fuel Efficiency</span>
                <p className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">{stats.totalFuelEfficiency} km/L</p>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1 block font-medium">Fleet target: &gt;7.5</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/90 dark:border-slate-800/80">
                <span className="text-[11px] text-slate-500 dark:text-slate-400">Fleet Availability</span>
                <p className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                  {Math.round((stats.availableVehicles / Math.max(1, stats.totalVehicles)) * 100)}%
                </p>
                <span className="text-[10px] text-amber-600 dark:text-amber-400 mt-1 block font-medium">
                  {stats.maintenanceVehicles} in maintenance
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fleet Power Units in Transit Showcase */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Truck className="h-4.5 w-4.5 text-indigo-600 dark:text-indigo-400" />
              <span>Fleet Power Units in Transit</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Live visual asset telematics, driver rosters, and location</p>
          </div>
          <button
            onClick={() => navigate('/vehicles')}
            className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors cursor-pointer"
          >
            <span>View All Fleet ({vehicles.length})</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {vehicles.slice(0, 3).map((veh, index) => {
            const driver = drivers.find((d) => d.id === veh.currentDriverId);
            return (
              <div
                key={veh.id}
                className={`glass-card card-interactive sheen-hover rounded-2xl border border-slate-200/90 dark:border-slate-800/80 overflow-hidden hover:border-indigo-500/50 group flex flex-col justify-between shadow-xs dark:shadow-md animate-fade-in-up stagger-${index + 1}`}
              >
                <div>
                  <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-900">
                    <img
                      src={veh.image || 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80&w=800'}
                      alt={veh.model}
                      className="h-full w-full object-cover object-center group-hover:scale-108 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80&w=800';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                      <StatusBadge status={veh.status} size="sm" />
                      {veh.status === 'In Transit' && (
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500" />
                        </span>
                      )}
                    </div>
                    <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-xs text-white">
                      <span className="font-bold font-mono text-indigo-300 drop-shadow">{veh.plateNumber}</span>
                      <span className="text-[11px] text-slate-200 font-medium bg-black/50 px-2 py-0.5 rounded backdrop-blur-xs">
                        {veh.speed} km/h
                      </span>
                    </div>
                  </div>

                  <div className="p-3.5 space-y-2.5">
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white text-xs truncate">{veh.model}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="h-3 w-3 text-rose-500 dark:text-rose-400 shrink-0" />
                        <span className="truncate">{veh.currentLocation.city}, {veh.currentLocation.state}</span>
                      </p>
                    </div>

                    {driver && (
                      <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/90 dark:border-slate-800/80">
                        <img
                          src={driver.avatar}
                          alt={driver.name}
                          className="h-7 w-7 rounded-lg object-cover ring-1 ring-indigo-500/30 shrink-0"
                          onError={(e) => {
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256';
                          }}
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-[11px] font-semibold text-slate-900 dark:text-white truncate">{driver.name}</p>
                          <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">{driver.onTimeRate}% on-time</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="px-3.5 pb-3.5 pt-1 flex items-center justify-between border-t border-slate-200/90 dark:border-slate-800/60 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-[11px]">
                    <span>Fuel:</span>
                    <span className={`font-bold ${veh.fuelLevel < 30 ? 'text-rose-500 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                      {veh.fuelLevel}%
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedVehicle(veh);
                      navigate('/tracking');
                    }}
                    className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors cursor-pointer"
                  >
                    Track Radar →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Section: Recent Critical Alerts & Recent Shipments Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Alerts & Recent Activity Feed (4 cols) */}
        <div className="lg:col-span-4 rounded-2xl glass-card border border-slate-200/90 dark:border-slate-800/80 p-5 shadow-xs dark:shadow-lg dark:shadow-black/20 flex flex-col transition-colors duration-300">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <AlertTriangle className="h-4.5 w-4.5 text-amber-500 dark:text-amber-400" />
              <span>Operational Alerts</span>
            </h2>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{alerts.length} total</span>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto max-h-[360px] pr-1">
            {alerts.slice(0, 4).map((alt) => (
              <div
                key={alt.id}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/90 dark:border-slate-800/80 text-xs hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-slate-900 dark:text-white truncate max-w-[200px]">{alt.title}</span>
                  <span
                    className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded border ${
                      alt.severity === 'critical'
                        ? 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/15 dark:text-rose-400 dark:border-rose-500/30'
                        : alt.severity === 'high'
                        ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/15 dark:text-amber-400 dark:border-amber-500/30'
                        : 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-500/15 dark:text-indigo-400 dark:border-indigo-500/30'
                    }`}
                  >
                    {alt.severity}
                  </span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-[11px] line-clamp-2 leading-relaxed">{alt.description}</p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-2 font-mono">
                  {new Date(alt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Shipments Table (8 cols) */}
        <div className="lg:col-span-8 rounded-2xl glass-card border border-slate-200/90 dark:border-slate-800/80 p-5 shadow-xs dark:shadow-lg dark:shadow-black/20 flex flex-col transition-colors duration-300">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Active & Recent Shipments</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Real-time status updates from transit logs</p>
            </div>
            <button
              onClick={() => navigate('/shipments')}
              className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors cursor-pointer"
            >
              <span>View All Shipments</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-medium">
                  <th className="pb-3 font-semibold">Shipment</th>
                  <th className="pb-3 font-semibold">Cargo & Client</th>
                  <th className="pb-3 font-semibold">Route</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold">Progress</th>
                  <th className="pb-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {recentShipments.map((shp, index) => (
                  <tr
                    key={shp.id}
                    className={`hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group animate-fade-in-up stagger-${index + 1}`}
                  >
                    <td className="py-3 font-semibold text-indigo-600 dark:text-indigo-400 font-mono">
                      {shp.id}
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={shp.cargoImage || 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=600'}
                          alt={shp.cargoType}
                          className="h-11 w-13 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-800 shrink-0 shadow-xs"
                          onError={(e) => {
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=600';
                          }}
                        />
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900 dark:text-white truncate max-w-[150px]">{shp.cargoType}</p>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate max-w-[150px]">{shp.customerName}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 text-slate-600 dark:text-slate-300">
                      {shp.origin.city} → {shp.destination.city}
                    </td>
                    <td className="py-3">
                      <StatusBadge status={shp.status} size="sm" />
                    </td>
                    <td className="py-3 min-w-[100px]">
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full bg-indigo-500 rounded-full transition-all duration-500 ${
                              shp.status === 'In Transit' ? 'animate-progress-stream' : ''
                            }`}
                            style={{ width: `${shp.routeProgress}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono shrink-0">
                          {shp.routeProgress}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => handleInspectShipment(shp)}
                        className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 underline transition-colors cursor-pointer"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ShipmentDetailsModal
        isOpen={Boolean(activeModalShipment)}
        onClose={() => setActiveModalShipment(null)}
        shipment={activeModalShipment}
        onEdit={(shp) => {
          setActiveModalShipment(null);
          setEditingShipment(shp);
        }}
        onDelete={(shp) => {
          deleteShipment(shp.id);
          setActiveModalShipment(null);
        }}
      />

      <AddEditShipmentModal
        isOpen={isNewShipmentOpen || Boolean(editingShipment)}
        initialShipment={editingShipment || undefined}
        onClose={() => {
          setIsNewShipmentOpen(false);
          setEditingShipment(null);
        }}
      />
    </div>
  );
};
