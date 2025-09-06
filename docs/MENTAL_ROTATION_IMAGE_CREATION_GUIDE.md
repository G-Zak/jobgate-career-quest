# Mental Rotation Image Creation Guide

> **Purpose**: Complete specification for creating visual assets for 35 Mental Rotation questions  
> **Strategy**: 13 base images + overlays generate all question variations  
> **Format**: SVG with transparent background (512x512px minimum)  
> **Style**: Isometric 3D, clean line art, high contrast

## Image Naming Convention

### Base Images
```
MR_[shape_description]_[variant_number].svg
```

### Generated Question Images  
```
MR_[base_name]_rot[degrees]_q[question_id].svg
```

### Overlay Assets
```
overlay_[type]_[specification].svg
```

---

## Phase 1: Easy Level Base Images (5 images needed)

### 1. MR_L_block_01.svg ✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅
**Used by Questions**: 302, 303, 304 (3 questions)  
**Rotations needed**: 0°, 90°, 180°

**AI Generation Prompt**:
"Create an isometric 3D illustration of an L-shaped block structure made from exactly 3 identical unit cubes. The structure forms a perfect L-shape when viewed from above. Position the first cube at the origin as the corner piece. Place the second cube directly adjacent to the right side of the corner cube, forming a horizontal arm extending rightward. Place the third cube directly adjacent to the top side of the corner cube, forming a vertical arm extending upward. Use 30-degree isometric perspective showing the top, right, and front faces of each cube. Render in solid blue color (#2563eb) with darker blue edges (#1d4ed8) and subtle highlight on top faces (#3b82f6). Add clean black outlines (3px width) around all visible edges. Set against transparent background. The L-shape should clearly show the distinction between the horizontal arm (2 cubes long) and vertical arm (1 cube high extending upward from the corner)."

**Question Mapping**:
- Q302: Show at 0° → Answer shows 90° clockwise rotation
- Q303: Show at 0° → Answer shows 180° rotation  
- Q304: Show at 0° → Answer shows 90° counter-clockwise rotation

### 2. MR_T_block_01.svg
**Used by Questions**: 305, 306, 307 (3 questions)  
**Rotations needed**: 0°, 90°, 180°, 270°

**AI Generation Prompt**:
"Create an isometric 3D illustration of a T-shaped block structure made from exactly 4 identical unit cubes. The structure forms a perfect T-shape when viewed from above. Create the horizontal base by placing 3 cubes in a straight line from left to right. Then place the 4th cube directly on top of the center cube of the horizontal base, creating the vertical stem of the T. Use 30-degree isometric perspective showing all cube faces clearly. The horizontal bar should be 3 cubes wide, and the vertical stem should be 1 cube extending upward from the center. Render in solid blue color (#2563eb) with darker blue edges (#1d4ed8) for depth. Add subtle highlights on top faces (#3b82f6) and clean black outlines (3px width) around all visible edges. Set against transparent background. Ensure clear visual separation between the horizontal base and vertical stem elements."

**Question Mapping**:
- Q305: Show at 0° → Answer shows 90° clockwise rotation
- Q306: Show at 0° → Answer shows 180° rotation (upside-down T)
- Q307: Show at 0° → Answer shows 270° clockwise rotation

### 3. MR_Z_block_01.svg  
**Used by Questions**: 308, 309 (2 questions)  
**Rotations needed**: 0°, 90°, 180°

**AI Generation Prompt**:
"Create an isometric 3D illustration of a Z-shaped block structure made from exactly 6 unit cubes arranged in a zigzag pattern. Start with 2 cubes placed horizontally side-by-side at the top-left position. Create a step down and to the right by placing 2 connecting cubes diagonally below and offset to the right. Complete the Z-shape by placing 2 more cubes horizontally at the bottom-right position, aligned with the diagonal connection. The overall shape should clearly resemble the letter 'Z' when viewed from above, with distinct top-left horizontal segment, diagonal middle connection, and bottom-right horizontal segment. Use 30-degree isometric perspective. Render in solid blue color (#2563eb) with darker blue shading (#1d4ed8) on side faces and clean black outlines (3px width). Set against transparent background. The Z-pattern should show clear three-dimensional depth and stepping."

