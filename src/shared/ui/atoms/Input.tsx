import { InputHTMLAttributes, ReactNode, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, leftIcon, rightIcon, className = "", ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="mb-1.5 block text-caption font-semibold uppercase tracking-wider text-slate-600">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="pointer-events-none absolute left-3.5 text-slate-400">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            className={`w-full rounded-xl border border-slate-200 bg-white py-2.5 text-body text-slate-900 placeholder-slate-400 transition-all duration-150 focus:border-cabe-500 focus:outline-none focus:ring-4 focus:ring-cabe-500/10 disabled:cursor-not-allowed disabled:bg-slate-50 ${
              leftIcon ? "pl-10" : "pl-4"
            } ${rightIcon ? "pr-10" : "pr-4"} ${
              error ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500/10" : ""
            } ${className}`}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3.5 text-slate-400">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <p className="mt-1 text-caption text-rose-500 font-medium">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
