import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaClock, FaBook, FaStop, FaArrowRight, FaFlag, FaQuestionCircle, FaFileAlt } from 'react-icons/fa';
import { getVerbalTestSections, getVerbalSection1, getVerbalSection2, getVerbalSection3 } from '../data/verbalTestSections';
import { 
  getRandomizedVRT1, 
  getRandomizedVRT2, 
  getRandomizedVRT3,
  verbalReasoningCategories 
} from '../data/verbalReasoningCategories';
import { getRandomizedTestByLegacyId, testManager } from '../data/verbalReasoningTestManager';
import { useScrollToTop, useTestScrollToTop, useQuestionScrollToTop, scrollToTop } from '../../../shared/utils/scrollUtils';

const VerbalReasoningTest = ({ onBackToDashboard, testId = null, language = 'english' }) => {
  // Determine starting section based on testId
  const getStartingSection = (testId) => {
    if (typeof testId === 'string') {
      if (testId === 'VRT1') return 1;
      // Extract section number from testId if it follows VRT pattern
      const match = testId.match(/VRT(\d+)/);
      if (match) {
        const sectionNum = parseInt(match[1]);
        return sectionNum <= 1 ? sectionNum : 1; // Default to section 1 if invalid
      }
    }
    return 1; // Default to section 1
  };

  const startingSection = getStartingSection(testId);
  
  const [testStep, setTestStep] = useState('test'); // Skip instructions - start directly with test
  const [currentSection, setCurrentSection] = useState(startingSection);
  const [currentPassage, setCurrentPassage] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(20 * 60); // 20 minutes
  const [answers, setAnswers] = useState({});
  const [testData, setTestData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Ref for test scroll container
  const testContainerRef = useRef(null);

  // Universal scroll management using scroll utilities
  useScrollToTop([], { smooth: true }); // Scroll on component mount
  useTestScrollToTop(testStep, testContainerRef, { smooth: true, attempts: 5 }); // Scroll on test step changes
  useTestScrollToTop(currentSection, testContainerRef, { smooth: true, attempts: 3 }); // Scroll on section changes
  useQuestionScrollToTop(currentQuestion, testStep, testContainerRef); // Scroll on question changes

  // Load verbal reasoning test data
  useEffect(() => {
    const loadVerbalTestData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // VERBAL REASONING TEST CATEGORIZATION SYSTEM
        // ==========================================
        // Current Categories:
        // 1. Reading Comprehension (CONSOLIDATED)
        //    - VRT-COMP: Mixed difficulty passages (science, business, management)
        //    - Anti-cheating: Random selection from all 3 difficulty pools
        //    - Time limit: 25 minutes, 8 passages with mixed complexity
        //
        // 2. Verbal Analogies (VRT4)
        //    - Comprehensive: 30 mixed analogies across 9 types
        //    - Anti-cheating: Random selection from 72+ questions
        //    - Time limit: 25 minutes
        //    - Difficulty: 40% easy, 40% medium, 20% hard
        //
        // 3. Classification (VRT5)
        //    - Comprehensive: Odd-one-out across words, pairs, numerals, letters
        //    - Anti-cheating: Random selection from 90+ questions
        //    - Time limit: 25 minutes
        //    - Difficulty distribution: Easy, Medium, Hard
        //
        // 4. Coding & Decoding (VRT6)
        //    - Comprehensive: Letter coding, number coding, substitution patterns
        //    - Anti-cheating: Random selection from 100+ questions
        //    - Time limit: 30 minutes
        //    - Cultural neutrality: Works across diverse backgrounds
        //
        // 5. Blood Relations & Logical Puzzles (VRT7)
        //    - Comprehensive: Family relationships and logical reasoning puzzles
        //    - Anti-cheating: Random selection from 100+ questions (JSONL format)
        //    - Time limit: 35 minutes
        //    - Advanced reasoning: Master level difficulty
        //
        // Each category contains randomized question pools for anti-cheating
        // ==========================================
        
        // Use the new categorized test system with randomized content
        let data;
        
        // CONSOLIDATED READING COMPREHENSION TEST
        if (testId === 'VRT-COMP' || testId === 'VRT_COMP' || testId === 'VRTCOMP') {
          data = getRandomizedTestByLegacyId('VRT-COMP'); // Reading Comprehension - Consolidated (Mixed Difficulty)
        
        // LEGACY READING COMPREHENSION TESTS (deprecated but maintained for compatibility)
        } else if (testId === 'VRT1' || testId === '1' || testId === 1) {
          data = getRandomizedTestByLegacyId('VRT1'); // Reading Comprehension - Basic
        } else if (testId === 'VRT2' || testId === '2' || testId === 2) {
          data = getRandomizedTestByLegacyId('VRT2'); // Reading Comprehension - Intermediate
        } else if (testId === 'VRT3' || testId === '3' || testId === 3) {
          data = getRandomizedTestByLegacyId('VRT3'); // Reading Comprehension - Advanced
        
        // OTHER VERBAL REASONING TESTS
        } else if (testId === 'VRT4' || testId === '4' || testId === 4) {
          data = getRandomizedTestByLegacyId('VRT4'); // Verbal Analogies - Comprehensive
        } else if (testId === 'VRT5' || testId === '5' || testId === 5) {
          data = getRandomizedTestByLegacyId('VRT5'); // Classification - Odd-One-Out
        } else if (testId === 'VRT6' || testId === '6' || testId === 6) {
          data = getRandomizedTestByLegacyId('VRT6'); // Coding & Decoding - Comprehensive
        } else if (testId === 'VRT7' || testId === '7' || testId === 7) {
          data = getRandomizedTestByLegacyId('VRT7'); // Blood Relations & Logical Puzzles - Comprehensive
        } else {
          // Default to full multi-section test (fallback)
          data = getVerbalTestSections();
        }
        
        setTestData(data);
        
        // Set timer based on test duration
        if (data.timeLimit) {
          setTimeRemaining(data.timeLimit * 60);
        } else if (data.duration_minutes) {
          setTimeRemaining(data.duration_minutes * 60);
        } else if (data.sections && data.sections[startingSection - 1]?.duration_minutes) {
          setTimeRemaining(data.sections[startingSection - 1].duration_minutes * 60);
        }

        setLoading(false);
      } catch (err) {
        console.error('Error loading verbal test data:', err);
        setError('Failed to load test data. Please try again.');
        setLoading(false);
      }
    };

    loadVerbalTestData();
  }, [testId, startingSection]);

  // Timer countdown
  useEffect(() => {
    if (testStep === 'test' && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleSubmitTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [testStep, timeRemaining]);

  // Helper functions
  const getSectionPassages = (section) => {
    if (!section) return [];
    // Prefer explicit passages array
    if (Array.isArray(section.passages)) return section.passages;
    // If we have a questions array, detect whether it's an array of passages or flat questions
    if (Array.isArray(section.questions)) {
      const q = section.questions;
      if (q.length > 0 && q[0] && Array.isArray(q[0].questions)) {
        return q; // already passages
      }
      // flat questions array → wrap into a single virtual passage
      return [{ id: 'virtual', questions: q }];
    }
    return [];
  };

  const getCurrentSection = () => {
    // For single test data (VRT1, VRT2, VRT3), return the test data itself
    if (testData && testData.questions && !testData.sections) {
      return testData;
    }
    // For multi-section data, return specific section
    const section = testData?.sections?.[currentSection - 1];
    return section;
  };

  const getCurrentPassage = () => {
    const section = getCurrentSection();
    const passages = getSectionPassages(section);
    return passages[currentPassage];
  };

  const getCurrentQuestion = () => {
    const passage = getCurrentPassage();
    const question = passage?.questions?.[currentQuestion];
    return question;
  };

  const getTotalQuestions = () => {
    // For single test data (including flat question arrays)
    if (testData && Array.isArray(testData.questions) && !testData.sections) {
      if (testData.questions.length > 0 && testData.questions[0] && Array.isArray(testData.questions[0].questions)) {
        return testData.questions.reduce((total, passage) => total + (passage?.questions?.length || 0), 0);
      }
      // flat array
      return testData.questions.length;
    }
    // For multi-section data
    if (!testData?.sections) return 0;
    return testData.sections.reduce((total, section) => {
      const passages = getSectionPassages(section);
      return total + passages.reduce((sectionTotal, passage) => sectionTotal + (passage?.questions?.length || 0), 0);
    }, 0);
  };

  const getQuestionNumber = () => {
    // For single test data (including flat arrays)
    if (testData && Array.isArray(testData.questions) && !testData.sections) {
      let questionNum = 1;
      const section = getCurrentSection();
      const passages = getSectionPassages(section);
      // Add questions from previous passages (usually 1 virtual passage for flat arrays)
      for (let i = 0; i < currentPassage; i++) {
        questionNum += (passages[i]?.questions?.length || 0);
      }
      
      // Add current question index
      questionNum += currentQuestion;
      
      return questionNum;
    }
    
    // For multi-section data
    if (!testData?.sections) return 1;
    
    let questionNum = 1;
    const section = getCurrentSection();
    const passages = getSectionPassages(section);
    
    // Add questions from previous passages in current section
    for (let i = 0; i < currentPassage; i++) {
      questionNum += (passages[i]?.questions?.length || 0);
    }
    
    // Add current question index
    questionNum += currentQuestion;
    
    return questionNum;
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Navigation functions
  const handleAnswerSelect = (questionId, answer) => {
    const answerKey = `${currentSection}_${currentPassage}_${questionId}`;
    setAnswers(prev => ({
      ...prev,
      [answerKey]: answer
    }));
  };

  const handleNextQuestion = () => {
    const passage = getCurrentPassage();
    const isLastQuestionInPassage = currentQuestion >= ((passage?.questions?.length || 0) - 1);
    const section = getCurrentSection();
    const passages = getSectionPassages(section);
    const isLastPassage = currentPassage >= passages.length - 1;

    if (isLastQuestionInPassage && isLastPassage) {
      // End of test
      handleSubmitTest();
    } else if (isLastQuestionInPassage) {
      // Move to next passage, first question
      setCurrentPassage(prev => prev + 1);
      setCurrentQuestion(0);
    } else {
      // Move to next question in same passage
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    } else if (currentPassage > 0) {
      // Move to previous passage, last question
      setCurrentPassage(prev => prev - 1);
      const section = getCurrentSection();
      const passages = getSectionPassages(section);
      const prevPassage = passages[currentPassage - 1];
      setCurrentQuestion(((prevPassage?.questions?.length) || 1) - 1);
    }
  };

  const handleSubmitTest = () => {
    setTestStep('results');
    scrollToTop();
  };

  const calculateScore = () => {
    let correct = 0;
    let total = 0;

    // For single test data (VRT1, VRT2, VRT3)
    if (testData && testData.questions && !testData.sections) {
      testData.questions.forEach((passage, passageIndex) => {
        passage.questions.forEach((question) => {
          const answerKey = `${currentSection}_${passageIndex}_${question.id}`;
          const userAnswer = answers[answerKey];
          total++;
          if (userAnswer === question.correct_answer) {
            correct++;
          }
        });
      });
    } else if (testData?.sections) {
      // For multi-section data
      testData.sections.forEach((section, sectionIndex) => {
        const passages = getSectionPassages(section);
        passages.forEach((passage, passageIndex) => {
          passage.questions.forEach((question) => {
            const answerKey = `${sectionIndex + 1}_${passageIndex}_${question.id}`;
            const userAnswer = answers[answerKey];
            total++;
            if (userAnswer === question.correct_answer) {
              correct++;
            }
          });
        });
      });
    }

    return { correct, total, percentage: Math.round((correct / total) * 100) };
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaBook className="text-6xl text-blue-600 mb-4 mx-auto animate-pulse" />
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Loading Verbal Reasoning Test...</h2>
          <p className="text-gray-600">Please wait while we prepare your test.</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
          <FaStop className="text-6xl text-red-600 mb-4 mx-auto" />
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Test Loading Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={onBackToDashboard}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" ref={testContainerRef}>
      <AnimatePresence mode="wait">
        {testStep === 'instructions' && (
          <motion.div
            key="instructions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="container mx-auto px-4 py-8"
          >
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
              {/* Header */}
              <div className="text-center mb-8">
                <FaBook className="text-6xl text-blue-600 mb-4 mx-auto" />
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  {getCurrentSection()?.intro_text?.title || getCurrentSection()?.title || 'Verbal Reasoning Test'}
                </h1>
                <p className="text-lg text-gray-600">
                  {getCurrentSection()?.description}
                </p>
              </div>

              {/* Instructions */}
              <div className="bg-blue-50 rounded-lg p-6 mb-8">
                <div className="space-y-4">
                  {getCurrentSection()?.intro_text?.instructions?.map((instruction, index) => (
                    <p key={index} className={`text-gray-700 ${instruction === '' ? 'h-2' : ''}`}>
                      {instruction}
                    </p>
                  ))}
                </div>
              </div>

              {/* Test Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <FaClock className="text-2xl text-blue-600 mb-2 mx-auto" />
                  <h3 className="font-semibold text-gray-800">Duration</h3>
                  <p className="text-gray-600">{getCurrentSection()?.duration_minutes || testData?.timeLimit || 25} minutes</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <FaQuestionCircle className="text-2xl text-blue-600 mb-2 mx-auto" />
                  <h3 className="font-semibold text-gray-800">Questions</h3>
                  <p className="text-gray-600">{getTotalQuestions()} questions</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <FaFileAlt className="text-2xl text-blue-600 mb-2 mx-auto" />
                  <h3 className="font-semibold text-gray-800">Format</h3>
                  <p className="text-gray-600">True/False/Cannot Say</p>
                </div>
              </div>

              {/* Start Button */}
              <div className="text-center">
                <button
                  onClick={() => setTestStep('test')}
                  className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
                >
                  Start Test
                  <FaArrowRight />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {testStep === 'test' && (
          <motion.div
            key="test"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="container mx-auto px-4 py-8"
          >
            <div className="max-w-6xl mx-auto">
              {/* Header */}
              <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-800">Verbal Reasoning Test</h1>
                    <p className="text-gray-600">
                      Question {getQuestionNumber()} of {getTotalQuestions()}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">
                      <FaClock className="inline mr-2" />
                      {formatTime(timeRemaining)}
                    </div>
                    <p className="text-sm text-gray-600">Time Remaining</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Passage */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">
                    {getCurrentPassage()?.passage_title}
                  </h2>
                  <div className="prose max-w-none">
                    <p className="text-gray-700 leading-relaxed text-justify">
                      {getCurrentPassage()?.passage_text}
                    </p>
                  </div>
                </div>

                {/* Question */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Q{getCurrentQuestion()?.id}: {getCurrentQuestion()?.question_text}
                    </h3>
                    
                    {/* Answer Options */}
                    <div className="space-y-3">
                      {getCurrentQuestion()?.options?.map((option) => {
                        const isSelected = answers[`${currentSection}_${currentPassage}_${getCurrentQuestion()?.id}`] === option;
                        
                        return (
                          <button
                            key={option}
                            className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                              isSelected 
                                ? 'border-blue-500 bg-blue-50 text-blue-700' 
                                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                            }`}
                            onClick={() => handleAnswerSelect(getCurrentQuestion()?.id, option)}
                          >
                            <span className="font-semibold">{option}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Navigation */}
                  <div className="flex justify-between items-center">
                    <button
                      onClick={handlePrevQuestion}
                      disabled={currentPassage === 0 && currentQuestion === 0}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Previous
                    </button>

                    <button
                      onClick={handleNextQuestion}
                      className="flex items-center gap-2 px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                    >
                      {currentPassage === getCurrentSection()?.questions?.length - 1 && 
                       currentQuestion === getCurrentPassage()?.questions?.length - 1 ? (
                        <>
                          <FaFlag />
                          Submit Test
                        </>
                      ) : (
                        <>
                          Next
                          <FaArrowRight />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {testStep === 'results' && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="container mx-auto px-4 py-8"
          >
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
              <div className="text-center mb-8">
                <FaFlag className="text-6xl text-green-600 mb-4 mx-auto" />
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Test Complete!</h1>
                <p className="text-lg text-gray-600">
                  You have successfully completed the verbal reasoning test.
                </p>
              </div>

              {/* Results */}
              <div className="bg-gray-50 rounded-lg p-6 mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Your Results</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">{calculateScore().correct}</div>
                    <p className="text-gray-600">Correct Answers</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-600">{calculateScore().total}</div>
                    <p className="text-gray-600">Total Questions</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">{calculateScore().percentage}%</div>
                    <p className="text-gray-600">Score</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="text-center">
                <button
                  onClick={onBackToDashboard}
                  className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Back to Dashboard
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VerbalReasoningTest;
