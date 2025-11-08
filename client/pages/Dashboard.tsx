import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  TrendingUp,
  Calendar,
  Target,
  Gamepad2,
  MessageSquare,
  Plus,
  ArrowRight,
  Zap,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { useAuth } from "@/hooks/useLocalStorage";
import { useFinancialState } from "@/hooks/useFinancialState";
import { XPBar } from "@/components/gamification/XPBar";

export default function Dashboard() {
  const navigate = useNavigate();
  const [authState] = useAuth();
  const { state, isLoaded, getAccountBalance, getMonthlyIncome, getMonthlyExpenses } =
    useFinancialState(authState.user?.email || "");
  const [showBalance, setShowBalance] = useState(true);

  if (!isLoaded) {
    return <div className="p-8 text-center">Loading dashboard...</div>;
  }

  const user = state.user;
  const { netWorth } = state.financialHub;
  const goals = state.goals;
  const challenges = state.progress.challengesActive;
  const monthlyIncome = getMonthlyIncome();
  const monthlyExpenses = getMonthlyExpenses();
  const savings = monthlyIncome - monthlyExpenses;

  const getNextLevel = (currentLevel: number) => {
    const levels = [
      { level: 1, name: "Financial Newbie", minXP: 0, maxXP: 500 },
      { level: 2, name: "Financial Newbie", minXP: 500, maxXP: 1000 },
      { level: 3, name: "Financial Newbie", minXP: 1000, maxXP: 1500 },
      { level: 4, name: "Money Manager", minXP: 1500, maxXP: 2000 },
      { level: 5, name: "Money Manager", minXP: 2000, maxXP: 2500 },
      { level: 6, name: "Money Manager", minXP: 2500, maxXP: 3000 },
      { level: 7, name: "Wealth Builder", minXP: 3000, maxXP: 4000 },
    ];
    return levels[currentLevel] || levels[levels.length - 1];
  };

  const currentLevelData = getNextLevel(user.level);
  const xpInLevel = user.xp - currentLevelData.minXP;
  const xpNeeded = currentLevelData.maxXP - currentLevelData.minXP;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Welcome Section */}
        <div className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, {user.name}! 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Here's your financial snapshot for today
          </p>
        </div>

        {/* Net Worth Card */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 card-base">
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Net Worth
                </p>
                <div className="flex items-center gap-3">
                  <h2 className="text-4xl font-display font-bold text-gray-900 dark:text-white">
                    {showBalance ? `₹${netWorth.toLocaleString("en-IN")}` : "••••••"}
                  </h2>
                  <button
                    onClick={() => setShowBalance(!showBalance)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    {showBalance ? (
                      <EyeOff className="w-5 h-5 text-gray-500" />
                    ) : (
                      <Eye className="w-5 h-5 text-gray-500" />
                    )}
                  </button>
                </div>
              </div>
              <div className="text-right">
                <div className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-semibold">
                  <TrendingUp className="w-4 h-4" />
                  Growth
                </div>
              </div>
            </div>

            {/* Breakdown */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 dark:bg-slate-900 rounded-lg">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                  Monthly Income
                </p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  ₹{monthlyIncome.toLocaleString("en-IN")}
                </p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-slate-900 rounded-lg">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                  Monthly Expenses
                </p>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                  ₹{monthlyExpenses.toLocaleString("en-IN")}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="space-y-4">
            <div className="card-base">
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                CIBIL Score
              </p>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-display font-bold text-primary-600 dark:text-primary-400">
                  {state.cibil.score}
                </span>
                <span className="text-sm text-green-600 dark:text-green-400 font-semibold mb-1">
                  Good
                </span>
              </div>
            </div>
            <div className="card-base">
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                Savings Rate
              </p>
              <p className="text-2xl font-display font-bold text-gray-900 dark:text-white">
                {monthlyIncome > 0 ? Math.round((savings / monthlyIncome) * 100) : 0}%
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                of income saved
              </p>
            </div>
          </div>
        </div>

        {/* XP Progress Bar */}
        <div className="mb-8 card-base">
          <XPBar
            currentXP={xpInLevel}
            maxXP={xpNeeded}
            level={user.level}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Goals and Challenges */}
          <div className="lg:col-span-2 space-y-8">
            {/* Active Goals */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-display font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Target className="w-6 h-6 text-primary-600" />
                  Active Goals
                </h3>
                <button className="flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors font-semibold text-sm">
                  <Plus className="w-4 h-4" />
                  New Goal
                </button>
              </div>

              <div className="space-y-4">
                {goals.map((goal) => {
                  const progress = (goal.current / goal.target) * 100;
                  const statusColor =
                    goal.status === "on-track"
                      ? "text-green-600 dark:text-green-400"
                      : goal.status === "behind"
                        ? "text-yellow-600 dark:text-yellow-400"
                        : "text-red-600 dark:text-red-400";
                  const statusBg =
                    goal.status === "on-track"
                      ? "bg-green-100 dark:bg-green-900/30"
                      : goal.status === "behind"
                        ? "bg-yellow-100 dark:bg-yellow-900/30"
                        : "bg-red-100 dark:bg-red-900/30";

                  return (
                    <div key={goal.id} className="card-base">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {goal.name}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Due{" "}
                            {new Date(goal.deadline).toLocaleDateString("en-IN")}
                          </p>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-semibold ${statusBg} ${statusColor}`}>
                          {goal.status === "on-track"
                            ? "On Track"
                            : goal.status === "behind"
                              ? "Behind"
                              : "At Risk"}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">
                            ₹{goal.current.toLocaleString("en-IN")} / ₹
                            {goal.target.toLocaleString("en-IN")}
                          </span>
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {Math.round(progress)}%
                          </span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-success transition-all duration-500"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Active Challenges */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-display font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Zap className="w-6 h-6 text-yellow-500" />
                  Weekly Challenges
                </h3>
                <button className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors text-sm font-semibold">
                  View All
                </button>
              </div>

              <div className="space-y-4">
                {challenges.map((challenge) => {
                  const progress = (challenge.progress / challenge.goal) * 100;
                  return (
                    <div key={challenge.id} className="card-base">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {challenge.title}
                          </h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Reward: +{challenge.reward} XP
                          </p>
                        </div>
                        <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                          {challenge.progress}/{challenge.goal}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-yellow-400 to-yellow-600 transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column - Quick Actions and Upcoming */}
          <div className="space-y-8">
            {/* Quick Actions */}
            <div>
              <h3 className="text-lg font-display font-bold text-gray-900 dark:text-white mb-4">
                Quick Actions
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <button className="card-base flex flex-col items-center justify-center py-6 hover:shadow-lg hover:bg-primary-50 dark:hover:bg-slate-800 transition-all">
                  <Gamepad2 className="w-6 h-6 text-primary-600 dark:text-primary-400 mb-2" />
                  <span className="text-sm font-semibold text-gray-900 dark:text-white text-center">
                    Start Simulation
                  </span>
                </button>
                <button className="card-base flex flex-col items-center justify-center py-6 hover:shadow-lg hover:bg-primary-50 dark:hover:bg-slate-800 transition-all">
                  <Plus className="w-6 h-6 text-primary-600 dark:text-primary-400 mb-2" />
                  <span className="text-sm font-semibold text-gray-900 dark:text-white text-center">
                    Log Expense
                  </span>
                </button>
                <button className="card-base flex flex-col items-center justify-center py-6 hover:shadow-lg hover:bg-primary-50 dark:hover:bg-slate-800 transition-all">
                  <MessageSquare className="w-6 h-6 text-primary-600 dark:text-primary-400 mb-2" />
                  <span className="text-sm font-semibold text-gray-900 dark:text-white text-center">
                    Chat Coach
                  </span>
                </button>
                <button className="card-base flex flex-col items-center justify-center py-6 hover:shadow-lg hover:bg-primary-50 dark:hover:bg-slate-800 transition-all">
                  <Calendar className="w-6 h-6 text-primary-600 dark:text-primary-400 mb-2" />
                  <span className="text-sm font-semibold text-gray-900 dark:text-white text-center">
                    View Bills
                  </span>
                </button>
              </div>
            </div>

            {/* Upcoming Bills */}
            <div>
              <h3 className="text-lg font-display font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-red-500" />
                Upcoming Bills
              </h3>
              <div className="space-y-3">
                <div className="card-base border-l-4 border-red-500">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        Electricity Bill
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Due in 3 days
                      </p>
                    </div>
                    <span className="font-bold text-gray-900 dark:text-white">
                      ₹3,500
                    </span>
                  </div>
                </div>
                <div className="card-base border-l-4 border-yellow-500">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        Credit Card
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Due in 8 days
                      </p>
                    </div>
                    <span className="font-bold text-gray-900 dark:text-white">
                      ₹15,200
                    </span>
                  </div>
                </div>
                <button className="w-full text-center text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-semibold text-sm py-3">
                  View Calendar
                </button>
              </div>
            </div>

            {/* AI Coach Widget */}
            <div className="card-base bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-800 dark:to-slate-900 border-2 border-primary-200 dark:border-primary-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center text-white font-bold">
                  🤖
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  AI Coach
                </h4>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                "You saved ₹8,500 this month! Great progress towards your
                emergency fund. Keep it up!"
              </p>
              <button className="w-full flex items-center justify-center gap-2 bg-gradient-primary text-white font-semibold py-2 rounded-lg hover:shadow-lg transition-all">
                Chat with Coach
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
