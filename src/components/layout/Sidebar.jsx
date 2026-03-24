import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  CheckSquare,
  RotateCcw,
  Sparkles,
} from "lucide-react";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/subjects", label: "Subjects", icon: BookOpen },
  { to: "/tasks", label: "Tasks", icon: CheckSquare },
  { to: "/revision", label: "Revision", icon: RotateCcw },
  { to: "/ai-tools", label: "AI Tools", icon: Sparkles },
];

export default function Sidebar({ isOpen, closeSidebar }) {
  const isCollapsed = !isOpen;

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      <aside
        className={`shrink-0 bg-slate-900 border-r border-slate-700/50 z-50 flex flex-col transition-all duration-300 ease-in-out h-full overflow-hidden
        fixed md:relative top-0 left-0 bottom-0
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"} 
        ${isOpen ? "md:w-64 w-72" : "md:w-20 w-72"}`}
      >
        <div className="flex-1 overflow-y-auto py-6 px-3 scrollbar-hide">
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => {
                    if (window.innerWidth < 768) closeSidebar();
                  }}
                  className={({ isActive }) =>
                    `flex items-center rounded-lg transition-all duration-200 group relative ${
                      isActive
                        ? "bg-indigo-500/10 text-indigo-400"
                        : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                    } ${isCollapsed ? "justify-center px-0 py-3" : "px-3 py-2.5 gap-3"}`
                  }
                  title={isCollapsed ? item.label : undefined}
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-indigo-500 rounded-r-full" />
                      )}

                      <Icon
                        className={`shrink-0 transition-colors ${
                          isCollapsed ? "w-6 h-6" : "w-5 h-5"
                        } ${isActive ? "text-indigo-400" : "text-slate-400 group-hover:text-slate-300"}`}
                      />

                      <span
                        className={`font-medium tracking-wide whitespace-nowrap transition-all duration-300 overflow-hidden ${
                          isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
                        }`}
                      >
                        {item.label}
                      </span>
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
}