// JobGate Career Quest - Job Offers Data with Predefined Skills
// This file contains sample job offers with skills limited to our predefined skills system

import { getAllSkills } from './predefinedSkills';

export const jobOffers = [
  {
    id: 1,
    title: "Développeur Frontend React",
    company: "TechnoSoft Solutions",
    location: "Casablanca, Maroc",
    type: "CDI",
    experience: "2-4 ans",
    salary: "25,000 - 35,000 MAD",
    remote: true,
    tags: ["React", "JavaScript", "TypeScript", "HTML5", "CSS3", "Tailwind CSS"],
    logo: "TS",
    logoColor: "#3B82F6",
    description: "Nous recherchons un développeur Frontend passionné pour rejoindre notre équipe dynamique. Vous travaillerez sur des projets innovants utilisant les dernières technologies React.",
    requirements: [
      "Maîtrise de React et JavaScript ES6+",
      "Expérience avec TypeScript",
      "Connaissance de Tailwind CSS ou similaire",
      "Expérience avec Git et méthodologies Agile"
    ],
    benefits: [
      "Télétravail flexible",
      "Assurance santé",
      "Formation continue",
      "Équipement fourni"
    ],
    posted: "2025-09-08",
    deadline: "2025-10-08",
    status: "active"
  },
  {
    id: 2,
    title: "Développeur Backend Django",
    company: "JOBGATE",
    location: "Rabat, Maroc",
    type: "Stage",
    experience: "0-1 an",
    salary: "3,000 - 5,000 MAD",
    remote: true,
    tags: ["Django", "Python", "PostgreSQL", "REST API", "Git"],
    logo: "JG",
    logoColor: "#10B981",
    description: "Stage de 6 mois pour développer des API robustes avec Django. Opportunité d'apprendre et de contribuer à une plateforme de recrutement innovante.",
    requirements: [
      "Bases solides en Python",
      "Connaissances de Django ou frameworks similaires",
      "Compréhension des bases de données relationnelles",
      "Motivation et envie d'apprendre"
    ],
    benefits: [
      "Télétravail partiel",
      "Mentoring",
      "Certification de stage",
      "Possibilité d'embauche"
    ],
    posted: "2025-09-09",
    deadline: "2025-09-30",
    status: "active"
  },
  {
    id: 3,
    title: "Ingénieur DevOps",
    company: "CloudTech Morocco",
    location: "Casablanca, Maroc",
    type: "CDI",
    experience: "3-5 ans",
    salary: "40,000 - 55,000 MAD",
    remote: false,
    tags: ["Docker", "Kubernetes", "AWS", "Jenkins", "Linux", "Ansible"],
    logo: "CT",
    logoColor: "#8B5CF6",
    description: "Rejoignez notre équipe DevOps pour automatiser et optimiser nos infrastructures cloud. Vous travaillerez avec des technologies de pointe dans un environnement stimulant.",
    requirements: [
      "Expérience avec Docker et Kubernetes",
      "Maîtrise d'AWS ou Azure",
      "Connaissance des pipelines CI/CD",
      "Scripting (Bash, Python)"
    ],
    benefits: [
      "Salaire compétitif",
      "Formations AWS",
      "Assurance famille",
      "Bonus performance"
    ],
    posted: "2025-09-07",
    deadline: "2025-10-15",
    status: "active"
  },
  {
    id: 4,
    title: "Data Scientist",
    company: "AI Analytics Lab",
    location: "Casablanca, Maroc",
    type: "CDI",
    experience: "2-4 ans",
    salary: "30,000 - 45,000 MAD",
    remote: true,
    tags: ["Python", "Machine Learning", "TensorFlow", "Pandas", "NumPy", "Jupyter"],
    logo: "AI",
    logoColor: "#F59E0B",
    description: "Analysez des données complexes et développez des modèles prédictifs pour nos clients. Utilisez l'IA pour résoudre des problèmes business concrets.",
    requirements: [
      "Master en Data Science ou équivalent",
      "Maîtrise de Python et ses librairies",
      "Expérience avec TensorFlow/PyTorch",
      "Compétences en visualisation de données"
    ],
    benefits: [
      "Télétravail 100%",
      "Matériel haute performance",
      "Conférences tech",
      "Stock options"
    ],
    posted: "2025-09-06",
    deadline: "2025-10-20",
    status: "active"
  },
  {
    id: 5,
    title: "Designer UX/UI",
    company: "Creative Digital Agency",
    location: "Marrakech, Maroc",
    type: "Freelance",
    experience: "1-3 ans",
    salary: "15,000 - 25,000 MAD",
    remote: true,
    tags: ["Figma", "Adobe XD", "Prototyping", "User Research", "Adobe Photoshop"],
    logo: "CD",
    logoColor: "#EF4444",
    description: "Créez des expériences utilisateur exceptionnelles pour nos clients. Travaillez sur des projets variés allant des sites web aux applications mobiles.",
    requirements: [
      "Portfolio démontrant vos compétences UX/UI",
      "Maîtrise de Figma et Adobe Creative Suite",
      "Connaissance des principes de design thinking",
      "Expérience en recherche utilisateur"
    ],
    benefits: [
      "Flexibilité horaire",
      "Projets variés",
      "Collaboration internationale",
      "Formation continue"
    ],
    posted: "2025-09-05",
    deadline: "2025-10-05",
    status: "active"
  },
  {
    id: 6,
    title: "Administrateur Systèmes Linux",
    company: "SecureNet Solutions",
    location: "Fès, Maroc",
    type: "CDI",
    experience: "3-6 ans",
    salary: "28,000 - 38,000 MAD",
    remote: false,
    tags: ["Linux", "Ansible", "Nginx", "Monitoring", "Security", "Bash"],
    logo: "SN",
    logoColor: "#06B6D4",
    description: "Administrez et sécurisez nos infrastructures Linux. Vous serez responsable de la haute disponibilité de nos systèmes critiques.",
    requirements: [
      "Expertise en administration Linux",
      "Connaissance d'Ansible ou Puppet",
      "Expérience en monitoring (Nagios, Zabbix)",
      "Compétences en sécurité système"
    ],
    benefits: [
      "Prime d'astreinte",
      "Formation certifiante",
      "Mutuelle famille",
      "Congés flexibles"
    ],
    posted: "2025-09-04",
    deadline: "2025-10-10",
    status: "active"
  },
  {
    id: 7,
    title: "Développeur Mobile Flutter",
    company: "MobiApp Studios",
    location: "Agadir, Maroc",
    type: "CDI",
    experience: "1-3 ans",
    salary: "22,000 - 32,000 MAD",
    remote: true,
    tags: ["Flutter", "Dart", "Firebase", "Android", "iOS"],
    logo: "MA",
    logoColor: "#8B5CF6",
    description: "Développez des applications mobiles cross-platform avec Flutter. Travaillez sur des projets innovants pour des startups en croissance.",
    requirements: [
      "Expérience solide en Flutter/Dart",
      "Connaissance de Firebase",
      "Compréhension des guidelines iOS/Android",
      "Expérience avec les API REST"
    ],
    benefits: [
      "Télétravail hybride",
      "Matériel mobile fourni",
      "Participation aux bénéfices",
      "Événements team building"
    ],
    posted: "2025-09-03",
    deadline: "2025-10-03",
    status: "active"
  },
  {
    id: 8,
    title: "Analyste Cybersécurité",
    company: "CyberGuard Morocco",
    location: "Casablanca, Maroc",
    type: "CDI",
    experience: "2-5 ans",
    salary: "35,000 - 50,000 MAD",
    remote: false,
    tags: ["Cybersecurity", "Penetration Testing", "Firewall", "Security", "Risk Assessment"],
    logo: "CG",
    logoColor: "#DC2626",
    description: "Protégez nos clients contre les menaces cyber. Analysez les incidents de sécurité et renforcez les défenses de nos infrastructures.",
    requirements: [
      "Certifications en cybersécurité (CISSP, CEH)",
      "Expérience avec les outils SIEM",
      "Connaissance des frameworks de sécurité",
      "Compétences en forensique numérique"
    ],
    benefits: [
      "Primes de performance",
      "Formations spécialisées",
      "Certification payée",
      "Assurance premium"
    ],
    posted: "2025-09-02",
    deadline: "2025-10-25",
    status: "active"
  },
  {
    id: 9,
    title: "Chef de Projet Digital",
    company: "InnovateTech",
    location: "Rabat, Maroc",
    type: "CDI",
    experience: "4-7 ans",
    salary: "45,000 - 60,000 MAD",
    remote: true,
    tags: ["Agile", "Scrum", "JIRA", "Team Leadership", "Stakeholder Management"],
    logo: "IT",
    logoColor: "#059669",
    description: "Dirigez des projets digitaux ambitieux pour nos clients. Coordonnez des équipes multidisciplinaires et assurez la livraison de solutions innovantes.",
    requirements: [
      "Expérience en gestion de projets digitaux",
      "Certification PMP ou Scrum Master",
      "Maîtrise des outils de gestion de projet",
      "Leadership et communication"
    ],
    benefits: [
      "Voiture de fonction",
      "Bonus objectifs",
      "Formation management",
      "Package famille"
    ],
    posted: "2025-09-01",
    deadline: "2025-10-30",
    status: "active"
  },
  {
    id: 10,
    title: "Développeur Full Stack",
    company: "WebCraft Solutions",
    location: "Tanger, Maroc",
    type: "CDI",
    experience: "3-5 ans",
    salary: "32,000 - 42,000 MAD",
    remote: true,
    tags: ["React", "Node.js", "MongoDB", "Express.js", "JavaScript", "REST API"],
    logo: "WC",
    logoColor: "#7C3AED",
    description: "Développez des applications web complètes de A à Z. Travaillez avec des technologies modernes dans une équipe passionnée et créative.",
    requirements: [
      "Maîtrise de React et Node.js",
      "Expérience avec MongoDB ou PostgreSQL",
      "Connaissance des API REST/GraphQL",
      "Compétences en architecture logicielle"
    ],
    benefits: [
      "Télétravail flexible",
      "Équipement dernière génération",
      "Budget formation 5000 MAD/an",
      "Congés illimités"
    ],
    posted: "2025-08-30",
    deadline: "2025-11-15",
    status: "active"
  },
  {
    id: 11,
    title: "Ingénieur QA Automation",
    company: "TestPro Solutions",
    location: "Casablanca, Maroc",
    type: "CDI",
    experience: "2-4 ans",
    salary: "27,000 - 37,000 MAD",
    remote: true,
    tags: ["Selenium", "Jest", "Cypress", "Test Automation", "Quality Assurance", "JavaScript"],
    logo: "TP",
    logoColor: "#7C3AED",
    description: "Automatisez les tests et assurez la qualité de nos applications web. Travaillez avec des outils modernes dans un environnement agile.",
    requirements: [
      "Expérience en automatisation de tests",
      "Maîtrise de Selenium, Cypress ou Jest",
      "Connaissance des méthodologies Agile",
      "Compétences en scripting JavaScript/Python"
    ],
    benefits: [
      "Formation certifiante",
      "Télétravail partiel",
      "Prime de performance",
      "Événements tech"
    ],
    posted: "2025-09-01",
    deadline: "2025-10-15",
    status: "active"
  },
  {
    id: 12,
    title: "Développeur Vue.js",
    company: "FrontEnd Masters",
    location: "Marrakech, Maroc",
    type: "CDI",
    experience: "2-5 ans",
    salary: "26,000 - 38,000 MAD",
    remote: true,
    tags: ["Vue.js", "JavaScript", "TypeScript", "Vuex", "HTML5", "CSS3"],
    logo: "FM",
    logoColor: "#10B981",
    description: "Développez des interfaces utilisateur modernes avec Vue.js. Rejoignez une équipe passionnée par l'innovation frontend.",
    requirements: [
      "Solide expérience en Vue.js",
      "Maîtrise de JavaScript/TypeScript",
      "Connaissance de Vuex pour la gestion d'état",
      "Expérience avec les outils de build modernes"
    ],
    benefits: [
      "Télétravail 100%",
      "Formation Vue.js avancée",
      "Matériel fourni",
      "Flexibilité horaire"
    ],
    posted: "2025-08-28",
    deadline: "2025-10-20",
    status: "active"
  }
];

