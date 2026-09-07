import React, { useState } from 'react';
import { useRoadPulse } from '../context/RoadPulseContext';
import { AlertItem, AlertPriority } from '../types';
import { 
  Bell, 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  MapPin, 
  Radio, 
  Clock, 
  Eye, 
  Check, 
  X, 
  Filter, 
  Navigation, 
  Truck, 
  AlertCircle, 
  Info, 
  Smartphone, 
  MessageSquare,
  Search,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export const AlertsCenterView: React.FC = () => {
  const { 
    alerts, 
    acknowledgeAlert, 
    resolveAlert,
    roadSegments, 
    setSelectedSegmentId, 
    vehicles, 
    incidentReports,
    setActiveTab 
  } = useRoadPulse();

  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'resolved' | 'unread'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedModalAlert, setSelectedModalAlert] = useState<AlertItem | null>(null);

  // Summary counts
  const criticalCount = alerts.filter(a => a.priority === 'critical' && !a.resolved).length;
  const highCount = alerts.filter(a => a.priority === 'high' && !a.resolved).length;
  const activeCount = alerts.filter(a => !a.resolved).length;
  const resolvedCount = alerts.filter(a => !!a.resolved).length;

  // Filtered alerts
  const filteredAlerts = alerts.filter(alert => {
    // Priority filter
    if (filterPriority !== 'all' && alert.priority !== filterPriority) return false;

    // Status filter
    if (filterStatus === 'active' && alert.resolved) return false;
    if (filterStatus === 'resolved' && !alert.resolved) return false;
    if (filterStatus === 'unread' && alert.acknowledged) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = alert.title.toLowerCase().includes(q);
      const matchDesc = alert.description.toLowerCase().includes(q);
      const matchLoc = alert.location.toLowerCase().includes(q);
      const matchAction = alert.recommendedAction.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchLoc && !matchAction) return false;
    }

    return true;
  });

  // Priority color config
  const getPriorityBadge = (priority: AlertPriority) => {
    switch (priority) {
      case 'critical':
        return {
          bg: 'bg-red-500/20 text-red-400 border-red-500/40',
          dot: 'bg-red-500',
          label: 'CRITICAL'
        };
      case 'high':
        return {
          bg: 'bg-orange-500/20 text-orange-400 border-orange-500/40',
          dot: 'bg-orange-500',
          label: 'HIGH'
        };
      case 'moderate':
        return {
          bg: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40',
          dot: 'bg-yellow-400',
          label: 'MEDIUM'
        };
      case 'info':
      default:
        return {
          bg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
          dot: 'bg-emerald-400',
          label: 'INFO'
        };
    }
  };

  const handleViewOnMap = (corridorId?: string) => {
    if (corridorId) {
      setSelectedSegmentId(corridorId);
    }
    setActiveTab('map');
    setSelectedModalAlert(null);
  };

  return (
    <div className="p-4 space-y-6 max-w-7xl mx-auto text-slate-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 rounded-2xl p-5 border border-indigo-500/20 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/30 text-xs font-bold flex items-center gap-1.5">
              <Bell className="w-3.5 h-3.5" />
              Multi-Channel Broadcast Engine
            </span>
            <span className="text-xs text-slate-400">STAGE 6: ALERT</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Alerts Center
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-3xl">
            Real-time transportation and logistics intelligence alerts. Multi-source early warnings, verified corridor blockages, and automated reroute dispatches.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-xl border border-slate-800 text-xs">
          <span className="text-red-400 font-bold">{criticalCount} Critical</span>
          <span className="text-slate-600">|</span>
          <span className="text-emerald-400 font-bold">{alerts.length} Total Alerts</span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Critical Alerts */}
        <div 
          onClick={() => { setFilterPriority('critical'); setFilterStatus('all'); }}
          className={`p-4 rounded-xl border transition-all cursor-pointer ${
            filterPriority === 'critical'
              ? 'bg-red-950/70 border-red-500 ring-2 ring-red-500/30'
              : 'bg-slate-900/90 border-slate-800 hover:border-red-900/60'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Critical Alerts</span>
            <div className="p-2 rounded-lg bg-red-500/20 text-red-400">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-red-400 mt-2">{criticalCount}</div>
          <p className="text-[11px] text-slate-400 mt-1">Impassable roads & severe entrapments</p>
        </div>

        {/* High Priority */}
        <div 
          onClick={() => { setFilterPriority('high'); setFilterStatus('all'); }}
          className={`p-4 rounded-xl border transition-all cursor-pointer ${
            filterPriority === 'high'
              ? 'bg-orange-950/70 border-orange-500 ring-2 ring-orange-500/30'
              : 'bg-slate-900/90 border-slate-800 hover:border-orange-900/60'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">High Priority</span>
            <div className="p-2 rounded-lg bg-orange-500/20 text-orange-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-orange-400 mt-2">{highCount}</div>
          <p className="text-[11px] text-slate-400 mt-1">Severe weather & reroute notices</p>
        </div>

        {/* Active Alerts */}
        <div 
          onClick={() => { setFilterPriority('all'); setFilterStatus('active'); }}
          className={`p-4 rounded-xl border transition-all cursor-pointer ${
            filterStatus === 'active'
              ? 'bg-cyan-950/70 border-cyan-500 ring-2 ring-cyan-500/30'
              : 'bg-slate-900/90 border-slate-800 hover:border-cyan-900/60'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Active Alerts</span>
            <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400">
              <Radio className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-cyan-400 mt-2">{activeCount}</div>
          <p className="text-[11px] text-slate-400 mt-1">Unresolved hazard events</p>
        </div>

        {/* Resolved Alerts */}
        <div 
          onClick={() => { setFilterPriority('all'); setFilterStatus('resolved'); }}
          className={`p-4 rounded-xl border transition-all cursor-pointer ${
            filterStatus === 'resolved'
              ? 'bg-emerald-950/70 border-emerald-500 ring-2 ring-emerald-500/30'
              : 'bg-slate-900/90 border-slate-800 hover:border-emerald-900/60'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Resolved Alerts</span>
            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-emerald-400 mt-2">{resolvedCount}</div>
          <p className="text-[11px] text-slate-400 mt-1">Completed clearance & cleared roads</p>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4 shadow-xl flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          {/* Priority filter */}
          <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-400 font-semibold">Priority:</span>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="bg-transparent text-white font-bold focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-slate-900 text-white">All Priorities</option>
              <option value="critical" className="bg-slate-900 text-red-400">Critical Only</option>
              <option value="high" className="bg-slate-900 text-orange-400">High Priority</option>
              <option value="moderate" className="bg-slate-900 text-yellow-400">Medium / Moderate</option>
              <option value="info" className="bg-slate-900 text-emerald-400">Info Only</option>
            </select>
          </div>

          {/* Status filter */}
          <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
            <span className="text-slate-400 font-semibold">Status:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="bg-transparent text-white font-bold focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-slate-900 text-white">All Statuses</option>
              <option value="active" className="bg-slate-900 text-cyan-400">Active Only</option>
              <option value="resolved" className="bg-slate-900 text-emerald-400">Resolved Only</option>
              <option value="unread" className="bg-slate-900 text-amber-400">Unread (Unacknowledged)</option>
            </select>
          </div>

          {(filterPriority !== 'all' || filterStatus !== 'all' || searchQuery) && (
            <button
              onClick={() => {
                setFilterPriority('all');
                setFilterStatus('all');
                setSearchQuery('');
              }}
              className="text-xs text-cyan-400 hover:text-cyan-300 underline font-semibold ml-1"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search alerts, locations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 text-xs text-white pl-9 pr-3 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Main Content Layout: Alert List + Handset Notification Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Alerts Stream (2 Columns) */}
        <div className="lg:col-span-2 space-y-3">
          {filteredAlerts.length === 0 ? (
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-8 text-center text-slate-400">
              <Bell className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="font-bold text-sm text-slate-300">No alerts match your current filter.</p>
              <p className="text-xs text-slate-500 mt-1">Try resetting the priority or status filters above.</p>
            </div>
          ) : (
            filteredAlerts.map((alert) => {
              const badge = getPriorityBadge(alert.priority);
              const matchedRoad = roadSegments.find(r => r.id === alert.corridorId);
              const matchedVehicle = vehicles.find(v => v.id === alert.vehicleId);

              return (
                <div
                  key={alert.id}
                  className={`p-4 rounded-2xl border transition-all shadow-md relative ${
                    alert.resolved
                      ? 'bg-slate-900/60 border-slate-800 opacity-80'
                      : alert.priority === 'critical'
                      ? 'bg-gradient-to-r from-red-950/40 to-slate-900 border-red-900/60 hover:border-red-600/60'
                      : alert.priority === 'high'
                      ? 'bg-gradient-to-r from-orange-950/30 to-slate-900 border-orange-900/60 hover:border-orange-600/60'
                      : alert.priority === 'moderate'
                      ? 'bg-gradient-to-r from-yellow-950/20 to-slate-900 border-yellow-900/50 hover:border-yellow-600/50'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {/* Top Header Row */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      {/* Priority Badge */}
                      <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-black border uppercase tracking-wider flex items-center gap-1.5 ${badge.bg}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                        {badge.label}
                      </span>

                      {/* Category Pill */}
                      <span className="px-2 py-0.5 rounded-md bg-slate-800 text-[10px] text-slate-300 font-mono">
                        {alert.category.replace(/_/g, ' ').toUpperCase()}
                      </span>

                      {/* Status Badges */}
                      {alert.resolved ? (
                        <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1">
                          <Check className="w-3 h-3" /> Resolved
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-bold">
                          Active
                        </span>
                      )}

                      {!alert.acknowledged && !alert.resolved && (
                        <span className="px-1.5 py-0.5 rounded bg-red-600 text-white font-bold text-[9px] uppercase tracking-wider animate-pulse">
                          Unread
                        </span>
                      )}
                    </div>

                    {/* Timestamp */}
                    <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono">
                      <Clock className="w-3 h-3" />
                      <span>{alert.timestamp}</span>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-sm font-bold text-white mb-1">
                    {alert.title}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed mb-3">
                    {alert.description}
                  </p>

                  {/* Location & Context details */}
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mb-3 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span className="text-slate-200 font-medium">{alert.location}</span>
                    </div>

                    {matchedRoad && (
                      <div className="flex items-center gap-1.5 pl-3 border-l border-slate-800">
                        <span className="text-[11px] text-slate-400">Road Score:</span>
                        <span className={`font-mono font-bold text-xs ${
                          matchedRoad.accessibilityScore < 30 ? 'text-red-400' :
                          matchedRoad.accessibilityScore < 60 ? 'text-amber-400' : 'text-emerald-400'
                        }`}>
                          {matchedRoad.accessibilityScore}/100
                        </span>
                      </div>
                    )}

                    {matchedVehicle && (
                      <div className="flex items-center gap-1.5 pl-3 border-l border-slate-800">
                        <Truck className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                        <span className="text-slate-300 font-mono text-[11px]">
                          {matchedVehicle.id} ({matchedVehicle.driverName})
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Recommended Action */}
                  <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs mb-3 flex items-start gap-2">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-amber-300 block text-[11px]">Recommended Protocol:</span>
                      <span className="text-slate-300 text-[11px] leading-relaxed">{alert.recommendedAction}</span>
                    </div>
                  </div>

                  {/* Action Buttons Toolbar */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/60">
                    <div className="flex items-center gap-2">
                      {/* Mark as Read / Acknowledge */}
                      {!alert.acknowledged ? (
                        <button
                          onClick={() => acknowledgeAlert(alert.id)}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors flex items-center gap-1.5"
                        >
                          <Check className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Mark as Read</span>
                        </button>
                      ) : (
                        <span className="text-slate-500 text-xs flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-slate-500" />
                          Read
                        </span>
                      )}

                      {/* Resolve Button */}
                      {!alert.resolved ? (
                        <button
                          onClick={() => resolveAlert(alert.id)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 text-xs font-semibold border border-emerald-800/60 transition-colors flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Resolve</span>
                        </button>
                      ) : (
                        <span className="text-emerald-500 text-xs flex items-center gap-1 font-semibold">
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          Resolved
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {/* View Details */}
                      <button
                        onClick={() => setSelectedModalAlert(alert)}
                        className="px-3 py-1 rounded-lg bg-indigo-950/60 hover:bg-indigo-900/80 text-indigo-300 text-xs font-semibold border border-indigo-800/60 transition-colors flex items-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5 text-indigo-400" />
                        <span>View Details</span>
                      </button>

                      {/* View on Map */}
                      <button
                        onClick={() => handleViewOnMap(alert.corridorId)}
                        className="px-3 py-1 rounded-lg bg-cyan-950/60 hover:bg-cyan-900/80 text-cyan-300 text-xs font-semibold border border-cyan-800/60 transition-colors flex items-center gap-1.5"
                      >
                        <Navigation className="w-3.5 h-3.5 text-cyan-400" />
                        <span>View on Map</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Handset Alert Simulator (1 Column) */}
        <div className="space-y-4">
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="font-bold text-xs text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-emerald-400" />
                Live Handset Delivery Simulator
              </h3>
              <span className="text-[10px] text-slate-500 font-mono">GSM / SMS / Cell</span>
            </div>

            {/* Mobile Device Frame */}
            <div className="w-full max-w-[300px] mx-auto bg-slate-950 rounded-[28px] border-4 border-slate-700 p-3 shadow-2xl space-y-3 relative">
              {/* Speaker notch */}
              <div className="w-16 h-2 bg-slate-800 rounded-full mx-auto mb-2" />

              {/* Simulated Cell Broadcast SMS */}
              <div className="bg-slate-900 rounded-xl p-3 border border-slate-800 space-y-2 text-xs">
                <div className="flex items-center justify-between text-[10px] text-slate-400 pb-1 border-b border-slate-800">
                  <span className="font-bold text-cyan-400">SMS: ROADPULSE-GOV</span>
                  <span>SIM 1 (BSNL NER)</span>
                </div>
                <div className="bg-slate-800/80 p-2.5 rounded-lg text-[11px] text-slate-200 leading-relaxed font-sans">
                  <p className="font-bold text-red-400 uppercase text-[10px] mb-1">
                    [URGENT {filteredAlerts[0]?.priority?.toUpperCase() || 'HAZARD'}]
                  </p>
                  {filteredAlerts[0]?.description || 'Severe road disruption alert on NH network.'}
                </div>
                <div className="text-[9px] text-slate-500 text-right">Delivered via Low-Bandwidth Gateway</div>
              </div>

              {/* Simulated WhatsApp Notification */}
              <div className="bg-emerald-950/40 rounded-xl p-3 border border-emerald-800/40 space-y-2 text-xs">
                <div className="flex items-center justify-between text-[10px] text-emerald-300 pb-1 border-b border-emerald-900/50">
                  <span className="font-bold flex items-center gap-1">
                    <MessageSquare className="w-3 h-3 text-emerald-400" />
                    WhatsApp Disaster Alert
                  </span>
                  <span>Just now</span>
                </div>
                <div className="bg-slate-900/90 p-2.5 rounded-lg text-[11px] text-slate-200 border border-emerald-700/30 leading-relaxed">
                  <div className="font-bold text-white text-xs mb-1">🚨 RoadPulse Alert Center</div>
                  <p className="text-slate-300 text-[10px]">{filteredAlerts[0]?.title || 'Alert Advisory'}</p>
                  <p className="text-slate-400 text-[10px] mt-1">{filteredAlerts[0]?.recommendedAction || 'Exercise caution.'}</p>
                  <div className="mt-2 pt-1.5 border-t border-slate-800 flex justify-end">
                    <span 
                      onClick={() => handleViewOnMap(filteredAlerts[0]?.corridorId)}
                      className="text-[10px] text-emerald-400 font-bold cursor-pointer hover:underline"
                    >
                      Tap to view detour map ➔
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 text-center">
              <span className="text-[11px] text-slate-400">
                Fallback 2G broadcast for remote North-East mountainous sectors with zero mobile data.
              </span>
            </div>
          </div>

          {/* Broadcast Workflow Guidance Card */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4 shadow-xl text-xs space-y-2">
            <h4 className="font-bold text-sm text-white flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              Dynamic Broadcast Engine (SIH26002)
            </h4>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Alerts trigger automatically whenever ground truth reports are verified, rainfall surpasses thresholds, or vehicles approach entrapment zones.
            </p>
            <div className="pt-2 border-t border-slate-800 flex flex-col gap-1.5 text-[11px] text-slate-400">
              <span className="flex items-center gap-1 text-slate-300">
                • <strong>Incident Verified:</strong> Dispatches road blockage advisories.
              </span>
              <span className="flex items-center gap-1 text-slate-300">
                • <strong>Score Drop &lt; 40:</strong> Triggers emergency diversion notice.
              </span>
              <span className="flex items-center gap-1 text-slate-300">
                • <strong>Offline Sync:</strong> Notifies command of synced field uploads.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* View Details Modal */}
      {selectedModalAlert && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-3 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`px-2.5 py-0.5 rounded text-[10px] font-black border uppercase tracking-wider ${getPriorityBadge(selectedModalAlert.priority).bg}`}>
                    {getPriorityBadge(selectedModalAlert.priority).label}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    {selectedModalAlert.category.replace(/_/g, ' ').toUpperCase()}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">
                    • {selectedModalAlert.timestamp}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-white">
                  {selectedModalAlert.title}
                </h2>
              </div>

              <button
                onClick={() => setSelectedModalAlert(null)}
                className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Description */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-xs font-bold text-slate-400 uppercase block mb-1">Alert Description</span>
              <p className="text-sm text-slate-200 leading-relaxed">
                {selectedModalAlert.description}
              </p>
            </div>

            {/* Location & Road details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-xs font-bold text-slate-400 uppercase block mb-1">Location & Sector</span>
                <div className="flex items-center gap-2 text-sm text-cyan-300 font-medium">
                  <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>{selectedModalAlert.location}</span>
                </div>
              </div>

              {/* Related Road & Accessibility Score */}
              {(() => {
                const road = roadSegments.find(r => r.id === selectedModalAlert.corridorId);
                return (
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <span className="text-xs font-bold text-slate-400 uppercase block mb-1">Related Road Segment</span>
                    {road ? (
                      <div>
                        <span className="text-sm font-bold text-white block">{road.name}</span>
                        <div className="flex items-center justify-between text-xs text-slate-400 mt-1">
                          <span>Accessibility Score:</span>
                          <span className={`font-mono font-bold text-sm ${
                            road.accessibilityScore < 30 ? 'text-red-400' :
                            road.accessibilityScore < 60 ? 'text-amber-400' : 'text-emerald-400'
                          }`}>
                            {road.accessibilityScore}/100 ({road.riskLevel.toUpperCase()})
                          </span>
                        </div>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-500">General Regional Corridor</span>
                    )}
                  </div>
                );
              })()}
            </div>

            {/* Related Vehicle if applicable */}
            {(() => {
              const veh = vehicles.find(v => v.id === selectedModalAlert.vehicleId);
              if (!veh) return null;
              return (
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-xs font-bold text-slate-400 uppercase block">Related Logistics Vehicle</span>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white font-bold">{veh.id} - {veh.plateNumber}</span>
                    <span className="text-slate-400">Driver: {veh.driverName}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Cargo: {veh.cargoType}</span>
                    <span className="text-amber-400 font-bold uppercase">{veh.safeExitStatus.replace(/_/g, ' ')}</span>
                  </div>
                </div>
              );
            })()}

            {/* Recommended Protocol Action */}
            <div className="bg-amber-950/40 p-3 rounded-xl border border-amber-900/60">
              <span className="text-xs font-bold text-amber-300 uppercase block mb-1">Recommended Action Protocol</span>
              <p className="text-xs text-amber-100 leading-relaxed">
                {selectedModalAlert.recommendedAction}
              </p>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <div className="flex items-center gap-2">
                {!selectedModalAlert.acknowledged && (
                  <button
                    onClick={() => {
                      acknowledgeAlert(selectedModalAlert.id);
                      setSelectedModalAlert(prev => prev ? { ...prev, acknowledged: true } : null);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Mark as Read</span>
                  </button>
                )}

                {!selectedModalAlert.resolved ? (
                  <button
                    onClick={() => {
                      resolveAlert(selectedModalAlert.id);
                      setSelectedModalAlert(prev => prev ? { ...prev, resolved: true, acknowledged: true } : null);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Resolve Alert</span>
                  </button>
                ) : (
                  <span className="text-emerald-400 text-xs font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    Resolved
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleViewOnMap(selectedModalAlert.corridorId)}
                  className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-xs font-bold text-white flex items-center gap-1.5 shadow-lg shadow-cyan-600/20"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>View on Map</span>
                </button>

                <button
                  onClick={() => setSelectedModalAlert(null)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
