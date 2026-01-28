import React, { useState } from 'react';

const Sidebar = ({ isOpen, onClose }) => {
  const [activeMenu, setActiveMenu] = useState('dashboard');

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'fa-gauge', path: '/dashboard' },
    { id: 'inventory', label: 'Inventory', icon: 'fa-boxes-stacked', path: '/inventory' },
    { id: 'products', label: 'Products', icon: 'fa-box', path: '/products' },
    { id: 'suppliers', label: 'Suppliers', icon: 'fa-truck', path: '/suppliers' },
    { id: 'reports', label: 'Reports', icon: 'fa-chart-line', path: '/reports' },
    { id: 'settings', label: 'Settings', icon: 'fa-gear', path: '/settings' },
  ];

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-white shadow-xl z-50
          transform transition-transform duration-300 ease-smooth
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static
        `}
      >
        <div className="flex items-center gap-3 p-6 border-b border-border">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center">
            <i className="fas fa-boxes text-white text-xl"></i>
          </div>
          <div>
            <h1 className="text-lg font-bold text-text-primary">Inventory</h1>
            <p className="text-xs text-text-muted">Management</p>
          </div>
          <button
            onClick={onClose}
            className="ml-auto lg:hidden text-text-muted hover:text-brand-primary transition-smooth"
          >
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveMenu(item.id)}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-lg
                transition-smooth text-left
                ${
                  activeMenu === item.id
                    ? 'bg-gradient-to-r from-brand-primary to-brand-secondary text-white shadow-md'
                    : 'text-text-secondary hover:bg-brand-light hover:text-brand-primary'
                }
              `}
            >
              <i className={`fas ${item.icon} text-lg w-5`}></i>
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border bg-bg-tertiary">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center text-white font-bold">
              A
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-text-primary">Admin</p>
              <p className="text-xs text-text-muted">admin@gmail.com</p>
            </div>
            <button className="text-text-muted hover:text-error transition-smooth">
              <i className="fas fa-sign-out-alt"></i>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
