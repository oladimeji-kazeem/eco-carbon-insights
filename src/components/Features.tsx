import { Link } from "react-router-dom";
import { ArrowUpRight, Leaf } from "lucide-react";
import { programmes } from "@/data/programmes";

const accents = [
  "from-primary/20 to-primary/5",
  "from-accent/20 to-accent/5",
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
          {programmes.map((p, i) => {
            const Icon = p.icon;
            return (
              <Link
                key={p.slug}
                to={`/programmes/${p.slug}`}
                className="group bg-card rounded-2xl overflow-hidden shadow-soft border border-border transition-all duration-300 hover:shadow-glow hover:-translate-y-1 flex flex-col"
              >
                <div className={`relative h-32 bg-gradient-to-br ${accents[i % accents.length]} flex items-center justify-center overflow-hidden`}>
                  <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_30%_30%,hsl(var(--primary))_0%,transparent_60%)]" />
                  <div className="relative w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center shadow-glow">
                    <Icon className="w-8 h-8 text-primary-foreground" />
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
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
