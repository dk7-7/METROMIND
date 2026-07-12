import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUtilityOutages, deleteUtilityOutage } from '../services/utilityOutageService';
import Loader from '../Components/common/Loader';
import { Plus, Search, Calendar, Users, AlertOctagon, Trash2 } from 'lucide-react';
import { formatDate, getStatusBadgeClass } from '../utils/helpers';

export const UtilityOutageList = () => {
  const [outages, setOutages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchOutages = async () => {
    setLoading(true);
    try {
      const data = await getUtilityOutages();
      setOutages(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOutages();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to resolve/remove this outage schedule?')) {
      try {
        await deleteUtilityOutage(id);
        setOutages(outages.filter(o => o.id !== id));
      } catch (err) {
        alert('Failed to delete outage: ' + err.message);
      }
    }
  };

  const filteredOutages = outages.filter(o =>
    o.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <Loader />;

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifycontent: 'space-between', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: '800', letterSpacing: '-0.5px', marginBottom: '6px' }}>
            Grid Outages
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            Schedule maintenance shutdowns or track active grid blackouts
          </p>
        </div>
        <Link to="/outages/add" className="btn btn-primary" style={{ textDecoration: 'none' }}>
          <Plus size={18} />
          Schedule Outage
        </Link>
      </div>

      {/* Filter */}
      <div className="glass-panel" style={{ padding: '16px 20px', display: 'flex' }}>
        <div style={{ display: 'flex', flex: 1, position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search outages by schedule title..."
            className="form-control"
            style={{ paddingLeft: '40px' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Outage Items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filteredOutages.length === 0 ? (
          <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            <AlertOctagon size={32} style={{ color: 'var(--text-muted)', marginBottom: '12px' }} />
            <p>No active or scheduled outages found.</p>
          </div>
        ) : (
          filteredOutages.map(out => (
            <div 
              key={out.id} 
              className="glass-panel animate-row" 
              style={{ 
                padding: '24px', 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '20px',
                borderLeft: `4px solid ${out.status === 'ACTIVE' ? 'var(--color-danger)' : 'var(--color-warning)'}`
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, minWidth: '300px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span className={`badge ${getStatusBadgeClass(out.status)}`}>{out.status}</span>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>ID: {out.id}</span>
                  <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--accent-primary)' }}>{out.type}</span>
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: '700' }}>{out.title}</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{out.description}</p>
                
                {/* Stats */}
                <div style={{ display: 'flex', gap: '20px', marginTop: '4px', fontSize: '12px', color: 'var(--text-muted)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Users size={14} />
                    <span>Impacted: <strong style={{ color: 'var(--text-primary)' }}>{out.affectedCustomers}</strong> connections</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={14} />
                    <span>Start: {formatDate(out.startTime)}</span>
                  </div>
                </div>
              </div>

              {/* Restoration ETA */}
              <div 
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'flex-end', 
                  gap: '8px',
                  minWidth: '200px'
                }}
              >
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 'bold' }}>Estimated Restoration</p>
                  <p style={{ fontSize: '14px', fontWeight: '700', color: 'var(--accent-secondary)' }}>
                    {formatDate(out.estimatedRestoration)}
                  </p>
                </div>
                <button 
                  onClick={() => handleDelete(out.id)} 
                  className="btn btn-danger" 
                  style={{ 
                    padding: '8px 12px', 
                    fontSize: '12px', 
                    background: 'rgba(239, 68, 68, 0.05)', 
                    color: 'var(--color-danger)', 
                    border: '1px solid rgba(239, 68, 68, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Trash2 size={13} />
                  Clear Outage
                </button>
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UtilityOutageList;