// Job categories for filtering
export const jobCategories = [
  "Développement Web",
  "Mobile",
  "Data Science",
  "DevOps",
  "Cybersécurité",
  "Design",
  "Gestion de Projet",
  "Systèmes",
  "Intelligence Artificielle",
  "Cloud Computing"
];

// Job types
export const jobTypes = [
  "CDI",
  "CDD", 
  "Stage",
  "Freelance",
  "Temps partiel",
  "Alternance"
];

// Cities in Morocco
export const moroccanCities = [
  "Casablanca",
  "Rabat",
  "Fès",
  "Marrakech",
  "Agadir",
  "Tanger",
  "Meknès",
  "Oujda",
  "Kénitra",
  "Tétouan",
  "Safi",
  "Mohammedia",
  "El Jadida",
  "Beni Mellal",
  "Nador"
];

// Popular tech skills/tags
export const techSkills = [
  // Frontend
  "React", "Vue.js", "Angular", "JavaScript", "TypeScript", "HTML5", "CSS3", "Tailwind CSS", "Bootstrap", "Sass",
  
  // Backend
  "Node.js", "Django", "FastAPI", "Express.js", "Spring Boot", "Laravel", "Ruby on Rails", "ASP.NET",
  
  // Mobile
  "Flutter", "React Native", "Swift", "Kotlin", "Ionic", "Xamarin",
  
  // Databases
  "PostgreSQL", "MySQL", "MongoDB", "Redis", "Elasticsearch", "Oracle", "SQLite",
  
  // Cloud & DevOps
  "Docker", "Kubernetes", "AWS", "Azure", "Google Cloud", "Jenkins", "GitLab CI", "Terraform", "Ansible",
  
  // Data & AI
  "Python", "TensorFlow", "PyTorch", "Pandas", "NumPy", "Scikit-learn", "Apache Spark", "Hadoop",
  
  // Other
  "Git", "REST API", "GraphQL", "Microservices", "Agile", "Scrum", "Linux", "Nginx", "Apache"
];

