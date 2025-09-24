// Profile utilities for managing user profile data

export const defaultUserProfile = {
  id: null,
  name: "Utilisateur",
  email: "user@example.com",
  avatar: "https://i.pravatar.cc/300?img=placeholder",
  level: 1,
  overallScore: 0,
  xpPoints: 0,
  nextLevelXP: 1000,
  skills: [],
  skillsWithProficiency: [],
  skillAssessments: {},
  languages: ["Français"],
  about: "Profil utilisateur",
  resume: null,
  education: [],
  experience: [],
  contact: {
    email: "user@example.com",
    phone: "",
    location: "",
    linkedin: "",
    website: ""
  },
  bio: "Profil utilisateur",
  preferences: {
    notifications: true,
    darkMode: false,
    language: "fr"
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

export const loadUserProfile = (userId = null) => {
  try {
    // If no userId provided, try to find any saved profile
    if (!userId) {
      // Look for any userProfile_* key in localStorage
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('userProfile_')) {
          const saved = localStorage.getItem(key);
          if (saved) {
            const profile = JSON.parse(saved);
            if (profile && profile.id) {
              return profile;
            }
          }
        }
      }
      return defaultUserProfile;
    }

    const saved = localStorage.getItem(`userProfile_${userId}`);
    if (saved) {
      return JSON.parse(saved);
    }
    return defaultUserProfile;
  } catch (error) {
    console.error('Error loading user profile:', error);
    return defaultUserProfile;
  }
};

export const saveUserProfile = (profile) => {
  try {
    const profileToSave = {
      ...profile,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(`userProfile_${profile.id}`, JSON.stringify(profileToSave));

    // Trigger profile update event for real-time updates
    window.dispatchEvent(new CustomEvent('profileUpdated', {
      detail: { profile: profileToSave }
    }));

    return true;
  } catch (error) {
    console.error('Error saving user profile:', error);
    return false;
  }
};

export const updateUserSkills = (userId, skills, skillsWithProficiency = null) => {
  try {
    const profile = loadUserProfile(userId);
    const updatedProfile = {
      ...profile,
      skills: skills,
      skillsWithProficiency: skillsWithProficiency || profile.skillsWithProficiency || [],
      updatedAt: new Date().toISOString()
    };
    return saveUserProfile(updatedProfile);
  } catch (error) {
    console.error('Error updating user skills:', error);
    return false;
  }
};

// Enhanced function to update skills with proficiency
export const updateUserSkillsWithProficiency = async (userId, skillsWithProficiency) => {
  try {
    console.log('🔍 updateUserSkillsWithProficiency - userId:', userId);
    console.log('🔍 updateUserSkillsWithProficiency - skillsWithProficiency:', skillsWithProficiency);

    const profile = loadUserProfile(userId);
    console.log('🔍 updateUserSkillsWithProficiency - loaded profile:', profile);

    const skillNames = skillsWithProficiency.map(skill => skill.name);
    const updatedProfile = {
      ...profile,
      skills: skillNames,
      skillsWithProficiency: skillsWithProficiency,
      updatedAt: new Date().toISOString()
    };

    console.log('🔍 updateUserSkillsWithProficiency - updated profile:', updatedProfile);

    // Save to localStorage first (immediate)
    const localSaveSuccess = saveUserProfile(updatedProfile);
    console.log('🔍 updateUserSkillsWithProficiency - localSaveSuccess:', localSaveSuccess);

    // Also save to database (async)
    try {
      const { profileApiService } = await import('../services/profileApi.js');
      await profileApiService.updateUserSkills(userId || 1, skillNames, skillsWithProficiency);
      console.log('Skills with proficiency saved to database successfully');
    } catch (dbError) {
      console.warn('Database save failed, but localStorage save succeeded:', dbError);
    }

    return localSaveSuccess;
  } catch (error) {
    console.error('Error updating user skills with proficiency:', error);
    return false;
  }
};

export const addUserSkill = (userId, skill) => {
  try {
    const profile = loadUserProfile(userId);
    const skills = profile.skills || [];

    if (!skills.find(s => s.id === skill.id)) {
      const updatedSkills = [...skills, skill];
      return updateUserSkills(userId, updatedSkills);
    }
    return true; // Skill already exists
  } catch (error) {
    console.error('Error adding user skill:', error);
    return false;
  }
};

export const removeUserSkill = (userId, skillId) => {
  try {
    const profile = loadUserProfile(userId);
    const skills = profile.skills || [];
    const updatedSkills = skills.filter(skill => skill.id !== skillId);
    return updateUserSkills(userId, updatedSkills);
  } catch (error) {
    console.error('Error removing user skill:', error);
    return false;
  }
};

export const updateUserPreferences = (userId, preferences) => {
  try {
    const profile = loadUserProfile(userId);
    const updatedProfile = {
      ...profile,
      preferences: {
        ...profile.preferences,
        ...preferences
      },
      updatedAt: new Date().toISOString()
    };
    return saveUserProfile(updatedProfile);
  } catch (error) {
    console.error('Error updating user preferences:', error);
    return false;
  }
};

export const getCurrentUserId = () => {
  try {
    const profile = loadUserProfile();
    return profile?.id || null;
  } catch (error) {
    console.error('Error getting current user ID:', error);
    return null;
  }
};

export const clearUserProfile = () => {
  try {
    // Clear all userProfile_* keys
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (key && key.startsWith('userProfile_')) {
        localStorage.removeItem(key);
      }
    }
    return true;
  } catch (error) {
    console.error('Error clearing user profile:', error);
    return false;
  }
};
