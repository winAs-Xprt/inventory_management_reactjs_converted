// ==========================================================================
// VENDOR DATA MODULE - All vendor data exported for use in Vendor.jsx
// ==========================================================================
//
// This file simulates what would come from your backend API.
// In production, you would replace these with actual API calls:
//
// DUMMY_VENDORS → GET /api/vendors (fetches all vendor records)
// DUMMY_STATISTICS_DATA → GET /api/vendor-statistics (fetches pre-calculated stats)
//
// Example API integration:
// const vendors = await fetch('/api/vendors').then(res => res.json());
// const stats = await fetch('/api/vendor-statistics').then(res => res.json());
//
// ==========================================================================

export const DUMMY_VENDORS = [
  {
    id: 1,
    vendorName: 'Rajesh Kumar',
    companyName: 'ABC Suppliers Pvt Ltd',
    contact: '+91 9876543210',
    email: 'contact@abcsuppliers.com',
    address: '45 Industrial Estate, Anna Nagar',
    pincode: '600040',
    city: 'Chennai',
    state: 'Tamil Nadu',
    gst: '33AAAPL1234C1Z9',
    vendorType: ['Purchase Vendor'],
    status: 'active',
    lastOrderDate: '2025-12-20',
    totalOrders: 45,
    avatar: 'AB',
    avatarColor: '#17a2b8'
  },
  {
    id: 2,
    vendorName: 'Priya Sharma',
    companyName: 'XYZ Materials Corporation',
    contact: '+91 9876543211',
    email: 'sales@xyzmaterials.com',
    address: '12 Market Road, RS Puram',
    pincode: '641002',
    city: 'Coimbatore',
    state: 'Tamil Nadu',
    gst: '33BBBPL5678D2Y8',
    vendorType: ['Purchase Vendor', 'Maintenance Partner'],
    status: 'active',
    lastOrderDate: '2025-12-18',
    totalOrders: 32,
    avatar: 'XY',
    avatarColor: '#fd7e14'
  },
  {
    id: 3,
    vendorName: 'Amit Patel',
    companyName: 'Global Trading Solutions',
    contact: '+91 9876543212',
    email: 'info@globaltrading.com',
    address: '78 MG Road, Koramangala',
    pincode: '560034',
    city: 'Bangalore',
    state: 'Karnataka',
    gst: '29CCCPL9012E3X7',
    vendorType: ['Maintenance Partner'],
    status: 'active',
    lastOrderDate: '2025-12-22',
    totalOrders: 28,
    avatar: 'GT',
    avatarColor: '#20c997'
  },
  {
    id: 4,
    vendorName: 'Sunita Verma',
    companyName: 'Prime Vendors & Co',
    contact: '+91 9876543213',
    email: 'orders@primevendors.com',
    address: '234 Linking Road, Bandra West',
    pincode: '400050',
    city: 'Mumbai',
    state: 'Maharashtra',
    gst: '27DDDPL3456F4W6',
    vendorType: ['Purchase Vendor'],
    status: 'active',
    lastOrderDate: '2025-12-15',
    totalOrders: 38,
    avatar: 'PV',
    avatarColor: '#28a745'
  },
  {
    id: 5,
    vendorName: 'Vikram Singh',
    companyName: 'Elite Supply Chain',
    contact: '+91 9876543214',
    email: 'contact@elitesupply.com',
    address: '56 Connaught Place, Central Delhi',
    pincode: '110001',
    city: 'Delhi',
    state: 'Delhi',
    gst: '07EEEPL7890G5V5',
    vendorType: ['Scrap Disposal Partner'],
    status: 'inactive',
    lastOrderDate: '2025-11-30',
    totalOrders: 15,
    avatar: 'ES',
    avatarColor: '#e83e8c'
  },
  {
    id: 6,
    vendorName: 'Meera Reddy',
    companyName: 'Metro Industrial Supplies',
    contact: '+91 9876543215',
    email: 'sales@metrosupplies.com',
    address: '89 FC Road, Shivaji Nagar',
    pincode: '411004',
    city: 'Pune',
    state: 'Maharashtra',
    gst: '27FFFPL2468H6U4',
    vendorType: ['Purchase Vendor'],
    status: 'active',
    lastOrderDate: '2025-12-21',
    totalOrders: 41,
    avatar: 'MI',
    avatarColor: '#fd7e14'
  },
  {
    id: 7,
    vendorName: 'Karthik Iyer',
    companyName: 'Universal Parts & Equipment',
    contact: '+91 9876543216',
    email: 'info@universalparts.com',
    address: '45 HITEC City, Madhapur',
    pincode: '500081',
    city: 'Hyderabad',
    state: 'Telangana',
    gst: '36GGGPL1357I7T3',
    vendorType: ['Maintenance Partner', 'Scrap Disposal Partner'],
    status: 'active',
    lastOrderDate: '2025-12-19',
    totalOrders: 25,
    avatar: 'UP',
    avatarColor: '#a8dadc'
  },
  {
    id: 8,
    vendorName: 'Neha Gupta',
    companyName: 'Reliable Hardware Solutions',
    contact: '+91 9876543217',
    email: 'orders@reliablehardware.com',
    address: '123 CG Road, Navrangpura',
    pincode: '380009',
    city: 'Ahmedabad',
    state: 'Gujarat',
    gst: '24HHHPL8024J8S2',
    vendorType: ['Scrap Disposal Partner'],
    status: 'active',
    lastOrderDate: '2025-12-23',
    totalOrders: 52,
    avatar: 'RH',
    avatarColor: '#6f42c1'
  }
];

