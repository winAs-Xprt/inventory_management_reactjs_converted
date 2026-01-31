// src/pages/Settings.jsx
import React, { useState } from 'react';

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
const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, type = 'warning', confirmText = 'Confirm', cancelText = 'Cancel' }) => {
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
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-5 py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-md text-sm font-semibold cursor-pointer hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
            >
              <i className="fas fa-check"></i>
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================================================
// MODAL WRAPPER COMPONENT
// ==========================================================================
const Modal = ({ isOpen, onClose, title, icon, children, size = 'md' }) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl'
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[9999] p-5">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      <div className={`relative w-full ${sizeClasses[size]} max-h-[90vh] animate-in fade-in duration-300`}>
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
          <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-teal-50 to-cyan-50">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <i className={`fas ${icon} text-teal-500`}></i>
              {title}
            </h2>
            <button
              onClick={onClose}
              className="bg-transparent border-none text-gray-500 text-xl cursor-pointer p-1 rounded-md w-8 h-8 flex items-center justify-center hover:bg-white hover:text-gray-800 transition-all duration-200"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
          <div className="p-6 overflow-y-auto flex-1">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================================================
// MAIN SETTINGS COMPONENT
// ==========================================================================
const Settings = () => {
  // ========== STATE MANAGEMENT ==========
  const [currentPasswordMode, setCurrentPasswordMode] = useState('change');
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });

  // Modal states
  const [modals, setModals] = useState({
    userInfo: false,
    changePassword: false,
    privacyPolicy: false,
    terms: false
  });

  // Confirm modal state
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null,
    type: 'warning'
  });

  // Form states
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // User data (Mock - Replace with actual API/Context)
  const [userData] = useState({
    name: 'Admin',
    role: 'ADMIN',
    email: 'admin@gmail.com',
    phone: '+1234567890',
    employeeId: 'EMP000',
    department: 'IT Department'
  });

  // Toast state
  const [toast, setToast] = useState({
    show: false,
    message: '',
    type: 'success'
  });

  // ========== MODAL FUNCTIONS ==========
  const openModal = (modalName) => {
    setModals(prev => ({ ...prev, [modalName]: true }));
    document.body.style.overflow = 'hidden';
  };

  const closeModal = (modalName) => {
    setModals(prev => ({ ...prev, [modalName]: false }));
    document.body.style.overflow = 'auto';
    // Reset password form when closing
    if (modalName === 'changePassword') {
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setCurrentPasswordMode('change');
    }
  };

  // ========== TOAST NOTIFICATION ==========
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 3000);
  };

  // ========== CUSTOM CONFIRM MODAL ==========
  const showCustomConfirm = (title, message, onConfirm, options = {}) => {
    setConfirmModal({
      isOpen: true,
      title,
      message,
      onConfirm: () => {
        onConfirm();
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      },
      type: options.type || 'warning',
      confirmText: options.confirmText || 'Confirm',
      cancelText: options.cancelText || 'Cancel'
    });
  };

  // ========== PASSWORD FUNCTIONS ==========
  const handlePasswordModeSwitch = (mode) => {
    setCurrentPasswordMode(mode);
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handlePasswordChange = (field, value) => {
    setPasswordForm(prev => ({ ...prev, [field]: value }));
  };

  const updatePassword = () => {
    const { currentPassword, newPassword, confirmPassword } = passwordForm;

    if (!currentPassword || !newPassword || !confirmPassword) {
      showToast('Please fill all password fields!', 'error');
      return;
    }

    if (newPassword.length < 8) {
      showToast('New password must be at least 8 characters!', 'error');
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast('New passwords do not match!', 'error');
      return;
    }

    showToast('Password updated successfully!', 'success');
    closeModal('changePassword');
  };

  const resetPassword = () => {
    const { newPassword, confirmPassword } = passwordForm;

    if (!newPassword || !confirmPassword) {
      showToast('Please fill all password fields!', 'error');
      return;
    }

    if (newPassword.length < 8) {
      showToast('New password must be at least 8 characters!', 'error');
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast('New passwords do not match!', 'error');
      return;
    }

    showToast('Password reset successfully!', 'success');
    closeModal('changePassword');
  };

  // ========== LOGOUT FUNCTION ==========
  const handleLogout = () => {
    showCustomConfirm(
      'Logout Confirmation',
      'Are you sure you want to logout?',
      () => {
        showToast('Logging out...', 'info');
        setTimeout(() => {
          window.location.href = '/login';
        }, 1000);
      },
      { type: 'warning', confirmText: 'Logout', cancelText: 'Cancel' }
    );
  };

  // ========== RENDER ==========
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-gray-50 to-cyan-50 p-5">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">
        <h1 className="text-2xl font-extrabold bg-gradient-to-br from-teal-400 to-teal-700 bg-clip-text text-transparent mb-1 flex items-center gap-2.5">
          <i className="fas fa-cog bg-gradient-to-br from-teal-400 to-teal-700 bg-clip-text"></i>
          Settings
        </h1>
        <p className="text-gray-600 text-sm font-medium">Manage your account and application preferences</p>
      </div>

      {/* Settings Sections */}
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Account Section */}
        <div>
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <i className="fas fa-user-circle text-teal-500"></i>
            Account
          </h2>
          <div className="space-y-3">
            <div
              onClick={() => openModal('userInfo')}
              className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4 cursor-pointer hover:border-teal-400 hover:shadow-md hover:translate-x-1 transition-all duration-200"
            >
              <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <i className="fas fa-user text-teal-500 text-xl"></i>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 text-sm">User Information</h3>
                <p className="text-xs text-gray-500">View your account details</p>
              </div>
              <i className="fas fa-chevron-right text-gray-400"></i>
            </div>
          </div>
        </div>

        {/* Security & Privacy Section */}
        <div>
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <i className="fas fa-shield-alt text-teal-500"></i>
            Security & Privacy
          </h2>
          <div className="space-y-3">
            <div
              onClick={() => openModal('changePassword')}
              className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4 cursor-pointer hover:border-teal-400 hover:shadow-md hover:translate-x-1 transition-all duration-200"
            >
              <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <i className="fas fa-lock text-teal-500 text-xl"></i>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 text-sm">Change Password</h3>
                <p className="text-xs text-gray-500">Update your password</p>
              </div>
              <i className="fas fa-chevron-right text-gray-400"></i>
            </div>

            <div
              onClick={() => openModal('privacyPolicy')}
              className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4 cursor-pointer hover:border-teal-400 hover:shadow-md hover:translate-x-1 transition-all duration-200"
            >
              <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <i className="fas fa-shield-alt text-teal-500 text-xl"></i>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 text-sm">Privacy Policy</h3>
                <p className="text-xs text-gray-500">View privacy policy</p>
              </div>
              <i className="fas fa-chevron-right text-gray-400"></i>
            </div>

            <div
              onClick={() => openModal('terms')}
              className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4 cursor-pointer hover:border-teal-400 hover:shadow-md hover:translate-x-1 transition-all duration-200"
            >
              <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <i className="fas fa-file-contract text-teal-500 text-xl"></i>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 text-sm">Terms of Service</h3>
                <p className="text-xs text-gray-500">View terms of service</p>
              </div>
              <i className="fas fa-chevron-right text-gray-400"></i>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div>
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <i className="fas fa-info-circle text-teal-500"></i>
            About
          </h2>
          <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center flex-shrink-0">
              <i className="fas fa-info-circle text-teal-500 text-xl"></i>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800 text-sm">App Version</h3>
              <p className="text-xs text-gray-500">Version 1.0.0</p>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full px-6 py-4 bg-gradient-to-br from-red-500 to-red-600 text-white rounded-xl text-sm font-bold cursor-pointer hover:-translate-y-1 hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
        >
          <i className="fas fa-sign-out-alt text-lg"></i>
          Logout
        </button>
      </div>

      {/* ========== MODALS ========== */}

      {/* User Info Modal */}
      <Modal
        isOpen={modals.userInfo}
        onClose={() => closeModal('userInfo')}
        title="User Information"
        icon="fa-user"
        size="md"
      >
        <div className="text-center py-6">
          <div className="w-24 h-24 bg-teal-50 border-4 border-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-user text-teal-500 text-4xl"></i>
          </div>
          <h2 className="text-2xl font-bold text-teal-500 mb-1">{userData.name}</h2>
          <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">{userData.role}</p>
        </div>

        <div className="h-px bg-gray-200 my-6"></div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-gray-800 flex items-center gap-2">
              <i className="fas fa-info-circle text-teal-500"></i>
              Personal Information
            </h3>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
              <span className="text-xs font-medium text-gray-500">Email</span>
              <span className="text-sm font-semibold text-gray-800">{userData.email}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
              <span className="text-xs font-medium text-gray-500">Phone</span>
              <span className="text-sm font-semibold text-gray-800">{userData.phone}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
              <span className="text-xs font-medium text-gray-500">Employee ID</span>
              <span className="text-sm font-semibold text-gray-800">{userData.employeeId}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
              <span className="text-xs font-medium text-gray-500">Department</span>
              <span className="text-sm font-semibold text-gray-800">{userData.department}</span>
            </div>
          </div>
        </div>
      </Modal>

      {/* Change/Reset Password Modal */}
      <Modal
        isOpen={modals.changePassword}
        onClose={() => closeModal('changePassword')}
        title={currentPasswordMode === 'change' ? 'Change Password' : 'Reset Password'}
        icon="fa-lock"
        size="md"
      >
        {/* Toggle Button */}
        <div className="flex border-2 border-teal-500 rounded-full overflow-hidden mb-6">
          <button
            onClick={() => handlePasswordModeSwitch('change')}
            className={`flex-1 px-6 py-3 text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2 ${
              currentPasswordMode === 'change'
                ? 'bg-teal-500 text-white'
                : 'bg-white text-teal-500'
            }`}
          >
            <i className="fas fa-lock"></i>
            Change Password
          </button>
          <button
            onClick={() => handlePasswordModeSwitch('reset')}
            className={`flex-1 px-6 py-3 text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2 ${
              currentPasswordMode === 'reset'
                ? 'bg-teal-500 text-white'
                : 'bg-white text-teal-500'
            }`}
          >
            <i className="fas fa-rotate"></i>
            Reset Password
          </button>
        </div>

        {currentPasswordMode === 'change' ? (
          <div>
            {/* Info Message for Change Password */}
            <div className="bg-cyan-50 border-l-4 border-cyan-500 p-4 rounded-md mb-6 flex items-center gap-3">
              <i className="fas fa-info-circle text-cyan-500 text-lg"></i>
              <span className="text-sm text-gray-700">Enter your current password to change it</span>
            </div>

            <div className="space-y-4">
              {/* Current Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Current Password</label>
                <div className="relative">
                  <input
                    type={showPassword.current ? 'text' : 'password'}
                    value={passwordForm.currentPassword}
                    onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                    placeholder="Enter your current password"
                    className="w-full py-3 px-4 pr-12 border-2 border-cyan-300 rounded-lg text-sm outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100 transition-all"
                  />
                  <button
                    onClick={() => togglePasswordVisibility('current')}
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-cyan-500 transition-all"
                  >
                    <i className={`fas ${showPassword.current ? 'fa-eye' : 'fa-eye-slash'}`}></i>
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
                <div className="relative">
                  <input
                    type={showPassword.new ? 'text' : 'password'}
                    value={passwordForm.newPassword}
                    onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                    placeholder="Enter new password"
                    className="w-full py-3 px-4 pr-12 border-2 border-cyan-300 rounded-lg text-sm outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100 transition-all"
                  />
                  <button
                    onClick={() => togglePasswordVisibility('new')}
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-cyan-500 transition-all"
                  >
                    <i className={`fas ${showPassword.new ? 'fa-eye' : 'fa-eye-slash'}`}></i>
                  </button>
                </div>
              </div>

              {/* Confirm New Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm New Password</label>
                <div className="relative">
                  <input
                    type={showPassword.confirm ? 'text' : 'password'}
                    value={passwordForm.confirmPassword}
                    onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                    placeholder="Re-enter new password"
                    className="w-full py-3 px-4 pr-12 border-2 border-cyan-300 rounded-lg text-sm outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100 transition-all"
                  />
                  <button
                    onClick={() => togglePasswordVisibility('confirm')}
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-cyan-500 transition-all"
                  >
                    <i className={`fas ${showPassword.confirm ? 'fa-eye' : 'fa-eye-slash'}`}></i>
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => closeModal('changePassword')}
                className="flex-1 px-6 py-3 bg-white text-gray-700 border-2 border-gray-300 rounded-lg text-sm font-bold cursor-pointer hover:bg-gray-50 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={updatePassword}
                className="flex-1 px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-lg text-sm font-bold cursor-pointer hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200"
              >
                Update Password
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* Warning Message for Reset Password */}
            <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-md mb-6 flex items-center gap-3">
              <i className="fas fa-exclamation-triangle text-orange-500 text-lg"></i>
              <span className="text-sm text-gray-700">Set a new password without current password</span>
            </div>

            <div className="space-y-4">
              {/* New Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
                <div className="relative">
                  <input
                    type={showPassword.new ? 'text' : 'password'}
                    value={passwordForm.newPassword}
                    onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                    placeholder="Enter new password"
                    className="w-full py-3 px-4 pr-12 border-2 border-cyan-300 rounded-lg text-sm outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100 transition-all"
                  />
                  <button
                    onClick={() => togglePasswordVisibility('new')}
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-cyan-500 transition-all"
                  >
                    <i className={`fas ${showPassword.new ? 'fa-eye' : 'fa-eye-slash'}`}></i>
                  </button>
                </div>
              </div>

              {/* Confirm New Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm New Password</label>
                <div className="relative">
                  <input
                    type={showPassword.confirm ? 'text' : 'password'}
                    value={passwordForm.confirmPassword}
                    onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                    placeholder="Re-enter new password"
                    className="w-full py-3 px-4 pr-12 border-2 border-cyan-300 rounded-lg text-sm outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100 transition-all"
                  />
                  <button
                    onClick={() => togglePasswordVisibility('confirm')}
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-cyan-500 transition-all"
                  >
                    <i className={`fas ${showPassword.confirm ? 'fa-eye' : 'fa-eye-slash'}`}></i>
                  </button>
                </div>
              </div>
            </div>

            {/* Password Requirements */}
            <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4 mt-4">
              <div className="flex items-start gap-2 mb-2">
                <i className="fas fa-shield-alt text-cyan-500 mt-0.5"></i>
                <span className="text-sm font-semibold text-gray-800">Password Requirements:</span>
              </div>
              <ul className="ml-6 text-sm text-gray-700">
                <li className="list-disc">At least 8 characters long</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => closeModal('changePassword')}
                className="flex-1 px-6 py-3 bg-white text-gray-700 border-2 border-gray-300 rounded-lg text-sm font-bold cursor-pointer hover:bg-gray-50 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={resetPassword}
                className="flex-1 px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-lg text-sm font-bold cursor-pointer hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200"
              >
                Reset Password
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Privacy Policy Modal */}
      <Modal
        isOpen={modals.privacyPolicy}
        onClose={() => closeModal('privacyPolicy')}
        title="Privacy Policy"
        icon="fa-shield-alt"
        size="lg"
      >
        <div className="prose prose-sm max-w-none">
          <p className="text-xs text-gray-500 pb-4 border-b border-gray-200">Last updated: January 25, 2026</p>

          <h3 className="text-base font-semibold text-gray-800 mt-6 mb-3">1. Information We Collect</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            We collect information you provide directly to us, including name, email address, phone number, and other contact information.
          </p>

          <h3 className="text-base font-semibold text-gray-800 mt-6 mb-3">2. How We Use Your Information</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            We use the information we collect to provide, maintain, and improve our services, to process transactions, and to communicate with you.
          </p>

          <h3 className="text-base font-semibold text-gray-800 mt-6 mb-3">3. Information Sharing</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            We do not share your personal information with third parties except as described in this policy or with your consent.
          </p>

          <h3 className="text-base font-semibold text-gray-800 mt-6 mb-3">4. Data Security</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            We implement appropriate security measures to protect your personal information from unauthorized access and disclosure.
          </p>

          <h3 className="text-base font-semibold text-gray-800 mt-6 mb-3">5. Your Rights</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            You have the right to access, update, or delete your personal information at any time through your account settings.
          </p>
        </div>
      </Modal>

      {/* Terms of Service Modal */}
      <Modal
        isOpen={modals.terms}
        onClose={() => closeModal('terms')}
        title="Terms of Service"
        icon="fa-file-contract"
        size="lg"
      >
        <div className="prose prose-sm max-w-none">
          <p className="text-xs text-gray-500 pb-4 border-b border-gray-200">Last updated: January 25, 2026</p>

          <h3 className="text-base font-semibold text-gray-800 mt-6 mb-3">1. Acceptance of Terms</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            By accessing and using this service, you accept and agree to be bound by the terms and provision of this agreement.
          </p>

          <h3 className="text-base font-semibold text-gray-800 mt-6 mb-3">2. Use License</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            Permission is granted to temporarily use this application for personal, non-commercial transitory viewing only.
          </p>

          <h3 className="text-base font-semibold text-gray-800 mt-6 mb-3">3. User Obligations</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            You agree to use the service only for lawful purposes and in accordance with these Terms of Service.
          </p>

          <h3 className="text-base font-semibold text-gray-800 mt-6 mb-3">4. Disclaimer</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            The service is provided "as is" without any representations or warranties, express or implied.
          </p>

          <h3 className="text-base font-semibold text-gray-800 mt-6 mb-3">5. Limitation of Liability</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            In no event shall the company be liable for any special, direct, indirect, consequential, or incidental damages.
          </p>
        </div>
      </Modal>

      {/* Custom Confirm Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
        type={confirmModal.type}
        confirmText={confirmModal.confirmText}
        cancelText={confirmModal.cancelText}
      />

      {/* Toast Notification */}
      <Toast show={toast.show} message={toast.message} type={toast.type} />
    </div>
  );
};

export default Settings;