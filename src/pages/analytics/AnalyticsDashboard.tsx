
import { Button } from "@/components/ui/button";
import { Download, Calendar as CalendarIcon } from "lucide-react";
import { EmissionTrendsChart } from "@/components/analytics/EmissionTrendsChart";
import { CategoryBreakdownChart } from "@/components/analytics/CategoryBreakdownChart";
import { IntensityMetric } from "@/components/analytics/IntensityMetric";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function AnalyticsDashboard() {
    const [date, setDate] = useState<Date | undefined>(new Date());

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
                    <p className="text-muted-foreground">Deep dive into your organization's carbon footprint.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant={"outline"}
                                className={cn(
                                    "w-[240px] justify-start text-left font-normal",
                                    !date && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {date ? format(date, "PPP") : <span>Pick a date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="end">
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                    <Button variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        Export
                    </Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <IntensityMetric
                    title="Carbon Intensity"
                    value="0.45"
                    unit="kg/$"
                    change={-5.2}
                    description="Revenue based intensity"
                />
                <IntensityMetric
                    title="Total Emissions"
                    value="124.5"
                    unit="tCO2e"
                    change={2.1}
                    description="Gross emissions YTD"
                />
                <IntensityMetric
                    title="Carbon Offset"
                    value="24.0"
                    unit="tCO2e"
                    change={12.5}
                    description="Voluntary offsets retired"
                />
                <IntensityMetric
                    title="Net Emissions"
                    value="100.5"
                    unit="tCO2e"
                    change={0.8}
                    description="Total - Offsets"
                />
            </div>

            <div className="grid gap-4 md:grid-cols-7">
                <EmissionTrendsChart />
                <CategoryBreakdownChart />
            </div>
        </div>
    );
}
