import { 
  RoadSegment, 
  IncidentReport, 
  HazardPrediction, 
  Vehicle, 
  RouteOption, 
  AlertItem, 
  LearningRecord,
  CorridorVulnerabilityStat 
} from '../types';

export const INITIAL_ROAD_SEGMENTS: RoadSegment[] = [
  {
    id: 'seg-nh6-ratacherra',
    name: 'NH-06 Shillong–Silchar Corridor (Sonapur–Ratacherra Section)',
    corridorCode: 'NH-06',
    state: 'Meghalaya / Assam border',
    coordinates: [
      [25.5788, 91.8933], // Shillong
      [25.4412, 92.1985], // Jowai
      [25.1856, 92.3562], // Ladrymbai
      [25.0210, 92.4870], // Sonapur Tunnel (High Risk)
      [24.9650, 92.5930], // Ratacherra Border
      [24.8333, 92.7789], // Silchar
    ],
    startCity: 'Shillong',
    endCity: 'Silchar',
    lengthKm: 215,
    baseCondition: 78,
    accessibilityScore: 72, // Initially 72, can drop to 28 during scenario
    riskLevel: 'moderate',
    hazardType: 'Landslide / Hill Cutting Slump',
    aiConfidence: 86,
    weatherImpact: {
      rainfallMmPerHour: 38.5,
      description: 'Heavy continuous orographic rainfall (78mm in 6 hrs)',
      temperatureC: 19,
      visibilityMeters: 650,
    },
    terrainVulnerability: 89,
    verifiedIncidentCount: 1,
    lastUpdated: '12 mins ago',
    roadBlockagePercent: 20,
    description: 'Vital freight artery for Tripura, Mizoram, and Barak Valley. Critical landslide vulnerability at Sonapur mudslide zone.',
    closurePredictionMinutes: 90,
  },
  {
    id: 'seg-nh29-paglapahar',
    name: 'NH-29 Dimapur–Kohima Corridor (Chümoukedima–Pagla Pahar)',
    corridorCode: 'NH-29',
    state: 'Nagaland',
    coordinates: [
      [25.9095, 93.7266], // Dimapur
      [25.8120, 93.8150], // Chümoukedima
      [25.7480, 93.9210], // Pagla Pahar Gorge
      [25.6751, 94.1086], // Kohima
    ],
    startCity: 'Dimapur',
    endCity: 'Kohima',
    lengthKm: 74,
    baseCondition: 82,
    accessibilityScore: 36,
    riskLevel: 'high',
    hazardType: 'Active Rockfall & Debris Flow',
    aiConfidence: 91,
    weatherImpact: {
      rainfallMmPerHour: 22.0,
      description: 'Intermittent heavy showers with fog',
      temperatureC: 17,
      visibilityMeters: 400,
    },
    terrainVulnerability: 94,
    verifiedIncidentCount: 2,
    lastUpdated: '5 mins ago',
    roadBlockagePercent: 55,
    description: 'Steep vertical gorges along Chathe river. Boulder fall alert active for heavy transport trucks.',
    closurePredictionMinutes: 45,
  },
  {
    id: 'seg-nh27-nagaon',
    name: 'NH-27 East-West Corridor (Guwahati–Nagaon–Lumding)',
    corridorCode: 'NH-27',
    state: 'Assam',
    coordinates: [
      [26.1445, 91.7362], // Guwahati
      [26.1820, 92.1450], // Jagiroad
      [26.3450, 92.6840], // Nagaon
      [25.7500, 93.1700], // Lumding
    ],
    startCity: 'Guwahati',
    endCity: 'Lumding',
    lengthKm: 182,
    baseCondition: 92,
    accessibilityScore: 88,
    riskLevel: 'safe',
    hazardType: 'None (Clear)',
    aiConfidence: 95,
    weatherImpact: {
      rainfallMmPerHour: 6.2,
      description: 'Moderate passing overcast drizzle',
      temperatureC: 28,
      visibilityMeters: 3000,
    },
    terrainVulnerability: 24,
    verifiedIncidentCount: 0,
    lastUpdated: '2 mins ago',
    roadBlockagePercent: 0,
    description: '4-lane expressway standard corridor. Clear movement for all interstate freight.',
  },
  {
    id: 'seg-nh15-brahmaputra',
    name: 'NH-15 Northern Bank Highway (Tezpur–Bihpuria–North Lakhimpur)',
    corridorCode: 'NH-15',
    state: 'Assam',
    coordinates: [
      [26.6528, 92.7926], // Tezpur
      [26.7900, 93.3500], // Jamugurihat
      [26.9800, 93.8800], // Bihpuria
      [27.2300, 94.1000], // North Lakhimpur
    ],
    startCity: 'Tezpur',
    endCity: 'North Lakhimpur',
    lengthKm: 165,
    baseCondition: 75,
    accessibilityScore: 48,
    riskLevel: 'moderate',
    hazardType: 'Flash Flood Overflow & Culvert Erosion',
    aiConfidence: 84,
    weatherImpact: {
      rainfallMmPerHour: 42.0,
      description: 'Monsoon catchment surge from Subansiri river',
      temperatureC: 25,
      visibilityMeters: 1200,
    },
    terrainVulnerability: 72,
    verifiedIncidentCount: 1,
    lastUpdated: '18 mins ago',
    roadBlockagePercent: 35,
    description: 'Low-lying culverts submerged near Bihpuria bypass. Single-lane convoy pilot active.',
    closurePredictionMinutes: 120,
  },
  {
    id: 'seg-nh102-imphal',
    name: 'NH-102 Asian Highway 1 (Imphal–Kakching–Moreh)',
    corridorCode: 'NH-102',
    state: 'Manipur',
    coordinates: [
      [24.8170, 93.9368], // Imphal
      [24.6300, 93.9800], // Thoubal
      [24.4900, 94.0200], // Kakching
      [24.2400, 94.3000], // Tengnoupal (Hill Pass)
      [24.2500, 94.3100], // Moreh Border
    ],
    startCity: 'Imphal',
    endCity: 'Moreh',
    lengthKm: 110,
    baseCondition: 80,
    accessibilityScore: 68,
    riskLevel: 'moderate',
    hazardType: 'Minor Mud Inundation at Tengnoupal',
    aiConfidence: 79,
    weatherImpact: {
      rainfallMmPerHour: 18.0,
      description: 'Moderate rain with hill mist',
      temperatureC: 21,
      visibilityMeters: 800,
    },
    terrainVulnerability: 65,
    verifiedIncidentCount: 1,
    lastUpdated: '34 mins ago',
    roadBlockagePercent: 15,
    description: 'International cross-border trade route to Myanmar. Escorted transit recommended.',
  },
  {
    id: 'seg-nh13-tawang',
    name: 'NH-13 Trans-Arunachal Highway (Pasighat–Dambuk–Roing)',
    corridorCode: 'NH-13',
    state: 'Arunachal Pradesh',
    coordinates: [
      [28.0660, 95.3300], // Pasighat
      [28.1400, 95.5800], // Dambuk
      [28.1600, 95.8300], // Roing
    ],
    startCity: 'Pasighat',
    endCity: 'Roing',
    lengthKm: 98,
    baseCondition: 70,
    accessibilityScore: 18,
    riskLevel: 'critical',
    hazardType: 'Bridge Approach Embankment Washout',
    aiConfidence: 94,
    weatherImpact: {
      rainfallMmPerHour: 55.4,
      description: 'Extreme torrential cloudburst event (110mm / 12h)',
      temperatureC: 15,
      visibilityMeters: 300,
    },
    terrainVulnerability: 96,
    verifiedIncidentCount: 3,
    lastUpdated: '8 mins ago',
    roadBlockagePercent: 100,
    description: 'Dibang river tributary flash surge has compromised bridge pier approach at km 42. Road impassable for heavy commercial vehicles.',
    closurePredictionMinutes: 0,
  }
];

