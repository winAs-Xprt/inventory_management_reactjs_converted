// src/pages/Settings.jsx
import React, { useState, useEffect } from 'react';

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
    lg: 'max-w-4xl',
    xl: 'max-w-6xl'
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
// LOADING SKELETON COMPONENT
// ==========================================================================
const SettingSkeleton = () => (
  <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4 animate-pulse">
    <div className="w-12 h-12 bg-gray-200 rounded-xl flex-shrink-0"></div>
    <div className="flex-1">
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
    </div>
    <div className="w-6 h-6 bg-gray-200 rounded"></div>
  </div>
);

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

  const [modals, setModals] = useState({
    userInfo: false,
    changePassword: false,
    privacyPolicy: false,
    terms: false,
    companySettings: false,
    emailSettings: false,
    notificationSettings: false,
    locationSettings: false
  });

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null,
    type: 'warning'
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [userData] = useState({
    name: 'Admin',
    role: 'ADMIN',
    email: 'admin@gmail.com',
    phone: '+1234567890',
    employeeId: 'EMP000',
    department: 'IT Department'
  });

  const [toast, setToast] = useState({
    show: false,
    message: '',
    type: 'success'
  });

  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({});
  const [editableSettings, setEditableSettings] = useState({});

  // ========== FETCH SETTINGS ON MOUNT ==========
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      // Replace with your actual API endpoint
      // const response = await fetch('/api/settings');
      // const data = await response.json();
      
      // Mock data for demonstration
      const data = {
        data: [
          {
            key: "COMPANY_ADDRESS",
            value: "123 Business Street, City, State, 12345",
            description: "Company address",
            category: "COMPANY",
            isEditable: true,
            updatedAt: "2026-02-01T18:58:20.622Z"
          },
          {
            key: "COMPANY_EMAIL",
            value: "info@company.com",
            description: "Company email address",
            category: "COMPANY",
            isEditable: true,
            updatedAt: "2026-02-01T18:58:20.629Z"
          },
          {
            key: "COMPANY_GSTIN",
            value: "",
            description: "Company GSTIN/VAT number",
            category: "COMPANY",
            isEditable: true,
            updatedAt: "2026-02-01T18:58:20.632Z"
          },
          {
            key: "COMPANY_NAME",
            value: "Inventory Management System",
            description: "Company/Organization name",
            category: "COMPANY",
            isEditable: true,
            updatedAt: "2026-02-01T18:58:20.616Z"
          },
          {
            key: "COMPANY_PHONE",
            value: "+1-234-567-8900",
            description: "Company phone number",
            category: "COMPANY",
            isEditable: true,
            updatedAt: "2026-02-01T18:58:20.626Z"
          },
          {
            key: "COMPANY_WEBSITE",
            value: "https://yourcompany.com",
            description: "Company website URL",
            category: "COMPANY",
            isEditable: true,
            updatedAt: "2026-02-01T18:58:20.635Z"
          },
          {
            key: "EMAIL_FROM_NAME",
            value: "Inventory Management System",
            description: "Sender name for system emails",
            category: "EMAIL",
            isEditable: true,
            updatedAt: "2026-02-01T18:58:20.642Z"
          },
          {
            key: "EMAIL_SUPPORT",
            value: "support@company.com",
            description: "Support email address",
            category: "EMAIL",
            isEditable: true,
            updatedAt: "2026-02-01T18:58:20.638Z"
          },
          {
            key: "ENABLE_EMAIL_NOTIFICATIONS",
            value: "true",
            description: "Enable email notifications",
            category: "NOTIFICATION",
            isEditable: true,
            updatedAt: "2026-02-01T18:58:20.649Z"
          },
          {
            key: "ENABLE_STOCK_ALERTS",
            value: "true",
            description: "Enable stock level alerts",
            category: "NOTIFICATION",
            isEditable: true,
            updatedAt: "2026-02-01T18:58:20.650Z"
          },
          {
            key: "LATITUDE",
            value: "40.65471",
            description: "Default Latitude",
            category: "LOCATION",
            isEditable: true,
            updatedAt: "2026-02-01T18:58:20.644Z"
          },
          {
            key: "LONGITUDE",
            value: "-74.12347",
            description: "Longitude",
            category: "LOCATION",
            isEditable: true,
            updatedAt: "2026-02-01T18:58:20.645Z"
          },
          {
            key: "PURCHASE_TEAM_EMAIL",
            value: "purchase@company.com",
            description: "Purchase team email for CC",
            category: "EMAIL",
            isEditable: true,
            updatedAt: "2026-02-01T18:58:20.640Z"
          },
          {
            key: "RADIUS_METER",
            value: "5",
            description: "Radius in meters",
            category: "LOCATION",
            isEditable: true,
            updatedAt: "2026-02-01T18:58:20.647Z"
          }
        ]
      };

      // Group settings by category
      const grouped = {};
      data.data.forEach(item => {
        if (!grouped[item.category]) {
          grouped[item.category] = [];
        }
        grouped[item.category].push(item);
      });

      setSettings(grouped);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching settings:', error);
      showToast('Failed to load settings', 'error');
      setLoading(false);
    }
  };

  // ========== MODAL FUNCTIONS ==========
  const openModal = (modalName) => {
    setModals(prev => ({ ...prev, [modalName]: true }));
    document.body.style.overflow = 'hidden';
    
    // Initialize editable settings when opening settings modals
    if (modalName.includes('Settings') && settings[modalName.replace('Settings', '').toUpperCase()]) {
      const category = modalName.replace('Settings', '').toUpperCase();
      const categorySettings = settings[category] || [];
      const initialValues = {};
      categorySettings.forEach(item => {
        initialValues[item.key] = item.value;
      });
      setEditableSettings(initialValues);
    }
  };

  const closeModal = (modalName) => {
    setModals(prev => ({ ...prev, [modalName]: false }));
    document.body.style.overflow = 'auto';
    
    if (modalName === 'changePassword') {
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setCurrentPasswordMode('change');
    }
    
    if (modalName.includes('Settings')) {
      setEditableSettings({});
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

    // API call here
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

    // API call here
    showToast('Password reset successfully!', 'success');
    closeModal('changePassword');
  };

  // ========== SETTINGS UPDATE FUNCTIONS ==========
  const handleSettingChange = (key, value) => {
    setEditableSettings(prev => ({ ...prev, [key]: value }));
  };

  const saveSettings = async (category) => {
    try {
      // API call to save settings
      // const response = await fetch('/api/settings', {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ category, settings: editableSettings })
      // });

      showToast('Settings saved successfully!', 'success');
      closeModal(`${category.toLowerCase()}Settings`);
      fetchSettings(); // Refresh settings
    } catch (error) {
      console.error('Error saving settings:', error);
      showToast('Failed to save settings', 'error');
    }
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

  // ========== HELPER FUNCTIONS ==========
  const getCategoryIcon = (category) => {
    const icons = {
      COMPANY: 'fa-building',
      EMAIL: 'fa-envelope',
      NOTIFICATION: 'fa-bell',
      LOCATION: 'fa-map-marker-alt'
    };
    return icons[category] || 'fa-cog';
  };

  const getCategoryColor = (category) => {
    const colors = {
      COMPANY: 'text-blue-500',
      EMAIL: 'text-purple-500',
      NOTIFICATION: 'text-orange-500',
      LOCATION: 'text-green-500'
    };
    return colors[category] || 'text-teal-500';
  };

  const getCategoryBg = (category) => {
    const colors = {
      COMPANY: 'bg-blue-50',
      EMAIL: 'bg-purple-50',
      NOTIFICATION: 'bg-orange-50',
      LOCATION: 'bg-green-50'
    };
    return colors[category] || 'bg-teal-50';
  };

  const formatCategoryName = (category) => {
    return category.charAt(0) + category.slice(1).toLowerCase().replace('_', ' ');
  };

  // ========== RENDER INPUT BASED ON TYPE ==========
  const renderSettingInput = (setting) => {
    const value = editableSettings[setting.key] !== undefined ? editableSettings[setting.key] : setting.value;

    if (setting.key.startsWith('ENABLE_')) {
      return (
        <div className="flex items-center gap-3">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={value === 'true' || value === true}
              onChange={(e) => handleSettingChange(setting.key, e.target.checked ? 'true' : 'false')}
              className="sr-only peer"
              disabled={!setting.isEditable}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500"></div>
          </label>
          <span className="text-sm font-medium text-gray-700">
            {value === 'true' || value === true ? 'Enabled' : 'Disabled'}
          </span>
        </div>
      );
    }

    if (setting.key.includes('EMAIL')) {
      return (
        <input
          type="email"
          value={value}
          onChange={(e) => handleSettingChange(setting.key, e.target.value)}
          disabled={!setting.isEditable}
          className="w-full py-2.5 px-4 border-2 border-gray-300 rounded-lg text-sm outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-100 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
      );
    }

    if (setting.key.includes('PHONE')) {
      return (
        <input
          type="tel"
          value={value}
          onChange={(e) => handleSettingChange(setting.key, e.target.value)}
          disabled={!setting.isEditable}
          className="w-full py-2.5 px-4 border-2 border-gray-300 rounded-lg text-sm outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-100 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
      );
    }

    if (setting.key.includes('WEBSITE')) {
      return (
        <input
          type="url"
          value={value}
          onChange={(e) => handleSettingChange(setting.key, e.target.value)}
          disabled={!setting.isEditable}
          className="w-full py-2.5 px-4 border-2 border-gray-300 rounded-lg text-sm outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-100 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
      );
    }

    if (setting.key.includes('LATITUDE') || setting.key.includes('LONGITUDE') || setting.key.includes('RADIUS')) {
      return (
        <input
          type="number"
          step="any"
          value={value}
          onChange={(e) => handleSettingChange(setting.key, e.target.value)}
          disabled={!setting.isEditable}
          className="w-full py-2.5 px-4 border-2 border-gray-300 rounded-lg text-sm outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-100 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
      );
    }

    if (setting.key.includes('ADDRESS')) {
      return (
        <textarea
          value={value}
          onChange={(e) => handleSettingChange(setting.key, e.target.value)}
          disabled={!setting.isEditable}
          rows={3}
          className="w-full py-2.5 px-4 border-2 border-gray-300 rounded-lg text-sm outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-100 transition-all resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
      );
    }

    return (
      <input
        type="text"
        value={value}
        onChange={(e) => handleSettingChange(setting.key, e.target.value)}
        disabled={!setting.isEditable}
        className="w-full py-2.5 px-4 border-2 border-gray-300 rounded-lg text-sm outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-100 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
      />
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

        {/* Application Settings Section */}
        <div>
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <i className="fas fa-sliders-h text-teal-500"></i>
            Application Settings
          </h2>
          <div className="space-y-3">
            {loading ? (
              <>
                <SettingSkeleton />
                <SettingSkeleton />
                <SettingSkeleton />
                <SettingSkeleton />
              </>
            ) : (
              Object.keys(settings).map((category) => (
                <div
                  key={category}
                  onClick={() => openModal(`${category.toLowerCase()}Settings`)}
                  className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4 cursor-pointer hover:border-teal-400 hover:shadow-md hover:translate-x-1 transition-all duration-200"
                >
                  <div className={`w-12 h-12 ${getCategoryBg(category)} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <i className={`fas ${getCategoryIcon(category)} ${getCategoryColor(category)} text-xl`}></i>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 text-sm">{formatCategoryName(category)} Settings</h3>
                    <p className="text-xs text-gray-500">{settings[category].length} configuration{settings[category].length > 1 ? 's' : ''}</p>
                  </div>
                  <i className="fas fa-chevron-right text-gray-400"></i>
                </div>
              ))
            )}
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

      {/* Dynamic Settings Modals */}
      {Object.keys(settings).map((category) => (
        <Modal
          key={category}
          isOpen={modals[`${category.toLowerCase()}Settings`]}
          onClose={() => closeModal(`${category.toLowerCase()}Settings`)}
          title={`${formatCategoryName(category)} Settings`}
          icon={getCategoryIcon(category)}
          size="lg"
        >
          <div className="space-y-6">
            {settings[category].map((setting) => (
              <div key={setting.key} className="pb-4 border-b border-gray-200 last:border-0">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1">
                    <label className="block text-sm font-semibold text-gray-800 mb-1">
                      {setting.description}
                    </label>
                    <p className="text-xs text-gray-500">Key: {setting.key}</p>
                  </div>
                  {!setting.isEditable && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded">
                      Read Only
                    </span>
                  )}
                </div>
                {renderSettingInput(setting)}
                <p className="text-xs text-gray-400 mt-2">
                  Last updated: {new Date(setting.updatedAt).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            ))}
          </div>

          <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={() => closeModal(`${category.toLowerCase()}Settings`)}
              className="flex-1 px-6 py-3 bg-white text-gray-700 border-2 border-gray-300 rounded-lg text-sm font-bold cursor-pointer hover:bg-gray-50 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              onClick={() => saveSettings(category)}
              className="flex-1 px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-lg text-sm font-bold cursor-pointer hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
            >
              <i className="fas fa-save"></i>
              Save Changes
            </button>
          </div>
        </Modal>
      ))}

      {/* Change/Reset Password Modal */}
      <Modal
        isOpen={modals.changePassword}
        onClose={() => closeModal('changePassword')}
        title={currentPasswordMode === 'change' ? 'Change Password' : 'Reset Password'}
        icon="fa-lock"
        size="md"
      >
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
            <div className="bg-cyan-50 border-l-4 border-cyan-500 p-4 rounded-md mb-6 flex items-center gap-3">
              <i className="fas fa-info-circle text-cyan-500 text-lg"></i>
              <span className="text-sm text-gray-700">Enter your current password to change it</span>
            </div>

            <div className="space-y-4">
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
            <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-md mb-6 flex items-center gap-3">
              <i className="fas fa-exclamation-triangle text-orange-500 text-lg"></i>
              <span className="text-sm text-gray-700">Set a new password without current password</span>
            </div>

            <div className="space-y-4">
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

            <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4 mt-4">
              <div className="flex items-start gap-2 mb-2">
                <i className="fas fa-shield-alt text-cyan-500 mt-0.5"></i>
                <span className="text-sm font-semibold text-gray-800">Password Requirements:</span>
              </div>
              <ul className="ml-6 text-sm text-gray-700">
                <li className="list-disc">At least 8 characters long</li>
              </ul>
            </div>

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
