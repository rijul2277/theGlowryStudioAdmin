import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { deleteCategory, toggleCategoryActive } from '../../redux/slices/categorySlice';
import StatusBadge from '../Common/StatusBadge';
import ConfirmDialog from '../Common/ConfirmDialog';
import { formatDate } from '../../utils/helpers';

const CategoryTableRow = ({ category, onEdit }) => {
  const dispatch = useDispatch();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showToggleDialog, setShowToggleDialog] = useState(false);

  const handleDelete = async () => {
    try {
      await dispatch(deleteCategory(category._id))
      toast.success('Category deleted successfully!');
      setShowDeleteDialog(false);
    } catch (error) {
      toast.error(error || 'Failed to delete category');
    }
  };

  const handleToggleActive = async () => {
    try {
      await dispatch(toggleCategoryActive(category._id))
      toast.success(`Category ${category.isActive ? 'deactivated' : 'activated'} successfully!`);
      setShowToggleDialog(false);
    } catch (error) {
      toast.error(error || 'Failed to update category status');
    }
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
          <div className="h-10 w-10 flex-shrink-0">
            {category.bannerImageUrl ? (
              <img
                className="h-10 w-10 rounded-lg object-cover"
                src={category.bannerImageUrl}
                alt={category.name}
              />
            ) : (
              <div className="h-10 w-10 rounded-lg bg-gray-200 flex items-center justify-center">
                <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>
        </td>

        {/* Name */}
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm font-medium text-gray-900">{category.name}</div>
          <div className="text-sm text-gray-500">{category.slug}</div>
        </td>

        {/* Description */}
        <td className="px-6 py-4">
          <div className="text-sm text-gray-900 max-w-xs truncate">
            {category.description || 'No description'}
          </div>
        </td>

        {/* Sort Order */}
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          {category.sortOrder}
        </td>

        {/* Status */}
        <td className="px-6 py-4 whitespace-nowrap">
          <StatusBadge status={category.isActive ? 'active' : 'inactive'} />
        </td>

        {/* Created Date */}
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {formatDate(category.createdAt)}
        </td>

        {/* Actions */}
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onEdit(category)}
              className="text-indigo-600 hover:text-indigo-900"
            >
              Edit
            </button>
            <button
              onClick={() => setShowToggleDialog(true)}
              className={`${
                category.isActive 
                  ? 'text-yellow-600 hover:text-yellow-900' 
                  : 'text-green-600 hover:text-green-900'
              }`}
            >
              {category.isActive ? 'Deactivate' : 'Activate'}
            </button>
            <button
              onClick={() => setShowDeleteDialog(true)}
              className="text-red-600 hover:text-red-900"
            >
              Delete
            </button>
          </div>
        </td>
      </tr>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Delete Category"
        message={`Are you sure you want to delete "${category.name}"? This action cannot be undone.`}
        confirmText="Delete"
        type="danger"
      />

      {/* Toggle Status Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showToggleDialog}
        onClose={() => setShowToggleDialog(false)}
        onConfirm={handleToggleActive}
        title={`${category.isActive ? 'Deactivate' : 'Activate'} Category`}
        message={`Are you sure you want to ${category.isActive ? 'deactivate' : 'activate'} "${category.name}"?`}
        confirmText={category.isActive ? 'Deactivate' : 'Activate'}
        type="warning"
      />
    </>
  );
};

export default CategoryTableRow;
