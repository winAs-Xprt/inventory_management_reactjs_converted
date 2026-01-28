import React, { useState, useEffect, useMemo } from 'react';
import {
  DUMMY_PRODUCTS,
  DUMMY_CATEGORIES,
  DUMMY_VENDORS,
  DUMMY_PRODUCT_STATISTICS,
  UNITS_OF_MEASUREMENT,
  calculateProductStats,
  getCategoryName,
  getVendorNames,
  getFilteredProducts,
  validateProductData,
  generateNextProductId,
  generateNextCategoryId,
  formatCurrency,
  determineProductStatus,
  getProductsByCategory,
  PRODUCT_STATUS_CONFIG,
  FILTER_OPTIONS
} from '../data/Productdata';

// ==========================================================================
// CUSTOM SCROLLBAR STYLES
// ==========================================================================
const ScrollbarStyles = () => (
  <style jsx global>{`
    * {
      scrollbar-width: thin;
      scrollbar-color: #0CC0BC #f1f5f9;
    }
    
    *::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }
    
    *::-webkit-scrollbar-track {
      background: #f1f5f9;
      border-radius: 10px;
    }
    
    *::-webkit-scrollbar-thumb {
      background: #0CC0BC;
      border-radius: 10px;
      border: 1px solid #f1f5f9;
    }
    
    *::-webkit-scrollbar-thumb:hover {
      background: #076A70;
    }
  `}</style>
);

// ==========================================================================
// TOAST NOTIFICATION COMPONENT
// ==========================================================================
const Toast = ({ show, message, type }) => {
  if (!show) return null;

  const iconMap = {
    success: 'fa-check-circle',
    error: 'fa-exclamation-circle',
    warning: 'fa-exclamation-triangle',
    info: 'fa-info-circle'
  };

  const bgColorMap = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-blue-500'
  };

  return (
    <div className={`fixed top-5 right-5 ${bgColorMap[type]} text-white px-5 py-3.5 rounded-md flex items-center gap-3 font-semibold text-sm z-[9999] shadow-2xl animate-in slide-in-from-right duration-300`}>
      <i className={`fas ${iconMap[type]} text-lg`}></i>
      <span>{message}</span>
    </div>
  );
};

