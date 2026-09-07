import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  RoadSegment,
  IncidentReport,
  HazardPrediction,
  Vehicle,
  RouteOption,
  AlertItem,
  LearningRecord,
  UserRole,
  ReportStatus
} from '../types';
import {
  INITIAL_ROAD_SEGMENTS,
  INITIAL_HAZARD_PREDICTIONS,
  INITIAL_INCIDENT_REPORTS,
  INITIAL_VEHICLES,
  INITIAL_ROUTE_OPTIONS,
  INITIAL_ALERTS,
  INITIAL_LEARNING_RECORDS
} from '../data/mockData';

export type ActiveTab = 
  | 'dashboard'
  | 'map'
  | 'prediction'
  | 'report'
  | 'reporting'
  | 'verification'
  | 'score'
  | 'routes'
  | 'safe_exit'
  | 'vehicles'
  | 'alerts'
  | 'analytics'
  | 'learning'
  | 'offline_sync'
  | 'driver_hud';

interface RoadPulseContextType {
  // Navigation & Role
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  
  // Connectivity & Offline Sync
  isOnline: boolean;
  setIsOnline: (online: boolean) => void;
  toggleConnectivity: () => void;
  offlineQueue: IncidentReport[];
  isSyncing: boolean;
  syncProgress: number;
  syncOfflineReports: () => Promise<void>;
  
  // Core Entities
  roadSegments: RoadSegment[];
  selectedSegmentId: string | null;
  setSelectedSegmentId: (id: string | null) => void;
  selectedSegment: RoadSegment | undefined;
  
  incidentReports: IncidentReport[];
  hazardPredictions: HazardPrediction[];
  vehicles: Vehicle[];
  selectedVehicleId: string | null;
  setSelectedVehicleId: (id: string | null) => void;
  selectedVehicle: Vehicle | undefined;
  
  routes: RouteOption[];
  selectedRouteId: string;
  setSelectedRouteId: (id: string) => void;
  
  alerts: AlertItem[];
  learningRecords: LearningRecord[];
  
  // Core Dynamic Actions
  submitIncidentReport: (report: Omit<IncidentReport, 'id' | 'timestamp' | 'status' | 'verificationConfidence' | 'reasons'>) => void;
  verifyReport: (reportId: string) => void;
  rejectReport: (reportId: string) => void;
  markReportUncertain: (reportId: string) => void;
  rerouteVehicle: (vehicleId: string, newRouteId?: string) => void;
  acknowledgeAlert: (alertId: string) => void;
  resolveAlert: (alertId: string) => void;
  
  // Scenario Walkthrough State & Controls
  scenarioStep: number;
  isScenarioRunning: boolean;
  startScenario: () => void;
  nextScenarioStep: () => void;
  prevScenarioStep: () => void;
  resetScenario: () => void;
  jumpToScenarioStep: (step: number) => void;
  autoPlayScenario: boolean;
  setAutoPlayScenario: (autoplay: boolean) => void;

  // Formula Breakdown Helper
  calculateDynamicScore: (
    baseCondition: number,
    hazardRisk: number,
    weatherRainfall: number,
    blockagePercent: number,
    verifiedIncidentCount: number
  ) => {
    finalScore: number;
    base: number;
    hazardDeduction: number;
    weatherDeduction: number;
    incidentDeduction: number;
    confidenceAdjustment: number;
  };
}

const RoadPulseContext = createContext<RoadPulseContextType | undefined>(undefined);

