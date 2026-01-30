// src/pages/Product.jsx
import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  INITIAL_CATEGORIES,
  INITIAL_VENDORS,
  INITIAL_UNITS,
  INITIAL_PRODUCTS,
  RACK_CONFIG,
  VENDOR_STATUS,
  calculateProductStats,
  getFilteredProducts,
  validateProductData,
  getCategoryName,
  getVendorName,
  getStockColor,
  getStockStatus,
  initializeRackCells,
  getStatsCardData
} from '../data/Productdata';

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
// CATEGORY DETAIL VIEW MODAL COMPONENT (NEW)
// ==========================================================================
const CategoryDetailModal = ({ isOpen, onClose, category, products }) => {
  if (!isOpen || !category) return null;

  const categoryProducts = products.filter(p => p.categoryId === category.id);
  const totalProducts = categoryProducts.length;
  const totalValue = categoryProducts.reduce((sum, p) => {
    const price = Object.values(p.vendorPrices || {})[0] || 0;
    return sum + (price * p.currentQuantity);
  }, 0);

  const lowStockCount = categoryProducts.filter(p => 
    p.status === 'low' || p.status === 'critical' || p.status === 'out'
  ).length;

  const normalStockCount = categoryProducts.filter(p => p.status === 'normal').length;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[9999] p-5">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-full max-w-4xl max-h-[90vh] animate-in fade-in duration-300">
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
          
          {/* Modal Header */}
          <div className="px-6 py-5 border-b-2 border-gray-200 flex justify-between items-center bg-gradient-to-r from-teal-50 to-cyan-50">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-teal-400 to-teal-700 flex items-center justify-center text-white text-2xl shadow-lg">
                <i className="fas fa-layer-group"></i>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{category.categoryName}</h2>
                <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                  <span className="bg-cyan-100 text-teal-600 px-2 py-0.5 rounded text-xs font-semibold">Category ID: #{category.id}</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-xs"><i className="fas fa-calendar text-[9px]"></i> Created: {category.created_At}</span>
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="bg-transparent border-none text-gray-500 text-2xl cursor-pointer p-2 rounded-md w-10 h-10 flex items-center justify-center hover:bg-white hover:text-gray-800 transition-all duration-200"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 overflow-y-auto flex-1">
            
            {/* Category Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-blue-500 flex items-center justify-center text-white">
                    <i className="fas fa-box text-xl"></i>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-800">{totalProducts}</div>
                    <div className="text-xs text-gray-600">Total Products</div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-green-500 flex items-center justify-center text-white">
                    <i className="fas fa-check-circle text-xl"></i>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-800">{normalStockCount}</div>
                    <div className="text-xs text-gray-600">Normal Stock</div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-4 border border-yellow-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-yellow-500 flex items-center justify-center text-white">
                    <i className="fas fa-exclamation-triangle text-xl"></i>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-800">{lowStockCount}</div>
                    <div className="text-xs text-gray-600">Low Stock</div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-purple-500 flex items-center justify-center text-white">
                    <i className="fas fa-rupee-sign text-xl"></i>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-gray-800">₹{totalValue.toLocaleString('en-IN')}</div>
                    <div className="text-xs text-gray-600">Total Value</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Products in Category */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-5 py-4 bg-gray-50 border-b border-gray-200">
                <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  <i className="fas fa-boxes text-teal-500"></i>
                  Products in this Category ({totalProducts})
                </h3>
              </div>
              
              {totalProducts > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="p-3 text-left text-xs font-bold text-gray-600 uppercase">Product</th>
                        <th className="p-3 text-left text-xs font-bold text-gray-600 uppercase">SKU</th>
                        <th className="p-3 text-left text-xs font-bold text-gray-600 uppercase">Stock</th>
                        <th className="p-3 text-left text-xs font-bold text-gray-600 uppercase">Status</th>
                        <th className="p-3 text-left text-xs font-bold text-gray-600 uppercase">Location</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categoryProducts.map(product => (
                        <tr key={product.id} className="border-b border-gray-200 hover:bg-cyan-50 transition-all">
                          <td className="p-3">
                            <div className="flex items-center gap-3">
                              <img
                                src={product.productImage}
                                alt={product.productName}
                                className="w-10 h-10 object-cover rounded-md border border-gray-200"
                                onError={(e) => e.target.src = 'https://via.placeholder.com/40?text=No+Image'}
                              />
                              <div>
                                <div className="font-semibold text-gray-800 text-sm">{product.productName}</div>
                                <div className="text-xs text-gray-500">{product.brand}</div>
                              </div>
                            </div>
                          </td>
                          <td className="p-3">
                            <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono">{product.productCode}</code>
                          </td>
                          <td className="p-3">
                            <span className={`font-bold ${getStockColor(product.status)}`}>
                              {product.currentQuantity} {product.unitOfMeasurement}
                            </span>
                          </td>
                          <td className="p-3">
                            <span className={`py-1 px-2 rounded text-xs font-bold uppercase ${
                              product.status === 'normal' ? 'bg-green-50 text-green-600' :
                              product.status === 'low' ? 'bg-yellow-50 text-yellow-600' :
                              product.status === 'critical' ? 'bg-orange-50 text-orange-600' :
                              'bg-red-50 text-red-600'
                            }`}>
                              {product.status}
                            </span>
                          </td>
                          <td className="p-3">
                            <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded text-xs font-bold">
                              <i className="fas fa-map-marker-alt text-[9px]"></i> {product.rackLocation}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-10 text-center">
                  <i className="fas fa-inbox text-4xl text-gray-400 mb-3 block"></i>
                  <h4 className="text-lg font-semibold text-gray-700 mb-2">No Products Found</h4>
                  <p className="text-sm text-gray-500">This category doesn't have any products yet.</p>
                </div>
              )}
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex gap-3 px-6 py-5 border-t-2 border-gray-200 bg-gray-50">
            <button
              onClick={onClose}
              className="flex-1 px-5 py-3 bg-gray-100 text-gray-700 border border-gray-300 rounded-md text-sm font-semibold cursor-pointer hover:bg-white transition-all duration-200 flex items-center justify-center gap-2"
            >
              <i className="fas fa-times"></i>
              Close
            </button>
            <button
              onClick={() => window.print()}
              className="flex-1 px-5 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-md text-sm font-semibold cursor-pointer hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
            >
              <i className="fas fa-print"></i>
              Print Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================================================
// PRODUCT DETAIL VIEW MODAL COMPONENT
// ==========================================================================
const ProductDetailModal = ({ isOpen, onClose, product, categories, vendors }) => {
  if (!isOpen || !product) return null;

  const categoryName = getCategoryName(categories, product.categoryId);
  const vendorDetails = product.vendorIds.map(vId => vendors.find(v => v.id === vId)).filter(Boolean);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[9999] p-5">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-full max-w-5xl max-h-[90vh] animate-in fade-in duration-300">
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
          
          {/* Modal Header */}
          <div className="px-6 py-5 border-b-2 border-gray-200 flex justify-between items-center bg-gradient-to-r from-teal-50 to-cyan-50">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-teal-500 shadow-md">
                <img
                  src={product.productImage}
                  alt={product.productName}
                  className="w-full h-full object-cover"
                  onError={(e) => e.target.src = 'https://via.placeholder.com/80?text=Product'}
                />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{product.productName}</h2>
                <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                  <span className="bg-cyan-100 text-teal-600 px-2 py-0.5 rounded text-xs font-semibold">{categoryName}</span>
                  <span className="text-gray-400">•</span>
                  <code className="bg-gray-100 px-2 py-0.5 rounded text-xs font-mono">{product.productCode}</code>
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="bg-transparent border-none text-gray-500 text-2xl cursor-pointer p-2 rounded-md w-10 h-10 flex items-center justify-center hover:bg-white hover:text-gray-800 transition-all duration-200"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 overflow-y-auto flex-1">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Column 1: Product Image & Basic Info */}
              <div className="lg:col-span-1">
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <img
                    src={product.productImage}
                    alt={product.productName}
                    className="w-full h-64 object-cover rounded-lg mb-4 border border-gray-200"
                    onError={(e) => e.target.src = 'https://via.placeholder.com/300?text=No+Image'}
                  />
                  
                  {/* Status Badge */}
                  <div className="text-center mb-4">
                    <span className={`py-2 px-4 rounded-lg text-sm font-bold uppercase inline-block ${
                      product.status === 'normal' ? 'bg-green-100 text-green-700' :
                      product.status === 'low' ? 'bg-yellow-100 text-yellow-700' :
                      product.status === 'critical' ? 'bg-orange-100 text-orange-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      <i className="fas fa-circle text-xs mr-1"></i>
                      {product.status}
                    </span>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white p-3 rounded-lg border border-gray-200 text-center">
                      <div className="text-2xl font-bold text-teal-600">{product.currentQuantity}</div>
                      <div className="text-xs text-gray-600 mt-1">Current Stock</div>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-gray-200 text-center">
                      <div className="text-2xl font-bold text-orange-600">{product.minQuantityThreshold}</div>
                      <div className="text-xs text-gray-600 mt-1">Min Threshold</div>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-gray-200 text-center">
                      <div className="text-2xl font-bold text-blue-600">{product.reorderQuantity}</div>
                      <div className="text-xs text-gray-600 mt-1">Reorder Qty</div>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-gray-200 text-center">
                      <div className="text-2xl font-bold text-purple-600">{product.unitOfMeasurement}</div>
                      <div className="text-xs text-gray-600 mt-1">Unit</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Column 2 & 3: Detailed Information */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Product Information */}
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <i className="fas fa-info-circle text-teal-500"></i>
                    Product Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-gray-600 block mb-1">Product Name</label>
                      <p className="text-sm text-gray-800 font-medium">{product.productName}</p>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-600 block mb-1">Brand</label>
                      <p className="text-sm text-gray-800 font-medium">{product.brand || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-600 block mb-1">SKU / Product Code</label>
                      <p className="text-sm"><code className="bg-gray-100 px-2 py-1 rounded font-mono text-xs">{product.productCode}</code></p>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-600 block mb-1">Category</label>
                      <p className="text-sm"><span className="bg-cyan-50 text-teal-600 px-2 py-1 rounded text-xs font-semibold border border-cyan-200">{categoryName}</span></p>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-600 block mb-1">Rack Location</label>
                      <p className="text-sm"><span className="bg-blue-50 text-blue-600 px-2 py-1 rounded text-xs font-bold"><i className="fas fa-map-marker-alt mr-1"></i>{product.rackLocation}</span></p>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-600 block mb-1">Last Updated</label>
                      <p className="text-sm text-gray-800"><i className="fas fa-clock text-gray-400 mr-1"></i>{product.updated_At}</p>
                    </div>
                  </div>

                  {product.description && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <label className="text-xs font-semibold text-gray-600 block mb-2">Description</label>
                      <p className="text-sm text-gray-700 leading-relaxed">{product.description}</p>
                    </div>
                  )}

                  {product.useCase && (
                    <div className="mt-4">
                      <label className="text-xs font-semibold text-gray-600 block mb-2">Use Case</label>
                      <p className="text-sm text-gray-700">{product.useCase}</p>
                    </div>
                  )}
                </div>

                {/* Vendor & Pricing Information */}
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <i className="fas fa-store text-teal-500"></i>
                    Vendor & Pricing
                  </h3>
                  <div className="space-y-3">
                    {vendorDetails.map(vendor => (
                      <div key={vendor.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <div>
                          <p className="font-semibold text-gray-800">{vendor.vendorName}</p>
                          <p className="text-xs text-gray-600">{vendor.contact} • {vendor.email}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-teal-600">₹{product.vendorPrices[vendor.id]?.toLocaleString('en-IN')}</p>
                          <p className="text-xs text-gray-600">Purchase Price</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Advanced Features */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Auto PO */}
                  <div className={`rounded-xl border p-4 ${product.autoPOEnabled ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <i className={`fas fa-robot text-lg ${product.autoPOEnabled ? 'text-blue-600' : 'text-gray-400'}`}></i>
                      <h4 className="font-bold text-sm text-gray-800">Auto PO</h4>
                    </div>
                    {product.autoPOEnabled ? (
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Enabled</p>
                        <p className="text-sm font-semibold text-blue-600">Qty: {product.autoPOQuantity}</p>
                        {product.autoPOVendor && (
                          <p className="text-xs text-gray-600 mt-1">Vendor: {vendors.find(v => v.id === product.autoPOVendor)?.vendorName}</p>
                        )}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-500">Disabled</p>
                    )}
                  </div>

                  {/* Scrap Management */}
                  <div className={`rounded-xl border p-4 ${product.isScrap ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <i className={`fas fa-recycle text-lg ${product.isScrap ? 'text-red-600' : 'text-gray-400'}`}></i>
                      <h4 className="font-bold text-sm text-gray-800">Scrap</h4>
                    </div>
                    {product.isScrap ? (
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Enabled</p>
                        <p className="text-sm font-semibold text-red-600">Qty: {product.scrapQuantity}</p>
                      </div>
                    ) : (
                      <p className="text-xs text-gray-500">Disabled</p>
                    )}
                  </div>

                  {/* Maintenance */}
                  <div className={`rounded-xl border p-4 ${product.maintenanceEnabled ? 'bg-purple-50 border-purple-200' : 'bg-gray-50 border-gray-200'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <i className={`fas fa-tools text-lg ${product.maintenanceEnabled ? 'text-purple-600' : 'text-gray-400'}`}></i>
                      <h4 className="font-bold text-sm text-gray-800">Maintenance</h4>
                    </div>
                    {product.maintenanceEnabled ? (
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Enabled</p>
                        <p className="text-sm font-semibold text-purple-600">Qty: {product.maintenanceQuantity}</p>
                      </div>
                    ) : (
                      <p className="text-xs text-gray-500">Disabled</p>
                    )}
                  </div>
                </div>

                {/* Expiry Date */}
                {product.expiryDate && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                    <h4 className="font-bold text-sm text-gray-800 mb-2 flex items-center gap-2">
                      <i className="fas fa-calendar-times text-yellow-600"></i>
                      Expiry Information
                    </h4>
                    <p className="text-sm text-gray-700">Expiry Date: <strong>{product.expiryDate}</strong></p>
                  </div>
                )}

              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex gap-3 px-6 py-5 border-t-2 border-gray-200 bg-gray-50">
            <button
              onClick={onClose}
              className="flex-1 px-5 py-3 bg-gray-100 text-gray-700 border border-gray-300 rounded-md text-sm font-semibold cursor-pointer hover:bg-white transition-all duration-200 flex items-center justify-center gap-2"
            >
              <i className="fas fa-times"></i>
              Close
            </button>
            <button
              onClick={() => window.print()}
              className="flex-1 px-5 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-md text-sm font-semibold cursor-pointer hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
            >
              <i className="fas fa-print"></i>
              Print Details
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
// PRODUCT IMAGE UPLOAD COMPONENT
// ==========================================================================
const ProductImageUpload = ({ imageUrl, onImageChange, onImageRemove }) => {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileChange(files[0]);
    }
  };

  const handleFileChange = (file) => {
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      onImageChange(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="w-full">
      <label className="block text-xs font-semibold text-gray-600 mb-2">
        <i className="fas fa-image text-teal-500 mr-1.5"></i>
        Product Image
      </label>
      {!imageUrl ? (
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
            isDragging ? 'border-teal-500 bg-cyan-50' : 'border-gray-300 hover:border-teal-400'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <i className="fas fa-cloud-upload-alt text-4xl text-gray-400 mb-3"></i>
          <h4 className="text-sm font-semibold text-gray-700 mb-1">Drag & Drop Image Here</h4>
          <p className="text-xs text-gray-500">or click to browse and select image file</p>
          <p className="text-xs text-gray-400 mt-1">Supported: JPG, PNG, GIF (Max: 5MB)</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFileChange(e.target.files?.[0])}
          />
        </div>
      ) : (
        <div className="relative inline-block">
          <img
            src={imageUrl}
            alt="Product Preview"
            className="w-48 h-36 object-cover rounded-lg border-2 border-gray-200"
          />
          <button
            type="button"
            onClick={onImageRemove}
            className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-all hover:scale-110"
          >
            <i className="fas fa-times text-xs"></i>
          </button>
        </div>
      )}
    </div>
  );
};

// ==========================================================================
// MULTI VENDOR SELECT COMPONENT
// ==========================================================================
const MultiVendorSelect = ({ vendors, selectedVendors, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredVendors = vendors.filter(v =>
    v.vendorName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleVendorToggle = (vendorId) => {
    if (selectedVendors.includes(vendorId)) {
      onChange(selectedVendors.filter(id => id !== vendorId));
    } else {
      onChange([...selectedVendors, vendorId]);
    }
  };

  const removeVendor = (vendorId) => {
    onChange(selectedVendors.filter(id => id !== vendorId));
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-xs font-semibold text-gray-600 mb-2">
        <i className="fas fa-store text-teal-500 mr-1.5"></i>
        Vendors (Multiple Selection) <span className="text-red-500">*</span>
      </label>

      <div
        className="bg-white border-2 border-gray-200 rounded-md p-3 cursor-pointer hover:border-teal-400 transition-all"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex flex-wrap gap-2">
          {selectedVendors.length === 0 ? (
            <span className="text-gray-500 text-sm">Select vendors...</span>
          ) : (
            selectedVendors.map(vId => {
              const vendor = vendors.find(v => v.id === vId);
              return vendor ? (
                <span
                  key={vId}
                  className="inline-flex items-center gap-1.5 bg-cyan-50 text-teal-600 px-2.5 py-1 rounded-full text-xs font-semibold border border-cyan-200"
                >
                  {vendor.vendorName}
                  <i
                    className="fas fa-times cursor-pointer hover:text-red-500"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeVendor(vId);
                    }}
                  ></i>
                </span>
              ) : null;
            })
          )}
        </div>
        <i className={`fas fa-chevron-${isOpen ? 'up' : 'down'} absolute right-3 top-11 text-gray-400`}></i>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-80 overflow-hidden">
          <div className="p-3 border-b border-gray-200">
            <div className="relative">
              <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
              <input
                type="text"
                className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-teal-400"
                placeholder="Search vendors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
          <div className="max-h-60 overflow-y-auto p-2">
            {filteredVendors.map(vendor => (
              <div
                key={vendor.id}
                className="flex items-center gap-3 p-2.5 hover:bg-cyan-50 rounded-md cursor-pointer transition-all"
                onClick={() => handleVendorToggle(vendor.id)}
              >
                <input
                  type="checkbox"
                  checked={selectedVendors.includes(vendor.id)}
                  onChange={() => {}}
                  className="w-4 h-4 cursor-pointer accent-teal-500"
                />
                <label className="flex-1 cursor-pointer text-sm text-gray-800">
                  {vendor.vendorName}
                </label>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================================================
// RACK LOCATION SELECTOR COMPONENT
// ==========================================================================
const RackLocationSelector = ({ selectedLocation, onLocationChange, rackConfig }) => {
  const [activeRack, setActiveRack] = useState('rack1');
  const [searchTerm, setSearchTerm] = useState('');

  const handleCellClick = (cellId) => {
    const rack = rackConfig[activeRack];
    const cell = rack.cells.find(c => c.id === cellId);
    
    if (cell && !cell.occupied) {
      onLocationChange(cellId);
    }
  };

  const renderRackCells = () => {
    const rack = rackConfig[activeRack];
    const filteredCells = searchTerm
      ? rack.cells.filter(c => c.id.toLowerCase().includes(searchTerm.toLowerCase()))
      : rack.cells;

    return (
      <div className={`grid gap-2`} style={{ gridTemplateColumns: `repeat(${rack.columns}, minmax(0, 1fr))` }}>
        {filteredCells.map(cell => (
          <button
            key={cell.id}
            type="button"
            onClick={() => handleCellClick(cell.id)}
            disabled={cell.occupied}
            className={`aspect-square flex items-center justify-center text-xs font-semibold rounded-md border-2 transition-all ${
              selectedLocation === cell.id
                ? 'bg-gradient-to-br from-teal-400 to-teal-700 text-white border-teal-500'
                : cell.occupied
                ? 'bg-red-50 text-red-500 border-red-300 cursor-not-allowed'
                : 'bg-white text-gray-700 border-gray-300 hover:border-teal-400 hover:bg-cyan-50 cursor-pointer'
            }`}
          >
            {cell.id}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full">
      <label className="block text-xs font-semibold text-gray-600 mb-2">
        <i className="fas fa-map-marker-alt text-teal-500 mr-1.5"></i>
        Rack Location <span className="text-red-500">*</span>
      </label>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
        {/* Rack Tabs */}
        <div className="flex flex-wrap gap-2 mb-4">
          {Object.keys(rackConfig).map(rackId => (
            <button
              key={rackId}
              type="button"
              onClick={() => setActiveRack(rackId)}
              className={`flex-1 min-w-[120px] px-4 py-2.5 rounded-md text-xs font-semibold transition-all ${
                activeRack === rackId
                  ? 'bg-gradient-to-br from-teal-400 to-teal-700 text-white border-2 border-teal-500'
                  : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-teal-400 hover:bg-cyan-50'
              }`}
            >
              <i className="fas fa-layer-group mr-2"></i>
              {rackConfig[rackId].name}
            </button>
          ))}
        </div>

        {/* Search Box */}
        <div className="relative mb-4">
          <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
          <input
            type="text"
            className="w-full pl-10 pr-3 py-2.5 border-2 border-gray-200 rounded-md text-sm focus:outline-none focus:border-teal-400 focus:ring-4 focus:ring-cyan-100"
            placeholder="Type rack location (e.g., A1, B5, C12)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Rack Grid */}
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">
            {rackConfig[activeRack].name}
          </h4>
          {renderRackCells()}
        </div>

        {/* Selected Location Display */}
        <div className="flex items-center gap-2 p-3 bg-white rounded-md border border-gray-200">
          <span className="text-xs font-semibold text-gray-600">Selected Location:</span>
          <span className="text-sm font-bold text-teal-600">
            {selectedLocation || 'None'}
          </span>
        </div>
      </div>
    </div>
  );
};

// ==========================================================================
// VENDOR PRICE INPUT COMPONENT
// ==========================================================================
const VendorPriceInputs = ({ vendors, selectedVendors, vendorPrices, onPriceChange }) => {
  if (selectedVendors.length === 0) return null;

  return (
    <div className="w-full">
      <label className="block text-xs font-semibold text-gray-600 mb-3">
        <i className="fas fa-tags text-teal-500 mr-1.5"></i>
        Vendor-wise Purchase Prices <span className="text-red-500">*</span>
      </label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {selectedVendors.map(vId => {
          const vendor = vendors.find(v => v.id === vId);
          if (!vendor) return null;

          return (
            <div key={vId} className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-700">
                <i className="fas fa-store text-teal-500 mr-1"></i>
                {vendor.vendorName}
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">₹</span>
                <input
                  type="number"
                  value={vendorPrices[vId] || ''}
                  onChange={(e) => onPriceChange(vId, e.target.value)}
                  placeholder="Enter price"
                  required
                  min="0"
                  step="0.01"
                  className="w-full pl-8 pr-3 py-2.5 border-2 border-gray-200 rounded-md text-sm focus:outline-none focus:border-teal-400 focus:ring-4 focus:ring-cyan-100 transition-all"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ==========================================================================
// PRODUCT MODAL COMPONENT
// ==========================================================================
const ProductModal = ({ isOpen, onClose, product, onSave, categories, vendors, units, rackConfig }) => {
  const [formData, setFormData] = useState({
    productName: '',
    categoryId: '',
    vendorIds: [],
    vendorPrices: {},
    productImage: '',
    description: '',
    useCase: '',
    currentQuantity: 0,
    minQuantityThreshold: 0,
    reorderQuantity: 0,
    scrapQuantity: 0,
    maintenanceQuantity: 0,
    unitOfMeasurement: '',
    productCode: '',
    status: 'normal',
    brand: '',
    rackLocation: '',
    autoPOEnabled: false,
    autoPOQuantity: 0,
    autoPOVendor: null,
    isScrap: false,
    maintenanceEnabled: false,
    expiryDate: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (product) {
      setFormData({
        ...product,
        vendorIds: product.vendorIds || [],
        vendorPrices: product.vendorPrices || {}
      });
    } else {
      setFormData({
        productName: '',
        categoryId: '',
        vendorIds: [],
        vendorPrices: {},
        productImage: '',
        description: '',
        useCase: '',
        currentQuantity: 0,
        minQuantityThreshold: 0,
        reorderQuantity: 0,
        scrapQuantity: 0,
        maintenanceQuantity: 0,
        unitOfMeasurement: '',
        productCode: '',
        status: 'normal',
        brand: '',
        rackLocation: '',
        autoPOEnabled: false,
        autoPOQuantity: 0,
        autoPOVendor: null,
        isScrap: false,
        maintenanceEnabled: false,
        expiryDate: ''
      });
    }
  }, [product, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    const validationErrors = {};
    
    if (!formData.productName.trim()) validationErrors.productName = 'Product name is required';
    if (!formData.categoryId) validationErrors.categoryId = 'Category is required';
    if (formData.vendorIds.length === 0) validationErrors.vendorIds = 'At least one vendor is required';
    if (!formData.unitOfMeasurement) validationErrors.unitOfMeasurement = 'Unit is required';
    if (!formData.rackLocation) validationErrors.rackLocation = 'Rack location is required';
    
    // Validate vendor prices
    formData.vendorIds.forEach(vId => {
      if (!formData.vendorPrices[vId] || parseFloat(formData.vendorPrices[vId]) <= 0) {
        validationErrors[`vendorPrice_${vId}`] = 'Valid price required';
      }
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[9999] p-5">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-full max-w-4xl max-h-[90vh] animate-in fade-in duration-300">
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
          {/* Modal Header */}
          <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center bg-gray-50">
            <h2 className="text-lg font-bold text-gray-800">
              <i className="fas fa-box mr-2 text-teal-500"></i>
              {product ? 'Edit Product' : 'Add New Product'}
            </h2>
            <button
              onClick={onClose}
              className="bg-transparent border-none text-gray-500 text-xl cursor-pointer p-1 rounded-md w-8 h-8 flex items-center justify-center hover:bg-white hover:text-gray-800 transition-all duration-200"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 overflow-y-auto flex-1">
            <form onSubmit={handleSubmit} id="productForm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Product Image Upload */}
                <div className="md:col-span-2">
                  <ProductImageUpload
                    imageUrl={formData.productImage}
                    onImageChange={(url) => setFormData({ ...formData, productImage: url })}
                    onImageRemove={() => setFormData({ ...formData, productImage: '' })}
                  />
                </div>

                {/* Product Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-600">
                    <i className="fas fa-box text-teal-500 mr-1.5"></i>
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.productName}
                    onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                    placeholder="Enter product name"
                    required
                    className="py-2.5 px-3 border-2 border-gray-200 rounded-md text-sm focus:outline-none focus:border-teal-400 focus:ring-4 focus:ring-cyan-100 transition-all"
                  />
                  {errors.productName && <small className="text-red-500 text-xs">{errors.productName}</small>}
                </div>

                {/* Category */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-600">
                    <i className="fas fa-tags text-teal-500 mr-1.5"></i>
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: parseInt(e.target.value) })}
                    required
                    className="py-2.5 px-3 border-2 border-gray-200 rounded-md text-sm focus:outline-none focus:border-teal-400 focus:ring-4 focus:ring-cyan-100 transition-all cursor-pointer"
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.categoryName}</option>
                    ))}
                  </select>
                  {errors.categoryId && <small className="text-red-500 text-xs">{errors.categoryId}</small>}
                </div>

                {/* SKU/Code */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-600">
                    <i className="fas fa-barcode text-teal-500 mr-1.5"></i>
                    SKU/Code
                  </label>
                  <input
                    type="text"
                    value={formData.productCode}
                    onChange={(e) => setFormData({ ...formData, productCode: e.target.value })}
                    placeholder="Enter product code"
                    className="py-2.5 px-3 border-2 border-gray-200 rounded-md text-sm focus:outline-none focus:border-teal-400 focus:ring-4 focus:ring-cyan-100 transition-all"
                  />
                </div>

                {/* Brand */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-600">
                    <i className="fas fa-tag text-teal-500 mr-1.5"></i>
                    Brand
                  </label>
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    placeholder="Enter brand name"
                    className="py-2.5 px-3 border-2 border-gray-200 rounded-md text-sm focus:outline-none focus:border-teal-400 focus:ring-4 focus:ring-cyan-100 transition-all"
                  />
                </div>

                {/* Current Stock */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-600">
                    <i className="fas fa-boxes text-teal-500 mr-1.5"></i>
                    Current Stock <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.currentQuantity}
                    onChange={(e) => setFormData({ ...formData, currentQuantity: parseFloat(e.target.value) || 0 })}
                    placeholder="Enter current stock"
                    min="0"
                    required
                    className="py-2.5 px-3 border-2 border-gray-200 rounded-md text-sm focus:outline-none focus:border-teal-400 focus:ring-4 focus:ring-cyan-100 transition-all"
                  />
                </div>

                {/* Minimum Quantity */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-600">
                    <i className="fas fa-exclamation-triangle text-teal-500 mr-1.5"></i>
                    Minimum Quantity <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.minQuantityThreshold}
                    onChange={(e) => setFormData({ ...formData, minQuantityThreshold: parseFloat(e.target.value) || 0 })}
                    placeholder="Enter minimum quantity"
                    min="0"
                    required
                    className="py-2.5 px-3 border-2 border-gray-200 rounded-md text-sm focus:outline-none focus:border-teal-400 focus:ring-4 focus:ring-cyan-100 transition-all"
                  />
                </div>

                {/* Reorder Quantity */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-600">
                    <i className="fas fa-redo text-teal-500 mr-1.5"></i>
                    Reorder Quantity <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.reorderQuantity}
                    onChange={(e) => setFormData({ ...formData, reorderQuantity: parseFloat(e.target.value) || 0 })}
                    placeholder="Enter reorder quantity"
                    min="0"
                    required
                    className="py-2.5 px-3 border-2 border-gray-200 rounded-md text-sm focus:outline-none focus:border-teal-400 focus:ring-4 focus:ring-cyan-100 transition-all"
                  />
                  <small className="text-gray-500 text-xs">
                    <i className="fas fa-info-circle"></i> Quantity to reorder when stock is low
                  </small>
                </div>

                {/* Scrap Quantity */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-600">
                    <i className="fas fa-recycle text-teal-500 mr-1.5"></i>
                    Scrap Quantity
                  </label>
                  <input
                    type="number"
                    value={formData.scrapQuantity}
                    onChange={(e) => setFormData({ ...formData, scrapQuantity: parseFloat(e.target.value) || 0 })}
                    placeholder="Enter scrap quantity"
                    min="0"
                    className="py-2.5 px-3 border-2 border-gray-200 rounded-md text-sm focus:outline-none focus:border-teal-400 focus:ring-4 focus:ring-cyan-100 transition-all"
                  />
                  <small className="text-gray-500 text-xs">
                    <i className="fas fa-info-circle"></i> Quantity marked as scrap
                  </small>
                </div>

                {/* Unit of Measurement */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-600">
                    <i className="fas fa-balance-scale text-teal-500 mr-1.5"></i>
                    Unit <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.unitOfMeasurement}
                    onChange={(e) => setFormData({ ...formData, unitOfMeasurement: e.target.value })}
                    required
                    className="py-2.5 px-3 border-2 border-gray-200 rounded-md text-sm focus:outline-none focus:border-teal-400 focus:ring-4 focus:ring-cyan-100 transition-all cursor-pointer"
                  >
                    <option value="">Select Unit</option>
                    {units.map(unit => (
                      <option key={unit} value={unit}>{unit}</option>
                    ))}
                  </select>
                  {errors.unitOfMeasurement && <small className="text-red-500 text-xs">{errors.unitOfMeasurement}</small>}
                </div>

                {/* Multi Vendor Selection */}
                <div className="md:col-span-2">
                  <MultiVendorSelect
                    vendors={vendors}
                    selectedVendors={formData.vendorIds}
                    onChange={(vendorIds) => setFormData({ ...formData, vendorIds })}
                  />
                  {errors.vendorIds && <small className="text-red-500 text-xs">{errors.vendorIds}</small>}
                </div>

                {/* Vendor-wise Prices */}
                {formData.vendorIds.length > 0 && (
                  <div className="md:col-span-2">
                    <VendorPriceInputs
                      vendors={vendors}
                      selectedVendors={formData.vendorIds}
                      vendorPrices={formData.vendorPrices}
                      onPriceChange={(vendorId, price) => 
                        setFormData({
                          ...formData,
                          vendorPrices: { ...formData.vendorPrices, [vendorId]: price }
                        })
                      }
                    />
                  </div>
                )}

                {/* Rack Location Selector */}
                <div className="md:col-span-2">
                  <RackLocationSelector
                    selectedLocation={formData.rackLocation}
                    onLocationChange={(location) => setFormData({ ...formData, rackLocation: location })}
                    rackConfig={rackConfig}
                  />
                  {errors.rackLocation && <small className="text-red-500 text-xs">{errors.rackLocation}</small>}
                </div>

                {/* Auto PO Configuration */}
                <div className="md:col-span-2">
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
                    <label className="flex items-center gap-3 cursor-pointer mb-4">
                      <input
                        type="checkbox"
                        checked={formData.autoPOEnabled}
                        onChange={(e) => setFormData({ ...formData, autoPOEnabled: e.target.checked })}
                        className="w-5 h-5 cursor-pointer accent-teal-500"
                      />
                      <div>
                        <span className="text-sm font-bold text-gray-800 block">
                          <i className="fas fa-robot text-teal-500 mr-1.5"></i>
                          Enable Auto Purchase Order (PO)
                        </span>
                        <span className="text-xs text-gray-600">
                          Automatically generate purchase orders when stock falls below minimum quantity
                        </span>
                      </div>
                    </label>

                    {formData.autoPOEnabled && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-semibold text-gray-600">Auto PO Quantity</label>
                          <input
                            type="number"
                            value={formData.autoPOQuantity}
                            onChange={(e) => setFormData({ ...formData, autoPOQuantity: parseFloat(e.target.value) || 0 })}
                            placeholder="Enter order quantity"
                            min="0"
                            className="py-2.5 px-3 border-2 border-gray-200 rounded-md text-sm focus:outline-none focus:border-teal-400 focus:ring-4 focus:ring-cyan-100 transition-all"
                          />
                          <small className="text-gray-500 text-xs">Quantity to order when triggered</small>
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-semibold text-gray-600">Preferred Vendor</label>
                          <select
                            value={formData.autoPOVendor || ''}
                            onChange={(e) => setFormData({ ...formData, autoPOVendor: parseInt(e.target.value) || null })}
                            className="py-2.5 px-3 border-2 border-gray-200 rounded-md text-sm focus:outline-none focus:border-teal-400 focus:ring-4 focus:ring-cyan-100 transition-all cursor-pointer"
                          >
                            <option value="">Select Vendor</option>
                            {vendors.filter(v => formData.vendorIds.includes(v.id)).map(vendor => (
                              <option key={vendor.id} value={vendor.id}>{vendor.vendorName}</option>
                            ))}
                          </select>
                          <small className="text-gray-500 text-xs">Default vendor for auto PO</small>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Scrap Management */}
                <div className="md:col-span-2">
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isScrap}
                        onChange={(e) => setFormData({ ...formData, isScrap: e.target.checked })}
                        className="w-5 h-5 cursor-pointer accent-teal-500"
                      />
                      <div>
                        <span className="text-sm font-bold text-gray-800 block">
                          <i className="fas fa-recycle text-teal-500 mr-1.5"></i>
                          Enable Scrap Management
                        </span>
                        <span className="text-xs text-gray-600">
                          Track and manage scrap/waste products for this item
                        </span>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Maintenance Management */}
                <div className="md:col-span-2">
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.maintenanceEnabled}
                        onChange={(e) => setFormData({ ...formData, maintenanceEnabled: e.target.checked })}
                        className="w-5 h-5 cursor-pointer accent-teal-500"
                      />
                      <div>
                        <span className="text-sm font-bold text-gray-800 block">
                          <i className="fas fa-tools text-teal-500 mr-1.5"></i>
                          Enable Maintenance Management
                        </span>
                        <span className="text-xs text-gray-600">
                          Track maintenance schedules and service records for this product
                        </span>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Product Use Case */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-600">
                    <i className="fas fa-lightbulb text-teal-500 mr-1.5"></i>
                    Product Use Case
                  </label>
                  <input
                    type="text"
                    value={formData.useCase}
                    onChange={(e) => setFormData({ ...formData, useCase: e.target.value })}
                    placeholder="Enter product use case"
                    className="py-2.5 px-3 border-2 border-gray-200 rounded-md text-sm focus:outline-none focus:border-teal-400 focus:ring-4 focus:ring-cyan-100 transition-all"
                  />
                </div>

                {/* Expiry Date */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-600">
                    <i className="fas fa-calendar text-teal-500 mr-1.5"></i>
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    className="py-2.5 px-3 border-2 border-gray-200 rounded-md text-sm focus:outline-none focus:border-teal-400 focus:ring-4 focus:ring-cyan-100 transition-all"
                  />
                </div>

                {/* Description */}
                <div className="md:col-span-2 flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-600">
                    <i className="fas fa-align-left text-teal-500 mr-1.5"></i>
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter product description"
                    rows="3"
                    className="py-2.5 px-3 border-2 border-gray-200 rounded-md text-sm focus:outline-none focus:border-teal-400 focus:ring-4 focus:ring-cyan-100 transition-all resize-y"
                  ></textarea>
                </div>
              </div>
            </form>
          </div>

          {/* Modal Footer */}
          <div className="flex gap-3 px-6 py-5 border-t-2 border-gray-200 bg-gray-50">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-5 py-3 bg-gray-50 text-gray-700 border-2 border-gray-200 rounded-md text-sm font-semibold cursor-pointer hover:bg-white hover:border-gray-300 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <i className="fas fa-times"></i>
              Cancel
            </button>
            <button
              type="submit"
              form="productForm"
              className="flex-1 px-5 py-3 bg-teal-500 text-white rounded-md text-sm font-semibold cursor-pointer hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
            >
              <i className="fas fa-save"></i>
              Save Product
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================================================
// CATEGORY MODAL COMPONENT
// ==========================================================================
const CategoryModal = ({ isOpen, onClose, category, onSave }) => {
  const [categoryName, setCategoryName] = useState('');

  useEffect(() => {
    if (category) {
      setCategoryName(category.categoryName);
    } else {
      setCategoryName('');
    }
  }, [category, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!categoryName.trim()) return;
    onSave({ categoryName: categoryName.trim() });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[9999]">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-[90%] max-w-md animate-in fade-in duration-300">
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center bg-gray-50">
            <h2 className="text-lg font-bold text-gray-800">
              <i className="fas fa-layer-group mr-2 text-teal-500"></i>
              {category ? 'Edit Category' : 'Add New Category'}
            </h2>
            <button
              onClick={onClose}
              className="bg-transparent border-none text-gray-500 text-xl cursor-pointer p-1 rounded-md w-8 h-8 flex items-center justify-center hover:bg-white hover:text-gray-800 transition-all duration-200"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>

          <div className="p-6">
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-600">
                  <i className="fas fa-tag text-teal-500 mr-1.5"></i>
                  Category Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  placeholder="Enter category name"
                  required
                  autoComplete="off"
                  className="py-2.5 px-3 border-2 border-gray-200 rounded-md text-sm focus:outline-none focus:border-teal-400 focus:ring-4 focus:ring-cyan-100 transition-all"
                />
              </div>
            </form>
          </div>

          <div className="flex gap-3 px-6 py-5 border-t-2 border-gray-200 bg-gray-50">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-5 py-3 bg-gray-50 text-gray-700 border-2 border-gray-200 rounded-md text-sm font-semibold cursor-pointer hover:bg-white hover:border-gray-300 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <i className="fas fa-times"></i>
              Cancel
            </button>
            <button
              type="submit"
              form="categoryForm"
              onClick={handleSubmit}
              className="flex-1 px-5 py-3 bg-teal-500 text-white rounded-md text-sm font-semibold cursor-pointer hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
            >
              <i className="fas fa-check-circle"></i>
              {category ? 'Update' : 'Add'} Category
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================================================
// MAIN PRODUCT COMPONENT
// ==========================================================================
const Product = () => {
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [vendors, setVendors] = useState(INITIAL_VENDORS);
  const [units] = useState(INITIAL_UNITS);
  const [rackConfig, setRackConfig] = useState(() => initializeRackCells(RACK_CONFIG));

  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: '', message: '', onConfirm: null });
  
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);

  const [viewingProduct, setViewingProduct] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  // NEW: Category View Modal State
  const [viewingCategory, setViewingCategory] = useState(null);
  const [isCategoryViewModalOpen, setIsCategoryViewModalOpen] = useState(false);

  // Filters
  const [filters, setFilters] = useState({
    search: '',
    categoryId: '',
    vendorId: '',
    stockStatus: '',
    dateFrom: '',
    dateTo: ''
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [currentCategoryPage, setCurrentCategoryPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // Show Toast
  const showToast = (message, type = 'info') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'info' }), 3000);
  };

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return getFilteredProducts(products, filters);
  }, [products, filters]);

  // Paginated Products
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  // Paginated Categories
  const paginatedCategories = useMemo(() => {
    const startIndex = (currentCategoryPage - 1) * ITEMS_PER_PAGE;
    return categories.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [categories, currentCategoryPage]);

  // Statistics
  const statsCardData = useMemo(() => 
    getStatsCardData(products, categories), 
    [products, categories]
  );

  // Add/Edit Product
  const handleSaveProduct = (productData) => {
    if (editingProduct) {
      setProducts(products.map(p => p.id === editingProduct.id ? { ...productData, id: p.id, updated_At: new Date().toISOString().split('T')[0] } : p));
      showToast('Product updated successfully', 'success');
    } else {
      const newProduct = {
        ...productData,
        id: Math.max(...products.map(p => p.id), 0) + 1,
        updated_At: new Date().toISOString().split('T')[0],
        status: getStockStatus(productData.currentQuantity, productData.minQuantityThreshold)
      };
      setProducts([...products, newProduct]);
      showToast('Product added successfully', 'success');
    }
    setIsProductModalOpen(false);
    setEditingProduct(null);
  };

  // Delete Product
  const handleDeleteProduct = (id) => {
    const product = products.find(p => p.id === id);
    if (!product) return;

    setConfirmModal({
      isOpen: true,
      title: 'Delete Product',
      message: `Are you sure you want to delete "${product.productName}"? This action cannot be undone.`,
      onConfirm: () => {
        setProducts(products.filter(p => p.id !== id));
        showToast('Product deleted successfully', 'success');
        setConfirmModal({ isOpen: false, title: '', message: '', onConfirm: null });
      },
      type: 'error',
      isDanger: true
    });
  };

  // Add/Edit Category
  const handleSaveCategory = (categoryData) => {
    if (editingCategory) {
      setCategories(categories.map(c => c.id === editingCategory.id ? { ...c, ...categoryData } : c));
      showToast('Category updated successfully', 'success');
    } else {
      const newCategory = {
        id: Math.max(...categories.map(c => c.id), 0) + 1,
        ...categoryData,
        created_At: new Date().toISOString().split('T')[0]
      };
      setCategories([...categories, newCategory]);
      showToast('Category added successfully', 'success');
    }
    setIsCategoryModalOpen(false);
    setEditingCategory(null);
  };

  // Delete Category
  const handleDeleteCategory = (id) => {
    const category = categories.find(c => c.id === id);
    const productsInCategory = products.filter(p => p.categoryId === id).length;

    if (productsInCategory > 0) {
      showToast(`Cannot delete category. ${productsInCategory} products are using this category.`, 'error');
      return;
    }

    setConfirmModal({
      isOpen: true,
      title: 'Delete Category',
      message: `Are you sure you want to delete "${category.categoryName}"?`,
      onConfirm: () => {
        setCategories(categories.filter(c => c.id !== id));
        showToast('Category deleted successfully', 'success');
        setConfirmModal({ isOpen: false, title: '', message: '', onConfirm: null });
      },
      type: 'warning',
      isDanger: true
    });
  };

  // Apply Filters
  const handleApplyFilters = () => {
    setCurrentPage(1);
    showToast('Filters applied', 'info');
  };

  // Clear Filters
  const handleClearFilters = () => {
    setFilters({
      search: '',
      categoryId: '',
      vendorId: '',
      stockStatus: '',
      dateFrom: '',
      dateTo: ''
    });
    setCurrentPage(1);
    showToast('Filters cleared', 'info');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-gray-50 to-cyan-50 p-5">
      {/* Toast Notification */}
      <Toast show={toast.show} message={toast.message} type={toast.type} />

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal({ isOpen: false, title: '', message: '', onConfirm: null })}
        type={confirmModal.type}
        isDanger={confirmModal.isDanger}
      />

      {/* Product Modal */}
      <ProductModal
        isOpen={isProductModalOpen}
        onClose={() => {
          setIsProductModalOpen(false);
          setEditingProduct(null);
        }}
        product={editingProduct}
        onSave={handleSaveProduct}
        categories={categories}
        vendors={vendors}
        units={units}
        rackConfig={rackConfig}
      />

      {/* Category Modal */}
      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => {
          setIsCategoryModalOpen(false);
          setEditingCategory(null);
        }}
        category={editingCategory}
        onSave={handleSaveCategory}
      />

      {/* Product Detail View Modal */}
      <ProductDetailModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setViewingProduct(null);
        }}
        product={viewingProduct}
        categories={categories}
        vendors={vendors}
      />

      {/* Category Detail View Modal (NEW) */}
      <CategoryDetailModal
        isOpen={isCategoryViewModalOpen}
        onClose={() => {
          setIsCategoryViewModalOpen(false);
          setViewingCategory(null);
        }}
        category={viewingCategory}
        products={products}
      />

      {/* Page Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex-1">
            <h1 className="text-2xl font-extrabold bg-gradient-to-r from-teal-400 to-teal-700 bg-clip-text text-transparent mb-1">
              Product Inventory Management System
            </h1>
            <p className="text-sm text-gray-600">
              Comprehensive product catalog with vendor mapping, auto PO, rack locations, and real-time monitoring
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setIsCategoryModalOpen(true)}
              className="px-4 py-2.5 bg-white text-teal-600 border-2 border-teal-600 rounded-md text-sm font-semibold hover:bg-teal-600 hover:text-white transition-all duration-200 flex items-center gap-2"
            >
              <i className="fas fa-plus-circle"></i>
              Add Category
            </button>
            <button
              onClick={() => setIsProductModalOpen(true)}
              className="px-4 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-md text-sm font-semibold hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 flex items-center gap-2"
            >
              <i className="fas fa-plus-circle"></i>
              Add Product
            </button>
            <button
              onClick={() => showToast('Bulk import feature coming soon', 'info')}
              className="px-4 py-2.5 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-md text-sm font-semibold hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 flex items-center gap-2"
            >
              <i className="fas fa-file-upload"></i>
              Bulk Import
            </button>
            <button
              onClick={() => showToast('Data refreshed', 'success')}
              className="px-4 py-2.5 bg-gradient-to-r from-teal-400 to-teal-700 text-white rounded-md text-sm font-semibold hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 flex items-center gap-2"
            >
              <i className="fas fa-sync-alt"></i>
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statsCardData.map((stat, index) => (
          <StatCard
            key={index}
            icon={stat.icon}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            changeType={stat.changeType}
          />
        ))}
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">
        <h3 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
          <i className="fas fa-filter text-teal-500"></i>
          Advanced Filters
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Search Products</label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              placeholder="Search by name, code, SKU, brand..."
              className="w-full py-2 px-3 border-2 border-gray-200 rounded-md text-sm focus:outline-none focus:border-teal-400 focus:ring-4 focus:ring-cyan-100 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Category</label>
            <select
              value={filters.categoryId}
              onChange={(e) => setFilters({ ...filters, categoryId: e.target.value })}
              className="w-full py-2 px-3 border-2 border-gray-200 rounded-md text-sm focus:outline-none focus:border-teal-400 focus:ring-4 focus:ring-cyan-100 transition-all cursor-pointer"
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.categoryName}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Vendor</label>
            <select
              value={filters.vendorId}
              onChange={(e) => setFilters({ ...filters, vendorId: e.target.value })}
              className="w-full py-2 px-3 border-2 border-gray-200 rounded-md text-sm focus:outline-none focus:border-teal-400 focus:ring-4 focus:ring-cyan-100 transition-all cursor-pointer"
            >
              <option value="">All Vendors</option>
              {vendors.map(v => (
                <option key={v.id} value={v.id}>{v.vendorName}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Stock Status</label>
            <select
              value={filters.stockStatus}
              onChange={(e) => setFilters({ ...filters, stockStatus: e.target.value })}
              className="w-full py-2 px-3 border-2 border-gray-200 rounded-md text-sm focus:outline-none focus:border-teal-400 focus:ring-4 focus:ring-cyan-100 transition-all cursor-pointer"
            >
              <option value="">All Stock Levels</option>
              <option value="normal">Normal Stock</option>
              <option value="low">Low Stock</option>
              <option value="critical">Critical Stock</option>
              <option value="out">Out of Stock</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">From Date</label>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
              className="w-full py-2 px-3 border-2 border-gray-200 rounded-md text-sm focus:outline-none focus:border-teal-400 focus:ring-4 focus:ring-cyan-100 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">To Date</label>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
              className="w-full py-2 px-3 border-2 border-gray-200 rounded-md text-sm focus:outline-none focus:border-teal-400 focus:ring-4 focus:ring-cyan-100 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">&nbsp;</label>
            <button
              onClick={handleApplyFilters}
              className="w-full px-4 py-2 bg-gradient-to-r from-teal-400 to-teal-700 text-white rounded-md text-sm font-semibold hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2"
            >
              <i className="fas fa-filter"></i>
              Apply
            </button>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">&nbsp;</label>
            <button
              onClick={handleClearFilters}
              className="w-full px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-md text-sm font-semibold hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2"
            >
              <i className="fas fa-times"></i>
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Product Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
        <div className="px-5 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2">
            <i className="fas fa-list text-teal-500"></i>
            Product Inventory List ({filteredProducts.length} items)
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1600px]">
            <thead className="bg-gray-50 border-b-2 border-gray-200">
              <tr>
                <th className="p-3 text-left text-xs font-bold text-gray-600 uppercase w-16">Image</th>
                <th className="p-3 text-left text-xs font-bold text-gray-600 uppercase min-w-[180px]">Product Details</th>
                <th className="p-3 text-left text-xs font-bold text-gray-600 uppercase min-w-[120px]">Category</th>
                <th className="p-3 text-left text-xs font-bold text-gray-600 uppercase min-w-[110px]">SKU Code</th>
                <th className="p-3 text-left text-xs font-bold text-gray-600 uppercase w-24">Current Stock</th>
                <th className="p-3 text-left text-xs font-bold text-gray-600 uppercase w-20">Min Qty</th>
                <th className="p-3 text-left text-xs font-bold text-gray-600 uppercase w-20">Unit</th>
                <th className="p-3 text-left text-xs font-bold text-gray-600 uppercase w-24">Base Price</th>
                <th className="p-3 text-left text-xs font-bold text-gray-600 uppercase min-w-[140px]">Vendor Details</th>
                <th className="p-3 text-left text-xs font-bold text-gray-600 uppercase min-w-[100px]">Storage Location</th>
                <th className="p-3 text-left text-xs font-bold text-gray-600 uppercase w-20">Auto PO</th>
                <th className="p-3 text-left text-xs font-bold text-gray-600 uppercase w-20">Scrap</th>
                <th className="p-3 text-left text-xs font-bold text-gray-600 uppercase w-24">Stock Status</th>
                <th className="p-3 text-left text-xs font-bold text-gray-600 uppercase w-24">Last Updated</th>
                <th className="p-3 text-left text-xs font-bold text-gray-600 uppercase w-32">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedProducts.length > 0 ? (
                paginatedProducts.map((product) => {
                  const categoryName = getCategoryName(categories, product.categoryId);
                  const vendorNames = product.vendorIds.map(vId => getVendorName(vendors, vId));
                  
                  const statusBadgeClass = product.status === 'normal'
                    ? 'bg-green-50 text-green-600'
                    : product.status === 'low'
                    ? 'bg-yellow-50 text-yellow-600'
                    : product.status === 'critical'
                    ? 'bg-orange-50 text-orange-600'
                    : 'bg-red-50 text-red-600';

                  return (
                    <tr key={product.id} className="border-b border-gray-200 hover:bg-cyan-50 transition-all">
                      <td className="p-3">
                        <img
                          src={product.productImage}
                          alt={product.productName}
                          className="w-12 h-12 object-cover rounded-md border border-gray-200"
                          onError={(e) => e.target.src = 'https://via.placeholder.com/50?text=No+Image'}
                        />
                      </td>
                      <td className="p-3">
                        <div className="font-semibold text-gray-800 text-sm">{product.productName}</div>
                        <div className="text-xs text-gray-500">
                          <i className="fas fa-tag text-[10px]"></i> {product.brand}
                        </div>
                      </td>
                      <td className="p-3">
                        <span className="inline-block bg-cyan-50 text-teal-600 px-2.5 py-1 rounded-md text-xs font-semibold border border-cyan-200">
                          {categoryName}
                        </span>
                      </td>
                      <td className="p-3">
                        <code className="text-xs bg-gray-50 px-2 py-1 rounded font-mono font-semibold text-gray-700">
                          {product.productCode}
                        </code>
                      </td>
                      <td className="p-3">
                        <strong className={`text-base font-bold ${getStockColor(product.status)}`}>
                          {product.currentQuantity}
                        </strong>
                      </td>
                      <td className="p-3 text-center">
                        <small className="text-gray-600 font-semibold text-xs">{product.minQuantityThreshold}</small>
                      </td>
                      <td className="p-3 text-center">
                        <small className="text-gray-700 font-semibold text-xs">{product.unitOfMeasurement}</small>
                      </td>
                      <td className="p-3">
                        <span className="text-blue-600 font-semibold text-xs">
                          <i className="fas fa-rupee-sign text-[9px]"></i>
                          {Object.values(product.vendorPrices || {})[0]?.toLocaleString('en-IN') || 'N/A'}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex flex-col gap-1">
                          {vendorNames.map((name, idx) => (
                            <small key={idx} className="text-xs bg-cyan-50 text-gray-700 px-2 py-0.5 rounded inline-block w-fit">
                              <i className="fas fa-store text-[9px]"></i> {name}
                            </small>
                          ))}
                        </div>
                      </td>
                      <td className="p-3 text-center">
                        <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded-md text-xs font-bold">
                          <i className="fas fa-map-marker-alt text-[10px]"></i> {product.rackLocation || 'N/A'}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        {product.autoPOEnabled ? (
                          <div>
                            <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-600 px-2 py-1 rounded-full text-[10px] font-bold border border-blue-200">
                              <i className="fas fa-robot"></i> YES
                            </span>
                            <br />
                            <small className="text-gray-500 text-[9px]">Qty: {product.autoPOQuantity}</small>
                          </div>
                        ) : (
                          <span className="text-gray-500 text-xs font-semibold">NO</span>
                        )}
                      </td>
                      <td className="p-3 text-center">
                        {product.isScrap ? (
                          <span className="inline-flex items-center gap-1 bg-red-50 text-red-600 px-2 py-1 rounded-full text-[10px] font-bold border border-red-200">
                            <i className="fas fa-trash"></i> YES
                          </span>
                        ) : (
                          <span className="text-gray-500 text-xs font-semibold">NO</span>
                        )}
                      </td>
                      <td className="p-3 text-center">
                        <span className={`py-1.5 px-2.5 rounded text-[10px] font-bold uppercase tracking-wider inline-block ${statusBadgeClass}`}>
                          {product.status}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <small className="text-gray-600 text-xs">
                          <i className="fas fa-clock text-[9px]"></i> {product.updated_At}
                        </small>
                      </td>
                      <td className="p-3">
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => {
                              setViewingProduct(product);
                              setIsViewModalOpen(true);
                            }}
                            className="w-8 h-8 bg-blue-500 text-white rounded-md text-xs hover:-translate-y-px hover:shadow-md transition-all flex items-center justify-center"
                            title="View Product Details"
                          >
                            <i className="fas fa-eye text-xs"></i>
                          </button>
                          <button
                            onClick={() => {
                              setEditingProduct(product);
                              setIsProductModalOpen(true);
                            }}
                            className="w-8 h-8 bg-amber-500 text-white rounded-md text-xs hover:-translate-y-px hover:shadow-md transition-all flex items-center justify-center"
                            title="Edit Product"
                          >
                            <i className="fas fa-edit text-xs"></i>
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="w-8 h-8 bg-red-500 text-white rounded-md text-xs hover:-translate-y-px hover:shadow-md transition-all flex items-center justify-center"
                            title="Delete Product"
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
                  <td colSpan="15" className="text-center p-10 text-gray-500">
                    <i className="fas fa-inbox text-4xl text-teal-500 mb-3 block"></i>
                    <h3 className="text-lg font-semibold mb-2">No Products Found</h3>
                    <p className="text-sm">No products match your current filters. Try adjusting your search criteria.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredProducts.length > ITEMS_PER_PAGE && (
          <div className="px-5 py-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredProducts.length)} of {filteredProducts.length} products
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 bg-white border-2 border-gray-200 text-gray-700 rounded-md text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:border-teal-400 transition-all"
              >
                <i className="fas fa-chevron-left"></i>
              </button>
              {[...Array(Math.ceil(filteredProducts.length / ITEMS_PER_PAGE))].map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentPage(idx + 1)}
                  className={`px-3 py-1.5 rounded-md text-sm font-semibold transition-all ${
                    currentPage === idx + 1
                      ? 'bg-teal-500 text-white'
                      : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-teal-400'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(Math.min(Math.ceil(filteredProducts.length / ITEMS_PER_PAGE), currentPage + 1))}
                disabled={currentPage === Math.ceil(filteredProducts.length / ITEMS_PER_PAGE)}
                className="px-3 py-1.5 bg-white border-2 border-gray-200 text-gray-700 rounded-md text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:border-teal-400 transition-all"
              >
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Category Management Table - UPDATED WITH VIEW BUTTON */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2">
            <i className="fas fa-layer-group text-teal-500"></i>
            Category Management
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b-2 border-gray-200">
              <tr>
                <th className="p-3 text-left text-xs font-bold text-gray-600 uppercase w-20">ID</th>
                <th className="p-3 text-left text-xs font-bold text-gray-600 uppercase min-w-[200px]">Category Name</th>
                <th className="p-3 text-left text-xs font-bold text-gray-600 uppercase min-w-[150px]">Products Count</th>
                <th className="p-3 text-left text-xs font-bold text-gray-600 uppercase min-w-[120px]">Created Date</th>
                <th className="p-3 text-left text-xs font-bold text-gray-600 uppercase w-40">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedCategories.map((category) => {
                const productsCount = products.filter(p => p.categoryId === category.id).length;
                return (
                  <tr key={category.id} className="border-b border-gray-200 hover:bg-cyan-50 transition-all">
                    <td className="p-3">
                      <div className="font-bold text-gray-700">#{category.id}</div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-400 to-teal-700 flex items-center justify-center text-white">
                          <i className="fas fa-layer-group"></i>
                        </div>
                        <div className="font-semibold text-gray-800 text-sm">{category.categoryName}</div>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="inline-block bg-teal-50 text-teal-600 px-3 py-1 rounded-md text-xs font-semibold border border-teal-200">
                        <i className="fas fa-boxes text-[10px] mr-1"></i>
                        {productsCount} Product{productsCount !== 1 ? 's' : ''}
                      </span>
                    </td>
                    <td className="p-3">
                      <small className="text-gray-600 text-xs">
                        <i className="fas fa-calendar text-[9px]"></i> {category.created_At}
                      </small>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => {
                            setViewingCategory(category);
                            setIsCategoryViewModalOpen(true);
                          }}
                          className="w-8 h-8 bg-blue-500 text-white rounded-md text-xs hover:-translate-y-px hover:shadow-md transition-all flex items-center justify-center"
                          title="View Category Details"
                        >
                          <i className="fas fa-eye text-xs"></i>
                        </button>
                        <button
                          onClick={() => {
                            setEditingCategory(category);
                            setIsCategoryModalOpen(true);
                          }}
                          className="w-8 h-8 bg-amber-500 text-white rounded-md text-xs hover:-translate-y-px hover:shadow-md transition-all flex items-center justify-center"
                          title="Edit Category"
                        >
                          <i className="fas fa-edit text-xs"></i>
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(category.id)}
                          className="w-8 h-8 bg-red-500 text-white rounded-md text-xs hover:-translate-y-px hover:shadow-md transition-all flex items-center justify-center"
                          title="Delete Category"
                        >
                          <i className="fas fa-trash text-xs"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Category Pagination */}
        {categories.length > ITEMS_PER_PAGE && (
          <div className="px-5 py-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Showing {((currentCategoryPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentCategoryPage * ITEMS_PER_PAGE, categories.length)} of {categories.length} categories
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentCategoryPage(Math.max(1, currentCategoryPage - 1))}
                disabled={currentCategoryPage === 1}
                className="px-3 py-1.5 bg-white border-2 border-gray-200 text-gray-700 rounded-md text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:border-teal-400 transition-all"
              >
                <i className="fas fa-chevron-left"></i>
              </button>
              {[...Array(Math.ceil(categories.length / ITEMS_PER_PAGE))].map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentCategoryPage(idx + 1)}
                  className={`px-3 py-1.5 rounded-md text-sm font-semibold transition-all ${
                    currentCategoryPage === idx + 1
                      ? 'bg-teal-500 text-white'
                      : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-teal-400'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentCategoryPage(Math.min(Math.ceil(categories.length / ITEMS_PER_PAGE), currentCategoryPage + 1))}
                disabled={currentCategoryPage === Math.ceil(categories.length / ITEMS_PER_PAGE)}
                className="px-3 py-1.5 bg-white border-2 border-gray-200 text-gray-700 rounded-md text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:border-teal-400 transition-all"
              >
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Product;
