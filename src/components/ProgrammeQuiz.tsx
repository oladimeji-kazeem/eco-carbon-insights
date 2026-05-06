import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, RotateCcw, Sparkles } from "lucide-react";
import { programmes, type Programme } from "@/data/programmes";

interface QuizOption {
  label: string;
  weights: Partial<Record<string, number>>; // programme slug -> weight
}

interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
}

const questions: QuizQuestion[] = [
  {
    id: "role",
    question: "Which best describes you?",
    options: [
      {
        label: "An individual or household",
        weights: { "eco-save-app": 3, "community-climate-action": 1 },
      },
      {
        label: "A community group or local organisation",
        weights: { "community-climate-action": 3, "climate-action-plans": 2 },
      },
      {
        label: "A small business or workplace",
        weights: { "climate-action-programme": 3, "eco-centres": 2 },
      },
      {
        label: "A council, school or public body",
        weights: { "climate-action-plans": 3, "sustainability-centre": 2 },
      },
    ],
  },
  {
    id: "goal",
    question: "What's your main goal right now?",
    options: [
      {
        label: "Cut bills and household carbon",
        weights: { "eco-save-app": 3, "eco-centres": 1 },
      },
      {
        label: "Lead a local climate project",
        weights: { "community-climate-action": 3, "climate-action-plans": 2 },
      },
      {
        label: "Innovate and collaborate across sectors",
        weights: { "climate-action-programme": 3 },
      },
      {
        label: "Learn, visit and discover sustainable solutions",
        weights: { "sustainability-centre": 3, "eco-centres": 2 },
      },
    ],
  },
  {
    id: "support",
    question: "What kind of support would help you most?",
    options: [
      {
        label: "Tools, tips and tracking",
        weights: { "eco-save-app": 3 },
      },
      {
        label: "Practical training and demonstrations",
        weights: { "eco-centres": 3, "sustainability-centre": 1 },
      },
      {
        label: "A tailored plan for my community",
        weights: { "climate-action-plans": 3, "community-climate-action": 2 },
      },
      {
        label: "A network of innovators and champions",
        weights: { "climate-action-programme": 3 },
      },
    ],
  },
];

const ProgrammeQuiz = () => {
  const [step, setStep] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [done, setDone] = useState(false);

  const handleAnswer = (option: QuizOption) => {
    const updated = { ...scores };
    for (const [slug, w] of Object.entries(option.weights)) {
      updated[slug] = (updated[slug] ?? 0) + (w ?? 0);
    }
    setScores(updated);

    if (step + 1 < questions.length) {
      setStep(step + 1);
    } else {
      setDone(true);
    }
  };

  const reset = () => {
    setScores({});
    setStep(0);
    setDone(false);
  };

  const recommendation: Programme | undefined = (() => {
    if (!done) return undefined;
    const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    const topSlug = sorted[0]?.[0];
    return programmes.find((p) => p.slug === topSlug) ?? programmes[0];
  })();

  const progress = done ? 100 : Math.round(((step) / questions.length) * 100);

  return (
    <section id="quiz" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Find Your Programme
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Which Eco Centre programme is right for you?
          </h2>
          <p className="text-lg text-muted-foreground">
            Answer three quick questions and we'll recommend the best place to start.
          </p>
        </div>

        <Card className="max-w-2xl mx-auto border-border/50 shadow-soft">
          <CardContent className="p-8">
            {/* Progress bar */}
            <div className="mb-6">
              <div className="flex justify-between text-xs text-muted-foreground mb-2">
                <span>{done ? "Complete" : `Question ${step + 1} of ${questions.length}`}</span>
                <span>{progress}%</span>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full gradient-bg transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {!done && (
              <div className="space-y-4 animate-fade-in">
                <h3 className="text-xl font-bold text-foreground">
                  {questions[step].question}
                </h3>
                <div className="space-y-2">
                  {questions[step].options.map((opt) => (
                    <button
                      key={opt.label}
                      onClick={() => handleAnswer(opt)}
                      className="w-full text-left p-4 rounded-xl border border-border hover:border-primary hover:bg-primary/5 transition-all group flex items-center justify-between"
                    >
                      <span className="font-medium text-foreground">{opt.label}</span>
                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {done && recommendation && (
              <div className="space-y-6 animate-fade-up text-center">
                <Badge variant="secondary" className="mx-auto">Your match</Badge>
                <div className="w-16 h-16 mx-auto rounded-2xl gradient-bg flex items-center justify-center shadow-glow">
                  <recommendation.icon className="w-8 h-8 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">
                    {recommendation.title}
                  </h3>
                  <p className="text-muted-foreground">{recommendation.tagline}</p>
                </div>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  {recommendation.mission}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link to={`/programmes/${recommendation.slug}`}>
                    <Button variant="hero" size="lg" className="w-full sm:w-auto">
                      Explore programme
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Button variant="outline" size="lg" onClick={reset}>
                    <RotateCcw className="w-4 h-4" />
                    Retake quiz
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default ProgrammeQuiz;
