import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../store/auth/authActions';
import { useNavigate } from 'react-router-dom';
import ErrorHandler from '../common/ErrorHandler';

const Register = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error } = useSelector(state => state.auth);

    const [formData, setFormData] = useState({
        username: '',
        password: '',
        fullName: '',
        role: 'CITY_ADMINISTRATOR',
        district: '',
        badgeNumber: ''
    });

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(registerUser(formData)).unwrap()
            .then(() => navigate('/login'))
            .catch(() => {}); // handled by slice/error
    };

    return (
        <div style={{ maxWidth: '500px', margin: '4rem auto', padding: '2rem', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
            <h2>Register</h2>
            <ErrorHandler error={error} />
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <input name="username" type="text" placeholder="Choose a username" required value={formData.username} onChange={handleChange} style={{ padding: '0.5rem' }}/>
                <input name="password" type="password" placeholder="Choose a password" required value={formData.password} onChange={handleChange} style={{ padding: '0.5rem' }}/>
                <input name="fullName" type="text" placeholder="Enter full name" required value={formData.fullName} onChange={handleChange} style={{ padding: '0.5rem' }}/>
                <select name="role" value={formData.role} onChange={handleChange} style={{ padding: '0.5rem' }}>
                    <option value="CITY_ADMINISTRATOR">CITY_ADMINISTRATOR</option>
                    <option value="TRAFFIC_CONTROLLER">TRAFFIC_CONTROLLER</option>
                    <option value="UTILITY_SUPERVISOR">UTILITY_SUPERVISOR</option>
                    <option value="FIELD_TECHNICIAN">FIELD_TECHNICIAN</option>
                </select>
                <input name="district" type="text" placeholder="District" value={formData.district} onChange={handleChange} style={{ padding: '0.5rem' }}/>
                <input name="badgeNumber" type="text" placeholder="Badge Number" value={formData.badgeNumber} onChange={handleChange} style={{ padding: '0.5rem' }}/>
                
                <button type="submit" disabled={loading} style={{ padding: '0.75rem', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px' }}>
                    {loading ? 'Registering...' : 'Register'}
                </button>
            </form>
        </div>
    );
};
export default Register;
