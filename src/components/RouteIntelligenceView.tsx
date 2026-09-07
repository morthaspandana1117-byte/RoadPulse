import React, { useState } from 'react';
import { useRoadPulse } from '../context/RoadPulseContext';
import { RouteOption } from '../types';
import { 
  Navigation, 
  ShieldCheck, 
  Zap, 
  Scale, 
  AlertTriangle, 
  Clock, 
  Milestone, 
  CheckCircle2, 
  RotateCcw, 
  ArrowRight,
  Truck,
  Sparkles,
  ExternalLink
} from 'lucide-react';

export const RouteIntelligenceView: React.FC = () => {
  const { 
    routes, 
    selectedRouteId, 
    setSelectedRouteId, 
    vehicles, 
    rerouteVehicle,
    setActiveTab,
    roadSegments
  } = useRoadPulse();

  const [startCity, setStartCity] = useState('Guwahati');
  const [destinationCity, setDestinationCity] = useState('Silchar');
  const [selectedVehicleId, setSelectedVehicleId] = useState('TRK-108');

  // Check if NH-06 Sonapur is critical (from scenario or verified report)
  const nh06Segment = roadSegments.find(s => s.id === 'seg-nh6-ratacherra');
  const isCorridorBlocked = (nh06Segment?.accessibilityScore || 72) < 40;

  const targetVehicle = vehicles.find(v => v.id === selectedVehicleId) || vehicles[0];

  const getRouteIcon = (type: string) => {
    if (type === 'safe') return ShieldCheck;
    if (type === 'fast') return Zap;
    return Scale;
  };

  return (
    <div className="p-4 space-y-6 max-w-7xl mx-auto text-slate-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 rounded-2xl p-5 border border-indigo-500/20 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-cyan-300 border border-blue-500/30 text-xs font-bold flex items-center gap-1.5">
              <Navigation className="w-3.5 h-3.5" />
              Dynamic Route Engine
            </span>
            <span className="text-xs text-slate-400">STAGE 5: REROUTE</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Risk-Aware Multi-Criteria Route Intelligence
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-3xl">
            Calculates Pareto-optimal transit corridors balancing distance, travel duration, and terrain hazard exposure. Automatically triggers dynamic diversion when ground disruptions are verified.
          </p>
        </div>

        {/* Route Selector Controls */}
        <div className="flex flex-wrap items-center gap-2 bg-slate-950 p-2 rounded-xl border border-slate-800 text-xs">
          <div className="flex items-center gap-1">
            <span className="text-slate-400 text-[10px] uppercase font-bold">From:</span>
            <select
              value={startCity}
              onChange={(e) => setStartCity(e.target.value)}
              className="bg-slate-900 text-white font-bold px-2 py-1 rounded border border-slate-700"
            >
              <option value="Guwahati">Guwahati (Logistics Hub)</option>
              <option value="Dimapur">Dimapur (Railway Terminal)</option>
              <option value="Tezpur">Tezpur (Northern Depot)</option>
            </select>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-slate-400 text-[10px] uppercase font-bold">To:</span>
            <select
              value={destinationCity}
              onChange={(e) => setDestinationCity(e.target.value)}
              className="bg-slate-900 text-white font-bold px-2 py-1 rounded border border-slate-700"
            >
              <option value="Silchar">Silchar (Barak Valley)</option>
              <option value="Kohima">Kohima (Nagaland Central)</option>
              <option value="North Lakhimpur">North Lakhimpur</option>
            </select>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-slate-400 text-[10px] uppercase font-bold">Vehicle:</span>
            <select
              value={selectedVehicleId}
              onChange={(e) => setSelectedVehicleId(e.target.value)}
              className="bg-slate-900 text-white font-bold px-2 py-1 rounded border border-slate-700"
            >
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.id} ({v.cargoType.slice(0, 18)}...)
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Disruption Alert & Auto-Reroute Callout Banner */}
      {isCorridorBlocked && (
        <div className="bg-gradient-to-r from-red-950/90 via-slate-900 to-amber-950/80 border-2 border-red-500/80 rounded-2xl p-5 shadow-2xl animate-in fade-in duration-300">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-red-500 text-slate-950 font-black text-[10px] tracking-wider uppercase">
                    REROUTE RECOMMENDATION ACTIVE
                  </span>
                  <span className="text-xs font-mono text-slate-300">Corridor NH-06 Blocked</span>
                </div>
                <h3 className="text-base font-bold text-white mt-1">
                  Current Route Affected by Verified Landslide at Sonapur (Score: 28/100)
                </h3>
                <p className="text-xs text-slate-300 mt-0.5 max-w-2xl leading-relaxed">
                  Vehicle <strong className="text-white">{targetVehicle.id}</strong> ({targetVehicle.cargoType}) is approaching the high-hazard zone with negative clearance margin. System recommends immediate diversion via NH-27 Lumding–Haflong bypass.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => rerouteVehicle(targetVehicle.id)}
                disabled={targetVehicle.rerouteAccepted}
                className={`px-5 py-2.5 rounded-xl font-extrabold text-xs shadow-xl transition-all flex items-center gap-2 ${
                  targetVehicle.rerouteAccepted
                    ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 cursor-default'
                    : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:brightness-110 text-white animate-bounce'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{targetVehicle.rerouteAccepted ? 'Reroute Dispatched to Cab HUD' : 'Reroute Vehicle to Safe Route'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3 Routes Comparison Grid (Safe vs Fast vs Balanced) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {routes.map((route) => {
          const isSelected = route.id === selectedRouteId;
          const Icon = getRouteIcon(route.type);

          return (
            <div
              key={route.id}
              onClick={() => setSelectedRouteId(route.id)}
              className={`rounded-2xl border transition-all cursor-pointer p-5 flex flex-col justify-between relative shadow-xl ${
                route.isRecommended
                  ? 'bg-gradient-to-b from-slate-900 to-indigo-950/80 border-cyan-500 ring-2 ring-cyan-500/40'
                  : route.riskLevel === 'critical'
                  ? 'bg-slate-900 border-red-900/60 opacity-90'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Badge */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    route.type === 'safe' ? 'bg-emerald-500/20 text-emerald-400' :
                    route.type === 'fast' ? 'bg-amber-500/20 text-amber-400' : 'bg-cyan-500/20 text-cyan-400'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                      {route.type.toUpperCase()} ROUTE
                    </span>
                    <h4 className="font-extrabold text-sm text-white">{route.type.toUpperCase()} OPTION</h4>
                  </div>
                </div>

                {route.isRecommended && (
                  <span className="px-2 py-0.5 rounded-full bg-cyan-500 text-slate-950 font-black text-[10px] tracking-wider uppercase flex items-center gap-1">
                    <Sparkles className="w-3 h-3 fill-slate-950" />
                    RECOMMENDED
                  </span>
                )}
              </div>

              {/* Core Metrics */}
              <div className="space-y-3 flex-1">
                <div>
                  <h5 className="font-bold text-white text-xs leading-snug">{route.name}</h5>
                  <p className="text-[11px] text-slate-400 mt-1">{route.startCity} ➔ {route.destinationCity}</p>
                </div>

                {/* Score & ETA Grid */}
                <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-center">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Distance</span>
                    <span className="font-bold text-white text-xs">{route.distanceKm} km</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Travel Time</span>
                    <span className="font-bold text-cyan-400 text-xs">{route.travelTimeHours} hrs</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Avg Score</span>
                    <span className={`font-black text-xs ${
                      route.avgAccessibilityScore >= 70 ? 'text-emerald-400' :
                      route.avgAccessibilityScore >= 40 ? 'text-amber-400' : 'text-red-400'
                    }`}>
                      {route.avgAccessibilityScore}/100
                    </span>
                  </div>
                </div>

                {/* Recommendation Reason */}
                <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800/80 text-xs text-slate-300">
                  <span className="text-[10px] font-bold text-slate-400 block mb-1 uppercase">Reasoning Formulation:</span>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {route.recommendationReason}
                  </p>
                </div>

                {/* Active Hazards */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Hazards on Stretch:</span>
                  {route.activeHazards.map((h, i) => (
                    <div key={i} className="text-[10px] text-slate-400 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Bottom */}
              <div className="pt-4 mt-3 border-t border-slate-800 flex items-center justify-between">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  route.riskLevel === 'safe' ? 'bg-emerald-500/20 text-emerald-400' :
                  route.riskLevel === 'moderate' ? 'bg-amber-500/20 text-amber-400' : 'bg-red-500/20 text-red-400'
                }`}>
                  {route.riskLevel.toUpperCase()} RISK
                </span>

                <button
                  onClick={() => setSelectedRouteId(route.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 ${
                    isSelected ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <span>{isSelected ? 'Active Selection' : 'Select'}</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Route Map Preview and Navigation HUD trigger */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <Truck className="w-5 h-5 text-cyan-400" />
          <div>
            <h5 className="font-bold text-white">Driver In-Cab Integration Active</h5>
            <p className="text-slate-400 text-[11px]">Selected route telemetry is broadcast to the vehicle tablet display in real-time.</p>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('driver_hud')}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors flex items-center gap-2 shrink-0"
        >
          <span>Switch to Driver Cab HUD</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
