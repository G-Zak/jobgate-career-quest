"""
Demonstration script for Skills Tests System
Shows how to use the numerical and abstract reasoning tests
"""

import sys
import os
import json
from datetime import datetime

# Add the parent directory to sys.path to import skills_tests
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from skills_tests import (
    SkillsTestEngine, 
    create_numerical_test, 
    create_abstract_test, 
    calculate_test_score
)
from skills_tests.test_utils import TestSession, TestAnalytics, export_test_results

def demo_numerical_test():
    """Demonstrate numerical reasoning test"""
    print("=" * 60)
    print("NUMERICAL REASONING TEST DEMONSTRATION")
    print("=" * 60)
    
    # Create a numerical test
    questions, test_info = create_numerical_test(num_questions=5)
    
    print(f"Test Configuration:")
    print(f"- Total Questions: {len(questions)}")
    print(f"- Time Limit: {test_info.get('test_info', {}).get('time_limit_minutes', 20)} minutes")
    print("\nQuestion Breakdown by Category:")
    
    # Show category breakdown
    categories = {}
    for q in questions:
        cat = q.category
        categories[cat] = categories.get(cat, 0) + 1
    
    for category, count in categories.items():
        print(f"- {category.replace('_', ' ').title()}: {count} questions")
    
    print("\nSample Questions:")
    print("-" * 40)
    
    # Show first few questions
    for i, question in enumerate(questions[:2]):
        print(f"\nQuestion {i+1} (ID: {question.question_id})")
        print(f"Difficulty: {question.difficulty.title()}")
        print(f"Category: {question.category.replace('_', ' ').title()}")
        print(f"Content: {question.question_content.get('text', 'N/A')}")
        print("Options:")
        for option in question.options:
            print(f"  {option['option_id']}) {option['content']}")
        print(f"Correct Answer: {question.correct_answer}")
        print(f"Points: {question.points}")
    
    # Simulate test responses
    print("\n" + "=" * 40)
    print("SIMULATING TEST RESPONSES")
    print("=" * 40)
    
    simulated_responses = []
    for i, question in enumerate(questions):
        # Simulate some correct and incorrect answers
        if i % 2 == 0:  # Even indices get correct answers
            answer = question.correct_answer
        else:  # Odd indices get random wrong answers
            wrong_answers = ['A', 'B', 'C', 'D', 'E']
            wrong_answers.remove(question.correct_answer)
            answer = wrong_answers[0]
        
        simulated_responses.append({
            'question_id': question.question_id,
            'answer': answer,
            'time_taken': 45 + (i * 10)  # Varying time
        })
    
    total_time = sum(r['time_taken'] for r in simulated_responses)
    
    print(f"Simulated total time: {total_time} seconds ({total_time/60:.1f} minutes)")
    
    # Calculate score
    result = calculate_test_score('numerical_reasoning', simulated_responses, questions, total_time)
    
    print(f"\nTEST RESULTS:")
    print(f"- Raw Score: {result.raw_score}/{result.total_questions}")
    print(f"- Percentage: {result.percentage}%")
    print(f"- Time Bonus: {result.time_bonus} points")
    print(f"- Final Score: {result.final_score} points")
    print(f"- Estimated Percentile: {result.percentile}")
    
    # Generate analytics
    category_analysis = TestAnalytics.analyze_performance_by_category(result, questions)
    difficulty_analysis = TestAnalytics.analyze_difficulty_performance(result, questions)
    recommendations = TestAnalytics.generate_recommendations(result, questions)
    
    print(f"\nPERFORMANCE BY CATEGORY:")
    for category, stats in category_analysis.items():
        print(f"- {category.replace('_', ' ').title()}: {stats['correct']}/{stats['total']} ({stats['percentage']:.1f}%)")
    
    print(f"\nPERFORMANCE BY DIFFICULTY:")
    for difficulty, stats in difficulty_analysis.items():
        print(f"- {difficulty.title()}: {stats['correct']}/{stats['total']} ({stats['percentage']:.1f}%)")
    
    print(f"\nRECOMMENDATIONS:")
    for i, rec in enumerate(recommendations, 1):
        print(f"{i}. {rec}")
    
    return result, questions

