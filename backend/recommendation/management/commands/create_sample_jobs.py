"""
Management command to create sample job offers for testing
"""
from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from recommendation.models import JobOffer
from skills.models import Skill

class Command(BaseCommand):
 help = 'Create sample job offers for testing'

 def add_arguments(self, parser):
 parser.add_argument(
 '--count',
 type=int,
 default=20,
 help='Number of sample jobs to create (default: 20)'
 )
 parser.add_argument(
 '--clear',
 action='store_true',
 help='Clear existing job offers before creating new ones'
 )

 def handle(self, *args, **options):
 count = options.get('count')
 clear = options.get('clear')

 if clear:
 self.stdout.write('Clearing existing job offers...')
 JobOffer.objects.all().delete()

 # Get some skills for the jobs
 skills = list(Skill.objects.all())
 if not skills:
 self.stdout.write(
 self.style.ERROR('No skills found. Please create some skills first.')
 )
 return

 # Sample job data
 sample_jobs = [
 {
 'title': 'Développeur Python Senior',
 'company': 'TechCorp Morocco',
 'description': 'Nous recherchons un développeur Python expérimenté pour rejoindre notre équipe de développement backend.',
 'requirements': 'Maîtrise de Python, Django, PostgreSQL, Docker, Git',
 'responsibilities': 'Développement d\'APIs REST, maintenance du code existant, collaboration avec l\'équipe frontend',
 'job_type': 'CDI',
 'seniority': 'senior',
 'location': 'Casablanca, Maroc',
 'city': 'Casablanca',
 'remote': True,
 'salary_min': 15000,
 'salary_max': 25000,
 'contact_email': 'hr@techcorp.ma',
 'benefits': 'Assurance santé, prime de transport, formation continue',
 'company_size': '50-200 employés',
 'industry': 'Technologie',
 'tags': ['python', 'django', 'backend', 'api', 'postgresql']
 },
 {
 'title': 'Développeur React.js',
 'company': 'Digital Agency',
 'description': 'Rejoignez notre équipe créative en tant que développeur frontend React.js.',
 'requirements': 'React.js, JavaScript ES6+, HTML5, CSS3, Redux',
 'responsibilities': 'Développement d\'interfaces utilisateur, intégration avec APIs, optimisation des performances',
 'job_type': 'CDI',
 'seniority': 'mid',
 'location': 'Rabat, Maroc',
 'city': 'Rabat',
 'remote': False,
 'salary_min': 8000,
 'salary_max': 15000,
 'contact_email': 'jobs@digitalagency.ma',
 'benefits': 'Environnement de travail moderne, équipe jeune et dynamique',
 'company_size': '20-50 employés',
 'industry': 'Marketing Digital',
 'tags': ['react', 'javascript', 'frontend', 'ui', 'ux']
 },
 {
 'title': 'Stagiaire Développeur Full Stack',
 'company': 'StartupTech',
 'description': 'Stage de 6 mois pour apprendre le développement full stack avec notre équipe expérimentée.',
 'requirements': 'Bases en programmation, motivation, esprit d\'équipe',
 'responsibilities': 'Apprentissage des technologies web, participation aux projets, formation continue',
 'job_type': 'Stage',
 'seniority': 'junior',
 'location': 'Marrakech, Maroc',
 'city': 'Marrakech',
 'remote': True,
 'salary_min': 3000,
 'salary_max': 5000,
 'contact_email': 'stage@startuptech.ma',
 'benefits': 'Formation gratuite, mentorat, possibilité d\'embauche',
 'company_size': '10-20 employés',
 'industry': 'Startup',
 'tags': ['stage', 'formation', 'fullstack', 'apprentissage']
 },
 {
 'title': 'DevOps Engineer',
 'company': 'Cloud Solutions',
 'description': 'Nous cherchons un ingénieur DevOps pour gérer notre infrastructure cloud.',
 'requirements': 'AWS, Docker, Kubernetes, CI/CD, Linux, Bash',
 'responsibilities': 'Gestion de l\'infrastructure, automatisation des déploiements, monitoring',
 'job_type': 'CDI',
 'seniority': 'senior',
 'location': 'Casablanca, Maroc',
 'city': 'Casablanca',
 'remote': True,
 'salary_min': 18000,
 'salary_max': 30000,
 'contact_email': 'careers@cloudsolutions.ma',
 'benefits': 'Salaire compétitif, télétravail, équipement fourni',
 'company_size': '100-500 employés',
 'industry': 'Cloud Computing',
 'tags': ['devops', 'aws', 'docker', 'kubernetes', 'ci-cd']
 },
 {
 'title': 'Développeur Mobile Flutter',
 'company': 'MobileFirst',
 'description': 'Développement d\'applications mobiles cross-platform avec Flutter.',
 'requirements': 'Flutter, Dart, Android/iOS, Firebase, Git',
 'responsibilities': 'Développement d\'apps mobiles, tests, déploiement sur les stores',
 'job_type': 'CDI',
 'seniority': 'mid',
 'location': 'Fès, Maroc',
 'city': 'Fès',
 'remote': False,
 'salary_min': 10000,
 'salary_max': 18000,
 'contact_email': 'jobs@mobilefirst.ma',
 'benefits': 'Projets innovants, équipe créative, formation continue',
 'company_size': '30-100 employés',
 'industry': 'Mobile',
 'tags': ['flutter', 'dart', 'mobile', 'android', 'ios']
 }
 ]

 # Create additional variations
 import random
 companies = ['TechCorp Morocco', 'Digital Agency', 'StartupTech', 'Cloud Solutions', 'MobileFirst',
 'WebStudio', 'DataLab', 'InnovateHub', 'CodeCraft', 'DevTeam']
 cities = ['Casablanca', 'Rabat', 'Marrakech', 'Fès', 'Agadir', 'Tanger', 'Meknès', 'Oujda']
 job_titles = [
 'Développeur Python', 'Développeur JavaScript', 'Développeur Java', 'Développeur PHP',
 'Développeur React', 'Développeur Vue.js', 'Développeur Angular', 'Développeur Node.js',
 'Développeur Full Stack', 'Développeur Backend', 'Développeur Frontend', 'Développeur Mobile',
 'DevOps Engineer', 'Data Scientist', 'Machine Learning Engineer', 'UI/UX Designer',
 'Product Manager', 'Scrum Master', 'QA Engineer', 'System Administrator'
 ]

 created_count = 0

 for i in range(count):
 # Use sample data or create variations
 if i < len(sample_jobs):
 job_data = sample_jobs[i]
 else:
 # Create variations
 job_data = {
 'title': random.choice(job_titles),
 'company': random.choice(companies),
 'description': f'Description du poste de {random.choice(job_titles).lower()}.',
 'requirements': 'Compétences techniques requises, expérience souhaitée.',
 'responsibilities': 'Responsabilités du poste, missions principales.',
 'job_type': random.choice(['CDI', 'CDD', 'Stage', 'Freelance']),
 'seniority': random.choice(['junior', 'mid', 'senior', 'lead']),
 'location': f'{random.choice(cities)}, Maroc',
 'city': random.choice(cities),
 'remote': random.choice([True, False]),
 'salary_min': random.randint(5000, 15000),
 'salary_max': random.randint(15000, 35000),
 'contact_email': f'hr@{random.choice(companies).lower().replace(" ", "")}.ma',
 'benefits': 'Avantages sociaux, environnement de travail agréable',
 'company_size': random.choice(['10-20', '20-50', '50-200', '200+']) + ' employés',
 'industry': random.choice(['Technologie', 'Finance', 'E-commerce', 'Santé', 'Éducation']),
 'tags': random.sample(['python', 'javascript', 'react', 'django', 'node', 'vue', 'angular', 'mobile', 'devops', 'data'], 3)
 }

 # Create job offer
 job = JobOffer.objects.create(**job_data)

 # Add random skills
 required_skills = random.sample(skills, min(3, len(skills)))
 job.required_skills.set(required_skills)

 # Set expiration date (30-90 days from now)
 job.expires_at = timezone.now() + timedelta(days=random.randint(30, 90))
 job.save()

 created_count += 1

 self.stdout.write(
 self.style.SUCCESS(f'Successfully created {created_count} sample job offers')
 )
