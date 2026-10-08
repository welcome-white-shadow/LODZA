import React, { useState, useEffect } from 'react';
import { store, AppState } from './services/store';
import { Order, Invoice } from './types';
import { LodzaLogo } from './components/common/LodzaLogo';
import { RoleSwitcher } from './components/common/RoleSwitcher';
import { LandingPage } from './components/landing/LandingPage';
import { CustomerAuth } from './components/customer/CustomerAuth';
import { BookingFlow } from './components/customer/BookingFlow';
import { LiveTrackingView } from './components/customer/LiveTrackingView';
import { CustomerBookings } from './components/customer/CustomerBookings';
import { InvoiceModal } from './components/customer/InvoiceModal';
import { RatingModal } from './components/customer/RatingModal';
import { CustomerSupportModal } from './components/customer/CustomerSupportModal';
import { DriverDashboard } from './components/driver/DriverDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { DriverPartnerPortal } from './components/driver/DriverPartnerPortal';
import { AppDownloadModal } from './components/common/AppDownloadModal';
import { MobileAppSimulator } from './components/common/MobileAppSimulator';
import { GlobalDispatchBanner } from './components/common/GlobalDispatchBanner';
import { sound } from './services/soundService';
import {
  Compass,
  Package,
  PlusCircle,
  Tag,
  LifeBuoy,
  User,
  Shield,
  Truck,
  Phone,
  ArrowRight,
  LogOut,
  LogIn,
  IndianRupee,
  Clock,
  CheckCircle2,
  X,
  Smartphone,
  Download,
  Menu,
  Building2,
  Radio,
  FileText,
  UserCheck
} from 'lucide-react';

