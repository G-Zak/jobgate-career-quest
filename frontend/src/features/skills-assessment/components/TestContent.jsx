import React from 'react';
import QuestionCard from './QuestionCard';

const TestContent = ({
 step,
 setStep,
 currentQuestion,
 setCurrentQuestion,
 testType = 'numerical',
 testTitle,
 description,
 duration,
 questionCount,
 specificInstructions,
 questions = []
}) => {
 const handleNext = () => {
 if (currentQuestion < (questions.length || 20)) {
 setCurrentQuestion(prev => prev + 1);
 } else {
 // End of test
 alert("Test terminé !");
 }
 };

 const handleAnswer = (answer) => {
 console.log("Réponse sélectionnée :", answer);
 // Store the answer
 };

 return (
 <div className="flex-1 px-4">
 {/* Always show questions - no more instructions step */}
 <QuestionCard
 questionNumber={currentQuestion}
 questionText={questions[currentQuestion]?.question || "What is the result of 25 × 4 + 16 ÷ 2?"}
 options={questions[currentQuestion]?.options || ['104', '108', '112', '100', '120']}
 onSelect={handleAnswer}
 onNext={handleNext}
 />
 </div>
 );
};

export default TestContent;
