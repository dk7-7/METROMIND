import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createOutage, fetchAll } from "../../store/slices/utilityOutageSlice";

const OUTAGE_TYPES = ["PLANNED", "UNPLANNED"];
const SEVERITIES = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];

const UtilityOutageForm = ({ onClose }) => {
  const dispatch = useDispatch();
  const { items: grids } = useSelector((state) => state.utilityGrid);

  const [gridId, setGridId] = useState("");
  const [outageType, setOutageType] = useState(OUTAGE_TYPES[0]);
  const [affectedArea, setAffectedArea] = useState("");
  const [severity, setSeverity] = useState(SEVERITIES[0]);
  const [estimatedRestorationTime, setEstimatedRestorationTime] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const payload = {
      gridId: gridId ? Number(gridId) : undefined,
      outageType,
      affectedArea,
      severity,
      estimatedRestorationTime,
    };
    const result = await dispatch(createOutage(payload));
    if (createOutage.fulfilled.match(result)) {
      dispatch(fetchAll());
      onClose();
    } else {
      setError(result.payload || "Overlapping outage registered");
    }
  };

  return (
    <div className="form-overlay">
      <div className="form-modal">
        <button className="close-btn" onClick={onClose} aria-label="close">
          X
        </button>
        <h2>Report Utility Outage</h2>
        {error && <div className="error-alert">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="outage-grid">Utility Grid</label>
            <select
              id="outage-grid"
              value={gridId}
              onChange={(e) => setGridId(e.target.value)}
            >
              <option value="">Select a grid</option>
              {grids.map((g) => (
                <option key={g.gridId} value={g.gridId}>
                  {g.gridName}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="outage-type">Outage Type</label>
            <select
              id="outage-type"
              value={outageType}
              onChange={(e) => setOutageType(e.target.value)}
            >
              {OUTAGE_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="outage-area">Affected Area</label>
            <input
              id="outage-area"
              type="text"
              value={affectedArea}
              onChange={(e) => setAffectedArea(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="outage-severity">Severity</label>
            <select
              id="outage-severity"
              value={severity}
              onChange={(e) => setSeverity(e.target.value)}
            >
              {SEVERITIES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="outage-restoration">Estimated Restoration Time</label>
            <input
              id="outage-restoration"
              type="datetime-local"
              value={estimatedRestorationTime}
              onChange={(e) => setEstimatedRestorationTime(e.target.value)}
            />
          </div>
          <button type="submit" className="btn-primary">
            Report Outage
          </button>
        </form>
      </div>
    </div>
  );
};

export default UtilityOutageForm;
