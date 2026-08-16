import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../../store/auth/authActions';
import Alert from '../common/Alert';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        fullName: '',
        role: 'CITY_ADMINISTRATOR',
        district: '',
        badgeNumber: ''
    });
    
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error } = useSelector((state) => state.auth);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const resultAction = await dispatch(registerUser(formData));
        if (registerUser.fulfilled.match(resultAction)) {
            navigate('/login');
        }
    };

    return (
        <div style={{ maxWidth: '500px', margin: '4rem auto', padding: '2rem', border: '1px solid #e2e8f0', borderRadius: '0.5rem' }}>
            <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Register Official</h2>
            {error && <Alert message={error} type="error" />}
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Username</label>
                    <input type="text" placeholder="Choose a username" required value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }} />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Password</label>
                    <input type="password" placeholder="Choose a password" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }} />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Full Name</label>
                    <input type="text" placeholder="Enter full name" required value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }} />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Role</label>
                    <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}>
                        <option value="CITY_ADMINISTRATOR">CITY_ADMINISTRATOR</option>
                        <option value="TRAFFIC_CONTROLLER">TRAFFIC_CONTROLLER</option>
                        <option value="UTILITY_SUPERVISOR">UTILITY_SUPERVISOR</option>
                        <option value="FIELD_TECHNICIAN">FIELD_TECHNICIAN</option>
                    </select>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>District</label>
                    <input type="text" value={formData.district} onChange={e => setFormData({...formData, district: e.target.value})} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }} />
                </div>
                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Badge Number</label>
                    <input type="text" value={formData.badgeNumber} onChange={e => setFormData({...formData, badgeNumber: e.target.value})} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }} />
                </div>
                <button type="submit" disabled={loading} style={{ width: '100%', padding: '0.75rem', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '4px', cursor: loading ? 'not-allowed' : 'pointer' }}>
                    {loading ? 'Registering' : 'Register'}
                </button>
            </form>
        </div>
    );
};

export default Register;
