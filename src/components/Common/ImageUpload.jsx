import React, { useState, useRef } from 'react';
import { uploadService } from '../../services/uploadService';
import { FILE_UPLOAD } from '../../utils/constants';
import { formatFileSize, isValidFileType, isValidFileSize } from '../../utils/helpers';
import LoadingSpinner from './LoadingSpinner';

const ImageUpload = ({ 
  onUpload, 
  onRemove, 
  images = [], 
  multiple = false, 
  folder = 'theglowrystudio',
  maxFiles = 5,
  className = ""
}) => {
  // Ensure images is always an array
  const safeImages = Array.isArray(images) ? images : [];
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const fileInputRef = useRef(null);

  console.log( 'safeImages' ,   safeImages);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
  };

  const handleFiles = async (files) => {
    // Validate files
    const validFiles = files.filter(file => {
      if (!isValidFileType(file, FILE_UPLOAD.ALLOWED_TYPES)) {
        alert(`File ${file.name} is not a valid image type.`);
        return false;
      }
      if (!isValidFileSize(file, FILE_UPLOAD.MAX_SIZE)) {
        alert(`File ${file.name} is too large. Maximum size is ${formatFileSize(FILE_UPLOAD.MAX_SIZE)}.`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    // Check max files limit
    if (safeImages.length + validFiles.length > maxFiles) {
      alert(`Maximum ${maxFiles} files allowed.`);
      return;
    }

    setUploading(true);

    try {
      if (multiple) {
        // Upload multiple files
        const response = await uploadService.uploadImages(validFiles, folder);

        console.log( 'variant images response for multiple' ,   response);
        if (response.data.success) {
            const newImages = response.data.data?.images || response.data.images || [];
          // For multiple uploads, append to existing images
          onUpload([...safeImages, ...newImages]);
        } else {
          throw new Error(response.data.message || 'Upload failed');
        }
      } else {
        // Upload single file
        const response = await uploadService.uploadImage(validFiles[0], folder);

        console.log( 'variant images response for single' ,   response);
        if (response.data.success) {
          const newImage = response.data.data || response.data;
          // For single upload, replace existing images
          onUpload([newImage]);
        } else {
          throw new Error(response.data.message || 'Upload failed');
        }
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert(error.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
      setUploadProgress({});
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveImage = (index) => {
    onRemove(index);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          isDragging
            ? 'border-indigo-500 bg-indigo-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept={FILE_UPLOAD.ALLOWED_TYPES.join(',')}
          onChange={handleFileSelect}
          className="hidden"
        />
        
        {uploading ? (
          <div className="flex flex-col items-center">
            <LoadingSpinner size="lg" />
            <p className="mt-2 text-sm text-gray-600">Uploading images...</p>
          </div>
        ) : (
          <div className="space-y-2">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="text-sm text-gray-600">
              <button
                type="button"
                onClick={openFileDialog}
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Click to upload
              </button>
              <span> or drag and drop</span>
            </div>
            <p className="text-xs text-gray-500">
              PNG, JPG, GIF up to {formatFileSize(FILE_UPLOAD.MAX_SIZE)}
              {multiple && ` (max ${maxFiles} files)`}
            </p>
          </div>
        )}
      </div>

      {/* Image Previews */}
      {safeImages && safeImages.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {safeImages && safeImages.length > 0 && safeImages.map((image, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={image?.data?.url || image?.url || image}
                  alt={`Upload ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
