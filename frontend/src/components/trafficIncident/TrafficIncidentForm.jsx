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
  item = null,
  record = null,
  data = null,
  initialValues = null,
  incidentId = null,
  id = null,
  onClose,
  onSuccess,
}) => {
  const targetItem = incident || item || record || data || initialValues;
  const targetId = targetItem?.incidentId || targetItem?.id || incidentId || id;
  const isEditMode = !!targetId;
  const dispatch = useDispatch();

  const titleInputRef = useRef(null);

  const [title, setTitle] = useState(targetItem?.title || '');
  const [severity, setSeverity] = useState(targetItem?.severity || 'MEDIUM');
  const [zoneId, setZoneId] = useState(
    targetItem?.zone?.zoneId || targetItem?.zoneId || targetItem?.zone?.id || ''
  );
  const [formError, setFormError] = useState(null);
  const [formWarning, setFormWarning] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const trafficZones = useSelector(
    (state) => state.trafficZone?.items || state.trafficZones?.items || []
  );

  useEffect(() => {
    if (titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    dispatch(fetchTrafficZones());
  }, [dispatch]);

  useEffect(() => {
    if (targetItem) {
      setTitle(targetItem.title || '');
      setSeverity(targetItem.severity || 'MEDIUM');
      setZoneId(
        targetItem.zone?.zoneId ||
          targetItem.zoneId ||
          targetItem.zone?.id ||
          targetItem.zone ||
          ''
      );
    } else if (targetId) {
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
        }
      });
    }
  }, [targetItem, targetId, dispatch]);

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setFormError(null);
    setFormWarning(null);

    if (!title.trim()) {
      return;
    }

    setSubmitting(true);

    const payload = {
      title: title.trim(),
      severity,
      zoneId: zoneId ? Number(zoneId) : 1,
    };

    try {
      if (isEditMode) {
        const resultAction = await dispatch(
          update({ id: targetId, data: payload })
        );
        if (update.fulfilled.match(resultAction)) {
          const successMsg = 'TrafficIncident updated successfully.';
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
          setFormError(resultAction.payload || 'Unable to save traffic incident');
        }
      } else {
        const resultAction = await dispatch(create(payload));
        if (create.fulfilled.match(resultAction)) {
          const successMsg = 'TrafficIncident created successfully.';
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
          setFormError(resultAction.payload || 'Unable to save traffic incident');
        }
      }
    } catch (err) {
      setFormError('Unable to save traffic incident');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay form-overlay">
      <div className="modal-content form-modal">
        <div className="modal-header">
          <h2>
            {isEditMode ? 'Edit Traffic Incident' : 'Report New Incident'}
          </h2>
          <button
            type="button"
            className="btn-close"
            onClick={onClose}
            aria-label="Close"
          >
            X
          </button>
        </div>

        {formError && <ErrorHandler error={formError} />}

        {formWarning && (
          <Alert
            message={formWarning}
            type="warning"
            duration={3000}
            onClose={() => setFormWarning(null)}
          />
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title</label>
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
            />
          </div>

          <div className="form-group">
            <label htmlFor="severity">Severity</label>
            <select
              id="severity"
              name="severity"
              value={severity}
              onChange={(e) => setSeverity(e.target.value)}
            >
              <option value="LOW">LOW</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HIGH">HIGH</option>
              <option value="CRITICAL">CRITICAL</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="trafficZone">Traffic Zone</label>
            <select
              id="trafficZone"
              name="trafficZone"
              value={zoneId}
              onChange={(e) => {
                setZoneId(e.target.value);
                if (formWarning) setFormWarning(null);
              }}
            >
              <option value="">Select a Traffic Zone</option>
              {trafficZones.map((zone) => {
                const zId = zone.zoneId || zone.id;
                return (
                  <option key={zId} value={zId}>
                    {zone.zoneName}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="modal-actions">
            <button
              type="submit"
              className="btn-submit"
              disabled={submitting || !title.trim()}
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