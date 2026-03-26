import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, BookOpen, Sparkles, RefreshCw } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function Notes() {
  const { subjectSlug, topicSlug } = useParams();
  const navigate = useNavigate();
  const { notes, subjects, topics } = useApp();

  const note = notes.find(
    (n) => n.subjectSlug === subjectSlug && n.topicSlug === topicSlug
  );

  const subject = subjects.find((s) => s.slug === subjectSlug);
  const topic = topics.find((t) => t.slug === topicSlug);

  return (
    <div className="w-full h-full flex flex-col p-4 sm:p-8 bg-slate-900 overflow-y-auto">
      <div className="max-w-4xl mx-auto w-full flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <button
            onClick={() => navigate(`/subjects/${subjectSlug}/${topicSlug}`)}
            className="flex items-center gap-2 text-slate-400 hover:text-slate-100 transition-colors w-fit"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          <div>
            <h1 className="text-3xl font-bold text-slate-100">{topic?.name || "Topic"}</h1>
            <p className="text-slate-400 mt-1">{subject?.name || "Subject"}</p>
          </div>
        </div>

        {!note ? (
          /* Empty State */
          <div className="bg-slate-800/50 border border-slate-700 border-dashed rounded-2xl p-12 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mb-6 border border-slate-700 shadow-xl text-slate-500">
               <BookOpen className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-100 mb-2">No notes available</h2>
            <p className="text-slate-400 mb-8 max-w-xs">
              Generate structured notes for this topic using AI to help you study more effectively.
            </p>
            <button
              onClick={() => navigate(`/ai-tools/explain-topic`, { state: { subject: subjectSlug, topic: topicSlug } })}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-600/25"
            >
              <Sparkles className="w-5 h-5" />
              Generate Notes
            </button>
          </div>
        ) : (
          /* Content Card */
          <div className="space-y-6">
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 sm:p-8 shadow-xl">
              <div className="whitespace-pre-line text-slate-200 leading-relaxed text-base sm:text-lg">
                {note.content}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 border-t border-slate-800">
              <button
                onClick={() => navigate(`/ai-tools/explain-topic`, { state: { subject: subjectSlug, topic: topicSlug, isRegenerating: true } })}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-bold border border-slate-700 transition-all"
              >
                <RefreshCw className="w-4 h-4" />
                Regenerate Notes
              </button>
              <button
                onClick={() => navigate(`/subjects/${subjectSlug}/${topicSlug}`)}
                className="w-full sm:w-auto px-8 py-3 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-slate-100 rounded-xl font-bold transition-all"
              >
                Back to topic
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
