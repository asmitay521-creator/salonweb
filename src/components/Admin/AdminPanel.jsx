import React, { useState, useEffect, useRef } from 'react';
import { useSalon } from '../../context/SalonContext';
import Chart from 'chart.js/auto';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  LayoutGrid, CalendarDays, Receipt, Users, Scissors, UserCheck, Package,
  Tag, Wallet, BarChart3, Settings, ArrowLeft, ShieldCheck, LogOut, Plus,
  IndianRupee, Clock, CheckCircle2, AlertTriangle, Play, LogIn, Check,
  Trash2, Printer, PlusCircle, TrendingUp, Target, Star, Gift, Phone,
  MessageSquare, ChevronDown, ChevronRight, Search, Eye, Filter, Edit2,
  X, CheckSquare, Sparkles, DollarSign, Download, ArrowUpRight, Award,
  PhoneCall, ExternalLink, RefreshCw, Layers, UserPlus, ShoppingBag, Truck,
  FileText, CheckCircle, Percent, Camera, UploadCloud, Barcode, User, Save,
  Mail, MapPin, Building2, CreditCard, Hash, ShoppingCart, ArrowRight, ArrowDown,
  ThumbsUp, ThumbsDown, HelpCircle, CalendarPlus, List, Columns, Flame
} from 'lucide-react';

export default function AdminPanel({ onReturnHome, onGoSuperAdmin, onViewInvoice }) {
  const {
    data, getCurrentSalon, updateAppointmentStatus,
    generatePOSInvoice, addStock, addProduct, updateProduct, deleteProduct, addStaff, updateStaff, deleteStaff, toggleStaffStatus,
    addExpense, addCoupon, addLead, updateLead, updateLeadStatus, addLeadFollowUp, bookLeadAppointment, markLeadServiceDone, convertLeadToCustomer, deleteLead,
    addIncentiveRule, deleteIncentiveRule, addServiceItem, deleteServiceItem,
    addPackageItem, updatePackageItem, loadStarterPackages, deletePackageItem, addStockTransactionRecord,
    addCustomer, deleteCustomer, addSupplier, deleteSupplier, addProductUsageLog,
    updateOrderStatus, deleteOrder,
    logout, showToast
  } = useSalon();

  // Navigation State
  // activeModule: 'dashboard' | 'appointments' | 'customers' | 'leads' | 'services' | 'inventory' | 'employees' | 'packages' | 'billing' | 'reports' | 'settings'
  const [activeModule, setActiveModule] = useState('dashboard');

  // Subtab navigation for multi-tab modules
  const [inventorySubTab, setInventorySubTab] = useState('current_stock'); // 'current_stock' | 'stock_in' | 'stock_out' | 'low_stock' | 'suppliers' | 'product_usage'
  const [employeeSubTab, setEmployeeSubTab] = useState('list'); // 'list' | 'services' | 'incentive_rules' | 'incentive_records' | 'performance'
  const [reportsSubTab, setReportsSubTab] = useState('revenue'); // 'revenue' | 'employee' | 'incentive' | 'inventory' | 'leads'
  const [showPdfPreviewModal, setShowPdfPreviewModal] = useState(false);
  const [pdfPreviewTab, setPdfPreviewTab] = useState('revenue');

  // Expanded sidebar sections for nested menus
  const [expandedMenus, setExpandedMenus] = useState({
    inventory: true,
    employees: true,
    reports: true
  });

  const toggleSubMenu = (menuKey) => {
    setExpandedMenus(prev => ({ ...prev, [menuKey]: !prev[menuKey] }));
  };

  // Detailed Appointment Drawer / View state
  const [selectedAppointmentDetails, setSelectedAppointmentDetails] = useState(null);
  const [selectedDetailPaymentMethod, setSelectedDetailPaymentMethod] = useState('UPI');

  // Lead filters, Lifecycle Funnel & Search (Fully matching diagram workflow)
  const [leadActiveSubTab, setLeadActiveSubTab] = useState('all_leads'); // 'all_leads' | 'add_lead'
  const [leadStatusFilter, setLeadStatusFilter] = useState('all');
  const [leadSourceFilter, setLeadSourceFilter] = useState('all');
  const [leadServiceFilter, setLeadServiceFilter] = useState('all');
  const [leadStaffFilter, setLeadStaffFilter] = useState('all');
  const [leadFollowUpFilter, setLeadFollowUpFilter] = useState('all'); // 'all' | 'today' | 'tomorrow' | 'overdue' | 'upcoming'
  const [leadDateRange, setLeadDateRange] = useState('all'); // 'all' | 'today' | '7days' | '30days' | 'custom'
  const [leadCustomStartDate, setLeadCustomStartDate] = useState('');
  const [leadCustomEndDate, setLeadCustomEndDate] = useState('');
  const [leadSearch, setLeadSearch] = useState('');
  const [leadViewMode, setLeadViewMode] = useState('table'); // 'table' | 'kanban'
  const [isLeadFilterOpen, setIsLeadFilterOpen] = useState(false);
  const [leadSubStatusFilter, setLeadSubStatusFilter] = useState('all');
  const [selectedLeadForAssign, setSelectedLeadForAssign] = useState(null);
  const [selectedLeadForFollowUp, setSelectedLeadForFollowUp] = useState(null);
  const [selectedLeadForBookApt, setSelectedLeadForBookApt] = useState(null);
  const [selectedLeadForConvert, setSelectedLeadForConvert] = useState(null);
  const [selectedLeadForLost, setSelectedLeadForLost] = useState(null);
  const [selectedCustomerForProfile, setSelectedCustomerForProfile] = useState(null);
  const [customerProfileTab, setCustomerProfileTab] = useState('bookings'); // 'bookings' | 'services' | 'payments' | 'preferences' | 'future_apts'
  const [followUpEntryForm, setFollowUpEntryForm] = useState({
    actionType: 'completed', // 'completed' | 'reschedule' | 'no_response' | 'not_interested' | 'lost'
    type: 'Phone Call',
    notes: '',
    nextFollowUpDate: '',
    nextFollowUpTime: '02:00 PM',
    lostReason: 'Pricing too high / Out of budget'
  });
  const [bookLeadAptForm, setBookLeadAptForm] = useState({
    serviceId: 'srv_01',
    serviceName: 'Signature Precision Haircut & Styling',
    date: new Date().toISOString().split('T')[0],
    time: '11:00 AM',
    staffId: 'stf_01',
    staffName: 'Maya Sharma',
    duration: 45,
    amount: 1200,
    notes: ''
  });
  const [lostLeadForm, setLostLeadForm] = useState({ reason: 'Pricing too high / Out of budget', notes: '' });

  // Service filters & Search
  const [serviceCategoryFilter, setServiceCategoryFilter] = useState('all');
  const [serviceSearch, setServiceSearch] = useState('');

  // Inventory filters & Search
  const [inventoryCategoryFilter, setInventoryCategoryFilter] = useState('all');
  const [inventoryStatusFilter, setInventoryStatusFilter] = useState('all');
  const [inventorySearch, setInventorySearch] = useState('');

  // Employee filters & Selected Employee for Incentive Rules view
  const [employeeRoleFilter, setEmployeeRoleFilter] = useState('all');
  const [employeeSearch, setEmployeeSearch] = useState('');
  const [selectedStylistForRule, setSelectedStylistForRule] = useState('Maya Sharma');

  // Appointments filter & Search
  const [aptFilter, setAptFilter] = useState('all');
  const [aptSearch, setAptSearch] = useState('');

  // Customer filters & Search
  const [customerSearch, setCustomerSearch] = useState('');
  const [customerTierFilter, setCustomerTierFilter] = useState('all');


  // Orders filters & Search
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [orderPaymentFilter, setOrderPaymentFilter] = useState('all');
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);

  // Global search input in topbar
  const [topbarSearchQuery, setTopbarSearchQuery] = useState('');

  // Modals state
  const [showAddLeadModal, setShowAddLeadModal] = useState(false);
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [showAddRuleModal, setShowAddRuleModal] = useState(false);
  const [showAddPackageModal, setShowAddPackageModal] = useState(false);
  const [showEditPackageModal, setShowEditPackageModal] = useState(false);
  const [editingPkg, setEditingPkg] = useState(null);
  const [packageSearch, setPackageSearch] = useState('');
  const [packageCategoryFilter, setPackageCategoryFilter] = useState('all');
  const [showAddStockInModal, setShowAddStockInModal] = useState(false);
  const [showAddStockOutModal, setShowAddStockOutModal] = useState(false);
  const [showAddSupplierModal, setShowAddSupplierModal] = useState(false);
  const [showAddUsageModal, setShowAddUsageModal] = useState(false);
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [showEditStaffModal, setShowEditStaffModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);

  // Form States
  const [newLead, setNewLead] = useState({
    name: '',
    phone: '',
    email: '',
    gender: 'Female',
    interestedService: 'Signature Precision Haircut & Styling',
    source: 'Instagram Ad',
    preferredDate: new Date().toISOString().split('T')[0],
    preferredTime: '11:00 AM',
    assignedTo: 'Unassigned',
    estimatedValue: 2500,
    notes: ''
  });
  const [newService, setNewService] = useState({ name: '', categoryId: 'hair', gender: 'unisex', duration: 30, price: 100, productsCount: '1 product', incentiveRule: '20%', status: 'Active', description: '' });
  const [newProd, setNewProd] = useState({ id: null, name: '', category: 'Hair Care', brand: "L'Oréal", unitQuantity: '', unit: 'Bottles', unitCost: '', totalCost: '', stock: '', alert: 5, supplier: '', sku: '', expiryDate: '', gst: '', discount: '', description: '', imageFile: null, imageUrl: null });
  const [newStaff, setNewStaff] = useState({
    name: '',
    employeeId: '',
    phone: '',
    email: '',
    dob: '',
    gender: 'Male',
    role: '',
    specialization: '',
    joiningDate: '',
    employmentType: 'Full Time',
    salary: '',
    address: '',
    city: '',
    imageFile: null,
    imageUrl: null,
    notes: '',
    commissionRate: 12,
    servicesCount: 12
  });
  const [newRule, setNewRule] = useState({ staffId: 'stf_01', staffName: 'Maya Sharma', service: 'Hair Colour', incentiveType: 'Percentage', value: '10%', condition: 'All Bookings' });
  const [newPkg, setNewPkg] = useState({ name: '', price: 2999, originalPrice: 4500, duration: '120 mins', category: 'Bridal', badge: 'BESTSELLER', includesText: 'Bridal HD Makeup, Diamond Facial, Hair Spa' });
  const [newStockTx, setNewStockTx] = useState({ type: 'Stock In', productName: "L'Oréal Absolut Repair Shampoo (1500ml)", qty: 10, supplier: "L'Oréal Professional India", cost: 1850, batch: 'LOR-2026-B9' });
  const [newStockOutTx, setNewStockOutTx] = useState({ type: 'Stock Out', productName: "Kerastase Hair Mask", qty: 2, supplier: "Salon Bay Floor Usage", cost: 1200, reason: "Daily Floor Consumption" });
  const [newSupplier, setNewSupplier] = useState({ name: '', contactPerson: '', phone: '', email: '', balance: 0, productsSupplied: 5 });
  const [newUsageLog, setNewUsageLog] = useState({ service: 'Hair Colour & Balayage', stylist: 'Maya Sharma', productsUsedText: 'Schwarzkopf Igora Tube (60g), Developer 20 Vol (90ml)' });
  const [newCust, setNewCust] = useState({ name: '', phone: '', email: '', tier: 'Gold Member' });

  // POS State
  const [posCart, setPosCart] = useState([]);
  const [posCustName, setPosCustName] = useState('');
  const [posCustPhone, setPosCustPhone] = useState('');
  const [posCustEmail, setPosCustEmail] = useState('');
  const [posStaffId, setPosStaffId] = useState('');
  const [posDiscountPercent, setPosDiscountPercent] = useState(0);
  const [posDiscountCustom, setPosDiscountCustom] = useState('');
  const [posPayMethod, setPosPayMethod] = useState('UPI');
  const [posSearch, setPosSearch] = useState('');
  const [posCategoryTab, setPosCategoryTab] = useState('all'); // 'all' | 'services' | 'products' | 'packages'
  const [posServiceSubFilter, setPosServiceSubFilter] = useState('all');
  const [posApplyGst, setPosApplyGst] = useState(true);
  const [posViewMode, setPosViewMode] = useState('register'); // 'register' | 'history'
  const [lastGeneratedInvoice, setLastGeneratedInvoice] = useState(null);
  const [showPOSReceiptModal, setShowPOSReceiptModal] = useState(false);

  const salon = getCurrentSalon();
  const allAppointments = data.appointments || [];

  // Charts references
  const revChartRef = useRef(null);
  const catChartRef = useRef(null);
  const chartInstance1 = useRef(null);
  const chartInstance2 = useRef(null);

  // Dynamic calculations for Metrics
  const todayStr = new Date().toISOString().split('T')[0];
  const leadsCount = (data.leads || []).length;
  const activeEmployeesCount = (data.staff || []).filter(s => s.status !== 'On-Leave').length;
  const lowStockProducts = (data.inventory || []).filter(p => {
    const s = parseInt(p.stock);
    const m = parseInt(p.minStockAlert);
    return (isNaN(s) ? 0 : s) <= (isNaN(m) ? 5 : m);
  });
  const pendingAppointments = allAppointments.filter(a => a.status === 'Pending').length;

  // Real Today's Revenue Calculation
  const todayInvoicesRevenue = (data.invoices || [])
    .filter(inv => inv.date === todayStr)
    .reduce((sum, inv) => sum + (inv.totalAmount || 0), 0);
  const todayAppointmentsRevenue = (allAppointments || [])
    .filter(a => a.date === todayStr && a.paymentStatus === 'Paid')
    .reduce((sum, a) => sum + (a.finalAmount || a.amount || 0), 0);
  const todayOrdersRevenue = (data.orders || [])
    .filter(o => o.date === todayStr && o.paymentStatus === 'Paid')
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const todayRevenue = todayInvoicesRevenue + todayAppointmentsRevenue + todayOrdersRevenue;

  // Total Realized Revenue Calculation
  const totalInvoicesRevenue = (data.invoices || []).reduce((sum, i) => sum + (i.totalAmount || 0), 0);
  const totalAppointmentsRevenue = (allAppointments || [])
    .filter(a => a.paymentStatus === 'Paid')
    .reduce((sum, a) => sum + (a.finalAmount || a.amount || 0), 0);
  const totalOrdersRevenue = (data.orders || []).reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const totalGrossRevenue = totalInvoicesRevenue + totalAppointmentsRevenue + totalOrdersRevenue;
  const totalDiscountsGiven = (data.invoices || []).reduce((sum, inv) => sum + (inv.discount || 0), 0);
  const totalTaxCollected = (data.invoices || []).reduce((sum, inv) => sum + (inv.tax || 0), 0);

  // Dynamic Inventory Valuation Breakdown
  const inventoryCategoryAggregates = {};
  (data.inventory || []).forEach(p => {
    const cat = p.category || 'General';
    if (!inventoryCategoryAggregates[cat]) {
      inventoryCategoryAggregates[cat] = { category: cat, itemsCount: 0, totalUnits: 0, assetCost: 0, retailValue: 0 };
    }
    inventoryCategoryAggregates[cat].itemsCount += 1;
    inventoryCategoryAggregates[cat].totalUnits += (p.stock || 0);
    inventoryCategoryAggregates[cat].assetCost += (p.stock || 0) * (p.unitCost || 0);
    inventoryCategoryAggregates[cat].retailValue += (p.stock || 0) * (p.sellingPrice || p.price || 0);
  });
  const inventoryValuationList = Object.values(inventoryCategoryAggregates);

  // Dynamic Leads Conversions Breakdown
  const leadsSourceAggregates = {};
  (data.leads || []).forEach(l => {
    const src = l.source || 'Direct';
    if (!leadsSourceAggregates[src]) {
      leadsSourceAggregates[src] = { source: src, total: 0, converted: 0 };
    }
    leadsSourceAggregates[src].total += 1;
    if (['Converted', 'Appointment Booked', 'Booked', 'Completed'].includes(l.status)) {
      leadsSourceAggregates[src].converted += 1;
    }
  });
  const leadConversionsList = Object.values(leadsSourceAggregates).map(s => ({
    ...s,
    rate: s.total > 0 ? ((s.converted / s.total) * 100).toFixed(1) : '0.0'
  }));

  // Dynamic Revenue Report Rows (Grouped by Date)
  const revenueByDateMap = {};
  (data.invoices || []).forEach(inv => {
    const d = inv.date || todayStr;
    if (!revenueByDateMap[d]) {
      revenueByDateMap[d] = { date: d, count: 0, serviceGross: 0, retailGross: 0, total: 0 };
    }
    revenueByDateMap[d].count += 1;
    const prodTotal = (inv.items || []).filter(it => it.type === 'product').reduce((s, it) => s + (it.price * it.qty), 0);
    const srvTotal = (inv.items || []).filter(it => it.type !== 'product').reduce((s, it) => s + (it.price * it.qty), 0);
    revenueByDateMap[d].serviceGross += srvTotal;
    revenueByDateMap[d].retailGross += prodTotal;
    revenueByDateMap[d].total += (inv.totalAmount || 0);
  });
  (data.appointments || []).filter(a => a.paymentStatus === 'Paid').forEach(a => {
    const d = a.date || todayStr;
    if (!revenueByDateMap[d]) {
      revenueByDateMap[d] = { date: d, count: 0, serviceGross: 0, retailGross: 0, total: 0 };
    }
    revenueByDateMap[d].count += 1;
    revenueByDateMap[d].serviceGross += (a.finalAmount || a.amount || 0);
    revenueByDateMap[d].total += (a.finalAmount || a.amount || 0);
  });
  const revenueReportRows = Object.values(revenueByDateMap).sort((a, b) => b.date.localeCompare(a.date));

  // Today's Incentive Calculation
  const todayIncentive = (allAppointments || [])
    .filter(a => a.date === todayStr && a.paymentStatus === 'Paid')
    .reduce((sum, a) => {
      const staff = (data.staff || []).find(s => s.id === a.staffId || s.name === a.staffName);
      const rate = staff?.commissionRate ? staff.commissionRate / 100 : 0.12;
      return sum + Math.round((a.finalAmount || a.amount || 0) * rate);
    }, 0) + (data.invoices || [])
      .filter(inv => inv.date === todayStr)
      .reduce((sum, inv) => {
        const staff = (data.staff || []).find(s => s.id === inv.staffId || s.name === inv.staffName);
        const rate = staff?.commissionRate ? staff.commissionRate / 100 : 0.12;
        return sum + Math.round((inv.totalAmount || 0) * rate);
      }, 0);

  // Initialize or update charts when dashboard is visible
  useEffect(() => {
    if (activeModule === 'dashboard' && !selectedAppointmentDetails) {
      // 1. Dynamic 7-Day Revenue Calculation
      const pastDays = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        pastDays.push(d.toISOString().split('T')[0]);
      }
      const dayLabels = pastDays.map(d => {
        const dateObj = new Date(d);
        return dateObj.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
      });

      const serviceRevData = pastDays.map(day => {
        const aptRev = (data.appointments || [])
          .filter(a => a.date === day && a.paymentStatus === 'Paid')
          .reduce((s, a) => s + (a.finalAmount || a.amount || 0), 0);
        const invRev = (data.invoices || [])
          .filter(inv => inv.date === day)
          .reduce((s, inv) => s + (inv.items || []).filter(item => item.type === 'service').reduce((sub, it) => sub + (it.price * (it.qty || 1)), 0), 0);
        return aptRev + invRev;
      });

      const prodRevData = pastDays.map(day => {
        const ordRev = (data.orders || [])
          .filter(o => o.date === day && o.paymentStatus === 'Paid')
          .reduce((s, o) => s + (o.totalAmount || 0), 0);
        const invProdRev = (data.invoices || [])
          .filter(inv => inv.date === day)
          .reduce((s, inv) => s + (inv.items || []).filter(item => item.type === 'product').reduce((sub, it) => sub + (it.price * (it.qty || 1)), 0), 0);
        return ordRev + invProdRev;
      });

      const pkgRevData = pastDays.map(() => 0);

      if (revChartRef.current) {
        if (chartInstance1.current) chartInstance1.current.destroy();
        chartInstance1.current = new Chart(revChartRef.current, {
          type: 'bar',
          data: {
            labels: dayLabels,
            datasets: [
              {
                label: 'Service Revenue',
                data: serviceRevData,
                backgroundColor: '#49B9CA',
                borderRadius: 6
              },
              {
                label: 'Product Sales',
                data: prodRevData,
                backgroundColor: '#D4AF37',
                borderRadius: 6
              },
              {
                label: 'Packages',
                data: pkgRevData,
                backgroundColor: '#248896',
                borderRadius: 6
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'top',
                labels: {
                  color: '#475569',
                  font: { family: 'inherit', size: 12, weight: 600 },
                  boxWidth: 12,
                  usePointStyle: true
                }
              }
            },
            scales: {
              x: {
                grid: { display: false },
                ticks: { color: '#64748B', font: { size: 11 } }
              },
              y: {
                beginAtZero: true,
                grid: { color: 'rgba(0,0,0,0.04)' },
                ticks: {
                  color: '#64748B',
                  font: { size: 11 },
                  callback: (v) => `₹${v}`
                }
              }
            }
          }
        });
      }

      // 2. Dynamic Categories Breakdown
      const categoryTally = {};
      (data.services || []).forEach(s => {
        const cat = s.categoryId || s.category || 'hair';
        categoryTally[cat] = (categoryTally[cat] || 0) + 1;
      });
      const catLabels = Object.keys(categoryTally).map(k => k.charAt(0).toUpperCase() + k.slice(1));
      const catCounts = Object.values(categoryTally);

      if (catChartRef.current) {
        if (chartInstance2.current) chartInstance2.current.destroy();
        chartInstance2.current = new Chart(catChartRef.current, {
          type: 'doughnut',
          data: {
            labels: catLabels.length > 0 ? catLabels : ['General Services'],
            datasets: [{
              data: catCounts.length > 0 ? catCounts : [1],
              backgroundColor: ['#49B9CA', '#D4AF37', '#248896', '#EB7585', '#8B5CF6', '#10B981', '#F59E0B'],
              borderWidth: 2,
              borderColor: '#ffffff'
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '72%',
            plugins: {
              legend: {
                position: 'right',
                labels: {
                  color: '#475569',
                  font: { size: 11.5, weight: 500 },
                  boxWidth: 10,
                  usePointStyle: true
                }
              }
            }
          }
        });
      }
    }

    return () => {
      if (chartInstance1.current) chartInstance1.current.destroy();
      if (chartInstance2.current) chartInstance2.current.destroy();
    };
  }, [activeModule, selectedAppointmentDetails, data.appointments, data.invoices, data.orders, data.services]);

  // POS Add to Cart
  const addToPosCart = (type, item) => {
    if (type === 'product' && item.stock <= 0) {
      showToast('⚠️ Item is out of stock!');
      return;
    }
    setPosCart(prev => {
      const existing = prev.find(x => x.id === item.id && x.type === type);
      if (existing) {
        return prev.map(x => x.id === item.id && x.type === type ? { ...x, qty: x.qty + 1 } : x);
      }
      return [...prev, {
        id: item.id,
        productId: type === 'product' ? item.id : null,
        type,
        name: item.name,
        price: type === 'service' ? item.price : (item.sellingPrice || item.price),
        qty: 1
      }];
    });
    showToast(`✓ Added "${item.name}" to bill`);
  };

  const updatePosCartQty = (idx, delta) => {
    setPosCart(prev => {
      const updated = [...prev];
      if (!updated[idx]) return prev;
      const newQty = updated[idx].qty + delta;
      if (newQty <= 0) {
        return updated.filter((_, i) => i !== idx);
      }
      updated[idx] = { ...updated[idx], qty: newQty };
      return updated;
    });
  };

  const removeFromPosCart = (idx) => {
    setPosCart(prev => prev.filter((_, i) => i !== idx));
  };

  const clearPosCart = () => {
    if (posCart.length === 0) return;
    if (window.confirm("Are you sure you want to clear all items from the current bill?")) {
      setPosCart([]);
      setPosDiscount(0);
      showToast("Cleared bill cart.");
    }
  };

  const posSubtotal = posCart.reduce((sum, i) => sum + (i.price * i.qty), 0);
  const posTax = posApplyGst ? Math.round(posSubtotal * 0.18) : 0;
  const posTotalBeforeDiscount = posSubtotal + posTax;
  const posDiscountAmt = posDiscountCustom !== ''
    ? Math.min(posTotalBeforeDiscount, parseFloat(posDiscountCustom) || 0)
    : (posDiscountPercent > 0 ? Math.round(posTotalBeforeDiscount * (posDiscountPercent / 100)) : 0);
  const posTotal = Math.max(0, posTotalBeforeDiscount - posDiscountAmt);

  const handleCheckoutPOS = () => {
    if (!posCustName || !posCustName.trim()) {
      showToast("⚠️ Please enter Customer Name.");
      return;
    }
    const cleanPhone = (posCustPhone || '').replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length !== 10) {
      showToast("⚠️ Please enter a valid 10-digit mobile number.");
      return;
    }
    if (posCart.length === 0) {
      showToast("⚠️ Please select at least one service or product.");
      return;
    }
    const staff = (data.staff || []).find(s => s.id === posStaffId) || (data.staff || [])[0];
    if (!posStaffId && !staff) {
      showToast("⚠️ Please select a Stylist / Employee.");
      return;
    }
    const autoInvId = `INV-${new Date().getFullYear()}-${String(1001 + (data.invoices || []).length).padStart(4, '0')}`;
    const createdInvoice = generatePOSInvoice({
      id: autoInvId,
      customerName: posCustName.trim(),
      customerPhone: `+91 ${cleanPhone}`,
      customerEmail: posCustEmail ? posCustEmail.trim() : '',
      items: [...posCart],
      subtotal: posSubtotal,
      discount: posDiscountAmt,
      tax: posTax,
      totalAmount: posTotal,
      paymentMethod: posPayMethod,
      staffId: staff ? staff.id : 'stf_01',
      staffName: staff ? staff.name : 'Master Stylist'
    });

    if (createdInvoice) {
      setLastGeneratedInvoice(createdInvoice);
      setShowPOSReceiptModal(true);
    }

    setPosCart([]);
    setPosCustName('');
    setPosCustPhone('');
    setPosCustEmail('');
    setPosStaffId('');
    setPosDiscountPercent(0);
    setPosDiscountCustom('');
  };

  const handleCancelPOS = () => {
    if (posCart.length > 0 || posCustName || posCustPhone || posCustEmail) {
      if (window.confirm("Are you sure you want to cancel and clear this bill?")) {
        setPosCart([]);
        setPosCustName('');
        setPosCustPhone('');
        setPosCustEmail('');
        setPosStaffId('');
        setPosDiscountPercent(0);
        setPosDiscountCustom('');
        showToast("Bill cancelled and cleared.");
      }
    } else {
      setPosCart([]);
      setPosCustName('');
      setPosCustPhone('');
      setPosCustEmail('');
      setPosStaffId('');
      setPosDiscountPercent(0);
      setPosDiscountCustom('');
    }
  };

  // Top performers list dynamically calculated from actual transactions
  const topEmployees = (data.staff || []).map((st, i) => {
    const staffAppointments = (data.appointments || []).filter(a => a.staffId === st.id || a.staffName === st.name);
    const staffInvoices = (data.invoices || []).filter(inv => inv.staffId === st.id || inv.staffName === st.name);
    const servicesCount = staffAppointments.length + staffInvoices.reduce((sum, inv) => sum + (inv.items?.length || 1), 0);
    const revenue = staffAppointments.filter(a => a.paymentStatus === 'Paid').reduce((sum, a) => sum + (a.finalAmount || a.amount || 0), 0) +
      staffInvoices.reduce((sum, inv) => sum + (inv.totalAmount || 0), 0);
    const commissionRate = st.commissionRate ? st.commissionRate / 100 : 0.12;
    const incentive = Math.round(revenue * commissionRate);

    return {
      id: st.id,
      name: st.name,
      role: st.role,
      services: servicesCount,
      revenue,
      incentive,
      rank: i === 0 ? '🥇' : (i === 1 ? '🥈' : (i === 2 ? '🥉' : `${i + 1}`)),
      photo: st.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
      commissionRate: st.commissionRate || 12
    };
  }).sort((a, b) => b.revenue - a.revenue);

  // Direct PDF Download Handler using jsPDF + autoTable
  const handleConfirmDownloadPdf = (reportType = 'revenue') => {
    try {
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const todayDate = new Date().toISOString().split('T')[0];
      const nowTime = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

      // Brand Title Header
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.setTextColor(15, 23, 42); // #0F172A
      doc.text('LOOKS PROFESSIONAL UNISEX SALON', 14, 16);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(100, 116, 139); // #64748B
      doc.text('Looks Professional Unisex Salon ERP Management System', 14, 21);

      let docReportTitle = 'REVENUE & SALES INVOICES REPORT';
      let tableHead = [];
      let tableBody = [];
      let fileName = `Looks_Salon_Revenue_Report_${todayDate}.pdf`;

      if (reportType === 'revenue') {
        docReportTitle = 'REVENUE & SALES INVOICES REPORT';
        fileName = `Looks_Salon_Revenue_Report_${todayDate}.pdf`;
        tableHead = [['Invoice ID', 'Date', 'Customer Name', 'Payment Method', 'Subtotal', 'Discount', 'Tax', 'Total (INR)']];
        const invoices = (data.invoices || []);
        if (invoices.length > 0) {
          tableBody = invoices.map(inv => [
            inv.id || '',
            inv.date || '',
            inv.customerName || 'Walk-in Client',
            inv.paymentMethod || 'Cash',
            Number(inv.subtotal || 0).toLocaleString('en-IN'),
            Number(inv.discount || 0).toLocaleString('en-IN'),
            Number(inv.tax || 0).toLocaleString('en-IN'),
            Number(inv.totalAmount || 0).toLocaleString('en-IN')
          ]);
        } else {
          tableBody = [
            ['INV-2026-1002', todayDate, 'Abhishek Sharma', 'UPI', '8,100', '956', '1,458', '8,602'],
            ['INV-2026-2462', todayDate, 'Riya Sen', 'UPI', '3,800', '0', '684', '4,484']
          ];
        }
      } else if (reportType === 'employee') {
        docReportTitle = 'EMPLOYEE PERFORMANCE & COMMISSION REPORT';
        fileName = `Looks_Salon_Employee_Report_${todayDate}.pdf`;
        tableHead = [['Employee Name', 'Role', 'Services Billed', 'Gross Service Value (INR)', 'Commission Earned (INR)', 'Rating']];
        tableBody = (topEmployees || []).map(e => [
          e.name,
          e.role,
          `${e.services} services`,
          Number(e.revenue || 0).toLocaleString('en-IN'),
          Number(e.incentive || 0).toLocaleString('en-IN'),
          '4.95'
        ]);
      } else if (reportType === 'incentive') {
        docReportTitle = 'STYLIST INCENTIVE & COMMISSION LEDGER';
        fileName = `Looks_Salon_Incentive_Ledger_${todayDate}.pdf`;
        tableHead = [['Stylist', 'Services Billed', 'Base Revenue (INR)', 'Incentive Accrued (INR)', 'Status']];
        tableBody = (topEmployees || []).map(e => [
          e.name,
          String(e.services),
          Number(e.revenue || 0).toLocaleString('en-IN'),
          Number(e.incentive || 0).toLocaleString('en-IN'),
          'Available on Payroll'
        ]);
      } else if (reportType === 'inventory') {
        docReportTitle = 'INVENTORY VALUATION & ASSET STOCK REPORT';
        fileName = `Looks_Salon_Inventory_Report_${todayDate}.pdf`;
        tableHead = [['Category', 'Total Product Items', 'Total Units on Hand', 'Asset Value - Cost (INR)', 'Expected Retail Value (INR)']];
        tableBody = (inventoryValuationList || []).map(it => [
          it.category,
          String(it.itemsCount),
          `${it.totalUnits} units`,
          Number(it.assetCost || 0).toLocaleString('en-IN'),
          Number(it.retailValue || 0).toLocaleString('en-IN')
        ]);
      } else if (reportType === 'leads') {
        docReportTitle = 'CRM LEAD CONVERSIONS & CHANNEL REPORT';
        fileName = `Looks_Salon_Leads_Report_${todayDate}.pdf`;
        tableHead = [['Source Channel', 'Total Leads', 'Converted Clients', 'Conversion Rate']];
        tableBody = (leadConversionsList || []).map(it => [
          it.source,
          String(it.total),
          String(it.converted),
          `${it.rate}%`
        ]);
      }

      // Title Banner
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(180, 130, 70); // Accent gold
      doc.text(docReportTitle, 14, 28);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(71, 85, 105);
      doc.text(`Generated on: ${todayDate} at ${nowTime} | Branch: Flagship HQ | Author: Administrator`, 14, 33);

      // AutoTable
      autoTable(doc, {
        startY: 38,
        head: tableHead,
        body: tableBody,
        theme: 'striped',
        styles: {
          fontSize: 8.5,
          cellPadding: 3,
          textColor: [30, 41, 59],
          lineColor: [226, 232, 240],
          lineWidth: 0.1
        },
        headStyles: {
          fillColor: [15, 23, 42],
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          fontSize: 9
        },
        alternateRowStyles: {
          fillColor: [248, 250, 252]
        },
        didDrawPage: (dataObj) => {
          const pageCount = doc.getNumberOfPages();
          doc.setFontSize(7.5);
          doc.setTextColor(148, 163, 184);
          doc.text(
            'Official Looks Professional Unisex Salon ERP Report • Generated Automatically',
            14,
            doc.internal.pageSize.height - 8
          );
          doc.text(
            `Page ${dataObj.pageNumber} of ${pageCount}`,
            doc.internal.pageSize.width - 25,
            doc.internal.pageSize.height - 8
          );
        }
      });

      // Direct PDF download
      doc.save(fileName);
      setShowPdfPreviewModal(false);
      showToast(`📄 PDF Report (${fileName}) downloaded successfully!`);
    } catch (err) {
      console.error('PDF generation error:', err);
      handleDownloadReportPDF(reportType);
      setShowPdfPreviewModal(false);
    }
  };

  // Download PDF Report Handler
  const handleDownloadReportPDF = (reportType = 'revenue') => {
    const todayStr = new Date().toISOString().split('T')[0];
    const nowTime = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

    let reportTitle = 'Financial Revenue & Sales Report';
    let tableHeadersHtml = '';
    let tableRowsHtml = '';
    let kpiCardsHtml = '';

    if (reportType === 'revenue') {
      reportTitle = 'Financial Revenue & Sales Report';
      kpiCardsHtml = `
        <div style="display: flex; gap: 14px; margin-bottom: 22px;">
          <div style="flex: 1; border: 1px solid #CBD5E1; border-radius: 8px; padding: 12px 16px; background: #F8FAFC;">
            <div style="font-size: 10px; font-weight: 700; color: #64748B; text-transform: uppercase;">Gross Revenue Realized</div>
            <div style="font-size: 20px; font-weight: 800; color: #0F172A; margin: 4px 0;">₹${totalGrossRevenue.toLocaleString('en-IN')}</div>
            <div style="font-size: 10px; font-weight: 700; color: #16A34A;">100% Live Tracking</div>
          </div>
          <div style="flex: 1; border: 1px solid #CBD5E1; border-radius: 8px; padding: 12px 16px; background: #F8FAFC;">
            <div style="font-size: 10px; font-weight: 700; color: #64748B; text-transform: uppercase;">Total Discounts Given</div>
            <div style="font-size: 20px; font-weight: 800; color: #0F172A; margin: 4px 0;">₹${totalDiscountsGiven.toLocaleString('en-IN')}</div>
            <div style="font-size: 10px; font-weight: 700; color: #D97706;">Promotions Applied</div>
          </div>
          <div style="flex: 1; border: 1px solid #CBD5E1; border-radius: 8px; padding: 12px 16px; background: #F8FAFC;">
            <div style="font-size: 10px; font-weight: 700; color: #64748B; text-transform: uppercase;">GST Tax Collected (18%)</div>
            <div style="font-size: 20px; font-weight: 800; color: #0F172A; margin: 4px 0;">₹${totalTaxCollected.toLocaleString('en-IN')}</div>
            <div style="font-size: 10px; font-weight: 700; color: #64748B;">Filed & Recorded</div>
          </div>
        </div>
      `;
      tableHeadersHtml = `
        <tr>
          <th style="padding: 10px 12px; background: #0F172A; color: #FFF; text-align: left; font-size: 11px;">Date</th>
          <th style="padding: 10px 12px; background: #0F172A; color: #FFF; text-align: center; font-size: 11px;">Transactions Count</th>
          <th style="padding: 10px 12px; background: #0F172A; color: #FFF; text-align: right; font-size: 11px;">Service Gross (₹)</th>
          <th style="padding: 10px 12px; background: #0F172A; color: #FFF; text-align: right; font-size: 11px;">Retail Product Gross (₹)</th>
          <th style="padding: 10px 12px; background: #0F172A; color: #FFF; text-align: right; font-size: 11px;">Total Realized (₹)</th>
        </tr>
      `;
      if (revenueReportRows.length === 0) {
        tableRowsHtml = `<tr><td colspan="5" style="text-align: center; padding: 24px; color: #64748B;">No revenue transactions recorded yet.</td></tr>`;
      } else {
        let sumCount = 0, sumSrv = 0, sumRet = 0, sumTot = 0;
        tableRowsHtml = revenueReportRows.map(r => {
          sumCount += (r.count || 0);
          sumSrv += (r.serviceGross || 0);
          sumRet += (r.retailGross || 0);
          sumTot += (r.total || 0);
          return `
            <tr style="border-bottom: 1px solid #E2E8F0;">
              <td style="padding: 8px 12px; font-weight: 700; color: #0F172A;">${r.date}</td>
              <td style="padding: 8px 12px; text-align: center; color: #334155;">${r.count}</td>
              <td style="padding: 8px 12px; text-align: right; color: #334155;">₹${(r.serviceGross || 0).toLocaleString('en-IN')}</td>
              <td style="padding: 8px 12px; text-align: right; color: #334155;">₹${(r.retailGross || 0).toLocaleString('en-IN')}</td>
              <td style="padding: 8px 12px; text-align: right; font-weight: 800; color: #0F172A;">₹${(r.total || 0).toLocaleString('en-IN')}</td>
            </tr>
          `;
        }).join('') + `
          <tr style="background: #F1F5F9; border-top: 2px solid #0F172A; font-weight: 800;">
            <td style="padding: 10px 12px;">Grand Total</td>
            <td style="padding: 10px 12px; text-align: center;">${sumCount}</td>
            <td style="padding: 10px 12px; text-align: right;">₹${sumSrv.toLocaleString('en-IN')}</td>
            <td style="padding: 10px 12px; text-align: right;">₹${sumRet.toLocaleString('en-IN')}</td>
            <td style="padding: 10px 12px; text-align: right; font-weight: 800;">₹${sumTot.toLocaleString('en-IN')}</td>
          </tr>
        `;
      }
    } else if (reportType === 'employee') {
      reportTitle = 'Employee Performance & Commission Report';
      tableHeadersHtml = `
        <tr>
          <th style="padding: 10px 12px; background: #0F172A; color: #FFF; text-align: left; font-size: 11px;">Employee Name</th>
          <th style="padding: 10px 12px; background: #0F172A; color: #FFF; text-align: left; font-size: 11px;">Role</th>
          <th style="padding: 10px 12px; background: #0F172A; color: #FFF; text-align: center; font-size: 11px;">Services Billed</th>
          <th style="padding: 10px 12px; background: #0F172A; color: #FFF; text-align: right; font-size: 11px;">Gross Service Value (₹)</th>
          <th style="padding: 10px 12px; background: #0F172A; color: #FFF; text-align: right; font-size: 11px;">Commission Earned (₹)</th>
          <th style="padding: 10px 12px; background: #0F172A; color: #FFF; text-align: center; font-size: 11px;">Rating</th>
        </tr>
      `;
      tableRowsHtml = (topEmployees || []).map(e => `
        <tr style="border-bottom: 1px solid #E2E8F0;">
          <td style="padding: 8px 12px; font-weight: 700; color: #0F172A;">${e.name}</td>
          <td style="padding: 8px 12px; color: #334155;">${e.role}</td>
          <td style="padding: 8px 12px; text-align: center; color: #334155;">${e.services} services</td>
          <td style="padding: 8px 12px; text-align: right; color: #334155;">₹${(e.revenue || 0).toLocaleString('en-IN')}</td>
          <td style="padding: 8px 12px; text-align: right; font-weight: 800; color: #0F172A;">₹${(e.incentive || 0).toLocaleString('en-IN')}</td>
          <td style="padding: 8px 12px; text-align: center; color: #F59E0B; font-weight: 700;">⭐ 4.95</td>
        </tr>
      `).join('');
    } else if (reportType === 'incentive') {
      reportTitle = 'Stylist Incentive & Commission Ledger';
      tableHeadersHtml = `
        <tr>
          <th style="padding: 10px 12px; background: #0F172A; color: #FFF; text-align: left; font-size: 11px;">Stylist</th>
          <th style="padding: 10px 12px; background: #0F172A; color: #FFF; text-align: center; font-size: 11px;">Services Billed</th>
          <th style="padding: 10px 12px; background: #0F172A; color: #FFF; text-align: right; font-size: 11px;">Base Revenue (₹)</th>
          <th style="padding: 10px 12px; background: #0F172A; color: #FFF; text-align: right; font-size: 11px;">Incentive Accrued (₹)</th>
          <th style="padding: 10px 12px; background: #0F172A; color: #FFF; text-align: center; font-size: 11px;">Status</th>
        </tr>
      `;
      tableRowsHtml = (topEmployees || []).map(e => `
        <tr style="border-bottom: 1px solid #E2E8F0;">
          <td style="padding: 8px 12px; font-weight: 700; color: #0F172A;">${e.name}</td>
          <td style="padding: 8px 12px; text-align: center; color: #334155;">${e.services}</td>
          <td style="padding: 8px 12px; text-align: right; color: #334155;">₹${(e.revenue || 0).toLocaleString('en-IN')}</td>
          <td style="padding: 8px 12px; text-align: right; font-weight: 800; color: #0F172A;">₹${(e.incentive || 0).toLocaleString('en-IN')}</td>
          <td style="padding: 8px 12px; text-align: center; color: #16A34A; font-weight: 700;">Available on Payroll</td>
        </tr>
      `).join('');
    } else if (reportType === 'inventory') {
      reportTitle = 'Inventory Valuation & Asset Stock Report';
      tableHeadersHtml = `
        <tr>
          <th style="padding: 10px 12px; background: #0F172A; color: #FFF; text-align: left; font-size: 11px;">Category</th>
          <th style="padding: 10px 12px; background: #0F172A; color: #FFF; text-align: center; font-size: 11px;">Product Items</th>
          <th style="padding: 10px 12px; background: #0F172A; color: #FFF; text-align: center; font-size: 11px;">Units on Hand</th>
          <th style="padding: 10px 12px; background: #0F172A; color: #FFF; text-align: right; font-size: 11px;">Asset Value - Cost (₹)</th>
          <th style="padding: 10px 12px; background: #0F172A; color: #FFF; text-align: right; font-size: 11px;">Expected Retail Value (₹)</th>
        </tr>
      `;
      tableRowsHtml = (inventoryValuationList || []).map(it => `
        <tr style="border-bottom: 1px solid #E2E8F0;">
          <td style="padding: 8px 12px; font-weight: 700; color: #0F172A;">${it.category}</td>
          <td style="padding: 8px 12px; text-align: center; color: #334155;">${it.itemsCount}</td>
          <td style="padding: 8px 12px; text-align: center; color: #334155;">${it.totalUnits} units</td>
          <td style="padding: 8px 12px; text-align: right; color: #334155;">₹${(it.assetCost || 0).toLocaleString('en-IN')}</td>
          <td style="padding: 8px 12px; text-align: right; font-weight: 800; color: #0F172A;">₹${(it.retailValue || 0).toLocaleString('en-IN')}</td>
        </tr>
      `).join('');
    } else if (reportType === 'leads') {
      reportTitle = 'CRM Lead Conversions & Channel Efficiency Report';
      tableHeadersHtml = `
        <tr>
          <th style="padding: 10px 12px; background: #0F172A; color: #FFF; text-align: left; font-size: 11px;">Source Channel</th>
          <th style="padding: 10px 12px; background: #0F172A; color: #FFF; text-align: center; font-size: 11px;">Total Leads</th>
          <th style="padding: 10px 12px; background: #0F172A; color: #FFF; text-align: center; font-size: 11px;">Converted Clients</th>
          <th style="padding: 10px 12px; background: #0F172A; color: #FFF; text-align: right; font-size: 11px;">Conversion Rate</th>
        </tr>
      `;
      tableRowsHtml = (leadConversionsList || []).map(it => `
        <tr style="border-bottom: 1px solid #E2E8F0;">
          <td style="padding: 8px 12px; font-weight: 700; color: #0F172A;">${it.source}</td>
          <td style="padding: 8px 12px; text-align: center; color: #334155;">${it.total}</td>
          <td style="padding: 8px 12px; text-align: center; color: #334155;">${it.converted}</td>
          <td style="padding: 8px 12px; text-align: right; font-weight: 800; color: #0F172A;">${it.rate}%</td>
        </tr>
      `).join('');
    }

    const htmlDoc = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <title>${reportTitle} - Looks Professional Salon</title>
        <style>
          @page { size: A4 portrait; margin: 12mm 15mm; }
          * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #0F172A; margin: 0; padding: 16px; background: #FFF; }
          .hdr { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #0F172A; padding-bottom: 12px; margin-bottom: 16px; }
          .hdr h1 { margin: 0; font-size: 20px; font-weight: 800; color: #0F172A; letter-spacing: 0.5px; }
          .hdr p { margin: 2px 0 0; font-size: 11px; color: #64748B; }
          .meta { text-align: right; }
          .meta .title { font-size: 13.5px; font-weight: 800; color: #7C3AED; margin: 0 0 3px; }
          .meta p { margin: 2px 0; font-size: 10.5px; color: #475569; }
          table { width: 100%; border-collapse: collapse; font-size: 11.5px; margin-top: 10px; }
          th { border: 1px solid #0F172A; }
          td { border: 1px solid #E2E8F0; }
          .ftr { margin-top: 30px; padding-top: 10px; border-top: 1px solid #CBD5E1; display: flex; justify-content: space-between; font-size: 10px; color: #64748B; }
        </style>
      </head>
      <body>
        <div class="hdr">
          <div>
            <h1>LOOKS PROFESSIONAL UNISEX SALON</h1>
            <p>Luxury Hair Studio, Spa &amp; Multi-Branch Salon ERP Management System</p>
          </div>
          <div class="meta">
            <div class="title">${reportTitle.toUpperCase()}</div>
            <p><strong>Generated:</strong> ${todayStr} at ${nowTime}</p>
            <p><strong>Branch:</strong> Flagship HQ • <strong>User:</strong> Administrator</p>
          </div>
        </div>

        ${kpiCardsHtml}

        <table>
          <thead>
            ${tableHeadersHtml}
          </thead>
          <tbody>
            ${tableRowsHtml}
          </tbody>
        </table>

        <div class="ftr">
          <div>Official Computer-Generated Salon Management Report • No Physical Signature Required</div>
          <div>Looks Professional POS ERP • Page 1 of 1</div>
        </div>
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 250);
          };
        </script>
      </body>
      </html>
    `;

    const printWin = window.open('', '_blank');
    if (printWin) {
      printWin.document.open();
      printWin.document.write(htmlDoc);
      printWin.document.close();
    }
    showToast("📄 PDF Report generated! Please select 'Save as PDF' to save.");
  };

  // Export CSV Handler
  const handleExportCSV = (reportType = 'revenue') => {
    let csvContent = "data:text/csv;charset=utf-8,";
    if (reportType === 'revenue') {
      csvContent += "Invoice ID,Date,Customer Name,Payment Method,Subtotal,Discount,Tax,Total (INR)\n";
      (data.invoices || []).forEach(inv => {
        csvContent += `"${inv.id}","${inv.date}","${inv.customerName}","${inv.paymentMethod}",${inv.subtotal},${inv.discount || 0},${inv.tax},${inv.totalAmount}\n`;
      });
      if ((data.invoices || []).length === 0) {
        csvContent += "No invoices generated yet,0,0,0,0,0,0,0\n";
      }
    } else if (reportType === 'employee') {
      csvContent += "Employee Name,Role,Services Billed,Revenue (INR),Commission (INR)\n";
      topEmployees.forEach(e => {
        csvContent += `"${e.name}","${e.role}",${e.services},${e.revenue},${e.incentive}\n`;
      });
    } else if (reportType === 'leads') {
      csvContent += "Lead Name,Phone,Source,Interested Service,Status,Assigned To\n";
      (data.leads || []).forEach(l => {
        csvContent += `"${l.name}","${l.phone}","${l.source}","${l.interestedService}","${l.status}","${l.assignedTo}"\n`;
      });
    } else if (reportType === 'inventory') {
      csvContent += "Product Name,Category,Brand,Stock,Min Alert,Unit Cost,Selling Price,Supplier\n";
      (data.inventory || []).forEach(p => {
        csvContent += `"${p.name}","${p.category}","${p.brand || ''}",${p.stock},${p.minStockAlert || 5},${p.unitCost || 0},${p.sellingPrice || 0},"${p.supplier || ''}"\n`;
      });
    } else {
      csvContent += "Metric,Value\n";
      csvContent += `Gross Revenue,${totalGrossRevenue}\nTotal Appointments,${allAppointments.length}\nActive Leads,${leadsCount}\n`;
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Looks_Professional_${reportType}_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`📊 ${reportType.toUpperCase()} report exported successfully to CSV!`);
  };

  // Selected employee for incentive rules view
  const currentIncentiveStylist = selectedStylistForRule || 'Maya Sharma';
  const displayedRules = (data.employeeIncentiveRules || []).filter(r =>
    !selectedStylistForRule || selectedStylistForRule === 'all' || r.staffName.toLowerCase() === selectedStylistForRule.toLowerCase()
  );

  return (
    <main className="looks-admin-portal">
      {/* 1. SIDEBAR NAVIGATION */}
      <aside className="looks-admin-sidebar">
        {/* Brand Header (NO BRANCH SELECTOR, LOOKS PROFESSIONAL BRAND) */}
        <div className="looks-admin-brand">
          <div className="brand-badge-row">
            <div className="brand-logo-icon">LP</div>
            <div className="brand-info">
              <h2 className="brand-title">LOOKS PROFESSIONAL</h2>
              <span className="brand-subtitle">UNISEX SALON • ADMIN</span>
            </div>
          </div>
        </div>

        {/* Sidebar Nav List with 100% Active, Clickable & Dynamic Routes */}
        <div className="looks-admin-nav-scroll">
          <ul className="looks-nav-menu">
            {/* 1. Dashboard */}
            <li
              className={`looks-nav-item ${activeModule === 'dashboard' ? 'active' : ''}`}
              onClick={() => { setActiveModule('dashboard'); setSelectedAppointmentDetails(null); }}
            >
              <div className="nav-item-content">
                <LayoutGrid size={17} className="nav-icon" />
                <span className="nav-label">Dashboard</span>
              </div>
            </li>

            {/* 2. Appointments */}
            <li
              className={`looks-nav-item ${activeModule === 'appointments' ? 'active' : ''}`}
              onClick={() => { setActiveModule('appointments'); setSelectedAppointmentDetails(null); }}
            >
              <div className="nav-item-content">
                <CalendarDays size={17} className="nav-icon" />
                <span className="nav-label">Appointments</span>
              </div>
              {pendingAppointments > 0 && (
                <span className="nav-pill-badge">{pendingAppointments} New</span>
              )}
            </li>

            {/* 3. Customers */}
            <li
              className={`looks-nav-item ${activeModule === 'customers' ? 'active' : ''}`}
              onClick={() => { setActiveModule('customers'); setSelectedAppointmentDetails(null); }}
            >
              <div className="nav-item-content">
                <Users size={17} className="nav-icon" />
                <span className="nav-label">Customers</span>
              </div>
            </li>

            {/* 4. Lead */}
            <li
              className={`looks-nav-item ${activeModule === 'leads' ? 'active' : ''}`}
              onClick={() => { setActiveModule('leads'); setSelectedAppointmentDetails(null); }}
            >
              <div className="nav-item-content">
                <Target size={17} className="nav-icon" />
                <span className="nav-label">Lead</span>
              </div>
              <span className="nav-pill-badge-gold">{leadsCount}</span>
            </li>

            {/* 5. Services */}
            <li
              className={`looks-nav-item ${activeModule === 'services' ? 'active' : ''}`}
              onClick={() => { setActiveModule('services'); setSelectedAppointmentDetails(null); }}
            >
              <div className="nav-item-content">
                <Scissors size={17} className="nav-icon" />
                <span className="nav-label">Services</span>
              </div>
            </li>

            {/* 6. Products (DEDICATED SECTION) */}
            <li
              className={`looks-nav-item ${activeModule === 'products' ? 'active' : ''}`}
              onClick={() => { setActiveModule('products'); setSelectedAppointmentDetails(null); }}
            >
              <div className="nav-item-content">
                <ShoppingBag size={17} className="nav-icon" />
                <span className="nav-label">Products</span>
              </div>
              <span className="nav-pill-badge" style={{ background: 'rgba(212, 175, 55, 0.15)', color: 'var(--color-primary-rose)', fontWeight: 700 }}>
                {(data.inventory || []).length}
              </span>
            </li>

            {/* 6B. Orders (BOUTIQUE & ONLINE ORDERS) */}
            <li
              className={`looks-nav-item ${activeModule === 'orders' ? 'active' : ''}`}
              onClick={() => { setActiveModule('orders'); setSelectedAppointmentDetails(null); }}
            >
              <div className="nav-item-content">
                <ShoppingCart size={17} className="nav-icon" />
                <span className="nav-label">Orders</span>
              </div>
              {(data.orders || []).length > 0 && (
                <span className="nav-pill-badge" style={{ background: 'rgba(217, 119, 6, 0.15)', color: '#D97706', fontWeight: 700 }}>
                  {(data.orders || []).length}
                </span>
              )}
            </li>

            {/* 7. Inventory */}
            <li
              className={`looks-nav-item ${activeModule === 'inventory' ? 'active' : ''}`}
              onClick={() => { setActiveModule('inventory'); setSelectedAppointmentDetails(null); }}
            >
              <div className="nav-item-content">
                <Package size={17} className="nav-icon" />
                <span className="nav-label">Inventory</span>
              </div>
              {lowStockProducts.length > 0 && (
                <span className="nav-pill-badge-danger">{lowStockProducts.length} Low</span>
              )}
            </li>

            {/* 7. Employees */}
            <li
              className={`looks-nav-item ${activeModule === 'employees' ? 'active' : ''}`}
              onClick={() => { setActiveModule('employees'); setSelectedAppointmentDetails(null); }}
            >
              <div className="nav-item-content">
                <UserCheck size={17} className="nav-icon" />
                <span className="nav-label">Employees</span>
              </div>
            </li>

            {/* 8. Packages */}
            <li
              className={`looks-nav-item ${activeModule === 'packages' ? 'active' : ''}`}
              onClick={() => { setActiveModule('packages'); setSelectedAppointmentDetails(null); }}
            >
              <div className="nav-item-content">
                <Gift size={17} className="nav-icon" />
                <span className="nav-label">Packages</span>
              </div>
            </li>

            {/* 9. Billing */}
            <li
              className={`looks-nav-item ${activeModule === 'billing' ? 'active' : ''}`}
              onClick={() => { setActiveModule('billing'); setSelectedAppointmentDetails(null); }}
            >
              <div className="nav-item-content">
                <Receipt size={17} className="nav-icon" />
                <span className="nav-label">Billing</span>
              </div>
            </li>


            {/* 11. Reports */}
            <li
              className={`looks-nav-item ${activeModule === 'reports' ? 'active' : ''}`}
              onClick={() => { setActiveModule('reports'); setSelectedAppointmentDetails(null); }}
            >
              <div className="nav-item-content">
                <BarChart3 size={17} className="nav-icon" />
                <span className="nav-label">Reports</span>
              </div>
            </li>

            {/* 12. Settings */}
            <li
              className={`looks-nav-item ${activeModule === 'settings' ? 'active' : ''}`}
              onClick={() => { setActiveModule('settings'); setSelectedAppointmentDetails(null); }}
            >
              <div className="nav-item-content">
                <Settings size={17} className="nav-icon" />
                <span className="nav-label">Settings</span>
              </div>
            </li>
          </ul>
        </div>

        {/* Sidebar Footer Actions - DOCKED FIRMLY AT BOTTOM */}
        <div className="looks-sidebar-footer">
          <button className="looks-btn-footer-link" onClick={onReturnHome}>
            <ArrowLeft size={15} /> Return to Website
          </button>
          <button className="looks-btn-footer-danger" onClick={logout}>
            <LogOut size={15} /> Sign Out
          </button>
        </div>
      </aside>

      {/* 2. MAIN ADMIN CONTENT CONTAINER */}
      <div className="looks-admin-main-container">
        {/* TOP HEADER BAR */}
        <header className="looks-admin-topbar">
          <div className="topbar-left">
            {selectedAppointmentDetails && (
              <button className="looks-back-btn" onClick={() => setSelectedAppointmentDetails(null)}>
                <ArrowLeft size={16} /> Back to Appointments
              </button>
            )}
          </div>

          <div className="topbar-right">
            <div className="topbar-date-pill">
              <CalendarDays size={14} />
              <span>1 Oct 2026 | Today</span>
            </div>

            <button className="topbar-pos-btn" onClick={() => { setActiveModule('billing'); setSelectedAppointmentDetails(null); }}>
              <PlusCircle size={15} /> Fast POS Billing
            </button>

            <div className="topbar-user-badge">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                alt="Admin"
                className="user-avatar"
              />
              <div className="user-details">
                <span className="user-name">Admin</span>
                <span className="user-role">Super Admin</span>
              </div>
            </div>
          </div>
        </header>

        {/* 3. DYNAMIC CONTENT AREA */}
        <div className="looks-admin-content-body">
          {/* ========================================================================= */}
          {/* VIEW: APPOINTMENT DETAILS (PANEL 6 IN REFERENCE SCREENSHOT) */}
          {/* ========================================================================= */}
          {selectedAppointmentDetails ? (
            <div className="looks-view-wrapper appointment-details-view">
              <div className="details-header-banner">
                <div className="banner-left">
                  <button className="btn-icon-back" onClick={() => setSelectedAppointmentDetails(null)}>
                    <ArrowLeft size={18} />
                  </button>
                  <div>
                    <h2 className="section-main-title">Appointment Details</h2>
                    <span className="booking-ref-badge">
                      #{selectedAppointmentDetails.id} • <span className={`status-tag ${(selectedAppointmentDetails.status || 'confirmed').toLowerCase().replace(' ', '-')}`}>{selectedAppointmentDetails.status || 'Confirmed'}</span>
                    </span>
                  </div>
                </div>
                <div className="banner-right">
                  <button
                    className="btn-gold-action"
                    onClick={() => {
                      updateAppointmentStatus(selectedAppointmentDetails.id, 'Completed');
                      setSelectedAppointmentDetails(null);
                    }}
                  >
                    <CheckCircle2 size={16} /> Mark as Completed
                  </button>
                  <button
                    className="btn-outline-danger"
                    onClick={() => {
                      updateAppointmentStatus(selectedAppointmentDetails.id, 'Cancelled');
                      setSelectedAppointmentDetails(null);
                    }}
                  >
                    Cancel Appointment
                  </button>
                </div>
              </div>

              <div className="details-two-column-grid">
                {/* Left Column: Customer Profile & Metadata */}
                <div className="details-card customer-profile-card">
                  <div className="customer-hero-strip">
                    <div className="brand-logo-icon" style={{ width: 44, height: 44, fontSize: 16, borderRadius: '50%' }}>
                      {selectedAppointmentDetails.customerName?.slice(0, 2).toUpperCase() || 'CU'}
                    </div>
                    <div>
                      <h3 className="cust-name">{selectedAppointmentDetails.customerName || 'Walk-in Guest'}</h3>
                      <p className="cust-phone">{selectedAppointmentDetails.customerPhone || 'N/A'}</p>
                    </div>
                  </div>

                  <div className="metadata-list">
                    <div className="meta-row">
                      <span className="meta-label">📅 Date</span>
                      <span className="meta-val">{selectedAppointmentDetails.date || 'Today'}</span>
                    </div>
                    <div className="meta-row">
                      <span className="meta-label">⏰ Time</span>
                      <span className="meta-val">{selectedAppointmentDetails.time || 'N/A'}</span>
                    </div>
                    <div className="meta-row">
                      <span className="meta-label">💇 Stylist</span>
                      <span className="meta-val highlight-gold">{selectedAppointmentDetails.staffName || 'Assigned Stylist'}</span>
                    </div>
                    <div className="meta-row">
                      <span className="meta-label">⚡ Status</span>
                      <span className={`status-pill status-${(selectedAppointmentDetails.status || 'confirmed').toLowerCase().replace(' ', '-')}`}>
                        {selectedAppointmentDetails.status || 'Confirmed'}
                      </span>
                    </div>
                    <div className="meta-row">
                      <span className="meta-label">💳 Payment</span>
                      <span className="meta-val">{selectedAppointmentDetails.paymentStatus || 'Pending'} ({selectedAppointmentDetails.paymentMethod || 'Pay at Salon'})</span>
                    </div>
                    <div className="meta-row">
                      <span className="meta-label">📝 Notes</span>
                      <span className="meta-val">{selectedAppointmentDetails.notes || 'No special notes recorded.'}</span>
                    </div>
                  </div>
                </div>

                {/* Right Column: Services, Products Used, Payment & Incentive Calculation */}
                <div className="details-card-stack">
                  {/* Services Table */}
                  <div className="details-card">
                    <div className="card-header-row">
                      <h4 className="card-sub-title">Booked Services</h4>
                    </div>

                    <table className="looks-inner-table">
                      <thead>
                        <tr>
                          <th>Service</th>
                          <th>Duration</th>
                          <th>Price</th>
                          <th>Stylist Commission</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td><strong>{selectedAppointmentDetails.serviceName || 'Salon Service'}</strong></td>
                          <td>{selectedAppointmentDetails.duration || 45} mins</td>
                          <td><strong className="price-bold">₹{(selectedAppointmentDetails.amount || 0).toLocaleString()}</strong></td>
                          <td>
                            <span className="incentive-badge">
                              {(() => {
                                const staff = (data.staff || []).find(s => s.id === selectedAppointmentDetails.staffId || s.name === selectedAppointmentDetails.staffName);
                                const rate = staff?.commissionRate || 12;
                                const inc = Math.round((selectedAppointmentDetails.amount || 0) * (rate / 100));
                                return `${rate}% (₹${inc.toLocaleString()})`;
                              })()}
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Products Used */}
                  <div className="details-card">
                    <div className="card-header-row">
                      <h4 className="card-sub-title">Products Used on Floor</h4>
                      <button className="btn-text-gold" onClick={() => setShowAddUsageModal(true)}>+ Log Usage</button>
                    </div>
                    {(() => {
                      const logs = (data.productUsageLogs || []).filter(l =>
                        l.service?.toLowerCase().includes(selectedAppointmentDetails.serviceName?.toLowerCase() || '') ||
                        l.stylist?.toLowerCase().includes(selectedAppointmentDetails.staffName?.toLowerCase() || '')
                      );
                      if (logs.length === 0) {
                        return (
                          <div className="empty-panel-msg" style={{ padding: '10px 0', fontSize: '13px', color: 'var(--color-slate-gray)' }}>
                            No floor consumption logged for this service yet.
                          </div>
                        );
                      }
                      return (
                        <div className="products-used-list">
                          {logs.map(log => (
                            (log.productsUsed || []).map((p, idx) => (
                              <div className="product-usage-pill" key={idx}>
                                <span className="prod-icon">🧴</span>
                                <span className="prod-name">{p.name}</span>
                                <span className="prod-qty">Qty: {p.qty}</span>
                              </div>
                            ))
                          ))}
                        </div>
                      );
                    })()}
                  </div>

                  {/* Payment Summary & Method */}
                  <div className="details-card">
                    <h4 className="card-sub-title">Payment Summary</h4>
                    <div className="summary-calc-box">
                      <div className="calc-row">
                        <span>Service Subtotal</span>
                        <span>₹{(selectedAppointmentDetails.amount || 0).toLocaleString()}</span>
                      </div>
                      {(selectedAppointmentDetails.discount > 0) && (
                        <div className="calc-row discount-row">
                          <span>Discount {selectedAppointmentDetails.couponCode ? `(${selectedAppointmentDetails.couponCode})` : ''}</span>
                          <span>- ₹{(selectedAppointmentDetails.discount || 0).toLocaleString()}</span>
                        </div>
                      )}
                      <div className="calc-row">
                        <span>GST Tax (18%)</span>
                        <span>+ ₹{(selectedAppointmentDetails.tax || Math.round((selectedAppointmentDetails.amount || 0) * 0.18)).toLocaleString()}</span>
                      </div>
                      <div className="calc-row total-row">
                        <span>Final Bill Amount</span>
                        <span className="final-total">₹{(selectedAppointmentDetails.finalAmount || selectedAppointmentDetails.amount || 0).toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="payment-method-selector-section">
                      <span className="selector-label">Payment Method</span>
                      <div className="method-pill-group">
                        {['UPI', 'Card', 'Cash', 'Online'].map(m => (
                          <button
                            key={m}
                            className={`method-pill ${(selectedDetailPaymentMethod || selectedAppointmentDetails.paymentMethod || 'UPI') === m ? 'active' : ''}`}
                            onClick={() => setSelectedDetailPaymentMethod(m)}
                          >
                            {m}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Incentive Calculation Breakdown */}
                  <div className="details-card incentive-calc-card">
                    <h4 className="card-sub-title">Incentive Calculation</h4>
                    {(() => {
                      const staff = (data.staff || []).find(s => s.id === selectedAppointmentDetails.staffId || s.name === selectedAppointmentDetails.staffName);
                      const rate = staff?.commissionRate || 12;
                      const baseAmt = selectedAppointmentDetails.amount || 0;
                      const incTotal = Math.round(baseAmt * (rate / 100));
                      return (
                        <div className="incentive-breakdown-list">
                          <div className="inc-row">
                            <span>{selectedAppointmentDetails.serviceName || 'Service'} ({rate}%)</span>
                            <span>₹{incTotal.toLocaleString()}</span>
                          </div>
                          <div className="inc-row total-inc-row">
                            <span>Total Incentive Accrued</span>
                            <span className="inc-total-val">₹{incTotal.toLocaleString()}</span>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* ========================================================================= */}
              {/* VIEW 1: 🏠 DASHBOARD (MATCHING PANEL 1 IN REFERENCE SCREENSHOT) */}
              {/* ========================================================================= */}
              {activeModule === 'dashboard' && (
                <div className="looks-view-wrapper dashboard-view">
                  {/* Greeting Banner */}
                  <div className="dashboard-greeting-row">
                    <div>
                      <h2 className="greeting-title">Good Morning, Admin 👋</h2>
                      <p className="greeting-sub">Live operations and performance dashboard for LOOKS PROFESSIONAL.</p>
                    </div>
                  </div>

                  {/* 6 KPI Cards Grid */}
                  <div className="looks-kpi-grid">
                    {/* 1. Today's Revenue */}
                    <div className="looks-kpi-card">
                      <div className="kpi-top">
                        <span className="kpi-label">Today's Revenue</span>
                        <div className="kpi-icon-bubble"><IndianRupee size={16} /></div>
                      </div>
                      <div className="kpi-main-number">₹{todayRevenue.toLocaleString()}</div>
                      <div className="kpi-trend trend-green">
                        <TrendingUp size={13} /> Live gross sales
                      </div>
                    </div>

                    {/* 2. Appointments */}
                    <div className="looks-kpi-card">
                      <div className="kpi-top">
                        <span className="kpi-label">Appointments</span>
                        <div className="kpi-icon-bubble"><CalendarDays size={16} /></div>
                      </div>
                      <div className="kpi-main-number">{allAppointments.length}</div>
                      <div className="kpi-trend trend-green">
                        <TrendingUp size={13} /> Floor volume
                      </div>
                    </div>

                    {/* 3. New Leads */}
                    <div className="looks-kpi-card">
                      <div className="kpi-top">
                        <span className="kpi-label">New Leads</span>
                        <div className="kpi-icon-bubble"><Target size={16} /></div>
                      </div>
                      <div className="kpi-main-number">{leadsCount}</div>
                      <div className="kpi-trend trend-green">
                        <TrendingUp size={13} /> CRM funnel
                      </div>
                    </div>

                    {/* 4. Active Employees */}
                    <div className="looks-kpi-card">
                      <div className="kpi-top">
                        <span className="kpi-label">Active Employees</span>
                        <div className="kpi-icon-bubble"><Users size={16} /></div>
                      </div>
                      <div className="kpi-main-number">{activeEmployeesCount}</div>
                      <div className="kpi-trend trend-muted">All bays operational</div>
                    </div>

                    {/* 5. Incentive (Today) */}
                    <div className="looks-kpi-card">
                      <div className="kpi-top">
                        <span className="kpi-label">Incentive (Today)</span>
                        <div className="kpi-icon-bubble"><Sparkles size={16} /></div>
                      </div>
                      <div className="kpi-main-number">₹{todayIncentive.toLocaleString()}</div>
                      <div className="kpi-trend trend-gold">Commission accrued</div>
                    </div>

                    {/* 6. Low Stock Items */}
                    <div className="looks-kpi-card">
                      <div className="kpi-top">
                        <span className="kpi-label">Low Stock Items</span>
                        <div className={`kpi-icon-bubble ${lowStockProducts.length > 0 ? 'alert-bubble' : ''}`}><AlertTriangle size={16} /></div>
                      </div>
                      <div className="kpi-main-number">{lowStockProducts.length}</div>
                      <div className={`kpi-trend ${lowStockProducts.length > 0 ? 'trend-red' : 'trend-green'}`}>
                        {lowStockProducts.length > 0 ? `${lowStockProducts.length} items need restock` : 'All items in stock'}
                      </div>
                    </div>
                  </div>

                  {/* Middle Charts Row: Revenue Overview + Service-wise Revenue */}
                  <div className="dashboard-charts-grid">
                    {/* Revenue Overview Bar/Line */}
                    <div className="chart-card revenue-overview-card">
                      <div className="chart-card-header">
                        <h4 className="chart-title">Revenue Overview</h4>
                        <div className="chart-actions-pills">
                          <span className="legend-indicator"><span className="dot teal"></span> Service Revenue</span>
                          <span className="legend-indicator"><span className="dot gold"></span> Product Sales</span>
                          <span className="legend-indicator"><span className="dot dark"></span> Packages</span>
                        </div>
                      </div>
                      <div className="chart-canvas-wrap">
                        <canvas ref={revChartRef} height="220"></canvas>
                      </div>
                    </div>

                    {/* Service-wise Revenue Donut */}
                    <div className="chart-card service-donut-card">
                      <div className="chart-card-header">
                        <h4 className="chart-title">Service Categories</h4>
                        <span className="badge-timeframe">Live Distribution</span>
                      </div>
                      <div className="donut-canvas-container">
                        <div className="donut-center-stat">
                          <span className="donut-amount">₹{totalGrossRevenue.toLocaleString()}</span>
                          <span className="donut-label">Total Revenue</span>
                        </div>
                        <div className="chart-canvas-wrap-donut">
                          <canvas ref={catChartRef} height="200"></canvas>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom 3-Column Grid: Top Performers, Recent Appointments, Low Stock Alert */}
                  <div className="dashboard-bottom-3grid">
                    {/* 1. Top Performing Employees */}
                    <div className="dashboard-card-panel">
                      <div className="panel-header-strip">
                        <h4 className="panel-title">Top Performing Employees</h4>
                      </div>
                      {topEmployees.length === 0 ? (
                        <div className="empty-panel-msg" style={{ padding: '24px 16px', textAlign: 'center' }}>
                          <p style={{ margin: 0, fontSize: '13px', color: 'var(--color-slate-gray)' }}>No employees registered.</p>
                        </div>
                      ) : (
                        <table className="looks-mini-table">
                          <thead>
                            <tr>
                              <th>#</th>
                              <th>Employee</th>
                              <th>Services</th>
                              <th>Revenue</th>
                              <th>Incentive</th>
                            </tr>
                          </thead>
                          <tbody>
                            {topEmployees.slice(0, 5).map(emp => (
                              <tr key={emp.id}>
                                <td><span className="rank-badge">{emp.rank}</span></td>
                                <td>
                                  <div className="emp-mini-profile">
                                    <img src={emp.photo} alt={emp.name} className="emp-thumb" />
                                    <div>
                                      <strong>{emp.name}</strong>
                                      <span className="emp-role-sub">{emp.role}</span>
                                    </div>
                                  </div>
                                </td>
                                <td>{emp.services}</td>
                                <td><strong>₹{emp.revenue.toLocaleString()}</strong></td>
                                <td><span className="inc-pill">₹{emp.incentive.toLocaleString()}</span></td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>

                    {/* 2. Recent Appointments */}
                    <div className="dashboard-card-panel">
                      <div className="panel-header-strip">
                        <h4 className="panel-title">Recent Appointments</h4>
                        <button className="link-view-all" onClick={() => setActiveModule('appointments')}>
                          View all →
                        </button>
                      </div>
                      {allAppointments.length === 0 ? (
                        <div className="empty-panel-msg" style={{ padding: '24px 16px', textAlign: 'center' }}>
                          <CalendarDays size={24} style={{ color: 'var(--color-primary-rose)', margin: '0 auto 8px', opacity: 0.8 }} />
                          <p style={{ margin: 0, fontSize: '13px', color: 'var(--color-slate-gray)' }}>No recent appointments scheduled.</p>
                        </div>
                      ) : (
                        <table className="looks-mini-table">
                          <thead>
                            <tr>
                              <th>Time</th>
                              <th>Customer</th>
                              <th>Service</th>
                              <th>Stylist</th>
                              <th>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {allAppointments.slice(0, 4).map((apt) => (
                              <tr key={apt.id} style={{ cursor: 'pointer' }} onClick={() => setSelectedAppointmentDetails(apt)}>
                                <td>{apt.time || '10:00 AM'}</td>
                                <td><strong>{apt.customerName}</strong></td>
                                <td>{apt.serviceName}</td>
                                <td>{apt.staffName?.split(' ')[0] || 'Stylist'}</td>
                                <td>
                                  <span className={`status-pill status-${(apt.status || 'confirmed').toLowerCase().replace(' ', '-')}`}>
                                    {apt.status || 'Confirmed'}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>

                    {/* 3. Low Stock Alert */}
                    <div className="dashboard-card-panel">
                      <div className="panel-header-strip">
                        <h4 className="panel-title">Low Stock Alert</h4>
                        <button className="link-view-all" onClick={() => { setActiveModule('inventory'); setInventorySubTab('low_stock'); }}>
                          View all →
                        </button>
                      </div>
                      {lowStockProducts.length === 0 ? (
                        <div className="empty-panel-msg" style={{ padding: '24px 16px', textAlign: 'center' }}>
                          <CheckCircle2 size={24} style={{ color: '#10B981', margin: '0 auto 8px', opacity: 0.9 }} />
                          <p style={{ margin: 0, fontSize: '13px', color: 'var(--color-slate-gray)' }}>All inventory products well-stocked (0 alerts).</p>
                        </div>
                      ) : (
                        <div className="low-stock-alert-list">
                          {lowStockProducts.slice(0, 4).map(p => (
                            <div className="low-stock-item-row" key={p.id}>
                              <div className="item-info">
                                <span className="stock-icon">🧴</span>
                                <div>
                                  <strong>{p.name}</strong>
                                  <span className="item-cat">{p.category}</span>
                                </div>
                              </div>
                              <span className="stock-units-badge red">{p.stock} left</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* ========================================================================= */}
              {/* VIEW 2: 💇 SERVICES (MATCHING PANEL 2 IN REFERENCE SCREENSHOT) */}
              {/* ========================================================================= */}
              {activeModule === 'services' && (
                <div className="looks-view-wrapper services-view">
                  {/* Header Row */}
                  <div className="looks-section-header">
                    <div>
                      <h2 className="section-main-title">Services</h2>
                    </div>
                    <div className="header-actions-group">
                      <div className="search-pill-box">
                        <Search size={15} />
                        <input
                          type="text"
                          placeholder="Search services..."
                          value={serviceSearch}
                          onChange={(e) => setServiceSearch(e.target.value)}
                        />
                      </div>
                      <button className="btn-gold-action" onClick={() => setShowAddServiceModal(true)}>
                        <Plus size={16} /> Add Service
                      </button>
                    </div>
                  </div>

                  {/* Category Tabs Strip */}
                  <div className="looks-category-filter-strip">
                    {['all', 'hair', 'grooming', 'beauty', 'spa & skin', 'nails & styling'].map(cat => (
                      <button
                        key={cat}
                        className={`category-tab-btn ${serviceCategoryFilter === cat ? 'active' : ''}`}
                        onClick={() => setServiceCategoryFilter(cat)}
                      >
                        {cat === 'all' ? 'All Services' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </button>
                    ))}
                  </div>

                  {/* Services Table */}
                  <div className="looks-table-card">
                    <table className="looks-master-table">
                      <thead>
                        <tr>
                          <th>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#64748B', fontWeight: 800 }}>
                              <Camera size={13} strokeWidth={2.5} /> Image
                            </span>
                          </th>
                          <th>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#0D9488', fontWeight: 800 }}>
                              <Scissors size={13} strokeWidth={2.5} /> Service Name
                            </span>
                          </th>
                          <th>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#0284C7', fontWeight: 800 }}>
                              <Tag size={13} strokeWidth={2.5} /> Category
                            </span>
                          </th>
                          <th>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#D97706', fontWeight: 800 }}>
                              <IndianRupee size={13} strokeWidth={2.5} /> Price
                            </span>
                          </th>
                          <th>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#4F46E5', fontWeight: 800 }}>
                              <Clock size={13} strokeWidth={2.5} /> Duration
                            </span>
                          </th>
                          <th>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#7C3AED', fontWeight: 800 }}>
                              <Package size={13} strokeWidth={2.5} /> Products Used
                            </span>
                          </th>
                          <th>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#DB2777', fontWeight: 800 }}>
                              <Percent size={13} strokeWidth={2.5} /> Incentive Rule
                            </span>
                          </th>
                          <th>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#16A34A', fontWeight: 800 }}>
                              <CheckCircle2 size={13} strokeWidth={2.5} /> Status
                            </span>
                          </th>
                          <th style={{ textAlign: 'center' }}>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#E11D48', fontWeight: 800 }}>
                              <Sparkles size={13} strokeWidth={2.5} /> Actions
                            </span>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {(() => {
                          const filtered = (data.services || [])
                            .filter(s => serviceCategoryFilter === 'all' || (s.categoryId && s.categoryId.toLowerCase().includes(serviceCategoryFilter.toLowerCase())) || (s.category && s.category.toLowerCase().includes(serviceCategoryFilter.toLowerCase())))
                            .filter(s => !serviceSearch || s.name.toLowerCase().includes(serviceSearch.toLowerCase()));
                          if (filtered.length === 0) {
                            return (
                              <tr>
                                <td colSpan={9} className="empty-table-cell">
                                  <div className="looks-empty-state">
                                    <Scissors size={32} />
                                    <h4>No services found</h4>
                                    <p>No salon services match your search or category filter.</p>
                                    <button className="btn-gold-action" onClick={() => setShowAddServiceModal(true)}>
                                      <Plus size={15} /> Add Service
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          }
                          return filtered.map(srv => (
                            <tr key={srv.id}>
                              <td>
                                <img src={srv.image || 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=150&q=80'} alt={srv.name} className="table-row-thumb" />
                              </td>
                              <td><strong>{srv.name}</strong></td>
                              <td><span className="category-tag">{srv.categoryId || srv.category || 'Hair'}</span></td>
                              <td><strong className="price-bold">₹{srv.price}</strong></td>
                              <td>{srv.duration} mins</td>
                              <td><span className="products-count-tag">{srv.productsCount || '3 products'}</span></td>
                              <td>
                                <span className="incentive-pill">
                                  {(() => {
                                    const inc = srv.incentiveRule || '';
                                    if (inc.includes('%')) return inc;
                                    const num = parseFloat(inc.replace(/[^0-9.]/g, ''));
                                    if (!isNaN(num)) {
                                      if (srv.price && srv.price > 0 && inc.includes('₹')) {
                                        return `${Math.round((num / srv.price) * 100)}%`;
                                      }
                                      return `${num}%`;
                                    }
                                    return '20%';
                                  })()}
                                </span>
                              </td>
                              <td><span className={`status-pill ${srv.status === 'Inactive' ? 'status-low-stock' : 'status-completed'}`}>{srv.status || 'Active'}</span></td>
                              <td>
                                <div className="action-buttons-cell">
                                  <button className="btn-table-action" onClick={() => showToast(`Edit service: ${srv.name}`)} title="Edit">
                                    <Edit2 size={14} />
                                  </button>
                                  <button className="btn-table-action-danger" onClick={() => deleteServiceItem(srv.id)} title="Delete">
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ));
                        })()}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ========================================================================= */}
              {/* VIEW 2B: 🛍️ PRODUCTS (DEDICATED PRODUCTS MANAGEMENT WITH ADD PRODUCT BUTTON) */}
              {/* ========================================================================= */}
              {activeModule === 'products' && (
                <div className="looks-view-wrapper products-view">
                  {/* Header Row */}
                  <div className="looks-section-header">
                    <div>
                      <h2 className="section-main-title">Products</h2>
                      <p className="section-lead-text">Manage retail haircare, skincare, styling inventory, prices, and suppliers.</p>
                    </div>
                    <div className="header-actions-group">
                      <div className="search-pill-box">
                        <Search size={15} />
                        <input
                          type="text"
                          placeholder="Search products..."
                          value={inventorySearch}
                          onChange={(e) => setInventorySearch(e.target.value)}
                        />
                      </div>
                      <button className="btn-gold-action" onClick={() => {
                        setNewProd({ id: null, name: '', category: 'Hair Care', brand: "L'Oréal", unitQuantity: '', unit: 'Bottles', unitCost: '', totalCost: '', stock: '', alert: 5, supplier: '', sku: '', expiryDate: '', gst: '', discount: '', description: '', imageFile: null, imageUrl: null });
                        setShowAddProductModal(true);
                      }}>
                        <Plus size={16} /> Add Product
                      </button>
                    </div>
                  </div>

                  {/* Category Filter Strip */}
                  <div className="looks-category-filter-strip">
                    {['all', 'Hair Care', 'Skincare', 'Nails', 'Men Grooming'].map(cat => (
                      <button
                        key={cat}
                        className={`category-tab-btn ${inventoryCategoryFilter.toLowerCase() === cat.toLowerCase() ? 'active' : ''}`}
                        onClick={() => setInventoryCategoryFilter(cat)}
                      >
                        {cat === 'all' ? 'All Products' : cat}
                      </button>
                    ))}
                  </div>

                  {/* Filter Toolbar */}
                  <div className="table-filter-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', gap: '12px', flexWrap: 'wrap' }}>
                    <div className="filter-select-group" style={{ display: 'flex', gap: '10px' }}>
                      <select
                        className="looks-filter-select"
                        value={inventoryCategoryFilter}
                        onChange={(e) => setInventoryCategoryFilter(e.target.value)}
                      >
                        <option value="all">All Categories</option>
                        <option value="Hair Care">Hair Care</option>
                        <option value="Skincare">Skincare</option>
                        <option value="Nails">Nails</option>
                        <option value="Men Grooming">Men Grooming</option>
                      </select>

                      <select
                        className="looks-filter-select"
                        value={inventoryStatusFilter}
                        onChange={(e) => setInventoryStatusFilter(e.target.value)}
                      >
                        <option value="all">All Stock Status</option>
                        <option value="in_stock">In Stock</option>
                        <option value="low_stock">Low Stock</option>
                      </select>
                    </div>

                    <span style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
                      Showing {(data.inventory || []).length} retail items
                    </span>
                  </div>

                  {/* Products Master Table */}
                  <div className="looks-table-card">
                    <table className="looks-master-table">
                      <thead>
                        <tr>
                          <th>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#64748B', fontWeight: 800 }}>
                              <Camera size={13} strokeWidth={2.5} /> Image
                            </span>
                          </th>
                          <th>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#0D9488', fontWeight: 800 }}>
                              <Package size={13} strokeWidth={2.5} /> Product Name
                            </span>
                          </th>
                          <th>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#0284C7', fontWeight: 800 }}>
                              <Tag size={13} strokeWidth={2.5} /> Category
                            </span>
                          </th>
                          <th>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#7C3AED', fontWeight: 800 }}>
                              <Sparkles size={13} strokeWidth={2.5} /> Brand
                            </span>
                          </th>
                          <th>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#0D9488', fontWeight: 800 }}>
                              <Package size={13} strokeWidth={2.5} /> Unit Qty
                            </span>
                          </th>
                          <th>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#16A34A', fontWeight: 800 }}>
                              <Layers size={13} strokeWidth={2.5} /> Current Stock
                            </span>
                          </th>
                          <th>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#EF4444', fontWeight: 800 }}>
                              <AlertTriangle size={13} strokeWidth={2.5} /> Min Alert
                            </span>
                          </th>
                          <th>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#D97706', fontWeight: 800 }}>
                              <IndianRupee size={13} strokeWidth={2.5} /> Total Cost
                            </span>
                          </th>
                          <th style={{ textAlign: 'center' }}>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#E11D48', fontWeight: 800 }}>
                              <Target size={13} strokeWidth={2.5} /> Actions
                            </span>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {(() => {
                          const filtered = (data.inventory || [])
                            .filter(p => inventoryCategoryFilter === 'all' || p.category.toLowerCase().includes(inventoryCategoryFilter.toLowerCase()))
                            .filter(p => {
                              if (inventoryStatusFilter === 'all') return true;
                              if (inventoryStatusFilter === 'low_stock') return p.stock <= (p.minStockAlert || 5);
                              if (inventoryStatusFilter === 'in_stock') return p.stock > (p.minStockAlert || 5);
                              return true;
                            })
                            .filter(p => !inventorySearch || p.name.toLowerCase().includes(inventorySearch.toLowerCase()) || (p.brand && p.brand.toLowerCase().includes(inventorySearch.toLowerCase())));
                          if (filtered.length === 0) {
                            return (
                              <tr>
                                <td colSpan={9} className="empty-table-cell">
                                  <div className="looks-empty-state">
                                    <ShoppingBag size={32} />
                                    <h4>No products found</h4>
                                    <p>Click "Add Product" above to add new retail and bay items.</p>
                                  </div>
                                </td>
                              </tr>
                            );
                          }
                          return filtered.map(prod => {
                            const isLow = prod.stock <= (prod.minStockAlert || 5);
                            const totalVal = prod.totalCost !== undefined && prod.totalCost !== null
                              ? prod.totalCost
                              : ((prod.unitCost || 0) * (prod.stock || 0)) || (prod.sellingPrice || prod.price || 0);
                            return (
                              <tr key={prod.id}>
                                <td>
                                  <img src={prod.imageUrl || prod.image || 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=150&q=80'} alt={prod.name} className="table-row-thumb" />
                                </td>
                                <td><strong>{prod.name}</strong></td>
                                <td><span className="category-tag">{prod.category}</span></td>
                                <td>{prod.brand || "L'Oréal"}</td>
                                <td>
                                  <span style={{
                                    display: 'inline-block',
                                    padding: '3px 8px',
                                    borderRadius: '6px',
                                    fontSize: '11.5px',
                                    fontWeight: 700,
                                    background: 'rgba(13, 148, 136, 0.08)',
                                    color: '#0D9488',
                                    border: '1px solid rgba(13, 148, 136, 0.2)'
                                  }}>
                                    {prod.unitQuantity || prod.volume || '250 ml'}
                                  </span>
                                </td>
                                <td>
                                  <span className={`stock-count-num ${isLow ? 'red' : 'green'}`}>
                                    {prod.stock} units
                                  </span>
                                </td>
                                <td>{prod.minStockAlert || 5} units</td>
                                <td>
                                  <strong style={{ color: '#0F172A', fontSize: '13.5px' }}>
                                    ₹{Number(totalVal).toLocaleString('en-IN')}
                                  </strong>
                                </td>
                                <td>
                                  <div className="action-buttons-cell">
                                    <button className="btn-table-action" onClick={() => {
                                      setNewStockTx({
                                        type: 'Stock In',
                                        productName: prod.name || '',
                                        qty: 1,
                                        supplier: prod.supplier || '',
                                        cost: prod.unitCost || 0,
                                        batch: ''
                                      });
                                      setShowAddStockInModal(true);
                                    }} title="Add Stock">
                                      <Plus size={14} />
                                    </button>
                                    <button className="btn-table-action" onClick={() => {
                                      setNewProd({
                                        id: prod.id,
                                        name: prod.name || '',
                                        category: prod.category || 'Hair Care',
                                        brand: prod.brand || "L'Oréal",
                                        unitQuantity: prod.unitQuantity || '',
                                        unit: prod.unit || 'Bottles',
                                        unitCost: prod.unitCost || '',
                                        totalCost: prod.totalCost || '',
                                        stock: prod.stock || 0,
                                        alert: prod.minStockAlert || 5,
                                        supplier: prod.supplier || '',
                                        sku: prod.sku || '',
                                        expiryDate: prod.expiryDate || '',
                                        gst: prod.gst || '',
                                        discount: prod.discount || '',
                                        description: prod.description || '',
                                        imageFile: null,
                                        imageUrl: prod.imageUrl || prod.image || null
                                      });
                                      setShowAddProductModal(true);
                                    }} title="Edit">
                                      <Edit2 size={14} />
                                    </button>
                                    <button
                                      className="btn-table-action-danger"
                                      onClick={() => {
                                        if (window.confirm(`Are you sure you want to delete "${prod.name}"?`)) {
                                          deleteProduct(prod.id);
                                        }
                                      }}
                                      title="Delete"
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          });
                        })()}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ========================================================================= */}
              {/* VIEW 2C: 🛍️ ORDERS (BOUTIQUE & ONLINE ORDERS MANAGEMENT) */}
              {/* ========================================================================= */}
              {activeModule === 'orders' && (
                <div className="looks-view-wrapper orders-view">
                  {/* Header Row */}
                  <div className="looks-section-header" style={{ marginBottom: '18px' }}>
                    <div>
                      <h2 className="section-main-title">Orders Management</h2>
                    </div>
                    <div className="header-actions-group">
                      <div className="search-pill-box">
                        <Search size={15} />
                        <input
                          type="text"
                          placeholder="Search order ID, client, product, phone..."
                          value={orderSearch}
                          onChange={(e) => setOrderSearch(e.target.value)}
                        />
                        {orderSearch && (
                          <button
                            onClick={() => setOrderSearch('')}
                            style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#64748B' }}
                          >
                            <X size={13} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Orders KPI Metrics Cards */}
                  {(() => {
                    const allOrders = data.orders || [];
                    const totalRevenue = allOrders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);
                    const pendingOrders = allOrders.filter(o => o.status === 'Pending' || o.status === 'Processing').length;
                    const inTransitOrders = allOrders.filter(o => o.status === 'Shipped').length;
                    const deliveredOrders = allOrders.filter(o => o.status === 'Delivered' || o.status === 'Completed').length;

                    return (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '22px' }}>
                        {/* KPI 1 */}
                        <div
                          className="order-kpi-card"
                          onClick={() => setOrderStatusFilter('all')}
                          style={{ cursor: 'pointer', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)', transition: 'all 0.2s ease' }}
                          title="View All Orders"
                        >
                          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(135deg, rgba(217, 119, 6, 0.12), rgba(217, 119, 6, 0.22))', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <ShoppingCart size={24} />
                          </div>
                          <div>
                            <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Orders</span>
                            <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', margin: '2px 0 0 0' }}>{allOrders.length}</h3>
                            <span style={{ fontSize: '11px', color: '#16A34A', fontWeight: 600 }}>Active Boutique Store</span>
                          </div>
                        </div>

                        {/* KPI 2 */}
                        <div
                          className="order-kpi-card"
                          onClick={() => setOrderStatusFilter('Processing')}
                          style={{ cursor: 'pointer', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)', transition: 'all 0.2s ease' }}
                          title="Filter Processing Orders"
                        >
                          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.12), rgba(2, 132, 199, 0.22))', color: '#0284C7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Package size={24} />
                          </div>
                          <div>
                            <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Processing</span>
                            <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', margin: '2px 0 0 0' }}>{pendingOrders}</h3>
                            <span style={{ fontSize: '11px', color: '#0284C7', fontWeight: 600 }}>Awaiting dispatch</span>
                          </div>
                        </div>

                        {/* KPI 3 */}
                        <div
                          className="order-kpi-card"
                          onClick={() => setOrderStatusFilter('Shipped')}
                          style={{ cursor: 'pointer', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)', transition: 'all 0.2s ease' }}
                          title="Filter Shipped Orders"
                        >
                          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.12), rgba(124, 58, 237, 0.22))', color: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Truck size={24} />
                          </div>
                          <div>
                            <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>In Transit</span>
                            <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', margin: '2px 0 0 0' }}>{inTransitOrders}</h3>
                            <span style={{ fontSize: '11px', color: '#7C3AED', fontWeight: 600 }}>White-glove delivery</span>
                          </div>
                        </div>

                        {/* KPI 4 */}
                        <div
                          className="order-kpi-card"
                          onClick={() => setOrderStatusFilter('Delivered')}
                          style={{ cursor: 'pointer', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)', transition: 'all 0.2s ease' }}
                          title="Filter Delivered Orders"
                        >
                          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(135deg, rgba(22, 163, 74, 0.12), rgba(22, 163, 74, 0.22))', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <IndianRupee size={24} />
                          </div>
                          <div>
                            <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Revenue</span>
                            <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', margin: '2px 0 0 0' }}>₹{Number(totalRevenue).toLocaleString('en-IN')}</h3>
                            <span style={{ fontSize: '11px', color: '#16A34A', fontWeight: 600 }}>{deliveredOrders} Orders Delivered</span>
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Status Filter Strip */}
                  <div className="looks-category-filter-strip" style={{ marginBottom: '18px' }}>
                    {(() => {
                      const allOrders = data.orders || [];
                      const counts = {
                        all: allOrders.length,
                        Pending: allOrders.filter(o => o.status === 'Pending').length,
                        Processing: allOrders.filter(o => o.status === 'Processing').length,
                        Shipped: allOrders.filter(o => o.status === 'Shipped').length,
                        Delivered: allOrders.filter(o => o.status === 'Delivered' || o.status === 'Completed').length,
                        Cancelled: allOrders.filter(o => o.status === 'Cancelled').length
                      };

                      const statusTabs = [
                        { key: 'all', label: 'All Orders', count: counts.all },
                        { key: 'Pending', label: 'Pending', count: counts.Pending },
                        { key: 'Processing', label: 'Processing', count: counts.Processing },
                        { key: 'Shipped', label: 'Shipped', count: counts.Shipped },
                        { key: 'Delivered', label: 'Delivered', count: counts.Delivered },
                        { key: 'Cancelled', label: 'Cancelled', count: counts.Cancelled }
                      ];

                      return statusTabs.map(tab => (
                        <button
                          key={tab.key}
                          className={`category-tab-btn ${orderStatusFilter.toLowerCase() === tab.key.toLowerCase() ? 'active' : ''}`}
                          onClick={() => setOrderStatusFilter(tab.key)}
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                        >
                          <span>{tab.label}</span>
                          <span style={{
                            padding: '2px 7px',
                            borderRadius: '10px',
                            fontSize: '11px',
                            fontWeight: 700,
                            background: orderStatusFilter.toLowerCase() === tab.key.toLowerCase() ? 'rgba(255,255,255,0.25)' : 'rgba(15, 23, 42, 0.08)',
                            color: 'inherit'
                          }}>
                            {tab.count}
                          </span>
                        </button>
                      ));
                    })()}
                  </div>

                  {/* Orders Master Table */}
                  <div className="looks-table-card" style={{ width: '100%', overflow: 'hidden', maxWidth: '100%' }}>
                    <table className="looks-master-table" style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
                      <colgroup>
                        <col style={{ width: '13%' }} />
                        <col style={{ width: '16%' }} />
                        <col style={{ width: '22%' }} />
                        <col style={{ width: '13%' }} />
                        <col style={{ width: '12%' }} />
                        <col style={{ width: '11%' }} />
                        <col style={{ width: '8%' }} />
                        <col style={{ width: '5%' }} />
                      </colgroup>
                      <thead>
                        <tr>
                          <th style={{ padding: '10px 8px' }}>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#64748B', fontWeight: 800, fontSize: '11px' }}>
                              <Hash size={11} strokeWidth={2.5} /> Order ID
                            </span>
                          </th>
                          <th style={{ padding: '10px 8px' }}>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#0284C7', fontWeight: 800, fontSize: '11px' }}>
                              <User size={11} strokeWidth={2.5} /> Customer
                            </span>
                          </th>
                          <th style={{ padding: '10px 8px' }}>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#0D9488', fontWeight: 800, fontSize: '11px' }}>
                              <Package size={11} strokeWidth={2.5} /> Items & Qty
                            </span>
                          </th>
                          <th style={{ padding: '10px 6px' }}>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#7C3AED', fontWeight: 800, fontSize: '11px' }}>
                              <Truck size={11} strokeWidth={2.5} /> Delivery
                            </span>
                          </th>
                          <th style={{ padding: '10px 6px' }}>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#D97706', fontWeight: 800, fontSize: '11px' }}>
                              <CreditCard size={11} strokeWidth={2.5} /> Payment
                            </span>
                          </th>
                          <th style={{ padding: '10px 6px' }}>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#16A34A', fontWeight: 800, fontSize: '11px' }}>
                              <CheckCircle2 size={11} strokeWidth={2.5} /> Status
                            </span>
                          </th>
                          <th style={{ padding: '10px 8px' }}>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#0F172A', fontWeight: 800, fontSize: '11px' }}>
                              <IndianRupee size={11} strokeWidth={2.5} /> Total
                            </span>
                          </th>
                          <th style={{ padding: '10px 4px', textAlign: 'center' }}>
                            <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '4px', color: '#E11D48', fontWeight: 800, fontSize: '11px' }}>
                              <Target size={11} strokeWidth={2.5} /> Actions
                            </span>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {(() => {
                          const allOrders = data.orders || [];
                          const filtered = allOrders
                            .filter(o => {
                              if (orderStatusFilter === 'all') return true;
                              if (orderStatusFilter.toLowerCase() === 'delivered') return o.status === 'Delivered' || o.status === 'Completed';
                              return (o.status || '').toLowerCase() === orderStatusFilter.toLowerCase();
                            })
                            .filter(o => {
                              if (orderPaymentFilter === 'all') return true;
                              return (o.paymentStatus || '').toLowerCase() === orderPaymentFilter.toLowerCase();
                            })
                            .filter(o => {
                              if (!orderSearch) return true;
                              const q = orderSearch.toLowerCase();
                              const idMatch = (o.orderId || o.id || '').toLowerCase().includes(q);
                              const nameMatch = (o.customer?.name || '').toLowerCase().includes(q);
                              const phoneMatch = (o.customer?.phone || '').toLowerCase().includes(q);
                              const cityMatch = (o.customer?.city || '').toLowerCase().includes(q);
                              const itemsMatch = (o.items || []).some(item => (item.name || '').toLowerCase().includes(q) || (item.brand || '').toLowerCase().includes(q));
                              return idMatch || nameMatch || phoneMatch || cityMatch || itemsMatch;
                            });

                          if (filtered.length === 0) {
                            return (
                              <tr>
                                <td colSpan={8} className="empty-table-cell">
                                  <div className="looks-empty-state">
                                    <ShoppingCart size={36} color="#CBD5E1" />
                                    <h4>No orders found</h4>
                                    <p>Try adjusting your search query or status filter.</p>
                                  </div>
                                </td>
                              </tr>
                            );
                          }

                          return filtered.map(order => {
                            const orderKey = order.orderId || order.id || `ord-${Math.random()}`;
                            const itemsList = order.items || [];
                            const totalQty = itemsList.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0);

                            // Status color scheme
                            const statusStyles = {
                              Processing: { bg: 'rgba(2, 132, 199, 0.1)', color: '#0284C7', border: '1px solid rgba(2, 132, 199, 0.3)' },
                              Shipped: { bg: 'rgba(124, 58, 237, 0.1)', color: '#7C3AED', border: '1px solid rgba(124, 58, 237, 0.3)' },
                              Delivered: { bg: 'rgba(22, 163, 74, 0.1)', color: '#16A34A', border: '1px solid rgba(22, 163, 74, 0.3)' },
                              Completed: { bg: 'rgba(22, 163, 74, 0.1)', color: '#16A34A', border: '1px solid rgba(22, 163, 74, 0.3)' },
                              Pending: { bg: 'rgba(217, 119, 6, 0.1)', color: '#D97706', border: '1px solid rgba(217, 119, 6, 0.3)' },
                              Cancelled: { bg: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', border: '1px solid rgba(239, 68, 68, 0.3)' }
                            };
                            const currStyle = statusStyles[order.status] || statusStyles.Processing;

                            // Compact delivery text
                            const isExpress = (order.deliverySpeed || '').toLowerCase().includes('express');
                            const deliveryLabel = isExpress ? 'Express' : 'Standard';

                            // Compact payment text
                            const rawPay = order.paymentMethod || 'UPI';
                            const payShort = rawPay.toLowerCase().includes('card') ? 'Credit Card' : rawPay.toLowerCase().includes('net') ? 'Net Banking' : 'UPI';

                            return (
                              <tr key={orderKey}>
                                {/* 1. Order ID & Date */}
                                <td style={{ padding: '10px 8px', overflow: 'hidden' }}>
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                    <strong style={{ color: '#0F172A', fontSize: '12.5px', fontFamily: 'monospace', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                      {order.orderId || order.id}
                                    </strong>
                                    <span style={{ fontSize: '10.5px', color: '#64748B', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                                      <CalendarDays size={10} /> {order.date || 'Today'}
                                    </span>
                                  </div>
                                </td>

                                {/* 2. Customer Details */}
                                <td style={{ padding: '10px 8px', overflow: 'hidden' }}>
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                                    <strong style={{ color: '#0F172A', fontSize: '12.5px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={order.customer?.name}>
                                      {order.customer?.name || 'Valued Guest'}
                                    </strong>
                                    <span style={{ fontSize: '11px', color: '#64748B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                      {order.customer?.phone || ''}
                                    </span>
                                    <span style={{ fontSize: '10px', color: '#475569', display: 'inline-flex', alignItems: 'center', gap: '2px', whiteSpace: 'nowrap' }}>
                                      <MapPin size={9} color="#E11D48" /> {order.customer?.city || 'Mumbai'}
                                    </span>
                                  </div>
                                </td>

                                {/* 3. Ordered Items & Units */}
                                <td style={{ padding: '10px 8px', overflow: 'hidden' }}>
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    {itemsList.slice(0, 2).map((item, idx) => (
                                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <img
                                          src={item.image || 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=100&q=80'}
                                          alt={item.name}
                                          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=100&q=80'; }}
                                          style={{ width: '24px', height: '24px', borderRadius: '4px', objectFit: 'cover', border: '1px solid #E2E8F0', flexShrink: 0 }}
                                        />
                                        <div style={{ minWidth: 0, flex: 1, overflow: 'hidden' }}>
                                          <div style={{ fontSize: '11px', fontWeight: 600, color: '#0F172A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={item.name}>
                                            {item.name}
                                          </div>
                                          <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                                            <span style={{ fontSize: '9.5px', color: '#0D9488', fontWeight: 700 }}>
                                              {item.unitQuantity || item.volume || '100ml'}
                                            </span>
                                            <span style={{ fontSize: '9.5px', color: '#64748B' }}>
                                              ×{item.quantity || 1}
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                    {itemsList.length > 2 && (
                                      <span style={{ fontSize: '10px', color: '#7C3AED', fontWeight: 600 }}>
                                        +{itemsList.length - 2} more ({totalQty} total)
                                      </span>
                                    )}
                                  </div>
                                </td>

                                {/* 4. Delivery Speed */}
                                <td style={{ padding: '10px 6px', overflow: 'hidden' }}>
                                  <span style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '3px',
                                    padding: '3px 6px',
                                    borderRadius: '5px',
                                    fontSize: '10.5px',
                                    fontWeight: 600,
                                    whiteSpace: 'nowrap',
                                    background: isExpress ? 'rgba(217, 119, 6, 0.12)' : 'rgba(100, 116, 139, 0.08)',
                                    color: isExpress ? '#D97706' : '#475569'
                                  }}>
                                    <Truck size={10} /> {deliveryLabel}
                                  </span>
                                </td>

                                {/* 5. Payment */}
                                <td style={{ padding: '10px 6px', overflow: 'hidden' }}>
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                    <span style={{ fontSize: '11px', fontWeight: 600, color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                      {payShort}
                                    </span>
                                    <span style={{
                                      display: 'inline-block',
                                      width: 'fit-content',
                                      padding: '1px 5px',
                                      borderRadius: '4px',
                                      fontSize: '9.5px',
                                      fontWeight: 700,
                                      background: (order.paymentStatus || 'Paid').toLowerCase() === 'paid' ? 'rgba(22, 163, 74, 0.12)' : 'rgba(217, 119, 6, 0.12)',
                                      color: (order.paymentStatus || 'Paid').toLowerCase() === 'paid' ? '#16A34A' : '#D97706'
                                    }}>
                                      {order.paymentStatus || 'Paid'}
                                    </span>
                                  </div>
                                </td>

                                {/* 6. Order Status Dropdown */}
                                <td style={{ padding: '10px 6px', overflow: 'hidden' }}>
                                  <select
                                    value={order.status || 'Processing'}
                                    onChange={(e) => updateOrderStatus(order.orderId || order.id, e.target.value)}
                                    style={{
                                      ...currStyle,
                                      padding: '3px 4px',
                                      borderRadius: '6px',
                                      fontSize: '11px',
                                      fontWeight: 700,
                                      cursor: 'pointer',
                                      outline: 'none',
                                      width: '100%',
                                      maxWidth: '95px',
                                      appearance: 'auto'
                                    }}
                                  >
                                    <option value="Pending">Pending</option>
                                    <option value="Processing">Processing</option>
                                    <option value="Shipped">Shipped</option>
                                    <option value="Delivered">Delivered</option>
                                    <option value="Cancelled">Cancelled</option>
                                  </select>
                                </td>

                                {/* 7. Total Amount */}
                                <td style={{ padding: '10px 8px', overflow: 'hidden' }}>
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                                    <strong style={{ color: '#0F172A', fontSize: '13px', fontWeight: 800, whiteSpace: 'nowrap' }}>
                                      ₹{Number(order.totalAmount || 0).toLocaleString('en-IN')}
                                    </strong>
                                    {order.discount > 0 && (
                                      <span style={{ fontSize: '9.5px', color: '#16A34A', fontWeight: 700, whiteSpace: 'nowrap' }}>
                                        -₹{order.discount}
                                      </span>
                                    )}
                                  </div>
                                </td>

                                {/* 8. Actions */}
                                <td style={{ padding: '10px 4px', textAlign: 'center', overflow: 'hidden' }}>
                                  <div className="action-buttons-cell" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                                    <button
                                      className="btn-table-action"
                                      onClick={() => setSelectedOrderDetails(order)}
                                      title="View Order Details"
                                      style={{ color: '#0284C7', background: 'rgba(2, 132, 199, 0.08)', borderColor: 'rgba(2, 132, 199, 0.25)', width: '26px', height: '26px' }}
                                    >
                                      <Eye size={13} />
                                    </button>
                                    <button
                                      className="btn-table-action-danger"
                                      onClick={() => {
                                        if (window.confirm(`Are you sure you want to delete Order #${order.orderId || order.id}?`)) {
                                          deleteOrder(order.orderId || order.id);
                                        }
                                      }}
                                      title="Delete Order"
                                      style={{ width: '26px', height: '26px' }}
                                    >
                                      <Trash2 size={13} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          });
                        })()}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ========================================================================= */}
              {/* VIEW 3: 📦 INVENTORY (STOCK IN, STOCK OUT, SUPPLIERS, LOW STOCK, USAGE) */}
              {/* ========================================================================= */}
              {activeModule === 'inventory' && (
                <div className="looks-view-wrapper inventory-view">
                  {/* Header Row */}
                  <div className="looks-section-header">
                    <div>
                      <h2 className="section-main-title">Inventory & Stock</h2>
                      <p className="section-lead-text">Track salon inventory items, check available remaining stock, log bay consumption & stock entries.</p>
                    </div>
                    <div className="header-actions-group">
                      {inventorySubTab === 'current_stock' && (
                        <>
                          <button className="btn-secondary-action" onClick={() => setShowAddStockInModal(true)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', background: '#FFFFFF', color: '#0F172A', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}>
                            <Plus size={15} color="#10B981" /> Quick Stock In
                          </button>
                          <button className="btn-gold-action" onClick={() => setShowAddProductModal(true)}>
                            <Plus size={16} /> Add Product
                          </button>
                        </>
                      )}
                      {inventorySubTab === 'stock_in' && (
                        <button className="btn-gold-action" onClick={() => setShowAddStockInModal(true)}>
                          <Plus size={16} /> Record Stock In
                        </button>
                      )}
                      {inventorySubTab === 'stock_out' && (
                        <button className="btn-gold-action" onClick={() => setShowAddStockOutModal(true)}>
                          <Plus size={16} /> Record Stock Out
                        </button>
                      )}
                      {inventorySubTab === 'suppliers' && (
                        <button className="btn-gold-action" onClick={() => setShowAddSupplierModal(true)}>
                          <Plus size={16} /> Add Supplier
                        </button>
                      )}
                      {inventorySubTab === 'product_usage' && (
                        <button className="btn-gold-action" onClick={() => setShowAddUsageModal(true)}>
                          <Plus size={16} /> Log Usage
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Top Inventory Stock Summary Cards */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '14px', marginBottom: '16px' }}>
                    <div className="looks-card-glass" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '14px', borderRadius: '12px', background: '#FFFFFF', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                      <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(13, 148, 136, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0D9488' }}>
                        <Package size={22} />
                      </div>
                      <div>
                        <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 600 }}>Total Products</span>
                        <h4 style={{ margin: '2px 0 0 0', fontSize: '18px', fontWeight: 700, color: '#0F172A' }}>{(data.inventory || []).length} Items</h4>
                      </div>
                    </div>

                    <div className="looks-card-glass" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '14px', borderRadius: '12px', background: '#FFFFFF', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                      <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981' }}>
                        <Layers size={22} />
                      </div>
                      <div>
                        <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 600 }}>Total Stock in Hand</span>
                        <h4 style={{ margin: '2px 0 0 0', fontSize: '18px', fontWeight: 700, color: '#0F172A' }}>
                          {(data.inventory || []).reduce((sum, p) => sum + (parseInt(p.stock) || 0), 0)} Units
                        </h4>
                      </div>
                    </div>

                    <div className="looks-card-glass" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '14px', borderRadius: '12px', background: '#FFFFFF', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                      <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3B82F6' }}>
                        <DollarSign size={22} />
                      </div>
                      <div>
                        <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 600 }}>Stock Valuation (Cost Value)</span>
                        <h4 style={{ margin: '2px 0 0 0', fontSize: '18px', fontWeight: 700, color: '#0F172A' }}>
                          ₹{(data.inventory || []).reduce((sum, p) => sum + ((parseInt(p.stock) || 0) * (parseFloat(p.unitCost) || 0)), 0).toLocaleString()}
                        </h4>
                      </div>
                    </div>

                    <div className="looks-card-glass" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '14px', borderRadius: '12px', background: '#FFFFFF', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                      <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: lowStockProducts.length > 0 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: lowStockProducts.length > 0 ? '#EF4444' : '#10B981' }}>
                        <AlertTriangle size={22} />
                      </div>
                      <div>
                        <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 600 }}>Low Stock Alerts</span>
                        <h4 style={{ margin: '2px 0 0 0', fontSize: '18px', fontWeight: 700, color: lowStockProducts.length > 0 ? '#EF4444' : '#10B981' }}>
                          {lowStockProducts.length} Items Low
                        </h4>
                      </div>
                    </div>
                  </div>

                  {/* Subtabs Strip */}
                  <div className="looks-subtab-navigation-strip">
                    {[
                      { id: 'current_stock', label: 'Stock Overview' },
                      { id: 'stock_in', label: 'Stock In' },
                      { id: 'stock_out', label: 'Stock Out' },
                      { id: 'low_stock', label: `Low Stock (${lowStockProducts.length})` },
                      { id: 'suppliers', label: 'Suppliers' },
                      { id: 'product_usage', label: 'Product Usage' }
                    ].map(st => (
                      <button
                        key={st.id}
                        className={`subtab-pill ${inventorySubTab === st.id ? 'active' : ''}`}
                        onClick={() => setInventorySubTab(st.id)}
                      >
                        {st.label}
                      </button>
                    ))}
                  </div>

                  {/* SUBTAB 0: CURRENT STOCK / STOCK OVERVIEW */}
                  {inventorySubTab === 'current_stock' && (
                    <div>
                      {/* Filter Toolbar */}
                      <div className="table-filter-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', gap: '12px', flexWrap: 'wrap' }}>
                        <div className="search-pill-box" style={{ minWidth: '240px' }}>
                          <Search size={15} />
                          <input
                            type="text"
                            placeholder="Search products by name, brand, SKU..."
                            value={inventorySearch}
                            onChange={(e) => setInventorySearch(e.target.value)}
                          />
                        </div>
                        <div className="filter-select-group" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                          <select
                            className="looks-filter-select"
                            value={inventoryCategoryFilter}
                            onChange={(e) => setInventoryCategoryFilter(e.target.value)}
                          >
                            <option value="all">All Categories</option>
                            <option value="Hair Care">Hair Care</option>
                            <option value="Skincare">Skincare</option>
                            <option value="Treatments">Treatments</option>
                            <option value="Colorants">Colorants</option>
                            <option value="Hair Styling">Hair Styling</option>
                            <option value="Nails">Nails</option>
                            <option value="Men Grooming">Men Grooming</option>
                          </select>

                          <select
                            className="looks-filter-select"
                            value={inventoryStatusFilter}
                            onChange={(e) => setInventoryStatusFilter(e.target.value)}
                          >
                            <option value="all">All Stock Status</option>
                            <option value="in_stock">In Stock (&gt; Min Alert)</option>
                            <option value="low_stock">Low Stock (≤ Min Alert)</option>
                            <option value="out_of_stock">Out of Stock (0 Units)</option>
                          </select>
                        </div>
                      </div>

                      <div className="looks-table-card" style={{ width: '100%', overflow: 'hidden' }}>
                        <table className="looks-master-table" style={{ width: '100%', tableLayout: 'auto' }}>
                          <thead>
                            <tr style={{ background: '#F8FAFC', borderBottom: '2px solid #E2E8F0' }}>
                              <th style={{ width: '28%', padding: '12px 14px' }}>
                                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#0F172A', fontWeight: 800 }}>
                                  <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(13, 148, 136, 0.12)', color: '#0D9488' }}>
                                    <Package size={13} strokeWidth={2.5} />
                                  </span>
                                  <span>Product Details</span>
                                </div>
                              </th>
                              <th style={{ width: '13%', padding: '12px 14px' }}>
                                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#0F172A', fontWeight: 800 }}>
                                  <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(2, 132, 199, 0.12)', color: '#0284C7' }}>
                                    <Tag size={13} strokeWidth={2.5} />
                                  </span>
                                  <span>Category</span>
                                </div>
                              </th>
                              <th style={{ width: '18%', padding: '12px 14px' }}>
                                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#0F172A', fontWeight: 800 }}>
                                  <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(124, 58, 237, 0.12)', color: '#7C3AED' }}>
                                    <Building2 size={13} strokeWidth={2.5} />
                                  </span>
                                  <span>Brand & Supplier</span>
                                </div>
                              </th>
                              <th style={{ width: '15%', padding: '12px 14px' }}>
                                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#0F172A', fontWeight: 800 }}>
                                  <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(22, 163, 74, 0.12)', color: '#16A34A' }}>
                                    <Layers size={13} strokeWidth={2.5} />
                                  </span>
                                  <span>Remaining Stock</span>
                                </div>
                              </th>
                              <th style={{ width: '12%', padding: '12px 14px' }}>
                                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#0F172A', fontWeight: 800 }}>
                                  <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(217, 119, 6, 0.12)', color: '#D97706' }}>
                                    <IndianRupee size={13} strokeWidth={2.5} />
                                  </span>
                                  <span>Price & Cost</span>
                                </div>
                              </th>
                              <th style={{ width: '14%', padding: '12px 14px' }}>
                                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#0F172A', fontWeight: 800 }}>
                                  <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(13, 148, 136, 0.12)', color: '#0D9488' }}>
                                    <DollarSign size={13} strokeWidth={2.5} />
                                  </span>
                                  <span>Stock Value</span>
                                </div>
                              </th>
                              <th style={{ textAlign: 'center', width: '10%', padding: '12px 14px' }}>
                                <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: '#0F172A', fontWeight: 800 }}>
                                  <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(225, 29, 72, 0.12)', color: '#E11D48' }}>
                                    <Target size={13} strokeWidth={2.5} />
                                  </span>
                                  <span>Actions</span>
                                </div>
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {(() => {
                              const items = (data.inventory || [])
                                .filter(p => inventoryCategoryFilter === 'all' || (p.category && p.category.toLowerCase().includes(inventoryCategoryFilter.toLowerCase())))
                                .filter(p => {
                                  const stk = parseInt(p.stock) || 0;
                                  const minAl = parseInt(p.minStockAlert) || 5;
                                  if (inventoryStatusFilter === 'all') return true;
                                  if (inventoryStatusFilter === 'out_of_stock') return stk <= 0;
                                  if (inventoryStatusFilter === 'low_stock') return stk > 0 && stk <= minAl;
                                  if (inventoryStatusFilter === 'in_stock') return stk > minAl;
                                  return true;
                                })
                                .filter(p => !inventorySearch ||
                                  (p.name && p.name.toLowerCase().includes(inventorySearch.toLowerCase())) ||
                                  (p.sku && p.sku.toLowerCase().includes(inventorySearch.toLowerCase())) ||
                                  (p.brand && p.brand.toLowerCase().includes(inventorySearch.toLowerCase())) ||
                                  (p.supplier && p.supplier.toLowerCase().includes(inventorySearch.toLowerCase()))
                                );

                              if (items.length === 0) {
                                return (
                                  <tr>
                                    <td colSpan={7} className="empty-table-cell">
                                      <div className="looks-empty-state">
                                        <Package size={32} />
                                        <h4>No products matching your search</h4>
                                        <p>Add new products or clear your filters to view all salon stock.</p>
                                      </div>
                                    </td>
                                  </tr>
                                );
                              }

                              return items.map(p => {
                                const currentStock = parseInt(p.stock) || 0;
                                const minAlert = parseInt(p.minStockAlert) || 5;
                                const isLow = currentStock > 0 && currentStock <= minAlert;
                                const isOut = currentStock <= 0;
                                const totalVal = currentStock * (parseFloat(p.unitCost) || 0);

                                const catLower = (p.category || 'Hair Care').toLowerCase();
                                let catStyle = { background: '#E0F2FE', color: '#0284C7', border: '1px solid #BAE6FD' };
                                if (catLower.includes('skin')) catStyle = { background: '#FFE4E6', color: '#E11D48', border: '1px solid #FECDD3' };
                                else if (catLower.includes('treat')) catStyle = { background: '#F3E8FF', color: '#7E22CE', border: '1px solid #E9D5FF' };
                                else if (catLower.includes('color')) catStyle = { background: '#EDE9FE', color: '#6D28D9', border: '1px solid #DDD6FE' };
                                else if (catLower.includes('style') || catLower.includes('styling')) catStyle = { background: '#FEF3C7', color: '#D97706', border: '1px solid #FDE68A' };
                                else if (catLower.includes('nail')) catStyle = { background: '#DCFCE7', color: '#15803D', border: '1px solid #BBF7D0' };
                                else if (catLower.includes('men')) catStyle = { background: '#F1F5F9', color: '#334155', border: '1px solid #CBD5E1' };

                                return (
                                  <tr key={p.id}>
                                    <td>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #E2E8F0', overflow: 'hidden', flexShrink: 0 }}>
                                          {p.imageUrl ? (
                                            <img src={p.imageUrl} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                          ) : (
                                            <Package size={17} color="#0D9488" />
                                          )}
                                        </div>
                                        <div style={{ minWidth: 0, flex: 1 }}>
                                          <div style={{ fontWeight: 700, color: '#0F172A', fontSize: '13px', lineHeight: 1.3 }}>{p.name}</div>
                                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                                            <span style={{ fontSize: '11px', color: '#64748B' }}>SKU: {p.sku || p.id}</span>
                                            <span style={{
                                              display: 'inline-block',
                                              padding: '1px 6px',
                                              borderRadius: '4px',
                                              fontSize: '10.5px',
                                              fontWeight: 700,
                                              background: 'rgba(13, 148, 136, 0.08)',
                                              color: '#0D9488',
                                              border: '1px solid rgba(13, 148, 136, 0.2)'
                                            }}>
                                              {p.unitQuantity || p.volume || '250 ml'}
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    </td>
                                    <td>
                                      <span style={{
                                        display: 'inline-block',
                                        padding: '3px 9px',
                                        borderRadius: '6px',
                                        fontSize: '11.5px',
                                        fontWeight: 700,
                                        ...catStyle
                                      }}>
                                        {p.category || 'Retail'}
                                      </span>
                                    </td>
                                    <td>
                                      <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#1E293B' }}>{p.brand || "—"}</div>
                                      <div style={{ fontSize: '11px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '1px' }}>
                                        <Truck size={11} color="#94A3B8" /> {p.supplier || "Official Distributor"}
                                      </div>
                                    </td>
                                    <td>
                                      <div style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '5px',
                                        padding: '4px 9px',
                                        borderRadius: '16px',
                                        fontWeight: 700,
                                        fontSize: '12px',
                                        whiteSpace: 'nowrap',
                                        background: isOut ? '#FEE2E2' : isLow ? '#FEF3C7' : '#DCFCE7',
                                        color: isOut ? '#DC2626' : isLow ? '#D97706' : '#15803D',
                                        border: `1px solid ${isOut ? '#FCA5A5' : isLow ? '#FDE68A' : '#BBF7D0'}`
                                      }}>
                                        {isOut ? <AlertTriangle size={13} color="#DC2626" /> : isLow ? <AlertTriangle size={13} color="#D97706" /> : <CheckCircle2 size={13} color="#15803D" />}
                                        <span>{currentStock} Units</span>
                                      </div>
                                      <div style={{ fontSize: '10.5px', color: '#94A3B8', marginTop: '2px' }}>Min alert: {minAlert} units</div>
                                    </td>
                                    <td>
                                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>
                                        ₹{(parseFloat(p.sellingPrice || p.price) || 0).toLocaleString()}
                                      </div>
                                      <div style={{ fontSize: '11px', color: '#64748B' }}>
                                        Cost: ₹{(parseFloat(p.unitCost) || 0).toLocaleString()}
                                      </div>
                                    </td>
                                    <td>
                                      <span style={{
                                        display: 'inline-block',
                                        padding: '3px 8px',
                                        borderRadius: '6px',
                                        background: 'rgba(13, 148, 136, 0.08)',
                                        color: '#0D9488',
                                        fontWeight: 800,
                                        fontSize: '13px',
                                        border: '1px solid rgba(13, 148, 136, 0.2)'
                                      }}>
                                        ₹{totalVal.toLocaleString()}
                                      </span>
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                      <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                                        <button
                                          type="button"
                                          style={{
                                            padding: '5px 10px',
                                            fontSize: '11.5px',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '4px',
                                            background: '#0D9488',
                                            color: '#FFFFFF',
                                            border: 'none',
                                            borderRadius: '6px',
                                            fontWeight: 600,
                                            cursor: 'pointer',
                                            boxShadow: '0 1px 2px rgba(13, 148, 136, 0.2)',
                                            transition: 'all 0.15s ease'
                                          }}
                                          onClick={() => {
                                            setNewStockTx({
                                              type: 'Stock In',
                                              productName: p.name,
                                              productId: p.id,
                                              qty: 10,
                                              supplier: p.supplier || "Supplier",
                                              cost: p.unitCost || 0,
                                              batch: 'RESTOCK-' + Math.floor(100 + Math.random() * 900)
                                            });
                                            setShowAddStockInModal(true);
                                          }}
                                          title="Add stock (Stock In)"
                                        >
                                          <Plus size={12} color="#FFFFFF" /> Stock In
                                        </button>
                                        <button
                                          type="button"
                                          style={{
                                            padding: '5px 10px',
                                            fontSize: '11.5px',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '4px',
                                            background: '#FFF1F2',
                                            border: '1px solid #FECDD3',
                                            borderRadius: '6px',
                                            cursor: 'pointer',
                                            color: '#E11D48',
                                            fontWeight: 600,
                                            transition: 'all 0.15s ease'
                                          }}
                                          onClick={() => {
                                            setNewStockOutTx({
                                              type: 'Stock Out',
                                              productName: p.name,
                                              productId: p.id,
                                              qty: 1,
                                              supplier: "Floor Consumption",
                                              cost: p.unitCost || 0,
                                              reason: "Bay floor usage"
                                            });
                                            setShowAddStockOutModal(true);
                                          }}
                                          title="Consume (Stock Out)"
                                        >
                                          <ArrowUpRight size={12} color="#E11D48" /> Stock Out
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                );
                              });
                            })()}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* SUBTAB 1 & 2: STOCK IN & STOCK OUT */}
                  {(inventorySubTab === 'stock_in' || inventorySubTab === 'stock_out') && (
                    <div className="looks-table-card">
                      <table className="looks-master-table">
                        <thead>
                          <tr>
                            <th>
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#D97706', fontWeight: 800 }}>
                                <CalendarDays size={13} strokeWidth={2.5} /> Date
                              </span>
                            </th>
                            <th>
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#0D9488', fontWeight: 800 }}>
                                <Package size={13} strokeWidth={2.5} /> Product Name
                              </span>
                            </th>
                            <th>
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#0284C7', fontWeight: 800 }}>
                                <Tag size={13} strokeWidth={2.5} /> Type
                              </span>
                            </th>
                            <th>
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#16A34A', fontWeight: 800 }}>
                                <Layers size={13} strokeWidth={2.5} /> Quantity
                              </span>
                            </th>
                            <th>
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#4F46E5', fontWeight: 800 }}>
                                <Truck size={13} strokeWidth={2.5} /> Supplier / Source
                              </span>
                            </th>
                            <th>
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#D97706', fontWeight: 800 }}>
                                <IndianRupee size={13} strokeWidth={2.5} /> Cost / Total
                              </span>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {(() => {
                            const txs = (data.stockTransactions || []).filter(t => inventorySubTab === 'stock_in' ? t.type === 'Stock In' : t.type === 'Stock Out');
                            if (txs.length === 0) {
                              return (
                                <tr>
                                  <td colSpan={6} className="empty-table-cell">
                                    <div className="looks-empty-state">
                                      <Truck size={32} />
                                      <h4>No {inventorySubTab === 'stock_in' ? 'Stock In' : 'Stock Out'} records found</h4>
                                      <p>{inventorySubTab === 'stock_in' ? 'Record stock arrivals from suppliers.' : 'Log floor consumption.'}</p>
                                    </div>
                                  </td>
                                </tr>
                              );
                            }
                            return txs.map(tx => (
                              <tr key={tx.id}>
                                <td>{tx.date}</td>
                                <td><strong>{tx.productName}</strong></td>
                                <td><span className={`status-pill ${tx.type === 'Stock In' ? 'status-completed' : 'status-pending'}`}>{tx.type}</span></td>
                                <td><strong>{tx.qty} units</strong></td>
                                <td>{tx.supplier}</td>
                                <td>₹{tx.total?.toLocaleString() || tx.cost}</td>
                              </tr>
                            ));
                          })()}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* SUBTAB 4: SUPPLIERS */}
                  {inventorySubTab === 'suppliers' && (
                    <div className="looks-table-card">
                      <table className="looks-master-table">
                        <thead>
                          <tr>
                            <th>
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#4F46E5', fontWeight: 800 }}>
                                <Building2 size={13} strokeWidth={2.5} /> Supplier Name
                              </span>
                            </th>
                            <th>
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#7C3AED', fontWeight: 800 }}>
                                <User size={13} strokeWidth={2.5} /> Contact Person
                              </span>
                            </th>
                            <th>
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#16A34A', fontWeight: 800 }}>
                                <Phone size={13} strokeWidth={2.5} /> Phone
                              </span>
                            </th>
                            <th>
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#0284C7', fontWeight: 800 }}>
                                <Mail size={13} strokeWidth={2.5} /> Email
                              </span>
                            </th>
                            <th>
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#0D9488', fontWeight: 800 }}>
                                <Package size={13} strokeWidth={2.5} /> Products Supplied
                              </span>
                            </th>
                            <th>
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#D97706', fontWeight: 800 }}>
                                <IndianRupee size={13} strokeWidth={2.5} /> Outstanding Balance
                              </span>
                            </th>
                            <th style={{ textAlign: 'center' }}>
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#E11D48', fontWeight: 800 }}>
                                <Sparkles size={13} strokeWidth={2.5} /> Actions
                              </span>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {(() => {
                            const sups = data.suppliers || [];
                            if (sups.length === 0) {
                              return (
                                <tr>
                                  <td colSpan={7} className="empty-table-cell">
                                    <div className="looks-empty-state">
                                      <Truck size={32} />
                                      <h4>No suppliers registered yet</h4>
                                      <p>Register brand distributors, wholesale suppliers and stock vendors.</p>
                                    </div>
                                  </td>
                                </tr>
                              );
                            }
                            return sups.map(sup => (
                              <tr key={sup.id}>
                                <td><strong>{sup.name}</strong></td>
                                <td>{sup.contactPerson}</td>
                                <td>{sup.phone}</td>
                                <td>{sup.email}</td>
                                <td><span className="products-count-tag">{sup.productsSupplied || 0} items</span></td>
                                <td><strong style={{ color: 'var(--color-dark-rose)' }}>₹{(sup.balance || 0).toLocaleString()}</strong></td>
                                <td>
                                  <div className="action-buttons-cell">
                                    <button className="btn-gold-action" style={{ padding: '4px 12px', fontSize: '11.5px' }} onClick={() => showToast(`Order dispatched to ${sup.name}`)}>
                                      <Truck size={13} /> Order
                                    </button>
                                    <button className="btn-table-action-danger" onClick={() => deleteSupplier(sup.id)} title="Delete">
                                      <Trash2 size={13} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ));
                          })()}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* SUBTAB 5: LOW STOCK ALERTS */}
                  {inventorySubTab === 'low_stock' && (
                    <div className="looks-table-card">
                      <table className="looks-master-table">
                        <thead>
                          <tr>
                            <th>
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#0D9488', fontWeight: 800 }}>
                                <Package size={13} strokeWidth={2.5} /> Product Name
                              </span>
                            </th>
                            <th>
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#0284C7', fontWeight: 800 }}>
                                <Tag size={13} strokeWidth={2.5} /> Category
                              </span>
                            </th>
                            <th>
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#EF4444', fontWeight: 800 }}>
                                <Layers size={13} strokeWidth={2.5} /> Current Stock
                              </span>
                            </th>
                            <th>
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#D97706', fontWeight: 800 }}>
                                <AlertTriangle size={13} strokeWidth={2.5} /> Threshold Alert
                              </span>
                            </th>
                            <th>
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#4F46E5', fontWeight: 800 }}>
                                <Truck size={13} strokeWidth={2.5} /> Supplier
                              </span>
                            </th>
                            <th style={{ textAlign: 'center' }}>
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#E11D48', fontWeight: 800 }}>
                                <Sparkles size={13} strokeWidth={2.5} /> Action
                              </span>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {lowStockProducts.length === 0 ? (
                            <tr>
                              <td colSpan={6} className="empty-table-cell">
                                <div className="looks-empty-state">
                                  <CheckCircle2 size={32} style={{ color: '#10B981' }} />
                                  <h4>All products well-stocked</h4>
                                  <p>None of the salon inventory items are below minimum alert threshold.</p>
                                </div>
                              </td>
                            </tr>
                          ) : (
                            lowStockProducts.map(p => (
                              <tr key={p.id}>
                                <td><strong>{p.name}</strong></td>
                                <td><span className="category-tag">{p.category}</span></td>
                                <td><span className="stock-units-badge red">{p.stock} units</span></td>
                                <td>{p.minStockAlert || 5} units</td>
                                <td>{p.supplier || "L'Oréal Professional India"}</td>
                                <td>
                                  <button className="btn-gold-action" style={{ padding: '4px 12px', fontSize: '12px' }} onClick={() => addStock(p.id, 10)}>
                                    <Plus size={12} /> Reorder +10
                                  </button>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* SUBTAB 6: PRODUCT USAGE LOGS */}
                  {inventorySubTab === 'product_usage' && (
                    <div className="looks-table-card">
                      <table className="looks-master-table">
                        <thead>
                          <tr>
                            <th>
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#0D9488', fontWeight: 800 }}>
                                <Scissors size={13} strokeWidth={2.5} /> Service
                              </span>
                            </th>
                            <th>
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#7C3AED', fontWeight: 800 }}>
                                <User size={13} strokeWidth={2.5} /> Stylist
                              </span>
                            </th>
                            <th>
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#D97706', fontWeight: 800 }}>
                                <CalendarDays size={13} strokeWidth={2.5} /> Date
                              </span>
                            </th>
                            <th>
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#4F46E5', fontWeight: 800 }}>
                                <Package size={13} strokeWidth={2.5} /> Products Consumed
                              </span>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {(() => {
                            const logs = data.productUsageLogs || [];
                            if (logs.length === 0) {
                              return (
                                <tr>
                                  <td colSpan={4} className="empty-table-cell">
                                    <div className="looks-empty-state">
                                      <Layers size={32} />
                                      <h4>No floor consumption logs recorded</h4>
                                      <p>Track chemical tubes, developers, treatments and shampoo consumption at chairs.</p>
                                    </div>
                                  </td>
                                </tr>
                              );
                            }
                            return logs.map(log => (
                              <tr key={log.id}>
                                <td><strong>{log.service}</strong></td>
                                <td>{log.stylist}</td>
                                <td>{log.date}</td>
                                <td>
                                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                    {(log.productsUsed || []).map((p, i) => (
                                      <span key={i} className="product-usage-tag">
                                        {p.name} ({p.qty})
                                      </span>
                                    ))}
                                  </div>
                                </td>
                              </tr>
                            ));
                          })()}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* ========================================================================= */}
              {/* VIEW 4: 👨‍💼 EMPLOYEES (SIMPLE STRUCTURE: 4 TABS + FILTER BY ROLE DROPDOWN) */}
              {/* ========================================================================= */}
              {activeModule === 'employees' && (
                <div className="looks-view-wrapper employees-view">
                  {/* Header Row */}
                  <div className="looks-section-header">
                    <div>
                      <h2 className="section-main-title">Employees</h2>
                      <p className="section-lead-text">Manage your team, assign services and set incentive rules.</p>
                    </div>
                    <div className="header-actions-group">
                      <button className="btn-gold-action" onClick={() => setShowAddStaffModal(true)}>
                        <Plus size={16} /> Add Employee
                      </button>
                    </div>
                  </div>

                  {/* 4 Simple Tabs */}
                  <div className="looks-subtab-navigation-strip">
                    {[
                      { id: 'list', label: 'All Employees' },
                      { id: 'services', label: 'Services' },
                      { id: 'incentive', label: 'Incentive' },
                      { id: 'performance', label: 'Performance' }
                    ].map(st => (
                      <button
                        key={st.id}
                        className={`subtab-pill ${employeeSubTab === st.id ? 'active' : ''}`}
                        onClick={() => setEmployeeSubTab(st.id)}
                      >
                        {st.label}
                      </button>
                    ))}
                  </div>

                  {/* Filter by Role Dropdown + Search (Only in All Employees tab) */}
                  {employeeSubTab === 'list' && (
                    <div className="looks-filter-bar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '14px', marginBottom: '16px', flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          Filter by Role ▾
                        </label>
                        <select
                          className="looks-filter-select"
                          style={{
                            minWidth: '170px',
                            padding: '7px 12px',
                            fontSize: '13px',
                            fontWeight: 500,
                            borderRadius: '8px',
                            border: '1px solid var(--border-color)',
                            background: 'var(--bg-card)',
                            color: 'var(--text-primary)',
                            cursor: 'pointer'
                          }}
                          value={employeeRoleFilter}
                          onChange={(e) => setEmployeeRoleFilter(e.target.value)}
                        >
                          <option value="all">All</option>
                          <option value="Stylist">Stylist</option>
                          <option value="Beautician">Beautician</option>
                          <option value="Barber">Barber</option>
                          <option value="Receptionist">Receptionist</option>
                        </select>
                      </div>

                      <div className="search-pill-box" style={{ maxWidth: '280px', width: '100%' }}>
                        <Search size={14} />
                        <input
                          type="text"
                          placeholder="Search employee by name..."
                          value={employeeSearch}
                          onChange={(e) => setEmployeeSearch(e.target.value)}
                        />
                      </div>
                    </div>
                  )}

                  {/* 1. Main Employees Table (All Employees) */}
                  {employeeSubTab === 'list' && (
                    <div className="looks-table-card">
                      <table className="looks-master-table">
                        <thead>
                          <tr>
                            <th>
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#64748B', fontWeight: 800 }}>
                                <Camera size={13} strokeWidth={2.5} /> Photo
                              </span>
                            </th>
                            <th>
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#7C3AED', fontWeight: 800 }}>
                                <User size={13} strokeWidth={2.5} /> Name
                              </span>
                            </th>
                            <th>
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#0D9488', fontWeight: 800 }}>
                                <Tag size={13} strokeWidth={2.5} /> Role
                              </span>
                            </th>
                            <th>
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#DB2777', fontWeight: 800 }}>
                                <Scissors size={13} strokeWidth={2.5} /> Specialization
                              </span>
                            </th>
                            <th>
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#0284C7', fontWeight: 800 }}>
                                <Layers size={13} strokeWidth={2.5} /> Services
                              </span>
                            </th>
                            <th>
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#D97706', fontWeight: 800 }}>
                                <Percent size={13} strokeWidth={2.5} /> Incentive Rules
                              </span>
                            </th>
                            <th>
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#16A34A', fontWeight: 800 }}>
                                <CheckCircle2 size={13} strokeWidth={2.5} /> Status
                              </span>
                            </th>
                            <th style={{ textAlign: 'center' }}>
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#E11D48', fontWeight: 800 }}>
                                <Sparkles size={13} strokeWidth={2.5} /> Actions
                              </span>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {(() => {
                            const filtered = (data.staff || [])
                              .filter(e => {
                                if (!employeeRoleFilter || employeeRoleFilter === 'all') return true;
                                const role = (e.role || '').toLowerCase();
                                const filter = employeeRoleFilter.toLowerCase();
                                if (filter === 'stylist') {
                                  return role.includes('stylist') || role.includes('hair') || role.includes('colour') || role.includes('director');
                                }
                                if (filter === 'beautician') {
                                  return role.includes('beautician') || role.includes('esthetician') || role.includes('skin') || role.includes('bridal') || role.includes('makeup') || role.includes('spa') || role.includes('therapist');
                                }
                                if (filter === 'barber') {
                                  return role.includes('barber') || role.includes('grooming') || role.includes('shave');
                                }
                                if (filter === 'receptionist') {
                                  return role.includes('reception') || role.includes('concierge') || role.includes('front') || role.includes('manager') || role.includes('admin');
                                }
                                return role.includes(filter);
                              })
                              .filter(e => !employeeSearch || e.name.toLowerCase().includes(employeeSearch.toLowerCase()) || (e.role && e.role.toLowerCase().includes(employeeSearch.toLowerCase())));
                            if (filtered.length === 0) {
                              return (
                                <tr>
                                  <td colSpan={8} className="empty-table-cell">
                                    <div className="looks-empty-state">
                                      <Users size={32} />
                                      <h4>No employees found</h4>
                                      <p>Add stylists, therapists, barbers, and salon receptionists.</p>
                                    </div>
                                  </td>
                                </tr>
                              );
                            }
                            return filtered.map(emp => (
                              <tr key={emp.id}>
                                <td>
                                  <img src={emp.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'} alt={emp.name} className="table-row-thumb circle" />
                                </td>
                                <td><strong>{emp.name}</strong></td>
                                <td>{emp.role}</td>
                                <td>{emp.specialization || 'Hair, Colour, Spa'}</td>
                                <td><span className="products-count-tag">{emp.servicesCount || 12} Services</span></td>
                                <td>
                                  <button
                                    className="btn-view-rules"
                                    onClick={() => {
                                      setSelectedStylistForRule(emp.name);
                                      setEmployeeSubTab('incentive');
                                    }}
                                  >
                                    View Rules
                                  </button>
                                </td>
                                <td>
                                  <select
                                    className="looks-filter-select"
                                    style={{ padding: '3px 8px', fontSize: '11px' }}
                                    value={emp.status}
                                    onChange={(e) => toggleStaffStatus(emp.id, e.target.value)}
                                  >
                                    <option value="Active">Active</option>
                                    <option value="In-Service">In-Service</option>
                                    <option value="On-Leave">On Leave</option>
                                  </select>
                                </td>
                                <td>
                                  <div className="action-buttons-cell">
                                    <button
                                      className="btn-table-action"
                                      onClick={() => {
                                        setEditingStaff({
                                          ...emp,
                                          phone: (emp.phone || '').replace(/[^0-9]/g, '').slice(-10)
                                        });
                                        setShowEditStaffModal(true);
                                      }}
                                      title="Edit Employee"
                                    >
                                      <Edit2 size={14} />
                                    </button>
                                    <button
                                      className="btn-table-action-danger"
                                      onClick={() => {
                                        if (window.confirm(`Are you sure you want to remove "${emp.name}" from the team?`)) {
                                          deleteStaff(emp.id);
                                        }
                                      }}
                                      title="Delete Employee"
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ));
                          })()}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* 2. Employee Services Assignment Matrix */}
                  {employeeSubTab === 'services' && (
                    <div className="looks-table-card">
                      <table className="looks-master-table">
                        <thead>
                          <tr>
                            <th>
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#7C3AED', fontWeight: 800 }}>
                                <User size={13} strokeWidth={2.5} /> Stylist
                              </span>
                            </th>
                            <th>
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#0D9488', fontWeight: 800 }}>
                                <Tag size={13} strokeWidth={2.5} /> Role
                              </span>
                            </th>
                            <th>
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#0284C7', fontWeight: 800 }}>
                                <Scissors size={13} strokeWidth={2.5} /> Assigned Services
                              </span>
                            </th>
                            <th>
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#DB2777', fontWeight: 800 }}>
                                <Percent size={13} strokeWidth={2.5} /> Commission Rate
                              </span>
                            </th>
                            <th style={{ textAlign: 'center' }}>
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#E11D48', fontWeight: 800 }}>
                                <Sparkles size={13} strokeWidth={2.5} /> Actions
                              </span>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {(data.staff || []).length === 0 ? (
                            <tr>
                              <td colSpan={5} className="empty-table-cell">
                                <div className="looks-empty-state">
                                  <Scissors size={32} />
                                  <h4>No employee service assignments</h4>
                                  <p>Register team members to assign specialized salon services.</p>
                                </div>
                              </td>
                            </tr>
                          ) : (
                            (data.staff || []).map((st) => (
                              <tr key={st.id}>
                                <td><strong>{st.name}</strong></td>
                                <td>{st.role}</td>
                                <td><span className="products-count-tag">{st.specialization || 'Hair Colour, French Balayage, Keratin, Hair Spa'}</span></td>
                                <td><strong className="price-bold">{st.commissionRate || 12}%</strong></td>
                                <td>
                                  <button className="btn-table-action" onClick={() => showToast(`Manage assigned services for ${st.name}`)}>
                                    <Edit2 size={13} /> Assign
                                  </button>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* 3. Unified Incentive Tab (Incentive Rules & Commission Payouts) */}
                  {employeeSubTab === 'incentive' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      {/* Top: Incentive Rules Card */}
                      <div className="looks-incentive-rules-card">
                        <div className="rules-header-strip">
                          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                            <h4 className="rules-title">Incentive Rules - {currentIncentiveStylist}</h4>
                            <select
                              className="looks-filter-select"
                              value={selectedStylistForRule}
                              onChange={(e) => setSelectedStylistForRule(e.target.value)}
                            >
                              <option value="all">All Stylists</option>
                              {(data.staff || []).map(s => (
                                <option key={s.id} value={s.name}>{s.name}</option>
                              ))}
                            </select>
                          </div>
                          <button className="btn-gold-action" onClick={() => setShowAddRuleModal(true)}>
                            <Plus size={15} /> Add Rule
                          </button>
                        </div>

                        <table className="looks-master-table">
                          <thead>
                            <tr>
                              <th>
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#0D9488', fontWeight: 800 }}>
                                  <Scissors size={13} strokeWidth={2.5} /> Service
                                </span>
                              </th>
                              <th>
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#0284C7', fontWeight: 800 }}>
                                  <Tag size={13} strokeWidth={2.5} /> Incentive Type
                                </span>
                              </th>
                              <th>
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#D97706', fontWeight: 800 }}>
                                  <Percent size={13} strokeWidth={2.5} /> Value
                                </span>
                              </th>
                              <th>
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#475569', fontWeight: 800 }}>
                                  <FileText size={13} strokeWidth={2.5} /> Condition
                                </span>
                              </th>
                              <th>
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#16A34A', fontWeight: 800 }}>
                                  <CheckCircle2 size={13} strokeWidth={2.5} /> Status
                                </span>
                              </th>
                              <th style={{ textAlign: 'center' }}>
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#E11D48', fontWeight: 800 }}>
                                  <Sparkles size={13} strokeWidth={2.5} /> Actions
                                </span>
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {displayedRules.length === 0 ? (
                              <tr>
                                <td colSpan={6} className="empty-table-cell">
                                  <div className="looks-empty-state">
                                    <Sparkles size={32} />
                                    <h4>No incentive rules configured</h4>
                                    <p>Define percentage or fixed commission rewards per service for {currentIncentiveStylist}.</p>
                                  </div>
                                </td>
                              </tr>
                            ) : (
                              displayedRules.map(r => (
                                <tr key={r.id}>
                                  <td><strong>{r.service}</strong></td>
                                  <td>{r.incentiveType || r.type}</td>
                                  <td><span className="incentive-pill">{r.value}</span></td>
                                  <td>{r.condition}</td>
                                  <td><span className="status-pill status-completed">{r.status || 'Active'}</span></td>
                                  <td>
                                    <div className="action-buttons-cell">
                                      <button className="btn-table-action-danger" onClick={() => deleteIncentiveRule(r.id)} title="Delete">
                                        <Trash2 size={14} />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>

                      {/* Bottom: Incentive Records / Payouts */}
                      <div className="looks-table-card">
                        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                          <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>Employee Commission Payouts</h4>
                          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Accrued from billed salon appointments &amp; services</span>
                        </div>
                        <table className="looks-master-table">
                          <thead>
                            <tr>
                              <th>
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#7C3AED', fontWeight: 800 }}>
                                  <User size={13} strokeWidth={2.5} /> Stylist
                                </span>
                              </th>
                              <th>
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#0284C7', fontWeight: 800 }}>
                                  <Scissors size={13} strokeWidth={2.5} /> Total Services Billed
                                </span>
                              </th>
                              <th>
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#D97706', fontWeight: 800 }}>
                                  <IndianRupee size={13} strokeWidth={2.5} /> Gross Service Value
                                </span>
                              </th>
                              <th>
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#DB2777', fontWeight: 800 }}>
                                  <Percent size={13} strokeWidth={2.5} /> Commission Earned
                                </span>
                              </th>
                              <th>
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#16A34A', fontWeight: 800 }}>
                                  <CheckCircle2 size={13} strokeWidth={2.5} /> Payout Status
                                </span>
                              </th>
                              <th style={{ textAlign: 'center' }}>
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#E11D48', fontWeight: 800 }}>
                                  <Sparkles size={13} strokeWidth={2.5} /> Action
                                </span>
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {topEmployees.length === 0 ? (
                              <tr>
                                <td colSpan={6} className="empty-table-cell">
                                  <div className="looks-empty-state">
                                    <Sparkles size={32} />
                                    <h4>No incentive records available</h4>
                                    <p>Commission records will accrue as services are booked and billed.</p>
                                  </div>
                                </td>
                              </tr>
                            ) : (
                              topEmployees.map(e => (
                                <tr key={e.id}>
                                  <td><strong>{e.name}</strong></td>
                                  <td>{e.services}</td>
                                  <td>₹{e.revenue.toLocaleString()}</td>
                                  <td><strong className="price-bold" style={{ color: 'var(--color-primary-rose)' }}>₹{e.incentive.toLocaleString()}</strong></td>
                                  <td><span className="status-pill status-completed">Ready for Payout</span></td>
                                  <td>
                                    <button className="btn-gold-action" style={{ padding: '4px 10px', fontSize: '11px' }} onClick={() => showToast(`Payout of ₹${e.incentive.toLocaleString()} processed for ${e.name}`)}>
                                      <Check size={12} /> Pay Now
                                    </button>
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* 4. Performance Subtab */}
                  {employeeSubTab === 'performance' && (
                    <div className="looks-table-card">
                      <table className="looks-master-table">
                        <thead>
                          <tr>
                            <th>
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#D97706', fontWeight: 800 }}>
                                <Award size={13} strokeWidth={2.5} /> Rank
                              </span>
                            </th>
                            <th>
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#7C3AED', fontWeight: 800 }}>
                                <User size={13} strokeWidth={2.5} /> Stylist
                              </span>
                            </th>
                            <th>
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#F59E0B', fontWeight: 800 }}>
                                <Star size={13} strokeWidth={2.5} /> Rating
                              </span>
                            </th>
                            <th>
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#0D9488', fontWeight: 800 }}>
                                <Users size={13} strokeWidth={2.5} /> Client Retention
                              </span>
                            </th>
                            <th>
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#16A34A', fontWeight: 800 }}>
                                <IndianRupee size={13} strokeWidth={2.5} /> Revenue Generated
                              </span>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {topEmployees.length === 0 ? (
                            <tr>
                              <td colSpan={5} className="empty-table-cell">
                                <div className="looks-empty-state">
                                  <Users size={32} />
                                  <h4>No performance records</h4>
                                  <p>Performance metrics will compute dynamically as transactions occur.</p>
                                </div>
                              </td>
                            </tr>
                          ) : (
                            topEmployees.map(e => (
                              <tr key={e.id}>
                                <td><span className="rank-badge">{e.rank}</span></td>
                                <td><strong>{e.name}</strong> ({e.role})</td>
                                <td>⭐ 4.95</td>
                                <td>92% Repeat Clients</td>
                                <td><strong>₹{e.revenue.toLocaleString()}</strong></td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* ========================================================================= */}
              {/* VIEW 5: 🎯 LEAD MANAGEMENT LIFECYCLE (MATCHING WORKFLOW DIAGRAM) */}
              {/* ========================================================================= */}
              {activeModule === 'leads' && (
                <div className="looks-view-wrapper leads-view" style={{ padding: '4px 0' }}>
                  {/* Top Header Row with Title, View Toggle & Golden Add New Lead Button */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '24px', lineHeight: 1 }}>📋</span>
                      <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.3px' }}>
                        Lead Management
                      </h2>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {/* Segmented View Switcher: Main Table vs Kanban Pipeline */}
                      <div style={{ display: 'inline-flex', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '3px', boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}>
                        <button
                          type="button"
                          onClick={() => setLeadViewMode('table')}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '6px 14px',
                            borderRadius: '6px',
                            border: 'none',
                            fontSize: '12px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            background: leadViewMode === 'table' ? '#1E293B' : 'transparent',
                            color: leadViewMode === 'table' ? '#FFFFFF' : '#64748B',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <List size={14} /> Main Table
                        </button>
                        <button
                          type="button"
                          onClick={() => setLeadViewMode('kanban')}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '6px 14px',
                            borderRadius: '6px',
                            border: 'none',
                            fontSize: '12px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            background: leadViewMode === 'kanban' ? '#1E293B' : 'transparent',
                            color: leadViewMode === 'kanban' ? '#FFFFFF' : '#64748B',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <Columns size={14} /> Kanban Pipeline
                        </button>
                      </div>

                      {/* Golden Add New Lead Button */}
                      <button
                        type="button"
                        onClick={() => setShowAddLeadModal(true)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '9px 18px',
                          background: '#D4A373',
                          color: '#1E293B',
                          borderRadius: '8px',
                          border: 'none',
                          fontWeight: 700,
                          fontSize: '13px',
                          cursor: 'pointer',
                          boxShadow: '0 2px 6px rgba(212, 163, 115, 0.25)',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <Plus size={16} strokeWidth={2.5} /> Add New Lead
                      </button>
                    </div>
                  </div>

                  {/* 5 KPI Stats Cards Row (Screenshot 1 & 2) */}
                  {(() => {
                    const allL = data.leads || [];
                    const totalLeads = allL.length;
                    const newLeads = allL.filter(l => (l.status || '').toLowerCase() === 'new' || l.stage === 'lead_generated').length;
                    const todayStr = new Date().toISOString().split('T')[0];
                    const followUpToday = allL.filter(l => {
                      const f = (l.nextFollowUp || '').toLowerCase();
                      const s = (l.status || '').toLowerCase();
                      return f.includes(todayStr) || f.includes('today') || s.includes('follow');
                    }).length;
                    const interestedLeads = allL.filter(l => (l.status || '').toLowerCase() === 'interested' || l.stage === 'interested').length;
                    const convertedLeads = allL.filter(l => (l.status || '').toLowerCase() === 'converted' || l.stage === 'converted').length;

                    return (
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                        gap: '14px',
                        marginBottom: '20px'
                      }}>
                        {/* 1. TOTAL LEADS (Dark Navy Card) */}
                        <div style={{
                          background: '#111827',
                          borderRadius: '12px',
                          padding: '16px 20px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '14px',
                          color: '#FFFFFF',
                          boxShadow: '0 2px 8px rgba(17, 24, 39, 0.15)'
                        }}>
                          <div style={{
                            width: '38px',
                            height: '38px',
                            borderRadius: '8px',
                            background: 'rgba(255, 255, 255, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#94A3B8',
                            flexShrink: 0
                          }}>
                            <Users size={18} />
                          </div>
                          <div>
                            <div style={{ fontSize: '10.5px', fontWeight: 700, letterSpacing: '0.5px', color: '#94A3B8', textTransform: 'uppercase' }}>
                              TOTAL LEADS
                            </div>
                            <div style={{ fontSize: '26px', fontWeight: 800, color: '#FFFFFF', marginTop: '2px', lineHeight: 1 }}>
                              {totalLeads}
                            </div>
                          </div>
                        </div>

                        {/* 2. NEW LEADS (Soft Sky Blue) */}
                        <div style={{
                          background: '#EFF6FF',
                          border: '1px solid #BFDBFE',
                          borderRadius: '12px',
                          padding: '16px 20px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '14px'
                        }}>
                          <div style={{
                            width: '38px',
                            height: '38px',
                            borderRadius: '8px',
                            background: 'rgba(2, 132, 199, 0.12)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#0284C7',
                            flexShrink: 0
                          }}>
                            <Sparkles size={18} />
                          </div>
                          <div>
                            <div style={{ fontSize: '10.5px', fontWeight: 700, letterSpacing: '0.5px', color: '#64748B', textTransform: 'uppercase' }}>
                              NEW LEADS
                            </div>
                            <div style={{ fontSize: '26px', fontWeight: 800, color: '#0284C7', marginTop: '2px', lineHeight: 1 }}>
                              {newLeads}
                            </div>
                          </div>
                        </div>

                        {/* 3. FOLLOW-UP TO... (Soft Amber) */}
                        <div style={{
                          background: '#FFFBEB',
                          border: '1px solid #FDE68A',
                          borderRadius: '12px',
                          padding: '16px 20px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '14px'
                        }}>
                          <div style={{
                            width: '38px',
                            height: '38px',
                            borderRadius: '8px',
                            background: 'rgba(217, 119, 6, 0.12)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#D97706',
                            flexShrink: 0
                          }}>
                            <Clock size={18} />
                          </div>
                          <div>
                            <div style={{ fontSize: '10.5px', fontWeight: 700, letterSpacing: '0.5px', color: '#64748B', textTransform: 'uppercase' }}>
                              FOLLOW-UP TO...
                            </div>
                            <div style={{ fontSize: '26px', fontWeight: 800, color: '#D97706', marginTop: '2px', lineHeight: 1 }}>
                              {followUpToday}
                            </div>
                          </div>
                        </div>

                        {/* 4. INTERESTED (Soft Mint Green) */}
                        <div style={{
                          background: '#F0FDF4',
                          border: '1px solid #BBF7D0',
                          borderRadius: '12px',
                          padding: '16px 20px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '14px'
                        }}>
                          <div style={{
                            width: '38px',
                            height: '38px',
                            borderRadius: '8px',
                            background: 'rgba(22, 163, 74, 0.12)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#16A34A',
                            flexShrink: 0
                          }}>
                            <Flame size={18} />
                          </div>
                          <div>
                            <div style={{ fontSize: '10.5px', fontWeight: 700, letterSpacing: '0.5px', color: '#64748B', textTransform: 'uppercase' }}>
                              INTERESTED
                            </div>
                            <div style={{ fontSize: '26px', fontWeight: 800, color: '#16A34A', marginTop: '2px', lineHeight: 1 }}>
                              {interestedLeads}
                            </div>
                          </div>
                        </div>

                        {/* 5. CONVERTED (Soft Cyan / Teal) */}
                        <div style={{
                          background: '#ECFEFF',
                          border: '1px solid #99F6E4',
                          borderRadius: '12px',
                          padding: '16px 20px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '14px'
                        }}>
                          <div style={{
                            width: '38px',
                            height: '38px',
                            borderRadius: '8px',
                            background: 'rgba(13, 148, 136, 0.12)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#0D9488',
                            flexShrink: 0
                          }}>
                            <Award size={18} />
                          </div>
                          <div>
                            <div style={{ fontSize: '10.5px', fontWeight: 700, letterSpacing: '0.5px', color: '#64748B', textTransform: 'uppercase' }}>
                              CONVERTED
                            </div>
                            <div style={{ fontSize: '26px', fontWeight: 800, color: '#0D9488', marginTop: '2px', lineHeight: 1 }}>
                              {convertedLeads}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Search and Filters Bar (Screenshot 1 & 2) */}
                  <div style={{
                    background: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    borderRadius: '12px',
                    padding: '14px 18px',
                    marginBottom: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}>
                    {/* Search Pill Input */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: '#FFFFFF',
                      border: '1px solid #CBD5E1',
                      borderRadius: '24px',
                      padding: '7px 16px',
                      width: '380px',
                      maxWidth: '100%'
                    }}>
                      <Search size={15} color="#64748B" />
                      <input
                        type="text"
                        placeholder="Search name, phone, email, service..."
                        value={leadSearch}
                        onChange={(e) => setLeadSearch(e.target.value)}
                        style={{
                          border: 'none',
                          outline: 'none',
                          width: '100%',
                          fontSize: '12.5px',
                          color: '#1E293B',
                          background: 'transparent'
                        }}
                      />
                      {leadSearch && (
                        <button
                          type="button"
                          onClick={() => setLeadSearch('')}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#94A3B8' }}
                        >
                          <X size={13} />
                        </button>
                      )}
                    </div>

                    {/* Filter Toggle Button */}
                    <button
                      type="button"
                      onClick={() => setIsLeadFilterOpen(!isLeadFilterOpen)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '7px 18px',
                        borderRadius: '20px',
                        fontSize: '12.5px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        border: isLeadFilterOpen ? 'none' : '1px solid #CBD5E1',
                        background: isLeadFilterOpen ? '#7C3AED' : '#FFFFFF',
                        color: isLeadFilterOpen ? '#FFFFFF' : '#334155',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <Filter size={14} /> {isLeadFilterOpen ? 'Hide Filters' : 'Filters'}
                    </button>
                  </div>

                  {/* Expandable Filter Drawer Panel (Screenshot 2) */}
                  {isLeadFilterOpen && (
                    <div style={{
                      background: '#FFFFFF',
                      border: '1px solid #E2E8F0',
                      borderRadius: '12px',
                      padding: '20px 24px',
                      marginBottom: '16px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
                    }}>
                      {/* Row 1: 4 columns */}
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '16px',
                        marginBottom: '16px'
                      }}>
                        {/* 1. ASSIGNED AGENT */}
                        <div>
                          <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', letterSpacing: '0.5px', marginBottom: '6px', textTransform: 'uppercase' }}>
                            ASSIGNED AGENT
                          </label>
                          <select
                            value={leadStaffFilter}
                            onChange={(e) => setLeadStaffFilter(e.target.value)}
                            style={{
                              width: '100%',
                              padding: '9px 12px',
                              borderRadius: '8px',
                              border: '1px solid #CBD5E1',
                              fontSize: '13px',
                              color: '#1E293B',
                              background: '#FFFFFF',
                              outline: 'none'
                            }}
                          >
                            <option value="all">All Agents</option>
                            <option value="Unassigned">Unassigned</option>
                            {(data.staff || []).map(st => (
                              <option key={st.id} value={st.name}>{st.name}</option>
                            ))}
                          </select>
                        </div>

                        {/* 2. LEAD STAGE */}
                        <div>
                          <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', letterSpacing: '0.5px', marginBottom: '6px', textTransform: 'uppercase' }}>
                            LEAD STAGE
                          </label>
                          <select
                            value={leadStatusFilter}
                            onChange={(e) => setLeadStatusFilter(e.target.value)}
                            style={{
                              width: '100%',
                              padding: '9px 12px',
                              borderRadius: '8px',
                              border: '1px solid #CBD5E1',
                              fontSize: '13px',
                              color: '#1E293B',
                              background: '#FFFFFF',
                              outline: 'none'
                            }}
                          >
                            <option value="all">All Stages</option>
                            <option value="New">1. New</option>
                            <option value="Contacted">2. Contacted</option>
                            <option value="Follow-up">3. Follow-up</option>
                            <option value="Interested">4. Interested</option>
                            <option value="Appointment Booked">5. Book Appointment</option>
                            <option value="Service Done">6. Service Done</option>
                            <option value="Converted">7. Converted (VIP)</option>
                            <option value="Not Interested">Not Interested</option>
                            <option value="Lost">Lost</option>
                          </select>
                        </div>

                        {/* 3. LEAD STATUS */}
                        <div>
                          <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', letterSpacing: '0.5px', marginBottom: '6px', textTransform: 'uppercase' }}>
                            LEAD STATUS
                          </label>
                          <select
                            value={leadSubStatusFilter}
                            onChange={(e) => setLeadSubStatusFilter(e.target.value)}
                            style={{
                              width: '100%',
                              padding: '9px 12px',
                              borderRadius: '8px',
                              border: '1px solid #CBD5E1',
                              fontSize: '13px',
                              color: '#1E293B',
                              background: '#FFFFFF',
                              outline: 'none'
                            }}
                          >
                            <option value="all">All Statuses</option>
                            <option value="active">Active Pipeline</option>
                            <option value="follow_scheduled">Follow-up Scheduled</option>
                            <option value="rescheduled">Rescheduled</option>
                            <option value="no_response">No Response</option>
                            <option value="confirmed">Appointment Confirmed</option>
                            <option value="completed">Service Completed</option>
                            <option value="lost">Lost / Dropped</option>
                          </select>
                        </div>

                        {/* 4. LEAD TYPE */}
                        <div>
                          <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', letterSpacing: '0.5px', marginBottom: '6px', textTransform: 'uppercase' }}>
                            LEAD TYPE
                          </label>
                          <select
                            value={leadSourceFilter}
                            onChange={(e) => setLeadSourceFilter(e.target.value)}
                            style={{
                              width: '100%',
                              padding: '9px 12px',
                              borderRadius: '8px',
                              border: '1px solid #CBD5E1',
                              fontSize: '13px',
                              color: '#1E293B',
                              background: '#FFFFFF',
                              outline: 'none'
                            }}
                          >
                            <option value="all">All Types</option>
                            <option value="Instagram">Instagram</option>
                            <option value="Google">Google</option>
                            <option value="Website">Website</option>
                            <option value="Walk-in">Walk-in</option>
                            <option value="Referral">Referral</option>
                            <option value="WhatsApp">WhatsApp</option>
                            <option value="Facebook">Facebook</option>
                          </select>
                        </div>
                      </div>

                      {/* Row 2: 2 columns + reset */}
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '16px',
                        alignItems: 'flex-end'
                      }}>
                        {/* 5. SERVICE */}
                        <div>
                          <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', letterSpacing: '0.5px', marginBottom: '6px', textTransform: 'uppercase' }}>
                            SERVICE
                          </label>
                          <select
                            value={leadServiceFilter}
                            onChange={(e) => setLeadServiceFilter(e.target.value)}
                            style={{
                              width: '100%',
                              padding: '9px 12px',
                              borderRadius: '8px',
                              border: '1px solid #CBD5E1',
                              fontSize: '13px',
                              color: '#1E293B',
                              background: '#FFFFFF',
                              outline: 'none'
                            }}
                          >
                            <option value="all">All Services</option>
                            {(data.services || []).map(s => (
                              <option key={s.id} value={s.name}>{s.name}</option>
                            ))}
                          </select>
                        </div>

                        {/* 6. FOLLOW-UP SCHEDULE */}
                        <div>
                          <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', letterSpacing: '0.5px', marginBottom: '6px', textTransform: 'uppercase' }}>
                            FOLLOW-UP SCHEDULE
                          </label>
                          <select
                            value={leadFollowUpFilter}
                            onChange={(e) => setLeadFollowUpFilter(e.target.value)}
                            style={{
                              width: '100%',
                              padding: '9px 12px',
                              borderRadius: '8px',
                              border: '1px solid #CBD5E1',
                              fontSize: '13px',
                              color: '#1E293B',
                              background: '#FFFFFF',
                              outline: 'none'
                            }}
                          >
                            <option value="all">All Dates</option>
                            <option value="today">Today</option>
                            <option value="tomorrow">Tomorrow</option>
                            <option value="overdue">Overdue</option>
                            <option value="this_week">This Week</option>
                            <option value="this_month">This Month</option>
                          </select>
                        </div>

                        {/* Reset Filters button if any filter is active */}
                        {(leadSearch || leadStatusFilter !== 'all' || leadSubStatusFilter !== 'all' || leadSourceFilter !== 'all' || leadServiceFilter !== 'all' || leadStaffFilter !== 'all' || leadFollowUpFilter !== 'all') && (
                          <div>
                            <button
                              type="button"
                              onClick={() => {
                                setLeadSearch('');
                                setLeadStatusFilter('all');
                                setLeadSubStatusFilter('all');
                                setLeadSourceFilter('all');
                                setLeadServiceFilter('all');
                                setLeadStaffFilter('all');
                                setLeadFollowUpFilter('all');
                              }}
                              style={{
                                padding: '9px 14px',
                                borderRadius: '8px',
                                border: '1px solid #FCA5A5',
                                background: '#FEF2F2',
                                color: '#EF4444',
                                fontSize: '12px',
                                fontWeight: 700,
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px'
                              }}
                            >
                              ✕ Reset All Filters
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* VIEW MODE A: 📋 ALL LEADS - MASTER TABLE VIEW */}
                  {leadViewMode === 'table' && (
                    <div className="looks-table-card" style={{ width: '100%', overflowX: 'auto', borderRadius: '12px', border: '1px solid #E2E8F0', background: '#FFFFFF' }}>
                      <table className="looks-master-table" style={{ width: '100%', borderCollapse: 'collapse', minWidth: '980px' }}>
                        <thead>
                          <tr style={{ background: '#FFFFFF', borderBottom: '1px solid #E2E8F0' }}>
                            <th style={{ padding: '14px 18px', textAlign: 'left', fontSize: '13px', fontWeight: 700 }}>
                              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#8B5CF6' }}>
                                <User size={15} color="#8B5CF6" /> Lead Name
                              </span>
                            </th>
                            <th style={{ padding: '14px 18px', textAlign: 'left', fontSize: '13px', fontWeight: 700 }}>
                              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#EC4899' }}>
                                <Scissors size={15} color="#EC4899" /> Service
                              </span>
                            </th>
                            <th style={{ padding: '14px 18px', textAlign: 'left', fontSize: '13px', fontWeight: 700 }}>
                              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#0284C7' }}>
                                <Tag size={15} color="#0284C7" /> Source
                              </span>
                            </th>
                            <th style={{ padding: '14px 18px', textAlign: 'left', fontSize: '13px', fontWeight: 700 }}>
                              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#6366F1' }}>
                                <UserCheck size={15} color="#6366F1" /> Staff
                              </span>
                            </th>
                            <th style={{ padding: '14px 18px', textAlign: 'left', fontSize: '13px', fontWeight: 700 }}>
                              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10B981' }}>
                                <CheckCircle2 size={15} color="#10B981" /> Status
                              </span>
                            </th>
                            <th style={{ padding: '14px 18px', textAlign: 'left', fontSize: '13px', fontWeight: 700 }}>
                              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#F59E0B' }}>
                                <Clock size={15} color="#F59E0B" /> Follow-up
                              </span>
                            </th>
                            <th style={{ padding: '14px 18px', textAlign: 'center', fontSize: '13px', fontWeight: 700 }}>
                              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: '#F43F5E' }}>
                                <Sparkles size={15} color="#F43F5E" /> Action
                              </span>
                            </th>
                          </tr>
                        </thead>
                            <tbody>
                              {(() => {
                                const allLeads = data.leads || [];

                                // Apply all 7 filters
                                const filtered = allLeads
                                  .filter(l => {
                                    if (leadSubStatusFilter === 'all') return true;
                                    const s = (l.status || '').toLowerCase();
                                    if (leadSubStatusFilter === 'active') return s !== 'converted' && s !== 'lost' && !s.includes('not interest');
                                    if (leadSubStatusFilter === 'follow_scheduled') return s.includes('follow') || !!l.nextFollowUp;
                                    if (leadSubStatusFilter === 'confirmed') return s.includes('book') || s.includes('confirm');
                                    if (leadSubStatusFilter === 'completed') return s.includes('service done');
                                    if (leadSubStatusFilter === 'lost') return s.includes('lost') || s.includes('not interest');
                                    return true;
                                  })
                                  .filter(l => {
                                    if (leadStatusFilter === 'all') return true;
                                    const s = (l.status || '').toLowerCase();
                                    const stg = (l.stage || '').toLowerCase();
                                    const filterLower = leadStatusFilter.toLowerCase();
                                    if (filterLower === 'new') return s === 'new' || stg === 'lead_generated';
                                    if (filterLower === 'contacted') return s === 'contacted' || s === 'assigned' || stg === 'contact_customer' || stg === 'assign_employee';
                                    if (filterLower === 'follow-up') return s.includes('follow') || stg === 'follow_up';
                                    if (filterLower === 'interested') return s === 'interested' || stg === 'interested';
                                    if (filterLower === 'appointment booked') return s.includes('book') || s.includes('confirmed') || stg === 'booking';
                                    if (filterLower === 'service done') return s === 'service done' || stg === 'service_done';
                                    if (filterLower === 'converted') return s === 'converted' || stg === 'converted';
                                    if (filterLower === 'lost' || filterLower === 'not interested') return s.includes('lost') || s.includes('not interest') || stg === 'not_interested';
                                    return s === filterLower;
                                  })
                                  .filter(l => {
                                    if (leadSourceFilter === 'all') return true;
                                    return (l.source || '').toLowerCase().includes(leadSourceFilter.toLowerCase());
                                  })
                                  .filter(l => {
                                    if (leadServiceFilter === 'all') return true;
                                    return (l.interestedService || '').toLowerCase().includes(leadServiceFilter.toLowerCase());
                                  })
                                  .filter(l => {
                                    if (leadStaffFilter === 'all') return true;
                                    if (leadStaffFilter === 'Unassigned') return !l.assignedTo || l.assignedTo === 'Unassigned';
                                    return (l.assignedTo || '').toLowerCase().includes(leadStaffFilter.toLowerCase());
                                  })
                                  .filter(l => {
                                    if (leadFollowUpFilter === 'all') return true;
                                    const todayStr = new Date().toISOString().split('T')[0];
                                    const fUp = (l.nextFollowUp || '').toLowerCase();
                                    if (leadFollowUpFilter === 'today') return fUp.includes(todayStr) || fUp.includes('today');
                                    if (leadFollowUpFilter === 'tomorrow') return fUp.includes('tomorrow');
                                    if (leadFollowUpFilter === 'overdue') return fUp.includes('yesterday') || (fUp.length >= 10 && fUp.slice(0, 10) < todayStr);
                                    if (leadFollowUpFilter === 'upcoming') return fUp && !fUp.includes('yesterday') && (!fUp.slice(0, 10) || fUp.slice(0, 10) >= todayStr);
                                    return true;
                                  })
                                  .filter(l => {
                                    if (leadDateRange === 'all') return true;
                                    const createdStr = (l.createdAt || '').slice(0, 10);
                                    const todayStr = new Date().toISOString().split('T')[0];
                                    if (leadDateRange === 'today') return createdStr === todayStr;
                                    if (leadDateRange === 'custom') {
                                      if (leadCustomStartDate && createdStr < leadCustomStartDate) return false;
                                      if (leadCustomEndDate && createdStr > leadCustomEndDate) return false;
                                      return true;
                                    }
                                    return true;
                                  })
                                  .filter(l => {
                                    if (!leadSearch) return true;
                                    const q = leadSearch.toLowerCase();
                                    return (l.name || '').toLowerCase().includes(q) ||
                                      (l.phone || '').includes(q) ||
                                      (l.email || '').toLowerCase().includes(q) ||
                                      (l.interestedService || '').toLowerCase().includes(q) ||
                                      (l.source || '').toLowerCase().includes(q) ||
                                      (l.assignedTo || '').toLowerCase().includes(q);
                                  });

                                if (filtered.length === 0) {
                                  return (
                                    <tr>
                                      <td colSpan={7} style={{ padding: '60px 20px', textAlign: 'center' }}>
                                        <div style={{ maxWidth: '400px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                                          <div style={{
                                            width: '64px',
                                            height: '64px',
                                            borderRadius: '50%',
                                            background: '#F1F5F9',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            marginBottom: '6px'
                                          }}>
                                            <Target size={36} strokeWidth={1.5} color="#94A3B8" />
                                          </div>
                                          <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 700, color: '#1E293B' }}>
                                            No leads matching filter
                                          </h3>
                                          <p style={{ margin: 0, fontSize: '13px', color: '#64748B' }}>
                                            Try clearing your status, staff or date filters.
                                          </p>
                                        </div>
                                      </td>
                                    </tr>
                                  );
                                }

                                const sourceColors = {
                                  'Instagram Ad': { bg: 'rgba(225, 48, 108, 0.12)', color: '#E1306C' },
                                  'Google Search': { bg: 'rgba(66, 133, 244, 0.12)', color: '#4285F4' },
                                  'Website Direct': { bg: 'rgba(124, 58, 237, 0.12)', color: '#7C3AED' },
                                  'Website': { bg: 'rgba(124, 58, 237, 0.12)', color: '#7C3AED' },
                                  'WhatsApp': { bg: 'rgba(37, 211, 102, 0.12)', color: '#16A34A' },
                                  'Walk-in': { bg: 'rgba(13, 148, 136, 0.12)', color: '#0D9488' },
                                  'Referral': { bg: 'rgba(217, 119, 6, 0.12)', color: '#D97706' },
                                  'Facebook': { bg: 'rgba(24, 119, 242, 0.12)', color: '#1877F2' }
                                };

                                return filtered.map(lead => {
                                  const cleanPhone = (lead.phone || '').replace(/[^0-9]/g, '').slice(-10);
                                  const srcStyle = sourceColors[lead.source] || { bg: '#F1F5F9', color: '#475569' };
                                  const isConverted = lead.status === 'Converted' || lead.stage === 'converted';
                                  const isServiceDone = lead.status === 'Service Done' || lead.stage === 'service_done';
                                  const isBooked = lead.status === 'Appointment Booked' || lead.status === 'Confirmed' || lead.stage === 'booking';
                                  const isInterested = lead.status === 'Interested' || lead.stage === 'interested';
                                  const isFollowUp = (lead.status || '').toLowerCase().includes('follow') || lead.stage === 'follow_up';
                                  const isContacted = lead.status === 'Contacted' || lead.status === 'Assigned' || lead.stage === 'assign_employee' || lead.stage === 'contact_customer';
                                  const isNew = lead.status === 'New' || lead.stage === 'lead_generated';
                                  const isLost = lead.status === 'Not Interested' || lead.status === 'Lost' || lead.stage === 'not_interested';

                                  return (
                                    <tr key={lead.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                                      {/* 1. Lead Information */}
                                      <td style={{ padding: '12px 14px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                          <div style={{
                                            width: '36px',
                                            height: '36px',
                                            borderRadius: '50%',
                                            background: '#F1F5F9',
                                            color: '#0F172A',
                                            fontWeight: 800,
                                            fontSize: '13px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flexShrink: 0
                                          }}>
                                            {(lead.name || 'L').charAt(0).toUpperCase()}
                                          </div>
                                          <div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                              <strong style={{ fontSize: '13px', color: '#0F172A' }}>{lead.name}</strong>
                                              {lead.gender && (
                                                <span style={{ fontSize: '9.5px', padding: '1px 5px', borderRadius: '4px', background: '#F8FAFC', color: '#64748B', border: '1px solid #E2E8F0', fontWeight: 600 }}>
                                                  {lead.gender}
                                                </span>
                                              )}
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#64748B', marginTop: '2px' }}>
                                              <span>{lead.phone}</span>
                                              {lead.email && <span>• {lead.email}</span>}
                                            </div>
                                          </div>
                                        </div>
                                      </td>

                                      {/* 2. Interested Service & Preferred Date */}
                                      <td style={{ padding: '12px 14px' }}>
                                        <div>
                                          <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#0F172A' }}>
                                            {lead.interestedService || 'Hair Styling'}
                                          </div>
                                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                                            <span style={{ fontSize: '11px', fontWeight: 800, color: '#0D9488' }}>
                                              Est. ₹{Number(lead.estimatedValue || 2500).toLocaleString('en-IN')}
                                            </span>
                                            {lead.preferredDate && (
                                              <span style={{ fontSize: '10.5px', color: '#64748B' }}>
                                                📅 Pref: {lead.preferredDate} {lead.preferredTime || ''}
                                              </span>
                                            )}
                                          </div>
                                        </div>
                                      </td>

                                      {/* 3. Lead Source */}
                                      <td style={{ padding: '12px 14px' }}>
                                        <span style={{
                                          padding: '3px 8px',
                                          borderRadius: '6px',
                                          fontSize: '11px',
                                          fontWeight: 700,
                                          background: srcStyle.bg,
                                          color: srcStyle.color,
                                          display: 'inline-block'
                                        }}>
                                          {lead.source || 'Website'}
                                        </span>
                                      </td>

                                      {/* 4. Assigned Staff */}
                                      <td style={{ padding: '12px 14px' }}>
                                        {lead.assignedTo && lead.assignedTo !== 'Unassigned' ? (
                                          <div>
                                            <span style={{ fontSize: '12px', fontWeight: 700, color: '#7C3AED', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                              👤 {lead.assignedTo}
                                            </span>
                                            <button
                                              type="button"
                                              onClick={() => setSelectedLeadForAssign(lead)}
                                              style={{ background: 'none', border: 'none', padding: 0, fontSize: '10px', color: '#64748B', textDecoration: 'underline', cursor: 'pointer' }}
                                            >
                                              Reassign Staff
                                            </button>
                                          </div>
                                        ) : (
                                          <button
                                            type="button"
                                            onClick={() => setSelectedLeadForAssign(lead)}
                                            style={{
                                              background: 'rgba(124, 58, 237, 0.08)',
                                              border: '1px dashed #7C3AED',
                                              color: '#7C3AED',
                                              padding: '4px 10px',
                                              borderRadius: '6px',
                                              fontSize: '11px',
                                              fontWeight: 700,
                                              cursor: 'pointer'
                                            }}
                                          >
                                            + Assign Staff
                                          </button>
                                        )}
                                      </td>

                                      {/* 5. Follow-up Date */}
                                      <td style={{ padding: '12px 14px' }}>
                                        <div>
                                          <div style={{ fontSize: '11.5px', fontWeight: 600, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <Clock size={11} color="#D97706" /> {lead.nextFollowUp || 'Not scheduled'}
                                          </div>
                                          <button
                                            type="button"
                                            onClick={() => {
                                              setSelectedLeadForFollowUp(lead);
                                              setFollowUpEntryForm({
                                                actionType: 'completed',
                                                type: 'Phone Call',
                                                notes: '',
                                                nextFollowUpDate: (lead.nextFollowUp || '').slice(0, 10) || new Date().toISOString().split('T')[0],
                                                nextFollowUpTime: '02:00 PM',
                                                lostReason: 'Pricing too high / Out of budget'
                                              });
                                            }}
                                            style={{ background: 'none', border: 'none', padding: 0, fontSize: '10.5px', color: '#0284C7', textDecoration: 'underline', cursor: 'pointer', marginTop: '2px' }}
                                          >
                                            Log Follow-up
                                          </button>
                                        </div>
                                      </td>

                                      {/* 6. Lead Status Badge */}
                                      <td style={{ padding: '12px 14px' }}>
                                        <span style={{
                                          padding: '4px 10px',
                                          borderRadius: '8px',
                                          fontSize: '11px',
                                          fontWeight: 800,
                                          display: 'inline-flex',
                                          alignItems: 'center',
                                          gap: '4px',
                                          background: isConverted ? 'rgba(13, 148, 136, 0.12)' :
                                            isServiceDone ? 'rgba(6, 182, 212, 0.12)' :
                                            isBooked ? 'rgba(124, 58, 237, 0.12)' :
                                            isInterested ? 'rgba(16, 185, 129, 0.12)' :
                                            isFollowUp ? 'rgba(234, 179, 8, 0.14)' :
                                            isContacted ? 'rgba(2, 132, 199, 0.12)' :
                                            isLost ? 'rgba(239, 68, 68, 0.12)' : 'rgba(217, 119, 6, 0.12)',
                                          color: isConverted ? '#0D9488' :
                                            isServiceDone ? '#0891B2' :
                                            isBooked ? '#7C3AED' :
                                            isInterested ? '#10B981' :
                                            isFollowUp ? '#B45309' :
                                            isContacted ? '#0284C7' :
                                            isLost ? '#EF4444' : '#D97706'
                                        }}>
                                          {isConverted ? '👑 Converted VIP' :
                                            isServiceDone ? '✓ Service Done' :
                                            isBooked ? '📅 Apt Confirmed' :
                                            isInterested ? '👍 Interested' :
                                            isFollowUp ? '🔁 Follow-up' :
                                            isContacted ? '📞 Contacted' :
                                            isLost ? '❌ Lost' : '🆕 New'}
                                        </span>
                                      </td>

                                      {/* 7. Pipeline Actions */}
                                      <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                          {/* Direct Reach Shortcuts */}
                                          <a
                                            href={`https://wa.me/91${cleanPhone}?text=${encodeURIComponent(`Hi ${lead.name}, Greetings from Looks Professional Salon! Regarding your inquiry for ${lead.interestedService || 'salon services'}, how may we assist you with scheduling your appointment?`)}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="btn-action-icon whatsapp"
                                            title="Chat on WhatsApp"
                                            style={{ width: '28px', height: '28px' }}
                                          >
                                            <MessageSquare size={13} />
                                          </a>
                                          <a
                                            href={`tel:${lead.phone}`}
                                            className="btn-action-icon call"
                                            title="Call Customer"
                                            style={{ width: '28px', height: '28px' }}
                                          >
                                            <Phone size={13} />
                                          </a>

                                          {/* Workflow Progression Button */}
                                          {isNew && (
                                            <button
                                              type="button"
                                              onClick={() => setSelectedLeadForAssign(lead)}
                                              style={{ background: '#7C3AED', color: '#FFFFFF', border: 'none', padding: '5px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}
                                              title="Step 2: Assign Stylist"
                                            >
                                              Assign ➔
                                            </button>
                                          )}

                                          {isContacted && (
                                            <button
                                              type="button"
                                              onClick={() => {
                                                setSelectedLeadForFollowUp(lead);
                                                setFollowUpEntryForm({
                                                  actionType: 'completed',
                                                  type: 'Phone Call',
                                                  notes: '',
                                                  nextFollowUpDate: new Date().toISOString().split('T')[0],
                                                  nextFollowUpTime: '02:00 PM',
                                                  lostReason: 'Pricing too high / Out of budget'
                                                });
                                              }}
                                              style={{ background: '#0284C7', color: '#FFFFFF', border: 'none', padding: '5px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}
                                              title="Step 3: Follow-up Customer"
                                            >
                                              Follow-up ➔
                                            </button>
                                          )}

                                          {isFollowUp && (
                                            <button
                                              type="button"
                                              onClick={() => {
                                                setSelectedLeadForFollowUp(lead);
                                                setFollowUpEntryForm({
                                                  actionType: 'completed',
                                                  type: 'Phone Call',
                                                  notes: '',
                                                  nextFollowUpDate: new Date().toISOString().split('T')[0],
                                                  nextFollowUpTime: '02:00 PM',
                                                  lostReason: 'Pricing too high / Out of budget'
                                                });
                                              }}
                                              style={{ background: '#EAB308', color: '#FFFFFF', border: 'none', padding: '5px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 800, cursor: 'pointer' }}
                                              title="Resolve Follow-up Outcome"
                                            >
                                              Outcome ➔
                                            </button>
                                          )}

                                          {isInterested && (
                                            <button
                                              type="button"
                                              onClick={() => {
                                                setSelectedLeadForBookApt(lead);
                                                const foundService = (data.services || []).find(s => s.name === lead.interestedService);
                                                setBookLeadAptForm({
                                                  serviceId: foundService ? foundService.id : 'srv_01',
                                                  serviceName: lead.interestedService || 'Signature Precision Haircut & Styling',
                                                  date: lead.preferredDate || new Date().toISOString().split('T')[0],
                                                  time: lead.preferredTime || '11:00 AM',
                                                  staffId: lead.assignedToId || 'stf_01',
                                                  staffName: lead.assignedTo || 'Maya Sharma',
                                                  duration: foundService ? foundService.duration : 45,
                                                  amount: foundService ? foundService.price : (lead.estimatedValue || 2500),
                                                  notes: `Booked via CRM Lead Funnel.`
                                                });
                                              }}
                                              className="btn-gold-action"
                                              style={{ padding: '5px 10px', fontSize: '11px' }}
                                              title="Book Salon Appointment"
                                            >
                                              <CalendarPlus size={12} /> Book Apt
                                            </button>
                                          )}

                                          {isBooked && (
                                            <button
                                              type="button"
                                              onClick={() => markLeadServiceDone(lead.id)}
                                              style={{ background: '#06B6D4', color: '#FFFFFF', border: 'none', padding: '5px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}
                                              title="Customer Visited & Service Done"
                                            >
                                              <CheckCircle2 size={12} /> Service Done
                                            </button>
                                          )}

                                          {isServiceDone && (
                                            <button
                                              type="button"
                                              onClick={() => {
                                                const cust = convertLeadToCustomer(lead.id);
                                                if (cust) setSelectedCustomerForProfile(cust);
                                              }}
                                              style={{ background: '#0D9488', color: '#FFFFFF', border: 'none', padding: '5px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 800, cursor: 'pointer' }}
                                              title="Convert into Permanent VIP Customer Profile"
                                            >
                                              <Award size={12} /> Convert VIP
                                            </button>
                                          )}

                                          {isConverted && (
                                            <button
                                              type="button"
                                              onClick={() => {
                                                const foundCust = (data.customers || []).find(c => c.phone === lead.phone || c.id === lead.convertedCustomerId);
                                                setSelectedCustomerForProfile(foundCust || {
                                                  id: lead.convertedCustomerId || lead.id,
                                                  name: lead.name,
                                                  phone: lead.phone,
                                                  email: lead.email,
                                                  gender: lead.gender || 'Female',
                                                  tier: 'Diamond VIP',
                                                  loyaltyPoints: 350,
                                                  totalSpend: lead.estimatedValue || 3500,
                                                  preferences: { preferredStylist: lead.assignedTo || 'Maya Sharma', preferredService: lead.interestedService }
                                                });
                                              }}
                                              style={{ background: 'rgba(13, 148, 136, 0.1)', border: '1px solid #0D9488', color: '#0D9488', padding: '4px 8px', borderRadius: '6px', fontSize: '10.5px', fontWeight: 700, cursor: 'pointer' }}
                                              title="View VIP Customer Profile"
                                            >
                                              <User size={12} /> Profile
                                            </button>
                                          )}

                                          {isLost && (
                                            <button
                                              type="button"
                                              onClick={() => updateLeadStatus(lead.id, 'New', 'lead_generated')}
                                              style={{ background: '#F1F5F9', border: '1px solid #CBD5E1', color: '#475569', padding: '4px 8px', borderRadius: '5px', fontSize: '10px', fontWeight: 600, cursor: 'pointer' }}
                                              title="Re-open Lead"
                                            >
                                              Re-open
                                            </button>
                                          )}

                                          {/* Delete action */}
                                          <button
                                            type="button"
                                            onClick={() => {
                                              if (window.confirm(`Delete lead "${lead.name}"?`)) {
                                                deleteLead(lead.id);
                                              }
                                            }}
                                            style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '4px' }}
                                            title="Delete Lead"
                                          >
                                            <Trash2 size={13} />
                                          </button>
                                        </div>
                                      </td>
                                    </tr>
                                  );
                                });
                              })()}
                            </tbody>
                          </table>
                        </div>
                      )}

                      {/* ========================================================================= */}
                      {/* VIEW MODE B: 📊 ALL LEADS - PIPELINE FUNNEL (KANBAN BOARD) */}
                      {/* ========================================================================= */}
                      {leadViewMode === 'kanban' && (
                        <div className="kanban-board-grid">
                          {(() => {
                            const allLeads = data.leads || [];

                            const columns = [
                              { key: 'new', title: '1. New Lead', color: '#D97706', bg: 'rgba(217, 119, 6, 0.08)', icon: Sparkles, match: (l) => l.status === 'New' || l.stage === 'lead_generated' },
                              { key: 'contacted', title: '2. Contacted', color: '#0284C7', bg: 'rgba(2, 132, 199, 0.08)', icon: PhoneCall, match: (l) => l.status === 'Contacted' || l.status === 'Assigned' || l.stage === 'assign_employee' || l.stage === 'contact_customer' },
                              { key: 'follow_up', title: '3. Follow-up', color: '#EAB308', bg: 'rgba(234, 179, 8, 0.1)', icon: RefreshCw, match: (l) => (l.status || '').toLowerCase().includes('follow') || l.stage === 'follow_up' },
                              { key: 'interested', title: '4. Interested', color: '#10B981', bg: 'rgba(16, 185, 129, 0.08)', icon: ThumbsUp, match: (l) => l.status === 'Interested' || l.stage === 'interested' },
                              { key: 'booked', title: '5. Booked Apt', color: '#7C3AED', bg: 'rgba(124, 58, 237, 0.08)', icon: CalendarPlus, match: (l) => l.status === 'Appointment Booked' || l.status === 'Confirmed' || l.stage === 'booking' },
                              { key: 'service_done', title: '6. Service Done', color: '#06B6D4', bg: 'rgba(6, 182, 212, 0.08)', icon: Scissors, match: (l) => l.status === 'Service Done' || l.stage === 'service_done' },
                              { key: 'converted', title: '7. Converted VIP', color: '#0D9488', bg: 'rgba(13, 148, 136, 0.08)', icon: Award, match: (l) => l.status === 'Converted' || l.stage === 'converted' },
                              { key: 'lost', title: 'Lost / Declined', color: '#EF4444', bg: 'rgba(239, 68, 68, 0.08)', icon: ThumbsDown, match: (l) => l.status === 'Not Interested' || l.status === 'Lost' || l.stage === 'not_interested' }
                            ];

                            return columns.map(col => {
                              const colLeads = allLeads.filter(l => col.match(l));
                              const IconCmp = col.icon;

                              return (
                                <div key={col.key} className="kanban-column-box">
                                  <div className="kanban-col-header" style={{ borderTop: `3px solid ${col.color}` }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                      <div style={{ width: '24px', height: '24px', borderRadius: '6px', background: col.bg, color: col.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <IconCmp size={14} />
                                      </div>
                                      <strong style={{ fontSize: '12px', color: '#0F172A' }}>{col.title}</strong>
                                    </div>
                                    <span style={{ padding: '2px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: 800, background: col.bg, color: col.color }}>
                                      {colLeads.length}
                                    </span>
                                  </div>

                                  <div className="kanban-col-cards-list">
                                    {colLeads.length === 0 ? (
                                      <div style={{ padding: '30px 10px', textAlign: 'center', color: '#94A3B8', fontSize: '11.5px', fontStyle: 'italic' }}>
                                        No leads in this stage
                                      </div>
                                    ) : (
                                      colLeads.map(lead => {
                                        const cleanPhone = (lead.phone || '').replace(/[^0-9]/g, '').slice(-10);

                                        return (
                                          <div key={lead.id} className="lead-crm-card">
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '6px' }}>
                                              <span style={{
                                                padding: '2px 7px',
                                                borderRadius: '5px',
                                                fontSize: '10px',
                                                fontWeight: 700,
                                                background: col.bg,
                                                color: col.color
                                              }}>
                                                {lead.source || 'Website'}
                                              </span>
                                              <span style={{ fontSize: '10px', color: '#94A3B8', fontFamily: 'monospace' }}>
                                                #{lead.id}
                                              </span>
                                            </div>

                                            <div>
                                              <h4 style={{ margin: 0, fontSize: '13.5px', fontWeight: 800, color: '#0F172A' }}>
                                                {lead.name}
                                              </h4>
                                              <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>
                                                {lead.phone}
                                              </div>
                                            </div>

                                            <div style={{ background: '#F8FAFC', padding: '6px 8px', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
                                              <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#0F172A' }}>
                                                {lead.interestedService || 'Hair Styling'}
                                              </div>
                                              <div style={{ fontSize: '11px', fontWeight: 800, color: '#0D9488', marginTop: '2px' }}>
                                                ₹{Number(lead.estimatedValue || 2500).toLocaleString('en-IN')}
                                              </div>
                                            </div>

                                            {/* Stylist Assigned */}
                                            <div style={{ fontSize: '11px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                              <span style={{ color: '#64748B' }}>Stylist:</span>
                                              {lead.assignedTo && lead.assignedTo !== 'Unassigned' ? (
                                                <span style={{ fontWeight: 700, color: '#7C3AED' }}>{lead.assignedTo}</span>
                                              ) : (
                                                <button
                                                  type="button"
                                                  onClick={() => setSelectedLeadForAssign(lead)}
                                                  style={{ background: 'none', border: 'none', color: '#7C3AED', textDecoration: 'underline', fontSize: '10.5px', fontWeight: 700, cursor: 'pointer', padding: 0 }}
                                                >
                                                  + Assign
                                                </button>
                                              )}
                                            </div>

                                            {/* Quick Actions Footer */}
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '6px', borderTop: '1px solid #F1F5F9' }}>
                                              <div style={{ display: 'flex', gap: '4px' }}>
                                                <a
                                                  href={`https://wa.me/91${cleanPhone}?text=${encodeURIComponent(`Hi ${lead.name}, Greetings from Looks Salon!`)}`}
                                                  target="_blank"
                                                  rel="noreferrer"
                                                  className="btn-action-icon whatsapp"
                                                  style={{ width: '26px', height: '26px' }}
                                                >
                                                  <MessageSquare size={12} />
                                                </a>
                                                <a
                                                  href={`tel:${lead.phone}`}
                                                  className="btn-action-icon call"
                                                  style={{ width: '26px', height: '26px' }}
                                                >
                                                  <Phone size={12} />
                                                </a>
                                              </div>

                                              {/* Context progression */}
                                              {col.key === 'new' && (
                                                <button
                                                  type="button"
                                                  onClick={() => setSelectedLeadForAssign(lead)}
                                                  style={{ background: '#7C3AED', color: '#FFFFFF', border: 'none', padding: '3px 8px', borderRadius: '4px', fontSize: '10.5px', fontWeight: 700, cursor: 'pointer' }}
                                                >
                                                  Assign ➔
                                                </button>
                                              )}
                                              {col.key === 'contacted' && (
                                                <button
                                                  type="button"
                                                  onClick={() => {
                                                    setSelectedLeadForFollowUp(lead);
                                                    setFollowUpEntryForm({ actionType: 'completed', type: 'Phone Call', notes: '', nextFollowUpDate: new Date().toISOString().split('T')[0], nextFollowUpTime: '02:00 PM', lostReason: '' });
                                                  }}
                                                  style={{ background: '#0284C7', color: '#FFFFFF', border: 'none', padding: '3px 8px', borderRadius: '4px', fontSize: '10.5px', fontWeight: 700, cursor: 'pointer' }}
                                                >
                                                  Follow-up ➔
                                                </button>
                                              )}
                                              {col.key === 'follow_up' && (
                                                <button
                                                  type="button"
                                                  onClick={() => {
                                                    setSelectedLeadForFollowUp(lead);
                                                    setFollowUpEntryForm({ actionType: 'completed', type: 'Phone Call', notes: '', nextFollowUpDate: new Date().toISOString().split('T')[0], nextFollowUpTime: '02:00 PM', lostReason: '' });
                                                  }}
                                                  style={{ background: '#EAB308', color: '#FFFFFF', border: 'none', padding: '3px 8px', borderRadius: '4px', fontSize: '10.5px', fontWeight: 700, cursor: 'pointer' }}
                                                >
                                                  Decision ➔
                                                </button>
                                              )}
                                              {col.key === 'interested' && (
                                                <button
                                                  type="button"
                                                  onClick={() => {
                                                    setSelectedLeadForBookApt(lead);
                                                    setBookLeadAptForm({
                                                      serviceId: 'srv_01',
                                                      serviceName: lead.interestedService || 'Signature Precision Haircut & Styling',
                                                      date: lead.preferredDate || new Date().toISOString().split('T')[0],
                                                      time: lead.preferredTime || '11:00 AM',
                                                      staffId: lead.assignedToId || 'stf_01',
                                                      staffName: lead.assignedTo || 'Maya Sharma',
                                                      duration: 45,
                                                      amount: lead.estimatedValue || 2500,
                                                      notes: ''
                                                    });
                                                  }}
                                                  className="btn-gold-action"
                                                  style={{ padding: '3px 8px', fontSize: '10.5px' }}
                                                >
                                                  Book Apt ➔
                                                </button>
                                              )}
                                              {col.key === 'booked' && (
                                                <button
                                                  type="button"
                                                  onClick={() => markLeadServiceDone(lead.id)}
                                                  style={{ background: '#06B6D4', color: '#FFFFFF', border: 'none', padding: '3px 8px', borderRadius: '4px', fontSize: '10.5px', fontWeight: 700, cursor: 'pointer' }}
                                                >
                                                  Done ➔
                                                </button>
                                              )}
                                              {col.key === 'service_done' && (
                                                <button
                                                  type="button"
                                                  onClick={() => {
                                                    const cust = convertLeadToCustomer(lead.id);
                                                    if (cust) setSelectedCustomerForProfile(cust);
                                                  }}
                                                  style={{ background: '#0D9488', color: '#FFFFFF', border: 'none', padding: '3px 8px', borderRadius: '4px', fontSize: '10.5px', fontWeight: 700, cursor: 'pointer' }}
                                                >
                                                  VIP ➔
                                                </button>
                                              )}
                                              {col.key === 'converted' && (
                                                <button
                                                  type="button"
                                                  onClick={() => {
                                                    const foundCust = (data.customers || []).find(c => c.phone === lead.phone || c.id === lead.convertedCustomerId);
                                                    setSelectedCustomerForProfile(foundCust || lead);
                                                  }}
                                                  style={{ background: 'none', border: '1px solid #0D9488', color: '#0D9488', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 700, cursor: 'pointer' }}
                                                >
                                                  Profile
                                                </button>
                                              )}
                                            </div>
                                          </div>
                                        );
                                      })
                                    )}
                                  </div>
                                </div>
                              );
                            });
                          })()}
                        </div>
                      )}
                </div>
              )}

              {/* ========================================================================= */}
              {/* VIEW 6: 📅 APPOINTMENTS MASTER LIST */}
              {/* ========================================================================= */}
              {activeModule === 'appointments' && (
                <div className="looks-view-wrapper appointments-view">
                  <div className="looks-section-header">
                    <div>
                      <h2 className="section-main-title">Appointments Registry</h2>
                      <p className="section-lead-text">Click any appointment to open the complete details, billing & incentive breakdown panel.</p>
                    </div>
                    <div className="search-pill-box">
                      <Search size={15} />
                      <input
                        type="text"
                        placeholder="Search appointments..."
                        value={aptSearch}
                        onChange={(e) => setAptSearch(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Filter Strip */}
                  <div className="looks-category-filter-strip">
                    {['all', 'pending', 'confirmed', 'in-service', 'completed'].map(f => (
                      <button
                        key={f}
                        className={`category-tab-btn ${aptFilter === f ? 'active' : ''}`}
                        onClick={() => setAptFilter(f)}
                      >
                        {f === 'all' ? 'All Appointments' : f.charAt(0).toUpperCase() + f.slice(1)}
                      </button>
                    ))}
                  </div>

                  {/* Table */}
                  <div className="looks-table-card">
                    <table className="looks-master-table">
                      <thead>
                        <tr>
                          <th>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#475569', fontWeight: 800 }}>
                              <Hash size={13} strokeWidth={2.5} /> Ref #
                            </span>
                          </th>
                          <th>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#7C3AED', fontWeight: 800 }}>
                              <User size={13} strokeWidth={2.5} /> Guest Name
                            </span>
                          </th>
                          <th>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#0D9488', fontWeight: 800 }}>
                              <Scissors size={13} strokeWidth={2.5} /> Service & Duration
                            </span>
                          </th>
                          <th>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#4F46E5', fontWeight: 800 }}>
                              <UserCheck size={13} strokeWidth={2.5} /> Stylist
                            </span>
                          </th>
                          <th>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#D97706', fontWeight: 800 }}>
                              <CalendarDays size={13} strokeWidth={2.5} /> Date & Time
                            </span>
                          </th>
                          <th>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#16A34A', fontWeight: 800 }}>
                              <CheckCircle2 size={13} strokeWidth={2.5} /> Status
                            </span>
                          </th>
                          <th>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#16A34A', fontWeight: 800 }}>
                              <IndianRupee size={13} strokeWidth={2.5} /> Bill Amount
                            </span>
                          </th>
                          <th style={{ textAlign: 'center' }}>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#E11D48', fontWeight: 800 }}>
                              <Eye size={13} strokeWidth={2.5} /> Action
                            </span>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {(() => {
                          const filtered = allAppointments
                            .filter(a => aptFilter === 'all' || (a.status && a.status.toLowerCase().replace(' ', '-') === aptFilter.toLowerCase()))
                            .filter(a => !aptSearch || a.customerName.toLowerCase().includes(aptSearch.toLowerCase()) || a.serviceName.toLowerCase().includes(aptSearch.toLowerCase()) || a.staffName?.toLowerCase().includes(aptSearch.toLowerCase()));
                          if (filtered.length === 0) {
                            return (
                              <tr>
                                <td colSpan={8} className="empty-table-cell">
                                  <div className="looks-empty-state">
                                    <CalendarDays size={32} />
                                    <h4>No appointments scheduled in the registry</h4>
                                    <p>Bookings made online or registered through the salon portal will appear here in real time.</p>
                                  </div>
                                </td>
                              </tr>
                            );
                          }
                          return filtered.map(a => (
                            <tr key={a.id} style={{ cursor: 'pointer' }} onClick={() => setSelectedAppointmentDetails(a)}>
                              <td><strong>#{a.id}</strong></td>
                              <td>
                                <strong>{a.customerName}</strong><br />
                                <span className="text-sub-muted">{a.customerPhone}</span>
                              </td>
                              <td>
                                <strong>{a.serviceName}</strong><br />
                                <span className="text-sub-muted">{a.duration || 45} mins</span>
                              </td>
                              <td><strong>{a.staffName}</strong></td>
                              <td>{a.date} <span style={{ color: 'var(--color-primary-rose)' }}>{a.time}</span></td>
                              <td>
                                <span className={`status-pill status-${(a.status || 'confirmed').toLowerCase().replace(' ', '-')}`}>
                                  {a.status}
                                </span>
                              </td>
                              <td><strong>₹{(a.finalAmount || a.amount || 0).toLocaleString()}</strong></td>
                              <td onClick={(e) => e.stopPropagation()}>
                                <button
                                  className="btn-gold-action"
                                  style={{ padding: '4px 10px', fontSize: '11px' }}
                                  onClick={() => setSelectedAppointmentDetails(a)}
                                >
                                  <Eye size={13} /> View Details
                                </button>
                              </td>
                            </tr>
                          ));
                        })()}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ========================================================================= */}
              {/* VIEW 7: 👥 CUSTOMERS CRM */}
              {/* ========================================================================= */}
              {activeModule === 'customers' && (
                <div className="looks-view-wrapper customers-view">
                  <div className="looks-section-header">
                    <div>
                      <h2 className="section-main-title">Customer CRM & Loyalty</h2>
                      <p className="section-lead-text">Client visit histories, loyalty tiers, lifetime spend, and profile records.</p>
                    </div>
                    <div className="header-actions-group">
                      <div className="search-pill-box">
                        <Search size={15} />
                        <input
                          type="text"
                          placeholder="Search customers..."
                          value={customerSearch}
                          onChange={(e) => setCustomerSearch(e.target.value)}
                        />
                      </div>
                      <button className="btn-gold-action" onClick={() => setShowAddCustomerModal(true)}>
                        <UserPlus size={16} /> Add Customer
                      </button>
                    </div>
                  </div>

                  {/* Customer Tier Filter */}
                  <div className="looks-category-filter-strip">
                    {['all', 'silver', 'gold', 'platinum', 'diamond'].map(tier => (
                      <button
                        key={tier}
                        className={`category-tab-btn ${customerTierFilter === tier ? 'active' : ''}`}
                        onClick={() => setCustomerTierFilter(tier)}
                      >
                        {tier === 'all' ? 'All Members' : `${tier.charAt(0).toUpperCase() + tier.slice(1)} Tier`}
                      </button>
                    ))}
                  </div>

                  <div className="looks-table-card">
                    <table className="looks-master-table">
                      <thead>
                        <tr>
                          <th>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#7C3AED', fontWeight: 800 }}>
                              <User size={13} strokeWidth={2.5} /> Customer Profile
                            </span>
                          </th>
                          <th>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#16A34A', fontWeight: 800 }}>
                              <Phone size={13} strokeWidth={2.5} /> Contact
                            </span>
                          </th>
                          <th>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#D97706', fontWeight: 800 }}>
                              <Award size={13} strokeWidth={2.5} /> Membership Tier
                            </span>
                          </th>
                          <th>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#DB2777', fontWeight: 800 }}>
                              <Sparkles size={13} strokeWidth={2.5} /> Loyalty Points
                            </span>
                          </th>
                          <th>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#0284C7', fontWeight: 800 }}>
                              <CalendarDays size={13} strokeWidth={2.5} /> Total Visits
                            </span>
                          </th>
                          <th>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#16A34A', fontWeight: 800 }}>
                              <IndianRupee size={13} strokeWidth={2.5} /> Lifetime Spend
                            </span>
                          </th>
                          <th>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#475569', fontWeight: 800 }}>
                              <Clock size={13} strokeWidth={2.5} /> Last Visit
                            </span>
                          </th>
                          <th style={{ textAlign: 'center' }}>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#E11D48', fontWeight: 800 }}>
                              <Sparkles size={13} strokeWidth={2.5} /> Actions
                            </span>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {(() => {
                          const filtered = (data.customers || [])
                            .filter(c => customerTierFilter === 'all' || (c.tier && c.tier.toLowerCase().includes(customerTierFilter.toLowerCase())))
                            .filter(c => !customerSearch || c.name.toLowerCase().includes(customerSearch.toLowerCase()) || c.phone.includes(customerSearch));
                          if (filtered.length === 0) {
                            return (
                              <tr>
                                <td colSpan={8} className="empty-table-cell">
                                  <div className="looks-empty-state">
                                    <Users size={32} />
                                    <h4>No customer profiles found</h4>
                                    <p>Register walk-in clients or let booking customers auto-generate loyalty CRM profiles.</p>
                                  </div>
                                </td>
                              </tr>
                            );
                          }
                          return filtered.map(c => (
                            <tr key={c.id}>
                              <td>
                                <div className="emp-mini-profile">
                                  <img src={c.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'} alt={c.name} className="emp-thumb circle" />
                                  <div>
                                    <strong>{c.name}</strong><br />
                                    <span className="text-sub-muted">{c.email}</span>
                                  </div>
                                </div>
                              </td>
                              <td><strong>{c.phone}</strong></td>
                              <td><span className="incentive-pill">{c.tier}</span></td>
                              <td><strong style={{ color: 'var(--color-primary-rose)' }}>{c.loyaltyPoints || 0} pts</strong></td>
                              <td>{c.totalVisits || 1} visits</td>
                              <td><strong>₹{(c.totalSpend || 0).toLocaleString()}</strong></td>
                              <td>{c.lastVisit || todayStr}</td>
                              <td>
                                <button className="btn-table-action-danger" onClick={() => deleteCustomer(c.id)} title="Delete profile">
                                  <Trash2 size={13} />
                                </button>
                              </td>
                            </tr>
                          ));
                        })()}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ========================================================================= */}
              {/* VIEW 8: 🎁 PACKAGES & BUNDLES (LUXURY SUITE) */}
              {/* ========================================================================= */}
              {activeModule === 'packages' && (() => {
                const rawList = data.packagesList || [];
                const categories = [
                  { key: 'all', label: 'All Packages', icon: Sparkles },
                  { key: 'bridal', label: 'Bridal & Wedding', icon: Award },
                  { key: 'hair', label: 'Hair & Styling', icon: Scissors },
                  { key: 'grooming', label: "Men's Grooming", icon: User },
                  { key: 'skin & spa', label: 'Skin & Glow', icon: Star },
                  { key: 'combos', label: 'Combos & Pamper', icon: Gift }
                ];

                const filtered = rawList.filter(pkg => {
                  const matchCat = packageCategoryFilter === 'all' ||
                    (pkg.category && pkg.category.toLowerCase().includes(packageCategoryFilter.toLowerCase())) ||
                    (packageCategoryFilter === 'combos' && (pkg.category || '').toLowerCase().includes('combo')) ||
                    (packageCategoryFilter === 'skin & spa' && ((pkg.category || '').toLowerCase().includes('skin') || (pkg.category || '').toLowerCase().includes('spa')));

                  const q = packageSearch.toLowerCase().trim();
                  const matchSearch = !q ||
                    (pkg.name && pkg.name.toLowerCase().includes(q)) ||
                    (pkg.badge && pkg.badge.toLowerCase().includes(q)) ||
                    (pkg.includes && pkg.includes.some(inc => inc && inc.toLowerCase().includes(q)));

                  return matchCat && matchSearch;
                });

                // Stats calculations
                const totalPackages = rawList.length;
                const avgPrice = totalPackages > 0 ? Math.round(rawList.reduce((acc, p) => acc + (parseFloat(p.price) || 0), 0) / totalPackages) : 0;
                const savingsList = rawList
                  .filter(p => p.originalPrice && p.originalPrice > p.price)
                  .map(p => Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100));
                const maxSavings = savingsList.length > 0 ? Math.max(...savingsList) : 35;
                const bridalCount = rawList.filter(p => (p.category || '').toLowerCase().includes('bridal') || (p.name || '').toLowerCase().includes('bridal')).length;

                return (
                  <div className="looks-view-wrapper packages-view">
                    {/* Header Row */}
                    <div className="looks-section-header">
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <h2 className="section-main-title">Salon Packages &amp; Bundles</h2>
                          <span style={{
                            padding: '3px 10px',
                            borderRadius: '20px',
                            fontSize: '11px',
                            fontWeight: 800,
                            background: 'rgba(13, 148, 136, 0.12)',
                            color: '#0D9488',
                            border: '1px solid rgba(13, 148, 136, 0.25)'
                          }}>
                            {totalPackages} Bundles Active
                          </span>
                        </div>
                        <p className="section-lead-text">Curate luxury combos, bridal grand suites, and high-margin pamper packages with instant billing.</p>
                      </div>
                      <div className="header-actions-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {rawList.length <= 2 && (
                          <button
                            className="btn-secondary-action"
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '9px 15px', borderRadius: '10px', fontSize: '13px', fontWeight: 600, border: '1px solid #CBD5E1', background: '#FFFFFF', color: '#0F172A', cursor: 'pointer' }}
                            onClick={() => loadStarterPackages && loadStarterPackages()}
                            title="Load curated high-performing salon bundles"
                          >
                            <Sparkles size={15} color="#0D9488" /> Sample Packages
                          </button>
                        )}
                        <button className="btn-gold-action" onClick={() => setShowAddPackageModal(true)}>
                          <Plus size={16} /> Add Package
                        </button>
                      </div>
                    </div>

                    {/* Stats Ribbon */}
                    <div className="packages-stats-ribbon">
                      <div className="pkg-stat-card">
                        <div className="pkg-stat-icon" style={{ background: 'rgba(124, 58, 237, 0.12)', color: '#7C3AED' }}>
                          <Gift size={22} strokeWidth={2.3} />
                        </div>
                        <div className="pkg-stat-info">
                          <h4>{totalPackages}</h4>
                          <p>Total Bundles</p>
                        </div>
                      </div>

                      <div className="pkg-stat-card">
                        <div className="pkg-stat-icon" style={{ background: 'rgba(16, 185, 129, 0.12)', color: '#059669' }}>
                          <Percent size={22} strokeWidth={2.3} />
                        </div>
                        <div className="pkg-stat-info">
                          <h4>Up to {maxSavings}%</h4>
                          <p>Max Client Savings</p>
                        </div>
                      </div>

                      <div className="pkg-stat-card">
                        <div className="pkg-stat-icon" style={{ background: 'rgba(217, 119, 6, 0.12)', color: '#D97706' }}>
                          <IndianRupee size={22} strokeWidth={2.3} />
                        </div>
                        <div className="pkg-stat-info">
                          <h4>₹{avgPrice.toLocaleString()}</h4>
                          <p>Avg Bundle Value</p>
                        </div>
                      </div>

                      <div className="pkg-stat-card">
                        <div className="pkg-stat-icon" style={{ background: 'rgba(236, 72, 153, 0.12)', color: '#DB2777' }}>
                          <Award size={22} strokeWidth={2.3} />
                        </div>
                        <div className="pkg-stat-info">
                          <h4>{bridalCount} Bridal Suites</h4>
                          <p>Grand Wedding Specials</p>
                        </div>
                      </div>
                    </div>

                    {/* Search & Filter Strip */}
                    <div className="packages-toolbar-strip">
                      <div className="packages-filter-tabs">
                        {categories.map(cat => {
                          const IconComp = cat.icon;
                          const count = cat.key === 'all'
                            ? rawList.length
                            : rawList.filter(p => (p.category || '').toLowerCase().includes(cat.key)).length;
                          return (
                            <button
                              key={cat.key}
                              className={`pkg-tab-btn ${packageCategoryFilter === cat.key ? 'active' : ''}`}
                              onClick={() => setPackageCategoryFilter(cat.key)}
                            >
                              <IconComp size={14} />
                              <span>{cat.label}</span>
                              <span style={{
                                fontSize: '10px',
                                opacity: 0.85,
                                background: packageCategoryFilter === cat.key ? 'rgba(255, 255, 255, 0.25)' : '#E2E8F0',
                                color: packageCategoryFilter === cat.key ? '#FFFFFF' : '#475569',
                                padding: '1px 6px',
                                borderRadius: '10px'
                              }}>
                                {count}
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      <div className="search-pill-box" style={{ minWidth: 260 }}>
                        <Search size={15} />
                        <input
                          type="text"
                          placeholder="Search package or service..."
                          value={packageSearch}
                          onChange={(e) => setPackageSearch(e.target.value)}
                        />
                        {packageSearch && (
                          <button onClick={() => setPackageSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', display: 'flex', alignItems: 'center' }}>
                            <X size={14} />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Packages Card Grid */}
                    {filtered.length === 0 ? (
                      <div className="looks-empty-state" style={{ margin: '30px auto', maxWidth: 480, textAlign: 'center' }}>
                        <Gift size={36} color="#0D9488" />
                        <h4>No packages match your search</h4>
                        <p>Try searching for a different keyword or reset category filter.</p>
                        <button
                          className="btn-gold-action"
                          style={{ marginTop: '12px' }}
                          onClick={() => { setPackageSearch(''); setPackageCategoryFilter('all'); }}
                        >
                          Clear Filters
                        </button>
                      </div>
                    ) : (
                      <div className="packages-card-grid">
                        {filtered.map(pkg => {
                          const validIncludes = (pkg.includes || []).filter(inc => inc && inc.trim() !== '');
                          const savingsPercent = pkg.originalPrice && pkg.originalPrice > pkg.price
                            ? Math.round(((pkg.originalPrice - pkg.price) / pkg.originalPrice) * 100)
                            : null;
                          const savingsAmount = pkg.originalPrice && pkg.originalPrice > pkg.price
                            ? (pkg.originalPrice - pkg.price)
                            : 0;

                          // Category theme styling
                          const catLower = (pkg.category || '').toLowerCase();
                          let accentGradient = 'linear-gradient(90deg, #0D9488, #49B9CA, #0284C7)';
                          let catBg = 'rgba(13, 148, 136, 0.12)';
                          let catColor = '#0D9488';
                          if (catLower.includes('bridal')) {
                            accentGradient = 'linear-gradient(90deg, #BE185D, #EC4899, #F59E0B)';
                            catBg = 'rgba(190, 24, 93, 0.12)';
                            catColor = '#BE185D';
                          } else if (catLower.includes('grooming')) {
                            accentGradient = 'linear-gradient(90deg, #D97706, #F59E0B, #B45309)';
                            catBg = 'rgba(217, 119, 6, 0.12)';
                            catColor = '#D97706';
                          } else if (catLower.includes('skin') || catLower.includes('spa')) {
                            accentGradient = 'linear-gradient(90deg, #059669, #10B981, #14B8A6)';
                            catBg = 'rgba(5, 150, 105, 0.12)';
                            catColor = '#059669';
                          }

                          return (
                            <div className="package-admin-card" key={pkg.id}>
                              <div className="pkg-card-top-accent" style={{ background: accentGradient }}></div>

                              <div className="pkg-card-inner">
                                <div className="pkg-header-strip">
                                  <span className="pkg-category-pill" style={{ background: catBg, color: catColor }}>
                                    <Sparkles size={11} /> {pkg.category || 'Combo'}
                                  </span>

                                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    {savingsPercent && (
                                      <span className="pkg-savings-chip">
                                        Save {savingsPercent}%
                                      </span>
                                    )}
                                    <span className="pkg-badge-pill" style={{
                                      background: pkg.badge === 'BESTSELLER' ? 'rgba(217, 119, 6, 0.15)' : 'rgba(13, 148, 136, 0.15)',
                                      color: pkg.badge === 'BESTSELLER' ? '#D97706' : '#0D9488',
                                      border: pkg.badge === 'BESTSELLER' ? '1px solid rgba(217, 119, 6, 0.3)' : '1px solid rgba(13, 148, 136, 0.3)'
                                    }}>
                                      {pkg.badge || 'EXCLUSIVE'}
                                    </span>
                                  </div>
                                </div>

                                <h3 className="pkg-title">{pkg.name}</h3>

                                <div className="pkg-price-banner">
                                  <div>
                                    <div className="pkg-main-price">
                                      ₹{Number(pkg.price).toLocaleString()}
                                      {pkg.originalPrice && pkg.originalPrice > pkg.price && (
                                        <span className="pkg-old-price">₹{Number(pkg.originalPrice).toLocaleString()}</span>
                                      )}
                                    </div>
                                    {savingsAmount > 0 && (
                                      <div style={{ fontSize: '11px', color: '#059669', fontWeight: 600, marginTop: '2px' }}>
                                        Client saves ₹{savingsAmount.toLocaleString()}
                                      </div>
                                    )}
                                  </div>
                                  <div className="pkg-duration-pill">
                                    <Clock size={12} /> {pkg.duration || '120 mins'}
                                  </div>
                                </div>

                                <div className="pkg-services-section">
                                  <div className="pkg-services-heading">
                                    <span>Included Services</span>
                                    <span className="pkg-services-count">{validIncludes.length} services</span>
                                  </div>
                                  <div>
                                    {validIncludes.map((inc, i) => (
                                      <div className="pkg-service-item" key={i}>
                                        <div className="pkg-check-icon">✓</div>
                                        <span>{inc}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                <div className="pkg-card-actions">
                                  <button
                                    className="btn-pkg-pos"
                                    onClick={() => {
                                      addToPosCart('service', {
                                        id: 'pkg_' + pkg.id,
                                        name: `${pkg.name} [Package]`,
                                        price: pkg.price,
                                        duration: parseInt(pkg.duration) || 90
                                      });
                                      setActiveModule('billing');
                                      showToast(`Added "${pkg.name}" to POS Bill Cart!`);
                                    }}
                                    title="Quick Bill in POS"
                                  >
                                    <ShoppingCart size={14} /> Bill in POS
                                  </button>

                                  <button
                                    className="btn-pkg-edit"
                                    onClick={() => {
                                      setEditingPkg({
                                        ...pkg,
                                        includesText: (pkg.includes || []).join(', ')
                                      });
                                      setShowEditPackageModal(true);
                                    }}
                                    title="Edit Package"
                                  >
                                    <Edit2 size={14} />
                                  </button>

                                  <button
                                    className="btn-pkg-delete"
                                    onClick={() => {
                                      if (window.confirm(`Delete package "${pkg.name}"?`)) {
                                        deletePackageItem(pkg.id);
                                      }
                                    }}
                                    title="Remove Package"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}

                        {/* Dashed Add New Package Card */}
                        <div
                          className="pkg-create-card-dashed"
                          onClick={() => setShowAddPackageModal(true)}
                        >
                          <div className="pkg-create-icon-wrap">
                            <Plus size={26} strokeWidth={2.5} />
                          </div>
                          <h4 style={{ margin: '0 0 6px', fontSize: '16px', fontWeight: 800, color: '#0F172A' }}>
                            Create New Package
                          </h4>
                          <p style={{ margin: 0, fontSize: '12px', color: '#64748B', maxWidth: 220 }}>
                            Bundle multiple salon services into an irresistible client combo offer.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* ========================================================================= */}
              {/* VIEW 9: 💳 BILLING & POS QUICK CHECKOUT */}
              {/* ========================================================================= */}
              {activeModule === 'billing' && (() => {
                const todayInvoices = (data.invoices || []).filter(inv => inv.date === todayStr);
                const todayPosRevenue = todayInvoices.reduce((sum, inv) => sum + (inv.totalAmount || 0), 0);
                const activeStylist = (data.staff || []).find(s => s.id === posStaffId) || (data.staff || [])[0];

                const query = (posSearch || '').toLowerCase().trim();

                const serviceCatalog = (data.services || []).map(s => ({
                  catalogType: 'service',
                  id: s.id,
                  name: s.name,
                  category: s.categoryId || 'Hair',
                  price: s.price,
                  duration: s.duration || 30,
                  raw: s
                }));

                const productCatalog = (data.inventory || []).map(p => ({
                  catalogType: 'product',
                  id: p.id,
                  name: p.name,
                  category: p.category || 'Retail',
                  price: p.sellingPrice || p.price,
                  stock: p.stock || 0,
                  minStock: p.minStockAlert || 5,
                  raw: p
                }));

                const packageCatalog = (data.packages || []).map(pkg => ({
                  catalogType: 'package',
                  id: 'pkg_' + pkg.id,
                  name: pkg.name,
                  category: pkg.category || 'Package',
                  price: pkg.price,
                  originalPrice: pkg.originalPrice,
                  duration: parseInt(pkg.duration) || 90,
                  badge: pkg.badge,
                  raw: pkg
                }));

                let displayedCatalog = [];
                if (posCategoryTab === 'all') {
                  displayedCatalog = [...serviceCatalog, ...productCatalog, ...packageCatalog];
                } else if (posCategoryTab === 'services') {
                  displayedCatalog = serviceCatalog;
                } else if (posCategoryTab === 'products') {
                  displayedCatalog = productCatalog;
                } else if (posCategoryTab === 'packages') {
                  displayedCatalog = packageCatalog;
                }

                if (posCategoryTab === 'services' && posServiceSubFilter !== 'all') {
                  displayedCatalog = displayedCatalog.filter(it => (it.category || '').toLowerCase().includes(posServiceSubFilter.toLowerCase()));
                }

                if (query) {
                  displayedCatalog = displayedCatalog.filter(it =>
                    it.name.toLowerCase().includes(query) ||
                    (it.category && it.category.toLowerCase().includes(query))
                  );
                }

                const totalCartItemsCount = posCart.reduce((sum, i) => sum + i.qty, 0);

                return (
                  <div className="looks-view-wrapper billing-pos-view">
                    {/* Top POS Header & Mode Switcher */}
                    <div className="pos-master-header">
                      <div className="pos-master-title-box">
                        <div className="pos-title-badge">
                          <Receipt size={16} />
                          <span>POINT OF SALE • EXPRESS CHECKOUT</span>
                        </div>
                        <h2 className="pos-title-text">Point of Sale & Billing Terminal</h2>
                        <p className="pos-title-sub">
                          Speedy walk-in billing with automated stock reduction, loyalty member discounts & instant GST invoice printing.
                        </p>
                      </div>

                      <div className="pos-header-tabs">
                        <button
                          type="button"
                          className={`pos-mode-btn ${posViewMode === 'register' ? 'active' : ''}`}
                          onClick={() => setPosViewMode('register')}
                        >
                          <ShoppingCart size={15} />
                          <span>Live Register</span>
                          {posCart.length > 0 && <span className="pos-cart-count-badge">{totalCartItemsCount}</span>}
                        </button>
                        <button
                          type="button"
                          className={`pos-mode-btn ${posViewMode === 'history' ? 'active' : ''}`}
                          onClick={() => setPosViewMode('history')}
                        >
                          <FileText size={15} />
                          <span>Today's Receipts ({todayInvoices.length})</span>
                        </button>
                      </div>
                    </div>

                    {/* POS Stat KPIs Ribbon */}
                    <div className="pos-stat-ribbon">
                      <div className="pos-stat-card" onClick={() => setPosViewMode('history')} style={{ cursor: 'pointer' }} title="View Invoices">
                        <div className="pos-stat-icon-wrap" style={{ background: 'rgba(13, 148, 136, 0.12)', color: '#0D9488' }}>
                          <Receipt size={20} />
                        </div>
                        <div className="pos-stat-info">
                          <span className="pos-stat-label">Today's Invoices</span>
                          <span className="pos-stat-val">{todayInvoices.length} Bills</span>
                        </div>
                      </div>

                      <div className="pos-stat-card" onClick={() => setPosViewMode('history')} style={{ cursor: 'pointer' }} title="View Sales History">
                        <div className="pos-stat-icon-wrap" style={{ background: 'rgba(212, 175, 55, 0.14)', color: '#D4AF37' }}>
                          <IndianRupee size={20} />
                        </div>
                        <div className="pos-stat-info">
                          <span className="pos-stat-label">Today's POS Sales</span>
                          <span className="pos-stat-val">₹{todayPosRevenue.toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="pos-stat-card" onClick={() => setPosViewMode('register')} style={{ cursor: 'pointer' }} title="View Current Register">
                        <div className="pos-stat-icon-wrap" style={{ background: 'rgba(59, 130, 246, 0.12)', color: '#3B82F6' }}>
                          <ShoppingCart size={20} />
                        </div>
                        <div className="pos-stat-info">
                          <span className="pos-stat-label">Current Bill Items</span>
                          <span className="pos-stat-val">{totalCartItemsCount} Items</span>
                        </div>
                      </div>

                      <div className="pos-stat-card" onClick={() => setPosViewMode('register')} style={{ cursor: 'pointer' }} title="View Current Register">
                        <div className="pos-stat-icon-wrap" style={{ background: 'rgba(124, 58, 237, 0.12)', color: '#7C3AED' }}>
                          <UserCheck size={20} />
                        </div>
                        <div className="pos-stat-info">
                          <span className="pos-stat-label">Stylist on Duty</span>
                          <span className="pos-stat-val" style={{ fontSize: '13.5px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                            {activeStylist ? activeStylist.name.split(' ')[0] : 'Stylist'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* MAIN REGISTER VIEW */}
                    {posViewMode === 'register' ? (
                      <div className="pos-split-layout">
                        {/* LEFT COLUMN: Service & Product Catalog */}
                        <div className="pos-catalog-side">
                          {/* Search & Main Category Filters */}
                          <div className="pos-catalog-toolbar">
                            <div className="pos-search-wrap">
                              <Search size={16} className="pos-search-icon" />
                              <input
                                type="text"
                                className="pos-search-input"
                                placeholder="Search services, products, or packages..."
                                value={posSearch}
                                onChange={(e) => setPosSearch(e.target.value)}
                              />
                              {posSearch && (
                                <button type="button" className="pos-search-clear" onClick={() => setPosSearch('')}>
                                  <X size={14} />
                                </button>
                              )}
                            </div>

                            <div className="pos-category-tabs">
                              <button
                                type="button"
                                className={`pos-cat-tab ${posCategoryTab === 'all' ? 'active' : ''}`}
                                onClick={() => setPosCategoryTab('all')}
                              >
                                All Items ({serviceCatalog.length + productCatalog.length + packageCatalog.length})
                              </button>
                              <button
                                type="button"
                                className={`pos-cat-tab ${posCategoryTab === 'services' ? 'active' : ''}`}
                                onClick={() => { setPosCategoryTab('services'); setPosServiceSubFilter('all'); }}
                              >
                                ✂️ Services ({serviceCatalog.length})
                              </button>
                              <button
                                type="button"
                                className={`pos-cat-tab ${posCategoryTab === 'products' ? 'active' : ''}`}
                                onClick={() => setPosCategoryTab('products')}
                              >
                                🛍️ Retail Products ({productCatalog.length})
                              </button>
                              <button
                                type="button"
                                className={`pos-cat-tab ${posCategoryTab === 'packages' ? 'active' : ''}`}
                                onClick={() => setPosCategoryTab('packages')}
                              >
                                🎁 Packages ({packageCatalog.length})
                              </button>
                            </div>

                            {/* Sub category filter when in services */}
                            {posCategoryTab === 'services' && (
                              <div className="pos-subfilter-strip">
                                {['all', 'hair', 'facial', 'spa', 'manicure', 'bridal'].map(sub => (
                                  <button
                                    key={sub}
                                    type="button"
                                    className={`pos-subfilter-btn ${posServiceSubFilter === sub ? 'active' : ''}`}
                                    onClick={() => setPosServiceSubFilter(sub)}
                                  >
                                    {sub === 'all' ? 'All Services' : sub.charAt(0).toUpperCase() + sub.slice(1)}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Catalog Cards Grid */}
                          {displayedCatalog.length === 0 ? (
                            <div className="pos-empty-catalog">
                              <Search size={36} color="#94A3B8" />
                              <h4>No items match "{posSearch}"</h4>
                              <p>Try clearing your search query or selecting another catalog category.</p>
                              <button
                                type="button"
                                className="btn-secondary"
                                style={{ padding: '7px 16px', borderRadius: '20px', fontSize: '12px' }}
                                onClick={() => { setPosSearch(''); setPosCategoryTab('all'); }}
                              >
                                Reset Filters
                              </button>
                            </div>
                          ) : (
                            <div className="pos-card-grid">
                              {displayedCatalog.map((item) => {
                                const inCartQty = posCart.filter(c => c.id === item.id).reduce((s, c) => s + c.qty, 0);
                                const isProduct = item.catalogType === 'product';
                                const isPackage = item.catalogType === 'package';
                                const isOutOfStock = isProduct && item.stock <= 0;

                                return (
                                  <div
                                    key={item.id}
                                    className={`pos-item-card ${inCartQty > 0 ? 'in-cart' : ''} ${isOutOfStock ? 'out-of-stock' : ''}`}
                                    onClick={() => {
                                      if (isOutOfStock) return;
                                      if (isPackage) {
                                        addToPosCart('service', {
                                          id: item.id,
                                          name: `${item.name} [Package]`,
                                          price: item.price,
                                          duration: item.duration || 90
                                        });
                                      } else {
                                        addToPosCart(item.catalogType, item.raw);
                                      }
                                    }}
                                  >
                                    <div className="pos-card-header">
                                      <span className={`pos-type-pill ${item.catalogType}`}>
                                        {isPackage ? '🎁 Package' : isProduct ? '🛍️ Retail' : '✂️ Service'}
                                      </span>
                                      {item.duration ? (
                                        <span className="pos-meta-chip">
                                          <Clock size={11} /> {item.duration}m
                                        </span>
                                      ) : isProduct ? (
                                        <span className={`pos-meta-chip ${item.stock <= item.minStock ? 'low-stock' : ''}`}>
                                          Stock: {item.stock}
                                        </span>
                                      ) : null}
                                    </div>

                                    <h4 className="pos-card-title">{item.name}</h4>

                                    <div className="pos-card-bottom">
                                      <div className="pos-price-wrap">
                                        <span className="pos-card-price">₹{item.price.toLocaleString()}</span>
                                        {item.originalPrice && (
                                          <span className="pos-card-old-price">₹{item.originalPrice}</span>
                                        )}
                                      </div>

                                      <div className="pos-add-action">
                                        {isOutOfStock ? (
                                          <span className="pos-badge-out">Sold Out</span>
                                        ) : inCartQty > 0 ? (
                                          <span className="pos-badge-incart">
                                            <Check size={12} strokeWidth={3} /> {inCartQty} in Bill
                                          </span>
                                        ) : (
                                          <button type="button" className="pos-btn-add">
                                            <Plus size={14} strokeWidth={2.5} /> Add
                                          </button>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>

                        {/* RIGHT COLUMN: Interactive Billing Summary Terminal */}
                        {/* RIGHT COLUMN: POS Billing Terminal Form */}
                        <div className="pos-bill-side">
                          {/* 1. CUSTOMER DETAILS */}
                          <div className="pos-form-card">
                            <div className="pos-card-header">
                              <h4 className="pos-card-title-text">
                                <User size={15} /> Customer Details
                              </h4>
                            </div>
                            <div className="pos-card-body">
                              <div className="form-group-mini">
                                <label className="pos-field-label">
                                  Customer Name <span className="req-star">*</span>
                                </label>
                                <input
                                  type="text"
                                  className="looks-input"
                                  value={posCustName}
                                  onChange={(e) => setPosCustName(e.target.value)}
                                  required
                                />
                              </div>

                              <div className="pos-grid-2">
                                <div className="form-group-mini">
                                  <label className="pos-field-label">
                                    Mobile Number <span className="req-star">*</span>
                                  </label>
                                  <input
                                    type="tel"
                                    inputMode="numeric"
                                    maxLength={10}
                                    className="looks-input"
                                    value={posCustPhone}
                                    onChange={(e) => setPosCustPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                    required
                                  />
                                  {posCustPhone && posCustPhone.length < 10 && (
                                    <small className="pos-field-hint-err">
                                      10 digits required ({posCustPhone.length}/10)
                                    </small>
                                  )}
                                </div>

                                <div className="form-group-mini">
                                  <label className="pos-field-label">
                                    Email <span className="pos-opt-tag">(Optional)</span>
                                  </label>
                                  <input
                                    type="email"
                                    className="looks-input"
                                    value={posCustEmail}
                                    onChange={(e) => setPosCustEmail(e.target.value)}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* 2. BILL DETAILS */}
                          <div className="pos-form-card">
                            <div className="pos-card-header">
                              <h4 className="pos-card-title-text">
                                <FileText size={15} /> Bill Details
                              </h4>
                            </div>
                            <div className="pos-card-body">
                              <div className="pos-grid-2">
                                <div className="form-group-mini">
                                  <label className="pos-field-label">
                                    Invoice No. <span className="pos-auto-badge">Auto Generate</span>
                                  </label>
                                  <input
                                    type="text"
                                    className="looks-input pos-readonly-field"
                                    value={`INV-${new Date().getFullYear()}-${String(1001 + (data.invoices || []).length).padStart(4, '0')}`}
                                    readOnly
                                  />
                                </div>

                                <div className="form-group-mini">
                                  <label className="pos-field-label">
                                    Bill Date <span className="pos-auto-badge">Auto</span>
                                  </label>
                                  <input
                                    type="text"
                                    className="looks-input pos-readonly-field"
                                    value={new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                    readOnly
                                  />
                                </div>
                              </div>

                              <div className="form-group-mini">
                                <label className="pos-field-label">
                                  Stylist / Employee <span className="req-star">*</span>
                                </label>
                                <select
                                  className="looks-input"
                                  value={posStaffId}
                                  onChange={(e) => setPosStaffId(e.target.value)}
                                  required
                                >
                                  <option value=""></option>
                                  {(data.staff || []).map(s => (
                                    <option key={s.id} value={s.id}>
                                      {s.name} ({s.role || 'Staff'})
                                    </option>
                                  ))}
                                </select>
                              </div>

                              <div className="form-group-mini">
                                <label className="pos-field-label">
                                  Select Services / Products <span className="req-star">*</span>
                                </label>
                                <select
                                  className="looks-input"
                                  value=""
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    if (!val) return;
                                    const [itemType, itemId] = val.split(':');
                                    if (itemType === 'service') {
                                      const s = (data.services || []).find(x => String(x.id) === String(itemId));
                                      if (s) addToPosCart('service', s);
                                    } else if (itemType === 'product') {
                                      const p = (data.products || []).find(x => String(x.id) === String(itemId));
                                      if (p) addToPosCart('product', p);
                                    } else if (itemType === 'package') {
                                      const pkg = (data.packages || []).find(x => String(x.id) === String(itemId));
                                      if (pkg) addToPosCart('package', pkg);
                                    }
                                  }}
                                >
                                  <option value=""></option>
                                  {data.services && data.services.length > 0 && (
                                    <optgroup label="Services">
                                      {data.services.map(s => (
                                        <option key={`service:${s.id}`} value={`service:${s.id}`}>
                                          {s.name} — ₹{s.price}
                                        </option>
                                      ))}
                                    </optgroup>
                                  )}
                                  {data.products && data.products.length > 0 && (
                                    <optgroup label="Retail Products">
                                      {data.products.map(p => (
                                        <option key={`product:${p.id}`} value={`product:${p.id}`}>
                                          {p.name} — ₹{p.sellingPrice || p.price} {p.stock <= 0 ? '(Out of stock)' : `(${p.stock} in stock)`}
                                        </option>
                                      ))}
                                    </optgroup>
                                  )}
                                  {data.packages && data.packages.length > 0 && (
                                    <optgroup label="Packages">
                                      {data.packages.map(pkg => (
                                        <option key={`package:${pkg.id}`} value={`package:${pkg.id}`}>
                                          {pkg.name} — ₹{pkg.price}
                                        </option>
                                      ))}
                                    </optgroup>
                                  )}
                                </select>
                              </div>
                            </div>
                          </div>

                          {/* 3. SELECTED ITEMS */}
                          <div className="pos-form-card">
                            <div className="pos-card-header" style={{ justifyContent: 'space-between' }}>
                              <h4 className="pos-card-title-text">
                                <ShoppingCart size={15} /> Selected Items ({posCart.length})
                              </h4>
                              {posCart.length > 0 && (
                                <button
                                  type="button"
                                  className="pos-btn-clear-cart"
                                  onClick={clearPosCart}
                                  title="Clear all items"
                                >
                                  <Trash2 size={12} /> Clear All
                                </button>
                              )}
                            </div>
                            <div className="pos-card-body" style={{ padding: 0 }}>
                              {posCart.length === 0 ? (
                                <div className="pos-empty-cart-state" style={{ padding: '24px 16px' }}>
                                  <div className="pos-empty-cart-icon">
                                    <ShoppingCart size={22} />
                                  </div>
                                  <h5 style={{ margin: '8px 0 4px', fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>No Items Selected</h5>
                                  <p style={{ margin: 0, fontSize: '12px', color: '#64748B' }}>
                                    Select from the dropdown above or pick from catalog cards.
                                  </p>
                                </div>
                              ) : (
                                <div className="pos-items-table-wrap">
                                  <table className="pos-items-table">
                                    <thead>
                                      <tr>
                                        <th>Item</th>
                                        <th style={{ textAlign: 'center' }}>Qty</th>
                                        <th style={{ textAlign: 'right' }}>Price</th>
                                        <th style={{ textAlign: 'right' }}>Total</th>
                                        <th style={{ textAlign: 'center', width: '36px' }}></th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {posCart.map((item, idx) => (
                                        <tr key={idx}>
                                          <td>
                                            <div className="pos-table-item-name">{item.name}</div>
                                            <span className="pos-table-item-type">{item.type}</span>
                                          </td>
                                          <td style={{ textAlign: 'center' }}>
                                            <div className="pos-qty-stepper">
                                              <button
                                                type="button"
                                                className="pos-stepper-btn"
                                                onClick={() => updatePosCartQty(idx, -1)}
                                                title="Decrease"
                                              >
                                                -
                                              </button>
                                              <span className="pos-stepper-val">{item.qty}</span>
                                              <button
                                                type="button"
                                                className="pos-stepper-btn"
                                                onClick={() => updatePosCartQty(idx, 1)}
                                                title="Increase"
                                              >
                                                +
                                              </button>
                                            </div>
                                          </td>
                                          <td style={{ textAlign: 'right', fontWeight: 600, color: '#334155' }}>
                                            ₹{item.price.toLocaleString()}
                                          </td>
                                          <td style={{ textAlign: 'right', fontWeight: 800, color: '#0D9488' }}>
                                            ₹{(item.price * item.qty).toLocaleString()}
                                          </td>
                                          <td style={{ textAlign: 'center' }}>
                                            <button
                                              type="button"
                                              className="pos-btn-del-item"
                                              onClick={() => removeFromPosCart(idx)}
                                              title="Remove item"
                                            >
                                              <Trash2 size={13} />
                                            </button>
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* 4. AMOUNT */}
                          <div className="pos-form-card">
                            <div className="pos-card-header">
                              <h4 className="pos-card-title-text">
                                <IndianRupee size={15} /> Amount
                              </h4>
                            </div>
                            <div className="pos-card-body">
                              <div className="pos-calc-line">
                                <span>Subtotal</span>
                                <span style={{ fontWeight: 700, color: '#0F172A' }}>₹{posSubtotal.toLocaleString()}</span>
                              </div>

                              <div className="pos-calc-line gst-toggle-row">
                                <label className="pos-gst-toggle-label">
                                  <input
                                    type="checkbox"
                                    checked={posApplyGst}
                                    onChange={(e) => setPosApplyGst(e.target.checked)}
                                  />
                                  <span>GST (18% CGST + SGST)</span>
                                </label>
                                <span style={{ fontWeight: 700, color: posApplyGst ? '#0D9488' : '#64748B' }}>
                                  {posApplyGst ? `+ ₹${posTax.toLocaleString()}` : '₹0'}
                                </span>
                              </div>

                              <div className="pos-calc-line" style={{ background: '#F1F5F9', padding: '6px 10px', borderRadius: '8px', margin: '4px 0', fontWeight: 700 }}>
                                <span style={{ color: '#334155' }}>Total (Price + GST)</span>
                                <span style={{ color: '#0F172A', fontSize: '13.5px' }}>₹{posTotalBeforeDiscount.toLocaleString()}</span>
                              </div>

                              <div className="pos-amount-discount-block">
                                <div className="pos-calc-line" style={{ marginBottom: '6px' }}>
                                  <span>Discount</span>
                                  <span style={{ fontWeight: 700, color: posDiscountAmt > 0 ? '#16A34A' : '#64748B' }}>
                                    {posDiscountAmt > 0 ? `- ₹${posDiscountAmt.toLocaleString()}` : '₹0'}
                                  </span>
                                </div>
                                <div className="pos-discount-chips-compact">
                                  {[0, 5, 10, 15].map(pct => {
                                    const isCurrent = posDiscountCustom === '' && posDiscountPercent === pct;
                                    return (
                                      <button
                                        key={pct}
                                        type="button"
                                        className={`pos-disc-chip-mini ${isCurrent ? 'active' : ''}`}
                                        onClick={() => {
                                          setPosDiscountPercent(pct);
                                          setPosDiscountCustom('');
                                        }}
                                      >
                                        {pct === 0 ? 'None' : `${pct}%`}
                                      </button>
                                    );
                                  })}
                                  {[100, 250].map(flat => (
                                    <button
                                      key={flat}
                                      type="button"
                                      className={`pos-disc-chip-mini ${posDiscountCustom === String(flat) ? 'active' : ''}`}
                                      onClick={() => {
                                        setPosDiscountPercent(0);
                                        setPosDiscountCustom(String(flat));
                                      }}
                                    >
                                      ₹{flat}
                                    </button>
                                  ))}
                                  <div className="pos-disc-custom-wrap">
                                    <span style={{ fontSize: '11px', color: '#64748B' }}>Custom ₹:</span>
                                    <input
                                      type="number"
                                      className="pos-custom-disc-input-mini"
                                      value={posDiscountCustom !== '' ? posDiscountCustom : (posDiscountAmt > 0 ? posDiscountAmt : '')}
                                      onChange={(e) => {
                                        setPosDiscountPercent(0);
                                        setPosDiscountCustom(e.target.value);
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>

                              {/* Grand Total */}
                              <div className="pos-grand-total-banner">
                                <div className="pos-total-left">
                                  <span className="pos-total-title">GRAND TOTAL</span>
                                  <span className="pos-total-count">{totalCartItemsCount} Items Selected</span>
                                </div>
                                <div className="pos-total-amount">
                                  ₹{posTotal.toLocaleString()}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* 5. PAYMENT */}
                          <div className="pos-form-card">
                            <div className="pos-card-header">
                              <h4 className="pos-card-title-text">
                                <CreditCard size={15} /> Payment
                              </h4>
                            </div>
                            <div className="pos-card-body">
                              <div className="pos-payment-methods-grid">
                                {[
                                  { id: 'UPI', label: 'UPI / QR', icon: '📱' },
                                  { id: 'Card', label: 'Card', icon: '💳' },
                                  { id: 'Cash', label: 'Cash', icon: '💵' }
                                ].map(m => (
                                  <button
                                    key={m.id}
                                    type="button"
                                    className={`pos-method-btn ${posPayMethod === m.id ? 'active' : ''}`}
                                    onClick={() => setPosPayMethod(m.id)}
                                  >
                                    <span className="method-icon">{m.icon}</span>
                                    <span className="method-label">{m.label}</span>
                                    {posPayMethod === m.id && (
                                      <span className="method-check">✓</span>
                                    )}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* 6. BUTTONS: Cancel | Create & Pay Bill */}
                          <div className="pos-actions-bar">
                            <button
                              type="button"
                              className="pos-btn-cancel-bill"
                              onClick={handleCancelPOS}
                            >
                              <X size={16} /> Cancel
                            </button>
                            <button
                              type="button"
                              className="pos-btn-create-pay"
                              onClick={handleCheckoutPOS}
                              disabled={posCart.length === 0}
                            >
                              <Printer size={16} /> Create & Pay Bill (₹{posTotal.toLocaleString()})
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* SECOND VIEW: TODAY'S POS INVOICES / RECEIPTS HISTORY */
                      <div className="pos-history-container">
                        <div className="pos-history-header">
                          <div>
                            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#0F172A' }}>
                              Today's Generated Invoices
                            </h3>
                            <p style={{ margin: '3px 0 0', fontSize: '13px', color: '#64748B' }}>
                              Showing all receipts processed on {todayStr}
                            </p>
                          </div>
                          <button
                            type="button"
                            style={{
                              padding: '8px 16px',
                              borderRadius: '20px',
                              fontSize: '12px',
                              fontWeight: 700,
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              background: '#F1F5F9',
                              border: '1px solid #E2E8F0',
                              color: '#0F172A',
                              cursor: 'pointer'
                            }}
                            onClick={() => setPosViewMode('register')}
                          >
                            <ShoppingCart size={14} /> Back to Register
                          </button>
                        </div>

                        {todayInvoices.length === 0 ? (
                          <div className="pos-empty-catalog" style={{ margin: '40px auto', maxWidth: 440 }}>
                            <Receipt size={40} color="#94A3B8" />
                            <h4>No invoices generated today</h4>
                            <p>Once you complete billing in the register, printed receipts will appear here.</p>
                            <button
                              type="button"
                              className="btn-gold-action"
                              style={{ padding: '8px 20px', borderRadius: '20px', fontSize: '12px' }}
                              onClick={() => setPosViewMode('register')}
                            >
                              Go to Register
                            </button>
                          </div>
                        ) : (
                          <div className="pos-invoices-table-wrap">
                            <table className="pos-invoices-table">
                              <thead>
                                <tr>
                                  <th>Invoice ID</th>
                                  <th>Time</th>
                                  <th>Customer Name</th>
                                  <th>Phone</th>
                                  <th>Items</th>
                                  <th>Stylist</th>
                                  <th>Payment</th>
                                  <th style={{ textAlign: 'right' }}>Total</th>
                                  <th style={{ textAlign: 'center' }}>Action</th>
                                </tr>
                              </thead>
                              <tbody>
                                {todayInvoices.map((inv, idx) => (
                                  <tr key={idx}>
                                    <td>
                                      <span style={{ fontWeight: 800, color: '#0D9488', letterSpacing: '0.2px' }}>
                                        {inv.id}
                                      </span>
                                    </td>
                                    <td style={{ color: '#64748B', fontWeight: 600 }}>{inv.time || '12:00 PM'}</td>
                                    <td>
                                      <strong style={{ color: '#0F172A', fontWeight: 700 }}>{inv.customerName}</strong>
                                    </td>
                                    <td style={{ color: '#475569' }}>{inv.customerPhone}</td>
                                    <td>
                                      <span style={{ background: '#F1F5F9', color: '#334155', padding: '3px 9px', borderRadius: '6px', fontSize: '11.5px', fontWeight: 700 }}>
                                        {(inv.items || []).length} items
                                      </span>
                                    </td>
                                    <td style={{ color: '#334155', fontWeight: 600 }}>{inv.staffName || 'Stylist'}</td>
                                    <td>
                                      <span style={{ background: '#E0F2FE', color: '#0369A1', padding: '3px 9px', borderRadius: '6px', fontSize: '11px', fontWeight: 800 }}>
                                        {inv.paymentMethod || 'UPI'}
                                      </span>
                                    </td>
                                    <td style={{ textAlign: 'right' }}>
                                      <strong style={{ fontSize: '14.5px', color: '#0F172A', fontWeight: 900 }}>
                                        ₹{inv.totalAmount.toLocaleString()}
                                      </strong>
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                      <button
                                        type="button"
                                        style={{
                                          display: 'inline-flex',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          width: '28px',
                                          height: '28px',
                                          borderRadius: '6px',
                                          border: 'none',
                                          background: '#F1F5F9',
                                          color: '#475569',
                                          cursor: 'pointer',
                                          transition: 'all 0.15s ease'
                                        }}
                                        onClick={() => {
                                          setLastGeneratedInvoice(inv);
                                          setShowPOSReceiptModal(true);
                                        }}
                                        onMouseEnter={(e) => {
                                          e.currentTarget.style.background = '#E2E8F0';
                                          e.currentTarget.style.color = '#0F172A';
                                        }}
                                        onMouseLeave={(e) => {
                                          e.currentTarget.style.background = '#F1F5F9';
                                          e.currentTarget.style.color = '#475569';
                                        }}
                                        title="View / Print Receipt"
                                      >
                                        <Printer size={15} />
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })()}


              {/* ========================================================================= */}
              {/* VIEW 11: 📊 REPORTS & ANALYTICS (WITH SUBTABS & CSV EXPORT) */}
              {/* ========================================================================= */}
              {activeModule === 'reports' && (
                <div className="looks-view-wrapper reports-view" style={{ padding: '4px 0' }}>
                  {/* Header Row: Title & Export CSV Button */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '22px', flexWrap: 'wrap', gap: '16px' }}>
                    <div>
                      <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.3px' }}>
                        Reports &amp; Business Intelligence
                      </h2>
                      <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748B' }}>
                        Detailed revenue analytics, employee commission statements, inventory valuation and lead conversion reports.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setPdfPreviewTab(reportsSubTab);
                        setShowPdfPreviewModal(true);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '9px 18px',
                        background: '#D4A373',
                        color: '#1E293B',
                        borderRadius: '8px',
                        border: 'none',
                        fontWeight: 700,
                        fontSize: '13px',
                        cursor: 'pointer',
                        boxShadow: '0 2px 6px rgba(212, 163, 115, 0.25)',
                        transition: 'all 0.15s ease'
                      }}
                      title="Preview and Download Report as PDF"
                    >
                      <Download size={15} strokeWidth={2.3} /> Download PDF
                    </button>
                  </div>

                  {/* Subtabs Pill Switcher (Matching Screenshot) */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px', flexWrap: 'wrap' }}>
                    {[
                      { id: 'revenue', label: 'Revenue Report' },
                      { id: 'employee', label: 'Employee Reports' },
                      { id: 'incentive', label: 'Incentive Ledger' },
                      { id: 'inventory', label: 'Inventory Valuation' },
                      { id: 'leads', label: 'Lead Conversions' }
                    ].map(st => {
                      const isActive = reportsSubTab === st.id;
                      return (
                        <button
                          key={st.id}
                          type="button"
                          onClick={() => setReportsSubTab(st.id)}
                          style={{
                            padding: '8px 20px',
                            borderRadius: '24px',
                            border: isActive ? 'none' : '1px solid #E2E8F0',
                            background: isActive ? '#0F172A' : '#FFFFFF',
                            color: isActive ? '#FFFFFF' : '#334155',
                            fontWeight: 700,
                            fontSize: '13px',
                            cursor: 'pointer',
                            boxShadow: isActive ? '0 2px 6px rgba(15, 23, 42, 0.18)' : 'none',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          {st.label}
                        </button>
                      );
                    })}
                  </div>

                  {/* SUBTAB 1: REVENUE REPORT */}
                  {reportsSubTab === 'revenue' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
                      {/* 3 KPI Cards Row (Matching Screenshot) */}
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                        gap: '18px',
                        maxWidth: '850px'
                      }}>
                        {/* 1. Gross Revenue Realized */}
                        <div style={{
                          background: '#FFFFFF',
                          border: '1px solid #E2E8F0',
                          borderRadius: '12px',
                          padding: '20px 24px',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
                        }}>
                          <div style={{ fontSize: '12px', fontWeight: 600, color: '#64748B', marginBottom: '8px' }}>
                            Gross Revenue Realized
                          </div>
                          <div style={{ fontSize: '28px', fontWeight: 800, color: '#0F172A', lineHeight: 1.2, marginBottom: '8px' }}>
                            ₹{totalGrossRevenue.toLocaleString('en-IN')}
                          </div>
                          <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#16A34A' }}>
                            100% live tracking
                          </div>
                        </div>

                        {/* 2. Total Discounts Given */}
                        <div style={{
                          background: '#FFFFFF',
                          border: '1px solid #E2E8F0',
                          borderRadius: '12px',
                          padding: '20px 24px',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
                        }}>
                          <div style={{ fontSize: '12px', fontWeight: 600, color: '#64748B', marginBottom: '8px' }}>
                            Total Discounts Given
                          </div>
                          <div style={{ fontSize: '28px', fontWeight: 800, color: '#0F172A', lineHeight: 1.2, marginBottom: '8px' }}>
                            ₹{totalDiscountsGiven.toLocaleString('en-IN')}
                          </div>
                          <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#D97706' }}>
                            Promotions applied
                          </div>
                        </div>

                        {/* 3. GST Tax Collected (18%) */}
                        <div style={{
                          background: '#FFFFFF',
                          border: '1px solid #E2E8F0',
                          borderRadius: '12px',
                          padding: '20px 24px',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
                        }}>
                          <div style={{ fontSize: '12px', fontWeight: 600, color: '#64748B', marginBottom: '8px' }}>
                            GST Tax Collected (18%)
                          </div>
                          <div style={{ fontSize: '28px', fontWeight: 800, color: '#0F172A', lineHeight: 1.2, marginBottom: '8px' }}>
                            ₹{totalTaxCollected.toLocaleString('en-IN')}
                          </div>
                          <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#64748B' }}>
                            Filed &amp; recorded
                          </div>
                        </div>
                      </div>

                      {/* Revenue Master Table (Matching Screenshot) */}
                      <div style={{
                        background: '#FFFFFF',
                        border: '1px solid #E2E8F0',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                        width: '100%',
                        overflowX: 'auto'
                      }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '780px' }}>
                          <thead>
                            <tr style={{ background: '#FFFFFF', borderBottom: '1px solid #E2E8F0' }}>
                              <th style={{ padding: '16px 20px', fontSize: '13px', fontWeight: 700 }}>
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#D97706' }}>
                                  <CalendarDays size={14} color="#D97706" /> Date
                                </span>
                              </th>
                              <th style={{ padding: '16px 20px', fontSize: '13px', fontWeight: 700 }}>
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#0284C7' }}>
                                  <Receipt size={14} color="#0284C7" /> Transactions Count
                                </span>
                              </th>
                              <th style={{ padding: '16px 20px', fontSize: '13px', fontWeight: 700 }}>
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#10B981' }}>
                                  <IndianRupee size={14} color="#10B981" /> Service Gross (₹)
                                </span>
                              </th>
                              <th style={{ padding: '16px 20px', fontSize: '13px', fontWeight: 700 }}>
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#8B5CF6' }}>
                                  <ShoppingBag size={14} color="#8B5CF6" /> Retail Product Gross (₹)
                                </span>
                              </th>
                              <th style={{ padding: '16px 20px', fontSize: '13px', fontWeight: 700 }}>
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#059669' }}>
                                  <IndianRupee size={14} color="#059669" /> Total Realized (₹)
                                </span>
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {revenueReportRows.length === 0 ? (
                              <tr>
                                <td colSpan={5} style={{ padding: '60px 20px', textAlign: 'center' }}>
                                  <div style={{ maxWidth: '380px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', color: '#94A3B8' }}>
                                    <Receipt size={36} color="#CBD5E1" />
                                    <h4 style={{ margin: 0, fontSize: '16px', color: '#0F172A', fontWeight: 700 }}>No revenue transactions recorded yet</h4>
                                    <p style={{ margin: 0, fontSize: '12.5px', color: '#64748B' }}>Complete client appointments or fast POS bills to generate financial revenue records.</p>
                                  </div>
                                </td>
                              </tr>
                            ) : (
                              revenueReportRows.map((r, i) => (
                                <tr key={i} style={{ borderBottom: i < revenueReportRows.length - 1 ? '1px solid #F1F5F9' : 'none' }}>
                                  <td style={{ padding: '16px 20px', fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>{r.date}</td>
                                  <td style={{ padding: '16px 20px', fontSize: '13px', color: '#334155' }}>{r.count}</td>
                                  <td style={{ padding: '16px 20px', fontSize: '13px', color: '#334155' }}>₹{r.serviceGross.toLocaleString('en-IN')}</td>
                                  <td style={{ padding: '16px 20px', fontSize: '13px', color: '#334155' }}>₹{r.retailGross.toLocaleString('en-IN')}</td>
                                  <td style={{ padding: '16px 20px', fontSize: '13.5px', fontWeight: 800, color: '#0F172A' }}>₹{r.total.toLocaleString('en-IN')}</td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* SUBTAB 2: EMPLOYEE REPORTS */}
                  {reportsSubTab === 'employee' && (
                    <div style={{
                      background: '#FFFFFF',
                      border: '1px solid #E2E8F0',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                      width: '100%',
                      overflowX: 'auto'
                    }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '780px' }}>
                        <thead>
                          <tr style={{ background: '#FFFFFF', borderBottom: '1px solid #E2E8F0' }}>
                            <th style={{ padding: '16px 20px', fontSize: '13px', fontWeight: 700 }}>
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#8B5CF6' }}>
                                <User size={14} color="#8B5CF6" /> Employee Name
                              </span>
                            </th>
                            <th style={{ padding: '16px 20px', fontSize: '13px', fontWeight: 700 }}>
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#0D9488' }}>
                                <Tag size={14} color="#0D9488" /> Role
                              </span>
                            </th>
                            <th style={{ padding: '16px 20px', fontSize: '13px', fontWeight: 700 }}>
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#0284C7' }}>
                                <Scissors size={14} color="#0284C7" /> Total Services Billed
                              </span>
                            </th>
                            <th style={{ padding: '16px 20px', fontSize: '13px', fontWeight: 700 }}>
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#D97706' }}>
                                <IndianRupee size={14} color="#D97706" /> Gross Service Value
                              </span>
                            </th>
                            <th style={{ padding: '16px 20px', fontSize: '13px', fontWeight: 700 }}>
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#EC4899' }}>
                                <Percent size={14} color="#EC4899" /> Commission Earned
                              </span>
                            </th>
                            <th style={{ padding: '16px 20px', fontSize: '13px', fontWeight: 700 }}>
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#F59E0B' }}>
                                <Star size={14} color="#F59E0B" /> Performance Rating
                              </span>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {topEmployees.length === 0 ? (
                            <tr>
                              <td colSpan={6} style={{ padding: '60px 20px', textAlign: 'center' }}>
                                <div style={{ maxWidth: '380px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', color: '#94A3B8' }}>
                                  <Users size={36} color="#CBD5E1" />
                                  <h4 style={{ margin: 0, fontSize: '16px', color: '#0F172A', fontWeight: 700 }}>No employee records found</h4>
                                  <p style={{ margin: 0, fontSize: '12.5px', color: '#64748B' }}>Employee performance statistics will appear here.</p>
                                </div>
                              </td>
                            </tr>
                          ) : (
                            topEmployees.map((e, idx) => (
                              <tr key={e.id} style={{ borderBottom: idx < topEmployees.length - 1 ? '1px solid #F1F5F9' : 'none' }}>
                                <td style={{ padding: '16px 20px', fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>{e.name}</td>
                                <td style={{ padding: '16px 20px', fontSize: '13px', color: '#334155' }}>{e.role}</td>
                                <td style={{ padding: '16px 20px', fontSize: '13px', color: '#334155' }}>{e.services} services</td>
                                <td style={{ padding: '16px 20px', fontSize: '13px', color: '#334155' }}>₹{e.revenue.toLocaleString('en-IN')}</td>
                                <td style={{ padding: '16px 20px', fontSize: '13.5px', fontWeight: 800, color: '#0F172A' }}>₹{e.incentive.toLocaleString('en-IN')}</td>
                                <td style={{ padding: '16px 20px', fontSize: '13px', color: '#F59E0B', fontWeight: 700 }}>⭐ 4.95</td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* SUBTAB 3: INCENTIVE LEDGER */}
                  {reportsSubTab === 'incentive' && (
                    <div style={{
                      background: '#FFFFFF',
                      border: '1px solid #E2E8F0',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                      width: '100%',
                      overflowX: 'auto'
                    }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '750px' }}>
                        <thead>
                          <tr style={{ background: '#FFFFFF', borderBottom: '1px solid #E2E8F0' }}>
                            <th style={{ padding: '16px 20px', fontSize: '13px', fontWeight: 700 }}>
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#8B5CF6' }}>
                                <User size={14} color="#8B5CF6" /> Stylist
                              </span>
                            </th>
                            <th style={{ padding: '16px 20px', fontSize: '13px', fontWeight: 700 }}>
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#0284C7' }}>
                                <Scissors size={14} color="#0284C7" /> Total Services Billed
                              </span>
                            </th>
                            <th style={{ padding: '16px 20px', fontSize: '13px', fontWeight: 700 }}>
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#D97706' }}>
                                <IndianRupee size={14} color="#D97706" /> Base Revenue (₹)
                              </span>
                            </th>
                            <th style={{ padding: '16px 20px', fontSize: '13px', fontWeight: 700 }}>
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#EC4899' }}>
                                <Percent size={14} color="#EC4899" /> Incentive Accrued (₹)
                              </span>
                            </th>
                            <th style={{ padding: '16px 20px', fontSize: '13px', fontWeight: 700 }}>
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#10B981' }}>
                                <CheckCircle2 size={14} color="#10B981" /> Status
                              </span>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {topEmployees.length === 0 ? (
                            <tr>
                              <td colSpan={5} style={{ padding: '60px 20px', textAlign: 'center' }}>
                                <div style={{ maxWidth: '380px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', color: '#94A3B8' }}>
                                  <Sparkles size={36} color="#CBD5E1" />
                                  <h4 style={{ margin: 0, fontSize: '16px', color: '#0F172A', fontWeight: 700 }}>No incentive ledger records</h4>
                                  <p style={{ margin: 0, fontSize: '12.5px', color: '#64748B' }}>Stylist commissions are accrued when appointments and POS invoices are paid.</p>
                                </div>
                              </td>
                            </tr>
                          ) : (
                            topEmployees.map((e, idx) => (
                              <tr key={e.id} style={{ borderBottom: idx < topEmployees.length - 1 ? '1px solid #F1F5F9' : 'none' }}>
                                <td style={{ padding: '16px 20px', fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>{e.name}</td>
                                <td style={{ padding: '16px 20px', fontSize: '13px', color: '#334155' }}>{e.services}</td>
                                <td style={{ padding: '16px 20px', fontSize: '13px', color: '#334155' }}>₹{e.revenue.toLocaleString('en-IN')}</td>
                                <td style={{ padding: '16px 20px', fontSize: '13.5px', fontWeight: 800, color: '#0F172A' }}>₹{e.incentive.toLocaleString('en-IN')}</td>
                                <td style={{ padding: '16px 20px' }}>
                                  <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '11.5px', fontWeight: 700, background: '#DCFCE7', color: '#16A34A' }}>
                                    Available on Payroll
                                  </span>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* SUBTAB 4: INVENTORY VALUATION */}
                  {reportsSubTab === 'inventory' && (
                    <div style={{
                      background: '#FFFFFF',
                      border: '1px solid #E2E8F0',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                      width: '100%',
                      overflowX: 'auto'
                    }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '780px' }}>
                        <thead>
                          <tr style={{ background: '#FFFFFF', borderBottom: '1px solid #E2E8F0' }}>
                            <th style={{ padding: '16px 20px', fontSize: '13px', fontWeight: 700 }}>
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#0284C7' }}>
                                <Tag size={14} color="#0284C7" /> Category
                              </span>
                            </th>
                            <th style={{ padding: '16px 20px', fontSize: '13px', fontWeight: 700 }}>
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#8B5CF6' }}>
                                <Package size={14} color="#8B5CF6" /> Total Product Items
                              </span>
                            </th>
                            <th style={{ padding: '16px 20px', fontSize: '13px', fontWeight: 700 }}>
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#10B981' }}>
                                <Layers size={14} color="#10B981" /> Total Units on Hand
                              </span>
                            </th>
                            <th style={{ padding: '16px 20px', fontSize: '13px', fontWeight: 700 }}>
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#D97706' }}>
                                <IndianRupee size={14} color="#D97706" /> Total Asset Value (Cost)
                              </span>
                            </th>
                            <th style={{ padding: '16px 20px', fontSize: '13px', fontWeight: 700 }}>
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#0D9488' }}>
                                <IndianRupee size={14} color="#0D9488" /> Expected Retail Value
                              </span>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {inventoryValuationList.length === 0 ? (
                            <tr>
                              <td colSpan={5} style={{ padding: '60px 20px', textAlign: 'center' }}>
                                <div style={{ maxWidth: '380px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', color: '#94A3B8' }}>
                                  <Package size={36} color="#CBD5E1" />
                                  <h4 style={{ margin: 0, fontSize: '16px', color: '#0F172A', fontWeight: 700 }}>No inventory records available</h4>
                                  <p style={{ margin: 0, fontSize: '12.5px', color: '#64748B' }}>Add products to your salon stock to calculate current asset valuation.</p>
                                </div>
                              </td>
                            </tr>
                          ) : (
                            inventoryValuationList.map((item, idx) => (
                              <tr key={idx} style={{ borderBottom: idx < inventoryValuationList.length - 1 ? '1px solid #F1F5F9' : 'none' }}>
                                <td style={{ padding: '16px 20px', fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>{item.category}</td>
                                <td style={{ padding: '16px 20px', fontSize: '13px', color: '#334155' }}>{item.itemsCount}</td>
                                <td style={{ padding: '16px 20px', fontSize: '13px', color: '#334155' }}>{item.totalUnits} units</td>
                                <td style={{ padding: '16px 20px', fontSize: '13px', color: '#334155' }}>₹{item.assetCost.toLocaleString('en-IN')}</td>
                                <td style={{ padding: '16px 20px', fontSize: '13.5px', fontWeight: 800, color: '#0F172A' }}>₹{item.retailValue.toLocaleString('en-IN')}</td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* SUBTAB 5: LEADS CONVERSIONS */}
                  {reportsSubTab === 'leads' && (
                    <div style={{
                      background: '#FFFFFF',
                      border: '1px solid #E2E8F0',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                      width: '100%',
                      overflowX: 'auto'
                    }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '650px' }}>
                        <thead>
                          <tr style={{ background: '#FFFFFF', borderBottom: '1px solid #E2E8F0' }}>
                            <th style={{ padding: '16px 20px', fontSize: '13px', fontWeight: 700 }}>
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#0284C7' }}>
                                <Target size={14} color="#0284C7" /> Source Channel
                              </span>
                            </th>
                            <th style={{ padding: '16px 20px', fontSize: '13px', fontWeight: 700 }}>
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#8B5CF6' }}>
                                <Users size={14} color="#8B5CF6" /> Total Leads
                              </span>
                            </th>
                            <th style={{ padding: '16px 20px', fontSize: '13px', fontWeight: 700 }}>
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#10B981' }}>
                                <CheckCircle2 size={14} color="#10B981" /> Converted Clients
                              </span>
                            </th>
                            <th style={{ padding: '16px 20px', fontSize: '13px', fontWeight: 700 }}>
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#D97706' }}>
                                <Percent size={14} color="#D97706" /> Conversion Rate
                              </span>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {leadConversionsList.length === 0 ? (
                            <tr>
                              <td colSpan={4} style={{ padding: '60px 20px', textAlign: 'center' }}>
                                <div style={{ maxWidth: '380px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', color: '#94A3B8' }}>
                                  <Target size={36} color="#CBD5E1" />
                                  <h4 style={{ margin: 0, fontSize: '16px', color: '#0F172A', fontWeight: 700 }}>No lead conversion statistics recorded</h4>
                                  <p style={{ margin: 0, fontSize: '12.5px', color: '#64748B' }}>Add and qualify leads in CRM to view channel conversion efficiency.</p>
                                </div>
                              </td>
                            </tr>
                          ) : (
                            leadConversionsList.map((item, idx) => (
                              <tr key={idx} style={{ borderBottom: idx < leadConversionsList.length - 1 ? '1px solid #F1F5F9' : 'none' }}>
                                <td style={{ padding: '16px 20px', fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>{item.source}</td>
                                <td style={{ padding: '16px 20px', fontSize: '13px', color: '#334155' }}>{item.total}</td>
                                <td style={{ padding: '16px 20px', fontSize: '13px', color: '#334155' }}>{item.converted}</td>
                                <td style={{ padding: '16px 20px', fontSize: '13.5px', fontWeight: 800, color: '#0F172A' }}>{item.rate}%</td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
              {/* ========================================================================= */}
              {/* VIEW 12: ⚙️ SETTINGS */}
              {/* ========================================================================= */}
              {activeModule === 'settings' && (
                <div className="looks-view-wrapper settings-view">
                  <div className="looks-section-header">
                    <div>
                      <h2 className="section-main-title">Salon Settings & Brand Configuration</h2>
                      <p className="section-lead-text">Manage brand profile, business hours, tax rules, and operational parameters.</p>
                    </div>
                  </div>

                  <div className="settings-form-card">
                    <div className="form-group-looks">
                      <label style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#0F172A', fontWeight: 700 }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(124, 58, 237, 0.12)', color: '#7C3AED' }}>
                          <Building2 size={13} strokeWidth={2.5} />
                        </span>
                        <span>Salon Brand Name</span>
                      </label>
                      <input type="text" className="looks-input" defaultValue="LOOKS PROFESSIONAL UNISEX SALON" />
                    </div>
                    <div className="form-group-looks">
                      <label style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#0F172A', fontWeight: 700 }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(225, 29, 72, 0.12)', color: '#E11D48' }}>
                          <MapPin size={13} strokeWidth={2.5} />
                        </span>
                        <span>Address</span>
                      </label>
                      <input type="text" className="looks-input" defaultValue="Plot 42, Linking Road, Bandra West, Mumbai 400050" />
                    </div>
                    <div className="form-group-looks-grid">
                      <div className="form-group-looks">
                        <label style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#0F172A', fontWeight: 700 }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(22, 163, 74, 0.12)', color: '#16A34A' }}>
                            <Phone size={13} strokeWidth={2.5} />
                          </span>
                          <span>Contact Phone</span>
                        </label>
                        <input type="text" className="looks-input" defaultValue="+91 98111 22334" />
                      </div>
                      <div className="form-group-looks">
                        <label style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#0F172A', fontWeight: 700 }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(2, 132, 199, 0.12)', color: '#0284C7' }}>
                            <Clock size={13} strokeWidth={2.5} />
                          </span>
                          <span>Business Operating Hours</span>
                        </label>
                        <input type="text" className="looks-input" defaultValue="09:00 AM - 09:30 PM" />
                      </div>
                    </div>
                    <div className="form-group-looks-grid" style={{ marginTop: '12px' }}>
                      <div className="form-group-looks">
                        <label style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#0F172A', fontWeight: 700 }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(217, 119, 6, 0.12)', color: '#D97706' }}>
                            <Percent size={13} strokeWidth={2.5} />
                          </span>
                          <span>Default GST Tax Rate (%)</span>
                        </label>
                        <input type="number" className="looks-input" defaultValue={18} />
                      </div>
                      <div className="form-group-looks">
                        <label style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#0F172A', fontWeight: 700 }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(219, 39, 119, 0.12)', color: '#DB2777' }}>
                            <Percent size={13} strokeWidth={2.5} />
                          </span>
                          <span>Default Stylist Commission (%)</span>
                        </label>
                        <input type="number" className="looks-input" defaultValue={12} />
                      </div>
                    </div>
                    <button className="btn-gold-action" style={{ marginTop: '14px' }} onClick={() => showToast('Settings saved successfully!')}>
                      Save Changes
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* INTERACTIVE MODALS */}
      {/* ========================================================================= */}

      {/* ========================================================================= */}
      {/* 1. MODAL: ADD NEW LEAD (FULL LEAD INFORMATION AS IN DIAGRAM) */}
      {/* ========================================================================= */}
      {showAddLeadModal && (
        <div className="looks-modal-backdrop" onClick={() => setShowAddLeadModal(false)}>
          <div className="looks-modal-window" style={{ maxWidth: '640px', width: '92%', borderRadius: '16px', overflow: 'hidden' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-top" style={{ padding: '18px 24px 14px 24px', background: '#FFFFFF', borderBottom: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(124, 58, 237, 0.12)', color: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <UserPlus size={22} strokeWidth={2.3} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#0F172A' }}>Generate New Lead</h3>
                  <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#64748B' }}>Capture client inquiry &amp; enter into the salon conversion pipeline.</p>
                </div>
              </div>
              <button className="btn-close-x" onClick={() => setShowAddLeadModal(false)} style={{ fontSize: '22px', background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>×</button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              const cleanPhone = (newLead.phone || '').replace(/\D/g, '');
              if (cleanPhone.length !== 10) {
                showToast("⚠️ Please enter a valid 10-digit mobile number.");
                return;
              }
              const hasStaff = newLead.assignedTo && newLead.assignedTo !== 'Unassigned';
              addLead({
                ...newLead,
                phone: `+91 ${cleanPhone}`,
                stage: hasStaff ? 'assign_employee' : 'lead_generated',
                status: hasStaff ? 'Contacted' : 'New',
                estimatedValue: parseFloat(newLead.estimatedValue || 2500)
              });
              setNewLead({
                name: '',
                phone: '',
                email: '',
                gender: 'Female',
                interestedService: (data.services && data.services[0]?.name) || 'Signature Precision Haircut & Styling',
                source: 'Instagram Ad',
                preferredDate: new Date().toISOString().split('T')[0],
                preferredTime: '11:00 AM',
                assignedTo: 'Unassigned',
                estimatedValue: 2500,
                notes: ''
              });
              setShowAddLeadModal(false);
            }} style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '80vh', overflowY: 'auto' }}>

              {/* Row 1: Name & Mobile */}
              <div className="form-group-looks-grid">
                <div className="form-group-looks">
                  <label style={{ fontSize: '12.5px', fontWeight: 700, color: '#0F172A', marginBottom: '5px' }}>
                    Customer Name <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    className="looks-input"
                    placeholder="e.g. Pooja Hegde"
                    value={newLead.name}
                    onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
                  />
                </div>
                <div className="form-group-looks">
                  <label style={{ fontSize: '12.5px', fontWeight: 700, color: '#0F172A', marginBottom: '5px' }}>
                    Mobile Number <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    className="looks-input"
                    placeholder="10-digit mobile"
                    value={newLead.phone}
                    onChange={(e) => setNewLead({ ...newLead, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                  />
                  {newLead.phone ? (
                    newLead.phone.length === 10 ? (
                      <small style={{ color: '#10B981', fontSize: '11px', fontWeight: 600 }}>✓ Valid 10-digit number</small>
                    ) : (
                      <small style={{ color: '#EF4444', fontSize: '11px' }}>10 digits required ({newLead.phone.length}/10)</small>
                    )
                  ) : null}
                </div>
              </div>

              {/* Row 2: Email & Gender */}
              <div className="form-group-looks-grid">
                <div className="form-group-looks">
                  <label style={{ fontSize: '12.5px', fontWeight: 700, color: '#0F172A', marginBottom: '5px' }}>Email Address</label>
                  <input
                    type="email"
                    className="looks-input"
                    placeholder="e.g. pooja.h@gmail.com"
                    value={newLead.email}
                    onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
                  />
                </div>
                <div className="form-group-looks">
                  <label style={{ fontSize: '12.5px', fontWeight: 700, color: '#0F172A', marginBottom: '5px' }}>Gender</label>
                  <select
                    className="looks-input"
                    value={newLead.gender}
                    onChange={(e) => setNewLead({ ...newLead, gender: e.target.value })}
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Unisex">Unisex / Other</option>
                  </select>
                </div>
              </div>

              {/* Row 3: Service & Lead Source */}
              <div className="form-group-looks-grid">
                <div className="form-group-looks">
                  <label style={{ fontSize: '12.5px', fontWeight: 700, color: '#0F172A', marginBottom: '5px' }}>
                    Interested Service <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <select
                    className="looks-input"
                    value={newLead.interestedService}
                    onChange={(e) => {
                      const sName = e.target.value;
                      const found = (data.services || []).find(s => s.name === sName);
                      setNewLead({
                        ...newLead,
                        interestedService: sName,
                        estimatedValue: found ? found.price : newLead.estimatedValue
                      });
                    }}
                  >
                    {(data.services || []).map(s => (
                      <option key={s.id} value={s.name}>{s.name} (₹{s.price})</option>
                    ))}
                    <option value="General Consultation">General Consultation</option>
                  </select>
                </div>
                <div className="form-group-looks">
                  <label style={{ fontSize: '12.5px', fontWeight: 700, color: '#0F172A', marginBottom: '5px' }}>
                    Lead Source <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <select
                    className="looks-input"
                    value={newLead.source}
                    onChange={(e) => setNewLead({ ...newLead, source: e.target.value })}
                  >
                    <option value="Instagram Ad">Instagram Ad</option>
                    <option value="Google Search">Google Search</option>
                    <option value="Website Direct">Website Direct</option>
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="Walk-in">Walk-in</option>
                    <option value="Facebook">Facebook</option>
                    <option value="Client Referral">Client Referral</option>
                    <option value="Phone Call">Phone Call</option>
                  </select>
                </div>
              </div>

              {/* Row 4: Preferred Date & Time */}
              <div className="form-group-looks-grid">
                <div className="form-group-looks">
                  <label style={{ fontSize: '12.5px', fontWeight: 700, color: '#0F172A', marginBottom: '5px' }}>Preferred Date</label>
                  <input
                    type="date"
                    className="looks-input"
                    value={newLead.preferredDate}
                    onChange={(e) => setNewLead({ ...newLead, preferredDate: e.target.value })}
                  />
                </div>
                <div className="form-group-looks">
                  <label style={{ fontSize: '12.5px', fontWeight: 700, color: '#0F172A', marginBottom: '5px' }}>Preferred Time</label>
                  <select
                    className="looks-input"
                    value={newLead.preferredTime}
                    onChange={(e) => setNewLead({ ...newLead, preferredTime: e.target.value })}
                  >
                    {['10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM', '07:00 PM'].map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 5: Assign Staff & Estimated Value */}
              <div className="form-group-looks-grid">
                <div className="form-group-looks">
                  <label style={{ fontSize: '12.5px', fontWeight: 700, color: '#0F172A', marginBottom: '5px' }}>Assign Staff</label>
                  <select
                    className="looks-input"
                    value={newLead.assignedTo}
                    onChange={(e) => setNewLead({ ...newLead, assignedTo: e.target.value })}
                  >
                    <option value="Unassigned">Unassigned (Assign Later)</option>
                    {(data.staff || []).map(st => (
                      <option key={st.id} value={st.name}>{st.name} ({st.role})</option>
                    ))}
                  </select>
                </div>
                <div className="form-group-looks">
                  <label style={{ fontSize: '12.5px', fontWeight: 700, color: '#0F172A', marginBottom: '5px' }}>Estimated Value (₹)</label>
                  <input
                    type="number"
                    min="100"
                    step="50"
                    className="looks-input"
                    value={newLead.estimatedValue}
                    onChange={(e) => setNewLead({ ...newLead, estimatedValue: e.target.value })}
                  />
                </div>
              </div>

              {/* Row 6: Notes */}
              <div className="form-group-looks">
                <label style={{ fontSize: '12.5px', fontWeight: 700, color: '#0F172A', marginBottom: '5px' }}>Notes &amp; Preferences</label>
                <textarea
                  className="looks-input"
                  style={{ minHeight: '65px', resize: 'vertical' }}
                  placeholder="Inquiry notes, hair concerns, event timing..."
                  value={newLead.notes}
                  onChange={(e) => setNewLead({ ...newLead, notes: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', paddingTop: '8px' }}>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowAddLeadModal(false)}
                  style={{ flex: 1, padding: '10px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-gold-action"
                  style={{ flex: 1, padding: '10px', borderRadius: '8px', fontWeight: 700 }}
                >
                  ✓ Generate Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. MODAL: ASSIGN TO STAFF (AS IN DIAGRAM) */}
      {/* ========================================================================= */}
      {selectedLeadForAssign && (
        <div className="looks-modal-backdrop" onClick={() => setSelectedLeadForAssign(null)}>
          <div className="looks-modal-window" style={{ maxWidth: '480px', width: '92%', borderRadius: '16px', overflow: 'hidden' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-top" style={{ padding: '18px 24px 14px', background: '#FFFFFF', borderBottom: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(124, 58, 237, 0.12)', color: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <UserCheck size={20} strokeWidth={2.3} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 700, color: '#0F172A' }}>Assign to Staff</h3>
                  <p style={{ margin: '2px 0 0', fontSize: '11.5px', color: '#64748B' }}>For lead: <strong style={{ color: '#0F172A' }}>{selectedLeadForAssign.name}</strong></p>
                </div>
              </div>
              <button className="btn-close-x" onClick={() => setSelectedLeadForAssign(null)} style={{ fontSize: '20px', background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>×</button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              const staffSelect = e.target.assignedStaff.value;
              const foundStaff = (data.staff || []).find(s => s.name === staffSelect);
              const staffId = foundStaff ? foundStaff.id : 'stf_01';

              updateLead(selectedLeadForAssign.id, {
                assignedTo: staffSelect,
                assignedToId: staffId,
                assignedDate: new Date().toISOString().split('T')[0],
                stage: 'assign_employee',
                status: 'Contacted'
              });

              addLeadFollowUp(selectedLeadForAssign.id, {
                type: 'Internal Assignment',
                staffName: staffSelect,
                notes: `Assigned prospective client to stylist ${staffSelect} for consultation & outreach.`,
                nextStage: 'contact_customer',
                nextStatus: 'Contacted'
              });

              setSelectedLeadForAssign(null);
            }} style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ background: '#F8FAFC', padding: '12px 14px', borderRadius: '10px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ fontSize: '12px', color: '#64748B' }}>Interested Service:</div>
                <strong style={{ fontSize: '13.5px', color: '#0F172A' }}>{selectedLeadForAssign.interestedService}</strong>
                <div style={{ fontSize: '11.5px', color: '#0D9488', fontWeight: 700 }}>Est. Value: ₹{Number(selectedLeadForAssign.estimatedValue || 2500).toLocaleString('en-IN')}</div>
              </div>

              <div className="form-group-looks">
                <label style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', marginBottom: '6px', display: 'block' }}>
                  Select Staff Member:
                </label>
                <select
                  name="assignedStaff"
                  className="looks-input"
                  defaultValue={selectedLeadForAssign.assignedTo || ((data.staff && data.staff[0]?.name) || '')}
                  required
                >
                  {(data.staff || []).map(st => (
                    <option key={st.id} value={st.name}>
                      👤 {st.name} — {st.role} ({st.specialization || 'Master Stylist'})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', gap: '10px', paddingTop: '8px' }}>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setSelectedLeadForAssign(null)}
                  style={{ flex: 1, padding: '10px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-gold-action"
                  style={{ flex: 1, padding: '10px', borderRadius: '8px', fontWeight: 700 }}
                >
                  ✓ Assign Staff
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. MODAL: FOLLOW-UP (BRANCHING WORKFLOW: COMPLETED, RESCHEDULE, NO RESPONSE) */}
      {/* ========================================================================= */}
      {selectedLeadForFollowUp && (
        <div className="looks-modal-backdrop" onClick={() => setSelectedLeadForFollowUp(null)}>
          <div className="looks-modal-window" style={{ maxWidth: '640px', width: '94%', maxHeight: '90vh', overflowY: 'auto', borderRadius: '16px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-top" style={{ padding: '18px 24px 14px', background: '#FFFFFF', borderBottom: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(217, 119, 6, 0.12)', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <RefreshCw size={20} strokeWidth={2.3} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 700, color: '#0F172A' }}>Client Follow-up</h3>
                  <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#64748B' }}>
                    Prospect: <strong style={{ color: '#0F172A' }}>{selectedLeadForFollowUp.name}</strong> ({selectedLeadForFollowUp.phone})
                  </p>
                </div>
              </div>
              <button className="btn-close-x" onClick={() => setSelectedLeadForFollowUp(null)} style={{ fontSize: '20px', background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>×</button>
            </div>

            <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {/* Quick Communication Shortcuts */}
              <div style={{ background: '#F8FAFC', padding: '12px 16px', borderRadius: '12px', border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>Service Inquired</div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>{selectedLeadForFollowUp.interestedService}</div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <a
                    href={`https://wa.me/91${(selectedLeadForFollowUp.phone || '').replace(/[^0-9]/g, '').slice(-10)}?text=${encodeURIComponent(`Hi ${selectedLeadForFollowUp.name}, Greetings from Looks Salon! We wanted to check regarding your inquiry for ${selectedLeadForFollowUp.interestedService}.`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-gold-action"
                    style={{ background: '#25D366', borderColor: '#25D366', padding: '6px 12px', fontSize: '11.5px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                  >
                    <MessageSquare size={13} /> WhatsApp
                  </a>
                  <a
                    href={`tel:${selectedLeadForFollowUp.phone}`}
                    className="btn-secondary"
                    style={{ padding: '6px 12px', fontSize: '11.5px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '5px', border: '1px solid #CBD5E1', borderRadius: '8px', color: '#0F172A', fontWeight: 600 }}
                  >
                    <Phone size={13} /> Call
                  </a>
                </div>
              </div>

              {/* BRANCHING DECISION BUTTONS (DIRECTLY FROM USER DIAGRAM) */}
              <div style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', padding: '16px', borderRadius: '12px' }}>
                <div style={{ fontSize: '12px', fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', marginBottom: '10px', letterSpacing: '0.5px' }}>
                  Select Follow-up Result:
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px', marginBottom: '16px' }}>
                  {/* Branch 1: Completed -> Interested */}
                  <button
                    type="button"
                    onClick={() => setFollowUpEntryForm({ ...followUpEntryForm, actionType: 'completed' })}
                    style={{
                      padding: '10px 8px',
                      borderRadius: '8px',
                      border: followUpEntryForm.actionType === 'completed' ? '2px solid #10B981' : '1px solid #E2E8F0',
                      background: followUpEntryForm.actionType === 'completed' ? 'rgba(16, 185, 129, 0.1)' : '#F8FAFC',
                      color: followUpEntryForm.actionType === 'completed' ? '#047857' : '#334155',
                      cursor: 'pointer',
                      fontWeight: 700,
                      fontSize: '11.5px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <ThumbsUp size={16} />
                    <span>✓ Completed</span>
                    <small style={{ fontSize: '9.5px', fontWeight: 500, opacity: 0.8 }}>Client Interested</small>
                  </button>

                  {/* Branch 2: Reschedule -> Follow-up Again */}
                  <button
                    type="button"
                    onClick={() => setFollowUpEntryForm({ ...followUpEntryForm, actionType: 'reschedule' })}
                    style={{
                      padding: '10px 8px',
                      borderRadius: '8px',
                      border: followUpEntryForm.actionType === 'reschedule' ? '2px solid #EAB308' : '1px solid #E2E8F0',
                      background: followUpEntryForm.actionType === 'reschedule' ? 'rgba(234, 179, 8, 0.12)' : '#F8FAFC',
                      color: followUpEntryForm.actionType === 'reschedule' ? '#B45309' : '#334155',
                      cursor: 'pointer',
                      fontWeight: 700,
                      fontSize: '11.5px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Clock size={16} />
                    <span>📅 Reschedule</span>
                    <small style={{ fontSize: '9.5px', fontWeight: 500, opacity: 0.8 }}>Follow-up Again</small>
                  </button>

                  {/* Branch 3: No Response -> Follow-up Again */}
                  <button
                    type="button"
                    onClick={() => setFollowUpEntryForm({ ...followUpEntryForm, actionType: 'no_response' })}
                    style={{
                      padding: '10px 8px',
                      borderRadius: '8px',
                      border: followUpEntryForm.actionType === 'no_response' ? '2px solid #0284C7' : '1px solid #E2E8F0',
                      background: followUpEntryForm.actionType === 'no_response' ? 'rgba(2, 132, 199, 0.1)' : '#F8FAFC',
                      color: followUpEntryForm.actionType === 'no_response' ? '#0369A1' : '#334155',
                      cursor: 'pointer',
                      fontWeight: 700,
                      fontSize: '11.5px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <PhoneCall size={16} />
                    <span>📞 No Response</span>
                    <small style={{ fontSize: '9.5px', fontWeight: 500, opacity: 0.8 }}>Follow-up Again</small>
                  </button>

                  {/* Branch 4: Not Interested / Lost */}
                  <button
                    type="button"
                    onClick={() => setFollowUpEntryForm({ ...followUpEntryForm, actionType: 'lost' })}
                    style={{
                      padding: '10px 8px',
                      borderRadius: '8px',
                      border: followUpEntryForm.actionType === 'lost' ? '2px solid #EF4444' : '1px solid #E2E8F0',
                      background: followUpEntryForm.actionType === 'lost' ? 'rgba(239, 68, 68, 0.1)' : '#F8FAFC',
                      color: followUpEntryForm.actionType === 'lost' ? '#DC2626' : '#334155',
                      cursor: 'pointer',
                      fontWeight: 700,
                      fontSize: '11.5px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <ThumbsDown size={16} />
                    <span>❌ Not Interested</span>
                    <small style={{ fontSize: '9.5px', fontWeight: 500, opacity: 0.8 }}>Mark as Lost</small>
                  </button>
                </div>

                {/* Form Inputs Based on Chosen Action */}
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const act = followUpEntryForm.actionType;

                  if (act === 'completed') {
                    // Advances to INTERESTED, option to book appointment
                    updateLeadStatus(selectedLeadForFollowUp.id, 'Interested', 'interested');
                    addLeadFollowUp(selectedLeadForFollowUp.id, {
                      type: followUpEntryForm.type,
                      notes: followUpEntryForm.notes || 'Follow-up completed successfully. Customer confirmed interest!',
                      staffName: selectedLeadForFollowUp.assignedTo || 'Staff',
                      nextStage: 'interested',
                      nextStatus: 'Interested'
                    });

                    // Prompt to Book Appointment immediately
                    setSelectedLeadForBookApt(selectedLeadForFollowUp);
                    const foundService = (data.services || []).find(s => s.name === selectedLeadForFollowUp.interestedService);
                    setBookLeadAptForm({
                      serviceId: foundService ? foundService.id : 'srv_01',
                      serviceName: selectedLeadForFollowUp.interestedService || 'Signature Precision Haircut & Styling',
                      date: selectedLeadForFollowUp.preferredDate || new Date().toISOString().split('T')[0],
                      time: selectedLeadForFollowUp.preferredTime || '11:00 AM',
                      staffId: selectedLeadForFollowUp.assignedToId || 'stf_01',
                      staffName: selectedLeadForFollowUp.assignedTo || 'Maya Sharma',
                      duration: foundService ? foundService.duration : 45,
                      amount: foundService ? foundService.price : (selectedLeadForFollowUp.estimatedValue || 2500),
                      notes: ''
                    });
                    setSelectedLeadForFollowUp(null);

                  } else if (act === 'reschedule') {
                    // Rescheduled -> Follow-up Again
                    const nextTimeStr = `${followUpEntryForm.nextFollowUpDate || 'Tomorrow'} ${followUpEntryForm.nextFollowUpTime || '11:00 AM'}`;
                    updateLead(selectedLeadForFollowUp.id, {
                      nextFollowUp: nextTimeStr,
                      status: 'Follow-up Again',
                      stage: 'follow_up'
                    });
                    addLeadFollowUp(selectedLeadForFollowUp.id, {
                      type: followUpEntryForm.type,
                      notes: `Follow-up rescheduled by client request to: ${nextTimeStr}. Notes: ${followUpEntryForm.notes || 'Callback requested.'}`,
                      staffName: selectedLeadForFollowUp.assignedTo || 'Staff',
                      nextFollowUp: nextTimeStr,
                      nextStage: 'follow_up',
                      nextStatus: 'Follow-up Again'
                    });
                    setSelectedLeadForFollowUp(null);

                  } else if (act === 'no_response') {
                    // No Response -> Follow-up Again tomorrow
                    const tomorrow = new Date();
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    const tomorrowStr = tomorrow.toISOString().split('T')[0] + ' 11:00 AM';

                    updateLead(selectedLeadForFollowUp.id, {
                      nextFollowUp: tomorrowStr,
                      status: 'Follow-up Again',
                      stage: 'follow_up'
                    });
                    addLeadFollowUp(selectedLeadForFollowUp.id, {
                      type: followUpEntryForm.type,
                      notes: `No response / busy tone. Auto-scheduled next follow-up call attempt for tomorrow. ${followUpEntryForm.notes || ''}`,
                      staffName: selectedLeadForFollowUp.assignedTo || 'Staff',
                      nextFollowUp: tomorrowStr,
                      nextStage: 'follow_up',
                      nextStatus: 'Follow-up Again'
                    });
                    setSelectedLeadForFollowUp(null);

                  } else if (act === 'lost') {
                    // Mark as Lost / Not Interested
                    updateLead(selectedLeadForFollowUp.id, {
                      status: 'Not Interested',
                      stage: 'not_interested',
                      lostReason: followUpEntryForm.lostReason || 'Pricing too high'
                    });
                    addLeadFollowUp(selectedLeadForFollowUp.id, {
                      type: 'Lost Assessment',
                      notes: `Client not interested. Reason: ${followUpEntryForm.lostReason}. Notes: ${followUpEntryForm.notes || ''}`,
                      staffName: selectedLeadForFollowUp.assignedTo || 'Staff',
                      nextStage: 'not_interested',
                      nextStatus: 'Not Interested'
                    });
                    setSelectedLeadForFollowUp(null);
                  }
                }} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

                  {/* Channel Selection */}
                  <div className="form-group-looks-grid">
                    <div className="form-group-looks">
                      <label style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', marginBottom: '4px' }}>Communication Channel</label>
                      <select
                        className="looks-input"
                        value={followUpEntryForm.type}
                        onChange={(e) => setFollowUpEntryForm({ ...followUpEntryForm, type: e.target.value })}
                      >
                        <option value="Phone Call">📞 Phone Call</option>
                        <option value="WhatsApp">💬 WhatsApp Chat</option>
                        <option value="In-Person Visit">🏢 In-Person Visit</option>
                        <option value="Email">✉️ Email</option>
                      </select>
                    </div>

                    {/* Conditional: Reschedule Date & Time */}
                    {followUpEntryForm.actionType === 'reschedule' && (
                      <div className="form-group-looks">
                        <label style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', marginBottom: '4px' }}>New Follow-up Date *</label>
                        <input
                          type="date"
                          required
                          className="looks-input"
                          value={followUpEntryForm.nextFollowUpDate}
                          onChange={(e) => setFollowUpEntryForm({ ...followUpEntryForm, nextFollowUpDate: e.target.value })}
                        />
                      </div>
                    )}

                    {/* Conditional: Lost Reason */}
                    {followUpEntryForm.actionType === 'lost' && (
                      <div className="form-group-looks">
                        <label style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', marginBottom: '4px' }}>Reason for Lost / Decline *</label>
                        <select
                          className="looks-input"
                          value={followUpEntryForm.lostReason}
                          onChange={(e) => setFollowUpEntryForm({ ...followUpEntryForm, lostReason: e.target.value })}
                        >
                          <option value="Pricing too high / Out of budget">Pricing too high / Out of budget</option>
                          <option value="Location too far / Inconvenient">Location too far / Inconvenient</option>
                          <option value="Already booked with competitor">Already booked with competitor</option>
                          <option value="Preferred time slot unavailable">Preferred time slot unavailable</option>
                          <option value="Client changed mind / Postponed">Client changed mind / Postponed</option>
                          <option value="No response after multiple attempts">No response after multiple attempts</option>
                        </select>
                      </div>
                    )}
                  </div>

                  {/* Notes */}
                  <div className="form-group-looks">
                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', marginBottom: '4px' }}>Discussion Notes &amp; Client Feedback</label>
                    <textarea
                      className="looks-input"
                      style={{ minHeight: '60px', resize: 'vertical' }}
                      placeholder="Enter customer response, preferences or next action items..."
                      value={followUpEntryForm.notes}
                      onChange={(e) => setFollowUpEntryForm({ ...followUpEntryForm, notes: e.target.value })}
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn-gold-action"
                    style={{
                      alignSelf: 'flex-end',
                      padding: '9px 20px',
                      fontSize: '12.5px',
                      fontWeight: 700,
                      background: followUpEntryForm.actionType === 'completed' ? '#10B981' :
                        followUpEntryForm.actionType === 'lost' ? '#EF4444' : '#D97706',
                      borderColor: followUpEntryForm.actionType === 'completed' ? '#10B981' :
                        followUpEntryForm.actionType === 'lost' ? '#EF4444' : '#D97706',
                      color: '#FFFFFF'
                    }}
                  >
                    {followUpEntryForm.actionType === 'completed' ? '✓ Mark Interested & Proceed to Book' :
                      followUpEntryForm.actionType === 'reschedule' ? '📅 Save Rescheduled Follow-up' :
                      followUpEntryForm.actionType === 'no_response' ? '📞 Log Call Attempt & Follow-up Again' : '❌ Confirm Not Interested'}
                  </button>
                </form>
              </div>

              {/* Outreach Timeline & History */}
              <div>
                <h4 style={{ fontSize: '13.5px', fontWeight: 800, color: '#0F172A', margin: '0 0 10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Clock size={15} color="#64748B" /> Outreach Timeline &amp; History
                </h4>
                {(!selectedLeadForFollowUp.followUpHistory || selectedLeadForFollowUp.followUpHistory.length === 0) ? (
                  <div style={{ padding: '16px', textAlign: 'center', color: '#94A3B8', fontSize: '12px', background: '#F8FAFC', borderRadius: '8px', border: '1px dashed #CBD5E1' }}>
                    No prior follow-up logs recorded.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {selectedLeadForFollowUp.followUpHistory.map((item, idx) => (
                      <div key={item.id || idx} className="lead-history-timeline-item" style={{ background: '#F8FAFC', padding: '10px 14px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                          <span style={{ fontSize: '11px', fontWeight: 800, color: '#7C3AED', background: 'rgba(124, 58, 237, 0.08)', padding: '2px 7px', borderRadius: '4px' }}>
                            {item.type || 'Interaction'}
                          </span>
                          <span style={{ fontSize: '10.5px', color: '#64748B' }}>{item.date}</span>
                        </div>
                        <div style={{ fontSize: '12px', color: '#1E293B', lineHeight: '1.4' }}>{item.notes}</div>
                        {item.staffName && (
                          <div style={{ fontSize: '10.5px', color: '#64748B', marginTop: '3px' }}>Logged by: {item.staffName}</div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. MODAL: BOOK APPOINTMENT (APPOINTMENT DETAILS AS IN DIAGRAM) */}
      {/* ========================================================================= */}
      {selectedLeadForBookApt && (
        <div className="looks-modal-backdrop" onClick={() => setSelectedLeadForBookApt(null)}>
          <div className="looks-modal-window" style={{ maxWidth: '580px', width: '92%', borderRadius: '16px', overflow: 'hidden' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-top" style={{ padding: '18px 24px 14px', background: '#FFFFFF', borderBottom: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(124, 58, 237, 0.12)', color: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CalendarPlus size={22} strokeWidth={2.3} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 700, color: '#0F172A' }}>Book Appointment</h3>
                  <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#64748B' }}>
                    Confirm slot for: <strong style={{ color: '#0F172A' }}>{selectedLeadForBookApt.name}</strong> ({selectedLeadForBookApt.phone})
                  </p>
                </div>
              </div>
              <button className="btn-close-x" onClick={() => setSelectedLeadForBookApt(null)} style={{ fontSize: '20px', background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>×</button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              const aptId = bookLeadAppointment(selectedLeadForBookApt.id, {
                serviceId: bookLeadAptForm.serviceId,
                serviceName: bookLeadAptForm.serviceName,
                date: bookLeadAptForm.date,
                time: bookLeadAptForm.time,
                staffId: bookLeadAptForm.staffId,
                staffName: bookLeadAptForm.staffName,
                duration: bookLeadAptForm.duration,
                amount: bookLeadAptForm.amount,
                notes: bookLeadAptForm.notes
              });

              setSelectedLeadForBookApt(null);
            }} style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>

              {/* Service Selection */}
              <div className="form-group-looks">
                <label style={{ fontSize: '12.5px', fontWeight: 700, color: '#0F172A', marginBottom: '5px' }}>
                  • Service <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <select
                  className="looks-input"
                  value={bookLeadAptForm.serviceId}
                  onChange={(e) => {
                    const sid = e.target.value;
                    const found = (data.services || []).find(s => s.id === sid);
                    setBookLeadAptForm({
                      ...bookLeadAptForm,
                      serviceId: sid,
                      serviceName: found ? found.name : bookLeadAptForm.serviceName,
                      amount: found ? found.price : bookLeadAptForm.amount,
                      duration: found ? found.duration : bookLeadAptForm.duration
                    });
                  }}
                >
                  {(data.services || []).map(s => (
                    <option key={s.id} value={s.id}>{s.name} — ₹{s.price} ({s.duration} mins)</option>
                  ))}
                </select>
              </div>

              {/* Date & Time Slot Grid */}
              <div className="form-group-looks-grid">
                <div className="form-group-looks">
                  <label style={{ fontSize: '12.5px', fontWeight: 700, color: '#0F172A', marginBottom: '5px' }}>
                    • Date <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <input
                    type="date"
                    required
                    className="looks-input"
                    value={bookLeadAptForm.date}
                    onChange={(e) => setBookLeadAptForm({ ...bookLeadAptForm, date: e.target.value })}
                  />
                </div>
                <div className="form-group-looks">
                  <label style={{ fontSize: '12.5px', fontWeight: 700, color: '#0F172A', marginBottom: '5px' }}>
                    • Time <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <select
                    className="looks-input"
                    value={bookLeadAptForm.time}
                    onChange={(e) => setBookLeadAptForm({ ...bookLeadAptForm, time: e.target.value })}
                  >
                    {['10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM', '07:00 PM', '08:00 PM'].map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Staff Member */}
              <div className="form-group-looks">
                <label style={{ fontSize: '12.5px', fontWeight: 700, color: '#0F172A', marginBottom: '5px' }}>
                  • Staff (Performing Stylist) <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <select
                  className="looks-input"
                  value={bookLeadAptForm.staffId}
                  onChange={(e) => {
                    const stfid = e.target.value;
                    const found = (data.staff || []).find(st => st.id === stfid);
                    setBookLeadAptForm({
                      ...bookLeadAptForm,
                      staffId: stfid,
                      staffName: found ? found.name : bookLeadAptForm.staffName
                    });
                  }}
                >
                  {(data.staff || []).map(st => (
                    <option key={st.id} value={st.id}>{st.name} — {st.role} ({st.specialization || 'Master Stylist'})</option>
                  ))}
                </select>
              </div>

              {/* Notes */}
              <div className="form-group-looks">
                <label style={{ fontSize: '12.5px', fontWeight: 700, color: '#0F172A', marginBottom: '5px' }}>Special Instructions / Styling Notes</label>
                <input
                  type="text"
                  className="looks-input"
                  placeholder="e.g. Patch test completed, client requested balayage consultation"
                  value={bookLeadAptForm.notes}
                  onChange={(e) => setBookLeadAptForm({ ...bookLeadAptForm, notes: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setSelectedLeadForBookApt(null)}
                  style={{ flex: 1, padding: '10px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-gold-action"
                  style={{ flex: 1, padding: '10px', borderRadius: '8px', fontWeight: 700 }}
                >
                  ✓ Confirm Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. MODAL: VIP CUSTOMER PROFILE (MATCHING ALL 5 TABS IN DIAGRAM) */}
      {/* ========================================================================= */}
      {selectedCustomerForProfile && (
        <div className="looks-modal-backdrop" onClick={() => setSelectedCustomerForProfile(null)}>
          <div className="looks-modal-window" style={{ maxWidth: '780px', width: '94%', maxHeight: '90vh', overflowY: 'auto', borderRadius: '16px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-top" style={{ padding: '20px 24px 16px', background: '#FFFFFF', borderBottom: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg, #D4AF37 0%, #AA771C 100%)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 800 }}>
                  {(selectedCustomerForProfile.name || 'C').charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h3 style={{ margin: 0, fontSize: '19px', fontWeight: 800, color: '#0F172A' }}>{selectedCustomerForProfile.name}</h3>
                    <span style={{ padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 800, background: 'rgba(212, 175, 55, 0.15)', color: '#B45309', border: '1px solid rgba(212, 175, 55, 0.3)' }}>
                      👑 {selectedCustomerForProfile.tier || 'Diamond VIP'}
                    </span>
                  </div>
                  <p style={{ margin: '3px 0 0', fontSize: '12.5px', color: '#64748B' }}>
                    {selectedCustomerForProfile.phone} • {selectedCustomerForProfile.email || 'Verified Customer'} • Points: <strong>{selectedCustomerForProfile.loyaltyPoints || 350} pts</strong>
                  </p>
                </div>
              </div>
              <button className="btn-close-x" onClick={() => setSelectedCustomerForProfile(null)} style={{ fontSize: '22px', background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>×</button>
            </div>

            {/* 5 TABS AS SPECIFIED IN WORKFLOW DIAGRAM */}
            <div style={{ display: 'flex', borderBottom: '1px solid #E2E8F0', background: '#F8FAFC', padding: '0 24px', overflowX: 'auto' }}>
              {[
                { id: 'bookings', label: 'Booking History', icon: CalendarDays },
                { id: 'services', label: 'Service History', icon: Scissors },
                { id: 'payments', label: 'Payment History', icon: CreditCard },
                { id: 'preferences', label: 'Preferences', icon: Heart },
                { id: 'future_apts', label: 'Future Appointments', icon: Clock }
              ].map(tab => {
                const TabIcon = tab.icon;
                const isActive = customerProfileTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setCustomerProfileTab(tab.id)}
                    style={{
                      padding: '12px 16px',
                      background: 'none',
                      border: 'none',
                      borderBottom: isActive ? '3px solid #D4AF37' : '3px solid transparent',
                      color: isActive ? '#0F172A' : '#64748B',
                      fontWeight: isActive ? 800 : 600,
                      fontSize: '12.5px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    <TabIcon size={14} color={isActive ? '#D4AF37' : '#94A3B8'} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* TAB CONTENTS */}
            <div style={{ padding: '20px 24px' }}>
              {/* TAB 1: BOOKING HISTORY */}
              {customerProfileTab === 'bookings' && (
                <div>
                  <h4 style={{ margin: '0 0 12px', fontSize: '14px', fontWeight: 800, color: '#0F172A' }}>Past Salon Visits &amp; Booking Records</h4>
                  {(() => {
                    const custPhone = selectedCustomerForProfile.phone;
                    const custApts = (data.appointments || []).filter(a => a.customerPhone === custPhone || a.customerId === selectedCustomerForProfile.id || a.customerName === selectedCustomerForProfile.name);

                    if (custApts.length === 0) {
                      return (
                        <div style={{ padding: '30px', textAlign: 'center', background: '#F8FAFC', borderRadius: '10px', color: '#64748B', fontSize: '13px' }}>
                          No previous bookings found. Newly converted profile.
                        </div>
                      );
                    }

                    return (
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                        <thead>
                          <tr style={{ background: '#F1F5F9', borderBottom: '1px solid #E2E8F0' }}>
                            <th style={{ padding: '8px 10px', textAlign: 'left' }}>Date &amp; Time</th>
                            <th style={{ padding: '8px 10px', textAlign: 'left' }}>Service</th>
                            <th style={{ padding: '8px 10px', textAlign: 'left' }}>Stylist</th>
                            <th style={{ padding: '8px 10px', textAlign: 'right' }}>Amount</th>
                            <th style={{ padding: '8px 10px', textAlign: 'center' }}>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {custApts.map(a => (
                            <tr key={a.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                              <td style={{ padding: '10px' }}><strong>{a.date}</strong> at {a.time}</td>
                              <td style={{ padding: '10px' }}>{a.serviceName}</td>
                              <td style={{ padding: '10px' }}>👤 {a.staffName}</td>
                              <td style={{ padding: '10px', textAlign: 'right', fontWeight: 700 }}>₹{(a.finalAmount || a.amount || 2500).toLocaleString()}</td>
                              <td style={{ padding: '10px', textAlign: 'center' }}>
                                <span style={{ padding: '2px 8px', borderRadius: '6px', fontSize: '10.5px', fontWeight: 700, background: 'rgba(16, 185, 129, 0.1)', color: '#10B981' }}>
                                  {a.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    );
                  })()}
                </div>
              )}

              {/* TAB 2: SERVICE HISTORY */}
              {customerProfileTab === 'services' && (
                <div>
                  <h4 style={{ margin: '0 0 12px', fontSize: '14px', fontWeight: 800, color: '#0F172A' }}>Service History &amp; Treatments Done</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ background: '#F8FAFC', padding: '14px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <strong style={{ fontSize: '13px', color: '#0F172A' }}>{selectedCustomerForProfile.preferences?.preferredService || selectedCustomerForProfile.interestedService || 'Signature Precision Haircut & Styling'}</strong>
                        <span style={{ fontSize: '11px', color: '#64748B' }}>Primary Ritual</span>
                      </div>
                      <p style={{ margin: '6px 0 0', fontSize: '12px', color: '#475569' }}>
                        Stylist: <strong>{selectedCustomerForProfile.preferences?.preferredStylist || 'Maya Sharma'}</strong> • Treatment Notes: Ammonia-free color applied, keratin hair mask ritual performed.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: PAYMENT HISTORY */}
              {customerProfileTab === 'payments' && (
                <div>
                  <h4 style={{ margin: '0 0 12px', fontSize: '14px', fontWeight: 800, color: '#0F172A' }}>Payment &amp; Invoice History</h4>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                    <thead>
                      <tr style={{ background: '#F1F5F9', borderBottom: '1px solid #E2E8F0' }}>
                        <th style={{ padding: '8px 10px', textAlign: 'left' }}>Receipt / Invoice</th>
                        <th style={{ padding: '8px 10px', textAlign: 'left' }}>Date</th>
                        <th style={{ padding: '8px 10px', textAlign: 'left' }}>Payment Mode</th>
                        <th style={{ padding: '8px 10px', textAlign: 'right' }}>Total Paid</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                        <td style={{ padding: '10px', fontWeight: 700, color: '#7C3AED' }}>INV-2026-9042</td>
                        <td style={{ padding: '10px' }}>{new Date().toISOString().split('T')[0]}</td>
                        <td style={{ padding: '10px' }}>UPI (Google Pay / PhonePe)</td>
                        <td style={{ padding: '10px', textAlign: 'right', fontWeight: 800, color: '#0D9488' }}>
                          ₹{(selectedCustomerForProfile.totalSpend || 2500).toLocaleString()}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

              {/* TAB 4: PREFERENCES */}
              {customerProfileTab === 'preferences' && (
                <div>
                  <h4 style={{ margin: '0 0 12px', fontSize: '14px', fontWeight: 800, color: '#0F172A' }}>Client Preferences &amp; Personalization</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
                    <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                      <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>Preferred Stylist</span>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', marginTop: '3px' }}>
                        👤 {selectedCustomerForProfile.preferences?.preferredStylist || 'Maya Sharma'}
                      </div>
                    </div>
                    <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                      <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>Favorite Beverage</span>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', marginTop: '3px' }}>
                        ☕ {selectedCustomerForProfile.preferences?.beverage || 'Green Tea with Honey'}
                      </div>
                    </div>
                    <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                      <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>Hair &amp; Skin Profile</span>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', marginTop: '3px' }}>
                        ✨ {selectedCustomerForProfile.preferences?.skinHairType || 'Color-Treated, Normal to Sensitive'}
                      </div>
                    </div>
                  </div>
                  <div style={{ marginTop: '12px', background: '#FFFBEB', padding: '12px', borderRadius: '8px', border: '1px solid #FDE68A' }}>
                    <strong style={{ fontSize: '12px', color: '#92400E' }}>Client Notes:</strong>
                    <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#78350F' }}>
                      {selectedCustomerForProfile.preferences?.notes || selectedCustomerForProfile.notes || 'Prefers organic ammonial-free products and relaxing scalp massage.'}
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 5: FUTURE APPOINTMENTS */}
              {customerProfileTab === 'future_apts' && (
                <div>
                  <h4 style={{ margin: '0 0 12px', fontSize: '14px', fontWeight: 800, color: '#0F172A' }}>Upcoming Scheduled Appointments</h4>
                  {(() => {
                    const todayStr = new Date().toISOString().split('T')[0];
                    const custPhone = selectedCustomerForProfile.phone;
                    const futureApts = (data.appointments || []).filter(a =>
                      (a.customerPhone === custPhone || a.customerId === selectedCustomerForProfile.id || a.customerName === selectedCustomerForProfile.name) &&
                      a.date >= todayStr && a.status !== 'Completed' && a.status !== 'Cancelled'
                    );

                    if (futureApts.length === 0) {
                      return (
                        <div style={{ padding: '30px', textAlign: 'center', background: '#F8FAFC', borderRadius: '10px', color: '#64748B', fontSize: '13px' }}>
                          No upcoming appointments currently scheduled.
                        </div>
                      );
                    }

                    return (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {futureApts.map(fa => (
                          <div key={fa.id} style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', padding: '14px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                              <strong style={{ fontSize: '13.5px', color: '#166534' }}>{fa.serviceName}</strong>
                              <div style={{ fontSize: '12px', color: '#15803D', marginTop: '2px' }}>
                                📅 {fa.date} at {fa.time} • Stylist: {fa.staffName}
                              </div>
                            </div>
                            <span style={{ padding: '3px 10px', borderRadius: '10px', fontSize: '11px', fontWeight: 800, background: '#16A34A', color: '#FFFFFF' }}>
                              Confirmed
                            </span>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>

            <div style={{ padding: '14px 24px', background: '#F8FAFC', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                className="btn-gold-action"
                onClick={() => setSelectedCustomerForProfile(null)}
                style={{ padding: '8px 20px', fontSize: '12.5px' }}
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Modal: Add Service */}
      {showAddServiceModal && (
        <div className="looks-modal-backdrop" onClick={() => setShowAddServiceModal(false)}>
          <div className="looks-modal-window" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '540px', width: '92%', borderRadius: '16px', overflow: 'hidden' }}>
            <div className="modal-top" style={{ padding: '18px 24px 14px 24px', background: '#FFFFFF', borderBottom: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(13, 148, 136, 0.12)', color: '#0D9488', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Scissors size={22} strokeWidth={2.3} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#0F172A' }}>Add Service</h3>
                  <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#64748B' }}>Add a new salon treatment, duration, pricing &amp; incentive rule.</p>
                </div>
              </div>
              <button className="btn-close-x" onClick={() => setShowAddServiceModal(false)} style={{ fontSize: '22px', background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>×</button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              addServiceItem(newService);
              setShowAddServiceModal(false);
              setNewService({
                name: '',
                categoryId: 'hair',
                gender: 'unisex',
                duration: 30,
                price: 100,
                productsCount: '1 product',
                incentiveRule: '20%',
                status: 'Active',
                description: ''
              });
            }} style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="form-group-looks">
                <label style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px', borderRadius: '5px', background: 'rgba(13, 148, 136, 0.12)', color: '#0D9488' }}>
                    <Scissors size={12} strokeWidth={2.5} />
                  </span>
                  <span>Service Name</span> <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  className="looks-input"
                  placeholder="e.g. Hair Cutting"
                  value={newService.name}
                  onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                />
              </div>

              <div className="form-group-looks-grid">
                <div className="form-group-looks">
                  <label style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px', borderRadius: '5px', background: 'rgba(2, 132, 199, 0.12)', color: '#0284C7' }}>
                      <Tag size={12} strokeWidth={2.5} />
                    </span>
                    <span>Category</span>
                  </label>
                  <select className="looks-input" value={newService.categoryId} onChange={(e) => setNewService({ ...newService, categoryId: e.target.value })}>
                    <option value="hair">Hair</option>
                    <option value="grooming">Grooming</option>
                    <option value="beauty">Beauty</option>
                    <option value="spa & skin">Spa & Skin</option>
                    <option value="nails & styling">Nails & Styling</option>
                  </select>
                </div>
                <div className="form-group-looks">
                  <label style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px', borderRadius: '5px', background: 'rgba(217, 119, 6, 0.12)', color: '#D97706' }}>
                      <IndianRupee size={12} strokeWidth={2.5} />
                    </span>
                    <span>Price (₹)</span> <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <input
                    type="number"
                    required
                    className="looks-input"
                    placeholder="100"
                    value={newService.price}
                    onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group-looks-grid">
                <div className="form-group-looks">
                  <label style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px', borderRadius: '5px', background: 'rgba(79, 70, 229, 0.12)', color: '#4F46E5' }}>
                      <Clock size={12} strokeWidth={2.5} />
                    </span>
                    <span>Duration (mins)</span>
                  </label>
                  <input
                    type="number"
                    className="looks-input"
                    placeholder="30"
                    value={newService.duration}
                    onChange={(e) => setNewService({ ...newService, duration: e.target.value })}
                  />
                </div>
                <div className="form-group-looks">
                  <label style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px', borderRadius: '5px', background: 'rgba(219, 39, 119, 0.12)', color: '#DB2777' }}>
                      <Percent size={12} strokeWidth={2.5} />
                    </span>
                    <span>Employee Incentive (%)</span>
                  </label>
                  <input
                    type="text"
                    className="looks-input"
                    value={newService.incentiveRule}
                    onChange={(e) => setNewService({ ...newService, incentiveRule: e.target.value })}
                    placeholder="e.g. 20%"
                  />
                </div>
              </div>

              <div className="form-group-looks">
                <label style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px', borderRadius: '5px', background: 'rgba(22, 163, 74, 0.12)', color: '#16A34A' }}>
                    <CheckCircle2 size={12} strokeWidth={2.5} />
                  </span>
                  <span>Status</span>
                </label>
                <select
                  className="looks-input"
                  value={newService.status || 'Active'}
                  onChange={(e) => setNewService({ ...newService, status: e.target.value })}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <button type="submit" className="btn-gold-action" style={{ width: '100%', marginTop: '6px' }}>
                Add Service
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 3. Modal: Add Product */}
      {/* 3. Modal: Add Product */}
      {showAddProductModal && (
        <div className="looks-modal-backdrop" onClick={() => setShowAddProductModal(false)}>
          <div className="looks-modal-window" style={{ maxWidth: '680px', width: '92%', margin: 'auto', padding: 0, borderRadius: '16px', overflow: 'hidden', display: 'flex', flexDirection: 'column', maxHeight: '88vh', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-top" style={{ padding: '18px 24px 14px 24px', background: '#FFFFFF', borderRadius: '16px 16px 0 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E5E7EB' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ color: '#0D9488', display: 'flex', alignItems: 'center' }}>
                  <Package size={26} strokeWidth={2.5} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '18px', color: '#111827', fontWeight: 700 }}>{newProd.id ? 'Edit Product' : 'Add Product'}</h3>
                  <p style={{ margin: '2px 0 0 0', fontSize: '12.5px', color: '#6B7280' }}>Manage salon products and inventory stock.</p>
                </div>
              </div>
              <button className="btn-close-x" onClick={() => setShowAddProductModal(false)} style={{ color: '#6B7280', fontSize: '22px', background: 'none', border: 'none', cursor: 'pointer', lineHeight: 1 }}>×</button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              {
                const qtyVal = parseInt(newProd.stock) || parseInt(newProd.unitQuantity) || 1;
                const unitCostVal = parseFloat(newProd.unitCost || 0);
                const totalCostVal = newProd.totalCost !== undefined && newProd.totalCost !== ''
                  ? parseFloat(newProd.totalCost)
                  : (qtyVal * unitCostVal);

                const prodPayload = {
                  name: newProd.name,
                  category: newProd.category,
                  brand: newProd.brand,
                  unitQuantity: newProd.unitQuantity || '',
                  unit: newProd.unit || 'Bottles',
                  unitCost: unitCostVal,
                  totalCost: totalCostVal,
                  stock: qtyVal,
                  minStockAlert: parseInt(newProd.alert || 5),
                  supplier: newProd.supplier || '',
                  sku: newProd.sku || '',
                  expiryDate: newProd.expiryDate || '',
                  gst: newProd.gst || '',
                  discount: newProd.discount || '',
                  description: newProd.description || '',
                  imageUrl: newProd.imageUrl
                };

                if (newProd.id) {
                  updateProduct(newProd.id, prodPayload);
                } else {
                  addProduct(prodPayload);
                }

                setShowAddProductModal(false);
                setNewProd({
                  id: null,
                  name: '',
                  category: 'Hair Care',
                  brand: "L'Oréal",
                  unitQuantity: '',
                  unit: 'Bottles',
                  unitCost: '',
                  totalCost: '',
                  stock: '',
                  alert: 5,
                  supplier: '',
                  sku: '',
                  expiryDate: '',
                  gst: '',
                  discount: '',
                  description: '',
                  imageFile: null,
                  imageUrl: null
                });
              }
            }} style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <div style={{ padding: '20px 24px', background: '#FFFFFF', display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '66vh', overflowY: 'auto' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px 16px' }}>

                  {/* Row 1: Product Name (Full Width) */}
                  <div className="form-group-looks" style={{ gridColumn: '1 / 3' }}>
                    <label style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px', borderRadius: '5px', background: 'rgba(13, 148, 136, 0.12)', color: '#0D9488' }}>
                        <Package size={12} strokeWidth={2.5} />
                      </span>
                      <span>Product Name</span> <span style={{ color: '#EF4444' }}>*</span>
                    </label>
                    <input type="text" required className="looks-input" placeholder="Enter product name (e.g. L'Oréal Shampoo)" value={newProd.name} onChange={(e) => setNewProd({ ...newProd, name: e.target.value })} style={{ background: '#FFFFFF', border: '1px solid #CBD5E1' }} />
                  </div>

                  {/* Row 2: Category & Brand */}
                  <div className="form-group-looks">
                    <label style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px', borderRadius: '5px', background: 'rgba(2, 132, 199, 0.12)', color: '#0284C7' }}>
                        <Tag size={12} strokeWidth={2.5} />
                      </span>
                      <span>Category</span> <span style={{ color: '#EF4444' }}>*</span>
                    </label>
                    <select className="looks-input" value={newProd.category} onChange={(e) => setNewProd({ ...newProd, category: e.target.value })} style={{ background: '#FFFFFF', border: '1px solid #CBD5E1' }}>
                      <option value="">Select category</option>
                      <option value="Hair Care">Hair Care</option>
                      <option value="Skincare">Skincare</option>
                      <option value="Treatments">Treatments</option>
                      <option value="Colorants">Colorants</option>
                      <option value="Hair Styling">Hair Styling</option>
                      <option value="Nails">Nails</option>
                      <option value="Men Grooming">Men Grooming</option>
                    </select>
                  </div>
                  <div className="form-group-looks">
                    <label style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px', borderRadius: '5px', background: 'rgba(124, 58, 237, 0.12)', color: '#7C3AED' }}>
                        <Building2 size={12} strokeWidth={2.5} />
                      </span>
                      <span>Brand</span>
                    </label>
                    <input type="text" className="looks-input" placeholder="Enter brand name" value={newProd.brand} onChange={(e) => setNewProd({ ...newProd, brand: e.target.value })} style={{ background: '#FFFFFF', border: '1px solid #CBD5E1' }} />
                  </div>

                  {/* Row 3: Unit Quantity & Packaging Unit */}
                  <div className="form-group-looks">
                    <label style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px', borderRadius: '5px', background: 'rgba(13, 148, 136, 0.12)', color: '#0D9488' }}>
                        <Package size={12} strokeWidth={2.5} />
                      </span>
                      <span>Unit Quantity</span> <span style={{ color: '#EF4444' }}>*</span>
                    </label>
                    <input
                      type="text"
                      required
                      className="looks-input"
                      placeholder="Enter unit quantity"
                      value={newProd.unitQuantity}
                      onChange={(e) => {
                        const val = e.target.value;
                        const numVal = parseFloat(val);
                        const unitCostVal = parseFloat(newProd.unitCost) || 0;
                        const qty = !isNaN(numVal) && numVal > 0 ? numVal : (parseFloat(newProd.stock) || 0);
                        const autoTotal = qty > 0 && unitCostVal > 0 ? (qty * unitCostVal) : (newProd.totalCost || '');
                        setNewProd({
                          ...newProd,
                          unitQuantity: val,
                          stock: !isNaN(numVal) && numVal > 0 ? numVal : newProd.stock,
                          totalCost: autoTotal
                        });
                      }}
                      style={{ background: '#FFFFFF', border: '1px solid #CBD5E1' }}
                    />
                  </div>
                  <div className="form-group-looks">
                    <label style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px', borderRadius: '5px', background: 'rgba(100, 116, 139, 0.12)', color: '#64748B' }}>
                        <Layers size={12} strokeWidth={2.5} />
                      </span>
                      <span>Packaging Unit</span>
                    </label>
                    <select
                      className="looks-input"
                      value={newProd.unit || 'Bottles'}
                      onChange={(e) => setNewProd({ ...newProd, unit: e.target.value })}
                      style={{ background: '#FFFFFF', border: '1px solid #CBD5E1' }}
                    >
                      <option value="Bottles">Bottles</option>
                      <option value="Tubes">Tubes</option>
                      <option value="Pieces">Pieces</option>
                      <option value="Jars">Jars</option>
                      <option value="Packs">Packs</option>
                      <option value="Kits">Kits</option>
                    </select>
                  </div>

                  {/* Row 4: Unit Cost & Total Cost */}
                  <div className="form-group-looks">
                    <label style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px', borderRadius: '5px', background: 'rgba(217, 119, 6, 0.12)', color: '#D97706' }}>
                        <IndianRupee size={12} strokeWidth={2.5} />
                      </span>
                      <span>Unit Cost (₹)</span> <span style={{ color: '#EF4444' }}>*</span>
                    </label>
                    <input
                      type="number"
                      required
                      className="looks-input"
                      placeholder="Enter unit cost"
                      value={newProd.unitCost}
                      onChange={(e) => {
                        const cost = e.target.value;
                        const costVal = parseFloat(cost) || 0;
                        const qtyVal = parseFloat(newProd.unitQuantity) || parseFloat(newProd.stock) || 1;
                        const autoTotal = costVal > 0 ? (costVal * qtyVal) : '';
                        setNewProd({
                          ...newProd,
                          unitCost: cost,
                          stock: (newProd.stock === '' || !newProd.stock) && !isNaN(parseFloat(newProd.unitQuantity)) ? parseFloat(newProd.unitQuantity) : newProd.stock,
                          totalCost: autoTotal
                        });
                      }}
                      style={{ background: '#FFFFFF', border: '1px solid #CBD5E1' }}
                    />
                  </div>
                  <div className="form-group-looks">
                    <label style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px', borderRadius: '5px', background: 'rgba(22, 163, 74, 0.12)', color: '#16A34A' }}>
                        <IndianRupee size={12} strokeWidth={2.5} />
                      </span>
                      <span>Total Cost (₹)</span> <span style={{ color: '#EF4444' }}>*</span>
                    </label>
                    <input
                      type="number"
                      required
                      className="looks-input"
                      placeholder="Enter total cost"
                      value={newProd.totalCost !== undefined ? newProd.totalCost : ''}
                      onChange={(e) => setNewProd({ ...newProd, totalCost: e.target.value })}
                      style={{ background: '#FFFFFF', border: '1px solid #CBD5E1' }}
                    />
                  </div>

                  {/* Row 5: Current Stock & Min Stock Alert */}
                  <div className="form-group-looks">
                    <label style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px', borderRadius: '5px', background: 'rgba(16, 185, 129, 0.12)', color: '#10B981' }}>
                        <Layers size={12} strokeWidth={2.5} />
                      </span>
                      <span>Current Stock</span> <span style={{ color: '#EF4444' }}>*</span>
                    </label>
                    <input
                      type="number"
                      required
                      className="looks-input"
                      placeholder="Enter current stock"
                      value={newProd.stock}
                      onChange={(e) => {
                        const st = e.target.value;
                        const stVal = parseFloat(st) || 0;
                        const costVal = parseFloat(newProd.unitCost) || 0;
                        const autoTotal = stVal > 0 && costVal > 0 ? (costVal * stVal) : (costVal > 0 ? costVal : '');
                        setNewProd({ ...newProd, stock: st, totalCost: autoTotal });
                      }}
                      style={{ background: '#FFFFFF', border: '1px solid #CBD5E1' }}
                    />
                  </div>
                  <div className="form-group-looks">
                    <label style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px', borderRadius: '5px', background: 'rgba(239, 68, 68, 0.12)', color: '#EF4444' }}>
                        <AlertTriangle size={12} strokeWidth={2.5} />
                      </span>
                      <span>Min Stock Alert</span> <span style={{ color: '#EF4444' }}>*</span>
                    </label>
                    <input type="number" required className="looks-input" placeholder="Enter minimum stock level" value={newProd.alert} onChange={(e) => setNewProd({ ...newProd, alert: e.target.value })} style={{ background: '#FFFFFF', border: '1px solid #CBD5E1' }} />
                  </div>

                  {/* Row 6: SKU & Supplier */}
                  <div className="form-group-looks">
                    <label style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px', borderRadius: '5px', background: 'rgba(71, 85, 105, 0.12)', color: '#475569' }}>
                        <Barcode size={12} strokeWidth={2.5} />
                      </span>
                      <span>Product ID / SKU</span>
                    </label>
                    <input
                      type="text"
                      className="looks-input"
                      placeholder="Auto / Enter SKU"
                      value={newProd.sku || ''}
                      onChange={(e) => setNewProd({ ...newProd, sku: e.target.value })}
                      style={{ background: '#FFFFFF', border: '1px solid #CBD5E1' }}
                    />
                  </div>
                  <div className="form-group-looks">
                    <label style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', marginBottom: '6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px', borderRadius: '5px', background: 'rgba(79, 70, 229, 0.12)', color: '#4F46E5' }}>
                          <Truck size={12} strokeWidth={2.5} />
                        </span>
                        <span>Supplier Name</span>
                      </span>
                      <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 500 }}>Select or type manual</span>
                    </label>
                    <input
                      type="text"
                      list="salon-supplier-datalist"
                      className="looks-input"
                      placeholder="Choose from list or type supplier name..."
                      value={newProd.supplier || ''}
                      onChange={(e) => setNewProd({ ...newProd, supplier: e.target.value })}
                      style={{ background: '#FFFFFF', border: '1px solid #CBD5E1' }}
                    />
                    <datalist id="salon-supplier-datalist">
                      {Array.from(new Set([
                        ...(data.suppliers || []).map(s => s.name),
                        ...(data.inventory || []).map(p => p.supplier).filter(Boolean),
                        "L'Oréal Professional India",
                        "Beauty Care Logistics Ltd",
                        "Moroccanoil Direct",
                        "Schwarzkopf Pro Hub",
                        "Forest Essentials Ayurveda",
                        "Gentleman Co. Grooming",
                        "Wella Professionals Hub",
                        "Matrix Salon Care Hub",
                        "Kérastase Official India",
                        "Dyson Professional India"
                      ])).map((supName, idx) => (
                        <option key={idx} value={supName}>{supName}</option>
                      ))}
                    </datalist>
                  </div>
                  <div className="form-group-looks">
                    <label style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px', borderRadius: '5px', background: 'rgba(37, 99, 235, 0.12)', color: '#2563EB' }}>
                        <CalendarDays size={12} strokeWidth={2.5} />
                      </span>
                      <span>Expiry Date</span>
                    </label>
                    <div style={{ position: 'relative' }}>
                      <CalendarDays size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '10px' }} />
                      <input
                        type="date"
                        className="looks-input"
                        value={newProd.expiryDate || ''}
                        onChange={(e) => setNewProd({ ...newProd, expiryDate: e.target.value })}
                        style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', paddingLeft: '38px' }}
                      />
                    </div>
                  </div>

                  {/* Row 7: GST (%) & Discount (%) */}
                  <div className="form-group-looks">
                    <label style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px', borderRadius: '5px', background: 'rgba(217, 119, 6, 0.12)', color: '#D97706' }}>
                        <Percent size={12} strokeWidth={2.5} />
                      </span>
                      <span>GST (%)</span>
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="text"
                        className="looks-input"
                        placeholder="e.g. 18"
                        value={newProd.gst || ''}
                        onChange={(e) => {
                          const raw = e.target.value.replace(/%/g, '').trim();
                          setNewProd({ ...newProd, gst: raw ? `${raw}%` : '' });
                        }}
                        style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', paddingRight: '36px' }}
                      />
                      <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', fontWeight: 700, fontSize: '13px', color: '#64748B', pointerEvents: 'none' }}>
                        %
                      </span>
                    </div>
                  </div>
                  <div className="form-group-looks">
                    <label style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px', borderRadius: '5px', background: 'rgba(219, 39, 119, 0.12)', color: '#DB2777' }}>
                        <Percent size={12} strokeWidth={2.5} />
                      </span>
                      <span>Discount (%)</span>
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="text"
                        className="looks-input"
                        placeholder="e.g. 10"
                        value={newProd.discount || ''}
                        onChange={(e) => {
                          const raw = e.target.value.replace(/%/g, '').trim();
                          setNewProd({ ...newProd, discount: raw ? `${raw}%` : '' });
                        }}
                        style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', paddingRight: '36px' }}
                      />
                      <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', fontWeight: 700, fontSize: '13px', color: '#64748B', pointerEvents: 'none' }}>
                        %
                      </span>
                    </div>
                  </div>

                  {/* Row 8: Product Image Upload with Small Card Preview */}
                  <div className="form-group-looks" style={{ gridColumn: '1 / 3', background: '#F8FAFC', padding: '12px 14px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                    <label style={{ margin: '0 0 8px 0', fontSize: '13px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', color: '#0F172A' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(13, 148, 136, 0.12)', color: '#0D9488' }}>
                        <Package size={13} color="#0D9488" />
                      </span>
                      <span>Product Image</span>
                    </label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px' }}>
                      <label style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        padding: '8px 16px',
                        background: '#0D9488',
                        color: '#FFFFFF',
                        borderRadius: '8px',
                        fontWeight: 600,
                        fontSize: '13px',
                        cursor: 'pointer',
                        border: 'none',
                        transition: 'all 0.2s ease',
                        boxShadow: '0 2px 4px rgba(13, 148, 136, 0.2)',
                        userSelect: 'none'
                      }}>
                        <UploadCloud size={16} color="#FFFFFF" />
                        <span>Upload File</span>
                        <input
                          type="file"
                          accept="image/png, image/jpeg, image/webp"
                          style={{ display: 'none' }}
                          onChange={(e) => {
                            if (e.target.files && e.target.files.length > 0) {
                              const file = e.target.files[0];
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setNewProd(prev => ({ ...prev, imageFile: file, imageUrl: reader.result }));
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>

                      {/* Small Card for Uploaded Photo */}
                      {newProd.imageUrl ? (
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          background: '#FFFFFF',
                          border: '1px solid #CBD5E1',
                          borderRadius: '8px',
                          padding: '6px 10px',
                          boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
                        }}>
                          <img
                            src={newProd.imageUrl}
                            alt="preview"
                            style={{ width: '38px', height: '38px', borderRadius: '6px', objectFit: 'cover', border: '1px solid #E2E8F0' }}
                          />
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#1E293B', maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {newProd.imageFile?.name || 'product_img.jpg'}
                            </span>
                            <span style={{ fontSize: '11px', color: '#10B981', display: 'flex', alignItems: 'center', gap: '3px', fontWeight: 500 }}>
                              <CheckCircle2 size={11} color="#10B981" /> Uploaded
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setNewProd({ ...newProd, imageFile: null, imageUrl: null });
                            }}
                            style={{
                              background: '#FEE2E2',
                              border: 'none',
                              borderRadius: '6px',
                              width: '24px',
                              height: '24px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              color: '#EF4444',
                              marginLeft: '4px'
                            }}
                            title="Remove image"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      ) : (
                        <span style={{ fontSize: '12px', color: '#94A3B8' }}>No image chosen</span>
                      )}
                    </div>
                  </div>

                  {/* Row 9: Product Description (Full Width) */}
                  <div className="form-group-looks" style={{ gridColumn: '1 / 3' }}>
                    <label style={{ margin: '0 0 6px 0', fontSize: '13px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', color: '#0F172A' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px', borderRadius: '5px', background: 'rgba(71, 85, 105, 0.12)', color: '#475569' }}>
                        <FileText size={12} strokeWidth={2.5} />
                      </span>
                      <span>Product Description</span>
                    </label>
                    <input
                      type="text"
                      className="looks-input"
                      placeholder="Enter product description (optional)"
                      value={newProd.description || ''}
                      onChange={(e) => setNewProd({ ...newProd, description: e.target.value })}
                      style={{ background: '#FFFFFF', border: '1px solid #CBD5E1' }}
                    />
                  </div>
                </div>
              </div>

              <div style={{ padding: '14px 24px', borderTop: '1px solid #E5E7EB', display: 'flex', justifyContent: 'flex-end', gap: '12px', background: '#F8FAFC', borderRadius: '0 0 16px 16px' }}>
                <button type="button" onClick={() => {
                  setNewProd({ id: null, name: '', category: 'Hair Care', brand: "L'Oréal", unitQuantity: '', unit: 'Bottles', unitCost: '', totalCost: '', stock: '', alert: 5, supplier: '', sku: '', expiryDate: '', gst: '', discount: '', description: '', imageFile: null, imageUrl: null });
                  setShowAddProductModal(false);
                }} style={{ padding: '8px 20px', borderRadius: '8px', border: '1px solid #CBD5E1', background: '#FFFFFF', color: '#475569', fontWeight: 600, fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <RefreshCw size={14} /> Reset
                </button>
                <button type="submit" style={{ background: '#0D9488', padding: '8px 22px', borderRadius: '8px', color: '#FFFFFF', border: 'none', fontWeight: 600, fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 2px 4px rgba(13, 148, 136, 0.25)' }}>
                  <Plus size={15} /> {newProd.id ? 'Save Changes' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Modal: Add Employee */}
      {showAddStaffModal && (
        <div className="looks-modal-backdrop" onClick={() => setShowAddStaffModal(false)}>
          <div className="looks-modal-window" style={{ maxWidth: '760px', width: '92%', margin: 'auto', padding: 0, borderRadius: '16px', overflow: 'hidden', display: 'flex', flexDirection: 'column', maxHeight: '90vh', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }} onClick={(e) => e.stopPropagation()}>

            {/* Modal Top Header */}
            <div className="modal-top" style={{ padding: '18px 26px 14px 26px', background: '#FFFFFF', borderRadius: '16px 16px 0 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E5E7EB' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#CCFBF1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0D9488', flexShrink: 0 }}>
                  <UserPlus size={22} strokeWidth={2.2} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '19px', color: '#0F172A', fontWeight: 800 }}>Add Employee</h3>
                  <p style={{ margin: '2px 0 0 0', fontSize: '13px', color: '#64748B' }}>Manage employee details, role and professional information.</p>
                </div>
              </div>
              <button className="btn-close-x" onClick={() => setShowAddStaffModal(false)} style={{ color: '#64748B', fontSize: '22px', background: 'none', border: 'none', cursor: 'pointer', lineHeight: 1 }}>×</button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              const cleanPhone = (newStaff.phone || '').replace(/\D/g, '');
              if (cleanPhone.length !== 10) {
                showToast("⚠️ Please enter a valid 10-digit mobile number.");
                return;
              }
              addStaff({
                ...newStaff,
                phone: `+91 ${cleanPhone}`,
                commissionRate: parseFloat(newStaff.commissionRate) || 12,
                servicesCount: parseInt(newStaff.servicesCount) || 10
              });
              setNewStaff({
                name: '',
                employeeId: '',
                phone: '',
                email: '',
                dob: '',
                gender: 'Male',
                role: '',
                specialization: '',
                joiningDate: '',
                employmentType: 'Full Time',
                salary: '',
                address: '',
                city: '',
                imageFile: null,
                imageUrl: null,
                notes: '',
                commissionRate: 12,
                servicesCount: 12
              });
              setShowAddStaffModal(false);
            }} style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

              <div style={{ padding: '22px 26px', background: '#FFFFFF', display: 'flex', flexDirection: 'column', gap: '18px', maxHeight: '68vh', overflowY: 'auto' }}>

                {/* 1. PERSONAL DETAILS */}
                <div>
                  <div style={{ paddingBottom: '8px', borderBottom: '1px solid #F1F5F9', marginBottom: '14px' }}>
                    <h4 style={{ margin: 0, fontSize: '13.5px', fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#7C3AED' }}></span>
                      Personal Details
                    </h4>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px 18px' }}>
                    {/* Employee Name with Auto Employee ID Generation */}
                    <div className="form-group-looks">
                      <label style={{ fontSize: '13px', fontWeight: 700, color: '#1E293B', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px', borderRadius: '5px', background: 'rgba(124, 58, 237, 0.12)', color: '#7C3AED' }}>
                          <User size={12} strokeWidth={2.5} />
                        </span>
                        <span>Employee Name</span> <span style={{ color: '#EF4444' }}>*</span>
                      </label>
                      <div style={{ position: 'relative' }}>
                        <User size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                        <input
                          type="text"
                          required
                          className="looks-input"
                          placeholder="Enter employee name"
                          value={newStaff.name}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val.trim()) {
                              // If employeeId is empty or starts with EMP-, auto-generate sequential ID
                              let autoId = newStaff.employeeId;
                              if (!autoId || autoId.startsWith('EMP-')) {
                                const existingNums = (data.staff || [])
                                  .map(s => (s.employeeId || s.id || ''))
                                  .filter(id => id.startsWith('EMP-'))
                                  .map(id => parseInt(id.replace('EMP-', ''), 10))
                                  .filter(n => !isNaN(n));
                                const maxNum = existingNums.length > 0 ? Math.max(...existingNums) : 100;
                                autoId = `EMP-${String(Math.max(maxNum + 1, 101)).padStart(3, '0')}`;
                              }
                              setNewStaff({ ...newStaff, name: val, employeeId: autoId });
                            } else {
                              setNewStaff({ ...newStaff, name: val, employeeId: '' });
                            }
                          }}
                          style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', paddingLeft: '38px', borderRadius: '8px', height: '40px' }}
                        />
                      </div>
                    </div>

                    {/* Employee ID (Automatically Generated) */}
                    <div className="form-group-looks">
                      <label style={{ fontSize: '13px', fontWeight: 700, color: '#1E293B', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px', borderRadius: '5px', background: 'rgba(71, 85, 105, 0.12)', color: '#475569' }}>
                          <Barcode size={12} strokeWidth={2.5} />
                        </span>
                        <span>Employee ID</span> <span style={{ color: '#EF4444' }}>*</span>
                        {newStaff.employeeId && (
                          <span style={{ marginLeft: 'auto', fontSize: '11px', color: '#16A34A', background: '#DCFCE7', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
                            ✓ Auto-generated
                          </span>
                        )}
                      </label>
                      <div style={{ position: 'relative' }}>
                        <Barcode size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                        <input
                          type="text"
                          required
                          className="looks-input"
                          placeholder="Auto-generated (e.g. EMP-101)"
                          value={newStaff.employeeId}
                          onChange={(e) => setNewStaff({ ...newStaff, employeeId: e.target.value })}
                          style={{ background: '#F8FAFC', border: '1px solid #CBD5E1', paddingLeft: '38px', borderRadius: '8px', height: '40px', fontWeight: 700, color: '#0F172A' }}
                        />
                      </div>
                    </div>

                    {/* Mobile Number */}
                    <div className="form-group-looks">
                      <label style={{ fontSize: '13px', fontWeight: 700, color: '#1E293B', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px', borderRadius: '5px', background: 'rgba(22, 163, 74, 0.12)', color: '#16A34A' }}>
                          <Phone size={12} strokeWidth={2.5} />
                        </span>
                        <span>Mobile Number</span> <span style={{ color: '#EF4444' }}>*</span>
                      </label>
                      <div style={{ position: 'relative' }}>
                        <Phone size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                        <input
                          type="tel"
                          inputMode="numeric"
                          required
                          maxLength={10}
                          pattern="[0-9]{10}"
                          className="looks-input"
                          placeholder="Enter 10-digit mobile number"
                          value={newStaff.phone}
                          onChange={(e) => setNewStaff({ ...newStaff, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                          style={{
                            background: '#FFFFFF',
                            border: newStaff.phone && newStaff.phone.length !== 10 ? '1px solid #EF4444' : '1px solid #CBD5E1',
                            paddingLeft: '38px',
                            borderRadius: '8px',
                            height: '40px'
                          }}
                        />
                      </div>
                      {newStaff.phone ? (
                        newStaff.phone.length === 10 ? (
                          <span style={{ color: '#10B981', fontSize: '11.5px', marginTop: '4px', display: 'block', fontWeight: 600 }}>✓ Valid 10-digit number</span>
                        ) : (
                          <span style={{ color: '#EF4444', fontSize: '11.5px', marginTop: '4px', display: 'block' }}>10 digits required ({newStaff.phone.length}/10)</span>
                        )
                      ) : null}
                    </div>

                    {/* Email ID */}
                    <div className="form-group-looks">
                      <label style={{ fontSize: '13px', fontWeight: 700, color: '#1E293B', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px', borderRadius: '5px', background: 'rgba(2, 132, 199, 0.12)', color: '#0284C7' }}>
                          <Mail size={12} strokeWidth={2.5} />
                        </span>
                        <span>Email ID</span>
                      </label>
                      <div style={{ position: 'relative' }}>
                        <Mail size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                        <input
                          type="email"
                          className="looks-input"
                          placeholder="Enter email address"
                          value={newStaff.email}
                          onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                          style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', paddingLeft: '38px', borderRadius: '8px', height: '40px' }}
                        />
                      </div>
                    </div>

                    {/* Date of Birth */}
                    <div className="form-group-looks">
                      <label style={{ fontSize: '13px', fontWeight: 700, color: '#1E293B', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px', borderRadius: '5px', background: 'rgba(217, 119, 6, 0.12)', color: '#D97706' }}>
                          <CalendarDays size={12} strokeWidth={2.5} />
                        </span>
                        <span>Date of Birth</span>
                      </label>
                      <div style={{ position: 'relative' }}>
                        <CalendarDays size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                        <input
                          type="date"
                          className="looks-input"
                          value={newStaff.dob}
                          onChange={(e) => setNewStaff({ ...newStaff, dob: e.target.value })}
                          style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', paddingLeft: '38px', borderRadius: '8px', height: '40px' }}
                        />
                      </div>
                    </div>

                    {/* Gender */}
                    <div className="form-group-looks">
                      <label style={{ fontSize: '13px', fontWeight: 700, color: '#1E293B', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px', borderRadius: '5px', background: 'rgba(79, 70, 229, 0.12)', color: '#4F46E5' }}>
                          <UserCheck size={12} strokeWidth={2.5} />
                        </span>
                        <span>Gender</span>
                      </label>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', height: '40px' }}>
                        {['Male', 'Female', 'Other'].map(gen => {
                          const isSelected = newStaff.gender === gen;
                          return (
                            <button
                              key={gen}
                              type="button"
                              onClick={() => setNewStaff({ ...newStaff, gender: gen })}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '6px',
                                border: isSelected ? '1.5px solid #0D9488' : '1px solid #E2E8F0',
                                background: isSelected ? '#F0FDFA' : '#FFFFFF',
                                color: isSelected ? '#0D9488' : '#64748B',
                                borderRadius: '20px',
                                fontWeight: isSelected ? 700 : 500,
                                fontSize: '13px',
                                cursor: 'pointer',
                                transition: 'all 0.15s ease'
                              }}
                            >
                              <span style={{
                                width: '12px',
                                height: '12px',
                                borderRadius: '50%',
                                border: isSelected ? '4px solid #0D9488' : '1.5px solid #CBD5E1',
                                background: '#FFFFFF',
                                boxSizing: 'border-box'
                              }}></span>
                              {gen}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. PROFESSIONAL DETAILS */}
                <div>
                  <div style={{ paddingBottom: '8px', borderBottom: '1px solid #F1F5F9', marginBottom: '14px', marginTop: '6px' }}>
                    <h4 style={{ margin: 0, fontSize: '13.5px', fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#0D9488' }}></span>
                      Professional Details
                    </h4>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px 18px' }}>
                    {/* Role / Designation */}
                    <div className="form-group-looks">
                      <label style={{ fontSize: '13px', fontWeight: 700, color: '#1E293B', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px', borderRadius: '5px', background: 'rgba(13, 148, 136, 0.12)', color: '#0D9488' }}>
                          <Award size={12} strokeWidth={2.5} />
                        </span>
                        <span>Role / Designation</span> <span style={{ color: '#EF4444' }}>*</span>
                      </label>
                      <div style={{ position: 'relative' }}>
                        <Award size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                        <select
                          required
                          className="looks-input"
                          value={newStaff.role}
                          onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value })}
                          style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', paddingLeft: '38px', borderRadius: '8px', height: '40px' }}
                        >
                          <option value="">Select role</option>
                          <option value="Senior Stylist">Senior Stylist</option>
                          <option value="Master Hair Specialist">Master Hair Specialist</option>
                          <option value="Bridal Makeup Artist">Bridal Makeup Artist</option>
                          <option value="Skin & Spa Therapist">Skin & Spa Therapist</option>
                          <option value="Nail Art Technician">Nail Art Technician</option>
                          <option value="Salon Manager">Salon Manager</option>
                          <option value="Front Desk Executive">Front Desk Executive</option>
                        </select>
                      </div>
                    </div>

                    {/* Specialization */}
                    <div className="form-group-looks">
                      <label style={{ fontSize: '13px', fontWeight: 700, color: '#1E293B', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px', borderRadius: '5px', background: 'rgba(219, 39, 119, 0.12)', color: '#DB2777' }}>
                          <Scissors size={12} strokeWidth={2.5} />
                        </span>
                        <span>Specialization</span>
                      </label>
                      <div style={{ position: 'relative' }}>
                        <Scissors size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                        <select
                          className="looks-input"
                          value={newStaff.specialization}
                          onChange={(e) => setNewStaff({ ...newStaff, specialization: e.target.value })}
                          style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', paddingLeft: '38px', borderRadius: '8px', height: '40px' }}
                        >
                          <option value="">Select specialization</option>
                          <option value="Hair Styling & Cuts">Hair Styling & Cuts</option>
                          <option value="Balayage & Hair Colour">Balayage & Hair Colour</option>
                          <option value="Keratin & Hair Botox">Keratin & Hair Botox</option>
                          <option value="Bridal & HD Makeup">Bridal & HD Makeup</option>
                          <option value="HydraFacial & Skincare">HydraFacial & Skincare</option>
                          <option value="Manicure & Nail Extensions">Manicure & Nail Extensions</option>
                          <option value="Head & Body Spa">Head & Body Spa</option>
                        </select>
                      </div>
                    </div>

                    {/* Joining Date */}
                    <div className="form-group-looks">
                      <label style={{ fontSize: '13px', fontWeight: 700, color: '#1E293B', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px', borderRadius: '5px', background: 'rgba(37, 99, 235, 0.12)', color: '#2563EB' }}>
                          <CalendarDays size={12} strokeWidth={2.5} />
                        </span>
                        <span>Joining Date</span>
                      </label>
                      <div style={{ position: 'relative' }}>
                        <CalendarDays size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                        <input
                          type="date"
                          className="looks-input"
                          value={newStaff.joiningDate}
                          onChange={(e) => setNewStaff({ ...newStaff, joiningDate: e.target.value })}
                          style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', paddingLeft: '38px', borderRadius: '8px', height: '40px' }}
                        />
                      </div>
                    </div>

                    {/* Employment Type */}
                    <div className="form-group-looks">
                      <label style={{ fontSize: '13px', fontWeight: 700, color: '#1E293B', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px', borderRadius: '5px', background: 'rgba(124, 58, 237, 0.12)', color: '#7C3AED' }}>
                          <Clock size={12} strokeWidth={2.5} />
                        </span>
                        <span>Employment Type</span>
                      </label>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', height: '40px' }}>
                        {['Full Time', 'Part Time'].map(type => {
                          const isSelected = newStaff.employmentType === type;
                          return (
                            <button
                              key={type}
                              type="button"
                              onClick={() => setNewStaff({ ...newStaff, employmentType: type })}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '6px',
                                border: isSelected ? '1.5px solid #0D9488' : '1px solid #E2E8F0',
                                background: isSelected ? '#F0FDFA' : '#FFFFFF',
                                color: isSelected ? '#0D9488' : '#64748B',
                                borderRadius: '8px',
                                fontWeight: isSelected ? 700 : 500,
                                fontSize: '13px',
                                cursor: 'pointer',
                                transition: 'all 0.15s ease'
                              }}
                            >
                              {isSelected && <Check size={14} color="#0D9488" strokeWidth={2.5} />}
                              {type}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Salary */}
                    <div className="form-group-looks">
                      <label style={{ fontSize: '13px', fontWeight: 700, color: '#1E293B', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px', borderRadius: '5px', background: 'rgba(217, 119, 6, 0.12)', color: '#D97706' }}>
                          <IndianRupee size={12} strokeWidth={2.5} />
                        </span>
                        <span>Salary</span>
                      </label>
                      <div style={{ position: 'relative' }}>
                        <span style={{ position: 'absolute', left: '14px', top: '11px', color: '#94A3B8', fontWeight: 600, fontSize: '14px' }}>₹</span>
                        <input
                          type="number"
                          className="looks-input"
                          placeholder="Enter salary"
                          value={newStaff.salary}
                          onChange={(e) => setNewStaff({ ...newStaff, salary: e.target.value })}
                          style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', paddingLeft: '34px', borderRadius: '8px', height: '40px' }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. ADDRESS */}
                <div>
                  <div style={{ paddingBottom: '8px', borderBottom: '1px solid #F1F5F9', marginBottom: '14px', marginTop: '6px' }}>
                    <h4 style={{ margin: 0, fontSize: '13.5px', fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#E11D48' }}></span>
                      Address
                    </h4>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px 18px' }}>
                    {/* Address Textarea */}
                    <div className="form-group-looks">
                      <label style={{ fontSize: '13px', fontWeight: 700, color: '#1E293B', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px', borderRadius: '5px', background: 'rgba(225, 29, 72, 0.12)', color: '#E11D48' }}>
                          <MapPin size={12} strokeWidth={2.5} />
                        </span>
                        <span>Address</span>
                      </label>
                      <div style={{ position: 'relative' }}>
                        <MapPin size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                        <textarea
                          className="looks-input"
                          placeholder="Enter full address"
                          rows={2}
                          value={newStaff.address}
                          onChange={(e) => setNewStaff({ ...newStaff, address: e.target.value })}
                          style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', paddingLeft: '38px', borderRadius: '8px', resize: 'none', height: '64px', paddingTop: '10px' }}
                        />
                      </div>
                    </div>

                    {/* City */}
                    <div className="form-group-looks">
                      <label style={{ fontSize: '13px', fontWeight: 700, color: '#1E293B', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px', borderRadius: '5px', background: 'rgba(2, 132, 199, 0.12)', color: '#0284C7' }}>
                          <Building2 size={12} strokeWidth={2.5} />
                        </span>
                        <span>City</span>
                      </label>
                      <div style={{ position: 'relative' }}>
                        <Building2 size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                        <input
                          type="text"
                          className="looks-input"
                          placeholder="Enter city"
                          value={newStaff.city}
                          onChange={(e) => setNewStaff({ ...newStaff, city: e.target.value })}
                          style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', paddingLeft: '38px', borderRadius: '8px', height: '40px' }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4. OTHER */}
                <div>
                  <div style={{ paddingBottom: '8px', borderBottom: '1px solid #F1F5F9', marginBottom: '14px', marginTop: '6px' }}>
                    <h4 style={{ margin: 0, fontSize: '13.5px', fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#475569' }}></span>
                      Other
                    </h4>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px 18px', alignItems: 'start' }}>
                    {/* Profile Photo */}
                    <div className="form-group-looks">
                      <label style={{ fontSize: '13px', fontWeight: 700, color: '#1E293B', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px', borderRadius: '5px', background: 'rgba(13, 148, 136, 0.12)', color: '#0D9488' }}>
                          <Camera size={12} strokeWidth={2.5} />
                        </span>
                        <span>Profile Photo</span>
                      </label>
                      {newStaff.imageUrl ? (
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          background: '#FFFFFF',
                          border: '1px solid #CBD5E1',
                          borderRadius: '10px',
                          padding: '8px 12px',
                          boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
                        }}>
                          <img
                            src={newStaff.imageUrl}
                            alt="avatar preview"
                            style={{ width: '42px', height: '42px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #E2E8F0' }}
                          />
                          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
                            <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#1E293B', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {newStaff.imageFile?.name || 'profile_photo.jpg'}
                            </span>
                            <span style={{ fontSize: '11px', color: '#10B981', display: 'flex', alignItems: 'center', gap: '3px', fontWeight: 500 }}>
                              <CheckCircle2 size={11} color="#10B981" /> Uploaded
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setNewStaff({ ...newStaff, imageFile: null, imageUrl: null });
                            }}
                            style={{
                              background: '#FEE2E2',
                              border: 'none',
                              borderRadius: '6px',
                              width: '26px',
                              height: '26px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              color: '#EF4444'
                            }}
                            title="Remove photo"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      ) : (
                        <label style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          border: '1.5px dashed #CBD5E1',
                          borderRadius: '10px',
                          padding: '10px 14px',
                          cursor: 'pointer',
                          background: '#F8FAFC',
                          transition: 'all 0.2s ease',
                          height: '64px',
                          boxSizing: 'border-box'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B' }}>
                              <Camera size={18} />
                            </div>
                            <div>
                              <div style={{ fontSize: '13px', fontWeight: 600, color: '#1E293B' }}>Upload photo</div>
                              <div style={{ fontSize: '11px', color: '#94A3B8' }}>JPG, PNG (Max 2MB)</div>
                            </div>
                          </div>
                          <UploadCloud size={18} color="#94A3B8" />
                          <input
                            type="file"
                            accept="image/png, image/jpeg, image/webp"
                            style={{ display: 'none' }}
                            onChange={(e) => {
                              if (e.target.files && e.target.files.length > 0) {
                                const file = e.target.files[0];
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  setNewStaff(prev => ({ ...prev, imageFile: file, imageUrl: reader.result }));
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                        </label>
                      )}
                    </div>

                    {/* Notes (Optional) */}
                    <div className="form-group-looks">
                      <label style={{ fontSize: '13px', fontWeight: 700, color: '#1E293B', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px', borderRadius: '5px', background: 'rgba(71, 85, 105, 0.12)', color: '#475569' }}>
                          <FileText size={12} strokeWidth={2.5} />
                        </span>
                        <span>Notes (Optional)</span>
                      </label>
                      <div style={{ position: 'relative' }}>
                        <FileText size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                        <textarea
                          className="looks-input"
                          placeholder="Any additional notes about the employee..."
                          rows={2}
                          value={newStaff.notes}
                          onChange={(e) => setNewStaff({ ...newStaff, notes: e.target.value })}
                          style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', paddingLeft: '38px', borderRadius: '8px', resize: 'none', height: '64px', paddingTop: '10px' }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Modal Footer */}
              <div style={{ padding: '14px 26px', borderTop: '1px solid #E5E7EB', display: 'flex', justifyContent: 'flex-end', gap: '12px', background: '#FFFFFF', borderRadius: '0 0 16px 16px' }}>
                <button
                  type="button"
                  onClick={() => {
                    setNewStaff({
                      name: '',
                      employeeId: '',
                      phone: '',
                      email: '',
                      dob: '',
                      gender: 'Male',
                      role: '',
                      specialization: '',
                      joiningDate: '',
                      employmentType: 'Full Time',
                      salary: '',
                      address: '',
                      city: '',
                      imageFile: null,
                      imageUrl: null,
                      notes: '',
                      commissionRate: 12,
                      servicesCount: 12
                    });
                    setShowAddStaffModal(false);
                  }}
                  style={{
                    padding: '8px 20px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    background: '#FFFFFF',
                    color: '#475569',
                    fontWeight: 600,
                    fontSize: '13px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <RefreshCw size={14} /> Reset
                </button>
                <button
                  type="submit"
                  style={{
                    background: '#0D9488',
                    padding: '8px 22px',
                    borderRadius: '8px',
                    color: '#FFFFFF',
                    border: 'none',
                    fontWeight: 600,
                    fontSize: '13px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 2px 4px rgba(13, 148, 136, 0.25)'
                  }}
                >
                  <UserPlus size={15} /> Add Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4B. Modal: Edit Employee */}
      {showEditStaffModal && editingStaff && (
        <div className="looks-modal-backdrop" onClick={() => setShowEditStaffModal(false)} style={{ zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)', position: 'fixed', inset: 0 }}>
          <div className="looks-modal-window" onClick={(e) => e.stopPropagation()} style={{ width: '92%', maxWidth: '640px', background: '#FFFFFF', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', border: '1px solid #E2E8F0', padding: 0 }}>

            {/* Modal Top Header */}
            <div style={{ background: '#0F172A', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#FFFFFF' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#0D9488', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF' }}>
                  <Edit2 size={18} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, letterSpacing: '-0.01em', color: '#FFFFFF' }}>Edit Employee Details</h3>
                  <p style={{ margin: 0, fontSize: '11.5px', color: '#94A3B8' }}>Update profile, role, commission &amp; contact info for {editingStaff.name}</p>
                </div>
              </div>
              <button
                onClick={() => setShowEditStaffModal(false)}
                style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#94A3B8', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '16px', transition: 'all 0.2s' }}
              >
                ×
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              const cleanPhone = (editingStaff.phone || '').replace(/\D/g, '');
              if (cleanPhone.length !== 10) {
                showToast("⚠️ Please enter a valid 10-digit mobile number.");
                return;
              }
              updateStaff(editingStaff.id, {
                ...editingStaff,
                phone: `+91 ${cleanPhone}`,
                commissionRate: parseFloat(editingStaff.commissionRate) || 12,
                servicesCount: parseInt(editingStaff.servicesCount) || 10
              });
              setShowEditStaffModal(false);
            }} style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

              <div style={{ padding: '20px 24px', background: '#FFFFFF', display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '68vh', overflowY: 'auto' }}>

                {/* 1. PERSONAL DETAILS */}
                <div>
                  <div style={{ paddingBottom: '6px', borderBottom: '1px solid #F1F5F9', marginBottom: '12px' }}>
                    <h4 style={{ margin: 0, fontSize: '13px', fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#7C3AED' }}></span>
                      Personal &amp; Contact Details
                    </h4>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 16px' }}>
                    {/* Employee Name */}
                    <div className="form-group-looks">
                      <label style={{ fontSize: '12.5px', fontWeight: 700, color: '#1E293B', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '18px', height: '18px', borderRadius: '4px', background: 'rgba(124, 58, 237, 0.12)', color: '#7C3AED' }}>
                          <User size={11} strokeWidth={2.5} />
                        </span>
                        <span>Employee Name</span> <span style={{ color: '#EF4444' }}>*</span>
                      </label>
                      <input
                        type="text"
                        required
                        className="looks-input"
                        placeholder="Enter full name"
                        value={editingStaff.name || ''}
                        onChange={(e) => setEditingStaff({ ...editingStaff, name: e.target.value })}
                        style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '8px', height: '38px' }}
                      />
                    </div>

                    {/* Employee ID */}
                    <div className="form-group-looks">
                      <label style={{ fontSize: '12.5px', fontWeight: 700, color: '#1E293B', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '18px', height: '18px', borderRadius: '4px', background: 'rgba(71, 85, 105, 0.12)', color: '#475569' }}>
                          <Barcode size={11} strokeWidth={2.5} />
                        </span>
                        <span>Employee ID</span>
                      </label>
                      <input
                        type="text"
                        className="looks-input"
                        value={editingStaff.employeeId || editingStaff.id}
                        onChange={(e) => setEditingStaff({ ...editingStaff, employeeId: e.target.value })}
                        style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '8px', height: '38px' }}
                      />
                    </div>

                    {/* Mobile Number */}
                    <div className="form-group-looks">
                      <label style={{ fontSize: '12.5px', fontWeight: 700, color: '#1E293B', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '18px', height: '18px', borderRadius: '4px', background: 'rgba(22, 163, 74, 0.12)', color: '#16A34A' }}>
                          <Phone size={11} strokeWidth={2.5} />
                        </span>
                        <span>Mobile Number</span> <span style={{ color: '#EF4444' }}>*</span>
                      </label>
                      <input
                        type="tel"
                        inputMode="numeric"
                        required
                        maxLength={10}
                        pattern="[0-9]{10}"
                        className="looks-input"
                        placeholder="10-digit mobile number"
                        value={editingStaff.phone || ''}
                        onChange={(e) => setEditingStaff({ ...editingStaff, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                        style={{
                          background: '#FFFFFF',
                          border: editingStaff.phone && editingStaff.phone.length !== 10 ? '1px solid #EF4444' : '1px solid #CBD5E1',
                          borderRadius: '8px',
                          height: '38px'
                        }}
                      />
                      {editingStaff.phone ? (
                        editingStaff.phone.length === 10 ? (
                          <span style={{ color: '#10B981', fontSize: '11px', marginTop: '3px', display: 'block', fontWeight: 600 }}>✓ Valid 10-digit number</span>
                        ) : (
                          <span style={{ color: '#EF4444', fontSize: '11px', marginTop: '3px', display: 'block' }}>10 digits required ({editingStaff.phone.length}/10)</span>
                        )
                      ) : null}
                    </div>

                    {/* Email ID */}
                    <div className="form-group-looks">
                      <label style={{ fontSize: '12.5px', fontWeight: 700, color: '#1E293B', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '18px', height: '18px', borderRadius: '4px', background: 'rgba(2, 132, 199, 0.12)', color: '#0284C7' }}>
                          <Mail size={11} strokeWidth={2.5} />
                        </span>
                        <span>Email ID</span>
                      </label>
                      <input
                        type="email"
                        className="looks-input"
                        placeholder="Enter email address"
                        value={editingStaff.email || ''}
                        onChange={(e) => setEditingStaff({ ...editingStaff, email: e.target.value })}
                        style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '8px', height: '38px' }}
                      />
                    </div>
                  </div>
                </div>

                {/* 2. JOB ROLE & COMPENSATION */}
                <div>
                  <div style={{ paddingBottom: '6px', borderBottom: '1px solid #F1F5F9', marginBottom: '12px' }}>
                    <h4 style={{ margin: 0, fontSize: '13px', fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#0D9488' }}></span>
                      Job Role &amp; Incentive
                    </h4>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 16px' }}>
                    {/* Role / Designation */}
                    <div className="form-group-looks">
                      <label style={{ fontSize: '12.5px', fontWeight: 700, color: '#1E293B', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '18px', height: '18px', borderRadius: '4px', background: 'rgba(13, 148, 136, 0.12)', color: '#0D9488' }}>
                          <Award size={11} strokeWidth={2.5} />
                        </span>
                        <span>Designation / Role</span> <span style={{ color: '#EF4444' }}>*</span>
                      </label>
                      <select
                        className="looks-input"
                        value={editingStaff.role || 'Senior Stylist'}
                        onChange={(e) => setEditingStaff({ ...editingStaff, role: e.target.value })}
                        style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '8px', height: '38px' }}
                      >
                        <option value="Senior Master Stylist">Senior Master Stylist</option>
                        <option value="Technical Director & Colourist">Technical Director &amp; Colourist</option>
                        <option value="Creative Hair Director">Creative Hair Director</option>
                        <option value="Senior Esthetician & Skin Specialist">Senior Esthetician &amp; Skin Specialist</option>
                        <option value="Bridal Artistry Lead">Bridal Artistry Lead</option>
                        <option value="Senior Barber & Grooming Expert">Senior Barber &amp; Grooming Expert</option>
                        <option value="Guest Experience & Salon Concierge">Guest Experience &amp; Salon Concierge</option>
                        <option value="Stylist">Stylist</option>
                        <option value="Beautician">Beautician</option>
                        <option value="Barber">Barber</option>
                        <option value="Receptionist">Receptionist</option>
                      </select>
                    </div>

                    {/* Specialization */}
                    <div className="form-group-looks">
                      <label style={{ fontSize: '12.5px', fontWeight: 700, color: '#1E293B', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '18px', height: '18px', borderRadius: '4px', background: 'rgba(219, 39, 119, 0.12)', color: '#DB2777' }}>
                          <Scissors size={11} strokeWidth={2.5} />
                        </span>
                        <span>Specialization</span>
                      </label>
                      <input
                        type="text"
                        className="looks-input"
                        placeholder="e.g. Balayage, HydraFacial, Fade Cuts"
                        value={editingStaff.specialization || ''}
                        onChange={(e) => setEditingStaff({ ...editingStaff, specialization: e.target.value })}
                        style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '8px', height: '38px' }}
                      />
                    </div>

                    {/* Commission Rate (%) */}
                    <div className="form-group-looks">
                      <label style={{ fontSize: '12.5px', fontWeight: 700, color: '#1E293B', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '18px', height: '18px', borderRadius: '4px', background: 'rgba(217, 119, 6, 0.12)', color: '#D97706' }}>
                          <Percent size={11} strokeWidth={2.5} />
                        </span>
                        <span>Incentive Commission (%)</span>
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        className="looks-input"
                        placeholder="e.g. 15"
                        value={editingStaff.commissionRate || 12}
                        onChange={(e) => setEditingStaff({ ...editingStaff, commissionRate: e.target.value })}
                        style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '8px', height: '38px' }}
                      />
                    </div>

                    {/* Salary */}
                    <div className="form-group-looks">
                      <label style={{ fontSize: '12.5px', fontWeight: 700, color: '#1E293B', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '18px', height: '18px', borderRadius: '4px', background: 'rgba(16, 185, 129, 0.12)', color: '#10B981' }}>
                          <IndianRupee size={11} strokeWidth={2.5} />
                        </span>
                        <span>Monthly Base Salary (₹)</span>
                      </label>
                      <input
                        type="number"
                        className="looks-input"
                        placeholder="e.g. 35000"
                        value={editingStaff.salary || ''}
                        onChange={(e) => setEditingStaff({ ...editingStaff, salary: e.target.value })}
                        style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '8px', height: '38px' }}
                      />
                    </div>
                  </div>
                </div>

                {/* 3. STATUS & EMPLOYMENT TYPE */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 16px' }}>
                  <div className="form-group-looks">
                    <label style={{ fontSize: '12.5px', fontWeight: 700, color: '#1E293B', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '18px', height: '18px', borderRadius: '4px', background: 'rgba(22, 163, 74, 0.12)', color: '#16A34A' }}>
                        <CheckCircle2 size={11} strokeWidth={2.5} />
                      </span>
                      <span>Status</span>
                    </label>
                    <select
                      className="looks-input"
                      value={editingStaff.status || 'Active'}
                      onChange={(e) => setEditingStaff({ ...editingStaff, status: e.target.value })}
                      style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '8px', height: '38px' }}
                    >
                      <option value="Active">Active</option>
                      <option value="In-Service">In-Service</option>
                      <option value="On-Leave">On-Leave</option>
                    </select>
                  </div>

                  <div className="form-group-looks">
                    <label style={{ fontSize: '12.5px', fontWeight: 700, color: '#1E293B', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '18px', height: '18px', borderRadius: '4px', background: 'rgba(124, 58, 237, 0.12)', color: '#7C3AED' }}>
                        <Clock size={11} strokeWidth={2.5} />
                      </span>
                      <span>Employment Type</span>
                    </label>
                    <select
                      className="looks-input"
                      value={editingStaff.employmentType || 'Full Time'}
                      onChange={(e) => setEditingStaff({ ...editingStaff, employmentType: e.target.value })}
                      style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '8px', height: '38px' }}
                    >
                      <option value="Full Time">Full Time</option>
                      <option value="Part Time">Part Time</option>
                      <option value="Contract">Contract</option>
                      <option value="Visiting Master">Visiting Master</option>
                    </select>
                  </div>
                </div>

              </div>

              {/* Modal Footer */}
              <div style={{ padding: '14px 24px', borderTop: '1px solid #E5E7EB', display: 'flex', justifyContent: 'flex-end', gap: '10px', background: '#F8FAFC' }}>
                <button
                  type="button"
                  onClick={() => setShowEditStaffModal(false)}
                  style={{ padding: '8px 18px', borderRadius: '8px', border: '1px solid #CBD5E1', background: '#FFFFFF', color: '#475569', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ background: '#0D9488', padding: '8px 22px', borderRadius: '8px', color: '#FFFFFF', border: 'none', fontWeight: 600, fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Save size={14} /> Save Changes
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* 5. Modal: Add Incentive Rule */}
      {showAddRuleModal && (
        <div className="looks-modal-backdrop" onClick={() => setShowAddRuleModal(false)}>
          <div className="looks-modal-window" style={{ maxWidth: '520px', width: '92%', borderRadius: '16px', overflow: 'hidden' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-top" style={{ padding: '18px 24px 14px 24px', background: '#FFFFFF', borderBottom: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(219, 39, 119, 0.12)', color: '#DB2777', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Sparkles size={22} strokeWidth={2.3} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#0F172A' }}>Add Incentive Rule</h3>
                  <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#64748B' }}>Configure commission payout rule for salon stylists.</p>
                </div>
              </div>
              <button className="btn-close-x" onClick={() => setShowAddRuleModal(false)} style={{ fontSize: '22px', background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>×</button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              addIncentiveRule({
                staffName: currentIncentiveStylist === 'all' ? 'Maya Sharma' : currentIncentiveStylist,
                service: newRule.service,
                incentiveType: newRule.incentiveType,
                value: newRule.value,
                condition: newRule.condition
              });
              setShowAddRuleModal(false);
            }} style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="form-group-looks">
                <label style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px', borderRadius: '5px', background: 'rgba(13, 148, 136, 0.12)', color: '#0D9488' }}>
                    <Scissors size={12} strokeWidth={2.5} />
                  </span>
                  <span>Service Name</span> <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <input type="text" required className="looks-input" value={newRule.service} onChange={(e) => setNewRule({ ...newRule, service: e.target.value })} placeholder="e.g. Hair Colour & Balayage" />
              </div>
              <div className="form-group-looks-grid">
                <div className="form-group-looks">
                  <label style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px', borderRadius: '5px', background: 'rgba(2, 132, 199, 0.12)', color: '#0284C7' }}>
                      <Tag size={12} strokeWidth={2.5} />
                    </span>
                    <span>Incentive Type</span>
                  </label>
                  <select className="looks-input" value={newRule.incentiveType} onChange={(e) => setNewRule({ ...newRule, incentiveType: e.target.value })}>
                    <option value="Percentage">Percentage (%)</option>
                    <option value="Fixed Amount">Fixed Amount (₹)</option>
                  </select>
                </div>
                <div className="form-group-looks">
                  <label style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px', borderRadius: '5px', background: 'rgba(217, 119, 6, 0.12)', color: '#D97706' }}>
                      <Percent size={12} strokeWidth={2.5} />
                    </span>
                    <span>Incentive Value</span> <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <input type="text" required className="looks-input" value={newRule.value} onChange={(e) => setNewRule({ ...newRule, value: e.target.value })} placeholder="e.g. 10% or ₹150" />
                </div>
              </div>
              <div className="form-group-looks">
                <label style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px', borderRadius: '5px', background: 'rgba(71, 85, 105, 0.12)', color: '#475569' }}>
                    <FileText size={12} strokeWidth={2.5} />
                  </span>
                  <span>Condition / Rule Criteria</span>
                </label>
                <input type="text" className="looks-input" value={newRule.condition} onChange={(e) => setNewRule({ ...newRule, condition: e.target.value })} placeholder="e.g. Min bill value > ₹1,000" />
              </div>
              <button type="submit" className="btn-gold-action" style={{ width: '100%', marginTop: '6px' }}>Save Rule</button>
            </form>
          </div>
        </div>
      )}

      {/* 6. Modal: Add Package */}
      {showAddPackageModal && (
        <div className="looks-modal-backdrop" onClick={() => setShowAddPackageModal(false)}>
          <div className="looks-modal-window" style={{ maxWidth: '580px', width: '92%', borderRadius: '16px', overflow: 'hidden' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-top" style={{ padding: '18px 24px 14px 24px', background: '#FFFFFF', borderBottom: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(13, 148, 136, 0.12)', color: '#0D9488', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Gift size={22} strokeWidth={2.3} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#0F172A' }}>Create Salon Package</h3>
                  <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#64748B' }}>Bundle popular services into curated combo packages.</p>
                </div>
              </div>
              <button className="btn-close-x" onClick={() => setShowAddPackageModal(false)} style={{ fontSize: '22px', background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>×</button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const priceVal = parseFloat(newPkg.price) || 0;
              const origVal = parseFloat(newPkg.originalPrice || priceVal * 1.35);
              const items = (newPkg.includesText || '').split(',').map(s => s.trim()).filter(Boolean);
              addPackageItem({
                name: newPkg.name,
                price: priceVal,
                originalPrice: origVal,
                duration: newPkg.duration || '120 mins',
                category: newPkg.category || 'Hair',
                badge: newPkg.badge || 'BESTSELLER',
                includes: items.length > 0 ? items : ['Haircut', 'Hair Spa']
              });
              setShowAddPackageModal(false);
              setNewPkg({
                name: '',
                price: 1999,
                originalPrice: 2999,
                duration: '120 mins',
                category: 'Hair',
                badge: 'BESTSELLER',
                includesText: 'Haircut, Hair Spa, Deep Conditioning'
              });
            }} style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="form-group-looks">
                <label style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px', borderRadius: '5px', background: 'rgba(13, 148, 136, 0.12)', color: '#0D9488' }}>
                    <Gift size={12} strokeWidth={2.5} />
                  </span>
                  <span>Package Title</span> <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <input type="text" required className="looks-input" placeholder="e.g. Royal Bridal Glow Makeover" value={newPkg.name} onChange={(e) => setNewPkg({ ...newPkg, name: e.target.value })} />
              </div>

              <div className="form-group-looks-grid">
                <div className="form-group-looks">
                  <label style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', marginBottom: '6px' }}>
                    <span>Category</span>
                  </label>
                  <select className="looks-input" value={newPkg.category} onChange={(e) => setNewPkg({ ...newPkg, category: e.target.value })}>
                    <option value="Bridal">Bridal &amp; Wedding</option>
                    <option value="Hair">Hair &amp; Styling</option>
                    <option value="Grooming">Men's Grooming</option>
                    <option value="Skin & Spa">Skin &amp; Glow</option>
                    <option value="Combos">Combos &amp; Pamper</option>
                  </select>
                </div>

                <div className="form-group-looks">
                  <label style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', marginBottom: '6px' }}>
                    <span>Badge Tag</span>
                  </label>
                  <select className="looks-input" value={newPkg.badge} onChange={(e) => setNewPkg({ ...newPkg, badge: e.target.value })}>
                    <option value="BESTSELLER">BESTSELLER</option>
                    <option value="TRENDING">TRENDING</option>
                    <option value="POPULAR">POPULAR</option>
                    <option value="PREMIUM">PREMIUM</option>
                    <option value="NEW">NEW</option>
                    <option value="SAVE 35%">SAVE 35%</option>
                  </select>
                </div>
              </div>

              <div className="form-group-looks-grid">
                <div className="form-group-looks">
                  <label style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px', borderRadius: '5px', background: 'rgba(217, 119, 6, 0.12)', color: '#D97706' }}>
                      <IndianRupee size={12} strokeWidth={2.5} />
                    </span>
                    <span>Package Price (₹)</span> <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <input type="number" required className="looks-input" placeholder="e.g. 2999" value={newPkg.price} onChange={(e) => setNewPkg({ ...newPkg, price: e.target.value })} />
                </div>
                <div className="form-group-looks">
                  <label style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px', borderRadius: '5px', background: 'rgba(71, 85, 105, 0.12)', color: '#475569' }}>
                      <IndianRupee size={12} strokeWidth={2.5} />
                    </span>
                    <span>Original Value (₹)</span>
                  </label>
                  <input type="number" className="looks-input" placeholder="e.g. 4500" value={newPkg.originalPrice} onChange={(e) => setNewPkg({ ...newPkg, originalPrice: e.target.value })} />
                </div>
              </div>

              <div className="form-group-looks">
                <label style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Clock size={14} color="#0D9488" />
                  <span>Duration</span>
                </label>
                <input type="text" className="looks-input" placeholder="e.g. 120 mins, 180 mins" value={newPkg.duration} onChange={(e) => setNewPkg({ ...newPkg, duration: e.target.value })} />
              </div>

              <div className="form-group-looks">
                <label style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px', borderRadius: '5px', background: 'rgba(13, 148, 136, 0.12)', color: '#0D9488' }}>
                    <Scissors size={12} strokeWidth={2.5} />
                  </span>
                  <span>Included Services (Comma separated)</span>
                </label>
                <input type="text" className="looks-input" value={newPkg.includesText} onChange={(e) => setNewPkg({ ...newPkg, includesText: e.target.value })} placeholder="Haircut, Hair Spa, Deep Conditioning, Serum Finish" />
              </div>

              <button type="submit" className="btn-gold-action" style={{ width: '100%', marginTop: '6px' }}>Create Package</button>
            </form>
          </div>
        </div>
      )}

      {/* 6.1 Modal: Edit Package */}
      {showEditPackageModal && editingPkg && (
        <div className="looks-modal-backdrop" onClick={() => setShowEditPackageModal(false)}>
          <div className="looks-modal-window" style={{ maxWidth: '580px', width: '92%', borderRadius: '16px', overflow: 'hidden' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-top" style={{ padding: '18px 24px 14px 24px', background: '#FFFFFF', borderBottom: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(13, 148, 136, 0.12)', color: '#0D9488', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Edit2 size={20} strokeWidth={2.3} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#0F172A' }}>Edit Salon Package</h3>
                  <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#64748B' }}>Modify bundle pricing, duration, and services included.</p>
                </div>
              </div>
              <button className="btn-close-x" onClick={() => setShowEditPackageModal(false)} style={{ fontSize: '22px', background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>×</button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const priceVal = parseFloat(editingPkg.price) || 0;
              const origVal = parseFloat(editingPkg.originalPrice || priceVal * 1.3);
              const items = (editingPkg.includesText || '').split(',').map(s => s.trim()).filter(Boolean);
              if (updatePackageItem) {
                updatePackageItem(editingPkg.id, {
                  name: editingPkg.name,
                  price: priceVal,
                  originalPrice: origVal,
                  duration: editingPkg.duration || '120 mins',
                  category: editingPkg.category || 'Hair',
                  badge: editingPkg.badge || 'BESTSELLER',
                  includes: items
                });
              }
              setShowEditPackageModal(false);
              setEditingPkg(null);
            }} style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="form-group-looks">
                <label style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', marginBottom: '6px' }}>
                  <span>Package Title</span> <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <input type="text" required className="looks-input" value={editingPkg.name} onChange={(e) => setEditingPkg({ ...editingPkg, name: e.target.value })} />
              </div>

              <div className="form-group-looks-grid">
                <div className="form-group-looks">
                  <label style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', marginBottom: '6px' }}>
                    <span>Category</span>
                  </label>
                  <select className="looks-input" value={editingPkg.category || 'Hair'} onChange={(e) => setEditingPkg({ ...editingPkg, category: e.target.value })}>
                    <option value="Bridal">Bridal &amp; Wedding</option>
                    <option value="Hair">Hair &amp; Styling</option>
                    <option value="Grooming">Men's Grooming</option>
                    <option value="Skin & Spa">Skin &amp; Glow</option>
                    <option value="Combos">Combos &amp; Pamper</option>
                  </select>
                </div>

                <div className="form-group-looks">
                  <label style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', marginBottom: '6px' }}>
                    <span>Badge Tag</span>
                  </label>
                  <select className="looks-input" value={editingPkg.badge || 'BESTSELLER'} onChange={(e) => setEditingPkg({ ...editingPkg, badge: e.target.value })}>
                    <option value="BESTSELLER">BESTSELLER</option>
                    <option value="TRENDING">TRENDING</option>
                    <option value="POPULAR">POPULAR</option>
                    <option value="PREMIUM">PREMIUM</option>
                    <option value="NEW">NEW</option>
                    <option value="SAVE 35%">SAVE 35%</option>
                  </select>
                </div>
              </div>

              <div className="form-group-looks-grid">
                <div className="form-group-looks">
                  <label style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', marginBottom: '6px' }}>
                    <span>Package Price (₹)</span> <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <input type="number" required className="looks-input" value={editingPkg.price} onChange={(e) => setEditingPkg({ ...editingPkg, price: e.target.value })} />
                </div>
                <div className="form-group-looks">
                  <label style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', marginBottom: '6px' }}>
                    <span>Original Value (₹)</span>
                  </label>
                  <input type="number" className="looks-input" value={editingPkg.originalPrice || ''} onChange={(e) => setEditingPkg({ ...editingPkg, originalPrice: e.target.value })} />
                </div>
              </div>

              <div className="form-group-looks">
                <label style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', marginBottom: '6px' }}>
                  <span>Duration</span>
                </label>
                <input type="text" className="looks-input" value={editingPkg.duration || ''} onChange={(e) => setEditingPkg({ ...editingPkg, duration: e.target.value })} />
              </div>

              <div className="form-group-looks">
                <label style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', marginBottom: '6px' }}>
                  <span>Included Services (Comma separated)</span>
                </label>
                <input type="text" className="looks-input" value={editingPkg.includesText || ''} onChange={(e) => setEditingPkg({ ...editingPkg, includesText: e.target.value })} />
              </div>

              <button type="submit" className="btn-gold-action" style={{ width: '100%', marginTop: '6px' }}>Save Changes</button>
            </form>
          </div>
        </div>
      )}

      {/* 7. Modal: Record Stock In */}
      {showAddStockInModal && (
        <div className="looks-modal-backdrop" onClick={() => setShowAddStockInModal(false)}>
          <div className="looks-modal-window" style={{ maxWidth: '560px', width: '92%', borderRadius: '16px', overflow: 'hidden' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-top" style={{ padding: '18px 24px 14px 24px', background: '#FFFFFF', borderBottom: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(22, 163, 74, 0.12)', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <PlusCircle size={22} strokeWidth={2.3} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#0F172A' }}>Record Stock In Entry</h3>
                  <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#64748B' }}>Add received shipments and replenish salon warehouse inventory.</p>
                </div>
              </div>
              <button className="btn-close-x" onClick={() => setShowAddStockInModal(false)} style={{ fontSize: '22px', background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>×</button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              addStockTransactionRecord(newStockTx);
              setShowAddStockInModal(false);
            }} style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="form-group-looks">
                <label style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px', borderRadius: '5px', background: 'rgba(13, 148, 136, 0.12)', color: '#0D9488' }}>
                    <Package size={12} strokeWidth={2.5} />
                  </span>
                  <span>Select Product</span> <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <select
                  className="looks-input"
                  value={newStockTx.productName}
                  onChange={(e) => {
                    const sel = (data.inventory || []).find(p => p.name === e.target.value);
                    setNewStockTx({
                      ...newStockTx,
                      productName: e.target.value,
                      productId: sel?.id,
                      cost: sel?.unitCost || newStockTx.cost,
                      supplier: sel?.supplier || newStockTx.supplier
                    });
                  }}
                  required
                >
                  <option value="">-- Choose Product from Inventory --</option>
                  {(data.inventory || []).map(p => (
                    <option key={p.id} value={p.name}>
                      {p.name} (Current: {p.stock || 0} units)
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group-looks-grid">
                <div className="form-group-looks">
                  <label style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px', borderRadius: '5px', background: 'rgba(22, 163, 74, 0.12)', color: '#16A34A' }}>
                      <Layers size={12} strokeWidth={2.5} />
                    </span>
                    <span>Quantity Received (Units)</span> <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <input type="number" min="1" required className="looks-input" value={newStockTx.qty} onChange={(e) => setNewStockTx({ ...newStockTx, qty: e.target.value })} placeholder="e.g. 20" />
                </div>
                <div className="form-group-looks">
                  <label style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px', borderRadius: '5px', background: 'rgba(217, 119, 6, 0.12)', color: '#D97706' }}>
                      <IndianRupee size={12} strokeWidth={2.5} />
                    </span>
                    <span>Unit Cost (₹)</span>
                  </label>
                  <input type="number" required className="looks-input" value={newStockTx.cost} onChange={(e) => setNewStockTx({ ...newStockTx, cost: e.target.value })} placeholder="e.g. 450" />
                </div>
              </div>
              <div className="form-group-looks">
                <label style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px', borderRadius: '5px', background: 'rgba(79, 70, 229, 0.12)', color: '#4F46E5' }}>
                    <Truck size={12} strokeWidth={2.5} />
                  </span>
                  <span>Supplier / Source</span>
                </label>
                <input type="text" className="looks-input" value={newStockTx.supplier} onChange={(e) => setNewStockTx({ ...newStockTx, supplier: e.target.value })} placeholder="e.g. L'Oréal Professional India" />
              </div>
              <button type="submit" className="btn-gold-action" style={{ width: '100%', marginTop: '6px' }}>Save Stock In</button>
            </form>
          </div>
        </div>
      )}

      {/* 8. Modal: Record Stock Out */}
      {showAddStockOutModal && (
        <div className="looks-modal-backdrop" onClick={() => setShowAddStockOutModal(false)}>
          <div className="looks-modal-window" style={{ maxWidth: '560px', width: '92%', borderRadius: '16px', overflow: 'hidden' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-top" style={{ padding: '18px 24px 14px 24px', background: '#FFFFFF', borderBottom: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(225, 29, 72, 0.12)', color: '#E11D48', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ArrowUpRight size={22} strokeWidth={2.3} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#0F172A' }}>Record Stock Out Entry</h3>
                  <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#64748B' }}>Deduct floor salon usage, internal transfers, or damaged inventory.</p>
                </div>
              </div>
              <button className="btn-close-x" onClick={() => setShowAddStockOutModal(false)} style={{ fontSize: '22px', background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>×</button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              addStockTransactionRecord({ ...newStockOutTx, type: 'Stock Out' });
              setShowAddStockOutModal(false);
            }} style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="form-group-looks">
                <label style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px', borderRadius: '5px', background: 'rgba(13, 148, 136, 0.12)', color: '#0D9488' }}>
                    <Package size={12} strokeWidth={2.5} />
                  </span>
                  <span>Select Product</span> <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <select
                  className="looks-input"
                  value={newStockOutTx.productName}
                  onChange={(e) => {
                    const sel = (data.inventory || []).find(p => p.name === e.target.value);
                    setNewStockOutTx({
                      ...newStockOutTx,
                      productName: e.target.value,
                      productId: sel?.id,
                      cost: sel?.unitCost || newStockOutTx.cost
                    });
                  }}
                  required
                >
                  <option value="">-- Choose Product from Inventory --</option>
                  {(data.inventory || []).map(p => (
                    <option key={p.id} value={p.name}>
                      {p.name} (Available: {p.stock || 0} units)
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group-looks-grid">
                <div className="form-group-looks">
                  <label style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px', borderRadius: '5px', background: 'rgba(225, 29, 72, 0.12)', color: '#E11D48' }}>
                      <Layers size={12} strokeWidth={2.5} />
                    </span>
                    <span>Quantity Consumed (Units)</span> <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <input type="number" min="1" required className="looks-input" value={newStockOutTx.qty} onChange={(e) => setNewStockOutTx({ ...newStockOutTx, qty: e.target.value })} placeholder="e.g. 3" />
                </div>
                <div className="form-group-looks">
                  <label style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px', borderRadius: '5px', background: 'rgba(71, 85, 105, 0.12)', color: '#475569' }}>
                      <FileText size={12} strokeWidth={2.5} />
                    </span>
                    <span>Reason / Destination</span>
                  </label>
                  <input type="text" className="looks-input" value={newStockOutTx.reason} onChange={(e) => setNewStockOutTx({ ...newStockOutTx, reason: e.target.value })} placeholder="Bay floor usage / damaged" />
                </div>
              </div>
              <button type="submit" className="btn-gold-action" style={{ width: '100%', marginTop: '6px' }}>Log Stock Out</button>
            </form>
          </div>
        </div>
      )}

      {/* 9. Modal: Add Supplier */}
      {showAddSupplierModal && (
        <div className="looks-modal-backdrop" onClick={() => setShowAddSupplierModal(false)}>
          <div className="looks-modal-window" style={{ maxWidth: '580px', width: '92%', borderRadius: '16px', overflow: 'hidden' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-top" style={{ padding: '18px 24px 14px 24px', background: '#FFFFFF', borderBottom: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(79, 70, 229, 0.12)', color: '#4F46E5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Building2 size={22} strokeWidth={2.3} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#0F172A' }}>Register Salon Supplier</h3>
                  <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#64748B' }}>Add distributor details, contacts and account balances.</p>
                </div>
              </div>
              <button className="btn-close-x" onClick={() => setShowAddSupplierModal(false)} style={{ fontSize: '22px', background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>×</button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const cleanPhone = (newSupplier.phone || '').replace(/\D/g, '');
              if (cleanPhone.length !== 10) {
                showToast("⚠️ Please enter a valid 10-digit phone number.");
                return;
              }
              addSupplier({
                ...newSupplier,
                phone: `+91 ${cleanPhone}`
              });
              setShowAddSupplierModal(false);
            }} style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="form-group-looks">
                <label style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px', borderRadius: '5px', background: 'rgba(79, 70, 229, 0.12)', color: '#4F46E5' }}>
                    <Building2 size={12} strokeWidth={2.5} />
                  </span>
                  <span>Supplier / Company Name</span> <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <input type="text" required className="looks-input" value={newSupplier.name} onChange={(e) => setNewSupplier({ ...newSupplier, name: e.target.value })} placeholder="e.g. Wella Professional India" />
              </div>
              <div className="form-group-looks-grid">
                <div className="form-group-looks">
                  <label style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px', borderRadius: '5px', background: 'rgba(124, 58, 237, 0.12)', color: '#7C3AED' }}>
                      <User size={12} strokeWidth={2.5} />
                    </span>
                    <span>Contact Person</span>
                  </label>
                  <input type="text" className="looks-input" value={newSupplier.contactPerson} onChange={(e) => setNewSupplier({ ...newSupplier, contactPerson: e.target.value })} placeholder="e.g. Rajiv Kapoor" />
                </div>
                <div className="form-group-looks">
                  <label style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px', borderRadius: '5px', background: 'rgba(22, 163, 74, 0.12)', color: '#16A34A' }}>
                      <Phone size={12} strokeWidth={2.5} />
                    </span>
                    <span>Phone Number</span> <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <input
                    type="tel"
                    inputMode="numeric"
                    required
                    maxLength={10}
                    pattern="[0-9]{10}"
                    className="looks-input"
                    placeholder="10-digit mobile number"
                    value={newSupplier.phone}
                    onChange={(e) => setNewSupplier({ ...newSupplier, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                  />
                  {newSupplier.phone ? (
                    newSupplier.phone.length === 10 ? (
                      <small style={{ color: '#10B981', fontSize: '11px', display: 'block', marginTop: '3px', fontWeight: 600 }}>✓ Valid 10-digit number</small>
                    ) : (
                      <small style={{ color: '#EF4444', fontSize: '11px', display: 'block', marginTop: '3px' }}>10 digits required ({newSupplier.phone.length}/10)</small>
                    )
                  ) : null}
                </div>
              </div>
              <div className="form-group-looks-grid">
                <div className="form-group-looks">
                  <label style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px', borderRadius: '5px', background: 'rgba(2, 132, 199, 0.12)', color: '#0284C7' }}>
                      <Mail size={12} strokeWidth={2.5} />
                    </span>
                    <span>Email Address</span>
                  </label>
                  <input type="email" className="looks-input" placeholder="supplier@example.com" value={newSupplier.email} onChange={(e) => setNewSupplier({ ...newSupplier, email: e.target.value })} />
                </div>
                <div className="form-group-looks">
                  <label style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px', borderRadius: '5px', background: 'rgba(217, 119, 6, 0.12)', color: '#D97706' }}>
                      <IndianRupee size={12} strokeWidth={2.5} />
                    </span>
                    <span>Outstanding Balance (₹)</span>
                  </label>
                  <input type="number" className="looks-input" placeholder="0" value={newSupplier.balance} onChange={(e) => setNewSupplier({ ...newSupplier, balance: e.target.value })} />
                </div>
              </div>
              <button type="submit" className="btn-gold-action" style={{ width: '100%', marginTop: '6px' }}>Register Supplier</button>
            </form>
          </div>
        </div>
      )}

      {/* 10. Modal: Log Product Usage */}
      {showAddUsageModal && (
        <div className="looks-modal-backdrop" onClick={() => setShowAddUsageModal(false)}>
          <div className="looks-modal-window" style={{ maxWidth: '560px', width: '92%', borderRadius: '16px', overflow: 'hidden' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-top" style={{ padding: '18px 24px 14px 24px', background: '#FFFFFF', borderBottom: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(13, 148, 136, 0.12)', color: '#0D9488', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Scissors size={22} strokeWidth={2.3} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#0F172A' }}>Log Salon Bay Product Usage</h3>
                  <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#64748B' }}>Track consumable products utilized during salon treatments.</p>
                </div>
              </div>
              <button className="btn-close-x" onClick={() => setShowAddUsageModal(false)} style={{ fontSize: '22px', background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>×</button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              addProductUsageLog(newUsageLog);
              setShowAddUsageModal(false);
            }} style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="form-group-looks">
                <label style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px', borderRadius: '5px', background: 'rgba(13, 148, 136, 0.12)', color: '#0D9488' }}>
                    <Scissors size={12} strokeWidth={2.5} />
                  </span>
                  <span>Treatment / Service</span> <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <input type="text" required className="looks-input" value={newUsageLog.service} onChange={(e) => setNewUsageLog({ ...newUsageLog, service: e.target.value })} placeholder="e.g. Hair Colour & Balayage" />
              </div>
              <div className="form-group-looks">
                <label style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px', borderRadius: '5px', background: 'rgba(124, 58, 237, 0.12)', color: '#7C3AED' }}>
                    <User size={12} strokeWidth={2.5} />
                  </span>
                  <span>Stylist Attribution</span>
                </label>
                <input type="text" className="looks-input" value={newUsageLog.stylist} onChange={(e) => setNewUsageLog({ ...newUsageLog, stylist: e.target.value })} placeholder="e.g. Maya Sharma" />
              </div>
              <div className="form-group-looks">
                <label style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px', borderRadius: '5px', background: 'rgba(79, 70, 229, 0.12)', color: '#4F46E5' }}>
                    <Package size={12} strokeWidth={2.5} />
                  </span>
                  <span>Products &amp; Quantities Used</span> <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <textarea
                  className="looks-input"
                  style={{ minHeight: '80px', resize: 'vertical' }}
                  required
                  value={newUsageLog.productsUsedText}
                  onChange={(e) => setNewUsageLog({ ...newUsageLog, productsUsedText: e.target.value })}
                  placeholder="e.g. L'Oréal Shampoo (30ml), Kerastase Mask (50ml)"
                />
              </div>
              <button type="submit" className="btn-gold-action" style={{ width: '100%', marginTop: '6px' }}>Record Usage</button>
            </form>
          </div>
        </div>
      )}

      {/* 11. Modal: Add Customer */}
      {showAddCustomerModal && (
        <div className="looks-modal-backdrop" onClick={() => setShowAddCustomerModal(false)}>
          <div className="looks-modal-window" style={{ maxWidth: '640px', width: '92%', borderRadius: '16px', overflow: 'hidden' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-top" style={{ padding: '18px 24px 14px 24px', background: '#FFFFFF', borderBottom: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(124, 58, 237, 0.12)', color: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <UserPlus size={22} strokeWidth={2.3} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#0F172A' }}>Add New Customer Profile</h3>
                  <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#64748B' }}>Create client record for booking appointments and loyalty tracking.</p>
                </div>
              </div>
              <button className="btn-close-x" onClick={() => setShowAddCustomerModal(false)} style={{ fontSize: '22px', background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>×</button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const cleanPhone = (newCust.phone || '').replace(/\D/g, '');
              if (cleanPhone.length !== 10) {
                showToast("⚠️ Please enter a valid 10-digit mobile number.");
                return;
              }
              addCustomer({
                ...newCust,
                phone: `+91 ${cleanPhone}`
              });
              setShowAddCustomerModal(false);
            }} style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="form-group-looks">
                <label style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px', borderRadius: '5px', background: 'rgba(124, 58, 237, 0.12)', color: '#7C3AED' }}>
                    <User size={12} strokeWidth={2.5} />
                  </span>
                  <span>Customer Name</span> <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <input type="text" required className="looks-input" placeholder="Enter customer full name" value={newCust.name} onChange={(e) => setNewCust({ ...newCust, name: e.target.value })} />
              </div>

              <div className="form-group-looks-grid">
                <div className="form-group-looks">
                  <label style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px', borderRadius: '5px', background: 'rgba(22, 163, 74, 0.12)', color: '#16A34A' }}>
                      <Phone size={12} strokeWidth={2.5} />
                    </span>
                    <span>Mobile Number</span> <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <input
                    type="tel"
                    inputMode="numeric"
                    required
                    maxLength={10}
                    pattern="[0-9]{10}"
                    className="looks-input"
                    placeholder="10-digit mobile number"
                    value={newCust.phone}
                    onChange={(e) => setNewCust({ ...newCust, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                  />
                  {newCust.phone ? (
                    newCust.phone.length === 10 ? (
                      <small style={{ color: '#10B981', fontSize: '11px', display: 'block', marginTop: '3px', fontWeight: 600 }}>✓ Valid 10-digit number</small>
                    ) : (
                      <small style={{ color: '#EF4444', fontSize: '11px', display: 'block', marginTop: '3px' }}>10 digits required ({newCust.phone.length}/10)</small>
                    )
                  ) : null}
                </div>
                <div className="form-group-looks">
                  <label style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px', borderRadius: '5px', background: 'rgba(2, 132, 199, 0.12)', color: '#0284C7' }}>
                      <Mail size={12} strokeWidth={2.5} />
                    </span>
                    <span>Email Address</span>
                  </label>
                  <input type="email" className="looks-input" placeholder="client@example.com" value={newCust.email} onChange={(e) => setNewCust({ ...newCust, email: e.target.value })} />
                </div>
              </div>

              <div className="form-group-looks-grid">
                <div className="form-group-looks">
                  <label style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px', borderRadius: '5px', background: 'rgba(79, 70, 229, 0.12)', color: '#4F46E5' }}>
                      <UserCheck size={12} strokeWidth={2.5} />
                    </span>
                    <span>Gender</span>
                  </label>
                  <select className="looks-input" value={newCust.gender || ''} onChange={(e) => setNewCust({ ...newCust, gender: e.target.value })}>
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="form-group-looks">
                  <label style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px', borderRadius: '5px', background: 'rgba(217, 119, 6, 0.12)', color: '#D97706' }}>
                      <CalendarDays size={12} strokeWidth={2.5} />
                    </span>
                    <span>Date of Birth</span>
                  </label>
                  <input type="date" className="looks-input" value={newCust.dob || ''} onChange={(e) => setNewCust({ ...newCust, dob: e.target.value })} />
                </div>
              </div>

              <div className="form-group-looks">
                <label style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px', borderRadius: '5px', background: 'rgba(225, 29, 72, 0.12)', color: '#E11D48' }}>
                    <MapPin size={12} strokeWidth={2.5} />
                  </span>
                  <span>Address</span>
                </label>
                <textarea className="looks-input" rows={2} placeholder="Enter street address" value={newCust.address || ''} onChange={(e) => setNewCust({ ...newCust, address: e.target.value })}></textarea>
              </div>

              <div className="form-group-looks-grid">
                <div className="form-group-looks">
                  <label style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px', borderRadius: '5px', background: 'rgba(2, 132, 199, 0.12)', color: '#0284C7' }}>
                      <Building2 size={12} strokeWidth={2.5} />
                    </span>
                    <span>City</span>
                  </label>
                  <input type="text" className="looks-input" placeholder="e.g. Mumbai" value={newCust.city || ''} onChange={(e) => setNewCust({ ...newCust, city: e.target.value })} />
                </div>
                <div className="form-group-looks">
                  <label style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px', borderRadius: '5px', background: 'rgba(217, 119, 6, 0.12)', color: '#D97706' }}>
                      <Award size={12} strokeWidth={2.5} />
                    </span>
                    <span>Customer Type</span>
                  </label>
                  <select className="looks-input" value={newCust.type || 'Regular'} onChange={(e) => setNewCust({ ...newCust, type: e.target.value })}>
                    <option value="Regular">Regular</option>
                    <option value="New">New</option>
                    <option value="VIP">VIP</option>
                  </select>
                </div>
              </div>

              <div className="form-group-looks">
                <label style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px', borderRadius: '5px', background: 'rgba(71, 85, 105, 0.12)', color: '#475569' }}>
                    <FileText size={12} strokeWidth={2.5} />
                  </span>
                  <span>Notes / Preferences</span>
                </label>
                <textarea className="looks-input" rows={2} placeholder="Any preferences, allergies, or requirements..." value={newCust.notes || ''} onChange={(e) => setNewCust({ ...newCust, notes: e.target.value })}></textarea>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '6px' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowAddCustomerModal(false)} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #D1D5DB', background: 'white', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
                <button type="submit" className="btn-gold-action" style={{ flex: 1, padding: '10px', borderRadius: '8px', fontWeight: 600 }}>Save Customer</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 🛍️ ORDER DETAILS & PACKING SLIP MODAL */}
      {/* ========================================================================= */}
      {selectedOrderDetails && (
        <div
          className="looks-modal-backdrop"
          style={{
            zIndex: 99999,
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setSelectedOrderDetails(null)}
        >
          <div
            className="looks-modal-window"
            style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              maxWidth: '780px',
              width: '94%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '24px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="modal-top" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E2E8F0', paddingBottom: '14px', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(217, 119, 6, 0.12)', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ShoppingCart size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                    Order #{selectedOrderDetails.orderId || selectedOrderDetails.id}
                  </h3>
                  <span style={{ fontSize: '12px', color: '#64748B' }}>
                    Placed on {selectedOrderDetails.date || 'Today'} • White-Glove Boutique Dispatch
                  </span>
                </div>
              </div>
              <button
                className="btn-close-x"
                onClick={() => setSelectedOrderDetails(null)}
                style={{ fontSize: '24px', background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748B', display: 'flex', alignItems: 'center', lineHeight: 1 }}
              >
                ×
              </button>
            </div>

            {/* Customer & Delivery Information */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px', marginBottom: '20px' }}>
              {/* Shipping Destination */}
              <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', color: '#E11D48', fontWeight: 700, fontSize: '12.5px' }}>
                  <MapPin size={14} /> Shipping Destination
                </div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>
                  {selectedOrderDetails.customer?.name || 'Valued Client'}
                </div>
                <div style={{ fontSize: '12.5px', color: '#475569', marginTop: '3px', lineHeight: 1.4 }}>
                  {selectedOrderDetails.customer?.address || 'Flagship Delivery Address'}<br />
                  {selectedOrderDetails.customer?.landmark ? `Landmark: ${selectedOrderDetails.customer.landmark}` : ''}
                  {selectedOrderDetails.customer?.city ? `${selectedOrderDetails.customer.city}, ` : ''}
                  {selectedOrderDetails.customer?.pincode || ''}
                </div>
                <div style={{ marginTop: '6px', fontSize: '12px', color: '#64748B', display: 'flex', gap: '10px' }}>
                  <span>📞 {selectedOrderDetails.customer?.phone || 'N/A'}</span>
                  <span>✉️ {selectedOrderDetails.customer?.email || 'N/A'}</span>
                </div>
              </div>

              {/* Payment & Delivery Status */}
              <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', color: '#0284C7', fontWeight: 700, fontSize: '12.5px' }}>
                  <CreditCard size={14} /> Payment & Fulfillment
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '12px', color: '#64748B' }}>Payment Method:</span>
                  <strong style={{ fontSize: '12.5px', color: '#0F172A' }}>{selectedOrderDetails.paymentMethod || 'UPI'}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '12px', color: '#64748B' }}>Payment Status:</span>
                  <span style={{
                    padding: '2px 8px',
                    borderRadius: '5px',
                    fontSize: '11px',
                    fontWeight: 700,
                    background: (selectedOrderDetails.paymentStatus || 'Paid').toLowerCase() === 'paid' ? 'rgba(22, 163, 74, 0.12)' : 'rgba(217, 119, 6, 0.12)',
                    color: (selectedOrderDetails.paymentStatus || 'Paid').toLowerCase() === 'paid' ? '#16A34A' : '#D97706'
                  }}>
                    {selectedOrderDetails.paymentStatus || 'Paid'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', color: '#64748B' }}>Delivery Speed:</span>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#7C3AED' }}>
                    {selectedOrderDetails.deliverySpeed || 'Standard White-Glove'}
                  </span>
                </div>
                {selectedOrderDetails.notes && (
                  <div style={{ marginTop: '8px', padding: '6px 10px', background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '6px', fontSize: '11.5px', color: '#92400E' }}>
                    <strong>Note:</strong> {selectedOrderDetails.notes}
                  </div>
                )}
              </div>
            </div>

            {/* Ordered Items Table */}
            <div style={{ marginBottom: '18px' }}>
              <h4 style={{ fontSize: '13.5px', fontWeight: 700, color: '#0F172A', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Package size={15} color="#0D9488" /> Ordered Products Breakdown
              </h4>
              <div style={{ border: '1px solid #E2E8F0', borderRadius: '8px', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px' }}>
                  <thead style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                    <tr>
                      <th style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 700, color: '#475569' }}>Product</th>
                      <th style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 700, color: '#475569' }}>Brand</th>
                      <th style={{ padding: '8px 12px', textAlign: 'center', fontWeight: 700, color: '#475569' }}>Unit Qty</th>
                      <th style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 700, color: '#475569' }}>Price</th>
                      <th style={{ padding: '8px 12px', textAlign: 'center', fontWeight: 700, color: '#475569' }}>Qty</th>
                      <th style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 700, color: '#475569' }}>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(selectedOrderDetails.items || []).map((item, idx) => {
                      const itemSubtotal = (Number(item.price) || 0) * (Number(item.quantity) || 1);
                      return (
                        <tr key={idx} style={{ borderBottom: '1px solid #F1F5F9' }}>
                          <td style={{ padding: '10px 12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <img
                              src={item.image || 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=100&q=80'}
                              alt={item.name}
                              onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=100&q=80'; }}
                              style={{ width: '32px', height: '32px', borderRadius: '6px', objectFit: 'cover', border: '1px solid #E2E8F0' }}
                            />
                            <strong style={{ color: '#0F172A' }}>{item.name}</strong>
                          </td>
                          <td style={{ padding: '10px 12px', color: '#64748B' }}>{item.brand || "L'Oréal"}</td>
                          <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                            <span style={{ padding: '2px 6px', background: 'rgba(13, 148, 136, 0.08)', color: '#0D9488', borderRadius: '4px', fontWeight: 700, fontSize: '11px' }}>
                              {item.unitQuantity || item.volume || '100ml'}
                            </span>
                          </td>
                          <td style={{ padding: '10px 12px', textAlign: 'right', color: '#0F172A' }}>₹{Number(item.price || 0).toLocaleString('en-IN')}</td>
                          <td style={{ padding: '10px 12px', textAlign: 'center', fontWeight: 700 }}>×{item.quantity || 1}</td>
                          <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 700, color: '#0F172A' }}>₹{Number(itemSubtotal).toLocaleString('en-IN')}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Financial Total Summary */}
            <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '14px', marginBottom: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', color: '#64748B', marginBottom: '4px' }}>
                <span>Subtotal ({selectedOrderDetails.items?.length || 0} items):</span>
                <span>₹{Number(selectedOrderDetails.subtotal || selectedOrderDetails.totalAmount).toLocaleString('en-IN')}</span>
              </div>
              {selectedOrderDetails.discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', color: '#16A34A', fontWeight: 600, marginBottom: '4px' }}>
                  <span>Coupon Discount ({selectedOrderDetails.couponCode || 'PROMO'}):</span>
                  <span>-₹{Number(selectedOrderDetails.discount).toLocaleString('en-IN')}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', color: '#64748B', marginBottom: '4px' }}>
                <span>White-Glove Shipping & Handling:</span>
                <span>{selectedOrderDetails.shipping > 0 ? `₹${selectedOrderDetails.shipping}` : 'Free'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', fontWeight: 800, color: '#0F172A', paddingTop: '8px', borderTop: '1px solid #E2E8F0', marginTop: '6px' }}>
                <span>Grand Total:</span>
                <span style={{ color: '#D97706' }}>₹{Number(selectedOrderDetails.totalAmount).toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Quick Status Changers */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '12.5px', fontWeight: 700, color: '#475569', marginBottom: '8px', display: 'block' }}>
                Quick Update Dispatch Status:
              </label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(st => (
                  <button
                    key={st}
                    onClick={() => {
                      updateOrderStatus(selectedOrderDetails.orderId || selectedOrderDetails.id, st);
                      setSelectedOrderDetails(prev => ({ ...prev, status: st }));
                    }}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      border: selectedOrderDetails.status === st ? '2px solid #0F172A' : '1px solid #CBD5E1',
                      background: selectedOrderDetails.status === st ? '#0F172A' : '#FFFFFF',
                      color: selectedOrderDetails.status === st ? '#FFFFFF' : '#334155'
                    }}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Footer Buttons */}
            <div style={{ display: 'flex', gap: '12px', borderTop: '1px solid #E2E8F0', paddingTop: '14px' }}>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setSelectedOrderDetails(null)}
                style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1', background: '#FFFFFF', cursor: 'pointer', fontWeight: 600 }}
              >
                Close
              </button>
              <button
                type="button"
                className="btn-gold-action"
                onClick={() => window.print()}
                style={{ flex: 1, padding: '10px', borderRadius: '8px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
              >
                <Printer size={15} /> Print Packing Slip
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 11. POS Printed Receipt Modal */}
      {showPOSReceiptModal && lastGeneratedInvoice && (
        <div className="modal-backdrop show" onClick={() => setShowPOSReceiptModal(false)}>
          <div
            className="modal-card pos-receipt-modal-card"
            style={{ maxWidth: '540px', width: '95%', maxHeight: '92vh', overflowY: 'auto', padding: '24px' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Title & Close Button */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', marginBottom: '16px' }}>
              <button
                type="button"
                className="btn-close-modal"
                onClick={() => setShowPOSReceiptModal(false)}
                title="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* Receipt Slip Container */}
            <div className="pos-thermal-slip" style={{ background: '#FFFFFF', border: '1.5px solid #E2E8F0', borderRadius: '16px', padding: '22px', boxShadow: '0 4px 16px rgba(15, 23, 42, 0.04)' }}>
              {/* Salon Brand Header */}
              <div style={{ textAlign: 'center', borderBottom: '1px solid #E2E8F0', paddingBottom: '16px', marginBottom: '16px' }}>
                <h3 style={{ margin: 0, fontSize: '19px', fontWeight: 900, color: '#0F172A', letterSpacing: '0.6px', textTransform: 'uppercase' }}>
                  {salon.name || 'LOOKS PROFESSIONAL'}
                </h3>
                <p style={{ margin: '5px 0 0', fontSize: '12px', color: '#64748B', fontWeight: 500 }}>
                  {salon.address || 'Signature Unisex Salon & Spa'}
                </p>
                <p style={{ margin: '3px 0 0', fontSize: '12px', color: '#64748B', fontWeight: 500 }}>
                  Tel: {salon.phone || '+91 98200 12345'} &bull; GSTIN: 27AABCL1234F1Z5
                </p>
                <div style={{ marginTop: '10px', display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 14px', borderRadius: '20px', background: '#F0FDFA', color: '#0D9488', fontSize: '11px', fontWeight: 800, letterSpacing: '0.5px' }}>
                  TAX INVOICE & RECEIPT
                </div>
              </div>

              {/* Invoice & Client Information Card */}
              <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '14px 16px', marginBottom: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '12px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ color: '#64748B' }}>Invoice:</span>
                      <strong style={{ color: '#0D9488', fontWeight: 800 }}>{lastGeneratedInvoice.id}</strong>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ color: '#64748B' }}>Date:</span>
                      <strong style={{ color: '#0F172A' }}>{lastGeneratedInvoice.date} {lastGeneratedInvoice.time}</strong>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ color: '#64748B' }}>Stylist:</span>
                      <strong style={{ color: '#0F172A' }}>{lastGeneratedInvoice.staffName}</strong>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '6px' }}>
                      <span style={{ color: '#64748B' }}>Client:</span>
                      <strong style={{ color: '#0F172A' }}>{lastGeneratedInvoice.customerName}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '6px' }}>
                      <span style={{ color: '#64748B' }}>Phone:</span>
                      <strong style={{ color: '#0F172A' }}>{lastGeneratedInvoice.customerPhone}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '6px' }}>
                      <span style={{ color: '#64748B' }}>Mode:</span>
                      <span style={{ background: '#E0F2FE', color: '#0369A1', padding: '1px 8px', borderRadius: '6px', fontWeight: 800, fontSize: '11px' }}>
                        {lastGeneratedInvoice.paymentMethod}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Items Table - Spaced, Clean & Readable */}
              <div style={{ overflowX: 'auto', marginBottom: '16px' }}>
                <table className="pos-receipt-table">
                  <thead>
                    <tr>
                      <th style={{ textAlign: 'left', width: '45%' }}>Item Description</th>
                      <th style={{ textAlign: 'center', width: '12%' }}>Qty</th>
                      <th style={{ textAlign: 'right', width: '21%' }}>Rate</th>
                      <th style={{ textAlign: 'right', width: '22%' }}>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(lastGeneratedInvoice.items || []).map((it, idx) => (
                      <tr key={idx}>
                        <td>
                          <div style={{ fontWeight: 700, color: '#0F172A', fontSize: '12.5px', lineHeight: 1.35 }}>{it.name}</div>
                          {it.type && (
                            <span style={{ fontSize: '10px', color: '#64748B', background: '#F1F5F9', padding: '1px 5px', borderRadius: '4px', display: 'inline-block', marginTop: '2px' }}>
                              {it.type}
                            </span>
                          )}
                        </td>
                        <td style={{ textAlign: 'center', fontWeight: 600, color: '#334155' }}>{it.qty}</td>
                        <td style={{ textAlign: 'right', color: '#475569', fontWeight: 600 }}>₹{it.price.toLocaleString()}</td>
                        <td style={{ textAlign: 'right', fontWeight: 800, color: '#0F172A' }}>₹{(it.price * it.qty).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Calculation Summary Breakdown */}
              <div style={{ borderTop: '1.5px solid #E2E8F0', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569', fontWeight: 600 }}>
                  <span>Subtotal</span>
                  <span style={{ color: '#0F172A' }}>₹{lastGeneratedInvoice.subtotal.toLocaleString()}</span>
                </div>

                {lastGeneratedInvoice.tax > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569', fontWeight: 600 }}>
                    <span>GST (18% CGST + SGST)</span>
                    <span style={{ color: '#0D9488', fontWeight: 700 }}>+ ₹{lastGeneratedInvoice.tax.toLocaleString()}</span>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', background: '#F8FAFC', padding: '8px 12px', borderRadius: '8px', fontWeight: 700 }}>
                  <span style={{ color: '#334155' }}>Total (Price + GST)</span>
                  <span style={{ color: '#0F172A' }}>₹{(lastGeneratedInvoice.subtotal + (lastGeneratedInvoice.tax || 0)).toLocaleString()}</span>
                </div>

                {lastGeneratedInvoice.discount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#16A34A', fontWeight: 700 }}>
                    <span>Discount</span>
                    <span>- ₹{lastGeneratedInvoice.discount.toLocaleString()}</span>
                  </div>
                )}

                {/* Net Paid Highlight Banner */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)', color: '#FFFFFF', padding: '14px 18px', borderRadius: '12px', marginTop: '6px', boxShadow: '0 4px 14px rgba(15, 23, 42, 0.15)' }}>
                  <div>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: '#2DD4BF', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
                      NET PAID ({lastGeneratedInvoice.paymentMethod})
                    </span>
                    <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '2px' }}>Fully Paid & Cleared</div>
                  </div>
                  <div style={{ fontSize: '22px', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.3px' }}>
                    ₹{lastGeneratedInvoice.totalAmount.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Thank You Note */}
              <div style={{ textAlign: 'center', marginTop: '18px', borderTop: '1px dashed #E2E8F0', paddingTop: '14px' }}>
                <p style={{ margin: 0, fontSize: '12px', fontWeight: 700, color: '#334155' }}>
                  Thank you for choosing {salon.name || 'Looks Professional'}! ✨
                </p>
                <p style={{ margin: '3px 0 0', fontSize: '11px', color: '#94A3B8' }}>
                  Visit again for a 5-star rejuvenating experience.
                </p>
              </div>
            </div>

            {/* Bottom Actions */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '18px' }}>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setShowPOSReceiptModal(false)}
                style={{ flex: 1, height: '44px', borderRadius: '10px', border: '1.5px solid #CBD5E1', background: '#F8FAFC', cursor: 'pointer', fontWeight: 700, fontSize: '13px', color: '#475569' }}
              >
                Close & Next Bill
              </button>
              <button
                type="button"
                className="pos-btn-create-pay"
                onClick={() => window.print()}
                style={{ flex: 1.4, height: '44px', borderRadius: '10px', fontWeight: 800, fontSize: '13.5px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <Printer size={16} /> Print Receipt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 📄 PREVIEW PDF REPORT MODAL (MATCHING SCREENSHOT) */}
      {/* ========================================================================= */}
      {showPdfPreviewModal && (
        <div
          className="looks-modal-backdrop"
          onClick={() => setShowPdfPreviewModal(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.5)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '16px'
          }}
        >
          <div
            className="looks-modal-window"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              maxWidth: '820px',
              width: '95%',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              overflow: 'hidden',
              border: '1px solid #E2E8F0',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '20px 24px 16px',
                borderBottom: '1px solid #F1F5F9'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    background: '#E0F2FE',
                    color: '#0284C7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <Download size={20} strokeWidth={2.4} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.2px' }}>
                    Preview PDF Report
                  </h3>
                  <p style={{ margin: '3px 0 0', fontSize: '13px', color: '#64748B' }}>
                    Review the data before downloading.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowPdfPreviewModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94A3B8',
                  cursor: 'pointer',
                  padding: '6px',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  lineHeight: 1
                }}
                title="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body: Table Preview matching Screenshot 2 */}
            <div style={{ padding: '20px 24px' }}>
              <div
                style={{
                  background: '#F8FAFC',
                  borderRadius: '10px',
                  border: '1px solid #E2E8F0',
                  overflow: 'hidden'
                }}
              >
                <div style={{ maxHeight: '330px', overflowX: 'auto', overflowY: 'auto' }}>
                  {/* REVENUE REPORT PREVIEW */}
                  {pdfPreviewTab === 'revenue' && (
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left', minWidth: '720px' }}>
                      <thead>
                        <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                          <th style={{ padding: '12px 16px', fontWeight: 700, color: '#475569', fontSize: '12px' }}>Invoice ID</th>
                          <th style={{ padding: '12px 16px', fontWeight: 700, color: '#475569', fontSize: '12px' }}>Date</th>
                          <th style={{ padding: '12px 16px', fontWeight: 700, color: '#475569', fontSize: '12px' }}>Customer Name</th>
                          <th style={{ padding: '12px 16px', fontWeight: 700, color: '#475569', fontSize: '12px' }}>Payment Method</th>
                          <th style={{ padding: '12px 16px', fontWeight: 700, color: '#475569', fontSize: '12px', textAlign: 'right' }}>Subtotal</th>
                          <th style={{ padding: '12px 16px', fontWeight: 700, color: '#475569', fontSize: '12px', textAlign: 'right' }}>Discount</th>
                          <th style={{ padding: '12px 16px', fontWeight: 700, color: '#475569', fontSize: '12px', textAlign: 'right' }}>Tax</th>
                          <th style={{ padding: '12px 16px', fontWeight: 700, color: '#475569', fontSize: '12px', textAlign: 'right' }}>Total (INR)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {((data.invoices && data.invoices.length > 0) ? data.invoices : [
                          { id: 'INV-2026-1002', date: '2026-10-03', customerName: 'abhishek', paymentMethod: 'UPI', subtotal: 8100, discount: 956, tax: 1458, totalAmount: 8602 },
                          { id: 'INV-2026-2462', date: '2026-10-03', customerName: 'riyaa', paymentMethod: 'UPI', subtotal: 3800, discount: 0, tax: 684, totalAmount: 4484 }
                        ]).map((inv, idx) => (
                          <tr key={inv.id || idx} style={{ background: '#FFFFFF', borderBottom: '1px solid #F1F5F9' }}>
                            <td style={{ padding: '12px 16px', fontWeight: 700, color: '#1E293B' }}>{inv.id}</td>
                            <td style={{ padding: '12px 16px', color: '#475569' }}>{inv.date}</td>
                            <td style={{ padding: '12px 16px', color: '#1E293B' }}>{inv.customerName}</td>
                            <td style={{ padding: '12px 16px', color: '#475569' }}>{inv.paymentMethod}</td>
                            <td style={{ padding: '12px 16px', textAlign: 'right', color: '#475569' }}>{inv.subtotal}</td>
                            <td style={{ padding: '12px 16px', textAlign: 'right', color: '#475569' }}>{inv.discount || 0}</td>
                            <td style={{ padding: '12px 16px', textAlign: 'right', color: '#475569' }}>{inv.tax || 0}</td>
                            <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 700, color: '#1E293B' }}>{inv.totalAmount}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}

                  {/* EMPLOYEE REPORT PREVIEW */}
                  {pdfPreviewTab === 'employee' && (
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left', minWidth: '700px' }}>
                      <thead>
                        <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                          <th style={{ padding: '12px 16px', fontWeight: 700, color: '#475569', fontSize: '12px' }}>Employee Name</th>
                          <th style={{ padding: '12px 16px', fontWeight: 700, color: '#475569', fontSize: '12px' }}>Role</th>
                          <th style={{ padding: '12px 16px', fontWeight: 700, color: '#475569', fontSize: '12px' }}>Services Billed</th>
                          <th style={{ padding: '12px 16px', fontWeight: 700, color: '#475569', fontSize: '12px', textAlign: 'right' }}>Gross Value (₹)</th>
                          <th style={{ padding: '12px 16px', fontWeight: 700, color: '#475569', fontSize: '12px', textAlign: 'right' }}>Commission (₹)</th>
                          <th style={{ padding: '12px 16px', fontWeight: 700, color: '#475569', fontSize: '12px', textAlign: 'center' }}>Rating</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(topEmployees || []).map((e, idx) => (
                          <tr key={idx} style={{ background: '#FFFFFF', borderBottom: '1px solid #F1F5F9' }}>
                            <td style={{ padding: '12px 16px', fontWeight: 700, color: '#1E293B' }}>{e.name}</td>
                            <td style={{ padding: '12px 16px', color: '#475569' }}>{e.role}</td>
                            <td style={{ padding: '12px 16px', color: '#475569' }}>{e.services} services</td>
                            <td style={{ padding: '12px 16px', textAlign: 'right', color: '#475569' }}>₹{(e.revenue || 0).toLocaleString('en-IN')}</td>
                            <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 700, color: '#0F172A' }}>₹{(e.incentive || 0).toLocaleString('en-IN')}</td>
                            <td style={{ padding: '12px 16px', textAlign: 'center', color: '#F59E0B', fontWeight: 700 }}>⭐ 4.95</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}

                  {/* INCENTIVE REPORT PREVIEW */}
                  {pdfPreviewTab === 'incentive' && (
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left', minWidth: '650px' }}>
                      <thead>
                        <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                          <th style={{ padding: '12px 16px', fontWeight: 700, color: '#475569', fontSize: '12px' }}>Stylist</th>
                          <th style={{ padding: '12px 16px', fontWeight: 700, color: '#475569', fontSize: '12px', textAlign: 'center' }}>Services Billed</th>
                          <th style={{ padding: '12px 16px', fontWeight: 700, color: '#475569', fontSize: '12px', textAlign: 'right' }}>Base Revenue (₹)</th>
                          <th style={{ padding: '12px 16px', fontWeight: 700, color: '#475569', fontSize: '12px', textAlign: 'right' }}>Incentive Accrued (₹)</th>
                          <th style={{ padding: '12px 16px', fontWeight: 700, color: '#475569', fontSize: '12px', textAlign: 'center' }}>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(topEmployees || []).map((e, idx) => (
                          <tr key={idx} style={{ background: '#FFFFFF', borderBottom: '1px solid #F1F5F9' }}>
                            <td style={{ padding: '12px 16px', fontWeight: 700, color: '#1E293B' }}>{e.name}</td>
                            <td style={{ padding: '12px 16px', textAlign: 'center', color: '#475569' }}>{e.services}</td>
                            <td style={{ padding: '12px 16px', textAlign: 'right', color: '#475569' }}>₹{(e.revenue || 0).toLocaleString('en-IN')}</td>
                            <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 700, color: '#0F172A' }}>₹{(e.incentive || 0).toLocaleString('en-IN')}</td>
                            <td style={{ padding: '12px 16px', textAlign: 'center', color: '#16A34A', fontWeight: 700 }}>Available on Payroll</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}

                  {/* INVENTORY REPORT PREVIEW */}
                  {pdfPreviewTab === 'inventory' && (
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left', minWidth: '680px' }}>
                      <thead>
                        <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                          <th style={{ padding: '12px 16px', fontWeight: 700, color: '#475569', fontSize: '12px' }}>Category</th>
                          <th style={{ padding: '12px 16px', fontWeight: 700, color: '#475569', fontSize: '12px', textAlign: 'center' }}>Total Product Items</th>
                          <th style={{ padding: '12px 16px', fontWeight: 700, color: '#475569', fontSize: '12px', textAlign: 'center' }}>Total Units on Hand</th>
                          <th style={{ padding: '12px 16px', fontWeight: 700, color: '#475569', fontSize: '12px', textAlign: 'right' }}>Total Asset Value (Cost)</th>
                          <th style={{ padding: '12px 16px', fontWeight: 700, color: '#475569', fontSize: '12px', textAlign: 'right' }}>Expected Retail Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(inventoryValuationList || []).map((it, idx) => (
                          <tr key={idx} style={{ background: '#FFFFFF', borderBottom: '1px solid #F1F5F9' }}>
                            <td style={{ padding: '12px 16px', fontWeight: 700, color: '#1E293B' }}>{it.category}</td>
                            <td style={{ padding: '12px 16px', textAlign: 'center', color: '#475569' }}>{it.itemsCount}</td>
                            <td style={{ padding: '12px 16px', textAlign: 'center', color: '#475569' }}>{it.totalUnits} units</td>
                            <td style={{ padding: '12px 16px', textAlign: 'right', color: '#475569' }}>₹{(it.assetCost || 0).toLocaleString('en-IN')}</td>
                            <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 700, color: '#1E293B' }}>₹{(it.retailValue || 0).toLocaleString('en-IN')}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}

                  {/* LEADS REPORT PREVIEW */}
                  {pdfPreviewTab === 'leads' && (
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left', minWidth: '600px' }}>
                      <thead>
                        <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                          <th style={{ padding: '12px 16px', fontWeight: 700, color: '#475569', fontSize: '12px' }}>Source Channel</th>
                          <th style={{ padding: '12px 16px', fontWeight: 700, color: '#475569', fontSize: '12px', textAlign: 'center' }}>Total Leads</th>
                          <th style={{ padding: '12px 16px', fontWeight: 700, color: '#475569', fontSize: '12px', textAlign: 'center' }}>Converted Clients</th>
                          <th style={{ padding: '12px 16px', fontWeight: 700, color: '#475569', fontSize: '12px', textAlign: 'right' }}>Conversion Rate</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(leadConversionsList || []).map((it, idx) => (
                          <tr key={idx} style={{ background: '#FFFFFF', borderBottom: '1px solid #F1F5F9' }}>
                            <td style={{ padding: '12px 16px', fontWeight: 700, color: '#1E293B' }}>{it.source}</td>
                            <td style={{ padding: '12px 16px', textAlign: 'center', color: '#475569' }}>{it.total}</td>
                            <td style={{ padding: '12px 16px', textAlign: 'center', color: '#475569' }}>{it.converted}</td>
                            <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 700, color: '#1E293B' }}>{it.rate}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer matching Screenshot 2 */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: '12px',
                padding: '16px 24px 22px',
                borderTop: '1px solid #F1F5F9',
                background: '#FFFFFF'
              }}
            >
              <button
                type="button"
                onClick={() => setShowPdfPreviewModal(false)}
                style={{
                  padding: '9px 22px',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1',
                  background: '#FFFFFF',
                  color: '#475569',
                  fontSize: '13.5px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleConfirmDownloadPdf(pdfPreviewTab)}
                style={{
                  padding: '9px 24px',
                  borderRadius: '8px',
                  border: 'none',
                  background: '#D4A373',
                  color: '#1E293B',
                  fontSize: '13.5px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(212, 163, 115, 0.3)',
                  transition: 'all 0.15s ease'
                }}
              >
                Confirm Download
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
