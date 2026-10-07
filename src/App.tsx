import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { LogisticsProvider } from './context/LogisticsContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { NotificationDrawer } from './components/layout/NotificationDrawer';
import { ToastContainer } from './components/common/ToastContainer';
import { Dashboard } from './pages/Dashboard';
import { VehiclesPage } from './pages/VehiclesPage';
import { DriversPage } from './pages/DriversPage';
import { ShipmentsPage } from './pages/ShipmentsPage';
import { TrackingPage } from './pages/TrackingPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { AddEditShipmentModal } from './components/shipments/AddEditShipmentModal';

function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isNewShipmentOpen, setIsNewShipmentOpen] = useState(false);

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-slate-100/70 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-300">
      {/* Top Navbar */}
      <Navbar
        onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
        onOpenNewShipment={() => setIsNewShipmentOpen(true)}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Responsive Collapsible Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Primary Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/vehicles" element={<VehiclesPage />} />
              <Route path="/drivers" element={<DriversPage />} />
              <Route path="/shipments" element={<ShipmentsPage />} />
              <Route path="/tracking" element={<TrackingPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </main>
      </div>

      {/* Global Notifications Drawer */}
      <NotificationDrawer />

      {/* Global Toast Alerts */}
      <ToastContainer />

      {/* Global Quick New Shipment Modal */}
      <AddEditShipmentModal
        isOpen={isNewShipmentOpen}
        onClose={() => setIsNewShipmentOpen(false)}
      />
    </div>
  );
}

export function App() {
  return (
    <ThemeProvider>
      <LogisticsProvider>
        <BrowserRouter>
          <MainLayout />
        </BrowserRouter>
      </LogisticsProvider>
    </ThemeProvider>
  );
}

export default App;
