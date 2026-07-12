import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { getIncidentById, updateIncident } from '../services/incidentService';
import { getUtilityGrids } from '../services/utilityGridService';
import Loader from '../components/common/Loader';
import { ArrowLeft, Save } from 'lucide-react';
import { validateRequired } from '../utils/validators';

export const EditIncident = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [grids, setGrids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('POWER');
  const [severity, setSeverity] = useState('MEDIUM');
  const [status, setStatus] = useState('OPEN');
  const [gridId, setGridId] = useState('');

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [gridData, incData] = await Promise.all([
          getUtilityGrids(),
          getIncidentById(id)
        ]);
        setGrids(gridData);
        if (incData) {
          setTitle(incData.title);
          setDescription(incData.description);
          setType(incData.type);
          setSeverity(incData.severity);
          setStatus(incData.status);
          setGridId(incData.gridId);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!validateRequired(title)) newErrors.title = 'Title is required';
    if (!validateRequired(description)) newErrors.description = 'Description is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSaving(true);
    try {
      await updateIncident(id, {
        title,
        description,
        type,
        severity,
        status,
        gridId
      });
      navigate('/incidents');
    } catch (err) {
      alert('Failed to update incident: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="fade-in" style={{ maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <Link to="/incidents" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>
          <ArrowLeft size={16} /> Back to Incidents
        </Link>
      </div>

      <div>
        <h1 style={{ fontSize: '26px', fontWeight: '800', letterSpacing: '-0.5px', marginBottom: '6px' }}>
          Update Incident Node
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
          Modify details, status, or severity metrics of code {id}
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
            />
            {errors.title && <span style={{ color: 'var(--color-danger)', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.title}</span>}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="incident-status">Operational Status</label>
              <select
                id="incident-status"
                className="form-control"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="OPEN">Open Alert</option>
                <option value="INVESTIGATING">Investigating</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="RESOLVED">Resolved / Closed</option>
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="utility-type">Sector Type</label>
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
              <label className="form-label" htmlFor="affected-grid">Grid Sector</label>
              <select
                id="affected-grid"
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

          <div className="form-group">
            <label className="form-label" htmlFor="incident-description">Description &amp; Diagnostic Details</label>
            <textarea
              id="incident-description"
              className="form-control"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ resize: 'vertical' }}
            />
            {errors.description && <span style={{ color: 'var(--color-danger)', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.description}</span>}
          </div>

          <button type="submit" className="btn btn-primary" style={{ padding: '12px', marginTop: '10px' }} disabled={saving}>
            <Save size={16} />
            {saving ? 'Updating node...' : 'Save Configuration Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditIncident;
