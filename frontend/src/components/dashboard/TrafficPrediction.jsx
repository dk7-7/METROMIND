import React, { useState, useEffect } from 'react';
import {
  Cpu,
  TrendingUp,
  TrendingDown,
  Navigation,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Clock,
  CheckCircle2,
  Sliders
} from 'lucide-react';
import AnimatedCounter from '../common/AnimatedCounter';

const TrafficPrediction = () => {
  const [activeZone, setActiveZone] = useState('zone-1');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationApplied, setOptimizationApplied] = useState(false);

  const zonePredictions = {
    'zone-1': {
      name: 'Sector 1: Downtown Central Corridor',
      currentCongestion: 42,
      predictedCongestion: 78,
      predictedDelay: '+16 mins at peak (09:45 AM)',
      confidence: 96.8,
      status: 'HEAVY_SURGE_ANTICIPATED',
      currentRoute: 'Main Expressway (4.2 km - 26 min)',
      recommendedRoute: 'Outer Ring Bypass via Cyber Overpass (5.8 km - 14 min)',
      timeSaved: '12 min saved (-46% delay)',
      aiAction: 'Preemptive green signal phase extension (+12s) deployed at Junction 4A.',
    },
    'zone-2': {
      name: 'Sector 2: Tech Park Innovation Expressway',
      currentCongestion: 28,
      predictedCongestion: 35,
      predictedDelay: '+4 mins (Normal flow)',
      confidence: 98.2,
      status: 'STABLE_FLOW',
      currentRoute: 'Innovation Boulevard (3.1 km - 8 min)',
      recommendedRoute: 'Direct Corridor Active',
      timeSaved: 'Optimal Route Active',
      aiAction: 'Standard adaptive loop control active.',
    },
    'zone-3': {
      name: 'Sector 3: Coastal Harbor Arterial Bridge',
      currentCongestion: 68,
      predictedCongestion: 84,
      predictedDelay: '+24 mins (Severe bottleneck)',
      confidence: 94.5,
      status: 'CRITICAL_CONGESTION_RISK',
      currentRoute: 'Coastal Bridge Crossing (2.8 km - 34 min)',
      recommendedRoute: 'North Terminal Tunnel Link (4.6 km - 18 min)',
      timeSaved: '16 min saved (-47% delay)',
      aiAction: 'Automated digital signage rerouting advisory engaged.',
    },
  };

  const currentData = zonePredictions[activeZone] || zonePredictions['zone-1'];

  const handleApplyOptimization = () => {
    setIsOptimizing(true);
    setTimeout(() => {
      setIsOptimizing(false);
      setOptimizationApplied(true);
      setTimeout(() => setOptimizationApplied(false), 5000);
    }, 1200);
  };

  return (
    <div className="traffic-prediction-container glass-panel">
      {/* Header */}
      <div className="prediction-header">
        <div className="prediction-title-group">
          <div className="prediction-badge">
            <Cpu size={14} className="hud-icon-spin text-purple" />
            <span>NEURAL MOBILITY FORECASTER</span>
          </div>
          <h3 className="prediction-title">
            AI Traffic Flow & Predictive Bottleneck Engine
          </h3>
          <p className="prediction-subtitle">
            Deep-learning temporal convolution models forecasting 15-to-60 minute congestion shifts
          </p>
        </div>

        {/* Sector selector */}
        <div className="prediction-zone-selector">
          <button
            type="button"
            className={`zone-pill ${activeZone === 'zone-1' ? 'active' : ''}`}
            onClick={() => setActiveZone('zone-1')}
          >
            Downtown Sector 1
          </button>
          <button
            type="button"
            className={`zone-pill ${activeZone === 'zone-2' ? 'active' : ''}`}
            onClick={() => setActiveZone('zone-2')}
          >
            Tech Park Sector 2
          </button>
          <button
            type="button"
            className={`zone-pill ${activeZone === 'zone-3' ? 'active' : ''}`}
            onClick={() => setActiveZone('zone-3')}
          >
            Harbor Sector 3
          </button>
        </div>
      </div>

      {/* 4-Step AI Prediction Visual Pipeline */}
      <div className="prediction-pipeline-grid">
        {/* Step 1: Current Traffic */}
        <div className="pipeline-step-card step-current">
          <div className="step-header">
            <span className="step-tag">STEP 01</span>
            <span className="step-label">Current Telemetry</span>
          </div>
          <div className="step-metric-box">
            <div className="metric-number text-cyan">
              <AnimatedCounter value={currentData.currentCongestion} suffix="%" />
            </div>
            <span className="metric-caption">Live Congestion Density</span>
          </div>
          <div className="step-bar-wrap">
            <div
              className="step-bar-fill fill-cyan"
              style={{ width: `${currentData.currentCongestion}%` }}
            />
          </div>
          <p className="step-meta">Measured across 24 inductive sensors</p>
        </div>

        {/* Step 2: AI Neural Analysis */}
        <div className="pipeline-step-card step-ai">
          <div className="step-header">
            <span className="step-tag tag-purple">STEP 02</span>
            <span className="step-label">AI Neural Analysis</span>
          </div>
          <div className="step-metric-box">
            <div className="metric-number text-purple">
              <AnimatedCounter value={currentData.confidence} decimals={1} suffix="%" />
            </div>
            <span className="metric-caption">Prediction Confidence</span>
          </div>
          <div className="ai-scanning-waveform">
            <div className="wave-bar w-1" />
            <div className="wave-bar w-2" />
            <div className="wave-bar w-3" />
            <div className="wave-bar w-4" />
            <div className="wave-bar w-5" />
            <div className="wave-bar w-6" />
          </div>
          <p className="step-meta">Trained on 4.2M historical commute patterns</p>
        </div>

        {/* Step 3: 15-Minute Forecast */}
        <div className="pipeline-step-card step-predicted">
          <div className="step-header">
            <span className="step-tag tag-amber">STEP 03</span>
            <span className="step-label">15-Min Surge Forecast</span>
          </div>
          <div className="step-metric-box">
            <div className={`metric-number ${currentData.predictedCongestion > 60 ? 'text-crimson' : 'text-amber'}`}>
              <AnimatedCounter value={currentData.predictedCongestion} suffix="%" />
            </div>
            <span className="metric-caption">{currentData.predictedDelay}</span>
          </div>
          <div className="step-bar-wrap">
            <div
              className={`step-bar-fill ${currentData.predictedCongestion > 60 ? 'fill-crimson' : 'fill-amber'}`}
              style={{ width: `${currentData.predictedCongestion}%` }}
            />
          </div>
          <p className="step-meta text-amber">
            Trend: {currentData.predictedCongestion > currentData.currentCongestion ? '▲ +36% Surge Ahead' : '▼ Steady'}
          </p>
        </div>

        {/* Step 4: AI Recommended Route */}
        <div className="pipeline-step-card step-recommendation">
          <div className="step-header">
            <span className="step-tag tag-emerald">STEP 04</span>
            <span className="step-label">AI Optimized Route</span>
          </div>
          <div className="step-metric-box">
            <div className="metric-badge-saved text-emerald">
              <ShieldCheck size={18} />
              <span>{currentData.timeSaved}</span>
            </div>
            <span className="metric-caption">Dynamic Reroute Active</span>
          </div>
          <div className="route-diff-box">
            <div className="route-row standard">
              <span className="route-tag">Congested:</span>
              <span className="route-name">{currentData.currentRoute}</span>
            </div>
            <div className="route-row ai-opt">
              <span className="route-tag text-emerald">AI Route:</span>
              <span className="route-name">{currentData.recommendedRoute}</span>
            </div>
          </div>
        </div>
      </div>

      {/* AI Action Execution Footer */}
      <div className="prediction-action-bar">
        <div className="action-info-group">
          <Zap size={16} className="text-purple" />
          <div className="action-text">
            <span className="action-title">Autonomous Action Recommendation:</span>
            <span className="action-desc">{currentData.aiAction}</span>
          </div>
        </div>

        <button
          type="button"
          className={`btn-apply-prediction ${optimizationApplied ? 'btn-applied' : 'btn-primary'}`}
          onClick={handleApplyOptimization}
          disabled={isOptimizing}
        >
          {isOptimizing ? (
            <>
              <Cpu size={15} className="animate-spin" />
              <span>Syncing Signal Phases...</span>
            </>
          ) : optimizationApplied ? (
            <>
              <CheckCircle2 size={15} />
              <span>AI Timing Deployed</span>
            </>
          ) : (
            <>
              <Sparkles size={15} />
              <span>Deploy AI Signal Preemption</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default TrafficPrediction;
