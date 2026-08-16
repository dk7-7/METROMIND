const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'frontend', 'src');

const ensureDir = (dirPath) => {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
};

const write = (filePath, content) => {
    ensureDir(path.dirname(filePath));
    fs.writeFileSync(filePath, content.trim() + '\n', 'utf8');
};

const capacityBarJsx = `
import React from 'react';

const CapacityBar = ({ current, total }) => {
    const validTotal = (total && total > 0) ? total : 1; // Prevent NaN / Infinity
    const percentage = Math.min(Math.max((current / validTotal) * 100, 0), 100);
    
    let bgColor = '#22c55e'; // Green
    if (percentage >= 90) bgColor = '#ef4444'; // Red
    else if (percentage >= 70) bgColor = '#f59e0b'; // Amber

    return (
        <div style={{ width: '100%', backgroundColor: '#e2e8f0', borderRadius: '4px', height: '8px', overflow: 'hidden' }}>
            <div style={{ width: \`\${percentage}%\`, backgroundColor: bgColor, height: '100%', transition: 'width 0.3s ease' }}></div>
        </div>
    );
};

export default CapacityBar;
`;

const paginationJsx = `
import React from 'react';

const Pagination = ({ totalItems, itemsPerPage, currentPage, onPageChange }) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
            <button 
                onClick={() => onPageChange(currentPage - 1)} 
                disabled={currentPage <= 1}
                style={{ padding: '0.5rem 1rem', cursor: currentPage <= 1 ? 'not-allowed' : 'pointer' }}>
                Previous
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button 
                onClick={() => onPageChange(currentPage + 1)} 
                disabled={currentPage >= totalPages}
                style={{ padding: '0.5rem 1rem', cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer' }}>
                Next
            </button>
        </div>
    );
};

export default Pagination;
`;

const emptyStateJsx = `
import React from 'react';

const EmptyState = ({ message }) => (
    <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>ℹ️</div>
        <p>{message}</p>
    </div>
);

export default EmptyState;
`;

const alertJsx = `
import React, { useEffect, useState } from 'react';

// Simplistic Alert component. In a real app, you might use a global alert context for stacking.
const Alert = ({ message, type = 'info', duration = 3000, onClose }) => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        if (duration && duration > 0) {
            const timer = setTimeout(() => {
                setVisible(false);
                if (onClose) onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [duration, onClose]);

    if (!visible || !message) return null;

    const styles = {
        success: { backgroundColor: '#dcfce7', color: '#166534', border: '1px solid #bbf7d0' },
        error: { backgroundColor: '#fee2e2', color: '#991b1b', border: '1px solid #fecaca' },
        warning: { backgroundColor: '#fef3c7', color: '#92400e', border: '1px solid #fde68a' },
        info: { backgroundColor: '#dbeafe', color: '#1e40af', border: '1px solid #bfdbfe' }
    };

    const currentStyle = styles[type] || styles.info;

    return (
        <div style={{ 
            ...currentStyle, 
            padding: '1rem', 
            borderRadius: '4px', 
            marginBottom: '1rem',
            position: 'relative',
            zIndex: 1000
        }}>
            {message}
        </div>
    );
};

export default Alert;
`;

const errorHandlerJsx = `
import React from 'react';

const ErrorHandler = ({ error }) => {
    if (!error) return null;
    return (
        <div data-testid="error-handler" style={{ color: 'red', padding: '0.5rem', backgroundColor: '#fee2e2', border: '1px solid #fecaca', borderRadius: '4px', marginBottom: '1rem' }}>
            {error}
        </div>
    );
};

export default ErrorHandler;
`;

const searchFilterBarJsx = `
import React from 'react';

const SearchFilterBar = ({ onSearch, onFilterChange, filterOptions = [] }) => {
    return (
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
            <input 
                type="text" 
                placeholder="Search by title" 
                onChange={(e) => onSearch(e.target.value)}
                style={{ padding: '0.5rem', flex: 1, borderRadius: '4px', border: '1px solid #cbd5e1' }}
            />
            {filterOptions.length > 0 && (
                <select 
                    onChange={(e) => onFilterChange(e.target.value)}
                    style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                >
                    <option value="">All Statuses</option>
                    {filterOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>
            )}
        </div>
    );
};

export default SearchFilterBar;
`;

write(path.join(srcDir, 'components', 'common', 'CapacityBar.jsx'), capacityBarJsx);
write(path.join(srcDir, 'components', 'common', 'Pagination.jsx'), paginationJsx);
write(path.join(srcDir, 'components', 'common', 'EmptyState.jsx'), emptyStateJsx);
write(path.join(srcDir, 'components', 'common', 'Alert.jsx'), alertJsx);
write(path.join(srcDir, 'components', 'common', 'ErrorHandler.jsx'), errorHandlerJsx);
write(path.join(srcDir, 'components', 'common', 'SearchFilterBar.jsx'), searchFilterBarJsx);

console.log("Common components generated successfully.");
