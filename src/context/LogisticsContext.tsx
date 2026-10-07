import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { Vehicle, Driver, Shipment, AlertNotification, FleetStats } from '../types';
import { vehicleService, driverService, shipmentService, alertService, calculateFleetStats, resetToDefaults } from '../services/api';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title?: string;
  message: string;
}

interface LogisticsContextType {
  vehicles: Vehicle[];
  drivers: Driver[];
  shipments: Shipment[];
  alerts: AlertNotification[];
  stats: FleetStats;
  loading: boolean;
  error: string | null;
  
  // Selection
  selectedShipment: Shipment | null;
  selectedVehicle: Vehicle | null;
  selectedDriver: Driver | null;
  setSelectedShipment: (s: Shipment | null) => void;
  setSelectedVehicle: (v: Vehicle | null) => void;
  setSelectedDriver: (d: Driver | null) => void;

  // Drawer & simulation
  isNotificationDrawerOpen: boolean;
  setIsNotificationDrawerOpen: (open: boolean) => void;
  toggleNotificationDrawer: () => void;
  isLiveSimulationActive: boolean;
  toggleLiveSimulation: () => void;

  // Actions - Vehicles
  addVehicle: (vehicle: Omit<Vehicle, 'id'>) => Promise<Vehicle>;
  updateVehicle: (id: string, updates: Partial<Vehicle>) => Promise<Vehicle>;
  deleteVehicle: (id: string) => Promise<void>;
  assignDriverToVehicle: (vehicleId: string, driverId?: string) => Promise<void>;

  // Actions - Drivers
  addDriver: (driver: Omit<Driver, 'id'>) => Promise<Driver>;
  updateDriver: (id: string, updates: Partial<Driver>) => Promise<Driver>;
  deleteDriver: (id: string) => Promise<void>;

  // Actions - Shipments
  addShipment: (shipment: Omit<Shipment, 'id' | 'trackingCode' | 'createdAt'>) => Promise<Shipment>;
  updateShipment: (id: string, updates: Partial<Shipment>) => Promise<Shipment>;
  updateShipmentStatus: (id: string, status: Shipment['status'], note?: string) => Promise<Shipment>;
  deleteShipment: (id: string) => Promise<void>;

  // Actions - Alerts
  markAlertAsRead: (id: string) => Promise<void>;
  markAllAlertsAsRead: () => Promise<void>;
  dismissAlert: (id: string) => Promise<void>;

  // Toast
  toasts: ToastMessage[];
  addToast: (message: string, type?: ToastMessage['type'], title?: string) => void;
  removeToast: (id: string) => void;

  // Reset
  resetData: () => Promise<void>;
  refreshAll: () => Promise<void>;
}

const LogisticsContext = createContext<LogisticsContextType | undefined>(undefined);

