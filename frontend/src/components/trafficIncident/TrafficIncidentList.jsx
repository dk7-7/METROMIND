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

  return (
    <div className="incident-list-container">
      <div className="page-header">
        <div className="page-title-group">
          <div className="page-title-row">
            <h1 className="page-title">
              Traffic Incidents
            </h1>
            <span className="badge-record-count">
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
        <div className="loading-state">
          <div className="skeleton" />
          <div className="skeleton" />
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
                  <th className="th-actions">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item) => {
                  const id = item.incidentId || item.id;
                  const zoneLabel = item.zone?.zoneName || item.zoneName || (item.zoneId ? `Zone ${item.zoneId}` : 'Main Zone');
                  const sevClass = `severity-${(item.severity || 'low').toLowerCase()}`;
                  const statClass = `status-${(item.status || 'reported').toLowerCase()}`;

                  return (
                    <tr key={id}>
                      <td className="td-id">
                        <span className="badge-id">
                          #{id}
                        </span>
                      </td>
                      <td className="td-title-desc">
                        <span className="record-title">
                          {item.title}
                        </span>
                        {item.description && (
                          <span className="record-description">
                            {item.description}
                          </span>
                        )}
                      </td>
                      <td>
                        <span className={`status-badge ${sevClass}`}>
                          <span className="status-dot" />
                          {item.severity}
                        </span>
                      </td>
                      <td>
                        <span className={`badge-status ${statClass}`}>
                          {item.status || 'REPORTED'}
                        </span>
                      </td>
                      <td className="td-zone">
                        <span className="zone-label-wrap">
                          <span>📍</span> {zoneLabel}
                        </span>
                      </td>
                      <td className="td-actions">
                        <div className="action-button-group">
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