/**
 * Cloudinary media helper & Client-side WebP converter.
 *
 * Restoku stores Cloudinary `public_id` (e.g. "menu/nasi-goreng-spesial") or full image URLs in
 * `MenuItem.image_url`. This helper derives a Cloudinary CDN delivery URL with on-the-fly
 * transformations (width/height/quality/format webp).
 *
 * The cloud name is public by design (required in the delivery URL) and is
 * safe to ship to the browser. Set VITE_CLOUDINARY_CLOUD_NAME to override.
 */

export const CLOUDINARY_CLOUD_NAME =
  import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "dwdaydzsh";

const UPLOAD_DELIVERY_BASE = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload`;
export const FETCH_DELIVERY_BASE = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/fetch`;

export interface CloudinaryTransform {
  width?: number;
  height?: number;
  quality?: number | "auto";
  format?: "auto" | "webp" | "jpg" | "png";
  crop?: "fill" | "scale" | "thumb";
}

/** A lightweight local fallback used when a Cloudinary asset fails to load. */
export const MENU_IMAGE_FALLBACK =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><rect width="100%" height="100%" fill="#f1f5f9"/><path d="M60 250l60-60 50 50 70-80 60 70" fill="none" stroke="#cbd5e1" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/><circle cx="150" cy="140" r="22" fill="#cbd5e1"/></svg>`
  );

/** Authentic Halal Indonesia logo Cloudinary CDN public_id & delivery URL */
export const HALAL_LOGO_PUBLIC_ID = "Halal_Indonesia_Logo_purple";
export const HALAL_LOGO_URL = getCloudinaryUrl("Halal_Indonesia_Logo_purple");

function buildTransformSegment(t: CloudinaryTransform): string {
  const parts: string[] = [];
  if (t.width) parts.push(`w_${t.width}`);
  if (t.height) parts.push(`h_${t.height}`);
  if (t.crop) parts.push(`c_${t.crop}`);
  parts.push(`q_${t.quality ?? "auto"}`);
  parts.push(`f_${t.format ?? "webp"}`);
  return parts.join(",");
}

/**
 * Resolve a menu image reference to a Cloudinary delivery URL with dynamic CDN transformation.
 * Automatically converts to WebP format by default.
 * 
 * @param ref `public_id` (e.g. "menu/nasi-goreng") or a full HTTP(S) image URL.
 * @param transform optional on-the-fly transformations (width, height, crop, quality, format).
 */
export function getCloudinaryUrl(
  ref: string | null | undefined,
  transform: CloudinaryTransform = {}
): string {
  if (!ref) return MENU_IMAGE_FALLBACK;
  if (/^data:/i.test(ref)) return ref;

  // External HTTP/HTTPS URLs — return as-is
  if (/^https?:\/\//i.test(ref)) {
    return ref;
  }

  const segment = buildTransformSegment(transform);

  // Cloudinary public_id — deliver via Cloudinary Upload API (auto-convert to WebP)
  return `${UPLOAD_DELIVERY_BASE}/${segment}/${ref}`;
}

/**
 * Convert any local image File (JPG, PNG, GIF) into WebP format client-side.
 * @param file The image File object from input[type="file"]
 * @param quality Compression quality between 0.1 and 1.0 (default: 0.85)
 * @returns Promise<string> WebP Data URL string (`data:image/webp;base64,...`)
 */
export function convertFileToWebp(file: File, quality = 0.85): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("File yang diunggah harus berupa gambar"));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Canvas context creation failed"));
          return;
        }
        ctx.drawImage(img, 0, 0);
        const webpDataUrl = canvas.toDataURL("image/webp", quality);
        resolve(webpDataUrl);
      };
      img.onerror = () => reject(new Error("Gagal membaca file gambar"));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error("Gagal membaca file"));
    reader.readAsDataURL(file);
  });
}
