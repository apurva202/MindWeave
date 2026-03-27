import React, { useState, useEffect } from "react";
import { Plus, CheckSquare, ChevronDown } from "lucide-react";
import TaskItem from "../components/tasks/TaskItem";
import AddTaskModal from "../components/tasks/AddTaskModal";
import { useApp } from "../context/AppContext";

export default function Tasks() {
  const { tasks, subjects, topics, setTasks, deleteTask } = useApp();
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedTopic, setSelectedTopic] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setSelectedTopic("all");
  }, [selectedSubject]);

  const filteredTopics =
    selectedSubject === "all"
      ? topics
      : topics.filter((t) => t.subjectSlug === selectedSubject);

  const filteredTasks = tasks.filter((task) => {
    return (
      (selectedSubject === "all" || task.subjectSlug === selectedSubject) &&
      (selectedTopic === "all" || task.topicSlug === selectedTopic)
    );
  });

  const toggleTask = (id) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;

        if (t.completed && t.revisionCount > 1) return t;

        const isNowCompleted = !t.completed;
        const updates = { completed: isNowCompleted };

        if (isNowCompleted && t.revisionCount === 0 && !t.nextRevisionAt) {
          updates.revisionCount = 1;
          updates.lastRevisedAt = Date.now();
          updates.nextRevisionAt = Date.now() + 24 * 60 * 60 * 1000;
        }

        return { ...t, ...updates };
      }),
    );
  };

  return (
    <div className="w-full h-full flex flex-col p-4 sm:p-8 bg-slate-900 overflow-y-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4 max-w-5xl mx-auto w-full">
        <div>
          <h1 className="text-3xl font-bold text-slate-100 min-w-0 truncate">
            Tasks
          </h1>
          <p className="text-slate-400 mt-1">Manage and track your study tasks</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition-colors shadow-sm shadow-indigo-600/20 shrink-0"
        >
          <Plus className="w-5 h-5" />
          <span>Add Task</span>
        </button>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4 max-w-5xl mx-auto w-full pb-6 border-b border-slate-700/50">
        <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
          {/* Subject Filter */}
          <div className="relative flex-1 sm:flex-none">
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full appearance-none bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-lg pl-4 pr-10 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer"
            >
              <option value="all">All Subjects</option>
              {subjects.map((s) => (
                <option key={s.slug} value={s.slug}>
                  {s.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>

          {/* Topic Filter */}
          <div className="relative flex-1 sm:flex-none">
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="w-full appearance-none bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-lg pl-4 pr-10 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer"
            >
              <option value="all">All Topics</option>
              {filteredTopics.map((t) => (
                <option key={t.slug} value={t.slug}>
                  {t.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>

        <p className="text-slate-500 text-xs font-medium hidden sm:block">
          {filteredTasks.length} task{filteredTasks.length !== 1 ? "s" : ""} found
        </p>
      </div>

      <div className="flex-1 w-full max-w-5xl mx-auto">
        {filteredTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 px-4 text-center bg-slate-800/30 border border-slate-700/50 rounded-xl border-dashed">
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4 border border-slate-700 shadow-sm">
              <CheckSquare className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-100 mb-2">
              No tasks found
            </h3>
            <p className="text-slate-400 max-w-sm mx-auto mb-6">
              Try changing filters or add new task
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filteredTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={() => toggleTask(task.id)}
                onDelete={() => {
                  if (window.confirm("Are you sure you want to delete this task?")) {
                    deleteTask(task.id);
                  }
                }}
                showContext={true}
              />
            ))}
          </div>
        )}
      </div>

      <AddTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mode="full"
        subjectSlug={selectedSubject !== "all" ? selectedSubject : undefined}
        topicSlug={selectedTopic !== "all" ? selectedTopic : undefined}
      />
    </div>
  );
}
