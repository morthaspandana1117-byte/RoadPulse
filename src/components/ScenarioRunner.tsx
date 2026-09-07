import React from 'react';
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  RotateCcw, 
  CheckCircle, 
  Sparkles,
  ArrowRight,
  Info
} from 'lucide-react';
import { useRoadPulse } from '../context/RoadPulseContext';

const SCENARIO_STEPS_META = [
  {
    step: 1,
    title: '1. AI Disruption Hazard Detected',
    short: 'AI Predicts Hazard',
    desc: 'Meteorological radar & Sentinel-1 SAR soil moisture detect 38.5 mm/h rainfall on NH-06 Sonapur corridor. AI models 82% landslide probability.',
    tabTarget: 'prediction',
    phase: 'PREDICT'
  },
  {
    step: 2,
    title: '2. Baseline Road Accessibility Score: 72/100',
    short: 'Score Baseline (72)',
    desc: 'NH-06 currently operates at Moderate Risk with an Accessibility Score of 72/100 (Yellow). Base condition is good but deteriorating.',
    tabTarget: 'score',
    phase: 'PREDICT'
  },
  {
    step: 3,
    title: '3. Field Officer Submits Ground Report',
    short: 'Ground Report Filed',
    desc: 'Inspector Rajesh Daimary at KM 142.5 files a partial mudslide report with 75% blockage estimate, GPS fix, and site photo.',
    tabTarget: 'report',
    phase: 'REPORT'
  },
  {
    step: 4,
    title: '4. Report Enters Verification Queue',
    short: 'Enters Verification',
    desc: 'The ground incident enters the Central Verification Queue tagged as "Pending Verification" with automated sensor telemetry attached.',
    tabTarget: 'verification',
    phase: 'REPORT'
  },
  {
    step: 5,
    title: '5. Human + AI Ground Truth Fusion',
    short: 'AI + Sensor Fusion',
    desc: 'The system correlates GPS chainage (+30%), 2 independent driver radio corroborations (+25%), AI predictive risk (+20%), and live precipitation (+16%). Confidence: 91%.',
    tabTarget: 'verification',
    phase: 'VERIFY'
  },
  {
    step: 6,
    title: '6. Report Verified by Authorized Officer',
    short: 'Report Verified',
    desc: 'Command Center officer clicks "Verify Report". The incident is officially confirmed as Ground Truth, initiating real-time cascade propagation.',
    tabTarget: 'verification',
    phase: 'VERIFY'
  },
  {
    step: 7,
    title: '7. Dynamic Accessibility Score Drops to 28/100',
    short: 'Score Drops to 28',
    desc: 'Formula recalculates in real-time: Base (78) - Hazard (21) - Weather (17) - Verified Blockage (38) + Confidence (4) = 28/100.',
    tabTarget: 'score',
    phase: 'UPDATE'
  },
  {
    step: 8,
    title: '8. Road Corridor Turns RED on Map',
    short: 'Map Turns Red',
    desc: 'NH-06 Sonapur sector visually shifts from Yellow to Red on the interactive Leaflet GIS map with pulsing critical hazard beacons.',
    tabTarget: 'map',
    phase: 'UPDATE'
  },
  {
    step: 9,
    title: '9. Logistics Fleet Scanned for Corridor Exposure',
    short: 'Fleet Impact Scan',
    desc: 'Fleet tracking identifies 2 active transport carriers on NH-06: TRK-108 (Pharmaceuticals & Oxygen) and TRK-402 (Fuel Tanker).',
    tabTarget: 'vehicles',
    phase: 'UPDATE'
  },
  {
    step: 10,
    title: '10. Safe Exit Window: TRK-402 Clears Corridor',
    short: 'TRK-402 Safe Margin',
    desc: 'TRK-402 is only 8 km past the risk zone. With a 48-minute safety margin before total blockage, it receives recommendation: "Proceed with Caution".',
    tabTarget: 'safe_exit',
    phase: 'UPDATE'
  },
  {
    step: 11,
    title: '11. Safe Exit Window: TRK-108 Advised "Do Not Enter"',
    short: 'TRK-108 Reroute Alert',
    desc: 'TRK-108 ETA to Sonapur (48 mins) exceeds safe closure window (-25 mins margin). Entering would trap the vehicle. System orders: "Reroute Immediately".',
    tabTarget: 'safe_exit',
    phase: 'UPDATE'
  },
  {
    step: 12,
    title: '12. Safe, Fast & Balanced Routes Generated',
    short: '3 Routes Calculated',
    desc: 'The Route Intelligence Engine calculates 3 paths: Safe Route (via NH-27 Haflong Bypass, Score 84), Fast Route (Blocked, Score 28), and Balanced Route (Score 66).',
    tabTarget: 'routes',
    phase: 'REROUTE'
  },
  {
    step: 13,
    title: '13. TRK-108 Rerouted to Haflong Safe Corridor',
    short: 'Vehicle Rerouted',
    desc: 'Automated dispatch reroutes TRK-108 onto the NH-27 Haflong all-weather bypass, completely avoiding the Sonapur landslide zone.',
    tabTarget: 'routes',
    phase: 'REROUTE'
  },
  {
    step: 14,
    title: '14. Driver Receives Cab HUD Alert & Updated ETA',
    short: 'Driver HUD Updates',
    desc: 'Driver Manabendra Barman receives high-contrast Cab HUD audible alert and accepts the safe detour. New ETA is recalculated seamlessly.',
    tabTarget: 'driver_hud',
    phase: 'ALERT'
  },
  {
    step: 15,
    title: '15. Emergency Agency Disruption Alert Broadcast',
    short: 'Disruption Alert',
    desc: 'Critical alert dispatched to DDMA, BRO, and regional freight dispatchers. Heavy trailers halted at Ladrymbai checkpoint.',
    tabTarget: 'alerts',
    phase: 'ALERT'
  },
  {
    step: 16,
    title: '16. Continuous Learning Model Ingests Verified Outcome',
    short: 'Continuous Learning',
    desc: 'The confirmed landslide timestamp and geotechnical readings enter the historical training pool. Prediction accuracy increases from 83.2% to 88.7%.',
    tabTarget: 'learning',
    phase: 'LEARN'
  }
];

