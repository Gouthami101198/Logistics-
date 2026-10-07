# 🚚 LogiTrack Enterprise | Fleet & Logistics Operations Platform

A modern, high-performance, enterprise-grade React 19 and TypeScript web application for managing commercial vehicle fleets, certified drivers, freight consignments, and real-time geospatial shipment tracking.

![React 19](https://img.shields.io/badge/React-19.0-61dafb.svg?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178c6.svg?style=flat-square&logo=typescript)
![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8.svg?style=flat-square&logo=tailwindcss)
![Vite 8](https://img.shields.io/badge/Vite-8.3-646cff.svg?style=flat-square&logo=vite)
![Leaflet](https://img.shields.io/badge/Leaflet-1.9-199900.svg?style=flat-square&logo=leaflet)
![License](https://img.shields.io/badge/License-MIT-emerald.svg?style=flat-square)

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
  - [1. Executive Operations Dashboard](#1--executive-operations-dashboard)
  - [2. Vehicle Fleet Management](#2--vehicle-fleet-management-vehicles)
  - [3. Commercial Driver Roster](#3--commercial-driver-roster-drivers)
  - [4. Consignment & Dispatch Management](#4--consignment--dispatch-management-shipments)
  - [5. Geospatial Live Radar Tracking](#5--geospatial-live-radar-tracking-tracking)
  - [6. Advanced Search, Filtering & Data Export](#6--advanced-search-filtering--data-export)
  - [7. Operational Alerts & Notification Center](#7--operational-alerts--notification-center)
- [Theme & Typography System](#-theme--typography-system)
  - [Dark & Light Theme Switching](#dark--light-theme-switching)
  - [Compact Typography & Font Density Scaler](#compact-typography--font-density-scaler)
  - [Rich Micro-Animations & Motion Design](#rich-micro-animations--motion-design)
- [Architecture & Tech Stack](#-architecture--tech-stack)
- [Project Directory Structure](#-project-directory-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Development Server](#development-server)
  - [Type Checking & Linting](#type-checking--linting)
  - [Production Build](#production-build)
- [Deployment Guide](#-deployment-guide)
  - [Deploy to Vercel](#deploy-to-vercel)
  - [Deploy to Netlify](#deploy-to-netlify)
  - [Docker & Nginx](#docker--nginx)
- [Backend REST API Integration](#-backend-rest-api-integration)
- [License](#-license)

---

## 🌐 Overview

**LogiTrack Enterprise** is designed for freight dispatchers, fleet directors, and logistics controllers. Built with a focus on information density, real-time telemetry, and sleek aesthetics, it features:

- Complete dark and light theme switching with state persistence.
- Dynamic GIS mapping via Leaflet that adapts map tiles according to the active theme.
- Responsive data grids and tables with spreadsheet export capabilities.
- Live simulated GPS telemetry engine with continuous coordinate updates.
- 3-tier font size density scaler (`Compact 13px`, `Standard 14px`, `Relaxed 16px`) for optimal readability across desktop and command-center displays.

---

## 🌟 Key Features

### 1. 📊 Executive Operations Dashboard
- **Live Fleet KPIs**: Real-time counter widgets tracking total vehicles, active consignments, on-duty drivers, and delivery SLAs with week-over-week trends.
- **Interactive Geospatial Mini-Radar**: Live visual preview map displaying active truck positions and featured route progress.
- **Fleet Efficiency Metrics**: Cruise speed averages, fleet availability percentage, fuel consumption indexes, and total mileage logged across active haul corridors.
- **Recent Dispatches**: Quick-inspect table displaying real-time consignment progress, client information, and instant modal inspect views.
- **Quick Action Bar**: Modal shortcuts to immediately dispatch consignments or jump directly into the full-screen radar.

### 2. 🚛 Vehicle Fleet Management (`/vehicles`)
- **Complete CRUD Operations**: Add, edit, inspect, and decommission fleet assets with form validation and modal confirmation.
- **Power Unit Telemetry**:
  - Fuel level gauges with low-fuel thresholds (<25% warnings).
  - Odometer mileage counters and vehicle capacity ratings in kilograms.
  - Live GPS addresses, city/state coordinates, and current road speed (km/h).
  - Service history tracking including maintenance dates, cost calculations, and service notes.
- **Driver Linkage**: Assign and reassign certified drivers with real-time status verification.
- **Dual Display Modes**: Toggle between visual card grid mode and high-density enterprise tabular view.
- **Direct Telemetry Tracking**: One-click jump to lock onto any specific vehicle on the live radar.

### 3. 👨‍✈️ Commercial Driver Roster (`/drivers`)
- **Driver Profiles**: Contact numbers, corporate email addresses, commercial license class verification (`CDL Class A`, `CDL Class B`, `Standard Commercial`), experience years, and emergency contact details.
- **Dynamic Duty State Machine**:
  - `On Duty` • Available for load assignment.
  - `On Delivery` • Currently operating an en-route power unit.
  - `Resting` • Enforcing DOT mandatory rest and break compliance.
  - `Off Duty` • Logged out of active shift rotation.
- **Performance Scorecards**: Customer satisfaction ratings (★), on-time arrival rate (%), and DOT safety index score.
- **Archived Delivery History**: Historical log of completed routes, destinations, and timestamps.

### 4. 📦 Consignment & Dispatch Management (`/shipments`)
- **Consignment Booking Pipeline**:
  - Customer contact records and cargo descriptions.
  - Origin street address, city, state, postal zip, and geographic coordinates.
  - Delivery destination street address, city, state, postal zip, and geographic coordinates.
  - Cargo weight in kilograms, package item count, and declared value in USD.
  - Cold-chain temperature requirements (e.g., `2°C to 8°C`, `Cryogenic -70°C`).
- **Fleet & Driver Allocation**: Assign power units and active drivers during booking or dynamically in-flight.
- **Operational Status Controller**:
  - Seamlessly advance shipments: `Pending` ➔ `Dispatched` ➔ `In Transit` ➔ `Delivered` (or flag as `Delayed`).
  - Automated tracking checkpoint and notification generation on status changes.
- **Checkpoints Timeline**: Step-by-step audit trail logging arrival, weigh station checks, and proof-of-delivery timestamps.

### 5. 🗺️ Geospatial Live Radar Tracking (`/tracking`)
- **Interactive Multi-Vehicle Map (Leaflet)**:
  - Custom vehicle markers indicating heading and operational status.
  - Animated glowing radar beacons identifying active GPS transmissions.
  - Origin pin (emerald), vehicle position, and destination pin (rose).
  - Animated route polylines connecting pickup and destination waypoints.
- **Dual Tile Layers**:
  - **Dark Mode**: High-contrast CartoDB Dark Matter tiles.
  - **Light Mode**: CartoDB Voyager tiles.
- **Live GPS Simulation Engine**:
  - Toggleable simulation loop that moves in-transit trucks realistically towards destination waypoints.
  - Updates odometer, fuel consumption, speed, and ETA calculations in real-time.
- **3-Column Radar Layout**: Left entity search/filter drawer, center interactive GIS map, and right telemetry inspector panel.

### 6. 🔍 Advanced Search, Filtering & Data Export
- **Multi-Param Filtering**:
  - Instant text search across vehicle plates, driver names, customer names, cargo descriptions, and IDs.
  - Filter by operational status pills.
  - Secondary categorization by vehicle type, license class, or shipment priority.
  - Geographic city and state filtering.
- **Spreadsheet Export**: One-click CSV generation for vehicles, drivers, and shipment manifest records.

### 7. 🔔 Operational Alerts & Notification Center
- Slide-over notification drawer with categories:
  - ⚠️ **Delayed Shipments** (traffic bottlenecks, severe weather alerts).
  - 🔧 **Vehicle Maintenance & Diagnostics** (engine temperature, low fuel, scheduled service).
  - ✅ **Delivery Confirmations** (proof-of-delivery receipts).
  - 👤 **Driver Compliance** (hours-of-service warnings).
- Interactive actions to filter by type, mark all as read, or dismiss individual alerts.
- Reactive floating toast notification system for user actions.

---

## 🎨 Theme & Typography System

### Dark & Light Theme Switching
- **Architecture**: Powered by [`src/context/ThemeContext.tsx`](file:///d:/Logistics/src/context/ThemeContext.tsx) with state synchronized across `document.documentElement`, `document.body`, and `localStorage` (`logitrack_theme`).
- **Interactive Switcher**: Navbar pill with animated rotating Sun (amber) and Moon (indigo) icons.
- **Adaptive Components**: All cards, inputs, modals, popups, and badges automatically adjust borders, backgrounds, and text contrast.

### Compact Typography & Font Density Scaler
- **Default 14px Scale**: Reduced base HTML root font size (`font-size: 14px`) in [`src/index.css`](file:///d:/Logistics/src/index.css) to maximize data density.
- **Density Switcher in Navbar**:
  - `Compact (13px)`: Maximum density for intensive monitoring environments.
  - `Small / Standard (14px)`: The default balanced view.
  - `Default (15.5px)`: Standard relaxed view.
- Preferences automatically persist to `localStorage` under `logitrack_fontsize`.

### Rich Micro-Animations & Motion Design
- `.animate-radar`: Expanding dual-ring pulse representing live GPS telemetry beacons.
- `.animate-slide-in-right`: Smooth entry transition for the notifications drawer.
- `.animate-scale-in`: Springy pop-in entrance for modals and dialogs.
- `.animate-fade-in-up`: Staggered entry animation for pages and analytics widgets.
- `.animate-float` & `.animate-float-slow`: Subtle levitation for brand badges and empty-state illustrations.
- `.animate-pulse-glow`: Glowing outline for urgent consignments and active vehicle nodes.
- `.animate-shimmer`: Sweeping highlight sheen across premium banner cards.
- `.glass-card-hover`: Micro-elevation (`translate-y-1` with shadow glow) on card hover.

---

## 🛠️ Architecture & Tech Stack

| Domain | Technology | Description |
|---|---|---|
| **Core Framework** | **React 19** | Latest React concurrent features and performance |
| **Language** | **TypeScript 5.8** | Strict typing with comprehensive domain interfaces |
| **Build Tool** | **Vite 8** | Fast HMR and Rollup/Rolldown production bundling |
| **Styling** | **Tailwind CSS v4** | Modern utility-first CSS engine with `@custom-variant dark` |
| **Routing** | **React Router v7** | Declarative client-side routing and layout management |
| **GIS & Mapping** | **Leaflet 1.9** | Interactive geospatial maps with CartoDB tile layers |
| **Icons** | **Lucide React** | Clean, consistent icons across all modules |
| **Fonts** | **Inter & Outfit** | Modern Google Fonts typography |
| **Data Engine** | **Reactive Context API** | Unified state store with local persistence and simulated REST API |

---

## 📁 Project Directory Structure

```
d:/Logistics/
├── public/
│   ├── favicon.svg             # Application logo favicon
│   ├── _redirects              # Netlify SPA routing rules
│   └── images/
│       └── hero-banner.jpg     # Logistics visual banner
├── src/
│   ├── assets/                 # Static brand assets
│   ├── components/
│   │   ├── common/             # Reusable UI components
│   │   │   ├── AdvancedFilterBar.tsx   # Universal search and multi-parameter filter
│   │   │   ├── ConfirmationModal.tsx   # Action confirmation dialogs
│   │   │   ├── EmptyState.tsx          # Clean zero-state placeholders
│   │   │   ├── Modal.tsx               # Accessible dialog container with scale-in
│   │   │   ├── StatsCard.tsx           # KPI metric card with trends and icons
│   │   │   ├── StatusBadge.tsx         # Color-coded status indicator pills
│   │   │   └── Toast.tsx               # Reactive notification toast stack
│   │   ├── drivers/            # Driver roster modules
│   │   │   ├── AddEditDriverModal.tsx  # Driver onboarding and license verification
│   │   │   └── DriverDetailsModal.tsx  # Driver scorecard, contact, and trip history
│   │   ├── layout/             # Core layout structure
│   │   │   ├── MainLayout.tsx          # Shell wrapping Navbar, Sidebar, and drawer
│   │   │   ├── Navbar.tsx              # Top bar with search, font scaler & theme switcher
│   │   │   ├── NotificationDrawer.tsx  # Slide-over operational alerts drawer
│   │   │   └── Sidebar.tsx             # Collapsible navigation and telemetry widget
│   │   ├── shipments/          # Consignment dispatch modules
│   │   │   ├── AddEditShipmentModal.tsx# Booking form with cargo & address specs
│   │   │   └── ShipmentDetailsModal.tsx# Transit progress, status updater, timeline
│   │   ├── tracking/           # Geospatial GIS modules
│   │   │   └── TrackingMap.tsx         # Leaflet map with theme-adaptive tiles & markers
│   │   └── vehicles/           # Fleet management modules
│   │       ├── AddEditVehicleModal.tsx # Vehicle asset configuration modal
│   │       └── VehicleDetailsModal.tsx # Full vehicle telemetry & service history
│   ├── context/
│   │   ├── LogisticsContext.tsx# Reactive state store, CRUD actions & GPS simulator
│   │   └── ThemeContext.tsx    # Dark/light theme & font size density provider
│   ├── data/
│   │   └── mockData.ts         # Comprehensive seed data for vehicles, drivers, shipments
│   ├── pages/
│   │   ├── AnalyticsPage.tsx   # SLAs, weekly dispatch bar chart, fuel metrics
│   │   ├── Dashboard.tsx       # Executive command center with mini-radar
│   │   ├── DriversPage.tsx     # Operator roster with cards and table view
│   │   ├── ShipmentsPage.tsx   # Dispatch manifest table, cards, and CSV export
│   │   ├── TrackingPage.tsx    # 3-column geospatial GIS radar workspace
│   │   └── VehiclesPage.tsx    # Fleet assets, gauges, and maintenance tracker
│   ├── services/
│   │   └── api.ts              # Decoupled mock REST API layer with async methods
│   ├── types/
│   │   └── index.ts            # Domain TypeScript models and interfaces
│   ├── App.tsx                 # Root router configuration
│   ├── index.css               # Tailwind CSS v4 directives, keyframe animations
│   ├── main.tsx                # React DOM root entry point
│   └── vite-env.d.ts           # CSS and client module declarations
├── vercel.json                 # Vercel SPA rewrite configuration
├── tsconfig.json               # TypeScript compiler options
├── vite.config.ts              # Vite configuration with Tailwind v4 plugin
└── package.json                # Project dependencies and npm scripts
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher (v20+ or v24 LTS recommended)
- **NPM**: v9.0.0 or higher (or pnpm / yarn)

### Installation

1. Clone or copy the repository:
   ```bash
   git clone <repository-url>
   cd Logistics
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Development Server

Start the local Vite development server:
```bash
npm run dev
```
The application will launch at `http://localhost:5173/`.

### Type Checking & Linting

Run TypeScript type check without emitting files:
```bash
npx tsc --noEmit
```

Run Oxlint linter:
```bash
npm run lint
```

### Production Build

Create an optimized, minified production build:
```bash
npm run build
```
Output assets are generated in the `/dist` directory.

Preview the production build locally:
```bash
npm run preview
```

---

## 🌐 Deployment Guide

### Deploy to Vercel
1. Push your repository to GitHub, GitLab, or Bitbucket.
2. In [Vercel](https://vercel.com/), click **Add New Project** and import the repository.
3. Framework Preset: **Vite** (detected automatically).
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. `vercel.json` is already present to handle client-side routing.
7. Click **Deploy**.

### Deploy to Netlify
1. In [Netlify](https://www.netlify.com/), click **Add new site** > **Import an existing project**.
2. Select your repository.
3. Build Settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
4. Client-side SPA routing is handled via `public/_redirects`.
5. Click **Deploy site**.

### Docker & Nginx

To run LogiTrack with Docker and an Nginx container:

```dockerfile
# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Serve
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Example `nginx.conf`:
```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

---

## 🔌 Backend REST API Integration

The frontend architecture includes a dedicated service layer at [`src/services/api.ts`](file:///d:/Logistics/src/services/api.ts). To connect to a live backend API (Node.js/Express, NestJS, Go, FastAPI, Django, or Spring Boot):

1. Define your backend URL in `.env`:
   ```env
   VITE_API_BASE_URL=https://api.yourdomain.com/v1
   ```

2. Replace the simulated methods in `src/services/api.ts` with HTTP client requests (e.g., using `fetch` or `axios`):
   ```typescript
   const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api/v1';

   export const shipmentService = {
     async getAll(): Promise<Shipment[]> {
       const res = await fetch(`${API_BASE}/shipments`);
       if (!res.ok) throw new Error('Failed to fetch shipments');
       return res.json();
     },

     async create(data: Omit<Shipment, 'id' | 'createdAt'>): Promise<Shipment> {
       const res = await fetch(`${API_BASE}/shipments`, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(data),
       });
       return res.json();
     },
     // ...
   };
   ```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](file:///d:/Logistics/LICENSE) file for details.

© 2026 LogiTrack Enterprise Operations. All rights reserved.
