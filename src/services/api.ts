import { Vehicle, Driver, Shipment, AlertNotification, FleetStats } from '../types';
import { INITIAL_VEHICLES, INITIAL_DRIVERS, INITIAL_SHIPMENTS, INITIAL_ALERTS } from '../data/mockData';

const STORAGE_KEYS = {
  VEHICLES: 'logitrack_vehicles_v2',
  DRIVERS: 'logitrack_drivers_v2',
  SHIPMENTS: 'logitrack_shipments_v2',
  ALERTS: 'logitrack_alerts_v2',
};

// Helper for simulated network delay (can be set to 0 for instant or 150-300ms for realistic UI feel)
const delay = (ms: number = 200) => new Promise((resolve) => setTimeout(resolve, ms));

function getFromStorage<T>(key: string, defaultVal: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(defaultVal));
      return defaultVal;
    }
    return JSON.parse(raw);
  } catch {
    return defaultVal;
  }
}

function saveToStorage<T>(key: string, val: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (err) {
    console.error('Failed to save to localStorage:', err);
  }
}

export const vehicleService = {
  async getAll(): Promise<Vehicle[]> {
    await delay(180);
    return getFromStorage<Vehicle[]>(STORAGE_KEYS.VEHICLES, INITIAL_VEHICLES);
  },

  async getById(id: string): Promise<Vehicle | null> {
    await delay(100);
    const list = getFromStorage<Vehicle[]>(STORAGE_KEYS.VEHICLES, INITIAL_VEHICLES);
    return list.find((v) => v.id === id) || null;
  },

  async create(data: Omit<Vehicle, 'id'>): Promise<Vehicle> {
    await delay(250);
    const list = getFromStorage<Vehicle[]>(STORAGE_KEYS.VEHICLES, INITIAL_VEHICLES);
    const newVehicle: Vehicle = {
      ...data,
      id: `veh-${Date.now().toString().slice(-4)}`,
    };
    const updated = [newVehicle, ...list];
    saveToStorage(STORAGE_KEYS.VEHICLES, updated);
    return newVehicle;
  },

  async update(id: string, updates: Partial<Vehicle>): Promise<Vehicle> {
    await delay(200);
    const list = getFromStorage<Vehicle[]>(STORAGE_KEYS.VEHICLES, INITIAL_VEHICLES);
    const index = list.findIndex((v) => v.id === id);
    if (index === -1) throw new Error('Vehicle not found');
    const updatedVehicle = { ...list[index], ...updates };
    list[index] = updatedVehicle;
    saveToStorage(STORAGE_KEYS.VEHICLES, list);
    return updatedVehicle;
  },

  async delete(id: string): Promise<void> {
    await delay(200);
    const list = getFromStorage<Vehicle[]>(STORAGE_KEYS.VEHICLES, INITIAL_VEHICLES);
    const filtered = list.filter((v) => v.id !== id);
    saveToStorage(STORAGE_KEYS.VEHICLES, filtered);
  },

  async assignDriver(vehicleId: string, driverId?: string, driverName?: string): Promise<Vehicle> {
    await delay(200);
    const list = getFromStorage<Vehicle[]>(STORAGE_KEYS.VEHICLES, INITIAL_VEHICLES);
    const index = list.findIndex((v) => v.id === vehicleId);
    if (index === -1) throw new Error('Vehicle not found');
    list[index] = {
      ...list[index],
      currentDriverId: driverId,
      currentDriverName: driverName,
    };
    saveToStorage(STORAGE_KEYS.VEHICLES, list);
    return list[index];
  },
};

