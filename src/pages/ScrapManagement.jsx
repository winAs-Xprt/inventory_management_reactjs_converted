// src/pages/ScrapManagement.jsx
import React, { useState } from 'react';
import { useScrapData } from '../data/ScrapManagementData';
import ScrapModals from '../modals/ScrapManagementModals';

const ITEMS_PER_PAGE = 10;

const ScrapManagement = () => {
  const {
    scrapRecords,
    availableScrapItems,
    stats,
    currentTypeFilter,
    setCurrentTypeFilter,
    currentStatusFilter,
    setCurrentStatusFilter,
    searchTerm,
    setSearchTerm,
    dateFilters,
    setDateFilters,
    getFilteredRecords,
    resetFilters,
    addScrapInRecord,
    addScrapOutRecord
  } = useScrapData();

  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showScrapInModal, setShowScrapInModal] = useState(false);
  const [showScrapOutModal, setShowScrapOutModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  const filteredRecords = getFilteredRecords();

  // Toast Function
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: '' });
    }, 3000);
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredRecords.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedRecords = filteredRecords.slice(startIndex, endIndex);

  const handleViewDetails = (record) => {
    setSelectedRecord(record);
    setShowDetailModal(true);
  };

  const handleDeleteRecord = (record) => {
    setConfirmConfig({
      title: 'Delete Scrap Record',
      message: `Are you sure you want to delete scrap record "${record.id}"? This action cannot be undone.`,
      type: 'error',
      isDanger: true,
      onConfirm: () => {
        console.log('Deleting record:', record.id);
      }
    });
    setShowConfirmModal(true);
  };

  const handleApplyFilters = () => {
    setCurrentPage(1); // Reset to page 1 when filters change
  };

  const handleClearFilters = () => {
    resetFilters();
    setCurrentPage(1);
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  // Handle Type Filter Change
  const handleTypeFilterChange = (value) => {
    setCurrentTypeFilter(value);
    setCurrentPage(1); // Reset to page 1
  };

  // Handle Status Filter Change
  const handleStatusFilterChange = (value) => {
    setCurrentStatusFilter(value);
    setCurrentPage(1); // Reset to page 1
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-gray-50 to-cyan-50 p-5">
      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed top-5 right-5 z-[10001] px-5 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-slideIn ${
          toast.type === 'success' ? 'bg-green-500' :
          toast.type === 'error' ? 'bg-red-500' :
          toast.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
        } text-white font-semibold text-sm`}>
          <i className={`fas fa-${
            toast.type === 'success' ? 'check-circle' :
            toast.type === 'error' ? 'exclamation-circle' :
            toast.type === 'warning' ? 'exclamation-triangle' : 'info-circle'
          } text-lg`}></i>
          {toast.message}
        </div>
      )}

      <div className="max-w-[1600px] mx-auto">
        
        {/* Page Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">
          <div className="flex justify-between items-center flex-wrap gap-4">
            {/* Welcome Section */}
            <div>
              <h1 className="text-2xl font-extrabold bg-gradient-to-r from-teal-400 to-teal-700 bg-clip-text text-transparent mb-1 flex items-center gap-2">
                <i className="fas fa-recycle"></i>
                Scrap Management
              </h1>
              <p className="text-gray-500 text-sm font-medium mb-2">
                Track and manage scrap items efficiently
              </p>
              <div className="inline-flex items-center gap-2 text-green-600 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-green-600 animate-pulse"></span>
                Real-time Data
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setShowScrapInModal(true)}
                className="px-4 py-2 bg-gradient-to-r from-teal-400 to-teal-700 text-white rounded-md text-sm font-semibold hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 flex items-center gap-2"
              >
                <i className="fas fa-arrow-down"></i>
                Scrap In
              </button>
              <button
                onClick={() => setShowScrapOutModal(true)}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-md text-sm font-semibold hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 flex items-center gap-2"
              >
                <i className="fas fa-arrow-up"></i>
                Scrap Out
              </button>
              <button
                onClick={handleRefresh}
                className="px-4 py-2 bg-gradient-to-r from-teal-400 to-teal-700 text-white rounded-md text-sm font-semibold hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 flex items-center gap-2"
              >
                <i className="fas fa-sync-alt"></i>
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:-translate-y-1 hover:shadow-lg hover:border-teal-400 transition-all relative group"
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

        {/* Filters Section */}
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
                  placeholder="Search by ID, product..."
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
                  <option value="Scrap In">Scrap In</option>
                  <option value="Scrap Out">Scrap Out</option>
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
                  <option value="In Warehouse">In Warehouse</option>
                  <option value="Disposed">Disposed</option>
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

        {/* Scrap Records Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
          <div className="px-5 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
            <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2">
              <i className="fas fa-recycle text-teal-500"></i>
              Scrap Records
            </h3>
          </div>

          <div className="overflow-x-auto">
            {paginatedRecords.length === 0 ? (
              <div className="text-center p-10 text-gray-500">
                <i className="fas fa-recycle text-6xl text-teal-500 mb-4 block opacity-30"></i>
                <h3 className="text-lg font-bold mb-2 text-gray-700">No Scrap Records Found</h3>
                <p className="text-sm text-gray-500">Try adjusting your filters or create a new scrap entry</p>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50 border-b-2 border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wide border-b-2 border-gray-200">Scrap ID</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wide border-b-2 border-gray-200">Type</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wide border-b-2 border-gray-200">Product</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wide border-b-2 border-gray-200">From/To</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wide border-b-2 border-gray-200">Quantity</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wide border-b-2 border-gray-200">Condition</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wide border-b-2 border-gray-200">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wide border-b-2 border-gray-200">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wide border-b-2 border-gray-200">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedRecords.map((record) => (
                    <tr key={record.id} className="border-b border-gray-200 hover:bg-cyan-50 transition-colors">
                      <td className="px-4 py-3">
                        <strong className="text-xs font-bold text-gray-800">{record.id}</strong>
                      </td>
                      <td className="px-4 py-3">
                        <span style={{ color: record.type === 'Scrap In' ? '#3498DB' : '#d4a017', fontWeight: 600, fontSize: '12px' }}>
                          <i className={`fas fa-${record.type === 'Scrap In' ? 'arrow-down' : 'arrow-up'} text-[10px] mr-1`}></i>
                          {record.type}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-semibold text-gray-800 text-xs">{record.productName}</div>
                        <small className="text-[10px] text-gray-500">{record.productCode}</small>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-xs text-gray-700">{record.fromTo}</div>
                      </td>
                      <td className="px-4 py-3">
                        <strong className="text-sm font-bold text-gray-800">{record.quantity}</strong>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs text-orange-600 font-semibold">{record.condition}</span>
                        {record.workingPercentage !== undefined && (
                          <>
                            <br />
                            <small className="text-[10px] text-gray-500">{record.workingPercentage}% working</small>
                          </>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wide ${
                          record.status === 'In Warehouse'
                            ? 'bg-cyan-50 text-cyan-600 border border-cyan-200'
                            : 'bg-green-50 text-green-600 border border-green-200'
                        }`}>
                          {record.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-xs text-gray-700">{formatDate(record.date)}</div>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleViewDetails(record)}
                          className="px-3 py-1.5 bg-blue-500 text-white rounded text-xs font-semibold hover:bg-blue-600 hover:-translate-y-0.5 hover:shadow-md transition-all flex items-center gap-1"
                          title="View Details"
                        >
                          <i className="fas fa-eye text-[10px]"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
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

      {/* Modals */}
      <ScrapModals
        showDetailModal={showDetailModal}
        setShowDetailModal={setShowDetailModal}
        showScrapInModal={showScrapInModal}
        setShowScrapInModal={setShowScrapInModal}
        showScrapOutModal={showScrapOutModal}
        setShowScrapOutModal={setShowScrapOutModal}
        selectedRecord={selectedRecord}
        availableScrapItems={availableScrapItems}
        showConfirmModal={showConfirmModal}
        setShowConfirmModal={setShowConfirmModal}
        confirmConfig={confirmConfig}
        formatDate={formatDate}
        addScrapInRecord={addScrapInRecord}
        addScrapOutRecord={addScrapOutRecord}
        showToast={showToast}
      />
    </div>
  );
};

export default ScrapManagement;