// Utility functions
export const getJobById = (id) => {
  return jobOffers.find(job => job.id === id);
};

export const getJobsByCompany = (company) => {
  return jobOffers.filter(job => job.company.toLowerCase().includes(company.toLowerCase()));
};

export const getJobsByLocation = (location) => {
  return jobOffers.filter(job => job.location.toLowerCase().includes(location.toLowerCase()));
};

export const getJobsByType = (type) => {
  return jobOffers.filter(job => job.type === type);
};

export const getJobsBySkill = (skill) => {
  return jobOffers.filter(job => 
    job.tags.some(tag => tag.toLowerCase().includes(skill.toLowerCase()))
  );
};

export const getActiveJobs = () => {
  return jobOffers.filter(job => job.status === 'active');
};

export const getRecentJobs = (days = 7) => {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  
  return jobOffers.filter(job => {
    const postedDate = new Date(job.posted);
    return postedDate >= cutoffDate && job.status === 'active';
  });
};

export const searchJobs = (query) => {
  const searchTerm = query.toLowerCase();
  return jobOffers.filter(job => 
    job.title.toLowerCase().includes(searchTerm) ||
    job.company.toLowerCase().includes(searchTerm) ||
    job.description.toLowerCase().includes(searchTerm) ||
    job.tags.some(tag => tag.toLowerCase().includes(searchTerm))
  );
};

// Sample function to generate a new job offer
export const createJobOffer = (jobData) => {
  const newId = Math.max(...jobOffers.map(job => job.id)) + 1;
  const newJob = {
    id: newId,
    posted: new Date().toISOString().split('T')[0],
    status: 'active',
    ...jobData
  };
  
  jobOffers.push(newJob);
  return newJob;
};

export default jobOffers;
