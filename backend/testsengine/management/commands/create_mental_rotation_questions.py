from django.core.management.base import BaseCommand
from testsengine.models import Test, Question
import json

class Command(BaseCommand):
 help = 'Create Mental Rotation questions with optimized image usage'

 def add_arguments(self, parser):
 parser.add_argument(
 '--reset',
 action='store_true',
 help='Delete existing mental rotation questions'
 )

 def handle(self, *args, **options):
 if options['reset']:
 self.stdout.write('Deleting existing mental rotation questions...')
 Question.objects.filter(question_type='mental_rotation').delete()

 # Get or create spatial reasoning test
 spatial_test, created = Test.objects.get_or_create(
 test_type='spatial_reasoning',
 defaults={
 'title': 'Advanced Spatial Reasoning Assessment',
 'description': 'Comprehensive spatial intelligence evaluation',
 'duration_minutes': 25,
 'total_questions': 100,
 'passing_score': 70,
 'is_active': True
 }
 )

 # Mental Rotation Questions - 35 total (from 15 base images)
 mental_rotation_questions = self.get_mental_rotation_questions()

 created_count = 0
 for question_data in mental_rotation_questions:
 question = Question.objects.create(
 test=spatial_test,
 question_type='mental_rotation',
 question_text=question_data['text'],
 context=question_data.get('context', ''),
 options=question_data['options'],
 correct_answer=question_data['correct_answer'],
 explanation=question_data['explanation'],
 difficulty_level=question_data['difficulty'],
 order=question_data['order'],

 # Visual content fields
 base_image_id=question_data['base_image_id'],
 overlay_ids=question_data.get('overlay_ids', []),
 transforms=question_data.get('transforms', {}),
 visual_style=question_data.get('visual_style', 'technical_3d'),
 complexity_score=question_data.get('complexity_score', 1)
 )
 created_count += 1

 self.stdout.write(
 self.style.SUCCESS(f'Successfully created {created_count} Mental Rotation questions!')
 )

 def get_mental_rotation_questions(self):
 """Generate 35 Mental Rotation questions from 15 base images (2-3 variations each)"""

 questions = []
 order = 1

 # === EASY LEVEL (12 questions from 5 base images) ===

 # Image 1: Simple L-Block (3 variations)
 questions.extend([
 {
 'order': order,
 'text': 'Which option shows the same L-shaped object rotated 90° clockwise around the vertical axis?',
 'context': 'Look at the L-shaped block. The long arm points right, short arm points up.',
 'options': [
 'Long arm points down, short arm points right',
 'Long arm points left, short arm points down',
 'Long arm points up, short arm points left',
 'Same as original orientation'
 ],
 'correct_answer': 'A',
 'explanation': '90° clockwise rotation moves the long arm from right to down, short arm from up to right.',
 'difficulty': 'easy',
 'base_image_id': 'MR_L_block_01',
 'overlay_ids': ['rotation_arrow_90cw'],
 'transforms': {'main': {'rotation': 0}},
 'visual_style': 'technical_3d',
 'complexity_score': 1,
 'image_description': 'L-shaped block made of 3 cubes: 2 cubes horizontal (long arm pointing right), 1 cube vertical up (short arm). Blue color, isometric view, clean background.'
 },
 {
 'order': order + 1,
 'text': 'If you rotate this L-shaped object 180° around the vertical axis, which orientation results?',
 'context': 'Consider the complete 180-degree rotation of the L-block.',
 'options': [
 'Long arm points right, short arm points up (same as original)',
 'Long arm points left, short arm points down',
 'Long arm points down, short arm points right',
 'Long arm points up, short arm points left'
 ],
 'correct_answer': 'B',
 'explanation': '180° rotation flips the object completely: right→left, up→down.',
 'difficulty': 'easy',
 'base_image_id': 'MR_L_block_01',
 'overlay_ids': ['rotation_arrow_180'],
 'transforms': {'main': {'rotation': 0}},
 'visual_style': 'technical_3d',
 'complexity_score': 1,
 'image_description': 'Same L-shaped block as above with 180° rotation arrow overlay.'
 },
 {
 'order': order + 2,
 'text': 'Looking at this L-shaped object, which option shows it rotated 90° counter-clockwise?',
 'context': 'Counter-clockwise rotation is opposite to clockwise.',
 'options': [
 'Long arm points down, short arm points right',
 'Long arm points up, short arm points left',
 'Long arm points left, short arm points down',
 'Long arm points right, short arm points up (no change)'
 ],
 'correct_answer': 'B',
 'explanation': '90° counter-clockwise: right→up, up→left.',
 'difficulty': 'easy',
 'base_image_id': 'MR_L_block_01',
 'overlay_ids': ['rotation_arrow_90ccw'],
 'transforms': {'main': {'rotation': 0}},
 'visual_style': 'technical_3d',
 'complexity_score': 1,
 'image_description': 'Same L-shaped block with counter-clockwise rotation arrow overlay.'
 }
 ])
 order += 3

 # Image 2: T-Block (3 variations)
 questions.extend([
 {
 'order': order,
 'text': 'Which option shows this T-shaped object after a 90° clockwise rotation?',
 'context': 'The T-shape has a horizontal top bar and vertical stem pointing down.',
 'options': [
 'Vertical bar on left, horizontal stem pointing right',
 'Horizontal bar on bottom, vertical stem pointing up',
 'Vertical bar on right, horizontal stem pointing left',
 'Same T orientation (no rotation)'
 ],
 'correct_answer': 'A',
 'explanation': '90° clockwise turns the top horizontal bar to the left vertical position.',
 'difficulty': 'easy',
 'base_image_id': 'MR_T_block_01',
 'overlay_ids': ['rotation_arrow_90cw'],
 'transforms': {'main': {'rotation': 0}},
 'visual_style': 'technical_3d',
 'complexity_score': 1,
 'image_description': 'T-shaped block: 3 cubes horizontal on top (forming bar), 1 cube extending down from center (forming stem). Blue color, isometric view.'
 },
 {
 'order': order + 1,
 'text': 'After rotating this T-shaped object 180°, what orientation do you see?',
 'context': 'Think about flipping the T upside down.',
 'options': [
 'Horizontal bar on top, stem pointing down (same)',
 'Horizontal bar on bottom, stem pointing up (upside-down T)',
 'Vertical bar on left, stem pointing right',
 'Vertical bar on right, stem pointing left'
 ],
 'correct_answer': 'B',
 'explanation': '180° rotation flips the T upside down: top bar moves to bottom, down stem moves to up.',
 'difficulty': 'easy',
 'base_image_id': 'MR_T_block_01',
 'overlay_ids': ['rotation_arrow_180'],
 'transforms': {'main': {'rotation': 0}},
 'visual_style': 'technical_3d',
 'complexity_score': 1,
 'image_description': 'Same T-shaped block with 180° rotation indicator.'
 },
 {
 'order': order + 2,
 'text': 'If this T-shaped object rotates 270° clockwise, which result appears?',
 'context': '270° clockwise equals 90° counter-clockwise.',
 'options': [
 'Vertical bar on left, horizontal stem pointing right',
 'Horizontal bar on bottom, vertical stem pointing up',
 'Vertical bar on right, horizontal stem pointing left',
 'Horizontal bar on top, vertical stem pointing down (same)'
 ],
 'correct_answer': 'C',
 'explanation': '270° clockwise (or 90° counter-clockwise) moves the top bar to the right vertical position.',
 'difficulty': 'easy',
 'base_image_id': 'MR_T_block_01',
 'overlay_ids': ['rotation_arrow_270cw'],
 'transforms': {'main': {'rotation': 0}},
 'visual_style': 'technical_3d',
 'complexity_score': 1,
 'image_description': 'Same T-shaped block with 270° rotation indicator.'
 }
 ])
 order += 3

 # Image 3: Z-Block (2 variations)
 questions.extend([
 {
 'order': order,
 'text': 'Which option shows this Z-shaped object rotated 90° clockwise?',
 'context': 'The Z-shape has two horizontal segments connected by a diagonal.',
 'options': [
 'S-shape orientation (rotated Z)',
 'Backward S-shape orientation',
 'Same Z orientation',
 'Upside-down Z orientation'
 ],
 'correct_answer': 'A',
 'explanation': '90° clockwise rotation of a Z creates an S-like shape.',
 'difficulty': 'easy',
 'base_image_id': 'MR_Z_block_01',
 'overlay_ids': ['rotation_arrow_90cw'],
 'transforms': {'main': {'rotation': 0}},
 'visual_style': 'technical_3d',
 'complexity_score': 2,
 'image_description': 'Z-shaped block: 2 cubes horizontal top-left, 1 cube diagonal middle, 2 cubes horizontal bottom-right. Forms a Z pattern. Blue color, isometric view.'
 },
 {
 'order': order + 1,
 'text': 'After a 180° rotation, how does this Z-shaped object appear?',
 'context': 'Consider the complete flip of the Z-shape.',
 'options': [
 'Same Z orientation',
 'Backward Z (mirrored)',
 'S-shape orientation',
 'Backward S-shape orientation'
 ],
 'correct_answer': 'B',
 'explanation': '180° rotation creates a backward/mirrored Z shape.',
 'difficulty': 'easy',
 'base_image_id': 'MR_Z_block_01',
 'overlay_ids': ['rotation_arrow_180'],
 'transforms': {'main': {'rotation': 0}},
 'visual_style': 'technical_3d',
 'complexity_score': 2,
 'image_description': 'Same Z-shaped block with 180° rotation indicator.'
 }
 ])
 order += 2

 # Image 4: Step Block (2 variations)
 questions.extend([
 {
 'order': order,
 'text': 'Which option shows this step-shaped object after 90° clockwise rotation?',
 'context': 'The step goes up from left to right in 2 levels.',
 'options': [
 'Step goes up from bottom to top',
 'Step goes down from top to bottom',
 'Step goes up from right to left',
 'Same step orientation (left to right up)'
 ],
 'correct_answer': 'A',
 'explanation': '90° clockwise rotation turns the horizontal step into a vertical step going upward.',
 'difficulty': 'easy',
 'base_image_id': 'MR_step_block_01',
 'overlay_ids': ['rotation_arrow_90cw'],
 'transforms': {'main': {'rotation': 0}},
 'visual_style': 'technical_3d',
 'complexity_score': 2,
 'image_description': 'Step-shaped block: 1 cube bottom-left, 2 cubes stacked on right (creating 2-level step pattern). Blue color, isometric view.'
 },
 {
 'order': order + 1,
 'text': 'If this step-shaped object rotates 270° clockwise, what orientation results?',
 'context': '270° clockwise equals 90° counter-clockwise.',
 'options': [
 'Step goes up from left to right (same)',
 'Step goes up from right to left',
 'Step goes down from top to bottom',
 'Step goes up from bottom to top'
 ],
 'correct_answer': 'C',
 'explanation': '270° clockwise rotation creates a downward step from top to bottom.',
 'difficulty': 'easy',
 'base_image_id': 'MR_step_block_01',
 'overlay_ids': ['rotation_arrow_270cw'],
 'transforms': {'main': {'rotation': 0}},
 'visual_style': 'technical_3d',
 'complexity_score': 2,
 'image_description': 'Same step-shaped block with 270° rotation indicator.'
 }
 ])
 order += 2

 # Image 5: Simple U-Block (2 variations)
 questions.extend([
 {
 'order': order,
 'text': 'Which option shows this U-shaped object rotated 180°?',
 'context': 'The U opens upward (opening at the top).',
 'options': [
 'U opens upward (same orientation)',
 'U opens downward (upside-down)',
 'U opens to the right',
 'U opens to the left'
 ],
 'correct_answer': 'B',
 'explanation': '180° rotation flips the U upside-down, so it opens downward.',
 'difficulty': 'easy',
 'base_image_id': 'MR_U_block_01',
 'overlay_ids': ['rotation_arrow_180'],
 'transforms': {'main': {'rotation': 0}},
 'visual_style': 'technical_3d',
 'complexity_score': 1,
 'image_description': 'U-shaped block: 2 vertical columns (2 cubes each) connected by horizontal base (1 cube). Opening faces upward. Blue color, isometric view.'
 },
 {
 'order': order + 1,
 'text': 'After rotating this U-shaped object 90° clockwise, which orientation do you see?',
 'context': 'Consider how the U opening direction changes.',
 'options': [
 'U opens upward (same)',
 'U opens downward',
 'U opens to the right',
 'U opens to the left'
 ],
 'correct_answer': 'D',
 'explanation': '90° clockwise rotation turns the upward-opening U to open toward the left.',
 'difficulty': 'easy',
 'base_image_id': 'MR_U_block_01',
 'overlay_ids': ['rotation_arrow_90cw'],
 'transforms': {'main': {'rotation': 0}},
 'visual_style': 'technical_3d',
 'complexity_score': 1,
 'image_description': 'Same U-shaped block with 90° clockwise rotation indicator.'
 }
 ])
 order += 2

 # === MEDIUM LEVEL (10 questions from 4 base images) ===

 # Image 6: Complex L with Extension (3 variations)
 questions.extend([
 {
 'order': order,
 'text': 'Which option shows this complex L-shaped object rotated 45° clockwise?',
 'context': 'This L-shape has an additional cube extending from the corner.',
 'options': [
 'L rotated 45° with extension in correct position',
 'L rotated 45° with extension in wrong position',
 'L rotated 90° instead of 45°',
 'Original L orientation (no rotation)'
 ],
 'correct_answer': 'A',
 'explanation': '45° rotation maintains the L shape while rotating the entire structure including the corner extension.',
 'difficulty': 'medium',
 'base_image_id': 'MR_complex_L_01',
 'overlay_ids': ['rotation_arrow_45cw'],
 'transforms': {'main': {'rotation': 0}},
 'visual_style': 'technical_3d',
 'complexity_score': 3,
 'image_description': 'Complex L-block: Basic L (3 cubes) plus 1 additional cube extending from the inner corner of the L. Creates asymmetric L with distinguishable features. Blue color, isometric view.'
 },
 {
 'order': order + 1,
 'text': 'If this complex L-shaped object rotates 135° clockwise, which result appears?',
 'context': '135° is between 90° and 180° rotation.',
 'options': [
 'L orientation at 135° angle with extension properly positioned',
 'L orientation at 90° angle',
 'L orientation at 180° angle',
 'Extension separated from main L structure'
 ],
 'correct_answer': 'A',
 'explanation': '135° clockwise rotation places the L at a diagonal angle with all parts correctly oriented.',
 'difficulty': 'medium',
 'base_image_id': 'MR_complex_L_01',
 'overlay_ids': ['rotation_arrow_135cw'],
 'transforms': {'main': {'rotation': 0}},
 'visual_style': 'technical_3d',
 'complexity_score': 3,
 'image_description': 'Same complex L-block with 135° rotation indicator.'
 },
 {
 'order': order + 2,
 'text': 'After a 90° counter-clockwise rotation of this complex L-shape, what do you observe?',
 'context': 'Pay attention to where the corner extension ends up.',
 'options': [
 'Extension at top-right of rotated L',
 'Extension at bottom-left of rotated L',
 'Extension at top-left of rotated L',
 'Extension at bottom-right of rotated L'
 ],
 'correct_answer': 'C',
 'explanation': '90° counter-clockwise moves the extension from its original position to the top-left of the rotated L.',
 'difficulty': 'medium',
 'base_image_id': 'MR_complex_L_01',
 'overlay_ids': ['rotation_arrow_90ccw'],
 'transforms': {'main': {'rotation': 0}},
 'visual_style': 'technical_3d',
 'complexity_score': 3,
 'image_description': 'Same complex L-block with 90° counter-clockwise rotation indicator.'
 }
 ])
 order += 3

 # Continue with remaining medium questions...
 # [I'll provide the structure for the remaining questions]

 # Image 7: Asymmetric Block 1 (3 variations)
 questions.extend([
 {
 'order': order,
 'text': 'Which option shows this asymmetric object rotated 90° clockwise?',
 'context': 'This object has no symmetry - each side looks different.',
 'options': [
 'Object rotated 90° clockwise with features correctly positioned',
 'Object rotated 180° instead of 90°',
 'Object mirrored instead of rotated',
 'Original object orientation'
 ],
 'correct_answer': 'A',
 'explanation': '90° clockwise rotation of the asymmetric object maintains all features in their correct relative positions.',
 'difficulty': 'medium',
 'base_image_id': 'MR_asymmetric_01',
 'overlay_ids': ['rotation_arrow_90cw'],
 'transforms': {'main': {'rotation': 0}},
 'visual_style': 'technical_3d',
 'complexity_score': 4,
 'image_description': 'Asymmetric block: 5 cubes arranged in unique pattern with no symmetry. Has protruding elements in different directions making each view distinct. Blue color, isometric view.'
 },
 {
 'order': order + 1,
 'text': 'What orientation results from rotating this asymmetric object 270° clockwise?',
 'context': '270° clockwise equals 90° counter-clockwise.',
 'options': [
 'Object at 270° clockwise position',
 'Object at 90° clockwise position',
 'Object at 180° position',
 'Object at original position'
 ],
 'correct_answer': 'A',
 'explanation': '270° clockwise rotation places the asymmetric object in the correct orientation with all features properly positioned.',
 'difficulty': 'medium',
 'base_image_id': 'MR_asymmetric_01',
 'overlay_ids': ['rotation_arrow_270cw'],
 'transforms': {'main': {'rotation': 0}},
 'visual_style': 'technical_3d',
 'complexity_score': 4,
 'image_description': 'Same asymmetric block with 270° rotation indicator.'
 },
 {
 'order': order + 2,
 'text': 'If you rotate this asymmetric object 45° counter-clockwise, which option is correct?',
 'context': '45° rotations create diagonal orientations.',
 'options': [
 'Object at 45° counter-clockwise diagonal',
 'Object at 45° clockwise diagonal',
 'Object at 90° counter-clockwise',
 'Object remains in original position'
 ],
 'correct_answer': 'A',
 'explanation': '45° counter-clockwise creates a diagonal orientation with all asymmetric features correctly positioned.',
 'difficulty': 'medium',
 'base_image_id': 'MR_asymmetric_01',
 'overlay_ids': ['rotation_arrow_45ccw'],
 'transforms': {'main': {'rotation': 0}},
 'visual_style': 'technical_3d',
 'complexity_score': 4,
 'image_description': 'Same asymmetric block with 45° counter-clockwise rotation indicator.'
 }
 ])
 order += 3

 # Image 8: Multi-level Step (2 variations)
 questions.extend([
 {
 'order': order,
 'text': 'Which option shows this 3-level step object rotated 90° clockwise?',
 'context': 'The steps ascend from left to right in 3 distinct levels.',
 'options': [
 'Steps ascend from bottom to top vertically',
 'Steps ascend from top to bottom vertically',
 'Steps ascend from right to left horizontally',
 'Same horizontal left-to-right ascension'
 ],
 'correct_answer': 'A',
 'explanation': '90° clockwise rotation converts horizontal left-to-right steps into vertical bottom-to-top steps.',
 'difficulty': 'medium',
 'base_image_id': 'MR_multi_step_01',
 'overlay_ids': ['rotation_arrow_90cw'],
 'transforms': {'main': {'rotation': 0}},
 'visual_style': 'technical_3d',
 'complexity_score': 3,
 'image_description': '3-level step block: 1 cube (level 1), 2 cubes stacked (level 2), 3 cubes stacked (level 3), arranged left to right. Creates ascending staircase pattern. Blue color, isometric view.'
 },
 {
 'order': order + 1,
 'text': 'After rotating this 3-level step object 180°, what configuration appears?',
 'context': 'Consider the complete reversal of the step pattern.',
 'options': [
 'Steps ascend left to right (same as original)',
 'Steps ascend right to left (reversed)',
 'Steps ascend bottom to top vertically',
 'Steps ascend top to bottom vertically'
 ],
 'correct_answer': 'B',
 'explanation': '180° rotation reverses the step direction: originally left-to-right becomes right-to-left.',
 'difficulty': 'medium',
 'base_image_id': 'MR_multi_step_01',
 'overlay_ids': ['rotation_arrow_180'],
 'transforms': {'main': {'rotation': 0}},
 'visual_style': 'technical_3d',
 'complexity_score': 3,
 'image_description': 'Same 3-level step block with 180° rotation indicator.'
 }
 ])
 order += 2

 # Image 9: Corner Block (2 variations)
 questions.extend([
 {
 'order': order,
 'text': 'Which option shows this corner-shaped object rotated 90° clockwise?',
 'context': 'The corner has two perpendicular arms extending in different directions.',
 'options': [
 'Corner rotated 90° with arms in new perpendicular directions',
 'Corner rotated 180° instead of 90°',
 'Corner mirrored but not rotated',
 'Original corner orientation'
 ],
 'correct_answer': 'A',
 'explanation': '90° clockwise rotation moves each arm of the corner to its new perpendicular position.',
 'difficulty': 'medium',
 'base_image_id': 'MR_corner_block_01',
 'overlay_ids': ['rotation_arrow_90cw'],
 'transforms': {'main': {'rotation': 0}},
 'visual_style': 'technical_3d',
 'complexity_score': 3,
 'image_description': 'Corner-shaped block: 2 cubes extending in one direction, 2 cubes extending perpendicular direction, meeting at corner cube. Forms 90° corner shape. Blue color, isometric view.'
 },
 {
 'order': order + 1,
 'text': 'If this corner-shaped object rotates 135° clockwise, which result do you see?',
 'context': '135° rotation places the corner at a diagonal angle.',
 'options': [
 'Corner at 135° diagonal with arms correctly oriented',
 'Corner at 90° orientation',
 'Corner at 180° orientation',
 'Corner at 45° orientation'
 ],
 'correct_answer': 'A',
 'explanation': '135° clockwise rotation places the corner shape at the correct diagonal angle with both arms properly positioned.',
 'difficulty': 'medium',
 'base_image_id': 'MR_corner_block_01',
 'overlay_ids': ['rotation_arrow_135cw'],
 'transforms': {'main': {'rotation': 0}},
 'visual_style': 'technical_3d',
 'complexity_score': 3,
 'image_description': 'Same corner-shaped block with 135° rotation indicator.'
 }
 ])
 order += 2

 # === HARD LEVEL (8 questions from 3 base images) ===

 # Image 10: Complex Asymmetric Assembly (3 variations)
 questions.extend([
 {
 'order': order,
 'text': 'Which option shows this complex asymmetric assembly rotated 60° clockwise?',
 'context': 'This object has multiple protruding elements and no symmetry planes.',
 'options': [
 'Assembly correctly rotated 60° clockwise',
 'Assembly rotated 90° clockwise instead',
 'Assembly rotated 30° clockwise instead',
 'Assembly mirrored instead of rotated'
 ],
 'correct_answer': 'A',
 'explanation': '60° clockwise rotation maintains all relative positions of the complex asymmetric features.',
 'difficulty': 'hard',
 'base_image_id': 'MR_complex_asymmetric_01',
 'overlay_ids': ['rotation_arrow_60cw'],
 'transforms': {'main': {'rotation': 0}},
 'visual_style': 'technical_3d',
 'complexity_score': 5,
 'image_description': 'Complex asymmetric assembly: 7-8 cubes arranged in irregular pattern with extensions in multiple directions. No symmetry. Has distinguishable features like overhangs, gaps, and unique orientations. Blue color, isometric view.'
 },
 {
 'order': order + 1,
 'text': 'After rotating this complex assembly 150° clockwise, what orientation appears?',
 'context': '150° is between 135° and 180° rotation.',
 'options': [
 'Assembly at 150° clockwise position with all features correctly placed',
 'Assembly at 135° clockwise position',
 'Assembly at 180° clockwise position',
 'Assembly at 120° clockwise position'
 ],
 'correct_answer': 'A',
 'explanation': '150° clockwise rotation places the complex assembly in the correct orientation with all asymmetric features properly positioned.',
 'difficulty': 'hard',
 'base_image_id': 'MR_complex_asymmetric_01',
 'overlay_ids': ['rotation_arrow_150cw'],
 'transforms': {'main': {'rotation': 0}},
 'visual_style': 'technical_3d',
 'complexity_score': 5,
 'image_description': 'Same complex asymmetric assembly with 150° rotation indicator.'
 },
 {
 'order': order + 2,
 'text': 'Which option represents this complex assembly after 75° counter-clockwise rotation?',
 'context': '75° creates a specific diagonal orientation with subtle differences.',
 'options': [
 'Assembly at 75° counter-clockwise with proper feature alignment',
 'Assembly at 90° counter-clockwise',
 'Assembly at 60° counter-clockwise',
 'Assembly at 45° counter-clockwise'
 ],
 'correct_answer': 'A',
 'explanation': '75° counter-clockwise rotation creates the correct diagonal orientation with all complex features in their proper relative positions.',
 'difficulty': 'hard',
 'base_image_id': 'MR_complex_asymmetric_01',
 'overlay_ids': ['rotation_arrow_75ccw'],
 'transforms': {'main': {'rotation': 0}},
 'visual_style': 'technical_3d',
 'complexity_score': 5,
 'image_description': 'Same complex asymmetric assembly with 75° counter-clockwise rotation indicator.'
 }
 ])
 order += 3

 # Image 11: Interlocked Structure (3 variations)
 questions.extend([
 {
 'order': order,
 'text': 'Which option shows this interlocked structure rotated 120° clockwise?',
 'context': 'The structure has interlocking parts that create a complex 3D relationship.',
 'options': [
 'Structure correctly rotated 120° with interlocks maintained',
 'Structure rotated 90° instead of 120°',
 'Structure rotated 135° instead of 120°',
 'Structure with interlocks separated (incorrect)'
 ],
 'correct_answer': 'A',
 'explanation': '120° clockwise rotation maintains the interlocked relationship while correctly positioning the entire structure.',
 'difficulty': 'hard',
 'base_image_id': 'MR_interlocked_01',
 'overlay_ids': ['rotation_arrow_120cw'],
 'transforms': {'main': {'rotation': 0}},
 'visual_style': 'technical_3d',
 'complexity_score': 5,
 'image_description': 'Interlocked structure: 6-7 cubes arranged so that parts appear to pass through or interlock with each other. Creates visual complexity with overlapping/intersecting elements. Blue color, isometric view.'
 },
 {
 'order': order + 1,
 'text': 'After a 240° clockwise rotation of this interlocked structure, what do you observe?',
 'context': '240° clockwise equals 120° counter-clockwise.',
 'options': [
 'Structure at 240° clockwise with interlocks properly maintained',
 'Structure at 180° clockwise',
 'Structure at 270° clockwise',
 'Structure with broken interlocking relationship'
 ],
 'correct_answer': 'A',
 'explanation': '240° clockwise rotation (equivalent to 120° counter-clockwise) correctly positions the interlocked structure.',
 'difficulty': 'hard',
 'base_image_id': 'MR_interlocked_01',
 'overlay_ids': ['rotation_arrow_240cw'],
 'transforms': {'main': {'rotation': 0}},
 'visual_style': 'technical_3d',
 'complexity_score': 5,
 'image_description': 'Same interlocked structure with 240° rotation indicator.'
 }
 ])
 order += 2

 # Image 12: Multi-Directional Extension (3 variations)
 questions.extend([
 {
 'order': order,
 'text': 'Which option shows this multi-directional object rotated 30° clockwise?',
 'context': 'The object has extensions pointing in multiple directions from a central core.',
 'options': [
 'Object rotated 30° with all extensions correctly oriented',
 'Object rotated 45° instead of 30°',
 'Object rotated 60° instead of 30°',
 'Object with some extensions missing or misoriented'
 ],
 'correct_answer': 'A',
 'explanation': '30° clockwise rotation maintains all directional extensions in their correct relative positions.',
 'difficulty': 'hard',
 'base_image_id': 'MR_multi_directional_01',
 'overlay_ids': ['rotation_arrow_30cw'],
 'transforms': {'main': {'rotation': 0}},
 'visual_style': 'technical_3d',
 'complexity_score': 4,
 'image_description': 'Multi-directional object: Central core (2-3 cubes) with single-cube extensions pointing in 4 different directions (up, down, left, right, forward, back). Creates star-like or cross-like 3D pattern. Blue color, isometric view.'
 },
 {
 'order': order + 1,
 'text': 'After rotating this multi-directional object 210° clockwise, which result appears?',
 'context': '210° is between 180° and 270° rotation.',
 'options': [
 'Object at 210° clockwise with all extensions properly positioned',
 'Object at 180° clockwise',
 'Object at 270° clockwise',
 'Object at 225° clockwise'
 ],
 'correct_answer': 'A',
 'explanation': '210° clockwise rotation correctly positions the multi-directional object with all extensions in their proper orientations.',
 'difficulty': 'hard',
 'base_image_id': 'MR_multi_directional_01',
 'overlay_ids': ['rotation_arrow_210cw'],
 'transforms': {'main': {'rotation': 0}},
 'visual_style': 'technical_3d',
 'complexity_score': 4,
 'image_description': 'Same multi-directional object with 210° rotation indicator.'
 },
 {
 'order': order + 2,
 'text': 'Which option represents this multi-directional object after 105° counter-clockwise rotation?',
 'context': '105° creates a precise angular position between major rotation points.',
 'options': [
 'Object at 105° counter-clockwise with extensions correctly aligned',
 'Object at 90° counter-clockwise',
 'Object at 120° counter-clockwise',
 'Object at 135° counter-clockwise'
 ],
 'correct_answer': 'A',
 'explanation': '105° counter-clockwise rotation places the multi-directional object in the correct position with all extensions properly oriented.',
 'difficulty': 'hard',
 'base_image_id': 'MR_multi_directional_01',
 'overlay_ids': ['rotation_arrow_105ccw'],
 'transforms': {'main': {'rotation': 0}},
 'visual_style': 'technical_3d',
 'complexity_score': 4,
 'image_description': 'Same multi-directional object with 105° counter-clockwise rotation indicator.'
 }
 ])
 order += 3

 # === EXPERT LEVEL (5 questions from 2 base images) ===

 # Image 13: Abstract Spatial Assembly (3 variations)
 questions.extend([
 {
 'order': order,
 'text': 'Which option shows this abstract spatial assembly rotated 72° clockwise?',
 'context': 'This assembly has a complex spatial relationship with no obvious symmetry or repetition.',
 'options': [
 'Assembly correctly rotated 72° clockwise with all spatial relationships preserved',
 'Assembly rotated 60° clockwise instead',
 'Assembly rotated 90° clockwise instead',
 'Assembly with altered spatial relationships (incorrect)'
 ],
 'correct_answer': 'A',
 'explanation': '72° clockwise rotation maintains all complex spatial relationships in this abstract assembly.',
 'difficulty': 'hard',
 'base_image_id': 'MR_abstract_assembly_01',
 'overlay_ids': ['rotation_arrow_72cw'],
 'transforms': {'main': {'rotation': 0}},
 'visual_style': 'technical_3d',
 'complexity_score': 5,
 'image_description': 'Abstract spatial assembly: 8-10 cubes arranged in highly complex, non-intuitive pattern. May have gaps, overhangs, and spatial relationships that challenge perception. No obvious symmetry or pattern. Blue color, isometric view.'
 },
 {
 'order': order + 1,
 'text': 'After a 288° clockwise rotation of this abstract assembly, what orientation results?',
 'context': '288° clockwise equals 72° counter-clockwise.',
 'options': [
 'Assembly at 288° clockwise with complex spatial features intact',
 'Assembly at 270° clockwise',
 'Assembly at 300° clockwise',
 'Assembly with disrupted spatial relationships'
 ],
 'correct_answer': 'A',
 'explanation': '288° clockwise rotation (equivalent to 72° counter-clockwise) correctly preserves all abstract spatial relationships.',
 'difficulty': 'hard',
 'base_image_id': 'MR_abstract_assembly_01',
 'overlay_ids': ['rotation_arrow_288cw'],
 'transforms': {'main': {'rotation': 0}},
 'visual_style': 'technical_3d',
 'complexity_score': 5,
 'image_description': 'Same abstract spatial assembly with 288° rotation indicator.'
 },
 {
 'order': order + 2,
 'text': 'Which option represents this abstract assembly after 144° counter-clockwise rotation?',
 'context': '144° creates a complex angular position requiring precise spatial visualization.',
 'options': [
 'Assembly at 144° counter-clockwise with all features correctly positioned',
 'Assembly at 135° counter-clockwise',
 'Assembly at 150° counter-clockwise',
 'Assembly at 180° counter-clockwise'
 ],
 'correct_answer': 'A',
 'explanation': '144° counter-clockwise rotation accurately positions this complex abstract assembly while maintaining all spatial relationships.',
 'difficulty': 'hard',
 'base_image_id': 'MR_abstract_assembly_01',
 'overlay_ids': ['rotation_arrow_144ccw'],
 'transforms': {'main': {'rotation': 0}},
 'visual_style': 'technical_3d',
 'complexity_score': 5,
 'image_description': 'Same abstract spatial assembly with 144° counter-clockwise rotation indicator.'
 }
 ])
 order += 3

 # Image 14: Irregular Polyomino (2 variations)
 questions.extend([
 {
 'order': order,
 'text': 'Which option shows this irregular polyomino rotated 108° clockwise?',
 'context': 'This polyomino has an irregular shape with multiple protruding segments.',
 'options': [
 'Polyomino correctly rotated 108° clockwise',
 'Polyomino rotated 90° clockwise instead',
 'Polyomino rotated 120° clockwise instead',
 'Polyomino rotated 135° clockwise instead'
 ],
 'correct_answer': 'A',
 'explanation': '108° clockwise rotation correctly positions the irregular polyomino with all segments properly oriented.',
 'difficulty': 'hard',
 'base_image_id': 'MR_irregular_polyomino_01',
 'overlay_ids': ['rotation_arrow_108cw'],
 'transforms': {'main': {'rotation': 0}},
 'visual_style': 'technical_3d',
 'complexity_score': 5,
 'image_description': 'Irregular polyomino: 9-10 cubes connected in complex, irregular pattern. Has multiple branches, turns, and unique spatial configuration that makes rotation challenging to visualize. Blue color, isometric view.'
 },
 {
 'order': order + 1,
 'text': 'After rotating this irregular polyomino 252° clockwise, which result do you observe?',
 'context': '252° clockwise equals 108° counter-clockwise.',
 'options': [
 'Polyomino at 252° clockwise with all segments correctly arranged',
 'Polyomino at 270° clockwise',
 'Polyomino at 225° clockwise',
 'Polyomino at 240° clockwise'
 ],
 'correct_answer': 'A',
 'explanation': '252° clockwise rotation (equivalent to 108° counter-clockwise) accurately positions the irregular polyomino.',
 'difficulty': 'hard',
 'base_image_id': 'MR_irregular_polyomino_01',
 'overlay_ids': ['rotation_arrow_252cw'],
 'transforms': {'main': {'rotation': 0}},
 'visual_style': 'technical_3d',
 'complexity_score': 5,
 'image_description': 'Same irregular polyomino with 252° rotation indicator.'
 }
 ])
 order += 2

 return questions
