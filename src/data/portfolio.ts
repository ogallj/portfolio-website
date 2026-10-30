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
  mockup?: string;
  website?: string;
  status?: string;
  liveUrl?: string;
  sourceUrl?: string;
  featured?: boolean;
  overview: string;
  focus: string[];
}

// System descriptions reflect the owner's supplied identities, scope, and status.
// Individual roles, implementation stacks, and measured outcomes are not inferred.
export const projects: Project[] = [
  {
    slug: 'b-commerce',
    title: 'B-Commerce',
    category: 'Ecommerce store',
    summary: 'An ecommerce store for online retail.',
    kind: 'system',
    art: 'commerce',
    mockup: 'b-commerce',
    featured: true,
    overview:
      'B-Commerce is an ecommerce store that brings its retail offering online.',
    focus: ['Ecommerce', 'Online retail'],
  },
  {
    slug: 'b-officio',
    title: 'B-Officio',
    category: 'Leave management',
    summary: 'Production leave management, evolving toward broader employee management.',
    kind: 'system',
    art: 'officio',
    mockup: 'b-officio',
    status: 'In production',
    featured: true,
    overview:
      'B-Officio is in production as a leave management system. It is evolving toward a fuller employee management platform, with leave management as its current foundation.',
    focus: ['Leave management', 'Employee management roadmap'],
  },
  {
    slug: 'b-pos',
    title: 'B-POS',
    category: 'Point of sale',
    summary: 'A point-of-sale system for managing sales.',
    kind: 'system',
    art: 'pos',
    mockup: 'b-pos',
    featured: true,
    overview:
      'B-POS is a point-of-sale system focused on sales operations.',
    focus: ['Point of sale', 'Sales operations'],
  },
  {
    slug: 'b-wallex',
    title: 'B-Wallex',
    category: 'Payment gateway',
    summary: 'A payment gateway for digital transactions.',
    kind: 'system',
    art: 'wallex',
    mockup: 'b-wallex',
    featured: true,
    overview:
      'B-Wallex is a payment gateway for handling digital payments.',
    focus: ['Payment gateway', 'Digital payments'],
  },
  {
    slug: 'mcc-church-management',
    title: 'MCC CMS',
    category: 'Church administration',
    summary: 'A church management system for Mustard Christian Centre.',
    kind: 'system',
    art: 'mcc',
    mockup: 'mcc-cms',
    liveUrl: 'https://mcc-kisii.vercel.app/',
    featured: true,
    overview:
      'MCC CMS is a church management system for Mustard Christian Centre, bringing its administration into a dedicated management portal.',
    focus: ['Church management', 'Mustard Christian Centre'],
  },
  {
    slug: 'neosave-sentinel',
    title: 'Neosave Sentinel',
    category: 'Neonatal health monitoring',
    summary: 'A mobile command unit for monitoring neonatal health risks.',
    kind: 'system',
    art: 'neosave',
    mockup: 'neosave-sentinel',
    featured: true,
    overview:
      'Neosave Sentinel is a mobile command unit for monitoring neonatal health risks. Its goal is to support efforts to reduce neonatal mortality.',
    focus: ['Neonatal health', 'Risk monitoring', 'Mobile command unit'],
  },
  {
    slug: 'symu-finance',
    title: 'Symu Finance Management',
    category: 'Finance management',
    summary: 'A system for managing business finances.',
    kind: 'system',
    art: 'finance',
    mockup: 'symu-finance',
    featured: true,
    overview:
      'Symu Finance Management is a system focused on managing business finances.',
    focus: ['Finance management', 'Business finances'],
  },
  {
    slug: 'symu-salesforce',
    title: 'Symu System',
    category: 'Sales & stock management',
    summary: 'A system for managing sales and stock.',
    kind: 'system',
    art: 'salesforce',
    mockup: 'symu-system',
    featured: true,
    overview:
      'Symu System brings sales and stock management together in one business system.',
    focus: ['Sales management', 'Stock management'],
  },
  {
    slug: 'thehub-rms',
    title: 'TheHub RMS',
    category: 'Hotel & restaurant management',
    summary: 'Hotel and restaurant operations, with food ordering and delivery for The Hub Homa Bay.',
    kind: 'system',
    art: 'rms',
    mockup: 'thehub-rms',
    featured: true,
    overview:
      'TheHub RMS brings together hotel and restaurant management for The Hub Homa Bay, including a food ordering and delivery unit.',
    focus: ['Hotel management', 'Restaurant management', 'Food ordering & delivery'],
  },
  {
    slug: 'community-cbe',
    title: 'Community CBE Campaign',
    category: 'Climate & community campaign',
    summary: 'A campaign website for school-led circular bio-economy enterprise in Siaya County.',
    kind: 'website',
    art: 'website',
    website: 'community-cbe',
    liveUrl: 'https://communitycbe.africa/',
    overview:
      'The Community Circular Bio-Economy Enterprise Campaign presents a school-centred initiative linking resource recovery with energy, savings, food security, skills, and community participation in Siaya County.',
    focus: ['Circular bio-economy', 'School communities', 'Campaign communication'],
  },
  {
    slug: 'innoecofood',
    title: 'INNOECOFOOD',
    category: 'Research & aquaculture website',
    summary: 'A public research website for sustainable aquaculture innovation across Africa.',
    kind: 'website',
    art: 'website',
    website: 'innoecofood',
    image: '/images/innoeco.webp',
    liveUrl: 'https://innoecofood.eu/',
    overview:
      'INNOECOFOOD presents its aquaculture research, EcoHubs, project partners, work packages, news, and public resources.',
    focus: ['Sustainable aquaculture', 'Research communication', 'EcoHubs'],
  },
  {
    slug: 'community-virtual-hub',
    title: 'Community Virtual Hub',
    category: 'Online learning platform',
    summary: 'Self-paced learning for Africa’s food-system communities.',
    kind: 'website',
    art: 'website',
    website: 'community-virtual-hub',
    liveUrl: 'https://www.cvh.africa/',
    overview:
      'The Community Virtual Hub brings together online courses, innovations, and news covering food systems, agriculture, and entrepreneurship.',
    focus: ['Online learning', 'Food systems', 'Agricultural knowledge'],
  },
  {
    slug: 'the-hub-homa-bay',
    title: 'The Hub Homa Bay',
    category: 'Hospitality & local services website',
    summary: 'A public website presenting restaurant, barber, and car-wash services in Homa Bay.',
    kind: 'website',
    art: 'website',
    website: 'the-hub-homa-bay',
    liveUrl: 'https://thehub-homabay.co.ke/',
    overview:
      'The Hub Homa Bay website introduces its dining, barber, and car-wash services, bringing its local business offering into one public-facing site.',
    focus: ['Hospitality', 'Local services', 'Business communication'],
  },
  {
    slug: 'mustard-christian-centre',
    title: 'Mustard Christian Centre',
    category: 'Church & community website',
    summary: 'An online home for Mustard Christian Centre in Kisii and its branches.',
    kind: 'website',
    art: 'website',
    website: 'mustard-christian-centre',
    liveUrl: 'https://www.mcc-kenya.org/',
    overview:
      'Mustard Christian Centre’s public website presents the church, service information, ministries, sermons, events, and branch locations.',
    focus: ['Church communication', 'Sermons & events', 'Branch information'],
  },
  {
    slug: 'tns-solutions',
    title: 'T&S Solutions',
    category: 'Social enterprise website',
    summary: 'A consultancy website connecting technology, green innovation, and community finance.',
    kind: 'website',
    art: 'website',
    website: 'tns-solutions',
    image: '/images/tns.webp',
    liveUrl: 'https://thetnssols.com/',
    overview:
      'The T&S Solutions website presents green technologies, innovative finance, impact-first investment, carbon asset development, and IT-enabled services.',
    focus: ['Green technology', 'Community finance', 'Social enterprise'],
  },
  {
    slug: 'kwale-scd-integration',
    title: 'Kwale SCD Screening Study',
    category: 'Research study website',
    summary: 'A research website about integrating early infant sickle cell screening with routine immunization.',
    kind: 'website',
    art: 'website',
    website: 'kwale-scd-integration',
    liveUrl: 'https://kwalescdintergration.vercel.app/',
    overview:
      'A public website for a feasibility study in Kwale County, presenting the research protocol, study sites, participant information, and research-form pathways.',
    focus: ['Research communication', 'Study information', 'Participant pathways'],
  },
  {
    slug: 'tom-and-sherrie-foundation',
    title: 'Tom and Sherrie Foundation',
    category: 'Charitable foundation website',
    summary: 'A foundation website presenting education support for vulnerable children in Kenya.',
    kind: 'website',
    art: 'website',
    website: 'tom-and-sherrie-foundation',
    liveUrl: 'https://tomandsherriefoundation.org/',
    overview:
      'The Tom and Sherrie Foundation website introduces education sponsorship, mentorship, partner-school support, and ways to contribute to the foundation’s work.',
    focus: ['Education access', 'School support', 'Foundation communication'],
  },
  {
    slug: 'baruchsoft',
    title: 'BaruchSoft Technologies',
    category: 'Technology company website',
    summary: 'A company website presenting software development and IT consulting.',
    kind: 'website',
    art: 'website',
    website: 'baruchsoft',
    liveUrl: 'https://www.baruchsoft.co.ke/',
    overview:
      'The BaruchSoft Technologies website brings together its software services, product portfolio, team, and business inquiry information.',
    focus: ['Software services', 'Company portfolio', 'Business communication'],
  },
  {
    slug: 'havencrest-agency',
    title: 'Havencrest Agency Limited',
    category: 'Automotive & insurance website',
    summary: 'A service website for vehicle solutions, motor insurance, and mobility support.',
    kind: 'website',
    art: 'website',
    website: 'havencrest-agency',
    liveUrl: 'https://kenshaq.baruchsoft.co.ke/',
    overview:
      'The Havencrest Agency website presents motor insurance, new and salvage vehicles, garage services, and inquiry information.',
    focus: ['Motor insurance', 'Vehicle services', 'Business website'],
  },
  {
    slug: 'bespoke-city-exclusive',
    title: 'Bespoke City Exclusive',
    category: 'Fashion & tailoring website',
    summary: 'A fashion atelier website presenting bespoke tailoring in Nairobi.',
    kind: 'website',
    art: 'website',
    website: 'bespoke-city-exclusive',
    liveUrl: 'https://bespoke-city-exclusive.vercel.app/',
    overview:
      'The Bespoke City Exclusive website presents its collections, tailoring process, editorial campaigns, and private-consultation information.',
    focus: ['Bespoke tailoring', 'Collections', 'Atelier communication'],
  },
  {
    slug: 'uhai-africa',
    title: 'Uhai Africa',
    category: 'Financial services website',
    summary: 'A website presenting insurance, loyalty services, and climate finance.',
    kind: 'website',
    art: 'website',
    website: 'uhai-africa',
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
    website: 'jooust-student-apprentice-hub',
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
    website: 'student-safety-summit',
    image: '/images/safety.webp',
    liveUrl: 'https://studentsafetysummit.africa/',
    overview:
      'The Student Safety Summit website presents a national university safety event. Its project imagery includes event information, speakers, an agenda, and registration.',
    focus: ['University safety', 'Event communication', 'Public website'],
  },
];

// This is brand experience, not an assertion of direct client relationships.
// Agency/employer credits belong with each project once its context is known.
export const brands: string[] = [
  'Coca-Cola Africa',
  'UNGA Group',
  'Junction Mall',
  'SGA Group',
  'Hillaxx Investment',
  'Baruchsoft Technologies',
  'Uhai Africa',
  'T&S Solutions',
  'VillageCAN',
  'Ogre Digital',
  'CGA',
  'Instaveg',
  'Tembea Futures Institute',
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
