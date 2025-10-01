import React, { useState, useEffect } from 'react';
import {
 ArrowLeft,
 Play,
 Save,
 Clock,
 Trophy,
 CheckCircle,
 XCircle,
 AlertCircle,
 Code,
 Terminal,
 FileText,
 Target
} from 'lucide-react';
import CodeEditor from './CodeEditor';

const ChallengeDetail = ({ challenge: propChallenge, onBack }) => {
 const [challenge, setChallenge] = useState(propChallenge);
 const [code, setCode] = useState('');
 const [submissions, setSubmissions] = useState([]);
 const [currentSubmission, setCurrentSubmission] = useState(null);
 const [loading, setLoading] = useState(!propChallenge);
 const [submitting, setSubmitting] = useState(false);
 const [activeTab, setActiveTab] = useState('problem');

 useEffect(() => {
 if (propChallenge) {
 // Si on a un défi de base, l'utiliser temporairement
 setChallenge(propChallenge);
 setCode(propChallenge.starter_code || '');

 // Puis récupérer les détails complets
 fetchChallengeDetails();
 }
 }, [propChallenge]);

 const fetchChallengeDetails = async () => {
 if (!propChallenge?.slug) return;

 try {
 console.log('Fetching challenge details for:', propChallenge.slug);
 const response = await fetch(`http://127.0.0.1:8000/api/challenges/${propChallenge.slug}/`);

 if (response.ok) {
 const detailedChallenge = await response.json();
 console.log('Detailed challenge data:', detailedChallenge);
 setChallenge(detailedChallenge);
 setCode(detailedChallenge.starter_code || '');
 setLoading(false);
 fetchSubmissions();
 } else {
 console.error('Failed to fetch challenge details');
 setLoading(false);
 }
 } catch (error) {
 console.error('Error fetching challenge details:', error);
 setLoading(false);
 }
 };

 const fetchSubmissions = async () => {
 if (!challenge?.id) return;

 try {
 const response = await fetch(`http://127.0.0.1:8000/api/submissions/?challenge_id=${challenge.id}`);
 if (response.ok) {
 const data = await response.json();
 setSubmissions(data);
 }
 } catch (error) {
 console.error('Error fetching submissions:', error);
 }
 };

 const submitCode = async () => {
 if (!challenge || !code.trim()) {
 console.log('submitCode: Missing challenge or code', { challenge: !!challenge, code: code.length });
 return;
 }

 console.log('submitCode: Starting submission', {
 challengeId: challenge.id,
 codeLength: code.length
 });

 setSubmitting(true);
 try {
 const requestData = {
 challenge_id: challenge.id,
 code: code
 };

 console.log('submitCode: Request data', requestData);

 const response = await fetch('http://127.0.0.1:8000/api/submissions/submit_code/', {
 method: 'POST',
 headers: {
 'Content-Type': 'application/json',
 // Add auth header when implemented
 },
 body: JSON.stringify(requestData)
 });

 console.log('submitCode: Response status', response.status);

 if (response.ok) {
 const submission = await response.json();
 console.log('submitCode: Submission result', submission);

 // Show immediate feedback to candidate
 if (submission.success) {
 if (submission.correct) {
 alert(` Félicitations ! Votre solution est correcte !\n\nScore: ${submission.score}/${submission.max_score}\nTests réussis: ${submission.tests_passed}/${submission.total_tests}\nTemps d'exécution: ${submission.execution_time_ms}ms`);
 } else {
 alert(` Solution incorrecte.\n\nScore: ${submission.score}/${submission.max_score}\nTests réussis: ${submission.tests_passed}/${submission.total_tests}\n\n${submission.error_message || 'Vérifiez votre logique et réessayez.'}`);
 }
 } else {
 alert(` Erreur d'exécution:\n${submission.error_message}`);
 }

 setCurrentSubmission(submission);
 setSubmissions(prev => [submission, ...prev]);
 setActiveTab('results');
 } else {
 const errorText = await response.text();
 console.error('submitCode: Failed to submit code', {
 status: response.status,
 error: errorText
 });
 alert(`Erreur lors de la soumission: ${response.status} - ${errorText}`);
 }
 } catch (error) {
 console.error('submitCode: Network/parsing error:', error);
 alert(`Erreur réseau: ${error.message}`);
 } finally {
 setSubmitting(false);
 }
 };

 const saveCode = async () => {
 if (!challenge) return;

 try {
 await fetch('http://localhost:8000/api/coding-sessions/save_code/', {
 method: 'POST',
 headers: {
 'Content-Type': 'application/json',
 },
 body: JSON.stringify({
 challenge_id: challenge.id,
 code: code
 })
 });
 } catch (error) {
 console.error('Error saving code:', error);
 }
 };

 const getStatusIcon = (status) => {
 switch (status) {
 case 'accepted':
 return <CheckCircle className="w-5 h-5 text-green-600" />;
 case 'wrong_answer':
 return <XCircle className="w-5 h-5 text-red-600" />;
 case 'compilation_error':
 case 'runtime_error':
 return <AlertCircle className="w-5 h-5 text-yellow-600" />;
 default:
 return <Clock className="w-5 h-5 text-gray-400" />;
 }
 };

 const getStatusColor = (status) => {
 switch (status) {
 case 'accepted':
 return 'text-green-600 bg-green-50 border-green-200';
 case 'wrong_answer':
 return 'text-red-600 bg-red-50 border-red-200';
 case 'compilation_error':
 case 'runtime_error':
 return 'text-yellow-600 bg-yellow-50 border-yellow-200';
 default:
 return 'text-gray-600 bg-gray-50 border-gray-200';
 }
 };

 if (loading) {
 return (
 <div className="min-h-screen bg-gray-50 flex items-center justify-center">
 <div className="text-center">
 <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
 <p className="mt-4 text-gray-600">Chargement du défi...</p>
 </div>
 </div>
 );
 }

 if (!challenge) {
 return (
 <div className="min-h-screen bg-gray-50 flex items-center justify-center">
 <div className="text-center">
 <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
 <h2 className="text-xl font-semibold text-gray-900 mb-2">Défi introuvable</h2>
 <p className="text-gray-600 mb-4">Le défi demandé n'existe pas ou n'est plus disponible.</p>
 <button
 onClick={onBack}
 className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
 >
 <ArrowLeft className="w-4 h-4" />
 Retour aux défis
 </button>
 </div>
 </div>
 );
 }

 return (
 <div className="min-h-screen bg-gray-50">

 {/* Header */}
 <div className="bg-white border-b">
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-4">
 <button
 onClick={onBack}
 className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
 >
 <ArrowLeft className="w-4 h-4" />
 Retour
 </button>
 <div>
 <h1 className="text-2xl font-bold text-gray-900">{challenge.title}</h1>
 <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
 <span className="capitalize">{challenge.language}</span>
 <span>•</span>
 <span className="capitalize">{challenge.difficulty}</span>
 <span>•</span>
 <div className="flex items-center gap-1">
 <Trophy className="w-4 h-4" />
 <span>{challenge.max_points} points</span>
 </div>
 </div>
 </div>
 </div>

 <div className="flex items-center gap-3">
 <button
 onClick={saveCode}
 className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
 >
 <Save className="w-4 h-4" />
 Sauvegarder
 </button>
 <button
 onClick={submitCode}
 disabled={submitting || !code.trim()}
 className="flex items-center gap-2 px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
 >
 {submitting ? (
 <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
 ) : (
 <Play className="w-4 h-4" />
 )}
 {submitting ? 'Exécution...' : 'Soumettre'}
 </button>
 </div>
 </div>
 </div>
 </div>

 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-200px)]">

 {/* Left Panel - Problem Description */}
 <div className="bg-white rounded-lg shadow-sm border flex flex-col">

 {/* Tabs */}
 <div className="border-b">
 <div className="flex">
 <button
 onClick={() => setActiveTab('problem')}
 className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 ${
 activeTab === 'problem'
 ? 'border-blue-600 text-blue-600'
 : 'border-transparent text-gray-600 hover:text-gray-900'
 }`}
 >
 <FileText className="w-4 h-4" />
 Problème
 </button>
 <button
 onClick={() => setActiveTab('submissions')}
 className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 ${
 activeTab === 'submissions'
 ? 'border-blue-600 text-blue-600'
 : 'border-transparent text-gray-600 hover:text-gray-900'
 }`}
 >
 <Terminal className="w-4 h-4" />
 Soumissions ({submissions.length})
 </button>
 {currentSubmission && (
 <button
 onClick={() => setActiveTab('results')}
 className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 ${
 activeTab === 'results'
 ? 'border-blue-600 text-blue-600'
 : 'border-transparent text-gray-600 hover:text-gray-900'
 }`}
 >
 {getStatusIcon(currentSubmission.status)}
 Résultats
 </button>
 )}
 </div>
 </div>

 {/* Tab Content */}
 <div className="flex-1 overflow-y-auto p-6">

 {/* Problem Tab */}
 {activeTab === 'problem' && (
 <div className="space-y-6">
 <div>
 <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
 <p className="text-gray-700">{challenge.description || 'Aucune description'}</p>
 </div>

 <div>
 <h3 className="text-lg font-semibold text-gray-900 mb-3">Énoncé du Problème</h3>
 <div className="prose prose-sm max-w-none">
 <pre className="whitespace-pre-wrap bg-gray-50 p-4 rounded-lg text-sm">
 {challenge.problem_statement || 'Aucun énoncé disponible'}
 </pre>
 </div>
 </div>

 {challenge.input_format && (
 <div>
 <h3 className="text-lg font-semibold text-gray-900 mb-3">Format d'Entrée</h3>
 <p className="text-gray-700">{challenge.input_format}</p>
 </div>
 )}

 {challenge.output_format && (
 <div>
 <h3 className="text-lg font-semibold text-gray-900 mb-3">Format de Sortie</h3>
 <p className="text-gray-700">{challenge.output_format}</p>
 </div>
 )}

 {challenge.constraints && (
 <div>
 <h3 className="text-lg font-semibold text-gray-900 mb-3">Contraintes</h3>
 <pre className="whitespace-pre-wrap bg-gray-50 p-4 rounded-lg text-sm">
 {challenge.constraints}
 </pre>
 </div>
 )}

 {challenge.public_test_cases && challenge.public_test_cases.length > 0 && (
 <div>
 <h3 className="text-lg font-semibold text-gray-900 mb-3">Exemples de Test</h3>
 <div className="space-y-4">
 {challenge.public_test_cases.map((testCase, index) => (
 <div key={index} className="bg-gray-50 p-4 rounded-lg">
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 <div>
 <h4 className="font-medium text-gray-900 mb-2">Entrée:</h4>
 <pre className="text-sm text-gray-700">{testCase.input}</pre>
 </div>
 <div>
 <h4 className="font-medium text-gray-900 mb-2">Sortie Attendue:</h4>
 <pre className="text-sm text-gray-700">{testCase.expected_output}</pre>
 </div>
 </div>
 </div>
 ))}
 </div>
 </div>
 )}
 </div>
 )}

 {/* Submissions Tab */}
 {activeTab === 'submissions' && (
 <div className="space-y-4">
 <h3 className="text-lg font-semibold text-gray-900">Historique des Soumissions</h3>
 {submissions.length === 0 ? (
 <p className="text-gray-600">Aucune soumission pour l'instant.</p>
 ) : (
 <div className="space-y-3">
 {submissions.map((submission) => (
 <div key={submission.id} className="border rounded-lg p-4">
 <div className="flex items-center justify-between mb-2">
 <div className="flex items-center gap-2">
 {getStatusIcon(submission.status)}
 <span className={`px-2 py-1 text-xs font-medium rounded border ${getStatusColor(submission.status)}`}>
 {submission.status}
 </span>
 </div>
 <span className="text-sm text-gray-500">
 {new Date(submission.submitted_at).toLocaleString()}
 </span>
 </div>
 <div className="flex items-center gap-4 text-sm text-gray-600">
 <span>Score: {submission.score}/{challenge.max_points}</span>
 <span>Tests: {submission.tests_passed}/{submission.total_tests}</span>
 <span>Temps: {submission.execution_time_ms}ms</span>
 </div>
 </div>
 ))}
 </div>
 )}
 </div>
 )}

 {/* Results Tab */}
 {activeTab === 'results' && currentSubmission && (
 <div className="space-y-6">
 <div>
 <h3 className="text-lg font-semibold text-gray-900 mb-3">Résultats de votre soumission</h3>

 {/* Overall Result */}
 <div className={`p-6 rounded-lg border-2 ${
 currentSubmission.correct || currentSubmission.status === 'accepted'
 ? 'bg-green-50 border-green-200'
 : 'bg-red-50 border-red-200'
 }`}>
 <div className="flex items-center gap-3 mb-4">
 {currentSubmission.correct || currentSubmission.status === 'accepted' ? (
 <>
 <CheckCircle className="w-8 h-8 text-green-600" />
 <div>
 <h4 className="text-xl font-bold text-green-800"> Solution Correcte !</h4>
 <p className="text-green-700">Félicitations, votre code fonctionne parfaitement.</p>
 </div>
 </>
 ) : (
 <>
 <XCircle className="w-8 h-8 text-red-600" />
 <div>
 <h4 className="text-xl font-bold text-red-800"> Solution Incorrecte</h4>
 <p className="text-red-700">Votre code ne passe pas tous les tests. Vérifiez votre logique.</p>
 </div>
 </>
 )}
 </div>

 {/* Score Summary */}
 <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
 <div className="text-center">
 <div className="text-2xl font-bold text-gray-900">{currentSubmission.score || 0}</div>
 <div className="text-gray-600">Score / {challenge.max_points}</div>
 </div>
 <div className="text-center">
 <div className="text-2xl font-bold text-gray-900">{currentSubmission.tests_passed || 0}/{currentSubmission.total_tests || 0}</div>
 <div className="text-gray-600">Tests Réussis</div>
 </div>
 <div className="text-center">
 <div className="text-2xl font-bold text-gray-900">{currentSubmission.execution_time_ms || 0}ms</div>
 <div className="text-gray-600">Temps d'Exécution</div>
 </div>
 <div className="text-center">
 <div className="text-2xl font-bold text-gray-900">{(currentSubmission.memory_used_mb || 0).toFixed(1)}MB</div>
 <div className="text-gray-600">Mémoire Utilisée</div>
 </div>
 </div>
 </div>
 </div>

 {/* Error Message */}
 {currentSubmission.error_message && (
 <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
 <h4 className="font-medium text-red-800 mb-2">Message d'Erreur:</h4>
 <pre className="text-sm text-red-700 whitespace-pre-wrap">
 {currentSubmission.error_message}
 </pre>
 </div>
 )}

 {/* Test Results */}
 {currentSubmission.test_results && currentSubmission.test_results.length > 0 && (
 <div>
 <h4 className="font-medium text-gray-900 mb-3">Exemples de Tests:</h4>
 <div className="space-y-3">
 {currentSubmission.test_results.map((result, index) => (
 <div key={index} className={`border rounded-lg p-4 ${
 result.passed
 ? 'border-green-200 bg-green-50'
 : 'border-red-200 bg-red-50'
 }`}>
 <div className="flex items-center gap-2 mb-2">
 {result.passed ? (
 <CheckCircle className="w-4 h-4 text-green-600" />
 ) : (
 <XCircle className="w-4 h-4 text-red-600" />
 )}
 <span className="font-medium">Test {index + 1} {result.passed ? '' : ''}</span>
 </div>
 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
 <div>
 <span className="text-gray-600 font-medium">Entrée:</span>
 <pre className="mt-1 text-xs bg-white p-2 rounded border">{result.input}</pre>
 </div>
 <div>
 <span className="text-gray-600 font-medium">Attendu:</span>
 <pre className="mt-1 text-xs bg-white p-2 rounded border">{result.expected_output}</pre>
 </div>
 <div>
 <span className="text-gray-600 font-medium">Votre résultat:</span>
 <pre className="mt-1 text-xs bg-white p-2 rounded border">{result.actual_output}</pre>
 </div>
 </div>
 </div>
 ))}
 </div>
 </div>
 )}

 {/* Retry Button */}
 <div className="text-center">
 <button
 onClick={() => setActiveTab('problem')}
 className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
 >
 Retour au Problème
 </button>
 </div>
 </div>
 )}
 </div>
 </div>

 {/* Right Panel - Code Editor */}
 <div className="bg-white rounded-lg shadow-sm border flex flex-col">
 <div className="border-b p-4">
 <div className="flex items-center justify-between">
 <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
 <Code className="w-5 h-5" />
 Éditeur de Code
 </h3>
 <div className="flex items-center gap-2">
 <span className="text-sm text-gray-600 capitalize">
 {challenge.language}
 </span>
 <button
 onClick={submitCode}
 disabled={submitting || !code.trim()}
 className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg transition-colors text-sm"
 >
 {submitting ? (
 <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
 ) : (
 <Play className="w-3 h-3" />
 )}
 {submitting ? 'Exécution...' : 'Exécuter'}
 </button>
 </div>
 </div>
 </div>

 <div className="flex-1">
 <CodeEditor
 language={challenge.language}
 value={code}
 onChange={setCode}
 theme="vs-light"
 options={{
 minimap: { enabled: false },
 fontSize: 14,
 lineNumbers: 'on',
 wordWrap: 'on',
 automaticLayout: true
 }}
 />
 </div>
 </div>
 </div>
 </div>
 </div>
 );
};

export default ChallengeDetail;