**Question Mapping**:
- Q308: Show at 0° → Answer shows 90° clockwise (creates S-shape)
- Q309: Show at 0° → Answer shows 180° rotation (backward Z)

### 4. MR_step_block_01.svg
**Used by Questions**: 310, 311 (2 questions)  
**Rotations needed**: 0°, 90°, 270°

**AI Generation Prompt**:
"Create an isometric 3D illustration of a stepped staircase structure made from unit cubes, forming 3 distinct height levels ascending from left to right. Build Level 1 (leftmost): Stack 1 single cube as the shortest step. Build Level 2 (center): Stack 2 cubes vertically as the medium step, placed directly adjacent to Level 1. Build Level 3 (rightmost): Stack 3 cubes vertically as the tallest step, placed directly adjacent to Level 2. Each level should be exactly 1 cube wide (front to back). The overall structure creates a clear staircase ascending from left to right with heights of 1, 2, and 3 cubes respectively. Use 30-degree isometric perspective showing all cube faces. Render in gradient blue colors: lighter blue (#60a5fa) for lower cubes, medium blue (#2563eb) for middle cubes, darker blue (#1d4ed8) for top cubes. Add clean black outlines (3px width) and set against transparent background."

**Question Mapping**:
- Q310: Show at 0° → Answer shows 90° clockwise (vertical steps up)
- Q311: Show at 0° → Answer shows 270° clockwise (vertical steps down)

### 5. MR_U_block_01.svg
**Used by Questions**: 312, 313 (2 questions)  
**Rotations needed**: 0°, 90°, 180°

**AI Generation Prompt**:
"Create an isometric 3D illustration of a U-shaped block structure made from exactly 7 unit cubes, forming a channel that opens upward. Build the left vertical arm: Stack 3 cubes vertically on the left side. Build the bottom horizontal connector: Place 3 cubes horizontally in a line, connecting the bottom of the left arm to the right side. Build the right vertical arm: Stack 3 cubes vertically on the right side, connecting to the right end of the horizontal bottom. The structure should form a clear U-shape when viewed from above, with an open channel/gap at the top between the two vertical arms. The opening should be exactly 1 cube wide. Use 30-degree isometric perspective clearly showing the internal U-shaped channel and the connectivity between all parts. Render in solid blue color (#2563eb) with darker shading (#1d4ed8) on interior faces and clean black outlines (3px width). Set against transparent background. Emphasize the upward-opening direction of the U-shape."

**Question Mapping**:
- Q312: Show at 0° → Answer shows 180° rotation (upside-down U)
- Q313: Show at 0° → Answer shows 90° clockwise (U opens left)

---

## Phase 2: Medium Level Base Images (4 images needed)

### 6. MR_complex_L_01.svg
**Used by Questions**: 314, 315, 316 (3 questions)  
**Rotations needed**: 0°, 45°, 90°, 135°

**AI Generation Prompt**:
"Create an isometric 3D illustration of a complex L-shaped structure with an additional corner extension. Start with a basic L-shape made from 5 cubes: 3 cubes forming a horizontal arm extending to the right, and 2 cubes forming a vertical arm extending upward from the leftmost cube. Add complexity with a diagonal corner extension: attach 2 additional cubes diagonally at the inner corner where the horizontal and vertical arms meet, extending at a 45-degree angle inward. Add an asymmetric feature: place 1 small protrusion cube on the middle of the horizontal arm's top surface. The total structure uses 8 cubes with clear L-shape foundation plus diagonal extension and asymmetric protrusion. Use 30-degree isometric perspective. Render the main L-structure in primary blue (#2563eb), the diagonal extension in secondary gray (#6b7280), and the protrusion in highlight amber (#fbbf24). Add clean black outlines (3px width) and set against transparent background. Show clear distinction between the main L-structure and additional features."

**Question Mapping**:
- Q314: Show at 0° → Answer shows 45° clockwise rotation
- Q315: Show at 0° → Answer shows 135° clockwise rotation
- Q316: Show at 0° → Answer shows 90° counter-clockwise rotation

