export interface BrandLogo {
  id: string;
  name: string;
  source: string;
  scale?: 'compact' | 'portrait' | 'wide';
}

// Original uploads remain in public/images/Logos. Only web copies are normalized.
export const logoAssets: BrandLogo[] = [
  { id: 'coca-cola-africa', name: 'Coca-Cola Beverages Africa', source: 'Cocacola Africa/cocacola africa.png', scale: 'wide' },
  { id: 'coca-cola', name: 'Coca-Cola', source: 'Cocacola Africa/coke logo.png', scale: 'wide' },
  { id: 'sprite', name: 'Sprite', source: 'Cocacola Africa/Sprite Logo.png' },
  { id: 'fanta', name: 'Fanta', source: 'Cocacola Africa/fanta logo.png' },
  { id: 'minute-maid', name: 'Minute Maid', source: 'Cocacola Africa/Minute-Maid-Logo.png' },
  { id: 'dasani', name: 'Dasani', source: 'Cocacola Africa/Dasani_Logo.svg.webp', scale: 'wide' },
  { id: 'unga', name: 'Unga Group Limited', source: 'UNGA-GROUP.png', scale: 'wide' },
  { id: 'unga-limited', name: 'Unga Limited', source: 'UNGA LIMITED/UNGA-LTD.png', scale: 'wide' },
  { id: 'hostess', name: 'Hostess', source: 'UNGA LIMITED/hostess logo.png', scale: 'wide' },
  { id: 'exe', name: 'EXE', source: 'UNGA LIMITED/exe logo.png', scale: 'wide' },
  { id: 'famila', name: 'Famila', source: 'UNGA LIMITED/famila logo.png', scale: 'wide' },
  { id: 'jogoo', name: 'Jogoo', source: 'UNGA LIMITED/jogoo logo.png', scale: 'wide' },
  { id: 'amana', name: 'Amana', source: 'UNGA LIMITED/amana logo.png', scale: 'wide' },
  { id: 'hodari', name: 'Hodari', source: 'UNGA LIMITED/hodari-logo.png', scale: 'wide' },
  { id: 'unga-farmcare', name: 'Unga FarmCare', source: 'UNGA FArmcare/unga farmcare logo.png', scale: 'wide' },
  { id: 'afya-bora', name: 'Afya Bora', source: 'UNGA FArmcare/afya bora.png', scale: 'wide' },
  { id: 'almatix', name: 'Almatix', source: 'UNGA FArmcare/almatix.png', scale: 'wide' },
  { id: 'champion', name: 'Champion', source: 'UNGA FArmcare/champion logo.png', scale: 'wide' },
  { id: 'fugo', name: 'FUGO', source: 'UNGA FArmcare/fugo logo.png', scale: 'wide' },
  { id: 'k9', name: 'K9 Dog Food', source: 'UNGA FArmcare/K9 logo.png', scale: 'compact' },
  { id: 'leoxy', name: 'LEOXY', source: 'UNGA FArmcare/logos-07.png', scale: 'wide' },
  { id: 'nemazole', name: 'Nemazole', source: 'UNGA FArmcare/nemazole.png', scale: 'wide' },
  { id: 'viminera', name: 'Viminera', source: 'UNGA FArmcare/viminera logo.png', scale: 'wide' },
  { id: 'tns', name: 'T&S Solutions', source: 't&s Logo.png', scale: 'compact' },
  { id: 'junction', name: 'The Junction Mall', source: 'junction mall logo.png', scale: 'wide' },
  { id: 'sga', name: 'SGA Group', source: 'sga group logo.png', scale: 'wide' },
  { id: 'hillaxx', name: 'Hillaxx Investment', source: 'Hillaxx Investment logo.png', scale: 'wide' },
  { id: 'uhai', name: 'Uhai Africa', source: 'uhai africa logo.png', scale: 'wide' },
  { id: 'villagecan', name: 'VillageCAN', source: 'villagecan logo.png', scale: 'wide' },
  { id: 'cga', name: 'Cereal Growers Association', source: 'CGA Logo.jpg', scale: 'wide' },
  { id: 'instaveg', name: 'Instaveg', source: 'instaveg logo.png', scale: 'wide' },
  { id: 'tembea', name: 'Tembea Futures Institute', source: 'tembea future institute logo.png', scale: 'wide' },
  { id: 'mcc', name: 'Mustard Christian Centre', source: 'Mustard Christian Centre Logo.png', scale: 'compact' },
  { id: 'biospark', name: 'BioSpark', source: 'biospark logo.png', scale: 'wide' },
  { id: 'the-hub', name: 'The Hub Homa Bay', source: 'the hub homabay.png', scale: 'wide' },
  { id: 'jooust', name: 'JOOUST', source: 'jooust logo.png', scale: 'compact' },
  { id: 'kws', name: 'Kenya Wildlife Service', source: 'KWS Logo.png', scale: 'compact' },
  { id: 'havencrest', name: 'Havencrest Agency Limited', source: 'havencrest logo.png' },
  { id: 'innoecofood', name: 'InnoEcoFood', source: 'innoecofood logo.png', scale: 'wide' },
  { id: 'baruchsoft', name: 'Baruchsoft Technologies', source: 'baruchsoft logo.png', scale: 'wide' },
  { id: 'socialmeds', name: 'Socialmeds Digital', source: 'Socialmeds digital logo.png', scale: 'wide' },
  { id: 'ogre', name: 'Ogre Digital', source: 'OgreDigital logo.png', scale: 'wide' },
  { id: 'freelancer', name: 'Freelancer.com', source: 'freelancer logo.webp', scale: 'wide' },
];

export const organizationMarks = [
  'junction', 'sga', 'uhai', 'instaveg', 'hillaxx', 'villagecan', 'cga', 'biospark',
  'tembea', 'the-hub', 'mcc', 'jooust', 'kws', 'havencrest', 'innoecofood', 'tns',
];

export const cocaColaMarks = ['coca-cola', 'sprite', 'fanta', 'minute-maid', 'dasani'];
export const ungaFoodMarks = ['hostess', 'exe', 'famila', 'jogoo', 'amana', 'hodari'];
export const ungaFarmcareMarks = ['afya-bora', 'almatix', 'champion', 'fugo', 'k9', 'leoxy', 'nemazole', 'viminera'];

export const professionalMarks = [
  { id: 'baruchsoft', label: 'Baruchsoft Technologies', context: 'Frontend engineering & digital marketing' },
  { id: 'socialmeds', label: 'Socialmeds Digital', context: 'Digital creative' },
  { id: 'ogre', label: 'Ogre Digital', context: 'Digital marketing' },
  { id: 'freelancer', label: 'Freelancer.com', context: 'Independent freelance work' },
];

export const experienceLogoIds: Record<string, string> = {
  'Baruchsoft Technologies': 'baruchsoft',
  'Socialmeds Digital Marketing Agency': 'socialmeds',
  'Ogre Digital': 'ogre',
  'Freelancer.com': 'freelancer',
};
