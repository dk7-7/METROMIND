import React from 'react';

const FieldSupervisorKPIs = ({
  assignedIncidents = 0,
  pendingInspections = 0,
  inProgressWorkOrders = 0,
  resolvedToday = 0,
  slaAtRisk = 0,
  criticalHazards = 0,
  loading = false,
  onSelectMetric,
}) => {
  const cards = [
    {
      id: 'assigned',
      title: 'Assigned Incidents',
      value: assignedIncidents,
      tag: 'ACTIVE QUEUE',
      status: 'info',
      icon: '📋',
      description: 'Incidents requiring supervisor action',
      trend: '+2 from last hour',
    },
    {
      id: 'inspections',
      title: 'Pending Inspections',
      value: pendingInspections,
      tag: 'FIELD QUEUE',
      status: pendingInspections > 0 ? 'warning' : 'success',
      icon: '🔍',
      description: 'Observations awaiting validation',
      trend: `${pendingInspections} awaiting review`,
    },
    {
      id: 'in-progress',
      title: 'In Progress Work Orders',
      value: inProgressWorkOrders,
      tag: 'ON-SITE CREW',
      status: 'info',
      icon: '⚡',
      description: 'Active field dispatches on-ground',
      trend: 'Crew dispatched',
    },
    {
      id: 'resolved',
      title: 'Resolved Today',
      value: resolvedToday,
      tag: 'SHIFT PROGRESS',
      status: 'success',
      icon: '✅',
      description: 'Verified & closed during shift',
      trend: 'Target: 95% SLA',
    },
    {
      id: 'sla-risk',
      title: 'Overdue / SLA at Risk',
      value: slaAtRisk,
      tag: 'SLA MONITOR',
      status: slaAtRisk > 0 ? 'critical' : 'success',
      icon: '⏱️',
      description: 'Tasks near or past response window',
      trend: slaAtRisk > 0 ? 'Needs attention' : 'All SLAs nominal',
    },
    {
      id: 'critical',
      title: 'Critical Hazards',
      value: criticalHazards,
      tag: 'HIGH PRIORITY',
      status: criticalHazards > 0 ? 'critical' : 'success',
      icon: '🚨',
      description: 'Immediate safety & infrastructure risks',
      trend: criticalHazards > 0 ? 'Priority protocol active' : 'Zero critical hazards',
    },
  ];

  return (
    <div className="fs-kpi-grid">
      {cards.map((card) => (
        <div
          key={card.id}
          className={`fs-kpi-card fs-kpi-${card.status} ${loading ? 'skeleton-loading' : ''}`}
          onClick={() => onSelectMetric && onSelectMetric(card.id)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              onSelectMetric && onSelectMetric(card.id);
            }
          }}
        >
          <div className="fs-kpi-header">
            <span className="fs-kpi-tag">{card.tag}</span>
            <div className="fs-kpi-icon-wrap" aria-hidden="true">
              {card.icon}
            </div>
          </div>
          <div className="fs-kpi-body">
            <h3 className="fs-kpi-title">{card.title}</h3>
            <div className="fs-kpi-value-row">
              <span className="fs-kpi-value">{loading ? '...' : card.value}</span>
            </div>
            <p className="fs-kpi-desc">{card.description}</p>
          </div>
          <div className="fs-kpi-footer">
            <span className="fs-kpi-trend">
              <span className="fs-trend-bullet" aria-hidden="true" />
              {card.trend}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FieldSupervisorKPIs;
