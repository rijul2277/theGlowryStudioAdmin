import React from 'react';
import { generateSKU } from '../../utils/helpers';
import ImageUpload from '../Common/ImageUpload';

const VariantForm = ({ 
  variant, 
  index, 
  onChange, 
  onRemove, 
  productSlug,
  canRemove = true 
}) => {
  const handleInputChange = (field, value) => {
    const updatedVariant = { ...variant, [field]: value };
    
    // Auto-generate SKU when size, color, or product slug changes
    if (field === 'size' || field === 'color' || productSlug) {
      const size = field === 'size' ? value : variant.size;
      const color = field === 'color' ? value : variant.color;
      if (size && color && productSlug) {
        updatedVariant.sku = generateSKU(productSlug, size, color);
      }
    }
    
    onChange(index, updatedVariant);
  };

  const handleAttributeChange = (key, value) => {
    const updatedAttributes = { ...variant.attributes, [key]: value };
    const updatedVariant = { ...variant, attributes: updatedAttributes };
    
    // Auto-generate SKU when size or color changes
    if (key === 'size' || key === 'color') {
      const size = key === 'size' ? value : variant.attributes?.size;
      const color = key === 'color' ? value : variant.attributes?.color;
      if (size && color && productSlug) {
        updatedVariant.sku = generateSKU(productSlug, size, color);
      }
    }
    
    onChange(index, updatedVariant);
  };

  const handleImageUpload = (images) => {
    console.log( 'variant images' ,   images);
    // Extract only URLs from the image objects
    const imageUrls = images.map(img => img.url || img);
    onChange(index, { ...variant, images: imageUrls });
  };

  const handleImageRemove = (imageIndex) => {
    const updatedImages = variant.images.filter((_, i) => i !== imageIndex);
    onChange(index, { ...variant, images: updatedImages });
  };

  const sizeOptions = [
    'XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size'
  ];

  const colorOptions = [
    'Black', 'White', 'Red', 'Blue', 'Green', 'Yellow', 
    'Pink', 'Purple', 'Grey', 'Brown', 'Beige', 'Navy', 
    'Maroon', 'Orange', 'Custom'
  ];

  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-sm font-medium text-gray-900">Variant {index + 1}</h4>
        {canRemove && (
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="text-red-600 hover:text-red-800 text-sm"
          >
            Remove
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Size */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Size *
          </label>
          <select
            value={variant.attributes?.size || ''}
            onChange={(e) => handleAttributeChange('size', e.target.value)}
            className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          >
            <option value="">Select Size</option>
            {sizeOptions && sizeOptions.length > 0 && sizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        {/* Color */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Color *
          </label>
          <select
            value={variant.attributes?.color || ''}
            onChange={(e) => handleAttributeChange('color', e.target.value)}
            className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          >
            <option value="">Select Color</option>
            {colorOptions && colorOptions.length > 0 && colorOptions.map((color) => (
              <option key={color} value={color}>
                {color}
              </option>
            ))}
          </select>
        </div>

        {/* SKU */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            SKU *
          </label>
          <input
            type="text"
            value={variant.sku || ''}
            onChange={(e) => handleInputChange('sku', e.target.value)}
            className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Auto-generated"
            required
          />
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Price (₹) *
          </label>
          <input
            type="number"
            value={variant.price || ''}
            onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
            className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="0.00"
            min="0"
            step="0.01"
            required
          />
        </div>

        {/* Compare At Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Compare At Price (₹)
          </label>
          <input
            type="number"
            value={variant.compareAtPrice || ''}
            onChange={(e) => handleInputChange('compareAtPrice', parseFloat(e.target.value) || null)}
            className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="0.00"
            min="0"
            step="0.01"
          />
        </div>

        {/* Stock */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Stock Quantity *
          </label>
          <input
            type="number"
            value={variant.stock || ''}
            onChange={(e) => handleInputChange('stock', parseInt(e.target.value) || 0)}
            className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="0"
            min="0"
            required
          />
        </div>
      </div>

      {/* Variant Images */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Variant Images
        </label>
        <ImageUpload
          onUpload={handleImageUpload}
          onRemove={handleImageRemove}
          images={variant.images?.map(url => ({ url })) || []}
          multiple={true}
          folder="theglowrystudio/products/variants"
          maxFiles={5}
        />
      </div>
    </div>
  );
};

export default VariantForm;
