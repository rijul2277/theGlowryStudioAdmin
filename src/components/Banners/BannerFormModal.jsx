import React, { useState, useEffect, useCallback, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { createBanner, updateBanner, clearError } from '../../redux/slices/bannerSlice';
import ImageUpload from '../Common/ImageUpload';
import LoadingSpinner from '../Common/LoadingSpinner';
import { UPLOAD_FOLDERS } from '../../utils/constants';

const BannerFormModal = ({ isOpen, onClose, banner = null, onSave }) => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.banners);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    ctaText: 'Shop Now',
    ctaLink: '/',
    order: 0,
    isActive: true,
    startDate: new Date().toISOString().slice(0, 16),
    endDate: ''
  });

  const [images, setImages] = useState([]);
  const [imageMode, setImageMode] = useState('upload'); // 'upload' or 'url'
  const [errors, setErrors] = useState({});

  // Initialize form data when modal opens or banner changes
  useEffect(() => {
    if (!isOpen) return;
    
    if (banner) {
      setFormData({
        title: banner.title || '',
        description: banner.description || '',
        imageUrl: banner.imageUrl || '',
        ctaText: banner.ctaText || 'Shop Now',
        ctaLink: banner.ctaLink || '/',
        order: banner.order || 0,
        isActive: banner.isActive !== undefined ? banner.isActive : true,
        startDate: banner.startDate ? new Date(banner.startDate).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16),
        endDate: banner.endDate ? new Date(banner.endDate).toISOString().slice(0, 16) : ''
      });
      
      if (banner.imageUrl) {
        setImages([{ url: banner.imageUrl }]);
        setImageMode('url');
      }
    } else {
      // Reset form for new banner
      setFormData({
        title: '',
        description: '',
        imageUrl: '',
        ctaText: 'Shop Now',
        ctaLink: '/',
        order: 0,
        isActive: true,
        startDate: new Date().toISOString().slice(0, 16),
        endDate: ''
      });
      setImages([]);
      setImageMode('upload');
    }
    setErrors({});
  }, [banner, isOpen]);

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

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  }, [errors]);

  const handleImageUpload = useCallback((uploadedImages) => {
    if (uploadedImages.length > 0) {
      setImages(uploadedImages);
      const firstImage = uploadedImages[0];
      const imageUrl = firstImage?.data?.url || firstImage?.url || firstImage;
      setFormData(prev => ({
        ...prev,
        imageUrl: imageUrl
      }));
    }
  }, []);

  const handleImageRemove = useCallback((index) => {
    setImages([]);
    setFormData(prev => ({
      ...prev,
      imageUrl: ''
    }));
  }, []);

  const handleImageModeChange = useCallback((mode) => {
    setImageMode(mode);
    if (mode === 'url') {
      setImages([]);
    } else {
      setFormData(prev => ({
        ...prev,
        imageUrl: ''
      }));
    }
  }, []);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Banner title is required';
    }

    if (!formData.imageUrl.trim()) {
      newErrors.imageUrl = 'Banner image is required';
    }

    if (formData.startDate && formData.endDate) {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);
      if (endDate <= startDate) {
        newErrors.endDate = 'End date must be after start date';
      }
    }

    if (formData.order < 0) {
      newErrors.order = 'Order must be a positive number';
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
      const bannerData = {
        ...formData,
        startDate: formData.startDate ? new Date(formData.startDate) : new Date(),
        endDate: formData.endDate ? new Date(formData.endDate) : null
      };

      if (banner) {
        await dispatch(updateBanner({ 
          id: banner._id, 
          bannerData 
        }))
        toast.success('Banner updated successfully!');
      } else {
        await dispatch(createBanner(bannerData))
        toast.success('Banner created successfully!');
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
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <form onSubmit={handleSubmit}>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 max-h-96 overflow-y-auto">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-6">
                    {banner ? 'Edit Banner' : 'Add New Banner'}
                  </h3>
                  
                  <div className="space-y-6">
                    {/* Basic Details */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      {/* Title */}
                      <div className="sm:col-span-2">
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                          Banner Title *
                        </label>
                        <input
                          type="text"
                          name="title"
                          id="title"
                          value={formData.title}
                          onChange={handleInputChange}
                          className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                            errors.title ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="Enter banner title"
                        />
                        {errors.title && (
                          <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                        )}
                      </div>

                      {/* Description */}
                      <div className="sm:col-span-2">
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
                          placeholder="Enter banner description"
                        />
                      </div>

                      {/* Image Upload Mode Toggle */}
                      <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Banner Image *
                        </label>
                        <div className="flex space-x-4 mb-4">
                          <button
                            type="button"
                            onClick={() => handleImageModeChange('upload')}
                            className={`px-3 py-2 text-sm font-medium rounded-md ${
                              imageMode === 'upload'
                                ? 'bg-indigo-100 text-indigo-700'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            Upload Image
                          </button>
                          <button
                            type="button"
                            onClick={() => handleImageModeChange('url')}
                            className={`px-3 py-2 text-sm font-medium rounded-md ${
                              imageMode === 'url'
                                ? 'bg-indigo-100 text-indigo-700'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            Paste URL
                          </button>
                        </div>

                        {imageMode === 'upload' ? (
                          <ImageUpload
                            onUpload={handleImageUpload}
                            onRemove={handleImageRemove}
                            images={images}
                            multiple={false}
                            folder={UPLOAD_FOLDERS.BANNERS}
                            maxFiles={1}
                          />
                        ) : (
                          <div>
                            <input
                              type="url"
                              name="imageUrl"
                              value={formData.imageUrl}
                              onChange={handleInputChange}
                              className={`block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                                errors.imageUrl ? 'border-red-300' : 'border-gray-300'
                              }`}
                              placeholder="https://example.com/image.jpg"
                            />
                            {errors.imageUrl && (
                              <p className="mt-1 text-sm text-red-600">{errors.imageUrl}</p>
                            )}
                          </div>
                        )}
                      </div>

                      {/* CTA Text */}
                      <div>
                        <label htmlFor="ctaText" className="block text-sm font-medium text-gray-700">
                          CTA Text
                        </label>
                        <input
                          type="text"
                          name="ctaText"
                          id="ctaText"
                          value={formData.ctaText}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          placeholder="Shop Now"
                        />
                      </div>

                      {/* CTA Link */}
                      <div>
                        <label htmlFor="ctaLink" className="block text-sm font-medium text-gray-700">
                          CTA Link
                        </label>
                        <input
                          type="url"
                          name="ctaLink"
                          id="ctaLink"
                          value={formData.ctaLink}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          placeholder="/products"
                        />
                      </div>

                      {/* Order */}
                      <div>
                        <label htmlFor="order" className="block text-sm font-medium text-gray-700">
                          Display Order
                        </label>
                        <input
                          type="number"
                          name="order"
                          id="order"
                          value={formData.order}
                          onChange={handleInputChange}
                          min="0"
                          className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                            errors.order ? 'border-red-300' : 'border-gray-300'
                          }`}
                        />
                        {errors.order && (
                          <p className="mt-1 text-sm text-red-600">{errors.order}</p>
                        )}
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

                    {/* Date Range */}
                    <div className="border-t border-gray-200 pt-6">
                      <h4 className="text-md font-medium text-gray-900 mb-4">Schedule</h4>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {/* Start Date */}
                        <div>
                          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                            Start Date *
                          </label>
                          <input
                            type="datetime-local"
                            name="startDate"
                            id="startDate"
                            value={formData.startDate}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                        </div>

                        {/* End Date */}
                        <div>
                          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                            End Date (Optional)
                          </label>
                          <input
                            type="datetime-local"
                            name="endDate"
                            id="endDate"
                            value={formData.endDate}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                          {errors.endDate && (
                            <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>
                          )}
                        </div>
                      </div>
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
                  banner ? 'Update Banner' : 'Create Banner'
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

export default memo(BannerFormModal);
