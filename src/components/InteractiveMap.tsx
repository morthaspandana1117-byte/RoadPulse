import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { 
  RoadSegment, 
  Vehicle, 
  IncidentReport, 
  RiskLevel 
} from '../types';
import { useRoadPulse } from '../context/RoadPulseContext';
import { 
  Layers, 
  Maximize2, 
  AlertTriangle, 
  Truck, 
  Compass, 
  CloudRain, 
  CheckCircle2, 
  Clock, 
  ShieldAlert, 
  X,
  Gauge,
  Navigation,
  ArrowUpRight
} from 'lucide-react';

export const InteractiveMap: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  const { 
    roadSegments, 
    vehicles, 
    incidentReports, 
    selectedSegmentId, 
    setSelectedSegmentId,
    selectedSegment,
    selectedVehicleId,
    setSelectedVehicleId,
    selectedVehicle,
    routes,
    setActiveTab,
    rerouteVehicle
  } = useRoadPulse();

  // Layer Visibility Filters
  const [showCorridors, setShowCorridors] = useState(true);
  const [showVehicles, setShowVehicles] = useState(true);
  const [showIncidents, setShowIncidents] = useState(true);
  const [showHazardZones, setShowHazardZones] = useState(true);
  const [showRecommendedRoute, setShowRecommendedRoute] = useState(true);

  // Inspector drawer state
  const [inspectionItem, setInspectionItem] = useState<{
    type: 'segment' | 'vehicle' | 'incident';
    data: RoadSegment | Vehicle | IncidentReport;
  } | null>(null);

  // Color helper based on accessibility score
  const getScoreColor = (score: number) => {
    if (score >= 75) return '#10b981'; // Green
    if (score >= 60) return '#f59e0b'; // Yellow / Amber
    if (score >= 40) return '#f97316'; // Orange
    return '#ef4444'; // Red
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Center of North Eastern Region of India (approx. Assam/Meghalaya border)
    const map = L.map(mapContainerRef.current, {
      center: [25.8500, 93.3000],
      zoom: 7,
      minZoom: 6,
      maxZoom: 14,
      zoomControl: false,
    });

    // Add CartoDB Dark Matter Tiles for tactical command center look
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(map);

    L.control.zoom({ position: 'topright' }).addTo(map);

    const layerGroup = L.layerGroup().addTo(map);
    layerGroupRef.current = layerGroup;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Layers whenever state changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layerGroup = layerGroupRef.current;
    if (!map || !layerGroup) return;

    layerGroup.clearLayers();

    // 1. Hazard Risk Polygons / Warning Zones
    if (showHazardZones) {
      // Sonapur Landslide Critical Polygon
      const sonapurPolygon = L.circle([25.0210, 92.4870], {
        color: '#ef4444',
        fillColor: '#ef4444',
        fillOpacity: 0.22,
        weight: 2,
        dashArray: '5, 5',
        radius: 12000,
      }).addTo(layerGroup);

      sonapurPolygon.bindTooltip(
        '<div class="font-bold text-xs text-red-600">⚠️ ACTIVE LANDSLIDE ZONE: Sonapur–Ratacherra</div><div class="text-[10px]">High slope saturation (94.2%)</div>',
        { sticky: true }
      );

      // Pagla Pahar Gorge Rockfall Zone
      const paglaPaharCircle = L.circle([25.7480, 93.9210], {
        color: '#f97316',
        fillColor: '#f97316',
        fillOpacity: 0.18,
        weight: 2,
        dashArray: '4, 4',
        radius: 9000,
      }).addTo(layerGroup);

      paglaPaharCircle.bindTooltip(
        '<div class="font-bold text-xs text-amber-600">⚠️ ACTIVE ROCKFALL ZONE: Pagla Pahar</div><div class="text-[10px]">Boulder hazard along Chathe river</div>',
        { sticky: true }
      );

      // Brahmaputra Northern Flood Warning Zone
      const floodZone = L.circle([26.9800, 93.8800], {
        color: '#0284c7',
        fillColor: '#0284c7',
        fillOpacity: 0.18,
        weight: 2,
        dashArray: '6, 6',
        radius: 14000,
      }).addTo(layerGroup);

      floodZone.bindTooltip(
        '<div class="font-bold text-xs text-blue-600">🌊 FLOOD INUNDATION WATCH: Bihpuria Basin</div><div class="text-[10px]">Subansiri discharge surge</div>',
        { sticky: true }
      );
    }

    // 2. Road Corridors
    if (showCorridors) {
      roadSegments.forEach((segment) => {
        const isSelected = segment.id === selectedSegmentId;
        const color = getScoreColor(segment.accessibilityScore);

        // Glow backdrop for selected or critical
        if (isSelected || segment.accessibilityScore < 40) {
          L.polyline(segment.coordinates, {
            color: color,
            weight: isSelected ? 12 : 8,
            opacity: 0.35,
            lineCap: 'round',
          }).addTo(layerGroup);
        }

        const polyline = L.polyline(segment.coordinates, {
          color: color,
          weight: isSelected ? 6 : 5,
          opacity: 0.95,
          lineJoin: 'round',
        }).addTo(layerGroup);

        polyline.on('click', () => {
          setSelectedSegmentId(segment.id);
          setInspectionItem({ type: 'segment', data: segment });
        });

        // Tooltip
        polyline.bindTooltip(
          `<div class="p-1">
            <div class="font-bold text-xs flex items-center gap-1.5">
              <span style="color:${color}; font-weight:800;">${segment.corridorCode}</span>: ${segment.name}
            </div>
            <div class="text-[11px] text-slate-300 mt-0.5">
              Accessibility Score: <strong style="color:${color}; font-size:12px">${segment.accessibilityScore}/100</strong>
            </div>
            <div class="text-[10px] text-slate-400">
              Risk: ${segment.riskLevel.toUpperCase()} | Rain: ${segment.weatherImpact.rainfallMmPerHour} mm/h
            </div>
          </div>`,
          { sticky: true, className: 'leaflet-dark-tooltip' }
        );
      });
    }

    // 3. Recommended Safe Detour Route (Haflong bypass)
    if (showRecommendedRoute) {
      const safeRoute = routes.find(r => r.type === 'safe');
      if (safeRoute) {
        L.polyline(safeRoute.polylineCoords, {
          color: '#06b6d4',
          weight: 4,
          opacity: 0.85,
          dashArray: '8, 8',
        }).addTo(layerGroup);
      }
    }

    // 4. Incident Reports Markers (Pending & Verified)
    if (showIncidents) {
      incidentReports.forEach((report) => {
        const isVerified = report.status === 'verified';
        const isPending = report.status === 'pending_verification';
        const isRejected = report.status === 'rejected';

        if (isRejected) return;

        const iconHtml = `
          <div class="${isVerified ? 'pulsing-marker-red' : ''}" style="cursor:pointer;">
            <div style="
              width: 28px; 
              height: 28px; 
              border-radius: 50%; 
              background: ${isVerified ? '#ef4444' : '#f59e0b'}; 
              border: 2px solid #ffffff; 
              box-shadow: 0 4px 10px rgba(0,0,0,0.5);
              display: flex; 
              align-items: center; 
              justify-content: center;
              color: #ffffff;
              font-size: 14px;
            ">
              ${isVerified ? '⚠️' : '📍'}
            </div>
          </div>
        `;

        const customIcon = L.divIcon({
          html: iconHtml,
          className: 'incident-marker-icon',
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        });

        const marker = L.marker([report.lat, report.lng], { icon: customIcon }).addTo(layerGroup);

        marker.on('click', () => {
          setInspectionItem({ type: 'incident', data: report });
        });

        marker.bindTooltip(
          `<div class="p-1">
            <span class="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded ${isVerified ? 'bg-red-900 text-red-200' : 'bg-amber-900 text-amber-200'}">
              ${report.status.replace('_', ' ').toUpperCase()}
            </span>
            <div class="font-bold text-xs mt-1">${report.incidentType.toUpperCase()}</div>
            <div class="text-[11px] text-slate-300">${report.locationName}</div>
            <div class="text-[10px] text-slate-400">Blockage: ${report.blockagePercent}% | Confidence: ${report.verificationConfidence}%</div>
          </div>`,
          { sticky: true }
        );
      });
    }

    // 5. Vehicles Markers
    if (showVehicles) {
      vehicles.forEach((vehicle) => {
        const isCaution = vehicle.status === 'caution';
        const isRerouting = vehicle.status === 'rerouting';
        const isSelected = vehicle.id === selectedVehicleId;

        const vehicleColor = isRerouting ? '#06b6d4' : isCaution ? '#ef4444' : '#3b82f6';

        const vehicleHtml = `
          <div style="cursor:pointer; transform: scale(${isSelected ? '1.25' : '1.0'}); transition: transform 0.2s;">
            <div style="
              width: 30px; 
              height: 30px; 
              border-radius: 8px; 
              background: ${vehicleColor}; 
              border: 2px solid #ffffff; 
              box-shadow: 0 4px 12px rgba(0,0,0,0.5);
              display: flex; 
              flex-direction: column;
              align-items: center; 
              justify-content: center;
              color: #ffffff;
              font-size: 11px;
              font-weight: bold;
            ">
              🚚
            </div>
            <div style="
              position: absolute;
              bottom: -14px;
              left: 50%;
              transform: translateX(-50%);
              background: rgba(15, 23, 42, 0.9);
              color: #e2e8f0;
              font-size: 9px;
              font-family: monospace;
              padding: 1px 4px;
              border-radius: 4px;
              white-space: nowrap;
              border: 1px solid rgba(255,255,255,0.2);
            ">
              ${vehicle.id}
            </div>
          </div>
        `;

        const vehicleIcon = L.divIcon({
          html: vehicleHtml,
          className: 'vehicle-marker-icon',
          iconSize: [30, 30],
          iconAnchor: [15, 15],
        });

        const marker = L.marker([vehicle.currentLat, vehicle.currentLng], { icon: vehicleIcon }).addTo(layerGroup);

        marker.on('click', () => {
          setSelectedVehicleId(vehicle.id);
          setInspectionItem({ type: 'vehicle', data: vehicle });
        });

        marker.bindTooltip(
          `<div class="p-1">
            <div class="font-bold text-xs">${vehicle.id}: ${vehicle.vehicleType}</div>
            <div class="text-[11px] text-slate-300">Cargo: ${vehicle.cargoType}</div>
            <div class="text-[10px] text-slate-400">Speed: ${vehicle.speedKmH} km/h | Status: ${vehicle.status.toUpperCase()}</div>
            <div class="text-[10px] text-amber-300 font-semibold">Safe Exit: ${vehicle.safeExitStatus.replace(/_/g, ' ').toUpperCase()}</div>
          </div>`,
          { sticky: true }
        );
      });
    }

  }, [
    roadSegments, 
    vehicles, 
    incidentReports, 
    selectedSegmentId, 
    selectedVehicleId, 
    routes, 
    showCorridors, 
    showVehicles, 
    showIncidents, 
    showHazardZones, 
    showRecommendedRoute
  ]);

  // Zoom preset helper
  const zoomTo = (lat: number, lng: number, zoom: number) => {
    mapInstanceRef.current?.flyTo([lat, lng], zoom, { duration: 1.2 });
  };

  return (
    <div className="relative w-full h-[calc(100vh-130px)] bg-slate-950 overflow-hidden flex flex-col">
      {/* Top Map Control Bar */}
      <div className="absolute top-3 left-3 z-[1000] flex flex-wrap items-center gap-2 bg-slate-900/90 backdrop-blur-md p-2 rounded-xl border border-slate-800 shadow-xl max-w-[calc(100%-80px)]">
        <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5 px-2">
          <Layers className="w-3.5 h-3.5 text-blue-400" />
          GIS Layers:
        </span>

        <button
          onClick={() => setShowCorridors(!showCorridors)}
          className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
            showCorridors
              ? 'bg-blue-600/30 text-blue-300 border-blue-500/50 font-bold'
              : 'bg-slate-800/80 text-slate-400 border-slate-700'
          }`}
        >
          Corridors
        </button>

        <button
          onClick={() => setShowHazardZones(!showHazardZones)}
          className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
            showHazardZones
              ? 'bg-red-600/30 text-red-300 border-red-500/50 font-bold'
              : 'bg-slate-800/80 text-slate-400 border-slate-700'
          }`}
        >
          Hazard Zones
        </button>

        <button
          onClick={() => setShowIncidents(!showIncidents)}
          className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
            showIncidents
              ? 'bg-amber-600/30 text-amber-300 border-amber-500/50 font-bold'
              : 'bg-slate-800/80 text-slate-400 border-slate-700'
          }`}
        >
          Field Reports
        </button>

        <button
          onClick={() => setShowVehicles(!showVehicles)}
          className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
            showVehicles
              ? 'bg-emerald-600/30 text-emerald-300 border-emerald-500/50 font-bold'
              : 'bg-slate-800/80 text-slate-400 border-slate-700'
          }`}
        >
          Logistics Fleet
        </button>

        <button
          onClick={() => setShowRecommendedRoute(!showRecommendedRoute)}
          className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
            showRecommendedRoute
              ? 'bg-cyan-600/30 text-cyan-300 border-cyan-500/50 font-bold'
              : 'bg-slate-800/80 text-slate-400 border-slate-700'
          }`}
        >
          Safe Detours
        </button>

        <div className="h-4 w-px bg-slate-700 mx-1 hidden sm:block" />

        {/* Preset Quick Focus */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => zoomTo(25.85, 93.30, 7)}
            className="px-2 py-1 rounded text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            NER All
          </button>
          <button
            onClick={() => zoomTo(25.02, 92.48, 10)}
            className="px-2 py-1 rounded text-[11px] bg-red-950/60 hover:bg-red-900/60 text-red-300 border border-red-800/60 transition-colors"
          >
            NH-06 Sonapur
          </button>
          <button
            onClick={() => zoomTo(25.74, 93.92, 10)}
            className="px-2 py-1 rounded text-[11px] bg-amber-950/60 hover:bg-amber-900/60 text-amber-300 border border-amber-800/60 transition-colors"
          >
            NH-29 Pagla Pahar
          </button>
        </div>
      </div>

      {/* Dynamic Road Accessibility Legend */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-slate-900/90 backdrop-blur-md p-3 rounded-xl border border-slate-800 shadow-xl text-xs text-slate-200 pointer-events-auto max-w-xs">
        <h5 className="font-bold text-slate-300 mb-2 flex items-center justify-between">
          <span>Accessibility Score (0-100)</span>
          <Gauge className="w-3.5 h-3.5 text-blue-400" />
        </h5>
        <div className="space-y-1.5 text-[11px]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 shrink-0" />
              <span>80–100: Fully Accessible</span>
            </div>
            <span className="text-slate-400">Safe</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-500 shrink-0" />
              <span>60–79: Caution Advised</span>
            </div>
            <span className="text-slate-400">Moderate</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-orange-500 shrink-0" />
              <span>40–59: Moderate Disruption</span>
            </div>
            <span className="text-slate-400">High Risk</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500 shrink-0 animate-pulse" />
              <span>0–39: Critical / Blocked</span>
            </div>
            <span className="text-red-400 font-bold">Closed</span>
          </div>
        </div>
      </div>

      {/* Leaflet Map Canvas Container */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Inspection Drawer (Displays clicked road segment, vehicle, or incident) */}
      {inspectionItem && (
        <div className="absolute top-16 right-4 z-[1000] w-96 max-w-[calc(100%-2rem)] bg-slate-900/95 backdrop-blur-xl border border-slate-700 rounded-2xl shadow-2xl p-4 text-slate-100 animate-in fade-in slide-in-from-right-4 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              {inspectionItem.type === 'segment' && <Gauge className="w-4 h-4 text-blue-400" />}
              {inspectionItem.type === 'vehicle' && <Truck className="w-4 h-4 text-emerald-400" />}
              {inspectionItem.type === 'incident' && <AlertTriangle className="w-4 h-4 text-amber-400" />}
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {inspectionItem.type === 'segment' ? 'Road Segment Intelligence' : inspectionItem.type === 'vehicle' ? 'Logistics Vehicle Telemetry' : 'Field Incident Report'}
              </span>
            </div>
            <button
              onClick={() => setInspectionItem(null)}
              className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Segment Details */}
          {inspectionItem.type === 'segment' && (() => {
            const seg = inspectionItem.data as RoadSegment;
            const scoreColor = getScoreColor(seg.accessibilityScore);

            return (
              <div className="mt-3 space-y-3 text-xs">
                <div>
                  <h4 className="font-bold text-sm text-white">{seg.name}</h4>
                  <p className="text-slate-400 text-[11px]">{seg.state} | Chainage {seg.lengthKm} km</p>
                </div>

                {/* Score Big Indicator */}
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Accessibility Score</span>
                    <div className="text-2xl font-extrabold flex items-baseline gap-1" style={{ color: scoreColor }}>
                      {seg.accessibilityScore}
                      <span className="text-xs text-slate-400 font-normal">/ 100</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Risk Assessment</span>
                    <div className="text-xs font-bold uppercase" style={{ color: scoreColor }}>
                      {seg.riskLevel}
                    </div>
                    <span className="text-[10px] text-slate-500">{seg.lastUpdated}</span>
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="bg-slate-800/60 p-2 rounded-lg border border-slate-700/50">
                    <span className="text-slate-400">Hazard Threat:</span>
                    <p className="font-semibold text-slate-200 mt-0.5">{seg.hazardType}</p>
                  </div>
                  <div className="bg-slate-800/60 p-2 rounded-lg border border-slate-700/50">
                    <span className="text-slate-400">AI Confidence:</span>
                    <p className="font-semibold text-cyan-400 mt-0.5">{seg.aiConfidence}% Probability</p>
                  </div>
                  <div className="bg-slate-800/60 p-2 rounded-lg border border-slate-700/50">
                    <span className="text-slate-400">Precipitation:</span>
                    <p className="font-semibold text-blue-300 mt-0.5">{seg.weatherImpact.rainfallMmPerHour} mm/h</p>
                  </div>
                  <div className="bg-slate-800/60 p-2 rounded-lg border border-slate-700/50">
                    <span className="text-slate-400">Road Blockage:</span>
                    <p className="font-semibold text-amber-300 mt-0.5">{seg.roadBlockagePercent}% Estimated</p>
                  </div>
                </div>

                <p className="text-slate-300 text-[11px] leading-relaxed bg-slate-950/40 p-2.5 rounded-lg border border-slate-800">
                  {seg.description}
                </p>

                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => setActiveTab('score')}
                    className="flex-1 py-1.5 px-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1"
                  >
                    <span>View Formula</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => setActiveTab('routes')}
                    className="flex-1 py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-colors flex items-center justify-center gap-1"
                  >
                    <span>Reroute Plans</span>
                    <Navigation className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })()}

          {/* Vehicle Details */}
          {inspectionItem.type === 'vehicle' && (() => {
            const v = inspectionItem.data as Vehicle;
            return (
              <div className="mt-3 space-y-3 text-xs">
                <div>
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm text-white">{v.id} - {v.plateNumber}</h4>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      v.status === 'caution' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-blue-500/20 text-blue-400'
                    }`}>
                      {v.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-slate-400 text-[11px]">{v.vehicleType} | Driver: {v.driverName}</p>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Cargo Type:</span>
                    <span className="font-bold text-amber-300">{v.cargoType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Route Origin:</span>
                    <span className="text-slate-200">{v.startLocation}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Destination:</span>
                    <span className="text-slate-200">{v.destination}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Speed / Heading:</span>
                    <span className="font-mono text-cyan-400">{v.speedKmH} km/h | {v.heading}°</span>
                  </div>
                </div>

                {/* Safe Exit Window Status */}
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Safe Exit Recommendation</span>
                    <span className={`font-bold text-[11px] ${
                      v.safeExitStatus === 'proceed_with_caution' ? 'text-amber-400' :
                      v.safeExitStatus === 'safe_to_cross' ? 'text-emerald-400' : 'text-red-400'
                    }`}>
                      {v.safeExitStatus.replace(/_/g, ' ').toUpperCase()}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Distance to Risk: <strong className="text-slate-200">{v.distanceToRiskKm} km</strong> | ETA Margin: <strong className={v.safeExitMarginMinutes >= 0 ? 'text-emerald-400' : 'text-red-400'}>{v.safeExitMarginMinutes} mins</strong>
                  </p>
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => setActiveTab('safe_exit')}
                    className="flex-1 py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-colors"
                  >
                    Safe Exit Window
                  </button>
                  {v.rerouteRecommended && !v.rerouteAccepted ? (
                    <button
                      onClick={() => rerouteVehicle(v.id)}
                      className="flex-1 py-1.5 px-3 rounded-lg bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs transition-colors"
                    >
                      Trigger Reroute
                    </button>
                  ) : (
                    <button
                      onClick={() => setActiveTab('driver_hud')}
                      className="flex-1 py-1.5 px-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors"
                    >
                      Driver HUD
                    </button>
                  )}
                </div>
              </div>
            );
          })()}

          {/* Incident Details */}
          {inspectionItem.type === 'incident' && (() => {
            const inc = inspectionItem.data as IncidentReport;
            return (
              <div className="mt-3 space-y-3 text-xs">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      inc.status === 'verified' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}>
                      {inc.status.replace(/_/g, ' ').toUpperCase()}
                    </span>
                    <h4 className="font-bold text-sm text-white mt-1">{inc.incidentType.toUpperCase()}</h4>
                    <p className="text-slate-400 text-[11px]">{inc.locationName}</p>
                  </div>
                  <span className="text-[10px] text-slate-500">{inc.timestamp}</span>
                </div>

                {inc.photoUrl && (
                  <div className="rounded-xl overflow-hidden border border-slate-700 h-32 relative group">
                    <img 
                      src={inc.photoUrl} 
                      alt="Ground report" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                    />
                    <div className="absolute bottom-1 right-1 bg-slate-900/80 px-2 py-0.5 rounded text-[10px] text-slate-300">
                      Field Photo
                    </div>
                  </div>
                )}

                <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Reporter:</span>
                    <span className="text-slate-200">{inc.reporterName} ({inc.reporterType.replace('_', ' ')})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Carriageway Blockage:</span>
                    <span className="font-bold text-amber-400">{inc.blockagePercent}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Verification Confidence:</span>
                    <span className="font-bold text-emerald-400">{inc.verificationConfidence}% Match</span>
                  </div>
                </div>

                <p className="text-slate-300 text-[11px] leading-relaxed bg-slate-950/40 p-2.5 rounded-lg border border-slate-800">
                  {inc.description}
                </p>

                <div className="pt-1">
                  <button
                    onClick={() => setActiveTab('verification')}
                    className="w-full py-1.5 px-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1"
                  >
                    <span>Open in Verification Center</span>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};
