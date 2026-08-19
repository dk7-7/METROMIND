import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  createZone,
  updateZone,
  fetchAll,
} from "../../store/slices/trafficZoneSlice";

const CONGESTION_LEVELS = ["LOW", "MODERATE", "HIGH", "CRITICAL"];

const TrafficZoneForm = ({ zone, onClose }) => {
  const isEdit = Boolean(zone);
  const dispatch = useDispatch();

  const [zoneName, setZoneName] = useState(zone?.zoneName || "");
  const [zoneCode, setZoneCode] = useState(zone?.zoneCode || "");
  const [district, setDistrict] = useState(zone?.district || "");
  const [currentCongestionLevel, setCurrentCongestionLevel] = useState(
    zone?.currentCongestionLevel || CONGESTION_LEVELS[0]
  );
  const [signalCycleSeconds, setSignalCycleSeconds] = useState(
    zone?.signalCycleSeconds || 60
  );
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const payload = {
      zoneName,
      zoneCode,
      district,
      currentCongestionLevel,
      signalCycleSeconds: Number(signalCycleSeconds),
    };
    const action = isEdit
      ? updateZone({ id: zone.zoneId, data: payload })
      : createZone(payload);
    const result = await dispatch(action);
    if (createZone.fulfilled.match(result) || updateZone.fulfilled.match(result)) {
      dispatch(fetchAll());
      onClose();
    } else {
      setError(result.payload || "Unable to save zone");
    }
  };

  return (
    <div className="form-overlay">
      <div className="form-modal">
        <button className="close-btn" onClick={onClose} aria-label="close">
          X
        </button>
        <h2>{isEdit ? "Edit Traffic Zone" : "Add Traffic Zone"}</h2>
        {error && <div className="error-alert">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="zone-name">Zone Name</label>
            <input
              id="zone-name"
              type="text"
              value={zoneName}
              onChange={(e) => setZoneName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="zone-code">Zone Code</label>
            <input
              id="zone-code"
              type="text"
              value={zoneCode}
              onChange={(e) => setZoneCode(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="zone-district">District</label>
            <input
              id="zone-district"
              type="text"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="zone-congestion">Congestion Level</label>
            <select
              id="zone-congestion"
              value={currentCongestionLevel}
              onChange={(e) => setCurrentCongestionLevel(e.target.value)}
            >
              {CONGESTION_LEVELS.map((lvl) => (
                <option key={lvl} value={lvl}>
                  {lvl}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="zone-signal">Signal Cycle (s)</label>
            <input
              id="zone-signal"
              type="number"
              value={signalCycleSeconds}
              onChange={(e) => setSignalCycleSeconds(e.target.value)}
            />
          </div>
          <button type="submit" className="btn-primary">
            {isEdit ? "Save Changes" : "Add Zone"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TrafficZoneForm;
