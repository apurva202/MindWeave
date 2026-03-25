import React, { useState } from "react";
import { Plus, BookOpen } from "lucide-react";
import SubjectCard from "../components/subjects/SubjectCard";
import AddSubjectModal from "../components/subjects/AddSubjectModal";
import { useApp } from "../context/AppContext";

export default function Subjects() {
  const { subjects } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <h1 className="text-3xl font-bold text-slate-100">Subjects</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition-colors shadow-sm shadow-indigo-600/20 shrink-0"
        >
          <Plus className="w-5 h-5" />
          <span>Add Subject</span>
        </button>
      </div>

      {subjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-1 py-16 px-4 text-center bg-slate-800/30 border border-slate-700/50 rounded-xl border-dashed">
          <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4 border border-slate-700 shadow-sm">
            <BookOpen className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-xl font-semibold text-slate-100 mb-2">
            No subjects yet
          </h3>
          <p className="text-slate-400 max-w-sm mx-auto mb-6">
            Get started by creating your first subject to organize your tasks
            and study materials.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-indigo-400 hover:text-indigo-300 font-medium hover:underline focus:outline-none"
          >
            Create your first subject &rarr;
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {subjects.map((subject) => (
            <SubjectCard key={subject.slug} subject={subject} />
          ))}
        </div>
      )}

      <AddSubjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
