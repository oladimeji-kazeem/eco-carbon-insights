import { Button } from "@/components/ui/button";
import { ArrowRight, Leaf, Users, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";
import { useSiteContent, contentMap } from "@/hooks/useSiteContent";

interface CTAValue { label?: string; href?: string }

const Hero = () => {
  const { data } = useSiteContent("hero");
  const c = contentMap(data);
  const eyebrow = (c.eyebrow as string) ?? "Inform · Inspire · Enable";
  const title = (c.title as string) ?? "Empowering people to live and work more sustainably";
  const subtitle = (c.subtitle as string) ?? "We help people, communities and organisations take practical action on climate change.";
  const primary = (c.primary_cta as CTAValue) ?? { label: "Support Our Work", href: "#cta" };
  const secondary = (c.secondary_cta as CTAValue) ?? { label: "Explore Programmes", href: "#programmes" };

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
            <Link to="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Log In
            </Link>
            <Link to="/signup">
              <Button variant="heroOutline" size="lg">
                Get Involved
              </Button>
            </Link>
          </div>
        </nav>

        <div className="max-w-4xl mx-auto text-center pt-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8 animate-fade-up">
            <Leaf className="w-4 h-4" />
            {eyebrow}
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold text-foreground leading-tight mb-6 animate-fade-up" style={{ animationDelay: '0.1s' }}>
            {title}
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            {subtitle}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up" style={{ animationDelay: '0.3s' }}>
            <a href={primary.href ?? "#"} target={primary.href?.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="w-full sm:w-auto">
              <Button variant="hero" size="xl" className="w-full">
                {primary.label}
                <ArrowRight className="w-5 h-5" />
              </Button>
            </a>
            <a href={secondary.href ?? "#"} className="w-full sm:w-auto">
              <Button variant="heroOutline" size="xl" className="w-full">
                {secondary.label}
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

        {/* Mission Preview */}
        <div className="mt-20 max-w-5xl mx-auto animate-fade-up" style={{ animationDelay: '0.5s' }}>
          <div className="relative">
            <div className="absolute inset-0 gradient-bg rounded-2xl blur-xl opacity-20 scale-105" />
            <div className="relative bg-card rounded-2xl shadow-soft border border-border overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30">
                <div className="w-3 h-3 rounded-full bg-destructive/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-400/60" />
                <div className="w-3 h-3 rounded-full bg-primary/60" />
              </div>
              <div className="p-6 md:p-8">
                <MissionPreview />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const MissionPreview = () => {
  const focusAreas = [
    { name: "Community outreach & education", value: 90, color: "bg-primary" },
    { name: "Local sustainability infrastructure", value: 75, color: "bg-accent" },
    { name: "Cross-sector collaboration", value: 65, color: "bg-primary/60" },
    { name: "Centres of excellence", value: 50, color: "bg-accent/60" },
  ];

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Our Mission in Action</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-muted/50 rounded-xl p-4">
            <p className="text-sm text-muted-foreground">Inform</p>
            <p className="text-2xl font-bold gradient-text">Knowledge</p>
            <p className="text-xs text-muted-foreground">tools & resources</p>
          </div>
          <div className="bg-muted/50 rounded-xl p-4">
            <p className="text-sm text-muted-foreground">Inspire</p>
            <p className="text-2xl font-bold gradient-text">Action</p>
            <p className="text-xs text-muted-foreground">stories & outreach</p>
          </div>
          <div className="bg-muted/50 rounded-xl p-4">
            <p className="text-sm text-muted-foreground">Enable</p>
            <p className="text-2xl font-bold gradient-text">Impact</p>
            <p className="text-xs text-muted-foreground">infrastructure & support</p>
          </div>
        </div>
        <div className="bg-muted/50 rounded-xl p-4">
          <p className="text-sm text-muted-foreground mb-3">Focus Areas</p>
          <div className="space-y-3">
            {focusAreas.map((area) => (
              <div key={area.name} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{area.name}</span>
                  <span className="font-medium text-foreground">{area.value}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className={`h-full ${area.color} rounded-full transition-all duration-700`} style={{ width: `${area.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Live Programmes</h3>
        <div className="space-y-3">
          {["Sustainability Centre", "Climate Action Plans", "SW Climate Action Programme", "Community Climate Action", "Eco-Save App"].map((p) => (
            <div key={p} className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <span className="text-foreground">{p}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hero;
