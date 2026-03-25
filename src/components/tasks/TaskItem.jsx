import React from "react";
import { Check, Clock, Trash2 } from "lucide-react";
import { useApp } from "../../context/AppContext";

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
  const { subjects, topics } = useApp();

  const subjectName = subjects.find((s) => s.slug === task.subjectSlug)?.name ?? task.subjectSlug;
  const topicName = topics.find((t) => t.slug === task.topicSlug && t.subjectSlug === task.subjectSlug)?.name ?? task.topicSlug;

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
      <div className="flex flex-wrap items-center gap-4 w-full">
        <div className="flex items-center gap-4 flex-1 min-w-60">
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
            <div className="flex flex-wrap items-center gap-2 mt-1 w-full">
              {showContext && (
                <span className="text-xs text-slate-400 truncate max-w-full">
                  {subjectName} • {topicName}
                </span>
              )}
              {task.completed && task.nextRevisionAt && !task.revisionStopped && (
                <span className="text-xs text-indigo-400/80 font-medium flex items-center gap-1 shrink-0 whitespace-nowrap">
                  <Clock className="w-3 h-3" />
                  Next revision: {formatNextRevision(task.nextRevisionAt)}
                </span>
              )}
              {task.completed && task.nextRevisionAt && !task.revisionStopped && (
                <span className="text-[10px] font-bold tracking-wide uppercase px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0 whitespace-nowrap">
                  {task.revisionCount} Revision
                </span>
              )}
              {task.completed && task.revisionStopped && (
                <span className="text-[10px] font-bold tracking-wide uppercase px-1.5 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 shrink-0 whitespace-nowrap">
                  Mastered
                </span>
              )}
            </div>
          </div>
        </div>

        {onDelete && !showRevisionActions && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-2 sm:text-slate-500 bg-red-500/10 text-red-400 sm:bg-transparent sm:hover:text-red-400 sm:hover:bg-red-500/10 rounded-lg transition-colors shrink-0 ml-auto cursor-pointer"
            title="Delete Task"
            aria-label="Delete Task"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}

        {showRevisionActions && (
          <div
            className="flex items-center gap-2 sm:gap-3 shrink-0 ml-auto sm:ml-0"
            onClick={(e) => e.stopPropagation()}
          >
            {onRevise && (
              <button
                onClick={onRevise}
                className="text-xs sm:text-sm font-bold sm:font-medium text-indigo-400 bg-transparent hover:bg-indigo-500/20 sm:hover:bg-indigo-500/10 px-3 py-1.5 sm:px-2 sm:py-1 rounded-lg sm:rounded transition-colors whitespace-nowrap"
              >
                Mark Revised
              </button>
            )}
            {onStopRevision && (
              <button
                onClick={onStopRevision}
                className="text-xs sm:text-sm font-bold sm:font-medium text-red-400 bg-transparent hover:bg-red-500/20 sm:hover:bg-red-500/10 px-3 py-1.5 sm:px-2 sm:py-1 rounded-lg sm:rounded transition-colors whitespace-nowrap"
              >
                Mastered
              </button>
            )}
            {onReviseNow && (
              <button
                onClick={onReviseNow}
                className="text-xs sm:text-sm font-bold sm:font-medium text-blue-400 bg-transparent hover:bg-blue-500/20 sm:hover:bg-blue-500/10 px-3 py-1.5 sm:px-2 sm:py-1 rounded-lg sm:rounded transition-colors whitespace-nowrap"
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
