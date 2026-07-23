import { ReactNode } from "react";

export type BadgeVariant =
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "neutral";

export type BadgeSize = "sm" | "md";

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  primary: "bg-cabe-50 text-cabe-700 border border-cabe-200/60",
  secondary: "bg-emas-50 text-emas-700 border border-emas-200/60",
  success: "bg-emerald-50 text-emerald-700 border border-emerald-200/60",
  warning: "bg-amber-50 text-amber-700 border border-amber-200/60",
  danger: "bg-rose-50 text-rose-700 border border-rose-200/60",
  info: "bg-sky-50 text-sky-700 border border-sky-200/60",
  neutral: "bg-slate-100 text-slate-700 border border-slate-200/60",
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: "px-2 py-0.5 text-caption font-semibold rounded-md",
  md: "px-2.5 py-1 text-caption font-semibold rounded-lg",
};

export function Badge({
  children,
  variant = "neutral",
  size = "sm",
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 tracking-wide ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </span>
  );
}
