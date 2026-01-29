// src/data/PurchaseData.jsx

const PurchaseData = {

  // ==================== SAMPLE DATA ====================

  vendors: [
    { 
      id: 'V001', 
      vendorName: 'Tech Supplies India', 
      contactPerson: 'Rajesh Kumar', 
      phone: '+91-9876543210', 
      email: 'rajesh@techsupplies.in', 
      address: 'Mumbai, Maharashtra',
      suppliesProducts: ['P001', 'P002', 'P003', 'P005', 'P006'] // Laptops, Mouse, Cables, Monitors, Keyboards
    },
    { 
      id: 'V002', 
      vendorName: 'Elite Electronics', 
      contactPerson: 'Priya Sharma', 
      phone: '+91-9876543211', 
      email: 'priya@elite.in', 
      address: 'Bangalore, Karnataka',
      suppliesProducts: ['P001', 'P004', 'P005', 'P007'] // Laptops, Hard Drives, Monitors, Webcams
    },
    { 
      id: 'V003', 
      vendorName: 'Global Components Ltd', 
      contactPerson: 'Amit Patel', 
      phone: '+91-9876543212', 
      email: 'amit@global.in', 
      address: 'Pune, Maharashtra',
      suppliesProducts: ['P002', 'P003', 'P004', 'P006', 'P008'] // Mouse, Cables, Hard Drives, Keyboards, Headsets
    },
    { 
      id: 'V004', 
      vendorName: 'Smart Accessories', 
      contactPerson: 'Neha Singh', 
      phone: '+91-9876543213', 
      email: 'neha@smart.in', 
      address: 'Delhi, NCR',
      suppliesProducts: ['P002', 'P003', 'P006', 'P007', 'P008'] // Mouse, Cables, Keyboards, Webcams, Headsets
    }
  ],

  products: [
    { id: 'P001', productName: 'Laptop Dell Inspiron 15', category: 'Electronics', unitPrice: 45000, stock: 25 },
    { id: 'P002', productName: 'Wireless Mouse Logitech', category: 'Accessories', unitPrice: 800, stock: 150 },
    { id: 'P003', productName: 'USB Type-C Cable', category: 'Cables', unitPrice: 250, stock: 200 },
    { id: 'P004', productName: 'External Hard Drive 1TB', category: 'Storage', unitPrice: 3500, stock: 50 },
    { id: 'P005', productName: 'LED Monitor 24 inch', category: 'Displays', unitPrice: 12000, stock: 30 },
    { id: 'P006', productName: 'Keyboard Mechanical RGB', category: 'Accessories', unitPrice: 2500, stock: 75 },
    { id: 'P007', productName: 'Webcam HD 1080p', category: 'Peripherals', unitPrice: 2800, stock: 40 },
    { id: 'P008', productName: 'Headset with Microphone', category: 'Audio', unitPrice: 1500, stock: 100 }
  ],

  purchaseOrders: [
    {
      id: 'PO-1001',
      poNumber: 'PO-1001',
      vendorId: 'V001',
      vendorName: 'Tech Supplies India',
      purchaseDate: '2026-01-15',
      expectedDeliveryDate: '2026-01-25',
      products: [
        { 
          productId: 'P001', 
          productName: 'Laptop Dell Inspiron 15', 
          orderedQty: 10, 
          unitPrice: 45000,
          selectedVendors: ['V001', 'V002'] // Multiple vendors selected
        },
        { 
          productId: 'P002', 
          productName: 'Wireless Mouse Logitech', 
          orderedQty: 20, 
          unitPrice: 800,
          selectedVendors: ['V001', 'V003']
        }
      ],
      purchasePrice: 466000,
      status: 'completed',
      grnNumber: 'GRN-2001',
      remarks: 'Urgent requirement for new project',
      createdAt: '2026-01-15T10:00:00Z'
    },
    {
      id: 'PO-1002',
      poNumber: 'PO-1002',
      vendorId: 'V002',
      vendorName: 'Elite Electronics',
      purchaseDate: '2026-01-20',
      expectedDeliveryDate: '2026-02-05',
      products: [
        { 
          productId: 'P005', 
          productName: 'LED Monitor 24 inch', 
          orderedQty: 15, 
          unitPrice: 12000,
          selectedVendors: ['V001', 'V002']
        }
      ],
      purchasePrice: 180000,
      status: 'pending',
      grnNumber: null,
      remarks: 'Monitor replacement for office',
      createdAt: '2026-01-20T14:30:00Z'
    },
    {
      id: 'PO-1003',
      poNumber: 'PO-1003',
      vendorId: 'V003',
      vendorName: 'Global Components Ltd',
      purchaseDate: '2026-01-22',
      expectedDeliveryDate: '2026-02-10',
      products: [
        { 
          productId: 'P004', 
          productName: 'External Hard Drive 1TB', 
          orderedQty: 25, 
          unitPrice: 3500,
          selectedVendors: ['V002', 'V003']
        },
        { 
          productId: 'P006', 
          productName: 'Keyboard Mechanical RGB', 
          orderedQty: 30, 
          unitPrice: 2500,
          selectedVendors: ['V001', 'V003', 'V004']
        }
      ],
      purchasePrice: 162500,
      status: 'pending',
      grnNumber: null,
      remarks: 'Bulk order for Q1',
      createdAt: '2026-01-22T09:15:00Z'
    }
  ],

  grnRecords: [
    {
      id: 'GRN-2001',
      grnNumber: 'GRN-2001',
      poNumber: 'PO-1001',
      poId: 'PO-1001',
      vendorId: 'V001',
      vendorName: 'Tech Supplies India',
      receivedDate: '2026-01-24',
      products: [
        { productId: 'P001', productName: 'Laptop Dell Inspiron 15', orderedQty: 10, receivedQty: 10, status: 'received', remarks: 'All items in good condition' },
        { productId: 'P002', productName: 'Wireless Mouse Logitech', orderedQty: 20, receivedQty: 20, status: 'received', remarks: 'Perfect condition' }
      ],
      vehicleNumber: 'MH-01-AB-1234',
      transportName: 'Blue Dart Express',
      lrNumber: 'BD123456789',
      remarks: 'Delivered on time',
      createdAt: '2026-01-24T16:45:00Z'
    }
  ],

  autoGeneratedPOs: [
    {
      id: 'DRAFT-001',
      productId: 'P002',
      productName: 'Wireless Mouse Logitech',
      vendorId: 'V001',
      vendorName: 'Tech Supplies India',
      suggestedQuantity: 50,
      unitPrice: 800,
      reason: 'Stock below minimum threshold (Current: 15, Min: 50)',
      generatedDate: '2026-01-28'
    },
    {
      id: 'DRAFT-002',
      productId: 'P007',
      productName: 'Webcam HD 1080p',
      vendorId: 'V002',
      vendorName: 'Elite Electronics',
      suggestedQuantity: 30,
      unitPrice: 2800,
      reason: 'High demand in last 7 days',
      generatedDate: '2026-01-28'
    }
  ],

  poRatings: {
    'PO-1001': {
      quality: 5,
      delivery: 4,
      price: 4,
      comments: 'Excellent quality products, delivered almost on time'
    }
  },

  rescheduleHistory: {
    'PO-1002': [
      {
        oldDate: '2026-01-30',
        newDate: '2026-02-05',
        reason: 'Vendor requested extension due to supply chain issues',
        remarks: 'Agreed to new date',
        rescheduledAt: '2026-01-25T11:30:00Z'
      }
    ]
  },

  // ==================== GETTER METHODS ====================

  getVendors() {
    return this.vendors;
  },

  getProducts() {
    return this.products;
  },

  getPurchaseOrders() {
    return this.purchaseOrders;
  },

  getGRNRecords() {
    return this.grnRecords;
  },

  getAutoGeneratedPOs() {
    return this.autoGeneratedPOs;
  },

  getPoRatings() {
    return this.poRatings;
  },

  getRescheduleHistory() {
    return this.rescheduleHistory;
  },

  // ==================== SEARCH & FILTER ====================

  searchProducts(term) {
    const searchTerm = term.toLowerCase();
    return this.products.filter(p => 
      p.id.toLowerCase().includes(searchTerm) ||
      p.productName.toLowerCase().includes(searchTerm) ||
      p.category.toLowerCase().includes(searchTerm)
    );
  },

  searchVendors(term) {
    const searchTerm = term.toLowerCase();
    return this.vendors.filter(v =>
      v.id.toLowerCase().includes(searchTerm) ||
      v.vendorName.toLowerCase().includes(searchTerm) ||
      v.contactPerson.toLowerCase().includes(searchTerm)
    );
  },

  // Get vendors who supply a specific product
  getVendorsForProduct(productId) {
    return this.vendors.filter(v => 
      v.suppliesProducts && v.suppliesProducts.includes(productId)
    );
  },

  // Get products supplied by a specific vendor
  getProductsForVendor(vendorId) {
    const vendor = this.vendors.find(v => v.id === vendorId);
    if (!vendor || !vendor.suppliesProducts) return [];

    return this.products.filter(p => 
      vendor.suppliesProducts.includes(p.id)
    );
  },

  // ==================== STATISTICS ====================

  calculateStatistics() {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Total POs
    const totalPOs = this.purchaseOrders.length;

    // This month POs
    const thisMonthPOs = this.purchaseOrders.filter(po => {
      const poDate = new Date(po.purchaseDate);
      return poDate.getMonth() === currentMonth && poDate.getFullYear() === currentYear;
    }).length;

    // Pending approvals
    const pendingApprovals = this.purchaseOrders.filter(po => po.status === 'pending').length;

    // Total GRNs
    const totalGRNs = this.grnRecords.length;

    // This month GRNs
    const thisMonthGRNs = this.grnRecords.filter(grn => {
      const grnDate = new Date(grn.receivedDate);
      return grnDate.getMonth() === currentMonth && grnDate.getFullYear() === currentYear;
    }).length;

    // Draft orders
    const draftOrders = this.autoGeneratedPOs.length;

    // Total purchase value
    const totalPurchaseValue = this.purchaseOrders.reduce((sum, po) => sum + po.purchasePrice, 0);

    // This month purchase value
    const thisMonthValue = this.purchaseOrders
      .filter(po => {
        const poDate = new Date(po.purchaseDate);
        return poDate.getMonth() === currentMonth && poDate.getFullYear() === currentYear;
      })
      .reduce((sum, po) => sum + po.purchasePrice, 0);

    return {
      totalPOs,
      thisMonthPOs,
      pendingApprovals,
      totalGRNs,
      thisMonthGRNs,
      draftOrders,
      totalPurchaseValue,
      thisMonthValue
    };
  },

  // ==================== HELPER FUNCTIONS ====================

  formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  },

  formatCurrency(amount) {
    return `₹${amount.toLocaleString('en-IN')}`;
  },

  formatDateTime(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  },

  // ==================== VALIDATION ====================

  validatePOForm(poForm, productRows) {
    const errors = [];

    if (!poForm.expectedDeliveryDate) {
      errors.push('Please select expected delivery date');
    }

    const validProducts = productRows.filter(row => row.productId && row.quantity > 0);
    if (validProducts.length === 0) {
      errors.push('Please add at least one product with quantity');
    }

    productRows.forEach((row, index) => {
      if (row.productId && row.quantity <= 0) {
        errors.push(`Product in row ${index + 1} must have quantity greater than 0`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  validateGRNForm(grnForm) {
    const errors = [];

    if (!grnForm.vehicleNumber) {
      errors.push('Vehicle number is required');
    }

    if (!grnForm.lrNumber) {
      errors.push('LR number is required');
    }

    if (!grnForm.receivedDate) {
      errors.push('Received date is required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  validateReturnForm(returnForm) {
    const errors = [];

    if (!returnForm.returnType) {
      errors.push('Please select return type');
    }

    if (!returnForm.reason) {
      errors.push('Please select reason for return');
    }

    const selectedProducts = returnForm.products.filter(p => p.selected && p.returnQty > 0);
    if (selectedProducts.length === 0) {
      errors.push('Please select at least one product to return');
    }

    if (!returnForm.remarks) {
      errors.push('Please provide detailed remarks');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  validateRating(rating) {
    const errors = [];

    if (rating.quality === 0) {
      errors.push('Please rate product quality');
    }

    if (rating.delivery === 0) {
      errors.push('Please rate delivery time');
    }

    if (rating.price === 0) {
      errors.push('Please rate price/value');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

};

export default PurchaseData;