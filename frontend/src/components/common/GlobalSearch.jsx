import React, { useState, useEffect, useRef } from 'react';
import { Search, X, AlertTriangle, Video, Activity, Zap, Compass, MapPin } from 'lucide-react';

const GlobalSearch = ({ onSelectItem, placeholder = 'Search roads, cameras, incidents, utilities...', className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const containerRef = useRef(null);

  // Sample searchable master datasets
  const searchableData = [
    { id: 'cam-01', title: 'CAM-01 Downtown Metro Hub', category: 'CCTV Camera', type: 'camera', status: 'ONLINE', icon: Video, meta: 'North & 5th Ave' },
    { id: 'cam-02', title: 'CAM-02 Ring Road Overpass', category: 'CCTV Camera', type: 'camera', status: 'ONLINE', icon: Video, meta: 'Sector 4 Express' },
    { id: 'cam-03', title: 'CAM-03 Cyber Corridor West', category: 'CCTV Camera', type: 'camera', status: 'ONLINE', icon: Video, meta: 'Tech Park Gate 2' },
    { id: 'cam-04', title: 'CAM-04 Harbor Bridge Crossing', category: 'CCTV Camera', type: 'camera', status: 'ONLINE', icon: Video, meta: 'Coastal Gateway' },
    { id: 'rd-01', title: 'Metro Central Expressway', category: 'Road Corridor', type: 'road', status: 'MODERATE', icon: Compass, meta: 'Zone 1 - High Volume' },
    { id: 'rd-02', title: 'Northern Tech Bypass', category: 'Road Corridor', type: 'road', status: 'NORMAL', icon: Compass, meta: 'Zone 3 - Flowing' },
    { id: 'rd-03', title: 'Harbor Coastal Arterial', category: 'Road Corridor', type: 'road', status: 'CONGESTED', icon: Compass, meta: 'Zone 2 - Heavy Rush' },
    { id: 'inc-01', title: 'Collision on Sector 4 Express', category: 'Incident', type: 'incident', status: 'CRITICAL', icon: AlertTriangle, meta: 'Lane 2 & 3 Blocked' },
    { id: 'inc-02', title: 'Signal Malfunction at Tech Junction', category: 'Incident', type: 'incident', status: 'HIGH', icon: AlertTriangle, meta: 'Manual Dispatch' },
    { id: 'grid-01', title: 'Sector 4 Central Substation', category: 'Utility Grid', type: 'utility', status: 'NORMAL', icon: Zap, meta: 'Load: 78% (320 MW)' },
    { id: 'grid-02', title: 'Harbor Water Pumping Unit 2', category: 'Utility Grid', type: 'utility', status: 'DEGRADED', icon: Activity, meta: 'Pressure: 58 PSI' },
    { id: 'amb-104', title: 'Ambulance Unit AMB-104', category: 'Emergency Unit', type: 'emergency', status: 'ACTIVE', icon: Activity, meta: 'ETA: 4 mins to Trauma Ctr' },
  ];

  const results = query.trim() === ''
    ? []
    : searchableData.filter((item) =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase()) ||
        item.meta.toLowerCase().includes(query.toLowerCase())
      );

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (item) => {
    if (onSelectItem) {
      onSelectItem(item);
    }
    setIsOpen(false);
    setQuery('');
  };

  return (
    <div className={`global-search-wrapper ${className}`} ref={containerRef}>
      <div className="search-input-group">
        <Search className="search-icon-svg" size={16} />
        <input
          type="text"
          className="global-search-input"
          placeholder={placeholder}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          aria-label="Global Smart City Search"
        />
        {query && (
          <button
            type="button"
            className="search-clear-btn"
            onClick={() => {
              setQuery('');
              setIsOpen(false);
            }}
            aria-label="Clear search"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {isOpen && query.trim() !== '' && (
        <div className="search-dropdown-menu glass-panel animate-slide-down">
          <div className="search-dropdown-header">
            <span>Matching Assets & Entities ({results.length})</span>
            <span className="search-hint">Press Esc to close</span>
          </div>

          {results.length === 0 ? (
            <div className="search-no-results">
              <p>No city entity matching &ldquo;{query}&rdquo;</p>
              <span>Try searching &ldquo;Expressway&rdquo;, &ldquo;CAM&rdquo;, &ldquo;Substation&rdquo;, or &ldquo;Ambulance&rdquo;</span>
            </div>
          ) : (
            <div className="search-results-list">
              {results.map((item) => {
                const IconComponent = item.icon || MapPin;
                return (
                  <button
                    key={item.id}
                    type="button"
                    className="search-result-item"
                    onClick={() => handleSelect(item)}
                  >
                    <div className={`result-icon-box type-${item.type}`}>
                      <IconComponent size={16} />
                    </div>
                    <div className="result-info">
                      <div className="result-title-row">
                        <span className="result-title">{item.title}</span>
                        <span className={`result-status-pill status-${item.status.toLowerCase()}`}>
                          {item.status}
                        </span>
                      </div>
                      <div className="result-meta-row">
                        <span className="result-category">{item.category}</span>
                        <span className="result-dot">•</span>
                        <span className="result-meta">{item.meta}</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GlobalSearch;
