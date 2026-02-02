
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingDown, TrendingUp, Minus } from "lucide-react";

interface IntensityMetricProps {
    title: string;
    value: string;
    unit: string;
    change: number;
    description: string;
}

export function IntensityMetric({ title, value, unit, change, description }: IntensityMetricProps) {
    const isPositive = change > 0;
    const isNegative = change < 0;

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                {isNegative ? (
                    <TrendingDown className="h-4 w-4 text-green-500" />
                ) : isPositive ? (
                    <TrendingUp className="h-4 w-4 text-destructive" />
                ) : (
                    <Minus className="h-4 w-4 text-muted-foreground" />
                )}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">
                    {value} <span className="text-sm font-normal text-muted-foreground">{unit}</span>
                </div>
                <p className={`text-xs ${isNegative ? 'text-green-500' : isPositive ? 'text-destructive' : 'text-muted-foreground'}`}>
                    {isPositive ? '+' : ''}{change}% from last month
                </p>
                <p className="text-xs text-muted-foreground mt-1">{description}</p>
            </CardContent>
        </Card>
    );
}
