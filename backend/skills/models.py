from django.db import models
from django.contrib.auth.models import User
import json
from django.utils import timezone

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
        ('other', 'Autres')
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
    user = models.OneToOneField(User, on_delete=models.CASCADE, verbose_name="Utilisateur")
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

class TechnicalTest(models.Model):
    """Tests techniques créés par l'admin avec import JSON"""
    test_name = models.CharField(max_length=200, verbose_name="Nom du test")
    skill = models.ForeignKey(Skill, on_delete=models.CASCADE, verbose_name="Compétence")
    description = models.TextField(blank=True, verbose_name="Description")
    instructions = models.TextField(verbose_name="Instructions")
    total_score = models.IntegerField(verbose_name="Score total")
    time_limit = models.IntegerField(help_text="Durée en minutes", verbose_name="Durée limite")
    is_active = models.BooleanField(default=True, verbose_name="Actif")
    json_data = models.JSONField(
        blank=True, 
        null=True, 
        help_text="Collez votre JSON de test ici pour import automatique",
        verbose_name="Données JSON"
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Créé le")
    
    class Meta:
        verbose_name = "Test Technique"
        verbose_name_plural = "Tests Techniques"
        ordering = ['skill__category', 'skill__name', 'test_name']
    
    def save(self, *args, **kwargs):
        # Vérifier si json_data a changé
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
        
        # Import automatique si JSON est présent et a changé
        if json_changed and self.json_data:
            self.import_from_json()
    
    def import_from_json(self):
        """Import automatique des questions depuis JSON - supporte 2 formats"""
        if not self.json_data:
            return
            
        try:
            # Gérer les données JSON (dict ou string)
            if isinstance(self.json_data, dict):
                data = self.json_data
            elif isinstance(self.json_data, str):
                data = json.loads(self.json_data)
            else:
                print(f"Format JSON invalide pour le test {self.test_name}")
                return
            
            # Supprimer les anciennes questions
            self.testquestion_set.all().delete()
            
            # Créer les nouvelles questions
            questions_data = data.get('questions', [])
            if not questions_data:
                print(f"Aucune question trouvée dans le JSON pour le test {self.test_name}")
                return
            
            questions_created = 0
            for i, q_data in enumerate(questions_data, 1):
                try:
                    # NOUVEAU: Détecter et convertir les deux formats
                    
                    # Format 1: Standard (question + options array)
                    if 'question' in q_data and 'options' in q_data:
                        question_text = q_data['question']
                        options = q_data['options']
                        if len(options) < 4:
                            print(f"Question {i}: pas assez d'options, ignorée")
                            continue
                        option_a, option_b, option_c, option_d = options[0], options[1], options[2], options[3]
                    
                    # Format 2: Admin Django (question_text + option_a, option_b, etc.)
                    elif 'question_text' in q_data and 'option_a' in q_data:
                        question_text = q_data['question_text']
                        option_a = q_data.get('option_a', '')
                        option_b = q_data.get('option_b', '')
                        option_c = q_data.get('option_c', '')
                        option_d = q_data.get('option_d', '')
                        
                        if not all([option_a, option_b, option_c, option_d]):
                            print(f"Question {i}: options incomplètes, ignorée")
                            continue
                    
                    else:
                        print(f"Question {i}: format non reconnu, ignorée")
                        print(f"  Clés disponibles: {list(q_data.keys())}")
                        continue
                    
                    # Vérifier la réponse correcte
                    if 'correct_answer' not in q_data:
                        print(f"Question {i}: pas de réponse correcte, ignorée")
                        continue
                    
                    TestQuestion.objects.create(
                        test=self,
                        order=i,
                        question_text=question_text,
                        option_a=option_a,
                        option_b=option_b,
                        option_c=option_c,
                        option_d=option_d,
                        correct_answer=q_data['correct_answer'].lower(),
                        points=q_data.get('points', 1),
                        explanation=q_data.get('explanation', '')
                    )
                    questions_created += 1
                    
                except Exception as e:
                    print(f"Erreur création question {i}: {e}")
            
            print(f"✅ Test {self.test_name}: {questions_created} questions créées automatiquement")
                
        except json.JSONDecodeError as e:
            print(f"Erreur JSON pour le test {self.test_name}: {e}")
        except Exception as e:
            print(f"Erreur import pour le test {self.test_name}: {e}")
    
    def __str__(self):
        return f"{self.test_name} - {self.skill.name}"
    
    @property
    def question_count(self):
        return self.testquestion_set.count()

class TestQuestion(models.Model):
    """Questions des tests techniques"""
    test = models.ForeignKey(TechnicalTest, on_delete=models.CASCADE, verbose_name="Test")
    order = models.IntegerField(default=1, verbose_name="Ordre")
    question_text = models.TextField(verbose_name="Question")
    option_a = models.CharField(max_length=500, verbose_name="Option A")
    option_b = models.CharField(max_length=500, verbose_name="Option B")
    option_c = models.CharField(max_length=500, verbose_name="Option C")
    option_d = models.CharField(max_length=500, verbose_name="Option D")
    correct_answer = models.CharField(
        max_length=1, 
        choices=[('a', 'A'), ('b', 'B'), ('c', 'C'), ('d', 'D')],
        verbose_name="Réponse correcte"
    )
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
        ('abandoned', 'Abandonné')
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
        if self.test.total_score > 0:
            return round((self.score / self.test.total_score) * 100, 1)
        return 0
    
    def __str__(self):
        return f"{self.candidate} - {self.test} ({self.score}/{self.test.total_score})"
