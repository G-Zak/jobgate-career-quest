import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { loadUserProfile, saveUserProfile } from '../../../utils/profileUtils';
import { profileApiService } from '../../../services/profileApi';
import EnhancedProfileManager from '../../../components/EnhancedProfileManager';
import {
  UserCircleIcon,
  CogIcon,
  ArrowRightOnRectangleIcon,
  CheckIcon,
  MapPinIcon,
  EnvelopeIcon,
  PencilIcon
} from '@heroicons/react/24/outline';

const CleanProfilePage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [userData, setUserData] = useState(null);
  const [isDataModified, setIsDataModified] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load user profile data
  useEffect(() => {
    const initializeProfile = async () => {
      try {
        setLoading(true);
        
        // Try to load from API first
        if (user) {
          try {
            const apiProfile = await profileApiService.getProfile();
            if (apiProfile) {
              setUserData(apiProfile);
              saveUserProfile(apiProfile, user.id);
              return;
            }
          } catch (apiError) {
            console.log('API profile not available, using local data');
          }
        }
        
        // Fallback to localStorage
        const localProfile = loadUserProfile(user?.id);
        setUserData(localProfile);
        
      } catch (error) {
        console.error('Error loading profile:', error);
        // Create default profile with realistic Moroccan data
        const defaultProfile = {
          id: user?.id || 'default',
          name: user?.name || user?.username || 'Hamza Radi',
          email: user?.email || 'hamzaradi@gmail.com',
          jobTitle: 'Développeur Full Stack',
          about: 'Développeur passionné avec une expertise en technologies web modernes et une forte capacité d\'analyse. Spécialisé dans le développement d\'applications web performantes et l\'optimisation des processus métier.',
          contact: {
            email: user?.email || 'hamzaradi@gmail.com',
            phone: '+212 6 12 34 56 78',
            location: 'Casablanca, Maroc',
            linkedin: 'https://linkedin.com/in/hamza-radi'
          },
          skills: ['JavaScript', 'React', 'Python', 'Django', 'SQL', 'Node.js', 'MongoDB', 'Git'],
          education: [
            {
              id: 1,
              degree: 'Master en Génie Informatique',
              institution: 'École Nationale Supérieure d\'Informatique et d\'Analyse des Systèmes (ENSIAS)',
              location: 'Rabat, Maroc',
              startDate: '2020-09',
              endDate: '2022-06',
              description: 'Spécialisation en développement logiciel et intelligence artificielle. Projet de fin d\'études sur l\'optimisation des algorithmes de recommandation.'
            },
            {
              id: 2,
              degree: 'Licence en Informatique',
              institution: 'Faculté des Sciences et Techniques',
              location: 'Casablanca, Maroc',
              startDate: '2017-09',
              endDate: '2020-06',
              description: 'Formation fondamentale en informatique avec mention Bien. Participation active aux clubs de programmation et hackathons.'
            }
          ],
          experience: [
            {
              id: 1,
              title: 'Développeur Full Stack',
              company: 'TechnoSoft Maroc',
              location: 'Casablanca, Maroc',
              startDate: '2022-07',
              endDate: 'present',
              description: 'Développement d\'applications web avec React et Django. Optimisation des performances et mise en place de solutions d\'intégration continue. Collaboration avec des équipes multidisciplinaires pour livrer des projets de qualité.',
              technologies: ['React', 'Django', 'PostgreSQL', 'Docker', 'AWS']
            },
            {
              id: 2,
              title: 'Stagiaire Développeur',
              company: 'Digital Solutions Morocco',
              location: 'Rabat, Maroc',
              startDate: '2022-02',
              endDate: '2022-06',
              description: 'Stage de fin d\'études axé sur le développement d\'une plateforme de gestion documentaire. Apprentissage des bonnes pratiques de développement et méthodologies agiles.',
              technologies: ['Vue.js', 'Laravel', 'MySQL']
            }
          ],
          projects: [
            {
              id: 1,
              title: 'Plateforme de Recommandation d\'Emplois',
              description: 'Développement d\'un système intelligent de recommandation d\'emplois utilisant des algorithmes d\'apprentissage automatique pour matcher les candidats avec les opportunités.',
              technologies: ['React', 'Python', 'Django', 'Machine Learning', 'PostgreSQL'],
              startDate: '2023-01',
              endDate: '2023-12',
              status: 'completed',
              url: 'https://github.com/hamza-radi/job-recommendation-system'
            },
            {
              id: 2,
              title: 'Application Mobile de Gestion Financière',
              description: 'Application mobile cross-platform pour la gestion des finances personnelles avec fonctionnalités de budgeting et analyse des dépenses.',
              technologies: ['React Native', 'Node.js', 'MongoDB', 'Express'],
              startDate: '2023-06',
              endDate: 'present',
              status: 'in_progress',
              url: 'https://github.com/hamza-radi/finance-app'
            }
          ]
        };
        setUserData(defaultProfile);
      } finally {
        setLoading(false);
      }
    };

    initializeProfile();
  }, [user]);

  const handleSaveChanges = async () => {
    if (!userData || !isDataModified) return;
    
    try {
      // Save to API if available
      if (user) {
        try {
          await profileApiService.updateProfile(userData);
        } catch (apiError) {
          console.log('API save failed, saving locally only');
        }
      }
      
      // Always save locally
      saveUserProfile(userData, userData.id);
      setIsDataModified(false);
      
      // Show success message
      alert('Profile saved successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile. Please try again.');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const openSettings = () => setIsSettingsOpen(true);
  const closeSettings = () => setIsSettingsOpen(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <UserCircleIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Profile Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Unable to load your profile data.</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header / Profile Banner */}
      <div className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            {/* Profile Avatar */}
            <div className="relative">
              <div className="w-32 h-32 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center shadow-2xl border-4 border-white dark:border-gray-800">
                <span className="text-3xl font-semibold text-gray-600 dark:text-gray-300">
                  {userData.name?.split(' ').map(n => n.charAt(0)).join('').toUpperCase() || 'U'}
                </span>
              </div>
              <label className="absolute -bottom-2 -right-2 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full cursor-pointer shadow-lg transition-colors">
                <PencilIcon className="w-4 h-4" />
                <input type="file" className="hidden" accept="image/*" />
              </label>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-white ml-6">
              <h1 className="text-3xl font-bold mb-2">{userData.name || 'Your Name'}</h1>
              <p className="text-xl text-blue-100 dark:text-gray-300 mb-2">{userData.jobTitle || 'Titre Professionnel'}</p>
              <div className="flex items-center space-x-4 text-blue-100 dark:text-gray-300">
                <div className="flex items-center space-x-1">
                  <MapPinIcon className="w-4 h-4" />
                  <span>{userData.contact?.location || 'Location'}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <EnvelopeIcon className="w-4 h-4" />
                  <span>{userData.contact?.email || 'email@example.com'}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              {/* Save Changes Button - Only show when there are unsaved changes */}
              {isDataModified && (
                <button
                  onClick={handleSaveChanges}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-lg"
                >
                  <CheckIcon className="w-5 h-5" />
                  <span>Save Changes</span>
                </button>
              )}
              
              <button
                onClick={openSettings}
                className="p-3 bg-white/10 backdrop-blur-sm text-white rounded-lg hover:bg-white/20 transition-colors"
              >
                <CogIcon className="w-5 h-5" />
              </button>
              
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Enhanced Profile Manager */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <EnhancedProfileManager
          userProfile={userData}
          onUpdateProfile={(updatedProfile) => {
            setUserData(updatedProfile);
            saveUserProfile(updatedProfile, updatedProfile.id);
            setIsDataModified(true);
          }}
        />
      </div>

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-600">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Settings</h3>
                <button
                  onClick={closeSettings}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <PencilIcon className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div className="space-y-3">
                <button className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  Change Password
                </button>
                <button className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  Privacy Settings
                </button>
                <button className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  Notification Preferences
                </button>
                <button className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  Export Data
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  Disconnect
                </button>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-600">
              <button
                onClick={closeSettings}
                className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CleanProfilePage;
