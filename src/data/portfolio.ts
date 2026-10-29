export interface Profile {
  name: string;
  shortName: string;
  title: string;
  email: string;
  location: string;
  github: string;
  linkedin: string;
  cv: string;
}

export const profile: Profile = {
  name: 'Joshua Odero Ogallo',
  shortName: 'Joshua Ogallo',
  title: 'Software engineer & digital creative',
  email: 'ogallo254@gmail.com',
  location: 'Nairobi, Kenya',
  github: 'https://github.com/ogallj',
  linkedin: 'https://www.linkedin.com/in/joshua-ogallo-9a2628251/',
  cv: '/joshua-ogallo-cv.pdf',
};

export interface Project {
  slug: string;
  title: string;
  category: string;
  summary: string;
  kind: 'system' | 'website';
  art: string;
  image?: string;
  liveUrl?: string;
  sourceUrl?: string;
  featured?: boolean;
  overview: string;
  focus: string[];
}

// Summaries describe the supplied project identities. They do not establish
// individual roles, implementation stacks, feature scope, or measured results.
export const projects: Project[] = [
  {
    slug: 'b-commerce',
    title: 'B-Commerce',
    category: 'Ecommerce platform',
    summary: 'An ecommerce platform for online retail.',
    kind: 'system',
    art: 'commerce',
    featured: true,
    overview:
      'B-Commerce is an ecommerce platform for online retail.',
    focus: ['Ecommerce', 'Online retail', 'Business software'],
  },
  {
    slug: 'b-officio',
    title: 'B-Officio',
    category: 'Employee management',
    summary: 'An employee management system for business teams.',
    kind: 'system',
    art: 'officio',
    featured: true,
    overview:
      'B-Officio is an employee management system. Its focus is the people-management side of business operations.',
    focus: ['Employee management', 'People operations', 'Business software'],
  },
  {
    slug: 'symu-salesforce',
    title: 'Symu Salesforce System',
    category: 'Sales management',
    summary: 'A sales management system.',
    kind: 'system',
    art: 'salesforce',
    featured: true,
    overview:
      'Symu Salesforce System is a sales management project focused on business operations.',
    focus: ['Sales management', 'Business operations', 'Business software'],
  },
  {
    slug: 'symu-finance',
    title: 'Symu Finance Management',
    category: 'Finance management',
    summary: 'A finance management system.',
    kind: 'system',
    art: 'finance',
    featured: true,
    overview:
      'Symu Finance Management is a business finance system focused on corporate finance operations.',
    focus: ['Finance management', 'Business operations', 'Business software'],
  },
  {
    slug: 'mcc-church-management',
    title: 'MCC Church Management',
    category: 'Church administration',
    summary: 'A management portal for church administration.',
    kind: 'system',
    art: 'mcc',
    image: '/images/mcc.webp',
    liveUrl: 'https://mcc-kisii.vercel.app/',
    featured: true,
    overview:
      'MCC Church Management is a church administration project with an MCC Admin management portal.',
    focus: ['Church administration', 'Community management', 'Management portal'],
  },
  {
    slug: 'tns-solutions',
    title: 'T&S Solutions',
    category: 'Business website',
    summary: 'A website for social enterprise and resource mobilization.',
    kind: 'website',
    art: 'website',
    image: '/images/tns.webp',
    liveUrl: 'https://thetnssols.com/',
    overview:
      'The T&S Solutions website presents a practice working across social enterprise and resource mobilization. The project imagery introduces its consultancy and community-impact work.',
    focus: ['Social enterprise', 'Resource mobilization', 'Public website'],
  },
  {
    slug: 'uhai-africa',
    title: 'Uhai Africa',
    category: 'Financial services website',
    summary: 'A website presenting insurance, loyalty services, and climate finance.',
    kind: 'website',
    art: 'website',
    image: '/images/uhai.webp',
    liveUrl: 'https://uhai.africa/',
    overview:
      'The Uhai website presents insurance, loyalty services, and climate-finance work.',
    focus: ['Insurance', 'Loyalty services', 'Climate finance'],
  },
  {
    slug: 'jooust-student-apprentice-hub',
    title: 'JOOUST Student Apprentice Hub',
    category: 'Education & climate initiative',
    summary: 'A website for student apprenticeships and climate action.',
    kind: 'website',
    art: 'website',
    image: '/images/jooust.webp',
    liveUrl: 'https://jooustsah.co.ke/',
    overview:
      'The JOOUST Student Apprentice Hub website introduces a student climate-action mentorship and apprenticeship initiative.',
    focus: ['Student apprenticeships', 'Climate action', 'Public website'],
  },
  {
    slug: 'student-safety-summit',
    title: 'Student Safety Summit',
    category: 'Event website',
    summary: 'An event website focused on university student safety.',
    kind: 'website',
    art: 'website',
    image: '/images/safety.webp',
    liveUrl: 'https://studentsafetysummit.africa/',
    overview:
      'The Student Safety Summit website presents a national university safety event. Its project imagery includes event information, speakers, an agenda, and registration.',
    focus: ['University safety', 'Event communication', 'Public website'],
  },
  {
    slug: 'innoecofood',
    title: 'InnoEcoFood',
    category: 'Research project website',
    summary: 'A public website for an aquaculture research project.',
    kind: 'website',
    art: 'website',
    image: '/images/innoeco.webp',
    liveUrl: 'https://innoecofood.vercel.app/index.html',
    overview:
      'InnoEcoFood is a public research-project website focused on aquaculture.',
    focus: ['Aquaculture', 'Research communication', 'Public website'],
  },
  {
    slug: 'the-hub-homa-bay',
    title: 'The Hub Homa Bay',
    category: 'Hospitality website',
    summary: 'A website for a local hospitality and services business.',
    kind: 'website',
    art: 'website',
    liveUrl: 'https://thehub-homabay.co.ke/',
    overview:
      'The Hub Homa Bay is a local business website presenting barber, restaurant, and car-wash services.',
    focus: ['Hospitality', 'Local business', 'Public website'],
  },
];

