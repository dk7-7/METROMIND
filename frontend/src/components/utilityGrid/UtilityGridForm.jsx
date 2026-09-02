import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { create, update, fetchAll } from '../../store/slices/utilityGridSlice';
import { addNotification } from '../../store/slices/alertNotificationSlice';

const UtilityGridForm = ({ grid = null, onClose, onSuccess }) => {
  const isEditMode = !!grid;
  const dispatch = useDispatch();

  const [gridName, setGridName] = useState(grid?.gridName || '');
  const [gridType, setGridType] = useState(grid?.gridType || 'POWER');
  const [district, setDistrict] = useState(grid?.district || '');
  const [capacityUnits, setCapacityUnits] = useState(grid?.capacityUnits || 100);
  const [currentLoad, setCurrentLoad] = useState(grid?.currentLoad || 0);
  const [formError, setFormError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

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
          <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600, color: '#1e293b' }}>
            {isEditMode ? 'Edit Utility Grid' : 'Add Utility Grid'}
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

        {formError && (
          <div
            className="error-alert"
            style={{
              padding: '0.625rem 0.875rem',
              backgroundColor: '#fee2e2',
              color: '#b91c1c',
              borderRadius: '6px',
              border: '1px solid #fca5a5',
              marginBottom: '1rem',
              fontSize: '0.875rem',
            }}
          >
            {formError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label
              htmlFor="gridName"
              style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.875rem', color: '#334155' }}
            >
              Grid Name
            </label>
            <input
              id="gridName"
              name="gridName"
              type="text"
              placeholder="e.g. Metro Central Substation"
              value={gridName}
              onChange={(e) => setGridName(e.target.value)}
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
              htmlFor="gridType"
              style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.875rem', color: '#334155' }}
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
                padding: '0.5rem 0.75rem',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                fontSize: '0.9rem',
                backgroundColor: '#ffffff',
                boxSizing: 'border-box',
              }}
            >
              <option value="POWER">POWER</option>
              <option value="WATER">WATER</option>
              <option value="GAS">GAS</option>
            </select>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label
              htmlFor="district"
              style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.875rem', color: '#334155' }}
            >
              District
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
                padding: '0.5rem 0.75rem',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                fontSize: '0.9rem',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem' }}>
            <div style={{ flex: 1 }}>
              <label
                htmlFor="capacityUnits"
                style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.875rem', color: '#334155' }}
              >
                Capacity Units
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
                  padding: '0.5rem 0.75rem',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.9rem',
                  boxSizing: 'border-box',
                }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label
                htmlFor="currentLoad"
                style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.875rem', color: '#334155' }}
              >
                Current Load
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
                  padding: '0.5rem 0.75rem',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.9rem',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
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
              disabled={submitting || !gridName.trim()}
              style={{
                padding: '0.5rem 1.25rem',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: submitting || !gridName.trim() ? '#94a3b8' : '#2563eb',
                color: '#ffffff',
                cursor: submitting || !gridName.trim() ? 'not-allowed' : 'pointer',
                fontWeight: 600,
              }}
            >
              {isEditMode ? 'Save Changes' : 'Add Grid'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UtilityGridForm;