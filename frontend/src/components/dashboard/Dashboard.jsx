import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import api from '../../services/api';
import { fetchAll as fetchIncidents } from '../../store/slices/trafficIncidentSlice';
import { fetchAll as fetchOutages } from '../../store/slices/utilityOutageSlice';
import { fetchAll as fetchZones } from '../../store/slices/trafficZoneSlice';
import { fetchAll as fetchAlerts } from '../../store/slices/alertNotificationSlice';
import { fetchAll as fetchGrids } from '../../store/slices/utilityGridSlice';

import StatCards from './StatCards';
import DigitalTwinCity from './DigitalTwinCity';
import TrafficPrediction from './TrafficPrediction';
import IncidentCenter from './IncidentCenter';
import EmergencyTracking from './EmergencyTracking';
import SignalManager from './SignalManager';
import CCTVGrid from './CCTVGrid';
import UtilityMonitor from './UtilityMonitor';
import AnalyticsSection from './AnalyticsSection';
import IncidentStatusDonut from './IncidentStatusDonut';
import RecentActivity from './RecentActivity';
import TrafficIncidentForm from '../trafficIncident/TrafficIncidentForm';

import {
  Activity,
  Layers,
  Cpu,
  Flame,
  ShieldAlert,
  Sliders,
  Video,
  Zap,
  BarChart2,
  Sparkles,
  RefreshCw,
  Plus,
  Radio,
  Clock,
  Compass
} from 'lucide-react';

