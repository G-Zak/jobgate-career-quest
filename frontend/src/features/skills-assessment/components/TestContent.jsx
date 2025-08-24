import React from 'react';
import Instructions from './Instructions';
import QuestionCard from './QuestionCard';

const TestContent = ({ step, setStep, currentQuestion, setCurrentQuestion }) => {
  const handleNext = () => {
    if (currentQuestion < 20) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      // Tu peux afficher une page de fin ici
      alert("Test terminé !");
    }
  };

  const handleAnswer = (answer) => {
    // tu peux stocker la réponse plus tard
  };

  return (
    <div className="flex-1 px-4">
      {step === 'instructions' && (
        <Instructions onStart={() => setStep('question')} />
      )}

      {step === 'question' && (
        <QuestionCard
          questionNumber={currentQuestion}
          questionText="What is the result of 25 × 4 + 16 ÷ 2?"
          options={['104', '108', '112', '100', '120']}
          onSelect={handleAnswer}
          onNext={handleNext}
        />
      )}
    </div>
  );
};

export default TestContent;