export const driverService = {
  async getAll(): Promise<Driver[]> {
    await delay(180);
    return getFromStorage<Driver[]>(STORAGE_KEYS.DRIVERS, INITIAL_DRIVERS);
  },

  async getById(id: string): Promise<Driver | null> {
    await delay(100);
    const list = getFromStorage<Driver[]>(STORAGE_KEYS.DRIVERS, INITIAL_DRIVERS);
    return list.find((d) => d.id === id) || null;
  },

  async create(data: Omit<Driver, 'id'>): Promise<Driver> {
    await delay(250);
    const list = getFromStorage<Driver[]>(STORAGE_KEYS.DRIVERS, INITIAL_DRIVERS);
    const newDriver: Driver = {
      ...data,
      id: `drv-${Date.now().toString().slice(-4)}`,
    };
    const updated = [newDriver, ...list];
    saveToStorage(STORAGE_KEYS.DRIVERS, updated);
    return newDriver;
  },

  async update(id: string, updates: Partial<Driver>): Promise<Driver> {
    await delay(200);
    const list = getFromStorage<Driver[]>(STORAGE_KEYS.DRIVERS, INITIAL_DRIVERS);
    const index = list.findIndex((d) => d.id === id);
    if (index === -1) throw new Error('Driver not found');
    const updatedDriver = { ...list[index], ...updates };
    list[index] = updatedDriver;
    saveToStorage(STORAGE_KEYS.DRIVERS, list);
    return updatedDriver;
  },

  async delete(id: string): Promise<void> {
    await delay(200);
    const list = getFromStorage<Driver[]>(STORAGE_KEYS.DRIVERS, INITIAL_DRIVERS);
    const filtered = list.filter((d) => d.id !== id);
    saveToStorage(STORAGE_KEYS.DRIVERS, filtered);
  },
};

export const shipmentService = {
  async getAll(): Promise<Shipment[]> {
    await delay(180);
    return getFromStorage<Shipment[]>(STORAGE_KEYS.SHIPMENTS, INITIAL_SHIPMENTS);
  },

  async getById(id: string): Promise<Shipment | null> {
    await delay(100);
    const list = getFromStorage<Shipment[]>(STORAGE_KEYS.SHIPMENTS, INITIAL_SHIPMENTS);
    return list.find((s) => s.id === id || s.trackingCode === id) || null;
  },

  async create(data: Omit<Shipment, 'id' | 'trackingCode' | 'createdAt'>): Promise<Shipment> {
    await delay(250);
    const list = getFromStorage<Shipment[]>(STORAGE_KEYS.SHIPMENTS, INITIAL_SHIPMENTS);
    const randNum = Math.floor(1000 + Math.random() * 9000);
    const newShipment: Shipment = {
      ...data,
      id: `SHP-${randNum}`,
      trackingCode: `TRK-US-${randNum}${Math.floor(100 + Math.random() * 900)}`,
      createdAt: new Date().toISOString(),
    };
    const updated = [newShipment, ...list];
    saveToStorage(STORAGE_KEYS.SHIPMENTS, updated);
    return newShipment;
  },

  async update(id: string, updates: Partial<Shipment>): Promise<Shipment> {
    await delay(200);
    const list = getFromStorage<Shipment[]>(STORAGE_KEYS.SHIPMENTS, INITIAL_SHIPMENTS);
    const index = list.findIndex((s) => s.id === id);
    if (index === -1) throw new Error('Shipment not found');
    const updatedShipment = { ...list[index], ...updates };
    list[index] = updatedShipment;
    saveToStorage(STORAGE_KEYS.SHIPMENTS, list);
    return updatedShipment;
  },

  async updateStatus(id: string, newStatus: Shipment['status'], note?: string): Promise<Shipment> {
    await delay(180);
    const list = getFromStorage<Shipment[]>(STORAGE_KEYS.SHIPMENTS, INITIAL_SHIPMENTS);
    const index = list.findIndex((s) => s.id === id);
    if (index === -1) throw new Error('Shipment not found');
    
    const current = list[index];
    const newCheckpoint = {
      id: `chk-${Date.now()}`,
      status: `Status changed to ${newStatus}`,
      description: note || `Shipment marked as ${newStatus} by Dispatch Control`,
      location: current.currentCoordinates ? `${current.origin.city} -> ${current.destination.city}` : 'Operations Center',
      timestamp: new Date().toLocaleString(),
      isCompleted: true,
    };

    const updatedShipment: Shipment = {
      ...current,
      status: newStatus,
      routeProgress: newStatus === 'Delivered' ? 100 : current.routeProgress,
      actualDelivery: newStatus === 'Delivered' ? new Date().toISOString() : current.actualDelivery,
      timeline: [...current.timeline, newCheckpoint],
    };

    list[index] = updatedShipment;
    saveToStorage(STORAGE_KEYS.SHIPMENTS, list);
    return updatedShipment;
  },

  async delete(id: string): Promise<void> {
    await delay(200);
    const list = getFromStorage<Shipment[]>(STORAGE_KEYS.SHIPMENTS, INITIAL_SHIPMENTS);
    const filtered = list.filter((s) => s.id !== id);
    saveToStorage(STORAGE_KEYS.SHIPMENTS, filtered);
  },
};

