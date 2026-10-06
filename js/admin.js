/**
 * LUMIÈRE & CROWN Luxury Unisex Salon & Spa
 * Branch Admin Panel Controller (Operations, POS, Staff, Inventory, CRM)
 */

class AdminController {
  constructor(store) {
    this.store = store;
    this.currentModule = "dashboard";
    this.posCart = [];
    this.charts = {};
  }

  init() {
    this.bindAdminSidebar();
    this.refreshAdminData();
  }

  bindAdminSidebar() {
    document.querySelectorAll(".admin-nav-item").forEach(item => {
      item.addEventListener("click", (e) => {
        const mod = item.dataset.module;
        if (!mod) return;
        document.querySelectorAll(".admin-nav-item").forEach(i => i.classList.remove("active"));
        item.classList.add("active");
        this.switchModule(mod);
      });
    });
  }

  switchModule(moduleId) {
    this.currentModule = moduleId;
    document.querySelectorAll(".admin-module-pane").forEach(pane => {
      pane.style.display = "none";
    });
    const target = document.getElementById(`admin-mod-${moduleId}`);
    if (target) target.style.display = "block";

    this.renderCurrentModule();
  }

  refreshAdminData() {
    this.renderKPIs();
    this.renderCurrentModule();
    if (this.currentModule === "dashboard") {
      this.initOrUpdateCharts();
    }
  }

  renderCurrentModule() {
    switch (this.currentModule) {
      case "dashboard":
        this.renderDashboardAppointments();
        this.initOrUpdateCharts();
        break;
      case "appointments":
        this.renderAppointmentsTable();
        break;
      case "pos":
        this.renderPOSCatalog();
        this.renderPOSCart();
        break;
      case "customers":
        this.renderCustomersTable();
        break;
      case "services":
        this.renderServicesManagement();
        break;
      case "staff":
        this.renderStaffManagement();
        break;
      case "inventory":
        this.renderInventoryManagement();
        break;
      case "offers":
        this.renderOffersManagement();
        break;
      case "expenses":
        this.renderExpensesManagement();
        break;
      case "reports":
        this.renderReportsManagement();
        break;
      case "settings":
        this.renderSettings();
        break;
    }
    if (window.lucide) window.lucide.createIcons();
  }

  renderKPIs() {
    const salon = this.store.getCurrentSalon();
    const apts = this.store.getAppointments(salon.id);
    
    const todayStr = new Date().toISOString().split("T")[0];
    const todayApts = apts.filter(a => a.date === todayStr);
    const todayRev = todayApts
      .filter(a => a.status === "Completed" || a.status === "In-Progress" || a.paymentStatus === "Paid")
      .reduce((sum, a) => sum + (a.finalAmount || 0), 0);
    
    const pendingCount = apts.filter(a => a.status === "Pending").length;
    const completedCount = apts.filter(a => a.status === "Completed").length;
    const activeStaff = this.store.state.staff.filter(s => s.status === "Available" || s.status === "In-Service").length;
    const lowStockCount = this.store.state.inventory.filter(p => p.stock <= p.minStockAlert).length;
    
    const totalExp = this.store.state.expenses
      .filter(e => e.salonId === salon.id)
      .reduce((sum, e) => sum + (e.amount || 0), 0);

    // Update DOM badges & stats
    const setVal = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.innerText = val;
    };

