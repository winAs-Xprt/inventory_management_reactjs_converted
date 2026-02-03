// src/data/ScrapManagementData.jsx
import { useState, useMemo } from 'react';

// Mock data
const SCRAP_RECORDS = [
  {
    id: 'SCR-2025-015',
    type: 'Scrap In',
    productName: 'Electric Motor 2HP',
    productCode: 'PRD-002',
    fromTo: 'John Admin - Operations',
    plant: 'Chennai Plant',
    quantity: 2,
    condition: 'Broken',
    workingPercentage: 10,
    runtimeHours: 5000,
    status: 'In Warehouse',
    date: '2025-12-28',
    remarks: 'Motor coil burnt due to overload',
    receivedBy: 'Kumar - Storekeeper',
    proofImage: 'scrap_motor_001.jpg'
  },
  {
    id: 'SCR-2025-014',
    type: 'Scrap Out',
    productName: 'Damaged Cable Roll',
    productCode: 'PRD-042',
    fromTo: 'EcoRecycle Pvt Ltd',
    quantity: 5,
    condition: 'Burnt cable',
    workingPercentage: 30,
    status: 'Disposed',
    date: '2025-12-27',
    remarks: '50% reusable after repair',
    vehicleNumber: 'TN09BY0987',
    driverName: 'Ravi Kumar',
    proofImage: 'scrap_cable_002.jpg'
  },
  {
    id: 'SCR-2025-013',
    type: 'Scrap In',
    productName: 'Hydraulic Pump',
    productCode: 'PRD-003',
    fromTo: 'Sarah CBM - Production',
    plant: 'Bangalore Plant',
    quantity: 1,
    condition: 'Worn Out',
    workingPercentage: 25,
    runtimeHours: 8000,
    status: 'In Warehouse',
    date: '2025-12-26',
    remarks: 'Pump seal damaged, leaking oil',
    receivedBy: 'Anbu - Storekeeper',
    proofImage: 'scrap_pump_003.jpg'
  },
  {
    id: 'SCR-2025-012',
    type: 'Scrap In',
    productName: 'V-Belt Type A',
    productCode: 'PRD-004',
    fromTo: 'Mike Admin - Maintenance',
    plant: 'Chennai Plant',
    quantity: 10,
    condition: 'Damaged',
    workingPercentage: 0,
    runtimeHours: 3000,
    status: 'In Warehouse',
    date: '2025-12-25',
    remarks: 'Belt cracked and torn',
    receivedBy: 'Kumar - Storekeeper',
    proofImage: 'scrap_belt_004.jpg'
  },
  {
    id: 'SCR-2025-011',
    type: 'Scrap Out',
    productName: 'Bearing 6205',
    productCode: 'PRD-005',
    fromTo: 'Green Disposal Partners',
    quantity: 15,
    condition: 'Expired',
    workingPercentage: 0,
    status: 'Disposed',
    date: '2025-12-24',
    remarks: 'Beyond usable life, rusted',
    vehicleNumber: 'TN07CD4582',
    driverName: 'Dinesh',
    proofImage: 'scrap_bearing_005.jpg'
  },
  {
    id: 'SCR-2025-010',
    type: 'Scrap In',
    productName: 'Steel Bolt M8',
    productCode: 'PRD-001',
    fromTo: 'Emily CBM - Quality',
    plant: 'Mumbai Plant',
    quantity: 50,
    condition: 'Defective',
    workingPercentage: 0,
    status: 'In Warehouse',
    date: '2025-12-23',
    remarks: 'Thread damage, quality rejection',
    receivedBy: 'Siva - Storekeeper',
    proofImage: 'scrap_bolt_006.jpg'
  },
  {
    id: 'SCR-2025-009',
    type: 'Scrap Out',
    productName: 'Electric Motor 2HP',
    productCode: 'PRD-002',
    fromTo: 'Waste Management Corp',
    quantity: 3,
    condition: 'Broken',
    workingPercentage: 5,
    status: 'Disposed',
    date: '2025-12-22',
    remarks: 'Complete motor failure',
    vehicleNumber: 'TN10AX7654',
    driverName: 'Rajesh',
    proofImage: 'scrap_motor_007.jpg'
  },
  {
    id: 'SCR-2025-008',
    type: 'Scrap In',
    productName: 'Hydraulic Pump',
    productCode: 'PRD-003',
    fromTo: 'Robert Admin - Operations',
    plant: 'Chennai Plant',
    quantity: 1,
    condition: 'Damaged',
    workingPercentage: 40,
    runtimeHours: 6500,
    status: 'In Warehouse',
    date: '2025-12-21',
    remarks: 'Valve stuck, pressure loss',
    receivedBy: 'Kumar - Storekeeper',
    proofImage: 'scrap_pump_008.jpg'
  },
  {
    id: 'SCR-2025-007',
    type: 'Scrap In',
    productName: 'V-Belt Type A',
    productCode: 'PRD-004',
    fromTo: 'Lisa Admin - Warehouse',
    plant: 'Bangalore Plant',
    quantity: 8,
    condition: 'Worn Out',
    workingPercentage: 15,
    runtimeHours: 4000,
    status: 'In Warehouse',
    date: '2025-12-20',
    remarks: 'Surface wear, slipping',
    receivedBy: 'Anbu - Storekeeper',
    proofImage: 'scrap_belt_009.jpg'
  },
  {
    id: 'SCR-2025-006',
    type: 'Scrap Out',
    productName: 'Steel Bolt M8',
    productCode: 'PRD-001',
    fromTo: 'Scrap Solutions India',
    quantity: 100,
    condition: 'Defective',
    workingPercentage: 0,
    status: 'Disposed',
    date: '2025-12-19',
    remarks: 'Batch defect, scrap disposal',
    vehicleNumber: 'TN09BY1234',
    driverName: 'Mohan',
    proofImage: 'scrap_bolt_010.jpg'
  }
];

