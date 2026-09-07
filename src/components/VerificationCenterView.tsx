import React, { useState } from 'react';
import { useRoadPulse } from '../context/RoadPulseContext';
import { IncidentReport } from '../types';
import { 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  ShieldAlert, 
  MapPin, 
  Calendar, 
  User, 
  CloudRain, 
  AlertTriangle, 
  Sparkles, 
  Search, 
  ArrowRight,
  Radio,
  FileCheck2,
  Gauge
} from 'lucide-react';

export const VerificationCenterView: React.FC = () => {
  const { 
    incidentReports, 
    verifyReport, 
    rejectReport, 
    markReportUncertain,
    roadSegments,
    setActiveTab,
    setSelectedSegmentId
  } = useRoadPulse();

  const [selectedReportId, setSelectedReportId] = useState<string>(
    incidentReports.find(r => r.status === 'pending_verification')?.id || incidentReports[0]?.id || ''
  );

  const selectedReport = incidentReports.find(r => r.id === selectedReportId) || incidentReports[0];
  const matchedSegment = roadSegments.find(s => s.id === selectedReport?.corridorId);

  const pendingCount = incidentReports.filter(r => r.status === 'pending_verification').length;
  const verifiedCount = incidentReports.filter(r => r.status === 'verified').length;

  return (
    <div className="p-4 space-y-6 max-w-7xl mx-auto text-slate-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 rounded-2xl p-5 border border-indigo-500/20 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Human + AI Ground Truth Fusion
            </span>
            <span className="text-xs text-slate-400">STAGE 3: VERIFY</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Verification Center & Intelligence Fusion Portal
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-3xl">
            Cross-references incoming field submissions with multi-sensor Doppler radar, satellite SAR soil saturation, historical vulnerability, and nearby radio transmissions before executing system-wide cascade updates.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-xl border border-slate-800 text-xs">
          <span className="text-amber-400 font-bold">{pendingCount} Pending</span>
          <span className="text-slate-600">|</span>
          <span className="text-emerald-400 font-bold">{verifiedCount} Verified</span>
        </div>
      </div>

      {/* Main Grid: Reports List (1 Col) + Fusion Inspector (2 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Reports Queue (1 Col) */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4 shadow-xl flex flex-col h-[640px]">
          <div className="pb-3 border-b border-slate-800 flex items-center justify-between">
            <h3 className="font-bold text-xs text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-blue-400" />
              Incoming Reports Queue ({incidentReports.length})
            </h3>
          </div>

          <div className="flex-1 overflow-y-auto mt-3 space-y-2 pr-1">
            {incidentReports.map((report) => {
              const isSelected = report.id === selectedReportId;
              const isPending = report.status === 'pending_verification';
              const isVerified = report.status === 'verified';
              const isRejected = report.status === 'rejected';

              return (
                <div
                  key={report.id}
                  onClick={() => setSelectedReportId(report.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer text-xs ${
                    isSelected
                      ? 'bg-indigo-950/60 border-indigo-500 shadow-md ring-1 ring-indigo-500/40'
                      : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-850'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-[9px] uppercase font-extrabold px-2 py-0.5 rounded-full ${
                      isVerified ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                      isPending ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse' :
                      isRejected ? 'bg-slate-800 text-slate-400' : 'bg-blue-500/20 text-blue-300'
                    }`}>
                      {report.status.replace(/_/g, ' ')}
                    </span>
                    <span className="text-[10px] text-slate-500">{report.timestamp}</span>
                  </div>

                  <h4 className="font-bold text-white text-xs mt-1">
                    {report.incidentType.toUpperCase()} ({report.blockagePercent}% Blockage)
                  </h4>
                  <p className="text-slate-400 text-[11px] truncate mt-0.5">{report.locationName}</p>

                  <div className="mt-2 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-400">
                    <span>By: {report.reporterName}</span>
                    <span className="text-emerald-400 font-bold">
                      {report.verificationConfidence}% Confidence
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Fusion Deep-Dive Inspector (2 Cols) */}
        {selectedReport ? (
          <div className="lg:col-span-2 bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-xl space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              {/* Top Meta Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      selectedReport.status === 'verified' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                      selectedReport.status === 'pending_verification' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-slate-800 text-slate-400'
                    }`}>
                      Status: {selectedReport.status.replace(/_/g, ' ')}
                    </span>
                    <span className="text-xs font-mono text-slate-400">ID: {selectedReport.id}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mt-1">
                    {selectedReport.incidentType.toUpperCase()} - {selectedReport.locationName}
                  </h3>
                </div>

                {/* Big Verification Confidence Metric */}
                <div className="text-right bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">AI Fusion Confidence</span>
                  <div className="text-2xl font-black text-emerald-400">
                    {selectedReport.verificationConfidence}%
                  </div>
                  <span className="text-[10px] text-slate-500">Multi-factor match</span>
                </div>
              </div>

              {/* Photo & Description Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {selectedReport.photoUrl && (
                  <div className="rounded-xl overflow-hidden border border-slate-700 relative h-40 group">
                    <img 
                      src={selectedReport.photoUrl} 
                      alt="Site Evidence" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                    />
                    <div className="absolute bottom-2 left-2 bg-slate-950/80 px-2 py-0.5 rounded text-[10px] text-slate-300 font-mono">
                      Field Camera Capture
                    </div>
                  </div>
                )}

                <div className={`${selectedReport.photoUrl ? 'md:col-span-2' : 'md:col-span-3'} bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 space-y-2 text-xs`}>
                  <h5 className="font-bold text-slate-300 text-xs">Field Observations</h5>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {selectedReport.description}
                  </p>

                  <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] border-t border-slate-800 text-slate-400">
                    <div>
                      <span>Reporter:</span> <strong className="text-white">{selectedReport.reporterName}</strong>
                    </div>
                    <div>
                      <span>Role:</span> <strong className="text-white">{selectedReport.reporterType.replace('_', ' ')}</strong>
                    </div>
                    <div>
                      <span>Chainage GPS:</span> <strong className="text-cyan-400 font-mono">{selectedReport.lat.toFixed(4)}, {selectedReport.lng.toFixed(4)}</strong>
                    </div>
                    <div>
                      <span>Reported Blockage:</span> <strong className="text-amber-400">{selectedReport.blockagePercent}% Carriageway</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Multi-Signal Fusion Corroboration Checklist (Human + AI Fusion) */}
              <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-3">
                <h4 className="font-bold text-xs text-white uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  Corroborating Intelligence Signals (AI Ground Truth Fusion)
                </h4>

                <div className="space-y-2">
                  {selectedReport.reasons.map((reason, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 p-2 rounded-lg bg-slate-900 border border-slate-800 text-xs">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="text-slate-300">{reason}</span>
                    </div>
                  ))}

                  {matchedSegment && (
                    <div className="flex items-start gap-2.5 p-2 rounded-lg bg-slate-900 border border-slate-800 text-xs">
                      <CloudRain className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                      <span className="text-slate-300">
                        IMD Precipitation sensor confirms <strong>{matchedSegment.weatherImpact.rainfallMmPerHour} mm/h</strong> rainfall on this corridor.
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Decision Action Buttons */}
            <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="text-[11px] text-slate-400">
                Action will automatically recalculate Dynamic Road Accessibility Score & alert affected logistics vehicles.
              </div>

              <div className="flex items-center gap-2">
                {selectedReport.status === 'pending_verification' && (
                  <>
                    <button
                      onClick={() => rejectReport(selectedReport.id)}
                      className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors flex items-center gap-1.5"
                    >
                      <XCircle className="w-3.5 h-3.5 text-rose-400" />
                      <span>Reject (False Alarm)</span>
                    </button>

                    <button
                      onClick={() => markReportUncertain(selectedReport.id)}
                      className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors flex items-center gap-1.5"
                    >
                      <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                      <span>Request Drone Check</span>
                    </button>

                    <button
                      onClick={() => {
                        verifyReport(selectedReport.id);
                        if (matchedSegment) setSelectedSegmentId(matchedSegment.id);
                      }}
                      className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2"
                    >
                      <FileCheck2 className="w-4 h-4" />
                      <span>Verify Report (Confirm Ground Truth)</span>
                    </button>
                  </>
                )}

                {selectedReport.status === 'verified' && (
                  <div className="flex items-center gap-3">
                    <span className="text-emerald-400 font-bold text-xs flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      Verified & Propagated Through System
                    </span>
                    <button
                      onClick={() => {
                        if (matchedSegment) setSelectedSegmentId(matchedSegment.id);
                        setActiveTab('score');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors flex items-center gap-1"
                    >
                      <span>View Score Drop (28/100)</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-2 bg-slate-900 rounded-2xl border border-slate-800 p-8 flex items-center justify-center text-slate-500 text-xs">
            Select a report from the queue to inspect AI fusion telemetry.
          </div>
        )}
      </div>
    </div>
  );
};
