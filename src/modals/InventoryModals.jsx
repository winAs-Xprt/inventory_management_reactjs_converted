// src/modals/InventoryModals.jsx
import React, { useEffect } from 'react';

const InventoryModals = ({
  showDetailModal,
  setShowDetailModal,
  selectedItem,
  showConfirmModal,
  setShowConfirmModal,
  confirmConfig
}) => {
  
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (showDetailModal || showConfirmModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showDetailModal, showConfirmModal]);

  // Detail Modal
  const DetailModal = () => {
    if (!showDetailModal || !selectedItem) return null;

    return (
      <div
        className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-[10000] p-4 animate-fadeIn"
        onClick={() => setShowDetailModal(false)}
      >
        <div
          className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden animate-slideUp"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="bg-gradient-to-r from-teal-400 to-teal-700 text-white px-6 py-5 flex justify-between items-center">
            <h2 className="text-xl font-bold flex items-center gap-3">
              <i className="fas fa-info-circle text-2xl"></i>
              Stock Movement Details
            </h2>
            <button
              onClick={() => setShowDetailModal(false)}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 w-9 h-9 rounded-full flex items-center justify-center text-lg transition-all hover:scale-110"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>

          {/* Modal Body */}
          <div className="px-6 py-6 max-h-[calc(90vh-80px)] overflow-y-auto">
            {/* Product Info Section */}
            <div className="bg-gray-50 rounded-xl p-5 mb-5 border-l-4 border-teal-400">
              <h3 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
                <i className="fas fa-box text-teal-400"></i>
                Product Information
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-start gap-3 py-2 border-b border-gray-200">
                  <span className="text-sm font-semibold text-gray-600 min-w-[140px] flex items-center gap-2">
                    <i className="fas fa-tag text-teal-400 text-xs"></i>
                    Product Name:
                  </span>
                  <span className="text-sm font-medium text-gray-800 text-right flex-1">{selectedItem.productName}</span>
                </div>
                <div className="flex justify-between items-start gap-3 py-2 border-b border-gray-200">
                  <span className="text-sm font-semibold text-gray-600 min-w-[140px] flex items-center gap-2">
                    <i className="fas fa-barcode text-teal-400 text-xs"></i>
                    SKU:
                  </span>
                  <span className="text-sm font-medium text-gray-800 text-right flex-1">{selectedItem.sku}</span>
                </div>
                {selectedItem.category && (
                  <div className="flex justify-between items-start gap-3 py-2 border-b border-gray-200">
                    <span className="text-sm font-semibold text-gray-600 min-w-[140px] flex items-center gap-2">
                      <i className="fas fa-folder text-teal-400 text-xs"></i>
                      Category:
                    </span>
                    <span className="text-sm font-medium text-gray-800 text-right flex-1">{selectedItem.category}</span>
                  </div>
                )}
                {selectedItem.vendor && (
                  <div className="flex justify-between items-start gap-3 py-2">
                    <span className="text-sm font-semibold text-gray-600 min-w-[140px] flex items-center gap-2">
                      <i className="fas fa-store text-teal-400 text-xs"></i>
                      Vendor:
                    </span>
                    <span className="text-sm font-medium text-gray-800 text-right flex-1">{selectedItem.vendor}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Movement Details Section */}
            {selectedItem.operationType && (
              <div className="bg-gray-50 rounded-xl p-5 mb-5 border-l-4 border-teal-400">
                <h3 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <i className="fas fa-exchange-alt text-teal-400"></i>
                  Movement Details
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-start gap-3 py-2 border-b border-gray-200">
                    <span className="text-sm font-semibold text-gray-600 min-w-[140px] flex items-center gap-2">
                      <i className="fas fa-arrows-alt-v text-teal-400 text-xs"></i>
                      Type:
                    </span>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${
                      selectedItem.operationType === 'in'
                        ? 'bg-green-50 text-green-600 border-green-200'
                        : 'bg-red-50 text-red-600 border-red-200'
                    }`}>
                      <span className={`w-2 h-2 rounded-full ${
                        selectedItem.operationType === 'in' ? 'bg-green-600' : 'bg-red-600'
                      }`}></span>
                      {selectedItem.operationType === 'in' ? 'Stock In' : 'Stock Out'}
                    </span>
                  </div>
                  <div className="flex justify-between items-start gap-3 py-2 border-b border-gray-200">
                    <span className="text-sm font-semibold text-gray-600 min-w-[140px] flex items-center gap-2">
                      <i className="fas fa-cubes text-teal-400 text-xs"></i>
                      Quantity:
                    </span>
                    <span className={`text-sm font-bold text-right flex-1 ${
                      selectedItem.operationType === 'in' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {selectedItem.operationType === 'in' ? '+' : '-'}{selectedItem.quantity} units
                    </span>
                  </div>
                  {selectedItem.reason && (
                    <div className="flex justify-between items-start gap-3 py-2 border-b border-gray-200">
                      <span className="text-sm font-semibold text-gray-600 min-w-[140px] flex items-center gap-2">
                        <i className="fas fa-clipboard-list text-teal-400 text-xs"></i>
                        Reason:
                      </span>
                      <span className="text-sm font-medium text-gray-800 text-right flex-1">{selectedItem.reason}</span>
                    </div>
                  )}
                  {selectedItem.reasonDetail && (
                    <div className="flex justify-between items-start gap-3 py-2">
                      <span className="text-sm font-semibold text-gray-600 min-w-[140px] flex items-center gap-2">
                        <i className="fas fa-info-circle text-teal-400 text-xs"></i>
                        Details:
                      </span>
                      <span className="text-sm font-medium text-gray-800 text-right flex-1">{selectedItem.reasonDetail}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Keeper/Contact Section */}
            {selectedItem.keeper && (
              <div className="bg-gray-50 rounded-xl p-5 mb-5 border-l-4 border-teal-400">
                <h3 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <i className="fas fa-user text-teal-400"></i>
                  Warehouse Keeper
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-start gap-3 py-2 border-b border-gray-200">
                    <span className="text-sm font-semibold text-gray-600 min-w-[140px] flex items-center gap-2">
                      <i className="fas fa-user-circle text-teal-400 text-xs"></i>
                      Name:
                    </span>
                    <span className="text-sm font-medium text-gray-800 text-right flex-1">{selectedItem.keeper}</span>
                  </div>
                  {selectedItem.keeperId && (
                    <div className="flex justify-between items-start gap-3 py-2 border-b border-gray-200">
                      <span className="text-sm font-semibold text-gray-600 min-w-[140px] flex items-center gap-2">
                        <i className="fas fa-id-badge text-teal-400 text-xs"></i>
                        ID:
                      </span>
                      <span className="text-sm font-medium text-gray-800 text-right flex-1">{selectedItem.keeperId}</span>
                    </div>
                  )}
                  {selectedItem.phone && (
                    <div className="flex justify-between items-start gap-3 py-2">
                      <span className="text-sm font-semibold text-gray-600 min-w-[140px] flex items-center gap-2">
                        <i className="fas fa-phone text-teal-400 text-xs"></i>
                        Phone:
                      </span>
                      <span className="text-sm font-medium text-gray-800 text-right flex-1">{selectedItem.phone}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Financial Section */}
            {selectedItem.unitPrice && (
              <div className="bg-gray-50 rounded-xl p-5 border-l-4 border-teal-400">
                <h3 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <i className="fas fa-rupee-sign text-teal-400"></i>
                  Financial Information
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-start gap-3 py-2 border-b border-gray-200">
                    <span className="text-sm font-semibold text-gray-600 min-w-[140px] flex items-center gap-2">
                      <i className="fas fa-money-bill-wave text-teal-400 text-xs"></i>
                      Unit Price:
                    </span>
                    <span className="text-sm font-medium text-gray-800 text-right flex-1">₹{selectedItem.unitPrice.toLocaleString()}</span>
                  </div>
                  {selectedItem.totalValue && (
                    <div className="flex justify-between items-start gap-3 py-2">
                      <span className="text-sm font-semibold text-gray-600 min-w-[140px] flex items-center gap-2">
                        <i className="fas fa-calculator text-teal-400 text-xs"></i>
                        Total Value:
                      </span>
                      <span className="text-sm font-bold text-teal-600 text-right flex-1">₹{selectedItem.totalValue.toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Confirm Modal
  const ConfirmModal = () => {
    if (!showConfirmModal) return null;

    const iconMap = {
      success: 'fa-check-circle',
      error: 'fa-exclamation-circle',
      warning: 'fa-exclamation-triangle',
      info: 'fa-info-circle'
    };

    const iconColorMap = {
      success: 'bg-green-100 text-green-600',
      error: 'bg-red-100 text-red-600',
      warning: 'bg-yellow-100 text-yellow-600',
      info: 'bg-blue-100 text-blue-600'
    };

    const type = confirmConfig.type || 'warning';

    return (
      <div
        className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-[10000] p-4 animate-fadeIn"
        onClick={() => setShowConfirmModal(false)}
      >
        <div
          className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-slideUp"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="flex items-center gap-4 px-6 py-6 border-b-2 border-gray-200 bg-gray-50">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl flex-shrink-0 ${iconColorMap[type]}`}>
              <i className={`fas ${iconMap[type]}`}></i>
            </div>
            <h2 className="text-xl font-bold text-gray-800">{confirmConfig.title}</h2>
          </div>

          {/* Modal Body */}
          <div className="px-6 py-6">
            <p className="text-base leading-relaxed text-gray-600">{confirmConfig.message}</p>
          </div>

          {/* Modal Footer */}
          <div className="px-6 py-5 bg-gray-50 border-t-2 border-gray-200 flex gap-3">
            <button
              onClick={() => setShowConfirmModal(false)}
              className="flex-1 px-5 py-3 bg-gray-100 hover:bg-white border-2 border-gray-200 hover:border-gray-400 text-gray-600 rounded-md font-semibold text-sm flex items-center justify-center gap-2 transition-all"
            >
              <i className="fas fa-times"></i>
              Cancel
            </button>
            <button
              onClick={() => {
                if (confirmConfig.onConfirm) {
                  confirmConfig.onConfirm();
                }
                setShowConfirmModal(false);
              }}
              className={`flex-1 px-5 py-3 text-white rounded-md font-semibold text-sm flex items-center justify-center gap-2 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all ${
                confirmConfig.isDanger
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-teal-400 hover:bg-teal-500'
              }`}
            >
              <i className="fas fa-check"></i>
              Confirm
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <DetailModal />
      <ConfirmModal />
    </>
  );
};

export default InventoryModals;