const Dashboard = () => {
  const dispatch = useDispatch();

  const [stats, setStats] = useState({
    totalIncidents: 0,
    activeOutages: 0,
    congestedZones: 0,
    criticalAlerts: 0,
  });

  const [activeSectionTab, setActiveSectionTab] = useState('ALL');
  const [greenCorridorActive, setGreenCorridorActive] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedEntityTelemetry, setSelectedEntityTelemetry] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const incidents = useSelector((state) => state.trafficIncident?.items || []);
  const outages = useSelector((state) => state.utilityOutage?.items || []);
  const zones = useSelector((state) => state.trafficZone?.items || []);
  const alerts = useSelector((state) => state.alertNotification?.items || []);
  const grids = useSelector((state) => state.utilityGrid?.items || []);

  const loadData = () => {
    setIsRefreshing(true);
    dispatch(fetchIncidents());
    dispatch(fetchOutages());
    dispatch(fetchZones());
    dispatch(fetchAlerts());
    dispatch(fetchGrids());

    api.get('/dashboard/stats')
      .then((res) => {
        if (res.data) setStats(res.data);
      })
      .catch(() => {
        // Redux slices provide computed stats fallback
      })
      .finally(() => {
        setTimeout(() => setIsRefreshing(false), 500);
      });
  };

  useEffect(() => {
    loadData();
  }, [dispatch]);

  // Combine calculated stats
  const computedStats = {
    totalIncidents: stats.totalIncidents || incidents.length,
    activeOutages: stats.activeOutages || outages.filter((o) => o.status !== 'RESTORED').length,
    congestedZones: stats.congestedZones || zones.filter((z) => z.currentCongestionLevel === 'HIGH' || z.currentCongestionLevel === 'SEVERE').length,
    criticalAlerts: stats.criticalAlerts || alerts.filter((a) => a.severity === 'CRITICAL' && !a.isRead).length,
  };

  const recentActivities = [
    ...incidents.slice(0, 4).map((i) => ({
      icon: '🚨',
      title: `Incident: ${i.title}`,
      description: `Status: ${i.status || 'REPORTED'} - Severity: ${i.severity}`,
      time: i.reportedAt ? new Date(i.reportedAt).toLocaleTimeString() : 'Recent',
    })),
    ...outages.slice(0, 3).map((o) => ({
      icon: '⚡',
      title: `Outage: ${o.affectedArea}`,
      description: `Type: ${o.outageType} - Status: ${o.status || 'ACTIVE'}`,
      time: o.startTime ? new Date(o.startTime).toLocaleTimeString() : 'Recent',
    })),
  ];

  const sectionTabs = [
    { id: 'ALL', label: 'Full Command Matrix', icon: Sparkles },
    { id: 'TWIN', label: '3D Digital Twin City', icon: Layers },
    { id: 'PREDICTION', label: 'AI Traffic Prediction', icon: Cpu },
    { id: 'INCIDENTS', label: 'Incident Radar', icon: Flame },
    { id: 'EMERGENCY', label: 'Emergency Corridor', icon: ShieldAlert },
    { id: 'SIGNALS', label: 'Signal Controllers', icon: Sliders },
    { id: 'CCTV', label: 'CCTV Feeds', icon: Video },
    { id: 'UTILITIES', label: 'Smart Utilities', icon: Zap },
    { id: 'ANALYTICS', label: 'City Analytics', icon: BarChart2 },
  ];

  return (
    <div className="dashboard-container command-center-root">
      {/* Hero / Overview Section */}
      <div className="page-header command-hero-header glass-panel">
        <div className="page-title-group">
          <div className="hero-badge-row">
            <span className="hero-status-pill">
              <span className="telemetry-dot live-pulse" />
              <span>AI DIGITAL TWIN ACTIVE</span>
            </span>
            <span className="hero-version-pill">METROMIND v4.8 COMMAND</span>
          </div>

          <h1 className="page-title hero-heading">
            Smart City Traffic &amp; Utility Command Center
          </h1>
          <p className="page-subtitle hero-subtext">
            Real-time AI-powered monitoring, prediction and incident management across municipal corridors
          </p>
        </div>

        {/* Hero Telemetry Badges & Refresh */}
        <div className="hero-actions-group">
          <div className="hero-telemetry-badge glass-panel">
            <div className="telemetry-node">
              <span className="node-label">Active Cameras</span>
              <span className="node-val text-cyan">24 / 24 Online</span>
            </div>
            <div className="node-divider" />
            <div className="telemetry-node">
              <span className="node-label">Emergency Units</span>
              <span className="node-val text-emerald">3 Deployed</span>
            </div>
            <div className="node-divider" />
            <div className="telemetry-node">
              <span className="node-label">System Health</span>
              <span className="node-val text-purple">99.98% Optimal</span>
            </div>
          </div>

          <div className="hero-buttons-row">
            <button
              type="button"
              className="btn-action-refresh"
              onClick={loadData}
              title="Refresh All Telemetry Feeds"
            >
              <RefreshCw size={15} className={isRefreshing ? 'animate-spin' : ''} />
              <span>Sync Feeds</span>
            </button>

            <button
              type="button"
              className="btn-hero-report btn-primary"
              onClick={() => setIsReportModalOpen(true)}
            >
              <Plus size={15} />
              <span>Report Incident</span>
            </button>
          </div>
        </div>
      </div>

      {/* Command Center Navigation Jump Pills */}
      <div className="command-navigation-tabs glass-panel">
        {sectionTabs.map((tab) => {
          const IconComp = tab.icon;
          const isActive = activeSectionTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              className={`command-tab-btn ${isActive ? 'active' : ''}`}
              onClick={() => setActiveSectionTab(tab.id)}
            >
              <IconComp size={15} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Primary Stat Cards */}
      {(activeSectionTab === 'ALL' || activeSectionTab === 'TWIN') && (
        <StatCards
          totalIncidents={computedStats.totalIncidents}
          activeOutages={computedStats.activeOutages}
          congestedZones={computedStats.congestedZones}
          criticalAlerts={computedStats.criticalAlerts}
        />
      )}

      {/* 3D Smart City Digital Twin Centerpiece */}
      {(activeSectionTab === 'ALL' || activeSectionTab === 'TWIN') && (
        <section className="dashboard-section-block">
          <DigitalTwinCity
            incidents={incidents}
            onSelectEntity={(entity) => setSelectedEntityTelemetry(entity)}
            onActivateGreenCorridor={() => setGreenCorridorActive(!greenCorridorActive)}
            greenCorridorActive={greenCorridorActive}
          />
        </section>
      )}

      {/* AI Traffic Prediction Section */}
      {(activeSectionTab === 'ALL' || activeSectionTab === 'PREDICTION') && (
        <section className="dashboard-section-block">
          <TrafficPrediction />
        </section>
      )}

      {/* Incident Center & Emergency Vehicle Fleet Tracking Split */}
      {(activeSectionTab === 'ALL' || activeSectionTab === 'INCIDENTS' || activeSectionTab === 'EMERGENCY') && (
        <div className="dashboard-split-2col">
          {(activeSectionTab === 'ALL' || activeSectionTab === 'INCIDENTS') && (
            <IncidentCenter
              incidents={incidents}
              onReportClick={() => setIsReportModalOpen(true)}
              onSelectIncident={(inc) => setSelectedEntityTelemetry(inc)}
            />
          )}

          {(activeSectionTab === 'ALL' || activeSectionTab === 'EMERGENCY') && (
            <EmergencyTracking
              onToggleCorridor={() => setGreenCorridorActive(!greenCorridorActive)}
              corridorActive={greenCorridorActive}
            />
          )}
        </div>
      )}

      {/* Traffic Signal Controllers */}
      {(activeSectionTab === 'ALL' || activeSectionTab === 'SIGNALS') && (
        <section className="dashboard-section-block">
          <SignalManager greenCorridorActive={greenCorridorActive} />
        </section>
      )}

      {/* CCTV Optical Surveillance Feeds */}
      {(activeSectionTab === 'ALL' || activeSectionTab === 'CCTV') && (
        <section className="dashboard-section-block">
          <CCTVGrid />
        </section>
      )}

      {/* Smart Utility Monitoring */}
      {(activeSectionTab === 'ALL' || activeSectionTab === 'UTILITIES') && (
        <section className="dashboard-section-block">
          <UtilityMonitor grids={grids} outages={outages} />
        </section>
      )}

      {/* Analytics & Longitudinal Heatmaps */}
      {(activeSectionTab === 'ALL' || activeSectionTab === 'ANALYTICS') && (
        <section className="dashboard-section-block">
          <AnalyticsSection incidents={incidents} />
        </section>
      )}

      {/* Historical Distribution & Live Stream Timeline */}
      {activeSectionTab === 'ALL' && (
        <div className="dashboard-grid">
          <IncidentStatusDonut incidents={incidents} />
          <RecentActivity activities={recentActivities} />
        </div>
      )}

      {/* Report Incident Modal */}
      {isReportModalOpen && (
        <TrafficIncidentForm
          onClose={() => setIsReportModalOpen(false)}
          onSuccess={() => {
            setIsReportModalOpen(false);
            loadData();
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;
