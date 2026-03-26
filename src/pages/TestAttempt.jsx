import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, ChevronRight, X, RotateCcw } from "lucide-react";
import { useApp } from "../context/AppContext";
export default function TestAttempt() {
  const navigate = useNavigate();
  const { testId } = useParams();
  const { tests, setResults } = useApp();
  const currentTest = tests.find((t) => t.id === testId) ?? null;
  const [answers, setAnswers] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, []);
  if (!currentTest) {
    return (
      <div className="min-h-dvh bg-slate-950 flex items-center justify-center p-8">
        <div className="text-center bg-slate-900 p-10 rounded-2xl border border-slate-800 max-w-sm w-full">
          <h2 className="text-xl font-semibold text-slate-100 mb-3">
            Test not found
          </h2>
          <p className="text-slate-500 text-sm mb-6">
            This test doesn't exist or was deleted.
          </p>
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
  const { questions, subjectName, topicName } = currentTest;
  const totalQuestions = questions.length;
  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount === totalQuestions;
  const q = questions[currentIndex];
  const userAnswer = answers[currentIndex];
  const handleSelect = (option) => {
    setAnswers((prev) => ({ ...prev, [currentIndex]: option }));
  };
  const handleClear = () => {
    setAnswers((prev) => {
      const updated = { ...prev };
      delete updated[currentIndex];
      return updated;
    });
  };
  const handleSubmit = () => {
    const score = questions.reduce((acc, q, i) => {
      return acc + (answers[i] === q.correctAnswer ? 1 : 0);
    }, 0);

    const result = {
      id: crypto.randomUUID(),
      testId: currentTest.id,
      subjectName: currentTest.subjectName,
      topicName: currentTest.topicName,
      score,
      total: questions.length,
      answers,
      questions: questions,
      createdAt: Date.now(),
    };

    setResults((prev) => [...prev, result]);
    navigate(`/tests/result/${result.id}`);
  };
  const handleExit = () => {
    if (window.confirm("Leave test? Your progress will be lost."))
      navigate("/tests");
  };
  const progressPct = (Object.keys(answers).length / totalQuestions) * 100;
  return (
    <div className="min-h-dvh bg-slate-950 flex flex-col">
      {/* Submit confirm dialog */}
      {showSubmitDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="rounded-2xl p-6 max-w-sm w-full shadow-2xl bg-slate-900 border border-slate-800">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5 ${
                allAnswered ? "bg-emerald-500/15" : "bg-amber-500/15"
              }`}
            >
              <span className="text-3xl">{allAnswered ? "✅" : "⚠️"}</span>
            </div>
            <h3
              className={`text-xl font-bold text-center mb-2 ${
                allAnswered ? "text-emerald-400" : "text-amber-400"
              }`}
            >
              {allAnswered ? "Ready to submit?" : "Not fully answered"}
            </h3>
            <p className="text-slate-500 text-sm text-center mb-5">
              {allAnswered
                ? "All questions answered. Submit when you're confident."
                : `You've answered ${answeredCount} of ${totalQuestions} questions.`}
            </p>
            {!allAnswered && (
              <div className="mb-5 px-4 py-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-center">
                <span className="text-amber-400 text-xs font-bold tracking-wider uppercase">
                  {totalQuestions - answeredCount} unanswered
                </span>
              </div>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => setShowSubmitDialog(false)}
                className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium transition-colors border border-slate-700"
              >
                Go back
              </button>
              <button
                onClick={() => {
                  setShowSubmitDialog(false);
                  handleSubmit();
                }}
                className={`flex-1 py-2.5 text-white rounded-xl font-semibold transition-colors ${
                  allAnswered
                    ? "bg-emerald-600 hover:bg-emerald-500"
                    : "bg-amber-600 hover:bg-amber-500"
                }`}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Top bar */}
      <div className="sticky top-0 z-40 bg-slate-950/95 border-b border-slate-800 backdrop-blur-sm px-4 sm:px-8 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-base sm:text-xl font-bold text-slate-100 truncate">
              {subjectName} — {topicName}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Question {currentIndex + 1} of {totalQuestions}
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-lg text-slate-500">
              <span
                className={`font-bold ${allAnswered ? "text-emerald-400" : "text-slate-300"}`}
              >
                {answeredCount}
              </span>{" "}
              /
              <span className="text-slate-600 text-base">
                {" "}
                {totalQuestions}
              </span>
            </span>
            <button
              onClick={handleExit}
              className="p-1.5 text-slate-500 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
              title="Exit test"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
        {/* Progress bar */}
        <div className="max-w-2xl mx-auto mt-3 h-1 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-500 rounded-full transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>
      {/* Main content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 sm:px-8 py-8 space-y-6">
          {/* Question number pills */}
          <div className="flex flex-wrap gap-2">
            {questions.map((_, i) => {
              const isActive = i === currentIndex;
              const isAnswered = answers[i] !== undefined;
              return (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`w-9 h-9 rounded-xl text-xs font-bold transition-all duration-200 ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/25 scale-105"
                      : isAnswered
                        ? "bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 hover:bg-indigo-500/25"
                        : "bg-slate-800 text-slate-500 border border-slate-700 hover:border-slate-500 hover:text-slate-300"
                  }`}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
          {/* Question card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
            {/* Question header */}
            <div className="px-6 py-5 border-b border-slate-800/60">
              <div className="flex items-start gap-4">
                <span className="shrink-0 w-8 h-8 rounded-xl bg-indigo-600/20 text-indigo-400 text-xs font-bold flex items-center justify-center ring-1 ring-indigo-500/30">
                  {currentIndex + 1}
                </span>
                <p className="text-slate-100 font-medium leading-relaxed pt-0.5">
                  {q.question}
                </p>
              </div>
            </div>
            {/* Options */}
            <div className="px-6 py-5 space-y-3">
              {q.options.map((option, optIdx) => {
                const isSelected = userAnswer === option;
                const letter = String.fromCharCode(65 + optIdx); // A, B, C, D
                return (
                  <button
                    key={option}
                    onClick={() => handleSelect(option)}
                    className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-left text-sm transition-all duration-200 cursor-pointer group ${
                      isSelected
                        ? "bg-indigo-600/15 border border-indigo-500/60 shadow-sm shadow-indigo-500/10"
                        : "bg-slate-800/50 border border-slate-700/60 hover:border-slate-600 hover:bg-slate-800"
                    }`}
                  >
                    <span
                      className={`w-7 h-7 shrink-0 rounded-lg text-xs font-bold flex items-center justify-center transition-colors ${
                        isSelected
                          ? "bg-indigo-600 text-white"
                          : "bg-slate-700 text-slate-400 group-hover:bg-slate-600 group-hover:text-slate-300"
                      }`}
                    >
                      {letter}
                    </span>
                    <span
                      className={`font-medium transition-colors ${
                        isSelected
                          ? "text-indigo-100"
                          : "text-slate-300 group-hover:text-slate-200"
                      }`}
                    >
                      {option}
                    </span>
                    {isSelected && (
                      <span className="ml-auto shrink-0 w-4 h-4 rounded-full bg-indigo-500 flex items-center justify-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-white" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            {/* Clear answer footer */}
            {userAnswer !== undefined && (
              <div className="px-6 py-3 border-t border-slate-800/60 bg-slate-900/50 flex items-center justify-between">
                <span className="text-xs text-slate-600">Answer selected</span>
                <button
                  onClick={handleClear}
                  className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-red-400 transition-colors group px-2.5 py-1.5 rounded-lg hover:bg-red-500/10"
                >
                  <RotateCcw className="w-3 h-3 group-hover:rotate-180 transition-transform duration-300" />
                  Clear answer
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Bottom nav bar */}
      <div className="sticky bottom-0 bg-slate-950/95 border-t border-slate-800 backdrop-blur-sm px-4 sm:px-8 py-4">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <button
            onClick={() => setCurrentIndex((i) => i - 1)}
            disabled={currentIndex === 0}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300 text-sm font-medium rounded-xl border border-slate-800 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> Prev
          </button>
          <button
            onClick={() => setShowSubmitDialog(true)}
            className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-indigo-600/20"
          >
            Submit Test
          </button>
          <button
            onClick={() => setCurrentIndex((i) => i + 1)}
            disabled={currentIndex === totalQuestions - 1}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300 text-sm font-medium rounded-xl border border-slate-800 transition-colors"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
