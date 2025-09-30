"""
Django management command to set up the cognitive recommendation system
Runs all necessary setup steps in the correct order
"""

from django.core.management.base import BaseCommand
from django.core.management import call_command
from django.db import transaction
from recommendation.models import ScoringWeights, ClusterCenters
from recommendation.kmeans_clustering_service import KMeansClusteringService


class Command(BaseCommand):
    help = 'Set up the cognitive recommendation system with sample data'
    
    def add_arguments(self, parser):
        parser.add_argument(
            '--jobs',
            type=int,
            default=200,
            help='Number of job offers to create (default: 200)'
        )
        parser.add_argument(
            '--skip-jobs',
            action='store_true',
            help='Skip job creation (use existing jobs)'
        )
        parser.add_argument(
            '--skip-clustering',
            action='store_true',
            help='Skip K-Means clustering training'
        )
        parser.add_argument(
            '--clusters',
            type=int,
            default=8,
            help='Number of clusters for K-Means (default: 8)'
        )
    
    def handle(self, *args, **options):
        self.stdout.write(
            self.style.SUCCESS('Setting up Cognitive Job Recommendation System...')
        )
        
        try:
            with transaction.atomic():
                # Step 1: Create default scoring weights
                self.setup_scoring_weights()
                
                # Step 2: Create job offers (if not skipped)
                if not options['skip_jobs']:
                    self.create_job_offers(options['jobs'])
                
                # Step 3: Create skill-test mappings
                self.create_skill_mappings()
                
                # Step 4: Train clustering model (if not skipped)
                if not options['skip_clustering']:
                    self.train_clustering_model(options['clusters'])
                
                # Step 5: Display setup summary
                self.display_setup_summary()
                
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Setup failed: {str(e)}')
            )
            raise
        
        self.stdout.write(
            self.style.SUCCESS('✅ Cognitive recommendation system setup complete!')
        )
        
        # Display next steps
        self.display_next_steps()
    
    def setup_scoring_weights(self):
        """Create default scoring weights if none exist"""
        self.stdout.write("1. Setting up scoring weights...")
        
        if ScoringWeights.objects.filter(is_active=True).exists():
            self.stdout.write("   ✓ Active scoring weights already exist")
            return
        
        # Deactivate any existing weights
        ScoringWeights.objects.update(is_active=False)

        # Create default weights with all required fields
        weights_data = {
            'name': "default_cognitive",
            'is_active': True,
            'skill_match_weight': 0.30,
            'cluster_fit_weight': 0.10,
            'required_skill_weight': 1.0,
            'preferred_skill_weight': 0.5,
        }

        # Add new fields if they exist in the model
        try:
            # Check if new fields exist by trying to create a test instance
            test_weights = ScoringWeights(**weights_data)

            # Add new cognitive fields if they exist
            if hasattr(test_weights, 'technical_test_weight'):
                weights_data.update({
                    'technical_test_weight': 0.25,
                    'experience_weight': 0.15,
                    'salary_weight': 0.10,
                    'location_weight': 0.10,
                    'employability_weight': 0.05,
                    'test_pass_threshold': 70.0,
                    'technical_test_default_weights': {
                        'Python': 1.0,
                        'JavaScript': 1.0,
                        'Java': 1.0,
                        'React': 1.0,
                        'Django': 1.0
                    }
                })

            # Add legacy fields if they exist
            if hasattr(test_weights, 'salary_fit_weight'):
                weights_data['salary_fit_weight'] = 0.0

            weights = ScoringWeights.objects.create(**weights_data)

        except Exception as e:
            self.stdout.write(f"   ⚠ Error creating weights: {e}")
            # Try with minimal fields
            weights = ScoringWeights.objects.create(
                name="default_cognitive",
                is_active=True,
                skill_match_weight=0.30,
                cluster_fit_weight=0.10,
                required_skill_weight=1.0,
                preferred_skill_weight=0.5
            )
        
        self.stdout.write(f"   ✓ Created default scoring weights (ID: {weights.id})")
    
    def create_job_offers(self, count):
        """Create Moroccan job offers"""
        self.stdout.write(f"2. Creating {count} Moroccan job offers...")
        
        call_command('seed_moroccan_jobs', count=count, verbosity=0)
        
        self.stdout.write(f"   ✓ Created {count} job offers")
    
    def create_skill_mappings(self):
        """Create skill-technical test mappings"""
        self.stdout.write("3. Creating skill-technical test mappings...")
        
        call_command('seed_skill_test_mappings', verbosity=0)
        
        from recommendation.models import SkillTechnicalTestMapping
        mapping_count = SkillTechnicalTestMapping.objects.count()
        
        self.stdout.write(f"   ✓ Created {mapping_count} skill-test mappings")
    
    def train_clustering_model(self, n_clusters):
        """Train K-Means clustering model"""
        self.stdout.write(f"4. Training K-Means clustering model ({n_clusters} clusters)...")
        
        try:
            service = KMeansClusteringService()
            cluster_model = service.train_kmeans_model(n_clusters=n_clusters)
            
            if cluster_model:
                self.stdout.write(f"   ✓ Trained clustering model (ID: {cluster_model.id})")
                self.stdout.write(f"     - Inertia: {cluster_model.inertia:.2f}")
                if cluster_model.silhouette_score:
                    self.stdout.write(f"     - Silhouette Score: {cluster_model.silhouette_score:.3f}")
                self.stdout.write(f"     - Samples: {cluster_model.n_samples_trained}")
            else:
                self.stdout.write("   ⚠ Clustering training skipped (insufficient data)")
                
        except Exception as e:
            self.stdout.write(f"   ⚠ Clustering training failed: {str(e)}")
    
    def display_setup_summary(self):
        """Display summary of setup"""
        self.stdout.write("\n=== Setup Summary ===")
        
        # Count resources
        from recommendation.models import JobOffer, SkillTechnicalTestMapping
        from skills.models import Skill, TechnicalTest
        from django.contrib.auth.models import User
        
        job_count = JobOffer.objects.filter(status='active').count()
        skill_count = Skill.objects.count()
        test_count = TechnicalTest.objects.count()
        mapping_count = SkillTechnicalTestMapping.objects.count()
        candidate_count = User.objects.filter(candidateprofile__isnull=False, is_active=True).count()
        
        weights = ScoringWeights.objects.filter(is_active=True).first()
        cluster_model = ClusterCenters.objects.filter(is_active=True).first()
        
        self.stdout.write(f"Active Job Offers: {job_count}")
        self.stdout.write(f"Skills: {skill_count}")
        self.stdout.write(f"Technical Tests: {test_count}")
        self.stdout.write(f"Skill-Test Mappings: {mapping_count}")
        self.stdout.write(f"Active Candidates: {candidate_count}")
        self.stdout.write(f"Scoring Weights: {'✓' if weights else '✗'}")
        self.stdout.write(f"Clustering Model: {'✓' if cluster_model else '✗'}")
    
    def display_next_steps(self):
        """Display next steps for the user"""
        self.stdout.write("\n=== Next Steps ===")
        
        self.stdout.write("1. Start Celery workers:")
        self.stdout.write("   redis-server")
        self.stdout.write("   celery -A your_project worker --loglevel=info")
        
        self.stdout.write("\n2. Generate initial recommendations:")
        self.stdout.write("   curl -X POST -H 'Authorization: Bearer YOUR_TOKEN' \\")
        self.stdout.write("     http://localhost:8000/api/cognitive/batch-recompute/")
        
        self.stdout.write("\n3. Test the API:")
        self.stdout.write("   curl -H 'Authorization: Bearer YOUR_TOKEN' \\")
        self.stdout.write("     'http://localhost:8000/api/cognitive/candidate/1/recommendations/?limit=5'")
        
        self.stdout.write("\n4. View system stats:")
        self.stdout.write("   curl -H 'Authorization: Bearer YOUR_TOKEN' \\")
        self.stdout.write("     http://localhost:8000/api/cognitive/stats/")
        
        self.stdout.write("\n5. Customize scoring weights:")
        self.stdout.write("   - Go to Django Admin > Recommendation > Scoring Weights")
        self.stdout.write("   - Or use the API to create new weights")
        
        self.stdout.write(f"\n📖 See README_COGNITIVE_RECOMMENDATIONS.md for detailed documentation")
        
        # Check for potential issues
        from django.contrib.auth.models import User
        candidate_count = User.objects.filter(candidateprofile__isnull=False, is_active=True).count()
        
        if candidate_count < 5:
            self.stdout.write(
                self.style.WARNING(f"\n⚠ Warning: Only {candidate_count} candidates found. "
                                 "You may need more candidates for meaningful recommendations.")
            )
        
        from skills.models import TestResult
        test_results = TestResult.objects.filter(status='completed').count()
        
        if test_results < 10:
            self.stdout.write(
                self.style.WARNING(f"\n⚠ Warning: Only {test_results} completed test results found. "
                                 "Technical test scores will be mostly zero until candidates take tests.")
            )
