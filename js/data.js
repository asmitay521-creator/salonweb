/**
 * LOOKS PROFESSIONAL Luxury Unisex Salon & Spa
 * Central Data Seed & Mock Database
 */

const INITIAL_DATA = {
  salons: [
    {
      id: "salon_01",
      name: "Looks Professional - Bandra Flagship",
      city: "Mumbai",
      address: "Plot 42, Linking Road, Bandra West, Mumbai 400050",
      phone: "+91 98201 23456",
      email: "bandra@looksprofessional.com",
      status: "Active",
      rating: 4.9,
      totalAppointments: 1420,
      monthlyRevenue: 845000,
      adminName: "Vikram Malhotra",
      adminEmail: "vikram@looksprofessional.com",
      image: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=800&q=80",
      taxRate: 18,
      currency: "₹",
      openingHours: "09:00 AM - 09:30 PM"
    },
    {
      id: "salon_02",
      name: "Looks Professional - Koregaon Park",
      city: "Pune",
      address: "North Main Road, Koregaon Park, Pune 411001",
      phone: "+91 98202 34567",
      email: "pune@looksprofessional.com",
      status: "Active",
      rating: 4.8,
      totalAppointments: 980,
      monthlyRevenue: 620000,
      adminName: "Ananya Sharma",
      adminEmail: "ananya@looksprofessional.com",
      image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80",
      taxRate: 18,
      currency: "₹",
      openingHours: "10:00 AM - 09:00 PM"
    },
    {
      id: "salon_03",
      name: "Looks Professional - Cyber City",
      city: "Gurugram",
      address: "Tower B, DLF Cyber City, Phase 2, Gurugram 122002",
      phone: "+91 98203 45678",
      email: "cybercity@looksprofessional.com",
      status: "Active",
      rating: 4.9,
      totalAppointments: 1150,
      monthlyRevenue: 780000,
      adminName: "Rohan Varma",
      adminEmail: "rohan@lumieresalon.com",
      image: "https://images.unsplash.com/photo-1582095133179-bfd08e2fc6b3?auto=format&fit=crop&w=800&q=80",
      taxRate: 18,
      currency: "₹",
      openingHours: "09:30 AM - 09:30 PM"
    }
  ],

  categories: [
    { id: "hair", name: "Hair Styling & Cuts", icon: "scissors", description: "Couture cuts, blowdry, styling & texturizing" },
    { id: "color", name: "Color & Balayage", icon: "palette", description: "Global color, ombre, highlights & toning" },
    { id: "treatment", name: "Hair Spa & Keratin", icon: "sparkles", description: "Olaplex, Botox, Keratin smoothing & deep moisture" },
    { id: "skin", name: "Facial & Skincare", icon: "smile", description: "HydraFacial, Gold Radiance, peeling & rejuvenation" },
    { id: "beard", name: "Beard & Male Grooming", icon: "user-check", description: "Royal razor shave, beard sculpting & detox" },
    { id: "nails", name: "Nails & Pedicure", icon: "hand", description: "Gel extensions, nail art, luxury foot spa" },
    { id: "packages", name: "Combos & Bridal", icon: "gift", description: "Exclusive signature packages and pre-bridal pampering" }
  ],

  services: [
    {
      id: "srv_01",
      name: "Signature Precision Haircut & Styling",
      categoryId: "hair",
      gender: "unisex",
      duration: 45,
      price: 1200,
      rating: 4.9,
      description: "Consultation, relaxing hair wash, master stylist precision cut, blow-dry and luxury serum finish.",
      image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "srv_02",
      name: "Men's Royal Haircut & Beard Sculpting",
      categoryId: "hair",
      gender: "men",
      duration: 50,
      price: 1400,
      rating: 4.9,
      description: "Custom fade/sculpt haircut, hot towel steam, beard trim with organic oils, and scalp massage.",
      image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "srv_03",
      name: "Women's Couture Haircut & Blowout",
      categoryId: "hair",
      gender: "women",
      duration: 60,
      price: 1800,
      rating: 5.0,
      description: "Customised texture haircut, hair detox shampoo, Moroccan oil mask and bouncy voluminous blow-dry.",
      image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "srv_04",
      name: "French Balayage & Glossing",
      categoryId: "color",
      gender: "women",
      duration: 150,
      price: 6500,
      rating: 4.9,
      description: "Hand-painted sun-kissed lightening, bond protector, customized toner gloss, and styling.",
      image: "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "srv_05",
      name: "Global Hair Color (Ammonia-Free)",
      categoryId: "color",
      gender: "unisex",
      duration: 90,
      price: 3800,
      rating: 4.8,
      description: "Full root-to-tip vibrant color with organic nourishing oils and high shine reflection.",
      image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "srv_06",
      name: "Keratin Protein Infusion & Smoothing",
      categoryId: "treatment",
      gender: "unisex",
      duration: 120,
      price: 5500,
      rating: 4.9,
      description: "Formaldehyde-free intensive smoothing treatment that eliminates frizz and restores mirror shine.",
      image: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "srv_07",
      name: "Olaplex Standalone Hair Repair Spa",
      categoryId: "treatment",
      gender: "unisex",
      duration: 60,
      price: 2600,
      rating: 4.9,
      description: "Bond-multiplying treatment repairing bleached and heat-damaged hair from inside out.",
      image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "srv_08",
      name: "Looks Professional 24K Gold Luxury Facial",
      categoryId: "skin",
      gender: "unisex",
      duration: 75,
      price: 3200,
      rating: 5.0,
      description: "Ultrasonic deep cleansing, 24K gold foil infusion, collagen mask, and pressure point lymphatic massage.",
      image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "srv_09",
      name: "HydraGlow Deep Derma Pore Cleansing",
      categoryId: "skin",
      gender: "unisex",
      duration: 60,
      price: 3900,
      rating: 4.9,
      description: "Hydro-dermabrasion vortex suction, gentle peel, hyaluronic acid hydration and cooling oxygen blast.",
      image: "https://images.unsplash.com/photo-1512290900672-1f55a1532f6b?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "srv_10",
      name: "Royal Gentleman Hot Towel Shave & Detox",
      categoryId: "beard",
      gender: "men",
      duration: 40,
      price: 850,
      rating: 4.8,
      description: "Pre-shave eucalyptus oil, multi-layer hot steaming towels, straight-razor close shave & chilled mint toner.",
      image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "srv_11",
      name: "Diamond Luxury Manicure & Pedicure Spa",
      categoryId: "nails",
      gender: "unisex",
      duration: 70,
      price: 2200,
      rating: 4.9,
      description: "Exfoliating diamond crystal scrub, warm paraffin dip, cuticle care, reflexology massage and buff/polish.",
      image: "https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "srv_12",
      name: "Royal Crown Full Pamper Package",
      categoryId: "packages",
      gender: "unisex",
      duration: 180,
      price: 6999,
      originalPrice: 9200,
      rating: 5.0,
      description: "Signature Haircut + Olaplex Spa + 24K Gold Facial + Luxury Mani-Pedi + Welcome Mocktail.",
      image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80"
    }
  ],

  staff: [
    {
      id: "stf_01",
      salonId: "salon_01",
      name: "Karan Singhania",
      role: "Creative Director & Hair Master",
      category: "Hair Specialist",
      gender: "men",
      phone: "+91 98111 22334",
      email: "karan@lumieresalon.com",
      rating: 4.95,
      reviewsCount: 312,
      experience: "12 Years",
      commissionRate: 18,
      status: "Available",
      photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
      skills: ["Precision Fades", "Couture Styling", "Texturizing", "Runway Hair"]
    },
    {
      id: "stf_02",
      salonId: "salon_01",
      name: "Natasha Roy",
      role: "Master Colorist & Balayage Expert",
      category: "Color Specialist",
      gender: "women",
      phone: "+91 98111 55667",
      email: "natasha@lumieresalon.com",
      rating: 4.98,
      reviewsCount: 420,
      experience: "9 Years",
      commissionRate: 15,
      status: "In-Service",
      photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
      skills: ["French Balayage", "Ombre Color", "Blonde specialist", "Color Correction"]
    },
    {
      id: "stf_03",
      salonId: "salon_01",
      name: "Zoya Merchant",
      role: "Lead Aesthetician & Skin Specialist",
      category: "Skin Expert",
      gender: "women",
      phone: "+91 98111 88990",
      email: "zoya@lumieresalon.com",
      rating: 4.9,
      reviewsCount: 260,
      experience: "7 Years",
      commissionRate: 12,
      status: "Available",
      photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80",
      skills: ["HydraFacial", "24K Gold Therapy", "Anti-aging", "Dermaplaning"]
    },
    {
      id: "stf_04",
      salonId: "salon_01",
      name: "Devrath Singh",
      role: "Master Barber & Beard Architect",
      category: "Beard Specialist",
      gender: "men",
      phone: "+91 98111 33445",
      email: "devrath@lumieresalon.com",
      rating: 4.88,
      reviewsCount: 195,
      experience: "8 Years",
      commissionRate: 14,
      status: "Available",
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
      skills: ["Hot Towel Shave", "Beard Styling", "Hair Tattoos", "Scalp Detox"]
    },
    {
      id: "stf_05",
      salonId: "salon_02",
      name: "Pooja Hegde",
      role: "Senior Hair Stylist & Keratin Pro",
      category: "Hair Specialist",
      gender: "women",
      phone: "+91 98222 11223",
      email: "pooja@lumieresalon.com",
      rating: 4.85,
      reviewsCount: 180,
      experience: "6 Years",
      commissionRate: 12,
      status: "Available",
      photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
      skills: ["Keratin Treatment", "Botox Hair", "Layered Cuts", "Bridal Hair"]
    }
  ],

  customers: [
    {
      id: "cust_01",
      name: "Priya Deshmukh",
      phone: "+91 98920 11223",
      email: "priya.deshmukh@gmail.com",
      tier: "Diamond VIP",
      loyaltyPoints: 850,
      totalVisits: 14,
      totalSpend: 42500,
      lastVisit: "2026-09-25",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80"
    },
    {
      id: "cust_02",
      name: "Rahul Khanna",
      phone: "+91 98200 44556",
      email: "rahul.khanna@outlook.com",
      tier: "Gold Member",
      loyaltyPoints: 420,
      totalVisits: 8,
      totalSpend: 18400,
      lastVisit: "2026-09-28",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80"
    },
    {
      id: "cust_03",
      name: "Simran Oberoi",
      phone: "+91 98765 88990",
      email: "simran.o@gmail.com",
      tier: "Platinum VIP",
      loyaltyPoints: 1240,
      totalVisits: 19,
      totalSpend: 68900,
      lastVisit: "2026-09-29",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
    }
  ],

  appointments: [
    {
      id: "apt_101",
      salonId: "salon_01",
      customerId: "cust_01",
      customerName: "Priya Deshmukh",
      customerPhone: "+91 98920 11223",
      customerEmail: "priya.deshmukh@gmail.com",
      serviceId: "srv_04",
      serviceName: "French Balayage & Glossing",
      gender: "women",
      staffId: "stf_02",
      staffName: "Natasha Roy",
      date: "2026-09-30",
      time: "11:00 AM",
      duration: 150,
      amount: 6500,
      discount: 500,
      tax: 1080,
      finalAmount: 7080,
      couponCode: "ROYAL100",
      paymentMethod: "UPI",
      paymentStatus: "Paid",
      status: "In-Progress", // In-Service
      notes: "Wants caramel highlights with golden honey tone finish."
    },
    {
      id: "apt_102",
      salonId: "salon_01",
      customerId: "cust_02",
      customerName: "Rahul Khanna",
      customerPhone: "+91 98200 44556",
      customerEmail: "rahul.khanna@outlook.com",
      serviceId: "srv_02",
      serviceName: "Men's Royal Haircut & Beard Sculpting",
      gender: "men",
      staffId: "stf_04",
      staffName: "Devrath Singh",
      date: "2026-09-30",
      time: "02:30 PM",
      duration: 50,
      amount: 1400,
      discount: 0,
      tax: 252,
      finalAmount: 1652,
      couponCode: "",
      paymentMethod: "Card",
      paymentStatus: "Pending",
      status: "Confirmed",
      notes: "Sharp low taper fade, hot towel shave."
    },
    {
      id: "apt_103",
      salonId: "salon_01",
      customerId: "cust_03",
      customerName: "Simran Oberoi",
      customerPhone: "+91 98765 88990",
      customerEmail: "simran.o@gmail.com",
      serviceId: "srv_08",
      serviceName: "Looks Professional 24K Gold Luxury Facial",
      gender: "women",
      staffId: "stf_03",
      staffName: "Zoya Merchant",
      date: "2026-09-30",
      time: "04:00 PM",
      duration: 75,
      amount: 3200,
      discount: 320,
      tax: 518,
      finalAmount: 3398,
      couponCode: "GLAMOUR10",
      paymentMethod: "Cash",
      paymentStatus: "Pending",
      status: "Pending",
      notes: "Pre-event glow, sensitive skin care."
    },
    {
      id: "apt_104",
      salonId: "salon_01",
      customerId: "cust_01",
      customerName: "Priya Deshmukh",
      customerPhone: "+91 98920 11223",
      customerEmail: "priya.deshmukh@gmail.com",
      serviceId: "srv_06",
      serviceName: "Keratin Protein Infusion & Smoothing",
      gender: "women",
      staffId: "stf_01",
      staffName: "Karan Singhania",
      date: "2026-09-28",
      time: "01:00 PM",
      duration: 120,
      amount: 5500,
      discount: 550,
      tax: 891,
      finalAmount: 5841,
      couponCode: "GLAMOUR10",
      paymentMethod: "UPI",
      paymentStatus: "Paid",
      status: "Completed",
      notes: "Excellent results. Hair mirror smooth."
    }
  ],

  inventory: [
    {
      id: "prd_01",
      salonId: "salon_01",
      name: "L'Oréal Professionnel Absolut Repair Shampoo (1500ml)",
      category: "Hair Care",
      sku: "LOR-AR-1500",
      stock: 14,
      minStockAlert: 5,
      unitCost: 1850,
      sellingPrice: 2450,
      supplier: "L'Oréal Professional India",
      status: "In Stock"
    },
    {
      id: "prd_02",
      salonId: "salon_01",
      name: "Olaplex No. 1 & No. 2 Salon Intro Kit",
      category: "Treatments",
      sku: "OLA-BOND-KIT",
      stock: 3,
      minStockAlert: 4,
      unitCost: 8200,
      sellingPrice: 11500,
      supplier: "Beauty Care Logistics Ltd",
      status: "Low Stock"
    },
    {
      id: "prd_03",
      salonId: "salon_01",
      name: "Moroccanoil Treatment Original (100ml)",
      category: "Hair Styling",
      sku: "MOR-OIL-100",
      stock: 22,
      minStockAlert: 6,
      unitCost: 2600,
      sellingPrice: 3800,
      supplier: "Moroccanoil Direct",
      status: "In Stock"
    },
    {
      id: "prd_04",
      salonId: "salon_01",
      name: "Schwarzkopf Igora Royal Color Tubes (60g)",
      category: "Colorants",
      sku: "SCH-IG-60",
      stock: 45,
      minStockAlert: 15,
      unitCost: 480,
      sellingPrice: 850,
      supplier: "Schwarzkopf Pro Hub",
      status: "In Stock"
    },
    {
      id: "prd_05",
      salonId: "salon_01",
      name: "Forest Essentials Organic Facial Polish",
      category: "Skincare",
      sku: "FE-FAC-POLISH",
      stock: 2,
      minStockAlert: 5,
      unitCost: 1900,
      sellingPrice: 2750,
      supplier: "Forest Essentials Ayurveda",
      status: "Low Stock"
    },
    {
      id: "prd_06",
      salonId: "salon_01",
      name: "Premium Beard Growth Balm & Serum",
      category: "Men Grooming",
      sku: "LUX-BEARD-BLM",
      stock: 18,
      minStockAlert: 5,
      unitCost: 650,
      sellingPrice: 1200,
      supplier: "Gentleman Co.",
      status: "In Stock"
    }
  ],

  coupons: [
    {
      code: "GLAMOUR20",
      discountType: "percentage",
      value: 20,
      minSpend: 2000,
      description: "20% Flat off on all Services above ₹2,000",
      validUntil: "2026-12-31",
      usedCount: 145
    },
    {
      code: "ROYAL100",
      discountType: "fixed",
      value: 500,
      minSpend: 2500,
      description: "Flat ₹500 discount on Luxury Facials & Balayage",
      validUntil: "2026-11-30",
      usedCount: 89
    },
    {
      code: "WELCOME50",
      discountType: "percentage",
      value: 15,
      minSpend: 1000,
      description: "15% off for all first-time guests",
      validUntil: "2026-12-31",
      usedCount: 320
    }
  ],

  expenses: [
    {
      id: "exp_01",
      salonId: "salon_01",
      category: "Utility & Electricity",
      description: "HVAC & High-Powered Blowers Electric Bill",
      amount: 28500,
      date: "2026-09-28",
      paidBy: "Admin - Vikram",
      paymentMode: "Bank Transfer"
    },
    {
      id: "exp_02",
      salonId: "salon_01",
      category: "Refreshments & Hospitality",
      description: "Artisan Coffee, Herbal Teas & Welcome Mocktails",
      amount: 8400,
      date: "2026-09-29",
      paidBy: "Reception",
      paymentMode: "Cash"
    },
    {
      id: "exp_03",
      salonId: "salon_01",
      category: "Linen & Hygiene Sanitization",
      description: "Weekly sterile towel laundering & sanitation",
      amount: 11200,
      date: "2026-09-30",
      paidBy: "Admin - Vikram",
      paymentMode: "UPI"
    }
  ],

  reviews: [
    {
      id: "rev_01",
      name: "Aarti Mehra",
      rating: 5,
      service: "French Balayage & Glossing",
      stylist: "Natasha Roy",
      date: "2 days ago",
      comment: "Absolutely extraordinary service! Natasha transformed my hair completely. The ambience is 7-star luxury.",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80"
    },
    {
      id: "rev_02",
      name: "Kabir Mehmood",
      rating: 5,
      service: "Royal Gentleman Hot Towel Shave",
      stylist: "Devrath Singh",
      date: "3 days ago",
      comment: "Best beard styling and hot towel shave in the city. The eucalyptus steam treatment was super rejuvenating.",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80"
    },
    {
      id: "rev_03",
      name: "Dr. Shalini Kapoor",
      rating: 5,
      service: "Looks Professional 24K Gold Luxury Facial",
      stylist: "Zoya Merchant",
      date: "1 week ago",
      comment: "Zoya's touch is pure magic! My skin has never looked this radiant. Will definitely be a regular customer.",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80"
    }
  ],

  auditLogs: [
    { id: "log_01", user: "Vikram Malhotra (Admin)", action: "Generated Invoice #INV-2026-104", timestamp: "2026-09-30 11:45 AM", type: "Billing" },
    { id: "log_02", user: "Natasha Roy (Staff)", action: "Started Appointment #apt_101", timestamp: "2026-09-30 11:05 AM", type: "Service" },
    { id: "log_03", user: "Vikram Malhotra (Admin)", action: "Updated Stock for Olaplex No. 1", timestamp: "2026-09-30 10:15 AM", type: "Inventory" },
    { id: "log_04", user: "Super Admin (HQ)", action: "Updated Global Tax & Commission Policy", timestamp: "2026-09-29 06:30 PM", type: "System" }
  ]
};

window.INITIAL_SALON_DATA = INITIAL_DATA;
