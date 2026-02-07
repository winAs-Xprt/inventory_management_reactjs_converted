// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useDashboardData } from '../data/DashboardData';
import DashboardModals from '../modals/DashboardModals';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Pie, Line } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(ArcElement, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  // Import data and functions from custom hook
  const {
    stats,
    stockFlowData,
    purchasesData,
    pendingRequestsData,
    lowStockData,
    stockDistributionData,
    purchaseTrendsData,
    topVendorsData,
    pendingRequests,
    purchaseOrders,
    recentActivities,
    notifications,
    setPendingRequests,
    setPurchaseOrders
  } = useDashboardData();

  // State management
  const [currentPeriod, setCurrentPeriod] = useState('month');
  const [currentPurchaseFilter, setCurrentPurchaseFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Modal states
  const [showViewRequestModal, setShowViewRequestModal] = useState(false);
  const [showViewPOModal, setShowViewPOModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [selectedPO, setSelectedPO] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  // Toast state
  const [toasts, setToasts] = useState([]);

  // Date filters
  const [dateFilters, setDateFilters] = useState({
    requestsFrom: '',
    requestsTo: '',
    purchasesFrom: '',
    purchasesTo: ''
  });

  // Toast notification function
  const showToast = (message, type = 'info', title = '') => {
    const id = Date.now();
    const toast = { id, message, type, title };
    setToasts(prev => [...prev, toast]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  // Format currency
  const formatCurrency = (amount) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Truncate text
  const truncateText = (text, maxLength) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  // View request details
  const handleViewRequest = (request) => {
    setSelectedRequest(request);
    setShowViewRequestModal(true);
  };

  // View PO details
  const handleViewPO = (po) => {
    setSelectedPO(po);
    setShowViewPOModal(true);
  };

  // Approve request
  const handleApproveRequest = (requestId) => {
    setConfirmAction({
      title: 'Approve Request',
      message: `Are you sure you want to approve request ${requestId}?`,
      type: 'success',
      onConfirm: () => {
        const updatedRequests = pendingRequests.map(req => {
          if (req.id === requestId) {
            return { ...req, status: 'approved' };
          }
          return req;
        });
        setPendingRequests(updatedRequests);
        showToast(`Request ${requestId} approved successfully!`, 'success', 'Request Approved');
        setShowConfirmModal(false);
      }
    });
    setShowConfirmModal(true);
  };

  // Reject request
  const handleRejectRequest = (requestId) => {
    const request = pendingRequests.find(r => r.id === requestId);
    setSelectedRequest(request);
    setRejectReason('');
    setShowRejectModal(true);
  };

  // Confirm reject
  const confirmRejectRequest = () => {
    if (!rejectReason.trim()) {
      showToast('Please provide a rejection reason', 'error', 'Validation Error');
      return;
    }

    const updatedRequests = pendingRequests.map(req => {
      if (req.id === selectedRequest.id) {
        return { ...req, status: 'rejected', rejectionReason: rejectReason };
      }
      return req;
    });
    setPendingRequests(updatedRequests);
    showToast(`Request ${selectedRequest.id} rejected`, 'error', 'Request Rejected');
    setShowRejectModal(false);
    setRejectReason('');
  };

  // Filter requests by date
  const getFilteredRequests = () => {
    let filtered = [...pendingRequests];

    if (dateFilters.requestsFrom) {
      filtered = filtered.filter(req => new Date(req.date) >= new Date(dateFilters.requestsFrom));
    }
    if (dateFilters.requestsTo) {
      filtered = filtered.filter(req => new Date(req.date) <= new Date(dateFilters.requestsTo));
    }

    return filtered;
  };

  // Filter purchase orders
  const getFilteredPurchaseOrders = () => {
    let filtered = [...purchaseOrders];

    // Filter by status
    if (currentPurchaseFilter !== 'all') {
      filtered = filtered.filter(po => po.status === currentPurchaseFilter);
    }

    // Filter by date
    if (dateFilters.purchasesFrom) {
      filtered = filtered.filter(po => new Date(po.date) >= new Date(dateFilters.purchasesFrom));
    }
    if (dateFilters.purchasesTo) {
      filtered = filtered.filter(po => new Date(po.date) <= new Date(dateFilters.purchasesTo));
    }

    return filtered;
  };

  // Pagination
  const filteredRequests = getFilteredRequests();
  const filteredPurchaseOrders = getFilteredPurchaseOrders();
  
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredRequests.length);
  const paginatedRequests = filteredRequests.slice(startIndex, endIndex);

  // Refresh dashboard
  const handleRefresh = () => {
    showToast('Dashboard refreshed successfully!', 'success', 'Refreshed');
    setCurrentPage(1);
  };

  // Chart data
  const stockDistributionChartData = {
    labels: stockDistributionData.map(item => item.category),
    datasets: [{
      data: stockDistributionData.map(item => item.quantity),
      backgroundColor: stockDistributionData.map(item => item.color),
      borderWidth: 2,
      borderColor: '#fff'
    }]
  };

  const purchaseTrendsChartData = {
    labels: purchaseTrendsData.map(item => formatDate(item.date)),
    datasets: [{
      label: 'Purchase Amount',
      data: purchaseTrendsData.map(item => item.amount),
      borderColor: '#0CC0BC',
      backgroundColor: 'rgba(12, 192, 188, 0.1)',
      tension: 0.4,
      fill: true,
      pointRadius: 4,
      pointBackgroundColor: '#0CC0BC'
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: { size: 13, weight: 'bold' },
        bodyFont: { size: 12 }
      }
    }
  };

  const lineChartOptions = {
    ...chartOptions,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return '₹' + (value / 1000) + 'K';
          }
        }
      }
    }
  };

  // Pagination controls
  const renderPagination = () => {
    const pageNumbers = [];
    const maxPages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPages / 2));
    let endPage = Math.min(totalPages, startPage + maxPages - 1);
    
    if (endPage - startPage < maxPages - 1) {
      startPage = Math.max(1, endPage - maxPages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          className={`px-3 py-1.5 border-2 rounded-md text-sm font-semibold transition-all duration-200 min-w-[2.5rem] ${
            i === currentPage
              ? 'bg-gradient-to-br from-teal-400 to-teal-700 text-white border-transparent'
              : 'bg-white text-gray-700 border-gray-200 hover:border-teal-400 hover:text-teal-600'
          }`}
          onClick={() => setCurrentPage(i)}
        >
          {i}
        </button>
      );
    }
    
    return pageNumbers;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-gray-50 to-cyan-50">
      {/* Main Content */}
      <main className="p-5">
        {/* Header */}
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6 p-4 lg:p-5 bg-white rounded-xl shadow-sm border border-gray-200">
          <div>
            <h1 className="text-xl lg:text-2xl font-extrabold bg-gradient-to-br from-teal-400 to-teal-700 bg-clip-text text-transparent mb-1">
              Dashboard Overview
            </h1>
            <p className="text-xs lg:text-sm text-gray-500 font-medium">
              Real-time inventory & purchase tracking
            </p>
          </div>
          <div className="flex items-center gap-2.5 w-full lg:w-auto">
            <select
              value={currentPeriod}
              onChange={(e) => setCurrentPeriod(e.target.value)}
              className="px-3 py-2 border-2 border-gray-200 rounded-md bg-white text-gray-800 text-xs lg:text-sm font-semibold cursor-pointer focus:outline-none focus:border-teal-400 focus:ring-4 focus:ring-cyan-100 transition-all duration-200"
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
            <button
              onClick={handleRefresh}
              className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-br from-teal-400 to-teal-700 text-white rounded-md text-xs lg:text-sm font-semibold hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200"
            >
              <i className="fas fa-sync-alt"></i>
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </header>

        {/* Stats Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
          {/* Stock Flow Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:-translate-y-1 hover:shadow-lg transition-all duration-200">
            <div className="h-1 bg-gradient-to-r from-teal-400 to-teal-700"></div>
            <div className="p-4">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-600">
                  <i className="fas fa-exchange-alt text-base text-teal-600"></i>
                  Stock Flow
                </div>
              </div>
              <div className="flex items-center justify-around my-4">
                <div className="text-center">
                  <div className="text-3xl font-extrabold text-green-600 mb-1.5">{stockFlowData.stockIn}</div>
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">In</div>
                </div>
                <div className="w-0.5 h-12 bg-gray-200"></div>
                <div className="text-center">
                  <div className="text-3xl font-extrabold text-red-600 mb-1.5">{stockFlowData.stockOut}</div>
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Out</div>
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs font-semibold text-green-600">
                <i className="fas fa-arrow-up text-xs"></i>
                <span>{stockFlowData.netFlow}% net inflow</span>
              </div>
            </div>
          </div>

          {/* Purchases Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:-translate-y-1 hover:shadow-lg transition-all duration-200">
            <div className="h-1 bg-gradient-to-r from-teal-400 to-teal-700"></div>
            <div className="p-4">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-600">
                  <i className="fas fa-shopping-cart text-base text-teal-600"></i>
                  Purchases
                </div>
              </div>
              <div className="text-3xl font-extrabold text-gray-800 mb-1.5">{formatCurrency(purchasesData.value)}</div>
              <div className="flex items-center gap-1 text-xs font-semibold text-green-600">
                <i className="fas fa-arrow-up text-xs"></i>
                <span>{purchasesData.growth}% growth</span>
              </div>
            </div>
          </div>

          {/* Pending Requests Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:-translate-y-1 hover:shadow-lg transition-all duration-200">
            <div className="h-1 bg-gradient-to-r from-teal-400 to-teal-700"></div>
            <div className="p-4">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-600">
                  <i className="fas fa-clipboard-list text-base text-teal-600"></i>
                  Pending Requests
                </div>
              </div>
              <div className="text-3xl font-extrabold text-gray-800 mb-1.5">{pendingRequestsData.value}</div>
              <div className="flex items-center gap-1 text-xs font-semibold text-yellow-600">
                <i className="fas fa-plus text-xs"></i>
                <span>+{pendingRequestsData.newToday} New Today</span>
              </div>
            </div>
          </div>

          {/* Low Stock Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:-translate-y-1 hover:shadow-lg transition-all duration-200">
            <div className="h-1 bg-gradient-to-r from-teal-400 to-teal-700"></div>
            <div className="p-4">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-600">
                  <i className="fas fa-exclamation-triangle text-base text-teal-600"></i>
                  Low Stock
                </div>
              </div>
              <div className="text-3xl font-extrabold text-gray-800 mb-1.5">{lowStockData.value}</div>
              <div className="flex items-center gap-1 text-xs font-semibold text-red-600">
                <i className="fas fa-exclamation-circle text-xs"></i>
                <span>{lowStockData.critical} Critical</span>
              </div>
            </div>
          </div>
        </section>

        {/* Charts Section */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          {/* Stock Distribution Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:-translate-y-1 hover:shadow-lg transition-all duration-200">
            <div className="mb-4">
              <div className="flex items-center gap-1.5 text-sm font-bold text-gray-800 mb-1">
                <i className="fas fa-chart-pie text-base text-teal-600"></i>
                Stock Distribution
              </div>
              <div className="text-2xl font-extrabold text-gray-800">
                {stockDistributionData.reduce((sum, item) => sum + item.quantity, 0).toLocaleString()} Items
              </div>
              <div className="text-xs text-gray-500 font-medium">{stockDistributionData.length} categories</div>
            </div>
            <div className="h-[200px] mb-4">
              <Pie data={stockDistributionChartData} options={chartOptions} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              {stockDistributionData.slice(0, 4).map((item, index) => (
                <div key={index} className="flex items-center gap-1.5 text-xs text-gray-600">
                  <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: item.color }}></div>
                  <span className="truncate">{item.category}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Purchase Trends Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:-translate-y-1 hover:shadow-lg transition-all duration-200">
            <div className="mb-4">
              <div className="flex items-center gap-1.5 text-sm font-bold text-gray-800 mb-1">
                <i className="fas fa-chart-line text-base text-teal-600"></i>
                Purchase Trends
              </div>
              <div className="text-2xl font-extrabold text-gray-800">
                {formatCurrency(purchaseTrendsData[purchaseTrendsData.length - 1]?.amount || 0)}
              </div>
              <div className="text-xs text-gray-500 font-medium">18.2% growth</div>
            </div>
            <div className="h-[150px] mb-4">
              <Line data={purchaseTrendsChartData} options={lineChartOptions} />
            </div>
            <div className="flex flex-col gap-1.5 p-3 bg-gray-50 rounded-md">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500 font-medium">Current:</span>
                <span className="text-xs font-bold text-gray-800">{formatCurrency(purchaseTrendsData[purchaseTrendsData.length - 1]?.amount || 0)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500 font-medium">Previous:</span>
                <span className="text-xs font-bold text-gray-800">{formatCurrency(purchaseTrendsData[purchaseTrendsData.length - 2]?.amount || 0)}</span>
              </div>
            </div>
          </div>

          {/* Top Vendors */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:-translate-y-1 hover:shadow-lg transition-all duration-200">
            <div className="mb-4">
              <div className="flex items-center gap-1.5 text-sm font-bold text-gray-800 mb-1">
                <i className="fas fa-store text-base text-teal-600"></i>
                Top Vendors
              </div>
              <div className="text-2xl font-extrabold text-gray-800">{topVendorsData[0]?.rating || 0}%</div>
              <div className="text-xs text-gray-500 font-medium">Best Rating</div>
            </div>
            <div className="space-y-3 mb-4">
              {topVendorsData.slice(0, 5).map((vendor, index) => (
                <div key={index} className="flex items-center gap-2.5">
                  <div className="flex-1">
                    <div className="text-xs font-semibold text-gray-800 mb-1">{vendor.name}</div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-teal-400 to-teal-600 rounded-full transition-all duration-500"
                        style={{ width: `${(vendor.rating / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="text-xs font-bold text-teal-600">{vendor.rating}</div>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-1.5 p-3 bg-gray-50 rounded-md">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500 font-medium">Best:</span>
                <span className="text-xs font-bold text-gray-800">{topVendorsData[0]?.name || '-'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500 font-medium">Active:</span>
                <span className="text-xs font-bold text-gray-800">{topVendorsData.length}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Product Requests Table */}
        <section className="mb-6">
          <div className="bg-white rounded-t-xl border border-gray-200 border-b-0">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3 p-4">
              <div className="flex items-center gap-2">
                <i className="fas fa-clipboard-list text-lg text-teal-600"></i>
                <h2 className="text-base font-bold text-gray-800">Product Requests Summary</h2>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-2">
                  <label className="text-xs text-gray-500 font-medium flex items-center gap-1">
                    <i className="fas fa-calendar-alt"></i>
                    From:
                  </label>
                  <input
                    type="date"
                    value={dateFilters.requestsFrom}
                    onChange={(e) => setDateFilters({...dateFilters, requestsFrom: e.target.value})}
                    className="px-2.5 py-1.5 border border-gray-200 rounded-md text-xs focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-cyan-100"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs text-gray-500 font-medium flex items-center gap-1">
                    <i className="fas fa-calendar-alt"></i>
                    To:
                  </label>
                  <input
                    type="date"
                    value={dateFilters.requestsTo}
                    onChange={(e) => setDateFilters({...dateFilters, requestsTo: e.target.value})}
                    className="px-2.5 py-1.5 border border-gray-200 rounded-md text-xs focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-cyan-100"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">Request ID</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">Employee</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">Items Requested</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">Quantity</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedRequests.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-4 py-12 text-center">
                      <div className="text-5xl text-gray-300 mb-3">
                        <i className="fas fa-inbox"></i>
                      </div>
                      <div className="text-lg font-bold text-gray-800 mb-1">No Requests Found</div>
                      <div className="text-xs text-gray-500">No product requests match your filters</div>
                    </td>
                  </tr>
                ) : (
                  paginatedRequests.map((request) => (
                    <tr key={request.id} className="border-t border-gray-100 hover:bg-cyan-50 transition-colors duration-150">
                      <td className="px-4 py-3 text-xs font-semibold text-gray-800 whitespace-nowrap">{request.id}</td>
                      <td className="px-4 py-3 text-xs text-gray-700 whitespace-nowrap">{request.employee}</td>
                      <td className="px-4 py-3 text-xs text-gray-700">{truncateText(request.items, 30)}</td>
                      <td className="px-4 py-3 text-xs text-gray-700 whitespace-nowrap">{request.quantity}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wide ${
                          request.status === 'pending' ? 'bg-yellow-50 text-yellow-700' :
                          request.status === 'approved' ? 'bg-green-50 text-green-600' :
                          request.status === 'delivered' ? 'bg-blue-50 text-blue-600' :
                          'bg-red-50 text-red-600'
                        }`}>
                          {request.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-700 whitespace-nowrap">{request.date}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex gap-1.5 flex-wrap">
                          <button
                            onClick={() => handleViewRequest(request)}
                            className="px-2.5 py-1.5 bg-blue-50 text-blue-600 rounded text-xs font-semibold hover:bg-blue-100 transition-all duration-200"
                          >
                            <i className="fas fa-eye"></i>
                          </button>
                          {request.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleApproveRequest(request.id)}
                                className="px-2.5 py-1.5 bg-green-50 text-green-600 rounded text-xs font-semibold hover:bg-green-100 transition-all duration-200"
                              >
                                <i className="fas fa-check"></i>
                              </button>
                              <button
                                onClick={() => handleRejectRequest(request.id)}
                                className="px-2.5 py-1.5 bg-red-50 text-red-600 rounded text-xs font-semibold hover:bg-red-100 transition-all duration-200"
                              >
                                <i className="fas fa-times"></i>
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filteredRequests.length > 0 && (
            <div className="flex justify-between items-center px-4 py-3 bg-white border border-gray-200 border-t-0 rounded-b-xl">
              <div className="text-xs text-gray-500">
                {startIndex + 1}-{endIndex} of {filteredRequests.length}
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-2.5 py-1.5 border-2 border-gray-200 bg-white rounded-md text-xs font-semibold text-gray-700 hover:border-teal-400 hover:text-teal-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <i className="fas fa-chevron-left"></i>
                </button>
                <div className="flex gap-1">
                  {renderPagination()}
                </div>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="px-2.5 py-1.5 border-2 border-gray-200 bg-white rounded-md text-xs font-semibold text-gray-700 hover:border-teal-400 hover:text-teal-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Purchase Orders Table */}
        <section className="mb-6">
          <div className="bg-white rounded-t-xl border border-gray-200 border-b-0">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3 p-4">
              <div className="flex items-center gap-2">
                <i className="fas fa-shopping-cart text-lg text-teal-600"></i>
                <h2 className="text-base font-bold text-gray-800">Recent Purchase Orders</h2>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex gap-1.5">
                  {['all', 'pending', 'in-transit', 'delivered'].map(filter => (
                    <button
                      key={filter}
                      onClick={() => setCurrentPurchaseFilter(filter)}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-200 ${
                        currentPurchaseFilter === filter
                          ? 'bg-gradient-to-br from-teal-400 to-teal-700 text-white'
                          : 'bg-white text-gray-600 border border-gray-200 hover:border-teal-400 hover:text-teal-600'
                      }`}
                    >
                      <i className={`fas fa-${
                        filter === 'all' ? 'list' :
                        filter === 'pending' ? 'clock' :
                        filter === 'in-transit' ? 'truck' : 'check-circle'
                      }`}></i>
                      <span className="capitalize">{filter === 'in-transit' ? 'In Transit' : filter}</span>
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs text-gray-500 font-medium flex items-center gap-1">
                    <i className="fas fa-calendar-alt"></i>
                    From:
                  </label>
                  <input
                    type="date"
                    value={dateFilters.purchasesFrom}
                    onChange={(e) => setDateFilters({...dateFilters, purchasesFrom: e.target.value})}
                    className="px-2.5 py-1.5 border border-gray-200 rounded-md text-xs focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-cyan-100"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs text-gray-500 font-medium flex items-center gap-1">
                    <i className="fas fa-calendar-alt"></i>
                    To:
                  </label>
                  <input
                    type="date"
                    value={dateFilters.purchasesTo}
                    onChange={(e) => setDateFilters({...dateFilters, purchasesTo: e.target.value})}
                    className="px-2.5 py-1.5 border border-gray-200 rounded-md text-xs focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-cyan-100"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-b-xl overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">PO Number</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">Vendor</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">Items</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPurchaseOrders.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-4 py-12 text-center">
                      <div className="text-5xl text-gray-300 mb-3">
                        <i className="fas fa-inbox"></i>
                      </div>
                      <div className="text-lg font-bold text-gray-800 mb-1">No Purchase Orders Found</div>
                      <div className="text-xs text-gray-500">No purchase orders match your filters</div>
                    </td>
                  </tr>
                ) : (
                  filteredPurchaseOrders.slice(0, 10).map((po) => (
                    <tr key={po.poNumber} className="border-t border-gray-100 hover:bg-cyan-50 transition-colors duration-150">
                      <td className="px-4 py-3 text-xs font-semibold text-gray-800 whitespace-nowrap">{po.poNumber}</td>
                      <td className="px-4 py-3 text-xs text-gray-700 whitespace-nowrap">{po.vendor}</td>
                      <td className="px-4 py-3 text-xs text-gray-700">{truncateText(po.items, 35)}</td>
                      <td className="px-4 py-3 text-xs font-semibold text-gray-800 whitespace-nowrap">{formatCurrency(po.amount)}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wide ${
                          po.status === 'pending' ? 'bg-yellow-50 text-yellow-700' :
                          po.status === 'in-transit' ? 'bg-blue-50 text-blue-600' :
                          'bg-green-50 text-green-600'
                        }`}>
                          {po.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-700 whitespace-nowrap">{po.date}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <button
                          onClick={() => handleViewPO(po)}
                          className="px-2.5 py-1.5 bg-blue-50 text-blue-600 rounded text-xs font-semibold hover:bg-blue-100 transition-all duration-200"
                        >
                          <i className="fas fa-eye"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Recent Activities & Notifications */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Recent Activities */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b-2 border-gray-100">
              <i className="fas fa-history text-lg text-teal-600"></i>
              <h2 className="text-base font-bold text-gray-800">Recent Activities</h2>
            </div>
            <div className="space-y-3">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex gap-3 p-3 rounded-lg hover:bg-gray-50 transition-all duration-200">
                  <div className={`w-10 h-10 flex items-center justify-center rounded-full flex-shrink-0 ${
                    activity.iconType === 'success' ? 'bg-green-50 text-green-600' :
                    activity.iconType === 'warning' ? 'bg-yellow-50 text-yellow-600' :
                    'bg-blue-50 text-blue-600'
                  }`}>
                    <i className={activity.icon}></i>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-gray-800 mb-0.5">{activity.title}</div>
                    <div className="text-xs text-gray-500">{activity.description}</div>
                    <div className="text-xs text-gray-400 mt-1">{activity.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b-2 border-gray-100">
              <i className="fas fa-bell text-lg text-teal-600"></i>
              <h2 className="text-base font-bold text-gray-800">Notifications</h2>
            </div>
            <div className="space-y-3">
              {notifications.map((notification, index) => (
                <div key={index} className="flex gap-3 p-3 rounded-lg border-l-4 hover:bg-gray-50 transition-all duration-200"
                  style={{ 
                    borderColor: 
                      notification.priority === 'critical' ? '#E74C3C' :
                      notification.priority === 'high' ? '#FDCB6E' :
                      notification.priority === 'medium' ? '#3498DB' : '#00B894'
                  }}>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-gray-800 mb-0.5">{notification.title}</div>
                    <div className="text-xs text-gray-600">{notification.body}</div>
                    <div className="text-xs text-gray-400 mt-1">{notification.time}</div>
                  </div>
                  <div className={`px-2 py-1 rounded text-xs font-bold h-fit ${
                    notification.priority === 'critical' ? 'bg-red-50 text-red-600' :
                    notification.priority === 'high' ? 'bg-yellow-50 text-yellow-700' :
                    notification.priority === 'medium' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'
                  }`}>
                    {notification.priority}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Modals */}
      <DashboardModals
        showViewRequestModal={showViewRequestModal}
        setShowViewRequestModal={setShowViewRequestModal}
        showViewPOModal={showViewPOModal}
        setShowViewPOModal={setShowViewPOModal}
        showRejectModal={showRejectModal}
        setShowRejectModal={setShowRejectModal}
        showConfirmModal={showConfirmModal}
        setShowConfirmModal={setShowConfirmModal}
        selectedRequest={selectedRequest}
        selectedPO={selectedPO}
        confirmAction={confirmAction}
        rejectReason={rejectReason}
        setRejectReason={setRejectReason}
        confirmRejectRequest={confirmRejectRequest}
        formatCurrency={formatCurrency}
        formatDate={formatDate}
      />

      {/* Toast Notifications */}
      <div className="fixed top-5 right-5 z-[10001] flex flex-col gap-2 max-w-sm">
        {toasts.map(toast => (
          <div 
            key={toast.id} 
            className={`flex items-center gap-3 p-3 bg-white rounded-lg shadow-lg border-l-4 animate-slideInRight ${
              toast.type === 'success' ? 'border-green-500' :
              toast.type === 'error' ? 'border-red-500' :
              toast.type === 'warning' ? 'border-yellow-500' :
              'border-blue-500'
            }`}
          >
            <div className={`text-lg ${
              toast.type === 'success' ? 'text-green-600' :
              toast.type === 'error' ? 'text-red-600' :
              toast.type === 'warning' ? 'text-yellow-600' :
              'text-blue-600'
            }`}>
              <i className={`fas fa-${
                toast.type === 'success' ? 'check-circle' :
                toast.type === 'error' ? 'times-circle' :
                toast.type === 'warning' ? 'exclamation-triangle' :
                'info-circle'
              }`}></i>
            </div>
            <div className="flex-1">
              {toast.title && <div className="text-xs font-bold text-gray-800">{toast.title}</div>}
              <div className="text-xs text-gray-600">{toast.message}</div>
            </div>
            <button
              className="text-gray-400 hover:bg-gray-100 hover:text-gray-700 p-1 rounded transition-all duration-200"
              onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
            >
              <i className="fas fa-times text-xs"></i>
            </button>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes slideInRight {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slideInRight {
          animation: slideInRight 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
