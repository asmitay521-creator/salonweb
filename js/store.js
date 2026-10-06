/**
 * LUMIÈRE & CROWN Luxury Unisex Salon & Spa
 * Reactive State Management & Store (LocalStorage Powered)
 */

class SalonStore {
  constructor() {
    this.STORAGE_KEY = "LUMIERE_SALON_STATE_V1";
    this.listeners = [];
    this.init();
  }

  init() {
    const existing = localStorage.getItem(this.STORAGE_KEY);
    if (!existing) {
      this.state = JSON.parse(JSON.stringify(window.INITIAL_SALON_DATA));
      this.state.currentSalonId = "salon_01";
      this.state.currentUser = {
        role: "customer", // 'customer' | 'admin' | 'superadmin'
        id: "cust_01",
        name: "Priya Deshmukh",
        email: "priya.deshmukh@gmail.com",
        phone: "+91 98920 11223"
      };
      this.state.adminPermissions = {
        appointments: true,
        customers: true,
        services: true,
        staff: true,
        billing: true,
        inventory: true,
        expenses: true,
        reports: true,
        settings: true
      };
      this.save();
    } else {
      try {
        this.state = JSON.parse(existing);
      } catch (e) {
        this.state = JSON.parse(JSON.stringify(window.INITIAL_SALON_DATA));
        this.save();
      }
    }
  }

