import React, { useState, useEffect } from 'react';
import {
  Sliders,
  Cpu,
  Clock,
  Car,
  Sparkles,
  CheckCircle2,
  RefreshCw,
  Zap,
  Activity,
  Radio
} from 'lucide-react';
import StatusBadge from '../common/StatusBadge';

const SignalManager = ({ greenCorridorActive = false }) => {
  const [isAiMode, setIsAiMode] = useState(true);
  const [activeIntersections, setActiveIntersections] = useState([
    {
      id: 'SIG-4A',
      name: 'Junction 4A - Downtown Central Core',
      zone: 'Zone 1 (Expressway Link)',
      currentPhase: 'GREEN',
      countdown: 18,
      cycleTotal: 60,
      redDuration: 25,
      yellowDuration: 5,
      greenDuration: 30,
      vehicleQueue: 4,
      queueOccupancy: 22,
      aiRecommendation: 'Phase extension (+8s) active due to heavy northbound rush',
      mode: 'AI_ADAPTIVE',
    },
    {
      id: 'SIG-7B',
      name: 'Junction 7B - Harbor Coastal Cross',
      zone: 'Zone 3 (Bridge Arterial)',
      currentPhase: 'RED',
      countdown: 12,
      cycleTotal: 90,
      redDuration: 45,
      yellowDuration: 5,
      greenDuration: 40,
      vehicleQueue: 18,
      queueOccupancy: 78,
      aiRecommendation: 'Queue buildup detected. Early green phase shift recommended in 5s.',
      mode: 'AI_ADAPTIVE',
    },
    {
      id: 'SIG-2C',
      name: 'Junction 2C - Cyber Tech Innovation Gate',
      zone: 'Zone 2 (Tech Boulevard)',
      currentPhase: 'YELLOW',
      countdown: 3,
      cycleTotal: 45,
      redDuration: 20,
      yellowDuration: 4,
      greenDuration: 21,
      vehicleQueue: 9,
      queueOccupancy: 45,
      aiRecommendation: 'Flow balance optimal. Standard cycle maintained.',
      mode: 'AI_ADAPTIVE',
    },
    {
      id: 'SIG-5D',
      name: 'Junction 5D - North Ring Link Interchange',
      zone: 'Zone 4 (Outer Ring Road)',
      currentPhase: 'GREEN',
      countdown: 24,
      cycleTotal: 50,
      redDuration: 20,
      yellowDuration: 4,
      greenDuration: 26,
      vehicleQueue: 3,
      queueOccupancy: 15,
      aiRecommendation: 'Traffic clear. Eco-mode wave optimization active.',
      mode: 'AI_ADAPTIVE',
    },
  ]);

  // Real-time ticking countdown loop
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIntersections((prev) =>
        prev.map((sig) => {
          if (greenCorridorActive && (sig.id === 'SIG-4A' || sig.id === 'SIG-7B')) {
            return {
              ...sig,
              currentPhase: 'GREEN',
              countdown: 99,
              aiRecommendation: '🚨 EMERGENCY GREEN CORRIDOR PREEMPTION ACTIVE',
            };
          }

          let nextCount = sig.countdown - 1;
          let nextPhase = sig.currentPhase;

          if (nextCount <= 0) {
            if (sig.currentPhase === 'GREEN') {
              nextPhase = 'YELLOW';
              nextCount = sig.yellowDuration;
            } else if (sig.currentPhase === 'YELLOW') {
              nextPhase = 'RED';
              nextCount = sig.redDuration;
            } else {
              nextPhase = 'GREEN';
              nextCount = sig.greenDuration;
            }
          }

          return {
            ...sig,
            countdown: nextCount,
            currentPhase: nextPhase,
          };
        })
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [greenCorridorActive]);

  const handleManualOverride = (id, newPhase) => {
    setActiveIntersections((prev) =>
      prev.map((sig) => {
        if (sig.id === id) {
          return {
            ...sig,
            currentPhase: newPhase,
            countdown: newPhase === 'GREEN' ? 30 : newPhase === 'YELLOW' ? 5 : 25,
            mode: 'MANUAL_OVERRIDE',
          };
        }
        return sig;
      })
    );
  };

  return (
    <div className="signal-manager-container glass-panel">
      {/* Header */}
      <div className="signal-header">
        <div className="signal-title-group">
          <div className="signal-badge">
            <Radio size={14} className="hud-icon-spin text-cyan" />
            <span>AI ACTUATED TRAFFIC SIGNAL CONTROLLERS</span>
          </div>
          <h3 className="signal-title">
            Intelligent Intersection Signal Controllers
          </h3>
          <p className="signal-subtitle">
            Dynamic split, cycle length & offset optimization powered by real-time queue density telemetry
          </p>
        </div>

        {/* Global AI Autopilot Toggle */}
        <div className="signal-global-toggle">
          <span className="toggle-label">AI Autonomous Grid Control:</span>
          <button
            type="button"
            className={`switch-btn ${isAiMode ? 'active' : ''}`}
            onClick={() => setIsAiMode(!isAiMode)}
          >
            <span className="switch-slider" />
          </button>
          <span className={`status-pill ${isAiMode ? 'pill-ai' : 'pill-manual'}`}>
            {isAiMode ? 'AI AUTONOMOUS' : 'MANUAL CONTROL'}
          </span>
        </div>
      </div>

      {/* Signal Intersections Grid */}
      <div className="signals-grid">
        {activeIntersections.map((sig) => {
          const isGreen = sig.currentPhase === 'GREEN';
          const isYellow = sig.currentPhase === 'YELLOW';
          const isRed = sig.currentPhase === 'RED';

          return (
            <div key={sig.id} className="signal-card glass-panel">
              {/* Card Header */}
              <div className="signal-card-header">
                <div>
                  <div className="signal-id-tag">{sig.id}</div>
                  <h4 className="signal-name">{sig.name}</h4>
                  <span className="signal-zone">{sig.zone}</span>
                </div>
                <StatusBadge
                  status={greenCorridorActive && (sig.id === 'SIG-4A' || sig.id === 'SIG-7B') ? 'EMERGENCY' : sig.mode}
                  size="sm"
                />
              </div>

              {/* Signal Head Visual + Countdown Display */}
              <div className="signal-visual-row">
                {/* 3-Head Traffic Light Lamp Container */}
                <div className="traffic-light-housing">
                  <div className={`light-lamp lamp-red ${isRed ? 'lit glow-red' : ''}`} />
                  <div className={`light-lamp lamp-yellow ${isYellow ? 'lit glow-yellow' : ''}`} />
                  <div className={`light-lamp lamp-green ${isGreen ? 'lit glow-green' : ''}`} />
                </div>

                {/* Big Live Digital Timer Box */}
                <div className="signal-countdown-box">
                  <span className="countdown-label">CURRENT PHASE</span>
                  <div className={`countdown-value phase-${sig.currentPhase.toLowerCase()}`}>
                    {sig.countdown}
                    <span className="countdown-unit">s</span>
                  </div>
                  <span className={`phase-badge badge-${sig.currentPhase.toLowerCase()}`}>
                    {sig.currentPhase} PHASE
                  </span>
                </div>

                {/* Queue Length & Sensor Occupancy */}
                <div className="signal-queue-box">
                  <div className="queue-stat">
                    <span className="stat-name">Queue Density</span>
                    <span className="stat-number">{sig.vehicleQueue} vehicles</span>
                  </div>
                  <div className="queue-bar-wrap">
                    <div
                      className={`queue-bar-fill ${sig.queueOccupancy > 60 ? 'fill-crimson' : sig.queueOccupancy > 30 ? 'fill-amber' : 'fill-cyan'}`}
                      style={{ width: `${sig.queueOccupancy}%` }}
                    />
                  </div>
                  <span className="queue-percent">{sig.queueOccupancy}% lane saturation</span>
                </div>
              </div>

              {/* AI Recommendation Banner */}
              <div className="signal-ai-banner">
                <Sparkles size={14} className="text-purple" />
                <span className="ai-banner-text">{sig.aiRecommendation}</span>
              </div>

              {/* Manual Override Controls */}
              <div className="signal-override-controls">
                <span className="override-title">Manual Phase Override:</span>
                <div className="override-buttons-row">
                  <button
                    type="button"
                    className={`btn-override override-red ${isRed ? 'active' : ''}`}
                    onClick={() => handleManualOverride(sig.id, 'RED')}
                  >
                    Hold Red
                  </button>
                  <button
                    type="button"
                    className={`btn-override override-yellow ${isYellow ? 'active' : ''}`}
                    onClick={() => handleManualOverride(sig.id, 'YELLOW')}
                  >
                    Hold Yellow
                  </button>
                  <button
                    type="button"
                    className={`btn-override override-green ${isGreen ? 'active' : ''}`}
                    onClick={() => handleManualOverride(sig.id, 'GREEN')}
                  >
                    Force Green
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SignalManager;
