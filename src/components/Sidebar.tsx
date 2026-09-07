import React from 'react';
import { 
  LayoutDashboard, 
  Map, 
  AlertTriangle, 
  FileText, 
  CheckCircle2, 
  Gauge, 
  Navigation, 
  Clock, 
  Truck, 
  Bell, 
  BarChart3, 
  CloudOff, 
  BrainCircuit, 
  Compass,
  ChevronRight,
  Shield
} from 'lucide-react';
import { useRoadPulse, ActiveTab } from '../context/RoadPulseContext';

interface NavItem {
  id: ActiveTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number | string;
  badgeColor?: string;
  workflowStep?: string;
}

export const Sidebar: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    incidentReports, 
    vehicles, 
    alerts, 
    offlineQueue,
    isScenarioRunning,
    scenarioStep
  } = useRoadPulse();

  const pendingReportsCount = incidentReports.filter(r => r.status === 'pending_verification').length;
  const criticalAlertsCount = alerts.filter(a => a.priority === 'critical' && !a.acknowledged).length;
  const affectedVehiclesCount = vehicles.filter(v => v.rerouteRecommended || v.riskExposure === 'critical' || v.riskExposure === 'high').length;

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Overview Dashboard', icon: LayoutDashboard },
    { id: 'map', label: 'Live Road Map', icon: Map, workflowStep: 'MONITOR' },
    { id: 'prediction', label: 'AI Hazard Prediction', icon: AlertTriangle, workflowStep: 'PREDICT' },
    { id: 'report', label: 'Incident Reporting', icon: FileText, workflowStep: 'REPORT' },
    { 
      id: 'verification', 
      label: 'Verification Center', 
      icon: CheckCircle2, 
      badge: pendingReportsCount > 0 ? pendingReportsCount : undefined,
      badgeColor: 'bg-amber-500 text-slate-950 font-bold',
      workflowStep: 'VERIFY' 
    },
    { id: 'score', label: 'Dynamic Road Score', icon: Gauge, workflowStep: 'UPDATE' },
    { id: 'routes', label: 'Route Intelligence', icon: Navigation, workflowStep: 'REROUTE' },
    { id: 'safe_exit', label: 'Safe Exit Window', icon: Clock },
    { 
      id: 'vehicles', 
      label: 'Vehicle Tracking', 
      icon: Truck,
      badge: affectedVehiclesCount > 0 ? `${affectedVehiclesCount} Risk` : undefined,
      badgeColor: 'bg-red-500/20 text-red-400 border border-red-500/30'
    },
    { 
      id: 'alerts', 
      label: 'Alerts Center', 
      icon: Bell,
      badge: criticalAlertsCount > 0 ? criticalAlertsCount : undefined,
      badgeColor: 'bg-red-600 text-white font-bold animate-pulse',
      workflowStep: 'ALERT'
    },
    { id: 'analytics', label: 'Analytics & Insights', icon: BarChart3 },
    { 
      id: 'offline_sync', 
      label: 'Offline Sync Queue', 
      icon: CloudOff,
      badge: offlineQueue.length > 0 ? `${offlineQueue.length} Queued` : undefined,
      badgeColor: 'bg-amber-500 text-slate-950 font-bold'
    },
    { id: 'learning', label: 'Continuous Learning', icon: BrainCircuit, workflowStep: 'LEARN' },
    { id: 'driver_hud', label: 'Driver Cab HUD', icon: Compass },
  ];

  return (
    <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col shrink-0 h-[calc(100vh-57px)] sticky top-[57px] text-slate-300 select-none">
      {/* Workflow Pill Header */}
      <div className="p-3 border-b border-slate-800/80 bg-slate-900/40">
        <div className="flex items-center justify-between text-[10px] font-bold tracking-wider text-slate-400 uppercase mb-1.5">
          <span className="flex items-center gap-1">
            <Shield className="w-3 h-3 text-blue-400" />
            Core Decision Flow
          </span>
          <span className="text-cyan-400 font-mono">7-STAGE</span>
        </div>
        <div className="grid grid-cols-4 gap-1 text-[9px] font-bold text-center">
          <span className="bg-slate-800/80 text-blue-300 py-0.5 rounded">PREDICT</span>
          <span className="bg-slate-800/80 text-emerald-300 py-0.5 rounded">REPORT</span>
          <span className="bg-slate-800/80 text-amber-300 py-0.5 rounded">VERIFY</span>
          <span className="bg-slate-800/80 text-cyan-300 py-0.5 rounded">UPDATE</span>
        </div>
        <div className="grid grid-cols-3 gap-1 text-[9px] font-bold text-center mt-1">
          <span className="bg-slate-800/80 text-indigo-300 py-0.5 rounded">REROUTE</span>
          <span className="bg-slate-800/80 text-rose-300 py-0.5 rounded">ALERT</span>
          <span className="bg-slate-800/80 text-purple-300 py-0.5 rounded">LEARN</span>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all group ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 font-semibold'
                  : 'hover:bg-slate-800/60 text-slate-400 hover:text-slate-100'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <Icon className={`w-4 h-4 shrink-0 transition-colors ${
                  isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'
                }`} />
                <span className="truncate">{item.label}</span>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {item.workflowStep && !isActive && (
                  <span className="text-[8px] uppercase tracking-widest text-slate-500 font-mono hidden xl:inline">
                    {item.workflowStep}
                  </span>
                )}
                {item.badge !== undefined && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${item.badgeColor || 'bg-slate-700 text-slate-200'}`}>
                    {item.badge}
                  </span>
                )}
                {isActive && <ChevronRight className="w-3 h-3 text-blue-200" />}
              </div>
            </button>
          );
        })}
      </nav>

      {/* Scenario Walkthrough Indicator Footer */}
      {isScenarioRunning && (
        <div className="p-3 mx-2 mb-2 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 text-amber-300 text-xs">
          <div className="flex items-center justify-between font-bold mb-1">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              Demo In Progress
            </span>
            <span className="font-mono">{scenarioStep}/16</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-amber-400 h-full transition-all duration-300" 
              style={{ width: `${(scenarioStep / 16) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Bottom Telemetry Status */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-900/30 text-[11px] text-slate-400 flex items-center justify-between">
        <div>
          <p className="font-semibold text-slate-300">NER Grid Sync</p>
          <p className="text-[10px] text-slate-500">6 Corridors Active</p>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="text-[10px] font-mono text-emerald-400">99.8%</span>
        </div>
      </div>
    </aside>
  );
};
