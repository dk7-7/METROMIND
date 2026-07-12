import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUtilityGrids, deleteUtilityGrid } from '../services/utilityGridService';
import Loader from '../Components/common/Loader';
import { Plus, Search, Trash2, Cpu, Wrench, MapPin } from 'lucide-react';
import { getStatusBadgeClass } from '../utils/helpers';

export const UtilityGridList = () => {
  const [grids, setGrids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchGrids = async () => {
    setLoading(true);
    try {
      const data = await getUtilityGrids();
      setGrids(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGrids();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this grid sector node?')) {
      try {
        await deleteUtilityGrid(id);
        setGrids(grids.filter(g => g.id !== id));
      } catch (err) {
        alert('Failed to delete grid node: ' + err.message);
      }
    }
  };

  const filteredGrids = grids.filter(g => 
    g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    g.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <Loader />;

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifycontent: 'space-between', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: '800', letterSpacing: '-0.5px', marginBottom: '6px' }}>
            Utility Sectors
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            Monitor capacities, loads, and hardware nodes status
          </p>
        </div>
        <Link to="/grids/add" className="btn btn-primary" style={{ textDecoration: 'none' }}>
          <Plus size={18} />
          Register Sector
        </Link>
      </div>

      {/* Filter */}
      <div className="glass-panel" style={{ padding: '16px 20px', display: 'flex' }}>
        <div style={{ display: 'flex', flex: 1, position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search by sector name or node location..."
            className="form-control"
            style={{ paddingLeft: '40px' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Grid cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {filteredGrids.map(grid => {
          const capacityVal = parseInt(grid.capacity) || 100;
          const loadVal = parseInt(grid.currentLoad) || 0;
          const percentage = Math.round((loadVal / capacityVal) * 100);

          return (
            <div key={grid.id} className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              <div style={{ display: 'flex', justifycontent: 'space-between', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div 
                    style={{
                      background: 'rgba(99, 102, 241, 0.1)',
                      padding: '10px',
                      borderRadius: '8px',
                      color: 'var(--accent-primary)',
                    }}
                  >
                    <Cpu size={20} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '15px', fontWeight: '700' }}>{grid.name}</h3>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>ID: {grid.id}</span>
                  </div>
                </div>
                <span className={`badge ${getStatusBadgeClass(grid.status)}`}>{grid.status}</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MapPin size={14} style={{ color: 'var(--text-muted)' }} />
                  <span>{grid.location}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Wrench size={14} style={{ color: 'var(--text-muted)' }} />
                  <span>Last Checked: {grid.lastMaintenance}</span>
                </div>
              </div>

              {/* Load Bar */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', justifycontent: 'space-between', justifyContent: 'space-between', fontSize: '12px' }}>
                  <span style={{ fontWeight: '500', color: 'var(--text-secondary)' }}>Operating Load Level</span>
                  <span style={{ fontWeight: '600' }}>{percentage}%</span>
                </div>
                <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div 
                    style={{ 
                      width: `${Math.min(percentage, 100)}%`, 
                      height: '100%', 
                      background: percentage > 85 ? 'var(--color-danger)' : percentage > 70 ? 'var(--color-warning)' : 'var(--color-success)',
                      borderRadius: '3px' 
                    }} 
                  />
                </div>
                <div style={{ display: 'flex', justifycontent: 'space-between', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)' }}>
                  <span>Current: {grid.currentLoad}</span>
                  <span>Max Limit: {grid.capacity}</span>
                </div>
              </div>

              {/* Action */}
              <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
                <button 
                  onClick={() => handleDelete(grid.id)} 
                  className="btn btn-danger" 
                  style={{ 
                    padding: '8px 12px', 
                    fontSize: '12px', 
                    background: 'rgba(239, 68, 68, 0.05)', 
                    color: 'var(--color-danger)', 
                    border: '1px solid rgba(239, 68, 68, 0.1)' 
                  }}
                >
                  <Trash2 size={13} />
                  Delete Node
                </button>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UtilityGridList;