export const INITIAL_HAZARD_PREDICTIONS: HazardPrediction[] = [
  {
    id: 'pred-nh6-landslide',
    corridorId: 'seg-nh6-ratacherra',
    roadName: 'NH-06 Shillong–Silchar Corridor',
    state: 'Meghalaya / Assam',
    hazardType: 'Catastrophic Hill Cutting Landslide',
    disruptionProbability: 82,
    predictionConfidence: 'High',
    expectedRiskWindow: 'Next 3 to 4 hours',
    expectedRiskMinutes: 210,
    contributingFactors: [
      { name: 'Antecedent Rainfall Intensity (72h cumulative)', weight: 0.35, value: '142 mm', impactScore: 90 },
      { name: 'Slope Steepness & Lithology (Shale/Sandstone)', weight: 0.25, value: 'Grade > 48° (High sheer shear stress)', impactScore: 88 },
      { name: 'Historical Landslide Recurrence Index', weight: 0.20, value: '7 recorded slips at Sonapur in past 3 monsoon cycles', impactScore: 82 },
      { name: 'Sub-surface Soil Moisture Saturation (Sentinel-1 SAR proxy)', weight: 0.20, value: '94.2% (Critical Saturation)', impactScore: 92 },
    ],
    explanation: 'Satellite SAR soil saturation alongside localized IMD radar precipitation (38.5 mm/h) exceeds the critical geotechnical threshold for Sonapur cutting. Disruption probability model predicts major slope subsidence within 180-240 minutes.',
  },
  {
    id: 'pred-nh29-rockfall',
    corridorId: 'seg-nh29-paglapahar',
    roadName: 'NH-29 Dimapur–Kohima Corridor',
    state: 'Nagaland',
    hazardType: 'Gorge Rockfall & Boulder Slump',
    disruptionProbability: 76,
    predictionConfidence: 'High',
    expectedRiskWindow: 'Next 1.5 to 3 hours',
    expectedRiskMinutes: 120,
    contributingFactors: [
      { name: 'Recent Micro-seismic Ground Vibrations', weight: 0.25, value: 'Magnitude 2.8 tremor recorded nearby', impactScore: 78 },
      { name: 'Chathe River Undermining Road Toe', weight: 0.30, value: 'High river scour velocity', impactScore: 85 },
      { name: 'Heavy Freight Vibrational Load', weight: 0.20, value: 'Continuous multi-axle freight passage', impactScore: 74 },
      { name: 'Rainfall Infiltration', weight: 0.25, value: '22 mm/h', impactScore: 70 },
    ],
    explanation: 'Active slope destabilization at Pagla Pahar curve. Continuous water seepage through fractured metamorphic rocks increases risk of rockfall cascades.',
  },
  {
    id: 'pred-nh15-flood',
    corridorId: 'seg-nh15-brahmaputra',
    roadName: 'NH-15 Northern Bank Highway',
    state: 'Assam',
    hazardType: 'Riverine Flash Flooding Over Highway',
    disruptionProbability: 64,
    predictionConfidence: 'Medium',
    expectedRiskWindow: 'Next 6 to 8 hours',
    expectedRiskMinutes: 420,
    contributingFactors: [
      { name: 'Upstream Dam Water Release', weight: 0.35, value: 'Discharge increased by 450 m³/s', impactScore: 75 },
      { name: 'Catchment Rainfall Rate', weight: 0.30, value: '42 mm/h over foothill region', impactScore: 80 },
      { name: 'Embankment Elevation Margin', weight: 0.20, value: '+0.4m above danger level', impactScore: 68 },
      { name: 'Drainage Culvert Siltation', weight: 0.15, value: '60% silt choked', impactScore: 72 },
    ],
    explanation: 'Low-lying culverts near Bihpuria are approaching capacity. Water expected to wash over pavement by evening hours if discharge persists.',
  }
];

