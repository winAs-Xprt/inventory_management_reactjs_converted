// src/data/ProductData.jsx

// ==========================================================================
// CONSTANTS
// ==========================================================================

export const VENDOR_STATUS = {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive'
};

export const PRODUCT_STATUS = {
  NORMAL: 'normal',
  LOW: 'low',
  CRITICAL: 'critical',
  OUT: 'out'
};

// ==========================================================================
// INITIAL CATEGORIES DATA
// ==========================================================================

export const INITIAL_CATEGORIES = [
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
// INITIAL VENDORS DATA
// ==========================================================================

export const INITIAL_VENDORS = [
  { id: 1, vendorName: 'Tech Solutions Ltd', isActive: true },
  { id: 2, vendorName: 'Office Mart India', isActive: true },
  { id: 3, vendorName: 'Furniture World', isActive: true },
  { id: 4, vendorName: 'Stationery Hub', isActive: true },
  { id: 5, vendorName: 'Digital Supplies Co', isActive: true },
  { id: 6, vendorName: 'Hardware Express', isActive: true },
  { id: 7, vendorName: 'ElectroMart', isActive: true },
  { id: 8, vendorName: 'Global Traders', isActive: true }
];

// ==========================================================================
// INITIAL UNITS DATA
// ==========================================================================

export const INITIAL_UNITS = [
  'Piece',
  'Pack',
  'Box',
  'Set',
  'Dozen',
  'Unit',
  'Kilogram (kg)',
  'Gram (g)',
  'Liter (L)',
  'Milliliter (mL)',
  'Meter (m)',
  'Centimeter (cm)',
  'Square Meter (m²)',
  'Cubic Meter (m³)',
  'Pair',
  'Bundle',
  'Roll',
  'Sheet',
  'Carton',
  'Pallet'
];

// ==========================================================================
// RACK CONFIGURATION
// ==========================================================================

export const RACK_CONFIG = {
  rack1: {
    name: 'Rack 1',
    prefix: 'A',
    columns: 6,
    rows: 4,
    cells: []
  },
  rack2: {
    name: 'Rack 2',
    prefix: 'B',
    columns: 3,
    rows: 5,
    cells: []
  },
  rack3: {
    name: 'Rack 3',
    prefix: 'C',
    columns: 3,
    rows: 4,
    cells: []
  },
  wardrobe1: {
    name: 'Wardrobe 1',
    prefix: 'W1',
 
    cells: []
  },
  wardrobe2: {
    name: 'Wardrobe 2',
    prefix: 'W2',

    cells: []
  }
};

// ==========================================================================
// INITIAL PRODUCTS DATA
// ==========================================================================

export const INITIAL_PRODUCTS = [
  {
    id: 1,
    productName: 'Wireless Mouse',
    categoryId: 1,
    vendorIds: [1],
    vendorPrices: { 1: 450 },
    productImage: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=400',
    description: 'Ergonomic wireless mouse with 2.4GHz connectivity and long battery life',
    useCase: 'Office Use',
    currentQuantity: 150,
    minQuantityThreshold: 20,
    reorderQuantity: 50,
    scrapQuantity: 0,
    maintenanceQuantity: 0,
    unitOfMeasurement: 'Piece',
    productCode: 'ELEC-WM-001',
    status: 'normal',
    brand: 'Logitech',
    rackLocation: 'A1',
    autoPOEnabled: true,
    autoPOQuantity: 50,
    autoPOVendor: 1,
    isScrap: false,
    maintenanceEnabled: false,
    expiryDate: '',
    updated_At: '2024-12-20'
  },
  {
    id: 2,
    productName: 'Office Chair',
    categoryId: 2,
    vendorIds: [3],
    vendorPrices: { 3: 5500 },
    productImage: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=400',
    description: 'Executive ergonomic office chair with adjustable height and lumbar support',
    useCase: 'Seating',
    currentQuantity: 8,
    minQuantityThreshold: 10,
    reorderQuantity: 15,
    scrapQuantity: 0,
    maintenanceQuantity: 0,
    unitOfMeasurement: 'Piece',
    productCode: 'FURN-OC-002',
    status: 'low',
    brand: 'ErgoMax',
    rackLocation: 'B5',
    autoPOEnabled: false,
    autoPOQuantity: 0,
    autoPOVendor: null,
    isScrap: false,
    maintenanceEnabled: true,
    expiryDate: '',
    updated_At: '2024-12-18'
  },
  {
    id: 3,
    productName: 'A4 Paper',
    categoryId: 3,
    vendorIds: [2, 4],
    vendorPrices: { 2: 180, 4: 175 },
    productImage: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400',
    description: 'Premium quality A4 paper - 500 sheets per pack, 80 GSM',
    useCase: 'Printing',
    currentQuantity: 250,
    minQuantityThreshold: 50,
    reorderQuantity: 100,
    scrapQuantity: 0,
    maintenanceQuantity: 0,
    unitOfMeasurement: 'Pack',
    productCode: 'STAT-A4-003',
    status: 'normal',
    brand: 'JK Copier',
    rackLocation: 'C12',
    autoPOEnabled: true,
    autoPOQuantity: 100,
    autoPOVendor: 2,
    isScrap: false,
    maintenanceEnabled: false,
    expiryDate: '',
    updated_At: '2024-12-22'
  },
  {
    id: 4,
    productName: 'Laptop Stand',
    categoryId: 6,
    vendorIds: [1, 5],
    vendorPrices: { 1: 850, 5: 820 },
    productImage: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=400',
    description: 'Adjustable aluminum laptop stand with cooling ventilation',
    useCase: 'Ergonomics',
    currentQuantity: 45,
    minQuantityThreshold: 15,
    reorderQuantity: 25,
    scrapQuantity: 0,
    maintenanceQuantity: 0,
    unitOfMeasurement: 'Piece',
    productCode: 'IT-LS-004',
    status: 'normal',
    brand: 'TechGear',
    rackLocation: 'A3',
    autoPOEnabled: true,
    autoPOQuantity: 20,
    autoPOVendor: 5,
    isScrap: false,
    maintenanceEnabled: false,
    expiryDate: '',
    updated_At: '2025-01-10'
  },
  {
    id: 5,
    productName: 'USB Flash Drive 32GB',
    categoryId: 1,
    vendorIds: [1, 7],
    vendorPrices: { 1: 350, 7: 330 },
    productImage: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400',
    description: 'High-speed USB 3.0 flash drive with 32GB storage capacity',
    useCase: 'Data Storage',
    currentQuantity: 80,
    minQuantityThreshold: 25,
    reorderQuantity: 50,
    scrapQuantity: 0,
    maintenanceQuantity: 0,
    unitOfMeasurement: 'Piece',
    productCode: 'ELEC-USB-005',
    status: 'normal',
    brand: 'SanDisk',
    rackLocation: 'A2',
    autoPOEnabled: true,
    autoPOQuantity: 40,
    autoPOVendor: 7,
    isScrap: false,
    maintenanceEnabled: false,
    expiryDate: '',
    updated_At: '2025-01-05'
  },
  {
    id: 6,
    productName: 'Whiteboard Marker Set',
    categoryId: 3,
    vendorIds: [2, 4],
    vendorPrices: { 2: 120, 4: 115 },
    productImage: 'https://images.unsplash.com/photo-1586960394795-ee8c88e7f278?w=400',
    description: 'Set of 4 whiteboard markers - Black, Blue, Red, Green',
    useCase: 'Writing',
    currentQuantity: 12,
    minQuantityThreshold: 20,
    reorderQuantity: 30,
    scrapQuantity: 0,
    maintenanceQuantity: 0,
    unitOfMeasurement: 'Set',
    productCode: 'STAT-WBM-006',
    status: 'critical',
    brand: 'Faber-Castell',
    rackLocation: 'C8',
    autoPOEnabled: true,
    autoPOQuantity: 35,
    autoPOVendor: 4,
    isScrap: false,
    maintenanceEnabled: false,
    expiryDate: '',
    updated_At: '2025-01-12'
  },
  {
    id: 7,
    productName: 'Desk Lamp LED',
    categoryId: 1,
    vendorIds: [5, 7],
    vendorPrices: { 5: 1200, 7: 1150 },
    productImage: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=400',
    description: 'Modern LED desk lamp with adjustable brightness and color temperature',
    useCase: 'Lighting',
    currentQuantity: 28,
    minQuantityThreshold: 12,
    reorderQuantity: 20,
    scrapQuantity: 0,
    maintenanceQuantity: 0,
    unitOfMeasurement: 'Piece',
    productCode: 'ELEC-DL-007',
    status: 'normal',
    brand: 'Philips',
    rackLocation: 'A5',
    autoPOEnabled: false,
    autoPOQuantity: 0,
    autoPOVendor: null,
    isScrap: false,
    maintenanceEnabled: false,
    expiryDate: '',
    updated_At: '2025-01-08'
  },
  {
    id: 8,
    productName: 'File Folders A4',
    categoryId: 3,
    vendorIds: [2, 4],
    vendorPrices: { 2: 85, 4: 80 },
    productImage: 'https://images.unsplash.com/photo-1544377193-33dcf4d68fb5?w=400',
    description: 'Heavy-duty plastic file folders for A4 documents',
    useCase: 'Document Storage',
    currentQuantity: 5,
    minQuantityThreshold: 15,
    reorderQuantity: 40,
    scrapQuantity: 0,
    maintenanceQuantity: 0,
    unitOfMeasurement: 'Piece',
    productCode: 'STAT-FF-008',
    status: 'critical',
    brand: 'Deli',
    rackLocation: 'C10',
    autoPOEnabled: true,
    autoPOQuantity: 50,
    autoPOVendor: 4,
    isScrap: false,
    maintenanceEnabled: false,
    expiryDate: '',
    updated_At: '2025-01-15'
  },
  {
    id: 9,
    productName: 'Monitor 24 inch',
    categoryId: 6,
    vendorIds: [1, 7],
    vendorPrices: { 1: 12500, 7: 12200 },
    productImage: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400',
    description: '24-inch Full HD LED monitor with HDMI and VGA ports',
    useCase: 'Display',
    currentQuantity: 15,
    minQuantityThreshold: 8,
    reorderQuantity: 10,
    scrapQuantity: 0,
    maintenanceQuantity: 0,
    unitOfMeasurement: 'Piece',
    productCode: 'IT-MON-009',
    status: 'normal',
    brand: 'Dell',
    rackLocation: 'B2',
    autoPOEnabled: true,
    autoPOQuantity: 12,
    autoPOVendor: 7,
    isScrap: false,
    maintenanceEnabled: true,
    expiryDate: '',
    updated_At: '2024-12-28'
  },
  {
    id: 10,
    productName: 'Keyboard Wireless',
    categoryId: 1,
    vendorIds: [1, 5],
    vendorPrices: { 1: 650, 5: 620 },
    productImage: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400',
    description: 'Slim wireless keyboard with multimedia keys and numeric keypad',
    useCase: 'Input Device',
    currentQuantity: 65,
    minQuantityThreshold: 20,
    reorderQuantity: 30,
    scrapQuantity: 0,
    maintenanceQuantity: 0,
    unitOfMeasurement: 'Piece',
    productCode: 'ELEC-KB-010',
    status: 'normal',
    brand: 'Logitech',
    rackLocation: 'A4',
    autoPOEnabled: true,
    autoPOQuantity: 35,
    autoPOVendor: 5,
    isScrap: false,
    maintenanceEnabled: false,
    expiryDate: '',
    updated_At: '2025-01-18'
  },
  {
    id: 11,
    productName: 'Extension Cord 5M',
    categoryId: 4,
    vendorIds: [6],
    vendorPrices: { 6: 280 },
    productImage: 'https://images.unsplash.com/photo-1591696205602-2f950c417cb9?w=400',
    description: '5-meter heavy-duty extension cord with 4 sockets and surge protection',
    useCase: 'Power Distribution',
    currentQuantity: 22,
    minQuantityThreshold: 10,
    reorderQuantity: 15,
    scrapQuantity: 0,
    maintenanceQuantity: 0,
    unitOfMeasurement: 'Piece',
    productCode: 'HW-EC-011',
    status: 'normal',
    brand: 'Anchor',
    rackLocation: 'B8',
    autoPOEnabled: false,
    autoPOQuantity: 0,
    autoPOVendor: null,
    isScrap: false,
    maintenanceEnabled: false,
    expiryDate: '',
    updated_At: '2025-01-10'
  },
  {
    id: 12,
    productName: 'Printer Toner Cartridge',
    categoryId: 5,
    vendorIds: [2, 8],
    vendorPrices: { 2: 3200, 8: 3150 },
    productImage: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=400',
    description: 'Compatible laser printer toner cartridge - Black, high yield',
    useCase: 'Printing',
    currentQuantity: 8,
    minQuantityThreshold: 12,
    reorderQuantity: 20,
    scrapQuantity: 0,
    maintenanceQuantity: 0,
    unitOfMeasurement: 'Piece',
    productCode: 'OFF-TC-012',
    status: 'low',
    brand: 'HP',
    rackLocation: 'C5',
    autoPOEnabled: true,
    autoPOQuantity: 25,
    autoPOVendor: 8,
    isScrap: false,
    maintenanceEnabled: false,
    expiryDate: '2026-12-31',
    updated_At: '2025-01-20'
  },
  {
    id: 13,
    productName: 'Stapler Heavy Duty',
    categoryId: 3,
    vendorIds: [2, 4],
    vendorPrices: { 2: 450, 4: 430 },
    productImage: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400',
    description: 'Heavy-duty stapler for up to 100 sheets with staple remover',
    useCase: 'Document Binding',
    currentQuantity: 18,
    minQuantityThreshold: 8,
    reorderQuantity: 12,
    scrapQuantity: 0,
    maintenanceQuantity: 0,
    unitOfMeasurement: 'Piece',
    productCode: 'STAT-ST-013',
    status: 'normal',
    brand: 'Kangaro',
    rackLocation: 'C9',
    autoPOEnabled: false,
    autoPOQuantity: 0,
    autoPOVendor: null,
    isScrap: false,
    maintenanceEnabled: false,
    expiryDate: '',
    updated_At: '2024-12-30'
  },
  {
    id: 14,
    productName: 'HDMI Cable 2M',
    categoryId: 1,
    vendorIds: [1, 5, 7],
    vendorPrices: { 1: 250, 5: 240, 7: 230 },
    productImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
    description: '2-meter HDMI cable with gold-plated connectors, supports 4K',
    useCase: 'Connectivity',
    currentQuantity: 42,
    minQuantityThreshold: 15,
    reorderQuantity: 25,
    scrapQuantity: 0,
    maintenanceQuantity: 0,
    unitOfMeasurement: 'Piece',
    productCode: 'ELEC-HDMI-014',
    status: 'normal',
    brand: 'Belkin',
    rackLocation: 'A6',
    autoPOEnabled: true,
    autoPOQuantity: 30,
    autoPOVendor: 7,
    isScrap: false,
    maintenanceEnabled: false,
    expiryDate: '',
    updated_At: '2025-01-22'
  },
  {
    id: 15,
    productName: 'Notebook A5',
    categoryId: 3,
    vendorIds: [2, 4],
    vendorPrices: { 2: 95, 4: 90 },
    productImage: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=400',
    description: 'A5 ruled notebook with 200 pages and hard cover',
    useCase: 'Note Taking',
    currentQuantity: 0,
    minQuantityThreshold: 25,
    reorderQuantity: 50,
    scrapQuantity: 0,
    maintenanceQuantity: 0,
    unitOfMeasurement: 'Piece',
    productCode: 'STAT-NB-015',
    status: 'out',
    brand: 'Classmate',
    rackLocation: 'C11',
    autoPOEnabled: true,
    autoPOQuantity: 60,
    autoPOVendor: 4,
    isScrap: false,
    maintenanceEnabled: false,
    expiryDate: '',
    updated_At: '2025-01-25'
  }
];

// ==========================================================================
// HELPER FUNCTIONS - RACK CONFIGURATION
// ==========================================================================

/**
 * Initialize rack cells for all racks
 * @param {Object} rackConfig - Rack configuration object
 * @returns {Object} - Initialized rack configuration with cells
 */
export const initializeRackCells = (rackConfig) => {
  const initializedConfig = JSON.parse(JSON.stringify(rackConfig));

  Object.keys(initializedConfig).forEach(rackId => {
    const config = initializedConfig[rackId];
    config.cells = [];

    for (let row = 0; row < config.rows; row++) {
      for (let col = 0; col < config.columns; col++) {
        let cellId;
        
        // Generate cell ID based on rack type
        if (rackId.startsWith('wardrobe')) {
          cellId = `${config.prefix}${row + 1}-${col + 1}`;
        } else {
          cellId = `${config.prefix}${row * config.columns + col + 1}`;
        }

        config.cells.push({
          id: cellId,
          occupied: false,
          productId: null,
          productName: null
        });
      }
    }
  });

  return initializedConfig;
};

// ==========================================================================
// HELPER FUNCTIONS - PRODUCT UTILITIES
// ==========================================================================

/**
 * Get category name by ID
 * @param {Array} categories - Array of categories
 * @param {Number} categoryId - Category ID
 * @returns {String} - Category name
 */
export const getCategoryName = (categories, categoryId) => {
  const category = categories.find(c => c.id === categoryId);
  return category ? category.categoryName : 'Unknown';
};

/**
 * Get vendor name by ID
 * @param {Array} vendors - Array of vendors
 * @param {Number} vendorId - Vendor ID
 * @returns {String} - Vendor name
 */
export const getVendorName = (vendors, vendorId) => {
  const vendor = vendors.find(v => v.id === vendorId);
  return vendor ? vendor.vendorName : 'Unknown';
};

/**
 * Get stock status color based on status
 * @param {String} status - Stock status (normal, low, critical, out)
 * @returns {String} - Tailwind CSS color class
 */
export const getStockColor = (status) => {
  const colorMap = {
    normal: 'text-green-600',
    low: 'text-yellow-600',
    critical: 'text-orange-600',
    out: 'text-red-600'
  };
  return colorMap[status] || 'text-gray-600';
};

/**
 * Calculate stock status based on current and minimum quantity
 * @param {Number} currentQty - Current quantity
 * @param {Number} minQty - Minimum quantity threshold
 * @returns {String} - Stock status
 */
export const getStockStatus = (currentQty, minQty) => {
  if (currentQty === 0) return PRODUCT_STATUS.OUT;
  if (currentQty <= minQty * 0.5) return PRODUCT_STATUS.CRITICAL;
  if (currentQty <= minQty) return PRODUCT_STATUS.LOW;
  return PRODUCT_STATUS.NORMAL;
};

// ==========================================================================
// HELPER FUNCTIONS - STATISTICS
// ==========================================================================

/**
 * Calculate product statistics
 * @param {Array} products - Array of products
 * @returns {Object} - Statistics object
 */
export const calculateProductStats = (products) => {
  const activeProducts = products.filter(p => !p.isScrap);
  
  const totalProducts = activeProducts.length;
  
  const lowStockItems = activeProducts.filter(p => 
    p.status === PRODUCT_STATUS.LOW || 
    p.status === PRODUCT_STATUS.CRITICAL || 
    p.status === PRODUCT_STATUS.OUT
  ).length;
  
  const totalValue = activeProducts.reduce((sum, p) => {
    const price = Object.values(p.vendorPrices || {})[0] || 0;
    return sum + (price * p.currentQuantity);
  }, 0);
  
  const normalStock = activeProducts.filter(p => p.status === PRODUCT_STATUS.NORMAL).length;
  const criticalStock = activeProducts.filter(p => p.status === PRODUCT_STATUS.CRITICAL).length;
  const outOfStock = activeProducts.filter(p => p.status === PRODUCT_STATUS.OUT).length;
  
  const autoPOEnabled = activeProducts.filter(p => p.autoPOEnabled).length;
  const maintenanceEnabled = activeProducts.filter(p => p.maintenanceEnabled).length;
  const scrapItems = products.filter(p => p.isScrap).length;

  return {
    totalProducts,
    lowStockItems,
    totalValue,
    normalStock,
    criticalStock,
    outOfStock,
    autoPOEnabled,
    maintenanceEnabled,
    scrapItems
  };
};

// ==========================================================================
// HELPER FUNCTIONS - FILTERING
// ==========================================================================

/**
 * Filter products based on search criteria
 * @param {Array} products - Array of products
 * @param {Object} filters - Filter criteria
 * @returns {Array} - Filtered products
 */
export const getFilteredProducts = (products, filters) => {
  let filtered = [...products];

  // Filter by search term
  if (filters.search && filters.search.trim()) {
    const searchLower = filters.search.toLowerCase().trim();
    filtered = filtered.filter(p =>
      p.productName.toLowerCase().includes(searchLower) ||
      p.productCode.toLowerCase().includes(searchLower) ||
      p.brand.toLowerCase().includes(searchLower) ||
      (p.description && p.description.toLowerCase().includes(searchLower))
    );
  }

  // Filter by category
  if (filters.categoryId && filters.categoryId !== '') {
    filtered = filtered.filter(p => p.categoryId === parseInt(filters.categoryId));
  }

  // Filter by vendor
  if (filters.vendorId && filters.vendorId !== '') {
    const vendorId = parseInt(filters.vendorId);
    filtered = filtered.filter(p => p.vendorIds.includes(vendorId));
  }

  // Filter by stock status
  if (filters.stockStatus && filters.stockStatus !== '') {
    filtered = filtered.filter(p => p.status === filters.stockStatus);
  }

  // Filter by date range
  if (filters.dateFrom && filters.dateFrom !== '') {
    filtered = filtered.filter(p => new Date(p.updated_At) >= new Date(filters.dateFrom));
  }

  if (filters.dateTo && filters.dateTo !== '') {
    filtered = filtered.filter(p => new Date(p.updated_At) <= new Date(filters.dateTo));
  }

  return filtered;
};

// ==========================================================================
// HELPER FUNCTIONS - VALIDATION
// ==========================================================================

/**
 * Validate product data
 * @param {Object} productData - Product data to validate
 * @returns {Object} - Validation result { isValid: boolean, errors: {} }
 */
export const validateProductData = (productData) => {
  const errors = {};

  // Product Name
  if (!productData.productName || productData.productName.trim().length < 3) {
    errors.productName = 'Product name must be at least 3 characters';
  }

  // Category
  if (!productData.categoryId || productData.categoryId === '') {
    errors.categoryId = 'Category is required';
  }

  // Vendors
  if (!productData.vendorIds || productData.vendorIds.length === 0) {
    errors.vendorIds = 'At least one vendor is required';
  }

  // Vendor Prices
  if (productData.vendorIds && productData.vendorIds.length > 0) {
    productData.vendorIds.forEach(vId => {
      if (!productData.vendorPrices[vId] || parseFloat(productData.vendorPrices[vId]) <= 0) {
        errors[`vendorPrice_${vId}`] = 'Valid price required for all vendors';
      }
    });
  }

  // Current Quantity
  if (productData.currentQuantity === undefined || productData.currentQuantity < 0) {
    errors.currentQuantity = 'Current quantity must be 0 or greater';
  }

  // Minimum Quantity
  if (productData.minQuantityThreshold === undefined || productData.minQuantityThreshold < 0) {
    errors.minQuantityThreshold = 'Minimum quantity must be 0 or greater';
  }

  // Reorder Quantity
  if (productData.reorderQuantity === undefined || productData.reorderQuantity < 0) {
    errors.reorderQuantity = 'Reorder quantity must be 0 or greater';
  }

  // Unit of Measurement
  if (!productData.unitOfMeasurement || productData.unitOfMeasurement.trim() === '') {
    errors.unitOfMeasurement = 'Unit of measurement is required';
  }

  // Rack Location
  if (!productData.rackLocation || productData.rackLocation.trim() === '') {
    errors.rackLocation = 'Rack location is required';
  }

  // Product Code validation (optional but if provided should be valid)
  if (productData.productCode && productData.productCode.trim().length > 0) {
    if (productData.productCode.trim().length < 3) {
      errors.productCode = 'Product code must be at least 3 characters';
    }
  }

  // Auto PO validation
  if (productData.autoPOEnabled) {
    if (!productData.autoPOQuantity || productData.autoPOQuantity <= 0) {
      errors.autoPOQuantity = 'Auto PO quantity must be greater than 0';
    }
    if (!productData.autoPOVendor || productData.autoPOVendor === null) {
      errors.autoPOVendor = 'Auto PO vendor is required when Auto PO is enabled';
    }
  }

  // Expiry Date validation (if provided, should be future date)
  if (productData.expiryDate && productData.expiryDate !== '') {
    const expiryDate = new Date(productData.expiryDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (expiryDate < today) {
      errors.expiryDate = 'Expiry date should be in the future';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// ==========================================================================
// HELPER FUNCTIONS - PRODUCT OPERATIONS
// ==========================================================================

/**
 * Generate unique product code
 * @param {String} categoryName - Category name
 * @param {Array} existingProducts - Existing products array
 * @returns {String} - Generated product code
 */
export const generateProductCode = (categoryName, existingProducts) => {
  const prefix = categoryName.substring(0, 4).toUpperCase();
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  
  let code = `${prefix}-${timestamp}-${random}`;
  
  // Ensure uniqueness
  while (existingProducts.some(p => p.productCode === code)) {
    const newRandom = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    code = `${prefix}-${timestamp}-${newRandom}`;
  }
  
  return code;
};

/**
 * Check if product needs reorder
 * @param {Object} product - Product object
 * @returns {Boolean} - True if needs reorder
 */
export const needsReorder = (product) => {
  return product.currentQuantity <= product.minQuantityThreshold;
};

/**
 * Calculate reorder quantity
 * @param {Object} product - Product object
 * @returns {Number} - Reorder quantity
 */
export const calculateReorderQuantity = (product) => {
  if (product.autoPOEnabled && product.autoPOQuantity > 0) {
    return product.autoPOQuantity;
  }
  return product.reorderQuantity || product.minQuantityThreshold * 2;
};

/**
 * Get product by ID
 * @param {Array} products - Array of products
 * @param {Number} productId - Product ID
 * @returns {Object|null} - Product object or null
 */
export const getProductById = (products, productId) => {
  return products.find(p => p.id === productId) || null;
};

/**
 * Get products by category
 * @param {Array} products - Array of products
 * @param {Number} categoryId - Category ID
 * @returns {Array} - Filtered products
 */
export const getProductsByCategory = (products, categoryId) => {
  return products.filter(p => p.categoryId === categoryId);
};

/**
 * Get products by vendor
 * @param {Array} products - Array of products
 * @param {Number} vendorId - Vendor ID
 * @returns {Array} - Filtered products
 */
export const getProductsByVendor = (products, vendorId) => {
  return products.filter(p => p.vendorIds.includes(vendorId));
};

/**
 * Get low stock products
 * @param {Array} products - Array of products
 * @returns {Array} - Low stock products
 */
export const getLowStockProducts = (products) => {
  return products.filter(p => 
    p.status === PRODUCT_STATUS.LOW || 
    p.status === PRODUCT_STATUS.CRITICAL || 
    p.status === PRODUCT_STATUS.OUT
  );
};

/**
 * Get products requiring auto PO
 * @param {Array} products - Array of products
 * @returns {Array} - Products requiring auto PO
 */
export const getAutoPOProducts = (products) => {
  return products.filter(p => 
    p.autoPOEnabled && 
    needsReorder(p)
  );
};

/**
 * Get expiring products (within next 30 days)
 * @param {Array} products - Array of products
 * @param {Number} days - Days threshold (default 30)
 * @returns {Array} - Expiring products
 */
export const getExpiringProducts = (products, days = 30) => {
  const today = new Date();
  const futureDate = new Date(today.getTime() + (days * 24 * 60 * 60 * 1000));
  
  return products.filter(p => {
    if (!p.expiryDate || p.expiryDate === '') return false;
    const expiryDate = new Date(p.expiryDate);
    return expiryDate >= today && expiryDate <= futureDate;
  });
};

/**
 * Sort products by field
 * @param {Array} products - Array of products
 * @param {String} field - Field to sort by
 * @param {String} order - Sort order ('asc' or 'desc')
 * @returns {Array} - Sorted products
 */
export const sortProducts = (products, field, order = 'asc') => {
  const sorted = [...products];
  
  sorted.sort((a, b) => {
    let aValue = a[field];
    let bValue = b[field];
    
    // Handle string comparisons
    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }
    
    if (order === 'asc') {
      return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
    } else {
      return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
    }
  });
  
  return sorted;
};

// ==========================================================================
// EXPORT SUMMARY REPORT DATA
// ==========================================================================

/**
 * Generate product summary report
 * @param {Array} products - Array of products
 * @param {Array} categories - Array of categories
 * @returns {Object} - Summary report
 */
export const generateProductSummaryReport = (products, categories) => {
  const stats = calculateProductStats(products);
  
  const categoryWiseCount = categories.map(cat => ({
    categoryId: cat.id,
    categoryName: cat.categoryName,
    productCount: getProductsByCategory(products, cat.id).length,
    lowStockCount: getProductsByCategory(products, cat.id).filter(p => 
      p.status !== PRODUCT_STATUS.NORMAL
    ).length
  }));
  
  const topValueProducts = [...products]
    .filter(p => !p.isScrap)
    .sort((a, b) => {
      const aValue = (Object.values(a.vendorPrices || {})[0] || 0) * a.currentQuantity;
      const bValue = (Object.values(b.vendorPrices || {})[0] || 0) * b.currentQuantity;
      return bValue - aValue;
    })
    .slice(0, 10);
  
  return {
    ...stats,
    categoryWiseCount,
    topValueProducts,
    generatedAt: new Date().toISOString()
  };
};

// ==========================================================================
// EXPORT ALL
// ==========================================================================

export default {
  INITIAL_CATEGORIES,
  INITIAL_VENDORS,
  INITIAL_UNITS,
  INITIAL_PRODUCTS,
  RACK_CONFIG,
  VENDOR_STATUS,
  PRODUCT_STATUS,
  initializeRackCells,
  getCategoryName,
  getVendorName,
  getStockColor,
  getStockStatus,
  calculateProductStats,
  getFilteredProducts,
  validateProductData,
  generateProductCode,
  needsReorder,
  calculateReorderQuantity,
  getProductById,
  getProductsByCategory,
  getProductsByVendor,
  getLowStockProducts,
  getAutoPOProducts,
  getExpiringProducts,
  sortProducts,
  generateProductSummaryReport
};