export const RoadPulseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [userRole, setUserRole] = useState<UserRole>('command_center');
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [offlineQueue, setOfflineQueue] = useState<IncidentReport[]>(() => {
    try {
      const saved = localStorage.getItem('roadpulse_offline_queue');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncProgress, setSyncProgress] = useState<number>(0);

  // Synchronize offline queue to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('roadpulse_offline_queue', JSON.stringify(offlineQueue));
    } catch (e) {
      console.error('Failed to sync offline queue to localStorage', e);
    }
  }, [offlineQueue]);

  const [roadSegments, setRoadSegments] = useState<RoadSegment[]>(INITIAL_ROAD_SEGMENTS);
  const [selectedSegmentId, setSelectedSegmentId] = useState<string | null>('seg-nh6-ratacherra');
  
  const [incidentReports, setIncidentReports] = useState<IncidentReport[]>(INITIAL_INCIDENT_REPORTS);
  const [hazardPredictions] = useState<HazardPrediction[]>(INITIAL_HAZARD_PREDICTIONS);
  const [vehicles, setVehicles] = useState<Vehicle[]>(INITIAL_VEHICLES);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>('TRK-108');
  const [routes, setRoutes] = useState<RouteOption[]>(INITIAL_ROUTE_OPTIONS);
  const [selectedRouteId, setSelectedRouteId] = useState<string>('route-safe-nh27-haflong');
  const [alerts, setAlerts] = useState<AlertItem[]>(INITIAL_ALERTS);
  const [learningRecords, setLearningRecords] = useState<LearningRecord[]>(INITIAL_LEARNING_RECORDS);

  // Scenario Walkthrough State (1-16)
  const [scenarioStep, setScenarioStep] = useState<number>(0);
  const [isScenarioRunning, setIsScenarioRunning] = useState<boolean>(false);
  const [autoPlayScenario, setAutoPlayScenario] = useState<boolean>(false);

  // Selected Entities
  const selectedSegment = roadSegments.find(s => s.id === selectedSegmentId) || roadSegments[0];
  const selectedVehicle = vehicles.find(v => v.id === selectedVehicleId) || vehicles[0];

  // Mathematical Dynamic Accessibility Formula
  const calculateDynamicScore = (
    baseCondition: number,
    hazardRisk: number,
    weatherRainfall: number,
    blockagePercent: number,
    verifiedIncidentCount: number
  ) => {
    // Formula:
    // Base Condition (e.g. 78-92)
    // - Hazard Risk Deduction = (hazardRisk * 0.25)
    // - Weather Impact = min(25, weatherRainfall * 0.45)
    // - Verified Incident Impact = (blockagePercent * 0.40) + (verifiedIncidentCount * 8)
    // + Confidence Stabilization = +5 if high confidence corroboration exists
    const hazardDeduction = Math.round(hazardRisk * 0.25);
    const weatherDeduction = Math.round(Math.min(25, weatherRainfall * 0.45));
    const incidentDeduction = Math.round((blockagePercent * 0.40) + (verifiedIncidentCount * 8));
    const confidenceAdjustment = 4;

    let finalScore = baseCondition - hazardDeduction - weatherDeduction - incidentDeduction + confidenceAdjustment;
    finalScore = Math.max(0, Math.min(100, finalScore));

    return {
      finalScore,
      base: baseCondition,
      hazardDeduction,
      weatherDeduction,
      incidentDeduction,
      confidenceAdjustment
    };
  };

  // Connectivity Toggle
  const toggleConnectivity = () => {
    const newStatus = !isOnline;
    setIsOnline(newStatus);
    if (newStatus && offlineQueue.length > 0) {
      // Promptly trigger sync when coming online
      syncOfflineReports();
    }
  };

  // Sync Offline Reports to Central Server
  const syncOfflineReports = async () => {
    if (offlineQueue.length === 0 || isSyncing) return;
    setIsSyncing(true);
    setSyncProgress(15);

    await new Promise(resolve => setTimeout(resolve, 600));
    setSyncProgress(50);
    await new Promise(resolve => setTimeout(resolve, 600));
    setSyncProgress(90);
    await new Promise(resolve => setTimeout(resolve, 400));

    // Move queued reports to active reports as 'pending_verification'
    const syncedReports = offlineQueue.map(item => ({
      ...item,
      status: 'pending_verification' as ReportStatus,
      syncedAt: 'Just now (Synced from local buffer)'
    }));

    setIncidentReports(prev => [...syncedReports, ...prev]);
    
    // Add an alert for synchronized reports
    const syncAlert: AlertItem = {
      id: `alt-sync-${Date.now()}`,
      priority: 'info',
      category: 'offline_synced',
      title: `${syncedReports.length} Offline Field Report(s) Synchronized`,
      location: 'Regional Uplink Central',
      timestamp: 'Just now',
      description: `Field units re-established telemetry. ${syncedReports.length} cached ground reports transferred to Verification Center queue.`,
      recommendedAction: 'Review incoming reports in Report Verification Center.',
      acknowledged: false
    };
    setAlerts(prev => [syncAlert, ...prev]);

    setOfflineQueue([]);
    setSyncProgress(100);
    setIsSyncing(false);
  };

  // Submit Incident Report (Handles Online or Offline)
  const submitIncidentReport = (
    reportData: Omit<IncidentReport, 'id' | 'timestamp' | 'status' | 'verificationConfidence' | 'reasons'>
  ) => {
    const reportId = `rep-${Date.now().toString().slice(-4)}`;
    const timestamp = 'Just now';

    // Calculate simulated verification confidence based on factors
    const matchedSegment = roadSegments.find(s => s.id === reportData.corridorId);
    let confidence = 75;
    const reasons: string[] = [
      `GPS coordinates match recorded chainage of ${matchedSegment?.corridorCode || 'corridor'}`
    ];

    if (matchedSegment && matchedSegment.terrainVulnerability > 70) {
      confidence += 10;
      reasons.push(`High slope vulnerability terrain index (${matchedSegment.terrainVulnerability}%) aligns with incident`);
    }

    if (matchedSegment && matchedSegment.weatherImpact.rainfallMmPerHour > 25) {
      confidence += 8;
      reasons.push(`Precipitation sensor confirms ${matchedSegment.weatherImpact.rainfallMmPerHour} mm/h localized rainfall`);
    }

    confidence = Math.min(98, confidence);

    const newReport: IncidentReport = {
      ...reportData,
      id: reportId,
      timestamp,
      status: isOnline ? 'pending_verification' : 'offline_queued',
      verificationConfidence: confidence,
      reasons,
      offlineSavedAt: isOnline ? undefined : new Date().toLocaleTimeString(),
    };

    if (!isOnline) {
      setOfflineQueue(prev => [newReport, ...prev]);
    } else {
      setIncidentReports(prev => [newReport, ...prev]);
      
      // Post an alert
      const newAlert: AlertItem = {
        id: `alt-${Date.now()}`,
        priority: newReport.severity === 'critical' ? 'critical' : 'high',
        category: 'incident_report',
        title: `NEW GROUND REPORT: ${newReport.incidentType.toUpperCase()} on ${newReport.corridorName}`,
        location: newReport.locationName,
        corridorId: newReport.corridorId,
        timestamp: 'Just now',
        description: `Submitted by ${newReport.reporterName} (${newReport.reporterType.replace('_', ' ')}). Reported blockage: ${newReport.blockagePercent}%.`,
        recommendedAction: 'Authorized personnel verification required in Verification Center.',
        acknowledged: false,
      };
      setAlerts(prev => [newAlert, ...prev]);
    }
  };

  // Verify Report -> Triggers full system propagation
  const verifyReport = (reportId: string) => {
    const report = incidentReports.find(r => r.id === reportId);
    if (!report) return;

    // 1. Update Report Status
    setIncidentReports(prev =>
      prev.map(r => r.id === reportId ? { ...r, status: 'verified', verifiedBy: 'Command Center Officer' } : r)
    );

    // 2. Recalculate Road Accessibility Score
    setRoadSegments(prev =>
      prev.map(segment => {
        if (segment.id === report.corridorId) {
          const newBlockage = Math.max(segment.roadBlockagePercent, report.blockagePercent);
          const newVerifiedCount = segment.verifiedIncidentCount + 1;
          const scoreCalculation = calculateDynamicScore(
            segment.baseCondition,
            85, // hazard risk
            segment.weatherImpact.rainfallMmPerHour,
            newBlockage,
            newVerifiedCount
          );

          const finalScore = scoreCalculation.finalScore;
          let newRiskLevel: 'safe' | 'moderate' | 'high' | 'critical' = 'safe';
          if (finalScore < 20) newRiskLevel = 'critical';
          else if (finalScore < 40) newRiskLevel = 'high';
          else if (finalScore < 70) newRiskLevel = 'moderate';

          return {
            ...segment,
            accessibilityScore: finalScore,
            riskLevel: newRiskLevel,
            roadBlockagePercent: newBlockage,
            verifiedIncidentCount: newVerifiedCount,
            lastUpdated: 'Just now (Ground verified)',
          };
        }
        return segment;
      })
    );

    // 3. Update Affected Vehicles & Safe Exit Window
    setVehicles(prev =>
      prev.map(v => {
        if (v.routeCorridorId === report.corridorId) {
          // Check vehicle distance and safe exit window
          if (v.distanceToRiskKm > 20) {
            // Vehicle cannot make it in time
            return {
              ...v,
              routeAccessibility: 28,
              riskExposure: 'critical',
              status: 'caution',
              safeExitStatus: 'high_risk_reroute',
              rerouteRecommended: true,
              etaMinutes: v.etaMinutes + 65,
            };
          } else {
            // Vehicle is close and can clear with caution
            return {
              ...v,
              routeAccessibility: 38,
              riskExposure: 'moderate',
              status: 'on_track',
              safeExitStatus: 'proceed_with_caution',
              rerouteRecommended: false,
            };
          }
        }
        return v;
      })
    );

    // 4. Update Route Recommendations
    setRoutes(prev =>
      prev.map(route => {
        if (route.id === 'route-fast-nh6-direct') {
          return {
            ...route,
            avgAccessibilityScore: 28,
            riskLevel: 'critical',
            affectedSegmentsCount: 2,
            isRecommended: false,
            activeHazards: ['Verified Landslide - 75% Blockage at Sonapur', 'Heavy Rainfall']
          };
        }
        if (route.id === 'route-safe-nh27-haflong') {
          return {
            ...route,
            isRecommended: true,
            recommendationReason: 'RECOMMENDED: Completely bypasses the verified landslide on NH-06 via all-weather Haflong corridor.'
          };
        }
        return route;
      })
    );

    // 5. Trigger System Alert
    const verifiedAlert: AlertItem = {
      id: `alt-ver-${Date.now()}`,
      priority: 'critical',
      category: 'verified_disruption',
      title: `VERIFIED DISRUPTION: ${report.incidentType.toUpperCase()} on ${report.corridorName}`,
      location: report.locationName,
      corridorId: report.corridorId,
      timestamp: 'Just now',
      description: `Human + AI ground truth fusion confirmed incident. Dynamic road score dropped to 28. Vehicles on corridor flagged for safe exit or reroute.`,
      recommendedAction: 'Dispatch BRO/NDRF clearance units and initiate automated vehicle rerouting.',
      acknowledged: false,
    };
    setAlerts(prev => [verifiedAlert, ...prev]);

    // 6. Push to Continuous Learning Dataset
    const newLearningRecord: LearningRecord = {
      id: `learn-${Date.now().toString().slice(-4)}`,
      incidentId: `INC-${Date.now().toString().slice(-6)}`,
      corridorName: report.corridorName,
      hazardType: report.incidentType,
      predictedProbability: 82,
      actualOutcome: `Confirmed ${report.blockagePercent}% road blockage at KM 142.5`,
      accuracyBefore: 83.2,
      accuracyAfter: 88.7,
      parameterTuned: 'Lithology shear coefficient dynamically boosted for orographic rain (>35mm/h)',
      weightDelta: '+0.04 Ground Verification Weight',
      timestamp: 'Just now (Continuous Learning Loop)',
    };
    setLearningRecords(prev => [newLearningRecord, ...prev]);
  };

  // Reject Report
  const rejectReport = (reportId: string) => {
    setIncidentReports(prev =>
      prev.map(r => r.id === reportId ? { ...r, status: 'rejected', verifiedBy: 'Command Center (False Alarm)' } : r)
    );
  };

  // Mark Report Uncertain
  const markReportUncertain = (reportId: string) => {
    setIncidentReports(prev =>
      prev.map(r => r.id === reportId ? { ...r, status: 'uncertain', verifiedBy: 'Pending Aerial Drone Verification' } : r)
    );
  };

  // Reroute Vehicle
  const rerouteVehicle = (vehicleId: string) => {
    setVehicles(prev =>
      prev.map(v => {
        if (v.id === vehicleId) {
          return {
            ...v,
            assignedRouteId: 'route-safe-nh27-haflong',
            routeCorridorId: 'seg-nh27-nagaon',
            status: 'rerouting',
            rerouteAccepted: true,
            rerouteRecommended: false,
            routeAccessibility: 84,
            riskExposure: 'safe',
            safeExitStatus: 'safe_to_cross',
            etaMinutes: v.etaMinutes + 45, // takes 45 mins extra but safe
          };
        }
        return v;
      })
    );

    const rerouteAlert: AlertItem = {
      id: `alt-reroute-${Date.now()}`,
      priority: 'high',
      category: 'route_affected',
      title: `VEHICLE ${vehicleId} REROUTED TO SAFE CORRIDOR`,
      location: 'NH-27 Haflong Bypass',
      vehicleId,
      timestamp: 'Just now',
      description: `Driver accepted alternative safe routing. Avoids Sonapur bottleneck with safe ETA calculated.`,
      recommendedAction: 'Monitor GPS progress until Haflong transit point.',
      acknowledged: true,
    };
    setAlerts(prev => [rerouteAlert, ...prev]);
  };

  // Acknowledge Alert
  const acknowledgeAlert = (alertId: string) => {
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, acknowledged: true } : a));
  };

  // Resolve Alert
  const resolveAlert = (alertId: string) => {
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, resolved: true, acknowledged: true } : a));
  };

  // SIH 26002 16-Step Scenario Execution
  const runScenarioStep = (step: number) => {
    setScenarioStep(step);

    switch (step) {
      case 1:
        // 1. AI detects heavy rainfall and predicts high probability of landslide
        setActiveTab('prediction');
        setSelectedSegmentId('seg-nh6-ratacherra');
        break;

      case 2:
        // 2. Road initially has an accessibility score of 72
        setActiveTab('score');
        setSelectedSegmentId('seg-nh6-ratacherra');
        break;

      case 3:
        // 3. Field officer submits ground report showing partial landslide
        setActiveTab('report');
        setUserRole('field_officer');
        break;

      case 4:
        // 4. Report enters verification queue
        setActiveTab('verification');
        setUserRole('command_center');
        break;

      case 5:
        // 5. Human + AI ground truth comparison
        setActiveTab('verification');
        break;

      case 6:
        // 6. Report receives high confidence and is verified!
        verifyReport('rep-001');
        setActiveTab('verification');
        break;

      case 7:
        // 7. Road accessibility score drops from 72 to 28
        setActiveTab('score');
        setSelectedSegmentId('seg-nh6-ratacherra');
        break;

      case 8:
        // 8. Road segment turns RED on the map
        setActiveTab('map');
        setSelectedSegmentId('seg-nh6-ratacherra');
        break;

      case 9:
        // 9. System identifies logistics vehicles travelling through corridor
        setActiveTab('vehicles');
        break;

      case 10:
        // 10. Vehicle TRK-402 is within safe exit window
        setActiveTab('safe_exit');
        setSelectedVehicleId('TRK-402');
        break;

      case 11:
        // 11. Vehicle TRK-108 advised not to enter risky segment
        setActiveTab('safe_exit');
        setSelectedVehicleId('TRK-108');
        break;

      case 12:
        // 12. Safe, Fast and Balanced routes generated
        setActiveTab('routes');
        break;

      case 13:
        // 13. Affected vehicle is automatically rerouted
        rerouteVehicle('TRK-108');
        setActiveTab('routes');
        break;

      case 14:
        // 14. Driver perspective receives HUD alert and updated ETA
        setUserRole('driver');
        setActiveTab('driver_hud');
        break;

      case 15:
        // 15. Real-time alert dispatched to all agencies
        setUserRole('command_center');
        setActiveTab('alerts');
        break;

      case 16:
        // 16. Verified incident becomes part of continuous learning dataset
        setActiveTab('learning');
        break;

      default:
        break;
    }
  };

  const startScenario = () => {
    setIsScenarioRunning(true);
    runScenarioStep(1);
  };

  const nextScenarioStep = () => {
    if (scenarioStep < 16) {
      runScenarioStep(scenarioStep + 1);
    } else {
      setIsScenarioRunning(false);
    }
  };

  const prevScenarioStep = () => {
    if (scenarioStep > 1) {
      runScenarioStep(scenarioStep - 1);
    }
  };

  const resetScenario = () => {
    setScenarioStep(0);
    setIsScenarioRunning(false);
    setAutoPlayScenario(false);
    setRoadSegments(INITIAL_ROAD_SEGMENTS);
    setIncidentReports(INITIAL_INCIDENT_REPORTS);
    setVehicles(INITIAL_VEHICLES);
    setRoutes(INITIAL_ROUTE_OPTIONS);
    setAlerts(INITIAL_ALERTS);
    setLearningRecords(INITIAL_LEARNING_RECORDS);
    setActiveTab('dashboard');
    setUserRole('command_center');
  };

  const jumpToScenarioStep = (step: number) => {
    setIsScenarioRunning(true);
    runScenarioStep(step);
  };

  // Auto-play timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (autoPlayScenario && isScenarioRunning && scenarioStep < 16) {
      timer = setTimeout(() => {
        runScenarioStep(scenarioStep + 1);
      }, 5500);
    } else if (scenarioStep >= 16) {
      setAutoPlayScenario(false);
    }
    return () => clearTimeout(timer);
  }, [autoPlayScenario, isScenarioRunning, scenarioStep]);

  return (
    <RoadPulseContext.Provider
      value={{
        activeTab,
        setActiveTab,
        userRole,
        setUserRole,
        isOnline,
        setIsOnline,
        toggleConnectivity,
        offlineQueue,
        isSyncing,
        syncProgress,
        syncOfflineReports,
        roadSegments,
        selectedSegmentId,
        setSelectedSegmentId,
        selectedSegment,
        incidentReports,
        hazardPredictions,
        vehicles,
        selectedVehicleId,
        setSelectedVehicleId,
        selectedVehicle,
        routes,
        selectedRouteId,
        setSelectedRouteId,
        alerts,
        learningRecords,
        submitIncidentReport,
        verifyReport,
        rejectReport,
        markReportUncertain,
        rerouteVehicle,
        acknowledgeAlert,
        resolveAlert,
        scenarioStep,
        isScenarioRunning,
        startScenario,
        nextScenarioStep,
        prevScenarioStep,
        resetScenario,
        jumpToScenarioStep,
        autoPlayScenario,
        setAutoPlayScenario,
        calculateDynamicScore,
      }}
    >
      {children}
    </RoadPulseContext.Provider>
  );
};

export const useRoadPulse = () => {
  const context = useContext(RoadPulseContext);
  if (!context) {
    throw new Error('useRoadPulse must be used within a RoadPulseProvider');
  }
  return context;
};
