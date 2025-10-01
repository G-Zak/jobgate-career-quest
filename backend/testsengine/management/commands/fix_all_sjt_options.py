from django.core.management.base import BaseCommand
from django.db import connection
from testsengine.models import Question
from testsengine.question_option_model import QuestionOption

class Command(BaseCommand):
 help = 'Fix all SJT questions to have scenario-specific options instead of generic ones'

 def handle(self, *args, **options):
 test_id = 4 # Situational Judgment Test ID
 questions = Question.objects.filter(test_id=test_id).order_by('id')

 self.stdout.write(f'Found {questions.count()} SJT questions to fix')

 updated_count = 0

 for question in questions:
 # Clear existing generic options
 QuestionOption.objects.filter(question=question).delete()

 # Create scenario-specific options based on the question text
 scenario = question.question_text.lower()

 # Generate options based on scenario content
 if 'team' in scenario and 'deadline' in scenario:
 # Team deadline scenario
 options_data = [
 {'letter': 'A', 'text': 'Speak privately with the team lead about including the new member more actively', 'score': 2},
 {'letter': 'B', 'text': 'Wait until after the deadline to address the inclusion issues', 'score': 1},
 {'letter': 'C', 'text': 'Make a joke to lighten the mood and help them feel welcome', 'score': 0},
 {'letter': 'D', 'text': 'Ignore it since they are new and will learn by observation', 'score': -1}
 ]
 elif 'project manager' in scenario or 'deliverables' in scenario:
 # Project management scenario
 options_data = [
 {'letter': 'A', 'text': 'Negotiate a revised timeline with stakeholders while supporting your team', 'score': 2},
 {'letter': 'B', 'text': 'Push the team harder to meet the original deadline', 'score': 1},
 {'letter': 'C', 'text': 'Tell stakeholders everything is on track to buy more time', 'score': 0},
 {'letter': 'D', 'text': 'Reassign work to other departments without consulting anyone', 'score': -1}
 ]
 elif 'vendor' in scenario or 'conflict of interest' in scenario:
 # Ethics/vendor scenario
 options_data = [
 {'letter': 'A', 'text': 'Suggest your manager recuse themselves from the decision', 'score': 2},
 {'letter': 'B', 'text': 'Report the conflict of interest to HR or senior management', 'score': 1},
 {'letter': 'C', 'text': 'Document everything but wait to see what happens', 'score': 0},
 {'letter': 'D', 'text': 'Say nothing since the proposal is competitive', 'score': -1}
 ]
 elif 'dress code' in scenario or 'cultural' in scenario or 'religious' in scenario:
 # Diversity/inclusion scenario
 options_data = [
 {'letter': 'A', 'text': 'Work with HR to create inclusive guidelines that respect cultural differences', 'score': 2},
 {'letter': 'B', 'text': 'Discuss the situation with the employees to understand their needs', 'score': 1},
 {'letter': 'C', 'text': 'Wait for management to address the policy', 'score': 0},
 {'letter': 'D', 'text': 'Enforce the existing policy without exceptions', 'score': -1}
 ]
 elif 'marketing' in scenario or 'demographic' in scenario or 'diverse' in scenario:
 # Marketing diversity scenario
 options_data = [
 {'letter': 'A', 'text': 'Propose updating materials to better reflect your diverse audience', 'score': 2},
 {'letter': 'B', 'text': 'Discuss the issue with the marketing team', 'score': 1},
 {'letter': 'C', 'text': 'Wait for customer feedback before making changes', 'score': 0},
 {'letter': 'D', 'text': 'Keep the current materials since they are working', 'score': -1}
 ]
 elif 'cost' in scenario and 'reduce' in scenario:
 # Cost reduction scenario
 options_data = [
 {'letter': 'A', 'text': 'Implement a combination of measures while protecting employee welfare', 'score': 2},
 {'letter': 'B', 'text': 'Focus on eliminating non-essential programs first', 'score': 1},
 {'letter': 'C', 'text': 'Wait for more information before deciding', 'score': 0},
 {'letter': 'D', 'text': 'Implement layoffs as the quickest solution', 'score': -1}
 ]
 elif 'gift' in scenario or 'tickets' in scenario or ('policy' in scenario and 'gift' in scenario):
 # Ethics/gift scenario
 options_data = [
 {'letter': 'A', 'text': 'Politely decline and suggest alternative ways to show appreciation', 'score': 2},
 {'letter': 'B', 'text': 'Accept but donate the tickets to charity', 'score': 1},
 {'letter': 'C', 'text': 'Check with your supervisor about the policy', 'score': 0},
 {'letter': 'D', 'text': 'Accept since it is a networking opportunity', 'score': -1}
 ]
 elif 'team member' in scenario and 'conflicting' in scenario:
 # Team conflict scenario
 options_data = [
 {'letter': 'A', 'text': 'Facilitate a discussion between departments to find a solution', 'score': 2},
 {'letter': 'B', 'text': 'Ask the team member to prioritize your project', 'score': 1},
 {'letter': 'C', 'text': 'Wait to see how the situation resolves itself', 'score': 0},
 {'letter': 'D', 'text': 'Escalate to senior management immediately', 'score': -1}
 ]
 elif 'lunch' in scenario or 'colleagues' in scenario or 'excluded' in scenario:
 # Inclusion scenario
 options_data = [
 {'letter': 'A', 'text': 'Address the comments privately and suggest more inclusive alternatives', 'score': 2},
 {'letter': 'B', 'text': 'Speak to the colleagues about being more considerate', 'score': 1},
 {'letter': 'C', 'text': 'Wait to see if the situation improves', 'score': 0},
 {'letter': 'D', 'text': 'Ignore the comments as they are not work-related', 'score': -1}
 ]
 elif 'client' in scenario and 'safety' in scenario:
 # Safety scenario
 options_data = [
 {'letter': 'A', 'text': 'Address the safety concern immediately while respecting the client relationship', 'score': 2},
 {'letter': 'B', 'text': 'Discuss the safety issue with your client contact', 'score': 1},
 {'letter': 'C', 'text': 'Document the issue and report it later', 'score': 0},
 {'letter': 'D', 'text': 'Ignore it since it is not your responsibility', 'score': -1}
 ]
 elif 'performance' in scenario or 'evaluation' in scenario or 'system' in scenario:
 # Performance management scenario
 options_data = [
 {'letter': 'A', 'text': 'Provide training and support to help managers adapt to the new system', 'score': 2},
 {'letter': 'B', 'text': 'Compromise by allowing a gradual transition period', 'score': 1},
 {'letter': 'C', 'text': 'Wait to see if managers change their minds', 'score': 0},
 {'letter': 'D', 'text': 'Force the new system without considering their concerns', 'score': -1}
 ]
 elif 'workspace' in scenario or 'workstation' in scenario or 'cluttered' in scenario or 'hazard' in scenario:
 # Workspace safety scenario
 options_data = [
 {'letter': 'A', 'text': 'Address the safety concern directly with the colleague in a respectful manner', 'score': 2},
 {'letter': 'B', 'text': 'Discuss the issue with your supervisor or workspace manager', 'score': 1},
 {'letter': 'C', 'text': 'Wait to see if the situation improves on its own', 'score': 0},
 {'letter': 'D', 'text': 'Ignore it since it is not your responsibility', 'score': -1}
 ]
 elif 'meeting' in scenario or 'interrupts' in scenario or 'dominates' in scenario or 'participant' in scenario:
 # Meeting management scenario
 options_data = [
 {'letter': 'A', 'text': 'Gently redirect the conversation and ensure all voices are heard', 'score': 2},
 {'letter': 'B', 'text': 'Speak privately with the dominant participant about sharing speaking time', 'score': 1},
 {'letter': 'C', 'text': 'Wait to see if the situation resolves itself', 'score': 0},
 {'letter': 'D', 'text': 'Let the dominant participant continue to avoid conflict', 'score': -1}
 ]
 elif 'fire' in scenario or 'drill' in scenario or 'evacuate' in scenario or 'emergency' in scenario:
 # Emergency/safety scenario
 options_data = [
 {'letter': 'A', 'text': 'Take immediate action to ensure everyone evacuates safely', 'score': 2},
 {'letter': 'B', 'text': 'Find another designated person to take charge', 'score': 1},
 {'letter': 'C', 'text': 'Wait to see if someone else takes responsibility', 'score': 0},
 {'letter': 'D', 'text': 'Focus on your own safety and evacuate immediately', 'score': -1}
 ]
 elif 'supervisor' in scenario or 'direct reports' in scenario or 'struggling' in scenario or 'personal issues' in scenario:
 # Supervisor/employee support scenario
 options_data = [
 {'letter': 'A', 'text': 'Offer confidential support and resources while respecting their privacy', 'score': 2},
 {'letter': 'B', 'text': 'Discuss the situation with HR to explore available support options', 'score': 1},
 {'letter': 'C', 'text': 'Wait for them to approach you for help', 'score': 0},
 {'letter': 'D', 'text': 'Ignore personal issues and focus only on work performance', 'score': -1}
 ]
 elif 'client' in scenario or 'contract' in scenario or 'service' in scenario or 'compensation' in scenario:
 # Client service scenario
 options_data = [
 {'letter': 'A', 'text': 'Address their concerns immediately with a solution-focused approach', 'score': 2},
 {'letter': 'B', 'text': 'Escalate to senior management while maintaining client communication', 'score': 1},
 {'letter': 'C', 'text': 'Wait to see if the situation resolves itself', 'score': 0},
 {'letter': 'D', 'text': 'Accept the contract termination to avoid further issues', 'score': -1}
 ]
 elif 'promote' in scenario or 'leadership' in scenario or 'candidates' in scenario or 'technical skills' in scenario:
 # Leadership/promotion scenario
 options_data = [
 {'letter': 'A', 'text': 'Select the candidate who best fits the role requirements and team needs', 'score': 2},
 {'letter': 'B', 'text': 'Consider both candidates and create a development plan for the chosen one', 'score': 1},
 {'letter': 'C', 'text': 'Wait for more information before making a decision', 'score': 0},
 {'letter': 'D', 'text': 'Choose based on seniority or personal preference', 'score': -1}
 ]
 elif 'safety' in scenario or 'protocols' in scenario or 'laboratory' in scenario or 'risk' in scenario:
 # Safety protocol scenario
 options_data = [
 {'letter': 'A', 'text': 'Address the safety concern immediately while maintaining a supportive approach', 'score': 2},
 {'letter': 'B', 'text': 'Report the safety violation to the appropriate supervisor', 'score': 1},
 {'letter': 'C', 'text': 'Wait to see if the colleague corrects their behavior', 'score': 0},
 {'letter': 'D', 'text': 'Ignore it since it is not your responsibility', 'score': -1}
 ]
 elif 'remote' in scenario or 'time zones' in scenario or 'coordinating' in scenario or 'collaborative' in scenario:
 # Remote work scenario
 options_data = [
 {'letter': 'A', 'text': 'Implement flexible scheduling and asynchronous communication tools', 'score': 2},
 {'letter': 'B', 'text': 'Establish clear communication protocols and meeting guidelines', 'score': 1},
 {'letter': 'C', 'text': 'Wait to see if the team adapts to the challenges', 'score': 0},
 {'letter': 'D', 'text': 'Require all team members to work in the same time zone', 'score': -1}
 ]
 elif 'policy change' in scenario or 'unpopular' in scenario or 'compliance' in scenario or 'communicate' in scenario:
 # Policy communication scenario
 options_data = [
 {'letter': 'A', 'text': 'Communicate the change transparently with clear rationale and support', 'score': 2},
 {'letter': 'B', 'text': 'Engage employees in the implementation process to build understanding', 'score': 1},
 {'letter': 'C', 'text': 'Wait for the right moment to announce the change', 'score': 0},
 {'letter': 'D', 'text': 'Implement the change without explanation to avoid resistance', 'score': -1}
 ]
 elif 'customer' in scenario or 'demanding' in scenario or 'manager' in scenario or 'disturbed' in scenario:
 # Customer service scenario
 options_data = [
 {'letter': 'A', 'text': 'Address the customer concern professionally while respecting your manager\'s time', 'score': 2},
 {'letter': 'B', 'text': 'Schedule a callback time when your manager is available', 'score': 1},
 {'letter': 'C', 'text': 'Wait for your manager to finish the meeting', 'score': 0},
 {'letter': 'D', 'text': 'Refuse to help since your manager is busy', 'score': -1}
 ]
 elif 'office layout' in scenario or 'productivity' in scenario or 'collaboration' in scenario or 'distracting' in scenario:
 # Workplace environment scenario
 options_data = [
 {'letter': 'A', 'text': 'Implement flexible workspace options to accommodate different work styles', 'score': 2},
 {'letter': 'B', 'text': 'Gather feedback from employees and propose a balanced solution', 'score': 1},
 {'letter': 'C', 'text': 'Wait to see if employees adapt to the current layout', 'score': 0},
 {'letter': 'D', 'text': 'Keep the current layout since some employees like it', 'score': -1}
 ]
 elif 'technology' in scenario or 'obsolete' in scenario or 'anxious' in scenario or 'future' in scenario:
 # Technology change scenario
 options_data = [
 {'letter': 'A', 'text': 'Provide comprehensive retraining and career transition support', 'score': 2},
 {'letter': 'B', 'text': 'Communicate transparently about changes and available support', 'score': 1},
 {'letter': 'C', 'text': 'Wait to see how employees adapt to the new technology', 'score': 0},
 {'letter': 'D', 'text': 'Let employees figure out their own career paths', 'score': -1}
 ]
 elif 'delivery' in scenario or 'truck' in scenario or 'blocking' in scenario or 'emergency vehicle' in scenario:
 # Delivery/logistics scenario
 options_data = [
 {'letter': 'A', 'text': 'Address the situation immediately to ensure emergency access', 'score': 2},
 {'letter': 'B', 'text': 'Contact the delivery company to move the truck', 'score': 1},
 {'letter': 'C', 'text': 'Wait for the delivery to finish since it will be quick', 'score': 0},
 {'letter': 'D', 'text': 'Ignore it since it is not your responsibility', 'score': -1}
 ]
 elif 'shortcut' in scenario or 'security' in scenario or 'checkpoints' in scenario or 'bypasses' in scenario:
 # Security/shortcut scenario
 options_data = [
 {'letter': 'A', 'text': 'Address the security concern while finding a balanced solution', 'score': 2},
 {'letter': 'B', 'text': 'Discuss the issue with security and management', 'score': 1},
 {'letter': 'C', 'text': 'Wait to see if security addresses the issue', 'score': 0},
 {'letter': 'D', 'text': 'Ignore it since many employees use it', 'score': -1}
 ]
 elif 'heated arguments' in scenario or 'team members' in scenario or 'uncomfortable' in scenario or 'priorities' in scenario:
 # Team conflict scenario
 options_data = [
 {'letter': 'A', 'text': 'Facilitate a constructive discussion to resolve the conflict', 'score': 2},
 {'letter': 'B', 'text': 'Speak privately with both team members to understand their concerns', 'score': 1},
 {'letter': 'C', 'text': 'Wait to see if the conflict resolves itself', 'score': 0},
 {'letter': 'D', 'text': 'Ignore the conflict and focus on other priorities', 'score': -1}
 ]
 elif 'brainstorming' in scenario or 'shooting down' in scenario or 'ideas' in scenario or 'energy' in scenario:
 # Brainstorming/creativity scenario
 options_data = [
 {'letter': 'A', 'text': 'Redirect the discussion to focus on constructive feedback and alternatives', 'score': 2},
 {'letter': 'B', 'text': 'Speak privately with the person about their approach', 'score': 1},
 {'letter': 'C', 'text': 'Wait to see if the team dynamics improve', 'score': 0},
 {'letter': 'D', 'text': 'Let the person continue since they might have valid points', 'score': -1}
 ]
 elif 'machinery' in scenario or 'safety gear' in scenario or 'production' in scenario or 'deadlines' in scenario:
 # Machinery safety scenario
 options_data = [
 {'letter': 'A', 'text': 'Address the safety concern immediately while respecting production needs', 'score': 2},
 {'letter': 'B', 'text': 'Report the safety violation to supervisors or safety personnel', 'score': 1},
 {'letter': 'C', 'text': 'Wait to see if the person corrects their behavior', 'score': 0},
 {'letter': 'D', 'text': 'Ignore it since supervisors are focused on deadlines', 'score': -1}
 ]
 elif 'accessible' in scenario or 'mobility' in scenario or 'venue' in scenario or 'organizer' in scenario:
 # Accessibility/inclusion scenario
 options_data = [
 {'letter': 'A', 'text': 'Advocate for accessibility and find alternative solutions', 'score': 2},
 {'letter': 'B', 'text': 'Discuss the issue with HR and management', 'score': 1},
 {'letter': 'C', 'text': 'Wait to see if the organizer addresses the issue', 'score': 0},
 {'letter': 'D', 'text': 'Accept the situation since it is too late to change', 'score': -1}
 ]
 elif 'social events' in scenario or 'alcohol' in scenario or 'exclude' in scenario or 'networking' in scenario:
 # Social events/inclusion scenario
 options_data = [
 {'letter': 'A', 'text': 'Organize inclusive events that accommodate all team members', 'score': 2},
 {'letter': 'B', 'text': 'Discuss the issue with event organizers and suggest alternatives', 'score': 1},
 {'letter': 'C', 'text': 'Wait to see if the situation improves', 'score': 0},
 {'letter': 'D', 'text': 'Keep the current events since most people enjoy them', 'score': -1}
 ]
 elif 'budget' in scenario or 'equipment' in scenario or 'funds' in scenario or 'cuts' in scenario:
 # Budget/resource allocation scenario
 options_data = [
 {'letter': 'A', 'text': 'Propose a collaborative solution that benefits both departments', 'score': 2},
 {'letter': 'B', 'text': 'Discuss the situation with management to explore options', 'score': 1},
 {'letter': 'C', 'text': 'Wait to see if the other department finds alternative funding', 'score': 0},
 {'letter': 'D', 'text': 'Keep your budget since it was already approved', 'score': -1}
 ]
 elif 'deadline' in scenario or 'requirements' in scenario or 'cancel' in scenario or 'management' in scenario:
 # Deadline/client management scenario
 options_data = [
 {'letter': 'A', 'text': 'Address the situation transparently with both client and management', 'score': 2},
 {'letter': 'B', 'text': 'Work with the client to clarify requirements and find a solution', 'score': 1},
 {'letter': 'C', 'text': 'Wait to see if the client changes their mind', 'score': 0},
 {'letter': 'D', 'text': 'Blame the client for unclear requirements', 'score': -1}
 ]
 elif 'delivery' in scenario or 'truck' in scenario or 'blocking' in scenario or 'emergency vehicle' in scenario:
 # Delivery/logistics scenario
 options_data = [
 {'letter': 'A', 'text': 'Address the situation immediately to ensure emergency access', 'score': 2},
 {'letter': 'B', 'text': 'Contact the delivery company to move the truck', 'score': 1},
 {'letter': 'C', 'text': 'Wait for the delivery to finish since it will be quick', 'score': 0},
 {'letter': 'D', 'text': 'Ignore it since it is not your responsibility', 'score': -1}
 ]
 elif 'heated arguments' in scenario or 'team members' in scenario or 'uncomfortable' in scenario or 'priorities' in scenario:
 # Team conflict scenario
 options_data = [
 {'letter': 'A', 'text': 'Facilitate a constructive discussion to resolve the conflict', 'score': 2},
 {'letter': 'B', 'text': 'Speak privately with both team members to understand their concerns', 'score': 1},
 {'letter': 'C', 'text': 'Wait to see if the conflict resolves itself', 'score': 0},
 {'letter': 'D', 'text': 'Ignore the conflict and focus on other priorities', 'score': -1}
 ]
 elif 'partner organization' in scenario or 'work culture' in scenario or 'communication style' in scenario or 'friction' in scenario:
 # Partner organization/cultural differences scenario
 options_data = [
 {'letter': 'A', 'text': 'Establish clear communication protocols and cultural understanding', 'score': 2},
 {'letter': 'B', 'text': 'Organize team-building activities to bridge cultural gaps', 'score': 1},
 {'letter': 'C', 'text': 'Wait to see if the teams adapt to each other', 'score': 0},
 {'letter': 'D', 'text': 'Ignore the cultural differences and focus only on work', 'score': -1}
 ]
 elif 'finance' in scenario or 'marketing' in scenario or 'budget allocation' in scenario or 'campaign' in scenario:
 # Budget allocation scenario
 options_data = [
 {'letter': 'A', 'text': 'Facilitate a collaborative solution that balances both departments\' needs', 'score': 2},
 {'letter': 'B', 'text': 'Bring both departments together to find a compromise', 'score': 1},
 {'letter': 'C', 'text': 'Wait to see if the departments resolve their differences', 'score': 0},
 {'letter': 'D', 'text': 'Choose one department\'s position and ignore the other', 'score': -1}
 ]
 elif 'deadline' in scenario or 'requirements' in scenario or 'cancel' in scenario or 'management' in scenario:
 # Deadline/client management scenario
 options_data = [
 {'letter': 'A', 'text': 'Address the situation transparently with both client and management', 'score': 2},
 {'letter': 'B', 'text': 'Work with the client to clarify requirements and find a solution', 'score': 1},
 {'letter': 'C', 'text': 'Wait to see if the client changes their mind', 'score': 0},
 {'letter': 'D', 'text': 'Blame the client for unclear requirements', 'score': -1}
 ]
 elif 'global team' in scenario or 'holidays' in scenario or 'observances' in scenario or 'scheduling' in scenario:
 # Global team/holiday scheduling scenario
 options_data = [
 {'letter': 'A', 'text': 'Create a flexible scheduling system that accommodates all cultural observances', 'score': 2},
 {'letter': 'B', 'text': 'Establish clear communication protocols about availability and deadlines', 'score': 1},
 {'letter': 'C', 'text': 'Wait to see if the team adapts to the scheduling challenges', 'score': 0},
 {'letter': 'D', 'text': 'Require all team members to work on the same schedule', 'score': -1}
 ]
 elif 'professional development' in scenario or 'expertise' in scenario or 'different types' in scenario or 'excellent work' in scenario:
 # Professional development/team member scenario
 options_data = [
 {'letter': 'A', 'text': 'Support their development while ensuring project success', 'score': 2},
 {'letter': 'B', 'text': 'Discuss the situation with them to find a balanced solution', 'score': 1},
 {'letter': 'C', 'text': 'Wait to see if they change their mind about the request', 'score': 0},
 {'letter': 'D', 'text': 'Refuse their request since the project needs their expertise', 'score': -1}
 ]
 else:
 # Generic fallback for other scenarios
 options_data = [
 {'letter': 'A', 'text': 'Take immediate action to address the situation professionally', 'score': 2},
 {'letter': 'B', 'text': 'Discuss the situation with relevant stakeholders', 'score': 1},
 {'letter': 'C', 'text': 'Wait and observe how the situation develops', 'score': 0},
 {'letter': 'D', 'text': 'Ignore the situation and focus on other priorities', 'score': -1}
 ]

 # Create the options
 for option_data in options_data:
 QuestionOption.objects.create(
 question=question,
 option_letter=option_data['letter'],
 option_text=option_data['text'],
 score_value=option_data['score']
 )

 # Update the correct_answer to 'A' (best option)
 question.correct_answer = 'A'
 question.save()

 updated_count += 1
 if updated_count % 50 == 0:
 self.stdout.write(f'Updated {updated_count} questions...')

 self.stdout.write(self.style.SUCCESS(f'Successfully updated {updated_count} SJT questions with scenario-specific options!'))

 # Verification
 self.stdout.write('\n=== Verification ===')
 sample_questions = questions[:3]
 for q in sample_questions:
 options = QuestionOption.objects.filter(question=q).order_by('option_letter')
 self.stdout.write(f'Q{q.id}: {q.question_text[:50]}...')
 for opt in options:
 self.stdout.write(f' {opt.option_letter}: {opt.option_text[:40]}... (Score: {opt.score_value})')
