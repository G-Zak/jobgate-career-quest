// Profile utility functions for saving and loading user profile data

export const defaultUserProfile = {
  name: "John Doe",
  email: "john.doe@example.com",
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
  about: "Développeur passionné avec plus de 5 ans d'expérience dans le développement d'applications web modernes. Spécialisé en React, Node.js et technologies cloud.",
  contact: {
    email: "john.doe@example.com",
    phone: "+33 6 12 34 56 78",
    linkedin: "linkedin.com/in/johndoe"
  },
  languages: ["Français", "Anglais", "Espagnol"],
  skills: ["React", "JavaScript", "Node.js", "Python", "TypeScript", "MongoDB", "PostgreSQL", "AWS"],
  skillAssessments: {
    "React": { score: 85, level: "Avancé", verified: true },
    "JavaScript": { score: 90, level: "Expert", verified: true },
    "Node.js": { score: 78, level: "Intermédiaire", verified: false },
    "Python": { score: 72, level: "Intermédiaire", verified: true }
  },
  education: [
    {
      school: "École Polytechnique",
      program: "Master en Informatique",
      dateRange: "2018 - 2020",
      description: "Spécialisation en développement logiciel et intelligence artificielle"
    },
    {
      school: "Université Paris-Saclay",
      program: "Licence en Informatique",
      dateRange: "2015 - 2018",
      description: "Formation complète en informatique fondamentale et appliquée"
    }
  ],
  experience: [
    {
      title: "Développeur Full Stack Senior",
      company: "TechCorp",
      dateRange: "Jan 2021 - Présent",
      description: "Développement d'applications web modernes avec React et Node.js. Leadership technique sur des projets complexes."
    },
    {
      title: "Développeur Frontend",
      company: "WebSolutions",
      dateRange: "Jun 2020 - Dec 2020",
      description: "Création d'interfaces utilisateur réactives et optimisées. Collaboration avec l'équipe UX/UI."
    }
  ],
  resume: "CV_John_Doe_2025.pdf"
};

export const saveUserProfile = (profileData) => {
  try {
    localStorage.setItem('userProfile', JSON.stringify(profileData));
    return true;
  } catch (error) {
    console.error('Error saving profile:', error);
    return false;
  }
};

export const loadUserProfile = () => {
  try {
    const saved = localStorage.getItem('userProfile');
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.error('Error loading profile:', error);
    return null;
  }
};

export const clearUserProfile = () => {
  try {
    localStorage.removeItem('userProfile');
    return true;
  } catch (error) {
    console.error('Error clearing profile:', error);
    return false;
  }
};
