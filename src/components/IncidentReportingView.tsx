import React, { useState } from 'react';
import { useRoadPulse } from '../context/RoadPulseContext';
import { 
  IncidentType, 
  ReporterType 
} from '../types';
import { 
  FileText, 
  Camera, 
  MapPin, 
  Wifi, 
  WifiOff, 
  Send, 
  CheckCircle2, 
  AlertTriangle, 
  Upload, 
  Image as ImageIcon,
  Compass,
  Clock,
  Sparkles,
  ArrowRight
} from 'lucide-react';

const SAMPLE_PHOTOS = [
  {
    label: 'Sonapur Landslide (Slumping Rock & Mud)',
    url: 'https://images.unsplash.com/photo-1541888946425-d0fbb18f15f3?auto=format&fit=crop&w=600&q=80',
    type: 'landslide'
  },
  {
    label: 'Culvert & River Water Inundation',
    url: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=600&q=80',
    type: 'flood'
  },
  {
    label: 'Pagla Pahar Boulder Rockfall',
    url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=600&q=80',
    type: 'rockfall'
  },
  {
    label: 'Mountain Bridge Approach Washout',
    url: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=600&q=80',
    type: 'bridge_damage'
  }
];

export const IncidentReportingView: React.FC = () => {
  const { 
    roadSegments, 
    isOnline, 
    toggleConnectivity, 
    submitIncidentReport, 
    offlineQueue,
    incidentReports,
    setActiveTab
  } = useRoadPulse();

  // Form State
  const [reporterName, setReporterName] = useState('Officer Anupam Sarmah');
  const [reporterId, setReporterId] = useState('NER-FO-204');
  const [reporterType, setReporterType] = useState<ReporterType>('field_officer');
  const [incidentType, setIncidentType] = useState<IncidentType>('landslide');
  const [severity, setSeverity] = useState<'low' | 'moderate' | 'high' | 'critical'>('high');
  const [blockagePercent, setBlockagePercent] = useState<number>(75);
  const [selectedCorridorId, setSelectedCorridorId] = useState<string>('seg-nh6-ratacherra');
  const [locationName, setLocationName] = useState('KM 142.5, Sonapur Bypass, East Jaintia Hills');
  const [lat, setLat] = useState<number>(25.0210);
  const [lng, setLng] = useState<number>(92.4870);
  const [description, setDescription] = useState(
    'Significant slope failure on eastern hillside. Rocks and thick clay slurry obstructing major northbound lane. Single line passage barely feasible.'
  );
  const [photoUrl, setPhotoUrl] = useState<string>(SAMPLE_PHOTOS[0].url);
  const [submittedBanner, setSubmittedBanner] = useState<{ id: string; offline: boolean; message: string } | null>(null);

  // File upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPhotoUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Auto GPS coordinates simulator
  const handleAutoGPS = () => {
    const matched = roadSegments.find(s => s.id === selectedCorridorId);
    if (matched && matched.coordinates.length > 2) {
      const midPoint = matched.coordinates[Math.floor(matched.coordinates.length / 2)];
      setLat(midPoint[0]);
      setLng(midPoint[1]);
      setLocationName(`Chainage KM 118, ${matched.name}`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const matched = roadSegments.find(s => s.id === selectedCorridorId);

    submitIncidentReport({
      reporterName,
      reporterId,
      reporterType,
      incidentType,
      severity,
      blockagePercent,
      corridorId: selectedCorridorId,
      corridorName: matched?.name || 'High Risk Corridor',
      locationName,
      lat,
      lng,
      description,
      photoUrl,
    });

    setSubmittedBanner({
      id: `rep-${Date.now().toString().slice(-4)}`,
      offline: !isOnline,
      message: !isOnline 
        ? "Report saved offline and will synchronize when connectivity returns." 
        : "Report submitted successfully and added to the Verification Center queue as 'Pending Verification'."
    });

    // Reset form fields
    setDescription('');
    setBlockagePercent(50);

    setTimeout(() => {
      setSubmittedBanner(null);
    }, 5500);
  };

  return (
    <div className="p-4 space-y-6 max-w-7xl mx-auto text-slate-100">
      {/* Header & Connectivity Simulation Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 rounded-2xl p-5 border border-indigo-500/20 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5" />
              Field Operations Module
            </span>
            <span className="text-xs text-slate-400">STAGE 2: REPORT</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Incident Reporting
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-3xl">
            Submit and track real-world road condition reports.
          </p>
        </div>

        {/* Connectivity Simulation Toggle Button */}
        <div className="flex items-center gap-3 bg-slate-950 p-2 rounded-xl border border-slate-800">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Remote Uplink</span>
            <span className={`text-xs font-black ${isOnline ? 'text-emerald-400' : 'text-amber-400'}`}>
              {isOnline ? 'ONLINE' : 'OFFLINE MODE'}
            </span>
          </div>
          <button
            onClick={toggleConnectivity}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              isOnline
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md'
                : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md animate-pulse'
            }`}
          >
            {isOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
            <span>{isOnline ? 'Simulate Signal Loss' : 'Restore Signal'}</span>
          </button>
        </div>
      </div>

      {/* Success / Queued Flash Banner */}
      {submittedBanner && (
        <div className={`p-4 rounded-xl border flex items-center justify-between shadow-xl animate-in fade-in slide-in-from-top-2 duration-300 ${
          submittedBanner.offline
            ? 'bg-amber-950/80 border-amber-500 text-amber-200'
            : 'bg-emerald-950/80 border-emerald-500 text-emerald-200'
        }`}>
          <div className="flex items-center gap-3">
            {submittedBanner.offline ? (
              <WifiOff className="w-5 h-5 text-amber-400 shrink-0" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            )}
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider">
                {submittedBanner.offline ? 'Saved Offline' : 'Report Submitted'}
              </h4>
              <p className="text-[11px] text-slate-300 mt-0.5 font-medium">
                {submittedBanner.message}
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveTab(submittedBanner.offline ? 'offline_sync' : 'verification')}
            className="px-3 py-1 rounded-lg bg-slate-900/90 text-xs font-bold border border-slate-700 hover:bg-slate-800 transition-colors shrink-0"
          >
            {submittedBanner.offline ? 'Inspect Queue' : 'Open Verification'}
          </button>
        </div>
      )}

      {/* Main Grid: Reporting Form + Live Guidance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Panel (2 Cols) */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-400" />
              Incident Report Submission Form
            </h3>
            <span className="text-[11px] text-slate-400">
              *Mandatory field data for AI fusion
            </span>
          </div>

          {/* Row 1: Reporter Info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-300 uppercase block mb-1">Reporter Name</label>
              <input
                type="text"
                value={reporterName}
                onChange={(e) => setReporterName(e.target.value)}
                required
                className="w-full bg-slate-950 text-xs text-white px-3 py-2 rounded-lg border border-slate-800 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-300 uppercase block mb-1">Reporter ID / Badge</label>
              <input
                type="text"
                value={reporterId}
                onChange={(e) => setReporterId(e.target.value)}
                required
                className="w-full bg-slate-950 text-xs text-white px-3 py-2 rounded-lg border border-slate-800 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-300 uppercase block mb-1">Reporter Role</label>
              <select
                value={reporterType}
                onChange={(e) => setReporterType(e.target.value as ReporterType)}
                className="w-full bg-slate-950 text-xs text-white px-3 py-2 rounded-lg border border-slate-800 focus:outline-none focus:border-blue-500"
              >
                <option value="field_officer">Field Officer / Highway Patrol</option>
                <option value="driver">Logistics Fleet Driver</option>
                <option value="local_citizen">Local Citizen / Village Head</option>
              </select>
            </div>
          </div>

          {/* Row 2: Incident Type, Severity & Corridor */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-300 uppercase block mb-1">Hazard / Incident Type</label>
              <select
                value={incidentType}
                onChange={(e) => setIncidentType(e.target.value as IncidentType)}
                className="w-full bg-slate-950 text-xs text-white px-3 py-2 rounded-lg border border-slate-800 focus:outline-none focus:border-blue-500"
              >
                <option value="landslide">Landslide / Mudflow</option>
                <option value="flood">Flood / River Overflow</option>
                <option value="rockfall">Rockfall / Boulder Slip</option>
                <option value="bridge_damage">Bridge Damage / Scour</option>
                <option value="road_blockage">Road Blockage / Fallen Tree</option>
                <option value="accident">Accident / Vehicle Breakdown</option>
                <option value="severe_weather">Severe Cloudburst / Fog</option>
                <option value="other">Other Road Impediment</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-300 uppercase block mb-1">Severity Level</label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as any)}
                className="w-full bg-slate-950 text-xs text-white px-3 py-2 rounded-lg border border-slate-800 focus:outline-none focus:border-blue-500"
              >
                <option value="critical">Critical (Road Impassable)</option>
                <option value="high">High (Major Congestion / Single Lane)</option>
                <option value="moderate">Moderate (Slow Moving / Caution)</option>
                <option value="low">Low (Minor Debris on Shoulder)</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-300 uppercase block mb-1">Affected Highway Corridor</label>
              <select
                value={selectedCorridorId}
                onChange={(e) => setSelectedCorridorId(e.target.value)}
                className="w-full bg-slate-950 text-xs text-white px-3 py-2 rounded-lg border border-slate-800 focus:outline-none focus:border-blue-500"
              >
                {roadSegments.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.corridorCode} ({s.name})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 3: Road Blockage Percentage Slider */}
          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-300 uppercase tracking-wide">
                Carriageway Blockage Percentage: <strong className="text-amber-400 text-sm font-mono">{blockagePercent}%</strong>
              </span>
              <span className="text-[11px] text-slate-400 font-semibold">
                {blockagePercent < 30 ? 'Passable with Minor Slowdown' : blockagePercent < 70 ? 'Single Lane Alternating Traffic' : 'Full Carriageway Closed'}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={blockagePercent}
              onChange={(e) => setBlockagePercent(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            {/* Visual Lane Graphic */}
            <div className="grid grid-cols-4 gap-1 h-3 rounded overflow-hidden bg-slate-800">
              <div className={`h-full ${blockagePercent >= 25 ? 'bg-red-500' : 'bg-emerald-500'}`} title="Shoulder Left" />
              <div className={`h-full ${blockagePercent >= 50 ? 'bg-red-500' : 'bg-emerald-500'}`} title="Lane Northbound" />
              <div className={`h-full ${blockagePercent >= 75 ? 'bg-red-500' : 'bg-emerald-500'}`} title="Lane Southbound" />
              <div className={`h-full ${blockagePercent >= 100 ? 'bg-red-500' : 'bg-emerald-500'}`} title="Shoulder Right" />
            </div>
          </div>

          {/* Row 4: GPS Coordinates & Auto-Fix */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="text-[11px] font-bold text-slate-300 uppercase block mb-1">Specific Chainage / Landmark</label>
              <input
                type="text"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                required
                className="w-full bg-slate-950 text-xs text-white px-3 py-2 rounded-lg border border-slate-800 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-300 uppercase block mb-1">GPS Telemetry</label>
              <div className="flex flex-col gap-1.5">
                <input
                  type="text"
                  readOnly
                  value={`${lat.toFixed(4)}, ${lng.toFixed(4)}`}
                  className="w-full bg-slate-950 font-mono text-[11px] text-cyan-400 px-2.5 py-2 rounded-lg border border-slate-800"
                />
                <button
                  type="button"
                  onClick={handleAutoGPS}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 text-[11px] font-bold border border-slate-700 transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                  title="Simulate Mobile GPS Auto-Fix"
                >
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Use Simulated GPS</span>
                </button>
              </div>
            </div>
          </div>

          {/* Row 5: Detailed Description */}
          <div>
            <label className="text-[11px] font-bold text-slate-300 uppercase block mb-1">Field Observations & Ground Situation</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full bg-slate-950 text-xs text-white p-3 rounded-lg border border-slate-800 focus:outline-none focus:border-blue-500 resize-none"
            />
          </div>

          {/* Photo Selector & Upload */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-slate-300 uppercase block">
                Field Evidence Photo (Upload or Select Preset)
              </label>
              <label className="cursor-pointer text-[11px] text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Custom Image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {SAMPLE_PHOTOS.map((p, i) => (
                <div
                  key={i}
                  onClick={() => setPhotoUrl(p.url)}
                  className={`cursor-pointer rounded-xl overflow-hidden border-2 transition-all p-1 bg-slate-950 ${
                    photoUrl === p.url ? 'border-blue-500 ring-2 ring-blue-500/30' : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <img src={p.url} alt={p.label} className="w-full h-16 object-cover rounded-lg" />
                  <p className="text-[10px] text-slate-300 mt-1 font-semibold truncate">{p.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-2 flex items-center justify-between">
            <div className="flex items-center gap-2 text-[11px]">
              {isOnline ? (
                <span className="text-emerald-400 flex items-center gap-1 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  Online Gateway Active
                </span>
              ) : (
                <span className="text-amber-400 flex items-center gap-1 font-bold">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  Offline Storage Engine Active
                </span>
              )}
            </div>

            <button
              type="submit"
              className={`px-5 py-2.5 rounded-xl font-bold text-xs shadow-lg transition-all flex items-center gap-2 ${
                isOnline
                  ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/20'
                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Incident Report</span>
              <span className="text-[10px] opacity-80 px-1.5 py-0.5 rounded bg-black/20 font-mono">
                {isOnline ? 'Online' : 'Offline'}
              </span>
            </button>
          </div>
        </form>

        {/* Right Info: Ground Reporting Guidelines & Queue (1 Col) */}
        <div className="space-y-4">
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4 shadow-xl text-xs space-y-3">
            <h4 className="font-bold text-sm text-white flex items-center gap-2">
              <Compass className="w-4 h-4 text-emerald-400" />
              Field Officer SOP & Offline Flow
            </h4>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              In remote Himalayan ravines with no cellular uplink, RoadPulse operates in local persistence mode. Reports are indexed with cryptographic timestamps and stored in the browser's persistent state.
            </p>

            <div className="space-y-2 text-[11px]">
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <strong className="text-white block mb-0.5">1. Ground Truth Verification</strong>
                <span className="text-slate-400">Reports do not instantly block roads until cross-verified by sensor telemetry or authorized personnel.</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <strong className="text-white block mb-0.5">2. High-Accuracy Chainage</strong>
                <span className="text-slate-400">Always supply highway kilometer markers to avoid false segment tagging.</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <strong className="text-white block mb-0.5">3. Multi-Source Fusion</strong>
                <span className="text-slate-400">System weighs driver transmissions against local weather radar to prevent fraudulent reports.</span>
              </div>
            </div>
          </div>

          {/* Live Offline Queue Snapshot */}
          <div className="bg-slate-900 rounded-2xl border border-amber-900/40 p-4 shadow-xl text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
              <h4 className="font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <WifiOff className="w-3.5 h-3.5" />
                Offline Reports Buffer
              </h4>
              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold font-mono text-[10px]">
                {offlineQueue.length} Queued
              </span>
            </div>

            {offlineQueue.length === 0 ? (
              <p className="text-slate-500 text-[11px] py-4 text-center">
                Buffer clear. All field reports synced with central server.
              </p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {offlineQueue.map((item) => (
                  <div key={item.id} className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-[11px]">
                    <div className="flex justify-between font-bold text-white">
                      <span>{item.incidentType.toUpperCase()}</span>
                      <span className="text-amber-400 font-mono text-[10px]">{item.offlineSavedAt}</span>
                    </div>
                    <p className="text-slate-400 text-[10px] truncate">{item.locationName}</p>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => setActiveTab('offline_sync')}
              className="w-full mt-3 py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Manage Synchronization Queue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