def demo_abstract_test():
    """Demonstrate abstract reasoning test"""
    print("\n" + "=" * 60)
    print("ABSTRACT REASONING TEST DEMONSTRATION")
    print("=" * 60)
    
    # Create an abstract test
    questions, test_info = create_abstract_test(num_questions=4)
    
    print(f"Test Configuration:")
    print(f"- Total Questions: {len(questions)}")
    print(f"- Time Limit: {test_info.get('test_info', {}).get('time_limit_minutes', 15)} minutes")
    print("\nQuestion Breakdown by Category:")
    
    # Show category breakdown
    categories = {}
    for q in questions:
        cat = q.category
        categories[cat] = categories.get(cat, 0) + 1
    
    for category, count in categories.items():
        print(f"- {category.replace('_', ' ').title()}: {count} questions")
    
    print("\nSample Questions:")
    print("-" * 40)
    
    # Show first few questions
    for i, question in enumerate(questions[:2]):
        print(f"\nQuestion {i+1} (ID: {question.question_id})")
        print(f"Difficulty: {question.difficulty.title()}")
        print(f"Category: {question.category.replace('_', ' ').title()}")
        print(f"Pattern Type: {question.question_content.get('pattern_type', 'N/A')}")
        print(f"Description: {question.question_content.get('description', 'N/A')}")
        print("Options:")
        for option in question.options:
            content = option['content']
            if isinstance(content, dict):
                print(f"  {option['option_id']}) [Visual Pattern - SVG]")
            else:
                print(f"  {option['option_id']}) {content}")
        print(f"Correct Answer: {question.correct_answer}")
        print(f"Points: {question.points}")
    
    # Simulate test responses
    print("\n" + "=" * 40)
    print("SIMULATING TEST RESPONSES")
    print("=" * 40)
    
    simulated_responses = []
    for i, question in enumerate(questions):
        # Simulate some correct and incorrect answers
        if i % 2 == 0:  # Even indices get correct answers
            answer = question.correct_answer
        else:  # Odd indices get random wrong answers
            wrong_answers = ['A', 'B', 'C', 'D']
            if question.correct_answer in wrong_answers:
                wrong_answers.remove(question.correct_answer)
            answer = wrong_answers[0]
        
        simulated_responses.append({
            'question_id': question.question_id,
            'answer': answer,
            'time_taken': 35 + (i * 10)  # Varying time
        })
    
    total_time = sum(r['time_taken'] for r in simulated_responses)
    
    print(f"Simulated total time: {total_time} seconds ({total_time/60:.1f} minutes)")
    
    # Calculate score
    result = calculate_test_score('abstract_reasoning', simulated_responses, questions, total_time)
    
    print(f"\nTEST RESULTS:")
    print(f"- Raw Score: {result.raw_score}/{result.total_questions}")
    print(f"- Percentage: {result.percentage}%")
    print(f"- Final Score: {result.final_score} points")
    print(f"- Estimated Percentile: {result.percentile}")
    
    return result, questions

def demo_test_session():
    """Demonstrate using TestSession for interactive testing"""
    print("\n" + "=" * 60)
    print("TEST SESSION DEMONSTRATION")
    print("=" * 60)
    
    # Create a test session
    session = TestSession('numerical_reasoning', user_id='demo_user')
    
    # Start the test
    start_info = session.start_test(num_questions=3)
    print(f"Session ID: {start_info['session_id']}")
    print(f"Total Questions: {start_info['total_questions']}")
    
    # Simulate answering questions
    answers = ['B', 'A', 'C']  # Simulated answers
    times = [45, 60, 55]       # Simulated times
    
    for i, (answer, time_taken) in enumerate(zip(answers, times)):
        print(f"\nSubmitting answer for question {i+1}: {answer}")
        result = session.submit_answer(answer, time_taken)
        
        print(f"- Correct: {result['is_correct']}")
        print(f"- Progress: {result['question_number']}/{result['total_questions']}")
        
        if result['test_completed']:
            print("\nTest Completed!")
            final_result = result['final_results']
            print(f"Final Score: {final_result.percentage}%")
            break
    
    # Get session summary
    summary = session.get_session_summary()
    print(f"\nSession Summary:")
    print(json.dumps(summary, indent=2, default=str))

def main():
    """Run all demonstrations"""
    print("JOBGATE CAREER QUEST - SKILLS TESTS DEMONSTRATION")
    print("=" * 60)
    print("This script demonstrates the numerical and abstract reasoning test system")
    print("Built for candidate skills assessment")
    print("=" * 60)
    
    try:
        # Demo numerical test
        num_result, num_questions = demo_numerical_test()
        
        # Demo abstract test
        abs_result, abs_questions = demo_abstract_test()
        
        # Demo test session
        demo_test_session()
        
        # Export results
        print("\n" + "=" * 60)
        print("EXPORTING RESULTS")
        print("=" * 60)
        
        session_info = {
            'session_id': 'demo_session_001',
            'user_id': 'demo_user',
            'test_type': 'numerical_reasoning'
        }
        
        export_path = export_test_results(num_result, num_questions, session_info)
        print(f"Results exported to: {export_path}")
        
        print("\n" + "=" * 60)
        print("DEMONSTRATION COMPLETED SUCCESSFULLY!")
        print("=" * 60)
        print("The skills test system is ready for integration with the frontend.")
        print("Key features implemented:")
        print("- Question loading and validation")
        print("- Scoring with time bonuses")
        print("- Performance analytics")
        print("- Session management")
        print("- Result export functionality")
        
    except Exception as e:
        print(f"\nError during demonstration: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()
