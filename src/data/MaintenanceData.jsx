// src/pages/MaintenanceData.jsx
import { useState, useMemo } from 'react';

const MAINTENANCE_RECORDS = [
  {
    id: 'MNT-2025-025',
    soNumber: 'SO-2025-025',
    type: 'External',
    productName: 'Hydraulic Pump HP-500',
    productCode: 'PRD-003',
    quantity: 1,
    serviceProvider: 'FixIt Engineers Pvt Ltd',
    vendorContact: '+91 98765 43210',
    maintenanceType: 'Corrective',
    sentDate: '2025-12-20',
    expectedReturnDate: '2025-12-28',
    estimatedCost: 2500,
    finalCost: null,
    status: 'In Progress',
    remarks: 'Pump motor overheating issue, requires complete servicing',
    vehicleDetails: 'TN09AX1234',
    createdBy: 'Kumar - Storekeeper',
    rating: null,
    proofImage: 'pump_issue_001.jpg'
  },
  {
    id: 'MNT-2025-024',
    soNumber: 'SO-2025-024',
    type: 'Internal',
    productName: 'Electric Motor 5HP',
    productCode: 'PRD-002',
    quantity: 1,
    serviceProvider: 'Ravi Kumar - Maintenance Dept',
    vendorContact: '+91 98456 78901',
    maintenanceType: 'Preventive',
    sentDate: '2025-12-15',
    expectedReturnDate: '2025-12-25',
    estimatedCost: 1000,
    finalCost: 950,
    status: 'Completed',
    remarks: 'Regular maintenance - bearing replacement and oil change',
    vehicleDetails: 'Hand Delivery',
    createdBy: 'Kumar - Storekeeper',
    rating: 5,
    ratingRemarks: 'Excellent service, completed ahead of schedule',
    returnDate: '2025-12-23',
    proofImage: 'motor_maintenance_001.jpg'
  },
  {
    id: 'MNT-2025-023',
    soNumber: 'SO-2025-023',
    type: 'External',
    productName: 'Compressor Unit AC-200',
    productCode: 'PRD-008',
    quantity: 1,
    serviceProvider: 'TechCare Services',
    vendorContact: '+91 99876 54321',
    maintenanceType: 'Emergency',
    sentDate: '2025-12-10',
    expectedReturnDate: '2025-12-18',
    estimatedCost: 5000,
    finalCost: 5200,
    status: 'Completed',
    remarks: 'Compressor breakdown - urgent repair needed',
    vehicleDetails: 'TN07CD5678',
    createdBy: 'Kumar - Storekeeper',
    rating: 4,
    ratingRemarks: 'Good service but slightly delayed',
    returnDate: '2025-12-19',
    proofImage: 'compressor_repair_001.jpg'
  },
  {
    id: 'MNT-2025-022',
    soNumber: 'SO-2025-022',
    type: 'External',
    productName: 'Conveyor Belt Motor',
    productCode: 'PRD-015',
    quantity: 2,
    serviceProvider: 'Industrial Repairs Co',
    vendorContact: '+91 98123 45678',
    maintenanceType: 'Corrective',
    sentDate: '2025-12-28',
    expectedReturnDate: '2026-01-05',
    estimatedCost: 3500,
    finalCost: null,
    status: 'Pending',
    remarks: 'Motors seized due to water damage, needs complete overhaul',
    vehicleDetails: 'TN10BY8765',
    createdBy: 'Ramesh - Storekeeper',
    rating: null,
    proofImage: 'motor_damage_001.jpg'
  },
  {
    id: 'MNT-2025-021',
    soNumber: 'SO-2025-021',
    type: 'Internal',
    productName: 'Control Panel Unit',
    productCode: 'PRD-020',
    quantity: 1,
    serviceProvider: 'Suresh - Electronics Dept',
    vendorContact: '+91 98765 12345',
    maintenanceType: 'Preventive',
    sentDate: '2025-11-25',
    expectedReturnDate: '2025-12-05',
    estimatedCost: 800,
    finalCost: 750,
    status: 'Completed',
    remarks: 'Circuit board inspection and component replacement',
    vehicleDetails: 'Hand Delivery',
    createdBy: 'Kumar - Storekeeper',
    rating: 5,
    ratingRemarks: 'Perfect work, very professional',
    returnDate: '2025-12-03',
    proofImage: 'panel_repair_001.jpg'
  },
  {
    id: 'MNT-2025-020',
    soNumber: 'SO-2025-020',
    type: 'External',
    productName: 'Welding Machine WM-300',
    productCode: 'PRD-025',
    quantity: 1,
    serviceProvider: 'ProMaintain Solutions',
    vendorContact: '+91 99123 45678',
    maintenanceType: 'Corrective',
    sentDate: '2025-11-20',
    expectedReturnDate: '2025-11-30',
    estimatedCost: 4000,
    finalCost: null,
    status: 'Cancelled',
    remarks: 'Machine beyond repair - moved to scrap',
    vehicleDetails: 'TN09CD4567',
    createdBy: 'Kumar - Storekeeper',
    rating: null,
    cancelReason: 'Not repairable - sent to scrap management',
    proofImage: 'welding_damage_001.jpg'
  },
  {
    id: 'MNT-2025-019',
    soNumber: 'SO-2025-019',
    type: 'External',
    productName: 'Lathe Machine LM-450',
    productCode: 'PRD-030',
    quantity: 1,
    serviceProvider: 'FixIt Engineers Pvt Ltd',
    vendorContact: '+91 98765 43210',
    maintenanceType: 'Preventive',
    sentDate: '2025-12-26',
    expectedReturnDate: '2026-01-03',
    estimatedCost: 6500,
    finalCost: null,
    status: 'In Progress',
    remarks: 'Annual maintenance - spindle alignment and calibration',
    vehicleDetails: 'TN07AX9876',
    createdBy: 'Ramesh - Storekeeper',
    rating: null,
    proofImage: 'lathe_service_001.jpg'
  },
  {
    id: 'MNT-2025-018',
    soNumber: 'SO-2025-018',
    type: 'Internal',
    productName: 'Air Conditioning Unit',
    productCode: 'PRD-035',
    quantity: 1,
    serviceProvider: 'Prakash - HVAC Team',
    vendorContact: '+91 98456 32109',
    maintenanceType: 'Preventive',
    sentDate: '2025-12-01',
    expectedReturnDate: '2025-12-08',
    estimatedCost: 1200,
    finalCost: 1150,
    status: 'Completed',
    remarks: 'Gas refill and filter cleaning',
    vehicleDetails: 'Hand Delivery',
    createdBy: 'Kumar - Storekeeper',
    rating: 4,
    ratingRemarks: 'Good work but took longer than expected',
    returnDate: '2025-12-10',
    proofImage: 'ac_service_001.jpg'
  },
  {
    id: 'MNT-2026-001',
    soNumber: 'SO-2026-001',
    type: 'External',
    productName: 'CNC Machine Controller',
    productCode: 'PRD-040',
    quantity: 1,
    serviceProvider: 'TechCare Services',
    vendorContact: '+91 99876 54321',
    maintenanceType: 'Emergency',
    sentDate: '2026-01-01',
    expectedReturnDate: '2026-01-08',
    estimatedCost: 8500,
    finalCost: null,
    status: 'In Progress',
    remarks: 'Display malfunction and software update required',
    vehicleDetails: 'TN09MN4567',
    createdBy: 'Ramesh - Storekeeper',
    rating: null,
    proofImage: 'cnc_issue_001.jpg'
  },
  {
    id: 'MNT-2025-017',
    soNumber: 'SO-2025-017',
    type: 'Internal',
    productName: 'Industrial Fan 36 inch',
    productCode: 'PRD-045',
    quantity: 2,
    serviceProvider: 'Murugan - Electrical Team',
    vendorContact: '+91 98234 56789',
    maintenanceType: 'Corrective',
    sentDate: '2025-11-15',
    expectedReturnDate: '2025-11-22',
    estimatedCost: 600,
    finalCost: 580,
    status: 'Completed',
    remarks: 'Motor winding issue and blade balancing',
    vehicleDetails: 'Hand Delivery',
    createdBy: 'Kumar - Storekeeper',
    rating: 5,
    ratingRemarks: 'Excellent and quick service',
    returnDate: '2025-11-20',
    proofImage: 'fan_repair_001.jpg'
  }
];

