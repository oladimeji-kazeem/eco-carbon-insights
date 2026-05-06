import { Card, CardContent } from "@/components/ui/card";
import { Heart, Home, Users2, Briefcase } from "lucide-react";

const useCases = [
  {
    icon: Home,
    title: "Households",
    description: "Practical tips and the Eco-Save app help families cut household carbon, water and waste — while saving money on bills.",
    tag: "Live sustainably",
  },
  {
    icon: Users2,
    title: "Communities",
    description: "Community Climate Action Plans support local groups to reduce emissions together and build resilient, greener neighbourhoods.",
    tag: "Act together",
  },
  {
    icon: Briefcase,
    title: "Businesses & Organisations",
    description: "Cross-sector collaboration and the South West Climate Action Programme help organisations innovate and embed sustainability.",
    tag: "Work sustainably",
  },
  {
    icon: Heart,
    title: "Schools & Educators",
    description: "Education programmes, tools and outreach inspire the next generation to take climate action and protect the environment.",
    tag: "Inspire change",
  },
];

const UseCases = () => {
  return (
    <section className="py-24 bg-secondary/30">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Heart className="w-4 h-4" />
            Who We Work With
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Supporting Action at Every Level
          </h2>
          <p className="text-lg text-muted-foreground">
            From individual households to whole communities and organisations — together we can take meaningful action on climate change.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {useCases.map((useCase, index) => (
            <Card
              key={index}
              className="group hover:shadow-glow transition-all duration-300 border-border/50 overflow-hidden"
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="h-12 w-12 rounded-xl gradient-bg flex items-center justify-center flex-shrink-0">
                    <useCase.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-lg">{useCase.title}</h3>
                    <p className="text-sm text-primary">{useCase.tag}</p>
                  </div>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">{useCase.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UseCases;
