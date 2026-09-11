import React from 'react';
import { useSelector } from 'react-redux';

const SupervisorProfileSection = () => {
  const { user } = useSelector((state) => state.auth);
  const username = user?.username || localStorage.getItem('username') || 'Supervisor Marcus Vance';
  const role = user?.role || localStorage.getItem('role') || 'FIELD_SUPERVISOR';

  return (
    <div className="fs-profile-section">
      <div className="fs-section-header-row">
        <div>
          <h3 className="fs-section-title">Field Supervisor Profile & Clearance</h3>
          <p className="fs-section-subtitle">
            Sector command authorization, safety certifications, communication channels, and field credentials
          </p>
        </div>
      </div>

      <div className="fs-profile-grid">
        <div className="fs-profile-card">
          <div className="fs-profile-avatar-row">
            <div className="fs-profile-avatar">🛡️</div>
            <div>
              <h4 className="fs-profile-name">{username}</h4>
              <span className="fs-profile-badge">OPERATIONAL FIELD SUPERVISOR</span>
            </div>
          </div>

          <div className="fs-profile-info-list">
            <div className="fs-info-row">
              <span className="info-lbl">Municipal ID:</span>
              <span className="info-val font-mono">FS-MM-94821</span>
            </div>
            <div className="info-row">
              <span className="info-lbl">Designated Sector:</span>
              <span className="info-val">Sector Alpha (Downtown Core & Substation Grids)</span>
            </div>
            <div className="info-row">
              <span className="info-lbl">System Role:</span>
              <span className="info-val font-highlight">{role}</span>
            </div>
            <div className="info-row">
              <span className="info-lbl">Active Shift:</span>
              <span className="info-val">Shift 1 (08:00 - 16:00 EST)</span>
            </div>
            <div className="info-row">
              <span className="info-lbl">Radio Channel:</span>
              <span className="info-val font-mono">CH-04 (Encrypted Command Link)</span>
            </div>
          </div>
        </div>

        <div className="fs-profile-card">
          <h4 className="fs-profile-card-title">Certifications & Safety Clearances</h4>
          <div className="fs-cert-list">
            <div className="fs-cert-item">
              <span className="cert-icon">⚡</span>
              <div>
                <strong>High-Voltage Safety Level 3 (HV-L3)</strong>
                <p>Authorized for live substation isolation and lockout tagout (LOTO).</p>
              </div>
            </div>
            <div className="fs-cert-item">
              <span className="cert-icon">🚦</span>
              <div>
                <strong>Intelligent Transportation Systems (ITS-Core)</strong>
                <p>Certified for adaptive traffic signal phasing override and emergency corridor opening.</p>
              </div>
            </div>
            <div className="fs-cert-item">
              <span className="cert-icon">🦺</span>
              <div>
                <strong>OSHA Municipal Hazard Assessment & Incident Command</strong>
                <p>Incident commander credential for civil infrastructure incidents.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupervisorProfileSection;
