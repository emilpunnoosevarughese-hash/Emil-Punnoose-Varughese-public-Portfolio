import { Globe, Coffee, FileCode2, Smartphone, TerminalSquare, Shield, GitBranch, Cloud, Sparkles, BookOpen, Workflow } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface TutorialResource {
  id: string;
  name: string;
  url: string;
  description: string;
  isRecommended?: boolean;
}

export interface TutorialCategory {
  id: string;
  name: string;
  icon: LucideIcon;
  description: string;
  resources: TutorialResource[];
}

export const tutorialCategories: TutorialCategory[] = [
  {
    id: 'web',
    name: 'Web Development',
    icon: Globe,
    description: 'Foundational technologies for building the modern web.',
    resources: [
      {
        id: 'mdn',
        name: 'MDN Web Docs',
        url: 'https://developer.mozilla.org/',
        description: 'The ultimate, most accurate documentation for HTML, CSS, and JavaScript. An absolute must for any web developer.',
        isRecommended: true
      },
      {
        id: 'freecodecamp-web',
        name: 'freeCodeCamp',
        url: 'https://www.freecodecamp.org/',
        description: 'Interactive, project-based curriculum covering everything from responsive design to full-stack development. Completely free.'
      },
      {
        id: 'w3schools',
        name: 'W3Schools',
        url: 'https://www.w3schools.com/',
        description: 'A beginner-friendly platform with simple explanations, interactive examples, and quick reference guides.'
      }
    ]
  },
  {
    id: 'java',
    name: 'Java',
    icon: Coffee,
    description: 'Enterprise-grade backend development and object-oriented programming.',
    resources: [
      {
        id: 'oracle-java',
        name: 'Oracle Java Docs',
        url: 'https://docs.oracle.com/en/java/',
        description: 'The official documentation from the creators of Java. Essential for deep technical understanding of the JVM and core libraries.',
        isRecommended: true
      },
      {
        id: 'baeldung',
        name: 'Baeldung',
        url: 'https://www.baeldung.com/',
        description: 'High-quality, in-depth tutorials on Java, Spring, and enterprise development patterns. Highly respected in the industry.'
      },
      {
        id: 'geeksforgeeks-java',
        name: 'GeeksforGeeks Java',
        url: 'https://www.geeksforgeeks.org/java/',
        description: 'Great for learning data structures, algorithms, and solving competitive programming problems in Java.'
      }
    ]
  },
  {
    id: 'python',
    name: 'Python',
    icon: FileCode2,
    description: 'Versatile scripting, data science, and backend development.',
    resources: [
      {
        id: 'python-docs',
        name: 'Python Official Docs',
        url: 'https://docs.python.org/3/',
        description: 'The definitive guide to Python syntax, standard libraries, and language updates.',
        isRecommended: true
      },
      {
        id: 'real-python',
        name: 'Real Python',
        url: 'https://realpython.com/',
        description: 'Incredibly detailed and well-written tutorials covering everything from basic syntax to advanced web scraping and machine learning.'
      },
      {
        id: 'freecodecamp-python',
        name: 'freeCodeCamp Python',
        url: 'https://www.freecodecamp.org/learn/scientific-computing-with-python/',
        description: 'Free curriculum focusing on scientific computing, data analysis, and backend development with Python.'
      }
    ]
  },
  {
    id: 'flutter',
    name: 'Flutter & Dart',
    icon: Smartphone,
    description: 'Cross-platform mobile and web application development.',
    resources: [
      {
        id: 'flutter-docs',
        name: 'Flutter Documentation',
        url: 'https://docs.flutter.dev/',
        description: 'Official guides, widget catalogs, and architectural overviews directly from Google.',
        isRecommended: true
      },
      {
        id: 'dart-docs',
        name: 'Dart Documentation',
        url: 'https://dart.dev/guides',
        description: 'Comprehensive guides for the Dart language, covering sound null safety, async programming, and core libraries.'
      }
    ]
  },
  {
    id: 'cpp',
    name: 'C++',
    icon: TerminalSquare,
    description: 'High-performance systems programming and game development.',
    resources: [
      {
        id: 'cppreference',
        name: 'cppreference',
        url: 'https://en.cppreference.com/',
        description: 'The most accurate and complete C++ standard library reference available online.',
        isRecommended: true
      },
      {
        id: 'learncpp',
        name: 'LearnCpp',
        url: 'https://www.learncpp.com/',
        description: 'A free, comprehensive, and regularly updated tutorial series covering modern C++ from basics to advanced memory management.'
      }
    ]
  },
  {
    id: 'security',
    name: 'Cyber Security',
    icon: Shield,
    description: 'Network defense, ethical hacking, and application security.',
    resources: [
      {
        id: 'owasp',
        name: 'OWASP',
        url: 'https://owasp.org/',
        description: 'The Open Web Application Security Project. The gold standard for understanding web vulnerabilities and secure coding practices.',
        isRecommended: true
      },
      {
        id: 'portswigger',
        name: 'Web Security Academy',
        url: 'https://portswigger.net/web-security',
        description: 'Free, interactive web security training from the creators of Burp Suite. Absolutely essential for modern web developers.'
      },
      {
        id: 'tryhackme',
        name: 'TryHackMe',
        url: 'https://tryhackme.com/',
        description: 'Hands-on cyber security training through virtual, gamified labs. Great for learning network fundamentals and penetration testing.'
      },
      {
        id: 'htb-academy',
        name: 'Hack The Box Academy',
        url: 'https://academy.hackthebox.com/',
        description: 'Highly interactive, industry-standard training modules for advanced penetration testing and security engineering.'
      },
      {
        id: 'cisco-skills',
        name: 'Cisco Skills for All',
        url: 'https://skillsforall.com/',
        description: 'Free networking and cybersecurity courses from Cisco, perfect for building a strong infrastructure foundation.'
      }
    ]
  },
  {
    id: 'git',
    name: 'Git & GitHub',
    icon: GitBranch,
    description: 'Version control and collaborative software engineering.',
    resources: [
      {
        id: 'git-docs',
        name: 'Git Documentation',
        url: 'https://git-scm.com/doc',
        description: 'The official Git reference manual. The best place to understand the mechanics of version control.'
      },
      {
        id: 'github-skills',
        name: 'GitHub Skills',
        url: 'https://skills.github.com/',
        description: 'Interactive courses built directly into GitHub repositories to help you learn CI/CD, actions, and collaborative workflows.',
        isRecommended: true
      }
    ]
  },
  {
    id: 'cloud',
    name: 'Cloud Computing',
    icon: Cloud,
    description: 'Scalable infrastructure, serverless architecture, and deployment.',
    resources: [
      {
        id: 'microsoft-learn',
        name: 'Microsoft Learn',
        url: 'https://learn.microsoft.com/',
        description: 'Interactive, self-paced learning paths covering Azure infrastructure, AI services, and enterprise architecture.'
      },
      {
        id: 'aws-skill-builder',
        name: 'AWS Skill Builder',
        url: 'https://explore.skillbuilder.aws/',
        description: 'Official digital training from Amazon covering cloud fundamentals, serverless computing, and AWS certifications.',
        isRecommended: true
      },
      {
        id: 'google-cloud-skills',
        name: 'Google Cloud Skills Boost',
        url: 'https://www.cloudskillsboost.google/',
        description: 'Hands-on labs and learning paths for mastering Google Cloud Platform, BigQuery, and Kubernetes.'
      }
    ]
  },
  {
    id: 'ai',
    name: 'AI & ML',
    icon: Sparkles,
    description: 'Machine learning models, neural networks, and prompt engineering.',
    resources: [
      {
        id: 'hugging-face',
        name: 'Hugging Face Course',
        url: 'https://huggingface.co/course/',
        description: 'A completely free, comprehensive course on Natural Language Processing and using Transformer models.',
        isRecommended: true
      },
      {
        id: 'openai-docs',
        name: 'OpenAI Platform Docs',
        url: 'https://platform.openai.com/docs/',
        description: 'The official guide to integrating cutting-edge large language models into your applications.'
      },
      {
        id: 'deeplearning-ai',
        name: 'DeepLearning.AI',
        url: 'https://www.deeplearning.ai/',
        description: 'World-class machine learning education founded by Andrew Ng, offering foundational knowledge in deep learning.'
      }
    ]
  },
  {
    id: 'cs',
    name: 'Computer Science',
    icon: BookOpen,
    description: 'Foundational theory, algorithms, and system design.',
    resources: [
      {
        id: 'cs50',
        name: 'CS50 by Harvard',
        url: 'https://cs50.harvard.edu/x/',
        description: 'The legendary introduction to computer science. Teaches algorithmic thinking and problem-solving through C, Python, and SQL.',
        isRecommended: true
      },
      {
        id: 'odin-project',
        name: 'The Odin Project',
        url: 'https://www.theodinproject.com/',
        description: 'A free, open-source full-stack curriculum that teaches you how to build real-world applications from scratch.'
      }
    ]
  },
  {
    id: 'automations',
    name: 'Automations & Bots',
    icon: Workflow,
    description: 'Build powerful workflow automations and interactive chat bots.',
    resources: [
      {
        id: 'n8n',
        name: 'n8n Official Docs',
        url: 'https://docs.n8n.io/',
        description: 'The complete guide to n8n, a fair-code workflow automation tool. Learn how to connect APIs and build complex visual automations.',
        isRecommended: true
      },
      {
        id: 'telegram-bots',
        name: 'Telegram Bot API',
        url: 'https://core.telegram.org/bots',
        description: 'The official documentation for building custom Telegram Bots. Essential for creating seamless chat interfaces and automated notifications.',
        isRecommended: true
      }
    ]
  }
];
