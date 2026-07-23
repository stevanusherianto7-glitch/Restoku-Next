import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "@features/auth/ui/stores/useAuthStore";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  LogoutIcon,
} from "@shared/ui/components/icons";
import {
  navigation,
  ROLE_LABEL,
  ROLE_BADGE,
  ROLE_AVATAR,
  type Role,
} from "@shared/ui/layouts/navigation";

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
}

export function Sidebar({ isCollapsed, setIsCollapsed }: SidebarProps) {
  const [open, setOpen] = useState<string[]>(["Utama"]);
  const location = useLocation();
  const { user, logout } = useAuthStore();

  const activeRole = (user?.role ?? "kasir") as Role;

  const visibleNav = navigation
    .map((group) => ({
      ...group,
      items: group.items.filter((i) => i.roles.includes(activeRole)),
    }))
    .filter((group) => group.roles.includes(activeRole) && group.items.length > 0);

  // Auto-expand group containing current route.
  // Deferred to a microtask so the state update is not applied synchronously
  // within the effect body (avoids cascading-render lint/runtime warning).
  useEffect(() => {
    const activeGroup = visibleNav.find((group) =>
      group.items.some((item) => item.href === location.pathname)
    );
    if (!activeGroup) return;
    queueMicrotask(() =>
      setOpen((o) => (o.includes(activeGroup.title) ? o : [...o, activeGroup.title]))
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <aside
      className={`flex h-full shrink-0 flex-col p-4 transition-all duration-500 relative bg-[#030303] border-r border-white/5 ${
        isCollapsed ? "w-[80px]" : "w-64"
      }`}
    >
      {/* Brand */}
      <div className={`mb-6 flex items-center ${isCollapsed ? "justify-center" : "justify-start gap-2.5"}`}>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cabe-500 to-emas-500 shadow-md shadow-cabe-500/20">
          <span className="text-lg font-black text-white">R</span>
        </div>
        {!isCollapsed && (
          <div>
            <h1 className="text-lg font-black tracking-tight text-white">Restoku</h1>
            <p className="text-[10px] font-bold text-cabe-400 uppercase tracking-widest">POS & Resto OS</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-x-hidden overflow-y-auto pr-1">
        {visibleNav.map(({ title, Icon, items }) => {
          const isGroupActive = items.some((i) => i.href === location.pathname);
          return (
            <div key={title} className="mb-2">
              <button
                type="button"
                onClick={() => {
                  if (isCollapsed) setIsCollapsed(false);
                  setOpen((o) => (o.includes(title) ? o.filter((x) => x !== title) : [...o, title]));
                }}
                className={`flex w-full items-center ${
                  isCollapsed ? "justify-center" : "justify-between"
                } rounded-xl px-3 py-2.5 text-sm transition-all duration-300 ease-out ${
                  isGroupActive
                    ? "text-white font-bold bg-white/[0.06]"
                    : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]"
                }`}
              >
                <span className="flex items-center gap-2.5 relative">
                  <Icon className={`size-4 shrink-0 ${isGroupActive ? "text-cabe-400" : ""}`} />
                  {!isCollapsed && <span className="font-semibold">{title}</span>}
                </span>
                {!isCollapsed &&
                  (open.includes(title) ? (
                    <ChevronDownIcon className="size-3 opacity-50" />
                  ) : (
                    <ChevronRightIcon className="size-3 opacity-50" />
                  ))}
              </button>
              {!isCollapsed && open.includes(title) && (
                <div className="mt-1 space-y-0.5 pl-3 border-l border-white/5 ml-4">
                  {items.map((i) => {
                    const isActive = location.pathname === i.href;
                    return (
                      <Link
                        key={i.name}
                        to={i.href}
                        className={`w-full text-left rounded-lg px-3 py-2 text-[13px] transition-all duration-200 ease-out flex items-center justify-between gap-2 ${
                          isActive
                            ? "text-white font-bold bg-cabe-600/90 shadow-sm shadow-cabe-600/30"
                            : "text-slate-400 hover:text-slate-200 hover:translate-x-1"
                        }`}
                      >
                        <span className="truncate">{i.name}</span>
                        {isActive && <span className="text-[10px]">●</span>}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* User Profile Card */}
      <div className="mt-4 rounded-xl border border-white/5 bg-white/[0.02] p-2.5 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <div
            className={`grid size-8 shrink-0 place-items-center rounded-full font-bold text-xs uppercase ${
              ROLE_AVATAR[activeRole] ?? ROLE_AVATAR.kasir
            }`}
          >
            {user?.name ? user.name.charAt(0) : ROLE_LABEL[activeRole]?.charAt(0)}
          </div>
          {!isCollapsed && (
            <div className="min-w-0 flex-1 flex flex-col justify-center">
              {user?.name && (
                <span className="text-[11px] font-bold text-slate-200 truncate leading-tight" title={user.name}>
                  {user.name}
                </span>
              )}
              <span
                className={`mt-0.5 inline-block shrink-0 text-[9px] font-extrabold px-1.5 py-0.5 rounded-full tracking-wider uppercase leading-none w-fit ${
                  ROLE_BADGE[activeRole] ?? ROLE_BADGE.kasir
                }`}
              >
                {ROLE_LABEL[activeRole] ?? "Kasir"}
              </span>
            </div>
          )}
        </div>
        <button
          onClick={handleLogout}
          className="shrink-0 p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
          title="Logout"
        >
          <LogoutIcon className="size-4" />
        </button>
      </div>
    </aside>
  );
}
