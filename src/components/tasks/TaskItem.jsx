import React from "react";
import { Check } from "lucide-react";

export default function TaskItem({ task, onToggle }) {
  return (
    <div
      onClick={onToggle}
      className="w-full flex items-center gap-4 px-4 py-3 bg-slate-800 rounded-lg hover:bg-slate-800/70 transition-colors cursor-pointer group border border-slate-700/50 hover:border-slate-600"
    >
      <div
        className={`w-6 h-6 shrink-0 rounded border flex items-center justify-center transition-colors ${
          task.completed
            ? "bg-indigo-500 border-indigo-500"
            : "border-slate-500 group-hover:border-indigo-400"
        }`}
      >
        {task.completed && (
          <Check className="w-4 h-4 text-white" strokeWidth={3} />
        )}
      </div>

      <span
        className={`font-medium transition-colors ${
          task.completed
            ? "text-slate-500 line-through"
            : "text-slate-200 group-hover:text-white"
        }`}
      >
        {task.name}
      </span>
    </div>
  );
}
