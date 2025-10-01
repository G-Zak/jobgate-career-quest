from django.db import models
from django.conf import settings
from django.utils import timezone
import json


class Skill(models.Model):
	"""Compétences techniques (Python, JavaScript, etc.)"""
	CATEGORIES = [
		('programming', 'Langages de programmation'),
		('frontend', 'Technologies frontend'),
		('backend', 'Technologies backend'),
		('database', 'Bases de données'),
		('devops', 'DevOps'),
		('mobile', 'Développement mobile'),
		('testing', 'Tests et QA'),
		('other', 'Autres'),
	]

	name = models.CharField(max_length=100, unique=True, verbose_name="Nom")
	category = models.CharField(max_length=20, choices=CATEGORIES, verbose_name="Catégorie")
	description = models.TextField(blank=True, verbose_name="Description")
	created_at = models.DateTimeField(auto_now_add=True, verbose_name="Créé le")

	class Meta:
		ordering = ['category', 'name']
		verbose_name = "Compétence"
		verbose_name_plural = "Compétences"

	def __str__(self):
		return f"{self.name} ({self.get_category_display()})"


class CandidateProfile(models.Model):
	"""Profil des candidats créé par l'admin"""
	user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, verbose_name="Utilisateur")
	first_name = models.CharField(max_length=100, verbose_name="Prénom")
	last_name = models.CharField(max_length=100, verbose_name="Nom")
	email = models.EmailField(unique=True, verbose_name="Email")
	phone = models.CharField(max_length=20, blank=True, verbose_name="Téléphone")
	photo = models.ImageField(upload_to='profile_photos/', blank=True, null=True, verbose_name="Photo de profil")
	bio = models.TextField(blank=True, verbose_name="Biographie")
	location = models.CharField(max_length=100, blank=True, verbose_name="Localisation")
	linkedin = models.URLField(blank=True, verbose_name="LinkedIn")
	skills = models.ManyToManyField(Skill, blank=True, verbose_name="Compétences")
	skills_with_proficiency = models.JSONField(default=list, blank=True, verbose_name="Compétences avec niveau")
	cv_file = models.FileField(upload_to='cvs/', blank=True, null=True, verbose_name="CV")
	created_at = models.DateTimeField(auto_now_add=True, verbose_name="Créé le")
	updated_at = models.DateTimeField(auto_now=True, verbose_name="Modifié le")

	class Meta:
		verbose_name = "Profil Candidat"
		verbose_name_plural = "Profils Candidats"

	def __str__(self):
		return f"{self.first_name} {self.last_name}"

	@property
	def full_name(self):
		return f"{self.first_name} {self.last_name}"

	@property
	def years_of_experience(self):
		total_months = 0
		# protect access if related manager isn't available
		experiences = getattr(self, 'work_experiences', None)
		if experiences is None:
			return 0
		for experience in experiences.all():
			if getattr(experience, 'start_date', None):
				end_date = experience.end_date or timezone.now().date()
				months = (end_date.year - experience.start_date.year) * 12 + (end_date.month - experience.start_date.month)
				total_months += max(0, months)
		return round(total_months / 12, 1)


class Education(models.Model):
	"""Educational background for candidates"""
	DEGREE_LEVELS = [
		('high_school', 'Baccalauréat'),
		('diploma', 'Diplôme/DUT'),
		('bachelor', 'Licence'),
		('master', 'Master'),
		('phd', 'Doctorat'),
		('certification', 'Certification'),
	]

	candidate = models.ForeignKey(CandidateProfile, on_delete=models.CASCADE, related_name='educations')
	institution = models.CharField(max_length=200, verbose_name="Établissement")
	degree = models.CharField(max_length=200, verbose_name="Diplôme/Formation")
	field_of_study = models.CharField(max_length=200, verbose_name="Domaine d'étude")
	degree_level = models.CharField(max_length=20, choices=DEGREE_LEVELS, verbose_name="Niveau")
	start_date = models.DateField(verbose_name="Date de début")
	end_date = models.DateField(null=True, blank=True, verbose_name="Date de fin")
	grade = models.CharField(max_length=50, blank=True, verbose_name="Mention/Note")
	description = models.TextField(blank=True, verbose_name="Description")
	is_current = models.BooleanField(default=False, verbose_name="En cours")

	class Meta:
		verbose_name = "Formation"
		verbose_name_plural = "Formations"
		ordering = ['-start_date']

	def __str__(self):
		return f"{self.degree} - {self.institution}"


