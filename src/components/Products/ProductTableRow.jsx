import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { deleteProduct, toggleProductActive } from '../../redux/slices/productSlice';
import StatusBadge from '../Common/StatusBadge';
import ConfirmDialog from '../Common/ConfirmDialog';
import { formatDate, formatCurrency } from '../../utils/helpers';

const ProductTableRow = ({ product, onEdit }) => {
  const dispatch = useDispatch();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showToggleDialog, setShowToggleDialog] = useState(false);

  const handleDelete = async () => {
    try {
      await dispatch(deleteProduct(product._id))
      toast.success('Product deleted successfully!');
      setShowDeleteDialog(false);
    } catch (error) {
      toast.error(error || 'Failed to delete product');
    }
  };

  const handleToggleActive = async () => {
    try {
      await dispatch(toggleProductActive(product._id))
      toast.success(`Product ${product.isActive ? 'deactivated' : 'activated'} successfully!`);
      setShowToggleDialog(false);
    } catch (error) {
      toast.error(error || 'Failed to update product status');
    }
  };

  // Calculate total stock across all variants
  const totalStock = product.variants?.reduce((sum, variant) => sum + (variant.stock || 0), 0) || 0;
  
  // Get price range
  const prices = product.variants?.map(v => v.price).filter(p => p > 0) || [];
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;
  const priceRange = minPrice === maxPrice ? formatCurrency(minPrice) : `${formatCurrency(minPrice)} - ${formatCurrency(maxPrice)}`;

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
            {product.mainImageUrl ? (
              <img
                className="h-10 w-10 rounded-lg object-cover"
                src={product.mainImageUrl}
                alt={product.title}
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

        {/* Title */}
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm font-medium text-gray-900">{product.title}</div>
          <div className="text-sm text-gray-500">{product.slug}</div>
        </td>

        {/* Category */}
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm text-gray-900">
            {product.category?.name || 'No Category'}
          </div>
        </td>

        {/* Variants Count */}
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          {product.variants?.length || 0} variants
        </td>

        {/* Price Range */}
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          {priceRange}
        </td>

        {/* Stock */}
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          {totalStock} units
        </td>

        {/* Status */}
        <td className="px-6 py-4 whitespace-nowrap">
          <StatusBadge status={product.isActive ? 'active' : 'inactive'} />
        </td>

        {/* Created Date */}
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {formatDate(product.createdAt)}
        </td>

        {/* Actions */}
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onEdit(product)}
              className="text-indigo-600 hover:text-indigo-900"
            >
              Edit
            </button>
            <button
              onClick={() => setShowToggleDialog(true)}
              className={`${
                product.isActive 
                  ? 'text-yellow-600 hover:text-yellow-900' 
                  : 'text-green-600 hover:text-green-900'
              }`}
            >
              {product.isActive ? 'Deactivate' : 'Activate'}
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
        title="Delete Product"
        message={`Are you sure you want to delete "${product.title}"? This action cannot be undone.`}
        confirmText="Delete"
        type="danger"
      />

      {/* Toggle Status Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showToggleDialog}
        onClose={() => setShowToggleDialog(false)}
        onConfirm={handleToggleActive}
        title={`${product.isActive ? 'Deactivate' : 'Activate'} Product`}
        message={`Are you sure you want to ${product.isActive ? 'deactivate' : 'activate'} "${product.title}"?`}
        confirmText={product.isActive ? 'Deactivate' : 'Activate'}
        type="warning"
      />
    </>
  );
};

export default ProductTableRow;
