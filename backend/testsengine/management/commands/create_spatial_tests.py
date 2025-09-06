from django.core.management.base import BaseCommand
from testsengine.models import Test, Question

class Command(BaseCommand):
    help = 'Create spatial reasoning tests'
    
    def handle(self, *args, **options):
        # Create the Spatial Reasoning Test
        test, created = Test.objects.get_or_create(
            title="Spatial Reasoning Assessment",
            test_type="spatial_reasoning",
            defaults={
                'description': "Assess candidate's ability to visualize and manipulate objects in three-dimensional space. Measures spatial visualization, mental rotation abilities, and 3D problem-solving skills.",
                'duration_minutes': 20,
                'total_questions': 18,
                'passing_score': 70,
                'is_active': True
            }
        )
        
        if created:
            self.stdout.write(self.style.SUCCESS(f'Created test: {test.title}'))
        else:
            self.stdout.write(self.style.WARNING(f'Test already exists: {test.title}'))
            
        # Clear existing questions for this test
        Question.objects.filter(test=test).delete()
        
        questions_data = [
            # Mental Rotation Questions
            {
                "question_type": "mental_rotation",
                "question_text": "Which option shows the same 3D object rotated 90° clockwise around the vertical axis?",
                "passage": None,
                "context": "You are shown a 3D block structure from one angle. Your task is to identify which of the four options shows the same structure after a specific rotation.",
                "options": [
                    "Option A: Block structure with front face showing squares",
                    "Option B: Block structure with side face showing rectangles", 
                    "Option C: Block structure with back face showing triangles",
                    "Option D: Block structure with different configuration"
                ],
                "correct_answer": "B",
                "explanation": "When rotating 90° clockwise around the vertical axis, the front face moves to the right side position.",
                "difficulty_level": "easy",
                "order": 1
            },
            {
                "question_type": "mental_rotation",
                "question_text": "After rotating this L-shaped object 180° around its center point, which view would you see?",
                "passage": None,
                "context": "Consider an L-shaped 3D object viewed from above. You need to mentally rotate it and identify the correct resulting view.",
                "options": [
                    "Option A: L-shape pointing up-right",
                    "Option B: L-shape pointing down-left",
                    "Option C: L-shape pointing up-left", 
                    "Option D: L-shape pointing down-right"
                ],
                "correct_answer": "B",
                "explanation": "A 180° rotation around the center point flips the L-shape to point in the opposite direction.",
                "difficulty_level": "medium",
                "order": 2
            },
            
            # Paper Folding Questions
            {
                "question_type": "paper_folding",
                "question_text": "A square sheet of paper is folded in half twice, then two holes are punched through all layers. When unfolded, how many holes will appear?",
                "passage": None,
                "context": "Paper folding questions test your ability to visualize the effects of folding and punching on a flat sheet.",
                "options": [
                    "4 holes",
                    "6 holes",
                    "8 holes",
                    "12 holes"
                ],
                "correct_answer": "C",
                "explanation": "Folding twice creates 4 layers. Two punches through 4 layers = 8 holes total when unfolded.",
                "difficulty_level": "easy", 
                "order": 3
            },
            {
                "question_type": "paper_folding",
                "question_text": "A rectangular paper is folded along its diagonal, then folded in half again. Three circular holes are punched. How many holes appear when completely unfolded?",
                "passage": None,
                "context": "This involves a more complex folding pattern with diagonal and perpendicular folds.",
                "options": [
                    "6 holes",
                    "9 holes", 
                    "12 holes",
                    "15 holes"
                ],
                "correct_answer": "C",
                "explanation": "Diagonal fold + half fold creates 4 layers. Three punches through 4 layers = 12 holes when unfolded.",
                "difficulty_level": "medium",
                "order": 4
            },
            
            # Cross-sections Questions
            {
                "question_type": "cross_sections",
                "question_text": "What shape would result from cutting a cylinder with a plane at 45° to its base?",
                "passage": None,
                "context": "Cross-section questions test your ability to visualize the 2D shapes created when 3D objects are cut by planes.",
                "options": [
                    "Circle",
                    "Ellipse",
                    "Rectangle", 
                    "Triangle"
                ],
                "correct_answer": "B",
                "explanation": "Cutting a cylinder at an angle produces an elliptical cross-section.",
                "difficulty_level": "easy",
                "order": 5
            },
            {
                "question_type": "cross_sections",
                "question_text": "A cube is cut by a plane passing through opposite edges. What is the shape of the cross-section?",
                "passage": None,
                "context": "Consider a plane cutting through a cube from one edge to the opposite edge.",
                "options": [
                    "Square",
                    "Rectangle",
                    "Hexagon",
                    "Triangle"
                ],
                "correct_answer": "B",
                "explanation": "A plane through opposite edges of a cube creates a rectangular cross-section.",
                "difficulty_level": "medium",
                "order": 6
            },
            
            # Spatial Transformation Questions
            {
                "question_type": "spatial_transformation",
                "question_text": "If you flip this asymmetric shape horizontally and then rotate it 90° counterclockwise, which option shows the result?",
                "passage": None,
                "context": "This question combines multiple transformations: reflection followed by rotation.",
                "options": [
                    "Shape oriented top-left",
                    "Shape oriented top-right",
                    "Shape oriented bottom-left",
                    "Shape oriented bottom-right"
                ],
                "correct_answer": "A",
                "explanation": "Horizontal flip followed by 90° counterclockwise rotation results in top-left orientation.",
                "difficulty_level": "medium",
                "order": 7
            },
            {
                "question_type": "spatial_transformation",
                "question_text": "A 3D object is reflected across a vertical plane and then scaled down by 50%. Which transformation property is preserved?",
                "passage": None,
                "context": "Understanding how different transformations affect object properties.",
                "options": [
                    "Absolute size",
                    "Shape proportions",
                    "Orientation",
                    "Position"
                ],
                "correct_answer": "B",
                "explanation": "Shape proportions remain unchanged during reflection and uniform scaling.",
                "difficulty_level": "hard",
                "order": 8
            },
            
            # Perspective Changes Questions
            {
                "question_type": "perspective_changes",
                "question_text": "A house is viewed from the south. If you move to view it from the northeast, which face becomes most prominent?",
                "passage": None,
                "context": "Understanding how perspective changes affect what parts of objects are visible.",
                "options": [
                    "South face",
                    "East face", 
                    "West face",
                    "North face"
                ],
                "correct_answer": "B",
                "explanation": "From northeast perspective, the east face becomes most prominent in the view.",
                "difficulty_level": "easy",
                "order": 9
            },
            {
                "question_type": "perspective_changes",
                "question_text": "An L-shaped building viewed from above shows both arms clearly. From which ground-level viewpoint would you see the least of the building?",
                "passage": None,
                "context": "Consider how ground-level perspective limits visibility compared to aerial view.",
                "options": [
                    "From the corner where arms meet",
                    "From the end of the longer arm",
                    "From the end of the shorter arm", 
                    "From 45° to the corner"
                ],
                "correct_answer": "A",
                "explanation": "Standing at the corner where arms meet provides the most obstructed view.",
                "difficulty_level": "medium",
                "order": 10
            },
            
            # Additional Complex Questions
            {
                "question_type": "mental_rotation",
                "question_text": "This 3D puzzle piece needs to fit into a specific slot. After rotating it 270° clockwise around the Z-axis, will it fit?",
                "passage": None,
                "context": "Complex rotation problem involving fitting pieces together.",
                "options": [
                    "Yes, it will fit perfectly",
                    "No, it needs additional rotation",
                    "No, it needs to be flipped first",
                    "Cannot determine from given information"
                ],
                "correct_answer": "A",
                "explanation": "270° clockwise rotation around Z-axis aligns the piece correctly with the slot.",
                "difficulty_level": "hard",
                "order": 11
            },
            {
                "question_type": "spatial_transformation",
                "question_text": "A complex 3D shape undergoes: 1) 180° rotation around X-axis, 2) reflection across XY-plane, 3) 90° rotation around Z-axis. What is the net effect?",
                "passage": None,
                "context": "Multi-step transformation requiring composition of rotations and reflections.",
                "options": [
                    "Equivalent to 90° rotation around Z-axis only",
                    "Equivalent to 270° rotation around Z-axis only", 
                    "Equivalent to reflection across XZ-plane",
                    "Equivalent to 180° rotation around Y-axis"
                ],
                "correct_answer": "B",
                "explanation": "The combination of transformations simplifies to a 270° rotation around the Z-axis.",
                "difficulty_level": "hard",
                "order": 12
            },
            {
                "question_type": "cross_sections",
                "question_text": "A cone is cut by a plane parallel to its base but closer to the apex. The resulting cross-section is:",
                "passage": None,
                "context": "Understanding how cutting planes affect different 3D shapes.",
                "options": [
                    "A smaller circle",
                    "An ellipse",
                    "A parabola",
                    "A triangle"
                ],
                "correct_answer": "A",
                "explanation": "A plane parallel to the base of a cone always produces a circular cross-section, smaller when closer to apex.",
                "difficulty_level": "easy",
                "order": 13
            },
            {
                "question_type": "paper_folding",
                "question_text": "A hexagonal paper is folded along three alternate vertices to the center. How many layers thick is the resulting shape at the center?",
                "passage": None,
                "context": "Complex folding pattern with hexagonal geometry.",
                "options": [
                    "3 layers",
                    "4 layers",
                    "6 layers",
                    "7 layers"
                ],
                "correct_answer": "D",
                "explanation": "Folding three alternate vertices creates 6 additional layers plus the original base = 7 layers total.",
                "difficulty_level": "hard",
                "order": 14
            },
            {
                "question_type": "perspective_changes",
                "question_text": "A stepped pyramid has 4 levels. When viewed from directly above one corner, how many levels are visible?",
                "passage": None,
                "context": "Understanding occlusion in 3D viewing from specific angles.",
                "options": [
                    "1 level",
                    "2 levels",
                    "3 levels", 
                    "4 levels"
                ],
                "correct_answer": "D",
                "explanation": "From directly above a corner, all 4 levels of the stepped pyramid are visible in sequence.",
                "difficulty_level": "medium",
                "order": 15
            },
            {
                "question_type": "mental_rotation", 
                "question_text": "Two interlocking gears are shown. If the left gear rotates 90° clockwise, how much does the right gear rotate?",
                "passage": None,
                "context": "Mechanical reasoning combined with spatial visualization.",
                "options": [
                    "90° clockwise",
                    "90° counterclockwise",
                    "45° counterclockwise",
                    "180° counterclockwise"
                ],
                "correct_answer": "B",
                "explanation": "Interlocking gears rotate in opposite directions. If left goes 90° clockwise, right goes 90° counterclockwise.",
                "difficulty_level": "medium",
                "order": 16
            },
            {
                "question_type": "spatial_transformation",
                "question_text": "A wireframe cube is stretched along one axis by factor 2, then compressed along another axis by factor 0.5. What is the volume ratio?",
                "passage": None,
                "context": "Quantitative spatial reasoning involving volume calculations.",
                "options": [
                    "1:1 (unchanged)",
                    "2:1 (doubled)",
                    "1:2 (halved)",
                    "4:1 (quadrupled)"
                ],
                "correct_answer": "A",
                "explanation": "Stretch by 2 along one axis and compress by 0.5 along another: 2 × 0.5 × 1 = 1 (unchanged volume).",
                "difficulty_level": "hard",
                "order": 17
            },
            {
                "question_type": "cross_sections",
                "question_text": "A sphere intersected by two perpendicular planes creates what type of intersection curve?",
                "passage": None,
                "context": "Advanced geometry involving intersection of multiple cutting planes.",
                "options": [
                    "Two separate circles",
                    "Two intersecting circles",
                    "An ellipse and a circle",
                    "Two intersecting ellipses"
                ],
                "correct_answer": "B",
                "explanation": "Two perpendicular planes through a sphere create two intersecting circles that meet along their common diameter.",
                "difficulty_level": "hard",
                "order": 18
            }
        ]
        
        # Create questions
        for q_data in questions_data:
            question = Question.objects.create(
                test=test,
                **q_data
            )
            self.stdout.write(f'Created question {question.order}: {question.question_text[:50]}...')
            
        self.stdout.write(
            self.style.SUCCESS(f'Successfully created {len(questions_data)} spatial reasoning questions')
        )
