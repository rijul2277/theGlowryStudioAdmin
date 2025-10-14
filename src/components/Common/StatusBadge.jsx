import React from 'react';

const StatusBadge = ({ status, size = 'sm' }) => {
  const getStatusConfig = (status) => {
    const configs = {
      active: {
        bg: 'bg-green-100',
        text: 'text-green-800',
        label: 'Active'
      },
      inactive: {
        bg: 'bg-gray-100',
        text: 'text-gray-800',
        label: 'Inactive'
      },
      scheduled: {
        bg: 'bg-blue-100',
        text: 'text-blue-800',
        label: 'Scheduled'
      },
      draft: {
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
        label: 'Draft'
      },
      pending: {
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
        label: 'Pending'
      },
      completed: {
        bg: 'bg-green-100',
        text: 'text-green-800',
        label: 'Completed'
      },
      cancelled: {
        bg: 'bg-red-100',
        text: 'text-red-800',
        label: 'Cancelled'
      }
    };
    
    return configs[status] || configs.inactive;
  };

  const config = getStatusConfig(status);
  const sizeClasses = {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-2.5 py-0.5 text-sm',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  return (
    <span className={`inline-flex items-center rounded-full font-medium ${config.bg} ${config.text} ${sizeClasses[size]}`}>
      {config.label}
    </span>
  );
};

export default StatusBadge;
