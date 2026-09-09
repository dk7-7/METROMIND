import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { create, update, fetchAll } from '../../store/slices/utilityGridSlice';
import { addNotification } from '../../store/slices/alertNotificationSlice';
import ErrorHandler from '../common/ErrorHandler';

const UtilityGridForm = ({ grid = null, onClose, onSuccess }) => {
  const isEditMode = !!grid;
  const dispatch = useDispatch();
  const firstInputRef = useRef(null);

  const [gridName, setGridName] = useState(grid?.gridName || '');
  const [gridType, setGridType] = useState(grid?.gridType || 'POWER');
  const [district, setDistrict] = useState(grid?.district || '');
  const [capacityUnits, setCapacityUnits] = useState(grid?.capacityUnits || 100);
  const [currentLoad, setCurrentLoad] = useState(grid?.currentLoad || 0);
  const [formError, setFormError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (firstInputRef.current) {
      firstInputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (grid) {
      setGridName(grid.gridName || '');
      setGridType(grid.gridType || 'POWER');
      setDistrict(grid.district || '');
      setCapacityUnits(grid.capacityUnits || 100);
      setCurrentLoad(grid.currentLoad || 0);
    }
  }, [grid]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!gridName.trim()) return;

    setFormError(null);
    setSubmitting(true);

    const payload = {
      gridName: gridName.trim(),
      gridType,
      district: district.trim(),
      capacityUnits: Number(capacityUnits),
      currentLoad: Number(currentLoad),
    };

    try {
      if (isEditMode) {
        const id = grid.gridId || grid.id;
        const resultAction = await dispatch(update({ id, data: payload }));
        if (update.fulfilled.match(resultAction)) {
          dispatch(addNotification({ message: 'UtilityGrid updated successfully.', type: 'success' }));
          await dispatch(fetchAll());
          if (onSuccess) onSuccess('UtilityGrid updated successfully.');
          if (onClose) onClose();
        } else {
          setFormError(resultAction.payload || 'Failed to update utility grid');
        }
      } else {
        const resultAction = await dispatch(create(payload));
        if (create.fulfilled.match(resultAction)) {
          dispatch(addNotification({ message: 'UtilityGrid created successfully.', type: 'success' }));
          await dispatch(fetchAll());
          if (onSuccess) onSuccess('UtilityGrid created successfully.');
          if (onClose) onClose();
        } else {
          setFormError(resultAction.payload || 'Failed to create utility grid');
        }
      }
    } catch (err) {
      setFormError('Failed to save utility grid');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay form-overlay">
      <div className="modal-content form-modal">
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'rgba(6, 182, 212, 0.15)',
                border: '1px solid rgba(6, 182, 212, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-cyan)',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
            </div>
            <div>
              <h2 className="modal-title">
                {isEditMode ? 'Modify Utility Grid' : 'Register Utility Grid'}
              </h2>
              <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {isEditMode ? `Updating grid record #${grid.gridId || grid.id}` : 'Provision and configure infrastructure capacity'}
              </p>
            </div>
          </div>

          <button
            type="button"
            className="btn-close"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div>
          {formError && <ErrorHandler error={formError} />}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="gridName">
                Grid Name <span style={{ color: 'var(--danger-text)' }}>*</span>
              </label>
              <input
                ref={firstInputRef}
                id="gridName"
                name="gridName"
                type="text"
                placeholder="e.g. Metro Central Substation"
                value={gridName}
                onChange={(e) => setGridName(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label htmlFor="gridType">
                  Grid Type
                </label>
                <select
                  id="gridType"
                  name="gridType"
                  value={gridType}
                  onChange={(e) => setGridType(e.target.value)}
                >
                  <option value="POWER">POWER</option>
                  <option value="WATER">WATER</option>
                  <option value="GAS">GAS</option>
                </select>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label htmlFor="district">
                  District <span style={{ color: 'var(--danger-text)' }}>*</span>
                </label>
                <input
                  id="district"
                  name="district"
                  type="text"
                  placeholder="e.g. North District"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label htmlFor="capacityUnits">
                  Capacity Units <span style={{ color: 'var(--danger-text)' }}>*</span>
                </label>
                <input
                  id="capacityUnits"
                  name="capacityUnits"
                  type="number"
                  min="1"
                  step="any"
                  value={capacityUnits}
                  onChange={(e) => setCapacityUnits(e.target.value)}
                  required
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label htmlFor="currentLoad">
                  Current Load (Units)
                </label>
                <input
                  id="currentLoad"
                  name="currentLoad"
                  type="number"
                  min="0"
                  step="any"
                  value={currentLoad}
                  onChange={(e) => setCurrentLoad(e.target.value)}
                />
              </div>
            </div>

            <div
              className="modal-actions"
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '0.75rem',
                borderTop: '1px solid var(--border-subtle)',
                paddingTop: '1.25rem',
              }}
            >
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
                disabled={submitting || !gridName.trim()}
              >
                {submitting ? 'Saving...' : isEditMode ? 'Save Changes' : 'Add Grid'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UtilityGridForm;