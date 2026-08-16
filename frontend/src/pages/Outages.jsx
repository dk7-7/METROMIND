import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllGrids } from '../store/utilityGrid/utilityGridActions';
import outageService from '../services/outageService';
import Alert from '../components/common/Alert';

const Outages = () => {
    const dispatch = useDispatch();
    const { grids } = useSelector(state => state.utilityGrid);
    
    const [formData, setFormData] = useState({
        gridId: '',
        outageType: '',
        affectedArea: '',
        severity: '',
        estimatedRestorationTime: ''
    });
    
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        dispatch(fetchAllGrids());
    }, [dispatch]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        
        try {
            await outageService.register(formData.gridId, {
                outageType: formData.outageType,
                affectedArea: formData.affectedArea,
                severity: formData.severity,
                estimatedRestorationTime: formData.estimatedRestorationTime
            });
            setSuccess('Outage registered successfully.');
            setFormData({ gridId: '', outageType: '', affectedArea: '', severity: '', estimatedRestorationTime: '' });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to register outage.');
        }
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
            <h2>Register Outage</h2>
            
            {error && <Alert message={error} type="error" />}
            {success && <Alert message={success} type="success" />}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Utility Grid</label>
                    <select required value={formData.gridId} onChange={e => setFormData({...formData, gridId: e.target.value})} style={{ width: '100%', padding: '0.5rem' }}>
                        <option value="">Select a grid</option>
                        {grids.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                    </select>
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Outage Type</label>
                    <input type="text" required value={formData.outageType} onChange={e => setFormData({...formData, outageType: e.target.value})} style={{ width: '100%', padding: '0.5rem' }} />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Affected Area</label>
                    <input type="text" required value={formData.affectedArea} onChange={e => setFormData({...formData, affectedArea: e.target.value})} style={{ width: '100%', padding: '0.5rem' }} />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Severity</label>
                    <input type="text" required value={formData.severity} onChange={e => setFormData({...formData, severity: e.target.value})} style={{ width: '100%', padding: '0.5rem' }} />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Estimated Restoration Time</label>
                    <input type="datetime-local" required value={formData.estimatedRestorationTime} onChange={e => setFormData({...formData, estimatedRestorationTime: e.target.value})} style={{ width: '100%', padding: '0.5rem' }} />
                </div>
                <button type="submit" style={{ padding: '0.75rem', backgroundColor: '#2563eb', color: 'white', border: 'none', cursor: 'pointer' }}>Register Outage</button>
            </form>
        </div>
    );
};

export default Outages;
