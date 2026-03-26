import React from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  FileText,
  CheckSquare,
  Sparkles,
  CalendarClock,
  TrendingUp,
  ClipboardList,
  BrainCircuit,
  MessageCircleQuestion,
  ChevronRight,
  FlameKindling,
  Trophy,
  Star,
} from "lucide-react";
import { useApp } from "../context/AppContext";

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good Morning";
  if (h < 18) return "Good Afternoon";
  return "Good Evening";
}

function formatDate() {
  return new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function StatCard({ icon: Icon, label, value, sub, color = "indigo" }) {
  const colorMap = {
    indigo: "bg-indigo-500/10 text-indigo-400",
    violet: "bg-violet-500/10 text-violet-400",
    emerald: "bg-emerald-500/10 text-emerald-400",
    amber: "bg-amber-500/10 text-amber-400",
  };
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-3.5 sm:p-5 flex items-center gap-3 sm:gap-4">
      <div className={`p-2 sm:p-3 rounded-xl ${colorMap[color]} shrink-0`}>
        <Icon className="w-4 h-4 sm:w-6 sm:h-6" />
      </div>
      <div className="min-w-0">
        <p className="text-xl sm:text-2xl font-black text-slate-100">{value}</p>
        <p className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</p>
        {sub && <p className="text-[10px] sm:text-xs text-slate-500 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

function SectionCard({ title, children, cta, onCta, ctaIcon: CtaIcon }) {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4 sm:p-6 flex flex-col gap-4 h-full">
      <h2 className="text-xs sm:text-base font-black text-slate-300 uppercase tracking-widest">{title}</h2>
      <div className="flex-1">{children}</div>
      {cta && (
        <button
          onClick={onCta}
          className="flex items-center justify-between w-full px-4 py-3 bg-slate-900 hover:bg-slate-700 border border-slate-700 rounded-xl text-slate-300 hover:text-slate-100 text-sm font-bold transition-all group"
        >
          <span className="flex items-center gap-2">
            {CtaIcon && <CtaIcon className="w-4 h-4" />}
            {cta}
          </span>
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      )}
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { subjects, topics, tasks, tests, results, notes } = useApp();

  // ── Task stats ──────────────────────────────────────────────
  const completedTasks = tasks.filter((t) => t.completed).length;
  const completionPct =
    tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

  // ── Revision stats (mirrors Revision.jsx) ───────────────────
  const now = new Date().setHours(0, 0, 0, 0);
  const dueTasks = tasks.filter(
    (t) =>
      t.completed &&
      t.nextRevisionAt &&
      new Date(t.nextRevisionAt).setHours(0, 0, 0, 0) <= now &&
      !t.revisionStopped,
  );
  const upcomingTasks = tasks.filter(
    (t) =>
      t.completed &&
      t.nextRevisionAt &&
      new Date(t.nextRevisionAt).setHours(0, 0, 0, 0) > now &&
      !t.revisionStopped,
  );
  const masteredTasks = tasks.filter((t) => t.completed && t.revisionStopped);

  // ── Test/result stats ────────────────────────────────────────
  const avgScore =
    results.length > 0
      ? Math.round(
          results.reduce((sum, r) => sum + (r.total > 0 ? (r.score / r.total) * 100 : 0), 0) /
            results.length,
        )
      : null;
  const bestScore =
    results.length > 0
      ? Math.max(...results.map((r) => (r.total > 0 ? Math.round((r.score / r.total) * 100) : 0)))
      : null;
  const latestResult =
    results.length > 0
      ? results.reduce((a, b) => (a.completedAt > b.completedAt ? a : b))
      : null;

  const aiTools = [
    {
      id: "practice-test",
      icon: CheckSquare,
      title: "Practice Test",
      desc: "Generate AI quiz",
      color: "text-indigo-400",
      bg: "bg-indigo-500/10",
      route: "/ai-tools/practice-test",
    },
    {
      id: "explain-topic",
      icon: BrainCircuit,
      title: "Explain Topic",
      desc: "Generate AI notes",
      color: "text-violet-400",
      bg: "bg-violet-500/10",
      route: "/ai-tools/explain-topic",
    },
    {
      id: "doubt-solver",
      icon: MessageCircleQuestion,
      title: "Doubt Solver",
      desc: "Ask any question",
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      route: "/ai-tools/doubt-solver",
    },
  ];

  return (
    <div className="w-full h-full flex flex-col p-4 sm:p-8 bg-slate-900 overflow-y-auto font-sans text-slate-100">
      <div className="max-w-5xl mx-auto w-full flex flex-col gap-8 pb-10">

        {/* ── Header ─────────────────────────────────────────── */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            {getGreeting()} 👋
          </h1>
          <p className="text-slate-400 text-sm sm:text-base font-medium mt-1 truncate">{formatDate()}</p>
        </div>

        {/* ── Quick Stats ──────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={BookOpen}
            label="Subjects"
            value={subjects.length}
            color="indigo"
          />
          <StatCard
            icon={FileText}
            label="Topics"
            value={topics.length}
            color="violet"
          />
          <StatCard
            icon={CheckSquare}
            label="Tasks Done"
            value={`${completionPct}%`}
            sub={`${completedTasks} / ${tasks.length}`}
            color="emerald"
          />
          <StatCard
            icon={Sparkles}
            label="Notes"
            value={notes.length}
            color="amber"
          />
        </div>

        {/* ── Two-Column Grid ─────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Left: Revision Alerts */}
          <SectionCard
            title="Revision"
            cta="Open Revision"
            onCta={() => navigate("/revision")}
            ctaIcon={CalendarClock}
          >
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <div className="flex items-center gap-3">
                  <FlameKindling className="w-5 h-5 text-amber-400" />
                  <span className="font-bold text-slate-200">Due Today</span>
                </div>
                <span className="text-xl font-black text-amber-400">{dueTasks.length}</span>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/60 border border-slate-700/60">
                <div className="flex items-center gap-3">
                  <CalendarClock className="w-5 h-5 text-slate-400" />
                  <span className="font-bold text-slate-400">Upcoming</span>
                </div>
                <span className="text-xl font-black text-slate-300">{upcomingTasks.length}</span>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <div className="flex items-center gap-3">
                  <Trophy className="w-5 h-5 text-emerald-400" />
                  <span className="font-bold text-slate-200">Mastered</span>
                </div>
                <span className="text-xl font-black text-emerald-400">{masteredTasks.length}</span>
              </div>
            </div>
          </SectionCard>

          {/* Right: Test Performance */}
          <SectionCard
            title="Test Performance"
            cta="View Results"
            onCta={() => navigate("/tests/results")}
            ctaIcon={ClipboardList}
          >
            {results.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-8 text-center gap-2">
                <ClipboardList className="w-10 h-10 text-slate-600" />
                <p className="text-slate-500 font-semibold">No results yet</p>
                <button
                  onClick={() => navigate("/ai-tools/practice-test")}
                  className="text-indigo-400 hover:text-indigo-300 text-sm font-bold mt-1 hover:underline"
                >
                  Generate your first test →
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-center">
                    <p className="text-2xl font-black text-indigo-400">{avgScore}%</p>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Avg Score</p>
                  </div>
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                    <p className="text-2xl font-black text-emerald-400">{bestScore}%</p>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Best Score</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/60 border border-slate-700/60">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-5 h-5 text-slate-400" />
                    <span className="font-bold text-slate-400">Total Attempts</span>
                  </div>
                  <span className="text-xl font-black text-slate-300">{results.length}</span>
                </div>
                {latestResult && (
                  <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-900/40 border border-slate-700/40">
                    <Star className="w-4 h-4 text-amber-400 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Last Attempt</p>
                      <p className="text-sm text-slate-300 font-semibold truncate">{latestResult.topicName || latestResult.subjectName || "Test"}</p>
                    </div>
                    <span className="ml-auto text-sm font-black text-amber-400 shrink-0">
                      {latestResult.total > 0 ? Math.round((latestResult.score / latestResult.total) * 100) : 0}%
                    </span>
                  </div>
                )}
              </div>
            )}
          </SectionCard>
        </div>

        {/* ── AI Tools Shortcuts ───────────────────────────────── */}
        <div>
          <h2 className="text-xs sm:text-base font-black text-slate-300 uppercase tracking-widest mb-3 sm:mb-4">AI Tools</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {aiTools.map((tool) => (
              <button
                key={tool.id}
                onClick={() => navigate(tool.route)}
                className="flex items-center gap-3 sm:gap-4 p-4 sm:p-5 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 rounded-2xl transition-all text-left group active:scale-[0.98]"
              >
                <div className={`p-2.5 sm:p-3 rounded-xl ${tool.bg} ${tool.color} shrink-0 group-hover:scale-110 transition-transform`}>
                  <tool.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-slate-100 text-sm sm:text-base">{tool.title}</p>
                  <p className="text-xs text-slate-500">{tool.desc}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400 shrink-0 group-hover:translate-x-1 transition-all" />
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
