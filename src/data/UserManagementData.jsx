// src/data/UserManagementData.jsx
import { useState, useMemo } from 'react';

// ==========================================================================
// INITIAL USER DATA
// ==========================================================================
const USERS_DATA = [
  {
    id: 1,
    fullName: 'Rajesh Kumar',
    email: 'rajesh.kumar@company.com',
    username: 'rajesh.admin',
    password: 'Admin@123',
    phoneNumber: '+91 98765 00001',
    employeeId: 'EMP-001',
    role: 'admin',
    department: 'administration',
    assignedPlant: null,
    reportingTo: null,
    status: 'active',
    isActive: true,
    sendWelcomeEmail: false,
    forcePasswordChange: false,
    twoFactorAuth: true,
    createdDate: '2024-01-15',
    lastLogin: '2026-02-03 09:30 AM',
    createdBy: 'Master Admin'
  },
  {
    id: 2,
    fullName: 'Priya Sharma',
    email: 'priya.sharma@company.com',
    username: 'priya.manager',
    password: 'Manager@123',
    phoneNumber: '+91 98765 00002',
    employeeId: 'EMP-002',
    role: 'inventory_manager',
    department: 'logistics',
    assignedPlant: null,
    reportingTo: 1,
    status: 'active',
    isActive: true,
    sendWelcomeEmail: true,
    forcePasswordChange: false,
    twoFactorAuth: true,
    createdDate: '2024-02-10',
    lastLogin: '2026-02-03 10:15 AM',
    createdBy: 'Rajesh Kumar'
  },
  {
    id: 3,
    fullName: 'Kumar Raman',
    email: 'kumar.raman@company.com',
    username: 'kumar.storekeeper',
    password: 'Store@123',
    phoneNumber: '+91 98765 00003',
    employeeId: 'EMP-003',
    role: 'storekeeper',
    department: 'logistics',
    assignedPlant: null,
    reportingTo: 2,
    status: 'active',
    isActive: true,
    sendWelcomeEmail: true,
    forcePasswordChange: true,
    twoFactorAuth: false,
    createdDate: '2024-03-05',
    lastLogin: '2026-02-03 08:45 AM',
    createdBy: 'Priya Sharma'
  },
  {
    id: 4,
    fullName: 'Arun Prakash',
    email: 'arun.prakash@company.com',
    username: 'arun.requester',
    password: 'Request@123',
    phoneNumber: '+91 98765 00004',
    employeeId: 'EMP-004',
    role: 'requester',
    department: 'production',
    assignedPlant: 1,
    reportingTo: 2,
    status: 'active',
    isActive: true,
    sendWelcomeEmail: true,
    forcePasswordChange: true,
    twoFactorAuth: false,
    createdDate: '2024-04-12',
    lastLogin: '2026-02-02 05:30 PM',
    createdBy: 'Priya Sharma'
  },
  {
    id: 5,
    fullName: 'Deepa Reddy',
    email: 'deepa.reddy@company.com',
    username: 'deepa.manager',
    password: 'Manager@456',
    phoneNumber: '+91 98765 00005',
    employeeId: 'EMP-005',
    role: 'inventory_manager',
    department: 'logistics',
    assignedPlant: null,
    reportingTo: 1,
    status: 'active',
    isActive: true,
    sendWelcomeEmail: true,
    forcePasswordChange: false,
    twoFactorAuth: true,
    createdDate: '2024-05-20',
    lastLogin: '2026-02-03 11:00 AM',
    createdBy: 'Rajesh Kumar'
  },
  {
    id: 6,
    fullName: 'Sundar Pichai',
    email: 'sundar.pichai@company.com',
    username: 'sundar.storekeeper',
    password: 'Store@456',
    phoneNumber: '+91 98765 00006',
    employeeId: 'EMP-006',
    role: 'storekeeper',
    department: 'logistics',
    assignedPlant: null,
    reportingTo: 5,
    status: 'active',
    isActive: true,
    sendWelcomeEmail: true,
    forcePasswordChange: true,
    twoFactorAuth: false,
    createdDate: '2024-06-15',
    lastLogin: '2026-02-03 07:20 AM',
    createdBy: 'Deepa Reddy'
  },
  {
    id: 7,
    fullName: 'Lakshmi Narayanan',
    email: 'lakshmi.n@company.com',
    username: 'lakshmi.requester',
    password: 'Request@456',
    phoneNumber: '+91 98765 00007',
    employeeId: 'EMP-007',
    role: 'requester',
    department: 'maintenance',
    assignedPlant: 2,
    reportingTo: 5,
    status: 'active',
    isActive: true,
    sendWelcomeEmail: true,
    forcePasswordChange: true,
    twoFactorAuth: false,
    createdDate: '2024-07-22',
    lastLogin: '2026-02-01 03:45 PM',
    createdBy: 'Deepa Reddy'
  },
  {
    id: 8,
    fullName: 'Venkat Subramanian',
    email: 'venkat.sub@company.com',
    username: 'venkat.requester',
    password: 'Request@789',
    phoneNumber: '+91 98765 00008',
    employeeId: 'EMP-008',
    role: 'requester',
    department: 'quality',
    assignedPlant: 1,
    reportingTo: 2,
    status: 'active',
    isActive: true,
    sendWelcomeEmail: true,
    forcePasswordChange: true,
    twoFactorAuth: false,
    createdDate: '2024-08-10',
    lastLogin: '2026-02-03 09:00 AM',
    createdBy: 'Priya Sharma'
  },
  {
    id: 9,
    fullName: 'Meena Krishnan',
    email: 'meena.krishnan@company.com',
    username: 'meena.storekeeper',
    password: 'Store@789',
    phoneNumber: '+91 98765 00009',
    employeeId: 'EMP-009',
    role: 'storekeeper',
    department: 'logistics',
    assignedPlant: null,
    reportingTo: 2,
    status: 'blocked',
    isActive: false,
    sendWelcomeEmail: true,
    forcePasswordChange: false,
    twoFactorAuth: false,
    createdDate: '2024-09-05',
    lastLogin: '2026-01-15 02:30 PM',
    createdBy: 'Priya Sharma'
  },
  {
    id: 10,
    fullName: 'Ramesh Babu',
    email: 'ramesh.babu@company.com',
    username: 'ramesh.requester',
    password: 'Request@101',
    phoneNumber: '+91 98765 00010',
    employeeId: 'EMP-010',
    role: 'requester',
    department: 'production',
    assignedPlant: 2,
    reportingTo: 5,
    status: 'active',
    isActive: true,
    sendWelcomeEmail: true,
    forcePasswordChange: true,
    twoFactorAuth: false,
    createdDate: '2024-10-18',
    lastLogin: '2026-02-02 04:15 PM',
    createdBy: 'Deepa Reddy'
  },
  {
    id: 11,
    fullName: 'Anjali Mehta',
    email: 'anjali.mehta@company.com',
    username: 'anjali.requester',
    password: 'Request@202',
    phoneNumber: '+91 98765 00011',
    employeeId: 'EMP-011',
    role: 'requester',
    department: 'it',
    assignedPlant: 1,
    reportingTo: 2,
    status: 'inactive',
    isActive: false,
    sendWelcomeEmail: true,
    forcePasswordChange: true,
    twoFactorAuth: false,
    createdDate: '2024-11-25',
    lastLogin: 'Never',
    createdBy: 'Priya Sharma'
  },
  {
    id: 12,
    fullName: 'Karthik Swaminathan',
    email: 'karthik.s@company.com',
    username: 'karthik.storekeeper',
    password: 'Store@202',
    phoneNumber: '+91 98765 00012',
    employeeId: 'EMP-012',
    role: 'storekeeper',
    department: 'logistics',
    assignedPlant: null,
    reportingTo: 5,
    status: 'active',
    isActive: true,
    sendWelcomeEmail: true,
    forcePasswordChange: true,
    twoFactorAuth: false,
    createdDate: '2024-12-08',
    lastLogin: '2026-02-03 06:50 AM',
    createdBy: 'Deepa Reddy'
  },
  {
    id: 13,
    fullName: 'Divya Iyer',
    email: 'divya.iyer@company.com',
    username: 'divya.requester',
    password: 'Request@303',
    phoneNumber: '+91 98765 00013',
    employeeId: 'EMP-013',
    role: 'requester',
    department: 'quality',
    assignedPlant: 2,
    reportingTo: 5,
    status: 'active',
    isActive: true,
    sendWelcomeEmail: true,
    forcePasswordChange: true,
    twoFactorAuth: false,
    createdDate: '2025-01-14',
    lastLogin: '2026-02-03 10:30 AM',
    createdBy: 'Deepa Reddy'
  },
  {
    id: 14,
    fullName: 'Naveen Kumar',
    email: 'naveen.kumar@company.com',
    username: 'naveen.requester',
    password: 'Request@404',
    phoneNumber: '+91 98765 00014',
    employeeId: 'EMP-014',
    role: 'requester',
    department: 'maintenance',
    assignedPlant: 1,
    reportingTo: 2,
    status: 'active',
    isActive: true,
    sendWelcomeEmail: true,
    forcePasswordChange: true,
    twoFactorAuth: false,
    createdDate: '2025-02-20',
    lastLogin: '2026-02-01 01:20 PM',
    createdBy: 'Priya Sharma'
  },
  {
    id: 15,
    fullName: 'Sangeetha Rajan',
    email: 'sangeetha.rajan@company.com',
    username: 'sangeetha.admin',
    password: 'Admin@789',
    phoneNumber: '+91 98765 00015',
    employeeId: 'EMP-015',
    role: 'admin',
    department: 'administration',
    assignedPlant: null,
    reportingTo: null,
    status: 'active',
    isActive: true,
    sendWelcomeEmail: true,
    forcePasswordChange: false,
    twoFactorAuth: true,
    createdDate: '2025-03-10',
    lastLogin: '2026-02-03 08:15 AM',
    createdBy: 'Rajesh Kumar'
  }
];

