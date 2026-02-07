// src/pages/Report.jsx
import React, { useState, useEffect } from 'react';
import { useReportData } from '../data/ReportData';
import ReportModals from '../modals/ReportModals';

const Report = () => {
  // Import data and functions from custom hook
  const {
    reportConfigs,
    filterDefinitions,
    currentReport,
    setCurrentReport,
    reportData,
    setReportData,
    filteredData,
    setFilteredData,
    currentFilters,
    setCurrentFilters,
    searchQuery,
    setSearchQuery,
    sortColumn,
    setSortColumn,
    sortDirection,
    setSortDirection,
    getFilteredReportData,
    generateSampleReportData,
    resetFilters
  } = useReportData();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  // UI state
  const [showFiltersPanel, setShowFiltersPanel] = useState(false);
  const [showReportContainer, setShowReportContainer] = useState(false);
  const [filtersExpanded, setFiltersExpanded] = useState(true);

  // Modal states
  const [showFilterPresetModal, setShowFilterPresetModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  // Toast state
  const [toasts, setToasts] = useState([]);

  // Date range state for quick date buttons
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [activeQuickDate, setActiveQuickDate] = useState('last30days');

  // Get paginated data
  const totalPages = pageSize === 'all' ? 1 : Math.ceil(filteredData.length / parseInt(pageSize));
  const startIndex = pageSize === 'all' ? 0 : (currentPage - 1) * parseInt(pageSize);
  const endIndex = pageSize === 'all' ? filteredData.length : Math.min(startIndex + parseInt(pageSize), filteredData.length);
  const paginatedData = filteredData.slice(startIndex, endIndex);

  // Initialize last 30 days date range on mount
  useEffect(() => {
    setQuickDate('last30days');
  }, []);

  // Update filtered data when filters or search changes
  useEffect(() => {
    if (currentReport) {
      const filtered = getFilteredReportData();
      setFilteredData(filtered);
      setCurrentPage(1);
    }
  }, [currentFilters, searchQuery, sortColumn, sortDirection, reportData]);

  // Toast notification function
  const showToast = (message, type = 'info', title = '') => {
    const id = Date.now();
    const toast = { id, message, type, title };
    setToasts(prev => [...prev, toast]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Format currency
  const formatCurrency = (value) => {
    if (typeof value === 'string' && value.startsWith('₹')) return value;
    return `₹${parseFloat(value || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Handle report selection
  const handleSelectReport = (reportType) => {
    const report = reportConfigs[reportType];
    if (!report) return;

    setCurrentReport({ ...report, type: reportType });
    setShowFiltersPanel(true);
    setShowReportContainer(true);
    setCurrentFilters({});
    setSearchQuery('');
    setSortColumn(null);
    setSortDirection('asc');
    setCurrentPage(1);

    // Generate sample data for selected report
    const sampleData = generateSampleReportData(reportType);
    setReportData(sampleData);
    setFilteredData(sampleData);

    showToast(`${report.title} loaded successfully!`, 'success');
  };

  // Quick date range setter
  const setQuickDate = (period) => {
    const today = new Date();
    let startDate = new Date();
    let endDate = new Date();

    switch (period) {
      case 'today':
        startDate = today;
        endDate = today;
        break;
      case 'yesterday':
        startDate.setDate(today.getDate() - 1);
        endDate.setDate(today.getDate() - 1);
        break;
      case 'last7days':
        startDate.setDate(today.getDate() - 7);
        break;
      case 'last30days':
        startDate.setDate(today.getDate() - 30);
        break;
      case 'thisMonth':
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        break;
      case 'lastMonth':
        startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        endDate = new Date(today.getFullYear(), today.getMonth(), 0);
        break;
      default:
        break;
    }

    setDateFrom(startDate.toISOString().split('T')[0]);
    setDateTo(endDate.toISOString().split('T')[0]);
    setActiveQuickDate(period);
  };

  // Handle filter change
  const handleFilterChange = (filterKey, value) => {
    setCurrentFilters(prev => ({
      ...prev,
      [filterKey]: value
    }));
  };

  // Apply filters
  const handleApplyFilters = () => {
    const newFilters = {
      ...currentFilters,
      dateFrom,
      dateTo
    };
    setCurrentFilters(newFilters);
    showToast('Filters applied successfully!', 'success');
  };

  // Reset all filters
  const handleResetFilters = () => {
    resetFilters();
    setDateFrom('');
    setDateTo('');
    setActiveQuickDate('');
    setQuickDate('last30days');
    showToast('All filters have been reset', 'info');
  };

  // Handle search in table
  const handleSearchInReport = (value) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  // Handle column sort
  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  // Handle page change
  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle page size change
  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  // Export to Excel (CSV for now)
  const handleExportExcel = () => {
    if (filteredData.length === 0) {
      showToast('No data to export', 'warning', 'Export Failed');
      return;
    }

    try {
      // Create CSV header
      let csv = currentReport.columns.map(col => `"${col}"`).join(',') + '\n';

      // Add data rows
      filteredData.forEach(row => {
        const values = currentReport.columns.map(col => {
          const value = row[col] || '-';
          return `"${String(value).replace(/"/g, '""')}"`;
        });
        csv += values.join(',') + '\n';
      });

      // Download file
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${currentReport.type}_report_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      showToast(`Exported ${filteredData.length} records successfully!`, 'success', 'Export Complete');
    } catch (error) {
      showToast('Failed to export data', 'error', 'Export Error');
    }
  };

  // Refresh report
  const handleRefresh = () => {
    if (currentReport) {
      const sampleData = generateSampleReportData(currentReport.type);
      setReportData(sampleData);
      setFilteredData(sampleData);
      showToast('Report refreshed successfully!', 'success');
    }
  };

  // Get status badge color
  const getStatusBadgeColor = (status) => {
    const statusLower = String(status).toLowerCase();
    if (statusLower.includes('normal') || statusLower.includes('completed') || statusLower.includes('approved') || statusLower.includes('passed')) {
      return 'bg-green-50 text-green-600';
    }
    if (statusLower.includes('pending') || statusLower.includes('draft')) {
      return 'bg-yellow-50 text-yellow-700';
    }
    if (statusLower.includes('critical') || statusLower.includes('low stock') || statusLower.includes('out of stock') || statusLower.includes('rejected') || statusLower.includes('failed')) {
      return 'bg-red-50 text-red-600';
    }
    if (statusLower.includes('progress') || statusLower.includes('partial')) {
      return 'bg-blue-50 text-blue-600';
    }
    return 'bg-gray-50 text-gray-600';
  };

  // Render pagination controls
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
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }

    return pageNumbers;
  };

  // Render filter input based on type
  const renderFilterInput = (filterKey) => {
    const filterDef = filterDefinitions[filterKey];
    if (!filterDef) return null;

    if (filterDef.type === 'select') {
      return (
        <div key={filterKey} className="flex flex-col">
          <label className="text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-2">
            <i className={`fas ${filterDef.icon} text-teal-600`}></i>
            {filterDef.label}
          </label>
          <select
            className="px-3 py-2 border-2 border-gray-200 rounded-md text-sm bg-white cursor-pointer focus:outline-none focus:border-teal-400 focus:ring-4 focus:ring-cyan-100 transition-all duration-200"
            value={currentFilters[filterKey] || filterDef.options[0]}
            onChange={(e) => handleFilterChange(filterKey, e.target.value)}
          >
            {filterDef.options.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
      );
    }

    if (filterKey === 'dateRange') {
      return (
        <div key={filterKey} className="md:col-span-2 flex flex-col">
          <label className="text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-2">
            <i className="fas fa-calendar-alt text-teal-600"></i>
            Date Range
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {['today', 'yesterday', 'last7days', 'last30days', 'thisMonth', 'lastMonth'].map(period => (
              <button
                key={period}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-200 ${
                  activeQuickDate === period
                    ? 'bg-teal-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-cyan-50 hover:text-teal-600'
                }`}
                onClick={() => setQuickDate(period)}
              >
                {period === 'last7days' ? 'Last 7 Days' :
                 period === 'last30days' ? 'Last 30 Days' :
                 period === 'thisMonth' ? 'This Month' :
                 period === 'lastMonth' ? 'Last Month' :
                 period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <input
              type="date"
              className="flex-1 px-3 py-2 border-2 border-gray-200 rounded-md text-sm focus:outline-none focus:border-teal-400 focus:ring-4 focus:ring-cyan-100 transition-all duration-200"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />
            <span className="text-sm text-gray-500 font-semibold">to</span>
            <input
              type="date"
              className="flex-1 px-3 py-2 border-2 border-gray-200 rounded-md text-sm focus:outline-none focus:border-teal-400 focus:ring-4 focus:ring-cyan-100 transition-all duration-200"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
            />
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="p-5 bg-gray-50 min-h-screen">
      {/* Page Header */}
      <header className="flex justify-between items-center mb-5 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-800 flex items-center gap-2">
            <i className="fas fa-chart-bar text-teal-600"></i>
            Reports & Analytics
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Comprehensive reporting system with advanced filtering and export capabilities
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-green-50 text-green-600 rounded-full text-xs font-semibold">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Real-time Data
            </span>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            className="inline-flex items-center gap-2 px-4 py-2 bg-white text-gray-700 border-2 border-gray-200 rounded-md text-sm font-semibold hover:border-teal-400 hover:text-teal-600 transition-all duration-200"
            onClick={handleRefresh}
            disabled={!currentReport}
          >
            <i className="fas fa-sync-alt"></i>
            Refresh
          </button>
        </div>
      </header>

      {/* Report Type Selector */}
      <section className="mb-5">
        {/* Inventory Reports */}
        <div className="bg-white rounded-lg p-4 shadow-md mb-4 hover:shadow-lg transition-all duration-200">
          <h3 className="text-base font-bold text-gray-800 mb-3 flex items-center gap-2 pb-3 border-b-2 border-gray-100">
            <i className="fas fa-warehouse text-teal-600"></i>
            Inventory Reports
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
            {['stock-summary', 'stock-movement', 'low-stock', 'rack-location', 'stock-aging', 'internal-external'].map(reportType => {
              const report = reportConfigs[reportType];
              return (
                <button
                  key={reportType}
                  className={`inline-flex flex-col items-center gap-2 p-3 rounded-lg border-2 text-xs font-semibold transition-all duration-200 ${
                    currentReport?.type === reportType
                      ? 'bg-gradient-to-br from-teal-400 to-teal-700 text-white border-transparent shadow-md'
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-teal-400 hover:text-teal-600 hover:bg-cyan-50'
                  }`}
                  onClick={() => handleSelectReport(reportType)}
                >
                  <i className={`${report.icon} text-lg`}></i>
                  <span className="text-center leading-tight">{report.title.replace(' Report', '')}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Purchase Reports */}
        <div className="bg-white rounded-lg p-4 shadow-md mb-4 hover:shadow-lg transition-all duration-200">
          <h3 className="text-base font-bold text-gray-800 mb-3 flex items-center gap-2 pb-3 border-b-2 border-gray-100">
            <i className="fas fa-shopping-cart text-green-600"></i>
            Purchase Reports
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
            {['po-summary', 'grn-report', 'vendor-performance', 'purchase-returns', 'auto-po'].map(reportType => {
              const report = reportConfigs[reportType];
              return (
                <button
                  key={reportType}
                  className={`inline-flex flex-col items-center gap-2 p-3 rounded-lg border-2 text-xs font-semibold transition-all duration-200 ${
                    currentReport?.type === reportType
                      ? 'bg-gradient-to-br from-teal-400 to-teal-700 text-white border-transparent shadow-md'
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-teal-400 hover:text-teal-600 hover:bg-cyan-50'
                  }`}
                  onClick={() => handleSelectReport(reportType)}
                >
                  <i className={`${report.icon} text-lg`}></i>
                  <span className="text-center leading-tight">{report.title.replace(' Report', '')}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Request & Approval Reports */}
        <div className="bg-white rounded-lg p-4 shadow-md mb-4 hover:shadow-lg transition-all duration-200">
          <h3 className="text-base font-bold text-gray-800 mb-3 flex items-center gap-2 pb-3 border-b-2 border-gray-100">
            <i className="fas fa-tasks text-blue-600"></i>
            Request & Approval Reports
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
            {['pending-requests', 'request-history', 'approval-workflow', 'supervisor-requests', 'fulfillment-time'].map(reportType => {
              const report = reportConfigs[reportType];
              return (
                <button
                  key={reportType}
                  className={`inline-flex flex-col items-center gap-2 p-3 rounded-lg border-2 text-xs font-semibold transition-all duration-200 ${
                    currentReport?.type === reportType
                      ? 'bg-gradient-to-br from-teal-400 to-teal-700 text-white border-transparent shadow-md'
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-teal-400 hover:text-teal-600 hover:bg-cyan-50'
                  }`}
                  onClick={() => handleSelectReport(reportType)}
                >
                  <i className={`${report.icon} text-lg`}></i>
                  <span className="text-center leading-tight">{report.title.replace(' Report', '')}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Operational Reports */}
        <div className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-all duration-200">
          <h3 className="text-base font-bold text-gray-800 mb-3 flex items-center gap-2 pb-3 border-b-2 border-gray-100">
            <i className="fas fa-cogs text-orange-600"></i>
            Operational Reports
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
            {['branch-wise', 'delivery-challan', 'scrap-management', 'maintenance-tracking', 'audit-trail'].map(reportType => {
              const report = reportConfigs[reportType];
              return (
                <button
                  key={reportType}
                  className={`inline-flex flex-col items-center gap-2 p-3 rounded-lg border-2 text-xs font-semibold transition-all duration-200 ${
                    currentReport?.type === reportType
                      ? 'bg-gradient-to-br from-teal-400 to-teal-700 text-white border-transparent shadow-md'
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-teal-400 hover:text-teal-600 hover:bg-cyan-50'
                  }`}
                  onClick={() => handleSelectReport(reportType)}
                >
                  <i className={`${report.icon} text-lg`}></i>
                  <span className="text-center leading-tight">{report.title.replace(' Report', '')}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Advanced Filters Panel */}
      {showFiltersPanel && currentReport && (
        <section className="bg-white rounded-lg shadow-md mb-4 overflow-hidden">
          <div
            className="flex justify-between items-center px-5 py-4 bg-gradient-to-br from-teal-400 to-teal-700 text-white cursor-pointer"
            onClick={() => setFiltersExpanded(!filtersExpanded)}
          >
            <h3 className="text-base font-bold flex items-center gap-2">
              <i className="fas fa-filter"></i>
              Advanced Filters
            </h3>
            <button className="w-8 h-8 flex items-center justify-center bg-white/20 rounded-full hover:bg-white/30 transition-all duration-200">
              <i className={`fas fa-chevron-${filtersExpanded ? 'up' : 'down'} transition-transform duration-300`}></i>
            </button>
          </div>
          {filtersExpanded && (
            <div className="px-5 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                {currentReport.filters.map(filterKey => renderFilterInput(filterKey))}
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t-2 border-gray-100">
                <button
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-teal-400 to-teal-700 text-white rounded-md text-sm font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                  onClick={handleApplyFilters}
                >
                  <i className="fas fa-check"></i>
                  Apply Filters
                </button>
                <button
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white text-gray-700 border-2 border-gray-200 rounded-md text-sm font-semibold hover:border-orange-400 hover:text-orange-600 transition-all duration-200"
                  onClick={handleResetFilters}
                >
                  <i className="fas fa-redo"></i>
                  Reset
                </button>
                <button
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white text-gray-700 border-2 border-gray-200 rounded-md text-sm font-semibold hover:border-blue-400 hover:text-blue-600 transition-all duration-200"
                  onClick={() => setShowFilterPresetModal(true)}
                >
                  <i className="fas fa-save"></i>
                  Save Preset
                </button>
              </div>
            </div>
          )}
        </section>
      )}

      {/* Report Display Area */}
      {showReportContainer && currentReport && (
        <section className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Report Header */}
          <div className="flex justify-between items-center px-5 py-4 border-b-2 border-gray-100 flex-wrap gap-3">
            <div>
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <i className={`${currentReport.icon} text-teal-600`}></i>
                {currentReport.title}
              </h2>
              <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                <span>Total Records: <strong className="text-gray-800">{filteredData.length}</strong></span>
                <span>•</span>
                <span>Generated: <strong className="text-gray-800">{formatDate(new Date().toISOString())}</strong></span>
              </div>
            </div>
          </div>

          {/* Report Stats (if available) */}
          {currentReport.stats && (
            <div className="px-5 py-4 bg-gray-50 border-b-2 border-gray-100">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {currentReport.stats.map((stat, index) => (
                  <div key={index} className="bg-white rounded-lg p-3 border-l-4 border-teal-500 shadow-sm hover:shadow-md transition-all duration-200">
                    <div className="text-xs font-semibold text-gray-500 uppercase mb-1">{stat.replace(/([A-Z])/g, ' $1').trim()}</div>
                    <div className="text-xl font-extrabold text-gray-800">
                      {Math.floor(Math.random() * 1000)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Table Toolbar */}
          <div className="flex justify-between items-center px-5 py-3 border-b-2 border-gray-100 flex-wrap gap-3">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchInReport(e.target.value)}
                placeholder="Search in report..."
                className="w-full pl-10 pr-3 py-2 border-2 border-gray-200 rounded-md text-sm focus:outline-none focus:border-teal-400 focus:ring-4 focus:ring-cyan-100 transition-all duration-200"
              />
            </div>
            <div className="flex gap-2">
              <select
                className="px-3 py-2 border-2 border-gray-200 rounded-md text-sm bg-white cursor-pointer focus:outline-none focus:border-teal-400 transition-all duration-200"
                value={pageSize}
                onChange={(e) => handlePageSizeChange(e.target.value)}
              >
                <option value="10">10 rows</option>
                <option value="25">25 rows</option>
                <option value="50">50 rows</option>
                <option value="100">100 rows</option>
                <option value="all">All rows</option>
              </select>
            </div>
          </div>

          {/* Report Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  {currentReport.columns.map(column => (
                    <th
                      key={column}
                      className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase cursor-pointer hover:bg-gray-100 transition-colors duration-150"
                      onClick={() => handleSort(column)}
                    >
                      <div className="flex items-center gap-2">
                        {column}
                        {sortColumn === column && (
                          <i className={`fas fa-chevron-${sortDirection === 'asc' ? 'up' : 'down'} text-teal-600`}></i>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {paginatedData.length === 0 ? (
                  <tr>
                    <td colSpan={currentReport.columns.length} className="px-4 py-12 text-center">
                      <div>
                        <div className="text-5xl text-gray-300 mb-3">
                          <i className="fas fa-inbox"></i>
                        </div>
                        <div className="text-lg font-bold text-gray-800 mb-1">No Data Found</div>
                        <div className="text-xs text-gray-500">
                          {searchQuery ? 'Try adjusting your search or filters' : 'No records match your criteria'}
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((row, rowIndex) => (
                    <tr key={rowIndex} className="hover:bg-cyan-50 transition-colors duration-150">
                      {currentReport.columns.map(column => (
                        <td key={column} className="px-4 py-3 text-xs text-gray-700 whitespace-nowrap">
                          {column === 'Status' ? (
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(row[column])}`}>
                              {row[column]}
                            </span>
                          ) : column.toLowerCase().includes('date') ? (
                            formatDate(row[column])
                          ) : column.toLowerCase().includes('amount') || column.toLowerCase().includes('value') || column.toLowerCase().includes('price') || column.toLowerCase().includes('cost') ? (
                            <span className="font-semibold text-gray-800">{row[column]}</span>
                          ) : (
                            row[column]
                          )}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center px-5 py-3 border-t-2 border-gray-100 flex-wrap gap-3">
            <div className="text-xs text-gray-500">
              Showing {filteredData.length === 0 ? 0 : startIndex + 1}-{endIndex} of {filteredData.length}
            </div>
            <div className="flex items-center gap-2">
              <button
                className="px-2.5 py-1.5 border-2 border-gray-200 bg-white rounded-md text-xs font-semibold text-gray-700 hover:border-teal-400 hover:text-teal-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || pageSize === 'all'}
              >
                <i className="fas fa-chevron-left"></i>
              </button>
              <div className="flex gap-1">
                {pageSize !== 'all' && renderPagination()}
              </div>
              <button
                className="px-2.5 py-1.5 border-2 border-gray-200 bg-white rounded-md text-xs font-semibold text-gray-700 hover:border-teal-400 hover:text-teal-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || totalPages === 0 || pageSize === 'all'}
              >
                <i className="fas fa-chevron-right"></i>
              </button>
              <button
                className="ml-2 inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-green-500 to-green-700 text-white rounded-md text-sm font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                onClick={handleExportExcel}
                title="Export to Excel"
              >
                <i className="fas fa-file-excel"></i>
                Export Excel
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Empty State (when no report selected) */}
      {!currentReport && (
        <section className="bg-white rounded-lg shadow-md p-12 text-center">
          <div className="text-6xl text-gray-300 mb-4">
            <i className="fas fa-chart-bar"></i>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Select a Report Type</h2>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            Choose a report from the categories above to view comprehensive data with advanced filtering and export options.
          </p>
        </section>
      )}

      {/* Modals */}
      <ReportModals
        showFilterPresetModal={showFilterPresetModal}
        setShowFilterPresetModal={setShowFilterPresetModal}
        showExportModal={showExportModal}
        setShowExportModal={setShowExportModal}
        showToast={showToast}
        currentFilters={currentFilters}
        currentReport={currentReport}
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

      {/* Animations */}
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

export default Report;
