import { cn } from "@shared/ui/lib";

type SpinnerProps = {
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizes = {
  sm: "h-4 w-4",
  md: "h-8 w-8",
  lg: "h-12 w-12",
};

export function Spinner({ size = "md", className }: SpinnerProps) {
  return (
    <div
      className={cn(
        "animate-spin rounded-full border-2 border-gray-300 border-t-cabe-600",
        sizes[size],
        className
      )}
    />
  );
}
