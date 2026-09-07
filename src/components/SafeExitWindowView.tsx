import React, { useState } from 'react';
import { useRoadPulse } from '../context/RoadPulseContext';
import { 
  Clock, 
  Truck, 
  AlertTriangle, 
  ShieldCheck, 
  Gauge, 
  Sliders, 
  Navigation, 
  ArrowRight,
  Compass,
  CheckCircle2,
  AlertOctagon
} from 'lucide-react';

export const SafeExitWindowView: React.FC = () => {
  const { 
    vehicles, 
    selectedVehicleId, 
    setSelectedVehicleId, 
    rerouteVehicle, 
    setActiveTab,
    roadSegments
  } = useRoadPulse();

  const selectedVehicle = vehicles.find(v => v.id === selectedVehicleId) || vehicles[0];

  // Interactive sandbox simulation controls
  const [vehicleSpeed, setVehicleSpeed] = useState<number>(selectedVehicle.speedKmH);
  const [distanceKm, setDistanceKm] = useState<number>(selectedVehicle.distanceToRiskKm);
  const [deteriorationRateMinutes, setDeteriorationRateMinutes] = useState<number>(45); // Time until road blocks completely

  // Calculation: Travel time to hazard zone = (distanceKm / speed) * 60 minutes
  const travelTimeToHazard = vehicleSpeed > 0 ? Math.round((distanceKm / vehicleSpeed) * 60) : 999;
  const clearanceMargin = deteriorationRateMinutes - travelTimeToHazard;

  const getExitStatus = () => {
    if (clearanceMargin >= 20) {
      return {
        label: 'Safe to Cross',
        status: 'safe_to_cross',
        color: 'text-emerald-400',
        bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
        recommendation: 'Sufficient temporal buffer exists. Maintain steady speed and cross sector before debris accumulation.',
        actionRequired: false
      };
    }
    if (clearanceMargin >= 0) {
      return {
        label: 'Proceed with Caution',
        status: 'proceed_with_caution',
        color: 'text-amber-400',
        bg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
        recommendation: 'Tight window. Any mountain traffic standstill will trap carrier inside landslide runout path.',
        actionRequired: false
      };
    }
    return {
      label: 'Divert Immediately (Exit Window Closed)',
      status: 'divert_immediately',
      color: 'text-red-400',
      bg: 'bg-red-500/20 text-red-300 border-red-500/40 animate-pulse',
      recommendation: 'CRITICAL WARNING: Mudslide breach projected before arrival. Divert to Haflong bypass immediately to avoid entrapment.',
      actionRequired: true
    };
  };

  const statusMeta = getExitStatus();

  return (
    <div className="p-4 space-y-6 max-w-7xl mx-auto text-slate-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 rounded-2xl p-5 border border-indigo-500/20 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              Novel Operational Innovation
            </span>
            <span className="text-xs text-slate-400">DIFFERENTIATOR MODULE</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Safe Exit Window: Dynamic Spatio-Temporal Clearance Calculator
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-3xl">
            Calculates whether a specific freight carrier can traverse a vulnerable mountain gorge before geotechnical failure breach conditions. Prevents lethal truck stranding in narrow single-lane corridors.
          </p>
        </div>

        {/* Vehicle Selector */}
        <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-xl border border-slate-800 text-xs">
          <span className="text-slate-400 font-bold uppercase text-[10px]">Carrier:</span>
          <select
            value={selectedVehicleId}
            onChange={(e) => {
              setSelectedVehicleId(e.target.value);
              const v = vehicles.find(item => item.id === e.target.value);
              if (v) {
                setVehicleSpeed(v.speedKmH);
                setDistanceKm(v.distanceToRiskKm);
              }
            }}
            className="bg-slate-900 text-white font-bold px-2 py-1 rounded border border-slate-700"
          >
            {vehicles.map((v) => (
              <option key={v.id} value={v.id}>
                {v.id} ({v.driverName} • {v.cargoType})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Grid: Output Gauge (1 Col) + Multi-Parameter Sandbox (2 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Output Gauge & Decision Card (1 Col) */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-xl flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Clearance Margin
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusMeta.bg}`}>
                {statusMeta.label}
              </span>
            </div>

            <div className="mt-4">
              <span className="text-[10px] text-slate-400 uppercase font-bold font-mono">{selectedVehicle.id} • {selectedVehicle.plateNumber}</span>
              <h3 className="text-base font-bold text-white mt-0.5">{selectedVehicle.driverName}</h3>
              <p className="text-xs text-amber-300 font-semibold">{selectedVehicle.cargoType}</p>
            </div>

            {/* Margin Dial */}
            <div className="my-5 p-5 rounded-2xl bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-800 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Safe Exit Window Margin
              </span>
              <div className={`text-4xl font-black tracking-tight my-2 font-mono ${statusMeta.color}`}>
                {clearanceMargin >= 0 ? `+${clearanceMargin} min` : `${clearanceMargin} min`}
              </div>
              <p className="text-[11px] text-slate-400">
                ETA to hazard: <strong className="text-white">{travelTimeToHazard} mins</strong> vs. projected breach: <strong className="text-white">{deteriorationRateMinutes} mins</strong>
              </p>
            </div>

            {/* Recommendation Box */}
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">AI Operational Directive:</span>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                {statusMeta.recommendation}
              </p>
            </div>
          </div>

          <div className="pt-2">
            {statusMeta.actionRequired ? (
              <button
                onClick={() => rerouteVehicle(selectedVehicle.id)}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:brightness-110 text-white font-extrabold text-xs shadow-lg transition-all flex items-center justify-center gap-2 animate-pulse"
              >
                <AlertOctagon className="w-4 h-4" />
                <span>Transmit Emergency Detour (Haflong Bypass)</span>
              </button>
            ) : (
              <button
                onClick={() => setActiveTab('driver_hud')}
                className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2"
              >
                <span>Project to Driver HUD</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Sandbox Calculator Controls (2 Cols) */}
        <div className="lg:col-span-2 bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-xl space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              Spatio-Temporal Simulation Controls
            </h3>
            <span className="text-[11px] text-slate-400">
              Simulate traffic crawl or accelerating rainfall to see the window close
            </span>
          </div>

          {/* Slider 1: Distance to Hazard Zone */}
          <div className="space-y-1.5 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-300">Carrier Distance to Bottleneck / Hazard Zone:</span>
              <span className="font-mono font-bold text-cyan-400">{distanceKm} km</span>
            </div>
            <input
              type="range"
              min="2"
              max="100"
              value={distanceKm}
              onChange={(e) => setDistanceKm(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>2 km (Entering Gorge)</span>
              <span>30 km</span>
              <span>100 km (Far Approach)</span>
            </div>
          </div>

          {/* Slider 2: Real-time Velocity */}
          <div className="space-y-1.5 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-300">Actual Speed in Mountain Sector:</span>
              <span className="font-mono font-bold text-emerald-400">{vehicleSpeed} km/h</span>
            </div>
            <input
              type="range"
              min="5"
              max="70"
              value={vehicleSpeed}
              onChange={(e) => setVehicleSpeed(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>5 km/h (Monsoon Crawl / Slurry)</span>
              <span>30 km/h (Normal Loaded Freight)</span>
              <span>70 km/h (Express Highway)</span>
            </div>
          </div>

          {/* Slider 3: Projected Time to Road Failure */}
          <div className="space-y-1.5 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-300">Geotechnical Time-to-Failure (Projected by AI):</span>
              <span className="font-mono font-bold text-red-400">{deteriorationRateMinutes} minutes</span>
            </div>
            <input
              type="range"
              min="10"
              max="120"
              value={deteriorationRateMinutes}
              onChange={(e) => setDeteriorationRateMinutes(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-red-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>10 mins (Imminent Slope Runout)</span>
              <span>45 mins</span>
              <span>120 mins (Slow Creep)</span>
            </div>
          </div>

          {/* Real-time Comparison Matrix */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Transit Duration</span>
                <span className="text-base font-bold text-white font-mono mt-1 block">{travelTimeToHazard} mins</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Projected Breach</span>
                <span className="text-base font-bold text-amber-300 font-mono mt-1 block">{deteriorationRateMinutes} mins</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Safety Delta</span>
                <span className={`text-base font-black font-mono mt-1 block ${statusMeta.color}`}>
                  {clearanceMargin} mins
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
