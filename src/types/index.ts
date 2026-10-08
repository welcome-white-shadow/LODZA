export type UserRole =
  | 'CUSTOMER'
  | 'DRIVER'
  | 'ADMIN'
  | 'SUPPORT_AGENT'
  | 'OPERATIONS_MANAGER'
  | 'FINANCE_MANAGER'
  | 'SUPER_ADMIN'
  | 'BUSINESS_ADMIN'
  | 'BUSINESS_USER';

export type DocumentStatus =
  | 'PENDING'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'REJECTED'
  | 'EXPIRED';

export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
  isSuspended?: boolean;
}

export interface SavedAddress {
  id: string;
  label: 'Home' | 'Work' | 'Warehouse' | 'Shop' | 'Other';
  address: string;
  landmark?: string;
  lat: number;
  lng: number;
  contactName: string;
  contactPhone: string;
}

export interface CustomerProfile {
  userId: string;
  name: string;
  phone: string;
  email?: string;
  gstNumber?: string;
  companyName?: string;
  savedAddresses: SavedAddress[];
  walletBalance: number;
  isEnterprise: boolean;
  totalOrders: number;
}

export interface DriverDocument {
  id: string;
  type: 'AADHAAR' | 'DRIVING_LICENSE' | 'RC' | 'INSURANCE' | 'PUC' | 'FITNESS' | 'VEHICLE_PHOTO';
  title: string;
  docNumber: string;
  status: DocumentStatus;
  expiryDate?: string;
  submittedAt?: string;
  rejectionReason?: string;
  fileUrl?: string;
}

export interface BankAccount {
  accountHolder: string;
  accountNumber: string;
  ifsc: string;
  bankName: string;
  isVerified: boolean;
}

export interface DriverProfile {
  id: string;
  userId: string;
  name: string;
  phone: string;
  photo: string;
  rating: number;
  ratingCount: number;
  isOnline: boolean;
  isOnTrip: boolean;
  status: 'ACTIVE' | 'OFFLINE' | 'SUSPENDED' | 'PENDING_APPROVAL';
  vehicleId: string;
  vehicleNumber: string;
  vehicleModel: string;
  currentLat: number;
  currentLng: number;
  heading: number;
  speedKmph: number;
  kycStatus: DocumentStatus;
  documents: DriverDocument[];
  bankAccount: BankAccount;
  todaysEarnings: number;
  totalTrips: number;
  acceptanceRate: number; // e.g. 94%
}

export interface VehicleConfig {
  id: string;
  name: string;
  category: 'two_wheeler' | 'three_wheeler' | 'mini_truck' | 'pickup_8ft' | 'truck_14ft';
  subtitle: string;
  capacityKg: number;
  dimensions: string; // e.g. "5.5ft x 4.5ft x 5ft"
  baseFare: number;
  baseDistanceKm: number;
  perKmRate: number;
  perMinRate: number;
  minFare: number;
  stopCharge: number;
  waitingRatePerMin: number;
  freeWaitingMin: number;
  isAvailable: boolean;
  etaMinutes: number;
  iconName: string;
}

export type OrderStatus =
  | 'DRAFT'
  | 'ESTIMATE_CREATED'
  | 'PAYMENT_PENDING'
  | 'BOOKING_CONFIRMED'
  | 'SEARCHING_DRIVER'
  | 'DRIVER_ASSIGNED'
  | 'DRIVER_EN_ROUTE_PICKUP'
  | 'DRIVER_ARRIVED_PICKUP'
  | 'LOADING'
  | 'TRIP_STARTED'
  | 'IN_TRANSIT'
  | 'DRIVER_ARRIVED_DROP'
  | 'UNLOADING'
  | 'DELIVERY_VERIFICATION'
  | 'COMPLETED'
  | 'PAYMENT_PENDING_CASH'
  | 'CANCELLED_BY_CUSTOMER'
  | 'CANCELLED_BY_DRIVER'
  | 'CANCELLED_BY_ADMIN'
  | 'NO_DRIVER_AVAILABLE'
  | 'REASSIGNMENT_REQUIRED'
  | 'DISPUTED'
  | 'FAILED';

