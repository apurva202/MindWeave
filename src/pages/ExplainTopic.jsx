import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Sparkles,
  Info,
  ChevronDown,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY,
});

export default function ExplainTopic() {
  const navigate = useNavigate();
  const location = useLocation();
  const { subjects, topics, notes, setNotes } = useApp();

  // Get state from navigation (from Notes page)
  const stateSubject = location.state?.subject || "";
  const stateTopic = location.state?.topic || "";
  const isRegenerating = location.state?.isRegenerating || false;

  const [selectedSubject, setSelectedSubject] = useState(stateSubject);
  const [selectedTopic, setSelectedTopic] = useState(stateTopic);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const filteredTopics = topics.filter(
    (t) => t.subjectSlug === selectedSubject,
  );

  const subject = subjects.find((s) => s.slug === selectedSubject);
  const topic = topics.find(
    (t) => t.slug === selectedTopic && t.subjectSlug === selectedSubject,
  );

  const handleGenerate = async () => {
    if (!selectedSubject || !selectedTopic) return;

    // Check for existing note unless regenerating
    const alreadyExists = notes.some(
      (n) => n.subjectSlug === selectedSubject && n.topicSlug === selectedTopic,
    );

    if (alreadyExists && !isRegenerating) {
      setError(
        "Notes for this topic already exist. Please view them from the topic page or use the regenerate option inside the notes page.",
      );
      return;
    }

    setLoading(true);
    setError("");

    try {
      const topicName = topic?.name;
      const subjectName = subject?.name;

      // 1. CREATE PROMPT
      const prompt = `
Explain the topic "${topicName}" from the subject "${subjectName}".

Follow this STRICT structure and return ONLY plain text:

Definition:
(2-3 lines explaining the topic clearly)

Key Concepts:

* point 1
* point 2
* point 3

Example:
(simple example related to the topic)

Summary:
(short summary in 2 lines)

IMPORTANT:

* Do NOT use markdown
* Do NOT add extra headings
* Keep it clean and readable
      `;

      // 2. CALL GEMINI
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });

      // 3. EXTRACT RESPONSE TEXT
      let text = response?.candidates?.[0]?.content?.parts?.[0]?.text || "";

      // 4. CLEAN RESPONSE
      text = text.replace(/```/g, "").trim();

      // 5. VALIDATE RESPONSE
      if (!text || text.length < 20) {
        throw new Error("Invalid AI response");
      }

      // 6. CREATE NOTE OBJECT
      const newNote = {
        id: crypto.randomUUID(),
        subjectSlug: selectedSubject,
        topicSlug: selectedTopic,
        subjectName: subject?.name,
        topicName: topic?.name,
        content: text,
        createdAt: Date.now(),
      };

      // 7. STORE NOTE
      setNotes((prev) => {
        const existingIndex = prev.findIndex(
          (n) =>
            n.subjectSlug === selectedSubject && n.topicSlug === selectedTopic,
        );

        if (existingIndex !== -1) {
          const updated = [...prev];
          updated[existingIndex] = newNote;
          return updated;
        }

        return [...prev, newNote];
      });

      // 8. REDIRECT
      navigate(`/subjects/${selectedSubject}/${selectedTopic}/notes`);
    } catch (err) {
      console.error("Gemini Error:", err);
      setError(err.message || "Failed to generate notes. Please check your API key.");
    } finally {
      setLoading(false);
    }
  };

  // Reset error when selection changes
  useEffect(() => {
    setError("");
  }, [selectedSubject, selectedTopic]);

  const isSelectionMode = !stateSubject || !stateTopic;
  const canGenerate = selectedSubject && selectedTopic && !loading;

  return (
    <div className="w-full h-full flex flex-col p-4 sm:p-8 bg-slate-900 overflow-y-auto font-sans text-slate-100">
      <div className="max-w-xl mx-auto w-full flex flex-col gap-10 py-10">
        {/* Header with Back Button */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            disabled={loading}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-100 rounded-xl transition-colors border border-slate-700 shadow-lg disabled:opacity-50"
            title="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="min-w-0">
            <h1 className="text-3xl font-bold tracking-tight truncate italic">
              {topic?.name || "Explain Topic"}
            </h1>
            <p className="text-slate-400 font-medium truncate">
              {subject?.name || "AI Learning Tool"}
            </p>
          </div>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl space-y-6">
          {isSelectionMode ? (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2 px-1">
                  Select Subject
                </label>
                <div className="relative">
                  <select
                    value={selectedSubject}
                    onChange={(e) => {
                      setSelectedSubject(e.target.value);
                      setSelectedTopic("");
                    }}
                    disabled={loading}
                    className="w-full appearance-none bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-10 disabled:opacity-50"
                  >
                    <option value="">Choose a subject...</option>
                    {subjects.map((s) => (
                      <option key={s.slug} value={s.slug}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2 px-1">
                  Select Topic
                </label>
                <div className="relative">
                  <select
                    value={selectedTopic}
                    onChange={(e) => setSelectedTopic(e.target.value)}
                    disabled={!selectedSubject || filteredTopics.length === 0 || loading}
                    className="w-full appearance-none bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-10 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="">
                      {!selectedSubject
                        ? "Select subject first"
                        : filteredTopics.length === 0
                          ? "No topics found"
                          : "Choose a topic..."}
                    </option>
                    {filteredTopics.map((t) => (
                      <option key={t.slug} value={t.slug}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-4 p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
              <div className="p-2 bg-slate-800 rounded-lg text-slate-400">
                <Info className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">
                  Target Topic
                </p>
                <h3 className="text-lg font-bold text-slate-100 truncate">
                  {topic?.name}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {subject?.name}
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-start gap-3 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl animate-in fade-in slide-in-from-top-2 duration-300">
              <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-sm text-amber-200/90 leading-relaxed font-medium">
                {error}
              </p>
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={!canGenerate}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black rounded-xl transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 group"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Sparkles className="w-5 h-5 group-hover:scale-110 transition-transform" />
            )}
            {loading ? "Generating..." : "Generate Notes"}
          </button>
        </div>
      </div>
    </div>
  );
}
