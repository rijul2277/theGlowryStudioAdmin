import React, { useState, memo } from 'react';
import { formatDate, formatDateTime } from '../../utils/helpers';
import { BANNER_STATUS } from '../../utils/constants';

const BannerTableRow = ({ banner, onEdit, onDelete, onToggle }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const getStatusBadge = (isActive, startDate, endDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : null;

    if (!isActive) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          Inactive
        </span>
      );
    }

    if (start > now) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          Scheduled
        </span>
      );
    }

    if (end && end < now) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          Expired
        </span>
      );
    }

    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        Active
      </span>
    );
  };

  const handleDeleteConfirm = () => {
    onDelete(banner._id);
    setShowDeleteConfirm(false);
  };

  const handleToggle = () => {
    onToggle(banner._id);
  };

  return (
    <>
      <tr className="hover:bg-gray-50">
        {/* Checkbox */}
        <td className="px-6 py-4 whitespace-nowrap">
          <input
            type="checkbox"
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
        </td>

        {/* Image */}
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex-shrink-0 h-12 w-12">
            <img
              className="h-12 w-12 rounded-lg object-cover"
              src={banner.imageUrl}
              alt={banner.title}
              onError={(e) => {
                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yNCAzNkMzMC42MjcgMzYgMzYgMzAuNjI3IDM2IDI0QzM2IDE3LjM3MyAzMC42MjcgMTIgMjQgMTJDMTcuMzczIDEyIDEyIDE3LjM3MyAxMiAyNEMxMiAzMC42MjcgMTcuMzczIDM2IDI0IDM2WiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K';
              }}
            />
          </div>
        </td>

        {/* Title & Description */}
        <td className="px-6 py-4">
          <div className="text-sm font-medium text-gray-900">
            {banner.title}
          </div>
          <div className="text-sm text-gray-500 truncate max-w-xs">
            {banner.description || 'No description'}
          </div>
        </td>

        {/* Status */}
        <td className="px-6 py-4 whitespace-nowrap">
          {getStatusBadge(banner.isActive, banner.startDate, banner.endDate)}
        </td>

        {/* Order */}
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          {banner.order}
        </td>

        {/* CTA */}
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm text-gray-900">{banner.ctaText}</div>
          <div className="text-sm text-gray-500 truncate max-w-xs">
            {banner.ctaLink}
          </div>
        </td>

        {/* Dates */}
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          <div>Start: {formatDate(banner.startDate)}</div>
          {banner.endDate && (
            <div>End: {formatDate(banner.endDate)}</div>
          )}
        </td>

        {/* Created */}
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {formatDateTime(banner.createdAt)}
        </td>

        {/* Actions */}
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onEdit(banner)}
              className="text-indigo-600 hover:text-indigo-900"
              title="Edit banner"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            
            <button
              onClick={handleToggle}
              className={`${
                banner.isActive 
                  ? 'text-red-600 hover:text-red-900' 
                  : 'text-green-600 hover:text-green-900'
              }`}
              title={banner.isActive ? 'Deactivate banner' : 'Activate banner'}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
              </svg>
            </button>
            
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="text-red-600 hover:text-red-900"
              title="Delete banner"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </td>
      </tr>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <tr>
          <td colSpan="8" className="px-6 py-4 bg-red-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Delete Banner
                  </h3>
                  <div className="mt-1 text-sm text-red-700">
                    Are you sure you want to delete "{banner.title}"? This action cannot be undone.
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="px-3 py-1 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

export default memo(BannerTableRow);
