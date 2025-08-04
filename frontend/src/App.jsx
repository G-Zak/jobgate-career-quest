import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './Dashboard Candidat/Dashboard';
import TestLayout from './Test/TestLayout';
import AvailableTests from './Test/AvailableTests';  
import TechnicalTests from "./Test/TechnicalTests";




export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/tests" element={<AvailableTests />} /> {/* ✅ nouvelle route */}
        <Route path="/test" element={<TestLayout />} />
        <Route path="/technical-tests" element={<TechnicalTests />} />
      </Routes>
    </Router>
  );
}
