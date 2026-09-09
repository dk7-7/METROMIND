import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAll, deleteRecord } from '../../store/slices/trafficIncidentSlice';
import { addNotification } from '../../store/slices/alertNotificationSlice';
import TrafficIncidentForm from './TrafficIncidentForm';
import Pagination from '../common/Pagination';
import EmptyState from '../common/EmptyState';
import SearchFilterBar from '../common/SearchFilterBar';
import Alert from '../common/Alert';
import ErrorHandler from '../common/ErrorHandler';

const TrafficIncidentList = () => {
  const dispatch = useDispatch();
  const { items = [], loading, error } = useSelector(
    (state) => state.trafficIncident || state.trafficIncidents || {}
  );
  const { user, role: directRole } = useSelector((state) => state.auth || {});

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIncident, setEditingIncident] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const role = user?.role || directRole || localStorage.getItem('role') || '';
  const canAddRecord =
    role === 'CITY_ADMINISTRATOR' || role === 'TRAFFIC_CONTROLLER';
  const canDelete =
    role === 'CITY_ADMINISTRATOR' || role === 'TRAFFIC_CONTROLLER';

  useEffect(() => {
    dispatch(fetchAll());
  }, [dispatch]);

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this incident?');
    if (!confirmed) return;

    try {
      const resultAction = await dispatch(deleteRecord(id));
      if (deleteRecord.fulfilled.match(resultAction)) {
        const msg =
          resultAction.payload?.message ||
          (typeof resultAction.payload === 'string'
            ? resultAction.payload
            : 'TrafficIncident deleted successfully.');
        setSuccessMessage(msg);
        dispatch(addNotification({ message: msg, type: 'success' }));
        dispatch(fetchAll());
      }
    } catch (err) {
      // Error handled by redux
    }
  };

  const handleEdit = (incident) => {
    setEditingIncident(incident);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingIncident(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingIncident(null);
  };

  // Filter & Search
  const rawItems = Array.isArray(items) ? items : [];
  const filteredItems = rawItems.filter((item) => {
    const title = item?.title || '';
    const status = item?.status || '';
    const matchesSearch = title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter ? status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  // Pagination - exactly 5 per page
  const itemsPerPage = 5;
  const totalItems = filteredItems.length;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  const getSeverityBadge = (severity) => {
    switch (severity) {
      case 'CRITICAL':
        return {
          bg: '#fef2f2',
          border: '#fecaca',
          text: '#b91c1c',
          dot: '#ef4444',
        };
      case 'HIGH':
        return {
          bg: '#fff7ed',
          border: '#fed7aa',
          text: '#c2410c',
          dot: '#f97316',
        };
      case 'MEDIUM':
        return {
          bg: '#fffbeb',
          border: '#fde68a',
          text: '#b45309',
          dot: '#f59e0b',
        };
      case 'LOW':
      default:
        return {
          bg: '#ecfdf5',
          border: '#a7f3d0',
          text: '#047857',
          dot: '#10b981',
        };
    }
  };

  const getStatusBadge = (status = 'REPORTED') => {
    switch (status) {
      case 'RESOLVED':
        return { bg: '#ecfdf5', border: '#a7f3d0', text: '#047857' };
      case 'INVESTIGATING':
        return { bg: '#f5f3ff', border: '#ddd6fe', text: '#6d28d9' };
      case 'DISPATCHED':
        return { bg: '#fffbeb', border: '#fde68a', text: '#b45309' };
      case 'CLOSED':
        return { bg: '#f1f5f9', border: '#e2e8f0', text: '#475569' };
      case 'REPORTED':
      default:
        return { bg: '#eff6ff', border: '#bfdbfe', text: '#1d4ed8' };
    }
  };

  return (
    <div className="incident-list-container">
      <div className="page-header">
        <div className="page-title-group">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <h1 className="page-title">
              Traffic Incidents
            </h1>
            <span
              style={{
                padding: '0.2rem 0.65rem',
                borderRadius: '9999px',
                backgroundColor: 'rgba(37, 99, 235, 0.12)',
                color: '#2563eb',
                fontSize: '0.775rem',
                fontWeight: 700,
                border: '1px solid rgba(37, 99, 235, 0.25)',
              }}
            >
              {rawItems.length} Records
            </span>
          </div>
          <p className="page-subtitle">
            Live traffic incident log, emergency dispatch status, and severity dispatch records
          </p>
        </div>

        {canAddRecord && (
          <button
            type="button"
            className="btn-add-record btn-primary"
            onClick={handleAdd}
          >
            <span>+</span> Report Incident
          </button>
        )}
      </div>

      {error && <ErrorHandler error={error} />}

      {successMessage && (
        <Alert
          message={successMessage}
          type="success"
          duration={4000}
          onClose={() => setSuccessMessage(null)}
        />
      )}

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
          { label: 'RESOLVED', value: 'RESOLVED' },
          { label: 'CLOSED', value: 'CLOSED' },
        ]}
      />

      {loading && filteredItems.length === 0 && !error && (
        <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
          <div className="skeleton" style={{ height: '48px', marginBottom: '0.5rem', width: '100%' }} />
          <div className="skeleton" style={{ height: '200px', width: '100%' }} />
        </div>
      )}

      {filteredItems.length === 0 ? (
        !loading && !error && <EmptyState message="No incidents found." />
      ) : (
        <>
          <div className="table-card">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Severity</th>
                  <th>Status</th>
                  <th>Zone</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item) => {
                  const id = item.incidentId || item.id;
                  const sevStyle = getSeverityBadge(item.severity);
                  const statStyle = getStatusBadge(item.status);
                  const zoneLabel = item.zone?.zoneName || item.zoneName || (item.zoneId ? `Zone ${item.zoneId}` : 'Main Zone');

                  return (
                    <tr key={id}>
                      <td style={{ fontWeight: 600 }}>
                        <span style={{ fontFamily: 'monospace', padding: '0.15rem 0.4rem', borderRadius: '4px', backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)' }}>
                          #{id}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.925rem', fontWeight: 600, display: 'block' }}>
                          {item.title}
                        </span>
                        {item.description && (
                          <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)', display: 'block', marginTop: '2px', maxWidth: '380px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {item.description}
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '0.85rem 1.15rem' }}>
                        <span
                          className="status-badge"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            padding: '0.25rem 0.65rem',
                            borderRadius: '9999px',
                            fontWeight: 700,
                            fontSize: '0.75rem',
                            backgroundColor: sevStyle.bg,
                            color: sevStyle.text,
                            border: `1px solid ${sevStyle.border}`,
                          }}
                        >
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: sevStyle.dot }} />
                          {item.severity}
                        </span>
                      </td>
                      <td style={{ padding: '0.85rem 1.15rem' }}>
                        <span
                          style={{
                            padding: '0.25rem 0.6rem',
                            borderRadius: '6px',
                            fontWeight: 600,
                            fontSize: '0.775rem',
                            backgroundColor: statStyle.bg,
                            color: statStyle.text,
                            border: `1px solid ${statStyle.border}`,
                          }}
                        >
                          {item.status || 'REPORTED'}
                        </span>
                      </td>
                      <td style={{ padding: '0.85rem 1.15rem', fontSize: '0.875rem', color: '#475569' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                          <span>📍</span> {zoneLabel}
                        </span>
                      </td>
                      <td style={{ padding: '0.85rem 1.15rem', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                          {canAddRecord && (
                            <button
                              type="button"
                              className="btn-action-edit"
                              onClick={() => handleEdit(item)}
                              aria-label={`Edit incident ${id}`}
                            >
                              Edit
                            </button>
                          )}
                          {canDelete && (
                            <button
                              type="button"
                              className="btn-delete"
                              onClick={() => handleDelete(id)}
                              aria-label={`Delete incident ${id}`}
                            >
                              Delete
                            </button>
                          )}
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
            onPageChange={(page) => setCurrentPage(page)}
          />
        </>
      )}

      {isModalOpen && (
        <TrafficIncidentForm
          incident={editingIncident}
          item={editingIncident}
          onClose={handleCloseModal}
          onSuccess={(msg) => {
            setSuccessMessage(msg);
            dispatch(fetchAll());
          }}
        />
      )}
    </div>
  );
};

export default TrafficIncidentList;