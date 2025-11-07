// Portfolio item interface
export interface PortfolioItem {
  id: string;
  icon: string;
  title: string;
  link?: string;
  period: string;
  description: string;
  tags?: string[];
}

// Tech stack interface
export interface TechCategory {
  name: string;
  items: string[];
}

// Portfolio data
export const portfolio: PortfolioItem[] = [
  {
    id: '1',
    icon: '💼',
    title: 'Senior Software Engineer at Tech Company',
    link: '#',
    period: '2020 - Present',
    description: 'Leading full-stack development initiatives, architecting microservices, and mentoring junior developers. Implemented scalable solutions serving millions of users with 99.9% uptime.',
    tags: ['Vue3', 'TypeScript', 'Node.js', 'AWS'],
  },
  {
    id: '2',
    icon: '🚀',
    title: 'Full Stack Developer at Startup',
    link: '#',
    period: '2018 - 2020',
    description: 'Built MVPs from scratch, implemented real-time features, and optimized application performance. Contributed to 3x user growth through innovative features and seamless UX.',
    tags: ['React', 'Python', 'Docker', 'PostgreSQL'],
  },
  {
    id: '3',
    icon: '🌟',
    title: 'Open Source Contributions',
    link: 'https://github.com/guruahn',
    period: '2017 - Present',
    description: 'Active contributor to Vue.js ecosystem and various open-source projects. Maintained popular npm packages with 50K+ weekly downloads and resolved 200+ issues.',
    tags: ['Vue', 'JavaScript', 'Open Source'],
  },
  {
    id: '4',
    icon: '🎓',
    title: 'Computer Science Degree',
    period: '2014 - 2018',
    description: 'Bachelor of Science in Computer Science with focus on software engineering, algorithms, and distributed systems. Graduated with honors and published research on web performance optimization.',
    tags: ['Algorithms', 'Data Structures', 'Distributed Systems'],
  },
];

// Tech stack data
export const techStack: TechCategory[] = [
  {
    name: 'Frontend',
    items: ['Vue', 'React', 'TypeScript', 'Tailwind CSS'],
  },
  {
    name: 'Backend',
    items: ['Node.js', 'Python', 'PostgreSQL', 'Redis'],
  },
];
