import React, { useState, useEffect } from 'react';
import JobRecommendations from './JobRecommendations';
import { 
  AdjustmentsHorizontalIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  SparklesIcon,
  ExclamationTriangleIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';
import { loadUserProfile } from '../../../utils/profileUtils';

const JobRecommendationsPage = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [profileUpdateTime, setProfileUpdateTime] = useState(Date.now());

  const [filters, setFilters] = useState({
    location: "",
    jobType: "",
    remote: false,
    salaryMin: "",
    experience: ""
  });

  const [showFilters, setShowFilters] = useState(false);

  // Load user profile
  useEffect(() => {
    const profile = loadUserProfile();
    setUserProfile(profile);
  }, []);

  // Listen for profile changes
  useEffect(() => {
    const handleProfileUpdate = () => {
      const updatedProfile = loadUserProfile();
      setUserProfile(updatedProfile);
      setProfileUpdateTime(Date.now());
    };

    // Listen for storage changes
    window.addEventListener('storage', handleProfileUpdate);
    
    // Check for changes periodically
    const interval = setInterval(() => {
      const currentProfile = loadUserProfile();
      if (currentProfile && JSON.stringify(currentProfile) !== JSON.stringify(userProfile)) {
        setUserProfile(currentProfile);
        setProfileUpdateTime(Date.now());
      }
    }, 2000);

    return () => {
      window.removeEventListener('storage', handleProfileUpdate);
      clearInterval(interval);
    };
  }, [userProfile]);

  const userSkills = userProfile?.skillsWithProficiency?.map(skill => skill.name) || userProfile?.skills || [];
  const hasSkills = userSkills.length > 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Offres Recommandées
            </h1>
            {hasSkills && (
              <div className="flex items-center space-x-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 px-2 py-1 rounded-full text-sm">
                <SparklesIcon className="w-4 h-4" />
                <span>IA Activée</span>
              </div>
            )}
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {hasSkills 
              ? `Recommandations basées sur vos ${userSkills.length} compétence${userSkills.length > 1 ? 's' : ''}`
              : "Complétez votre profil pour obtenir des recommandations personnalisées"
            }
          </p>
        </div>

        {/* Profile Warning */}
        {!hasSkills && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600 dark:text-yellow-500 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                  Profil incomplet
                </h3>
                <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                  Ajoutez vos compétences dans votre profil pour obtenir des recommandations d'emploi personnalisées et précises.
                </p>
                <button 
                  onClick={() => window.location.href = '/profile'}
                  className="mt-2 bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Compléter mon profil
                </button>
              </div>
            </div>
          </div>
        )}

        {/* User Profile Summary */}
        {userProfile && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Votre Profil de Recherche
              </h2>
              <button 
                onClick={() => window.location.href = '/profile'}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium flex items-center space-x-1"
              >
                <UserCircleIcon className="w-4 h-4" />
                <span>Modifier</span>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Compétences ({userSkills.length})
                </label>
                <div className="flex flex-wrap gap-2">
                  {userSkills.slice(0, 3).map((skill, index) => (
                    <span 
                      key={index}
                      className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 text-xs px-2 py-1 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                  {userSkills.length > 3 && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      +{userSkills.length - 3} autres
                    </span>
                  )}
                  {userSkills.length === 0 && (
                    <span className="text-xs text-red-500 dark:text-red-400">
                      Aucune compétence ajoutée
                    </span>
                  )}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Localisation préférée
                </label>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {userProfile.location || "Non spécifiée"}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Expérience
                </label>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {userProfile.experienceLevel || "Non spécifiée"}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Filters Bar */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Rechercher une offre..."
                  className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              >
                <FunnelIcon className="w-4 h-4" />
                <span>Filtres</span>
              </button>
            </div>
            
            <button className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
              <AdjustmentsHorizontalIcon className="w-4 h-4" />
              <span className="text-sm">Ajuster les recommandations</span>
            </button>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Ville
                  </label>
                  <select 
                    value={filters.location}
                    onChange={(e) => setFilters({...filters, location: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="">Toutes les villes</option>
                    <option value="Casablanca">Casablanca</option>
                    <option value="Rabat">Rabat</option>
                    <option value="Marrakech">Marrakech</option>
                    <option value="Fès">Fès</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Type de contrat
                  </label>
                  <select 
                    value={filters.jobType}
                    onChange={(e) => setFilters({...filters, jobType: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="">Tous les types</option>
                    <option value="CDI">CDI</option>
                    <option value="CDD">CDD</option>
                    <option value="Stage">Stage</option>
                    <option value="Freelance">Freelance</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Expérience
                  </label>
                  <select 
                    value={filters.experience}
                    onChange={(e) => setFilters({...filters, experience: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="">Toute expérience</option>
                    <option value="0-1 an">0-1 an</option>
                    <option value="1-3 ans">1-3 ans</option>
                    <option value="3-5 ans">3-5 ans</option>
                    <option value="5+ ans">5+ ans</option>
                  </select>
                </div>
                
                <div className="flex items-end">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={filters.remote}
                      onChange={(e) => setFilters({...filters, remote: e.target.checked})}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Télétravail uniquement
                    </span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Job Recommendations */}
        <JobRecommendations 
          userId={userProfile?.id}
          userSkills={userSkills}
          userLocation={userProfile?.location}
          maxJobs={12}
          realTimeUpdate={true}
        />
      </div>
    </div>
  );
};

export default JobRecommendationsPage;
