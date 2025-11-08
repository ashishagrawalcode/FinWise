import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useLocalStorage";
import { ChevronRight, Brain, Target } from "lucide-react";

export default function OnboardingSurvey() {
  const navigate = useNavigate();
  const [authState, { logout, updateUser }] = useAuth();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    experienceLevel: "beginner",
    mainGoal: "learn-basics",
    // financial inputs removed from onboarding
  });

  if (!authState.user) {
    navigate("/auth");
    return null;
  }

  const handleNext = () => {
    if (step < 2) {
      setStep(step + 1);
    } else {
      completeOnboarding();
    }
  };

  const completeOnboarding = () => {
    // Save onboarding data to localStorage
    const appState = {
      user: {
        ...authState.user,
        level: 1,
        xp: 0,
        badges: [],
        theme: "light",
        onboardingComplete: true,
      },
      financialHub: {
        accounts: [],
        netWorth: 0,
        lastCalculated: new Date().toISOString(),
      },
      transactions: [],
      goals: [
        {
          id: "goal_emergency",
          type: "emergency",
          name: "Emergency Fund",
          target: 300000,
          current: 0,
          deadline: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
          priority: "high",
          status: "on-track",
          createdDate: new Date().toISOString(),
          monthlyCommitment: 10000,
        },
      ],
      cibil: {
        score: 750,
        lastUpdated: new Date().toISOString(),
        factors: [
          {
            name: "Payment History",
            weight: 35,
            yourScore: 750,
            status: "good",
            description: "Good payment habits",
          },
        ],
        actionPlan: [],
        trend: "stable",
      },
      simulations: {
        history: [],
        unlockedSimulations: ["stock-market", "life-scenario"],
      },
      progress: {
        lessonsCompleted: [],
        challengesActive: [],
        streaks: {
          dailyLogin: 0,
          savings: 0,
          budgetAdherence: 0,
        },
      },
      envelopes: [
        {
          id: "env_bills",
          name: "Bills & Utilities",
          priority: "bills",
          target: 30000,
          current: 0,
          color: "red",
        },
        {
          id: "env_goals",
          name: "Financial Goals",
          priority: "goals",
          target: 20000,
          current: 0,
          color: "green",
        },
        {
          id: "env_spend",
          name: "Safe to Spend",
          priority: "safe-to-spend",
          target: 15000,
          current: 0,
          color: "blue",
        },
      ],
      lessons: [],
      chatHistory: [
        {
          id: "msg_welcome",
          role: "assistant",
          content: `Welcome to FinWise, ${authState.user.name}! 🎉 We'll start with learning and goals—you can add accounts, PF or loans later at any time.`,
          timestamp: new Date().toISOString(),
          type: "motivational",
        },
      ],
    };

    // Store app state with user email key so it persists and retrieves correctly
    localStorage.setItem(`finwise_appstate_${authState.user.email}`, JSON.stringify(appState));

    // Mark onboarding as complete in auth state (in-memory + persisted)
    updateUser({ onboardingComplete: true });

    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-900 dark:to-slate-950 pt-8">
      <div className="max-w-2xl mx-auto px-4 pb-20">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 dark:text-white mb-2">
            Welcome to FinWise! 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Let's personalize your financial journey
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Step {step} of 2
            </span>
            <button
              onClick={() => {
                logout();
                navigate("/auth");
              }}
              className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            >
              Sign Out
            </button>
          </div>
          <div className="w-full h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-primary transition-all duration-500"
              style={{ width: `${(step / 2) * 100}%` }}
            />
          </div>
        </div>

        {/* Step 1: Experience Level */}
        {step === 1 && (
          <div className="card-base mb-8 animate-fadeIn">
            <div className="flex items-center gap-3 mb-6">
              <Brain className="w-6 h-6 text-primary-600" />
              <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">
                What's your financial experience?
              </h2>
            </div>

            <div className="space-y-3">
              {[
                {
                  value: "beginner",
                  label: "Complete Beginner",
                  description: "I'm new to financial concepts",
                },
                {
                  value: "intermediate",
                  label: "Some Knowledge",
                  description: "I understand basic concepts",
                },
                {
                  value: "advanced",
                  label: "Experienced",
                  description: "I'm comfortable with investing/planning",
                },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setFormData((prev) => ({ ...prev, experienceLevel: option.value }))}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                    formData.experienceLevel === option.value
                      ? "border-primary-600 bg-primary-50 dark:bg-primary-900/20"
                      : "border-gray-200 dark:border-slate-700 hover:border-primary-400 dark:hover:border-primary-600"
                  }`}
                >
                  <p className="font-semibold text-gray-900 dark:text-white">{option.label}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{option.description}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Main Goal */}
        {step === 2 && (
          <div className="card-base mb-8 animate-fadeIn">
            <div className="flex items-center gap-3 mb-6">
              <Target className="w-6 h-6 text-primary-600" />
              <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">
                What's your main goal?
              </h2>
            </div>

            <div className="space-y-3">
              {[
                {
                  value: "learn-basics",
                  label: "Learn Financial Basics",
                  description: "Understand money management fundamentals",
                },
                {
                  value: "build-budget",
                  label: "Build Better Budget",
                  description: "Track spending and manage money wisely",
                },
                {
                  value: "invest-wisely",
                  label: "Learn to Invest",
                  description: "Stocks, mutual funds, and wealth building",
                },
                {
                  value: "improve-credit",
                  label: "Improve Credit Score",
                  description: "Manage debt and build good credit",
                },
                {
                  value: "financial-freedom",
                  label: "Achieve Financial Freedom",
                  description: "Complete financial planning and independence",
                },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setFormData((prev) => ({ ...prev, mainGoal: option.value }))}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                    formData.mainGoal === option.value
                      ? "border-primary-600 bg-primary-50 dark:bg-primary-900/20"
                      : "border-gray-200 dark:border-slate-700 hover:border-primary-400 dark:hover:border-primary-600"
                  }`}
                >
                  <p className="font-semibold text-gray-900 dark:text-white">{option.label}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{option.description}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3 removed: financial setup now handled after onboarding inside the app */}

        {/* Navigation Buttons */}
        <div className="flex gap-4">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="flex-1 btn-secondary"
            >
              Back
            </button>
          )}
          <button
            onClick={handleNext}
            className="flex-1 btn-primary flex items-center justify-center gap-2"
          >
            {step === 2 ? "Complete Setup" : "Next"}
            {step < 2 && <ChevronRight className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
