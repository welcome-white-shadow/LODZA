import React, { useEffect, useState } from 'react';
import { LocationPoint, OrderStatus, OrderStop } from '../../types';
import { Navigation, MapPin, Truck, ShieldCheck, Gauge } from 'lucide-react';

interface LiveMapSimulatorProps {
  pickup: LocationPoint;
  drop: LocationPoint;
  stops?: OrderStop[];
  status: OrderStatus;
  vehicleName?: string;
  driverName?: string;
  height?: string;
  showDetails?: boolean;
}

export const LiveMapSimulator: React.FC<LiveMapSimulatorProps> = ({
  pickup,
  drop,
  stops = [],
  status,
  vehicleName = 'Tata Ace',
  driverName = 'Ramesh Kumar',
  height = 'h-72',
  showDetails = true
}) => {
  // Determine progress along route based on order status (0 to 100%)
  const getProgress = (st: OrderStatus): number => {
    switch (st) {
      case 'BOOKING_CONFIRMED':
      case 'SEARCHING_DRIVER':
        return 0;
      case 'DRIVER_ASSIGNED':
        return 5;
      case 'DRIVER_EN_ROUTE_PICKUP':
        return 12;
      case 'DRIVER_ARRIVED_PICKUP':
      case 'LOADING':
        return 18;
      case 'TRIP_STARTED':
        return 28;
      case 'IN_TRANSIT':
        return 58;
      case 'DRIVER_ARRIVED_DROP':
      case 'UNLOADING':
      case 'DELIVERY_VERIFICATION':
        return 92;
      case 'COMPLETED':
        return 100;
      default:
        return 50;
    }
  };

  const [simulatedProgress, setSimulatedProgress] = useState(getProgress(status));
  const [speed, setSpeed] = useState(26);

  useEffect(() => {
    const target = getProgress(status);
    setSimulatedProgress(target);

    // If in transit, simulate gentle vehicle vibration / speed fluctuation
    if (status === 'IN_TRANSIT') {
      const interval = setInterval(() => {
        setSpeed((prev) => Math.floor(22 + Math.random() * 12));
      }, 3000);
      return () => clearInterval(interval);
    } else {
      setSpeed(0);
    }
  }, [status]);

  // Route path bezier coordinates on a 800x400 SVG grid
  const startX = 120;
  const startY = 300;
  const endX = 680;
  const endY = 100;

  // Calculate current vehicle position along an S-curve
  const t = simulatedProgress / 100;
  // Cubic Bezier formula: B(t) = (1-t)^3*P0 + 3*(1-t)^2*t*P1 + 3*(1-t)*t^2*P2 + t^3*P3
  const cp1X = 260;
  const cp1Y = 120;
  const cp2X = 520;
  const cp2Y = 320;

  const currentX =
    Math.pow(1 - t, 3) * startX +
    3 * Math.pow(1 - t, 2) * t * cp1X +
    3 * (1 - t) * Math.pow(t, 2) * cp2X +
    Math.pow(t, 3) * endX;

  const currentY =
    Math.pow(1 - t, 3) * startY +
    3 * Math.pow(1 - t, 2) * t * cp1Y +
    3 * (1 - t) * Math.pow(t, 2) * cp2Y +
    Math.pow(t, 3) * endY;

  return (
    <div className={`relative w-full ${height} bg-slate-900 rounded-2xl overflow-hidden border border-slate-700/80 shadow-inner select-none`}>
      {/* City Street Grid Background Simulation */}
      <svg className="absolute inset-0 w-full h-full opacity-25" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#60a5fa" strokeWidth="0.8" opacity="0.3" />
            <circle cx="20" cy="20" r="1.5" fill="#3b82f6" opacity="0.3" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Main Interactive Route Graphic */}
      <svg
        viewBox="0 0 800 400"
        className="absolute inset-0 w-full h-full preserve-3d"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="50%" stopColor="#155EEF" />
            <stop offset="100%" stopColor="#EF4444" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Ambient road background */}
        <path
          d={`M ${startX} ${startY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${endX} ${endY}`}
          fill="none"
          stroke="#1e293b"
          strokeWidth="18"
          strokeLinecap="round"
        />

        {/* Active Route Polyline */}
        <path
          d={`M ${startX} ${startY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${endX} ${endY}`}
          fill="none"
          stroke="url(#routeGradient)"
          strokeWidth="6"
          strokeLinecap="round"
          filter="url(#glow)"
        />

        {/* Pickup Pin */}
        <g transform={`translate(${startX}, ${startY})`}>
          <circle r="14" fill="#10B981" opacity="0.25" className="animate-ping" />
          <circle r="10" fill="#10B981" stroke="#ffffff" strokeWidth="2.5" />
          <text y="24" textAnchor="middle" fill="#A7F3D0" fontSize="11" fontWeight="700">
            PICKUP
          </text>
        </g>

        {/* Intermediate Stops (if present) */}
        {stops.map((stop, idx) => {
          const stopT = 0.35 + idx * 0.25;
          const stopX =
            Math.pow(1 - stopT, 3) * startX +
            3 * Math.pow(1 - stopT, 2) * stopT * cp1X +
            3 * (1 - stopT) * Math.pow(stopT, 2) * cp2X +
            Math.pow(stopT, 3) * endX;
          const stopY =
            Math.pow(1 - stopT, 3) * startY +
            3 * Math.pow(1 - stopT, 2) * stopT * cp1Y +
            3 * (1 - stopT) * Math.pow(stopT, 2) * cp2Y +
            Math.pow(stopT, 3) * endY;
          return (
            <g key={stop.stopId} transform={`translate(${stopX}, ${stopY})`}>
              <circle r="8" fill="#F59E0B" stroke="#ffffff" strokeWidth="2" />
              <text y="20" textAnchor="middle" fill="#FDE68A" fontSize="10" fontWeight="600">
                Stop {idx + 1}
              </text>
            </g>
          );
        })}

        {/* Drop Destination Pin */}
        <g transform={`translate(${endX}, ${endY})`}>
          <circle r="14" fill="#EF4444" opacity="0.3" className="animate-ping" />
          <circle r="10" fill="#EF4444" stroke="#ffffff" strokeWidth="2.5" />
          <text y="24" textAnchor="middle" fill="#FECACA" fontSize="11" fontWeight="700">
            DROP
          </text>
        </g>

        {/* Vehicle Marker */}
        {status !== 'BOOKING_CONFIRMED' && status !== 'SEARCHING_DRIVER' && (
          <g
            transform={`translate(${currentX}, ${currentY})`}
            className="transition-all duration-700 ease-out"
          >
            <circle r="20" fill="#155EEF" opacity="0.35" className="animate-ping" />
            <circle r="16" fill="#0B1F3A" stroke="#155EEF" strokeWidth="3" />
            <g transform="translate(-8, -8)">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF8A00" strokeWidth="2.5">
                <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
                <path d="M15 18H9" />
                <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
                <circle cx="17" cy="18" r="2" />
                <circle cx="7" cy="18" r="2" />
              </svg>
            </g>
          </g>
        )}
      </svg>

      {/* Floating GPS HUD Stats */}
      {showDetails && (
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
          <div className="flex items-center gap-2 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700 shadow-lg text-white text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold">{vehicleName}</span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-300 font-mono">{driverName}</span>
          </div>

          <div className="flex items-center gap-2">
            {status === 'IN_TRANSIT' && (
              <div className="flex items-center gap-1.5 bg-blue-600/90 backdrop-blur-md px-3 py-1.5 rounded-xl text-white font-mono text-xs shadow-lg border border-blue-400/30">
                <Gauge className="w-3.5 h-3.5 text-amber-300" />
                <span>{speed} km/h</span>
              </div>
            )}
            <div className="flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700 text-xs text-emerald-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verified Partner</span>
            </div>
          </div>
        </div>
      )}

      {/* Bottom overlay: Pickup and Drop quick address snippet */}
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between bg-slate-950/85 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-800 text-xs text-white">
        <div className="flex items-center gap-2 truncate max-w-[48%]">
          <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span className="truncate text-slate-300">{pickup.address.split(',')[0]}</span>
        </div>
        <Navigation className="w-3.5 h-3.5 text-blue-400 shrink-0" />
        <div className="flex items-center gap-2 truncate max-w-[48%] justify-end">
          <span className="truncate text-slate-300">{drop.address.split(',')[0]}</span>
          <MapPin className="w-3.5 h-3.5 text-red-400 shrink-0" />
        </div>
      </div>
    </div>
  );
};
