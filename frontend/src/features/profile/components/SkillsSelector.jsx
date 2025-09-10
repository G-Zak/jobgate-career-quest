import React, { useState, useEffect } from 'react';
import { 
  MagnifyingGlassIcon, 
  PlusIcon, 
  XMarkIcon, 
  CheckIcon,
  SparklesIcon 
} from '@heroicons/react/24/outline';
import { 
  skillCategories, 
  searchSkills, 
  getRecommendedSkills,
  getSkillCategory,
  proficiencyLevels 
} from '../../../data/predefinedSkills';

const SkillsSelector = ({ userSkills = [], onSkillsChange, showRecommendations = true }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddSkill, setShowAddSkill] = useState(false);
  const [userSkillsWithProficiency, setUserSkillsWithProficiency] = useState([]);

  // Initialize user skills with proficiency if not already set
  useEffect(() => {
    const skillsWithProficiency = userSkills.map(skill => {
      if (typeof skill === 'string') {
        return { name: skill, proficiency: 'intermediate' };
      }
      return skill;
    });
    setUserSkillsWithProficiency(skillsWithProficiency);
  }, [userSkills]);

  // Update search results when query changes
  useEffect(() => {
    if (searchQuery.length > 0) {
      const results = searchSkills(searchQuery);
      setSearchResults(results.slice(0, 10)); // Limit to 10 results
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  // Handle adding a skill
  const handleAddSkill = (skillName, proficiency = 'intermediate') => {
    const skillExists = userSkillsWithProficiency.some(skill => skill.name === skillName);
    if (!skillExists) {
      const newSkills = [...userSkillsWithProficiency, { name: skillName, proficiency }];
      setUserSkillsWithProficiency(newSkills);
      onSkillsChange(newSkills);
      setSearchQuery('');
      setSearchResults([]);
    }
  };

  // Handle removing a skill
  const handleRemoveSkill = (skillName) => {
    const newSkills = userSkillsWithProficiency.filter(skill => skill.name !== skillName);
    setUserSkillsWithProficiency(newSkills);
    onSkillsChange(newSkills);
  };

  // Handle proficiency change
  const handleProficiencyChange = (skillName, newProficiency) => {
    const newSkills = userSkillsWithProficiency.map(skill => 
      skill.name === skillName ? { ...skill, proficiency: newProficiency } : skill
    );
    setUserSkillsWithProficiency(newSkills);
    onSkillsChange(newSkills);
  };

  // Get skills for selected category
  const getCategorySkills = () => {
    if (selectedCategory === 'all') {
      return Object.values(skillCategories).flatMap(category => category.skills);
    }
    return skillCategories[selectedCategory]?.skills || [];
  };

  // Get proficiency label and color
  const getProficiencyInfo = (proficiency) => {
    return proficiencyLevels.find(level => level.value === proficiency) || proficiencyLevels[1];
  };

  // Get skill category info
  const getSkillCategoryInfo = (skillName) => {
    return getSkillCategory(skillName);
  };

  // Get recommended skills
  const recommendedSkills = showRecommendations ? 
    getRecommendedSkills(userSkillsWithProficiency.map(skill => skill.name), 5) : [];

  return (
    <div className="space-y-6">
      {/* Current Skills */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Mes Compétences ({userSkillsWithProficiency.length})
          </h3>
          <button
            onClick={() => setShowAddSkill(!showAddSkill)}
            className="flex items-center space-x-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
          >
            <PlusIcon className="w-4 h-4" />
            <span>Ajouter</span>
          </button>
        </div>

        {/* User Skills Display */}
        {userSkillsWithProficiency.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {userSkillsWithProficiency.map((skill, index) => {
              const categoryInfo = getSkillCategoryInfo(skill.name);
              const proficiencyInfo = getProficiencyInfo(skill.proficiency);
              
              return (
                <div 
                  key={index}
                  className="bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 p-3 group hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2 flex-1">
                      {categoryInfo && (
                        <span className="text-lg" title={categoryInfo.name}>
                          {categoryInfo.icon}
                        </span>
                      )}
                      <span className="font-medium text-gray-900 dark:text-white text-sm">
                        {skill.name}
                      </span>
                    </div>
                    <button
                      onClick={() => handleRemoveSkill(skill.name)}
                      className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-all duration-200"
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {/* Proficiency Selector */}
                  <select
                    value={skill.proficiency}
                    onChange={(e) => handleProficiencyChange(skill.name, e.target.value)}
                    className="w-full text-xs px-2 py-1 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                    style={{ color: proficiencyInfo.color }}
                  >
                    {proficiencyLevels.map(level => (
                      <option key={level.value} value={level.value}>
                        {level.label}
                      </option>
                    ))}
                  </select>
                  
                  {categoryInfo && (
                    <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      {categoryInfo.name}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
            <SparklesIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 dark:text-gray-300 mb-2">
              Aucune compétence ajoutée
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Ajoutez vos compétences pour obtenir de meilleures recommandations d'emploi
            </p>
          </div>
        )}
      </div>

      {/* Add Skills Section */}
      {showAddSkill && (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-md font-semibold text-gray-900 dark:text-white">
              Ajouter des compétences
            </h4>
            <button
              onClick={() => setShowAddSkill(false)}
              className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative mb-4">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher une compétence..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="mb-4">
              <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Résultats de recherche:
              </h5>
              <div className="flex flex-wrap gap-2">
                {searchResults.map((skill, index) => {
                  const categoryInfo = getSkillCategoryInfo(skill);
                  const isAlreadyAdded = userSkillsWithProficiency.some(userSkill => userSkill.name === skill);
                  
                  return (
                    <button
                      key={index}
                      onClick={() => !isAlreadyAdded && handleAddSkill(skill)}
                      disabled={isAlreadyAdded}
                      className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm border transition-colors ${
                        isAlreadyAdded
                          ? 'bg-green-100 text-green-800 border-green-200 cursor-not-allowed'
                          : 'bg-white hover:bg-blue-50 text-gray-700 border-gray-300 hover:border-blue-300'
                      }`}
                    >
                      {categoryInfo && <span>{categoryInfo.icon}</span>}
                      <span>{skill}</span>
                      {isAlreadyAdded && <CheckIcon className="w-3 h-3" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Category Filter */}
          <div className="mb-4">
            <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Parcourir par catégorie:
            </h5>
            <div className="flex flex-wrap gap-2 mb-3">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300'
                }`}
              >
                Toutes
              </button>
              {Object.entries(skillCategories).map(([categoryName, categoryData]) => (
                <button
                  key={categoryName}
                  onClick={() => setSelectedCategory(categoryName)}
                  className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm border transition-colors ${
                    selectedCategory === categoryName
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300'
                  }`}
                >
                  <span>{categoryData.icon}</span>
                  <span>{categoryName}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Category Skills */}
          {selectedCategory && (
            <div>
              <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {selectedCategory === 'all' ? 'Toutes les compétences:' : `${selectedCategory}:`}
              </h5>
              <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
                {getCategorySkills().map((skill, index) => {
                  const isAlreadyAdded = userSkillsWithProficiency.some(userSkill => userSkill.name === skill);
                  const categoryInfo = getSkillCategoryInfo(skill);
                  
                  return (
                    <button
                      key={index}
                      onClick={() => !isAlreadyAdded && handleAddSkill(skill)}
                      disabled={isAlreadyAdded}
                      className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm border transition-colors ${
                        isAlreadyAdded
                          ? 'bg-green-100 text-green-800 border-green-200 cursor-not-allowed'
                          : 'bg-white hover:bg-blue-50 text-gray-700 border-gray-300 hover:border-blue-300'
                      }`}
                    >
                      {selectedCategory === 'all' && categoryInfo && <span>{categoryInfo.icon}</span>}
                      <span>{skill}</span>
                      {isAlreadyAdded && <CheckIcon className="w-3 h-3" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Recommended Skills */}
      {showRecommendations && recommendedSkills.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
          <div className="flex items-center space-x-2 mb-3">
            <SparklesIcon className="w-5 h-5 text-blue-600" />
            <h4 className="text-md font-semibold text-gray-900 dark:text-white">
              Compétences recommandées
            </h4>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            Basé sur vos compétences actuelles, ces compétences pourraient enrichir votre profil:
          </p>
          <div className="flex flex-wrap gap-2">
            {recommendedSkills.map((skill, index) => {
              const categoryInfo = getSkillCategoryInfo(skill);
              
              return (
                <button
                  key={index}
                  onClick={() => handleAddSkill(skill)}
                  className="flex items-center space-x-1 px-3 py-1 bg-white hover:bg-blue-50 text-gray-700 border border-blue-300 hover:border-blue-400 rounded-full text-sm transition-colors"
                >
                  {categoryInfo && <span>{categoryInfo.icon}</span>}
                  <span>{skill}</span>
                  <PlusIcon className="w-3 h-3" />
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillsSelector;
