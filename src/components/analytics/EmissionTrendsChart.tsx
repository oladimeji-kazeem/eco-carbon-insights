
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const data = [
    { month: 'Jan', scope1: 40, scope2: 24, scope3: 24 },
    { month: 'Feb', scope1: 30, scope2: 13, scope3: 22 },
    { month: 'Mar', scope1: 20, scope2: 58, scope3: 22 },
    { month: 'Apr', scope1: 27, scope2: 39, scope3: 20 },
    { month: 'May', scope1: 18, scope2: 48, scope3: 21 },
    { month: 'Jun', scope1: 23, scope2: 38, scope3: 25 },
    { month: 'Jul', scope1: 34, scope2: 43, scope3: 21 },
];

export function EmissionTrendsChart() {
    return (
        <Card className="col-span-4">
            <CardHeader>
                <CardTitle>Emission Trends</CardTitle>
                <CardDescription>
                    Monthly carbon emissions breakdown by Scope.
                </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={350}>
                    <AreaChart data={data}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorScope1" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorScope2" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}t`} />
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                        <Tooltip />
                        <Area type="monotone" dataKey="scope1" stackId="1" stroke="#8884d8" fillOpacity={1} fill="url(#colorScope1)" />
                        <Area type="monotone" dataKey="scope2" stackId="1" stroke="#82ca9d" fillOpacity={1} fill="url(#colorScope2)" />
                        <Area type="monotone" dataKey="scope3" stackId="1" stroke="#ffc658" fill="#ffc658" />
                    </AreaChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
