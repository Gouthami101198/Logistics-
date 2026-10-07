import React, { useState, useMemo } from 'react';
import { 
  Package, 
  Plus, 
  MapPin, 
  Truck, 
  User, 
  Eye, 
  Edit2, 
  Trash2, 
  ExternalLink,
  CheckCircle,
  AlertTriangle,
  Play
} from 'lucide-react';
import { useLogistics } from '../context/LogisticsContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { AdvancedFilterBar, FilterValues } from '../components/common/AdvancedFilterBar';
import { AddEditShipmentModal } from '../components/shipments/AddEditShipmentModal';
import { ShipmentDetailsModal } from '../components/shipments/ShipmentDetailsModal';
import { ConfirmationModal } from '../components/common/ConfirmationModal';
import { EmptyState } from '../components/common/EmptyState';
import { Shipment, ShipmentStatus } from '../types';
import { useNavigate } from 'react-router-dom';

export const ShipmentsPage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    shipments, 
    deleteShipment, 
    updateShipmentStatus, 
    setSelectedShipment 
  } = useLogistics();

  const [filters, setFilters] = useState<FilterValues>({
    search: '',
    status: 'ALL',
    secondaryFilter: 'ALL',
    location: '',
    startDate: '',
    endDate: '',
  });

  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingShipment, setEditingShipment] = useState<Shipment | null>(null);
  const [inspectingShipment, setInspectingShipment] = useState<Shipment | null>(null);
  const [deletingShipment, setDeletingShipment] = useState<Shipment | null>(null);

  // Status options
  const statusOptions = [
    { label: 'Pending', value: 'Pending' },
    { label: 'Dispatched', value: 'Dispatched' },
    { label: 'In Transit', value: 'In Transit' },
    { label: 'Delivered', value: 'Delivered' },
    { label: 'Delayed', value: 'Delayed' },
  ];

  // Secondary options: Priority
  const priorityOptions = [
    { label: 'Standard', value: 'Standard' },
    { label: 'Express', value: 'Express' },
    { label: 'Urgent', value: 'Urgent' },
  ];

  const filteredShipments = useMemo(() => {
    return shipments.filter((s) => {
      // Search
      const searchMatch =
        !filters.search ||
        s.id.toLowerCase().includes(filters.search.toLowerCase()) ||
        s.trackingCode.toLowerCase().includes(filters.search.toLowerCase()) ||
        s.customerName.toLowerCase().includes(filters.search.toLowerCase()) ||
        s.cargoType.toLowerCase().includes(filters.search.toLowerCase()) ||
        (s.assignedDriverName && s.assignedDriverName.toLowerCase().includes(filters.search.toLowerCase())) ||
        (s.assignedVehiclePlate && s.assignedVehiclePlate.toLowerCase().includes(filters.search.toLowerCase()));

      // Status
      const statusMatch = !filters.status || filters.status === 'ALL' || s.status === filters.status;

      // Priority
      const priorityMatch =
        !filters.secondaryFilter || filters.secondaryFilter === 'ALL' || s.priority === filters.secondaryFilter;

      // Location
      const locationMatch =
        !filters.location ||
        s.origin.city.toLowerCase().includes(filters.location.toLowerCase()) ||
        s.origin.state.toLowerCase().includes(filters.location.toLowerCase()) ||
        s.destination.city.toLowerCase().includes(filters.location.toLowerCase()) ||
        s.destination.state.toLowerCase().includes(filters.location.toLowerCase());

      return searchMatch && statusMatch && priorityMatch && locationMatch;
    });
  }, [shipments, filters]);

  const handleEdit = (s: Shipment) => {
    setEditingShipment(s);
    setIsAddEditModalOpen(true);
  };

  const handleTrackRadar = (s: Shipment) => {
    setSelectedShipment(s);
    navigate('/tracking');
  };

  const handleQuickStatus = async (shipment: Shipment, nextStatus: ShipmentStatus) => {
    await updateShipmentStatus(shipment.id, nextStatus);
  };

  const handleConfirmDelete = async () => {
    if (!deletingShipment) return;
    await deleteShipment(deletingShipment.id);
    setDeletingShipment(null);
  };

  const exportToCsv = () => {
    const headers = [
      'Shipment ID',
      'Tracking Code',
      'Customer',
      'Origin',
      'Destination',
      'Status',
      'Priority',
      'Cargo',
      'Weight (kg)',
      'Vehicle',
      'Driver',
      'Est. Delivery',
    ];
    const rows = filteredShipments.map((s) => [
      s.id,
      s.trackingCode,
      `"${s.customerName}"`,
      `"${s.origin.city}, ${s.origin.state}"`,
      `"${s.destination.city}, ${s.destination.state}"`,
      s.status,
      s.priority,
      `"${s.cargoType}"`,
      s.weightKg,
      `"${s.assignedVehiclePlate || 'Unassigned'}"`,
      `"${s.assignedDriverName || 'Unassigned'}"`,
      `"${new Date(s.estimatedDelivery).toLocaleDateString()}"`,
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `shipments_manifest_${new Date().toISOString().split('T')[0]}.csv`);
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
            Shipment Operations & Dispatch
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Create consignments, monitor delivery progress, assign fleet units, and update waypoints.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingShipment(null);
            setIsAddEditModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all hover:scale-102 cursor-pointer active:scale-98"
        >
          <Plus className="h-4 w-4" />
          <span>New Shipment Consignment</span>
        </button>
      </div>

      {/* Advanced Filter Bar */}
      <AdvancedFilterBar
        filters={filters}
        onFilterChange={setFilters}
        statusOptions={statusOptions}
        secondaryLabel="Filter by Priority"
        secondaryPlaceholder="All Priorities"
        secondaryItems={priorityOptions}
        showLocationFilter={true}
        showDateFilter={true}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onExportCsv={exportToCsv}
        searchPlaceholder="Search ID, customer, tracking code, or cargo..."
        totalResultsCount={filteredShipments.length}
      />

      {/* Shipments List: Table or Grid */}
      {filteredShipments.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No shipments found"
          description="No consignment records match your active search or filter criteria. Try adjusting dates or locations."
          actionText="Create New Shipment"
          onAction={() => {
            setEditingShipment(null);
            setIsAddEditModalOpen(true);
          }}
          resetFilterAction={() =>
            setFilters({
              search: '',
              status: 'ALL',
              secondaryFilter: 'ALL',
              location: '',
              startDate: '',
              endDate: '',
            })
          }
        />
      ) : viewMode === 'table' ? (
        <div className="rounded-2xl glass-card border border-slate-200/90 dark:border-slate-800/80 overflow-hidden shadow-xs dark:shadow-lg dark:shadow-black/20">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-medium">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Shipment / ID</th>
                  <th className="py-3.5 px-4 font-semibold">Customer & Cargo</th>
                  <th className="py-3.5 px-4 font-semibold">Origin → Destination</th>
                  <th className="py-3.5 px-4 font-semibold">Status & Priority</th>
                  <th className="py-3.5 px-4 font-semibold">Route Progress</th>
                  <th className="py-3.5 px-4 font-semibold">Fleet Assignment</th>
                  <th className="py-3.5 px-4 font-semibold">Quick Stage</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {filteredShipments.map((shp, index) => (
                  <tr
                    key={shp.id}
                    className={`hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group animate-fade-in-up stagger-${Math.min(index + 1, 8)}`}
                  >
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-indigo-600 dark:text-indigo-400 font-mono text-sm">{shp.id}</p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">{shp.trackingCode}</p>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        {shp.cargoImage ? (
                          <img
                            src={shp.cargoImage}
                            alt={shp.cargoType}
                            className="h-12 w-12 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700 shrink-0 shadow-xs"
                            loading="lazy"
                            onError={(e) => {
                              e.currentTarget.src = 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=600';
                            }}
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 shrink-0">
                            <Package className="h-5 w-5" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900 dark:text-white max-w-[150px] truncate">{shp.customerName}</p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-[150px] truncate">{shp.cargoType}</p>
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">{shp.weightKg.toLocaleString()} kg</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          <span>{shp.origin.city}, {shp.origin.state}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 font-medium">
                          <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                          <span>{shp.destination.city}, {shp.destination.state}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex flex-col gap-1 items-start">
                        <StatusBadge status={shp.status} size="sm" />
                        <StatusBadge status={shp.priority} size="sm" showDot={false} />
                      </div>
                    </td>

                    <td className="py-3.5 px-4 min-w-[130px]">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-bold text-slate-900 dark:text-white font-mono">{shp.routeProgress}%</span>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400">
                            {new Date(shp.estimatedDelivery).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full bg-indigo-500 rounded-full transition-all duration-500 ${
                              shp.status === 'In Transit' ? 'animate-progress-stream' : ''
                            }`}
                            style={{ width: `${shp.routeProgress}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400">
                      <p className="font-medium text-slate-900 dark:text-white">
                        {shp.assignedVehiclePlate || <span className="text-slate-400 italic">No Vehicle</span>}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {shp.assignedDriverName || <span className="text-slate-400 italic">No Driver</span>}
                      </p>
                    </td>

                    {/* Quick Stage Transitions */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1">
                        {shp.status !== 'In Transit' && shp.status !== 'Delivered' && (
                          <button
                            type="button"
                            onClick={() => handleQuickStatus(shp, 'In Transit')}
                            className="p-1 rounded bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border border-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-400 dark:hover:bg-indigo-500/20 dark:border-indigo-500/30 transition-all cursor-pointer hover:scale-105 active:scale-95"
                            title="Dispatch / In Transit"
                          >
                            <Play className="h-3 w-3" />
                          </button>
                        )}
                        {shp.status !== 'Delivered' && (
                          <button
                            type="button"
                            onClick={() => handleQuickStatus(shp, 'Delivered')}
                            className="p-1 rounded bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:hover:bg-emerald-500/20 dark:border-emerald-500/30 transition-all cursor-pointer hover:scale-105 active:scale-95"
                            title="Mark Delivered"
                          >
                            <CheckCircle className="h-3 w-3" />
                          </button>
                        )}
                        {shp.status !== 'Delayed' && shp.status !== 'Delivered' && (
                          <button
                            type="button"
                            onClick={() => handleQuickStatus(shp, 'Delayed')}
                            className="p-1 rounded bg-amber-50 text-amber-600 hover:bg-amber-100 border border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:hover:bg-amber-500/20 dark:border-amber-500/30 transition-all cursor-pointer hover:scale-105 active:scale-95"
                            title="Report Delay"
                          >
                            <AlertTriangle className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleTrackRadar(shp)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                          title="Radar Map"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setInspectingShipment(shp)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(shp)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeletingShipment(shp)}
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
      ) : (
        /* Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredShipments.map((shp, index) => (
            <div
              key={shp.id}
              className={`glass-card card-interactive sheen-hover group rounded-2xl border border-slate-200/90 dark:border-slate-800/80 p-5 hover:border-indigo-500/50 flex flex-col justify-between shadow-xs dark:shadow-md animate-fade-in-up stagger-${Math.min(index + 1, 8)}`}
            >
              <div>
                {/* Cargo Thumbnail Header */}
                <div className="relative -mx-5 -mt-5 mb-4 h-44 sm:h-48 w-[calc(100%+2.5rem)] overflow-hidden rounded-t-2xl bg-slate-900">
                  {shp.cargoImage ? (
                    <img
                      src={shp.cargoImage}
                      alt={shp.cargoType}
                      className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-108"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=600';
                      }}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-slate-900 text-slate-500">
                      <Package className="h-8 w-8 opacity-40" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md border border-white/20 text-xs font-mono font-bold text-indigo-300 shadow-md">
                      {shp.id}
                    </span>
                    <StatusBadge status={shp.status} size="sm" />
                  </div>
                  <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/60 backdrop-blur-md rounded-lg p-1 border border-white/20 shadow-md opacity-90 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleTrackRadar(shp)}
                      className="p-1 rounded-md text-slate-300 hover:text-indigo-400 hover:bg-white/10 transition-colors cursor-pointer"
                      title="Radar Map"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleEdit(shp)}
                      className="p-1 rounded-md text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                      title="Edit Consignment"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <p className="text-sm text-slate-900 dark:text-white font-bold">{shp.customerName}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{shp.cargoType}</p>
                  </div>
                  <span className="text-xs font-mono text-slate-500 dark:text-slate-400 font-semibold">{shp.weightKg.toLocaleString()} kg</span>
                </div>

                {/* Origin / Dest */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/90 dark:border-slate-800/80 space-y-2 mb-4 text-xs">
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                    <span className="font-medium truncate">{shp.origin.city}, {shp.origin.state}</span>
                  </div>
                  <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                    <span className="font-medium truncate">{shp.destination.city}, {shp.destination.state}</span>
                  </div>
                </div>

                {/* Progress */}
                <div className="space-y-1 mb-4">
                  <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span>Progress: {shp.routeProgress}%</span>
                    <span>ETA: {new Date(shp.estimatedDelivery).toLocaleDateString()}</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full bg-indigo-500 rounded-full transition-all duration-500 ${
                        shp.status === 'In Transit' ? 'animate-progress-stream' : ''
                      }`}
                      style={{ width: `${shp.routeProgress}%` }}
                    />
                  </div>
                </div>

                {/* Fleet tags */}
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-4 pt-2 border-t border-slate-200/90 dark:border-slate-800/80">
                  <div className="flex items-center gap-1.5">
                    <Truck className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                    <span className="text-slate-700 dark:text-slate-300 font-medium">{shp.assignedVehiclePlate || 'Unassigned'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-slate-700 dark:text-slate-300 font-medium">{shp.assignedDriverName || 'Unassigned'}</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setInspectingShipment(shp)}
                className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 dark:bg-slate-800/60 dark:hover:bg-slate-800 text-xs font-semibold dark:text-slate-300 dark:hover:text-white transition-all border border-slate-200 dark:border-slate-700/60 cursor-pointer active:scale-98"
              >
                <Eye className="h-3.5 w-3.5" />
                <span>View Timeline & Checkpoints</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      <AddEditShipmentModal
        isOpen={isAddEditModalOpen}
        onClose={() => {
          setIsAddEditModalOpen(false);
          setEditingShipment(null);
        }}
        initialShipment={editingShipment}
      />

      {/* Details Modal */}
      <ShipmentDetailsModal
        isOpen={Boolean(inspectingShipment)}
        onClose={() => setInspectingShipment(null)}
        shipment={inspectingShipment}
        onEdit={(s) => {
          setInspectingShipment(null);
          handleEdit(s);
        }}
        onDelete={(s) => {
          setInspectingShipment(null);
          setDeletingShipment(s);
        }}
      />

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={Boolean(deletingShipment)}
        onClose={() => setDeletingShipment(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Shipment Record"
        message={`Are you sure you want to delete shipment ${deletingShipment?.id} (${deletingShipment?.customerName})? This action cannot be undone.`}
        confirmText="Delete Shipment"
        isDestructive={true}
      />
    </div>
  );
};
