import {
  User,
  CustomerProfile,
  DriverProfile,
  VehicleConfig,
  Order,
  OrderStatus,
  DriverOffer,
  SupportTicket,
  DamageClaim,
  Coupon,
  AuditLog,
  PricingRule,
  DeliveryVerification,
  PaymentDetails,
  FareBreakdown,
  Invoice,
  DriverDocument,
  BankAccount
} from '../types';
import { generateBookingId, generateInvoiceId, generateOtp } from './idService';
import { FareCalculationService } from './fareService';
import {
  canTransitionStatus,
  describeStatusTransition
} from './orderStateMachine';
import { dispatchEngine } from './dispatchEngine';

// Default Vehicle Fleet configuration (Admin-configurable)
export const INITIAL_VEHICLES: VehicleConfig[] = [
  {
    id: 'veh_two_wheeler',
    name: '2-Wheeler',
    category: 'two_wheeler',
    subtitle: 'Documents, food, small parcels up to 20kg',
    capacityKg: 20,
    dimensions: '40cm x 40cm x 40cm',
    baseFare: 45,
    baseDistanceKm: 2,
    perKmRate: 12,
    perMinRate: 1.0,
    minFare: 50,
    stopCharge: 25,
    waitingRatePerMin: 2,
    freeWaitingMin: 10,
    isAvailable: true,
    etaMinutes: 4,
    iconName: 'Bike'
  },
  {
    id: 'veh_three_wheeler',
    name: '3-Wheeler Auto',
    category: 'three_wheeler',
    subtitle: 'Boxes, cartons, light appliances up to 500kg',
    capacityKg: 500,
    dimensions: '5ft x 4ft x 4.5ft',
    baseFare: 180,
    baseDistanceKm: 2,
    perKmRate: 18,
    perMinRate: 2.0,
    minFare: 220,
    stopCharge: 50,
    waitingRatePerMin: 3,
    freeWaitingMin: 20,
    isAvailable: true,
    etaMinutes: 6,
    iconName: 'Truck'
  },
  {
    id: 'veh_mini_truck',
    name: 'Tata Ace (Mini Truck)',
    category: 'mini_truck',
    subtitle: 'Chhota Hathi - Furniture, retail stock, up to 850kg',
    capacityKg: 850,
    dimensions: '7ft x 4.5ft x 5ft',
    baseFare: 280,
    baseDistanceKm: 2,
    perKmRate: 24,
    perMinRate: 2.5,
    minFare: 350,
    stopCharge: 75,
    waitingRatePerMin: 4,
    freeWaitingMin: 30,
    isAvailable: true,
    etaMinutes: 8,
    iconName: 'Truck'
  },
  {
    id: 'veh_pickup_8ft',
    name: 'Pickup 8ft (Bolero Maxi)',
    category: 'pickup_8ft',
    subtitle: 'Heavy machinery, 1BHK moves, up to 1250kg',
    capacityKg: 1250,
    dimensions: '8ft x 5ft x 5.5ft',
    baseFare: 390,
    baseDistanceKm: 2,
    perKmRate: 28,
    perMinRate: 3.0,
    minFare: 480,
    stopCharge: 100,
    waitingRatePerMin: 5,
    freeWaitingMin: 45,
    isAvailable: true,
    etaMinutes: 12,
    iconName: 'Container'
  },
  {
    id: 'veh_truck_14ft',
    name: '14ft Truck (Eicher)',
    category: 'truck_14ft',
    subtitle: 'Industrial cargo, 2BHK/3BHK moves, up to 3500kg',
    capacityKg: 3500,
    dimensions: '14ft x 6ft x 6.5ft',
    baseFare: 950,
    baseDistanceKm: 3,
    perKmRate: 42,
    perMinRate: 4.0,
    minFare: 1200,
    stopCharge: 150,
    waitingRatePerMin: 7,
    freeWaitingMin: 60,
    isAvailable: true,
    etaMinutes: 15,
    iconName: 'Package'
  }
];

export const INITIAL_CUSTOMERS: CustomerProfile[] = [
  {
    userId: 'cust_rahul',
    name: 'Rahul Sharma',
    phone: '+91 98765 43210',
    email: 'rahul.sharma@gmail.com',
    gstNumber: '29ABCDE1234F1Z5',
    companyName: 'Sharma Home Decor',
    isEnterprise: false,
    walletBalance: 450,
    totalOrders: 14,
    savedAddresses: [
      {
        id: 'addr_home',
        label: 'Home',
        address: 'Flat 402, Prestige Palms, 12th Main, HAL 2nd Stage, Indiranagar, Bengaluru, 560038',
        landmark: 'Opposite Toit Brewpub',
        lat: 12.9784,
        lng: 77.6408,
        contactName: 'Rahul Sharma',
        contactPhone: '+91 98765 43210'
      },
      {
        id: 'addr_warehouse',
        label: 'Warehouse',
        address: 'Shed 14, Peenya Industrial Area 2nd Stage, Bengaluru, 560058',
        landmark: 'Near Peenya Metro Gate 2',
        lat: 13.0285,
        lng: 77.5197,
        contactName: 'Mahesh (Supervisor)',
        contactPhone: '+91 98112 33445'
      },
      {
        id: 'addr_shop',
        label: 'Shop',
        address: 'Shop 8, Commercial Street, Shivaji Nagar, Bengaluru, 560001',
        landmark: 'Near Anand Sweets',
        lat: 12.9822,
        lng: 77.6083,
        contactName: 'Ravi',
        contactPhone: '+91 98450 99887'
      }
    ]
  },
  {
    userId: 'cust_priya',
    name: 'Priya Verma',
    phone: '+91 98450 11223',
    email: 'priya.v@outlook.com',
    isEnterprise: false,
    walletBalance: 120,
    totalOrders: 6,
    savedAddresses: [
      {
        id: 'addr_p1',
        label: 'Home',
        address: '68, 5th Cross, 4th Block, Koramangala, Bengaluru, 560034',
        landmark: 'Near Wipro Park',
        lat: 12.9345,
        lng: 77.6266,
        contactName: 'Priya Verma',
        contactPhone: '+91 98450 11223'
      }
    ]
  }
];

