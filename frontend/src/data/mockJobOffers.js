/**
 * Mock job offers data for fallback when database is empty
 * This ensures the recommendation system always has data to work with
 */

export const mockJobOffers = [
    {
        id: 1,
        title: 'Python Developer',
        company: 'TechCorp Inc.',
        location: 'Casablanca, Morocco',
        city: 'Casablanca',
        description: 'We are looking for a Python developer with Django experience to join our team. You will work on building scalable web applications and APIs.',
        requirements: 'Python experience, Django framework knowledge, REST API development, database design experience',
        job_type: 'full-time',
        seniority: 'mid',
        salary_min: 12000,
        salary_max: 18000,
        salary_currency: 'MAD',
        remote: true,
        status: 'active',
        posted: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
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
        experience_required: '2+ years',
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
        title: 'JavaScript Backend Developer',
        company: 'ServerSide Tech',
        location: 'Agadir, Morocco',
        city: 'Agadir',
        description: 'Join our backend team as a JavaScript developer. You will build scalable APIs and server-side applications using Node.js and modern JavaScript.',
        requirements: 'JavaScript proficiency, Node.js experience, REST API development, SQLite knowledge',
        job_type: 'full-time',
        seniority: 'mid',
        salary_min: 11000,
        salary_max: 17000,
        salary_currency: 'MAD',
        remote: false,
        status: 'active',
        posted: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
        required_skills: [
            { id: 12, name: 'JavaScript', category: 'programming' },
            { id: 13, name: 'Node.js', category: 'backend' },
            { id: 14, name: 'SQLite', category: 'database' },
            { id: 15, name: 'REST API', category: 'backend' }
        ],
        preferred_skills: [
            { id: 16, name: 'Express.js', category: 'backend' },
            { id: 17, name: 'MongoDB', category: 'database' },
            { id: 7, name: 'Git', category: 'other' }
        ],
        tags: ['JavaScript', 'Node.js', 'Backend', 'API', 'SQLite'],
        experience_required: '2+ years',
        education_required: 'Bachelor\'s degree or equivalent experience'
    },
    {
        id: 4,
        title: 'React Full-Stack Developer',
        company: 'WebCraft Studio',
        location: 'Casablanca, Morocco',
        city: 'Casablanca',
        description: 'We are seeking a React developer who can work on both frontend and backend. You will build modern web applications with React and Node.js.',
        requirements: 'React experience, JavaScript proficiency, Node.js knowledge, REST API development',
        job_type: 'full-time',
        seniority: 'mid',
        salary_min: 13000,
        salary_max: 20000,
        salary_currency: 'MAD',
        remote: true,
        status: 'active',
        posted: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        required_skills: [
            { id: 8, name: 'React', category: 'frontend' },
            { id: 9, name: 'JavaScript', category: 'programming' },
            { id: 13, name: 'Node.js', category: 'backend' },
            { id: 18, name: 'SQLite', category: 'database' }
        ],
        preferred_skills: [
            { id: 19, name: 'TypeScript', category: 'programming' },
            { id: 20, name: 'Express.js', category: 'backend' },
            { id: 7, name: 'Git', category: 'other' }
        ],
        tags: ['React', 'JavaScript', 'Node.js', 'Full-Stack', 'SQLite'],
        experience_required: '3+ years',
        education_required: 'Bachelor\'s degree or equivalent experience'
    },
    {
        id: 5,
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
    },
    {
        id: 9,
        title: 'SQLite Database Developer',
        company: 'DataTech Solutions',
        location: 'Casablanca, Morocco',
        city: 'Casablanca',
        description: 'We need a skilled SQLite developer to work on our mobile and desktop applications. You will design and optimize database schemas, write efficient queries, and ensure data integrity.',
        requirements: '3+ years of SQLite experience, database design skills, query optimization, mobile app development',
        job_type: 'full-time',
        seniority: 'mid',
        salary_min: 10000,
        salary_max: 16000,
        salary_currency: 'MAD',
        remote: true,
        status: 'active',
        posted: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        required_skills: [
            { id: 15, name: 'SQLite', category: 'database' },
            { id: 9, name: 'JavaScript', category: 'programming' },
            { id: 7, name: 'Git', category: 'other' }
        ],
        preferred_skills: [
            { id: 16, name: 'Mobile Development', category: 'mobile' },
            { id: 4, name: 'PostgreSQL', category: 'database' },
            { id: 5, name: 'Docker', category: 'devops' }
        ],
        tags: ['SQLite', 'JavaScript', 'Database', 'Mobile', 'Optimization'],
        experience_required: '3+ years',
        education_required: 'Bachelor\'s degree in Computer Science or related field'
    },
    {
        id: 10,
        title: 'JavaScript Full-Stack Developer',
        company: 'WebCraft Studio',
        location: 'Marrakech, Morocco',
        city: 'Marrakech',
        description: 'Join our team as a JavaScript full-stack developer. You will work on both frontend and backend development using modern JavaScript technologies and frameworks.',
        requirements: '4+ years of JavaScript experience, Node.js, React, database knowledge, API development',
        job_type: 'full-time',
        seniority: 'senior',
        salary_min: 14000,
        salary_max: 22000,
        salary_currency: 'MAD',
        remote: false,
        status: 'active',
        posted: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        required_skills: [
            { id: 9, name: 'JavaScript', category: 'programming' },
            { id: 11, name: 'Node.js', category: 'backend' },
            { id: 8, name: 'React', category: 'frontend' },
            { id: 15, name: 'SQLite', category: 'database' }
        ],
        preferred_skills: [
            { id: 17, name: 'TypeScript', category: 'programming' },
            { id: 5, name: 'Docker', category: 'devops' },
            { id: 6, name: 'AWS', category: 'devops' }
        ],
        tags: ['JavaScript', 'Node.js', 'React', 'SQLite', 'Full-Stack'],
        experience_required: '4+ years',
        education_required: 'Bachelor\'s degree in Computer Science or related field'
    },
    {
        id: 11,
        title: 'Mobile App Developer (SQLite)',
        company: 'AppMasters',
        location: 'Rabat, Morocco',
        city: 'Rabat',
        description: 'We are looking for a mobile app developer with strong SQLite skills to work on our cross-platform applications. You will handle local data storage and synchronization.',
        requirements: '2+ years of mobile development, SQLite expertise, JavaScript/TypeScript, offline data management',
        job_type: 'full-time',
        seniority: 'mid',
        salary_min: 11000,
        salary_max: 17000,
        salary_currency: 'MAD',
        remote: true,
        status: 'active',
        posted: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        required_skills: [
            { id: 15, name: 'SQLite', category: 'database' },
            { id: 9, name: 'JavaScript', category: 'programming' },
            { id: 18, name: 'React Native', category: 'mobile' }
        ],
        preferred_skills: [
            { id: 19, name: 'Flutter', category: 'mobile' },
            { id: 7, name: 'Git', category: 'other' },
            { id: 20, name: 'REST API', category: 'backend' }
        ],
        tags: ['SQLite', 'JavaScript', 'Mobile', 'React Native', 'Offline'],
        experience_required: '2+ years',
        education_required: 'Bachelor\'s degree in Computer Science or related field'
    },
    {
        id: 12,
        title: 'Frontend JavaScript Specialist',
        company: 'UI/UX Pro',
        location: 'Casablanca, Morocco',
        city: 'Casablanca',
        description: 'We need a frontend JavaScript specialist to create interactive and dynamic user interfaces. You will work with modern JavaScript frameworks and libraries.',
        requirements: '3+ years of frontend JavaScript, React/Vue.js, ES6+, responsive design, performance optimization',
        job_type: 'full-time',
        seniority: 'mid',
        salary_min: 12000,
        salary_max: 18000,
        salary_currency: 'MAD',
        remote: false,
        status: 'active',
        posted: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        required_skills: [
            { id: 9, name: 'JavaScript', category: 'programming' },
            { id: 8, name: 'React', category: 'frontend' },
            { id: 21, name: 'HTML5', category: 'frontend' },
            { id: 22, name: 'CSS3', category: 'frontend' }
        ],
        preferred_skills: [
            { id: 10, name: 'Vue.js', category: 'frontend' },
            { id: 17, name: 'TypeScript', category: 'programming' },
            { id: 23, name: 'Webpack', category: 'frontend' }
        ],
        tags: ['JavaScript', 'React', 'Frontend', 'UI/UX', 'Responsive'],
        experience_required: '3+ years',
        education_required: 'Bachelor\'s degree in Computer Science or related field'
    },
    {
        id: 13,
        title: 'Database Administrator (SQLite)',
        company: 'DataFlow Systems',
        location: 'Fez, Morocco',
        city: 'Fez',
        description: 'We are seeking a database administrator with expertise in SQLite to manage our embedded database systems and ensure optimal performance.',
        requirements: '4+ years of SQLite administration, database optimization, backup strategies, performance tuning',
        job_type: 'full-time',
        seniority: 'senior',
        salary_min: 13000,
        salary_max: 20000,
        salary_currency: 'MAD',
        remote: true,
        status: 'active',
        posted: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        required_skills: [
            { id: 15, name: 'SQLite', category: 'database' },
            { id: 9, name: 'JavaScript', category: 'programming' },
            { id: 7, name: 'Git', category: 'other' }
        ],
        preferred_skills: [
            { id: 4, name: 'PostgreSQL', category: 'database' },
            { id: 24, name: 'MySQL', category: 'database' },
            { id: 5, name: 'Docker', category: 'devops' }
        ],
        tags: ['SQLite', 'Database', 'Administration', 'Optimization', 'Performance'],
        experience_required: '4+ years',
        education_required: 'Bachelor\'s degree in Computer Science or related field'
    },
    {
        id: 14,
        title: 'JavaScript Backend Developer',
        company: 'ServerSide Tech',
        location: 'Agadir, Morocco',
        city: 'Agadir',
        description: 'Join our backend team as a JavaScript developer. You will build scalable APIs and server-side applications using Node.js and modern JavaScript.',
        requirements: '3+ years of Node.js experience, JavaScript proficiency, API development, database integration',
        job_type: 'full-time',
        seniority: 'mid',
        salary_min: 11000,
        salary_max: 17000,
        salary_currency: 'MAD',
        remote: true,
        status: 'active',
        posted: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
        required_skills: [
            { id: 9, name: 'JavaScript', category: 'programming' },
            { id: 11, name: 'Node.js', category: 'backend' },
            { id: 15, name: 'SQLite', category: 'database' },
            { id: 20, name: 'REST API', category: 'backend' }
        ],
        preferred_skills: [
            { id: 14, name: 'GraphQL', category: 'backend' },
            { id: 5, name: 'Docker', category: 'devops' },
            { id: 6, name: 'AWS', category: 'devops' }
        ],
        tags: ['JavaScript', 'Node.js', 'Backend', 'API', 'SQLite'],
        experience_required: '3+ years',
        education_required: 'Bachelor\'s degree in Computer Science or related field'
    },
    {
        id: 15,
        title: 'Full-Stack Developer (JavaScript + SQLite)',
        company: 'TechInnovate',
        location: 'Casablanca, Morocco',
        city: 'Casablanca',
        description: 'We need a full-stack developer with strong JavaScript and SQLite skills to work on our web applications. You will handle both frontend and backend development.',
        requirements: '4+ years of full-stack development, JavaScript, SQLite, React, Node.js, database design',
        job_type: 'full-time',
        seniority: 'senior',
        salary_min: 15000,
        salary_max: 23000,
        salary_currency: 'MAD',
        remote: false,
        status: 'active',
        posted: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        required_skills: [
            { id: 9, name: 'JavaScript', category: 'programming' },
            { id: 15, name: 'SQLite', category: 'database' },
            { id: 8, name: 'React', category: 'frontend' },
            { id: 11, name: 'Node.js', category: 'backend' }
        ],
        preferred_skills: [
            { id: 17, name: 'TypeScript', category: 'programming' },
            { id: 5, name: 'Docker', category: 'devops' },
            { id: 6, name: 'AWS', category: 'devops' }
        ],
        tags: ['JavaScript', 'SQLite', 'Full-Stack', 'React', 'Node.js'],
        experience_required: '4+ years',
        education_required: 'Bachelor\'s degree in Computer Science or related field'
    },
    {
        id: 16,
        title: 'Mobile Database Developer',
        company: 'DataMobile Inc.',
        location: 'Rabat, Morocco',
        city: 'Rabat',
        description: 'We are looking for a mobile database developer to work on our mobile applications with SQLite integration. You will handle data persistence and synchronization.',
        requirements: '2+ years of mobile development, SQLite expertise, JavaScript, data modeling, offline capabilities',
        job_type: 'full-time',
        seniority: 'junior',
        salary_min: 8000,
        salary_max: 13000,
        salary_currency: 'MAD',
        remote: true,
        status: 'active',
        posted: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
        required_skills: [
            { id: 15, name: 'SQLite', category: 'database' },
            { id: 9, name: 'JavaScript', category: 'programming' },
            { id: 7, name: 'Git', category: 'other' }
        ],
        preferred_skills: [
            { id: 18, name: 'React Native', category: 'mobile' },
            { id: 19, name: 'Flutter', category: 'mobile' },
            { id: 20, name: 'REST API', category: 'backend' }
        ],
        tags: ['SQLite', 'JavaScript', 'Mobile', 'Database', 'Offline'],
        experience_required: '2+ years',
        education_required: 'Bachelor\'s degree in Computer Science or related field'
    },
    {
        id: 17,
        title: 'JavaScript UI/UX Developer',
        company: 'DesignTech',
        location: 'Marrakech, Morocco',
        city: 'Marrakech',
        description: 'Join our design team as a JavaScript developer focused on creating beautiful and interactive user interfaces. You will work with modern frontend technologies.',
        requirements: '3+ years of frontend JavaScript, UI/UX design principles, React, responsive design, animation libraries',
        job_type: 'full-time',
        seniority: 'mid',
        salary_min: 12000,
        salary_max: 18000,
        salary_currency: 'MAD',
        remote: false,
        status: 'active',
        posted: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
        required_skills: [
            { id: 9, name: 'JavaScript', category: 'programming' },
            { id: 8, name: 'React', category: 'frontend' },
            { id: 21, name: 'HTML5', category: 'frontend' },
            { id: 22, name: 'CSS3', category: 'frontend' }
        ],
        preferred_skills: [
            { id: 25, name: 'Framer Motion', category: 'frontend' },
            { id: 17, name: 'TypeScript', category: 'programming' },
            { id: 26, name: 'Sass', category: 'frontend' }
        ],
        tags: ['JavaScript', 'UI/UX', 'React', 'Frontend', 'Animation'],
        experience_required: '3+ years',
        education_required: 'Bachelor\'s degree in Computer Science or related field'
    },
    {
        id: 18,
        title: 'Embedded Systems Developer (SQLite)',
        company: 'Embedded Solutions',
        location: 'Casablanca, Morocco',
        city: 'Casablanca',
        description: 'We need an embedded systems developer with SQLite expertise to work on IoT devices and embedded applications. You will handle local data storage and management.',
        requirements: '3+ years of embedded development, SQLite, C/C++, JavaScript, IoT protocols, data logging',
        job_type: 'full-time',
        seniority: 'mid',
        salary_min: 13000,
        salary_max: 19000,
        salary_currency: 'MAD',
        remote: true,
        status: 'active',
        posted: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        required_skills: [
            { id: 15, name: 'SQLite', category: 'database' },
            { id: 9, name: 'JavaScript', category: 'programming' },
            { id: 27, name: 'C++', category: 'programming' },
            { id: 7, name: 'Git', category: 'other' }
        ],
        preferred_skills: [
            { id: 28, name: 'Python', category: 'programming' },
            { id: 29, name: 'IoT', category: 'embedded' },
            { id: 5, name: 'Docker', category: 'devops' }
        ],
        tags: ['SQLite', 'JavaScript', 'Embedded', 'IoT', 'C++'],
        experience_required: '3+ years',
        education_required: 'Bachelor\'s degree in Computer Science or related field'
    },
    {
        id: 19,
        title: 'JavaScript Performance Engineer',
        company: 'SpeedTech',
        location: 'Rabat, Morocco',
        city: 'Rabat',
        description: 'We are seeking a JavaScript performance engineer to optimize our web applications and ensure fast, efficient code. You will work on performance monitoring and optimization.',
        requirements: '4+ years of JavaScript experience, performance optimization, profiling tools, React, Node.js, database optimization',
        job_type: 'full-time',
        seniority: 'senior',
        salary_min: 14000,
        salary_max: 21000,
        salary_currency: 'MAD',
        remote: true,
        status: 'active',
        posted: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString(),
        required_skills: [
            { id: 9, name: 'JavaScript', category: 'programming' },
            { id: 15, name: 'SQLite', category: 'database' },
            { id: 8, name: 'React', category: 'frontend' },
            { id: 11, name: 'Node.js', category: 'backend' }
        ],
        preferred_skills: [
            { id: 30, name: 'Webpack', category: 'frontend' },
            { id: 31, name: 'Lighthouse', category: 'tools' },
            { id: 5, name: 'Docker', category: 'devops' }
        ],
        tags: ['JavaScript', 'Performance', 'Optimization', 'SQLite', 'Monitoring'],
        experience_required: '4+ years',
        education_required: 'Bachelor\'s degree in Computer Science or related field'
    },
    {
        id: 20,
        title: 'Cross-Platform Developer (JavaScript + SQLite)',
        company: 'Universal Apps',
        location: 'Casablanca, Morocco',
        city: 'Casablanca',
        description: 'We need a cross-platform developer to build applications that work on multiple platforms using JavaScript and SQLite. You will work on web, mobile, and desktop applications.',
        requirements: '3+ years of cross-platform development, JavaScript, SQLite, React Native, Electron, database design',
        job_type: 'full-time',
        seniority: 'mid',
        salary_min: 12000,
        salary_max: 18000,
        salary_currency: 'MAD',
        remote: false,
        status: 'active',
        posted: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
        required_skills: [
            { id: 9, name: 'JavaScript', category: 'programming' },
            { id: 15, name: 'SQLite', category: 'database' },
            { id: 18, name: 'React Native', category: 'mobile' },
            { id: 32, name: 'Electron', category: 'desktop' }
        ],
        preferred_skills: [
            { id: 8, name: 'React', category: 'frontend' },
            { id: 17, name: 'TypeScript', category: 'programming' },
            { id: 5, name: 'Docker', category: 'devops' }
        ],
        tags: ['JavaScript', 'SQLite', 'Cross-Platform', 'React Native', 'Electron'],
        experience_required: '3+ years',
        education_required: 'Bachelor\'s degree in Computer Science or related field'
    },
    // Nouvelles offres avec SQL Server, Python, Django et autres compétences
    {
        id: 21,
        title: 'SQL Server Database Administrator',
        company: 'DataSystems Pro',
        location: 'Casablanca, Morocco',
        city: 'Casablanca',
        description: 'We are looking for an experienced SQL Server Database Administrator to manage our enterprise database systems. You will be responsible for database design, optimization, and maintenance.',
        requirements: '5+ years of SQL Server experience, database administration, performance tuning, backup strategies, security implementation',
        job_type: 'full-time',
        seniority: 'senior',
        salary_min: 16000,
        salary_max: 24000,
        salary_currency: 'MAD',
        remote: true,
        status: 'active',
        posted: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        required_skills: [
            { id: 33, name: 'SQL Server', category: 'database' },
            { id: 34, name: 'T-SQL', category: 'database' },
            { id: 7, name: 'Git', category: 'other' }
        ],
        preferred_skills: [
            { id: 4, name: 'PostgreSQL', category: 'database' },
            { id: 24, name: 'MySQL', category: 'database' },
            { id: 5, name: 'Docker', category: 'devops' }
        ],
        tags: ['SQL Server', 'Database', 'Administration', 'T-SQL', 'Performance'],
        experience_required: '5+ years',
        education_required: 'Bachelor\'s degree in Computer Science or related field'
    },
    {
        id: 22,
        title: 'Python Django Full-Stack Developer',
        company: 'WebSolutions Morocco',
        location: 'Rabat, Morocco',
        city: 'Rabat',
        description: 'Join our team as a Python Django developer to build robust web applications. You will work on both backend and frontend development using Django framework and modern technologies.',
        requirements: '4+ years of Python experience, Django framework expertise, frontend skills, database design, API development',
        job_type: 'full-time',
        seniority: 'senior',
        salary_min: 14000,
        salary_max: 22000,
        salary_currency: 'MAD',
        remote: true,
        status: 'active',
        posted: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        required_skills: [
            { id: 1, name: 'Python', category: 'programming' },
            { id: 2, name: 'Django', category: 'backend' },
            { id: 9, name: 'JavaScript', category: 'programming' },
            { id: 33, name: 'SQL Server', category: 'database' }
        ],
        preferred_skills: [
            { id: 8, name: 'React', category: 'frontend' },
            { id: 5, name: 'Docker', category: 'devops' },
            { id: 6, name: 'AWS', category: 'devops' }
        ],
        tags: ['Python', 'Django', 'SQL Server', 'Full-Stack', 'Web Development'],
        experience_required: '4+ years',
        education_required: 'Bachelor\'s degree in Computer Science or related field'
    },
    {
        id: 23,
        title: 'Data Engineer (Python + SQL Server)',
        company: 'DataFlow Analytics',
        location: 'Casablanca, Morocco',
        city: 'Casablanca',
        description: 'We need a Data Engineer to work on our data pipeline and analytics platform. You will handle data extraction, transformation, and loading processes using Python and SQL Server.',
        requirements: '3+ years of data engineering experience, Python, SQL Server, ETL processes, data modeling, analytics',
        job_type: 'full-time',
        seniority: 'mid',
        salary_min: 13000,
        salary_max: 19000,
        salary_currency: 'MAD',
        remote: true,
        status: 'active',
        posted: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        required_skills: [
            { id: 1, name: 'Python', category: 'programming' },
            { id: 33, name: 'SQL Server', category: 'database' },
            { id: 35, name: 'ETL', category: 'data' },
            { id: 7, name: 'Git', category: 'other' }
        ],
        preferred_skills: [
            { id: 36, name: 'Pandas', category: 'data' },
            { id: 37, name: 'NumPy', category: 'data' },
            { id: 5, name: 'Docker', category: 'devops' }
        ],
        tags: ['Python', 'SQL Server', 'Data Engineering', 'ETL', 'Analytics'],
        experience_required: '3+ years',
        education_required: 'Bachelor\'s degree in Computer Science or related field'
    },
    {
        id: 24,
        title: 'Backend Developer (Django + SQL Server)',
        company: 'TechInnovate Solutions',
        location: 'Marrakech, Morocco',
        city: 'Marrakech',
        description: 'We are seeking a Backend Developer with Django and SQL Server expertise to work on our API and database systems. You will build scalable backend services and manage data operations.',
        requirements: '3+ years of Django development, SQL Server experience, API design, database optimization, microservices',
        job_type: 'full-time',
        seniority: 'mid',
        salary_min: 12000,
        salary_max: 18000,
        salary_currency: 'MAD',
        remote: false,
        status: 'active',
        posted: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        required_skills: [
            { id: 2, name: 'Django', category: 'backend' },
            { id: 33, name: 'SQL Server', category: 'database' },
            { id: 3, name: 'REST API', category: 'backend' },
            { id: 7, name: 'Git', category: 'other' }
        ],
        preferred_skills: [
            { id: 1, name: 'Python', category: 'programming' },
            { id: 5, name: 'Docker', category: 'devops' },
            { id: 6, name: 'AWS', category: 'devops' }
        ],
        tags: ['Django', 'SQL Server', 'Backend', 'API', 'Microservices'],
        experience_required: '3+ years',
        education_required: 'Bachelor\'s degree in Computer Science or related field'
    },
    {
        id: 25,
        title: 'Full-Stack Python Developer',
        company: 'DigitalCraft Studio',
        location: 'Fez, Morocco',
        city: 'Fez',
        description: 'Join our team as a Full-Stack Python Developer. You will work on web applications using Python, Django, and modern frontend technologies. Experience with SQL Server is a plus.',
        requirements: '4+ years of Python development, Django framework, frontend skills, database experience, full-stack development',
        job_type: 'full-time',
        seniority: 'senior',
        salary_min: 15000,
        salary_max: 23000,
        salary_currency: 'MAD',
        remote: true,
        status: 'active',
        posted: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        required_skills: [
            { id: 1, name: 'Python', category: 'programming' },
            { id: 2, name: 'Django', category: 'backend' },
            { id: 8, name: 'React', category: 'frontend' },
            { id: 9, name: 'JavaScript', category: 'programming' }
        ],
        preferred_skills: [
            { id: 33, name: 'SQL Server', category: 'database' },
            { id: 4, name: 'PostgreSQL', category: 'database' },
            { id: 5, name: 'Docker', category: 'devops' }
        ],
        tags: ['Python', 'Django', 'React', 'Full-Stack', 'Web Development'],
        experience_required: '4+ years',
        education_required: 'Bachelor\'s degree in Computer Science or related field'
    },
    {
        id: 26,
        title: 'Database Developer (SQL Server + Python)',
        company: 'DataTech Innovations',
        location: 'Agadir, Morocco',
        city: 'Agadir',
        description: 'We need a Database Developer with strong SQL Server and Python skills to work on our data management systems. You will design databases, write stored procedures, and build data processing scripts.',
        requirements: '3+ years of SQL Server development, Python scripting, stored procedures, database design, performance optimization',
        job_type: 'full-time',
        seniority: 'mid',
        salary_min: 11000,
        salary_max: 17000,
        salary_currency: 'MAD',
        remote: true,
        status: 'active',
        posted: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
        required_skills: [
            { id: 33, name: 'SQL Server', category: 'database' },
            { id: 34, name: 'T-SQL', category: 'database' },
            { id: 1, name: 'Python', category: 'programming' },
            { id: 7, name: 'Git', category: 'other' }
        ],
        preferred_skills: [
            { id: 2, name: 'Django', category: 'backend' },
            { id: 4, name: 'PostgreSQL', category: 'database' },
            { id: 5, name: 'Docker', category: 'devops' }
        ],
        tags: ['SQL Server', 'Python', 'Database', 'T-SQL', 'Data Processing'],
        experience_required: '3+ years',
        education_required: 'Bachelor\'s degree in Computer Science or related field'
    },
    {
        id: 27,
        title: 'Python Web Developer (Django + SQL Server)',
        company: 'WebCraft Morocco',
        location: 'Casablanca, Morocco',
        city: 'Casablanca',
        description: 'We are looking for a Python Web Developer to join our team. You will work on Django web applications with SQL Server integration, building scalable and efficient web solutions.',
        requirements: '3+ years of Python web development, Django framework, SQL Server integration, web technologies, database management',
        job_type: 'full-time',
        seniority: 'mid',
        salary_min: 12000,
        salary_max: 18000,
        salary_currency: 'MAD',
        remote: false,
        status: 'active',
        posted: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        required_skills: [
            { id: 1, name: 'Python', category: 'programming' },
            { id: 2, name: 'Django', category: 'backend' },
            { id: 33, name: 'SQL Server', category: 'database' },
            { id: 9, name: 'JavaScript', category: 'programming' }
        ],
        preferred_skills: [
            { id: 8, name: 'React', category: 'frontend' },
            { id: 5, name: 'Docker', category: 'devops' },
            { id: 6, name: 'AWS', category: 'devops' }
        ],
        tags: ['Python', 'Django', 'SQL Server', 'Web Development', 'Backend'],
        experience_required: '3+ years',
        education_required: 'Bachelor\'s degree in Computer Science or related field'
    },
    {
        id: 28,
        title: 'Senior Python Developer (Django + SQL Server)',
        company: 'Enterprise Tech Solutions',
        location: 'Rabat, Morocco',
        city: 'Rabat',
        description: 'We need a Senior Python Developer with Django and SQL Server expertise to lead our backend development team. You will architect solutions and mentor junior developers.',
        requirements: '6+ years of Python development, Django framework mastery, SQL Server expertise, team leadership, system architecture',
        job_type: 'full-time',
        seniority: 'senior',
        salary_min: 18000,
        salary_max: 28000,
        salary_currency: 'MAD',
        remote: true,
        status: 'active',
        posted: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
        required_skills: [
            { id: 1, name: 'Python', category: 'programming' },
            { id: 2, name: 'Django', category: 'backend' },
            { id: 33, name: 'SQL Server', category: 'database' },
            { id: 7, name: 'Git', category: 'other' }
        ],
        preferred_skills: [
            { id: 5, name: 'Docker', category: 'devops' },
            { id: 6, name: 'AWS', category: 'devops' },
            { id: 38, name: 'Kubernetes', category: 'devops' }
        ],
        tags: ['Python', 'Django', 'SQL Server', 'Senior', 'Architecture'],
        experience_required: '6+ years',
        education_required: 'Bachelor\'s degree in Computer Science or related field'
    },
    {
        id: 29,
        title: 'Backend API Developer (Python + Django)',
        company: 'APIMasters',
        location: 'Marrakech, Morocco',
        city: 'Marrakech',
        description: 'Join our team as a Backend API Developer. You will build robust APIs using Python and Django, with experience in various database systems including SQL Server.',
        requirements: '3+ years of API development, Python, Django, database integration, REST/GraphQL APIs, microservices',
        job_type: 'full-time',
        seniority: 'mid',
        salary_min: 13000,
        salary_max: 19000,
        salary_currency: 'MAD',
        remote: true,
        status: 'active',
        posted: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
        required_skills: [
            { id: 1, name: 'Python', category: 'programming' },
            { id: 2, name: 'Django', category: 'backend' },
            { id: 3, name: 'REST API', category: 'backend' },
            { id: 7, name: 'Git', category: 'other' }
        ],
        preferred_skills: [
            { id: 33, name: 'SQL Server', category: 'database' },
            { id: 14, name: 'GraphQL', category: 'backend' },
            { id: 5, name: 'Docker', category: 'devops' }
        ],
        tags: ['Python', 'Django', 'API', 'Backend', 'Microservices'],
        experience_required: '3+ years',
        education_required: 'Bachelor\'s degree in Computer Science or related field'
    },
    {
        id: 30,
        title: 'Full-Stack Developer (Python + Django + SQL Server)',
        company: 'TechVision Morocco',
        location: 'Casablanca, Morocco',
        city: 'Casablanca',
        description: 'We are seeking a Full-Stack Developer with expertise in Python, Django, and SQL Server. You will work on complete web applications from frontend to backend and database.',
        requirements: '4+ years of full-stack development, Python, Django, SQL Server, frontend technologies, database design',
        job_type: 'full-time',
        seniority: 'senior',
        salary_min: 16000,
        salary_max: 24000,
        salary_currency: 'MAD',
        remote: false,
        status: 'active',
        posted: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        required_skills: [
            { id: 1, name: 'Python', category: 'programming' },
            { id: 2, name: 'Django', category: 'backend' },
            { id: 33, name: 'SQL Server', category: 'database' },
            { id: 8, name: 'React', category: 'frontend' }
        ],
        preferred_skills: [
            { id: 9, name: 'JavaScript', category: 'programming' },
            { id: 5, name: 'Docker', category: 'devops' },
            { id: 6, name: 'AWS', category: 'devops' }
        ],
        tags: ['Python', 'Django', 'SQL Server', 'React', 'Full-Stack'],
        experience_required: '4+ years',
        education_required: 'Bachelor\'s degree in Computer Science or related field'
    },
    // Offres avec d'autres compétences variées
    {
        id: 31,
        title: 'Java Spring Boot Developer',
        company: 'Enterprise Solutions Pro',
        location: 'Casablanca, Morocco',
        city: 'Casablanca',
        description: 'We need a Java Spring Boot Developer to work on enterprise applications. You will build scalable backend services and integrate with various database systems.',
        requirements: '4+ years of Java development, Spring Boot framework, microservices, database integration, enterprise patterns',
        job_type: 'full-time',
        seniority: 'senior',
        salary_min: 17000,
        salary_max: 25000,
        salary_currency: 'MAD',
        remote: true,
        status: 'active',
        posted: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString(),
        required_skills: [
            { id: 12, name: 'Java', category: 'programming' },
            { id: 13, name: 'Spring Boot', category: 'backend' },
            { id: 33, name: 'SQL Server', category: 'database' },
            { id: 7, name: 'Git', category: 'other' }
        ],
        preferred_skills: [
            { id: 39, name: 'Maven', category: 'tools' },
            { id: 5, name: 'Docker', category: 'devops' },
            { id: 6, name: 'AWS', category: 'devops' }
        ],
        tags: ['Java', 'Spring Boot', 'SQL Server', 'Microservices', 'Enterprise'],
        experience_required: '4+ years',
        education_required: 'Bachelor\'s degree in Computer Science or related field'
    },
    {
        id: 32,
        title: 'C# .NET Developer',
        company: 'Microsoft Solutions Morocco',
        location: 'Rabat, Morocco',
        city: 'Rabat',
        description: 'Join our team as a C# .NET Developer to work on Windows applications and web services. Experience with SQL Server and modern .NET technologies required.',
        requirements: '3+ years of C# development, .NET framework, SQL Server, web services, Windows applications',
        job_type: 'full-time',
        seniority: 'mid',
        salary_min: 14000,
        salary_max: 20000,
        salary_currency: 'MAD',
        remote: false,
        status: 'active',
        posted: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
        required_skills: [
            { id: 40, name: 'C#', category: 'programming' },
            { id: 41, name: '.NET', category: 'backend' },
            { id: 33, name: 'SQL Server', category: 'database' },
            { id: 7, name: 'Git', category: 'other' }
        ],
        preferred_skills: [
            { id: 42, name: 'ASP.NET', category: 'backend' },
            { id: 43, name: 'Entity Framework', category: 'backend' },
            { id: 5, name: 'Docker', category: 'devops' }
        ],
        tags: ['C#', '.NET', 'SQL Server', 'Windows', 'Web Services'],
        experience_required: '3+ years',
        education_required: 'Bachelor\'s degree in Computer Science or related field'
    },
    {
        id: 33,
        title: 'PHP Laravel Developer',
        company: 'WebAgency Morocco',
        location: 'Marrakech, Morocco',
        city: 'Marrakech',
        description: 'We are looking for a PHP Laravel Developer to work on web applications and e-commerce platforms. You will build robust backend systems and integrate with various databases.',
        requirements: '3+ years of PHP development, Laravel framework, MySQL, web development, e-commerce experience',
        job_type: 'full-time',
        seniority: 'mid',
        salary_min: 10000,
        salary_max: 16000,
        salary_currency: 'MAD',
        remote: true,
        status: 'active',
        posted: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000).toISOString(),
        required_skills: [
            { id: 44, name: 'PHP', category: 'programming' },
            { id: 45, name: 'Laravel', category: 'backend' },
            { id: 24, name: 'MySQL', category: 'database' },
            { id: 7, name: 'Git', category: 'other' }
        ],
        preferred_skills: [
            { id: 9, name: 'JavaScript', category: 'programming' },
            { id: 8, name: 'React', category: 'frontend' },
            { id: 5, name: 'Docker', category: 'devops' }
        ],
        tags: ['PHP', 'Laravel', 'MySQL', 'E-commerce', 'Web Development'],
        experience_required: '3+ years',
        education_required: 'Bachelor\'s degree in Computer Science or related field'
    },
    {
        id: 34,
        title: 'Go Developer',
        company: 'CloudNative Solutions',
        location: 'Casablanca, Morocco',
        city: 'Casablanca',
        description: 'We need a Go Developer to work on cloud-native applications and microservices. You will build high-performance backend services and APIs.',
        requirements: '3+ years of Go development, microservices, cloud platforms, API development, containerization',
        job_type: 'full-time',
        seniority: 'mid',
        salary_min: 15000,
        salary_max: 22000,
        salary_currency: 'MAD',
        remote: true,
        status: 'active',
        posted: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        required_skills: [
            { id: 46, name: 'Go', category: 'programming' },
            { id: 3, name: 'REST API', category: 'backend' },
            { id: 4, name: 'PostgreSQL', category: 'database' },
            { id: 7, name: 'Git', category: 'other' }
        ],
        preferred_skills: [
            { id: 5, name: 'Docker', category: 'devops' },
            { id: 38, name: 'Kubernetes', category: 'devops' },
            { id: 6, name: 'AWS', category: 'devops' }
        ],
        tags: ['Go', 'Microservices', 'Cloud', 'API', 'Performance'],
        experience_required: '3+ years',
        education_required: 'Bachelor\'s degree in Computer Science or related field'
    },
    {
        id: 35,
        title: 'Rust Systems Developer',
        company: 'PerformanceTech',
        location: 'Fez, Morocco',
        city: 'Fez',
        description: 'We are seeking a Rust Systems Developer to work on high-performance systems and applications. You will build memory-safe and efficient software solutions.',
        requirements: '2+ years of Rust development, systems programming, performance optimization, memory management, concurrent programming',
        job_type: 'full-time',
        seniority: 'mid',
        salary_min: 16000,
        salary_max: 23000,
        salary_currency: 'MAD',
        remote: true,
        status: 'active',
        posted: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        required_skills: [
            { id: 47, name: 'Rust', category: 'programming' },
            { id: 27, name: 'C++', category: 'programming' },
            { id: 7, name: 'Git', category: 'other' }
        ],
        preferred_skills: [
            { id: 5, name: 'Docker', category: 'devops' },
            { id: 48, name: 'WebAssembly', category: 'programming' },
            { id: 6, name: 'AWS', category: 'devops' }
        ],
        tags: ['Rust', 'Systems', 'Performance', 'Memory Safety', 'Concurrency'],
        experience_required: '2+ years',
        education_required: 'Bachelor\'s degree in Computer Science or related field'
    }
];

export default mockJobOffers;






