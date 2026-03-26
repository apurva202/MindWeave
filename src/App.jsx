import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Subjects from "./pages/Subjects";
import Topics from "./pages/Topics";
import TopicDetail from "./pages/TopicDetail";
import Tasks from "./pages/Tasks";
import Revision from "./pages/Revision";
import AITools from "./pages/AITools";
import PracticeTest from "./pages/PracticeTest";
import Tests from "./pages/Tests";
import TestAttempt from "./pages/TestAttempt";
import Results from "./pages/Results";
import ResultDetail from "./pages/ResultDetail";
import Notes from "./pages/Notes";
import ExplainTopic from "./pages/ExplainTopic";
import { AppProvider } from "./context/AppContext";

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<div>Dashboard</div>} />
            <Route path="/subjects" element={<Subjects />} />
            <Route path="/subjects/:subjectSlug" element={<Topics />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/revision" element={<Revision />} />
            <Route path="/ai-tools" element={<AITools />} />
            <Route path="/ai-tools/practice-test" element={<PracticeTest />} />
            <Route path="/ai-tools/explain-topic" element={<ExplainTopic />} />
            <Route path="/tests" element={<Tests />} />
            <Route path="/tests/results" element={<Results />} />
            <Route path="/tests/result/:resultId" element={<ResultDetail />} />
            <Route
              path="/subjects/:subjectSlug/:topicSlug/notes"
              element={<Notes />}
            />
            <Route
              path="/subjects/:subjectSlug/:topicSlug"
              element={<TopicDetail />}
            />
          </Route>
          <Route path="/tests/attempt/:testId" element={<TestAttempt />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
