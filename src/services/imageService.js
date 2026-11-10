const IMGBB_API_KEY =
  import.meta.env.VITE_IMGBB_API_KEY || 'e7f38d76a3467d93200d066b34e7f849';

const UPLOAD_URL = 'https://api.imgbb.com/1/upload';

export const imageService = {
  /**
   * Upload an image file or base64 data to ImgBB
   * @param {File | Blob | string} fileOrData
   * @returns {Promise<{ url: string, displayUrl: string, thumbUrl: string }>}
   */
  async upload(fileOrData) {
    if (!IMGBB_API_KEY) {
      throw new Error('ImgBB API key is not configured.');
    }

    if (!fileOrData) {
      throw new Error('No image file selected.');
    }

    // Size validation: max 32MB
    if (fileOrData.size && fileOrData.size > 32 * 1024 * 1024) {
      throw new Error('Image size exceeds 32MB limit.');
    }

    const formData = new FormData();
    formData.append('image', fileOrData);

    try {
      const response = await fetch(`${UPLOAD_URL}?key=${IMGBB_API_KEY}`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error?.message || 'Failed to upload image to ImgBB.');
      }

      return {
        url: result.data.url,
        displayUrl: result.data.display_url,
        thumbUrl: result.data.thumb?.url || result.data.url,
        deleteUrl: result.data.delete_url,
      };
    } catch (err) {
      console.error('ImgBB upload error:', err);
      throw new Error(err.message || 'Image upload failed. Please check your internet connection.');
    }
  },

  /**
   * Upload multiple image files in parallel or sequence
   * @param {FileList | File[]} files
   * @returns {Promise<string[]>} array of uploaded image URLs
   */
  async uploadMultiple(files) {
    const fileArray = Array.from(files);
    const results = await Promise.all(fileArray.map((f) => this.upload(f)));
    return results.map((r) => r.url);
  },
};
