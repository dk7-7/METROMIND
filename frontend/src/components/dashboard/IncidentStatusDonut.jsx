import React from "react";

const STATUS_COLORS = {
  REPORTED: "#f59e0b",
  DISPATCHED: "#2563eb",
  RESOLVED: "#22c55e",
  CLOSED: "#64748b",
};

const IncidentStatusDonut = ({ incidents = [] }) => {
  const counts = incidents.reduce((acc, incident) => {
    acc[incident.status] = (acc[incident.status] || 0) + 1;
    return acc;
  }, {});
  const total = incidents.length || 1;

  return (
    <div>
      <h3>Incidents by Status</h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {Object.entries(counts).map(([status, count]) => (
          <li key={status} style={{ marginBottom: 6 }}>
            <span
              style={{
                display: "inline-block",
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: STATUS_COLORS[status] || "#94a3b8",
                marginRight: 8,
              }}
            />
            {status}: {count} ({Math.round((count / total) * 100)}%)
          </li>
        ))}
      </ul>
    </div>
  );
};

export default IncidentStatusDonut;
