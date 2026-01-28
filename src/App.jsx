import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Auth from './pages/Auth';
import VendorManagement from './pages/Vendor';
import ProductManagement from './pages/Product';

// Dashboard Component
const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-gray-50 to-cyan-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-br from-teal-400 to-teal-700 bg-clip-text text-transparent mb-4">
          Dashboard
        </h1>
        <p className="text-gray-600 mb-6">Welcome to Inventory Management System</p>
        <div className="flex gap-4 justify-center mt-6">
          <button
            onClick={() => window.location.href = '/vendor'}
            className="px-6 py-3 bg-gradient-to-br from-teal-400 to-teal-700 text-white rounded-lg font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
          >
            <i className="fas fa-store mr-2"></i>
            Go to Vendors
          </button>
          <button
            onClick={() => window.location.href = '/product'}
            className="px-6 py-3 bg-gradient-to-br from-green-400 to-green-600 text-white rounded-lg font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
          >
            <i className="fas fa-box mr-2"></i>
            Go to Products
          </button>
          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = '/';
            }}
            className="px-6 py-3 bg-gradient-to-br from-red-500 to-red-700 text-white rounded-lg font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
          >
            <i className="fas fa-sign-out-alt mr-2"></i>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

// Main App Component
function App() {
  return (
    <Routes>
      {/* Auth Route */}
      <Route path="/" element={<Auth />} />
      
      {/* Dashboard Route */}
      <Route path="/dashboard" element={<Dashboard />} />
      
      {/* Vendor Management Route */}
      <Route path="/vendor" element={<VendorManagement />} />
      
      {/* Product Management Route */}
      <Route path="/product" element={<ProductManagement />} />
      
      {/* Catch-all redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;