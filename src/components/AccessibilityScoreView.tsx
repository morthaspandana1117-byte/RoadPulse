import React, { useState } from 'react';
import { useRoadPulse } from '../context/RoadPulseContext';
import { 
  Gauge, 
  Sparkles, 
  Sliders, 
  CloudRain, 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  ArrowRight,
  Info,
  Layers,
  MapPin
} from 'lucide-react';

export const AccessibilityScoreView: React.FC = () => {
  const { 
    roadSegments, 
    selectedSegmentId, 
    setSelectedSegmentId, 
    calculateDynamicScore,
    setActiveTab
  } = useRoadPulse();

  const selectedSegment = roadSegments.find(s => s.id === selectedSegmentId) || roadSegments[0];

  // Simulator state based on selected segment
  const [baseCondition, setBaseCondition] = useState<number>(selectedSegment.baseCondition);
  const [hazardRisk, setHazardRisk] = useState<number>(85);
  const [rainfallMm, setRainfallMm] = useState<number>(selectedSegment.weatherImpact.rainfallMmPerHour);
  const [blockagePercent, setBlockagePercent] = useState<number>(selectedSegment.roadBlockagePercent);
  const [verifiedIncidents, setVerifiedIncidents] = useState<number>(selectedSegment.verifiedIncidentCount);

  // Sync simulator if user switches segment
  const handleSelectSegment = (id: string) => {
    setSelectedSegmentId(id);
    const seg = roadSegments.find(s => s.id === id);
    if (seg) {
      setBaseCondition(seg.baseCondition);
      setRainfallMm(seg.weatherImpact.rainfallMmPerHour);
      setBlockagePercent(seg.roadBlockagePercent);
      setVerifiedIncidents(seg.verifiedIncidentCount);
    }
  };

  const calculated = calculateDynamicScore(
    baseCondition,
    hazardRisk,
    rainfallMm,
    blockagePercent,
    verifiedIncidents
  );

  const getScoreColor = (score: number) => {
    if (score >= 75) return { text: 'text-emerald-400', bg: 'bg-emerald-500', label: 'Safe / Fully Accessible', badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' };
    if (score >= 60) return { text: 'text-amber-400', bg: 'bg-amber-500', label: 'Moderate Risk / Proceed with Caution', badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40' };
    if (score >= 40) return { text: 'text-orange-400', bg: 'bg-orange-500', label: 'High Risk / Severe Disruption', badge: 'bg-orange-500/20 text-orange-300 border-orange-500/40' };
    return { text: 'text-red-400', bg: 'bg-red-500', label: 'Critical / Carriageway Closed', badge: 'bg-red-500/20 text-red-300 border-red-500/40 animate-pulse' };
  };

  const scoreMeta = getScoreColor(calculated.finalScore);

  return (
    <div className="p-4 space-y-6 max-w-7xl mx-auto text-slate-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 rounded-2xl p-5 border border-indigo-500/20 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold flex items-center gap-1.5">
              <Gauge className="w-3.5 h-3.5" />
              Core Innovation Model
            </span>
            <span className="text-xs text-slate-400">STAGE 4: UPDATE</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Dynamic Road Accessibility Scoring Engine
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-3xl">
            A real-time mathematical formulation quantifying continuous road operability by fusing structural pavement condition, geotechnical hazard probability, meteorology, and ground truth blockage reports.
          </p>
        </div>

        {/* Corridor Picker */}
        <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
          <span className="text-[11px] font-bold text-slate-400 px-2 uppercase">Corridor:</span>
          <select
            value={selectedSegmentId || ''}
            onChange={(e) => handleSelectSegment(e.target.value)}
            className="bg-slate-900 text-xs text-slate-200 font-semibold px-3 py-1.5 rounded-lg border border-slate-700 focus:outline-none focus:border-blue-500"
          >
            {roadSegments.map((s) => (
              <option key={s.id} value={s.id}>
                {s.corridorCode} - {s.name} ({s.accessibilityScore}/100)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Grid: Mathematical Breakdown Card + Interactive Sandbox */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Dynamic Score Output Card (1 Col) */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-xl flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Corridor Score Status
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${scoreMeta.badge}`}>
                {scoreMeta.label}
              </span>
            </div>

            <div className="mt-4">
              <h3 className="text-base font-bold text-white">{selectedSegment.name}</h3>
              <p className="text-slate-400 text-xs">{selectedSegment.state} • Chainage {selectedSegment.lengthKm} km</p>
            </div>

            {/* Big Score Dial */}
            <div className="my-5 p-6 rounded-2xl bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-800 text-center relative overflow-hidden">
              <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">
                Dynamic Accessibility Index
              </span>
              <div className={`text-6xl font-black tracking-tight my-2 ${scoreMeta.text}`}>
                {calculated.finalScore}
                <span className="text-sm text-slate-400 font-normal"> / 100</span>
              </div>
              <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden mt-3">
                <div 
                  className={`h-full transition-all duration-300 ${scoreMeta.bg}`}
                  style={{ width: `${calculated.finalScore}%` }}
                />
              </div>
            </div>

            {/* Mathematical Formula String */}
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs space-y-2 font-mono">
              <div className="text-[10px] uppercase font-bold text-slate-400 font-sans">
                Active Equation Formulation:
              </div>
              <div className="text-slate-300 text-[11px] leading-relaxed">
                Score = Base ({calculated.base}) <br />
                &nbsp;&nbsp;– Hazard Risk ({calculated.hazardDeduction}) <br />
                &nbsp;&nbsp;– Weather Impact ({calculated.weatherDeduction}) <br />
                &nbsp;&nbsp;– Verified Incident ({calculated.incidentDeduction}) <br />
                &nbsp;&nbsp;+ Confidence Stabilization (+{calculated.confidenceAdjustment}) <br />
                &nbsp;&nbsp;= <strong className={scoreMeta.text}>{calculated.finalScore} / 100</strong>
              </div>
            </div>
          </div>

          <div className="pt-2 flex gap-2">
            <button
              onClick={() => setActiveTab('map')}
              className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-colors"
            >
              Inspect on Map
            </button>
            <button
              onClick={() => setActiveTab('routes')}
              className="flex-1 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <span>View Rerouting</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Sandbox Calculator Controls (2 Cols) */}
        <div className="lg:col-span-2 bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-xl space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              Dynamic Formula Sensitivity Sandbox
            </h3>
            <span className="text-[11px] text-slate-400">
              Simulate live environmental & ground incident shocks
            </span>
          </div>

          {/* Factor 1: Base Condition */}
          <div className="space-y-1.5 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-300">Base Pavement Condition Score:</span>
              <span className="font-mono font-bold text-cyan-400">{baseCondition} / 100</span>
            </div>
            <input
              type="range"
              min="50"
              max="100"
              value={baseCondition}
              onChange={(e) => setBaseCondition(parseInt(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
          </div>

          {/* Factor 2: Hazard Risk */}
          <div className="space-y-1.5 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-300">AI Hazard Prediction Probability:</span>
              <span className="font-mono font-bold text-red-400">{hazardRisk}% Risk</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={hazardRisk}
              onChange={(e) => setHazardRisk(parseInt(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-red-500"
            />
          </div>

          {/* Factor 3: Rainfall mm/h */}
          <div className="space-y-1.5 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-300">Weather Severity (Rainfall Rate):</span>
              <span className="font-mono font-bold text-blue-400">{rainfallMm.toFixed(1)} mm/h</span>
            </div>
            <input
              type="range"
              min="0"
              max="70"
              step="1"
              value={rainfallMm}
              onChange={(e) => setRainfallMm(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>

          {/* Factor 4: Ground Blockage % */}
          <div className="space-y-1.5 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-300">Verified Ground Blockage:</span>
              <span className="font-mono font-bold text-amber-400">{blockagePercent}% Carriageway</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={blockagePercent}
              onChange={(e) => setBlockagePercent(parseInt(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
          </div>

          {/* Factor 5: Verified Incidents Count */}
          <div className="space-y-1.5 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-300">Active Ground Truth Incidents on Stretch:</span>
              <span className="font-mono font-bold text-rose-400">{verifiedIncidents} Verified</span>
            </div>
            <input
              type="range"
              min="0"
              max="5"
              step="1"
              value={verifiedIncidents}
              onChange={(e) => setVerifiedIncidents(parseInt(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
            />
          </div>
        </div>
      </div>

      {/* Corridor Comparative Matrix */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-xl space-y-3">
        <h4 className="font-bold text-xs text-white uppercase tracking-wider flex items-center gap-2">
          <Layers className="w-4 h-4 text-emerald-400" />
          NER Strategic Freight Network Comparative Accessibility Matrix
        </h4>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                <th className="pb-2 font-bold">Corridor</th>
                <th className="pb-2 font-bold">Connecting Terminals</th>
                <th className="pb-2 font-bold">Length</th>
                <th className="pb-2 font-bold">Rainfall</th>
                <th className="pb-2 font-bold">Blockage</th>
                <th className="pb-2 font-bold">Dynamic Score</th>
                <th className="pb-2 font-bold">Status</th>
                <th className="pb-2 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {roadSegments.map((seg) => {
                const meta = getScoreColor(seg.accessibilityScore);
                return (
                  <tr key={seg.id} className="hover:bg-slate-950/40 transition-colors">
                    <td className="py-2.5 font-bold text-white">{seg.corridorCode}</td>
                    <td className="py-2.5 text-slate-300">{seg.startCity} ➔ {seg.endCity}</td>
                    <td className="py-2.5 text-slate-400">{seg.lengthKm} km</td>
                    <td className="py-2.5 text-blue-300">{seg.weatherImpact.rainfallMmPerHour} mm/h</td>
                    <td className="py-2.5 text-amber-300">{seg.roadBlockagePercent}%</td>
                    <td className="py-2.5">
                      <span className={`font-black text-sm ${meta.text}`}>
                        {seg.accessibilityScore} / 100
                      </span>
                    </td>
                    <td className="py-2.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${meta.badge}`}>
                        {seg.riskLevel.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-2.5 text-right">
                      <button
                        onClick={() => handleSelectSegment(seg.id)}
                        className="text-[11px] text-cyan-400 hover:text-cyan-300 font-semibold"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
