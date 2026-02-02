import { 
  FileSpreadsheet, 
  Zap, 
  Shield, 
  TrendingDown,
  Building2,
  Globe
} from "lucide-react";

const features = [
  {
    icon: FileSpreadsheet,
    title: "Multiple Data Formats",
    description: "Upload CSVs, PDFs, or connect accounting software directly. We handle the heavy lifting.",
  },
  {
    icon: Zap,
    title: "Instant Processing",
    description: "Get your carbon report in under 10 minutes, not weeks. Powered by advanced AI categorization.",
  },
  {
    icon: Shield,
    title: "Verified Methodology",
    description: "Based on GHG Protocol standards with region-specific emission factors for accuracy.",
  },
  {
    icon: TrendingDown,
    title: "Reduction Roadmap",
    description: "Not just numbers—get prioritized, actionable recommendations to cut your carbon footprint.",
  },
  {
    icon: Building2,
    title: "Built for SMBs",
    description: "Designed specifically for small businesses. No complex setups or enterprise pricing.",
  },
  {
    icon: Globe,
    title: "Scope 1, 2 & 3",
    description: "Cover direct emissions, energy, and supply chain impacts for a complete picture.",
  },
];

const Features = () => {
  return (
    <section className="py-24 hero-gradient">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Everything You Need for{' '}
            <span className="gradient-text">Carbon Reporting</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Purpose-built features for small businesses to measure, understand, and reduce their environmental impact.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature) => (
            <div 
              key={feature.title} 
              className="group bg-card rounded-2xl p-6 shadow-soft border border-border transition-all duration-300 hover:shadow-glow hover:-translate-y-1"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
