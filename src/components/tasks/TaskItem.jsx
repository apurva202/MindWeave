import React from "react";
import { Check, Clock, Trash2 } from "lucide-react";

export default function TaskItem({
  task,
  onToggle,
  onDelete,
  showContext,
  onRevise,
  onStopRevision,
  onReviseNow,
  showRevisionActions,
}) {
  const formatNextRevision = (timestamp) => {
    return new Date(timestamp).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
    });
  };

  return (
    <div
      onClick={task.completed && task.revisionCount > 1 ? undefined : onToggle}
      className={`w-full flex flex-col gap-2 px-4 py-3 bg-slate-800 rounded-lg transition-colors group border ${
        task.completed && task.revisionCount > 1 ? "cursor-default" : "cursor-pointer hover:bg-slate-800/70"
      } ${
        task.completed &&
        task.nextRevisionAt &&
        !task.revisionStopped &&
        new Date(task.nextRevisionAt).setHours(0, 0, 0, 0) <=
          new Date().setHours(0, 0, 0, 0)
          ? "border-indigo-500/50 shadow-[0_0_10px_rgba(99,102,241,0.1)]"
          : "border-slate-700/50 hover:border-slate-600"
      }`}
    >
      <div className="flex items-center gap-4 w-full">
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

        <div className="flex flex-col min-w-0 flex-1">
          <span
            className={`font-medium transition-colors truncate ${
              task.completed
                ? "text-slate-500 line-through"
                : "text-slate-200 group-hover:text-white"
            }`}
          >
            {task.name}
          </span>
          <div className="flex items-center gap-3 overflow-hidden">
            {showContext && (
              <span className="text-xs text-slate-400 mt-0.5 truncate shrink-0">
                {task.subjectSlug} • {task.topicSlug}
              </span>
            )}
            {task.completed && task.nextRevisionAt && !task.revisionStopped && (
              <span className="text-xs text-indigo-400/80 mt-0.5 font-medium flex items-center gap-1 shrink-0">
                <Clock className="w-3 h-3" />
                Next revision: {formatNextRevision(task.nextRevisionAt)}
              </span>
            )}
            {task.completed && task.nextRevisionAt && !task.revisionStopped  && (
              <span className="text-[10px] font-bold tracking-wide uppercase px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0 mt-0.5">
                {task.revisionCount} Revision
              </span>
            )}
            {task.completed && task.revisionStopped  && (
              <span className="text-[10px] font-bold tracking-wide uppercase px-1.5 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 shrink-0 mt-0.5">
                Mastered
              </span>
            )}
          </div>
        </div>

        {onDelete && !showRevisionActions && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors shrink-0 ml-auto cursor-pointer"
            title="Delete Task"
            aria-label="Delete Task"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}

        {showRevisionActions && (
          <div
            className="flex items-center gap-3 shrink-0 ml-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {onRevise && (
              <button
                onClick={onRevise}
                className="text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors px-2 py-1 rounded hover:bg-indigo-500/10"
              >
                Mark Revised
              </button>
            )}
            {onStopRevision && (
              <button
                onClick={onStopRevision}
                className="text-sm font-medium text-red-400 hover:text-red-300 transition-colors px-2 py-1 rounded hover:bg-red-500/10"
              >
                Mastered
              </button>
            )}
            {onReviseNow && (
              <button
                onClick={onReviseNow}
                className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors px-2 py-1 rounded hover:bg-blue-500/10"
              >
                Revise Now
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
