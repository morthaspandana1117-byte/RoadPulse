import React, { useState } from 'react';
import { useRoadPulse } from '../context/RoadPulseContext';
import { 
  AlertTriangle, 
  Activity, 
  Sliders, 
  CloudRain, 
  Mountain, 
  History, 
  Database, 
  Sparkles, 
  CheckCircle2, 
  Info,
  Layers,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export const HazardPredictionView: React.FC = () => {
  const { 
    hazardPredictions, 
    roadSegments, 
    selectedSegmentId, 
    setSelectedSegmentId,
    setActiveTab
  } = useRoadPulse();

  const selectedPrediction = hazardPredictions.find(p => p.corridorId === selectedSegmentId) || hazardPredictions[0];
  const matchedSegment = roadSegments.find(s => s.id === selectedPrediction.corridorId) || roadSegments[0];

  // Interactive Simulation Sliders to demonstrate real-time risk scoring engine
  const [simulatedRain, setSimulatedRain] = useState<number>(matchedSegment.weatherImpact.rainfallMmPerHour);
  const [simulatedSoilMoisture, setSimulatedSoilMoisture] = useState<number>(94);
  const [simulatedSlopeRisk, setSimulatedSlopeRisk] = useState<number>(matchedSegment.terrainVulnerability);
  const [simulatedHistoryWeight, setSimulatedHistoryWeight] = useState<number>(78);

  // Dynamic calculation for simulated probability
  const calculatedRiskProbability = Math.min(
    99,
    Math.round(
      (simulatedRain * 0.75) + 
      (simulatedSoilMoisture * 0.35) + 
      (simulatedSlopeRisk * 0.25) + 
      (simulatedHistoryWeight * 0.15) - 
      18
    )
  );

  const getConfidenceBadge = (prob: number) => {
    if (prob >= 75) return { label: 'High Confidence', color: 'bg-red-500/20 text-red-300 border-red-500/40' };
    if (prob >= 50) return { label: 'Medium Confidence', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40' };
    return { label: 'Low Confidence', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' };
  };

  const badge = getConfidenceBadge(calculatedRiskProbability);

  return (
    <div className="p-4 space-y-6 max-w-7xl mx-auto text-slate-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 rounded-2xl p-5 border border-indigo-500/20 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Explainable AI Hazard Engine
            </span>
            <span className="text-xs text-slate-400">STAGE 1: PREDICT</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Predictive Disruption Modeling & Geotechnical Intelligence
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-3xl">
            Synthesizes meteorological rainfall telemetry, satellite SAR soil saturation, digital elevation slope models, and historical recurrence to anticipate corridor failure before ground impact.
          </p>
        </div>

        {/* Corridor Switcher */}
        <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
          <span className="text-[11px] font-bold text-slate-400 px-2 uppercase">Corridor:</span>
          <select
            value={selectedSegmentId || ''}
            onChange={(e) => setSelectedSegmentId(e.target.value)}
            className="bg-slate-900 text-xs text-slate-200 font-semibold px-3 py-1.5 rounded-lg border border-slate-700 focus:outline-none focus:border-blue-500"
          >
            {roadSegments.map((s) => (
              <option key={s.id} value={s.id}>
                {s.corridorCode} - {s.startCity} to {s.endCity}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Grid: Live Prediction Card + Simulator Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Prediction Card (1 Col) */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-xl flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Current Risk Window
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badge.color}`}>
                {badge.label}
              </span>
            </div>

            <div className="mt-4">
              <span className="text-xs font-semibold text-slate-400">{matchedSegment.state}</span>
              <h3 className="text-lg font-bold text-white mt-0.5">{matchedSegment.name}</h3>
            </div>

            {/* Circular Gauge / Disruption Probability Display */}
            <div className="my-5 p-5 rounded-2xl bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-1">
                  Disruption Probability
                </span>
                <div className="text-4xl font-black text-red-400 tracking-tight flex items-baseline gap-1">
                  {calculatedRiskProbability}%
                  <span className="text-xs text-slate-400 font-normal">likelihood</span>
                </div>
                <p className="text-[11px] text-amber-300 font-semibold mt-1">
                  Predicted Threat: {selectedPrediction.hazardType}
                </p>
              </div>

              <div className="w-16 h-16 rounded-full border-4 border-slate-800 border-t-red-500 border-r-red-400 flex items-center justify-center font-black text-sm text-white shadow-inner">
                {calculatedRiskProbability}%
              </div>
            </div>

            {/* Expected Window */}
            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">Anticipated Disruption Window:</span>
                <span className="font-bold text-cyan-400">{selectedPrediction.expectedRiskWindow}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">Baseline Accessibility:</span>
                <span className="font-bold text-amber-400">{matchedSegment.accessibilityScore} / 100</span>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => setActiveTab('score')}
              className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2"
            >
              <span>View Dynamic Score Impact</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Contributing Factors & Interactive Sensor Simulator (2 Cols) */}
        <div className="lg:col-span-2 bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-xl space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              Interactive Multi-Sensor Simulation Sandbox
            </h3>
            <span className="text-[11px] text-slate-400">
              Adjust parameters to observe AI sensitivity response
            </span>
          </div>

          {/* Slider 1: Rainfall */}
          <div className="space-y-1.5 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300 flex items-center gap-2">
                <CloudRain className="w-4 h-4 text-blue-400" />
                Rainfall Intensity (IMD Doppler Radar)
              </span>
              <span className="font-mono font-bold text-blue-400 text-sm">
                {simulatedRain.toFixed(1)} mm/h
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="80"
              step="1"
              value={simulatedRain}
              onChange={(e) => setSimulatedRain(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>0 mm/h (Clear)</span>
              <span>25 mm/h (Heavy)</span>
              <span>50+ mm/h (Cloudburst / Extreme)</span>
            </div>
          </div>

          {/* Slider 2: Sentinel-1 SAR Soil Moisture */}
          <div className="space-y-1.5 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300 flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-400" />
                Sub-Surface Soil Moisture Saturation (Sentinel-1 SAR)
              </span>
              <span className="font-mono font-bold text-emerald-400 text-sm">
                {simulatedSoilMoisture}%
              </span>
            </div>
            <input
              type="range"
              min="20"
              max="100"
              step="1"
              value={simulatedSoilMoisture}
              onChange={(e) => setSimulatedSoilMoisture(parseInt(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>Dry (&lt;40%)</span>
              <span>Saturated (75%)</span>
              <span>Critical Over-Saturation (&gt;90%)</span>
            </div>
          </div>

          {/* Slider 3: Slope Steepness & Geological Lithology */}
          <div className="space-y-1.5 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300 flex items-center gap-2">
                <Mountain className="w-4 h-4 text-amber-400" />
                Slope Gradient & Rock Lithology Vulnerability
              </span>
              <span className="font-mono font-bold text-amber-400 text-sm">
                {simulatedSlopeRisk}%
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              step="1"
              value={simulatedSlopeRisk}
              onChange={(e) => setSimulatedSlopeRisk(parseInt(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>Stable Valley (&lt;30%)</span>
              <span>Moderate Cutting</span>
              <span>Sheared Shale / Fault Zone (&gt;80%)</span>
            </div>
          </div>

          {/* Slider 4: Historical Landslide Recurrence */}
          <div className="space-y-1.5 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300 flex items-center gap-2">
                <History className="w-4 h-4 text-purple-400" />
                Historical Recurrence Frequency Weight
              </span>
              <span className="font-mono font-bold text-purple-400 text-sm">
                {simulatedHistoryWeight}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={simulatedHistoryWeight}
              onChange={(e) => setSimulatedHistoryWeight(parseInt(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>Low Historical Slips</span>
              <span>Recurring Every Monsoon</span>
              <span>Chronic Active Slip Zone</span>
            </div>
          </div>
        </div>
      </div>

      {/* AI Intelligence Explanation Panel (As required by prompt) */}
      <div className="bg-slate-900 rounded-2xl border border-indigo-500/30 p-5 shadow-xl space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
          <Info className="w-4 h-4 text-cyan-400" />
          <h3 className="font-bold text-sm text-white uppercase tracking-wider">
            AI Intelligence Explanation & Decision Formulation
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs text-slate-300 leading-relaxed">
          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <h5 className="font-bold text-slate-200 mb-1 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Geotechnical Reason Formulation
              </h5>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {selectedPrediction.explanation}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <h5 className="font-bold text-slate-200 mb-1 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                Feature Importance Ranking (Shapley Values)
              </h5>
              <ul className="space-y-1 text-[11px] text-slate-400 list-disc list-inside">
                <li><strong className="text-slate-200">Antecedent Rain (35%)</strong>: Primary trigger causing pore-water pressure spikes.</li>
                <li><strong className="text-slate-200">Soil Moisture (25%)</strong>: Exceeding liquid limit of fine silt/clay fraction.</li>
                <li><strong className="text-slate-200">Lithology (20%)</strong>: Bedding plane dip angle parallel to slope face.</li>
                <li><strong className="text-slate-200">Historical Scars (20%)</strong>: Past slips leave uncompacted debris colluvium.</li>
              </ul>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
            <h5 className="font-bold text-slate-200 text-xs uppercase tracking-wider text-cyan-400">
              Active Contributing Factors Matrix
            </h5>

            <div className="space-y-2">
              {selectedPrediction.contributingFactors.map((f, i) => (
                <div key={i} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px]">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-slate-200">{f.name}</span>
                    <span className="text-cyan-400 font-bold">{f.value}</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-red-500 h-full"
                      style={{ width: `${f.impactScore}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
