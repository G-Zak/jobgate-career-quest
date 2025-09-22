#!/usr/bin/env python
"""
Test script to verify API endpoints are working
"""
import requests
import json

def test_api_endpoints():
    base_url = "http://localhost:8000"
    
    print("Testing API Endpoints")
    print("=" * 50)
    
    # Test endpoints
    endpoints = [
        "/api/recommendations/",
        "/api/recommendations/skills/analysis/",
        "/api/recommendations/jobs/search/",
        "/api/recommendations/preferences/"
    ]
    
    for endpoint in endpoints:
        url = f"{base_url}{endpoint}"
        print(f"\nTesting: {url}")
        
        try:
            response = requests.get(url, timeout=10)
            print(f"  Status: {response.status_code}")
            
            if response.status_code == 200:
                try:
                    data = response.json()
                    print(f"  ✓ Success - Response keys: {list(data.keys()) if isinstance(data, dict) else 'Array'}")
                except:
                    print(f"  ✓ Success - Response length: {len(response.text)} chars")
            elif response.status_code == 404:
                print(f"  ✗ 404 Not Found")
            elif response.status_code == 401:
                print(f"  ✗ 401 Unauthorized")
            else:
                print(f"  ? Status {response.status_code}")
                
        except requests.exceptions.ConnectionError:
            print(f"  ✗ Connection Error - Is the backend running?")
        except requests.exceptions.Timeout:
            print(f"  ✗ Timeout")
        except Exception as e:
            print(f"  ✗ Error: {e}")
    
    print("\n" + "=" * 50)
    print("Test complete!")

if __name__ == "__main__":
    test_api_endpoints()