export const LogisticsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [alerts, setAlerts] = useState<AlertNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);
  const [isLiveSimulationActive, setIsLiveSimulationActive] = useState(true);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((message: string, type: ToastMessage['type'] = 'info', title?: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts((prev) => [...prev, { id, message, type, title }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toggleNotificationDrawer = useCallback(() => {
    setIsNotificationDrawerOpen((prev) => !prev);
  }, []);

  const toggleLiveSimulation = useCallback(() => {
    setIsLiveSimulationActive((prev) => {
      const next = !prev;
      addToast(next ? 'Live GPS Simulation activated' : 'Live GPS Simulation paused', 'info');
      return next;
    });
  }, [addToast]);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [vData, dData, sData, aData] = await Promise.all([
        vehicleService.getAll(),
        driverService.getAll(),
        shipmentService.getAll(),
        alertService.getAll(),
      ]);
      setVehicles(vData);
      setDrivers(dData);
      setShipments(sData);
      setAlerts(aData);
      if (sData.length > 0 && !selectedShipment) {
        setSelectedShipment(sData[0]);
      }
    } catch (err: unknown) {
      console.error('Failed to load logistics data:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to connect to logistics data';
      setError(errorMessage);
      addToast('Error loading logistics data', 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast, selectedShipment]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Periodic simulated live GPS coordinate jitter & progress update for in-transit shipments
  useEffect(() => {
    if (!isLiveSimulationActive) return;

    const interval = setInterval(() => {
      setShipments((prevShipments) =>
        prevShipments.map((shp) => {
          if (shp.status === 'In Transit') {
            // slight movement toward destination
            const dLat = (shp.destination.lat - shp.currentCoordinates.lat) * 0.015;
            const dLng = (shp.destination.lng - shp.currentCoordinates.lng) * 0.015;
            const newProgress = Math.min(99, shp.routeProgress + 0.5);

            return {
              ...shp,
              currentCoordinates: {
                lat: Number((shp.currentCoordinates.lat + dLat).toFixed(5)),
                lng: Number((shp.currentCoordinates.lng + dLng).toFixed(5)),
              },
              routeProgress: Number(newProgress.toFixed(1)),
            };
          }
          return shp;
        })
      );

      // update vehicles in transit as well
      setVehicles((prevVehicles) =>
        prevVehicles.map((veh) => {
          if (veh.status === 'In Transit') {
            const jitterLat = (Math.random() - 0.5) * 0.002;
            const jitterLng = (Math.random() - 0.5) * 0.002;
            const speedJitter = Math.min(85, Math.max(45, veh.speed + (Math.random() - 0.5) * 3));
            return {
              ...veh,
              speed: Math.round(speedJitter),
              currentLocation: {
                ...veh.currentLocation,
                lat: Number((veh.currentLocation.lat + jitterLat).toFixed(5)),
                lng: Number((veh.currentLocation.lng + jitterLng).toFixed(5)),
              },
            };
          }
          return veh;
        })
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [isLiveSimulationActive]);

  // Actions: Vehicles
  const addVehicle = async (data: Omit<Vehicle, 'id'>) => {
    try {
      const created = await vehicleService.create(data);
      setVehicles((prev) => [created, ...prev]);
      addToast(`Vehicle ${created.plateNumber} added to fleet`, 'success');
      return created;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to add vehicle';
      addToast(msg, 'error');
      throw err;
    }
  };

  const updateVehicle = async (id: string, updates: Partial<Vehicle>) => {
    try {
      const updated = await vehicleService.update(id, updates);
      setVehicles((prev) => prev.map((v) => (v.id === id ? updated : v)));
      if (selectedVehicle?.id === id) {
        setSelectedVehicle(updated);
      }
      addToast(`Vehicle ${updated.plateNumber} updated`, 'success');
      return updated;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update vehicle';
      addToast(msg, 'error');
      throw err;
    }
  };

  const deleteVehicle = async (id: string) => {
    try {
      await vehicleService.delete(id);
      setVehicles((prev) => prev.filter((v) => v.id !== id));
      if (selectedVehicle?.id === id) setSelectedVehicle(null);
      addToast('Vehicle removed from fleet', 'info');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete vehicle';
      addToast(msg, 'error');
      throw err;
    }
  };

  const assignDriverToVehicle = async (vehicleId: string, driverId?: string) => {
    try {
      const driver = drivers.find((d) => d.id === driverId);
      const updatedVehicle = await vehicleService.assignDriver(vehicleId, driverId, driver?.name);
      setVehicles((prev) => prev.map((v) => (v.id === vehicleId ? updatedVehicle : v)));

      if (driverId) {
        // also link driver
        await driverService.update(driverId, {
          assignedVehicleId: vehicleId,
          assignedVehiclePlate: updatedVehicle.plateNumber,
        });
        setDrivers((prev) =>
          prev.map((d) =>
            d.id === driverId
              ? { ...d, assignedVehicleId: vehicleId, assignedVehiclePlate: updatedVehicle.plateNumber }
              : d
          )
        );
      }
      addToast(`Driver ${driver ? driver.name : 'unassigned'} linked to ${updatedVehicle.plateNumber}`, 'success');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to assign driver';
      addToast(msg, 'error');
      throw err;
    }
  };

  // Actions: Drivers
  const addDriver = async (data: Omit<Driver, 'id'>) => {
    try {
      const created = await driverService.create(data);
      setDrivers((prev) => [created, ...prev]);
      addToast(`Driver ${created.name} onboarded`, 'success');
      return created;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to onboard driver';
      addToast(msg, 'error');
      throw err;
    }
  };

  const updateDriver = async (id: string, updates: Partial<Driver>) => {
    try {
      const updated = await driverService.update(id, updates);
      setDrivers((prev) => prev.map((d) => (d.id === id ? updated : d)));
      if (selectedDriver?.id === id) {
        setSelectedDriver(updated);
      }
      addToast(`Driver profile for ${updated.name} updated`, 'success');
      return updated;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update driver';
      addToast(msg, 'error');
      throw err;
    }
  };

  const deleteDriver = async (id: string) => {
    try {
      await driverService.delete(id);
      setDrivers((prev) => prev.filter((d) => d.id !== id));
      if (selectedDriver?.id === id) setSelectedDriver(null);
      addToast('Driver profile removed', 'info');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete driver';
      addToast(msg, 'error');
      throw err;
    }
  };

  // Actions: Shipments
  const addShipment = async (data: Omit<Shipment, 'id' | 'trackingCode' | 'createdAt'>) => {
    try {
      const created = await shipmentService.create(data);
      setShipments((prev) => [created, ...prev]);
      setSelectedShipment(created);
      
      // Auto-generate notification alert for urgent shipments or dispatches
      if (created.priority === 'Urgent') {
        const newAlert = await alertService.addAlert({
          type: 'delayed_shipment',
          title: `Urgent Priority Dispatch: ${created.id}`,
          description: `Consignment for ${created.customerName} marked Urgent priority to ${created.destination.city}.`,
          severity: 'high',
          relatedId: created.id,
          relatedType: 'shipment',
        });
        setAlerts((prev) => [newAlert, ...prev]);
      }

      addToast(`Shipment ${created.id} created successfully`, 'success', 'Shipment Booked');
      return created;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to create shipment';
      addToast(msg, 'error');
      throw err;
    }
  };

  const updateShipment = async (id: string, updates: Partial<Shipment>) => {
    try {
      const updated = await shipmentService.update(id, updates);
      setShipments((prev) => prev.map((s) => (s.id === id ? updated : s)));
      if (selectedShipment?.id === id) {
        setSelectedShipment(updated);
      }
      addToast(`Shipment ${updated.id} updated`, 'success');
      return updated;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update shipment';
      addToast(msg, 'error');
      throw err;
    }
  };

  const updateShipmentStatus = async (id: string, status: Shipment['status'], note?: string) => {
    try {
      const updated = await shipmentService.updateStatus(id, status, note);
      setShipments((prev) => prev.map((s) => (s.id === id ? updated : s)));
      if (selectedShipment?.id === id) {
        setSelectedShipment(updated);
      }

      // Add corresponding alert if delayed or delivered
      if (status === 'Delayed') {
        const alert = await alertService.addAlert({
          type: 'delayed_shipment',
          title: `Shipment Delayed: ${id}`,
          description: note || `Shipment ${id} reported an unexpected delay in transit.`,
          severity: 'high',
          relatedId: id,
          relatedType: 'shipment',
        });
        setAlerts((prev) => [alert, ...prev]);
      } else if (status === 'Delivered') {
        const alert = await alertService.addAlert({
          type: 'delivery_update',
          title: `Delivered: ${id}`,
          description: `Consignment ${id} marked as delivered to ${updated.destination.city}.`,
          severity: 'low',
          relatedId: id,
          relatedType: 'shipment',
        });
        setAlerts((prev) => [alert, ...prev]);
      }

      addToast(`Shipment ${id} status set to ${status}`, 'success');
      return updated;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update status';
      addToast(msg, 'error');
      throw err;
    }
  };

  const deleteShipment = async (id: string) => {
    try {
      await shipmentService.delete(id);
      setShipments((prev) => prev.filter((s) => s.id !== id));
      if (selectedShipment?.id === id) setSelectedShipment(null);
      addToast(`Shipment ${id} deleted`, 'info');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete shipment';
      addToast(msg, 'error');
      throw err;
    }
  };

  // Actions: Alerts
  const markAlertAsRead = async (id: string) => {
    await alertService.markAsRead(id);
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, isRead: true } : a)));
  };

  const markAllAlertsAsRead = async () => {
    await alertService.markAllAsRead();
    setAlerts((prev) => prev.map((a) => ({ ...a, isRead: true })));
    addToast('All alerts marked as read', 'info');
  };

  const dismissAlert = async (id: string) => {
    await alertService.removeAlert(id);
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  const resetData = async () => {
    resetToDefaults();
    await loadData();
    addToast('Demo database reset to factory defaults', 'info');
  };

  const refreshAll = async () => {
    try {
      await loadData();
      // Jitter and advance in-transit coordinates to provide live visual GPS progression
      setShipments((prevShipments) =>
        prevShipments.map((shp) => {
          if (shp.status === 'In Transit') {
            const dLat = (shp.destination.lat - shp.currentCoordinates.lat) * 0.02;
            const dLng = (shp.destination.lng - shp.currentCoordinates.lng) * 0.02;
            const newProgress = Math.min(99, shp.routeProgress + 0.6);
            return {
              ...shp,
              currentCoordinates: {
                lat: Number((shp.currentCoordinates.lat + dLat).toFixed(5)),
                lng: Number((shp.currentCoordinates.lng + dLng).toFixed(5)),
              },
              routeProgress: Number(newProgress.toFixed(1)),
            };
          }
          return shp;
        })
      );
      setVehicles((prevVehicles) =>
        prevVehicles.map((veh) => {
          if (veh.status === 'In Transit') {
            const jitterLat = (Math.random() - 0.5) * 0.002;
            const jitterLng = (Math.random() - 0.5) * 0.002;
            const speedJitter = Math.min(88, Math.max(48, veh.speed + (Math.random() - 0.5) * 4));
            return {
              ...veh,
              speed: Math.round(speedJitter),
              currentLocation: {
                ...veh.currentLocation,
                lat: Number((veh.currentLocation.lat + jitterLat).toFixed(5)),
                lng: Number((veh.currentLocation.lng + jitterLng).toFixed(5)),
              },
            };
          }
          return veh;
        })
      );
      addToast('Fleet telemetry and operations refreshed', 'success');
    } catch (err: unknown) {
      console.error('Refresh error:', err);
      addToast('Failed to refresh fleet telemetry', 'error');
    }
  };

  const stats = useMemo(() => calculateFleetStats(vehicles, drivers, shipments), [vehicles, drivers, shipments]);

  const value = {
    vehicles,
    drivers,
    shipments,
    alerts,
    stats,
    loading,
    error,
    selectedShipment,
    selectedVehicle,
    selectedDriver,
    setSelectedShipment,
    setSelectedVehicle,
    setSelectedDriver,
    isNotificationDrawerOpen,
    setIsNotificationDrawerOpen,
    toggleNotificationDrawer,
    isLiveSimulationActive,
    toggleLiveSimulation,
    addVehicle,
    updateVehicle,
    deleteVehicle,
    assignDriverToVehicle,
    addDriver,
    updateDriver,
    deleteDriver,
    addShipment,
    updateShipment,
    updateShipmentStatus,
    deleteShipment,
    markAlertAsRead,
    markAllAlertsAsRead,
    dismissAlert,
    toasts,
    addToast,
    removeToast,
    resetData,
    refreshAll,
  };

  return <LogisticsContext.Provider value={value}>{children}</LogisticsContext.Provider>;
};

export const useLogistics = () => {
  const context = useContext(LogisticsContext);
  if (!context) {
    throw new Error('useLogistics must be used within a LogisticsProvider');
  }
  return context;
};
