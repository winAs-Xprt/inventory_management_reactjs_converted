// src/data/VendorData.jsx
// ==========================================================================
// VENDOR DATA MODULE - All vendor data exported for use in Vendor.jsx
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
    avatarColor: '#17a2b8',
    whatsappSameAsPhone: true,
    whatsappNumber: '9876543210'
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
    avatarColor: '#fd7e14',
    whatsappSameAsPhone: true,
    whatsappNumber: '9876543211'
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
    avatarColor: '#20c997',
    whatsappSameAsPhone: true,
    whatsappNumber: '9876543212'
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
    avatarColor: '#28a745',
    whatsappSameAsPhone: true,
    whatsappNumber: '9876543213'
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
    avatarColor: '#e83e8c',
    whatsappSameAsPhone: true,
    whatsappNumber: '9876543214'
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
    avatarColor: '#fd7e14',
    whatsappSameAsPhone: true,
    whatsappNumber: '9876543215'
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
    avatarColor: '#a8dadc',
    whatsappSameAsPhone: false,
    whatsappNumber: '9876543299'
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
    avatarColor: '#6f42c1',
    whatsappSameAsPhone: true,
    whatsappNumber: '9876543217'
  }
];

// ==========================================================================
// DUMMY STATISTICS DATA
// ==========================================================================
export const DUMMY_STATISTICS_DATA = {
  totalVendors: {
    count: 8,
    change: '+2',
    changeType: 'positive',
    changeLabel: 'This Month',
    previousMonth: 6
  },
  activeVendors: {
    count: 7,
    percentage: '87.5',
    changeType: 'positive',
    changeLabel: 'Active Rate'
  },
  inactiveVendors: {
    count: 1,
    percentage: '12.5',
    changeType: 'negative',
    changeLabel: 'Inactive Rate'
  },
  vendorTypeDistribution: {
    purchaseVendor: 5,
    maintenancePartner: 3,
    scrapDisposalPartner: 3
  },
  additionalMetrics: {
    totalOrders: 276,
    recentlyActive: 7,
    averageOrdersPerVendor: 34.5,
    topPerformingVendor: 'Reliable Hardware Solutions',
    monthlyGrowthRate: '+25%'
  },
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
  lastUpdated: '2026-01-28T10:30:00Z',
  metadata: {
    dataSource: 'vendor_management_db',
    calculatedAt: new Date().toISOString(),
    version: '1.0'
  }
};

// ==========================================================================
// UTILITY FUNCTIONS
// ==========================================================================

/**
 * Calculate vendor statistics from vendor data
 * @param {Array} vendors - Array of vendor objects
 * @param {Object} apiStats - Optional API statistics data
 * @returns {Object} Calculated statistics
 */
