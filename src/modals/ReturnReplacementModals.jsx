// src/modals/ReturnReplacementModals.jsx
import React, { useState, useEffect } from 'react';

const ReturnReplacementModals = ({
  showCreateModal,
  setShowCreateModal,
  showViewModal,
  setShowViewModal,
  showConfirmModal,
  setShowConfirmModal,
  selectedReturn,
  confirmAction,
  returns,
  setReturns,
  showToast,
  formatDate,
  formatStatus
}) => {
  // Create Return Form State
  const [createForm, setCreateForm] = useState({
    returnType: 'internal',
    requesterName: '',
    departmentVendor: '',
    returnDate: new Date().toISOString().split('T')[0],
    linkedRequestPO: '',
    products: '',
    reasonTitle: '',
    detailedReason: '',
    pickupInfo: '',
    replacementNeeded: false,
    refundNeeded: false,
    differentProduct: false,
    replacementProduct: '',
    proofImages: ''
  });

  // Validation errors state
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // File upload state
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);

  // Close confirmation modal state
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);

  // Reset form when modal closes
  useEffect(() => {
    if (!showCreateModal) {
      resetCreateForm();
      setUploadedFiles([]);
      setErrors({});
      setTouched({});
    }
  }, [showCreateModal]);

  // Reset create form
  const resetCreateForm = () => {
    setCreateForm({
      returnType: 'internal',
      requesterName: '',
      departmentVendor: '',
      returnDate: new Date().toISOString().split('T')[0],
      linkedRequestPO: '',
      products: '',
      reasonTitle: '',
      detailedReason: '',
      pickupInfo: '',
      replacementNeeded: false,
      refundNeeded: false,
      differentProduct: false,
      replacementProduct: '',
      proofImages: ''
    });
  };

  // Generate new Return ID
  const generateReturnId = () => {
    const year = new Date().getFullYear();
    const lastReturn = returns[0];
    
    if (lastReturn) {
      const lastNumber = parseInt(lastReturn.id.split('-')[2]);
      return `RET-${year}-${String(lastNumber + 1).padStart(3, '0')}`;
    }
    
    return `RET-${year}-001`;
  };

  // Helper function to filter characters based on field type
  const filterInput = (field, value) => {
    switch (field) {
      case 'requesterName':
        // STRICT: Only allow letters and spaces - NO numbers, NO special characters
        return value.replace(/[^a-zA-Z\s]/g, '');

      case 'departmentVendor':
        // Only allow: letters, numbers, spaces, dots, commas, apostrophes, ampersands, parentheses, hyphens
        return value.replace(/[^a-zA-Z0-9\s.,'&()-]/g, '');

      case 'linkedRequestPO':
        // Only allow: letters, numbers, hyphens (auto uppercase)
        return value.replace(/[^a-zA-Z0-9-]/g, '').toUpperCase();

      default:
        return value;
    }
  };

  // Field validations
  const validateField = (fieldName, value) => {
    let error = '';

    switch (fieldName) {
      case 'requesterName':
        if (!value.trim()) {
          error = 'Requester name is required';
        } else if (value.trim().length < 3) {
          error = 'Requester name must be at least 3 characters';
        } else if (value.trim().length > 100) {
          error = 'Requester name must not exceed 100 characters';
        } else if (!/^[a-zA-Z\s]+$/.test(value.trim())) {
          error = 'Requester name can only contain letters and spaces';
        } else if (/\s{2,}/.test(value.trim())) {
          error = 'Requester name cannot have multiple consecutive spaces';
        } else if (/^\s|\s$/.test(value)) {
          error = 'Requester name cannot start or end with spaces';
        }
        break;

      case 'departmentVendor':
        if (!value.trim()) {
          error = 'Department/Vendor is required';
        } else if (value.trim().length < 3) {
          error = 'Department/Vendor must be at least 3 characters';
        } else if (value.trim().length > 150) {
          error = 'Department/Vendor must not exceed 150 characters';
        } else if (!/^[a-zA-Z0-9\s.,'&()-]+$/.test(value.trim())) {
          error = 'Department/Vendor contains invalid characters';
        }
        break;

      case 'returnDate':
        if (!value) {
          error = 'Return date is required';
        } else {
          const selectedDate = new Date(value);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const maxDate = new Date();
          maxDate.setDate(maxDate.getDate() + 30);
          
          if (selectedDate > maxDate) {
            error = 'Return date cannot be more than 30 days in the future';
          }
          
          const minDate = new Date();
          minDate.setDate(minDate.getDate() - 90);
          if (selectedDate < minDate) {
            error = 'Return date cannot be more than 90 days in the past';
          }
        }
        break;

      case 'linkedRequestPO':
        if (value.trim()) {
          if (value.trim().length < 5) {
            error = 'Request/PO number must be at least 5 characters';
          } else if (value.trim().length > 50) {
            error = 'Request/PO number must not exceed 50 characters';
          } else if (!/^[A-Z0-9-]+$/i.test(value.trim())) {
            error = 'Request/PO number can only contain letters, numbers and hyphens';
          }
        }
        break;

      case 'products':
        if (!value.trim()) {
          error = 'Products details are required';
        } else if (value.trim().length < 10) {
          error = 'Products details must be at least 10 characters';
        } else if (value.trim().length > 500) {
          error = 'Products details must not exceed 500 characters';
        }
        break;

      case 'reasonTitle':
        if (!value) {
          error = 'Reason title is required';
        }
        break;

      case 'detailedReason':
        if (!value.trim()) {
          error = 'Detailed reason is required';
        } else if (value.trim().length < 20) {
          error = 'Detailed reason must be at least 20 characters';
        } else if (value.trim().length > 1000) {
          error = 'Detailed reason must not exceed 1000 characters';
        }
        break;

      case 'pickupInfo':
        if (value.trim() && value.trim().length < 5) {
          error = 'Pickup info must be at least 5 characters if provided';
        } else if (value.trim().length > 200) {
          error = 'Pickup info must not exceed 200 characters';
        }
        break;

      case 'replacementProduct':
        if ((createForm.replacementNeeded || createForm.differentProduct) && !value.trim()) {
          error = 'Replacement product details are required when replacement is needed';
        } else if (value.trim() && value.trim().length < 5) {
          error = 'Replacement product details must be at least 5 characters';
        } else if (value.trim().length > 200) {
          error = 'Replacement product details must not exceed 200 characters';
        }
        break;

      default:
        break;
    }

    return error;
  };

  // Handle form input change with real-time character filtering
  const handleInputChange = (field, value) => {
    // Filter characters based on field type - THIS PREVENTS TYPING INVALID CHARACTERS
    let filteredValue = filterInput(field, value);

    // For requester name - prevent multiple consecutive spaces
    if (field === 'requesterName') {
      filteredValue = filteredValue.replace(/\s{2,}/g, ' ');
    }

    // Prevent only spaces for text fields
    if (typeof filteredValue === 'string' && filteredValue.trim() === '' && filteredValue !== '') {
      return;
    }

    setCreateForm(prev => ({
      ...prev,
      [field]: filteredValue
    }));

    // Validate on change if field has been touched
    if (touched[field]) {
      const error = validateField(field, filteredValue);
      setErrors(prev => ({
        ...prev,
        [field]: error
      }));
    }
  };

  // Handle field blur
  const handleBlur = (field) => {
    setTouched(prev => ({
      ...prev,
      [field]: true
    }));

    const error = validateField(field, createForm[field]);
    setErrors(prev => ({
      ...prev,
      [field]: error
    }));
  };

  // Handle checkbox change
  const handleCheckboxChange = (field) => {
    const newValue = !createForm[field];
    setCreateForm(prev => ({
      ...prev,
      [field]: newValue
    }));

    // If unchecking replacement/different product, clear replacement product field
    if (!newValue && (field === 'replacementNeeded' || field === 'differentProduct')) {
      if (!createForm.replacementNeeded && !createForm.differentProduct) {
        setCreateForm(prev => ({
          ...prev,
          replacementProduct: ''
        }));
        setErrors(prev => ({
          ...prev,
          replacementProduct: ''
        }));
      }
    }
  };

  // File upload handlers
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFiles = (files) => {
    // Max 10 files
    if (uploadedFiles.length + files.length > 10) {
      showToast('Maximum 10 files allowed', 'error', 'Upload Error');
      return;
    }

    const validFiles = files.filter(file => {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];
      const maxSize = 5 * 1024 * 1024; // 5MB
      
      if (!validTypes.includes(file.type)) {
        showToast(`${file.name}: Invalid file type. Only images and PDF allowed.`, 'error', 'Upload Error');
        return false;
      }
      
      if (file.size > maxSize) {
        showToast(`${file.name}: File too large. Maximum 5MB allowed.`, 'error', 'Upload Error');
        return false;
      }

      // Check if file already exists
      if (uploadedFiles.some(f => f.name === file.name)) {
        showToast(`${file.name}: File already uploaded.`, 'warning', 'Duplicate File');
        return false;
      }
      
      return true;
    });

    if (validFiles.length === 0) return;

    const newFiles = validFiles.map(file => ({
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      id: Date.now() + Math.random()
    }));

    setUploadedFiles(prev => [...prev, ...newFiles]);
    
    // Update form with file names
    const allFileNames = [...uploadedFiles, ...newFiles].map(f => f.name).join(', ');
    handleInputChange('proofImages', allFileNames);

    showToast(`${validFiles.length} file(s) uploaded successfully`, 'success', 'Upload Successful');
  };

  const handleRemoveFile = (fileId) => {
    const updatedFiles = uploadedFiles.filter(f => f.id !== fileId);
    setUploadedFiles(updatedFiles);
    
    // Update form
    const fileNames = updatedFiles.map(f => f.name).join(', ');
    handleInputChange('proofImages', fileNames);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileIcon = (type) => {
    if (type.startsWith('image/')) return 'fa-image';
    if (type === 'application/pdf') return 'fa-file-pdf';
    return 'fa-file';
  };

  // Validate entire form
  const validateForm = () => {
    const newErrors = {};

    // Validate all required fields
    newErrors.requesterName = validateField('requesterName', createForm.requesterName);
    newErrors.departmentVendor = validateField('departmentVendor', createForm.departmentVendor);
    newErrors.returnDate = validateField('returnDate', createForm.returnDate);
    newErrors.linkedRequestPO = validateField('linkedRequestPO', createForm.linkedRequestPO);
    newErrors.products = validateField('products', createForm.products);
    newErrors.reasonTitle = validateField('reasonTitle', createForm.reasonTitle);
    newErrors.detailedReason = validateField('detailedReason', createForm.detailedReason);
    newErrors.pickupInfo = validateField('pickupInfo', createForm.pickupInfo);
    newErrors.replacementProduct = validateField('replacementProduct', createForm.replacementProduct);

    // Remove empty errors
    Object.keys(newErrors).forEach(key => {
      if (!newErrors[key]) delete newErrors[key];
    });

    setErrors(newErrors);

    // Mark all fields as touched
    const allTouched = {};
    Object.keys(createForm).forEach(key => {
      allTouched[key] = true;
    });
    setTouched(allTouched);

    return Object.keys(newErrors).length === 0;
  };

  // Handle create return submit
  const handleCreateSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      const firstError = Object.values(errors).find(err => err);
      showToast(firstError || 'Please fix all validation errors', 'error', 'Validation Error');
      return;
    }
    
    // Create new return object
    const newReturn = {
      id: generateReturnId(),
      returnType: createForm.returnType,
      requester: createForm.requesterName.trim(),
      department: createForm.departmentVendor.trim(),
      products: createForm.products.trim(),
      reasonTitle: createForm.reasonTitle,
      reasonDetails: createForm.detailedReason.trim(),
      returnDate: createForm.returnDate,
      status: 'pending',
      replacementNeeded: createForm.replacementNeeded,
      refundNeeded: createForm.refundNeeded,
      differentProduct: createForm.differentProduct,
      replacementProduct: createForm.replacementProduct.trim() || null,
      linkedRequest: createForm.returnType === 'internal' ? (createForm.linkedRequestPO.trim() || null) : null,
      linkedPO: createForm.returnType === 'purchase' ? (createForm.linkedRequestPO.trim() || null) : null,
      proofImages: createForm.proofImages || null,
      pickupInfo: createForm.pickupInfo.trim() || null,
      createdBy: 'Current User',
      approvedBy: null,
      timeline: [
        {
          status: 'Request Created',
          date: createForm.returnDate,
          time: new Date().toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit', 
            hour12: true 
          }),
          type: 'info',
          description: `${createForm.returnType === 'internal' ? 'Internal' : 'Purchase'} return request submitted`
        }
      ]
    };
    
    // Add to returns array
    setReturns([newReturn, ...returns]);
    
    // Show success message
    showToast(
      `Return request ${newReturn.id} created successfully!`,
      'success',
      'Return Created'
    );
    
    // Close modal and reset form
    setShowCreateModal(false);
    resetCreateForm();
    setUploadedFiles([]);
    setErrors({});
    setTouched({});
  };

  // Check if form has data
  const hasFormData = () => {
    return createForm.requesterName.trim() || 
           createForm.departmentVendor.trim() || 
           createForm.products.trim() || 
           createForm.detailedReason.trim() ||
           uploadedFiles.length > 0;
  };

  // Close modals with confirmation if form has data
  const handleCloseCreateModal = () => {
    if (hasFormData()) {
      setShowCloseConfirm(true);
    } else {
      setShowCreateModal(false);
      resetCreateForm();
      setUploadedFiles([]);
      setErrors({});
      setTouched({});
    }
  };

  const confirmCloseModal = () => {
    setShowCloseConfirm(false);
    setShowCreateModal(false);
    resetCreateForm();
    setUploadedFiles([]);
    setErrors({});
    setTouched({});
  };

  // Get character count color
  const getCharCountColor = (current, max) => {
    const percentage = (current / max) * 100;
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 75) return 'text-yellow-600';
    return 'text-gray-500';
  };

  return (
    <>
      {/* ============================================
           CREATE RETURN MODAL
           ============================================ */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[10000] p-4 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[95vh] flex flex-col animate-slideUp">
            {/* FIXED HEADER */}
            <div className="flex justify-between items-center px-5 py-4 border-b-2 border-gray-100 flex-shrink-0">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <i className="fas fa-plus-circle text-teal-600"></i>
                Create Return Request
              </h2>
              <button 
                className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full hover:bg-red-100 hover:text-red-600 hover:rotate-90 transition-all duration-200"
                onClick={handleCloseCreateModal}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <form onSubmit={handleCreateSubmit} className="flex flex-col flex-1 min-h-0">
              {/* SCROLLABLE CONTENT */}
              <div className="px-5 py-4 overflow-y-auto flex-1">
                {/* Return Type Selection */}
                <div className="mb-5 pb-5 border-b border-gray-100">
                  <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <i className="fas fa-layer-group text-teal-600"></i>
                    Return Type
                  </h3>
                  <div className="space-y-2">
                    <label className={`flex items-center gap-3 cursor-pointer p-3 border-2 rounded-lg hover:border-teal-400 transition-all duration-200 ${
                      createForm.returnType === 'internal' ? 'border-teal-500 bg-teal-50' : 'border-gray-200'
                    }`}>
                      <input
                        type="radio"
                        name="returnType"
                        value="internal"
                        checked={createForm.returnType === 'internal'}
                        onChange={(e) => handleInputChange('returnType', e.target.value)}
                        className="w-4 h-4 text-teal-600"
                      />
                      <span className="flex items-center gap-2 text-sm text-gray-700 font-semibold">
                        <i className="fas fa-building text-blue-600"></i>
                        Internal Return (Requester to Warehouse)
                      </span>
                    </label>
                    <label className={`flex items-center gap-3 cursor-pointer p-3 border-2 rounded-lg hover:border-teal-400 transition-all duration-200 ${
                      createForm.returnType === 'purchase' ? 'border-teal-500 bg-teal-50' : 'border-gray-200'
                    }`}>
                      <input
                        type="radio"
                        name="returnType"
                        value="purchase"
                        checked={createForm.returnType === 'purchase'}
                        onChange={(e) => handleInputChange('returnType', e.target.value)}
                        className="w-4 h-4 text-teal-600"
                      />
                      <span className="flex items-center gap-2 text-sm text-gray-700 font-semibold">
                        <i className="fas fa-shopping-cart text-green-600"></i>
                        Purchase Return (Warehouse to Vendor)
                      </span>
                    </label>
                  </div>
                </div>

                {/* Basic Information */}
                <div className="mb-5 pb-5 border-b border-gray-100">
                  <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <i className="fas fa-info-circle text-teal-600"></i>
                    Basic Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* Requester Name - STRICT VALIDATION */}
                    <div className="flex flex-col">
                      <label className="text-xs font-semibold text-gray-700 mb-1.5">
                        Requester Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        className={`px-3 py-2 border-2 rounded-md text-sm focus:outline-none focus:ring-4 transition-all duration-200 ${
                          errors.requesterName && touched.requesterName
                            ? 'border-red-400 focus:border-red-400 focus:ring-red-100'
                            : 'border-gray-200 focus:border-teal-400 focus:ring-cyan-100'
                        }`}
                        value={createForm.requesterName}
                        onChange={(e) => handleInputChange('requesterName', e.target.value)}
                        onBlur={() => handleBlur('requesterName')}
                        placeholder="Enter requester full name (letters only)"
                        maxLength={100}
                      />
                      {errors.requesterName && touched.requesterName && (
                        <span className="text-xs text-red-600 mt-1 flex items-center gap-1">
                          <i className="fas fa-exclamation-circle"></i>
                          {errors.requesterName}
                        </span>
                      )}
                      <span className={`text-xs mt-1 ${getCharCountColor(createForm.requesterName.length, 100)}`}>
                        {createForm.requesterName.length}/100 characters • Only letters & spaces allowed
                      </span>
                    </div>

                    {/* Department/Vendor */}
                    <div className="flex flex-col">
                      <label className="text-xs font-semibold text-gray-700 mb-1.5">
                        Department/Vendor <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        className={`px-3 py-2 border-2 rounded-md text-sm focus:outline-none focus:ring-4 transition-all duration-200 ${
                          errors.departmentVendor && touched.departmentVendor
                            ? 'border-red-400 focus:border-red-400 focus:ring-red-100'
                            : 'border-gray-200 focus:border-teal-400 focus:ring-cyan-100'
                        }`}
                        value={createForm.departmentVendor}
                        onChange={(e) => handleInputChange('departmentVendor', e.target.value)}
                        onBlur={() => handleBlur('departmentVendor')}
                        placeholder="Enter department or vendor name"
                        maxLength={150}
                      />
                      {errors.departmentVendor && touched.departmentVendor && (
                        <span className="text-xs text-red-600 mt-1 flex items-center gap-1">
                          <i className="fas fa-exclamation-circle"></i>
                          {errors.departmentVendor}
                        </span>
                      )}
                      <span className={`text-xs mt-1 ${getCharCountColor(createForm.departmentVendor.length, 150)}`}>
                        {createForm.departmentVendor.length}/150 characters
                      </span>
                    </div>

                    {/* Return Date */}
                    <div className="flex flex-col">
                      <label className="text-xs font-semibold text-gray-700 mb-1.5">
                        Return Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        className={`px-3 py-2 border-2 rounded-md text-sm focus:outline-none focus:ring-4 transition-all duration-200 ${
                          errors.returnDate && touched.returnDate
                            ? 'border-red-400 focus:border-red-400 focus:ring-red-100'
                            : 'border-gray-200 focus:border-teal-400 focus:ring-cyan-100'
                        }`}
                        value={createForm.returnDate}
                        onChange={(e) => handleInputChange('returnDate', e.target.value)}
                        onBlur={() => handleBlur('returnDate')}
                        min={new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                        max={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                      />
                      {errors.returnDate && touched.returnDate && (
                        <span className="text-xs text-red-600 mt-1 flex items-center gap-1">
                          <i className="fas fa-exclamation-circle"></i>
                          {errors.returnDate}
                        </span>
                      )}
                    </div>

                    {/* Linked Request/PO */}
                    <div className="flex flex-col">
                      <label className="text-xs font-semibold text-gray-700 mb-1.5">
                        Linked Request/PO Number
                      </label>
                      <input
                        type="text"
                        className={`px-3 py-2 border-2 rounded-md text-sm focus:outline-none focus:ring-4 transition-all duration-200 ${
                          errors.linkedRequestPO && touched.linkedRequestPO
                            ? 'border-red-400 focus:border-red-400 focus:ring-red-100'
                            : 'border-gray-200 focus:border-teal-400 focus:ring-cyan-100'
                        }`}
                        value={createForm.linkedRequestPO}
                        onChange={(e) => handleInputChange('linkedRequestPO', e.target.value)}
                        onBlur={() => handleBlur('linkedRequestPO')}
                        placeholder="e.g., REQ-2026-001 or PO-2026-001"
                        maxLength={50}
                      />
                      {errors.linkedRequestPO && touched.linkedRequestPO && (
                        <span className="text-xs text-red-600 mt-1 flex items-center gap-1">
                          <i className="fas fa-exclamation-circle"></i>
                          {errors.linkedRequestPO}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Product Details */}
                <div className="mb-5 pb-5 border-b border-gray-100">
                  <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <i className="fas fa-box text-teal-600"></i>
                    Product Details
                  </h3>
                  <div className="flex flex-col">
                    <label className="text-xs font-semibold text-gray-700 mb-1.5">
                      Products (with Quantity) <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      className={`px-3 py-2 border-2 rounded-md text-sm resize-y focus:outline-none focus:ring-4 transition-all duration-200 ${
                        errors.products && touched.products
                          ? 'border-red-400 focus:border-red-400 focus:ring-red-100'
                          : 'border-gray-200 focus:border-teal-400 focus:ring-cyan-100'
                      }`}
                      value={createForm.products}
                      onChange={(e) => handleInputChange('products', e.target.value)}
                      onBlur={() => handleBlur('products')}
                      rows="2"
                      placeholder="e.g., Drill Machine - 2 units, Steel Cable - 10m"
                      maxLength={500}
                    ></textarea>
                    {errors.products && touched.products && (
                      <span className="text-xs text-red-600 mt-1 flex items-center gap-1">
                        <i className="fas fa-exclamation-circle"></i>
                        {errors.products}
                      </span>
                    )}
                    <span className={`text-xs mt-1 ${getCharCountColor(createForm.products.length, 500)}`}>
                      {createForm.products.length}/500 characters (min: 10)
                    </span>
                  </div>
                </div>

                {/* Return Reason */}
                <div className="mb-5 pb-5 border-b border-gray-100">
                  <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <i className="fas fa-exclamation-circle text-teal-600"></i>
                    Return Reason
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                    <div className="flex flex-col">
                      <label className="text-xs font-semibold text-gray-700 mb-1.5">
                        Reason Title <span className="text-red-500">*</span>
                      </label>
                      <select
                        className={`px-3 py-2 border-2 rounded-md text-sm bg-white cursor-pointer focus:outline-none transition-all duration-200 ${
                          errors.reasonTitle && touched.reasonTitle
                            ? 'border-red-400 focus:border-red-400'
                            : 'border-gray-200 focus:border-teal-400'
                        }`}
                        value={createForm.reasonTitle}
                        onChange={(e) => handleInputChange('reasonTitle', e.target.value)}
                        onBlur={() => handleBlur('reasonTitle')}
                      >
                        <option value="">Select reason</option>
                        <option value="Damaged on arrival">Damaged on arrival</option>
                        <option value="Product defective">Product defective</option>
                        <option value="Wrong product sent">Wrong product sent</option>
                        <option value="Wrong quantity delivered">Wrong quantity delivered</option>
                        <option value="Wrong specifications">Wrong specifications</option>
                        <option value="Missing parts">Missing parts</option>
                        <option value="Quality issues">Quality issues</option>
                        <option value="Not required">Not required</option>
                        <option value="Excess stock">Excess stock</option>
                        <option value="Expired products">Expired products</option>
                        <option value="Other">Other</option>
                      </select>
                      {errors.reasonTitle && touched.reasonTitle && (
                        <span className="text-xs text-red-600 mt-1 flex items-center gap-1">
                          <i className="fas fa-exclamation-circle"></i>
                          {errors.reasonTitle}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <label className="text-xs font-semibold text-gray-700 mb-1.5">Pickup/Delivery Info</label>
                      <input
                        type="text"
                        className={`px-3 py-2 border-2 rounded-md text-sm focus:outline-none focus:ring-4 transition-all duration-200 ${
                          errors.pickupInfo && touched.pickupInfo
                            ? 'border-red-400 focus:border-red-400 focus:ring-red-100'
                            : 'border-gray-200 focus:border-teal-400 focus:ring-cyan-100'
                        }`}
                        value={createForm.pickupInfo}
                        onChange={(e) => handleInputChange('pickupInfo', e.target.value)}
                        onBlur={() => handleBlur('pickupInfo')}
                        placeholder="e.g., By hand - Warehouse Gate 2"
                        maxLength={200}
                      />
                      {errors.pickupInfo && touched.pickupInfo && (
                        <span className="text-xs text-red-600 mt-1 flex items-center gap-1">
                          <i className="fas fa-exclamation-circle"></i>
                          {errors.pickupInfo}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <label className="text-xs font-semibold text-gray-700 mb-1.5">
                      Detailed Reason <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      className={`px-3 py-2 border-2 rounded-md text-sm resize-y focus:outline-none focus:ring-4 transition-all duration-200 ${
                        errors.detailedReason && touched.detailedReason
                          ? 'border-red-400 focus:border-red-400 focus:ring-red-100'
                          : 'border-gray-200 focus:border-teal-400 focus:ring-cyan-100'
                      }`}
                      value={createForm.detailedReason}
                      onChange={(e) => handleInputChange('detailedReason', e.target.value)}
                      onBlur={() => handleBlur('detailedReason')}
                      rows="3"
                      placeholder="Provide detailed explanation about the return... (minimum 20 characters)"
                      maxLength={1000}
                    ></textarea>
                    {errors.detailedReason && touched.detailedReason && (
                      <span className="text-xs text-red-600 mt-1 flex items-center gap-1">
                        <i className="fas fa-exclamation-circle"></i>
                        {errors.detailedReason}
                      </span>
                    )}
                    <span className={`text-xs mt-1 ${getCharCountColor(createForm.detailedReason.length, 1000)}`}>
                      {createForm.detailedReason.length}/1000 characters (min: 20)
                    </span>
                  </div>
                </div>

                {/* Return Options */}
                <div className="mb-5 pb-5 border-b border-gray-100">
                  <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <i className="fas fa-cogs text-teal-600"></i>
                    Return Options
                  </h3>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-50 p-2 rounded transition-all duration-200">
                      <input
                        type="checkbox"
                        checked={createForm.replacementNeeded}
                        onChange={() => handleCheckboxChange('replacementNeeded')}
                        className="w-4 h-4 text-teal-600 rounded"
                      />
                      <span className="font-medium">Replacement Needed</span>
                    </label>
                    <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-50 p-2 rounded transition-all duration-200">
                      <input
                        type="checkbox"
                        checked={createForm.refundNeeded}
                        onChange={() => handleCheckboxChange('refundNeeded')}
                        className="w-4 h-4 text-teal-600 rounded"
                      />
                      <span className="font-medium">Refund Needed</span>
                    </label>
                    <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-50 p-2 rounded transition-all duration-200">
                      <input
                        type="checkbox"
                        checked={createForm.differentProduct}
                        onChange={() => handleCheckboxChange('differentProduct')}
                        className="w-4 h-4 text-teal-600 rounded"
                      />
                      <span className="font-medium">Different Product Needed</span>
                    </label>
                  </div>
                  {(createForm.replacementNeeded || createForm.differentProduct) && (
                    <div className="flex flex-col mt-3">
                      <label className="text-xs font-semibold text-gray-700 mb-1.5">
                        Replacement Product Details <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        className={`px-3 py-2 border-2 rounded-md text-sm focus:outline-none focus:ring-4 transition-all duration-200 ${
                          errors.replacementProduct && touched.replacementProduct
                            ? 'border-red-400 focus:border-red-400 focus:ring-red-100'
                            : 'border-gray-200 focus:border-teal-400 focus:ring-cyan-100'
                        }`}
                        value={createForm.replacementProduct}
                        onChange={(e) => handleInputChange('replacementProduct', e.target.value)}
                        onBlur={() => handleBlur('replacementProduct')}
                        placeholder="e.g., New Drill Machine - Model D450"
                        maxLength={200}
                      />
                      {errors.replacementProduct && touched.replacementProduct && (
                        <span className="text-xs text-red-600 mt-1 flex items-center gap-1">
                          <i className="fas fa-exclamation-circle"></i>
                          {errors.replacementProduct}
                        </span>
                      )}
                      <span className={`text-xs mt-1 ${getCharCountColor(createForm.replacementProduct.length, 200)}`}>
                        {createForm.replacementProduct.length}/200 characters
                      </span>
                    </div>
                  )}
                </div>

                {/* Proof Images - DRAG & DROP */}
                <div>
                  <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <i className="fas fa-images text-teal-600"></i>
                    Proof & Attachments
                  </h3>
                  <div className="flex flex-col">
                    <label className="text-xs font-semibold text-gray-700 mb-1.5">
                      Proof Images/Documents <span className="text-gray-400">(Optional, Max 10 files)</span>
                    </label>
                    
                    {/* Drag & Drop Area */}
                    <div
                      className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 ${
                        isDragging
                          ? 'border-teal-500 bg-teal-50'
                          : 'border-gray-300 hover:border-teal-400 hover:bg-gray-50'
                      }`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
                      <input
                        type="file"
                        id="fileInput"
                        className="hidden"
                        multiple
                        accept="image/*,application/pdf"
                        onChange={handleFileSelect}
                      />
                      
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mb-3">
                          <i className="fas fa-cloud-upload-alt text-3xl text-teal-600"></i>
                        </div>
                        <p className="text-sm font-semibold text-gray-700 mb-1">
                          Drag & drop files here or{' '}
                          <label
                            htmlFor="fileInput"
                            className="text-teal-600 hover:text-teal-700 cursor-pointer underline"
                          >
                            browse
                          </label>
                        </p>
                        <p className="text-xs text-gray-500">
                          Supports: JPG, PNG, GIF, WEBP, PDF (Max 5MB per file)
                        </p>
                      </div>
                    </div>

                    {/* Uploaded Files List */}
                    {uploadedFiles.length > 0 && (
                      <div className="mt-3 space-y-2">
                        <div className="text-xs font-semibold text-gray-700 mb-2 flex items-center justify-between">
                          <span>Uploaded Files ({uploadedFiles.length}/10)</span>
                          <span className="text-gray-500">Total: {formatFileSize(uploadedFiles.reduce((sum, f) => sum + f.size, 0))}</span>
                        </div>
                        {uploadedFiles.map((file) => (
                          <div
                            key={file.id}
                            className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-all duration-200"
                          >
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                <i className={`fas ${getFileIcon(file.type)} text-teal-600`}></i>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-semibold text-gray-800 truncate">
                                  {file.name}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {formatFileSize(file.size)}
                                </div>
                              </div>
                            </div>
                            <button
                              type="button"
                              className="ml-3 w-8 h-8 flex items-center justify-center bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all duration-200 flex-shrink-0"
                              onClick={() => handleRemoveFile(file.id)}
                              title="Remove file"
                            >
                              <i className="fas fa-times"></i>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* FIXED FOOTER */}
              <div className="flex justify-end gap-2 px-5 py-4 border-t-2 border-gray-100 flex-shrink-0 bg-gray-50">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white text-gray-700 border-2 border-gray-200 rounded-md text-sm font-semibold hover:border-red-400 hover:text-red-600 transition-all duration-200"
                  onClick={handleCloseCreateModal}
                >
                  <i className="fas fa-times"></i>
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-teal-400 to-teal-700 text-white rounded-md text-sm font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={Object.keys(errors).some(key => errors[key])}
                >
                  <i className="fas fa-check"></i>
                  Create Return Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================
           CLOSE CONFIRMATION MODAL
           ============================================ */}
      {showCloseConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[10001] p-5 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full animate-slideUp">
            <div className="flex justify-between items-center px-5 py-4 border-b-2 border-gray-100">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <i className="fas fa-exclamation-triangle text-yellow-600"></i>
                Unsaved Changes
              </h2>
              <button 
                className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full hover:bg-red-100 hover:text-red-600 hover:rotate-90 transition-all duration-200"
                onClick={() => setShowCloseConfirm(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="px-5 py-4">
              <p className="text-sm leading-relaxed text-gray-600">
                You have unsaved changes in the form. Are you sure you want to close? <strong>All entered data will be lost.</strong>
              </p>
            </div>
            
            <div className="flex justify-end gap-2 px-5 py-4 border-t-2 border-gray-100">
              <button 
                className="inline-flex items-center gap-2 px-4 py-2 bg-white text-gray-700 border-2 border-gray-200 rounded-md text-sm font-semibold hover:border-gray-400 transition-all duration-200"
                onClick={() => setShowCloseConfirm(false)}
              >
                <i className="fas fa-arrow-left"></i>
                Continue Editing
              </button>
              <button 
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-red-500 to-red-700 text-white rounded-md text-sm font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                onClick={confirmCloseModal}
              >
                <i className="fas fa-trash-alt"></i>
                Discard Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================
           VIEW RETURN DETAILS MODAL
           ============================================ */}
      {showViewModal && selectedReturn && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[10000] p-4 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[95vh] flex flex-col animate-slideUp">
            {/* FIXED HEADER */}
            <div className="flex justify-between items-center px-5 py-4 border-b-2 border-gray-100 flex-shrink-0">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <i className="fas fa-info-circle text-teal-600"></i>
                Return Request Details
              </h2>
              <button 
                className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full hover:bg-red-100 hover:text-red-600 hover:rotate-90 transition-all duration-200"
                onClick={() => setShowViewModal(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            {/* SCROLLABLE CONTENT */}
            <div className="px-5 py-4 overflow-y-auto flex-1">
              {/* Header with ID and Status */}
              <div className="flex justify-between items-center mb-5 pb-4 border-b-2 border-gray-100">
                <div>
                  <h2 className="text-2xl font-extrabold text-teal-600 mb-1">
                    {selectedReturn.id}
                  </h2>
                  <p className="text-xs text-gray-500">
                    Created on {formatDate(selectedReturn.returnDate)}
                  </p>
                </div>
                <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${
                  selectedReturn.status === 'pending' ? 'bg-yellow-50 text-yellow-700' :
                  selectedReturn.status === 'in-progress' ? 'bg-blue-50 text-blue-600' :
                  selectedReturn.status === 'completed' ? 'bg-green-50 text-green-600' :
                  'bg-red-50 text-red-600'
                }`}>
                  {formatStatus(selectedReturn.status)}
                </span>
              </div>

              {/* Basic Information */}
              <div className="bg-gray-50 p-4 rounded-lg mb-4 border-l-4 border-teal-500">
                <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
                  <i className="fas fa-info-circle text-teal-600"></i>
                  Basic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <div className="text-xs font-semibold text-gray-500 uppercase mb-0.5">Return Type</div>
                    <div>
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                        selectedReturn.returnType === 'internal' 
                          ? 'bg-blue-50 text-blue-600' 
                          : 'bg-green-50 text-green-600'
                      }`}>
                        <i className={`fas ${selectedReturn.returnType === 'internal' ? 'fa-building' : 'fa-shopping-cart'}`}></i>
                        {selectedReturn.returnType === 'internal' ? 'Internal Return' : 'Purchase Return'}
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-gray-500 uppercase mb-0.5">Requester</div>
                    <div className="text-sm font-semibold text-gray-800">{selectedReturn.requester}</div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-gray-500 uppercase mb-0.5">Department/Vendor</div>
                    <div className="text-sm font-semibold text-gray-800">{selectedReturn.department}</div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-gray-500 uppercase mb-0.5">Return Date</div>
                    <div className="text-sm font-semibold text-gray-800">{formatDate(selectedReturn.returnDate)}</div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-gray-500 uppercase mb-0.5">Created By</div>
                    <div className="text-sm font-semibold text-gray-800">{selectedReturn.createdBy}</div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-gray-500 uppercase mb-0.5">Approved By</div>
                    <div className="text-sm font-semibold text-gray-800">
                      {selectedReturn.approvedBy || <span className="text-gray-400">Pending approval</span>}
                    </div>
                  </div>
                  {selectedReturn.linkedPO && (
                    <div>
                      <div className="text-xs font-semibold text-gray-500 uppercase mb-0.5">Purchase Order</div>
                      <div className="text-sm font-semibold text-teal-600">{selectedReturn.linkedPO}</div>
                    </div>
                  )}
                  {selectedReturn.linkedRequest && (
                    <div>
                      <div className="text-xs font-semibold text-gray-500 uppercase mb-0.5">Linked Request</div>
                      <div className="text-sm font-semibold text-teal-600">{selectedReturn.linkedRequest}</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Product Details */}
              <div className="bg-gray-50 p-4 rounded-lg mb-4 border-l-4 border-blue-500">
                <h3 className="text-sm font-bold mb-2 flex items-center gap-2">
                  <i className="fas fa-box text-blue-600"></i>
                  Product Details
                </h3>
                <div className="bg-white p-3 rounded-md text-sm leading-relaxed text-gray-700">
                  {selectedReturn.products}
                </div>
              </div>

              {/* Return Reason */}
              <div className="bg-yellow-50 p-4 rounded-lg mb-4 border-l-4 border-yellow-500">
                <h3 className="text-sm font-bold mb-2 flex items-center gap-2">
                  <i className="fas fa-exclamation-circle text-yellow-600"></i>
                  Return Reason
                </h3>
                <div className="mb-2">
                  <div className="text-xs font-semibold text-gray-500 uppercase mb-0.5">Reason Title</div>
                  <div className="text-sm font-bold text-gray-800">{selectedReturn.reasonTitle}</div>
                </div>
                <div className="bg-white/70 p-3 rounded-md text-sm leading-relaxed text-gray-700">
                  {selectedReturn.reasonDetails}
                </div>
              </div>

              {/* Rejection Reason (if rejected) */}
              {selectedReturn.rejectionReason && (
                <div className="bg-red-50 p-4 rounded-lg mb-4 border-l-4 border-red-500">
                  <h3 className="text-sm font-bold mb-2 flex items-center gap-2">
                    <i className="fas fa-ban text-red-600"></i>
                    Rejection Reason
                  </h3>
                  <div className="bg-white/70 p-3 rounded-md text-sm leading-relaxed text-gray-700">
                    {selectedReturn.rejectionReason}
                  </div>
                </div>
              )}

              {/* Return Options */}
              <div className="bg-green-50 p-4 rounded-lg mb-4 border-l-4 border-green-500">
                <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
                  <i className="fas fa-cogs text-green-600"></i>
                  Return Options
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <i className={`fas fa-${selectedReturn.replacementNeeded ? 'check-circle' : 'times-circle'} ${
                      selectedReturn.replacementNeeded ? 'text-green-600' : 'text-gray-400'
                    }`}></i>
                    Replacement Needed
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <i className={`fas fa-${selectedReturn.refundNeeded ? 'check-circle' : 'times-circle'} ${
                      selectedReturn.refundNeeded ? 'text-green-600' : 'text-gray-400'
                    }`}></i>
                    Refund Needed
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <i className={`fas fa-${selectedReturn.differentProduct ? 'check-circle' : 'times-circle'} ${
                      selectedReturn.differentProduct ? 'text-green-600' : 'text-gray-400'
                    }`}></i>
                    Different Product
                  </div>
                </div>
                {selectedReturn.replacementProduct && (
                  <div className="mt-2">
                    <div className="text-xs font-semibold text-gray-500 uppercase mb-0.5">Replacement Product</div>
                    <div className="bg-white/70 p-2 rounded-md text-sm text-gray-700">
                      {selectedReturn.replacementProduct}
                    </div>
                  </div>
                )}
              </div>

              {/* Pickup Info */}
              {selectedReturn.pickupInfo && (
                <div className="bg-blue-50 p-4 rounded-lg mb-4 border-l-4 border-blue-500">
                  <h3 className="text-sm font-bold mb-2 flex items-center gap-2">
                    <i className="fas fa-truck text-blue-600"></i>
                    Pickup/Delivery Information
                  </h3>
                  <div className="bg-white/70 p-3 rounded-md text-sm leading-relaxed text-gray-700">
                    {selectedReturn.pickupInfo}
                  </div>
                </div>
              )}

              {/* Proof Images */}
              {selectedReturn.proofImages && (
                <div className="bg-gray-50 p-4 rounded-lg mb-4 border-l-4 border-teal-500">
                  <h3 className="text-sm font-bold mb-2 flex items-center gap-2">
                    <i className="fas fa-images text-teal-600"></i>
                    Proof Images
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedReturn.proofImages.split(',').map((img, index) => (
                      <div
                        key={index}
                        className="inline-flex items-center gap-2 px-2.5 py-1 bg-gray-100 rounded-md text-xs"
                      >
                        <i className="fas fa-image text-teal-600"></i>
                        {img.trim()}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Timeline */}
              <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-teal-500">
                <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
                  <i className="fas fa-history text-teal-600"></i>
                  Return Timeline
                </h3>
                <div className="relative">
                  {selectedReturn.timeline.map((event, index) => (
                    <div
                      key={index}
                      className="relative pl-8 pb-5 last:pb-0"
                    >
                      {index < selectedReturn.timeline.length - 1 && (
                        <div className="absolute left-3 top-6 bottom-0 w-0.5 bg-gray-200"></div>
                      )}
                      
                      <div className={`absolute left-0 top-0.5 w-6 h-6 rounded-full flex items-center justify-center border-2 ${
                        event.type === 'success' ? 'bg-green-50 border-green-500' :
                        event.type === 'error' ? 'bg-red-50 border-red-500' :
                        event.type === 'warning' ? 'bg-yellow-50 border-yellow-500' : 
                        'bg-blue-50 border-blue-500'
                      }`}>
                        <i className={`fas fa-${
                          event.type === 'success' ? 'check' :
                          event.type === 'error' ? 'times' :
                          event.type === 'warning' ? 'exclamation' : 'info'
                        } text-xs ${
                          event.type === 'success' ? 'text-green-600' :
                          event.type === 'error' ? 'text-red-600' :
                          event.type === 'warning' ? 'text-yellow-600' : 
                          'text-blue-600'
                        }`}></i>
                      </div>
                      
                      <div>
                        <div className="text-sm font-bold text-gray-800 mb-0.5">
                          {event.status}
                        </div>
                        <div className="text-xs text-gray-500 mb-1">
                          {formatDate(event.date)} at {event.time}
                        </div>
                        <div className="text-sm text-gray-600 leading-relaxed">
                          {event.description}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* FIXED FOOTER */}
            <div className="flex justify-end px-5 py-4 border-t-2 border-gray-100 flex-shrink-0 bg-gray-50">
              <button 
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-teal-400 to-teal-700 text-white rounded-md text-sm font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                onClick={() => setShowViewModal(false)}
              >
                <i className="fas fa-times"></i>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================
           CONFIRMATION MODAL
           ============================================ */}
      {showConfirmModal && confirmAction && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[10000] p-5 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full animate-slideUp">
            <div className="flex justify-between items-center px-5 py-4 border-b-2 border-gray-100">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <i className="fas fa-question-circle text-yellow-600"></i>
                {confirmAction.title || 'Confirm Action'}
              </h2>
              <button 
                className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full hover:bg-red-100 hover:text-red-600 hover:rotate-90 transition-all duration-200"
                onClick={() => setShowConfirmModal(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="px-5 py-4">
              <p
                className="text-sm leading-relaxed text-gray-600"
                dangerouslySetInnerHTML={{ __html: confirmAction.message || 'Are you sure you want to proceed?' }}
              ></p>
            </div>
            
            <div className="flex justify-end gap-2 px-5 py-4 border-t-2 border-gray-100">
              <button 
                className="inline-flex items-center gap-2 px-4 py-2 bg-white text-gray-700 border-2 border-gray-200 rounded-md text-sm font-semibold hover:border-red-400 hover:text-red-600 transition-all duration-200"
                onClick={() => setShowConfirmModal(false)}
              >
                <i className="fas fa-times"></i>
                Cancel
              </button>
              <button 
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-teal-400 to-teal-700 text-white rounded-md text-sm font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                onClick={() => {
                  if (confirmAction && confirmAction.onConfirm) {
                    confirmAction.onConfirm();
                  }
                }}
              >
                <i className="fas fa-check"></i>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

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
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        ::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb {
          background: #0CC0BC;
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #076A70;
        }
      `}</style>
    </>
  );
};

export default ReturnReplacementModals;