export const INITIAL_DRIVERS: DriverProfile[] = [
  {
    id: 'drv_ramesh',
    userId: 'user_ramesh',
    name: 'Ramesh Kumar',
    phone: '+91 98190 44211',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    rating: 4.88,
    ratingCount: 142,
    isOnline: true,
    isOnTrip: false,
    status: 'ACTIVE',
    vehicleId: 'veh_mini_truck',
    vehicleNumber: 'KA 03 AB 4492',
    vehicleModel: 'Tata Ace Gold Petrol (White)',
    currentLat: 12.9810,
    currentLng: 77.6450,
    heading: 45,
    speedKmph: 26,
    kycStatus: 'APPROVED',
    todaysEarnings: 1450,
    totalTrips: 342,
    acceptanceRate: 96,
    documents: [
      { id: 'doc_1', type: 'AADHAAR', title: 'Aadhaar Card', docNumber: 'XXXX-XXXX-8912', status: 'APPROVED', submittedAt: '2026-01-10' },
      { id: 'doc_2', type: 'DRIVING_LICENSE', title: 'Commercial Driving License', docNumber: 'KA032018004921', status: 'APPROVED', expiryDate: '2030-05-14' },
      { id: 'doc_3', type: 'RC', title: 'Vehicle Registration (RC)', docNumber: 'KA03AB4492', status: 'APPROVED' },
      { id: 'doc_4', type: 'INSURANCE', title: 'Commercial Insurance Policy', docNumber: 'BAJAJ-COMM-99482', status: 'APPROVED', expiryDate: '2027-02-28' },
      { id: 'doc_5', type: 'PUC', title: 'Pollution Certificate (PUC)', docNumber: 'PUC-KA03-8821', status: 'APPROVED', expiryDate: '2026-11-30' }
    ],
    bankAccount: {
      accountHolder: 'Ramesh Kumar',
      accountNumber: '••••••••4892',
      ifsc: 'SBIN0004018',
      bankName: 'State Bank of India',
      isVerified: true
    }
  },
  {
    id: 'drv_suresh',
    userId: 'user_suresh',
    name: 'Suresh Yadav',
    phone: '+91 98860 77112',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    rating: 4.92,
    ratingCount: 89,
    isOnline: true,
    isOnTrip: false,
    status: 'ACTIVE',
    vehicleId: 'veh_three_wheeler',
    vehicleNumber: 'KA 04 MM 8812',
    vehicleModel: 'Piaggio Ape Xtra LDX',
    currentLat: 12.9360,
    currentLng: 77.6240,
    heading: 90,
    speedKmph: 0,
    kycStatus: 'APPROVED',
    todaysEarnings: 820,
    totalTrips: 188,
    acceptanceRate: 98,
    documents: [
      { id: 'doc_6', type: 'AADHAAR', title: 'Aadhaar Card', docNumber: 'XXXX-XXXX-4401', status: 'APPROVED' },
      { id: 'doc_7', type: 'DRIVING_LICENSE', title: 'Commercial Driving License', docNumber: 'KA042019001824', status: 'APPROVED', expiryDate: '2031-08-20' }
    ],
    bankAccount: {
      accountHolder: 'Suresh Yadav',
      accountNumber: '••••••••1109',
      ifsc: 'HDFC0000240',
      bankName: 'HDFC Bank',
      isVerified: true
    }
  },
  {
    id: 'drv_manpreet',
    userId: 'user_manpreet',
    name: 'Manpreet Singh',
    phone: '+91 99160 55443',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    rating: 4.75,
    ratingCount: 215,
    isOnline: true,
    isOnTrip: false,
    status: 'ACTIVE',
    vehicleId: 'veh_truck_14ft',
    vehicleNumber: 'KA 01 CA 9901',
    vehicleModel: 'Eicher Pro 2049 (14ft Closed Container)',
    currentLat: 13.0250,
    currentLng: 77.5250,
    heading: 180,
    speedKmph: 0,
    kycStatus: 'APPROVED',
    todaysEarnings: 2850,
    totalTrips: 512,
    acceptanceRate: 92,
    documents: [
      { id: 'doc_8', type: 'AADHAAR', title: 'Aadhaar Card', docNumber: 'XXXX-XXXX-1903', status: 'APPROVED' },
      { id: 'doc_9', type: 'DRIVING_LICENSE', title: 'Heavy Transport License', docNumber: 'KA012015007712', status: 'APPROVED' }
    ],
    bankAccount: {
      accountHolder: 'Manpreet Singh',
      accountNumber: '••••••••9012',
      ifsc: 'PUNB0123400',
      bankName: 'Punjab National Bank',
      isVerified: true
    }
  },
  {
    id: 'drv_rajesh',
    userId: 'user_rajesh',
    name: 'Rajesh Naik',
    phone: '+91 97410 88990',
    photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    rating: 4.95,
    ratingCount: 310,
    isOnline: true,
    isOnTrip: false,
    status: 'ACTIVE',
    vehicleId: 'veh_two_wheeler',
    vehicleNumber: 'KA 05 EF 1234',
    vehicleModel: 'Hero Splendor Plus with Cargo Mount',
    currentLat: 12.9120,
    currentLng: 77.6440,
    heading: 0,
    speedKmph: 0,
    kycStatus: 'APPROVED',
    todaysEarnings: 640,
    totalTrips: 640,
    acceptanceRate: 99,
    documents: [
      { id: 'doc_10', type: 'AADHAAR', title: 'Aadhaar Card', docNumber: 'XXXX-XXXX-7721', status: 'APPROVED' }
    ],
    bankAccount: {
      accountHolder: 'Rajesh Naik',
      accountNumber: '••••••••6631',
      ifsc: 'BARB0HSRLAY',
      bankName: 'Bank of Baroda',
      isVerified: true
    }
  },
  {
    id: 'drv_arvind',
    userId: 'user_arvind',
    name: 'Arvind Gowda',
    phone: '+91 99001 22334',
    photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    rating: 4.6,
    ratingCount: 18,
    isOnline: false,
    isOnTrip: false,
    status: 'PENDING_APPROVAL',
    vehicleId: 'veh_pickup_8ft',
    vehicleNumber: 'KA 51 Z 7721',
    vehicleModel: 'Mahindra Bolero Maxi Truck Plus',
    currentLat: 12.8900,
    currentLng: 77.6000,
    heading: 0,
    speedKmph: 0,
    kycStatus: 'UNDER_REVIEW',
    todaysEarnings: 0,
    totalTrips: 18,
    acceptanceRate: 88,
    documents: [
      { id: 'doc_11', type: 'AADHAAR', title: 'Aadhaar Card', docNumber: 'XXXX-XXXX-3341', status: 'APPROVED' },
      { id: 'doc_12', type: 'DRIVING_LICENSE', title: 'Commercial Driving License', docNumber: 'KA512022009912', status: 'UNDER_REVIEW', submittedAt: '2026-10-06' },
      { id: 'doc_13', type: 'RC', title: 'RC Book Copy', docNumber: 'KA51Z7721', status: 'UNDER_REVIEW', submittedAt: '2026-10-06' }
    ],
    bankAccount: {
      accountHolder: 'Arvind Gowda',
      accountNumber: '••••••••4481',
      ifsc: 'CNRB0001092',
      bankName: 'Canara Bank',
      isVerified: false
    }
  }
];

