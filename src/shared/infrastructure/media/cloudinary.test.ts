import { describe, it, expect } from "vitest";
import {
  CLOUDINARY_CLOUD_NAME,
  getCloudinaryUrl,
  MENU_IMAGE_FALLBACK,
} from "@shared/infrastructure/media/cloudinary";

describe("cloudinary helper", () => {
  it("returns the local fallback when ref is null/undefined/empty", () => {
    expect(getCloudinaryUrl(null)).toBe(MENU_IMAGE_FALLBACK);
    expect(getCloudinaryUrl(undefined)).toBe(MENU_IMAGE_FALLBACK);
    expect(getCloudinaryUrl("")).toBe(MENU_IMAGE_FALLBACK);
  });

  it("returns a full URL unchanged (backend-resolved)", () => {
    const url = "https://example.com/menu/nasi.jpg";
    expect(getCloudinaryUrl(url)).toBe(url);
    expect(getCloudinaryUrl("data:image/png;base64,xxxx")).toBe(
      "data:image/png;base64,xxxx"
    );
  });

  it("builds a Cloudinary delivery URL from a public_id", () => {
    const url = getCloudinaryUrl("menu/nasi-goreng", { width: 400, height: 400, crop: "fill" });
    expect(url).toBe(
      `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/w_400,h_400,c_fill,q_auto,f_auto/menu/nasi-goreng`
    );
  });

  it("uses default transform when none provided", () => {
    const url = getCloudinaryUrl("menu/es-teh");
    expect(url).toContain("/image/upload/");
    expect(url.endsWith("/menu/es-teh")).toBe(true);
    expect(url).toContain("q_auto");
    expect(url).toContain("f_auto");
  });
});
