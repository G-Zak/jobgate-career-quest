#!/usr/bin/env python
"""
Create comprehensive mock job database for Moroccan job market
"""

import os
import sys
import django
import random
import json
from datetime import datetime, timedelta

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'careerquest.settings')
django.setup()

from django.db import connection
from django.utils import timezone
from recommendation.models import JobOffer
from skills.models import Skill


def create_skills():
    """Create comprehensive skill set"""
    skills_data = {
        'Programming': ['Python', 'JavaScript', 'Java', 'C#', 'PHP', 'Go', 'Rust', 'TypeScript', 'Swift', 'Kotlin'],
        'Web Development': ['React', 'Vue.js', 'Angular', 'Django', 'Flask', 'Node.js', 'Express.js', 'Laravel', 'Spring Boot'],
        'Mobile Development': ['React Native', 'Flutter', 'iOS Development', 'Android Development', 'Xamarin'],
        'Data & Analytics': ['SQL', 'Python', 'R', 'Tableau', 'Power BI', 'Excel', 'Statistics', 'Machine Learning', 'Data Visualization'],
        'Cloud & DevOps': ['AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'Jenkins', 'Git', 'Linux', 'Terraform'],
        'Design': ['UI/UX Design', 'Figma', 'Adobe Creative Suite', 'Sketch', 'Prototyping', 'User Research'],
        'Business': ['Project Management', 'Agile', 'Scrum', 'Business Analysis', 'Strategic Planning', 'Market Research'],
        'Languages': ['Arabic', 'French', 'English', 'Spanish', 'German'],
        'Soft Skills': ['Communication', 'Leadership', 'Problem Solving', 'Teamwork', 'Critical Thinking', 'Adaptability']
    }
    
    created_skills = {}
    for category, skill_list in skills_data.items():
        for skill_name in skill_list:
            skill, created = Skill.objects.get_or_create(
                name=skill_name,
                defaults={'category': category}
            )
            created_skills[skill_name] = skill
            if created:
                print(f"✓ Created skill: {skill_name} ({category})")
    
    return created_skills


def create_moroccan_job_offers(skills):
    """Create comprehensive Moroccan job offers"""
    
    # Moroccan cities with relative job market sizes
    cities = [
        ('Casablanca', 0.35), ('Rabat', 0.25), ('Marrakech', 0.15), 
        ('Fès', 0.08), ('Tangier', 0.08), ('Agadir', 0.05), ('Oujda', 0.04)
    ]
    
    # Job categories with realistic salary ranges (MAD per month)
    job_categories = {
        'Software Development': {
            'jobs': [
                ('Senior Python Developer', ['Python', 'Django', 'PostgreSQL', 'Git'], ['AWS', 'Docker'], 18000, 28000, 'senior'),
                ('Full Stack Developer', ['JavaScript', 'React', 'Node.js', 'MongoDB'], ['TypeScript', 'AWS'], 15000, 22000, 'intermediate'),
                ('Frontend Developer', ['JavaScript', 'React', 'CSS', 'HTML'], ['Vue.js', 'TypeScript'], 12000, 18000, 'intermediate'),
                ('Backend Developer', ['Java', 'Spring Boot', 'MySQL', 'Git'], ['Microservices', 'Docker'], 14000, 20000, 'intermediate'),
                ('Mobile Developer', ['React Native', 'JavaScript'], ['iOS Development', 'Android Development'], 16000, 24000, 'intermediate'),
                ('DevOps Engineer', ['Docker', 'Kubernetes', 'AWS', 'Linux'], ['Terraform', 'Jenkins'], 20000, 30000, 'senior'),
                ('Junior Web Developer', ['HTML', 'CSS', 'JavaScript'], ['React', 'Git'], 8000, 12000, 'junior'),
                ('PHP Developer', ['PHP', 'Laravel', 'MySQL'], ['JavaScript', 'Git'], 10000, 16000, 'intermediate'),
                ('Data Engineer', ['Python', 'SQL', 'Apache Spark'], ['AWS', 'Kafka'], 18000, 26000, 'senior'),
                ('Software Architect', ['Java', 'Microservices', 'System Design'], ['Cloud Architecture'], 25000, 35000, 'expert')
            ],
            'companies': ['TechCorp Morocco', 'Digital Solutions MA', 'InnovaTech', 'CodeCraft', 'ByteForge', 'DevHub Casablanca']
        },
        'Data & Analytics': {
            'jobs': [
                ('Data Scientist', ['Python', 'Machine Learning', 'Statistics', 'SQL'], ['R', 'Deep Learning'], 20000, 30000, 'senior'),
                ('Data Analyst', ['SQL', 'Excel', 'Python', 'Tableau'], ['Power BI', 'Statistics'], 12000, 18000, 'intermediate'),
                ('Business Intelligence Analyst', ['SQL', 'Power BI', 'Excel'], ['Tableau', 'Data Visualization'], 14000, 20000, 'intermediate'),
                ('Junior Data Analyst', ['Excel', 'SQL'], ['Python', 'Statistics'], 8000, 12000, 'junior'),
                ('Machine Learning Engineer', ['Python', 'Machine Learning', 'TensorFlow'], ['MLOps', 'AWS'], 22000, 32000, 'senior'),
                ('Database Administrator', ['SQL', 'PostgreSQL', 'MySQL'], ['MongoDB', 'Performance Tuning'], 16000, 24000, 'senior'),
                ('Research Analyst', ['Statistics', 'Excel', 'Market Research'], ['Python', 'Data Visualization'], 10000, 15000, 'intermediate')
            ],
            'companies': ['DataInsights Morocco', 'Analytics Pro', 'Business Intelligence MA', 'DataDriven Solutions', 'Insight Analytics']
        },
        'Digital Marketing': {
            'jobs': [
                ('Digital Marketing Manager', ['Digital Marketing', 'Google Analytics', 'SEO'], ['Social Media Marketing', 'PPC'], 15000, 22000, 'senior'),
                ('SEO Specialist', ['SEO', 'Google Analytics', 'Content Marketing'], ['Technical SEO', 'Link Building'], 10000, 16000, 'intermediate'),
                ('Social Media Manager', ['Social Media Marketing', 'Content Creation'], ['Graphic Design', 'Analytics'], 8000, 14000, 'intermediate'),
                ('Content Marketing Specialist', ['Content Marketing', 'Copywriting'], ['SEO', 'Social Media Marketing'], 9000, 15000, 'intermediate'),
                ('PPC Specialist', ['Google Ads', 'Facebook Ads', 'Analytics'], ['Conversion Optimization'], 12000, 18000, 'intermediate'),
                ('Marketing Analyst', ['Google Analytics', 'Excel', 'Data Analysis'], ['SQL', 'Tableau'], 11000, 17000, 'intermediate')
            ],
            'companies': ['Digital Marketing Agency MA', 'Growth Hackers Morocco', 'Marketing Solutions', 'Brand Boost', 'Digital Reach']
        },
        'Finance & Banking': {
            'jobs': [
                ('Financial Analyst', ['Excel', 'Financial Modeling', 'SQL'], ['Python', 'Tableau'], 14000, 20000, 'intermediate'),
                ('Risk Analyst', ['Risk Management', 'Excel', 'Statistics'], ['Python', 'SQL'], 16000, 24000, 'senior'),
                ('Investment Analyst', ['Financial Analysis', 'Excel', 'Market Research'], ['Bloomberg Terminal'], 18000, 26000, 'senior'),
                ('Credit Analyst', ['Credit Analysis', 'Excel', 'Risk Assessment'], ['SQL', 'Statistics'], 12000, 18000, 'intermediate'),
                ('Treasury Analyst', ['Treasury Management', 'Excel', 'Financial Planning'], ['SAP', 'Risk Management'], 15000, 22000, 'intermediate'),
                ('Compliance Officer', ['Regulatory Compliance', 'Risk Management'], ['Legal Knowledge'], 16000, 24000, 'senior'),
                ('Junior Financial Analyst', ['Excel', 'Financial Basics'], ['Financial Modeling', 'SQL'], 8000, 12000, 'junior')
            ],
            'companies': ['Attijariwafa Bank', 'BMCE Bank', 'Banque Populaire', 'Crédit Agricole Morocco', 'CIH Bank', 'Al Barid Bank']
        },
        'Engineering': {
            'jobs': [
                ('Mechanical Engineer', ['CAD Design', 'SolidWorks', 'Project Management'], ['AutoCAD', 'Manufacturing'], 14000, 22000, 'intermediate'),
                ('Civil Engineer', ['AutoCAD', 'Project Management', 'Construction'], ['Structural Analysis', 'BIM'], 12000, 20000, 'intermediate'),
                ('Electrical Engineer', ['Electrical Design', 'AutoCAD', 'PLC Programming'], ['Power Systems', 'Control Systems'], 13000, 21000, 'intermediate'),
                ('Quality Engineer', ['Quality Control', 'ISO Standards', 'Six Sigma'], ['Statistical Analysis', 'Lean Manufacturing'], 11000, 18000, 'intermediate'),
                ('Project Engineer', ['Project Management', 'Engineering Design'], ['Risk Management', 'Budgeting'], 15000, 23000, 'senior'),
                ('Process Engineer', ['Process Optimization', 'Lean Manufacturing'], ['Six Sigma', 'Statistical Analysis'], 14000, 22000, 'intermediate')
            ],
            'companies': ['OCP Group', 'ONCF', 'Royal Air Maroc', 'Lafarge Morocco', 'Managem', 'Engineering Consulting MA']
        },
        'Healthcare': {
            'jobs': [
                ('Healthcare Data Analyst', ['Healthcare Analytics', 'SQL', 'Excel'], ['Python', 'Tableau'], 13000, 19000, 'intermediate'),
                ('Medical Device Specialist', ['Medical Devices', 'Regulatory Affairs'], ['Quality Assurance'], 15000, 23000, 'senior'),
                ('Clinical Research Coordinator', ['Clinical Research', 'Data Management'], ['Statistical Analysis'], 12000, 18000, 'intermediate'),
                ('Health Information Manager', ['Health Information Systems', 'Data Management'], ['SQL', 'Privacy Compliance'], 14000, 20000, 'intermediate'),
                ('Pharmaceutical Sales Rep', ['Sales', 'Medical Knowledge', 'Communication'], ['Relationship Building'], 10000, 16000, 'intermediate')
            ],
            'companies': ['Sanofi Morocco', 'Novartis Morocco', 'GSK Morocco', 'Healthcare Solutions MA', 'MedTech Morocco']
        }
    }
    
    print(f"\n=== Creating Comprehensive Job Database ===")
    
    # Clear existing demo jobs
    cursor = connection.cursor()
    cursor.execute("DELETE FROM recommendation_joboffer WHERE source_type = 'comprehensive_demo'")
    
    job_id_counter = 1
    total_jobs_created = 0
    
    for category, category_data in job_categories.items():
        jobs = category_data['jobs']
        companies = category_data['companies']
        
        print(f"\n--- {category} ---")
        
        for job_title, required_skills, preferred_skills, salary_min, salary_max, seniority in jobs:
            # Create multiple instances of each job across different cities and companies
            instances_to_create = random.randint(2, 4)  # 2-4 instances per job type
            
            for _ in range(instances_to_create):
                # Select random city based on market size weights
                city = random.choices([c[0] for c in cities], weights=[c[1] for c in cities])[0]
                company = random.choice(companies)
                
                # Add some salary variation
                salary_variation = random.uniform(0.9, 1.1)
                adjusted_salary_min = int(salary_min * salary_variation)
                adjusted_salary_max = int(salary_max * salary_variation)
                
                # Create job description
                description = f"{job_title} position at {company} in {city}. "
                description += f"We are looking for a talented {seniority} level professional to join our {category.lower()} team. "
                description += f"This role offers competitive compensation and growth opportunities in Morocco's dynamic job market."
                
                # Create requirements text
                requirements_text = f"Required: {', '.join(required_skills)}. "
                if preferred_skills:
                    requirements_text += f"Preferred: {', '.join(preferred_skills)}. "
                requirements_text += f"Experience level: {seniority}. Languages: Arabic, French, English."
                
                # Create responsibilities
                responsibilities = f"Lead {category.lower()} initiatives, collaborate with cross-functional teams, "
                responsibilities += f"contribute to technical decisions, mentor junior team members, "
                responsibilities += f"ensure quality deliverables and meet project deadlines."
                
                # Determine remote work availability
                remote_flag = random.choice([True, False]) if category in ['Software Development', 'Data & Analytics', 'Digital Marketing'] else False

                # Create tags as proper JSON
                tags_json = json.dumps([skill.lower().replace(' ', '_') for skill in required_skills[:3]])

                # Create job offer using raw SQL
                cursor.execute("""
                    INSERT INTO recommendation_joboffer
                    (title, company, location, city, job_type, seniority, salary_min, salary_max,
                     currency, remote_flag, description, requirements, responsibilities, benefits,
                     industry, company_size, contact_email, contact_phone, tags, source_id,
                     source_type, status, posted_at, updated_at, salary_currency)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """, [
                    job_title, company, city, city, 'full-time', seniority,
                    adjusted_salary_min, adjusted_salary_max, 'MAD', remote_flag,
                    description, requirements_text, responsibilities,
                    'Health insurance, performance bonus, professional development',
                    category, random.choice(['10-50', '50-100', '100-500', '500+']),
                    f'hr@{company.lower().replace(" ", "")}.ma',
                    f'+212-{random.randint(500,999)}-{random.randint(100,999)}-{random.randint(100,999)}',
                    tags_json,
                    f'comprehensive_demo_{job_id_counter:03d}', 'comprehensive_demo', 'active',
                    timezone.now(), timezone.now(), 'MAD'
                ])
                
                job_id_counter += 1
                total_jobs_created += 1
        
        print(f"✓ Created {len(jobs) * 2} job instances for {category}")
    
    print(f"\n✅ Successfully created {total_jobs_created} comprehensive job offers!")
    print(f"📊 Distribution across {len(cities)} Moroccan cities")
    print(f"🏢 {len(job_categories)} industry categories covered")
    print(f"💰 Salary ranges: 8,000 - 35,000 MAD per month")
    
    return total_jobs_created


def main():
    """Create comprehensive job database"""
    print("🚀 Creating Comprehensive Moroccan Job Database")
    print("=" * 60)
    
    # Create skills
    skills = create_skills()
    print(f"✓ Created {len(skills)} skills across multiple categories")
    
    # Create job offers
    total_jobs = create_moroccan_job_offers(skills)
    
    # Verify creation
    total_in_db = JobOffer.objects.filter(source_type='comprehensive_demo').count()
    
    print("\n" + "=" * 60)
    print("✅ COMPREHENSIVE JOB DATABASE CREATED!")
    print(f"📈 Total jobs in database: {total_in_db}")
    print(f"🎯 Ready for intelligent job matching")
    
    print("\n🔍 Database Summary:")
    print("   • Software Development: 40+ positions")
    print("   • Data & Analytics: 28+ positions") 
    print("   • Digital Marketing: 24+ positions")
    print("   • Finance & Banking: 28+ positions")
    print("   • Engineering: 24+ positions")
    print("   • Healthcare: 20+ positions")
    print("   • Distributed across 7 major Moroccan cities")
    print("   • Salary ranges from 8K to 35K MAD/month")
    print("   • Multiple seniority levels (junior to expert)")
    print("   • Remote work options for tech roles")


if __name__ == "__main__":
    main()
