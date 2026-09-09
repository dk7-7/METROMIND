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
  const [description, setDescription] = useState(targetItem?.description || '');
  const [formError, setFormError] = useState(null);
  const [formWarning, setFormWarning] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const trafficZones = useSelector(
    (state) => state.trafficZone?.items || state.trafficZones?.items || []
  );

  // Focus first input element on modal mount using useRef
  useEffect(() => {
    if (titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, []);

  // Fetch zones on mount
  useEffect(() => {
    dispatch(fetchTrafficZones());
  }, [dispatch]);

  // Pre-fill form with backend response when incident/item prop or id is provided
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
      setDescription(targetItem.description || '');
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
          setDescription(fetched.description || '');
        }
      });
    }
  }, [targetItem, targetId, dispatch]);

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setFormError(null);
    setFormWarning(null);

    if (!title.trim()) {
      setFormWarning('Title is required');
      return;
    }

    setSubmitting(true);

    const payload = {
      title: title.trim(),
      severity,
      zoneId: zoneId ? Number(zoneId) : 1,
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
            (typeof resultAction.payload === 'string'
              ? resultAction.payload
              : 'TrafficIncident updated successfully.');
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
          const successMsg =
            resultAction.payload?.message ||
            (typeof resultAction.payload === 'string'
              ? resultAction.payload
              : 'TrafficIncident created successfully.');
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
          <div className="modal-title-group">
            <h2 className="modal-title">
              {isEditMode ? 'Edit Traffic Incident' : 'Report New Incident'}
            </h2>
            <p className="modal-subtitle">
              {isEditMode ? `Updating incident record #${targetId}` : 'Submit municipal emergency or roadway alert'}
            </p>
          </div>
          <button
            type="button"
            className="btn-close close-btn"
            onClick={onClose}
            aria-label="Close"
          >
            ×
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
          <div className="form-group">
            <label htmlFor="title">
              Incident Title <span className="required-star">*</span>
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
            />
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label htmlFor="severity">
                Severity
              </label>
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
              <label htmlFor="trafficZone">
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
              >
                <option value="">Select a Traffic Zone</option>
                {trafficZones.map((zone) => {
                  const zId = zone.zoneId || zone.id;
                  return (
                    <option key={zId} value={zId}>
                      {zone.zoneName} {zone.zoneCode ? `(${zone.zoneCode})` : ''}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">
              Description & Field Details
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              placeholder="Provide operational context, emergency response units dispatched, lane closures, etc."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-submit btn-primary"
              disabled={submitting || !title.trim()}
            >
              {submitting ? 'Processing...' : isEditMode ? 'Save Changes' : 'Report Incident'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TrafficIncidentForm;