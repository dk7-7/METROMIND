import React, { useState } from 'react';
import {
  Video,
  Maximize2,
  Minimize2,
  RefreshCw,
  Eye,
  Sliders,
  ShieldCheck,
  Activity,
  Layers,
  Sparkles
} from 'lucide-react';
import StatusBadge from '../common/StatusBadge';
import SkeletonLoader from '../common/SkeletonLoader';

const CCTVGrid = () => {
  const [loading, setLoading] = useState(false);
  const [selectedCamModal, setSelectedCamModal] = useState(null);
  const [activeFilter, setActiveFilter] = useState('ALL');

  const cameras = [
    {
      id: 'CAM-01',
      name: 'Central Expressway Core (Northbound)',
      location: 'Sector 1 - Junction 4A',
      status: 'ONLINE',
      fps: '30 FPS',
      resolution: '4K HDR',
      vehicleCount: 18,
      speedAvg: '54 km/h',
      detectionType: 'Vehicle & Pedestrian AI',
      detectionState: 'OPTIMAL_FLOW',
      plateRecognized: 'KA-01-MJ-8821 (Passing)',
      streamUrl: 'Live Feed active',
    },
    {
      id: 'CAM-02',
      name: 'Harbor Coastal Arterial Approach',
      location: 'Sector 3 - Harbor Bridge Overpass',
      status: 'ONLINE',
      fps: '30 FPS',
      resolution: '4K HDR',
      vehicleCount: 34,
      speedAvg: '19 km/h',
      detectionType: 'Bottleneck & Hazard Detection',
      detectionState: 'CONGESTION_ALERT',
      plateRecognized: 'MH-02-CX-4092 (Halted)',
      streamUrl: 'Live Feed active',
    },
    {
      id: 'CAM-03',
      name: 'Cyber Innovation Campus West Gate',
      location: 'Sector 2 - Tech Corridor Gate 2',
      status: 'ONLINE',
      fps: '30 FPS',
      resolution: '1080p 60Hz',
      vehicleCount: 11,
      speedAvg: '42 km/h',
      detectionType: 'Speed Radar & ANPR',
      detectionState: 'NORMAL',
      plateRecognized: 'DL-04-AB-1904 (Normal)',
      streamUrl: 'Live Feed active',
    },
    {
      id: 'CAM-04',
      name: 'Northern Outer Ring Link Overpass',
      location: 'Sector 4 - Ring Road KM 12',
      status: 'ONLINE',
      fps: '30 FPS',
      resolution: '4K HDR',
      vehicleCount: 8,
      speedAvg: '68 km/h',
      detectionType: 'High-Speed Tracking AI',
      detectionState: 'FREE_FLOW',
      plateRecognized: 'TS-08-KL-7731 (Cruising)',
      streamUrl: 'Live Feed active',
    },
  ];

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 600);
  };

  const filteredCameras = activeFilter === 'ALL'
    ? cameras
    : cameras.filter((c) => c.detectionState.includes(activeFilter));

  return (
    <div className="cctv-grid-container glass-panel">
      {/* Header */}
      <div className="cctv-header">
        <div className="cctv-title-group">
          <div className="cctv-badge">
            <Video size={14} className="hud-icon-spin text-cyan" />
            <span>AI COMPUTER VISION SURVEILLANCE GRID</span>
          </div>
          <h3 className="cctv-title">
            Automated Traffic CCTV & Optical Telemetry Feeds
          </h3>
          <p className="cctv-subtitle">
            Real-time neural object tracking, vehicle classification & automated license plate recognition
          </p>
        </div>

        {/* Toolbar */}
        <div className="cctv-actions-toolbar">
          <div className="cctv-filter-tabs">
            {['ALL', 'OPTIMAL', 'CONGESTION', 'FREE_FLOW'].map((f) => (
              <button
                key={f}
                type="button"
                className={`filter-tab ${activeFilter === f ? 'active' : ''}`}
                onClick={() => setActiveFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>

          <button
            type="button"
            className="btn-refresh-cctv"
            onClick={handleRefresh}
            title="Refresh AI Optical Streams"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>Sync Feeds</span>
          </button>
        </div>
      </div>

      {/* Grid of Cameras */}
      {loading ? (
        <SkeletonLoader type="cctv" count={4} />
      ) : (
        <div className="cctv-feeds-grid">
          {filteredCameras.map((cam) => (
            <div key={cam.id} className="cctv-feed-card glass-panel">
              {/* Simulated Live Feed Screen with Scanlines & HUD */}
              <div className="cctv-screen-wrapper">
                <div className="cctv-screen-content">
                  {/* Cyber Grid / City Road visual simulation */}
                  <div className="cctv-visual-sim">
                    {/* Simulated vehicles with bounding boxes */}
                    <div className="sim-vehicle box-1">
                      <div className="bounding-box green-box" />
                      <span className="box-label">SEDAN [98%]</span>
                    </div>
                    <div className="sim-vehicle box-2">
                      <div className="bounding-box cyan-box" />
                      <span className="box-label">AUTONOMOUS BUS [99%]</span>
                    </div>
                    {cam.id === 'CAM-02' && (
                      <div className="sim-vehicle box-hazard">
                        <div className="bounding-box red-box" />
                        <span className="box-label">SLOW TRAFFIC DETECTED</span>
                      </div>
                    )}
                  </div>

                  {/* Scanlines Effect */}
                  <div className="cctv-scanlines" />

                  {/* Top Feed HUD Overlay */}
                  <div className="feed-hud-top">
                    <div className="live-rec-pill">
                      <span className="rec-dot" />
                      <span>REC • LIVE</span>
                    </div>
                    <div className="feed-res-tag">{cam.resolution} • {cam.fps}</div>
                  </div>

                  {/* Bottom Feed HUD Overlay */}
                  <div className="feed-hud-bottom">
                    <div className="feed-id-tag">{cam.id}</div>
                    <div className="feed-plate-tag">ANPR: {cam.plateRecognized}</div>
                  </div>
                </div>

                {/* Hover Action Overlay */}
                <div className="cctv-hover-overlay">
                  <button
                    type="button"
                    className="btn-feed-expand"
                    onClick={() => setSelectedCamModal(cam)}
                  >
                    <Maximize2 size={16} />
                    <span>Enlarge Feed & PTZ Control</span>
                  </button>
                </div>
              </div>

              {/* Feed Card Footer Information */}
              <div className="cctv-card-info">
                <div className="info-title-row">
                  <div>
                    <h4 className="feed-name">{cam.name}</h4>
                    <span className="feed-location">{cam.location}</span>
                  </div>
                  <StatusBadge status={cam.status} size="sm" />
                </div>

                <div className="feed-metrics-grid">
                  <div className="feed-metric">
                    <span className="m-label">Vehicle Density</span>
                    <span className="m-val text-cyan">{cam.vehicleCount} tracked</span>
                  </div>
                  <div className="feed-metric">
                    <span className="m-label">Avg Velocity</span>
                    <span className="m-val text-emerald">{cam.speedAvg}</span>
                  </div>
                  <div className="feed-metric">
                    <span className="m-label">Neural Engine</span>
                    <span className="m-val text-purple">{cam.detectionType}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Full-Screen Camera Inspector Modal */}
      {selectedCamModal && (
        <div className="modal-overlay">
          <div className="modal-content cctv-modal-view animate-scale-up">
            <div className="modal-header">
              <div className="modal-title-group">
                <div className="modal-badge-row">
                  <StatusBadge status="LIVE 4K STREAM" size="sm" />
                  <span className="modal-cam-id">{selectedCamModal.id}</span>
                </div>
                <h3 className="modal-title">{selectedCamModal.name}</h3>
                <p className="modal-subtitle">{selectedCamModal.location}</p>
              </div>
              <button
                type="button"
                className="btn-close"
                onClick={() => setSelectedCamModal(null)}
              >
                ✕
              </button>
            </div>

            <div className="cctv-modal-screen-wrapper">
              <div className="cctv-modal-large-feed">
                <div className="cctv-scanlines" />
                <div className="sim-large-road">
                  <div className="sim-vehicle large-v1">
                    <div className="bounding-box green-box" />
                    <span className="box-label">CAR #89 • SPEED: 52 KM/H • CLASS: PASSENGER</span>
                  </div>
                  <div className="sim-vehicle large-v2">
                    <div className="bounding-box cyan-box" />
                    <span className="box-label">EV BUS #14 • SPEED: 38 KM/H • CLASS: TRANSIT</span>
                  </div>
                </div>

                {/* AI HUD Telemetry Box on Modal */}
                <div className="modal-hud-overlay">
                  <div className="hud-metric-pill">ANPR Match: {selectedCamModal.plateRecognized}</div>
                  <div className="hud-metric-pill">Detection Confidence: 99.4%</div>
                  <div className="hud-metric-pill">Optical Sensor Health: 100%</div>
                </div>
              </div>
            </div>

            {/* PTZ and Lens Controls Simulator */}
            <div className="cctv-ptz-controls">
              <div className="ptz-title">Simulate PTZ Camera Controls:</div>
              <div className="ptz-buttons-row">
                <button type="button" className="btn-ptz">◀ Pan Left</button>
                <button type="button" className="btn-ptz">▲ Tilt Up</button>
                <button type="button" className="btn-ptz">▼ Tilt Down</button>
                <button type="button" className="btn-ptz">▶ Pan Right</button>
                <button type="button" className="btn-ptz">🔍 Zoom In</button>
                <button type="button" className="btn-ptz">🔎 Zoom Out</button>
                <button type="button" className="btn-ptz ptz-reset">Reset PTZ Preset</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CCTVGrid;
