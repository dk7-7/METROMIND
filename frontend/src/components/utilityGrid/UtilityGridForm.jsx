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
    <div
      className="modal-overlay"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(5, 10, 20, 0.75)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '1rem',
      }}
    >
      <div
        className="modal-content animate-fade-in"
        style={{
          backgroundColor: '#0f172a',
          borderRadius: '14px',
          width: '100%',
          maxWidth: '520px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.05)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            backgroundColor: 'rgba(255, 255, 255, 0.02)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <div
              style={{
                width: '30px',
                height: '30px',
                borderRadius: '8px',
                background: 'rgba(6, 182, 212, 0.15)',
                border: '1px solid rgba(6, 182, 212, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#06b6d4',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
            </div>
            <h2 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600, color: '#f8fafc' }}>
              {isEditMode ? 'Modify Utility Grid' : 'Register Utility Grid'}
            </h2>
          </div>

          <button
            type="button"
            className="btn-close"
            onClick={onClose}
            aria-label="Close"
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: '1.125rem',
              cursor: 'pointer',
              color: '#94a3b8',
              padding: '0.35rem',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ✕
          </button>
        </div>

        <div style={{ padding: '1.5rem' }}>
          {formError && <ErrorHandler error={formError} />}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1.25rem' }}>
              <label
                htmlFor="gridName"
                style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.8125rem', color: '#cbd5e1' }}
              >
                Grid Name <span style={{ color: '#ef4444' }}>*</span>
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
                style={{
                  width: '100%',
                  padding: '0.625rem 0.875rem',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  color: '#f8fafc',
                  fontSize: '0.875rem',
                  boxSizing: 'border-box',
                  outline: 'none',
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <label
                  htmlFor="gridType"
                  style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.8125rem', color: '#cbd5e1' }}
                >
                  Grid Type
                </label>
                <select
                  id="gridType"
                  name="gridType"
                  value={gridType}
                  onChange={(e) => setGridType(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.625rem 0.875rem',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    backgroundColor: '#1e293b',
                    color: '#f8fafc',
                    fontSize: '0.875rem',
                    boxSizing: 'border-box',
                    outline: 'none',
                  }}
                >
                  <option value="POWER">POWER</option>
                  <option value="WATER">WATER</option>
                  <option value="GAS">GAS</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="district"
                  style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.8125rem', color: '#cbd5e1' }}
                >
                  District <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  id="district"
                  name="district"
                  type="text"
                  placeholder="e.g. North District"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '0.625rem 0.875rem',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    color: '#f8fafc',
                    fontSize: '0.875rem',
                    boxSizing: 'border-box',
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <label
                  htmlFor="capacityUnits"
                  style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.8125rem', color: '#cbd5e1' }}
                >
                  Capacity Units <span style={{ color: '#ef4444' }}>*</span>
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
                  style={{
                    width: '100%',
                    padding: '0.625rem 0.875rem',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    color: '#f8fafc',
                    fontSize: '0.875rem',
                    boxSizing: 'border-box',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label
                  htmlFor="currentLoad"
                  style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.8125rem', color: '#cbd5e1' }}
                >
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
                  style={{
                    width: '100%',
                    padding: '0.625rem 0.875rem',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    color: '#f8fafc',
                    fontSize: '0.875rem',
                    boxSizing: 'border-box',
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  padding: '0.55rem 1.125rem',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  color: '#cbd5e1',
                  cursor: 'pointer',
                  fontWeight: 500,
                  fontSize: '0.875rem',
                  transition: 'all 0.15s ease',
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-submit btn-primary"
                disabled={submitting || !gridName.trim()}
                style={{
                  padding: '0.55rem 1.25rem',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: submitting || !gridName.trim() ? '#475569' : '#2563eb',
                  color: '#ffffff',
                  cursor: submitting || !gridName.trim() ? 'not-allowed' : 'pointer',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  boxShadow: submitting || !gridName.trim() ? 'none' : '0 2px 8px rgba(37, 99, 235, 0.3)',
                  transition: 'all 0.15s ease',
                }}
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