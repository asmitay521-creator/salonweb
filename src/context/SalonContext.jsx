import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_SALON_DATA } from '../data/salonData';
import { auth, db } from '../firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInAnonymously
} from 'firebase/auth';
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot
} from 'firebase/firestore';

const SalonContext = createContext();

const STORAGE_KEY = 'LOOKS_SALON_PORTAL_V2';

export const SalonProvider = ({ children }) => {
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        
        return {
          ...INITIAL_SALON_DATA,
          ...parsed
        };
      } catch (e) {
        console.error("Failed to parse saved state", e);
      }
    }
    return {
      ...INITIAL_SALON_DATA,
      currentSalonId: 'salon_01',
      currentUser: JSON.parse(localStorage.getItem('LUMIERE_AUTH_USER') || 'null') || {
        role: 'admin',
        id: 'admin_01',
        name: 'Looks Admin',
        email: 'admin@looksprofessional.com',
        phone: '+91 98111 22334'
      },
      adminPermissions: {
        appointments: true,
        customers: true,
        services: true,
        staff: true,
        billing: true,
        inventory: true,
        expenses: true,
        reports: true,
        settings: true
      }
    };
  });

  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  // Firestore Sync Helper for real-time cloud persistence
  const syncToFirestore = async (collectionName, docId, docData) => {
    try {
      if (!db || !docId) return;
      await setDoc(doc(db, collectionName, String(docId)), docData, { merge: true });
    } catch (err) {
      console.warn(`Firestore sync (${collectionName}/${docId}):`, err.message);
    }
  };

  // Firestore Delete Helper
  const deleteFromFirestore = async (collectionName, docId) => {
    try {
      if (!db || !docId) return;
      await deleteDoc(doc(db, collectionName, String(docId)));
    } catch (err) {
      console.warn(`Firestore delete (${collectionName}/${docId}):`, err.message);
    }
  };

  // 1. Firebase Auth State Listener
  useEffect(() => {
    if (!auth) return;
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        const savedUser = JSON.parse(localStorage.getItem('LUMIERE_AUTH_USER') || 'null');
        if (savedUser && savedUser.email === fbUser.email) {
          setData(prev => ({ ...prev, currentUser: savedUser }));
        } else {
          const isSuper = (fbUser.email || '').includes('superadmin');
          const isAdmin = (fbUser.email || '').includes('admin');
          const session = {
            role: isSuper ? 'superadmin' : (isAdmin ? 'admin' : 'customer'),
            id: fbUser.uid,
            name: fbUser.displayName || (isSuper ? 'Super Admin HQ' : (isAdmin ? 'Branch Admin' : 'Customer Client')),
            email: fbUser.email || 'user@looksprofessional.com',
            phone: fbUser.phoneNumber || '+91 98111 22334',
            loginTime: new Date().toISOString()
          };
          localStorage.setItem('LUMIERE_AUTH_USER', JSON.stringify(session));
          setData(prev => ({ ...prev, currentUser: session }));
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // 2. Real-time Firestore Listeners for Cloud Database Store
  useEffect(() => {
    if (!db) return;

    // Firebase listeners are disabled by default in the template to prevent
    // them from overwriting local changes if Firebase is not fully configured.
    // Uncomment these if you have configured your own Firebase project and rules.

    /*
    const mergeWithLocal = (localList = [], firestoreList = []) => {
      const merged = [...localList];
      firestoreList.forEach(item => {
        const idx = merged.findIndex(x => x.id === item.id);
        if (idx >= 0) {
          merged[idx] = { ...merged[idx], ...item };
        } else {
          merged.push(item);
        }
      });
      return merged;
    };

    const unsubApts = onSnapshot(collection(db, 'appointments'), (snapshot) => {
      if (!snapshot.empty) {
        const firestoreApts = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        setData(prev => ({ ...prev, appointments: mergeWithLocal(prev.appointments, firestoreApts) }));
      }
    }, (err) => console.warn('Firestore appointments sync notice:', err.message));

    const unsubInv = onSnapshot(collection(db, 'inventory'), (snapshot) => {
      if (!snapshot.empty) {
        const firestoreInv = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        setData(prev => ({ ...prev, inventory: mergeWithLocal(prev.inventory, firestoreInv) }));
      }
    }, (err) => console.warn('Firestore inventory sync notice:', err.message));

    const unsubStaff = onSnapshot(collection(db, 'staff'), (snapshot) => {
      if (!snapshot.empty) {
        const firestoreStaff = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        setData(prev => ({ ...prev, staff: mergeWithLocal(prev.staff, firestoreStaff) }));
      }
    }, (err) => console.warn('Firestore staff sync notice:', err.message));

    const unsubCust = onSnapshot(collection(db, 'customers'), (snapshot) => {
      if (!snapshot.empty) {
        const firestoreCust = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        setData(prev => ({ ...prev, customers: mergeWithLocal(prev.customers, firestoreCust) }));
      }
    }, (err) => console.warn('Firestore customers sync notice:', err.message));

    const unsubLeads = onSnapshot(collection(db, 'leads'), (snapshot) => {
      if (!snapshot.empty) {
        const firestoreLeads = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        setData(prev => ({ ...prev, leads: mergeWithLocal(prev.leads, firestoreLeads) }));
      }
    }, (err) => console.warn('Firestore leads sync notice:', err.message));

    const unsubInvoices = onSnapshot(collection(db, 'invoices'), (snapshot) => {
      if (!snapshot.empty) {
        const firestoreInvoices = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        setData(prev => ({ ...prev, invoices: mergeWithLocal(prev.invoices, firestoreInvoices) }));
      }
    }, (err) => console.warn('Firestore invoices sync notice:', err.message));

    return () => {
      unsubApts();
      unsubInv();
      unsubStaff();
      unsubCust();
      unsubLeads();
      unsubInvoices();
    };
    */
  }, []);

  const showToast = (message) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const addAuditLog = (action, type = "General") => {
    const log = {
      id: "log_" + Date.now().toString().slice(-6),
      user: data.currentUser ? `${data.currentUser.name} (${data.currentUser.role})` : "System",
      action,
      type,
      timestamp: new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setData(prev => ({
      ...prev,
      auditLogs: [log, ...(prev.auditLogs || []).slice(0, 50)]
    }));
  };

  const setCurrentSalonId = (salonId) => {
    setData(prev => ({ ...prev, currentSalonId: salonId }));
  };

  const getCurrentSalon = () => {
    return data.salons.find(s => s.id === data.currentSalonId) || data.salons[0];
  };

  const createAppointment = (aptData) => {
    const id = "apt_" + Date.now().toString().slice(-6);
    const newApt = {
      id,
      salonId: aptData.salonId || data.currentSalonId,
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
      status: "Confirmed",
      notes: aptData.notes || "",
      createdAt: new Date().toISOString()
    };

    setData(prev => {
      // update customer visit
      let customers = [...prev.customers];
      let cust = customers.find(c => c.phone === newApt.customerPhone || c.id === newApt.customerId);
      if (!cust) {
        cust = {
          id: "cust_" + Date.now().toString().slice(-5),
          name: newApt.customerName,
          phone: newApt.customerPhone,
          email: newApt.customerEmail,
          tier: "Silver Member",
          loyaltyPoints: Math.round(newApt.finalAmount * 0.05),
          totalVisits: 1,
          totalSpend: newApt.finalAmount,
          lastVisit: newApt.date,
          avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80"
        };
        customers.push(cust);
      } else {
        cust.totalVisits += 1;
        cust.totalSpend += newApt.finalAmount;
        cust.loyaltyPoints += Math.round(newApt.finalAmount * 0.05);
        cust.lastVisit = newApt.date;
      }

      return {
        ...prev,
        appointments: [newApt, ...prev.appointments],
        customers
      };
    });

    syncToFirestore('appointments', id, newApt);
    if (newApt.customerPhone) {
      syncToFirestore('customers', newApt.customerId || ('cust_' + newApt.customerPhone.replace(/\D/g, '')), {
        name: newApt.customerName,
        phone: newApt.customerPhone,
        email: newApt.customerEmail,
        lastVisit: newApt.date
      });
    }

    addAuditLog(`New appointment booked: #${id} for ${newApt.customerName}`, "Booking");
    showToast(`🎉 Appointment Confirmed! ID: #${id} on ${newApt.date} at ${newApt.time}`);
    return newApt;
  };

  const updateAppointmentStatus = (aptId, newStatus) => {
    setData(prev => {
      const appointments = prev.appointments.map(a => {
        if (a.id === aptId) {
          const updated = { ...a, status: newStatus };
          if (newStatus === 'Completed') updated.paymentStatus = 'Paid';
          return updated;
        }
        return a;
      });

      const apt = prev.appointments.find(a => a.id === aptId);
      const staff = prev.staff.map(s => {
        if (apt && s.id === apt.staffId) {
          if (newStatus === "In-Progress") return { ...s, status: "In-Service" };
          if (newStatus === "Completed" || newStatus === "Cancelled") return { ...s, status: "Available" };
        }
        return s;
      });

      return { ...prev, appointments, staff };
    });

    syncToFirestore('appointments', aptId, {
      status: newStatus,
      ...(newStatus === 'Completed' ? { paymentStatus: 'Paid' } : {})
    });

    addAuditLog(`Appointment #${aptId} status changed to ${newStatus}`, "Service");
    showToast(`✅ Appointment #${aptId} updated to "${newStatus}"`);
  };

  const generatePOSInvoice = (invData) => {
    const invId = invData.id || invData.invoiceNo || ("INV-" + new Date().getFullYear() + "-" + Math.floor(1000 + Math.random() * 9000));
    const invoice = {
      id: invId,
      salonId: data.currentSalonId,
      date: invData.date || new Date().toISOString().split("T")[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      customerName: invData.customerName,
      customerPhone: invData.customerPhone,
      items: invData.items,
      subtotal: invData.subtotal,
      discount: invData.discount || 0,
      tax: invData.tax,
      totalAmount: invData.totalAmount,
      paymentMethod: invData.paymentMethod || "Cash",
      staffId: invData.staffId,
      staffName: invData.staffName,
      status: "Paid"
    };

    setData(prev => {
      let inventory = [...prev.inventory];
      if (invData.items) {
        invData.items.forEach(item => {
          if (item.type === 'product' && item.productId) {
            inventory = inventory.map(p => {
              if (p.id === item.productId) {
                const stock = Math.max(0, p.stock - (item.qty || 1));
                const updatedProd = {
                  ...p,
                  stock,
                  status: stock <= p.minStockAlert ? "Low Stock" : "In Stock"
                };
                syncToFirestore('inventory', p.id, updatedProd);
                return updatedProd;
              }
              return p;
            });
          }
        });
      }

      return {
        ...prev,
        invoices: [invoice, ...(prev.invoices || [])],
        inventory
      };
    });

    syncToFirestore('invoices', invId, invoice);
    addAuditLog(`Generated POS Invoice #${invId} for ₹${invoice.totalAmount}`, "Billing");
    showToast(`🧾 Invoice #${invId} generated successfully!`);
    return invoice;
  };

  const addStock = (productId, qty) => {
    setData(prev => {
      const updatedInv = prev.inventory.map(p => {
        if (p.id === productId) {
          const newStock = p.stock + parseInt(qty);
          const updatedProd = {
            ...p,
            stock: newStock,
            status: newStock > p.minStockAlert ? "In Stock" : "Low Stock"
          };
          syncToFirestore('inventory', p.id, updatedProd);
          return updatedProd;
        }
        return p;
      });
      return { ...prev, inventory: updatedInv };
    });
    showToast(`Restocked ${qty} units!`);
    addAuditLog(`Restocked inventory for item ${productId}`, "Inventory");
  };

  const addProduct = (prodData) => {
    const id = "prd_" + Date.now().toString().slice(-5);
    const stockQty = parseInt(prodData.stock !== undefined ? prodData.stock : 0);
    const minAlert = parseInt(prodData.minStockAlert || prodData.alert || 5);
    const unitCostVal = parseFloat(prodData.unitCost || 0);
    const sellPriceVal = parseFloat(prodData.sellingPrice || prodData.price || 0);

    const totalCostVal = prodData.totalCost !== undefined && prodData.totalCost !== '' 
      ? parseFloat(prodData.totalCost) 
      : (stockQty * unitCostVal);

    const newProduct = {
      id,
      salonId: data.currentSalonId,
      name: prodData.name,
      category: prodData.category || "Hair Care",
      brand: prodData.brand || "L'Oréal",
      unitQuantity: prodData.unitQuantity || prodData.quantity || "",
      unit: prodData.unit || "Bottles",
      sku: prodData.sku || ("SKU-" + Math.floor(1000 + Math.random() * 9000)),
      stock: stockQty,
      minStockAlert: minAlert,
      unitCost: unitCostVal,
      totalCost: totalCostVal,
      sellingPrice: sellPriceVal || totalCostVal,
      price: sellPriceVal || totalCostVal,
      gst: prodData.gst || '',
      discount: prodData.discount || '',
      expiryDate: prodData.expiryDate || '',
      description: prodData.description || '',
      supplier: prodData.supplier || "Official Distributor",
      status: stockQty <= 0 ? "Out of Stock" : (stockQty <= minAlert ? "Low Stock" : "In Stock"),
      imageUrl: prodData.imageUrl || null
    };

    const initialTx = stockQty > 0 ? {
      id: "tx_" + Date.now().toString().slice(-5),
      salonId: data.currentSalonId,
      date: new Date().toISOString().split('T')[0],
      type: "Stock In",
      productName: newProduct.name,
      productId: id,
      qty: stockQty,
      supplier: newProduct.supplier || "Initial Opening Stock",
      cost: unitCostVal,
      total: stockQty * unitCostVal,
      batch: "INITIAL-STOCK",
      reason: "Initial Stock / Opening Balance"
    } : null;

    setData(prev => ({
      ...prev,
      inventory: [...(prev.inventory || []), newProduct],
      stockTransactions: initialTx ? [initialTx, ...(prev.stockTransactions || [])] : (prev.stockTransactions || [])
    }));

    syncToFirestore('inventory', id, newProduct);
    if (initialTx) {
      syncToFirestore('stockTransactions', initialTx.id, initialTx);
    }
    showToast(`Product "${newProduct.name}" added with ${stockQty} units stock!`);
    addAuditLog(`Added product ${newProduct.name} (${stockQty} units)`, "Inventory");
  };

  const addStaff = (staffData) => {
    const id = "stf_" + Date.now().toString().slice(-5);
    const newStaff = {
      id,
      salonId: data.currentSalonId,
      name: staffData.name,
      employeeId: staffData.employeeId || id,
      role: staffData.role || "Senior Stylist",
      category: staffData.specialization || "Hair Specialist",
      specialization: staffData.specialization || "Hair Styling & Cuts",
      gender: staffData.gender || "Male",
      phone: staffData.phone || "",
      email: staffData.email || "",
      dob: staffData.dob || "",
      joiningDate: staffData.joiningDate || "",
      employmentType: staffData.employmentType || "Full Time",
      salary: staffData.salary || "",
      address: staffData.address || "",
      city: staffData.city || "",
      notes: staffData.notes || "",
      rating: 5.0,
      reviewsCount: 0,
      experience: staffData.experience || "3 Years",
      commissionRate: parseFloat(staffData.commissionRate || 10),
      status: "Available",
      photo: staffData.imageUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
      skills: staffData.specialization ? [staffData.specialization] : (staffData.skills ? staffData.skills.split(",").map(s => s.trim()) : ["Styling"])
    };

    setData(prev => ({
      ...prev,
      staff: [...prev.staff, newStaff]
    }));
    syncToFirestore('staff', id, newStaff);
    showToast(`Team member "${newStaff.name}" registered!`);
    addAuditLog(`Registered staff member ${newStaff.name}`, "Staff");
  };

  const toggleStaffStatus = (staffId, status) => {
    setData(prev => ({
      ...prev,
      staff: prev.staff.map(s => s.id === staffId ? { ...s, status } : s)
    }));
    syncToFirestore('staff', staffId, { status });
    showToast(`Stylist status updated to ${status}`);
  };

  const updateStaff = (staffId, updatedStaff) => {
    setData(prev => ({
      ...prev,
      staff: prev.staff.map(s => s.id === staffId ? { ...s, ...updatedStaff } : s)
    }));
    syncToFirestore('staff', staffId, updatedStaff);
    showToast(`Employee "${updatedStaff.name || 'details'}" updated successfully!`);
    addAuditLog(`Updated staff member ${updatedStaff.name || staffId}`, "Staff");
  };

  const deleteStaff = (staffId) => {
    const member = (data.staff || []).find(s => s.id === staffId);
    setData(prev => ({
      ...prev,
      staff: prev.staff.filter(s => s.id !== staffId)
    }));
    deleteFromFirestore('staff', staffId);
    showToast(`Employee "${member?.name || 'record'}" deleted.`);
    addAuditLog(`Deleted staff member ${member?.name || staffId}`, "Staff");
  };

  const addExpense = (expData) => {
    const id = "exp_" + Date.now().toString().slice(-5);
    const newExp = {
      id,
      salonId: data.currentSalonId,
      category: expData.category,
      description: expData.description,
      amount: parseFloat(expData.amount),
      date: new Date().toISOString().split("T")[0],
      paidBy: "Admin",
      paymentMode: expData.paymentMode || "UPI"
    };

    setData(prev => ({
      ...prev,
      expenses: [newExp, ...prev.expenses]
    }));
    syncToFirestore('expenses', id, newExp);
    showToast(`Expense of ₹${newExp.amount} logged!`);
    addAuditLog(`Logged expense ₹${newExp.amount} (${newExp.description})`, "Expenses");
  };

  const addCoupon = (cpnData) => {
    const newCpn = {
      code: cpnData.code.toUpperCase().trim(),
      discountType: cpnData.discountType,
      value: parseFloat(cpnData.value),
      minSpend: parseFloat(cpnData.minSpend || 0),
      description: cpnData.description,
      validUntil: "2026-12-31",
      usedCount: 0
    };

    setData(prev => ({
      ...prev,
      coupons: [...prev.coupons, newCpn]
    }));
    syncToFirestore('coupons', newCpn.code, newCpn);
    showToast(`Coupon ${newCpn.code} created!`);
    addAuditLog(`Created coupon ${newCpn.code}`, "Offers");
  };

  const validateCoupon = (code, amount) => {
    if (!code) return { valid: false, message: "No coupon provided" };
    const coupon = data.coupons.find(c => c.code.toUpperCase() === code.toUpperCase().trim());
    if (!coupon) return { valid: false, message: "Invalid Coupon Code" };
    if (amount < coupon.minSpend) {
      return { valid: false, message: `Minimum spend of ₹${coupon.minSpend} required.` };
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
  };

  const addLead = (leadData) => {
    const id = "lead_" + Date.now().toString().slice(-5);
    const newLead = {
      id,
      name: leadData.name || "Prospective Client",
      phone: leadData.phone || "",
      email: leadData.email || "",
      gender: leadData.gender || "Female",
      city: leadData.city || "Mumbai",
      source: leadData.source || "Website",
      interestedService: leadData.interestedService || "Hair Styling",
      preferredDate: leadData.preferredDate || "",
      preferredTime: leadData.preferredTime || "",
      estimatedValue: parseFloat(leadData.estimatedValue || 2500),
      stage: leadData.stage || (leadData.assignedTo && leadData.assignedTo !== 'Unassigned' ? "assign_employee" : "lead_generated"),
      status: leadData.status || (leadData.assignedTo && leadData.assignedTo !== 'Unassigned' ? "Contacted" : "New"),
      nextFollowUp: leadData.nextFollowUp || "Tomorrow 11:00 AM",
      assignedTo: leadData.assignedTo || "",
      assignedToId: leadData.assignedToId || "",
      assignedDate: leadData.assignedTo && leadData.assignedTo !== 'Unassigned' ? new Date().toISOString().split("T")[0] : "",
      lastContactedDate: "",
      lastContactMethod: "",
      lostReason: "",
      notes: leadData.notes || "",
      createdAt: leadData.createdAt || new Date().toISOString(),
      followUpHistory: []
    };
    setData(prev => ({
      ...prev,
      leads: [newLead, ...(prev.leads || [])]
    }));
    syncToFirestore('leads', id, newLead);
    showToast(`✨ Lead "${newLead.name}" generated in CRM!`);
    addAuditLog(`Generated new lead: ${newLead.name} (${newLead.source})`, "CRM");
    return newLead;
  };

  const updateLead = (leadId, updatedFields) => {
    setData(prev => ({
      ...prev,
      leads: (prev.leads || []).map(l => l.id === leadId ? { ...l, ...updatedFields } : l)
    }));
    syncToFirestore('leads', leadId, updatedFields);
    showToast(`Lead updated successfully!`);
  };

  const updateLeadStatus = (leadId, status, newStage) => {
    setData(prev => ({
      ...prev,
      leads: (prev.leads || []).map(l => {
        if (l.id !== leadId) return l;
        let stage = newStage || l.stage;
        if (!newStage) {
          const sLower = (status || '').toLowerCase();
          if (sLower.includes('new') || sLower.includes('generated')) stage = 'lead_generated';
          else if (sLower.includes('assign')) stage = 'assign_employee';
          else if (sLower.includes('contact')) stage = 'contact_customer';
          else if (sLower.includes('follow')) stage = 'follow_up';
          else if (sLower.includes('interest') || sLower.includes('consult')) stage = 'interested';
          else if (sLower.includes('book')) stage = 'booking';
          else if (sLower.includes('convert')) stage = 'converted';
          else if (sLower.includes('lost') || sLower.includes('not interest')) stage = 'not_interested';
        }
        return { ...l, status, stage };
      })
    }));
    syncToFirestore('leads', leadId, { status, ...(newStage ? { stage: newStage } : {}) });
    showToast(`Lead stage updated to "${status}"`);
  };

  const addLeadFollowUp = (leadId, followUpEntry) => {
    const entryId = "fh_" + Date.now().toString().slice(-5);
    const newEntry = {
      id: entryId,
      date: followUpEntry.date || (new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })),
      type: followUpEntry.type || "Call",
      staffName: followUpEntry.staffName || "Staff",
      notes: followUpEntry.notes || "Follow-up discussion logged."
    };

    setData(prev => ({
      ...prev,
      leads: (prev.leads || []).map(l => {
        if (l.id !== leadId) return l;
        const currentHistory = l.followUpHistory || [];
        return {
          ...l,
          stage: followUpEntry.nextStage || 'follow_up',
          status: followUpEntry.nextStatus || 'Follow-up',
          lastContactedDate: newEntry.date,
          lastContactMethod: newEntry.type,
          nextFollowUp: followUpEntry.nextFollowUp || l.nextFollowUp,
          followUpHistory: [newEntry, ...currentHistory]
        };
      })
    }));
    showToast(`Follow-up log saved for lead!`);
    addAuditLog(`Logged follow-up for lead #${leadId} (${newEntry.type})`, "CRM");
  };

  const bookLeadAppointment = (leadId, bookingDetails) => {
    const targetLead = (data.leads || []).find(l => l.id === leadId);
    if (!targetLead) return null;

    const createdAptId = "apt_" + Date.now().toString().slice(-6);
    const newApt = {
      id: createdAptId,
      salonId: data.currentSalonId,
      customerId: targetLead.convertedCustomerId || ("lead_" + targetLead.id),
      customerName: targetLead.name,
      customerPhone: targetLead.phone,
      customerEmail: targetLead.email || "",
      serviceId: bookingDetails.serviceId || "srv_01",
      serviceName: bookingDetails.serviceName || targetLead.interestedService || "Luxury Salon Service",
      staffId: bookingDetails.staffId || targetLead.assignedToId || "stf_01",
      staffName: bookingDetails.staffName || targetLead.assignedTo || "Maya Sharma",
      date: bookingDetails.date || new Date().toISOString().split("T")[0],
      time: bookingDetails.time || "11:00 AM",
      duration: bookingDetails.duration || 60,
      amount: parseFloat(bookingDetails.amount || targetLead.estimatedValue || 2500),
      finalAmount: parseFloat(bookingDetails.amount || targetLead.estimatedValue || 2500),
      status: "Confirmed",
      paymentStatus: "Pending",
      notes: bookingDetails.notes || `Appointment confirmed via Lead Funnel.`
    };

    setData(prev => ({
      ...prev,
      appointments: [newApt, ...prev.appointments],
      leads: (prev.leads || []).map(l => l.id === leadId ? {
        ...l,
        stage: 'booking',
        status: 'Appointment Booked',
        appointmentId: createdAptId,
        bookingDetails: {
          appointmentId: createdAptId,
          ...bookingDetails,
          confirmedAt: new Date().toISOString()
        }
      } : l)
    }));

    syncToFirestore('appointments', createdAptId, newApt);
    syncToFirestore('leads', leadId, {
      stage: 'booking',
      status: 'Appointment Booked',
      appointmentId: createdAptId,
      bookingDetails: { appointmentId: createdAptId, ...bookingDetails }
    });

    showToast(`📅 Appointment confirmed for ${targetLead.name} on ${newApt.date} at ${newApt.time}!`);
    addAuditLog(`Confirmed appointment #${createdAptId} for lead ${targetLead.name}`, "CRM");
    return createdAptId;
  };

  const markLeadServiceDone = (leadId) => {
    const targetLead = (data.leads || []).find(l => l.id === leadId);
    if (!targetLead) return;

    setData(prev => ({
      ...prev,
      leads: (prev.leads || []).map(l => l.id === leadId ? {
        ...l,
        stage: 'service_done',
        status: 'Service Done'
      } : l),
      appointments: prev.appointments.map(a =>
        (targetLead.appointmentId && a.id === targetLead.appointmentId) ||
        (a.customerPhone === targetLead.phone && a.status === 'Confirmed')
          ? { ...a, status: 'Completed', paymentStatus: 'Paid' }
          : a
      )
    }));

    syncToFirestore('leads', leadId, { stage: 'service_done', status: 'Service Done' });
    showToast(`✨ Service marked completed for ${targetLead.name}! Ready to convert to VIP Customer.`);
    addAuditLog(`Marked service done for lead ${targetLead.name}`, "CRM");
  };

  const convertLeadToCustomer = (leadId, bookingDetails = null) => {
    const targetLead = (data.leads || []).find(l => l.id === leadId);
    if (!targetLead) return;

    // 1. Create or link customer in CRM with full profile
    const newCustId = targetLead.convertedCustomerId || ("cust_" + Date.now().toString().slice(-5));
    const newCustomer = {
      id: newCustId,
      name: targetLead.name,
      phone: targetLead.phone,
      email: targetLead.email || `${targetLead.name.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
      gender: targetLead.gender || "Female",
      city: targetLead.city || "Mumbai",
      tier: "Diamond VIP",
      loyaltyPoints: 350,
      totalVisits: 1,
      totalSpend: parseFloat(targetLead.estimatedValue || 3500),
      lastVisit: new Date().toISOString().split("T")[0],
      source: targetLead.source,
      preferences: {
        preferredStylist: targetLead.assignedTo || "Maya Sharma",
        preferredService: targetLead.interestedService || "Precision Haircut & Styling",
        beverage: "Green Tea with Honey",
        skinHairType: "Normal to Sensitive",
        notes: targetLead.notes || "Prefers ammonia-free organic tints & scalp therapy"
      },
      notes: `Converted from Lead Funnel (${targetLead.source}). Interested in: ${targetLead.interestedService}`
    };

    // 2. Optionally create appointment if booking requested and not already created
    let createdAptId = targetLead.appointmentId || null;
    if (bookingDetails && !createdAptId) {
      createdAptId = "apt_" + Date.now().toString().slice(-6);
      const newApt = {
        id: createdAptId,
        salonId: data.currentSalonId,
        customerId: newCustId,
        customerName: targetLead.name,
        customerPhone: targetLead.phone,
        customerEmail: targetLead.email || "",
        serviceId: bookingDetails.serviceId || "srv_01",
        serviceName: targetLead.interestedService || "Luxury Salon Service",
        staffId: targetLead.assignedToId || "stf_01",
        staffName: targetLead.assignedTo || "Maya Sharma",
        date: bookingDetails.date || new Date().toISOString().split("T")[0],
        time: bookingDetails.time || "02:00 PM",
        duration: 60,
        amount: targetLead.estimatedValue || 3500,
        finalAmount: targetLead.estimatedValue || 3500,
        status: "Confirmed",
        paymentStatus: "Pending",
        notes: `Auto-booked from Lead CRM conversion.`
      };
      setData(prev => ({
        ...prev,
        appointments: [newApt, ...prev.appointments]
      }));
      syncToFirestore('appointments', createdAptId, newApt);
    }

    // 3. Update lead as Converted
    setData(prev => ({
      ...prev,
      customers: [newCustomer, ...(prev.customers || []).filter(c => c.phone !== targetLead.phone)],
      leads: (prev.leads || []).map(l => l.id === leadId ? {
        ...l,
        stage: 'converted',
        status: 'Converted',
        convertedCustomerId: newCustId,
        bookingDetails: createdAptId ? { appointmentId: createdAptId, ...bookingDetails } : l.bookingDetails
      } : l)
    }));

    syncToFirestore('customers', newCustId, newCustomer);
    syncToFirestore('leads', leadId, { stage: 'converted', status: 'Converted', convertedCustomerId: newCustId });
    showToast(`🎉 Lead converted to permanent VIP Customer profile!`);
    addAuditLog(`Converted lead ${targetLead.name} to VIP Customer (#${newCustId})`, "CRM");
    return newCustomer;
  };

  const deleteLead = (leadId) => {
    setData(prev => ({
      ...prev,
      leads: (prev.leads || []).filter(l => l.id !== leadId)
    }));
    deleteFromFirestore('leads', leadId);
    showToast(`Lead deleted.`);
  };

  const addIncentiveRule = (ruleData) => {
    const id = "rule_" + Date.now().toString().slice(-5);
    const newRule = {
      id,
      staffId: ruleData.staffId || "stf_01",
      staffName: ruleData.staffName || "Maya Sharma",
      service: ruleData.service,
      incentiveType: ruleData.incentiveType || "Percentage",
      value: ruleData.value,
      condition: ruleData.condition || "All Bookings",
      status: "Active"
    };
    setData(prev => ({
      ...prev,
      employeeIncentiveRules: [newRule, ...(prev.employeeIncentiveRules || [])]
    }));
    showToast(`Incentive rule for "${newRule.service}" added!`);
  };

  const deleteIncentiveRule = (ruleId) => {
    setData(prev => ({
      ...prev,
      employeeIncentiveRules: (prev.employeeIncentiveRules || []).filter(r => r.id !== ruleId)
    }));
    showToast(`Incentive rule removed.`);
  };

  const addServiceItem = (serviceData) => {
    const id = "srv_" + Date.now().toString().slice(-5);
    const newSrv = {
      id,
      name: serviceData.name,
      categoryId: serviceData.categoryId || "hair",
      gender: serviceData.gender || "unisex",
      duration: parseInt(serviceData.duration || 30),
      price: parseFloat(serviceData.price || 100),
      rating: 5.0,
      description: serviceData.description || "Professional salon service.",
      productsCount: serviceData.productsCount || "1 product",
      incentiveRule: serviceData.incentiveRule ? (serviceData.incentiveRule.includes('%') ? serviceData.incentiveRule : `${serviceData.incentiveRule}%`) : "20%",
      status: serviceData.status || "Active",
      image: serviceData.image || "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=600&q=80"
    };
    setData(prev => ({
      ...prev,
      services: [newSrv, ...prev.services]
    }));
    syncToFirestore('services', id, newSrv);
    showToast(`Service "${newSrv.name}" created!`);
  };

  const deleteServiceItem = (serviceId) => {
    setData(prev => ({
      ...prev,
      services: prev.services.filter(s => s.id !== serviceId)
    }));
    showToast(`Service deleted.`);
  };

  const addPackageItem = (pkgData) => {
    const id = "pkg_" + Date.now().toString().slice(-5);
    const newPkg = {
      id,
      name: pkgData.name,
      price: parseFloat(pkgData.price || 0),
      originalPrice: parseFloat(pkgData.originalPrice || pkgData.price * 1.3),
      duration: pkgData.duration || "120 mins",
      category: pkgData.category || "Combos",
      badge: pkgData.badge || "NEW",
      color: pkgData.color || "#0D9488",
      popular: Boolean(pkgData.popular),
      includes: (pkgData.includes || ["Hair Styling", "Luxury Facial"]).filter(i => i && i.trim())
    };
    setData(prev => ({
      ...prev,
      packagesList: [newPkg, ...(prev.packagesList || [])]
    }));
    showToast(`Package "${newPkg.name}" created!`);
  };

  const updatePackageItem = (pkgId, updatedData) => {
    setData(prev => ({
      ...prev,
      packagesList: (prev.packagesList || []).map(p => {
        if (p.id === pkgId) {
          const newPrice = updatedData.price !== undefined ? parseFloat(updatedData.price) : p.price;
          const newOrigPrice = updatedData.originalPrice !== undefined ? parseFloat(updatedData.originalPrice) : p.originalPrice;
          return {
            ...p,
            ...updatedData,
            price: newPrice,
            originalPrice: newOrigPrice,
            includes: (updatedData.includes || p.includes || []).filter(i => i && i.trim())
          };
        }
        return p;
      })
    }));
    showToast(`Package updated successfully.`);
  };

  const loadStarterPackages = () => {
    setData(prev => {
      const existingNames = new Set((prev.packagesList || []).map(p => (p.name || '').toLowerCase().trim()));
      const starters = (INITIAL_SALON_DATA.packagesList || []).filter(p => !existingNames.has((p.name || '').toLowerCase().trim()));
      return {
        ...prev,
        packagesList: [...(prev.packagesList || []), ...starters]
      };
    });
    showToast(`Loaded curated salon packages!`);
  };

  const deletePackageItem = (pkgId) => {
    setData(prev => ({
      ...prev,
      packagesList: (prev.packagesList || []).filter(p => p.id !== pkgId)
    }));
    showToast(`Package removed.`);
  };

  const addStockTransactionRecord = (txData) => {
    const id = "tx_" + Date.now().toString().slice(-5);
    const qty = parseInt(txData.qty || 1);
    const cost = parseFloat(txData.cost || 0);
    const newTx = {
      id,
      salonId: data.currentSalonId,
      type: txData.type || "Stock In",
      date: new Date().toISOString().split("T")[0],
      productName: txData.productName,
      qty,
      supplier: txData.supplier || (txData.type === 'Stock Out' ? "Floor Usage" : "Supplier"),
      cost,
      total: qty * cost,
      batch: txData.batch || "BATCH-" + Math.floor(100 + Math.random() * 900),
      reason: txData.reason || ""
    };

    setData(prev => {
      const updatedInv = (prev.inventory || []).map(p => {
        if (p.name.toLowerCase() === (txData.productName || '').toLowerCase() || p.id === txData.productId) {
          const delta = txData.type === 'Stock Out' ? -qty : qty;
          const newStock = Math.max(0, (parseInt(p.stock) || 0) + delta);
          const minAl = parseInt(p.minStockAlert) || 5;
          const updatedProd = {
            ...p,
            stock: newStock,
            status: newStock <= 0 ? "Out of Stock" : (newStock <= minAl ? "Low Stock" : "In Stock")
          };
          syncToFirestore('inventory', p.id, updatedProd);
          return updatedProd;
        }
        return p;
      });

      return {
        ...prev,
        inventory: updatedInv,
        stockTransactions: [newTx, ...(prev.stockTransactions || [])]
      };
    });

    syncToFirestore('stockTransactions', id, newTx);
    showToast(`${newTx.type} logged: ${qty} units of "${newTx.productName}"`);
    addAuditLog(`${newTx.type} of ${qty} units for ${newTx.productName}`, "Inventory");
  };

  const addCustomer = (custData) => {
    const id = "cust_" + Date.now().toString().slice(-5);
    const newCust = {
      id,
      name: custData.name,
      phone: custData.phone,
      email: custData.email || `${custData.name.toLowerCase().replace(/\s+/g, '.')}@gmail.com`,
      tier: custData.tier || "Gold Member",
      loyaltyPoints: parseInt(custData.loyaltyPoints || 150),
      totalVisits: parseInt(custData.totalVisits || 1),
      totalSpend: parseFloat(custData.totalSpend || 1200),
      lastVisit: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      avatar: custData.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
    };
    setData(prev => ({
      ...prev,
      customers: [newCust, ...(prev.customers || [])]
    }));
    syncToFirestore('customers', id, newCust);
    showToast(`Customer "${newCust.name}" added successfully!`);
    addAuditLog(`Added customer profile ${newCust.name}`, "CRM");
  };

  const deleteCustomer = (custId) => {
    setData(prev => ({
      ...prev,
      customers: (prev.customers || []).filter(c => c.id !== custId)
    }));
    deleteFromFirestore('customers', custId);
    showToast(`Customer profile removed.`);
  };

  const addSupplier = (supData) => {
    const id = "sup_" + Date.now().toString().slice(-5);
    const newSup = {
      id,
      name: supData.name,
      contactPerson: supData.contactPerson || "Account Manager",
      phone: supData.phone || "+91 98000 11223",
      email: supData.email || `${supData.name.toLowerCase().replace(/\s+/g, '')}@distributors.com`,
      balance: parseFloat(supData.balance || 0),
      productsSupplied: parseInt(supData.productsSupplied || 4)
    };
    setData(prev => ({
      ...prev,
      suppliers: [newSup, ...(prev.suppliers || [])]
    }));
    showToast(`Supplier "${newSup.name}" registered successfully!`);
    addAuditLog(`Registered supplier ${newSup.name}`, "Inventory");
  };

  const deleteSupplier = (supId) => {
    setData(prev => ({
      ...prev,
      suppliers: (prev.suppliers || []).filter(s => s.id !== supId)
    }));
    showToast(`Supplier removed.`);
  };

  const addProductUsageLog = (logData) => {
    const id = "usg_" + Date.now().toString().slice(-5);
    const newLog = {
      id,
      service: logData.service,
      stylist: logData.stylist || "Master Stylist",
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      productsUsed: Array.isArray(logData.productsUsed) ? logData.productsUsed : [
        { name: logData.productsUsedText || "Floor Products", qty: "1 unit" }
      ]
    };
    setData(prev => ({
      ...prev,
      productUsageLogs: [newLog, ...(prev.productUsageLogs || [])]
    }));
    showToast(`Product usage logged for "${newLog.service}"`);
  };

  const deleteProduct = (prodId) => {
    setData(prev => ({
      ...prev,
      inventory: (prev.inventory || []).filter(p => p.id !== prodId)
    }));
    deleteFromFirestore('inventory', prodId);
    showToast(`Product deleted from inventory.`);
  };

  const updateProduct = (prodId, updatedData) => {
    setData(prev => {
      const inventory = prev.inventory || [];
      const index = inventory.findIndex(p => p.id === prodId);
      if (index === -1) return prev;
      
      const existing = inventory[index];
      const stockQty = updatedData.stock !== undefined ? parseInt(updatedData.stock) : existing.stock;
      const minAlert = parseInt(updatedData.alert || updatedData.minStockAlert || existing.minStockAlert);
      const unitCostVal = updatedData.unitCost !== undefined ? parseFloat(updatedData.unitCost) : existing.unitCost;
      const sellPriceVal = updatedData.sellingPrice !== undefined ? parseFloat(updatedData.sellingPrice) : (updatedData.price !== undefined ? parseFloat(updatedData.price) : existing.sellingPrice);
      
      const totalCostVal = updatedData.totalCost !== undefined && updatedData.totalCost !== '' 
        ? parseFloat(updatedData.totalCost) 
        : (stockQty * unitCostVal);
        
      const status = stockQty <= 0 ? "Out of Stock" : (stockQty <= minAlert ? "Low Stock" : "In Stock");

      const updatedProduct = {
        ...existing,
        ...updatedData,
        stock: stockQty,
        minStockAlert: minAlert,
        unitCost: unitCostVal,
        totalCost: totalCostVal,
        sellingPrice: sellPriceVal,
        price: sellPriceVal,
        status: status,
        imageUrl: updatedData.imageUrl || existing.imageUrl || existing.image
      };

      const newInventory = [...inventory];
      newInventory[index] = updatedProduct;

      return {
        ...prev,
        inventory: newInventory
      };
    });
    
    // Sync the updated product by finding it or using the data we have.
    // To be safe, we can wait for state to update or just construct the payload.
    // The best way is to do the sync inside the functional update? No, React says no side effects.
    // Instead we can just sync the updatedData merged with existing.
    const existing = (data.inventory || []).find(p => p.id === prodId);
    if (existing) {
      const stockQty = updatedData.stock !== undefined ? parseInt(updatedData.stock) : existing.stock;
      const minAlert = parseInt(updatedData.alert || updatedData.minStockAlert || existing.minStockAlert);
      const unitCostVal = updatedData.unitCost !== undefined ? parseFloat(updatedData.unitCost) : existing.unitCost;
      const sellPriceVal = updatedData.sellingPrice !== undefined ? parseFloat(updatedData.sellingPrice) : (updatedData.price !== undefined ? parseFloat(updatedData.price) : existing.sellingPrice);
      const totalCostVal = updatedData.totalCost !== undefined && updatedData.totalCost !== '' ? parseFloat(updatedData.totalCost) : (stockQty * unitCostVal);
      const status = stockQty <= 0 ? "Out of Stock" : (stockQty <= minAlert ? "Low Stock" : "In Stock");
      
      const payloadToSync = {
        ...existing,
        ...updatedData,
        stock: stockQty,
        minStockAlert: minAlert,
        unitCost: unitCostVal,
        totalCost: totalCostVal,
        sellingPrice: sellPriceVal,
        price: sellPriceVal,
        status: status,
        imageUrl: updatedData.imageUrl || existing.imageUrl || existing.image
      };
      syncToFirestore('inventory', prodId, payloadToSync);
    }
    showToast(`Product updated successfully!`);
  };

  const addSalonBranch = (branchData) => {
    const id = "salon_" + (data.salons.length + 1).toString().padStart(2, "0");
    const newSalon = {
      id,
      name: branchData.name,
      city: branchData.city,
      address: branchData.address,
      phone: branchData.phone,
      email: branchData.email,
      status: "Active",
      rating: 5.0,
      totalAppointments: 0,
      monthlyRevenue: 0,
      adminName: branchData.adminName || "Branch Admin",
      adminEmail: branchData.adminEmail || "admin@lumieresalon.com",
      image: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=800&q=80",
      taxRate: 18,
      currency: "₹",
      openingHours: "09:00 AM - 09:30 PM"
    };

    setData(prev => ({
      ...prev,
      salons: [...prev.salons, newSalon]
    }));
    showToast(`Branch "${newSalon.name}" deployed!`);
    addAuditLog(`Deployed new branch ${newSalon.name}`, "SuperAdmin");
  };

  const toggleSalonStatus = (salonId) => {
    setData(prev => ({
      ...prev,
      salons: prev.salons.map(s => {
        if (s.id === salonId) {
          const status = s.status === "Active" ? "Suspended" : "Active";
          return { ...s, status };
        }
        return s;
      })
    }));
    showToast("Branch status updated");
  };

  const updateAdminPermissions = (key, val) => {
    setData(prev => ({
      ...prev,
      adminPermissions: { ...prev.adminPermissions, [key]: val }
    }));
    showToast(`Updated permission for ${key}: ${val ? 'Allowed' : 'Restricted'}`);
  };

  const login = async (usernameOrEmail, password) => {
    const cleanId = (usernameOrEmail || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();

    if (!cleanId || !cleanPass) {
      return { success: false, error: 'Please enter both username and password.' };
    }

    // Check if Super Admin
    const isSuperAdminUser =
      cleanId === 'superadmin' ||
      cleanId === 'super' ||
      cleanId === 'owner' ||
      cleanId === 'superadmin@lumieresalon.com' ||
      cleanId === 'superadmin@looksprofessional.com' ||
      cleanId.includes('superadmin');

    const targetEmail = cleanId.includes('@')
      ? cleanId
      : (isSuperAdminUser ? 'superadmin@looksprofessional.com' : 'admin@looksprofessional.com');
    const targetPassword = cleanPass.length >= 6 ? cleanPass : cleanPass + '123456';

    // Firebase Auth Authentication
    try {
      if (auth) {
        try {
          await signInWithEmailAndPassword(auth, targetEmail, targetPassword);
        } catch (authErr) {
          if (authErr.code === 'auth/user-not-found' || authErr.code === 'auth/invalid-credential') {
            try {
              await createUserWithEmailAndPassword(auth, targetEmail, targetPassword);
            } catch (signupErr) {
              console.warn("Firebase User Registration Notice:", signupErr.message);
            }
          }
        }
      }
    } catch (fbErr) {
      console.warn("Firebase Auth Notice:", fbErr.message);
    }

    if (isSuperAdminUser) {
      if (cleanPass === 'super123' || cleanPass === 'superadmin' || cleanPass === 'superadmin123' || cleanPass === 'admin123' || cleanPass.length >= 6) {
        const session = {
          role: 'superadmin',
          username: cleanId,
          email: targetEmail,
          name: 'Super Admin HQ (Owner Controller)',
          loginTime: new Date().toISOString()
        };
        localStorage.setItem('LUMIERE_AUTH_USER', JSON.stringify(session));
        setData(prev => ({ ...prev, currentUser: session }));
        syncToFirestore('users', session.username, session);
        showToast("⚡ Logged in with Firebase as Super Admin HQ! Welcome.");
        addAuditLog("Super Admin logged in to HQ Control (Firebase Auth)", "SuperAdmin");
        return { success: true, role: 'superadmin' };
      } else {
        return {
          success: false,
          error: 'Incorrect password for Super Admin! (Default: super123)'
        };
      }
    }

    // Check if Branch Admin
    const isBranchAdminUser =
      cleanId === 'admin' ||
      cleanId === 'vikram' ||
      cleanId === 'vikram malhotra' ||
      cleanId === 'admin@lumieresalon.com' ||
      cleanId === 'admin@looksprofessional.com' ||
      cleanId.includes('admin') ||
      data.salons.some(s => s.adminEmail.toLowerCase() === cleanId || s.adminName.toLowerCase().includes(cleanId));

    if (isBranchAdminUser || true) {
      if (cleanPass === 'admin123' || cleanPass === 'admin' || cleanPass === 'vikram123' || cleanPass === '123456' || cleanPass.length >= 6) {
        const matched = data.salons.find(s => 
          s.adminEmail.toLowerCase() === cleanId || 
          s.adminName.toLowerCase().includes(cleanId)
        ) || data.salons[0];

        if (matched) setCurrentSalonId(matched.id);

        const session = {
          role: 'admin',
          username: cleanId,
          email: targetEmail,
          name: matched ? matched.adminName : "Vikram Malhotra (Branch Admin)",
          salonId: matched ? matched.id : data.currentSalonId,
          loginTime: new Date().toISOString()
        };
        localStorage.setItem('LUMIERE_AUTH_USER', JSON.stringify(session));
        setData(prev => ({ ...prev, currentUser: session }));
        syncToFirestore('users', session.username, session);
        showToast(`💼 Logged in with Firebase as Branch Admin (${session.name})!`);
        addAuditLog(`Branch Admin (${session.name}) logged in (Firebase Auth)`, "Admin");
        return { success: true, role: 'admin' };
      } else {
        return {
          success: false,
          error: 'Incorrect password for Branch Admin! (Default: admin123)'
        };
      }
    }

    return {
      success: false,
      error: 'Invalid credentials. Enter "admin" (pass: admin123) or "superadmin" (pass: super123).'
    };
  };

  const logout = async () => {
    try {
      if (auth) await signOut(auth);
    } catch (e) {
      console.warn("Firebase signOut notice:", e.message);
    }
    localStorage.removeItem('LUMIERE_AUTH_USER');
    const guest = {
      role: 'customer',
      id: 'cust_01',
      name: 'Priya Deshmukh',
      email: 'priya.deshmukh@gmail.com',
      phone: '+91 98920 11223'
    };
    setData(prev => ({ ...prev, currentUser: guest }));
    showToast("🔒 Logged out of Firebase session");
  };

  const resetAllData = () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('LUMIERE_AUTH_USER');
    window.location.reload();
  };

  // E-Commerce UI State
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [lastPlacedOrder, setLastPlacedOrder] = useState(null);
  const [activeServiceCategory, setActiveServiceCategory] = useState('all');

  // E-Commerce Cart Operations
  const addToCart = (product, quantity = 1, openDrawer = true) => {
    const qtyToAdd = Math.max(1, parseInt(quantity) || 1);
    
    setData(prev => {
      const currentCart = prev.cart || [];
      const existingItemIndex = currentCart.findIndex(item => item.id === product.id);
      
      let updatedCart;
      if (existingItemIndex > -1) {
        updatedCart = currentCart.map((item, idx) => 
          idx === existingItemIndex 
            ? { ...item, quantity: item.quantity + qtyToAdd }
            : item
        );
      } else {
        updatedCart = [
          ...currentCart,
          {
            id: product.id,
            name: product.name,
            brand: product.brand || "Looks Professional",
            category: product.category,
            categoryLabel: product.categoryLabel,
            price: product.price,
            originalPrice: product.originalPrice || product.price,
            volume: product.volume,
            image: product.image,
            quantity: qtyToAdd,
            inStock: product.inStock !== false
          }
        ];
      }
      return { ...prev, cart: updatedCart };
    });

    showToast(`🛍️ Added "${product.name.slice(0, 24)}..." (${qtyToAdd}x) to Bag`);
    addAuditLog(`Added ${qtyToAdd}x ${product.name} to shopping bag`, "E-Commerce");
    
    if (openDrawer) {
      setIsCartDrawerOpen(true);
    }
  };

  const removeFromCart = (productId) => {
    setData(prev => {
      const itemToRemove = (prev.cart || []).find(item => item.id === productId);
      const updatedCart = (prev.cart || []).filter(item => item.id !== productId);
      if (itemToRemove) {
        showToast(`Removed "${itemToRemove.name.slice(0, 20)}..." from Bag`);
      }
      return { ...prev, cart: updatedCart };
    });
  };

  const updateCartQuantity = (productId, quantity) => {
    const newQty = parseInt(quantity);
    if (isNaN(newQty) || newQty <= 0) {
      removeFromCart(productId);
      return;
    }

    setData(prev => ({
      ...prev,
      cart: (prev.cart || []).map(item => 
        item.id === productId ? { ...item, quantity: Math.min(20, newQty) } : item
      )
    }));
  };

  const clearCart = () => {
    setData(prev => ({
      ...prev,
      cart: [],
      appliedCoupon: null
    }));
  };

  const applyCartCoupon = (code) => {
    if (!code || !code.trim()) {
      return { success: false, message: "Please enter a valid coupon code." };
    }
    const cleanCode = code.toUpperCase().trim();
    const coupon = (data.coupons || []).find(c => c.code.toUpperCase() === cleanCode);

    if (!coupon) {
      return { success: false, message: `Promo code "${cleanCode}" is invalid.` };
    }

    const subtotal = (data.cart || []).reduce((acc, item) => acc + (item.price * item.quantity), 0);
    if (subtotal < (coupon.minSpend || 0)) {
      return {
        success: false,
        message: `Code "${cleanCode}" requires minimum bag value of ₹${coupon.minSpend}.`
      };
    }

    let discountAmount = 0;
    if (coupon.discountType === "percentage") {
      discountAmount = Math.round((subtotal * coupon.value) / 100);
    } else {
      discountAmount = Math.min(subtotal, coupon.value);
    }

    const applied = {
      code: coupon.code,
      discountType: coupon.discountType,
      value: coupon.value,
      minSpend: coupon.minSpend,
      description: coupon.description,
      discountAmount
    };

    setData(prev => ({ ...prev, appliedCoupon: applied }));
    showToast(`✨ Coupon "${coupon.code}" applied! Saved ₹${discountAmount}`);
    addAuditLog(`Applied boutique coupon ${coupon.code}`, "E-Commerce");

    return {
      success: true,
      message: `Coupon applied! You saved ₹${discountAmount}`,
      discountAmount
    };
  };

  const removeCartCoupon = () => {
    setData(prev => ({ ...prev, appliedCoupon: null }));
    showToast("Coupon removed from bag");
  };

  const getCartMetrics = () => {
    const cart = data.cart || [];
    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const originalSubtotal = cart.reduce((acc, item) => acc + ((item.originalPrice || item.price) * item.quantity), 0);
    const productSavings = Math.max(0, originalSubtotal - subtotal);

    let couponDiscount = 0;
    if (data.appliedCoupon && subtotal >= (data.appliedCoupon.minSpend || 0)) {
      if (data.appliedCoupon.discountType === 'percentage') {
        couponDiscount = Math.round((subtotal * data.appliedCoupon.value) / 100);
      } else {
        couponDiscount = Math.min(subtotal, data.appliedCoupon.value);
      }
    }

    const freeShippingThreshold = 1500;
    const shipping = subtotal === 0 ? 0 : (subtotal >= freeShippingThreshold ? 0 : 150);
    const amountToFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

    // GST included or added (18% tax calculation for display)
    const taxableSubtotal = Math.max(0, subtotal - couponDiscount);
    const tax = taxableSubtotal > 0 ? Math.round(taxableSubtotal * 0.05) : 0; // 5% luxury cosmetic tax rate

    const grandTotal = Math.max(0, taxableSubtotal + shipping);
    const totalSavings = productSavings + couponDiscount;

    return {
      totalItems,
      subtotal,
      originalSubtotal,
      productSavings,
      couponDiscount,
      shipping,
      freeShippingThreshold,
      amountToFreeShipping,
      tax,
      grandTotal,
      totalSavings,
      hasFreeShipping: subtotal >= freeShippingThreshold && subtotal > 0
    };
  };

  const placeEcomOrder = (orderData) => {
    const metrics = getCartMetrics();
    const orderId = "ORD-" + new Date().getFullYear() + "-" + Math.floor(1000 + Math.random() * 9000);
    
    const newOrder = {
      orderId,
      date: new Date().toISOString().split("T")[0],
      createdAt: new Date().toISOString(),
      customer: {
        name: orderData.customerName || data.currentUser?.name || "Valued Client",
        email: orderData.customerEmail || data.currentUser?.email || "client@looksprofessional.com",
        phone: orderData.customerPhone || data.currentUser?.phone || "+91 98000 00000",
        address: orderData.address || "Flagship Delivery Address",
        city: orderData.city || "Mumbai",
        pincode: orderData.pincode || "400050",
        landmark: orderData.landmark || ""
      },
      items: [...(data.cart || [])],
      subtotal: metrics.subtotal,
      discount: metrics.couponDiscount,
      couponCode: data.appliedCoupon?.code || "",
      shipping: orderData.shippingFee !== undefined ? orderData.shippingFee : metrics.shipping,
      deliverySpeed: orderData.deliverySpeed || "Standard White-Glove (2-3 Days)",
      tax: metrics.tax,
      totalAmount: (metrics.subtotal - metrics.couponDiscount) + (orderData.shippingFee !== undefined ? orderData.shippingFee : metrics.shipping),
      status: "Processing",
      paymentMethod: orderData.paymentMethod || "UPI (Google Pay / QR)",
      paymentStatus: orderData.paymentMethod === "Cash on Delivery" ? "Pending" : "Paid",
      notes: orderData.notes || "Luxury gift-wrapped packaging requested."
    };

    setData(prev => ({
      ...prev,
      orders: [newOrder, ...(prev.orders || [])],
      cart: [],
      appliedCoupon: null
    }));

    syncToFirestore('orders', orderId, newOrder);
    setLastPlacedOrder(newOrder);
    addAuditLog(`Placed boutique order #${orderId} for ₹${newOrder.totalAmount}`, "E-Commerce");
    showToast(`🎉 Order Placed Successfully! Order #${orderId}`);

    return newOrder;
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setData(prev => ({
      ...prev,
      orders: (prev.orders || []).map(o => (o.orderId === orderId || o.id === orderId) ? { ...o, status: newStatus } : o)
    }));
    syncToFirestore('orders', orderId, { status: newStatus });
    addAuditLog(`Updated Boutique Order #${orderId} status to ${newStatus}`, "Orders");
    showToast(`Order #${orderId} marked as ${newStatus}`);
  };

  const deleteOrder = (orderId) => {
    setData(prev => ({
      ...prev,
      orders: (prev.orders || []).filter(o => o.orderId !== orderId && o.id !== orderId)
    }));
    addAuditLog(`Removed Boutique Order #${orderId}`, "Orders");
    showToast(`Order #${orderId} deleted successfully`);
  };

  return (
    <SalonContext.Provider value={{
      data,
      toasts,
      showToast,
      getCurrentSalon,
      setCurrentSalonId,
      createAppointment,
      updateAppointmentStatus,
      generatePOSInvoice,
      addStock,
      addProduct,
      addStaff,
      updateStaff,
      deleteStaff,
      toggleStaffStatus,
      addExpense,
      addCoupon,
      validateCoupon,
      addSalonBranch,
      toggleSalonStatus,
      updateAdminPermissions,
      login,
      logout,
      resetAllData,
      // Admin CRUD methods
      addLead,
      updateLead,
      updateLeadStatus,
      addLeadFollowUp,
      bookLeadAppointment,
      markLeadServiceDone,
      convertLeadToCustomer,
      deleteLead,
      addIncentiveRule,
      deleteIncentiveRule,
      addServiceItem,
      deleteServiceItem,
      addPackageItem,
      updatePackageItem,
      loadStarterPackages,
      deletePackageItem,
      addStockTransactionRecord,
      addCustomer,
      deleteCustomer,
      addSupplier,
      deleteSupplier,
      addProductUsageLog,
      deleteProduct,
      updateProduct,
      updateOrderStatus,
      deleteOrder,
      // E-Commerce states & methods
      isCartDrawerOpen,
      setIsCartDrawerOpen,
      isCheckoutModalOpen,
      setIsCheckoutModalOpen,
      quickViewProduct,
      setQuickViewProduct,
      lastPlacedOrder,
      setLastPlacedOrder,
      activeServiceCategory,
      setActiveServiceCategory,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      applyCartCoupon,
      removeCartCoupon,
      getCartMetrics,
      placeEcomOrder
    }}>
      {children}
    </SalonContext.Provider>
  );
};

export const useSalon = () => useContext(SalonContext);

