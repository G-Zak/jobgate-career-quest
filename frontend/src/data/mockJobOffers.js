/**
 * Mock job offers data for fallback when database is empty
 * This ensures the recommendation system always has data to work with
 */

export const mockJobOffers = [
    {
        id: 1,
        title: 'Senior Python Developer',
        company: 'TechCorp Inc.',
        location: 'Casablanca, Morocco',
        city: 'Casablanca',
        description: 'We are looking for a senior Python developer with Django experience to join our team. You will work on building scalable web applications and APIs.',
        requirements: '5+ years of Python experience, Django framework knowledge, REST API development, database design experience',
        job_type: 'full-time',
        seniority: 'senior',
        salary_min: 15000,
        salary_max: 25000,
        salary_currency: 'MAD',
        remote: true,
        status: 'active',
        posted: new Date().toISOString(),
        required_skills: [
            { id: 1, name: 'Python', category: 'programming' },
            { id: 2, name: 'Django', category: 'backend' },
            { id: 3, name: 'REST API', category: 'backend' },
            { id: 4, name: 'PostgreSQL', category: 'database' }
        ],
        preferred_skills: [
            { id: 5, name: 'Docker', category: 'devops' },
            { id: 6, name: 'AWS', category: 'devops' },
            { id: 7, name: 'Git', category: 'other' }
        ],
        tags: ['Python', 'Django', 'Backend', 'API', 'PostgreSQL'],
        experience_required: '5+ years',
        education_required: 'Bachelor\'s degree in Computer Science or related field'
    },
    {
        id: 2,
        title: 'React Frontend Developer',
        company: 'StartupXYZ',
        location: 'Rabat, Morocco',
        city: 'Rabat',
        description: 'Join our frontend team to build amazing user interfaces with React. Work on modern web applications and mobile-responsive designs.',
        requirements: '3+ years of React experience, JavaScript proficiency, modern frontend tools, UI/UX understanding',
        job_type: 'full-time',
        seniority: 'mid',
        salary_min: 12000,
        salary_max: 18000,
        salary_currency: 'MAD',
        remote: true,
        status: 'active',
        posted: new Date().toISOString(),
        required_skills: [
            { id: 8, name: 'React', category: 'frontend' },
            { id: 9, name: 'JavaScript', category: 'programming' },
            { id: 7, name: 'Git', category: 'other' }
        ],
        preferred_skills: [
            { id: 10, name: 'Vue.js', category: 'frontend' },
            { id: 11, name: 'Node.js', category: 'backend' },
            { id: 5, name: 'Docker', category: 'devops' }
        ],
        tags: ['React', 'Frontend', 'JavaScript', 'UI', 'UX'],
        experience_required: '3+ years',
        education_required: 'Bachelor\'s degree or equivalent experience'
    },
    {
        id: 3,
        title: 'Full Stack Java Developer',
        company: 'Enterprise Solutions',
        location: 'Casablanca, Morocco',
        city: 'Casablanca',
        description: 'Full stack development using Java Spring Boot and modern frontend technologies. Work on enterprise-level applications.',
        requirements: '4+ years of Java experience, Spring Boot knowledge, frontend skills, database design',
        job_type: 'full-time',
        seniority: 'senior',
        salary_min: 18000,
        salary_max: 28000,
        salary_currency: 'MAD',
        remote: false,
        status: 'active',
        posted: new Date().toISOString(),
        required_skills: [
            { id: 12, name: 'Java', category: 'programming' },
            { id: 13, name: 'Spring Boot', category: 'backend' },
            { id: 9, name: 'JavaScript', category: 'programming' },
            { id: 4, name: 'PostgreSQL', category: 'database' }
        ],
        preferred_skills: [
            { id: 8, name: 'React', category: 'frontend' },
            { id: 5, name: 'Docker', category: 'devops' },
            { id: 6, name: 'AWS', category: 'devops' }
        ],
        tags: ['Java', 'Spring Boot', 'Full Stack', 'Backend', 'Frontend'],
        experience_required: '4+ years',
        education_required: 'Bachelor\'s degree in Computer Science'
    },
    {
        id: 4,
        title: 'Python Django Developer',
        company: 'WebAgency Pro',
        location: 'Marrakech, Morocco',
        city: 'Marrakech',
        description: 'Django web development for various client projects. Build custom web applications and maintain existing systems.',
        requirements: '2+ years of Django experience, Python proficiency, web development, client communication skills',
        job_type: 'full-time',
        seniority: 'mid',
        salary_min: 10000,
        salary_max: 16000,
        salary_currency: 'MAD',
        remote: true,
        status: 'active',
        posted: new Date().toISOString(),
        required_skills: [
            { id: 1, name: 'Python', category: 'programming' },
            { id: 2, name: 'Django', category: 'backend' },
            { id: 9, name: 'JavaScript', category: 'programming' },
            { id: 7, name: 'Git', category: 'other' }
        ],
        preferred_skills: [
            { id: 8, name: 'React', category: 'frontend' },
            { id: 4, name: 'PostgreSQL', category: 'database' },
            { id: 5, name: 'Docker', category: 'devops' }
        ],
        tags: ['Python', 'Django', 'Web Development', 'Backend', 'Full Stack'],
        experience_required: '2+ years',
        education_required: 'Bachelor\'s degree or equivalent experience'
    },
    {
        id: 5,
        title: 'React Native Mobile Developer',
        company: 'MobileFirst',
        location: 'Casablanca, Morocco',
        city: 'Casablanca',
        description: 'Develop mobile applications using React Native for both iOS and Android platforms.',
        requirements: '3+ years of React Native experience, mobile development knowledge, app store deployment experience',
        job_type: 'full-time',
        seniority: 'mid',
        salary_min: 14000,
        salary_max: 20000,
        salary_currency: 'MAD',
        remote: true,
        status: 'active',
        posted: new Date().toISOString(),
        required_skills: [
            { id: 8, name: 'React', category: 'frontend' },
            { id: 9, name: 'JavaScript', category: 'programming' },
            { id: 7, name: 'Git', category: 'other' }
        ],
        preferred_skills: [
            { id: 11, name: 'Node.js', category: 'backend' },
            { id: 5, name: 'Docker', category: 'devops' },
            { id: 6, name: 'AWS', category: 'devops' }
        ],
        tags: ['React Native', 'Mobile', 'JavaScript', 'iOS', 'Android'],
        experience_required: '3+ years',
        education_required: 'Bachelor\'s degree or equivalent experience'
    },
    {
        id: 6,
        title: 'Backend API Developer',
        company: 'APICorp',
        location: 'Casablanca, Morocco',
        city: 'Casablanca',
        description: 'Develop and maintain REST APIs and microservices. Work on scalable backend systems.',
        requirements: '3+ years of backend development, API design experience, database optimization, system architecture',
        job_type: 'full-time',
        seniority: 'mid',
        salary_min: 13000,
        salary_max: 19000,
        salary_currency: 'MAD',
        remote: true,
        status: 'active',
        posted: new Date().toISOString(),
        required_skills: [
            { id: 1, name: 'Python', category: 'programming' },
            { id: 3, name: 'REST API', category: 'backend' },
            { id: 4, name: 'PostgreSQL', category: 'database' },
            { id: 7, name: 'Git', category: 'other' }
        ],
        preferred_skills: [
            { id: 2, name: 'Django', category: 'backend' },
            { id: 5, name: 'Docker', category: 'devops' },
            { id: 6, name: 'AWS', category: 'devops' },
            { id: 14, name: 'GraphQL', category: 'backend' }
        ],
        tags: ['API', 'Backend', 'Python', 'REST', 'Microservices'],
        experience_required: '3+ years',
        education_required: 'Bachelor\'s degree in Computer Science or related field'
    },
    {
        id: 7,
        title: 'JavaScript Full Stack Developer',
        company: 'CodeMasters',
        location: 'Fez, Morocco',
        city: 'Fez',
        description: 'Full stack JavaScript development using Node.js and modern frontend frameworks.',
        requirements: '3+ years of JavaScript experience, Node.js proficiency, frontend framework knowledge',
        job_type: 'full-time',
        seniority: 'mid',
        salary_min: 11000,
        salary_max: 17000,
        salary_currency: 'MAD',
        remote: true,
        status: 'active',
        posted: new Date().toISOString(),
        required_skills: [
            { id: 9, name: 'JavaScript', category: 'programming' },
            { id: 11, name: 'Node.js', category: 'backend' },
            { id: 8, name: 'React', category: 'frontend' },
            { id: 7, name: 'Git', category: 'other' }
        ],
        preferred_skills: [
            { id: 10, name: 'Vue.js', category: 'frontend' },
            { id: 4, name: 'PostgreSQL', category: 'database' },
            { id: 5, name: 'Docker', category: 'devops' }
        ],
        tags: ['JavaScript', 'Node.js', 'React', 'Full Stack', 'Backend'],
        experience_required: '3+ years',
        education_required: 'Bachelor\'s degree or equivalent experience'
    },
    {
        id: 8,
        title: 'DevOps Engineer',
        company: 'CloudTech',
        location: 'Casablanca, Morocco',
        city: 'Casablanca',
        description: 'Manage cloud infrastructure and deployment pipelines. Work with containerization and automation.',
        requirements: '4+ years of DevOps experience, cloud platform knowledge, containerization expertise',
        job_type: 'full-time',
        seniority: 'senior',
        salary_min: 16000,
        salary_max: 24000,
        salary_currency: 'MAD',
        remote: true,
        status: 'active',
        posted: new Date().toISOString(),
        required_skills: [
            { id: 5, name: 'Docker', category: 'devops' },
            { id: 6, name: 'AWS', category: 'devops' },
            { id: 7, name: 'Git', category: 'other' }
        ],
        preferred_skills: [
            { id: 1, name: 'Python', category: 'programming' },
            { id: 2, name: 'Django', category: 'backend' },
            { id: 4, name: 'PostgreSQL', category: 'database' }
        ],
        tags: ['DevOps', 'Docker', 'AWS', 'Cloud', 'Automation'],
        experience_required: '4+ years',
        education_required: 'Bachelor\'s degree in Computer Science or related field'
    }
];

export default mockJobOffers;


