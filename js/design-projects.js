/**
 * Joshua Odero Ogallo - Graphic Design & Visual Communication Portfolio Data
 * Extensible project data architecture for easy maintenance and scaling.
 */

const DESIGN_CATEGORIES = [
  { id: "all", name: "All Work", icon: "ri-apps-2-fill" },
  { id: "brand-identity", name: "Brand Identity", icon: "ri-shield-star-line" },
  { id: "logo-design", name: "Logo Design", icon: "ri-pentagon-line" },
  { id: "social-media", name: "Social Media Design", icon: "ri-instagram-line" },
  { id: "marketing-graphics", name: "Marketing Graphics", icon: "ri-advertisement-line" },
  { id: "posters-flyers", name: "Posters & Flyers", icon: "ri-file-paper-line" },
  { id: "event-graphics", name: "Event Graphics", icon: "ri-calendar-event-line" },
  { id: "stationery", name: "Business Cards & Stationery", icon: "ri-bank-card-line" },
  { id: "roll-up-banners", name: "Roll-up Banners", icon: "ri-flag-line" },
  { id: "digital-campaigns", name: "Digital Campaigns", icon: "ri-megaphone-line" },
  { id: "print-design", name: "Print Design", icon: "ri-printer-line" },
  { id: "ui-visual-design", name: "UI/Visual Design", icon: "ri-layout-masonry-line" }
];