class WorkExperience(models.Model):
	"""Work experience history for candidates"""
	candidate = models.ForeignKey(CandidateProfile, on_delete=models.CASCADE, related_name='work_experiences')
	company = models.CharField(max_length=200, verbose_name="Entreprise")
	position = models.CharField(max_length=200, verbose_name="Poste")
	location = models.CharField(max_length=100, blank=True, verbose_name="Lieu")
	start_date = models.DateField(verbose_name="Date de début")
	end_date = models.DateField(null=True, blank=True, verbose_name="Date de fin")
	description = models.TextField(verbose_name="Description des responsabilités")
	achievements = models.TextField(blank=True, verbose_name="Réalisations principales")
	technologies_used = models.JSONField(default=list, blank=True, verbose_name="Technologies utilisées")
	is_current = models.BooleanField(default=False, verbose_name="Poste actuel")

	class Meta:
		verbose_name = "Expérience Professionnelle"
		verbose_name_plural = "Expériences Professionnelles"
		ordering = ['-start_date']

	def __str__(self):
		return f"{self.position} chez {self.company}"

	@property
	def duration_months(self):
		if not self.start_date:
			return 0
		end_date = self.end_date or timezone.now().date()
		return (end_date.year - self.start_date.year) * 12 + (end_date.month - self.start_date.month)


class Project(models.Model):
	"""Personal and professional projects portfolio"""
	PROJECT_TYPES = [
		('personal', 'Projet Personnel'),
		('professional', 'Projet Professionnel'),
		('academic', 'Projet Académique'),
		('open_source', 'Open Source'),
	]

	candidate = models.ForeignKey(CandidateProfile, on_delete=models.CASCADE, related_name='projects')
	title = models.CharField(max_length=200, verbose_name="Titre du projet")
	description = models.TextField(verbose_name="Description")
	project_type = models.CharField(max_length=20, choices=PROJECT_TYPES, verbose_name="Type de projet")
	technologies_used = models.JSONField(default=list, verbose_name="Technologies utilisées")
	start_date = models.DateField(verbose_name="Date de début")
	end_date = models.DateField(null=True, blank=True, verbose_name="Date de fin")
	project_url = models.URLField(blank=True, verbose_name="URL du projet")
	github_url = models.URLField(blank=True, verbose_name="GitHub URL")
	demo_url = models.URLField(blank=True, verbose_name="URL de démonstration")
	achievements = models.TextField(blank=True, verbose_name="Résultats obtenus")
	is_featured = models.BooleanField(default=False, verbose_name="Projet mis en avant")

	class Meta:
		verbose_name = "Projet"
		verbose_name_plural = "Projets"
		ordering = ['-start_date']

	def __str__(self):
		return f"{self.title} ({self.get_project_type_display()})"


