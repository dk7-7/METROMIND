import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createUtilityOutage } from '../services/utilityOutageService';
import { getUtilityGrids } from '../services/utilityGridService';
import { ArrowLeft, Send } from 'lucide-react';
import { validateRequired } from '../utils/validators';

export const AddUtilityOutage = () => {
  const navigate = useNavigate();
  const [grids, setGrids] = useState([]);
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('POWER');
  const [affectedCustomers, setAffectedCustomers] = useState('');
  const [gridId, setGridId] = useState('');
  const [startTime, setStartTime] = useState('');
  const [estimatedRestoration, setEstimatedRestoration] = useState('');
  const [status, setStatus] = useState('SCHEDULED');

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchGrids = async () => {
      try {
        const data = await getUtilityGrids();
        setGrids(data);
        if (data.length > 0) setGridId(data[0].id);
      } catch (err) {
        console.error(err);
      }
    };
    fetchGrids();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!validateRequired(title)) newErrors.title = 'Title is required';
    if (!validateRequired(description)) newErrors.description = 'Description is required';
    if (!validateRequired(affectedCustomers) || isNaN(Number(affectedCustomers))) newErrors.affectedCustomers = 'Please enter a valid count of connections affected';
    if (!validateRequired(startTime)) newErrors.startTime = 'Start time is required';
    if (!validateRequired(estimatedRestoration)) newErrors.estimatedRestoration = 'Restoration estimate is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      await createUtilityOutage({
        title,
        description,
        type,
        affectedCustomers: Number(affectedCustomers),
        gridId,
        startTime: new Date(startTime).toISOString(),
        estimatedRestoration: new Date(estimatedRestoration).toISOString(),
        status
      });
      navigate('/outages');
    } catch (err) {
      alert('Failed to log outage event: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-in" style={{ maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <Link to="/outages" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>
          <ArrowLeft size={16} /> Back to Outages
        </Link>
      </div>

      <div>
        <h1 style={{ fontSize: '26px', fontWeight: '800', letterSpacing: '-0.5px', marginBottom: '6px' }}>
          Schedule Grid Outage
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
          Publish outage times and dispatch notifications to affected sectors
        </p>
      </div>

      <div className="glass-panel" style={{ padding: '32px' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div className="form-group">
            <label className="form-label" htmlFor="outage-title">Outage Event / Title</label>
            <input
              id="outage-title"
              type="text"
              className="form-control"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Substation Circuit Upgrades or Sector B Flush"
            />
            {errors.title && <span style={{ color: 'var(--color-danger)', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.title}</span>}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="utility-type">Outage Sector Type</label>
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

            <div className="form-group">
              <label className="form-label" htmlFor="outage-status">Outage Severity / Status</label>
              <select
                id="outage-status"
                className="form-control"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="SCHEDULED">Scheduled / Maintenance</option>
                <option value="ACTIVE">Active / Emergency</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="impacted-connections">Impacted Connections</label>
              <input
                id="impacted-connections"
                type="text"
                className="form-control"
                value={affectedCustomers}
                onChange={(e) => setAffectedCustomers(e.target.value)}
                placeholder="e.g. 1500"
              />
              {errors.affectedCustomers && <span style={{ color: 'var(--color-danger)', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.affectedCustomers}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="grid-sector">Target Grid Sector</label>
              <select
                id="grid-sector"
                className="form-control"
                value={gridId}
                onChange={(e) => setGridId(e.target.value)}
              >
                {grids.map(g => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="outage-start">Shutdown Time</label>
              <input
                id="outage-start"
                type="datetime-local"
                className="form-control"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
              {errors.startTime && <span style={{ color: 'var(--color-danger)', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.startTime}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="outage-restoration">Restoration Estimate</label>
              <input
                id="outage-restoration"
                type="datetime-local"
                className="form-control"
                value={estimatedRestoration}
                onChange={(e) => setEstimatedRestoration(e.target.value)}
              />
              {errors.estimatedRestoration && <span style={{ color: 'var(--color-danger)', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.estimatedRestoration}</span>}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="outage-description">Event Description &amp; Details</label>
            <textarea
              id="outage-description"
              className="form-control"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide shutdown reasons, work procedures, or sector alerts..."
              style={{ resize: 'vertical' }}
            />
            {errors.description && <span style={{ color: 'var(--color-danger)', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.description}</span>}
          </div>

          <button type="submit" className="btn btn-primary" style={{ padding: '12px', marginTop: '10px' }} disabled={loading}>
            <Send size={16} />
            {loading ? 'Submitting plan...' : 'Authorize Outage Directive'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddUtilityOutage;
