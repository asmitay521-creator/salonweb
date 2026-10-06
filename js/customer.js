/**
 * LUMIÈRE & CROWN Luxury Unisex Salon & Spa
 * Customer Experience & Booking Wizard Controller
 */

class CustomerController {
  constructor(store) {
    this.store = store;
    this.selectedGender = "all";
    this.selectedCategory = "all";
    this.wizardState = {
      step: 1,
      gender: "unisex",
      service: null,
      stylist: null,
      date: new Date().toISOString().split("T")[0],
      time: "11:00 AM",
      customerName: "Priya Deshmukh",
      customerPhone: "+91 98920 11223",
      customerEmail: "priya.deshmukh@gmail.com",
      couponCode: "",
      discount: 0,
      paymentMethod: "Pay at Salon",
      notes: ""
    };
  }

  init() {
    this.renderServices();
    this.renderStylists();
    this.renderReviews();
    this.bindEvents();
    this.renderCustomerDashboard();
  }

  bindEvents() {
    // Category pill filtering
    document.querySelectorAll(".category-pill").forEach(btn => {
      btn.addEventListener("click", (e) => {
        document.querySelectorAll(".category-pill").forEach(b => b.classList.remove("active"));
        e.target.classList.add("active");
        this.selectedCategory = e.target.dataset.category;
        this.renderServices();
      });
    });

    // Gender buttons
    document.querySelectorAll(".gender-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        document.querySelectorAll(".gender-btn").forEach(b => b.classList.remove("active"));
        e.target.classList.add("active");
        this.selectedGender = e.target.dataset.gender;
        this.renderServices();
      });
    });

    // Book Now hero & nav triggers
    document.querySelectorAll(".btn-trigger-book").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        this.openBookingModal();
      });
    });
  }

  renderServices() {
    const grid = document.getElementById("services-grid");
    if (!grid) return;

    let services = this.store.state.services;

    if (this.selectedGender !== "all") {
      services = services.filter(s => s.gender === this.selectedGender || s.gender === "unisex");
    }

    if (this.selectedCategory !== "all") {
      services = services.filter(s => s.categoryId === this.selectedCategory);
    }

    grid.innerHTML = services.map(srv => `
      <div class="service-card">
        <div class="service-img-wrap">
          <img src="${srv.image}" alt="${srv.name}" loading="lazy">
          <span class="service-gender-tag">${srv.gender}</span>
          <span class="service-rating-tag"><i data-lucide="star" style="width:13px;height:13px;fill:#facc15;"></i> ${srv.rating}</span>
        </div>
        <div class="service-body">
          <h3>${srv.name}</h3>
          <p>${srv.description}</p>
          <div class="service-footer">
            <div class="service-meta">
              <span class="service-price">₹${srv.price.toLocaleString()}</span>
              <span class="service-duration"><i data-lucide="clock" style="width:12px;height:12px;display:inline-block;"></i> ${srv.duration} mins</span>
            </div>
            <button class="btn-gold btn-book-service" onclick="window.customerCtrl.startBookingWithService('${srv.id}')">
              Book Now <i data-lucide="arrow-right" style="width:14px;height:14px;"></i>
            </button>
          </div>
        </div>
      </div>
    `).join("");

    if (window.lucide) window.lucide.createIcons();
  }

  renderStylists() {
    const grid = document.getElementById("stylists-grid");
    if (!grid) return;

    const stylists = this.store.state.staff;
    grid.innerHTML = stylists.map(st => {
      const statusClass = st.status === "Available" ? "status-available" : (st.status === "In-Service" ? "status-in-service" : "status-leave");
      return `
        <div class="stylist-card">
          <div class="stylist-avatar-wrap">
            <img src="${st.photo}" alt="${st.name}">
            <span class="stylist-status-dot ${statusClass}" title="${st.status}"></span>
          </div>
          <h4>${st.name}</h4>
          <p class="stylist-role">${st.role}</p>
          <div style="font-size:12px; color:var(--text-muted); margin-bottom:8px;">
            <i data-lucide="star" style="width:12px;height:12px;fill:#facc15;color:#facc15;display:inline-block;"></i> ${st.rating} (${st.reviewsCount || 45} reviews) • ${st.experience}
          </div>
          <div class="stylist-skills">
            ${st.skills.map(sk => `<span class="skill-badge">${sk}</span>`).join("")}
          </div>
        </div>
      `;
    }).join("");

    if (window.lucide) window.lucide.createIcons();
  }

  renderReviews() {
    const grid = document.getElementById("reviews-grid");
    if (!grid) return;

    const reviews = this.store.state.reviews;
    grid.innerHTML = reviews.map(rev => `
      <div class="review-card">
        <div class="review-top">
          <img src="${rev.avatar}" class="review-avatar" alt="${rev.name}">
          <div>
            <h5 style="color:#fff; font-size:15px;">${rev.name}</h5>
            <div style="color:var(--text-gold); font-size:12px;">
              ${'★'.repeat(rev.rating)} • <span style="color:var(--text-muted);">${rev.date}</span>
            </div>
          </div>
        </div>
        <p class="review-comment">"${rev.comment}"</p>
        <div style="margin-top:12px; font-size:12px; color:var(--text-gold);">
          Verified Service: <strong>${rev.service}</strong> (Stylist: ${rev.stylist})
        </div>
      </div>
    `).join("");
  }

  // --- Multi-Step Booking Wizard ---
  openBookingModal(serviceId = null) {
    this.wizardState.step = 1;
    if (serviceId) {
      this.wizardState.service = this.store.state.services.find(s => s.id === serviceId);
    } else {
      this.wizardState.service = this.store.state.services[0];
    }
    this.wizardState.stylist = this.store.state.staff[0];
    this.renderWizardModal();
    const modal = document.getElementById("booking-modal");
    if (modal) modal.classList.add("show");
  }

  startBookingWithService(serviceId) {
    this.openBookingModal(serviceId);
  }

  closeBookingModal() {
    const modal = document.getElementById("booking-modal");
    if (modal) modal.classList.remove("show");
  }

  renderWizardModal() {
    const container = document.getElementById("wizard-step-body");
    if (!container) return;

    const step = this.wizardState.step;
    
    // Update step indicator
    document.querySelectorAll(".wizard-step-node").forEach(node => {
      const s = parseInt(node.dataset.step);
      if (s <= step) node.classList.add("active");
      else node.classList.remove("active");
    });

    if (step === 1) {
      // Step 1: Select Service & Gender
      container.innerHTML = `
        <h4 style="color:#fff; margin-bottom:16px;">Step 1: Choose Your Experience</h4>
        <div class="form-group">
          <label class="form-label">Select Gender Category</label>
          <div style="display:flex; gap:10px; margin-bottom:14px;">
            <button type="button" class="gender-select-btn btn-secondary ${this.wizardState.gender === 'women' ? 'btn-gold' : ''}" onclick="window.customerCtrl.setWizardGender('women')">Women</button>
            <button type="button" class="gender-select-btn btn-secondary ${this.wizardState.gender === 'men' ? 'btn-gold' : ''}" onclick="window.customerCtrl.setWizardGender('men')">Men</button>
            <button type="button" class="gender-select-btn btn-secondary ${this.wizardState.gender === 'unisex' ? 'btn-gold' : ''}" onclick="window.customerCtrl.setWizardGender('unisex')">Unisex / All</button>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Select Luxury Service</label>
          <select id="wizard-service-select" class="form-control" onchange="window.customerCtrl.onWizardServiceChange(this.value)">
            ${this.store.state.services.map(s => `
              <option value="${s.id}" ${this.wizardState.service && this.wizardState.service.id === s.id ? 'selected' : ''}>
                ${s.name} (₹${s.price} • ${s.duration} mins)
              </option>
            `).join("")}
          </select>
        </div>
        <div id="wizard-service-preview" style="background:var(--bg-secondary); border:1px solid var(--border-gold); padding:16px; border-radius:var(--radius-md); margin-top:16px;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <div>
              <strong style="color:var(--gold-light); font-size:16px;">${this.wizardState.service.name}</strong>
              <p style="font-size:12.5px; color:var(--text-secondary); margin-top:4px;">${this.wizardState.service.description}</p>
            </div>
            <div style="text-align:right;">
              <span style="font-size:20px; font-weight:800; color:var(--gold-light);">₹${this.wizardState.service.price}</span>
              <div style="font-size:11px; color:var(--text-muted);">${this.wizardState.service.duration} mins</div>
            </div>
          </div>
        </div>
        <div style="display:flex; justify-content:flex-end; margin-top:24px;">
          <button class="btn-gold" onclick="window.customerCtrl.nextWizardStep()">
            Next: Select Stylist & Time <i data-lucide="arrow-right" style="width:14px;height:14px;"></i>
          </button>
        </div>
      `;
    } else if (step === 2) {
      // Step 2: Select Stylist & Date/Time Slot
      const slots = ["10:00 AM", "11:00 AM", "12:15 PM", "02:00 PM", "03:30 PM", "04:45 PM", "06:00 PM", "07:15 PM", "08:30 PM"];
      container.innerHTML = `
        <h4 style="color:#fff; margin-bottom:16px;">Step 2: Select Stylist & Preferred Time</h4>
        <div class="form-group">
          <label class="form-label">Select Master Stylist</label>
          <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(180px, 1fr)); gap:10px;">
            ${this.store.state.staff.map(st => `
              <div class="stylist-select-chip ${this.wizardState.stylist && this.wizardState.stylist.id === st.id ? 'selected' : ''}"
                   onclick="window.customerCtrl.setWizardStylist('${st.id}')"
                   style="background:var(--bg-secondary); border:1px solid ${this.wizardState.stylist && this.wizardState.stylist.id === st.id ? 'var(--gold-primary)' : 'var(--border-subtle)'}; padding:10px; border-radius:var(--radius-md); cursor:pointer; display:flex; align-items:center; gap:10px;">
                <img src="${st.photo}" style="width:36px; height:36px; border-radius:50%; object-fit:cover;">
                <div>
                  <strong style="font-size:12.5px; color:#fff; display:block;">${st.name}</strong>
                  <span style="font-size:11px; color:var(--text-gold);">${st.category}</span>
                </div>
              </div>
            `).join("")}
          </div>
        </div>
        <div class="form-group" style="margin-top:20px;">
          <label class="form-label">Appointment Date</label>
          <input type="date" class="form-control" value="${this.wizardState.date}" min="${new Date().toISOString().split('T')[0]}" onchange="window.customerCtrl.wizardState.date = this.value">
        </div>
        <div class="form-group">
          <label class="form-label">Available Time Slots</label>
          <div class="slots-grid">
            ${slots.map(s => `
              <div class="time-slot-chip ${this.wizardState.time === s ? 'selected' : ''}" onclick="window.customerCtrl.setWizardTime('${s}')">
                ${s}
              </div>
            `).join("")}
          </div>
        </div>
        <div style="display:flex; justify-content:space-between; margin-top:24px;">
          <button class="btn-secondary" onclick="window.customerCtrl.prevWizardStep()">Back</button>
          <button class="btn-gold" onclick="window.customerCtrl.nextWizardStep()">
            Next: Guest Details & Offers <i data-lucide="arrow-right" style="width:14px;height:14px;"></i>
          </button>
        </div>
      `;
    } else if (step === 3) {
      // Step 3: Guest Details, Coupon, and Payment Selection
      const basePrice = this.wizardState.service.price;
      const discount = this.wizardState.discount || 0;
      const subtotal = Math.max(0, basePrice - discount);
      const tax = Math.round(subtotal * 0.18);
      const total = subtotal + tax;

      container.innerHTML = `
        <h4 style="color:#fff; margin-bottom:16px;">Step 3: Guest Info & Confirm Booking</h4>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:14px;">
          <div class="form-group">
            <label class="form-label">Guest Full Name *</label>
            <input type="text" class="form-control" id="wiz-cust-name" value="${this.wizardState.customerName}" placeholder="e.g. Priya Deshmukh">
          </div>
          <div class="form-group">
            <label class="form-label">Mobile Number (For WhatsApp Updates) *</label>
            <input type="tel" class="form-control" id="wiz-cust-phone" value="${this.wizardState.customerPhone}" placeholder="+91 98000 00000">
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Email Address (For Instant Invoice)</label>
          <input type="email" class="form-control" id="wiz-cust-email" value="${this.wizardState.customerEmail}" placeholder="yourname@gmail.com">
        </div>
        <div class="form-group">
          <label class="form-label">Apply Promo / Coupon Code</label>
          <div style="display:flex; gap:10px;">
            <input type="text" class="form-control" id="wiz-coupon-input" value="${this.wizardState.couponCode}" placeholder="Try GLAMOUR20 or ROYAL100" style="text-transform:uppercase;">
            <button class="btn-outline-gold" type="button" onclick="window.customerCtrl.applyCouponCode()">Apply</button>
          </div>
          <small id="coupon-feedback" style="color:var(--gold-light); font-size:11.5px; display:block; margin-top:4px;"></small>
        </div>
        <div class="form-group">
          <label class="form-label">Select Payment Preference</label>
          <div style="display:flex; gap:10px;">
            <label style="background:var(--bg-secondary); border:1px solid var(--border-subtle); padding:10px 14px; border-radius:var(--radius-md); font-size:13px; cursor:pointer; display:flex; align-items:center; gap:8px;">
              <input type="radio" name="wiz-pay" value="Pay at Salon" checked onchange="window.customerCtrl.wizardState.paymentMethod = this.value"> Pay at Salon
            </label>
            <label style="background:var(--bg-secondary); border:1px solid var(--border-subtle); padding:10px 14px; border-radius:var(--radius-md); font-size:13px; cursor:pointer; display:flex; align-items:center; gap:8px;">
              <input type="radio" name="wiz-pay" value="UPI / GPay" onchange="window.customerCtrl.wizardState.paymentMethod = this.value"> Instant UPI / GPay
            </label>
            <label style="background:var(--bg-secondary); border:1px solid var(--border-subtle); padding:10px 14px; border-radius:var(--radius-md); font-size:13px; cursor:pointer; display:flex; align-items:center; gap:8px;">
              <input type="radio" name="wiz-pay" value="Credit/Debit Card" onchange="window.customerCtrl.wizardState.paymentMethod = this.value"> Card
            </label>
          </div>
        </div>

        <!-- Summary box -->
        <div style="background:var(--bg-secondary); border:1px solid var(--border-gold); padding:16px; border-radius:var(--radius-md); margin-top:16px;">
          <div style="display:flex; justify-content:space-between; font-size:13px; margin-bottom:4px;">
            <span>${this.wizardState.service.name} (${this.wizardState.time}, ${this.wizardState.date})</span>
            <span>₹${basePrice}</span>
          </div>
          ${discount > 0 ? `
            <div style="display:flex; justify-content:space-between; font-size:13px; color:var(--accent-emerald); margin-bottom:4px;">
              <span>Promo Discount (${this.wizardState.couponCode})</span>
              <span>-₹${discount}</span>
            </div>
          ` : ''}
          <div style="display:flex; justify-content:space-between; font-size:13px; color:var(--text-muted); margin-bottom:8px;">
            <span>GST (18%)</span>
            <span>₹${tax}</span>
          </div>
          <div style="display:flex; justify-content:space-between; font-size:18px; font-weight:800; color:var(--gold-light); border-top:1px solid var(--border-subtle); padding-top:8px;">
            <span>Total Payable</span>
            <span>₹${total.toLocaleString()}</span>
          </div>
        </div>

        <div style="display:flex; justify-content:space-between; margin-top:24px;">
          <button class="btn-secondary" onclick="window.customerCtrl.prevWizardStep()">Back</button>
          <button class="btn-gold" onclick="window.customerCtrl.submitAppointmentBooking()">
            <i data-lucide="check-circle" style="width:16px;height:16px;"></i> Confirm & Book Appointment
          </button>
        </div>
      `;
    }

    if (window.lucide) window.lucide.createIcons();
  }

  setWizardGender(g) {
    this.wizardState.gender = g;
    this.renderWizardModal();
  }

  onWizardServiceChange(srvId) {
    this.wizardState.service = this.store.state.services.find(s => s.id === srvId);
    this.renderWizardModal();
  }

  setWizardStylist(stId) {
    this.wizardState.stylist = this.store.state.staff.find(s => s.id === stId);
    this.renderWizardModal();
  }

  setWizardTime(timeSlot) {
    this.wizardState.time = timeSlot;
    this.renderWizardModal();
  }

  applyCouponCode() {
    const input = document.getElementById("wiz-coupon-input");
    const feedback = document.getElementById("coupon-feedback");
    if (!input) return;
    const code = input.value.trim();
    const res = this.store.validateCoupon(code, this.wizardState.service.price);
    if (res.valid) {
      this.wizardState.couponCode = code.toUpperCase();
      this.wizardState.discount = res.discountAmount;
      if (feedback) {
        feedback.style.color = "var(--accent-emerald)";
        feedback.innerText = res.message;
      }
      this.renderWizardModal();
    } else {
      if (feedback) {
        feedback.style.color = "var(--accent-rose)";
        feedback.innerText = res.message;
      }
    }
  }

  nextWizardStep() {
    this.wizardState.step += 1;
    this.renderWizardModal();
  }

  prevWizardStep() {
    this.wizardState.step = Math.max(1, this.wizardState.step - 1);
    this.renderWizardModal();
  }

  submitAppointmentBooking() {
    const nameEl = document.getElementById("wiz-cust-name");
    const phoneEl = document.getElementById("wiz-cust-phone");
    const emailEl = document.getElementById("wiz-cust-email");

    if (nameEl && nameEl.value.trim()) this.wizardState.customerName = nameEl.value.trim();
    if (phoneEl && phoneEl.value.trim()) this.wizardState.customerPhone = phoneEl.value.trim();
    if (emailEl && emailEl.value.trim()) this.wizardState.customerEmail = emailEl.value.trim();

    const basePrice = this.wizardState.service.price;
    const discount = this.wizardState.discount || 0;
    const subtotal = Math.max(0, basePrice - discount);
    const tax = Math.round(subtotal * 0.18);
    const finalAmount = subtotal + tax;

    const newApt = this.store.createAppointment({
      salonId: this.store.state.currentSalonId,
      customerId: "cust_01",
      customerName: this.wizardState.customerName,
      customerPhone: this.wizardState.customerPhone,
      customerEmail: this.wizardState.customerEmail,
      serviceId: this.wizardState.service.id,
      serviceName: this.wizardState.service.name,
      gender: this.wizardState.gender,
      staffId: this.wizardState.stylist ? this.wizardState.stylist.id : "stf_01",
      staffName: this.wizardState.stylist ? this.wizardState.stylist.name : "Karan Singhania",
      date: this.wizardState.date,
      time: this.wizardState.time,
      duration: this.wizardState.service.duration,
      amount: basePrice,
      discount: discount,
      tax: tax,
      finalAmount: finalAmount,
      couponCode: this.wizardState.couponCode,
      paymentMethod: this.wizardState.paymentMethod,
      paymentStatus: this.wizardState.paymentMethod === "Pay at Salon" ? "Pending" : "Paid"
    });

    this.closeBookingModal();

    // Trigger celebratory toast & confetti if available
    if (window.showAppToast) {
      window.showAppToast(`🎉 Appointment Confirmed! ID: #${newApt.id} on ${newApt.date} at ${newApt.time}. SMS sent!`);
    }

    // Refresh views
    this.renderCustomerDashboard();
    if (window.adminCtrl) window.adminCtrl.refreshAdminData();
  }

  // --- Customer Dashboard Render ---
  renderCustomerDashboard() {
    const listEl = document.getElementById("customer-appointments-list");
    if (!listEl) return;

    const apts = this.store.state.appointments.filter(a => a.customerPhone === "+91 98920 11223" || a.customerId === "cust_01");
    if (apts.length === 0) {
      listEl.innerHTML = `<div style="text-align:center; padding:30px; color:var(--text-muted);">No appointments booked yet.</div>`;
      return;
    }

    listEl.innerHTML = apts.map(a => `
      <div style="background:var(--bg-secondary); border:1px solid var(--border-subtle); border-radius:var(--radius-md); padding:18px; margin-bottom:14px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
        <div>
          <div style="display:flex; align-items:center; gap:10px; margin-bottom:6px;">
            <strong style="font-size:16px; color:#fff;">${a.serviceName}</strong>
            <span class="status-pill status-${a.status.toLowerCase().replace(' ', '-')}">${a.status}</span>
          </div>
          <p style="font-size:13px; color:var(--text-secondary);">
            <i data-lucide="calendar" style="width:13px;height:13px;display:inline-block;"></i> ${a.date} at ${a.time} • Stylist: <strong>${a.staffName}</strong>
          </p>
          <p style="font-size:12px; color:var(--text-muted); margin-top:2px;">
            Booking Ref: #${a.id} • Payment: <strong>${a.paymentMethod} (${a.paymentStatus})</strong>
          </p>
        </div>
        <div style="text-align:right;">
          <div style="font-size:18px; font-weight:800; color:var(--gold-light);">₹${a.finalAmount.toLocaleString()}</div>
          <button class="btn-outline-gold" style="font-size:12px; padding:4px 12px; margin-top:6px;" onclick="window.customerCtrl.viewInvoiceSlip('${a.id}')">
            <i data-lucide="file-text" style="width:12px;height:12px;"></i> View Bill
          </button>
        </div>
      </div>
    `).join("");

    if (window.lucide) window.lucide.createIcons();
  }

  viewInvoiceSlip(aptId) {
    const apt = this.store.state.appointments.find(a => a.id === aptId);
    if (!apt) return;
    const modal = document.getElementById("invoice-modal");
    const container = document.getElementById("invoice-slip-content");
    if (!modal || !container) return;

    const salon = this.store.getCurrentSalon();

    container.innerHTML = `
      <div class="invoice-slip-container">
        <div class="invoice-slip-header">
          <h2>${salon.name.toUpperCase()}</h2>
          <p style="font-size:11px; margin-top:4px;">${salon.address}</p>
          <p style="font-size:11px;">Tel: ${salon.phone} | GSTIN: 27AABCL1234F1Z5</p>
          <div style="margin-top:12px; font-weight:bold; font-size:13px;">TAX INVOICE & CASH RECEIPT</div>
        </div>

        <div style="display:flex; justify-content:space-between; font-size:12px; margin-bottom:12px;">
          <div>
            <div><strong>Invoice No:</strong> INV-${apt.id.replace('apt_', '2026-')}</div>
            <div><strong>Date & Time:</strong> ${apt.date} ${apt.time}</div>
            <div><strong>Stylist:</strong> ${apt.staffName}</div>
          </div>
          <div style="text-align:right;">
            <div><strong>Guest:</strong> ${apt.customerName}</div>
            <div><strong>Mobile:</strong> ${apt.customerPhone}</div>
            <div><strong>Status:</strong> ${apt.paymentStatus.toUpperCase()}</div>
          </div>
        </div>

        <table class="invoice-items-table">
          <thead>
            <tr>
              <th>Description</th>
              <th style="text-align:center;">Qty</th>
              <th style="text-align:right;">Rate (₹)</th>
              <th style="text-align:right;">Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>${apt.serviceName}</td>
              <td style="text-align:center;">1</td>
              <td style="text-align:right;">${apt.amount}</td>
              <td style="text-align:right;">${apt.amount}</td>
            </tr>
          </tbody>
        </table>

        <div class="invoice-total-summary">
          <div style="display:flex; justify-content:space-between; font-weight:normal;">
            <span>Subtotal:</span>
            <span>₹${apt.amount}</span>
          </div>
          ${apt.discount > 0 ? `
            <div style="display:flex; justify-content:space-between; color:green; font-weight:normal;">
              <span>Promo Discount (${apt.couponCode}):</span>
              <span>-₹${apt.discount}</span>
            </div>
          ` : ''}
          <div style="display:flex; justify-content:space-between; font-weight:normal;">
            <span>CGST (9%) + SGST (9%):</span>
            <span>₹${apt.tax}</span>
          </div>
          <div style="display:flex; justify-content:space-between; font-size:16px; border-top:1px dashed #000; padding-top:6px;">
            <span>NET PAID:</span>
            <span>₹${apt.finalAmount.toLocaleString()}</span>
          </div>
        </div>

        <div style="text-align:center; margin-top:24px; font-size:11px; border-top:1px dashed #ccc; padding-top:12px;">
          <p>Thank you for visiting Looks Professional!</p>
          <p>Visit again for a 5-star rejuvenating luxury experience.</p>
        </div>
      </div>
    `;

    modal.classList.add("show");
  }
}

window.CustomerController = CustomerController;
