import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import FieldSupervisorKPIs from './FieldSupervisorKPIs';
import PriorityIncidentsList from './PriorityIncidentsList';
import AssignedIncidentsTable from './AssignedIncidentsTable';
import WorkOrdersSection from './WorkOrdersSection';
import InspectionQueueSection from './InspectionQueueSection';
import InfrastructureAssetsSection from './InfrastructureAssetsSection';
import TeamTechniciansSection from './TeamTechniciansSection';
import EscalationCenter from './EscalationCenter';
import ShiftReportSection from './ShiftReportSection';
import SupervisorProfileSection from './SupervisorProfileSection';
import IncidentDetailDrawer from './IncidentDetailDrawer';
import TrafficIncidentForm from '../trafficIncident/TrafficIncidentForm';
import FieldObservationForm from '../fieldObservation/FieldObservationForm';

import { fetchAll as fetchIncidents } from '../../store/slices/trafficIncidentSlice';
import { fetchAll as fetchObservations } from '../../store/slices/fieldObservationSlice';
import { fetchAll as fetchGrids } from '../../store/slices/utilityGridSlice';
import { fetchAll as fetchZones } from '../../store/slices/trafficZoneSlice';
import { fetchAll as fetchOutages } from '../../store/slices/utilityOutageSlice';
import { addNotification } from '../../store/slices/alertNotificationSlice';

