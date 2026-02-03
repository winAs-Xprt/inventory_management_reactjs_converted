// src/modals/UserManagementModals.jsx
import React, { useState, useEffect } from 'react';

const UserManagementModals = ({
  showUserModal,
  setShowUserModal,
  showPlantModal,
  setShowPlantModal,
  showViewUserModal,
  setShowViewUserModal,
  selectedUser,
  plants,
  setPlants,
  users,
  setUsers,
  formatDate,
  showToast,
  getRoleLabel,
  getPlantName
}) => {
  // User Form State
  const [userForm, setUserForm] = useState({
    fullName: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    employeeId: '',
    role: '',
    assignedPlant: '',
    department: '',
    reportingTo: '',
    status: 'active',
    isActive: true,
    sendWelcomeEmail: true,
    forcePasswordChange: true,
    twoFactorAuth: false
  });

  // Plant Form State
  const [plantForm, setPlantForm] = useState({
    plantName: '',
    plantCode: '',
    plantLocation: '',
    plantManager: '',
    plantContact: '',
    plantCapacity: ''
  });

  // Password visibility states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, text: '', color: '' });

  // Reset user form when modal opens/closes or selectedUser changes
  useEffect(() => {
    if (showUserModal) {
      if (selectedUser) {
        // Edit mode
        setUserForm({
          fullName: selectedUser.fullName || '',
          email: selectedUser.email || '',
          username: selectedUser.username || '',
          password: '', // Don't show existing password
          confirmPassword: '',
          phoneNumber: selectedUser.phoneNumber || '',
          employeeId: selectedUser.employeeId || '',
          role: selectedUser.role || '',
          assignedPlant: selectedUser.assignedPlant || '',
          department: selectedUser.department || '',
          reportingTo: selectedUser.reportingTo || '',
          status: selectedUser.status || 'active',
          isActive: selectedUser.isActive !== undefined ? selectedUser.isActive : true,
          sendWelcomeEmail: false, // Don't send welcome email on edit
          forcePasswordChange: selectedUser.forcePasswordChange || false,
          twoFactorAuth: selectedUser.twoFactorAuth || false
        });
      } else {
        // Add mode
        resetUserForm();
      }
    }
  }, [showUserModal, selectedUser]);

  const resetUserForm = () => {
    setUserForm({
      fullName: '',
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
      phoneNumber: '',
      employeeId: '',
      role: '',
      assignedPlant: '',
      department: '',
      reportingTo: '',
      status: 'active',
      isActive: true,
      sendWelcomeEmail: true,
      forcePasswordChange: true,
      twoFactorAuth: false
    });
    setPasswordStrength({ score: 0, text: '', color: '' });
  };

  const resetPlantForm = () => {
    setPlantForm({
      plantName: '',
      plantCode: '',
      plantLocation: '',
      plantManager: '',
      plantContact: '',
      plantCapacity: ''
    });
  };

  // Generate User ID
  const generateUserId = () => {
    const lastUser = users[users.length - 1];
    const lastId = lastUser ? parseInt(lastUser.id) : 0;
    return lastId + 1;
  };

  // Generate Employee ID
  const generateEmployeeId = () => {
    const year = new Date().getFullYear();
    const lastUser = users[users.length - 1];
    const lastNumber = lastUser?.employeeId ? parseInt(lastUser.employeeId.split('-')[1]) : 0;
    return `EMP-${String(lastNumber + 1).padStart(3, '0')}`;
  };

  // Password strength checker
  const checkPasswordStrength = (password) => {
    let score = 0;
    if (!password) {
      setPasswordStrength({ score: 0, text: '', color: '' });
      return;
    }

    // Length check
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;

    // Character variety
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;

    let text = '';
    let color = '';

    if (score <= 2) {
      text = 'Weak';
      color = 'bg-red-500';
    } else if (score <= 4) {
      text = 'Medium';
      color = 'bg-yellow-500';
    } else {
      text = 'Strong';
      color = 'bg-green-500';
    }

    setPasswordStrength({ score: (score / 6) * 100, text, color });
  };

  // Generate random password
  const generatePassword = () => {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const special = '!@#$%^&*';
    const all = uppercase + lowercase + numbers + special;

    let password = '';
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += special[Math.floor(Math.random() * special.length)];

    for (let i = 4; i < 12; i++) {
      password += all[Math.floor(Math.random() * all.length)];
    }

    // Shuffle password
    password = password.split('').sort(() => Math.random() - 0.5).join('');

    setUserForm({ ...userForm, password, confirmPassword: password });
    checkPasswordStrength(password);
    showToast('Password generated successfully!', 'success');
  };

  // Handle User Submit
  const handleUserSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!userForm.fullName || !userForm.email || !userForm.role) {
      showToast('Please fill all required fields', 'error');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userForm.email)) {
      showToast('Please enter a valid email address', 'error');
      return;
    }

    // Password validation for new user
    if (!selectedUser) {
      if (!userForm.password) {
        showToast('Password is required', 'error');
        return;
      }
      if (userForm.password.length < 8) {
        showToast('Password must be at least 8 characters', 'error');
        return;
      }
      if (userForm.password !== userForm.confirmPassword) {
        showToast('Passwords do not match', 'error');
        return;
      }
    } else if (userForm.password) {
      // If editing and password is provided
      if (userForm.password.length < 8) {
        showToast('Password must be at least 8 characters', 'error');
        return;
      }
      if (userForm.password !== userForm.confirmPassword) {
        showToast('Passwords do not match', 'error');
        return;
      }
    }

    // Check for requester role plant assignment
    if (userForm.role === 'requester' && !userForm.assignedPlant) {
      showToast('Please assign a plant for requester role', 'error');
      return;
    }

    if (selectedUser) {
      // Update existing user
      const updatedUser = {
        ...selectedUser,
        ...userForm,
        // Keep old password if new one not provided
        password: userForm.password || selectedUser.password,
        assignedPlant: userForm.assignedPlant ? parseInt(userForm.assignedPlant) : null
      };

      const updatedUsers = users.map(u =>
        u.id === selectedUser.id ? updatedUser : u
      );

      setUsers(updatedUsers);
      showToast('User updated successfully!', 'success');
    } else {
      // Create new user
      const newUser = {
        id: generateUserId(),
        ...userForm,
        employeeId: userForm.employeeId || generateEmployeeId(),
        username: userForm.username || userForm.email.split('@')[0],
        assignedPlant: userForm.assignedPlant ? parseInt(userForm.assignedPlant) : null,
        createdDate: new Date().toISOString().split('T')[0],
        lastLogin: 'Never',
        createdBy: 'Admin User'
      };

      setUsers([...users, newUser]);
      showToast('User created successfully!', 'success');
    }

    setShowUserModal(false);
    resetUserForm();
  };

  // Handle Plant Submit
  const handlePlantSubmit = (e) => {
    e.preventDefault();

    if (!plantForm.plantName || !plantForm.plantCode || !plantForm.plantLocation) {
      showToast('Please fill all required fields', 'error');
      return;
    }

    // Check for duplicate plant code
    const isDuplicate = plants.some(p => p.plantCode === plantForm.plantCode);
    if (isDuplicate) {
      showToast('Plant code already exists', 'error');
      return;
    }

    const newPlant = {
      id: Math.max(...plants.map(p => p.id), 0) + 1,
      ...plantForm,
      createdDate: new Date().toISOString().split('T')[0],
      isActive: true
    };

    setPlants([...plants, newPlant]);
    showToast('Plant created successfully!', 'success');
    resetPlantForm();
  };

  // Handle Delete Plant
  const handleDeletePlant = (plantId) => {
    // Check if plant is assigned to any user
    const isAssigned = users.some(u => u.assignedPlant === plantId);
    if (isAssigned) {
      showToast('Cannot delete plant - assigned to users', 'error');
      return;
    }

    const updatedPlants = plants.filter(p => p.id !== plantId);
    setPlants(updatedPlants);
    showToast('Plant deleted successfully!', 'success');
  };

  return (
    <>
      {/* ============================================
           ADD/EDIT USER MODAL
           ============================================ */}
      {showUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-[10000] p-5">
          <div className="bg-white rounded-xl shadow-2xl max-w-[900px] w-full max-h-[90vh] flex flex-col animate-slideUp">
            <div className="flex justify-between items-center px-6 py-5 border-b-2 border-gray-200 bg-gradient-to-r from-cyan-50 to-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
                  <i className={`fas ${selectedUser ? 'fa-user-edit' : 'fa-user-plus'} text-teal-600 text-lg`}></i>
                </div>
                <h3 className="text-lg font-bold text-gray-800">
                  {selectedUser ? 'Edit User' : 'Add New User'}
                </h3>
              </div>
              <button
                onClick={() => setShowUserModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-red-100 hover:text-red-600 transition-all hover:rotate-90"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <form onSubmit={handleUserSubmit} className="p-6 overflow-y-auto flex-1">
              {/* Personal Information Section */}
              <div className="mb-6">
                <h4 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2 pb-2 border-b-2 border-teal-100">
                  <i className="fas fa-user text-teal-500"></i>
                  Personal Information
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Full Name <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      value={userForm.fullName}
                      onChange={(e) => setUserForm({ ...userForm, fullName: e.target.value })}
                      placeholder="Enter full name"
                      className="w-full py-2 px-3 border-2 border-gray-200 rounded-md text-sm focus:outline-none focus:border-teal-400 focus:ring-4 focus:ring-cyan-100 transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Email Address <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="email"
                      value={userForm.email}
                      onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                      placeholder="user@company.com"
                      className="w-full py-2 px-3 border-2 border-gray-200 rounded-md text-sm focus:outline-none focus:border-teal-400 focus:ring-4 focus:ring-cyan-100 transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Username
                    </label>
                    <input
                      type="text"
                      value={userForm.username}
                      onChange={(e) => setUserForm({ ...userForm, username: e.target.value })}
                      placeholder="Auto-generated from email"
                      className="w-full py-2 px-3 border-2 border-gray-200 rounded-md text-sm focus:outline-none focus:border-teal-400 focus:ring-4 focus:ring-cyan-100 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Phone Number <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="tel"
                      value={userForm.phoneNumber}
                      onChange={(e) => setUserForm({ ...userForm, phoneNumber: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full py-2 px-3 border-2 border-gray-200 rounded-md text-sm focus:outline-none focus:border-teal-400 focus:ring-4 focus:ring-cyan-100 transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Employee ID
                    </label>
                    <input
                      type="text"
                      value={userForm.employeeId}
                      onChange={(e) => setUserForm({ ...userForm, employeeId: e.target.value })}
                      placeholder="Auto-generated"
                      className="w-full py-2 px-3 border-2 border-gray-200 rounded-md text-sm focus:outline-none focus:border-teal-400 focus:ring-4 focus:ring-cyan-100 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Account Credentials Section */}
              <div className="mb-6">
                <h4 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2 pb-2 border-b-2 border-teal-100">
                  <i className="fas fa-key text-teal-500"></i>
                  Account Credentials {selectedUser && <span className="text-xs text-gray-500 font-normal">(Leave blank to keep existing)</span>}
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Password {!selectedUser && <span className="text-red-600">*</span>}
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={userForm.password}
                        onChange={(e) => {
                          setUserForm({ ...userForm, password: e.target.value });
                          checkPasswordStrength(e.target.value);
                        }}
                        placeholder="Enter password"
                        className="w-full py-2 px-3 pr-20 border-2 border-gray-200 rounded-md text-sm focus:outline-none focus:border-teal-400 focus:ring-4 focus:ring-cyan-100 transition-all"
                        required={!selectedUser}
                      />
                      <div className="absolute right-1 top-1 flex gap-1">
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="w-7 h-7 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded text-gray-600 transition-all"
                          title={showPassword ? 'Hide' : 'Show'}
                        >
                          <i className={`fas fa-${showPassword ? 'eye-slash' : 'eye'} text-xs`}></i>
                        </button>
                        <button
                          type="button"
                          onClick={generatePassword}
                          className="w-7 h-7 flex items-center justify-center bg-teal-100 hover:bg-teal-200 rounded text-teal-600 transition-all"
                          title="Generate Password"
                        >
                          <i className="fas fa-random text-xs"></i>
                        </button>
                      </div>
                    </div>
                    {userForm.password && (
                      <div className="mt-2">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${passwordStrength.color} transition-all duration-300`}
                              style={{ width: `${passwordStrength.score}%` }}
                            ></div>
                          </div>
                          <span className="text-[10px] font-bold text-gray-600">{passwordStrength.text}</span>
                        </div>
                        <p className="text-[10px] text-gray-500">
                          Min 8 chars: uppercase, lowercase, number & special char
                        </p>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Confirm Password {!selectedUser && <span className="text-red-600">*</span>}
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={userForm.confirmPassword}
                        onChange={(e) => setUserForm({ ...userForm, confirmPassword: e.target.value })}
                        placeholder="Re-enter password"
                        className="w-full py-2 px-3 pr-10 border-2 border-gray-200 rounded-md text-sm focus:outline-none focus:border-teal-400 focus:ring-4 focus:ring-cyan-100 transition-all"
                        required={!selectedUser}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-1 top-1 w-7 h-7 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded text-gray-600 transition-all"
                      >
                        <i className={`fas fa-${showConfirmPassword ? 'eye-slash' : 'eye'} text-xs`}></i>
                      </button>
                    </div>
                    {userForm.confirmPassword && (
                      <p className={`text-[10px] mt-1 flex items-center gap-1 ${
                        userForm.password === userForm.confirmPassword ? 'text-green-600' : 'text-red-600'
                      }`}>
                        <i className={`fas fa-${userForm.password === userForm.confirmPassword ? 'check' : 'times'}-circle`}></i>
                        {userForm.password === userForm.confirmPassword ? 'Passwords match' : 'Passwords do not match'}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Role & Permissions Section */}
              <div className="mb-6">
                <h4 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2 pb-2 border-b-2 border-teal-100">
                  <i className="fas fa-user-shield text-teal-500"></i>
                  Role & Permissions
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      User Role <span className="text-red-600">*</span>
                    </label>
                    <select
                      value={userForm.role}
                      onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                      className="w-full py-2 px-3 border-2 border-gray-200 rounded-md text-sm focus:outline-none focus:border-teal-400 focus:ring-4 focus:ring-cyan-100 transition-all cursor-pointer"
                      required
                    >
                      <option value="">Select User Role</option>
                      <option value="admin">Site Admin</option>
                      <option value="inventory_manager">Inventory Manager</option>
                      <option value="storekeeper">Storekeeper</option>
                      <option value="requester">Requester</option>
                    </select>
                  </div>
                  {userForm.role === 'requester' && (
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        Assigned Plant <span className="text-red-600">*</span>
                      </label>
                      <select
                        value={userForm.assignedPlant}
                        onChange={(e) => setUserForm({ ...userForm, assignedPlant: e.target.value })}
                        className="w-full py-2 px-3 border-2 border-gray-200 rounded-md text-sm focus:outline-none focus:border-teal-400 focus:ring-4 focus:ring-cyan-100 transition-all cursor-pointer"
                        required={userForm.role === 'requester'}
                      >
                        <option value="">Select Plant</option>
                        {plants.map(plant => (
                          <option key={plant.id} value={plant.id}>
                            {plant.plantName} ({plant.plantCode})
                          </option>
                        ))}
                      </select>
                      <p className="text-[10px] text-gray-500 mt-1">
                        <i className="fas fa-info-circle"></i> Requesters must be assigned to ONE plant
                      </p>
                    </div>
                  )}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Department
                    </label>
                    <select
                      value={userForm.department}
                      onChange={(e) => setUserForm({ ...userForm, department: e.target.value })}
                      className="w-full py-2 px-3 border-2 border-gray-200 rounded-md text-sm focus:outline-none focus:border-teal-400 focus:ring-4 focus:ring-cyan-100 transition-all cursor-pointer"
                    >
                      <option value="">Select Department</option>
                      <option value="production">Production</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="quality">Quality Control</option>
                      <option value="logistics">Logistics</option>
                      <option value="administration">Administration</option>
                      <option value="it">IT</option>
                    </select>
                  </div>
                  {userForm.role !== 'admin' && (
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        Reporting To
                      </label>
                      <select
                        value={userForm.reportingTo}
                        onChange={(e) => setUserForm({ ...userForm, reportingTo: e.target.value })}
                        className="w-full py-2 px-3 border-2 border-gray-200 rounded-md text-sm focus:outline-none focus:border-teal-400 focus:ring-4 focus:ring-cyan-100 transition-all cursor-pointer"
                      >
                        <option value="">Select Manager</option>
                        {users.filter(u => u.role === 'admin' || u.role === 'inventory_manager').map(user => (
                          <option key={user.id} value={user.id}>
                            {user.fullName} ({getRoleLabel(user.role)})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              </div>

              {/* Access Settings Section */}
              <div className="mb-6">
                <h4 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2 pb-2 border-b-2 border-teal-100">
                  <i className="fas fa-lock text-teal-500"></i>
                  Access & Security
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={userForm.isActive}
                      onChange={(e) => setUserForm({ ...userForm, isActive: e.target.checked, status: e.target.checked ? 'active' : 'inactive' })}
                      className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500 cursor-pointer"
                    />
                    <span className="text-sm text-gray-700 font-medium">Active Account</span>
                  </label>
                  {!selectedUser && (
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={userForm.sendWelcomeEmail}
                        onChange={(e) => setUserForm({ ...userForm, sendWelcomeEmail: e.target.checked })}
                        className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500 cursor-pointer"
                      />
                      <span className="text-sm text-gray-700 font-medium">Send Welcome Email</span>
                    </label>
                  )}
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={userForm.forcePasswordChange}
                      onChange={(e) => setUserForm({ ...userForm, forcePasswordChange: e.target.checked })}
                      className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500 cursor-pointer"
                    />
                    <span className="text-sm text-gray-700 font-medium">Force Password Change on First Login</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={userForm.twoFactorAuth}
                      onChange={(e) => setUserForm({ ...userForm, twoFactorAuth: e.target.checked })}
                      className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500 cursor-pointer"
                    />
                    <span className="text-sm text-gray-700 font-medium">Enable Two-Factor Authentication</span>
                  </label>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowUserModal(false)}
                  className="flex-1 px-4 py-2.5 bg-gray-200 text-gray-700 rounded-md text-sm font-semibold hover:bg-gray-300 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={resetUserForm}
                  className="px-4 py-2.5 bg-white border-2 border-gray-300 text-gray-700 rounded-md text-sm font-semibold hover:border-teal-400 hover:text-teal-600 transition-all"
                >
                  <i className="fas fa-redo mr-2"></i>
                  Reset
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-teal-500 to-teal-700 text-white rounded-md text-sm font-semibold hover:-translate-y-0.5 hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <i className="fas fa-save"></i>
                  {selectedUser ? 'Update User' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================
           PLANT MANAGEMENT MODAL
           ============================================ */}
      {showPlantModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-[10000] p-5">
          <div className="bg-white rounded-xl shadow-2xl max-w-[900px] w-full max-h-[90vh] flex flex-col animate-slideUp">
            <div className="flex justify-between items-center px-6 py-5 border-b-2 border-gray-200 bg-gradient-to-r from-cyan-50 to-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <i className="fas fa-industry text-blue-600 text-lg"></i>
                </div>
                <h3 className="text-lg font-bold text-gray-800">Plant Management</h3>
              </div>
              <button
                onClick={() => setShowPlantModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-red-100 hover:text-red-600 transition-all hover:rotate-90"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              {/* Add Plant Form */}
              <div className="mb-6 p-5 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200">
                <h4 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
                  <i className="fas fa-plus-circle text-blue-600"></i>
                  Add New Plant
                </h4>
                <form onSubmit={handlePlantSubmit}>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        Plant Name <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        value={plantForm.plantName}
                        onChange={(e) => setPlantForm({ ...plantForm, plantName: e.target.value })}
                        placeholder="Manufacturing Plant 1"
                        className="w-full py-2 px-3 border-2 border-gray-200 rounded-md text-sm focus:outline-none focus:border-teal-400 focus:ring-4 focus:ring-cyan-100 transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        Plant Code <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        value={plantForm.plantCode}
                        onChange={(e) => setPlantForm({ ...plantForm, plantCode: e.target.value.toUpperCase() })}
                        placeholder="PLT-001"
                        className="w-full py-2 px-3 border-2 border-gray-200 rounded-md text-sm focus:outline-none focus:border-teal-400 focus:ring-4 focus:ring-cyan-100 transition-all uppercase"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        Location <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        value={plantForm.plantLocation}
                        onChange={(e) => setPlantForm({ ...plantForm, plantLocation: e.target.value })}
                        placeholder="City, State"
                        className="w-full py-2 px-3 border-2 border-gray-200 rounded-md text-sm focus:outline-none focus:border-teal-400 focus:ring-4 focus:ring-cyan-100 transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        Plant Manager
                      </label>
                      <input
                        type="text"
                        value={plantForm.plantManager}
                        onChange={(e) => setPlantForm({ ...plantForm, plantManager: e.target.value })}
                        placeholder="Manager Name"
                        className="w-full py-2 px-3 border-2 border-gray-200 rounded-md text-sm focus:outline-none focus:border-teal-400 focus:ring-4 focus:ring-cyan-100 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        Contact Number
                      </label>
                      <input
                        type="tel"
                        value={plantForm.plantContact}
                        onChange={(e) => setPlantForm({ ...plantForm, plantContact: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="w-full py-2 px-3 border-2 border-gray-200 rounded-md text-sm focus:outline-none focus:border-teal-400 focus:ring-4 focus:ring-cyan-100 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        Production Capacity
                      </label>
                      <input
                        type="text"
                        value={plantForm.plantCapacity}
                        onChange={(e) => setPlantForm({ ...plantForm, plantCapacity: e.target.value })}
                        placeholder="1000 units/day"
                        className="w-full py-2 px-3 border-2 border-gray-200 rounded-md text-sm focus:outline-none focus:border-teal-400 focus:ring-4 focus:ring-cyan-100 transition-all"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-md text-sm font-semibold hover:-translate-y-0.5 hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <i className="fas fa-plus"></i>
                    Add Plant
                  </button>
                </form>
              </div>

              {/* Existing Plants List */}
              <div>
                <h4 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
                  <i className="fas fa-building text-teal-600"></i>
                  Existing Plants ({plants.length})
                </h4>
                {plants.length > 0 ? (
                  <div className="grid grid-cols-1 gap-3">
                    {plants.map(plant => (
                      <div
                        key={plant.id}
                        className="bg-white border-2 border-gray-200 rounded-lg p-4 hover:border-teal-400 hover:shadow-md transition-all"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h5 className="text-sm font-bold text-gray-800">{plant.plantName}</h5>
                              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-[10px] font-bold">
                                {plant.plantCode}
                              </span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                              <div className="flex items-center gap-1">
                                <i className="fas fa-map-marker-alt text-teal-500"></i>
                                <span>{plant.plantLocation}</span>
                              </div>
                              {plant.plantManager && (
                                <div className="flex items-center gap-1">
                                  <i className="fas fa-user-tie text-teal-500"></i>
                                  <span>{plant.plantManager}</span>
                                </div>
                              )}
                              {plant.plantContact && (
                                <div className="flex items-center gap-1">
                                  <i className="fas fa-phone text-teal-500"></i>
                                  <span>{plant.plantContact}</span>
                                </div>
                              )}
                              {plant.plantCapacity && (
                                <div className="flex items-center gap-1">
                                  <i className="fas fa-industry text-teal-500"></i>
                                  <span>{plant.plantCapacity}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => handleDeletePlant(plant.id)}
                            className="w-8 h-8 flex items-center justify-center bg-red-50 text-red-600 rounded hover:bg-red-100 transition-all flex-shrink-0 ml-3"
                            title="Delete Plant"
                          >
                            <i className="fas fa-trash text-xs"></i>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <i className="fas fa-industry text-5xl text-gray-300 mb-3"></i>
                    <p className="text-sm text-gray-500 font-medium">No plants created yet</p>
                  </div>
                )}
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setShowPlantModal(false)}
                className="px-5 py-2 bg-gray-200 text-gray-700 rounded-md text-sm font-semibold hover:bg-gray-300 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================
           VIEW USER DETAILS MODAL
           ============================================ */}
      {showViewUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-[10000] p-5">
          <div className="bg-white rounded-xl shadow-2xl max-w-[700px] w-full max-h-[90vh] flex flex-col animate-slideUp">
            <div className="flex justify-between items-center px-6 py-5 border-b-2 border-gray-200 bg-gradient-to-r from-cyan-50 to-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
                  <i className="fas fa-user-circle text-teal-600 text-lg"></i>
                </div>
                <h3 className="text-lg font-bold text-gray-800">User Details</h3>
              </div>
              <button
                onClick={() => setShowViewUserModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-red-100 hover:text-red-600 transition-all hover:rotate-90"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              {/* User Profile Header */}
              <div className="flex items-center gap-4 mb-6 p-5 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl border-2 border-teal-200">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">
                  {selectedUser.fullName.charAt(0)}
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-gray-800">{selectedUser.fullName}</h4>
                  <p className="text-sm text-gray-600">@{selectedUser.username}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                      selectedUser.status === 'active' ? 'bg-green-100 text-green-700' :
                      selectedUser.status === 'blocked' ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {selectedUser.status}
                    </span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-[10px] font-bold uppercase">
                      {getRoleLabel(selectedUser.role)}
                    </span>
                  </div>
                </div>
              </div>

              {/* User Information Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg border-l-4 border-teal-500">
                  <div className="text-[11px] text-gray-500 font-semibold uppercase tracking-wide mb-1">Employee ID</div>
                  <div className="text-sm font-bold text-gray-800">{selectedUser.employeeId || '-'}</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg border-l-4 border-teal-500">
                  <div className="text-[11px] text-gray-500 font-semibold uppercase tracking-wide mb-1">Email</div>
                  <div className="text-sm font-bold text-gray-800 truncate">{selectedUser.email}</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg border-l-4 border-teal-500">
                  <div className="text-[11px] text-gray-500 font-semibold uppercase tracking-wide mb-1">Phone Number</div>
                  <div className="text-sm font-bold text-gray-800">{selectedUser.phoneNumber}</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg border-l-4 border-teal-500">
                  <div className="text-[11px] text-gray-500 font-semibold uppercase tracking-wide mb-1">Department</div>
                  <div className="text-sm font-bold text-gray-800 capitalize">{selectedUser.department || '-'}</div>
                </div>
                {selectedUser.assignedPlant && (
                  <div className="col-span-2 bg-gray-50 p-3 rounded-lg border-l-4 border-teal-500">
                    <div className="text-[11px] text-gray-500 font-semibold uppercase tracking-wide mb-1">Assigned Plant</div>
                    <div className="text-sm font-bold text-gray-800">{getPlantName(selectedUser.assignedPlant)}</div>
                  </div>
                )}
                {selectedUser.reportingTo && (
                  <div className="col-span-2 bg-gray-50 p-3 rounded-lg border-l-4 border-teal-500">
                    <div className="text-[11px] text-gray-500 font-semibold uppercase tracking-wide mb-1">Reporting To</div>
                    <div className="text-sm font-bold text-gray-800">
                      {users.find(u => u.id === selectedUser.reportingTo)?.fullName || '-'}
                    </div>
                  </div>
                )}
                <div className="bg-gray-50 p-3 rounded-lg border-l-4 border-teal-500">
                  <div className="text-[11px] text-gray-500 font-semibold uppercase tracking-wide mb-1">Created Date</div>
                  <div className="text-sm font-bold text-gray-800">{formatDate(selectedUser.createdDate)}</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg border-l-4 border-teal-500">
                  <div className="text-[11px] text-gray-500 font-semibold uppercase tracking-wide mb-1">Last Login</div>
                  <div className="text-sm font-bold text-gray-800">{selectedUser.lastLogin}</div>
                </div>
                <div className="col-span-2 bg-gray-50 p-3 rounded-lg border-l-4 border-teal-500">
                  <div className="text-[11px] text-gray-500 font-semibold uppercase tracking-wide mb-1">Security Settings</div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold ${
                      selectedUser.twoFactorAuth ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      <i className="fas fa-shield-alt mr-1"></i>
                      2FA: {selectedUser.twoFactorAuth ? 'Enabled' : 'Disabled'}
                    </span>
                    <span className={`px-2 py-1 rounded text-[10px] font-bold ${
                      selectedUser.forcePasswordChange ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      <i className="fas fa-key mr-1"></i>
                      Force Password Change: {selectedUser.forcePasswordChange ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setShowViewUserModal(false)}
                className="px-5 py-2 bg-gray-200 text-gray-700 rounded-md text-sm font-semibold hover:bg-gray-300 transition-all flex items-center gap-2"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserManagementModals;
