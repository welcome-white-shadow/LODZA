import { OrderStatus, UserRole } from '../types';

/**
 * Strict Order State Machine for LODZA
 * Validates state transitions and logs audit events.
 */

export const ALLOWED_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  DRAFT: ['ESTIMATE_CREATED', 'CANCELLED_BY_CUSTOMER'],
  ESTIMATE_CREATED: ['PAYMENT_PENDING', 'BOOKING_CONFIRMED', 'CANCELLED_BY_CUSTOMER'],
  PAYMENT_PENDING: ['BOOKING_CONFIRMED', 'FAILED', 'CANCELLED_BY_CUSTOMER'],
  BOOKING_CONFIRMED: ['SEARCHING_DRIVER', 'DRIVER_ASSIGNED', 'CANCELLED_BY_CUSTOMER', 'CANCELLED_BY_ADMIN'],
  SEARCHING_DRIVER: ['DRIVER_ASSIGNED', 'NO_DRIVER_AVAILABLE', 'CANCELLED_BY_CUSTOMER', 'CANCELLED_BY_ADMIN'],
  NO_DRIVER_AVAILABLE: ['SEARCHING_DRIVER', 'CANCELLED_BY_CUSTOMER', 'CANCELLED_BY_ADMIN'],
  DRIVER_ASSIGNED: ['DRIVER_EN_ROUTE_PICKUP', 'REASSIGNMENT_REQUIRED', 'CANCELLED_BY_DRIVER', 'CANCELLED_BY_CUSTOMER', 'CANCELLED_BY_ADMIN'],
  REASSIGNMENT_REQUIRED: ['SEARCHING_DRIVER', 'DRIVER_ASSIGNED', 'CANCELLED_BY_ADMIN'],
  DRIVER_EN_ROUTE_PICKUP: ['DRIVER_ARRIVED_PICKUP', 'CANCELLED_BY_DRIVER', 'CANCELLED_BY_CUSTOMER', 'CANCELLED_BY_ADMIN', 'REASSIGNMENT_REQUIRED'],
  DRIVER_ARRIVED_PICKUP: ['LOADING', 'CANCELLED_BY_CUSTOMER', 'CANCELLED_BY_DRIVER', 'CANCELLED_BY_ADMIN'],
  LOADING: ['TRIP_STARTED', 'CANCELLED_BY_CUSTOMER', 'CANCELLED_BY_ADMIN'],
  TRIP_STARTED: ['IN_TRANSIT', 'DISPUTED'],
  IN_TRANSIT: ['DRIVER_ARRIVED_DROP', 'DISPUTED'],
  DRIVER_ARRIVED_DROP: ['UNLOADING', 'DELIVERY_VERIFICATION', 'DISPUTED'],
  UNLOADING: ['DELIVERY_VERIFICATION', 'DISPUTED'],
  DELIVERY_VERIFICATION: ['COMPLETED', 'PAYMENT_PENDING_CASH', 'DISPUTED'],
  PAYMENT_PENDING_CASH: ['COMPLETED', 'DISPUTED'],
  COMPLETED: ['DISPUTED'], // Post-completion disputes/claims
  CANCELLED_BY_CUSTOMER: [],
  CANCELLED_BY_DRIVER: ['REASSIGNMENT_REQUIRED', 'SEARCHING_DRIVER'],
  CANCELLED_BY_ADMIN: [],
  DISPUTED: ['COMPLETED', 'CANCELLED_BY_ADMIN'],
  FAILED: ['DRAFT', 'CANCELLED_BY_CUSTOMER']
};

export function canTransitionStatus(current: OrderStatus, target: OrderStatus): boolean {
  if (current === target) return true;
  const allowed = ALLOWED_TRANSITIONS[current] || [];
  return allowed.includes(target);
}

