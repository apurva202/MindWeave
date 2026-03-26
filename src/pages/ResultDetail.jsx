import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle2, XCircle, ChevronLeft, ClipboardList } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function ResultDetail() {
  const { resultId } = useParams();
  const navigate = useNavigate();
  const { results } = useApp();

  const result = results.find((r) => r.id === resultId);

  if (!result) {
    return (
      <div className="w-full h-full flex items-center justify-center p-8 bg-slate-900">
        <div className="text-center bg-slate-800 border border-slate-700 p-10 rounded-2xl max-w-sm w-full">
          <h2 className="text-xl font-semibold text-slate-100 mb-3">Result not found</h2>
          <p className="text-slate-400 text-sm mb-6">This result doesn't exist.</p>
          <button
            onClick={() => navigate("/tests")}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium transition-colors"
          >
            Go to Tests
          </button>
        </div>
      </div>
    );
  }

  const percentage = (result.score / result.total) * 100;

  const getScoreColor = () => {
    if (percentage >= 80) return "text-emerald-400";
    if (percentage >= 50) return "text-amber-400";
    return "text-rose-400";
  };

  const getScoreBg = () => {
    if (percentage >= 80) return "bg-emerald-500/10 border-emerald-500/20";
    if (percentage >= 50) return "bg-amber-500/10 border-amber-500/20";
    return "bg-rose-500/10 border-rose-500/20";
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-900 overflow-y-auto p-4 sm:p-8">
      <div className="max-w-3xl mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/tests/results")}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-100 rounded-xl transition-colors border border-slate-700"
              title="Back to results"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-slate-100 tracking-tight">{result.topicName}</h1>
              <p className="text-slate-400 font-medium">{result.subjectName}</p>
            </div>
          </div>

          <div className={`px-6 py-3 rounded-2xl border ${getScoreBg()} flex flex-col items-center justify-center min-w-[120px]`}>
            <span className="text-xs font-black uppercase tracking-widest opacity-60 mb-1">Score</span>
            <span className={`text-3xl font-black ${getScoreColor()}`}>
              {result.score}<span className="text-lg opacity-40">/{result.total}</span>
            </span>
          </div>
        </div>

        {/* Performance Summary */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 mb-10 flex flex-wrap items-center justify-between gap-6">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-slate-100 tracking-tight">Attempt Summary</h2>
            <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">
              {new Date(result.createdAt).toLocaleDateString()} • {new Date(result.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
          
          <div className="flex items-center gap-8">
            <div className="text-center">
              <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Accuracy</p>
              <p className={`text-xl font-black ${getScoreColor()}`}>{Math.round(percentage)}%</p>
            </div>
            <div className="w-px h-8 bg-slate-700" />
            <div className="text-center">
              <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Status</p>
              <p className={`text-xs font-black px-3 py-1 rounded-full ${getScoreBg()} ${getScoreColor()}`}>
                {percentage >= 50 ? "PASSED" : "FAILED"}
              </p>
            </div>
          </div>
        </div>

        {/* Question Review */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2 mb-4">
            <ClipboardList className="w-5 h-5 text-indigo-400" />
            Review Questions
          </h3>

          <div className="space-y-4">
            {result.questions.map((q, i) => {
              const userAnswer = result.answers[i];
              const isCorrect = userAnswer === q.correctAnswer;

              return (
                <div key={i} className="bg-slate-800/40 border border-slate-700/50 rounded-2xl overflow-hidden shadow-sm">
                  <div className="p-6">
                    <div className="flex items-start gap-4 mb-5">
                      <span className={`shrink-0 w-8 h-8 rounded-xl text-xs font-black flex items-center justify-center ring-1 ${
                        isCorrect
                          ? "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20"
                          : "bg-rose-500/10 text-rose-400 ring-rose-500/20"
                      }`}>
                        {i + 1}
                      </span>
                      <p className="text-slate-200 font-semibold leading-relaxed pt-0.5">{q.question}</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className={`p-4 rounded-xl border ${
                        isCorrect
                          ? "bg-emerald-500/5 border-emerald-500/10"
                          : "bg-rose-500/5 border-rose-500/10"
                      }`}>
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-2">Your Choice</p>
                        <div className="flex items-center gap-2">
                          {isCorrect ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <XCircle className="w-4 h-4 text-rose-500" />}
                          <span className={`text-sm font-bold ${isCorrect ? "text-emerald-100" : "text-rose-100"}`}>
                            {userAnswer || "Not answered"}
                          </span>
                        </div>
                      </div>

                      {!isCorrect && (
                        <div className="p-4 rounded-xl border bg-emerald-500/5 border-emerald-500/20">
                          <p className="text-[10px] text-emerald-500/60 font-black uppercase tracking-widest mb-2">Correct Answer</p>
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            <span className="text-sm font-bold text-emerald-100">
                              {q.correctAnswer}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-12 mb-20">
          <button
            onClick={() => navigate("/tests")}
            className="w-full sm:flex-1 py-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-2xl border border-slate-700 transition-all flex items-center justify-center gap-2"
          >
            <ChevronLeft className="w-5 h-5" />
            Back to Tests
          </button>
          <button
            onClick={() => navigate("/tests/results")}
            className="w-full sm:flex-1 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2"
          >
            <ClipboardList className="w-5 h-5" />
            View All Results
          </button>
        </div>
      </div>
    </div>
  );
}
