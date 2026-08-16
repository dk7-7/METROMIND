const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'frontend', 'src');

const ensureDir = (dirPath) => {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
};

const write = (filePath, content) => {
    ensureDir(path.dirname(filePath));
    fs.writeFileSync(filePath, content.trim() + '\n', 'utf8');
};

const loginJsx = `
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
`;

const registerJsx = `
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
`;

const navbarJsx = `
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
`;

const trafficIncidentListJsx = `
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllIncidents, deleteIncident } from '../../store/trafficIncident/trafficIncidentActions';
import { clearIncidentError } from '../../store/trafficIncident/trafficIncidentSlice';
import EmptyState from '../common/EmptyState';
import Pagination from '../common/Pagination';
import SearchFilterBar from '../common/SearchFilterBar';
import Alert from '../common/Alert';
import TrafficIncidentForm from './TrafficIncidentForm';

const TrafficIncidentList = () => {
    const dispatch = useDispatch();
    const { incidents, loading, error } = useSelector(state => state.trafficIncident);
    const { role } = useSelector(state => state.auth);
    
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    
    const [alert, setAlert] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [editRecord, setEditRecord] = useState(null);

    useEffect(() => {
        dispatch(fetchAllIncidents());
    }, [dispatch]);

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this incident?')) {
            dispatch(deleteIncident(id)).unwrap()
                .then(() => setAlert({ message: 'Traffic Incident deleted successfully.', type: 'success' }))
                .catch((err) => setAlert({ message: err, type: 'error' }));
        }
    };

    const handleFormSuccess = (msg) => {
        setShowForm(false);
        setEditRecord(null);
        setAlert({ message: msg, type: 'success' });
        dispatch(fetchAllIncidents());
    };

    const filtered = incidents.filter(i => 
        i.title?.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (filterStatus === '' || i.severity === filterStatus)
    );
    
    const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const canManage = role === 'ADMIN' || role === 'CITY_ADMINISTRATOR' || role === 'TRAFFIC_CONTROLLER';
    const canDelete = role === 'ADMIN' || role === 'CITY_ADMINISTRATOR';

    return (
        <div>
            <h2>Traffic Incidents</h2>
            {alert && <Alert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}
            {error && <Alert message={error} type="error" onClose={() => dispatch(clearIncidentError())} />}
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <SearchFilterBar 
                    onSearch={setSearchTerm} 
                    onFilterChange={setFilterStatus} 
                    filterOptions={[
                        {value: 'LOW', label: 'Low'}, {value: 'MEDIUM', label: 'Medium'},
                        {value: 'HIGH', label: 'High'}, {value: 'CRITICAL', label: 'Critical'}
                    ]}
                />
                {canManage && (
                    <button onClick={() => { setEditRecord(null); setShowForm(true); }} style={{ padding: '0.5rem 1rem', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                        + Add Record
                    </button>
                )}
            </div>

            {loading ? <p>Loading...</p> : 
                paginated.length === 0 ? <EmptyState message="No incidents found." /> : (
                <>
                    <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '2px solid #cbd5e1' }}>
                                <th style={{ padding: '0.75rem', textAlign: 'left' }}>Title</th>
                                <th style={{ padding: '0.75rem', textAlign: 'left' }}>Severity</th>
                                <th style={{ padding: '0.75rem', textAlign: 'left' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginated.map(inc => (
                                <tr key={inc.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                    <td style={{ padding: '0.75rem' }}>{inc.title}</td>
                                    <td style={{ padding: '0.75rem' }}>{inc.severity}</td>
                                    <td style={{ padding: '0.75rem', display: 'flex', gap: '0.5rem' }}>
                                        {canManage && <button onClick={() => { setEditRecord(inc); setShowForm(true); }}>Edit</button>}
                                        {canDelete && <button onClick={() => handleDelete(inc.id)} style={{ color: 'red' }}>Delete</button>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <Pagination totalItems={filtered.length} itemsPerPage={itemsPerPage} currentPage={currentPage} onPageChange={setCurrentPage} />
                </>
            )}

            {showForm && (
                <TrafficIncidentForm 
                    incident={editRecord} 
                    onClose={() => setShowForm(false)} 
                    onSuccess={handleFormSuccess} 
                />
            )}
        </div>
    );
};
export default TrafficIncidentList;
`;