### 7. MR_asymmetric_01.svg
**Used by Questions**: 317, 318, 319 (3 questions)  
**Rotations needed**: 0°, 45°, 90°, 270°

**AI Generation Prompt**:
"Create an isometric 3D illustration of a completely asymmetric structure with no axis of symmetry. Build the base foundation: Arrange 4 cubes in an L-pattern (3 cubes in an L-shape as the foundation). Add asymmetric features: Place a cylindrical protrusion (1 cube height, 0.5 cube diameter) on the top surface of the corner cube of the L-foundation. Add a second feature: Place a cubic protrusion (1 full cube) on the top surface of the end cube of the horizontal arm, but offset it halfway toward the corner. Add a third unique element: Place a stepped rectangular protrusion (0.5x1x2 cubes) extending from the side of the vertical arm of the foundation. Ensure the structure has completely different silhouettes when rotated - no two rotation angles should look identical. Use 30-degree isometric perspective. Render foundation in primary blue (#2563eb), cylindrical feature in secondary gray (#6b7280), cubic protrusion in highlight amber (#fbbf24), and stepped element in tertiary purple (#8b5cf6). Add clean black outlines (3px width) and set against transparent background."

**Question Mapping**:
- Q317: Show at 0° → Answer shows 90° clockwise rotation
- Q318: Show at 0° → Answer shows 270° clockwise rotation
- Q319: Show at 0° → Answer shows 45° counter-clockwise rotation

### 8. MR_multi_step_01.svg
**Used by Questions**: 320, 321 (2 questions)  
**Rotations needed**: 0°, 90°, 180°

**AI Generation Prompt**:
"Create an isometric 3D illustration of a complex staircase with 3 levels of varying step sizes and irregular dimensions. Build Level 1 (leftmost, lowest): Create a step using 2 cubes arranged as 1 cube wide (front-to-back) by 2 cubes long (left-to-right), stacked 1 cube high. Build Level 2 (center, medium): Create a step using 4 cubes arranged as 2 cubes wide by 2 cubes long, stacked 2 cubes high. Build Level 3 (rightmost, highest): Create a step using 3 cubes arranged as 1 cube wide by 3 cubes long, stacked 3 cubes high. Each level should have distinctly different footprint dimensions and heights, creating an irregular staircase pattern that ascends from left to right. The varying widths and lengths make this clearly different from a simple uniform staircase. Use 30-degree isometric perspective. Render in gradient blue colors: light blue (#93c5fd) for Level 1, medium blue (#2563eb) for Level 2, dark blue (#1d4ed8) for Level 3. Add clean black outlines (3px width) and set against transparent background."

**Question Mapping**:
- Q320: Show at 0° → Answer shows 90° clockwise (vertical ascension)
- Q321: Show at 0° → Answer shows 180° rotation (right-to-left steps)

### 9. MR_corner_block_01.svg
**Used by Questions**: 322, 323 (2 questions)  
**Rotations needed**: 0°, 90°, 135°

**AI Generation Prompt**:
"Create an isometric 3D illustration of a corner/angle structure with two perpendicular arms of different lengths creating asymmetry. Build the horizontal arm: Place 4 cubes in a straight line extending horizontally to the right. Build the vertical arm: Place 3 cubes in a straight line extending vertically upward, connected to the leftmost cube of the horizontal arm. Create the corner junction: Add a 2x2 cube block at the intersection point where the horizontal and vertical arms meet, creating a reinforced corner. This 2x2 junction should span both arms partially, making the corner more substantial than a simple meeting point. The different arm lengths (4 cubes horizontal vs 3 cubes vertical) create clear asymmetry when rotated. Use 30-degree isometric perspective showing both arms clearly and the substantial corner junction. Render main arms in primary blue (#2563eb) and corner junction in slightly darker blue (#1d4ed8) for emphasis. Add clean black outlines (3px width) and set against transparent background."

**Question Mapping**:
- Q322: Show at 0° → Answer shows 90° clockwise rotation
- Q323: Show at 0° → Answer shows 135° clockwise rotation

---

## Phase 3: Hard Level Base Images (5 images needed)

### 10. MR_complex_asymmetric_01.svg
**Used by Questions**: 324, 325, 326 (3 questions)  
**Rotations needed**: 60°, 75°, 150°

