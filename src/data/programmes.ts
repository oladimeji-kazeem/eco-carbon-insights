import { Building2, Users, Lightbulb, Smartphone, Leaf, MapPin, LucideIcon } from "lucide-react";

export type Pillar = "Inform" | "Inspire" | "Enable";

export interface Programme {
  slug: string;
  title: string;
  tagline: string;
  icon: LucideIcon;
  mission: string;
  description: string;
  highlights: string[];
  pillars: Pillar[];
  cta: { label: string; href: string };
  externalUrl: string;
  // Carbon focus areas this programme supports
  focusAreas: string[];
}

export const programmes: Programme[] = [
  {
    slug: "sustainability-centre",
    title: "Sustainability Centre",
    tagline: "A new sustainability hub for the South West",
    icon: Building2,
    mission: "Create a brand new sustainability hub and visitor attraction in the South West — a place to discover and learn about sustainable living, technologies and products for both business and home.",
    description:
      "At the heart of our plans is a flagship visitor centre that brings sustainable living to life. Interactive exhibits, demonstrations and expert advice help visitors see, touch and trial the technologies and practices that can transform homes and workplaces.",
    highlights: [
      "Interactive exhibits on home energy, transport and circular economy",
      "Live demonstrations of low-carbon technologies",
      "Expert advice clinics for households and small businesses",
      "Conference and event space for sustainability collaboration",
    ],
    pillars: ["Inform", "Inspire"],
    cta: { label: "Support the Centre", href: "https://www.crowdfunder.co.uk/p/eco-save" },
    externalUrl: "https://www.ecocentresw.org/eco-centre/",
    focusAreas: ["Energy", "Operations"],
  },
  {
    slug: "climate-action-plans",
    title: "Climate Action Plans",
    tagline: "Cut emissions, save money — together",
    icon: MapPin,
    mission: "Help people and communities reduce carbon emissions and save money at the same time, through tailored, locally-relevant Climate Action Plans.",
    description:
      "A new approach to community climate action. We work with residents, councils and local groups to build practical plans that reflect each community's priorities — combining quick wins with longer-term investment in sustainable infrastructure.",
    highlights: [
      "Locally-tailored plans co-created with residents",
      "Identifies highest-impact, cost-saving actions first",
      "Connects communities with funding and partners",
      "Tracks progress and shares learning across regions",
    ],
    pillars: ["Inform", "Enable"],
    cta: { label: "Join a Climate Action Plan", href: "https://www.ecocentresw.org/community-action/climate-action-plans/" },
    externalUrl: "https://www.ecocentresw.org/community-action/climate-action-plans/",
    focusAreas: ["Energy", "Travel"],
  },
  {
    slug: "climate-action-programme",
    title: "South West Climate Action Programme",
    tagline: "Cultivating sustainable innovation",
    icon: Lightbulb,
    mission: "Encourage and cultivate sustainable innovation by bringing together champions, innovators and influencers to collaborate, challenge, and create positive impact.",
    description:
      "A cross-sector programme that connects sustainability champions across business, public sector and community. We catalyse new partnerships, surface innovation and help promising ideas scale into real-world impact.",
    highlights: [
      "Cross-sector innovation challenges",
      "Champion network of sustainability leaders",
      "Showcases for emerging green technology",
      "Co-creation workshops to scale impact",
    ],
    pillars: ["Inspire", "Enable"],
    cta: { label: "Become a Champion", href: "https://www.ecocentresw.org/south-west-climate-action-programme/" },
    externalUrl: "https://www.ecocentresw.org/south-west-climate-action-programme/",
    focusAreas: ["Operations", "Logistics"],
  },
  {
    slug: "eco-centres",
    title: "Eco Centres",
    tagline: "Centres of excellence for sustainable living",
    icon: Leaf,
    mission: "Establish centres of excellence for sustainable living and working — enabling all sectors and the public to discover and share ideas, get practical help and adopt better practices.",
    description:
      "A network of regional Eco Centres providing hands-on advice, training and demonstration of sustainable practices, products and technology — making it easier for every home and workplace to take action.",
    highlights: [
      "Practical training and skills workshops",
      "Real-world demonstrations of sustainable products",
      "Open to the public, businesses and educators",
      "Hubs for sharing local best practice",
    ],
    pillars: ["Inform", "Enable"],
    cta: { label: "Explore the network", href: "https://www.ecocentresw.org/eco-centre/" },
    externalUrl: "https://www.ecocentresw.org/eco-centre/",
    focusAreas: ["Energy", "Operations"],
  },
  {
    slug: "community-climate-action",
    title: "Community Climate Action",
    tagline: "Locally inspired action for the planet",
    icon: Users,
    mission: "A community-based and inspired programme working with local people to inform, inspire and enable more sustainable living and stronger community-led sustainability projects.",
    description:
      "Real change happens at community level. We support neighbourhood groups, schools and local organisations to lead their own climate action — providing tools, training and connections to make projects succeed.",
    highlights: [
      "Grassroots project incubation and mentoring",
      "Community engagement events and outreach",
      "Schools programmes and youth involvement",
      "Funding and partnership signposting",
    ],
    pillars: ["Inspire", "Enable"],
    cta: { label: "Get your community involved", href: "https://www.ecocentresw.org/community-action-plan/" },
    externalUrl: "https://www.ecocentresw.org/community-action-plan/",
    focusAreas: ["Travel", "Operations"],
  },
  {
    slug: "eco-save-app",
    title: "Eco-Save App",
    tagline: "Cut carbon, waste, water — and bills",
    icon: Smartphone,
    mission: "Help people cut household carbon emissions, waste and water usage — and save money — through an innovative app full of practical tips and ideas.",
    description:
      "Eco-Save makes sustainable living easy. The app combines personalised tips, simple tracking and bite-sized challenges so households can see real reductions in their carbon footprint, water usage and bills.",
    highlights: [
      "Personalised sustainability tips",
      "Track carbon, water and waste over time",
      "Bite-sized challenges that build habits",
      "Save money on household bills",
    ],
    pillars: ["Inform", "Inspire"],
    cta: { label: "Back the Eco-Save App", href: "https://www.crowdfunder.co.uk/p/eco-save" },
    externalUrl: "https://www.ecocentresw.org/eco-save-app/",
    focusAreas: ["Energy", "Travel"],
  },
];

export const getProgrammeBySlug = (slug: string) => programmes.find((p) => p.slug === slug);

// Map a carbon category (from the upload analysis) to the most relevant programme(s)
export const programmesForCategory = (category: string): Programme[] =>
  programmes.filter((p) => p.focusAreas.includes(category));

// Map each pillar to the programmes that primarily address it
export const programmesForPillar = (pillar: Pillar): Programme[] =>
  programmes.filter((p) => p.pillars.includes(pillar));
