import { Button } from "@/components/ui/button";
import { ArrowRight, Mail } from "lucide-react";

const CTA = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="relative max-w-4xl mx-auto">
          {/* Glow effect */}
          <div className="absolute inset-0 gradient-bg rounded-3xl blur-2xl opacity-20" />
          
          <div className="relative gradient-bg rounded-3xl p-12 md:p-16 text-center overflow-hidden">
            {/* Decorative circles */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-2xl" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-2xl" />
            
            <div className="relative">
              <h2 className="text-3xl md:text-5xl font-bold text-primary-foreground mb-4">
                Interested in Building This Together?
              </h2>
              <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-8">
                I'm looking for collaborators passionate about sustainability and problem-solving. 
                Let's create something impactful for small businesses.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button 
                  size="xl" 
                  className="bg-white text-primary hover:bg-white/90 shadow-lg w-full sm:w-auto"
                >
                  <Mail className="w-5 h-5" />
                  Reach Out to Collaborate
                </Button>
                <Button 
                  size="xl" 
                  variant="ghost"
                  className="text-primary-foreground hover:bg-white/10 w-full sm:w-auto"
                >
                  Learn More
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
