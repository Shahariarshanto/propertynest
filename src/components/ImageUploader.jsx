import { useState, useRef } from 'react';
import { imageService } from '../services/imageService';
import { UploadCloud, X, Loader2, Image as ImageIcon, Plus, Link as LinkIcon } from 'lucide-react';

export function ImageUploader({
  images = [],
  onChange,
  maxImages = 5,
  label = 'Property Photos',
  helperText = 'Upload high-quality photos (PNG, JPG, WebP up to 32MB)',
  single = false,
}) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const [error, setError] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  // Filter out empty strings
  const validImages = Array.isArray(images) ? images.filter(Boolean) : [];
  const remainingSlots = maxImages - validImages.length;

  const handleFiles = async (files) => {
    if (!files || files.length === 0) return;
    setError('');

    const fileList = Array.from(files).filter((file) => file.type.startsWith('image/'));

    if (fileList.length === 0) {
      setError('Please select valid image files (PNG, JPG, WebP, etc.).');
      return;
    }

    const toUpload = fileList.slice(0, remainingSlots);
    if (toUpload.length < fileList.length) {
      setError(`You can only upload up to ${maxImages} images in total.`);
    }

    setUploading(true);

    try {
      const newUrls = [];
      for (let i = 0; i < toUpload.length; i++) {
        setUploadProgress(`Uploading ${i + 1} of ${toUpload.length}...`);
        const res = await imageService.upload(toUpload[i]);
        newUrls.push(res.url);
      }

      if (single) {
        onChange(newUrls.slice(0, 1));
      } else {
        onChange([...validImages, ...newUrls]);
      }
    } catch (err) {
      setError(err.message || 'Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
      setUploadProgress('');
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (uploading || remainingSlots <= 0) return;
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!uploading && remainingSlots > 0) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleRemove = (indexToRemove) => {
    const updated = validImages.filter((_, idx) => idx !== indexToRemove);
    onChange(updated);
  };

  const handleAddUrl = (e) => {
    e.preventDefault();
    const trimmed = urlInput.trim();
    if (!trimmed) return;
    if (single) {
      onChange([trimmed]);
    } else {
      onChange([...validImages, trimmed]);
    }
    setUrlInput('');
    setShowUrlInput(false);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-sm font-semibold text-gray-800">{label}</label>
          {helperText && <p className="text-xs text-gray-500">{helperText}</p>}
        </div>
        <span className="text-xs font-medium text-gray-400">
          {validImages.length} / {maxImages}
        </span>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-2.5 rounded-xl bg-red-50 text-red-600 text-xs flex items-center justify-between">
          <span>{error}</span>
          <button type="button" onClick={() => setError('')} className="text-red-400 hover:text-red-600">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Upload Dropzone */}
      {remainingSlots > 0 && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => !uploading && fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer ${
            isDragOver
              ? 'border-brand-500 bg-brand-50/60 shadow-inner'
              : 'border-gray-200 hover:border-brand-300 hover:bg-gray-50/50 bg-white'
          } ${uploading ? 'pointer-events-none opacity-80' : ''}`}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple={!single}
            accept="image/*"
            onChange={(e) => handleFiles(e.target.files)}
            className="hidden"
          />

          <div className="flex flex-col items-center justify-center gap-2">
            {uploading ? (
              <>
                <Loader2 size={32} className="text-brand-600 animate-spin" />
                <p className="text-sm font-semibold text-brand-700">{uploadProgress || 'Uploading to ImgBB...'}</p>
                <p className="text-xs text-gray-400">Please wait while your image is hosted</p>
              </>
            ) : (
              <>
                <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mb-1">
                  <UploadCloud size={24} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    <span className="text-brand-600 underline">Click to upload</span> or drag & drop
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Images are hosted securely on ImgBB CDN
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Manual URL Input Toggle */}
      {remainingSlots > 0 && (
        <div>
          {!showUrlInput ? (
            <button
              type="button"
              onClick={() => setShowUrlInput(true)}
              className="text-xs text-brand-600 hover:text-brand-700 font-medium inline-flex items-center gap-1"
            >
              <LinkIcon size={12} /> Or enter an image URL directly
            </button>
          ) : (
            <form onSubmit={handleAddUrl} className="flex gap-2 items-center">
              <input
                type="url"
                placeholder="https://example.com/photo.jpg"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                className="input-field text-xs py-2 flex-1"
                autoFocus
              />
              <button type="submit" className="btn-brand text-xs py-2 px-3">
                Add
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowUrlInput(false);
                  setUrlInput('');
                }}
                className="btn-ghost text-xs py-2 px-2"
              >
                Cancel
              </button>
            </form>
          )}
        </div>
      )}

      {/* Image Preview Grid */}
      {validImages.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-2">
          {validImages.map((url, index) => (
            <div
              key={`${url}-${index}`}
              className="group relative rounded-xl overflow-hidden aspect-video bg-gray-100 border border-gray-200 shadow-sm"
            >
              <img
                src={url}
                alt={`Photo ${index + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://placehold.co/600x400?text=Invalid+Image';
                }}
              />

              {/* Cover badge on first image */}
              {index === 0 && !single && (
                <span className="absolute top-2 left-2 bg-brand-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
                  Cover Photo
                </span>
              )}

              {/* Remove Button */}
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/60 hover:bg-red-600 text-white flex items-center justify-center transition-colors shadow"
                title="Remove image"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