export const INITIAL_INCIDENT_REPORTS: IncidentReport[] = [
  {
    id: 'rep-001',
    reporterName: 'Inspector Rajesh Daimary',
    reporterId: 'NER-FO-408',
    reporterType: 'field_officer',
    incidentType: 'landslide',
    severity: 'high',
    blockagePercent: 75,
    corridorId: 'seg-nh6-ratacherra',
    corridorName: 'NH-06 Shillong–Silchar (Near Sonapur Tunnel)',
    locationName: 'KM 142.5, Sonapur Bypass, East Jaintia Hills',
    lat: 25.0210,
    lng: 92.4870,
    description: 'Substantial mud and boulder slip from eastern hill slope. Northern lane completely buried under ~3m debris; southern lane partially navigable only by 4x4. Debris is still trickling down.',
    photoUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb18f15f3?auto=format&fit=crop&w=600&q=80',
    timestamp: '24 mins ago',
    status: 'pending_verification',
    verificationConfidence: 91,
    reasons: [
      'GPS location strictly matches surveyed vulnerable chainage KM 142.5',
      'Corroborated by 2 independent driver emergency transmissions in same 15-min window',
      'AI landslide prediction engine alerted 82% risk for this exact stretch',
      'IMD radar confirms local rainfall 38.5 mm/h exceeding geotechnical threshold'
    ],
  },
  {
    id: 'rep-002',
    reporterName: 'Tsering Angmo',
    reporterId: 'NER-DRV-104',
    reporterType: 'driver',
    incidentType: 'bridge_damage',
    severity: 'critical',
    blockagePercent: 100,
    corridorId: 'seg-nh13-tawang',
    corridorName: 'NH-13 Trans-Arunachal Highway',
    locationName: 'Bridge #14 over Sissiri Nallah, Pasighat-Roing',
    lat: 28.1400,
    lng: 95.5800,
    description: 'Approaching span soil foundation washed away by sudden flash water. Guardrails twisted. Road closed by local police.',
    photoUrl: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=600&q=80',
    timestamp: '1 hour ago',
    status: 'verified',
    verificationConfidence: 97,
    reasons: [
      'Border Roads Organisation (BRO) patrol officer co-signed verification',
      'Satellite SAR confirms flood plain expansion',
      'Geofenced road closure beacon activated'
    ],
    verifiedBy: 'BRO Command HQ, Tezpur'
  },
  {
    id: 'rep-003',
    reporterName: 'Sanjay Thapa',
    reporterId: 'NER-CIT-912',
    reporterType: 'local_citizen',
    incidentType: 'rockfall',
    severity: 'moderate',
    blockagePercent: 40,
    corridorId: 'seg-nh29-paglapahar',
    corridorName: 'NH-29 Dimapur–Kohima',
    locationName: 'Pagla Pahar KM 18, Chümoukedima',
    lat: 25.7480,
    lng: 93.9210,
    description: 'Several massive shale rocks fallen on inner curve. Slow single-file convoy movement.',
    photoUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=600&q=80',
    timestamp: '45 mins ago',
    status: 'verified',
    verificationConfidence: 88,
    reasons: [
      'Highway Patrol Unit 4 confirmed on-site',
      'Bulldozer dispatched from Medziphema depot'
    ],
    verifiedBy: 'Nagaland Traffic Control'
  }
];

