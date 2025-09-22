from django.core.management.base import BaseCommand
from testsengine.models import Question
from django.db import connection

class Command(BaseCommand):
    help = 'Update SJT questions with new scoring system (4 options with different scores)'

    def handle(self, *args, **options):
        test_id = 4  # Situational Judgment Test
        
        # Get all SJT questions
        questions = Question.objects.filter(test_id=test_id)
        self.stdout.write(f'Found {questions.count()} SJT questions to update')
        
        # Define realistic workplace scenarios with 4 options each
        sjt_scenarios = {
            11: {
                'scenario': 'Your team is working on a critical project deadline when you notice that Amina, a new team member, has been excluded from important discussions and seems isolated. What do you do?',
                'options': [
                    {'text': 'Speak privately with the team lead about including Amina more actively', 'score': 2, 'letter': 'A'},
                    {'text': 'Wait until after the deadline to address the inclusion issues', 'score': 1, 'letter': 'B'},
                    {'text': 'Make a joke to lighten the mood and help her feel welcome', 'score': 0, 'letter': 'C'},
                    {'text': 'Ignore it since she\'s new and will learn by observation', 'score': -1, 'letter': 'D'}
                ]
            },
            12: {
                'scenario': 'As a project manager, you discover that two key deliverables are behind schedule, and your team is stressed. What is your best approach?',
                'options': [
                    {'text': 'Negotiate a revised timeline with stakeholders while supporting your team', 'score': 2, 'letter': 'A'},
                    {'text': 'Push the team harder to meet the original deadline', 'score': 1, 'letter': 'B'},
                    {'text': 'Tell stakeholders everything is on track to buy more time', 'score': 0, 'letter': 'C'},
                    {'text': 'Reassign work to other departments without consulting anyone', 'score': -1, 'letter': 'D'}
                ]
            },
            13: {
                'scenario': 'During a vendor selection process, you learn that your manager has a personal relationship with one of the vendors. How do you handle this?',
                'options': [
                    {'text': 'Suggest your manager recuse themselves from the decision', 'score': 2, 'letter': 'A'},
                    {'text': 'Report the conflict of interest to HR or senior management', 'score': 1, 'letter': 'B'},
                    {'text': 'Document everything but wait to see what happens', 'score': 0, 'letter': 'C'},
                    {'text': 'Say nothing since the proposal is competitive', 'score': -1, 'letter': 'D'}
                ]
            },
            14: {
                'scenario': 'A colleague consistently takes credit for your ideas in team meetings. How do you respond?',
                'options': [
                    {'text': 'Address it privately with the colleague first, then escalate if needed', 'score': 2, 'letter': 'A'},
                    {'text': 'Start documenting your contributions more clearly in meetings', 'score': 1, 'letter': 'B'},
                    {'text': 'Confront them directly in the next team meeting', 'score': 0, 'letter': 'C'},
                    {'text': 'Ignore it to avoid workplace conflict', 'score': -1, 'letter': 'D'}
                ]
            },
            15: {
                'scenario': 'You notice a team member is struggling with their workload and seems overwhelmed. What do you do?',
                'options': [
                    {'text': 'Offer to help redistribute tasks and provide support', 'score': 2, 'letter': 'A'},
                    {'text': 'Suggest they speak with their manager about workload', 'score': 1, 'letter': 'B'},
                    {'text': 'Wait to see if they ask for help', 'score': 0, 'letter': 'C'},
                    {'text': 'Focus on your own work to avoid getting behind', 'score': -1, 'letter': 'D'}
                ]
            },
            16: {
                'scenario': 'A client is unhappy with a deliverable and demands immediate changes that would require working overtime. How do you respond?',
                'options': [
                    {'text': 'Negotiate a reasonable timeline that balances client needs with team capacity', 'score': 2, 'letter': 'A'},
                    {'text': 'Agree to the changes but discuss overtime compensation with management', 'score': 1, 'letter': 'B'},
                    {'text': 'Accept the changes without discussing with the team', 'score': 0, 'letter': 'C'},
                    {'text': 'Refuse to make changes and risk losing the client', 'score': -1, 'letter': 'D'}
                ]
            },
            17: {
                'scenario': 'You discover a significant error in a report that was already sent to senior management. What do you do?',
                'options': [
                    {'text': 'Immediately notify your manager and provide a corrected version', 'score': 2, 'letter': 'A'},
                    {'text': 'Correct the error and resend with an explanation', 'score': 1, 'letter': 'B'},
                    {'text': 'Wait to see if anyone notices the error', 'score': 0, 'letter': 'C'},
                    {'text': 'Hope the error goes unnoticed', 'score': -1, 'letter': 'D'}
                ]
            },
            18: {
                'scenario': 'A team member consistently arrives late to meetings and seems disengaged. How do you handle this?',
                'options': [
                    {'text': 'Have a private conversation to understand any underlying issues', 'score': 2, 'letter': 'A'},
                    {'text': 'Address the punctuality issue in a team meeting', 'score': 1, 'letter': 'B'},
                    {'text': 'Ignore it and hope it improves on its own', 'score': 0, 'letter': 'C'},
                    {'text': 'Complain about them to other team members', 'score': -1, 'letter': 'D'}
                ]
            },
            19: {
                'scenario': 'You\'re asked to work on a project that conflicts with your current priorities. How do you respond?',
                'options': [
                    {'text': 'Discuss priorities with your manager to find the best solution', 'score': 2, 'letter': 'A'},
                    {'text': 'Accept the project but ask for deadline adjustments', 'score': 1, 'letter': 'B'},
                    {'text': 'Accept both projects and work extra hours', 'score': 0, 'letter': 'C'},
                    {'text': 'Refuse the new project without discussion', 'score': -1, 'letter': 'D'}
                ]
            },
            20: {
                'scenario': 'A colleague asks you to cover for them while they take an extended break during work hours. What do you do?',
                'options': [
                    {'text': 'Suggest they discuss this with their manager first', 'score': 2, 'letter': 'A'},
                    {'text': 'Agree to help but set clear boundaries about duration', 'score': 1, 'letter': 'B'},
                    {'text': 'Agree without asking questions', 'score': 0, 'letter': 'C'},
                    {'text': 'Refuse and report them to management', 'score': -1, 'letter': 'D'}
                ]
            }
        }
        
        updated_count = 0
        
        with connection.cursor() as cursor:
            for question in questions:
                if question.id in sjt_scenarios:
                    scenario_data = sjt_scenarios[question.id]
                    
                    # Update the question text
                    question.question_text = scenario_data['scenario']
                    
                    # Update options as JSON array
                    options_array = [opt['text'] for opt in scenario_data['options']]
                    question.options = options_array
                    
                    # Set correct answer to the highest scoring option
                    best_option = max(scenario_data['options'], key=lambda x: x['score'])
                    question.correct_answer = best_option['letter']
                    
                    question.save()
                    
                    # Insert options into question_options table
                    for option in scenario_data['options']:
                        cursor.execute("""
                            INSERT INTO testsengine_questionoption 
                            (question_id, option_text, score_value, option_letter)
                            VALUES (%s, %s, %s, %s)
                            ON CONFLICT (question_id, option_letter) 
                            DO UPDATE SET 
                                option_text = EXCLUDED.option_text,
                                score_value = EXCLUDED.score_value
                        """, [
                            question.id,
                            option['text'],
                            option['score'],
                            option['letter']
                        ])
                    
                    updated_count += 1
                    self.stdout.write(f'Updated question {question.id}: {scenario_data["scenario"][:50]}...')
                else:
                    # For questions not in our predefined list, create generic options
                    generic_options = [
                        {'text': 'Take immediate action to address the situation professionally', 'score': 2, 'letter': 'A'},
                        {'text': 'Discuss the situation with relevant stakeholders', 'score': 1, 'letter': 'B'},
                        {'text': 'Wait and observe how the situation develops', 'score': 0, 'letter': 'C'},
                        {'text': 'Ignore the situation and focus on other priorities', 'score': -1, 'letter': 'D'}
                    ]
                    
                    # Update question with generic options
                    question.options = [opt['text'] for opt in generic_options]
                    question.correct_answer = 'A'
                    question.save()
                    
                    # Insert generic options
                    for option in generic_options:
                        cursor.execute("""
                            INSERT INTO testsengine_questionoption 
                            (question_id, option_text, score_value, option_letter)
                            VALUES (%s, %s, %s, %s)
                            ON CONFLICT (question_id, option_letter) 
                            DO UPDATE SET 
                                option_text = EXCLUDED.option_text,
                                score_value = EXCLUDED.score_value
                        """, [
                            question.id,
                            option['text'],
                            option['score'],
                            option['letter']
                        ])
                    
                    updated_count += 1
                    self.stdout.write(f'Updated question {question.id} with generic options')
        
        self.stdout.write(self.style.SUCCESS(f'Successfully updated {updated_count} SJT questions with new scoring system!'))
        
        # Verify the updates
        self.stdout.write('\n=== Verification ===')
        for question in questions[:3]:
            self.stdout.write(f'Q{question.id}: {question.question_text[:60]}...')
            self.stdout.write(f'Options: {len(question.options)} options')
            self.stdout.write(f'Correct: {question.correct_answer}')
            
            # Show options with scores
            cursor.execute("""
                SELECT option_letter, option_text, score_value 
                FROM testsengine_questionoption 
                WHERE question_id = %s 
                ORDER BY option_letter
            """, [question.id])
            
            options = cursor.fetchall()
            for opt_letter, opt_text, score in options:
                self.stdout.write(f'  {opt_letter}: {opt_text[:40]}... (Score: {score})')
            self.stdout.write('---')