export const INITIAL_COUPONS: Coupon[] = [
  {
    code: 'LODZANEW50',
    title: '50% Off First Delivery',
    description: 'Get 50% discount up to ₹100 on your first booking with LODZA',
    discountType: 'PERCENTAGE',
    discountValue: 50,
    minOrderValue: 150,
    maxDiscount: 100,
    newCustomerOnly: true,
    timesUsed: 142,
    expiresAt: '2026-12-31',
    isActive: true
  },
  {
    code: 'BULK15',
    title: 'Flat 15% Off Big Trucks',
    description: 'Save 15% up to ₹350 on Tata Ace and 14ft container trips',
    discountType: 'PERCENTAGE',
    discountValue: 15,
    minOrderValue: 400,
    maxDiscount: 350,
    validVehicles: ['veh_mini_truck', 'veh_pickup_8ft', 'veh_truck_14ft'],
    timesUsed: 89,
    expiresAt: '2026-11-30',
    isActive: true
  },
  {
    code: 'FLAT100',
    title: 'Flat ₹100 Off',
    description: 'Instant ₹100 off on all commercial logistics bookings above ₹600',
    discountType: 'FLAT',
    discountValue: 100,
    minOrderValue: 600,
    timesUsed: 210,
    expiresAt: '2026-12-31',
    isActive: true
  }
];

// Pre-seeded Initial Orders
export const INITIAL_ORDERS: Order[] = [
  {
    id: 'LDZ-2026-004821',
    customerId: 'cust_rahul',
    customerName: 'Rahul Sharma',
    customerPhone: '+91 98765 43210',
    driverId: 'drv_ramesh',
    driverDetails: {
      name: 'Ramesh Kumar',
      phone: '+91 98190 44211',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      vehicleNumber: 'KA 03 AB 4492',
      vehicleModel: 'Tata Ace Gold Petrol (White)',
      rating: 4.88
    },
    vehicleId: 'veh_mini_truck',
    vehicleName: 'Tata Ace (Mini Truck)',
    pickup: {
      address: 'Prestige Palms, 12th Main, HAL 2nd Stage, Indiranagar, Bengaluru, 560038',
      landmark: 'Near Toit Pub',
      lat: 12.9784,
      lng: 77.6408,
      contactName: 'Rahul Sharma',
      contactPhone: '+91 98765 43210'
    },
    stops: [],
    drop: {
      address: 'ITPL Main Road, Pattandur Agrahara, Whitefield, Bengaluru, 560066',
      landmark: 'Opposite Park Square Mall Gate 3',
      lat: 12.9868,
      lng: 77.7380,
      contactName: 'Sunil Kumar (Storekeeper)',
      contactPhone: '+91 98221 00412'
    },
    goods: {
      category: 'Furniture & Home Decor',
      description: '6 boxed office chairs and 2 flat-pack wooden tables',
      approxWeightKg: 280,
      packageCount: 8,
      handlingInstructions: 'Fragile finish. Do not stack heavy items on top boxes.',
      hasAgreedProhibitedPolicy: true
    },
    fareBreakdown: {
      vehicleId: 'veh_mini_truck',
      baseFare: 280,
      distanceKm: 14.8,
      distanceCharge: 307,
      estimatedDurationMin: 42,
      timeCharge: 105,
      stopCount: 0,
      additionalStopCharge: 0,
      freeWaitingMin: 30,
      chargeableWaitingMin: 0,
      waitingCharge: 0,
      extraDistanceKm: 0,
      extraDistanceCharge: 0,
      tollCharge: 0,
      parkingCharge: 0,
      subtotal: 692,
      couponCode: 'LODZANEW50',
      discountAmount: 100,
      taxPercent: 5,
      taxAmount: 30,
      finalFare: 622,
      platformCommissionPercent: 15,
      platformCommissionAmount: 104,
      driverNetEarnings: 588
    },
    payment: {
      paymentId: 'PAY-ONLINE-9921',
      method: 'UPI',
      status: 'CAPTURED',
      amount: 622,
      paidAt: '2026-10-07T11:45:00.000Z',
      transactionRef: 'lodza@icici/upi_99281'
    },
    status: 'IN_TRANSIT',
    verification: {
      otp: '4821',
      isOtpVerified: false
    },
    currentDriverLat: 12.9815,
    currentDriverLng: 77.6750,
    estimatedPickupEtaMin: 18,
    events: [
      {
        id: 'evt_1',
        orderId: 'LDZ-2026-004821',
        status: 'BOOKING_CONFIRMED',
        timestamp: '2026-10-07T11:45:10.000Z',
        actor: 'Rahul Sharma',
        actorRole: 'CUSTOMER',
        description: 'Booking confirmed and prepaid via UPI.'
      },
      {
        id: 'evt_2',
        orderId: 'LDZ-2026-004821',
        status: 'DRIVER_ASSIGNED',
        timestamp: '2026-10-07T11:46:02.000Z',
        actor: 'Ramesh Kumar',
        actorRole: 'DRIVER',
        description: 'Partner Ramesh Kumar accepted the trip.'
      },
      {
        id: 'evt_3',
        orderId: 'LDZ-2026-004821',
        status: 'DRIVER_ARRIVED_PICKUP',
        timestamp: '2026-10-07T11:58:30.000Z',
        actor: 'Ramesh Kumar',
        actorRole: 'DRIVER',
        description: 'Partner reached Indiranagar pickup point.'
      },
      {
        id: 'evt_4',
        orderId: 'LDZ-2026-004821',
        status: 'TRIP_STARTED',
        timestamp: '2026-10-07T12:12:15.000Z',
        actor: 'Ramesh Kumar',
        actorRole: 'DRIVER',
        description: '8 packages loaded securely. Shipment en route to Whitefield.'
      },
      {
        id: 'evt_5',
        orderId: 'LDZ-2026-004821',
        status: 'IN_TRANSIT',
        timestamp: '2026-10-07T12:14:00.000Z',
        actor: 'System',
        actorRole: 'ADMIN',
        description: 'Live GPS beacon active. Speed 28 km/h.'
      }
    ],
    createdAt: '2026-10-07T11:45:00.000Z',
    updatedAt: '2026-10-07T12:14:00.000Z'
  },
  {
    id: 'LDZ-2026-002194',
    customerId: 'cust_rahul',
    customerName: 'Rahul Sharma',
    customerPhone: '+91 98765 43210',
    driverId: 'drv_suresh',
    driverDetails: {
      name: 'Suresh Yadav',
      phone: '+91 98860 77112',
      photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      vehicleNumber: 'KA 04 MM 8812',
      vehicleModel: 'Piaggio Ape Xtra LDX',
      rating: 4.92
    },
    vehicleId: 'veh_three_wheeler',
    vehicleName: '3-Wheeler Auto',
    pickup: {
      address: 'Shop 8, Commercial Street, Shivaji Nagar, Bengaluru, 560001',
      lat: 12.9822,
      lng: 77.6083,
      contactName: 'Ravi',
      contactPhone: '+91 98450 99887'
    },
    stops: [],
    drop: {
      address: '100 Feet Road, Indiranagar, Bengaluru, 560038',
      lat: 12.9784,
      lng: 77.6408,
      contactName: 'Rahul Sharma',
      contactPhone: '+91 98765 43210'
    },
    goods: {
      category: 'Textiles & Apparel',
      description: '4 cartons of apparel fabric rolls',
      approxWeightKg: 140,
      packageCount: 4,
      hasAgreedProhibitedPolicy: true
    },
    fareBreakdown: {
      vehicleId: 'veh_three_wheeler',
      baseFare: 180,
      distanceKm: 5.6,
      distanceCharge: 65,
      estimatedDurationMin: 22,
      timeCharge: 44,
      stopCount: 0,
      additionalStopCharge: 0,
      freeWaitingMin: 20,
      chargeableWaitingMin: 0,
      waitingCharge: 0,
      extraDistanceKm: 0,
      extraDistanceCharge: 0,
      tollCharge: 0,
      parkingCharge: 0,
      subtotal: 289,
      discountAmount: 0,
      taxPercent: 5,
      taxAmount: 14,
      finalFare: 303,
      platformCommissionPercent: 15,
      platformCommissionAmount: 43,
      driverNetEarnings: 260
    },
    payment: {
      paymentId: 'PAY-CASH-1029',
      method: 'CASH',
      status: 'CASH_COLLECTED',
      amount: 303,
      paidAt: '2026-10-06T17:30:00.000Z',
      cashCollectedByDriver: true,
      cashConfirmedAt: '2026-10-06T17:30:10.000Z'
    },
    status: 'COMPLETED',
    verification: {
      otp: '7729',
      isOtpVerified: true,
      receiverName: 'Rahul Sharma',
      verifiedAt: '2026-10-06T17:28:40.000Z'
    },
    events: [
      {
        id: 'evt_c1',
        orderId: 'LDZ-2026-002194',
        status: 'BOOKING_CONFIRMED',
        timestamp: '2026-10-06T16:30:00.000Z',
        actor: 'Rahul Sharma',
        actorRole: 'CUSTOMER',
        description: 'Booking confirmed.'
      },
      {
        id: 'evt_c2',
        orderId: 'LDZ-2026-002194',
        status: 'COMPLETED',
        timestamp: '2026-10-06T17:30:00.000Z',
        actor: 'Suresh Yadav',
        actorRole: 'DRIVER',
        description: 'Shipment delivered with OTP verification. Cash ₹303 collected.'
      }
    ],
    createdAt: '2026-10-06T16:30:00.000Z',
    updatedAt: '2026-10-06T17:30:00.000Z',
    hasCustomerRated: true
  }
];

