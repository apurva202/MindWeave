import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Subjects from "./pages/Subjects";
import Topics from "./pages/Topics";

export default function App() {
  const [subjects, setSubjects] = useState([]);

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
          <Route path="/subjects" element={<Subjects subjects={subjects} setSubjects={setSubjects} />} />
          <Route path="/subjects/:id" element={<Topics subjects={subjects} />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
