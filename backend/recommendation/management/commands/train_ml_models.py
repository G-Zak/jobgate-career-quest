"""
Django management command to train ML recommendation models

Usage:
 python manage.py train_ml_models
 python manage.py train_ml_models --min-jobs 20 --clusters 10
"""

from django.core.management.base import BaseCommand, CommandError
from django.db.models import Q
from recommendation.models import JobOffer
from recommendation.ml_recommender import (
 ContentBasedRecommender,
 JobClusterRecommender,
 HybridRecommender
)
import logging

logger = logging.getLogger(__name__)

class Command(BaseCommand):
 help = 'Train machine learning recommendation models'

 def add_arguments(self, parser):
 parser.add_argument(
 '--min-jobs',
 type=int,
 default=10,
 help='Minimum number of jobs required for training (default: 10)'
 )
 parser.add_argument(
 '--clusters',
 type=int,
 default=8,
 help='Number of clusters for K-Means (default: 8)'
 )
 parser.add_argument(
 '--force',
 action='store_true',
 help='Force retraining even if models exist'
 )
 parser.add_argument(
 '--verbose',
 action='store_true',
 help='Enable verbose output'
 )

 def handle(self, *args, **options):
 min_jobs = options['min_jobs']
 n_clusters = options['clusters']
 force = options['force']
 verbose = options['verbose']

 if verbose:
 logging.basicConfig(level=logging.INFO)

 self.stdout.write(
 self.style.SUCCESS('Starting ML model training...')
 )

 try:
 # Get active jobs
 active_jobs = JobOffer.objects.filter(status='active')
 job_count = active_jobs.count()

 self.stdout.write(f'Found {job_count} active jobs')

 if job_count < min_jobs:
 raise CommandError(
 f'Not enough active jobs for training. '
 f'Need at least {min_jobs}, got {job_count}'
 )

 # Convert to list for processing
 jobs_list = list(active_jobs)

 # Train Content-Based Recommender
 self.stdout.write('Training Content-Based Recommender...')
 content_recommender = ContentBasedRecommender()
 content_recommender.fit(jobs_list)

 if content_recommender.is_fitted:
 self.stdout.write(
 self.style.SUCCESS(
 f'Content-Based model trained successfully. '
 f'Features: {content_recommender.job_vectors.shape[1]}'
 )
 )
 else:
 raise CommandError('Failed to train Content-Based model')

 # Train K-Means Clustering Recommender
 self.stdout.write('Training K-Means Clustering Recommender...')
 cluster_recommender = JobClusterRecommender(n_clusters=n_clusters)
 cluster_recommender.fit(jobs_list)

 if cluster_recommender.is_fitted:
 self.stdout.write(
 self.style.SUCCESS(
 f'K-Means clustering model trained successfully. '
 f'Clusters: {cluster_recommender.n_clusters}'
 )
 )

 # Log cluster distribution
 if verbose:
 import numpy as np
 unique, counts = np.unique(cluster_recommender.job_clusters, return_counts=True)
 for cluster_id, count in zip(unique, counts):
 cluster_name = cluster_recommender.cluster_names.get(cluster_id, f"Cluster {cluster_id}")
 self.stdout.write(f' - {cluster_name}: {count} jobs')
 else:
 raise CommandError('Failed to train K-Means clustering model')

 # Train Hybrid Recommender
 self.stdout.write('Training Hybrid Recommender...')
 hybrid_recommender = HybridRecommender()
 hybrid_recommender.fit(jobs_list)

 if hybrid_recommender.is_fitted:
 self.stdout.write(
 self.style.SUCCESS('Hybrid model trained successfully')
 )
 else:
 raise CommandError('Failed to train Hybrid model')

 # Summary
 self.stdout.write(
 self.style.SUCCESS(
 f'\nAll ML models trained successfully!\n'
 f'Jobs used: {job_count}\n'
 f'Content-Based features: {content_recommender.job_vectors.shape[1]}\n'
 f'K-Means clusters: {cluster_recommender.n_clusters}\n'
 f'Hybrid model: Ready\n'
 f'\nYou can now use the ML recommendation endpoints:\n'
 f'- /api/recommendations/ml/content-based/\n'
 f'- /api/recommendations/ml/cluster-based/\n'
 f'- /api/recommendations/ml/hybrid/\n'
 )
 )

 except Exception as e:
 raise CommandError(f'Error training models: {str(e)}')

