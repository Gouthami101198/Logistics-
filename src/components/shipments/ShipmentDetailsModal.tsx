import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { StatusBadge } from '../common/StatusBadge';
import { Shipment, ShipmentStatus } from '../../types';
import { 
  Package, 
  MapPin, 
  Truck, 
  User, 
  Calendar, 
  CheckCircle2, 
  Circle, 
  Edit2, 
  Trash2, 
  ExternalLink,
  DollarSign,
  Layers,
  Scale
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLogistics } from '../../context/LogisticsContext';

interface ShipmentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  shipment: Shipment | null;
  onEdit: (shipment: Shipment) => void;
  onDelete: (shipment: Shipment) => void;
}

export const ShipmentDetailsModal: React.FC<ShipmentDetailsModalProps> = ({
  isOpen,
  onClose,
  shipment,
  onEdit,
  onDelete,
}) => {
  const navigate = useNavigate();
  const { updateShipmentStatus, setSelectedShipment } = useLogistics();
  const [statusNote, setStatusNote] = useState('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  if (!shipment) return null;

  const handleTrackOnMap = () => {
    setSelectedShipment(shipment);
    onClose();
    navigate('/tracking');
  };

  const handleStatusChange = async (newStatus: ShipmentStatus) => {
    if (newStatus === shipment.status) return;
    try {
      setIsUpdatingStatus(true);
      await updateShipmentStatus(shipment.id, newStatus, statusNote || undefined);
      setStatusNote('');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Shipment: ${shipment.id}`}
      subtitle={`Tracking #${shipment.trackingCode} • Client: ${shipment.customerName}`}
      maxWidth="4xl"
    >
      <div className="space-y-5">
        {/* Top Header Row with Status & Quick Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
              <Package className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-slate-900 dark:text-white">{shipment.id}</span>
                <StatusBadge status={shipment.status} />
                <StatusBadge status={shipment.priority} size="sm" />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Booked: {new Date(shipment.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleTrackOnMap}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-semibold border border-indigo-200 dark:border-indigo-500/30 transition-colors cursor-pointer"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Live Map
            </button>
            <button
              onClick={() => onEdit(shipment)}
              className="p-1.5 rounded-lg bg-white dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60 transition-colors cursor-pointer"
              title="Edit Shipment"
            >
              <Edit2 className="h-4 w-4" />
            </button>
            <button
              onClick={() => onDelete(shipment)}
              className="p-1.5 rounded-lg bg-white dark:bg-slate-800/60 hover:bg-rose-50 dark:hover:bg-rose-500/20 text-slate-700 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 hover:border-rose-300 dark:hover:border-rose-500/30 border border-slate-200 dark:border-slate-700/60 transition-colors cursor-pointer"
              title="Delete Shipment"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Route Progress Bar */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-semibold text-slate-700 dark:text-slate-300">Transit Progress</span>
            <span className="font-bold text-indigo-600 dark:text-indigo-400">{shipment.routeProgress}%</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
            <div
              className="h-full rounded-full bg-indigo-500 transition-all duration-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"
              style={{ width: `${shipment.routeProgress}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mt-3 pt-2 border-t border-slate-200 dark:border-slate-800/80">
            <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
              <MapPin className="h-3.5 w-3.5" />
              <span className="font-semibold">{shipment.origin.city}, {shipment.origin.state}</span>
            </div>
            <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400">
              <MapPin className="h-3.5 w-3.5" />
              <span className="font-semibold">{shipment.destination.city}, {shipment.destination.state}</span>
            </div>
          </div>
        </div>

        {/* Status Controller Bar */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold text-slate-900 dark:text-white">Update Shipment Status</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Change operational stage to notify consignee and trigger alerts</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {(['Dispatched', 'In Transit', 'Delayed', 'Delivered'] as ShipmentStatus[]).map((st) => (
              <button
                key={st}
                disabled={isUpdatingStatus || shipment.status === st}
                onClick={() => handleStatusChange(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  shipment.status === st
                    ? 'bg-indigo-600 text-white cursor-default shadow-md shadow-indigo-500/20'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700/60'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Two Columns: Specs & Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left Column: Cargo Details & Fleet */}
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Cargo & Specifications</p>
                {shipment.temperatureControl && (
                  <span className="text-[11px] text-cyan-600 dark:text-cyan-400 font-medium bg-cyan-50 dark:bg-cyan-500/10 px-2 py-0.5 rounded-md border border-cyan-200 dark:border-cyan-500/20">
                    {shipment.temperatureControl}
                  </span>
                )}
              </div>

              {shipment.cargoImage && (
                <div className="relative h-36 w-full overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900">
                  <img
                    src={shipment.cargoImage}
                    alt={shipment.cargoType}
                    className="h-full w-full object-cover object-center"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=600';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                  <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-xs text-white">
                    <span className="font-semibold">{shipment.cargoType}</span>
                    <span className="font-mono text-slate-200">{shipment.weightKg.toLocaleString()} kg</span>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <Package className="h-3.5 w-3.5 text-indigo-500 dark:text-indigo-400" />
                  <span className="truncate">{shipment.cargoType}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <Scale className="h-3.5 w-3.5 text-cyan-500 dark:text-cyan-400" />
                  <span>{shipment.weightKg.toLocaleString()} kg</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <Layers className="h-3.5 w-3.5 text-amber-500 dark:text-amber-400" />
                  <span>{shipment.itemsCount} Packages</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <DollarSign className="h-3.5 w-3.5 text-emerald-500 dark:text-emerald-400" />
                  <span>${shipment.declaredValueUsd.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Assigned Fleet */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 space-y-3">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Fleet Assignment</p>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <Truck className="h-4 w-4 text-indigo-500 dark:text-indigo-400" />
                  <span>Power Unit:</span>
                </div>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {shipment.assignedVehiclePlate || 'Unassigned'}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <User className="h-4 w-4 text-emerald-500 dark:text-emerald-400" />
                  <span>Operator:</span>
                </div>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {shipment.assignedDriverName || 'Unassigned'}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <Calendar className="h-4 w-4 text-amber-500 dark:text-amber-400" />
                  <span>Est. Delivery:</span>
                </div>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {new Date(shipment.estimatedDelivery).toLocaleString()}
                </span>
              </div>
            </div>

            {shipment.notes && (
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 text-xs">
                <p className="text-slate-800 dark:text-slate-300 font-semibold mb-1">Dispatch Notes:</p>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{shipment.notes}</p>
              </div>
            )}
          </div>

          {/* Right Column: Tracking Checkpoints Timeline */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 flex flex-col">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3.5">
              Tracking Checkpoints & Delivery History
            </p>

            <div className="space-y-4 flex-1">
              {shipment.timeline.map((chk, index) => (
                <div key={chk.id || index} className="flex items-start gap-3 relative">
                  {/* Vertical connecting line */}
                  {index < shipment.timeline.length - 1 && (
                    <div className="absolute left-2.5 top-5 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-800 -mb-4" />
                  )}

                  <div className="mt-0.5 z-10">
                    {chk.isCompleted ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-500 dark:text-emerald-400 fill-emerald-500/20" />
                    ) : (
                      <Circle className="h-5 w-5 text-slate-300 dark:text-slate-600" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0 text-xs">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`font-semibold ${chk.isCompleted ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-slate-500'}`}>
                        {chk.status}
                      </span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500">{chk.timestamp}</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 text-[11px] mt-0.5">{chk.description}</p>
                    <p className="text-slate-400 dark:text-slate-500 text-[10px] mt-0.5 font-mono">{chk.location}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
