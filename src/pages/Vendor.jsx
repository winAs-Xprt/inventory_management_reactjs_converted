import React, { useState, useEffect, useMemo } from 'react';
import { 
  DUMMY_VENDORS, 
  DUMMY_STATISTICS_DATA,
  calculateVendorStats, 
  getFilteredVendors,
  validateVendorData,
  generateVendorAvatar,
  VENDOR_TYPES,
  VENDOR_TYPE_OPTIONS,
  VENDOR_STATUS
} from '../data/VendorData';

// ==========================================================================
// CUSTOM SCROLLBAR STYLES
// ==========================================================================
const ScrollbarStyles = () => (
  <style jsx global>{`
    * {
      scrollbar-width: thin;
      scrollbar-color: #0CC0BC #f1f5f9;
    }
    
    *::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }
    
    *::-webkit-scrollbar-track {
      background: #f1f5f9;
      border-radius: 10px;
    }
    
    *::-webkit-scrollbar-thumb {
      background: #0CC0BC;
      border-radius: 10px;
      border: 1px solid #f1f5f9;
    }
    
    *::-webkit-scrollbar-thumb:hover {
      background: #076A70;
    }
  `}</style>
);

// ==========================================================================
// TOAST NOTIFICATION COMPONENT
// ==========================================================================
const Toast = ({ show, message, type }) => {
  if (!show) return null;

  const iconMap = {
    success: 'fa-check-circle',
    error: 'fa-exclamation-circle',
    warning: 'fa-exclamation-triangle',
    info: 'fa-info-circle'
  };

  const bgColorMap = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-blue-500'
  };

  return (
    <div className={`fixed top-5 right-5 ${bgColorMap[type]} text-white px-5 py-3.5 rounded-md flex items-center gap-3 font-semibold text-sm z-50 shadow-2xl animate-in slide-in-from-right duration-300`}>
      <i className={`fas ${iconMap[type]} text-lg`}></i>
      <span>{message}</span>
    </div>
  );
};

