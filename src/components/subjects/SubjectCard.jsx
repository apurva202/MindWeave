import React from "react";
import { useNavigate } from "react-router-dom";

export default function SubjectCard({ subject }) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(`/subjects/${subject.slug}`)}
      className="w-full text-left bg-slate-800 rounded-xl p-6 cursor-pointer border border-slate-700 hover:border-slate-500 hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-200 group relative overflow-hidden flex flex-col justify-between min-h-30"
    >
      <div
        className="absolute top-0 left-0 w-1.5 h-full rounded-l-xl opacity-80 group-hover:opacity-100 transition-opacity"
        style={{ backgroundColor: subject.color }}
      />
      <h3 className="text-xl font-semibold text-slate-100 ml-2 group-hover:text-white transition-colors">
        {subject.name}
      </h3>
      <div className="ml-2 mt-auto">
        <span className="text-sm text-slate-400 group-hover:text-slate-300 font-medium transition-colors">
          View Subject &rarr;
        </span>
      </div>
    </button>
  );
}