export const INITIAL_TICKETS: SupportTicket[] = [
  {
    id: 'TKT-1049',
    orderId: 'LDZ-2026-004821',
    customerId: 'cust_rahul',
    customerName: 'Rahul Sharma',
    customerPhone: '+91 98765 43210',
    category: 'Wrong fare / extra charged',
    subject: 'Query regarding waiting time allowance for multi-box furniture loading',
    status: 'IN_PROGRESS',
    priority: 'MEDIUM',
    createdAt: '2026-10-07T12:05:00.000Z',
    updatedAt: '2026-10-07T12:08:00.000Z',
    assignedAgent: 'Vikram (LODZA Operations)',
    messages: [
      {
        id: 'msg_1',
        senderId: 'cust_rahul',
        senderName: 'Rahul Sharma',
        senderRole: 'CUSTOMER',
        text: 'Hi team, is the first 30 minutes free for Tata Ace loading? The driver arrived on time and was very helpful.',
        timestamp: '2026-10-07T12:05:00.000Z'
      },
      {
        id: 'msg_2',
        senderId: 'agent_vikram',
        senderName: 'Vikram (Support)',
        senderRole: 'SUPPORT_AGENT',
        text: 'Hello Rahul! Yes, for Tata Ace vehicles, 30 minutes of free loading/unloading time is standard. Charges only apply if wait exceeds 30 minutes at ₹4/min.',
        timestamp: '2026-10-07T12:08:00.000Z'
      }
    ]
  }
];

export const INITIAL_CLAIMS: DamageClaim[] = [
  {
    id: 'CLM-8812',
    orderId: 'LDZ-2026-002194',
    customerId: 'cust_priya',
    customerName: 'Priya Verma',
    claimType: 'DAMAGE',
    description: 'Minor moisture exposure on 1 carton corner during light drizzle.',
    estimatedValue: 1200,
    photoUrls: ['https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=300&auto=format&fit=crop&q=80'],
    status: 'UNDER_REVIEW',
    reportedAt: '2026-10-06T18:00:00.000Z',
    adminNotes: 'Requested warehouse inspection report. Goods were packed in single-ply carton without poly wrap.'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'aud_1',
    actor: 'System Admin',
    role: 'SUPER_ADMIN',
    action: 'PRICING_UPDATED',
    entity: 'PricingRule',
    entityId: 'veh_mini_truck',
    oldValue: 'perKmRate: 22',
    newValue: 'perKmRate: 24',
    timestamp: '2026-10-05T09:00:00.000Z'
  },
  {
    id: 'aud_2',
    actor: 'Ops Lead Neha',
    role: 'OPERATIONS_MANAGER',
    action: 'DRIVER_KYC_APPROVED',
    entity: 'DriverProfile',
    entityId: 'drv_ramesh',
    oldValue: 'UNDER_REVIEW',
    newValue: 'APPROVED',
    timestamp: '2026-10-06T10:30:00.000Z'
  }
];

