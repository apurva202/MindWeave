import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ClipboardList, Sparkles, ChevronDown } from "lucide-react";
import { useApp } from "../context/AppContext";
import TestCard from "../components/tests/TestCard";

export default function Tests() {
  const navigate = useNavigate();
  const location = useLocation();
  const { tests, setCurrentTest, deleteTest, subjects } = useApp();
  const newTestId = location.state?.newTestId;

  const [sortBy, setSortBy] = useState("newest");
  const [filterSubject, setFilterSubject] = useState("all");

  useEffect(() => {
    if (newTestId) {
      window.history.replaceState({}, document.title);
    }
  }, [newTestId]);

  const handleAttempt = (test) => {
    setCurrentTest(test);
    navigate(`/tests/attempt/${test.id}`);
  };

  const filteredTests = tests.filter((test) => {
    if (filterSubject !== "all" && test.subjectSlug !== filterSubject) return false;
    return true;
  });

  const sortedTests = [...filteredTests].sort((a, b) => {
    if (sortBy === "newest") return b.createdAt - a.createdAt;
    if (sortBy === "oldest") return a.createdAt - b.createdAt;
    if (sortBy === "subject") return a.subjectName.localeCompare(b.subjectName);
    if (sortBy === "questions-high") return b.questions.length - a.questions.length;
    if (sortBy === "questions-low") return a.questions.length - b.questions.length;
    return 0;
  });

  return (
    <div className="w-full h-full flex flex-col p-4 sm:p-8 bg-slate-900 overflow-y-auto">
      <div className="max-w-5xl mx-auto w-full">
        <div className="mb-10 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold text-slate-100 mb-2">Tests</h1>
            <p className="text-slate-400">Practice and attempt your generated tests</p>
          </div>
          <button
            onClick={() => navigate("/tests/results")}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 cursor-pointer text-slate-200 text-sm font-medium rounded-lg transition-colors border border-slate-700"
          >
            <ClipboardList className="w-4 h-4" />
            View Results
          </button>
        </div>

        {tests.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-slate-800/30 border border-slate-700/50 rounded-xl border-dashed">
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4 border border-slate-700 shadow-sm">
              <ClipboardList className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-100 mb-2">No tests yet</h3>
            <p className="text-slate-400 max-w-sm mx-auto mb-6">
              Generate your first AI-powered test to start practicing
            </p>
            <button
              onClick={() => navigate("/ai-tools/practice-test")}
              className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition-colors shadow-sm shadow-indigo-600/20"
            >
              <Sparkles className="w-4 h-4" />
              Generate Practice Test
            </button>
          </div>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4 pb-6 border-b border-slate-700/50">
              <div className="flex flex-wrap items-center gap-4">
                {/* Subject Filter */}
                <div className="relative">
                  <select
                    value={filterSubject}
                    onChange={(e) => setFilterSubject(e.target.value)}
                    className="appearance-none bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-lg pl-4 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer"
                  >
                    <option value="all">All Subjects</option>
                    {subjects.map((s) => (
                      <option key={s.slug} value={s.slug}>{s.name}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>

                {/* Sort By */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-lg pl-4 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="subject">Subject (A-Z)</option>
                    <option value="questions-high">Questions (High-Low)</option>
                    <option value="questions-low">Questions (Low-High)</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div className="flex items-center gap-4 w-full sm:w-auto">
                <p className="text-slate-500 text-xs font-medium hidden sm:block">
                  {sortedTests.length} test{sortedTests.length !== 1 ? "s" : ""} found
                </p>
                <button
                  onClick={() => navigate("/ai-tools/practice-test")}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors shadow-sm shadow-indigo-600/20"
                >
                  <Sparkles className="w-4 h-4" />
                  New Test
                </button>
              </div>
            </div>

            {sortedTests.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 bg-slate-800/50 rounded-2xl flex items-center justify-center mb-4 border border-slate-700/50 text-slate-500">
                  <ClipboardList className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-semibold text-slate-300">No matching tests</h3>
                <p className="text-slate-500 text-sm mt-1">Try changing your filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedTests.map((test) => (
                  <TestCard
                    key={test.id}
                    test={test}
                    isNew={test.id === newTestId}
                    onAttempt={() => handleAttempt(test)}
                    onDelete={() => deleteTest(test.id)}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