export interface LocationPoint {
  address: string;
  landmark?: string;
  lat: number;
  lng: number;
  contactName: string;
  contactPhone: string;
  notes?: string;
}

export interface OrderStop extends LocationPoint {
  stopId: string;
  sequence: number;
  status: 'PENDING' | 'ARRIVED' | 'COMPLETED' | 'SKIPPED' | 'FAILED';
  arrivalTime?: string;
  departureTime?: string;
}

export type GoodsCategory =
  | 'Electronics & Appliances'
  | 'Furniture & Home Decor'
  | 'FMCG & Groceries'
  | 'Construction & Hardware'
  | 'Textiles & Apparel'
  | 'Documents & Parcels'
  | 'Machinery & Equipment'
  | 'Other Goods';

export interface GoodsDetails {
  category: GoodsCategory;
  description: string;
  approxWeightKg: number;
  packageCount: number;
  handlingInstructions?: string;
  hasAgreedProhibitedPolicy: boolean;
}

export interface FareBreakdown {
  vehicleId: string;
  baseFare: number;
  distanceKm: number;
  distanceCharge: number;
  estimatedDurationMin: number;
  timeCharge: number;
  stopCount: number;
  additionalStopCharge: number;
  freeWaitingMin: number;
  chargeableWaitingMin: number;
  waitingCharge: number;
  extraDistanceKm: number;
  extraDistanceCharge: number;
  tollCharge: number;
  parkingCharge: number;
  subtotal: number;
  couponCode?: string;
  discountAmount: number;
  taxPercent: number; // e.g. 5%
  taxAmount: number;
  finalFare: number;
  platformCommissionPercent: number; // e.g. 15%
  platformCommissionAmount: number;
  driverNetEarnings: number;
}

export type PaymentMethod = 'UPI' | 'CARD' | 'NET_BANKING' | 'CASH';

export type PaymentStatus =
  | 'PENDING'
  | 'AUTHORIZED'
  | 'CAPTURED'
  | 'FAILED'
  | 'REFUNDED'
  | 'PARTIALLY_REFUNDED'
  | 'CASH_PENDING'
  | 'CASH_COLLECTED';

export interface PaymentDetails {
  paymentId: string;
  method: PaymentMethod;
  status: PaymentStatus;
  amount: number;
  paidAt?: string;
  transactionRef?: string;
  cashCollectedByDriver?: boolean;
  cashConfirmedAt?: string;
}

export interface DeliveryVerification {
  otp: string; // 4-digit code provided to customer, verified by driver at drop
  isOtpVerified: boolean;
  receiverName?: string;
  podPhotoUrl?: string;
  receiverSignatureUrl?: string;
  verifiedAt?: string;
}

export interface OrderEvent {
  id: string;
  orderId: string;
  status: OrderStatus;
  timestamp: string;
  actor: string;
  actorRole: UserRole;
  description: string;
  metadata?: Record<string, unknown>;
}

export interface Order {
  id: string; // e.g. LDZ-2026-000421
  customerId: string;
  customerName: string;
  customerPhone: string;
  driverId?: string;
  driverDetails?: {
    name: string;
    phone: string;
    photo: string;
    vehicleNumber: string;
    vehicleModel: string;
    rating: number;
  };
  vehicleId: string;
  vehicleName: string;
  pickup: LocationPoint;
  stops: OrderStop[];
  drop: LocationPoint;
  goods: GoodsDetails;
  fareBreakdown: FareBreakdown;
  payment: PaymentDetails;
  status: OrderStatus;
  verification: DeliveryVerification;
  events: OrderEvent[];
  createdAt: string;
  updatedAt: string;
  estimatedPickupEtaMin?: number;
  currentDriverLat?: number;
  currentDriverLng?: number;
  cancellationReason?: string;
  cancelledBy?: string;
  waitingStartTime?: string;
  waitingActiveMinutes?: number;
  hasCustomerRated?: boolean;
}