**AI Generation Prompt**:
"Create an isometric 3D illustration of a highly complex multi-part asymmetric assembly with maximum rotational complexity. Build irregular foundation: Arrange 5 cubes in a completely asymmetric pattern - not forming any recognizable letter or symmetric shape. Position cubes at: (0,0), (1,0), (0,1), (2,1), and (1,2) to create an irregular foundation. Add Extension 1: Place a cylindrical element (height: 1.5 cubes, diameter: 0.7 cubes) protruding upward from the cube at position (0,0), angled 15 degrees off vertical. Add Extension 2: Place a cubic protrusion (1 full cube) on top of the cube at position (2,1), but rotated 45 degrees around its vertical axis. Add Extension 3: Create a stepped rectangular element (dimensions: 0.5x1.5x2 cubes) extending horizontally from the side of the cube at position (1,2), angled 30 degrees downward. Ensure no two viewing angles produce similar silhouettes. Use 30-degree isometric perspective. Render foundation in primary blue (#2563eb), cylindrical extension in gray (#6b7280), cubic protrusion in amber (#fbbf24), and stepped element in purple (#8b5cf6). Add clean black outlines (3px width) and set against transparent background."

**Question Mapping**:
- Q324: Show at 0° → Answer shows 60° clockwise rotation
- Q325: Show at 0° → Answer shows 150° clockwise rotation  
- Q326: Show at 0° → Answer shows 75° counter-clockwise rotation

### 11. MR_interlocked_01.svg
**Used by Questions**: 327, 328 (2 questions)  
**Rotations needed**: 120°, 240°

**AI Generation Prompt**:
"Create an isometric 3D illustration of two distinct cubic blocks interlocked perpendicularly through each other, demonstrating a clear 3D intersection. Build Block 1 (horizontal orientation): Create a rectangular block using 3x1x1 cubes (3 cubes long, 1 cube wide, 1 cube high), positioned horizontally. Build Block 2 (vertical orientation): Create a rectangular block using 1x3x1 cubes (1 cube long, 3 cubes wide, 1 cube high), positioned to pass through the center of Block 1 at a 90-degree angle. The intersection: Both blocks pass through each other at their center points, creating a cross-like interlocking pattern when viewed from above. The center cube of each block occupies the same space, creating the interlock. Show clear gaps and spaces where the blocks don't touch, emphasizing the 3D interlocking mechanism. Use 30-degree isometric perspective that clearly shows both blocks and their perpendicular relationship. Render Block 1 in primary blue (#2563eb) and Block 2 in secondary teal (#0891b2) to distinguish them clearly. Add clean black outlines (3px width) and set against transparent background."

**Question Mapping**:
- Q327: Show at 0° → Answer shows 120° clockwise rotation
- Q328: Show at 0° → Answer shows 240° clockwise rotation

### 12. MR_multi_directional_01.svg
**Used by Questions**: 329, 330, 331 (3 questions)  
**Rotations needed**: 30°, 105°, 210°

**AI Generation Prompt**:
"Create an isometric 3D illustration of a central hub with six arms extending in multiple directions at various angles and lengths. Build central core: Create a 2x2x2 cube structure as the central hub. Add Extension 1 (upward): 3-cube arm extending straight up from the top center of the hub. Add Extension 2 (downward): 2-cube arm extending straight down from the bottom center of the hub. Add Extension 3 (front): 1-cube arm extending forward from the front face center. Add Extension 4 (back): 3-cube arm extending backward from the back face center. Add Extension 5 (left-diagonal): 2-cube arm extending at 45-degree angle upward and leftward from the top-left corner. Add Extension 6 (right-diagonal): 1-cube arm extending at 30-degree angle downward and rightward from the bottom-right corner. Each arm should have different length (1-3 cubes) and extend in a clearly different direction from the others. Use 30-degree isometric perspective showing maximum directional complexity. Render central hub in primary blue (#2563eb), and each arm in different colors: upward arm in green (#10b981), downward arm in red (#ef4444), front arm in yellow (#eab308), back arm in purple (#8b5cf6), left-diagonal arm in orange (#f97316), right-diagonal arm in pink (#ec4899). Add clean black outlines (3px width) and set against transparent background."

