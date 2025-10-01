import React, { useState, useEffect } from 'react';
import {
 FaPlus,
 FaTimes,
 FaCode,
 FaDatabase,
 FaTools,
 FaGlobe,
 FaCloud,
 FaCog,
 FaCheckCircle,
 FaStar,
 FaChartBar
} from 'react-icons/fa';

const SkillsSelector = ({ userId = 1, onSkillsUpdated }) => {
 const [availableSkills, setAvailableSkills] = useState([]);
 const [userSkills, setUserSkills] = useState([]);
 const [skillStats, setSkillStats] = useState(null);
 const [loading, setLoading] = useState(true);
 const [showAddModal, setShowAddModal] = useState(false);
 const [error, setError] = useState(null);

 useEffect(() => {
 loadSkills();
 loadUserSkills();
 }, [userId]);

 useEffect(() => {
 if (userSkills.length > 0) {
 loadSkillStats();
 }
 }, [userSkills]);

 const loadSkills = async () => {
 try {
 const response = await fetch('http://localhost:8000/api/skills/');
 if (!response.ok) throw new Error('Failed to fetch skills');
 const data = await response.json();
 setAvailableSkills(data);
 } catch (error) {
 console.error('Error loading skills:', error);
 setError('Failed to load available skills');
 }
 };

 const loadUserSkills = async () => {
 try {
 // Récupérer le candidat avec ID 1 (utilisateur de test)
 const response = await fetch(`http://localhost:8000/api/candidates/${userId}/`);

 if (!response.ok) {
 // Si pas de candidat, on démarre avec un profil vide
 setUserSkills([]);
 setLoading(false);
 return;
 }

 const candidate = await response.json();
 setUserSkills(candidate.skills || []);
 setLoading(false);
 } catch (error) {
 console.error('Error loading user skills:', error);
 // En cas d'erreur, on démarre avec un profil vide
 setUserSkills([]);
 setLoading(false);
 }
 };

 const loadSkillStats = async () => {
 try {
 // Pour l'instant, on simule des statistiques
 // En production, cela viendrait de l'API Django
 const stats = {
 totalSkills: userSkills.length,
 testsAvailable: userSkills.length * 2, // Simulation
 averageScore: 75 // Simulation
 };
 setSkillStats(stats);
 } catch (error) {
 console.error('Error loading skill stats:', error);
 }
 };

 const addSkill = async (skillId, proficiencyLevel = 'intermediate') => {
 try {
 const skillToAdd = availableSkills.find(skill => skill.id === skillId);
 if (skillToAdd && !userSkills.find(skill => skill.id === skillId)) {

 // Ajouter la compétence via l'API Django
 const response = await fetch(`http://localhost:8000/api/candidates/${userId}/add_skill/`, {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({
 skill_id: skillId
 })
 });

 if (response.ok) {
 // Recharger les compétences depuis l'API pour être sûr
 await loadUserSkills();
 setShowAddModal(false);

 if (onSkillsUpdated) {
 onSkillsUpdated(userSkills);
 }

 // Déclencher la mise à jour des compétences pour les autres composants
 window.dispatchEvent(new CustomEvent('skillsUpdated', {
 detail: { userId, skills: userSkills }
 }));
 } else {
 const errorText = await response.text();
 console.error('API Error:', errorText);
 throw new Error('Failed to save skill');
 }
 }
 } catch (error) {
 console.error('Error adding skill:', error);
 setError('Erreur lors de l\'ajout de la compétence');
 }
 };

 const removeSkill = async (skillId) => {
 try {
 // Supprimer la compétence via l'API Django
 const response = await fetch(`http://localhost:8000/api/candidates/${userId}/remove_skill/`, {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({
 skill_id: skillId
 })
 });

 if (response.ok) {
 // Recharger les compétences depuis l'API pour être sûr
 await loadUserSkills();

 if (onSkillsUpdated) {
 onSkillsUpdated(userSkills);
 }

 // Déclencher la mise à jour des compétences pour les autres composants
 window.dispatchEvent(new CustomEvent('skillsUpdated', {
 detail: { userId, skills: userSkills }
 }));
 } else {
 const errorText = await response.text();
 console.error('API Error:', errorText);
 throw new Error('Failed to remove skill');
 }
 } catch (error) {
 console.error('Error removing skill:', error);
 setError('Erreur lors de la suppression de la compétence');
 }
 };

 const getCategoryIcon = (category) => {
 const iconMap = {
 programming: FaCode,
 frontend: FaGlobe,
 backend: FaTools,
 database: FaDatabase,
 devops: FaCloud,
 mobile: FaCog,
 testing: FaCheckCircle
 };
 return iconMap[category] || FaCode;
 };

 const getCategoryColor = (category) => {
 const colorMap = {
 programming: 'bg-blue-100 text-blue-800',
 frontend: 'bg-green-100 text-green-800',
 backend: 'bg-purple-100 text-purple-800',
 database: 'bg-orange-100 text-orange-800',
 devops: 'bg-indigo-100 text-indigo-800',
 mobile: 'bg-pink-100 text-pink-800',
 testing: 'bg-yellow-100 text-yellow-800'
 };
 return colorMap[category] || 'bg-gray-100 text-gray-800';
 };

 if (loading) {
 return (
 <div className="flex items-center justify-center h-64">
 <div className="text-center">
 <FaCode className="text-4xl text-blue-500 animate-pulse mx-auto mb-4" />
 <p>Chargement de vos compétences...</p>
 </div>
 </div>
 );
 }

 // Grouper les compétences par catégorie
 const skillsByCategory = userSkills.reduce((acc, skill) => {
 if (!acc[skill.category]) {
 acc[skill.category] = [];
 }
 acc[skill.category].push(skill);
 return acc;
 }, {});

 // Filtrer les compétences disponibles (non déjà sélectionnées)
 const availableSkillsForAdd = availableSkills.filter(
 skill => !userSkills.find(userSkill => userSkill.id === skill.id)
 );

 // Grouper les compétences disponibles par catégorie
 const availableSkillsByCategory = availableSkillsForAdd.reduce((acc, skill) => {
 if (!acc[skill.category]) {
 acc[skill.category] = [];
 }
 acc[skill.category].push(skill);
 return acc;
 }, {});

 return (
 <div className="max-w-6xl mx-auto p-6">
 {/* Header avec statistiques */}
 <div className="mb-8">
 <h1 className="text-3xl font-bold text-gray-800 mb-4">Gestion des compétences</h1>

 {skillStats && (
 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
 <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
 <div className="flex items-center">
 <FaCode className="text-2xl text-blue-600 mr-3" />
 <div>
 <p className="text-sm text-blue-600">Compétences totales</p>
 <p className="text-2xl font-bold text-blue-800">{skillStats.totalSkills}</p>
 </div>
 </div>
 </div>

 <div className="bg-green-50 border border-green-200 rounded-lg p-4">
 <div className="flex items-center">
 <FaCheckCircle className="text-2xl text-green-600 mr-3" />
 <div>
 <p className="text-sm text-green-600">Tests disponibles</p>
 <p className="text-2xl font-bold text-green-800">{skillStats.testsAvailable}</p>
 </div>
 </div>
 </div>

 <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
 <div className="flex items-center">
 <FaStar className="text-2xl text-yellow-600 mr-3" />
 <div>
 <p className="text-sm text-yellow-600">Score moyen</p>
 <p className="text-2xl font-bold text-yellow-800">{skillStats.averageScore}%</p>
 </div>
 </div>
 </div>
 </div>
 )}

 {error && (
 <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
 <p className="text-red-700">{error}</p>
 </div>
 )}
 </div>

 {/* Mes compétences */}
 <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
 <div className="flex justify-between items-center mb-6">
 <h2 className="text-xl font-semibold text-gray-800">Mes compétences techniques</h2>
 <button
 onClick={() => setShowAddModal(true)}
 className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
 >
 <FaPlus className="mr-2" />
 Ajouter une compétence
 </button>
 </div>

 {userSkills.length === 0 ? (
 <div className="text-center py-12">
 <FaCode className="text-6xl text-gray-300 mx-auto mb-4" />
 <h3 className="text-xl font-medium text-gray-600 mb-2">Aucune compétence ajoutée</h3>
 <p className="text-gray-500 mb-6">
 Commencez par ajouter vos compétences techniques pour voir les tests disponibles.
 </p>
 <button
 onClick={() => setShowAddModal(true)}
 className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
 >
 Ajouter ma première compétence
 </button>
 </div>
 ) : (
 <div className="space-y-6">
 {Object.entries(skillsByCategory).map(([category, skills]) => {
 const IconComponent = getCategoryIcon(category);
 return (
 <div key={category}>
 <div className="flex items-center mb-3">
 <IconComponent className="text-xl text-gray-600 mr-2" />
 <h3 className="text-lg font-medium text-gray-800 capitalize">
 {category === 'programming' ? 'Langages de programmation' :
 category === 'frontend' ? 'Technologies Frontend' :
 category === 'backend' ? 'Technologies Backend' :
 category === 'database' ? 'Bases de données' :
 category === 'devops' ? 'DevOps & Cloud' :
 category === 'mobile' ? 'Développement Mobile' :
 category === 'testing' ? 'Tests & Qualité' : category}
 </h3>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ml-6">
 {skills.map(skill => (
 <div key={skill.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
 <div className="flex justify-between items-start mb-2">
 <h4 className="font-medium text-gray-800">{skill.name}</h4>
 <button
 onClick={() => removeSkill(skill.id)}
 className="text-red-500 hover:text-red-700 transition-colors"
 >
 <FaTimes />
 </button>
 </div>

 <p className="text-sm text-gray-600 mb-3">{skill.description}</p>

 <div className="flex justify-between items-center">
 <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(skill.category)}`}>
 {skill.category}
 </span>

 {skill.proficiency_level && (
 <span className="text-sm text-blue-600 font-medium">
 {skill.proficiency_level === 'beginner' ? 'Débutant' :
 skill.proficiency_level === 'intermediate' ? 'Intermédiaire' :
 skill.proficiency_level === 'advanced' ? 'Avancé' : skill.proficiency_level}
 </span>
 )}
 </div>
 </div>
 ))}
 </div>
 </div>
 );
 })}
 </div>
 )}
 </div>

 {/* Modal d'ajout de compétence */}
 {showAddModal && (
 <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
 <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
 <div className="flex justify-between items-center mb-6">
 <h3 className="text-xl font-semibold text-gray-800">Ajouter une compétence technique</h3>
 <button
 onClick={() => setShowAddModal(false)}
 className="text-gray-500 hover:text-gray-700"
 >
 <FaTimes className="text-xl" />
 </button>
 </div>

 {availableSkillsForAdd.length === 0 ? (
 <div className="text-center py-8">
 <FaCheckCircle className="text-4xl text-green-500 mx-auto mb-4" />
 <p className="text-gray-600">Vous avez ajouté toutes les compétences disponibles !</p>
 </div>
 ) : (
 <div className="space-y-6">
 {Object.entries(availableSkillsByCategory).map(([category, skills]) => {
 const IconComponent = getCategoryIcon(category);
 return (
 <div key={category}>
 <div className="flex items-center mb-3">
 <IconComponent className="text-lg text-gray-600 mr-2" />
 <h4 className="text-lg font-medium text-gray-800 capitalize">
 {category === 'programming' ? 'Langages de programmation' :
 category === 'frontend' ? 'Technologies Frontend' :
 category === 'backend' ? 'Technologies Backend' :
 category === 'database' ? 'Bases de données' :
 category === 'devops' ? 'DevOps & Cloud' :
 category === 'mobile' ? 'Développement Mobile' :
 category === 'testing' ? 'Tests & Qualité' : category}
 </h4>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ml-6">
 {skills.map(skill => (
 <div key={skill.id} className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors">
 <div className="flex justify-between items-start mb-2">
 <h5 className="font-medium text-gray-800">{skill.name}</h5>
 <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(skill.category)}`}>
 {skill.category}
 </span>
 </div>

 <p className="text-sm text-gray-600 mb-3">{skill.description}</p>

 <div className="flex space-x-2">
 <button
 onClick={() => addSkill(skill.id, 'beginner')}
 className="flex-1 bg-green-100 text-green-800 py-1 px-2 rounded text-sm hover:bg-green-200 transition-colors"
 >
 Débutant
 </button>
 <button
 onClick={() => addSkill(skill.id, 'intermediate')}
 className="flex-1 bg-blue-100 text-blue-800 py-1 px-2 rounded text-sm hover:bg-blue-200 transition-colors"
 >
 Intermédiaire
 </button>
 <button
 onClick={() => addSkill(skill.id, 'advanced')}
 className="flex-1 bg-purple-100 text-purple-800 py-1 px-2 rounded text-sm hover:bg-purple-200 transition-colors"
 >
 Avancé
 </button>
 </div>
 </div>
 ))}
 </div>
 </div>
 );
 })}
 </div>
 )}
 </div>
 </div>
 )}
 </div>
 );
};

export default SkillsSelector;
