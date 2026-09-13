import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAll, deleteRecord, resolveIncident } from '../../store/slices/trafficIncidentSlice';
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
  const { user } = useSelector((state) => state.auth || {});

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIncident, setEditingIncident] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [resolvingId, setResolvingId] = useState(null);

  const role = user?.role || localStorage.getItem('role') || '';
  const canAddRecord =
    role === 'CITY_ADMINISTRATOR' || role === 'TRAFFIC_CONTROLLER';
  const canDelete =
    role === 'CITY_ADMINISTRATOR' || role === 'TRAFFIC_CONTROLLER';

  useEffect(() => {
    dispatch(fetchAll());
  }, [dispatch]);

  const handleResolve = async (incident) => {
    const id = incident.incidentId || incident.id;
    setResolvingId(id);
    try {
      const resultAction = await dispatch(resolveIncident(id));
      if (resolveIncident.fulfilled.match(resultAction)) {
        const msg = 'TrafficIncident resolved successfully.';
        setSuccessMessage(msg);
        dispatch(addNotification({ message: msg, type: 'success' }));
        dispatch(fetchAll());
      } else {
        const errMsg = resultAction.payload || 'Failed to resolve traffic incident';
        dispatch(addNotification({ message: errMsg, type: 'error' }));
      }
    } catch (err) {
      dispatch(addNotification({ message: 'Failed to resolve traffic incident', type: 'error' }));
    } finally {
      setResolvingId(null);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this incident?');
    if (!confirmed) return;

    try {
      const resultAction = await dispatch(deleteRecord(id));
      if (deleteRecord.fulfilled.match(resultAction)) {
        const msg = 'TrafficIncident deleted successfully.';
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
        <h1>Traffic Incidents</h1>

        {canAddRecord && (
          <button
            type="button"
            className="btn-add-record"
            onClick={handleAdd}
          >
            + Add Record
          </button>
        )}
      </div>

      {error && <ErrorHandler error={error} />}

      {successMessage && (
        <Alert
          message={successMessage}
          type="success"
          duration={3000}
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
          { label: 'RESOLVED', value: 'RESOLVED' }
        ]}
      />

      {loading && filteredItems.length === 0 && !error && (
        <div className="loading-state">Loading...</div>
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
                  <th>Traffic Zone</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item) => {
                  const id = item.incidentId || item.id;
                  const zoneLabel =
                    item.zone?.zoneName ||
                    item.zoneName ||
                    (item.zoneId ? `Zone ${item.zoneId}` : '');

                  return (
                    <tr key={id}>
                      <td>#{id}</td>
                      <td>{item.title}</td>
                      <td>{item.severity}</td>
                      <td>{item.status || 'REPORTED'}</td>
                      <td>{zoneLabel}</td>
                      <td>
                        <div className="action-button-group">
                          {item.status !== 'RESOLVED' && item.status !== 'CLOSED' && (
                            <button
                              type="button"
                              className="btn-action-resolve"
                              disabled={resolvingId === id}
                              onClick={() => handleResolve(item)}
                            >
                              {resolvingId === id ? 'Resolving...' : 'Resolve'}
                            </button>
                          )}
                          {canAddRecord && (
                            <button
                              type="button"
                              className="btn-action-edit"
                              onClick={() => handleEdit(item)}
                            >
                              Edit
                            </button>
                          )}
                          {canDelete && (
                            <button
                              type="button"
                              className="btn-delete"
                              onClick={() => handleDelete(id)}
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