const AVAILABLE_SCRAP_ITEMS = [
  { id: 'SCR-W-001', productName: 'Electric Motor 2HP', productCode: 'PRD-002', quantity: 2 },
  { id: 'SCR-W-002', productName: 'Hydraulic Pump', productCode: 'PRD-003', quantity: 2 },
  { id: 'SCR-W-003', productName: 'V-Belt Type A', productCode: 'PRD-004', quantity: 18 },
  { id: 'SCR-W-004', productName: 'Steel Bolt M8', productCode: 'PRD-001', quantity: 50 }
];

// Available Products for selection
export const AVAILABLE_PRODUCTS = [
  { code: 'PRD-001', name: 'Steel Bolt M8' },
  { code: 'PRD-002', name: 'Electric Motor 2HP' },
  { code: 'PRD-003', name: 'Hydraulic Pump' },
  { code: 'PRD-004', name: 'V-Belt Type A' },
  { code: 'PRD-005', name: 'Bearing 6205' },
  { code: 'PRD-042', name: 'Damaged Cable Roll' }
];

// Available Vendors
export const AVAILABLE_VENDORS = [
  { id: 'VND-001', name: 'EcoRecycle Pvt Ltd' },
  { id: 'VND-002', name: 'Green Disposal Partners' },
  { id: 'VND-003', name: 'Waste Management Corp' },
  { id: 'VND-004', name: 'Scrap Solutions India' }
];

// Available Plants
export const AVAILABLE_PLANTS = [
  'Chennai Plant',
  'Bangalore Plant',
  'Mumbai Plant',
  'Delhi Plant'
];

