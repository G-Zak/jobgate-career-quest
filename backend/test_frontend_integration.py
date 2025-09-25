"""
Test frontend integration to see what data is actually being sent
"""
import os
import sys
import django
import requests
import json

# Setup Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'careerquest.settings')
django.setup()

def test_frontend_integration():
    print("🔍 Testing Frontend Integration")
    print("=" * 50)
    
    base_url = "http://localhost:8000"
    
    # Login
    login_data = {
        'username': 'testuser_auth',
        'password': 'testpass123'
    }
    
    try:
        login_response = requests.post(f"{base_url}/api/auth/login/", json=login_data)
        if login_response.status_code == 200:
            auth_data = login_response.json()
            tokens = auth_data.get('tokens', {})
            access_token = tokens.get('access')
            print("✅ Authentication successful")
        else:
            print(f"❌ Authentication failed: {login_response.status_code}")
            return
    except Exception as e:
        print(f"❌ Authentication error: {e}")
        return
    
    # Test with the exact same data the frontend would send
    headers = {
        'Authorization': f'Bearer {access_token}',
        'Content-Type': 'application/json'
    }
    
    # This is the exact format the frontend sends
    request_data = {
        'profile': {
            'skills': ['Java', 'SQLite', 'Spring Boot'],
            'location': 'Casablanca',
            'experienceLevel': 'intermediate'
        },
        'limit': 1
    }
    
    try:
        response = requests.post(
            f"{base_url}/api/recommendations/advanced/",
            json=request_data,
            headers=headers
        )
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ API Response successful")
            print(f"Total recommendations: {data.get('total_count', 'N/A')}")
            
            if data.get('recommendations'):
                rec = data['recommendations'][0]
                print(f"\n📊 Raw API Response for: {rec['title']}")
                print(f"Location: {rec['location']}")
                
                # Check the exact structure
                if 'ai_powered_match' in rec:
                    ai_match = rec['ai_powered_match']
                    print(f"\n🤖 AI-Powered Match Structure:")
                    print(f"  Overall Score: {ai_match.get('overall_score', 'N/A')}")
                    
                    if 'breakdown' in ai_match:
                        breakdown = ai_match['breakdown']
                        
                        # Check skill_match structure
                        if 'skill_match' in breakdown:
                            skill_match = breakdown['skill_match']
                            print(f"\n📈 Skill Match Structure:")
                            print(f"  Score: {skill_match.get('score', 'N/A')}")
                            
                            if 'required_skills' in skill_match:
                                req_skills = skill_match['required_skills']
                                print(f"  Required Skills:")
                                print(f"    Matched: {req_skills.get('matched', 'N/A')}")
                                print(f"    Total: {req_skills.get('total', 'N/A')}")
                                print(f"    Percentage: {req_skills.get('percentage', 'N/A')}")
                                print(f"    Matched Skills: {req_skills.get('matched_skills', [])}")
                                print(f"    Missing Skills: {req_skills.get('missing_skills', [])}")
                            
                            if 'preferred_skills' in skill_match:
                                pref_skills = skill_match['preferred_skills']
                                print(f"  Preferred Skills:")
                                print(f"    Matched: {pref_skills.get('matched', 'N/A')}")
                                print(f"    Total: {pref_skills.get('total', 'N/A')}")
                                print(f"    Percentage: {pref_skills.get('percentage', 'N/A')}")
                        
                        # Check other breakdown components
                        if 'cluster_fit' in breakdown:
                            cluster = breakdown['cluster_fit']
                            print(f"\n🎯 Cluster Fit:")
                            print(f"  Score: {cluster.get('score', 'N/A')}")
                            print(f"  Cluster ID: {cluster.get('cluster_id', 'N/A')}")
                            print(f"  Cluster Name: {cluster.get('cluster_name', 'N/A')}")
                        
                        if 'location_remote_fit' in breakdown:
                            loc_fit = breakdown['location_remote_fit']
                            print(f"\n📍 Location & Remote Fit:")
                            print(f"  Location Match: {loc_fit.get('location_match', 'N/A')}")
                            print(f"  Location Bonus: {loc_fit.get('location_bonus', 'N/A')}")
                            print(f"  Remote Available: {loc_fit.get('remote_available', 'N/A')}")
                            print(f"  Remote Bonus: {loc_fit.get('remote_bonus', 'N/A')}")
                        
                        if 'experience_seniority' in breakdown:
                            exp_fit = breakdown['experience_seniority']
                            print(f"\n👤 Experience & Seniority:")
                            print(f"  User Experience: {exp_fit.get('user_experience', 'N/A')}")
                            print(f"  Job Seniority: {exp_fit.get('job_seniority', 'N/A')}")
                            print(f"  Experience Bonus: {exp_fit.get('experience_bonus', 'N/A')}")
                        
                        if 'overall_breakdown' in breakdown:
                            overall = breakdown['overall_breakdown']
                            print(f"\n📊 Overall Breakdown:")
                            print(f"  Skill Match Contribution: {overall.get('skill_match_contribution', 'N/A')}")
                            print(f"  Content Similarity Contribution: {overall.get('content_similarity_contribution', 'N/A')}")
                            print(f"  Cluster Fit Contribution: {overall.get('cluster_fit_contribution', 'N/A')}")
                            print(f"  Location Contribution: {overall.get('location_contribution', 'N/A')}")
                            print(f"  Experience Contribution: {overall.get('experience_contribution', 'N/A')}")
                            print(f"  Remote Contribution: {overall.get('remote_contribution', 'N/A')}")
                            print(f"  Total Calculated: {overall.get('total_calculated', 'N/A')}")
                else:
                    print("❌ No ai_powered_match in response")
            else:
                print("❌ No recommendations found")
        else:
            print(f"❌ Request failed: {response.status_code}")
            print(f"Response: {response.text}")
            
    except Exception as e:
        print(f"❌ Request error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_frontend_integration()