// ==========================================================================
// CONFIRMATION MODAL COMPONENT
// ==========================================================================
const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, type = 'warning', isDanger = false }) => {
  if (!isOpen) return null;

  const iconMap = {
    success: { icon: 'fa-check-circle', bg: 'bg-green-100', text: 'text-green-500' },
    error: { icon: 'fa-exclamation-circle', bg: 'bg-red-100', text: 'text-red-500' },
    warning: { icon: 'fa-exclamation-triangle', bg: 'bg-yellow-100', text: 'text-yellow-500' },
    info: { icon: 'fa-info-circle', bg: 'bg-blue-100', text: 'text-blue-500' }
  };

  const config = iconMap[type];

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 animate-in fade-in duration-200">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel}></div>
      <div className="relative w-[90%] max-w-md animate-in slide-in-from-bottom duration-300">
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          <div className="flex items-center gap-4 px-6 py-6 border-b-2 border-gray-200 bg-gray-50">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl flex-shrink-0 ${config.bg} ${config.text}`}>
              <i className={`fas ${config.icon}`}></i>
            </div>
            <h3 className="text-xl font-bold text-gray-800 m-0">{title}</h3>
          </div>
          <div className="px-6 py-6">
            <p className="text-sm leading-relaxed text-gray-700 m-0">{message}</p>
          </div>
          <div className="flex gap-3 px-6 py-5 border-t-2 border-gray-200 bg-gray-50">
            <button
              onClick={onCancel}
              className="flex-1 px-5 py-3 bg-gray-50 text-gray-700 border-2 border-gray-200 rounded-md text-sm font-semibold cursor-pointer hover:bg-white hover:border-gray-300 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <i className="fas fa-times"></i>
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className={`flex-1 px-5 py-3 text-white rounded-md text-sm font-semibold cursor-pointer hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 ${
                isDanger ? 'bg-red-500 hover:bg-red-600' : 'bg-teal-500 hover:bg-teal-600'
              }`}
            >
              <i className="fas fa-check"></i>
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================================================
// SIDEBAR COMPONENT
// ==========================================================================
const Sidebar = ({ sidebarOpen, setSidebarOpen, onLogout }) => {
  return (
    <aside
      className={`fixed top-0 left-0 h-screen w-64 bg-white border-r border-gray-200 p-4 z-40 shadow-lg transition-transform duration-300 overflow-y-auto ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}
    >
      <div className="flex items-center justify-center mb-5 pb-4 border-b-2 border-gray-200">
        <a href="/dashboard" className="flex items-center gap-2.5 text-base font-extrabold text-gray-800 no-underline hover:scale-105 transition-transform duration-200">
          <i className="fas fa-boxes text-2xl bg-gradient-to-br from-teal-400 to-teal-700 bg-clip-text text-transparent"></i>
          <span className="bg-gradient-to-br from-teal-400 to-teal-700 bg-clip-text text-transparent">Inventory System</span>
        </a>
      </div>

      <div className="mb-5 relative">
        <div className="relative flex items-center">
          <i className="fas fa-search absolute left-3 text-gray-400 text-sm"></i>
          <input
            type="text"
            placeholder="Search anything..."
            className="w-full py-2.5 px-9 border-2 border-gray-200 rounded-md text-sm text-gray-800 bg-white focus:outline-none focus:border-teal-400 focus:ring-4 focus:ring-cyan-100 transition-all duration-200"
          />
        </div>
      </div>

      <nav>
        <ul className="space-y-1.5 mb-20">
          <li>
            <a href="/dashboard" className="flex items-center gap-2.5 px-3.5 py-2.5 text-gray-600 no-underline rounded-md text-sm font-medium hover:bg-cyan-50 hover:text-teal-500 hover:translate-x-1 transition-all duration-200">
              <i className="fas fa-chart-pie text-base w-5 text-center"></i>
              <span>Dashboard</span>
            </a>
          </li>
          <li>
            <a href="/vendor" className="flex items-center gap-2.5 px-3.5 py-2.5 no-underline rounded-md text-sm font-medium bg-gradient-to-br from-teal-400 to-teal-700 text-white shadow-md">
              <i className="fas fa-store text-base w-5 text-center"></i>
              <span>Vendor</span>
            </a>
          </li>
          <li>
            <a href="/product" className="flex items-center gap-2.5 px-3.5 py-2.5 text-gray-600 no-underline rounded-md text-sm font-medium hover:bg-cyan-50 hover:text-teal-500 hover:translate-x-1 transition-all duration-200">
              <i className="fas fa-box text-base w-5 text-center"></i>
              <span>Products</span>
            </a>
          </li>
          <li>
            <a href="/purchase" className="flex items-center gap-2.5 px-3.5 py-2.5 text-gray-600 no-underline rounded-md text-sm font-medium hover:bg-cyan-50 hover:text-teal-500 hover:translate-x-1 transition-all duration-200">
              <i className="fas fa-shopping-cart text-base w-5 text-center"></i>
              <span>Purchase</span>
            </a>
          </li>
          <li>
            <a href="/inventory" className="flex items-center gap-2.5 px-3.5 py-2.5 text-gray-600 no-underline rounded-md text-sm font-medium hover:bg-cyan-50 hover:text-teal-500 hover:translate-x-1 transition-all duration-200">
              <i className="fas fa-warehouse text-base w-5 text-center"></i>
              <span>Inventory</span>
            </a>
          </li>
          <li>
            <a href="/scrap" className="flex items-center gap-2.5 px-3.5 py-2.5 text-gray-600 no-underline rounded-md text-sm font-medium hover:bg-cyan-50 hover:text-teal-500 hover:translate-x-1 transition-all duration-200">
              <i className="fas fa-recycle text-base w-5 text-center"></i>
              <span>Scrap Management</span>
            </a>
          </li>
          <li>
            <a href="/maintenance" className="flex items-center gap-2.5 px-3.5 py-2.5 text-gray-600 no-underline rounded-md text-sm font-medium hover:bg-cyan-50 hover:text-teal-500 hover:translate-x-1 transition-all duration-200">
              <i className="fas fa-tools text-base w-5 text-center"></i>
              <span>Maintenance</span>
            </a>
          </li>
          <li>
            <a href="/reports" className="flex items-center gap-2.5 px-3.5 py-2.5 text-gray-600 no-underline rounded-md text-sm font-medium hover:bg-cyan-50 hover:text-teal-500 hover:translate-x-1 transition-all duration-200">
              <i className="fas fa-file-alt text-base w-5 text-center"></i>
              <span>Reports</span>
            </a>
          </li>
          <li>
            <a href="/users" className="flex items-center gap-2.5 px-3.5 py-2.5 text-gray-600 no-underline rounded-md text-sm font-medium hover:bg-cyan-50 hover:text-teal-500 hover:translate-x-1 transition-all duration-200">
              <i className="fas fa-users-cog text-base w-5 text-center"></i>
              <span>User Management</span>
            </a>
          </li>
          <li>
            <a href="/settings" className="flex items-center gap-2.5 px-3.5 py-2.5 text-gray-600 no-underline rounded-md text-sm font-medium hover:bg-cyan-50 hover:text-teal-500 hover:translate-x-1 transition-all duration-200">
              <i className="fas fa-cog text-base w-5 text-center"></i>
              <span>Settings</span>
            </a>
          </li>
        </ul>
      </nav>

      <button
        onClick={onLogout}
        className="absolute bottom-4 left-4 right-4 flex items-center justify-center gap-2 py-2.5 px-2.5 bg-gradient-to-br from-red-500 to-red-700 text-white border-none rounded-md text-sm font-semibold cursor-pointer hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200"
      >
        <i className="fas fa-sign-out-alt text-base"></i>
        <span>Logout</span>
      </button>
    </aside>
  );
};

// ==========================================================================
// STATISTICS CARD COMPONENT
// ==========================================================================
const StatCard = ({ icon, title, value, change, changeType }) => {
  const changeColorMap = {
    positive: 'text-green-500',
    negative: 'text-red-500',
    warning: 'text-yellow-500'
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:-translate-y-1 hover:shadow-lg transition-all duration-200">
      <div className="h-1 bg-gradient-to-r from-teal-400 to-teal-700"></div>
      <div className="p-5">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 uppercase tracking-wide">
            <i className={`fas ${icon} text-base text-teal-500`}></i>
            {title}
          </div>
        </div>
        <div className="text-3xl font-extrabold text-gray-800 mb-2 leading-none">
          {value}
        </div>
        <div className={`flex items-center gap-1 text-xs font-semibold ${changeColorMap[changeType]}`}>
          <i className={`fas ${changeType === 'positive' ? 'fa-arrow-up' : changeType === 'negative' ? 'fa-ban' : 'fa-check'} text-[10px]`}></i>
          {change}
        </div>
      </div>
    </div>
  );
};