// This is brand experience, not an assertion of direct client relationships.
// Agency/employer credits belong with each project once its context is known.
export const brands: string[] = [
  'Coca-Cola Africa',
  'UNGA Group',
  'Junction Mall',
  'SGA Group',
  'Hillax Investment',
  'Baruchsoft Technologies',
  'Uhai Africa',
  'T&S Solutions',
  'VilageCAN',
  'Ogre Digital',
  'CGA',
  'Instaveg',
  'Tembea Institute',
  'Mustard Christian Centre',
  'Biospark',
  'The Hub Homa Bay',
  'JOOUST',
  'KWS',
];

export interface Experience {
  company: string;
  role: string;
  description: string;
}

export const experiences: Experience[] = [
  {
    company: 'Baruchsoft Technologies',
    role: 'Frontend Software Engineer & Digital Marketer',
    description:
      'Professional experience spanning frontend software engineering and digital marketing.',
  },
  {
    company: 'Socialmeds Digital Marketing Agency',
    role: 'Digital Creative',
    description: 'Digital creative work within a digital marketing agency.',
  },
  {
    company: 'Ogre Digital',
    role: 'Digital Marketer',
    description: 'Professional experience in digital marketing.',
  },
  {
    company: 'Freelancer.com',
    role: 'Freelance',
    description: 'Freelance project work through Freelancer.com.',
  },
];

export interface CreativeService {
  title: string;
  description: string;
}

export const creativeServices: CreativeService[] = [
  {
    title: 'Digital creative',
    description: 'Visual work for digital communication and marketing.',
  },
  {
    title: 'Brand content',
    description: 'Graphic and visual content for brand communication.',
  },
  {
    title: 'Digital marketing',
    description: 'Creative and content work within digital marketing projects.',
  },
];