export const INITIAL_VEHICLES: Vehicle[] = [
  {
    id: 'TRK-108',
    driverName: 'Manabendra Barman',
    plateNumber: 'AS-01-GC-4491',
    vehicleType: 'Heavy 16-Wheel Logistics Carrier',
    cargoType: 'Essential Pharmaceuticals & Medical Oxygen',
    currentLat: 25.1856,
    currentLng: 92.3562, // Approaching Sonapur tunnel
    speedKmH: 34,
    heading: 135,
    assignedRouteId: 'route-nh6-main',
    routeCorridorId: 'seg-nh6-ratacherra',
    startLocation: 'Guwahati Logistics Hub',
    destination: 'Silchar Civil Hospital',
    etaMinutes: 145,
    originalEtaMinutes: 145,
    routeAccessibility: 72,
    riskExposure: 'high',
    status: 'caution',
    safeExitStatus: 'high_risk_reroute',
    safeExitMarginMinutes: -25, // Will arrive 25 mins after predicted blockage!
    distanceToRiskKm: 28,
    rerouteRecommended: true,
    rerouteAccepted: false,
  },
  {
    id: 'TRK-402',
    driverName: 'Subhashish Nath',
    plateNumber: 'ML-05-E-8812',
    vehicleType: 'Petroleum Tanker (BPCL)',
    cargoType: 'Diesel & Aviation Fuel',
    currentLat: 24.9980,
    currentLng: 92.5200, // Just 6 km past the tunnel
    speedKmH: 48,
    heading: 140,
    assignedRouteId: 'route-nh6-main',
    routeCorridorId: 'seg-nh6-ratacherra',
    startLocation: 'Numaligarh Refinery',
    destination: 'Silchar Central Depot',
    etaMinutes: 42,
    originalEtaMinutes: 42,
    routeAccessibility: 65,
    riskExposure: 'moderate',
    status: 'on_track',
    safeExitStatus: 'proceed_with_caution',
    safeExitMarginMinutes: 48, // 48 min safe margin before total closure
    distanceToRiskKm: 8,
    rerouteRecommended: false,
    rerouteAccepted: false,
  },
  {
    id: 'TRK-220',
    driverName: 'Keviletuo Angami',
    plateNumber: 'NL-07-A-3098',
    vehicleType: 'Refrigerated Cold Chain Truck',
    cargoType: 'Vaccines & Dairy Logistics',
    currentLat: 25.8450,
    currentLng: 93.7800, // Dimapur outskirts
    speedKmH: 38,
    heading: 110,
    assignedRouteId: 'route-nh29-kohima',
    routeCorridorId: 'seg-nh29-paglapahar',
    startLocation: 'Dimapur Railway Yard',
    destination: 'Kohima State Medical Store',
    etaMinutes: 75,
    originalEtaMinutes: 60,
    routeAccessibility: 36,
    riskExposure: 'critical',
    status: 'caution',
    safeExitStatus: 'do_not_enter',
    safeExitMarginMinutes: -15,
    distanceToRiskKm: 14,
    rerouteRecommended: true,
    rerouteAccepted: false,
  },
  {
    id: 'TRK-305',
    driverName: 'Bipul Kalita',
    plateNumber: 'AS-03-B-7120',
    vehicleType: 'Multi-Axle Container Truck',
    cargoType: 'FCI PDS Food Grains (Rice/Wheat)',
    currentLat: 26.2400,
    currentLng: 92.3800,
    speedKmH: 62,
    heading: 95,
    assignedRouteId: 'route-nh27-express',
    routeCorridorId: 'seg-nh27-nagaon',
    startLocation: 'Guwahati FCI Depot',
    destination: 'Lumding Food Grain Storage',
    etaMinutes: 85,
    originalEtaMinutes: 85,
    routeAccessibility: 88,
    riskExposure: 'safe',
    status: 'on_track',
    safeExitStatus: 'safe_to_cross',
    safeExitMarginMinutes: 180,
    distanceToRiskKm: 95,
    rerouteRecommended: false,
    rerouteAccepted: false,
  }
];

