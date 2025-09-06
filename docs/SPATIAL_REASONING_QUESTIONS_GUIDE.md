# Spatial Reasoning Questions Guide

## Overview
This guide provides comprehensive instructions for creating spatial reasoning questions with accompanying visual content for the JobGate Career Quest assessment platform.

## Table of Contents
1. [Question Categories](#question-categories)
2. [Question Format Structure](#question-format-structure)
3. [Database Integration](#database-integration)
4. [Visual Content Requirements](#visual-content-requirements)
5. [AI Prompts for Image Generation](#ai-prompts-for-image-generation)
6. [Question Examples](#question-examples)
7. [Implementation Guidelines](#implementation-guidelines)

---

## Question Categories

### 1. Mental Rotation
**Purpose:** Test ability to mentally rotate 3D objects in space.
**Skills Assessed:** Spatial visualization, object orientation, 3D reasoning

### 2. Paper Folding/Unfolding
**Purpose:** Assess understanding of folding patterns and spatial transformations.
**Skills Assessed:** Pattern recognition, spatial memory, geometric reasoning

### 3. Cross-Sections
**Purpose:** Test ability to visualize internal structure and slicing planes.
**Skills Assessed:** 3D visualization, geometric understanding, analytical thinking

### 4. Spatial Transformation
**Purpose:** Assess understanding of scaling, stretching, and deformation.
**Skills Assessed:** Proportional reasoning, transformation understanding, spatial mathematics

### 5. Perspective Changes
**Purpose:** Test ability to visualize objects from different viewpoints.
**Skills Assessed:** Perspective understanding, viewpoint transformation, spatial orientation

---

## Question Format Structure

### Database Schema
```json
{
  "id": "integer",
  "test_id": "foreign_key",
  "question_type": "enum[mental_rotation, paper_folding, cross_sections, spatial_transformation, perspective_changes]",
  "question_text": "string",
  "context": "string (optional)",
  "visual_content": {
    "main_image": "url/path",
    "option_images": ["url/path_A", "url/path_B", "url/path_C", "url/path_D"],
    "sequence_images": ["url/path_1", "url/path_2", "url/path_3"] // for folding questions
  },
  "options": ["Option A text", "Option B text", "Option C text", "Option D text"],
  "correct_answer": "A|B|C|D",
  "explanation": "string",
  "difficulty_level": "easy|medium|hard",
  "order": "integer"
}
```

### Extended Question Model
```python
# Additional fields to add to the Question model
class Question(models.Model):
    # ... existing fields ...
    
    # Visual content fields
    main_image = models.URLField(blank=True, null=True)
    option_images = models.JSONField(default=list)  # Store URLs for A, B, C, D options
    sequence_images = models.JSONField(default=list)  # For step-by-step visuals
    
    # Metadata
    visual_style = models.CharField(max_length=50, default='3d_render')  # 3d_render, diagram, wireframe
    complexity_score = models.IntegerField(default=1)  # 1-5 complexity rating
```

---

## Visual Content Requirements

### Image Specifications
- **Format:** PNG with transparent background
- **Resolution:** 800x600px minimum
- **Style:** Clean, technical 3D renders or diagrams
- **Color Scheme:** Professional blue/gray palette with color coding for different elements

### Visual Elements
1. **3D Objects:** Isometric or perspective views
2. **Rotation Indicators:** Arrows showing rotation direction and angle
3. **Folding Lines:** Dashed lines for fold patterns
4. **Cross-section Planes:** Semi-transparent cutting planes
5. **Grid References:** Optional coordinate systems for complex questions

### Accessibility
- High contrast for colorblind users
- Clear, unambiguous shapes
- Consistent lighting and shadows
- Text labels where necessary

---

## AI Prompts for Image Generation

### 1. Mental Rotation Questions

#### Prompt Template:
```
Create a technical 3D illustration showing:
- A {OBJECT_DESCRIPTION} rendered in isometric view
- Clean, professional style with soft shadows
- Object colored in medium blue (#4A90E2)
- White/transparent background
- High contrast for clarity
- {SPECIFIC_DETAILS}

Style: Technical illustration, CAD-like rendering, clean lines, minimal shadows
```

#### Example Prompts:

**Basic L-Shape Rotation:**
```
Create a technical 3D illustration showing:
- An L-shaped block structure made of 3 connected cubes
- Isometric view from upper-right perspective
- Each cube is 1x1x1 units
- L-shape with long arm horizontal (3 cubes), short arm vertical (1 cube up)
- Rendered in medium blue (#4A90E2) with subtle edge highlighting
- Clean white background
- Soft ambient lighting with minimal shadows

Style: Technical CAD illustration, clean geometric forms
```

**Complex Mechanical Part:**
```
Create a technical 3D illustration showing:
- A mechanical bracket with cylindrical holes and angular cuts
- Main body 4x2x1 units with two circular holes (diameter 0.5 units)
- One angled cut at 45 degrees on the top-right corner
- Material: brushed metal appearance in blue-gray
- Isometric view showing top, front, and right sides
- Technical drawing style with clean edges and precise geometry

Style: Engineering technical illustration, CAD rendering
```

### 2. Paper Folding Questions

#### Sequence Prompts:
```
Create a sequence of 4 technical illustrations showing paper folding:

Frame 1: Flat square paper (4x4 units) with fold line marked as red dashed line
Frame 2: Paper partially folded along the line (45-degree angle)
Frame 3: Paper completely folded (two layers visible)
Frame 4: Circular hole punched through both layers (0.5 unit diameter)

Style: Clean diagram style, paper in light gray, fold lines in red, consistent lighting
```

### 3. Cross-Section Questions

#### Cube Cross-Section:
```
Create a technical illustration showing:
- A transparent cube (2x2x2 units) in light blue
- A yellow cutting plane passing diagonally from top-front-left to bottom-back-right
- The cross-section highlighted in bright yellow
- Isometric view clearly showing the triangular cross-section
- Grid lines on cube faces for reference

Style: Technical diagram, semi-transparent materials, clear color coding
```

### 4. Spatial Transformation Questions

#### Stretching Transformation:
```
Create a before/after technical illustration showing:
- Before: Regular cylinder (height 2 units, diameter 2 units)
- Arrow indicating "stretch vertically 2x"
- After: Stretched cylinder (height 4 units, diameter 2 units)
- Both cylinders in blue with measurement annotations
- Side-by-side comparison view

Style: Technical diagram with measurement annotations
```

### 5. Perspective Change Questions

#### Building Views:
```
Create 4 technical illustrations of the same L-shaped building:
- View 1: North side (front elevation)
- View 2: East side (right elevation)  
- View 3: South side (back elevation)
- View 4: West side (left elevation)
- Building: 3-story main section, 2-story wing
- Simple architectural style, consistent lighting

Style: Architectural elevation drawings, clean lines, professional presentation
```

---

## Question Examples

### Example 1: Basic Mental Rotation

**Question Text:** "The 3D object shown is rotated 90° clockwise around the vertical axis. Which option shows the result?"

**Context:** "Study the L-shaped block structure. Pay attention to the orientation of the long and short arms."

**Visual Content:**
- Main image: L-shape with long arm pointing right, short arm pointing up
- Option A: Long arm pointing down, short arm pointing right ✓
- Option B: Long arm pointing left, short arm pointing down
- Option C: Long arm pointing up, short arm pointing left
- Option D: Same as original

**Database Entry:**
```json
{
  "question_type": "mental_rotation",
  "question_text": "The 3D object shown is rotated 90° clockwise around the vertical axis. Which option shows the result?",
  "context": "Study the L-shaped block structure. Pay attention to the orientation of the long and short arms.",
  "visual_content": {
    "main_image": "/images/spatial/l_shape_original.png",
    "option_images": [
      "/images/spatial/l_shape_option_a.png",
      "/images/spatial/l_shape_option_b.png", 
      "/images/spatial/l_shape_option_c.png",
      "/images/spatial/l_shape_option_d.png"
    ]
  },
  "options": [
    "Option A",
    "Option B", 
    "Option C",
    "Option D"
  ],
  "correct_answer": "A",
  "explanation": "A 90° clockwise rotation around the vertical axis moves the long arm from pointing right to pointing down, and the short arm from pointing up to pointing right.",
  "difficulty_level": "easy"
}
```

### Example 2: Paper Folding

**Question Text:** "A square sheet is folded in half twice, then a circular hole is punched through all layers. How will the paper look when unfolded?"

**Visual Content:**
- Sequence: flat paper → first fold → second fold → punch hole
- Options show different unfolded patterns

**Database Entry:**
```json
{
  "question_type": "paper_folding",
  "question_text": "A square sheet is folded in half twice, then a circular hole is punched through all layers. How will the paper look when unfolded?",
  "visual_content": {
    "sequence_images": [
      "/images/spatial/paper_step1.png",
      "/images/spatial/paper_step2.png",
      "/images/spatial/paper_step3.png",
      "/images/spatial/paper_step4.png"
    ],
    "option_images": [
      "/images/spatial/paper_result_a.png",
      "/images/spatial/paper_result_b.png",
      "/images/spatial/paper_result_c.png", 
      "/images/spatial/paper_result_d.png"
    ]
  },
  "options": [
    "4 holes in a square pattern",
    "2 holes side by side", 
    "8 holes in two rows",
    "1 hole in center"
  ],
  "correct_answer": "A",
  "explanation": "Two folds create 4 layers. One punch creates 4 holes arranged in a square when unfolded.",
  "difficulty_level": "medium"
}
```

### Example 3: Cross-Section

**Question Text:** "What shape is created when this cube is cut by the plane shown?"

**Visual Content:**
- Main image: Cube with diagonal cutting plane
- Options show different 2D shapes

**Database Entry:**
```json
{
  "question_type": "cross_sections", 
  "question_text": "What shape is created when this cube is cut by the plane shown?",
  "visual_content": {
    "main_image": "/images/spatial/cube_diagonal_cut.png",
    "option_images": [
      "/images/spatial/triangle_result.png",
      "/images/spatial/square_result.png",
      "/images/spatial/hexagon_result.png",
      "/images/spatial/pentagon_result.png"
    ]
  },
  "options": [
    "Triangle",
    "Square",
    "Hexagon", 
    "Pentagon"
  ],
  "correct_answer": "A",
  "explanation": "A diagonal plane through a cube from one corner to the opposite corner creates a triangular cross-section.",
  "difficulty_level": "medium"
}
```

---

## Implementation Guidelines

### 1. Image Management
```python
# Image handling utility
class SpatialImageManager:
    @staticmethod
    def upload_question_images(question_id, images):
        """Upload and organize images for a spatial reasoning question"""
        base_path = f"/media/spatial_questions/{question_id}/"
        
        # Create directories
        os.makedirs(f"{base_path}/main", exist_ok=True)
        os.makedirs(f"{base_path}/options", exist_ok=True)
        os.makedirs(f"{base_path}/sequence", exist_ok=True)
        
        # Process and save images
        # Return URL paths for database storage
```

### 2. Question Creation Workflow

1. **Design Question Logic**
   - Define spatial concept to test
   - Create mathematical/geometric foundation
   - Plan visual elements needed

2. **Generate Visual Content**
   - Use AI prompts to create main images
   - Generate option images (3 distractors + 1 correct)
   - Create sequence images if needed

3. **Validate Content**
   - Check visual clarity and contrast
   - Verify geometric accuracy
   - Test with sample users

4. **Database Integration**
   - Upload images to media storage
   - Create question record with image URLs
   - Set difficulty and metadata

### 3. Frontend Integration

```jsx
// SpatialQuestion component enhancement
const SpatialQuestion = ({ question }) => {
  return (
    <div className="spatial-question">
      {/* Main visual */}
      {question.visual_content.main_image && (
        <div className="main-visual">
          <img src={question.visual_content.main_image} alt="Question visual" />
        </div>
      )}
      
      {/* Sequence for folding questions */}
      {question.visual_content.sequence_images?.length > 0 && (
        <div className="sequence-visual">
          {question.visual_content.sequence_images.map((img, idx) => (
            <img key={idx} src={img} alt={`Step ${idx + 1}`} />
          ))}
        </div>
      )}
      
      {/* Answer options with images */}
      <div className="options-grid">
        {question.options.map((option, idx) => (
          <div key={idx} className="option-card">
            {question.visual_content.option_images?.[idx] && (
              <img src={question.visual_content.option_images[idx]} alt={`Option ${String.fromCharCode(65 + idx)}`} />
            )}
            <span>{option}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
```

### 4. Quality Assurance Checklist

- [ ] Visual clarity at all screen sizes
- [ ] Geometric accuracy verified
- [ ] Correct answer validation
- [ ] Distractor plausibility
- [ ] Accessibility compliance
- [ ] Cross-browser testing
- [ ] Mobile responsiveness
- [ ] Loading performance optimization

---

## Difficulty Progression

### Easy (Beginner)
- Simple geometric shapes (cubes, L-shapes)
- Basic rotations (90°, 180°)
- Single transformations
- Clear visual differences in options

### Medium (Intermediate)  
- Complex multi-part objects
- Multiple transformations
- Perspective changes
- Subtle differences in options

### Hard (Advanced)
- Abstract geometric constructions
- Sequential transformations
- 4D projections
- Minimal visual cues

---

## Performance Metrics

Track question effectiveness:
- **Response Time:** Average time to answer
- **Accuracy Rate:** Percentage of correct answers
- **Discrimination Index:** How well question separates high/low performers
- **Distractor Analysis:** Which wrong options are chosen most often

---

## Future Enhancements

1. **Interactive 3D Models:** Allow users to rotate objects
2. **Animation Support:** Show transformations in motion
3. **Adaptive Difficulty:** Adjust based on user performance
4. **Personalized Feedback:** Detailed explanations with visuals
5. **VR Integration:** Immersive spatial reasoning assessment

---

## Question Distribution & Anti-Cheating Strategy

### 📊 **Total Questions Recommendation: 200-300 Questions**

#### **Distribution by Category (5 categories × 4 levels each)**

| Category | Easy | Medium | Hard | Expert | **Total** |
|----------|------|--------|------|--------|-----------|
| **Mental Rotation** | 12 | 10 | 8 | 5 | **35** |
| **Paper Folding** | 10 | 8 | 6 | 4 | **28** |
| **Cross-Sections** | 8 | 8 | 6 | 4 | **26** |
| **Spatial Transformation** | 8 | 6 | 6 | 4 | **24** |
| **Perspective Changes** | 6 | 6 | 4 | 3 | **19** |
| **TOTAL** | **44** | **38** | **30** | **20** | **132** |

### 🔄 **Anti-Cheating Strategy: Question Pool Multiplication**

To prevent cheating, create **2-3 variations** of each question:

- **Base Pool:** 132 questions
- **Variation Multiplier:** 2.5x
- **Total Question Bank:** 330 questions

### 📋 **Per-Test Distribution (16-20 questions per test)**

Each individual test session uses:
- **4 questions** from Mental Rotation (most important)
- **3-4 questions** from Paper Folding
- **3 questions** from Cross-Sections
- **3 questions** from Spatial Transformation
- **3 questions** from Perspective Changes

**Total per test:** 16-17 questions

### 🎯 **Question Variation Strategy**

#### **Level 1 (Easy) - 44 base questions → 110 total variations**
- Same geometric concept, different orientations
- Different colors/textures
- Mirrored versions
- Different object sizes

**Example Variations:**
```
Base: L-shape rotation 90° clockwise
Var 1: T-shape rotation 90° clockwise  
Var 2: L-shape rotation 90° counter-clockwise
Var 3: Reversed L-shape rotation 90° clockwise
```

#### **Level 2 (Medium) - 38 base questions → 95 total variations**
- More complex geometric shapes
- Different rotation angles (45°, 135°, etc.)
- Multiple transformation steps

#### **Level 3 (Hard) - 30 base questions → 75 total variations**
- Abstract compositions
- Combined transformations
- Perspective + rotation challenges

#### **Level 4 (Expert) - 20 base questions → 50 total variations**
- 4D projections
- Complex sequential operations
- Minimal visual difference options

### 🔒 **Cheating Prevention Measures**

#### **1. Question Pool Randomization**
```python
# Database query for test generation
def generate_spatial_test(difficulty_level, user_id):
    """Generate unique test avoiding recently used questions"""
    
    # Get user's question history (last 30 days)
    recent_questions = UserQuestionHistory.objects.filter(
        user_id=user_id,
        created_at__gte=timezone.now() - timedelta(days=30)
    ).values_list('question_id', flat=True)
    
    # Select random questions excluding recent ones
    available_questions = Question.objects.filter(
        test_type='spatial_reasoning',
        difficulty_level=difficulty_level
    ).exclude(id__in=recent_questions)
    
    # Random selection per category
    mental_rotation = available_questions.filter(
        question_type='mental_rotation'
    ).order_by('?')[:4]
    
    # ... repeat for other categories
```

#### **2. Dynamic Option Shuffling**
- Randomize A, B, C, D order for each user
- Track correct answer position changes
- Prevent pattern memorization

#### **3. Question Metadata Tracking**
```python
class QuestionUsage(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    test_session = models.ForeignKey(TestSession, on_delete=models.CASCADE)
    presented_at = models.DateTimeField(auto_now_add=True)
    answered_at = models.DateTimeField(null=True)
    time_spent = models.DurationField(null=True)
    
    # Prevent reuse within time window
    class Meta:
        unique_together = ['question', 'user', 'test_session']
```

### 📈 **Implementation Timeline**

#### **Phase 1: Core Questions (2-3 weeks)**
- Create 132 base questions
- Focus on quality and accuracy
- Validate with test users

#### **Phase 2: Variations (3-4 weeks)**
- Generate 2.5x variations per base question
- Automated variation tools where possible
- Quality assurance for each variation

#### **Phase 3: Integration (1 week)**
- Database population
- Frontend testing
- Anti-cheating system validation

### 💾 **Database Storage Strategy**

```sql
-- Optimized table structure
CREATE TABLE spatial_question_variants (
    id INTEGER PRIMARY KEY,
    base_question_id INTEGER REFERENCES spatial_questions(id),
    variation_type VARCHAR(50), -- 'rotation', 'mirror', 'scale', 'color'
    variant_number INTEGER,
    visual_content JSON,
    difficulty_modifier DECIMAL(2,1), -- ±0.1 to ±0.5 difficulty adjustment
    usage_count INTEGER DEFAULT 0,
    last_used TIMESTAMP,
    
    UNIQUE(base_question_id, variant_number)
);
```

### 🎲 **Question Selection Algorithm**

```python
def select_test_questions(user_id, difficulty='medium'):
    """Smart question selection to maximize variety"""
    
    # Priority factors
    factors = {
        'recency': 0.4,      # Avoid recently seen questions
        'usage_frequency': 0.3,  # Prefer less-used questions
        'difficulty_spread': 0.2,  # Mix difficulty within level
        'category_balance': 0.1   # Ensure category distribution
    }
    
    # Generate weighted random selection
    # Return 16-20 questions optimized for uniqueness
```

### 🏆 **Quality Assurance Targets**

- **Question Reuse Rate:** < 5% within 60 days per user
- **Variation Effectiveness:** > 95% statistical equivalence between variants
- **Loading Performance:** < 2 seconds for complete question set
- **Image Quality:** 100% accessibility compliance
- **Answer Accuracy:** > 99% verified correct answers

---

*This comprehensive approach ensures robust assessment while preventing cheating through smart question pool management and dynamic content delivery.*

---

## Image-Economy Strategy: Maximum Questions from Minimal Assets

### 🎯 **Strategic Overview**

Instead of creating 330+ unique images, this approach generates **320 delivered questions** from just **60 base images** using transforms, overlays, and semantic variants—drastically reducing production time while maintaining assessment quality and anti-cheating effectiveness.

### 📊 **Image-Economy Mathematics**

| Category | Base Images | Questions/Image | Delivered Questions |
|----------|-------------|-----------------|-------------------|
| **Mental Rotation** | 20 | 5-6 | 110 |
| **Paper Folding** | 10 | 5 | 50 |
| **Cross-Sections** | 12 | 5 | 60 |
| **Spatial Transformation** | 8 | 5 | 40 |
| **Perspective Changes** | 10 | 6 | 60 |
| **TOTAL** | **60** | **5.3 avg** | **320** |

**Result:** 320 unique assessment questions from only 60 rendered images + lightweight overlays.

### 🎨 **The Minimal Image Kit (Render Once Strategy)**

#### **Rendering Guidelines**
- **Format:** SVG preferred (lossless transforms) + PNG fallback (800x600px)
- **Background:** Transparent
- **Style:** Clean isometric, consistent lighting, blue/gray palette
- **Naming:** `{CategoryCode}_{ShapeOrConcept}_{Index}.{svg|png}`

#### **A) Mental Rotation (20 Base Images)**
```
Base Assets:
- 8 primitives: L, T, Z, U, step-stair-2, step-stair-3, polycube-A, polycube-B
- 12 asymmetrical solids (no bilateral symmetry), neutral orientation

Naming Convention:
MR_Lshape_01.svg, MR_Tshape_01.svg, MR_Zshape_01.svg, MR_Ushape_01.svg
MR_Stair2_01.svg, MR_Stair3_01.svg, MR_PolycubeA_01.svg, MR_PolycubeB_01.svg
MR_Asym1_01.svg through MR_Asym12_01.svg
```

#### **B) Paper Folding (10 Base Images)**
```
Base Assets:
- 5 fold patterns: vertical, horizontal, diagonal, combo-VH, combo-VV
- Store only: final folded stack + blank unfolded grid template

Naming Convention:
PF_foldV_final.svg, PF_foldH_final.svg, PF_foldDiag_final.svg
PF_foldVH_final.svg, PF_foldVV_final.svg, PF_grid_blank.svg
```

#### **C) Cross-Sections (12 Base Images)**
```
Base Assets:
- Basic: cube, cuboid, triangular prism, cylinder, cone, hexagonal prism
- Complex: composite solids with neutral cutting plane

Naming Convention:
CS_cube_iso.svg, CS_cuboid_iso.svg, CS_tri_prism_iso.svg
CS_cylinder_iso.svg, CS_cone_iso.svg, CS_hex_prism_iso.svg
CS_compA_iso.svg through CS_compF_iso.svg
```

#### **D) Spatial Transformations (8 Base Images)**
```
Base Assets:
- Transformation pairs: scale, stretch, shear, rotate, scale+rotate

Naming Convention:
ST_scale_pair.svg, ST_stretch_pair.svg, ST_shear_pair.svg
ST_rotate_pair.svg, ST_scale_rotate_pair.svg, ST_axis_change_pair.svg
ST_compA_pair.svg, ST_compB_pair.svg
```

#### **E) Perspective Changes (10 Base Images)**
```
Base Assets:
- 10 asymmetric "L-building" volumes (2-3 wings, varying heights)
- Plus elevation templates for orthographic projections

Naming Convention:
PV_buildA_iso.svg through PV_buildJ_iso.svg
PV_elev_template_front.svg, PV_elev_template_right.svg
PV_elev_template_back.svg, PV_elev_template_left.svg
```

### 🔧 **Overlay System (Lightweight Assets)**

#### **Overlay Categories**
```
Rotation Indicators:
arrow_90cw.svg, arrow_90ccw.svg, arrow_180.svg, arrow_45cw.svg

Mirror Axes:
mirror_axis_vertical.svg, mirror_axis_horizontal.svg, mirror_axis_diagonal.svg

Cutting Planes:
plane_diag_A.svg, plane_diag_B.svg, plane_horizontal.svg, plane_vertical.svg

Fold Markers:
fold_line_vertical.svg, fold_line_horizontal.svg, fold_line_diagonal.svg

Holes & Punches:
holes_corner.svg, holes_edge_mid.svg, holes_offcenter.svg, holes_4x4_grid.svg

Labels & Annotations:
label_north.svg, label_east.svg, label_south.svg, label_west.svg
dims_annot.svg, grid_4x4.svg, coord_system.svg
```

### 🎲 **Variant Generation Techniques**

#### **1. Prompt Re-targeting**
From the same base image, ask about:
- Different rotations: 90° cw / 90° ccw / 180°
- Different axes: vertical vs horizontal mirror
- Different views: top view vs front elevation
- Different properties: "Which is rotated?" vs "Which is mirrored?"

#### **2. Transform Pipeline**
```json
"transforms": {
  "rotate_deg": 90,        // 0, 90, 180, 270
  "mirror": "vertical",    // none, vertical, horizontal
  "crop": [x, y, w, h],   // focus on specific region
  "scale": 1.0            // zoom factor
}
```

#### **3. Option Remapping**
```json
"option_remap": [2, 0, 3, 1]  // A→C, B→A, C→D, D→B
"correct_answer_index": 0      // Before remapping
```

#### **4. Semantic Variants**
- **Target Change:** "Which is a mirror?" → "Which becomes the original after 90° rotation?"
- **Reference Frame:** "around vertical axis" vs "around the long arm axis"
- **Negative Questions:** "Which is NOT a rotation?" vs "Which IS a rotation?"

### 💾 **Enhanced Database Schema**

```python
# Extended Question model for image economy
class Question(models.Model):
    # ... existing fields ...
    
    # Image economy fields
    base_image_id = models.CharField(max_length=64, db_index=True)
    overlay_ids = models.JSONField(default=list)
    transforms = models.JSONField(default=dict)
    option_remap = models.JSONField(default=list)
    correct_answer_index = models.IntegerField(default=0)
    seed = models.CharField(max_length=16, default="", blank=True)
    
    # Variant tracking
    variant_group = models.CharField(max_length=64, db_index=True)
    variant_number = models.IntegerField(default=1)
    
class BaseImage(models.Model):
    """Catalog of reusable base images"""
    image_id = models.CharField(max_length=64, unique=True)
    category = models.CharField(max_length=50)
    file_path_svg = models.CharField(max_length=255)
    file_path_png = models.CharField(max_length=255)
    complexity_level = models.IntegerField(default=1)
    usage_count = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

class OverlayAsset(models.Model):
    """Reusable overlay components"""
    overlay_id = models.CharField(max_length=64, unique=True)
    overlay_type = models.CharField(max_length=50)  # arrow, plane, fold, hole, label
    file_path = models.CharField(max_length=255)
    usage_count = models.IntegerField(default=0)
```

### 🤖 **Content Factory: AI-Powered Question Generation**

#### **Master Prompt Template**
```
Role: You are an expert psychometrics item-writer for spatial reasoning assessments.

Goal: Generate N spatial reasoning questions in strict JSON format. Reuse base images efficiently by specifying transforms and overlays instead of creating new artwork.

Constraints:
- Use only base_image_id values from the provided catalog
- Each question must be geometrically accurate with exactly one correct answer
- Balance difficulty across easy/medium/hard levels
- Generate plausible distractors that test common misconceptions

Base Image Catalog:
{
  "mental_rotation": [
    "MR_Lshape_01", "MR_Tshape_01", "MR_Zshape_01", "MR_Ushape_01",
    "MR_Stair2_01", "MR_Stair3_01", "MR_PolycubeA_01", "MR_PolycubeB_01",
    "MR_Asym1_01", "MR_Asym2_01", // ... up to MR_Asym12_01
  ],
  "paper_folding": [
    "PF_foldV_final", "PF_foldH_final", "PF_foldDiag_final", 
    "PF_foldVH_final", "PF_foldVV_final", "PF_grid_blank"
  ],
  "cross_sections": [
    "CS_cube_iso", "CS_cuboid_iso", "CS_tri_prism_iso", "CS_cylinder_iso",
    "CS_cone_iso", "CS_hex_prism_iso", // ... up to 12 total
  ],
  "spatial_transform": [
    "ST_scale_pair", "ST_stretch_pair", "ST_shear_pair", "ST_rotate_pair",
    // ... up to 8 total
  ],
  "perspective": [
    "PV_buildA_iso", "PV_buildB_iso", // ... up to PV_buildJ_iso
    "PV_elev_template_front", "PV_elev_template_right", 
    "PV_elev_template_back", "PV_elev_template_left"
  ],
  "overlays": [
    "arrow_90cw", "arrow_90ccw", "arrow_180", "arrow_45cw",
    "mirror_axis_vertical", "mirror_axis_horizontal",
    "plane_diag_A", "plane_diag_B", "plane_horizontal",
    "holes_corner", "holes_edge_mid", "holes_offcenter",
    "label_north", "label_east", "label_south", "label_west",
    "grid_4x4", "dims_annot"
  ]
}

Output exactly N items in this JSON schema:
[
  {
    "question_type": "mental_rotation|paper_folding|cross_sections|spatial_transformation|perspective_changes",
    "question_text": "Clear question asking about spatial relationship",
    "context": "Optional guidance for complex questions",
    "visual_content": {
      "main_image": {
        "base_image_id": "MR_Lshape_01",
        "overlay_ids": ["arrow_90cw"],
        "transforms": {"rotate_deg": 0, "mirror": "none", "crop": null}
      },
      "option_images": [
        {"base_image_id": "MR_Lshape_01", "overlay_ids": [], "transforms": {"rotate_deg": 90}},
        {"base_image_id": "MR_Lshape_01", "overlay_ids": [], "transforms": {"rotate_deg": 180}},
        {"base_image_id": "MR_Lshape_01", "overlay_ids": [], "transforms": {"rotate_deg": 270}},
        {"base_image_id": "MR_Lshape_01", "overlay_ids": [], "transforms": {"mirror": "vertical"}}
      ]
    },
    "options": ["Option A description", "Option B description", "Option C description", "Option D description"],
    "correct_answer": "A",
    "explanation": "Detailed geometric reasoning",
    "difficulty_level": "easy",
    "base_image_id": "MR_Lshape_01",
    "overlay_ids": ["arrow_90cw"],
    "transforms": {"rotate_deg": 0, "mirror": "none", "crop": null},
    "option_remap": [0, 1, 2, 3],
    "seed": "abc123"
  }
]
```

### ⚡ **Frontend Rendering Pipeline**

#### **Transform Component**
```jsx
const SpatialImageRenderer = ({ baseImageId, overlayIds = [], transforms = {} }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const applyTransforms = (element) => {
    let transformString = '';
    
    // Apply in order: mirror → rotate → scale
    if (transforms.mirror === 'vertical') {
      transformString += 'scaleX(-1) ';
    } else if (transforms.mirror === 'horizontal') {
      transformString += 'scaleY(-1) ';
    }
    
    if (transforms.rotate_deg) {
      transformString += `rotate(${transforms.rotate_deg}deg) `;
    }
    
    if (transforms.scale && transforms.scale !== 1) {
      transformString += `scale(${transforms.scale}) `;
    }
    
    return transformString;
  };
  
  return (
    <div className="spatial-image-container" style={{ position: 'relative' }}>
      {/* Base Image */}
      <img
        src={`/media/spatial/base/${baseImageId}.svg`}
        alt="Spatial reasoning visual"
        style={{ 
          transform: applyTransforms(),
          transformOrigin: 'center center'
        }}
        onLoad={() => setImageLoaded(true)}
      />
      
      {/* Overlays */}
      {imageLoaded && overlayIds.map((overlayId, index) => (
        <img
          key={index}
          src={`/media/spatial/overlays/${overlayId}.svg`}
          alt=""
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none'
          }}
        />
      ))}
      
      {/* Crop overlay if specified */}
      {transforms.crop && (
        <div 
          className="crop-overlay"
          style={{
            position: 'absolute',
            left: `${transforms.crop[0]}%`,
            top: `${transforms.crop[1]}%`,
            width: `${transforms.crop[2]}%`,
            height: `${transforms.crop[3]}%`,
            border: '2px solid rgba(74, 144, 226, 0.8)',
            background: 'rgba(74, 144, 226, 0.1)'
          }}
        />
      )}
    </div>
  );
};
```

### 🔒 **Enhanced Anti-Cheating Measures**

#### **1. Deterministic Shuffling**
```python
def generate_question_variant(base_question, user_id, session_id):
    """Generate deterministic but unique variant per user session"""
    seed = f"{base_question.id}_{user_id}_{session_id}"
    random.seed(seed)
    
    # Generate consistent but user-specific transforms
    variant_transforms = {
        'rotate_deg': random.choice([0, 90, 180, 270]),
        'mirror': random.choice(['none', 'vertical', 'horizontal']),
    }
    
    # Remap options deterministically
    option_remap = list(range(4))
    random.shuffle(option_remap)
    
    return {
        'transforms': variant_transforms,
        'option_remap': option_remap,
        'seed': seed[:8]
    }
```

#### **2. Semantic Equivalence Testing**
```python
def validate_question_variants(base_question, variants):
    """Ensure all variants test the same spatial concept"""
    for variant in variants:
        # Check geometric consistency
        if not verify_correct_answer(variant):
            raise ValidationError(f"Variant {variant.id} has incorrect answer")
        
        # Check difficulty equivalence (±10% response time)
        if abs(variant.avg_response_time - base_question.avg_response_time) > 0.1:
            variant.difficulty_level = adjust_difficulty(variant)
```

### 📈 **Production Timeline**

#### **Week 1: Asset Creation**
- Day 1-2: Render 20 Mental Rotation base images
- Day 3: Render 12 Cross-Section base images  
- Day 4: Render 10 Paper Folding + 8 Transformation base images
- Day 5: Render 10 Perspective base images + all overlays

#### **Week 2: AI Generation**
- Day 1-2: Generate Mental Rotation questions (110 variants)
- Day 3: Generate Cross-Section + Transformation questions (100 variants)
- Day 4: Generate Paper Folding + Perspective questions (110 variants)
- Day 5: Quality assurance and corrections

#### **Week 3: Integration & Testing**
- Day 1-2: Implement frontend rendering pipeline
- Day 3: Database integration and API updates
- Day 4-5: User testing and refinements

### 🎯 **Quality Metrics**

- **Asset Efficiency:** 5.3 questions per base image (target: 5+)
- **Geometric Accuracy:** 100% verified correct answers
- **Variant Equivalence:** ±5% difficulty across variants
- **Load Performance:** <1.5s for complete question with overlays
- **Anti-Cheat Effectiveness:** <2% question repetition within 90 days

### 🏆 **Success Indicators**

1. **320 high-quality questions** delivered from 60 base images
2. **90% reduction** in image production time vs traditional approach
3. **Zero cheating incidents** through transform-based variants
4. **95%+ user satisfaction** with visual clarity and difficulty progression

---

*This image-economy strategy transforms spatial reasoning assessment from an art-intensive to a logic-intensive process, enabling rapid scaling while maintaining rigorous psychometric standards.*

---

*This guide serves as the foundation for creating high-quality spatial reasoning assessments that accurately measure spatial intelligence and provide valuable insights for career guidance.*
