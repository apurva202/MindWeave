import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, FolderOpen } from "lucide-react";
import { Trash2 } from "lucide-react";
import TopicItem from "../components/topics/TopicItem";
import AddTopicModal from "../components/topics/AddTopicModal";
import DeleteTopicModal from "../components/topics/DeleteTopicModal";
import { useApp } from "../context/AppContext";

export default function Topics() {
  const { subjects, topics } = useApp();
  const { subjectSlug } = useParams();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const subject = subjects?.find((s) => s.slug === subjectSlug);
  const subjectTopics = topics.filter((t) => t.subjectSlug === subjectSlug);

  if (!subject) {
    return (
      <div className="w-full h-full flex items-center justify-center p-8">
        <div className="text-center bg-slate-800 p-12 rounded-2xl border border-slate-700/80 shadow-xl max-w-sm w-full">
          <h1 className="text-2xl font-bold text-slate-100 mb-6">
            Subject not found
          </h1>
          <button
            onClick={() => navigate("/subjects")}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg font-medium transition-colors mx-auto w-full sm:w-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4 px-1">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/subjects")}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-slate-100 rounded-lg transition-colors border border-slate-700/50"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="min-w-0">
            <h1 className="text-3xl font-bold text-slate-100 truncate">
              {subject.name}
            </h1>
            <p className="text-slate-400 mt-1 truncate">
              Manage and track topics for this subject
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {subjectTopics.length > 0 && (
            <button
              onClick={() => setIsDeleteModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-red-400 hover:text-red-300 border border-slate-700/50 rounded-lg font-medium transition-colors shrink-0 cursor-pointer"
              title="Delete Topics"
            >
              <Trash2 className="w-5 h-5" />
              <span className="hidden sm:inline">Delete</span>
            </button>
          )}
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition-colors shadow-sm shadow-indigo-600/20 shrink-0"
          >
            <Plus className="w-5 h-5" />
            <span>Add Topic</span>
          </button>
        </div>
      </div>

      {subjectTopics.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-1 py-16 px-4 text-center bg-slate-800/30 border border-slate-700/50 rounded-xl border-dashed">
          <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4 border border-slate-700 shadow-sm">
            <FolderOpen className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-xl font-semibold text-slate-100 mb-2">
            No topics yet
          </h3>
          <p className="text-slate-400 max-w-sm mx-auto mb-6">
            Get started by adding your first topic to this subject.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-indigo-400 hover:text-indigo-300 font-medium hover:underline focus:outline-none"
          >
            Add your first topic &rarr;
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {subjectTopics.map((topic) => (
            <TopicItem
              key={topic.slug}
              topic={topic}
              subjectSlug={subjectSlug}
            />
          ))}
        </div>
      )}

      <AddTopicModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        subjectSlug={subjectSlug}
      />
      
      <DeleteTopicModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        subjectSlug={subjectSlug}
      />
    </div>
  );
}
