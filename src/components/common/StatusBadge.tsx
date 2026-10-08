import React from 'react';
import { OrderStatus } from '../../types';
import { getStatusLabel } from '../../services/orderStateMachine';
import {
  Clock,
  Search,
  UserCheck,
  Navigation,
  MapPin,
  Package,
  Truck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  CreditCard
} from 'lucide-react';

interface StatusBadgeProps {
  status: OrderStatus;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  showIcon = true
}) => {
  const getBadgeConfig = () => {
    switch (status) {
      case 'DRAFT':
      case 'ESTIMATE_CREATED':
        return {
          bg: 'bg-slate-100 text-slate-700 border-slate-200',
          icon: Clock
        };
      case 'SEARCHING_DRIVER':
        return {
          bg: 'bg-amber-50 text-amber-700 border-amber-200 animate-pulse',
          icon: Search
        };
      case 'DRIVER_ASSIGNED':
        return {
          bg: 'bg-blue-50 text-blue-700 border-blue-200',
          icon: UserCheck
        };
      case 'DRIVER_EN_ROUTE_PICKUP':
      case 'DRIVER_ARRIVED_PICKUP':
        return {
          bg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
          icon: MapPin
        };
      case 'LOADING':
      case 'UNLOADING':
        return {
          bg: 'bg-orange-50 text-orange-700 border-orange-200',
          icon: Package
        };
      case 'TRIP_STARTED':
      case 'IN_TRANSIT':
        return {
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold',
          icon: Navigation
        };
      case 'DELIVERY_VERIFICATION':
        return {
          bg: 'bg-violet-50 text-violet-700 border-violet-200',
          icon: Truck
        };
      case 'PAYMENT_PENDING_CASH':
        return {
          bg: 'bg-amber-100 text-amber-800 border-amber-300',
          icon: CreditCard
        };
      case 'COMPLETED':
        return {
          bg: 'bg-green-100 text-green-800 border-green-300',
          icon: CheckCircle2
        };
      case 'CANCELLED_BY_CUSTOMER':
      case 'CANCELLED_BY_DRIVER':
      case 'CANCELLED_BY_ADMIN':
      case 'FAILED':
        return {
          bg: 'bg-red-50 text-red-700 border-red-200',
          icon: XCircle
        };
      case 'NO_DRIVER_AVAILABLE':
      case 'REASSIGNMENT_REQUIRED':
      case 'DISPUTED':
        return {
          bg: 'bg-rose-50 text-rose-700 border-rose-200',
          icon: AlertTriangle
        };
      default:
        return {
          bg: 'bg-gray-100 text-gray-700 border-gray-200',
          icon: HelpCircle
        };
    }
  };

  const config = getBadgeConfig();
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3 py-1.5 gap-2'
  }[size];

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border ${config.bg} ${sizeClasses} whitespace-nowrap transition-colors`}
    >
      {showIcon && <Icon className="w-3.5 h-3.5 shrink-0" />}
      <span>{getStatusLabel(status)}</span>
    </span>
  );
};
