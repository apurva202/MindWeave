import React from "react";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function TopicItem({ topic, subjectSlug }) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() =>
        navigate(`/subjects/${topic.subjectSlug || subjectSlug}/${topic.slug}`)
      }
      className="w-full text-left flex items-center justify-between px-4 py-3 rounded-xl bg-slate-800/50 cursor-pointer hover:bg-slate-800 transition-all group border border-transparent hover:border-slate-700/50 shadow-sm hover:shadow"
    >
      <span className="text-slate-100 font-medium">{topic.name}</span>
      <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-slate-300 transition-colors" />
    </button>
  );
}