const DESIGN_PROJECTS = [
  {
    id: "b-wallex",
    slug: "b-wallex-brand-identity",
    title: "B-Wallex Brand Identity",
    client: "B-Wallex Fintech Systems",
    industry: "Payment Gateway / Fintech",
    category: "Brand Identity",
    categories: ["brand-identity", "logo-design", "stationery", "ui-visual-design", "digital-campaigns"],
    year: "2024",
    role: "Lead Brand Identity & Visual Systems Designer",
    featured: true,
    layoutSpan: "large", // 'large' = prominent 2-column or 8-col hero card, 'normal' = standard card, 'wide' = full width
    coverImage: "img/design/b-wallex-cover.svg",
    description: "End-to-end visual identity and brand architecture for a next-generation cross-border payment gateway in East Africa.",
    tools: ["Figma", "Adobe Illustrator", "Photoshop"],
    deliverables: [
      "Responsive Monogram & Logo System",
      "Comprehensive Brand Style Guide",
      "Executive Stationery & Business Cards",
      "Fintech Iconography & Touchpoint Design",
      "Social Launch Graphics & Mobile App Screen Visuals"
    ],
    colors: [
      { name: "Crimson Core", hex: "#DC2626", role: "Primary Passion & Confidence" },
      { name: "Sovereign Gold", hex: "#D4AF37", role: "Metallic Wealth & Precision" },
      { name: "Deep Obsidian", hex: "#0F172A", role: "Security & Foundation" },
      { name: "Pearl Light", hex: "#F8FAFC", role: "Clean Background Surface" }
    ],
    typography: {
      primary: "Clash Display (Bold Headers & Wordmark)",
      secondary: "Plus Jakarta Sans (Section Headings & Metadata)",
      accent: "Playfair Display (Editorial Italic Accents)",
      body: "Satoshi (Interface & Financial Data Tables)"
    },
    caseStudy: {
      brief: "B-Wallex required a visual identity that radiates institutional trust, modern fintech security, and seamless usability. The challenge was building an identity capable of living across complex developer documentation, bank settlement dashboards, physical merchant cards, and everyday roadside retailer POS stations.",
      direction: "Synthesizing three core visual metaphors: the protective geometry of a financial shield, the aerodynamic velocity of digital transaction arcs, and the prestige of imperial crimson accented with sovereign metallic gold.",
      process: "Iterated from dozens of physical ink sketches to geometric vector formulas. Tested logo clarity across extreme scales (from 16px favicons to 3-meter outdoor banners). Defined rigorous clear-space specifications, color contrast ratios (passing WCAG AAA on interfaces), and crafted tactile stationery mockups.",
      deliverablesBreakdown: "Delivered SVG master assets, complete font licensing specifications, packaging for merchant welcome kits, credit/debit card mockup templates, and animated logo reveals for digital media.",
      outcomes: "Adopted across all B-Wallex merchant touchpoints, yielding immediate recognition across regional fintech demo days and accelerating developer portal signups."
    },
    gallery: [
      {
        title: "Comprehensive Brand Guidelines Board",
        caption: "Logo architecture, clear-space formulas, color breakdown, and typographic hierarchy.",
        image: "img/design/b-wallex-brandboard.svg",
        aspect: "wide"
      },
      {
        title: "Stationery & Executive Card Suite",
        caption: "Corporate letterhead, hot-stamped gold foil business cards, and merchant integration documentation.",
        image: "img/design/b-wallex-stationery.svg",
        aspect: "standard"
      },
      {
        title: "Digital Campaign & Mobile Screen Visuals",
        caption: "High-conversion app visuals, social media launch cards, and merchant settlement interface accents.",
        image: "img/design/b-wallex-digital.svg",
        aspect: "standard"
      }
    ]
  },
  {
    id: "baruchsoft",
    slug: "baruchsoft-technologies",
    title: "Baruchsoft Technologies",
    client: "Baruchsoft Technologies Ltd",
    industry: "Enterprise Software & Cloud Engineering",
    category: "Brand Identity",
    categories: ["brand-identity", "logo-design", "marketing-graphics", "stationery", "roll-up-banners", "print-design"],
    year: "2024",
    role: "Brand Architect & Collateral Designer",
    featured: true,
    layoutSpan: "normal",
    coverImage: "img/design/baruchsoft-cover.svg",
    description: "Enterprise software identity, conference marketing materials, roll-up banner systems, and corporate print collateral.",
    tools: ["Adobe Illustrator", "InDesign", "Figma", "Photoshop"],
    deliverables: [
      "Isometric Monogram Logo System",
      "Trifold Corporate Capability Brochure",
      "Executive Stationery & NFC Business Cards",
      "Conference Roll-up Banners (850x2000mm)",
      "Digital Pitch Deck & Proposal Templates"
    ],
    colors: [
      { name: "Prism Amber", hex: "#EAB308", role: "Innovation & Energy" },
      { name: "Imperial Crimson", hex: "#DC2626", role: "Corporate Power" },
      { name: "Slate Navy", hex: "#0F172A", role: "Enterprise Stability" },
      { name: "Pure White", hex: "#FFFFFF", role: "Crisp Print Contrast" }
    ],
    typography: {
      primary: "Clash Display & Plus Jakarta Sans",
      secondary: "Satoshi (Body & Technical Specs)",
      accent: "Playfair Display (Executive Editorial)"
    },
    caseStudy: {
      brief: "Position Baruchsoft as a tier-one software engineering consultancy capable of bidding on enterprise banking and governmental cloud infrastructure tenders. The brand needed to convey architectural precision and uncompromising stability.",
      direction: "Developed an isometric 'B' cube prism that evokes dimensional software architecture, modular cloud nodes, and structured engineering disciplines.",
      process: "Conducted brand archetype workshops with company leadership. Built high-fidelity print grids in InDesign for physical brochures and conference roll-up banners, ensuring spot-color Pantone calibration.",
      deliverablesBreakdown: "Delivered print-ready CMYK PDFs, vector vector EPS/SVG assets, branded lanyards, roll-up banner vinyl layouts, and presentation slide decks.",
      outcomes: "Deployed at East Africa Tech Summit 2024, driving corporate partner inquiries and standardizing client-facing proposals."
    },
    gallery: [
      {
        title: "Enterprise Brand Suite & Brochure",
        caption: "Trifold capability brochure, business card lockup, and corporate stationery.",
        image: "img/design/baruchsoft-collateral.svg",
        aspect: "wide"
      },
      {
        title: "Conference Roll-up Banner Stand & Monogram",
        caption: "850x2000mm trade show banner design with high-visibility QR integration.",
        image: "img/design/baruchsoft-cover.svg",
        aspect: "standard"
      }
    ]
  },
  {
    id: "watu-simu",
    slug: "watu-simu-campaign",
    title: "Watu Simu Campaign",
    client: "Watu Credit / Device Financing",
    industry: "Retail / Telecommunications",
    category: "Digital Campaigns",
    categories: ["digital-campaigns", "marketing-graphics", "social-media", "posters-flyers", "print-design"],
    year: "2024",
    role: "Lead Campaign Art Director",
    featured: true,
    layoutSpan: "wide",
    coverImage: "img/design/watu-simu-cover.svg",
    description: "Multichannel promotional campaign for retail smartphone financing, combining punchy typography, social media carousels, and in-store posters.",
    tools: ["Adobe Photoshop", "Illustrator", "Figma"],
    deliverables: [
      "Nationwide Storefront Promo Posters",
      "Instagram, Facebook & TikTok Social Kit",
      "Daily Installment Pricing Badges ('Lipa Mdogo Mdogo')",
      "Flyers & Point-of-Sale Counter Cards",
      "Digital Ad Variations for Meta & Google Display"
    ],
    colors: [
      { name: "Flaming Crimson", hex: "#DC2626", role: "Urgency & Retail Excitement" },
      { name: "Solar Gold", hex: "#FDE047", role: "High-Visibility Callouts" },
      { name: "Midnight Charcoal", hex: "#0A0A0A", role: "Contrast Canvas" },
      { name: "Vibrant Orange", hex: "#F97316", role: "Warm Energy Accent" }
    ],
    typography: {
      primary: "Clash Display (High-Impact Display)",
      secondary: "Plus Jakarta Sans (Price Callouts & CTAs)",
      accent: "Playfair Display Italic (Customer Emotion)",
      body: "Satoshi (Terms & Legibility)"
    },
    caseStudy: {
      brief: "Create an attention-grabbing consumer campaign to explain a smartphone financing proposition: get a high-quality 4G/5G phone with a small upfront deposit and flexible daily micropayments. Visuals had to instantly communicate value within 2 seconds of viewing.",
      direction: "Bold Swahili retail slogans ('Lipa Mdogo Mdogo'), high-contrast price badges, explosive energy rays, and realistic 3D smartphone mockups with screen graphics demonstrating ease of use.",
      process: "A/B tested headline hierarchies and badge placements across digital channels. Formatted assets into multiple aspect ratios (1:1 feed square, 9:16 vertical stories/reels, and landscape outdoor billboards).",
      deliverablesBreakdown: "50+ creative variations spanning digital ads, POS storefront stickers, A2 posters, and social media animated carousels.",
      outcomes: "Contributed to a 34% surge in foot-traffic inquiries across partner retail outlets in Western and Central Kenya during Q3 2024."
    },
    gallery: [
      {
        title: "Multichannel Social Media Kit & Carousel",
        caption: "1080x1080 feed slides and 1080x1920 Instagram Story campaign variations.",
        image: "img/design/watu-simu-social.svg",
        aspect: "wide"
      },
      {
        title: "Storefront Posters & Smartphone Display Showcase",
        caption: "Retail window graphics with high-contrast price callouts.",
        image: "img/design/watu-simu-cover.svg",
        aspect: "standard"
      }
    ]
  },
  {
    id: "uhai-pos",
    slug: "uhai-pos-brand-identity",
    title: "Uhai POS Brand & System Identity",
    client: "Uhai Africa Cloud Ecosystem",
    industry: "Retail POS / Hospitality",
    category: "Brand Identity",
    categories: ["brand-identity", "logo-design", "ui-visual-design", "marketing-graphics", "stationery"],
    year: "2025",
    role: "Brand & Interface Design Specialist",
    featured: false,
    layoutSpan: "normal",
    coverImage: "img/design/uhai-brand-cover.svg",
    description: "Visual identity system and terminal interface branding for a modern cloud point-of-sale platform serving retailers and hospitality operators.",
    tools: ["Figma", "Adobe Illustrator", "Photoshop"],
    deliverables: [
      "Brand Mark & System Geometry",
      "Touchscreen UI Visual Theme & Iconography",
      "Merchant Verified Storefront Decals",
      "Branded Receipt Layouts & Thermal Printer Graphics",
      "Product Sales One-Pager & Feature Sheets"
    ],
    colors: [
      { name: "Electric Cyan", hex: "#0284C7", role: "Fluid Modern Tech" },
      { name: "Slate Core", hex: "#0F172A", role: "Interface Background" },
      { name: "Warm Gold", hex: "#FDE047", role: "Verified Merchant Seal" },
      { name: "Pure White", hex: "#FFFFFF", role: "High-Contrast Readability" }
    ],
    typography: {
      primary: "Clash Display & Plus Jakarta Sans",
      secondary: "Satoshi (High-Speed Terminal Menus)"
    },
    caseStudy: {
      brief: "Transform Uhai's point-of-sale software from a generic screen into a unified, proud merchant brand that cashier staff love looking at and shop owners proudly display on their storefronts.",
      direction: "Clean, calming blue and cyan tones that reduce eye fatigue during 8-hour cashier shifts, paired with a distinct circular heartbeat mark indicating live real-time synchronization.",
      process: "Designed UI visual states, iconography sets for food & retail cataloging, physical counter sticker decals, and marketing flyers for sales representatives.",
      deliverablesBreakdown: "Logo files, brand style manual, thermal receipt styling templates, and customer-facing marketing brochures.",
      outcomes: "Standardized brand touchpoints across 20+ beta retail deployments, accelerating onboarding times."
    },
    gallery: [
      {
        title: "Tablet POS Screen Branding & Storefront Seal",
        caption: "Branded counter touchpoint layout and official merchant verification seal.",
        image: "img/design/uhai-brand-cover.svg",
        aspect: "wide"
      }
    ]
  },
  {
    id: "student-safety",
    slug: "student-safety-summit",
    title: "Student Safety Summit Collateral",
    client: "Youth & Campus Security Forum",
    industry: "Institutional / Event",
    category: "Event Graphics",
    categories: ["event-graphics", "posters-flyers", "roll-up-banners", "brand-identity", "print-design"],
    year: "2024",
    role: "Creative Director & Lead Event Designer",
    featured: false,
    layoutSpan: "normal",
    coverImage: "img/design/student-safety-cover.svg",
    description: "Complete visual identity, stage backdrop, VIP accreditation badges, roll-up banners, and delegate program for a national youth security summit.",
    tools: ["Adobe Illustrator", "InDesign", "Photoshop"],
    deliverables: [
      "Official Summit Crest & Emblem",
      "Keynote Stage Backdrop (6x3 meters)",
      "VIP & Delegate Lanyard Badges",
      "Directional Event Roll-up Banners",
      "Delegate Program Booklets & Certificates"
    ],
    colors: [
      { name: "Institutional Royal", hex: "#2563EB", role: "Authority & Peace" },
      { name: "Deep Oxford", hex: "#0B132B", role: "Security & Strength" },
      { name: "Gold Honor", hex: "#FDE047", role: "Leadership & Excellence" }
    ],
    typography: {
      primary: "Clash Display (Bold Authority)",
      secondary: "Plus Jakarta Sans & Satoshi"
    },
    caseStudy: {
      brief: "Design an authoritative yet inspiring conference visual identity for a high-level summit bringing together university student leaders, police commissioners, and community peace advocates.",
      direction: "Shield and laurel heraldry updated with sleek geometric vectors, paired with high-contrast color palettes for stage lighting and photography.",
      process: "Produced full-bleed vector art for grand stage backdrops, print-ready badge templates with security barcodes, and roll-up banners positioned across campus auditoriums.",
      deliverablesBreakdown: "Backdrop graphics, 500+ personalized delegate badges, conference program PDFs, and certificate templates.",
      outcomes: "Praised by institutional organizers for elevating the event to an international standard of visual professionalism."
    },
    gallery: [
      {
        title: "Summit Event Poster & Delegate Lanyard Badge",
        caption: "Official summit keynote poster and VIP accreditation lanyard pass.",
        image: "img/design/student-safety-cover.svg",
        aspect: "wide"
      }
    ]
  },
  {
    id: "innoecofood",
    slug: "innoecofood-sustainability-campaign",
    title: "InnoEcoFood Sustainability Campaign",
    client: "InnoEcoFood Research Consortium",
    industry: "AgriTech / Sustainability",
    category: "Marketing Graphics",
    categories: ["marketing-graphics", "posters-flyers", "social-media", "digital-campaigns", "print-design"],
    year: "2024",
    role: "Visual Communication & Infographic Designer",
    featured: false,
    layoutSpan: "normal",
    coverImage: "img/design/innoecofood-campaign-cover.svg",
    description: "Visual dissemination campaign, infographic posters, and educational graphics championing circular agriculture and bio-waste conversion.",
    tools: ["Adobe Illustrator", "Figma", "Photoshop"],
    deliverables: [
      "Circular Agriculture Process Infographic",
      "Farmer Training Wall Posters (A1 format)",
      "Multilingual Educational Handouts",
      "Social Media Advocacy Kit",
      "Research Dissemination One-Pagers"
    ],
    colors: [
      { name: "Eco Emerald", hex: "#16A34A", role: "Ecological Growth" },
      { name: "Forest Deep", hex: "#052E16", role: "Natural Depth" },
      { name: "Sunlight Yellow", hex: "#FDE047", role: "Optimism & Agriculture" }
    ],
    typography: {
      primary: "Clash Display & Plus Jakarta Sans",
      secondary: "Satoshi (Clear Educational Readability)"
    },
    caseStudy: {
      brief: "Translate complex scientific concepts (e.g. black soldier fly bioconversion and microalgae fish feed) into accessible visual diagrams that rural farmers, policymakers, and research partners could instantly grasp.",
      direction: "Clean circular infographic flows, intuitive custom vector pictograms, and high-legibility layout hierarchy.",
      process: "Worked closely with agricultural scientists to ensure technical accuracy while refining graphic simplicity and color contrast for field use.",
      deliverablesBreakdown: "High-resolution vector infographics, social carousels, and print-ready educational wall charts.",
      outcomes: "Adopted across training workshops in Kenya and Uganda to educate over 1,200 local fish and poultry farmers."
    },
    gallery: [
      {
        title: "Circular Agri-Waste Infographic Poster",
        caption: "Visual flow explaining organic waste conversion into sustainable animal feed.",
        image: "img/design/innoecofood-campaign-cover.svg",
        aspect: "wide"
      }
    ]
  },
  {
    id: "thehub-hospitality",
    slug: "thehub-hospitality-visuals",
    title: "The Hub Dining & Hospitality Visuals",
    client: "The Hub Lakeside Restaurant & Lounge",
    industry: "Hospitality & Gastronomy",
    category: "Print Design",
    categories: ["print-design", "brand-identity", "stationery", "posters-flyers", "marketing-graphics"],
    year: "2024",
    role: "Hospitality Brand Designer",
    featured: false,
    layoutSpan: "normal",
    coverImage: "img/design/thehub-hospitality-cover.svg",
    description: "Artisan menu suite, table tent cards, promotional event posters, and outdoor signage for a premier lakeside culinary destination.",
    tools: ["Adobe InDesign", "Illustrator", "Photoshop"],
    deliverables: [
      "Embossed Gold Foil Dinner Menu Suite",
      "Craft Cocktail & Sunset Table Tents",
      "A2 Weekend Jazz & Dining Posters",
      "Branded Beverage Coasters & Napkin Rings",
      "Social Media Food & Ambiance Promo Templates"
    ],
    colors: [
      { name: "Sovereign Gold", hex: "#D4AF37", role: "Luxury & Lakeside Sunlight" },
      { name: "Rich Espresso", hex: "#1A0C08", role: "Sophisticated Gastronomy" },
      { name: "Pearl Cream", hex: "#FDFBF7", role: "Artisan Paper Texture" }
    ],
    typography: {
      primary: "Playfair Display (Luxury Serif & Italian Flair)",
      secondary: "Plus Jakarta Sans & Satoshi (Dish Descriptions & Pricing)"
    },
    caseStudy: {
      brief: "The Hub needed an upscale, cohesive dining collateral system matching its scenic Lake Victoria waterfront setting and gourmet grill menu.",
      direction: "Warm, tactile earth tones, metallic gold foil accents, and timeless serif typography balancing classic hospitality elegance with modern lakeside relaxation.",
      process: "Structured multi-course menu layouts with calculated whitespace to prevent visual clutter, highlighting signature Lake Victoria tilapia and craft cocktails.",
      deliverablesBreakdown: "Print-ready foil-stamped menu templates, table tent cards, and weekend event posters.",
      outcomes: "Elevated perceived dining value, supporting a revised premium menu pricing strategy and earning positive guest remarks."
    },
    gallery: [
      {
        title: "Artisan Leather Menu Folio & Table Card",
        caption: "Gold foil stamped menu design with structured typographic pricing hierarchy.",
        image: "img/design/thehub-hospitality-cover.svg",
        aspect: "wide"
      }
    ]
  }
];

// Helper Functions
function getProjectBySlug(slug) {
  return DESIGN_PROJECTS.find(project => project.slug === slug || project.id === slug);
}

function getProjectsByCategory(categoryId) {
  if (!categoryId || categoryId === 'all') {
    return DESIGN_PROJECTS;
  }
  return DESIGN_PROJECTS.filter(project => project.categories.includes(categoryId));
}

function getFeaturedDesignProjects() {
  return DESIGN_PROJECTS.filter(project => project.featured);
}

// Global Export for browser and node/webpack
if (typeof window !== 'undefined') {
  window.DESIGN_CATEGORIES = DESIGN_CATEGORIES;
  window.DESIGN_PROJECTS = DESIGN_PROJECTS;
  window.getProjectBySlug = getProjectBySlug;
  window.getProjectsByCategory = getProjectsByCategory;
  window.getFeaturedDesignProjects = getFeaturedDesignProjects;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    DESIGN_CATEGORIES,
    DESIGN_PROJECTS,
    getProjectBySlug,
    getProjectsByCategory,
    getFeaturedDesignProjects
  };
}
