from django.core.management.base import BaseCommand
from django.db import connection, transaction
from testsengine.models import Question
from testsengine.question_option_model import QuestionOption

class Command(BaseCommand):
    help = 'Create unique SJT questions with scenario-specific options, removing all generic ones'

    def handle(self, *args, **options):
        test_id = 4  # Situational Judgment Test ID
        
        # First, delete all existing SJT questions and their options
        self.stdout.write('Clearing existing SJT questions...')
        QuestionOption.objects.filter(question__test_id=test_id).delete()
        Question.objects.filter(test_id=test_id).delete()
        
        # Create new unique questions with scenario-specific options
        unique_questions = self.get_unique_questions()
        
        self.stdout.write(f'Creating {len(unique_questions)} unique SJT questions...')
        
        created_count = 0
        with transaction.atomic():
            for question_data in unique_questions:
                # Create the question
                question = Question.objects.create(
                    test_id=test_id,
                    question_type='situational_judgment',
                    question_text=question_data['question_text'],
                    correct_answer='A',  # Best option
                    difficulty_level=question_data.get('difficulty', 'medium'),
                    order=created_count + 1,
                    options=[]  # Empty options array since we're using QuestionOption model
                )
                
                # Create the options
                for option_data in question_data['options']:
                    QuestionOption.objects.create(
                        question=question,
                        option_letter=option_data['letter'],
                        option_text=option_data['text'],
                        score_value=option_data['score']
                    )
                
                created_count += 1
                if created_count % 20 == 0:
                    self.stdout.write(f'Created {created_count} questions...')
        
        self.stdout.write(self.style.SUCCESS(f'Successfully created {created_count} unique SJT questions!'))
        
        # Verification
        self.stdout.write('\n=== Verification ===')
        sample_questions = Question.objects.filter(test_id=test_id).order_by('id')[:5]
        for q in sample_questions:
            options = QuestionOption.objects.filter(question=q).order_by('option_letter')
            self.stdout.write(f'Q{q.id}: {q.question_text[:50]}...')
            for opt in options:
                self.stdout.write(f'  {opt.option_letter}: {opt.option_text[:40]}... (Score: {opt.score_value})')

    def get_unique_questions(self):
        """Return a list of unique SJT questions with scenario-specific options"""
        return [
            {
                'question_text': 'Your team is working on a critical project deadline when you notice that Amina, a new team member, is being excluded from important discussions. The team lead seems to be overlooking her contributions.',
                'difficulty': 'medium',
                'options': [
                    {'letter': 'A', 'text': 'Speak privately with the team lead about including Amina more actively in discussions', 'score': 2},
                    {'letter': 'B', 'text': 'Wait until after the deadline to address the inclusion issues', 'score': 1},
                    {'letter': 'C', 'text': 'Make a joke to lighten the mood and help Amina feel welcome', 'score': 0},
                    {'letter': 'D', 'text': 'Ignore it since Amina is new and will learn by observation', 'score': -1}
                ]
            },
            {
                'question_text': 'As a project manager, you discover that two key deliverables are behind schedule due to resource constraints. Your team is stressed, and stakeholders are asking for updates.',
                'difficulty': 'hard',
                'options': [
                    {'letter': 'A', 'text': 'Negotiate a revised timeline with stakeholders while supporting your team', 'score': 2},
                    {'letter': 'B', 'text': 'Push the team harder to meet the original deadline', 'score': 1},
                    {'letter': 'C', 'text': 'Tell stakeholders everything is on track to buy more time', 'score': 0},
                    {'letter': 'D', 'text': 'Reassign work to other departments without consulting anyone', 'score': -1}
                ]
            },
            {
                'question_text': 'During a vendor selection process, you learn that your manager has a personal relationship with one of the vendors. The vendor\'s proposal is competitive but not the best.',
                'difficulty': 'hard',
                'options': [
                    {'letter': 'A', 'text': 'Suggest your manager recuse themselves from the decision process', 'score': 2},
                    {'letter': 'B', 'text': 'Report the conflict of interest to HR or senior management', 'score': 1},
                    {'letter': 'C', 'text': 'Document everything but wait to see what happens', 'score': 0},
                    {'letter': 'D', 'text': 'Say nothing since the proposal is competitive', 'score': -1}
                ]
            },
            {
                'question_text': 'A colleague consistently takes credit for your ideas in team meetings. This has happened three times in the past month, and it\'s affecting your reputation.',
                'difficulty': 'medium',
                'options': [
                    {'letter': 'A', 'text': 'Address the issue privately with the colleague and establish clear boundaries', 'score': 2},
                    {'letter': 'B', 'text': 'Speak to your supervisor about the pattern of behavior', 'score': 1},
                    {'letter': 'C', 'text': 'Wait to see if the colleague changes their behavior', 'score': 0},
                    {'letter': 'D', 'text': 'Ignore it to avoid creating workplace tension', 'score': -1}
                ]
            },
            {
                'question_text': 'You notice a team member is struggling with their workload and seems overwhelmed. They haven\'t asked for help, but their performance is declining.',
                'difficulty': 'medium',
                'options': [
                    {'letter': 'A', 'text': 'Offer confidential support and resources while respecting their privacy', 'score': 2},
                    {'letter': 'B', 'text': 'Discuss the situation with HR to explore available support options', 'score': 1},
                    {'letter': 'C', 'text': 'Wait for them to approach you for help', 'score': 0},
                    {'letter': 'D', 'text': 'Ignore personal issues and focus only on work performance', 'score': -1}
                ]
            },
            {
                'question_text': 'Two departments are blaming each other for a project delay. As the mediator, you need to resolve this quickly to prevent further delays and maintain team morale.',
                'difficulty': 'hard',
                'options': [
                    {'letter': 'A', 'text': 'Facilitate a collaborative discussion to identify root causes and solutions', 'score': 2},
                    {'letter': 'B', 'text': 'Gather information from both departments before making a decision', 'score': 1},
                    {'letter': 'C', 'text': 'Wait to see if the departments resolve their differences', 'score': 0},
                    {'letter': 'D', 'text': 'Choose one department\'s side based on your personal preference', 'score': -1}
                ]
            },
            {
                'question_text': 'During a team building activity, you notice that Sofia, who uses a wheelchair, cannot participate in the planned outdoor activities. The organizer seems unaware of this issue.',
                'difficulty': 'medium',
                'options': [
                    {'letter': 'A', 'text': 'Advocate for inclusive activities and suggest accessible alternatives', 'score': 2},
                    {'letter': 'B', 'text': 'Discuss the issue with the organizer privately', 'score': 1},
                    {'letter': 'C', 'text': 'Wait to see if the organizer addresses the issue', 'score': 0},
                    {'letter': 'D', 'text': 'Accept the situation since it\'s too late to change', 'score': -1}
                ]
            },
            {
                'question_text': 'You discover that your department\'s budget includes charges for services that were never delivered. The amounts are small but the pattern suggests systematic overbilling.',
                'difficulty': 'hard',
                'options': [
                    {'letter': 'A', 'text': 'Investigate thoroughly and report the findings to finance and management', 'score': 2},
                    {'letter': 'B', 'text': 'Discuss the issue with your supervisor first', 'score': 1},
                    {'letter': 'C', 'text': 'Wait to see if the issue resolves itself', 'score': 0},
                    {'letter': 'D', 'text': 'Ignore it since the amounts are small', 'score': -1}
                ]
            },
            {
                'question_text': 'A customer, Khalid, is requesting a service that\'s outside your company\'s standard offerings. He\'s a long-term client and the request is reasonable but would require special approval.',
                'difficulty': 'medium',
                'options': [
                    {'letter': 'A', 'text': 'Present the request to management with a business case for approval', 'score': 2},
                    {'letter': 'B', 'text': 'Explain the limitations and suggest alternative solutions', 'score': 1},
                    {'letter': 'C', 'text': 'Wait to see if Khalid changes his mind', 'score': 0},
                    {'letter': 'D', 'text': 'Refuse the request to avoid complications', 'score': -1}
                ]
            },
            {
                'question_text': 'During a presentation to external clients, you realize that the financial projections contain errors that could mislead investors. The presentation is already underway.',
                'difficulty': 'hard',
                'options': [
                    {'letter': 'A', 'text': 'Pause the presentation, correct the errors, and provide accurate information', 'score': 2},
                    {'letter': 'B', 'text': 'Continue the presentation but follow up with corrected information', 'score': 1},
                    {'letter': 'C', 'text': 'Wait to see if anyone notices the errors', 'score': 0},
                    {'letter': 'D', 'text': 'Continue as planned to avoid embarrassment', 'score': -1}
                ]
            },
            {
                'question_text': 'Your team is implementing a new software system that some employees are resisting. The change is necessary for efficiency, but the resistance is affecting productivity.',
                'difficulty': 'medium',
                'options': [
                    {'letter': 'A', 'text': 'Provide comprehensive training and support to help employees adapt', 'score': 2},
                    {'letter': 'B', 'text': 'Allow a gradual transition period with additional support', 'score': 1},
                    {'letter': 'C', 'text': 'Wait to see if employees change their minds', 'score': 0},
                    {'letter': 'D', 'text': 'Force the new system without considering their concerns', 'score': -1}
                ]
            },
            {
                'question_text': 'You notice that a colleague\'s workspace is cluttered and poses a safety hazard. They seem stressed and haven\'t addressed the issue despite reminders.',
                'difficulty': 'easy',
                'options': [
                    {'letter': 'A', 'text': 'Address the safety concern directly while offering to help organize', 'score': 2},
                    {'letter': 'B', 'text': 'Report the safety issue to the workspace manager', 'score': 1},
                    {'letter': 'C', 'text': 'Wait to see if the colleague addresses the issue', 'score': 0},
                    {'letter': 'D', 'text': 'Ignore it since it\'s not your responsibility', 'score': -1}
                ]
            },
            {
                'question_text': 'In a team meeting, one participant consistently interrupts others and dominates the conversation. This prevents other team members from contributing their ideas.',
                'difficulty': 'medium',
                'options': [
                    {'letter': 'A', 'text': 'Gently redirect the conversation and ensure all voices are heard', 'score': 2},
                    {'letter': 'B', 'text': 'Speak privately with the dominant participant about sharing speaking time', 'score': 1},
                    {'letter': 'C', 'text': 'Wait to see if the situation resolves itself', 'score': 0},
                    {'letter': 'D', 'text': 'Let the dominant participant continue to avoid conflict', 'score': -1}
                ]
            },
            {
                'question_text': 'During a fire drill, you notice that several employees are not taking the drill seriously and are walking slowly or stopping to chat. This could be dangerous in a real emergency.',
                'difficulty': 'easy',
                'options': [
                    {'letter': 'A', 'text': 'Take immediate action to ensure everyone evacuates safely and seriously', 'score': 2},
                    {'letter': 'B', 'text': 'Find another designated person to take charge of the evacuation', 'score': 1},
                    {'letter': 'C', 'text': 'Wait to see if someone else takes responsibility', 'score': 0},
                    {'letter': 'D', 'text': 'Focus on your own safety and evacuate immediately', 'score': -1}
                ]
            },
            {
                'question_text': 'A team member approaches you with personal issues that are affecting their work performance. They seem to need support but are hesitant to ask for help.',
                'difficulty': 'medium',
                'options': [
                    {'letter': 'A', 'text': 'Offer confidential support and connect them with appropriate resources', 'score': 2},
                    {'letter': 'B', 'text': 'Suggest they speak with HR about available support programs', 'score': 1},
                    {'letter': 'C', 'text': 'Wait for them to approach you for help', 'score': 0},
                    {'letter': 'D', 'text': 'Ignore personal issues and focus only on work performance', 'score': -1}
                ]
            },
            {
                'question_text': 'A client is threatening to terminate their contract due to dissatisfaction with recent service quality. They represent significant revenue for your company.',
                'difficulty': 'hard',
                'options': [
                    {'letter': 'A', 'text': 'Address their concerns immediately with a solution-focused approach', 'score': 2},
                    {'letter': 'B', 'text': 'Escalate to senior management while maintaining client communication', 'score': 1},
                    {'letter': 'C', 'text': 'Wait to see if the situation resolves itself', 'score': 0},
                    {'letter': 'D', 'text': 'Accept the contract termination to avoid further issues', 'score': -1}
                ]
            },
            {
                'question_text': 'Your organization is restructuring and two departments will merge. Employees are anxious about job security and reporting relationships.',
                'difficulty': 'hard',
                'options': [
                    {'letter': 'A', 'text': 'Communicate transparently about the changes and provide support during transition', 'score': 2},
                    {'letter': 'B', 'text': 'Engage employees in the restructuring process to build understanding', 'score': 1},
                    {'letter': 'C', 'text': 'Wait for the right moment to announce the changes', 'score': 0},
                    {'letter': 'D', 'text': 'Implement the changes without explanation to avoid resistance', 'score': -1}
                ]
            },
            {
                'question_text': 'A demanding customer is requesting to speak with your manager, but your manager is in an important meeting. The customer is becoming increasingly frustrated.',
                'difficulty': 'medium',
                'options': [
                    {'letter': 'A', 'text': 'Address the customer concern professionally while respecting your manager\'s time', 'score': 2},
                    {'letter': 'B', 'text': 'Schedule a callback time when your manager is available', 'score': 1},
                    {'letter': 'C', 'text': 'Wait for your manager to finish the meeting', 'score': 0},
                    {'letter': 'D', 'text': 'Refuse to help since your manager is busy', 'score': -1}
                ]
            },
            {
                'question_text': 'Your company is implementing hot-desking to reduce office space costs. Some employees are concerned about productivity and personal workspace needs.',
                'difficulty': 'medium',
                'options': [
                    {'letter': 'A', 'text': 'Implement flexible workspace options to accommodate different work styles', 'score': 2},
                    {'letter': 'B', 'text': 'Gather feedback from employees and propose a balanced solution', 'score': 1},
                    {'letter': 'C', 'text': 'Wait to see if employees adapt to the current layout', 'score': 0},
                    {'letter': 'D', 'text': 'Keep the current layout since some employees like it', 'score': -1}
                ]
            },
            {
                'question_text': 'Your organization is replacing outdated technology that some employees rely on. They are anxious about learning new systems and their job security.',
                'difficulty': 'hard',
                'options': [
                    {'letter': 'A', 'text': 'Provide comprehensive retraining and career transition support', 'score': 2},
                    {'letter': 'B', 'text': 'Communicate transparently about changes and available support', 'score': 1},
                    {'letter': 'C', 'text': 'Wait to see how employees adapt to the new technology', 'score': 0},
                    {'letter': 'D', 'text': 'Let employees figure out their own career paths', 'score': -1}
                ]
            },
            {
                'question_text': 'A delivery truck is blocking the emergency exit at your building. The delivery driver says it will only take 10 minutes, but this violates safety protocols.',
                'difficulty': 'easy',
                'options': [
                    {'letter': 'A', 'text': 'Address the situation immediately to ensure emergency access', 'score': 2},
                    {'letter': 'B', 'text': 'Contact the delivery company to move the truck', 'score': 1},
                    {'letter': 'C', 'text': 'Wait for the delivery to finish since it will be quick', 'score': 0},
                    {'letter': 'D', 'text': 'Ignore it since it is not your responsibility', 'score': -1}
                ]
            },
            {
                'question_text': 'You discover that many employees are using a shortcut that bypasses security checkpoints. This creates a security risk but saves time during busy periods.',
                'difficulty': 'medium',
                'options': [
                    {'letter': 'A', 'text': 'Address the security concern while finding a balanced solution', 'score': 2},
                    {'letter': 'B', 'text': 'Discuss the issue with security and management', 'score': 1},
                    {'letter': 'C', 'text': 'Wait to see if security addresses the issue', 'score': 0},
                    {'letter': 'D', 'text': 'Ignore it since many employees use it', 'score': -1}
                ]
            },
            {
                'question_text': 'Two team members are having heated arguments about project priorities. Their conflict is making other team members uncomfortable and affecting productivity.',
                'difficulty': 'medium',
                'options': [
                    {'letter': 'A', 'text': 'Facilitate a constructive discussion to resolve the conflict', 'score': 2},
                    {'letter': 'B', 'text': 'Speak privately with both team members to understand their concerns', 'score': 1},
                    {'letter': 'C', 'text': 'Wait to see if the conflict resolves itself', 'score': 0},
                    {'letter': 'D', 'text': 'Ignore the conflict and focus on other priorities', 'score': -1}
                ]
            },
            {
                'question_text': 'During a brainstorming session, one team member consistently shoots down others\' ideas without offering alternatives. This is dampening the team\'s creative energy.',
                'difficulty': 'medium',
                'options': [
                    {'letter': 'A', 'text': 'Redirect the discussion to focus on constructive feedback and alternatives', 'score': 2},
                    {'letter': 'B', 'text': 'Speak privately with the person about their approach', 'score': 1},
                    {'letter': 'C', 'text': 'Wait to see if the team dynamics improve', 'score': 0},
                    {'letter': 'D', 'text': 'Let the person continue since they might have valid points', 'score': -1}
                ]
            },
            {
                'question_text': 'You notice a colleague operating machinery without proper safety gear. When you mention it, they say they\'re under pressure to meet production deadlines.',
                'difficulty': 'hard',
                'options': [
                    {'letter': 'A', 'text': 'Address the safety concern immediately while respecting production needs', 'score': 2},
                    {'letter': 'B', 'text': 'Report the safety violation to supervisors or safety personnel', 'score': 1},
                    {'letter': 'C', 'text': 'Wait to see if the person corrects their behavior', 'score': 0},
                    {'letter': 'D', 'text': 'Ignore it since supervisors are focused on deadlines', 'score': -1}
                ]
            },
            {
                'question_text': 'Your team is organizing a company event, but the chosen venue is not accessible for employees with mobility challenges. The event is in two weeks.',
                'difficulty': 'medium',
                'options': [
                    {'letter': 'A', 'text': 'Advocate for accessibility and find alternative solutions', 'score': 2},
                    {'letter': 'B', 'text': 'Discuss the issue with HR and management', 'score': 1},
                    {'letter': 'C', 'text': 'Wait to see if the organizer addresses the issue', 'score': 0},
                    {'letter': 'D', 'text': 'Accept the situation since it\'s too late to change', 'score': -1}
                ]
            },
            {
                'question_text': 'Your team\'s social events always involve alcohol, which excludes team members who don\'t drink for personal or religious reasons. This affects team bonding.',
                'difficulty': 'easy',
                'options': [
                    {'letter': 'A', 'text': 'Organize inclusive events that accommodate all team members', 'score': 2},
                    {'letter': 'B', 'text': 'Discuss the issue with event organizers and suggest alternatives', 'score': 1},
                    {'letter': 'C', 'text': 'Wait to see if the situation improves', 'score': 0},
                    {'letter': 'D', 'text': 'Keep the current events since most people enjoy them', 'score': -1}
                ]
            },
            {
                'question_text': 'Your department\'s budget has been approved for new equipment, but another department is requesting to share the funds for their urgent needs.',
                'difficulty': 'hard',
                'options': [
                    {'letter': 'A', 'text': 'Propose a collaborative solution that benefits both departments', 'score': 2},
                    {'letter': 'B', 'text': 'Discuss the situation with management to explore options', 'score': 1},
                    {'letter': 'C', 'text': 'Wait to see if the other department finds alternative funding', 'score': 0},
                    {'letter': 'D', 'text': 'Keep your budget since it was already approved', 'score': -1}
                ]
            },
            {
                'question_text': 'A client is requesting changes to a project that would require extending the deadline. Your management is pressuring you to stick to the original timeline.',
                'difficulty': 'hard',
                'options': [
                    {'letter': 'A', 'text': 'Address the situation transparently with both client and management', 'score': 2},
                    {'letter': 'B', 'text': 'Work with the client to clarify requirements and find a solution', 'score': 1},
                    {'letter': 'C', 'text': 'Wait to see if the client changes their mind', 'score': 0},
                    {'letter': 'D', 'text': 'Blame the client for unclear requirements', 'score': -1}
                ]
            },
            {
                'question_text': 'Your global team is struggling with coordination due to different time zones and cultural observances. This is affecting project deadlines and team cohesion.',
                'difficulty': 'hard',
                'options': [
                    {'letter': 'A', 'text': 'Create a flexible scheduling system that accommodates all cultural observances', 'score': 2},
                    {'letter': 'B', 'text': 'Establish clear communication protocols about availability and deadlines', 'score': 1},
                    {'letter': 'C', 'text': 'Wait to see if the team adapts to the scheduling challenges', 'score': 0},
                    {'letter': 'D', 'text': 'Require all team members to work in the same time zone', 'score': -1}
                ]
            },
            {
                'question_text': 'A high-performing team member is requesting to work on different types of projects to develop new skills. However, their current expertise is critical for ongoing projects.',
                'difficulty': 'medium',
                'options': [
                    {'letter': 'A', 'text': 'Support their development while ensuring project success', 'score': 2},
                    {'letter': 'B', 'text': 'Discuss the situation with them to find a balanced solution', 'score': 1},
                    {'letter': 'C', 'text': 'Wait to see if they change their mind about the request', 'score': 0},
                    {'letter': 'D', 'text': 'Refuse their request since the project needs their expertise', 'score': -1}
                ]
            },
            {
                'question_text': 'The finance and marketing departments are competing for the same budget allocation for their respective campaigns. Both have valid business cases.',
                'difficulty': 'hard',
                'options': [
                    {'letter': 'A', 'text': 'Facilitate a collaborative solution that balances both departments\' needs', 'score': 2},
                    {'letter': 'B', 'text': 'Bring both departments together to find a compromise', 'score': 1},
                    {'letter': 'C', 'text': 'Wait to see if the departments resolve their differences', 'score': 0},
                    {'letter': 'D', 'text': 'Choose one department\'s position and ignore the other', 'score': -1}
                ]
            }
        ]
