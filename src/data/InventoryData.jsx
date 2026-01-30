// src/pages/inventoryData.jsx
import { useState, useMemo } from 'react';

// Dummy Data - Stock Movements
const dummyStockData = [
  {
    id: 1,
    productName: 'Wireless Headphones',
    sku: 'SKU-001',
    operationType: 'in',
    quantity: 50,
    reason: 'Purchase Order',
    reasonDetail: 'New shipment from vendor',
    keeper: 'John Smith',
    keeperId: 'WK-001',
    time: 'Dec 29, 2025, 10:30 AM',
    timeAgo: '30m ago',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop',
    phone: '+1 234-567-8900',
    vendor: 'Tech Supplies Inc.',
    category: 'Electronics',
    unitPrice: 2500,
    totalValue: 125000
  },
  {
    id: 2,
    productName: 'Ergonomic Office Chair',
    sku: 'SKU-002',
    operationType: 'out',
    quantity: 15,
    reason: 'Customer Order',
    reasonDetail: 'Customer order fulfillment',
    keeper: 'Sarah Johnson',
    keeperId: 'WK-002',
    time: 'Dec 29, 2025, 09:15 AM',
    timeAgo: '2h ago',
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=200&h=200&fit=crop',
    phone: '+1 234-567-8901',
    vendor: 'Office Furniture Co.',
    category: 'Furniture',
    unitPrice: 8500,
    totalValue: 127500
  },
  {
    id: 3,
    productName: 'Dell Laptop 15 inch',
    sku: 'SKU-003',
    operationType: 'in',
    quantity: 25,
    reason: 'Purchase Order',
    reasonDetail: 'Vendor purchase order received',
    keeper: 'Michael Brown',
    keeperId: 'WK-003',
    time: 'Dec 28, 2025, 04:45 PM',
    timeAgo: '1d ago',
    image: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=200&h=200&fit=crop',
    phone: '+1 234-567-8902',
    vendor: 'Dell Technologies',
    category: 'Electronics',
    unitPrice: 52000,
    totalValue: 1300000
  },
  {
    id: 4,
    productName: 'Stainless Steel Water Bottle',
    sku: 'SKU-004',
    operationType: 'in',
    quantity: 100,
    reason: 'Replenishment',
    reasonDetail: 'Replenishment order',
    keeper: 'Emily Davis',
    keeperId: 'WK-004',
    time: 'Dec 28, 2025, 02:20 PM',
    timeAgo: '1d ago',
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=200&h=200&fit=crop',
    phone: '+1 234-567-8903',
    vendor: 'EcoBottle Inc.',
    category: 'Accessories',
    unitPrice: 450,
    totalValue: 45000
  },
  {
    id: 5,
    productName: 'Nike Running Shoes',
    sku: 'SKU-005',
    operationType: 'out',
    quantity: 30,
    reason: 'Store Transfer',
    reasonDetail: 'Retail store transfer',
    keeper: 'David Wilson',
    keeperId: 'WK-005',
    time: 'Dec 27, 2025, 11:00 AM',
    timeAgo: '2d ago',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop',
    phone: '+1 234-567-8904',
    vendor: 'Nike Store',
    category: 'Clothing',
    unitPrice: 6500,
    totalValue: 195000
  }
];

