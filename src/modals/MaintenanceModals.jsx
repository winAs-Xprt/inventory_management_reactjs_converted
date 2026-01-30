// src/pages/MaintenanceModals.jsx
import React, { useState } from 'react';

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
    showConfirmModal,
    setShowConfirmModal,
    confirmConfig,
    formatDate
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

    // Return form state
    const [returnForm, setReturnForm] = useState({
        returnStatus: '',
        finalCost: '',
        rating: 0,
        remarks: ''
    });

    // Conversation state
    const [conversationMessage, setConversationMessage] = useState('');

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

    const handleExternalSubmit = (e) => {
        e.preventDefault();
        console.log('External Service submitted:', { products: productItems, ...externalForm });
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
    };

    const handleInternalSubmit = (e) => {
        e.preventDefault();
        console.log('Internal Service submitted:', { products: productItems, ...internalForm });
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
    };

    const handleReturnSubmit = (e) => {
        e.preventDefault();
        console.log('Return submitted:', returnForm);
        setReturnForm({
            returnStatus: '',
            finalCost: '',
            rating: 0,
            remarks: ''
        });
        setShowReturnModal(false);
    };

    const handleSendMessage = () => {
        if (conversationMessage.trim()) {
            console.log('Message sent:', conversationMessage);
            setConversationMessage('');
        }
    };

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
                                        <span className={`inline-block px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wide ${selectedRecord.status === 'Pending' ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' :
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

            {/* External Service Modal */}
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

            {/* Internal Service Modal */}
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
                                        pattern="[+]?[0-9\\s-]+"
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

            {/* Return Modal */}
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
                                    <option value="repaired">Repaired & Working</option>
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
                                        <label className="block text-xs font-semibold text-gray-700 mb-2">
                                            Rate Service <span className="text-red-600">*</span>
                                        </label>
                                        <div className="flex gap-2">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onClick={() => setReturnForm({ ...returnForm, rating: star })}
                                                    className={`w-12 h-12 rounded-lg font-bold text-lg transition-all ${returnForm.rating >= star
                                                            ? 'bg-yellow-500 text-white'
                                                            : 'bg-gray-200 text-gray-400 hover:bg-gray-300'
                                                        }`}
                                                >
                                                    ★
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}

                            <div className="mb-4">
                                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                                    Remarks {returnForm.returnStatus === 'repaired' ? '(Optional)' : <span className="text-red-600">*</span>}
                                </label>
                                <textarea
                                    value={returnForm.remarks}
                                    onChange={(e) => setReturnForm({ ...returnForm, remarks: e.target.value })}
                                    rows="3"
                                    placeholder={returnForm.returnStatus === 'not-repairable' ? 'Explain reason for not being repairable...' : 'Enter feedback or remarks...'}
                                    className="w-full py-2 px-3 border-2 border-gray-200 rounded-md text-sm focus:outline-none focus:border-teal-400 focus:ring-4 focus:ring-cyan-100 transition-all resize-none"
                                    required={returnForm.returnStatus === 'not-repairable'}
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
                                    className={`flex-1 px-4 py-2.5 rounded-md text-sm font-semibold hover:-translate-y-0.5 hover:shadow-lg transition-all flex items-center justify-center gap-2 ${returnForm.returnStatus === 'not-repairable'
                                            ? 'bg-gradient-to-r from-red-500 to-red-700 text-white'
                                            : 'bg-gradient-to-r from-green-500 to-green-700 text-white'
                                        }`}
                                >
                                    <i className="fas fa-check"></i>
                                    {returnForm.returnStatus === 'not-repairable' ? 'Move to Scrap' : 'Mark as Returned'}
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
                                <div className="bg-white p-4 rounded-lg border border-gray-200">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-xs font-bold text-gray-800">Kumar - Storekeeper</span>
                                        <span className="text-[10px] text-gray-500">2025-12-20 10:30 AM</span>
                                    </div>
                                    <p className="text-sm text-gray-700">Sent item for maintenance. Vendor confirmed receipt.</p>
                                </div>
                                <div className="text-center py-4">
                                    <i className="fas fa-comments text-4xl text-gray-300 mb-2"></i>
                                    <p className="text-sm text-gray-500">No more conversations yet</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 bg-white border-t border-gray-200">
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
                                    className="px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-700 text-white rounded-md text-sm font-semibold hover:-translate-y-0.5 hover:shadow-md transition-all flex items-center gap-2"
                                >
                                    <i className="fas fa-paper-plane"></i>
                                    Send
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Confirm Modal */}
            {showConfirmModal && (
                <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-[10000] p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full animate-slideUp">
                        <div className="px-6 py-5 border-b-2 border-gray-200 bg-gradient-to-r from-red-50 to-orange-50 flex items-center gap-3">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${confirmConfig.type === 'error' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'
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
                                className={`flex-1 px-4 py-2.5 rounded-md text-sm font-semibold transition-all flex items-center justify-center gap-2 ${confirmConfig.isDanger
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

export default MaintenanceModals;

