import mainProfile from '../assets/images/profile/firstimage.webp';
import fallbackProfile from '../assets/images/profile/emil-face-reference.webp';
import modernCool from '../assets/images/profile/emil-modern-cool.webp';
import creator from '../assets/images/profile/emil-creator.webp';
import artwork from '../assets/images/profile/emil-artwork-clean.webp';
import student from '../assets/images/profile/emil-student.webp';
import photography from '../assets/images/profile/emil-photography.webp';
import extra from '../assets/images/profile/emil-extra.jpg';

export const profileData = {
  name: "Emil Punnoose Varughese",
  location: "Pathanamthitta, Kerala, India",
  roles: [
    "Mechanical Engineering student",
    "Developer",
    "AI tools learner",
    "Cybersecurity learner",
    "Automation builder"
  ],
  bio: "I am passionate about clean code, beautiful interfaces, and innovative solutions. With a deep understanding of modern web technologies, I aim to craft digital products that stand out from the crowd.",
  images: {
    main: mainProfile,
    fallback: fallbackProfile,
    identities: [
      { id: 'exec', title: 'Executive Mode', src: mainProfile },
      { id: 'modern', title: 'Modern Cool', src: modernCool },
      { id: 'creator', title: 'Creator Mode', src: creator },
      { id: 'artwork', title: 'Artwork Mode', src: artwork },
      { id: 'student', title: 'Student Mode', src: student },
      { id: 'photo', title: 'Photography Mode', src: photography }
    ],
    photography,
    extra,
    creator,
    artwork
  },
  skills: ['React', 'TypeScript', 'Node.js', 'Python', 'TailwindCSS', 'AWS', 'Docker'],
};
