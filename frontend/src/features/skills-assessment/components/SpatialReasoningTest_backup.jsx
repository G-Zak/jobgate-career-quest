import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaClock, FaCube, FaStop, FaArrowRight, FaFlag, FaSync, FaSearchPlus, FaExpand, FaEye } from 'react-icons/fa';
import SpatialImageRenderer from '../../../components/SpatialImageRenderer';

const SpatialReasoningTest = ({ onBackToDashboard, testId = null }) => {
  const [testStep, setTestStep] = useState('instructions'); // instructions, test, results
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [timeRemaining, setTimeRemaining] = useState(20 * 60); // 20 minutes in seconds
  const [answers, setAnswers] = useState({});
  const [testData, setTestData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch spatial reasoning test data from API
  useEffect(() => {
    const fetchSpatialTestData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch spatial reasoning test specifically
        const response = await fetch('http://localhost:8000/api/tests/spatial_reasoning/');
        
        if (response.ok) {
          const data = await response.json();
          setTestData(data);
          setTimeRemaining(data.duration_minutes * 60);
          console.log('Spatial test data loaded:', data);
        } else {
          throw new Error(`HTTP ${response.status}: Failed to fetch spatial reasoning test`);
        }
      } catch (error) {
        console.error('Error fetching spatial test data:', error);
        setError(error.message);
        // Fallback to mock data for development
        setTestData(getMockTestData());
      } finally {
        setLoading(false);
      }
    };

    fetchSpatialTestData();
  }, []);

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

  // Enhanced mock test data for development fallback
  const getMockTestData = () => ({
    id: 1,
    title: "Advanced Spatial Reasoning Assessment",
    description: "Comprehensive spatial intelligence evaluation with visual content",
    duration_minutes: 25,
    total_questions: 6,
    questions: [
      {
        id: 1,
        question_type: "mental_rotation",
        question_text: "Which option shows the same L-shaped object rotated 90° clockwise around the vertical axis?",
        context: "Look at the L-shaped block. The long arm points right, short arm points up.",
        options: [
          "Long arm points down, short arm points right",
          "Long arm points left, short arm points down", 
          "Long arm points up, short arm points left",
          "Same as original"
        ],
        correct_answer: "A",
        order: 1,
        base_image_id: "MR_L_block_01",
        overlay_ids: ["overlay_rotation_90cw"],
        transforms: {
          main: { rotation: 0 },
          options: {
            A: { rotation: 90 },
            B: { rotation: 180 },
            C: { rotation: 270 },
            D: { rotation: 0 }
          }
        },
        option_transforms: [
          { base_image_id: "MR_L_block_01", transforms: { rotation: 90 } },
          { base_image_id: "MR_L_block_01", transforms: { rotation: 180 } },
          { base_image_id: "MR_L_block_01", transforms: { rotation: 270 } },
          { base_image_id: "MR_L_block_01", transforms: { rotation: 0 } }
        ],
        visual_style: "technical_3d",
        complexity_score: 1
      },
      {
        id: 2,
        question_type: "mental_rotation",
        question_text: "Which option shows this T-shaped object after a 90° clockwise rotation?",
        context: "The T-shape has a horizontal top bar and vertical stem pointing down.",
        options: [
          "Vertical bar on left, stem pointing right",
          "Horizontal bottom bar, stem pointing up",
          "Vertical bar on right, stem pointing left", 
          "Same as original"
        ],
        correct_answer: "A",
        order: 2,
        base_image_id: "MR_T_block_01",
        overlay_ids: ["overlay_rotation_90cw"],
        transforms: {
          main: { rotation: 0 },
          options: {
            A: { rotation: 90 },
            B: { rotation: 180 },
            C: { rotation: 270 },
            D: { rotation: 0 }
          }
        },
        option_transforms: [
          { base_image_id: "MR_T_block_01", transforms: { rotation: 90 } },
          { base_image_id: "MR_T_block_01", transforms: { rotation: 180 } },
          { base_image_id: "MR_T_block_01", transforms: { rotation: 270 } },
          { base_image_id: "MR_T_block_01", transforms: { rotation: 0 } }
        ],
        visual_style: "technical_3d",
        complexity_score: 1
      },
      {
        id: 3,
        question_type: "mental_rotation",
        question_text: "If you rotate this L-shaped object 180° around the vertical axis, which orientation results?",
        context: "Consider the complete 180-degree rotation of the L-block.",
        options: [
          "Long arm points left, short arm points down",
          "Long arm points down, short arm points right",
          "Long arm points up, short arm points left",
          "Long arm points right, short arm points up"
        ],
        correct_answer: "A",
        order: 3,
        base_image_id: "MR_L_block_01",
        overlay_ids: ["overlay_rotation_180"],
        option_transforms: [
          { base_image_id: "MR_L_block_01", transforms: { rotation: 180 } },
          { base_image_id: "MR_L_block_01", transforms: { rotation: 90 } },
          { base_image_id: "MR_L_block_01", transforms: { rotation: 270 } },
          { base_image_id: "MR_L_block_01", transforms: { rotation: 0 } }
        ],
        visual_style: "technical_3d",
        complexity_score: 2
      },
      {
        id: 4,
        question_type: "mental_rotation",
        question_text: "After rotating this T-shaped object 180°, what orientation do you see?",
        context: "Think about flipping the T upside down.",
        options: [
          "Horizontal bottom bar, stem pointing up",
          "Vertical bar on left, stem pointing right",
          "Vertical bar on right, stem pointing left",
          "Same as original"
        ],
        correct_answer: "A",
        order: 4,
        base_image_id: "MR_T_block_01",
        overlay_ids: ["overlay_rotation_180"],
        option_transforms: [
          { base_image_id: "MR_T_block_01", transforms: { rotation: 180 } },
          { base_image_id: "MR_T_block_01", transforms: { rotation: 90 } },
          { base_image_id: "MR_T_block_01", transforms: { rotation: 270 } },
          { base_image_id: "MR_T_block_01", transforms: { rotation: 0 } }
        ],
        visual_style: "technical_3d",
        complexity_score: 2
      },
      {
        id: 5,
        question_type: "mental_rotation",
        question_text: "Looking at this L-shaped object, which option shows it rotated 90° counter-clockwise?",
        context: "Counter-clockwise rotation is opposite to clockwise.",
        options: [
          "Long arm points up, short arm points left",
          "Long arm points down, short arm points right",
          "Long arm points left, short arm points down",
          "Long arm points right, short arm points up"
        ],
        correct_answer: "A",
        order: 5,
        base_image_id: "MR_L_block_01",
        overlay_ids: ["overlay_rotation_90ccw"],
        option_transforms: [
          { base_image_id: "MR_L_block_01", transforms: { rotation: 270 } },
          { base_image_id: "MR_L_block_01", transforms: { rotation: 90 } },
          { base_image_id: "MR_L_block_01", transforms: { rotation: 180 } },
          { base_image_id: "MR_L_block_01", transforms: { rotation: 0 } }
        ],
        visual_style: "technical_3d",
        complexity_score: 2
      },
      {
        id: 6,
        question_type: "mental_rotation",
        context: "Paper folding questions test your ability to visualize the effects of folding and punching on a flat sheet.",
        options: [
          "Pattern A: Symmetric arrangement",
          "Pattern B: Asymmetric holes",
          "Pattern C: Single hole",
          "Pattern D: Random pattern"
        ],
        order: 2,
        base_image_id: "MR_T_block_01",
        overlay_ids: ["fold_lines_dashed", "punch_indicators"],
        sequence_images: [
          "/assets/spatial/base/paper_folding/pf_002_step1.svg",
          "/assets/spatial/base/paper_folding/pf_002_step2.svg",
          "/assets/spatial/base/paper_folding/pf_002_result.svg"
        ],
        visual_style: "diagram",
        complexity_score: 2
      },
      {
        id: 3,
        question_type: "cross_sections",
        question_text: "If this cylinder is cut by the indicated plane, what would the cross-section look like?",
        context: "Cross-section questions test your ability to visualize the 2D shapes created when 3D objects are cut by planes.",
        options: [
          "Cross-section A: Correct shape",
          "Cross-section B: Incorrect proportions",
          "Cross-section C: Wrong orientation",
          "Cross-section D: Different shape"
        ],
        order: 3,
        base_image_id: "MR_Z_block_01",
        overlay_ids: ["cutting_plane_transparent", "section_highlight"],
        transforms: {
          cutting_plane: { opacity: 0.3, color: '#ff6b6b' }
        },
        visual_style: "technical_3d",
        complexity_score: 2
      }
    ]
  });

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestion < testData.total_questions) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 1) {
      setCurrentQuestion(prev => prev - 1);
    }
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
      case 'mental_rotation':
        return <FaSync className="text-blue-600" />;
      case 'paper_folding':
        return <FaExpand className="text-green-600" />;
      case 'cross_sections':
        return <FaSearchPlus className="text-purple-600" />;
      case 'spatial_transformation':
        return <FaCube className="text-orange-600" />;
      case 'perspective_changes':
        return <FaExpand className="text-teal-600" />;
      default:
        return <FaCube className="text-gray-600" />;
    }
  };

  const getQuestionTypeLabel = (type) => {
    const labels = {
      mental_rotation: "Mental Rotation",
      paper_folding: "Paper Folding", 
      cross_sections: "Cross-sections",
      spatial_transformation: "Spatial Transformation",
      perspective_changes: "Perspective Changes"
    };
    return labels[type] || type;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading spatial reasoning test...</p>
        </div>
      </div>
    );
  }

  if (!testData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Test Not Available</h2>
          <p className="text-gray-600 mb-4">Unable to load the spatial reasoning test data. Please try again.</p>
          <button
            onClick={onBackToDashboard}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={onBackToDashboard}
            className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </button>
          <h1 className="text-xl font-semibold text-gray-800">{testData.title}</h1>
          {testStep === 'test' && (
            <div className="flex items-center space-x-6">
              <div className="flex items-center text-blue-600">
                <FaClock className="mr-2" />
                <span className="font-mono text-lg">{formatTime(timeRemaining)}</span>
              </div>
              <span className="text-gray-500">
                Question {currentQuestion} of {testData.total_questions}
              </span>
              <button
                onClick={handleAbortTest}
                className="flex items-center px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors font-medium"
                title="Abort Test"
              >
                <FaStop className="mr-2" />
                Abort Test
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Instructions Step */}
      {testStep === 'instructions' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto px-6 py-12"
        >
          <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Spatial Reasoning Assessment Instructions</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-3">Test Overview</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• <strong>Duration:</strong> {testData.duration_minutes} minutes</li>
                  <li>• <strong>Questions:</strong> {testData.total_questions} questions</li>
                  <li>• <strong>Question Types:</strong> Mental Rotation, Paper Folding, Cross-sections, Spatial Transformation, Perspective Changes</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-3">Instructions</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Visualize 3D objects and their transformations carefully</li>
                  <li>• Take your time to mentally rotate or manipulate objects</li>
                  <li>• Use spatial reasoning rather than guessing</li>
                  <li>• You can navigate between questions using Previous/Next buttons</li>
                  <li>• Your answers are automatically saved</li>
                  <li>• The test will automatically submit when time runs out</li>
                </ul>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-2">Question Types:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <FaSync className="text-blue-600" />
                    <span className="text-blue-700">Mental Rotation</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FaExpand className="text-green-600" />
                    <span className="text-blue-700">Paper Folding</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FaSearchPlus className="text-purple-600" />
                    <span className="text-blue-700">Cross-sections</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FaCube className="text-orange-600" />
                    <span className="text-blue-700">Spatial Transformation</span>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <button
                  onClick={() => setTestStep('test')}
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg"
                >
                  Start Spatial Reasoning Test
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Test Step */}
      {testStep === 'test' && (
        <div className="max-w-4xl mx-auto px-6 py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-lg shadow-sm p-8 border border-gray-200"
            >
              {(() => {
                const question = testData.questions?.find(q => q.order === currentQuestion) || testData.questions?.[currentQuestion - 1];
                if (!question) return <div>Question not found</div>;

                return (
                  <div className="space-y-6">
                    {/* Question Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getQuestionTypeIcon(question.question_type)}
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">
                            Question {currentQuestion}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {getQuestionTypeLabel(question.question_type)}
                          </p>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        {Object.keys(answers).length} of {testData.total_questions} answered
                      </div>
                    </div>

                    {/* Context */}
                    {question.context && (
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <p className="text-blue-800 text-sm">{question.context}</p>
                      </div>
                    )}

                    {/* Question Text */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-medium text-gray-800">
                        {question.question_text}
                      </h4>

                      {/* Visual Content for Spatial Questions */}
                      {question.base_image_id && (
                        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                          <div className="mb-4">
                            <h5 className="text-sm font-medium text-gray-600 mb-2">Visual Element:</h5>
                            <SpatialImageRenderer
                              baseImageId={question.base_image_id}
                              overlayIds={question.overlay_ids || []}
                              transforms={question.transforms?.main || {}}
                              visualStyle={question.visual_style}
                              className="w-full h-64 bg-white border border-gray-200 rounded"
                              alt={`Spatial reasoning question ${currentQuestion}`}
                            />
                          </div>
                          
                          {/* Show complexity score if available */}
                          {question.complexity_score && (
                            <div className="text-xs text-gray-500">
                              Complexity: {question.complexity_score}/5
                            </div>
                          )}
                        </div>
                      )}

                      {/* Sequence Images for Paper Folding */}
                      {question.sequence_images && question.sequence_images.length > 0 && (
                        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                          <h5 className="text-sm font-medium text-gray-600 mb-3">Folding Sequence:</h5>
                          <div className="grid grid-cols-3 gap-4">
                            {question.sequence_images.map((imageUrl, index) => (
                              <div key={index} className="text-center">
                                <div className="bg-white border border-gray-200 rounded p-2 h-24 flex items-center justify-center">
                                  <img 
                                    src={imageUrl} 
                                    alt={`Step ${index + 1}`}
                                    className="max-w-full max-h-full object-contain"
                                    onError={(e) => {
                                      e.target.style.display = 'none';
                                      e.target.parentElement.innerHTML = `<div class="text-xs text-gray-500">Step ${index + 1}</div>`;
                                    }}
                                  />
                                </div>
                                <span className="text-xs text-gray-500 mt-1 block">Step {index + 1}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Options with Visual Variants */}
                      <div className="space-y-3">
                        {question.options?.map((option, index) => {
                          const optionLetter = String.fromCharCode(65 + index); // A, B, C, D
                          const isSelected = answers[question.id] === optionLetter;
                          const optionTransform = question.transforms?.options?.[optionLetter];

                          return (
                            <button
                              key={index}
                              onClick={() => handleAnswerSelect(question.id, optionLetter)}
                              className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                                isSelected
                                  ? 'border-blue-500 bg-blue-50 shadow-md'
                                  : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                              }`}
                            >
                              <div className="flex items-start space-x-3">
                                <div
                                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-medium flex-shrink-0 mt-1 ${
                                    isSelected
                                      ? 'border-blue-500 bg-blue-500 text-white'
                                      : 'border-gray-300 text-gray-500'
                                  }`}
                                >
                                  {optionLetter}
                                </div>
                                
                                <div className="flex-1">
                                  <span className="text-gray-700 block mb-2">{option}</span>
                                  
                                  {/* Visual representation for spatial options */}
                                  {question.base_image_id && optionTransform && (
                                    <div className="mt-2">
                                      <SpatialImageRenderer
                                        baseImageId={question.base_image_id}
                                        overlayIds={question.overlay_ids || []}
                                        transforms={optionTransform}
                                        visualStyle={question.visual_style}
                                        className="w-20 h-16 bg-white border border-gray-200 rounded"
                                        alt={`Option ${optionLetter} visual`}
                                      />
                                    </div>
                                  )}
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex justify-between items-center pt-4">
                      <button
                        onClick={handlePreviousQuestion}
                        disabled={currentQuestion === 1}
                        className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                          currentQuestion === 1
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300 hover:shadow-md'
                        }`}
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Previous
                      </button>

                      {currentQuestion === testData.total_questions ? (
                        <button
                          onClick={handleFinishTest}
                          className="flex items-center px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                        >
                          <FaFlag className="mr-2" />
                          Finish Test
                        </button>
                      ) : (
                        <button
                          onClick={handleNextQuestion}
                          disabled={!answers[question.id]}
                          className={`flex items-center px-8 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg ${
                            !answers[question.id]
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
                              : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 hover:shadow-xl transform hover:scale-105'
                          }`}
                        >
                          Next
                          <FaArrowRight className="ml-2" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {/* Results Step */}
      {testStep === 'results' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto px-6 py-12"
        >
          <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-200 text-center">
            <div className="mb-6">
              <FaCube className="w-16 h-16 text-blue-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Spatial Reasoning Test Completed!</h2>
              <p className="text-gray-600">Your spatial reasoning assessment has been submitted.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-800">Questions Answered</h3>
                <p className="text-2xl font-bold text-blue-600">{Object.keys(answers).length}</p>
                <p className="text-sm text-blue-600">of {testData.total_questions}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-800">Time Used</h3>
                <p className="text-2xl font-bold text-green-600">
                  {formatTime(testData.duration_minutes * 60 - timeRemaining)}
                </p>
                <p className="text-sm text-green-600">of {testData.duration_minutes} minutes</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-semibold text-purple-800">Status</h3>
                <p className="text-2xl font-bold text-purple-600">Complete</p>
                <p className="text-sm text-purple-600">Submitted successfully</p>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-gray-600">
                Your spatial reasoning results will be processed and available in your dashboard shortly.
              </p>
              <button
                onClick={onBackToDashboard}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default SpatialReasoningTest;
