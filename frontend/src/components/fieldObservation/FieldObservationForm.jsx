import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createObservation, fetchAll } from "../../store/slices/fieldObservationSlice";

const FieldObservationForm = ({ onClose }) => {
  const dispatch = useDispatch();
  const [observationText, setObservationText] = useState("");
  const [sensorReadingValue, setSensorReadingValue] = useState("");
  const [unit, setUnit] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const payload = {
      observationText,
      sensorReadingValue: sensorReadingValue ? Number(sensorReadingValue) : undefined,
      unit,
      latitude: latitude ? Number(latitude) : undefined,
      longitude: longitude ? Number(longitude) : undefined,
    };
    const result = await dispatch(createObservation(payload));
    if (createObservation.fulfilled.match(result)) {
      dispatch(fetchAll());
      onClose();
    } else {
      setError(result.payload || "Unable to save observation");
    }
  };

  return (
    <div className="form-overlay">
      <div className="form-modal">
        <button className="close-btn" onClick={onClose} aria-label="close">
          X
        </button>
        <h2>Submit Field Observation</h2>
        {error && <div className="error-alert">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="obs-text">Observation</label>
            <textarea
              id="obs-text"
              value={observationText}
              onChange={(e) => setObservationText(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="obs-reading">Sensor Reading</label>
            <input
              id="obs-reading"
              type="number"
              value={sensorReadingValue}
              onChange={(e) => setSensorReadingValue(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="obs-unit">Unit</label>
            <input
              id="obs-unit"
              type="text"
              placeholder="e.g. Veh/Min, KW"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="obs-lat">Latitude</label>
            <input
              id="obs-lat"
              type="number"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="obs-lng">Longitude</label>
            <input
              id="obs-lng"
              type="number"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
            />
          </div>
          <button type="submit" className="btn-primary" disabled={!observationText}>
            Submit Observation
          </button>
        </form>
      </div>
    </div>
  );
};

export default FieldObservationForm;
