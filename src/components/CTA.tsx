import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Mail, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { useSiteContent, contentMap } from "@/hooks/useSiteContent";

interface CTAValue { label?: string; href?: string }

const emailSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Please enter a valid email").max(255),
});

const CTA = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { data } = useSiteContent("cta");
  const c = contentMap(data);
  const title = (c.title as string) ?? "Help us help our planet";
  const subtitle = (c.subtitle as string) ?? "Join our community of supporters, volunteers and partners.";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = emailSchema.safeParse({ name, email });
    if (!result.success) {
      toast.error(result.error.errors[0].message);
      return;
    }

    setIsSubmitting(true);

    // Simulate submission (replace with real backend when Cloud is enabled)
    await new Promise((resolve) => setTimeout(resolve, 1200));

    setIsSubmitting(false);
    setIsSubmitted(true);
    toast.success("You're in! We'll be in touch soon.");
  };

  return (
    <section id="signup" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="relative max-w-4xl mx-auto">
          <div className="absolute inset-0 gradient-bg rounded-3xl blur-2xl opacity-20" />

          <div className="relative gradient-bg rounded-3xl p-12 md:p-16 text-center overflow-hidden">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-2xl" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-2xl" />

            <div className="relative">
              <h2 className="text-3xl md:text-5xl font-bold text-primary-foreground mb-4">
                {title}
              </h2>
              <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-8">
                {subtitle}
              </p>

              {isSubmitted ? (
                <div className="flex flex-col items-center gap-3 animate-fade-up">
                  <div className="h-16 w-16 rounded-full bg-white/20 flex items-center justify-center">
                    <CheckCircle2 className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <p className="text-xl font-semibold text-primary-foreground">
                    Thanks, {name.split(" ")[0]}! We'll be in touch.
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-lg mx-auto"
                >
                  <Input
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-white/20 border-white/30 text-primary-foreground placeholder:text-primary-foreground/60 h-12"
                    required
                    maxLength={100}
                  />
                  <Input
                    type="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white/20 border-white/30 text-primary-foreground placeholder:text-primary-foreground/60 h-12"
                    required
                    maxLength={255}
                  />
                  <Button
                    type="submit"
                    size="lg"
                    disabled={isSubmitting}
                    className="bg-white text-primary hover:bg-white/90 shadow-lg w-full sm:w-auto flex-shrink-0 h-12"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Mail className="w-5 h-5" />
                        Join
                      </>
                    )}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
