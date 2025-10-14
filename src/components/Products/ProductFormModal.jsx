import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { createProduct, updateProduct, clearError } from '../../redux/slices/productSlice';
import { fetchActiveCategories } from '../../redux/slices/categorySlice';
import { generateSlug } from '../../utils/helpers';
import ImageUpload from '../Common/ImageUpload';
import VariantForm from './VariantForm';
import LoadingSpinner from '../Common/LoadingSpinner';

const ProductFormModal = ({ isOpen, onClose, product = null }) => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.products);
  const { activeCategories } = useSelector((state) => state.categories);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    category: '',
    tags: [],
    mainImageUrl: '',
    isActive: true
  });


  
  const [variants, setVariants] = useState([]);
  const [images, setImages] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState({});
  console.log( 'formData' ,   formData);
  console.log( 'variants' ,   variants);

  useEffect(() => {
    // Load active categories when modal opens
    if (isOpen && activeCategories.length === 0) {
      dispatch(fetchActiveCategories());
    }
  }, [isOpen, dispatch]);

  useEffect(() => {
    if (product) {
      setFormData({
        title: product.title || '',
        slug: product.slug || '',
        description: product.description || '',
        category: product.category?._id || '',
        tags: product.tags || [],
        mainImageUrl: product.mainImageUrl || '',
        isActive: product.isActive !== undefined ? product.isActive : true
      });
      
      setVariants(product.variants || []);
      
      if (product.mainImageUrl) {
        setImages([{ url: product.mainImageUrl }]);
      }
    } else {
      // Reset form for new product
      setFormData({
        title: '',
        slug: '',
        description: '',
        category: '',
        tags: [],
        mainImageUrl: '',
        isActive: true
      });
      setVariants([]);
      setImages([]);
    }
    setTagInput('');
    setErrors({});
  }, [product, isOpen]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Auto-generate slug when title changes
    if (name === 'title' && !product) {
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
  };

  const handleImageUpload = (uploadedImages) => {
    console.log( 'uploadedImages' ,   uploadedImages);
    if (uploadedImages && uploadedImages.length > 0) {
      setImages(uploadedImages);
      const firstImage = uploadedImages[0];
      const imageUrl = firstImage?.data?.url || firstImage?.url || firstImage;
      setFormData(prev => ({
        ...prev,
        mainImageUrl: imageUrl
      }));
    }
  };

  const handleImageRemove = (index) => {
    setImages([]);
    setFormData(prev => ({
      ...prev,
      mainImageUrl: ''
    }));
  };

  const handleTagInputKeyPress = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
  };

  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleVariantChange = (index, updatedVariant) => {
    const updatedVariants = [...variants];
    updatedVariants[index] = updatedVariant;
    setVariants(updatedVariants);
  };

  const handleVariantRemove = (index) => {
    const updatedVariants = variants.filter((_, i) => i !== index);
    setVariants(updatedVariants);
  };

  const addVariant = () => {
    const newVariant = {
      sku: '',
      price: 0,
      compareAtPrice: null,
      stock: 0,
      attributes: {
        size: '',
        color: ''
      },
      images: []
    };
    setVariants([...variants, newVariant]);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Product title is required';
    }

    if (!formData.slug.trim()) {
      newErrors.slug = 'Slug is required';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (variants.length === 0) {
      newErrors.variants = 'At least one variant is required';
    }

    // Validate variants
    variants.forEach((variant, index) => {
      if (!variant.attributes?.size) {
        newErrors[`variant_${index}_size`] = 'Size is required';
      }
      if (!variant.attributes?.color) {
        newErrors[`variant_${index}_color`] = 'Color is required';
      }
      if (!variant.sku) {
        newErrors[`variant_${index}_sku`] = 'SKU is required';
      }
      if (!variant.price || variant.price <= 0) {
        newErrors[`variant_${index}_price`] = 'Valid price is required';
      }
      if (variant.stock < 0) {
        newErrors[`variant_${index}_stock`] = 'Stock cannot be negative';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const productData = {
        ...formData,
        variants
      };

      if (product) {
        await dispatch(updateProduct({ 
          id: product._id, 
          productData 
        }))
        toast.success('Product updated successfully!');
      } else {
        await dispatch(createProduct(productData))
        toast.success('Product created successfully!');
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
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <form onSubmit={handleSubmit}>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 max-h-96 overflow-y-auto">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-6">
                    {product ? 'Edit Product' : 'Add New Product'}
                  </h3>
                  
                  <div className="space-y-6">
                    {/* Basic Details Section */}
                    <div className="border-b border-gray-200 pb-6">
                      <h4 className="text-md font-medium text-gray-900 mb-4">Basic Details</h4>
                      
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {/* Title */}
                        <div className="sm:col-span-2">
                          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                            Product Title *
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
                            placeholder="Enter product title"
                          />
                          {errors.title && (
                            <p className="mt-1 text-sm text-red-600">{errors.title}</p>
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
                            placeholder="product-slug"
                          />
                          {errors.slug && (
                            <p className="mt-1 text-sm text-red-600">{errors.slug}</p>
                          )}
                        </div>

                        {/* Category */}
                        <div>
                          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                            Category *
                          </label>
                          <select
                            name="category"
                            id="category"
                            value={formData.category}
                            onChange={handleInputChange}
                            className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                              errors.category ? 'border-red-300' : 'border-gray-300'
                            }`}
                          >
                            <option value="">Select Category</option>
                            { activeCategories && activeCategories.data.length > 0 && activeCategories.data.map((category) => (
                              <option key={category._id} value={category._id}>
                                {category.name}
                              </option>
                            ))}
                          </select>
                          {errors.category && (
                            <p className="mt-1 text-sm text-red-600">{errors.category}</p>
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
                            placeholder="Enter product description"
                          />
                        </div>

                        {/* Main Image */}
                        <div className="sm:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Main Product Image
                          </label>
                          <ImageUpload
                            onUpload={handleImageUpload}
                            onRemove={handleImageRemove}
                            images={images}
                            multiple={false}
                            folder="theglowrystudio/products"
                            maxFiles={1}
                          />
                        </div>

                        {/* Tags */}
                        <div className="sm:col-span-2">
                          <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
                            Tags
                          </label>
                          <div className="mt-1">
                            <input
                              type="text"
                              value={tagInput}
                              onChange={(e) => setTagInput(e.target.value)}
                              onKeyPress={handleTagInputKeyPress}
                              onBlur={addTag}
                              className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              placeholder="Enter tags (press Enter or comma to add)"
                            />
                            {formData.tags.length > 0 && (
                              <div className="mt-2 flex flex-wrap gap-2">
                                {formData.tags.map((tag, index) => (
                                  <span
                                    key={index}
                                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                                  >
                                    {tag}
                                    <button
                                      type="button"
                                      onClick={() => removeTag(tag)}
                                      className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-indigo-400 hover:bg-indigo-200 hover:text-indigo-500"
                                    >
                                      <svg className="w-2 h-2" fill="currentColor" viewBox="0 0 8 8">
                                        <path d="m0 0 1 1 3-3 3 3 1-1-3-3 3-3-1-1-3 3-3-3z"/>
                                      </svg>
                                    </button>
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Active Status */}
                        <div className="sm:col-span-2 flex items-center">
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

                    {/* Variants Section */}
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-md font-medium text-gray-900">Product Variants</h4>
                        <button
                          type="button"
                          onClick={addVariant}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          <svg className="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          Add Variant
                        </button>
                      </div>

                      {errors.variants && (
                        <p className="mb-4 text-sm text-red-600">{errors.variants}</p>
                      )}

                      <div className="space-y-4">
                        {variants.map((variant, index) => (
                          <VariantForm
                            key={index}
                            variant={variant}
                            index={index}
                            onChange={handleVariantChange}
                            onRemove={handleVariantRemove}
                            productSlug={formData.slug}
                            canRemove={variants.length > 1}
                          />
                        ))}

                        {variants.length === 0 && (
                          <div className="text-center py-8 text-gray-500">
                            <p>No variants added yet. Click "Add Variant" to get started.</p>
                          </div>
                        )}
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
                  product ? 'Update Product' : 'Create Product'
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

export default ProductFormModal;
