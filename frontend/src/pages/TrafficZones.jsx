import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllZones } from '../store/trafficZone/trafficZoneActions';
import trafficZoneService from '../services/trafficZoneService';
import ErrorHandler from '../components/common/ErrorHandler';
import EmptyState from '../components/common/EmptyState';

const TrafficZones = () => {
    const dispatch = useDispatch();
    const { zones, loading, error } = useSelector(state => state.trafficZone);
    const { role } = useSelector(state => state.auth);
    const [localError, setLocalError] = useState(null);

    useEffect(() => {
        dispatch(fetchAllZones());
    }, [dispatch]);

    const handleDelete = async (id) => {
        try {
            await trafficZoneService.delete(id);
            dispatch(fetchAllZones());
        } catch (err) {
            setLocalError(err.response?.data?.message || 'Failed to delete zone');
        }
    };

    return (
        <div style={{ padding: '2rem' }}>
            <h2>Traffic Zones</h2>
            <ErrorHandler error={error || localError} />
            
            {!loading && zones.length === 0 ? (
                <EmptyState message="No traffic zones found." />
            ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f1f5f9', textAlign: 'left' }}>
                            <th style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0' }}>Name</th>
                            <th style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0' }}>Status</th>
                            <th style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0' }}>Congestion Level</th>
                            {role === 'CITY_ADMINISTRATOR' && (
                                <th style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0' }}>Actions</th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {zones.map(zone => (
                            <tr key={zone.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                <td style={{ padding: '1rem' }}>{zone.name}</td>
                                <td style={{ padding: '1rem' }}>{zone.status}</td>
                                <td style={{ padding: '1rem' }}>{zone.congestionLevel}</td>
                                {role === 'CITY_ADMINISTRATOR' && (
                                    <td style={{ padding: '1rem' }}>
                                        <button onClick={() => handleDelete(zone.id)} style={{ color: 'red', cursor: 'pointer' }}>Delete</button>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default TrafficZones;
