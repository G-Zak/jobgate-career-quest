"""Minimal, stable models for the testsengine app.

This module intentionally contains a small, well-formed set of models so
Django can import the app during development. Expand these carefully once
the environment is stable.
"""

from django.conf import settings
from django.db import models


class Test(models.Model):
    """A minimal Test model."""

    title = models.CharField(max_length=200)
    test_type = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["test_type", "title"]

    def __str__(self):
        return f"{self.title} ({self.test_type})"


class Question(models.Model):
    test = models.ForeignKey(Test, on_delete=models.CASCADE, related_name="questions")
    question_text = models.TextField()
    order = models.PositiveIntegerField()

    class Meta:
        ordering = ["test", "order"]

    def __str__(self):
        return f"Q{self.order}: {self.question_text[:50]}..."


class TestSession(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    test = models.ForeignKey(Test, on_delete=models.CASCADE)
    started_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        # username may not exist for some user models in tests; use str(user)
        try:
            uname = self.user.username
        except Exception:
            uname = str(self.user)
        return f"{uname} - {self.test.title}"


class TestAnswer(models.Model):
    session = models.ForeignKey(TestSession, on_delete=models.CASCADE, related_name="answers")
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    selected_answer = models.CharField(max_length=255)

    def __str__(self):
        try:
            uname = self.session.user.username
        except Exception:
            uname = str(self.session.user)
        return f"{uname} - Q{self.question.order}: {self.selected_answer}"