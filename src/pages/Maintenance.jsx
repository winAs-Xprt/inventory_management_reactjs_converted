// src/pages/Maintenance.jsx
import React, { useState } from 'react';
import { useMaintenanceData } from '../data/MaintenanceData';
import MaintenanceModals from '../modals/MaintenanceModals';

const ITEMS_PER_PAGE = 10;

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

const Maintenance = () => {
  const {
    maintenanceRecords,
    setMaintenanceRecords,
    products,
    stats,
    currentPeriod,
    setCurrentPeriod,
    currentTypeFilter,
    setCurrentTypeFilter,
    currentStatusFilter,
    setCurrentStatusFilter,
    searchTerm,
    setSearchTerm,
    dateFilters,
    setDateFilters,
    getFilteredRecords,
    resetFilters
  } = useMaintenanceData();

  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showExternalModal, setShowExternalModal] = useState(false);
  const [showInternalModal, setShowInternalModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [showConversationModal, setShowConversationModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const filteredRecords = getFilteredRecords();

  const totalPages = Math.ceil(filteredRecords.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedRecords = filteredRecords.slice(startIndex, endIndex);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 3000);
  };

  const handleViewDetails = (record) => {
    setSelectedRecord(record);
    setShowDetailModal(true);
  };

  const handleReturnItem = (record) => {
    setSelectedRecord(record);
    setShowReturnModal(true);
  };

  const handleRateService = (record) => {
    setSelectedRecord(record);
    setShowRatingModal(true);
  };

  const handleViewConversation = (record) => {
    setSelectedRecord(record);
    setShowConversationModal(true);
  };

  const handleCancelOrder = (record) => {
    setConfirmConfig({
      title: 'Cancel Service Order',
      message: `Are you sure you want to cancel service order "${record.soNumber}"? This action cannot be undone.`,
      type: 'warning',
      isDanger: true,
      onConfirm: () => {
        const updatedRecords = maintenanceRecords.map(r =>
          r.id === record.id ? { ...r, status: 'Cancelled', cancelReason: 'Cancelled by user' } : r
        );
        setMaintenanceRecords(updatedRecords);
        showToast('Service order cancelled successfully', 'success');
      }
    });
    setShowConfirmModal(true);
  };

  const handleApplyFilters = () => {
    setCurrentPage(1);
    showToast('Filters applied successfully', 'info');
  };

  const handleClearFilters = () => {
    resetFilters();
    setCurrentPage(1);
    showToast('Filters cleared', 'info');
  };

  const handleRefresh = () => {
    const refreshButton = document.querySelector('[title="Refresh"]');
    if (refreshButton) {
      const icon = refreshButton.querySelector('i');
      icon.classList.add('fa-spin');
    }

    showToast('Refreshing maintenance data...', 'info');

    setTimeout(() => {
      window.location.reload();
    }, 800);
  };

  const handleTypeFilterChange = (value) => {
    setCurrentTypeFilter(value);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (value) => {
    setCurrentStatusFilter(value);
    setCurrentPage(1);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const getStatusBadgeClass = (status) => {
    const statusMap = {
      'Pending': 'bg-yellow-50 text-yellow-700 border border-yellow-200',
      'In Progress': 'bg-blue-50 text-blue-600 border border-blue-200',
      'Completed': 'bg-green-50 text-green-600 border border-green-200',
      'Cancelled': 'bg-red-50 text-red-600 border border-red-200'
    };
    return statusMap[status] || 'bg-gray-50 text-gray-600 border border-gray-200';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-gray-50 to-cyan-50 p-5">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-extrabold bg-gradient-to-r from-teal-400 to-teal-700 bg-clip-text text-transparent mb-1 flex items-center gap-2">
                <i className="fas fa-tools"></i>
                Maintenance Management
              </h1>
              <p className="text-gray-500 text-sm font-medium mb-2">
                Track and manage equipment maintenance efficiently
              </p>
              <div className="inline-flex items-center gap-2 text-green-600 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-green-600 animate-pulse"></span>
                Real-time Data
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <select
                value={currentPeriod}
                onChange={(e) => setCurrentPeriod(e.target.value)}
                className="px-3 py-2 border-2 border-gray-200 rounded-md text-sm font-semibold text-gray-700 bg-white cursor-pointer focus:outline-none focus:border-teal-400 focus:ring-4 focus:ring-cyan-100 transition-all"
              >
                <option value="today">Today</option>
                <option value="this-week">This Week</option>
                <option value="this-month">This Month</option>
                <option value="this-year">This Year</option>
                <option value="all-time">All Time</option>
              </select>
              <button
                onClick={() => setShowExternalModal(true)}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-md text-sm font-semibold hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 flex items-center gap-2"
              >
                <i className="fas fa-external-link-alt"></i>
                External Service
              </button>
              <button
                onClick={() => setShowInternalModal(true)}
                className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-700 text-white rounded-md text-sm font-semibold hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 flex items-center gap-2"
              >
                <i className="fas fa-home"></i>
                Internal Service
              </button>
              <button
                onClick={handleRefresh}
                className="px-4 py-2 bg-gradient-to-r from-teal-400 to-teal-700 text-white rounded-md text-sm font-semibold hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 flex items-center gap-2"
                title="Refresh"
              >
                <i className="fas fa-sync-alt"></i>
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:-translate-y-1 hover:shadow-lg hover:border-teal-400 transition-all relative"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-400 to-teal-700"></div>
              <div className="pt-5 px-5 pb-0">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    <i className={`${stat.icon} text-base text-teal-400`}></i>
                    {stat.title}
                  </div>
                </div>
                <div className="text-3xl font-extrabold text-gray-800 mb-2">
                  {stat.value}
                </div>
                <div className={`flex items-center gap-1 text-xs font-semibold pb-5 ${
                  stat.changeType === 'positive' ? 'text-green-600' :
                  stat.changeType === 'negative' ? 'text-red-600' : 'text-yellow-600'
                }`}>
                  <i className={`fas ${
                    stat.changeType === 'positive' ? 'fa-arrow-up' :
                    stat.changeType === 'negative' ? 'fa-arrow-down' : 'fa-exclamation-triangle'
                  } text-[10px]`}></i>
                  {stat.changeText}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="p-4 border-b-2 border-gray-200 bg-gradient-to-r from-teal-50 to-cyan-50">
            <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2">
              <i className="fas fa-filter text-teal-600"></i>
              Filters
            </h3>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Search</label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by SO number, product..."
                  className="w-full py-2 px-3 border-2 border-gray-200 rounded-md text-sm focus:outline-none focus:border-teal-400 focus:ring-4 focus:ring-cyan-100 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Type</label>
                <select
                  value={currentTypeFilter}
                  onChange={(e) => handleTypeFilterChange(e.target.value)}
                  className="w-full py-2 px-3 border-2 border-gray-200 rounded-md text-sm focus:outline-none focus:border-teal-400 focus:ring-4 focus:ring-cyan-100 transition-all cursor-pointer"
                >
                  <option value="all">All Types</option>
                  <option value="External">External</option>
                  <option value="Internal">Internal</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Status</label>
                <select
                  value={currentStatusFilter}
                  onChange={(e) => handleStatusFilterChange(e.target.value)}
                  className="w-full py-2 px-3 border-2 border-gray-200 rounded-md text-sm focus:outline-none focus:border-teal-400 focus:ring-4 focus:ring-cyan-100 transition-all cursor-pointer"
                >
                  <option value="all">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Date From</label>
                <input
                  type="date"
                  value={dateFilters.fromDate}
                  onChange={(e) => setDateFilters(prev => ({ ...prev, fromDate: e.target.value }))}
                  className="w-full py-2 px-3 border-2 border-gray-200 rounded-md text-sm focus:outline-none focus:border-teal-400 focus:ring-4 focus:ring-cyan-100 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Date To</label>
                <input
                  type="date"
                  value={dateFilters.toDate}
                  onChange={(e) => setDateFilters(prev => ({ ...prev, toDate: e.target.value }))}
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
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
          <div className="px-5 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
            <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2">
              <i className="fas fa-tools text-teal-500"></i>
              Service Orders ({filteredRecords.length})
            </h3>
          </div>

          <div className="overflow-x-auto">
            {paginatedRecords.length === 0 ? (
              <div className="text-center p-10 text-gray-500">
                <i className="fas fa-tools text-6xl text-teal-500 mb-4 block opacity-30"></i>
                <h3 className="text-lg font-bold mb-2 text-gray-700">No Service Orders Found</h3>
                <p className="text-sm text-gray-500">Start by creating a new service order or adjust your filters</p>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50 border-b-2 border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wide border-b-2 border-gray-200">SO Number</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wide border-b-2 border-gray-200">Type</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wide border-b-2 border-gray-200">Product</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wide border-b-2 border-gray-200">Service Provider</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wide border-b-2 border-gray-200">Sent Date</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wide border-b-2 border-gray-200">Expected Return</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wide border-b-2 border-gray-200">Service Cost</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wide border-b-2 border-gray-200">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wide border-b-2 border-gray-200">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedRecords.map((record) => (
                    <tr key={record.id} className="border-b border-gray-200 hover:bg-cyan-50 transition-colors">
                      <td className="px-4 py-3">
                        <strong className="text-xs font-bold text-gray-800">{record.soNumber}</strong>
                      </td>
                      <td className="px-4 py-3">
                        <span style={{ color: record.type === 'External' ? '#3498DB' : '#00B894', fontWeight: 600, fontSize: '12px' }}>
                          <i className={`fas fa-${record.type === 'External' ? 'external-link-alt' : 'home'} text-[10px] mr-1`}></i>
                          {record.type}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-semibold text-gray-800 text-xs">{record.productName}</div>
                        <small className="text-[10px] text-gray-500">{record.productCode} | Qty: {record.quantity}</small>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-xs text-gray-700">{record.serviceProvider}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-xs text-gray-700">{formatDate(record.sentDate)}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-xs text-gray-700">{formatDate(record.expectedReturnDate)}</div>
                      </td>
                      <td className="px-4 py-3">
                        <strong className="text-sm font-bold text-gray-800">
                          ₹{(record.finalCost ?? record.estimatedCost ?? 0).toLocaleString()}
                        </strong>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wide ${getStatusBadgeClass(record.status)}`}>
                          {record.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => handleViewDetails(record)}
                            className="w-8 h-8 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 hover:-translate-y-0.5 hover:shadow-md transition-all flex items-center justify-center"
                            title="View Details"
                          >
                            <i className="fas fa-eye text-[10px]"></i>
                          </button>
                          {(record.status === 'In Progress' || record.status === 'Pending') && (
                            <>
                              <button
                                onClick={() => handleReturnItem(record)}
                                className="w-8 h-8 bg-green-500 text-white rounded text-xs hover:bg-green-600 hover:-translate-y-0.5 hover:shadow-md transition-all flex items-center justify-center"
                                title="Mark as Returned"
                              >
                                <i className="fas fa-check text-[10px]"></i>
                              </button>
                              <button
                                onClick={() => handleCancelOrder(record)}
                                className="w-8 h-8 bg-red-500 text-white rounded text-xs hover:bg-red-600 hover:-translate-y-0.5 hover:shadow-md transition-all flex items-center justify-center"
                                title="Cancel Order"
                              >
                                <i className="fas fa-times text-[10px]"></i>
                              </button>
                            </>
                          )}
                          {record.status === 'Completed' && !record.rating && (
                            <button
                              onClick={() => handleRateService(record)}
                              className="w-8 h-8 bg-yellow-500 text-white rounded text-xs hover:bg-yellow-600 hover:-translate-y-0.5 hover:shadow-md transition-all flex items-center justify-center"
                              title="Rate Service"
                            >
                              <i className="fas fa-star text-[10px]"></i>
                            </button>
                          )}
                          <button
                            onClick={() => handleViewConversation(record)}
                            className="w-8 h-8 bg-purple-500 text-white rounded text-xs hover:bg-purple-600 hover:-translate-y-0.5 hover:shadow-md transition-all flex items-center justify-center"
                            title="View Conversation"
                          >
                            <i className="fas fa-comments text-[10px]"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {filteredRecords.length > ITEMS_PER_PAGE && (
            <div className="px-5 py-3 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
              <div className="text-xs text-gray-600 font-medium">
                Showing {startIndex + 1}-{Math.min(endIndex, filteredRecords.length)} of {filteredRecords.length} records
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-2.5 py-1.5 bg-white border border-gray-200 text-gray-700 rounded text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-cyan-50 hover:border-cyan-400 transition-all flex items-center justify-center min-w-[32px]"
                >
                  <i className="fas fa-chevron-left text-[10px]"></i>
                </button>
                {[...Array(totalPages)].map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentPage(idx + 1)}
                    className={`px-2.5 py-1.5 rounded text-xs font-semibold transition-all min-w-[32px] flex items-center justify-center ${
                      currentPage === idx + 1
                        ? 'bg-teal-500 text-white border border-teal-500'
                        : 'bg-white border border-gray-200 text-gray-700 hover:bg-cyan-50 hover:border-cyan-400'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-2.5 py-1.5 bg-white border border-gray-200 text-gray-700 rounded text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-cyan-50 hover:border-cyan-400 transition-all flex items-center justify-center min-w-[32px]"
                >
                  <i className="fas fa-chevron-right text-[10px]"></i>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <MaintenanceModals
        showDetailModal={showDetailModal}
        setShowDetailModal={setShowDetailModal}
        showExternalModal={showExternalModal}
        setShowExternalModal={setShowExternalModal}
        showInternalModal={showInternalModal}
        setShowInternalModal={setShowInternalModal}
        showReturnModal={showReturnModal}
        setShowReturnModal={setShowReturnModal}
        showRatingModal={showRatingModal}
        setShowRatingModal={setShowRatingModal}
        showConversationModal={showConversationModal}
        setShowConversationModal={setShowConversationModal}
        selectedRecord={selectedRecord}
        products={products}
        formatDate={formatDate}
        showToast={showToast}
        maintenanceRecords={maintenanceRecords}
        setMaintenanceRecords={setMaintenanceRecords}
      />

      <ConfirmModal
        isOpen={showConfirmModal}
        title={confirmConfig.title}
        message={confirmConfig.message}
        type={confirmConfig.type}
        isDanger={confirmConfig.isDanger}
        onConfirm={() => {
          confirmConfig.onConfirm?.();
          setShowConfirmModal(false);
        }}
        onCancel={() => setShowConfirmModal(false)}
      />

      <Toast show={toast.show} message={toast.message} type={toast.type} />
    </div>
  );
};

export default Maintenance;