**Question Mapping**:
- Q329: Show at 0° → Answer shows 30° clockwise rotation
- Q330: Show at 0° → Answer shows 210° clockwise rotation
- Q331: Show at 0° → Answer shows 105° counter-clockwise rotation

### 13. MR_abstract_assembly_01.svg
**Used by Questions**: 332, 333, 334 (3 questions)  
**Rotations needed**: 72°, 144°, 288°

**AI Generation Prompt**:
"Create an isometric 3D illustration of an abstract spatial assembly with five distinct geometric components arranged in complex overlapping and floating relationships. Component 1: Large cubic element (2x2x1.5 cubes) as the base, positioned at ground level. Component 2: Cylindrical element (height: 2 cubes, diameter: 1 cube) positioned to intersect with the top-right corner of Component 1, with 1/3 of the cylinder overlapping the cube and 2/3 floating in space. Component 3: Irregular stepped element (resembling stairs but with uneven steps: 1-cube, 0.5-cube, 1.5-cube heights) positioned to connect Component 1 and Component 2 at a 30-degree angle. Component 4: Spherical element (diameter: 1.2 cubes) floating in space above and to the left of the assembly, connected to Component 1 by Component 5. Component 5: Thin connecting rod (0.2 cube diameter, 3 cubes length) at a 45-degree upward angle, linking Component 1 to Component 4. All components should maintain clear spatial relationships with varying heights, overlaps, and floating elements. Use 30-degree isometric perspective. Render each component in different colors: Component 1 in blue (#2563eb), Component 2 in gray (#6b7280), Component 3 in amber (#fbbf24), Component 4 in green (#10b981), Component 5 in red (#ef4444). Add clean black outlines (3px width) and set against transparent background."

**Question Mapping**:
- Q332: Show at 0° → Answer shows 72° clockwise rotation
- Q333: Show at 0° → Answer shows 288° clockwise rotation
- Q334: Show at 0° → Answer shows 144° counter-clockwise rotation

### 14. MR_irregular_polyomino_01.svg
**Used by Questions**: 335, 336 (2 questions)  
**Rotations needed**: 108°, 252°

**AI Generation Prompt**:
"Create an isometric 3D illustration of an irregular polyomino structure made from exactly 7 unit cubes connected face-to-face in a complex non-symmetric pattern. Arrange the cubes as follows: Start with Cube 1 at the origin (0,0). Place Cube 2 adjacent to the right side of Cube 1 at (1,0). Place Cube 3 adjacent to the top of Cube 1 at (0,1). Place Cube 4 adjacent to the top of Cube 2 at (1,1). Place Cube 5 adjacent to the right side of Cube 4 at (2,1). Place Cube 6 adjacent to the top of Cube 3 at (0,2). Place Cube 7 adjacent to the right side of Cube 6 at (1,2). This creates an irregular, asymmetric pattern that resembles an abstract letter or symbol but has no lines of symmetry. Each cube must be connected to at least one other cube by sharing a complete face (not just edges or corners). The resulting shape should look completely different from every rotation angle, making rotation identification challenging. Use 30-degree isometric perspective clearly showing all 7 cubes and their face-to-face connections. Render all cubes in primary blue (#2563eb) with subtle shading variations to show depth. Add clean black outlines (3px width) around all visible edges and set against transparent background. Emphasize the connected nature by ensuring no gaps between adjacent cube faces."

**Question Mapping**:
- Q335: Show at 0° → Answer shows 108° clockwise rotation
- Q336: Show at 0° → Answer shows 252° clockwise rotation

---

## Overlay Assets Needed

