import { useState, type ReactNode } from "react";
import { Sidebar } from "@shared/ui/layouts/Sidebar";
import { MenuIcon } from "@shared/ui/components/icons";

interface MainLayoutProps {
  children: ReactNode;
  noScroll?: boolean;
}

export function MainLayout({ children, noScroll = false }: MainLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex h-screen w-full overflow-hidden font-sans bg-[#030303] text-slate-200">
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      <main
        className={`flex-1 ${
          noScroll
            ? "overflow-hidden p-4 md:p-5 pl-16 md:pl-20 flex flex-col min-h-0"
            : "overflow-y-auto p-6 md:p-8 pl-16 md:pl-20"
        } relative`}
      >
        {/* Floating burger toggle */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute top-3 left-3 z-30 rounded-lg border border-white/10 bg-white/5 p-2 text-slate-400 hover:bg-white/10 hover:text-white transition-all shadow-sm"
          title={isCollapsed ? "Buka sidebar" : "Tutup sidebar"}
        >
          <MenuIcon className="size-4" />
        </button>

        {/* Background decoration */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.04),transparent_60%)] pointer-events-none" />

        <div className={`relative z-10 ${noScroll ? "flex-1 min-h-0 flex flex-col w-full h-full overflow-hidden" : ""}`}>
          {children}
        </div>
      </main>
    </div>
  );
}
