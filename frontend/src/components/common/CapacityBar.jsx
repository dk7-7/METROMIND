import React from 'react';

const CapacityBar = ({ current, total }) => {
    const validTotal = (total && total > 0) ? total : 1; // Prevent NaN / Infinity
    const percentage = Math.min(Math.max((current / validTotal) * 100, 0), 100);
    
    let bgColor = '#22c55e'; // Green
    if (percentage >= 90) bgColor = '#ef4444'; // Red
    else if (percentage >= 70) bgColor = '#f59e0b'; // Amber

    return (
        <div style={{ width: '100%', backgroundColor: '#e2e8f0', borderRadius: '4px', height: '8px', overflow: 'hidden' }}>
            <div style={{ width: `${percentage}%`, backgroundColor: bgColor, height: '100%', transition: 'width 0.3s ease' }}></div>
        </div>
    );
};

export default CapacityBar;