// Reusable State Holder
export interface AppState {
  currentRole: 'CUSTOMER' | 'DRIVER' | 'ADMIN';
  currentUser: User;
  isCustomerLoggedIn: boolean;
  activeDriverId: string;
  vehicles: VehicleConfig[];
  drivers: DriverProfile[];
  customers: CustomerProfile[];
  orders: Order[];
  activeOrderId: string | null;
  incomingOffer: DriverOffer | null;
  coupons: Coupon[];
  tickets: SupportTicket[];
  claims: DamageClaim[];
  auditLogs: AuditLog[];
  simulationActive: boolean;
}

const STORAGE_KEY = 'lodza_platform_state_v1';

class LodzaStore {
  private state: AppState;
  private listeners: Set<() => void> = new Set();
  private simulationTimer: NodeJS.Timeout | null = null;

  constructor() {
    this.state = this.loadState();

    // Wire up OrderDispatchEngine listeners for cascading driver dispatching
    dispatchEngine.setListeners({
      onDispatchUpdate: (ds) => {
        this.state.incomingOffer = ds.currentOffer;
        if (ds.currentOffer) {
          this.state.activeDriverId = ds.currentOffer.driverId;
        }
        this.saveState();
      },
      onOfferGenerated: (offer) => {
        this.state.incomingOffer = offer;
        // Also set activeDriverId so if user switches to driver view or mobile simulator, that driver is active
        this.state.activeDriverId = offer.driverId;
        this.saveState();
      },
      onOfferAccepted: (orderId, driver) => {
        this.assignDriverToOrder(orderId, driver);
      }
    });
  }

