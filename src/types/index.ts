export type VehicleStatus = 'Available' | 'In Transit' | 'Maintenance' | 'Out of Service';

export type VehicleType = 
  | 'Heavy Semi-Truck' 
  | 'Cargo Van' 
  | 'Reefer Refrigerated' 
  | 'Electric Delivery Van' 
  | 'Flatbed Truck';

export type FuelType = 'Diesel' | 'Electric' | 'Hybrid';

export interface Vehicle {
  id: string;
  plateNumber: string;
  model: string;
  year: number;
  type: VehicleType;
  status: VehicleStatus;
  image?: string;
  currentDriverId?: string;
  currentDriverName?: string;
  fuelLevel: number; // 0 - 100%
  fuelType: FuelType;
  mileage: number; // in km or miles
  capacityKg: number;
  lastServiceDate: string;
  nextServiceDate: string;
  maintenanceAlert: boolean;
  currentLocation: {
    address: string;
    city: string;
    state: string;
    lat: number;
    lng: number;
  };
  speed: number; // km/h
  engineTemp: number; // Celsius
  batteryHealth?: number; // for electric
  serviceHistory: Array<{
    id: string;
    date: string;
    type: string;
    cost: number;
    notes: string;
  }>;
}

export type DriverStatus = 'On Duty' | 'Off Duty' | 'On Delivery' | 'Resting';

export interface Driver {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  licenseNumber: string;
  licenseType: 'CDL Class A' | 'CDL Class B' | 'Standard Commercial';
  experienceYears: number;
  status: DriverStatus;
  assignedVehicleId?: string;
  assignedVehiclePlate?: string;
  rating: number; // e.g. 4.9
  onTimeRate: number; // percentage, e.g. 98.4
  safetyScore: number; // percentage, e.g. 99
  totalTrips: number;
  totalDistanceKm: number;
  joinDate: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  deliveryHistory: Array<{
    shipmentId: string;
    destination: string;
    date: string;
    status: 'Completed' | 'Delayed' | 'Failed';
    rating: number;
  }>;
}

export type ShipmentStatus = 'Pending' | 'Dispatched' | 'In Transit' | 'Delivered' | 'Delayed' | 'Cancelled';

export type ShipmentPriority = 'Standard' | 'Express' | 'Urgent';

export interface LocationPoint {
  address: string;
  city: string;
  state: string;
  zip: string;
  lat: number;
  lng: number;
}

export interface TrackingCheckpoint {
  id: string;
  status: string;
  description: string;
  location: string;
  timestamp: string;
  isCompleted: boolean;
  notes?: string;
}

export interface Shipment {
  id: string;
  trackingCode: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  origin: LocationPoint;
  destination: LocationPoint;
  currentCoordinates: {
    lat: number;
    lng: number;
  };
  status: ShipmentStatus;
  priority: ShipmentPriority;
  assignedVehicleId?: string;
  assignedVehiclePlate?: string;
  assignedDriverId?: string;
  assignedDriverName?: string;
  cargoType: string;
  cargoImage?: string;
  weightKg: number;
  itemsCount: number;
  declaredValueUsd: number;
  createdAt: string;
  estimatedDelivery: string;
  actualDelivery?: string;
  routeProgress: number; // 0 - 100%
  temperatureControl?: string; // e.g. "-4°C"
  timeline: TrackingCheckpoint[];
  notes?: string;
}

export type AlertType = 'delayed_shipment' | 'vehicle_maintenance' | 'delivery_update' | 'driver_status' | 'system';

export type AlertSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface AlertNotification {
  id: string;
  type: AlertType;
  title: string;
  description: string;
  timestamp: string;
  severity: AlertSeverity;
  isRead: boolean;
  relatedId?: string;
  relatedType?: 'shipment' | 'vehicle' | 'driver';
}

export interface FleetStats {
  totalVehicles: number;
  activeVehicles: number;
  maintenanceVehicles: number;
  availableVehicles: number;
  totalDrivers: number;
  onDutyDrivers: number;
  totalShipments: number;
  activeShipments: number;
  deliveredShipments: number;
  inTransitShipments: number;
  delayedShipments: number;
  onTimeDeliveryRate: number;
  averageSpeedKmh: number;
  totalFuelEfficiency: number; // km/L
  totalDistanceTodayKm: number;
}
