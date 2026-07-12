export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const options = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

export const getSeverityBadgeClass = (severity) => {
  switch (severity) {
    case 'CRITICAL':
      return 'badge-danger';
    case 'HIGH':
      return 'badge-warning';
    case 'MEDIUM':
      return 'badge-info';
    case 'LOW':
    default:
      return 'badge-success';
  }
};

export const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'RESOLVED':
    case 'OPTIMAL':
      return 'badge-success';
    case 'INVESTIGATING':
    case 'SCHEDULED':
    case 'WARNING':
      return 'badge-warning';
    case 'IN_PROGRESS':
    case 'ACTIVE':
    case 'CRITICAL':
      return 'badge-danger';
    case 'OPEN':
    default:
      return 'badge-info';
  }
};
