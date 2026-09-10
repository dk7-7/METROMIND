import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { login, clearError } from '../../store/slices/authSlice';

/**
 * Smart City Connected Network Canvas
 * Renders subtle glowing data/network lines communicating smart traffic management,
 * connected urban infrastructure, and real-time city telemetry.
 */
const SmartCityNetworkCanvas = ({ opacity = 1 }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // City infrastructure nodes (geometric arterial points)
    const nodeCount = Math.min(24, Math.floor(width / 60));
    const nodes = Array.from({ length: nodeCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height * 0.85 + height * 0.1,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.25,
      radius: Math.random() * 2 + 1.5,
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: 0.02 + Math.random() * 0.02,
    }));

    // Data packets traveling along network lines
    const packets = Array.from({ length: 12 }, () => ({
      fromIndex: Math.floor(Math.random() * nodeCount),
      toIndex: Math.floor(Math.random() * nodeCount),
      progress: Math.random(),
      speed: 0.004 + Math.random() * 0.006,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Update and draw nodes
      nodes.forEach((node) => {
        node.x += node.vx;
        node.y += node.vy;
        node.pulse += node.pulseSpeed;

        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;

        const pulseScale = 1 + Math.sin(node.pulse) * 0.3;

        // Outer glow
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius * pulseScale * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 240, 255, 0.12)';
        ctx.fill();

        // Node core
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius * pulseScale, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(56, 189, 248, 0.75)';
        ctx.shadowColor = '#00f0ff';
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Draw subtle interconnected network lines
      const maxDistance = 220;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const lineOpacity = (1 - dist / maxDistance) * 0.22;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(0, 240, 255, ${lineOpacity})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      // Draw flowing data packets
      packets.forEach((pkt) => {
        pkt.progress += pkt.speed;
        if (pkt.progress >= 1) {
          pkt.progress = 0;
          pkt.fromIndex = Math.floor(Math.random() * nodeCount);
          pkt.toIndex = Math.floor(Math.random() * nodeCount);
        }

        const from = nodes[pkt.fromIndex];
        const to = nodes[pkt.toIndex];
        if (from && to) {
          const curX = from.x + (to.x - from.x) * pkt.progress;
          const curY = from.y + (to.y - from.y) * pkt.progress;

          ctx.beginPath();
          ctx.arc(curX, curY, 2, 0, Math.PI * 2);
          ctx.fillStyle = '#00f0ff';
          ctx.shadowColor = '#00f0ff';
          ctx.shadowBlur = 10;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="smart-city-network-canvas"
      style={{ opacity, transition: 'opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1)' }}
      aria-hidden="true"
    />
  );
};

const ROLE_SYSTEMS = [
  {
    id: 'CITY_ADMINISTRATOR',
    title: 'City Administrator',
    badge: 'CENTRAL COMMAND',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21h18M3 7v14M21 7v14M6 7V3h12v4M9 11h2v2H9zm0 4h2v2H9zm4-4h2v2h-2zm0 4h2v2h-2z"/>
      </svg>
    ),
    headline: 'Unified Municipal Intelligence',
    description: 'Enterprise overview of all municipal infrastructure sectors, official registry synchronization, and emergency alert broadcasts.',
    metrics: [
      { label: 'System Uptime', value: '99.98%', tag: 'OPTIMAL' },
      { label: 'Active Sectors', value: '16 / 16', tag: 'SYNCED' },
      { label: 'Resolution Rate', value: '96.4%', tag: '+4.2%' },
    ],
    telemetryCode: 'SECTOR-00 // COMMAND OVERVIEW',
  },
  {
    id: 'TRAFFIC_CONTROLLER',
    title: 'Traffic Controller',
    badge: 'ARTERIAL FLOW',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="6" y="2" width="12" height="20" rx="3" />
        <circle cx="12" cy="6" r="2" />
        <circle cx="12" cy="12" r="2" />
        <circle cx="12" cy="18" r="2" />
      </svg>
    ),
    headline: 'Real-Time Traffic & Incident Control',
    description: 'Autonomous congestion balancing, adaptive signal timing, incident triage, and dynamic smart-corridor rerouting.',
    metrics: [
      { label: 'Flow Efficiency', value: '98.2%', tag: 'SMOOTH' },
      { label: 'Active Zones', value: '24 Zones', tag: 'MONITORED' },
      { label: 'Signal Sync', value: '100%', tag: '12ms PING' },
    ],
    telemetryCode: 'TRAFFIC-SYS // SMART SIGNALS',
  },
  {
    id: 'UTILITY_SUPERVISOR',
    title: 'Utility Supervisor',
    badge: 'POWER & GRIDS',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
      </svg>
    ),
    headline: 'Substation Grids & Outage Mitigation',
    description: 'Smart grid load balancing, automated feeder switches, voltage anomaly alerts, and rapid utility restoration pipelines.',
    metrics: [
      { label: 'Grid Voltage', value: '110 kV', tag: 'NORMAL' },
      { label: 'Active Outages', value: '0 Critical', tag: 'RESOLVED' },
      { label: 'Renewable Feed', value: '44.6%', tag: '+9.2%' },
    ],
    telemetryCode: 'POWER-GRID // SUBSTATION RELAY',
  },
  {
    id: 'FIELD_TECHNICIAN',
    title: 'Field Technician',
    badge: 'RAPID RESPONSE',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="22" y1="12" x2="18" y2="12" />
        <line x1="6" y1="12" x2="2" y2="12" />
        <line x1="12" y1="6" x2="12" y2="2" />
        <line x1="12" y1="22" x2="12" y2="18" />
      </svg>
    ),
    headline: 'Field Telemetry & Asset Observations',
    description: 'Geo-tagged field observation logs, IoT sensor diagnostics, on-site hazard verification, and rapid technician dispatch.',
    metrics: [
      { label: 'Field Units', value: '18 Active', tag: 'DEPLOYED' },
      { label: 'Sensor Pings', value: '1,850/s', tag: 'LIVE STREAM' },
      { label: 'Dispatch Latency', value: '3.8 min', tag: '-1.8m' },
    ],
    telemetryCode: 'FIELD-OPS // SENSOR MATRIX',
  },
];

const TELEMETRY_TICKER_ITEMS = [
  { time: '00:44:18', type: 'TRAFFIC', message: 'Adaptive signal cycle synchronized on Downtown Arterial (Zone 04)' },
  { time: '00:44:12', type: 'GRID', message: 'Substation East feeder #3 voltage stabilized at 110kV nominal' },
  { time: '00:44:05', type: 'FIELD', message: 'Technician Unit #12 completed observation report for Sector 07' },
  { time: '00:43:58', type: 'ALERT', message: 'Municipal perimeter telemetry audit completed with zero anomalies' },
];

/**
 * Smart City Command Showcase
 * Bespoke dynamic municipal intelligence showcase reflecting MetroMind's core systems,
 * live telemetry cards, interactive role switches, and holographic topology radar.
 */
const SmartCityCommandShowcase = () => {
  const [selectedRoleIndex, setSelectedRoleIndex] = useState(0);
  const [tickerIndex, setTickerIndex] = useState(0);

  // Auto-cycle ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % TELEMETRY_TICKER_ITEMS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const activeRole = ROLE_SYSTEMS[selectedRoleIndex];
  const currentTicker = TELEMETRY_TICKER_ITEMS[tickerIndex];

  return (
    <div className="smart-city-command-showcase">
      {/* Ambient Cybernetic Glow Backdrop */}
      <div className="showcase-ambient-glow" aria-hidden="true" />

      {/* 1. Header & Live Platform Status */}
      <div className="showcase-header">
        <div className="showcase-brand-tag">
          <span className="live-radar-ping" />
          <span className="brand-tag-text">METROMIND // COMMAND MATRIX</span>
          <span className="tag-divider">•</span>
          <span className="tag-version">OS v4.2</span>
        </div>
        <h1 className="showcase-main-title">
          Intelligent Municipal Infrastructure Command
        </h1>
        <p className="showcase-lead-text">
          Real-time urban traffic orchestration, smart utility grid balancing, and field asset telemetry unified in a single high-security command center.
        </p>
      </div>

      {/* 2. Interactive Role System Selector */}
      <div className="role-switch-container">
        <div className="role-switch-label">
          <span>OPERATIONAL SECTORS:</span>
        </div>
        <div className="role-pills-row" role="tablist">
          {ROLE_SYSTEMS.map((role, idx) => (
            <button
              key={role.id}
              type="button"
              role="tab"
              aria-selected={selectedRoleIndex === idx}
              className={`role-tab-pill ${selectedRoleIndex === idx ? 'pill-active' : ''}`}
              onClick={() => setSelectedRoleIndex(idx)}
            >
              <span className="pill-icon">{role.icon}</span>
              <span className="pill-text">{role.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Active Sector Telemetry Display Panel */}
      <div className="sector-telemetry-panel">
        <div className="telemetry-panel-header">
          <div className="telemetry-title-group">
            <span className="telemetry-badge">{activeRole.badge}</span>
            <h3 className="telemetry-headline">{activeRole.headline}</h3>
          </div>
          <span className="telemetry-code font-mono">{activeRole.telemetryCode}</span>
        </div>

        <p className="telemetry-description">{activeRole.description}</p>

        {/* Live Metrics Grid */}
        <div className="telemetry-metrics-grid">
          {activeRole.metrics.map((m, i) => (
            <div key={i} className="telemetry-metric-card">
              <span className="metric-label">{m.label}</span>
              <span className="metric-value font-mono">{m.value}</span>
              <span className="metric-tag">{m.tag}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Live Holographic City Topology Vector Radar */}
      <div className="holographic-topology-card">
        <div className="topology-header">
          <div className="topology-indicator">
            <span className="topology-pulse" />
            <span>MUNICIPAL SENSOR TOPOLOGY</span>
          </div>
          <span className="topology-coordinates font-mono">LAT: 40.7128° N | LON: 74.0060° W</span>
        </div>

        <div className="topology-vector-wrapper" aria-hidden="true">
          <svg className="topology-svg" viewBox="0 0 500 130" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Grid Arteries */}
            <line x1="40" y1="65" x2="160" y2="35" stroke="rgba(0, 240, 255, 0.25)" strokeWidth="1.5" strokeDasharray="4 4" />
            <line x1="160" y1="35" x2="300" y2="85" stroke="rgba(56, 189, 248, 0.35)" strokeWidth="1.5" />
            <line x1="300" y1="85" x2="440" y2="45" stroke="rgba(0, 240, 255, 0.25)" strokeWidth="1.5" strokeDasharray="4 4" />
            <line x1="160" y1="35" x2="250" y2="30" stroke="rgba(99, 102, 241, 0.3)" strokeWidth="1" />
            <line x1="250" y1="30" x2="440" y2="45" stroke="rgba(99, 102, 241, 0.3)" strokeWidth="1" />
            <line x1="40" y1="65" x2="300" y2="85" stroke="rgba(0, 240, 255, 0.15)" strokeWidth="1" />

            {/* Pulsing Data Packets */}
            <circle cx="210" cy="52" r="3" fill="#00f0ff">
              <animate attributeName="cx" values="160;300;160" dur="4s" repeatCount="indefinite" />
              <animate attributeName="cy" values="35;85;35" dur="4s" repeatCount="indefinite" />
            </circle>
            <circle cx="360" cy="62" r="3" fill="#38bdf8">
              <animate attributeName="cx" values="300;440;300" dur="3.5s" repeatCount="indefinite" />
              <animate attributeName="cy" values="85;45;85" dur="3.5s" repeatCount="indefinite" />
            </circle>

            {/* Topology Nodes */}
            {/* Node 1: West Corridor */}
            <g transform="translate(40, 65)">
              <circle r="12" fill="rgba(0, 240, 255, 0.1)" stroke="rgba(0, 240, 255, 0.4)" strokeWidth="1" />
              <circle r="4" fill="#00f0ff" />
              <text x="0" y="24" textAnchor="middle" fill="#94a3b8" fontSize="9" fontFamily="JetBrains Mono">West Corridor</text>
            </g>

            {/* Node 2: Substation Relay */}
            <g transform="translate(160, 35)">
              <circle r="14" fill="rgba(99, 102, 241, 0.15)" stroke="rgba(99, 102, 241, 0.5)" strokeWidth="1" />
              <circle r="5" fill="#6366f1" />
              <text x="0" y="-18" textAnchor="middle" fill="#94a3b8" fontSize="9" fontFamily="JetBrains Mono">Grid Substation</text>
            </g>

            {/* Node 3: Civic Command Hub */}
            <g transform="translate(250, 30)">
              <circle r="10" fill="rgba(56, 189, 248, 0.1)" stroke="rgba(56, 189, 248, 0.3)" strokeWidth="1" />
              <circle r="3.5" fill="#38bdf8" />
              <text x="0" y="-14" textAnchor="middle" fill="#64748b" fontSize="8" fontFamily="JetBrains Mono">Civic Hub</text>
            </g>

            {/* Node 4: Downtown Transit Matrix */}
            <g transform="translate(300, 85)">
              <circle r="16" fill="rgba(0, 240, 255, 0.2)" stroke="#00f0ff" strokeWidth="1.5" />
              <circle r="6" fill="#00f0ff" />
              <text x="0" y="26" textAnchor="middle" fill="#f8fafc" fontSize="10" fontWeight="bold" fontFamily="Orbitron">Downtown Core</text>
            </g>

            {/* Node 5: North Sensor Grid */}
            <g transform="translate(440, 45)">
              <circle r="12" fill="rgba(56, 189, 248, 0.1)" stroke="rgba(56, 189, 248, 0.4)" strokeWidth="1" />
              <circle r="4" fill="#38bdf8" />
              <text x="0" y="24" textAnchor="middle" fill="#94a3b8" fontSize="9" fontFamily="JetBrains Mono">North Grid</text>
            </g>
          </svg>
        </div>
      </div>

      {/* 5. Live Telemetry Activity Ticker */}
      <div className="showcase-live-ticker">
        <div className="ticker-badge">
          <span className="ticker-dot" />
          <span>LIVE EVENT STREAM</span>
        </div>
        <div className="ticker-content" key={tickerIndex}>
          <span className="ticker-timestamp font-mono">{currentTicker.time}</span>
          <span className={`ticker-type-pill type-${currentTicker.type.toLowerCase()}`}>
            {currentTicker.type}
          </span>
          <span className="ticker-message">{currentTicker.message}</span>
        </div>
      </div>
    </div>
  );
};

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Intro Sequence Timeline State Machine
  // Phase 0: 'video' (0.0s - 2.5s) - Full cinematic city video & smart network telemetry
  // Phase 1: 'dissolve' (2.5s - 3.5s) - Smooth cross-dissolve, darkening, softening blur
  // Phase 2: 'reveal' (3.0s - 5.0s) - Liquid glass login card surfaces seamlessly
  // Phase 3: 'settled' (>5.0s) - 100% stable, fully interactable login page
  const [introPhase, setIntroPhase] = useState('video');
  const [syncProgress, setSyncProgress] = useState(14);
  const [isIntroComplete, setIsIntroComplete] = useState(false);

  const videoRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, isAuthenticated, loading, error } = useSelector(
    (state) => state.auth
  );

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      setIntroPhase('settled');
      setIsIntroComplete(true);
    }
  }, []);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated || user) {
      navigate('/');
    }
  }, [isAuthenticated, user, navigate]);

  // Clear authentication error on unmount
  useEffect(() => {
    return () => {
      if (error) {
        dispatch(clearError());
      }
    };
  }, [dispatch, error]);

  // Master Cinematic Intro Timeline Engine (3.0–5.0 seconds)
  useEffect(() => {
    if (isIntroComplete) {
      setIntroPhase('settled');
      return;
    }

    let startTime = null;
    let animationId = null;

    const runTimeline = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = (timestamp - startTime) / 1000; // in seconds

      // Sync progress telemetry counter
      if (elapsed < 2.5) {
        const p = Math.min(94, Math.floor(14 + (elapsed / 2.5) * 80));
        setSyncProgress(p);
      } else {
        setSyncProgress(100);
      }

      // Phase transitions
      if (elapsed < 2.5) {
        setIntroPhase('video');
      } else if (elapsed >= 2.5 && elapsed < 3.2) {
        setIntroPhase('dissolve');
      } else if (elapsed >= 3.2 && elapsed < 4.8) {
        setIntroPhase('reveal');
      } else {
        setIntroPhase('settled');
        setIsIntroComplete(true);
        return; // End animation loop
      }

      animationId = requestAnimationFrame(runTimeline);
    };

    animationId = requestAnimationFrame(runTimeline);

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [isIntroComplete]);

  // Video Autoplay policy handling & sync
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.defaultMuted = true;
      video.muted = true;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Gracefully fallback if autoplay restricted
        });
      }
    }
  }, [introPhase]);

  // Skip Intro Handler (instant transition to 100% stable state)
  const handleSkipIntro = useCallback(() => {
    setIntroPhase('settled');
    setIsIntroComplete(true);
  }, []);

  // Keyboard shortcut listener (Escape or Space to skip)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isIntroComplete && (e.key === 'Escape' || e.key === ' ')) {
        handleSkipIntro();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isIntroComplete, handleSkipIntro]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (error) {
      dispatch(clearError());
    }
    dispatch(login({ username, password }));
  };

  // Compute classes based on current timeline phase
  const isVideoPhase = introPhase === 'video';
  const isDissolving = introPhase === 'dissolve';
  const isRevealing = introPhase === 'reveal';
  const isSettled = introPhase === 'settled';

  const videoSrc = process.env.PUBLIC_URL
    ? `${process.env.PUBLIC_URL}/before_login.mp4`
    : '/before_login.mp4';

  return (
    <div className={`cinematic-intro-wrapper ${isSettled ? 'intro-settled' : 'intro-active'}`}>
      {/* 1. CINEMATIC SMART CITY VIDEO LAYER (Elevated road network & forward camera drift) */}
      <div className={`cinematic-video-viewport phase-${introPhase}`} aria-hidden="true">
        <video
          ref={videoRef}
          className="cinematic-city-video"
          src={videoSrc}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
          tabIndex={-1}
        >
          <source src={videoSrc} type="video/mp4" />
          <source src="/before_login.mp4" type="video/mp4" />
        </video>

        {/* 2. SUBTLE GLOWING DATA / NETWORK LINES CANVAS (Traffic & Connected Infrastructure) */}
        <SmartCityNetworkCanvas opacity={isVideoPhase ? 0.85 : isDissolving ? 0.35 : 0.08} />

        {/* 3. ATMOSPHERIC DARKENING VEIL & SOFT BLOOM (Smooth Cross-Dissolve Transition) */}
        <div className={`cinematic-darkening-veil phase-${introPhase}`} />
        <div className={`cinematic-bloom-flare phase-${introPhase}`} />
        <div className="cinematic-grid-overlay" />
      </div>

      {/* 4. SMART CITY COMMAND TELEMETRY HUD (Active during 0.0s–2.5s) */}
      <div className={`intro-telemetry-hud ${isVideoPhase ? 'hud-visible' : 'hud-fading'}`}>
        <div className="hud-top-bar">
          <div className="hud-brand-pill">
            <span className="hud-pulse-dot" />
            <span className="hud-brand-label">METROMIND // MUNICIPAL INTELLIGENCE OS v4.2</span>
          </div>
          <div className="hud-meta-group">
            <span className="hud-meta-tag">SECTOR 07 • DOWNTOWN ARTERIAL</span>
            <span className="hud-meta-divider">|</span>
            <span className="hud-meta-tag">FEED: 60 FPS 4K</span>
          </div>
        </div>

        <div className="hud-bottom-bar">
          <div className="hud-telemetry-status">
            <span className="hud-telemetry-icon">⚡</span>
            <div className="hud-telemetry-text">
              <span className="hud-status-title">
                {isVideoPhase
                  ? 'SYNCHRONIZING URBAN INFRASTRUCTURE TELEMETRY...'
                  : 'ESTABLISHING SECURE COMMAND INTERFACE...'}
              </span>
              <div className="hud-progress-track">
                <div
                  className="hud-progress-fill"
                  style={{ width: `${syncProgress}%` }}
                />
              </div>
            </div>
            <span className="hud-progress-number">{syncProgress}%</span>
          </div>
          <div className="hud-coords-badge">
            <span>GRID: 40.7128° N, 74.0060° W</span>
            <span className="hud-coords-sub">TLS 1.3 SECURE LINK</span>
          </div>
        </div>
      </div>

      {/* SKIP INTRO BUTTON (Discreet & Accessible) */}
      {!isSettled && (
        <button
          type="button"
          className="intro-skip-btn"
          onClick={handleSkipIntro}
          aria-label="Skip cinematic introduction"
          title="Press Esc or Space to skip"
        >
          <span>Skip Intro</span>
          <span className="skip-arrow" aria-hidden="true">➔</span>
        </button>
      )}

      {/* 5. METROMIND SPLIT COMPOSITION: SMART CITY COMMAND SHOWCASE + LIQUID-GLASS LOGIN */}
      <div className={`login-split-container ${isSettled ? 'card-settled' : isRevealing ? 'card-revealing' : isDissolving ? 'card-emerging' : 'card-dormant'}`}>
        {/* LEFT / CENTER SHOWCASE: DYNAMIC SMART CITY COMMAND MATRIX */}
        <SmartCityCommandShowcase />

        {/* RIGHT PANEL: REFINED FROSTED-GLASS LOGIN FORM */}
        <div className="login-panel-section">
          <div className="auth-container login-card liquid-glass-panel">
            {/* Ambient Glass Highlight Line */}
            <div className="glass-specular-glow" aria-hidden="true" />

            {/* Header & Branding */}
            <div className="auth-header">
              <div className="login-brand-icon-wrapper">
                <div className="brand-icon-glow" />
                <div className="brand-icon-inner">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#00f0ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 17L12 22L22 17" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 12L12 17L22 12" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              <h2 className="auth-title">MetroMind</h2>
              <p className="auth-subtitle">Command Center Gateway</p>

              <div className="login-telemetry-badge">
                <span className="status-live-beacon" />
                <span className="status-badge-text">MUNICIPAL NETWORK ACTIVE</span>
              </div>
            </div>

            {/* Authentication Error Feedback */}
            {error && (
              <div className="error-alert login-error-banner" role="alert">
                <span className="alert-icon" aria-hidden="true">⚠️</span>
                <span className="alert-text">
                  {typeof error === 'string' ? error : error?.message || 'Authentication failed. Please verify credentials.'}
                </span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="login-form-container" noValidate>
              <div className="form-group">
                <label htmlFor="username">
                  <span className="label-text">Username</span>
                  <span className="label-tag">OPERATOR ID</span>
                </label>
                <div className="input-field-wrapper">
                  <span className="input-icon" aria-hidden="true">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </span>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="Enter username / operator handle"
                    value={username}
                    onChange={(e) => {
                      if (error) dispatch(clearError());
                      setUsername(e.target.value);
                    }}
                    autoComplete="username"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="password">
                  <span className="label-text">Password</span>
                  <span className="label-tag">SECURITY KEY</span>
                </label>
                <div className="input-field-wrapper">
                  <span className="input-icon" aria-hidden="true">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                  </span>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter secure password"
                    value={password}
                    onChange={(e) => {
                      if (error) dispatch(clearError());
                      setPassword(e.target.value);
                    }}
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    tabIndex={0}
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="btn-submit login-submit-btn"
                disabled={loading}
              >
                <span className="btn-glow-layer" aria-hidden="true" />
                <span className="btn-content-flex">
                  {loading ? (
                    <>
                      <span className="btn-spinner" aria-hidden="true" />
                      <span>AUTHENTICATING CREDENTIALS...</span>
                    </>
                  ) : (
                    <>
                      <span>AUTHENTICATE & ACCESS</span>
                      <span className="btn-arrow" aria-hidden="true">➔</span>
                    </>
                  )}
                </span>
              </button>
            </form>

            {/* Footer & Registration Navigation */}
            <div className="auth-footer login-footer-meta">
              <div className="auth-footer-nav">
                <span className="footer-prompt">Need an account? </span>
                <Link to="/register" className="register-link">
                  Register Personnel
                </Link>
              </div>
            </div>

            {/* Bottom Security Compliance Stamp */}
            <div className="login-security-stamp">
              <span className="stamp-icon" aria-hidden="true">🔒</span>
              <span>ENCRYPTED TLS 1.3 • SMART-GRID PROTOCOL VERIFIED</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;