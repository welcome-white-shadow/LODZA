import React, { useState } from 'react';
import {
  VehicleConfig,
  Coupon,
  GoodsCategory,
  LocationPoint,
  OrderStop,
  PaymentMethod
} from '../../types';
import { FareCalculationService } from '../../services/fareService';
import { LocationService } from '../../services/locationService';
import {
  MapPin,
  Plus,
  Trash2,
  Package,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  Truck,
  Bike,
  CheckCircle2,
  Tag,
  CreditCard,
  IndianRupee,
  Clock,
  Weight
} from 'lucide-react';
import { sound } from '../../services/soundService';

interface BookingFlowProps {
  vehicles: VehicleConfig[];
  coupons: Coupon[];
  initialPickupAddress?: string;
  initialDropAddress?: string;
  initialVehicleId?: string;
  onCompleteBooking: (bookingData: {
    pickup: LocationPoint;
    stops: OrderStop[];
    drop: LocationPoint;
    goods: {
      category: GoodsCategory;
      description: string;
      approxWeightKg: number;
      packageCount: number;
      handlingInstructions: string;
      hasAgreedProhibitedPolicy: boolean;
    };
    vehicleId: string;
    appliedCoupon: Coupon | null;
    paymentMethod: PaymentMethod;
  }) => void;
  onCancel: () => void;
}

