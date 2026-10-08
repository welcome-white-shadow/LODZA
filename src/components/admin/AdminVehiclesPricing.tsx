import React, { useState } from 'react';
import { VehicleConfig } from '../../types';
import { Truck, Bike, Save, RefreshCw, IndianRupee, Clock, Check } from 'lucide-react';
import { sound } from '../../services/soundService';

interface AdminVehiclesPricingProps {
  vehicles: VehicleConfig[];
  onUpdatePricing: (vehicleId: string, updates: Partial<VehicleConfig>) => void;
}

export const AdminVehiclesPricing: React.FC<AdminVehiclesPricingProps> = ({
  vehicles,
  onUpdatePricing
}) => {
  const [editingId, setEditingId] = useState<string>(vehicles[2]?.id || vehicles[0]?.id || '');
  const activeVehicle = vehicles.find((v) => v.id === editingId) || vehicles[0];

  const [baseFare, setBaseFare] = useState(activeVehicle?.baseFare || 280);
  const [baseDistanceKm, setBaseDistanceKm] = useState(activeVehicle?.baseDistanceKm || 2);
  const [perKmRate, setPerKmRate] = useState(activeVehicle?.perKmRate || 24);
  const [perMinRate, setPerMinRate] = useState(activeVehicle?.perMinRate || 2.5);
  const [minFare, setMinFare] = useState(activeVehicle?.minFare || 350);
  const [stopCharge, setStopCharge] = useState(activeVehicle?.stopCharge || 75);
  const [waitingRatePerMin, setWaitingRatePerMin] = useState(activeVehicle?.waitingRatePerMin || 4);
  const [freeWaitingMin, setFreeWaitingMin] = useState(activeVehicle?.freeWaitingMin || 30);
  const [capacityKg, setCapacityKg] = useState(activeVehicle?.capacityKg || 850);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSelectVehicle = (v: VehicleConfig) => {
    setEditingId(v.id);
    setBaseFare(v.baseFare);
    setBaseDistanceKm(v.baseDistanceKm);
    setPerKmRate(v.perKmRate);
    setPerMinRate(v.perMinRate);
    setMinFare(v.minFare);
    setStopCharge(v.stopCharge);
    setWaitingRatePerMin(v.waitingRatePerMin);
    setFreeWaitingMin(v.freeWaitingMin);
    setCapacityKg(v.capacityKg);
    setSaveSuccess(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playSuccess();
    onUpdatePricing(editingId, {
      baseFare: Number(baseFare),
      baseDistanceKm: Number(baseDistanceKm),
      perKmRate: Number(perKmRate),
      perMinRate: Number(perMinRate),
      minFare: Number(minFare),
      stopCharge: Number(stopCharge),
      waitingRatePerMin: Number(waitingRatePerMin),
      freeWaitingMin: Number(freeWaitingMin),
      capacityKg: Number(capacityKg)
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Vehicle Fleet & Pricing Engine</h2>
        <p className="text-xs text-slate-500">
          Configure dynamic base rates, distance tariffs, waiting charges and payload thresholds
        </p>
      </div>

      {/* Vehicle Category Selector Bar */}
      <div className="flex flex-wrap gap-2">
        {vehicles.map((v) => {
          const isSelected = v.id === editingId;
          return (
            <button
              key={v.id}
              onClick={() => handleSelectVehicle(v)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all border ${
                isSelected
                  ? 'bg-[#155EEF] text-white border-[#155EEF] shadow-sm'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
              }`}
            >
              {v.category === 'two_wheeler' ? <Bike className="w-4 h-4" /> : <Truck className="w-4 h-4" />}
              <span>{v.name}</span>
            </button>
          );
        })}
      </div>

      {/* Editor Card */}
      {activeVehicle && (
        <form onSubmit={handleSave} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
            <div>
              <h3 className="text-base font-bold text-slate-900">{activeVehicle.name} Configuration</h3>
              <p className="text-xs text-slate-500">{activeVehicle.subtitle}</p>
            </div>
            {saveSuccess && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold animate-in fade-in">
                <Check className="w-3.5 h-3.5" />
                <span>Pricing Rules Updated & Logged</span>
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Base Fare (₹)
              </label>
              <input
                type="number"
                min="0"
                value={baseFare}
                onChange={(e) => setBaseFare(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-slate-200 font-bold focus:outline-none focus:ring-2 focus:ring-[#155EEF]"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Starting freight charge</span>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Base Distance Included (KM)
              </label>
              <input
                type="number"
                min="0"
                value={baseDistanceKm}
                onChange={(e) => setBaseDistanceKm(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-slate-200 font-bold focus:outline-none focus:ring-2 focus:ring-[#155EEF]"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Included before per-km kicks in</span>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Per KM Tariff Rate (₹ / km)
              </label>
              <input
                type="number"
                min="0"
                value={perKmRate}
                onChange={(e) => setPerKmRate(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-slate-200 font-bold focus:outline-none focus:ring-2 focus:ring-[#155EEF]"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Beyond base distance</span>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Per Minute Transit Rate (₹ / min)
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                value={perMinRate}
                onChange={(e) => setPerMinRate(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-slate-200 font-bold focus:outline-none focus:ring-2 focus:ring-[#155EEF]"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Traffic duration charge</span>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Minimum Guaranteed Fare (₹)
              </label>
              <input
                type="number"
                min="0"
                value={minFare}
                onChange={(e) => setMinFare(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-slate-200 font-bold focus:outline-none focus:ring-2 focus:ring-[#155EEF]"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Floor price for any trip</span>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Extra Intermediate Stop Charge (₹)
              </label>
              <input
                type="number"
                min="0"
                value={stopCharge}
                onChange={(e) => setStopCharge(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-slate-200 font-bold focus:outline-none focus:ring-2 focus:ring-[#155EEF]"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Per waypoint added</span>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Free Loading/Unloading Time (Mins)
              </label>
              <input
                type="number"
                min="0"
                value={freeWaitingMin}
                onChange={(e) => setFreeWaitingMin(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-slate-200 font-bold focus:outline-none focus:ring-2 focus:ring-[#155EEF]"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Complimentary loading window</span>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Chargeable Waiting Rate (₹ / min)
              </label>
              <input
                type="number"
                min="0"
                value={waitingRatePerMin}
                onChange={(e) => setWaitingRatePerMin(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-slate-200 font-bold focus:outline-none focus:ring-2 focus:ring-[#155EEF]"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Detention rate past free window</span>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Payload Capacity (KG)
              </label>
              <input
                type="number"
                min="10"
                value={capacityKg}
                onChange={(e) => setCapacityKg(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-slate-200 font-bold focus:outline-none focus:ring-2 focus:ring-[#155EEF]"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Maximum permissible weight</span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-3 bg-[#155EEF] hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Save & Publish Pricing Rules</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
