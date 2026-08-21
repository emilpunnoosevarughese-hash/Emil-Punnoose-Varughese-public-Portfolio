import imgMain from '../assets/images/profile/emil-main.webp';
import imgCreator from '../assets/images/profile/emil-creator.webp';
import imgPhotography from '../assets/images/profile/emil-photography.webp';
import imgStudent from '../assets/images/profile/emil-student.webp';
import imgAiDev from '../assets/images/profile/emil-artwork-clean.webp';

import charExecutive from '../assets/images/character/emil-character-executive.webp';
import charModern from '../assets/images/character/emil-character-modern.webp';
import charCreator from '../assets/images/character/emil-character-creator.webp';
import charStudent from '../assets/images/character/emil-character-student.webp';
import charAiDev from '../assets/images/character/emil-character-ai-dev.webp';

export interface CharacterMode {
  id: string;
  title: string;
  subtitle: string;
  image: string; // The future transparent full-body asset path
  fallbackImage: string; // The current framed profile photo
  outfitLabel: string;
  accentColor: string;
  tags: string[];
}

// Use the imported transparent assets
const ASSETS = {
  executive: charExecutive,
  modern: charModern,
  creator: charCreator,
  student: charStudent,
  ai: charAiDev,
};

export const characterModes: CharacterMode[] = [
  {
    id: 'executive',
    title: 'Executive',
    subtitle: 'Strategic Leadership & Management',
    image: ASSETS.executive,
    fallbackImage: imgMain,
    outfitLabel: 'Tailored Suit',
    accentColor: 'from-blue-500/20 to-transparent',
    tags: ['Leadership', 'Strategy', 'Professional']
  },
  {
    id: 'modern-cool',
    title: 'Modern Cool',
    subtitle: 'Startup Founder & Tech Innovator',
    image: ASSETS.modern,
    fallbackImage: imgPhotography, // using photography as modern cool fallback for now or vice-versa
    outfitLabel: 'Tech Casual',
    accentColor: 'from-indigo-500/20 to-transparent',
    tags: ['Innovation', 'Startup', 'Agile']
  },
  {
    id: 'creator',
    title: 'Creator / Photo',
    subtitle: 'Visual Storytelling & Media Production',
    image: ASSETS.creator,
    fallbackImage: imgCreator,
    outfitLabel: 'Overshirt & Camera',
    accentColor: 'from-amber-500/20 to-transparent',
    tags: ['Creative', 'Media', 'Design']
  },
  {
    id: 'student',
    title: 'Student / Eng',
    subtitle: 'Continuous Learning & Systems',
    image: ASSETS.student,
    fallbackImage: imgStudent,
    outfitLabel: 'Varsity & Backpack',
    accentColor: 'from-emerald-500/20 to-transparent',
    tags: ['Learning', 'Systems', 'Engineering']
  },
  {
    id: 'ai-developer',
    title: 'AI Developer',
    subtitle: 'Machine Learning & Automation',
    image: ASSETS.ai,
    fallbackImage: imgAiDev,
    outfitLabel: 'Cyber-Subtle Techwear',
    accentColor: 'from-purple-500/20 to-transparent',
    tags: ['AI', 'Data', 'Future']
  }
];
