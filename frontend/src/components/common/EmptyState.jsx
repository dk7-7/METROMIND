import React from "react";

const EmptyState = ({ message }) => (
  <div className="empty-state">
    <div style={{ fontSize: 32, marginBottom: 8 }}>📭</div>
    <p>{message}</p>
  </div>
);

export default EmptyState;
