// ==========================================================================
// PRODUCT DATA MODULE - All product data exported for use in Product.jsx
// ==========================================================================
//
// This file simulates what would come from your backend API.
// In production, you would replace these with actual API calls:
//
// DUMMY_PRODUCTS → GET /api/products
// DUMMY_CATEGORIES → GET /api/categories
// DUMMY_VENDORS → GET /api/vendors
// DUMMY_PRODUCT_STATISTICS → GET /api/product-statistics
//
// ==========================================================================

// ==========================================================================
// CATEGORIES DATA
// ==========================================================================
export const DUMMY_CATEGORIES = [
  { id: 1, categoryName: 'Electronics', created_At: '2024-01-15' },
  { id: 2, categoryName: 'Furniture', created_At: '2024-01-16' },
  { id: 3, categoryName: 'Stationery', created_At: '2024-01-17' },
  { id: 4, categoryName: 'Hardware', created_At: '2024-02-01' },
  { id: 5, categoryName: 'Office Supplies', created_At: '2024-02-10' },
  { id: 6, categoryName: 'IT Equipment', created_At: '2024-03-05' },
  { id: 7, categoryName: 'Kitchen Appliances', created_At: '2024-03-20' },
  { id: 8, categoryName: 'Cleaning Supplies', created_At: '2024-04-12' }
];

// ==========================================================================
// VENDORS DATA
// ==========================================================================
export const DUMMY_VENDORS = [
  { id: 1, vendorName: 'Tech Solutions Ltd', isActive: true },
  { id: 2, vendorName: 'Office Mart India', isActive: true },
  { id: 3, vendorName: 'Furniture World', isActive: true },
  { id: 4, vendorName: 'Stationery Hub', isActive: true },
  { id: 5, vendorName: 'Digital Supplies Co', isActive: true }
];

// ==========================================================================
// UNITS OF MEASUREMENT
// ==========================================================================
export const UNITS_OF_MEASUREMENT = [
  'Piece', 
  'Pack', 
  'Box', 
  'Set', 
  'Dozen', 
  'Unit', 
  'Kilogram (kg)', 
  'Liter (L)', 
  'Meter (m)', 
  'Square Meter (m²)'
];

// ==========================================================================
// PRODUCTS DATA
// ==========================================================================
export const DUMMY_PRODUCTS = [
  {
    id: 1,
    productName: 'Wireless Mouse',
    categoryId: 1,
    vendorIds: [1],
    productImage: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=400',
    description: 'Ergonomic wireless mouse with 2.4GHz connectivity',
    useCase: 'Office Use',
    currentQuantity: 150,
    minQuantityThreshold: 20,
    unitOfMeasurement: 'Piece',
    purchasePrice: 450,
    productCode: 'ELEC-WM-001',
    status: 'normal',
    brand: 'Logitech',
    rackLocation: 'A1',
    autoPOEnabled: true,
    autoPOQuantity: 50,
    autoPOVendor: 1,
    isScrap: false,
    scrapReason: '',
    scrapDate: '',
    maintenanceEnabled: false,
    maintenanceInterval: 0,
    lastMaintenanceDate: '',
    maintenanceNotes: '',
    expiryDate: '',
    updated_At: '2024-12-20'
  },
  {
    id: 2,
    productName: 'Office Chair',
    categoryId: 2,
    vendorIds: [3],
    productImage: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=400',
    description: 'Executive ergonomic office chair',
    useCase: 'Seating',
    currentQuantity: 8,
    minQuantityThreshold: 10,
    unitOfMeasurement: 'Piece',
    purchasePrice: 5500,
    productCode: 'FURN-OC-002',
    status: 'low',
    brand: 'ErgoMax',
    rackLocation: 'B5',
    autoPOEnabled: false,
    autoPOQuantity: 0,
    autoPOVendor: null,
    isScrap: false,
    scrapReason: '',
    scrapDate: '',
    maintenanceEnabled: true,
    maintenanceInterval: 90,
    lastMaintenanceDate: '2024-10-15',
    maintenanceNotes: 'Check hydraulic lift, tighten screws, lubricate wheels',
    expiryDate: '',
    updated_At: '2024-12-18'
  },
  {
    id: 3,
    productName: 'A4 Paper',
    categoryId: 3,
    vendorIds: [2, 4],
    productImage: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400',
    description: 'Premium quality A4 paper - 500 sheets per pack',
    useCase: 'Printing',
    currentQuantity: 250,
    minQuantityThreshold: 50,
    unitOfMeasurement: 'Pack',
    purchasePrice: 180,
    productCode: 'STAT-A4-003',
    status: 'normal',
    brand: 'JK Copier',
    rackLocation: 'C12',
    autoPOEnabled: true,
    autoPOQuantity: 100,
    autoPOVendor: 2,
    isScrap: false,
    scrapReason: '',
    scrapDate: '',
    maintenanceEnabled: false,
    maintenanceInterval: 0,
    lastMaintenanceDate: '',
    maintenanceNotes: '',
    expiryDate: '',
    updated_At: '2024-12-22'
  },
  {
    id: 4,
    productName: 'Laptop Stand',
    categoryId: 6,
    vendorIds: [1, 5],
    productImage: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=400',
    description: 'Adjustable aluminum laptop stand',
    useCase: 'Ergonomics',
    currentQuantity: 45,
    minQuantityThreshold: 15,
    unitOfMeasurement: 'Piece',
    purchasePrice: 850,
    productCode: 'IT-LS-004',
    status: 'normal',
    brand: 'TechGear',
    rackLocation: 'A3',
    autoPOEnabled: true,
    autoPOQuantity: 20,
    autoPOVendor: 5,
    isScrap: false,
    scrapReason: '',
    scrapDate: '',
    maintenanceEnabled: false,
    maintenanceInterval: 0,
    lastMaintenanceDate: '',
    maintenanceNotes: '',
    expiryDate: '',
    updated_At: '2025-01-10'
  }
];

