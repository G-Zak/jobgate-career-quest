# Mental Rotation Questions Database

> **Generated**: September 3, 2025  
> **Source**: Django Management Command `create_mental_rotation_questions`  
> **Database**: SQLite (jobgate-career-quest/backend/db.sqlite3)  
> **Image Strategy**: Optimized reuse with 13 base images generating 35 questions

## Overview
Total Mental Rotation Questions: **35**

| Difficulty | Count | Base Images | Complexity Range |
|------------|-------|-------------|------------------|
| **Easy**   | 12    | 5           | 1-2              |
| **Medium** | 10    | 4           | 2-3              |
| **Hard**   | 13    | 5           | 3-5              |
| **Total**  | 35    | 13          | 1-5              |

## Base Image Usage Summary

| Base Image ID | Difficulty | Questions | Rotations Used |
|---------------|------------|-----------|----------------|
| `MR_L_block_01` | Easy | 3 | 0°, 90°, 180° |
| `MR_T_block_01` | Easy | 3 | 0°, 90°, 270° |
| `MR_Z_block_01` | Easy | 2 | 0°, 180° |
| `MR_step_block_01` | Easy | 2 | 0°, 270° |
| `MR_U_block_01` | Easy | 2 | 0°, 90° |
| `MR_complex_L_01` | Medium | 3 | 0°, 135°, 270° |
| `MR_asymmetric_01` | Medium | 3 | 0°, 270°, 315° |
| `MR_multi_step_01` | Medium | 2 | 0°, 180° |
| `MR_corner_block_01` | Medium | 2 | 0°, 135° |
| `MR_complex_asymmetric_01` | Hard | 3 | 60°, 150°, 285° |
| `MR_interlocked_01` | Hard | 2 | 120°, 240° |
| `MR_multi_directional_01` | Hard | 3 | 30°, 210°, 255° |
| `MR_abstract_assembly_01` | Hard | 3 | 72°, 288°, 216° |
| `MR_irregular_polyomino_01` | Hard | 2 | 108°, 252° |

---

## Quick Navigation

