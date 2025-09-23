from django.contrib.auth.models import AbstractUser
from django.db import models
from django.contrib.auth.hashers import make_password
import uuid

class User(AbstractUser):
    """Custom User model extending Django's AbstractUser"""
    
    # Basic profile fields
    full_name = models.CharField(max_length=255, blank=True)
    email = models.EmailField(unique=True)
    location = models.CharField(max_length=255, blank=True)
    profession = models.CharField(max_length=255, blank=True)
    career_field = models.CharField(max_length=255, blank=True)
    level = models.CharField(max_length=50, default='Beginner', choices=[
        ('Beginner', 'Beginner'),
        ('Intermediate', 'Intermediate'),
        ('Advanced', 'Advanced'),
        ('Expert', 'Expert'),
    ])
    
    # CV and profile
    cv_placeholder = models.TextField(blank=True, help_text="Placeholder for future CV upload")
    profile_picture = models.URLField(blank=True)
    bio = models.TextField(blank=True, max_length=500)
    
    # Authentication
    is_verified = models.BooleanField(default=False)
    verification_token = models.UUIDField(default=uuid.uuid4, editable=False)
    password_reset_token = models.UUIDField(null=True, blank=True, editable=False)
    password_reset_expires = models.DateTimeField(null=True, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    last_login_ip = models.GenericIPAddressField(null=True, blank=True)
    
    # Override username to use email
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'full_name']
    
    # Fix related_name conflicts
    groups = models.ManyToManyField(
        'auth.Group',
        verbose_name='groups',
        blank=True,
        help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.',
        related_name="custom_user_set",
        related_query_name="custom_user",
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        verbose_name='user permissions',
        blank=True,
        help_text='Specific permissions for this user.',
        related_name="custom_user_set",
        related_query_name="custom_user",
    )
    
    class Meta:
        db_table = 'users'
        verbose_name = 'User'
        verbose_name_plural = 'Users'
    
    def __str__(self):
        return f"{self.full_name} ({self.email})"
    
    def save(self, *args, **kwargs):
        # Hash password if it's not already hashed
        if self.password and not self.password.startswith('pbkdf2_'):
            self.password = make_password(self.password)
        super().save(*args, **kwargs)
    
    @property
    def display_name(self):
        return self.full_name or self.username
    
    def get_profile_data(self):
        """Get user profile data for API responses"""
        return {
            'id': self.id,
            'full_name': self.full_name,
            'email': self.email,
            'location': self.location,
            'profession': self.profession,
            'career_field': self.career_field,
            'level': self.level,
            'profile_picture': self.profile_picture,
            'bio': self.bio,
            'is_verified': self.is_verified,
            'created_at': self.created_at.isoformat(),
            'last_login': self.last_login.isoformat() if self.last_login else None,
        }

class UserProfile(models.Model):
    """Extended user profile for additional data"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    
    # Skills and preferences
    skills = models.JSONField(default=list, blank=True)
    interests = models.JSONField(default=list, blank=True)
    job_preferences = models.JSONField(default=dict, blank=True)
    
    # Test history summary
    total_tests_taken = models.IntegerField(default=0)
    average_score = models.FloatField(default=0.0)
    best_score = models.FloatField(default=0.0)
    total_time_spent = models.IntegerField(default=0)  # in minutes
    
    # Career goals
    career_goals = models.TextField(blank=True)
    target_salary_min = models.IntegerField(null=True, blank=True)
    target_salary_max = models.IntegerField(null=True, blank=True)
    preferred_locations = models.JSONField(default=list, blank=True)
    
    # Privacy settings
    profile_visibility = models.CharField(
        max_length=20,
        choices=[
            ('public', 'Public'),
            ('private', 'Private'),
            ('connections', 'Connections Only'),
        ],
        default='public'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'user_profiles'
    
    def __str__(self):
        return f"Profile for {self.user.display_name}"
    
    def update_test_stats(self, score, time_spent):
        """Update test statistics when user completes a test"""
        self.total_tests_taken += 1
        
        # Update average score
        if self.total_tests_taken == 1:
            self.average_score = score
        else:
            self.average_score = ((self.average_score * (self.total_tests_taken - 1)) + score) / self.total_tests_taken
        
        # Update best score
        if score > self.best_score:
            self.best_score = score
        
        # Update total time
        self.total_time_spent += time_spent
        
        self.save()