// ==========================================================================
// VENDOR TYPE BADGE COMPONENT
// ==========================================================================
const VendorTypeBadge = ({ type }) => {
  const config = {
    [VENDOR_TYPES.PURCHASE]: {
      icon: 'fa-shopping-cart',
      bgColor: 'bg-gradient-to-br from-cyan-50 to-cyan-100 text-teal-600 border border-cyan-200'
    },
    [VENDOR_TYPES.MAINTENANCE]: {
      icon: 'fa-tools',
      bgColor: 'bg-gradient-to-br from-amber-50 to-amber-100 text-amber-600 border border-amber-200'
    },
    [VENDOR_TYPES.SCRAP]: {
      icon: 'fa-recycle',
      bgColor: 'bg-gradient-to-br from-purple-50 to-purple-100 text-purple-600 border border-purple-200'
    }
  };

  const typeConfig = config[type] || config[VENDOR_TYPES.PURCHASE];

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold hover:-translate-y-0.5 hover:shadow-sm transition-all duration-200 ${typeConfig.bgColor}`}>
      <i className={`fas ${typeConfig.icon} text-xs`}></i>
      {type}
    </span>
  );
};

// ==========================================================================
// VENDOR MODAL COMPONENT
// ==========================================================================
const VendorModal = ({ isOpen, onClose, vendor, onSave }) => {
  const [formData, setFormData] = useState({
    vendorName: '',
    companyName: '',
    contact: '',
    email: '',
    address: '',
    pincode: '',
    city: '',
    state: '',
    gst: '',
    status: VENDOR_STATUS.ACTIVE,
    vendorTypes: {
      purchaseVendor: false,
      maintenancePartner: false,
      scrapDisposalPartner: false
    }
  });

  const [vendorTypeError, setVendorTypeError] = useState(false);

  useEffect(() => {
    if (vendor) {
      const contactNumber = vendor.contact.replace('+91 ', '').replace(/\s/g, '');
      const vendorTypes = Array.isArray(vendor.vendorType) ? vendor.vendorType : [vendor.vendorType];

      setFormData({
        vendorName: vendor.vendorName,
        companyName: vendor.companyName || vendor.vendorName,
        contact: contactNumber,
        email: vendor.email,
        address: vendor.address,
        pincode: vendor.pincode,
        city: vendor.city,
        state: vendor.state,
        gst: vendor.gst || '',
        status: vendor.status,
        vendorTypes: {
          purchaseVendor: vendorTypes.includes(VENDOR_TYPES.PURCHASE),
          maintenancePartner: vendorTypes.includes(VENDOR_TYPES.MAINTENANCE),
          scrapDisposalPartner: vendorTypes.includes(VENDOR_TYPES.SCRAP)
        }
      });
    } else {
      setFormData({
        vendorName: '',
        companyName: '',
        contact: '',
        email: '',
        address: '',
        pincode: '',
        city: '',
        state: '',
        gst: '',
        status: VENDOR_STATUS.ACTIVE,
        vendorTypes: {
          purchaseVendor: false,
          maintenancePartner: false,
          scrapDisposalPartner: false
        }
      });
    }
    setVendorTypeError(false);
  }, [vendor, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const selectedTypes = [];
    if (formData.vendorTypes.purchaseVendor) selectedTypes.push(VENDOR_TYPES.PURCHASE);
    if (formData.vendorTypes.maintenancePartner) selectedTypes.push(VENDOR_TYPES.MAINTENANCE);
    if (formData.vendorTypes.scrapDisposalPartner) selectedTypes.push(VENDOR_TYPES.SCRAP);

    if (selectedTypes.length === 0) {
      setVendorTypeError(true);
      return;
    }

    setVendorTypeError(false);
    onSave({ ...formData, vendorTypes: selectedTypes });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-5">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-full max-w-2xl max-h-[90vh] animate-in fade-in duration-300">
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
          <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center bg-gray-50">
            <h2 className="text-lg font-bold text-gray-800">
              {vendor ? 'Edit Vendor' : 'Add New Vendor'}
            </h2>
            <button
              onClick={onClose}
              className="bg-transparent border-none text-gray-500 text-xl cursor-pointer p-1 rounded-md w-8 h-8 flex items-center justify-center hover:bg-white hover:text-gray-800 transition-all duration-200"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
          <div className="p-6 overflow-y-auto flex-1">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-600 flex items-center gap-1.5">
                    <i className="fas fa-user text-teal-500"></i>
                    Vendor Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.vendorName}
                    onChange={(e) => setFormData({ ...formData, vendorName: e.target.value })}
                    placeholder="Contact person"
                    required
                    minLength="3"
                    maxLength="100"
                    className="py-2.5 px-3 border-2 border-gray-200 rounded-md text-gray-800 text-sm outline-none focus:border-teal-400 focus:ring-4 focus:ring-cyan-100 transition-all duration-200 w-full bg-white"
                  />
                  <small className="text-gray-500 text-xs block mt-1">
                    <i className="fas fa-info-circle"></i> Contact person name
                  </small>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-600 flex items-center gap-1.5">
                    <i className="fas fa-building text-teal-500"></i>
                    Company Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    placeholder="Company name"
                    required
                    minLength="3"
                    maxLength="100"
                    className="py-2.5 px-3 border-2 border-gray-200 rounded-md text-gray-800 text-sm outline-none focus:border-teal-400 focus:ring-4 focus:ring-cyan-100 transition-all duration-200 w-full bg-white"
                  />
                  <small className="text-gray-500 text-xs block mt-1">
                    <i className="fas fa-info-circle"></i> Registered company
                  </small>
                </div>
              </div>

              <div className="flex flex-col gap-1.5 mb-4">
                <label className="text-xs font-semibold text-gray-600 flex items-center gap-1.5">
                  <i className="fas fa-tags text-teal-500"></i>
                  Type of Vendor <span className="text-red-500">*</span>
                </label>
                <div className={`flex flex-col gap-2.5 mt-2 p-4 bg-gray-50 rounded-md border-2 ${vendorTypeError ? 'border-red-500' : 'border-gray-200'}`}>
                  <label className="flex items-center gap-3 p-3 rounded-md hover:bg-cyan-50 hover:translate-x-1 transition-all duration-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.vendorTypes.purchaseVendor}
                      onChange={(e) => setFormData({
                        ...formData,
                        vendorTypes: { ...formData.vendorTypes, purchaseVendor: e.target.checked }
                      })}
                      className="w-5 h-5 cursor-pointer accent-teal-500"
                    />
                    <span className="flex items-center gap-2.5 text-sm font-medium text-gray-800">
                      <i className="fas fa-shopping-cart w-5 text-center text-teal-500"></i>
                      Purchase Vendor
                    </span>
                  </label>

                  <label className="flex items-center gap-3 p-3 rounded-md hover:bg-cyan-50 hover:translate-x-1 transition-all duration-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.vendorTypes.maintenancePartner}
                      onChange={(e) => setFormData({
                        ...formData,
                        vendorTypes: { ...formData.vendorTypes, maintenancePartner: e.target.checked }
                      })}
                      className="w-5 h-5 cursor-pointer accent-teal-500"
                    />
                    <span className="flex items-center gap-2.5 text-sm font-medium text-gray-800">
                      <i className="fas fa-tools w-5 text-center text-amber-500"></i>
                      Maintenance Partner
                    </span>
                  </label>

                  <label className="flex items-center gap-3 p-3 rounded-md hover:bg-cyan-50 hover:translate-x-1 transition-all duration-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.vendorTypes.scrapDisposalPartner}
                      onChange={(e) => setFormData({
                        ...formData,
                        vendorTypes: { ...formData.vendorTypes, scrapDisposalPartner: e.target.checked }
                      })}
                      className="w-5 h-5 cursor-pointer accent-teal-500"
                    />
                    <span className="flex items-center gap-2.5 text-sm font-medium text-gray-800">
                      <i className="fas fa-recycle w-5 text-center text-purple-500"></i>
                      Scrap Disposal Partner
                    </span>
                  </label>
                </div>
                <small className="text-gray-500 text-xs block mt-1">
                  <i className="fas fa-info-circle"></i> Select one or more vendor types (minimum 1 required)
                </small>
                {vendorTypeError && (
                  <small className="text-red-500 text-xs block mt-1 font-semibold">
                    <i className="fas fa-exclamation-circle"></i> Please select at least one vendor type
                  </small>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-600 flex items-center gap-1.5">
                    <i className="fas fa-phone text-teal-500"></i>
                    Contact Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-semibold pointer-events-none">+91</span>
                    <input
                      type="text"
                      value={formData.contact}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 10);
                        setFormData({ ...formData, contact: value });
                      }}
                      placeholder="9876543210"
                      required
                      maxLength="10"
                      className="py-2.5 pl-12 pr-3 border-2 border-gray-200 rounded-md text-gray-800 text-sm outline-none focus:border-teal-400 focus:ring-4 focus:ring-cyan-100 transition-all duration-200 w-full bg-white"
                    />
                  </div>
                  <small className="text-gray-500 text-xs block mt-1">
                    <i className="fas fa-info-circle"></i> Enter 10-digit mobile number starting with 6, 7, 8 or 9
                  </small>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-600 flex items-center gap-1.5">
                    <i className="fas fa-envelope text-teal-500"></i>
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value.toLowerCase() })}
                    placeholder="vendor@example.com"
                    required
                    maxLength="100"
                    className="py-2.5 px-3 border-2 border-gray-200 rounded-md text-gray-800 text-sm outline-none focus:border-teal-400 focus:ring-4 focus:ring-cyan-100 transition-all duration-200 w-full bg-white"
                  />
                  <small className="text-gray-500 text-xs block mt-1">
                    <i className="fas fa-info-circle"></i> Must contain @ and end with .com, .in, .org, .net, .co.in
                  </small>
                </div>
              </div>

              <div className="flex flex-col gap-1.5 mb-4">
                <label className="text-xs font-semibold text-gray-600 flex items-center gap-1.5">
                  <i className="fas fa-map-marker-alt text-teal-500"></i>
                  Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  rows="2"
                  placeholder="Enter complete address with building/street/landmark"
                  required
                  minLength="10"
                  maxLength="500"
                  className="py-2.5 px-3 border-2 border-gray-200 rounded-md text-gray-800 text-sm outline-none focus:border-teal-400 focus:ring-4 focus:ring-cyan-100 transition-all duration-200 w-full bg-white resize-y min-h-[60px]"
                ></textarea>
                <small className="text-gray-500 text-xs block mt-1">
                  <i className="fas fa-info-circle"></i> Complete address (minimum 10 characters)
                </small>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-600 flex items-center gap-1.5">
                    <i className="fas fa-map-pin text-teal-500"></i>
                    Pincode <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.pincode}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 6);
                      setFormData({ ...formData, pincode: value });
                    }}
                    placeholder="600001"
                    required
                    minLength="6"
                    maxLength="6"
                    className="py-2.5 px-3 border-2 border-gray-200 rounded-md text-gray-800 text-sm outline-none focus:border-teal-400 focus:ring-4 focus:ring-cyan-100 transition-all duration-200 w-full bg-white"
                  />
                  <small className="text-gray-500 text-xs block mt-1">
                    <i className="fas fa-info-circle"></i> 6-digit Indian pincode
                  </small>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-600 flex items-center gap-1.5">
                    <i className="fas fa-city text-teal-500"></i>
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^a-zA-Z\s]/g, '');
                      setFormData({ ...formData, city: value });
                    }}
                    placeholder="Chennai"
                    required
                    minLength="2"
                    maxLength="50"
                    className="py-2.5 px-3 border-2 border-gray-200 rounded-md text-gray-800 text-sm outline-none focus:border-teal-400 focus:ring-4 focus:ring-cyan-100 transition-all duration-200 w-full bg-white"
                  />
                  <small className="text-gray-500 text-xs block mt-1">
                    <i className="fas fa-info-circle"></i> City name (letters only)
                  </small>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-600 flex items-center gap-1.5">
                    <i className="fas fa-map text-teal-500"></i>
                    State <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^a-zA-Z\s]/g, '');
                      setFormData({ ...formData, state: value });
                    }}
                    placeholder="Tamil Nadu"
                    required
                    minLength="2"
                    maxLength="50"
                    className="py-2.5 px-3 border-2 border-gray-200 rounded-md text-gray-800 text-sm outline-none focus:border-teal-400 focus:ring-4 focus:ring-cyan-100 transition-all duration-200 w-full bg-white"
                  />
                  <small className="text-gray-500 text-xs block mt-1">
                    <i className="fas fa-info-circle"></i> State name (letters only)
                  </small>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-600 flex items-center gap-1.5">
                    <i className="fas fa-file-invoice text-teal-500"></i>
                    GST Number <small className="text-gray-500">(Optional)</small>
                  </label>
                  <input
                    type="text"
                    value={formData.gst}
                    onChange={(e) => {
                      const value = e.target.value.toUpperCase().replace(/[^0-9A-Z]/g, '').slice(0, 15);
                      setFormData({ ...formData, gst: value });
                    }}
                    placeholder="33AAAPL1234C1Z9"
                    maxLength="15"
                    className="py-2.5 px-3 border-2 border-gray-200 rounded-md text-gray-800 text-sm outline-none focus:border-teal-400 focus:ring-4 focus:ring-cyan-100 transition-all duration-200 w-full bg-white"
                  />
                  <small className="text-gray-500 text-xs block mt-1">
                    <i className="fas fa-info-circle"></i> 15-character GST format: 33AAAPL1234C1Z9
                  </small>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-600 flex items-center gap-1.5">
                    <i className="fas fa-toggle-on text-teal-500"></i>
                    Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    required
                    className="py-2.5 px-3 border-2 border-gray-200 rounded-md text-gray-800 text-sm outline-none focus:border-teal-400 focus:ring-4 focus:ring-cyan-100 transition-all duration-200 w-full bg-white cursor-pointer"
                  >
                    <option value={VENDOR_STATUS.ACTIVE}>Active</option>
                    <option value={VENDOR_STATUS.INACTIVE}>Inactive</option>
                  </select>
                </div>
              </div>
            </form>
          </div>
          <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-2.5 bg-gray-50">
            <button
              onClick={onClose}
              className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-gray-50 text-gray-700 border border-gray-200 rounded-md text-sm font-semibold cursor-pointer hover:bg-white hover:border-teal-400 hover:text-teal-500 transition-all duration-200"
            >
              <i className="fas fa-times text-sm"></i>
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-gradient-to-br from-teal-400 to-teal-700 text-white border-none rounded-md text-sm font-semibold cursor-pointer shadow-sm hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200"
            >
              <i className="fas fa-save text-sm"></i>
              Save Vendor
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================================================
// VIEW VENDOR DETAILS MODAL
// ==========================================================================
const ViewVendorModal = ({ isOpen, onClose, vendor }) => {
  if (!isOpen || !vendor) return null;

  const vendorTypes = Array.isArray(vendor.vendorType) ? vendor.vendorType : [vendor.vendorType];

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-5">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-full max-w-4xl max-h-[90vh] animate-in fade-in duration-300">
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
          <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center bg-gray-50">
            <h2 className="text-lg font-bold text-gray-800">Vendor Details</h2>
            <button
              onClick={onClose}
              className="bg-transparent border-none text-gray-500 text-xl cursor-pointer p-1 rounded-md w-8 h-8 flex items-center justify-center hover:bg-white hover:text-gray-800 transition-all duration-200"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
          <div className="p-6 overflow-y-auto flex-1">
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-5 p-6 bg-gray-50 rounded-md">
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-3xl"
                  style={{ backgroundColor: vendor.avatarColor }}
                >
                  {vendor.avatar}
                </div>
                <div>
                  <h3 className="m-0 text-gray-800 text-xl font-bold">{vendor.companyName || vendor.vendorName}</h3>
                  <p className="mt-1 mb-0 text-gray-500">Contact: {vendor.vendorName} | ID: #{vendor.id}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-md">
                  <div className="flex items-center gap-2 mb-2">
                    <i className="fas fa-tags text-teal-500"></i>
                    <strong>Vendor Type(s):</strong>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {vendorTypes.map((type, idx) => (
                      <VendorTypeBadge key={idx} type={type} />
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-md">
                  <div className="flex items-center gap-2 mb-2">
                    <i className="fas fa-toggle-on text-teal-500"></i>
                    <strong>Status:</strong>
                  </div>
                  <span className={`inline-block px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wide ${
                    vendor.status === VENDOR_STATUS.ACTIVE ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                  }`}>
                    {vendor.status}
                  </span>
                </div>

                <div className="p-4 bg-gray-50 rounded-md">
                  <div className="flex items-center gap-2 mb-2">
                    <i className="fas fa-phone text-teal-500"></i>
                    <strong>Contact:</strong>
                  </div>
                  <p className="m-0 text-gray-700">{vendor.contact}</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-md">
                  <div className="flex items-center gap-2 mb-2">
                    <i className="fas fa-envelope text-teal-500"></i>
                    <strong>Email:</strong>
                  </div>
                  <p className="m-0 text-gray-700">{vendor.email}</p>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-md">
                <div className="flex items-center gap-2 mb-2">
                  <i className="fas fa-map-marker-alt text-teal-500"></i>
                  <strong>Address:</strong>
                </div>
                <p className="m-0 text-gray-700">{vendor.address}</p>
                <p className="mt-1 mb-0 text-gray-500">{vendor.city}, {vendor.state} - {vendor.pincode}</p>
              </div>

              {vendor.gst && (
                <div className="p-4 bg-gray-50 rounded-md">
                  <div className="flex items-center gap-2 mb-2">
                    <i className="fas fa-file-invoice text-teal-500"></i>
                    <strong>GST Number:</strong>
                  </div>
                  <p className="m-0 text-gray-700 font-mono">{vendor.gst}</p>
                </div>
              )}
            </div>
          </div>
          <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-2.5 bg-gray-50">
            <button
              onClick={onClose}
              className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-gray-50 text-gray-700 border border-gray-200 rounded-md text-sm font-semibold cursor-pointer hover:bg-white hover:border-teal-400 hover:text-teal-500 transition-all duration-200"
            >
              <i className="fas fa-times text-sm"></i>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================================================
// MAIN VENDOR MANAGEMENT COMPONENT
// ==========================================================================
const VendorManagement = () => {
  const [vendorData, setVendorData] = useState([...DUMMY_VENDORS]);
  const [currentVendor, setCurrentVendor] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [vendorModalOpen, setVendorModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterType, setFilterType] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [confirmConfig, setConfirmConfig] = useState({
    title: '',
    message: '',
    onConfirm: null,
    type: 'warning',
    isDanger: false
  });

  // Calculate statistics using memoization for performance
  // Using DUMMY_STATISTICS_DATA to simulate API response
  // In production, this would be: const stats = useMemo(() => calculateVendorStats(vendorData, apiStatsData), [vendorData, apiStatsData]);
  const stats = useMemo(() => calculateVendorStats(vendorData, DUMMY_STATISTICS_DATA), [vendorData]);

  // Get filtered vendors using memoization
  const filteredVendors = useMemo(() => 
    getFilteredVendors(vendorData, { searchValue, filterStatus, filterType }),
    [vendorData, searchValue, filterStatus, filterType]
  );

  useEffect(() => {
    showToast('Vendor Management loaded successfully!', 'success');
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 3000);
  };

  const openAddVendorModal = () => {
    setCurrentVendor(null);
    setVendorModalOpen(true);
  };

  const closeVendorModal = () => {
    setVendorModalOpen(false);
    setCurrentVendor(null);
  };

  const editVendor = (id) => {
    const vendor = vendorData.find(v => v.id === id);
    if (!vendor) {
      showToast('Vendor not found!', 'error');
      return;
    }
    setCurrentVendor(vendor);
    setVendorModalOpen(true);
  };

  const saveVendor = (formData) => {
    const { vendorName, companyName, contact, email, address, pincode, city, state, gst, status, vendorTypes } = formData;

    // Validate using the utility function
    const validation = validateVendorData({
      vendorName,
      companyName,
      contact,
      email,
      address,
      pincode,
      city,
      state,
      gst,
      vendorTypes
    });

    if (!validation.isValid) {
      showToast(validation.errors[0], 'error');
      return;
    }

    const formattedContact = `+91 ${contact}`;

    if (currentVendor) {
      // Update existing vendor
      const updatedVendors = vendorData.map(v =>
        v.id === currentVendor.id
          ? {
            ...v,
            vendorName,
            companyName,
            vendorType: vendorTypes,
            contact: formattedContact,
            email,
            address,
            pincode,
            city,
            state,
            gst,
            status
          }
          : v
      );
      setVendorData(updatedVendors);
      showToast('Vendor updated successfully!', 'success');
    } else {
      // Add new vendor
      const newId = Math.max(...vendorData.map(v => v.id)) + 1;
      const avatarData = generateVendorAvatar(companyName);

      const newVendor = {
        id: newId,
        vendorName,
        companyName,
        vendorType: vendorTypes,
        contact: formattedContact,
        email,
        address,
        pincode,
        city,
        state,
        gst,
        status,
        lastOrderDate: new Date().toISOString().split('T')[0],
        totalOrders: 0,
        ...avatarData
      };

      setVendorData([...vendorData, newVendor]);
      showToast('Vendor added successfully!', 'success');
    }

    closeVendorModal();
  };

  const deleteVendor = (id) => {
    const vendor = vendorData.find(v => v.id === id);
    if (!vendor) return;

    setConfirmConfig({
      title: 'Delete Vendor',
      message: `Are you sure you want to delete "${vendor.companyName || vendor.vendorName}"? This action cannot be undone.`,
      onConfirm: () => {
        setVendorData(vendorData.filter(v => v.id !== id));
        showToast('Vendor deleted successfully!', 'success');
        setConfirmModalOpen(false);
      },
      type: 'error',
      isDanger: true
    });
    setConfirmModalOpen(true);
  };

  const viewVendor = (id) => {
    const vendor = vendorData.find(v => v.id === id);
    if (!vendor) {
      showToast('Vendor not found!', 'error');
      return;
    }
    setSelectedVendor(vendor);
    setViewModalOpen(true);
  };

  const clearFilters = () => {
    setSearchValue('');
    setFilterStatus('');
    setFilterType('');
    showToast('Filters cleared', 'info');
  };

  const refreshData = () => {
    showToast('Data refreshed successfully!', 'info');
    // In a real app, this would fetch fresh data from the server
  };

  const logout = () => {
    setConfirmConfig({
      title: 'Logout Confirmation',
      message: 'Are you sure you want to logout?',
      onConfirm: () => {
        showToast('Logging out...', 'info');
        setTimeout(() => {
          window.location.href = '/';
        }, 1000);
        setConfirmModalOpen(false);
      },
      type: 'warning',
      isDanger: false
    });
    setConfirmModalOpen(true);
  };

  const displayData = searchValue || filterStatus || filterType ? filteredVendors : vendorData;

  return (
    <>
      <ScrollbarStyles />

      <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-gray-50 to-cyan-50 font-sans">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden fixed top-3 left-3 z-50 bg-gradient-to-br from-teal-400 to-teal-700 text-white w-10 h-10 rounded-lg flex items-center justify-center shadow-md hover:scale-110 transition-transform duration-200"
        >
          <i className="fas fa-bars text-lg"></i>
        </button>

        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} onLogout={logout} />

        <div className="ml-0 lg:ml-64 min-h-screen">
          <main className="p-5">
            <header className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5">
                <div className="flex-1">
                  <h1 className="text-2xl font-extrabold bg-gradient-to-br from-teal-400 to-teal-700 bg-clip-text text-transparent mb-1 flex items-center gap-2.5">
                    <i className="fas fa-store bg-gradient-to-br from-teal-400 to-teal-700 bg-clip-text text-transparent"></i>
                    Vendor Management
                  </h1>
                  <p className="text-gray-500 text-sm font-medium">
                    Manage vendors, track deliveries, and monitor vendor performance
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2.5 items-center w-full lg:w-auto">
                  <button
                    onClick={openAddVendorModal}
                    className="flex-1 lg:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 bg-gradient-to-br from-teal-400 to-teal-700 text-white border-none rounded-md text-sm font-semibold cursor-pointer shadow-sm hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200"
                  >
                    <i className="fas fa-plus text-sm"></i>
                    Add Vendor
                  </button>
                  <button
                    onClick={refreshData}
                    className="flex-1 lg:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 bg-gray-50 text-gray-700 border border-gray-200 rounded-md text-sm font-semibold cursor-pointer hover:bg-white hover:border-teal-400 hover:text-teal-500 transition-all duration-200"
                  >
                    <i className="fas fa-sync-alt text-sm"></i>
                    Refresh
                  </button>
                </div>
              </div>
            </header>

            {/* Statistics Cards - Now dynamically calculated from VendorData */}
            <section className="mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <StatCard
                  icon="fa-store"
                  title="Total Vendors"
                  value={stats.total}
                  change={`${stats.monthlyChange} This Month`}
                  changeType={stats.monthlyChangeType}
                />
                <StatCard
                  icon="fa-check-circle"
                  title="Active Vendors"
                  value={stats.active}
                  change={`${stats.activeRate}% Active Rate`}
                  changeType="positive"
                />
                <StatCard
                  icon="fa-times-circle"
                  title="Inactive Vendors"
                  value={stats.inactive}
                  change={`${stats.inactiveRate}% Inactive Rate`}
                  changeType="negative"
                />
              </div>
            </section>

            <section className="mb-6">
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-200 flex justify-between items-center">
                  <div className="flex items-center gap-2 text-base font-bold text-gray-800">
                    <i className="fas fa-filter text-lg text-teal-500"></i>
                    Filters
                  </div>
                </div>
                <div className="p-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-gray-600 mb-0.5">Search Vendor</label>
                      <input
                        type="text"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        placeholder="Search by name, contact, email..."
                        className="py-2.5 px-3 border-2 border-gray-200 rounded-md text-gray-800 text-sm outline-none focus:border-teal-400 focus:ring-4 focus:ring-cyan-100 transition-all duration-200 w-full bg-white"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-gray-600 mb-0.5">Status</label>
                      <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="py-2.5 px-3 border-2 border-gray-200 rounded-md text-gray-800 text-sm outline-none focus:border-teal-400 focus:ring-4 focus:ring-cyan-100 transition-all duration-200 w-full bg-white cursor-pointer"
                      >
                        <option value="">All Status</option>
                        <option value={VENDOR_STATUS.ACTIVE}>Active</option>
                        <option value={VENDOR_STATUS.INACTIVE}>Inactive</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-gray-600 mb-0.5">Type of Vendor</label>
                      <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="py-2.5 px-3 border-2 border-gray-200 rounded-md text-gray-800 text-sm outline-none focus:border-teal-400 focus:ring-4 focus:ring-cyan-100 transition-all duration-200 w-full bg-white cursor-pointer"
                      >
                        <option value="">All Types</option>
                        {VENDOR_TYPE_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <button
                        onClick={() => showToast('Filters applied', 'info')}
                        className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-gradient-to-br from-teal-400 to-teal-700 text-white border-none rounded-md text-sm font-semibold cursor-pointer shadow-sm hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 w-full"
                      >
                        <i className="fas fa-filter text-sm"></i>
                        Apply Filters
                      </button>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <button
                        onClick={clearFilters}
                        className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-gradient-to-br from-red-500 to-red-700 text-white border-none rounded-md text-sm font-semibold cursor-pointer shadow-sm hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 w-full"
                      >
                        <i className="fas fa-times text-sm"></i>
                        Clear All
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-6">
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-200 flex justify-between items-center">
                  <div className="flex items-center gap-2 text-base font-bold text-gray-800">
                    <i className="fas fa-building text-lg text-teal-500"></i>
                    Vendor Directory
                  </div>
                </div>
                <div className="p-5">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse bg-white">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="py-3 px-4 text-left font-bold text-gray-600 text-xs uppercase tracking-wide border-b-2 border-gray-200 whitespace-nowrap">ID</th>
                          <th className="py-3 px-4 text-left font-bold text-gray-600 text-xs uppercase tracking-wide border-b-2 border-gray-200 whitespace-nowrap">Vendor Details</th>
                          <th className="py-3 px-4 text-left font-bold text-gray-600 text-xs uppercase tracking-wide border-b-2 border-gray-200 whitespace-nowrap">Contact Info</th>
                          <th className="py-3 px-4 text-left font-bold text-gray-600 text-xs uppercase tracking-wide border-b-2 border-gray-200 whitespace-nowrap">Location & GST</th>
                          <th className="py-3 px-4 text-left font-bold text-gray-600 text-xs uppercase tracking-wide border-b-2 border-gray-200 whitespace-nowrap">Type of Vendor</th>
                          <th className="py-3 px-4 text-left font-bold text-gray-600 text-xs uppercase tracking-wide border-b-2 border-gray-200 whitespace-nowrap">Status</th>
                          <th className="py-3 px-4 text-left font-bold text-gray-600 text-xs uppercase tracking-wide border-b-2 border-gray-200 whitespace-nowrap">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {displayData.length === 0 ? (
                          <tr>
                            <td colSpan="7" className="text-center py-10">
                              <i className="fas fa-inbox text-5xl text-gray-400 mb-4 block"></i>
                              <p className="text-gray-500 text-sm">No vendors found</p>
                            </td>
                          </tr>
                        ) : (
                          displayData.map((vendor) => {
                            const vendorTypes = Array.isArray(vendor.vendorType) ? vendor.vendorType : [vendor.vendorType];
                            return (
                              <tr key={vendor.id} className="hover:bg-cyan-50 transition-colors duration-200">
                                <td className="py-3 px-4 border-b border-gray-200 text-gray-800 text-sm">
                                  <strong>#{vendor.id}</strong>
                                </td>
                                <td className="py-3 px-4 border-b border-gray-200 text-gray-800 text-sm">
                                  <div className="flex items-center gap-3">
                                    <div
                                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                                      style={{ backgroundColor: vendor.avatarColor }}
                                    >
                                      {vendor.avatar}
                                    </div>
                                    <div>
                                      <div className="font-semibold text-gray-800">{vendor.companyName || vendor.vendorName}</div>
                                      <div className="text-xs text-gray-500">{vendor.vendorName}</div>
                                    </div>
                                  </div>
                                </td>
                                <td className="py-3 px-4 border-b border-gray-200 text-gray-800 text-sm">
                                  <div className="flex flex-col gap-1">
                                    <div className="flex items-center gap-1.5">
                                      <i className="fas fa-phone text-teal-500 text-xs"></i>
                                      <span className="text-sm">{vendor.contact}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                      <i className="fas fa-envelope text-teal-500 text-xs"></i>
                                      <span className="text-sm">{vendor.email}</span>
                                    </div>
                                  </div>
                                </td>
                                <td className="py-3 px-4 border-b border-gray-200 text-gray-800 text-sm">
                                  <div className="flex flex-col gap-1">
                                    <div className="flex items-center gap-1.5">
                                      <i className="fas fa-map-marker-alt text-teal-500 text-xs"></i>
                                      <span className="text-sm">{vendor.city}, {vendor.state}</span>
                                    </div>
                                    {vendor.gst && (
                                      <div className="flex items-center gap-1.5">
                                        <i className="fas fa-file-invoice text-teal-500 text-xs"></i>
                                        <span className="text-xs text-gray-500 font-mono">{vendor.gst}</span>
                                      </div>
                                    )}
                                  </div>
                                </td>
                                <td className="py-3 px-4 border-b border-gray-200 text-gray-800 text-sm">
                                  <div className="flex flex-wrap gap-2">
                                    {vendorTypes.map((type, idx) => (
                                      <VendorTypeBadge key={idx} type={type} />
                                    ))}
                                  </div>
                                </td>
                                <td className="py-3 px-4 border-b border-gray-200 text-gray-800 text-sm">
                                  <span className={`inline-block px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wide ${
                                    vendor.status === VENDOR_STATUS.ACTIVE ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                                  }`}>
                                    {vendor.status}
                                  </span>
                                </td>
                                <td className="py-3 px-4 border-b border-gray-200 text-gray-800 text-sm">
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => viewVendor(vendor.id)}
                                      className="px-3 py-1.5 bg-blue-500 text-white border-none rounded-md cursor-pointer text-xs font-semibold inline-flex items-center gap-1 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200"
                                      title="View Details"
                                    >
                                      <i className="fas fa-eye text-xs"></i>
                                    </button>
                                    <button
                                      onClick={() => editVendor(vendor.id)}
                                      className="px-3 py-1.5 bg-yellow-500 text-white border-none rounded-md cursor-pointer text-xs font-semibold inline-flex items-center gap-1 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200"
                                      title="Edit Vendor"
                                    >
                                      <i className="fas fa-edit text-xs"></i>
                                    </button>
                                    <button
                                      onClick={() => deleteVendor(vendor.id)}
                                      className="px-3 py-1.5 bg-red-500 text-white border-none rounded-md cursor-pointer text-xs font-semibold inline-flex items-center gap-1 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200"
                                      title="Delete Vendor"
                                    >
                                      <i className="fas fa-trash text-xs"></i>
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </section>
          </main>
        </div>

        <VendorModal
          isOpen={vendorModalOpen}
          onClose={closeVendorModal}
          vendor={currentVendor}
          onSave={saveVendor}
        />

        <ViewVendorModal
          isOpen={viewModalOpen}
          onClose={() => setViewModalOpen(false)}
          vendor={selectedVendor}
        />

        <ConfirmModal
          isOpen={confirmModalOpen}
          title={confirmConfig.title}
          message={confirmConfig.message}
          onConfirm={confirmConfig.onConfirm}
          onCancel={() => setConfirmModalOpen(false)}
          type={confirmConfig.type}
          isDanger={confirmConfig.isDanger}
        />

        <Toast show={toast.show} message={toast.message} type={toast.type} />
      </div>
    </>
  );
};

export default VendorManagement;