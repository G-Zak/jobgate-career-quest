// Predefined skills system for JobGate Career Quest
// This file contains all available skills organized by categories

export const skillCategories = {
  "Frontend Development": {
    icon: "",
    color: "#3B82F6",
    skills: [
      "React", "Vue.js", "Angular", "JavaScript", "TypeScript",
      "HTML5", "CSS3", "Sass", "Less", "Tailwind CSS",
      "Bootstrap", "Material-UI", "Ant Design", "Chakra UI",
      "Redux", "Vuex", "MobX", "Webpack", "Vite", "Parcel"
    ]
  },
  "Backend Development": {
    icon: "",
    color: "#10B981",
    skills: [
      "Node.js", "Django", "Flask", "FastAPI", "Express.js",
      "Spring Boot", "Laravel", "Ruby on Rails", "ASP.NET",
      "PHP", "Python", "Java", "C#", "Go", "Rust",
      "Microservices", "REST API", "WebSocket"
    ]
  },
  "Mobile Development": {
    icon: "",
    color: "#8B5CF6",
    skills: [
      "React Native", "Flutter", "Swift", "Kotlin", "Ionic",
      "Xamarin", "Cordova", "Android", "iOS", "Unity",
      "Firebase", "Push Notifications", "App Store", "Google Play"
    ]
  },
  "Database & Data": {
    icon: "",
    color: "#F59E0B",
    skills: [
      "MySQL", "PostgreSQL", "MongoDB", "Redis", "SQLite",
      "Oracle", "SQL Server", "Cassandra", "Elasticsearch",
      "Neo4j", "DynamoDB", "Firebase Firestore", "GraphQL",
      "Data Modeling", "Database Design", "Query Optimization"
    ]
  },
  "DevOps & Cloud": {
    icon: "",
    color: "#06B6D4",
    skills: [
      "Docker", "Kubernetes", "AWS", "Azure", "Google Cloud",
      "Jenkins", "GitLab CI", "GitHub Actions", "Terraform",
      "Ansible", "Chef", "Puppet", "Nginx", "Apache",
      "Load Balancing", "Monitoring", "Logging", "Security"
    ]
  },
  "Data Science & AI": {
    icon: "",
    color: "#EC4899",
    skills: [
      "Python", "R", "Pandas", "NumPy", "Scikit-learn",
      "TensorFlow", "PyTorch", "Keras", "OpenCV", "NLTK",
      "Jupyter", "Apache Spark", "Hadoop", "Tableau",
      "Power BI", "Machine Learning", "Deep Learning", "NLP"
    ]
  },
  "UI/UX Design": {
    icon: "",
    color: "#EF4444",
    skills: [
      "Figma", "Adobe XD", "Sketch", "InVision", "Zeplin",
      "Adobe Photoshop", "Adobe Illustrator", "Principle",
      "Framer", "Prototyping", "User Research", "Wireframing",
      "Information Architecture", "Interaction Design", "Visual Design"
    ]
  },
  "Project Management": {
    icon: "",
    color: "#059669",
    skills: [
      "Agile", "Scrum", "Kanban", "JIRA", "Trello", "Asana",
      "Monday.com", "Microsoft Project", "Gantt Charts",
      "Risk Management", "Budget Management", "Team Leadership",
      "Stakeholder Management", "Requirements Analysis"
    ]
  },
  "Testing & QA": {
    icon: "",
    color: "#7C3AED",
    skills: [
      "Jest", "Cypress", "Selenium", "Playwright", "Postman",
      "Unit Testing", "Integration Testing", "E2E Testing",
      "Performance Testing", "Security Testing", "Manual Testing",
      "Test Automation", "Bug Tracking", "Quality Assurance"
    ]
  },
  "Security": {
    icon: "",
    color: "#DC2626",
    skills: [
      "Cybersecurity", "Penetration Testing", "OWASP", "SSL/TLS",
      "Authentication", "Authorization", "Encryption", "Firewall",
      "Intrusion Detection", "Vulnerability Assessment", "SIEM",
      "ISO 27001", "GDPR", "Compliance", "Risk Assessment"
    ]
  }
};

// Get all skills as a flat array
export const getAllSkills = () => {
  return Object.values(skillCategories).flatMap(category => category.skills);
};

// Get skills by category
export const getSkillsByCategory = (categoryName) => {
  return skillCategories[categoryName]?.skills || [];
};

// Search skills by query
export const searchSkills = (query) => {
  if (!query) return [];

  const searchTerm = query.toLowerCase();
  const allSkills = getAllSkills();

  return allSkills.filter(skill =>
    skill.toLowerCase().includes(searchTerm)
  );
};

// Get category for a specific skill
export const getSkillCategory = (skillName) => {
  for (const [categoryName, categoryData] of Object.entries(skillCategories)) {
    if (categoryData.skills.includes(skillName)) {
      return {
        name: categoryName,
        icon: categoryData.icon,
        color: categoryData.color
      };
    }
  }
  return null;
};

// Get recommended skills based on existing skills
export const getRecommendedSkills = (userSkills, limit = 5) => {
  if (!userSkills || userSkills.length === 0) return [];

  // Find categories user is already working in
  const userCategories = new Set();
  userSkills.forEach(skill => {
    const category = getSkillCategory(skill);
    if (category) {
      userCategories.add(category.name);
    }
  });

  // Get skills from those categories that user doesn't have
  const recommendations = [];
  for (const categoryName of userCategories) {
    const categorySkills = getSkillsByCategory(categoryName);
    const newSkills = categorySkills.filter(skill => !userSkills.includes(skill));
    recommendations.push(...newSkills);
  }

  // Remove duplicates and limit results
  return [...new Set(recommendations)].slice(0, limit);
};

// Skill proficiency levels
export const proficiencyLevels = [
  { value: "beginner", label: "Débutant", color: "#EF4444" },
  { value: "intermediate", label: "Intermédiaire", color: "#F59E0B" },
  { value: "advanced", label: "Avancé", color: "#10B981" },
  { value: "expert", label: "Expert", color: "#8B5CF6" }
];

// Get proficiency color
export const getProficiencyColor = (level) => {
  const proficiency = proficiencyLevels.find(p => p.value === level);
  return proficiency ? proficiency.color : "#6B7280";
};

export default skillCategories;
