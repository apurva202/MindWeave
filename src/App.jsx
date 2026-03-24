import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<div className="text-xl font-semibold text-slate-100">Dashboard Content (Outlet Active)</div>} />
          <Route path='/subjects' element={<div>das</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
