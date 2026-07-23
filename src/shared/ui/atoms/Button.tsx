import { ReactNode } from "react";
import { cn } from "@shared/ui/lib";
import { Spinner } from "@shared/ui/atoms/Spinner";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "accent" | "danger" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
};

const variants = {
  primary:
    "bg-cabe-600 text-white shadow-sm shadow-cabe-600/30 hover:bg-cabe-700 active:bg-cabe-800 active:scale-[0.99]",
  secondary:
    "bg-slate-100 text-slate-800 hover:bg-slate-200 active:bg-slate-300 active:scale-[0.99]",
  accent:
    "bg-emas-500 text-white shadow-sm shadow-emas-500/30 hover:bg-emas-600 active:bg-emas-700 active:scale-[0.99]",
  danger:
    "bg-rose-600 text-white shadow-sm shadow-rose-600/30 hover:bg-rose-700 active:bg-rose-800 active:scale-[0.99]",
  ghost:
    "bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900 active:bg-slate-200",
  outline:
    "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300 active:bg-slate-100",
};

const sizes = {
  sm: "px-3 py-1.5 text-caption font-semibold rounded-lg gap-1.5",
  md: "px-4 py-2.5 text-button font-semibold rounded-xl gap-2",
  lg: "px-6 py-3 text-button font-semibold rounded-xl gap-2.5",
};

export function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  leftIcon,
  rightIcon,
  className,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || isLoading}
      className={cn(
        "inline-flex items-center justify-center font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-cabe-500/40 focus:ring-offset-1 disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {isLoading ? (
        <Spinner size="sm" className="mr-1 text-current" />
      ) : (
        leftIcon
      )}
      {children}
      {!isLoading && rightIcon}
    </button>
  );
}
