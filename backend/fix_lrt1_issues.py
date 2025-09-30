#!/usr/bin/env python
"""
Fix LRT1 issues: grammar, variety, and add new question types
"""
import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'careerquest.settings')
django.setup()

from testsengine.models import Test, Question
from django.db import transaction
from django.db import models

def fix_grammar_issues():
    """Fix grammar issues in existing questions"""
    
    print("🔧 FIXING GRAMMAR ISSUES")
    print("=" * 40)
    
    lrt1 = Test.objects.get(id=13)
    questions = lrt1.questions.all()
    
    grammar_fixes = {
        'an driver': 'a driver',
        'an engineer': 'an engineer',  # This is actually correct
        'an merchant': 'a merchant',
        'an tourist': 'a tourist',
        'an athlete': 'an athlete',  # This is correct
        'an writer': 'a writer',
        'an professional': 'a professional'
    }
    
    fixed_count = 0
    
    with transaction.atomic():
        for q in questions:
            original_text = q.question_text
            updated_text = original_text
            
            for wrong, correct in grammar_fixes.items():
                if wrong in updated_text:
                    updated_text = updated_text.replace(wrong, correct)
                    fixed_count += 1
                    print(f"Fixed Q{q.order}: '{wrong}' -> '{correct}'")
            
            if updated_text != original_text:
                q.question_text = updated_text
                q.save()
    
    print(f"✅ Fixed {fixed_count} grammar issues")
    return fixed_count

def add_new_question_types():
    """Add new logical reasoning question types for variety"""
    
    print("\n🆕 ADDING NEW QUESTION TYPES")
    print("=" * 40)
    
    lrt1 = Test.objects.get(id=13)
    
    # Get the highest order number
    max_order = lrt1.questions.aggregate(max_order=models.Max('order'))['max_order'] or 0
    
    new_questions = [
        # Modus Tollens (Valid)
        {
            'order': max_order + 1,
            'difficulty_level': 'medium',
            'question_text': 'Premise 1: If the market is open, then vendors are present. Premise 2: Vendors are not present. Conclusion: The market is not open. Is the conclusion valid?',
            'correct_answer': 'A',
            'question_type': 'multiple_choice',
            'options': ["Yes, valid", "No, invalid", "Cannot be determined", "Premises contradict"]
        },
        
        # Denying the Antecedent (Invalid)
        {
            'order': max_order + 2,
            'difficulty_level': 'hard',
            'question_text': 'Premise 1: If it is Friday, then the mosque is crowded. Premise 2: It is not Friday. Conclusion: The mosque is not crowded. Is the conclusion valid?',
            'correct_answer': 'B',
            'question_type': 'multiple_choice',
            'options': ["Yes, valid", "No, invalid", "Cannot be determined", "Premises contradict"]
        },
        
        # Disjunctive Syllogism
        {
            'order': max_order + 3,
            'difficulty_level': 'medium',
            'question_text': 'Premise 1: Either the bus arrives on time or passengers complain. Premise 2: The bus did not arrive on time. Conclusion: Passengers complain. Is the conclusion valid?',
            'correct_answer': 'A',
            'question_type': 'multiple_choice',
            'options': ["Yes, valid", "No, invalid", "Cannot be determined", "Premises contradict"]
        },
        
        # Hypothetical Syllogism
        {
            'order': max_order + 4,
            'difficulty_level': 'hard',
            'question_text': 'Premise 1: If the weather is good, then people visit the beach. Premise 2: If people visit the beach, then vendors sell more. Conclusion: If the weather is good, then vendors sell more. Is the conclusion valid?',
            'correct_answer': 'A',
            'question_type': 'multiple_choice',
            'options': ["Yes, valid", "No, invalid", "Cannot be determined", "Premises contradict"]
        },
        
        # Contradictory Premises
        {
            'order': max_order + 5,
            'difficulty_level': 'hard',
            'question_text': 'Premise 1: All students in the class passed the exam. Premise 2: Some students in the class failed the exam. Conclusion: The class has both passing and failing students. Is the conclusion valid?',
            'correct_answer': 'D',
            'question_type': 'multiple_choice',
            'options': ["Yes, valid", "No, invalid", "Cannot be determined", "Premises contradict"]
        }
    ]
    
    added_count = 0
    
    with transaction.atomic():
        for q_data in new_questions:
            # Check if question with this order already exists
            if not lrt1.questions.filter(order=q_data['order']).exists():
                Question.objects.create(
                    test=lrt1,
                    **q_data
                )
                added_count += 1
                print(f"Added Q{q_data['order']} ({q_data['difficulty_level']}): {q_data['question_text'][:60]}...")
    
    print(f"✅ Added {added_count} new questions")
    return added_count

