"""
Django management command to seed realistic Moroccan job offers
Creates 200+ job offers across multiple sectors with realistic data
"""

import random
from django.core.management.base import BaseCommand
from django.utils import timezone
from recommendation.models import JobOffer
from skills.models import Skill


class Command(BaseCommand):
    help = 'Seed database with realistic Moroccan job offers'
    
    def add_arguments(self, parser):
        parser.add_argument(
            '--count',
            type=int,
            default=200,
            help='Number of job offers to create (default: 200)'
        )
        parser.add_argument(
            '--clear',
            action='store_true',
            help='Clear existing seeded jobs before creating new ones'
        )
    
    def handle(self, *args, **options):
        count = options['count']
        
        if options['clear']:
            deleted_count = JobOffer.objects.filter(source_type='seed').count()
            JobOffer.objects.filter(source_type='seed').delete()
            self.stdout.write(f"Cleared {deleted_count} existing seeded jobs")
        
        self.stdout.write(f"Creating {count} Moroccan job offers...")
        
        # Create job offers
        created_jobs = self.create_job_offers(count)
        
        self.stdout.write(
            self.style.SUCCESS(f'Successfully created {len(created_jobs)} job offers')
        )
        
        # Display summary
        self.display_summary(created_jobs)
    
    def create_job_offers(self, count):
        """Create realistic Moroccan job offers"""
        
        # Moroccan cities
        cities = [
            'Casablanca', 'Rabat', 'Marrakech', 'Tangier', 'Fes', 
            'Agadir', 'Meknes', 'Oujda', 'Kenitra', 'Tetouan'
        ]
        
        # Companies (mix of real and fictional)
        companies = [
            'Attijariwafa Bank', 'BMCE Bank', 'Maroc Telecom', 'OCP Group',
            'ONCF', 'Royal Air Maroc', 'LafargeHolcim Maroc', 'Managem',
            'TechnoSoft', 'DataLab Morocco', 'InnovaTech', 'WebCorp',
            'DigitalSolutions', 'CloudTech MA', 'AI Systems', 'DevFactory',
            'StartupHub', 'TechVenture', 'CodeCraft', 'ByteWorks',
            'Consulting Plus', 'Business Solutions', 'Enterprise Systems',
            'Global Services', 'Professional Corp', 'Excellence Group'
        ]
        
        # Job templates with realistic data
        job_templates = [
            # Software Development
            {
                'title': 'Backend Developer (Python/Django)',
                'seniority': 'intermediate',
                'salary_range': (12000, 18000),
                'required_skills': ['Python', 'Django', 'PostgreSQL'],
                'preferred_skills': ['Redis', 'Docker', 'Git'],
                'description': 'Développeur backend expérimenté pour applications web. Maîtrise de Python/Django requise.',
                'remote_chance': 0.7
            },
            {
                'title': 'Frontend Developer (React)',
                'seniority': 'junior',
                'salary_range': (8000, 12000),
                'required_skills': ['JavaScript', 'React', 'HTML'],
                'preferred_skills': ['TypeScript', 'CSS', 'Git'],
                'description': 'Développeur frontend junior pour interfaces utilisateur modernes.',
                'remote_chance': 0.6
            },
            {
                'title': 'Full Stack Developer',
                'seniority': 'senior',
                'salary_range': (18000, 25000),
                'required_skills': ['JavaScript', 'Python', 'React', 'Django'],
                'preferred_skills': ['Docker', 'AWS', 'PostgreSQL'],
                'description': 'Développeur full stack senior pour projets complexes.',
                'remote_chance': 0.8
            },
            {
                'title': 'Data Scientist',
                'seniority': 'intermediate',
                'salary_range': (15000, 22000),
                'required_skills': ['Python', 'Machine Learning', 'SQL'],
                'preferred_skills': ['TensorFlow', 'Pandas', 'Jupyter'],
                'description': 'Data scientist pour analyse de données et modèles ML.',
                'remote_chance': 0.5
            },
            {
                'title': 'DevOps Engineer',
                'seniority': 'senior',
                'salary_range': (20000, 28000),
                'required_skills': ['Docker', 'Kubernetes', 'Linux'],
                'preferred_skills': ['AWS', 'Terraform', 'Jenkins'],
                'description': 'Ingénieur DevOps pour infrastructure cloud et CI/CD.',
                'remote_chance': 0.9
            },
            {
                'title': 'Mobile Developer (Flutter)',
                'seniority': 'intermediate',
                'salary_range': (13000, 19000),
                'required_skills': ['Flutter', 'Dart', 'Mobile Development'],
                'preferred_skills': ['Firebase', 'Git', 'REST APIs'],
                'description': 'Développeur mobile Flutter pour applications cross-platform.',
                'remote_chance': 0.6
            },
            {
                'title': 'QA Engineer',
                'seniority': 'junior',
                'salary_range': (9000, 13000),
                'required_skills': ['Testing', 'Selenium', 'Java'],
                'preferred_skills': ['Automation', 'Git', 'Agile'],
                'description': 'Ingénieur QA pour tests automatisés et manuels.',
                'remote_chance': 0.4
            },
            {
                'title': 'Database Administrator',
                'seniority': 'senior',
                'salary_range': (16000, 24000),
                'required_skills': ['PostgreSQL', 'MySQL', 'SQL'],
                'preferred_skills': ['MongoDB', 'Redis', 'Backup'],
                'description': 'Administrateur de bases de données expérimenté.',
                'remote_chance': 0.3
            },
            {
                'title': 'UI/UX Designer',
                'seniority': 'intermediate',
                'salary_range': (11000, 16000),
                'required_skills': ['Figma', 'Adobe XD', 'UI Design'],
                'preferred_skills': ['Photoshop', 'Illustrator', 'Prototyping'],
                'description': 'Designer UI/UX pour expériences utilisateur exceptionnelles.',
                'remote_chance': 0.8
            },
            {
                'title': 'Project Manager IT',
                'seniority': 'senior',
                'salary_range': (17000, 25000),
                'required_skills': ['Project Management', 'Agile', 'Scrum'],
                'preferred_skills': ['JIRA', 'Confluence', 'Leadership'],
                'description': 'Chef de projet IT pour gestion d\'équipes techniques.',
                'remote_chance': 0.5
            }
        ]
        
        created_jobs = []
        
        for i in range(count):
            # Select random template and customize
            template = random.choice(job_templates)
            company = random.choice(companies)
            city = random.choice(cities)
            
            # Add some variation to salary
            salary_min, salary_max = template['salary_range']
            variation = random.uniform(0.9, 1.1)
            salary_min = int(salary_min * variation)
            salary_max = int(salary_max * variation)
            
            # Determine if remote
            is_remote = random.random() < template['remote_chance']
            
            # Create job offer
            job_offer = JobOffer.objects.create(
                title=template['title'],
                company=company,
                location=f"{city}, Morocco",
                city=city,
                seniority=template['seniority'],
                salary_min=salary_min,
                salary_max=salary_max,
                currency='MAD',
                remote_flag=is_remote,
                description=template['description'],
                requirements=f"Expérience requise: {template['seniority']}. Compétences techniques nécessaires.",
                benefits="Assurance santé, formation continue, environnement dynamique",
                industry="Technology",
                company_size=random.choice(['startup', 'medium', 'large']),
                source_type='seed',
                source_id=f'seed_{i+1}',
                status='active'
            )
            
            # Add skills
            self.add_skills_to_job(job_offer, template['required_skills'], template['preferred_skills'])
            
            created_jobs.append(job_offer)
            
            if (i + 1) % 50 == 0:
                self.stdout.write(f"Created {i + 1} jobs...")
        
        return created_jobs
    
    def add_skills_to_job(self, job_offer, required_skill_names, preferred_skill_names):
        """Add skills to job offer"""
        
        # Get or create required skills
        for skill_name in required_skill_names:
            skill, created = Skill.objects.get_or_create(
                name=skill_name,
                defaults={'category': self.get_skill_category(skill_name)}
            )
            job_offer.required_skills.add(skill)
        
        # Get or create preferred skills
        for skill_name in preferred_skill_names:
            skill, created = Skill.objects.get_or_create(
                name=skill_name,
                defaults={'category': self.get_skill_category(skill_name)}
            )
            job_offer.preferred_skills.add(skill)
    
    def get_skill_category(self, skill_name):
        """Determine skill category based on name"""
        skill_categories = {
            'programming': ['Python', 'Java', 'JavaScript', 'C++', 'C#', 'PHP', 'Ruby', 'Go', 'Rust'],
            'frontend': ['React', 'Vue.js', 'Angular', 'HTML', 'CSS', 'TypeScript', 'jQuery'],
            'backend': ['Django', 'Flask', 'Spring', 'Express.js', 'Laravel', 'Rails'],
            'database': ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'SQLite', 'Oracle'],
            'devops': ['Docker', 'Kubernetes', 'AWS', 'Azure', 'Jenkins', 'Terraform', 'Linux'],
            'mobile': ['Flutter', 'React Native', 'iOS', 'Android', 'Dart', 'Swift', 'Kotlin'],
            'testing': ['Testing', 'Selenium', 'Jest', 'PyTest', 'JUnit', 'Automation'],
            'other': ['Git', 'JIRA', 'Figma', 'Adobe XD', 'Photoshop', 'Machine Learning']
        }
        
        for category, skills in skill_categories.items():
            if skill_name in skills:
                return category
        
        return 'other'
    
    def display_summary(self, created_jobs):
        """Display summary of created jobs"""
        
        # Count by city
        city_counts = {}
        seniority_counts = {}
        remote_count = 0
        
        for job in created_jobs:
            city_counts[job.city] = city_counts.get(job.city, 0) + 1
            seniority_counts[job.seniority] = seniority_counts.get(job.seniority, 0) + 1
            if job.remote_flag:
                remote_count += 1
        
        self.stdout.write("\n=== Job Creation Summary ===")
        self.stdout.write(f"Total jobs created: {len(created_jobs)}")
        self.stdout.write(f"Remote jobs: {remote_count} ({remote_count/len(created_jobs)*100:.1f}%)")
        
        self.stdout.write("\nBy city:")
        for city, count in sorted(city_counts.items()):
            self.stdout.write(f"  {city}: {count}")
        
        self.stdout.write("\nBy seniority:")
        for seniority, count in sorted(seniority_counts.items()):
            self.stdout.write(f"  {seniority}: {count}")
        
        # Salary ranges
        salaries = [(job.salary_min + job.salary_max) / 2 for job in created_jobs if job.salary_min and job.salary_max]
        if salaries:
            avg_salary = sum(salaries) / len(salaries)
            min_salary = min(salaries)
            max_salary = max(salaries)
            self.stdout.write(f"\nSalary ranges (MAD):")
            self.stdout.write(f"  Average: {avg_salary:.0f}")
            self.stdout.write(f"  Range: {min_salary:.0f} - {max_salary:.0f}")
