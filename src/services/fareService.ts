import { FareBreakdown, VehicleConfig, Coupon } from '../types';

export interface FareCalculationInput {
  vehicle: VehicleConfig;
  distanceKm: number;
  durationMin: number;
  stopsCount?: number;
  waitingMinutes?: number;
  extraDistanceKm?: number;
  tollCharge?: number;
  parkingCharge?: number;
  appliedCoupon?: Coupon | null;
  taxPercent?: number; // Defaults to 5% GST on transport
  platformCommissionPercent?: number; // Defaults to 15%
}

export class FareCalculationService {
  /**
   * Calculates detailed fare breakdown with full itemization.
   * Never combines or hardcodes charges.
   */
  public static calculateFare(input: FareCalculationInput): FareBreakdown {
    const {
      vehicle,
      distanceKm,
      durationMin,
      stopsCount = 0,
      waitingMinutes = 0,
      extraDistanceKm = 0,
      tollCharge = 0,
      parkingCharge = 0,
      appliedCoupon = null,
      taxPercent = 5,
      platformCommissionPercent = 15
    } = input;

    // 1. Base fare includes initial baseDistanceKm
    const baseFare = vehicle.baseFare;

    // 2. Distance charge beyond baseDistanceKm
    const chargeableKm = Math.max(0, distanceKm - vehicle.baseDistanceKm);
    const distanceCharge = Math.round(chargeableKm * vehicle.perKmRate);

    // 3. Time charge
    const timeCharge = Math.round(durationMin * vehicle.perMinRate);

    // 4. Additional stops charge (Stops beyond standard single drop)
    const additionalStops = Math.max(0, stopsCount);
    const additionalStopCharge = additionalStops * vehicle.stopCharge;

    // 5. Waiting charge
    const freeWaitingMin = vehicle.freeWaitingMin || 15;
    const chargeableWaitingMin = Math.max(0, waitingMinutes - freeWaitingMin);
    const waitingCharge = chargeableWaitingMin * vehicle.waitingRatePerMin;

    // 6. Extra distance charge (e.g. route detour requested)
    const extraDistanceCharge = Math.round(extraDistanceKm * vehicle.perKmRate);

    // 7. Subtotal before discounts
    let subtotal =
      baseFare +
      distanceCharge +
      timeCharge +
      additionalStopCharge +
      waitingCharge +
      extraDistanceCharge +
      tollCharge +
      parkingCharge;

    // Ensure minimum fare rule
    if (subtotal < vehicle.minFare) {
      subtotal = vehicle.minFare;
    }

    // 8. Coupon discount
    let discountAmount = 0;
    if (appliedCoupon && appliedCoupon.isActive) {
      // Validate min order value
      if (subtotal >= appliedCoupon.minOrderValue) {
        if (appliedCoupon.discountType === 'PERCENTAGE') {
          const calculated = Math.round((subtotal * appliedCoupon.discountValue) / 100);
          discountAmount = appliedCoupon.maxDiscount
            ? Math.min(calculated, appliedCoupon.maxDiscount)
            : calculated;
        } else {
          discountAmount = appliedCoupon.discountValue;
        }
      }
    }

    // Discount cannot exceed subtotal
    discountAmount = Math.min(discountAmount, subtotal);

    // 9. Taxes (GST 5% on road logistics / goods transport agency in India)
    const taxableAmount = Math.max(0, subtotal - discountAmount);
    const taxAmount = Math.round((taxableAmount * taxPercent) / 100);

    // 10. Final consumer fare
    const finalFare = taxableAmount + taxAmount;

    // 11. Platform commission (e.g. 15% on freight subtotal) & Driver net earnings
    const platformCommissionAmount = Math.round((subtotal * platformCommissionPercent) / 100);
    // Driver gets freight subtotal minus platform commission + any waiting/toll reimbursements
    const driverNetEarnings = Math.max(
      0,
      subtotal - platformCommissionAmount + tollCharge + parkingCharge
    );

    return {
      vehicleId: vehicle.id,
      baseFare,
      distanceKm: Math.round(distanceKm * 10) / 10,
      distanceCharge,
      estimatedDurationMin: Math.round(durationMin),
      timeCharge,
      stopCount: stopsCount,
      additionalStopCharge,
      freeWaitingMin,
      chargeableWaitingMin,
      waitingCharge,
      extraDistanceKm: Math.round(extraDistanceKm * 10) / 10,
      extraDistanceCharge,
      tollCharge,
      parkingCharge,
      subtotal,
      couponCode: appliedCoupon?.code,
      discountAmount,
      taxPercent,
      taxAmount,
      finalFare,
      platformCommissionPercent,
      platformCommissionAmount,
      driverNetEarnings
    };
  }
}