### Rotation Arrows
- `overlay_rotation_30cw.svg` - 30° clockwise arrow
- `overlay_rotation_45cw.svg` - 45° clockwise arrow  
- `overlay_rotation_60cw.svg` - 60° clockwise arrow
- `overlay_rotation_72cw.svg` - 72° clockwise arrow
- `overlay_rotation_90cw.svg` - 90° clockwise arrow
- `overlay_rotation_105cw.svg` - 105° clockwise arrow
- `overlay_rotation_108cw.svg` - 108° clockwise arrow
- `overlay_rotation_120cw.svg` - 120° clockwise arrow
- `overlay_rotation_135cw.svg` - 135° clockwise arrow
- `overlay_rotation_144cw.svg` - 144° clockwise arrow
- `overlay_rotation_150cw.svg` - 150° clockwise arrow
- `overlay_rotation_180.svg` - 180° arrow
- `overlay_rotation_210cw.svg` - 210° clockwise arrow
- `overlay_rotation_240cw.svg` - 240° clockwise arrow
- `overlay_rotation_252cw.svg` - 252° clockwise arrow
- `overlay_rotation_270cw.svg` - 270° clockwise arrow
- `overlay_rotation_288cw.svg` - 288° clockwise arrow

### Counter-clockwise variants
- `overlay_rotation_45ccw.svg` - 45° counter-clockwise arrow
- `overlay_rotation_75ccw.svg` - 75° counter-clockwise arrow  
- `overlay_rotation_90ccw.svg` - 90° counter-clockwise arrow
- `overlay_rotation_105ccw.svg` - 105° counter-clockwise arrow
- `overlay_rotation_144ccw.svg` - 144° counter-clockwise arrow

### Additional Overlays
- `overlay_highlight.svg` - Blue highlight for emphasis
- `overlay_shadow.svg` - Drop shadow for depth
- `overlay_grid.svg` - Reference grid
- `overlay_axis.svg` - Rotation axis indicator

---

## File Organization Structure

```
frontend/src/assets/images/spatial/mental_rotation/
├── base_images/
│   ├── MR_L_block_01.svg
│   ├── MR_T_block_01.svg
│   ├── MR_Z_block_01.svg
│   ├── MR_step_block_01.svg
│   ├── MR_U_block_01.svg
│   ├── MR_complex_L_01.svg
│   ├── MR_asymmetric_01.svg
│   ├── MR_multi_step_01.svg
│   ├── MR_corner_block_01.svg
│   ├── MR_complex_asymmetric_01.svg
│   ├── MR_interlocked_01.svg
│   ├── MR_multi_directional_01.svg
│   ├── MR_abstract_assembly_01.svg
│   └── MR_irregular_polyomino_01.svg
├── overlays/
│   ├── rotation_arrows/
│   │   ├── overlay_rotation_30cw.svg
│   │   ├── overlay_rotation_45cw.svg
│   │   └── ... (all rotation arrows)
│   └── effects/
│       ├── overlay_highlight.svg
│       ├── overlay_shadow.svg
│       ├── overlay_grid.svg
│       └── overlay_axis.svg
└── generated/
    ├── easy/
    ├── medium/
    └── hard/
```

## Image Creation Priority

### Phase 1 (Immediate - 5 images)
Focus on Easy level for quick testing:
1. MR_L_block_01.svg
2. MR_T_block_01.svg  
3. MR_Z_block_01.svg
4. MR_step_block_01.svg
5. MR_U_block_01.svg

### Phase 2 (Next - 4 images)
Medium level complexity:
6. MR_complex_L_01.svg
7. MR_asymmetric_01.svg
8. MR_multi_step_01.svg
9. MR_corner_block_01.svg

### Phase 3 (Advanced - 5 images)
Hard level complexity:
10. MR_complex_asymmetric_01.svg
11. MR_interlocked_01.svg
12. MR_multi_directional_01.svg
13. MR_abstract_assembly_01.svg
14. MR_irregular_polyomino_01.svg

## Technical Specifications

### SVG Requirements
- **Viewbox**: `0 0 512 512`
- **Background**: Transparent
- **Colors**: 
  - Primary: `#2563eb` (Blue-600)
  - Secondary: `#6b7280` (Gray-500)
  - Highlight: `#fbbf24` (Amber-400)
- **Stroke**: 3-4px black outlines
- **Style**: Clean isometric line art

### Isometric Guidelines
- **Angle**: 30° from horizontal
- **Ratio**: 1:1 axis scaling
- **Light source**: Top-left diagonal
- **Shadow**: Bottom-right direction

This guide provides everything needed to create the 13 base images plus overlays that will generate all 35 Mental Rotation questions!
