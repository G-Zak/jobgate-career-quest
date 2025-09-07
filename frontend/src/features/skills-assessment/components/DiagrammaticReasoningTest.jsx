import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaClock, FaSitemap, FaStop, FaArrowRight, FaFlag, FaRoute, FaSearchPlus, FaProjectDiagram, FaEye, FaImage, FaLayerGroup } from 'react-icons/fa';
import { getDiagrammaticTestSections, getDiagrammaticSection1, getDiagrammaticSection2 } from '../data/diagrammaticTestSections';
import { useScrollToTop, useTestScrollToTop, useQuestionScrollToTop, scrollToTop } from '../../../shared/utils/scrollUtils';

const DiagrammaticReasoningTest = ({ onBackToDashboard, testId = null }) => {
  // Determine starting section based on testId
  const getStartingSection = (testId) => {
    if (typeof testId === 'string') {
      if (testId === 'DRT1') return 1;
      if (testId === 'DRT2') return 2;
      // Extract section number from testId if it follows DRT pattern
      const match = testId.match(/DRT(\d+)/);
      if (match) {
        const sectionNum = parseInt(match[1]);
        return sectionNum <= 2 ? sectionNum : 1; // Default to section 1 if invalid
      }
    }
    return 1; // Default to section 1
  };

  const startingSection = getStartingSection(testId);
  
  const [testStep, setTestStep] = useState('instructions'); // instructions, section_intro, test, results
  const [currentSection, setCurrentSection] = useState(startingSection);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [timeRemaining, setTimeRemaining] = useState(45 * 60); // Will be updated based on section
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

  // Load diagrammatic reasoning test data
  useEffect(() => {
    const loadDiagrammaticTestData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Use section-specific test data based on testId
        let data;
        if (testId === 'DRT1') {
          data = getDiagrammaticSection1();
          console.log('Loading Section 1 only');
        } else if (testId === 'DRT2') {
          data = getDiagrammaticSection2();
          console.log('Loading Section 2 only');
        } else {
          // Default to full multi-section test
          data = getDiagrammaticTestSections();
          console.log('Loading full multi-section test');
        }
        
        setTestData(data);
        
        // Set timer based on the starting section
        if (data.sections && data.sections[startingSection - 1]) {
          const sectionDuration = data.sections[startingSection - 1].duration_minutes * 60;
          setTimeRemaining(sectionDuration);
          console.log(`Starting Section ${startingSection} with ${data.sections[startingSection - 1].duration_minutes} minutes`);
        } else {
          setTimeRemaining(data.duration_minutes * 60);
        }
        
        console.log('Diagrammatic test data loaded:', data);
        console.log('Starting testId:', testId, 'Starting section:', startingSection);
        
      } catch (error) {
        console.error('Error loading diagrammatic test data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadDiagrammaticTestData();
  }, [startingSection, testId]);

  // Timer effect
  useEffect(() => {
    if (testStep === 'test' && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleFinishTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [testStep, timeRemaining]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Get current section data
  const getCurrentSection = () => {
    return testData?.sections?.find(section => section.id === currentSection);
  };

  // Get current question data
  const getCurrentQuestion = () => {
    const section = getCurrentSection();
    return section?.questions?.find(q => q.order === currentQuestion);
  };

  // Get total questions across all sections
  const getTotalQuestions = () => {
    return testData?.sections?.reduce((total, section) => total + section.total_questions, 0) || 0;
  };

  // Get global question number (across all sections)
  const getGlobalQuestionNumber = () => {
    if (!testData?.sections) return currentQuestion;
    
    let globalNum = 0;
    for (let i = 0; i < testData.sections.length; i++) {
      const section = testData.sections[i];
      if (section.id === currentSection) {
        return globalNum + currentQuestion;
      }
      globalNum += section.total_questions;
    }
    return globalNum + currentQuestion;
  };

  const handleAnswerSelect = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [`${currentSection}_${questionId}`]: answer
    }));
  };

  const handleNextQuestion = () => {
    const section = getCurrentSection();
    if (currentQuestion < section.total_questions) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      // Move to next section or finish test
      const nextSection = testData.sections.find(s => s.id === currentSection + 1);
      if (nextSection) {
        setCurrentSection(currentSection + 1);
        setCurrentQuestion(1);
        setTestStep('section_intro'); // Show section intro
      } else {
        handleFinishTest();
      }
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 1) {
      setCurrentQuestion(prev => prev - 1);
    } else {
      // Move to previous section
      const prevSection = testData.sections.find(s => s.id === currentSection - 1);
      if (prevSection) {
        setCurrentSection(currentSection - 1);
        setCurrentQuestion(prevSection.total_questions);
      }
    }
  };

  const handleStartSection = () => {
    setTestStep('test');
    setCurrentQuestion(1);
    
    // Use scroll utility for immediate scroll on test start
    setTimeout(() => {
      scrollToTop({
        container: testContainerRef,
        forceImmediate: true,
        attempts: 3,
        delay: 50
      });
    }, 100);
  };

  const handleFinishTest = () => {
    setTestStep('results');
  };

  const handleAbortTest = () => {
    if (window.confirm("Are you sure you want to abort this test? Your progress will be lost.")) {
      onBackToDashboard();
    }
  };

  const getQuestionTypeIcon = (type) => {
    switch (type) {
      case 'logical_sequences':
        return <FaRoute className="text-blue-600" />;
      case 'flow_diagrams':
        return <FaSitemap className="text-green-600" />;
      case 'network_analysis':
        return <FaProjectDiagram className="text-purple-600" />;
      case 'process_diagrams':
        return <FaSearchPlus className="text-orange-600" />;
      default:
        return <FaSitemap className="text-gray-600" />;
    }
  };

  const getQuestionTypeLabel = (type) => {
    const labels = {
      logical_sequences: "Logical Sequences",
      flow_diagrams: "Flow Diagrams", 
      network_analysis: "Network Analysis",
      process_diagrams: "Process Diagrams"
    };
    return labels[type] || type;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaSitemap className="text-6xl text-blue-600 animate-pulse mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Loading Diagrammatic Reasoning Test...</h2>
          <p className="text-gray-600">Preparing diagrams and flowcharts</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Test Loading Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={onBackToDashboard}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full">
      {/* Test Instructions */}
      {testStep === 'instructions' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center p-6"
        >
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-4xl w-full border border-gray-200">
            <div className="text-center mb-8">
              <div className="bg-gradient-to-br from-green-500 to-blue-600 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <FaSitemap className="text-3xl text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-3">
                {startingSection > 1 ? `${testData.title} - Section ${startingSection}` : testData.title}
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                {startingSection > 1 
                  ? `Starting directly with Section ${startingSection}: ${getCurrentSection()?.title || testData.description}`
                  : testData.description}
              </p>
              <div className="mt-4 inline-flex items-center gap-2 bg-green-50 px-4 py-2 rounded-full border border-green-200">
                <FaLayerGroup className="text-green-600" />
                <span className="text-green-700 font-medium">
                  {startingSection > 1 ? `Section ${startingSection} Assessment` : 'Professional Diagrammatic Intelligence Assessment'}
                </span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="bg-green-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-green-800">
                  <FaImage className="text-green-600" />
                  Test Instructions
                </h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-3">
                    <span className="text-green-600 font-bold">•</span>
                    <span>You will be presented with <strong>diagrammatic reasoning questions</strong> containing flowcharts and logical sequences</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-600 font-bold">•</span>
                    <span>Study each diagram carefully and <strong>trace through the logical flow</strong> before selecting your answer</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-600 font-bold">•</span>
                    <span>Choose from the <strong>five option letters (A, B, C, D, E)</strong> provided below each question</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-600 font-bold">•</span>
                    <span>Navigate between questions using the <strong>Next/Previous buttons</strong> - you can review your answers</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-600 font-bold">•</span>
                    <span>Take your time to <strong>follow logical pathways</strong> and analyze pattern relationships</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-600 font-bold">•</span>
                    <span>Click <strong>"Finish Test"</strong> when you have completed all questions and are ready to submit</span>
                  </li>
                </ul>
              </div>
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Test Details</h3>
                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-bold text-lg text-green-600">
                        {startingSection > 1 ? getCurrentSection()?.duration_minutes : testData.duration_minutes} minutes
                      </span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">
                        {startingSection > 1 ? 'Section Questions:' : 'Total Questions:'}
                      </span>
                      <span className="font-bold text-lg text-blue-600">
                        {startingSection > 1 ? getCurrentSection()?.total_questions : getTotalQuestions()}
                      </span>
                    </div>
                    {startingSection === 1 && (
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-600">Sections:</span>
                        <span className="font-bold text-lg text-purple-600">{testData.sections?.length || 0}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Assessment Type:</span>
                      <span className="font-medium text-gray-800">
                        {startingSection > 1 
                          ? getCurrentSection()?.question_type?.replace('_', ' ')?.replace(/\b\w/g, l => l.toUpperCase()) 
                          : 'Multi-Section Diagrammatic'}
                      </span>
                    </div>
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <FaClock className="text-yellow-600" />
                      <span className="font-semibold text-yellow-800">Time Management Tip</span>
                    </div>
                    <p className="text-yellow-700 text-sm">Aim for approximately 1.5 minutes per question to ensure you complete the assessment within the time limit.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4 justify-center pt-6 border-t border-gray-200">
              <button
                onClick={onBackToDashboard}
                className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all flex items-center gap-2 font-medium"
              >
                Back to Dashboard
              </button>
              <button
                onClick={() => setTestStep('section_intro')}
                className="px-8 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:from-green-700 hover:to-blue-700 transition-all flex items-center gap-2 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Begin Section {currentSection} <FaArrowRight />
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Section Introduction */}
      {testStep === 'section_intro' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center p-6"
        >
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-5xl w-full">
            <div className="text-center mb-8">
              <FaLayerGroup className="text-6xl text-green-600 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {getCurrentSection()?.title}
              </h1>
              <p className="text-gray-600">{getCurrentSection()?.description}</p>
            </div>

            {/* Section Instructions - Enhanced for Section 2 */}
            <div className="mb-8">
              {getCurrentSection()?.question_type === 'flow_diagrams' ? (
                /* Enhanced Section 2 Flow Diagrams Instructions */
                <div className="space-y-6">
                  {/* Educational Introduction */}
                  <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-6 border border-green-200">
                    <h2 className="text-2xl font-bold text-green-800 mb-4 flex items-center gap-2">
                      <FaEye className="text-green-600" />
                      Understanding Flow Diagrams
                    </h2>
                    <p className="text-gray-700 text-lg leading-relaxed mb-4">
                      In this section, you'll work with flowcharts and process diagrams. You need to trace through the logical flow from start to finish and determine the correct outcome.
                    </p>
                    <div className="bg-green-100 border-l-4 border-green-500 p-4 rounded">
                      <p className="text-green-800 font-medium">
                        💡 <strong>Key Concept:</strong> Follow the arrows and decision points step by step. Apply the rules and operations shown in each box to determine the final result.
                      </p>
                    </div>
                  </div>

                  {/* Example with Image */}
                  <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Example Flow Diagram:</h3>
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <img 
                        src={getCurrentSection()?.intro_image} 
                        alt="Flow diagram example"
                        className="max-w-full max-h-[400px] object-contain mx-auto rounded-lg shadow-md"
                      />
                    </div>
                    
                    {/* Detailed Example Explanation */}
                    <div className="space-y-4">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h4 className="font-semibold text-blue-800 mb-2">EXAMPLE:</h4>
                        <p className="text-gray-700 mb-3">
                          Starting with an input value, trace through the flowchart following the arrows and decision points. Apply the operations in each box to reach the final output.
                        </p>
                        <div className="grid grid-cols-5 gap-2 mb-3">
                          <div className="text-center p-2 bg-white rounded border">
                            <span className="font-bold text-lg">A</span>
                          </div>
                          <div className="text-center p-2 bg-white rounded border">
                            <span className="font-bold text-lg">B</span>
                          </div>
                          <div className="text-center p-2 bg-blue-200 rounded border border-blue-400">
                            <span className="font-bold text-lg text-blue-800">C ✓</span>
                          </div>
                          <div className="text-center p-2 bg-white rounded border">
                            <span className="font-bold text-lg">D</span>
                          </div>
                          <div className="text-center p-2 bg-white rounded border">
                            <span className="font-bold text-lg">E</span>
                          </div>
                        </div>
                        <p className="text-blue-700 font-medium">
                          <strong>The correct answer is C</strong> because it shows the result after correctly following all the logical steps in the flowchart.
                        </p>
                      </div>
                      
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                        <h4 className="font-semibold text-amber-800 mb-2">INSTRUCTIONS:</h4>
                        <ul className="space-y-2 text-gray-700">
                          <li className="flex items-start gap-2">
                            <span className="text-amber-600 font-bold">1.</span>
                            <span>Start at the input or beginning of the flowchart</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-amber-600 font-bold">2.</span>
                            <span>Follow the arrows and decision points (Yes/No branches)</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-amber-600 font-bold">3.</span>
                            <span>Apply the operations or transformations shown in each box</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-amber-600 font-bold">4.</span>
                            <span>Continue until you reach the final output or conclusion</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Standard Section 1 Instructions */
                <div className="bg-gray-50 rounded-lg p-6 flex items-center justify-center">
                  <img 
                    src={getCurrentSection()?.intro_image} 
                    alt="Section instructions"
                    className="max-w-full max-h-[500px] object-contain rounded-lg shadow-md"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      const fallback = e.target.parentNode.querySelector('.fallback-instructions');
                      if (fallback) fallback.style.display = 'block';
                    }}
                  />
                  <div className="fallback-instructions hidden text-center p-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">
                      {getCurrentSection()?.intro_text?.title}
                    </h2>
                    <div className="space-y-4 text-gray-700 max-w-2xl">
                      {getCurrentSection()?.intro_text?.instructions?.map((instruction, index) => (
                        <p key={index} className="text-left">{instruction}</p>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Section Details */}
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-lg p-6 border border-blue-200">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-blue-800">
                  <FaLayerGroup className="text-blue-600" />
                  {getCurrentSection()?.question_type === 'flow_diagrams' ? 'Flow Diagram Strategy' : 'Section Overview'}
                </h3>
                
                {getCurrentSection()?.question_type === 'flow_diagrams' ? (
                  /* Flow Diagram Strategy */
                  <div>
                    <ul className="space-y-3 text-gray-700">
                      <li className="flex items-start gap-3">
                        <span className="text-green-600 font-bold text-lg">1.</span>
                        <span><strong>Identify the starting point</strong> - locate the input or beginning of the flow</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-green-600 font-bold text-lg">2.</span>
                        <span><strong>Follow the arrows</strong> - trace the path through decision points and operations</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-green-600 font-bold text-lg">3.</span>
                        <span><strong>Apply transformations</strong> - perform the operations shown in each box</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-green-600 font-bold text-lg">4.</span>
                        <span><strong>Reach the conclusion</strong> - determine the final output or result</span>
                      </li>
                    </ul>
                    <div className="mt-4 p-3 bg-white rounded-lg border border-green-300">
                      <p className="text-sm text-green-700 font-medium">🧠 <strong>Tip:</strong> Draw the path mentally or with your finger to avoid getting lost in complex diagrams.</p>
                    </div>
                  </div>
                ) : (
                  /* Logical Sequences Strategy */
                  <div>
                    <ul className="space-y-3 text-gray-700">
                      <li className="flex items-start gap-3">
                        <span className="text-blue-600 font-bold text-lg">1.</span>
                        <span><strong>Examine the sequence</strong> - look at the progression from left to right</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-blue-600 font-bold text-lg">2.</span>
                        <span><strong>Identify the pattern</strong> - what changes between each step?</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-blue-600 font-bold text-lg">3.</span>
                        <span><strong>Predict the next step</strong> - apply the pattern to determine what comes next</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-blue-600 font-bold text-lg">4.</span>
                        <span><strong>Match with options</strong> - find which option continues the logical sequence</span>
                      </li>
                    </ul>
                    <div className="mt-4 p-3 bg-white rounded-lg border border-blue-300">
                      <p className="text-sm text-blue-700 font-medium">💡 <strong>Strategy:</strong> Look for patterns in shapes, positions, colors, or transformations.</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="bg-gradient-to-br from-green-50 to-purple-50 rounded-lg p-6 border border-green-200">
                <h3 className="text-lg font-semibold mb-4 text-green-800">Section Details</h3>
                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-4 border border-green-200">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{currentSection}</div>
                        <div className="text-xs text-gray-500 uppercase tracking-wide">of {testData.sections?.length}</div>
                        <div className="text-sm text-gray-600">Section</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">{getCurrentSection()?.total_questions}</div>
                        <div className="text-xs text-gray-500 uppercase tracking-wide">Total</div>
                        <div className="text-sm text-gray-600">Questions</div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-purple-200">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Question Type:</span>
                      <span className="font-semibold text-purple-700 capitalize">{getCurrentSection()?.question_type?.replace('_', ' ')}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-semibold text-purple-700">{getCurrentSection()?.duration_minutes} minutes</span>
                    </div>
                  </div>
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-orange-800">
                      <FaEye className="text-orange-600" />
                      <span className="font-semibold text-sm">Focus Areas</span>
                    </div>
                    <p className="text-orange-700 text-xs mt-1">
                      {getCurrentSection()?.question_type === 'flow_diagrams' 
                        ? 'Flow logic • Process analysis • Step-by-step reasoning • Decision trees'
                        : 'Pattern recognition • Logical sequences • Visual reasoning • Abstract thinking'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4 justify-center pt-6 border-t border-gray-200">
              <button
                onClick={() => setTestStep('instructions')}
                className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all flex items-center gap-2 font-medium"
              >
                Back to Overview
              </button>
              <button
                onClick={handleStartSection}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-lg hover:from-blue-700 hover:to-green-700 transition-all flex items-center gap-2 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Start {getCurrentSection()?.title} <FaArrowRight />
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Test Questions */}
      {testStep === 'test' && getCurrentQuestion() && (
        <div 
          ref={testContainerRef}
          className="test-scroll-container relative h-[calc(100vh-7rem)] overflow-y-auto overflow-x-hidden"
          data-scroll-container="diagrammatic-test"
          id="diagrammatic-test-scroll"
        >
          {/* Sticky Header within local scroll container */}
          <div className="bg-white shadow-sm border-b border-gray-200 p-4 sticky top-0 z-50">
            <div className="max-w-6xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <FaLayerGroup className="text-green-600" />
                  <span className="font-medium text-gray-800">
                    {getCurrentSection()?.title}
                  </span>
                </div>
                <span className="text-gray-500">
                  Question {currentQuestion} of {getCurrentSection()?.total_questions} 
                  (Global: {getGlobalQuestionNumber()} of {getTotalQuestions()})
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <FaClock />
                  <span className="font-mono">{formatTime(timeRemaining)}</span>
                </div>
                <button
                  onClick={handleAbortTest}
                  className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2"
                >
                  <FaStop /> Abort
                </button>
              </div>
            </div>
          </div>

          {/* Question Content */}
          <div className="flex-1 p-6">
            <div className="max-w-6xl mx-auto">
              <motion.div
                key={currentQuestion}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-xl shadow-lg p-8"
              >
                {/* Question Header */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    {getCurrentQuestion()?.question_text}
                  </h2>
                  {getCurrentQuestion()?.context && (
                    <p className="text-gray-600 bg-green-50 p-4 rounded-lg">
                      💡 {getCurrentQuestion()?.context}
                    </p>
                  )}
                </div>

                {/* Visual Content */}
                <div className="mb-8">
                  {/* Main Question Image */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-4">Study the following diagram:</h3>
                    <div className="bg-gray-50 rounded-lg p-6 flex items-center justify-center">
                      <img 
                        src={getCurrentQuestion()?.question_image} 
                        alt="Question diagram"
                        className="max-w-full max-h-96 object-contain rounded-lg shadow-md"
                        onError={(e) => {
                          e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDYwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI2MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMzAgMjAwQzIzMCAxODQuNTM2IDI0Mi41MzYgMTcyIDI1OCAxNzJIMzQyQzM1Ny40NjQgMTcyIDM3MCAyODQuNTM2IDM3MCAyMDBDMzcwIDIxNS40NjQgMzU3LjQ2NCAyMjggMzQyIDIyOEgyNThDMjQyLjUzNiAyMjggMjMwIDIxNS40NjQgMjMwIDIwMFoiIGZpbGw9IiM5Q0E4RjAiLz4KPHR9CJHD0YXQgCBjbGFzcz0ic21hbGwiIGZpbGw9IiM2Rjc1ODciIGZvbnQtZmFtaWx5PSJzeXN0ZW0tdWkiIGZvbnQtc2l6ZT0iMTYiIGZvbnQtd2VpZ2h0PSI1MDAiPgogIDx0c3BhbiB4PSIzMDAiIHk9IjIwOCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+RGlhZ3JhbSBJbWFnZTwvdHNwYW4+Cjwvc3ZnPgo=';
                        }}
                      />
                    </div>
                    <div className="mt-2 text-sm text-gray-500 text-center">
                      Complexity: {getCurrentQuestion()?.complexity_score}/5
                    </div>
                  </div>

                  {/* Answer Options */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Select your answer:</h3>
                    <div className="flex justify-center gap-4">
                      {['A', 'B', 'C', 'D', 'E'].map((letter) => {
                        const isSelected = answers[`${currentSection}_${getCurrentQuestion()?.id}`] === letter;
                        
                        return (
                          <button
                            key={letter}
                            className={`w-16 h-16 rounded-lg border-2 font-bold text-xl transition-all ${
                              isSelected 
                                ? 'border-green-500 bg-green-500 text-white' 
                                : 'border-gray-300 bg-white text-gray-700 hover:border-green-300 hover:bg-green-50'
                            }`}
                            onClick={() => handleAnswerSelect(getCurrentQuestion()?.id, letter)}
                          >
                            {letter}
                          </button>
                        );
                      })}
                    </div>
                    <p className="text-sm text-gray-500 text-center mt-4">
                      Click the letter that corresponds to the correct answer
                    </p>
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex justify-between items-center">
                  <button
                    onClick={handlePreviousQuestion}
                    disabled={currentQuestion === 1 && currentSection === 1}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  
                  <div className="text-sm text-gray-500">
                    {answers[`${currentSection}_${getCurrentQuestion()?.id}`] ? '✓ Answered' : 'Not answered'}
                  </div>

                  {(currentSection === testData.sections?.length && currentQuestion === getCurrentSection()?.total_questions) ? (
                    <button
                      onClick={handleFinishTest}
                      className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                    >
                      <FaFlag /> Finish Test
                    </button>
                  ) : (
                    <button
                      onClick={handleNextQuestion}
                      className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      {currentQuestion === getCurrentSection()?.total_questions ? 'Next Section' : 'Next'}
                    </button>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      )}

      {/* Test Results */}
      {testStep === 'results' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="min-h-screen flex items-center justify-center p-6"
        >
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl w-full text-center">
            <div className="text-green-500 text-6xl mb-4">✅</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Test Completed!</h1>
            <p className="text-gray-600 mb-6">
              You have successfully completed the Diagrammatic Reasoning Assessment.
            </p>
            
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">Your Results</h3>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-green-600">{Object.keys(answers).length}</div>
                  <div className="text-sm text-gray-600">Questions Answered</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">{getTotalQuestions()}</div>
                  <div className="text-sm text-gray-600">Total Questions</div>
                </div>
              </div>
            </div>

            <button
              onClick={onBackToDashboard}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Return to Dashboard
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default DiagrammaticReasoningTest;