- [Easy Level Questions (12)](#easy-level-questions-12-questions)
- [Medium Level Questions (10)](#medium-level-questions-10-questions)  
- [Hard Level Questions (13)](#hard-level-questions-13-questions)

## Technical Notes

### Image Optimization Strategy
- **Base Images**: 13 unique SVG assets needed
- **Question Variations**: 2-3 questions per base image using different rotations
- **Asset Reduction**: ~62% fewer images needed vs. unique image per question
- **Transform System**: Dynamic rotation and overlay application
- **Render Pipeline**: Client-side SVG transformation for optimal performance

### Answer Option System
- **4 Options**: A, B, C, D for each question
- **Option Types**: Correct rotation, similar rotation, mirrored, scaled, different shape
- **Randomization**: Option positions can be remapped via `option_remap` field
- **Difficulty Scaling**: More subtle differences in Hard level questions

### Visual Style Guidelines
- **Colors**: Primary (#2563eb), Secondary (#6b7280), Highlight (#fbbf24)
- **Format**: SVG with transparent background
- **Perspective**: Consistent isometric projection (30° angle)
- **Size**: 512x512px minimum resolution

---

## Easy Level Questions (12 questions)

### Question 1 (ID: 302)

**Base Image:** `MR_L_block_01`

**Question Text:**
Which option shows the same L-shaped object rotated 90° clockwise around the vertical axis?

**Options:**
- **A:** Long arm points down, short arm points right
- **B:** Long arm points left, short arm points down
- **C:** Long arm points up, short arm points left
- **D:** Same as original orientation

**Correct Answer:** A

**Explanation:**
90° clockwise rotation moves the long arm from right to down, short arm from up to right.

**Technical Details:**
- Transforms: `{'main': {'rotation': 0}}`
- Overlay IDs: `['rotation_arrow_90cw']`
- Option Remap: `{}`
- Visual Style: `technical_3d`
- Complexity Score: 1

---

### Question 2 (ID: 303)

**Base Image:** `MR_L_block_01`

**Question Text:**
If you rotate this L-shaped object 180° around the vertical axis, which orientation results?

**Options:**
- **A:** Long arm points right, short arm points up (same as original)
- **B:** Long arm points left, short arm points down
- **C:** Long arm points down, short arm points right
- **D:** Long arm points up, short arm points left

**Correct Answer:** B

**Explanation:**
180° rotation flips the object completely: right→left, up→down.

**Technical Details:**
- Transforms: `{'main': {'rotation': 0}}`
- Overlay IDs: `['rotation_arrow_180']`
- Option Remap: `{}`
- Visual Style: `technical_3d`
- Complexity Score: 1

---

### Question 3 (ID: 304)

**Base Image:** `MR_L_block_01`

**Question Text:**
Looking at this L-shaped object, which option shows it rotated 90° counter-clockwise?

**Options:**
- **A:** Long arm points down, short arm points right
- **B:** Long arm points up, short arm points left
- **C:** Long arm points left, short arm points down
- **D:** Long arm points right, short arm points up (no change)

**Correct Answer:** B

**Explanation:**
90° counter-clockwise: right→up, up→left.

**Technical Details:**
- Transforms: `{'main': {'rotation': 0}}`
- Overlay IDs: `['rotation_arrow_90ccw']`
- Option Remap: `{}`
- Visual Style: `technical_3d`
- Complexity Score: 1

---

### Question 4 (ID: 305)

**Base Image:** `MR_T_block_01`

**Question Text:**
Which option shows this T-shaped object after a 90° clockwise rotation?

**Options:**
- **A:** Vertical bar on left, horizontal stem pointing right
- **B:** Horizontal bar on bottom, vertical stem pointing up
- **C:** Vertical bar on right, horizontal stem pointing left
- **D:** Same T orientation (no rotation)

**Correct Answer:** A

**Explanation:**
90° clockwise turns the top horizontal bar to the left vertical position.

**Technical Details:**
- Transforms: `{'main': {'rotation': 0}}`
- Overlay IDs: `['rotation_arrow_90cw']`
- Option Remap: `{}`
- Visual Style: `technical_3d`
- Complexity Score: 1

---

### Question 5 (ID: 306)

**Base Image:** `MR_T_block_01`

**Question Text:**
After rotating this T-shaped object 180°, what orientation do you see?

**Options:**
- **A:** Horizontal bar on top, stem pointing down (same)
- **B:** Horizontal bar on bottom, stem pointing up (upside-down T)
- **C:** Vertical bar on left, stem pointing right
- **D:** Vertical bar on right, stem pointing left

**Correct Answer:** B

**Explanation:**
180° rotation flips the T upside down: top bar moves to bottom, down stem moves to up.

**Technical Details:**
- Transforms: `{'main': {'rotation': 0}}`
- Overlay IDs: `['rotation_arrow_180']`
- Option Remap: `{}`
- Visual Style: `technical_3d`
- Complexity Score: 1

---

### Question 6 (ID: 307)

**Base Image:** `MR_T_block_01`

**Question Text:**
If this T-shaped object rotates 270° clockwise, which result appears?

**Options:**
- **A:** Vertical bar on left, horizontal stem pointing right
- **B:** Horizontal bar on bottom, vertical stem pointing up
- **C:** Vertical bar on right, horizontal stem pointing left
- **D:** Horizontal bar on top, vertical stem pointing down (same)

**Correct Answer:** C

**Explanation:**
270° clockwise (or 90° counter-clockwise) moves the top bar to the right vertical position.

**Technical Details:**
- Transforms: `{'main': {'rotation': 0}}`
- Overlay IDs: `['rotation_arrow_270cw']`
- Option Remap: `{}`
- Visual Style: `technical_3d`
- Complexity Score: 1

---

### Question 7 (ID: 308)

**Base Image:** `MR_Z_block_01`

**Question Text:**
Which option shows this Z-shaped object rotated 90° clockwise?

**Options:**
- **A:** S-shape orientation (rotated Z)
- **B:** Backward S-shape orientation
- **C:** Same Z orientation
- **D:** Upside-down Z orientation

**Correct Answer:** A

**Explanation:**
90° clockwise rotation of a Z creates an S-like shape.

**Technical Details:**
- Transforms: `{'main': {'rotation': 0}}`
- Overlay IDs: `['rotation_arrow_90cw']`
- Option Remap: `{}`
- Visual Style: `technical_3d`
- Complexity Score: 2

---

### Question 8 (ID: 309)

**Base Image:** `MR_Z_block_01`

**Question Text:**
After a 180° rotation, how does this Z-shaped object appear?

**Options:**
- **A:** Same Z orientation
- **B:** Backward Z (mirrored)
- **C:** S-shape orientation
- **D:** Backward S-shape orientation

**Correct Answer:** B

**Explanation:**
180° rotation creates a backward/mirrored Z shape.

**Technical Details:**
- Transforms: `{'main': {'rotation': 0}}`
- Overlay IDs: `['rotation_arrow_180']`
- Option Remap: `{}`
- Visual Style: `technical_3d`
- Complexity Score: 2

---

### Question 9 (ID: 310)

**Base Image:** `MR_step_block_01`

**Question Text:**
Which option shows this step-shaped object after 90° clockwise rotation?

**Options:**
- **A:** Step goes up from bottom to top
- **B:** Step goes down from top to bottom
- **C:** Step goes up from right to left
- **D:** Same step orientation (left to right up)

**Correct Answer:** A

**Explanation:**
90° clockwise rotation turns the horizontal step into a vertical step going upward.

**Technical Details:**
- Transforms: `{'main': {'rotation': 0}}`
- Overlay IDs: `['rotation_arrow_90cw']`
- Option Remap: `{}`
- Visual Style: `technical_3d`
- Complexity Score: 2

---

### Question 10 (ID: 311)

**Base Image:** `MR_step_block_01`

**Question Text:**
If this step-shaped object rotates 270° clockwise, what orientation results?

**Options:**
- **A:** Step goes up from left to right (same)
- **B:** Step goes up from right to left
- **C:** Step goes down from top to bottom
- **D:** Step goes up from bottom to top

**Correct Answer:** C

**Explanation:**
270° clockwise rotation creates a downward step from top to bottom.

**Technical Details:**
- Transforms: `{'main': {'rotation': 0}}`
- Overlay IDs: `['rotation_arrow_270cw']`
- Option Remap: `{}`
- Visual Style: `technical_3d`
- Complexity Score: 2

---

### Question 11 (ID: 312)

**Base Image:** `MR_U_block_01`

**Question Text:**
Which option shows this U-shaped object rotated 180°?

**Options:**
- **A:** U opens upward (same orientation)
- **B:** U opens downward (upside-down)
- **C:** U opens to the right
- **D:** U opens to the left

**Correct Answer:** B

**Explanation:**
180° rotation flips the U upside-down, so it opens downward.

**Technical Details:**
- Transforms: `{'main': {'rotation': 0}}`
- Overlay IDs: `['rotation_arrow_180']`
- Option Remap: `{}`
- Visual Style: `technical_3d`
- Complexity Score: 1

---

### Question 12 (ID: 313)

**Base Image:** `MR_U_block_01`

**Question Text:**
After rotating this U-shaped object 90° clockwise, which orientation do you see?

**Options:**
- **A:** U opens upward (same)
- **B:** U opens downward
- **C:** U opens to the right
- **D:** U opens to the left

**Correct Answer:** D

**Explanation:**
90° clockwise rotation turns the upward-opening U to open toward the left.

**Technical Details:**
- Transforms: `{'main': {'rotation': 0}}`
- Overlay IDs: `['rotation_arrow_90cw']`
- Option Remap: `{}`
- Visual Style: `technical_3d`
- Complexity Score: 1

---

## Medium Level Questions (10 questions)

### Question 1 (ID: 314)

**Base Image:** `MR_complex_L_01`

**Question Text:**
Which option shows this complex L-shaped object rotated 45° clockwise?

**Options:**
- **A:** L rotated 45° with extension in correct position
- **B:** L rotated 45° with extension in wrong position
- **C:** L rotated 90° instead of 45°
- **D:** Original L orientation (no rotation)

**Correct Answer:** A

**Explanation:**
45° rotation maintains the L shape while rotating the entire structure including the corner extension.

**Technical Details:**
- Transforms: `{'main': {'rotation': 0}}`
- Overlay IDs: `['rotation_arrow_45cw']`
- Option Remap: `{}`
- Visual Style: `technical_3d`
- Complexity Score: 3

---

### Question 2 (ID: 315)

**Base Image:** `MR_complex_L_01`

**Question Text:**
If this complex L-shaped object rotates 135° clockwise, which result appears?

**Options:**
- **A:** L orientation at 135° angle with extension properly positioned
- **B:** L orientation at 90° angle
- **C:** L orientation at 180° angle
- **D:** Extension separated from main L structure

**Correct Answer:** A

**Explanation:**
135° clockwise rotation places the L at a diagonal angle with all parts correctly oriented.

**Technical Details:**
- Transforms: `{'main': {'rotation': 0}}`
- Overlay IDs: `['rotation_arrow_135cw']`
- Option Remap: `{}`
- Visual Style: `technical_3d`
- Complexity Score: 3

---

### Question 3 (ID: 316)

**Base Image:** `MR_complex_L_01`

**Question Text:**
After a 90° counter-clockwise rotation of this complex L-shape, what do you observe?

**Options:**
- **A:** Extension at top-right of rotated L
- **B:** Extension at bottom-left of rotated L
- **C:** Extension at top-left of rotated L
- **D:** Extension at bottom-right of rotated L

**Correct Answer:** C

**Explanation:**
90° counter-clockwise moves the extension from its original position to the top-left of the rotated L.

**Technical Details:**
- Transforms: `{'main': {'rotation': 0}}`
- Overlay IDs: `['rotation_arrow_90ccw']`
- Option Remap: `{}`
- Visual Style: `technical_3d`
- Complexity Score: 3

---

### Question 4 (ID: 317)

**Base Image:** `MR_asymmetric_01`

**Question Text:**
Which option shows this asymmetric object rotated 90° clockwise?

**Options:**
- **A:** Object rotated 90° clockwise with features correctly positioned
- **B:** Object rotated 180° instead of 90°
- **C:** Object mirrored instead of rotated
- **D:** Original object orientation

**Correct Answer:** A

**Explanation:**
90° clockwise rotation of the asymmetric object maintains all features in their correct relative positions.

**Technical Details:**
- Transforms: `{'main': {'rotation': 0}}`
- Overlay IDs: `['rotation_arrow_90cw']`
- Option Remap: `{}`
- Visual Style: `technical_3d`
- Complexity Score: 4

---

### Question 5 (ID: 318)

**Base Image:** `MR_asymmetric_01`

**Question Text:**
What orientation results from rotating this asymmetric object 270° clockwise?

**Options:**
- **A:** Object at 270° clockwise position
- **B:** Object at 90° clockwise position
- **C:** Object at 180° position
- **D:** Object at original position

**Correct Answer:** A

**Explanation:**
270° clockwise rotation places the asymmetric object in the correct orientation with all features properly positioned.

**Technical Details:**
- Transforms: `{'main': {'rotation': 0}}`
- Overlay IDs: `['rotation_arrow_270cw']`
- Option Remap: `{}`
- Visual Style: `technical_3d`
- Complexity Score: 4

---

### Question 6 (ID: 319)

**Base Image:** `MR_asymmetric_01`

**Question Text:**
If you rotate this asymmetric object 45° counter-clockwise, which option is correct?

**Options:**
- **A:** Object at 45° counter-clockwise diagonal
- **B:** Object at 45° clockwise diagonal
- **C:** Object at 90° counter-clockwise
- **D:** Object remains in original position

**Correct Answer:** A

**Explanation:**
45° counter-clockwise creates a diagonal orientation with all asymmetric features correctly positioned.

**Technical Details:**
- Transforms: `{'main': {'rotation': 0}}`
- Overlay IDs: `['rotation_arrow_45ccw']`
- Option Remap: `{}`
- Visual Style: `technical_3d`
- Complexity Score: 4

---

### Question 7 (ID: 320)

**Base Image:** `MR_multi_step_01`

**Question Text:**
Which option shows this 3-level step object rotated 90° clockwise?

**Options:**
- **A:** Steps ascend from bottom to top vertically
- **B:** Steps ascend from top to bottom vertically
- **C:** Steps ascend from right to left horizontally
- **D:** Same horizontal left-to-right ascension

**Correct Answer:** A

**Explanation:**
90° clockwise rotation converts horizontal left-to-right steps into vertical bottom-to-top steps.

**Technical Details:**
- Transforms: `{'main': {'rotation': 0}}`
- Overlay IDs: `['rotation_arrow_90cw']`
- Option Remap: `{}`
- Visual Style: `technical_3d`
- Complexity Score: 3

---

### Question 8 (ID: 321)

**Base Image:** `MR_multi_step_01`

**Question Text:**
After rotating this 3-level step object 180°, what configuration appears?

**Options:**
- **A:** Steps ascend left to right (same as original)
- **B:** Steps ascend right to left (reversed)
- **C:** Steps ascend bottom to top vertically
- **D:** Steps ascend top to bottom vertically

**Correct Answer:** B

**Explanation:**
180° rotation reverses the step direction: originally left-to-right becomes right-to-left.

**Technical Details:**
- Transforms: `{'main': {'rotation': 0}}`
- Overlay IDs: `['rotation_arrow_180']`
- Option Remap: `{}`
- Visual Style: `technical_3d`
- Complexity Score: 3

---

### Question 9 (ID: 322)

**Base Image:** `MR_corner_block_01`

**Question Text:**
Which option shows this corner-shaped object rotated 90° clockwise?

**Options:**
- **A:** Corner rotated 90° with arms in new perpendicular directions
- **B:** Corner rotated 180° instead of 90°
- **C:** Corner mirrored but not rotated
- **D:** Original corner orientation

**Correct Answer:** A

**Explanation:**
90° clockwise rotation moves each arm of the corner to its new perpendicular position.

**Technical Details:**
- Transforms: `{'main': {'rotation': 0}}`
- Overlay IDs: `['rotation_arrow_90cw']`
- Option Remap: `{}`
- Visual Style: `technical_3d`
- Complexity Score: 3

---

### Question 10 (ID: 323)

**Base Image:** `MR_corner_block_01`

**Question Text:**
If this corner-shaped object rotates 135° clockwise, which result do you see?

**Options:**
- **A:** Corner at 135° diagonal with arms correctly oriented
- **B:** Corner at 90° orientation
- **C:** Corner at 180° orientation
- **D:** Corner at 45° orientation

**Correct Answer:** A

**Explanation:**
135° clockwise rotation places the corner shape at the correct diagonal angle with both arms properly positioned.

**Technical Details:**
- Transforms: `{'main': {'rotation': 0}}`
- Overlay IDs: `['rotation_arrow_135cw']`
- Option Remap: `{}`
- Visual Style: `technical_3d`
- Complexity Score: 3

---

## Hard Level Questions (13 questions)

### Question 1 (ID: 324)

**Base Image:** `MR_complex_asymmetric_01`

**Question Text:**
Which option shows this complex asymmetric assembly rotated 60° clockwise?

**Options:**
- **A:** Assembly correctly rotated 60° clockwise
- **B:** Assembly rotated 90° clockwise instead
- **C:** Assembly rotated 30° clockwise instead
- **D:** Assembly mirrored instead of rotated

**Correct Answer:** A

**Explanation:**
60° clockwise rotation maintains all relative positions of the complex asymmetric features.

**Technical Details:**
- Transforms: `{'main': {'rotation': 0}}`
- Overlay IDs: `['rotation_arrow_60cw']`
- Option Remap: `{}`
- Visual Style: `technical_3d`
- Complexity Score: 5

---

### Question 2 (ID: 325)

**Base Image:** `MR_complex_asymmetric_01`

**Question Text:**
After rotating this complex assembly 150° clockwise, what orientation appears?

**Options:**
- **A:** Assembly at 150° clockwise position with all features correctly placed
- **B:** Assembly at 135° clockwise position
- **C:** Assembly at 180° clockwise position
- **D:** Assembly at 120° clockwise position

**Correct Answer:** A

**Explanation:**
150° clockwise rotation places the complex assembly in the correct orientation with all asymmetric features properly positioned.

**Technical Details:**
- Transforms: `{'main': {'rotation': 0}}`
- Overlay IDs: `['rotation_arrow_150cw']`
- Option Remap: `{}`
- Visual Style: `technical_3d`
- Complexity Score: 5

---

### Question 3 (ID: 326)

**Base Image:** `MR_complex_asymmetric_01`

**Question Text:**
Which option represents this complex assembly after 75° counter-clockwise rotation?

**Options:**
- **A:** Assembly at 75° counter-clockwise with proper feature alignment
- **B:** Assembly at 90° counter-clockwise
- **C:** Assembly at 60° counter-clockwise
- **D:** Assembly at 45° counter-clockwise

**Correct Answer:** A

**Explanation:**
75° counter-clockwise rotation creates the correct diagonal orientation with all complex features in their proper relative positions.

**Technical Details:**
- Transforms: `{'main': {'rotation': 0}}`
- Overlay IDs: `['rotation_arrow_75ccw']`
- Option Remap: `{}`
- Visual Style: `technical_3d`
- Complexity Score: 5

---

### Question 4 (ID: 327)

**Base Image:** `MR_interlocked_01`

**Question Text:**
Which option shows this interlocked structure rotated 120° clockwise?

**Options:**
- **A:** Structure correctly rotated 120° with interlocks maintained
- **B:** Structure rotated 90° instead of 120°
- **C:** Structure rotated 135° instead of 120°
- **D:** Structure with interlocks separated (incorrect)

**Correct Answer:** A

**Explanation:**
120° clockwise rotation maintains the interlocked relationship while correctly positioning the entire structure.

**Technical Details:**
- Transforms: `{'main': {'rotation': 0}}`
- Overlay IDs: `['rotation_arrow_120cw']`
- Option Remap: `{}`
- Visual Style: `technical_3d`
- Complexity Score: 5

---

### Question 5 (ID: 328)

**Base Image:** `MR_interlocked_01`

**Question Text:**
After a 240° clockwise rotation of this interlocked structure, what do you observe?

**Options:**
- **A:** Structure at 240° clockwise with interlocks properly maintained
- **B:** Structure at 180° clockwise
- **C:** Structure at 270° clockwise
- **D:** Structure with broken interlocking relationship

**Correct Answer:** A

**Explanation:**
240° clockwise rotation (equivalent to 120° counter-clockwise) correctly positions the interlocked structure.

**Technical Details:**
- Transforms: `{'main': {'rotation': 0}}`
- Overlay IDs: `['rotation_arrow_240cw']`
- Option Remap: `{}`
- Visual Style: `technical_3d`
- Complexity Score: 5

---

### Question 6 (ID: 329)

**Base Image:** `MR_multi_directional_01`

**Question Text:**
Which option shows this multi-directional object rotated 30° clockwise?

**Options:**
- **A:** Object rotated 30° with all extensions correctly oriented
- **B:** Object rotated 45° instead of 30°
- **C:** Object rotated 60° instead of 30°
- **D:** Object with some extensions missing or misoriented

**Correct Answer:** A

**Explanation:**
30° clockwise rotation maintains all directional extensions in their correct relative positions.

**Technical Details:**
- Transforms: `{'main': {'rotation': 0}}`
- Overlay IDs: `['rotation_arrow_30cw']`
- Option Remap: `{}`
- Visual Style: `technical_3d`
- Complexity Score: 4

---

### Question 7 (ID: 330)

**Base Image:** `MR_multi_directional_01`

**Question Text:**
After rotating this multi-directional object 210° clockwise, which result appears?

**Options:**
- **A:** Object at 210° clockwise with all extensions properly positioned
- **B:** Object at 180° clockwise
- **C:** Object at 270° clockwise
- **D:** Object at 225° clockwise

**Correct Answer:** A

**Explanation:**
210° clockwise rotation correctly positions the multi-directional object with all extensions in their proper orientations.

**Technical Details:**
- Transforms: `{'main': {'rotation': 0}}`
- Overlay IDs: `['rotation_arrow_210cw']`
- Option Remap: `{}`
- Visual Style: `technical_3d`
- Complexity Score: 4

---

### Question 8 (ID: 331)

**Base Image:** `MR_multi_directional_01`

**Question Text:**
Which option represents this multi-directional object after 105° counter-clockwise rotation?

**Options:**
- **A:** Object at 105° counter-clockwise with extensions correctly aligned
- **B:** Object at 90° counter-clockwise
- **C:** Object at 120° counter-clockwise
- **D:** Object at 135° counter-clockwise

**Correct Answer:** A

**Explanation:**
105° counter-clockwise rotation places the multi-directional object in the correct position with all extensions properly oriented.

**Technical Details:**
- Transforms: `{'main': {'rotation': 0}}`
- Overlay IDs: `['rotation_arrow_105ccw']`
- Option Remap: `{}`
- Visual Style: `technical_3d`
- Complexity Score: 4

---

### Question 9 (ID: 332)

**Base Image:** `MR_abstract_assembly_01`

**Question Text:**
Which option shows this abstract spatial assembly rotated 72° clockwise?

**Options:**
- **A:** Assembly correctly rotated 72° clockwise with all spatial relationships preserved
- **B:** Assembly rotated 60° clockwise instead
- **C:** Assembly rotated 90° clockwise instead
- **D:** Assembly with altered spatial relationships (incorrect)

**Correct Answer:** A

**Explanation:**
72° clockwise rotation maintains all complex spatial relationships in this abstract assembly.

**Technical Details:**
- Transforms: `{'main': {'rotation': 0}}`
- Overlay IDs: `['rotation_arrow_72cw']`
- Option Remap: `{}`
- Visual Style: `technical_3d`
- Complexity Score: 5

---

### Question 10 (ID: 333)

**Base Image:** `MR_abstract_assembly_01`

**Question Text:**
After a 288° clockwise rotation of this abstract assembly, what orientation results?

**Options:**
- **A:** Assembly at 288° clockwise with complex spatial features intact
- **B:** Assembly at 270° clockwise
- **C:** Assembly at 300° clockwise
- **D:** Assembly with disrupted spatial relationships

**Correct Answer:** A

**Explanation:**
288° clockwise rotation (equivalent to 72° counter-clockwise) correctly preserves all abstract spatial relationships.

**Technical Details:**
- Transforms: `{'main': {'rotation': 0}}`
- Overlay IDs: `['rotation_arrow_288cw']`
- Option Remap: `{}`
- Visual Style: `technical_3d`
- Complexity Score: 5

---

### Question 11 (ID: 334)

**Base Image:** `MR_abstract_assembly_01`

**Question Text:**
Which option represents this abstract assembly after 144° counter-clockwise rotation?

**Options:**
- **A:** Assembly at 144° counter-clockwise with all features correctly positioned
- **B:** Assembly at 135° counter-clockwise
- **C:** Assembly at 150° counter-clockwise
- **D:** Assembly at 180° counter-clockwise

**Correct Answer:** A

**Explanation:**
144° counter-clockwise rotation accurately positions this complex abstract assembly while maintaining all spatial relationships.

**Technical Details:**
- Transforms: `{'main': {'rotation': 0}}`
- Overlay IDs: `['rotation_arrow_144ccw']`
- Option Remap: `{}`
- Visual Style: `technical_3d`
- Complexity Score: 5

---

## Implementation Status

### Database Status ✅
- [x] 35 Mental Rotation questions created and stored in SQLite database
- [x] Questions properly categorized by difficulty (Easy: 12, Medium: 10, Hard: 13)
- [x] All questions include visual content fields for image optimization
- [x] Proper relationships established with spatial reasoning test

### Asset Creation Status 🔄
- [ ] Create 13 base SVG images (see [Image Specifications](./MENTAL_ROTATION_IMAGE_SPECS.md))
- [ ] Implement SVG transformation system in frontend
- [ ] Create overlay assets (rotation arrows, highlights, etc.)
- [ ] Test image rendering pipeline

### Integration Status 📋
- [ ] Connect questions to React frontend components
- [ ] Implement SpatialImageRenderer for dynamic image generation
- [ ] Add question randomization and progress tracking
- [ ] Integrate with assessment scoring system

### Next Steps
1. **Create Phase 1 Images**: Start with 5 Easy level base images
2. **Build Image Renderer**: Implement SVG transformation system
3. **Test Question Flow**: Verify questions display correctly in UI
4. **Continue Categories**: Create Paper Folding, Cross-sections, etc.

---

*Generated by Django management command on September 3, 2025*  
*For technical specifications, see: [Mental Rotation Image Specs](./MENTAL_ROTATION_IMAGE_SPECS.md)*

### Question 12 (ID: 335)

**Base Image:** `MR_irregular_polyomino_01`

**Question Text:**
Which option shows this irregular polyomino rotated 108° clockwise?

**Options:**
- **A:** Polyomino correctly rotated 108° clockwise
- **B:** Polyomino rotated 90° clockwise instead
- **C:** Polyomino rotated 120° clockwise instead
- **D:** Polyomino rotated 135° clockwise instead

**Correct Answer:** A

**Explanation:**
108° clockwise rotation correctly positions the irregular polyomino with all segments properly oriented.

**Technical Details:**
- Transforms: `{'main': {'rotation': 0}}`
- Overlay IDs: `['rotation_arrow_108cw']`
- Option Remap: `{}`
- Visual Style: `technical_3d`
- Complexity Score: 5

---

### Question 13 (ID: 336)

**Base Image:** `MR_irregular_polyomino_01`

**Question Text:**
After rotating this irregular polyomino 252° clockwise, which result do you observe?

**Options:**
- **A:** Polyomino at 252° clockwise with all segments correctly arranged
- **B:** Polyomino at 270° clockwise
- **C:** Polyomino at 225° clockwise
- **D:** Polyomino at 240° clockwise

**Correct Answer:** A

**Explanation:**
252° clockwise rotation (equivalent to 108° counter-clockwise) accurately positions the irregular polyomino.

**Technical Details:**
- Transforms: `{'main': {'rotation': 0}}`
- Overlay IDs: `['rotation_arrow_252cw']`
- Option Remap: `{}`
- Visual Style: `technical_3d`
- Complexity Score: 5

---

