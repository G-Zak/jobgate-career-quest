import React from 'react';

const Instructions = ({ 
  onStart, 
  testType = 'numerical', 
  testTitle = 'NUMERICAL REASONING TEST: NRT1',
  description = 'This test has been designed to assess your numerical reasoning ability using the information provided in a series of charts, tables and figures.',
  duration = '18 minutes',
  questionCount = '20 questions',
  specificInstructions = []
}) => {
  
  // Default instructions based on test type
  const getDefaultInstructions = (type) => {
    switch (type) {
      case 'situational':
      case 'sjt':
      case 'master-sjt':
        return {
          title: 'SITUATIONAL JUDGMENT TEST',
          description: 'This test assesses your judgment in workplace situations. You will be presented with realistic workplace scenarios and asked to choose the most appropriate response.',
          duration: '25 minutes',
          questionCount: '20 questions',
          instructions: [
            'Please take this test in a quiet environment where you are unlikely to be distracted',
            'Read each scenario carefully before selecting your response',
            'Choose the response that you believe would be most effective in the situation',
            'Work both quickly and accurately',
            'Trust your professional instincts when making decisions'
          ]
        };
      case 'verbal':
        return {
          title: 'VERBAL REASONING TEST',
          description: 'This test evaluates your ability to understand and analyze written information, including comprehension, vocabulary, and logical reasoning.',
          duration: '20 minutes',
          questionCount: '25 questions',
          instructions: [
            'Please take this test in a quiet environment where you are unlikely to be distracted',
            'Read each passage or question carefully',
            'Base your answers only on the information provided',
            'Work both quickly and accurately',
            'If you are unsure, make your best educated guess'
          ]
        };
      case 'spatial':
        return {
          title: 'SPATIAL REASONING TEST',
          description: 'This test measures your ability to visualize and manipulate objects in space, including rotation, pattern recognition, and 3D visualization.',
          duration: '15 minutes',
          questionCount: '20 questions',
          instructions: [
            'Please take this test in a quiet environment where you are unlikely to be distracted',
            'Visualize each shape or pattern carefully',
            'Take your time to understand the spatial relationships',
            'Work both quickly and accurately',
            'Use mental rotation techniques when needed'
          ]
        };
      case 'numerical':
      default:
        return {
          title: 'NUMERICAL REASONING TEST: NRT1',
          description: 'This test has been designed to assess your numerical reasoning ability using the information provided in a series of charts, tables and figures.',
          duration: '18 minutes',
          questionCount: '20 questions',
          instructions: [
            'Please take this test in a quiet environment where you are unlikely to be distracted',
            'You may use a calculator for this test',
            'Ensure you have rough paper for working out',
            'Work both quickly and accurately',
            'If required for accessibility purposes, additional time can be assigned in your profile. If you are not using a mobile device, you can navigate this test without using your keyboard, using the arrow keys to move between items.'
          ]
        };
    }
  };

  const defaults = getDefaultInstructions(testType);
  const finalTitle = testTitle !== 'NUMERICAL REASONING TEST: NRT1' ? testTitle : defaults.title;
  const finalDescription = description !== 'This test has been designed to assess your numerical reasoning ability using the information provided in a series of charts, tables and figures.' ? description : defaults.description;
  const finalDuration = duration !== '18 minutes' ? duration : defaults.duration;
  const finalQuestionCount = questionCount !== '20 questions' ? questionCount : defaults.questionCount;
  const finalInstructions = specificInstructions.length > 0 ? specificInstructions : defaults.instructions;

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-4">{finalTitle}</h2>
        <p className="text-gray-700 mb-4">
          {finalDescription}
          {testType === 'numerical' && (
            <> Look at each chart or table provided for each question,
              and use the information in these to work out the correct answer.
              You have 5 options from which to choose from. Only one of these options is the correct answer.</>
          )}
        </p>

        <p className="text-md font-semibold text-gray-800 mb-2">Remember:</p>
        <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
          {finalInstructions.map((instruction, index) => (
            <li key={index}>{instruction}</li>
          ))}
        </ul>

        <p className="text-gray-700 mb-8">
          This test consists of <strong>{finalQuestionCount}</strong> and you have <strong>{finalDuration}</strong> in which
          to complete this. The questions are numbered across the top of the screen.
        </p>

        <div className="text-right">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg text-lg transition"
            onClick={onStart}
          >
            START →
          </button>
        </div>
      </div>
    </div>
  );
};

export default Instructions;