// ==========================================================================
// CONFIRMATION MODAL COMPONENT
// ==========================================================================
const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, type = 'warning', isDanger = false }) => {
  if (!isOpen) return null;

  const iconMap = {
    success: { icon: 'fa-check-circle', bg: 'bg-green-100', text: 'text-green-500' },
    error: { icon: 'fa-exclamation-circle', bg: 'bg-red-100', text: 'text-red-500' },
    warning: { icon: 'fa-exclamation-triangle', bg: 'bg-yellow-100', text: 'text-yellow-500' },
    info: { icon: 'fa-info-circle', bg: 'bg-blue-100', text: 'text-blue-500' }
  };

  const config = iconMap[type];

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[9998] animate-in fade-in duration-200">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel}></div>
      <div className="relative w-[90%] max-w-md animate-in slide-in-from-bottom duration-300">
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          <div className="flex items-center gap-4 px-6 py-6 border-b-2 border-gray-200 bg-gray-50">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl flex-shrink-0 ${config.bg} ${config.text}`}>
              <i className={`fas ${config.icon}`}></i>
            </div>
            <h3 className="text-xl font-bold text-gray-800 m-0">{title}</h3>
          </div>
          <div className="px-6 py-6">
            <p className="text-sm leading-relaxed text-gray-700 m-0">{message}</p>
          </div>
          <div className="flex gap-3 px-6 py-5 border-t-2 border-gray-200 bg-gray-50">
            <button
              onClick={onCancel}
              className="flex-1 px-5 py-3 bg-gray-50 text-gray-700 border-2 border-gray-200 rounded-md text-sm font-semibold cursor-pointer hover:bg-white hover:border-gray-300 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <i className="fas fa-times"></i>
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className={`flex-1 px-5 py-3 text-white rounded-md text-sm font-semibold cursor-pointer hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 ${
                isDanger ? 'bg-red-500 hover:bg-red-600' : 'bg-teal-500 hover:bg-teal-600'
              }`}
            >
              <i className="fas fa-check"></i>
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================================================
// SIDEBAR COMPONENT
// ==========================================================================
const Sidebar = ({ sidebarOpen, setSidebarOpen, onLogout }) => {
  return (
    <aside
      className={`fixed top-0 left-0 h-screen w-64 bg-white border-r border-gray-200 p-4 z-40 shadow-lg transition-transform duration-300 overflow-y-auto ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}
    >
      <div className="flex items-center justify-center mb-5 pb-4 border-b-2 border-gray-200">
        <a href="/dashboard" className="flex items-center gap-2.5 text-base font-extrabold text-gray-800 no-underline hover:scale-105 transition-transform duration-200">
          <i className="fas fa-boxes text-2xl bg-gradient-to-br from-teal-400 to-teal-700 bg-clip-text text-transparent"></i>
          <span className="bg-gradient-to-br from-teal-400 to-teal-700 bg-clip-text text-transparent">Inventory System</span>
        </a>
      </div>

      <div className="mb-5 relative">
        <div className="relative flex items-center">
          <i className="fas fa-search absolute left-3 text-gray-400 text-sm"></i>
          <input
            type="text"
            placeholder="Search anything..."
            className="w-full py-2.5 px-9 border-2 border-gray-200 rounded-md text-sm text-gray-800 bg-white focus:outline-none focus:border-teal-400 focus:ring-4 focus:ring-cyan-100 transition-all duration-200"
          />
        </div>
      </div>

      <nav>
        <ul className="space-y-1.5 mb-20">
          <li>
            <a href="/dashboard" className="flex items-center gap-2.5 px-3.5 py-2.5 text-gray-600 no-underline rounded-md text-sm font-medium hover:bg-cyan-50 hover:text-teal-500 hover:translate-x-1 transition-all duration-200">
              <i className="fas fa-chart-pie text-base w-5 text-center"></i>
              <span>Dashboard</span>
            </a>
          </li>
          <li>
            <a href="/vendor" className="flex items-center gap-2.5 px-3.5 py-2.5 text-gray-600 no-underline rounded-md text-sm font-medium hover:bg-cyan-50 hover:text-teal-500 hover:translate-x-1 transition-all duration-200">
              <i className="fas fa-store text-base w-5 text-center"></i>
              <span>Vendor</span>
            </a>
          </li>
          <li>
            <a href="/product" className="flex items-center gap-2.5 px-3.5 py-2.5 no-underline rounded-md text-sm font-medium bg-gradient-to-br from-teal-400 to-teal-700 text-white shadow-md">
              <i className="fas fa-box text-base w-5 text-center"></i>
              <span>Products</span>
            </a>
          </li>
          <li>
            <a href="/purchase" className="flex items-center gap-2.5 px-3.5 py-2.5 text-gray-600 no-underline rounded-md text-sm font-medium hover:bg-cyan-50 hover:text-teal-500 hover:translate-x-1 transition-all duration-200">
              <i className="fas fa-shopping-cart text-base w-5 text-center"></i>
              <span>Purchase</span>
            </a>
          </li>
          <li>
            <a href="/inventory" className="flex items-center gap-2.5 px-3.5 py-2.5 text-gray-600 no-underline rounded-md text-sm font-medium hover:bg-cyan-50 hover:text-teal-500 hover:translate-x-1 transition-all duration-200">
              <i className="fas fa-warehouse text-base w-5 text-center"></i>
              <span>Inventory</span>
            </a>
          </li>
          <li>
            <a href="/scrap" className="flex items-center gap-2.5 px-3.5 py-2.5 text-gray-600 no-underline rounded-md text-sm font-medium hover:bg-cyan-50 hover:text-teal-500 hover:translate-x-1 transition-all duration-200">
              <i className="fas fa-recycle text-base w-5 text-center"></i>
              <span>Scrap Management</span>
            </a>
          </li>
          <li>
            <a href="/maintenance" className="flex items-center gap-2.5 px-3.5 py-2.5 text-gray-600 no-underline rounded-md text-sm font-medium hover:bg-cyan-50 hover:text-teal-500 hover:translate-x-1 transition-all duration-200">
              <i className="fas fa-tools text-base w-5 text-center"></i>
              <span>Maintenance</span>
            </a>
          </li>
          <li>
            <a href="/reports" className="flex items-center gap-2.5 px-3.5 py-2.5 text-gray-600 no-underline rounded-md text-sm font-medium hover:bg-cyan-50 hover:text-teal-500 hover:translate-x-1 transition-all duration-200">
              <i className="fas fa-file-alt text-base w-5 text-center"></i>
              <span>Reports</span>
            </a>
          </li>
          <li>
            <a href="/users" className="flex items-center gap-2.5 px-3.5 py-2.5 text-gray-600 no-underline rounded-md text-sm font-medium hover:bg-cyan-50 hover:text-teal-500 hover:translate-x-1 transition-all duration-200">
              <i className="fas fa-users-cog text-base w-5 text-center"></i>
              <span>User Management</span>
            </a>
          </li>
          <li>
            <a href="/settings" className="flex items-center gap-2.5 px-3.5 py-2.5 text-gray-600 no-underline rounded-md text-sm font-medium hover:bg-cyan-50 hover:text-teal-500 hover:translate-x-1 transition-all duration-200">
              <i className="fas fa-cog text-base w-5 text-center"></i>
              <span>Settings</span>
            </a>
          </li>
        </ul>
      </nav>

      <button
        onClick={onLogout}
        className="absolute bottom-4 left-4 right-4 flex items-center justify-center gap-2 py-2.5 px-2.5 bg-gradient-to-br from-red-500 to-red-700 text-white border-none rounded-md text-sm font-semibold cursor-pointer hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200"
      >
        <i className="fas fa-sign-out-alt text-base"></i>
        <span>Logout</span>
      </button>
    </aside>
  );
};

// ==========================================================================
// STATISTICS CARD COMPONENT
// ==========================================================================
const StatCard = ({ icon, title, value, change, changeType }) => {
  const changeColorMap = {
    positive: 'text-green-500',
    warning: 'text-yellow-500',
    negative: 'text-red-500'
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:-translate-y-1 hover:shadow-lg transition-all duration-200">
      <div className="h-1 bg-gradient-to-r from-teal-400 to-teal-700"></div>
      <div className="p-5">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 uppercase tracking-wide">
            <i className={`fas ${icon} text-base text-teal-500`}></i>
            {title}
          </div>
        </div>
        <div className="text-3xl font-extrabold text-gray-800 mb-2 leading-none">
          {value}
        </div>
        <div className={`flex items-center gap-1 text-xs font-semibold ${changeColorMap[changeType]}`}>
          <i className={`fas ${changeType === 'positive' ? 'fa-arrow-up' : changeType === 'warning' ? 'fa-exclamation-circle' : 'fa-check'} text-[10px]`}></i>
          {change}
        </div>
      </div>
    </div>
  );
};

