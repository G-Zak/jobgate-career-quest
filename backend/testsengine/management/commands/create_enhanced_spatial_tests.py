from django.core.management.base import BaseCommand
from testsengine.models import Test, Question
import json

class Command(BaseCommand):
 help = 'Create comprehensive spatial reasoning tests with visual content'

 def add_arguments(self, parser):
 parser.add_argument(
 '--count',
 type=int,
 default=20,
 help='Number of questions per category to create'
 )
 parser.add_argument(
 '--reset',
 action='store_true',
 help='Delete existing spatial questions before creating new ones'
 )

 def handle(self, *args, **options):
 count_per_category = options['count']

 if options['reset']:
 self.stdout.write('Deleting existing spatial reasoning questions...')
 Question.objects.filter(
 question_type__in=[
 'mental_rotation', 'paper_folding', 'cross_sections',
 'spatial_transformation', 'perspective_changes'
 ]
 ).delete()

 # Get or create spatial reasoning test
 spatial_test, created = Test.objects.get_or_create(
 test_type='spatial_reasoning',
 defaults={
 'title': 'Advanced Spatial Reasoning Assessment',
 'description': 'Comprehensive spatial intelligence evaluation with visual content',
 'duration_minutes': 25,
 'total_questions': count_per_category * 5, # 5 categories
 'passing_score': 70,
 'is_active': True
 }
 )

 if created:
 self.stdout.write(f'Created new spatial reasoning test: {spatial_test.title}')
 else:
 self.stdout.write(f'Using existing spatial reasoning test: {spatial_test.title}')
 # Update total questions count
 spatial_test.total_questions = count_per_category * 5
 spatial_test.save()

 # Create questions for each category
 categories = [
 ('mental_rotation', 'Mental Rotation'),
 ('paper_folding', 'Paper Folding/Unfolding'),
 ('cross_sections', 'Cross-sections Identification'),
 ('spatial_transformation', 'Spatial Transformation'),
 ('perspective_changes', 'Perspective Changes')
 ]

 question_order = 1
 total_created = 0

 for category_type, category_name in categories:
 self.stdout.write(f'\\nCreating {count_per_category} {category_name} questions...')

 for i in range(count_per_category):
 question_data = self.get_question_data(category_type, i + 1)

 question = Question.objects.create(
 test=spatial_test,
 question_type=category_type,
 question_text=question_data['text'],
 context=question_data.get('context', ''),
 options=question_data['options'],
 correct_answer=question_data['correct_answer'],
 explanation=question_data['explanation'],
 difficulty_level=question_data['difficulty'],
 order=question_order,

 # Visual content fields
 main_image=question_data.get('main_image'),
 option_images=question_data.get('option_images', []),
 sequence_images=question_data.get('sequence_images', []),

 # Image economy fields
 base_image_id=question_data.get('base_image_id'),
 overlay_ids=question_data.get('overlay_ids', []),
 transforms=question_data.get('transforms', {}),
 option_remap=question_data.get('option_remap', {}),

 # Visual metadata
 visual_style=question_data.get('visual_style', 'technical_3d'),
 complexity_score=question_data.get('complexity_score', 1)
 )

 question_order += 1
 total_created += 1

 self.stdout.write(
 self.style.SUCCESS(
 f'\\nSuccessfully created {total_created} spatial reasoning questions!'
 )
 )
 self.stdout.write(f'Test: {spatial_test.title}')
 self.stdout.write(f'Total questions: {spatial_test.total_questions}')
 self.stdout.write(f'Duration: {spatial_test.duration_minutes} minutes')

 def get_question_data(self, category_type, question_num):
 """Generate question data based on category and number"""

 if category_type == 'mental_rotation':
 return self.get_mental_rotation_question(question_num)
 elif category_type == 'paper_folding':
 return self.get_paper_folding_question(question_num)
 elif category_type == 'cross_sections':
 return self.get_cross_section_question(question_num)
 elif category_type == 'spatial_transformation':
 return self.get_spatial_transformation_question(question_num)
 elif category_type == 'perspective_changes':
 return self.get_perspective_changes_question(question_num)

 def get_mental_rotation_question(self, num):
 difficulty_cycle = ['easy', 'medium', 'hard'][num % 3]
 rotation_angles = [45, 90, 135, 180, 225, 270]
 angle = rotation_angles[num % len(rotation_angles)]

 return {
 'text': f'Which option shows the same 3D object rotated {angle}° clockwise around the vertical axis?',
 'options': [
 'Option A: Rotated view',
 'Option B: Different orientation',
 'Option C: Flipped version',
 'Option D: Scaled version'
 ],
 'correct_answer': 'A',
 'explanation': f'The correct answer shows the object rotated exactly {angle}° clockwise while maintaining the same proportions and features.',
 'difficulty': difficulty_cycle,
 'base_image_id': f'mr_{num:03d}_object',
 'overlay_ids': [f'rotation_arrow_{angle}'],
 'transforms': {
 'main': {'rotation': 0},
 'options': {
 'A': {'rotation': angle},
 'B': {'rotation': angle + 45},
 'C': {'rotation': angle, 'flipX': True},
 'D': {'rotation': angle, 'scale': 1.2}
 }
 },
 'visual_style': 'technical_3d',
 'complexity_score': min(3, (num // 5) + 1)
 }

 def get_paper_folding_question(self, num):
 fold_types = ['single', 'double', 'triple']
 fold_type = fold_types[num % len(fold_types)]

 return {
 'text': f'A square sheet of paper is folded {fold_type} and holes are punched. What pattern appears when unfolded?',
 'options': [
 'Pattern A: Symmetric arrangement',
 'Pattern B: Asymmetric holes',
 'Pattern C: Single hole',
 'Pattern D: Random pattern'
 ],
 'correct_answer': 'A',
 'explanation': f'When a paper is folded {fold_type} and holes are punched, unfolding creates a symmetric pattern based on the fold lines.',
 'difficulty': 'easy' if num <= 7 else 'medium' if num <= 14 else 'hard',
 'base_image_id': f'pf_{num:03d}_pattern',
 'sequence_images': [
 f'/assets/spatial/base/paper_folding/pf_{num:03d}_step1.svg',
 f'/assets/spatial/base/paper_folding/pf_{num:03d}_step2.svg',
 f'/assets/spatial/base/paper_folding/pf_{num:03d}_result.svg'
 ],
 'overlay_ids': ['fold_lines_dashed', 'punch_indicators'],
 'visual_style': 'diagram',
 'complexity_score': len(fold_types)
 }

 def get_cross_section_question(self, num):
 shapes = ['cylinder', 'cube', 'pyramid', 'sphere', 'cone']
 shape = shapes[num % len(shapes)]

 return {
 'text': f'If this {shape} is cut by the indicated plane, what would the cross-section look like?',
 'options': [
 'Cross-section A: Correct shape',
 'Cross-section B: Incorrect proportions',
 'Cross-section C: Wrong orientation',
 'Cross-section D: Different shape'
 ],
 'correct_answer': 'A',
 'explanation': f'Cutting a {shape} with the shown plane produces the cross-section shown in option A.',
 'difficulty': 'easy' if shape in ['cylinder', 'cube'] else 'medium' if shape == 'pyramid' else 'hard',
 'base_image_id': f'cs_{num:03d}_{shape}',
 'overlay_ids': ['cutting_plane_transparent', 'section_highlight'],
 'transforms': {
 'cutting_plane': {'opacity': 0.3, 'color': '#ff6b6b'}
 },
 'visual_style': 'technical_3d',
 'complexity_score': 2 if shape in ['cylinder', 'cube'] else 3
 }

 def get_spatial_transformation_question(self, num):
 transformations = ['scale_up', 'scale_down', 'stretch_horizontal', 'stretch_vertical', 'compress']
 transform = transformations[num % len(transformations)]

 return {
 'text': f'How would this object appear after the indicated {transform.replace("_", " ")} transformation?',
 'options': [
 'Result A: Correct transformation',
 'Result B: Wrong proportions',
 'Result C: Incorrect direction',
 'Result D: No change'
 ],
 'correct_answer': 'A',
 'explanation': f'The {transform.replace("_", " ")} transformation correctly modifies the object as shown in option A.',
 'difficulty': 'medium',
 'base_image_id': f'st_{num:03d}_object',
 'overlay_ids': ['transformation_grid', 'direction_arrows'],
 'transforms': {
 'reference': {'scale': 1.0},
 'target': self.get_transform_values(transform)
 },
 'visual_style': 'diagram',
 'complexity_score': 2
 }

 def get_perspective_changes_question(self, num):
 viewpoints = ['front', 'side', 'top', 'bottom', 'back', 'isometric']
 viewpoint = viewpoints[num % len(viewpoints)]

 return {
 'text': f'How would this object look when viewed from the {viewpoint}?',
 'options': [
 f'View A: Correct {viewpoint} view',
 'View B: Wrong perspective',
 'View C: Rotated incorrectly',
 'View D: Different object'
 ],
 'correct_answer': 'A',
 'explanation': f'The {viewpoint} view correctly shows how the object appears from that perspective.',
 'difficulty': 'easy' if viewpoint in ['front', 'side', 'top'] else 'medium',
 'base_image_id': f'pc_{num:03d}_object',
 'overlay_ids': [f'viewpoint_indicator_{viewpoint}'],
 'transforms': {
 'camera_position': self.get_camera_transform(viewpoint)
 },
 'visual_style': 'isometric' if viewpoint == 'isometric' else 'orthographic',
 'complexity_score': 1 if viewpoint in ['front', 'side'] else 2
 }

 def get_transform_values(self, transform_type):
 transform_map = {
 'scale_up': {'scaleX': 1.5, 'scaleY': 1.5},
 'scale_down': {'scaleX': 0.7, 'scaleY': 0.7},
 'stretch_horizontal': {'scaleX': 1.8, 'scaleY': 1.0},
 'stretch_vertical': {'scaleX': 1.0, 'scaleY': 1.6},
 'compress': {'scaleX': 0.8, 'scaleY': 0.8}
 }
 return transform_map.get(transform_type, {'scaleX': 1.0, 'scaleY': 1.0})

 def get_camera_transform(self, viewpoint):
 camera_map = {
 'front': {'rotateX': 0, 'rotateY': 0},
 'side': {'rotateX': 0, 'rotateY': 90},
 'top': {'rotateX': -90, 'rotateY': 0},
 'bottom': {'rotateX': 90, 'rotateY': 0},
 'back': {'rotateX': 0, 'rotateY': 180},
 'isometric': {'rotateX': -30, 'rotateY': 45}
 }
 return camera_map.get(viewpoint, {'rotateX': 0, 'rotateY': 0})
