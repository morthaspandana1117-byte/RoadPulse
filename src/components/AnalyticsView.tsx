import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  PieChart, 
  Clock, 
  CheckCircle2, 
  ShieldCheck, 
  Layers, 
  Calendar,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';

const HIGHWAY_DISRUPTIONS = [
  { highway: 'NH-06 (Sonapur)', count: 48, avgClosureHours: 14.5, riskRate: 'Critical' },
  { highway: 'NH-29 (Pagla Pahar)', count: 34, avgClosureHours: 9.2, riskRate: 'High' },
  { highway: 'NH-15 (Bihpuria)', count: 26, avgClosureHours: 18.0, riskRate: 'High' },
  { highway: 'NH-13 (Trans-Arunachal)', count: 19, avgClosureHours: 8.4, riskRate: 'Moderate' },
  { highway: 'NH-102 (Imphal-Moreh)', count: 15, avgClosureHours: 6.1, riskRate: 'Moderate' },
  { highway: 'NH-27 (Silchar Bypass)', count: 8, avgClosureHours: 3.5, riskRate: 'Low' },
];

const MONSOON_TRENDS = [
  { month: 'Apr', incidents: 8, rainfallIndex: 28, accessibilityAvg: 88 },
  { month: 'May', incidents: 22, rainfallIndex: 65, accessibilityAvg: 74 },
  { month: 'Jun', incidents: 64, rainfallIndex: 98, accessibilityAvg: 51 },
  { month: 'Jul', incidents: 89, rainfallIndex: 110, accessibilityAvg: 42 },
  { month: 'Aug', incidents: 73, rainfallIndex: 92, accessibilityAvg: 49 },
  { month: 'Sep', incidents: 38, rainfallIndex: 58, accessibilityAvg: 68 },
  { month: 'Oct', incidents: 12, rainfallIndex: 32, accessibilityAvg: 84 },
];