export const useScrapData = () => {
  const [scrapRecords, setScrapRecords] = useState(SCRAP_RECORDS);
  const [availableScrapItems] = useState(AVAILABLE_SCRAP_ITEMS);
  const [currentTypeFilter, setCurrentTypeFilter] = useState('all');
  const [currentStatusFilter, setCurrentStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilters, setDateFilters] = useState({
    fromDate: '',
    toDate: ''
  });

  // Generate Scrap ID
  const generateScrapId = () => {
    const year = new Date().getFullYear();
    const lastRecord = scrapRecords[0];
    const lastNumber = lastRecord ? parseInt(lastRecord.id.split('-')[2]) : 0;
    return `SCR-${year}-${String(lastNumber + 1).padStart(3, '0')}`;
  };

  // Add Scrap In Record
  const addScrapInRecord = (formData) => {
    const newRecord = {
      id: generateScrapId(),
      type: 'Scrap In',
      productName: formData.productName,
      productCode: formData.productCode,
      fromTo: formData.fromPerson,
      plant: formData.plant,
      quantity: parseInt(formData.quantity),
      condition: formData.condition,
      workingPercentage: parseInt(formData.workingPercentage) || 0,
      runtimeHours: parseInt(formData.runtimeHours) || 0,
      status: 'In Warehouse',
      date: new Date().toISOString().split('T')[0],
      remarks: formData.remarks || '',
      receivedBy: 'Kumar - Storekeeper',
      proofImage: formData.proofImage?.name || null
    };

    setScrapRecords([newRecord, ...scrapRecords]);
    return true;
  };

  // Add Scrap Out Record
  const addScrapOutRecord = (formData, items) => {
    const vendor = AVAILABLE_VENDORS.find(v => v.id === formData.vendor);
    
    const newRecords = items.map((item, index) => {
      const product = AVAILABLE_PRODUCTS.find(p => p.code === item.productCode);
      return {
        id: index === 0 ? generateScrapId() : `${generateScrapId()}-${index}`,
        type: 'Scrap Out',
        productName: product?.name || item.productName,
        productCode: item.productCode,
        fromTo: vendor?.name || formData.vendor,
        quantity: parseInt(item.quantity),
        condition: 'Disposed',
        workingPercentage: 0,
        status: 'Disposed',
        date: new Date().toISOString().split('T')[0],
        remarks: formData.remarks || '',
        vehicleNumber: formData.vehicleNumber,
        driverName: formData.driverName,
        proofImage: formData.proofImage?.name || null
      };
    });

    setScrapRecords([...newRecords, ...scrapRecords]);
    return true;
  };

  // Calculate stats
  const stats = useMemo(() => {
    const warehouseScrap = scrapRecords.filter(r => r.status === 'In Warehouse');
    const totalInWarehouse = warehouseScrap.reduce((sum, r) => sum + r.quantity, 0);

    const currentMonth = new Date().getMonth();
    const scrapInRecords = scrapRecords.filter(
      r => r.type === 'Scrap In' && new Date(r.date).getMonth() === currentMonth
    );
    const scrapInCount = scrapInRecords.reduce((sum, r) => sum + r.quantity, 0);

    const scrapOutRecords = scrapRecords.filter(
      r => r.type === 'Scrap Out' && new Date(r.date).getMonth() === currentMonth
    );
    const scrapOutCount = scrapOutRecords.reduce((sum, r) => sum + r.quantity, 0);

    return [
      {
        title: 'Total Scrap in Warehouse',
        value: totalInWarehouse,
        changeText: 'Items awaiting disposal',
        changeType: 'warning',
        icon: 'fas fa-warehouse'
      },
      {
        title: 'Scrap In (This Month)',
        value: scrapInCount,
        changeText: `+${scrapInRecords.length} entries this month`,
        changeType: 'positive',
        icon: 'fas fa-arrow-down'
      },
      {
        title: 'Scrap Out (This Month)',
        value: scrapOutCount,
        changeText: `+${scrapOutRecords.length} disposals this month`,
        changeType: 'negative',
        icon: 'fas fa-arrow-up'
      },
      {
        title: 'Pending Scrap Returns',
        value: 5,
        changeText: 'Requires action',
        changeType: 'warning',
        icon: 'fas fa-exclamation-triangle'
      }
    ];
  }, [scrapRecords]);

  // Filter records - FIXED LOGIC
  const getFilteredRecords = () => {
    let records = [...scrapRecords];

    // Apply type filter - FIXED: Only filter if NOT 'all'
    if (currentTypeFilter && currentTypeFilter !== 'all') {
      records = records.filter(r => r.type === currentTypeFilter);
    }

    // Apply status filter - FIXED: Only filter if NOT 'all'
    if (currentStatusFilter && currentStatusFilter !== 'all') {
      records = records.filter(r => r.status === currentStatusFilter);
    }

    // Apply date filters
    if (dateFilters.fromDate) {
      records = records.filter(r => {
        const recordDate = new Date(r.date);
        const fromDate = new Date(dateFilters.fromDate);
        return recordDate >= fromDate;
      });
    }
    
    if (dateFilters.toDate) {
      records = records.filter(r => {
        const recordDate = new Date(r.date);
        const toDate = new Date(dateFilters.toDate);
        return recordDate <= toDate;
      });
    }

    // Apply search filter
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      records = records.filter(
        record =>
          record.id.toLowerCase().includes(search) ||
          record.productName.toLowerCase().includes(search) ||
          record.productCode.toLowerCase().includes(search) ||
          record.fromTo.toLowerCase().includes(search) ||
          record.condition.toLowerCase().includes(search)
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
    scrapRecords,
    availableScrapItems,
    stats,
    currentTypeFilter,
    setCurrentTypeFilter,
    currentStatusFilter,
    setCurrentStatusFilter,
    searchTerm,
    setSearchTerm,
    dateFilters,
    setDateFilters,
    getFilteredRecords,
    resetFilters,
    addScrapInRecord,
    addScrapOutRecord
  };
};
