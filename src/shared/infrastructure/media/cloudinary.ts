/**
 * Cloudinary media helper.
 *
 * Restoku stores Cloudinary `public_id` (e.g. "menu/nasi-goreng-spesial") or full image URLs in
 * `MenuItem.image_url`. This helper derives a Cloudinary CDN delivery URL with on-the-fly
 * transformations (width/height/quality/format auto).
 *
 * The cloud name is public by design (required in the delivery URL) and is
 * safe to ship to the browser. Set VITE_CLOUDINARY_CLOUD_NAME to override.
 */

export const CLOUDINARY_CLOUD_NAME =
  import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "dwdaydzsh";

const UPLOAD_DELIVERY_BASE = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload`;
const FETCH_DELIVERY_BASE = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/fetch`;

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

function buildTransformSegment(t: CloudinaryTransform): string {
  const parts: string[] = [];
  if (t.width) parts.push(`w_${t.width}`);
  if (t.height) parts.push(`h_${t.height}`);
  if (t.crop) parts.push(`c_${t.crop}`);
  parts.push(`q_${t.quality ?? "auto"}`);
  parts.push(`f_${t.format ?? "auto"}`);
  return parts.join(",");
}

/**
 * Resolve a menu image reference to a Cloudinary delivery URL with dynamic CDN transformation.
 * Supports both Cloudinary public_ids and HTTP/HTTPS image URLs.
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

  // External HTTP/HTTPS URLs — return as-is for 100% rendering stability
  if (/^https?:\/\//i.test(ref)) {
    return ref;
  }

  const segment = buildTransformSegment(transform);

  // Cloudinary public_id — deliver via Cloudinary Upload API
  return `${UPLOAD_DELIVERY_BASE}/${segment}/${ref}`;
}
