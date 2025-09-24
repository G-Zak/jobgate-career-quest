#!/usr/bin/env python
"""
Comprehensive script to create diverse job offers for the recommendation system
"""
import os
import sys
import django
from datetime import datetime, timedelta
from django.utils import timezone

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'careerquest.settings')
django.setup()

from recommendation.models import JobOffer
from skills.models import Skill

def create_comprehensive_jobs():
    """Create comprehensive job offers with diverse skills and profiles"""
    
    # Comprehensive skills database
    skills_data = [
        # Programming Languages
        {'name': 'Python', 'category': 'programming'},
        {'name': 'JavaScript', 'category': 'programming'},
        {'name': 'Java', 'category': 'programming'},
        {'name': 'TypeScript', 'category': 'programming'},
        {'name': 'C#', 'category': 'programming'},
        {'name': 'C++', 'category': 'programming'},
        {'name': 'Go', 'category': 'programming'},
        {'name': 'Rust', 'category': 'programming'},
        {'name': 'PHP', 'category': 'programming'},
        {'name': 'Ruby', 'category': 'programming'},
        {'name': 'Swift', 'category': 'programming'},
        {'name': 'Kotlin', 'category': 'programming'},
        {'name': 'Scala', 'category': 'programming'},
        {'name': 'R', 'category': 'programming'},
        {'name': 'MATLAB', 'category': 'programming'},
        
        # Web Frameworks
        {'name': 'Django', 'category': 'backend'},
        {'name': 'Flask', 'category': 'backend'},
        {'name': 'FastAPI', 'category': 'backend'},
        {'name': 'React', 'category': 'frontend'},
        {'name': 'Vue.js', 'category': 'frontend'},
        {'name': 'Angular', 'category': 'frontend'},
        {'name': 'Svelte', 'category': 'frontend'},
        {'name': 'Spring Boot', 'category': 'backend'},
        {'name': 'Express.js', 'category': 'backend'},
        {'name': 'Laravel', 'category': 'backend'},
        {'name': 'Rails', 'category': 'backend'},
        {'name': 'ASP.NET', 'category': 'backend'},
        {'name': 'Next.js', 'category': 'frontend'},
        {'name': 'Nuxt.js', 'category': 'frontend'},
        {'name': 'SvelteKit', 'category': 'frontend'},
        
        # Mobile Development
        {'name': 'React Native', 'category': 'mobile'},
        {'name': 'Flutter', 'category': 'mobile'},
        {'name': 'Xamarin', 'category': 'mobile'},
        {'name': 'Ionic', 'category': 'mobile'},
        {'name': 'Cordova', 'category': 'mobile'},
        {'name': 'iOS Development', 'category': 'mobile'},
        {'name': 'Android Development', 'category': 'mobile'},
        
        # Databases
        {'name': 'PostgreSQL', 'category': 'database'},
        {'name': 'MySQL', 'category': 'database'},
        {'name': 'MongoDB', 'category': 'database'},
        {'name': 'Redis', 'category': 'database'},
        {'name': 'Elasticsearch', 'category': 'database'},
        {'name': 'SQLite', 'category': 'database'},
        {'name': 'Oracle', 'category': 'database'},
        {'name': 'SQL Server', 'category': 'database'},
        {'name': 'Cassandra', 'category': 'database'},
        {'name': 'DynamoDB', 'category': 'database'},
        {'name': 'Neo4j', 'category': 'database'},
        {'name': 'InfluxDB', 'category': 'database'},
        
        # DevOps & Cloud
        {'name': 'Docker', 'category': 'devops'},
        {'name': 'Kubernetes', 'category': 'devops'},
        {'name': 'AWS', 'category': 'cloud'},
        {'name': 'Azure', 'category': 'cloud'},
        {'name': 'GCP', 'category': 'cloud'},
        {'name': 'Terraform', 'category': 'devops'},
        {'name': 'Ansible', 'category': 'devops'},
        {'name': 'Jenkins', 'category': 'devops'},
        {'name': 'GitLab CI', 'category': 'devops'},
        {'name': 'GitHub Actions', 'category': 'devops'},
        {'name': 'CircleCI', 'category': 'devops'},
        {'name': 'Travis CI', 'category': 'devops'},
        
        # Data Science & AI
        {'name': 'Machine Learning', 'category': 'ai'},
        {'name': 'Deep Learning', 'category': 'ai'},
        {'name': 'TensorFlow', 'category': 'ai'},
        {'name': 'PyTorch', 'category': 'ai'},
        {'name': 'Scikit-learn', 'category': 'ai'},
        {'name': 'Pandas', 'category': 'data'},
        {'name': 'NumPy', 'category': 'data'},
        {'name': 'Matplotlib', 'category': 'data'},
        {'name': 'Seaborn', 'category': 'data'},
        {'name': 'Jupyter', 'category': 'data'},
        {'name': 'Apache Spark', 'category': 'data'},
        {'name': 'Hadoop', 'category': 'data'},
        {'name': 'Kafka', 'category': 'data'},
        {'name': 'Airflow', 'category': 'data'},
        
        # Testing
        {'name': 'Unit Testing', 'category': 'testing'},
        {'name': 'Integration Testing', 'category': 'testing'},
        {'name': 'Jest', 'category': 'testing'},
        {'name': 'Cypress', 'category': 'testing'},
        {'name': 'Selenium', 'category': 'testing'},
        {'name': 'Pytest', 'category': 'testing'},
        {'name': 'JUnit', 'category': 'testing'},
        {'name': 'Mocha', 'category': 'testing'},
        {'name': 'Chai', 'category': 'testing'},
        
        # Design & UI/UX
        {'name': 'UI/UX Design', 'category': 'design'},
        {'name': 'Figma', 'category': 'design'},
        {'name': 'Sketch', 'category': 'design'},
        {'name': 'Adobe XD', 'category': 'design'},
        {'name': 'Photoshop', 'category': 'design'},
        {'name': 'Illustrator', 'category': 'design'},
        {'name': 'CSS', 'category': 'frontend'},
        {'name': 'SCSS', 'category': 'frontend'},
        {'name': 'Sass', 'category': 'frontend'},
        {'name': 'Tailwind CSS', 'category': 'frontend'},
        {'name': 'Bootstrap', 'category': 'frontend'},
        {'name': 'Material-UI', 'category': 'frontend'},
        
        # Other Technologies
        {'name': 'Git', 'category': 'other'},
        {'name': 'REST API', 'category': 'backend'},
        {'name': 'GraphQL', 'category': 'backend'},
        {'name': 'gRPC', 'category': 'backend'},
        {'name': 'WebSocket', 'category': 'backend'},
        {'name': 'Microservices', 'category': 'architecture'},
        {'name': 'Serverless', 'category': 'architecture'},
        {'name': 'Blockchain', 'category': 'emerging'},
        {'name': 'Web3', 'category': 'emerging'},
        {'name': 'IoT', 'category': 'emerging'},
        {'name': 'AR/VR', 'category': 'emerging'},
    ]
    
    # Create skills
    skills = {}
    for skill_data in skills_data:
        skill, created = Skill.objects.get_or_create(
            name=skill_data['name'],
            defaults={'category': skill_data['category'], 'description': f'{skill_data["name"]} skill'}
        )
        skills[skill_data['name']] = skill
        if created:
            print(f"Created skill: {skill_data['name']}")
    
    # Comprehensive job offers with diverse profiles
    job_offers_data = [
        # Data Science & AI Jobs
        {
            'title': 'Senior Data Scientist',
            'company': 'DataTech Solutions',
            'location': 'Casablanca, Morocco',
            'description': 'Lead data science initiatives and build ML models for business insights.',
            'requirements': '5+ years in data science, Python, Machine Learning, statistical analysis',
            'job_type': 'full-time',
            'seniority': 'senior',
            'salary_min': 20000,
            'salary_max': 35000,
            'salary_currency': 'MAD',
            'remote': True,
            'status': 'active',
            'required_skills': ['Python', 'Machine Learning', 'Pandas', 'NumPy', 'Scikit-learn', 'PostgreSQL'],
            'preferred_skills': ['TensorFlow', 'PyTorch', 'AWS', 'Docker', 'Apache Spark'],
            'tags': ['Data Science', 'Machine Learning', 'Python', 'AI', 'Analytics']
        },
        {
            'title': 'Machine Learning Engineer',
            'company': 'AI Innovations',
            'location': 'Rabat, Morocco',
            'description': 'Design and implement ML systems and algorithms for production.',
            'requirements': '3+ years ML engineering, Python, TensorFlow/PyTorch, MLOps',
            'job_type': 'full-time',
            'seniority': 'mid',
            'salary_min': 18000,
            'salary_max': 28000,
            'salary_currency': 'MAD',
            'remote': True,
            'status': 'active',
            'required_skills': ['Python', 'Machine Learning', 'TensorFlow', 'Docker', 'AWS'],
            'preferred_skills': ['PyTorch', 'Kubernetes', 'Apache Kafka', 'Elasticsearch'],
            'tags': ['Machine Learning', 'AI', 'Python', 'MLOps', 'Engineering']
        },
        {
            'title': 'Data Analyst',
            'company': 'Business Intelligence Corp',
            'location': 'Marrakech, Morocco',
            'description': 'Analyze business data and create reports for decision making.',
            'requirements': '2+ years data analysis, SQL, Excel, statistical analysis',
            'job_type': 'full-time',
            'seniority': 'junior',
            'salary_min': 8000,
            'salary_max': 14000,
            'salary_currency': 'MAD',
            'remote': False,
            'status': 'active',
            'required_skills': ['Python', 'SQL', 'Excel', 'Pandas', 'Matplotlib'],
            'preferred_skills': ['Power BI', 'Tableau', 'Jupyter', 'PostgreSQL'],
            'tags': ['Data Analysis', 'Business Intelligence', 'SQL', 'Python']
        },
        
        # Frontend Development Jobs
        {
            'title': 'Senior React Developer',
            'company': 'Frontend Masters',
            'location': 'Casablanca, Morocco',
            'description': 'Build complex React applications with modern tools and best practices.',
            'requirements': '4+ years React experience, TypeScript, modern frontend tools',
            'job_type': 'full-time',
            'seniority': 'senior',
            'salary_min': 16000,
            'salary_max': 26000,
            'salary_currency': 'MAD',
            'remote': True,
            'status': 'active',
            'required_skills': ['React', 'JavaScript', 'TypeScript', 'CSS', 'Git'],
            'preferred_skills': ['Next.js', 'Redux', 'Jest', 'Cypress', 'Docker'],
            'tags': ['React', 'Frontend', 'JavaScript', 'TypeScript', 'UI']
        },
        {
            'title': 'Vue.js Developer',
            'company': 'Vue Solutions',
            'location': 'Rabat, Morocco',
            'description': 'Develop Vue.js applications with modern development practices.',
            'requirements': '2+ years Vue.js experience, JavaScript, component architecture',
            'job_type': 'full-time',
            'seniority': 'mid',
            'salary_min': 12000,
            'salary_max': 18000,
            'salary_currency': 'MAD',
            'remote': True,
            'status': 'active',
            'required_skills': ['Vue.js', 'JavaScript', 'CSS', 'Git'],
            'preferred_skills': ['Nuxt.js', 'TypeScript', 'Jest', 'Docker'],
            'tags': ['Vue.js', 'Frontend', 'JavaScript', 'UI']
        },
        {
            'title': 'Angular Developer',
            'company': 'Enterprise Apps',
            'location': 'Casablanca, Morocco',
            'description': 'Build enterprise Angular applications with complex business logic.',
            'requirements': '3+ years Angular experience, TypeScript, enterprise development',
            'job_type': 'full-time',
            'seniority': 'mid',
            'salary_min': 14000,
            'salary_max': 22000,
            'salary_currency': 'MAD',
            'remote': False,
            'status': 'active',
            'required_skills': ['Angular', 'TypeScript', 'JavaScript', 'CSS', 'Git'],
            'preferred_skills': ['RxJS', 'Jest', 'Docker', 'AWS'],
            'tags': ['Angular', 'Frontend', 'TypeScript', 'Enterprise']
        },
        
        # Backend Development Jobs
        {
            'title': 'Senior Python Backend Developer',
            'company': 'Backend Systems Inc',
            'location': 'Casablanca, Morocco',
            'description': 'Design and develop scalable backend systems and APIs.',
            'requirements': '5+ years Python backend, Django/FastAPI, microservices, databases',
            'job_type': 'full-time',
            'seniority': 'senior',
            'salary_min': 18000,
            'salary_max': 30000,
            'salary_currency': 'MAD',
            'remote': True,
            'status': 'active',
            'required_skills': ['Python', 'Django', 'FastAPI', 'PostgreSQL', 'Redis', 'Docker'],
            'preferred_skills': ['AWS', 'Kubernetes', 'Apache Kafka', 'Elasticsearch'],
            'tags': ['Python', 'Backend', 'API', 'Microservices', 'Django']
        },
        {
            'title': 'Node.js Developer',
            'company': 'JavaScript Experts',
            'location': 'Rabat, Morocco',
            'description': 'Build server-side applications with Node.js and modern JavaScript.',
            'requirements': '3+ years Node.js experience, Express.js, databases, API development',
            'job_type': 'full-time',
            'seniority': 'mid',
            'salary_min': 13000,
            'salary_max': 20000,
            'salary_currency': 'MAD',
            'remote': True,
            'status': 'active',
            'required_skills': ['Node.js', 'JavaScript', 'Express.js', 'MongoDB', 'Git'],
            'preferred_skills': ['TypeScript', 'Docker', 'AWS', 'GraphQL'],
            'tags': ['Node.js', 'Backend', 'JavaScript', 'API']
        },
        {
            'title': 'Java Spring Boot Developer',
            'company': 'Enterprise Java Corp',
            'location': 'Casablanca, Morocco',
            'description': 'Develop enterprise Java applications with Spring Boot framework.',
            'requirements': '4+ years Java experience, Spring Boot, microservices, databases',
            'job_type': 'full-time',
            'seniority': 'senior',
            'salary_min': 16000,
            'salary_max': 28000,
            'salary_currency': 'MAD',
            'remote': False,
            'status': 'active',
            'required_skills': ['Java', 'Spring Boot', 'PostgreSQL', 'Git', 'Docker'],
            'preferred_skills': ['Microservices', 'AWS', 'Kubernetes', 'Apache Kafka'],
            'tags': ['Java', 'Spring Boot', 'Backend', 'Enterprise']
        },
        
        # Mobile Development Jobs
        {
            'title': 'React Native Developer',
            'company': 'Mobile Solutions',
            'location': 'Casablanca, Morocco',
            'description': 'Develop cross-platform mobile applications with React Native.',
            'requirements': '3+ years React Native experience, mobile development, JavaScript',
            'job_type': 'full-time',
            'seniority': 'mid',
            'salary_min': 14000,
            'salary_max': 22000,
            'salary_currency': 'MAD',
            'remote': True,
            'status': 'active',
            'required_skills': ['React Native', 'JavaScript', 'Git', 'iOS Development', 'Android Development'],
            'preferred_skills': ['TypeScript', 'Docker', 'AWS', 'Firebase'],
            'tags': ['React Native', 'Mobile', 'Cross-platform', 'JavaScript']
        },
        {
            'title': 'Flutter Developer',
            'company': 'Cross Platform Apps',
            'location': 'Rabat, Morocco',
            'description': 'Build beautiful mobile apps with Flutter and Dart.',
            'requirements': '2+ years Flutter experience, Dart, mobile UI/UX',
            'job_type': 'full-time',
            'seniority': 'mid',
            'salary_min': 12000,
            'salary_max': 19000,
            'salary_currency': 'MAD',
            'remote': True,
            'status': 'active',
            'required_skills': ['Flutter', 'Dart', 'Git', 'iOS Development', 'Android Development'],
            'preferred_skills': ['Firebase', 'Docker', 'AWS'],
            'tags': ['Flutter', 'Mobile', 'Dart', 'Cross-platform']
        },
        {
            'title': 'iOS Developer',
            'company': 'Apple Development Studio',
            'location': 'Casablanca, Morocco',
            'description': 'Create native iOS applications with Swift and modern iOS frameworks.',
            'requirements': '3+ years iOS development, Swift, UIKit/SwiftUI, Xcode',
            'job_type': 'full-time',
            'seniority': 'mid',
            'salary_min': 15000,
            'salary_max': 25000,
            'salary_currency': 'MAD',
            'remote': False,
            'status': 'active',
            'required_skills': ['Swift', 'iOS Development', 'Xcode', 'Git'],
            'preferred_skills': ['SwiftUI', 'Core Data', 'Firebase', 'Docker'],
            'tags': ['iOS', 'Swift', 'Mobile', 'Native']
        },
        
        # DevOps & Cloud Jobs
        {
            'title': 'DevOps Engineer',
            'company': 'Cloud Infrastructure',
            'location': 'Casablanca, Morocco',
            'description': 'Manage cloud infrastructure and CI/CD pipelines.',
            'requirements': '4+ years DevOps experience, AWS/Azure, Docker, Kubernetes',
            'job_type': 'full-time',
            'seniority': 'senior',
            'salary_min': 20000,
            'salary_max': 32000,
            'salary_currency': 'MAD',
            'remote': True,
            'status': 'active',
            'required_skills': ['Docker', 'Kubernetes', 'AWS', 'Git', 'Jenkins'],
            'preferred_skills': ['Terraform', 'Ansible', 'Azure', 'GCP', 'GitLab CI'],
            'tags': ['DevOps', 'Cloud', 'Docker', 'Kubernetes', 'AWS']
        },
        {
            'title': 'Cloud Solutions Architect',
            'company': 'Cloud Consulting',
            'location': 'Rabat, Morocco',
            'description': 'Design and implement cloud solutions for enterprise clients.',
            'requirements': '5+ years cloud architecture, AWS/Azure, microservices, security',
            'job_type': 'full-time',
            'seniority': 'senior',
            'salary_min': 25000,
            'salary_max': 40000,
            'salary_currency': 'MAD',
            'remote': True,
            'status': 'active',
            'required_skills': ['AWS', 'Azure', 'Docker', 'Kubernetes', 'Terraform'],
            'preferred_skills': ['GCP', 'Ansible', 'Security', 'Microservices'],
            'tags': ['Cloud', 'Architecture', 'AWS', 'Azure', 'Solutions']
        },
        
        # Full Stack Development Jobs
        {
            'title': 'Full Stack Developer',
            'company': 'Full Stack Solutions',
            'location': 'Marrakech, Morocco',
            'description': 'Develop both frontend and backend components of web applications.',
            'requirements': '3+ years full stack development, React, Node.js, databases',
            'job_type': 'full-time',
            'seniority': 'mid',
            'salary_min': 15000,
            'salary_max': 24000,
            'salary_currency': 'MAD',
            'remote': True,
            'status': 'active',
            'required_skills': ['React', 'Node.js', 'JavaScript', 'PostgreSQL', 'Git'],
            'preferred_skills': ['TypeScript', 'Docker', 'AWS', 'GraphQL'],
            'tags': ['Full Stack', 'React', 'Node.js', 'JavaScript']
        },
        {
            'title': 'MEAN Stack Developer',
            'company': 'JavaScript Full Stack',
            'location': 'Casablanca, Morocco',
            'description': 'Develop applications using MongoDB, Express.js, Angular, and Node.js.',
            'requirements': '3+ years MEAN stack, Angular, Node.js, MongoDB, Express.js',
            'job_type': 'full-time',
            'seniority': 'mid',
            'salary_min': 14000,
            'salary_max': 22000,
            'salary_currency': 'MAD',
            'remote': True,
            'status': 'active',
            'required_skills': ['MongoDB', 'Express.js', 'Angular', 'Node.js', 'JavaScript'],
            'preferred_skills': ['TypeScript', 'Docker', 'AWS', 'Git'],
            'tags': ['MEAN Stack', 'MongoDB', 'Angular', 'Node.js']
        },
        
        # UI/UX Design Jobs
        {
            'title': 'UI/UX Designer',
            'company': 'Design Studio',
            'location': 'Casablanca, Morocco',
            'description': 'Create user-centered designs for web and mobile applications.',
            'requirements': '3+ years UI/UX design, Figma, user research, prototyping',
            'job_type': 'full-time',
            'seniority': 'mid',
            'salary_min': 10000,
            'salary_max': 18000,
            'salary_currency': 'MAD',
            'remote': True,
            'status': 'active',
            'required_skills': ['UI/UX Design', 'Figma', 'Photoshop', 'Illustrator'],
            'preferred_skills': ['Sketch', 'Adobe XD', 'CSS', 'JavaScript'],
            'tags': ['UI/UX', 'Design', 'Figma', 'User Experience']
        },
        {
            'title': 'Frontend Designer/Developer',
            'company': 'Creative Tech',
            'location': 'Rabat, Morocco',
            'description': 'Combine design skills with frontend development capabilities.',
            'requirements': '2+ years design + development, Figma, React, CSS',
            'job_type': 'full-time',
            'seniority': 'mid',
            'salary_min': 12000,
            'salary_max': 20000,
            'salary_currency': 'MAD',
            'remote': True,
            'status': 'active',
            'required_skills': ['UI/UX Design', 'Figma', 'React', 'CSS', 'JavaScript'],
            'preferred_skills': ['TypeScript', 'Tailwind CSS', 'Git'],
            'tags': ['Design', 'Frontend', 'React', 'UI/UX']
        },
        
        # Testing & QA Jobs
        {
            'title': 'QA Automation Engineer',
            'company': 'Quality Assurance Inc',
            'location': 'Casablanca, Morocco',
            'description': 'Develop and maintain automated testing frameworks and test suites.',
            'requirements': '3+ years QA automation, Selenium, Python/JavaScript, testing frameworks',
            'job_type': 'full-time',
            'seniority': 'mid',
            'salary_min': 12000,
            'salary_max': 20000,
            'salary_currency': 'MAD',
            'remote': True,
            'status': 'active',
            'required_skills': ['Selenium', 'Python', 'JavaScript', 'Unit Testing', 'Git'],
            'preferred_skills': ['Cypress', 'Jest', 'Docker', 'AWS'],
            'tags': ['QA', 'Automation', 'Testing', 'Selenium', 'Python']
        },
        {
            'title': 'Test Engineer',
            'company': 'Testing Solutions',
            'location': 'Marrakech, Morocco',
            'description': 'Design and execute test plans for software applications.',
            'requirements': '2+ years testing experience, manual testing, test planning',
            'job_type': 'full-time',
            'seniority': 'junior',
            'salary_min': 8000,
            'salary_max': 14000,
            'salary_currency': 'MAD',
            'remote': False,
            'status': 'active',
            'required_skills': ['Unit Testing', 'Integration Testing', 'Git'],
            'preferred_skills': ['Selenium', 'Python', 'Jest', 'Cypress'],
            'tags': ['Testing', 'QA', 'Manual Testing', 'Test Planning']
        },
        
        # Emerging Technologies
        {
            'title': 'Blockchain Developer',
            'company': 'Crypto Innovations',
            'location': 'Casablanca, Morocco',
            'description': 'Develop blockchain applications and smart contracts.',
            'requirements': '2+ years blockchain development, Solidity, Web3, smart contracts',
            'job_type': 'full-time',
            'seniority': 'mid',
            'salary_min': 18000,
            'salary_max': 30000,
            'salary_currency': 'MAD',
            'remote': True,
            'status': 'active',
            'required_skills': ['Solidity', 'Web3', 'JavaScript', 'Git'],
            'preferred_skills': ['Python', 'Docker', 'AWS', 'Blockchain'],
            'tags': ['Blockchain', 'Web3', 'Solidity', 'Crypto']
        },
        {
            'title': 'AR/VR Developer',
            'company': 'Immersive Technologies',
            'location': 'Rabat, Morocco',
            'description': 'Create augmented and virtual reality experiences.',
            'requirements': '2+ years AR/VR development, Unity, C#, 3D development',
            'job_type': 'full-time',
            'seniority': 'mid',
            'salary_min': 15000,
            'salary_max': 25000,
            'salary_currency': 'MAD',
            'remote': False,
            'status': 'active',
            'required_skills': ['Unity', 'C#', 'AR/VR', 'Git'],
            'preferred_skills': ['Unreal Engine', 'Python', 'Docker'],
            'tags': ['AR/VR', 'Unity', 'C#', 'Immersive']
        },
        
        # Internship & Junior Positions
        {
            'title': 'Junior Python Developer',
            'company': 'Tech Startup',
            'location': 'Casablanca, Morocco',
            'description': 'Entry-level Python development position with mentorship.',
            'requirements': 'Python basics, willingness to learn, computer science background',
            'job_type': 'full-time',
            'seniority': 'junior',
            'salary_min': 6000,
            'salary_max': 10000,
            'salary_currency': 'MAD',
            'remote': False,
            'status': 'active',
            'required_skills': ['Python', 'Git'],
            'preferred_skills': ['Django', 'PostgreSQL', 'Docker'],
            'tags': ['Python', 'Junior', 'Entry Level', 'Learning']
        },
        {
            'title': 'Frontend Intern',
            'company': 'Web Development Agency',
            'location': 'Marrakech, Morocco',
            'description': 'Internship opportunity to learn modern frontend development.',
            'requirements': 'HTML/CSS basics, JavaScript interest, portfolio projects',
            'job_type': 'internship',
            'seniority': 'junior',
            'salary_min': 3000,
            'salary_max': 5000,
            'salary_currency': 'MAD',
            'remote': False,
            'status': 'active',
            'required_skills': ['CSS', 'Git'],
            'preferred_skills': ['JavaScript', 'React', 'Vue.js'],
            'tags': ['Internship', 'Frontend', 'Learning', 'CSS']
        },
    ]
    
    # Create job offers
    created_count = 0
    for job_data in job_offers_data:
        # Extract skills and tags
        required_skills = job_data.pop('required_skills', [])
        preferred_skills = job_data.pop('preferred_skills', [])
        tags = job_data.pop('tags', [])
        
        # Set dates
        job_data['expires_at'] = timezone.now() + timedelta(days=30)
        job_data['posted_at'] = timezone.now()
        
        # Create job offer
        job_offer, created = JobOffer.objects.get_or_create(
            title=job_data['title'],
            company=job_data['company'],
            defaults=job_data
        )
        
        if created:
            # Add required skills
            for skill_name in required_skills:
                if skill_name in skills:
                    job_offer.required_skills.add(skills[skill_name])
            
            # Add preferred skills
            for skill_name in preferred_skills:
                if skill_name in skills:
                    job_offer.preferred_skills.add(skills[skill_name])
            
            print(f"Created: {job_data['title']} at {job_data['company']}")
            created_count += 1
        else:
            print(f"Already exists: {job_data['title']} at {job_data['company']}")
    
    print(f"\n📊 Job Creation Summary:")
    print(f"✅ New jobs created: {created_count}")
    print(f"📈 Total jobs in database: {JobOffer.objects.count()}")
    print(f"🟢 Active jobs: {JobOffer.objects.filter(status='active').count()}")
    
    # Print skill statistics
    all_skills = Skill.objects.all()
    print(f"\n🔧 Skills Database:")
    print(f"📚 Total unique skills: {all_skills.count()}")
    
    # Count skill usage
    skill_counts = {}
    for job in JobOffer.objects.all():
        for skill in job.required_skills.all():
            skill_counts[skill.name] = skill_counts.get(skill.name, 0) + 1
        for skill in job.preferred_skills.all():
            skill_counts[skill.name] = skill_counts.get(skill.name, 0) + 1
    
    print(f"\n🏆 Top 15 Most Demanded Skills:")
    sorted_skills = sorted(skill_counts.items(), key=lambda x: x[1], reverse=True)
    for i, (skill, count) in enumerate(sorted_skills[:15], 1):
        print(f"  {i:2d}. {skill:<20} - {count:2d} jobs")
    
    # Print job categories
    print(f"\n📋 Job Categories:")
    categories = {}
    for job in JobOffer.objects.all():
        seniority = job.seniority
        categories[seniority] = categories.get(seniority, 0) + 1
    
    for category, count in sorted(categories.items()):
        print(f"  {category.capitalize():<10} - {count:2d} jobs")
    
    print(f"\n🎯 Recommendation Algorithm Ready!")
    print(f"   The advanced algorithm can now work with {JobOffer.objects.count()} diverse job offers")
    print(f"   covering {len(skill_counts)} different skills across multiple domains.")

if __name__ == '__main__':
    create_comprehensive_jobs()

