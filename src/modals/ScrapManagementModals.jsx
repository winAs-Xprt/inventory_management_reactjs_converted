// src/modals/ScrapManagementModals.jsx
import React, { useState, useEffect } from 'react';
import { AVAILABLE_PRODUCTS, AVAILABLE_VENDORS, AVAILABLE_PLANTS } from '../data/ScrapManagementData';

const ScrapModals = ({
  showDetailModal,
  setShowDetailModal,
  showScrapInModal,
  setShowScrapInModal,
  showScrapOutModal,
  setShowScrapOutModal,
  selectedRecord,
  availableScrapItems,
  showConfirmModal,
  setShowConfirmModal,
  confirmConfig,
  formatDate,
  addScrapInRecord,
  addScrapOutRecord,
  showToast
}) => {
  // Scrap In form state
  const [scrapInForm, setScrapInForm] = useState({
    productCode: '',
    productName: '',
    fromPerson: '',
    plant: '',
    quantity: '',
    condition: '',
    workingPercentage: '',
    runtimeHours: '',
    remarks: '',
    proofImage: null
  });

  // Scrap Out form state
  const [scrapOutItems, setScrapOutItems] = useState([{ productCode: '', quantity: '' }]);
  const [scrapOutForm, setScrapOutForm] = useState({
    vendor: '',
    vehicleNumber: '',
    driverName: '',
    remarks: '',
    proofImage: null
  });

  // Handle Product Change in Scrap In
  const handleProductChange = (code) => {
    const product = AVAILABLE_PRODUCTS.find(p => p.code === code);
    setScrapInForm({
      ...scrapInForm,
      productCode: code,
      productName: product ? product.name : ''
    });
  };

  // Handle Scrap In Submit
  const handleScrapInSubmit = (e) => {
    e.preventDefault();

    if (!scrapInForm.productCode || !scrapInForm.quantity) {
      showToast('Please fill all required fields', 'error');
      return;
    }

    // Call the add function from parent
    const success = addScrapInRecord(scrapInForm);

    if (success) {
      // Reset form
      setScrapInForm({
        productCode: '',
        productName: '',
        fromPerson: '',
        plant: '',
        quantity: '',
        condition: '',
        workingPercentage: '',
        runtimeHours: '',
        remarks: '',
        proofImage: null
      });
      setShowScrapInModal(false);
      showToast('Scrap In entry created successfully', 'success');
    } else {
      showToast('Failed to create scrap in entry', 'error');
    }
  };

  // Handle Scrap Out Submit
  const handleScrapOutSubmit = (e) => {
    e.preventDefault();

    if (scrapOutItems.some(item => !item.productCode || !item.quantity)) {
      showToast('Please fill all product details', 'error');
      return;
    }

    if (!scrapOutForm.vendor) {
      showToast('Please select a vendor', 'error');
      return;
    }

    // Convert item IDs to product codes and add product names
    const itemsWithProducts = scrapOutItems.map(item => {
      const availItem = availableScrapItems.find(a => a.id === item.productCode);
      if (availItem) {
        return {
          productCode: availItem.productCode,
          productName: availItem.productName,
          quantity: item.quantity
        };
      }
      return item;
    });

    // Call the add function from parent
    const success = addScrapOutRecord(scrapOutForm, itemsWithProducts);

    if (success) {
      // Reset form
      setScrapOutItems([{ productCode: '', quantity: '' }]);
      setScrapOutForm({
        vendor: '',
        vehicleNumber: '',
        driverName: '',
        remarks: '',
        proofImage: null
      });
      setShowScrapOutModal(false);
      showToast('Scrap Out entry created successfully', 'success');
    } else {
      showToast('Failed to create scrap out entry', 'error');
    }
  };

  const addScrapOutItem = () => {
    setScrapOutItems([...scrapOutItems, { productCode: '', quantity: '' }]);
  };

  const removeScrapOutItem = (index) => {
    if (scrapOutItems.length > 1) {
      setScrapOutItems(scrapOutItems.filter((_, i) => i !== index));
    }
  };

  const updateScrapOutItem = (index, field, value) => {
    const newItems = [...scrapOutItems];
    newItems[index][field] = value;
    setScrapOutItems(newItems);
  };

  // Reset forms when modals close
  useEffect(() => {
    if (!showScrapInModal) {
      setScrapInForm({
        productCode: '',
        productName: '',
        fromPerson: '',
        plant: '',
        quantity: '',
        condition: '',
        workingPercentage: '',
        runtimeHours: '',
        remarks: '',
        proofImage: null
      });
    }
  }, [showScrapInModal]);

  useEffect(() => {
    if (!showScrapOutModal) {
      setScrapOutItems([{ productCode: '', quantity: '' }]);
      setScrapOutForm({
        vendor: '',
        vehicleNumber: '',
        driverName: '',
        remarks: '',
        proofImage: null
      });
    }
  }, [showScrapOutModal]);

  return (
    <>
      {/* View Scrap Details Modal */}
      {showDetailModal && selectedRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-[10000] p-5">
          <div className="bg-white rounded-xl shadow-2xl max-w-[700px] w-full max-h-[90vh] flex flex-col animate-slideUp">
            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 py-5 border-b-2 border-gray-200 bg-gradient-to-r from-cyan-50 to-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <i className="fas fa-info-circle text-blue-600 text-lg"></i>
                </div>
                <h3 className="text-lg font-bold text-gray-800">Scrap Details</h3>
              </div>
              <button
                onClick={() => setShowDetailModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-red-100 hover:text-red-600 transition-all hover:rotate-90"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1">
              <div className="grid grid-cols-2 gap-4">
                {/* Scrap ID */}
                <div className="bg-gray-50 p-3 rounded-lg border-l-4 border-teal-500">
                  <div className="text-[11px] text-gray-500 font-semibold uppercase tracking-wide mb-1">Scrap ID</div>
                  <div className="text-sm font-bold text-gray-800">{selectedRecord.id}</div>
                </div>

                {/* Type */}
                <div className="bg-gray-50 p-3 rounded-lg border-l-4 border-teal-500">
                  <div className="text-[11px] text-gray-500 font-semibold uppercase tracking-wide mb-1">Type</div>
                  <div className="text-sm font-bold" style={{ color: selectedRecord.type === 'Scrap In' ? '#3498DB' : '#d4a017' }}>
                    <i className={`fas fa-${selectedRecord.type === 'Scrap In' ? 'arrow-down' : 'arrow-up'} text-xs mr-1`}></i>
                    {selectedRecord.type}
                  </div>
                </div>

                {/* Product */}
                <div className="bg-gray-50 p-3 rounded-lg border-l-4 border-teal-500">
                  <div className="text-[11px] text-gray-500 font-semibold uppercase tracking-wide mb-1">Product</div>
                  <div className="text-sm font-bold text-gray-800">{selectedRecord.productName}</div>
                </div>

                {/* Product Code */}
                <div className="bg-gray-50 p-3 rounded-lg border-l-4 border-teal-500">
                  <div className="text-[11px] text-gray-500 font-semibold uppercase tracking-wide mb-1">Product Code</div>
                  <div className="text-sm font-bold text-gray-800">{selectedRecord.productCode}</div>
                </div>

                {/* Quantity */}
                <div className="bg-gray-50 p-3 rounded-lg border-l-4 border-teal-500">
                  <div className="text-[11px] text-gray-500 font-semibold uppercase tracking-wide mb-1">Quantity</div>
                  <div className="text-sm font-bold text-gray-800">{selectedRecord.quantity}</div>
                </div>

                {/* Condition */}
                <div className="bg-gray-50 p-3 rounded-lg border-l-4 border-teal-500">
                  <div className="text-[11px] text-gray-500 font-semibold uppercase tracking-wide mb-1">Condition</div>
                  <div className="text-sm font-bold text-gray-800">{selectedRecord.condition}</div>
                </div>

                {/* Working Percentage */}
                {selectedRecord.workingPercentage !== undefined && (
                  <div className="bg-gray-50 p-3 rounded-lg border-l-4 border-teal-500">
                    <div className="text-[11px] text-gray-500 font-semibold uppercase tracking-wide mb-1">Working Percentage</div>
                    <div className="text-sm font-bold text-gray-800">{selectedRecord.workingPercentage}%</div>
                  </div>
                )}

                {/* Runtime Hours */}
                {selectedRecord.runtimeHours && (
                  <div className="bg-gray-50 p-3 rounded-lg border-l-4 border-teal-500">
                    <div className="text-[11px] text-gray-500 font-semibold uppercase tracking-wide mb-1">Runtime Hours</div>
                    <div className="text-sm font-bold text-gray-800">{selectedRecord.runtimeHours} hrs</div>
                  </div>
                )}

                {/* From/To */}
                <div className="col-span-2 bg-gray-50 p-3 rounded-lg border-l-4 border-teal-500">
                  <div className="text-[11px] text-gray-500 font-semibold uppercase tracking-wide mb-1">
                    {selectedRecord.type === 'Scrap In' ? 'From Requester' : 'Disposal Vendor'}
                  </div>
                  <div className="text-sm font-bold text-gray-800">{selectedRecord.fromTo}</div>
                </div>

                {/* Plant */}
                {selectedRecord.plant && (
                  <div className="bg-gray-50 p-3 rounded-lg border-l-4 border-teal-500">
                    <div className="text-[11px] text-gray-500 font-semibold uppercase tracking-wide mb-1">Plant/Location</div>
                    <div className="text-sm font-bold text-gray-800">{selectedRecord.plant}</div>
                  </div>
                )}

                {/* Vehicle Number */}
                {selectedRecord.vehicleNumber && (
                  <div className="bg-gray-50 p-3 rounded-lg border-l-4 border-teal-500">
                    <div className="text-[11px] text-gray-500 font-semibold uppercase tracking-wide mb-1">Vehicle Number</div>
                    <div className="text-sm font-bold text-gray-800">{selectedRecord.vehicleNumber}</div>
                  </div>
                )}

                {/* Driver Name */}
                {selectedRecord.driverName && (
                  <div className="bg-gray-50 p-3 rounded-lg border-l-4 border-teal-500">
                    <div className="text-[11px] text-gray-500 font-semibold uppercase tracking-wide mb-1">Driver Name</div>
                    <div className="text-sm font-bold text-gray-800">{selectedRecord.driverName}</div>
                  </div>
                )}

                {/* Status */}
                <div className="bg-gray-50 p-3 rounded-lg border-l-4 border-teal-500">
                  <div className="text-[11px] text-gray-500 font-semibold uppercase tracking-wide mb-1">Status</div>
                  <div>
                    <span className={`inline-block px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wide ${
                      selectedRecord.status === 'In Warehouse'
                        ? 'bg-cyan-50 text-cyan-600 border border-cyan-200'
                        : 'bg-green-50 text-green-600 border border-green-200'
                    }`}>
                      {selectedRecord.status}
                    </span>
                  </div>
                </div>

                {/* Date */}
                <div className="bg-gray-50 p-3 rounded-lg border-l-4 border-teal-500">
                  <div className="text-[11px] text-gray-500 font-semibold uppercase tracking-wide mb-1">Date</div>
                  <div className="text-sm font-bold text-gray-800">{formatDate(selectedRecord.date)}</div>
                </div>

                {/* Received By */}
                {selectedRecord.receivedBy && (
                  <div className="col-span-2 bg-gray-50 p-3 rounded-lg border-l-4 border-teal-500">
                    <div className="text-[11px] text-gray-500 font-semibold uppercase tracking-wide mb-1">Received By</div>
                    <div className="text-sm font-bold text-gray-800">{selectedRecord.receivedBy}</div>
                  </div>
                )}

                {/* Remarks */}
                <div className="col-span-2 bg-gray-50 p-3 rounded-lg border-l-4 border-teal-500">
                  <div className="text-[11px] text-gray-500 font-semibold uppercase tracking-wide mb-1">Remarks</div>
                  <div className="text-sm font-bold text-gray-800">{selectedRecord.remarks || 'No remarks'}</div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-5 py-2 bg-gray-200 text-gray-700 rounded-md text-sm font-semibold hover:bg-gray-300 transition-all flex items-center gap-2"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Scrap In Modal */}
      {showScrapInModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-[10000] p-5">
          <div className="bg-white rounded-xl shadow-2xl max-w-[700px] w-full max-h-[90vh] flex flex-col animate-slideUp">
            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 py-5 border-b-2 border-gray-200 bg-gradient-to-r from-cyan-50 to-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <i className="fas fa-arrow-down text-blue-600 text-lg"></i>
                </div>
                <h3 className="text-lg font-bold text-gray-800">Scrap In Entry</h3>
              </div>
              <button
                onClick={() => setShowScrapInModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-red-100 hover:text-red-600 transition-all hover:rotate-90"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            {/* Modal Body */}
            {/* Modal Body */}
<form onSubmit={handleScrapInSubmit} className="p-6 overflow-y-auto flex-1">
  {/* Product and Quantity on same line */}
  <div className="mb-4">
    <label className="block text-xs font-semibold text-gray-700 mb-2">
      Product & Quantity <span className="text-red-600">*</span>
    </label>
    <div className="grid grid-cols-[1fr_auto] gap-3">
      <select
        value={scrapInForm.productCode}
        onChange={(e) => handleProductChange(e.target.value)}
        className="py-2 px-3 border-2 border-gray-200 rounded-md text-sm focus:outline-none focus:border-teal-400 focus:ring-4 focus:ring-cyan-100 transition-all"
        required
      >
        <option value="">Select Product</option>
        {AVAILABLE_PRODUCTS.map(p => (
          <option key={p.code} value={p.code}>{p.name} ({p.code})</option>
        ))}
      </select>
      <input
        type="number"
        value={scrapInForm.quantity}
        onChange={(e) => setScrapInForm({ ...scrapInForm, quantity: e.target.value })}
        placeholder="Qty"
        min="1"
        className="w-24 py-2 px-3 border-2 border-gray-200 rounded-md text-sm focus:outline-none focus:border-teal-400 focus:ring-4 focus:ring-cyan-100 transition-all"
        required
      />
    </div>
  </div>

  <div className="grid grid-cols-2 gap-4 mb-4">
    {/* From Requester */}
    <div>
      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
        From Person/Department <span className="text-red-600">*</span>
      </label>
      <input
        type="text"
        value={scrapInForm.fromPerson}
        onChange={(e) => setScrapInForm({ ...scrapInForm, fromPerson: e.target.value })}
        placeholder="Enter name or department"
        className="w-full py-2 px-3 border-2 border-gray-200 rounded-md text-sm focus:outline-none focus:border-teal-400 focus:ring-4 focus:ring-cyan-100 transition-all"
        required
      />
    </div>

    {/* Plant/Location */}
    <div>
      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
        Plant/Location <span className="text-red-600">*</span>
      </label>
      <select
        value={scrapInForm.plant}
        onChange={(e) => setScrapInForm({ ...scrapInForm, plant: e.target.value })}
        className="w-full py-2 px-3 border-2 border-gray-200 rounded-md text-sm focus:outline-none focus:border-teal-400 focus:ring-4 focus:ring-cyan-100 transition-all"
        required
      >
        <option value="">Select Plant</option>
        {AVAILABLE_PLANTS.map(plant => (
          <option key={plant} value={plant}>{plant}</option>
        ))}
      </select>
    </div>

    {/* Condition */}
    <div>
      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
        Condition/Reason <span className="text-red-600">*</span>
      </label>
      <select
        value={scrapInForm.condition}
        onChange={(e) => setScrapInForm({ ...scrapInForm, condition: e.target.value })}
        className="w-full py-2 px-3 border-2 border-gray-200 rounded-md text-sm focus:outline-none focus:border-teal-400 focus:ring-4 focus:ring-cyan-100 transition-all"
        required
      >
        <option value="">Select Condition</option>
        <option value="Broken">Broken</option>
        <option value="Expired">Expired</option>
        <option value="Damaged">Damaged</option>
        <option value="Worn Out">Worn Out</option>
        <option value="Defective">Defective</option>
      </select>
    </div>

    {/* Working Percentage */}
    <div>
      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
        Working Percentage <span className="text-red-600">*</span>
      </label>
      <input
        type="number"
        value={scrapInForm.workingPercentage}
        onChange={(e) => setScrapInForm({ ...scrapInForm, workingPercentage: e.target.value })}
        placeholder="0-100"
        min="0"
        max="100"
        className="w-full py-2 px-3 border-2 border-gray-200 rounded-md text-sm focus:outline-none focus:border-teal-400 focus:ring-4 focus:ring-cyan-100 transition-all"
        required
      />
    </div>
  </div>

  {/* Runtime Hours */}
  <div className="mb-4">
    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Runtime Hours (if applicable)</label>
    <input
      type="number"
      value={scrapInForm.runtimeHours}
      onChange={(e) => setScrapInForm({ ...scrapInForm, runtimeHours: e.target.value })}
      placeholder="Enter runtime hours"
      min="0"
      className="w-full py-2 px-3 border-2 border-gray-200 rounded-md text-sm focus:outline-none focus:border-teal-400 focus:ring-4 focus:ring-cyan-100 transition-all"
    />
  </div>

  {/* Remarks */}
  <div className="mb-4">
    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Remarks</label>
    <textarea
      value={scrapInForm.remarks}
      onChange={(e) => setScrapInForm({ ...scrapInForm, remarks: e.target.value })}
      rows="3"
      placeholder="Enter additional remarks..."
      className="w-full py-2 px-3 border-2 border-gray-200 rounded-md text-sm focus:outline-none focus:border-teal-400 focus:ring-4 focus:ring-cyan-100 transition-all resize-none"
    ></textarea>
  </div>

  {/* Upload Proof Image */}
  <div className="mb-4">
    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Upload Proof Image</label>
    <input
      type="file"
      accept="image/*"
      onChange={(e) => setScrapInForm({ ...scrapInForm, proofImage: e.target.files[0] })}
      className="w-full py-2 px-3 border-2 border-gray-200 rounded-md text-sm focus:outline-none focus:border-teal-400 transition-all"
    />
  </div>

  {/* Modal Footer */}
  <div className="flex gap-3 pt-4 border-t border-gray-200">
    <button
      type="button"
      onClick={() => setShowScrapInModal(false)}
      className="flex-1 px-4 py-2.5 bg-gray-200 text-gray-700 rounded-md text-sm font-semibold hover:bg-gray-300 transition-all"
    >
      Cancel
    </button>
    <button
      type="submit"
      className="flex-1 px-4 py-2.5 bg-gradient-to-r from-teal-400 to-teal-700 text-white rounded-md text-sm font-semibold hover:-translate-y-0.5 hover:shadow-lg transition-all flex items-center justify-center gap-2"
    >
      <i className="fas fa-save"></i>
      Save Scrap In Entry
    </button>
  </div>
</form>

          </div>
        </div>
      )}

      {/* Scrap Out Modal */}
      {showScrapOutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-[10000] p-5">
          <div className="bg-white rounded-xl shadow-2xl max-w-[700px] w-full max-h-[90vh] flex flex-col animate-slideUp">
            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 py-5 border-b-2 border-gray-200 bg-gradient-to-r from-cyan-50 to-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                  <i className="fas fa-arrow-up text-yellow-600 text-lg"></i>
                </div>
                <h3 className="text-lg font-bold text-gray-800">Scrap Out Entry</h3>
              </div>
              <button
                onClick={() => setShowScrapOutModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-red-100 hover:text-red-600 transition-all hover:rotate-90"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleScrapOutSubmit} className="p-6 overflow-y-auto flex-1">
              {/* Scrap Disposal Vendor */}
              <div className="mb-4">
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Scrap Disposal Vendor <span className="text-red-600">*</span>
                </label>
                <select
                  value={scrapOutForm.vendor}
                  onChange={(e) => setScrapOutForm({ ...scrapOutForm, vendor: e.target.value })}
                  className="w-full py-2 px-3 border-2 border-gray-200 rounded-md text-sm focus:outline-none focus:border-teal-400 focus:ring-4 focus:ring-cyan-100 transition-all"
                  required
                >
                  <option value="">Select Vendor</option>
                  {AVAILABLE_VENDORS.map(v => (
                    <option key={v.id} value={v.id}>{v.name}</option>
                  ))}
                </select>
              </div>

              {/* Select Scrap Items */}
              <div className="mb-4">
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  Select Scrap Items <span className="text-red-600">*</span>
                </label>
                <div className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50 max-h-[200px] overflow-y-auto mb-3">
                  {scrapOutItems.map((item, index) => (
                    <div key={index} className="grid grid-cols-[1fr_auto_auto] gap-3 items-center mb-3 last:mb-0 bg-white p-3 rounded-lg border border-gray-200">
                      <select
                        value={item.productCode}
                        onChange={(e) => updateScrapOutItem(index, 'productCode', e.target.value)}
                        className="py-2 px-3 border-2 border-gray-200 rounded-md text-sm focus:outline-none focus:border-teal-400 focus:ring-4 focus:ring-cyan-100 transition-all"
                        required
                      >
                        <option value="">Select Product</option>
                        {availableScrapItems.map(availItem => (
                          <option key={availItem.id} value={availItem.id}>
                            {availItem.productName} ({availItem.productCode}) - Available: {availItem.quantity}
                          </option>
                        ))}
                      </select>
                      <input
                        type="number"
                        placeholder="Qty"
                        value={item.quantity}
                        onChange={(e) => updateScrapOutItem(index, 'quantity', e.target.value)}
                        className="w-20 py-2 px-3 border-2 border-gray-200 rounded-md text-sm focus:outline-none focus:border-teal-400 focus:ring-4 focus:ring-cyan-100 transition-all"
                        min="1"
                        required
                      />
                      {scrapOutItems.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeScrapOutItem(index)}
                          className="w-9 h-9 flex items-center justify-center bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-all"
                          title="Remove item"
                        >
                          <i className="fas fa-times text-sm"></i>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addScrapOutItem}
                  className="w-full px-4 py-2 bg-cyan-50 text-teal-600 border-2 border-dashed border-teal-400 rounded-md text-sm font-semibold hover:bg-teal-500 hover:text-white hover:border-solid transition-all flex items-center justify-center gap-2"
                >
                  <i className="fas fa-plus"></i>
                  Add Item
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                {/* Vehicle Number */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Vehicle Number <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={scrapOutForm.vehicleNumber}
                    onChange={(e) => setScrapOutForm({ ...scrapOutForm, vehicleNumber: e.target.value })}
                    placeholder="TN01AB1234"
                    className="w-full py-2 px-3 border-2 border-gray-200 rounded-md text-sm focus:outline-none focus:border-teal-400 focus:ring-4 focus:ring-cyan-100 transition-all"
                    required
                  />
                </div>

                {/* Driver Name */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Driver Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={scrapOutForm.driverName}
                    onChange={(e) => setScrapOutForm({ ...scrapOutForm, driverName: e.target.value })}
                    placeholder="Enter driver name"
                    className="w-full py-2 px-3 border-2 border-gray-200 rounded-md text-sm focus:outline-none focus:border-teal-400 focus:ring-4 focus:ring-cyan-100 transition-all"
                    required
                  />
                </div>
              </div>

              {/* Remarks */}
              <div className="mb-4">
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Remarks</label>
                <textarea
                  value={scrapOutForm.remarks}
                  onChange={(e) => setScrapOutForm({ ...scrapOutForm, remarks: e.target.value })}
                  rows="3"
                  placeholder="Enter remarks..."
                  className="w-full py-2 px-3 border-2 border-gray-200 rounded-md text-sm focus:outline-none focus:border-teal-400 focus:ring-4 focus:ring-cyan-100 transition-all resize-none"
                ></textarea>
              </div>

              {/* Upload Proof Document/Image */}
              <div className="mb-4">
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Upload Proof Document/Image
                </label>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={(e) => setScrapOutForm({ ...scrapOutForm, proofImage: e.target.files[0] })}
                  className="w-full py-2 px-3 border-2 border-gray-200 rounded-md text-sm focus:outline-none focus:border-teal-400 transition-all"
                />
              </div>

              {/* Modal Footer */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowScrapOutModal(false)}
                  className="flex-1 px-4 py-2.5 bg-gray-200 text-gray-700 rounded-md text-sm font-semibold hover:bg-gray-300 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-teal-400 to-teal-700 text-white rounded-md text-sm font-semibold hover:-translate-y-0.5 hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <i className="fas fa-check"></i>
                  Process Scrap Out
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-[10000] p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full animate-slideUp">
            <div className="px-6 py-5 border-b-2 border-gray-200 bg-gradient-to-r from-red-50 to-orange-50 flex items-center gap-3">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                confirmConfig.type === 'error' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'
              }`}>
                <i className={`fas ${confirmConfig.type === 'error' ? 'fa-exclamation-circle' : 'fa-exclamation-triangle'} text-2xl`}></i>
              </div>
              <h3 className="text-lg font-bold text-gray-800">{confirmConfig.title}</h3>
            </div>

            <div className="p-6">
              <p className="text-sm text-gray-600 leading-relaxed">{confirmConfig.message}</p>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t-2 border-gray-200 flex gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 px-4 py-2.5 bg-white border-2 border-gray-200 text-gray-700 rounded-md text-sm font-semibold hover:bg-gray-100 transition-all flex items-center justify-center gap-2"
              >
                <i className="fas fa-times"></i>
                Cancel
              </button>
              <button
                onClick={() => {
                  confirmConfig.onConfirm?.();
                  setShowConfirmModal(false);
                }}
                className={`flex-1 px-4 py-2.5 rounded-md text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                  confirmConfig.isDanger
                    ? 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:-translate-y-0.5 hover:shadow-lg'
                    : 'bg-gradient-to-r from-teal-400 to-teal-700 text-white hover:-translate-y-0.5 hover:shadow-lg'
                }`}
              >
                <i className="fas fa-check"></i>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ScrapModals;
