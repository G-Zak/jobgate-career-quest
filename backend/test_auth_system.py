#!/usr/bin/env python
"""
Test script for the authentication system
"""
import os
import sys
import django
import requests
import json

# Add the backend directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'careerquest.settings')
django.setup()

from accounts.models import User, UserProfile

def test_user_creation():
    """Test user creation and profile setup"""
    print("🧪 Testing User Creation...")
    
    # Create a test user
    user_data = {
        'full_name': 'Test User',
        'email': 'test@example.com',
        'password': 'testpassword123',
        'location': 'Test City',
        'profession': 'Software Developer',
        'career_field': 'Technology',
        'level': 'Intermediate'
    }
    
    try:
        # Create user
        user = User.objects.create_user(
            username=user_data['email'],
            email=user_data['email'],
            full_name=user_data['full_name'],
            location=user_data['location'],
            profession=user_data['profession'],
            career_field=user_data['career_field'],
            level=user_data['level'],
            password=user_data['password']
        )
        
        # Create user profile
        profile = UserProfile.objects.create(user=user)
        
        print(f"✅ User created successfully: {user.email}")
        print(f"✅ Profile created: {profile}")
        
        # Test user methods
        print(f"✅ Display name: {user.display_name}")
        print(f"✅ Profile data: {user.get_profile_data()}")
        
        return user
        
    except Exception as e:
        print(f"❌ Error creating user: {e}")
        return None

def test_api_endpoints():
    """Test authentication API endpoints"""
    print("\n🧪 Testing API Endpoints...")
    
    base_url = "http://localhost:8000/api/auth"
    
    # Test health check
    try:
        response = requests.get(f"{base_url}/health/")
        if response.status_code == 200:
            print("✅ Health check endpoint working")
        else:
            print(f"❌ Health check failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Health check error: {e}")
    
    # Test registration
    try:
        registration_data = {
            "full_name": "API Test User",
            "email": "apitest@example.com",
            "password": "testpassword123",
            "confirm_password": "testpassword123",
            "location": "API Test City",
            "profession": "API Developer",
            "career_field": "Technology",
            "level": "Beginner"
        }
        
        response = requests.post(f"{base_url}/register/", json=registration_data)
        if response.status_code == 201:
            data = response.json()
            print("✅ Registration endpoint working")
            print(f"✅ User registered: {data.get('user', {}).get('email')}")
            return data.get('tokens', {}).get('access')
        else:
            print(f"❌ Registration failed: {response.status_code}")
            print(f"Response: {response.text}")
    except Exception as e:
        print(f"❌ Registration error: {e}")
    
    return None

def test_login(access_token=None):
    """Test login functionality"""
    print("\n🧪 Testing Login...")
    
    base_url = "http://localhost:8000/api/auth"
    
    try:
        login_data = {
            "email": "apitest@example.com",
            "password": "testpassword123"
        }
        
        response = requests.post(f"{base_url}/login/", json=login_data)
        if response.status_code == 200:
            data = response.json()
            print("✅ Login endpoint working")
            print(f"✅ User logged in: {data.get('user', {}).get('email')}")
            return data.get('tokens', {}).get('access')
        else:
            print(f"❌ Login failed: {response.status_code}")
            print(f"Response: {response.text}")
    except Exception as e:
        print(f"❌ Login error: {e}")
    
    return None

def test_protected_endpoints(access_token):
    """Test protected endpoints with authentication"""
    print("\n🧪 Testing Protected Endpoints...")
    
    base_url = "http://localhost:8000/api/auth"
    headers = {"Authorization": f"Bearer {access_token}"}
    
    # Test profile endpoint
    try:
        response = requests.get(f"{base_url}/profile/", headers=headers)
        if response.status_code == 200:
            print("✅ Profile endpoint working")
        else:
            print(f"❌ Profile endpoint failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Profile endpoint error: {e}")
    
    # Test dashboard data endpoint
    try:
        response = requests.get(f"{base_url}/dashboard-data/", headers=headers)
        if response.status_code == 200:
            print("✅ Dashboard data endpoint working")
        else:
            print(f"❌ Dashboard data endpoint failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Dashboard data endpoint error: {e}")

def main():
    """Main test function"""
    print("🚀 Starting Authentication System Tests...")
    print("=" * 50)
    
    # Test 1: User creation
    user = test_user_creation()
    
    # Test 2: API endpoints
    access_token = test_api_endpoints()
    
    # Test 3: Login
    if not access_token:
        access_token = test_login()
    
    # Test 4: Protected endpoints
    if access_token:
        test_protected_endpoints(access_token)
    
    print("\n" + "=" * 50)
    print("🏁 Authentication System Tests Complete!")
    
    if user:
        print(f"📊 Test Results:")
        print(f"   - User created: ✅")
        print(f"   - Profile created: ✅")
        print(f"   - API endpoints: {'✅' if access_token else '❌'}")
        print(f"   - Authentication: {'✅' if access_token else '❌'}")

if __name__ == "__main__":
    main()