const FieldSupervisorDashboard = ({ initialTab = 'overview' }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  // Determine active tab from URL or prop
  const getTabFromPath = useCallback(() => {
    const path = location.pathname;
    if (path.includes('/field-supervisor/incidents')) return 'incidents';
    if (path.includes('/field-supervisor/work-orders')) return 'work-orders';
    if (path.includes('/field-supervisor/inspections')) return 'inspections';
    if (path.includes('/field-supervisor/assets')) return 'assets';
    if (path.includes('/field-supervisor/team')) return 'team';
    if (path.includes('/field-supervisor/escalations')) return 'escalations';
    if (path.includes('/field-supervisor/reports')) return 'reports';
    if (path.includes('/field-supervisor/profile')) return 'profile';
    return initialTab || 'overview';
  }, [location.pathname, initialTab]);

  const [activeTab, setActiveTab] = useState(getTabFromPath);
  const [selectedIncidentForDrawer, setSelectedIncidentForDrawer] = useState(null);
  const [escalationTargetIncident, setEscalationTargetIncident] = useState(null);
  const [isEscalationModalOpen, setIsEscalationModalOpen] = useState(false);
  const [isAddIncidentModalOpen, setIsAddIncidentModalOpen] = useState(false);
  const [isAddObsModalOpen, setIsAddObsModalOpen] = useState(false);

  // Redux Data
  const incidents = useSelector((state) => state.trafficIncident?.items || []);
  const observations = useSelector((state) => state.fieldObservation?.items || []);
  const grids = useSelector((state) => state.utilityGrid?.items || []);
  const zones = useSelector((state) => state.trafficZone?.items || []);

  const loading = useSelector(
    (state) =>
      state.trafficIncident?.loading ||
      state.fieldObservation?.loading ||
      state.utilityGrid?.loading ||
      state.trafficZone?.loading ||
      false
  );

  const loadData = useCallback(() => {
    dispatch(fetchIncidents());
    dispatch(fetchObservations());
    dispatch(fetchGrids());
    dispatch(fetchZones());
    dispatch(fetchOutages());
  }, [dispatch]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    setActiveTab(getTabFromPath());
  }, [getTabFromPath]);

  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
    if (tabKey === 'overview') {
      navigate('/field-supervisor');
    } else {
      navigate(`/field-supervisor/${tabKey}`);
    }
  };

  // Metrics Calculation
  const assignedIncidents = incidents.filter(
    (i) => i.status !== 'CLOSED' && i.status !== 'RESOLVED'
  ).length;
  const pendingInspections = observations.length;
  const inProgressWorkOrders = incidents.filter(
    (i) => i.status === 'DISPATCHED' || i.status === 'INVESTIGATING' || i.status === 'IN_PROGRESS'
  ).length;
  const resolvedToday = incidents.filter(
    (i) => i.status === 'RESOLVED' || i.status === 'CLOSED'
  ).length;
  const criticalHazards = incidents.filter(
    (i) => i.severity === 'CRITICAL' || i.severity === 'HIGH'
  ).length;
  const slaAtRisk = incidents.filter(
    (i) => i.severity === 'CRITICAL' && (i.status === 'REPORTED' || i.status === 'DISPATCHED')
  ).length;

  const handleOpenEscalation = (incident) => {
    setEscalationTargetIncident(incident);
    setIsEscalationModalOpen(true);
  };

  return (
    <div className="fs-dashboard-container">
      {/* 1. Header Section */}
      <div className="fs-header-row">
        <div className="fs-title-group">
          <div className="fs-badge-role-row">
            <span className="fs-role-badge">FIELD COMMAND CENTER</span>
            <span className="fs-shift-badge">Shift 1 • Sector Alpha</span>
          </div>
          <h1 className="fs-main-heading">Field Supervisor Operations</h1>
          <p className="fs-sub-heading">
            On-ground infrastructure incident triage, crew coordination, and asset inspection
          </p>
        </div>

        <div className="fs-header-right">
          <div className="fs-status-badges-group">
            <div className="fs-status-indicator">
              <span className="operational-dot" aria-hidden="true" />
              <span className="operational-text">RADIO CH-04 SYNCED</span>
            </div>
            <div className="fs-status-indicator indicator-secondary">
              <span className="fs-crew-active-dot" aria-hidden="true" />
              <span>5 Active Techs</span>
            </div>
          </div>

          <div className="fs-quick-action-bar">
            <button
              type="button"
              className="btn-primary fs-btn-quick"
              onClick={() => setIsAddIncidentModalOpen(true)}
            >
              + Log Incident
            </button>
            <button
              type="button"
              className="btn-secondary fs-btn-quick"
              onClick={() => setIsAddObsModalOpen(true)}
            >
              + Add Observation
            </button>
            <button
              type="button"
              className="btn-secondary fs-btn-quick"
              onClick={loadData}
              title="Refresh Telemetry"
            >
              🔄 Refresh
            </button>
          </div>
        </div>
      </div>

      {/* 2. Sub-Navigation Tabs Bar */}
      <div className="fs-subnav-bar">
        <div className="fs-subnav-scroll">
          <button
            type="button"
            className={`fs-subnav-tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => handleTabChange('overview')}
          >
            <span className="fs-tab-icon">📊</span>
            <span className="fs-tab-label">Overview</span>
          </button>
          <button
            type="button"
            className={`fs-subnav-tab ${activeTab === 'incidents' ? 'active' : ''}`}
            onClick={() => handleTabChange('incidents')}
          >
            <span className="fs-tab-icon">📋</span>
            <span className="fs-tab-label">My Incidents</span>
            <span className="fs-tab-counter">{incidents.length}</span>
          </button>
          <button
            type="button"
            className={`fs-subnav-tab ${activeTab === 'work-orders' ? 'active' : ''}`}
            onClick={() => handleTabChange('work-orders')}
          >
            <span className="fs-tab-icon">⚡</span>
            <span className="fs-tab-label">Work Orders</span>
            <span className="fs-tab-counter">{inProgressWorkOrders}</span>
          </button>
          <button
            type="button"
            className={`fs-subnav-tab ${activeTab === 'inspections' ? 'active' : ''}`}
            onClick={() => handleTabChange('inspections')}
          >
            <span className="fs-tab-icon">🔍</span>
            <span className="fs-tab-label">Field Inspections</span>
            <span className="fs-tab-counter">{observations.length}</span>
          </button>
          <button
            type="button"
            className={`fs-subnav-tab ${activeTab === 'assets' ? 'active' : ''}`}
            onClick={() => handleTabChange('assets')}
          >
            <span className="fs-tab-icon">🏢</span>
            <span className="fs-tab-label">Assets & Grids</span>
            <span className="fs-tab-counter">{grids.length + zones.length}</span>
          </button>
          <button
            type="button"
            className={`fs-subnav-tab ${activeTab === 'team' ? 'active' : ''}`}
            onClick={() => handleTabChange('team')}
          >
            <span className="fs-tab-icon">👷</span>
            <span className="fs-tab-label">Crew Roster</span>
            <span className="fs-tab-counter">5</span>
          </button>
          <button
            type="button"
            className={`fs-subnav-tab ${activeTab === 'escalations' ? 'active' : ''}`}
            onClick={() => handleTabChange('escalations')}
          >
            <span className="fs-tab-icon">🚨</span>
            <span className="fs-tab-label">Escalation Center</span>
          </button>
          <button
            type="button"
            className={`fs-subnav-tab ${activeTab === 'reports' ? 'active' : ''}`}
            onClick={() => handleTabChange('reports')}
          >
            <span className="fs-tab-icon">📄</span>
            <span className="fs-tab-label">Shift Reports</span>
          </button>
          <button
            type="button"
            className={`fs-subnav-tab ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => handleTabChange('profile')}
          >
            <span className="fs-tab-icon">🛡️</span>
            <span className="fs-tab-label">Supervisor Profile</span>
          </button>
        </div>
      </div>

      {/* 3. Main Content Views */}
      <div className="fs-content-area">
        {activeTab === 'overview' && (
          <div className="fs-overview-layout">
            {/* 6 Role-Specific KPI Cards */}
            <FieldSupervisorKPIs
              assignedIncidents={assignedIncidents}
              pendingInspections={pendingInspections}
              inProgressWorkOrders={inProgressWorkOrders}
              resolvedToday={resolvedToday}
              slaAtRisk={slaAtRisk}
              criticalHazards={criticalHazards}
              loading={loading}
              onSelectMetric={(id) => {
                if (id === 'inspections') handleTabChange('inspections');
                else if (id === 'in-progress') handleTabChange('work-orders');
                else if (id === 'critical' || id === 'sla-risk') handleTabChange('escalations');
                else handleTabChange('incidents');
              }}
            />

            {/* Priority Incidents & Urgent Actions */}
            <PriorityIncidentsList
              incidents={incidents}
              loading={loading}
              onSelectIncident={(item) => setSelectedIncidentForDrawer(item)}
              onOpenEscalation={handleOpenEscalation}
            />

            {/* Work Orders Board Preview */}
            <WorkOrdersSection
              incidents={incidents}
              onSelectIncident={(item) => setSelectedIncidentForDrawer(item)}
              onOpenEscalation={handleOpenEscalation}
            />

            {/* Assigned Incidents Table */}
            <AssignedIncidentsTable
              incidents={incidents}
              loading={loading}
              onSelectIncident={(item) => setSelectedIncidentForDrawer(item)}
              onOpenEscalation={handleOpenEscalation}
              onAddNewIncident={() => setIsAddIncidentModalOpen(true)}
            />
          </div>
        )}

        {activeTab === 'incidents' && (
          <AssignedIncidentsTable
            incidents={incidents}
            loading={loading}
            onSelectIncident={(item) => setSelectedIncidentForDrawer(item)}
            onOpenEscalation={handleOpenEscalation}
            onAddNewIncident={() => setIsAddIncidentModalOpen(true)}
          />
        )}

        {activeTab === 'work-orders' && (
          <WorkOrdersSection
            incidents={incidents}
            onSelectIncident={(item) => setSelectedIncidentForDrawer(item)}
            onOpenEscalation={handleOpenEscalation}
          />
        )}

        {activeTab === 'inspections' && (
          <InspectionQueueSection
            observations={observations}
            loading={loading}
            onRefresh={loadData}
          />
        )}

        {activeTab === 'assets' && (
          <InfrastructureAssetsSection
            grids={grids}
            zones={zones}
            loading={loading}
          />
        )}

        {activeTab === 'team' && (
          <TeamTechniciansSection
            onDispatchToTech={(tech) => {
              dispatch(
                addNotification({
                  message: `Radio channel opened with ${tech.name}`,
                  type: 'info',
                })
              );
            }}
          />
        )}

        {activeTab === 'escalations' && (
          <EscalationCenter
            incidents={incidents}
            escalationTargetIncident={escalationTargetIncident}
            onCloseModal={() => setIsEscalationModalOpen(false)}
          />
        )}

        {activeTab === 'reports' && (
          <ShiftReportSection
            incidents={incidents}
            observations={observations}
          />
        )}

        {activeTab === 'profile' && (
          <SupervisorProfileSection />
        )}
      </div>

      {/* 4. Incident Detail & Lifecycle Drawer */}
      {selectedIncidentForDrawer && (
        <IncidentDetailDrawer
          incident={selectedIncidentForDrawer}
          onClose={() => setSelectedIncidentForDrawer(null)}
          onOpenEscalation={handleOpenEscalation}
          onStatusUpdated={() => loadData()}
        />
      )}

      {/* 5. Escalation Center Modal if opened from card/drawer */}
      {isEscalationModalOpen && (
        <div className="modal-overlay" onClick={() => setIsEscalationModalOpen(false)}>
          <div
            className="modal-content fs-escalation-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="modal-header">
              <h2>🚨 Immediate Critical Hazard Escalation</h2>
              <button
                type="button"
                className="btn-close"
                onClick={() => setIsEscalationModalOpen(false)}
              >
                ✕
              </button>
            </div>
            <EscalationCenter
              incidents={incidents}
              escalationTargetIncident={escalationTargetIncident}
              onCloseModal={() => setIsEscalationModalOpen(false)}
            />
          </div>
        </div>
      )}

      {/* 6. Add Incident Modal */}
      {isAddIncidentModalOpen && (
        <TrafficIncidentForm
          onClose={() => setIsAddIncidentModalOpen(false)}
          onSuccess={(msg) => {
            dispatch(addNotification({ message: msg, type: 'success' }));
            setIsAddIncidentModalOpen(false);
            loadData();
          }}
        />
      )}

      {/* 7. Add Field Observation Modal */}
      {isAddObsModalOpen && (
        <FieldObservationForm
          onClose={() => setIsAddObsModalOpen(false)}
          onSuccess={(msg) => {
            dispatch(addNotification({ message: msg, type: 'success' }));
            setIsAddObsModalOpen(false);
            loadData();
          }}
        />
      )}
    </div>
  );
};

export default FieldSupervisorDashboard;
