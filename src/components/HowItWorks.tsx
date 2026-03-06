import { Upload, Cpu, BarChart3, ArrowRight } from "lucide-react";


const steps = [
  {
    icon: Upload,
    title: "Upload Your Data",
    description: "Simply upload invoices, bank statements, or transaction data. We support CSV, PDF, and direct integrations.",
    step: "01",
  },
  {
    icon: Cpu,
    title: "AI Analysis",
    description: "Our engine automatically categorizes expenses and calculates carbon emissions using verified emission factors.",
    step: "02",
  },
  {
    icon: BarChart3,
    title: "Get Insights",
    description: "Receive a detailed carbon report with your highest impact areas and actionable reduction recommendations.",
    step: "03",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            How It <span className="gradient-text">Works</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            From raw business data to actionable carbon insights in three simple steps.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div key={step.title} className="relative group">
              {/* Connector line */}
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
          <div className="inline-flex items-center gap-2 text-primary font-medium hover:gap-4 transition-all cursor-pointer">
            <span>See detailed walkthrough</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