// ==========================================================================
// DUMMY STATISTICS DATA (Simulating API Response)
// ==========================================================================
// This simulates what would come from your backend API
// In production, this would be fetched from: GET /api/vendor-statistics

export const DUMMY_STATISTICS_DATA = {
  // Total vendors count
  totalVendors: {
    count: 8,
    change: '+2',
    changeType: 'positive',
    changeLabel: 'This Month',
    previousMonth: 6
  },
  
  // Active vendors statistics
  activeVendors: {
    count: 7,
    percentage: '87.5',
    changeType: 'positive',
    changeLabel: 'Active Rate'
  },
  
  // Inactive vendors statistics
  inactiveVendors: {
    count: 1,
    percentage: '12.5',
    changeType: 'negative',
    changeLabel: 'Inactive Rate'
  },
  
  // Vendor type distribution
  vendorTypeDistribution: {
    purchaseVendor: 5,
    maintenancePartner: 3,
    scrapDisposalPartner: 3
  },
  
  // Additional metrics (for future use)
  additionalMetrics: {
    totalOrders: 276,
    recentlyActive: 7,
    averageOrdersPerVendor: 34.5,
    topPerformingVendor: 'Reliable Hardware Solutions',
    monthlyGrowthRate: '+25%'
  },
  
  // Monthly comparison data
  monthlyComparison: {
    currentMonth: {
      vendors: 8,
      orders: 276,
      revenue: 1250000
    },
    previousMonth: {
      vendors: 6,
      orders: 198,
      revenue: 980000
    }
  },
  
  // Last updated timestamp (ISO format)
  lastUpdated: '2026-01-28T10:30:00Z',
  
  // API metadata
  metadata: {
    dataSource: 'vendor_management_db',
    calculatedAt: new Date().toISOString(),
    version: '1.0'
  }
};

// ==========================================================================
// UTILITY FUNCTIONS FOR VENDOR STATISTICS
// ==========================================================================

/**
 * Calculate comprehensive vendor statistics from vendor data
 * This function can work with either:
 * 1. Real-time calculation from vendor array (for dynamic updates)
 * 2. Pre-calculated data from API (DUMMY_STATISTICS_DATA)
 * 
 * @param {Array} vendors - Array of vendor objects
 * @param {Object} apiStats - Optional pre-calculated stats from API (DUMMY_STATISTICS_DATA)
 * @returns {Object} Statistics object with various metrics
 */
