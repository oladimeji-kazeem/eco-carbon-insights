import { Building2, Users, Lightbulb, Smartphone, Leaf, MapPin } from "lucide-react";

const programmes = [
  {
    icon: Building2,
    title: "Sustainability Centre",
    description: "A brand new sustainability hub and visitor attraction in the South West — a place to discover and learn about sustainable living, technologies and products for business and home.",
  },
  {
    icon: MapPin,
    title: "Climate Action Plans",
    description: "A new approach to help people and communities reduce carbon emissions and save money at the same time through tailored, local action plans.",
  },
  {
    icon: Lightbulb,
    title: "South West Climate Action Programme",
    description: "Encouraging and cultivating sustainable innovation by bringing together champions, innovators and influencers to collaborate and create positive impact.",
  },
  {
    icon: Leaf,
    title: "Eco Centres",
    description: "Centres of excellence for sustainable living and working — enabling all sectors and the public to discover ideas, get practical help and adopt sustainable practices.",
  },
  {
    icon: Users,
    title: "Community Climate Action",
    description: "A community-based and inspired programme working with local people to inform, inspire and enable more sustainable living and stronger community-led projects.",
  },
  {
    icon: Smartphone,
    title: "Eco-Save App",
    description: "An innovative application that helps households cut carbon emissions, waste and water usage — saving money while protecting the environment.",
  },
];

const Features = () => {
  return (
    <section id="programmes" className="py-24 hero-gradient">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Our <span className="gradient-text">Programmes</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Practical actions we as consumers, workers and employers can take to reduce greenhouse gas emissions and live more sustainably.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {programmes.map((p) => (
            <div
              key={p.title}
              className="group bg-card rounded-2xl p-6 shadow-soft border border-border transition-all duration-300 hover:shadow-glow hover:-translate-y-1"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <p.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">{p.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{p.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
