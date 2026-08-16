import React from "react";

const RecentActivity = ({ items = [] }) => (
  <div>
    <h3>Recent Activity</h3>
    {items.length === 0 ? (
      <p>No recent activity.</p>
    ) : (
      <ul>
        {items.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>
    )}
  </div>
);

export default RecentActivity;
