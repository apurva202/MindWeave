import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Subjects from "./pages/Subjects";
import Topics from "./pages/Topics";
import TopicDetail from "./pages/TopicDetail";

export default function App() {
  const [subjects, setSubjects] = useState([]);
  const [topics, setTopics] = useState({});
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route
            index
            element={
              <div className="text-xl font-semibold text-slate-100">
                Dashboard Content (Outlet Active)
              </div>
            }
          />
          <Route
            path="/subjects"
            element={<Subjects subjects={subjects} setSubjects={setSubjects} />}
          />
          <Route
            path="/subjects/:subjectSlug"
            element={
              <Topics
                subjects={subjects}
                topics={topics}
                setTopics={setTopics}
              />
            }
          />
          <Route
            path="/subjects/:subjectSlug/:topicSlug"
            element={<TopicDetail subjects={subjects} topics={topics} />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