export const calculateVendorStats = (vendors, apiStats = null) => {
  // If API stats are provided, use them (simulating real API behavior)
  if (apiStats) {
    return {
      total: apiStats.totalVendors.count,
      active: apiStats.activeVendors.count,
      inactive: apiStats.inactiveVendors.count,
      activeRate: apiStats.activeVendors.percentage,
      inactiveRate: apiStats.inactiveVendors.percentage,
      monthlyChange: apiStats.totalVendors.change,
      monthlyChangeType: apiStats.totalVendors.changeType,
      vendorTypeDistribution: apiStats.vendorTypeDistribution,
      recentlyActive: apiStats.additionalMetrics.recentlyActive,
      totalOrders: apiStats.additionalMetrics.totalOrders,
      lastUpdated: apiStats.lastUpdated,
      metadata: apiStats.metadata
    };
  }
  
  // Otherwise, calculate from vendor array (fallback/real-time calculation)
  const total = vendors.length;
  const activeVendors = vendors.filter(v => v.status === 'active');
  const inactiveVendors = vendors.filter(v => v.status === 'inactive');
  
  const activeCount = activeVendors.length;
  const inactiveCount = inactiveVendors.length;
  
  // Calculate percentages
  const activeRate = total > 0 ? ((activeCount / total) * 100).toFixed(1) : '0.0';
  const inactiveRate = total > 0 ? ((inactiveCount / total) * 100).toFixed(1) : '0.0';
  
  // Calculate vendor type distribution
  const vendorTypeDistribution = {
    purchaseVendor: 0,
    maintenancePartner: 0,
    scrapDisposalPartner: 0
  };
  
  vendors.forEach(vendor => {
    const types = Array.isArray(vendor.vendorType) ? vendor.vendorType : [vendor.vendorType];
    if (types.includes('Purchase Vendor')) vendorTypeDistribution.purchaseVendor++;
    if (types.includes('Maintenance Partner')) vendorTypeDistribution.maintenancePartner++;
    if (types.includes('Scrap Disposal Partner')) vendorTypeDistribution.scrapDisposalPartner++;
  });
  
  // Calculate recent activity (vendors with orders in last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const recentlyActive = vendors.filter(vendor => {
    if (!vendor.lastOrderDate) return false;
    const orderDate = new Date(vendor.lastOrderDate);
    return orderDate >= thirtyDaysAgo;
  }).length;
  
  // Calculate total orders across all vendors
  const totalOrders = vendors.reduce((sum, vendor) => sum + (vendor.totalOrders || 0), 0);
  
  return {
    total,
    active: activeCount,
    inactive: inactiveCount,
    activeRate,
    inactiveRate,
    vendorTypeDistribution,
    recentlyActive,
    totalOrders,
    monthlyChange: '+2',
    monthlyChangeType: 'positive'
  };
};

/**
 * Get filtered vendors based on search and filter criteria
 * @param {Array} vendors - Array of vendor objects
 * @param {Object} filters - Filter criteria
 * @returns {Array} Filtered vendors
 */
export const getFilteredVendors = (vendors, filters = {}) => {
  const { searchValue = '', filterStatus = '', filterType = '' } = filters;
  
  return vendors.filter(vendor => {
    // Search filter
    const matchesSearch = !searchValue || (
      vendor.vendorName.toLowerCase().includes(searchValue.toLowerCase()) ||
      (vendor.companyName && vendor.companyName.toLowerCase().includes(searchValue.toLowerCase())) ||
      vendor.email.toLowerCase().includes(searchValue.toLowerCase()) ||
      vendor.contact.includes(searchValue) ||
      vendor.city.toLowerCase().includes(searchValue.toLowerCase()) ||
      vendor.state.toLowerCase().includes(searchValue.toLowerCase())
    );
    
    // Status filter
    const matchesStatus = !filterStatus || vendor.status === filterStatus;
    
    // Type filter
    const vendorTypes = Array.isArray(vendor.vendorType) ? vendor.vendorType : [vendor.vendorType];
    const matchesType = !filterType || vendorTypes.includes(filterType);
    
    return matchesSearch && matchesStatus && matchesType;
  });
};