export const INITIAL_ROUTE_OPTIONS: RouteOption[] = [
  {
    id: 'route-safe-nh27-haflong',
    name: 'Safe Corridor via NH-27 Nagaon – Lumding – Haflong Bypass',
    type: 'safe',
    startCity: 'Guwahati',
    destinationCity: 'Silchar',
    distanceKm: 348,
    travelTimeHours: 8.5,
    avgAccessibilityScore: 84,
    riskLevel: 'safe',
    affectedSegmentsCount: 0,
    polylineCoords: [
      [26.1445, 91.7362], // Guwahati
      [26.1820, 92.1450], // Jagiroad
      [26.3450, 92.6840], // Nagaon
      [25.7500, 93.1700], // Lumding
      [25.1700, 93.0200], // Haflong Hill Pass (All-weather tunnel route)
      [24.8333, 92.7789], // Silchar
    ],
    recommendationReason: 'Avoids Meghalaya ridge mudslides completely. Fully paved all-weather alignment with stable drainage culverts.',
    isRecommended: true,
    activeHazards: ['None detected on major stretch', 'Slight rain near Haflong (9 mm/h)'],
  },
  {
    id: 'route-fast-nh6-direct',
    name: 'Fastest Direct Path via NH-06 Shillong – Jowai – Sonapur',
    type: 'fast',
    startCity: 'Guwahati',
    destinationCity: 'Silchar',
    distanceKm: 308,
    travelTimeHours: 6.8,
    avgAccessibilityScore: 42,
    riskLevel: 'high',
    affectedSegmentsCount: 2,
    polylineCoords: [
      [26.1445, 91.7362], // Guwahati
      [25.5788, 91.8933], // Shillong
      [25.4412, 92.1985], // Jowai
      [25.0210, 92.4870], // Sonapur (Landslide Hazard)
      [24.8333, 92.7789], // Silchar
    ],
    recommendationReason: '40 km shorter but currently traversing active 82% Landslide Hazard zone at Sonapur with 75% carriageway blockage.',
    isRecommended: false,
    activeHazards: ['Active mudslide at KM 142.5', 'Severe fog & orographic rainfall'],
  },
  {
    id: 'route-balanced-meghalaya-umkiang',
    name: 'Balanced Hybrid Route via NH-06 with Umkiang Emergency Bypass',
    type: 'balanced',
    startCity: 'Guwahati',
    destinationCity: 'Silchar',
    distanceKm: 326,
    travelTimeHours: 7.6,
    avgAccessibilityScore: 66,
    riskLevel: 'moderate',
    affectedSegmentsCount: 1,
    polylineCoords: [
      [26.1445, 91.7362], // Guwahati
      [25.5788, 91.8933], // Shillong
      [25.4412, 92.1985], // Jowai
      [25.0900, 92.4100], // Umkiang Local Diversion Road
      [24.9100, 92.6200], // Badarpur Link
      [24.8333, 92.7789], // Silchar
    ],
    recommendationReason: 'Balances 40 mins time savings while routing around critical bottleneck via secondary state feeder road.',
    isRecommended: false,
    activeHazards: ['Single-lane bridge capacity constraint', 'Speed restricted to 30 km/h'],
  }
];

