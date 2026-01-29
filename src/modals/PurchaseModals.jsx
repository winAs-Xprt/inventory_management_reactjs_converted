// src/modals/PurchaseModals.jsx
import React from 'react';
import PurchaseData from '../data/PurchaseData';

const PurchaseModals = ({
  showCreatePOModal, setShowCreatePOModal,
  showEditPOModal, setShowEditPOModal,
  showViewPOModal, setShowViewPOModal,
  showGRNModal, setShowGRNModal,
  showRescheduleModal, setShowRescheduleModal,
  showReturnModal, setShowReturnModal,
  poForm, setPOForm,
  productRows, setProductRows,
  grnForm, setGrnForm,
  rescheduleForm, setRescheduleForm,
  returnForm, setReturnForm,
  tempRating, setTempRating,
  productSearchTerms, setProductSearchTerms,
  showProductSuggestions, setShowProductSuggestions,
  vendors,
  products,
  purchaseOrders,
  handleCreatePO,
  handleUpdatePO,
  handleAddProductRow,
  handleRemoveProductRow,
  handleProductSearch,
  handleSelectProduct,
  getFilteredProducts,
  calculateOrderTotal,
  handleGRNProductChange,
  handleCreateGRN,
  handleReschedulePO,
  handleReturnProductChange,
  handleCreateReturn,
  formatDate,
  formatCurrency,
  getStatusBadge,
  getCurrentViewingPO,
  currentViewingPOId,
  editingPOId,
  poRatings = {},
  rescheduleHistory = {},
}) => {

  return (
    <>
      {/* ==================== MODAL 1: CREATE PURCHASE ORDER ==================== */}
      {showCreatePOModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={() => setShowCreatePOModal(false)}
          />

          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden z-10 mx-4">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-cyan-50 to-teal-50">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <i className="fas fa-file-invoice text-teal-600"></i>
                Create Purchase Order
              </h2>
              <button 
                onClick={() => setShowCreatePOModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>

            {/* Body */}
            <div className="overflow-y-auto max-h-[calc(90vh-140px)] px-6 py-4">
              <form onSubmit={(e) => { e.preventDefault(); handleCreatePO(); }}>

                {/* Section 1: Purchase Order Details */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-teal-200">
                    <i className="fas fa-file-invoice text-teal-600"></i>
                    <h3 className="text-lg font-semibold text-gray-800">Purchase Order Details</h3>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Expected Delivery Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                        value={poForm.expectedDeliveryDate}
                        onChange={(e) => setPOForm({...poForm, expectedDeliveryDate: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Section 2: Products & Vendors */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4 pb-2 border-b-2 border-teal-200">
                    <div className="flex items-center gap-2">
                      <i className="fas fa-boxes text-teal-600"></i>
                      <h3 className="text-lg font-semibold text-gray-800">Products & Vendors</h3>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddProductRow}
                      className="px-4 py-2 bg-gradient-to-r from-teal-400 to-teal-700 text-white rounded-lg hover:from-teal-500 hover:to-teal-800 transition-colors flex items-center gap-2 text-sm shadow-md"
                    >
                      <i className="fas fa-plus"></i> Add Product
                    </button>
                  </div>

                  <div className="bg-cyan-50 border border-teal-200 rounded-lg p-3 mb-4 flex items-start gap-2">
                    <i className="fas fa-info-circle text-teal-600 mt-0.5"></i>
                    <span className="text-sm text-teal-800">
                      Search and select products, then choose vendors who can supply them (multi-select enabled)
                    </span>
                  </div>

                  <div className="space-y-6">
                    {productRows.map((row, rowIndex) => (
                      <div key={row.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200 relative">
                        {productRows.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveProductRow(row.id)}
                            className="absolute top-2 right-2 w-8 h-8 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors flex items-center justify-center"
                            title="Remove Product"
                          >
                            <i className="fas fa-trash text-sm"></i>
                          </button>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          {/* Product Search */}
                          <div className="relative">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Product <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                              placeholder="Type product ID or name..."
                              value={productSearchTerms[row.id] || ''}
                              onChange={(e) => handleProductSearch(row.id, e.target.value)}
                              onFocus={() => setShowProductSuggestions({...showProductSuggestions, [row.id]: true})}
                              onBlur={() => setTimeout(() => setShowProductSuggestions({...showProductSuggestions, [row.id]: false}), 200)}
                              autoComplete="off"
                              required
                            />

                            {/* Product Suggestions Dropdown */}
                            {showProductSuggestions[row.id] && productSearchTerms[row.id]?.length > 0 && (
                              <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                {getFilteredProducts(row.id).length === 0 ? (
                                  <div className="px-4 py-3 text-sm text-gray-500 text-center">No matching products</div>
                                ) : (
                                  getFilteredProducts(row.id).map((product) => (
                                    <div
                                      key={product.id}
                                      className="px-4 py-3 hover:bg-cyan-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                                      onMouseDown={() => handleSelectProduct(row.id, product)}
                                    >
                                      <div className="font-medium text-gray-800">{product.id} - {product.productName}</div>
                                      <div className="text-sm text-gray-500">₹{product.unitPrice.toLocaleString()} • {product.category}</div>
                                    </div>
                                  ))
                                )}
                              </div>
                            )}
                          </div>

                          {/* Unit Price */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Unit Price <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="number"
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                              value={row.unitPrice}
                              readOnly
                            />
                          </div>

                          {/* Quantity */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Quantity <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="number"
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                              min="1"
                              value={row.quantity || ''}
                              onChange={(e) => {
                                const newRows = [...productRows];
                                newRows[rowIndex].quantity = parseInt(e.target.value) || 0;
                                setProductRows(newRows);
                              }}
                              required
                            />
                          </div>
                        </div>

                        {/* Vendor Selection */}
                        {row.productId && (
                          <div className="mt-4">
                            <div className="flex items-center gap-2 mb-3">
                              <i className="fas fa-store text-teal-600"></i>
                              <label className="text-sm font-medium text-gray-700">
                                Select Vendors for this Product (Multi-Select)
                              </label>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {(() => {
                                const availableVendors = PurchaseData.getVendorsForProduct(row.productId);

                                if (availableVendors.length === 0) {
                                  return <span className="text-sm text-gray-500 italic">No vendors available for this product</span>;
                                }

                                return availableVendors.map(vendor => {
                                  const isSelected = row.selectedVendors?.includes(vendor.id);
                                  return (
                                    <button
                                      key={vendor.id}
                                      type="button"
                                      onClick={() => {
                                        const newRows = [...productRows];
                                        const currentRow = newRows[rowIndex];
                                        if (!currentRow.selectedVendors) currentRow.selectedVendors = [];

                                        if (isSelected) {
                                          currentRow.selectedVendors = currentRow.selectedVendors.filter(id => id !== vendor.id);
                                        } else {
                                          currentRow.selectedVendors.push(vendor.id);
                                        }
                                        setProductRows(newRows);
                                      }}
                                      className={`px-4 py-2 rounded-lg border-2 transition-all flex items-center gap-2 text-sm font-medium shadow-sm ${
                                        isSelected 
                                          ? 'bg-gradient-to-r from-teal-500 to-cyan-600 text-white border-teal-600 shadow-md' 
                                          : 'bg-white text-gray-700 border-gray-300 hover:border-teal-400 hover:bg-cyan-50'
                                      }`}
                                    >
                                      <i className={`fas ${isSelected ? 'fa-check-circle' : 'fa-store'}`}></i>
                                      <span>{vendor.vendorName}</span>
                                    </button>
                                  );
                                });
                              })()}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section 3: Order Summary */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-teal-200">
                    <i className="fas fa-list-alt text-teal-600"></i>
                    <h3 className="text-lg font-semibold text-gray-800">Order Summary Preview</h3>
                  </div>
                  <div className="bg-gradient-to-br from-cyan-50 to-teal-50 border-2 border-dashed border-teal-300 rounded-lg p-4">
                    {calculateOrderTotal() === 0 ? (
                      <div className="text-center py-8">
                        <i className="fas fa-cart-plus text-5xl text-gray-300 mb-3"></i>
                        <p className="text-gray-500">Add products to see order summary</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {productRows.filter(r => r.productId).map((row, idx) => {
                          const product = products.find(p => p.id === row.productId);
                          const itemTotal = row.quantity * row.unitPrice;
                          const selectedVendorNames = row.selectedVendors?.map(vId => {
                            const vendor = vendors.find(v => v.id === vId);
                            return vendor?.vendorName;
                          }).filter(Boolean);

                          return (
                            <div key={idx} className="bg-white rounded-lg p-4 shadow-sm border border-teal-200">
                              <div className="flex justify-between items-start mb-2">
                                <span className="font-semibold text-gray-800">{product?.productName}</span>
                                <span className="text-sm text-gray-600">
                                  {row.quantity} units × ₹{row.unitPrice.toLocaleString()} = 
                                  <span className="font-bold text-teal-600 ml-1">₹{itemTotal.toLocaleString()}</span>
                                </span>
                              </div>
                              {selectedVendorNames && selectedVendorNames.length > 0 && (
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="text-xs text-gray-600">Vendors:</span>
                                  {selectedVendorNames.map((name, i) => (
                                    <span key={i} className="px-2 py-1 bg-teal-100 text-teal-700 rounded text-xs font-medium">
                                      {name}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                        <div className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white rounded-lg p-4 flex justify-between items-center shadow-md">
                          <span className="text-lg font-semibold">Total Order Amount</span>
                          <span className="text-2xl font-bold">₹{calculateOrderTotal().toLocaleString()}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Section 4: Remarks */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-teal-200">
                    <i className="fas fa-sticky-note text-teal-600"></i>
                    <h3 className="text-lg font-semibold text-gray-800">Remarks</h3>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Purchase Remarks <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all resize-none"
                      value={poForm.remarks}
                      onChange={(e) => setPOForm({...poForm, remarks: e.target.value})}
                      placeholder="Enter purchase remarks, special instructions..."
                      rows="3"
                      required
                    />
                  </div>
                </div>
              </form>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end px-6 py-4 border-t border-gray-200 bg-gray-50 gap-3">
              <button
                type="button"
                onClick={() => setShowCreatePOModal(false)}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-2"
              >
                <i className="fas fa-times"></i> Cancel
              </button>
              <button
                type="button"
                onClick={handleCreatePO}
                className="px-6 py-2 bg-gradient-to-r from-teal-400 to-teal-700 text-white rounded-lg hover:from-teal-500 hover:to-teal-800 transition-all flex items-center gap-2 shadow-md"
              >
                <i className="fas fa-check"></i> Create Purchase Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== MODAL 2: EDIT PURCHASE ORDER (WITH RATING) ==================== */}
      {showEditPOModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={() => setShowEditPOModal(false)}
          />

          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden z-10 mx-4">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-cyan-50 to-teal-50">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <i className="fas fa-edit text-teal-600"></i>
                Edit Purchase Order
              </h2>
              <button 
                onClick={() => setShowEditPOModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>

            {/* Body */}
            <div className="overflow-y-auto max-h-[calc(90vh-140px)] px-6 py-4">
              <form onSubmit={(e) => { e.preventDefault(); handleUpdatePO(); }}>

                {/* Same sections as Create Modal */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-teal-200">
                    <i className="fas fa-file-invoice text-teal-600"></i>
                    <h3 className="text-lg font-semibold text-gray-800">Purchase Order Details</h3>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Expected Delivery Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                        value={poForm.expectedDeliveryDate}
                        onChange={(e) => setPOForm({...poForm, expectedDeliveryDate: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Products & Vendors */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4 pb-2 border-b-2 border-teal-200">
                    <div className="flex items-center gap-2">
                      <i className="fas fa-boxes text-teal-600"></i>
                      <h3 className="text-lg font-semibold text-gray-800">Products & Vendors</h3>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddProductRow}
                      className="px-4 py-2 bg-gradient-to-r from-teal-400 to-teal-700 text-white rounded-lg hover:from-teal-500 hover:to-teal-800 transition-colors flex items-center gap-2 text-sm shadow-md"
                    >
                      <i className="fas fa-plus"></i> Add Product
                    </button>
                  </div>

                  <div className="space-y-6">
                    {productRows.map((row, rowIndex) => (
                      <div key={row.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200 relative">
                        {productRows.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveProductRow(row.id)}
                            className="absolute top-2 right-2 w-8 h-8 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors flex items-center justify-center"
                          >
                            <i className="fas fa-trash text-sm"></i>
                          </button>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div className="relative">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Product <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                              placeholder="Type product ID or name..."
                              value={productSearchTerms[row.id] || ''}
                              onChange={(e) => handleProductSearch(row.id, e.target.value)}
                              onFocus={() => setShowProductSuggestions({...showProductSuggestions, [row.id]: true})}
                              onBlur={() => setTimeout(() => setShowProductSuggestions({...showProductSuggestions, [row.id]: false}), 200)}
                              autoComplete="off"
                              required
                            />

                            {showProductSuggestions[row.id] && productSearchTerms[row.id]?.length > 0 && (
                              <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                {getFilteredProducts(row.id).length === 0 ? (
                                  <div className="px-4 py-3 text-sm text-gray-500 text-center">No matching products</div>
                                ) : (
                                  getFilteredProducts(row.id).map((product) => (
                                    <div
                                      key={product.id}
                                      className="px-4 py-3 hover:bg-cyan-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                                      onMouseDown={() => handleSelectProduct(row.id, product)}
                                    >
                                      <div className="font-medium text-gray-800">{product.id} - {product.productName}</div>
                                      <div className="text-sm text-gray-500">₹{product.unitPrice.toLocaleString()} • {product.category}</div>
                                    </div>
                                  ))
                                )}
                              </div>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Unit Price <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="number"
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                              value={row.unitPrice}
                              readOnly
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Quantity <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="number"
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                              min="1"
                              value={row.quantity || ''}
                              onChange={(e) => {
                                const newRows = [...productRows];
                                newRows[rowIndex].quantity = parseInt(e.target.value) || 0;
                                setProductRows(newRows);
                              }}
                              required
                            />
                          </div>
                        </div>

                        {/* Vendor Selection */}
                        {row.productId && (
                          <div className="mt-4">
                            <div className="flex items-center gap-2 mb-3">
                              <i className="fas fa-store text-teal-600"></i>
                              <label className="text-sm font-medium text-gray-700">
                                Select Vendors for this Product
                              </label>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {(() => {
                                const availableVendors = PurchaseData.getVendorsForProduct(row.productId);

                                if (availableVendors.length === 0) {
                                  return <span className="text-sm text-gray-500 italic">No vendors available</span>;
                                }

                                return availableVendors.map(vendor => {
                                  const isSelected = row.selectedVendors?.includes(vendor.id);
                                  return (
                                    <button
                                      key={vendor.id}
                                      type="button"
                                      onClick={() => {
                                        const newRows = [...productRows];
                                        const currentRow = newRows[rowIndex];
                                        if (!currentRow.selectedVendors) currentRow.selectedVendors = [];

                                        if (isSelected) {
                                          currentRow.selectedVendors = currentRow.selectedVendors.filter(id => id !== vendor.id);
                                        } else {
                                          currentRow.selectedVendors.push(vendor.id);
                                        }
                                        setProductRows(newRows);
                                      }}
                                      className={`px-4 py-2 rounded-lg border-2 transition-all flex items-center gap-2 text-sm font-medium shadow-sm ${
                                        isSelected 
                                          ? 'bg-gradient-to-r from-teal-500 to-cyan-600 text-white border-teal-600 shadow-md' 
                                          : 'bg-white text-gray-700 border-gray-300 hover:border-teal-400 hover:bg-cyan-50'
                                      }`}
                                    >
                                      <i className={`fas ${isSelected ? 'fa-check-circle' : 'fa-store'}`}></i>
                                      <span>{vendor.vendorName}</span>
                                    </button>
                                  );
                                });
                              })()}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Remarks */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-teal-200">
                    <i className="fas fa-sticky-note text-teal-600"></i>
                    <h3 className="text-lg font-semibold text-gray-800">Remarks</h3>
                  </div>
                  <textarea
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all resize-none"
                    value={poForm.remarks}
                    onChange={(e) => setPOForm({...poForm, remarks: e.target.value})}
                    placeholder="Enter purchase remarks..."
                    rows="3"
                    required
                  />
                </div>

                {/* RATING SECTION - EDITABLE */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-teal-200">
                    <i className="fas fa-star text-teal-600"></i>
                    <h3 className="text-lg font-semibold text-gray-800">Rate this Purchase Order</h3>
                  </div>
                  <div className="bg-gradient-to-br from-cyan-50 to-teal-50 border border-teal-200 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      {/* Quality Rating */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Product Quality</label>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map(star => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setTempRating({...tempRating, quality: star})}
                              className="text-2xl transition-all"
                            >
                              <i className={`fas fa-star ${star <= tempRating.quality ? 'text-amber-500' : 'text-gray-300'}`}></i>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Delivery Rating */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Time</label>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map(star => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setTempRating({...tempRating, delivery: star})}
                              className="text-2xl transition-all"
                            >
                              <i className={`fas fa-star ${star <= tempRating.delivery ? 'text-amber-500' : 'text-gray-300'}`}></i>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Price Rating */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Price Value</label>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map(star => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setTempRating({...tempRating, price: star})}
                              className="text-2xl transition-all"
                            >
                              <i className={`fas fa-star ${star <= tempRating.price ? 'text-amber-500' : 'text-gray-300'}`}></i>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Comments */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Comments</label>
                      <textarea
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 resize-none"
                        value={tempRating.comments}
                        onChange={(e) => setTempRating({...tempRating, comments: e.target.value})}
                        placeholder="Share your experience..."
                        rows="2"
                      />
                    </div>
                  </div>
                </div>
              </form>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end px-6 py-4 border-t border-gray-200 bg-gray-50 gap-3">
              <button
                type="button"
                onClick={() => setShowEditPOModal(false)}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-2"
              >
                <i className="fas fa-times"></i> Cancel
              </button>
              <button
                type="button"
                onClick={handleUpdatePO}
                className="px-6 py-2 bg-gradient-to-r from-teal-400 to-teal-700 text-white rounded-lg hover:from-teal-500 hover:to-teal-800 transition-all flex items-center gap-2 shadow-md"
              >
                <i className="fas fa-save"></i> Update Purchase Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== MODAL 3: VIEW PURCHASE ORDER (WITH RATING DISPLAY) ==================== */}
      {showViewPOModal && getCurrentViewingPO && getCurrentViewingPO() && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={() => setShowViewPOModal(false)}
          />

          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden z-10 mx-4">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-cyan-50 to-teal-50">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <i className="fas fa-file-invoice text-teal-600"></i>
                Purchase Order Details
              </h2>
              <button 
                onClick={() => setShowViewPOModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>

            {/* Body */}
            <div className="overflow-y-auto max-h-[calc(90vh-140px)] px-6 py-4 space-y-6">

              {/* PO Information */}
              <div>
                <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-teal-200">
                  <i className="fas fa-file-invoice text-teal-600"></i>
                  <h3 className="text-lg font-semibold text-gray-800">Purchase Order Information</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-xs text-gray-500 mb-1">PO Number</div>
                    <div className="font-semibold text-gray-800">{getCurrentViewingPO().poNumber}</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-xs text-gray-500 mb-1">Status</div>
                    <div>{getStatusBadge(getCurrentViewingPO().status)}</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-xs text-gray-500 mb-1">Purchase Date</div>
                    <div className="font-semibold text-gray-800">{formatDate(getCurrentViewingPO().purchaseDate)}</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-xs text-gray-500 mb-1">Expected Delivery</div>
                    <div className="font-semibold text-gray-800">{formatDate(getCurrentViewingPO().expectedDeliveryDate)}</div>
                  </div>
                </div>
              </div>

              {/* Vendor Information */}
              <div>
                <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-teal-200">
                  <i className="fas fa-store text-teal-600"></i>
                  <h3 className="text-lg font-semibold text-gray-800">Vendor Information</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-xs text-gray-500 mb-1">Vendor Name</div>
                    <div className="font-semibold text-gray-800">{getCurrentViewingPO().vendorName}</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-xs text-gray-500 mb-1">Vendor ID</div>
                    <div className="font-semibold text-gray-800">{getCurrentViewingPO().vendorId}</div>
                  </div>
                </div>
              </div>

              {/* Products Table */}
              <div>
                <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-teal-200">
                  <i className="fas fa-boxes text-teal-600"></i>
                  <h3 className="text-lg font-semibold text-gray-800">Products Ordered</h3>
                </div>
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                  <table className="w-full">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Product</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Quantity</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Unit Price</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Total</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Selected Vendors</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {getCurrentViewingPO().products.map((product, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium text-gray-800">{product.productName}</td>
                          <td className="px-4 py-3 text-gray-600">{product.orderedQty}</td>
                          <td className="px-4 py-3 text-gray-600">{formatCurrency(product.unitPrice)}</td>
                          <td className="px-4 py-3 font-semibold text-gray-800">{formatCurrency(product.orderedQty * product.unitPrice)}</td>
                          <td className="px-4 py-3">
                            <div className="flex flex-wrap gap-1">
                              {product.selectedVendors?.map(vId => {
                                const vendor = vendors.find(v => v.id === vId);
                                return vendor ? (
                                  <span key={vId} className="px-2 py-1 bg-teal-100 text-teal-700 rounded text-xs font-medium">
                                    {vendor.vendorName}
                                  </span>
                                ) : null;
                              })}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 bg-gradient-to-r from-teal-500 to-cyan-600 text-white rounded-lg p-4 flex justify-between items-center">
                  <span className="text-lg font-semibold">Total Purchase Amount</span>
                  <span className="text-2xl font-bold">{formatCurrency(getCurrentViewingPO().purchasePrice)}</span>
                </div>
              </div>

              {/* Remarks */}
              {getCurrentViewingPO().remarks && (
                <div>
                  <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-teal-200">
                    <i className="fas fa-sticky-note text-teal-600"></i>
                    <h3 className="text-lg font-semibold text-gray-800">Remarks</h3>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700">{getCurrentViewingPO().remarks}</p>
                  </div>
                </div>
              )}

              {/* RATING DISPLAY - READ ONLY */}
              {poRatings[currentViewingPOId] && (
                <div>
                  <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-teal-200">
                    <i className="fas fa-star text-teal-600"></i>
                    <h3 className="text-lg font-semibold text-gray-800">Purchase Order Rating</h3>
                  </div>
                  <div className="bg-gradient-to-br from-cyan-50 to-teal-50 border border-teal-200 rounded-lg p-4">
                    {(() => {
                      const rating = poRatings[currentViewingPOId];
                      const avgRating = ((rating.quality + rating.delivery + rating.price) / 3).toFixed(1);
                      return (
                        <>
                          <div className="flex items-center justify-between mb-4 pb-4 border-b border-teal-200">
                            <div>
                              <div className="text-sm text-gray-600 mb-1">Overall Rating</div>
                              <div className="flex items-center gap-2">
                                <span className="text-3xl font-bold text-teal-600">{avgRating}</span>
                                <span className="text-gray-500">/ 5.0</span>
                              </div>
                            </div>
                            <div className="flex gap-1">
                              {[1, 2, 3, 4, 5].map(star => (
                                <i key={star} className={`fas fa-star text-2xl ${star <= Math.round(avgRating) ? 'text-amber-500' : 'text-gray-300'}`}></i>
                              ))}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div className="bg-white p-3 rounded-lg">
                              <div className="text-xs text-gray-600 mb-2">Product Quality</div>
                              <div className="flex items-center gap-2">
                                <div className="flex gap-1">
                                  {[1, 2, 3, 4, 5].map(star => (
                                    <i key={star} className={`fas fa-star ${star <= rating.quality ? 'text-amber-500' : 'text-gray-300'}`}></i>
                                  ))}
                                </div>
                                <span className="text-sm font-semibold text-gray-700">{rating.quality}/5</span>
                              </div>
                            </div>

                            <div className="bg-white p-3 rounded-lg">
                              <div className="text-xs text-gray-600 mb-2">Delivery Time</div>
                              <div className="flex items-center gap-2">
                                <div className="flex gap-1">
                                  {[1, 2, 3, 4, 5].map(star => (
                                    <i key={star} className={`fas fa-star ${star <= rating.delivery ? 'text-amber-500' : 'text-gray-300'}`}></i>
                                  ))}
                                </div>
                                <span className="text-sm font-semibold text-gray-700">{rating.delivery}/5</span>
                              </div>
                            </div>

                            <div className="bg-white p-3 rounded-lg">
                              <div className="text-xs text-gray-600 mb-2">Price Value</div>
                              <div className="flex items-center gap-2">
                                <div className="flex gap-1">
                                  {[1, 2, 3, 4, 5].map(star => (
                                    <i key={star} className={`fas fa-star ${star <= rating.price ? 'text-amber-500' : 'text-gray-300'}`}></i>
                                  ))}
                                </div>
                                <span className="text-sm font-semibold text-gray-700">{rating.price}/5</span>
                              </div>
                            </div>
                          </div>

                          {rating.comments && (
                            <div className="bg-white p-3 rounded-lg">
                              <div className="text-xs text-gray-600 mb-2">Comments</div>
                              <p className="text-gray-700">{rating.comments}</p>
                            </div>
                          )}
                        </>
                      );
                    })()}
                  </div>
                </div>
              )}

            </div>

            {/* Footer */}
            <div className="flex justify-end px-6 py-4 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setShowViewPOModal(false)}
                className="px-6 py-2 bg-gradient-to-r from-teal-400 to-teal-700 text-white rounded-lg hover:from-teal-500 hover:to-teal-800 transition-all flex items-center gap-2 shadow-md"
              >
                <i className="fas fa-times"></i> Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== MODAL 4: GRN (GOODS RECEIVED NOTE) ==================== */}
      {showGRNModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={() => setShowGRNModal(false)}
          />

          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden z-10 mx-4">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-cyan-50 to-teal-50">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <i className="fas fa-clipboard-check text-teal-600"></i>
                Create Goods Received Note (GRN)
              </h2>
              <button 
                onClick={() => setShowGRNModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>

            {/* Body */}
            <div className="overflow-y-auto max-h-[calc(90vh-140px)] px-6 py-4">
              <form onSubmit={(e) => { e.preventDefault(); handleCreateGRN(); }}>

                {/* GRN Details */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-teal-200">
                    <i className="fas fa-clipboard-check text-teal-600"></i>
                    <h3 className="text-lg font-semibold text-gray-800">GRN Details</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        GRN Number (Auto-Generated)
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
                        value={grnForm.grnNumber}
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        PO Number
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
                        value={grnForm.poNumber}
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Received Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                        value={grnForm.receivedDate}
                        onChange={(e) => setGrnForm({...grnForm, receivedDate: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Transport Details */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-teal-200">
                    <i className="fas fa-truck text-teal-600"></i>
                    <h3 className="text-lg font-semibold text-gray-800">Transport Details</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Vehicle Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                        value={grnForm.vehicleNumber}
                        onChange={(e) => setGrnForm({...grnForm, vehicleNumber: e.target.value})}
                        placeholder="e.g., TN01AB1234"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Transport Name
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                        value={grnForm.transportName}
                        onChange={(e) => setGrnForm({...grnForm, transportName: e.target.value})}
                        placeholder="e.g., Blue Dart"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        LR Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                        value={grnForm.lrNumber}
                        onChange={(e) => setGrnForm({...grnForm, lrNumber: e.target.value})}
                        placeholder="Lorry Receipt Number"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Product Verification */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-teal-200">
                    <i className="fas fa-boxes text-teal-600"></i>
                    <h3 className="text-lg font-semibold text-gray-800">Product Verification</h3>
                  </div>

                  {grnForm.products && grnForm.products.length > 0 ? (
                    <div className="overflow-x-auto rounded-lg border border-gray-200">
                      <table className="w-full">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Product</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Ordered Qty</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Received Qty</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Remarks</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {grnForm.products.map((product, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="px-4 py-3 font-medium text-gray-800">{product.productName}</td>
                              <td className="px-4 py-3 text-gray-600">{product.orderedQty}</td>
                              <td className="px-4 py-3">
                                <input
                                  type="number"
                                  className="w-20 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500"
                                  min="0"
                                  max={product.orderedQty}
                                  value={product.receivedQty}
                                  onChange={(e) => handleGRNProductChange(product.productId, 'receivedQty', parseInt(e.target.value))}
                                />
                              </td>
                              <td className="px-4 py-3">
                                <select
                                  className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 text-sm"
                                  value={product.status}
                                  onChange={(e) => handleGRNProductChange(product.productId, 'status', e.target.value)}
                                >
                                  <option value="received">Received</option>
                                  <option value="damaged">Damaged</option>
                                  <option value="missing">Missing</option>
                                </select>
                              </td>
                              <td className="px-4 py-3">
                                <input
                                  type="text"
                                  className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 text-sm"
                                  placeholder="Add remarks..."
                                  value={product.remarks || ''}
                                  onChange={(e) => handleGRNProductChange(product.productId, 'remarks', e.target.value)}
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                      <i className="fas fa-box-open text-4xl text-gray-300 mb-3"></i>
                      <p className="text-gray-500">No products to verify</p>
                    </div>
                  )}
                </div>

                {/* Remarks */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-teal-200">
                    <i className="fas fa-comment-alt text-teal-600"></i>
                    <h3 className="text-lg font-semibold text-gray-800">Remarks</h3>
                  </div>
                  <textarea
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 resize-none"
                    value={grnForm.remarks}
                    onChange={(e) => setGrnForm({...grnForm, remarks: e.target.value})}
                    placeholder="Add remarks about the delivery..."
                    rows="3"
                  />
                </div>
              </form>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setShowGRNModal(false)}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-2"
              >
                <i className="fas fa-times"></i> Cancel
              </button>
              <button
                onClick={handleCreateGRN}
                className="px-6 py-2 bg-gradient-to-r from-teal-400 to-teal-700 text-white rounded-lg hover:from-teal-500 hover:to-teal-800 transition-colors flex items-center gap-2 shadow-md"
              >
                <i className="fas fa-save"></i> Save GRN
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== MODAL 5: RESCHEDULE ==================== */}
      {showRescheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={() => setShowRescheduleModal(false)}
          />

          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden z-10 mx-4">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-cyan-50 to-teal-50">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <i className="fas fa-calendar-alt text-teal-600"></i>
                Reschedule Delivery
              </h2>
              <button 
                onClick={() => setShowRescheduleModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>

            <div className="overflow-y-auto max-h-[calc(90vh-140px)] px-6 py-4">
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Expected Delivery Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                  value={rescheduleForm.newExpectedDate}
                  onChange={(e) => setRescheduleForm({...rescheduleForm, newExpectedDate: e.target.value})}
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Rescheduling <span className="text-red-500">*</span>
                </label>
                <textarea
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 resize-none"
                  value={rescheduleForm.remarks}
                  onChange={(e) => setRescheduleForm({...rescheduleForm, remarks: e.target.value})}
                  placeholder="Enter reason for rescheduling..."
                  rows="4"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setShowRescheduleModal(false)}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-2"
              >
                <i className="fas fa-times"></i> Cancel
              </button>
              <button
                onClick={handleReschedulePO}
                className="px-6 py-2 bg-gradient-to-r from-teal-400 to-teal-700 text-white rounded-lg hover:from-teal-500 hover:to-teal-800 transition-colors flex items-center gap-2 shadow-md"
              >
                <i className="fas fa-calendar-check"></i> Reschedule
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== MODAL 6: RETURN/REPLACE ==================== */}
      {showReturnModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center">
    <div 
      className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
      onClick={() => setShowReturnModal(false)}
    />

    <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden z-10 mx-4">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-cyan-50 to-teal-50">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <i className="fas fa-undo text-teal-600"></i>
          Return / Replace Products
        </h2>
        <button 
          onClick={() => setShowReturnModal(false)}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <i className="fas fa-times text-xl"></i>
        </button>
      </div>

      {/* Body */}
      <div className="overflow-y-auto max-h-[calc(90vh-140px)] px-6 py-4">

        {/* Request Type - TWO OPTIONS */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Request Type <span className="text-red-500">*</span>
          </label>
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
            value={returnForm.returnType}
            onChange={(e) => setReturnForm({...returnForm, returnType: e.target.value})}
            required
          >
            <option value="">Select Type</option>
            <option value="internal">Internal Return (Warehouse to Requester)</option>
            <option value="purchase">Purchase Return (Warehouse to Vendor)</option>
          </select>
        </div>

        {/* Reason - 8 OPTIONS */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Reason <span className="text-red-500">*</span>
          </label>
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
            value={returnForm.reason}
            onChange={(e) => setReturnForm({...returnForm, reason: e.target.value})}
            required
          >
            <option value="">Select Reason</option>
            <option value="defective">Product found defective</option>
            <option value="mismatched">Mismatched or expired after delivery</option>
            <option value="damaged">Damaged during transit</option>
            <option value="wrong_item">Wrong item received</option>
            <option value="quality">Quality issue</option>
            <option value="missing_parts">Missing parts or damaged</option>
            <option value="not_required">Unused or not required</option>
            <option value="excess_stock">Unused or excess stock</option>
          </select>
        </div>

        {/* Product Selection */}
        {returnForm.products && returnForm.products.length > 0 && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select Products to Return <span className="text-red-500">*</span>
            </label>
            <div className="space-y-3">
              {returnForm.products.map((product, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3 mb-3">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
                      checked={product.selected}
                      onChange={(e) => handleReturnProductChange(product.productId, 'selected', e.target.checked)}
                    />
                    <span className="font-medium text-gray-800">{product.productName}</span>
                    <span className="text-sm text-gray-500">(Ordered: {product.orderedQty})</span>
                  </div>
                  {product.selected && (
                    <div className="ml-7 grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Return Quantity</label>
                        <input
                          type="number"
                          className="w-full px-3 py-1.5 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 text-sm"
                          min="1"
                          max={product.orderedQty}
                          value={product.returnQty}
                          onChange={(e) => handleReturnProductChange(product.productId, 'returnQty', parseInt(e.target.value))}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Remarks</label>
                        <input
                          type="text"
                          className="w-full px-3 py-1.5 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 text-sm"
                          placeholder="Item condition..."
                          value={product.remarks}
                          onChange={(e) => handleReturnProductChange(product.productId, 'remarks', e.target.value)}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Detailed Remarks */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Detailed Remarks <span className="text-red-500">*</span>
          </label>
          <textarea
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 resize-none"
            value={returnForm.remarks}
            onChange={(e) => setReturnForm({...returnForm, remarks: e.target.value})}
            placeholder="Provide detailed information about the return..."
            rows="4"
            required
          />
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
        <button
          onClick={() => setShowReturnModal(false)}
          className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-2"
        >
          <i className="fas fa-times"></i> Cancel
        </button>
        <button
          onClick={handleCreateReturn}
          className="px-6 py-2 bg-gradient-to-r from-teal-400 to-teal-700 text-white rounded-lg hover:from-teal-500 hover:to-teal-800 transition-colors flex items-center gap-2 shadow-md"
        >
          <i className="fas fa-check"></i> Submit Return Request
        </button>
      </div>
    </div>
  </div>
)}
    </>
  );
};

export default PurchaseModals;