import { describe, it, expect } from "vitest";
import { cn } from "@shared/ui/lib";

describe("cn utility", () => {
  it("should merge class names", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("should handle conditional classes with clsx", () => {
    const showHidden = false;
    expect(cn("base", showHidden && "hidden", "visible")).toBe("base visible");
  });

  it("should merge conflicting tailwind classes", () => {
    expect(cn("px-4", "px-8")).toBe("px-8");
  });

  it("should handle undefined and null inputs", () => {
    expect(cn("base", undefined, null)).toBe("base");
  });

  it("should handle empty inputs", () => {
    expect(cn()).toBe("");
  });

  it("should handle array inputs", () => {
    expect(cn(["foo", "bar"])).toBe("foo bar");
  });

  it("should handle object inputs", () => {
    expect(cn({ active: true, disabled: false })).toBe("active");
  });
});
