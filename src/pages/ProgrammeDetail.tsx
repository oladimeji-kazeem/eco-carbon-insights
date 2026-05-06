import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, CheckCircle2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getProgrammeBySlug, programmes } from "@/data/programmes";
import Footer from "@/components/Footer";
import logo from "@/assets/logo.png";

const ProgrammeDetail = () => {
  const { slug } = useParams();
  const programme = slug ? getProgrammeBySlug(slug) : undefined;

  if (!programme) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-foreground">Programme not found</h1>
          <Link to="/" className="text-primary underline">Back to home</Link>
        </div>
      </div>
    );
  }

  const Icon = programme.icon;
  const others = programmes.filter((p) => p.slug !== programme.slug).slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="Eco Centre logo" className="w-8 h-8" />
            <span className="font-bold text-foreground">Eco Centre</span>
          </Link>
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> All programmes
          </Link>
        </div>
      </header>

      <section className="hero-gradient">
        <div className="container mx-auto px-6 py-20">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl gradient-bg flex items-center justify-center shadow-glow mb-6">
              <Icon className="w-8 h-8 text-primary-foreground" />
            </div>
            <div className="flex items-center justify-center gap-2 mb-4">
              {programme.pillars.map((pillar) => (
                <Badge key={pillar} variant="secondary">{pillar}</Badge>
              ))}
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4">
              {programme.title}
            </h1>
            <p className="text-xl text-muted-foreground">{programme.tagline}</p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-6 max-w-4xl space-y-12">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-3">Our mission</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">{programme.mission}</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground mb-3">About the programme</h2>
            <p className="text-muted-foreground leading-relaxed">{programme.description}</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">Highlights</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {programme.highlights.map((h) => (
                <Card key={h} className="border-border/50">
                  <CardContent className="p-5 flex gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <p className="text-foreground">{h}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="relative gradient-bg rounded-3xl p-10 md:p-12 text-center overflow-hidden">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-2xl" />
            <div className="relative">
              <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-3">
                Ready to take action?
              </h2>
              <p className="text-primary-foreground/80 mb-6 max-w-xl mx-auto">
                Join us in making {programme.title.toLowerCase()} a reality. Your support helps us inform, inspire and enable real change.
              </p>
              <a href={programme.cta.href} target="_blank" rel="noopener noreferrer">
                <Button size="xl" className="bg-white text-primary hover:bg-white/90">
                  {programme.cta.label}
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </a>
            </div>
          </div>

          <a
            href={programme.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all"
          >
            Read more on ecocentresw.org <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </section>

      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-6 max-w-5xl">
          <h2 className="text-2xl font-bold text-foreground mb-6">Explore other programmes</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {others.map((p) => {
              const PIcon = p.icon;
              return (
                <Link
                  key={p.slug}
                  to={`/programmes/${p.slug}`}
                  className="group bg-card rounded-xl p-5 border border-border hover:shadow-glow transition-all"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                    <PIcon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-bold text-foreground mb-1">{p.title}</h3>
                  <p className="text-sm text-muted-foreground">{p.tagline}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ProgrammeDetail;
