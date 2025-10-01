import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
 Trophy,
 Target,
 Code,
 Clock,
 TrendingUp,
 Award,
 CheckCircle,
 XCircle,
 Activity,
 Calendar,
 ChevronRight,
 Star
} from 'lucide-react';

const CodingDashboard = () => {
 const [stats, setStats] = useState(null);
 const [recentSubmissions, setRecentSubmissions] = useState([]);
 const [popularChallenges, setPopularChallenges] = useState([]);
 const [loading, setLoading] = useState(true);

 useEffect(() => {
 fetchDashboardData();
 }, []);

 const fetchDashboardData = async () => {
 try {
 // Fetch user stats
 const statsResponse = await fetch('http://localhost:8000/api/challenges/stats/');
 if (statsResponse.ok) {
 const statsData = await statsResponse.json();
 setStats(statsData);
 }

 // Fetch recent submissions
 const submissionsResponse = await fetch('http://localhost:8000/api/submissions/recent/?limit=5');
 if (submissionsResponse.ok) {
 const submissionsData = await submissionsResponse.json();
 setRecentSubmissions(submissionsData);
 }

 // Fetch popular challenges
 const challengesResponse = await fetch('http://localhost:8000/api/challenges/?limit=3');
 if (challengesResponse.ok) {
 const challengesData = await challengesResponse.json();
 setPopularChallenges(challengesData.slice(0, 3));
 }

 } catch (error) {
 console.error('Error fetching dashboard data:', error);
 } finally {
 setLoading(false);
 }
 };

 const getDifficultyColor = (difficulty) => {
 const colors = {
 'beginner': 'text-green-600 bg-green-100',
 'intermediate': 'text-yellow-600 bg-yellow-100',
 'advanced': 'text-orange-600 bg-orange-100',
 'expert': 'text-red-600 bg-red-100'
 };
 return colors[difficulty] || 'text-gray-600 bg-gray-100';
 };

 const getStatusIcon = (status) => {
 switch (status) {
 case 'accepted':
 return <CheckCircle className="w-4 h-4 text-green-600" />;
 case 'wrong_answer':
 return <XCircle className="w-4 h-4 text-red-600" />;
 default:
 return <Clock className="w-4 h-4 text-gray-400" />;
 }
 };

 if (loading) {
 return (
 <div className="min-h-screen bg-gray-50 flex items-center justify-center">
 <div className="text-center">
 <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
 <p className="mt-4 text-gray-600">Chargement du tableau de bord...</p>
 </div>
 </div>
 );
 }

 return (
 <div className="min-h-screen bg-gray-50 py-8">
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

 {/* Header */}
 <div className="mb-8">
 <h1 className="text-3xl font-bold text-gray-900 mb-2">
 Tableau de Bord - Défis de Programmation
 </h1>
 <p className="text-gray-600">
 Suivez vos progrès et découvrez de nouveaux défis
 </p>
 </div>

 {/* Stats Grid */}
 {stats && (
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

 {/* Total Challenges */}
 <div className="bg-white rounded-lg shadow-sm border p-6">
 <div className="flex items-center justify-between">
 <div>
 <p className="text-sm font-medium text-gray-600">Défis Disponibles</p>
 <p className="text-2xl font-bold text-gray-900">{stats.total_challenges || 0}</p>
 </div>
 <div className="bg-blue-100 p-3 rounded-lg">
 <Target className="w-6 h-6 text-blue-600" />
 </div>
 </div>
 </div>

 {/* Solved Challenges */}
 <div className="bg-white rounded-lg shadow-sm border p-6">
 <div className="flex items-center justify-between">
 <div>
 <p className="text-sm font-medium text-gray-600">Défis Résolus</p>
 <p className="text-2xl font-bold text-green-600">{stats.solved_challenges || 0}</p>
 </div>
 <div className="bg-green-100 p-3 rounded-lg">
 <CheckCircle className="w-6 h-6 text-green-600" />
 </div>
 </div>
 </div>

 {/* Completion Rate */}
 <div className="bg-white rounded-lg shadow-sm border p-6">
 <div className="flex items-center justify-between">
 <div>
 <p className="text-sm font-medium text-gray-600">Taux de Réussite</p>
 <p className="text-2xl font-bold text-purple-600">{stats.completion_rate || 0}%</p>
 </div>
 <div className="bg-purple-100 p-3 rounded-lg">
 <TrendingUp className="w-6 h-6 text-purple-600" />
 </div>
 </div>
 </div>

 {/* Total Submissions */}
 <div className="bg-white rounded-lg shadow-sm border p-6">
 <div className="flex items-center justify-between">
 <div>
 <p className="text-sm font-medium text-gray-600">Soumissions</p>
 <p className="text-2xl font-bold text-orange-600">{stats.total_submissions || 0}</p>
 </div>
 <div className="bg-orange-100 p-3 rounded-lg">
 <Code className="w-6 h-6 text-orange-600" />
 </div>
 </div>
 </div>
 </div>
 )}

 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

 {/* Recent Submissions */}
 <div className="lg:col-span-2">
 <div className="bg-white rounded-lg shadow-sm border">
 <div className="p-6 border-b">
 <div className="flex items-center justify-between">
 <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
 <Activity className="w-5 h-5" />
 Soumissions Récentes
 </h2>
 <Link
 to="/submissions"
 className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
 >
 Voir tout
 <ChevronRight className="w-4 h-4" />
 </Link>
 </div>
 </div>

 <div className="p-6">
 {recentSubmissions.length === 0 ? (
 <div className="text-center py-8">
 <Code className="w-12 h-12 text-gray-400 mx-auto mb-4" />
 <p className="text-gray-600">Aucune soumission récente</p>
 <Link
 to="/challenges"
 className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
 >
 <Target className="w-4 h-4" />
 Commencer un défi
 </Link>
 </div>
 ) : (
 <div className="space-y-4">
 {recentSubmissions.map((submission) => (
 <div key={submission.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
 <div className="flex items-center gap-3">
 {getStatusIcon(submission.status)}
 <div>
 <p className="font-medium text-gray-900">{submission.challenge_title}</p>
 <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
 <span>Score: {submission.score}pts</span>
 <span>•</span>
 <span>Tests: {submission.tests_passed}/{submission.total_tests}</span>
 <span>•</span>
 <span>{new Date(submission.submitted_at).toLocaleDateString()}</span>
 </div>
 </div>
 </div>
 <div className="text-right">
 <div className={`px-2 py-1 text-xs font-medium rounded ${
 submission.status === 'accepted'
 ? 'bg-green-100 text-green-800'
 : 'bg-red-100 text-red-800'
 }`}>
 {submission.status === 'accepted' ? 'Accepté' : 'Échec'}
 </div>
 </div>
 </div>
 ))}
 </div>
 )}
 </div>
 </div>
 </div>

 {/* Popular Challenges */}
 <div>
 <div className="bg-white rounded-lg shadow-sm border">
 <div className="p-6 border-b">
 <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
 <Star className="w-5 h-5" />
 Défis Populaires
 </h2>
 </div>

 <div className="p-6">
 {popularChallenges.length === 0 ? (
 <p className="text-gray-600 text-center py-4">Aucun défi disponible</p>
 ) : (
 <div className="space-y-4">
 {popularChallenges.map((challenge) => (
 <Link
 key={challenge.id}
 to={`/challenges/${challenge.slug}`}
 className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
 >
 <h3 className="font-medium text-gray-900 mb-2">{challenge.title}</h3>
 <div className="flex items-center justify-between text-sm">
 <div className="flex items-center gap-2">
 <span className={`px-2 py-1 text-xs font-medium rounded ${getDifficultyColor(challenge.difficulty)}`}>
 {challenge.difficulty}
 </span>
 <span className="text-gray-600 capitalize">{challenge.language}</span>
 </div>
 <div className="flex items-center gap-1 text-gray-600">
 <Trophy className="w-4 h-4" />
 <span>{challenge.max_points}pts</span>
 </div>
 </div>
 </Link>
 ))}
 </div>
 )}
 </div>
 </div>

 {/* Quick Actions */}
 <div className="bg-white rounded-lg shadow-sm border mt-6">
 <div className="p-6 border-b">
 <h2 className="text-lg font-semibold text-gray-900">Actions Rapides</h2>
 </div>

 <div className="p-6 space-y-3">
 <Link
 to="/challenges"
 className="flex items-center justify-between p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors group"
 >
 <div className="flex items-center gap-3">
 <Target className="w-5 h-5 text-blue-600" />
 <span className="font-medium text-blue-900">Parcourir les Défis</span>
 </div>
 <ChevronRight className="w-4 h-4 text-blue-600 group-hover:translate-x-1 transition-transform" />
 </Link>

 <Link
 to="/challenges?difficulty=beginner"
 className="flex items-center justify-between p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors group"
 >
 <div className="flex items-center gap-3">
 <Award className="w-5 h-5 text-green-600" />
 <span className="font-medium text-green-900">Défis Débutant</span>
 </div>
 <ChevronRight className="w-4 h-4 text-green-600 group-hover:translate-x-1 transition-transform" />
 </Link>

 <Link
 to="/submissions"
 className="flex items-center justify-between p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors group"
 >
 <div className="flex items-center gap-3">
 <Calendar className="w-5 h-5 text-purple-600" />
 <span className="font-medium text-purple-900">Mes Soumissions</span>
 </div>
 <ChevronRight className="w-4 h-4 text-purple-600 group-hover:translate-x-1 transition-transform" />
 </Link>
 </div>
 </div>
 </div>
 </div>

 {/* Progress Section */}
 {stats && stats.total_challenges > 0 && (
 <div className="bg-white rounded-lg shadow-sm border mt-8 p-6">
 <h2 className="text-lg font-semibold text-gray-900 mb-4">Progression Globale</h2>

 <div className="mb-4">
 <div className="flex justify-between text-sm text-gray-600 mb-1">
 <span>Défis Completés</span>
 <span>{stats.solved_challenges}/{stats.total_challenges}</span>
 </div>
 <div className="w-full bg-gray-200 rounded-full h-2">
 <div
 className="bg-blue-600 h-2 rounded-full transition-all duration-300"
 style={{ width: `${stats.completion_rate}%` }}
 ></div>
 </div>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
 <div>
 <p className="text-2xl font-bold text-green-600">{stats.accepted_submissions || 0}</p>
 <p className="text-sm text-gray-600">Solutions Acceptées</p>
 </div>
 <div>
 <p className="text-2xl font-bold text-blue-600">{stats.avg_score ? Math.round(stats.avg_score) : 0}</p>
 <p className="text-sm text-gray-600">Score Moyen</p>
 </div>
 <div>
 <p className="text-2xl font-bold text-purple-600">{stats.max_score || 0}</p>
 <p className="text-sm text-gray-600">Meilleur Score</p>
 </div>
 </div>
 </div>
 )}
 </div>
 </div>
 );
};

export default CodingDashboard;