export const calculateVendorStats = (vendors, apiStats = null) => {
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
  
  const total = vendors.length;
  const activeVendors = vendors.filter(v => v.status === 'active');
  const inactiveVendors = vendors.filter(v => v.status === 'inactive');
  
  const activeCount = activeVendors.length;
  const inactiveCount = inactiveVendors.length;
  
  const activeRate = total > 0 ? ((activeCount / total) * 100).toFixed(1) : '0.0';
  const inactiveRate = total > 0 ? ((inactiveCount / total) * 100).toFixed(1) : '0.0';
  
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
  
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const recentlyActive = vendors.filter(vendor => {
    if (!vendor.lastOrderDate) return false;
    const orderDate = new Date(vendor.lastOrderDate);
    return orderDate >= thirtyDaysAgo;
  }).length;
  
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
 * Filter vendors based on search and filter criteria
 * @param {Array} vendors - Array of vendor objects
 * @param {Object} filters - Filter criteria
 * @returns {Array} Filtered vendors
 */
export const getFilteredVendors = (vendors, filters = {}) => {
  const { searchValue = '', filterStatus = '', filterType = '' } = filters;
  
  return vendors.filter(vendor => {
    const matchesSearch = !searchValue || (
      vendor.vendorName.toLowerCase().includes(searchValue.toLowerCase()) ||
      (vendor.companyName && vendor.companyName.toLowerCase().includes(searchValue.toLowerCase())) ||
      vendor.email.toLowerCase().includes(searchValue.toLowerCase()) ||
      vendor.contact.includes(searchValue) ||
      vendor.city.toLowerCase().includes(searchValue.toLowerCase()) ||
      vendor.state.toLowerCase().includes(searchValue.toLowerCase())
    );
    
    const matchesStatus = !filterStatus || vendor.status === filterStatus;
    
    const vendorTypes = Array.isArray(vendor.vendorType) ? vendor.vendorType : [vendor.vendorType];
    const matchesType = !filterType || vendorTypes.includes(filterType);
    
    return matchesSearch && matchesStatus && matchesType;
  });
};

/**
 * Validate vendor form data
 * @param {Object} vendorData - Vendor form data
 * @returns {Object} Validation result with errors array
 */
export const validateVendorData = (vendorData) => {
  const errors = [];
  
  if (!vendorData.vendorName || vendorData.vendorName.trim().length < 3) {
    errors.push('Vendor name must be at least 3 characters long');
  }
  
  if (!vendorData.companyName || vendorData.companyName.trim().length < 3) {
    errors.push('Company name must be at least 3 characters long');
  }
  
  if (vendorData.contact && vendorData.contact.length > 0) {
    const cleanContact = vendorData.contact.replace('+91 ', '').replace(/\s/g, '');
    if (cleanContact.length !== 10) {
      errors.push('Contact number must be 10 digits');
    } else if (!['6', '7', '8', '9'].includes(cleanContact.charAt(0))) {
      errors.push('Contact number must start with 6, 7, 8 or 9');
    }
  }
  
  if (vendorData.email && vendorData.email.trim().length > 0) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.(com|in|org|net|co\.in)$/i;
    if (!emailRegex.test(vendorData.email)) {
      errors.push('Invalid email format');
    }
  }
  
  if (vendorData.address && vendorData.address.trim().length > 0 && vendorData.address.trim().length < 10) {
    errors.push('Address must be at least 10 characters long');
  }
  
  if (vendorData.pincode && vendorData.pincode.length > 0) {
    if (vendorData.pincode.length !== 6 || vendorData.pincode.charAt(0) === '0') {
      errors.push('Invalid pincode format');
    }
  }
  
  if (vendorData.city && vendorData.city.trim().length > 0 && vendorData.city.trim().length < 2) {
    errors.push('City name must be at least 2 characters long');
  }
  
  if (vendorData.state && vendorData.state.trim().length > 0 && vendorData.state.trim().length < 2) {
    errors.push('State name must be at least 2 characters long');
  }
  
  if (vendorData.gst && vendorData.gst.trim().length > 0) {
    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    if (!gstRegex.test(vendorData.gst)) {
      errors.push('Invalid GST format. Example: 33AAAPL1234C1Z9');
    }
  }
  
  if (!vendorData.vendorTypes || vendorData.vendorTypes.length === 0) {
    errors.push('At least one vendor type must be selected');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Generate avatar initials and color for vendor
 * @param {String} companyName - Company name
 * @returns {Object} Avatar data with initials and color
 */
export const generateVendorAvatar = (companyName) => {
  const colors = [
    '#17a2b8', '#fd7e14', '#20c997', '#28a745', 
    '#e83e8c', '#6f42c1', '#a8dadc', '#457b9d',
    '#f77f00', '#06d6a0', '#118ab2', '#ef476f'
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

/**
 * Format phone number to display format
 * @param {String} phone - Phone number
 * @returns {String} Formatted phone number
 */
export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `+91 ${cleaned}`;
  }
  return phone;
};

/**
 * Format date to readable format
 * @param {String} dateString - ISO date string
 * @returns {String} Formatted date
 */
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

/**
 * Calculate days since last order
 * @param {String} lastOrderDate - Last order date
 * @returns {Number} Days since last order
 */
export const daysSinceLastOrder = (lastOrderDate) => {
  if (!lastOrderDate) return null;
  const lastOrder = new Date(lastOrderDate);
  const today = new Date();
  const diffTime = Math.abs(today - lastOrder);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// ==========================================================================
// CONSTANTS
// ==========================================================================

export const VENDOR_TYPES = {
  PURCHASE: 'Purchase Vendor',
  MAINTENANCE: 'Maintenance Partner',
  SCRAP: 'Scrap Disposal Partner'
};

export const VENDOR_TYPE_OPTIONS = [
  { 
    value: VENDOR_TYPES.PURCHASE, 
    label: 'Purchase Vendor', 
    icon: 'fa-shopping-cart',
    color: '#17a2b8' 
  },
  { 
    value: VENDOR_TYPES.MAINTENANCE, 
    label: 'Maintenance Partner', 
    icon: 'fa-tools',
    color: '#fd7e14' 
  },
  { 
    value: VENDOR_TYPES.SCRAP, 
    label: 'Scrap Disposal Partner', 
    icon: 'fa-recycle',
    color: '#6f42c1' 
  }
];

export const VENDOR_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive'
};

export const VENDOR_STATUS_OPTIONS = [
  { 
    value: VENDOR_STATUS.ACTIVE, 
    label: 'Active', 
    color: '#28a745',
    icon: 'fa-check-circle' 
  },
  { 
    value: VENDOR_STATUS.INACTIVE, 
    label: 'Inactive', 
    color: '#dc3545',
    icon: 'fa-ban' 
  }
];

// ==========================================================================
// INDIAN STATES AND UNION TERRITORIES
// ==========================================================================
export const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Andaman and Nicobar Islands',
  'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Jammu and Kashmir',
  'Ladakh',
  'Lakshadweep',
  'Puducherry'
];

// ==========================================================================
// EXPORT FORMATS
// ==========================================================================
export const EXPORT_FORMATS = {
  CSV: 'csv',
  EXCEL: 'excel',
  PDF: 'pdf',
  JSON: 'json'
};

// ==========================================================================
// SORT OPTIONS
// ==========================================================================
export const SORT_OPTIONS = [
  { value: 'name_asc', label: 'Name (A-Z)', field: 'companyName', order: 'asc' },
  { value: 'name_desc', label: 'Name (Z-A)', field: 'companyName', order: 'desc' },
  { value: 'orders_desc', label: 'Orders (High to Low)', field: 'totalOrders', order: 'desc' },
  { value: 'orders_asc', label: 'Orders (Low to High)', field: 'totalOrders', order: 'asc' },
  { value: 'date_desc', label: 'Recent Orders First', field: 'lastOrderDate', order: 'desc' },
  { value: 'date_asc', label: 'Oldest Orders First', field: 'lastOrderDate', order: 'asc' }
];

// ==========================================================================
// DEFAULT VALUES
// ==========================================================================
export const DEFAULT_VENDOR = {
  vendorName: '',
  companyName: '',
  contact: '',
  whatsappSameAsPhone: true,
  whatsappNumber: '',
  email: '',
  address: '',
  pincode: '',
  city: '',
  state: '',
  gst: '',
  status: VENDOR_STATUS.ACTIVE,
  vendorType: [],
  totalOrders: 0,
  lastOrderDate: new Date().toISOString().split('T')[0]
};

export const PAGINATION_OPTIONS = [5, 10, 20, 50, 100];

export const DEFAULT_ITEMS_PER_PAGE = 10;
