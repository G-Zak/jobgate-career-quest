import React, { useState, useEffect } from 'react';
import HeaderBar from './HeaderBar'; // ✅ Important
import TestHeader from './TestHeader';
import TestContent from './TestContent';
import { useScrollToTop } from '../../../shared/utils/scrollUtils';

const TestLayout = () => {
  const [step, setStep] = useState('instructions');
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [timer, setTimer] = useState(18 * 60); // 18 minutes

  // Universal scroll management
  useScrollToTop([], { smooth: true }); // Scroll on component mount

  useEffect(() => {
    if (step !== 'question') return;

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [step]);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 🌐 Barre de navigation principale */}
      <HeaderBar />

      {/* 🎯 Header du test uniquement pendant la phase question */}
      {step === 'question' && (
        <TestHeader
          currentQuestion={currentQuestion}
          totalQuestions={20}
          timer={timer}
          onAbort={() => alert('Test aborted')}
        />
      )}

      {/* 🧠 Contenu du test */}
      <main className="p-4">
        <TestContent
          step={step}
          setStep={setStep}
          currentQuestion={currentQuestion}
          setCurrentQuestion={setCurrentQuestion}
        />
      </main>
    </div>
  );
};

export default TestLayout;
