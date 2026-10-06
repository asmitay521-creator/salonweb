/**
 * LUMIÈRE & CROWN Luxury Unisex Salon & Spa
 * Main Application Orchestrator & Role Controller
 */

document.addEventListener("DOMContentLoaded", () => {
  // Initialize Controllers
  window.customerCtrl = new window.CustomerController(window.salonStore);
  window.adminCtrl = new window.AdminController(window.salonStore);
  window.superAdminCtrl = new window.SuperAdminController(window.salonStore);

  // Initialize UI Views
  window.customerCtrl.init();
  window.adminCtrl.init();
  window.superAdminCtrl.init();

  // Populate Salon Branch Switcher in Admin Sidebar or Header
  const branchSelect = document.getElementById("admin-branch-select") || document.getElementById("header-branch-select");
  if (branchSelect) {
    branchSelect.innerHTML = window.salonStore.state.salons.map(s => `
      <option value="${s.id}" ${s.id === window.salonStore.state.currentSalonId ? 'selected' : ''}>
        📍 ${s.name} (${s.city})
      </option>
    `).join("");

    branchSelect.addEventListener("change", (e) => {
      window.salonStore.setCurrentSalon(e.target.value);
      window.showAppToast(`Branch switched to: ${e.target.options[e.target.selectedIndex].text}`);
      window.customerCtrl.renderCustomerDashboard();
      window.adminCtrl.refreshAdminData();
      window.superAdminCtrl.renderSuperAdminData();
    });
  }

  // Bind Universal Role Buttons
  document.querySelectorAll(".role-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const role = btn.dataset.role;
      window.showRoleView(role);
    });
  });

  // Modal Closers
  document.querySelectorAll(".btn-close-modal").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".modal-backdrop").forEach(m => m.classList.remove("show"));
    });
  });

  // Close modal when clicking on backdrop
  document.querySelectorAll(".modal-backdrop").forEach(m => {
    m.addEventListener("click", (e) => {
      if (e.target === m) {
        m.classList.remove("show");
      }
    });
  });

  // Global Toast function
  window.showAppToast = function(msg) {
    let container = document.getElementById("global-toast-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "global-toast-container";
      container.className = "toast-container";
      document.body.appendChild(container);
    }
    const toast = document.createElement("div");
    toast.className = "custom-toast";
    toast.innerHTML = `<i data-lucide="bell" style="width:16px;height:16px;color:var(--gold-primary);flex-shrink:0;"></i> <span>${msg}</span>`;
    container.appendChild(toast);
    if (window.lucide) window.lucide.createIcons();

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateX(100%)";
      toast.style.transition = "all 0.3s ease";
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  };

  // Role View Switcher
  window.showRoleView = function(role) {
    document.querySelectorAll(".view-section").forEach(sec => sec.classList.remove("active-view"));

    if (role === "customer") {
      document.getElementById("view-customer-public").classList.add("active-view");
      const nav = document.getElementById("main-nav-bar");
      if (nav) nav.style.display = "flex";
      window.customerCtrl.renderCustomerDashboard();
    } else if (role === "customer-dash") {
      document.getElementById("view-customer-dashboard").classList.add("active-view");
      const nav = document.getElementById("main-nav-bar");
      if (nav) nav.style.display = "flex";
      window.customerCtrl.renderCustomerDashboard();
    } else if (role === "admin-login") {
      document.getElementById("view-admin-login").classList.add("active-view");
      const nav = document.getElementById("main-nav-bar");
      if (nav) nav.style.display = "none";
    } else if (role === "admin") {
      document.getElementById("view-admin-panel").classList.add("active-view");
      const nav = document.getElementById("main-nav-bar");
      if (nav) nav.style.display = "none";
      window.adminCtrl.refreshAdminData();
    } else if (role === "superadmin") {
      document.getElementById("view-superadmin-panel").classList.add("active-view");
      const nav = document.getElementById("main-nav-bar");
      if (nav) nav.style.display = "none";
      window.superAdminCtrl.renderSuperAdminData();
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (window.lucide) window.lucide.createIcons();
  };

  // Dedicated /admin Login Navigation
  window.showAdminLogin = function() {
    window.location.hash = "#/admin";
    window.showRoleView("admin-login");
  };

  window.fillAdminLogin = function(email, pass) {
    const emailEl = document.getElementById("login-email");
    const passEl = document.getElementById("login-password");
    if (emailEl) emailEl.value = email;
    if (passEl) passEl.value = pass;
    window.handleAdminLogin();
  };

  window.handleAdminLogin = function(e) {
    if (e && e.preventDefault) e.preventDefault();
    const emailEl = document.getElementById("login-email");
    const passEl = document.getElementById("login-password");
    const email = emailEl ? emailEl.value.trim().toLowerCase() : "";
    const pass = passEl ? passEl.value.trim() : "";

    if (!email || !pass) {
      window.showAppToast("⚠️ Please enter both email and password.");
      return;
    }

    // Role Check: Unified login for both Admin & Super Admin
    if (email.includes("superadmin") || email === "owner@lumieresalon.com" || email === "super@lumieresalon.com") {
      const session = {
        role: "superadmin",
        email: email,
        name: "Super Admin HQ",
        loginTime: new Date().toISOString()
      };
      localStorage.setItem("LUMIERE_AUTH_USER", JSON.stringify(session));
      window.salonStore.setCurrentUser(session);
      window.showAppToast("⚡ Role Verified: Super Admin HQ. Access Granted!");
      window.location.hash = "#/superadmin";
      window.showRoleView("superadmin");
    } else {
      let matchedSalon = window.salonStore.state.salons.find(s => s.adminEmail.toLowerCase() === email);
      if (matchedSalon) {
        window.salonStore.setCurrentSalon(matchedSalon.id);
      }
      const session = {
        role: "admin",
        email: email,
        name: matchedSalon ? matchedSalon.adminName : "Branch Admin (Vikram Malhotra)",
        salonId: window.salonStore.state.currentSalonId,
        loginTime: new Date().toISOString()
      };
      localStorage.setItem("LUMIERE_AUTH_USER", JSON.stringify(session));
      window.salonStore.setCurrentUser(session);
      window.showAppToast("💼 Role Verified: Branch Admin. Welcome back!");
      window.location.hash = "#/admin-panel";
      window.showRoleView("admin");
    }
  };

  window.adminLogout = function() {
    localStorage.removeItem("LUMIERE_AUTH_USER");
    window.salonStore.setCurrentUser({
      role: "customer",
      id: "cust_01",
      name: "Priya Deshmukh",
      email: "priya.deshmukh@gmail.com",
      phone: "+91 98920 11223"
    });
    window.showAppToast("🔒 Logged out from administration portal.");
    window.location.hash = "#/admin";
    window.showRoleView("admin-login");
  };

  // URL Hash Routing Support for /admin
  function handleRoute() {
    const hash = window.location.hash;
    const auth = JSON.parse(localStorage.getItem("LUMIERE_AUTH_USER") || "null");

    if (hash === "#/admin" || hash === "#admin" || window.location.pathname.endsWith("/admin")) {
      if (auth && auth.role === "superadmin") {
        window.showRoleView("superadmin");
      } else if (auth && auth.role === "admin") {
        window.showRoleView("admin");
      } else {
        window.showRoleView("admin-login");
      }
    } else if (hash === "#/superadmin") {
      if (auth && auth.role === "superadmin") {
        window.showRoleView("superadmin");
      } else {
        window.showRoleView("admin-login");
      }
    } else if (hash === "#/customer-dash") {
      window.showRoleView("customer-dash");
    }
  }

  window.addEventListener("hashchange", handleRoute);
  handleRoute();

  // Quick Switch to Customer Dashboard tab
  const custDashTrigger = document.getElementById("btn-nav-cust-dash");
  if (custDashTrigger) {
    custDashTrigger.addEventListener("click", (e) => {
      e.preventDefault();
      window.showRoleView("customer-dash");
    });
  }

  // Add Product Modal submit
  const addProdForm = document.getElementById("form-add-product");
  if (addProdForm) {
    addProdForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("new-prod-name").value;
      const cat = document.getElementById("new-prod-category").value;
      const cost = document.getElementById("new-prod-cost").value;
      const price = document.getElementById("new-prod-price").value;
      const stock = document.getElementById("new-prod-stock").value;
      const alert = document.getElementById("new-prod-alert").value;

      window.salonStore.addProduct({
        name,
        category: cat,
        unitCost: cost,
        sellingPrice: price,
        stock,
        minStockAlert: alert
      });

      document.getElementById("modal-add-product").classList.remove("show");
      addProdForm.reset();
      window.showAppToast(`Product "${name}" added to inventory!`);
      window.adminCtrl.renderInventoryManagement();
    });
  }

  // Add Staff Modal submit
  const addStaffForm = document.getElementById("form-add-staff");
  if (addStaffForm) {
    addStaffForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("new-staff-name").value;
      const role = document.getElementById("new-staff-role").value;
      const phone = document.getElementById("new-staff-phone").value;
      const email = document.getElementById("new-staff-email").value;
      const comm = document.getElementById("new-staff-comm").value;
      const skills = document.getElementById("new-staff-skills").value;

      window.salonStore.addStaff({
        name,
        role,
        phone,
        email,
        commissionRate: comm,
        skills
      });

      document.getElementById("modal-add-staff").classList.remove("show");
      addStaffForm.reset();
      window.showAppToast(`New team member "${name}" registered!`);
      window.adminCtrl.renderStaffManagement();
    });
  }

  // Add Expense Modal submit
  const addExpForm = document.getElementById("form-add-expense");
  if (addExpForm) {
    addExpForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const cat = document.getElementById("new-exp-cat").value;
      const desc = document.getElementById("new-exp-desc").value;
      const amount = document.getElementById("new-exp-amount").value;
      const mode = document.getElementById("new-exp-mode").value;

      window.salonStore.addExpense({
        category: cat,
        description: desc,
        amount,
        paymentMode: mode
      });

      document.getElementById("modal-add-expense").classList.remove("show");
      addExpForm.reset();
      window.showAppToast(`Expense of ₹${amount} logged!`);
      window.adminCtrl.renderExpensesManagement();
      window.adminCtrl.renderKPIs();
    });
  }

  // Add Coupon Modal submit
  const addCpnForm = document.getElementById("form-add-coupon");
  if (addCpnForm) {
    addCpnForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const code = document.getElementById("new-cpn-code").value;
      const type = document.getElementById("new-cpn-type").value;
      const val = document.getElementById("new-cpn-value").value;
      const min = document.getElementById("new-cpn-min").value;
      const desc = document.getElementById("new-cpn-desc").value;

      window.salonStore.addCoupon({
        code,
        discountType: type,
        value: val,
        minSpend: min,
        description: desc
      });

      document.getElementById("modal-add-coupon").classList.remove("show");
      addCpnForm.reset();
      window.showAppToast(`Coupon code ${code.toUpperCase()} created!`);
      window.adminCtrl.renderOffersManagement();
    });
  }

  // Add Branch Modal submit (Super Admin)
  const addBranchForm = document.getElementById("form-add-branch");
  if (addBranchForm) {
    addBranchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("new-branch-name").value;
      const city = document.getElementById("new-branch-city").value;
      const addr = document.getElementById("new-branch-addr").value;
      const phone = document.getElementById("new-branch-phone").value;
      const adminName = document.getElementById("new-branch-admin").value;
      const adminEmail = document.getElementById("new-branch-email").value;

      window.salonStore.addSalonBranch({
        name,
        city,
        address: addr,
        phone,
        adminName,
        adminEmail
      });

      document.getElementById("modal-add-branch").classList.remove("show");
      addBranchForm.reset();
      window.showAppToast(`Branch "${name}" successfully registered!`);
      window.superAdminCtrl.renderBranchesGrid();
      window.superAdminCtrl.renderConsolidatedKPIs();
    });
  }

  // Print Invoice Action
  window.printCurrentInvoice = function() {
    window.print();
  };

  // Create initial icons
  if (window.lucide) window.lucide.createIcons();
});
