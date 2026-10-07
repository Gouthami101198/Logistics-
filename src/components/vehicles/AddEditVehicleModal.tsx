import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Vehicle, VehicleType, VehicleStatus, FuelType } from '../../types';
import { useLogistics } from '../../context/LogisticsContext';

interface AddEditVehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialVehicle?: Vehicle | null;
}

export const AddEditVehicleModal: React.FC<AddEditVehicleModalProps> = ({
  isOpen,
  onClose,
  initialVehicle,
}) => {
  const { addVehicle, updateVehicle, drivers } = useLogistics();

  const [formData, setFormData] = useState({
    plateNumber: '',
    model: '',
    year: 2024,
    type: 'Heavy Semi-Truck' as VehicleType,
    status: 'Available' as VehicleStatus,
    image: '',
    currentDriverId: '',
    fuelLevel: 100,
    fuelType: 'Diesel' as FuelType,
    mileage: 0,
    capacityKg: 20000,
    city: 'New York',
    state: 'NY',
    address: 'Operations Hub Bay 1',
    lat: 40.7128,
    lng: -74.006,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialVehicle) {
      setFormData({
        plateNumber: initialVehicle.plateNumber,
        model: initialVehicle.model,
        year: initialVehicle.year,
        type: initialVehicle.type,
        status: initialVehicle.status,
        image: initialVehicle.image || '',
        currentDriverId: initialVehicle.currentDriverId || '',
        fuelLevel: initialVehicle.fuelLevel,
        fuelType: initialVehicle.fuelType,
        mileage: initialVehicle.mileage,
        capacityKg: initialVehicle.capacityKg,
        city: initialVehicle.currentLocation.city,
        state: initialVehicle.currentLocation.state,
        address: initialVehicle.currentLocation.address,
        lat: initialVehicle.currentLocation.lat,
        lng: initialVehicle.currentLocation.lng,
      });
    } else {
      setFormData({
        plateNumber: '',
        model: '',
        year: 2024,
        type: 'Heavy Semi-Truck',
        status: 'Available',
        image: '',
        currentDriverId: '',
        fuelLevel: 100,
        fuelType: 'Diesel',
        mileage: 0,
        capacityKg: 20000,
        city: 'New York',
        state: 'NY',
        address: 'Operations Hub Bay 1',
        lat: 40.7128,
        lng: -74.006,
      });
    }
    setErrors({});
  }, [initialVehicle, isOpen]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.plateNumber.trim()) errs.plateNumber = 'License plate is required';
    if (!formData.model.trim()) errs.model = 'Vehicle model is required';
    if (!formData.capacityKg || formData.capacityKg <= 0) errs.capacityKg = 'Capacity must be greater than 0';
    if (formData.fuelLevel < 0 || formData.fuelLevel > 100) errs.fuelLevel = 'Fuel level must be 0 - 100%';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setIsSubmitting(true);
      const selectedDriver = drivers.find((d) => d.id === formData.currentDriverId);

      const payload = {
        plateNumber: formData.plateNumber.toUpperCase().trim(),
        model: formData.model.trim(),
        year: Number(formData.year),
        type: formData.type,
        status: formData.status,
        image: formData.image.trim() || undefined,
        currentDriverId: formData.currentDriverId || undefined,
        currentDriverName: selectedDriver ? selectedDriver.name : undefined,
        fuelLevel: Number(formData.fuelLevel),
        fuelType: formData.fuelType,
        mileage: Number(formData.mileage),
        capacityKg: Number(formData.capacityKg),
        lastServiceDate: new Date().toISOString().split('T')[0],
        nextServiceDate: new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0],
        maintenanceAlert: false,
        currentLocation: {
          address: formData.address,
          city: formData.city,
          state: formData.state,
          lat: Number(formData.lat),
          lng: Number(formData.lng),
        },
        speed: formData.status === 'In Transit' ? 55 : 0,
        engineTemp: 82,
        serviceHistory: initialVehicle ? initialVehicle.serviceHistory : [],
      };

      if (initialVehicle) {
        await updateVehicle(initialVehicle.id, payload);
      } else {
        await addVehicle(payload);
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
      title={initialVehicle ? `Edit Vehicle: ${initialVehicle.plateNumber}` : 'Add New Vehicle to Fleet'}
      subtitle="Configure fleet asset specifications, driver assignment, and capacity"
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Row 1: Plate & Model */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Plate Number <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. NY-TRK-9901"
              value={formData.plateNumber}
              onChange={(e) => setFormData({ ...formData, plateNumber: e.target.value })}
              className={`w-full rounded-xl bg-slate-50 dark:bg-slate-950/70 border px-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 ${
                errors.plateNumber ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-200 dark:border-slate-800 focus:border-indigo-500 focus:ring-indigo-500'
              }`}
            />
            {errors.plateNumber && <p className="text-[11px] text-rose-500 mt-1">{errors.plateNumber}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Vehicle Model & Manufacturer <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Freightliner Cascadia 126"
              value={formData.model}
              onChange={(e) => setFormData({ ...formData, model: e.target.value })}
              className={`w-full rounded-xl bg-slate-50 dark:bg-slate-950/70 border px-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 ${
                errors.model ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-200 dark:border-slate-800 focus:border-indigo-500 focus:ring-indigo-500'
              }`}
            />
            {errors.model && <p className="text-[11px] text-rose-500 mt-1">{errors.model}</p>}
          </div>
        </div>

        {/* Row 2: Type, Year, Fuel Type */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Vehicle Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as VehicleType })}
              className="w-full rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 px-3 py-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="Heavy Semi-Truck">Heavy Semi-Truck</option>
              <option value="Cargo Van">Cargo Van</option>
              <option value="Reefer Refrigerated">Reefer Refrigerated</option>
              <option value="Electric Delivery Van">Electric Delivery Van</option>
              <option value="Flatbed Truck">Flatbed Truck</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Year</label>
            <input
              type="number"
              min="2010"
              max="2026"
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
              className="w-full rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Powertrain / Fuel</label>
            <select
              value={formData.fuelType}
              onChange={(e) => setFormData({ ...formData, fuelType: e.target.value as FuelType })}
              className="w-full rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 px-3 py-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="Diesel">Diesel</option>
              <option value="Electric">Electric</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>
        </div>

        {/* Row 3: Status, Driver, Capacity */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Operational Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as VehicleStatus })}
              className="w-full rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 px-3 py-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="Available">Available</option>
              <option value="In Transit">In Transit</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Out of Service">Out of Service</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Assign Driver</label>
            <select
              value={formData.currentDriverId}
              onChange={(e) => setFormData({ ...formData, currentDriverId: e.target.value })}
              className="w-full rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 px-3 py-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="">No Driver (Unassigned)</option>
              {drivers.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.status})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Capacity (kg)</label>
            <input
              type="number"
              value={formData.capacityKg}
              onChange={(e) => setFormData({ ...formData, capacityKg: Number(e.target.value) })}
              className="w-full rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Row 4: Fuel Level & Mileage */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Fuel Level (%)</label>
              <span className="text-xs text-indigo-600 dark:text-indigo-400 font-bold">{formData.fuelLevel}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={formData.fuelLevel}
              onChange={(e) => setFormData({ ...formData, fuelLevel: Number(e.target.value) })}
              className="w-full accent-indigo-600 cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Odometer Mileage (km)</label>
            <input
              type="number"
              value={formData.mileage}
              onChange={(e) => setFormData({ ...formData, mileage: Number(e.target.value) })}
              className="w-full rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Vehicle Photo URL */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Vehicle Photo URL (optional)
          </label>
          <input
            type="url"
            placeholder="e.g. https://images.unsplash.com/..."
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            className="w-full rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200/90 dark:border-slate-800/80">
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
            className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all shadow-lg shadow-indigo-500/20 cursor-pointer active:scale-95"
          >
            {isSubmitting ? 'Saving...' : initialVehicle ? 'Update Vehicle' : 'Add Vehicle'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