export interface DriverOffer {
  id: string;
  orderId: string;
  driverId: string;
  order: Order;
  pickupDistanceKm: number;
  estimatedEarning: number;
  expiresAt: number; // timestamp ms
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'TIMEOUT';
  attemptNumber?: number;
  totalCandidates?: number;
  driverName?: string;
  driverVehicle?: string;
  matchScore?: number;
}

export interface Invoice {
  invoiceNumber: string; // LDZ-INV-2026-XXXX
  bookingId: string;
  invoiceDate: string;
  customerName: string;
  customerPhone: string;
  customerGst?: string;
  driverName: string;
  vehicleNumber: string;
  vehicleType: string;
  pickupAddress: string;
  dropAddress: string;
  sacCode: string; // 9965 (Goods transport services)
  fareBreakdown: FareBreakdown;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  gstin: string; // 29AAACL1234F1Z8
  lodzaAddress: string;
}

export interface Rating {
  id: string;
  orderId: string;
  fromUserId: string;
  toUserId: string;
  fromRole: 'CUSTOMER' | 'DRIVER';
  stars: number;
  tags: string[];
  feedback?: string;
  createdAt: string;
}

export type TicketCategory =
  | 'Driver didn\'t arrive'
  | 'Driver cancelled after acceptance'
  | 'Incorrect fare / extra charged'
  | 'Wrong fare / extra charged'
  | 'Payment or refund issue'
  | 'Goods damaged during transit'
  | 'Items missing from shipment'
  | 'Rude driver behavior'
  | 'App or booking glitch'
  | 'Other';

export interface SupportMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  text: string;
  timestamp: string;
}

export interface SupportTicket {
  id: string;
  orderId: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  category: TicketCategory;
  subject: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'WAITING_FOR_CUSTOMER' | 'WAITING_FOR_DRIVER' | 'RESOLVED' | 'CLOSED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  messages: SupportMessage[];
  createdAt: string;
  updatedAt: string;
  assignedAgent?: string;
}

export interface DamageClaim {
  id: string;
  orderId: string;
  customerId: string;
  customerName: string;
  driverId?: string;
  driverName?: string;
  claimType: 'DAMAGE' | 'LOSS' | 'THEFT' | 'DELAY';
  description: string;
  estimatedValue: number;
  photoUrls: string[];
  status: 'REPORTED' | 'UNDER_REVIEW' | 'WAITING_FOR_INFORMATION' | 'APPROVED' | 'REJECTED' | 'PARTIALLY_APPROVED' | 'CLOSED';
  reportedAt: string;
  adminNotes?: string;
  compensationAmount?: number;
}

export interface Coupon {
  code: string;
  title: string;
  description: string;
  discountType: 'PERCENTAGE' | 'FLAT';
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number;
  validVehicles?: string[];
  newCustomerOnly?: boolean;
  usageLimit?: number;
  timesUsed: number;
  expiresAt: string;
  isActive: boolean;
}

export interface PricingRule {
  vehicleId: string;
  baseFare: number;
  baseDistanceKm: number;
  perKmRate: number;
  perMinRate: number;
  minFare: number;
  stopCharge: number;
  waitingRatePerMin: number;
  freeWaitingMin: number;
  tollRule: 'INCLUDED' | 'SEPARATE_AT_ACTUALS';
  cancellationFee: number;
  commissionPercent: number;
  taxPercent: number;
}

export interface PricingVersion {
  versionId: string;
  updatedAt: string;
  updatedBy: string;
  rules: Record<string, PricingRule>;
  notes: string;
}

export interface AuditLog {
  id: string;
  actor: string;
  role: UserRole;
  action: string;
  entity: string;
  entityId: string;
  oldValue?: string;
  newValue?: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export interface BusinessAccount {
  id: string;
  companyName: string;
  gstin: string;
  pan: string;
  billingAddress: string;
  creditLimit: number;
  usedCredit: number;
  contractTier: 'STARTER' | 'GROWTH' | 'ENTERPRISE';
  admins: string[];
  authorizedPhones: string[];
  createdAt: string;
}
