import React, { useState, useEffect, useRef } from 'react';
import {
  Layers,
  Video,
  AlertTriangle,
  Zap,
  Activity,
  Maximize2,
  Minimize2,
  RefreshCw,
  Plus,
  Minus,
  RotateCcw,
  Navigation,
  Eye,
  Sliders,
  ShieldAlert,
  Radio
} from 'lucide-react';
import StatusBadge from '../common/StatusBadge';

const DigitalTwinCity = ({
  incidents = [],
  onSelectEntity,
  onActivateGreenCorridor,
  greenCorridorActive = false,
}) => {
  const [zoom, setZoom] = useState(1);
  const [is3DMode, setIs3DMode] = useState(true);
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [activeLayers, setActiveLayers] = useState({
    traffic: true,
    cctv: true,
    incidents: true,
    emergency: true,
    utilities: true,
  });
  const [emergencySimActive, setEmergencySimActive] = useState(false);
  const [ambulanceProgress, setAmbulanceProgress] = useState(0.15); // 0 to 1 along the path
  const [radarAngle, setRadarAngle] = useState(0);

  // Animation frame for moving vehicles & radar sweep
  useEffect(() => {
    let animId;
    let lastTime = performance.now();

    const loop = (currentTime) => {
      const dt = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      setRadarAngle((prev) => (prev + dt * 45) % 360);

      // Animate emergency ambulance if corridor active or sim active
      if (greenCorridorActive || emergencySimActive) {
        setAmbulanceProgress((prev) => {
          const next = prev + dt * 0.12;
          return next > 1 ? 0 : next;
        });
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [greenCorridorActive, emergencySimActive]);

  const toggleLayer = (layerName) => {
    setActiveLayers((prev) => ({
      ...prev,
      [layerName]: !prev[layerName],
    }));
  };

  const handleEntityClick = (entity) => {
    setSelectedEntity(entity);
    if (onSelectEntity) {
      onSelectEntity(entity);
    }
  };

  // Road corridors configuration
  const roadCorridors = [
    {
      id: 'rd-central',
      name: 'Central Metro Expressway (Zone 1)',
      status: greenCorridorActive ? 'AI_CORRIDOR' : 'NORMAL',
      speed: '58 km/h',
      flowRate: '1,420 veh/hr',
      d: 'M 100 480 L 400 300 L 700 300 L 950 160',
      color: greenCorridorActive ? '#a855f7' : '#10b981',
      strokeWidth: 16,
    },
    {
      id: 'rd-tech',
      name: 'Cyber Innovation Arterial (Zone 2)',
      status: 'MODERATE',
      speed: '42 km/h',
      flowRate: '980 veh/hr',
      d: 'M 150 180 L 400 300 L 600 440 L 880 440',
      color: '#f59e0b',
      strokeWidth: 14,
    },
    {
      id: 'rd-harbor',
      name: 'Harbor Coastal Bridge Loop (Zone 3)',
      status: 'CONGESTED',
      speed: '18 km/h',
      flowRate: '1,890 veh/hr',
      d: 'M 650 140 L 700 300 L 600 440 L 450 560',
      color: '#ef4444',
      strokeWidth: 14,
    },
    {
      id: 'rd-ring',
      name: 'Northern Outer Ring Link (Zone 4)',
      status: 'NORMAL',
      speed: '65 km/h',
      flowRate: '750 veh/hr',
      d: 'M 150 180 L 650 140 L 950 160',
      color: '#00f0ff',
      strokeWidth: 12,
    },
  ];

  // Intersections & Traffic Signals
  const intersections = [
    {
      id: 'int-central',
      name: 'Junction 4A - Central Core',
      x: 400,
      y: 300,
      state: greenCorridorActive ? 'GREEN_PREEMPT' : 'GREEN',
      countdown: greenCorridorActive ? 'PRIORITY' : '18s',
      queue: '4 cars',
    },
    {
      id: 'int-east',
      name: 'Junction 7B - Harbor Link',
      x: 700,
      y: 300,
      state: greenCorridorActive ? 'GREEN_PREEMPT' : 'RED',
      countdown: greenCorridorActive ? 'PRIORITY' : '9s',
      queue: '14 cars',
    },
    {
      id: 'int-tech',
      name: 'Junction 2C - Tech District',
      x: 600,
      y: 440,
      state: 'YELLOW',
      countdown: '3s',
      queue: '8 cars',
    },
  ];

  // CCTV Cameras placed in 3D City
  const cctvCameras = [
    { id: 'cam-01', name: 'CAM-01 Downtown Hub', x: 380, y: 260, status: 'ONLINE', cars: 18, ptz: 'Pan 45°' },
    { id: 'cam-02', name: 'CAM-02 Harbor Approach', x: 720, y: 270, status: 'ONLINE', cars: 32, ptz: 'Static' },
    { id: 'cam-03', name: 'CAM-03 Tech Campus Gate', x: 570, y: 470, status: 'ONLINE', cars: 12, ptz: 'Tracking' },
    { id: 'cam-04', name: 'CAM-04 Ring Expressway', x: 670, y: 110, status: 'ONLINE', cars: 15, ptz: 'Static' },
  ];

  // Smart Utility Nodes
  const utilityNodes = [
    { id: 'grid-sub-01', name: 'Metro Central Substation', x: 260, y: 240, type: 'POWER', load: '78%', status: 'OPTIMAL' },
    { id: 'water-node-02', name: 'Harbor Water Filtration Plant', x: 820, y: 220, type: 'WATER', load: '64%', status: 'OPTIMAL' },
    { id: 'solar-farm-03', name: 'Sector 5 Smart Solar Array', x: 280, y: 440, type: 'SOLAR', load: '92%', status: 'OPTIMAL' },
  ];

  // Calculate ambulance position on Central Expressway path (M 100 480 -> 400 300 -> 700 300 -> 950 160)
  const getAmbulanceCoords = (p) => {
    // 3 segments
    if (p < 0.35) {
      const segP = p / 0.35;
      return {
        x: 100 + (400 - 100) * segP,
        y: 480 + (300 - 480) * segP,
        angle: -30,
      };
    } else if (p < 0.7) {
      const segP = (p - 0.35) / 0.35;
      return {
        x: 400 + (700 - 400) * segP,
        y: 300,
        angle: 0,
      };
    } else {
      const segP = (p - 0.7) / 0.3;
      return {
        x: 700 + (950 - 700) * segP,
        y: 300 + (160 - 300) * segP,
        angle: -30,
      };
    }
  };

  const ambPos = getAmbulanceCoords(ambulanceProgress);

  return (
    <div className="digital-twin-container glass-panel">
      {/* Top Command Toolbar */}
      <div className="twin-header-bar">
        <div className="twin-title-group">
          <div className="twin-badge-live">
            <span className="telemetry-dot live-pulse" />
            <span>3D DIGITAL TWIN SPATIAL MATRIX</span>
          </div>
          <h2 className="twin-title">
            Autonomous Smart City Grid
          </h2>
          <p className="twin-subtitle">
            Interactive multi-layered road telemetry, AI signal preemption & sensor digital replica
          </p>
        </div>

        {/* Toolbar controls */}
        <div className="twin-controls-group">
          {/* Layer toggles */}
          <div className="twin-layer-pills">
            <button
              type="button"
              className={`layer-pill ${activeLayers.traffic ? 'active' : ''}`}
              onClick={() => toggleLayer('traffic')}
              title="Toggle Traffic Flow Layer"
            >
              <Activity size={13} />
              <span>Traffic</span>
            </button>
            <button
              type="button"
              className={`layer-pill ${activeLayers.cctv ? 'active' : ''}`}
              onClick={() => toggleLayer('cctv')}
              title="Toggle CCTV Surveillance Layer"
            >
              <Video size={13} />
              <span>CCTV ({cctvCameras.length})</span>
            </button>
            <button
              type="button"
              className={`layer-pill ${activeLayers.incidents ? 'active' : ''}`}
              onClick={() => toggleLayer('incidents')}
              title="Toggle Incidents Layer"
            >
              <AlertTriangle size={13} />
              <span>Incidents</span>
            </button>
            <button
              type="button"
              className={`layer-pill ${activeLayers.emergency ? 'active' : ''}`}
              onClick={() => toggleLayer('emergency')}
              title="Toggle Emergency Ambulance Corridor"
            >
              <ShieldAlert size={13} />
              <span>Corridor</span>
            </button>
            <button
              type="button"
              className={`layer-pill ${activeLayers.utilities ? 'active' : ''}`}
              onClick={() => toggleLayer('utilities')}
              title="Toggle Utilities Layer"
            >
              <Zap size={13} />
              <span>Utilities</span>
            </button>
          </div>

          {/* Perspective & Zoom controls */}
          <div className="twin-view-actions">
            <button
              type="button"
              className={`btn-control-icon ${is3DMode ? 'active' : ''}`}
              onClick={() => setIs3DMode(!is3DMode)}
              title={is3DMode ? 'Switch to 2D Tactical View' : 'Switch to 3D Isometric View'}
            >
              <Layers size={14} />
              <span className="btn-label-text">{is3DMode ? '3D Iso' : '2D Top'}</span>
            </button>
            <button
              type="button"
              className="btn-control-icon"
              onClick={() => setZoom((z) => Math.min(z + 0.15, 1.8))}
              title="Zoom In"
            >
              <Plus size={14} />
            </button>
            <button
              type="button"
              className="btn-control-icon"
              onClick={() => setZoom((z) => Math.max(z - 0.15, 0.7))}
              title="Zoom Out"
            >
              <Minus size={14} />
            </button>
            <button
              type="button"
              className="btn-control-icon"
              onClick={() => setZoom(1)}
              title="Reset View"
            >
              <RotateCcw size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Interactive Map Surface */}
      <div className={`twin-viewport-frame ${is3DMode ? 'iso-3d-active' : 'top-2d-active'}`}>
        <div
          className="twin-canvas-stage"
          style={{
            transform: `scale(${zoom}) ${is3DMode ? 'rotateX(52deg) rotateZ(-28deg)' : 'rotateX(0deg) rotateZ(0deg)'}`,
            transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {/* SVG Vector World */}
          <svg
            viewBox="0 0 1100 700"
            className="twin-svg-world"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              {/* Futuristic Cyber Gradients */}
              <linearGradient id="roadGlowGreen" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#05df72" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#00f0ff" stopOpacity="0.8" />
              </linearGradient>

              <linearGradient id="roadGlowCorridor" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#a855f7" />
                <stop offset="50%" stopColor="#00f0ff" />
                <stop offset="100%" stopColor="#38bdf8" />
              </linearGradient>

              <linearGradient id="buildingRoofGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1e293b" />
                <stop offset="100%" stopColor="#0f172a" />
              </linearGradient>

              <radialGradient id="incidentPulseGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
                <stop offset="60%" stopColor="#ef4444" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
              </radialGradient>

              <radialGradient id="ambulancePulseGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.9" />
                <stop offset="50%" stopColor="#a855f7" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
              </radialGradient>

              {/* Grid pattern */}
              <pattern id="twinCyberGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(0, 240, 255, 0.08)" strokeWidth="1" />
                <circle cx="0" cy="0" r="1.5" fill="rgba(0, 240, 255, 0.2)" />
              </pattern>

              {/* Vehicle marker */}
              <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Background Holographic Grid Floor */}
            <rect width="1100" height="700" fill="url(#twinCyberGrid)" />

            {/* Radar Scan Sector */}
            <g transform="translate(550, 350)" opacity="0.35">
              <circle r="320" fill="none" stroke="rgba(0, 240, 255, 0.15)" strokeWidth="1" strokeDasharray="4 4" />
              <circle r="200" fill="none" stroke="rgba(0, 240, 255, 0.2)" strokeWidth="1" />
              <circle r="100" fill="none" stroke="rgba(0, 240, 255, 0.25)" strokeWidth="1" />
              <line
                x1="0"
                y1="0"
                x2={320 * Math.cos((radarAngle * Math.PI) / 180)}
                y2={320 * Math.sin((radarAngle * Math.PI) / 180)}
                stroke="#00f0ff"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </g>

            {/* 3D Smart City Isometric Buildings */}
            <g className="twin-buildings-layer" opacity="0.85">
              {/* Skyscraper Cluster 1 (Downtown West) */}
              <g className="building-poly" transform="translate(180, 280)">
                <polygon points="0,0 40,-20 80,0 40,20" fill="#1e293b" stroke="#00f0ff" strokeWidth="1" />
                <polygon points="0,0 40,20 40,90 0,70" fill="#0f172a" stroke="rgba(0,240,255,0.3)" strokeWidth="0.5" />
                <polygon points="80,0 40,20 40,90 80,70" fill="#090d16" stroke="rgba(0,240,255,0.3)" strokeWidth="0.5" />
                <line x1="40" y1="-20" x2="40" y2="-40" stroke="#00f0ff" strokeWidth="1.5" />
                <circle cx="40" cy="-40" r="3" fill="#ff3366" className="beacon-pulse" />
              </g>

              {/* Skyscraper Cluster 2 (Tech Tower Central) */}
              <g className="building-poly" transform="translate(480, 160)">
                <polygon points="0,0 50,-25 100,0 50,25" fill="#1e293b" stroke="#8b5cf6" strokeWidth="1" />
                <polygon points="0,0 50,25 50,120 0,95" fill="#0f172a" stroke="rgba(139,92,246,0.3)" strokeWidth="0.5" />
                <polygon points="100,0 50,25 50,120 100,95" fill="#090d16" stroke="rgba(139,92,246,0.3)" strokeWidth="0.5" />
                <line x1="50" y1="-25" x2="50" y2="-55" stroke="#a855f7" strokeWidth="1.5" />
                <circle cx="50" cy="-55" r="3.5" fill="#00f0ff" className="beacon-pulse" />
              </g>

              {/* Skyscraper Cluster 3 (Harbor Financial Tower) */}
              <g className="building-poly" transform="translate(760, 360)">
                <polygon points="0,0 45,-22 90,0 45,22" fill="#1e293b" stroke="#00f0ff" strokeWidth="1" />
                <polygon points="0,0 45,22 45,100 0,78" fill="#0f172a" stroke="rgba(0,240,255,0.3)" strokeWidth="0.5" />
                <polygon points="90,0 45,22 45,100 90,78" fill="#090d16" stroke="rgba(0,240,255,0.3)" strokeWidth="0.5" />
              </g>

              {/* Civic Center Complex */}
              <g className="building-poly" transform="translate(240, 520)">
                <polygon points="0,0 60,-30 120,0 60,30" fill="#1e293b" stroke="#10b981" strokeWidth="1" />
                <polygon points="0,0 60,30 60,70 0,40" fill="#0f172a" stroke="rgba(16,185,129,0.3)" strokeWidth="0.5" />
                <polygon points="120,0 60,30 60,70 120,40" fill="#090d16" stroke="rgba(16,185,129,0.3)" strokeWidth="0.5" />
              </g>

              {/* North Innovation Hub */}
              <g className="building-poly" transform="translate(740, 150)">
                <polygon points="0,0 35,-18 70,0 35,18" fill="#1e293b" stroke="#38bdf8" strokeWidth="1" />
                <polygon points="0,0 35,18 35,70 0,52" fill="#0f172a" />
                <polygon points="70,0 35,18 35,70 70,52" fill="#090d16" />
              </g>
            </g>

            {/* Road Network Corridors */}
            {activeLayers.traffic && (
              <g className="twin-roads-layer">
                {roadCorridors.map((road) => (
                  <g
                    key={road.id}
                    className="road-group"
                    onClick={() => handleEntityClick({ type: 'Road Corridor', ...road })}
                    style={{ cursor: 'pointer' }}
                  >
                    {/* Road Base Track */}
                    <path
                      d={road.d}
                      fill="none"
                      stroke="#0d1829"
                      strokeWidth={road.strokeWidth + 4}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    {/* Road Dynamic Flow Track */}
                    <path
                      d={road.d}
                      fill="none"
                      stroke={road.color}
                      strokeWidth={road.strokeWidth}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      opacity="0.85"
                    />

                    {/* Road Center Dashes */}
                    <path
                      d={road.d}
                      fill="none"
                      stroke="rgba(255, 255, 255, 0.4)"
                      strokeWidth="2"
                      strokeDasharray="8 12"
                      strokeLinecap="round"
                      className="road-dash-flow"
                    />

                    {/* Animated moving traffic particles along path */}
                    <path
                      d={road.d}
                      fill="none"
                      stroke="#ffffff"
                      strokeWidth="3"
                      strokeDasharray="4 60"
                      strokeLinecap="round"
                      className="traffic-particle-flow"
                      opacity="0.9"
                    />
                  </g>
                ))}
              </g>
            )}

            {/* Green Corridor Highlight Stream (when active) */}
            {activeLayers.emergency && (greenCorridorActive || emergencySimActive) && (
              <g className="emergency-corridor-stream">
                <path
                  d="M 100 480 L 400 300 L 700 300 L 950 160"
                  fill="none"
                  stroke="url(#roadGlowCorridor)"
                  strokeWidth="22"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.6"
                  className="corridor-pulse-stream"
                />
              </g>
            )}

            {/* Intersections & Smart Signals */}
            {intersections.map((int) => {
              const isGreen = int.state === 'GREEN' || int.state === 'GREEN_PREEMPT';
              const isYellow = int.state === 'YELLOW';
              const lampColor = isGreen ? '#10b981' : isYellow ? '#f59e0b' : '#ef4444';

              return (
                <g
                  key={int.id}
                  transform={`translate(${int.x}, ${int.y})`}
                  className="intersection-marker"
                  onClick={() => handleEntityClick({ type: 'Traffic Signal', ...int })}
                  style={{ cursor: 'pointer' }}
                >
                  <circle r="16" fill="#090d16" stroke={lampColor} strokeWidth="2.5" />
                  <circle r="7" fill={lampColor} filter="url(#neonGlow)" />
                  <circle r="22" fill="none" stroke={lampColor} strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />

                  {/* Junction HUD Label */}
                  <g transform="translate(0, -26)">
                    <rect x="-36" y="-12" width="72" height="18" rx="4" fill="rgba(9, 13, 22, 0.85)" stroke="rgba(0, 240, 255, 0.4)" strokeWidth="1" />
                    <text x="0" y="0" fill="#ffffff" fontSize="9" textAnchor="middle" fontWeight="bold" fontFamily="monospace">
                      {int.countdown}
                    </text>
                  </g>
                </g>
              );
            })}

            {/* CCTV Camera Towers */}
            {activeLayers.cctv &&
              cctvCameras.map((cam) => (
                <g
                  key={cam.id}
                  transform={`translate(${cam.x}, ${cam.y})`}
                  className="cctv-marker"
                  onClick={() => handleEntityClick({ type: 'CCTV Camera', ...cam })}
                  style={{ cursor: 'pointer' }}
                >
                  {/* Camera radar cone */}
                  <path
                    d="M 0 0 L -25 -40 L 25 -40 Z"
                    fill="rgba(0, 240, 255, 0.12)"
                    stroke="rgba(0, 240, 255, 0.3)"
                    strokeWidth="1"
                  />
                  <circle r="10" fill="#0f172a" stroke="#00f0ff" strokeWidth="2" />
                  <circle r="4" fill="#00f0ff" />
                  <text x="0" y="20" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="monospace">
                    {cam.id}
                  </text>
                </g>
              ))}

            {/* Smart Utility Infrastructure Nodes */}
            {activeLayers.utilities &&
              utilityNodes.map((node) => (
                <g
                  key={node.id}
                  transform={`translate(${node.x}, ${node.y})`}
                  className="utility-marker"
                  onClick={() => handleEntityClick({ type: 'Utility Node', ...node })}
                  style={{ cursor: 'pointer' }}
                >
                  <polygon points="0,-12 12,0 0,12 -12,0" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
                  <circle r="4" fill="#38bdf8" />
                  <text x="0" y="22" fill="#38bdf8" fontSize="8" textAnchor="middle" fontFamily="monospace">
                    {node.type} {node.load}
                  </text>
                </g>
              ))}

            {/* Active Accident / Incident Markers */}
            {activeLayers.incidents && (
              <g
                transform="translate(680, 240)"
                className="incident-hazard-marker"
                onClick={() =>
                  handleEntityClick({
                    type: 'Critical Incident',
                    title: 'Collision on Harbor Coastal Bridge',
                    severity: 'CRITICAL',
                    lane: 'Lanes 1 & 2 Blocked',
                    eta: 'Units Dispatched',
                  })
                }
                style={{ cursor: 'pointer' }}
              >
                {/* Shockwave Hazard Rings */}
                <circle r="36" fill="url(#incidentPulseGrad)" className="hazard-pulse-ring" />
                <circle r="20" fill="none" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4 4" className="hazard-spin-ring" />
                <circle r="12" fill="#ef4444" stroke="#ffffff" strokeWidth="2" />
                <text x="0" y="4" fill="#ffffff" fontSize="10" textAnchor="middle" fontWeight="bold">
                  !
                </text>
                {/* Impact area label */}
                <g transform="translate(0, -20)">
                  <rect x="-35" y="-10" width="70" height="15" rx="3" fill="#ef4444" />
                  <text x="0" y="1" fill="#ffffff" fontSize="8" textAnchor="middle" fontWeight="bold">
                    ACCIDENT
                  </text>
                </g>
              </g>
            )}

            {/* Animated Emergency Ambulance Vehicle */}
            {activeLayers.emergency && (
              <g
                transform={`translate(${ambPos.x}, ${ambPos.y}) rotate(${ambPos.angle})`}
                className="ambulance-unit-marker"
                onClick={() =>
                  handleEntityClick({
                    type: 'Emergency Vehicle',
                    name: 'Ambulance AMB-104 (Trauma Dispatch)',
                    speed: '82 km/h',
                    eta: '3.5 mins to General Hospital',
                    corridor: greenCorridorActive || emergencySimActive ? 'ACTIVE' : 'STANDBY',
                  })
                }
                style={{ cursor: 'pointer' }}
              >
                {/* Siren Wave Aura */}
                <circle r="26" fill="url(#ambulancePulseGrad)" className="siren-pulse-wave" />

                {/* Ambulance Body */}
                <rect x="-14" y="-8" width="28" height="16" rx="4" fill="#ffffff" stroke="#00f0ff" strokeWidth="2" />
                <rect x="-12" y="-3" width="24" height="6" fill="#ef4444" />
                {/* Cross symbol */}
                <path d="M 0 -5 L 0 5 M -5 0 L 5 0" stroke="#ffffff" strokeWidth="2" />

                {/* Flashing Lightbars */}
                <circle cx="-10" cy="-6" r="3" fill="#00f0ff" className="lightbar-flash-blue" />
                <circle cx="-10" cy="6" r="3" fill="#ef4444" className="lightbar-flash-red" />
              </g>
            )}
          </svg>
        </div>

        {/* Floating City Telemetry Overlay HUD */}
        <div className="twin-hud-overlay">
          <div className="twin-hud-badge">
            <Radio size={13} className="hud-icon-spin text-cyan" />
            <span className="hud-text-bold">TWIN MATRIX ACTIVE</span>
            <span className="hud-divider">|</span>
            <span className="hud-sub">AI Neural Sync: 99.8%</span>
          </div>

          <div className="twin-hud-actions">
            <button
              type="button"
              className={`btn-hud-emergency ${greenCorridorActive || emergencySimActive ? 'active' : ''}`}
              onClick={() => {
                if (onActivateGreenCorridor) {
                  onActivateGreenCorridor();
                } else {
                  setEmergencySimActive(!emergencySimActive);
                }
              }}
            >
              <ShieldAlert size={14} />
              <span>
                {greenCorridorActive || emergencySimActive
                  ? 'Green Corridor Engaged (ALL GREEN)'
                  : 'Simulate Green Corridor Preemption'}
              </span>
            </button>
          </div>
        </div>

        {/* Selected Entity Inspector Card */}
        {selectedEntity && (
          <div className="twin-inspector-card glass-panel animate-fade-in">
            <div className="inspector-header">
              <div className="inspector-badge-type">
                <StatusBadge status={selectedEntity.status || 'ACTIVE'} size="sm" />
                <span className="inspector-type">{selectedEntity.type}</span>
              </div>
              <button
                type="button"
                className="btn-inspector-close"
                onClick={() => setSelectedEntity(null)}
              >
                ✕
              </button>
            </div>
            <h4 className="inspector-title">{selectedEntity.name || selectedEntity.title || selectedEntity.id}</h4>
            
            <div className="inspector-details-grid">
              {selectedEntity.speed && (
                <div className="inspector-stat">
                  <span className="stat-label">Avg Velocity</span>
                  <span className="stat-val text-cyan">{selectedEntity.speed}</span>
                </div>
              )}
              {selectedEntity.flowRate && (
                <div className="inspector-stat">
                  <span className="stat-label">Throughput</span>
                  <span className="stat-val">{selectedEntity.flowRate}</span>
                </div>
              )}
              {selectedEntity.queue && (
                <div className="inspector-stat">
                  <span className="stat-label">Queue Length</span>
                  <span className="stat-val text-amber">{selectedEntity.queue}</span>
                </div>
              )}
              {selectedEntity.cars !== undefined && (
                <div className="inspector-stat">
                  <span className="stat-label">Detected Vehicles</span>
                  <span className="stat-val text-emerald">{selectedEntity.cars}</span>
                </div>
              )}
              {selectedEntity.load && (
                <div className="inspector-stat">
                  <span className="stat-label">Current Load</span>
                  <span className="stat-val text-cyan">{selectedEntity.load}</span>
                </div>
              )}
              {selectedEntity.eta && (
                <div className="inspector-stat">
                  <span className="stat-label">Response ETA</span>
                  <span className="stat-val text-purple">{selectedEntity.eta}</span>
                </div>
              )}
            </div>

            <div className="inspector-actions">
              <button
                type="button"
                className="btn-inspector-action btn-primary"
                onClick={() => {
                  alert(`Telemetry feed for ${selectedEntity.name || selectedEntity.id} opened in deep inspector.`);
                }}
              >
                Open Sensor Feed
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DigitalTwinCity;
