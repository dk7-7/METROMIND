import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { create, update, fetchAll } from '../../store/slices/utilityGridSlice';
import { addNotification } from '../../store/slices/alertNotificationSlice';
import ErrorHandler from '../common/ErrorHandler';
import './UtilityGridForm.css';

const UtilityGridForm = ({ grid = null, onClose, onSuccess }) => {
  const isEditMode = !!grid;
  const dispatch = useDispatch();
  const firstInputRef = useRef(null);

  const [gridName, setGridName] = useState(grid?.gridName || grid?.name || '');
  const [gridType, setGridType] = useState(grid?.gridType || grid?.type || 'POWER');
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
      setGridName(grid.gridName || grid.name || '');
      setGridType(grid.gridType || grid.type || 'POWER');
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
          <h2>{isEditMode ? 'Edit Utility Grid' : 'Add Utility Grid'}</h2>
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

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="gridName">Grid Name</label>
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

          <div className="form-group">
            <label htmlFor="gridType">Grid Type</label>
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

          <div className="form-group">
            <label htmlFor="district">District</label>
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

          <div className="form-group">
            <label htmlFor="capacityUnits">Capacity Units</label>
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

          <div className="form-group">
            <label htmlFor="currentLoad">Current Load</label>
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

          <div className="modal-actions">
            <button
              type="submit"
              className="btn-submit"
              disabled={submitting || !gridName.trim()}
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