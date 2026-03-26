import React from "react";
import { FileText, Trash2 } from "lucide-react";

export default function TestCard({ test, onAttempt, onDelete, isNew = false }) {
  const formattedDate = new Date(test.createdAt).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <div
      className={`bg-slate-800 border rounded-xl p-6 hover:-translate-y-1 hover:shadow-lg transition-all duration-200 flex flex-col gap-4 ${
        isNew
          ? "border-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.2)]"
          : "border-slate-700 hover:border-slate-500"
      }`}
    >
      {/* Header row: icon + title + delete */}
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-indigo-500/10 rounded-lg flex items-center justify-center shrink-0">
          <FileText className="w-5 h-5 text-indigo-400" />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-slate-100 truncate">{test.subjectName}</h3>
          <p className="text-sm text-slate-400 mt-0.5 truncate">{test.topicName}</p>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            if (window.confirm("Delete this test?")) onDelete();
          }}
          className="shrink-0 p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
          title="Delete Test"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Meta badges */}
      <div className="flex items-center gap-2 flex-wrap">
        {isNew && (
          <span
            className="relative text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full overflow-hidden"
            style={{
              background: "linear-gradient(90deg, #6366f1, #8b5cf6, #a78bfa, #6366f1)",
              backgroundSize: "200% auto",
              animation: "shine 2s linear infinite",
              color: "#fff",
              boxShadow: "0 0 8px rgba(139,92,246,0.5)",
            }}
          >
            ✦ New
          </span>
        )}
        <span className="inline-flex items-center text-xs font-medium px-2.5 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full">
          {test.questions.length} Questions
        </span>
        <span className="text-xs text-slate-500">{formattedDate}</span>
      </div>

      {/* Attempt button */}
      <button
        onClick={onAttempt}
        className="mt-auto w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer"
      >
        Attempt →
      </button>
    </div>
  );
}
