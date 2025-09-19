import React, { useMemo, useRef, useState, useEffect } from "react";
import backendApi from '../api/backendApi';
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FaUsers, FaSearchPlus } from "react-icons/fa";
import UnifiedTestRunnerShell from "./UnifiedTestRunnerShellNew";
import { getRuleFor, buildAttempt } from "../testRules";
import { saveAttempt } from "../lib/attemptStorage";
import { loadSjtPool } from "../data/sjtPool";

export default function SituationalJudgmentTest({ onBackToDashboard, onComplete, testId: propTestId }) {
  const { testId: paramTestId } = useParams();
  const testId = propTestId || paramTestId || "situational";
  const navigate = useNavigate();
  const rule = getRuleFor(testId) || { timeLimitMin: 20, totalQuestions: 20, difficultyLabel: "mixed" };

  // Answers keyed by question id
  const [answers, setAnswers] = useState({});
  const [idx, setIdx] = useState(0);
  const startedAtRef = useRef(Date.now());
  const containerRef = useRef(null);

  // Load questions
  const questions = useMemo(() => {
    const pool = loadSjtPool(testId);
    // Take only the required number of questions
    return pool.slice(0, rule.totalQuestions);
  }, [testId, rule.totalQuestions]);

  const current = questions[idx];
  const currentAnswered = current && answers[current.id] != null;
  const isLast = idx + 1 >= rule.totalQuestions;

  // Scroll to top function
  const scrollToTop = () => {
    // Target the main scrollable container in MainDashboard
    const mainScrollContainer = document.querySelector('.main-content-area .overflow-y-auto');
    if (mainScrollContainer) {
      // Smooth scroll to top
      mainScrollContainer.scrollTo({ 
        top: 0, 
        behavior: 'smooth',
        block: 'start'
      });
    } else {
      // Fallback to window scroll
      window.scrollTo({ 
        top: 0, 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  // Controlled scroll timing - only scroll when question actually changes
  useEffect(() => {
    if (idx > 0) {
      // Small delay to ensure DOM has updated after question change
      const timer = setTimeout(() => {
        scrollToTop();
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [idx]);

  function onSelect(optionId) {
    if (!current) return;
    setAnswers((s) => ({ ...s, [current.id]: optionId }));
  }

  function onPrev() { 
    if (idx > 0) {
      setIdx((i) => i - 1);
      // Smooth scroll to top after navigation
      setTimeout(() => scrollToTop(), 150);
    }
  }
  
  function onNext() { 
    if (!isLast) {
      setIdx((i) => i + 1);
      // Smooth scroll to top after navigation
      setTimeout(() => scrollToTop(), 150);
    }
  }

  function computeScore() {
    let correct = 0;
    for (const q of questions) {
      // Check if user answer matches the correct answer index
      if (answers[q.id] !== undefined && answers[q.id] === q.correct) {
        correct++;
      }
    }
    const total = rule.totalQuestions;
    const percentage = total ? Math.round((correct / total) * 100) : 0;
    return { correct, total, percentage };
  }

  function onAbort() {
    if (!window.confirm("Abort the test and return to the dashboard?")) return;
    scrollToTop();
    if (onBackToDashboard) {
      onBackToDashboard();
    } else {
      navigate("/assessments");
    }
  }

  function onSubmit({ reason }) {
    const { correct, total, percentage } = computeScore();
    scrollToTop();
    
    // Build attempt record
    const attempt = buildAttempt(testId, total, correct, startedAtRef.current, reason);
    
    // Save attempt locally
    saveAttempt(attempt);
    
    // Create results object for MainDashboard routing system
    const results = {
      correct, 
      total, 
      percentage,
      result: reason === "time" ? "timeout" : "completed",
      duration: Math.round((Date.now() - startedAtRef.current) / 1000),
      testType: 'Situational Judgment',
      testName: 'Situational Judgment Test',
      attempt
    };
    
    // Use MainDashboard routing system if available
    if (onComplete && typeof onComplete === 'function') {
      // This will be handled by the parent component (MainDashboard)
      onComplete(results);
    } else if (onBackToDashboard && typeof onBackToDashboard === 'function') {
      // Fallback to onBackToDashboard
      onBackToDashboard(results);
    } else {
      // Fallback to React Router navigation
      navigate(`/tests/${testId}/results`, { state: results });
    }
  }

  if (!current) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">No questions available.</div>
      </div>
    );
  }

  return (
    <UnifiedTestRunnerShell
      meta={{ 
        id: testId, 
        title: "Situational Judgment Test", 
        timeLimit: rule.timeLimitMin, 
        totalQuestions: rule.totalQuestions 
      }}
      currentIndex={idx}
      total={rule.totalQuestions}
      onPrev={onPrev}
      onNext={onNext}
      onAbort={onAbort}
      onSubmit={onSubmit}
      isLast={isLast}
      canNext={!!currentAnswered}
      sectionIndex={null}
      sectionTotal={null}
      hidePauseButton={true}
    >
      {/* Single vertical stack (no side-by-side) */}
      <div className="flex flex-col gap-6" ref={containerRef}>
        {/* Scenario (top) */}
        <section className="bg-white rounded-2xl shadow-lg border border-white/20 p-8" role="region" aria-label="Scenario">
          <div className="flex items-center gap-3 mb-4">
            <FaUsers className="text-blue-600 text-xl" />
            <h2 className="text-xl font-semibold text-gray-900">Scenario</h2>
          </div>
          <article className="prose max-w-none leading-relaxed text-gray-900 whitespace-pre-line text-base">
            {current.scenario}
          </article>
        </section>

        {/* Question & Options (bottom) */}
        <section className="bg-white rounded-2xl shadow-lg border border-white/20 p-8" role="group" aria-labelledby={`q-${current.id}-label`}>
          <h3 id={`q-${current.id}-label`} className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <FaSearchPlus className="mr-2 text-green-600" />
            {current.prompt || "What would you do in this situation?"}
          </h3>

          {/* Radio-group semantics for accessibility */}
          <div role="radiogroup" aria-labelledby={`q-${current.id}-label`} className="grid gap-4">
            {(current.options || []).map((opt) => {
              const isSelected = answers[current.id] === opt.id;
              return (
                <motion.label
                  key={opt.id}
                  className={`w-full rounded-xl border-2 px-6 py-4 cursor-pointer transition-all duration-200 ${
                    isSelected 
                      ? "border-blue-500 bg-blue-50 text-blue-700 shadow-lg" 
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50 hover:shadow-md"
                  }`}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <input
                    type="radio"
                    name={`q-${current.id}`}
                    value={opt.id}
                    className="sr-only"
                    checked={isSelected}
                    onChange={() => onSelect(opt.id)}
                  />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 text-sm font-bold ${
                        isSelected 
                          ? "bg-blue-500 text-white" 
                          : "bg-gray-200 text-gray-600"
                      }`}>
                        {opt.id}
                      </span>
                      <span className="text-base leading-relaxed">{opt.text}</span>
                    </div>
                    {isSelected && (
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    )}
                  </div>
                </motion.label>
              );
            })}
          </div>
        </section>
      </div>
    </UnifiedTestRunnerShell>
  );
}