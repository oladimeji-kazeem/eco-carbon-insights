import { Building2, Users, Lightbulb, Smartphone, Leaf, MapPin, ArrowUpRight } from "lucide-react";

const programmes = [
  {
    icon: Building2,
    title: "Sustainability Centre",
    description: "At the heart of our plans is establishing a brand new sustainability hub and visitor attraction in the South West — a place to discover and learn about sustainable living, technologies and products for business and home.",
    href: "https://www.ecocentresw.org/eco-centre/",
    accent: "from-primary/20 to-primary/5",
  },
  {
    icon: MapPin,
    title: "Climate Action Plans",
    description: "Our Climate Action Plans programme is a new approach to help people and communities reduce carbon emissions and save money at the same time.",
    href: "https://www.ecocentresw.org/community-action/climate-action-plans/",
    accent: "from-accent/20 to-accent/5",
  },
  {
    icon: Lightbulb,
    title: "Climate Action Programme",
    description: "The South West Climate Action Programme cultivates sustainable innovation, bringing together champions, innovators and influencers to collaborate and create positive impact.",
    href: "https://www.ecocentresw.org/south-west-climate-action-programme/",
    accent: "from-primary/20 to-primary/5",
  },
  {
    icon: Leaf,
    title: "Eco Centres",
    description: "Our longer-term aim is to establish centres of excellence for sustainable living and working — enabling all sectors and the public to discover and share ideas, get practical help, and adopt sustainable practices.",
    href: "https://www.ecocentresw.org/eco-centre/",
    accent: "from-accent/20 to-accent/5",
  },
  {
    icon: Users,
    title: "Community Climate Action",
    description: "A community-based and inspired programme working with local people to inform, inspire and enable more sustainable living and stronger community-led sustainability projects.",
    href: "https://www.ecocentresw.org/community-action-plan/",
    accent: "from-primary/20 to-primary/5",
  },
  {
    icon: Smartphone,
    title: "Eco-Save App",
    description: "An innovative application that helps people cut household carbon emissions, waste and water usage — providing tips and ideas to live more sustainably and save money.",
    href: "https://www.ecocentresw.org/eco-save-app/",
    accent: "from-accent/20 to-accent/5",
  },
];

const Features = () => {
  return (
    <section id="programmes" className="py-24 hero-gradient">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Leaf className="w-4 h-4" />
            What We Do
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Our <span className="gradient-text">Programmes</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Find out more about what we are working on — practical action through community outreach, education, infrastructure and cross-sector collaboration.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {programmes.map((p) => (
            <a
              key={p.title}
              href={p.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-card rounded-2xl overflow-hidden shadow-soft border border-border transition-all duration-300 hover:shadow-glow hover:-translate-y-1 flex flex-col"
            >
              <div className={`relative h-32 bg-gradient-to-br ${p.accent} flex items-center justify-center overflow-hidden`}>
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_30%_30%,hsl(var(--primary))_0%,transparent_60%)]" />
                <div className="relative w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center shadow-glow">
                  <p.icon className="w-8 h-8 text-primary-foreground" />
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="text-lg font-bold text-foreground">{p.title}</h3>
                  <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed flex-1">{p.description}</p>
                <span className="mt-4 text-sm font-medium text-primary group-hover:underline">Learn more</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
