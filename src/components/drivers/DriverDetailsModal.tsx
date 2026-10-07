import React from 'react';
import { Modal } from '../common/Modal';
import { StatusBadge } from '../common/StatusBadge';
import { Driver } from '../../types';
import { 
  Star, 
  ShieldCheck, 
  Clock, 
  Truck, 
  Phone, 
  Mail, 
  Award, 
  Edit2, 
  Trash2,
  Calendar,
  Package
} from 'lucide-react';

interface DriverDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  driver: Driver | null;
  onEdit: (driver: Driver) => void;
  onDelete: (driver: Driver) => void;
}

export const DriverDetailsModal: React.FC<DriverDetailsModalProps> = ({
  isOpen,
  onClose,
  driver,
  onEdit,
  onDelete,
}) => {
  if (!driver) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Driver Profile: ${driver.name}`}
      subtitle={`${driver.licenseType} • Lic #${driver.licenseNumber}`}
      maxWidth="2xl"
    >
      <div className="space-y-5">
        {/* Top Header Card */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80">
          <div className="flex items-center gap-3.5">
            <img
              src={driver.avatar}
              alt={driver.name}
              className="h-14 w-14 rounded-2xl object-cover ring-2 ring-indigo-500/30"
              onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256';
              }}
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-slate-900 dark:text-white">{driver.name}</span>
                <StatusBadge status={driver.status} />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {driver.licenseType} • {driver.experienceYears} Years Commercial Exp.
              </p>
              <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <Phone className="h-3 w-3 text-indigo-500 dark:text-indigo-400" />
                  {driver.phone}
                </span>
                <span className="flex items-center gap-1">
                  <Mail className="h-3 w-3 text-indigo-500 dark:text-indigo-400" />
                  {driver.email}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(driver)}
              className="p-2 rounded-lg bg-white dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60 transition-colors cursor-pointer"
              title="Edit Profile"
            >
              <Edit2 className="h-4 w-4" />
            </button>
            <button
              onClick={() => onDelete(driver)}
              className="p-2 rounded-lg bg-white dark:bg-slate-800/60 hover:bg-rose-50 dark:hover:bg-rose-500/20 text-slate-700 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 hover:border-rose-300 dark:hover:border-rose-500/30 border border-slate-200 dark:border-slate-700/60 transition-colors cursor-pointer"
              title="Remove Driver"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Performance Scorecard */}
        <div>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2.5">
            Driver Performance Metrics
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
                <span className="text-[11px] font-medium">Customer Rating</span>
                <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
              </div>
              <p className="text-lg font-bold text-slate-900 dark:text-white">{driver.rating} / 5.0</p>
              <p className="text-[10px] text-slate-500 mt-1">Based on feedback</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
                <span className="text-[11px] font-medium">On-Time Rate</span>
                <Clock className="h-3.5 w-3.5 text-emerald-500 dark:text-emerald-400" />
              </div>
              <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{driver.onTimeRate}%</p>
              <p className="text-[10px] text-slate-500 mt-1">Target: &gt;95%</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
                <span className="text-[11px] font-medium">Safety Score</span>
                <ShieldCheck className="h-3.5 w-3.5 text-cyan-500 dark:text-cyan-400" />
              </div>
              <p className="text-lg font-bold text-cyan-600 dark:text-cyan-400">{driver.safetyScore}%</p>
              <p className="text-[10px] text-slate-500 mt-1">Zero DOT violations</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
                <span className="text-[11px] font-medium">Total Trips</span>
                <Award className="h-3.5 w-3.5 text-purple-500 dark:text-purple-400" />
              </div>
              <p className="text-lg font-bold text-slate-900 dark:text-white">{driver.totalTrips.toLocaleString()}</p>
              <p className="text-[10px] text-slate-500 mt-1">{(driver.totalDistanceKm).toLocaleString()} km logged</p>
            </div>
          </div>
        </div>

        {/* Assigned Vehicle & Emergency Contact */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-slate-300 mb-2">
              <Truck className="h-4 w-4 text-indigo-500 dark:text-indigo-400" />
              <span>Assigned Vehicle</span>
            </div>
            {driver.assignedVehiclePlate ? (
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">{driver.assignedVehiclePlate}</p>
                <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-0.5 font-medium">Primary Power Unit</p>
                <p className="text-[11px] text-slate-500 mt-1">Asset ID: {driver.assignedVehicleId}</p>
              </div>
            ) : (
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">No Vehicle Assigned</p>
                <p className="text-xs text-slate-500 mt-0.5">Currently available for dispatch pooling</p>
              </div>
            )}
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-slate-300 mb-2">
              <Calendar className="h-4 w-4 text-emerald-500 dark:text-emerald-400" />
              <span>Employment & Emergency Contact</span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300">
              <span className="text-slate-500 font-medium">Onboarding Date:</span> {driver.joinDate}
            </p>
            <p className="text-xs text-slate-700 dark:text-slate-300 mt-1">
              <span className="text-slate-500 font-medium">Emergency:</span> {driver.emergencyContact?.name} ({driver.emergencyContact?.relationship})
            </p>
            <p className="text-xs text-slate-700 dark:text-slate-300 mt-0.5">
              <span className="text-slate-500 font-medium">Contact:</span> {driver.emergencyContact?.phone}
            </p>
          </div>
        </div>

        {/* Recent Delivery History */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-slate-300 mb-3">
            <Package className="h-4 w-4 text-cyan-500 dark:text-cyan-400" />
            <span>Recent Delivery Assignments</span>
          </div>
          {driver.deliveryHistory && driver.deliveryHistory.length > 0 ? (
            <div className="space-y-2">
              {driver.deliveryHistory.map((trip, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs shadow-xs"
                >
                  <div>
                    <span className="font-semibold text-indigo-600 dark:text-indigo-400 mr-2">{trip.shipmentId}</span>
                    <span className="text-slate-700 dark:text-slate-300">{trip.destination}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-slate-400 dark:text-slate-500">{trip.date}</span>
                    <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-500/20">
                      {trip.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500">No completed trips archived yet.</p>
          )}
        </div>
      </div>
    </Modal>
  );
};
