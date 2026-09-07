import React from 'react';
import { 
  RoadSegment, 
  Vehicle, 
  IncidentReport 
} from '../types';
import { useRoadPulse } from '../context/RoadPulseContext';
import { 
  ShieldCheck, 
  AlertTriangle, 
  AlertOctagon, 
  Truck, 
  CheckCircle2, 
  Bell, 
  Activity, 
  Layers, 
  ArrowRight, 
  MapPin, 
  CloudRain, 
  Gauge, 
  FileText,
  Navigation,
  Compass
} from 'lucide-react';
import { InteractiveMap } from './InteractiveMap';

export const DashboardView: React.FC = () => {
  const { 
    roadSegments, 
    vehicles, 
    incidentReports, 
    hazardPredictions, 
    alerts, 
    setActiveTab, 
    setSelectedSegmentId,
    startScenario,
    isScenarioRunning
  } = useRoadPulse();

  // Metrics computation
  const totalSegments = roadSegments.length;
  const totalKm = roadSegments.reduce((acc, s) => acc + s.lengthKm, 0);
  const accessibleRoads = roadSegments.filter(s => s.accessibilityScore >= 70).length;
  const moderateRiskRoads = roadSegments.filter(s => s.accessibilityScore >= 40 && s.accessibilityScore < 70).length;
  const highRiskRoads = roadSegments.filter(s => s.accessibilityScore < 40).length;
  
  const pendingReports = incidentReports.filter(r => r.status === 'pending_verification');
  const criticalIncidents = incidentReports.filter(r => r.status === 'verified' && (r.severity === 'critical' || r.severity === 'high'));
  const affectedVehicles = vehicles.filter(v => v.rerouteRecommended || v.riskExposure === 'critical' || v.riskExposure === 'high');
  const unreadAlerts = alerts.filter(a => !a.acknowledged);

  return (
    <div className="p-4 space-y-5 max-w-7xl mx-auto text-slate-100">
      {/* Top Banner / SIH Overview Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/70 to-slate-900 rounded-2xl p-5 border border-indigo-500/20 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-cyan-300 border border-blue-500/30 text-xs font-bold">
              Command & Logistics Control Center
            </span>
            <span className="text-xs text-slate-400">North Eastern Region (NER)</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            RoadPulse Integrated Operational Overview
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-3xl">
            Unified multi-hazard forecasting, ground truth verification, and risk-aware freight routing across strategic northeastern highway corridors.
          </p>
        </div>

        {!isScenarioRunning && (
          <button
            onClick={startScenario}
            className="shrink-0 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:brightness-110 text-white font-bold text-xs shadow-lg shadow-orange-500/20 flex items-center gap-2 transition-all"
          >
            <span>Launch End-to-End Walkthrough</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Primary KPI Grid (8 Cards as requested) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {/* 1. Total Monitored */}
        <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-[11px] mb-1">
            <span>Monitored</span>
            <Layers className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div className="text-xl font-black text-white">{totalSegments}</div>
          <p className="text-[10px] text-slate-400 mt-0.5">{totalKm} km corridors</p>
        </div>

        {/* 2. Accessible Roads */}
        <div className="bg-slate-900/80 border border-emerald-900/40 p-3 rounded-xl shadow-sm">
          <div className="flex items-center justify-between text-emerald-400 text-[11px] mb-1">
            <span>Accessible</span>
            <ShieldCheck className="w-3.5 h-3.5" />
          </div>
          <div className="text-xl font-black text-emerald-400">{accessibleRoads}</div>
          <p className="text-[10px] text-slate-400 mt-0.5">Score 70–100</p>
        </div>

        {/* 3. Moderate Risk */}
        <div className="bg-slate-900/80 border border-amber-900/40 p-3 rounded-xl shadow-sm">
          <div className="flex items-center justify-between text-amber-400 text-[11px] mb-1">
            <span>Caution</span>
            <AlertTriangle className="w-3.5 h-3.5" />
          </div>
          <div className="text-xl font-black text-amber-400">{moderateRiskRoads}</div>
          <p className="text-[10px] text-slate-400 mt-0.5">Score 40–69</p>
        </div>

        {/* 4. High-Risk Roads */}
        <div className="bg-slate-900/80 border border-red-900/40 p-3 rounded-xl shadow-sm">
          <div className="flex items-center justify-between text-red-400 text-[11px] mb-1">
            <span>High Risk</span>
            <AlertOctagon className="w-3.5 h-3.5" />
          </div>
          <div className="text-xl font-black text-red-400">{highRiskRoads}</div>
          <p className="text-[10px] text-slate-400 mt-0.5">Score &lt; 40</p>
        </div>

        {/* 5. Critical Incidents */}
        <div 
          onClick={() => setActiveTab('map')}
          className="bg-slate-900/80 border border-rose-900/40 p-3 rounded-xl shadow-sm cursor-pointer hover:bg-slate-800/80 transition-colors"
        >
          <div className="flex items-center justify-between text-rose-400 text-[11px] mb-1">
            <span>Verified Incidents</span>
            <Activity className="w-3.5 h-3.5" />
          </div>
          <div className="text-xl font-black text-rose-400">{criticalIncidents.length}</div>
          <p className="text-[10px] text-slate-400 mt-0.5">Confirmed Ground</p>
        </div>

        {/* 6. Affected Vehicles */}
        <div 
          onClick={() => setActiveTab('vehicles')}
          className="bg-slate-900/80 border border-orange-900/40 p-3 rounded-xl shadow-sm cursor-pointer hover:bg-slate-800/80 transition-colors"
        >
          <div className="flex items-center justify-between text-orange-400 text-[11px] mb-1">
            <span>Affected Fleet</span>
            <Truck className="w-3.5 h-3.5" />
          </div>
          <div className="text-xl font-black text-orange-400">{affectedVehicles.length}</div>
          <p className="text-[10px] text-slate-400 mt-0.5">Needs Safe Action</p>
        </div>

        {/* 7. Pending Verification */}
        <div 
          onClick={() => setActiveTab('verification')}
          className="bg-slate-900/80 border border-indigo-900/40 p-3 rounded-xl shadow-sm cursor-pointer hover:bg-slate-800/80 transition-colors"
        >
          <div className="flex items-center justify-between text-indigo-400 text-[11px] mb-1">
            <span>Pending Review</span>
            <CheckCircle2 className="w-3.5 h-3.5" />
          </div>
          <div className="text-xl font-black text-indigo-300">{pendingReports.length}</div>
          <p className="text-[10px] text-slate-400 mt-0.5">Awaiting Fusion</p>
        </div>

        {/* 8. Active Alerts */}
        <div 
          onClick={() => setActiveTab('alerts')}
          className="bg-slate-900/80 border border-red-900/40 p-3 rounded-xl shadow-sm cursor-pointer hover:bg-slate-800/80 transition-colors"
        >
          <div className="flex items-center justify-between text-red-400 text-[11px] mb-1">
            <span>Active Alerts</span>
            <Bell className="w-3.5 h-3.5" />
          </div>
          <div className="text-xl font-black text-red-400">{unreadAlerts.length}</div>
          <p className="text-[10px] text-slate-400 mt-0.5">Unacknowledged</p>
        </div>
      </div>

      {/* Main Content Area: Map + Tactical Right Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Large Map Panel (2 Cols) */}
        <div className="lg:col-span-2 bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl flex flex-col h-[520px]">
          <div className="p-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <h3 className="font-bold text-xs text-white uppercase tracking-wider">
                Live Regional Road Accessibility Map
              </h3>
            </div>
            <button
              onClick={() => setActiveTab('map')}
              className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold"
            >
              <span>Full Screen GIS</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="flex-1 w-full relative">
            <InteractiveMap />
          </div>
        </div>

        {/* Critical Alerts & Fleet Exposure Panel (1 Col) */}
        <div className="space-y-4">
          {/* Urgent Dispatch Card */}
          <div className="bg-slate-900 rounded-2xl border border-red-900/40 p-4 shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-3">
              <h3 className="font-bold text-xs text-red-400 flex items-center gap-1.5 uppercase tracking-wider">
                <AlertOctagon className="w-4 h-4 text-red-500 animate-pulse" />
                Active Urgent Disruption
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-800">
                CRITICAL
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="font-bold text-white text-sm">
                NH-06 Sonapur Tunnel Landslide
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Dynamic Accessibility Score plummeted to <strong className="text-red-400">28/100</strong>. 75% mudslide carriageway blockage confirmed by ground patrol.
              </p>

              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 space-y-1.5 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-400">Affected Vehicles:</span>
                  <span className="text-red-400 font-bold">2 Carriers (TRK-108, TRK-402)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Safe Exit Status:</span>
                  <span className="text-amber-300 font-semibold">TRK-108 Window Closed (-25m)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Recommended Action:</span>
                  <span className="text-cyan-400 font-semibold">Reroute via Haflong Bypass</span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setActiveTab('routes')}
                  className="flex-1 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1"
                >
                  <span>Dispatch Reroute</span>
                  <Navigation className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setActiveTab('safe_exit')}
                  className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-colors"
                >
                  Safe Exit
                </button>
              </div>
            </div>
          </div>

          {/* AI Hazard Predictions Preview */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4 shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-3">
              <h3 className="font-bold text-xs text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-cyan-400" />
                AI Hazard Early Warning
              </h3>
              <button
                onClick={() => setActiveTab('prediction')}
                className="text-[11px] text-cyan-400 hover:underline"
              >
                Model Details
              </button>
            </div>

            <div className="space-y-2.5">
              {hazardPredictions.slice(0, 2).map((pred) => (
                <div 
                  key={pred.id}
                  onClick={() => {
                    setSelectedSegmentId(pred.corridorId);
                    setActiveTab('prediction');
                  }}
                  className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-indigo-500/40 cursor-pointer transition-all text-xs"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-white text-[11px]">{pred.roadName}</span>
                    <span className="px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 font-extrabold text-[10px]">
                      {pred.disruptionProbability}% Risk
                    </span>
                  </div>
                  <p className="text-slate-400 text-[10px] truncate">{pred.hazardType}</p>
                  <div className="mt-1 flex items-center justify-between text-[10px] text-slate-500">
                    <span>Window: {pred.expectedRiskWindow}</span>
                    <span className="text-cyan-400 font-semibold">Confidence: {pred.predictionConfidence}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Intelligence Grid: Analytics & Corridor Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Monitored Corridors Real-Time Status */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4 shadow-xl">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-3">
            <h3 className="font-bold text-xs text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Gauge className="w-4 h-4 text-emerald-400" />
              Corridor Accessibility Index
            </h3>
            <button
              onClick={() => setActiveTab('score')}
              className="text-[11px] text-cyan-400 hover:underline"
            >
              Formula Breakdown
            </button>
          </div>

          <div className="space-y-2">
            {roadSegments.map((seg) => (
              <div
                key={seg.id}
                onClick={() => {
                  setSelectedSegmentId(seg.id);
                  setActiveTab('score');
                }}
                className="p-2 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:bg-slate-800/40 cursor-pointer transition-colors text-xs flex items-center justify-between"
              >
                <div className="truncate max-w-[200px]">
                  <div className="font-bold text-white text-[11px] truncate">{seg.corridorCode}: {seg.name}</div>
                  <div className="text-[10px] text-slate-400 flex items-center gap-2">
                    <span>{seg.lengthKm} km</span>
                    <span>•</span>
                    <span className="text-blue-300">{seg.weatherImpact.rainfallMmPerHour} mm/h rain</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <span className={`text-sm font-black ${
                      seg.accessibilityScore >= 70 ? 'text-emerald-400' :
                      seg.accessibilityScore >= 40 ? 'text-amber-400' : 'text-red-400'
                    }`}>
                      {seg.accessibilityScore}
                    </span>
                    <span className="text-[9px] text-slate-500 block">/100</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ground Incident Reports Queue */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4 shadow-xl">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-3">
            <h3 className="font-bold text-xs text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-amber-400" />
              Recent Ground Incident Feed
            </h3>
            <button
              onClick={() => setActiveTab('verification')}
              className="text-[11px] text-cyan-400 hover:underline"
            >
              Verify ({pendingReports.length})
            </button>
          </div>

          <div className="space-y-2.5">
            {incidentReports.slice(0, 3).map((rep) => (
              <div
                key={rep.id}
                onClick={() => setActiveTab('verification')}
                className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 cursor-pointer transition-all text-xs"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded ${
                    rep.status === 'verified' ? 'bg-red-500/20 text-red-400' :
                    rep.status === 'pending_verification' ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {rep.status.replace(/_/g, ' ')}
                  </span>
                  <span className="text-[10px] text-slate-500">{rep.timestamp}</span>
                </div>
                <div className="font-bold text-white text-[11px]">{rep.incidentType.toUpperCase()} on {rep.corridorName}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  Reported by {rep.reporterName} • Blockage: <strong className="text-slate-300">{rep.blockagePercent}%</strong>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Analytical Insights */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-3">
              <h3 className="font-bold text-xs text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-indigo-400" />
                Operational Impact & Insights
              </h3>
              <button
                onClick={() => setActiveTab('analytics')}
                className="text-[11px] text-cyan-400 hover:underline"
              >
                Analytics
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-2.5 rounded-xl bg-indigo-950/30 border border-indigo-500/20">
                <div className="text-[10px] uppercase font-bold text-indigo-300">Continuous Learning Benefit</div>
                <p className="text-slate-300 text-[11px] mt-1 leading-relaxed">
                  Ground-truth incident fusion has boosted regional prediction accuracy to <strong className="text-emerald-400">88.7%</strong>, eliminating 63% of false diversion costs.
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="text-[10px] uppercase font-bold text-slate-400">Disruption Prevention Metric</div>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="text-xl font-extrabold text-cyan-400">14 Carriers</span>
                  <span className="text-[10px] text-emerald-400 font-semibold">Saved from entrapment</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">Average route diversion saved 11.4 hours of stranding time.</p>
              </div>
            </div>
          </div>

          <div className="pt-3">
            <button
              onClick={() => setActiveTab('learning')}
              className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Inspect Continuous Learning Feedback</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
