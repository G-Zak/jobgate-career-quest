import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ClockIcon, 
  UserGroupIcon, 
  ShieldCheckIcon, 
  ChatBubbleBottomCenterTextIcon,
  UsersIcon,
  ExclamationTriangleIcon,
  HeartIcon,
  BriefcaseIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  PlayIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

const DOMAIN_ICONS = {
  teamwork: UserGroupIcon,
  leadership: BriefcaseIcon,
  communication: ChatBubbleBottomCenterTextIcon,
  customer_service: UsersIcon,
  ethics: ShieldCheckIcon,
  inclusivity: HeartIcon,
  conflict: ExclamationTriangleIcon,
  safety: ShieldCheckIcon
};

const DOMAIN_COLORS = {
  teamwork: 'bg-blue-500',
  leadership: 'bg-purple-500',
  communication: 'bg-green-500',
  customer_service: 'bg-orange-500',
  ethics: 'bg-red-500',
  inclusivity: 'bg-pink-500',
  conflict: 'bg-yellow-500',
  safety: 'bg-gray-500'
};

// Utility functions
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

// Sample questions as fallback
const getSampleQuestions = () => {
  return [
    {
      id: "SJT-SAMPLE-001",
      domain: "teamwork",
      scenario: "Your team is working on a tight deadline project. One team member, Sarah, is struggling to complete their tasks on time and this is affecting the entire team's progress.",
      choices: [
        "Ignore the issue and focus on your own tasks",
        "Offer to help Sarah with her tasks while maintaining your own responsibilities",
        "Report Sarah's performance to the manager immediately",
        "Suggest removing Sarah from the project"
      ],
      answer_index: 1,
      answer: "Offer to help Sarah with her tasks while maintaining your own responsibilities",
      explanation: "Supporting team members while maintaining your own responsibilities demonstrates good teamwork and collaborative problem-solving.",
      difficulty: "medium"
    },
    {
      id: "SJT-SAMPLE-002",
      domain: "communication",
      scenario: "During a meeting, you notice that one participant is consistently interrupting others and dominating the conversation.",
      choices: [
        "Interrupt them back to restore balance",
        "Wait for the meeting leader to address it",
        "Politely suggest that everyone should have a chance to speak",
        "Send them a private message about their behavior"
      ],
      answer_index: 2,
      answer: "Politely suggest that everyone should have a chance to speak",
      explanation: "Diplomatically ensuring inclusive participation maintains meeting effectiveness while addressing the issue constructively.",
      difficulty: "easy"
    },
    {
      id: "SJT-SAMPLE-003",
      domain: "ethics",
      scenario: "You discover that a colleague has been claiming credit for work that was actually done by someone else in your team.",
      choices: [
        "Confront the colleague directly and publicly",
        "Document the situation and discuss it with your manager",
        "Tell other team members about the situation",
        "Ignore it since it doesn't directly affect you"
      ],
      answer_index: 1,
      answer: "Document the situation and discuss it with your manager",
      explanation: "Professional documentation and appropriate escalation ensures ethical issues are addressed through proper channels.",
      difficulty: "medium"
    },
    {
      id: "SJT-SAMPLE-004",
      domain: "leadership",
      scenario: "You're leading a project where team members have different opinions about the best approach. The discussion is getting heated and time is running short.",
      choices: [
        "Make a quick decision yourself to save time",
        "Let the team continue debating until consensus",
        "Facilitate a structured discussion to reach a decision",
        "Postpone the decision to a later meeting"
      ],
      answer_index: 2,
      answer: "Facilitate a structured discussion to reach a decision",
      explanation: "Effective leadership involves guiding teams through structured decision-making processes while respecting different viewpoints.",
      difficulty: "medium"
    },
    {
      id: "SJT-SAMPLE-005",
      domain: "safety",
      scenario: "You notice a colleague not following safety protocols in a potentially dangerous situation. They seem to be in a hurry to complete their work.",
      choices: [
        "Report them to management immediately",
        "Speak to them directly about following safety procedures",
        "Ignore it since it's not your responsibility",
        "Complete their work for them to avoid the safety issue"
      ],
      answer_index: 1,
      answer: "Speak to them directly about following safety procedures",
      explanation: "Direct communication about safety shows immediate concern for everyone's wellbeing while giving the person a chance to correct their behavior.",
      difficulty: "easy"
    }
  ];
};