// ==========================================================================
// PRODUCT STATISTICS DATA (Simulating API Response)
// ==========================================================================
export const DUMMY_PRODUCT_STATISTICS = {
  totalProducts: {
    count: 4,
    change: '+5',
    changeLabel: 'This week',
    changeType: 'positive'
  },
  totalCategories: {
    count: 8,
    change: 'All Active',
    changeLabel: '',
    changeType: 'positive'
  },
  lowStockItems: {
    count: 1,
    change: 'Needs Attention',
    changeLabel: '',
    changeType: 'warning'
  },
  totalValue: {
    value: 723200,
    formatted: '₹7,23,200',
    change: 'Inventory Worth',
    changeLabel: '',
    changeType: 'positive'
  },
  lastUpdated: '2026-01-28T10:30:00Z'
};

// ==========================================================================
// UTILITY FUNCTIONS
// ==========================================================================

/**
 * Calculate product statistics from products array
 * @param {Array} products - Array of product objects
 * @param {Array} categories - Array of category objects
 * @param {Object} apiStats - Optional pre-calculated stats from API
 * @returns {Object} Statistics object
 */
export const calculateProductStats = (products, categories, apiStats = null) => {
  if (apiStats) {
    return {
      totalProducts: apiStats.totalProducts.count,
      totalCategories: apiStats.totalCategories.count,
      lowStockItems: apiStats.lowStockItems.count,
      totalValue: apiStats.totalValue.formatted,
      totalValueRaw: apiStats.totalValue.value,
      monthlyChange: apiStats.totalProducts.change,
      monthlyChangeType: apiStats.totalProducts.changeType
    };
  }

  // Fallback: Calculate from data
  const totalProducts = products.length;
  const totalCategories = categories.length;
  const lowStockItems = products.filter(p => p.status === 'low' || p.currentQuantity <= p.minQuantityThreshold).length;
  const totalValue = products.reduce((sum, p) => sum + (p.currentQuantity * p.purchasePrice), 0);

  return {
    totalProducts,
    totalCategories,
    lowStockItems,
    totalValue: `₹${totalValue.toLocaleString('en-IN')}`,
    totalValueRaw: totalValue,
    monthlyChange: '+5',
    monthlyChangeType: 'positive'
  };
};

/**
 * Get category name by ID
 * @param {Number} categoryId - Category ID
 * @param {Array} categories - Array of categories
 * @returns {String} Category name
 */
export const getCategoryName = (categoryId, categories) => {
  const category = categories.find(c => c.id === categoryId);
  return category ? category.categoryName : 'Unknown';
};

/**
 * Get vendor names by IDs
 * @param {Array} vendorIds - Array of vendor IDs
 * @param {Array} vendors - Array of vendors
 * @returns {String} Comma-separated vendor names
 */
export const getVendorNames = (vendorIds, vendors) => {
  if (!vendorIds || vendorIds.length === 0) return 'No Vendor';
  return vendorIds
    .map(id => {
      const vendor = vendors.find(v => v.id === id);
      return vendor ? vendor.vendorName : '';
    })
    .filter(Boolean)
    .join(', ');
};

/**
 * Get filtered products based on search and filters
 * @param {Array} products - Array of products
 * @param {Object} filters - Filter criteria
 * @returns {Array} Filtered products
 */