// ==========================================================================
// MAIN PRODUCT MANAGEMENT COMPONENT
// ==========================================================================
const ProductManagement = () => {
  // State Management
  const [products, setProducts] = useState([...DUMMY_PRODUCTS]);
  const [categories, setCategories] = useState([...DUMMY_CATEGORIES]);
  const [vendors] = useState([...DUMMY_VENDORS]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Filter States
  const [searchValue, setSearchValue] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [stockFilter, setStockFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  
  // Modal States
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [currentCategory, setCurrentCategory] = useState(null);
  
  // Toast State
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  
  // Confirm Modal Config
  const [confirmConfig, setConfirmConfig] = useState({
    title: '',
    message: '',
    onConfirm: null,
    type: 'warning',
    isDanger: false
  });
  
  // Product Form State
  const [productForm, setProductForm] = useState({
    productName: '',
    categoryId: '',
    vendorIds: [],
    productImage: '',
    description: '',
    useCase: '',
    currentQuantity: 0,
    minQuantityThreshold: 0,
    unitOfMeasurement: 'Piece',
    purchasePrice: 0,
    productCode: '',
    brand: '',
    rackLocation: '',
    autoPOEnabled: false,
    autoPOQuantity: 0,
    autoPOVendor: null,
    isScrap: false,
    maintenanceEnabled: false,
    maintenanceInterval: 0,
    lastMaintenanceDate: '',
    maintenanceNotes: '',
    expiryDate: '',
    status: 'normal'
  });
  
  // Category Form State
  const [categoryForm, setCategoryForm] = useState({
    categoryName: ''
  });

  // Calculate statistics
  const stats = useMemo(() => 
    calculateProductStats(products, categories, DUMMY_PRODUCT_STATISTICS),
    [products, categories]
  );

  // Get filtered products
  const filteredProducts = useMemo(() => 
    getFilteredProducts(products, { searchValue, categoryFilter, stockFilter }),
    [products, searchValue, categoryFilter, stockFilter]
  );

  useEffect(() => {
    showToast('Product Management loaded successfully!', 'success');
  }, []);

  // Toast Helper
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 3000);
  };

  // Product Modal Functions
  const openAddProductModal = () => {
    setCurrentProduct(null);
    setProductForm({
      productName: '',
      categoryId: '',
      vendorIds: [],
      productImage: '',
      description: '',
      useCase: '',
      currentQuantity: 0,
      minQuantityThreshold: 0,
      unitOfMeasurement: 'Piece',
      purchasePrice: 0,
      productCode: '',
      brand: '',
      rackLocation: '',
      autoPOEnabled: false,
      autoPOQuantity: 0,
      autoPOVendor: null,
      isScrap: false,
      maintenanceEnabled: false,
      maintenanceInterval: 0,
      lastMaintenanceDate: '',
      maintenanceNotes: '',
      expiryDate: '',
      status: 'normal'
    });
    setProductModalOpen(true);
  };

  const closeProductModal = () => {
    setProductModalOpen(false);
    setCurrentProduct(null);
  };

  const editProduct = (id) => {
    const product = products.find(p => p.id === id);
    if (!product) {
      showToast('Product not found!', 'error');
      return;
    }
    setCurrentProduct(product);
    setProductForm({
      ...product,
      vendorIds: product.vendorIds || []
    });
    setProductModalOpen(true);
  };

  const saveProduct = () => {
    const validation = validateProductData(productForm);
    
    if (!validation.isValid) {
      showToast(validation.errors[0], 'error');
      return;
    }

    if (currentProduct) {
      // Update existing product
      setProducts(products.map(p =>
        p.id === currentProduct.id
          ? {
              ...p,
              ...productForm,
              status: determineProductStatus(productForm.currentQuantity, productForm.minQuantityThreshold),
              updated_At: new Date().toISOString().split('T')[0]
            }
          : p
      ));
      showToast('Product updated successfully!', 'success');
    } else {
      // Add new product
      const newProduct = {
        ...productForm,
        id: generateNextProductId(products),
        status: determineProductStatus(productForm.currentQuantity, productForm.minQuantityThreshold),
        updated_At: new Date().toISOString().split('T')[0]
      };
      setProducts([...products, newProduct]);
      showToast('Product added successfully!', 'success');
    }
    
    closeProductModal();
  };

  const deleteProduct = (id) => {
    const product = products.find(p => p.id === id);
    if (!product) return;

    setConfirmConfig({
      title: 'Delete Product',
      message: `Are you sure you want to delete "${product.productName}"? This action cannot be undone.`,
      onConfirm: () => {
        setProducts(products.filter(p => p.id !== id));
        showToast('Product deleted successfully!', 'success');
        setConfirmModalOpen(false);
      },
      type: 'error',
      isDanger: true
    });
    setConfirmModalOpen(true);
  };

  // Category Modal Functions
  const openAddCategoryModal = () => {
    setCurrentCategory(null);
    setCategoryForm({ categoryName: '' });
    setCategoryModalOpen(true);
  };

  const closeCategoryModal = () => {
    setCategoryModalOpen(false);
    setCurrentCategory(null);
  };

  const editCategory = (id) => {
    const category = categories.find(c => c.id === id);
    if (!category) {
      showToast('Category not found!', 'error');
      return;
    }
    setCurrentCategory(category);
    setCategoryForm({ categoryName: category.categoryName });
    setCategoryModalOpen(true);
  };

  const saveCategory = () => {
    if (!categoryForm.categoryName || categoryForm.categoryName.trim().length < 2) {
      showToast('Category name must be at least 2 characters!', 'error');
      return;
    }

    if (currentCategory) {
      setCategories(categories.map(c =>
        c.id === currentCategory.id
          ? { ...c, categoryName: categoryForm.categoryName }
          : c
      ));
      showToast('Category updated successfully!', 'success');
    } else {
      const newCategory = {
        id: generateNextCategoryId(categories),
        categoryName: categoryForm.categoryName,
        created_At: new Date().toISOString().split('T')[0]
      };
      setCategories([...categories, newCategory]);
      showToast('Category added successfully!', 'success');
    }
    
    closeCategoryModal();
  };

  const deleteCategory = (id) => {
    const category = categories.find(c => c.id === id);
    if (!category) return;

    const productsInCategory = getProductsByCategory(id, products);
    
    if (productsInCategory.length > 0) {
      showToast(`Cannot delete category with ${productsInCategory.length} products!`, 'error');
      return;
    }

    setConfirmConfig({
      title: 'Delete Category',
      message: `Are you sure you want to delete "${category.categoryName}"?`,
      onConfirm: () => {
        setCategories(categories.filter(c => c.id !== id));
        showToast('Category deleted successfully!', 'success');
        setConfirmModalOpen(false);
      },
      type: 'error',
      isDanger: true
    });
    setConfirmModalOpen(true);
  };

  // Filter Functions
  const clearFilters = () => {
    setSearchValue('');
    setCategoryFilter('');
    setStockFilter('');
    setDateFrom('');
    setDateTo('');
    showToast('Filters cleared', 'info');
  };

  const refreshProducts = () => {
    showToast('Data refreshed successfully!', 'info');
  };

  // Logout
  const logout = () => {
    setConfirmConfig({
      title: 'Logout Confirmation',
      message: 'Are you sure you want to logout?',
      onConfirm: () => {
        showToast('Logging out...', 'info');
        setTimeout(() => {
          window.location.href = '/';
        }, 1000);
        setConfirmModalOpen(false);
      },
      type: 'warning',
      isDanger: false
    });
    setConfirmModalOpen(true);
  };

  return (
    <>
      <ScrollbarStyles />

      <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-gray-50 to-cyan-50 font-sans">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden fixed top-3 left-3 z-50 bg-gradient-to-br from-teal-400 to-teal-700 text-white w-10 h-10 rounded-lg flex items-center justify-center shadow-md hover:scale-110 transition-transform duration-200"
        >
          <i className="fas fa-bars text-lg"></i>
        </button>

        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} onLogout={logout} />

        <div className="ml-0 lg:ml-64 min-h-screen">
          <main className="p-5">
            {/* Page Header */}
            <header className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5">
                <div className="flex-1">
                  <h1 className="text-2xl font-extrabold bg-gradient-to-br from-teal-400 to-teal-700 bg-clip-text text-transparent mb-1 flex items-center gap-2.5">
                    <i className="fas fa-box bg-gradient-to-br from-teal-400 to-teal-700 bg-clip-text text-transparent"></i>
                    Product Management
                  </h1>
                  <p className="text-gray-500 text-sm font-medium">
                    Manage inventory products with comprehensive details, auto PO, rack locations, and real-time monitoring.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2.5 items-center w-full lg:w-auto">
                  <button
                    onClick={openAddCategoryModal}
                    className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-gray-50 text-gray-700 border-2 border-gray-200 rounded-md text-sm font-semibold cursor-pointer hover:bg-white hover:border-teal-400 hover:text-teal-500 transition-all duration-200"
                  >
                    <i className="fas fa-layer-group text-sm"></i>
                    Add Category
                  </button>
                  <button
                    onClick={openAddProductModal}
                    className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-gradient-to-br from-green-400 to-green-600 text-white border-none rounded-md text-sm font-semibold cursor-pointer shadow-sm hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200"
                  >
                    <i className="fas fa-plus text-sm"></i>
                    Add Product
                  </button>
                  <button
                    onClick={refreshProducts}
                    className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-gradient-to-br from-teal-400 to-teal-700 text-white border-none rounded-md text-sm font-semibold cursor-pointer shadow-sm hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200"
                  >
                    <i className="fas fa-refresh text-sm"></i>
                    Refresh
                  </button>
                </div>
              </div>
            </header>

            {/* Statistics Cards */}
            <section className="mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                  icon="fa-box"
                  title="Total Products"
                  value={stats.totalProducts}
                  change="+5 This week"
                  changeType="positive"
                />
                <StatCard
                  icon="fa-tags"
                  title="Total Categories"
                  value={stats.totalCategories}
                  change="All Active"
                  changeType="positive"
                />
                <StatCard
                  icon="fa-exclamation-triangle"
                  title="Low Stock Items"
                  value={stats.lowStockItems}
                  change="Needs Attention"
                  changeType="warning"
                />
                <StatCard
                  icon="fa-box"
                  title="Total Value"
                  value={stats.totalValue}
                  change="Inventory Worth"
                  changeType="positive"
                />
              </div>
            </section>

            {/* Filters Section */}
            <section className="mb-6">
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-200 flex justify-between items-center">
                  <div className="flex items-center gap-2 text-base font-bold text-gray-800">
                    <i className="fas fa-filter text-lg text-teal-500"></i>
                    Filters
                  </div>
                </div>
                <div className="p-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-gray-600 mb-0.5">Search Products</label>
                      <input
                        type="text"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        placeholder="Search by name, code..."
                        className="py-2.5 px-3 border-2 border-gray-200 rounded-md text-gray-800 text-sm outline-none focus:border-teal-400 focus:ring-4 focus:ring-cyan-100 transition-all duration-200 w-full bg-white"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-gray-600 mb-0.5">Category</label>
                      <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="py-2.5 px-3 border-2 border-gray-200 rounded-md text-gray-800 text-sm outline-none focus:border-teal-400 focus:ring-4 focus:ring-cyan-100 transition-all duration-200 w-full bg-white cursor-pointer"
                      >
                        <option value="">All Categories</option>
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.categoryName}</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-gray-600 mb-0.5">Stock Status</label>
                      <select
                        value={stockFilter}
                        onChange={(e) => setStockFilter(e.target.value)}
                        className="py-2.5 px-3 border-2 border-gray-200 rounded-md text-gray-800 text-sm outline-none focus:border-teal-400 focus:ring-4 focus:ring-cyan-100 transition-all duration-200 w-full bg-white cursor-pointer"
                      >
                        <option value="">All Stock Levels</option>
                        <option value="normal">Normal Stock</option>
                        <option value="low">Low Stock</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <button
                        onClick={clearFilters}
                        className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-gradient-to-br from-red-500 to-red-700 text-white border-none rounded-md text-sm font-semibold cursor-pointer shadow-sm hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 w-full"
                      >
                        <i className="fas fa-times text-sm"></i>
                        Clear All
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Products Table */}
            <section className="mb-6">
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-200 flex justify-between items-center">
                  <div className="flex items-center gap-2 text-base font-bold text-gray-800">
                    <i className="fas fa-list text-lg text-teal-500"></i>
                    Product Inventory Management
                  </div>
                </div>
                <div className="p-5">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse bg-white">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="py-3 px-4 text-left font-bold text-gray-600 text-xs uppercase tracking-wide border-b-2 border-gray-200 whitespace-nowrap">Image</th>
                          <th className="py-3 px-4 text-left font-bold text-gray-600 text-xs uppercase tracking-wide border-b-2 border-gray-200 whitespace-nowrap">Product Name</th>
                          <th className="py-3 px-4 text-left font-bold text-gray-600 text-xs uppercase tracking-wide border-b-2 border-gray-200 whitespace-nowrap">Category</th>
                          <th className="py-3 px-4 text-left font-bold text-gray-600 text-xs uppercase tracking-wide border-b-2 border-gray-200 whitespace-nowrap">SKU/Code</th>
                          <th className="py-3 px-4 text-center font-bold text-gray-600 text-xs uppercase tracking-wide border-b-2 border-gray-200 whitespace-nowrap">Stock</th>
                          <th className="py-3 px-4 text-center font-bold text-gray-600 text-xs uppercase tracking-wide border-b-2 border-gray-200 whitespace-nowrap">Min Qty</th>
                          <th className="py-3 px-4 text-center font-bold text-gray-600 text-xs uppercase tracking-wide border-b-2 border-gray-200 whitespace-nowrap">Unit</th>
                          <th className="py-3 px-4 text-left font-bold text-gray-600 text-xs uppercase tracking-wide border-b-2 border-gray-200 whitespace-nowrap">Price</th>
                          <th className="py-3 px-4 text-left font-bold text-gray-600 text-xs uppercase tracking-wide border-b-2 border-gray-200 whitespace-nowrap">Status</th>
                          <th className="py-3 px-4 text-left font-bold text-gray-600 text-xs uppercase tracking-wide border-b-2 border-gray-200 whitespace-nowrap">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredProducts.length === 0 ? (
                          <tr>
                            <td colSpan="10" className="text-center py-10">
                              <i className="fas fa-inbox text-5xl text-gray-400 mb-4 block"></i>
                              <p className="text-gray-500 text-sm">No products found</p>
                            </td>
                          </tr>
                        ) : (
                          filteredProducts.map((product) => {
                            const statusConfig = PRODUCT_STATUS_CONFIG[product.status];
                            return (
                              <tr key={product.id} className="hover:bg-cyan-50 transition-colors duration-200">
                                <td className="py-3 px-4 border-b border-gray-200">
                                  <img 
                                    src={product.productImage} 
                                    alt={product.productName}
                                    className="w-12 h-12 object-cover rounded-md"
                                    onError={(e) => { e.target.src = 'https://via.placeholder.com/50?text=No+Image'; }}
                                  />
                                </td>
                                <td className="py-3 px-4 border-b border-gray-200">
                                  <div className="font-semibold text-gray-800">{product.productName}</div>
                                  <div className="text-xs text-gray-500">
                                    <i className="fas fa-tag text-[10px]"></i> {product.brand}
                                  </div>
                                </td>
                                <td className="py-3 px-4 border-b border-gray-200">
                                  <span className="px-2.5 py-1 bg-cyan-50 text-teal-600 rounded-md text-xs font-semibold">
                                    {getCategoryName(product.categoryId, categories)}
                                  </span>
                                </td>
                                <td className="py-3 px-4 border-b border-gray-200">
                                  <code className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-700 font-mono">
                                    {product.productCode}
                                  </code>
                                </td>
                                <td className="py-3 px-4 border-b border-gray-200 text-center">
                                  <strong className="text-lg font-bold text-gray-800">{product.currentQuantity}</strong>
                                </td>
                                <td className="py-3 px-4 border-b border-gray-200 text-center">
                                  <span className="text-sm text-gray-600">{product.minQuantityThreshold}</span>
                                </td>
                                <td className="py-3 px-4 border-b border-gray-200 text-center">
                                  <span className="text-sm text-gray-600">{product.unitOfMeasurement}</span>
                                </td>
                                <td className="py-3 px-4 border-b border-gray-200">
                                  <span className="text-sm font-semibold text-blue-600">
                                    {formatCurrency(product.purchasePrice)}
                                  </span>
                                </td>
                                <td className="py-3 px-4 border-b border-gray-200 text-center">
                                  <span className={`inline-block px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wide ${statusConfig.color}`}>
                                    <i className={`fas ${statusConfig.icon} text-[10px] mr-1`}></i>
                                    {statusConfig.label}
                                  </span>
                                </td>
                                <td className="py-3 px-4 border-b border-gray-200">
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => editProduct(product.id)}
                                      className="px-3 py-1.5 bg-yellow-500 text-white border-none rounded-md cursor-pointer text-xs font-semibold inline-flex items-center gap-1 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200"
                                      title="Edit Product"
                                    >
                                      <i className="fas fa-edit text-xs"></i>
                                    </button>
                                    <button
                                      onClick={() => deleteProduct(product.id)}
                                      className="px-3 py-1.5 bg-red-500 text-white border-none rounded-md cursor-pointer text-xs font-semibold inline-flex items-center gap-1 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200"
                                      title="Delete Product"
                                    >
                                      <i className="fas fa-trash text-xs"></i>
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </section>

            {/* Category Table */}
            <section className="mb-6">
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-200 flex justify-between items-center">
                  <div className="flex items-center gap-2 text-base font-bold text-gray-800">
                    <i className="fas fa-tags text-lg text-teal-500"></i>
                    Category Management
                  </div>
                </div>
                <div className="p-5">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse bg-white">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="py-3 px-4 text-left font-bold text-gray-600 text-xs uppercase tracking-wide border-b-2 border-gray-200 whitespace-nowrap">ID</th>
                          <th className="py-3 px-4 text-left font-bold text-gray-600 text-xs uppercase tracking-wide border-b-2 border-gray-200 whitespace-nowrap">Category Name</th>
                          <th className="py-3 px-4 text-left font-bold text-gray-600 text-xs uppercase tracking-wide border-b-2 border-gray-200 whitespace-nowrap">Products Count</th>
                          <th className="py-3 px-4 text-left font-bold text-gray-600 text-xs uppercase tracking-wide border-b-2 border-gray-200 whitespace-nowrap">Created Date</th>
                          <th className="py-3 px-4 text-left font-bold text-gray-600 text-xs uppercase tracking-wide border-b-2 border-gray-200 whitespace-nowrap">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {categories.length === 0 ? (
                          <tr>
                            <td colSpan="5" className="text-center py-10">
                              <i className="fas fa-folder-open text-5xl text-gray-400 mb-4 block"></i>
                              <p className="text-gray-500 text-sm">No categories found</p>
                            </td>
                          </tr>
                        ) : (
                          categories.map((category) => {
                            const productCount = getProductsByCategory(category.id, products).length;
                            return (
                              <tr key={category.id} className="hover:bg-cyan-50 transition-colors duration-200">
                                <td className="py-3 px-4 border-b border-gray-200 text-gray-800 text-sm">
                                  <strong>#{category.id}</strong>
                                </td>
                                <td className="py-3 px-4 border-b border-gray-200 text-gray-800 text-sm font-semibold">
                                  {category.categoryName}
                                </td>
                                <td className="py-3 px-4 border-b border-gray-200 text-gray-800 text-sm">
                                  <span className="px-2.5 py-1 bg-blue-50 text-blue-600 rounded-md text-xs font-semibold">
                                    {productCount} Products
                                  </span>
                                </td>
                                <td className="py-3 px-4 border-b border-gray-200 text-gray-600 text-sm">
                                  <i className="fas fa-clock text-xs mr-1"></i>
                                  {category.created_At}
                                </td>
                                <td className="py-3 px-4 border-b border-gray-200">
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => editCategory(category.id)}
                                      className="px-3 py-1.5 bg-yellow-500 text-white border-none rounded-md cursor-pointer text-xs font-semibold inline-flex items-center gap-1 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200"
                                      title="Edit Category"
                                    >
                                      <i className="fas fa-edit text-xs"></i>
                                    </button>
                                    <button
                                      onClick={() => deleteCategory(category.id)}
                                      className="px-3 py-1.5 bg-red-500 text-white border-none rounded-md cursor-pointer text-xs font-semibold inline-flex items-center gap-1 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200"
                                      title="Delete Category"
                                    >
                                      <i className="fas fa-trash text-xs"></i>
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </section>
          </main>
        </div>

        {/* Product Modal */}
        {productModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-[9997] p-5">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeProductModal}></div>
            <div className="relative w-full max-w-4xl max-h-[90vh] animate-in fade-in duration-300">
              <div className="bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                  <h2 className="text-lg font-bold text-gray-800">
                    {currentProduct ? 'Edit Product' : 'Add New Product'}
                  </h2>
                  <button
                    onClick={closeProductModal}
                    className="bg-transparent border-none text-gray-500 text-xl cursor-pointer p-1 rounded-md w-8 h-8 flex items-center justify-center hover:bg-white hover:text-gray-800 transition-all duration-200"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
                <div className="p-6 overflow-y-auto flex-1">
                  <form onSubmit={(e) => { e.preventDefault(); saveProduct(); }}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-gray-600">Product Name *</label>
                        <input
                          type="text"
                          value={productForm.productName}
                          onChange={(e) => setProductForm({ ...productForm, productName: e.target.value })}
                          placeholder="Enter product name"
                          required
                          className="py-2.5 px-3 border-2 border-gray-200 rounded-md text-gray-800 text-sm outline-none focus:border-teal-400 focus:ring-4 focus:ring-cyan-100 transition-all duration-200 w-full bg-white"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-gray-600">Category *</label>
                        <select
                          value={productForm.categoryId}
                          onChange={(e) => setProductForm({ ...productForm, categoryId: parseInt(e.target.value) })}
                          required
                          className="py-2.5 px-3 border-2 border-gray-200 rounded-md text-gray-800 text-sm outline-none focus:border-teal-400 focus:ring-4 focus:ring-cyan-100 transition-all duration-200 w-full bg-white cursor-pointer"
                        >
                          <option value="">Select Category</option>
                          {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.categoryName}</option>
                          ))}
                        </select>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-gray-600">Product Code *</label>
                        <input
                          type="text"
                          value={productForm.productCode}
                          onChange={(e) => setProductForm({ ...productForm, productCode: e.target.value })}
                          placeholder="e.g., PROD-001"
                          required
                          className="py-2.5 px-3 border-2 border-gray-200 rounded-md text-gray-800 text-sm outline-none focus:border-teal-400 focus:ring-4 focus:ring-cyan-100 transition-all duration-200 w-full bg-white"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-gray-600">Brand</label>
                        <input
                          type="text"
                          value={productForm.brand}
                          onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                          placeholder="Enter brand name"
                          className="py-2.5 px-3 border-2 border-gray-200 rounded-md text-gray-800 text-sm outline-none focus:border-teal-400 focus:ring-4 focus:ring-cyan-100 transition-all duration-200 w-full bg-white"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-gray-600">Current Quantity *</label>
                        <input
                          type="number"
                          value={productForm.currentQuantity}
                          onChange={(e) => setProductForm({ ...productForm, currentQuantity: parseInt(e.target.value) || 0 })}
                          placeholder="0"
                          required
                          min="0"
                          className="py-2.5 px-3 border-2 border-gray-200 rounded-md text-gray-800 text-sm outline-none focus:border-teal-400 focus:ring-4 focus:ring-cyan-100 transition-all duration-200 w-full bg-white"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-gray-600">Min Quantity Threshold *</label>
                        <input
                          type="number"
                          value={productForm.minQuantityThreshold}
                          onChange={(e) => setProductForm({ ...productForm, minQuantityThreshold: parseInt(e.target.value) || 0 })}
                          placeholder="0"
                          required
                          min="0"
                          className="py-2.5 px-3 border-2 border-gray-200 rounded-md text-gray-800 text-sm outline-none focus:border-teal-400 focus:ring-4 focus:ring-cyan-100 transition-all duration-200 w-full bg-white"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-gray-600">Unit of Measurement *</label>
                        <select
                          value={productForm.unitOfMeasurement}
                          onChange={(e) => setProductForm({ ...productForm, unitOfMeasurement: e.target.value })}
                          required
                          className="py-2.5 px-3 border-2 border-gray-200 rounded-md text-gray-800 text-sm outline-none focus:border-teal-400 focus:ring-4 focus:ring-cyan-100 transition-all duration-200 w-full bg-white cursor-pointer"
                        >
                          {UNITS_OF_MEASUREMENT.map(unit => (
                            <option key={unit} value={unit}>{unit}</option>
                          ))}
                        </select>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-gray-600">Purchase Price *</label>
                        <input
                          type="number"
                          value={productForm.purchasePrice}
                          onChange={(e) => setProductForm({ ...productForm, purchasePrice: parseFloat(e.target.value) || 0 })}
                          placeholder="0.00"
                          required
                          min="0"
                          step="0.01"
                          className="py-2.5 px-3 border-2 border-gray-200 rounded-md text-gray-800 text-sm outline-none focus:border-teal-400 focus:ring-4 focus:ring-cyan-100 transition-all duration-200 w-full bg-white"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-gray-600">Rack Location</label>
                        <input
                          type="text"
                          value={productForm.rackLocation}
                          onChange={(e) => setProductForm({ ...productForm, rackLocation: e.target.value })}
                          placeholder="e.g., A1, B5"
                          className="py-2.5 px-3 border-2 border-gray-200 rounded-md text-gray-800 text-sm outline-none focus:border-teal-400 focus:ring-4 focus:ring-cyan-100 transition-all duration-200 w-full bg-white"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5 md:col-span-2">
                        <label className="text-xs font-semibold text-gray-600">Description</label>
                        <textarea
                          value={productForm.description}
                          onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                          placeholder="Enter product description"
                          rows="3"
                          className="py-2.5 px-3 border-2 border-gray-200 rounded-md text-gray-800 text-sm outline-none focus:border-teal-400 focus:ring-4 focus:ring-cyan-100 transition-all duration-200 w-full bg-white resize-y"
                        ></textarea>
                      </div>

                      <div className="flex items-center gap-3 md:col-span-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={productForm.autoPOEnabled}
                            onChange={(e) => setProductForm({ ...productForm, autoPOEnabled: e.target.checked })}
                            className="w-5 h-5 cursor-pointer accent-teal-500"
                          />
                          <span className="text-sm font-semibold text-gray-700">Enable Auto Purchase Order</span>
                        </label>
                      </div>

                      {productForm.autoPOEnabled && (
                        <>
                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-gray-600">Auto PO Quantity *</label>
                            <input
                              type="number"
                              value={productForm.autoPOQuantity}
                              onChange={(e) => setProductForm({ ...productForm, autoPOQuantity: parseInt(e.target.value) || 0 })}
                              placeholder="0"
                              min="1"
                              className="py-2.5 px-3 border-2 border-gray-200 rounded-md text-gray-800 text-sm outline-none focus:border-teal-400 focus:ring-4 focus:ring-cyan-100 transition-all duration-200 w-full bg-white"
                            />
                          </div>

                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-gray-600">Auto PO Vendor *</label>
                            <select
                              value={productForm.autoPOVendor || ''}
                              onChange={(e) => setProductForm({ ...productForm, autoPOVendor: parseInt(e.target.value) || null })}
                              className="py-2.5 px-3 border-2 border-gray-200 rounded-md text-gray-800 text-sm outline-none focus:border-teal-400 focus:ring-4 focus:ring-cyan-100 transition-all duration-200 w-full bg-white cursor-pointer"
                            >
                              <option value="">Select Vendor</option>
                              {vendors.map(vendor => (
                                <option key={vendor.id} value={vendor.id}>{vendor.vendorName}</option>
                              ))}
                            </select>
                          </div>
                        </>
                      )}
                    </div>
                  </form>
                </div>
                <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-2.5 bg-gray-50">
                  <button
                    onClick={closeProductModal}
                    className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-gray-50 text-gray-700 border border-gray-200 rounded-md text-sm font-semibold cursor-pointer hover:bg-white hover:border-teal-400 hover:text-teal-500 transition-all duration-200"
                  >
                    <i className="fas fa-times text-sm"></i>
                    Cancel
                  </button>
                  <button
                    onClick={saveProduct}
                    className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-gradient-to-br from-teal-400 to-teal-700 text-white border-none rounded-md text-sm font-semibold cursor-pointer shadow-sm hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200"
                  >
                    <i className="fas fa-save text-sm"></i>
                    Save Product
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Category Modal */}
        {categoryModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-[9997] p-5">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeCategoryModal}></div>
            <div className="relative w-full max-w-md animate-in fade-in duration-300">
              <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                  <h2 className="text-lg font-bold text-gray-800">
                    {currentCategory ? 'Edit Category' : 'Add New Category'}
                  </h2>
                  <button
                    onClick={closeCategoryModal}
                    className="bg-transparent border-none text-gray-500 text-xl cursor-pointer p-1 rounded-md w-8 h-8 flex items-center justify-center hover:bg-white hover:text-gray-800 transition-all duration-200"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
                <div className="p-6">
                  <form onSubmit={(e) => { e.preventDefault(); saveCategory(); }}>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-gray-600">Category Name *</label>
                      <input
                        type="text"
                        value={categoryForm.categoryName}
                        onChange={(e) => setCategoryForm({ categoryName: e.target.value })}
                        placeholder="Enter category name"
                        required
                        minLength="2"
                        className="py-2.5 px-3 border-2 border-gray-200 rounded-md text-gray-800 text-sm outline-none focus:border-teal-400 focus:ring-4 focus:ring-cyan-100 transition-all duration-200 w-full bg-white"
                      />
                    </div>
                  </form>
                </div>
                <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-2.5 bg-gray-50">
                  <button
                    onClick={closeCategoryModal}
                    className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-gray-50 text-gray-700 border border-gray-200 rounded-md text-sm font-semibold cursor-pointer hover:bg-white hover:border-teal-400 hover:text-teal-500 transition-all duration-200"
                  >
                    <i className="fas fa-times text-sm"></i>
                    Cancel
                  </button>
                  <button
                    onClick={saveCategory}
                    className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-gradient-to-br from-teal-400 to-teal-700 text-white border-none rounded-md text-sm font-semibold cursor-pointer shadow-sm hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200"
                  >
                    <i className="fas fa-save text-sm"></i>
                    Save Category
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <ConfirmModal
          isOpen={confirmModalOpen}
          title={confirmConfig.title}
          message={confirmConfig.message}
          onConfirm={confirmConfig.onConfirm}
          onCancel={() => setConfirmModalOpen(false)}
          type={confirmConfig.type}
          isDanger={confirmConfig.isDanger}
        />

        <Toast show={toast.show} message={toast.message} type={toast.type} />
      </div>
    </>
  );
};

export default ProductManagement;