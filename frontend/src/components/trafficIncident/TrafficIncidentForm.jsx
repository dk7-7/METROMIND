import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  create,
  update,
  fetchById,
  fetchAll as fetchIncidents,
} from '../../store/slices/trafficIncidentSlice';
import { fetchAll as fetchTrafficZones } from '../../store/slices/trafficZoneSlice';
import { addNotification } from '../../store/slices/alertNotificationSlice';
import Alert from '../common/Alert';
import ErrorHandler from '../common/ErrorHandler';

const TrafficIncidentForm = ({
  incident = null,
  incidentId = null,
  id = null,
  onClose,
  onSuccess,
}) => {
  const targetId = incident?.incidentId || incident?.id || incidentId || id;
  const isEditMode = !!targetId;
  const dispatch = useDispatch();

  const titleInputRef = useRef(null);

  const [title, setTitle] = useState(incident?.title || '');
  const [severity, setSeverity] = useState(incident?.severity || 'MEDIUM');
  const [zoneId, setZoneId] = useState(
    incident?.zone?.zoneId || incident?.zoneId || incident?.zone?.id || ''
  );
  const [description, setDescription] = useState(incident?.description || '');
  const [formError, setFormError] = useState(null);
  const [formWarning, setFormWarning] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const trafficZones = useSelector(
    (state) => state.trafficZone?.items || []
  );

  // T12: Focus first input element on modal mount using useRef
  useEffect(() => {
    if (titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, []);

  // Fetch zones on mount
  useEffect(() => {
    dispatch(fetchTrafficZones());
  }, [dispatch]);

  // T18: Pre-fill form with backend response when incident prop or id is provided
  useEffect(() => {
    if (incident) {
      setTitle(incident.title || '');
      setSeverity(incident.severity || 'MEDIUM');
      setZoneId(
        incident.zone?.zoneId ||
          incident.zoneId ||
          incident.zone?.id ||
          incident.zone ||
          ''
      );
      setDescription(incident.description || '');
    } else if (targetId) {
      // Fetch from backend if only ID was passed
      dispatch(fetchById(targetId)).then((action) => {
        if (action.payload) {
          const fetched = action.payload;
          setTitle(fetched.title || '');
          setSeverity(fetched.severity || 'MEDIUM');
          setZoneId(
            fetched.zone?.zoneId ||
              fetched.zoneId ||
              fetched.zone?.id ||
              fetched.zone ||
              ''
          );
          setDescription(fetched.description || '');
        }
      });
    }
  }, [incident, targetId, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    setFormWarning(null);

    if (!title.trim()) {
      setFormWarning('Title is required');
      return;
    }

    if (!zoneId) {
      setFormWarning('Traffic Zone not selected');
      dispatch(addNotification({ message: 'Traffic Zone not selected', type: 'warning' }));
      return;
    }

    setSubmitting(true);

    const payload = {
      title: title.trim(),
      severity,
      zoneId: Number(zoneId),
      description,
    };

    try {
      if (isEditMode) {
        const resultAction = await dispatch(
          update({ id: targetId, data: payload })
        );
        if (update.fulfilled.match(resultAction)) {
          const successMsg =
            resultAction.payload?.message ||
            'TrafficIncident updated successfully.';
          dispatch(
            addNotification({
              message: successMsg,
              type: 'success',
            })
          );
          await dispatch(fetchIncidents());
          if (onSuccess) onSuccess(successMsg);
          if (onClose) onClose();
        } else {
          const err = resultAction.payload || '';
          if (
            typeof err === 'string' &&
            (err.includes('409') || /already exists/i.test(err))
          ) {
            setFormError('Traffic incident already exists');
          } else if (
            typeof err === 'string' &&
            (err.includes('500') || /unable to save/i.test(err))
          ) {
            setFormError('Unable to save traffic incident');
          } else {
            setFormError(err || 'Unable to save traffic incident');
          }
        }
      } else {
        const resultAction = await dispatch(create(payload));
        if (create.fulfilled.match(resultAction)) {
          const successMsg =
            resultAction.payload?.message ||
            'TrafficIncident created successfully.';
          dispatch(
            addNotification({
              message: successMsg,
              type: 'success',
            })
          );
          await dispatch(fetchIncidents());
          if (onSuccess) onSuccess(successMsg);
          if (onClose) onClose();
        } else {
          const err = resultAction.payload || '';
          if (
            typeof err === 'string' &&
            (err.includes('409') || /already exists/i.test(err))
          ) {
            setFormError('Traffic incident already exists');
          } else if (
            typeof err === 'string' &&
            (err.includes('500') || /unable to save/i.test(err))
          ) {
            setFormError('Unable to save traffic incident');
          } else {
            setFormError(err || 'Unable to save traffic incident');
          }
        }
      }
    } catch (err) {
      setFormError('Unable to save traffic incident');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="modal-overlay"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
    >
      <div
        className="modal-content"
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          width: '90%',
          maxWidth: '500px',
          padding: '1.75rem',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
          position: 'relative',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.25rem',
            borderBottom: '1px solid #e2e8f0',
            paddingBottom: '0.75rem',
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: '1.25rem',
              fontWeight: 600,
              color: '#1e293b',
            }}
          >
            {isEditMode ? 'Edit Traffic Incident' : 'Report New Incident'}
          </h2>
          <button
            type="button"
            className="btn-close"
            onClick={onClose}
            aria-label="Close"
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.25rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              color: '#64748b',
            }}
          >
            X
          </button>
        </div>

        {formError && <ErrorHandler error={formError} />}

        {formWarning && (
          <Alert
            message={formWarning}
            type="warning"
            duration={5000}
            onClose={() => setFormWarning(null)}
          />
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label
              htmlFor="title"
              style={{
                display: 'block',
                marginBottom: '0.4rem',
                fontWeight: 600,
                fontSize: '0.875rem',
                color: '#334155',
              }}
            >
              Title
            </label>
            <input
              ref={titleInputRef}
              id="title"
              name="title"
              type="text"
              placeholder="e.g. Major Collision on Main St"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (formError) setFormError(null);
                if (formWarning) setFormWarning(null);
              }}
              required
              style={{
                width: '100%',
                padding: '0.5rem 0.75rem',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                fontSize: '0.9rem',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label
              htmlFor="severity"
              style={{
                display: 'block',
                marginBottom: '0.4rem',
                fontWeight: 600,
                fontSize: '0.875rem',
                color: '#334155',
              }}
            >
              Severity
            </label>
            <select
              id="severity"
              name="severity"
              value={severity}
              onChange={(e) => setSeverity(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem 0.75rem',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                fontSize: '0.9rem',
                backgroundColor: '#ffffff',
                boxSizing: 'border-box',
              }}
            >
              <option value="LOW">LOW</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HIGH">HIGH</option>
              <option value="CRITICAL">CRITICAL</option>
            </select>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label
              htmlFor="trafficZone"
              style={{
                display: 'block',
                marginBottom: '0.4rem',
                fontWeight: 600,
                fontSize: '0.875rem',
                color: '#334155',
              }}
            >
              Traffic Zone
            </label>
            <select
              id="trafficZone"
              name="trafficZone"
              value={zoneId}
              onChange={(e) => {
                setZoneId(e.target.value);
                if (formWarning) setFormWarning(null);
              }}
              style={{
                width: '100%',
                padding: '0.5rem 0.75rem',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                fontSize: '0.9rem',
                backgroundColor: '#ffffff',
                boxSizing: 'border-box',
              }}
            >
              <option value="">Select a Traffic Zone</option>
              {trafficZones.map((zone) => {
                const zId = zone.zoneId || zone.id;
                return (
                  <option key={zId} value={zId}>
                    {zone.zoneName} ({zone.zoneCode || zone.district})
                  </option>
                );
              })}
            </select>
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <label
              htmlFor="description"
              style={{
                display: 'block',
                marginBottom: '0.4rem',
                fontWeight: 600,
                fontSize: '0.875rem',
                color: '#334155',
              }}
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              placeholder="Provide additional details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem 0.75rem',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                fontSize: '0.9rem',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '0.75rem',
            }}
          >
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                backgroundColor: '#f8fafc',
                color: '#475569',
                cursor: 'pointer',
                fontWeight: 500,
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-submit"
              disabled={submitting || !title.trim()}
              style={{
                padding: '0.5rem 1.25rem',
                borderRadius: '6px',
                border: 'none',
                backgroundColor:
                  submitting || !title.trim() ? '#94a3b8' : '#2563eb',
                color: '#ffffff',
                cursor: submitting || !title.trim() ? 'not-allowed' : 'pointer',
                fontWeight: 600,
              }}
            >
              {isEditMode ? 'Save Changes' : 'Report Incident'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TrafficIncidentForm;