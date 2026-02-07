// src/modals/ReportModals.jsx
import React, { useState, useEffect } from 'react';

const ReportModals = ({
  showFilterPresetModal,
  setShowFilterPresetModal,
  showExportModal,
  setShowExportModal,
  showToast,
  currentFilters,
  currentReport
}) => {
  // Filter Preset Form State
  const [presetForm, setPresetForm] = useState({
    presetName: '',
    description: '',
    isDefault: false,
    shareWithTeam: false
  });

  // Export Options Form State
  const [exportForm, setExportForm] = useState({
    format: 'excel',
    includeHeaders: true,
    includeFilters: true,
    dateFormat: 'DD/MM/YYYY',
    numberFormat: 'indian',
    fileName: '',
    paperSize: 'A4',
    orientation: 'landscape'
  });

  // Validation errors
  const [presetErrors, setPresetErrors] = useState({});
  const [presetTouched, setPresetTouched] = useState({});

  // Saved presets (in real app, this would come from backend)
  const [savedPresets, setSavedPresets] = useState([
    {
      id: 1,
      name: 'Last 30 Days - All Status',
      description: 'Shows all records from last 30 days',
      filters: { dateRange: 'last30days', status: 'all' },
      isDefault: true,
      createdBy: 'Admin',
      createdDate: '2026-01-15'
    },
    {
      id: 2,
      name: 'Critical Stock Items',
      description: 'Low and critical stock items only',
      filters: { stockStatus: 'critical', category: 'all' },
      isDefault: false,
      createdBy: 'Store Manager',
      createdDate: '2026-01-20'
    }
  ]);

  const [selectedPreset, setSelectedPreset] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [presetToDelete, setPresetToDelete] = useState(null);

  // Reset forms when modals close
  useEffect(() => {
    if (!showFilterPresetModal) {
      resetPresetForm();
    }
  }, [showFilterPresetModal]);

  useEffect(() => {
    if (!showExportModal) {
      resetExportForm();
    }
  }, [showExportModal]);

  // Reset preset form
  const resetPresetForm = () => {
    setPresetForm({
      presetName: '',
      description: '',
      isDefault: false,
      shareWithTeam: false
    });
    setPresetErrors({});
    setPresetTouched({});
  };

  // Reset export form
  const resetExportForm = () => {
    setExportForm({
      format: 'excel',
      includeHeaders: true,
      includeFilters: true,
      dateFormat: 'DD/MM/YYYY',
      numberFormat: 'indian',
      fileName: '',
      paperSize: 'A4',
      orientation: 'landscape'
    });
  };

  // Filter input for preset name (only letters, numbers, spaces, hyphens)
  const filterPresetInput = (value) => {
    return value.replace(/[^a-zA-Z0-9\s-]/g, '');
  };

  // Validate preset field
  const validatePresetField = (fieldName, value) => {
    let error = '';

    switch (fieldName) {
      case 'presetName':
        if (!value.trim()) {
          error = 'Preset name is required';
        } else if (value.trim().length < 3) {
          error = 'Preset name must be at least 3 characters';
        } else if (value.trim().length > 50) {
          error = 'Preset name must not exceed 50 characters';
        } else if (!/^[a-zA-Z0-9\s-]+$/.test(value.trim())) {
          error = 'Preset name can only contain letters, numbers, spaces and hyphens';
        } else if (savedPresets.some(p => p.name.toLowerCase() === value.trim().toLowerCase())) {
          error = 'A preset with this name already exists';
        }
        break;

      case 'description':
        if (value.trim() && value.trim().length < 10) {
          error = 'Description must be at least 10 characters if provided';
        } else if (value.trim().length > 200) {
          error = 'Description must not exceed 200 characters';
        }
        break;

      default:
        break;
    }

    return error;
  };

  // Handle preset input change
  const handlePresetInputChange = (field, value) => {
    let filteredValue = value;
    
    if (field === 'presetName') {
      filteredValue = filterPresetInput(value);
      // Prevent multiple consecutive spaces
      filteredValue = filteredValue.replace(/\s{2,}/g, ' ');
    }

    setPresetForm(prev => ({
      ...prev,
      [field]: filteredValue
    }));

    // Validate on change if field has been touched
    if (presetTouched[field]) {
      const error = validatePresetField(field, filteredValue);
      setPresetErrors(prev => ({
        ...prev,
        [field]: error
      }));
    }
  };

  // Handle preset field blur
  const handlePresetBlur = (field) => {
    setPresetTouched(prev => ({
      ...prev,
      [field]: true
    }));

    const error = validatePresetField(field, presetForm[field]);
    setPresetErrors(prev => ({
      ...prev,
      [field]: error
    }));
  };

  // Handle checkbox change for preset
  const handlePresetCheckboxChange = (field) => {
    setPresetForm(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  // Validate entire preset form
  const validatePresetForm = () => {
    const newErrors = {};

    newErrors.presetName = validatePresetField('presetName', presetForm.presetName);
    newErrors.description = validatePresetField('description', presetForm.description);

    // Remove empty errors
    Object.keys(newErrors).forEach(key => {
      if (!newErrors[key]) delete newErrors[key];
    });

    setPresetErrors(newErrors);

    // Mark all fields as touched
    setPresetTouched({
      presetName: true,
      description: true
    });

    return Object.keys(newErrors).length === 0;
  };

  // Save filter preset
  const handleSavePreset = (e) => {
    e.preventDefault();

    if (!validatePresetForm()) {
      showToast('Please fix all validation errors', 'error', 'Validation Error');
      return;
    }

    if (!currentFilters || Object.keys(currentFilters).length === 0) {
      showToast('No filters applied to save', 'warning', 'No Filters');
      return;
    }

    const newPreset = {
      id: Date.now(),
      name: presetForm.presetName.trim(),
      description: presetForm.description.trim() || 'No description',
      filters: { ...currentFilters },
      isDefault: presetForm.isDefault,
      shareWithTeam: presetForm.shareWithTeam,
      createdBy: 'Current User',
      createdDate: new Date().toISOString().split('T')[0]
    };

    setSavedPresets([newPreset, ...savedPresets]);
    showToast(`Filter preset "${newPreset.name}" saved successfully!`, 'success', 'Preset Saved');
    setShowFilterPresetModal(false);
    resetPresetForm();
  };

  // Load filter preset
  const handleLoadPreset = (preset) => {
    // In real implementation, this would update the parent component's filters
    showToast(`Loaded preset: ${preset.name}`, 'success', 'Preset Loaded');
    setShowFilterPresetModal(false);
  };

  // Delete preset
  const handleDeletePreset = (presetId) => {
    const preset = savedPresets.find(p => p.id === presetId);
    setPresetToDelete(preset);
    setShowDeleteConfirm(true);
  };

  const confirmDeletePreset = () => {
    setSavedPresets(savedPresets.filter(p => p.id !== presetToDelete.id));
    showToast(`Preset "${presetToDelete.name}" deleted successfully`, 'success', 'Preset Deleted');
    setShowDeleteConfirm(false);
    setPresetToDelete(null);
  };

  // Handle export option change
  const handleExportOptionChange = (field, value) => {
    setExportForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle export checkbox change
  const handleExportCheckboxChange = (field) => {
    setExportForm(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  // Generate default filename
  const generateFileName = () => {
    if (!currentReport) return 'report_export';
    const reportName = currentReport.type.replace(/-/g, '_');
    const date = new Date().toISOString().split('T')[0];
    return `${reportName}_${date}`;
  };

  // Handle export
  const handleExport = () => {
    if (!currentReport) {
      showToast('No report selected', 'error', 'Export Error');
      return;
    }

    const fileName = exportForm.fileName.trim() || generateFileName();
    const extension = exportForm.format === 'excel' ? 'xlsx' : 
                     exportForm.format === 'csv' ? 'csv' : 'pdf';

    showToast(
      `Exporting to ${exportForm.format.toUpperCase()}... File: ${fileName}.${extension}`,
      'info',
      'Export Started'
    );

    // Simulate export process
    setTimeout(() => {
      showToast(
        `Report exported successfully as ${fileName}.${extension}`,
        'success',
        'Export Complete'
      );
      setShowExportModal(false);
      resetExportForm();
    }, 1500);
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
           FILTER PRESET MODAL
           ============================================ */}
      {showFilterPresetModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[10000] p-4 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[95vh] flex flex-col animate-slideUp">
            {/* FIXED HEADER */}
            <div className="flex justify-between items-center px-5 py-4 border-b-2 border-gray-100 flex-shrink-0">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <i className="fas fa-bookmark text-teal-600"></i>
                Filter Presets
              </h2>
              <button
                className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full hover:bg-red-100 hover:text-red-600 hover:rotate-90 transition-all duration-200"
                onClick={() => setShowFilterPresetModal(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            {/* SCROLLABLE CONTENT */}
            <div className="flex-1 overflow-y-auto">
              <div className="grid md:grid-cols-2 gap-5 p-5">
                {/* LEFT SIDE - Create New Preset */}
                <div className="bg-gradient-to-br from-cyan-50 to-teal-50 rounded-lg p-5 border-2 border-teal-200">
                  <h3 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2 pb-3 border-b-2 border-teal-200">
                    <i className="fas fa-plus-circle text-teal-600"></i>
                    Save Current Filters
                  </h3>

                  <form onSubmit={handleSavePreset}>
                    {/* Preset Name */}
                    <div className="flex flex-col mb-4">
                      <label className="text-xs font-semibold text-gray-700 mb-1.5">
                        Preset Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        className={`px-3 py-2 border-2 rounded-md text-sm focus:outline-none focus:ring-4 transition-all duration-200 ${
                          presetErrors.presetName && presetTouched.presetName
                            ? 'border-red-400 focus:border-red-400 focus:ring-red-100'
                            : 'border-gray-200 focus:border-teal-400 focus:ring-cyan-100'
                        }`}
                        value={presetForm.presetName}
                        onChange={(e) => handlePresetInputChange('presetName', e.target.value)}
                        onBlur={() => handlePresetBlur('presetName')}
                        placeholder="e.g., Monthly Low Stock Report"
                        maxLength={50}
                        autoFocus
                      />
                      {presetErrors.presetName && presetTouched.presetName && (
                        <span className="text-xs text-red-600 mt-1 flex items-center gap-1">
                          <i className="fas fa-exclamation-circle"></i>
                          {presetErrors.presetName}
                        </span>
                      )}
                      <span className={`text-xs mt-1 ${getCharCountColor(presetForm.presetName.length, 50)}`}>
                        {presetForm.presetName.length}/50 characters
                      </span>
                    </div>

                    {/* Description */}
                    <div className="flex flex-col mb-4">
                      <label className="text-xs font-semibold text-gray-700 mb-1.5">
                        Description
                      </label>
                      <textarea
                        className={`px-3 py-2 border-2 rounded-md text-sm resize-y min-h-[80px] focus:outline-none focus:ring-4 transition-all duration-200 ${
                          presetErrors.description && presetTouched.description
                            ? 'border-red-400 focus:border-red-400 focus:ring-red-100'
                            : 'border-gray-200 focus:border-teal-400 focus:ring-cyan-100'
                        }`}
                        value={presetForm.description}
                        onChange={(e) => handlePresetInputChange('description', e.target.value)}
                        onBlur={() => handlePresetBlur('description')}
                        placeholder="Brief description of this filter preset..."
                        maxLength={200}
                      ></textarea>
                      {presetErrors.description && presetTouched.description && (
                        <span className="text-xs text-red-600 mt-1 flex items-center gap-1">
                          <i className="fas fa-exclamation-circle"></i>
                          {presetErrors.description}
                        </span>
                      )}
                      <span className={`text-xs mt-1 ${getCharCountColor(presetForm.description.length, 200)}`}>
                        {presetForm.description.length}/200 characters
                      </span>
                    </div>

                    {/* Current Filters Display */}
                    <div className="bg-white rounded-lg p-3 mb-4 border-2 border-teal-200">
                      <div className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <i className="fas fa-filter text-teal-600"></i>
                        Current Active Filters
                      </div>
                      {currentFilters && Object.keys(currentFilters).length > 0 ? (
                        <div className="space-y-1">
                          {Object.entries(currentFilters).map(([key, value]) => (
                            <div key={key} className="text-xs text-gray-600 flex items-start gap-2">
                              <i className="fas fa-check-circle text-green-600 mt-0.5"></i>
                              <span><strong className="text-gray-800">{key}:</strong> {value}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-xs text-gray-500 italic">No filters applied</div>
                      )}
                    </div>

                    {/* Options */}
                    <div className="space-y-2 mb-4">
                      <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:bg-white/50 p-2 rounded transition-all duration-200">
                        <input
                          type="checkbox"
                          checked={presetForm.isDefault}
                          onChange={() => handlePresetCheckboxChange('isDefault')}
                          className="w-4 h-4 text-teal-600 rounded"
                        />
                        <span className="font-medium">Set as default preset</span>
                      </label>
                      <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:bg-white/50 p-2 rounded transition-all duration-200">
                        <input
                          type="checkbox"
                          checked={presetForm.shareWithTeam}
                          onChange={() => handlePresetCheckboxChange('shareWithTeam')}
                          className="w-4 h-4 text-teal-600 rounded"
                        />
                        <span className="font-medium">Share with team</span>
                      </label>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-br from-teal-400 to-teal-700 text-white rounded-md text-sm font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                    >
                      <i className="fas fa-save"></i>
                      Save Filter Preset
                    </button>
                  </form>
                </div>

                {/* RIGHT SIDE - Saved Presets */}
                <div>
                  <h3 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <i className="fas fa-list text-teal-600"></i>
                    Saved Presets ({savedPresets.length})
                  </h3>

                  {savedPresets.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                      <div className="text-4xl text-gray-300 mb-3">
                        <i className="fas fa-inbox"></i>
                      </div>
                      <div className="text-sm font-bold text-gray-800 mb-1">No Saved Presets</div>
                      <div className="text-xs text-gray-500">Create your first filter preset to get started</div>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                      {savedPresets.map(preset => (
                        <div
                          key={preset.id}
                          className="bg-white rounded-lg p-4 border-2 border-gray-200 hover:border-teal-400 hover:shadow-md transition-all duration-200"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="text-sm font-bold text-gray-800">{preset.name}</h4>
                                {preset.isDefault && (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-cyan-50 text-teal-600 rounded-full text-xs font-semibold">
                                    <i className="fas fa-star"></i>
                                    Default
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-gray-600 mb-2">{preset.description}</p>
                              <div className="flex items-center gap-3 text-xs text-gray-500">
                                <span className="flex items-center gap-1">
                                  <i className="fas fa-user"></i>
                                  {preset.createdBy}
                                </span>
                                <span className="flex items-center gap-1">
                                  <i className="fas fa-calendar"></i>
                                  {new Date(preset.createdDate).toLocaleDateString('en-IN')}
                                </span>
                              </div>
                            </div>
                            <div className="flex flex-col gap-1 ml-2">
                              <button
                                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-cyan-50 text-teal-600 rounded-md text-xs font-semibold hover:bg-cyan-100 hover:shadow-md transition-all duration-200"
                                onClick={() => handleLoadPreset(preset)}
                                title="Load Preset"
                              >
                                <i className="fas fa-download"></i>
                                Load
                              </button>
                              <button
                                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-red-50 text-red-600 rounded-md text-xs font-semibold hover:bg-red-100 hover:shadow-md transition-all duration-200"
                                onClick={() => handleDeletePreset(preset.id)}
                                title="Delete Preset"
                              >
                                <i className="fas fa-trash"></i>
                                Delete
                              </button>
                            </div>
                          </div>

                          {/* Filters Preview */}
                          <div className="mt-2 pt-2 border-t border-gray-100">
                            <div className="text-xs font-semibold text-gray-600 mb-1">Filters:</div>
                            <div className="flex flex-wrap gap-1">
                              {Object.entries(preset.filters).map(([key, value]) => (
                                <span
                                  key={key}
                                  className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs"
                                >
                                  <strong>{key}:</strong> {value}
                                </span>
                              ))}
                            </div>
                          </div>
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
                className="inline-flex items-center gap-2 px-4 py-2 bg-white text-gray-700 border-2 border-gray-200 rounded-md text-sm font-semibold hover:border-gray-400 transition-all duration-200"
                onClick={() => setShowFilterPresetModal(false)}
              >
                <i className="fas fa-times"></i>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================
           EXPORT OPTIONS MODAL
           ============================================ */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[10000] p-4 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[95vh] flex flex-col animate-slideUp">
            {/* FIXED HEADER */}
            <div className="flex justify-between items-center px-5 py-4 border-b-2 border-gray-100 flex-shrink-0">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <i className="fas fa-file-export text-green-600"></i>
                Export Report
              </h2>
              <button
                className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full hover:bg-red-100 hover:text-red-600 hover:rotate-90 transition-all duration-200"
                onClick={() => setShowExportModal(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            {/* SCROLLABLE CONTENT */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {/* Export Format */}
              <div className="mb-4">
                <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <i className="fas fa-file-alt text-teal-600"></i>
                  Export Format
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  <label className={`flex flex-col items-center gap-2 cursor-pointer p-4 border-2 rounded-lg hover:border-teal-400 transition-all duration-200 ${
                    exportForm.format === 'excel' ? 'border-teal-500 bg-cyan-50' : 'border-gray-200'
                  }`}>
                    <input
                      type="radio"
                      name="format"
                      value="excel"
                      checked={exportForm.format === 'excel'}
                      onChange={(e) => handleExportOptionChange('format', e.target.value)}
                      className="sr-only"
                    />
                    <i className="fas fa-file-excel text-3xl text-green-600"></i>
                    <span className="text-sm font-semibold text-gray-700">Excel (.xlsx)</span>
                  </label>
                  <label className={`flex flex-col items-center gap-2 cursor-pointer p-4 border-2 rounded-lg hover:border-teal-400 transition-all duration-200 ${
                    exportForm.format === 'csv' ? 'border-teal-500 bg-cyan-50' : 'border-gray-200'
                  }`}>
                    <input
                      type="radio"
                      name="format"
                      value="csv"
                      checked={exportForm.format === 'csv'}
                      onChange={(e) => handleExportOptionChange('format', e.target.value)}
                      className="sr-only"
                    />
                    <i className="fas fa-file-csv text-3xl text-blue-600"></i>
                    <span className="text-sm font-semibold text-gray-700">CSV</span>
                  </label>
                  <label className={`flex flex-col items-center gap-2 cursor-pointer p-4 border-2 rounded-lg hover:border-teal-400 transition-all duration-200 ${
                    exportForm.format === 'pdf' ? 'border-teal-500 bg-cyan-50' : 'border-gray-200'
                  }`}>
                    <input
                      type="radio"
                      name="format"
                      value="pdf"
                      checked={exportForm.format === 'pdf'}
                      onChange={(e) => handleExportOptionChange('format', e.target.value)}
                      className="sr-only"
                    />
                    <i className="fas fa-file-pdf text-3xl text-red-600"></i>
                    <span className="text-sm font-semibold text-gray-700">PDF</span>
                  </label>
                </div>
              </div>

              {/* File Name */}
              <div className="mb-4">
                <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <i className="fas fa-signature text-teal-600"></i>
                  File Name
                </h3>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    className="flex-1 px-3 py-2 border-2 border-gray-200 rounded-md text-sm focus:outline-none focus:border-teal-400 focus:ring-4 focus:ring-cyan-100 transition-all duration-200"
                    value={exportForm.fileName}
                    onChange={(e) => handleExportOptionChange('fileName', e.target.value)}
                    placeholder={generateFileName()}
                  />
                  <span className="text-sm font-semibold text-gray-600">
                    .{exportForm.format === 'excel' ? 'xlsx' : exportForm.format}
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Leave empty to use default name
                </div>
              </div>

              {/* Export Options */}
              <div className="mb-4">
                <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <i className="fas fa-cogs text-teal-600"></i>
                  Export Options
                </h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-50 p-2 rounded transition-all duration-200">
                    <input
                      type="checkbox"
                      checked={exportForm.includeHeaders}
                      onChange={() => handleExportCheckboxChange('includeHeaders')}
                      className="w-4 h-4 text-teal-600 rounded"
                    />
                    <span className="font-medium">Include column headers</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-50 p-2 rounded transition-all duration-200">
                    <input
                      type="checkbox"
                      checked={exportForm.includeFilters}
                      onChange={() => handleExportCheckboxChange('includeFilters')}
                      className="w-4 h-4 text-teal-600 rounded"
                    />
                    <span className="font-medium">Include applied filters summary</span>
                  </label>
                </div>
              </div>

              {/* Format Settings */}
              <div className="mb-4">
                <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <i className="fas fa-sliders-h text-teal-600"></i>
                  Format Settings
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col">
                    <label className="text-xs font-semibold text-gray-700 mb-1.5">Date Format</label>
                    <select
                      className="px-3 py-2 border-2 border-gray-200 rounded-md text-sm bg-white cursor-pointer focus:outline-none focus:border-teal-400 transition-all duration-200"
                      value={exportForm.dateFormat}
                      onChange={(e) => handleExportOptionChange('dateFormat', e.target.value)}
                    >
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                      <option value="DD-MMM-YYYY">DD-MMM-YYYY</option>
                    </select>
                  </div>
                  <div className="flex flex-col">
                    <label className="text-xs font-semibold text-gray-700 mb-1.5">Number Format</label>
                    <select
                      className="px-3 py-2 border-2 border-gray-200 rounded-md text-sm bg-white cursor-pointer focus:outline-none focus:border-teal-400 transition-all duration-200"
                      value={exportForm.numberFormat}
                      onChange={(e) => handleExportOptionChange('numberFormat', e.target.value)}
                    >
                      <option value="indian">Indian (1,00,000.00)</option>
                      <option value="international">International (100,000.00)</option>
                      <option value="european">European (100.000,00)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* PDF Specific Options */}
              {exportForm.format === 'pdf' && (
                <div className="mb-4 p-4 bg-red-50 rounded-lg border-2 border-red-200">
                  <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <i className="fas fa-file-pdf text-red-600"></i>
                    PDF Options
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col">
                      <label className="text-xs font-semibold text-gray-700 mb-1.5">Paper Size</label>
                      <select
                        className="px-3 py-2 border-2 border-gray-200 rounded-md text-sm bg-white cursor-pointer focus:outline-none focus:border-red-400 transition-all duration-200"
                        value={exportForm.paperSize}
                        onChange={(e) => handleExportOptionChange('paperSize', e.target.value)}
                      >
                        <option value="A4">A4</option>
                        <option value="A3">A3</option>
                        <option value="Letter">Letter</option>
                        <option value="Legal">Legal</option>
                      </select>
                    </div>
                    <div className="flex flex-col">
                      <label className="text-xs font-semibold text-gray-700 mb-1.5">Orientation</label>
                      <select
                        className="px-3 py-2 border-2 border-gray-200 rounded-md text-sm bg-white cursor-pointer focus:outline-none focus:border-red-400 transition-all duration-200"
                        value={exportForm.orientation}
                        onChange={(e) => handleExportOptionChange('orientation', e.target.value)}
                      >
                        <option value="portrait">Portrait</option>
                        <option value="landscape">Landscape</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Export Info */}
              <div className="bg-blue-50 rounded-lg p-3 border-2 border-blue-200">
                <div className="flex items-start gap-2">
                  <i className="fas fa-info-circle text-blue-600 mt-0.5"></i>
                  <div className="text-xs text-blue-700">
                    <strong>Note:</strong> Large reports may take a few moments to export. 
                    The download will start automatically once the file is ready.
                  </div>
                </div>
              </div>
            </div>

            {/* FIXED FOOTER */}
            <div className="flex justify-end gap-2 px-5 py-4 border-t-2 border-gray-100 flex-shrink-0 bg-gray-50">
              <button
                className="inline-flex items-center gap-2 px-4 py-2 bg-white text-gray-700 border-2 border-gray-200 rounded-md text-sm font-semibold hover:border-gray-400 transition-all duration-200"
                onClick={() => setShowExportModal(false)}
              >
                <i className="fas fa-times"></i>
                Cancel
              </button>
              <button
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-green-500 to-green-700 text-white rounded-md text-sm font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                onClick={handleExport}
              >
                <i className="fas fa-download"></i>
                Export Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================
           DELETE PRESET CONFIRMATION MODAL
           ============================================ */}
      {showDeleteConfirm && presetToDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[10001] p-4 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full animate-slideUp">
            <div className="flex justify-between items-center px-5 py-4 border-b-2 border-gray-100">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <i className="fas fa-exclamation-triangle text-red-600"></i>
                Delete Preset
              </h2>
              <button
                className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full hover:bg-red-100 hover:text-red-600 hover:rotate-90 transition-all duration-200"
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setPresetToDelete(null);
                }}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="px-5 py-4">
              <p className="text-sm text-gray-700 mb-3">
                Are you sure you want to delete the preset <strong className="text-gray-900">"{presetToDelete.name}"</strong>?
              </p>
              <div className="bg-red-50 rounded-lg p-3 border-2 border-red-200">
                <div className="flex items-start gap-2">
                  <i className="fas fa-exclamation-circle text-red-600 mt-0.5"></i>
                  <div className="text-xs text-red-700">
                    <strong>Warning:</strong> This action cannot be undone. The preset will be permanently deleted.
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 px-5 py-4 border-t-2 border-gray-100">
              <button
                className="inline-flex items-center gap-2 px-4 py-2 bg-white text-gray-700 border-2 border-gray-200 rounded-md text-sm font-semibold hover:border-gray-400 transition-all duration-200"
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setPresetToDelete(null);
                }}
              >
                <i className="fas fa-times"></i>
                Cancel
              </button>
              <button
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-red-500 to-red-700 text-white rounded-md text-sm font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                onClick={confirmDeletePreset}
              >
                <i className="fas fa-trash"></i>
                Delete Preset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Animations */}
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
      `}</style>
    </>
  );
};

export default ReportModals;
