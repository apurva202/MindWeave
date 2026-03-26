import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ClipboardList, Sparkles } from "lucide-react";
import { useApp } from "../context/AppContext";
import TestCard from "../components/tests/TestCard";

export default function Tests() {
  const navigate = useNavigate();
  const location = useLocation();
  const { tests, setCurrentTest, deleteTest } = useApp();
  const newTestId = location.state?.newTestId;

  useEffect(() => {
    if (newTestId) {
      window.history.replaceState({}, document.title);
    }
  }, []);

  const handleAttempt = (test) => {
    setCurrentTest(test);
    navigate(`/tests/attempt/${test.id}`);
  };

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
            <div className="flex items-center justify-between mb-6">
              <p className="text-slate-400 text-sm">{tests.length} test{tests.length !== 1 ? "s" : ""} generated</p>
              <button
                onClick={() => navigate("/ai-tools/practice-test")}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                New Test
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {tests.map((test) => (
                <TestCard
                  key={test.id}
                  test={test}
                  isNew={test.id === newTestId}
                  onAttempt={() => handleAttempt(test)}
                  onDelete={() => deleteTest(test.id)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
