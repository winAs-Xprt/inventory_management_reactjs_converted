// src/data/ReportData.jsx
import { useState, useMemo } from 'react';

export const useReportData = () => {
  // ============================================================================
  // REPORT CONFIGURATIONS
  // ============================================================================
  const reportConfigs = {
    // INVENTORY REPORTS
    'stock-summary': {
      title: 'Stock Summary Report',
      icon: 'fas fa-boxes',
      category: 'inventory',
      filters: ['category', 'dateRange', 'stockStatus', 'vendor', 'branch'],
      columns: ['Product Code', 'Product Name', 'Category', 'Current Stock', 'Min Threshold', 'Unit', 'Rack Location', 'Status', 'Value'],
      stats: ['totalProducts', 'totalValue', 'lowStockItems', 'outOfStockItems']
    },
    'stock-movement': {
      title: 'Stock Movement Report',
      icon: 'fas fa-exchange-alt',
      category: 'inventory',
      filters: ['dateRange', 'movementType', 'product', 'branch', 'user'],
      columns: ['Date', 'Product Name', 'Movement Type', 'Quantity', 'Unit', 'From Location', 'To Location', 'Reference No', 'User', 'Remarks'],
      stats: ['totalMovements', 'inwardMovements', 'outwardMovements', 'internalTransfers']
    },
    'low-stock': {
      title: 'Low Stock Alert Report',
      icon: 'fas fa-exclamation-triangle',
      category: 'inventory',
      filters: ['category', 'stockLevel', 'vendor', 'branch'],
      columns: ['Product Code', 'Product Name', 'Category', 'Current Stock', 'Min Threshold', 'Deficit', 'Unit', 'Last Purchase Date', 'Suggested Reorder'],
      stats: ['criticalItems', 'lowStockItems', 'estimatedValue', 'suppliersAffected']
    },
    'rack-location': {
      title: 'Rack Location Mapping Report',
      icon: 'fas fa-map-marker-alt',
      category: 'inventory',
      filters: ['rackLocation', 'category', 'occupancy'],
      columns: ['Rack ID', 'Location', 'Product Code', 'Product Name', 'Quantity', 'Unit', 'Occupancy %', 'Last Updated'],
      stats: ['totalRacks', 'occupiedRacks', 'emptyRacks', 'utilizationRate']
    },
    'stock-aging': {
      title: 'Stock Aging Analysis Report',
      icon: 'fas fa-history',
      category: 'inventory',
      filters: ['dateRange', 'category', 'agingPeriod', 'branch'],
      columns: ['Product Name', 'Category', 'Current Stock', 'Purchase Date', 'Age (Days)', 'Aging Category', 'Value', 'Action Required'],
      stats: ['freshStock', 'agingStock', 'deadStock', 'totalValue']
    },
    'internal-external': {
      title: 'Internal vs External Stock Report',
      icon: 'fas fa-random',
      category: 'inventory',
      filters: ['dateRange', 'branch', 'type'],
      columns: ['Date', 'Product Name', 'Type', 'Quantity', 'Unit', 'From', 'To', 'Purpose', 'Approved By', 'Status'],
      stats: ['internalIssues', 'externalIssues', 'pendingReturns', 'totalValue']
    },

    // PURCHASE REPORTS
    'po-summary': {
      title: 'Purchase Order Summary Report',
      icon: 'fas fa-file-invoice',
      category: 'purchase',
      filters: ['dateRange', 'vendor', 'poStatus', 'branch', 'amountRange'],
      columns: ['PO Number', 'PO Date', 'Vendor Name', 'Total Items', 'Total Amount', 'Status', 'Expected Delivery', 'Created By', 'Approved By'],
      stats: ['totalPOs', 'pendingPOs', 'completedPOs', 'totalAmount']
    },
    'grn-report': {
      title: 'Goods Receipt Note (GRN) Report',
      icon: 'fas fa-clipboard-check',
      category: 'purchase',
      filters: ['dateRange', 'vendor', 'grnStatus', 'branch'],
      columns: ['GRN Number', 'GRN Date', 'PO Number', 'Vendor Name', 'Items Received', 'Total Quantity', 'Total Amount', 'Quality Check', 'Received By', 'Status'],
      stats: ['totalGRNs', 'itemsReceived', 'totalValue', 'qualityRejections']
    },
    'vendor-performance': {
      title: 'Vendor Performance Analysis Report',
      icon: 'fas fa-chart-line',
      category: 'purchase',
      filters: ['dateRange', 'vendor', 'performanceMetric'],
      columns: ['Vendor Name', 'Total POs', 'On-Time Delivery %', 'Quality Rating', 'Average Lead Time', 'Total Value', 'Rejection Rate', 'Performance Score'],
      stats: ['topVendors', 'averageDeliveryTime', 'qualityScore', 'totalSpent']
    },
    'purchase-returns': {
      title: 'Purchase Returns Report',
      icon: 'fas fa-undo',
      category: 'purchase',
      filters: ['dateRange', 'vendor', 'returnReason', 'branch'],
      columns: ['Return Number', 'Return Date', 'PO Number', 'GRN Number', 'Vendor Name', 'Product Name', 'Quantity', 'Reason', 'Amount', 'Status'],
      stats: ['totalReturns', 'returnValue', 'topReasons', 'affectedVendors']
    },
    'auto-po': {
      title: 'Auto-Generated PO Report',
      icon: 'fas fa-robot',
      category: 'purchase',
      filters: ['dateRange', 'vendor', 'poStatus', 'triggerReason'],
      columns: ['PO Number', 'Generated Date', 'Product Name', 'Vendor Name', 'Trigger Reason', 'Quantity', 'Amount', 'Status', 'Action Taken'],
      stats: ['autoPOsGenerated', 'totalAmount', 'successRate', 'pendingApprovals']
    },

    // REQUEST & APPROVAL REPORTS
    'pending-requests': {
      title: 'Pending Requests Report',
      icon: 'fas fa-clock',
      category: 'request',
      filters: ['requestType', 'priority', 'department', 'assignedTo'],
      columns: ['Request ID', 'Request Date', 'Type', 'Requested By', 'Product/Item', 'Quantity', 'Priority', 'Pending Since', 'Assigned To', 'Status'],
      stats: ['totalPending', 'highPriority', 'averageWaitTime', 'overdueRequests']
    },
    'request-history': {
      title: 'Request History Report',
      icon: 'fas fa-history',
      category: 'request',
      filters: ['dateRange', 'requestType', 'status', 'department', 'user'],
      columns: ['Request ID', 'Request Date', 'Type', 'Requested By', 'Product/Item', 'Quantity', 'Approved By', 'Approval Date', 'Status', 'Remarks'],
      stats: ['totalRequests', 'approvedRequests', 'rejectedRequests', 'averageProcessingTime']
    },
    'approval-workflow': {
      title: 'Approval Workflow Report',
      icon: 'fas fa-project-diagram',
      category: 'request',
      filters: ['dateRange', 'workflowStage', 'approver', 'status'],
      columns: ['Request ID', 'Item', 'Current Stage', 'Approver', 'Pending Since', 'SLA Status', 'Previous Actions', 'Next Action', 'Status'],
      stats: ['inWorkflow', 'completedWorkflows', 'bottlenecks', 'averageSLA']
    },
    'supervisor-requests': {
      title: 'Supervisor Request Report',
      icon: 'fas fa-user-tie',
      category: 'request',
      filters: ['dateRange', 'supervisor', 'department', 'status'],
      columns: ['Request ID', 'Date', 'Supervisor Name', 'Department', 'Type', 'Items Requested', 'Total Value', 'Status', 'Action Date', 'Remarks'],
      stats: ['totalSupervisorRequests', 'approvedValue', 'pendingApprovals', 'rejectionRate']
    },
    'fulfillment-time': {
      title: 'Request Fulfillment Time Analysis',
      icon: 'fas fa-stopwatch',
      category: 'request',
      filters: ['dateRange', 'requestType', 'department', 'priority'],
      columns: ['Request ID', 'Request Date', 'Type', 'Priority', 'Request Time', 'Approval Time', 'Fulfillment Time', 'Total Duration', 'Performance', 'Status'],
      stats: ['averageFulfillmentTime', 'fastestFulfillment', 'slowestFulfillment', 'onTimeFulfillment']
    },

    // OPERATIONAL REPORTS
    'branch-wise': {
      title: 'Branch-wise Operations Report',
      icon: 'fas fa-building',
      category: 'operational',
      filters: ['dateRange', 'branch', 'reportType', 'comparison'],
      columns: ['Branch Name', 'Total Stock', 'Stock Value', 'Incoming', 'Outgoing', 'Pending Requests', 'Fulfillment Rate', 'Performance Score'],
      stats: ['totalBranches', 'topPerformer', 'totalStockValue', 'averagePerformance']
    },
    'delivery-challan': {
      title: 'Delivery Challan Report',
      icon: 'fas fa-truck',
      category: 'operational',
      filters: ['dateRange', 'challanStatus', 'branch', 'driver'],
      columns: ['Challan Number', 'Date', 'From Branch', 'To Branch', 'Items', 'Quantity', 'Driver Name', 'Vehicle No', 'Status', 'Delivered Date'],
      stats: ['totalChallans', 'inTransit', 'delivered', 'pending']
    },
    'scrap-management': {
      title: 'Scrap Management Report',
      icon: 'fas fa-recycle',
      category: 'operational',
      filters: ['dateRange', 'scrapReason', 'category', 'branch'],
      columns: ['Date', 'Product Name', 'Category', 'Quantity', 'Unit', 'Reason', 'Scrap Value', 'Disposal Method', 'Approved By', 'Status'],
      stats: ['totalScrapItems', 'scrapValue', 'topReasons', 'disposalPending']
    },
    'maintenance-tracking': {
      title: 'Maintenance Tracking Report',
      icon: 'fas fa-tools',
      category: 'operational',
      filters: ['dateRange', 'maintenanceType', 'status', 'asset'],
      columns: ['Asset/Item', 'Maintenance Type', 'Scheduled Date', 'Actual Date', 'Status', 'Cost', 'Performed By', 'Next Due Date', 'Remarks'],
      stats: ['scheduledMaintenance', 'completedMaintenance', 'overdueMaintenance', 'totalCost']
    },
    'audit-trail': {
      title: 'System Audit Trail Report',
      icon: 'fas fa-clipboard-list',
      category: 'operational',
      filters: ['dateRange', 'action', 'user', 'module'],
      columns: ['Timestamp', 'User', 'Module', 'Action', 'Record Type', 'Record ID', 'Changes Made', 'IP Address', 'Status'],
      stats: ['totalActions', 'topUsers', 'topModules', 'criticalChanges']
    }
  };

  // ============================================================================
  // FILTER DEFINITIONS
  // ============================================================================
  const filterDefinitions = {
    dateRange: {
      label: 'Date Range',
      icon: 'fa-calendar-alt',
      type: 'dateRange'
    },
    category: {
      label: 'Category',
      icon: 'fa-layer-group',
      type: 'select',
      options: ['All Categories', 'Electronics', 'Furniture', 'Stationery', 'Hardware', 'Consumables']
    },
    stockStatus: {
      label: 'Stock Status',
      icon: 'fa-signal',
      type: 'select',
      options: ['All Status', 'Normal', 'Low Stock', 'Critical', 'Out of Stock']
    },
    vendor: {
      label: 'Vendor',
      icon: 'fa-store',
      type: 'select',
      options: ['All Vendors', 'Tech Solutions Ltd', 'Office Mart India', 'Furniture World', 'Stationery Hub', 'Digital Supplies Co']
    },
    branch: {
      label: 'Branch',
      icon: 'fa-building',
      type: 'select',
      options: ['All Branches', 'Head Office', 'Branch 1', 'Branch 2', 'Warehouse A', 'Warehouse B']
    },
    movementType: {
      label: 'Movement Type',
      icon: 'fa-exchange-alt',
      type: 'select',
      options: ['All Types', 'Inward', 'Outward', 'Internal Transfer', 'Return', 'Adjustment']
    },
    product: {
      label: 'Product',
      icon: 'fa-box',
      type: 'select',
      options: ['All Products', 'Wireless Mouse', 'Office Chair', 'A4 Paper', 'Keyboard', 'Monitor']
    },
    user: {
      label: 'User',
      icon: 'fa-user',
      type: 'select',
      options: ['All Users', 'Admin User', 'Store Keeper 1', 'Store Keeper 2', 'Supervisor']
    },
    stockLevel: {
      label: 'Stock Level',
      icon: 'fa-chart-bar',
      type: 'select',
      options: ['Critical Only', 'Low & Critical', 'All Low Stock']
    },
    rackLocation: {
      label: 'Rack Location',
      icon: 'fa-map-marker-alt',
      type: 'select',
      options: ['All Locations', 'Rack 1', 'Rack 2', 'Rack 3', 'Wardrobe 1', 'Wardrobe 2']
    },
    occupancy: {
      label: 'Occupancy',
      icon: 'fa-percentage',
      type: 'select',
      options: ['All', 'Full (100%)', 'High (75-99%)', 'Medium (50-74%)', 'Low (25-49%)', 'Empty (0-24%)']
    },
    agingPeriod: {
      label: 'Aging Period',
      icon: 'fa-hourglass-half',
      type: 'select',
      options: ['All Periods', '0-30 Days', '31-60 Days', '61-90 Days', '91-180 Days', '180+ Days']
    },
    type: {
      label: 'Issue Type',
      icon: 'fa-tags',
      type: 'select',
      options: ['All Types', 'Internal Issue', 'External Issue', 'Customer Supply', 'Project Use']
    },
    poStatus: {
      label: 'PO Status',
      icon: 'fa-info-circle',
      type: 'select',
      options: ['All Status', 'Draft', 'Pending Approval', 'Approved', 'Partially Received', 'Completed', 'Cancelled']
    },
    amountRange: {
      label: 'Amount Range',
      icon: 'fa-rupee-sign',
      type: 'select',
      options: ['All Amounts', '₹0 - ₹50,000', '₹50,000 - ₹1,00,000', '₹1,00,000 - ₹5,00,000', '₹5,00,000+']
    },
    grnStatus: {
      label: 'GRN Status',
      icon: 'fa-clipboard-check',
      type: 'select',
      options: ['All Status', 'Pending', 'Quality Check', 'Approved', 'Rejected', 'Partial']
    },
    performanceMetric: {
      label: 'Performance Metric',
      icon: 'fa-chart-line',
      type: 'select',
      options: ['Overall Score', 'Delivery Performance', 'Quality Rating', 'Response Time', 'Pricing']
    },
    returnReason: {
      label: 'Return Reason',
      icon: 'fa-question-circle',
      type: 'select',
      options: ['All Reasons', 'Quality Issue', 'Wrong Item', 'Damaged', 'Expired', 'Excess Quantity', 'Other']
    },
    triggerReason: {
      label: 'Trigger Reason',
      icon: 'fa-bolt',
      type: 'select',
      options: ['All Reasons', 'Low Stock', 'Critical Stock', 'Scheduled Reorder', 'Manual Override']
    },
    requestType: {
      label: 'Request Type',
      icon: 'fa-clipboard',
      type: 'select',
      options: ['All Types', 'Material Request', 'Purchase Request', 'Transfer Request', 'Return Request']
    },
    priority: {
      label: 'Priority',
      icon: 'fa-exclamation-triangle',
      type: 'select',
      options: ['All Priority', 'High', 'Medium', 'Low', 'Urgent']
    },
    department: {
      label: 'Department',
      icon: 'fa-sitemap',
      type: 'select',
      options: ['All Departments', 'Production', 'Maintenance', 'Administration', 'Sales', 'IT']
    },
    assignedTo: {
      label: 'Assigned To',
      icon: 'fa-user-check',
      type: 'select',
      options: ['All Users', 'Store Manager', 'Purchase Manager', 'Department Head', 'Admin']
    },
    status: {
      label: 'Status',
      icon: 'fa-flag',
      type: 'select',
      options: ['All Status', 'Pending', 'In Progress', 'Approved', 'Rejected', 'Completed']
    },
    workflowStage: {
      label: 'Workflow Stage',
      icon: 'fa-tasks',
      type: 'select',
      options: ['All Stages', 'Initiated', 'Level 1 Approval', 'Level 2 Approval', 'Final Approval', 'Completed']
    },
    approver: {
      label: 'Approver',
      icon: 'fa-user-check',
      type: 'select',
      options: ['All Approvers', 'Department Head', 'Store Manager', 'Purchase Manager', 'Finance Head', 'CEO']
    },
    supervisor: {
      label: 'Supervisor',
      icon: 'fa-user-tie',
      type: 'select',
      options: ['All Supervisors', 'John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Williams']
    },
    reportType: {
      label: 'Report Type',
      icon: 'fa-file-alt',
      type: 'select',
      options: ['All Reports', 'Stock Report', 'Transaction Report', 'Performance Report']
    },
    comparison: {
      label: 'Comparison',
      icon: 'fa-balance-scale',
      type: 'select',
      options: ['No Comparison', 'Month over Month', 'Quarter over Quarter', 'Year over Year']
    },
    challanStatus: {
      label: 'Challan Status',
      icon: 'fa-truck-loading',
      type: 'select',
      options: ['All Status', 'Pending', 'In Transit', 'Delivered', 'Delayed', 'Cancelled']
    },
    driver: {
      label: 'Driver',
      icon: 'fa-id-card',
      type: 'select',
      options: ['All Drivers', 'Driver 1', 'Driver 2', 'Driver 3', 'External Courier']
    },
    scrapReason: {
      label: 'Scrap Reason',
      icon: 'fa-trash-alt',
      type: 'select',
      options: ['All Reasons', 'Damaged', 'Expired', 'Obsolete', 'Quality Failure', 'Excess Stock', 'Other']
    },
    maintenanceType: {
      label: 'Maintenance Type',
      icon: 'fa-wrench',
      type: 'select',
      options: ['All Types', 'Preventive', 'Corrective', 'Breakdown', 'Scheduled', 'Emergency']
    },
    asset: {
      label: 'Asset/Item',
      icon: 'fa-cogs',
      type: 'select',
      options: ['All Assets', 'Machine 1', 'Machine 2', 'Vehicle 1', 'Equipment A', 'Equipment B']
    },
    action: {
      label: 'Action Type',
      icon: 'fa-bolt',
      type: 'select',
      options: ['All Actions', 'Create', 'Update', 'Delete', 'Approve', 'Reject', 'Export', 'Login']
    },
    module: {
      label: 'Module',
      icon: 'fa-cubes',
      type: 'select',
      options: ['All Modules', 'Inventory', 'Purchase', 'Vendor', 'Product', 'Reports', 'Settings']
    }
  };

  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================
  const [currentReport, setCurrentReport] = useState(null);
  const [reportData, setReportData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [currentFilters, setCurrentFilters] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');

  // ============================================================================
  // SAMPLE DATA GENERATION
  // ============================================================================
  const generateSampleValue = (column, index) => {
    const samples = {
      'Product Code': `PRD-${String(index).padStart(4, '0')}`,
      'Product Name': ['Wireless Mouse', 'Office Chair', 'A4 Paper', 'Keyboard', 'Monitor', 'Laptop Stand', 'USB Cable', 'Headphones'][index % 8],
      'Category': ['Electronics', 'Furniture', 'Stationery', 'Hardware', 'Consumables'][index % 5],
      'Current Stock': Math.floor(Math.random() * 200) + 10,
      'Min Threshold': Math.floor(Math.random() * 50) + 10,
      'Unit': ['Piece', 'Pack', 'Box', 'Set', 'Kg'][index % 5],
      'Rack Location': `Rack ${(index % 3) + 1} - ${String.fromCharCode(65 + (index % 10))}${index % 6 + 1}`,
      'Status': ['Normal', 'Low Stock', 'Critical', 'Out of Stock'][index % 4],
      'Value': `₹${(Math.random() * 100000 + 10000).toFixed(2)}`,
      'Date': new Date(2026, 0, Math.floor(Math.random() * 31) + 1).toISOString().split('T')[0],
      'Movement Type': ['Inward', 'Outward', 'Internal Transfer', 'Return'][index % 4],
      'Quantity': Math.floor(Math.random() * 100) + 1,
      'From Location': `Rack ${index % 3 + 1}`,
      'To Location': `Rack ${(index + 1) % 3 + 1}`,
      'Reference No': `REF-${String(index).padStart(5, '0')}`,
      'User': ['Admin User', 'Store Keeper 1', 'Store Keeper 2', 'Supervisor'][index % 4],
      'Remarks': ['Stock received', 'Issued to production', 'Transfer completed', 'Quality checked'][index % 4],
      'Deficit': Math.floor(Math.random() * 30) + 1,
      'Last Purchase Date': new Date(2025, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
      'Suggested Reorder': Math.floor(Math.random() * 100) + 50,
      'Rack ID': `R${index % 5 + 1}`,
      'Location': `Rack ${index % 5 + 1} - ${String.fromCharCode(65 + (index % 10))}${index % 6 + 1}`,
      'Occupancy %': `${Math.floor(Math.random() * 100)}%`,
      'Last Updated': new Date(2026, 0, Math.floor(Math.random() * 31) + 1).toISOString().split('T')[0],
      'Purchase Date': new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
      'Age (Days)': Math.floor(Math.random() * 365) + 1,
      'Aging Category': ['Fresh', 'Normal', 'Aging', 'Dead Stock'][index % 4],
      'Action Required': ['None', 'Review', 'Dispose', 'Discount Sale'][index % 4],
      'Type': ['Internal Issue', 'External Issue'][index % 2],
      'From': ['Store', 'Warehouse A', 'Branch 1'][index % 3],
      'To': ['Production', 'Customer', 'Branch 2'][index % 3],
      'Purpose': ['Production Use', 'Customer Order', 'Maintenance', 'Project'][index % 4],
      'Approved By': ['Manager', 'Supervisor', 'Admin'][index % 3],
      'PO Number': `PO-${String(index).padStart(5, '0')}`,
      'PO Date': new Date(2026, 0, Math.floor(Math.random() * 31) + 1).toISOString().split('T')[0],
      'Vendor Name': ['Tech Solutions Ltd', 'Office Mart India', 'Furniture World', 'Stationery Hub'][index % 4],
      'Total Items': Math.floor(Math.random() * 20) + 1,
      'Total Amount': `₹${(Math.random() * 500000 + 50000).toFixed(2)}`,
      'Expected Delivery': new Date(2026, 1, Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
      'Created By': ['Purchase Manager', 'Admin', 'Store Manager'][index % 3],
      'GRN Number': `GRN-${String(index).padStart(5, '0')}`,
      'GRN Date': new Date(2026, 0, Math.floor(Math.random() * 31) + 1).toISOString().split('T')[0],
      'Items Received': Math.floor(Math.random() * 20) + 1,
      'Total Quantity': Math.floor(Math.random() * 500) + 100,
      'Quality Check': ['Passed', 'Failed', 'Pending'][index % 3],
      'Received By': ['Store Keeper 1', 'Store Keeper 2'][index % 2],
      'Total POs': Math.floor(Math.random() * 50) + 10,
      'On-Time Delivery %': `${Math.floor(Math.random() * 40) + 60}%`,
      'Quality Rating': `${(Math.random() * 2 + 3).toFixed(1)}/5`,
      'Average Lead Time': `${Math.floor(Math.random() * 15) + 3} days`,
      'Rejection Rate': `${Math.floor(Math.random() * 10)}%`,
      'Performance Score': `${Math.floor(Math.random() * 40) + 60}%`,
      'Return Number': `RET-${String(index).padStart(5, '0')}`,
      'Return Date': new Date(2026, 0, Math.floor(Math.random() * 31) + 1).toISOString().split('T')[0],
      'Reason': ['Quality Issue', 'Wrong Item', 'Damaged', 'Expired'][index % 4],
      'Amount': `₹${(Math.random() * 50000 + 5000).toFixed(2)}`,
      'Generated Date': new Date(2026, 0, Math.floor(Math.random() * 31) + 1).toISOString().split('T')[0],
      'Trigger Reason': ['Low Stock', 'Critical Stock', 'Scheduled Reorder'][index % 3],
      'Action Taken': ['Approved', 'Pending', 'Rejected'][index % 3],
      'Request ID': `REQ-${String(index).padStart(5, '0')}`,
      'Request Date': new Date(2026, 0, Math.floor(Math.random() * 31) + 1).toISOString().split('T')[0],
      'Requested By': ['Production Manager', 'Maintenance Head', 'Admin Officer'][index % 3],
      'Product/Item': ['Wireless Mouse', 'Office Chair', 'A4 Paper'][index % 3],
      'Priority': ['High', 'Medium', 'Low', 'Urgent'][index % 4],
      'Pending Since': `${Math.floor(Math.random() * 10) + 1} days`,
      'Assigned To': ['Store Manager', 'Purchase Manager'][index % 2],
      'Approval Date': new Date(2026, 0, Math.floor(Math.random() * 31) + 1).toISOString().split('T')[0],
      'Current Stage': ['Level 1 Approval', 'Level 2 Approval', 'Final Approval'][index % 3],
      'Approver': ['Department Head', 'Store Manager', 'Finance Head'][index % 3],
      'SLA Status': ['Within SLA', 'Near Breach', 'Breached'][index % 3],
      'Previous Actions': ['Initiated', 'Level 1 Approved'][index % 2],
      'Next Action': ['Level 2 Approval', 'Final Approval'][index % 2],
      'Supervisor Name': ['John Doe', 'Jane Smith', 'Mike Johnson'][index % 3],
      'Department': ['Production', 'Maintenance', 'Administration'][index % 3],
      'Items Requested': Math.floor(Math.random() * 10) + 1,
      'Total Value': `₹${(Math.random() * 200000 + 20000).toFixed(2)}`,
      'Action Date': new Date(2026, 0, Math.floor(Math.random() * 31) + 1).toISOString().split('T')[0],
      'Request Time': `${Math.floor(Math.random() * 8) + 1} hours`,
      'Approval Time': `${Math.floor(Math.random() * 24) + 1} hours`,
      'Fulfillment Time': `${Math.floor(Math.random() * 48) + 1} hours`,
      'Total Duration': `${Math.floor(Math.random() * 72) + 1} hours`,
      'Performance': ['Excellent', 'Good', 'Average', 'Poor'][index % 4],
      'Branch Name': ['Head Office', 'Branch 1', 'Branch 2', 'Warehouse A'][index % 4],
      'Total Stock': Math.floor(Math.random() * 10000) + 1000,
      'Stock Value': `₹${(Math.random() * 10000000 + 1000000).toFixed(2)}`,
      'Incoming': Math.floor(Math.random() * 500) + 50,
      'Outgoing': Math.floor(Math.random() * 400) + 40,
      'Pending Requests': Math.floor(Math.random() * 20) + 1,
      'Fulfillment Rate': `${Math.floor(Math.random() * 40) + 60}%`,
      'Performance Score': `${Math.floor(Math.random() * 40) + 60}/100`,
      'Challan Number': `CH-${String(index).padStart(5, '0')}`,
      'From Branch': ['Head Office', 'Branch 1', 'Warehouse A'][index % 3],
      'To Branch': ['Branch 2', 'Branch 3', 'Warehouse B'][index % 3],
      'Items': Math.floor(Math.random() * 20) + 1,
      'Driver Name': ['Driver 1', 'Driver 2', 'Driver 3'][index % 3],
      'Vehicle No': `TN-01-AB-${String(index + 1000).padStart(4, '0')}`,
      'Delivered Date': new Date(2026, 0, Math.floor(Math.random() * 31) + 1).toISOString().split('T')[0],
      'Scrap Value': `₹${(Math.random() * 10000 + 1000).toFixed(2)}`,
      'Disposal Method': ['Recycle', 'Dispose', 'Resell', 'Auction'][index % 4],
      'Maintenance Type': ['Preventive', 'Corrective', 'Breakdown'][index % 3],
      'Scheduled Date': new Date(2026, 0, Math.floor(Math.random() * 31) + 1).toISOString().split('T')[0],
      'Actual Date': new Date(2026, 0, Math.floor(Math.random() * 31) + 1).toISOString().split('T')[0],
      'Cost': `₹${(Math.random() * 50000 + 5000).toFixed(2)}`,
      'Performed By': ['Technician 1', 'Technician 2', 'External Agency'][index % 3],
      'Next Due Date': new Date(2026, 2, Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
      'Asset/Item': ['Machine 1', 'Machine 2', 'Vehicle 1'][index % 3],
      'Timestamp': new Date(2026, 0, Math.floor(Math.random() * 31) + 1, Math.floor(Math.random() * 24), Math.floor(Math.random() * 60)).toISOString(),
      'Module': ['Inventory', 'Purchase', 'Vendor', 'Product'][index % 4],
      'Action': ['Create', 'Update', 'Delete', 'Approve'][index % 4],
      'Record Type': ['Product', 'Purchase Order', 'Vendor', 'Request'][index % 4],
      'Record ID': `REC-${String(index).padStart(5, '0')}`,
      'Changes Made': 'Updated record details',
      'IP Address': `192.168.1.${Math.floor(Math.random() * 255)}`
    };

    return samples[column] || '-';
  };

  const generateSampleReportData = (reportType) => {
    const config = reportConfigs[reportType];
    if (!config) return [];

    const sampleData = [];
    const sampleCount = 50;

    for (let i = 1; i <= sampleCount; i++) {
      const row = {};
      config.columns.forEach(column => {
        row[column] = generateSampleValue(column, i);
      });
      sampleData.push(row);
    }

    return sampleData;
  };

  // ============================================================================
  // FILTERING AND SORTING
  // ============================================================================
  const getFilteredReportData = useMemo(() => {
    return () => {
      if (!currentReport || reportData.length === 0) return [];

      let filtered = [...reportData];

      // Apply search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(row => {
          return currentReport.columns.some(column => {
            const value = String(row[column] || '').toLowerCase();
            return value.includes(query);
          });
        });
      }

      // Apply column filters
      // (In a real implementation, you would apply specific filters here)
      // For now, we'll keep it simple

      // Apply sorting
      if (sortColumn) {
        filtered.sort((a, b) => {
          let aVal = a[sortColumn];
          let bVal = b[sortColumn];

          // Handle numeric values (including those with ₹ prefix)
          if (typeof aVal === 'string' && aVal.startsWith('₹')) {
            aVal = parseFloat(aVal.replace(/[₹,]/g, ''));
            bVal = parseFloat(bVal.replace(/[₹,]/g, ''));
          }

          // Handle dates
          if (sortColumn.toLowerCase().includes('date')) {
            aVal = new Date(aVal);
            bVal = new Date(bVal);
          }

          // Handle percentages
          if (typeof aVal === 'string' && aVal.includes('%')) {
            aVal = parseFloat(aVal);
            bVal = parseFloat(bVal);
          }

          if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
          if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
          return 0;
        });
      }

      return filtered;
    };
  }, [reportData, searchQuery, currentReport, sortColumn, sortDirection]);

  // ============================================================================
  // HELPER FUNCTIONS
  // ============================================================================
  const resetFilters = () => {
    setCurrentFilters({});
    setSearchQuery('');
    setSortColumn(null);
    setSortDirection('asc');
  };

  // ============================================================================
  // RETURN ALL DATA AND FUNCTIONS
  // ============================================================================
  return {
    // Configurations
    reportConfigs,
    filterDefinitions,

    // State
    currentReport,
    setCurrentReport,
    reportData,
    setReportData,
    filteredData,
    setFilteredData,
    currentFilters,
    setCurrentFilters,
    searchQuery,
    setSearchQuery,
    sortColumn,
    setSortColumn,
    sortDirection,
    setSortDirection,

    // Functions
    generateSampleReportData,
    getFilteredReportData,
    resetFilters
  };
};

export default useReportData;
