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

      {/* 5. METROMIND SPLIT COMPOSITION: 3D SMART CITY ILLUSTRATION + LIQUID-GLASS LOGIN */}
      <div className={`login-split-container ${isSettled ? 'card-settled' : isRevealing ? 'card-revealing' : isDissolving ? 'card-emerging' : 'card-dormant'}`}>
        {/* LEFT / CENTER SHOWCASE: 3D SMART CITY INFRASTRUCTURE & THREE ROLES */}
        <div className="login-visual-showcase">
          <div className="visual-ambient-backdrop" aria-hidden="true" />
          <div className="visual-image-frame">
            <img
              src={process.env.PUBLIC_URL ? `${process.env.PUBLIC_URL}/ln_image.png` : '/ln_image.png'}
              alt="MetroMind Smart City Infrastructure - Field Supervisor, Traffic Controller, Utility Manager"
              className="smart-city-3d-image"
              loading="eager"
            />
          </div>
        </div>

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