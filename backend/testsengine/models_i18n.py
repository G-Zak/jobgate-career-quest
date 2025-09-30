"""
Enhanced models with internationalization support for numerical tests
"""
from django.db import models
from django.conf import settings
from .models import Test, Question
import json


class TestTranslation(models.Model):
    """
    Translations for Test model
    """
    LANGUAGE_CHOICES = [
        ('en', 'English'),
        ('fr', 'French'),
    ]
    
    test = models.ForeignKey(Test, on_delete=models.CASCADE, related_name='translations')
    language = models.CharField(max_length=5, choices=LANGUAGE_CHOICES)
    
    # Translated fields
    title = models.CharField(max_length=200)
    description = models.TextField()
    instructions = models.TextField(blank=True, null=True)
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ['test', 'language']
        db_table = 'test_translations'
        
    def __str__(self):
        return f"{self.test.title} ({self.language})"


class QuestionTranslation(models.Model):
    """
    Translations for Question model
    """
    LANGUAGE_CHOICES = [
        ('en', 'English'),
        ('fr', 'French'),
    ]
    
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='translations')
    language = models.CharField(max_length=5, choices=LANGUAGE_CHOICES)
    
    # Translated fields
    question_text = models.TextField()
    passage = models.TextField(blank=True, null=True)  # For reading comprehension
    context = models.TextField(blank=True, null=True)
    options = models.JSONField(help_text="Translated options as JSON array")
    explanation = models.TextField(blank=True, null=True)
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ['question', 'language']
        db_table = 'question_translations'
        
    def __str__(self):
        return f"Question {self.question.id} ({self.language})"


class NumericalTestCategory(models.Model):
    """
    Categories for numerical test questions
    """
    CATEGORY_CHOICES = [
        ('basic_arithmetic', 'Basic Arithmetic'),
        ('percentages', 'Percentages and Ratios'),
        ('data_interpretation', 'Data Interpretation'),
        ('word_problems', 'Word Problems'),
        ('financial_calculations', 'Financial Calculations'),
        ('statistics', 'Statistics and Probability'),
        ('algebra', 'Basic Algebra'),
        ('geometry', 'Geometry and Measurement'),
    ]
    
    name = models.CharField(max_length=50, choices=CATEGORY_CHOICES, unique=True)
    display_order = models.PositiveIntegerField(default=1)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        ordering = ['display_order', 'name']
        db_table = 'numerical_test_categories'
        
    def __str__(self):
        return self.get_name_display()


class NumericalTestCategoryTranslation(models.Model):
    """
    Translations for numerical test categories
    """
    LANGUAGE_CHOICES = [
        ('en', 'English'),
        ('fr', 'French'),
    ]
    
    category = models.ForeignKey(NumericalTestCategory, on_delete=models.CASCADE, related_name='translations')
    language = models.CharField(max_length=5, choices=LANGUAGE_CHOICES)
    
    # Translated fields
    display_name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    
    class Meta:
        unique_together = ['category', 'language']
        db_table = 'numerical_category_translations'
        
    def __str__(self):
        return f"{self.category.name} ({self.language})"


# Enhanced Question model extension for numerical tests
class NumericalQuestionExtension(models.Model):
    """
    Extended fields specific to numerical reasoning questions
    """
    question = models.OneToOneField(Question, on_delete=models.CASCADE, related_name='numerical_extension')
    category = models.ForeignKey(NumericalTestCategory, on_delete=models.CASCADE)
    
    # Numerical-specific fields
    calculation_steps = models.JSONField(default=list, blank=True, help_text="Step-by-step calculation process")
    formula_used = models.CharField(max_length=200, blank=True, null=True)
    data_table = models.JSONField(default=dict, blank=True, help_text="Data table if applicable")
    chart_data = models.JSONField(default=dict, blank=True, help_text="Chart/graph data if applicable")
    
    # Difficulty indicators
    requires_calculator = models.BooleanField(default=False)
    multiple_steps = models.BooleanField(default=False)
    data_interpretation_required = models.BooleanField(default=False)
    
    # Performance tracking
    average_time_seconds = models.PositiveIntegerField(default=60)
    success_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0.0)
    
    class Meta:
        db_table = 'numerical_question_extensions'
        
    def __str__(self):
        return f"Numerical Extension for Question {self.question.id}"
