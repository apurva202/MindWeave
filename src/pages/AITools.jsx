import React from "react";
import { useNavigate } from "react-router-dom";
import { CheckSquare, BookOpen, Sparkles } from "lucide-react";
import ToolCard from "../components/tools/ToolCard";

const tools = [
  {
    id: "practice-test",
    icon: CheckSquare,
    title: "Practice Test",
    description: "Test your understanding with AI-generated questions",
    iconColor: "text-indigo-400",
    iconBg: "bg-indigo-500/10",
  },
  {
    id: "explain-topic",
    icon: BookOpen,
    title: "Explain Topic",
    description: "Get clear explanations and examples instantly",
    iconColor: "text-violet-400",
    iconBg: "bg-violet-500/10",
  },
  {
    id: "doubt-solver",
    icon: Sparkles,
    title: "Doubt Solver",
    description: "Ask questions and get step-by-step solutions",
    iconColor: "text-emerald-400",
    iconBg: "bg-emerald-500/10",
  },
];

export default function AITools() {
  const navigate = useNavigate();

  const handleClick = (id) => {
    if (id === "practice-test") navigate("/ai-tools/practice-test");
    else console.log(id);
  };
  return (
    <div className="w-full h-full flex flex-col p-4 sm:p-8 bg-slate-900 overflow-y-auto">
      <div className="max-w-5xl mx-auto w-full">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-slate-100 mb-2">AI Tools</h1>
          <p className="text-slate-400">
            Enhance your learning with AI-powered tools
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <ToolCard
              key={tool.id}
              icon={tool.icon}
              title={tool.title}
              description={tool.description}
              iconColor={tool.iconColor}
              iconBg={tool.iconBg}
              onClick={() => handleClick(tool.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
