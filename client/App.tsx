import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { ChatFab } from "@/components/chat/ChatFab";
import { useAuth } from "@/hooks/useLocalStorage";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import OnboardingSurvey from "./pages/OnboardingSurvey";
import Dashboard from "./pages/Dashboard";
import FinancialHub from "./pages/FinancialHub";
import Simulations from "./pages/Simulations";
import StockMarketSimulator from "./pages/StockMarketSimulator";
import LifeScenarioSimulator from "./pages/LifeScenarioSimulator";
import Lessons from "./pages/Lessons";
import LessonView from "./pages/LessonView";
import Goals from "./pages/Goals";
import Leaderboard from "./pages/Leaderboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const Layout = ({ children }: { children: React.ReactNode }) => (
  <>
    <Header />
    {children}
    <ChatFab />
  </>
);

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [authState] = useAuth();

  if (!authState.isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  if (authState.user && !authState.user.onboardingComplete) {
    return <Navigate to="/onboarding" replace />;
  }

  return <Layout>{children}</Layout>;
};

const OnboardingRoute = ({ children }: { children: React.ReactNode }) => {
  const [authState] = useAuth();

  if (!authState.isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  if (authState.user && authState.user.onboardingComplete) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Layout><Home /></Layout>} />
            <Route path="/auth" element={<Auth />} />

            {/* Onboarding Route (after login, before dashboard) */}
            <Route
              path="/onboarding"
              element={
                <OnboardingRoute>
                  <OnboardingSurvey />
                </OnboardingRoute>
              }
            />

            {/* Protected Routes - Require auth & completed onboarding */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/financial-hub"
              element={
                <ProtectedRoute>
                  <FinancialHub />
                </ProtectedRoute>
              }
            />

            {/* Simulations */}
            <Route
              path="/simulations"
              element={
                <ProtectedRoute>
                  <Simulations />
                </ProtectedRoute>
              }
            />
            <Route
              path="/simulators/stock-market"
              element={
                <ProtectedRoute>
                  <StockMarketSimulator />
                </ProtectedRoute>
              }
            />
            <Route
              path="/simulators/job-loss"
              element={
                <ProtectedRoute>
                  <LifeScenarioSimulator scenarioId="job-loss" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/simulators/medical-emergency"
              element={
                <ProtectedRoute>
                  <LifeScenarioSimulator scenarioId="medical-emergency" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/simulators/wedding"
              element={
                <ProtectedRoute>
                  <LifeScenarioSimulator scenarioId="wedding" />
                </ProtectedRoute>
              }
            />

            {/* Placeholder routes for crypto, debt */}
            <Route
              path="/simulators/crypto"
              element={
                <ProtectedRoute>
                  <PlaceholderPage title="Crypto Sandbox" description="Trade Bitcoin, Ethereum, and Dogecoin with extreme volatility." />
                </ProtectedRoute>
              }
            />
            <Route
              path="/simulators/debt-payoff"
              element={
                <ProtectedRoute>
                  <PlaceholderPage title="Debt Payoff Challenge" description="Manage multiple debts and learn payoff strategies." />
                </ProtectedRoute>
              }
            />

            {/* Lessons */}
            <Route
              path="/lessons"
              element={
                <ProtectedRoute>
                  <Lessons />
                </ProtectedRoute>
              }
            />
            <Route
              path="/lessons/:lessonId"
              element={
                <ProtectedRoute>
                  <LessonView />
                </ProtectedRoute>
              }
            />

            {/* Placeholder routes for other features */}
            <Route
              path="/goals"
              element={
                <ProtectedRoute>
                  <Goals />
                </ProtectedRoute>
              }
            />
            <Route
              path="/leaderboard"
              element={
                <ProtectedRoute>
                  <Leaderboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/budget"
              element={
                <ProtectedRoute>
                  <PlaceholderPage title="Budget Tracker" description="Track expenses and manage your budget effectively." />
                </ProtectedRoute>
              }
            />
            <Route
              path="/cibil"
              element={
                <ProtectedRoute>
                  <PlaceholderPage title="CIBIL Health Coach" description="Track and improve your credit score with actionable insights." />
                </ProtectedRoute>
              }
            />
            <Route
              path="/coach"
              element={
                <ProtectedRoute>
                  <PlaceholderPage title="AI Coach" description="Get personalized financial advice from your AI coach." />
                </ProtectedRoute>
              }
            />

            {/* Catch-all route */}
            <Route path="*" element={<Layout><NotFound /></Layout>} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

function PlaceholderPage({ title, description }: { title: string; description: string }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex items-center justify-center pt-24">
      <div className="text-center">
        <h1 className="text-4xl font-display font-bold text-gray-900 dark:text-white mb-4">
          {title}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-md">
          {description}
        </p>
        <p className="text-gray-500 dark:text-gray-500 text-sm">
          This page is coming soon. Continue prompting to build this feature!
        </p>
      </div>
    </div>
  );
}

const rootElement = document.getElementById("root");
if (rootElement && !rootElement.hasChildNodes()) {
  createRoot(rootElement).render(<App />);
}
