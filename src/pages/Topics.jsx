import React from 'react';
import { useParams } from 'react-router-dom';

export default function Topics({ subjects }) {
  const { id } = useParams();
  
  const subject = subjects?.find(s => s.id === id);

  if (!subject) {
    return (
      <div className="w-full flex items-center justify-center p-8 bg-slate-900">
        <div className="text-center bg-slate-800 p-12 rounded-2xl border border-slate-700/80 shadow-2xl">
          <h1 className="text-2xl font-bold text-slate-100 mb-4">Subject not found</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex items-center justify-center p-8 bg-slate-900">
      <div className="text-center bg-slate-800 p-12 rounded-2xl border border-slate-700/80 shadow-2xl">
        <h1 className="text-3xl font-bold text-slate-100 mb-4">Topics</h1>
        <div className="inline-block px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-lg">
          <p className="text-lg font-mono text-indigo-400 mt-1">Topics for {subject.name}</p>
        </div>
      </div>
    </div>
  );
}
