import React from "react";
import { useNavigate } from "react-router-dom";
import { ClipboardList, Calendar, ChevronRight } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function Results() {
  const navigate = useNavigate();
  const { results } = useApp();

  if (results.length === 0) {
    return (
      <div className="w-full h-full flex flex-col p-4 sm:p-8 bg-slate-900 overflow-y-auto">
        <div className="max-w-xl mx-auto w-full text-center py-20 px-4 bg-slate-800/20 border border-slate-700/50 rounded-3xl border-dashed">
          <div className="w-20 h-20 bg-slate-800 rounded-3xl flex items-center justify-center mb-6 mx-auto border border-slate-700 shadow-xl">
            <ClipboardList className="w-10 h-10 text-slate-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-100 mb-3">No results yet</h2>
          <p className="text-slate-400 mb-8 max-w-sm mx-auto">
            Complete a practice test to see your performance history here.
          </p>
          <button
            onClick={() => navigate("/tests")}
            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-600/25"
          >
            Go to Tests
          </button>
        </div>
      </div>
    );
  }

  const sortedResults = [...results].sort((a, b) => b.createdAt - a.createdAt);

  return (
    <div className="w-full h-full flex flex-col p-4 sm:p-8 bg-slate-900 overflow-y-auto">
      <div className="max-w-5xl mx-auto w-full">
        <div className="mb-10">
          <h1 className="text-3xl font-black text-slate-100 tracking-tight">Results History</h1>
          <p className="text-slate-400 mt-2 font-medium">Track your progress and review past attempts</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedResults.map((result) => {
            const percentage = (result.score / result.total) * 100;
            const attempts = results.filter((r) => r.testId === result.testId);
            const attemptNumber =
              attempts
                .sort((a, b) => a.createdAt - b.createdAt)
                .findIndex((r) => r.id === result.id) + 1;

            return (
              <button
                key={result.id}
                onClick={() => navigate(`/tests/result/${result.id}`)}
                className="group relative bg-slate-800 border border-slate-700 p-6 rounded-2xl text-left transition-all hover:bg-slate-800/80 hover:border-indigo-500 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={`px-2.5 py-1 rounded-lg text-[10px] uppercase font-black tracking-widest ${
                    percentage >= 80 ? "bg-emerald-500/10 text-emerald-400" :
                    percentage >= 50 ? "bg-amber-500/10 text-amber-400" : "bg-rose-500/10 text-rose-400"
                  }`}>
                    Attempt #{attemptNumber}
                  </div>
                  <div className={`text-sm font-black ${
                    percentage >= 80 ? "text-emerald-400" :
                    percentage >= 50 ? "text-amber-400" : "text-rose-400"
                  }`}>
                    {result.score}/{result.total}
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-bold text-slate-100 group-hover:text-indigo-300 transition-colors truncate">
                    {result.topicName}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">{result.subjectName}</p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
                  <div className="flex items-center gap-2 text-slate-500">
                    <Calendar className="w-3 h-3" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">
                      {new Date(result.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="text-indigo-500 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
