import React from 'react';

const PurchaseModals = ({
  // Modal states
  showCreatePOModal, setShowCreatePOModal,
  showEditPOModal, setShowEditPOModal,
  showViewPOModal, setShowViewPOModal,
  showGRNModal, setShowGRNModal,
  showRescheduleModal, setShowRescheduleModal,
  showReturnModal, setShowReturnModal,
  showRatingModal, setShowRatingModal,

  // Form states
  poForm, setPOForm,
  productRows, setProductRows,
  grnForm, setGrnForm,
  rescheduleForm, setRescheduleForm,
  returnForm, setReturnForm,
  tempRating, setTempRating,

  // Product search
  productSearchTerms, setProductSearchTerms,
  showProductSuggestions, setShowProductSuggestions,

  // Data
  vendors,
  products,

  // Handlers
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
  handleSubmitRating,
  formatDate,
  formatCurrency,
  getStatusBadge,
  getCurrentViewingPO
}) => {

  return (
    <>
      {/* ================================================================ */}
      {/* MODAL 1: CREATE PURCHASE ORDER */}
      {/* ================================================================ */}
      {showCreatePOModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={() => setShowCreatePOModal(false)}
          ></div>

          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden z-10 mx-4">

            {/* Header - TEAL */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-teal-50 to-cyan-50">
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

                {/* Purchase Order Details */}
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
                      className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors flex items-center gap-2 text-sm"
                    >
                      <i className="fas fa-plus"></i>
                      Add Product
                    </button>
                  </div>

                  <div className="bg-teal-50 border border-teal-200 rounded-lg p-3 mb-4 flex items-start gap-2">
                    <i className="fas fa-info-circle text-teal-600 mt-0.5"></i>
                    <span className="text-sm text-teal-800">Select product, then choose vendors who can supply it (multi-select enabled)</span>
                  </div>

                  <div className="space-y-6">
                    {productRows.map((row, rowIndex) => (
                      <div key={row.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200 relative">

                        {/* Remove button */}
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
                              placeholder="Type product id or name..."
                              value={productSearchTerms[row.id] || ''}
                              onChange={(e) => handleProductSearch(row.id, e.target.value)}
                              onFocus={() => setShowProductSuggestions({...showProductSuggestions, [row.id]: true})}
                              autoComplete="off"
                              required
                            />

                            {/* Product Suggestions Dropdown - FIXED! */}
                            {showProductSuggestions[row.id] && productSearchTerms[row.id]?.length > 0 && (
                              <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                {getFilteredProducts(productSearchTerms[row.id]).length === 0 ? (
                                  <div className="px-4 py-3 text-sm text-gray-500 text-center">No matching products</div>
                                ) : (
                                  getFilteredProducts(productSearchTerms[row.id]).map(product => (
                                    <div
                                      key={product.id}
                                      className="px-4 py-3 hover:bg-teal-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                                      onMouseDown={() => handleSelectProduct(row.id, product)}
                                    >
                                      <div className="font-medium text-gray-800">{product.id} - {product.productName}</div>
                                      <div className="text-sm text-gray-500">₹{product.unitPrice.toLocaleString()} | {product.category}</div>
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
                              value={row.quantity}
                              onChange={(e) => {
                                const newRows = [...productRows];
                                newRows[rowIndex].quantity = parseInt(e.target.value) || 1;
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
                                const availableVendors = vendors.filter(v => 
                                  v.suppliesProducts && v.suppliesProducts.includes(row.productId)
                                );

                                if (availableVendors.length === 0) {
                                  return (
                                    <span className="text-sm text-gray-500 italic">
                                      No vendors available for this product
                                    </span>
                                  );
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

                                        if (!currentRow.selectedVendors) {
                                          currentRow.selectedVendors = [];
                                        }

                                        if (isSelected) {
                                          currentRow.selectedVendors = currentRow.selectedVendors.filter(
                                            id => id !== vendor.id
                                          );
                                        } else {
                                          currentRow.selectedVendors.push(vendor.id);
                                        }

                                        setProductRows(newRows);
                                      }}
                                      className={`px-4 py-2 rounded-lg border-2 transition-all flex items-center gap-2 text-sm font-medium ${
                                        isSelected 
                                          ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white border-teal-600 shadow-md' 
                                          : 'bg-white text-gray-700 border-gray-300 hover:border-teal-400 hover:bg-teal-50'
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

                {/* Order Summary */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-teal-200">
                    <i className="fas fa-list-alt text-teal-600"></i>
                    <h3 className="text-lg font-semibold text-gray-800">Order Summary Preview</h3>
                  </div>
                  <div className="bg-gradient-to-br from-teal-50 to-cyan-50 border-2 border-dashed border-teal-300 rounded-lg p-4">
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
                          }).filter(Boolean) || [];

                          return (
                            <div key={idx} className="bg-white rounded-lg p-4 shadow-sm border border-teal-200">
                              <div className="flex justify-between items-start mb-2">
                                <span className="font-semibold text-gray-800">{product?.productName}</span>
                                <span className="text-sm text-gray-600">
                                  {row.quantity} units × ₹{row.unitPrice.toLocaleString()} = <span className="font-bold text-teal-600">₹{itemTotal.toLocaleString()}</span>
                                </span>
                              </div>
                              {selectedVendorNames.length > 0 && (
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="text-xs text-gray-600">Vendors:</span>
                                  {selectedVendorNames.map((name, i) => (
                                    <span key={i} className="px-2 py-1 bg-cyan-100 text-cyan-700 rounded text-xs font-medium">{name}</span>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                        <div className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-lg p-4 flex justify-between items-center">
                          <span className="text-lg font-semibold">Total Order Amount</span>
                          <span className="text-2xl font-bold">₹{calculateOrderTotal().toLocaleString()}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Remarks */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-teal-200">
                    <i className="fas fa-sticky-note text-teal-600"></i>
                    <h3 className="text-lg font-semibold text-gray-800">Remarks & Delivery Information</h3>
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
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600 font-medium">Send via:</span>
                <button type="button" className="w-10 h-10 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center shadow-md" title="Send via WhatsApp">
                  <i className="fab fa-whatsapp text-lg"></i>
                </button>
                <button type="button" className="w-10 h-10 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center shadow-md" title="Send via Email">
                  <i className="fas fa-envelope text-lg"></i>
                </button>
              </div>
              <div className="flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setShowCreatePOModal(false)}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-2"
                >
                  <i className="fas fa-times"></i>
                  Cancel
                </button>
                <button 
                  type="button" 
                  onClick={handleCreatePO}
                  className="px-6 py-2 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-lg hover:from-teal-700 hover:to-cyan-700 transition-all flex items-center gap-2 shadow-md"
                >
                  <i className="fas fa-check"></i>
                  Create Purchase Order
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ================================================================ */}
      {/* MODAL 2: EDIT PURCHASE ORDER */}
      {/* ================================================================ */}
      {showEditPOModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={() => setShowEditPOModal(false)}
          ></div>

          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden z-10 mx-4">

            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-teal-50 to-cyan-50">
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

            <div className="overflow-y-auto max-h-[calc(90vh-140px)] px-6 py-4">
              {/* Same form as Create PO */}
              <form onSubmit={(e) => { e.preventDefault(); handleUpdatePO(); }}>
                {/* Copy the exact same form fields from Create PO above */}
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
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                        value={poForm.expectedDeliveryDate}
                        onChange={(e) => setPOForm({...poForm, expectedDeliveryDate: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Products section (same as create) */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4 pb-2 border-b-2 border-teal-200">
                    <div className="flex items-center gap-2">
                      <i className="fas fa-boxes text-teal-600"></i>
                      <h3 className="text-lg font-semibold text-gray-800">Products & Vendors</h3>
                    </div>
                    <button 
                      type="button" 
                      onClick={handleAddProductRow}
                      className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors flex items-center gap-2 text-sm"
                    >
                      <i className="fas fa-plus"></i>
                      Add Product
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
                            <label className="block text-sm font-medium text-gray-700 mb-2">Product <span className="text-red-500">*</span></label>
                            <input
                              type="text"
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                              value={productSearchTerms[row.id] || ''}
                              onChange={(e) => handleProductSearch(row.id, e.target.value)}
                              onFocus={() => setShowProductSuggestions({...showProductSuggestions, [row.id]: true})}
                              required
                            />

                            {showProductSuggestions[row.id] && productSearchTerms[row.id]?.length > 0 && (
                              <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                {getFilteredProducts(productSearchTerms[row.id]).map(product => (
                                  <div
                                    key={product.id}
                                    className="px-4 py-3 hover:bg-teal-50 cursor-pointer"
                                    onMouseDown={() => handleSelectProduct(row.id, product)}
                                  >
                                    <div className="font-medium">{product.productName}</div>
                                    <div className="text-sm text-gray-500">₹{product.unitPrice.toLocaleString()}</div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Unit Price</label>
                            <input type="number" className="w-full px-4 py-2 border rounded-lg bg-gray-100" value={row.unitPrice} readOnly />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                            <input
                              type="number"
                              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500"
                              value={row.quantity}
                              onChange={(e) => {
                                const newRows = [...productRows];
                                newRows[rowIndex].quantity = parseInt(e.target.value) || 1;
                                setProductRows(newRows);
                              }}
                              required
                            />
                          </div>
                        </div>

                        {row.productId && (
                          <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Select Vendors</label>
                            <div className="flex flex-wrap gap-2">
                              {vendors.filter(v => v.suppliesProducts?.includes(row.productId)).map(vendor => {
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
                                    className={`px-4 py-2 rounded-lg border-2 transition-all ${isSelected ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white border-teal-600' : 'bg-white border-gray-300 hover:border-teal-400'}`}
                                  >
                                    {vendor.vendorName}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Remarks</label>
                  <textarea
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500"
                    value={poForm.remarks}
                    onChange={(e) => setPOForm({...poForm, remarks: e.target.value})}
                    rows="3"
                  />
                </div>
              </form>
            </div>

            <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50">
              <button onClick={() => setShowEditPOModal(false)} className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">Cancel</button>
              <button onClick={handleUpdatePO} className="px-6 py-2 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-lg hover:from-teal-700 hover:to-cyan-700 shadow-md">Update Order</button>
            </div>

          </div>
        </div>
      )}

      {/* ================================================================ */}
      {/* MODAL 3: VIEW PURCHASE ORDER + DOWNLOAD GRN */}
      {/* ================================================================ */}
      {showViewPOModal && getCurrentViewingPO() && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowViewPOModal(false)}></div>
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden z-10 mx-4">

            <div className="flex items-center justify-between px-6 py-4 border-b bg-gradient-to-r from-teal-50 to-cyan-50">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <i className="fas fa-file-invoice text-teal-600"></i>
                Purchase Order Details
              </h2>
              <button onClick={() => setShowViewPOModal(false)} className="text-gray-400 hover:text-gray-600">
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>

            <div className="overflow-y-auto max-h-[calc(90vh-140px)] px-6 py-4 space-y-6">

              <div>
                <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-teal-200">
                  <i className="fas fa-file-invoice text-teal-600"></i>
                  <h3 className="text-lg font-semibold">PO Information</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-xs text-gray-500 mb-1">PO Number</div>
                    <div className="font-semibold">{getCurrentViewingPO().poNumber}</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-xs text-gray-500 mb-1">Status</div>
                    <div>{getStatusBadge(getCurrentViewingPO().status)}</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-xs text-gray-500 mb-1">Purchase Date</div>
                    <div className="font-semibold">{formatDate(getCurrentViewingPO().purchaseDate)}</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-xs text-gray-500 mb-1">Expected Delivery</div>
                    <div className="font-semibold">{formatDate(getCurrentViewingPO().expectedDeliveryDate)}</div>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-teal-200">
                  <i className="fas fa-boxes text-teal-600"></i>
                  <h3 className="text-lg font-semibold">Products</h3>
                </div>
                <div className="overflow-x-auto rounded-lg border">
                  <table className="w-full">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Product</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Quantity</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Unit Price</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getCurrentViewingPO().products.map((p, i) => (
                        <tr key={i} className="border-t hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium">{p.productName}</td>
                          <td className="px-4 py-3">{p.orderedQty}</td>
                          <td className="px-4 py-3">₹{p.unitPrice.toLocaleString()}</td>
                          <td className="px-4 py-3 font-semibold text-teal-600">₹{(p.orderedQty * p.unitPrice).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-teal-200">
                  <i className="fas fa-sticky-note text-teal-600"></i>
                  <h3 className="text-lg font-semibold">Remarks</h3>
                </div>
                <p className="bg-gray-50 p-4 rounded-lg">{getCurrentViewingPO().remarks || 'No remarks'}</p>
              </div>

            </div>

            {/* Footer with Download GRN button */}
            <div className="flex justify-between items-center px-6 py-4 border-t bg-gray-50">
              <div>
                {getCurrentViewingPO().grnNumber && (
                  <button 
                    onClick={() => {
                      alert(`Downloading GRN: ${getCurrentViewingPO().grnNumber}`);
                      // Add actual download logic here
                    }}
                    className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 flex items-center gap-2 shadow-md"
                  >
                    <i className="fas fa-download"></i> Download GRN
                  </button>
                )}
              </div>
              <button onClick={() => setShowViewPOModal(false)} className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
                <i className="fas fa-times"></i> Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ================================================================ */}
      {/* MODAL 4: CREATE GRN */}
      {/* ================================================================ */}
      {showGRNModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowGRNModal(false)}></div>
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden z-10 mx-4">

            <div className="flex items-center justify-between px-6 py-4 border-b bg-gradient-to-r from-green-50 to-emerald-50">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <i className="fas fa-clipboard-check text-green-600"></i>
                Create GRN
              </h2>
              <button onClick={() => setShowGRNModal(false)} className="text-gray-400 hover:text-gray-600">
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>

            <div className="px-6 py-4">
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">Transport Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Vehicle Number <span className="text-red-500">*</span></label>
                    <input type="text" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500" value={grnForm.vehicleNumber} onChange={(e) => setGrnForm({...grnForm, vehicleNumber: e.target.value})} required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Transport Name</label>
                    <input type="text" className="w-full px-4 py-2 border rounded-lg" value={grnForm.transportName} onChange={(e) => setGrnForm({...grnForm, transportName: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">LR Number <span className="text-red-500">*</span></label>
                    <input type="text" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500" value={grnForm.lrNumber} onChange={(e) => setGrnForm({...grnForm, lrNumber: e.target.value})} required />
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Remarks</label>
                <textarea className="w-full px-4 py-2 border rounded-lg" value={grnForm.remarks} onChange={(e) => setGrnForm({...grnForm, remarks: e.target.value})} rows="3" />
              </div>
            </div>

            <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50">
              <button onClick={() => setShowGRNModal(false)} className="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">Cancel</button>
              <button onClick={handleCreateGRN} className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 shadow-md">Save GRN</button>
            </div>

          </div>
        </div>
      )}

      {/* ================================================================ */}
      {/* MODAL 5: RESCHEDULE */}
      {/* ================================================================ */}
      {showRescheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowRescheduleModal(false)}></div>
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden z-10 mx-4">

            <div className="flex items-center justify-between px-6 py-4 border-b bg-gradient-to-r from-orange-50 to-amber-50">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <i className="fas fa-calendar-alt text-orange-600"></i>
                Reschedule Delivery
              </h2>
              <button onClick={() => setShowRescheduleModal(false)} className="text-gray-400 hover:text-gray-600">
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>

            <div className="px-6 py-4 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">New Date <span className="text-red-500">*</span></label>
                <input type="date" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500" value={rescheduleForm.newExpectedDate} onChange={(e) => setRescheduleForm({...rescheduleForm, newExpectedDate: e.target.value})} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Time</label>
                <input type="time" className="w-full px-4 py-2 border rounded-lg" value={rescheduleForm.time} onChange={(e) => setRescheduleForm({...rescheduleForm, time: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Remarks <span className="text-red-500">*</span></label>
                <textarea className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500" value={rescheduleForm.remarks} onChange={(e) => setRescheduleForm({...rescheduleForm, remarks: e.target.value})} rows="4" required />
              </div>
            </div>

            <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50">
              <button onClick={() => setShowRescheduleModal(false)} className="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">Cancel</button>
              <button onClick={handleReschedulePO} className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 shadow-md">Save</button>
            </div>

          </div>
        </div>
      )}

      {/* ================================================================ */}
      {/* MODAL 6: RETURN/REPLACEMENT */}
      {/* ================================================================ */}
      {showReturnModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowReturnModal(false)}></div>
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden z-10 mx-4">

            <div className="flex items-center justify-between px-6 py-4 border-b bg-gradient-to-r from-red-50 to-pink-50">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <i className="fas fa-undo text-red-600"></i>
                Return/Replacement Request
              </h2>
              <button onClick={() => setShowReturnModal(false)} className="text-gray-400 hover:text-gray-600">
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>

            <div className="px-6 py-4">
              <div className="mb-6 grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Type <span className="text-red-500">*</span></label>
                  <select className="w-full px-4 py-2 border rounded-lg" value={returnForm.returnType} onChange={(e) => setReturnForm({...returnForm, returnType: e.target.value})} required>
                    <option value="">Select Type</option>
                    <option value="internal">Internal Return</option>
                    <option value="purchase">Purchase Return</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Reason <span className="text-red-500">*</span></label>
                  <select className="w-full px-4 py-2 border rounded-lg" value={returnForm.reason} onChange={(e) => setReturnForm({...returnForm, reason: e.target.value})} required>
                    <option value="">Select Reason</option>
                    <option value="defective">Defective</option>
                    <option value="damaged">Damaged</option>
                    <option value="wrongitem">Wrong Item</option>
                    <option value="quality">Quality Issue</option>
                  </select>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Remarks <span className="text-red-500">*</span></label>
                <textarea className="w-full px-4 py-2 border rounded-lg" value={returnForm.remarks} onChange={(e) => setReturnForm({...returnForm, remarks: e.target.value})} rows="4" required />
              </div>
            </div>

            <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50">
              <button onClick={() => setShowReturnModal(false)} className="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">Cancel</button>
              <button onClick={handleCreateReturn} className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 shadow-md">Submit</button>
            </div>

          </div>
        </div>
      )}

      {/* ================================================================ */}
      {/* MODAL 7: VENDOR RATING */}
      {/* ================================================================ */}
      {showRatingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowRatingModal(false)}></div>
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden z-10 mx-4">

            <div className="flex items-center justify-between px-6 py-4 border-b bg-gradient-to-r from-yellow-50 to-amber-50">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <i className="fas fa-star text-yellow-600"></i>
                Rate Purchase Order
              </h2>
              <button onClick={() => setShowRatingModal(false)} className="text-gray-400 hover:text-gray-600">
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>

            <div className="px-6 py-4 space-y-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <label className="block text-sm font-medium mb-3">Product Quality</label>
                <div className="flex gap-2">
                  {[1,2,3,4,5].map(star => (
                    <button key={star} type="button" onClick={() => setTempRating({...tempRating, quality: star})} className="text-4xl hover:scale-110">
                      <i className={`fas fa-star ${star <= tempRating.quality ? 'text-yellow-500' : 'text-gray-300'}`}></i>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <label className="block text-sm font-medium mb-3">Delivery Time</label>
                <div className="flex gap-2">
                  {[1,2,3,4,5].map(star => (
                    <button key={star} type="button" onClick={() => setTempRating({...tempRating, delivery: star})} className="text-4xl hover:scale-110">
                      <i className={`fas fa-star ${star <= tempRating.delivery ? 'text-yellow-500' : 'text-gray-300'}`}></i>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <label className="block text-sm font-medium mb-3">Price / Value</label>
                <div className="flex gap-2">
                  {[1,2,3,4,5].map(star => (
                    <button key={star} type="button" onClick={() => setTempRating({...tempRating, price: star})} className="text-4xl hover:scale-110">
                      <i className={`fas fa-star ${star <= tempRating.price ? 'text-yellow-500' : 'text-gray-300'}`}></i>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Comments (Optional)</label>
                <textarea className="w-full px-4 py-2 border rounded-lg" value={tempRating.comments || ''} onChange={(e) => setTempRating({...tempRating, comments: e.target.value})} rows="4" />
              </div>
            </div>

            <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50">
              <button onClick={() => setShowRatingModal(false)} className="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">Cancel</button>
              <button onClick={handleSubmitRating} className="px-6 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:from-yellow-600 hover:to-orange-600 shadow-md">Submit Rating</button>
            </div>

          </div>
        </div>
      )}

    </>
  );
};

export default PurchaseModals;