  private loadState(): AppState {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          return {
            ...parsed,
            // By user request, start with customer logged out to test full landing page -> estimate -> login flow
            isCustomerLoggedIn: false,
            activeDriverId: parsed.activeDriverId || 'drv_ramesh',
            // Ensure functions/fallbacks exist
            vehicles: parsed.vehicles || INITIAL_VEHICLES,
            drivers: parsed.drivers || INITIAL_DRIVERS,
            customers: parsed.customers || INITIAL_CUSTOMERS,
            orders: parsed.orders || INITIAL_ORDERS,
            coupons: parsed.coupons || INITIAL_COUPONS,
            tickets: parsed.tickets || INITIAL_TICKETS,
            claims: parsed.claims || INITIAL_CLAIMS,
            auditLogs: parsed.auditLogs || INITIAL_AUDIT_LOGS
          };
        }
      } catch (err) {
        console.warn('Could not load saved state, falling back to defaults', err);
      }
    }

    return {
      currentRole: 'CUSTOMER',
      currentUser: {
        id: 'cust_rahul',
        name: 'Rahul Sharma',
        phone: '+91 98765 43210',
        email: 'rahul.sharma@gmail.com',
        role: 'CUSTOMER',
        createdAt: '2026-01-15'
      },
      isCustomerLoggedIn: false,
      activeDriverId: 'drv_ramesh',
      vehicles: INITIAL_VEHICLES,
      drivers: INITIAL_DRIVERS,
      customers: INITIAL_CUSTOMERS,
      orders: INITIAL_ORDERS,
      activeOrderId: 'LDZ-2026-004821',
      incomingOffer: null,
      coupons: INITIAL_COUPONS,
      tickets: INITIAL_TICKETS,
      claims: INITIAL_CLAIMS,
      auditLogs: INITIAL_AUDIT_LOGS,
      simulationActive: false
    };
  }

  private saveState() {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      } catch (err) {
        console.warn('State save failed', err);
      }
    }
    this.notify();
  }

  public subscribe(fn: () => void): () => void {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  private notify() {
    this.listeners.forEach((fn) => fn());
  }

  public getState(): AppState {
    return this.state;
  }

  public loginCustomer(user: User, profile?: CustomerProfile) {
    this.state.isCustomerLoggedIn = true;
    this.state.currentUser = user;
    if (profile) {
      const idx = this.state.customers.findIndex((c) => c.userId === profile.userId);
      if (idx !== -1) {
        this.state.customers[idx] = profile;
      } else {
        this.state.customers.push(profile);
      }
    }
    this.addAuditLog({
      actor: user.name,
      role: 'CUSTOMER',
      action: 'CUSTOMER_AUTHENTICATED',
      entity: 'CustomerProfile',
      entityId: user.id,
      metadata: { phone: user.phone }
    });
    this.saveState();
  }

  public logoutCustomer() {
    this.state.isCustomerLoggedIn = false;
    this.addAuditLog({
      actor: this.state.currentUser.name || 'Customer',
      role: 'CUSTOMER',
      action: 'CUSTOMER_LOGGED_OUT',
      entity: 'CustomerProfile',
      entityId: this.state.currentUser.id
    });
    this.saveState();
  }

  public setRole(role: 'CUSTOMER' | 'DRIVER' | 'ADMIN') {
    this.state.currentRole = role;
    if (role === 'CUSTOMER') {
      // keep customer login state
    } else if (role === 'DRIVER') {
      const activeDriver = this.state.drivers[0];
      this.state.currentUser = {
        id: activeDriver.id,
        name: activeDriver.name,
        phone: activeDriver.phone,
        role: 'DRIVER',
        createdAt: '2026-01-10'
      };
    } else if (role === 'ADMIN') {
      this.state.currentUser = {
        id: 'admin_control',
        name: 'Operations Command',
        phone: '+91 80 4000 5000',
        email: 'ops@lodza.in',
        role: 'SUPER_ADMIN',
        createdAt: '2025-10-01'
      };
    }
    this.saveState();
  }

  public setActiveOrder(orderId: string | null) {
    this.state.activeOrderId = orderId;
    this.saveState();
  }

  public resetToSeed() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
    this.state = {
      currentRole: 'CUSTOMER',
      currentUser: {
        id: 'cust_rahul',
        name: 'Rahul Sharma',
        phone: '+91 98765 43210',
        email: 'rahul.sharma@gmail.com',
        role: 'CUSTOMER',
        createdAt: '2026-01-15'
      },
      isCustomerLoggedIn: false,
      activeDriverId: 'drv_ramesh',
      vehicles: INITIAL_VEHICLES,
      drivers: INITIAL_DRIVERS,
      customers: INITIAL_CUSTOMERS,
      orders: INITIAL_ORDERS,
      activeOrderId: 'LDZ-2026-004821',
      incomingOffer: null,
      coupons: INITIAL_COUPONS,
      tickets: INITIAL_TICKETS,
      claims: INITIAL_CLAIMS,
      auditLogs: INITIAL_AUDIT_LOGS,
      simulationActive: false
    };
    this.saveState();
  }

  // --- ORDER LIFECYCLE ---

  public createOrder(params: {
    pickup: Order['pickup'];
    stops: Order['stops'];
    drop: Order['drop'];
    goods: Order['goods'];
    vehicleId: string;
    appliedCoupon?: Coupon | null;
    paymentMethod: Order['payment']['method'];
  }): Order {
    const vehicle = this.state.vehicles.find((v) => v.id === params.vehicleId) || this.state.vehicles[2];
    
    // Estimate distance based on approximate coordinates (or default ~12.5 km)
    const distanceKm = 12.8 + params.stops.length * 3.5;
    const durationMin = Math.round(distanceKm * 2.8);

    const breakdown = FareCalculationService.calculateFare({
      vehicle,
      distanceKm,
      durationMin,
      stopsCount: params.stops.length,
      appliedCoupon: params.appliedCoupon
    });

    const newOrderId = generateBookingId();
    const otp = generateOtp();

    const payment: PaymentDetails = {
      paymentId: `PAY-${Date.now()}`,
      method: params.paymentMethod,
      status: params.paymentMethod === 'CASH' ? 'CASH_PENDING' : 'CAPTURED',
      amount: breakdown.finalFare,
      paidAt: params.paymentMethod === 'CASH' ? undefined : new Date().toISOString(),
      transactionRef: params.paymentMethod === 'CASH' ? undefined : `UPI/REF/${Date.now().toString().slice(-6)}`
    };

    const newOrder: Order = {
      id: newOrderId,
      customerId: this.state.currentUser.id,
      customerName: this.state.currentUser.name,
      customerPhone: this.state.currentUser.phone,
      vehicleId: vehicle.id,
      vehicleName: vehicle.name,
      pickup: params.pickup,
      stops: params.stops,
      drop: params.drop,
      goods: params.goods,
      fareBreakdown: breakdown,
      payment,
      status: 'SEARCHING_DRIVER',
      verification: {
        otp,
        isOtpVerified: false
      },
      events: [
        {
          id: `evt_${Date.now()}`,
          orderId: newOrderId,
          status: 'BOOKING_CONFIRMED',
          timestamp: new Date().toISOString(),
          actor: this.state.currentUser.name,
          actorRole: 'CUSTOMER',
          description: `Booking created and broadcasted for ${vehicle.name}.`
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      estimatedPickupEtaMin: vehicle.etaMinutes
    };

    this.state.orders.unshift(newOrder);
    this.state.activeOrderId = newOrderId;

    // Log to Audit Log
    this.addAuditLog({
      actor: this.state.currentUser.name,
      role: 'CUSTOMER',
      action: 'BOOKING_CREATED',
      entity: 'Order',
      entityId: newOrderId,
      metadata: { vehicle: vehicle.name, total: breakdown.finalFare }
    });

    // Auto-trigger matching offer to an eligible online driver
    this.triggerMatching(newOrder);

    this.saveState();
    return newOrder;
  }

  public setActiveDriver(driverId: string) {
    const driver = this.state.drivers.find((d) => d.id === driverId);
    if (driver) {
      this.state.activeDriverId = driver.id;
      this.saveState();
    }
  }

  public triggerMatching(order: Order) {
    // Launch multi-factor ranking and cascading waterfall dispatch engine
    dispatchEngine.startDispatch(order, this.state.drivers);
  }

  public assignDriverToOrder(orderId: string, driverOrId: DriverProfile | string) {
    const orderIndex = this.state.orders.findIndex((o) => o.id === orderId);
    if (orderIndex === -1) return;

    const driver = typeof driverOrId === 'string'
      ? this.state.drivers.find((d) => d.id === driverOrId) || this.state.drivers[0]
      : driverOrId;

    const order = this.state.orders[orderIndex];
    order.driverId = driver.id;
    order.driverDetails = {
      name: driver.name,
      phone: driver.phone,
      photo: driver.photo,
      vehicleNumber: driver.vehicleNumber,
      vehicleModel: driver.vehicleModel,
      rating: driver.rating
    };
    order.status = 'DRIVER_ASSIGNED';
    order.currentDriverLat = driver.currentLat;
    order.currentDriverLng = driver.currentLng;
    order.updatedAt = new Date().toISOString();

    order.events.push({
      id: `evt_${Date.now()}`,
      orderId: order.id,
      status: 'DRIVER_ASSIGNED',
      timestamp: new Date().toISOString(),
      actor: driver.name,
      actorRole: 'DRIVER',
      description: `Partner ${driver.name} (${driver.vehicleModel}, ${driver.vehicleNumber}) accepted the trip and is assigned.`
    });

    // Mark driver on trip
    const dObj = this.state.drivers.find((d) => d.id === driver.id);
    if (dObj) {
      dObj.isOnTrip = true;
    }

    this.state.incomingOffer = null;
    this.state.activeDriverId = driver.id;

    this.addAuditLog({
      actor: driver.name,
      role: 'DRIVER',
      action: 'OFFER_ACCEPTED',
      entity: 'Order',
      entityId: order.id
    });

    this.saveState();
  }

  public driverAcceptOffer(offerId: string) {
    if (!this.state.incomingOffer || this.state.incomingOffer.id !== offerId) return;
    const offer = this.state.incomingOffer;
    const success = dispatchEngine.acceptOffer(offer.orderId, offerId);
    if (!success) {
      // Fallback direct assignment if dispatch engine state expired
      const driver = this.state.drivers.find((d) => d.id === offer.driverId) || this.state.drivers[0];
      this.assignDriverToOrder(offer.orderId, driver);
    }
  }

  public driverRejectOffer(offerId: string) {
    if (!this.state.incomingOffer || this.state.incomingOffer.id !== offerId) return;
    const offer = this.state.incomingOffer;
    dispatchEngine.declineOffer(offer.orderId, offerId);
  }

  public forceAssignBackupFleet(orderId: string) {
    const backupDriver = dispatchEngine.forceAssignBackupFleet(orderId, this.state.drivers);
    if (backupDriver) {
      this.assignDriverToOrder(orderId, backupDriver);
    }
  }

  public updateOrderStatus(orderId: string, targetStatus: OrderStatus, actor?: string, role?: 'CUSTOMER' | 'DRIVER' | 'ADMIN') {
    const order = this.state.orders.find((o) => o.id === orderId);
    if (!order) return;

    const currentStatus = order.status;
    if (!canTransitionStatus(currentStatus, targetStatus)) {
      console.warn(`Disallowed transition from ${currentStatus} to ${targetStatus}`);
      // Allow admin override if necessary
      if (role !== 'ADMIN') return;
    }

    const effectiveActor = actor || this.state.currentUser.name;
    const effectiveRole = role || this.state.currentUser.role;

    order.status = targetStatus;
    order.updatedAt = new Date().toISOString();

    const description = describeStatusTransition(targetStatus, effectiveActor, effectiveRole);

    order.events.push({
      id: `evt_${Date.now()}`,
      orderId: order.id,
      status: targetStatus,
      timestamp: new Date().toISOString(),
      actor: effectiveActor,
      actorRole: effectiveRole,
      description
    });

    // Handle completed trip earnings & driver trip release
    if (targetStatus === 'COMPLETED') {
      if (order.driverId) {
        const driver = this.state.drivers.find((d) => d.id === order.driverId);
        if (driver) {
          driver.isOnTrip = false;
          driver.todaysEarnings += order.fareBreakdown.driverNetEarnings;
          driver.totalTrips += 1;
        }
      }
    }

    if (targetStatus.startsWith('CANCELLED')) {
      if (order.driverId) {
        const driver = this.state.drivers.find((d) => d.id === order.driverId);
        if (driver) {
          driver.isOnTrip = false;
        }
      }
    }

    this.addAuditLog({
      actor: effectiveActor,
      role: effectiveRole,
      action: 'STATUS_TRANSITION',
      entity: 'Order',
      entityId: order.id,
      oldValue: currentStatus,
      newValue: targetStatus
    });

    this.saveState();
  }

  public verifyDeliveryOtp(orderId: string, inputOtp: string, receiverName?: string): { success: boolean; message: string } {
    const order = this.state.orders.find((o) => o.id === orderId);
    if (!order) return { success: false, message: 'Order not found' };

    if (order.verification.otp !== inputOtp.trim()) {
      return { success: false, message: 'Invalid 4-digit OTP. Please verify with customer.' };
    }

    order.verification.isOtpVerified = true;
    order.verification.receiverName = receiverName || order.drop.contactName;
    order.verification.verifiedAt = new Date().toISOString();

    // If payment method is cash, move to PAYMENT_PENDING_CASH, otherwise COMPLETED
    if (order.payment.method === 'CASH' && order.payment.status !== 'CASH_COLLECTED') {
      this.updateOrderStatus(orderId, 'PAYMENT_PENDING_CASH', 'Delivery Verifier', 'DRIVER');
    } else {
      this.updateOrderStatus(orderId, 'COMPLETED', 'Delivery Verifier', 'DRIVER');
    }

    return { success: true, message: 'OTP verified successfully! Delivery recorded.' };
  }

  public confirmCashCollected(orderId: string) {
    const order = this.state.orders.find((o) => o.id === orderId);
    if (!order) return;

    order.payment.status = 'CASH_COLLECTED';
    order.payment.cashCollectedByDriver = true;
    order.payment.cashConfirmedAt = new Date().toISOString();

    if (order.status === 'PAYMENT_PENDING_CASH') {
      this.updateOrderStatus(orderId, 'COMPLETED', order.driverDetails?.name || 'Driver', 'DRIVER');
    }

    this.saveState();
  }

  public cancelOrder(orderId: string, reason: string, cancelledByRole: 'CUSTOMER' | 'DRIVER' | 'ADMIN') {
    const order = this.state.orders.find((o) => o.id === orderId);
    if (!order) return;

    let targetStatus: OrderStatus = 'CANCELLED_BY_CUSTOMER';
    if (cancelledByRole === 'DRIVER') targetStatus = 'CANCELLED_BY_DRIVER';
    if (cancelledByRole === 'ADMIN') targetStatus = 'CANCELLED_BY_ADMIN';

    order.cancellationReason = reason;
    order.cancelledBy = this.state.currentUser.name;

    this.updateOrderStatus(orderId, targetStatus, this.state.currentUser.name, cancelledByRole);
  }

  public rateOrder(orderId: string, stars: number, tags: string[], feedback?: string) {
    const order = this.state.orders.find((o) => o.id === orderId);
    if (!order) return;

    order.hasCustomerRated = true;

    // Update driver rating
    if (order.driverId) {
      const driver = this.state.drivers.find((d) => d.id === order.driverId);
      if (driver) {
        const totalScore = driver.rating * driver.ratingCount + stars;
        driver.ratingCount += 1;
        driver.rating = Math.round((totalScore / driver.ratingCount) * 100) / 100;
      }
    }

    this.addAuditLog({
      actor: this.state.currentUser.name,
      role: 'CUSTOMER',
      action: 'ORDER_RATED',
      entity: 'Order',
      entityId: orderId,
      metadata: { stars, tags, feedback }
    });

    this.saveState();
  }

  public createSupportTicket(ticket: Omit<SupportTicket, 'id' | 'createdAt' | 'updatedAt' | 'messages' | 'status'> & { initialMessage: string }) {
    const newId = `TKT-${Math.floor(1000 + Math.random() * 9000)}`;
    const newTicket: SupportTicket = {
      id: newId,
      orderId: ticket.orderId,
      customerId: ticket.customerId,
      customerName: ticket.customerName,
      customerPhone: ticket.customerPhone,
      category: ticket.category,
      subject: ticket.subject,
      status: 'OPEN',
      priority: ticket.priority,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [
        {
          id: `msg_${Date.now()}`,
          senderId: ticket.customerId,
          senderName: ticket.customerName,
          senderRole: 'CUSTOMER',
          text: ticket.initialMessage,
          timestamp: new Date().toISOString()
        }
      ]
    };

    this.state.tickets.unshift(newTicket);
    this.saveState();
    return newTicket;
  }

  public addTicketMessage(ticketId: string, text: string, senderName: string, senderRole: 'CUSTOMER' | 'DRIVER' | 'SUPPORT_AGENT' | 'ADMIN') {
    const ticket = this.state.tickets.find((t) => t.id === ticketId);
    if (!ticket) return;

    ticket.messages.push({
      id: `msg_${Date.now()}`,
      senderId: this.state.currentUser.id,
      senderName,
      senderRole,
      text,
      timestamp: new Date().toISOString()
    });
    ticket.updatedAt = new Date().toISOString();
    this.saveState();
  }

  public createDamageClaim(claim: Omit<DamageClaim, 'id' | 'reportedAt' | 'status'>) {
    const newId = `CLM-${Math.floor(1000 + Math.random() * 9000)}`;
    const newClaim: DamageClaim = {
      ...claim,
      id: newId,
      status: 'REPORTED',
      reportedAt: new Date().toISOString()
    };
    this.state.claims.unshift(newClaim);
    this.saveState();
    return newClaim;
  }

  public updateClaimStatus(claimId: string, status: DamageClaim['status'], notes?: string, compensation?: number) {
    const claim = this.state.claims.find((c) => c.id === claimId);
    if (!claim) return;

    claim.status = status;
    if (notes) claim.adminNotes = notes;
    if (compensation !== undefined) claim.compensationAmount = compensation;
    this.saveState();
  }

  public toggleDriverOnline(driverId: string) {
    const driver = this.state.drivers.find((d) => d.id === driverId);
    if (!driver) return;
    driver.isOnline = !driver.isOnline;
    this.saveState();
  }

  public updateDriverKyc(driverId: string, docId: string, status: 'APPROVED' | 'REJECTED', reason?: string) {
    const driver = this.state.drivers.find((d) => d.id === driverId);
    if (!driver) return;

    const doc = driver.documents.find((dc) => dc.id === docId);
    if (doc) {
      doc.status = status;
      if (reason) doc.rejectionReason = reason;
    }

    // If all documents are approved, mark KYC as approved
    const allApproved = driver.documents.every((dc) => dc.status === 'APPROVED');
    driver.kycStatus = allApproved ? 'APPROVED' : 'UNDER_REVIEW';

    this.addAuditLog({
      actor: this.state.currentUser.name,
      role: 'ADMIN',
      action: 'KYC_DOCUMENT_REVIEW',
      entity: 'DriverDocument',
      entityId: docId,
      newValue: status,
      metadata: { driverId, reason }
    });

    this.saveState();
  }

  public updateVehiclePricing(vehicleId: string, updates: Partial<VehicleConfig>) {
    const veh = this.state.vehicles.find((v) => v.id === vehicleId);
    if (!veh) return;

    Object.assign(veh, updates);

    this.addAuditLog({
      actor: this.state.currentUser.name,
      role: 'SUPER_ADMIN',
      action: 'VEHICLE_PRICING_UPDATED',
      entity: 'VehicleConfig',
      entityId: vehicleId,
      metadata: updates
    });

    this.saveState();
  }

  public registerNewDriver(driverData: {
    name: string;
    phone: string;
    city: string;
    vehicleId: string;
    vehicleNumber: string;
    vehicleModel: string;
    documents: DriverDocument[];
    bankAccount: BankAccount;
    autoApprove?: boolean;
  }): DriverProfile {
    const newId = `drv_${Date.now()}`;
    const newDriver: DriverProfile = {
      id: newId,
      userId: `user_${newId}`,
      name: driverData.name,
      phone: driverData.phone,
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      rating: 5.0,
      ratingCount: 0,
      isOnline: driverData.autoApprove ?? true,
      isOnTrip: false,
      status: driverData.autoApprove ? 'ACTIVE' : 'PENDING_APPROVAL',
      vehicleId: driverData.vehicleId,
      vehicleNumber: driverData.vehicleNumber,
      vehicleModel: driverData.vehicleModel,
      currentLat: 19.0760,
      currentLng: 72.8777,
      heading: 0,
      speedKmph: 0,
      kycStatus: driverData.autoApprove ? 'APPROVED' : 'UNDER_REVIEW',
      documents: driverData.documents,
      bankAccount: driverData.bankAccount,
      todaysEarnings: 0,
      totalTrips: 0,
      acceptanceRate: 100
    };

    this.state.drivers.unshift(newDriver);
    this.addAuditLog({
      actor: newDriver.name,
      role: 'DRIVER',
      action: 'DRIVER_REGISTERED',
      entity: 'DriverProfile',
      entityId: newDriver.id,
      metadata: { phone: newDriver.phone, vehicleNumber: newDriver.vehicleNumber }
    });
    this.saveState();
    return newDriver;
  }

  public addCoupon(coupon: Coupon) {
    this.state.coupons.unshift(coupon);
    this.saveState();
  }

  public addAuditLog(entry: Omit<AuditLog, 'id' | 'timestamp'>) {
    this.state.auditLogs.unshift({
      ...entry,
      id: `aud_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString()
    });
  }

  public generateInvoiceForOrder(order: Order): Invoice {
    return {
      invoiceNumber: generateInvoiceId(),
      bookingId: order.id,
      invoiceDate: new Date(order.createdAt).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }),
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      customerGst: '29ABCDE1234F1Z5',
      driverName: order.driverDetails?.name || 'Verified Partner',
      vehicleNumber: order.driverDetails?.vehicleNumber || 'KA 03 AB 4492',
      vehicleType: order.vehicleName,
      pickupAddress: order.pickup.address,
      dropAddress: order.drop.address,
      sacCode: '996511', // Goods transport agency road services
      fareBreakdown: order.fareBreakdown,
      paymentMethod: order.payment.method,
      paymentStatus: order.payment.status,
      gstin: '29AABCL9921D1ZO',
      lodzaAddress: 'LODZA Logistics Tech Pvt Ltd, Level 4, Outer Ring Road, Kadubeesanahalli, Bengaluru, Karnataka 560103'
    };
  }
}

export const store = new LodzaStore();