export const ScenarioRunner: React.FC = () => {
  const { 
    scenarioStep, 
    isScenarioRunning, 
    nextScenarioStep, 
    prevScenarioStep, 
    resetScenario, 
    jumpToScenarioStep,
    autoPlayScenario,
    setAutoPlayScenario
  } = useRoadPulse();

  if (!isScenarioRunning && scenarioStep === 0) return null;

  const currentMeta = SCENARIO_STEPS_META[scenarioStep - 1] || SCENARIO_STEPS_META[0];

  return (
    <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-b border-indigo-500/30 text-slate-100 px-4 py-3 shadow-xl sticky top-[57px] z-40">
      <div className="max-w-7xl mx-auto flex flex-col gap-2">
        {/* Top Control Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 font-extrabold text-[10px] tracking-wider uppercase flex items-center gap-1">
              <Sparkles className="w-3 h-3 fill-slate-950" />
              SIH 26002 Live Demo
            </span>
            <span className="text-xs font-mono font-bold text-indigo-300">
              Step {scenarioStep} of 16
            </span>
            <span className="px-2 py-0.5 rounded bg-blue-500/20 text-cyan-300 border border-blue-500/30 text-[10px] font-bold">
              PHASE: {currentMeta.phase}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setAutoPlayScenario(!autoPlayScenario)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${
                autoPlayScenario
                  ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
            >
              {autoPlayScenario ? (
                <>
                  <Pause className="w-3 h-3" />
                  <span>Auto-Playing (5s)</span>
                </>
              ) : (
                <>
                  <Play className="w-3 h-3" />
                  <span>Auto-Play</span>
                </>
              )}
            </button>

            <button
              onClick={prevScenarioStep}
              disabled={scenarioStep <= 1}
              className="p-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-xs flex items-center gap-1"
              title="Previous Step"
            >
              <SkipBack className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Prev</span>
            </button>

            <button
              onClick={nextScenarioStep}
              disabled={scenarioStep >= 16}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              title="Next Step"
            >
              <span>{scenarioStep === 16 ? 'Completed' : 'Next Step'}</span>
              <SkipForward className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={resetScenario}
              className="p-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
              title="Exit & Reset Demo"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Step Description & Callout */}
        <div className="bg-slate-950/60 rounded-xl p-2.5 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center shrink-0 mt-0.5 font-mono text-xs font-bold">
              {scenarioStep}
            </div>
            <div>
              <h4 className="text-xs font-bold text-white flex items-center gap-2">
                {currentMeta.title}
              </h4>
              <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                {currentMeta.desc}
              </p>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <span className="text-[10px] text-slate-400 hidden lg:inline">Quick Jump:</span>
            <div className="flex items-center gap-1 overflow-x-auto max-w-[340px] py-0.5">
              {SCENARIO_STEPS_META.map((s) => (
                <button
                  key={s.step}
                  onClick={() => jumpToScenarioStep(s.step)}
                  className={`w-5 h-5 rounded-full text-[9px] font-bold transition-all flex items-center justify-center ${
                    scenarioStep === s.step
                      ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-300 scale-110'
                      : s.step < scenarioStep
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                  title={`${s.step}. ${s.short}`}
                >
                  {s.step < scenarioStep ? '✓' : s.step}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
