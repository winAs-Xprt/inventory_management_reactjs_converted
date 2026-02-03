// src/pages/UserManagement.jsx
import React, { useState } from 'react';
import { useUserManagementData } from '../data/UserManagementData';
import UserManagementModals from '../modals/UserManagementModals';

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

const UserManagement = () => {
  const {
    users,
    setUsers,
    plants,
    setPlants,
    stats,
    currentRoleFilter,
    setCurrentRoleFilter,
    statusFilter,
    setStatusFilter,
    plantFilter,
    setPlantFilter,
    departmentFilter,
    setDepartmentFilter,
    searchTerm,
    setSearchTerm,
    getFilteredUsers,
    resetFilters
  } = useUserManagementData();

  const [showUserModal, setShowUserModal] = useState(false);
  const [showPlantModal, setShowPlantModal] = useState(false);
  const [showViewUserModal, setShowViewUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const filteredUsers = getFilteredUsers();

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 3000);
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowViewUserModal(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const handleDeleteUser = (user) => {
    setConfirmConfig({
      title: 'Delete User',
      message: `Are you sure you want to delete "${user.fullName}"? This action cannot be undone.`,
      type: 'error',
      isDanger: true,
      onConfirm: () => {
        const updatedUsers = users.filter(u => u.id !== user.id);
        setUsers(updatedUsers);
        showToast('User deleted successfully', 'success');
      }
    });
    setShowConfirmModal(true);
  };

  const handleBlockUser = (user) => {
    setConfirmConfig({
      title: 'Block User',
      message: `Are you sure you want to block "${user.fullName}"? They will not be able to access the system.`,
      type: 'warning',
      isDanger: true,
      onConfirm: () => {
        const updatedUsers = users.map(u =>
          u.id === user.id ? { ...u, status: 'blocked', isActive: false } : u
        );
        setUsers(updatedUsers);
        showToast('User blocked successfully', 'warning');
      }
    });
    setShowConfirmModal(true);
  };

  const handleUnblockUser = (user) => {
    const updatedUsers = users.map(u =>
      u.id === user.id ? { ...u, status: 'active', isActive: true } : u
    );
    setUsers(updatedUsers);
    showToast('User unblocked successfully', 'success');
  };

  const handleResetPassword = (user) => {
    setConfirmConfig({
      title: 'Reset Password',
      message: `Reset password for "${user.fullName}"? A temporary password will be sent to their email.`,
      type: 'info',
      isDanger: false,
      onConfirm: () => {
        showToast('Password reset email sent successfully', 'success');
      }
    });
    setShowConfirmModal(true);
  };

  const handleRoleFilterChange = (role) => {
    setCurrentRoleFilter(role);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (value) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const handlePlantFilterChange = (value) => {
    setPlantFilter(value);
    setCurrentPage(1);
  };

  const handleDepartmentFilterChange = (value) => {
    setDepartmentFilter(value);
    setCurrentPage(1);
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

    showToast('Refreshing user data...', 'info');

    setTimeout(() => {
      window.location.reload();
    }, 800);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const getStatusBadgeClass = (status) => {
    const statusMap = {
      'active': 'bg-green-50 text-green-700 border border-green-200',
      'blocked': 'bg-red-50 text-red-600 border border-red-200',
      'inactive': 'bg-gray-50 text-gray-600 border border-gray-200'
    };
    return statusMap[status] || 'bg-gray-50 text-gray-600 border border-gray-200';
  };

  const getRoleBadgeClass = (role) => {
    const roleMap = {
      'admin': 'bg-purple-50 text-purple-700 border border-purple-200',
      'inventory_manager': 'bg-blue-50 text-blue-600 border border-blue-200',
      'storekeeper': 'bg-teal-50 text-teal-600 border border-teal-200',
      'requester': 'bg-gray-50 text-gray-600 border border-gray-200'
    };
    return roleMap[role] || 'bg-gray-50 text-gray-600 border border-gray-200';
  };

  const getRoleLabel = (role) => {
    const roleLabels = {
      'admin': 'Site Admin',
      'inventory_manager': 'Inventory Manager',
      'storekeeper': 'Storekeeper',
      'requester': 'Requester'
    };
    return roleLabels[role] || role;
  };

  const getPlantName = (plantId) => {
    if (!plantId) return '-';
    const plant = plants.find(p => p.id === plantId);
    return plant ? plant.plantName : '-';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-gray-50 to-cyan-50 p-5">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-extrabold bg-gradient-to-r from-teal-400 to-teal-700 bg-clip-text text-transparent mb-1 flex items-center gap-2">
                <i className="fas fa-users-cog"></i>
                User Management
              </h1>
              <p className="text-gray-500 text-sm font-medium mb-2">
                Manage user creation, roles, and access permissions
              </p>
              <div className="inline-flex items-center gap-2 text-green-600 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-green-600 animate-pulse"></span>
                Real-time Data
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => {
                  setSelectedUser(null);
                  setShowUserModal(true);
                }}
                className="px-4 py-2 bg-gradient-to-r from-teal-500 to-teal-700 text-white rounded-md text-sm font-semibold hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 flex items-center gap-2"
              >
                <i className="fas fa-user-plus"></i>
                Add User
              </button>
              <button
                onClick={() => setShowPlantModal(true)}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-md text-sm font-semibold hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 flex items-center gap-2"
              >
                <i className="fas fa-industry"></i>
                Plants
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
                  stat.changeType === 'negative' ? 'text-red-600' : 'text-blue-600'
                }`}>
                  <i className={`fas ${
                    stat.changeType === 'positive' ? 'fa-arrow-up' :
                    stat.changeType === 'negative' ? 'fa-exclamation-triangle' : 'fa-info-circle'
                  } text-[10px]`}></i>
                  {stat.changeText}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Role Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 p-4">
          <div className="flex gap-2 overflow-x-auto">
            {[
              { role: 'all', icon: 'fa-users', label: 'All Users' },
              { role: 'admin', icon: 'fa-user-shield', label: 'Admin' },
              { role: 'inventory_manager', icon: 'fa-user-tie', label: 'Managers' },
              { role: 'storekeeper', icon: 'fa-user-tag', label: 'Storekeepers' },
              { role: 'requester', icon: 'fa-user', label: 'Requesters' }
            ].map(tab => (
              <button
                key={tab.role}
                onClick={() => handleRoleFilterChange(tab.role)}
                className={`flex-1 min-w-[120px] px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                  currentRoleFilter === tab.role
                    ? 'bg-gradient-to-r from-teal-500 to-teal-700 text-white shadow-md'
                    : 'text-gray-600 hover:bg-teal-50 hover:text-teal-600'
                }`}
              >
                <i className={`fas ${tab.icon}`}></i>
                {tab.label}
              </button>
            ))}
          </div>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Search</label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name, email, ID..."
                  className="w-full py-2 px-3 border-2 border-gray-200 rounded-md text-sm focus:outline-none focus:border-teal-400 focus:ring-4 focus:ring-cyan-100 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => handleStatusFilterChange(e.target.value)}
                  className="w-full py-2 px-3 border-2 border-gray-200 rounded-md text-sm focus:outline-none focus:border-teal-400 focus:ring-4 focus:ring-cyan-100 transition-all cursor-pointer"
                >
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="blocked">Blocked</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Plant</label>
                <select
                  value={plantFilter}
                  onChange={(e) => handlePlantFilterChange(e.target.value)}
                  className="w-full py-2 px-3 border-2 border-gray-200 rounded-md text-sm focus:outline-none focus:border-teal-400 focus:ring-4 focus:ring-cyan-100 transition-all cursor-pointer"
                >
                  <option value="">All Plants</option>
                  {plants.map(plant => (
                    <option key={plant.id} value={plant.id}>{plant.plantName}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Department</label>
                <select
                  value={departmentFilter}
                  onChange={(e) => handleDepartmentFilterChange(e.target.value)}
                  className="w-full py-2 px-3 border-2 border-gray-200 rounded-md text-sm focus:outline-none focus:border-teal-400 focus:ring-4 focus:ring-cyan-100 transition-all cursor-pointer"
                >
                  <option value="">All Departments</option>
                  <option value="production">Production</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="quality">Quality Control</option>
                  <option value="logistics">Logistics</option>
                  <option value="administration">Administration</option>
                  <option value="it">IT</option>
                </select>
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
              <i className="fas fa-table text-teal-500"></i>
              User Directory ({filteredUsers.length})
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b-2 border-gray-200">
                  <th className="py-3 px-4 text-left text-[11px] font-bold text-gray-600 uppercase tracking-wider">ID</th>
                  <th className="py-3 px-4 text-left text-[11px] font-bold text-gray-600 uppercase tracking-wider">Name</th>
                  <th className="py-3 px-4 text-left text-[11px] font-bold text-gray-600 uppercase tracking-wider">Email</th>
                  <th className="py-3 px-4 text-left text-[11px] font-bold text-gray-600 uppercase tracking-wider">Role</th>
                  <th className="py-3 px-4 text-left text-[11px] font-bold text-gray-600 uppercase tracking-wider">Plant</th>
                  <th className="py-3 px-4 text-left text-[11px] font-bold text-gray-600 uppercase tracking-wider">Department</th>
                  <th className="py-3 px-4 text-left text-[11px] font-bold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="py-3 px-4 text-left text-[11px] font-bold text-gray-600 uppercase tracking-wider">Created</th>
                  <th className="py-3 px-4 text-left text-[11px] font-bold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.length > 0 ? (
                  paginatedUsers.map((user) => (
                    <tr key={user.id} className="border-b border-gray-100 hover:bg-cyan-50 transition-colors">
                      <td className="py-3 px-4 text-sm text-gray-800 font-semibold">{user.employeeId || user.id}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center text-white font-bold text-xs">
                            {user.fullName.charAt(0)}
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-gray-800">{user.fullName}</div>
                            <div className="text-xs text-gray-500">{user.username}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700">{user.email}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-block px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide ${getRoleBadgeClass(user.role)}`}>
                          {getRoleLabel(user.role)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700">{getPlantName(user.assignedPlant)}</td>
                      <td className="py-3 px-4 text-sm text-gray-700 capitalize">{user.department || '-'}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-block px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide ${getStatusBadgeClass(user.status)}`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700">{formatDate(user.createdDate)}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleViewUser(user)}
                            className="w-8 h-8 flex items-center justify-center bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-all"
                            title="View Details"
                          >
                            <i className="fas fa-eye text-xs"></i>
                          </button>
                          <button
                            onClick={() => handleEditUser(user)}
                            className="w-8 h-8 flex items-center justify-center bg-teal-50 text-teal-600 rounded hover:bg-teal-100 transition-all"
                            title="Edit User"
                          >
                            <i className="fas fa-edit text-xs"></i>
                          </button>
                          {user.status === 'active' ? (
                            <button
                              onClick={() => handleBlockUser(user)}
                              className="w-8 h-8 flex items-center justify-center bg-yellow-50 text-yellow-600 rounded hover:bg-yellow-100 transition-all"
                              title="Block User"
                            >
                              <i className="fas fa-ban text-xs"></i>
                            </button>
                          ) : (
                            <button
                              onClick={() => handleUnblockUser(user)}
                              className="w-8 h-8 flex items-center justify-center bg-green-50 text-green-600 rounded hover:bg-green-100 transition-all"
                              title="Unblock User"
                            >
                              <i className="fas fa-check-circle text-xs"></i>
                            </button>
                          )}
                          <button
                            onClick={() => handleResetPassword(user)}
                            className="w-8 h-8 flex items-center justify-center bg-purple-50 text-purple-600 rounded hover:bg-purple-100 transition-all"
                            title="Reset Password"
                          >
                            <i className="fas fa-key text-xs"></i>
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user)}
                            className="w-8 h-8 flex items-center justify-center bg-red-50 text-red-600 rounded hover:bg-red-100 transition-all"
                            title="Delete User"
                          >
                            <i className="fas fa-trash text-xs"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="py-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <i className="fas fa-users text-6xl text-gray-300"></i>
                        <h3 className="text-lg font-bold text-gray-600">No Users Found</h3>
                        <p className="text-sm text-gray-500">Try adjusting your filters or add a new user</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filteredUsers.length > ITEMS_PER_PAGE && (
            <div className="px-5 py-3 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
              <div className="text-xs text-gray-600 font-medium">
                Showing {startIndex + 1}-{Math.min(endIndex, filteredUsers.length)} of {filteredUsers.length} records
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

      <UserManagementModals
        showUserModal={showUserModal}
        setShowUserModal={setShowUserModal}
        showPlantModal={showPlantModal}
        setShowPlantModal={setShowPlantModal}
        showViewUserModal={showViewUserModal}
        setShowViewUserModal={setShowViewUserModal}
        selectedUser={selectedUser}
        plants={plants}
        setPlants={setPlants}
        users={users}
        setUsers={setUsers}
        formatDate={formatDate}
        showToast={showToast}
        getRoleLabel={getRoleLabel}
        getPlantName={getPlantName}
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

export default UserManagement;
