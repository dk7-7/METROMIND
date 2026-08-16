import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../../store/auth/authActions';

const Navbar = () => {
    const { user, role } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logoutUser());
        navigate('/login');
    };

    return (
        <nav style={{ backgroundColor: '#1e293b', color: 'white', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.25rem' }}>MetroMind</Link>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                {!user ? (
                    <>
                        <Link to="/login" style={{ color: 'white', textDecoration: 'none' }}>Login</Link>
                        <Link to="/register" style={{ color: 'white', textDecoration: 'none' }}>Register</Link>
                    </>
                ) : (
                    <>
                        {(role === 'CITY_ADMINISTRATOR' || role === 'ADMIN') && (
                            <>
                                <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Dashboard</Link>
                                <Link to="/incidents" style={{ color: 'white', textDecoration: 'none' }}>Incidents</Link>
                                <Link to="/grids" style={{ color: 'white', textDecoration: 'none' }}>Utility Grids</Link>
                                <Link to="/registry" style={{ color: 'white', textDecoration: 'none' }}>Official Registry</Link>
                            </>
                        )}
                        {role === 'TRAFFIC_CONTROLLER' && (
                            <>
                                <Link to="/incidents" style={{ color: 'white', textDecoration: 'none' }}>Incidents</Link>
                                <Link to="/zones" style={{ color: 'white', textDecoration: 'none' }}>Traffic Zones</Link>
                            </>
                        )}
                        {role === 'UTILITY_SUPERVISOR' && (
                            <>
                                <Link to="/grids" style={{ color: 'white', textDecoration: 'none' }}>Utility Grids</Link>
                                <Link to="/outages" style={{ color: 'white', textDecoration: 'none' }}>Outages</Link>
                            </>
                        )}
                        <span style={{ marginLeft: '1rem', color: '#94a3b8' }}>{user.username}</span>
                        <button onClick={handleLogout} style={{ padding: '0.5rem 1rem', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                            Logout
                        </button>
                    </>
                )}
            </div>
        </nav>
    );
};
export default Navbar;
