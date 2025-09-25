# Generated manually for enhanced recommendation models

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('recommendation', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        # Add new ScoringWeights model
        migrations.CreateModel(
            name='ScoringWeights',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100, default='Default Weights')),
                ('is_active', models.BooleanField(default=True)),
                ('skill_match_weight', models.FloatField(default=0.70, help_text='Weight for skill matching score')),
                ('content_similarity_weight', models.FloatField(default=0.20, help_text='Weight for content similarity score')),
                ('cluster_fit_weight', models.FloatField(default=0.10, help_text='Weight for cluster fit score')),
                ('required_skill_weight', models.FloatField(default=0.80, help_text='Weight for required skills within skill matching')),
                ('preferred_skill_weight', models.FloatField(default=0.20, help_text='Weight for preferred skills within skill matching')),
                ('location_bonus_weight', models.FloatField(default=0.05, help_text='Bonus for location match')),
                ('experience_bonus_weight', models.FloatField(default=0.03, help_text='Bonus for experience level match')),
                ('remote_bonus_weight', models.FloatField(default=0.02, help_text='Bonus for remote work')),
                ('salary_fit_weight', models.FloatField(default=0.00, help_text='Weight for salary fit (disabled by default)')),
                ('min_score_threshold', models.FloatField(default=15.0, help_text='Minimum score to include in recommendations')),
                ('max_recommendations', models.IntegerField(default=10, help_text='Maximum number of recommendations')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('created_by', models.ForeignKey(null=True, blank=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'Scoring Weights',
                'verbose_name_plural': 'Scoring Weights',
                'ordering': ['-is_active', '-created_at'],
            },
        ),
        
        # Add new JobRecommendationDetail model
        migrations.CreateModel(
            name='JobRecommendationDetail',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('overall_score', models.FloatField(help_text='Overall recommendation score (0-100)')),
                ('content_score', models.FloatField(help_text='Content similarity score (0-100)')),
                ('skill_score', models.FloatField(help_text='Skill matching score (0-100)')),
                ('cluster_fit_score', models.FloatField(help_text='Cluster fit score (0-100)')),
                ('required_skill_score', models.FloatField(help_text='Required skills match score (0-100)')),
                ('preferred_skill_score', models.FloatField(help_text='Preferred skills match score (0-100)')),
                ('required_skills_count', models.IntegerField(default=0)),
                ('preferred_skills_count', models.IntegerField(default=0)),
                ('required_matched_count', models.IntegerField(default=0)),
                ('preferred_matched_count', models.IntegerField(default=0)),
                ('location_bonus', models.FloatField(default=0.0, help_text='Location match bonus')),
                ('experience_bonus', models.FloatField(default=0.0, help_text='Experience level bonus')),
                ('remote_bonus', models.FloatField(default=0.0, help_text='Remote work bonus')),
                ('salary_fit', models.FloatField(default=0.0, help_text='Salary fit score')),
                ('matched_skills', models.JSONField(default=list, help_text='List of matched skills')),
                ('missing_skills', models.JSONField(default=list, help_text='List of missing skills')),
                ('required_matched_skills', models.JSONField(default=list, help_text='Required skills that matched')),
                ('preferred_matched_skills', models.JSONField(default=list, help_text='Preferred skills that matched')),
                ('required_missing_skills', models.JSONField(default=list, help_text='Required skills that did not match')),
                ('preferred_missing_skills', models.JSONField(default=list, help_text='Preferred skills that did not match')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('job_offer', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='recommendation_details', to='recommendation.joboffer')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='recommendation_details', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'Job Recommendation Detail',
                'verbose_name_plural': 'Job Recommendation Details',
                'unique_together': {('job_offer', 'user')},
                'ordering': ['-overall_score', '-created_at'],
            },
        ),
        
        # Add new RecommendationAnalytics model
        migrations.CreateModel(
            name='RecommendationAnalytics',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField(default=django.utils.timezone.now)),
                ('total_recommendations', models.IntegerField(default=0)),
                ('avg_score', models.FloatField(default=0.0)),
                ('min_score', models.FloatField(default=0.0)),
                ('max_score', models.FloatField(default=0.0)),
                ('avg_skill_match', models.FloatField(default=0.0)),
                ('avg_required_skill_match', models.FloatField(default=0.0)),
                ('avg_preferred_skill_match', models.FloatField(default=0.0)),
                ('cluster_distribution', models.JSONField(default=dict, help_text='Distribution of jobs across clusters')),
                ('avg_cluster_fit', models.FloatField(default=0.0)),
                ('recommendations_viewed', models.IntegerField(default=0)),
                ('applications_from_recommendations', models.IntegerField(default=0)),
                ('jobs_saved_from_recommendations', models.IntegerField(default=0)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
            options={
                'verbose_name': 'Recommendation Analytics',
                'verbose_name_plural': 'Recommendation Analytics',
                'unique_together': {('date',)},
                'ordering': ['-date'],
            },
        ),
        
        # Add new fields to existing JobRecommendation model
        migrations.AddField(
            model_name='jobrecommendation',
            name='score',
            field=models.FloatField(help_text='Overall recommendation score', null=True),
        ),
        migrations.AddField(
            model_name='jobrecommendation',
            name='algorithm_version',
            field=models.CharField(max_length=50, default='enhanced_v1'),
        ),
        migrations.AddField(
            model_name='jobrecommendation',
            name='cluster_id',
            field=models.IntegerField(null=True, blank=True, help_text='K-Means cluster ID'),
        ),
        migrations.AddField(
            model_name='jobrecommendation',
            name='user',
            field=models.ForeignKey(null=True, blank=True, on_delete=django.db.models.deletion.CASCADE, related_name='job_recommendations', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='jobrecommendation',
            name='job_offer',
            field=models.ForeignKey(null=True, blank=True, on_delete=django.db.models.deletion.CASCADE, related_name='recommendations', to='recommendation.joboffer'),
        ),
    ]
