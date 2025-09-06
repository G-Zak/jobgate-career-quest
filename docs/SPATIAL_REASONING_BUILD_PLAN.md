# Spatial Reasoning Tests - Complete Build Plan
**Target Date:** Today (September 3, 2025)  
**Goal:** Complete spatial reasoning assessment system with 320+ questions using image-economy strategy

---

## 🎯 EXECUTION TIMELINE

### Phase 1: Foundation Setup (30 minutes)
**9:00 - 9:30 AM**

#### 1.1 Database Extensions
- [ ] **Extend Question Model** - Add image-economy fields
- [ ] **Run Migrations** - Update database schema
- [ ] **Test Database** - Verify new fields work

#### 1.2 Asset Infrastructure
- [ ] **Create Assets Directory** - `frontend/src/assets/spatial/`
- [ ] **Setup Subdirectories** - `base/`, `overlays/`, `generated/`
- [ ] **Image Catalog File** - `base-image-catalog.json`

---

### Phase 2: Base Image Production (2 hours)
**9:30 - 11:30 AM**

#### 2.1 Mental Rotation Base Images (12 images)
- [ ] **Geometric Shapes** - Cube, L-block, T-block, Z-block
- [ ] **Complex Objects** - Chair, gear, molecule, abstract 3D
- [ ] **Technical Objects** - Bracket, pipe joint, mechanical part, building block

#### 2.2 Paper Folding Base Images (12 images)
- [ ] **Simple Shapes** - Square, triangle, rectangle, pentagon
- [ ] **Complex Patterns** - Cross, star, arrow, T-shape
- [ ] **Multi-fold** - Accordion, origami base, envelope, booklet

#### 2.3 Cross-Sections Base Images (12 images)
- [ ] **Geometric Solids** - Cube, cylinder, sphere, pyramid
- [ ] **Complex Objects** - Cone-cylinder combo, stepped cylinder, L-prism, hollow shapes
- [ ] **Technical Parts** - Bolt, pipe fitting, housing, bearing

#### 2.4 Spatial Transformation Base Images (12 images)
- [ ] **Scale Targets** - Grid objects, proportional shapes, nested figures
- [ ] **Deformation** - Elastic objects, bendable shapes, stretchable patterns
- [ ] **Composition** - Modular parts, stackable elements, interlocking pieces

#### 2.5 Perspective Changes Base Images (12 images)
- [ ] **Viewpoint Objects** - House, vehicle, furniture, architectural element
- [ ] **Technical Views** - Orthographic projections, isometric objects
- [ ] **Complex Scenes** - Multi-object arrangements, spatial relationships

---

### Phase 3: Overlay System Creation (1 hour)
**11:30 AM - 12:30 PM**

#### 3.1 Universal Overlays
- [ ] **Rotation Arrows** - 45°, 90°, 180°, custom angles
- [ ] **Fold Lines** - Dotted, dashed, colored indicators
- [ ] **Cut Planes** - Transparent sections, highlight planes
- [ ] **Transformation Grids** - Scale references, deformation guides
- [ ] **Viewpoint Indicators** - Camera positions, angle markers

#### 3.2 Overlay Categories
- [ ] **Navigation** - Direction arrows, rotation axes
- [ ] **Process** - Step indicators, sequence markers
- [ ] **Analysis** - Measurement tools, comparison guides
- [ ] **Highlight** - Selection boxes, emphasis markers

---

### Phase 4: Question Generation System (2 hours)
**1:30 - 3:30 PM** *(After lunch break)*

#### 4.1 AI Prompt Implementation
- [ ] **Master Prompt Template** - Adapt from guide to project
- [ ] **Category-Specific Prompts** - Fine-tune for each spatial type
- [ ] **Batch Generation Scripts** - Automate question creation
- [ ] **Quality Control Prompts** - Validation and review templates

#### 4.2 Question Database Population
- [ ] **Generate Questions** - Use AI with base image catalog
- [ ] **Quality Review** - Validate generated content
- [ ] **Database Import** - Bulk insert validated questions
- [ ] **Test Question Retrieval** - Verify API endpoints work

---

### Phase 5: Frontend Integration (1.5 hours)
**3:30 - 5:00 PM**

#### 5.1 Image Rendering System
- [ ] **SpatialImageRenderer Component** - Dynamic image composition
- [ ] **Transform Engine** - CSS transforms for rotations/scaling
- [ ] **Overlay Manager** - Layer management system
- [ ] **Caching System** - Optimize image loading

#### 5.2 Test Interface Updates
- [ ] **Visual Question Display** - Integrate new rendering system
- [ ] **Option Rendering** - Dynamic option image generation
- [ ] **Progress Indicators** - Visual test progress
- [ ] **Mobile Responsiveness** - Ensure cross-device compatibility

---

### Phase 6: Testing & Validation (1.5 hours)
**5:00 - 6:30 PM**

