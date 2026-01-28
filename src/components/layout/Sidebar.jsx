// src/components/Sidebar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ isOpen, toggleSidebar, onLogout }) => {
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', icon: 'fa-chart-pie', label: 'Dashboard' },
    { path: '/vendor', icon: 'fa-store', label: 'Vendor' },
    { path: '/product', icon: 'fa-box', label: 'Products' },
    { path: '/purchase', icon: 'fa-shopping-cart', label: 'Purchase' },
    { path: '/inventory', icon: 'fa-warehouse', label: 'Inventory' },
    { path: '/scrap', icon: 'fa-recycle', label: 'Scrap Management' },
    { path: '/maintenance', icon: 'fa-tools', label: 'Maintenance' },
    { path: '/reports', icon: 'fa-file-alt', label: 'Reports' },
    { path: '/users', icon: 'fa-users-cog', label: 'User Management' },
    { path: '/settings', icon: 'fa-cog', label: 'Settings' },
  ];

  return (
    <>
      <aside
        className={`fixed top-0 left-0 h-screen w-64 bg-white border-r border-gray-200 p-4 z-40 shadow-lg transition-transform duration-300 overflow-y-auto flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
      >
        {/* Logo/Brand Section */}
        <div className="flex items-center justify-center mb-5 pb-4 border-b-2 border-gray-200">
          <Link
            to="/dashboard"
            className="flex items-center gap-2.5 text-base font-extrabold text-gray-800 no-underline hover:scale-105 transition-transform duration-200"
          >
            <i className="fas fa-boxes text-2xl bg-gradient-to-br from-teal-400 to-teal-700 bg-clip-text text-transparent"></i>
            <span className="bg-gradient-to-br from-teal-400 to-teal-700 bg-clip-text text-transparent">
              Inventory System
            </span>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="mb-5 relative">
          <div className="relative flex items-center">
            <i className="fas fa-search absolute left-3 text-gray-400 text-sm pointer-events-none"></i>
            <input
              type="text"
              placeholder="Search anything..."
              className="w-full py-2.5 px-9 border-2 border-gray-200 rounded-md text-sm text-gray-800 bg-white focus:outline-none focus:border-teal-400 focus:ring-4 focus:ring-cyan-100 transition-all duration-200"
            />
          </div>
        </div>

        {/* Navigation Menu - Reduced bottom padding */}
        <nav className="flex-1 pb-4">
          <ul className="space-y-1.5 list-none p-0 m-0">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-2.5 px-3.5 py-2.5 no-underline rounded-md text-sm font-medium transition-all duration-200 ${location.pathname === item.path
                      ? 'bg-gradient-to-br from-teal-400 to-teal-700 text-white shadow-md'
                      : 'text-gray-600 hover:bg-cyan-50 hover:text-teal-500 hover:translate-x-1'
                    }`}
                  onClick={() => {
                    // Close mobile sidebar on navigation
                    if (window.innerWidth < 1024) {
                      toggleSidebar();
                    }
                  }}
                >
                  <i className={`fas ${item.icon} text-base w-5 text-center`}></i>
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout Button - Reduced top padding */}
        <div className="mt-auto pt-2 border-t border-gray-200">
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-2.5 bg-gradient-to-br from-red-500 to-red-700 text-white border-none rounded-md text-sm font-semibold cursor-pointer hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200"
          >
            <i className="fas fa-sign-out-alt text-base"></i>
            <span>Logout</span>
          </button>
        </div>

      </aside>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        aside {
          scrollbar-width: thin;
          scrollbar-color: #0CC0BC #f1f5f9;
        }
        
        aside::-webkit-scrollbar {
          width: 6px;
        }
        
        aside::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }
        
        aside::-webkit-scrollbar-thumb {
          background: #0CC0BC;
          border-radius: 10px;
          border: 1px solid #f1f5f9;
        }
        
        aside::-webkit-scrollbar-thumb:hover {
          background: #076A70;
        }
      `}</style>
    </>
  );
};

export default Sidebar;
