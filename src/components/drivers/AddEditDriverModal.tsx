import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Driver, DriverStatus } from '../../types';
import { useLogistics } from '../../context/LogisticsContext';

interface AddEditDriverModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDriver?: Driver | null;
}

export const AddEditDriverModal: React.FC<AddEditDriverModalProps> = ({
  isOpen,
  onClose,
  initialDriver,
}) => {
  const { addDriver, updateDriver, vehicles } = useLogistics();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    licenseNumber: '',
    licenseType: 'CDL Class A' as Driver['licenseType'],
    experienceYears: 5,
    status: 'On Duty' as DriverStatus,
    assignedVehicleId: '',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRel: 'Spouse',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialDriver) {
      setFormData({
        name: initialDriver.name,
        email: initialDriver.email,
        phone: initialDriver.phone,
        licenseNumber: initialDriver.licenseNumber,
        licenseType: initialDriver.licenseType,
        experienceYears: initialDriver.experienceYears,
        status: initialDriver.status,
        assignedVehicleId: initialDriver.assignedVehicleId || '',
        avatar: initialDriver.avatar,
        emergencyContactName: initialDriver.emergencyContact?.name || '',
        emergencyContactPhone: initialDriver.emergencyContact?.phone || '',
        emergencyContactRel: initialDriver.emergencyContact?.relationship || 'Spouse',
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        licenseNumber: '',
        licenseType: 'CDL Class A',
        experienceYears: 5,
        status: 'On Duty',
        assignedVehicleId: '',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256',
        emergencyContactName: '',
        emergencyContactPhone: '',
        emergencyContactRel: 'Spouse',
      });
    }
    setErrors({});
  }, [initialDriver, isOpen]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Full name is required';
    if (!formData.email.trim() || !formData.email.includes('@')) errs.email = 'Valid email is required';
    if (!formData.phone.trim()) errs.phone = 'Phone number is required';
    if (!formData.licenseNumber.trim()) errs.licenseNumber = 'CDL / Driver license number is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setIsSubmitting(true);
      const vehicle = vehicles.find((v) => v.id === formData.assignedVehicleId);

      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        avatar: formData.avatar,
        licenseNumber: formData.licenseNumber.trim().toUpperCase(),
        licenseType: formData.licenseType,
        experienceYears: Number(formData.experienceYears),
        status: formData.status,
        assignedVehicleId: formData.assignedVehicleId || undefined,
        assignedVehiclePlate: vehicle ? vehicle.plateNumber : undefined,
        rating: initialDriver ? initialDriver.rating : 4.9,
        onTimeRate: initialDriver ? initialDriver.onTimeRate : 98.5,
        safetyScore: initialDriver ? initialDriver.safetyScore : 99.0,
        totalTrips: initialDriver ? initialDriver.totalTrips : 12,
        totalDistanceKm: initialDriver ? initialDriver.totalDistanceKm : 4500,
        joinDate: initialDriver ? initialDriver.joinDate : new Date().toISOString().split('T')[0],
        emergencyContact: {
          name: formData.emergencyContactName || 'Family Member',
          phone: formData.emergencyContactPhone || formData.phone,
          relationship: formData.emergencyContactRel || 'Spouse',
        },
        deliveryHistory: initialDriver ? initialDriver.deliveryHistory : [],
      };

      if (initialDriver) {
        await updateDriver(initialDriver.id, payload);
      } else {
        await addDriver(payload);
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
      title={initialDriver ? `Edit Driver: ${initialDriver.name}` : 'Onboard New Driver'}
      subtitle="Driver profile, commercial license verification, and vehicle assignment"
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Row 1: Name & Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Full Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Elena Rostova"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`w-full rounded-xl bg-slate-50 dark:bg-slate-950/70 border px-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 ${
                errors.name ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-200 dark:border-slate-800 focus:border-indigo-500 focus:ring-indigo-500'
              }`}
            />
            {errors.name && <p className="text-[11px] text-rose-500 mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Email Address <span className="text-rose-500">*</span>
            </label>
            <input
              type="email"
              placeholder="e.g. e.rostova@logitrack.io"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={`w-full rounded-xl bg-slate-50 dark:bg-slate-950/70 border px-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 ${
                errors.email ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-200 dark:border-slate-800 focus:border-indigo-500 focus:ring-indigo-500'
              }`}
            />
            {errors.email && <p className="text-[11px] text-rose-500 mt-1">{errors.email}</p>}
          </div>
        </div>

        {/* Row 2: Phone & License */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Mobile Phone <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. +1 (555) 345-6789"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className={`w-full rounded-xl bg-slate-50 dark:bg-slate-950/70 border px-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 ${
                errors.phone ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-200 dark:border-slate-800 focus:border-indigo-500 focus:ring-indigo-500'
              }`}
            />
            {errors.phone && <p className="text-[11px] text-rose-500 mt-1">{errors.phone}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Commercial License Number <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. CDL-IL-4412093"
              value={formData.licenseNumber}
              onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
              className={`w-full rounded-xl bg-slate-50 dark:bg-slate-950/70 border px-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 ${
                errors.licenseNumber
                  ? 'border-rose-500 focus:ring-rose-500'
                  : 'border-slate-200 dark:border-slate-800 focus:border-indigo-500 focus:ring-indigo-500'
              }`}
            />
            {errors.licenseNumber && <p className="text-[11px] text-rose-500 mt-1">{errors.licenseNumber}</p>}
          </div>
        </div>

        {/* Row 3: License Type, Experience, Duty Status */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">License Class</label>
            <select
              value={formData.licenseType}
              onChange={(e) => setFormData({ ...formData, licenseType: e.target.value as Driver['licenseType'] })}
              className="w-full rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="CDL Class A">CDL Class A (Semi / Heavy)</option>
              <option value="CDL Class B">CDL Class B (Straight Truck)</option>
              <option value="Standard Commercial">Standard Commercial Van</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Experience (Years)</label>
            <input
              type="number"
              min="1"
              max="45"
              value={formData.experienceYears}
              onChange={(e) => setFormData({ ...formData, experienceYears: Number(e.target.value) })}
              className="w-full rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Duty Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as DriverStatus })}
              className="w-full rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="On Duty">On Duty</option>
              <option value="On Delivery">On Delivery</option>
              <option value="Off Duty">Off Duty</option>
              <option value="Resting">Resting</option>
            </select>
          </div>
        </div>

        {/* Row 4: Assigned Vehicle */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Assign to Vehicle</label>
          <select
            value={formData.assignedVehicleId}
            onChange={(e) => setFormData({ ...formData, assignedVehicleId: e.target.value })}
            className="w-full rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
          >
            <option value="">No Vehicle Assigned (Floater)</option>
            {vehicles.map((v) => (
              <option key={v.id} value={v.id}>
                {v.plateNumber} • {v.model} ({v.status})
              </option>
            ))}
          </select>
        </div>

        {/* Row 5: Emergency Contact */}
        <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 space-y-3">
          <p className="text-xs font-semibold text-slate-800 dark:text-slate-300">Emergency Contact</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <input
                type="text"
                placeholder="Contact Name"
                value={formData.emergencyContactName}
                onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
                className="w-full rounded-xl bg-white dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 px-3 py-1.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="Contact Phone"
                value={formData.emergencyContactPhone}
                onChange={(e) => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
                className="w-full rounded-xl bg-white dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 px-3 py-1.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="Relationship (e.g. Spouse)"
                value={formData.emergencyContactRel}
                onChange={(e) => setFormData({ ...formData, emergencyContactRel: e.target.value })}
                className="w-full rounded-xl bg-white dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 px-3 py-1.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
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
            {isSubmitting ? 'Saving...' : initialDriver ? 'Update Profile' : 'Onboard Driver'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
