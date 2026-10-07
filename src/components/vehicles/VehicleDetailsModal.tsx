import React from 'react';
import { Modal } from '../common/Modal';
import { StatusBadge } from '../common/StatusBadge';
import { Vehicle } from '../../types';
import { 
  Fuel, 
  Gauge, 
  MapPin, 
  User, 
  Wrench, 
  Activity, 
  Calendar,
  ExternalLink,
  Edit2,
  Trash2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface VehicleDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: Vehicle | null;
  onEdit: (vehicle: Vehicle) => void;
  onDelete: (vehicle: Vehicle) => void;
}

export const VehicleDetailsModal: React.FC<VehicleDetailsModalProps> = ({
  isOpen,
  onClose,
  vehicle,
  onEdit,
  onDelete,
}) => {
  const navigate = useNavigate();

  if (!vehicle) return null;

  const handleTrackOnMap = () => {
    onClose();
    navigate('/tracking');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Vehicle Fleet Asset: ${vehicle.plateNumber}`}
      subtitle={`${vehicle.year} ${vehicle.model} • ${vehicle.type}`}
      maxWidth="2xl"
    >
      <div className="space-y-5">
        {/* Vehicle Image Banner */}
        {vehicle.image && (
          <div className="relative h-44 w-full overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900">
            <img
              src={vehicle.image}
              alt={vehicle.model}
              className="h-full w-full object-cover object-center"
              onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80&w=800';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-white drop-shadow">{vehicle.year} {vehicle.model}</p>
                <p className="text-xs text-slate-200 drop-shadow">{vehicle.type} • {vehicle.fuelType}</p>
              </div>
              <StatusBadge status={vehicle.status} />
            </div>
          </div>
        )}

        {/* Top Header Card */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-lg">
              {vehicle.plateNumber.slice(0, 2)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-slate-900 dark:text-white">{vehicle.plateNumber}</span>
                <StatusBadge status={vehicle.status} />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{vehicle.type} ({vehicle.fuelType})</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleTrackOnMap}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-semibold border border-indigo-200 dark:border-indigo-500/30 transition-colors cursor-pointer"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Live Radar
            </button>
            <button
              onClick={() => onEdit(vehicle)}
              className="p-1.5 rounded-lg bg-white dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60 transition-colors cursor-pointer"
              title="Edit Vehicle"
            >
              <Edit2 className="h-4 w-4" />
            </button>
            <button
              onClick={() => onDelete(vehicle)}
              className="p-1.5 rounded-lg bg-white dark:bg-slate-800/60 hover:bg-rose-50 dark:hover:bg-rose-500/20 text-slate-700 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 hover:border-rose-300 dark:hover:border-rose-500/30 border border-slate-200 dark:border-slate-700/60 transition-colors cursor-pointer"
              title="Delete Vehicle"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Telemetry Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
              <span className="text-[11px] font-medium">Fuel / Battery</span>
              <Fuel className="h-3.5 w-3.5 text-indigo-500 dark:text-indigo-400" />
            </div>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{vehicle.fuelLevel}%</p>
            <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  vehicle.fuelLevel < 25 ? 'bg-rose-500' : vehicle.fuelLevel < 50 ? 'bg-amber-400' : 'bg-emerald-500'
                }`}
                style={{ width: `${vehicle.fuelLevel}%` }}
              />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
              <span className="text-[11px] font-medium">Current Speed</span>
              <Gauge className="h-3.5 w-3.5 text-cyan-500 dark:text-cyan-400" />
            </div>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{vehicle.speed} km/h</p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">Engine: {vehicle.engineTemp}°C</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
              <span className="text-[11px] font-medium">Odometer</span>
              <Activity className="h-3.5 w-3.5 text-purple-500 dark:text-purple-400" />
            </div>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{vehicle.mileage.toLocaleString()} km</p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">Cap: {vehicle.capacityKg.toLocaleString()} kg</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
              <span className="text-[11px] font-medium">Next Service</span>
              <Calendar className="h-3.5 w-3.5 text-amber-500 dark:text-amber-400" />
            </div>
            <p className="text-xs font-bold text-slate-900 dark:text-white mt-1">{vehicle.nextServiceDate}</p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">Last: {vehicle.lastServiceDate}</p>
          </div>
        </div>

        {/* Current Location & Assigned Driver */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-slate-300 mb-2">
              <MapPin className="h-4 w-4 text-rose-500" />
              <span>Current GPS Position</span>
            </div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">{vehicle.currentLocation.address}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{vehicle.currentLocation.city}, {vehicle.currentLocation.state}</p>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 font-mono mt-2">
              Coords: {vehicle.currentLocation.lat.toFixed(4)}, {vehicle.currentLocation.lng.toFixed(4)}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-slate-300 mb-2">
              <User className="h-4 w-4 text-emerald-500" />
              <span>Driver Assignment</span>
            </div>
            {vehicle.currentDriverName ? (
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">{vehicle.currentDriverName}</p>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-0.5 font-medium">Active Driver in Unit</p>
                <p className="text-[11px] text-slate-500 mt-2">Driver ID: {vehicle.currentDriverId}</p>
              </div>
            ) : (
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">No driver currently assigned</p>
                <p className="text-xs text-amber-500 mt-1">Vehicle parked at terminal depot</p>
              </div>
            )}
          </div>
        </div>

        {/* Maintenance History */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-slate-300 mb-3">
            <Wrench className="h-4 w-4 text-indigo-500 dark:text-indigo-400" />
            <span>Service & Maintenance History</span>
          </div>
          {vehicle.serviceHistory && vehicle.serviceHistory.length > 0 ? (
            <div className="space-y-2.5">
              {vehicle.serviceHistory.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs shadow-xs"
                >
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">{item.type}</p>
                    <p className="text-slate-500 dark:text-slate-400 text-[11px]">{item.notes}</p>
                  </div>
                  <div className="text-right shrink-0 ml-3">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">${item.cost.toLocaleString()}</span>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500">{item.date}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500">No recent maintenance records logged.</p>
          )}
        </div>
      </div>
    </Modal>
  );
};
