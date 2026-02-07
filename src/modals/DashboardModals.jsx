// src/modals/DashboardModals.jsx
import React from 'react';

const DashboardModals = ({
  showViewRequestModal,
  setShowViewRequestModal,
  showViewPOModal,
  setShowViewPOModal,
  showRejectModal,
  setShowRejectModal,
  showConfirmModal,
  setShowConfirmModal,
  selectedRequest,
  selectedPO,
  confirmAction,
  rejectReason,
  setRejectReason,
  confirmRejectRequest,
  formatCurrency,
  formatDate
}) => {

  return (
    <>
      {/* ============================================
           VIEW REQUEST MODAL
           ============================================ */}
      {showViewRequestModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[10000] p-4 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[95vh] flex flex-col animate-slideUp">
            {/* MODAL HEADER */}
            <div className="flex justify-between items-center px-6 py-4 border-b-2 border-gray-100 bg-gray-50 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-400 to-teal-700 flex items-center justify-center text-white">
                  <i className="fas fa-clipboard-list text-xl"></i>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-800">Request Details</h2>
                  <p className="text-xs text-gray-500 font-medium">{selectedRequest.id}</p>
                </div>
              </div>
              <button 
                className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-full hover:bg-red-100 hover:text-red-600 hover:rotate-90 transition-all duration-200"
                onClick={() => setShowViewRequestModal(false)}
              >
                <i className="fas fa-times text-lg"></i>
              </button>
            </div>

            {/* MODAL BODY - SCROLLABLE */}
            <div className="px-6 py-5 overflow-y-auto flex-1">
              {/* Request Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-5">
                <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-teal-500">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Request ID</div>
                  <div className="text-base font-bold text-gray-800">{selectedRequest.id}</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Employee</div>
                  <div className="text-base font-bold text-gray-800">{selectedRequest.employee}</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-purple-500">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Department</div>
                  <div className="text-base font-bold text-gray-800">{selectedRequest.department}</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-green-500">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Requested By</div>
                  <div className="text-base font-bold text-gray-800">{selectedRequest.requestedBy}</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-yellow-500">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Priority</div>
                  <div>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase ${
                      selectedRequest.priority === 'critical' ? 'bg-red-100 text-red-700' :
                      selectedRequest.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                      selectedRequest.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {selectedRequest.priority}
                    </span>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-indigo-500">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Request Date</div>
                  <div className="text-base font-bold text-gray-800">{selectedRequest.date}</div>
                </div>
              </div>

              {/* Status Badge */}
              <div className="mb-5">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Current Status</div>
                <span className={`inline-block px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wide ${
                  selectedRequest.status === 'pending' ? 'bg-yellow-100 text-yellow-700 border-2 border-yellow-300' :
                  selectedRequest.status === 'approved' ? 'bg-green-100 text-green-700 border-2 border-green-300' :
                  selectedRequest.status === 'delivered' ? 'bg-blue-100 text-blue-700 border-2 border-blue-300' :
                  'bg-red-100 text-red-700 border-2 border-red-300'
                }`}>
                  <i className={`fas fa-${
                    selectedRequest.status === 'pending' ? 'clock' :
                    selectedRequest.status === 'approved' ? 'check-circle' :
                    selectedRequest.status === 'delivered' ? 'truck' : 'times-circle'
                  } mr-2`}></i>
                  {selectedRequest.status}
                </span>
              </div>

              {/* Items Requested */}
              <div className="bg-blue-50 p-4 rounded-lg mb-5 border-l-4 border-blue-500">
                <div className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-3">
                  <i className="fas fa-box text-blue-600"></i>
                  Items Requested
                </div>
                <div className="bg-white p-4 rounded-md">
                  <div className="text-sm font-semibold text-gray-800 mb-2">{selectedRequest.items}</div>
                  <div className="flex items-center gap-4 text-xs text-gray-600">
                    <div className="flex items-center gap-1.5">
                      <i className="fas fa-cubes text-teal-600"></i>
                      <span className="font-semibold">Quantity:</span>
                      <span>{selectedRequest.quantity}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes/Description */}
              {selectedRequest.notes && (
                <div className="bg-gray-50 p-4 rounded-lg mb-5 border-l-4 border-gray-400">
                  <div className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-3">
                    <i className="fas fa-sticky-note text-gray-600"></i>
                    Additional Notes
                  </div>
                  <div className="bg-white p-4 rounded-md text-sm text-gray-700 leading-relaxed">
                    {selectedRequest.notes}
                  </div>
                </div>
              )}

              {/* Rejection Reason (if rejected) */}
              {selectedRequest.status === 'rejected' && selectedRequest.rejectionReason && (
                <div className="bg-red-50 p-4 rounded-lg mb-5 border-l-4 border-red-500">
                  <div className="flex items-center gap-2 text-sm font-bold text-red-700 mb-3">
                    <i className="fas fa-ban text-red-600"></i>
                    Rejection Reason
                  </div>
                  <div className="bg-white p-4 rounded-md text-sm text-gray-700 leading-relaxed">
                    {selectedRequest.rejectionReason}
                  </div>
                </div>
              )}

              {/* Timeline (if available) */}
              <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-teal-500">
                <div className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-4">
                  <i className="fas fa-history text-teal-600"></i>
                  Request Timeline
                </div>
                <div className="relative pl-6">
                  <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-gray-200"></div>
                  
                  <div className="relative mb-4">
                    <div className="absolute -left-5 top-1 w-3 h-3 rounded-full bg-blue-500 border-2 border-white shadow"></div>
                    <div className="text-xs font-semibold text-gray-800 mb-1">Request Created</div>
                    <div className="text-xs text-gray-500">{selectedRequest.date}</div>
                  </div>

                  {selectedRequest.status === 'approved' && (
                    <div className="relative mb-4">
                      <div className="absolute -left-5 top-1 w-3 h-3 rounded-full bg-green-500 border-2 border-white shadow"></div>
                      <div className="text-xs font-semibold text-gray-800 mb-1">Request Approved</div>
                      <div className="text-xs text-gray-500">Approved by Admin</div>
                    </div>
                  )}

                  {selectedRequest.status === 'rejected' && (
                    <div className="relative mb-4">
                      <div className="absolute -left-5 top-1 w-3 h-3 rounded-full bg-red-500 border-2 border-white shadow"></div>
                      <div className="text-xs font-semibold text-gray-800 mb-1">Request Rejected</div>
                      <div className="text-xs text-gray-500">Rejected by Admin</div>
                    </div>
                  )}

                  {selectedRequest.status === 'delivered' && (
                    <div className="relative">
                      <div className="absolute -left-5 top-1 w-3 h-3 rounded-full bg-teal-500 border-2 border-white shadow"></div>
                      <div className="text-xs font-semibold text-gray-800 mb-1">Request Delivered</div>
                      <div className="text-xs text-gray-500">Items delivered successfully</div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* MODAL FOOTER */}
            <div className="flex justify-end gap-3 px-6 py-4 border-t-2 border-gray-100 bg-gray-50 flex-shrink-0">
              <button 
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-br from-teal-400 to-teal-700 text-white rounded-lg text-sm font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                onClick={() => setShowViewRequestModal(false)}
              >
                <i className="fas fa-times"></i>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================
           VIEW PURCHASE ORDER MODAL
           ============================================ */}
      {showViewPOModal && selectedPO && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[10000] p-4 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[95vh] flex flex-col animate-slideUp">
            {/* MODAL HEADER */}
            <div className="flex justify-between items-center px-6 py-4 border-b-2 border-gray-100 bg-gray-50 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-400 to-teal-700 flex items-center justify-center text-white">
                  <i className="fas fa-shopping-cart text-xl"></i>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-800">Purchase Order Details</h2>
                  <p className="text-xs text-gray-500 font-medium">{selectedPO.poNumber}</p>
                </div>
              </div>
              <button 
                className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-full hover:bg-red-100 hover:text-red-600 hover:rotate-90 transition-all duration-200"
                onClick={() => setShowViewPOModal(false)}
              >
                <i className="fas fa-times text-lg"></i>
              </button>
            </div>

            {/* MODAL BODY - SCROLLABLE */}
            <div className="px-6 py-5 overflow-y-auto flex-1">
              {/* PO Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-5">
                <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-teal-500">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">PO Number</div>
                  <div className="text-base font-bold text-gray-800">{selectedPO.poNumber}</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Vendor</div>
                  <div className="text-base font-bold text-gray-800">{selectedPO.vendor}</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-purple-500">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Contact</div>
                  <div className="text-base font-bold text-gray-800">{selectedPO.vendorContact}</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-green-500">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Total Amount</div>
                  <div className="text-base font-bold text-green-600">{formatCurrency(selectedPO.amount)}</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-yellow-500">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Payment Terms</div>
                  <div className="text-base font-bold text-gray-800">{selectedPO.paymentTerms}</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-indigo-500">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Order Date</div>
                  <div className="text-base font-bold text-gray-800">{selectedPO.date}</div>
                </div>
              </div>

              {/* Status Badge */}
              <div className="mb-5">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Current Status</div>
                <span className={`inline-block px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wide ${
                  selectedPO.status === 'pending' ? 'bg-yellow-100 text-yellow-700 border-2 border-yellow-300' :
                  selectedPO.status === 'in-transit' ? 'bg-blue-100 text-blue-700 border-2 border-blue-300' :
                  'bg-green-100 text-green-700 border-2 border-green-300'
                }`}>
                  <i className={`fas fa-${
                    selectedPO.status === 'pending' ? 'clock' :
                    selectedPO.status === 'in-transit' ? 'truck' : 'check-circle'
                  } mr-2`}></i>
                  {selectedPO.status}
                </span>
              </div>

              {/* Items Summary */}
              <div className="bg-blue-50 p-4 rounded-lg mb-5 border-l-4 border-blue-500">
                <div className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-3">
                  <i className="fas fa-box text-blue-600"></i>
                  Items Summary
                </div>
                <div className="bg-white p-4 rounded-md">
                  <div className="text-sm font-semibold text-gray-800 mb-2">{selectedPO.items}</div>
                </div>
              </div>

              {/* Detailed Items List */}
              {selectedPO.itemsList && selectedPO.itemsList.length > 0 && (
                <div className="bg-gray-50 p-4 rounded-lg mb-5 border-l-4 border-teal-500">
                  <div className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-3">
                    <i className="fas fa-list text-teal-600"></i>
                    Detailed Items Breakdown
                  </div>
                  <div className="space-y-2">
                    {selectedPO.itemsList.map((item, index) => (
                      <div key={index} className="bg-white p-3 rounded-md flex items-center justify-between border border-gray-200 hover:border-teal-400 transition-all duration-200">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center text-teal-600 font-bold text-xs">
                            {index + 1}
                          </div>
                          <span className="text-sm font-medium text-gray-800">{item}</span>
                        </div>
                        <i className="fas fa-check-circle text-green-500"></i>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Delivery Address */}
              <div className="bg-green-50 p-4 rounded-lg mb-5 border-l-4 border-green-500">
                <div className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-3">
                  <i className="fas fa-map-marker-alt text-green-600"></i>
                  Delivery Address
                </div>
                <div className="bg-white p-4 rounded-md text-sm text-gray-700 leading-relaxed">
                  {selectedPO.deliveryAddress}
                </div>
              </div>

              {/* Timeline */}
              <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-purple-500">
                <div className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-4">
                  <i className="fas fa-history text-purple-600"></i>
                  Order Timeline
                </div>
                <div className="relative pl-6">
                  <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-gray-200"></div>
                  
                  <div className="relative mb-4">
                    <div className="absolute -left-5 top-1 w-3 h-3 rounded-full bg-blue-500 border-2 border-white shadow"></div>
                    <div className="text-xs font-semibold text-gray-800 mb-1">Order Placed</div>
                    <div className="text-xs text-gray-500">{selectedPO.date}</div>
                  </div>

                  {(selectedPO.status === 'in-transit' || selectedPO.status === 'delivered') && (
                    <div className="relative mb-4">
                      <div className="absolute -left-5 top-1 w-3 h-3 rounded-full bg-yellow-500 border-2 border-white shadow"></div>
                      <div className="text-xs font-semibold text-gray-800 mb-1">In Transit</div>
                      <div className="text-xs text-gray-500">Items shipped by vendor</div>
                    </div>
                  )}

                  {selectedPO.status === 'delivered' && (
                    <div className="relative">
                      <div className="absolute -left-5 top-1 w-3 h-3 rounded-full bg-green-500 border-2 border-white shadow"></div>
                      <div className="text-xs font-semibold text-gray-800 mb-1">Delivered</div>
                      <div className="text-xs text-gray-500">Order delivered successfully</div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* MODAL FOOTER */}
            <div className="flex justify-end gap-3 px-6 py-4 border-t-2 border-gray-100 bg-gray-50 flex-shrink-0">
              <button 
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-br from-teal-400 to-teal-700 text-white rounded-lg text-sm font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                onClick={() => setShowViewPOModal(false)}
              >
                <i className="fas fa-times"></i>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================
           REJECT REQUEST MODAL
           ============================================ */}
      {showRejectModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[10000] p-5 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full animate-slideUp">
            {/* MODAL HEADER */}
            <div className="flex items-center gap-3 px-6 py-4 border-b-2 border-gray-100 bg-red-50">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <i className="fas fa-ban text-2xl text-red-600"></i>
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-bold text-gray-800">Reject Request</h2>
                <p className="text-xs text-gray-500 font-medium">Request ID: {selectedRequest.id}</p>
              </div>
              <button 
                className="w-10 h-10 flex items-center justify-center bg-white rounded-full hover:bg-red-100 hover:text-red-600 hover:rotate-90 transition-all duration-200"
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason('');
                }}
              >
                <i className="fas fa-times text-lg"></i>
              </button>
            </div>

            {/* MODAL BODY */}
            <div className="px-6 py-5">
              <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                You are about to reject request <strong className="text-gray-800">{selectedRequest.id}</strong> from <strong className="text-gray-800">{selectedRequest.employee}</strong>. Please provide a detailed reason for rejection.
              </p>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Rejection Reason <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Enter detailed reason for rejection..."
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-sm resize-y min-h-[120px] focus:outline-none focus:border-red-400 focus:ring-4 focus:ring-red-100 transition-all duration-200"
                  autoFocus
                ></textarea>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-gray-500">Provide a clear and professional reason</span>
                  <span className={`text-xs font-medium ${
                    rejectReason.length < 10 ? 'text-red-500' : 
                    rejectReason.length < 20 ? 'text-yellow-500' : 'text-green-500'
                  }`}>
                    {rejectReason.length} characters
                  </span>
                </div>
              </div>

              {rejectReason.length > 0 && rejectReason.length < 10 && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border-l-4 border-red-500 rounded-md text-xs text-red-700">
                  <i className="fas fa-exclamation-circle"></i>
                  <span>Reason should be at least 10 characters</span>
                </div>
              )}
            </div>

            {/* MODAL FOOTER */}
            <div className="flex justify-end gap-3 px-6 py-4 border-t-2 border-gray-100 bg-gray-50">
              <button 
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-gray-700 border-2 border-gray-200 rounded-lg text-sm font-semibold hover:border-gray-400 transition-all duration-200"
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason('');
                }}
              >
                <i className="fas fa-times"></i>
                Cancel
              </button>
              <button 
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-br from-red-500 to-red-700 text-white rounded-lg text-sm font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={confirmRejectRequest}
                disabled={rejectReason.trim().length < 10}
              >
                <i className="fas fa-ban"></i>
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================
           CONFIRMATION MODAL
           ============================================ */}
      {showConfirmModal && confirmAction && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[10000] p-5 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full animate-slideUp">
            {/* MODAL HEADER */}
            <div className="flex items-center gap-3 px-6 py-4 border-b-2 border-gray-100 bg-gray-50">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                confirmAction.type === 'success' ? 'bg-green-100' :
                confirmAction.type === 'error' ? 'bg-red-100' :
                confirmAction.type === 'warning' ? 'bg-yellow-100' : 'bg-blue-100'
              }`}>
                <i className={`fas fa-${
                  confirmAction.type === 'success' ? 'check-circle' :
                  confirmAction.type === 'error' ? 'exclamation-circle' :
                  confirmAction.type === 'warning' ? 'exclamation-triangle' : 'info-circle'
                } text-2xl ${
                  confirmAction.type === 'success' ? 'text-green-600' :
                  confirmAction.type === 'error' ? 'text-red-600' :
                  confirmAction.type === 'warning' ? 'text-yellow-600' : 'text-blue-600'
                }`}></i>
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-bold text-gray-800">{confirmAction.title || 'Confirm Action'}</h2>
              </div>
              <button 
                className="w-10 h-10 flex items-center justify-center bg-white rounded-full hover:bg-gray-100 hover:text-gray-700 hover:rotate-90 transition-all duration-200"
                onClick={() => setShowConfirmModal(false)}
              >
                <i className="fas fa-times text-lg"></i>
              </button>
            </div>

            {/* MODAL BODY */}
            <div className="px-6 py-5">
              <p className="text-sm text-gray-600 leading-relaxed">
                {confirmAction.message || 'Are you sure you want to proceed with this action?'}
              </p>
            </div>

            {/* MODAL FOOTER */}
            <div className="flex justify-end gap-3 px-6 py-4 border-t-2 border-gray-100 bg-gray-50">
              <button 
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-gray-700 border-2 border-gray-200 rounded-lg text-sm font-semibold hover:border-gray-400 transition-all duration-200"
                onClick={() => setShowConfirmModal(false)}
              >
                <i className="fas fa-times"></i>
                Cancel
              </button>
              <button 
                className={`inline-flex items-center gap-2 px-5 py-2.5 text-white rounded-lg text-sm font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 ${
                  confirmAction.type === 'success' ? 'bg-gradient-to-br from-green-500 to-green-700' :
                  confirmAction.type === 'error' ? 'bg-gradient-to-br from-red-500 to-red-700' :
                  confirmAction.type === 'warning' ? 'bg-gradient-to-br from-yellow-500 to-yellow-700' :
                  'bg-gradient-to-br from-teal-400 to-teal-700'
                }`}
                onClick={() => {
                  if (confirmAction.onConfirm) {
                    confirmAction.onConfirm();
                  }
                }}
              >
                <i className="fas fa-check"></i>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ANIMATIONS */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default DashboardModals;
