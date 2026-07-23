import { ReactNode } from "react";
import { Card } from "@shared/ui/atoms/Card";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  change?: number;
  changeLabel?: string;
  icon: ReactNode;
  iconBgColor?: string;
  iconTextColor?: string;
}

export function StatCard({
  title,
  value,
  subtitle,
  change,
  changeLabel = "dari kemarin",
  icon,
  iconBgColor = "bg-cabe-50",
  iconTextColor = "text-cabe-600",
}: StatCardProps) {
  const isPositive = change !== undefined && change >= 0;

  return (
    <Card hoverable className="relative overflow-hidden">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-caption font-semibold uppercase tracking-wider text-slate-500">{title}</p>
          <h3 className="mt-2 text-display font-bold tracking-tight text-slate-900">
            {value}
          </h3>

          {change !== undefined ? (
            <div className="mt-2 flex items-center gap-1 text-caption font-semibold">
              <span
                className={`inline-flex items-center rounded-full px-2 py-0.5 ${
                  isPositive
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                    : "bg-rose-50 text-rose-700 border border-rose-200/60"
                }`}
              >
                {isPositive ? "↑" : "↓"} {Math.abs(change)}%
              </span>
              <span className="text-slate-500 font-normal">{changeLabel}</span>
            </div>
          ) : subtitle ? (
            <p className="mt-2 text-caption font-medium text-slate-500">{subtitle}</p>
          ) : null}
        </div>

        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${iconBgColor} ${iconTextColor} shadow-sm border border-slate-100`}
        >
          {icon}
        </div>
      </div>
    </Card>
  );
}