const MasterSJTTest = ({ onClose }) => {
  const [phase, setPhase] = useState('intro'); // 'intro', 'test', 'results'
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(35 * 60); // 35 minutes
  const [testStarted, setTestStarted] = useState(false);
  const [results, setResults] = useState(null);

  // Load questions when component mounts
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        // Try to load from JSONL file
        const response = await fetch('/data/masterSJTPool.jsonl');
        const text = await response.text();
        const lines = text.trim().split('\n').filter(line => line.trim());
        const allQuestions = lines.map(line => JSON.parse(line));
        
        // Select 10 random questions from the pool for a shorter test
        const selectedQuestions = shuffleArray(allQuestions).slice(0, 10);
        
        // Shuffle answer choices for each question
        const questionsWithShuffledChoices = selectedQuestions.map(q => {
          const originalChoices = [...q.choices];
          const shuffledChoices = shuffleArray(q.choices);
          const newCorrectIndex = shuffledChoices.indexOf(originalChoices[q.answer_index]);
          
          return {
            ...q,
            choices: shuffledChoices,
            answer_index: newCorrectIndex
          };
        });
        
        setQuestions(questionsWithShuffledChoices);
      } catch (error) {
        console.error('Error loading questions:', error);
        // Fallback to sample questions
        setQuestions(getSampleQuestions());
      }
    };
    
    loadQuestions();
  }, []);

  // Timer effect
  useEffect(() => {
    if (testStarted && phase === 'test' && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setPhase('results');
            calculateResults();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [testStarted, phase, timeRemaining]);

  const startTest = () => {
    setPhase('test');
    setTestStarted(true);
  };

  const handleAnswer = (questionId, choiceIndex) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: choiceIndex
    }));
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const finishTest = () => {
    setPhase('results');
    calculateResults();
  };

  const calculateResults = () => {
    let correct = 0;
    const domainScores = {};
    
    questions.forEach(question => {
      if (!domainScores[question.domain]) {
        domainScores[question.domain] = { correct: 0, total: 0 };
      }
      domainScores[question.domain].total++;
      
      if (answers[question.id] === question.answer_index) {
        correct++;
        domainScores[question.domain].correct++;
      }
    });

    const totalScore = Math.round((correct / questions.length) * 100);
    
    setResults({
      totalScore,
      correct,
      total: questions.length,
      domainScores
    });
  };

  const currentQuestion = questions[currentQuestionIndex];
  const answeredCount = Object.keys(answers).length;
  const progress = questions.length > 0 ? (answeredCount / questions.length) * 100 : 0;

  if (phase === 'intro') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center justify-center w-20 h-20 bg-indigo-100 rounded-full mb-6"
            >
              <DocumentTextIcon className="w-10 h-10 text-indigo-600" />
            </motion.div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Master Situational Judgment Test</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive assessment of workplace judgment and decision-making skills
            </p>
          </div>

          {/* Test Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-xl p-8 mb-8"
          >
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div className="text-center">
                <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4">
                  <DocumentTextIcon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{questions.length} Questions</h3>
                <p className="text-gray-600">Workplace scenarios</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mx-auto mb-4">
                  <ClockIcon className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">35 Minutes</h3>
                <p className="text-gray-600">Time limit</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mx-auto mb-4">
                  <UserGroupIcon className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">8 Domains</h3>
                <p className="text-gray-600">Professional competencies</p>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-gray-50 rounded-xl p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Instructions</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                  Read each scenario carefully and choose the most appropriate response
                </li>
                <li className="flex items-start">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                  You can navigate between questions and change answers before submitting
                </li>
                <li className="flex items-start">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                  The test covers teamwork, leadership, communication, ethics, and more
                </li>
                <li className="flex items-start">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                  Focus on professional best practices and ethical decision-making
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center space-x-4">
              <button
                onClick={onClose}
                className="px-6 py-3 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={startTest}
                className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
              >
                <PlayIcon className="w-5 h-5 mr-2" />
                Start Test
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (phase === 'test' && currentQuestion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-bold text-gray-900">Master SJT</h1>
                <div className="flex items-center text-gray-600">
                  <ClockIcon className="w-5 h-5 mr-2" />
                  <span className="font-mono text-lg">{formatTime(timeRemaining)}</span>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                Question {currentQuestionIndex + 1} of {questions.length}
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div 
                className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="text-sm text-gray-600">
              Answered: {answeredCount} / {questions.length}
            </div>
          </div>

          {/* Question */}
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl shadow-lg p-8"
          >
            {/* Domain Badge */}
            <div className="flex items-center mb-6">
              {React.createElement(DOMAIN_ICONS[currentQuestion.domain] || DocumentTextIcon, {
                className: `w-6 h-6 text-white mr-3`
              })}
              <span className={`px-3 py-1 rounded-full text-white text-sm font-medium ${DOMAIN_COLORS[currentQuestion.domain] || 'bg-gray-500'}`}>
                {currentQuestion.domain.replace('_', ' ').toUpperCase()}
              </span>
            </div>

            {/* Scenario */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Scenario:</h3>
              <p className="text-gray-700 leading-relaxed text-lg">
                {currentQuestion.scenario}
              </p>
            </div>

            {/* Choices */}
            <div className="space-y-4 mb-8">
              <h3 className="text-lg font-semibold text-gray-900">Choose the most appropriate response:</h3>
              {currentQuestion.choices.map((choice, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    answers[currentQuestion.id] === index
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                  onClick={() => handleAnswer(currentQuestion.id, index)}
                >
                  <div className="flex items-start">
                    <div className={`w-6 h-6 rounded-full border-2 flex-shrink-0 mr-4 mt-0.5 flex items-center justify-center ${
                      answers[currentQuestion.id] === index
                        ? 'border-indigo-500 bg-indigo-500'
                        : 'border-gray-300'
                    }`}>
                      {answers[currentQuestion.id] === index && (
                        <CheckCircleIcon className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <span className="text-gray-900">{choice}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center">
              <button
                onClick={previousQuestion}
                disabled={currentQuestionIndex === 0}
                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                  currentQuestionIndex === 0
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <ArrowLeftIcon className="w-4 h-4 mr-2" />
                Previous
              </button>

              <div className="flex space-x-3">
                {currentQuestionIndex === questions.length - 1 ? (
                  <button
                    onClick={finishTest}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Finish Test
                  </button>
                ) : (
                  <button
                    onClick={nextQuestion}
                    className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Next
                    <ArrowRightIcon className="w-4 h-4 ml-2" />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (phase === 'results' && results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
              <CheckCircleIcon className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Test Complete!</h1>
            <p className="text-xl text-gray-600">
              Your Master SJT assessment results
            </p>
          </motion.div>

          {/* Overall Score */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-xl p-8 mb-8 text-center"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Overall Score</h2>
            <div className="text-6xl font-bold text-indigo-600 mb-2">{results.totalScore}%</div>
            <p className="text-gray-600">
              {results.correct} out of {results.total} questions correct
            </p>
          </motion.div>

          {/* Domain Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl shadow-xl p-8 mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Domain Performance</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {Object.entries(results.domainScores).map(([domain, score]) => {
                const percentage = score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0;
                const IconComponent = DOMAIN_ICONS[domain] || DocumentTextIcon;
                
                return (
                  <div key={domain} className="flex items-center space-x-4">
                    <div className={`p-3 rounded-full ${DOMAIN_COLORS[domain] || 'bg-gray-500'}`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium text-gray-900 capitalize">
                          {domain.replace('_', ' ')}
                        </span>
                        <span className="text-sm text-gray-600">
                          {score.correct}/{score.total}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${DOMAIN_COLORS[domain] || 'bg-gray-500'}`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600">{percentage}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-center"
          >
            <button
              onClick={onClose}
              className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-lg font-medium"
            >
              Return to Dashboard
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading test questions...</p>
      </div>
    </div>
  );
};

export default MasterSJTTest;
