import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createUtilityGrid } from '../services/utilityGridService';
import { ArrowLeft, Send } from 'lucide-react';
import { validateRequired } from '../utils/validators';

export const AddUtilityGrid = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState('');
  const [type, setType] = useState('POWER');
  const [capacity, setCapacity] = useState('');
  const [currentLoad, setCurrentLoad] = useState('');
  const [location, setLocation] = useState('');

  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!validateRequired(name)) newErrors.name = 'Sector Name is required';
    if (!validateRequired(capacity)) newErrors.capacity = 'Total capacity is required';
    if (!validateRequired(currentLoad)) newErrors.currentLoad = 'Current load is required';
    if (!validateRequired(location)) newErrors.location = 'Location description is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      await createUtilityGrid({
        name,
        type,
        capacity,
        currentLoad,
        location,
        status: 'OPTIMAL',
        lastMaintenance: new Date().toISOString().split('T')[0]
      });
      navigate('/grids');
    } catch (err) {
      alert('Failed to register grid sector: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-in" style={{ maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <Link to="/grids" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>
          <ArrowLeft size={16} /> Back to Sectors
        </Link>
      </div>

      <div>
        <h1 style={{ fontSize: '26px', fontWeight: '800', letterSpacing: '-0.5px', marginBottom: '6px' }}>
          Register Grid Sector
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
          Monitor a new infrastructure hardware grid node
        </p>
      </div>

      <div className="glass-panel" style={{ padding: '32px' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div className="form-group">
            <label className="form-label" htmlFor="sector-name">Sector / Node Name</label>
            <input
              id="sector-name"
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Substation 8F (Central Area)"
            />
            {errors.name && <span style={{ color: 'var(--color-danger)', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.name}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="utility-type">Infrastructure Type</label>
            <select
              id="utility-type"
              className="form-control"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="POWER">Power (Electricity)</option>
              <option value="WATER">Water Supply</option>
              <option value="GAS">Gas / Heating</option>
              <option value="TELECOM">Telecommunications</option>
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="total-capacity">Total Capacity Limit</label>
              <input
                id="total-capacity"
                type="text"
                className="form-control"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                placeholder="e.g. 500 MW or 100k Gal/m"
              />
              {errors.capacity && <span style={{ color: 'var(--color-danger)', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.capacity}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="current-load">Current Load Demand</label>
              <input
                id="current-load"
                type="text"
                className="form-control"
                value={currentLoad}
                onChange={(e) => setCurrentLoad(e.target.value)}
                placeholder="e.g. 320 MW or 80k Gal/m"
              />
              {errors.currentLoad && <span style={{ color: 'var(--color-danger)', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.currentLoad}</span>}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="node-location">Geographic Node Location</label>
            <input
              id="node-location"
              type="text"
              className="form-control"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. North Ridge Road, Sector 4"
            />
            {errors.location && <span style={{ color: 'var(--color-danger)', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.location}</span>}
          </div>

          <button type="submit" className="btn btn-primary" style={{ padding: '12px', marginTop: '10px' }} disabled={loading}>
            <Send size={16} />
            {loading ? 'Registering node...' : 'Authorize Sector Integration'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddUtilityGrid;
