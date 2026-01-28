// src/App.jsx
import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';

// Import Components
import Sidebar from './components/layout/Sidebar';

// Import Pages
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import VendorManagement from './pages/Vendor';
import ProductManagement from './pages/Product';
import PurchaseManagement from './pages/Purchase';
import InventoryManagement from './pages/Inventory';
import ScrapManagement from './pages/ScrapManagement';
import MaintenanceManagement from './pages/Maintenance';
import ReportsManagement from './pages/Reports';
import UserManagement from './pages/UserManagement';
import SettingsManagement from './pages/Settings';

// Storage Keys
const STORAGE_KEYS = {
  IS_LOGGED_IN: 'isLoggedIn',
};

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem(STORAGE_KEYS.IS_LOGGED_IN) === 'true';
  return isAuthenticated ? children : <Navigate to="/" replace />;
};

// Layout Component with Fixed Sidebar
const LayoutWithSidebar = ({ children }) => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    // Clear all authentication data
    localStorage.clear();
    // Redirect to login
    navigate('/');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-gray-50 to-cyan-50">
      {/* Fixed Sidebar - Always on left */}
      <Sidebar 
        isOpen={sidebarOpen} 
        toggleSidebar={toggleSidebar} 
        onLogout={handleLogout} 
      />
      
      {/* Main Content Area with Left Margin for Sidebar */}
      <div className="ml-0 lg:ml-64 transition-all duration-300 min-h-screen">
        {/* Mobile Menu Toggle Button */}
        <button
          onClick={toggleSidebar}
          className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 bg-gradient-to-br from-teal-400 to-teal-700 text-white rounded-md shadow-lg flex items-center justify-center hover:shadow-xl transition-all duration-200"
        >
          <i className={`fas ${sidebarOpen ? 'fa-times' : 'fa-bars'}`}></i>
        </button>

        {/* Page Content */}
        <main className="min-h-screen">
          {children}
        </main>
      </div>

      {/* Mobile Overlay - Closes sidebar when clicked */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-30"
          onClick={toggleSidebar}
        ></div>
      )}
    </div>
  );
};

// Main App Component
function App() {
  return (
    <Routes>
      {/* Public Route - Auth/Login Page (NO SIDEBAR) */}
      <Route path="/" element={<Auth />} />

      {/* Protected Routes with Fixed Sidebar */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <LayoutWithSidebar>
              <Dashboard />
            </LayoutWithSidebar>
          </ProtectedRoute>
        }
      />

      <Route
        path="/vendor"
        element={
          <ProtectedRoute>
            <LayoutWithSidebar>
              <VendorManagement />
            </LayoutWithSidebar>
          </ProtectedRoute>
        }
      />

      <Route
        path="/product"
        element={
          <ProtectedRoute>
            <LayoutWithSidebar>
              <ProductManagement />
            </LayoutWithSidebar>
          </ProtectedRoute>
        }
      />

      <Route
        path="/purchase"
        element={
          <ProtectedRoute>
            <LayoutWithSidebar>
              <PurchaseManagement />
            </LayoutWithSidebar>
          </ProtectedRoute>
        }
      />

      <Route
        path="/inventory"
        element={
          <ProtectedRoute>
            <LayoutWithSidebar>
              <InventoryManagement />
            </LayoutWithSidebar>
          </ProtectedRoute>
        }
      />

      <Route
        path="/scrap"
        element={
          <ProtectedRoute>
            <LayoutWithSidebar>
              <ScrapManagement />
            </LayoutWithSidebar>
          </ProtectedRoute>
        }
      />

      <Route
        path="/maintenance"
        element={
          <ProtectedRoute>
            <LayoutWithSidebar>
              <MaintenanceManagement />
            </LayoutWithSidebar>
          </ProtectedRoute>
        }
      />

      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <LayoutWithSidebar>
              <ReportsManagement />
            </LayoutWithSidebar>
          </ProtectedRoute>
        }
      />

      <Route
        path="/users"
        element={
          <ProtectedRoute>
            <LayoutWithSidebar>
              <UserManagement />
            </LayoutWithSidebar>
          </ProtectedRoute>
        }
      />

      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <LayoutWithSidebar>
              <SettingsManagement />
            </LayoutWithSidebar>
          </ProtectedRoute>
        }
      />

      {/* Catch-all redirect to login */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
