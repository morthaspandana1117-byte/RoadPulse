import React from 'react';
import { RoadPulseProvider, useRoadPulse } from './context/RoadPulseContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { ScenarioRunner } from './components/ScenarioRunner';

// View Modules
import { DashboardView } from './components/DashboardView';
import { InteractiveMap } from './components/InteractiveMap';
import { HazardPredictionView } from './components/HazardPredictionView';
import { IncidentReportingView } from './components/IncidentReportingView';
import { VerificationCenterView } from './components/VerificationCenterView';
import { AccessibilityScoreView } from './components/AccessibilityScoreView';
import { RouteIntelligenceView } from './components/RouteIntelligenceView';
import { VehicleTrackingView } from './components/VehicleTrackingView';
import { AlertsCenterView } from './components/AlertsCenterView';
import { AnalyticsView } from './components/AnalyticsView';
import { OfflineSyncView } from './components/OfflineSyncView';
import { SafeExitWindowView } from './components/SafeExitWindowView';
import { DriverHudView } from './components/DriverHudView';
import { ContinuousLearningView } from './components/ContinuousLearningView';

const MainLayout: React.FC = () => {
  const { activeTab } = useRoadPulse();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Top Fixed Command Header */}
      <Navbar />

      {/* 16-Step Guided Scenario Controller */}
      <ScenarioRunner />

      {/* Body Area with Sidebar + Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Navigation Menu */}
        <Sidebar />

        {/* Dynamic Main Workspace */}
        <main className="flex-1 overflow-y-auto bg-slate-950/60 pb-16">
          {activeTab === 'dashboard' && <DashboardView />}
          {activeTab === 'map' && (
            <div className="h-[calc(100vh-130px)]">
              <InteractiveMap />
            </div>
          )}
          {activeTab === 'prediction' && <HazardPredictionView />}
          {(activeTab === 'report' || activeTab === 'reporting') && <IncidentReportingView />}
          {activeTab === 'verification' && <VerificationCenterView />}
          {activeTab === 'score' && <AccessibilityScoreView />}
          {activeTab === 'routes' && <RouteIntelligenceView />}
          {activeTab === 'vehicles' && <VehicleTrackingView />}
          {activeTab === 'alerts' && <AlertsCenterView />}
          {activeTab === 'analytics' && <AnalyticsView />}
          {activeTab === 'offline_sync' && <OfflineSyncView />}
          {activeTab === 'safe_exit' && <SafeExitWindowView />}
          {activeTab === 'driver_hud' && <DriverHudView />}
          {activeTab === 'learning' && <ContinuousLearningView />}
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <RoadPulseProvider>
      <MainLayout />
    </RoadPulseProvider>
  );
}
