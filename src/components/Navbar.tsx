import React from 'react';
import { 
  Activity, 
  Wifi, 
  WifiOff, 
  Bell, 
  Play, 
  RotateCcw, 
  ShieldAlert, 
  Truck, 
  Compass, 
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { useRoadPulse } from '../context/RoadPulseContext';
import { UserRole } from '../types';

export const Navbar: React.FC = () => {
  const { 
    userRole, 
    setUserRole, 
    isOnline, 
    toggleConnectivity, 
    offlineQueue, 
    isSyncing, 
    syncOfflineReports,
    alerts,
    setActiveTab,
    isScenarioRunning,
    startScenario,
    resetScenario,
    scenarioStep
  } = useRoadPulse();

  const unacknowledgedAlerts = alerts.filter(a => !a.acknowledged);

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-slate-100 px-4 py-2.5 flex items-center justify-between sticky top-0 z-50 shadow-md">
      {/* Brand & SIH Badge */}
      <div className="flex items-center gap-3">
        <div 
          onClick={() => setActiveTab('dashboard')}
          className="cursor-pointer flex items-center gap-2.5 hover:opacity-90 transition-opacity"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20 text-white font-bold">
            <Activity className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight text-white bg-gradient-to-r from-white via-slate-100 to-cyan-200 bg-clip-text">
                RoadPulse
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                SIH26002
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              NER AI Logistics & Road Accessibility Intelligence Platform <span className="text-slate-500">| Team Nexus</span>
            </p>
          </div>
        </div>
      </div>

      {/* Role Switcher & Scenario Trigger */}
      <div className="flex items-center gap-3">
        {/* SIH 26002 End-to-End Scenario Walkthrough Button */}
        <div className="hidden lg:flex items-center bg-slate-800/80 rounded-lg p-1 border border-slate-700">
          {!isScenarioRunning ? (
            <button
              onClick={startScenario}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-gradient-to-r from-amber-500 to-orange-600 text-white text-xs font-semibold shadow-md hover:brightness-110 transition-all"
              title="Launch step-by-step interactive demonstration of the complete 16-step SIH workflow"
            >
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
              <span>SIH End-to-End Demo</span>
            </button>
          ) : (
            <div className="flex items-center gap-2 px-2 py-1">
              <span className="inline-flex items-center gap-1 text-xs text-amber-400 font-bold animate-pulse">
                <Play className="w-3 h-3 fill-amber-400" />
                Step {scenarioStep}/16
              </span>
              <button
                onClick={resetScenario}
                className="p-1 rounded hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                title="Reset Demonstration"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Role Selector Tabs */}
        <div className="flex items-center bg-slate-950/70 p-1 rounded-xl border border-slate-800 text-xs">
          <span className="text-[10px] font-semibold text-slate-500 px-2 uppercase tracking-wider hidden sm:inline">Role:</span>
          
          <button
            onClick={() => {
              setUserRole('command_center');
              setActiveTab('dashboard');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
              userRole === 'command_center'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Command Center</span>
            <span className="md:hidden">HQ</span>
          </button>

          <button
            onClick={() => {
              setUserRole('field_officer');
              setActiveTab('report');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
              userRole === 'field_officer'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Field Officer</span>
            <span className="md:hidden">Officer</span>
          </button>

          <button
            onClick={() => {
              setUserRole('driver');
              setActiveTab('driver_hud');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
              userRole === 'driver'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Driver HUD</span>
            <span className="md:hidden">Driver</span>
          </button>
        </div>

        {/* Connectivity Mode Switcher (Online / Offline First Simulation) */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={toggleConnectivity}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              isOnline
                ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/80 hover:bg-emerald-900/60'
                : 'bg-amber-950/80 text-amber-300 border-amber-700 hover:bg-amber-900/80 ring-2 ring-amber-500/30'
            }`}
            title="Toggle Network Connectivity (Online vs Offline First Simulation)"
          >
            {isOnline ? (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">ONLINE</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-bold">OFFLINE MODE</span>
              </>
            )}
          </button>

          {/* Sync Trigger for Offline Queue */}
          {offlineQueue.length > 0 && (
            <button
              onClick={() => {
                if (isOnline) {
                  syncOfflineReports();
                } else {
                  toggleConnectivity();
                }
              }}
              disabled={isSyncing}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md transition-all animate-bounce"
              title="Click to switch online and sync cached offline field reports"
            >
              <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>Sync ({offlineQueue.length})</span>
            </button>
          )}
        </div>

        {/* Alerts Center Bell */}
        <button
          onClick={() => setActiveTab('alerts')}
          className="relative p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/80 transition-colors"
          title="View Alerts Center"
        >
          <Bell className="w-4 h-4" />
          {unacknowledgedAlerts.length > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center border-2 border-slate-900">
              {unacknowledgedAlerts.length}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};
