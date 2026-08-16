import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllIncidents, deleteIncident } from '../../store/trafficIncident/trafficIncidentActions';
import EmptyState from '../common/EmptyState';
import Pagination from '../common/Pagination';
import SearchFilterBar from '../common/SearchFilterBar';
import Alert from '../common/Alert';
import ErrorHandler from '../common/ErrorHandler';
import TrafficIncidentForm from './TrafficIncidentForm';

const TrafficIncidentList = () => {
    const dispatch = useDispatch();
    const { items: incidents = [], loading, error } = useSelector(state => state.trafficIncident) || {};
    const { role } = useSelector(state => state.auth);
    
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingIncident, setEditingIncident] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const itemsPerPage = 5;

    useEffect(() => {
        dispatch(fetchAllIncidents());
    }, [dispatch]);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this incident?')) {
            const resultAction = await dispatch(deleteIncident(id));
            if (deleteIncident.fulfilled.match(resultAction)) {
                setSuccessMessage('Traffic Incident deleted successfully.');
                dispatch(fetchAllIncidents());
                setTimeout(() => setSuccessMessage(''), 3000);
            }
        }
    };

    const filteredIncidents = incidents.filter(i => {
        const matchTitle = i.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchStatus = statusFilter ? i.status === statusFilter : true;
        return matchTitle && matchStatus;
    });

    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedIncidents = filteredIncidents.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div style={{ padding: '2rem' }}>
            <h2>Traffic Incidents</h2>
            
            <ErrorHandler error={error} />
            {successMessage && <Alert message={successMessage} type="success" />}
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <SearchFilterBar 
                    onSearch={setSearchTerm} 
                    onFilterChange={setStatusFilter} 
                    filterOptions={[
                        {value: 'ACTIVE', label: 'Active'},
                        {value: 'RESOLVED', label: 'Resolved'}
                    ]}
                />
                {(role === 'CITY_ADMINISTRATOR' || role === 'TRAFFIC_CONTROLLER') && (
                    <button 
                        onClick={() => { setEditingIncident(null); setShowForm(true); }}
                        style={{ padding: '0.5rem 1rem', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginBottom: '1rem' }}
                    >
                        + Add Record
                    </button>
                )}
            </div>

            {!loading && filteredIncidents.length === 0 ? (
                <EmptyState message="No incidents found." />
            ) : (
                <>
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f1f5f9', textAlign: 'left' }}>
                                <th style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0' }}>Title</th>
                                <th style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0' }}>Severity</th>
                                <th style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0' }}>Status</th>
                                <th style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedIncidents.map(incident => (
                                <tr key={incident.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                    <td style={{ padding: '1rem' }}>{incident.title}</td>
                                    <td style={{ padding: '1rem' }}>{incident.severity}</td>
                                    <td style={{ padding: '1rem' }}>{incident.status}</td>
                                    <td style={{ padding: '1rem' }}>
                                        {(role === 'CITY_ADMINISTRATOR' || role === 'TRAFFIC_CONTROLLER') && (
                                            <button onClick={() => { setEditingIncident(incident); setShowForm(true); }} style={{ marginRight: '0.5rem', cursor: 'pointer' }}>Edit</button>
                                        )}
                                        {role === 'CITY_ADMINISTRATOR' && (
                                            <button onClick={() => handleDelete(incident.id)} style={{ color: 'red', cursor: 'pointer' }}>Delete</button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center' }}>
                        <Pagination 
                            totalItems={filteredIncidents.length} 
                            itemsPerPage={itemsPerPage} 
                            currentPage={currentPage} 
                            onPageChange={setCurrentPage} 
                        />
                    </div>
                </>
            )}

            {showForm && (
                <TrafficIncidentForm 
                    mode={editingIncident ? 'edit' : 'create'} 
                    initialData={editingIncident} 
                    onClose={() => setShowForm(false)} 
                />
            )}
        </div>
    );
};

export default TrafficIncidentList;
