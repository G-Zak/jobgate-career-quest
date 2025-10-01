from django.core.management.base import BaseCommand
from skills.models import Skill

class Command(BaseCommand):
 help = 'Add sample skills to the database'

 def handle(self, *args, **options):
 skills_data = [
 # Programming Languages
 {'name': 'Python', 'category': 'programming', 'description': 'High-level programming language for web development, data science, and automation'},
 {'name': 'JavaScript', 'category': 'programming', 'description': 'Dynamic programming language for web development and server-side applications'},
 {'name': 'Java', 'category': 'programming', 'description': 'Object-oriented programming language for enterprise applications'},
 {'name': 'C++', 'category': 'programming', 'description': 'High-performance programming language for system programming and game development'},
 {'name': 'C#', 'category': 'programming', 'description': 'Microsoft programming language for .NET applications'},
 {'name': 'Go', 'category': 'programming', 'description': 'Google programming language for cloud-native applications'},
 {'name': 'Rust', 'category': 'programming', 'description': 'Systems programming language focused on safety and performance'},
 {'name': 'PHP', 'category': 'programming', 'description': 'Server-side scripting language for web development'},

 # Frontend Technologies
 {'name': 'React', 'category': 'frontend', 'description': 'JavaScript library for building user interfaces'},
 {'name': 'Vue.js', 'category': 'frontend', 'description': 'Progressive JavaScript framework for building UIs'},
 {'name': 'Angular', 'category': 'frontend', 'description': 'TypeScript-based web application framework'},
 {'name': 'HTML5', 'category': 'frontend', 'description': 'Markup language for structuring web content'},
 {'name': 'CSS3', 'category': 'frontend', 'description': 'Styling language for web presentation'},
 {'name': 'TypeScript', 'category': 'frontend', 'description': 'Typed superset of JavaScript for large-scale applications'},
 {'name': 'Sass/SCSS', 'category': 'frontend', 'description': 'CSS preprocessor for enhanced styling capabilities'},
 {'name': 'Webpack', 'category': 'frontend', 'description': 'Module bundler for JavaScript applications'},

 # Backend Technologies
 {'name': 'Django', 'category': 'backend', 'description': 'High-level Python web framework'},
 {'name': 'Flask', 'category': 'backend', 'description': 'Lightweight Python web framework'},
 {'name': 'Node.js', 'category': 'backend', 'description': 'JavaScript runtime for server-side development'},
 {'name': 'Express.js', 'category': 'backend', 'description': 'Web application framework for Node.js'},
 {'name': 'Spring Boot', 'category': 'backend', 'description': 'Java framework for microservices and web applications'},
 {'name': 'FastAPI', 'category': 'backend', 'description': 'Modern Python web framework for APIs'},
 {'name': 'Laravel', 'category': 'backend', 'description': 'PHP web application framework'},
 {'name': 'Ruby on Rails', 'category': 'backend', 'description': 'Ruby web application framework'},

 # Database Technologies
 {'name': 'PostgreSQL', 'category': 'database', 'description': 'Advanced open-source relational database'},
 {'name': 'MySQL', 'category': 'database', 'description': 'Popular open-source relational database'},
 {'name': 'MongoDB', 'category': 'database', 'description': 'NoSQL document database'},
 {'name': 'Redis', 'category': 'database', 'description': 'In-memory data structure store'},
 {'name': 'SQLite', 'category': 'database', 'description': 'Lightweight embedded database'},
 {'name': 'Elasticsearch', 'category': 'database', 'description': 'Search and analytics engine'},
 {'name': 'Cassandra', 'category': 'database', 'description': 'Distributed NoSQL database'},

 # DevOps & Cloud
 {'name': 'Docker', 'category': 'devops', 'description': 'Containerization platform'},
 {'name': 'Kubernetes', 'category': 'devops', 'description': 'Container orchestration platform'},
 {'name': 'AWS', 'category': 'devops', 'description': 'Amazon Web Services cloud platform'},
 {'name': 'Azure', 'category': 'devops', 'description': 'Microsoft cloud computing platform'},
 {'name': 'Google Cloud', 'category': 'devops', 'description': 'Google cloud computing platform'},
 {'name': 'Jenkins', 'category': 'devops', 'description': 'Open-source automation server'},
 {'name': 'GitLab CI/CD', 'category': 'devops', 'description': 'Continuous integration and deployment'},
 {'name': 'Terraform', 'category': 'devops', 'description': 'Infrastructure as code tool'},

 # Mobile Development
 {'name': 'React Native', 'category': 'mobile', 'description': 'Cross-platform mobile development framework'},
 {'name': 'Flutter', 'category': 'mobile', 'description': 'Google UI toolkit for mobile apps'},
 {'name': 'iOS Development', 'category': 'mobile', 'description': 'Apple mobile platform development'},
 {'name': 'Android Development', 'category': 'mobile', 'description': 'Google mobile platform development'},
 {'name': 'Xamarin', 'category': 'mobile', 'description': 'Microsoft cross-platform mobile development'},

 # Testing & Quality
 {'name': 'Jest', 'category': 'testing', 'description': 'JavaScript testing framework'},
 {'name': 'Pytest', 'category': 'testing', 'description': 'Python testing framework'},
 {'name': 'Selenium', 'category': 'testing', 'description': 'Web application testing framework'},
 {'name': 'Cypress', 'category': 'testing', 'description': 'End-to-end testing framework'},
 {'name': 'Unit Testing', 'category': 'testing', 'description': 'Testing individual components in isolation'},
 {'name': 'Integration Testing', 'category': 'testing', 'description': 'Testing component interactions'},
 ]

 created_count = 0
 for skill_data in skills_data:
 skill, created = Skill.objects.get_or_create(
 name=skill_data['name'],
 defaults={
 'category': skill_data['category'],
 'description': skill_data['description']
 }
 )
 if created:
 created_count += 1
 self.stdout.write(f"Created skill: {skill.name}")
 else:
 self.stdout.write(f"Skill already exists: {skill.name}")

 self.stdout.write(
 self.style.SUCCESS(f'Successfully created {created_count} new skills!')
 )
