import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllZones } from '../../store/trafficZone/trafficZoneActions';
import { createIncident, updateIncident, fetchAllIncidents } from '../../store/trafficIncident/trafficIncidentActions';
import Alert from '../common/Alert';

const TrafficIncidentForm = ({ mode = 'create', initialData, onClose }) => {
    const [formData, setFormData] = useState({
        title: initialData?.title || '',
        severity: initialData?.severity || 'LOW',
        zoneId: initialData?.zoneId || ''
    });
    const [localError, setLocalError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const dispatch = useDispatch();
    const { zones = [] } = useSelector(state => state.trafficZone) || {};
    
    const titleRef = useRef(null);

    useEffect(() => {
        if (titleRef.current) {
            titleRef.current.focus();
        }
    }, []);

    useEffect(() => {
        dispatch(fetchAllZones());
    }, [dispatch]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLocalError(null);
        setSuccessMessage(null);
        
        let resultAction;
        if (mode === 'create') {
            resultAction = await dispatch(createIncident(formData));
        } else {
            resultAction = await dispatch(updateIncident({ id: initialData.id, data: formData }));
        }

        if (resultAction.error) {
            const errStr = resultAction.payload;
            if (errStr && errStr.match(/already exists/i)) {
                setLocalError('Traffic Incident already exists.');
            } else if (errStr && errStr.match(/unable to save/i)) {
                setLocalError(errStr);
            } else {
                setLocalError(errStr || 'An error occurred.');
            }
        } else {
            setSuccessMessage(mode === 'create' ? 'Traffic Incident created successfully.' : 'Traffic Incident updated successfully.');
            dispatch(fetchAllIncidents());
            setTimeout(() => {
                onClose();
            }, 1000);
        }
    };

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 50 }}>
            <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '0.5rem', width: '100%', maxWidth: '500px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ margin: 0 }}>{mode === 'create' ? 'Report New Incident' : 'Edit Traffic Incident'}</h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>X</button>
                </div>
                
                {localError && <Alert message={localError} type="error" />}
                {successMessage && <Alert message={successMessage} type="success" />}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Title</label>
                        <input ref={titleRef} type="text" placeholder="e.g. Major Collision on Main St" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }} autoFocus />
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                        <label htmlFor="severity-select" style={{ display: 'block', marginBottom: '0.5rem' }}>Severity</label>
                        <select id="severity-select" value={formData.severity} onChange={e => setFormData({...formData, severity: e.target.value})} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}>
                            <option value="LOW">LOW</option>
                            <option value="MEDIUM">MEDIUM</option>
                            <option value="HIGH">HIGH</option>
                            <option value="CRITICAL">CRITICAL</option>
                        </select>
                    </div>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Traffic Zone</label>
                        <select value={formData.zoneId} onChange={e => setFormData({...formData, zoneId: e.target.value})} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }} required>
                            <option value="">Select a zone</option>
                            {zones.map(z => (
                                <option key={z.id} value={z.id}>{z.name}</option>
                            ))}
                        </select>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                        <button type="button" onClick={onClose} style={{ padding: '0.5rem 1rem', background: '#e2e8f0', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
                        <button type="submit" disabled={!formData.title} style={{ padding: '0.5rem 1rem', background: '#2563eb', color: 'white', border: 'none', borderRadius: '4px', cursor: !formData.title ? 'not-allowed' : 'pointer' }}>
                            {mode === 'create' ? 'Report Incident' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TrafficIncidentForm;
