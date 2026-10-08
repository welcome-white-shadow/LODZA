import React, { useState } from 'react';
import { store } from '../../services/store';
import { User, Truck, ShieldAlert, RotateCcw, Play, ChevronDown, ChevronUp } from 'lucide-react';
import { sound } from '../../services/soundService';

interface RoleSwitcherProps {
  currentRole: 'CUSTOMER' | 'DRIVER' | 'ADMIN';
  activeOrderId: string | null;
  hasIncomingOffer: boolean;
  onSimulateNextStep?: () => void;
}

export const RoleSwitcher: React.FC<RoleSwitcherProps> = ({
  currentRole,
  activeOrderId,
  hasIncomingOffer,
  onSimulateNextStep
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleRoleChange = (role: 'CUSTOMER' | 'DRIVER' | 'ADMIN') => {
    sound.playClick();
    store.setRole(role);
  };

  const handleReset = () => {
    if (window.confirm('Reset demo data to initial seed state?')) {
      store.resetToSeed();
    }
  };

  // Hidden on mobile viewports so it NEVER overlaps native mobile navigation or forms
  return (
    <aside aria-label="Portal switcher" className="hidden md:block fixed bottom-4 left-4 z-40">
      {!isExpanded ? (
        <button
          type="button"
          onClick={() => {
            sound.playClick();
            setIsExpanded(true);
          }}
          className="flex items-center gap-2 px-3 py-1.5 bg-slate-900/90 hover:bg-slate-900 text-slate-300 hover:text-white rounded-full border border-slate-700/80 shadow-lg backdrop-blur-md text-[11px] font-medium transition-all hover:scale-105 cursor-pointer"
          title="Switch Portal Mode: Customer, Driver Partner, Operations"
        >
          <span className="relative flex h-2 w-2">
            {hasIncomingOffer ? (
              <>
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
              </>
            ) : (
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            )}
          </span>
          <span className="text-slate-200 font-semibold">
            Portal: {currentRole === 'CUSTOMER' ? 'Customer App' : currentRole === 'DRIVER' ? 'Driver Partner' : 'Admin Operations'}
          </span>
          <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
        </button>
      ) : (
        <div className="max-w-xs w-72 animate-in slide-in-from-bottom-2 duration-150">
          <div className="bg-slate-950/95 text-white border border-slate-800 rounded-2xl p-3.5 shadow-2xl backdrop-blur-xl space-y-2.5 text-xs">
            {/* Header */}
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-800">
              <span className="font-bold text-slate-300 text-[11px] uppercase tracking-wider">Switch Portal View</span>
              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>

            {/* Role Buttons */}
            <div className="grid grid-cols-3 gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => handleRoleChange('CUSTOMER')}
                className={`py-1.5 px-1 rounded-lg font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                  currentRole === 'CUSTOMER'
                    ? 'bg-[#155EEF] text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span className="text-[10px]">Customer</span>
              </button>

              <button
                type="button"
                onClick={() => handleRoleChange('DRIVER')}
                className={`relative py-1.5 px-1 rounded-lg font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                  currentRole === 'DRIVER'
                    ? 'bg-[#FF8A00] text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Truck className="w-3.5 h-3.5" />
                <span className="text-[10px]">Driver</span>
                {hasIncomingOffer && (
                  <span className="absolute top-1 right-1 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => handleRoleChange('ADMIN')}
                className={`py-1.5 px-1 rounded-lg font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                  currentRole === 'ADMIN'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span className="text-[10px]">Admin</span>
              </button>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1.5 pt-0.5">
              {activeOrderId && onSimulateNextStep && (
                <button
                  type="button"
                  onClick={onSimulateNextStep}
                  className="flex-1 py-1.5 px-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg flex items-center justify-center gap-1 text-[11px] transition-colors cursor-pointer"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Advance Trip</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleReset}
                title="Reset demo data"
                className="py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg border border-slate-700 text-[10px] transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