  save() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.state));
    this.notify();
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(cb => cb(this.state));
  }

  // --- Current User & Branch Switchers ---
  setCurrentUser(userObj) {
    this.state.currentUser = userObj;
    this.save();
  }

  setCurrentSalon(salonId) {
    this.state.currentSalonId = salonId;
    this.save();
  }

  getCurrentSalon() {
    return this.state.salons.find(s => s.id === this.state.currentSalonId) || this.state.salons[0];
  }

  // --- Appointments Management ---
  getAppointments(salonId = null) {
    if (salonId) {
      return this.state.appointments.filter(a => a.salonId === salonId);
    }
    return this.state.appointments;
  }

  createAppointment(aptData) {
    const id = "apt_" + Date.now().toString().slice(-6);
    const newApt = {
      id,
      salonId: aptData.salonId || this.state.currentSalonId,
      customerId: aptData.customerId || "cust_guest",
      customerName: aptData.customerName,
      customerPhone: aptData.customerPhone,
      customerEmail: aptData.customerEmail || "",
      serviceId: aptData.serviceId,
      serviceName: aptData.serviceName,
      gender: aptData.gender || "unisex",
      staffId: aptData.staffId || "stf_01",
      staffName: aptData.staffName || "Assigned Master Stylist",
      date: aptData.date,
      time: aptData.time,
      duration: aptData.duration || 45,
      amount: aptData.amount,
      discount: aptData.discount || 0,
      tax: aptData.tax || Math.round(aptData.amount * 0.18),
      finalAmount: aptData.finalAmount || (aptData.amount - (aptData.discount || 0) + Math.round(aptData.amount * 0.18)),
      couponCode: aptData.couponCode || "",
      paymentMethod: aptData.paymentMethod || "Pay at Salon",
      paymentStatus: aptData.paymentStatus || "Pending",
      status: "Confirmed", // Initial status: Confirmed
      notes: aptData.notes || "",
      createdAt: new Date().toISOString()
    };

    this.state.appointments.unshift(newApt);
    
    // Add audit log
    this.addAuditLog(`New appointment booked: #${id} for ${newApt.customerName}`, "Booking");

    // Also update / register customer if not exists
    this.recordCustomerVisit(newApt);

    this.save();
    return newApt;
  }

  updateAppointmentStatus(aptId, newStatus) {
    const apt = this.state.appointments.find(a => a.id === aptId);
    if (apt) {
      apt.status = newStatus;

      // If status changed to In-Service or Completed, update staff status
      if (newStatus === "In-Progress" || newStatus === "In-Service") {
        const staff = this.state.staff.find(s => s.id === apt.staffId);
        if (staff) staff.status = "In-Service";
      } else if (newStatus === "Completed") {
        const staff = this.state.staff.find(s => s.id === apt.staffId);
        if (staff) staff.status = "Available";
        apt.paymentStatus = "Paid";
      } else if (newStatus === "Cancelled") {
        const staff = this.state.staff.find(s => s.id === apt.staffId);
        if (staff) staff.status = "Available";
      }

      this.addAuditLog(`Appointment #${aptId} status changed to ${newStatus}`, "Service");
      this.save();
    }
  }

  // --- Customer History & Loyalty ---
  recordCustomerVisit(apt) {
    let cust = this.state.customers.find(c => c.phone === apt.customerPhone || c.id === apt.customerId);
    if (!cust) {
      cust = {
        id: "cust_" + Date.now().toString().slice(-5),
        name: apt.customerName,
        phone: apt.customerPhone,
        email: apt.customerEmail,
        tier: "Silver Member",
        loyaltyPoints: Math.round(apt.finalAmount * 0.05),
        totalVisits: 1,
        totalSpend: apt.finalAmount,
        lastVisit: apt.date,
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80"
      };
      this.state.customers.push(cust);
    } else {
      cust.totalVisits += 1;
      cust.totalSpend += (apt.finalAmount || 0);
      cust.loyaltyPoints += Math.round((apt.finalAmount || 0) * 0.05);
      cust.lastVisit = apt.date;
      if (cust.totalSpend > 50000) cust.tier = "Diamond VIP";
      else if (cust.totalSpend > 25000) cust.tier = "Platinum VIP";
      else if (cust.totalSpend > 10000) cust.tier = "Gold Member";
    }
  }

  // --- POS / Billing & Invoices ---
  generatePOSInvoice(invoiceData) {
    const invId = "INV-" + new Date().getFullYear() + "-" + Math.floor(1000 + Math.random() * 9000);
    const invoice = {
      id: invId,
      salonId: this.state.currentSalonId,
      date: new Date().toISOString().split("T")[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      customerName: invoiceData.customerName,
      customerPhone: invoiceData.customerPhone,
      customerEmail: invoiceData.customerEmail || "",
      items: invoiceData.items, // Array of { name, price, qty, type: 'service' | 'product' }
      subtotal: invoiceData.subtotal,
      discount: invoiceData.discount || 0,
      tax: invoiceData.tax,
      totalAmount: invoiceData.totalAmount,
      paymentMethod: invoiceData.paymentMethod || "Cash",
      staffId: invoiceData.staffId,
      staffName: invoiceData.staffName,
      status: "Paid"
    };

    if (!this.state.invoices) this.state.invoices = [];
    this.state.invoices.unshift(invoice);

    // If products were sold, deduct inventory stock
    if (invoiceData.items) {
      invoiceData.items.forEach(item => {
        if (item.type === "product" && item.productId) {
          this.deductProductStock(item.productId, item.qty || 1);
        }
      });
    }

    this.addAuditLog(`Generated POS Invoice #${invId} for ₹${invoice.totalAmount} (${invoice.paymentMethod})`, "Billing");
    this.save();
    return invoice;
  }

  // --- Inventory Management ---
  deductProductStock(productId, qty = 1) {
    const product = this.state.inventory.find(p => p.id === productId);
    if (product) {
      product.stock = Math.max(0, product.stock - qty);
      if (product.stock <= product.minStockAlert) {
        product.status = "Low Stock";
      }
      this.save();
    }
  }

  addStock(productId, qty) {
    const product = this.state.inventory.find(p => p.id === productId);
    if (product) {
      product.stock += parseInt(qty);
      if (product.stock > product.minStockAlert) {
        product.status = "In Stock";
      }
      this.addAuditLog(`Restocked ${qty} units of ${product.name}`, "Inventory");
      this.save();
    }
  }

  addProduct(productData) {
    const id = "prd_" + Date.now().toString().slice(-5);
    const newProduct = {
      id,
      salonId: this.state.currentSalonId,
      name: productData.name,
      category: productData.category,
      sku: productData.sku || "SKU-" + Math.floor(1000 + Math.random() * 9000),
      stock: parseInt(productData.stock || 0),
      minStockAlert: parseInt(productData.minStockAlert || 5),
      unitCost: parseFloat(productData.unitCost || 0),
      sellingPrice: parseFloat(productData.sellingPrice || 0),
      supplier: productData.supplier || "Official Distributor",
      status: parseInt(productData.stock) <= parseInt(productData.minStockAlert) ? "Low Stock" : "In Stock"
    };
    this.state.inventory.push(newProduct);
    this.addAuditLog(`Added new inventory item: ${newProduct.name}`, "Inventory");
    this.save();
  }

  // --- Staff Management ---
  addStaff(staffData) {
    const id = "stf_" + Date.now().toString().slice(-5);
    const newStaff = {
      id,
      salonId: this.state.currentSalonId,
      name: staffData.name,
      role: staffData.role,
      category: staffData.category || "Hair Specialist",
      gender: staffData.gender || "unisex",
      phone: staffData.phone,
      email: staffData.email,
      rating: 5.0,
      reviewsCount: 0,
      experience: staffData.experience || "3 Years",
      commissionRate: parseFloat(staffData.commissionRate || 10),
      status: "Available",
      photo: staffData.photo || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
      skills: staffData.skills ? staffData.skills.split(",").map(s => s.trim()) : ["Styling"]
    };
    this.state.staff.push(newStaff);
    this.addAuditLog(`Added new team member: ${newStaff.name} (${newStaff.role})`, "Staff");
    this.save();
  }

  toggleStaffStatus(staffId, newStatus) {
    const member = this.state.staff.find(s => s.id === staffId);
    if (member) {
      member.status = newStatus;
      this.save();
    }
  }

  // --- Expenses Tracker ---
  addExpense(expenseData) {
    const id = "exp_" + Date.now().toString().slice(-5);
    const newExp = {
      id,
      salonId: this.state.currentSalonId,
      category: expenseData.category,
      description: expenseData.description,
      amount: parseFloat(expenseData.amount),
      date: expenseData.date || new Date().toISOString().split("T")[0],
      paidBy: expenseData.paidBy || "Admin",
      paymentMode: expenseData.paymentMode || "UPI"
    };
    this.state.expenses.unshift(newExp);
    this.addAuditLog(`Recorded expense: ₹${newExp.amount} for ${newExp.description}`, "Expense");
    this.save();
  }

  // --- Coupons & Offers ---
  addCoupon(couponData) {
    const newCoupon = {
      code: couponData.code.toUpperCase().trim(),
      discountType: couponData.discountType, // 'percentage' | 'fixed'
      value: parseFloat(couponData.value),
      minSpend: parseFloat(couponData.minSpend || 0),
      description: couponData.description,
      validUntil: couponData.validUntil || "2026-12-31",
      usedCount: 0
    };
    this.state.coupons.push(newCoupon);
    this.addAuditLog(`Created coupon promo code: ${newCoupon.code}`, "Offers");
    this.save();
  }

  validateCoupon(code, amount) {
    if (!code) return { valid: false, message: "No coupon provided" };
    const coupon = this.state.coupons.find(c => c.code.toUpperCase() === code.toUpperCase());
    if (!coupon) return { valid: false, message: "Invalid Coupon Code" };
    if (amount < coupon.minSpend) {
      return { valid: false, message: `Minimum spend of ₹${coupon.minSpend} required for this coupon.` };
    }
    const discount = coupon.discountType === "percentage" 
      ? Math.round((amount * coupon.value) / 100)
      : Math.min(amount, coupon.value);
    
    return {
      valid: true,
      coupon,
      discountAmount: discount,
      message: `Coupon Applied! Saved ₹${discount}`
    };
  }

  // --- Super Admin Branch Management ---
  addSalonBranch(salonData) {
    const id = "salon_" + (this.state.salons.length + 1).toString().padStart(2, "0");
    const newSalon = {
      id,
      name: salonData.name,
      city: salonData.city,
      address: salonData.address,
      phone: salonData.phone,
      email: salonData.email,
      status: "Active",
      rating: 5.0,
      totalAppointments: 0,
      monthlyRevenue: 0,
      adminName: salonData.adminName,
      adminEmail: salonData.adminEmail,
      image: salonData.image || "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=800&q=80",
      taxRate: 18,
      currency: "₹",
      openingHours: salonData.openingHours || "09:00 AM - 09:30 PM"
    };
    this.state.salons.push(newSalon);
    this.addAuditLog(`Created new salon branch: ${newSalon.name} in ${newSalon.city}`, "SuperAdmin");
    this.save();
  }

  toggleSalonStatus(salonId) {
    const salon = this.state.salons.find(s => s.id === salonId);
    if (salon) {
      salon.status = salon.status === "Active" ? "Suspended" : "Active";
      this.addAuditLog(`Branch status changed: ${salon.name} is now ${salon.status}`, "SuperAdmin");
      this.save();
    }
  }

  // --- RBAC Permissions ---
  updateAdminPermissions(permissionsObj) {
    this.state.adminPermissions = { ...this.state.adminPermissions, ...permissionsObj };
    this.addAuditLog("Admin RBAC security permissions updated by Super Admin", "Security");
    this.save();
  }

  // --- Audit Logs ---
  addAuditLog(action, type = "General") {
    if (!this.state.auditLogs) this.state.auditLogs = [];
    const log = {
      id: "log_" + Date.now().toString().slice(-6),
      user: this.state.currentUser ? `${this.state.currentUser.name} (${this.state.currentUser.role})` : "System",
      action,
      type,
      timestamp: new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    this.state.auditLogs.unshift(log);
    if (this.state.auditLogs.length > 50) this.state.auditLogs.pop();
  }

  // --- Reset to Factory Defaults ---
  resetAll() {
    localStorage.removeItem(this.STORAGE_KEY);
    this.init();
  }
}

window.salonStore = new SalonStore();
