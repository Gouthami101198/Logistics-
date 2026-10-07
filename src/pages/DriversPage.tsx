import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Plus, 
  Star, 
  ShieldCheck, 
  Clock, 
  Truck, 
  Phone, 
  Eye, 
  Edit2, 
  Trash2
} from 'lucide-react';
import { useLogistics } from '../context/LogisticsContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { AdvancedFilterBar, FilterValues } from '../components/common/AdvancedFilterBar';
import { AddEditDriverModal } from '../components/drivers/AddEditDriverModal';
import { DriverDetailsModal } from '../components/drivers/DriverDetailsModal';
import { ConfirmationModal } from '../components/common/ConfirmationModal';
import { EmptyState } from '../components/common/EmptyState';
import { Driver } from '../types';

export const DriversPage: React.FC = () => {
  const { drivers, deleteDriver } = useLogistics();

  const [filters, setFilters] = useState<FilterValues>({
    search: '',
    status: 'ALL',
    secondaryFilter: 'ALL',
  });

  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
  const [inspectingDriver, setInspectingDriver] = useState<Driver | null>(null);
  const [deletingDriver, setDeletingDriver] = useState<Driver | null>(null);

  // Status options
  const statusOptions = [
    { label: 'On Duty', value: 'On Duty' },
    { label: 'On Delivery', value: 'On Delivery' },
    { label: 'Off Duty', value: 'Off Duty' },
    { label: 'Resting', value: 'Resting' },
  ];

  // License type options
  const licenseTypeOptions = [
    { label: 'CDL Class A', value: 'CDL Class A' },
    { label: 'CDL Class B', value: 'CDL Class B' },
    { label: 'Standard Commercial', value: 'Standard Commercial' },
  ];

  const filteredDrivers = useMemo(() => {
    return drivers.filter((d) => {
      // Search
      const searchMatch =
        !filters.search ||
        d.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        d.email.toLowerCase().includes(filters.search.toLowerCase()) ||
        d.licenseNumber.toLowerCase().includes(filters.search.toLowerCase()) ||
        (d.assignedVehiclePlate && d.assignedVehiclePlate.toLowerCase().includes(filters.search.toLowerCase()));

      // Status
      const statusMatch = !filters.status || filters.status === 'ALL' || d.status === filters.status;

      // License type
      const licenseMatch =
        !filters.secondaryFilter || filters.secondaryFilter === 'ALL' || d.licenseType === filters.secondaryFilter;

      return searchMatch && statusMatch && licenseMatch;
    });
  }, [drivers, filters]);

  const handleEdit = (d: Driver) => {
    setEditingDriver(d);
    setIsAddEditModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingDriver) return;
    await deleteDriver(deletingDriver.id);
    setDeletingDriver(null);
  };

  const exportToCsv = () => {
    const headers = ['ID', 'Name', 'Email', 'Phone', 'License Class', 'License #', 'Duty Status', 'Assigned Vehicle', 'On Time Rate', 'Rating', 'Safety Score'];
    const rows = filteredDrivers.map((d) => [
      d.id,
      `"${d.name}"`,
      d.email,
      `"${d.phone}"`,
      `"${d.licenseType}"`,
      d.licenseNumber,
      d.status,
      `"${d.assignedVehiclePlate || 'Unassigned'}"`,
      `${d.onTimeRate}%`,
      d.rating,
      `${d.safetyScore}%`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `drivers_export_${new Date().toISOString().split('T')[0]}.csv`);
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
            Commercial Driver Roster
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage certified operators, track duty hours, safety performance metrics, and asset assignments.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingDriver(null);
            setIsAddEditModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all hover:scale-102 cursor-pointer active:scale-98"
        >
          <Plus className="h-4 w-4" />
          <span>Onboard New Driver</span>
        </button>
      </div>

      {/* Advanced Filter Bar */}
      <AdvancedFilterBar
        filters={filters}
        onFilterChange={setFilters}
        statusOptions={statusOptions}
        secondaryLabel="Filter by License"
        secondaryPlaceholder="All License Classes"
        secondaryItems={licenseTypeOptions}
        showLocationFilter={false}
        showDateFilter={false}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onExportCsv={exportToCsv}
        searchPlaceholder="Search driver name, email, or CDL number..."
        totalResultsCount={filteredDrivers.length}
      />

      {/* Grid or Table View */}
      {filteredDrivers.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No drivers found"
          description="No drivers match your current filter criteria. Adjust your search or clear filters to view the roster."
          actionText="Onboard New Driver"
          onAction={() => {
            setEditingDriver(null);
            setIsAddEditModalOpen(true);
          }}
          resetFilterAction={() => setFilters({ search: '', status: 'ALL', secondaryFilter: 'ALL' })}
        />
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredDrivers.map((driver, index) => (
            <div
              key={driver.id}
              className={`glass-card card-interactive sheen-hover group rounded-2xl border border-slate-200/90 dark:border-slate-800/80 p-5 hover:border-indigo-500/50 flex flex-col justify-between shadow-xs dark:shadow-md animate-fade-in-up stagger-${Math.min(index + 1, 8)}`}
            >
              <div>
                {/* Header: Avatar, Name, Status */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={driver.avatar}
                      alt={driver.name}
                      className="h-12 w-12 rounded-2xl object-cover ring-2 ring-indigo-500/20 shrink-0 shadow-xs"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256';
                      }}
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-base font-bold text-slate-900 dark:text-white tracking-tight">{driver.name}</span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {driver.licenseType} • {driver.experienceYears}y exp
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEdit(driver)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                      title="Edit Profile"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setDeletingDriver(driver)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                      title="Remove Driver"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="mb-4">
                  <StatusBadge status={driver.status} size="sm" />
                </div>

                {/* Performance Metrics Grid */}
                <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/90 dark:border-slate-800/80 text-center mb-4">
                  <div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1 mb-0.5">
                      <Star className="h-3 w-3 text-amber-500 fill-amber-500 dark:text-amber-400 dark:fill-amber-400" /> Rating
                    </span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">{driver.rating}</span>
                  </div>
                  <div className="border-x border-slate-200 dark:border-slate-800 px-1">
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1 mb-0.5">
                      <Clock className="h-3 w-3 text-emerald-500 dark:text-emerald-400" /> On-Time
                    </span>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{driver.onTimeRate}%</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1 mb-0.5">
                      <ShieldCheck className="h-3 w-3 text-cyan-600 dark:text-cyan-400" /> Safety
                    </span>
                    <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400">{driver.safetyScore}%</span>
                  </div>
                </div>

                {/* Assigned Vehicle & Contacts */}
                <div className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400 mb-4">
                  <div className="flex items-center gap-2">
                    <Truck className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                    <span>Power Unit: </span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {driver.assignedVehiclePlate || 'Unassigned (Floater)'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 text-emerald-500 dark:text-emerald-400 shrink-0" />
                    <span className="text-slate-700 dark:text-slate-300">{driver.phone}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Card Action */}
              <button
                type="button"
                onClick={() => setInspectingDriver(driver)}
                className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 dark:bg-slate-800/60 dark:hover:bg-slate-800 text-xs font-semibold dark:text-slate-300 dark:hover:text-white transition-all border border-slate-200 dark:border-slate-700/60 cursor-pointer active:scale-98"
              >
                <Eye className="h-3.5 w-3.5" />
                <span>View Full Scorecard & History</span>
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
                  <th className="py-3.5 px-4 font-semibold">Driver Profile</th>
                  <th className="py-3.5 px-4 font-semibold">Duty Status</th>
                  <th className="py-3.5 px-4 font-semibold">License</th>
                  <th className="py-3.5 px-4 font-semibold">Power Unit</th>
                  <th className="py-3.5 px-4 font-semibold">On-Time</th>
                  <th className="py-3.5 px-4 font-semibold">Rating</th>
                  <th className="py-3.5 px-4 font-semibold">Safety Score</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {filteredDrivers.map((driver, index) => (
                  <tr
                    key={driver.id}
                    className={`hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group animate-fade-in-up stagger-${Math.min(index + 1, 8)}`}
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={driver.avatar}
                          alt={driver.name}
                          className="h-8 w-8 rounded-xl object-cover ring-1 ring-indigo-500/20 shrink-0"
                          onError={(e) => {
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256';
                          }}
                        />
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white">{driver.name}</p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">{driver.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={driver.status} size="sm" />
                    </td>
                    <td className="py-3 px-4 text-slate-700 dark:text-slate-300">
                      <p>{driver.licenseType}</p>
                      <p className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">{driver.licenseNumber}</p>
                    </td>
                    <td className="py-3 px-4 text-slate-700 dark:text-slate-300">
                      {driver.assignedVehiclePlate || <span className="text-slate-400 italic">Unassigned</span>}
                    </td>
                    <td className="py-3 px-4 font-semibold text-emerald-600 dark:text-emerald-400">{driver.onTimeRate}%</td>
                    <td className="py-3 px-4 font-semibold text-amber-600 dark:text-amber-400">
                      <span className="flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500 dark:fill-amber-400 dark:text-amber-400" /> {driver.rating}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-cyan-600 dark:text-cyan-400">{driver.safetyScore}%</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setInspectingDriver(driver)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                          title="Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(driver)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeletingDriver(driver)}
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
      <AddEditDriverModal
        isOpen={isAddEditModalOpen}
        onClose={() => {
          setIsAddEditModalOpen(false);
          setEditingDriver(null);
        }}
        initialDriver={editingDriver}
      />

      {/* Details Modal */}
      <DriverDetailsModal
        isOpen={Boolean(inspectingDriver)}
        onClose={() => setInspectingDriver(null)}
        driver={inspectingDriver}
        onEdit={(d) => {
          setInspectingDriver(null);
          handleEdit(d);
        }}
        onDelete={(d) => {
          setInspectingDriver(null);
          setDeletingDriver(d);
        }}
      />

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={Boolean(deletingDriver)}
        onClose={() => setDeletingDriver(null)}
        onConfirm={handleConfirmDelete}
        title="Remove Driver Record"
        message={`Are you sure you want to remove driver ${deletingDriver?.name} from the active fleet roster?`}
        confirmText="Remove Driver"
        isDestructive={true}
      />
    </div>
  );
};
