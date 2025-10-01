"""
Management command to generate job recommendations for all candidates
"""
from django.core.management.base import BaseCommand
from django.db import transaction
from recommendation.services import RecommendationEngine
from skills.models import CandidateProfile

class Command(BaseCommand):
 help = 'Generate job recommendations for all candidates'

 def add_arguments(self, parser):
 parser.add_argument(
 '--candidate-id',
 type=int,
 help='Generate recommendations for a specific candidate ID'
 )
 parser.add_argument(
 '--limit',
 type=int,
 default=10,
 help='Maximum number of recommendations per candidate (default: 10)'
 )
 parser.add_argument(
 '--force',
 action='store_true',
 help='Force regeneration of existing recommendations'
 )

 def handle(self, *args, **options):
 candidate_id = options.get('candidate_id')
 limit = options.get('limit')
 force = options.get('force')

 engine = RecommendationEngine()

 if candidate_id:
 # Generate for specific candidate
 try:
 candidate = CandidateProfile.objects.get(id=candidate_id)
 self.generate_for_candidate(candidate, engine, limit, force)
 except CandidateProfile.DoesNotExist:
 self.stdout.write(
 self.style.ERROR(f'Candidate with ID {candidate_id} not found')
 )
 return
 else:
 # Generate for all candidates
 candidates = CandidateProfile.objects.all()
 total_candidates = candidates.count()

 self.stdout.write(f'Generating recommendations for {total_candidates} candidates...')

 with transaction.atomic():
 for i, candidate in enumerate(candidates, 1):
 self.stdout.write(f'Processing candidate {i}/{total_candidates}: {candidate.full_name}')
 self.generate_for_candidate(candidate, engine, limit, force)

 self.stdout.write(
 self.style.SUCCESS(f'Successfully generated recommendations for {total_candidates} candidates')
 )

 def generate_for_candidate(self, candidate, engine, limit, force):
 """Generate recommendations for a specific candidate"""
 try:
 if force:
 # Remove existing recommendations
 from recommendation.models import JobRecommendation
 JobRecommendation.objects.filter(candidate=candidate).delete()

 recommendations = engine.generate_recommendations(candidate, limit)

 self.stdout.write(
 f' Generated {len(recommendations)} recommendations for {candidate.full_name}'
 )

 except Exception as e:
 self.stdout.write(
 self.style.ERROR(f'Error generating recommendations for {candidate.full_name}: {str(e)}')
 )

