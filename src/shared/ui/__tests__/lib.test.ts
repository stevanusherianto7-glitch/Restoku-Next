import { describe, it, expect } from "vitest";
import { cn } from "../lib";

describe("cn utility", () => {
  it("should merge class names", () => {
    const result = cn("text-red-500", "text-blue-500");
    expect(result).toBe("text-blue-500");
  });

  it("should handle conditional classes", () => {
    const isActive = true;
    const isHidden = false;
    const result = cn("base", isActive && "active", isHidden && "hidden");
    expect(result).toContain("base");
    expect(result).toContain("active");
    expect(result).not.toContain("hidden");
  });

  it("should merge tailwind classes", () => {
    const result = cn("px-4 py-2", "px-8");
    expect(result).toBe("py-2 px-8");
  });

  it("should handle empty inputs", () => {
    const result = cn();
    expect(result).toBe("");
  });

  it("should handle array inputs", () => {
    const result = cn(["text-sm", "font-bold"], "text-lg");
    expect(result).toContain("text-lg");
    expect(result).toContain("font-bold");
  });
});
