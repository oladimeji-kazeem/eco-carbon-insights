import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Upload, Loader2, FileText, CheckCircle2, Zap,
  TrendingDown, BarChart3, Lightbulb, Leaf, Compass, ArrowRight
} from "lucide-react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { programmesForCategory, getProgrammeBySlug, type Programme, type Pillar } from "@/data/programmes";
import { loadQuizState } from "@/lib/quizStorage";

const PILLAR_DESCRIPTIONS: Record<Pillar, string> = {
  Inform: "Knowledge, tools and data so you understand your impact.",
  Inspire: "Stories and examples that motivate action.",
  Enable: "Practical infrastructure and support to take action.",
};

interface AnalysisResult {
  id: string;
  filename: string;
  totalCarbon: number;
  categories: { name: string; amount: number; percentage: number }[];
  insights: string[];
  topAction: string;
  savingsPotential: string;
}

export default function UploadAnalysis() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState("");
  const [results, setResults] = useState<AnalysisResult[]>([]);

  const simulateAnalysis = async (file: File) => {
    setIsProcessing(true);
    setProgress(0);

    setStage("Uploading document...");
    setProgress(15);
    await new Promise((r) => setTimeout(r, 800));

    setStage("Extracting line items...");
    setProgress(35);
    await new Promise((r) => setTimeout(r, 1200));

    setStage("Running AI carbon mapping...");
    setProgress(60);
    await new Promise((r) => setTimeout(r, 1500));

    setStage("Generating insights...");
    setProgress(85);
    await new Promise((r) => setTimeout(r, 1000));

    setProgress(100);
    setStage("Complete!");

    const totalCarbon = Math.floor(Math.random() * 800 + 200);

    const result: AnalysisResult = {
      id: uuidv4(),
      filename: file.name,
      totalCarbon,
      categories: [
        { name: "Energy", amount: Math.floor(totalCarbon * 0.42), percentage: 42 },
        { name: "Travel", amount: Math.floor(totalCarbon * 0.25), percentage: 25 },
        { name: "Logistics", amount: Math.floor(totalCarbon * 0.2), percentage: 20 },
        { name: "Operations", amount: Math.floor(totalCarbon * 0.13), percentage: 13 },
      ],
      insights: [
        "Electricity accounts for 42% of your carbon footprint — switching to a green tariff could reduce this by up to 80%.",
        "Business travel emissions are 2.3x industry average for your sector. Video conferencing could save ~6.2 tonnes/year.",
        "Shipping consolidation opportunity: 15 separate deliveries last month could be batched to 6.",
      ],
      topAction: "Switch to a certified green energy provider",
      savingsPotential: `${Math.floor(totalCarbon * 0.35)} kg CO₂ / year`,
    };

    setResults((prev) => [result, ...prev]);
    setIsProcessing(false);
    toast.success(`Analysis complete for ${file.name}`);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await simulateAnalysis(e.target.files[0]);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Upload & Analyze</h2>
        <p className="text-muted-foreground">
          Upload invoices, bills, or transactions — get a carbon report in under 10 minutes.
        </p>
      </div>

      {/* Upload zone */}
      <Card>
        <CardContent className="pt-6">
          <div
            className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center gap-4 transition-colors cursor-pointer ${
              isProcessing ? "border-primary/50 bg-primary/5" : "border-border hover:bg-muted/50 hover:border-primary/30"
            }`}
            onClick={() => !isProcessing && fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileSelect}
              accept=".pdf,.png,.jpg,.jpeg,.csv,.xlsx"
              disabled={isProcessing}
            />
            <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
              {isProcessing ? (
                <Loader2 className="h-7 w-7 animate-spin text-primary" />
              ) : (
                <Upload className="h-7 w-7 text-primary" />
              )}
            </div>
            {isProcessing ? (
              <div className="text-center w-full max-w-sm space-y-3">
                <p className="font-medium text-foreground">{stage}</p>
                <Progress value={progress} className="h-2" />
                <p className="text-xs text-muted-foreground">{progress}% complete</p>
              </div>
            ) : (
              <div className="text-center">
                <p className="font-medium text-foreground">Drop your business documents here</p>
                <p className="text-sm text-muted-foreground">
                  Invoices, utility bills, fuel receipts, travel expenses — PDF, CSV, Excel
                </p>
              </div>
            )}
            {!isProcessing && (
              <Button variant="default" size="lg">
                <FileText className="w-4 h-4" />
                Select Files
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Saved quiz recommendation */}
      <SavedQuizRecommendation />

      {/* Results */}
      {results.map((result) => (
        <div key={result.id} className="space-y-4 animate-fade-up">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Analysis: {result.filename}</h3>
          </div>

          {/* Summary cards */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Carbon Footprint</CardTitle>
                <Leaf className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{result.totalCarbon} kg</div>
                <p className="text-xs text-muted-foreground">CO₂ equivalent</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">#1 Action</CardTitle>
                <Zap className="h-4 w-4 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-sm font-bold">{result.topAction}</div>
                <p className="text-xs text-muted-foreground">Highest impact change</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Savings Potential</CardTitle>
                <TrendingDown className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{result.savingsPotential}</div>
                <p className="text-xs text-muted-foreground">Estimated annual reduction</p>
              </CardContent>
            </Card>
          </div>

          {/* Category breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Emission Breakdown by Category
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {result.categories.map((cat) => (
                <div key={cat.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{cat.name}</span>
                    <span className="text-muted-foreground">{cat.amount} kg CO₂ ({cat.percentage}%)</span>
                  </div>
                  <Progress value={cat.percentage} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* AI Insights */}
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <Lightbulb className="h-5 w-5" />
                AI-Powered Insights
              </CardTitle>
              <CardDescription>Actionable recommendations to reduce your footprint and save money.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {result.insights.map((insight, i) => (
                  <li key={i} className="flex gap-3 text-sm">
                    <Badge variant="secondary" className="h-6 w-6 rounded-full flex-shrink-0 flex items-center justify-center p-0 text-xs">
                      {i + 1}
                    </Badge>
                    <span className="text-foreground">{insight}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Eco Centre programme mapping */}
          <ProgrammeMapping result={result} />
        </div>
      ))}
    </div>
  );
}

interface MappingProps {
  result: AnalysisResult;
}

function ProgrammeMapping({ result }: MappingProps) {
  // Aggregate recommended programmes weighted by category percentage
  const programmeScores = new Map<string, { programme: Programme; weight: number }>();
  for (const cat of result.categories) {
    for (const programme of programmesForCategory(cat.name)) {
      const existing = programmeScores.get(programme.slug);
      programmeScores.set(programme.slug, {
        programme,
        weight: (existing?.weight ?? 0) + cat.percentage,
      });
    }
  }
  const recommended = Array.from(programmeScores.values())
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 3);

  // Pillar coverage based on recommended programmes
  const pillars: Pillar[] = ["Inform", "Inspire", "Enable"];
  const pillarMatches = pillars.map((pillar) => ({
    pillar,
    programmes: recommended
      .filter(({ programme }) => programme.pillars.includes(pillar))
      .map((r) => r.programme),
  }));

  return (
    <Card className="border-accent/20 bg-accent/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Compass className="h-5 w-5 text-primary" />
          How Eco Centre can help
        </CardTitle>
        <CardDescription>
          Your highest-impact areas map to these Eco Centre focus pillars and programmes.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Pillar mapping */}
        <div className="grid gap-3 md:grid-cols-3">
          {pillarMatches.map(({ pillar, programmes: progs }) => (
            <div key={pillar} className="rounded-lg bg-card border border-border p-4">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-semibold text-foreground">{pillar}</h4>
                <Badge variant="secondary">{progs.length}</Badge>
              </div>
              <p className="text-xs text-muted-foreground mb-3">
                {PILLAR_DESCRIPTIONS[pillar]}
              </p>
              <div className="space-y-1">
                {progs.length === 0 && (
                  <p className="text-xs text-muted-foreground italic">No direct match</p>
                )}
                {progs.map((p) => (
                  <Link
                    key={p.slug}
                    to={`/programmes/${p.slug}`}
                    className="block text-xs text-primary hover:underline"
                  >
                    · {p.title}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Recommended programmes list */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-foreground">Recommended programmes</h4>
          <div className="grid gap-2">
            {recommended.map(({ programme }) => {
              const Icon = programme.icon;
              return (
                <Link
                  key={programme.slug}
                  to={`/programmes/${programme.slug}`}
                  className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card hover:border-primary hover:bg-primary/5 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground text-sm">{programme.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{programme.tagline}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                </Link>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
