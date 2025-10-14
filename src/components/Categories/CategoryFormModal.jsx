import React, { useState, useEffect, useCallback, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { createCategory, updateCategory, clearError, fetchActiveCategories } from '../../redux/slices/categorySlice';
import { generateSlug } from '../../utils/helpers';
import ImageUpload from '../Common/ImageUpload';
import LoadingSpinner from '../Common/LoadingSpinner';

const CategoryFormModal = ({ isOpen, onClose, category = null, onSave }) => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.categories);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    bannerImageUrl: '',
    isActive: true,
    sortOrder: 0
  });

  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState({});

  // Initialize form data when modal opens or category changes
  useEffect(() => {
    if (!isOpen) return;
    
    if (category) {
      setFormData({
        name: category.name || '',
        slug: category.slug || '',
        description: category.description || '',
        bannerImageUrl: category.bannerImageUrl || '',
        isActive: category.isActive !== undefined ? category.isActive : true,
        sortOrder: category.sortOrder || 0
      });
      
      if (category.bannerImageUrl) {
        setImages([{ url: category.bannerImageUrl }]);
      }
    } else {
      // Reset form for new category
      setFormData({
        name: '',
        slug: '',
        description: '',
        bannerImageUrl: '',
        isActive: true,
        sortOrder: 0
      });
      setImages([]);
    }
    setErrors({});
  }, [category, isOpen]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleInputChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Auto-generate slug when name changes
    if (name === 'name' && !category) {
      const slug = generateSlug(value);
      setFormData(prev => ({
        ...prev,
        slug
      }));
    }

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  }, [category, errors]);

  const handleImageUpload = useCallback((uploadedImages) => {
    if (uploadedImages.length > 0) {
      setImages(uploadedImages);
      setFormData(prev => ({
        ...prev,
        bannerImageUrl: uploadedImages[0].url
      }));
    }
  }, []);

  const handleImageRemove = useCallback((index) => {
    setImages([]);
    setFormData(prev => ({
      ...prev,
      bannerImageUrl: ''
    }));
  }, []);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Category name is required';
    }

    if (!formData.slug.trim()) {
      newErrors.slug = 'Slug is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      if (category) {
        await dispatch(updateCategory({ 
          id: category._id, 
          categoryData: formData 
        }))
        toast.success('Category updated successfully!');
      } else {
        await dispatch(createCategory(formData))
        toast.success('Category created successfully!');
      }
      
      // Call parent callback to refresh data
      if (onSave) {
        onSave();
      }
      
      onClose();
    } catch (error) {
      // Error is handled by useEffect
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        ></div>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <form onSubmit={handleSubmit}>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    {category ? 'Edit Category' : 'Add New Category'}
                  </h3>
                  
                  <div className="space-y-4">
                    {/* Name */}
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Category Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                          errors.name ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Enter category name"
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                      )}
                    </div>

                    {/* Slug */}
                    <div>
                      <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
                        Slug *
                      </label>
                      <input
                        type="text"
                        name="slug"
                        id="slug"
                        value={formData.slug}
                        onChange={handleInputChange}
                        className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                          errors.slug ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="category-slug"
                      />
                      {errors.slug && (
                        <p className="mt-1 text-sm text-red-600">{errors.slug}</p>
                      )}
                    </div>

                    {/* Description */}
                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Description
                      </label>
                      <textarea
                        name="description"
                        id="description"
                        rows={3}
                        value={formData.description}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="Enter category description"
                      />
                    </div>

                    {/* Banner Image */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Banner Image
                      </label>
                      <ImageUpload
                        onUpload={handleImageUpload}
                        onRemove={handleImageRemove}
                        images={images}
                        multiple={false}
                        folder="theglowrystudio/categories"
                        maxFiles={1}
                      />
                    </div>

                    {/* Sort Order */}
                    <div>
                      <label htmlFor="sortOrder" className="block text-sm font-medium text-gray-700">
                        Sort Order
                      </label>
                      <input
                        type="number"
                        name="sortOrder"
                        id="sortOrder"
                        value={formData.sortOrder}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="0"
                        min="0"
                      />
                    </div>

                    {/* Active Status */}
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="isActive"
                        id="isActive"
                        checked={formData.isActive}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                        Active
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  category ? 'Update Category' : 'Create Category'
                )}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default memo(CategoryFormModal);
