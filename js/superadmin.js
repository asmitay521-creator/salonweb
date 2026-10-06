/**
 * LUMIÈRE & CROWN Luxury Unisex Salon & Spa
 * Super Admin Panel Controller (Multi-Branch, RBAC Matrix, Global Analytics, Audit Logs)
 */

class SuperAdminController {
  constructor(store) {
    this.store = store;
  }

  init() {
    this.bindSuperAdminTabs();
    this.renderSuperAdminData();
  }

  bindSuperAdminTabs() {
    document.querySelectorAll(".superadmin-nav-item").forEach(item => {
      item.addEventListener("click", (e) => {
        const mod = item.dataset.module;
        if (!mod) return;
        document.querySelectorAll(".superadmin-nav-item").forEach(i => i.classList.remove("active"));
        item.classList.add("active");
        this.switchSuperTab(mod);
      });
    });
  }

  switchSuperTab(tabId) {
    document.querySelectorAll(".superadmin-tab-pane").forEach(p => p.style.display = "none");
    const target = document.getElementById(`super-mod-${tabId}`);
    if (target) target.style.display = "block";
    this.renderSuperAdminData();
  }

  renderSuperAdminData() {
    this.renderConsolidatedKPIs();
    this.renderBranchesGrid();
    this.renderRBACMatrix();
    this.renderAuditLogs();
    if (window.lucide) window.lucide.createIcons();
  }

  renderConsolidatedKPIs() {
    const salons = this.store.state.salons;
    const apts = this.store.state.appointments;
    const staff = this.store.state.staff;

    const totalConsolidatedRev = salons.reduce((sum, s) => sum + (s.monthlyRevenue || 0), 0) +
      apts.reduce((sum, a) => sum + (a.finalAmount || 0), 0);

    const setVal = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.innerText = val;
    };

    setVal("super-total-salons", salons.length);
    setVal("super-total-revenue", `₹${(totalConsolidatedRev / 100000).toFixed(2)} Lakhs`);
    setVal("super-total-apts", apts.length + 3550);
    setVal("super-total-staff", staff.length + 18);
    setVal("super-active-plans", `${salons.length} Enterprise`);
  }

  renderBranchesGrid() {
    const container = document.getElementById("super-salons-grid");
    if (!container) return;

    container.innerHTML = this.store.state.salons.map(s => `
      <div class="service-card" style="padding:0;">
        <div class="service-img-wrap" style="height:150px;">
          <img src="${s.image}" alt="${s.name}">
          <span class="service-gender-tag">${s.city}</span>
          <span class="status-pill ${s.status === 'Active' ? 'status-completed' : 'status-cancelled'}" style="position:absolute; top:12px; right:12px;">
            ${s.status}
          </span>
        </div>
        <div class="service-body">
          <h3 style="font-size:18px;">${s.name}</h3>
          <p style="font-size:12.5px; color:var(--text-secondary); margin-bottom:12px;">
            ${s.address}<br>
            Admin: <strong>${s.adminName}</strong> (${s.adminEmail})
          </p>
          <div style="display:flex; justify-content:space-between; background:var(--bg-tertiary); padding:10px; border-radius:var(--radius-md); font-size:12px; margin-bottom:14px;">
            <div>Rating: <strong style="color:var(--gold-light);">★ ${s.rating}</strong></div>
            <div>Monthly Rev: <strong style="color:var(--gold-light);">₹${(s.monthlyRevenue || 0).toLocaleString()}</strong></div>
          </div>
          <div style="display:flex; gap:10px;">
            <button class="btn-secondary" style="flex:1; font-size:12px;" onclick="window.superAdminCtrl.switchToBranchContext('${s.id}')">
              <i data-lucide="external-link" style="width:12px;height:12px;"></i> View Branch
            </button>
            <button class="${s.status === 'Active' ? 'btn-danger' : 'btn-gold'}" style="font-size:12px; padding:6px 12px;" onclick="window.superAdminCtrl.toggleBranchStatus('${s.id}')">
              ${s.status === 'Active' ? 'Suspend' : 'Activate'}
            </button>
          </div>
        </div>
      </div>
    `).join("");
  }

  switchToBranchContext(salonId) {
    this.store.setCurrentSalon(salonId);
    if (window.showRoleView) window.showRoleView("admin");
    if (window.showAppToast) window.showAppToast(`Switched view to branch: ${salonId}`);
  }

  toggleBranchStatus(salonId) {
    this.store.toggleSalonStatus(salonId);
    this.renderBranchesGrid();
    if (window.showAppToast) window.showAppToast("Branch status updated");
  }

  // --- RBAC Matrix ---
  renderRBACMatrix() {
    const tbody = document.getElementById("rbac-matrix-body");
    if (!tbody) return;

    const perms = this.store.state.adminPermissions;
    const modules = [
      { key: "appointments", label: "Appointments & Booking Manager" },
      { key: "customers", label: "Customer CRM & History" },
      { key: "services", label: "Services & Pricing Editor" },
      { key: "staff", label: "Staff Roster & Commission" },
      { key: "billing", label: "Billing & POS Terminal" },
      { key: "inventory", label: "Inventory Stock In/Out" },
      { key: "expenses", label: "Expense Tracking" },
      { key: "reports", label: "Financial Reports Export" },
      { key: "settings", label: "Salon Business Settings" }
    ];

    tbody.innerHTML = modules.map(m => `
      <tr>
        <td><strong>${m.label}</strong></td>
        <td style="text-align:center;">
          <input type="checkbox" ${perms[m.key] ? 'checked' : ''} onchange="window.superAdminCtrl.togglePermission('${m.key}', this.checked)" style="transform:scale(1.3); cursor:pointer; accent-color:var(--gold-primary);">
        </td>
        <td><span style="color:var(--text-muted); font-size:12px;">Branch Admin Access</span></td>
      </tr>
    `).join("");
  }

  togglePermission(key, isAllowed) {
    const update = {};
    update[key] = isAllowed;
    this.store.updateAdminPermissions(update);
    if (window.showAppToast) window.showAppToast(`Updated permission for ${key}: ${isAllowed ? 'Allowed' : 'Restricted'}`);
  }

  // --- Audit Logs ---
  renderAuditLogs() {
    const tbody = document.getElementById("super-audit-logs-body");
    if (!tbody) return;

    const logs = this.store.state.auditLogs || [];
    tbody.innerHTML = logs.map(l => `
      <tr>
        <td style="font-family:monospace; color:var(--text-gold);">${l.timestamp}</td>
        <td><strong>${l.user}</strong></td>
        <td><span class="skill-badge">${l.type}</span></td>
        <td>${l.action}</td>
      </tr>
    `).join("");
  }
}

window.SuperAdminController = SuperAdminController;
