/**
 * Image compression and optimization utilities
 */

export interface CompressOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  mimeType?: string;
}

/**
 * Compress an image file before upload
 * @param file The image file to compress
 * @param options Compression options
 * @returns Compressed image blob
 */
export const compressImage = async (
  file: File,
  options: CompressOptions = {}
): Promise<Blob> => {
  const {
    maxWidth = 1920,
    maxHeight = 1920,
    quality = 0.8,
    mimeType = "image/jpeg",
  } = options;

  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      reject(new Error("Failed to get canvas context"));
      return;
    }

    img.onload = () => {
      // Calculate new dimensions while maintaining aspect ratio
      let { width, height } = img;

      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      // Set canvas dimensions and draw resized image
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      // Convert to blob
      canvas.toBlob(
        (blob) => {
          if (blob) {
            console.log(
              `Image compressed: ${(file.size / 1024).toFixed(2)}KB → ${(
                blob.size / 1024
              ).toFixed(2)}KB`
            );
            resolve(blob);
          } else {
            reject(new Error("Failed to compress image"));
          }
        },
        mimeType,
        quality
      );

      // Cleanup
      URL.revokeObjectURL(img.src);
    };

    img.onerror = () => {
      reject(new Error("Failed to load image"));
      URL.revokeObjectURL(img.src);
    };

    img.src = URL.createObjectURL(file);
  });
};

/**
 * Validate image file before upload
 * @param file The file to validate
 * @param maxSizeMB Maximum file size in MB
 * @returns Validation result
 */
export const validateImageFile = (
  file: File,
  maxSizeMB: number = 10
): { valid: boolean; error?: string } => {
  // Check if it's an image
  if (!file.type.startsWith("image/")) {
    return { valid: false, error: "Please upload an image file" };
  }

  // Check file size
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return {
      valid: false,
      error: `Image size must be less than ${maxSizeMB}MB`,
    };
  }

  return { valid: true };
};

/**
 * Generate a unique filename for uploaded images
 * @param originalName Original filename
 * @returns Unique filename with timestamp and random string
 */
export const generateUniqueFilename = (originalName: string): string => {
  const ext = originalName.split(".").pop()?.toLowerCase() || "jpg";
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(7);
  return `${timestamp}-${random}.${ext}`;
};
