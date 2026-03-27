import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, ArrowLeft, Send, AlertCircle } from "lucide-react";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY,
});

export default function DoubtSolver() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [responseText, setResponseText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!query.trim()) return;

    try {
      setLoading(true);
      setError("");
      setResponseText("");

      const prompt = `
Answer the following question clearly and simply:

"${query}"

Structure your response as:

1. Explanation (clear and simple)
2. Key Points (bullet points if needed)
3. Example (if applicable)

IMPORTANT:

* Keep it beginner-friendly
* Do NOT use markdown
* Do NOT add unnecessary symbols
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });

      let text = response.text || "";

      // Clean Response
      text = text.replace(/```/g, "").trim();

      // Validate
      if (!text || text.length < 10) {
        throw new Error("Invalid AI response");
      }

      setResponseText(text);
    } catch (err) {
      console.error("Doubt Solver Error:", err);
      setError("Failed to solve doubt. Please check your connection or API key.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col p-4 sm:p-8 bg-slate-900 overflow-y-auto font-sans text-slate-100">
      <div className="max-w-3xl mx-auto w-full flex flex-col gap-8 py-10">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-100 rounded-xl transition-colors border border-slate-700 shadow-lg"
            title="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight italic">Doubt Solver</h1>
            <p className="text-slate-400 font-medium">Ask any question and get a clear explanation</p>
          </div>
        </div>

        {/* Input Section */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl space-y-4">
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask your doubt... (e.g., What is recursion in programming?)"
            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 min-h-35 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none"
            disabled={loading}
          />

          <button
            onClick={handleSubmit}
            disabled={loading || !query.trim()}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black rounded-xl transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 group"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            )}
            {loading ? "Solving..." : "Solve Doubt"}
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl animate-in fade-in slide-in-from-top-2 duration-300">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <p className="text-sm text-red-200/90 leading-relaxed font-semibold">
              {error}
            </p>
          </div>
        )}

        {/* Response Display */}
        {responseText && (
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-500 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 blur-3xl -mr-16 -mt-16" />
            
            <div className="relative">
              <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-100">Explanation</h3>
              </div>
              
              <div className="text-slate-300 leading-relaxed whitespace-pre-line font-medium">
                {responseText}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
