import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckSquare, ChevronDown, Loader2 } from "lucide-react";
import { GoogleGenAI } from "@google/genai";
import { useApp } from "../context/AppContext";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

export default function PracticeTest() {
  const navigate = useNavigate();
  const { subjects, topics, tests, setTests, setCurrentTest } = useApp();

  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const filteredTopics = topics.filter((t) => t.subjectSlug === selectedSubject);

  useEffect(() => {
    setSelectedTopic("");
  }, [selectedSubject]);

  const generateTest = async () => {
    setError("");

    // Duplicate check
    const alreadyExists = tests.some(
      (t) => t.subjectSlug === selectedSubject && t.topicSlug === selectedTopic
    );
    if (alreadyExists) {
      setError("A test for this subject and topic already exists. Delete it first or choose a different topic.");
      return;
    }
    const subjectObj = subjects.find((s) => s.slug === selectedSubject);
    const topicObj = topics.find(
      (t) => t.slug === selectedTopic && t.subjectSlug === selectedSubject
    );

    const subjectName = subjectObj?.name ?? selectedSubject;
    const topicName = topicObj?.name ?? selectedTopic;

    const prompt = `Generate 5 multiple-choice questions for the topic "${topicName}" under the subject "${subjectName}".

Rules:
* Each question must have exactly 4 options
* Only one correct answer
* Difficulty: moderate
* Do NOT repeat questions

Return ONLY valid JSON in this format:
[
  {
    "question": "string",
    "options": ["string", "string", "string", "string"],
    "correctAnswer": "string"
  }
]

Do NOT include explanations.
Do NOT include extra text.
Do NOT wrap in markdown.`;

    try {
      setLoading(true);

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });

      let text = response.text ?? "";

      // Strip markdown if Gemini wraps the response
      text = text.replace(/```json/g, "").replace(/```/g, "").trim();

      let questions;
      try {
        questions = JSON.parse(text);
      } catch {
        throw new Error("Invalid JSON from AI");
      }

      if (!Array.isArray(questions) || questions.length === 0) {
        throw new Error("Empty or invalid questions");
      }

      const newTest = {
        id: crypto.randomUUID(),
        subjectSlug: selectedSubject,
        topicSlug: selectedTopic,
        subjectName,
        topicName,
        createdAt: Date.now(),
        questions,
      };

      setTests((prev) => [...prev, newTest]);
      setCurrentTest(newTest);
      navigate("/tests", { state: { newTestId: newTest.id } });
    } catch (error) {
      console.error(error);
      setError(error?.message?.includes("JSON") || error?.message?.includes("invalid")
        ? "AI returned an unexpected response. Please try again."
        : "Failed to generate test. Check your connection or API key and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const canGenerate = selectedSubject && selectedTopic && !loading;

  return (
    <div className="w-full h-full flex flex-col p-4 sm:p-8 bg-slate-900 overflow-y-auto">
      <div className="max-w-xl mx-auto w-full">
        <div className="flex items-center gap-4 mb-10">
          <button
            onClick={() => navigate(-1)}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-slate-100 rounded-lg transition-colors border border-slate-700/50"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-slate-100">Practice Test</h1>
            <p className="text-slate-400 mt-1">Generate and attempt AI-powered tests</p>
          </div>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 space-y-6">
          <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center">
            <CheckSquare className="w-6 h-6 text-indigo-400" />
          </div>

          <div className="space-y-4">
            {/* Subject */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Subject</label>
              <div className="relative">
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  disabled={loading}
                  className="w-full appearance-none bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-10 disabled:opacity-50"
                >
                  <option value="">Select a subject</option>
                  {subjects.map((s) => (
                    <option key={s.slug} value={s.slug}>{s.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Topic */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Topic</label>
              <div className="relative">
                <select
                  value={selectedTopic}
                  onChange={(e) => setSelectedTopic(e.target.value)}
                  disabled={!selectedSubject || filteredTopics.length === 0 || loading}
                  className="w-full appearance-none bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-10 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">
                    {!selectedSubject
                      ? "Select a subject first"
                      : filteredTopics.length === 0
                      ? "No topics available"
                      : "Select a topic"}
                  </option>
                  {filteredTopics.map((t) => (
                    <option key={t.slug} value={t.slug}>{t.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Error banner */}
          {error && (
            <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
              <span className="text-red-400 shrink-0">⚠️</span>
              <div className="flex-1 min-w-0">
                <p className="text-base font-medium text-red-400">Generation failed</p>
                <p className="text-sm text-red-400/80 mt-0.5">{error}</p>
              </div>
              <button
                onClick={() => setError("")}
                className="text-red-500/60 hover:text-red-400 text-lg leading-none shrink-0"
                aria-label="Dismiss"
              >×</button>
            </div>
          )}

          <button
            onClick={generateTest}
            disabled={!canGenerate}
            className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating...
              </>
            ) : (
              "Generate Test"
            )}
          </button>

          {loading && (
            <p className="text-center text-xs text-slate-500">
              Generating questions with AI — this may take a few seconds…
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
