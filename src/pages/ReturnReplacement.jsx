// src/pages/ReturnReplacement.jsx
import React, { useState } from 'react';
import { useReturnReplacementData } from '../data/ReturnReplacementData';
import ReturnReplacementModals from '../modals/ReturnReplacementModals';

const ReturnReplacement = () => {
  // Import data and functions from custom hook
  const {
    returns,
    setReturns,
    stats,
    currentFilter,
    setCurrentFilter,
    currentTypeFilter,
    setCurrentTypeFilter,
    searchQuery,
    setSearchQuery,
    sortOrder,
    setSortOrder,
    getFilteredReturns,
    resetFilters
  } = useReturnReplacementData();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedReturn, setSelectedReturn] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  // Toast state
  const [toasts, setToasts] = useState([]);

  // Get filtered and paginated data
  const filteredReturns = getFilteredReturns();
  const totalPages = Math.ceil(filteredReturns.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredReturns.length);
  const paginatedReturns = filteredReturns.slice(startIndex, endIndex);

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
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Format status
  const formatStatus = (status) => {
    return status.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  // Truncate text
  const truncateText = (text, maxLength) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  // Handle filter by status
  const handleFilterByStatus = (status) => {
    setCurrentFilter(status);
    setCurrentPage(1);
    showToast(`Showing ${status === 'all' ? 'all' : status} returns`, 'info');
  };

  // Handle filter by type
  const handleFilterByType = (type) => {
    setCurrentTypeFilter(type);
    setCurrentPage(1);
    showToast(`Filtered by ${type === 'all' ? 'all types' : type + ' returns'}`, 'info');
  };

  // Handle search
  const handleSearch = (value) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  // Handle sort
  const handleSort = (value) => {
    setSortOrder(value);
  };

  // View return details
  const handleViewDetails = (returnData) => {
    setSelectedReturn(returnData);
    setShowViewModal(true);
  };

  // Approve return
  const handleApproveReturn = (returnId) => {
    setConfirmAction({
      title: 'Approve Return Request',
      message: `Are you sure you want to approve return request <strong>${returnId}</strong>?<br><br>This will move the request to <strong>In Progress</strong> status.`,
      onConfirm: () => {
        const updatedReturns = returns.map(ret => {
          if (ret.id === returnId) {
            return {
              ...ret,
              status: 'in-progress',
              approvedBy: 'Current User',
              timeline: [
                ...ret.timeline,
                {
                  status: 'Approved',
                  date: new Date().toISOString().split('T')[0],
                  time: new Date().toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit', 
                    hour12: true 
                  }),
                  type: 'success',
                  description: 'Return request approved and processing started'
                }
              ]
            };
          }
          return ret;
        });
        setReturns(updatedReturns);
        showToast(`Return ${returnId} has been approved successfully!`, 'success', 'Return Approved');
        setShowConfirmModal(false);
      }
    });
    setShowConfirmModal(true);
  };

  // Reject return - Open reject modal
  const handleRejectReturn = (returnId) => {
    setSelectedReturn(returns.find(r => r.id === returnId));
    setRejectReason('');
    setShowRejectModal(true);
  };

  // Confirm rejection
  const confirmRejectReturn = () => {
    if (!rejectReason.trim()) {
      showToast('Please provide a rejection reason', 'error', 'Validation Error');
      return;
    }

    const updatedReturns = returns.map(ret => {
      if (ret.id === selectedReturn.id) {
        return {
          ...ret,
          status: 'rejected',
          rejectionReason: rejectReason,
          timeline: [
            ...ret.timeline,
            {
              status: 'Rejected',
              date: new Date().toISOString().split('T')[0],
              time: new Date().toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit', 
                hour12: true 
              }),
              type: 'error',
              description: `Return request rejected. Reason: ${rejectReason}`
            }
          ]
        };
      }
      return ret;
    });
    setReturns(updatedReturns);
    showToast(`Return ${selectedReturn.id} has been rejected`, 'error', 'Return Rejected');
    setShowRejectModal(false);
    setRejectReason('');
  };

  // Complete return
  const handleCompleteReturn = (returnId) => {
    setConfirmAction({
      title: 'Complete Return Request',
      message: `Mark return request <strong>${returnId}</strong> as completed?<br><br>This action indicates that the return process has been fully processed.`,
      onConfirm: () => {
        const updatedReturns = returns.map(ret => {
          if (ret.id === returnId) {
            return {
              ...ret,
              status: 'completed',
              timeline: [
                ...ret.timeline,
                {
                  status: 'Completed',
                  date: new Date().toISOString().split('T')[0],
                  time: new Date().toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit', 
                    hour12: true 
                  }),
                  type: 'success',
                  description: 'Return process completed successfully'
                }
              ]
            };
          }
          return ret;
        });
        setReturns(updatedReturns);
        showToast(`Return ${returnId} has been marked as completed!`, 'success', 'Return Completed');
        setShowConfirmModal(false);
      }
    });
    setShowConfirmModal(true);
  };

  // Export to CSV
  const handleExport = () => {
    const data = filteredReturns;
    
    if (data.length === 0) {
      showToast('No data to export', 'warning', 'Export Failed');
      return;
    }
    
    let csv = 'Return ID,Type,Requester,Department/Vendor,Products,Reason,Return Date,Status,Created By,Approved By\n';
    
    data.forEach(ret => {
      csv += `"${ret.id}","${ret.returnType === 'internal' ? 'Internal' : 'Purchase'}","${ret.requester}","${ret.department}","${ret.products.replace(/"/g, '""')}","${ret.reasonTitle}","${ret.returnDate}","${ret.status}","${ret.createdBy}","${ret.approvedBy || 'Pending'}"\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `returns_export_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    showToast(`Exported ${data.length} return records to CSV`, 'success', 'Export Successful');
  };

  // Refresh page
  const handleRefresh = () => {
    resetFilters();
    setCurrentPage(1);
    showToast('Page refreshed successfully!', 'success', 'Refreshed');
  };

  // Get action buttons for table
  const getActionButtons = (ret) => {
    if (ret.status === 'pending') {
      return (
        <>
          <button
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-600 rounded-md text-xs font-semibold hover:bg-green-100 hover:shadow-md transition-all duration-200"
            onClick={() => handleApproveReturn(ret.id)}
            title="Approve Return"
          >
            <i className="fas fa-check"></i>
            Approve
          </button>
          <button
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 rounded-md text-xs font-semibold hover:bg-red-100 hover:shadow-md transition-all duration-200"
            onClick={() => handleRejectReturn(ret.id)}
            title="Reject Return"
          >
            <i className="fas fa-times"></i>
            Reject
          </button>
        </>
      );
    } else if (ret.status === 'in-progress') {
      return (
        <button
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 text-teal-600 rounded-md text-xs font-semibold hover:bg-teal-100 hover:shadow-md transition-all duration-200"
          onClick={() => handleCompleteReturn(ret.id)}
          title="Mark Complete"
        >
          <i className="fas fa-check-circle"></i>
          Complete
        </button>
      );
    }
    return null;
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
    <div className="p-5 bg-gray-50 min-h-screen">
      {/* Page Header - COMPACT */}
      <header className="flex justify-between items-center mb-5 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-800 flex items-center gap-2">
            <i className="fas fa-undo text-teal-600"></i>
            Return & Replacement
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage product returns, replacements, and refunds
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button 
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-teal-400 to-teal-700 text-white rounded-md text-sm font-semibold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
            onClick={() => setShowCreateModal(true)}
          >
            <i className="fas fa-plus"></i>
            Create Return
          </button>
          <button 
            className="inline-flex items-center gap-2 px-4 py-2 bg-white text-gray-700 border-2 border-gray-200 rounded-md text-sm font-semibold hover:border-teal-400 hover:text-teal-600 transition-all duration-200"
            onClick={handleRefresh}
          >
            <i className="fas fa-sync-alt"></i>
            Refresh
          </button>
        </div>
      </header>

      {/* Statistics Cards - COMPACT */}
      <section className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-5">
        {stats.map((stat, index) => (
          <div 
            key={index} 
            className={`bg-white rounded-lg p-4 shadow-md border-l-4 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 ${
              stat.type === 'primary' ? 'border-teal-500' :
              stat.type === 'warning' ? 'border-yellow-500' :
              stat.type === 'info' ? 'border-blue-500' :
              stat.type === 'success' ? 'border-green-500' :
              'border-red-500'
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl ${
                stat.type === 'primary' ? 'bg-cyan-50 text-teal-600' :
                stat.type === 'warning' ? 'bg-yellow-50 text-yellow-600' :
                stat.type === 'info' ? 'bg-blue-50 text-blue-600' :
                stat.type === 'success' ? 'bg-green-50 text-green-600' :
                'bg-red-50 text-red-600'
              }`}>
                <i className={stat.icon}></i>
              </div>
              <div>
                <h3 className="text-xs font-semibold text-gray-500">{stat.label}</h3>
                <p className="text-2xl font-extrabold text-gray-800">{stat.value}</p>
              </div>
            </div>
            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
              stat.badgeType === 'info' ? 'bg-blue-50 text-blue-600' :
              stat.badgeType === 'warning' ? 'bg-yellow-50 text-yellow-700' :
              stat.badgeType === 'success' ? 'bg-green-50 text-green-600' :
              'bg-red-50 text-red-600'
            }`}>
              <i className={stat.badgeIcon}></i>
              <span>{stat.badgeText}</span>
            </div>
          </div>
        ))}
      </section>

      {/* Workflow Overview - COMPACT */}
      <section className="mb-5">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
            <div className="flex items-center gap-2 mb-3 pb-3 border-b-2 border-gray-100">
              <i className="fas fa-building text-xl text-blue-600"></i>
              <h3 className="text-base font-bold text-gray-800">Internal Return</h3>
            </div>
            <p className="text-xs text-gray-600 mb-3">
              For products returned from internal departments
            </p>
            <button 
              className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-md text-sm font-semibold hover:shadow-md transition-all duration-200"
              onClick={() => setShowCreateModal(true)}
            >
              <i className="fas fa-plus"></i>
              Create Internal Return
            </button>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
            <div className="flex items-center gap-2 mb-3 pb-3 border-b-2 border-gray-100">
              <i className="fas fa-shopping-cart text-xl text-green-600"></i>
              <h3 className="text-base font-bold text-gray-800">Purchase Return</h3>
            </div>
            <p className="text-xs text-gray-600 mb-3">
              For products returned to vendors
            </p>
            <button 
              className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-br from-green-500 to-green-700 text-white rounded-md text-sm font-semibold hover:shadow-md transition-all duration-200"
              onClick={() => setShowCreateModal(true)}
            >
              <i className="fas fa-plus"></i>
              Create Purchase Return
            </button>
          </div>
        </div>
      </section>

      {/* Filter and Search Section - COMPACT */}
      <section className="bg-white rounded-lg p-4 shadow-md mb-4">
        <div className="flex justify-between items-center gap-3 flex-wrap">
          <div className="flex gap-2 flex-wrap">
            {['all', 'pending', 'in-progress', 'completed', 'rejected'].map(status => (
              <button
                key={status}
                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-semibold transition-all duration-200 ${
                  currentFilter === status
                    ? 'bg-gradient-to-br from-teal-400 to-teal-700 text-white shadow-md'
                    : 'bg-transparent text-gray-600 hover:bg-cyan-50 hover:text-teal-600'
                }`}
                onClick={() => handleFilterByStatus(status)}
              >
                <i className={`fas fa-${
                  status === 'all' ? 'list' :
                  status === 'pending' ? 'clock' :
                  status === 'in-progress' ? 'spinner' :
                  status === 'completed' ? 'check-circle' : 'times-circle'
                }`}></i>
                {formatStatus(status)}
              </button>
            ))}
          </div>
          <div className="flex gap-2 flex-wrap">
            <div className="relative">
              <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search..."
                className="pl-9 pr-3 py-2 border-2 border-gray-200 rounded-md text-xs min-w-[200px] focus:outline-none focus:border-teal-400 focus:ring-4 focus:ring-cyan-100 transition-all duration-200"
              />
            </div>
            <select
              className="px-3 py-2 border-2 border-gray-200 rounded-md text-xs bg-white cursor-pointer focus:outline-none focus:border-teal-400 transition-all duration-200"
              value={currentTypeFilter}
              onChange={(e) => handleFilterByType(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="internal">Internal</option>
              <option value="purchase">Purchase</option>
            </select>
          </div>
        </div>
      </section>

      {/* Returns Table - COMPACT */}
      <section className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="flex justify-between items-center px-4 py-3 border-b-2 border-gray-100 flex-wrap gap-3">
          <div>
            <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
              <i className="fas fa-table text-teal-600"></i>
              Return Requests
            </h2>
            <span className="text-xs text-gray-500 ml-6">
              {filteredReturns.length} of {returns.length} returns
            </span>
          </div>
          <div className="flex gap-2 items-center flex-wrap">
            <select
              className="px-3 py-1.5 border-2 border-gray-200 rounded-md text-xs bg-white cursor-pointer focus:outline-none focus:border-teal-400 transition-all duration-200"
              value={sortOrder}
              onChange={(e) => handleSort(e.target.value)}
            >
              <option value="date-desc">Latest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="id-desc">ID: High to Low</option>
              <option value="id-asc">ID: Low to High</option>
            </select>
            <button 
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border-2 border-gray-200 rounded-md text-xs font-semibold hover:border-teal-400 hover:text-teal-600 transition-all duration-200"
              onClick={handleExport}
            >
              <i className="fas fa-download"></i>
              Export
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">ID</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">TYPE</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">REQUESTER</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">PRODUCTS</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">REASON</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">DATE</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">STATUS</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {paginatedReturns.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-4 py-12 text-center">
                    <div>
                      <div className="text-5xl text-gray-300 mb-3">
                        <i className="fas fa-inbox"></i>
                      </div>
                      <div className="text-lg font-bold text-gray-800 mb-1">No Returns Found</div>
                      <div className="text-xs text-gray-500">
                        {searchQuery ? 'Try adjusting your search or filters' : 'No return requests match your filters'}
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedReturns.map(ret => (
                  <tr key={ret.id} className="hover:bg-cyan-50 transition-colors duration-150">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <strong className="text-xs text-gray-800">{ret.id}</strong>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                        ret.returnType === 'internal' 
                          ? 'bg-blue-50 text-blue-600' 
                          : 'bg-green-50 text-green-600'
                      }`}>
                        <i className={`fas ${ret.returnType === 'internal' ? 'fa-building' : 'fa-shopping-cart'}`}></i>
                        {ret.returnType === 'internal' ? 'Internal' : 'Purchase'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-700">{ret.requester}</td>
                    <td className="px-4 py-3 text-xs text-gray-700" title={ret.products}>
                      {truncateText(ret.products, 35)}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-700" title={ret.reasonDetails}>
                      {ret.reasonTitle}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-700">
                      {formatDate(ret.returnDate)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                        ret.status === 'pending' ? 'bg-yellow-50 text-yellow-700' :
                        ret.status === 'in-progress' ? 'bg-blue-50 text-blue-600' :
                        ret.status === 'completed' ? 'bg-green-50 text-green-600' :
                        'bg-red-50 text-red-600'
                      }`}>
                        {formatStatus(ret.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex gap-1.5 flex-wrap">
                        <button
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-blue-50 text-blue-600 rounded-md text-xs font-semibold hover:bg-blue-100 hover:shadow-md transition-all duration-200"
                          onClick={() => handleViewDetails(ret)}
                          title="View Details"
                        >
                          <i className="fas fa-eye"></i>
                          View
                        </button>
                        {getActionButtons(ret)}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination - COMPACT */}
        <div className="flex justify-between items-center px-4 py-3 border-t-2 border-gray-100 flex-wrap gap-3">
          <div className="text-xs text-gray-500">
            {filteredReturns.length === 0 ? 0 : startIndex + 1}-{endIndex} of {filteredReturns.length}
          </div>
          <div className="flex items-center gap-1.5">
            <button
              className="px-2.5 py-1.5 border-2 border-gray-200 bg-white rounded-md text-xs font-semibold text-gray-700 hover:border-teal-400 hover:text-teal-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              <i className="fas fa-chevron-left"></i>
            </button>
            <div className="flex gap-1">
              {renderPagination()}
            </div>
            <button
              className="px-2.5 py-1.5 border-2 border-gray-200 bg-white rounded-md text-xs font-semibold text-gray-700 hover:border-teal-400 hover:text-teal-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </section>

      {/* Modals */}
      <ReturnReplacementModals
        showCreateModal={showCreateModal}
        setShowCreateModal={setShowCreateModal}
        showViewModal={showViewModal}
        setShowViewModal={setShowViewModal}
        showConfirmModal={showConfirmModal}
        setShowConfirmModal={setShowConfirmModal}
        selectedReturn={selectedReturn}
        confirmAction={confirmAction}
        returns={returns}
        setReturns={setReturns}
        showToast={showToast}
        formatDate={formatDate}
        formatStatus={formatStatus}
      />

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[10000] p-5 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full animate-slideUp">
            <div className="flex justify-between items-center px-5 py-4 border-b-2 border-gray-100">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <i className="fas fa-ban text-red-600"></i>
                Reject Return Request
              </h2>
              <button 
                className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full hover:bg-red-100 hover:text-red-600 hover:rotate-90 transition-all duration-200"
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason('');
                }}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="px-5 py-4">
              <p className="text-sm text-gray-600 mb-3">
                Provide a reason for rejecting <strong className="text-gray-800">{selectedReturn?.id}</strong>:
              </p>
              <textarea
                className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-md text-sm resize-y min-h-[100px] focus:outline-none focus:border-red-400 focus:ring-4 focus:ring-red-100 transition-all duration-200"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Enter detailed rejection reason..."
                autoFocus
              ></textarea>
            </div>
            
            <div className="flex justify-end gap-2 px-5 py-4 border-t-2 border-gray-100">
              <button 
                className="inline-flex items-center gap-2 px-4 py-2 bg-white text-gray-700 border-2 border-gray-200 rounded-md text-sm font-semibold hover:border-gray-400 transition-all duration-200"
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason('');
                }}
              >
                <i className="fas fa-times"></i>
                Cancel
              </button>
              <button 
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-red-500 to-red-700 text-white rounded-md text-sm font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                onClick={confirmRejectReturn}
              >
                <i className="fas fa-ban"></i>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

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

      {/* Add animation keyframes */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
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
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
        .animate-slideInRight {
          animation: slideInRight 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ReturnReplacement;
