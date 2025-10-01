from django.db import models
from django.contrib import admin

class QuestionOption(models.Model):
 """Question options with scoring for SJT tests"""
 question = models.ForeignKey('Question', on_delete=models.CASCADE, related_name='question_options')
 option_text = models.TextField()
 score_value = models.IntegerField(help_text="Score: +2 (Best), +1 (Acceptable), 0 (Unacceptable), -1 (Must Not Choose)")
 option_letter = models.CharField(max_length=1, help_text="A, B, C, D")
 created_at = models.DateTimeField(auto_now_add=True)

 class Meta:
 ordering = ['question', 'option_letter']
 verbose_name = "Question Option"
 verbose_name_plural = "Question Options"
 db_table = 'testsengine_questionoption'

 def __str__(self):
 return f"Q{self.question.id} {self.option_letter}: {self.option_text[:50]}... (Score: {self.score_value})"

@admin.register(QuestionOption)
class QuestionOptionAdmin(admin.ModelAdmin):
 list_display = ['question', 'option_letter', 'option_text_short', 'score_value', 'score_description']
 list_filter = ['score_value', 'question__test', 'created_at']
 search_fields = ['option_text', 'question__question_text']
 ordering = ['question', 'option_letter']
 list_editable = ['score_value']

 def option_text_short(self, obj):
 return obj.option_text[:60] + "..." if len(obj.option_text) > 60 else obj.option_text
 option_text_short.short_description = "Option Text"

 def score_description(self, obj):
 score_map = {2: "Best Option", 1: "Acceptable", 0: "Unacceptable", -1: "Must Not Choose"}
 return score_map.get(obj.score_value, "Unknown")
 score_description.short_description = "Score Description"