def verify_improvements():
    """Verify that improvements were applied correctly"""
    
    print("\n✅ VERIFYING IMPROVEMENTS")
    print("=" * 40)
    
    lrt1 = Test.objects.get(id=13)
    questions = lrt1.questions.all()
    
    # Check grammar
    grammar_issues = 0
    for q in questions:
        text = q.question_text
        if any(issue in text for issue in ['an driver', 'an merchant', 'an tourist', 'an writer', 'an professional']):
            grammar_issues += 1
    
    print(f"Grammar issues remaining: {grammar_issues}")
    
    # Check question variety
    reasoning_types = {
        'universal_affirmative': 0,
        'universal_negative': 0,
        'conditional': 0,
        'modus_tollens': 0,
        'disjunctive': 0,
        'hypothetical': 0,
        'contradictory': 0
    }
    
    for q in questions:
        text = q.question_text.lower()
        if 'all' in text and 'are' in text:
            reasoning_types['universal_affirmative'] += 1
        elif 'no' in text and 'are' in text:
            reasoning_types['universal_negative'] += 1
        elif 'if' in text and 'then' in text:
            reasoning_types['conditional'] += 1
            if 'not present' in text or 'not open' in text:
                reasoning_types['modus_tollens'] += 1
            elif 'if people visit' in text and 'if the weather' in text:
                reasoning_types['hypothetical'] += 1
        elif 'either' in text and 'or' in text:
            reasoning_types['disjunctive'] += 1
        elif 'contradict' in q.correct_answer or q.correct_answer == 'D':
            reasoning_types['contradictory'] += 1
    
    print("Logical reasoning types now covered:")
    for rtype, count in reasoning_types.items():
        if count > 0:
            print(f"  {rtype}: {count} questions")
    
    # Check difficulty distribution
    easy_count = questions.filter(difficulty_level='easy').count()
    medium_count = questions.filter(difficulty_level='medium').count()
    hard_count = questions.filter(difficulty_level='hard').count()
    
    print(f"\nDifficulty distribution:")
    print(f"  Easy: {easy_count} questions")
    print(f"  Medium: {medium_count} questions")
    print(f"  Hard: {hard_count} questions")
    print(f"  Total: {questions.count()} questions")
    
    return {
        'total_questions': questions.count(),
        'grammar_issues': grammar_issues,
        'reasoning_types': len([v for v in reasoning_types.values() if v > 0])
    }

def main():
    """Main function to fix LRT1 issues"""
    
    print("🔧 LRT1 IMPROVEMENT PROCESS")
    print("=" * 50)
    
    # Step 1: Fix grammar issues
    grammar_fixes = fix_grammar_issues()
    
    # Step 2: Add new question types
    new_questions = add_new_question_types()
    
    # Step 3: Verify improvements
    results = verify_improvements()
    
    print(f"\n📊 IMPROVEMENT SUMMARY:")
    print(f"Grammar fixes applied: {grammar_fixes}")
    print(f"New questions added: {new_questions}")
    print(f"Total questions: {results['total_questions']}")
    print(f"Grammar issues remaining: {results['grammar_issues']}")
    print(f"Reasoning types covered: {results['reasoning_types']}")
    
    if results['grammar_issues'] == 0 and results['reasoning_types'] >= 5:
        print(f"✅ LRT1 improvements completed successfully!")
    else:
        print(f"⚠️ Some issues may remain")

if __name__ == "__main__":
    main()
