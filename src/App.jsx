import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Subjects from "./pages/Subjects";
import Topics from "./pages/Topics";
import TopicDetail from "./pages/TopicDetail";
import Tasks from "./pages/Tasks";
import { AppProvider } from "./context/AppContext";

export default function App() {
  return (
    <AppProvider>
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
            <Route path="/subjects" element={<Subjects />} />
            <Route path="/subjects/:subjectSlug" element={<Topics />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route
              path="/subjects/:subjectSlug/:topicSlug"
              element={<TopicDetail />}
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
