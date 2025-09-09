# Quick Asset & Question Creation Guide

## 🎨 ASSET CREATION WORKFLOW

### Base Image Requirements
**Specifications:**
- Format: SVG (preferred) or PNG
- Size: 800x600px minimum
- Background: Transparent
- Style: Technical, clean, high contrast
- Colors: Professional palette (#2563eb, #64748b, #f1f5f9)

### AI Image Generation Prompts

#### Mental Rotation Objects
```
"Create a clean isometric 3D view of a [geometric L-shaped block/complex mechanical part/abstract 3D shape] on transparent background, professional blue-gray technical style, high contrast, no shadows, suitable for spatial reasoning assessment, 800x600px"
```

#### Paper Folding Patterns
```
"Create a flat 2D paper pattern diagram showing [square/triangle/cross shape] with clear fold lines (dashed), clean technical drawing style, transparent background, blue-gray color scheme, suitable for folding assessment"
```

#### Cross-Section Objects
```
"Create a 3D technical drawing of [cylinder/cube/complex shape] with a cutting plane indicator, isometric view, transparent background, professional engineering style, suitable for cross-section visualization test"
```

#### Spatial Transformation Targets
```
"Create a technical diagram showing [grid object/scalable shape/deformable pattern] with clear proportional references, clean geometric style, transparent background, suitable for transformation assessment"
```

#### Perspective View Objects
```
"Create multiple orthographic views (front, side, top) of [house/vehicle/furniture] in technical drawing style, clean lines, transparent background, professional blue-gray colors"
```

---

## 🔧 TECHNICAL IMPLEMENTATION

### 1. Database Model Extension
Add to `backend/testsengine/models.py`:

```python
class Question(models.Model):
    # ... existing fields ...
    
    # Image Economy Fields
    base_image_id = models.CharField(max_length=50, blank=True, null=True)
    overlay_ids = models.JSONField(default=list)
    transforms = models.JSONField(default=dict)  # rotation, scale, flip
    option_remap = models.JSONField(default=dict)  # A->C, B->A, etc.
    
    # Visual Content
    main_image = models.URLField(blank=True, null=True)
    option_images = models.JSONField(default=list)
    sequence_images = models.JSONField(default=list)
    
    # Metadata
    visual_style = models.CharField(max_length=50, default='technical_3d')
    complexity_score = models.IntegerField(default=1)
```

### 2. Asset Directory Structure
```
frontend/src/assets/spatial/
├── base/
│   ├── mental_rotation/
│   │   ├── mr_001_l_block.svg
│   │   ├── mr_002_gear.svg
│   │   └── ...
│   ├── paper_folding/
│   ├── cross_sections/
│   ├── spatial_transformation/
│   └── perspective_changes/
├── overlays/
│   ├── rotation_arrows/
│   ├── fold_lines/
│   ├── cut_planes/
│   └── perspective_indicators/
├── generated/
└── catalogs/
    ├── base-image-catalog.json
    └── overlay-catalog.json
```

### 3. Image Rendering Component
Create `frontend/src/components/SpatialImageRenderer.jsx`:

```jsx
import React from 'react';

const SpatialImageRenderer = ({ 
  baseImageId, 
  overlayIds = [], 
  transforms = {}, 
  className = "" 
}) => {
  const getTransformStyle = () => {
    const { rotation = 0, scale = 1, flipX = false, flipY = false } = transforms;
    
    let transform = [];
    if (rotation) transform.push(`rotate(${rotation}deg)`);
    if (scale !== 1) transform.push(`scale(${scale})`);
    if (flipX) transform.push('scaleX(-1)');
    if (flipY) transform.push('scaleY(-1)');
    
    return transform.length ? { transform: transform.join(' ') } : {};
  };

  return (
    <div className={`spatial-image-container ${className}`}>
      <div className="base-image" style={getTransformStyle()}>
        <img 
          src={`/src/assets/spatial/base/${baseImageId}.svg`} 
          alt="Spatial reasoning object"
          className="w-full h-full object-contain"
        />
      </div>
      
      {overlayIds.map((overlayId, index) => (
        <div key={overlayId} className="overlay absolute inset-0">
          <img 
            src={`/src/assets/spatial/overlays/${overlayId}.svg`}
            alt=""
            className="w-full h-full object-contain"
            style={{ zIndex: 10 + index }}
          />
        </div>
      ))}
    </div>
  );
};

export default SpatialImageRenderer;
```

---

## 📝 QUESTION GENERATION PROCESS

### Master AI Prompt Template
```
You are creating spatial reasoning questions for a professional career assessment. 

BASE IMAGE: [base_image_id]
CATEGORY: [mental_rotation/paper_folding/cross_sections/spatial_transformation/perspective_changes]
DIFFICULTY: [easy/medium/hard]

Create a question with:

1. **Question Text**: Clear, professional instruction
2. **Four Options**: A, B, C, D with distinct differences
3. **Correct Answer**: One unambiguous correct choice
4. **Explanation**: Why the answer is correct
5. **Transforms**: Specify rotations, overlays, or modifications needed

Format your response as JSON:
{
  "question_text": "...",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correct_answer": "A",
  "explanation": "...",
  "base_image_id": "...",
  "transforms": {
    "main": { "rotation": 45, "scale": 1.0 },
    "options": {
      "A": { "rotation": 0 },
      "B": { "rotation": 90 },
      "C": { "rotation": 180 },
      "D": { "rotation": 270 }
    }
  },
  "overlay_ids": ["rotation_arrow_45"],
  "difficulty_justification": "..."
}

Requirements:
- Professional, clear language
- Unambiguous visual differences
- Progressive difficulty
- Cultural neutrality
- Technical accuracy
```

### Category-Specific Instructions

#### Mental Rotation
- Focus on 3D object orientation
- Use rotation angles: 45°, 90°, 135°, 180°
- Include complex shapes with distinct features
- Vary viewing angles and orientations

#### Paper Folding
- Show fold sequence clearly
- Use dashed lines for fold indicators
- Include multiple fold types (valley, mountain)
- Progress from simple to complex patterns

#### Cross-Sections
- Display cutting planes clearly
- Show both 3D object and resulting cross-section
- Use transparent planes and solid sections
- Include hollow and solid objects

#### Spatial Transformation
- Focus on scaling, stretching, deformation
- Use grid references for proportion
- Include non-uniform transformations
- Show before/after states

#### Perspective Changes
- Multiple viewpoints of same object
- Orthographic and isometric views
- Camera position indicators
- Consistent object orientation

---

## ⚡ QUICK COMMANDS

### Setup Commands
```bash
# Create asset directories
mkdir -p frontend/src/assets/spatial/{base/{mental_rotation,paper_folding,cross_sections,spatial_transformation,perspective_changes},overlays/{rotation_arrows,fold_lines,cut_planes,perspective_indicators},generated,catalogs}

# Create base image catalog
echo '{"mental_rotation": [], "paper_folding": [], "cross_sections": [], "spatial_transformation": [], "perspective_changes": []}' > frontend/src/assets/spatial/catalogs/base-image-catalog.json

# Update database schema
cd backend
python manage.py makemigrations testsengine
python manage.py migrate
```

### Development Commands
```bash
# Test question creation
python manage.py shell
>>> from testsengine.models import Question, Test
>>> Question.objects.filter(question_type__in=['mental_rotation', 'paper_folding']).count()

# Start development servers
python manage.py runserver  # Backend
npm run dev  # Frontend (new terminal)
```

---

## 🎯 TODAY'S PRIORITIES

1. **[CRITICAL]** Create 60 base images (12 per category)
2. **[CRITICAL]** Set up asset directory structure  
3. **[CRITICAL]** Extend database schema
4. **[HIGH]** Generate 320+ questions using AI
5. **[HIGH]** Implement image rendering system
6. **[MEDIUM]** Test complete user flow
7. **[LOW]** Performance optimization

---

## 🚨 POTENTIAL BLOCKERS & SOLUTIONS

### Blocker: Image Creation Time
**Solution**: Use AI image generators with batch prompts, or simple SVG geometric shapes

### Blocker: Question Quality
**Solution**: Use validated prompt templates, generate in small batches with review

### Blocker: Frontend Performance
**Solution**: Implement lazy loading, image optimization, caching

### Blocker: Database Migration Issues
**Solution**: Test migrations on development copy first, backup before changes

---

**Start Time:** 9:00 AM  
**Target Completion:** 6:30 PM  
**Success Metric:** Complete spatial reasoning test suite functional and tested
