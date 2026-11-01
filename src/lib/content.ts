export const site = {
  name: "SquashCode",
  legalName: "SquashCode",
  url: "https://www.squashcode.com",
  tagline: "Growth marketing, creative and technology agency in Kolkata",
  description:
    "SquashCode is a Kolkata-based growth marketing, creative and technology agency. We combine creativity, technology and performance-driven strategies to help ambitious businesses grow.",
  email: "contact@squashcode.com",
  phones: [
    { label: "+91 7044 242 693", href: "tel:+917044242693" },
    { label: "+91 7003 654 119", href: "tel:+917003654119" },
  ],
  addresses: [
    {
      label: "Behala",
      lines: ["21, Sisir Bagan Road", "Behala, Kolkata 700 034", "West Bengal, India"],
    },
    {
      label: "S. P. Mukherjee Road",
      lines: ["132A Shyama Prasad Mukherjee Road", "1st Floor, Kolkata 700 026", "West Bengal, India"],
    },
  ],
  socials: [
    { label: "LinkedIn", href: "https://www.linkedin.com/company/squashcode/", icon: "linkedin" },
    { label: "Instagram", href: "https://www.instagram.com/squashcode/", icon: "instagram" },
    { label: "Facebook", href: "https://www.facebook.com/squashcode", icon: "facebook" },
  ],
  calendly: "https://calendly.com/squashcode/growth-marketing-consultation",
  googlePartner: "https://www.google.com/partners/agency?id=6636857300",
  blog: "https://www.squashcode.com/blog/",
  career: "https://www.squashcode.com/career/",
  legal: [
    { label: "Privacy Policy", href: "https://www.squashcode.com/privacy-policy/" },
    { label: "Terms & Conditions", href: "https://www.squashcode.com/terms-and-conditions/" },
    { label: "Cancellation & Refund", href: "https://www.squashcode.com/cancellation-refund-policy/" },
  ],
} as const;

export const nav = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Our Work", href: "#work" },
  { label: "Insights", href: site.blog, external: true },
  { label: "Contact", href: "#contact" },
] as const;

export const sections = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "services", label: "Services" },
  { id: "approach", label: "Approach" },
  { id: "work", label: "Work" },
  { id: "why", label: "Why us" },
  { id: "results", label: "Results" },
  { id: "testimonials", label: "Clients" },
  { id: "contact", label: "Contact" },
] as const;

export const hero = {
  eyebrow: "Growth marketing · Creative · Technology",
  title: ["Good Marketing Gets Attention.", "Great Marketing Drives Growth."],
  /** two-line hero headline: line 1, then line 2 + the morphing word */
  headline: ["Great marketing", "drives"],
  morph: ["growth.", "leads.", "sales.", "brands."],
  text: "We combine creativity, technology and performance-driven strategies to help ambitious businesses grow, connect with customers and achieve measurable results.",
  primary: { label: "Let's Talk Growth", href: site.calendly },
  secondary: { label: "Explore Our Work", href: "#work" },
};

export const clients = [
  { name: "Panasonic", src: "/clients/panasonic.png", w: 1046, h: 160 },
  { name: "Dabur", src: "/clients/dabur.png", w: 179, h: 160 },
  { name: "Steinbeis", src: "/clients/steinbeis.png", w: 787, h: 160 },
  { name: "Taychi Properties", src: "/clients/taychi.png", w: 798, h: 160 },
  { name: "Calcutta Management Association", src: "/clients/cma.png", w: 466, h: 160 },
  { name: "Cash Flow With Property", src: "/clients/cashflow.png", w: 533, h: 160 },
  { name: "Subham Group", src: "/clients/subham.png", w: 208, h: 62 },
  { name: "Sumeet Urban Nest", src: "/clients/sumeet-urban-nest.png", w: 240, h: 97 },
] as const;

/** Three proof cards above the intro panel (front: result, back: the client's words). */
export const proof = [
  {
    chip: "Projects delivered",
    metric: "124+ projects",
    caption: "Across marketing, design and engineering",
    hue: 345,
    testimonial: 0,
    highlight: ["transparent on their commitments", "always over-delivered"],
  },
  {
    chip: "Lead generation",
    metric: "Leads that convert",
    caption: "Growth hacking and social media that sells",
    hue: 258,
    testimonial: 1,
    highlight: ["impressed with the result", "excellent lead generation"],
  },
  {
    chip: "E-commerce growth",
    metric: "Too many orders",
    caption: "The best problem a business can have",
    hue: 168,
    testimonial: 2,
    highlight: ["grow our business", "too much orders"],
  },
] as const;

export const intro = {
  title: ["Where Creativity", "Meets Technology.", "And Strategy", "Drives Growth."],
  paragraphs: [
    "SquashCode is a growth agency built at the intersection of marketing, creative design and engineering. One team, three disciplines, a single goal: measurable growth for your business.",
    "We plan campaigns the way engineers plan systems and build products the way marketers build audiences. That is how ideas become pipelines, launches and revenue.",
    "Based in Kolkata, working with brands across India and beyond.",
  ],
};

