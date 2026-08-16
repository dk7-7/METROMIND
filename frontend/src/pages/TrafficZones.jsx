import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllZones, deleteZone } from '../store/trafficZone/trafficZoneActions';
import Pagination from '../components/common/Pagination';
import EmptyState from '../components/common/EmptyState';

const TrafficZones = () => {
    const dispatch = useDispatch();
    const { zones, loading } = useSelector(state => state.trafficZone);
    const { role } = useSelector(state => state.auth);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        dispatch(fetchAllZones());
    }, [dispatch]);

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this zone?')) {
            dispatch(deleteZone(id));
        }
    };

    const paginated = zones.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div>
            <h2>Traffic Zones</h2>
            {loading ? <p>Loading...</p> : 
                paginated.length === 0 ? <EmptyState message="No traffic zones found." /> : (
                <>
                    <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '2px solid #cbd5e1' }}>
                                <th style={{ padding: '0.75rem', textAlign: 'left' }}>Zone Name</th>
                                <th style={{ padding: '0.75rem', textAlign: 'left' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginated.map(zone => (
                                <tr key={zone.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                    <td style={{ padding: '0.75rem' }}>{zone.name}</td>
                                    <td style={{ padding: '0.75rem' }}>
                                        {role === 'ADMIN' && <button onClick={() => handleDelete(zone.id)}>Delete</button>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <Pagination totalItems={zones.length} itemsPerPage={itemsPerPage} currentPage={currentPage} onPageChange={setCurrentPage} />
                </>
            )}
        </div>
    );
};
export default TrafficZones;
