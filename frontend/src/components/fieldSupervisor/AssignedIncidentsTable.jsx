import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { update as updateIncident } from '../../store/slices/trafficIncidentSlice';
import { addNotification } from '../../store/slices/alertNotificationSlice';
import Pagination from '../common/Pagination';
import EmptyState from '../common/EmptyState';
import SearchFilterBar from '../common/SearchFilterBar';

const AssignedIncidentsTable = ({
  incidents = [],
  loading = false,
  onSelectIncident,
  onOpenEscalation,
  onAddNewIncident,
}) => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [severityFilter, setSeverityFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [updatingId, setUpdatingId] = useState(null);

  const handleQuickStatusChange = async (item, newStatus) => {
    const id = item.incidentId || item.id;
    setUpdatingId(id);
    try {
      const updatedData = { ...item, status: newStatus };
      const res = await dispatch(updateIncident({ id, data: updatedData }));
      if (updateIncident.fulfilled.match(res)) {
        dispatch(
          addNotification({
            message: `Incident #${id} updated to ${newStatus}`,
            type: 'success',
          })
        );
      }
    } catch (e) {
      // handled
    } finally {
      setUpdatingId(null);
    }
  };

  // Filter items
  const filtered = incidents.filter((item) => {
    const title = (item.title || '').toLowerCase();
    const zone = (item.zone?.zoneName || item.zoneName || '').toLowerCase();
    const matchesSearch =
      title.includes(searchTerm.toLowerCase()) ||
      zone.includes(searchTerm.toLowerCase()) ||
      String(item.incidentId || item.id).includes(searchTerm);
    const matchesStatus = statusFilter ? item.status === statusFilter : true;
    const matchesSeverity = severityFilter ? item.severity === severityFilter : true;
    return matchesSearch && matchesStatus && matchesSeverity;
  });

  const itemsPerPage = 5;
  const totalItems = filtered.length;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filtered.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="fs-table-container">
      <div className="fs-section-header-row">
        <div>
          <h3 className="fs-section-title">Assigned Field Incidents</h3>
          <p className="fs-section-subtitle">
            Manage, triage, and inspect infrastructure incidents in your sector
          </p>
        </div>
        {onAddNewIncident && (
          <button
            type="button"
            className="btn-primary fs-btn-add"
            onClick={onAddNewIncident}
          >
            + Log New Field Incident
          </button>
        )}
      </div>

      <div className="fs-filter-row">
        <SearchFilterBar
          searchValue={searchTerm}
          filterValue={statusFilter}
          onSearch={(val) => {
            setSearchTerm(val);
            setCurrentPage(1);
          }}
          onFilterChange={(val) => {
            setStatusFilter(val);
            setCurrentPage(1);
          }}
          filterOptions={[
            { label: 'All Statuses', value: '' },
            { label: 'REPORTED', value: 'REPORTED' },
            { label: 'DISPATCHED', value: 'DISPATCHED' },
            { label: 'INVESTIGATING', value: 'INVESTIGATING' },
            { label: 'IN_PROGRESS', value: 'IN_PROGRESS' },
            { label: 'RESOLVED', value: 'RESOLVED' },
            { label: 'CLOSED', value: 'CLOSED' },
          ]}
        />

        <div className="fs-severity-filter-group">
          <label htmlFor="severity-filter-select" className="sr-only">Severity</label>
          <select
            id="severity-filter-select"
            value={severityFilter}
            onChange={(e) => {
              setSeverityFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="fs-secondary-filter"
          >
            <option value="">All Severities</option>
            <option value="CRITICAL">CRITICAL</option>
            <option value="HIGH">HIGH</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="LOW">LOW</option>
          </select>
        </div>
      </div>

      {loading && filtered.length === 0 ? (
        <div className="loading-state">Loading assigned incidents...</div>
      ) : filtered.length === 0 ? (
        <EmptyState message="No matching incidents found in your sector." />
      ) : (
        <>
          <div className="table-card fs-table-card">
            <table>
              <thead>
                <tr>
                  <th>Incident ID</th>
                  <th>Title</th>
                  <th>Severity</th>
                  <th>Status</th>
                  <th>Zone / Location</th>
                  <th>Assigned Crew</th>
                  <th>Quick Action</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item) => {
                  const id = item.incidentId || item.id;
                  const zoneLabel =
                    item.zone?.zoneName ||
                    item.zoneName ||
                    (item.zoneId ? `Zone ${item.zoneId}` : 'Sector 4');
                  const isBusy = updatingId === id;

                  return (
                    <tr key={id}>
                      <td className="fs-id-cell">
                        <span className="badge-id">#{id}</span>
                      </td>
                      <td className="fs-title-cell">
                        <strong className="fs-incident-name">{item.title}</strong>
                      </td>
                      <td>
                        <span className={`fs-severity-tag fs-severity-${(item.severity || 'medium').toLowerCase()}`}>
                          {item.severity || 'MEDIUM'}
                        </span>
                      </td>
                      <td>
                        <span className={`fs-status-pill fs-status-${(item.status || 'reported').toLowerCase()}`}>
                          {item.status || 'REPORTED'}
                        </span>
                      </td>
                      <td>{zoneLabel}</td>
                      <td>
                        <span className="fs-tech-badge">
                          👷 {item.assignedTech || 'Tech Team Alpha'}
                        </span>
                      </td>
                      <td>
                        <select
                          className="fs-quick-status-dropdown"
                          value={item.status || 'REPORTED'}
                          disabled={isBusy}
                          onChange={(e) => handleQuickStatusChange(item, e.target.value)}
                        >
                          <option value="REPORTED">REPORTED</option>
                          <option value="DISPATCHED">DISPATCHED</option>
                          <option value="INVESTIGATING">INVESTIGATING</option>
                          <option value="IN_PROGRESS">IN_PROGRESS</option>
                          <option value="RESOLVED">RESOLVED</option>
                          <option value="CLOSED">CLOSED</option>
                        </select>
                      </td>
                      <td>
                        <div className="fs-table-actions">
                          <button
                            type="button"
                            className="btn-action-edit fs-table-btn"
                            onClick={() => onSelectIncident(item)}
                          >
                            Inspect
                          </button>
                          <button
                            type="button"
                            className="btn-danger-outline fs-table-btn"
                            onClick={() => onOpenEscalation(item)}
                            title="Escalate Hazard"
                          >
                            🚨
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <Pagination
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={(p) => setCurrentPage(p)}
          />
        </>
      )}
    </div>
  );
};

export default AssignedIncidentsTable;
