// src/data/DashboardData.jsx
import { useState } from 'react';

export const useDashboardData = () => {
  
  // ========================================================================
  // PENDING REQUESTS DATA (21 items for pagination demo)
  // ========================================================================
  const [pendingRequests, setPendingRequests] = useState([
    {
      id: '#21',
      employee: 'admin',
      department: 'Operations',
      items: '"0" RING',
      quantity: '3 NO',
      status: 'approved',
      date: '10/13/2025',
      requestedBy: 'John Admin',
      priority: 'high',
      notes: 'Required for machinery maintenance'
    },
    {
      id: '#20',
      employee: 'CBM',
      department: 'Production',
      items: '"0" RING, "V" BELT',
      quantity: '7 NO',
      status: 'approved',
      date: '10/13/2025',
      requestedBy: 'Sarah CBM',
      priority: 'medium',
      notes: 'Production line components'
    },
    {
      id: '#19',
      employee: 'admin',
      department: 'Maintenance',
      items: '"0" RING',
      quantity: '5 NO',
      status: 'pending',
      date: '10/13/2025',
      requestedBy: 'Mike Admin',
      priority: 'high',
      notes: 'Urgent replacement needed'
    },
    {
      id: '#18',
      employee: 'CBM',
      department: 'Quality',
      items: '"0" RING',
      quantity: '1 NO',
      status: 'pending',
      date: '10/13/2025',
      requestedBy: 'Emily CBM',
      priority: 'low',
      notes: 'Testing equipment spare'
    },
    {
      id: '#17',
      employee: 'admin',
      department: 'Operations',
      items: '"0" RING',
      quantity: '1 NO',
      status: 'pending',
      date: '10/13/2025',
      requestedBy: 'Robert Admin',
      priority: 'medium',
      notes: 'Regular maintenance stock'
    },
    {
      id: '#16',
      employee: 'admin',
      department: 'Warehouse',
      items: '"0" RING',
      quantity: '1 NO',
      status: 'pending',
      date: '10/13/2025',
      requestedBy: 'Lisa Admin',
      priority: 'low',
      notes: 'Stock replenishment'
    },
    {
      id: '#15',
      employee: 'admin',
      department: 'Production',
      items: '"V" BELT',
      quantity: '5 NO',
      status: 'delivered',
      date: '9/26/2025',
      requestedBy: 'David Admin',
      priority: 'high',
      notes: 'Production equipment'
    },
    {
      id: '#14',
      employee: 'admin',
      department: 'Office',
      items: 'A4 sheet 2 box',
      quantity: '6 ton',
      status: 'delivered',
      date: '9/20/2025',
      requestedBy: 'Anna Admin',
      priority: 'low',
      notes: 'Office supplies'
    },
    {
      id: '#13',
      employee: 'CBM',
      department: 'Safety',
      items: 'Safety Equipment, Tools',
      quantity: '45 units',
      status: 'pending',
      date: '9/15/2025',
      requestedBy: 'Tom CBM',
      priority: 'critical',
      notes: 'New safety standards compliance'
    },
    {
      id: '#12',
      employee: 'admin',
      department: 'Maintenance',
      items: 'Spare Parts, Consumables',
      quantity: '30 units',
      status: 'approved',
      date: '9/10/2025',
      requestedBy: 'Jerry Admin',
      priority: 'medium',
      notes: 'Monthly maintenance'
    },
    {
      id: '#11',
      employee: 'CBM',
      department: 'Logistics',
      items: 'Packaging Materials',
      quantity: '120 units',
      status: 'pending',
      date: '9/05/2025',
      requestedBy: 'Kate CBM',
      priority: 'high',
      notes: 'Shipping requirements'
    },
    {
      id: '#10',
      employee: 'admin',
      department: 'Quality',
      items: 'Testing Equipment',
      quantity: '15 units',
      status: 'delivered',
      date: '8/28/2025',
      requestedBy: 'Mark Admin',
      priority: 'high',
      notes: 'Quality assurance tools'
    },
    {
      id: '#9',
      employee: 'CBM',
      department: 'Construction',
      items: 'Cement, Steel Rods',
      quantity: '150 bags',
      status: 'approved',
      date: '8/20/2025',
      requestedBy: 'Paul CBM',
      priority: 'critical',
      notes: 'Construction site materials'
    },
    {
      id: '#8',
      employee: 'admin',
      department: 'Warehouse',
      items: 'Granite, Blue Metal',
      quantity: '80 tons',
      status: 'pending',
      date: '8/15/2025',
      requestedBy: 'Rachel Admin',
      priority: 'medium',
      notes: 'Storage requirement'
    },
    {
      id: '#7',
      employee: 'CBM',
      department: 'Construction',
      items: 'M-Sand, River Sand',
      quantity: '95 tons',
      status: 'delivered',
      date: '8/10/2025',
      requestedBy: 'Steve CBM',
      priority: 'high',
      notes: 'Foundation work'
    },
    {
      id: '#6',
      employee: 'admin',
      department: 'Operations',
      items: 'Limestone Blocks',
      quantity: '67 units',
      status: 'approved',
      date: '8/05/2025',
      requestedBy: 'Nancy Admin',
      priority: 'medium',
      notes: 'Building materials'
    },
    {
      id: '#5',
      employee: 'CBM',
      department: 'Electrical',
      items: 'Electronics, Tools',
      quantity: '54 units',
      status: 'pending',
      date: '7/30/2025',
      requestedBy: 'Oliver CBM',
      priority: 'high',
      notes: 'Electrical maintenance'
    },
    {
      id: '#4',
      employee: 'admin',
      department: 'Warehouse',
      items: 'Brickbats, Pebbles',
      quantity: '38 tons',
      status: 'delivered',
      date: '7/25/2025',
      requestedBy: 'Sophie Admin',
      priority: 'low',
      notes: 'Landscaping materials'
    },
    {
      id: '#3',
      employee: 'CBM',
      department: 'Operations',
      items: 'Crusher Dust, Laterite',
      quantity: '72 tons',
      status: 'approved',
      date: '7/20/2025',
      requestedBy: 'Henry CBM',
      priority: 'medium',
      notes: 'Road base materials'
    },
    {
      id: '#2',
      employee: 'admin',
      department: 'Maintenance',
      items: 'Hydraulic Oil, Grease',
      quantity: '25 liters',
      status: 'pending',
      date: '7/15/2025',
      requestedBy: 'Grace Admin',
      priority: 'high',
      notes: 'Equipment lubrication'
    },
    {
      id: '#1',
      employee: 'CBM',
      department: 'Fabrication',
      items: 'Welding Rods, Gas',
      quantity: '100 units',
      status: 'delivered',
      date: '7/10/2025',
      requestedBy: 'Frank CBM',
      priority: 'critical',
      notes: 'Welding operations'
    }
  ]);

  // ========================================================================
  // PURCHASE ORDERS DATA
  // ========================================================================
  const [purchaseOrders, setPurchaseOrders] = useState([
    {
      poNumber: 'PO-2025-101',
      vendor: 'ABC Suppliers',
      vendorContact: '+91 98765 43210',
      items: 'Cement, Steel Rods, Aggregates',
      itemsList: ['Cement - 50 bags', 'Steel Rods - 100 units', 'Aggregates - 10 tons'],
      amount: 125000,
      status: 'delivered',
      date: '2025-12-23',
      timestamp: new Date('2025-12-23T10:30:00'),
      deliveryAddress: 'Warehouse A, Site 1',
      paymentTerms: 'Net 30 days'
    },
    {
      poNumber: 'PO-2025-102',
      vendor: 'XYZ Materials',
      vendorContact: '+91 98765 43211',
      items: 'Granite, Blue Metal',
      itemsList: ['Granite - 20 tons', 'Blue Metal - 15 tons'],
      amount: 85000,
      status: 'in-transit',
      date: '2025-12-23',
      timestamp: new Date('2025-12-23T09:15:00'),
      deliveryAddress: 'Warehouse B, Site 2',
      paymentTerms: 'Advance payment'
    },
    {
      poNumber: 'PO-2025-103',
      vendor: 'Global Trading',
      vendorContact: '+91 98765 43212',
      items: 'Safety Equipment, Tools',
      itemsList: ['Safety Helmets - 50', 'Safety Shoes - 40 pairs', 'Hand Tools - 30 sets'],
      amount: 45000,
      status: 'delivered',
      date: '2025-12-22',
      timestamp: new Date('2025-12-22T14:20:00'),
      deliveryAddress: 'Main Office',
      paymentTerms: 'Net 45 days'
    },
    {
      poNumber: 'PO-2025-104',
      vendor: 'Prime Vendors',
      vendorContact: '+91 98765 43213',
      items: 'Packaging Materials',
      itemsList: ['Carton Boxes - 500', 'Bubble Wrap - 100 rolls', 'Tape - 200 rolls'],
      amount: 32000,
      status: 'pending',
      date: '2025-12-22',
      timestamp: new Date('2025-12-22T11:45:00'),
      deliveryAddress: 'Warehouse C',
      paymentTerms: 'Net 30 days'
    },
    {
      poNumber: 'PO-2025-105',
      vendor: 'Elite Supply',
      vendorContact: '+91 98765 43214',
      items: 'Spare Parts, Consumables',
      itemsList: ['Bearings - 20', 'Bolts & Nuts - 500', 'Washers - 1000'],
      amount: 28000,
      status: 'delivered',
      date: '2025-12-21',
      timestamp: new Date('2025-12-21T16:30:00'),
      deliveryAddress: 'Maintenance Dept',
      paymentTerms: 'COD'
    },
    {
      poNumber: 'PO-2025-106',
      vendor: 'ABC Suppliers',
      vendorContact: '+91 98765 43210',
      items: 'M-Sand, River Sand',
      itemsList: ['M-Sand - 30 tons', 'River Sand - 25 tons'],
      amount: 95000,
      status: 'in-transit',
      date: '2025-12-21',
      timestamp: new Date('2025-12-21T10:00:00'),
      deliveryAddress: 'Site 3',
      paymentTerms: 'Net 30 days'
    },
    {
      poNumber: 'PO-2025-107',
      vendor: 'XYZ Materials',
      vendorContact: '+91 98765 43211',
      items: 'Limestone Blocks',
      itemsList: ['Limestone Blocks - 500 units'],
      amount: 67000,
      status: 'delivered',
      date: '2025-12-20',
      timestamp: new Date('2025-12-20T13:15:00'),
      deliveryAddress: 'Site 4',
      paymentTerms: 'Advance payment'
    },
    {
      poNumber: 'PO-2025-108',
      vendor: 'Global Trading',
      vendorContact: '+91 98765 43212',
      items: 'Electronics, Tools',
      itemsList: ['Multimeters - 10', 'Screwdrivers - 50', 'Pliers - 30'],
      amount: 54000,
      status: 'delivered',
      date: '2025-12-19',
      timestamp: new Date('2025-12-19T15:45:00'),
      deliveryAddress: 'Electrical Dept',
      paymentTerms: 'Net 45 days'
    },
    {
      poNumber: 'PO-2025-109',
      vendor: 'Prime Vendors',
      vendorContact: '+91 98765 43213',
      items: 'Brickbats, Pebbles',
      itemsList: ['Brickbats - 10 tons', 'Pebbles - 8 tons'],
      amount: 38000,
      status: 'delivered',
      date: '2025-12-18',
      timestamp: new Date('2025-12-18T09:30:00'),
      deliveryAddress: 'Site 5',
      paymentTerms: 'Net 30 days'
    },
    {
      poNumber: 'PO-2025-110',
      vendor: 'Elite Supply',
      vendorContact: '+91 98765 43214',
      items: 'Crusher Dust, Laterite',
      itemsList: ['Crusher Dust - 20 tons', 'Laterite - 15 tons'],
      amount: 72000,
      status: 'delivered',
      date: '2025-12-17',
      timestamp: new Date('2025-12-17T11:20:00'),
      deliveryAddress: 'Site 6',
      paymentTerms: 'COD'
    }
  ]);

  // ========================================================================
  // RECENT ACTIVITIES
  // ========================================================================
  const recentActivities = [
    {
      type: 'purchase',
      title: 'Purchase Order PO-2025-101 Delivered',
      description: 'Amount: ₹1,25,000',
      time: '2 hours ago',
      icon: 'fas fa-shopping-cart',
      iconType: 'success'
    },
    {
      type: 'stock',
      title: 'Stock In: Cement - 50 bags',
      description: 'Added to warehouse A',
      time: '3 hours ago',
      icon: 'fas fa-arrow-down',
      iconType: 'success'
    },
    {
      type: 'request',
      title: 'New Product Request #19',
      description: 'O Ring requested',
      time: '5 hours ago',
      icon: 'fas fa-clipboard-list',
      iconType: 'info'
    },
    {
      type: 'stock',
      title: 'Stock Out: Steel Rods - 30 units',
      description: 'Issued to Site A',
      time: '6 hours ago',
      icon: 'fas fa-arrow-up',
      iconType: 'warning'
    },
    {
      type: 'purchase',
      title: 'Purchase Order PO-2025-102 In Transit',
      description: 'Expected delivery: Tomorrow',
      time: '8 hours ago',
      icon: 'fas fa-truck',
      iconType: 'info'
    },
    {
      type: 'alert',
      title: 'Low Stock Alert: Granite',
      description: 'Current stock: 15 units',
      time: '10 hours ago',
      icon: 'fas fa-exclamation-triangle',
      iconType: 'warning'
    }
  ];

  // ========================================================================
  // NOTIFICATIONS
  // ========================================================================
  const notifications = [
    {
      title: 'Critical Stock Alert',
      body: 'Cement stock below critical level',
      priority: 'critical',
      time: '1 hour ago'
    },
    {
      title: 'Pending Approval',
      body: '3 purchase requests awaiting approval',
      priority: 'high',
      time: '2 hours ago'
    },
    {
      title: 'Delivery Update',
      body: 'PO-2025-102 will arrive today',
      priority: 'medium',
      time: '4 hours ago'
    },
    {
      title: 'Low Stock Warning',
      body: 'Steel Rods inventory is running low',
      priority: 'high',
      time: '5 hours ago'
    },
    {
      title: 'Quality Check Required',
      body: 'Recent delivery needs inspection',
      priority: 'medium',
      time: '6 hours ago'
    },
    {
      title: 'System Update',
      body: 'Inventory system updated successfully',
      priority: 'normal',
      time: '1 day ago'
    }
  ];

  // ========================================================================
  // STATS DATA
  // ========================================================================
  const stockFlowData = {
    stockIn: 1245,
    stockOut: 856,
    netFlow: 31.2
  };

  const purchasesData = {
    value: purchaseOrders.reduce((sum, po) => sum + po.amount, 0),
    growth: 18.2
  };

  const pendingRequestsData = {
    value: pendingRequests.filter(r => r.status === 'pending').length,
    newToday: 3
  };

  const lowStockData = {
    value: 8,
    critical: 3
  };

  // ========================================================================
  // CHART DATA - STOCK DISTRIBUTION
  // ========================================================================
  const stockDistributionData = [
    { category: 'Raw Materials', quantity: 3245, color: '#1dd1a1' },
    { category: 'Finished Goods', quantity: 2890, color: '#667eea' },
    { category: 'Tools & Equipment', quantity: 1870, color: '#4fd1c7' },
    { category: 'Consumables', quantity: 1654, color: '#ffa726' },
    { category: 'Safety Equipment', quantity: 987, color: '#ff6b6b' },
    { category: 'Packaging', quantity: 756, color: '#ec407a' },
    { category: 'Spare Parts', quantity: 645, color: '#42a5f5' },
    { category: 'Others', quantity: 500, color: '#ab47bc' }
  ];

  // ========================================================================
  // CHART DATA - PURCHASE TRENDS
  // ========================================================================
  const purchaseTrendsData = [
    { date: '2025-11-17', amount: 650000 },
    { date: '2025-11-24', amount: 720000 },
    { date: '2025-12-01', amount: 680000 },
    { date: '2025-12-08', amount: 840000 },
    { date: '2025-12-15', amount: 790000 },
    { date: '2025-12-22', amount: 850000 }
  ];

  // ========================================================================
  // CHART DATA - TOP VENDORS
  // ========================================================================
  const topVendorsData = [
    { name: 'ABC Suppliers', rating: 4.8 },
    { name: 'XYZ Materials', rating: 4.5 },
    { name: 'Global Trading', rating: 4.3 },
    { name: 'Prime Vendors', rating: 4.1 },
    { name: 'Elite Supply', rating: 3.9 }
  ];

  // ========================================================================
  // COMPUTED STATS
  // ========================================================================
  const stats = {
    totalRequests: pendingRequests.length,
    pendingRequests: pendingRequests.filter(r => r.status === 'pending').length,
    approvedRequests: pendingRequests.filter(r => r.status === 'approved').length,
    deliveredRequests: pendingRequests.filter(r => r.status === 'delivered').length,
    rejectedRequests: pendingRequests.filter(r => r.status === 'rejected').length,
    totalPurchases: purchaseOrders.length,
    pendingPurchases: purchaseOrders.filter(po => po.status === 'pending').length,
    inTransitPurchases: purchaseOrders.filter(po => po.status === 'in-transit').length,
    deliveredPurchases: purchaseOrders.filter(po => po.status === 'delivered').length,
    totalPurchaseAmount: purchaseOrders.reduce((sum, po) => sum + po.amount, 0),
    avgPurchaseAmount: purchaseOrders.length > 0 
      ? Math.round(purchaseOrders.reduce((sum, po) => sum + po.amount, 0) / purchaseOrders.length)
      : 0
  };

  // ========================================================================
  // RETURN ALL DATA AND FUNCTIONS
  // ========================================================================
  return {
    // State data
    pendingRequests,
    setPendingRequests,
    purchaseOrders,
    setPurchaseOrders,
    
    // Static data
    recentActivities,
    notifications,
    
    // Stats data
    stats,
    stockFlowData,
    purchasesData,
    pendingRequestsData,
    lowStockData,
    
    // Chart data
    stockDistributionData,
    purchaseTrendsData,
    topVendorsData
  };
};