// ==========================================================================
// INITIAL PLANT DATA
// ==========================================================================
const PLANTS_DATA = [
  {
    id: 1,
    plantName: 'Manufacturing Plant 1',
    plantCode: 'PLT-001',
    plantLocation: 'Chennai, Tamil Nadu',
    plantManager: 'Rajesh Kumar',
    plantContact: '+91 98765 43210',
    plantCapacity: '1000 units/day',
    createdDate: '2024-01-15',
    isActive: true
  },
  {
    id: 2,
    plantName: 'Assembly Unit 2',
    plantCode: 'PLT-002',
    plantLocation: 'Bangalore, Karnataka',
    plantManager: 'Priya Sharma',
    plantContact: '+91 98765 43211',
    plantCapacity: '800 units/day',
    createdDate: '2024-02-10',
    isActive: true
  },
  {
    id: 3,
    plantName: 'Production Facility 3',
    plantCode: 'PLT-003',
    plantLocation: 'Coimbatore, Tamil Nadu',
    plantManager: 'Deepa Reddy',
    plantContact: '+91 98765 43212',
    plantCapacity: '1200 units/day',
    createdDate: '2024-03-20',
    isActive: true
  },
  {
    id: 4,
    plantName: 'Distribution Center',
    plantCode: 'PLT-004',
    plantLocation: 'Hyderabad, Telangana',
    plantManager: 'Venkat Subramanian',
    plantContact: '+91 98765 43213',
    plantCapacity: '500 units/day',
    createdDate: '2024-04-15',
    isActive: true
  }
];

