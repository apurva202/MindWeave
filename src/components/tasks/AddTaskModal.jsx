import React, { useState } from "react";
import { useApp } from "../../context/AppContext";

export default function AddTaskModal({
  isOpen,
  onClose,
  subjectSlug,
  topicSlug,
}) {
  const { tasks, setTasks } = useApp();
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedName = name.trim();

    if (!trimmedName) {
      setError("Task name cannot be empty.");
      return;
    }

    const topicTasks = tasks.filter(
      (t) => t.subjectSlug === subjectSlug && t.topicSlug === topicSlug,
    );
    const isDuplicate = topicTasks.some(
      (task) => task.name.toLowerCase() === trimmedName.toLowerCase(),
    );

    if (isDuplicate) {
      setError("A task with this name already exists in this topic.");
      return;
    }

    const newTask = {
      id: crypto.randomUUID(),
      name: trimmedName,
      subjectSlug,
      topicSlug,
      completed: false,
      createdAt: Date.now(),
    };

    setTasks((prev) => [...prev, newTask]);
    setName("");
    setError("");
    onClose();
  };

  const handleClose = () => {
    setName("");
    setError("");
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm px-4"
      onClick={handleClose}
    >
      <div
        className="bg-slate-800 border border-slate-700 rounded-xl shadow-xl w-full max-w-md overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <h2 className="text-2xl font-semibold text-slate-100 mb-6">
            Add New Task
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label
                htmlFor="task-name"
                className="block text-sm font-medium text-slate-300 mb-2"
              >
                Task Action
              </label>
              <input
                id="task-name"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError("");
                }}
                className={`w-full bg-slate-900 border ${
                  error
                    ? "border-red-500 focus:ring-red-500"
                    : "border-slate-700 focus:ring-indigo-500"
                } rounded-lg px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2`}
                placeholder="e.g., Read chapter 4, Complete exercises..."
                autoFocus
              />
              {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
            </div>

            <div className="flex items-center justify-end gap-3 mt-8">
              <button
                type="button"
                onClick={handleClose}
                className="px-5 py-2.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors shadow-sm shadow-indigo-600/20"
              >
                Add Task
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
