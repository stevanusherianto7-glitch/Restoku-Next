import { ReactNode } from "react";
import { MainLayout } from "@shared/ui/layouts/MainLayout";

interface AdminLayoutProps {
  children: ReactNode;
  title?: string;
}

export function AdminLayout({ children, title }: AdminLayoutProps) {
  return (
    <MainLayout>
      <div className="mx-auto max-w-7xl">
        {title && (
          <div className="mb-6">
            <h1 className="text-h1 font-bold text-white">{title}</h1>
          </div>
        )}
        {children}
      </div>
    </MainLayout>
  );
}
