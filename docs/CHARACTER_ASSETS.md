# Character Assets Guidelines

This document outlines the guidelines and prompt templates for generating the full-body/transparent character assets for the Animated Character persona section.

## Technical Requirements
- **Format:** Transparent PNG or WebP.
- **Background:** Strictly removed (100% transparent).
- **Dimensions:** Consistent across all assets. Recommended: 1600x2400px or 1200x1800px.
- **Composition:** Full body or 3/4 body. The head should be positioned at the exact same relative Y-coordinate in all images so that crossfading between modes keeps the face stable.
- **Identity:** Must preserve Emil's face identity from the reference photo.
- **Cleanliness:** No text, no logos (unless relevant to outfit), no watermarks.
- **Optimization:** Use compressed WebP for the final website. Keep original high-res PNGs stored elsewhere.

## File Naming Convention
Place these inside `src/assets/images/character/`:
- `emil-character-executive.png`
- `emil-character-modern.png`
- `emil-character-creator.png`
- `emil-character-student.png`
- `emil-character-ai-dev.png`

---

## AI Prompt Templates

*Instruction for AI Generation:* Use the reference profile picture for the face (apply FaceID or ControlNet). Ensure lighting matches a studio environment. 

### 1. Executive
**Prompt:** `A professional full-body studio portrait of Emil wearing a sharp, tailored navy blue business suit, crisp white shirt, no tie, standing confidently. Clean lighting, neutral solid background (to be removed later). High-end corporate aesthetic, 8k resolution, highly detailed.`

### 2. Modern Cool Developer
**Prompt:** `A stylish full-body studio portrait of Emil wearing a minimalist premium black hoodie, dark slim-fit jeans, and clean white sneakers. Relaxed but confident posture. Silicon valley tech founder aesthetic. Clean studio lighting, neutral solid background.`

### 3. Creator / Photography
**Prompt:** `A dynamic full-body studio portrait of Emil wearing a casual unbuttoned overshirt with a plain t-shirt underneath. Holding a modern mirrorless camera in one hand. Creative, approachable vibe. Clean studio lighting, neutral solid background.`

### 4. Student / Engineering
**Prompt:** `A smart full-body studio portrait of Emil wearing a comfortable college sweater or varsity jacket, carrying a sleek laptop or backpack on one shoulder. youthful, focused engineering student aesthetic. Clean studio lighting, neutral solid background.`

### 5. AI Developer
**Prompt:** `A futuristic but grounded full-body studio portrait of Emil wearing sleek, avant-garde techwear (e.g., dark cyberpunk-subtle jacket, matte black fabrics). Calm, visionary posture. Subtle cool-toned studio lighting, neutral solid background.`
