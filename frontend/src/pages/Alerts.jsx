import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllAlerts, markAlertRead } from '../store/alert/alertActions';

const Alerts = () => {
    const dispatch = useDispatch();
    const { alerts, loading } = useSelector(state => state.alert);

    useEffect(() => {
        dispatch(fetchAllAlerts());
    }, [dispatch]);

    return (
        <div>
            <h2>Alert Notifications</h2>
            {loading ? <p>Loading...</p> : alerts.map(alert => (
                <div key={alert.id} style={{ padding: '1rem', border: '1px solid #ccc', marginBottom: '1rem', backgroundColor: alert.read ? '#f1f5f9' : 'white' }}>
                    <p>{alert.message}</p>
                    {!alert.read && <button onClick={() => dispatch(markAlertRead(alert.id))}>Mark Read</button>}
                </div>
            ))}
        </div>
    );
};
export default Alerts;
