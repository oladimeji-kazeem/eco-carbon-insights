import { Megaphone, Sparkles, HandHeart, ArrowRight } from "lucide-react";

const steps = [
  {
    icon: Megaphone,
    title: "Inform",
    description: "We share knowledge, tools and resources to help people understand their environmental impact and the practical actions that make a difference.",
    step: "01",
  },
  {
    icon: Sparkles,
    title: "Inspire",
    description: "Through community outreach, education and storytelling, we inspire people and organisations to take meaningful climate action.",
    step: "02",
  },
  {
    icon: HandHeart,
    title: "Enable",
    description: "We support local sustainability infrastructure, cross-sector collaboration and centres of excellence so action becomes easy and lasting.",
    step: "03",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            How We <span className="gradient-text">Make Impact</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Our mission is built on three principles that guide every programme and partnership.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div key={step.title} className="relative group">
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-[60%] w-full h-0.5 bg-gradient-to-r from-primary/30 to-transparent" />
              )}

              <div className="card-gradient rounded-2xl p-8 shadow-soft border border-border transition-all duration-300 hover:shadow-glow hover:-translate-y-1">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 gradient-bg rounded-xl flex items-center justify-center shadow-glow">
                    <step.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <span className="text-5xl font-bold text-muted/50 group-hover:text-primary/20 transition-colors">
                    {step.step}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <a href="#programmes" className="inline-flex items-center gap-2 text-primary font-medium hover:gap-4 transition-all cursor-pointer">
            <span>Explore our programmes</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
