/**
 * Utility for fast, 100% free client-side image compression.
 * Resizes and compresses images using HTML5 Canvas before saving to local storage.
 * Does NOT alter or delete the user's original photo on their device.
 */

export interface CompressOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0.1 to 1.0 (default 0.82)
  mimeType?: 'image/jpeg' | 'image/webp' | 'image/png';
}

export interface CompressedImageResult {
  dataUrl: string;
  originalSizeBytes: number;
  compressedSizeBytes: number;
  savedPercent: number;
  width: number;
  height: number;
}

export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Compresses an uploaded image file into an optimized Base64 data URL.
 */
export function compressImageFile(
  file: File,
  options: CompressOptions = {}
): Promise<CompressedImageResult> {
  const {
    maxWidth = 1280,
    maxHeight = 1280,
    quality = 0.78,
    mimeType = 'image/jpeg'
  } = options;

  return new Promise((resolve, reject) => {
    // If not an image, reject
    if (!file.type.startsWith('image/')) {
      reject(new Error('Selected file is not an image.'));
      return;
    }

    const originalSizeBytes = file.size;
    const reader = new FileReader();

    reader.onload = (readerEvent) => {
      const img = new Image();
      img.onload = () => {
        try {
          let { width, height } = img;

          // Calculate proportional scale factor to keep aspect ratio
          if (width > maxWidth || height > maxHeight) {
            const widthRatio = maxWidth / width;
            const heightRatio = maxHeight / height;
            const bestRatio = Math.min(widthRatio, heightRatio);

            width = Math.round(width * bestRatio);
            height = Math.round(height * bestRatio);
          }

          // Create canvas
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            // Fallback: return uncompressed data URL if canvas context is unavailable
            const rawUrl = readerEvent.target?.result as string;
            resolve({
              dataUrl: rawUrl,
              originalSizeBytes,
              compressedSizeBytes: originalSizeBytes,
              savedPercent: 0,
              width: img.width,
              height: img.height
            });
            return;
          }

          // Fill white background for transparent images converted to JPEG
          if (mimeType === 'image/jpeg') {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, width, height);
          }

          // High quality image smoothing
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';

          // Draw the resized image
          ctx.drawImage(img, 0, 0, width, height);

          // Export compressed data URL
          const compressedDataUrl = canvas.toDataURL(mimeType, quality);

          // Calculate approximate byte size of base64 string
          const base64Length = compressedDataUrl.length - (compressedDataUrl.indexOf(',') + 1);
          const compressedSizeBytes = Math.round((base64Length * 3) / 4);

          const savedBytes = Math.max(0, originalSizeBytes - compressedSizeBytes);
          const savedPercent = originalSizeBytes > 0 ? Math.round((savedBytes / originalSizeBytes) * 100) : 0;

          resolve({
            dataUrl: compressedDataUrl,
            originalSizeBytes,
            compressedSizeBytes,
            savedPercent,
            width,
            height
          });
        } catch (err) {
          // If canvas fails (e.g. cross-origin/tainted or memory), fallback to raw
          const rawUrl = readerEvent.target?.result as string;
          resolve({
            dataUrl: rawUrl,
            originalSizeBytes,
            compressedSizeBytes: originalSizeBytes,
            savedPercent: 0,
            width: img.width,
            height: img.height
          });
        }
      };

      img.onerror = () => {
        reject(new Error('Failed to load image for compression.'));
      };

      img.src = readerEvent.target?.result as string;
    };

    reader.onerror = (err) => {
      reject(err);
    };

    reader.readAsDataURL(file);
  });
}