const PRODUCTS = [
  { code: 'PRD-001', name: 'Steel Bolt M8', currentStock: 250 },
  { code: 'PRD-002', name: 'Electric Motor 2HP', currentStock: 15 },
  { code: 'PRD-003', name: 'Hydraulic Pump HP-500', currentStock: 8 },
  { code: 'PRD-004', name: 'V-Belt Type A', currentStock: 120 },
  { code: 'PRD-005', name: 'Bearing 6205', currentStock: 80 },
  { code: 'PRD-008', name: 'Compressor Unit AC-200', currentStock: 5 },
  { code: 'PRD-015', name: 'Conveyor Belt Motor', currentStock: 10 },
  { code: 'PRD-020', name: 'Control Panel Unit', currentStock: 12 },
  { code: 'PRD-025', name: 'Welding Machine WM-300', currentStock: 4 },
  { code: 'PRD-030', name: 'Lathe Machine LM-450', currentStock: 3 },
  { code: 'PRD-035', name: 'Air Conditioning Unit', currentStock: 8 },
  { code: 'PRD-040', name: 'CNC Machine Controller', currentStock: 2 },
  { code: 'PRD-045', name: 'Industrial Fan 36 inch', currentStock: 15 }
];

const CONVERSATIONS = {
  'MNT-2025-025': [
    {
      user: 'Kumar - Storekeeper',
      timestamp: '2025-12-20 10:30 AM',
      message: 'Sent pump for maintenance. Vendor confirmed receipt.'
    },
    {
      user: 'FixIt Engineers',
      timestamp: '2025-12-21 02:15 PM',
      message: 'Initial inspection complete. Motor winding needs replacement. Expected completion by Dec 28.'
    },
    {
      user: 'Kumar - Storekeeper',
      timestamp: '2025-12-21 03:00 PM',
      message: 'Approved. Please proceed with the repair.'
    }
  ],
  'MNT-2025-024': [
    {
      user: 'Kumar - Storekeeper',
      timestamp: '2025-12-15 09:00 AM',
      message: 'Motor sent for preventive maintenance'
    },
    {
      user: 'Ravi Kumar',
      timestamp: '2025-12-23 04:30 PM',
      message: 'Maintenance completed. Bearing replaced and lubrication done. Ready for pickup.'
    }
  ]
};

