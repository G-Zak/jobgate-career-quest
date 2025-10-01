from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from skills.models import CandidateProfile, Skill

class Command(BaseCommand):
 help = 'Create a sample candidate profile for testing'

 def handle(self, *args, **options):
 # Create or get a test user
 user, created = User.objects.get_or_create(
 username='testuser',
 defaults={
 'email': 'test@example.com',
 'first_name': 'Test',
 'last_name': 'User'
 }
 )

 if created:
 self.stdout.write("Created test user: testuser")
 else:
 self.stdout.write("Test user already exists: testuser")

 # Create or get the candidate profile
 candidate, created = CandidateProfile.objects.get_or_create(
 user=user,
 defaults={
 'first_name': 'Test',
 'last_name': 'User',
 'email': 'test@example.com',
 'phone': '+1234567890'
 }
 )

 if created:
 self.stdout.write("Created candidate profile for test user")
 else:
 self.stdout.write("Candidate profile already exists for test user")

 # Add some sample skills to the candidate
 sample_skills = Skill.objects.filter(
 name__in=['Python', 'JavaScript', 'React', 'Django', 'PostgreSQL']
 )

 if sample_skills.exists():
 candidate.skills.set(sample_skills)
 self.stdout.write(f"Added {sample_skills.count()} skills to candidate profile")
 else:
 self.stdout.write("No sample skills found to add")

 self.stdout.write(
 self.style.SUCCESS(f'Successfully created/updated candidate profile: {candidate.full_name}')
 )
