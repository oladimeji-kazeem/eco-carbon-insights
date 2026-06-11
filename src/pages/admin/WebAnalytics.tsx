import { useState } from "react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity, MousePointerClick, Users, Clock, Globe, Laptop, ArrowUpRight } from "lucide-react";

// Mock Data for High-Fidelity UI since no real analytics tracking exists yet.
const trafficData = [
    { name: "Mon", visitors: 4000, pageviews: 6400 },
    { name: "Tue", visitors: 3000, pageviews: 5398 },
    { name: "Wed", visitors: 2000, pageviews: 8800 },
    { name: "Thu", visitors: 2780, pageviews: 3908 },
    { name: "Fri", visitors: 1890, pageviews: 4800 },
    { name: "Sat", visitors: 2390, pageviews: 3800 },
    { name: "Sun", visitors: 3490, pageviews: 4300 },
];

const sourceData = [
    { name: "Direct", value: 400 },
    { name: "Organic Search", value: 300 },
    { name: "Social Media", value: 300 },
    { name: "Referral", value: 200 },
];

const COLORS = ["#0ea5e9", "#22c55e", "#f59e0b", "#ec4899"];

const deviceData = [
    { name: "Desktop", value: 65 },
    { name: "Mobile", value: 30 },
    { name: "Tablet", value: 5 },
];

const topPages = [
    { path: "/", views: "12,403", bounce: "42%" },
    { path: "/programmes", views: "8,230", bounce: "31%" },
    { path: "/about", views: "5,400", bounce: "28%" },
    { path: "/operations/dashboard", views: "3,102", bounce: "15%" },
    { path: "/login", views: "2,843", bounce: "60%" },
];

export default function WebAnalytics() {
    const [range, setRange] = useState("7d");

    // In a real scenario, `range` would trigger a refetch of these mock datasets via Supabase / API.

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Web Analytics</h1>
                    <p className="text-muted-foreground mt-1">
                        Comprehensive platform traffic, user engagement, and acquisition metrics.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Select value={range} onValueChange={setRange}>
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Select range" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="24h">Last 24 Hours</SelectItem>
                            <SelectItem value="7d">Last 7 Days</SelectItem>
                            <SelectItem value="30d">Last 30 Days</SelectItem>
                            <SelectItem value="ytd">Year to Date</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="hover:border-primary/50 transition-colors">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Pageviews</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">37,406</div>
                        <p className="text-xs text-green-500 flex items-center mt-1">
                            <ArrowUpRight className="w-3 h-3 mr-1" /> +12.5% from last week
                        </p>
                    </CardContent>
                </Card>
                <Card className="hover:border-primary/50 transition-colors">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">19,550</div>
                        <p className="text-xs text-green-500 flex items-center mt-1">
                            <ArrowUpRight className="w-3 h-3 mr-1" /> +8.2% from last week
                        </p>
                    </CardContent>
                </Card>
                <Card className="hover:border-primary/50 transition-colors">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg Session Duration</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">4m 12s</div>
                        <p className="text-xs text-muted-foreground mt-1">Stable</p>
                    </CardContent>
                </Card>
                <Card className="hover:border-primary/50 transition-colors">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Bounce Rate</CardTitle>
                        <MousePointerClick className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">35.2%</div>
                        <p className="text-xs text-green-500 flex items-center mt-1">
                            <ArrowUpRight className="w-3 h-3 mr-1 rotate-180" /> -2.1% (Improved)
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="overview" className="mt-6">
                <TabsList className="grid grid-cols-3 max-w-md">
                    <TabsTrigger value="overview">Traffic Overview</TabsTrigger>
                    <TabsTrigger value="audience">Audience Context</TabsTrigger>
                    <TabsTrigger value="pages">Top Pages</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4 pt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Session Volume (7 Days)</CardTitle>
                            <CardDescription>Daily comparison of total page views versus unique visitors.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[350px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={trafficData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                                            </linearGradient>
                                            <linearGradient id="colorVis" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" />
                                        <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${v / 1000}k`} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))", borderRadius: "8px" }}
                                            itemStyle={{ color: "hsl(var(--foreground))" }}
                                        />
                                        <Area type="monotone" dataKey="pageviews" stroke="#0ea5e9" strokeWidth={2} fillOpacity={1} fill="url(#colorViews)" name="Page Views" />
                                        <Area type="monotone" dataKey="visitors" stroke="#22c55e" strokeWidth={2} fillOpacity={1} fill="url(#colorVis)" name="Unique Visitors" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="audience" className="pt-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2"><Globe className="w-5 h-5" /> Acquisition Sources</CardTitle>
                                <CardDescription>Where your traffic originates.</CardDescription>
                            </CardHeader>
                            <CardContent className="flex justify-center">
                                <div className="h-[300px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie data={sourceData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                                                {sourceData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))" }} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2"><Laptop className="w-5 h-5" /> Device Breakdown</CardTitle>
                                <CardDescription>Platform access by hardware type.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[300px] w-full mt-4">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart layout="vertical" data={deviceData} margin={{ top: 0, right: 30, left: 10, bottom: 0 }}>
                                            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="hsl(var(--muted))" />
                                            <XAxis type="number" hide />
                                            <YAxis dataKey="name" type="category" width={80} stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                                            <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))" }} formatter={(value) => `${value}%`} />
                                            <Bar dataKey="value" fill="#ec4899" radius={[0, 4, 4, 0]}>
                                                {deviceData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="pages" className="pt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Top Performing Content</CardTitle>
                            <CardDescription>Most visited endpoints across the platform.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {topPages.map((page, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 bg-muted/40 rounded-lg border border-border">
                                        <div className="font-mono text-sm text-primary">{page.path}</div>
                                        <div className="flex gap-8 text-sm">
                                            <div className="text-right">
                                                <div className="font-semibold">{page.views}</div>
                                                <div className="text-xs text-muted-foreground">Views</div>
                                            </div>
                                            <div className="text-right w-16">
                                                <div className="font-semibold text-foreground">{page.bounce}</div>
                                                <div className="text-xs text-muted-foreground">Bounce</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
