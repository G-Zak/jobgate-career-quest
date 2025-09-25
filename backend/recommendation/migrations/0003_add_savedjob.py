# Generated manually for SavedJob model

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('recommendation', '0002_enhanced_models'),
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='SavedJob',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('job_id', models.IntegerField(help_text='ID of the saved job')),
                ('job_title', models.CharField(blank=True, help_text='Title of the saved job', max_length=200)),
                ('job_company', models.CharField(blank=True, help_text='Company of the saved job', max_length=200)),
                ('saved_at', models.DateTimeField(auto_now_add=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='saved_jobs', to='auth.user')),
            ],
            options={
                'verbose_name': 'Saved Job',
                'verbose_name_plural': 'Saved Jobs',
                'ordering': ['-saved_at'],
            },
        ),
        migrations.AddConstraint(
            model_name='savedjob',
            constraint=models.UniqueConstraint(fields=('user', 'job_id'), name='unique_user_job'),
        ),
    ]
