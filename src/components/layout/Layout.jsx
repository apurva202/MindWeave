import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Topbar from "./Topbar";
import Sidebar from "./Sidebar";

export default function Layout() {
  const [isOpen, setIsOpen] = useState(window.innerWidth >= 768);

  return (
    <div className="h-dvh w-full bg-slate-900 text-slate-100 flex flex-col overflow-hidden">
      <Topbar toggleSidebar={() => setIsOpen(!isOpen)} />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar isOpen={isOpen} closeSidebar={() => setIsOpen(false)} />

        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
