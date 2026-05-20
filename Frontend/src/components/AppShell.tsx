import type { PropsWithChildren } from "react";
import type { NavLinkRenderProps } from "react-router-dom";
import { Link, NavLink } from "react-router-dom";

export function AppShell({ children }: PropsWithChildren) {
  function navClassName({
    isActive,
  }: NavLinkRenderProps, activeClasses: string, inactiveClasses: string) {
    return `rounded-full px-4 py-2 text-sm font-semibold ${isActive ? activeClasses : inactiveClasses}`;
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-white/70 bg-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="text-lg font-extrabold tracking-tight text-ink-950">
            Mini Workflow Tracker
          </Link>
          <nav className="flex items-center gap-3">
            <NavLink
              to="/"
              className={(props: NavLinkRenderProps) =>
                navClassName(props, "bg-ink-900 text-white", "text-ink-700 hover:bg-white")
              }
            >
              Applications
            </NavLink>
            <NavLink
              to="/applications/new"
              className={(props: NavLinkRenderProps) =>
                navClassName(
                  props,
                  "bg-accent-600 text-white",
                  "bg-teal-50 text-teal-700 hover:bg-teal-100",
                )
              }
            >
              New Draft
            </NavLink>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
