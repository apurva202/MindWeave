import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, CheckSquare } from "lucide-react";
import TaskItem from "../components/tasks/TaskItem";
import AddTaskModal from "../components/tasks/AddTaskModal";
import { useApp } from "../context/AppContext";

export default function TopicDetail() {
  const { subjects, topics, tasks, setTasks, deleteTask } = useApp();
  const { subjectSlug, topicSlug } = useParams();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const subject = subjects.find((s) => s.slug === subjectSlug);
  const topic = topics.find(
    (t) => t.slug === topicSlug && t.subjectSlug === subjectSlug,
  );

  useEffect(() => {
    if (subjects.length > 0 && (!subject || !topic)) {
      navigate("/subjects");
    }
  }, [subject, topic, subjects.length, navigate]);

  if (!subject || !topic) {
    return (
      <div className="w-full h-full flex items-center justify-center p-8 bg-slate-900">
        <div className="text-center bg-slate-800 p-12 rounded-2xl border border-slate-700/80 shadow-xl max-w-sm w-full">
          <h1 className="text-2xl font-bold text-slate-100 mb-6">Not found</h1>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg font-medium transition-colors mx-auto w-full sm:w-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const topicTasks = tasks.filter(
    (t) => t.subjectSlug === subjectSlug && t.topicSlug === topicSlug,
  );

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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4 px-1 max-w-4xl mx-auto w-full">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-slate-100 rounded-lg transition-colors border border-slate-700/50"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="min-w-0">
            <h1 className="text-3xl font-bold text-slate-100 truncate">
              {topic.name}
            </h1>
            <p className="text-slate-400 mt-1 truncate">{subject.name}</p>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition-colors shadow-sm shadow-indigo-600/20 shrink-0"
        >
          <Plus className="w-5 h-5" />
          <span>Add Task</span>
        </button>
      </div>

      <div className="flex-1 w-full max-w-4xl mx-auto">
        {topicTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 px-4 text-center bg-slate-800/30 border border-slate-700/50 rounded-xl border-dashed">
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4 border border-slate-700 shadow-sm">
              <CheckSquare className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-100 mb-2">
              No tasks yet
            </h3>
            <p className="text-slate-400 max-w-sm mx-auto mb-6">
              Break down this topic into manageable action items.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-indigo-400 hover:text-indigo-300 font-medium hover:underline focus:outline-none"
            >
              Add your first task &rarr;
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {topicTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={() => toggleTask(task.id)}
                onDelete={() => {
                  if (window.confirm("Are you sure you want to delete this task?")) {
                    deleteTask(task.id);
                  }
                }}
              />
            ))}
          </div>
        )}
      </div>

      <AddTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        subjectSlug={subjectSlug}
        topicSlug={topicSlug}
      />
    </div>
  );
}
