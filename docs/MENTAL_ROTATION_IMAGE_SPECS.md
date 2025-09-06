# Mental Rotation Image Specifications

## Overview
This document provides detailed specifications for creating visual assets for the 35 Mental Rotation questions in our spatial reasoning test system. The image-economy strategy reuses base images with transformations to minimize asset creation while maximizing question variety.

## Base Image Requirements

### Technical Specifications
- **Format**: SVG (preferred) or PNG with transparent background
- **Resolution**: 512x512 pixels minimum for PNG
- **Background**: Transparent
- **Style**: Clean, high-contrast line art
- **Colors**: Primary object in dark blue (#2563eb), secondary elements in gray (#6b7280)
- **Line width**: 3-4px for clear visibility

### Base Image Catalog

#### Easy Level (12 questions, 4 base images)

**MR_L_block_01** - L-shaped 3D block
- Description: L-shaped block made of 3 unit cubes
- Configuration: 2 cubes horizontal, 1 cube vertical
- Perspective: Isometric view
- Used by: 3 questions (0°, 90°, 180° rotations)

**MR_T_block_01** - T-shaped 3D block  
- Description: T-shaped block made of 4 unit cubes
- Configuration: 3 cubes horizontal base, 1 cube center vertical
- Perspective: Isometric view
- Used by: 3 questions (0°, 120°, 240° rotations)

**MR_simple_house_01** - Simple house shape
- Description: House with triangular roof and rectangular base
- Features: Simple geometric house outline
- Perspective: Front-facing isometric
- Used by: 3 questions (0°, 90°, 270° rotations)

**MR_arrow_shape_01** - Arrow pointing right
- Description: Simple geometric arrow
- Features: Triangular head, rectangular shaft
- Style: Bold, clear directional indicator
- Used by: 3 questions (0°, 45°, 180° rotations)

#### Medium Level (10 questions, 4 base images)

**MR_stairs_01** - 3-step staircase
- Description: Stepped structure with 3 levels
- Configuration: Progressive height increase
- Perspective: Isometric view showing depth
- Used by: 3 questions (0°, 90°, 180° rotations)

**MR_plus_block_01** - Plus-shaped block
- Description: 3D plus sign made of 5 unit cubes
- Configuration: Cross shape with center cube
- Perspective: Isometric view
- Used by: 3 questions (0°, 45°, 135° rotations)

**MR_S_curve_01** - S-shaped curved block
- Description: Smooth S-curve in 3D
- Features: Curved connecting segments
- Style: Smooth, flowing curves
- Used by: 2 questions (0°, 180° rotations)

**MR_zigzag_01** - Zigzag block pattern
- Description: Connected blocks in zigzag pattern
- Configuration: Alternating direction segments
- Perspective: Isometric view
- Used by: 2 questions (0°, 90° rotations)

#### Hard Level (13 questions, 5 base images)

**MR_cross_3d_01** - 3D cross intersection
- Description: Two perpendicular bars intersecting
- Configuration: One horizontal, one vertical bar
- Perspective: Clear 3D intersection view
- Used by: 3 questions (0°, 90°, 180° rotations)

**MR_complex_stairs_01** - Multi-level staircase
- Description: 4-level stepped structure
- Features: Varying step sizes and orientations
- Complexity: Multiple directional changes
- Used by: 3 questions (0°, 120°, 240° rotations)

**MR_bent_rod_01** - L-shaped bent rod
- Description: Cylindrical rod with 90° bend
- Features: Smooth curved joint
- Style: Cylindrical with depth shading
- Used by: 2 questions (0°, 180° rotations)

**MR_interlocked_01** - Interlocked cubic forms
- Description: Two cubic blocks interlocked
- Configuration: Perpendicular intersection
- Complexity: Overlapping geometry
- Used by: 3 questions (0°, 90°, 270° rotations)

**MR_spiral_arm_01** - Spiral arm structure
- Description: Curved arm in spiral pattern
- Features: Progressive curve with depth
- Style: Smooth flowing form
- Used by: 2 questions (0°, 180° rotations)

#### Expert Level (0 questions currently - for future expansion)
*Reserved for highly complex multi-part assemblies and compound rotations*

## Transform Specifications

### Rotation Transforms
All rotations are applied around the vertical (Y) axis unless specified:

- **0°**: Original orientation (control/reference)
- **45°**: Quarter-diagonal rotation
- **90°**: Quarter turn (left/right)
- **120°**: One-third rotation
- **135°**: Three-quarter diagonal
- **180°**: Half turn (front/back flip)
- **240°**: Two-thirds rotation
- **270°**: Three-quarter turn

### Overlay System
Each base image supports these overlays:

- **highlight**: Blue highlight on specific parts
- **shadow**: Drop shadow for depth
- **grid**: Reference grid for spatial context
- **axis**: Rotation axis indicators

## Answer Option Generation

### Option Types
1. **Correct**: Target rotation of base image
2. **Similar**: Different rotation (90° off from correct)
3. **Mirrored**: Horizontally flipped version
4. **Scaled**: Slightly different proportions
5. **Different**: Completely different shape

### Option Remap System
Maps generated options to display positions:
```json
{
  "A": 1,  // Generated option 1 → Display option A
  "B": 3,  // Generated option 3 → Display option B  
  "C": 0,  // Generated option 0 → Display option C
  "D": 2   // Generated option 2 → Display option D
}
```

## Visual Style Guidelines

### Color Palette
- **Primary Object**: #2563eb (Blue-600)
- **Secondary Elements**: #6b7280 (Gray-500)
- **Highlight**: #fbbf24 (Amber-400)
- **Shadow**: #374151 (Gray-700, 50% opacity)
- **Background**: Transparent

### Lighting and Depth
- **Light Source**: Top-left diagonal
- **Shadow Direction**: Bottom-right
- **Highlight**: Top-left edges
- **Depth Cues**: Overlapping, size variation, shadow

### Isometric Projection
- **Angle**: 30° from horizontal
- **Ratio**: Equal axis scaling
- **Perspective**: Parallel projection
- **Consistency**: Same viewpoint for all base images

## Implementation Priority

### Phase 1 (Immediate)
Create 4 Easy level base images:
- MR_L_block_01
- MR_T_block_01  
- MR_simple_house_01
- MR_arrow_shape_01

### Phase 2 (Next)
Create 4 Medium level base images:
- MR_stairs_01
- MR_plus_block_01
- MR_S_curve_01
- MR_zigzag_01

### Phase 3 (Advanced)
Create 5 Hard level base images:
- MR_cross_3d_01
- MR_complex_stairs_01
- MR_bent_rod_01
- MR_interlocked_01
- MR_spiral_arm_01

## Asset Organization

### File Structure
```
frontend/src/assets/images/spatial/mental_rotation/
├── base_images/
│   ├── MR_L_block_01.svg
│   ├── MR_T_block_01.svg
│   └── ...
├── overlays/
│   ├── highlight.svg
│   ├── shadow.svg
│   └── grid.svg
└── generated/
    ├── MR_L_block_01_rot0.svg
    ├── MR_L_block_01_rot90.svg
    └── ...
```

### Naming Convention
- Base images: `MR_[description]_[variant].svg`
- Generated images: `MR_[base]_rot[degrees].svg`
- Overlays: `[overlay_type].svg`

## Testing and Validation

### Visual Validation Checklist
- [ ] All rotations maintain object proportions
- [ ] Consistent lighting and shadow direction
- [ ] Clear distinction between answer options
- [ ] Accessible color contrast (4.5:1 minimum)
- [ ] Scalable to different screen sizes
- [ ] Fast loading times (<100KB per image)

### Cognitive Validation
- [ ] Appropriate difficulty progression
- [ ] Clear spatial relationship challenges
- [ ] Avoid ambiguous rotations
- [ ] Distinctive incorrect options
- [ ] Consistent spatial reference frame

This specification ensures consistent, high-quality visual assets that support effective spatial reasoning assessment while optimizing development time through strategic image reuse.
