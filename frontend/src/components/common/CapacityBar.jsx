import React from 'react';

const CapacityBar = ({ current, total }) => {
    let percentage = 0;
    if (total && total > 0) {
        percentage = (current / total) * 100;
    }
    
    // safe cap to 100%
    percentage = Math.min(percentage, 100);

    let bgColor = '#22c55e'; // Green
    if (percentage >= 70 && percentage < 90) {
        bgColor = '#f59e0b'; // Amber
    } else if (percentage >= 90) {
        bgColor = '#ef4444'; // Red
    }

    return (
        <div style={{ width: '100%', backgroundColor: '#e5e7eb', borderRadius: '4px', height: '10px', overflow: 'hidden' }}>
            <div style={{ width: `${percentage}%`, backgroundColor: bgColor, height: '100%', transition: 'width 0.3s ease' }}></div>
        </div>
    );
};

export default CapacityBar;
