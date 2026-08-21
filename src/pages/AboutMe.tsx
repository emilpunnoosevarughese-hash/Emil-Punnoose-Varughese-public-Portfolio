import { motion } from 'framer-motion';
import { Download, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import aboutMeImage from '../assets/images/profile/aboutme.webp';
import { useEffect } from 'react';

export function AboutMe() {
  useEffect(() => {
    window.scrollTo(0, 0); // Ensure page starts at top
  }, []);

  const image = aboutMeImage;

  return (
    <div className="min-h-screen bg-[var(--color-background)] relative pt-24 pb-24 overflow-hidden">
      
      {/* Back Button */}
      <div className="absolute top-8 left-8 z-50">
        <Link 
          to="/"
          className="flex items-center space-x-2 text-gray-400 hover:text-white px-4 py-2 rounded-full glass-effect border border-white/10 transition-all duration-300 hover:scale-105"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium tracking-wider uppercase">Back</span>
        </Link>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full flex flex-col items-center">
        
        {/* Profile Picture & Name Block */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center mb-12"
        >
          <div className="w-64 h-64 md:w-80 md:h-80 rounded-2xl overflow-hidden shadow-2xl mb-4 border border-[var(--color-border)] bg-[var(--color-surface)]">
            <img 
              src={image} 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          </div>
          <h3 
            className="text-3xl md:text-4xl text-[var(--color-text-primary)]"
            style={{ fontFamily: 'cursive' }}
          >
            Emil Punnoose Varughese
          </h3>
        </motion.div>

        {/* The About Myself Card */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full bg-[#111] rounded-3xl p-8 md:p-12 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
        >
          <div className="flex items-center justify-center mb-10">
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
              About Myself <span className="inline-block w-1.5 h-10 bg-white ml-1 animate-pulse" />
            </h2>
          </div>

          <div className="space-y-6 text-gray-300 text-sm md:text-base leading-relaxed font-sans">
            <p>
              I'm a 7th semester Mechanical Engineering student with a strong passion for technology, innovation, and solving real-world problems through software and engineering. While my academic foundation is in mechanical engineering, my curiosity has led me to explore electronics, electrical systems, computer science, and modern software development.
            </p>
            <p>
              Over the past several months, I've dedicated myself to learning programming, cybersecurity, and cross-platform application development. I completed a 6-month cybersecurity course, where I gained practical knowledge of network security, ethical hacking fundamentals, system security, and security best practices.
            </p>
            <p>
              Programming has become one of my biggest passions. I enjoy building applications, automating tasks, and continuously expanding my technical skills. My primary language is Python, and I also work with Dart (Flutter), JavaScript, C++, C, HTML, CSS, SQL, and Git. I'm constantly exploring new technologies, frameworks, and development tools to improve my capabilities.
            </p>
            <p>
              I enjoy creating modern, responsive applications with Flutter, developing automation scripts with Python, and experimenting with AI-powered tools that enhance productivity and user experiences. I also have a growing interest in cloud technologies, Linux systems, DevOps practices, and cybersecurity research.
            </p>
            <p>
              Beyond coding, I'm passionate about electronics, embedded systems, electrical engineering concepts, hardware projects, and understanding how software integrates with physical systems. I believe the combination of engineering principles and software development creates endless opportunities for innovation.
            </p>
            <p>
              I consider myself a lifelong learner who enjoys taking on challenging projects, learning emerging technologies, and transforming ideas into practical solutions. Whether it's developing applications, exploring cybersecurity, designing user-focused experiences, or building technical projects, I'm always motivated to improve and push my skills further.
            </p>

            <h3 className="text-2xl font-bold text-white mt-10 mb-4 tracking-tight">Technical Skills</h3>
            <ul className="space-y-3 list-disc list-inside text-gray-300">
              <li><strong className="text-[var(--color-text-primary)]">Programming:</strong> Python, Dart (Flutter), JavaScript, C++, C, HTML5, CSS3, SQL</li>
              <li><strong className="text-[var(--color-text-primary)]">Frameworks & Tools:</strong> Flutter, Git, GitHub, VS Code, Android Studio</li>
              <li><strong className="text-[var(--color-text-primary)]">Cybersecurity:</strong> Network Security, Ethical Hacking Fundamentals, Linux, Basic Penetration Testing</li>
              <li><strong className="text-[var(--color-text-primary)]">Engineering:</strong> Mechanical Engineering, Electronics, Electrical Systems, Embedded Systems</li>
              <li><strong className="text-[var(--color-text-primary)]">Currently Learning:</strong> Artificial Intelligence, Machine Learning, Cloud Computing, DevOps, Backend Development, 3D Graphics, and Advanced Cybersecurity</li>
            </ul>

            <p className="pt-4 italic text-gray-400">
              I'm always excited to collaborate, learn from experienced developers, and contribute to meaningful projects that combine engineering, software, and innovation.
            </p>
          </div>
        </motion.div>

        {/* Download Resume Button */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-12"
        >
          <Link to="/resume" className="flex items-center space-x-3 px-8 py-4 bg-[#1a1a1a] hover:bg-[#222] text-white rounded-xl border border-white/10 transition-all duration-300 hover:scale-105">
            <Download className="w-5 h-5 opacity-70" />
            <span className="font-medium tracking-wide">View Resume</span>
          </Link>
        </motion.div>

      </div>
    </div>
  );
}