    setVal("kpi-today-rev", `₹${todayRev.toLocaleString()}`);
    setVal("kpi-today-apts", todayApts.length);
    setVal("kpi-pending-apts", pendingCount);
    setVal("kpi-completed-apts", completedCount);
    setVal("kpi-active-staff", `${activeStaff} Active`);
    setVal("kpi-low-stock", `${lowStockCount} Items`);
    setVal("kpi-total-cust", this.store.state.customers.length);
    setVal("kpi-net-rev", `₹${(todayRev - (totalExp / 30)).toFixed(0)}`);
  }

  renderDashboardAppointments() {
    const tableBody = document.getElementById("dash-apts-table-body");
    if (!tableBody) return;

    const salon = this.store.getCurrentSalon();
    const apts = this.store.getAppointments(salon.id).slice(0, 5);

    tableBody.innerHTML = apts.map(a => `
      <tr>
        <td>
          <strong style="color:#fff;">#${a.id}</strong><br>
          <span style="font-size:11px; color:var(--text-muted);">${a.date} ${a.time}</span>
        </td>
        <td>
          <strong style="color:var(--gold-light);">${a.customerName}</strong><br>
          <span style="font-size:12px; color:var(--text-secondary);">${a.customerPhone}</span>
        </td>
        <td>
          <strong>${a.serviceName}</strong><br>
          <span style="font-size:11px; color:var(--text-muted);">Stylist: ${a.staffName}</span>
        </td>
        <td><span class="status-pill status-${a.status.toLowerCase().replace(' ', '-')}">${a.status}</span></td>
        <td><strong>₹${a.finalAmount.toLocaleString()}</strong></td>
        <td>
          <div class="step-actions">
            ${this.renderStatusActionButtons(a)}
          </div>
        </td>
      </tr>
    `).join("");
  }

  renderStatusActionButtons(a) {
    if (a.status === "Pending") {
      return `
        <button class="btn-step" onclick="window.adminCtrl.advanceStatus('${a.id}', 'Confirmed')" title="Confirm Booking">
          <i data-lucide="check" style="width:12px;height:12px;"></i> Confirm
        </button>
      `;
    } else if (a.status === "Confirmed") {
      return `
        <button class="btn-step" onclick="window.adminCtrl.advanceStatus('${a.id}', 'Checked-In')" title="Customer Arrived">
          <i data-lucide="log-in" style="width:12px;height:12px;"></i> Check-In
        </button>
      `;
    } else if (a.status === "Checked-In") {
      return `
        <button class="btn-step" onclick="window.adminCtrl.advanceStatus('${a.id}', 'In-Progress')" title="Start Styling">
          <i data-lucide="play" style="width:12px;height:12px;"></i> Start Service
        </button>
      `;
    } else if (a.status === "In-Progress") {
      return `
        <button class="btn-step" style="background:var(--accent-emerald); color:#fff; border-color:var(--accent-emerald);" onclick="window.adminCtrl.advanceStatus('${a.id}', 'Completed')" title="Finish & Mark Paid">
          <i data-lucide="check-circle-2" style="width:12px;height:12px;"></i> Complete & Bill
        </button>
      `;
    } else {
      return `
        <button class="btn-step" onclick="window.customerCtrl.viewInvoiceSlip('${a.id}')" title="Print Bill">
          <i data-lucide="printer" style="width:12px;height:12px;"></i> Invoice
        </button>
      `;
    }
  }

  advanceStatus(aptId, nextStatus) {
    this.store.updateAppointmentStatus(aptId, nextStatus);
    if (window.showAppToast) {
      window.showAppToast(`✅ Appointment #${aptId} updated to "${nextStatus}"`);
    }
    this.refreshAdminData();
    if (window.customerCtrl) window.customerCtrl.renderCustomerDashboard();
  }

  // --- All Appointments View ---
  renderAppointmentsTable(filterStatus = "all") {
    const tableBody = document.getElementById("all-apts-table-body");
    if (!tableBody) return;

    const salon = this.store.getCurrentSalon();
    let apts = this.store.getAppointments(salon.id);

    if (filterStatus !== "all") {
      apts = apts.filter(a => a.status.toLowerCase() === filterStatus.toLowerCase());
    }

    tableBody.innerHTML = apts.map(a => `
      <tr>
        <td><strong>#${a.id}</strong></td>
        <td>
          <strong style="color:var(--gold-light);">${a.customerName}</strong><br>
          <span style="font-size:12px; color:var(--text-secondary);">${a.customerPhone}</span>
        </td>
        <td>
          <strong>${a.serviceName}</strong><br>
          <span style="font-size:11px; color:var(--text-muted);">${a.duration} mins • ${a.gender}</span>
        </td>
        <td><strong>${a.staffName}</strong></td>
        <td>${a.date} <br><span style="font-size:11px; color:var(--text-gold);">${a.time}</span></td>
        <td><span class="status-pill status-${a.status.toLowerCase().replace(' ', '-')}">${a.status}</span></td>
        <td>
          <strong>₹${a.finalAmount.toLocaleString()}</strong><br>
          <span style="font-size:11px; color:var(--text-muted);">${a.paymentMethod} (${a.paymentStatus})</span>
        </td>
        <td>
          <div class="step-actions">
            ${this.renderStatusActionButtons(a)}
          </div>
        </td>
      </tr>
    `).join("");
  }

  // --- POS Billing Terminal ---
  renderPOSCatalog() {
    const servicesGrid = document.getElementById("pos-services-catalog");
    const productsGrid = document.getElementById("pos-products-catalog");
    if (!servicesGrid || !productsGrid) return;

    // Services Catalog
    servicesGrid.innerHTML = this.store.state.services.map(s => `
      <div class="pos-item-tile" onclick="window.adminCtrl.addToPOSCart('service', '${s.id}')"
           style="background:var(--bg-secondary); border:1px solid var(--border-subtle); padding:12px; border-radius:var(--radius-md); cursor:pointer; transition:var(--transition);">
        <strong style="font-size:13px; color:#fff; display:block;">${s.name}</strong>
        <div style="display:flex; justify-content:space-between; margin-top:6px; font-size:12px;">
          <span style="color:var(--gold-light); font-weight:700;">₹${s.price}</span>
          <span style="color:var(--text-muted);">${s.duration}m</span>
        </div>
      </div>
    `).join("");

    // Products Catalog
    productsGrid.innerHTML = this.store.state.inventory.map(p => `
      <div class="pos-item-tile" onclick="window.adminCtrl.addToPOSCart('product', '${p.id}')"
           style="background:var(--bg-secondary); border:1px solid var(--border-subtle); padding:12px; border-radius:var(--radius-md); cursor:pointer; transition:var(--transition);">
        <strong style="font-size:13px; color:#fff; display:block;">${p.name}</strong>
        <div style="display:flex; justify-content:space-between; margin-top:6px; font-size:12px;">
          <span style="color:var(--gold-light); font-weight:700;">₹${p.sellingPrice}</span>
          <span style="color:${p.stock <= p.minStockAlert ? 'var(--accent-rose)' : 'var(--text-muted)'};">Stock: ${p.stock}</span>
        </div>
      </div>
    `).join("");
  }

  addToPOSCart(type, itemId) {
    let item;
    if (type === "service") {
      const s = this.store.state.services.find(x => x.id === itemId);
      item = { type: "service", id: s.id, name: s.name, price: s.price, qty: 1 };
    } else {
      const p = this.store.state.inventory.find(x => x.id === itemId);
      if (p.stock <= 0) {
        if (window.showAppToast) window.showAppToast("⚠️ Item is out of stock!");
        return;
      }
      item = { type: "product", id: p.id, productId: p.id, name: p.name, price: p.sellingPrice, qty: 1 };
    }

    const existing = this.posCart.find(c => c.id === item.id && c.type === item.type);
    if (existing) {
      existing.qty += 1;
    } else {
      this.posCart.push(item);
    }
    this.renderPOSCart();
  }

  removeFromPOSCart(index) {
    this.posCart.splice(index, 1);
    this.renderPOSCart();
  }

  renderPOSCart() {
    const listEl = document.getElementById("pos-cart-items");
    if (!listEl) return;

    if (this.posCart.length === 0) {
      listEl.innerHTML = `<div style="text-align:center; padding:30px; color:var(--text-muted);">Cart is empty. Click services or products on left to add.</div>`;
    } else {
      listEl.innerHTML = this.posCart.map((item, idx) => `
        <div class="cart-item-row">
          <div>
            <strong style="color:#fff; font-size:13px;">${item.name}</strong>
            <div style="font-size:11px; color:var(--text-gold); text-transform:uppercase;">${item.type} • ₹${item.price} each</div>
          </div>
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="font-weight:700;">x${item.qty} = ₹${item.price * item.qty}</span>
            <button style="background:transparent; border:none; color:var(--accent-rose); cursor:pointer;" onclick="window.adminCtrl.removeFromPOSCart(${idx})">
              <i data-lucide="trash-2" style="width:14px;height:14px;"></i>
            </button>
          </div>
        </div>
      `).join("");
    }

    const subtotal = this.posCart.reduce((sum, i) => sum + (i.price * i.qty), 0);
    const discountEl = document.getElementById("pos-discount-input");
    const discount = discountEl ? parseFloat(discountEl.value || 0) : 0;
    const taxable = Math.max(0, subtotal - discount);
    const tax = Math.round(taxable * 0.18);
    const total = taxable + tax;

    const setVal = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.innerText = val;
    };
    setVal("pos-subtotal", `₹${subtotal}`);
    setVal("pos-tax", `₹${tax}`);
    setVal("pos-total", `₹${total.toLocaleString()}`);

    if (window.lucide) window.lucide.createIcons();
  }

  checkoutPOS() {
    if (this.posCart.length === 0) {
      alert("Please add items to cart before checkout.");
      return;
    }

    const custName = document.getElementById("pos-cust-name").value || "Walk-in Guest";
    const custPhone = document.getElementById("pos-cust-phone").value || "+91 98000 00000";
    const payMode = document.getElementById("pos-payment-mode").value || "Cash";
    const staffSelect = document.getElementById("pos-staff-select");
    const staffId = staffSelect ? staffSelect.value : "stf_01";
    const staffName = staffSelect ? staffSelect.options[staffSelect.selectedIndex].text : "Karan Singhania";

    const subtotal = this.posCart.reduce((sum, i) => sum + (i.price * i.qty), 0);
    const discount = parseFloat(document.getElementById("pos-discount-input").value || 0);
    const taxable = Math.max(0, subtotal - discount);
    const tax = Math.round(taxable * 0.18);
    const totalAmount = taxable + tax;

    const invoice = this.store.generatePOSInvoice({
      customerName: custName,
      customerPhone: custPhone,
      items: [...this.posCart],
      subtotal,
      discount,
      tax,
      totalAmount,
      paymentMethod: payMode,
      staffId,
      staffName
    });

    // Reset Cart
    this.posCart = [];
    this.renderPOSCart();

    if (window.showAppToast) {
      window.showAppToast(`🧾 Invoice #${invoice.id} Generated for ₹${totalAmount}!`);
    }

    this.refreshAdminData();
  }

  // --- Customers CRM ---
  renderCustomersTable() {
    const tbody = document.getElementById("customers-table-body");
    if (!tbody) return;

    tbody.innerHTML = this.store.state.customers.map(c => `
      <tr>
        <td>
          <div style="display:flex; align-items:center; gap:12px;">
            <img src="${c.avatar}" style="width:36px; height:36px; border-radius:50%; object-fit:cover;">
            <div>
              <strong style="color:#fff;">${c.name}</strong><br>
              <span style="font-size:12px; color:var(--text-muted);">${c.email}</span>
            </div>
          </div>
        </td>
        <td><strong>${c.phone}</strong></td>
        <td><span class="membership-pill">${c.tier}</span></td>
        <td><strong style="color:var(--gold-light);">${c.loyaltyPoints} pts</strong></td>
        <td>${c.totalVisits} visits</td>
        <td><strong>₹${(c.totalSpend || 0).toLocaleString()}</strong></td>
        <td>${c.lastVisit || 'Today'}</td>
      </tr>
    `).join("");
  }

  // --- Staff Management ---
  renderStaffManagement() {
    const grid = document.getElementById("admin-staff-grid");
    if (!grid) return;

    grid.innerHTML = this.store.state.staff.map(st => `
      <div class="stylist-card" style="text-align:left;">
        <div style="display:flex; gap:14px; align-items:center; margin-bottom:14px;">
          <div class="stylist-avatar-wrap" style="margin:0; width:64px; height:64px;">
            <img src="${st.photo}" alt="${st.name}">
          </div>
          <div>
            <h4 style="font-size:16px;">${st.name}</h4>
            <div style="font-size:12px; color:var(--gold-primary); font-weight:600;">${st.role}</div>
            <div style="font-size:11px; color:var(--text-muted);">${st.phone}</div>
          </div>
        </div>

        <div style="background:var(--bg-tertiary); padding:10px; border-radius:var(--radius-md); margin-bottom:12px; font-size:12px; display:grid; grid-template-columns:1fr 1fr; gap:6px;">
          <div>Rating: <strong>★ ${st.rating}</strong></div>
          <div>Commission: <strong>${st.commissionRate}%</strong></div>
          <div>Experience: <strong>${st.experience}</strong></div>
          <div>Status: <strong style="color:var(--gold-light);">${st.status}</strong></div>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center;">
          <label style="font-size:12px; color:var(--text-secondary);">Toggle Attendance:</label>
          <select class="form-control" style="width:auto; padding:4px 8px; font-size:12px;" onchange="window.adminCtrl.toggleStaffStatus('${st.id}', this.value)">
            <option value="Available" ${st.status === 'Available' ? 'selected' : ''}>Available</option>
            <option value="In-Service" ${st.status === 'In-Service' ? 'selected' : ''}>In-Service</option>
            <option value="On-Leave" ${st.status === 'On-Leave' ? 'selected' : ''}>On Leave</option>
          </select>
        </div>
      </div>
    `).join("");
  }

  toggleStaffStatus(stId, status) {
    this.store.toggleStaffStatus(stId, status);
    if (window.showAppToast) window.showAppToast(`Stylist status updated to ${status}`);
    this.refreshAdminData();
  }

  // --- Inventory Management ---
  renderInventoryManagement() {
    const tbody = document.getElementById("inventory-table-body");
    if (!tbody) return;

    tbody.innerHTML = this.store.state.inventory.map(p => `
      <tr>
        <td>
          <strong style="color:#fff;">${p.name}</strong><br>
          <span style="font-size:11px; color:var(--text-muted); font-family:monospace;">SKU: ${p.sku}</span>
        </td>
        <td><span class="skill-badge">${p.category}</span></td>
        <td>
          <strong style="font-size:16px; color:${p.stock <= p.minStockAlert ? 'var(--accent-rose)' : 'var(--gold-light)'};">${p.stock} units</strong>
          <div style="font-size:10px; color:var(--text-muted);">Alert at: ${p.minStockAlert} units</div>
        </td>
        <td>₹${p.unitCost}</td>
        <td><strong>₹${p.sellingPrice}</strong></td>
        <td><span class="status-pill ${p.stock <= p.minStockAlert ? 'status-cancelled' : 'status-completed'}">${p.status}</span></td>
        <td>
          <button class="btn-step" onclick="window.adminCtrl.promptRestock('${p.id}', '${p.name}')">
            <i data-lucide="plus" style="width:12px;height:12px;"></i> Restock
          </button>
        </td>
      </tr>
    `).join("");
  }

  promptRestock(prodId, prodName) {
    const qty = prompt(`Enter quantity to add to stock for "${prodName}":`, "10");
    if (qty && !isNaN(qty) && parseInt(qty) > 0) {
      this.store.addStock(prodId, parseInt(qty));
      if (window.showAppToast) window.showAppToast(`Added ${qty} units to ${prodName}!`);
      this.renderInventoryManagement();
    }
  }

  // --- Offers & Coupons ---
  renderOffersManagement() {
    const grid = document.getElementById("offers-grid");
    if (!grid) return;

    grid.innerHTML = this.store.state.coupons.map(c => `
      <div style="background:var(--bg-card); border:1px dashed var(--border-gold); border-radius:var(--radius-md); padding:20px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
          <span style="background:var(--gold-gradient); color:#000; font-weight:800; font-size:14px; padding:4px 12px; border-radius:var(--radius-sm); letter-spacing:1px;">
            ${c.code}
          </span>
          <span style="font-size:12px; color:var(--accent-emerald); font-weight:700;">
            ${c.discountType === 'percentage' ? `${c.value}% OFF` : `₹${c.value} OFF`}
          </span>
        </div>
        <p style="font-size:13px; color:var(--text-secondary); margin-bottom:8px;">${c.description}</p>
        <div style="font-size:11px; color:var(--text-muted); display:flex; justify-content:space-between;">
          <span>Min Spend: ₹${c.minSpend}</span>
          <span>Redeemed: ${c.usedCount} times</span>
        </div>
      </div>
    `).join("");
  }

  // --- Expenses Tracker ---
  renderExpensesManagement() {
    const tbody = document.getElementById("expenses-table-body");
    if (!tbody) return;

    tbody.innerHTML = this.store.state.expenses.map(e => `
      <tr>
        <td><strong>${e.date}</strong></td>
        <td><span class="skill-badge">${e.category}</span></td>
        <td>${e.description}</td>
        <td><strong style="color:var(--accent-rose);">₹${e.amount.toLocaleString()}</strong></td>
        <td>${e.paidBy}</td>
        <td><span class="status-pill status-confirmed">${e.paymentMode}</span></td>
      </tr>
    `).join("");
  }

  // --- Reports & Analytics ---
  renderReportsManagement() {
    const apts = this.store.getAppointments(this.store.state.currentSalonId);
    const totalRev = apts.reduce((sum, a) => sum + (a.finalAmount || 0), 0);
    const totalDiscounts = apts.reduce((sum, a) => sum + (a.discount || 0), 0);
    const totalTax = apts.reduce((sum, a) => sum + (a.tax || 0), 0);

    const setVal = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.innerText = val;
    };
    setVal("rep-total-rev", `₹${totalRev.toLocaleString()}`);
    setVal("rep-total-discounts", `₹${totalDiscounts.toLocaleString()}`);
    setVal("rep-total-tax", `₹${totalTax.toLocaleString()}`);
  }

  // --- Services Management ---
  renderServicesManagement() {
    const tbody = document.getElementById("services-manage-body");
    if (!tbody) return;

    tbody.innerHTML = this.store.state.services.map(s => `
      <tr>
        <td>
          <div style="display:flex; align-items:center; gap:10px;">
            <img src="${s.image}" style="width:40px; height:40px; border-radius:var(--radius-sm); object-fit:cover;">
            <strong>${s.name}</strong>
          </div>
        </td>
        <td><span class="skill-badge">${s.categoryId}</span></td>
        <td><span class="service-gender-tag" style="position:static;">${s.gender}</span></td>
        <td>${s.duration} mins</td>
        <td><strong style="color:var(--gold-light);">₹${s.price}</strong></td>
        <td><span class="status-pill status-completed">Active</span></td>
      </tr>
    `).join("");
  }

  // --- Chart.js Live Visualizations ---
  initOrUpdateCharts() {
    if (!window.Chart) return;

    // 1. Revenue Trends Chart
    const revCtx = document.getElementById("revenueTrendChart");
    if (revCtx) {
      if (this.charts.revenue) this.charts.revenue.destroy();
      this.charts.revenue = new Chart(revCtx, {
        type: 'line',
        data: {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Today'],
          datasets: [{
            label: 'Daily Revenue (₹)',
            data: [28000, 34500, 42000, 39000, 56000, 78000, 84500],
            borderColor: '#d4af37',
            backgroundColor: 'rgba(212, 175, 55, 0.15)',
            fill: true,
            tension: 0.4,
            borderWidth: 3
          }]
        },
        options: {
          responsive: true,
          plugins: { legend: { labels: { color: '#94a3b8' } } },
          scales: {
            x: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } },
            y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } }
          }
        }
      });
    }

    // 2. Service Category Distribution Chart
    const catCtx = document.getElementById("categoryShareChart");
    if (catCtx) {
      if (this.charts.category) this.charts.category.destroy();
      this.charts.category = new Chart(catCtx, {
        type: 'doughnut',
        data: {
          labels: ['Hair Cuts', 'Balayage & Color', 'Keratin & Spa', 'Gold Facials', 'Beard & Grooming'],
          datasets: [{
            data: [35, 25, 20, 12, 8],
            backgroundColor: ['#d4af37', '#e0a96d', '#38bdf8', '#c084fc', '#10b981'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          plugins: { legend: { position: 'bottom', labels: { color: '#94a3b8', boxWidth: 12 } } }
        }
      });
    }
  }

  renderSettings() {
    const salon = this.store.getCurrentSalon();
    const nameEl = document.getElementById("set-salon-name");
    const addrEl = document.getElementById("set-salon-address");
    const phoneEl = document.getElementById("set-salon-phone");
    const hoursEl = document.getElementById("set-salon-hours");

    if (nameEl) nameEl.value = salon.name;
    if (addrEl) addrEl.value = salon.address;
    if (phoneEl) phoneEl.value = salon.phone;
    if (hoursEl) hoursEl.value = salon.openingHours;
  }
}

window.AdminController = AdminController;
