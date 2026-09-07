import React from 'react';
import { useRoadPulse } from '../context/RoadPulseContext';
import { 
  Sparkles, 
  BrainCircuit, 
  CheckCircle2, 
  TrendingUp, 
  ArrowRight, 
  Layers, 
  Database, 
  GitFork,
  Activity
} from 'lucide-react';

export const ContinuousLearningView: React.FC = () => {
  const { learningRecords, hazardPredictions, setActiveTab } = useRoadPulse();

  return (
    <div className="p-4 space-y-6 max-w-7xl mx-auto text-slate-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 rounded-2xl p-5 border border-indigo-500/20 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Machine Learning Feedback Loop
            </span>
            <span className="text-xs text-slate-400">STAGE 7: LEARN</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Continuous Learning & Ground-Truth Model Retraining
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-3xl">
            Closes the loop between predictive forecasting and verified field reality. Whenever an officer verifies or corrects an incident, the residual error recalibrates regional feature weights.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs bg-slate-950 p-2 rounded-xl border border-slate-800">
          <BrainCircuit className="w-4 h-4 text-cyan-400" />
          <span className="text-emerald-400 font-mono font-bold">Online Weights: v2.4.1 Active</span>
        </div>
      </div>

      {/* Accuracy KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-sm">
          <span className="text-slate-400 text-xs font-semibold block mb-1">Prediction Precision</span>
          <div className="text-3xl font-black text-emerald-400">89.4%</div>
          <p className="text-[11px] text-slate-500 mt-1">↑ +7.2% after Sonapur landslide confirmation</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-sm">
          <span className="text-slate-400 text-xs font-semibold block mb-1">False Alarm Rate</span>
          <div className="text-3xl font-black text-cyan-400">11.3%</div>
          <p className="text-[11px] text-slate-500 mt-1">↓ Prevented unnecessary long-distance diversions</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-sm">
          <span className="text-slate-400 text-xs font-semibold block mb-1">Ground Fused Events</span>
          <div className="text-3xl font-black text-amber-300">{learningRecords.length} Retrained</div>
          <p className="text-[11px] text-slate-500 mt-1">Supervised ground-truth training episodes</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-sm">
          <span className="text-slate-400 text-xs font-semibold block mb-1">Weight Adaptation Latency</span>
          <div className="text-3xl font-black text-indigo-400">1.8 sec</div>
          <p className="text-[11px] text-slate-500 mt-1">Near real-time online model weight update</p>
        </div>
      </div>

      {/* Main Grid: Learning Records Feed (2 Cols) + Feature Weight Adjustment Matrix (1 Col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Retraining Log (2 Cols) */}
        <div className="lg:col-span-2 bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Database className="w-4 h-4 text-cyan-400" />
              Verified Event Calibration Records
            </h3>
            <span className="text-[11px] text-slate-400">
              Corroborated ground occurrences updating neural parameters
            </span>
          </div>

          <div className="space-y-3">
            {learningRecords.map((rec) => (
              <div
                key={rec.id}
                className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-xs space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold font-mono text-[10px]">
                      RETRAINED
                    </span>
                    <h4 className="font-bold text-white text-xs">{rec.corridorName}</h4>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">{rec.timestamp}</span>
                </div>

                <div className="grid grid-cols-3 gap-2 p-2 rounded-lg bg-slate-900 border border-slate-800 text-center">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Predicted Risk</span>
                    <span className="font-bold text-amber-400 font-mono">{rec.predictedRisk}%</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Actual Ground Impact</span>
                    <span className="font-bold text-red-400 font-mono">{rec.actualOutcome}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Model Error Delta</span>
                    <span className="font-bold text-cyan-400 font-mono">{rec.errorDelta}%</span>
                  </div>
                </div>

                <p className="text-slate-300 text-[11px] leading-relaxed">
                  {rec.learningNote}
                </p>

                <div className="flex items-center gap-2 text-[10px] text-emerald-400 font-semibold pt-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Weight Adjustment Applied: {rec.weightAdjustmentApplied}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Weight Sensitivity Matrix (1 Col) */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-xl space-y-4 text-xs">
          <h4 className="font-bold text-sm text-white uppercase tracking-wider flex items-center gap-2">
            <GitFork className="w-4 h-4 text-indigo-400" />
            Active Feature Weights Matrix
          </h4>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            Weights dynamically auto-tune according to regional monsoon terrain characteristics:
          </p>

          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="flex justify-between font-bold">
                <span className="text-slate-300">Antecedent Precipitation (3-Day)</span>
                <span className="text-cyan-400 font-mono">0.38 (+0.04)</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-cyan-400 h-full" style={{ width: '38%' }} />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="flex justify-between font-bold">
                <span className="text-slate-300">SAR Soil Moisture Saturation</span>
                <span className="text-emerald-400 font-mono">0.27 (+0.02)</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-400 h-full" style={{ width: '27%' }} />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="flex justify-between font-bold">
                <span className="text-slate-300">Geotechnical Slope Gradient</span>
                <span className="text-amber-400 font-mono">0.21 (-0.03)</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-amber-400 h-full" style={{ width: '21%' }} />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="flex justify-between font-bold">
                <span className="text-slate-300">Historical Disruption Scars</span>
                <span className="text-purple-400 font-mono">0.14 (-0.03)</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-purple-400 h-full" style={{ width: '14%' }} />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => setActiveTab('prediction')}
              className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Inspect AI Prediction Engine</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
