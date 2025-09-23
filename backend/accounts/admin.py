from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.html import format_html
from .models import User, UserProfile

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """Custom User admin"""
    
    list_display = [
        'email', 'full_name', 'profession', 'career_field', 
        'level', 'is_verified', 'is_active', 'date_joined'
    ]
    list_filter = [
        'is_active', 'is_verified', 'level', 'career_field', 
        'profession', 'date_joined', 'last_login'
    ]
    search_fields = ['email', 'full_name', 'profession', 'career_field']
    ordering = ['-date_joined']
    
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal Info', {
            'fields': (
                'full_name', 'location', 'profession', 'career_field', 
                'level', 'profile_picture', 'bio'
            )
        }),
        ('Permissions', {
            'fields': (
                'is_active', 'is_staff', 'is_superuser', 
                'is_verified', 'groups', 'user_permissions'
            )
        }),
        ('Important Dates', {
            'fields': ('last_login', 'date_joined', 'last_login_ip')
        }),
        ('Verification', {
            'fields': ('verification_token', 'password_reset_token', 'password_reset_expires'),
            'classes': ('collapse',)
        }),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': (
                'email', 'full_name', 'password1', 'password2',
                'location', 'profession', 'career_field', 'level'
            ),
        }),
    )
    
    readonly_fields = ['date_joined', 'last_login', 'verification_token']
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('profile')

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    """User Profile admin"""
    
    list_display = [
        'user', 'total_tests_taken', 'average_score', 
        'best_score', 'profile_visibility'
    ]
    list_filter = ['profile_visibility', 'created_at']
    search_fields = ['user__email', 'user__full_name']
    readonly_fields = ['total_tests_taken', 'average_score', 'best_score', 'total_time_spent']
    
    fieldsets = (
        ('User', {'fields': ('user',)}),
        ('Skills & Interests', {
            'fields': ('skills', 'interests', 'job_preferences'),
            'classes': ('collapse',)
        }),
        ('Test Statistics', {
            'fields': (
                'total_tests_taken', 'average_score', 'best_score', 'total_time_spent'
            )
        }),
        ('Career Goals', {
            'fields': (
                'career_goals', 'target_salary_min', 'target_salary_max', 
                'preferred_locations'
            ),
            'classes': ('collapse',)
        }),
        ('Privacy', {'fields': ('profile_visibility',)}),
        ('Timestamps', {'fields': ('created_at', 'updated_at')}),
    )
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('user')