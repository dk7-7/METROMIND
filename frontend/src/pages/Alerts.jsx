import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllAlerts, markAlertRead } from '../store/alert/alertActions';
import EmptyState from '../components/common/EmptyState';
import ErrorHandler from '../components/common/ErrorHandler';

const Alerts = () => {
    const dispatch = useDispatch();
    const { alerts, loading, error } = useSelector(state => state.alert);

    useEffect(() => {
        dispatch(fetchAllAlerts());
    }, [dispatch]);

    const handleMarkRead = (id) => {
        dispatch(markAlertRead(id));
    };

    return (
        <div style={{ padding: '2rem' }}>
            <h2>Alert Notifications</h2>
            <ErrorHandler error={error} />
            
            {!loading && alerts.length === 0 ? (
                <EmptyState message="No alerts found." />
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                    {alerts.map(alert => (
                        <div key={alert.id} style={{ padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '0.5rem', backgroundColor: alert.isRead ? '#f8fafc' : 'white', opacity: alert.isRead ? 0.7 : 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <h3 style={{ margin: '0 0 0.5rem 0' }}>{alert.title}</h3>
                                    <p style={{ margin: 0 }}>{alert.message}</p>
                                </div>
                                {!alert.isRead && (
                                    <button 
                                        onClick={() => handleMarkRead(alert.id)}
                                        style={{ padding: '0.5rem 1rem', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                    >
                                        Mark as Read
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Alerts;