export const alertService = {
  async getAll(): Promise<AlertNotification[]> {
    await delay(100);
    return getFromStorage<AlertNotification[]>(STORAGE_KEYS.ALERTS, INITIAL_ALERTS);
  },

  async markAsRead(id: string): Promise<void> {
    const list = getFromStorage<AlertNotification[]>(STORAGE_KEYS.ALERTS, INITIAL_ALERTS);
    const updated = list.map((a) => (a.id === id ? { ...a, isRead: true } : a));
    saveToStorage(STORAGE_KEYS.ALERTS, updated);
  },

  async markAllAsRead(): Promise<void> {
    const list = getFromStorage<AlertNotification[]>(STORAGE_KEYS.ALERTS, INITIAL_ALERTS);
    const updated = list.map((a) => ({ ...a, isRead: true }));
    saveToStorage(STORAGE_KEYS.ALERTS, updated);
  },

  async addAlert(alert: Omit<AlertNotification, 'id' | 'timestamp' | 'isRead'>): Promise<AlertNotification> {
    const list = getFromStorage<AlertNotification[]>(STORAGE_KEYS.ALERTS, INITIAL_ALERTS);
    const newAlert: AlertNotification = {
      ...alert,
      id: `alt-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString(),
      isRead: false,
    };
    saveToStorage(STORAGE_KEYS.ALERTS, [newAlert, ...list]);
    return newAlert;
  },

  async removeAlert(id: string): Promise<void> {
    const list = getFromStorage<AlertNotification[]>(STORAGE_KEYS.ALERTS, INITIAL_ALERTS);
    const updated = list.filter((a) => a.id !== id);
    saveToStorage(STORAGE_KEYS.ALERTS, updated);
  },
};

export const calculateFleetStats = (
  vehicles: Vehicle[],
  drivers: Driver[],
  shipments: Shipment[]
): FleetStats => {
  const activeVehicles = vehicles.filter((v) => v.status === 'In Transit').length;
  const maintenanceVehicles = vehicles.filter((v) => v.status === 'Maintenance').length;
  const availableVehicles = vehicles.filter((v) => v.status === 'Available').length;

  const onDutyDrivers = drivers.filter((d) => d.status === 'On Duty' || d.status === 'On Delivery').length;

  const deliveredShipments = shipments.filter((s) => s.status === 'Delivered').length;
  const inTransitShipments = shipments.filter((s) => s.status === 'In Transit').length;
  const delayedShipments = shipments.filter((s) => s.status === 'Delayed').length;
  const activeShipments = shipments.filter((s) => s.status === 'In Transit' || s.status === 'Dispatched' || s.status === 'Delayed').length;

  const totalDelivered = shipments.filter((s) => s.status === 'Delivered').length;
  const onTimeRate = totalDelivered > 0 
    ? Math.round((deliveredShipments / (deliveredShipments + Math.max(1, delayedShipments))) * 100) 
    : 96.5;

  return {
    totalVehicles: vehicles.length,
    activeVehicles,
    maintenanceVehicles,
    availableVehicles,
    totalDrivers: drivers.length,
    onDutyDrivers,
    totalShipments: shipments.length,
    activeShipments,
    deliveredShipments,
    inTransitShipments,
    delayedShipments,
    onTimeDeliveryRate: onTimeRate,
    averageSpeedKmh: 64.8,
    totalFuelEfficiency: 8.4,
    totalDistanceTodayKm: 14280,
  };
};

export const resetToDefaults = () => {
  localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(INITIAL_VEHICLES));
  localStorage.setItem(STORAGE_KEYS.DRIVERS, JSON.stringify(INITIAL_DRIVERS));
  localStorage.setItem(STORAGE_KEYS.SHIPMENTS, JSON.stringify(INITIAL_SHIPMENTS));
  localStorage.setItem(STORAGE_KEYS.ALERTS, JSON.stringify(INITIAL_ALERTS));
};
