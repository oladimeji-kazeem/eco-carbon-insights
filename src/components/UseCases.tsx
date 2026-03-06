import { Card, CardContent } from "@/components/ui/card";
import { TrendingDown, Zap, Truck, Building2, Coffee, ShoppingBag } from "lucide-react";

const useCases = [
  {
    icon: Coffee,
    business: "Local Café Chain",
    type: "Food & Beverage",
    savings: "32%",
    co2: "4.2 tonnes",
    insight: "Switched to renewable energy supplier and reduced food waste by optimizing inventory with AI predictions.",
    timeline: "3 months",
  },
  {
    icon: Truck,
    business: "Metro Logistics Co.",
    type: "Transportation & Delivery",
    savings: "28%",
    co2: "18.7 tonnes",
    insight: "Route optimization and fleet transition to hybrid vehicles cut fuel costs by $12K/year.",
    timeline: "6 months",
  },
  {
    icon: Building2,
    business: "Greenfield Accounting",
    type: "Professional Services",
    savings: "45%",
    co2: "2.1 tonnes",
    insight: "Moved to paperless operations and identified HVAC inefficiency costing $3K extra annually.",
    timeline: "2 months",
  },
  {
    icon: ShoppingBag,
    business: "Urban Boutique",
    type: "Retail",
    savings: "22%",
    co2: "1.8 tonnes",
    insight: "Consolidated shipping schedules and switched packaging to recycled materials.",
    timeline: "4 months",
  },
];

const UseCases = () => {
  return (
    <section className="py-24 bg-secondary/30">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <TrendingDown className="w-4 h-4" />
            Real Impact
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            See What Businesses Like Yours Are Saving
          </h2>
          <p className="text-lg text-muted-foreground">
            Real examples of small businesses that identified and reduced their carbon footprint — and saved money doing it.
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
                    <h3 className="font-bold text-foreground text-lg">{useCase.business}</h3>
                    <p className="text-sm text-muted-foreground">{useCase.type}</p>
                  </div>
                </div>

                <p className="text-muted-foreground text-sm mb-5 leading-relaxed">
                  "{useCase.insight}"
                </p>

                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-primary/5 rounded-lg p-3 text-center">
                    <p className="text-xl font-bold text-primary">{useCase.savings}</p>
                    <p className="text-xs text-muted-foreground">Reduction</p>
                  </div>
                  <div className="bg-primary/5 rounded-lg p-3 text-center">
                    <p className="text-xl font-bold text-primary">{useCase.co2}</p>
                    <p className="text-xs text-muted-foreground">CO₂ Saved</p>
                  </div>
                  <div className="bg-primary/5 rounded-lg p-3 text-center">
                    <p className="text-xl font-bold text-primary">{useCase.timeline}</p>
                    <p className="text-xs text-muted-foreground">Timeline</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UseCases;
