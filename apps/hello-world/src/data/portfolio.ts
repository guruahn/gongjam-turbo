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
    title: '시니어 개발자 at Habitfactory',
    link: 'https://habitfactory.co',
    period: '2018 - 현재',
    description:
      '프론트/백엔드 구분이 없던 시절부터 다양한 경험을 쌓아왔고 시니어 개발자로서 프론트엔드 팀을 리드하고 있습니다.',
    tags: ['Vue', 'ReactJS', 'TypeScript', 'Node.js', 'AWS', 'AI'],
  },
  {
    id: '2',
    icon: '🚀',
    title: 'Full Stack Developer at Startup',
    link: '#',
    period: '2012 - 현재',
    description:
      '유저스토리랩, 굿닥, 뉴스젤리, 해빗팩토리 등 다양한 스타트업 환경에서 개발자로 일해왔습니다. 풀스택 개발, UI 프레임워크 개발, 프론트엔드 개발 등 다양한 경험을 쌓아왔습니다.',
    tags: ['React', 'Ruby on Rails', 'PHP', 'AWS', 'Vue', 'ASP.NET', 'UI/UX'],
  },
  // {
  //   id: '3',
  //   icon: '🌟',
  //   title: 'Open Source Contributions',
  //   link: 'https://github.com/guruahn',
  //   period: '2017 - Present',
  //   description: 'Active contributor to Vue.js ecosystem and various open-source projects. Maintained popular npm packages with 50K+ weekly downloads and resolved 200+ issues.',
  //   tags: ['Vue', 'JavaScript', 'Open Source'],
  // },
  {
    id: '3',
    icon: '🎓',
    title: '기계항공공항부 졸업',
    period: '2000 - 2007',
    description: '',
    // tags: ['Algorithms', 'Data Structures', 'Distributed Systems'],
  },
];
