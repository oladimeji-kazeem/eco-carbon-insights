import { Button } from "@/components/ui/button";
import { ArrowRight, Leaf, Users, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";

const Hero = () => {
  return (
    <section className="relative min-h-screen hero-gradient overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="relative container mx-auto px-6 pt-32 pb-20">
        <nav className="absolute top-0 left-0 right-0 flex items-center justify-between py-6 px-6">
          <div className="flex items-center gap-2">
            <img src={logo} alt="Eco Centre logo" className="w-10 h-10" />
            <span className="text-xl font-bold text-foreground">Eco Centre</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#programmes" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Programmes
            </a>
            <a href="#signup">
              <Button variant="heroOutline" size="lg">
                Get Involved
              </Button>
            </a>
          </div>
        </nav>

        <div className="max-w-4xl mx-auto text-center pt-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8 animate-fade-up">
            <Leaf className="w-4 h-4" />
            Inform · Inspire · Enable
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold text-foreground leading-tight mb-6 animate-fade-up" style={{ animationDelay: '0.1s' }}>
            Empowering people to live and work{' '}
            <span className="gradient-text">more sustainably</span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            We help people, communities and organisations take practical action on climate change and protect the environment.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up" style={{ animationDelay: '0.3s' }}>
            <a href="https://www.crowdfunder.co.uk/p/eco-save" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
              <Button variant="hero" size="xl" className="w-full">
                Support Our Work
                <ArrowRight className="w-5 h-5" />
              </Button>
            </a>
            <a href="#programmes" className="w-full sm:w-auto">
              <Button variant="heroOutline" size="xl" className="w-full">
                Explore Programmes
              </Button>
            </a>
          </div>

          <div className="flex items-center justify-center gap-8 mt-12 text-sm text-muted-foreground animate-fade-up" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              <span>Community-led</span>
            </div>
            <div className="flex items-center gap-2">
              <Leaf className="w-4 h-4 text-primary" />
              <span>Climate action</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <span>Cross-sector collaboration</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
