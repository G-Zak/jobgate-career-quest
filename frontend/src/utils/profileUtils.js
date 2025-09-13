// Profile utilities for managing user profile data

export const defaultUserProfile = {
  id: 1,
  name: "Zakaria Guennani",
  email: "zakaria@example.com",
  avatar: "https://i.pravatar.cc/300?img=placeholder",
  level: 3,
  overallScore: 82,
  xpPoints: 2480,
  nextLevelXP: 3000,
  skills: [],
  skillsWithProficiency: [],
  skillAssessments: {},
  languages: ["Français", "Anglais", "Espagnol"],
  about: "Développeur passionné avec plus de 5 ans d'expérience dans le développement d'applications web modernes. Spécialisé en React, Node.js et technologies cloud.",
  resume: null,
  education: [
    {
      school: "École Supérieure de Technologie",
      program: "Master en Ingénierie Logicielle",
      dateRange: "2020 - 2022",
      description: "Spécialisation en développement d'applications web et mobile"
    }
  ],
  experience: [
    {
      title: "Développeur Frontend Senior",
      company: "TechCorp Solutions",
      dateRange: "2022 - Présent",
      description: "Développement d'applications React complexes et optimisation des performances"
    },
    {
      title: "Développeur Full Stack",
      company: "StartupXYZ",
      dateRange: "2020 - 2022",
      description: "Développement full-stack avec React, Node.js et MongoDB"
    }
  ],
  contact: {
    email: "zakaria@example.com",
    phone: "+212 6 12 34 56 78",
    location: "Casablanca, Maroc",
    linkedin: "https://linkedin.com/in/zakaria-guennani",
    website: "https://zakaria.dev"
  },
  bio: "Développeur passionné par les technologies web et l'innovation. Toujours en quête de nouveaux défis et d'opportunités d'apprentissage.",
  preferences: {
    notifications: true,
    darkMode: false,
    language: "fr"
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

export const loadUserProfile = (userId = 1) => {
  try {
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
    return true;
  } catch (error) {
    console.error('Error saving user profile:', error);
    return false;
  }
};

export const updateUserSkills = (userId, skills) => {
  try {
    const profile = loadUserProfile(userId);
    const updatedProfile = {
      ...profile,
      skills: skills,
      updatedAt: new Date().toISOString()
    };
    return saveUserProfile(updatedProfile);
  } catch (error) {
    console.error('Error updating user skills:', error);
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