export type Service = {
  id: string;
  index: string;
  title: string;
  short: string;
  description: string;
  deliverables: string[];
  hue: number;
};

export const services: Service[] = [
  {
    id: "seo",
    index: "01",
    title: "Search Engine Optimization",
    short: "SEO",
    description:
      "Tailored SEO campaigns backed by transparent data reporting, built to win rankings and defend them through every algorithm update.",
    deliverables: ["Technical SEO", "Content strategy", "Authority building", "Rank defence"],
    hue: 340,
  },
  {
    id: "ppc",
    index: "02",
    title: "Performance Marketing & PPC",
    short: "Paid Media",
    description:
      "The top three ads on a search page take 46% of the clicks. We build and optimise paid campaigns that put you there and keep the cost per lead honest.",
    deliverables: ["Google Ads", "Meta Ads", "Landing pages", "Conversion tracking"],
    hue: 320,
  },
  {
    id: "social",
    index: "03",
    title: "Social Media Marketing",
    short: "Social",
    description:
      "Campaign strategy, content and design that turn feeds into communities and followers into customers.",
    deliverables: ["Content calendars", "Creative design", "Community management", "Paid social"],
    hue: 300,
  },
  {
    id: "email",
    index: "04",
    title: "Email Marketing & Automation",
    short: "Email",
    description:
      "We plan, build and deploy automated email programs designed to increase customer lifetime value, not just open rates.",
    deliverables: ["Lifecycle flows", "Newsletter design", "Segmentation", "CRM integration"],
    hue: 280,
  },
  {
    id: "web",
    index: "05",
    title: "Website Design & Development",
    short: "Web",
    description:
      "Conversion-ready websites engineered for speed, search and storytelling, from launch landing pages to full-scale platforms.",
    deliverables: ["Next.js & React", "WordPress", "Landing pages", "Core Web Vitals"],
    hue: 262,
  },
  {
    id: "app",
    index: "06",
    title: "App Development",
    short: "Apps",
    description:
      "Mobile and web applications designed around the user and built to scale with your business.",
    deliverables: ["iOS & Android", "Web apps", "API integration", "Ongoing support"],
    hue: 248,
  },
  {
    id: "brand",
    index: "07",
    title: "Graphic Design & Branding",
    short: "Brand",
    description:
      "Identity systems, campaign creative and brand assets that make every touchpoint feel unmistakably yours.",
    deliverables: ["Brand identity", "Campaign creative", "Social creatives", "Print & packaging"],
    hue: 350,
  },
  {
    id: "b2b",
    index: "08",
    title: "B2B Lead Generation",
    short: "Leads",
    description:
      "Account-based outreach and funnel systems that keep a predictable flow of qualified leads reaching your sales team.",
    deliverables: ["ICP research", "Outreach systems", "Funnel design", "Lead qualification"],
    hue: 330,
  },
];

export const approach = {
  title: "From Ideas to Impact.",
  text: "Four stages, one connected journey. Every engagement moves through the same loop so nothing is left to chance.",
  stages: [
    {
      index: "01",
      title: "Discover",
      text: "Understand the business and its goals.",
      points: ["Stakeholder interviews", "Market and competitor review", "Audience and data audit"],
    },
    {
      index: "02",
      title: "Strategize",
      text: "Develop a customized growth strategy.",
      points: ["Channel and budget plan", "Messaging and creative direction", "KPIs and reporting model"],
    },
    {
      index: "03",
      title: "Execute",
      text: "Deliver creative and technology-driven solutions.",
      points: ["Campaigns, content and design", "Websites, apps and automation", "Launch and go-live"],
    },
    {
      index: "04",
      title: "Optimize",
      text: "Measure, analyse and improve performance.",
      points: ["Weekly performance reviews", "Experiments and iteration", "Scale what works"],
    },
  ],
};

export type Project = {
  slug: string;
  title: string;
  client: string;
  category: string;
  sector: string;
  description: string;
  href: string;
  image: string;
  size: "wide" | "half";
};

