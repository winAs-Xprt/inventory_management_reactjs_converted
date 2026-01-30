// src/pages/Inventory.jsx
import React, { useState } from 'react';
import { useInventoryData } from '../data/InventoryData';
import InventoryModals from '../modals/InventoryModals';

const ITEMS_PER_PAGE = 10;

const Inventory = () => {
  const {
    stockData,
    lowStockData,
    stats,
    currentFilter,
    setCurrentFilter,
    currentSearchTerm,
    setCurrentSearchTerm,
    advancedFilters,
    setAdvancedFilters,
    getFilteredData,
    resetFilters
  } = useInventoryData();

  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  const filteredData = getFilteredData();

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  const handleViewDetails = (item) => {
    setSelectedItem(item);
    setShowDetailModal(true);
  };

  const handleDeleteItem = (item) => {
    setConfirmConfig({
      title: 'Delete Stock Movement',
      message: `Are you sure you want to delete the stock movement for "${item.productName}"? This action cannot be undone.`,
      type: 'error',
      isDanger: true,
      onConfirm: () => {
        console.log('Deleting item:', item.id);
      }
    });
    setShowConfirmModal(true);
  };

  const handleApplyFilters = () => {
    setCurrentPage(1);
    console.log('Filters applied');
  };

  const handleClearFilters = () => {
    resetFilters();
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-gray-50 to-cyan-50 p-5">
      <div className="max-w-[1600px] mx-auto">
        
        {/* Page Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">
          <div className="flex justify-between items-center flex-wrap gap-4">
            {/* Welcome Section */}
            <div>
              <h1 className="text-2xl font-extrabold bg-gradient-to-r from-teal-400 to-teal-700 bg-clip-text text-transparent mb-1 flex items-center gap-2">
                <i className="fas fa-warehouse"></i>
                Stock Management
              </h1>
              <p className="text-gray-500 text-sm font-medium mb-2">
                Monitor and manage your inventory movements
              </p>
              <div className="inline-flex items-center gap-2 text-green-600 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-green-600 animate-pulse"></span>
                Real-time Data
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-2 flex-wrap">
              <select className="bg-white border-2 border-gray-200 rounded-md px-4 py-2 text-sm font-semibold text-gray-800 focus:outline-none focus:border-teal-400 focus:ring-3 focus:ring-teal-50 transition-all">
                <option>This Month</option>
                <option>Last Month</option>
                <option>This Year</option>
              </select>
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
                  stat.change.startsWith('+') ? 'text-green-600' : 
                  stat.change.startsWith('-') ? 'text-red-600' : 'text-yellow-600'
                }`}>
                  <i className={`fas ${
                    stat.change.startsWith('+') ? 'fa-arrow-up' : 
                    stat.change.startsWith('-') ? 'fa-arrow-down' : 'fa-exclamation-triangle'
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
                  value={currentSearchTerm}
                  onChange={(e) => setCurrentSearchTerm(e.target.value)}
                  placeholder="Search by product name or SKU..."
                  className="w-full py-2 px-3 border-2 border-gray-200 rounded-md text-sm focus:outline-none focus:border-teal-400 focus:ring-4 focus:ring-cyan-100 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Movement Type</label>
                <select
                  value={advancedFilters.movementType}
                  onChange={(e) => setAdvancedFilters(prev => ({ ...prev, movementType: e.target.value }))}
                  className="w-full py-2 px-3 border-2 border-gray-200 rounded-md text-sm focus:outline-none focus:border-teal-400 focus:ring-4 focus:ring-cyan-100 transition-all cursor-pointer"
                >
                  <option value="">All Movements</option>
                  <option value="in">Stock In</option>
                  <option value="out">Stock Out</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Date From</label>
                <input
                  type="date"
                  value={advancedFilters.dateFrom}
                  onChange={(e) => setAdvancedFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
                  className="w-full py-2 px-3 border-2 border-gray-200 rounded-md text-sm focus:outline-none focus:border-teal-400 focus:ring-4 focus:ring-cyan-100 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Date To</label>
                <input
                  type="date"
                  value={advancedFilters.dateTo}
                  onChange={(e) => setAdvancedFilters(prev => ({ ...prev, dateTo: e.target.value }))}
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

        {/* Quick Filters */}
        <div className="flex gap-2 mb-5 flex-wrap">
          <button
            onClick={() => setCurrentFilter('all')}
            className={`px-4 py-2 rounded-md text-sm font-semibold flex items-center gap-2 transition-all ${
              currentFilter === 'all'
                ? 'bg-teal-400 text-white border border-teal-400 shadow-sm'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-teal-50 hover:border-teal-400 hover:text-teal-400 hover:-translate-y-0.5'
            }`}
          >
            <i className="fas fa-th-large text-sm"></i>
            All Stock
          </button>
          <button
            onClick={() => setCurrentFilter('in')}
            className={`px-4 py-2 rounded-md text-sm font-semibold flex items-center gap-2 transition-all ${
              currentFilter === 'in'
                ? 'bg-green-500 text-white border border-green-500 shadow-sm'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-green-50 hover:border-green-500 hover:text-green-600 hover:-translate-y-0.5'
            }`}
          >
            <i className="fas fa-arrow-down text-sm"></i>
            Stock In
          </button>
          <button
            onClick={() => setCurrentFilter('out')}
            className={`px-4 py-2 rounded-md text-sm font-semibold flex items-center gap-2 transition-all ${
              currentFilter === 'out'
                ? 'bg-yellow-500 text-gray-800 border border-yellow-500 shadow-sm'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-yellow-50 hover:border-yellow-500 hover:text-yellow-600 hover:-translate-y-0.5'
            }`}
          >
            <i className="fas fa-arrow-up text-sm"></i>
            Stock Out
          </button>
          <button
            onClick={() => setCurrentFilter('low')}
            className={`px-4 py-2 rounded-md text-sm font-semibold flex items-center gap-2 transition-all ${
              currentFilter === 'low'
                ? 'bg-red-500 text-white border border-red-500 shadow-sm'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-red-50 hover:border-red-500 hover:text-red-600 hover:-translate-y-0.5'
            }`}
          >
            <i className="fas fa-exclamation-triangle text-sm"></i>
            Low Stock
          </button>
        </div>

        {/* Stock Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
          <div className="px-5 py-4 border-b border-gray-200 bg-gray-50">
            <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2">
              <i className="fas fa-list text-teal-500"></i>
              {currentFilter === 'low' ? 'Low Stock Alerts' : 'Stock Inventory Management'}
            </h3>
          </div>

          <div className="overflow-x-auto">
            {paginatedData.length === 0 ? (
              <div className="text-center p-10 text-gray-500">
                <i className="fas fa-inbox text-4xl text-teal-500 mb-3 block"></i>
                <h3 className="text-lg font-semibold mb-2">No Products Found</h3>
                <p className="text-sm">No stock items match your current filters. Try adjusting your search criteria.</p>
              </div>
            ) : (
              <table className="w-full min-w-[1200px]">
                <thead className="bg-gray-50 border-b-2 border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wide border-b-2 border-gray-200">Image</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wide border-b-2 border-gray-200">Product Info</th>
                    {currentFilter === 'low' ? (
                      <>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wide border-b-2 border-gray-200">Category</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wide border-b-2 border-gray-200">Current/Min Qty</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wide border-b-2 border-gray-200">Status</th>
                      </>
                    ) : (
                      <>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wide border-b-2 border-gray-200">Movement</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wide border-b-2 border-gray-200">Reason</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wide border-b-2 border-gray-200">Quantity</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wide border-b-2 border-gray-200">Keeper</th>
                      </>
                    )}
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wide border-b-2 border-gray-200">Time</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wide border-b-2 border-gray-200">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((item) => (
                    <tr key={item.id} className="border-b border-gray-200 hover:bg-teal-50 transition-colors">
                      <td className="px-4 py-3 border-b border-gray-200">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.productName}
                            className="w-[60px] h-[60px] rounded-lg object-cover border-2 border-gray-200 hover:scale-110 transition-transform"
                          />
                        ) : (
                          <div className="w-[60px] h-[60px] flex items-center justify-center bg-gray-100 rounded-lg text-[10px] text-gray-500 font-semibold text-center border-2 border-dashed border-gray-200">
                            No Image
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 border-b border-gray-200">
                        <div className="flex flex-col gap-1">
                          <div className="font-semibold text-gray-800 text-xs">{item.productName}</div>
                          <div className="text-[10px] text-gray-500 font-medium">{item.sku}</div>
                        </div>
                      </td>
                      {currentFilter === 'low' ? (
                        <>
                          <td className="px-4 py-3 border-b border-gray-200">
                            <span className="text-xs text-gray-700">{item.category}</span>
                          </td>
                          <td className="px-4 py-3 border-b border-gray-200">
                            <div className="flex items-center gap-2">
                              <span className={`text-base font-bold ${
                                item.currentQty === 0 ? 'text-red-600' : 
                                item.currentQty < item.minQty * 0.3 ? 'text-red-600' : 'text-yellow-600'
                              }`}>
                                {item.currentQty}
                              </span>
                              <span className="text-xs text-gray-500">/ {item.minQty}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 border-b border-gray-200">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${
                              item.status === 'critical'
                                ? 'bg-red-50 text-red-600 border-red-200'
                                : 'bg-yellow-50 text-yellow-600 border-yellow-200'
                            }`}>
                              <span className={`w-2 h-2 rounded-full ${
                                item.status === 'critical' ? 'bg-red-600' : 'bg-yellow-600'
                              }`}></span>
                              {item.status === 'critical' ? 'Out of Stock' : 'Low Stock'}
                            </span>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-4 py-3 border-b border-gray-200">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${
                              item.operationType === 'in'
                                ? 'bg-green-50 text-green-600 border-green-200'
                                : 'bg-red-50 text-red-600 border-red-200'
                            }`}>
                              <span className={`w-2 h-2 rounded-full ${
                                item.operationType === 'in' ? 'bg-green-600' : 'bg-red-600'
                              }`}></span>
                              {item.operationType === 'in' ? 'Stock In' : 'Stock Out'}
                            </span>
                          </td>
                          <td className="px-4 py-3 border-b border-gray-200">
                            <div className="flex flex-col gap-0.5">
                              <div className="text-xs text-gray-800 font-semibold">{item.reason}</div>
                              <div className="text-[10px] text-gray-500">{item.reasonDetail}</div>
                            </div>
                          </td>
                          <td className="px-4 py-3 border-b border-gray-200">
                            <div className={`text-sm font-bold ${
                              item.operationType === 'in' ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {item.operationType === 'in' ? '+' : '-'}{item.quantity} units
                            </div>
                          </td>
                          <td className="px-4 py-3 border-b border-gray-200">
                            <div className="flex flex-col gap-0.5">
                              <div className="text-xs text-gray-800 font-semibold">{item.keeper}</div>
                              <div className="text-[10px] text-gray-500">{item.keeperId}</div>
                            </div>
                          </td>
                        </>
                      )}
                      <td className="px-4 py-3 border-b border-gray-200">
                        <div className="flex flex-col gap-0.5">
                          <div className="text-xs text-gray-700">{item.time}</div>
                          <div className="text-[10px] text-gray-500">{item.timeAgo}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3 border-b border-gray-200">
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => handleViewDetails(item)}
                            className="w-8 h-8 bg-blue-500 text-white rounded-md text-xs hover:-translate-y-px hover:shadow-md transition-all flex items-center justify-center"
                            title="View Details"
                          >
                            <i className="fas fa-eye text-xs"></i>
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item)}
                            className="w-8 h-8 bg-red-500 text-white rounded-md text-xs hover:-translate-y-px hover:shadow-md transition-all flex items-center justify-center"
                            title="Delete"
                          >
                            <i className="fas fa-trash text-xs"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
          {filteredData.length > ITEMS_PER_PAGE && (
            <div className="px-5 py-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
              <div className="text-sm text-gray-600">
                Showing {startIndex + 1} to {Math.min(endIndex, filteredData.length)} of {filteredData.length} items
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 bg-white border-2 border-gray-200 text-gray-700 rounded-md text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:border-teal-400 transition-all"
                >
                  <i className="fas fa-chevron-left"></i>
                </button>
                {[...Array(totalPages)].map((_, idx) => (
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
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 bg-white border-2 border-gray-200 text-gray-700 rounded-md text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:border-teal-400 transition-all"
                >
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Modals */}
      <InventoryModals
        showDetailModal={showDetailModal}
        setShowDetailModal={setShowDetailModal}
        selectedItem={selectedItem}
        showConfirmModal={showConfirmModal}
        setShowConfirmModal={setShowConfirmModal}
        confirmConfig={confirmConfig}
      />
    </div>
  );
};

export default Inventory;