export const BookingFlow: React.FC<BookingFlowProps> = ({
  vehicles,
  coupons,
  initialPickupAddress,
  initialDropAddress,
  initialVehicleId,
  onCompleteBooking,
  onCancel
}) => {
  const [currentStep, setCurrentStep] = useState(1);

  // Step 1: Pickup
  const [pickupAddress, setPickupAddress] = useState(
    initialPickupAddress || '12th Main, HAL 2nd Stage, Indiranagar, Bengaluru, 560038'
  );
  const [pickupLandmark, setPickupLandmark] = useState('Near Toit Pub / 100ft Road');
  const [pickupContactName, setPickupContactName] = useState('Rahul Sharma');
  const [pickupContactPhone, setPickupContactPhone] = useState('+91 98765 43210');

  // Step 2: Drop
  const [dropAddress, setDropAddress] = useState(
    initialDropAddress || 'Pattandur Agrahara, ITPL Main Rd, Whitefield, Bengaluru, 560066'
  );
  const [dropLandmark, setDropLandmark] = useState('Opposite Park Square Mall Gate 3');
  const [dropContactName, setDropContactName] = useState('Sunil Kumar (Store)');
  const [dropContactPhone, setDropContactPhone] = useState('+91 98221 00412');

  // Step 3: Additional Stops
  const [stops, setStops] = useState<OrderStop[]>([]);
  const [newStopAddress, setNewStopAddress] = useState('');
  const [newStopContact, setNewStopContact] = useState('');
  const [newStopPhone, setNewStopPhone] = useState('');
  const [showAddStopForm, setShowAddStopForm] = useState(false);

  // Step 4: Goods Information
  const [goodsCategory, setGoodsCategory] = useState<GoodsCategory>('Furniture & Home Decor');
  const [goodsDescription, setGoodsDescription] = useState('Office revolving chairs and desktop desks in flat packing');
  const [approxWeightKg, setApproxWeightKg] = useState(250);
  const [packageCount, setPackageCount] = useState(6);
  const [handlingInstructions, setHandlingInstructions] = useState('Fragile laminate. Keep upright.');
  const [hasAgreedProhibited, setHasAgreedProhibited] = useState(true);
  const [showProhibitedModal, setShowProhibitedModal] = useState(false);

  // Step 5: Vehicle selection
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(
    initialVehicleId || vehicles[2]?.id || 'veh_mini_truck'
  );

  // Step 6: Coupon & Fare
  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(coupons[0] || null);
  const [couponError, setCouponError] = useState('');

  // Step 7: Payment
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');

  // Calculated estimates using dynamic LocationService
  const selectedVehicle = vehicles.find((v) => v.id === selectedVehicleId) || vehicles[0];
  const dynamicRoute = LocationService.calculateRoute(pickupAddress, dropAddress);
  const simulatedDistanceKm = Math.round((dynamicRoute.distanceKm + stops.length * 3.8) * 10) / 10;
  const simulatedDurationMin = Math.round(simulatedDistanceKm * 2.8);

  const fareBreakdown = FareCalculationService.calculateFare({
    vehicle: selectedVehicle,
    distanceKm: simulatedDistanceKm,
    durationMin: simulatedDurationMin,
    stopsCount: stops.length,
    appliedCoupon
  });

  const handleAddStop = () => {
    if (!newStopAddress.trim()) return;
    const newStop: OrderStop = {
      stopId: `stop_${Date.now()}`,
      sequence: stops.length + 1,
      address: newStopAddress.trim(),
      contactName: newStopContact.trim() || 'Stop Contact',
      contactPhone: newStopPhone.trim() || '+91 99000 00000',
      lat: 12.9600 + Math.random() * 0.02,
      lng: 77.6600 + Math.random() * 0.02,
      status: 'PENDING'
    };
    setStops([...stops, newStop]);
    setNewStopAddress('');
    setNewStopContact('');
    setNewStopPhone('');
    setShowAddStopForm(false);
    sound.playClick();
  };

  const handleRemoveStop = (stopId: string) => {
    setStops(stops.filter((s) => s.stopId !== stopId));
    sound.playClick();
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    const code = couponCodeInput.trim().toUpperCase();
    const found = coupons.find((c) => c.code.toUpperCase() === code && c.isActive);

    if (!found) {
      setCouponError('Invalid or expired coupon code.');
      return;
    }

    if (fareBreakdown.subtotal < found.minOrderValue) {
      setCouponError(`Minimum booking amount for this coupon is ₹${found.minOrderValue}.`);
      return;
    }

    setAppliedCoupon(found);
    setCouponCodeInput('');
    sound.playSuccess();
  };

  const handleConfirm = () => {
    sound.playSuccess();
    const pickupGeo = LocationService.geocodeAddress(pickupAddress);
    const dropGeo = LocationService.geocodeAddress(dropAddress);
    onCompleteBooking({
      pickup: {
        address: pickupAddress,
        landmark: pickupLandmark,
        lat: pickupGeo.lat,
        lng: pickupGeo.lng,
        contactName: pickupContactName,
        contactPhone: pickupContactPhone
      },
      stops,
      drop: {
        address: dropAddress,
        landmark: dropLandmark,
        lat: dropGeo.lat,
        lng: dropGeo.lng,
        contactName: dropContactName,
        contactPhone: dropContactPhone
      },
      goods: {
        category: goodsCategory,
        description: goodsDescription,
        approxWeightKg,
        packageCount,
        handlingInstructions,
        hasAgreedProhibitedPolicy: hasAgreedProhibited
      },
      vehicleId: selectedVehicleId,
      appliedCoupon,
      paymentMethod
    });
  };

  const stepTitles = [
    'Pickup Details',
    'Drop Location',
    'Multiple Stops',
    'Goods Info',
    'Choose Vehicle',
    'Fare Estimate',
    'Payment Option',
    'Review & Book'
  ];

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-slate-200 overflow-hidden my-1 sm:my-4">
      {/* Progress Header */}
      <div className="bg-[#0B1F3A] text-white p-4 sm:p-5">
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 sm:w-7 sm:h-7 bg-[#155EEF] rounded-full flex items-center justify-center font-bold text-xs">
              {currentStep}
            </span>
            <h2 className="text-sm sm:text-base font-bold tracking-tight">
              {stepTitles[currentStep - 1]}
            </h2>
          </div>
          <span className="text-xs text-slate-300 font-mono font-semibold">
            Step {currentStep}/8
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-[#155EEF] h-full transition-all duration-300 rounded-full"
            style={{ width: `${(currentStep / 8) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Step Body */}
      <div className="p-4 sm:p-7 md:p-8 space-y-5 sm:space-y-6 min-h-[360px]">
        {/* STEP 1: PICKUP */}
        {currentStep === 1 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm sm:text-base">
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
              <span>Where should our partner pick up the goods?</span>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
                Pickup Address <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={2}
                value={pickupAddress}
                onChange={(e) => setPickupAddress(e.target.value)}
                placeholder="Building name, street, locality, pincode"
                className="w-full text-sm sm:text-base p-3 sm:p-3.5 rounded-xl border border-slate-300 font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#155EEF] focus:border-transparent min-h-[58px]"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
                Landmark
              </label>
              <input
                type="text"
                value={pickupLandmark}
                onChange={(e) => setPickupLandmark(e.target.value)}
                placeholder="Near metro pillar, opposite bakery, gate number..."
                className="w-full text-sm sm:text-base p-3 sm:p-3.5 rounded-xl border border-slate-300 font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#155EEF] focus:border-transparent min-h-[46px]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
                  Contact Person Name
                </label>
                <input
                  type="text"
                  value={pickupContactName}
                  onChange={(e) => setPickupContactName(e.target.value)}
                  className="w-full text-sm sm:text-base p-3 sm:p-3.5 rounded-xl border border-slate-300 font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#155EEF] focus:border-transparent min-h-[46px]"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
                  Contact Phone Number
                </label>
                <input
                  type="tel"
                  value={pickupContactPhone}
                  onChange={(e) => setPickupContactPhone(e.target.value)}
                  className="w-full text-sm sm:text-base p-3 sm:p-3.5 rounded-xl border border-slate-300 font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#155EEF] focus:border-transparent min-h-[46px]"
                />
              </div>
            </div>

            {/* Quick preset saved address pills */}
            <div className="pt-2">
              <span className="text-xs text-slate-500 block mb-2 font-semibold">Quick Saved Addresses:</span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setPickupAddress('Flat 402, Prestige Palms, 12th Main, HAL 2nd Stage, Indiranagar, Bengaluru, 560038');
                    setPickupLandmark('Opposite Toit Pub');
                  }}
                  className="text-xs sm:text-sm bg-slate-100 hover:bg-blue-50 text-slate-800 hover:text-[#155EEF] px-3.5 py-2 rounded-xl border border-slate-200 font-medium transition-colors"
                >
                  📍 Home (Indiranagar)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPickupAddress('Shed 14, Peenya Industrial Area 2nd Stage, Bengaluru, 560058');
                    setPickupLandmark('Near Peenya Metro Gate 2');
                  }}
                  className="text-xs sm:text-sm bg-slate-100 hover:bg-blue-50 text-slate-800 hover:text-[#155EEF] px-3.5 py-2 rounded-xl border border-slate-200 font-medium transition-colors"
                >
                  🏭 Peenya Warehouse
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: DROP LOCATION */}
        {currentStep === 2 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center gap-2 text-red-600 font-bold text-sm sm:text-base">
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
              <span>Where should the shipment be delivered?</span>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
                Drop Address <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={2}
                value={dropAddress}
                onChange={(e) => setDropAddress(e.target.value)}
                placeholder="Destination premises, unit number, street, pincode"
                className="w-full text-sm sm:text-base p-3 sm:p-3.5 rounded-xl border border-slate-300 font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#155EEF] focus:border-transparent min-h-[58px]"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
                Landmark
              </label>
              <input
                type="text"
                value={dropLandmark}
                onChange={(e) => setDropLandmark(e.target.value)}
                placeholder="Opposite shopping mall, near highway toll..."
                className="w-full text-sm sm:text-base p-3 sm:p-3.5 rounded-xl border border-slate-300 font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#155EEF] focus:border-transparent min-h-[46px]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
                  Receiver Contact Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={dropContactName}
                  onChange={(e) => setDropContactName(e.target.value)}
                  className="w-full text-sm sm:text-base p-3 sm:p-3.5 rounded-xl border border-slate-300 font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#155EEF] focus:border-transparent min-h-[46px]"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
                  Receiver Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={dropContactPhone}
                  onChange={(e) => setDropContactPhone(e.target.value)}
                  className="w-full text-sm sm:text-base p-3 sm:p-3.5 rounded-xl border border-slate-300 font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#155EEF] focus:border-transparent min-h-[46px]"
                />
              </div>
            </div>

            <p className="text-xs text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-slate-200 leading-relaxed">
              💡 Receiver will receive live SMS updates and a secure 4-digit Delivery OTP required to release the goods upon arrival.
            </p>
          </div>
        )}

        {/* STEP 3: ADDITIONAL STOPS */}
        {currentStep === 3 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">Multiple drops along route?</h3>
                <p className="text-xs sm:text-sm text-slate-500">
                  Deliver items at multiple destinations on a single trip.
                </p>
              </div>
              {!showAddStopForm && (
                <button
                  type="button"
                  onClick={() => setShowAddStopForm(true)}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-[#155EEF] text-white text-xs sm:text-sm font-semibold rounded-xl hover:bg-blue-700 shadow-sm shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Stop</span>
                </button>
              )}
            </div>

            {/* List of existing added stops */}
            {stops.length === 0 ? (
              <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-300 text-xs sm:text-sm text-slate-500">
                <MapPin className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                <p className="font-semibold text-slate-700">Direct point-to-point delivery (No extra stops)</p>
                <p className="text-xs text-slate-400 mt-1">Tap &quot;Add Stop&quot; above if you need intermediate pickups or drop-offs.</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {stops.map((st, idx) => (
                  <div
                    key={st.stopId}
                    className="flex items-center justify-between p-3.5 bg-blue-50/60 rounded-xl border border-blue-200 text-xs sm:text-sm"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 bg-[#155EEF] text-white font-bold rounded-full flex items-center justify-center text-xs shrink-0">
                        {idx + 1}
                      </span>
                      <div>
                        <p className="font-bold text-slate-900">{st.address}</p>
                        <p className="text-slate-500 text-xs">
                          Contact: {st.contactName} ({st.contactPhone})
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveStop(st.stopId)}
                      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add Stop Form */}
            {showAddStopForm && (
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 text-xs sm:text-sm">
                <h4 className="font-bold text-slate-900">Add Intermediate Stop</h4>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Stop Address</label>
                  <input
                    type="text"
                    value={newStopAddress}
                    onChange={(e) => setNewStopAddress(e.target.value)}
                    placeholder="E.g. Marathahalli Bridge, Outer Ring Road"
                    className="w-full text-sm sm:text-base p-3 rounded-xl border border-slate-300 bg-white min-h-[46px]"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Contact Name</label>
                    <input
                      type="text"
                      value={newStopContact}
                      onChange={(e) => setNewStopContact(e.target.value)}
                      placeholder="Person name"
                      className="w-full text-sm sm:text-base p-3 rounded-xl border border-slate-300 bg-white min-h-[46px]"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      value={newStopPhone}
                      onChange={(e) => setNewStopPhone(e.target.value)}
                      placeholder="+91..."
                      className="w-full text-sm sm:text-base p-3 rounded-xl border border-slate-300 bg-white min-h-[46px]"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAddStopForm(false)}
                    className="px-4 py-2.5 bg-slate-200 text-slate-700 rounded-xl font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleAddStop}
                    className="px-5 py-2.5 bg-[#155EEF] text-white rounded-xl font-bold"
                  >
                    Save Stop
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 4: GOODS INFORMATION */}
        {currentStep === 4 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
                Category of Goods <span className="text-red-500">*</span>
              </label>
              <select
                value={goodsCategory}
                onChange={(e) => setGoodsCategory(e.target.value as GoodsCategory)}
                className="w-full text-sm sm:text-base p-3 sm:p-3.5 rounded-xl border border-slate-300 bg-slate-50 font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#155EEF] min-h-[46px]"
              >
                <option value="Furniture & Home Decor">Furniture & Home Decor</option>
                <option value="Electronics & Appliances">Electronics & Appliances</option>
                <option value="FMCG & Groceries">FMCG & Groceries</option>
                <option value="Construction & Hardware">Construction & Hardware</option>
                <option value="Textiles & Apparel">Textiles & Apparel</option>
                <option value="Documents & Parcels">Documents & Parcels</option>
                <option value="Machinery & Equipment">Machinery & Equipment</option>
                <option value="Other Goods">Other Commercial Goods</option>
              </select>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
                Goods Description
              </label>
              <input
                type="text"
                value={goodsDescription}
                onChange={(e) => setGoodsDescription(e.target.value)}
                placeholder="What is being transported? (e.g. 4 carton boxes, 1 sofa)"
                className="w-full text-sm sm:text-base p-3 sm:p-3.5 rounded-xl border border-slate-300 font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#155EEF] min-h-[46px]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
                  Approximate Weight (kg)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="5000"
                    value={approxWeightKg}
                    onChange={(e) => setApproxWeightKg(Number(e.target.value))}
                    className="w-full text-sm sm:text-base p-3 sm:p-3.5 rounded-xl border border-slate-300 font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#155EEF] min-h-[46px]"
                  />
                  <Weight className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
                </div>
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
                  Number of Packages / Units
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="1000"
                    value={packageCount}
                    onChange={(e) => setPackageCount(Number(e.target.value))}
                    className="w-full text-sm sm:text-base p-3 sm:p-3.5 rounded-xl border border-slate-300 font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#155EEF] min-h-[46px]"
                  />
                  <Package className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
                Special Handling Instructions (Optional)
              </label>
              <input
                type="text"
                value={handlingInstructions}
                onChange={(e) => setHandlingInstructions(e.target.value)}
                placeholder="Keep upright, fragile glass, rain cover needed..."
                className="w-full text-sm sm:text-base p-3 sm:p-3.5 rounded-xl border border-slate-300 font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#155EEF] min-h-[46px]"
              />
            </div>

            {/* Prohibited items warning checkbox */}
            <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 flex items-start gap-3">
              <input
                type="checkbox"
                id="prohibited"
                checked={hasAgreedProhibited}
                onChange={(e) => setHasAgreedProhibited(e.target.checked)}
                className="w-4 h-4 mt-1 rounded text-[#155EEF] focus:ring-[#155EEF] shrink-0"
              />
              <label htmlFor="prohibited" className="text-xs sm:text-sm text-amber-900 leading-relaxed">
                I declare that this shipment does not contain any{' '}
                <button
                  type="button"
                  onClick={() => setShowProhibitedModal(true)}
                  className="font-bold underline text-amber-950"
                >
                  prohibited or restricted goods
                </button>{' '}
                (explosives, flammable chemicals, contraband, unmanifested cash).
              </label>
            </div>
          </div>
        )}

        {/* STEP 5: VEHICLE SELECTION */}
        {currentStep === 5 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">Select the right vehicle for your cargo</h3>
              <p className="text-xs sm:text-sm text-slate-500">
                Choose based on payload weight, cargo volume, and transit requirements.
              </p>
            </div>

            <div className="space-y-3">
              {vehicles.map((v) => {
                const isSelected = v.id === selectedVehicleId;
                const quickEstimate = FareCalculationService.calculateFare({
                  vehicle: v,
                  distanceKm: simulatedDistanceKm,
                  durationMin: simulatedDurationMin,
                  stopsCount: stops.length,
                  appliedCoupon
                });

                return (
                  <div
                    key={v.id}
                    onClick={() => {
                      sound.playClick();
                      setSelectedVehicleId(v.id);
                    }}
                    className={`p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      isSelected
                        ? 'border-[#155EEF] bg-blue-50/70 shadow-md ring-2 ring-blue-500/20'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                          isSelected
                            ? 'bg-[#155EEF] text-white shadow-sm'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {v.category === 'two_wheeler' ? (
                          <Bike className="w-6 h-6" />
                        ) : (
                          <Truck className="w-6 h-6" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900 text-sm sm:text-base">{v.name}</h4>
                          <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                            {v.etaMinutes} mins away
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">{v.subtitle}</p>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 mt-1 font-medium">
                          <span>Max {v.capacityKg} kg</span>
                          <span>•</span>
                          <span>Deck: {v.dimensions}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:flex-col sm:items-end border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                      <p className="font-black text-lg text-[#0B1F3A]">
                        ₹{quickEstimate.finalFare}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Base ₹{v.baseFare} + ₹{v.perKmRate}/km
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 6: FARE ESTIMATE */}
        {currentStep === 6 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">Transparent Fare Breakdown</h3>
              <p className="text-xs sm:text-sm text-slate-500">
                Itemized estimate calculated based on {fareBreakdown.distanceKm} km trip with {selectedVehicle.name}.
              </p>
            </div>

            {/* Coupon input */}
            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={couponCodeInput}
                  onChange={(e) => setCouponCodeInput(e.target.value.toUpperCase())}
                  placeholder="Enter promo coupon (e.g. LODZANEW50)"
                  className="w-full text-sm sm:text-base p-3 uppercase font-mono rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#155EEF] min-h-[46px]"
                />
                <Tag className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
              </div>
              <button
                type="submit"
                className="px-5 py-3 bg-[#0B1F3A] hover:bg-slate-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-sm min-h-[46px]"
              >
                Apply
              </button>
            </form>

            {couponError && (
              <p className="text-xs text-red-600 font-medium">{couponError}</p>
            )}

            {appliedCoupon && (
              <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs sm:text-sm text-emerald-800">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    Coupon <strong className="font-mono">{appliedCoupon.code}</strong> applied! You saved ₹{fareBreakdown.discountAmount}.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setAppliedCoupon(null)}
                  className="text-emerald-700 hover:text-emerald-900 font-bold underline text-xs"
                >
                  Remove
                </button>
              </div>
            )}

            {/* Detailed Table */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2.5 text-xs sm:text-sm">
              <div className="flex justify-between text-slate-700">
                <span>Base Fare (incl. {selectedVehicle.baseDistanceKm} km)</span>
                <span className="font-semibold">₹{fareBreakdown.baseFare}</span>
              </div>
              <div className="flex justify-between text-slate-700">
                <span>Distance Charge ({fareBreakdown.distanceKm} km @ ₹{selectedVehicle.perKmRate}/km)</span>
                <span className="font-semibold">₹{fareBreakdown.distanceCharge}</span>
              </div>
              {fareBreakdown.timeCharge > 0 && (
                <div className="flex justify-between text-slate-700">
                  <span>Estimated Transit Time Charge ({fareBreakdown.estimatedDurationMin} mins)</span>
                  <span className="font-semibold">₹{fareBreakdown.timeCharge}</span>
                </div>
              )}
              {fareBreakdown.additionalStopCharge > 0 && (
                <div className="flex justify-between text-slate-700">
                  <span>Additional Stops ({fareBreakdown.stopCount} stops)</span>
                  <span className="font-semibold">₹{fareBreakdown.additionalStopCharge}</span>
                </div>
              )}
              {fareBreakdown.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Coupon Discount ({fareBreakdown.couponCode})</span>
                  <span>-₹{fareBreakdown.discountAmount}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600 pt-1.5 border-t border-slate-200">
                <span>GST on Freight ({fareBreakdown.taxPercent}%)</span>
                <span>₹{fareBreakdown.taxAmount}</span>
              </div>
              <div className="flex justify-between text-[#0B1F3A] font-extrabold text-base sm:text-lg pt-2 border-t border-slate-300">
                <span>Estimated Total Fare</span>
                <span className="text-[#155EEF]">₹{fareBreakdown.finalFare}</span>
              </div>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed bg-blue-50/50 p-3 rounded-xl border border-blue-100">
              📌 <strong>Notice:</strong> This is an estimated fare. Final fare may vary if route detour occurs, extra waiting exceeds free {selectedVehicle.freeWaitingMin} mins (charged at ₹{selectedVehicle.waitingRatePerMin}/min), or additional stops are added during transit.
            </p>
          </div>
        )}

        {/* STEP 7: PAYMENT METHOD */}
        {currentStep === 7 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">Choose Payment Mode</h3>
              <p className="text-xs sm:text-sm text-slate-500">
                Select your preferred digital payment or cash handover option.
              </p>
            </div>

            <div className="space-y-2.5">
              {[
                {
                  id: 'UPI',
                  title: 'UPI / QR Code',
                  subtitle: 'Google Pay, PhonePe, Paytm, BHIM UPI (Instant receipt)',
                  icon: IndianRupee
                },
                {
                  id: 'CARD',
                  title: 'Credit / Debit Card',
                  subtitle: 'Visa, MasterCard, RuPay with 3D Secure OTP',
                  icon: CreditCard
                },
                {
                  id: 'NET_BANKING',
                  title: 'Corporate Net Banking',
                  subtitle: 'HDFC, ICICI, SBI, Axis, Kotak Business Banking',
                  icon: ShieldCheck
                },
                {
                  id: 'CASH',
                  title: 'Cash on Delivery (To Driver)',
                  subtitle: 'Handover cash to driver partner upon goods delivery',
                  icon: IndianRupee
                }
              ].map((m) => {
                const isSelected = paymentMethod === m.id;
                const Icon = m.icon;
                return (
                  <div
                    key={m.id}
                    onClick={() => {
                      sound.playClick();
                      setPaymentMethod(m.id as PaymentMethod);
                    }}
                    className={`p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'border-[#155EEF] bg-blue-50/70 shadow-sm ring-1 ring-blue-500/20'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                          isSelected ? 'bg-[#155EEF] text-white' : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm sm:text-base">{m.title}</h4>
                        <p className="text-xs text-slate-500">{m.subtitle}</p>
                      </div>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'border-[#155EEF] bg-[#155EEF]'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 8: REVIEW & CONFIRM */}
        {currentStep === 8 && (
          <div className="space-y-4 animate-in fade-in duration-200 text-xs sm:text-sm">
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">Review Booking Summary</h3>
              <p className="text-xs sm:text-sm text-slate-500">
                Please verify all pickup, destination, and vehicle details before dispatching.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Route */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                  Routing Information
                </h4>
                <div className="space-y-2.5">
                  <div className="flex items-start gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mt-1 shrink-0" />
                    <div>
                      <span className="font-bold text-slate-900">Pickup: </span>
                      <span className="text-slate-600">{pickupAddress}</span>
                      <p className="text-slate-500 text-xs mt-0.5">
                        Contact: {pickupContactName} ({pickupContactPhone})
                      </p>
                    </div>
                  </div>

                  {stops.length > 0 && (
                    <div className="pl-4 text-xs text-blue-700 font-medium">
                      + {stops.length} intermediate stop(s)
                    </div>
                  )}

                  <div className="flex items-start gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 mt-1 shrink-0" />
                    <div>
                      <span className="font-bold text-slate-900">Drop: </span>
                      <span className="text-slate-600">{dropAddress}</span>
                      <p className="text-slate-500 text-xs mt-0.5">
                        Receiver: {dropContactName} ({dropContactPhone})
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cargo & Vehicle */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                  Vehicle & Shipment
                </h4>
                <div className="space-y-1.5 text-slate-700 text-xs sm:text-sm">
                  <p>
                    <strong>Vehicle:</strong> {selectedVehicle.name}
                  </p>
                  <p>
                    <strong>Cargo:</strong> {goodsCategory} ({approxWeightKg} kg, {packageCount} pkgs)
                  </p>
                  <p>
                    <strong>Description:</strong> {goodsDescription}
                  </p>
                  <p>
                    <strong>Payment Mode:</strong> {paymentMethod}
                  </p>
                  <p>
                    <strong>Final Fare:</strong>{' '}
                    <span className="font-bold text-base sm:text-lg text-[#155EEF]">
                      ₹{fareBreakdown.finalFare}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center gap-2.5 text-emerald-800 text-xs sm:text-sm">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>
                Verified Partner Guarantee: GPS tracked, commercial driver KYC verified, transit goods coverage included.
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Nav Buttons */}
      <div className="bg-slate-50 px-4 sm:px-6 py-3.5 sm:py-4 border-t border-slate-200 flex items-center justify-between gap-3">
        {currentStep > 1 ? (
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setCurrentStep(currentStep - 1);
            }}
            className="flex items-center gap-1.5 px-4 sm:px-5 py-3 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs sm:text-sm font-bold rounded-xl transition-colors min-h-[46px]"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-3 text-slate-500 hover:text-slate-800 text-xs sm:text-sm font-semibold min-h-[46px]"
          >
            Cancel
          </button>
        )}

        {currentStep < 8 ? (
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              if (currentStep === 4 && !hasAgreedProhibited) {
                alert('Please accept the prohibited goods declaration to continue.');
                return;
              }
              setCurrentStep(currentStep + 1);
            }}
            className="flex items-center justify-center gap-2 px-6 sm:px-8 py-3 bg-[#155EEF] hover:bg-blue-700 text-white font-bold text-sm sm:text-base rounded-xl shadow-md transition-colors min-h-[48px]"
          >
            <span>Continue</span>
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleConfirm}
            className="flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 bg-[#FF8A00] hover:bg-orange-600 text-slate-950 font-extrabold text-sm sm:text-base rounded-xl shadow-lg transition-transform hover:scale-105 min-h-[48px]"
          >
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>Confirm Booking (₹{fareBreakdown.finalFare})</span>
          </button>
        )}
      </div>

      {/* Prohibited Goods Policy Modal */}
      {showProhibitedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 text-xs">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-red-500" />
              <span>Prohibited & Restricted Items</span>
            </h3>
            <p className="text-slate-600">
              For public safety and transport regulations, LODZA vehicles cannot transport the following prohibited goods:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-700 font-medium">
              <li>Explosives, fireworks, ammunition &amp; hazardous arms</li>
              <li>Flammable compressed gases, loose fuels &amp; unsealed chemicals</li>
              <li>Toxic chemicals &amp; radioactive substances</li>
              <li>Loose currency cash or contraband narcotics</li>
              <li>Live animals or livestock</li>
            </ul>
            <p className="text-[11px] text-emerald-700 bg-emerald-50 p-2 rounded-lg font-medium">
              All commercial cargo, household furniture, electronics, retail stock &amp; e-commerce goods are 100% permitted and transit-insured.
            </p>
            <button
              onClick={() => setShowProhibitedModal(false)}
              className="w-full py-2.5 bg-[#155EEF] text-white font-bold rounded-xl"
            >
              I Understand
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