export const INITIAL_ALERTS: AlertItem[] = [
  {
    id: 'alt-001',
    priority: 'critical',
    category: 'verified_disruption',
    title: 'CRITICAL ROAD BLOCKAGE: NH-06 Sonapur Tunnel Landslide',
    location: 'NH-06 KM 142.5, East Jaintia Hills, Meghalaya',
    corridorId: 'seg-nh6-ratacherra',
    vehicleId: 'TRK-108',
    timestamp: '10 mins ago',
    description: 'Verified 75% mudslide disruption on NH-06. Dynamic Accessibility Score dropped to 28/100. 2 logistics vehicles on route.',
    recommendedAction: 'Immediate reroute of approaching heavy freight via NH-27 Lumding–Haflong corridor. Halt oversized trailers at Ladrymbai checkpoint.',
    acknowledged: false,
  },
  {
    id: 'alt-002',
    priority: 'high',
    category: 'safe_exit_warning',
    title: 'SAFE EXIT WINDOW EXPIRED for TRK-108',
    location: 'Ladrymbai Junction, NH-06',
    vehicleId: 'TRK-108',
    timestamp: '14 mins ago',
    description: 'Vehicle TRK-108 ETA to Sonapur risk zone (48 mins) exceeds the estimated safe clearance window (25 mins). Projected entrapment hazard.',
    recommendedAction: 'Issue compulsory reroute order to Driver Manabendra Barman. Divert to Haflong bypass.',
    acknowledged: false,
  },
  {
    id: 'alt-003',
    priority: 'high',
    category: 'predicted_hazard',
    title: 'AI HAZARD ALERT: 82% Landslide Risk within 3 Hours',
    location: 'NH-06 Ratacherra Ridge Belt',
    corridorId: 'seg-nh6-ratacherra',
    timestamp: '32 mins ago',
    description: 'Multi-factor prediction fusion triggered: Soil moisture reached 94.2% with 38.5 mm/h localized rain. Slope failure probable.',
    recommendedAction: 'Alert Disaster Management Authority (DDMA Khliehriat) and place earth-moving equipment on standby.',
    acknowledged: true,
  },
  {
    id: 'alt-004',
    priority: 'critical',
    category: 'verified_disruption',
    title: 'BRIDGE COMPROMISED: NH-13 Trans-Arunachal Highway',
    location: 'Bridge #14 Pasighat–Roing Corridor',
    corridorId: 'seg-nh13-tawang',
    timestamp: '1 hour ago',
    description: 'Flash flood torrent washed out bridge approach abutment. Corridor completely closed for all wheeled transport.',
    recommendedAction: 'Close highway entry gates at Pasighat. Divert commercial freight via ferry point / Assam southern bank.',
    acknowledged: true,
  },
  {
    id: 'alt-005',
    priority: 'moderate',
    category: 'incident_report',
    title: 'UNVERIFIED GROUND REPORT: Rockfall on NH-29 Pagla Pahar',
    location: 'KM 18 Chümoukedima, Nagaland',
    corridorId: 'seg-nh29-paglapahar',
    timestamp: '46 mins ago',
    description: 'Local citizen reported boulders obstructing half the carriageway. Verification score calculated at 88%.',
    recommendedAction: 'Traffic control deployed mobile patrol to confirm and clear lane.',
    acknowledged: true,
  }
];

