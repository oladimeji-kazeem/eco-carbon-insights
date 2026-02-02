import { Button } from "@/components/ui/button";
import { ArrowRight, Leaf, Zap, Clock } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-screen hero-gradient overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="relative container mx-auto px-6 pt-32 pb-20">
        <nav className="absolute top-0 left-0 right-0 flex items-center justify-between py-6 px-6">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center">
              <Leaf className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">CarbonTrack</span>
          </div>
          <Button variant="heroOutline" size="lg">
            Get Early Access
          </Button>
        </nav>

        <div className="max-w-4xl mx-auto text-center pt-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8 animate-fade-up">
            <Zap className="w-4 h-4" />
            Carbon Reports in Under 10 Minutes
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold text-foreground leading-tight mb-6 animate-fade-up" style={{ animationDelay: '0.1s' }}>
            Turn Business Data Into{' '}
            <span className="gradient-text">Carbon Insights</span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            Upload your invoices and transactions. Get instant carbon footprint analysis with actionable recommendations for your small business.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up" style={{ animationDelay: '0.3s' }}>
            <Button variant="hero" size="xl" className="w-full sm:w-auto">
              Start Free Analysis
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button variant="heroOutline" size="xl" className="w-full sm:w-auto">
              See How It Works
            </Button>
          </div>

          <div className="flex items-center justify-center gap-8 mt-12 text-sm text-muted-foreground animate-fade-up" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              <span>10 min setup</span>
            </div>
            <div className="flex items-center gap-2">
              <Leaf className="w-4 h-4 text-primary" />
              <span>GHG Protocol aligned</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              <span>Instant insights</span>
            </div>
          </div>
        </div>

        {/* Dashboard Preview */}
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
                <DashboardPreview />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const DashboardPreview = () => {
  const impactAreas = [
    { name: "Shipping", value: 42, color: "bg-primary" },
    { name: "Energy", value: 28, color: "bg-accent" },
    { name: "Materials", value: 18, color: "bg-primary/60" },
    { name: "Travel", value: 12, color: "bg-accent/60" },
  ];

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Carbon Footprint Overview</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-muted/50 rounded-xl p-4">
            <p className="text-sm text-muted-foreground">Total Emissions</p>
            <p className="text-3xl font-bold gradient-text">24.5</p>
            <p className="text-sm text-muted-foreground">tonnes CO₂e</p>
          </div>
          <div className="bg-muted/50 rounded-xl p-4">
            <p className="text-sm text-muted-foreground">Reduction Potential</p>
            <p className="text-3xl font-bold text-primary">-32%</p>
            <p className="text-sm text-muted-foreground">with recommendations</p>
          </div>
        </div>
        <div className="bg-muted/50 rounded-xl p-4">
          <p className="text-sm text-muted-foreground mb-3">Monthly Trend</p>
          <div className="flex items-end gap-2 h-24">
            {[65, 72, 58, 80, 68, 55, 48].map((height, i) => (
              <div key={i} className="flex-1 bg-primary/20 rounded-t-lg relative overflow-hidden">
                <div 
                  className="absolute bottom-0 left-0 right-0 gradient-bg rounded-t-lg transition-all duration-500"
                  style={{ height: `${height}%` }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Impact Areas</h3>
        <div className="space-y-3">
          {impactAreas.map((area) => (
            <div key={area.name} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{area.name}</span>
                <span className="font-medium text-foreground">{area.value}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className={`h-full ${area.color} rounded-full transition-all duration-700`}
                  style={{ width: `${area.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hero;