#### 6.1 System Testing
- [ ] **End-to-End Tests** - Complete user flows
- [ ] **Image Loading Tests** - Performance and fallbacks
- [ ] **Question Randomization** - Anti-cheating validation
- [ ] **Score Calculation** - Accuracy verification

#### 6.2 Quality Assurance
- [ ] **Content Review** - Question quality check
- [ ] **Visual Consistency** - Image style verification
- [ ] **User Experience** - Interface usability test
- [ ] **Performance Optimization** - Load time improvements

---

## 🛠️ IMPLEMENTATION CHECKLIST

### Technical Requirements
- [ ] **Python Environment** - Django backend ready
- [ ] **React Frontend** - Development server running
- [ ] **Image Tools** - SVG editor or 3D software
- [ ] **AI Access** - ChatGPT or similar for question generation

### Resource Requirements
- [ ] **SVG Creation Tool** - Inkscape, Illustrator, or Figma
- [ ] **3D Software** - Blender, SketchUp, or online tools
- [ ] **Image Optimization** - Compression tools for web
- [ ] **Version Control** - Git for tracking changes

---

## 📋 STEP-BY-STEP EXECUTION GUIDE

### Step 1: Database Schema Update
```bash
# Navigate to backend
cd /Users/zakariaguennani/Documents/Dev/EMSI/Internship/jobgate-career-quest/backend

# Add new fields to Question model
# Edit testsengine/models.py

# Create and run migration
python manage.py makemigrations testsengine
python manage.py migrate
```

### Step 2: Asset Directory Setup
```bash
# Navigate to frontend
cd /Users/zakariaguennani/Documents/Dev/EMSI/Internship/jobgate-career-quest/frontend

# Create asset directories
mkdir -p src/assets/spatial/{base,overlays,generated}

# Create catalog file
touch src/assets/spatial/base-image-catalog.json
```

### Step 3: Base Image Creation Process
1. **Choose Creation Method:**
   - **Option A:** Use Figma/Inkscape for SVG creation
   - **Option B:** Use Blender for 3D renders
   - **Option C:** Use AI image generators with specific prompts

2. **Follow Naming Convention:**
   ```
   mental_rotation_001.svg
   paper_folding_001.svg
   cross_sections_001.svg
   spatial_transformation_001.svg
   perspective_changes_001.svg
   ```

3. **Image Specifications:**
   - Format: SVG (preferred) or PNG
   - Resolution: 800x600px minimum
   - Background: Transparent
   - Style: Clean, technical, high contrast

### Step 4: Question Generation Workflow
1. **Prepare Base Image Catalog**
2. **Use Master AI Prompt Template**
3. **Generate Questions in Batches**
4. **Review and Validate Content**
5. **Import to Database**

---

## 🚀 QUICK START COMMANDS

### Environment Setup
```bash
# Activate Python environment
source /Users/zakariaguennani/Documents/Dev/EMSI/Internship/jobgate-career-quest/.venv/bin/activate

# Start backend server
cd backend && python manage.py runserver

# Start frontend server (new terminal)
cd frontend && npm run dev
```

### Development Tools
```bash
# Run database migrations
python manage.py makemigrations && python manage.py migrate

# Create test data
python manage.py create_spatial_tests

# Run tests
python manage.py test testsengine
```

---

## 📊 SUCCESS METRICS

### Completion Targets
- [ ] **60 Base Images** - High-quality SVG assets
- [ ] **20+ Overlays** - Reusable visual elements
- [ ] **320+ Questions** - Generated and validated
- [ ] **5 Test Categories** - Fully functional
- [ ] **Frontend Integration** - Complete user experience

### Quality Standards
- [ ] **Visual Consistency** - Professional appearance
- [ ] **Question Accuracy** - Correct answers verified
- [ ] **Performance** - Fast loading (<2s per question)
- [ ] **Accessibility** - Color-blind friendly, responsive
- [ ] **Anti-Cheating** - Randomization and variation

---

## 🎨 ASSET CREATION RESOURCES

### AI Prompts for Image Generation
```
"Create a clean, technical 3D isometric view of [object] on transparent background, 
professional blue-gray color scheme, high contrast, suitable for spatial reasoning test, 
800x600px, minimal shadows, clear geometric definition"
```

### SVG Creation Guidelines
- Use geometric primitives
- Maintain consistent stroke width (2-3px)
- Apply professional color palette (#2563eb, #64748b, #f1f5f9)
- Include proper grouping and layers
- Optimize for web performance

### Quality Control Checklist
- [ ] Clear visual distinction between options
- [ ] Unambiguous correct answer
- [ ] Progressive difficulty within category
- [ ] Cultural neutrality
- [ ] Technical accuracy

---

**Total Estimated Time:** 8.5 hours  
**Completion Target:** End of today  
**Success Criteria:** Full spatial reasoning test suite ready for production

---

*This plan transforms spatial reasoning assessment from concept to fully functional system in one focused development day.*
