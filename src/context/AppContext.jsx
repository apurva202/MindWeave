import React, { createContext, useContext, useState, useEffect } from "react";

const AppContext = createContext();

export function AppProvider({ children }) {
  const [subjects, setSubjects] = useState(() => {
    const saved = localStorage.getItem("mindweave_subjects");
    return saved ? JSON.parse(saved) : [];
  });
  
  const [topics, setTopics] = useState(() => {
    const saved = localStorage.getItem("mindweave_topics");
    return saved ? JSON.parse(saved) : [];
  });
  
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("mindweave_tasks");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("mindweave_subjects", JSON.stringify(subjects));
  }, [subjects]);

  useEffect(() => {
    localStorage.setItem("mindweave_topics", JSON.stringify(topics));
  }, [topics]);

  useEffect(() => {
    localStorage.setItem("mindweave_tasks", JSON.stringify(tasks));
  }, [tasks]);

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const deleteSubject = (slug) => {
    setSubjects((prev) => prev.filter((s) => s.slug !== slug));
    setTopics((prev) => prev.filter((t) => t.subjectSlug !== slug));
    setTasks((prev) => prev.filter((t) => t.subjectSlug !== slug));
  };

  const deleteTopic = (subjectSlug, topicSlug) => {
    setTopics((prev) =>
      prev.filter((t) => !(t.subjectSlug === subjectSlug && t.slug === topicSlug))
    );
    setTasks((prev) =>
      prev.filter((t) => !(t.subjectSlug === subjectSlug && t.topicSlug === topicSlug))
    );
  };

  return (
    <AppContext.Provider
      value={{
        subjects,
        setSubjects,
        topics,
        setTopics,
        tasks,
        setTasks,
        deleteTask,
        deleteSubject,
        deleteTopic,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
