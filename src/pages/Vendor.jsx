// src/pages/Vendor.jsx
import React, { useState, useEffect, useMemo, useRef } from 'react';
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
    <div className={`fixed top-5 right-5 ${bgColorMap[type]} text-white px-5 py-3.5 rounded-md flex items-center gap-3 font-semibold text-sm z-[9999] shadow-2xl animate-in slide-in-from-right duration-300`}>
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
    <div className="fixed inset-0 flex items-center justify-center z-[9999] animate-in fade-in duration-200">
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
              className={`flex-1 px-5 py-3 text-white rounded-md text-sm font-semibold cursor-pointer hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 ${isDanger ? 'bg-red-500 hover:bg-red-600' : 'bg-teal-500 hover:bg-teal-600'
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
    <div className="fixed inset-0 flex items-center justify-center z-[9999] p-5">
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
              {/* Vendor Name & Company Name */}
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

              {/* Vendor Type Selection */}
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

              {/* Contact & Email */}
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

              {/* Address */}
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

              {/* Pincode, City, State */}
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

              {/* GST & Status */}
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
    <div className="fixed inset-0 flex items-center justify-center z-[9999] p-5">
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
                  <span className={`inline-block px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wide ${vendor.status === VENDOR_STATUS.ACTIVE ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-md">
                  <div className="flex items-center gap-2 mb-2">
                    <i className="fas fa-shopping-cart text-teal-500"></i>
                    <strong>Total Orders:</strong>
                  </div>
                  <p className="m-0 text-gray-700 text-2xl font-bold">{vendor.totalOrders}</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-md">
                  <div className="flex items-center gap-2 mb-2">
                    <i className="fas fa-calendar text-teal-500"></i>
                    <strong>Last Order Date:</strong>
                  </div>
                  <p className="m-0 text-gray-700">{new Date(vendor.lastOrderDate).toLocaleDateString('en-IN')}</p>
                </div>
              </div>
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
const Vendor = () => {
  const [vendors, setVendors] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterType, setFilterType] = useState('');
  const [selectedVendors, setSelectedVendors] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const [editingVendor, setEditingVendor] = useState(null);
  const [viewingVendor, setViewingVendor] = useState(null);
  const [deletingVendorId, setDeletingVendorId] = useState(null);

  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // Initialize vendors from dummy data
  useEffect(() => {
    setVendors(DUMMY_VENDORS);
  }, []);

  // Calculate statistics
  const stats = useMemo(() => {
    return calculateVendorStats(vendors, DUMMY_STATISTICS_DATA);
  }, [vendors]);

  // Filter vendors
  const filteredVendors = useMemo(() => {
    return getFilteredVendors(vendors, { searchValue, filterStatus, filterType });
  }, [vendors, searchValue, filterStatus, filterType]);

  // Toast notification handler
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 3000);
  };

  // Handle Refresh
