import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Shipment, ShipmentPriority, ShipmentStatus } from '../../types';
import { useLogistics } from '../../context/LogisticsContext';

interface AddEditShipmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialShipment?: Shipment | null;
}

export const AddEditShipmentModal: React.FC<AddEditShipmentModalProps> = ({
  isOpen,
  onClose,
  initialShipment,
}) => {
  const { addShipment, updateShipment, vehicles, drivers } = useLogistics();

  const [formData, setFormData] = useState(() => ({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    cargoType: 'Industrial Components',
    cargoImage: '',
    priority: 'Standard' as ShipmentPriority,
    status: 'Pending' as ShipmentStatus,
    weightKg: 5000,
    itemsCount: 20,
    declaredValueUsd: 45000,
    assignedVehicleId: '',
    assignedDriverId: '',
    // Origin
    originAddress: '750 3rd Avenue',
    originCity: 'New York',
    originState: 'NY',
    originZip: '10017',
    originLat: 40.7527,
    originLng: -73.9723,
    // Destination
    destAddress: '1000 W Monroe St',
    destCity: 'Chicago',
    destState: 'IL',
    destZip: '60607',
    destLat: 41.8805,
    destLng: -87.653,
    estimatedDelivery: new Date(Date.now() + 48 * 3600000).toISOString().slice(0, 16),
    notes: '',
  }));

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialShipment) {
      setFormData({
        customerName: initialShipment.customerName,
        customerEmail: initialShipment.customerEmail,
        customerPhone: initialShipment.customerPhone,
        cargoType: initialShipment.cargoType,
        cargoImage: initialShipment.cargoImage || '',
        priority: initialShipment.priority,
        status: initialShipment.status,
        weightKg: initialShipment.weightKg,
        itemsCount: initialShipment.itemsCount,
        declaredValueUsd: initialShipment.declaredValueUsd,
        assignedVehicleId: initialShipment.assignedVehicleId || '',
        assignedDriverId: initialShipment.assignedDriverId || '',
        originAddress: initialShipment.origin.address,
        originCity: initialShipment.origin.city,
        originState: initialShipment.origin.state,
        originZip: initialShipment.origin.zip,
        originLat: initialShipment.origin.lat,
        originLng: initialShipment.origin.lng,
        destAddress: initialShipment.destination.address,
        destCity: initialShipment.destination.city,
        destState: initialShipment.destination.state,
        destZip: initialShipment.destination.zip,
        destLat: initialShipment.destination.lat,
        destLng: initialShipment.destination.lng,
        estimatedDelivery: initialShipment.estimatedDelivery.slice(0, 16),
        notes: initialShipment.notes || '',
      });
    } else {
      setFormData({
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        cargoType: 'Industrial Components',
        cargoImage: '',
        priority: 'Standard',
        status: 'Pending',
        weightKg: 5000,
        itemsCount: 20,
        declaredValueUsd: 45000,
        assignedVehicleId: '',
        assignedDriverId: '',
        originAddress: '750 3rd Avenue',
        originCity: 'New York',
        originState: 'NY',
        originZip: '10017',
        originLat: 40.7527,
        originLng: -73.9723,
        destAddress: '1000 W Monroe St',
        destCity: 'Chicago',
        destState: 'IL',
        destZip: '60607',
        destLat: 41.8805,
        destLng: -87.653,
        estimatedDelivery: new Date(Date.now() + 48 * 3600000).toISOString().slice(0, 16),
        notes: '',
      });
    }
    setErrors({});
  }, [initialShipment, isOpen]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.customerName.trim()) errs.customerName = 'Customer or company name is required';
    if (!formData.customerEmail.trim()) errs.customerEmail = 'Customer email is required';
    if (!formData.cargoType.trim()) errs.cargoType = 'Cargo description is required';
    if (!formData.originCity.trim()) errs.originCity = 'Origin city is required';
    if (!formData.destCity.trim()) errs.destCity = 'Destination city is required';
    if (formData.weightKg <= 0) errs.weightKg = 'Weight must be greater than 0';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setIsSubmitting(true);
      const vehicle = vehicles.find((v) => v.id === formData.assignedVehicleId);
      const driver = drivers.find((d) => d.id === formData.assignedDriverId);

      const payload = {
        customerName: formData.customerName.trim(),
        customerEmail: formData.customerEmail.trim(),
        customerPhone: formData.customerPhone.trim() || '+1 (555) 000-0000',
        origin: {
          address: formData.originAddress,
          city: formData.originCity,
          state: formData.originState,
          zip: formData.originZip,
          lat: Number(formData.originLat),
          lng: Number(formData.originLng),
        },
        destination: {
          address: formData.destAddress,
          city: formData.destCity,
          state: formData.destState,
          zip: formData.destZip,
          lat: Number(formData.destLat),
          lng: Number(formData.destLng),
        },
        currentCoordinates: {
          lat: Number(formData.originLat),
          lng: Number(formData.originLng),
        },
        status: formData.status,
        priority: formData.priority,
        assignedVehicleId: formData.assignedVehicleId || undefined,
        assignedVehiclePlate: vehicle ? vehicle.plateNumber : undefined,
        assignedDriverId: formData.assignedDriverId || undefined,
        assignedDriverName: driver ? driver.name : undefined,
        cargoType: formData.cargoType,
        cargoImage: formData.cargoImage.trim() || undefined,
        weightKg: Number(formData.weightKg),
        itemsCount: Number(formData.itemsCount),
        declaredValueUsd: Number(formData.declaredValueUsd),
        estimatedDelivery: new Date(formData.estimatedDelivery).toISOString(),
        routeProgress: initialShipment ? initialShipment.routeProgress : 0,
        timeline: initialShipment
          ? initialShipment.timeline
          : [
              {
                id: `chk-${Date.now()}`,
                status: 'Order Booked',
                description: 'Shipment created and scheduled for dispatch',
                location: `${formData.originCity}, ${formData.originState}`,
                timestamp: new Date().toLocaleString(),
                isCompleted: true,
              },
            ],
        notes: formData.notes,
      };

      if (initialShipment) {
        await updateShipment(initialShipment.id, payload);
      } else {
        await addShipment(payload);
      }
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialShipment ? `Edit Shipment: ${initialShipment.id}` : 'Create New Shipment Consignment'}
      subtitle="Fill in client details, origin, destination, cargo specs, and fleet allocation"
      maxWidth="4xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Customer Details */}
        <div className="rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 p-4 space-y-3">
          <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
            Customer & Consignee Information
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Company / Customer <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Acme Logistics Corp"
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                className={`w-full rounded-xl bg-white dark:bg-slate-950/70 border px-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none ${
                  errors.customerName ? 'border-rose-500' : 'border-slate-200 dark:border-slate-800 focus:border-indigo-500'
                }`}
              />
              {errors.customerName && <p className="text-[10px] text-rose-500 mt-1">{errors.customerName}</p>}
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Contact Email <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                placeholder="dispatch@acme.com"
                value={formData.customerEmail}
                onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                className={`w-full rounded-xl bg-white dark:bg-slate-950/70 border px-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none ${
                  errors.customerEmail ? 'border-rose-500' : 'border-slate-200 dark:border-slate-800 focus:border-indigo-500'
                }`}
              />
              {errors.customerEmail && <p className="text-[10px] text-rose-500 mt-1">{errors.customerEmail}</p>}
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">Contact Phone</label>
              <input
                type="text"
                placeholder="+1 (555) 000-0000"
                value={formData.customerPhone}
                onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                className="w-full rounded-xl bg-white dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Origin & Destination */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Origin */}
          <div className="rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 p-4 space-y-3">
            <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Pickup / Origin Point</p>
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Origin Street Address"
                value={formData.originAddress}
                onChange={(e) => setFormData({ ...formData, originAddress: e.target.value })}
                className="w-full rounded-xl bg-white dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 px-3 py-1.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder="City"
                  value={formData.originCity}
                  onChange={(e) => setFormData({ ...formData, originCity: e.target.value })}
                  className="rounded-xl bg-white dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 px-3 py-1.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
                <input
                  type="text"
                  placeholder="State (e.g. NY)"
                  value={formData.originState}
                  onChange={(e) => setFormData({ ...formData, originState: e.target.value })}
                  className="rounded-xl bg-white dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 px-3 py-1.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
                <input
                  type="text"
                  placeholder="Zip"
                  value={formData.originZip}
                  onChange={(e) => setFormData({ ...formData, originZip: e.target.value })}
                  className="rounded-xl bg-white dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 px-3 py-1.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Destination */}
          <div className="rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 p-4 space-y-3">
            <p className="text-xs font-semibold text-rose-600 dark:text-rose-400 uppercase tracking-wider">Delivery Destination Point</p>
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Destination Street Address"
                value={formData.destAddress}
                onChange={(e) => setFormData({ ...formData, destAddress: e.target.value })}
                className="w-full rounded-xl bg-white dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 px-3 py-1.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder="City"
                  value={formData.destCity}
                  onChange={(e) => setFormData({ ...formData, destCity: e.target.value })}
                  className="rounded-xl bg-white dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 px-3 py-1.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
                <input
                  type="text"
                  placeholder="State (e.g. IL)"
                  value={formData.destState}
                  onChange={(e) => setFormData({ ...formData, destState: e.target.value })}
                  className="rounded-xl bg-white dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 px-3 py-1.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
                <input
                  type="text"
                  placeholder="Zip"
                  value={formData.destZip}
                  onChange={(e) => setFormData({ ...formData, destZip: e.target.value })}
                  className="rounded-xl bg-white dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 px-3 py-1.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Cargo Specs & Priority */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">Cargo Type / Commodity</label>
            <input
              type="text"
              placeholder="e.g. High-tech Electronics"
              value={formData.cargoType}
              onChange={(e) => setFormData({ ...formData, cargoType: e.target.value })}
              className="w-full rounded-xl bg-white dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">Cargo Visual Photo URL (optional)</label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/..."
              value={formData.cargoImage}
              onChange={(e) => setFormData({ ...formData, cargoImage: e.target.value })}
              className="w-full rounded-xl bg-white dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">Weight (kg)</label>
            <input
              type="number"
              value={formData.weightKg}
              onChange={(e) => setFormData({ ...formData, weightKg: Number(e.target.value) })}
              className="w-full rounded-xl bg-white dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">Priority</label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value as ShipmentPriority })}
              className="w-full rounded-xl bg-white dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="Standard">Standard</option>
              <option value="Express">Express</option>
              <option value="Urgent">Urgent</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">Initial Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as ShipmentStatus })}
              className="w-full rounded-xl bg-white dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="Pending">Pending</option>
              <option value="Dispatched">Dispatched</option>
              <option value="In Transit">In Transit</option>
              <option value="Delivered">Delivered</option>
              <option value="Delayed">Delayed</option>
            </select>
          </div>
        </div>

        {/* Fleet Allocation: Vehicle & Driver */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">Assign Power Unit / Vehicle</label>
            <select
              value={formData.assignedVehicleId}
              onChange={(e) => setFormData({ ...formData, assignedVehicleId: e.target.value })}
              className="w-full rounded-xl bg-white dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="">Unassigned Vehicle</option>
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.plateNumber} ({v.type}) - {v.status}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">Assign Driver</label>
            <select
              value={formData.assignedDriverId}
              onChange={(e) => setFormData({ ...formData, assignedDriverId: e.target.value })}
              className="w-full rounded-xl bg-white dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="">Unassigned Driver</option>
              {drivers.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.status})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">Estimated Delivery Date & Time</label>
            <input
              type="datetime-local"
              value={formData.estimatedDelivery}
              onChange={(e) => setFormData({ ...formData, estimatedDelivery: e.target.value })}
              className="w-full rounded-xl bg-white dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">Dispatch Notes & Instructions</label>
          <textarea
            rows={2}
            placeholder="Handling conditions, gate access codes, temperature limits..."
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full rounded-xl bg-white dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800/80">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-200 bg-slate-100 rounded-xl border border-slate-200 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800 dark:bg-slate-900 dark:border-slate-700/60 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all shadow-lg shadow-indigo-500/20 active:scale-95 cursor-pointer"
          >
            {isSubmitting ? 'Processing...' : initialShipment ? 'Update Shipment' : 'Book Shipment'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
