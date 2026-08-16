import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../store/auth/authActions';
import { clearError } from '../../store/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import ErrorHandler from '../common/ErrorHandler';

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, loading, error } = useSelector(state => state.auth);
    
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, [user, navigate]);

    useEffect(() => {
        return () => {
            if (error) dispatch(clearError());
        };
    }, [error, dispatch]);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(loginUser({ username, password }));
    };

    return (
        <div style={{ maxWidth: '400px', margin: '4rem auto', padding: '2rem', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
            <h2>Login</h2>
            <ErrorHandler error={error} />
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                    <label htmlFor="username" style={{ display: 'block', marginBottom: '0.5rem' }}>Username</label>
                    <input 
                        id="username"
                        type="text" 
                        placeholder="username"
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                        style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                    />
                </div>
                <div>
                    <label htmlFor="password" style={{ display: 'block', marginBottom: '0.5rem' }}>Password</label>
                    <input 
                        id="password"
                        type="password"
                        placeholder="Password"
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                    />
                </div>
                <button 
                    type="submit" 
                    disabled={loading}
                    style={{ padding: '0.75rem', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: loading ? 'not-allowed' : 'pointer' }}
                >
                    {loading ? 'Authenticating...' : 'Login'}
                </button>
            </form>
        </div>
    );
};
export default Login;
