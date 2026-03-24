import React from "react";
import { Menu } from "lucide-react";

export default function Topbar({ toggleSidebar }) {
  return (
    <header className="w-full h-16 shrink-0 bg-slate-900 border-b border-slate-700/50 z-40 flex items-center justify-between px-4 sm:px-6">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="p-2 -ml-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800/50 rounded-lg transition-colors"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-linear-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <span className="text-white font-bold text-lg leading-none">M</span>
          </div>
          <span className="text-xl font-semibold text-slate-100 tracking-tight">
            MindWeave
          </span>
        </div>
      </div>
    </header>
  );
}
