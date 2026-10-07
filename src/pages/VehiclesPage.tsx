import React, { useState, useMemo } from 'react';
import { 
  Truck, 
  Plus, 
  Fuel, 
  Gauge, 
  User, 
  MapPin, 
  Wrench, 
  Eye, 
  Edit2, 
  Trash2,
  ExternalLink
} from 'lucide-react';
import { useLogistics } from '../context/LogisticsContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { AdvancedFilterBar, FilterValues } from '../components/common/AdvancedFilterBar';
import { AddEditVehicleModal } from '../components/vehicles/AddEditVehicleModal';
import { VehicleDetailsModal } from '../components/vehicles/VehicleDetailsModal';
import { ConfirmationModal } from '../components/common/ConfirmationModal';
import { EmptyState } from '../components/common/EmptyState';
import { Vehicle } from '../types';
import { useNavigate } from 'react-router-dom';

export const VehiclesPage: React.FC = () => {
  const navigate = useNavigate();
  const { vehicles, deleteVehicle, setSelectedVehicle } = useLogistics();

  const [filters, setFilters] = useState<FilterValues>({
    search: '',
    status: 'ALL',
    secondaryFilter: 'ALL',
    location: '',
  });

  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [inspectingVehicle, setInspectingVehicle] = useState<Vehicle | null>(null);
  const [deletingVehicle, setDeletingVehicle] = useState<Vehicle | null>(null);

  // Status options
  const statusOptions = [
    { label: 'Available', value: 'Available' },
    { label: 'In Transit', value: 'In Transit' },
    { label: 'Maintenance', value: 'Maintenance' },
    { label: 'Out of Service', value: 'Out of Service' },
  ];

  // Secondary options: Vehicle Types
  const vehicleTypeOptions = [
    { label: 'Heavy Semi-Truck', value: 'Heavy Semi-Truck' },
    { label: 'Cargo Van', value: 'Cargo Van' },
    { label: 'Reefer Refrigerated', value: 'Reefer Refrigerated' },
    { label: 'Electric Delivery Van', value: 'Electric Delivery Van' },
    { label: 'Flatbed Truck', value: 'Flatbed Truck' },
  ];

  // Filtered vehicles
  const filteredVehicles = useMemo(() => {
    return vehicles.filter((v) => {
      // Search
      const searchMatch =
        !filters.search ||
        v.plateNumber.toLowerCase().includes(filters.search.toLowerCase()) ||
        v.model.toLowerCase().includes(filters.search.toLowerCase()) ||
        (v.currentDriverName && v.currentDriverName.toLowerCase().includes(filters.search.toLowerCase()));

      // Status
      const statusMatch = !filters.status || filters.status === 'ALL' || v.status === filters.status;

      // Secondary (Type)
      const typeMatch =
        !filters.secondaryFilter || filters.secondaryFilter === 'ALL' || v.type === filters.secondaryFilter;

      // Location
      const locationMatch =
        !filters.location ||
        v.currentLocation.city.toLowerCase().includes(filters.location.toLowerCase()) ||
        v.currentLocation.state.toLowerCase().includes(filters.location.toLowerCase());

      return searchMatch && statusMatch && typeMatch && locationMatch;
    });
  }, [vehicles, filters]);

  const handleEdit = (v: Vehicle) => {
    setEditingVehicle(v);
    setIsAddEditModalOpen(true);
  };

  const handleOpenRadar = (v: Vehicle) => {
    setSelectedVehicle(v);
    navigate('/tracking');
  };

  const handleConfirmDelete = async () => {
    if (!deletingVehicle) return;
    await deleteVehicle(deletingVehicle.id);
    setDeletingVehicle(null);
  };

  const exportToCsv = () => {
    const headers = ['ID', 'Plate Number', 'Model', 'Year', 'Type', 'Status', 'Driver', 'Fuel Level', 'Mileage', 'Location'];
    const rows = filteredVehicles.map((v) => [
      v.id,
      v.plateNumber,
      `"${v.model}"`,
      v.year,
      `"${v.type}"`,
      v.status,
      `"${v.currentDriverName || 'Unassigned'}"`,
      `${v.fuelLevel}%`,
      v.mileage,
      `"${v.currentLocation.city}, ${v.currentLocation.state}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `vehicles_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Vehicle Fleet Management
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Track asset availability, maintenance intervals, driver assignments, and fuel telemetry.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingVehicle(null);
            setIsAddEditModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all hover:scale-102 cursor-pointer active:scale-98"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Vehicle</span>
        </button>
      </div>

      {/* Advanced Filter Bar */}
      <AdvancedFilterBar
        filters={filters}
        onFilterChange={setFilters}
        statusOptions={statusOptions}
        secondaryLabel="Filter by Type"
        secondaryPlaceholder="All Vehicle Types"
        secondaryItems={vehicleTypeOptions}
        showLocationFilter={true}
        showDateFilter={false}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onExportCsv={exportToCsv}
        searchPlaceholder="Search plate number, model, or driver..."
        totalResultsCount={filteredVehicles.length}
      />

      {/* Content: Grid or Table */}
      {filteredVehicles.length === 0 ? (
        <EmptyState
          icon={Truck}
          title="No vehicles found"
          description="No fleet assets match your filter criteria. Try adjusting your search query or reset the filters."
          actionText="Add New Vehicle"
          onAction={() => {
            setEditingVehicle(null);
            setIsAddEditModalOpen(true);
          }}
          resetFilterAction={() =>
            setFilters({ search: '', status: 'ALL', secondaryFilter: 'ALL', location: '' })
          }
        />
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredVehicles.map((vehicle, index) => (
            <div
              key={vehicle.id}
              className={`glass-card card-interactive sheen-hover group rounded-2xl border border-slate-200/90 dark:border-slate-800/80 p-5 hover:border-indigo-500/50 flex flex-col justify-between shadow-xs dark:shadow-md animate-fade-in-up stagger-${Math.min(index + 1, 8)}`}
            >
              <div>
                {/* Vehicle Photo Banner */}
                <div className="relative -mx-5 -mt-5 mb-4 h-48 sm:h-52 w-[calc(100%+2.5rem)] overflow-hidden rounded-t-2xl bg-slate-900">
                  {vehicle.image ? (
                    <img
                      src={vehicle.image}
                      alt={vehicle.model}
                      className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-108"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80&w=800';
                      }}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-slate-900 text-slate-500">
                      <Truck className="h-10 w-10 opacity-40" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <StatusBadge status={vehicle.status} size="sm" />
                    {vehicle.status === 'In Transit' && (
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-500" />
                      </span>
                    )}
                  </div>
                  <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/60 backdrop-blur-md rounded-lg p-1 border border-white/20 shadow-md opacity-90 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleOpenRadar(vehicle)}
                      className="p-1 rounded-md text-slate-300 hover:text-indigo-400 hover:bg-white/10 transition-colors cursor-pointer"
                      title="View Live Radar"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleEdit(vehicle)}
                      className="p-1 rounded-md text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                      title="Edit Vehicle"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => setDeletingVehicle(vehicle)}
                      className="p-1 rounded-md text-slate-300 hover:text-rose-400 hover:bg-white/10 transition-colors cursor-pointer"
                      title="Remove Vehicle"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Card Title & Inspect */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <span className="text-base font-bold text-slate-900 dark:text-white tracking-tight">{vehicle.plateNumber}</span>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {vehicle.year} • {vehicle.model}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setInspectingVehicle(vehicle)}
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-indigo-600 dark:text-indigo-400 hover:underline transition-colors cursor-pointer"
                  >
                    <span>Inspect</span>
                    <Eye className="h-3 w-3" />
                  </button>
                </div>

                {/* Badges / Specs */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-[10px] text-slate-700 dark:text-slate-300 font-medium">
                    {vehicle.type}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-[10px] text-slate-700 dark:text-slate-300 font-medium">
                    {vehicle.fuelType}
                  </span>
                  {vehicle.maintenanceAlert && (
                    <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20 text-[10px] font-semibold flex items-center gap-1">
                      <Wrench className="h-3 w-3" /> Service Due
                    </span>
                  )}
                </div>

                {/* Telemetry info */}
                <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/90 dark:border-slate-800/80 text-xs mb-4">
                  <div>
                    <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 text-[11px] mb-0.5">
                      <Fuel className="h-3 w-3 text-indigo-600 dark:text-indigo-400" />
                      <span>Fuel Level</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-white">{vehicle.fuelLevel}%</span>
                      <div className="flex-1 bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            vehicle.fuelLevel < 25 ? 'bg-rose-500' : 'bg-emerald-500'
                          } ${vehicle.status === 'In Transit' ? 'animate-progress-stream' : ''}`}
                          style={{ width: `${vehicle.fuelLevel}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 text-[11px] mb-0.5">
                      <Gauge className="h-3 w-3 text-cyan-600 dark:text-cyan-400" />
                      <span>Speed</span>
                    </div>
                    <span className="font-bold text-slate-900 dark:text-white">{vehicle.speed} km/h</span>
                  </div>
                </div>

                {/* Location & Driver */}
                <div className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400 mb-4">
                  <div className="flex items-center gap-2">
                    <User className="h-3.5 w-3.5 text-emerald-500 dark:text-emerald-400 shrink-0" />
                    <span>Driver: </span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {vehicle.currentDriverName || 'No Driver Assigned'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-rose-500 dark:text-rose-400 shrink-0" />
                    <span className="truncate text-slate-700 dark:text-slate-300">
                      {vehicle.currentLocation.city}, {vehicle.currentLocation.state}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Card Action */}
              <button
                type="button"
                onClick={() => setInspectingVehicle(vehicle)}
                className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 dark:bg-slate-800/60 dark:hover:bg-slate-800 text-xs font-semibold dark:text-slate-300 dark:hover:text-white transition-all border border-slate-200 dark:border-slate-700/60 cursor-pointer active:scale-98"
              >
                <Eye className="h-3.5 w-3.5" />
                <span>View Full Telemetry & History</span>
              </button>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="rounded-2xl glass-card border border-slate-200/90 dark:border-slate-800/80 overflow-hidden shadow-xs dark:shadow-lg dark:shadow-black/20">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-medium">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Plate / Asset</th>
                  <th className="py-3.5 px-4 font-semibold">Model & Type</th>
                  <th className="py-3.5 px-4 font-semibold">Status</th>
                  <th className="py-3.5 px-4 font-semibold">Assigned Driver</th>
                  <th className="py-3.5 px-4 font-semibold">Fuel / Battery</th>
                  <th className="py-3.5 px-4 font-semibold">Location</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {filteredVehicles.map((vehicle, index) => (
                  <tr
                    key={vehicle.id}
                    className={`hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group animate-fade-in-up stagger-${Math.min(index + 1, 8)}`}
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        {vehicle.image ? (
                          <img
                            src={vehicle.image}
                            alt={vehicle.model}
                            className="h-11 w-16 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700 shrink-0 shadow-xs"
                            loading="lazy"
                            onError={(e) => {
                              e.currentTarget.src = 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80&w=800';
                            }}
                          />
                        ) : (
                          <div className="h-9 w-12 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 shrink-0">
                            <Truck className="h-4 w-4" />
                          </div>
                        )}
                        <span className="font-bold text-slate-900 dark:text-white font-mono">{vehicle.plateNumber}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-semibold text-slate-900 dark:text-white">{vehicle.model}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">{vehicle.type}</p>
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={vehicle.status} size="sm" />
                    </td>
                    <td className="py-3 px-4 text-slate-700 dark:text-slate-300">
                      {vehicle.currentDriverName || <span className="text-slate-400 italic">Unassigned</span>}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-white">{vehicle.fuelLevel}%</span>
                        <div className="w-16 bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              vehicle.fuelLevel < 25 ? 'bg-rose-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${vehicle.fuelLevel}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-700 dark:text-slate-300">
                      {vehicle.currentLocation.city}, {vehicle.currentLocation.state}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setInspectingVehicle(vehicle)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                          title="Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(vehicle)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeletingVehicle(vehicle)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      <AddEditVehicleModal
        isOpen={isAddEditModalOpen}
        onClose={() => {
          setIsAddEditModalOpen(false);
          setEditingVehicle(null);
        }}
        initialVehicle={editingVehicle}
      />

      {/* Details Modal */}
      <VehicleDetailsModal
        isOpen={Boolean(inspectingVehicle)}
        onClose={() => setInspectingVehicle(null)}
        vehicle={inspectingVehicle}
        onEdit={(v) => {
          setInspectingVehicle(null);
          handleEdit(v);
        }}
        onDelete={(v) => {
          setInspectingVehicle(null);
          setDeletingVehicle(v);
        }}
      />

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={Boolean(deletingVehicle)}
        onClose={() => setDeletingVehicle(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Vehicle Asset"
        message={`Are you sure you want to remove vehicle ${deletingVehicle?.plateNumber} (${deletingVehicle?.model}) from the fleet? This action cannot be undone.`}
        confirmText="Delete Vehicle"
        isDestructive={true}
      />
    </div>
  );
};
