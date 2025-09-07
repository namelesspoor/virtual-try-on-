
import React, { useState, useRef, useCallback } from 'react';
import { UploadIcon } from './icons/UploadIcon';

interface ImageUploadProps {
  title: string;
  description: string;
  onImageSelect: (file: File | null) => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ title, description, onImageSelect }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      onImageSelect(file);
    } else {
      setPreview(null);
      onImageSelect(null);
    }
  }, [onImageSelect]);

  const handleDrop = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
       if (fileInputRef.current) {
        fileInputRef.current.files = event.dataTransfer.files;
        const changeEvent = new Event('change', { bubbles: true });
        fileInputRef.current.dispatchEvent(changeEvent);
      }
    }
  }, []);

  const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };
  
  const handleAreaClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center">
      <h3 className="text-xl font-semibold text-gray-700 mb-1">{title}</h3>
      <p className="text-sm text-gray-500 mb-4">{description}</p>
      <label
        htmlFor={`file-upload-${title.replace(/\s+/g, '-')}`}
        className="w-full h-80 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-300 relative overflow-hidden"
        onClick={handleAreaClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {preview ? (
          <img src={preview} alt="Preview" className="w-full h-full object-cover" />
        ) : (
          <div className="text-center text-gray-500">
            <UploadIcon />
            <p className="mt-2 font-semibold">Click to upload or drag & drop</p>
            <p className="text-xs">PNG, JPG, or WEBP</p>
          </div>
        )}
        <input
          id={`file-upload-${title.replace(/\s+/g, '-')}`}
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept="image/png, image/jpeg, image/webp"
          onChange={handleFileChange}
        />
      </label>
    </div>
  );
};
