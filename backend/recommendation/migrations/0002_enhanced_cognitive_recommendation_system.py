# Generated migration for enhanced cognitive recommendation system

from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('recommendation', '0001_initial'),
        ('skills', '0001_initial'),
    ]

    operations = [
        # Update ScoringWeights model
        migrations.RemoveField(
            model_name='scoringweights',
            name='content_similarity_weight',
        ),
        migrations.RemoveField(
            model_name='scoringweights',
            name='location_bonus_weight',
        ),
        migrations.RemoveField(
            model_name='scoringweights',
            name='experience_bonus_weight',
        ),
        migrations.RemoveField(
            model_name='scoringweights',
            name='remote_bonus_weight',
        ),
        migrations.RemoveField(
            model_name='scoringweights',
            name='min_score_threshold',
        ),
        migrations.RemoveField(
            model_name='scoringweights',
            name='max_recommendations',
        ),
        migrations.AddField(
            model_name='scoringweights',
            name='technical_test_weight',
            field=models.FloatField(default=0.25, help_text='Weight for technical test performance'),
        ),
        migrations.AddField(
            model_name='scoringweights',
            name='experience_weight',
            field=models.FloatField(default=0.15, help_text='Weight for experience level match'),
        ),
        migrations.AddField(
            model_name='scoringweights',
            name='salary_weight',
            field=models.FloatField(default=0.10, help_text='Weight for salary fit'),
        ),
        migrations.AddField(
            model_name='scoringweights',
            name='location_weight',
            field=models.FloatField(default=0.10, help_text='Weight for location match'),
        ),
        migrations.AddField(
            model_name='scoringweights',
            name='test_pass_threshold',
            field=models.FloatField(default=70.0, help_text='Minimum score to consider test passed'),
        ),
        migrations.AddField(
            model_name='scoringweights',
            name='technical_test_default_weights',
            field=models.JSONField(blank=True, default=dict, help_text='Default weights for different technical tests {skill_name: weight}'),
        ),
        migrations.AddField(
            model_name='scoringweights',
            name='employability_weight',
            field=models.FloatField(default=0.05, help_text='Weight for cognitive/employability score'),
        ),
        migrations.AlterField(
            model_name='scoringweights',
            name='name',
            field=models.CharField(default='default', max_length=100),
        ),
        migrations.AlterField(
            model_name='scoringweights',
            name='skill_match_weight',
            field=models.FloatField(default=0.30, help_text='Weight for skill matching score'),
        ),
        migrations.AlterField(
            model_name='scoringweights',
            name='cluster_fit_weight',
            field=models.FloatField(default=0.10, help_text='Weight for K-Means cluster fit'),
        ),
        migrations.AlterField(
            model_name='scoringweights',
            name='required_skill_weight',
            field=models.FloatField(default=1.0, help_text='Weight for required skills'),
        ),
        migrations.AlterField(
            model_name='scoringweights',
            name='preferred_skill_weight',
            field=models.FloatField(default=0.5, help_text='Weight for preferred skills'),
        ),
        migrations.AlterField(
            model_name='scoringweights',
            name='salary_fit_weight',
            field=models.FloatField(default=0.00, help_text='Weight for salary fit (disabled by default)'),
        ),

        # Create SkillTechnicalTestMapping model
        migrations.CreateModel(
            name='SkillTechnicalTestMapping',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('default_weight', models.FloatField(default=1.0, help_text='Default weight for this skill-test mapping')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('skill', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='technical_test_mappings', to='skills.skill')),
                ('technical_test', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='skill_mappings', to='skills.technicaltest')),
            ],
            options={
                'verbose_name': 'Skill-Technical Test Mapping',
                'verbose_name_plural': 'Skill-Technical Test Mappings',
                'ordering': ['skill__name', 'technical_test__test_name'],
            },
        ),
        migrations.AddConstraint(
            model_name='skilltechnicaltestmapping',
            constraint=models.UniqueConstraint(fields=('skill', 'technical_test'), name='unique_skill_technical_test'),
        ),

        # Create ClusterCenters model
        migrations.CreateModel(
            name='ClusterCenters',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('algorithm_version', models.CharField(default='kmeans_v1', max_length=50)),
                ('n_clusters', models.IntegerField(help_text='Number of clusters')),
                ('centers', models.JSONField(help_text='List of cluster centers (arrays)')),
                ('trained_at', models.DateTimeField(auto_now_add=True)),
                ('training_metadata', models.JSONField(blank=True, default=dict, help_text='Metadata about training: feature names, normalization params, etc.')),
                ('inertia', models.FloatField(blank=True, help_text='K-Means inertia score', null=True)),
                ('silhouette_score', models.FloatField(blank=True, help_text='Silhouette analysis score', null=True)),
                ('n_samples_trained', models.IntegerField(default=0, help_text='Number of samples used for training')),
                ('is_active', models.BooleanField(default=True, help_text='Whether this model is currently active')),
            ],
            options={
                'verbose_name': 'Cluster Centers',
                'verbose_name_plural': 'Cluster Centers',
                'ordering': ['-trained_at'],
            },
        ),

        # Update JobOffer model for Morocco context
        migrations.AddField(
            model_name='joboffer',
            name='currency',
            field=models.CharField(default='MAD', help_text='Currency code', max_length=3),
        ),
        migrations.AddField(
            model_name='joboffer',
            name='source_id',
            field=models.CharField(blank=True, help_text='External source ID', max_length=100),
        ),
        migrations.AddField(
            model_name='joboffer',
            name='source_type',
            field=models.CharField(default='manual', help_text='Source type: manual, seed, api, etc.', max_length=50),
        ),
        migrations.AlterField(
            model_name='joboffer',
            name='salary_min',
            field=models.IntegerField(blank=True, help_text='Salary in MAD', null=True),
        ),
        migrations.AlterField(
            model_name='joboffer',
            name='salary_max',
            field=models.IntegerField(blank=True, help_text='Salary in MAD', null=True),
        ),
        migrations.RenameField(
            model_name='joboffer',
            old_name='remote',
            new_name='remote_flag',
        ),
    ]