export default function App() {
  const [state, setState] = useState<AppState>(store.getState());
  const [customerTab, setCustomerTab] = useState<'LANDING' | 'BOOKINGS' | 'TRACK' | 'OFFERS' | 'DRIVER_PORTAL'>('LANDING');
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showAppDownloadModal, setShowAppDownloadModal] = useState(false);
  const [showMobileSimulator, setShowMobileSimulator] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isPwaInstalled, setIsPwaInstalled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Initial booking parameters
  const [bookingParams, setBookingParams] = useState<{
    pickup: string;
    drop: string;
    vehicleId: string;
  }>({
    pickup: 'Andheri West, Mumbai',
    drop: 'Bandra Kurla Complex (BKC), Mumbai',
    vehicleId: 'veh_mini_truck'
  });

  // Modals
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [ratingOrder, setRatingOrder] = useState<Order | null>(null);
  const [supportOrder, setSupportOrder] = useState<Order | null>(null);

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setState({ ...store.getState() });
    });

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      setIsPwaInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      unsubscribe();
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallPwa = async () => {
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        if (choice && choice.outcome === 'accepted') {
          setIsPwaInstalled(true);
        }
        setDeferredPrompt(null);
      } catch {
        setShowAppDownloadModal(true);
      }
    } else {
      setShowAppDownloadModal(true);
    }
  };

  const currentDriver =
    state.drivers.find((d) => d.id === state.activeDriverId) ||
    state.drivers.find((d) => d.id === state.incomingOffer?.driverId) ||
    state.drivers[0];

  const activeOrder =
    state.orders.find((o) => o.id === state.activeOrderId) ||
    state.orders.find((o) => o.status !== 'COMPLETED' && !o.status.startsWith('CANCELLED')) ||
    state.orders[0];

  const handleSimulateNextStep = () => {
    sound.playClick();
    if (!activeOrder) return;

    switch (activeOrder.status) {
      case 'SEARCHING_DRIVER':
        store.triggerMatching(activeOrder);
        break;
      case 'DRIVER_ASSIGNED':
        store.updateOrderStatus(activeOrder.id, 'DRIVER_ARRIVED_PICKUP', 'Ramesh Kumar', 'DRIVER');
        break;
      case 'DRIVER_ARRIVED_PICKUP':
        store.updateOrderStatus(activeOrder.id, 'LOADING', 'Ramesh Kumar', 'DRIVER');
        break;
      case 'LOADING':
        store.updateOrderStatus(activeOrder.id, 'IN_TRANSIT', 'Ramesh Kumar', 'DRIVER');
        break;
      case 'IN_TRANSIT':
        store.updateOrderStatus(activeOrder.id, 'DELIVERY_VERIFICATION', 'Ramesh Kumar', 'DRIVER');
        break;
      case 'DELIVERY_VERIFICATION':
        store.verifyDeliveryOtp(activeOrder.id, activeOrder.verification.otp);
        break;
      case 'PAYMENT_PENDING_CASH':
        store.confirmCashCollected(activeOrder.id);
        break;
      case 'COMPLETED':
        alert('This order is already completed. You can view the tax invoice or rate the driver.');
        break;
      default:
        break;
    }
  };

  const handleCustomerLogout = () => {
    sound.playClick();
    store.logoutCustomer();
  };

  const handleStartBookingWithParams = (params: {
    pickupAddress: string;
    dropAddress: string;
    vehicleId: string;
    serviceCategory?: string;
  }) => {
    setBookingParams({
      pickup: params.pickupAddress,
      drop: params.dropAddress,
      vehicleId: params.vehicleId
    });
    // If not logged in, prompt login first or allow continuing
    if (!state.isCustomerLoggedIn) {
      setShowAuthModal(true);
    } else {
      setIsBookingOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#111827] flex flex-col font-sans">
      {/* 1. Global Role Switcher & Dev Simulation Bar */}
      <RoleSwitcher
        currentRole={state.currentRole}
        activeOrderId={activeOrder?.id || null}
        hasIncomingOffer={!!state.incomingOffer}
        onSimulateNextStep={handleSimulateNextStep}
      />

      {/* 2. Top Navigation Bar (Clean, Uncluttered & Responsive) */}
      <header className="bg-white sticky top-0 z-40 border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Brand Logo on Left */}
          <div
            onClick={() => {
              setCustomerTab('LANDING');
              setIsBookingOpen(false);
              setIsMobileMenuOpen(false);
            }}
            className="cursor-pointer flex items-center gap-2"
          >
            <LodzaLogo size="md" showTagline={false} />
            <span className="hidden lg:inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-600 bg-slate-100/90 px-2.5 py-1 rounded-full border border-slate-200/60">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              On-Demand Intra-City Fleet
            </span>
          </div>

          {/* Primary Desktop Navigation Links */}
          {state.currentRole === 'CUSTOMER' && (
            <nav className="hidden md:flex items-center gap-5 lg:gap-7 text-xs lg:text-sm font-semibold text-slate-700">
              <button
                onClick={() => {
                  sound.playClick();
                  setCustomerTab('LANDING');
                  setIsBookingOpen(false);
                }}
                className={`transition-colors ${
                  customerTab === 'LANDING' && !isBookingOpen
                    ? 'text-[#155EEF] font-bold'
                    : 'hover:text-[#155EEF]'
                }`}
              >
                Book Fleet
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  setCustomerTab('DRIVER_PORTAL');
                  setIsBookingOpen(false);
                }}
                className={`transition-colors flex items-center gap-1.5 ${
                  customerTab === 'DRIVER_PORTAL'
                    ? 'text-[#155EEF] font-bold'
                    : 'hover:text-[#155EEF]'
                }`}
              >
                <Truck className="w-3.5 h-3.5 text-[#FF8A00]" />
                <span>Driver Partner</span>
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  setSupportOrder(activeOrder || state.orders[0]);
                }}
                className="hover:text-[#155EEF] transition-colors"
              >
                Support
              </button>

              {state.isCustomerLoggedIn && (
                <button
                  onClick={() => {
                    sound.playClick();
                    setCustomerTab('BOOKINGS');
                    setIsBookingOpen(false);
                  }}
                  className={`transition-colors ${
                    customerTab === 'BOOKINGS'
                      ? 'text-[#155EEF] font-bold'
                      : 'hover:text-[#155EEF]'
                  }`}
                >
                  My Deliveries
                </button>
              )}
            </nav>
          )}

          {/* Right Action Bar */}
          <div className="flex items-center gap-2 sm:gap-3">
            {state.currentRole === 'CUSTOMER' && (
              <>
                {/* Active Trip Quick Jump Pill */}
                {activeOrder && activeOrder.status !== 'COMPLETED' && !activeOrder.status.startsWith('CANCELLED') && (
                  <button
                    onClick={() => {
                      sound.playClick();
                      store.setActiveOrder(activeOrder.id);
                      setCustomerTab('TRACK');
                      setIsBookingOpen(false);
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-[#155EEF] font-extrabold text-xs rounded-xl border border-blue-200 shadow-xs transition-transform hover:scale-105"
                    title="View live GPS tracking and dispatch status"
                  >
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                    </span>
                    <span>Live Track</span>
                  </button>
                )}

                {/* Unified Clean "Install / App" Button */}
                <button
                  onClick={() => {
                    sound.playClick();
                    handleInstallPwa();
                  }}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  title="Install Progressive Web App or download mobile app"
                >
                  <Download className="w-3.5 h-3.5 text-[#155EEF]" />
                  <span>{isPwaInstalled ? 'App Installed ✓' : 'Install App'}</span>
                </button>

                {/* Account / Login */}
                {state.isCustomerLoggedIn ? (
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                      <div className="w-8 h-8 rounded-full bg-[#155EEF] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                        {state.currentUser.name.charAt(0)}
                      </div>
                      <div className="hidden lg:block text-left">
                        <span className="block text-xs font-bold text-slate-900 leading-tight">
                          {state.currentUser.name}
                        </span>
                        <span className="block text-[10px] text-slate-400 font-mono">
                          {state.currentUser.phone}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={handleCustomerLogout}
                      title="Log out"
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      sound.playClick();
                      setShowAuthModal(true);
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#155EEF] hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-transform hover:scale-105 cursor-pointer"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Login</span>
                  </button>
                )}

                {/* Mobile Menu Hamburger Button */}
                <button
                  onClick={() => {
                    sound.playClick();
                    setIsMobileMenuOpen(!isMobileMenuOpen);
                  }}
                  className="md:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
                  aria-label="Toggle navigation menu"
                >
                  {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </>
            )}

            {state.currentRole !== 'CUSTOMER' && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                  {state.currentUser.name.charAt(0)}
                </div>
                <span className="text-xs font-bold text-slate-800">
                  {state.currentUser.name}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && state.currentRole === 'CUSTOMER' && (
          <div className="md:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-3 shadow-lg animate-in slide-in-from-top-3">
            <div className="grid grid-cols-2 gap-2 text-xs font-bold">
              <button
                onClick={() => {
                  sound.playClick();
                  setCustomerTab('LANDING');
                  setIsBookingOpen(false);
                  setIsMobileMenuOpen(false);
                }}
                className="p-3 bg-slate-50 hover:bg-slate-100 text-slate-800 rounded-xl text-left border border-slate-200 flex items-center gap-2"
              >
                <Package className="w-4 h-4 text-[#155EEF]" />
                <span>Book Delivery</span>
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  setCustomerTab('DRIVER_PORTAL');
                  setIsBookingOpen(false);
                  setIsMobileMenuOpen(false);
                }}
                className="p-3 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-xl text-left border border-amber-200 flex items-center gap-2"
              >
                <Truck className="w-4 h-4 text-[#FF8A00]" />
                <span>Driver Partner</span>
              </button>

              {activeOrder && (
                <button
                  onClick={() => {
                    sound.playClick();
                    store.setActiveOrder(activeOrder.id);
                    setCustomerTab('TRACK');
                    setIsBookingOpen(false);
                    setIsMobileMenuOpen(false);
                  }}
                  className="col-span-2 p-3 bg-blue-50 text-[#155EEF] rounded-xl text-left border border-blue-200 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Compass className="w-4 h-4 animate-spin" />
                    <span>Live Tracking (Active Order #{activeOrder.id.slice(-6)})</span>
                  </div>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}

              {state.isCustomerLoggedIn && (
                <button
                  onClick={() => {
                    sound.playClick();
                    setCustomerTab('BOOKINGS');
                    setIsBookingOpen(false);
                    setIsMobileMenuOpen(false);
                  }}
                  className="p-3 bg-slate-50 hover:bg-slate-100 text-slate-800 rounded-xl text-left border border-slate-200 flex items-center gap-2"
                >
                  <FileText className="w-4 h-4 text-slate-600" />
                  <span>My Deliveries</span>
                </button>
              )}

              <button
                onClick={() => {
                  sound.playClick();
                  setSupportOrder(activeOrder || state.orders[0]);
                  setIsMobileMenuOpen(false);
                }}
                className="p-3 bg-slate-50 hover:bg-slate-100 text-slate-800 rounded-xl text-left border border-slate-200 flex items-center gap-2"
              >
                <LifeBuoy className="w-4 h-4 text-purple-600" />
                <span>24/7 Support</span>
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  handleInstallPwa();
                  setIsMobileMenuOpen(false);
                }}
                className="p-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 rounded-xl text-left border border-emerald-200 flex items-center gap-2"
              >
                <Download className="w-4 h-4 text-emerald-600" />
                <span>{isPwaInstalled ? 'App Ready ✓' : 'Install App'}</span>
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  setShowMobileSimulator(true);
                  setIsMobileMenuOpen(false);
                }}
                className="p-3 bg-blue-50 hover:bg-blue-100 text-blue-900 rounded-xl text-left border border-blue-200 flex items-center gap-2"
              >
                <Smartphone className="w-4 h-4 text-[#155EEF]" />
                <span>Mobile Simulator</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* 3. Main Workspace Area */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-3 py-3 sm:px-6 sm:py-6 pb-24 md:pb-8">
        {/* ================= A. CUSTOMER EXPERIENCE ================= */}
        {state.currentRole === 'CUSTOMER' && (
          <div>
            {isBookingOpen ? (
              <BookingFlow
                vehicles={state.vehicles}
                coupons={state.coupons}
                initialPickupAddress={bookingParams.pickup}
                initialDropAddress={bookingParams.drop}
                initialVehicleId={bookingParams.vehicleId}
                onCompleteBooking={(bookingData) => {
                  store.createOrder({
                    pickup: bookingData.pickup,
                    stops: bookingData.stops,
                    drop: bookingData.drop,
                    goods: bookingData.goods,
                    vehicleId: bookingData.vehicleId,
                    appliedCoupon: bookingData.appliedCoupon,
                    paymentMethod: bookingData.paymentMethod
                  });
                  setIsBookingOpen(false);
                  setCustomerTab('TRACK');
                }}
                onCancel={() => setIsBookingOpen(false)}
              />
            ) : (
              <>
                {customerTab === 'LANDING' && (
                  <LandingPage
                    vehicles={state.vehicles}
                    coupons={state.coupons}
                    isCustomerLoggedIn={state.isCustomerLoggedIn}
                    onStartBookingWithParams={handleStartBookingWithParams}
                    onTrackOrderClick={() => {
                      if (activeOrder) {
                        store.setActiveOrder(activeOrder.id);
                        setCustomerTab('TRACK');
                      }
                    }}
                    onSwitchToDriver={() => setCustomerTab('DRIVER_PORTAL')}
                    onSwitchToAdmin={() => store.setRole('ADMIN')}
                    onOpenSupport={() => setSupportOrder(activeOrder || state.orders[0])}
                    onOpenAppDownloadModal={() => setShowAppDownloadModal(true)}
                    onOpenMobileSimulator={() => setShowMobileSimulator(true)}
                    onOpenAuth={() => setShowAuthModal(true)}
                  />
                )}

                {customerTab === 'BOOKINGS' && (
                  <CustomerBookings
                    orders={state.orders}
                    onTrackOrder={(orderId) => {
                      store.setActiveOrder(orderId);
                      setCustomerTab('TRACK');
                    }}
                    onOpenInvoice={(order) => {
                      setSelectedInvoice(store.generateInvoiceForOrder(order));
                    }}
                    onOpenRating={(order) => setRatingOrder(order)}
                    onOpenSupport={(order) => setSupportOrder(order)}
                    onBookAgain={() => setIsBookingOpen(true)}
                  />
                )}

                {customerTab === 'TRACK' && activeOrder && (
                  <LiveTrackingView
                    order={activeOrder}
                    incomingOffer={state.incomingOffer}
                    drivers={state.drivers}
                    onOpenInvoice={() => {
                      setSelectedInvoice(store.generateInvoiceForOrder(activeOrder));
                    }}
                    onOpenRating={() => setRatingOrder(activeOrder)}
                    onOpenSupport={() => setSupportOrder(activeOrder)}
                    onCancelOrder={(reason) => {
                      store.cancelOrder(activeOrder.id, reason, 'CUSTOMER');
                    }}
                    onInstantAssign={() => {
                      store.forceAssignBackupFleet(activeOrder.id);
                    }}
                    onAcceptOffer={(offerId) => {
                      store.driverAcceptOffer(offerId);
                    }}
                    onRejectOffer={(offerId) => {
                      store.driverRejectOffer(offerId);
                    }}
                    onSwitchToDriver={(driverId) => {
                      store.setActiveDriver(driverId);
                      store.setRole('DRIVER');
                    }}
                  />
                )}

                {customerTab === 'OFFERS' && (
                  <div className="space-y-6">
                    <div>
                      <h1 className="text-xl font-bold text-slate-900">Promotions & Coupons</h1>
                      <p className="text-xs text-slate-500">
                        Exclusive enterprise and retail freight discounts
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {state.coupons.map((coupon) => (
                        <div
                          key={coupon.code}
                          className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-center justify-between mb-3">
                              <span className="font-mono font-extrabold text-sm text-[#0B1F3A] bg-amber-100 px-3 py-1 rounded-lg border border-amber-300">
                                {coupon.code}
                              </span>
                              <span className="text-[10px] text-amber-800 font-bold uppercase">
                                Save {coupon.discountValue}{coupon.discountType === 'PERCENTAGE' ? '%' : '₹'}
                              </span>
                            </div>
                            <h3 className="font-bold text-slate-900 text-base">{coupon.title}</h3>
                            <p className="text-xs text-slate-500 mt-1">{coupon.description}</p>
                          </div>

                          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                            <span className="text-slate-400">Min Order: ₹{coupon.minOrderValue}</span>
                            <button
                              onClick={() => {
                                setIsBookingOpen(true);
                              }}
                              className="font-bold text-[#155EEF] hover:underline"
                            >
                              Apply on Trip →
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {customerTab === 'DRIVER_PORTAL' && (
                  <DriverPartnerPortal
                    vehicles={state.vehicles}
                    existingDrivers={state.drivers}
                    onDriverRegisteredAndApproved={(newDriver) => {
                      store.registerNewDriver({
                        name: newDriver.name,
                        phone: newDriver.phone,
                        city: 'Mumbai',
                        vehicleId: newDriver.vehicleId,
                        vehicleNumber: newDriver.vehicleNumber,
                        vehicleModel: newDriver.vehicleModel,
                        documents: newDriver.documents,
                        bankAccount: newDriver.bankAccount,
                        autoApprove: true
                      });
                      store.setRole('DRIVER');
                      setCustomerTab('LANDING');
                    }}
                    onLoginExistingDriver={(drv) => {
                      store.setRole('DRIVER');
                      setCustomerTab('LANDING');
                    }}
                    onBackToCustomer={() => setCustomerTab('LANDING')}
                  />
                )}
              </>
            )}
          </div>
        )}

        {/* ================= B. DRIVER / PARTNER APP ================= */}
        {state.currentRole === 'DRIVER' && (
          <DriverDashboard
            driver={currentDriver}
            orders={state.orders}
            incomingOffer={state.incomingOffer}
            allDrivers={state.drivers}
            onSelectDriver={(drvId) => store.setActiveDriver(drvId)}
            onToggleOnline={() => store.toggleDriverOnline(currentDriver.id)}
            onAcceptOffer={(offerId) => store.driverAcceptOffer(offerId)}
            onRejectOffer={(offerId) => store.driverRejectOffer(offerId)}
            onUpdateStatus={(orderId, st) => store.updateOrderStatus(orderId, st, currentDriver.name, 'DRIVER')}
            onVerifyOtp={(orderId, otp, rec) => store.verifyDeliveryOtp(orderId, otp, rec)}
            onConfirmCash={(orderId) => store.confirmCashCollected(orderId)}
          />
        )}

        {/* ================= C. ADMIN WEB DASHBOARD ================= */}
        {state.currentRole === 'ADMIN' && (
          <AdminDashboard
            orders={state.orders}
            drivers={state.drivers}
            vehicles={state.vehicles}
            tickets={state.tickets}
            claims={state.claims}
            auditLogs={state.auditLogs}
            onSelectOrder={(order) => {
              store.setActiveOrder(order.id);
              setSelectedInvoice(store.generateInvoiceForOrder(order));
            }}
            onAssignDriver={(orderId, driverId) => store.assignDriverToOrder(orderId, driverId)}
            onCancelOrder={(orderId, reason) => store.cancelOrder(orderId, reason, 'ADMIN')}
            onUpdateKyc={(driverId, docId, status, reason) => store.updateDriverKyc(driverId, docId, status, reason)}
            onUpdatePricing={(vehId, updates) => store.updateVehiclePricing(vehId, updates)}
            onReplyTicket={(ticketId, message) => store.addTicketMessage(ticketId, message, 'LODZA Support', 'SUPPORT_AGENT')}
            onUpdateClaimStatus={(claimId, status, notes, compensation) => store.updateClaimStatus(claimId, status, notes, compensation)}
          />
        )}
      </div>

      {/* 4. Global Modals */}

      {/* Customer Auth / Login Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative max-w-md w-full">
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-2 right-2 z-10 p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full"
            >
              <X className="w-4 h-4" />
            </button>
            <CustomerAuth
              existingCustomers={state.customers}
              onLoginSuccess={(user, profile) => {
                store.loginCustomer(user, profile);
                setShowAuthModal(false);
                setIsBookingOpen(true);
              }}
            />
          </div>
        </div>
      )}

      {/* Tax Invoice Modal */}
      {selectedInvoice && (
        <InvoiceModal
          invoice={selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
        />
      )}

      {/* Driver Rating Modal */}
      {ratingOrder && (
        <RatingModal
          orderId={ratingOrder.id}
          driverName={ratingOrder.driverDetails?.name || 'Driver Partner'}
          onClose={() => setRatingOrder(null)}
          onSubmit={(stars, tags, feedback) => {
            store.rateOrder(ratingOrder.id, stars, tags, feedback);
          }}
        />
      )}

      {/* Customer Support & Claims Modal */}
      {supportOrder && (
        <CustomerSupportModal
          orderId={supportOrder.id}
          customerId={state.currentUser.id}
          customerName={state.currentUser.name}
          customerPhone={state.currentUser.phone}
          onClose={() => setSupportOrder(null)}
          onSubmitTicket={(ticket) => {
            store.createSupportTicket(ticket);
          }}
          onSubmitClaim={(claim) => {
            store.createDamageClaim(claim);
          }}
        />
      )}

      {/* App Download Modal */}
      {showAppDownloadModal && (
        <AppDownloadModal
          onClose={() => setShowAppDownloadModal(false)}
          onOpenMobileSimulator={() => {
            setShowAppDownloadModal(false);
            setShowMobileSimulator(true);
          }}
          onInstallPwa={handleInstallPwa}
        />
      )}

      {/* Mobile App Smartphone Simulator */}
      {showMobileSimulator && (
        <MobileAppSimulator
          vehicles={state.vehicles}
          orders={state.orders}
          coupons={state.coupons}
          currentUser={state.currentUser}
          isCustomerLoggedIn={state.isCustomerLoggedIn}
          drivers={state.drivers}
          incomingOffer={state.incomingOffer}
          onCloseSimulator={() => setShowMobileSimulator(false)}
          onTriggerBooking={(params) => {
            setShowMobileSimulator(false);
            handleStartBookingWithParams({
              pickupAddress: params.pickup,
              dropAddress: params.drop,
              vehicleId: params.vehicleId
            });
          }}
          onOpenAuth={() => {
            setShowMobileSimulator(false);
            setShowAuthModal(true);
          }}
          onOpenDriverApp={() => {
            setShowMobileSimulator(false);
            store.setRole('DRIVER');
          }}
          onAcceptOffer={(id) => store.driverAcceptOffer(id)}
          onRejectOffer={(id) => store.driverRejectOffer(id)}
          onUpdateTripStatus={(id, st) => store.updateOrderStatus(id, st, 'Mobile Partner', 'DRIVER')}
          onVerifyOtp={(id, otp, rec) => store.verifyDeliveryOtp(id, otp, rec)}
          onConfirmCash={(id) => store.confirmCashCollected(id)}
          onInstallPwa={handleInstallPwa}
        />
      )}

      {/* Global Real-Time Dispatch Radar Banner */}
      <GlobalDispatchBanner
        offer={state.incomingOffer}
        drivers={state.drivers}
        activeOrder={activeOrder}
        currentRole={state.currentRole}
        onAcceptOffer={(id) => store.driverAcceptOffer(id)}
        onRejectOffer={(id) => store.driverRejectOffer(id)}
        onForceAssignFleet={(id) => store.forceAssignBackupFleet(id)}
        onSwitchToDriverRole={(drvId) => {
          store.setActiveDriver(drvId);
          store.setRole('DRIVER');
        }}
      />

      {/* 5. Mobile Native Bottom Navigation Bar (Porter/Uber style) */}
      {state.currentRole === 'CUSTOMER' && (
        <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-slate-200/90 z-40 px-2 py-1 flex items-center justify-around shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
          <button
            onClick={() => {
              sound.playClick();
              setCustomerTab('LANDING');
              setIsBookingOpen(false);
            }}
            className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all ${
              customerTab === 'LANDING' && !isBookingOpen
                ? 'text-[#155EEF] font-bold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Truck className={`w-5 h-5 ${customerTab === 'LANDING' && !isBookingOpen ? 'text-[#155EEF] scale-110' : ''}`} />
            <span className="text-[11px] font-semibold mt-0.5">Book Fleet</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              if (activeOrder) {
                store.setActiveOrder(activeOrder.id);
                setCustomerTab('TRACK');
              } else if (state.orders.length > 0) {
                store.setActiveOrder(state.orders[0].id);
                setCustomerTab('TRACK');
              } else {
                setCustomerTab('LANDING');
              }
              setIsBookingOpen(false);
            }}
            className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all relative ${
              customerTab === 'TRACK'
                ? 'text-[#155EEF] font-bold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <div className="relative">
              <Compass className={`w-5 h-5 ${customerTab === 'TRACK' ? 'text-[#155EEF] animate-spin' : ''}`} />
              {activeOrder && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white animate-pulse" />
              )}
            </div>
            <span className="text-[11px] font-semibold mt-0.5">Live Track</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setCustomerTab('BOOKINGS');
              setIsBookingOpen(false);
            }}
            className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all ${
              customerTab === 'BOOKINGS'
                ? 'text-[#155EEF] font-bold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <FileText className={`w-5 h-5 ${customerTab === 'BOOKINGS' ? 'text-[#155EEF]' : ''}`} />
            <span className="text-[11px] font-semibold mt-0.5">Deliveries</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setCustomerTab('DRIVER_PORTAL');
              setIsBookingOpen(false);
            }}
            className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all ${
              customerTab === 'DRIVER_PORTAL'
                ? 'text-[#FF8A00] font-bold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <UserCheck className={`w-5 h-5 ${customerTab === 'DRIVER_PORTAL' ? 'text-[#FF8A00]' : ''}`} />
            <span className="text-[11px] font-semibold mt-0.5">Partner</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setSupportOrder(activeOrder || state.orders[0]);
            }}
            className="flex flex-col items-center justify-center py-1.5 px-3 rounded-xl text-slate-500 hover:text-purple-600 transition-all"
          >
            <LifeBuoy className="w-5 h-5" />
            <span className="text-[11px] font-semibold mt-0.5">Support</span>
          </button>
        </nav>
      )}

      {/* Footer (Rendered on non-landing views, since LandingPage has its own rich LandingFooter) */}
      {(state.currentRole !== 'CUSTOMER' || customerTab !== 'LANDING' || isBookingOpen) && (
        <footer className="bg-slate-950 text-white border-t border-slate-900 mt-auto py-6 sm:py-8 px-4 sm:px-6 text-xs mb-16 md:mb-0">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
              <LodzaLogo size="sm" light={true} showTagline={false} />
              <span className="text-slate-700">|</span>
              <span className="text-slate-400 font-medium">Move. Deliver. Done.</span>
              <span className="text-slate-600 text-[11px]">© {new Date().getFullYear()} LODZA Logistics Technologies Pvt. Ltd.</span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-[11px] text-slate-400">
              <span>GSTIN: 27AABCL8921K1ZZ (SAC 996511)</span>
              <span>•</span>
              <a href="tel:18002665639" className="hover:text-white transition-colors">Toll-Free: 1800-266-5639</a>
              <span>•</span>
              <span>MoRTH Compliant Carrier</span>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
