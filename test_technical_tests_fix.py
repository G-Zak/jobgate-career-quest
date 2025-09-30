#!/usr/bin/env python3
"""
Test script to verify technical test percentage fix
This script tests the backend API endpoints for test results
"""

import requests
import json
import sys

# Backend API base URL
BASE_URL = "http://localhost:8000"

def test_backend_connection():
    """Test if backend is running"""
    try:
        response = requests.get(f"{BASE_URL}/api/tests/", timeout=5)
        if response.status_code == 200:
            print("✅ Backend is running")
            return True
        else:
            print(f"❌ Backend returned status {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ Cannot connect to backend: {e}")
        return False

def test_user_submissions():
    """Test getting user submissions"""
    try:
        # Test with anonymous user (for testing purposes)
        response = requests.get(f"{BASE_URL}/api/my-submissions/", timeout=10)
        print(f"📊 User submissions response status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"📋 Found {len(data)} submissions")
            
            if data:
                print("📝 Sample submission:")
                sample = data[0]
                print(f"  - Test ID: {sample.get('test_id')}")
                print(f"  - Score: {sample.get('percentage_score')}%")
                print(f"  - Passed: {sample.get('passed')}")
                print(f"  - Submitted: {sample.get('submitted_at')}")
            
            return True
        else:
            print(f"❌ Error getting submissions: {response.text}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Error testing user submissions: {e}")
        return False

def test_recommendation_api():
    """Test the recommendation API with test scores"""
    try:
        # Test the proportional test recommendations endpoint
        payload = {
            "skills": ["Python", "JavaScript", "React"],
            "location": "Casablanca, Morocco",
            "limit": 5
        }
        
        response = requests.post(
            f"{BASE_URL}/api/recommendations/proportional-test/",
            json=payload,
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        
        print(f"📊 Recommendation API response status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            recommendations = data.get('recommendations', [])
            print(f"📋 Found {len(recommendations)} recommendations")
            
            if recommendations:
                print("📝 Sample recommendation:")
                sample = recommendations[0]
                score_breakdown = sample.get('score_breakdown', {})
                print(f"  - Job: {sample.get('job_title')} at {sample.get('company')}")
                print(f"  - Global Score: {score_breakdown.get('global_score')}%")
                print(f"  - Skills Score: {score_breakdown.get('skills_score')}%")
                print(f"  - Test Score: {score_breakdown.get('test_score')}%")
                print(f"  - Location Score: {score_breakdown.get('location_score')}%")
                
                # Check if test details are present
                test_details = score_breakdown.get('test_details', {})
                if test_details:
                    print(f"  - Test Details: {test_details.get('passed_tests', 0)}/{test_details.get('total_relevant_tests', 0)} tests passed")
                else:
                    print("  - No test details found")
            
            return True
        else:
            print(f"❌ Error getting recommendations: {response.text}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Error testing recommendation API: {e}")
        return False

def main():
    """Run all tests"""
    print("🧪 Testing Technical Tests Percentage Fix")
    print("=" * 50)
    
    # Test 1: Backend connection
    print("\n1. Testing backend connection...")
    if not test_backend_connection():
        print("❌ Backend is not running. Please start the backend server.")
        sys.exit(1)
    
    # Test 2: User submissions
    print("\n2. Testing user submissions...")
    test_user_submissions()
    
    # Test 3: Recommendation API
    print("\n3. Testing recommendation API...")
    test_recommendation_api()
    
    print("\n" + "=" * 50)
    print("✅ Test completed!")
    print("\nTo verify the fix:")
    print("1. Start the frontend: cd frontend && npm start")
    print("2. Take a technical test")
    print("3. Check the job recommendations page")
    print("4. Verify that technical test percentage shows correctly")

if __name__ == "__main__":
    main()

