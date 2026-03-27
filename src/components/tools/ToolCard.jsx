import React from "react";

export default function ToolCard({ icon: Icon, title, description, iconColor, iconBg, onClick }) {
  return (
    <button
      onClick={onClick}
      className="text-left bg-slate-800 border border-slate-700 rounded-xl p-6 hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-900/50 hover:border-slate-500 transition-all duration-200 group cursor-pointer"
    >
      <div className={`w-12 h-12 ${iconBg} rounded-xl flex items-center justify-center mb-4`}>
        <Icon className={`w-6 h-6 ${iconColor}`} />
      </div>
      <h3 className="text-lg font-semibold text-slate-100 mb-2 group-hover:text-white transition-colors">
        {title}
      </h3>
      <p className="text-sm text-slate-400 leading-relaxed">
        {description}
      </p>
      <div className="mt-4 text-xs font-medium text-slate-500 group-hover:text-indigo-400 transition-colors">
        Click Here →
      </div>
    </button>
  );
}
