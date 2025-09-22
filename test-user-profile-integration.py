#!/usr/bin/env python
"""
Test script to verify user profile integration
"""
import requests
import json

def test_user_profile_integration():
    base_url = "http://localhost:8000"
    
    print("Testing User Profile Integration")
    print("=" * 50)
    
    # Sample user profile data (matching the frontend structure)
    user_profile = {
        "id": 1,
        "name": "Zakaria Guennani",
        "email": "zakaria@example.com",
        "skills": ["Python", "JavaScript", "React", "Node.js", "Django"],
        "skillsWithProficiency": [
            {"name": "Python", "proficiency": "advanced"},
            {"name": "JavaScript", "proficiency": "expert"},
            {"name": "React", "proficiency": "advanced"},
            {"name": "Node.js", "proficiency": "intermediate"},
            {"name": "Django", "proficiency": "intermediate"}
        ],
        "contact": {
            "location": "Casablanca, Maroc"
        }
    }
    
    # Test 1: Get recommendations with user profile
    print("\n1. Testing recommendations with user profile...")
    try:
        params = {
            'user_profile': json.dumps(user_profile),
            'limit': 5
        }
        response = requests.get(f"{base_url}/api/recommendations/", params=params)
        print(f"   Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"   ✓ Success - Found {len(data.get('recommendations', []))} recommendations")
            if data.get('recommendations'):
                rec = data['recommendations'][0]
                print(f"   Sample recommendation: {rec.get('job', {}).get('title', 'N/A')}")
                print(f"   Match score: {rec.get('overall_score', 'N/A')}%")
        else:
            print(f"   ✗ Error: {response.text[:200]}")
    except Exception as e:
        print(f"   ✗ Exception: {e}")
    
    # Test 2: Get skills analysis with user profile
    print("\n2. Testing skills analysis with user profile...")
    try:
        params = {
            'user_profile': json.dumps(user_profile)
        }
        response = requests.get(f"{base_url}/api/recommendations/skills/analysis/", params=params)
        print(f"   Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"   ✓ Success - Found {len(data.get('top_skills', []))} skills")
            if data.get('top_skills'):
                skill = data['top_skills'][0]
                print(f"   Sample skill: {skill.get('name', 'N/A')} ({skill.get('level', 'N/A')})")
        else:
            print(f"   ✗ Error: {response.text[:200]}")
    except Exception as e:
        print(f"   ✗ Exception: {e}")
    
    # Test 3: Search jobs
    print("\n3. Testing job search...")
    try:
        params = {
            'q': 'python',
            'location': 'casablanca'
        }
        response = requests.get(f"{base_url}/api/recommendations/jobs/search/", params=params)
        print(f"   Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"   ✓ Success - Found {len(data.get('jobs', []))} jobs")
        else:
            print(f"   ✗ Error: {response.text[:200]}")
    except Exception as e:
        print(f"   ✗ Exception: {e}")
    
    print("\n" + "=" * 50)
    print("User Profile Integration Test Complete!")

if __name__ == "__main__":
    test_user_profile_integration()
