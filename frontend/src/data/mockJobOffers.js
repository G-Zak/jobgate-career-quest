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
 }
];

export default mockJobOffers;

