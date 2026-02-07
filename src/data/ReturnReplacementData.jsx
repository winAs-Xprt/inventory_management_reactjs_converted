// src/data/ReturnReplacementData.jsx
import { useState, useMemo } from 'react';

// ==========================================================================
// INITIAL RETURN DATA
// ==========================================================================
const INITIAL_RETURNS_DATA = [
  {
    id: 'RET-2026-010',
    returnType: 'purchase',
    requester: 'Vendor - Suresh Kumar',
    department: 'Machine Parts Supplier',
    products: 'Bearings (32mm) - 20 units, V-Belts Type A - 15 units, Steel Gears - 10 units',
    reasonTitle: 'Wrong specifications',
    reasonDetails: 'Received wrong size bearings (32mm instead of 42mm ordered) and belts (Type A instead of Type B). Products do not fit our machinery requirements.',
    returnDate: '2026-01-24',
    status: 'in-progress',
    replacementNeeded: true,
    refundNeeded: false,
    differentProduct: false,
    replacementProduct: 'Correct size Bearings 42mm - 20 units, V-Belts Type B - 15 units',
    linkedRequest: null,
    linkedPO: 'PO-2026-098',
    proofImages: 'wrong_specs_bearings.jpg, wrong_belts.jpg',
    pickupInfo: 'Vendor pickup scheduled - Jan 25, 2026',
    createdBy: 'Maintenance Head - Suresh Kumar',
    approvedBy: 'Operations Manager - Rajesh',
    timeline: [
      { status: 'Request Created', date: '2026-01-24', time: '10:15 AM', type: 'info', description: 'Return request initiated by maintenance department' },
      { status: 'Under Review', date: '2026-01-24', time: '11:30 AM', type: 'warning', description: 'Operations manager reviewing the request' },
      { status: 'Approved', date: '2026-01-24', time: '01:00 PM', type: 'success', description: 'Request approved for processing' },
      { status: 'Vendor Notified', date: '2026-01-24', time: '03:30 PM', type: 'info', description: 'Vendor contacted for pickup arrangement' }
    ]
  },
  {
    id: 'RET-2026-009',
    returnType: 'internal',
    requester: 'Lakshmi Priya',
    department: 'Admin Department',
    products: 'A4 Paper - 10 reams, Printer Ink Cartridges (HP 680) - 5 units, Stapler - 3 units',
    reasonTitle: 'Excess stock',
    reasonDetails: 'Department ordered more stationery than required due to calculation error. Items are unused and in original packaging.',
    returnDate: '2026-01-23',
    status: 'pending',
    replacementNeeded: false,
    refundNeeded: false,
    differentProduct: false,
    replacementProduct: null,
    linkedRequest: 'REQ-2026-018',
    linkedPO: null,
    proofImages: null,
    pickupInfo: 'Inter-department transfer to central store',
    createdBy: 'Admin Officer - Lakshmi Priya',
    approvedBy: null,
    timeline: [
      { status: 'Request Created', date: '2026-01-23', time: '09:45 AM', type: 'info', description: 'Internal return request submitted' }
    ]
  },
  {
    id: 'RET-2026-008',
    returnType: 'purchase',
    requester: 'Vendor - Krishna Agencies',
    department: 'Packaging Supplies Ltd',
    products: 'Corrugated Carton Boxes (Large) - 200 units, Bubble Wrap Rolls - 50 rolls, Packing Tape - 30 rolls',
    reasonTitle: 'Damaged packaging',
    reasonDetails: 'Boxes arrived crushed and damaged during transit. Bubble wrap rolls are torn and unusable. Quality does not meet standards.',
    returnDate: '2026-01-22',
    status: 'pending',
    replacementNeeded: true,
    refundNeeded: false,
    differentProduct: false,
    replacementProduct: 'New Corrugated Carton Boxes (Large) - 200 units, Bubble Wrap Rolls - 50 rolls',
    linkedRequest: null,
    linkedPO: 'PO-2026-095',
    proofImages: 'damaged_boxes_1.jpg, damaged_boxes_2.jpg, torn_wrap.jpg',
    pickupInfo: 'Awaiting vendor confirmation for pickup',
    createdBy: 'Warehouse Supervisor - Krishna',
    approvedBy: null,
    timeline: [
      { status: 'Request Created', date: '2026-01-22', time: '02:30 PM', type: 'info', description: 'Damage identified during quality check' }
    ]
  },
  {
    id: 'RET-2026-007',
    returnType: 'internal',
    requester: 'Rajesh Kumar',
    department: 'Electrical Maintenance',
    products: 'Power Drill Machine - 2 units, Extension Cable 10m - 5 units, Cable Ties - 100 pack',
    reasonTitle: 'Damaged on arrival',
    reasonDetails: 'Cable insulation was cracked during internal transportation. Drill machines show signs of mishandling with scratched casing.',
    returnDate: '2026-01-20',
    status: 'pending',
    replacementNeeded: true,
    refundNeeded: false,
    differentProduct: false,
    replacementProduct: 'Power Drill Machine (Model D450) - 2 units, Extension Cable 10m - 5 units',
    linkedRequest: 'REQ-2026-014',
    linkedPO: null,
    proofImages: 'cracked_cable_1.jpg, damaged_drill.jpg',
    pickupInfo: 'Return to central warehouse - Gate 2',
    createdBy: 'Electrician - Rajesh Kumar',
    approvedBy: null,
    timeline: [
      { status: 'Request Created', date: '2026-01-20', time: '10:30 AM', type: 'info', description: 'Damage reported by electrical team' }
    ]
  },
  {
    id: 'RET-2026-006',
    returnType: 'purchase',
    requester: 'Vendor - Prem Construction',
    department: 'Building Materials Co',
    products: 'Portland Cement - 50 bags (50kg each), TMT Steel Rods (12mm) - 20 units, River Sand - 2 tons',
    reasonTitle: 'Wrong quantity delivered',
    reasonDetails: 'Ordered 50 bags of cement but received only 30 bags. Steel rods count is also short by 5 units. Delivery mismatch with invoice.',
    returnDate: '2026-01-18',
    status: 'in-progress',
    replacementNeeded: false,
    refundNeeded: true,
    differentProduct: false,
    replacementProduct: null,
    linkedRequest: null,
    linkedPO: 'PO-2026-089',
    proofImages: 'delivery_invoice.jpg, received_stock.jpg',
    pickupInfo: 'Vendor pickup scheduled - Jan 19, 2026',
    createdBy: 'Site Engineer - Prem Kumar',
    approvedBy: 'Purchase Manager - Anitha',
    timeline: [
      { status: 'Request Created', date: '2026-01-18', time: '09:15 AM', type: 'info', description: 'Quantity mismatch identified' },
      { status: 'Approved', date: '2026-01-18', time: '11:30 AM', type: 'success', description: 'Approved for refund processing' },
      { status: 'Vendor Notified', date: '2026-01-18', time: '02:00 PM', type: 'info', description: 'Vendor contacted for resolution' }
    ]
  },
  {
    id: 'RET-2026-005',
    returnType: 'internal',
    requester: 'Kumar Swamy',
    department: 'Safety Department',
    products: 'Safety Helmets (ISI Marked) - 10 units, Safety Shoes (Size 9) - 5 pairs, Safety Goggles - 8 units',
    reasonTitle: 'Product defective',
    reasonDetails: 'Helmet chin straps are broken on 5 units. Safety shoes have manufacturing defects with sole separation. Goggles have scratched lenses.',
    returnDate: '2026-01-15',
    status: 'completed',
    replacementNeeded: true,
    refundNeeded: false,
    differentProduct: false,
    replacementProduct: 'Safety Helmets (ISI Marked) - 10 units, Safety Shoes (Size 9) - 5 pairs, Safety Goggles - 8 units',
    linkedRequest: 'REQ-2026-012',
    linkedPO: null,
    proofImages: 'helmet_defect.jpg, shoes_defect.jpg, goggles_scratch.jpg',
    pickupInfo: 'Internal transfer completed',
    createdBy: 'Safety Officer - Kumar Swamy',
    approvedBy: 'Warehouse Manager - Arun',
    timeline: [
      { status: 'Request Created', date: '2026-01-15', time: '08:00 AM', type: 'info', description: 'Defects identified during inspection' },
      { status: 'Approved', date: '2026-01-15', time: '10:30 AM', type: 'success', description: 'Request approved by warehouse manager' },
      { status: 'Replacement Issued', date: '2026-01-16', time: '09:00 AM', type: 'success', description: 'New safety equipment issued' },
      { status: 'Completed', date: '2026-01-16', time: '03:00 PM', type: 'success', description: 'Return process completed' }
    ]
  },
  {
    id: 'RET-2026-004',
    returnType: 'purchase',
    requester: 'Vendor - Ramesh Electricals',
    department: 'Electronics Supplier Co.',
    products: 'LED Bulbs (60W) - 100 units, Modular Switches - 50 units, Extension Boards - 20 units',
    reasonTitle: 'Wrong product sent',
    reasonDetails: 'Ordered 100W LED bulbs but received 60W bulbs instead. Switch color is white instead of ordered ivory. Extension boards are 3-pin instead of 5-pin.',
    returnDate: '2026-01-12',
    status: 'rejected',
    replacementNeeded: false,
    refundNeeded: true,
    differentProduct: true,
    replacementProduct: 'LED Bulbs (100W) - 100 units, Modular Switches (Ivory) - 50 units, Extension Boards (5-pin) - 20 units',
    linkedRequest: null,
    linkedPO: 'PO-2026-078',
    proofImages: 'wrong_product_bulbs.jpg, wrong_switches.jpg',
    pickupInfo: 'Vendor pickup - Declined',
    createdBy: 'Electrician - Ramesh',
    approvedBy: null,
    rejectionReason: 'Products were already installed and used for 2 days before return request. Cannot accept return for used electrical items.',
    timeline: [
      { status: 'Request Created', date: '2026-01-12', time: '11:00 AM', type: 'info', description: 'Wrong product return initiated' },
      { status: 'Under Review', date: '2026-01-12', time: '02:00 PM', type: 'warning', description: 'Quality team reviewing the claim' },
      { status: 'Rejected', date: '2026-01-13', time: '10:00 AM', type: 'error', description: 'Return rejected due to product usage' }
    ]
  },
  {
    id: 'RET-2026-003',
    returnType: 'internal',
    requester: 'Senthil Murugan',
    department: 'Maintenance Tools Store',
    products: 'Combination Wrench Set (8-24mm) - 1 set, Claw Hammer (500g) - 2 units, Measuring Tape (5m) - 3 units',
    reasonTitle: 'Not required',
    reasonDetails: 'Tools not needed for current project phase as project scope changed. Items are unused and in original packaging.',
    returnDate: '2026-01-10',
    status: 'completed',
    replacementNeeded: false,
    refundNeeded: false,
    differentProduct: false,
    replacementProduct: null,
    linkedRequest: 'REQ-2026-008',
    linkedPO: null,
    proofImages: null,
    pickupInfo: 'Returned to central tool room',
    createdBy: 'Maintenance Technician - Senthil',
    approvedBy: 'Tool Room Manager - Vijay',
    timeline: [
      { status: 'Request Created', date: '2026-01-10', time: '03:00 PM', type: 'info', description: 'Return request for unused tools' },
      { status: 'Approved', date: '2026-01-10', time: '04:00 PM', type: 'success', description: 'Approved for tool room return' },
      { status: 'Stock Updated', date: '2026-01-10', time: '05:00 PM', type: 'success', description: 'Inventory updated in system' },
      { status: 'Completed', date: '2026-01-10', time: '05:30 PM', type: 'success', description: 'Tools returned to inventory' }
    ]
  },
  {
    id: 'RET-2026-002',
    returnType: 'purchase',
    requester: 'Vendor - Ganesh Materials',
    department: 'Building Materials Co',
    products: 'Granite Blocks (Polished) - 50 units, Blue Metal (20mm) - 20 tons, M-Sand - 15 tons',
    reasonTitle: 'Quality issues',
    reasonDetails: 'Granite blocks have multiple visible cracks and chips. Blue metal contains excessive dust and impurities. M-sand moisture content is too high.',
    returnDate: '2026-01-08',
    status: 'completed',
    replacementNeeded: true,
    refundNeeded: false,
    differentProduct: false,
    replacementProduct: 'Granite Blocks (Polished, Grade A) - 50 units, Blue Metal (20mm, Washed) - 20 tons',
    linkedRequest: null,
    linkedPO: 'PO-2026-065',
    proofImages: 'granite_cracks.jpg, blue_metal_dust.jpg, msand_moisture.jpg',
    pickupInfo: 'Vendor arranged pickup and replacement delivery',
    createdBy: 'Site Engineer - Ganesh',
    approvedBy: 'Purchase Manager - Deepak',
    timeline: [
      { status: 'Request Created', date: '2026-01-08', time: '09:00 AM', type: 'info', description: 'Quality issues reported' },
      { status: 'Quality Check', date: '2026-01-08', time: '10:30 AM', type: 'warning', description: 'Third-party quality inspection conducted' },
      { status: 'Approved', date: '2026-01-08', time: '11:00 AM', type: 'success', description: 'Return approved based on quality report' },
      { status: 'Vendor Pickup Scheduled', date: '2026-01-09', time: '10:00 AM', type: 'info', description: 'Pickup arranged by vendor' },
      { status: 'Replacement Delivered', date: '2026-01-11', time: '02:00 PM', type: 'success', description: 'New materials delivered and verified' },
      { status: 'Completed', date: '2026-01-11', time: '04:00 PM', type: 'success', description: 'Return and replacement completed' }
    ]
  },
  {
    id: 'RET-2026-001',
    returnType: 'internal',
    requester: 'Muthu Lakshmi',
    department: 'IT Department',
    products: 'Extension Cords (5m) - 5 units, Power Strip (6-socket) - 3 units, Cable Management Box - 2 units',
    reasonTitle: 'Excess stock identified',
    reasonDetails: 'Department has excess electrical accessories after project completion and workstation reorganization. All items are in good condition.',
    returnDate: '2026-01-05',
    status: 'completed',
    replacementNeeded: false,
    refundNeeded: false,
    differentProduct: false,
    replacementProduct: null,
    linkedRequest: null,
    linkedPO: null,
    proofImages: null,
    pickupInfo: 'Self-return to central electrical store',
    createdBy: 'IT Manager - Muthu Lakshmi',
    approvedBy: 'Store Manager - Karthik',
    timeline: [
      { status: 'Request Created', date: '2026-01-05', time: '10:00 AM', type: 'info', description: 'Excess stock return initiated' },
      { status: 'Approved', date: '2026-01-05', time: '11:00 AM', type: 'success', description: 'Return approved by store manager' },
      { status: 'Stock Verified', date: '2026-01-05', time: '01:30 PM', type: 'info', description: 'Items verified for condition and quantity' },
      { status: 'Stock Updated', date: '2026-01-05', time: '02:00 PM', type: 'success', description: 'Inventory system updated' },
      { status: 'Completed', date: '2026-01-05', time: '03:00 PM', type: 'success', description: 'Items added back to store inventory' }
    ]
  },
  {
    id: 'RET-2026-011',
    returnType: 'purchase',
    requester: 'Vendor - Tamil Paints',
    department: 'Paint & Hardware Suppliers',
    products: 'Asian Paints Apex (White) - 20 ltrs, Putty - 15 bags, Paint Brushes - 25 units',
    reasonTitle: 'Expired products',
    reasonDetails: 'Paint manufacturing date shows product is 18 months old, close to expiry. Putty bags are hardened. Not suitable for use.',
    returnDate: '2026-01-21',
    status: 'pending',
    replacementNeeded: true,
    refundNeeded: false,
    differentProduct: false,
    replacementProduct: 'Asian Paints Apex (White, Fresh Stock) - 20 ltrs, Putty (Fresh) - 15 bags',
    linkedRequest: null,
    linkedPO: 'PO-2026-102',
    proofImages: 'paint_expiry.jpg, hardened_putty.jpg',
    pickupInfo: 'Awaiting vendor response',
    createdBy: 'Painting Contractor - Tamil',
    approvedBy: null,
    timeline: [
      { status: 'Request Created', date: '2026-01-21', time: '03:45 PM', type: 'info', description: 'Expiry issue identified' }
    ]
  },
  {
    id: 'RET-2026-012',
    returnType: 'internal',
    requester: 'Priya Dharshini',
    department: 'Production Department',
    products: 'Cutting Blades - 50 units, Grinding Wheels - 20 units, Safety Gloves - 30 pairs',
    reasonTitle: 'Wrong specifications',
    reasonDetails: 'Received 4-inch cutting blades instead of ordered 6-inch. Grinding wheels are 80 grit instead of 120 grit required.',
    returnDate: '2026-01-19',
    status: 'in-progress',
    replacementNeeded: true,
    refundNeeded: false,
    differentProduct: false,
    replacementProduct: 'Cutting Blades (6-inch) - 50 units, Grinding Wheels (120 grit) - 20 units',
    linkedRequest: 'REQ-2026-019',
    linkedPO: null,
    proofImages: 'wrong_blade_size.jpg, wrong_grit.jpg',
    pickupInfo: 'Inter-department exchange in progress',
    createdBy: 'Production Supervisor - Priya',
    approvedBy: 'Production Manager - Saravanan',
    timeline: [
      { status: 'Request Created', date: '2026-01-19', time: '08:30 AM', type: 'info', description: 'Specification mismatch reported' },
      { status: 'Approved', date: '2026-01-19', time: '10:15 AM', type: 'success', description: 'Approved for replacement' },
      { status: 'Replacement Ordered', date: '2026-01-19', time: '02:00 PM', type: 'info', description: 'Correct items ordered from warehouse' }
    ]
  }
];

