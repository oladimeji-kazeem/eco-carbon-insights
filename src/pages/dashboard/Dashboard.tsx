import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { Leaf, TrendingDown, FileText, Zap } from "lucide-react";
import { usePipelineStore } from "@/lib/pipelineStore";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const monthlyData = [
  { name: "Jan", carbon: 420 },
  { name: "Feb", carbon: 380 },
  { name: "Mar", carbon: 350 },
  { name: "Apr", carbon: 310 },
  { name: "May", carbon: 290 },
  { name: "Jun", carbon: 245 },
];

export default function Dashboard() {
  const { records, jobs } = usePipelineStore();
  const totalCarbon = records.reduce((sum, r) => sum + r.carbon_kg, 0);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Carbon Dashboard</h2>
          <p className="text-muted-foreground">Your business emissions at a glance.</p>
        </div>
        <Link to="/app/upload">
          <Button>
            <FileText className="mr-2 h-4 w-4" />
            Upload & Analyze
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Emissions</CardTitle>
            <Leaf className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCarbon || 1995} kg</div>
            <p className="text-xs text-muted-foreground">CO₂ equivalent this period</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reduction Rate</CardTitle>
            <TrendingDown className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">-15.3%</div>
            <p className="text-xs text-muted-foreground">vs. last quarter</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Files Processed</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{jobs.length || 24}</div>
            <p className="text-xs text-muted-foreground">Documents analyzed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Insight</CardTitle>
            <Zap className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-bold">Switch energy provider</div>
            <p className="text-xs text-muted-foreground">Could save ~35% emissions</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Monthly Carbon Trend</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={monthlyData}>
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}kg`} />
                <Tooltip />
                <Bar dataKey="carbon" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Records</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {(records.length > 0 ? records.slice(0, 4) : [
                { id: "1", description: "Electricity Q1", category: "Energy", carbon_kg: 420 },
                { id: "2", description: "Fleet fuel", category: "Logistics", carbon_kg: 310 },
                { id: "3", description: "Business flights", category: "Travel", carbon_kg: 245 },
              ]).map((r: any) => (
                <div key={r.id} className="flex items-center">
                  <div className="ml-0 space-y-1">
                    <p className="text-sm font-medium leading-none">{r.description}</p>
                    <p className="text-sm text-muted-foreground">{r.category}</p>
                  </div>
                  <div className="ml-auto font-medium text-foreground">{r.carbon_kg} kg</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