export const projects: Project[] = [
  {
    slug: "ruchi-realty",
    title: "Ruchi Realty",
    client: "Ruchi Realty",
    category: "Website Design & Development",
    sector: "Real estate · Indore",
    description:
      "A server-rendered Next.js website for a real estate developer, with project pages, media and an editorial blog.",
    href: "https://ruchirealty.com",
    image: "/work/ruchi-realty.jpg",
    size: "wide",
  },
  {
    slug: "sumeet-urban-nest",
    title: "Sumeet Urban Nest",
    client: "Sumeet Infracon",
    category: "Website Design & Development",
    sector: "Residential launch · Raipur",
    description: "Launch landing page for 2 & 3 BHK homes in Khamardih, built with Next.js and Tailwind CSS.",
    href: "https://sumeeturbannest.com",
    image: "/work/sumeet-urban-nest.jpg",
    size: "half",
  },
  {
    slug: "maadhavam-realty",
    title: "Maadhavam Realty",
    client: "Maadhavam Realty",
    category: "Website Design & Development",
    sector: "Property advisory · Kolkata & Howrah",
    description: "Property advisory website for Kolkata and Howrah with project listings and enquiry journeys.",
    href: "https://maadhavamrealty.com",
    image: "/work/maadhavam-realty.jpg",
    size: "half",
  },
  {
    slug: "aakash-india",
    title: "Aakash India",
    client: "Aakash India",
    category: "Website Design & Development",
    sector: "Builders & developers · Jamshedpur",
    description: "Corporate website on Next.js 16 for one of Jamshedpur's real estate developers.",
    href: "https://aakashindia.in",
    image: "/work/aakash-india.jpg",
    size: "half",
  },
  {
    slug: "sumeet-infracon",
    title: "Sumeet Infracon",
    client: "Sumeet Infracon",
    category: "Website Design & Development",
    sector: "Real estate group · Raipur",
    description: "Group website covering residential, commercial and plotted developments across Raipur.",
    href: "https://sumeetinfracon.com",
    image: "/work/sumeet-infracon.jpg",
    size: "half",
  },
  {
    slug: "acrux-realcon",
    title: "Acrux Realcon",
    client: "Acrux Realcon",
    category: "Website Design & Development",
    sector: "Real estate · Odisha",
    description: "WordPress and Elementor website for a realty brand with award-winning architecture-led projects.",
    href: "https://acruxrealcon.in",
    image: "/work/acrux-realcon.jpg",
    size: "wide",
  },
];

export const why = {
  title: "More Than an Agency. Your Growth Partner.",
  text: "We work the way a partner should: honest about what will move the numbers, obsessive about the craft, and accountable for the result.",
  values: [
    {
      index: "01",
      title: "Result-driven thinking",
      text: "Every brief starts with the number it needs to move. Creative, media and code are judged by what they return.",
      motif: "rings",
    },
    {
      index: "02",
      title: "Creative problem-solving",
      text: "Every problem is a new and exciting challenge to learn and conquer. We find the angle others miss.",
      motif: "spark",
    },
    {
      index: "03",
      title: "Technical expertise",
      text: "Marketers who ship code and engineers who understand funnels. Modern stacks, measured properly.",
      motif: "grid",
    },
    {
      index: "04",
      title: "Customized strategies",
      text: "No templates. Each plan is built around your market, your margins and your growth stage.",
      motif: "path",
    },
    {
      index: "05",
      title: "Transparent communication",
      text: "Clear commitments, open reporting and no surprises. You always know what is being done and why.",
      motif: "waves",
    },
    {
      index: "06",
      title: "Commitment to quality",
      text: "Clockwork precision on deadlines and standards that do not slip when the timeline gets tight.",
      motif: "bars",
    },
  ],
};

export const results = {
  title: "Growth Is Better When You Can Measure It.",
  text: "The numbers we are proud of, straight from the work we have delivered.",
  stats: [
    { value: 124, suffix: "+", label: "Projects completed" },
    { value: 14, suffix: "+", label: "Industry experts" },
    { value: 5, suffix: "+", label: "Years of experience" },
    { value: 3, suffix: "+", label: "Prestigious awards" },
  ],
  awards: [
    {
      title: "Digital Marketing Consulting Organization of the Year",
      by: "HR Sampark People",
      year: "2022",
    },
    {
      title: "World Digital Marketing Excellence Award",
      by: "World Leader Summit · awarded to founder Sagar Mondal",
      year: "2020",
    },
  ],
};

export const testimonials = [
  {
    quote:
      "Very professional and result oriented growth marketing company in Kolkata. They have been very transparent on their commitments & have always over-delivered.",
    name: "Mohit Suri",
    role: "Sales Growth Leader",
    image: "/testimonials/mohit-suri.jpg",
    chip: "Transparency",
    tint: "rose",
  },
  {
    quote:
      "I'm really impressed with the result after using their Growth Hacking strategies! I recommended them with their excellent lead generation & social media marketing skills.",
    name: "Peter Juhasz",
    role: "Director, P&A Group",
    image: "/testimonials/peter-juhasz.jpg",
    chip: "Lead generation",
    tint: "violet",
  },
  {
    quote:
      "These guys are amazing. They've helped us to grow our business and the biggest issue we appear to run over now is having too much orders - which is an ideal issue to have.",
    name: "Priyanka Trivedi",
    role: "CEO, Kidstree Ltd",
    image: "/testimonials/priyanka-trivedi.jpg",
    chip: "E-commerce growth",
    tint: "teal",
  },
] as const;

export const cta = {
  title: "Ready to Build Something That Moves Your Business Forward?",
  text: "Let's turn your next big idea into a meaningful digital experience.",
  primary: { label: "Start a Project", href: `mailto:${site.email}?subject=New%20project%20with%20SquashCode` },
  secondary: { label: "Book a Free Strategy Call", href: site.calendly },
};
