// src/pages/MaintenanceModals.jsx
import React, { useState, useEffect } from 'react';

const MaintenanceModals = ({
  showDetailModal,
  setShowDetailModal,
  showExternalModal,
  setShowExternalModal,
  showInternalModal,
  setShowInternalModal,
  showReturnModal,
  setShowReturnModal,
  showRatingModal,
  setShowRatingModal,
  showConversationModal,
  setShowConversationModal,
  selectedRecord,
  products,
  formatDate,
  showToast,
  maintenanceRecords,
  setMaintenanceRecords
}) => {
  // External Service Form State
  const [externalForm, setExternalForm] = useState({
    vendor: '',
    maintenanceType: '',
    expectedReturnDate: '',
    serviceCost: '',
    vehicleDetails: '',
    remarks: '',
    proofImage: null
  });

  // Internal Service Form State
  const [internalForm, setInternalForm] = useState({
    servicePerson: '',
    contactNumber: '',
    department: '',
    maintenanceType: '',
    expectedReturnDate: '',
    serviceCost: '',
    vehicleDetails: '',
    remarks: '',
    proofImage: null
  });

  // Product items state
  const [productItems, setProductItems] = useState([{ product: '', quantity: '' }]);

  // Return form state with rating
  const [returnForm, setReturnForm] = useState({
    returnStatus: '',
    finalCost: '',
    rating: 0,
    remarks: ''
  });

  // Conversation state
  const [conversationMessage, setConversationMessage] = useState('');
  const [conversationHistory, setConversationHistory] = useState([]);

  const addProductItem = () => {
    setProductItems([...productItems, { product: '', quantity: '' }]);
  };

  const removeProductItem = (index) => {
    if (productItems.length > 1) {
      setProductItems(productItems.filter((_, i) => i !== index));
    }
  };

  const updateProductItem = (index, field, value) => {
    const newItems = [...productItems];
    newItems[index][field] = value;
    setProductItems(newItems);
  };

  const generateSONumber = () => {
    const year = new Date().getFullYear();
    const lastRecord = maintenanceRecords[0];
    const lastNumber = lastRecord ? parseInt(lastRecord.soNumber.split('-')[2]) : 0;
    return `SO-${year}-${String(lastNumber + 1).padStart(3, '0')}`;
  };

  const generateMNTNumber = () => {
    const year = new Date().getFullYear();
    const lastRecord = maintenanceRecords[0];
    const lastNumber = lastRecord ? parseInt(lastRecord.id.split('-')[2]) : 0;
    return `MNT-${year}-${String(lastNumber + 1).padStart(3, '0')}`;
  };

  const handleExternalSubmit = (e) => {
    e.preventDefault();

    if (productItems.some(item => !item.product || !item.quantity)) {
      showToast('Please fill all product details', 'error');
      return;
    }

    const selectedProduct = products.find(p => p.code === productItems[0].product);
    const vendorNames = {
      'VND-001': 'FixIt Engineers Pvt Ltd',
      'VND-002': 'TechCare Services',
      'VND-003': 'Industrial Repairs Co',
      'VND-004': 'ProMaintain Solutions'
    };

    const newRecord = {
      id: generateMNTNumber(),
      soNumber: generateSONumber(),
      type: 'External',
      productName: selectedProduct.name,
      productCode: selectedProduct.code,
      quantity: parseInt(productItems[0].quantity),
      serviceProvider: vendorNames[externalForm.vendor] || externalForm.vendor,
      vendorContact: '+91 98765 43210',
      maintenanceType: externalForm.maintenanceType,
      sentDate: new Date().toISOString().split('T')[0],
      expectedReturnDate: externalForm.expectedReturnDate,
      estimatedCost: parseFloat(externalForm.serviceCost),
      finalCost: null,
      status: 'Pending',
      remarks: externalForm.remarks,
      vehicleDetails: externalForm.vehicleDetails,
      createdBy: 'Kumar - Storekeeper',
      rating: null,
      proofImage: externalForm.proofImage?.name || null,
      conversations: []
    };

    setMaintenanceRecords([newRecord, ...maintenanceRecords]);
    
    setExternalForm({
      vendor: '',
      maintenanceType: '',
      expectedReturnDate: '',
      serviceCost: '',
      vehicleDetails: '',
      remarks: '',
      proofImage: null
    });
    setProductItems([{ product: '', quantity: '' }]);
    setShowExternalModal(false);
    showToast('External service order created successfully', 'success');
  };

  const handleInternalSubmit = (e) => {
    e.preventDefault();

    if (productItems.some(item => !item.product || !item.quantity)) {
      showToast('Please fill all product details', 'error');
      return;
    }

    const selectedProduct = products.find(p => p.code === productItems[0].product);

    const newRecord = {
      id: generateMNTNumber(),
      soNumber: generateSONumber(),
      type: 'Internal',
      productName: selectedProduct.name,
      productCode: selectedProduct.code,
      quantity: parseInt(productItems[0].quantity),
      serviceProvider: `${internalForm.servicePerson} - ${internalForm.department}`,
      vendorContact: internalForm.contactNumber,
      maintenanceType: internalForm.maintenanceType,
      sentDate: new Date().toISOString().split('T')[0],
      expectedReturnDate: internalForm.expectedReturnDate,
      estimatedCost: parseFloat(internalForm.serviceCost),
      finalCost: null,
      status: 'Pending',
      remarks: internalForm.remarks,
      vehicleDetails: internalForm.vehicleDetails,
      createdBy: 'Kumar - Storekeeper',
      rating: null,
      proofImage: internalForm.proofImage?.name || null,
      conversations: []
    };

    setMaintenanceRecords([newRecord, ...maintenanceRecords]);
    
    setInternalForm({
      servicePerson: '',
      contactNumber: '',
      department: '',
      maintenanceType: '',
      expectedReturnDate: '',
      serviceCost: '',
      vehicleDetails: '',
      remarks: '',
      proofImage: null
    });
    setProductItems([{ product: '', quantity: '' }]);
    setShowInternalModal(false);
    showToast('Internal service order created successfully', 'success');
  };

  const handleReturnSubmit = (e) => {
    e.preventDefault();

    if (!returnForm.returnStatus) {
      showToast('Please select return status', 'error');
      return;
    }

    if (returnForm.returnStatus === 'repaired' && returnForm.rating === 0) {
      showToast('Please rate the service', 'error');
      return;
    }

    const updatedRecords = maintenanceRecords.map(r => {
      if (r.id === selectedRecord.id) {
        if (returnForm.returnStatus === 'not-repairable') {
          return {
            ...r,
            status: 'Cancelled',
            cancelReason: 'Not repairable - moved to scrap management',
            remarks: returnForm.remarks || r.remarks
          };
        } else {
          return {
            ...r,
            status: 'Completed',
            finalCost: parseFloat(returnForm.finalCost),
            returnDate: new Date().toISOString().split('T')[0],
            rating: returnForm.rating,
            ratingRemarks: returnForm.remarks,
            remarks: returnForm.remarks || r.remarks
          };
        }
      }
      return r;
    });

    setMaintenanceRecords(updatedRecords);
    setReturnForm({
      returnStatus: '',
      finalCost: '',
      rating: 0,
      remarks: ''
    });
    setShowReturnModal(false);
    
    if (returnForm.returnStatus === 'not-repairable') {
      showToast('Item marked as not repairable and moved to scrap', 'warning');
    } else {
      showToast('Item marked as repaired successfully', 'success');
    }
  };

  const handleSendMessage = () => {
    if (conversationMessage.trim()) {
      const newMessage = {
        user: 'Kumar - Storekeeper',
        timestamp: new Date().toLocaleString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        }),
        message: conversationMessage.trim()
      };

      // Update conversation history
      setConversationHistory([...conversationHistory, newMessage]);

      // Update the record's conversations
      const updatedRecords = maintenanceRecords.map(r => {
        if (r.id === selectedRecord.id) {
          return {
            ...r,
            conversations: [...(r.conversations || []), newMessage]
          };
        }
        return r;
      });

      setMaintenanceRecords(updatedRecords);
      showToast('Message sent successfully', 'success');
      setConversationMessage('');
    }
  };

  useEffect(() => {
    if (showReturnModal && selectedRecord) {
      setReturnForm({
        returnStatus: '',
        finalCost: selectedRecord.estimatedCost || '',
        rating: 0,
        remarks: ''
      });
    }
  }, [showReturnModal, selectedRecord]);

  useEffect(() => {
    if (showConversationModal && selectedRecord) {
      // Load conversation history
      setConversationHistory(selectedRecord.conversations || []);
    }
  }, [showConversationModal, selectedRecord]);

  return (
    <>
      {/* View Details Modal */}
      {showDetailModal && selectedRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-[10000] p-5">
          <div className="bg-white rounded-xl shadow-2xl max-w-[700px] w-full max-h-[90vh] flex flex-col animate-slideUp">
            <div className="flex justify-between items-center px-6 py-5 border-b-2 border-gray-200 bg-gradient-to-r from-cyan-50 to-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <i className="fas fa-info-circle text-blue-600 text-lg"></i>
                </div>
                <h3 className="text-lg font-bold text-gray-800">Maintenance Details</h3>
              </div>
              <button
                onClick={() => setShowDetailModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-red-100 hover:text-red-600 transition-all hover:rotate-90"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg border-l-4 border-teal-500">
                  <div className="text-[11px] text-gray-500 font-semibold uppercase tracking-wide mb-1">SO Number</div>
                  <div className="text-sm font-bold text-gray-800">{selectedRecord.soNumber}</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg border-l-4 border-teal-500">
                  <div className="text-[11px] text-gray-500 font-semibold uppercase tracking-wide mb-1">Service Type</div>
                  <div className="text-sm font-bold" style={{ color: selectedRecord.type === 'External' ? '#3498DB' : '#00B894' }}>
                    <i className={`fas fa-${selectedRecord.type === 'External' ? 'external-link-alt' : 'home'} text-xs mr-1`}></i>
                    {selectedRecord.type}
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg border-l-4 border-teal-500">
                  <div className="text-[11px] text-gray-500 font-semibold uppercase tracking-wide mb-1">Product</div>
                  <div className="text-sm font-bold text-gray-800">{selectedRecord.productName}</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg border-l-4 border-teal-500">
                  <div className="text-[11px] text-gray-500 font-semibold uppercase tracking-wide mb-1">Product Code</div>
                  <div className="text-sm font-bold text-gray-800">{selectedRecord.productCode}</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg border-l-4 border-teal-500">
                  <div className="text-[11px] text-gray-500 font-semibold uppercase tracking-wide mb-1">Quantity</div>
                  <div className="text-sm font-bold text-gray-800">{selectedRecord.quantity}</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg border-l-4 border-teal-500">
                  <div className="text-[11px] text-gray-500 font-semibold uppercase tracking-wide mb-1">Maintenance Type</div>
                  <div className="text-sm font-bold text-gray-800">{selectedRecord.maintenanceType}</div>
                </div>
                <div className="col-span-2 bg-gray-50 p-3 rounded-lg border-l-4 border-teal-500">
                  <div className="text-[11px] text-gray-500 font-semibold uppercase tracking-wide mb-1">Service Provider</div>
                  <div className="text-sm font-bold text-gray-800">{selectedRecord.serviceProvider}</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg border-l-4 border-teal-500">
                  <div className="text-[11px] text-gray-500 font-semibold uppercase tracking-wide mb-1">Sent Date</div>
                  <div className="text-sm font-bold text-gray-800">{formatDate(selectedRecord.sentDate)}</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg border-l-4 border-teal-500">
                  <div className="text-[11px] text-gray-500 font-semibold uppercase tracking-wide mb-1">Expected Return</div>
                  <div className="text-sm font-bold text-gray-800">{formatDate(selectedRecord.expectedReturnDate)}</div>
                </div>
                {selectedRecord.returnDate && (
                  <div className="bg-gray-50 p-3 rounded-lg border-l-4 border-teal-500">
                    <div className="text-[11px] text-gray-500 font-semibold uppercase tracking-wide mb-1">Actual Return Date</div>
                    <div className="text-sm font-bold text-gray-800">{formatDate(selectedRecord.returnDate)}</div>
                  </div>
                )}
                <div className="bg-gray-50 p-3 rounded-lg border-l-4 border-teal-500">
                  <div className="text-[11px] text-gray-500 font-semibold uppercase tracking-wide mb-1">Estimated Cost</div>
                  <div className="text-sm font-bold text-gray-800">₹{(selectedRecord.estimatedCost ?? 0).toLocaleString()}</div>
                </div>
                {selectedRecord.finalCost && (
                  <div className="bg-gray-50 p-3 rounded-lg border-l-4 border-green-500">
                    <div className="text-[11px] text-gray-500 font-semibold uppercase tracking-wide mb-1">Final Cost</div>
                    <div className="text-sm font-bold text-green-600">₹{selectedRecord.finalCost.toLocaleString()}</div>
                  </div>
                )}
                <div className="bg-gray-50 p-3 rounded-lg border-l-4 border-teal-500">
                  <div className="text-[11px] text-gray-500 font-semibold uppercase tracking-wide mb-1">Status</div>
                  <div>
                    <span className={`inline-block px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wide ${
                      selectedRecord.status === 'Pending' ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' :
                      selectedRecord.status === 'In Progress' ? 'bg-blue-50 text-blue-600 border border-blue-200' :
                      selectedRecord.status === 'Completed' ? 'bg-green-50 text-green-600 border border-green-200' :
                      'bg-red-50 text-red-600 border border-red-200'
                    }`}>
                      {selectedRecord.status}
                    </span>
                  </div>
                </div>
                {selectedRecord.rating && (
                  <div className="bg-gray-50 p-3 rounded-lg border-l-4 border-yellow-500">
                    <div className="text-[11px] text-gray-500 font-semibold uppercase tracking-wide mb-1">Rating</div>
                    <div className="text-sm font-bold text-yellow-600">
                      {'★'.repeat(selectedRecord.rating)}{'☆'.repeat(5 - selectedRecord.rating)}
                    </div>
                  </div>
                )}
                {selectedRecord.vehicleDetails && (
                  <div className="col-span-2 bg-gray-50 p-3 rounded-lg border-l-4 border-teal-500">
                    <div className="text-[11px] text-gray-500 font-semibold uppercase tracking-wide mb-1">Vehicle/Person Details</div>
                    <div className="text-sm font-bold text-gray-800">{selectedRecord.vehicleDetails}</div>
                  </div>
                )}
                <div className="col-span-2 bg-gray-50 p-3 rounded-lg border-l-4 border-teal-500">
                  <div className="text-[11px] text-gray-500 font-semibold uppercase tracking-wide mb-1">Remarks</div>
                  <div className="text-sm font-bold text-gray-800">{selectedRecord.remarks}</div>
                </div>
                {selectedRecord.ratingRemarks && (
                  <div className="col-span-2 bg-gray-50 p-3 rounded-lg border-l-4 border-green-500">
                    <div className="text-[11px] text-gray-500 font-semibold uppercase tracking-wide mb-1">Service Feedback</div>
                    <div className="text-sm font-bold text-gray-800">{selectedRecord.ratingRemarks}</div>
                  </div>
                )}
                {selectedRecord.cancelReason && (
                  <div className="col-span-2 bg-gray-50 p-3 rounded-lg border-l-4 border-red-500">
                    <div className="text-[11px] text-gray-500 font-semibold uppercase tracking-wide mb-1">Cancellation Reason</div>
                    <div className="text-sm font-bold text-gray-800">{selectedRecord.cancelReason}</div>
                  </div>
                )}
                <div className="bg-gray-50 p-3 rounded-lg border-l-4 border-teal-500">
                  <div className="text-[11px] text-gray-500 font-semibold uppercase tracking-wide mb-1">Created By</div>
                  <div className="text-sm font-bold text-gray-800">{selectedRecord.createdBy}</div>
                </div>
              </div>
            </div>

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

      {/* External Service Modal - Same as before */}
      {showExternalModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-[10000] p-5">
          <div className="bg-white rounded-xl shadow-2xl max-w-[700px] w-full max-h-[90vh] flex flex-col animate-slideUp">
            <div className="flex justify-between items-center px-6 py-5 border-b-2 border-gray-200 bg-gradient-to-r from-cyan-50 to-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <i className="fas fa-external-link-alt text-blue-600 text-lg"></i>
                </div>
                <h3 className="text-lg font-bold text-gray-800">Create External Service Order</h3>
              </div>
              <button
                onClick={() => setShowExternalModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-red-100 hover:text-red-600 transition-all hover:rotate-90"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <form onSubmit={handleExternalSubmit} className="p-6 overflow-y-auto flex-1">
              <div className="mb-4">
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  Select Products <span className="text-red-600">*</span>
                </label>
                <div className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50 max-h-[200px] overflow-y-auto mb-3">
                  {productItems.map((item, index) => (
                    <div key={index} className="grid grid-cols-[1fr_auto_auto] gap-3 items-center mb-3 last:mb-0 bg-white p-3 rounded-lg border border-gray-200">
                      <select
                        value={item.product}
                        onChange={(e) => updateProductItem(index, 'product', e.target.value)}
                        className="py-2 px-3 border-2 border-gray-200 rounded-md text-sm focus:outline-none focus:border-teal-400 focus:ring-4 focus:ring-cyan-100 transition-all"
                        required
                      >
                        <option value="">Select Product</option>
                        {products.map(p => (
                          <option key={p.code} value={p.code}>
                            {p.name} ({p.code}) - Stock: {p.currentStock}
                          </option>
                        ))}
                      </select>
                      <input
                        type="number"
                        placeholder="Qty"
                        value={item.quantity}
                        onChange={(e) => updateProductItem(index, 'quantity', e.target.value)}
                        className="w-20 py-2 px-3 border-2 border-gray-200 rounded-md text-sm focus:outline-none focus:border-teal-400 focus:ring-4 focus:ring-cyan-100 transition-all"
                        min="1"
                        required
                      />
                      {productItems.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeProductItem(index)}
                          className="w-9 h-9 flex items-center justify-center bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-all"
                          title="Remove product"
                        >
                          <i className="fas fa-times text-sm"></i>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addProductItem}
                  className="w-full px-4 py-2 bg-cyan-50 text-teal-600 border-2 border-dashed border-teal-400 rounded-md text-sm font-semibold hover:bg-teal-500 hover:text-white hover:border-solid transition-all flex items-center justify-center gap-2"
                >
                  <i className="fas fa-plus"></i>
                  Add Product
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Service Vendor <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={externalForm.vendor}
                    onChange={(e) => setExternalForm({ ...externalForm, vendor: e.target.value })}
                    className="w-full py-2 px-3 border-2 border-gray-200 rounded-md text-sm focus:outline-none focus:border-teal-400 focus:ring-4 focus:ring-cyan-100 transition-all"
                    required
                  >
                    <option value="">Select Vendor</option>
                    <option value="VND-001">FixIt Engineers Pvt Ltd</option>
                    <option value="VND-002">TechCare Services</option>
                    <option value="VND-003">Industrial Repairs Co</option>
                    <option value="VND-004">ProMaintain Solutions</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Maintenance Type <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={externalForm.maintenanceType}
                    onChange={(e) => setExternalForm({ ...externalForm, maintenanceType: e.target.value })}
                    className="w-full py-2 px-3 border-2 border-gray-200 rounded-md text-sm focus:outline-none focus:border-teal-400 focus:ring-4 focus:ring-cyan-100 transition-all"
                    required
                  >
                    <option value="">Select Type</option>
                    <option value="Preventive">Preventive</option>
                    <option value="Corrective">Corrective</option>
                    <option value="Emergency">Emergency</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Expected Return Date <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="date"
                    value={externalForm.expectedReturnDate}
                    onChange={(e) => setExternalForm({ ...externalForm, expectedReturnDate: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full py-2 px-3 border-2 border-gray-200 rounded-md text-sm focus:outline-none focus:border-teal-400 focus:ring-4 focus:ring-cyan-100 transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Estimated Service Cost <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="number"
                    value={externalForm.serviceCost}
                    onChange={(e) => setExternalForm({ ...externalForm, serviceCost: e.target.value })}
                    placeholder="Enter cost"
                    min="0"
                    className="w-full py-2 px-3 border-2 border-gray-200 rounded-md text-sm focus:outline-none focus:border-teal-400 focus:ring-4 focus:ring-cyan-100 transition-all"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Vehicle Details</label>
                <input
                  type="text"
                  value={externalForm.vehicleDetails}
                  onChange={(e) => setExternalForm({ ...externalForm, vehicleDetails: e.target.value })}
                  placeholder="Enter vehicle number or transport details"
                  className="w-full py-2 px-3 border-2 border-gray-200 rounded-md text-sm focus:outline-none focus:border-teal-400 focus:ring-4 focus:ring-cyan-100 transition-all"
                />
              </div>

              <div className="mb-4">
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Remarks</label>
                <textarea
                  value={externalForm.remarks}
                  onChange={(e) => setExternalForm({ ...externalForm, remarks: e.target.value })}
                  rows="3"
                  placeholder="Enter any additional remarks..."
                  className="w-full py-2 px-3 border-2 border-gray-200 rounded-md text-sm focus:outline-none focus:border-teal-400 focus:ring-4 focus:ring-cyan-100 transition-all resize-none"
                ></textarea>
              </div>

              <div className="mb-4">
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Upload Proof Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setExternalForm({ ...externalForm, proofImage: e.target.files[0] })}
                  className="w-full py-2 px-3 border-2 border-gray-200 rounded-md text-sm focus:outline-none focus:border-teal-400 transition-all"
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowExternalModal(false)}
                  className="flex-1 px-4 py-2.5 bg-gray-200 text-gray-700 rounded-md text-sm font-semibold hover:bg-gray-300 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-md text-sm font-semibold hover:-translate-y-0.5 hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <i className="fas fa-save"></i>
                  Create Service Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Internal Service Modal - Same as External */}
      {showInternalModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-[10000] p-5">
          <div className="bg-white rounded-xl shadow-2xl max-w-[700px] w-full max-h-[90vh] flex flex-col animate-slideUp">
            <div className="flex justify-between items-center px-6 py-5 border-b-2 border-gray-200 bg-gradient-to-r from-cyan-50 to-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <i className="fas fa-home text-green-600 text-lg"></i>
                </div>
                <h3 className="text-lg font-bold text-gray-800">Create Internal Service Order</h3>
              </div>
              <button
                onClick={() => setShowInternalModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-red-100 hover:text-red-600 transition-all hover:rotate-90"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <form onSubmit={handleInternalSubmit} className="p-6 overflow-y-auto flex-1">
              <div className="mb-4">
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  Select Products <span className="text-red-600">*</span>
                </label>
                <div className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50 max-h-[200px] overflow-y-auto mb-3">
                  {productItems.map((item, index) => (
                    <div key={index} className="grid grid-cols-[1fr_auto_auto] gap-3 items-center mb-3 last:mb-0 bg-white p-3 rounded-lg border border-gray-200">
                      <select
                        value={item.product}
                        onChange={(e) => updateProductItem(index, 'product', e.target.value)}
                        className="py-2 px-3 border-2 border-gray-200 rounded-md text-sm focus:outline-none focus:border-teal-400 focus:ring-4 focus:ring-cyan-100 transition-all"
                        required
                      >
                        <option value="">Select Product</option>
                        {products.map(p => (
                          <option key={p.code} value={p.code}>
                            {p.name} ({p.code}) - Stock: {p.currentStock}
                          </option>
                        ))}
                      </select>
                      <input
                        type="number"
                        placeholder="Qty"
                        value={item.quantity}
                        onChange={(e) => updateProductItem(index, 'quantity', e.target.value)}
                        className="w-20 py-2 px-3 border-2 border-gray-200 rounded-md text-sm focus:outline-none focus:border-teal-400 focus:ring-4 focus:ring-cyan-100 transition-all"
                        min="1"
                        required
                      />
                      {productItems.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeProductItem(index)}
                          className="w-9 h-9 flex items-center justify-center bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-all"
                          title="Remove product"
                        >
                          <i className="fas fa-times text-sm"></i>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addProductItem}
                  className="w-full px-4 py-2 bg-cyan-50 text-teal-600 border-2 border-dashed border-teal-400 rounded-md text-sm font-semibold hover:bg-teal-500 hover:text-white hover:border-solid transition-all flex items-center justify-center gap-2"
                >
                  <i className="fas fa-plus"></i>
                  Add Product
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Service Person Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={internalForm.servicePerson}
                    onChange={(e) => setInternalForm({ ...internalForm, servicePerson: e.target.value })}
                    placeholder="Enter person name"
                    className="w-full py-2 px-3 border-2 border-gray-200 rounded-md text-sm focus:outline-none focus:border-teal-400 focus:ring-4 focus:ring-cyan-100 transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Contact Number <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="tel"
                    value={internalForm.contactNumber}
                    onChange={(e) => setInternalForm({ ...internalForm, contactNumber: e.target.value })}
                    placeholder="+91 XXXXX XXXXX"
                    pattern="[+]?[0-9\s-]+"
                    className="w-full py-2 px-3 border-2 border-gray-200 rounded-md text-sm focus:outline-none focus:border-teal-400 focus:ring-4 focus:ring-cyan-100 transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Department <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={internalForm.department}
                    onChange={(e) => setInternalForm({ ...internalForm, department: e.target.value })}
                    className="w-full py-2 px-3 border-2 border-gray-200 rounded-md text-sm focus:outline-none focus:border-teal-400 focus:ring-4 focus:ring-cyan-100 transition-all"
                    required
                  >
                    <option value="">Select Department</option>
                    <option value="Maintenance Dept">Maintenance Dept</option>
                    <option value="Electronics Dept">Electronics Dept</option>
                    <option value="HVAC Team">HVAC Team</option>
                    <option value="Electrical Team">Electrical Team</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Maintenance Type <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={internalForm.maintenanceType}
                    onChange={(e) => setInternalForm({ ...internalForm, maintenanceType: e.target.value })}
                    className="w-full py-2 px-3 border-2 border-gray-200 rounded-md text-sm focus:outline-none focus:border-teal-400 focus:ring-4 focus:ring-cyan-100 transition-all"
                    required
                  >
                    <option value="">Select Type</option>
                    <option value="Preventive">Preventive</option>
                    <option value="Corrective">Corrective</option>
                    <option value="Emergency">Emergency</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Expected Return Date <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="date"
                    value={internalForm.expectedReturnDate}
                    onChange={(e) => setInternalForm({ ...internalForm, expectedReturnDate: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full py-2 px-3 border-2 border-gray-200 rounded-md text-sm focus:outline-none focus:border-teal-400 focus:ring-4 focus:ring-cyan-100 transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Estimated Service Cost <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="number"
                    value={internalForm.serviceCost}
                    onChange={(e) => setInternalForm({ ...internalForm, serviceCost: e.target.value })}
                    placeholder="Enter cost"
                    min="0"
                    className="w-full py-2 px-3 border-2 border-gray-200 rounded-md text-sm focus:outline-none focus:border-teal-400 focus:ring-4 focus:ring-cyan-100 transition-all"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Vehicle/Person Details</label>
                <input
                  type="text"
                  value={internalForm.vehicleDetails}
                  onChange={(e) => setInternalForm({ ...internalForm, vehicleDetails: e.target.value })}
                  placeholder="Enter vehicle number, Hand Delivery, or transport details"
                  className="w-full py-2 px-3 border-2 border-gray-200 rounded-md text-sm focus:outline-none focus:border-teal-400 focus:ring-4 focus:ring-cyan-100 transition-all"
                />
              </div>

              <div className="mb-4">
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Remarks</label>
                <textarea
                  value={internalForm.remarks}
                  onChange={(e) => setInternalForm({ ...internalForm, remarks: e.target.value })}
                  rows="3"
                  placeholder="Enter any additional remarks..."
                  className="w-full py-2 px-3 border-2 border-gray-200 rounded-md text-sm focus:outline-none focus:border-teal-400 focus:ring-4 focus:ring-cyan-100 transition-all resize-none"
                ></textarea>
              </div>

              <div className="mb-4">
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Upload Proof Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setInternalForm({ ...internalForm, proofImage: e.target.files[0] })}
                  className="w-full py-2 px-3 border-2 border-gray-200 rounded-md text-sm focus:outline-none focus:border-teal-400 transition-all"
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowInternalModal(false)}
                  className="flex-1 px-4 py-2.5 bg-gray-200 text-gray-700 rounded-md text-sm font-semibold hover:bg-gray-300 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-green-500 to-green-700 text-white rounded-md text-sm font-semibold hover:-translate-y-0.5 hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <i className="fas fa-save"></i>
                  Create Service Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Return Modal with Rating */}
      {showReturnModal && selectedRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-[10000] p-5">
          <div className="bg-white rounded-xl shadow-2xl max-w-[600px] w-full max-h-[90vh] flex flex-col animate-slideUp">
            <div className="flex justify-between items-center px-6 py-5 border-b-2 border-gray-200 bg-gradient-to-r from-cyan-50 to-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <i className="fas fa-check-circle text-green-600 text-lg"></i>
                </div>
                <h3 className="text-lg font-bold text-gray-800">Mark as Returned</h3>
              </div>
              <button
                onClick={() => setShowReturnModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-red-100 hover:text-red-600 transition-all hover:rotate-90"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <form onSubmit={handleReturnSubmit} className="p-6 overflow-y-auto flex-1">
              <div className="mb-4">
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Return Status <span className="text-red-600">*</span>
                </label>
                <select
                  value={returnForm.returnStatus}
                  onChange={(e) => setReturnForm({ ...returnForm, returnStatus: e.target.value })}
                  className="w-full py-2 px-3 border-2 border-gray-200 rounded-md text-sm focus:outline-none focus:border-teal-400 focus:ring-4 focus:ring-cyan-100 transition-all"
                  required
                >
                  <option value="">Select Status</option>
                  <option value="repaired">Repaired Successfully</option>
                  <option value="not-repairable">Not Repairable (Move to Scrap)</option>
                </select>
              </div>

              {returnForm.returnStatus === 'repaired' && (
                <>
                  <div className="mb-4">
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Final Service Cost <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="number"
                      value={returnForm.finalCost}
                      onChange={(e) => setReturnForm({ ...returnForm, finalCost: e.target.value })}
                      placeholder="Enter final cost"
                      min="0"
                      className="w-full py-2 px-3 border-2 border-gray-200 rounded-md text-sm focus:outline-none focus:border-teal-400 focus:ring-4 focus:ring-cyan-100 transition-all"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-xs font-semibold text-gray-700 mb-3">
                      Rate the Service <span className="text-red-600">*</span>
                    </label>
                    <div className="flex justify-center gap-2 mb-2 bg-gray-50 p-4 rounded-lg border-2 border-gray-200">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReturnForm({ ...returnForm, rating: star })}
                          className={`text-4xl transition-all ${
                            star <= returnForm.rating ? 'text-yellow-500' : 'text-gray-300'
                          } hover:text-yellow-400 hover:scale-110`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                    <div className="text-center text-sm font-semibold text-gray-700">
                      {returnForm.rating === 0 && 'Click to rate the service'}
                      {returnForm.rating === 1 && '⭐ Poor'}
                      {returnForm.rating === 2 && '⭐⭐ Fair'}
                      {returnForm.rating === 3 && '⭐⭐⭐ Good'}
                      {returnForm.rating === 4 && '⭐⭐⭐⭐ Very Good'}
                      {returnForm.rating === 5 && '⭐⭐⭐⭐⭐ Excellent'}
                    </div>
                  </div>
                </>
              )}

              <div className="mb-4">
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  {returnForm.returnStatus === 'repaired' ? 'Service Feedback' : 'Additional Remarks'}
                </label>
                <textarea
                  value={returnForm.remarks}
                  onChange={(e) => setReturnForm({ ...returnForm, remarks: e.target.value })}
                  rows="3"
                  placeholder={returnForm.returnStatus === 'repaired' ? 'Share your experience with the service...' : 'Enter any additional remarks...'}
                  className="w-full py-2 px-3 border-2 border-gray-200 rounded-md text-sm focus:outline-none focus:border-teal-400 focus:ring-4 focus:ring-cyan-100 transition-all resize-none"
                ></textarea>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowReturnModal(false)}
                  className="flex-1 px-4 py-2.5 bg-gray-200 text-gray-700 rounded-md text-sm font-semibold hover:bg-gray-300 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`flex-1 px-4 py-2.5 rounded-md text-sm font-semibold hover:-translate-y-0.5 hover:shadow-lg transition-all flex items-center justify-center gap-2 ${
                    returnForm.returnStatus === 'not-repairable'
                      ? 'bg-gradient-to-r from-red-500 to-red-700 text-white'
                      : 'bg-gradient-to-r from-green-500 to-green-700 text-white'
                  }`}
                >
                  <i className="fas fa-check"></i>
                  {returnForm.returnStatus === 'not-repairable' ? 'Move to Scrap' : 'Confirm Return'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Conversation Modal */}
      {showConversationModal && selectedRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-[10000] p-5">
          <div className="bg-white rounded-xl shadow-2xl max-w-[700px] w-full max-h-[90vh] flex flex-col animate-slideUp">
            <div className="flex justify-between items-center px-6 py-5 border-b-2 border-gray-200 bg-gradient-to-r from-cyan-50 to-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <i className="fas fa-comments text-purple-600 text-lg"></i>
                </div>
                <h3 className="text-lg font-bold text-gray-800">Conversation - {selectedRecord.soNumber}</h3>
              </div>
              <button
                onClick={() => setShowConversationModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-red-100 hover:text-red-600 transition-all hover:rotate-90"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 bg-gray-50" style={{ maxHeight: '400px' }}>
              <div className="space-y-3">
                {conversationHistory.length > 0 ? (
                  conversationHistory.map((msg, index) => (
                    <div key={index} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-gray-800 flex items-center gap-2">
                          <i className="fas fa-user-circle text-teal-500"></i>
                          {msg.user}
                        </span>
                        <span className="text-[10px] text-gray-500 flex items-center gap-1">
                          <i className="fas fa-clock"></i>
                          {msg.timestamp}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">{msg.message}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <i className="fas fa-comments text-6xl text-gray-300 mb-3"></i>
                    <p className="text-sm text-gray-500 font-semibold">No conversations yet</p>
                    <p className="text-xs text-gray-400 mt-1">Start a conversation by typing below</p>
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 bg-white border-t-2 border-gray-200">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={conversationMessage}
                  onChange={(e) => setConversationMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 py-2 px-3 border-2 border-gray-200 rounded-md text-sm focus:outline-none focus:border-teal-400 focus:ring-4 focus:ring-cyan-100 transition-all"
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!conversationMessage.trim()}
                  className="px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-700 text-white rounded-md text-sm font-semibold hover:-translate-y-0.5 hover:shadow-md transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <i className="fas fa-paper-plane"></i>
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MaintenanceModals;