class TechnicalTest(models.Model):
	"""Tests techniques créés par l'admin avec import JSON"""
	test_name = models.CharField(max_length=200, verbose_name="Nom du test")
	skill = models.ForeignKey(Skill, on_delete=models.CASCADE, verbose_name="Compétence")
	description = models.TextField(blank=True, verbose_name="Description")
	instructions = models.TextField(verbose_name="Instructions")
	total_score = models.IntegerField(verbose_name="Score total")
	time_limit = models.IntegerField(help_text="Durée en minutes", verbose_name="Durée limite")
	is_active = models.BooleanField(default=True, verbose_name="Actif")
	json_data = models.JSONField(blank=True, null=True, help_text="Collez votre JSON de test ici pour import automatique", verbose_name="Données JSON")
	created_at = models.DateTimeField(auto_now_add=True, verbose_name="Créé le")

	class Meta:
		verbose_name = "Test Technique"
		verbose_name_plural = "Tests Techniques"
		ordering = ['skill__category', 'skill__name', 'test_name']

	def save(self, *args, **kwargs):
		json_changed = False
		if self.pk:
			try:
				old_instance = TechnicalTest.objects.get(pk=self.pk)
				json_changed = old_instance.json_data != self.json_data
			except TechnicalTest.DoesNotExist:
				json_changed = True
		else:
			json_changed = bool(self.json_data)

		super().save(*args, **kwargs)

		if json_changed and self.json_data:
			self.import_from_json()

	def import_from_json(self):
		"""A simplified JSON importer that creates TestQuestion entries."""
		if not self.json_data:
			return
		try:
			data = self.json_data if isinstance(self.json_data, dict) else json.loads(self.json_data)
			questions = data.get('questions', [])
			# Remove old questions
			self.testquestion_set.all().delete()
			for i, q in enumerate(questions, 1):
				# Basic tolerant parsing
				question_text = q.get('question') or q.get('question_text') or ''
				option_a = q.get('option_a') or (q.get('options') or [None])[0]
				option_b = q.get('option_b') or (q.get('options') or [None, None])[1]
				option_c = q.get('option_c') or (q.get('options') or [None, None, None])[2]
				option_d = q.get('option_d') or (q.get('options') or [None, None, None, None])[3]
				correct = (q.get('correct_answer') or '').lower()
				if not (question_text and option_a and option_b and option_c and option_d and correct):
					continue
				TestQuestion.objects.create(
					test=self,
					order=i,
					question_text=question_text,
					option_a=option_a,
					option_b=option_b,
					option_c=option_c,
					option_d=option_d,
					correct_answer=correct,
					points=q.get('points', 1),
					explanation=q.get('explanation', ''),
				)
		except Exception:
			# Keep importer tolerant in dev
			return


class TestQuestion(models.Model):
	"""Questions des tests techniques"""
	test = models.ForeignKey(TechnicalTest, on_delete=models.CASCADE, verbose_name="Test")
	order = models.IntegerField(default=1, verbose_name="Ordre")
	question_text = models.TextField(verbose_name="Question")
	option_a = models.CharField(max_length=500, verbose_name="Option A")
	option_b = models.CharField(max_length=500, verbose_name="Option B")
	option_c = models.CharField(max_length=500, verbose_name="Option C")
	option_d = models.CharField(max_length=500, verbose_name="Option D")
	correct_answer = models.CharField(max_length=1, choices=[('a', 'A'), ('b', 'B'), ('c', 'C'), ('d', 'D')], verbose_name="Réponse correcte")
	points = models.IntegerField(default=1, verbose_name="Points")
	explanation = models.TextField(blank=True, verbose_name="Explication")

	class Meta:
		ordering = ['order']
		verbose_name = "Question de Test"
		verbose_name_plural = "Questions de Test"

	def __str__(self):
		return f"Q{self.order}: {self.question_text[:50]}..."


class TestResult(models.Model):
	"""Résultats des tests passés par les candidats"""
	STATUS_CHOICES = [
		('in_progress', 'En cours'),
		('completed', 'Terminé'),
		('abandoned', 'Abandonné'),
	]

	candidate = models.ForeignKey(CandidateProfile, on_delete=models.CASCADE, verbose_name="Candidat")
	test = models.ForeignKey(TechnicalTest, on_delete=models.CASCADE, verbose_name="Test")
	score = models.IntegerField(verbose_name="Score")
	answers_data = models.JSONField(verbose_name="Données des réponses")
	time_taken = models.IntegerField(help_text="Temps en secondes", verbose_name="Temps pris")
	status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='in_progress', verbose_name="Statut")
	started_at = models.DateTimeField(auto_now_add=True, verbose_name="Commencé le")
	completed_at = models.DateTimeField(blank=True, null=True, verbose_name="Terminé le")

	class Meta:
		unique_together = ['candidate', 'test']
		ordering = ['-started_at']
		verbose_name = "Résultat de Test"
		verbose_name_plural = "Résultats de Tests"

	def save(self, *args, **kwargs):
		if self.status == 'completed' and not self.completed_at:
			self.completed_at = timezone.now()
		super().save(*args, **kwargs)

	@property
	def percentage(self):
		if self.test and self.test.total_score > 0:
			return round((self.score / self.test.total_score) * 100, 1)
		return 0

	def __str__(self):
		return f"{self.candidate} - {self.test} ({self.score}/{self.test.total_score})"

