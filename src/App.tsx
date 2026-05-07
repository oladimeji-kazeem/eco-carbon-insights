import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import DashboardLayout from "./components/layouts/DashboardLayout";
import Dashboard from "./pages/dashboard/Dashboard";
import Settings from "./pages/dashboard/Settings";
import OperationsDashboard from "./pages/operations/OperationsDashboard";
import DataSources from "./pages/operations/DataSources";
import AnalyticsDashboard from "./pages/analytics/AnalyticsDashboard";
import UploadAnalysisPage from "./pages/dashboard/UploadAnalysisPage";
import NotFound from "./pages/NotFound";
import ProgrammeDetail from "./pages/ProgrammeDetail";
import { AuthProvider } from "./hooks/useAuth";
import RequireAuth from "./components/admin/RequireAuth";
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ContentEditor from "./pages/admin/ContentEditor";
import ProgrammesEditor from "./pages/admin/ProgrammesEditor";
import SiteSettingsEditor from "./pages/admin/SiteSettingsEditor";
import UsersAdmin from "./pages/admin/UsersAdmin";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/programmes/:slug" element={<ProgrammeDetail />} />

            <Route
              path="/admin"
              element={
                <RequireAuth requireEditor>
                  <AdminLayout />
                </RequireAuth>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="content" element={<ContentEditor />} />
              <Route path="programmes" element={<ProgrammesEditor />} />
              <Route
                path="settings"
                element={
                  <RequireAuth requireAdmin>
                    <SiteSettingsEditor />
                  </RequireAuth>
                }
              />
              <Route
                path="users"
                element={
                  <RequireAuth requireAdmin>
                    <UsersAdmin />
                  </RequireAuth>
                }
              />
            </Route>

            <Route path="/app" element={<DashboardLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="upload" element={<UploadAnalysisPage />} />
              <Route path="analytics" element={<AnalyticsDashboard />} />
              <Route path="settings" element={<Settings />} />
              <Route path="operations">
                <Route index element={<OperationsDashboard />} />
                <Route path="sources" element={<DataSources />} />
              </Route>
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
