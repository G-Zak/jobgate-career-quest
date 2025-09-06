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
        question_text: "Which of these Z-shaped objects shows the same structure from a different angle?",
        context: "Perspective questions test your ability to recognize the same object from different viewpoints.",
        options: [
          "Same Z-shape from front view",
          "Mirrored Z-shape",
          "Rotated Z-shape", 
          "Different structure entirely"
        ],
        correct_answer: "A",
        order: 6,
        base_image_id: "MR_Z_block_01",
        overlay_ids: [],
        option_transforms: [
          { base_image_id: "MR_Z_block_01", transforms: { rotation: 0 } },
          { base_image_id: "MR_Z_block_01", transforms: { flipX: true } },
          { base_image_id: "MR_Z_block_01", transforms: { rotation: 45 } },
          { base_image_id: "MR_U_block_01", transforms: { rotation: 0 } }
        ],
        visual_style: "technical_3d",
        complexity_score: 1
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
          <FaCube className="text-6xl text-blue-600 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Loading Spatial Reasoning Test...</h2>
          <p className="text-gray-600">Preparing visual content and questions</p>
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
  }

  const currentQuestionData = testData?.questions?.[currentQuestion - 1];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Test Instructions */}
      {testStep === 'instructions' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="min-h-screen flex items-center justify-center p-6"
        >
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-4xl w-full">
            <div className="text-center mb-8">
              <FaCube className="text-6xl text-blue-600 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{testData.title}</h1>
              <p className="text-gray-600">{testData.description}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">Test Instructions</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• You will be shown 3D objects and asked to identify rotations</li>
                  <li>• Read each question carefully before selecting your answer</li>
                  <li>• You can navigate between questions using the Next/Previous buttons</li>
                  <li>• Take your time to visualize the spatial transformations</li>
                  <li>• Click "Finish Test" when you're ready to submit</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Test Details</h3>
                <div className="space-y-2 text-gray-700">
                  <div className="flex justify-between">
                    <span>Duration:</span>
                    <span className="font-medium">{testData.duration_minutes} minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Questions:</span>
                    <span className="font-medium">{testData.total_questions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Question Types:</span>
                    <span className="font-medium">Mental Rotation</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={onBackToDashboard}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Back to Dashboard
              </button>
              <button
                onClick={() => setTestStep('test')}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                Start Test <FaArrowRight />
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Test Questions */}
      {testStep === 'test' && currentQuestionData && (
        <div className="min-h-screen flex flex-col">
          {/* Header */}
          <div className="bg-white shadow-sm border-b border-gray-200 p-4">
            <div className="max-w-6xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  {getQuestionTypeIcon(currentQuestionData.question_type)}
                  <span className="font-medium text-gray-800">
                    {getQuestionTypeLabel(currentQuestionData.question_type)}
                  </span>
                </div>
                <span className="text-gray-500">
                  Question {currentQuestion} of {testData.total_questions}
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
                    {currentQuestionData.question_text}
                  </h2>
                  {currentQuestionData.context && (
                    <p className="text-gray-600 bg-blue-50 p-4 rounded-lg">
                      💡 {currentQuestionData.context}
                    </p>
                  )}
                </div>

                {/* Visual Content */}
                <div className="grid lg:grid-cols-2 gap-8 mb-8">
                  {/* Main Image */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Visual Element:</h3>
                    <div className="bg-gray-50 rounded-lg p-6 h-64 flex items-center justify-center">
                      <SpatialImageRenderer
                        baseImageId={currentQuestionData.base_image_id}
                        overlayIds={currentQuestionData.overlay_ids}
                        transforms={{}}
                        className="w-full h-full"
                        alt="Question visual"
                      />
                    </div>
                    <div className="mt-2 text-sm text-gray-500 text-center">
                      Complexity: {currentQuestionData.complexity_score}/5
                    </div>
                  </div>

                  {/* Answer Options */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Select the correct option:</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {currentQuestionData.options.map((option, index) => {
                        const optionLetter = String.fromCharCode(65 + index); // A, B, C, D
                        const isSelected = answers[currentQuestionData.id] === optionLetter;
                        const optionTransform = currentQuestionData.option_transforms?.[index];
                        
                        return (
                          <div
                            key={index}
                            className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                              isSelected 
                                ? 'border-blue-500 bg-blue-50' 
                                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                            }`}
                            onClick={() => handleAnswerSelect(currentQuestionData.id, optionLetter)}
                          >
                            <div className="text-center">
                              <div className="font-bold text-lg mb-2">Option {optionLetter}</div>
                              <div className="h-32 bg-white rounded border flex items-center justify-center mb-2">
                                {optionTransform && (
                                  <SpatialImageRenderer
                                    baseImageId={optionTransform.base_image_id}
                                    transforms={optionTransform.transforms}
                                    className="w-full h-full"
                                    alt={`Option ${optionLetter}`}
                                  />
                                )}
                              </div>
                              <div className="text-sm text-gray-600">{option}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex justify-between items-center">
                  <button
                    onClick={handlePreviousQuestion}
                    disabled={currentQuestion === 1}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  
                  <div className="text-sm text-gray-500">
                    {answers[currentQuestionData.id] ? '✓ Answered' : 'Not answered'}
                  </div>

                  {currentQuestion === testData.total_questions ? (
                    <button
                      onClick={handleFinishTest}
                      className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                    >
                      <FaFlag /> Finish Test
                    </button>
                  ) : (
                    <button
                      onClick={handleNextQuestion}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Next
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
              You have successfully completed the Spatial Reasoning Assessment.
            </p>
            
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">Your Results</h3>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600">{Object.keys(answers).length}</div>
                  <div className="text-sm text-gray-600">Questions Answered</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">{testData.total_questions}</div>
                  <div className="text-sm text-gray-600">Total Questions</div>
                </div>
              </div>
            </div>

            <button
              onClick={onBackToDashboard}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Return to Dashboard
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default SpatialReasoningTest;