// Dummy Data - Low Stock
const dummyLowStockData = [
  {
    id: 101,
    productName: 'Wireless Mouse',
    sku: 'SKU-101',
    category: 'Electronics',
    currentQty: 5,
    minQty: 20,
    status: 'low',
    time: 'Dec 29, 08:00 AM',
    timeAgo: '9h ago',
    image: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=200&h=200&fit=crop',
    phone: '+1 234-567-9000',
    vendor: 'Logitech',
    unitPrice: 850,
    reorderQty: 50
  },
  {
    id: 102,
    productName: 'Mechanical Keyboard',
    sku: 'SKU-102',
    category: 'Electronics',
    currentQty: 3,
    minQty: 15,
    status: 'low',
    time: 'Dec 28, 03:30 PM',
    timeAgo: '1d ago',
    image: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=200&h=200&fit=crop',
    phone: '+1 234-567-9001',
    vendor: 'Corsair Gaming',
    unitPrice: 4500,
    reorderQty: 30
  },
  {
    id: 103,
    productName: 'Smart Watch Series 5',
    sku: 'SKU-103',
    category: 'Wearables',
    currentQty: 0,
    minQty: 10,
    status: 'critical',
    time: 'Dec 28, 12:00 PM',
    timeAgo: '1d ago',
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=200&h=200&fit=crop',
    phone: '+1 234-567-9002',
    vendor: 'Apple Inc.',
    unitPrice: 28000,
    reorderQty: 25
  },
  {
    id: 104,
    productName: 'USB-C Cable 2m',
    sku: 'SKU-104',
    category: 'Accessories',
    currentQty: 8,
    minQty: 50,
    status: 'low',
    time: 'Dec 27, 05:15 PM',
    timeAgo: '2d ago',
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=200&h=200&fit=crop',
    phone: '+1 234-567-9003',
    vendor: 'Anker',
    unitPrice: 350,
    reorderQty: 100
  }
];

export const useInventoryData = () => {
  const [stockData] = useState(dummyStockData);
  const [lowStockData] = useState(dummyLowStockData);
  const [currentFilter, setCurrentFilter] = useState('all');
  const [currentSearchTerm, setCurrentSearchTerm] = useState('');
  const [advancedFilters, setAdvancedFilters] = useState({
    movementType: '',
    dateFrom: '',
    dateTo: '',
    category: '',
    minQuantity: '',
    maxQuantity: ''
  });

  // Calculate stats
  const stats = useMemo(() => {
    const totalItems = stockData.length;
    const stockIn = stockData.filter(item => item.operationType === 'in').reduce((sum, item) => sum + item.quantity, 0);
    const stockOut = stockData.filter(item => item.operationType === 'out').reduce((sum, item) => sum + item.quantity, 0);
    const lowStockCount = lowStockData.length;

    return [
      {
        title: 'Total Stock Items',
        value: '245',
        change: '+12.5%',
        changeText: '+12.5% from last month',
        icon: 'fas fa-boxes'
      },
      {
        title: 'Stock In (This Month)',
        value: stockIn.toString(),
        change: '+8.3%',
        changeText: '+8.3% from last month',
        icon: 'fas fa-arrow-down'
      },
      {
        title: 'Stock Out (This Month)',
        value: stockOut.toString(),
        change: '+5.2%',
        changeText: '+5.2% from last month',
        icon: 'fas fa-arrow-up'
      },
      {
        title: 'Low Stock Items',
        value: lowStockCount.toString(),
        change: 'warning',
        changeText: 'Needs attention',
        icon: 'fas fa-exclamation-triangle'
      }
    ];
  }, [stockData, lowStockData]);

  // Get filtered data
  const getFilteredData = () => {
    let filtered = currentFilter === 'low' ? lowStockData : stockData;

    // Apply search filter
    if (currentSearchTerm) {
      const searchLower = currentSearchTerm.toLowerCase();
      filtered = filtered.filter(item =>
        item.productName.toLowerCase().includes(searchLower) ||
        item.sku.toLowerCase().includes(searchLower)
      );
    }

    // Apply movement type filter
    if (advancedFilters.movementType && currentFilter !== 'low') {
      filtered = filtered.filter(item => item.operationType === advancedFilters.movementType);
    }

    // Apply quick filter
    if (currentFilter === 'in') {
      filtered = filtered.filter(item => item.operationType === 'in');
    } else if (currentFilter === 'out') {
      filtered = filtered.filter(item => item.operationType === 'out');
    }

    return filtered;
  };

  // Reset all filters
  const resetFilters = () => {
    setCurrentSearchTerm('');
    setAdvancedFilters({
      movementType: '',
      dateFrom: '',
      dateTo: '',
      category: '',
      minQuantity: '',
      maxQuantity: ''
    });
    setCurrentFilter('all');
  };

  return {
    stockData,
    lowStockData,
    stats,
    currentFilter,
    setCurrentFilter,
    currentSearchTerm,
    setCurrentSearchTerm,
    advancedFilters,
    setAdvancedFilters,
    getFilteredData,
    resetFilters
  };
};
