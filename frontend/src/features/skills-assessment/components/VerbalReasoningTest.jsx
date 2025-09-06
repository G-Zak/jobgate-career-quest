import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaClock, FaBookOpen, FaBrain, FaCheckCircle, FaTimesCircle, FaStop, FaArrowRight, FaFlag } from 'react-icons/fa';
import { useScrollToTop, useTestScrollToTop, useQuestionScrollToTop, scrollToTop } from '../../../shared/utils/scrollUtils';

const VerbalReasoningTest = ({ onBackToDashboard, language = 'english', testId = 1 }) => {
  const [testStep, setTestStep] = useState('instructions'); // instructions, test, results
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [timeRemaining, setTimeRemaining] = useState(25 * 60); // 25 minutes in seconds
  const [answers, setAnswers] = useState({});
  const [testData, setTestData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Universal scroll management using scroll utilities
  useScrollToTop([], { smooth: true }); // Scroll on component mount
  useTestScrollToTop(testStep, 'verbal-test-scroll', { smooth: true, attempts: 5 }); // Scroll on test step changes
  useQuestionScrollToTop(currentQuestion, testStep, 'verbal-test-scroll'); // Scroll on question changes

  // Fetch test data from API
  useEffect(() => {
    const fetchTestData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8000/api/tests/${testId}/`);
        if (response.ok) {
          const data = await response.json();
          setTestData(data);
          // Set timer based on actual test duration
          setTimeRemaining(data.duration_minutes * 60);
        } else {
          console.error('Failed to fetch test data');
          // Fall back to mock data if API fails
          setTestData(getTestData(language));
        }
      } catch (error) {
        console.error('Error fetching test data:', error);
        // Fall back to mock data if API fails
        setTestData(getTestData(language));
      } finally {
        setLoading(false);
      }
    };

    fetchTestData();
  }, [testId, language]);

  // Translation object
  const translations = {
    english: {
      title: "Verbal Reasoning Assessment",
      description: "Assess your ability to understand, analyze, and draw conclusions from written information.",
      backToDashboard: "Back to Dashboard",
      instructions: "Verbal Reasoning Assessment Instructions",
      testOverview: "Test Overview",
      duration: "Duration",
      questions: "Questions",
      questionTypes: "Question Types",
      instructionsList: "Instructions",
      instructionsText: [
        "Read each question carefully and select the best answer",
        "For reading comprehension questions, refer to the provided passage", 
        "You can navigate between questions using the Previous/Next buttons",
        "Your answers are automatically saved",
        "Ensure you have a quiet environment for optimal concentration",
        "The test will automatically submit when time runs out"
      ],
      minutes: "minutes",
      startTest: "Start Test",
      abortTest: "Abort Test",
      abortConfirm: "Are you sure you want to abort this test? Your progress will be lost.",
      passage: "Passage:",
      previous: "Previous",
      next: "Next",
      finishTest: "Finish Test",
      testCompleted: "Test Completed!",
      testSubmitted: "Your verbal reasoning assessment has been submitted.",
      questionsAnswered: "Questions Answered",
      timeUsed: "Time Used",
      status: "Status",
      complete: "Complete",
      submitted: "Submitted successfully",
      resultsMessage: "Your results will be processed and available in your dashboard shortly.",
      returnToDashboard: "Return to Dashboard",
      questionTypesLabels: {
        reading_comprehension: "Reading Comprehension",
        vocabulary: "Vocabulary in Context", 
        logical_deduction: "Logical Deduction",
        critical_reasoning: "Critical Reasoning",
        analogies: "Analogies"
      }
    },
    french: {
      title: "Évaluation du Raisonnement Verbal",
      description: "Évaluez votre capacité à comprendre, analyser et tirer des conclusions à partir d'informations écrites.",
      backToDashboard: "Retour au Tableau de Bord",
      instructions: "Instructions de l'Évaluation du Raisonnement Verbal",
      testOverview: "Aperçu du Test",
      duration: "Durée",
      questions: "Questions",
      questionTypes: "Types de Questions",
      instructionsList: "Instructions",
      instructionsText: [
        "Lisez attentivement chaque question et sélectionnez la meilleure réponse",
        "Pour les questions de compréhension de lecture, référez-vous au passage fourni",
        "Vous pouvez naviguer entre les questions en utilisant les boutons Précédent/Suivant",
        "Vos réponses sont automatiquement sauvegardées",
        "Assurez-vous d'avoir un environnement calme pour une concentration optimale",
        "Le test se soumettra automatiquement lorsque le temps sera écoulé"
      ],
      minutes: "minutes",
      startTest: "Commencer le Test",
      abortTest: "Abandonner le Test",
      abortConfirm: "Êtes-vous sûr de vouloir abandonner ce test ? Votre progression sera perdue.",
      passage: "Passage:",
      previous: "Précédent",
      next: "Suivant",
      finishTest: "Terminer le Test",
      testCompleted: "Test Terminé!",
      testSubmitted: "Votre évaluation du raisonnement verbal a été soumise.",
      questionsAnswered: "Questions Répondues",
      timeUsed: "Temps Utilisé",
      status: "Statut",
      complete: "Terminé",
      submitted: "Soumis avec succès",
      resultsMessage: "Vos résultats seront traités et disponibles dans votre tableau de bord sous peu.",
      returnToDashboard: "Retourner au Tableau de Bord",
      questionTypesLabels: {
        reading_comprehension: "Compréhension de Lecture",
        vocabulary: "Vocabulaire en Contexte",
        logical_deduction: "Déduction Logique", 
        critical_reasoning: "Raisonnement Critique",
        analogies: "Analogies"
      }
    }
  };

  const t = translations[language] || translations.english;

  // Mock test data with language support
  const getTestData = (lang) => {
    const baseData = {
      id: 1,
      title: t.title,
      description: t.description,
      duration_minutes: 25,
      total_questions: 5, // Reduced for demo
    };

    if (lang === 'french') {
      return {
        ...baseData,
        questions: [
          {
            id: 1,
            question_type: "reading_comprehension",
            question_text: "Selon le passage, quelle est la cause principale du réchauffement climatique ?",
            passage: "Le changement climatique représente l'un des défis les plus importants auxquels l'humanité fait face au 21e siècle. Le consensus scientifique est clair : les activités humaines, en particulier la combustion de combustibles fossiles, sont les principaux moteurs du réchauffement climatique. L'augmentation des températures a conduit à la fonte des calottes glaciaires, à l'élévation du niveau de la mer et à des événements météorologiques extrêmes de plus en plus fréquents.",
            options: [
              "Cycles climatiques naturels",
              "Activités humaines, en particulier la combustion de combustibles fossiles",
              "Changements du rayonnement solaire",
              "Éruptions volcaniques"
            ],
            order: 1
          },
          {
            id: 2,
            question_type: "vocabulary",
            question_text: "Dans la phrase \"La rhétorique du politicien était si persuasive qu'elle a influencé même les électeurs les plus sceptiques,\" le mot \"rhétorique\" signifie principalement :",
            options: [
              "Malhonnêteté",
              "Style oratoire ou langage persuasif",
              "Position politique",
              "Charme personnel"
            ],
            order: 2
          },
          {
            id: 3,
            question_type: "logical_deduction",
            question_text: "Tous les entrepreneurs prospères prennent des risques. Marie est une entrepreneure prospère. Par conséquent :",
            options: [
              "Marie pourrait prendre des risques",
              "Marie prend définitivement des risques",
              "Marie ne prend pas de risques",
              "Nous ne pouvons pas déterminer si Marie prend des risques"
            ],
            order: 3
          },
          {
            id: 4,
            question_type: "critical_reasoning",
            question_text: "Une étude montre que les étudiants qui prennent un petit-déjeuner obtiennent de meilleurs résultats aux tests. Le conseil d'école conclut que fournir un petit-déjeuner gratuit améliorera les résultats de tous les étudiants. Quelle est la principale faille de ce raisonnement ?",
            options: [
              "L'échantillon était trop petit",
              "La corrélation n'implique pas la causalité",
              "L'étude était biaisée",
              "Le petit-déjeuner gratuit coûte trop cher"
            ],
            order: 4
          },
          {
            id: 5,
            question_type: "analogies",
            question_text: "Livre est à Auteur comme Peinture est à :",
            options: [
              "Toile",
              "Artiste",
              "Cadre",
              "Galerie"
            ],
            order: 5
          }
        ]
      };
    } else {
      return {
        ...baseData,
        questions: [
          {
            id: 1,
            question_type: "reading_comprehension",
            question_text: "According to the passage, what is the primary cause of global warming?",
            passage: "Climate change represents one of the most significant challenges facing humanity in the 21st century. The scientific consensus is clear: human activities, particularly the burning of fossil fuels, are the primary drivers of global warming. Rising temperatures have led to melting ice caps, rising sea levels, and increasingly frequent extreme weather events.",
            options: [
              "Natural climate cycles",
              "Human activities, especially burning fossil fuels", 
              "Solar radiation changes",
              "Volcanic eruptions"
            ],
            order: 1
          },
          {
            id: 2,
            question_type: "vocabulary",
            question_text: "In the sentence \"The politician's rhetoric was so persuasive that it swayed even the most skeptical voters,\" the word \"rhetoric\" most nearly means:",
            options: [
              "Dishonesty",
              "Speaking style or persuasive language",
              "Political position", 
              "Personal charm"
            ],
            order: 2
          },
          {
            id: 3,
            question_type: "logical_deduction",
            question_text: "All successful entrepreneurs are risk-takers. Maria is a successful entrepreneur. Therefore:",
            options: [
              "Maria might be a risk-taker",
              "Maria is definitely a risk-taker",
              "Maria is not a risk-taker",
              "We cannot determine if Maria is a risk-taker"
            ],
            order: 3
          },
          {
            id: 4,
            question_type: "critical_reasoning",
            question_text: "A study shows that students who eat breakfast perform better on tests. The school board concludes that providing free breakfast will improve all students' test scores. What is the main flaw in this reasoning?",
            options: [
              "The sample size was too small",
              "Correlation does not imply causation",
              "The study was biased",
              "Free breakfast is too expensive"
            ],
            order: 4
          },
          {
            id: 5,
            question_type: "analogies",
            question_text: "Book is to Author as Painting is to:",
            options: [
              "Canvas",
              "Artist", 
              "Frame",
              "Gallery"
            ],
            order: 5
          }
        ]
      };
    }
  };

  // Timer countdown
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
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleStartTest = () => {
    setTestStep('test');
    
    // Use scroll utility for immediate scroll on test start
    setTimeout(() => {
      scrollToTop({
        container: 'verbal-test-scroll',
        forceImmediate: true,
        attempts: 3,
        delay: 50
      });
    }, 100);
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
    } else {
      handleFinishTest();
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
    if (window.confirm(t.abortConfirm)) {
      onBackToDashboard();
    }
  };

  const getCurrentQuestion = () => {
    return testData?.questions?.find(q => q.order === currentQuestion);
  };

  const getQuestionTypeIcon = (type) => {
    switch (type) {
      case 'reading_comprehension':
        return <FaBookOpen className="text-blue-600" />;
      case 'vocabulary':
        return <FaBrain className="text-green-600" />;
      case 'logical_deduction':
        return <FaCheckCircle className="text-purple-600" />;
      case 'critical_reasoning':
        return <FaTimesCircle className="text-red-600" />;
      case 'analogies':
        return <FaClock className="text-orange-600" />;
      default:
        return <FaBrain className="text-gray-600" />;
    }
  };

  const getQuestionTypeLabel = (type) => {
    return t.questionTypesLabels[type] || type;
  };

  if (loading) {
    return (
      <div className="w-full bg-gray-50 flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading test...</p>
        </div>
      </div>
    );
  }

  if (!testData) {
    return (
      <div className="w-full bg-gray-50 flex items-center justify-center py-20">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Test Not Available</h2>
          <p className="text-gray-600 mb-4">Unable to load the test data. Please try again.</p>
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
    <div id="verbal-test-root" className="relative min-h-screen">
      {/* Fixed gradient background */}
      <div id="verbal-bg" className="fixed inset-0 -z-10 bg-gradient-to-br from-gray-50 to-gray-100" aria-hidden="true" />
      {/* Local scroll container: only test area scrolls */}
      <div 
        id="verbal-test-scroll" 
        className="test-scroll-container relative h-[calc(100vh-7rem)] overflow-y-auto overflow-x-hidden"
        data-scroll-container="verbal-test"
      >
      {/* Test Header - Sticky within local container */}
      <div id="verbal-test-header" className="bg-white shadow-sm border-b border-gray-200 p-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
            <button
              onClick={onBackToDashboard}
              className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              {t.backToDashboard}
            </button>
            <h1 className="text-xl font-semibold text-gray-800">{testData.title}</h1>
            {testStep === 'test' && (
              <div className="flex items-center space-x-6">
                <div className="flex items-center text-blue-600">
                  <FaClock className="mr-2" />
                  <span className="font-mono text-lg">{formatTime(timeRemaining)}</span>
                </div>
                <span className="text-gray-500">
                  {t.questions.slice(0, -1)} {currentQuestion} of {testData.total_questions}
                </span>
                <button
                  onClick={handleAbortTest}
                  className="flex items-center px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors font-medium"
                  title={t.abortTest}
                >
                  <FaStop className="mr-2" />
                  {t.abortTest}
                </button>
              </div>
            )}
          </div>
        </div>

      {/* Content within local scroll container */}
      <div>
        {/* Instructions Step */}
        {testStep === 'instructions' && (
          <motion.div id="verbal-instructions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto px-6 py-12"
        >
          <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">{t.instructions}</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-3">{t.testOverview}</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• <strong>{t.duration}:</strong> {testData.duration_minutes} {t.minutes}</li>
                  <li>• <strong>{t.questions}:</strong> {testData.total_questions} {t.questions.toLowerCase()}</li>
                  <li>• <strong>{t.questionTypes}:</strong> {Object.values(t.questionTypesLabels).join(', ')}</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-3">{t.instructionsList}</h3>
                <ul className="space-y-2 text-gray-600">
                  {t.instructionsText.map((instruction, index) => (
                    <li key={index}>• {instruction}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-2">{t.questionTypes}:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <FaBookOpen className="text-blue-600" />
                    <span className="text-blue-700">{t.questionTypesLabels.reading_comprehension}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FaBrain className="text-green-600" />
                    <span className="text-blue-700">{t.questionTypesLabels.vocabulary}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FaCheckCircle className="text-purple-600" />
                    <span className="text-blue-700">{t.questionTypesLabels.logical_deduction}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FaTimesCircle className="text-red-600" />
                    <span className="text-blue-700">{t.questionTypesLabels.critical_reasoning}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FaClock className="text-orange-600" />
                    <span className="text-blue-700">{t.questionTypesLabels.analogies}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 text-center">
              <button
                onClick={handleStartTest}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg"
              >
                {t.startTest}
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Test Step */}
      {testStep === 'test' && (
        // Extra top margin so the sticky header never overlaps the question card
        <div id="verbal-test-content" className="max-w-5xl mx-auto px-6 py-8 mt-8 md:mt-10">
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progress</span>
              <span>{Math.round((currentQuestion / testData.total_questions) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentQuestion / testData.total_questions) * 100}%` }}
              ></div>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div id="verbal-question-card"
              key={currentQuestion}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-lg shadow-sm p-8 border border-gray-200 relative z-0"
            >
              {(() => {
                const question = getCurrentQuestion();
                if (!question) return null;

                return (
                  <div>
                    {/* Question Header */}
                    <div className="flex items-center justify-between mb-6">
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
                      <span className="text-sm text-gray-400">
                        {currentQuestion} of {testData.total_questions}
                      </span>
                    </div>

                    {/* Passage (if reading comprehension) */}
                    {question.passage && (
                      <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <h4 className="font-semibold text-gray-700 mb-3">{t.passage}</h4>
                        <p className="text-gray-700 leading-relaxed">{question.passage}</p>
                      </div>
                    )}

                    {/* Question Text */}
                    <div className="mb-6">
                      <h4 className="text-lg font-medium text-gray-800 mb-4">
                        {question.question_text}
                      </h4>

                      {/* Answer Options */}
                      <div className="space-y-3">
                        {question.options.map((option, index) => {
                          const optionLetter = String.fromCharCode(65 + index); // A, B, C, D
                          const isSelected = answers[question.id] === optionLetter;

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
                              <div className="flex items-center space-x-3">
                                <div
                                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-medium ${
                                    isSelected
                                      ? 'border-blue-500 bg-blue-500 text-white'
                                      : 'border-gray-300 text-gray-500'
                                  }`}
                                >
                                  {optionLetter}
                                </div>
                                <span className="text-gray-700">{option}</span>
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
                        {t.previous}
                      </button>

                      {currentQuestion === testData.total_questions ? (
                        <button
                          onClick={handleFinishTest}
                          className="flex items-center px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                        >
                          <FaFlag className="mr-2" />
                          {t.finishTest}
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
                          {t.next}
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
        <motion.div id="verbal-results"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto px-6 py-12"
        >
          <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-200 text-center">
            <div className="mb-6">
              <FaCheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Test Completed!</h2>
              <p className="text-gray-600">Your verbal reasoning assessment has been submitted.</p>
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
                Your results will be processed and available in your dashboard shortly.
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
      </div>
    </div>
  );
};

export default VerbalReasoningTest;
