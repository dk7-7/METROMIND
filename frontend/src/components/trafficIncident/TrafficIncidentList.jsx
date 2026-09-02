import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAll, deleteRecord } from '../../store/slices/trafficIncidentSlice';
import { addNotification } from '../../store/slices/alertNotificationSlice';
import TrafficIncidentForm from './TrafficIncidentForm';
import Pagination from '../common/Pagination';
import EmptyState from '../common/EmptyState';
import SearchFilterBar from '../common/SearchFilterBar';
import Alert from '../common/Alert';

const TrafficIncidentList = () => {
  const dispatch = useDispatch();
  const { items = [], loading } = useSelector(
    (state) => state.trafficIncident || {}
  );
  const { user } = useSelector((state) => state.auth || {});

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIncident, setEditingIncident] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const role = user?.role || localStorage.getItem('role') || '';
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
  const filteredItems = (items || []).filter((item) => {
    const title = item.title || '';
    const status = item.status || '';
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
    <div className="incident-list-container" style={{ padding: '2rem', maxWidth: '1100px', margin: '0 auto' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
        }}
      >
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>
          Traffic Incidents
        </h1>

        {canAddRecord && (
          <button
            type="button"
            className="btn-add-record"
            onClick={handleAdd}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#2563eb',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            + Add Record
          </button>
        )}
      </div>

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

      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
          Loading traffic incidents...
        </div>
      ) : filteredItems.length === 0 ? (
        <EmptyState message="No incidents found." />
      ) : (
        <>
          <div style={{ overflowX: 'auto', backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  <th style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#475569', fontSize: '0.875rem' }}>ID</th>
                  <th style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#475569', fontSize: '0.875rem' }}>Title</th>
                  <th style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#475569', fontSize: '0.875rem' }}>Severity</th>
                  <th style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#475569', fontSize: '0.875rem' }}>Status</th>
                  <th style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#475569', fontSize: '0.875rem' }}>Zone</th>
                  <th style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#475569', fontSize: '0.875rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item) => {
                  const id = item.incidentId || item.id;
                  return (
                    <tr key={id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '0.75rem 1rem', fontSize: '0.875rem', color: '#64748b' }}>#{id}</td>
                      <td style={{ padding: '0.75rem 1rem', fontSize: '0.9rem', fontWeight: 600, color: '#1e293b' }}>
                        {item.title}
                      </td>
                      <td style={{ padding: '0.75rem 1rem', fontSize: '0.85rem' }}>
                        <span
                          style={{
                            padding: '0.25rem 0.5rem',
                            borderRadius: '9999px',
                            fontWeight: 600,
                            backgroundColor:
                              item.severity === 'CRITICAL' ? '#fee2e2' :
                              item.severity === 'HIGH' ? '#ffedd5' :
                              item.severity === 'MEDIUM' ? '#fef3c7' : '#dcfce7',
                            color:
                              item.severity === 'CRITICAL' ? '#b91c1c' :
                              item.severity === 'HIGH' ? '#c2410c' :
                              item.severity === 'MEDIUM' ? '#b45309' : '#15803d',
                          }}
                        >
                          {item.severity}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem 1rem', fontSize: '0.85rem' }}>
                        <span style={{ fontWeight: 500, color: '#475569' }}>
                          {item.status || 'REPORTED'}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem 1rem', fontSize: '0.875rem', color: '#64748b' }}>
                        {item.zone?.zoneName || item.zoneName || `Zone ${item.zoneId || '-'}`}
                      </td>
                      <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                          {canAddRecord && (
                            <button
                              type="button"
                              onClick={() => handleEdit(item)}
                              style={{
                                padding: '0.25rem 0.6rem',
                                fontSize: '0.8rem',
                                border: '1px solid #cbd5e1',
                                borderRadius: '4px',
                                backgroundColor: '#ffffff',
                                color: '#334155',
                                cursor: 'pointer',
                              }}
                            >
                              Edit
                            </button>
                          )}
                          {canDelete && (
                            <button
                              type="button"
                              className="btn-delete"
                              onClick={() => handleDelete(id)}
                              style={{
                                padding: '0.25rem 0.6rem',
                                fontSize: '0.8rem',
                                border: '1px solid #fca5a5',
                                borderRadius: '4px',
                                backgroundColor: '#fee2e2',
                                color: '#b91c1c',
                                cursor: 'pointer',
                                fontWeight: 600,
                              }}
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