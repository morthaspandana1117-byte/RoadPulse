import React, { useState } from 'react';
import { useRoadPulse } from '../context/RoadPulseContext';
import { Vehicle } from '../types';
import { 
  Truck, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  ShieldAlert, 
  Navigation, 
  Compass, 
  ExternalLink,
  RotateCcw,
  Gauge,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export const VehicleTrackingView: React.FC = () => {
  const { 
    vehicles, 
    selectedVehicleId, 
    setSelectedVehicleId, 
    rerouteVehicle,
    setActiveTab,
    roadSegments
  } = useRoadPulse();

  const selectedVehicle = vehicles.find(v => v.id === selectedVehicleId) || vehicles[0];

  const getStatusBadge = (v: Vehicle) => {
    if (v.status === 'rerouting') return { label: 'Rerouting in Progress', color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' };
    if (v.status === 'caution') return { label: 'Approaching High Hazard', color: 'bg-red-500/20 text-red-300 border-red-500/40 animate-pulse' };
    if (v.status === 'stopped') return { label: 'Stopped / Awaiting Clearance', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40' };
    return { label: 'On Schedule (Normal)', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' };
  };

  return (
    <div className="p-4 space-y-6 max-w-7xl mx-auto text-slate-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 rounded-2xl p-5 border border-indigo-500/20 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5" />
              Fleet Logistics Telemetry
            </span>
            <span className="text-xs text-slate-400">STAGE 6: ALERT & TRACK</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Real-Time Logistics Fleet Monitoring & Exposure Matrix
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-3xl">
            Continuously calculates dynamic spatial distance vectors between active freight carriers and evolving terrain hazards, evaluating individual Safe Exit clearance windows.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('driver_hud')}
          className="shrink-0 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg transition-all flex items-center gap-2"
        >
          <span>Open Driver Cab HUD</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Main Grid: Fleet Table (2 Cols) + Active Vehicle Deep-Dive (1 Col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Vehicles Table (2 Cols) */}
        <div className="lg:col-span-2 bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Truck className="w-4 h-4 text-cyan-400" />
              Active Monitored Fleet ({vehicles.length} Carriers)
            </h3>
            <span className="text-[11px] text-slate-400">
              Click vehicle row to inspect telemetry & safe exit margin
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                  <th className="pb-2.5 font-bold">Vehicle ID</th>
                  <th className="pb-2.5 font-bold">Driver</th>
                  <th className="pb-2.5 font-bold">Cargo</th>
                  <th className="pb-2.5 font-bold">Route</th>
                  <th className="pb-2.5 font-bold">Risk Exposure</th>
                  <th className="pb-2.5 font-bold">Dist to Hazard</th>
                  <th className="pb-2.5 font-bold">Safe Exit Margin</th>
                  <th className="pb-2.5 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {vehicles.map((v) => {
                  const isSelected = v.id === selectedVehicleId;
                  const badge = getStatusBadge(v);

                  return (
                    <tr
                      key={v.id}
                      onClick={() => setSelectedVehicleId(v.id)}
                      className={`cursor-pointer transition-colors ${
                        isSelected ? 'bg-indigo-950/60 font-semibold' : 'hover:bg-slate-950/50'
                      }`}
                    >
                      <td className="py-3">
                        <div className="font-mono font-bold text-white flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full ${
                            v.status === 'caution' ? 'bg-red-500 animate-ping' :
                            v.status === 'rerouting' ? 'bg-cyan-400' : 'bg-emerald-400'
                          }`} />
                          {v.id}
                        </div>
                        <span className="text-[10px] text-slate-500 block font-mono">{v.plateNumber}</span>
                      </td>
                      <td className="py-3 text-slate-300">{v.driverName}</td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-amber-300 text-[10px] font-bold">
                          {v.cargoType}
                        </span>
                      </td>
                      <td className="py-3 text-slate-300">
                        <div className="text-[11px]">{v.startLocation} ➔ {v.destination}</div>
                        <span className="text-[10px] text-slate-500">{v.assignedCorridor}</span>
                      </td>
                      <td className="py-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badge.color}`}>
                          {badge.label}
                        </span>
                      </td>
                      <td className="py-3 font-mono font-bold">
                        <span className={v.distanceToRiskKm <= 20 ? 'text-red-400' : 'text-slate-300'}>
                          {v.distanceToRiskKm} km
                        </span>
                      </td>
                      <td className="py-3 font-mono">
                        <span className={`text-xs font-bold ${
                          v.safeExitMarginMinutes < 0 ? 'text-red-400' :
                          v.safeExitMarginMinutes <= 30 ? 'text-amber-400' : 'text-emerald-400'
                        }`}>
                          {v.safeExitMarginMinutes >= 0 ? `+${v.safeExitMarginMinutes}m` : `${v.safeExitMarginMinutes}m (Closed)`}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        {v.rerouteRecommended && !v.rerouteAccepted ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              rerouteVehicle(v.id);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[10px] shadow-sm animate-pulse"
                          >
                            Divert
                          </button>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedVehicleId(v.id);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px]"
                          >
                            Details
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Vehicle Deep Telemetry & Safe Exit Window Inspector (1 Col) */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-xl space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400">Carrier Telemetry</span>
                <h3 className="text-lg font-black text-white">{selectedVehicle.id}</h3>
              </div>
              <span className="px-2 py-1 rounded bg-slate-950 font-mono text-cyan-400 text-xs border border-slate-800">
                {selectedVehicle.plateNumber}
              </span>
            </div>

            {/* Simulated Urgent Warning Alert Card */}
            {selectedVehicle.riskExposure === 'critical' && (
              <div className="p-3.5 rounded-xl bg-red-950/70 border border-red-500/60 text-xs space-y-1 text-red-200">
                <div className="flex items-center gap-1.5 font-bold text-red-400 uppercase tracking-wider text-[11px]">
                  <AlertTriangle className="w-4 h-4 animate-pulse" />
                  Urgent Proximity Hazard Warning
                </div>
                <p className="text-[11px] leading-relaxed">
                  Vehicle <strong className="text-white">{selectedVehicle.id}</strong> is approaching high-risk landslide zone at Sonapur Tunnel (NH-06). Distance: <strong className="text-white">{selectedVehicle.distanceToRiskKm} km</strong>. Recommended action: Divert via Route B.
                </p>
              </div>
            )}

            {/* Safe Exit Window Card */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-400" />
                  Safe Exit Window Status
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  selectedVehicle.safeExitStatus === 'safe_to_cross' ? 'bg-emerald-500/20 text-emerald-400' :
                  selectedVehicle.safeExitStatus === 'proceed_with_caution' ? 'bg-amber-500/20 text-amber-400' : 'bg-red-500/20 text-red-400'
                }`}>
                  {selectedVehicle.safeExitStatus.replace(/_/g, ' ').toUpperCase()}
                </span>
              </div>

              <div className="flex items-baseline justify-between">
                <span className="text-slate-400 text-xs">Clearance Window Margin:</span>
                <span className={`text-2xl font-black font-mono ${
                  selectedVehicle.safeExitMarginMinutes >= 0 ? 'text-emerald-400' : 'text-red-400'
                }`}>
                  {selectedVehicle.safeExitMarginMinutes >= 0 ? `${selectedVehicle.safeExitMarginMinutes} mins remaining` : 'Window Closed'}
                </span>
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed">
                Calculates if vehicle at current velocity ({selectedVehicle.speedKmH} km/h) can traverse the {selectedVehicle.distanceToRiskKm} km gorge sector before projected debris accumulation breach.
              </p>
            </div>

            {/* Telemetry Metrics */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Driver Name</span>
                <span className="font-bold text-white text-xs">{selectedVehicle.driverName}</span>
                <span className="text-[10px] text-slate-500 block">{selectedVehicle.driverPhone}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Cargo Manifest</span>
                <span className="font-bold text-amber-300 text-xs">{selectedVehicle.cargoType}</span>
                <span className="text-[10px] text-slate-500 block">{selectedVehicle.cargoWeightTons} Tons Payload</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Speed & Bearing</span>
                <span className="font-bold text-cyan-400 text-xs">{selectedVehicle.speedKmH} km/h</span>
                <span className="text-[10px] text-slate-500 block">Heading {selectedVehicle.heading}° NE</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Current ETA</span>
                <span className="font-bold text-white text-xs">{selectedVehicle.etaDestination}</span>
                <span className="text-[10px] text-slate-500 block">To {selectedVehicle.destination}</span>
              </div>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="pt-3 border-t border-slate-800 space-y-2">
            {selectedVehicle.rerouteRecommended && !selectedVehicle.rerouteAccepted ? (
              <button
                onClick={() => rerouteVehicle(selectedVehicle.id)}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:brightness-110 text-white font-extrabold text-xs shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Navigation className="w-4 h-4" />
                <span>Transmit Safe Reroute to Cab</span>
              </button>
            ) : (
              <button
                onClick={() => setActiveTab('driver_hud')}
                className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2"
              >
                <span>View in Driver In-Cab HUD</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={() => setActiveTab('map')}
              className="w-full py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs border border-slate-700 transition-colors"
            >
              Track on GIS Map
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
