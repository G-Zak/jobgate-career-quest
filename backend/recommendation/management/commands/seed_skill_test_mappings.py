"""
Django management command to create skill-technical test mappings
Maps existing skills to technical tests for job recommendation system
"""

from django.core.management.base import BaseCommand
from recommendation.models import SkillTechnicalTestMapping
from skills.models import Skill, TechnicalTest


class Command(BaseCommand):
    help = 'Create skill-technical test mappings for recommendation system'
    
    def add_arguments(self, parser):
        parser.add_argument(
            '--clear',
            action='store_true',
            help='Clear existing mappings before creating new ones'
        )
    
    def handle(self, *args, **options):
        if options['clear']:
            deleted_count = SkillTechnicalTestMapping.objects.count()
            SkillTechnicalTestMapping.objects.all().delete()
            self.stdout.write(f"Cleared {deleted_count} existing mappings")
        
        self.stdout.write("Creating skill-technical test mappings...")
        
        # Create mappings
        created_mappings = self.create_mappings()
        
        self.stdout.write(
            self.style.SUCCESS(f'Successfully created {len(created_mappings)} skill-test mappings')
        )
        
        # Display summary
        self.display_summary(created_mappings)
    
    def create_mappings(self):
        """Create skill-technical test mappings based on existing data"""
        
        # Define mapping rules: skill_name -> [test_patterns, default_weight]
        mapping_rules = {
            # Programming languages
            'Python': (['python', 'django', 'flask'], 1.0),
            'JavaScript': (['javascript', 'js', 'react', 'node'], 1.0),
            'Java': (['java', 'spring'], 1.0),
            'PHP': (['php', 'laravel'], 1.0),
            'C++': (['c++', 'cpp'], 1.0),
            'C#': (['c#', 'csharp', '.net'], 1.0),
            
            # Frontend technologies
            'React': (['react', 'javascript', 'frontend'], 1.0),
            'Vue.js': (['vue', 'javascript', 'frontend'], 1.0),
            'Angular': (['angular', 'javascript', 'frontend'], 1.0),
            'HTML': (['html', 'frontend', 'web'], 0.8),
            'CSS': (['css', 'frontend', 'web'], 0.8),
            'TypeScript': (['typescript', 'javascript'], 1.0),
            
            # Backend frameworks
            'Django': (['django', 'python'], 1.0),
            'Flask': (['flask', 'python'], 1.0),
            'Spring': (['spring', 'java'], 1.0),
            'Express.js': (['express', 'node', 'javascript'], 1.0),
            'Laravel': (['laravel', 'php'], 1.0),
            
            # Databases
            'PostgreSQL': (['postgresql', 'sql', 'database'], 1.0),
            'MySQL': (['mysql', 'sql', 'database'], 1.0),
            'MongoDB': (['mongodb', 'nosql', 'database'], 1.0),
            'Redis': (['redis', 'cache', 'database'], 0.8),
            'SQLite': (['sqlite', 'sql', 'database'], 0.8),
            
            # DevOps and Infrastructure
            'Docker': (['docker', 'container', 'devops'], 1.0),
            'Kubernetes': (['kubernetes', 'k8s', 'devops'], 1.0),
            'AWS': (['aws', 'cloud', 'devops'], 1.0),
            'Azure': (['azure', 'cloud', 'devops'], 1.0),
            'Linux': (['linux', 'unix', 'system'], 0.9),
            'Jenkins': (['jenkins', 'ci', 'devops'], 0.9),
            'Terraform': (['terraform', 'infrastructure', 'devops'], 0.9),
            
            # Mobile Development
            'Flutter': (['flutter', 'dart', 'mobile'], 1.0),
            'React Native': (['react native', 'mobile', 'javascript'], 1.0),
            'iOS': (['ios', 'swift', 'mobile'], 1.0),
            'Android': (['android', 'kotlin', 'java', 'mobile'], 1.0),
            'Swift': (['swift', 'ios', 'mobile'], 1.0),
            'Kotlin': (['kotlin', 'android', 'mobile'], 1.0),
            
            # Testing
            'Testing': (['test', 'qa', 'quality'], 1.0),
            'Selenium': (['selenium', 'automation', 'test'], 1.0),
            'Jest': (['jest', 'javascript', 'test'], 0.9),
            'PyTest': (['pytest', 'python', 'test'], 0.9),
            'JUnit': (['junit', 'java', 'test'], 0.9),
            
            # Other technical skills
            'Git': (['git', 'version control'], 0.7),
            'Machine Learning': (['ml', 'machine learning', 'ai', 'data science'], 1.0),
            'Data Science': (['data science', 'analytics', 'python'], 1.0),
            'REST APIs': (['api', 'rest', 'web service'], 0.8),
            'GraphQL': (['graphql', 'api'], 0.8),
            
            # Design and UI/UX
            'UI Design': (['ui', 'design', 'interface'], 0.9),
            'UX Design': (['ux', 'user experience', 'design'], 0.9),
            'Figma': (['figma', 'design'], 0.8),
            'Adobe XD': (['adobe xd', 'design'], 0.8),
            'Photoshop': (['photoshop', 'design'], 0.7),
        }
        
        created_mappings = []
        
        # Get all existing skills and tests
        skills = {skill.name: skill for skill in Skill.objects.all()}
        tests = list(TechnicalTest.objects.all())
        
        self.stdout.write(f"Found {len(skills)} skills and {len(tests)} technical tests")
        
        # Create mappings based on rules
        for skill_name, (test_patterns, default_weight) in mapping_rules.items():
            if skill_name not in skills:
                self.stdout.write(f"Skill '{skill_name}' not found, skipping...")
                continue
            
            skill = skills[skill_name]
            matched_tests = []
            
            # Find matching tests
            for test in tests:
                test_name_lower = test.test_name.lower()
                skill_name_lower = test.skill.name.lower()
                
                # Check if any pattern matches the test name or associated skill
                for pattern in test_patterns:
                    if (pattern.lower() in test_name_lower or 
                        pattern.lower() in skill_name_lower):
                        matched_tests.append(test)
                        break
            
            # Create mappings for matched tests
            for test in matched_tests:
                mapping, created = SkillTechnicalTestMapping.objects.get_or_create(
                    skill=skill,
                    technical_test=test,
                    defaults={'default_weight': default_weight}
                )
                
                if created:
                    created_mappings.append(mapping)
                    self.stdout.write(f"  Mapped {skill_name} -> {test.test_name} (weight: {default_weight})")
        
        # Create additional mappings based on exact skill matches
        for test in tests:
            test_skill = test.skill
            
            # Create direct mapping between test and its primary skill
            mapping, created = SkillTechnicalTestMapping.objects.get_or_create(
                skill=test_skill,
                technical_test=test,
                defaults={'default_weight': 1.0}
            )
            
            if created:
                created_mappings.append(mapping)
                self.stdout.write(f"  Direct mapping: {test_skill.name} -> {test.test_name}")
        
        return created_mappings
    
    def display_summary(self, created_mappings):
        """Display summary of created mappings"""
        
        # Count by skill category
        category_counts = {}
        weight_distribution = {}
        
        for mapping in created_mappings:
            category = mapping.skill.category
            category_counts[category] = category_counts.get(category, 0) + 1
            
            weight = mapping.default_weight
            weight_key = f"{weight:.1f}"
            weight_distribution[weight_key] = weight_distribution.get(weight_key, 0) + 1
        
        self.stdout.write("\n=== Mapping Creation Summary ===")
        self.stdout.write(f"Total mappings created: {len(created_mappings)}")
        
        self.stdout.write("\nBy skill category:")
        for category, count in sorted(category_counts.items()):
            category_display = dict(Skill.CATEGORIES).get(category, category)
            self.stdout.write(f"  {category_display}: {count}")
        
        self.stdout.write("\nBy weight distribution:")
        for weight, count in sorted(weight_distribution.items()):
            self.stdout.write(f"  Weight {weight}: {count} mappings")
        
        # Show some example mappings
        self.stdout.write("\nExample mappings:")
        for mapping in created_mappings[:10]:
            self.stdout.write(f"  {mapping.skill.name} -> {mapping.technical_test.test_name} (weight: {mapping.default_weight})")
        
        if len(created_mappings) > 10:
            self.stdout.write(f"  ... and {len(created_mappings) - 10} more")
        
        # Check coverage
        total_skills = Skill.objects.count()
        mapped_skills = SkillTechnicalTestMapping.objects.values('skill').distinct().count()
        coverage = (mapped_skills / total_skills * 100) if total_skills > 0 else 0
        
        self.stdout.write(f"\nSkill coverage: {mapped_skills}/{total_skills} ({coverage:.1f}%)")
        
        total_tests = TechnicalTest.objects.count()
        mapped_tests = SkillTechnicalTestMapping.objects.values('technical_test').distinct().count()
        test_coverage = (mapped_tests / total_tests * 100) if total_tests > 0 else 0
        
        self.stdout.write(f"Test coverage: {mapped_tests}/{total_tests} ({test_coverage:.1f}%)")
