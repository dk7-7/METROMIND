import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { updateGrid, fetchAll } from "../../store/slices/utilityGridSlice";

const STATUSES = ["OPERATIONAL", "DEGRADED", "OFFLINE"];

const UtilityGridForm = ({ grid, onClose }) => {
  const dispatch = useDispatch();
  const [currentLoad, setCurrentLoad] = useState(grid?.currentLoad || 0);
  const [status, setStatus] = useState(grid?.status || STATUSES[0]);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const result = await dispatch(
      updateGrid({ id: grid.gridId, data: { currentLoad: Number(currentLoad), status } })
    );
    if (updateGrid.fulfilled.match(result)) {
      dispatch(fetchAll());
      onClose();
    } else {
      setError(result.payload || "Unable to update grid");
    }
  };

  return (
    <div className="form-overlay">
      <div className="form-modal">
        <button className="close-btn" onClick={onClose} aria-label="close">
          X
        </button>
        <h2>Update Utility Grid</h2>
        {error && <div className="error-alert">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="grid-load">Current Load</label>
            <input
              id="grid-load"
              type="number"
              value={currentLoad}
              onChange={(e) => setCurrentLoad(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="grid-status">Status</label>
            <select id="grid-status" value={status} onChange={(e) => setStatus(e.target.value)}>
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className="btn-primary">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default UtilityGridForm;