export const useMaintenanceData = () => {
  const [maintenanceRecords, setMaintenanceRecords] = useState(MAINTENANCE_RECORDS);
  const [products] = useState(PRODUCTS);
  const [conversations] = useState(CONVERSATIONS);
  const [currentPeriod, setCurrentPeriod] = useState('this-month');
  const [currentTypeFilter, setCurrentTypeFilter] = useState('all');
  const [currentStatusFilter, setCurrentStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilters, setDateFilters] = useState({
    fromDate: '',
    toDate: ''
  });

  const getDateRangeForPeriod = (period) => {
    const today = new Date();
    let startDate, endDate;

    switch (period) {
      case 'today':
        startDate = new Date(today.setHours(0, 0, 0, 0));
        endDate = new Date(today.setHours(23, 59, 59, 999));
        break;
      case 'this-week': {
        const d = new Date();
        const firstDayOfWeek = d.getDate() - d.getDay();
        startDate = new Date(d.setDate(firstDayOfWeek));
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date();
        break;
      }
      case 'this-month':
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        endDate = new Date();
        break;
      case 'this-year':
        startDate = new Date(today.getFullYear(), 0, 1);
        endDate = new Date();
        break;
      case 'all-time':
      default:
        startDate = new Date(2000, 0, 1);
        endDate = new Date();
        break;
    }

    return { startDate, endDate };
  };

  const isDateInRange = (dateString, startDate, endDate) => {
    const date = new Date(dateString);
    return date >= startDate && date <= endDate;
  };

  const stats = useMemo(() => {
    const { startDate, endDate } = getDateRangeForPeriod(currentPeriod);

    const underMaintenance = maintenanceRecords.filter(
      r => r.status === 'In Progress' || r.status === 'Pending'
    ).length;

    const today = new Date();
    const pendingReturns = maintenanceRecords.filter(r => {
      if (r.status !== 'In Progress' && r.status !== 'Pending') return false;
      const expectedDate = new Date(r.expectedReturnDate);
      return expectedDate < today;
    }).length;

    const completedInPeriod = maintenanceRecords.filter(r => {
      if (r.status !== 'Completed' || !r.returnDate) return false;
      return isDateInRange(r.returnDate, startDate, endDate);
    }).length;

    const serviceCost = maintenanceRecords.filter(r => {
      if (!r.finalCost || !r.returnDate) return false;
      return isDateInRange(r.returnDate, startDate, endDate);
    }).reduce((sum, r) => sum + r.finalCost, 0);

    const periodLabel = {
      'today': 'Today',
      'this-week': 'This Week',
      'this-month': 'This Month',
      'this-year': 'This Year',
      'all-time': 'All Time'
    }[currentPeriod] || 'This Month';

    return [
      {
        title: 'Under Maintenance',
        value: underMaintenance,
        changeText: 'Products in service',
        changeType: 'warning',
        icon: 'fas fa-tools'
      },
      {
        title: 'Pending Returns',
        value: pendingReturns,
        changeText: 'Overdue items',
        changeType: 'negative',
        icon: 'fas fa-clock'
      },
      {
        title: `Completed (${periodLabel})`,
        value: completedInPeriod,
        changeText: '+0 from previous',
        changeType: 'positive',
        icon: 'fas fa-check-circle'
      },
      {
        title: `Service Cost (${periodLabel})`,
        value: `₹${serviceCost.toLocaleString()}`,
        changeText: 'Total expenditure',
        changeType: 'warning',
        icon: 'fas fa-rupee-sign'
      }
    ];
  }, [maintenanceRecords, currentPeriod]);

  const getFilteredRecords = () => {
    let records = [...maintenanceRecords];

    if (currentTypeFilter && currentTypeFilter !== 'all') {
      records = records.filter(r => r.type === currentTypeFilter);
    }

    if (currentStatusFilter && currentStatusFilter !== 'all') {
      records = records.filter(r => r.status === currentStatusFilter);
    }

    if (dateFilters.fromDate) {
      records = records.filter(r => {
        const recordDate = new Date(r.sentDate);
        const fromDate = new Date(dateFilters.fromDate);
        return recordDate >= fromDate;
      });
    }

    if (dateFilters.toDate) {
      records = records.filter(r => {
        const recordDate = new Date(r.sentDate);
        const toDate = new Date(dateFilters.toDate);
        return recordDate <= toDate;
      });
    }

    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      records = records.filter(
        record =>
          record.soNumber.toLowerCase().includes(search) ||
          record.productName.toLowerCase().includes(search) ||
          record.productCode.toLowerCase().includes(search) ||
          record.serviceProvider.toLowerCase().includes(search) ||
          record.maintenanceType.toLowerCase().includes(search) ||
          record.status.toLowerCase().includes(search)
      );
    }

    return records;
  };

  const resetFilters = () => {
    setCurrentTypeFilter('all');
    setCurrentStatusFilter('all');
    setSearchTerm('');
    setDateFilters({ fromDate: '', toDate: '' });
  };

  return {
    maintenanceRecords,
    setMaintenanceRecords,
    products,
    conversations,
    stats,
    currentPeriod,
    setCurrentPeriod,
    currentTypeFilter,
    setCurrentTypeFilter,
    currentStatusFilter,
    setCurrentStatusFilter,
    searchTerm,
    setSearchTerm,
    dateFilters,
    setDateFilters,
    getFilteredRecords,
    resetFilters
  };
};
