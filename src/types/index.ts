export type RiskLevel = 'safe' | 'moderate' | 'high' | 'critical';

export type IncidentType = 
  | 'landslide' 
  | 'flood' 
  | 'road_blockage' 
  | 'bridge_damage' 
  | 'accident' 
  | 'severe_weather' 
  | 'rockfall'
  | 'other';

export type ReporterType = 'field_officer' | 'driver' | 'local_citizen';

export type ReportStatus = 'offline_queued' | 'pending_verification' | 'verified' | 'rejected' | 'uncertain';

export type RouteType = 'safe' | 'fast' | 'balanced';

export type VehicleStatus = 'on_track' | 'caution' | 'rerouting' | 'stopped';

export type SafeExitVerdict = 'safe_to_cross' | 'proceed_with_caution' | 'high_risk_reroute' | 'do_not_enter';

export type AlertPriority = 'critical' | 'high' | 'moderate' | 'info';

export type AlertCategory = 
  | 'predicted_hazard' 
  | 'incident_report' 
  | 'verified_disruption' 
  | 'route_affected' 
  | 'vehicle_at_risk' 
  | 'safe_exit_warning' 
  | 'offline_synced';

export type UserRole = 'command_center' | 'field_officer' | 'driver';

export interface RoadSegment {
  id: string;
  name: string;
  corridorCode: string;
  state: string;
  coordinates: [number, number][]; // Lat, Lng polyline points
  startCity: string;
  endCity: string;
  lengthKm: number;
  baseCondition: number; // 0-100 base quality
  accessibilityScore: number; // Dynamic 0-100 score
  riskLevel: RiskLevel;
  hazardType: string;
  aiConfidence: number; // 0-100%
  weatherImpact: {
    rainfallMmPerHour: number;
    description: string;
    temperatureC: number;
    visibilityMeters: number;
  };
  terrainVulnerability: number; // 0-100%
  verifiedIncidentCount: number;
  lastUpdated: string;
  roadBlockagePercent: number;
  description: string;
  closurePredictionMinutes?: number;
}

export interface IncidentReport {
  id: string;
  reporterName: string;
  reporterId: string;
  reporterType: ReporterType;
  incidentType: IncidentType;
  severity: 'low' | 'moderate' | 'high' | 'critical';
  blockagePercent: number;
  corridorId: string;
  corridorName: string;
  locationName: string;
  lat: number;
  lng: number;
  description: string;
  photoUrl: string;
  timestamp: string;
  status: ReportStatus;
  verificationConfidence: number; // 0-100%
  reasons: string[];
  offlineSavedAt?: string;
  syncedAt?: string;
  verifiedBy?: string;
}

export interface HazardPrediction {
  id: string;
  corridorId: string;
  roadName: string;
  state: string;
  hazardType: string;
  disruptionProbability: number; // e.g. 82%
  predictionConfidence: 'High' | 'Medium' | 'Low';
  expectedRiskWindow: string; // e.g. "Next 4 hours"
  expectedRiskMinutes: number;
  contributingFactors: {
    name: string;
    weight: number; // 0-1
    value: string;
    impactScore: number;
  }[];
  explanation: string;
}

export interface Vehicle {
  id: string;
  driverName: string;
  plateNumber: string;
  vehicleType: string;
  cargoType: string;
  currentLat: number;
  currentLng: number;
  speedKmH: number;
  heading: number; // degrees
  assignedRouteId: string;
  routeCorridorId: string;
  startLocation: string;
  destination: string;
  etaMinutes: number;
  originalEtaMinutes: number;
  routeAccessibility: number; // 0-100
  riskExposure: RiskLevel;
  status: VehicleStatus;
  safeExitStatus: SafeExitVerdict;
  safeExitMarginMinutes: number;
  distanceToRiskKm: number;
  rerouteRecommended: boolean;
  rerouteAccepted: boolean;
}

export interface RouteOption {
  id: string;
  name: string;
  type: RouteType;
  startCity: string;
  destinationCity: string;
  distanceKm: number;
  travelTimeHours: number;
  avgAccessibilityScore: number;
  riskLevel: RiskLevel;
  affectedSegmentsCount: number;
  polylineCoords: [number, number][];
  recommendationReason: string;
  isRecommended: boolean;
  activeHazards: string[];
}

export interface AlertItem {
  id: string;
  priority: AlertPriority;
  category: AlertCategory;
  title: string;
  location: string;
  corridorId?: string;
  vehicleId?: string;
  timestamp: string;
  description: string;
  recommendedAction: string;
  acknowledged: boolean;
}

export interface LearningRecord {
  id: string;
  incidentId: string;
  corridorName: string;
  hazardType: string;
  predictedProbability: number;
  actualOutcome: string;
  accuracyBefore: number;
  accuracyAfter: number;
  parameterTuned: string;
  weightDelta: string;
  timestamp: string;
}

export interface CorridorVulnerabilityStat {
  corridor: string;
  highway: string;
  historicalIncidents: number;
  currentRiskScore: number;
  monsoonVulnerabilityRating: 'Critical' | 'High' | 'Moderate' | 'Low';
  primaryThreat: string;
}
