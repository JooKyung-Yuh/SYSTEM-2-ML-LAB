/**
 * File validation utilities with magic byte verification
 * Prevents file type spoofing by checking actual file content
 */

// Magic bytes (file signatures) for common image types
const FILE_SIGNATURES = {
  // JPEG
  'image/jpeg': [
    [0xFF, 0xD8, 0xFF, 0xE0],
    [0xFF, 0xD8, 0xFF, 0xE1],
    [0xFF, 0xD8, 0xFF, 0xE2],
    [0xFF, 0xD8, 0xFF, 0xE3],
    [0xFF, 0xD8, 0xFF, 0xE8],
  ],
  // PNG
  'image/png': [
    [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A],
  ],
  // GIF
  'image/gif': [
    [0x47, 0x49, 0x46, 0x38, 0x37, 0x61], // GIF87a
    [0x47, 0x49, 0x46, 0x38, 0x39, 0x61], // GIF89a
  ],
  // WebP
  'image/webp': [
    [0x52, 0x49, 0x46, 0x46], // RIFF (first 4 bytes)
  ],
  // SVG (XML-based, harder to detect by magic bytes)
  'image/svg+xml': [
    [0x3C, 0x3F, 0x78, 0x6D, 0x6C], // <?xml
    [0x3C, 0x73, 0x76, 0x67], // <svg
  ],
};

const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

/**
 * Check if a byte array starts with a specific signature
 */
function matchesSignature(bytes: Uint8Array, signature: number[]): boolean {
  if (bytes.length < signature.length) return false;

  return signature.every((byte, index) => bytes[index] === byte);
}

/**
 * Verify file type using magic bytes (file signature)
 */
export async function verifyFileType(file: File): Promise<{ valid: boolean; detectedType?: string; error?: string }> {
  try {
    // Read first 16 bytes for signature checking
    const arrayBuffer = await file.slice(0, 16).arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);

    // Check against known signatures
    for (const [mimeType, signatures] of Object.entries(FILE_SIGNATURES)) {
      for (const signature of signatures) {
        if (matchesSignature(bytes, signature)) {
          // Verify it matches the declared MIME type
          if (file.type !== mimeType && file.type !== '') {
            return {
              valid: false,
              error: `File type mismatch: declared as ${file.type} but detected as ${mimeType}`,
            };
          }
          return {
            valid: true,
            detectedType: mimeType,
          };
        }
      }
    }

    // Special handling for WebP (check for WEBP in bytes 8-11)
    if (file.type === 'image/webp' && matchesSignature(bytes, [0x52, 0x49, 0x46, 0x46])) {
      const webpSignature = new Uint8Array(await file.slice(8, 12).arrayBuffer());
      if (matchesSignature(webpSignature, [0x57, 0x45, 0x42, 0x50])) { // WEBP
        return { valid: true, detectedType: 'image/webp' };
      }
    }

    return {
      valid: false,
      error: `Unknown or unsupported file type. Declared: ${file.type}`,
    };
  } catch (error) {
    return {
      valid: false,
      error: `Failed to verify file type: ${error}`,
    };
  }
}

/**
 * Validate file upload with comprehensive checks
 */
export async function validateFileUpload(file: File): Promise<{ valid: boolean; error?: string }> {
  // Check if file exists
  if (!file) {
    return { valid: false, error: 'No file provided' };
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File size ${(file.size / 1024 / 1024).toFixed(2)}MB exceeds maximum allowed size of ${MAX_FILE_SIZE / 1024 / 1024}MB`,
    };
  }

  // Check if file is empty
  if (file.size === 0) {
    return { valid: false, error: 'File is empty' };
  }

  // Check MIME type (declared)
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `File type ${file.type} is not allowed. Allowed types: ${ALLOWED_IMAGE_TYPES.join(', ')}`,
    };
  }

  // Verify actual file type using magic bytes
  const typeVerification = await verifyFileType(file);
  if (!typeVerification.valid) {
    return { valid: false, error: typeVerification.error };
  }

  // Validate filename
  const filename = file.name;
  if (filename.length > 255) {
    return { valid: false, error: 'Filename is too long (max 255 characters)' };
  }

  // Check for path traversal in filename
  if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
    return { valid: false, error: 'Invalid filename: contains illegal characters' };
  }

  return { valid: true };
}

/**
 * Generate a safe filename
 */
export function generateSafeFilename(originalFilename: string): string {
  // Get file extension
  const ext = originalFilename.split('.').pop()?.toLowerCase() || '';

  // Generate timestamp-based filename
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);

  return `${timestamp}-${random}.${ext}`;
}
