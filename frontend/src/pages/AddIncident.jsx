import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createIncident } from '../services/incidentService';
import { getUtilityGrids } from '../services/utilityGridService';
import { AlertTriangle, ArrowLeft, Send } from 'lucide-react';
import { validateRequired } from '../utils/validators';

export const AddIncident = () => {
  const navigate = useNavigate();
  const [grids, setGrids] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('POWER');
  const [severity, setSeverity] = useState('MEDIUM');
  const [gridId, setGridId] = useState('');
  
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
    if (!validateRequired(gridId)) newErrors.gridId = 'Please select an affected grid sector';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      await createIncident({
        title,
        description,
        type,
        severity,
        gridId,
        reporter: 'Operator Terminal',
      });
      navigate('/incidents');
    } catch (err) {
      alert('Failed to report incident: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-in" style={{ maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Back navigation link */}
      <div>
        <Link to="/incidents" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>
          <ArrowLeft size={16} /> Back to Incidents
        </Link>
      </div>

      <div>
        <h1 style={{ fontSize: '26px', fontWeight: '800', letterSpacing: '-0.5px', marginBottom: '6px' }}>
          Report Incident
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
          Dispatch a new alert report to Central Terminal
        </p>
      </div>

      <div className="glass-panel" style={{ padding: '32px' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div className="form-group">
            <label className="form-label" htmlFor="incident-title">Incident Title</label>
            <input
              id="incident-title"
              type="text"
              className="form-control"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Substation Sparking or Pipeline Fracture"
            />
            {errors.title && <span style={{ color: 'var(--color-danger)', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.title}</span>}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="utility-type">Utility Sector Type</label>
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
              <label className="form-label" htmlFor="incident-severity">Severity Level</label>
              <select
                id="incident-severity"
                className="form-control"
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="CRITICAL">Critical</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="affected-grid">Affected Grid Sector</label>
            <select
              id="affected-grid"
              className="form-control"
              value={gridId}
              onChange={(e) => setGridId(e.target.value)}
            >
              {grids.map(g => (
                <option key={g.id} value={g.id}>
                  {g.name} ({g.location})
                </option>
              ))}
            </select>
            {errors.gridId && <span style={{ color: 'var(--color-danger)', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.gridId}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="incident-description">Description &amp; Observations</label>
            <textarea
              id="incident-description"
              className="form-control"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe details, pressure readouts, visual cues, etc."
              style={{ resize: 'vertical' }}
            />
            {errors.description && <span style={{ color: 'var(--color-danger)', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.description}</span>}
          </div>

          <button type="submit" className="btn btn-primary" style={{ padding: '12px', marginTop: '10px' }} disabled={loading}>
            <Send size={16} />
            {loading ? 'Submitting report...' : 'Dispatch Alert Report'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddIncident;
