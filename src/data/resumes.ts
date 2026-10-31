import assets from './resume-assets.json';

export const resumes = [
  {
    id: 'software',
    title: 'Software engineering',
    role: 'Frontend software engineer',
    description: 'Frontend development and UI/UX across business systems, health software and websites. Next.js, React and Angular.',
    portfolio: '/software/',
    ...assets.software,
  },
  {
    id: 'creative',
    title: 'Creative & marketing',
    role: 'Digital creative & marketer',
    description: 'Campaign ideation, visual communication and brand content. Experience across agency, in-house and freelance work.',
    portfolio: '/creative-marketing/',
    ...assets.creative,
  },
] as const;

export const softwareResume = resumes[0];
export const creativeResume = resumes[1];
