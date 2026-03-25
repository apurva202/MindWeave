import React from "react";
import { X, Trash2, AlertTriangle } from "lucide-react";
import { useApp } from "../../context/AppContext";

export default function DeleteSubjectModal({ isOpen, onClose }) {
  const { subjects, deleteSubject } = useApp();

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
    >
      <div
        className="bg-slate-900 border border-slate-700/80 rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <div className="flex items-center gap-2 text-red-400">
            <Trash2 className="w-5 h-5" />
            <h2 className="text-xl font-bold">Delete Subjects</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-3 flex-1">
          {subjects.length === 0 ? (
            <p className="text-slate-400 text-center py-4">
              No subjects to delete.
            </p>
          ) : (
            <>
              <div className="flex items-start gap-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg mb-4">
                <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <p className="text-xs text-red-300">
                  Deleting a subject will permanently remove all of its topics
                  and tasks. This action cannot be undone.
                </p>
              </div>
              {subjects.map((subject) => (
                <div
                  key={subject.slug}
                  className="flex items-center justify-between p-3 bg-slate-800 rounded-lg border border-slate-700"
                >
                  <span className="text-slate-200 font-medium truncate pr-4">
                    {subject.name}
                  </span>
                  <button
                    onClick={() => {
                      if (
                        window.confirm(
                          `Are you sure you want to delete "${subject.name}" and all its content?`,
                        )
                      ) {
                        deleteSubject(subject.slug);
                      }
                    }}
                    className="p-2 text-red-400 hover:text-red-300 cursor-pointer hover:bg-red-500/20 rounded-lg transition-colors shrink-0"
                    title="Delete Subject"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