const handleRefresh = () => {
  // Show loading state with spinning icon
  const refreshButton = document.querySelector('[title="Refresh vendor list"] i');
  if (refreshButton) {
    refreshButton.classList.add('fa-spin');
  }

  // Show refreshing toast
  showToast('Refreshing vendor data...', 'info');

  // Simulate data refresh (in real app, this would be an API call)
  setTimeout(() => {
    // Reset vendors to original dummy data
    setVendors(DUMMY_VENDORS);
    
    // Clear all filters
    setSearchValue('');
    setFilterStatus('');
    setFilterType('');
    setSelectedVendors([]);
    
    // Stop spinning
    if (refreshButton) {
      refreshButton.classList.remove('fa-spin');
    }
    
    // Show success message AFTER refresh completes
    setTimeout(() => {
      showToast('Vendor list refreshed successfully', 'success');
    }, 100);
  }, 800);
};

  // Handle Add Vendor
  const handleAddVendor = () => {
    setEditingVendor(null);
    setShowModal(true);
  };

  // Handle Edit Vendor
  const handleEditVendor = (vendor) => {
    setEditingVendor(vendor);
    setShowModal(true);
  };

  // Handle View Vendor
  const handleViewVendor = (vendor) => {
    setViewingVendor(vendor);
    setShowViewModal(true);
  };

  // Handle Delete Vendor (Single)
  const handleDeleteVendor = (id) => {
    setDeletingVendorId(id);
    setShowConfirmModal(true);
  };

  // Confirm Delete
  const confirmDelete = () => {
    if (deletingVendorId) {
      setVendors(vendors.filter(v => v.id !== deletingVendorId));
      showToast('Vendor deleted successfully', 'success');
      setDeletingVendorId(null);
    } else if (selectedVendors.length > 0) {
      setVendors(vendors.filter(v => !selectedVendors.includes(v.id)));
      showToast(`${selectedVendors.length} vendors deleted successfully`, 'success');
      setSelectedVendors([]);
    }
    setShowConfirmModal(false);
  };

  // Handle Bulk Delete
  const handleBulkDelete = () => {
    setDeletingVendorId(null);
    setShowConfirmModal(true);
  };

  // Handle Save Vendor (Add/Edit)
  const handleSaveVendor = (formData) => {
    if (editingVendor) {
      // Edit existing vendor
      const updatedVendor = {
        ...editingVendor,
        vendorName: formData.vendorName,
        companyName: formData.companyName,
        contact: `+91 ${formData.contact}`,
        email: formData.email,
        address: formData.address,
        pincode: formData.pincode,
        city: formData.city,
        state: formData.state,
        gst: formData.gst,
        status: formData.status,
        vendorType: formData.vendorTypes
      };

      setVendors(vendors.map(v => v.id === editingVendor.id ? updatedVendor : v));
      showToast('Vendor updated successfully', 'success');
    } else {
      // Add new vendor
      const avatarData = generateVendorAvatar(formData.companyName);
      const newVendor = {
        id: Date.now(),
        vendorName: formData.vendorName,
        companyName: formData.companyName,
        contact: `+91 ${formData.contact}`,
        email: formData.email,
        address: formData.address,
        pincode: formData.pincode,
        city: formData.city,
        state: formData.state,
        gst: formData.gst,
        status: formData.status,
        vendorType: formData.vendorTypes,
        lastOrderDate: new Date().toISOString().split('T')[0],
        totalOrders: 0,
        avatar: avatarData.avatar,
        avatarColor: avatarData.avatarColor
      };

      setVendors([...vendors, newVendor]);
      showToast('Vendor added successfully', 'success');
    }

    setShowModal(false);
    setEditingVendor(null);
  };

  // Handle Select All
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedVendors(filteredVendors.map(v => v.id));
    } else {
      setSelectedVendors([]);
    }
  };

  // Handle Select Single
  const handleSelectVendor = (id) => {
    setSelectedVendors(prev =>
      prev.includes(id) ? prev.filter(vid => vid !== id) : [...prev, id]
    );
  };

  // Clear Filters
  const clearFilters = () => {
    setSearchValue('');
    setFilterStatus('');
    setFilterType('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-gray-50 to-cyan-50 p-5">
      {/* Header */}
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6 flex justify-between items-center flex-wrap gap-4">
        <div className="flex-1">
          <h1 className="text-2xl font-extrabold bg-gradient-to-br from-teal-400 to-teal-700 bg-clip-text text-transparent mb-1 flex items-center gap-2.5">
            <i className="fas fa-store bg-gradient-to-br from-teal-400 to-teal-700 bg-clip-text"></i>
            Vendor Management
          </h1>
          <p className="text-gray-600 text-sm font-medium">Manage your suppliers and vendor relationships</p>
        </div>
        <div className="flex gap-2.5 items-center flex-wrap">
          <button
            onClick={handleAddVendor}
            className="px-4 py-2.5 bg-gradient-to-br from-teal-400 to-teal-700 text-white border-none rounded-md text-sm font-semibold cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-lg flex items-center gap-2"
          >
            <i className="fas fa-plus"></i>
            Add Vendor
          </button>
          <button
            onClick={handleRefresh}
            className="px-4 py-2.5 bg-gradient-to-br from-blue-400 to-blue-600 text-white border-none rounded-md text-sm font-semibold cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-lg flex items-center gap-2"
            title="Refresh vendor list"
          >
            <i className="fas fa-sync-alt"></i>
            Refresh
          </button>

        </div>
      </div>


      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard
          icon="fa-users"
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
          icon="fa-ban"
          title="Inactive Vendors"
          value={stats.inactive}
          change={`${stats.inactiveRate}% Inactive Rate`}
          changeType="negative"
        />
        <StatCard
          icon="fa-shopping-cart"
          title="Total Orders"
          value={stats.totalOrders}
          change="All Vendors"
          changeType="positive"
        />
      </div>

      {/* Filters */}
      <div className="mb-6">
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b-2 border-gray-200 bg-gray-50 flex justify-between items-center flex-wrap gap-3">
            <div className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <i className="fas fa-filter text-teal-500 text-xl"></i>
              Filters
            </div>
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-gradient-to-br from-red-500 to-red-700 text-white border-none rounded-md text-sm font-semibold cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-lg flex items-center gap-2"
            >
              <i className="fas fa-times"></i>
              Clear
            </button>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <input
                  type="text"
                  placeholder="Search vendors..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-md text-sm text-gray-800 outline-none transition-all focus:border-teal-400 focus:ring-4 focus:ring-cyan-100"
                />
              </div>
              <div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full p-2.5 border-2 border-gray-200 rounded-md text-sm text-gray-800 outline-none transition-all cursor-pointer focus:border-teal-400 focus:ring-4 focus:ring-cyan-100"
                >
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full p-2.5 border-2 border-gray-200 rounded-md text-sm text-gray-800 outline-none transition-all cursor-pointer focus:border-teal-400 focus:ring-4 focus:ring-cyan-100"
                >
                  <option value="">All Types</option>
                  <option value={VENDOR_TYPES.PURCHASE}>Purchase Vendor</option>
                  <option value={VENDOR_TYPES.MAINTENANCE}>Maintenance Partner</option>
                  <option value={VENDOR_TYPES.SCRAP}>Scrap Disposal Partner</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

    {/* Vendor Table */}
<div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm mb-6">
  <div className="bg-gray-50 p-4 border-b-2 border-gray-200 flex justify-between items-center flex-wrap gap-4">
    <div className="flex items-center gap-2.5 text-lg font-bold text-gray-800">
      <i className="fas fa-list text-teal-500 text-xl"></i>
      Vendor Directory ({filteredVendors.length})
    </div>
    <div className="flex gap-2 flex-wrap">
      <button className="px-4 py-2 bg-gray-50 text-gray-700 border border-gray-200 rounded-md text-sm font-semibold cursor-pointer transition-all hover:bg-white hover:border-teal-400 hover:text-teal-500 flex items-center gap-2">
        <i className="fas fa-download"></i>
        Export
      </button>
    </div>
  </div>

  {selectedVendors.length > 0 && (
    <div className="bg-cyan-50 p-4 border-b-2 border-gray-200 flex justify-between items-center gap-4 flex-wrap">
      <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
        <i className="fas fa-check-square text-teal-500 text-base"></i>
        <span className="text-teal-600 font-bold text-base">{selectedVendors.length}</span> vendors selected
      </div>
      <div className="flex gap-2 items-center flex-wrap">
        <button
          onClick={handleBulkDelete}
          className="px-4 py-2 bg-gradient-to-br from-red-500 to-red-700 text-white border-none rounded-md text-sm font-semibold cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-lg flex items-center gap-2"
        >
          <i className="fas fa-trash"></i>
          Delete Selected
        </button>
      </div>
    </div>
  )}

  <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
    <table className="w-full border-collapse min-w-[1400px]">
      <thead className="sticky top-0 z-10 bg-gray-50">
        <tr>
          <th className="p-3 text-left border-b border-gray-200 font-bold text-gray-600 text-xs uppercase tracking-wider bg-gray-50 w-12">
            <input
              type="checkbox"
              onChange={handleSelectAll}
              checked={selectedVendors.length === filteredVendors.length && filteredVendors.length > 0}
              className="w-4 h-4 cursor-pointer accent-teal-500"
            />
          </th>
          <th className="p-3 text-left border-b border-gray-200 font-bold text-gray-600 text-xs uppercase tracking-wider bg-gray-50 w-16">ID</th>
          <th className="p-3 text-left border-b border-gray-200 font-bold text-gray-600 text-xs uppercase tracking-wider bg-gray-50">Vendor Details</th>
          <th className="p-3 text-left border-b border-gray-200 font-bold text-gray-600 text-xs uppercase tracking-wider bg-gray-50">Contact Info</th>
          <th className="p-3 text-left border-b border-gray-200 font-bold text-gray-600 text-xs uppercase tracking-wider bg-gray-50">Location & GST</th>
          <th className="p-3 text-left border-b border-gray-200 font-bold text-gray-600 text-xs uppercase tracking-wider bg-gray-50">Type of Vendor</th>
          <th className="p-3 text-left border-b border-gray-200 font-bold text-gray-600 text-xs uppercase tracking-wider bg-gray-50 w-24">Status</th>
          <th className="p-3 text-left border-b border-gray-200 font-bold text-gray-600 text-xs uppercase tracking-wider bg-gray-50 w-32">Actions</th>
        </tr>
      </thead>
      <tbody>
        {filteredVendors.length > 0 ? (
          filteredVendors.map((vendor) => {
            const vendorTypes = Array.isArray(vendor.vendorType) ? vendor.vendorType : [vendor.vendorType];
            return (
              <tr key={vendor.id} className="transition-all hover:bg-cyan-50">
                <td className="p-3 border-b border-gray-200 text-gray-800 text-sm">
                  <input
                    type="checkbox"
                    checked={selectedVendors.includes(vendor.id)}
                    onChange={() => handleSelectVendor(vendor.id)}
                    className="w-4 h-4 cursor-pointer accent-teal-500"
                  />
                </td>
                <td className="p-3 border-b border-gray-200 text-gray-800 text-sm">
                  <div className="font-bold text-gray-700">#{vendor.id}</div>
                </td>
                <td className="p-3 border-b border-gray-200 text-gray-800 text-sm">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                      style={{ backgroundColor: vendor.avatarColor }}
                    >
                      {vendor.avatar}
                    </div>
                    <div>
                      <div className="font-bold text-gray-800">{vendor.companyName}</div>
                      <div className="text-xs text-gray-500">ID: {vendor.id}</div>
                    </div>
                  </div>
                </td>
                <td className="p-3 border-b border-gray-200 text-gray-800 text-sm">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1.5 text-gray-700">
                      <i className="fas fa-phone text-teal-500 text-xs w-3"></i>
                      <span className="text-xs">{vendor.contact}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-700">
                      <i className="fas fa-envelope text-teal-500 text-xs w-3"></i>
                      <span className="text-xs">{vendor.email}</span>
                    </div>
                  </div>
                </td>
                <td className="p-3 border-b border-gray-200 text-gray-800 text-sm">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1.5 text-gray-700">
                      <i className="fas fa-map-marker-alt text-teal-500 text-xs w-3"></i>
                      <span className="text-xs">{vendor.city}, {vendor.state}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-700">
                      <i className="fas fa-file-invoice text-teal-500 text-xs w-3"></i>
                      <span className="text-xs font-mono">{vendor.gst || 'N/A'}</span>
                    </div>
                  </div>
                </td>
                <td className="p-3 border-b border-gray-200 text-gray-800 text-sm">
                  <div className="flex flex-col gap-1.5">
                    {vendorTypes.map((type, idx) => (
                      <VendorTypeBadge key={idx} type={type} />
                    ))}
                  </div>
                </td>
                <td className="p-3 border-b border-gray-200 text-gray-800 text-sm">
                  <span className={`py-1.5 px-3 rounded text-xs font-bold uppercase tracking-wider inline-block ${
                    vendor.status === VENDOR_STATUS.ACTIVE ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                  }`}>
                    {vendor.status}
                  </span>
                </td>
                <td className="p-2.5 border-b border-gray-200 text-gray-800 text-sm text-left whitespace-nowrap">
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => handleViewVendor(vendor)}
                      className="w-8 h-8 border-none rounded-md cursor-pointer text-xs font-semibold transition-all inline-flex items-center justify-center bg-blue-500 text-white shadow-sm hover:-translate-y-px hover:shadow-md"
                      title="View Details"
                    >
                      <i className="fas fa-eye text-xs"></i>
                    </button>
                    <button
                      onClick={() => handleEditVendor(vendor)}
                      className="w-8 h-8 border-none rounded-md cursor-pointer text-xs font-semibold transition-all inline-flex items-center justify-center bg-amber-500 text-white shadow-sm hover:-translate-y-px hover:shadow-md"
                      title="Edit Vendor"
                    >
                      <i className="fas fa-edit text-xs"></i>
                    </button>
                    <button
                      onClick={() => handleDeleteVendor(vendor.id)}
                      className="w-8 h-8 border-none rounded-md cursor-pointer text-xs font-semibold transition-all inline-flex items-center justify-center bg-red-500 text-white shadow-sm hover:-translate-y-px hover:shadow-md"
                      title="Delete Vendor"
                    >
                      <i className="fas fa-trash text-xs"></i>
                    </button>
                  </div>
                </td>
              </tr>
            );
          })
        ) : (
          <tr>
            <td colSpan="8" className="text-center p-10 text-gray-500">
              <i className="fas fa-inbox text-4xl text-teal-500 mb-3 block"></i>
              No vendors found
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
</div>


      {/* Modals */}
      <VendorModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingVendor(null);
        }}
        vendor={editingVendor}
        onSave={handleSaveVendor}
      />

      <ViewVendorModal
        isOpen={showViewModal}
        onClose={() => {
          setShowViewModal(false);
          setViewingVendor(null);
        }}
        vendor={viewingVendor}
      />

      <ConfirmModal
        isOpen={showConfirmModal}
        title={deletingVendorId ? 'Delete Vendor' : `Delete ${selectedVendors.length} Vendors`}
        message={deletingVendorId ? 'Are you sure you want to delete this vendor? This action cannot be undone.' : `Are you sure you want to delete ${selectedVendors.length} vendors? This action cannot be undone.`}
        onConfirm={confirmDelete}
        onCancel={() => {
          setShowConfirmModal(false);
          setDeletingVendorId(null);
        }}
        type="warning"
        isDanger={true}
      />

      {/* Toast Notification */}
      <Toast show={toast.show} message={toast.message} type={toast.type} />
    </div>
  );
};

export default Vendor;