export function getStatusLabel(status: OrderStatus): string {
  switch (status) {
    case 'DRAFT': return 'Draft';
    case 'ESTIMATE_CREATED': return 'Estimate Created';
    case 'PAYMENT_PENDING': return 'Payment Pending';
    case 'BOOKING_CONFIRMED': return 'Booking Confirmed';
    case 'SEARCHING_DRIVER': return 'Searching Partner';
    case 'DRIVER_ASSIGNED': return 'Partner Assigned';
    case 'DRIVER_EN_ROUTE_PICKUP': return 'En Route to Pickup';
    case 'DRIVER_ARRIVED_PICKUP': return 'Arrived at Pickup';
    case 'LOADING': return 'Loading Goods';
    case 'TRIP_STARTED': return 'Trip Started';
    case 'IN_TRANSIT': return 'In Transit';
    case 'DRIVER_ARRIVED_DROP': return 'Arrived at Drop';
    case 'UNLOADING': return 'Unloading Goods';
    case 'DELIVERY_VERIFICATION': return 'Delivery Verification';
    case 'COMPLETED': return 'Completed';
    case 'PAYMENT_PENDING_CASH': return 'Cash Collection Pending';
    case 'CANCELLED_BY_CUSTOMER': return 'Cancelled by Customer';
    case 'CANCELLED_BY_DRIVER': return 'Cancelled by Partner';
    case 'CANCELLED_BY_ADMIN': return 'Cancelled by Admin';
    case 'NO_DRIVER_AVAILABLE': return 'No Partner Available';
    case 'REASSIGNMENT_REQUIRED': return 'Reassignment Required';
    case 'DISPUTED': return 'Disputed / Claim Active';
    case 'FAILED': return 'Failed';
    default: return status;
  }
}

export function getStatusStepNumber(status: OrderStatus): number {
  switch (status) {
    case 'BOOKING_CONFIRMED':
    case 'SEARCHING_DRIVER':
      return 1;
    case 'DRIVER_ASSIGNED':
    case 'DRIVER_EN_ROUTE_PICKUP':
      return 2;
    case 'DRIVER_ARRIVED_PICKUP':
    case 'LOADING':
      return 3;
    case 'TRIP_STARTED':
    case 'IN_TRANSIT':
      return 4;
    case 'DRIVER_ARRIVED_DROP':
    case 'UNLOADING':
    case 'DELIVERY_VERIFICATION':
      return 5;
    case 'COMPLETED':
      return 6;
    default:
      return 0;
  }
}

export function describeStatusTransition(
  newStatus: OrderStatus,
  actor: string,
  actorRole: UserRole
): string {
  switch (newStatus) {
    case 'BOOKING_CONFIRMED':
      return `Booking confirmed by customer (${actor}). Routing to matching engine.`;
    case 'SEARCHING_DRIVER':
      return `Broadcasting trip to nearby verified partners.`;
    case 'DRIVER_ASSIGNED':
      return `Partner ${actor} accepted the booking.`;
    case 'DRIVER_EN_ROUTE_PICKUP':
      return `Partner is heading towards pickup location.`;
    case 'DRIVER_ARRIVED_PICKUP':
      return `Partner reached pickup point. Free waiting window active.`;
    case 'LOADING':
      return `Goods loading is in progress.`;
    case 'TRIP_STARTED':
      return `Goods loaded and secured. Trip initiated towards delivery point.`;
    case 'IN_TRANSIT':
      return `Shipment is on move with live GPS tracking.`;
    case 'DRIVER_ARRIVED_DROP':
      return `Partner reached delivery destination.`;
    case 'UNLOADING':
      return `Goods unloading started at receiver location.`;
    case 'DELIVERY_VERIFICATION':
      return `Awaiting 4-digit OTP or receiver proof of delivery.`;
    case 'COMPLETED':
      return `Delivery successfully verified and completed. Digital invoice generated.`;
    case 'PAYMENT_PENDING_CASH':
      return `Trip finished. Awaiting cash handover to partner.`;
    case 'CANCELLED_BY_CUSTOMER':
      return `Cancelled by customer (${actor}).`;
    case 'CANCELLED_BY_DRIVER':
      return `Cancelled by partner (${actor}). Reassigning request.`;
    case 'CANCELLED_BY_ADMIN':
      return `Trip cancelled by LODZA Operations (${actor}).`;
    case 'NO_DRIVER_AVAILABLE':
      return `No nearby driver partner responded within timeout limit.`;
    case 'DISPUTED':
      return `Trip flagged for investigation / support claim.`;
    default:
      return `Status updated to ${newStatus} by ${actor} (${actorRole}).`;
  }
}
