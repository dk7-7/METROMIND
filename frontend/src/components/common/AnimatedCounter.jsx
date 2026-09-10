import React, { useState, useEffect } from 'react';

const AnimatedCounter = ({ value = 0, duration = 1000, prefix = '', suffix = '', decimals = 0 }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startVal = displayValue;
    const targetVal = Number(value) || 0;
    if (startVal === targetVal) return;

    let startTime = null;
    let animationFrameId;

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      // Ease out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = startVal + (targetVal - startVal) * easeOut;
      
      setDisplayValue(current);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setDisplayValue(targetVal);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [value, duration]);

  const formatted = decimals > 0 ? displayValue.toFixed(decimals) : Math.round(displayValue).toLocaleString();

  return (
    <span className="animated-counter">
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
};

export default AnimatedCounter;