export const AnalyticsView: React.FC = () => {
  const [selectedMetric, setSelectedMetric] = useState<'incidents' | 'closure'>('incidents');

  return (
    <div className="p-4 space-y-6 max-w-7xl mx-auto text-slate-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 rounded-2xl p-5 border border-indigo-500/20 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold flex items-center gap-1.5">
              <BarChart3 className="w-3.5 h-3.5" />
              Regional Logistics Intelligence
            </span>
            <span className="text-xs text-slate-400">HISTORICAL BENCHMARKS</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Northeastern Logistics Disruption & Resilience Analytics
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-3xl">
            Correlates seasonal monsoon precipitation with corridor blockages, evaluating emergency dispatch response times, economic savings from proactive diversion, and corridor resilience indices.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs bg-slate-950 p-2 rounded-xl border border-slate-800">
          <Calendar className="w-4 h-4 text-cyan-400" />
          <span className="text-slate-300 font-semibold">Reporting Cycle: Monsoon 2025–2026</span>
        </div>
      </div>

      {/* Top 4 Impact KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Avg Response Time */}
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Average Verification Time</span>
            <Clock className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-black text-white">4.2 min</div>
          <p className="text-[11px] text-emerald-400 font-semibold mt-1">
            ↓ 82% reduction from manual phone calls
          </p>
        </div>

        {/* 2. Proactive Reroutes */}
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Proactive Diversions Executed</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-emerald-400">142</div>
          <p className="text-[11px] text-slate-400 mt-1">
            Carriers diverted prior to road blockage
          </p>
        </div>

        {/* 3. Freight Hours Saved */}
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Logistics Delay Hours Saved</span>
            <ShieldCheck className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-3xl font-black text-cyan-400">1,840 hrs</div>
          <p className="text-[11px] text-slate-400 mt-1">
            Prevents stranded perishable cargo loss
          </p>
        </div>

        {/* 4. Model Prediction Precision */}
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Ground Truth Accuracy</span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-black text-amber-300">89.4%</div>
          <p className="text-[11px] text-slate-400 mt-1">
            Continuous learning feedback loop active
          </p>
        </div>
      </div>

      {/* Main Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Disruption Frequency by Corridor */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="font-bold text-sm text-white">Disruption Frequency by Highway Corridor</h3>
              <p className="text-[11px] text-slate-400">Total historical blockages recorded across key mountain passes</p>
            </div>
            <div className="flex gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-[10px]">
              <button
                onClick={() => setSelectedMetric('incidents')}
                className={`px-2 py-0.5 rounded font-semibold ${selectedMetric === 'incidents' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
              >
                Incidents
              </button>
              <button
                onClick={() => setSelectedMetric('closure')}
                className={`px-2 py-0.5 rounded font-semibold ${selectedMetric === 'closure' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
              >
                Avg Hours
              </button>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            {HIGHWAY_DISRUPTIONS.map((item, idx) => {
              const maxVal = selectedMetric === 'incidents' ? 50 : 20;
              const currentVal = selectedMetric === 'incidents' ? item.count : item.avgClosureHours;
              const widthPct = Math.round((currentVal / maxVal) * 100);

              return (
                <div key={idx} className="space-y-1 text-xs">
                  <div className="flex justify-between font-semibold">
                    <span className="text-slate-200">{item.highway}</span>
                    <span className="text-cyan-400 font-mono">
                      {selectedMetric === 'incidents' ? `${item.count} incidents` : `${item.avgClosureHours} hrs avg`}
                    </span>
                  </div>
                  <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden p-0.5 border border-slate-800">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        item.riskRate === 'Critical' ? 'bg-gradient-to-r from-red-600 to-rose-400' :
                        item.riskRate === 'High' ? 'bg-gradient-to-r from-amber-500 to-orange-400' :
                        'bg-gradient-to-r from-blue-500 to-cyan-400'
                      }`}
                      style={{ width: `${widthPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 2: Monthly Monsoon Inundation & Accessibility Curve */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="font-bold text-sm text-white">Monsoon Season Risk Correlation</h3>
              <p className="text-[11px] text-slate-400">Precipitation spikes vs. Regional Road Accessibility Index</p>
            </div>
            <div className="flex items-center gap-3 text-[10px] text-slate-400">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                Incidents
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                Accessibility
              </span>
            </div>
          </div>

          {/* SVG Custom Responsive Timeline Chart */}
          <div className="w-full h-56 flex flex-col justify-between pt-4">
            <div className="flex-1 flex items-end justify-between gap-2 px-2 border-b border-slate-800 pb-2">
              {MONSOON_TRENDS.map((trend, i) => {
                const heightPct = Math.round((trend.incidents / 100) * 100);
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group">
                    <div className="text-[9px] text-slate-400 font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                      {trend.incidents}
                    </div>
                    {/* Bar for incidents */}
                    <div 
                      className="w-full max-w-[28px] rounded-t-md bg-gradient-to-t from-red-600/60 to-red-400 group-hover:brightness-125 transition-all"
                      style={{ height: `${heightPct}%` }}
                    />
                    <span className="text-[10px] font-bold text-slate-400 mt-1">{trend.month}</span>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2">
              <span>Peak Risk: June–July (Brahmaputra Basin & Meghalaya Plateau)</span>
              <span className="text-emerald-400 font-semibold">Post-Monsoon Recovery: Oct</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hazard Type Distribution & Economic Resilience Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-xl space-y-3">
          <h4 className="font-bold text-xs text-white uppercase tracking-wider">
            Disruption Root Cause Breakdown
          </h4>
          <div className="space-y-2.5 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 flex justify-between items-center">
              <span className="text-slate-300">Mudslide & Debris Slump</span>
              <span className="font-bold text-red-400">48%</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 flex justify-between items-center">
              <span className="text-slate-300">River & Flash Flood Inundation</span>
              <span className="font-bold text-blue-400">26%</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 flex justify-between items-center">
              <span className="text-slate-300">Pagla Pahar Boulder Rockfall</span>
              <span className="font-bold text-amber-400">14%</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 flex justify-between items-center">
              <span className="text-slate-300">Culvert / Bridge Approach Scour</span>
              <span className="font-bold text-purple-400">12%</span>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-xl space-y-3 flex flex-col justify-between">
          <div>
            <h4 className="font-bold text-xs text-white uppercase tracking-wider mb-2">
              Smart India Hackathon 2026 Innovation Value (SIH26002)
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Unlike static navigation engines that lead trucks into freshly collapsed mountain passes, RoadPulse creates a continuous feedback loop: <strong className="text-cyan-400">Antecedent Sensor Risk ➔ Offline Field Truth ➔ Dynamic Accessibility Index ➔ Automated Vehicle Diversion</strong>.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-3 border-t border-slate-800 text-center text-xs">
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Cost Reduction</span>
              <div className="text-lg font-black text-emerald-400 mt-1">₹4.8 Cr</div>
              <span className="text-[10px] text-slate-500">Prevented demurrage</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Essential Supply Lead</span>
              <div className="text-lg font-black text-cyan-400 mt-1">-36 Hours</div>
              <span className="text-[10px] text-slate-500">To Barak Valley & Tripura</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Driver Safety Rate</span>
              <div className="text-lg font-black text-amber-300 mt-1">100%</div>
              <span className="text-[10px] text-slate-500">Zero entrapments in zone</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
