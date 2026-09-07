import React, { useState } from 'react';
import { useRoadPulse } from '../context/RoadPulseContext';
import { 
  Navigation, 
  Volume2, 
  VolumeX, 
  AlertTriangle, 
  CheckCircle2, 
  Compass, 
  Wifi, 
  WifiOff, 
  ArrowRight, 
  RotateCcw,
  ShieldAlert,
  ArrowUp,
  CornerUpRight
} from 'lucide-react';

export const DriverHudView: React.FC = () => {
  const { 
    vehicles, 
    selectedVehicleId, 
    setSelectedVehicleId, 
    rerouteVehicle, 
    isOnline,
    setActiveTab
  } = useRoadPulse();

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [audioPlayed, setAudioPlayed] = useState(false);

  const selectedVehicle = vehicles.find(v => v.id === selectedVehicleId) || vehicles[0];

  const handleSimulateVoiceAlert = () => {
    if ('speechSynthesis' in window && soundEnabled) {
      const utterance = new SpeechSynthesisUtterance(
        selectedVehicle.rerouteRecommended && !selectedVehicle.rerouteAccepted
          ? 'Warning! Active landslide detected at Sonapur Tunnel on Highway 06. Accept detour to Haflong bypass immediately.'
          : 'Proceed with caution. Wet road conditions on current corridor.'
      );
      utterance.pitch = 1.0;
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
      setAudioPlayed(true);
      setTimeout(() => setAudioPlayed(false), 4000);
    }
  };

  return (
    <div className="min-h-[calc(100vh-140px)] bg-black p-4 sm:p-6 text-white flex flex-col justify-between max-w-5xl mx-auto rounded-3xl border-2 border-slate-800 shadow-2xl">
      {/* Top High-Contrast HUD Bar */}
      <div className="flex items-center justify-between pb-4 border-b-2 border-slate-800">
        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 font-mono text-sm font-black text-cyan-400">
            {selectedVehicle.id} • {selectedVehicle.plateNumber}
          </div>
          <span className="text-xs font-bold text-slate-400">
            Driver: {selectedVehicle.driverName}
          </span>
        </div>

        {/* Low-Bandwidth / 2G Status & Voice Mute */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono">
            {isOnline ? (
              <span className="text-emerald-400 flex items-center gap-1">
                <Wifi className="w-3.5 h-3.5" /> 2G CACHED
              </span>
            ) : (
              <span className="text-amber-400 flex items-center gap-1">
                <WifiOff className="w-3.5 h-3.5" /> LOW-BW OFFLINE
              </span>
            )}
          </div>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-xl border transition-colors ${
              soundEnabled ? 'bg-blue-600 text-white border-blue-500' : 'bg-slate-900 text-slate-500 border-slate-800'
            }`}
            title="Toggle Voice Alerts"
          >
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Center Display: Urgent Warning or Next Turn */}
      <div className="py-6 space-y-6 flex-1 flex flex-col justify-center">
        {selectedVehicle.rerouteRecommended && !selectedVehicle.rerouteAccepted ? (
          /* Urgent Hazard In-Cab Alert Card */
          <div className="bg-red-950/80 border-4 border-red-500 rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-4 animate-pulse">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-600 text-white shadow-xl">
              <AlertTriangle className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <span className="text-xs sm:text-sm font-black uppercase tracking-widest text-red-300">
                CRITICAL HAZARD AHEAD: DISTANCE {selectedVehicle.distanceToRiskKm} KM
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                LANDSLIDE ON NH-06 SONAPUR TUNNEL
              </h2>
              <p className="text-sm sm:text-base text-red-200 max-w-xl mx-auto font-medium">
                Carriageway blocked by 75%. Safe exit window has expired. Do not proceed toward the gorge.
              </p>
            </div>

            {/* Big One-Tap Detour Acceptance Action */}
            <div className="pt-2">
              <button
                onClick={() => {
                  rerouteVehicle(selectedVehicle.id);
                  handleSimulateVoiceAlert();
                }}
                className="w-full max-w-md mx-auto py-5 px-8 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:brightness-110 active:scale-95 text-slate-950 font-black text-lg sm:text-xl shadow-2xl shadow-emerald-500/30 flex items-center justify-center gap-3 transition-all"
              >
                <CheckCircle2 className="w-7 h-7 stroke-[3]" />
                <span>TAP TO ACCEPT SAFE DETOUR</span>
              </button>
              <span className="text-[11px] text-slate-400 block mt-2">
                Diverts vehicle to NH-27 Lumding–Haflong bypass (Zero mountain blockages)
              </span>
            </div>
          </div>
        ) : (
          /* Normal / Accepted High-Contrast Turn-by-Turn Guidance */
          <div className="bg-slate-950 border-2 border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 rounded-2xl bg-cyan-500/20 text-cyan-400 border-2 border-cyan-500/40 flex items-center justify-center shrink-0">
                  <CornerUpRight className="w-12 h-12 stroke-[2.5]" />
                </div>
                <div>
                  <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest block">
                    IN 1.4 KILOMETERS
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-white">
                    Turn Right onto NH-27 Lumding Bypass
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Towards Silchar via Haflong • Clear Route • Score 88/100
                  </p>
                </div>
              </div>

              {/* Speedometer */}
              <div className="text-center bg-slate-900 px-6 py-4 rounded-2xl border border-slate-800 shrink-0">
                <div className="text-4xl font-black font-mono text-emerald-400">
                  {selectedVehicle.speedKmH}
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  KM / HOUR
                </span>
              </div>
            </div>

            {selectedVehicle.rerouteAccepted && (
              <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-between text-xs text-emerald-200">
                <div className="flex items-center gap-2 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Safe Detour Active: Haflong High-Elevation Corridor</span>
                </div>
                <span className="font-mono font-bold text-emerald-300">ETA: {selectedVehicle.etaDestination}</span>
              </div>
            )}
          </div>
        )}

        {/* Audio Prompt Button */}
        <div className="text-center">
          <button
            onClick={handleSimulateVoiceAlert}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-800 inline-flex items-center gap-2"
          >
            <Volume2 className="w-4 h-4 text-cyan-400" />
            <span>Simulate In-Cab Audio Speech Synthesis</span>
          </button>
        </div>
      </div>

      {/* Bottom Nav Bar in HUD */}
      <div className="pt-4 border-t-2 border-slate-800 flex items-center justify-between text-xs text-slate-400">
        <button
          onClick={() => setActiveTab('vehicles')}
          className="hover:text-white font-semibold flex items-center gap-1"
        >
          ← Return to Fleet Tracking
        </button>

        <div className="text-right">
          <span className="font-mono text-cyan-400">CARGO: {selectedVehicle.cargoType}</span>
        </div>
      </div>
    </div>
  );
};
