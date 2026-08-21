const fs = require('fs');
const files = [
  'src/components/Navigation.tsx', 
  'src/components/sections/AnimatedCharacter.tsx', 
  'src/components/ui/CustomCursor.tsx', 
  'src/components/ui/LoadingSequence.tsx', 
  'src/components/ui/ParallaxImage.tsx', 
  'src/contexts/ThemeContext.tsx', 
  'src/pages/Home.tsx',
  'src/components/sections/Hero.tsx',
  'src/components/sections/ContactSection.tsx',
  'src/components/sections/Projects.tsx',
  'src/components/sections/PhotographySection.tsx',
  'src/components/sections/TutorialSection.tsx',
  'src/components/ui/SectionTitle.tsx',
  'src/components/ui/PremiumCard.tsx',
  'src/components/Footer.tsx',
  'src/components/ui/ThemeToggle.tsx'
];
for(const f of files) {
  if (fs.existsSync(f)) {
    let c = fs.readFileSync(f, 'utf8');
    c = "import React, { useState, useEffect, useRef, createContext, useContext } from 'react';\n" + c;
    fs.writeFileSync(f, c);
  }
}