// ==========================================================================
// CUSTOM HOOK - useReturnReplacementData
// ==========================================================================
export const useReturnReplacementData = () => {
  // State Management
  const [returns, setReturns] = useState(INITIAL_RETURNS_DATA);
  const [currentFilter, setCurrentFilter] = useState('all');
  const [currentTypeFilter, setCurrentTypeFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('date-desc');

  // Calculate Statistics
  const stats = useMemo(() => {
    const total = returns.length;
    const pending = returns.filter(r => r.status === 'pending').length;
    const inProgress = returns.filter(r => r.status === 'in-progress').length;
    const completed = returns.filter(r => r.status === 'completed').length;
    const rejected = returns.filter(r => r.status === 'rejected').length;

    // Calculate this month and this week
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const thisMonth = returns.filter(r => {
      const date = new Date(r.returnDate);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    }).length;

    const thisWeek = returns.filter(r => {
      const date = new Date(r.returnDate);
      return date >= oneWeekAgo && r.status === 'completed';
    }).length;

    const rejectionRate = total > 0 ? ((rejected / total) * 100).toFixed(1) : 0;

    return [
      {
        label: 'Total Returns',
        value: total,
        icon: 'fas fa-undo',
        type: 'primary',
        badgeIcon: 'fas fa-calendar-alt',
        badgeText: `${thisMonth} this month`,
        badgeType: 'info'
      },
      {
        label: 'Pending Returns',
        value: pending,
        icon: 'fas fa-clock',
        type: 'warning',
        badgeIcon: 'fas fa-exclamation-circle',
        badgeText: 'Needs attention',
        badgeType: 'warning'
      },
      {
        label: 'In Progress',
        value: inProgress,
        icon: 'fas fa-spinner',
        type: 'info',
        badgeIcon: 'fas fa-tasks',
        badgeText: 'Being processed',
        badgeType: 'info'
      },
      {
        label: 'Completed',
        value: completed,
        icon: 'fas fa-check-circle',
        type: 'success',
        badgeIcon: 'fas fa-check',
        badgeText: `${thisWeek} this week`,
        badgeType: 'success'
      },
      {
        label: 'Rejected',
        value: rejected,
        icon: 'fas fa-times-circle',
        type: 'danger',
        badgeIcon: 'fas fa-ban',
        badgeText: `${rejectionRate}% rejection rate`,
        badgeType: 'danger'
      }
    ];
  }, [returns]);

  // Get Filtered Returns
  const getFilteredReturns = () => {
    let filtered = [...returns];

    // Filter by status
    if (currentFilter !== 'all') {
      filtered = filtered.filter(r => r.status === currentFilter);
    }

    // Filter by type
    if (currentTypeFilter !== 'all') {
      filtered = filtered.filter(r => r.returnType === currentTypeFilter);
    }

    // Search filter
    if (searchQuery.trim()) {
      const search = searchQuery.toLowerCase();
      filtered = filtered.filter(r => {
        return (
          r.id.toLowerCase().includes(search) ||
          r.requester.toLowerCase().includes(search) ||
          r.products.toLowerCase().includes(search) ||
          r.reasonTitle.toLowerCase().includes(search) ||
          r.department.toLowerCase().includes(search) ||
          r.reasonDetails.toLowerCase().includes(search)
        );
      });
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortOrder) {
        case 'date-desc':
          return new Date(b.returnDate) - new Date(a.returnDate);
        case 'date-asc':
          return new Date(a.returnDate) - new Date(b.returnDate);
        case 'id-desc':
          return b.id.localeCompare(a.id);
        case 'id-asc':
          return a.id.localeCompare(b.id);
        default:
          return 0;
      }
    });

    return filtered;
  };

  // Reset All Filters
  const resetFilters = () => {
    setCurrentFilter('all');
    setCurrentTypeFilter('all');
    setSearchQuery('');
    setSortOrder('date-desc');
  };

  // Get Return by ID
  const getReturnById = (returnId) => {
    return returns.find(r => r.id === returnId);
  };

  // Get Returns by Status
  const getReturnsByStatus = (status) => {
    return returns.filter(r => r.status === status);
  };

  // Get Returns by Type
  const getReturnsByType = (type) => {
    return returns.filter(r => r.returnType === type);
  };

  // Get Returns by Requester
  const getReturnsByRequester = (requester) => {
    return returns.filter(r => 
      r.requester.toLowerCase().includes(requester.toLowerCase())
    );
  };

  // Get Returns with Replacement
  const getReturnsWithReplacement = () => {
    return returns.filter(r => r.replacementNeeded);
  };

  // Get Returns with Refund
  const getReturnsWithRefund = () => {
    return returns.filter(r => r.refundNeeded);
  };

  // Get Pending Returns Count
  const getPendingReturnsCount = () => {
    return returns.filter(r => r.status === 'pending').length;
  };

  // Get Completed Returns Count
  const getCompletedReturnsCount = () => {
    return returns.filter(r => r.status === 'completed').length;
  };

  // Get Returns by Date Range
  const getReturnsByDateRange = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    return returns.filter(r => {
      const returnDate = new Date(r.returnDate);
      return returnDate >= start && returnDate <= end;
    });
  };

  // Get Status Distribution
  const getStatusDistribution = () => {
    const distribution = {
      pending: 0,
      'in-progress': 0,
      completed: 0,
      rejected: 0
    };

    returns.forEach(ret => {
      if (distribution.hasOwnProperty(ret.status)) {
        distribution[ret.status]++;
      }
    });

    return distribution;
  };

  // Get Type Distribution
  const getTypeDistribution = () => {
    const distribution = {
      internal: 0,
      purchase: 0
    };

    returns.forEach(ret => {
      distribution[ret.returnType]++;
    });

    return distribution;
  };

  // Get Reason Distribution
  const getReasonDistribution = () => {
    const distribution = {};

    returns.forEach(ret => {
      if (ret.reasonTitle) {
        distribution[ret.reasonTitle] = (distribution[ret.reasonTitle] || 0) + 1;
      }
    });

    return distribution;
  };

  // Get Recent Returns (last 7 days)
  const getRecentReturns = () => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    return returns.filter(r => new Date(r.returnDate) >= sevenDaysAgo)
      .sort((a, b) => new Date(b.returnDate) - new Date(a.returnDate));
  };

  // Get Returns This Month
  const getReturnsThisMonth = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return returns.filter(r => {
      const date = new Date(r.returnDate);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });
  };

  // Get Average Resolution Time (for completed returns)
  const getAverageResolutionTime = () => {
    const completedReturns = returns.filter(r => r.status === 'completed');
    
    if (completedReturns.length === 0) return 0;

    const totalDays = completedReturns.reduce((sum, ret) => {
      const timeline = ret.timeline;
      const createdDate = new Date(timeline[0].date);
      const completedEvent = timeline[timeline.length - 1];
      const completedDate = new Date(completedEvent.date);
      const daysDiff = Math.ceil((completedDate - createdDate) / (1000 * 60 * 60 * 24));
      return sum + daysDiff;
    }, 0);

    return (totalDays / completedReturns.length).toFixed(1);
  };

  // Export Returns Data (for CSV)
  const exportReturnsData = () => {
    return returns.map(ret => ({
      'Return ID': ret.id,
      'Type': ret.returnType === 'internal' ? 'Internal' : 'Purchase',
      'Requester': ret.requester,
      'Department/Vendor': ret.department,
      'Products': ret.products,
      'Reason': ret.reasonTitle,
      'Return Date': ret.returnDate,
      'Status': ret.status,
      'Replacement Needed': ret.replacementNeeded ? 'Yes' : 'No',
      'Refund Needed': ret.refundNeeded ? 'Yes' : 'No',
      'Created By': ret.createdBy,
      'Approved By': ret.approvedBy || 'Pending',
      'Linked PO': ret.linkedPO || '-',
      'Linked Request': ret.linkedRequest || '-'
    }));
  };

  // Check if return ID exists
  const returnIdExists = (returnId) => {
    return returns.some(r => r.id === returnId);
  };

  // Get Next Return ID
  const getNextReturnId = () => {
    const year = new Date().getFullYear();
    const yearReturns = returns.filter(r => r.id.startsWith(`RET-${year}-`));
    
    if (yearReturns.length === 0) {
      return `RET-${year}-001`;
    }

    const lastNumber = Math.max(...yearReturns.map(r => 
      parseInt(r.id.split('-')[2])
    ));

    return `RET-${year}-${String(lastNumber + 1).padStart(3, '0')}`;
  };

  // Return all data and functions
  return {
    // State
    returns,
    setReturns,
    stats,
    
    // Filters
    currentFilter,
    setCurrentFilter,
    currentTypeFilter,
    setCurrentTypeFilter,
    searchQuery,
    setSearchQuery,
    sortOrder,
    setSortOrder,
    
    // Functions
    getFilteredReturns,
    resetFilters,
    getReturnById,
    getReturnsByStatus,
    getReturnsByType,
    getReturnsByRequester,
    getReturnsWithReplacement,
    getReturnsWithRefund,
    getPendingReturnsCount,
    getCompletedReturnsCount,
    getReturnsByDateRange,
    getStatusDistribution,
    getTypeDistribution,
    getReasonDistribution,
    getRecentReturns,
    getReturnsThisMonth,
    getAverageResolutionTime,
    exportReturnsData,
    returnIdExists,
    getNextReturnId
  };
};

export default useReturnReplacementData;
