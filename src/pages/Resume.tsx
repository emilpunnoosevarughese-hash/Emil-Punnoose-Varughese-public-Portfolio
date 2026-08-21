import { useRef } from 'react';
import { Download, Image as ImageIcon, MapPin, Mail, Phone, Code, Shield, Brain, Laptop, Award, Layout } from 'lucide-react';
import { Github, Linkedin } from '../components/ui/SocialIcons';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import profileImage from '../assets/images/profile/aboutme.webp';

export function Resume() {
  const resumeRef = useRef<HTMLDivElement>(null);

  const downloadPDF = async () => {
    if (!resumeRef.current) return;
    try {
      const canvas = await html2canvas(resumeRef.current, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('Emil_Resume.pdf');
    } catch (error) {
      console.error('Error generating PDF', error);
    }
  };

  const downloadImage = async () => {
    if (!resumeRef.current) return;
    try {
      const canvas = await html2canvas(resumeRef.current, { scale: 2, useCORS: true });
      const link = document.createElement('a');
      link.download = 'Emil_Resume.webp';
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Error generating Image', error);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)] pt-24 pb-12 font-sans">
      <div className="max-w-5xl mx-auto px-4 mb-8 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Resume Preview</h1>
        <div className="flex space-x-4">
          <button onClick={downloadImage} className="flex items-center px-4 py-2 bg-[var(--color-surface)] border border-white/10 text-[var(--color-text-primary)] rounded-lg hover:bg-white/5 transition-colors shadow-sm font-medium">
            <ImageIcon className="w-4 h-4 mr-2" /> Download Image
          </button>
          <button onClick={downloadPDF} className="flex items-center px-4 py-2 bg-primary text-black rounded-lg hover:bg-primary/90 transition-colors shadow-sm font-medium">
            <Download className="w-4 h-4 mr-2" /> Download PDF
          </button>
        </div>
      </div>

      {/* The Resume Document - A4 Aspect Ratio */}
      <div className="max-w-[850px] mx-auto overflow-x-auto shadow-2xl rounded-xl ring-1 ring-black/5 bg-white">
        <div ref={resumeRef} className="bg-white w-[850px] min-h-[1200px] p-0 flex text-gray-800">
          
          {/* Left Sidebar (30%) */}
          <div className="w-[32%] bg-slate-50 border-r border-slate-200 px-6 py-10 flex flex-col">
            {/* Profile Picture */}
            <div className="flex justify-center mb-6">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-md">
                <img src={profileImage} alt="Emil" className="w-full h-full object-cover" crossOrigin="anonymous" />
              </div>
            </div>
            
            {/* Contact */}
            <div className="mb-8">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 border-b border-slate-200 pb-2">Contact</h2>
              <div className="space-y-3 text-sm text-slate-600">
                <div className="flex items-center"><Mail className="w-4 h-4 mr-3 text-blue-600 flex-shrink-0" /> <span className="truncate">@emilpunnoosevarughese</span></div>
                <div className="flex items-center"><Phone className="w-4 h-4 mr-3 text-blue-600 flex-shrink-0" /> <span>+91 89210 54722</span></div>
                <div className="flex items-center"><MapPin className="w-4 h-4 mr-3 text-blue-600 flex-shrink-0" /> <span>India</span></div>
                <div className="flex items-center"><Github className="w-4 h-4 mr-3 text-blue-600 flex-shrink-0" /> <span className="truncate text-xs">github.com/emilpunnoosevarughese-hash</span></div>
                <div className="flex items-center"><Linkedin className="w-4 h-4 mr-3 text-blue-600 flex-shrink-0" /> <span className="truncate text-xs">linkedin.com/in/emil-punnoose-varughese-86798032b/</span></div>
              </div>
            </div>

            {/* Technical Skills */}
            <div className="mb-8">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 border-b border-slate-200 pb-2">Technical Skills</h2>
              
              <div className="mb-4">
                <h3 className="text-xs font-semibold text-slate-700 mb-2">Programming</h3>
                <div className="flex flex-wrap gap-1.5">
                  {['Python', 'Dart', 'Flutter', 'C', 'C++', 'JavaScript', 'HTML5', 'CSS3', 'SQL'].map(skill => (
                    <span key={skill} className="px-2 py-1 bg-white border border-slate-200 text-slate-600 text-[10px] rounded-md font-medium shadow-sm">{skill}</span>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <h3 className="text-xs font-semibold text-slate-700 mb-2">Tools</h3>
                <div className="flex flex-wrap gap-1.5">
                  {['Git', 'GitHub', 'VS Code', 'Android Studio', 'Linux'].map(skill => (
                    <span key={skill} className="px-2 py-1 bg-white border border-slate-200 text-slate-600 text-[10px] rounded-md font-medium shadow-sm">{skill}</span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-semibold text-slate-700 mb-2">Cybersecurity</h3>
                <div className="flex flex-wrap gap-1.5">
                  {['Network Security', 'Ethical Hacking', 'Linux Admin', 'Security Best Practices'].map(skill => (
                    <span key={skill} className="px-2 py-1 bg-white border border-slate-200 text-slate-600 text-[10px] rounded-md font-medium shadow-sm">{skill}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Soft Skills */}
            <div className="mb-8">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 border-b border-slate-200 pb-2">Soft Skills</h2>
              <ul className="text-sm text-slate-600 space-y-1">
                <li>• Problem Solving</li>
                <li>• Teamwork & Leadership</li>
                <li>• Critical Thinking</li>
                <li>• Fast Learner</li>
                <li>• Adaptability</li>
                <li>• Communication</li>
              </ul>
            </div>
            
            {/* Interests */}
            <div>
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 border-b border-slate-200 pb-2">Interests</h2>
              <div className="flex flex-wrap gap-1.5">
                {['AI & ML', 'Cybersecurity', 'Electronics', 'Embedded Systems', 'Cloud Computing'].map(skill => (
                  <span key={skill} className="px-2 py-1 bg-slate-100 text-slate-500 text-[10px] rounded-md">{skill}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Content (68%) */}
          <div className="w-[68%] px-10 py-12 flex flex-col bg-white">
            
            {/* Header / Name */}
            <div className="mb-8 relative">
              <div className="absolute -top-12 -right-10 w-48 h-48 bg-blue-50 rounded-full blur-3xl opacity-60"></div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none mb-2">
                EMIL <span className="text-blue-600">PUNNOOSE</span>
              </h1>
              <h2 className="text-lg font-medium text-slate-500">
                Mechanical Eng. Student | Python & Flutter Dev | Cybersecurity
              </h2>
            </div>

            {/* Professional Summary */}
            <div className="mb-8">
              <p className="text-sm text-slate-600 leading-relaxed">
                Passionate Mechanical Engineering student with a strong interest in software development, cybersecurity, artificial intelligence, electronics, and electrical systems. Completed a six-month cybersecurity course and continuously expanding expertise in Python, Flutter, modern web technologies, and AI-powered applications. Enjoy building scalable software, automation tools, and innovative engineering solutions while continuously learning emerging technologies.
              </p>
            </div>

            {/* Education */}
            <div className="mb-8">
              <h2 className="text-lg font-bold text-slate-800 uppercase tracking-wider mb-4 border-b-2 border-blue-100 pb-1 flex items-center">
                <Award className="w-5 h-5 mr-2 text-blue-600" /> Education & Certifications
              </h2>
              
              <div className="mb-4">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-slate-800">Bachelor of Mechanical Engineering (7th Sem)</h3>
                  <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">Current</span>
                </div>
                <p className="text-sm text-slate-500">University Name, Expected Graduation Year</p>
              </div>

              <div>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-slate-800">Cybersecurity Certification</h3>
                  <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">Completed</span>
                </div>
                <p className="text-sm text-slate-500">6-Month Comprehensive Cybersecurity & Ethical Hacking Course</p>
              </div>
            </div>

            {/* Projects */}
            <div className="mb-8">
              <h2 className="text-lg font-bold text-slate-800 uppercase tracking-wider mb-4 border-b-2 border-blue-100 pb-1 flex items-center">
                <Code className="w-5 h-5 mr-2 text-blue-600" /> Featured Projects
              </h2>
              
              <div className="space-y-4">
                <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-200 transition-colors">
                  <div className="flex items-center mb-1">
                    <Layout className="w-4 h-4 mr-2 text-blue-500" />
                    <h3 className="font-bold text-slate-800">EdgeFX Portfolio</h3>
                  </div>
                  <p className="text-sm text-slate-600 ml-6">
                    Modern AI-inspired portfolio built using Flutter, animations, responsive UI, and interactive 3D elements.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-200 transition-colors">
                  <div className="flex items-center mb-1">
                    <Laptop className="w-4 h-4 mr-2 text-blue-500" />
                    <h3 className="font-bold text-slate-800">Python Automation Toolkit</h3>
                  </div>
                  <p className="text-sm text-slate-600 ml-6">
                    Automation scripts for file management, productivity, and complex system administration tasks.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-200 transition-colors">
                  <div className="flex items-center mb-1">
                    <Shield className="w-4 h-4 mr-2 text-blue-500" />
                    <h3 className="font-bold text-slate-800">Cybersecurity Lab</h3>
                  </div>
                  <p className="text-sm text-slate-600 ml-6">
                    Practical networking, Linux administration, ethical hacking, vulnerability assessment, and security exercises.
                  </p>
                </div>
              </div>
            </div>

            {/* Currently Learning */}
            <div>
              <h2 className="text-lg font-bold text-slate-800 uppercase tracking-wider mb-4 border-b-2 border-blue-100 pb-1 flex items-center">
                <Brain className="w-5 h-5 mr-2 text-blue-600" /> Currently Exploring
              </h2>
              <div className="grid grid-cols-2 gap-2 text-sm text-slate-600">
                <div className="flex items-center">• Artificial Intelligence</div>
                <div className="flex items-center">• Cloud Computing</div>
                <div className="flex items-center">• Machine Learning</div>
                <div className="flex items-center">• DevOps & Docker</div>
                <div className="flex items-center">• Backend Dev (REST APIs)</div>
                <div className="flex items-center">• 3D Graphics</div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