const trafficIncidentFormJsx = `
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllZones } from '../../store/trafficZone/trafficZoneActions';
import { createIncident, updateIncident } from '../../store/trafficIncident/trafficIncidentActions';
import ErrorHandler from '../common/ErrorHandler';

const TrafficIncidentForm = ({ incident, onClose, onSuccess }) => {
    const dispatch = useDispatch();
    const { zones } = useSelector(state => state.trafficZone);
    const [title, setTitle] = useState(incident?.title || '');
    const [severity, setSeverity] = useState(incident?.severity || 'LOW');
    const [zoneId, setZoneId] = useState(incident?.zoneId || '');
    const [error, setError] = useState(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        dispatch(fetchAllZones());
    }, [dispatch]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title) return;
        setSaving(true);
        setError(null);
        
        try {
            if (incident) {
                await dispatch(updateIncident({ id: incident.id, data: { title, severity, zoneId } })).unwrap();
                onSuccess('Traffic Incident updated successfully.');
            } else {
                await dispatch(createIncident({ title, severity, zoneId })).unwrap();
                onSuccess('Traffic Incident created successfully.');
            }
        } catch (err) {
            if (err.match && err.match(/already exists/i)) {
                setError(err);
            } else if (err.match && err.match(/unable to save/i)) {
                setError(err);
            } else {
                setError(err);
            }
        } finally {
            setSaving(false);
        }
    };

    return (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 }}>
            <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', width: '400px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <h3>{incident ? 'Edit Traffic Incident' : 'Report New Incident'}</h3>
                    <button onClick={onClose} style={{ border: 'none', background: 'none', fontSize: '1.25rem', cursor: 'pointer' }}>X</button>
                </div>
                <ErrorHandler error={error} />
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <input type="text" placeholder="e.g. Major Collision on Main St" value={title} onChange={(e) => setTitle(e.target.value)} required />
                    <select value={severity} onChange={(e) => setSeverity(e.target.value)}>
                        <option value="LOW">LOW</option>
                        <option value="MEDIUM">MEDIUM</option>
                        <option value="HIGH">HIGH</option>
                        <option value="CRITICAL">CRITICAL</option>
                    </select>
                    <select value={zoneId} onChange={(e) => setZoneId(e.target.value)}>
                        <option value="">Select Zone</option>
                        {zones.map(z => <option key={z.id} value={z.id}>{z.name}</option>)}
                    </select>
                    <button type="submit" disabled={!title || saving} style={{ padding: '0.75rem', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px' }}>
                        {incident ? 'Update Incident' : 'Report Incident'}
                    </button>
                </form>
            </div>
        </div>
    );
};
export default TrafficIncidentForm;
`;

const utilityGridListJsx = `
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllGrids } from '../../store/utilityGrid/utilityGridActions';
import EmptyState from '../common/EmptyState';
import Pagination from '../common/Pagination';
import CapacityBar from '../common/CapacityBar';

const UtilityGridList = () => {
    const dispatch = useDispatch();
    const { grids, loading } = useSelector(state => state.utilityGrid);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        dispatch(fetchAllGrids());
    }, [dispatch]);

    const paginated = grids.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div>
            <h2>Utility Grids</h2>
            {loading ? <p>Loading...</p> : 
                paginated.length === 0 ? <EmptyState message="No utility grids monitored." /> : (
                <>
                    <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '2px solid #cbd5e1' }}>
                                <th style={{ padding: '0.75rem', textAlign: 'left' }}>Grid name</th>
                                <th style={{ padding: '0.75rem', textAlign: 'left' }}>Type</th>
                                <th style={{ padding: '0.75rem', textAlign: 'left' }}>District</th>
                                <th style={{ padding: '0.75rem', textAlign: 'left' }}>Load / Capacity</th>
                                <th style={{ padding: '0.75rem', textAlign: 'left' }}>Status</th>
                                <th style={{ padding: '0.75rem', textAlign: 'left' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginated.map(grid => (
                                <tr key={grid.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                    <td style={{ padding: '0.75rem' }}>{grid.name}</td>
                                    <td style={{ padding: '0.75rem' }}>{grid.type}</td>
                                    <td style={{ padding: '0.75rem' }}>{grid.district}</td>
                                    <td style={{ padding: '0.75rem', width: '200px' }}>
                                        <div style={{ marginBottom: '4px', fontSize: '0.875rem' }}>{grid.currentLoad} / {grid.totalCapacity}</div>
                                        <CapacityBar current={grid.currentLoad} total={grid.totalCapacity} />
                                    </td>
                                    <td style={{ padding: '0.75rem' }}>{grid.status}</td>
                                    <td style={{ padding: '0.75rem' }}>
                                        <button>Edit</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <Pagination totalItems={grids.length} itemsPerPage={itemsPerPage} currentPage={currentPage} onPageChange={setCurrentPage} />
                </>
            )}
        </div>
    );
};
export default UtilityGridList;
`;

const statCardsJsx = `
import React from 'react';

const StatCards = ({ totalIncidents, activeOutages, criticalAlerts, congestedZones }) => {
    const Card = ({ title, value, color }) => (
        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', flex: 1 }}>
            <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.5rem' }}>{title}</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color }}>{value || 0}</div>
        </div>
    );

    return (
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
            <Card title="Total Incidents" value={totalIncidents} color="#3b82f6" />
            <Card title="Active Outages" value={activeOutages} color="#ef4444" />
            <Card title="Critical Alerts" value={criticalAlerts} color="#f59e0b" />
            <Card title="Congested Zones" value={congestedZones} color="#8b5cf6" />
        </div>
    );
};
export default StatCards;
`;

write(path.join(srcDir, 'components', 'auth', 'Login.jsx'), loginJsx);
write(path.join(srcDir, 'components', 'auth', 'Register.jsx'), registerJsx);
write(path.join(srcDir, 'components', 'layout', 'Navbar.jsx'), navbarJsx);
write(path.join(srcDir, 'components', 'trafficIncident', 'TrafficIncidentList.jsx'), trafficIncidentListJsx);
write(path.join(srcDir, 'components', 'trafficIncident', 'TrafficIncidentForm.jsx'), trafficIncidentFormJsx);
write(path.join(srcDir, 'components', 'utilityGrid', 'UtilityGridList.jsx'), utilityGridListJsx);
write(path.join(srcDir, 'components', 'dashboard', 'StatCards.jsx'), statCardsJsx);

console.log("Specific components generated successfully.");