/**
 * Validate vendor data before saving
 * @param {Object} vendorData - Vendor data to validate
 * @returns {Object} Validation result with isValid and errors
 */
export const validateVendorData = (vendorData) => {
  const errors = [];
  
  // Required field validations
  if (!vendorData.vendorName || vendorData.vendorName.trim().length < 3) {
    errors.push('Vendor name must be at least 3 characters long');
  }
  
  if (!vendorData.companyName || vendorData.companyName.trim().length < 3) {
    errors.push('Company name must be at least 3 characters long');
  }
  
  // Contact validation
  if (!vendorData.contact || vendorData.contact.length !== 10) {
    errors.push('Contact number must be 10 digits');
  } else if (!['6', '7', '8', '9'].includes(vendorData.contact.charAt(0))) {
    errors.push('Contact number must start with 6, 7, 8 or 9');
  }
  
  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.(com|in|org|net|co\.in)$/i;
  if (!vendorData.email || !emailRegex.test(vendorData.email)) {
    errors.push('Invalid email format');
  }
  
  // Address validation
  if (!vendorData.address || vendorData.address.trim().length < 10) {
    errors.push('Address must be at least 10 characters long');
  }
  
  // Pincode validation
  if (!vendorData.pincode || vendorData.pincode.length !== 6 || vendorData.pincode.charAt(0) === '0') {
    errors.push('Invalid pincode format');
  }
  
  // City and State validation
  if (!vendorData.city || vendorData.city.trim().length < 2) {
    errors.push('City name must be at least 2 characters long');
  }
  
  if (!vendorData.state || vendorData.state.trim().length < 2) {
    errors.push('State name must be at least 2 characters long');
  }
  
  // GST validation (optional but must be valid if provided)
  if (vendorData.gst && vendorData.gst.trim().length > 0) {
    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    if (!gstRegex.test(vendorData.gst)) {
      errors.push('Invalid GST format. Example: 33AAAPL1234C1Z9');
    }
  }
  
  // Vendor type validation
  if (!vendorData.vendorTypes || vendorData.vendorTypes.length === 0) {
    errors.push('At least one vendor type must be selected');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Generate avatar initials and color for new vendor
 * @param {String} companyName - Company name
 * @returns {Object} Avatar data with initials and color
 */
export const generateVendorAvatar = (companyName) => {
  const colors = [
    '#17a2b8', '#fd7e14', '#20c997', '#28a745', 
    '#e83e8c', '#6f42c1', '#a8dadc', '#457b9d'
  ];
  
  const initials = companyName
    .split(' ')
    .map(word => word[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();
  
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  
  return {
    avatar: initials,
    avatarColor: randomColor
  };
};

// ==========================================================================
// CONSTANTS FOR VENDOR TYPES
// ==========================================================================

export const VENDOR_TYPES = {
  PURCHASE: 'Purchase Vendor',
  MAINTENANCE: 'Maintenance Partner',
  SCRAP: 'Scrap Disposal Partner'
};

export const VENDOR_TYPE_OPTIONS = [
  { value: VENDOR_TYPES.PURCHASE, label: 'Purchase Vendor', icon: 'fa-shopping-cart' },
  { value: VENDOR_TYPES.MAINTENANCE, label: 'Maintenance Partner', icon: 'fa-tools' },
  { value: VENDOR_TYPES.SCRAP, label: 'Scrap Disposal Partner', icon: 'fa-recycle' }
];

export const VENDOR_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive'
};