// ==========================================================================
// CUSTOM HOOK - useUserManagementData
// ==========================================================================
export const useUserManagementData = () => {
  // State Management
  const [users, setUsers] = useState(USERS_DATA);
  const [plants, setPlants] = useState(PLANTS_DATA);
  const [currentRoleFilter, setCurrentRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('');
  const [plantFilter, setPlantFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Calculate Statistics
  const stats = useMemo(() => {
    const totalUsers = users.length;
    const activeUsers = users.filter(u => u.status === 'active').length;
    const blockedUsers = users.filter(u => u.status === 'blocked').length;
    const totalPlants = plants.length;

    // Calculate changes
    const currentMonth = new Date().getMonth();
    const usersThisMonth = users.filter(u => {
      const userMonth = new Date(u.createdDate).getMonth();
      return userMonth === currentMonth;
    }).length;

    return [
      {
        title: 'Total Users',
        value: totalUsers,
        changeText: `+${usersThisMonth} this month`,
        changeType: 'positive',
        icon: 'fas fa-users'
      },
      {
        title: 'Active Users',
        value: activeUsers,
        changeText: `${Math.round((activeUsers / totalUsers) * 100)}% active`,
        changeType: 'positive',
        icon: 'fas fa-user-check'
      },
      {
        title: 'Blocked Users',
        value: blockedUsers,
        changeText: blockedUsers > 0 ? 'Needs review' : 'All clear',
        changeType: blockedUsers > 0 ? 'negative' : 'positive',
        icon: 'fas fa-user-lock'
      },
      {
        title: 'Total Plants',
        value: totalPlants,
        changeText: 'Operational',
        changeType: 'neutral',
        icon: 'fas fa-industry'
      }
    ];
  }, [users, plants]);

  // Get Filtered Users
  const getFilteredUsers = () => {
    let filtered = [...users];

    // Role filter
    if (currentRoleFilter && currentRoleFilter !== 'all') {
      filtered = filtered.filter(u => u.role === currentRoleFilter);
    }

    // Status filter
    if (statusFilter) {
      filtered = filtered.filter(u => u.status === statusFilter);
    }

    // Plant filter
    if (plantFilter) {
      filtered = filtered.filter(u => u.assignedPlant === parseInt(plantFilter));
    }

    // Department filter
    if (departmentFilter) {
      filtered = filtered.filter(u => u.department === departmentFilter);
    }

    // Search filter
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        user =>
          user.fullName.toLowerCase().includes(search) ||
          user.email.toLowerCase().includes(search) ||
          user.username.toLowerCase().includes(search) ||
          (user.employeeId && user.employeeId.toLowerCase().includes(search)) ||
          (user.phoneNumber && user.phoneNumber.includes(search))
      );
    }

    // Sort by creation date (newest first)
    filtered.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));

    return filtered;
  };

  // Reset All Filters
  const resetFilters = () => {
    setCurrentRoleFilter('all');
    setStatusFilter('');
    setPlantFilter('');
    setDepartmentFilter('');
    setSearchTerm('');
  };

  // Get User by ID
  const getUserById = (userId) => {
    return users.find(u => u.id === userId);
  };

  // Get Plant by ID
  const getPlantById = (plantId) => {
    return plants.find(p => p.id === plantId);
  };

  // Get Users by Role
  const getUsersByRole = (role) => {
    return users.filter(u => u.role === role);
  };

  // Get Users by Plant
  const getUsersByPlant = (plantId) => {
    return users.filter(u => u.assignedPlant === plantId);
  };

  // Get Users by Department
  const getUsersByDepartment = (department) => {
    return users.filter(u => u.department === department);
  };

  // Get Active Users Count
  const getActiveUsersCount = () => {
    return users.filter(u => u.status === 'active').length;
  };

  // Get Blocked Users Count
  const getBlockedUsersCount = () => {
    return users.filter(u => u.status === 'blocked').length;
  };

  // Check if Email Exists
  const emailExists = (email, excludeUserId = null) => {
    return users.some(u => u.email === email && u.id !== excludeUserId);
  };

  // Check if Username Exists
  const usernameExists = (username, excludeUserId = null) => {
    return users.some(u => u.username === username && u.id !== excludeUserId);
  };

  // Check if Employee ID Exists
  const employeeIdExists = (employeeId, excludeUserId = null) => {
    return users.some(u => u.employeeId === employeeId && u.id !== excludeUserId);
  };

  // Check if Plant Code Exists
  const plantCodeExists = (plantCode, excludePlantId = null) => {
    return plants.some(p => p.plantCode === plantCode && p.id !== excludePlantId);
  };

  // Get Role Distribution
  const getRoleDistribution = () => {
    const distribution = {
      admin: 0,
      inventory_manager: 0,
      storekeeper: 0,
      requester: 0
    };

    users.forEach(user => {
      if (distribution.hasOwnProperty(user.role)) {
        distribution[user.role]++;
      }
    });

    return distribution;
  };

  // Get Department Distribution
  const getDepartmentDistribution = () => {
    const distribution = {};

    users.forEach(user => {
      if (user.department) {
        distribution[user.department] = (distribution[user.department] || 0) + 1;
      }
    });

    return distribution;
  };

  // Get Plant Distribution
  const getPlantDistribution = () => {
    const distribution = {};

    users.forEach(user => {
      if (user.assignedPlant) {
        const plant = getPlantById(user.assignedPlant);
        if (plant) {
          distribution[plant.plantName] = (distribution[plant.plantName] || 0) + 1;
        }
      }
    });

    return distribution;
  };

  // Get Recent Users (last 7 days)
  const getRecentUsers = () => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    return users.filter(u => new Date(u.createdDate) >= sevenDaysAgo)
      .sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
  };

  // Get Users with 2FA Enabled
  const getUsersWith2FA = () => {
    return users.filter(u => u.twoFactorAuth);
  };

  // Get Users Needing Password Change
  const getUsersNeedingPasswordChange = () => {
    return users.filter(u => u.forcePasswordChange && u.status === 'active');
  };

  // Export Users Data (for download)
  const exportUsersData = () => {
    return users.map(user => ({
      'Employee ID': user.employeeId,
      'Full Name': user.fullName,
      'Email': user.email,
      'Username': user.username,
      'Phone': user.phoneNumber,
      'Role': user.role,
      'Department': user.department || '-',
      'Assigned Plant': user.assignedPlant ? getPlantById(user.assignedPlant)?.plantName : '-',
      'Status': user.status,
      'Created Date': user.createdDate,
      'Last Login': user.lastLogin,
      '2FA Enabled': user.twoFactorAuth ? 'Yes' : 'No'
    }));
  };

  // Export Plants Data (for download)
  const exportPlantsData = () => {
    return plants.map(plant => ({
      'Plant Code': plant.plantCode,
      'Plant Name': plant.plantName,
      'Location': plant.plantLocation,
      'Manager': plant.plantManager || '-',
      'Contact': plant.plantContact || '-',
      'Capacity': plant.plantCapacity || '-',
      'Users Assigned': getUsersByPlant(plant.id).length,
      'Created Date': plant.createdDate
    }));
  };

  // Return all data and functions
  return {
    // State
    users,
    setUsers,
    plants,
    setPlants,
    stats,
    
    // Filters
    currentRoleFilter,
    setCurrentRoleFilter,
    statusFilter,
    setStatusFilter,
    plantFilter,
    setPlantFilter,
    departmentFilter,
    setDepartmentFilter,
    searchTerm,
    setSearchTerm,
    
    // Functions
    getFilteredUsers,
    resetFilters,
    getUserById,
    getPlantById,
    getUsersByRole,
    getUsersByPlant,
    getUsersByDepartment,
    getActiveUsersCount,
    getBlockedUsersCount,
    emailExists,
    usernameExists,
    employeeIdExists,
    plantCodeExists,
    getRoleDistribution,
    getDepartmentDistribution,
    getPlantDistribution,
    getRecentUsers,
    getUsersWith2FA,
    getUsersNeedingPasswordChange,
    exportUsersData,
    exportPlantsData
  };
};

export default useUserManagementData;