export const INITIAL_LEARNING_RECORDS: LearningRecord[] = [
  {
    id: 'learn-001',
    incidentId: 'INC-2026-081',
    corridorName: 'NH-06 Sonapur Sector',
    hazardType: 'Monsoon Landslide',
    predictedProbability: 78,
    actualOutcome: 'Total Blockage occurred within 140 minutes of prediction',
    accuracyBefore: 78.4,
    accuracyAfter: 84.1,
    parameterTuned: 'Soil Moisture Threshold lowered from 96% to 92% for shale geology',
    weightDelta: '+0.05 Antecedent Rain, -0.05 Slope Curvature',
    timestamp: 'Yesterday at 16:40',
  },
  {
    id: 'learn-002',
    incidentId: 'INC-2026-074',
    corridorName: 'NH-29 Pagla Pahar',
    hazardType: 'Debris Flow',
    predictedProbability: 82,
    actualOutcome: 'Confirmed 2.5 hour partial blockage during continuous rain',
    accuracyBefore: 81.0,
    accuracyAfter: 86.5,
    parameterTuned: 'Added Chathe river scour velocity as weighted geotechnical predictor',
    weightDelta: '+0.08 River Gauge Telemetry weight',
    timestamp: '3 days ago',
  },
  {
    id: 'learn-003',
    incidentId: 'INC-2026-068',
    corridorName: 'NH-15 Bihpuria Bypass',
    hazardType: 'Culvert Water Inundation',
    predictedProbability: 60,
    actualOutcome: 'Culvert submerged by 0.5m water; vehicle traffic diverted',
    accuracyBefore: 74.2,
    accuracyAfter: 80.8,
    parameterTuned: 'Integrated dam upstream release schedule into hourly flood model',
    weightDelta: '+0.12 Reservoir Discharge Factor',
    timestamp: 'Last week',
  }
];

export const VULNERABLE_CORRIDORS_DATA: CorridorVulnerabilityStat[] = [
  {
    corridor: 'Shillong – Jowai – Silchar',
    highway: 'NH-06',
    historicalIncidents: 42,
    currentRiskScore: 78,
    monsoonVulnerabilityRating: 'Critical',
    primaryThreat: 'Deep-seated Rotational Landslides & Mudflows',
  },
  {
    corridor: 'Dimapur – Chümoukedima – Kohima',
    highway: 'NH-29',
    historicalIncidents: 36,
    currentRiskScore: 68,
    monsoonVulnerabilityRating: 'High',
    primaryThreat: 'Rockfall, Boulder Cascades & Gorge Scour',
  },
  {
    corridor: 'Pasighat – Dambuk – Roing',
    highway: 'NH-13',
    historicalIncidents: 29,
    currentRiskScore: 86,
    monsoonVulnerabilityRating: 'Critical',
    primaryThreat: 'Braided River Flash Floods & Abutment Washout',
  },
  {
    corridor: 'Tezpur – Jamugurihat – North Lakhimpur',
    highway: 'NH-15',
    historicalIncidents: 24,
    currentRiskScore: 54,
    monsoonVulnerabilityRating: 'Moderate',
    primaryThreat: 'Brahmaputra Backflow & Culvert Inundation',
  },
  {
    corridor: 'Imphal – Kakching – Moreh Border',
    highway: 'NH-102',
    historicalIncidents: 19,
    currentRiskScore: 46,
    monsoonVulnerabilityRating: 'Moderate',
    primaryThreat: 'Hill Road Slumping & Soil Creep',
  },
  {
    corridor: 'Guwahati – Nagaon – Lumding',
    highway: 'NH-27',
    historicalIncidents: 6,
    currentRiskScore: 16,
    monsoonVulnerabilityRating: 'Low',
    primaryThreat: 'Localized Waterlogging in Low Grade Separators',
  },
];