export const getFilteredProducts = (products, filters = {}) => {
  const { searchValue = '', categoryFilter = '', statusFilter = '', stockFilter = '' } = filters;

  return products.filter(product => {
    // Search filter
    const matchesSearch = !searchValue || (
      product.productName.toLowerCase().includes(searchValue.toLowerCase()) ||
      product.productCode.toLowerCase().includes(searchValue.toLowerCase()) ||
      (product.brand && product.brand.toLowerCase().includes(searchValue.toLowerCase())) ||
      (product.description && product.description.toLowerCase().includes(searchValue.toLowerCase()))
    );

    // Category filter
    const matchesCategory = !categoryFilter || product.categoryId === parseInt(categoryFilter);

    // Status filter
    const matchesStatus = !statusFilter || product.status === statusFilter;

    // Stock filter
    let matchesStock = true;
    if (stockFilter === 'low') {
      matchesStock = product.status === 'low' || product.currentQuantity <= product.minQuantityThreshold;
    } else if (stockFilter === 'normal') {
      matchesStock = product.currentQuantity > product.minQuantityThreshold;
    }

    return matchesSearch && matchesCategory && matchesStatus && matchesStock;
  });
};

/**
 * Validate product data before saving
 * @param {Object} productData - Product data to validate
 * @returns {Object} Validation result with isValid and errors
 */
export const validateProductData = (productData) => {
  const errors = [];

  if (!productData.productName || productData.productName.trim().length < 2) {
    errors.push('Product name must be at least 2 characters long');
  }

  if (!productData.categoryId) {
    errors.push('Please select a category');
  }

  if (!productData.productCode || productData.productCode.trim().length < 3) {
    errors.push('Product code must be at least 3 characters long');
  }

  if (!productData.unitOfMeasurement) {
    errors.push('Please select unit of measurement');
  }

  if (productData.currentQuantity === '' || productData.currentQuantity < 0) {
    errors.push('Current quantity must be a valid number');
  }

  if (productData.minQuantityThreshold === '' || productData.minQuantityThreshold < 0) {
    errors.push('Minimum quantity threshold must be a valid number');
  }

  if (productData.purchasePrice === '' || productData.purchasePrice < 0) {
    errors.push('Purchase price must be a valid number');
  }

  if (productData.autoPOEnabled) {
    if (!productData.autoPOQuantity || productData.autoPOQuantity <= 0) {
      errors.push('Auto PO quantity must be greater than 0 when Auto PO is enabled');
    }
    if (!productData.autoPOVendor) {
      errors.push('Please select a vendor for Auto PO');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Generate next product ID
 * @param {Array} products - Existing products
 * @returns {Number} Next available ID
 */
export const generateNextProductId = (products) => {
  if (products.length === 0) return 1;
  return Math.max(...products.map(p => p.id)) + 1;
};

/**
 * Generate next category ID
 * @param {Array} categories - Existing categories
 * @returns {Number} Next available ID
 */
export const generateNextCategoryId = (categories) => {
  if (categories.length === 0) return 1;
  return Math.max(...categories.map(c => c.id)) + 1;
};

/**
 * Format currency for Indian format
 * @param {Number} value - Value to format
 * @returns {String} Formatted currency string
 */
export const formatCurrency = (value) => {
  return `₹${value.toLocaleString('en-IN')}`;
};

/**
 * Determine product status based on quantity
 * @param {Number} currentQty - Current quantity
 * @param {Number} minQty - Minimum threshold
 * @returns {String} Status ('normal', 'low', 'out')
 */
export const determineProductStatus = (currentQty, minQty) => {
  if (currentQty === 0) return 'out';
  if (currentQty <= minQty) return 'low';
  return 'normal';
};

/**
 * Get products by category
 * @param {Number} categoryId - Category ID
 * @param {Array} products - Array of products
 * @returns {Array} Products in the category
 */
export const getProductsByCategory = (categoryId, products) => {
  return products.filter(p => p.categoryId === categoryId);
};

// ==========================================================================
// CONSTANTS
// ==========================================================================

export const PRODUCT_STATUS = {
  NORMAL: 'normal',
  LOW: 'low',
  OUT: 'out'
};

export const PRODUCT_STATUS_CONFIG = {
  normal: {
    label: 'Normal',
    color: 'bg-green-100 text-green-600',
    icon: 'fa-check-circle'
  },
  low: {
    label: 'Low Stock',
    color: 'bg-yellow-100 text-yellow-600',
    icon: 'fa-exclamation-triangle'
  },
  out: {
    label: 'Out of Stock',
    color: 'bg-red-100 text-red-600',
    icon: 'fa-times-circle'
  }
};

export const FILTER_OPTIONS = {
  STOCK: [
    { value: '', label: 'All Stock Levels' },
    { value: 'normal', label: 'Normal Stock' },
    { value: 'low', label: 'Low Stock' }
  ],
  STATUS: [
    { value: '', label: 'All Status' },
    { value: 'normal', label: 'Normal' },
    { value: 'low', label: 'Low Stock' },
    { value: 'out', label: 'Out of Stock' }
  ]
};