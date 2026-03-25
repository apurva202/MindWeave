import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import TaskItem from "../components/tasks/TaskItem";

export default function Revision() {
  const { tasks, setTasks, subjects, topics } = useApp();
  const [now, setNow] = useState(() => new Date().setHours(0, 0, 0, 0));

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date().setHours(0, 0, 0, 0));
    }, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

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

  const markRevised = (id) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;

        const newCount = (t.revisionCount || 0) + 1;
        let days;
        if (newCount === 1) days = 1;
        else if (newCount === 2) days = 3;
        else if (newCount === 3) days = 7;
        else days = 15;

        return {
          ...t,
          revisionCount: newCount,
          lastRevisedAt: Date.now(),
          nextRevisionAt: Date.now() + days * 24 * 60 * 60 * 1000,
        };
      }),
    );
  };

  const markMastered = (id) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, revisionStopped: true } : t)),
    );
  };

  const reviseNow = (id) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, nextRevisionAt: Date.now() } : t))
    );
  };

  const groupedDueTasks = dueTasks.reduce((acc, task) => {
    if (!acc[task.subjectSlug]) acc[task.subjectSlug] = {};
    if (!acc[task.subjectSlug][task.topicSlug])
      acc[task.subjectSlug][task.topicSlug] = [];
    acc[task.subjectSlug][task.topicSlug].push(task);
    return acc;
  }, {});

  const groupedUpcomingTasks = upcomingTasks.reduce((acc, task) => {
    if (!acc[task.subjectSlug]) acc[task.subjectSlug] = {};
    if (!acc[task.subjectSlug][task.topicSlug])
      acc[task.subjectSlug][task.topicSlug] = [];
    acc[task.subjectSlug][task.topicSlug].push(task);
    return acc;
  }, {});

  const groupedMasteredTasks = masteredTasks.reduce((acc, task) => {
    if (!acc[task.subjectSlug]) acc[task.subjectSlug] = {};
    if (!acc[task.subjectSlug][task.topicSlug])
      acc[task.subjectSlug][task.topicSlug] = [];
    acc[task.subjectSlug][task.topicSlug].push(task);
    return acc;
  }, {});

  return (
    <div className="w-full h-full flex flex-col p-4 sm:p-8 bg-slate-900 overflow-y-auto">
      <div className="max-w-4xl mx-auto w-full mb-8">
        <h1 className="text-3xl font-bold text-slate-100 mb-2">
          Revision Overview
        </h1>
        <p className="text-slate-400">
          Master your tasks using spaced repetition
        </p>
      </div>

      <div className="flex-1 w-full max-w-4xl mx-auto space-y-8">
        {dueTasks.length === 0 &&
        upcomingTasks.length === 0 &&
        masteredTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-slate-800/30 border border-slate-700/50 rounded-xl border-dashed mt-8">
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4 border border-slate-700 shadow-sm">
              <span className="text-3xl">🎉</span>
            </div>
            <h3 className="text-xl font-semibold text-slate-100 mb-2">
              Nothing to revise
            </h3>
            <p className="text-slate-400 max-w-sm mx-auto">
              You're all caught up! Complete tasks to schedule spaced
              repetition.
            </p>
          </div>
        ) : (
          <>
            <section>
              <h2 className="text-xl font-semibold text-slate-200 mb-6 flex items-center gap-2">
                Due Today ({dueTasks.length})
              </h2>

              {dueTasks.length === 0 ? (
                <div className="p-6 bg-slate-800/40 rounded-xl border border-slate-700/50 text-center">
                  <p className="text-slate-400">
                    No revisions scheduled for today. Great job!
                  </p>
                </div>
              ) : (
                <div className="space-y-8">
                  {Object.entries(groupedDueTasks).map(
                    ([subjectSlug, topicGroups]) => {
                      const subject = subjects.find(
                        (s) => s.slug === subjectSlug,
                      );
                      return (
                        <div key={subjectSlug} className="space-y-4">
                          <h3 className="text-lg font-bold text-indigo-400 border-b border-slate-700 pb-2">
                            {subject ? subject.name : subjectSlug}
                          </h3>

                          <div className="space-y-6">
                            {Object.entries(topicGroups).map(
                              ([topicSlug, topicTasks]) => {
                                const topic = topics.find(
                                  (t) =>
                                    t.slug === topicSlug &&
                                    t.subjectSlug === subjectSlug,
                                );
                                return (
                                  <div
                                    key={topicSlug}
                                    className="space-y-3 pl-4 border-l-2 border-slate-700/50"
                                  >
                                    <h4 className="text-md font-semibold text-slate-300">
                                      {topic ? topic.name : topicSlug}
                                    </h4>
                                    <div className="flex flex-col gap-3">
                                      {topicTasks.map((task) => (
                                        <TaskItem
                                          key={task.id}
                                          task={task}
                                          onRevise={() => markRevised(task.id)}
                                          onStopRevision={() =>
                                            markMastered(task.id)
                                          }
                                          showRevisionActions={true}
                                          showContext={false}
                                        />
                                      ))}
                                    </div>
                                  </div>
                                );
                              },
                            )}
                          </div>
                        </div>
                      );
                    },
                  )}
                </div>
              )}
            </section>

            {upcomingTasks.length > 0 && (
              <section className="pt-8 border-t border-slate-700/50">
                <h2 className="text-xl font-semibold text-slate-200 mb-6 flex items-center gap-2">
                  Upcoming ({upcomingTasks.length})
                </h2>
                <div className="space-y-8 opacity-70">
                  {Object.entries(groupedUpcomingTasks).map(
                    ([subjectSlug, topicGroups]) => {
                      const subject = subjects.find(
                        (s) => s.slug === subjectSlug,
                      );
                      return (
                        <div key={subjectSlug} className="space-y-4">
                          <h3 className="text-lg font-bold text-slate-400 border-b border-slate-700 pb-2">
                            {subject ? subject.name : subjectSlug}
                          </h3>

                          <div className="space-y-6">
                            {Object.entries(topicGroups).map(
                              ([topicSlug, topicTasks]) => {
                                const topic = topics.find(
                                  (t) =>
                                    t.slug === topicSlug &&
                                    t.subjectSlug === subjectSlug,
                                );
                                return (
                                  <div
                                    key={topicSlug}
                                    className="space-y-3 pl-4 border-l-2 border-slate-700/50"
                                  >
                                    <h4 className="text-md font-semibold text-slate-300">
                                      {topic ? topic.name : topicSlug}
                                    </h4>
                                    <div className="flex flex-col gap-3">
                                      {topicTasks.map((task) => (
                                        <TaskItem
                                          key={task.id}
                                          task={task}
                                          onReviseNow={() => reviseNow(task.id)}
                                          showRevisionActions={true}
                                          showContext={false}
                                        />
                                      ))}
                                    </div>
                                  </div>
                                );
                              },
                            )}
                          </div>
                        </div>
                      );
                    },
                  )}
                </div>
              </section>
            )}

            {masteredTasks.length > 0 && (
              <section className="pt-8 border-t border-slate-700/50">
                <h2 className="text-xl font-semibold text-slate-200 mb-6 flex items-center gap-2">
                  Mastered ({masteredTasks.length})
                </h2>
                <div className="space-y-8">
                  {Object.entries(groupedMasteredTasks).map(
                    ([subjectSlug, topicGroups]) => {
                      const subject = subjects.find(
                        (s) => s.slug === subjectSlug,
                      );
                      return (
                        <div key={subjectSlug} className="space-y-4">
                          <h3 className="text-lg font-bold text-emerald-500/80 border-b border-slate-700 pb-2">
                            {subject ? subject.name : subjectSlug}
                          </h3>

                          <div className="space-y-6">
                            {Object.entries(topicGroups).map(
                              ([topicSlug, topicTasks]) => {
                                const topic = topics.find(
                                  (t) =>
                                    t.slug === topicSlug &&
                                    t.subjectSlug === subjectSlug,
                                );
                                return (
                                  <div
                                    key={topicSlug}
                                    className="space-y-3 pl-4 border-l-2 border-slate-700/50"
                                  >
                                    <h4 className="text-md font-semibold text-slate-300">
                                      {topic ? topic.name : topicSlug}
                                    </h4>
                                    <div className="flex flex-col gap-3">
                                      {topicTasks.map((task) => (
                                        <TaskItem
                                          key={task.id}
                                          task={task}
                                          showRevisionActions={false}
                                          showContext={false}
                                        />
                                      ))}
                                    </div>
                                  </div>
                                );
                              },
                            )}
                          </div>
                        </div>
                      );
                    },
                  )}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
}
