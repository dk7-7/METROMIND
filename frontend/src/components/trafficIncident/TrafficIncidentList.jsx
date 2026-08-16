import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllIncidents, deleteIncident } from '../../store/trafficIncident/trafficIncidentActions';
import { clearIncidentError } from '../../store/trafficIncident/trafficIncidentSlice';
import EmptyState from '../common/EmptyState';
import Pagination from '../common/Pagination';
import SearchFilterBar from '../common/SearchFilterBar';
import Alert from '../common/Alert';
import TrafficIncidentForm from './TrafficIncidentForm';

const TrafficIncidentList = () => {
    const dispatch = useDispatch();
    const { incidents, loading, error } = useSelector(state => state.trafficIncident);
    const { role } = useSelector(state => state.auth);
    
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    
    const [alert, setAlert] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [editRecord, setEditRecord] = useState(null);

    useEffect(() => {
        dispatch(fetchAllIncidents());
    }, [dispatch]);

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this incident?')) {
            dispatch(deleteIncident(id)).unwrap()
                .then(() => setAlert({ message: 'Traffic Incident deleted successfully.', type: 'success' }))
                .catch((err) => setAlert({ message: err, type: 'error' }));
        }
    };

    const handleFormSuccess = (msg) => {
        setShowForm(false);
        setEditRecord(null);
        setAlert({ message: msg, type: 'success' });
        dispatch(fetchAllIncidents());
    };

    const filtered = incidents.filter(i => 
        i.title?.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (filterStatus === '' || i.severity === filterStatus)
    );
    
    const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const canManage = role === 'ADMIN' || role === 'CITY_ADMINISTRATOR' || role === 'TRAFFIC_CONTROLLER';
    const canDelete = role === 'ADMIN' || role === 'CITY_ADMINISTRATOR';

    return (
        <div>
            <h2>Traffic Incidents</h2>
            {alert && <Alert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}
            {error && <Alert message={error} type="error" onClose={() => dispatch(clearIncidentError())} />}
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <SearchFilterBar 
                    onSearch={setSearchTerm} 
                    onFilterChange={setFilterStatus} 
                    filterOptions={[
                        {value: 'LOW', label: 'Low'}, {value: 'MEDIUM', label: 'Medium'},
                        {value: 'HIGH', label: 'High'}, {value: 'CRITICAL', label: 'Critical'}
                    ]}
                />
                {canManage && (
                    <button onClick={() => { setEditRecord(null); setShowForm(true); }} style={{ padding: '0.5rem 1rem', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                        + Add Record
                    </button>
                )}
            </div>

            {loading ? <p>Loading...</p> : 
                paginated.length === 0 ? <EmptyState message="No incidents found." /> : (
                <>
                    <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '2px solid #cbd5e1' }}>
                                <th style={{ padding: '0.75rem', textAlign: 'left' }}>Title</th>
                                <th style={{ padding: '0.75rem', textAlign: 'left' }}>Severity</th>
                                <th style={{ padding: '0.75rem', textAlign: 'left' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginated.map(inc => (
                                <tr key={inc.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                    <td style={{ padding: '0.75rem' }}>{inc.title}</td>
                                    <td style={{ padding: '0.75rem' }}>{inc.severity}</td>
                                    <td style={{ padding: '0.75rem', display: 'flex', gap: '0.5rem' }}>
                                        {canManage && <button onClick={() => { setEditRecord(inc); setShowForm(true); }}>Edit</button>}
                                        {canDelete && <button onClick={() => handleDelete(inc.id)} style={{ color: 'red' }}>Delete</button>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <Pagination totalItems={filtered.length} itemsPerPage={itemsPerPage} currentPage={currentPage} onPageChange={setCurrentPage} />
                </>
            )}

            {showForm && (
                <TrafficIncidentForm 
                    incident={editRecord} 
                    onClose={() => setShowForm(false)} 
                    onSuccess={handleFormSuccess} 
                />
            )}
        </div>
    );
};
export default TrafficIncidentList;
