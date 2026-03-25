import React, { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";

export default function AddTaskModal({
  isOpen,
  onClose,
  subjectSlug: initialSubjectSlug,
  topicSlug: initialTopicSlug,
  mode = "default",
}) {
  const { tasks, setTasks, subjects, topics } = useApp();
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");

  useEffect(() => {
    if (isOpen) {
      if (mode === "full") {
        setSelectedSubject(initialSubjectSlug || (subjects.length > 0 ? subjects[0].slug : ""));
        setSelectedTopic(initialTopicSlug || "");
      } else {
        setSelectedSubject(initialSubjectSlug || "");
        setSelectedTopic(initialTopicSlug || "");
      }
    }
  }, [isOpen, initialSubjectSlug, initialTopicSlug, mode, subjects]);

  useEffect(() => {
    if (mode === "full" && selectedSubject) {
      const subjectTopics = topics.filter(t => t.subjectSlug === selectedSubject);
      if (!subjectTopics.some(t => t.slug === selectedTopic)) {
        setSelectedTopic(subjectTopics.length > 0 ? subjectTopics[0].slug : "");
      }
    }
  }, [selectedSubject, topics, mode, selectedTopic]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedName = name.trim();

    if (!trimmedName) {
      setError("Task name cannot be empty.");
      return;
    }

    if (mode === "full" && (!selectedSubject || !selectedTopic)) {
      setError("Please select both a subject and a topic.");
      return;
    }

    const finalSubjectSlug = mode === "full" ? selectedSubject : initialSubjectSlug;
    const finalTopicSlug = mode === "full" ? selectedTopic : initialTopicSlug;

    const topicTasks = tasks.filter(
      (t) => t.subjectSlug === finalSubjectSlug && t.topicSlug === finalTopicSlug,
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
      subjectSlug: finalSubjectSlug,
      topicSlug: finalTopicSlug,
      completed: false,
      createdAt: Date.now(),
      revisionCount: 0,
      lastRevisedAt: null,
      nextRevisionAt: null,
      revisionStopped: false
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

  const availableTopics = mode === "full" ? topics.filter(t => t.subjectSlug === selectedSubject) : [];

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
            <div className="mb-6 space-y-4">
              <div>
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
              </div>

              {mode === "full" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Subject
                    </label>
                    <select
                      value={selectedSubject}
                      onChange={(e) => {
                        setSelectedSubject(e.target.value);
                        if (error) setError("");
                      }}
                      className="w-full bg-slate-900 border border-slate-700 focus:ring-indigo-500 rounded-lg px-4 py-3 text-slate-100 focus:outline-none focus:ring-2"
                    >
                      {subjects.length === 0 && <option value="" disabled>No subjects available</option>}
                      {subjects.map(s => (
                        <option key={s.slug} value={s.slug}>{s.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Topic
                    </label>
                    <select
                      value={selectedTopic}
                      onChange={(e) => {
                        setSelectedTopic(e.target.value);
                        if (error) setError("");
                      }}
                      disabled={!selectedSubject || availableTopics.length === 0}
                      className="w-full bg-slate-900 border border-slate-700 focus:ring-indigo-500 rounded-lg px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 disabled:opacity-50"
                    >
                      {availableTopics.length === 0 && <option value="" disabled>No topics available</option>}
                      {availableTopics.map(t => (
                        <option key={t.slug} value={t.slug}>{t.name}</option>
                      ))}
                    </select>
                  </div>
                </>
              )}

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
