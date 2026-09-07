import React, { useState } from 'react';
import { useRoadPulse } from '../context/RoadPulseContext';
import { 
  Bell, 
  MessageSquare, 
  Smartphone, 
  Radio, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  Send, 
  Users, 
  Building2, 
  Truck, 
  Filter,
  Check
} from 'lucide-react';

export const AlertsCenterView: React.FC = () => {
  const { alerts, acknowledgeAlert } = useRoadPulse();
  const [filterChannel, setFilterChannel] = useState<string>('all');
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [activePreviewId, setActivePreviewId] = useState<string>(alerts[0]?.id || '');

  const filteredAlerts = alerts.filter(a => {
    if (filterChannel !== 'all' && !a.channels.includes(filterChannel as any)) return false;
    if (filterSeverity !== 'all' && a.severity !== filterSeverity) return false;
    return true;
  });

  const activeAlert = alerts.find(a => a.id === activePreviewId) || alerts[0];

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
            Emergency Multi-Channel Alert & Broadcast Center
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-3xl">
            Automates mission-critical hazard advisories to Field Officers, Logistics Fleet Managers, In-Cab Drivers, and District Disaster Authorities via low-bandwidth SMS, WhatsApp, and push notifications.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-xl border border-slate-800 text-xs">
          <span className="text-red-400 font-bold">{alerts.filter(a => !a.acknowledged).length} Unacknowledged</span>
          <span className="text-slate-600">|</span>
          <span className="text-emerald-400 font-bold">{alerts.length} Total Dispatches</span>
        </div>
      </div>

      {/* Main Grid: Alerts Feed (2 Cols) + Mobile Previews (1 Col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Feed & Filters (2 Cols) */}
        <div className="lg:col-span-2 bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Radio className="w-4 h-4 text-cyan-400" />
              Active Broadcast Stream ({filteredAlerts.length})
            </h3>

            {/* Filter Pills */}
            <div className="flex items-center gap-2 text-xs">
              <select
                value={filterSeverity}
                onChange={(e) => setFilterSeverity(e.target.value)}
                className="bg-slate-950 text-slate-200 px-2.5 py-1.5 rounded-lg border border-slate-700 text-[11px]"
              >
                <option value="all">All Severities</option>
                <option value="critical">Critical Only</option>
                <option value="warning">Warnings</option>
                <option value="advisory">Advisories</option>
              </select>

              <select
                value={filterChannel}
                onChange={(e) => setFilterChannel(e.target.value)}
                className="bg-slate-950 text-slate-200 px-2.5 py-1.5 rounded-lg border border-slate-700 text-[11px]"
              >
                <option value="all">All Channels</option>
                <option value="sms">SMS Gateway</option>
                <option value="whatsapp">WhatsApp Business</option>
                <option value="in_app">In-App Push</option>
              </select>
            </div>
          </div>

          {/* List of Alerts */}
          <div className="space-y-3">
            {filteredAlerts.map((alert) => {
              const isSelected = alert.id === activePreviewId;

              return (
                <div
                  key={alert.id}
                  onClick={() => setActivePreviewId(alert.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer text-xs ${
                    isSelected
                      ? 'bg-indigo-950/60 border-indigo-500 shadow-lg ring-1 ring-indigo-500/40'
                      : alert.severity === 'critical'
                      ? 'bg-red-950/30 border-red-900/50 hover:bg-red-950/50'
                      : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-850'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] uppercase font-black px-2 py-0.5 rounded ${
                        alert.severity === 'critical' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                        alert.severity === 'warning' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-blue-500/20 text-blue-400'
                      }`}>
                        {alert.severity}
                      </span>
                      <span className="font-bold text-white text-xs">{alert.title}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">{alert.timestamp}</span>
                  </div>

                  <p className="text-slate-300 text-[11px] leading-relaxed mb-3">
                    {alert.message}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/60 text-[10px]">
                    {/* Target Audience Badges */}
                    <div className="flex items-center gap-2 text-slate-400">
                      <span className="font-semibold">Recipients:</span>
                      <div className="flex gap-1">
                        {alert.targetAudience.map((aud, i) => (
                          <span key={i} className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                            {aud.replace(/_/g, ' ')}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Channels & Acknowledge */}
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1 text-cyan-400 font-semibold uppercase">
                        {alert.channels.join(' • ')}
                      </div>

                      {!alert.acknowledged ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            acknowledgeAlert(alert.id);
                          }}
                          className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold border border-slate-700 transition-colors flex items-center gap-1"
                        >
                          <Check className="w-3 h-3" />
                          <span>Acknowledge</span>
                        </button>
                      ) : (
                        <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                          <CheckCircle2 className="w-3 h-3" />
                          Acknowledged
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Realistic Mobile Device Simulator Preview (1 Col) */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="font-bold text-xs text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-emerald-400" />
                Live Handset Delivery Simulator
              </h3>
              <span className="text-[10px] text-slate-500 font-mono">GSM / LTE / SMS</span>
            </div>

            {/* Mobile Device Frame */}
            <div className="w-full max-w-[320px] mx-auto bg-slate-950 rounded-[28px] border-4 border-slate-700 p-3 shadow-2xl space-y-3 relative">
              {/* Speaker notch */}
              <div className="w-16 h-2 bg-slate-800 rounded-full mx-auto mb-2" />

              {/* Simulated SMS View */}
              <div className="bg-slate-900 rounded-xl p-3 border border-slate-800 space-y-2 text-xs">
                <div className="flex items-center justify-between text-[10px] text-slate-400 pb-1 border-b border-slate-800">
                  <span className="font-bold text-cyan-400">SMS: ROADPULSE-GOV</span>
                  <span>SIM 1 (BSNL NER)</span>
                </div>
                <div className="bg-slate-800/80 p-2.5 rounded-lg text-[11px] text-slate-200 leading-relaxed font-sans">
                  <p className="font-bold text-red-400 uppercase text-[10px] mb-1">
                    [URGENT {activeAlert?.severity?.toUpperCase()}]
                  </p>
                  {activeAlert?.message}
                </div>
                <div className="text-[9px] text-slate-500 text-right">Delivered via Cell Broadcast</div>
              </div>

              {/* Simulated WhatsApp Notification View */}
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
                  <p className="text-slate-300 text-[10px]">{activeAlert?.title}</p>
                  <p className="text-slate-400 text-[10px] mt-1">{activeAlert?.message}</p>
                  <div className="mt-2 pt-1.5 border-t border-slate-800 flex justify-end">
                    <span className="text-[10px] text-emerald-400 font-bold">Tap to view detour map ➔</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-center">
            <span className="text-[11px] text-slate-400">
              Compatible with 2G fallback SMS for zero-data mountain sectors.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
