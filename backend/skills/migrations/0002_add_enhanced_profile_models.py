# Generated manually for enhanced profile models

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('skills', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Education',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('institution', models.CharField(max_length=200, verbose_name='Établissement')),
                ('degree', models.CharField(max_length=200, verbose_name='Diplôme/Formation')),
                ('field_of_study', models.CharField(max_length=200, verbose_name="Domaine d'étude")),
                ('degree_level', models.CharField(choices=[('high_school', 'Baccalauréat'), ('diploma', 'Diplôme/DUT'), ('bachelor', 'Licence'), ('master', 'Master'), ('phd', 'Doctorat'), ('certification', 'Certification')], max_length=20, verbose_name='Niveau')),
                ('start_date', models.DateField(verbose_name='Date de début')),
                ('end_date', models.DateField(blank=True, null=True, verbose_name='Date de fin')),
                ('grade', models.CharField(blank=True, max_length=50, verbose_name='Mention/Note')),
                ('description', models.TextField(blank=True, verbose_name='Description')),
                ('is_current', models.BooleanField(default=False, verbose_name='En cours')),
                ('candidate', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='educations', to='skills.candidateprofile')),
            ],
            options={
                'verbose_name': 'Formation',
                'verbose_name_plural': 'Formations',
                'ordering': ['-start_date'],
            },
        ),
        migrations.CreateModel(
            name='WorkExperience',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('company', models.CharField(max_length=200, verbose_name='Entreprise')),
                ('position', models.CharField(max_length=200, verbose_name='Poste')),
                ('location', models.CharField(blank=True, max_length=100, verbose_name='Lieu')),
                ('start_date', models.DateField(verbose_name='Date de début')),
                ('end_date', models.DateField(blank=True, null=True, verbose_name='Date de fin')),
                ('description', models.TextField(verbose_name='Description des responsabilités')),
                ('achievements', models.TextField(blank=True, verbose_name='Réalisations principales')),
                ('technologies_used', models.JSONField(blank=True, default=list, verbose_name='Technologies utilisées')),
                ('is_current', models.BooleanField(default=False, verbose_name='Poste actuel')),
                ('candidate', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='work_experiences', to='skills.candidateprofile')),
            ],
            options={
                'verbose_name': 'Expérience Professionnelle',
                'verbose_name_plural': 'Expériences Professionnelles',
                'ordering': ['-start_date'],
            },
        ),
        migrations.CreateModel(
            name='Project',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=200, verbose_name='Titre du projet')),
                ('description', models.TextField(verbose_name='Description')),
                ('project_type', models.CharField(choices=[('personal', 'Projet Personnel'), ('professional', 'Projet Professionnel'), ('academic', 'Projet Académique'), ('open_source', 'Open Source')], max_length=20, verbose_name='Type de projet')),
                ('technologies_used', models.JSONField(default=list, verbose_name='Technologies utilisées')),
                ('start_date', models.DateField(verbose_name='Date de début')),
                ('end_date', models.DateField(blank=True, null=True, verbose_name='Date de fin')),
                ('project_url', models.URLField(blank=True, verbose_name='URL du projet')),
                ('github_url', models.URLField(blank=True, verbose_name='GitHub URL')),
                ('demo_url', models.URLField(blank=True, verbose_name='URL de démonstration')),
                ('achievements', models.TextField(blank=True, verbose_name='Résultats obtenus')),
                ('is_featured', models.BooleanField(default=False, verbose_name='Projet mis en avant')),
                ('candidate', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='projects', to='skills.candidateprofile')),
            ],
            options={
                'verbose_name': 'Projet',
                'verbose_name_plural': 'Projets',
                'ordering': ['-start_date'],
            },
        ),
    ]
