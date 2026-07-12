import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getIncidents, deleteIncident } from '../services/incidentService';
import Loader from '../components/common/Loader';
import { AlertTriangle, Plus, Search, Edit2, Trash2, Calendar } from 'lucide-react';
import { formatDate, getSeverityBadgeClass, getStatusBadgeClass } from '../utils/helpers';

export const IncidentList = () => {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [severityFilter, setSeverityFilter] = useState('');

  const fetchIncidents = async () => {
    setLoading(true);
    try {
      const data = await getIncidents();
      setIncidents(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to resolve and clear this incident node?')) {
      try {
        await deleteIncident(id);
        setIncidents(incidents.filter(inc => inc.id !== id));
      } catch (err) {
        alert('Failed to delete incident: ' + err.message);
      }
    }
  };

  // Filter logic
  const filteredIncidents = incidents.filter(inc => {
    const matchesSearch = inc.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          inc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          inc.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter ? inc.status === statusFilter : true;
    const matchesSeverity = severityFilter ? inc.severity === severityFilter : true;
    return matchesSearch && matchesStatus && matchesSeverity;
  });

  if (loading) return <Loader />;

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: '800', letterSpacing: '-0.5px', marginBottom: '6px' }}>
            Grid Incidents
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            Monitor, update, and resolve utility failures
          </p>
        </div>
        <Link to="/incidents/add" className="btn btn-primary" style={{ textDecoration: 'none' }}>
          <Plus size={18} />
          Report Incident
        </Link>
      </div>

      {/* Filters Area */}
      <div 
        className="glass-panel" 
        style={{ 
          padding: '16px 20px', 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: '16px', 
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <div style={{ display: 'flex', flex: 1, minWidth: '280px', position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search by title, description or code..."
            className="form-control"
            style={{ paddingLeft: '40px' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <select 
            className="form-control" 
            style={{ width: '160px' }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="OPEN">Open</option>
            <option value="INVESTIGATING">Investigating</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
          </select>

          <select 
            className="form-control" 
            style={{ width: '160px' }}
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
          >
            <option value="">All Severities</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="CRITICAL">Critical</option>
          </select>
        </div>
      </div>

      {/* Incidents Table/List */}
      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        {filteredIncidents.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            <AlertTriangle size={32} style={{ color: 'var(--text-muted)', marginBottom: '12px' }} />
            <p>No incidents match the current diagnostic filter.</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.01)' }}>
                <th style={{ padding: '16px 20px', color: 'var(--text-muted)', fontSize: '12px', fontWeight: 'bold' }}>INCIDENT</th>
                <th style={{ padding: '16px 20px', color: 'var(--text-muted)', fontSize: '12px', fontWeight: 'bold' }}>SECTOR TYPE</th>
                <th style={{ padding: '16px 20px', color: 'var(--text-muted)', fontSize: '12px', fontWeight: 'bold' }}>SEVERITY</th>
                <th style={{ padding: '16px 20px', color: 'var(--text-muted)', fontSize: '12px', fontWeight: 'bold' }}>STATUS</th>
                <th style={{ padding: '16px 20px', color: 'var(--text-muted)', fontSize: '12px', fontWeight: 'bold' }}>REPORTED AT</th>
                <th style={{ padding: '16px 20px', color: 'var(--text-muted)', fontSize: '12px', fontWeight: 'bold', textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredIncidents.map(inc => (
                <tr 
                  key={inc.id} 
                  style={{ borderBottom: '1px solid var(--glass-border)', transition: 'background var(--transition-fast)' }}
                  className="table-row-hover"
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.01)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <td style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span style={{ fontSize: '14px', fontWeight: '600' }}>{inc.title}</span>
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{inc.description.slice(0, 70)}...</span>
                    </div>
                  </td>
                  <td style={{ padding: '20px' }}>
                    <span style={{ fontSize: '13px', fontWeight: '500' }}>{inc.type}</span>
                  </td>
                  <td style={{ padding: '20px' }}>
                    <span className={`badge ${getSeverityBadgeClass(inc.severity)}`}>{inc.severity}</span>
                  </td>
                  <td style={{ padding: '20px' }}>
                    <span className={`badge ${getStatusBadgeClass(inc.status)}`}>{inc.status.replace('_', ' ')}</span>
                  </td>
                  <td style={{ padding: '20px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Calendar size={14} />
                      {formatDate(inc.createdAt)}
                    </div>
                  </td>
                  <td style={{ padding: '20px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                      <Link 
                        to={`/incidents/edit/${inc.id}`} 
                        className="btn btn-secondary" 
                        style={{ padding: '6px 10px' }}
                        title="Update node details"
                      >
                        <Edit2 size={14} />
                      </Link>
                      <button 
                        onClick={() => handleDelete(inc.id)} 
                        className="btn btn-danger" 
                        style={{ padding: '6px 10px', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--color-danger)', border: '1px solid rgba(239, 68, 68, 0.2)' }}
                        title="Delete node details"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default IncidentList;
