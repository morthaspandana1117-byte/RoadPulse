import React, { useState } from 'react';
import { useRoadPulse } from '../context/RoadPulseContext';
import { 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  CheckCircle2, 
  Database, 
  HardDrive, 
  ArrowRight, 
  Clock, 
  FileText, 
  Radio, 
  Zap,
  Layers
} from 'lucide-react';

export const OfflineSyncView: React.FC = () => {
  const { 
    isOnline, 
    toggleConnectivity, 
    offlineQueue, 
    syncOfflineQueue, 
    isSyncing,
    lastSyncTime,
    setActiveTab
  } = useRoadPulse();

  return (
    <div className="p-4 space-y-6 max-w-7xl mx-auto text-slate-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 rounded-2xl p-5 border border-indigo-500/20 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5" />
              Store-and-Forward Sync Engine
            </span>
            <span className="text-xs text-slate-400">EDGE PERSISTENCE BUFFER</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Offline-First Synchronization & Queue Inspector
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-3xl">
            Guarantees zero data loss in disconnected Himalayan mountain valleys. Field reports and driver observations are encrypted and queued locally, automatically syncing upon telemetry acquisition.
          </p>
        </div>

        {/* Connectivity Switch */}
        <div className="flex items-center gap-3 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Network Simulation</span>
            <span className={`text-xs font-black ${isOnline ? 'text-emerald-400' : 'text-amber-400'}`}>
              {isOnline ? 'ONLINE (4G/5G ACTIVE)' : 'OFFLINE (ZERO SIGNAL)'}
            </span>
          </div>
          <button
            onClick={toggleConnectivity}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              isOnline
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md'
                : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md animate-pulse'
            }`}
          >
            {isOnline ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
            <span>{isOnline ? 'Disconnect Network' : 'Reconnect & Sync'}</span>
          </button>
        </div>
      </div>

      {/* Sync Status KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-sm">
          <span className="text-slate-400 text-xs font-semibold block mb-1">Local Queue Depth</span>
          <div className="text-3xl font-black text-amber-400">{offlineQueue.length} Reports</div>
          <p className="text-[11px] text-slate-500 mt-1">Pending transmission to central gateway</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-sm">
          <span className="text-slate-400 text-xs font-semibold block mb-1">Last Successful Gateway Sync</span>
          <div className="text-xl font-bold font-mono text-white mt-1.5">{lastSyncTime}</div>
          <p className="text-[11px] text-emerald-400 font-semibold mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Integrity Check Passed
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-slate-400 text-xs font-semibold block mb-1">Synchronization Engine</span>
            <div className="text-sm font-bold text-white mt-1">
              {isSyncing ? (
                <span className="text-cyan-400 flex items-center gap-1.5">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Transferring packets...
                </span>
              ) : offlineQueue.length > 0 ? (
                <span className="text-amber-400">Waiting for stable uplink</span>
              ) : (
                <span className="text-emerald-400">All edge nodes in sync</span>
              )}
            </div>
          </div>

          <button
            onClick={syncOfflineQueue}
            disabled={offlineQueue.length === 0 || isSyncing}
            className={`mt-2 py-1.5 px-3 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 ${
              offlineQueue.length > 0 && !isSyncing
                ? 'bg-blue-600 hover:bg-blue-500 text-white'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>Force Immediate Flush</span>
          </button>
        </div>
      </div>

      {/* Main Queue Table & Architectural Diagram */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table of Buffered Reports (2 Cols) */}
        <div className="lg:col-span-2 bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-cyan-400" />
              Locally Stored Report Queue Buffer
            </h3>
            <button
              onClick={() => setActiveTab('reporting')}
              className="text-xs text-cyan-400 hover:underline flex items-center gap-1"
            >
              <span>+ Create Offline Report</span>
            </button>
          </div>

          {offlineQueue.length === 0 ? (
            <div className="p-12 text-center text-slate-500 space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
              <h4 className="font-bold text-slate-300 text-sm">Local Buffer Is Empty</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No reports currently queued. When officers submit reports in offline mode, they appear here until telemetry is recovered.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {offlineQueue.map((item) => (
                <div 
                  key={item.id}
                  className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold text-[10px] uppercase font-mono">
                        QUEUED OFFLINE
                      </span>
                      <span className="font-bold text-white text-xs">{item.incidentType.toUpperCase()}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Saved: {item.offlineSavedAt}
                    </span>
                  </div>

                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {item.description}
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-800/60 text-[10px] text-slate-400">
                    <div>Location: <span className="text-white font-semibold">{item.locationName}</span></div>
                    <div>Reporter: <span className="text-white font-semibold">{item.reporterName}</span></div>
                    <div>Blockage: <span className="text-amber-300 font-semibold">{item.blockagePercent}%</span></div>
                    <div>GPS: <span className="text-cyan-400 font-mono">{item.lat.toFixed(4)}, {item.lng.toFixed(4)}</span></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Store-and-Forward Architecture Explanation (1 Col) */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-xl space-y-4 text-xs">
          <h4 className="font-bold text-sm text-white uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-400" />
            Zero-Data Edge Architecture
          </h4>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            Standard civilian applications fail when mobile towers lose power during mountain cloudbursts. RoadPulse implements an resilient edge caching protocol:
          </p>

          <div className="space-y-2.5 text-[11px]">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <strong className="text-cyan-400 block mb-0.5 font-mono text-[10px]">1. Local SQLite / IndexedDB Buffer</strong>
              <span className="text-slate-400">All submissions serialize immediately to hardware flash storage with device GPS telemetry.</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <strong className="text-cyan-400 block mb-0.5 font-mono text-[10px]">2. Lightweight Delta Payloads</strong>
              <span className="text-slate-400">When connectivity is restored, messages compress into minimal 1.2 KB delta packets for 2G EDGE transmission.</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <strong className="text-cyan-400 block mb-0.5 font-mono text-[10px]">3. Conflict Resolution & Merge</strong>
              <span className="text-slate-400">The verification center orders submissions chronologically, fusing parallel driver reports seamlessly.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
