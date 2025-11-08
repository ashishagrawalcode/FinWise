import { Link } from "react-router-dom";
import { TrendingUp, Brain, Zap, Lock, Play, Star, CheckCircle } from "lucide-react";

interface SimulatorCard {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  duration: string;
  difficulty: "easy" | "medium" | "hard";
  unlockedAt: number;
  isUnlocked: boolean;
  isCompleted: boolean;
  href: string;
  xpReward: number;
}

export default function Simulations() {
  const userLevel = 1; // This would come from app state
  const completedSimulations = [];

  const simulators: SimulatorCard[] = [
    {
      id: "stock-market",
      title: "Stock Market Simulator",
      description:
        "Trade 15 real Indian stocks with ₹1L capital. Learn about market timing, risk management, and the psychology of trading.",
      icon: <TrendingUp className="w-8 h-8" />,
      color: "from-blue-400 to-blue-600",
      duration: "5 min",
      difficulty: "medium",
      unlockedAt: 1,
      isUnlocked: userLevel >= 1,
      isCompleted: completedSimulations.includes("stock-market"),
      href: "/simulators/stock-market",
      xpReward: 150,
    },
    {
      id: "job-loss-scenario",
      title: "Job Loss Crisis",
      description:
        "Suddenly lose your job. Manage your emergency fund, prioritize bills, and make smart decisions to survive 6 months.",
      icon: <AlertCircle className="w-8 h-8" />,
      color: "from-red-400 to-red-600",
      duration: "8 min",
      difficulty: "hard",
      unlockedAt: 1,
      isUnlocked: userLevel >= 1,
      isCompleted: completedSimulations.includes("job-loss"),
      href: "/simulators/job-loss",
      xpReward: 150,
    },
    {
      id: "medical-emergency",
      title: "Medical Emergency",
      description:
        "Handle unexpected medical expenses while maintaining other financial obligations. Learn about insurance and emergency funds.",
      icon: <Brain className="w-8 h-8" />,
      color: "from-pink-400 to-pink-600",
      duration: "6 min",
      difficulty: "medium",
      unlockedAt: 2,
      isUnlocked: userLevel >= 2,
      isCompleted: completedSimulations.includes("medical"),
      href: "/simulators/medical-emergency",
      xpReward: 150,
    },
    {
      id: "wedding-planner",
      title: "Wedding Planning",
      description:
        "Budget for a wedding while managing other financial goals. Learn about major expense planning and trade-offs.",
      icon: <Heart className="w-8 h-8" />,
      color: "from-purple-400 to-purple-600",
      duration: "7 min",
      difficulty: "medium",
      unlockedAt: 2,
      isUnlocked: userLevel >= 2,
      isCompleted: completedSimulations.includes("wedding"),
      href: "/simulators/wedding",
      xpReward: 150,
    },
    {
      id: "crypto-sandbox",
      title: "Crypto Sandbox",
      description:
        "Trade Bitcoin, Ethereum, and Dogecoin with extreme volatility. Understand FOMO, panic selling, and risk tolerance.",
      icon: <Zap className="w-8 h-8" />,
      color: "from-yellow-400 to-yellow-600",
      duration: "5 min",
      difficulty: "hard",
      unlockedAt: 5,
      isUnlocked: userLevel >= 5,
      isCompleted: completedSimulations.includes("crypto"),
      href: "/simulators/crypto",
      xpReward: 200,
    },
    {
      id: "debt-payoff",
      title: "Debt Payoff Challenge",
      description:
        "Manage multiple debts (credit card, personal loan, home loan). Learn about debt strategies and interest impact.",
      icon: <CreditCard className="w-8 h-8" />,
      color: "from-orange-400 to-orange-600",
      duration: "8 min",
      difficulty: "hard",
      unlockedAt: 3,
      isUnlocked: userLevel >= 3,
      isCompleted: completedSimulations.includes("debt"),
      href: "/simulators/debt-payoff",
      xpReward: 150,
    },
  ];

  const difficultyColors = {
    easy: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
    medium: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400",
    hard: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400",
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-display font-bold text-gray-900 dark:text-white mb-4">
            Simulations Lab 🎮
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
            Learn financial concepts through interactive simulations. Make real-time decisions and see the
            consequences unfold. Each simulation teaches you valuable lessons about money management.
          </p>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="card-base">
            <div className="flex items-center gap-3 mb-2">
              <Zap className="w-6 h-6 text-yellow-500" />
              <span className="font-semibold text-gray-900 dark:text-white">XP System</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Earn 150 XP per simulation. Complete all to unlock special challenges.
            </p>
          </div>
          <div className="card-base">
            <div className="flex items-center gap-3 mb-2">
              <Lock className="w-6 h-6 text-primary-600" />
              <span className="font-semibold text-gray-900 dark:text-white">Level Unlocks</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              New simulations unlock as you level up. Reach Level 5 to unlock the Crypto Sandbox!
            </p>
          </div>
          <div className="card-base">
            <div className="flex items-center gap-3 mb-2">
              <Brain className="w-6 h-6 text-purple-600" />
              <span className="font-semibold text-gray-900 dark:text-white">AI Feedback</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Get personalized AI feedback on your decisions and what you could improve.
            </p>
          </div>
        </div>

        {/* Simulators Grid */}
        <div>
          <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-6">
            Available Simulations
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {simulators.map((sim) => (
              <div
                key={sim.id}
                className={`rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl ${
                  sim.isUnlocked
                    ? "bg-white dark:bg-slate-800 cursor-pointer hover:scale-105"
                    : "bg-gray-100 dark:bg-slate-800 opacity-70"
                }`}
              >
                {/* Header with background */}
                <div className={`bg-gradient-to-br ${sim.color} p-6 text-white relative overflow-hidden`}>
                  <div className="absolute top-2 right-2 opacity-20">
                    {sim.icon}
                  </div>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {sim.icon}
                      <h3 className="text-lg font-semibold">{sim.title}</h3>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex gap-2 flex-wrap">
                    <span className="bg-white/20 backdrop-blur px-2 py-1 rounded-full text-xs font-semibold">
                      {sim.duration}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      sim.difficulty === "easy" ? "bg-green-400/30" : 
                      sim.difficulty === "medium" ? "bg-yellow-400/30" : 
                      "bg-red-400/30"
                    }`}>
                      {sim.difficulty.charAt(0).toUpperCase() + sim.difficulty.slice(1)}
                    </span>
                    <span className="bg-white/20 backdrop-blur px-2 py-1 rounded-full text-xs font-semibold">
                      +{sim.xpReward} XP
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 h-12 overflow-hidden">
                    {sim.description}
                  </p>

                  {/* Footer */}
                  <div className="space-y-3">
                    {!sim.isUnlocked ? (
                      <div className="bg-gray-100 dark:bg-slate-900 p-4 rounded-lg text-center border border-gray-200 dark:border-slate-700">
                        <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400 text-sm font-semibold">
                          <Lock className="w-4 h-4" />
                          Unlock at Level {sim.unlockedAt}
                        </div>
                      </div>
                    ) : (
                      <>
                        {sim.isCompleted && (
                          <div className="bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 p-3 rounded-lg flex items-center gap-2 text-green-700 dark:text-green-400 text-sm font-semibold">
                            <CheckCircle className="w-4 h-4" />
                            Completed
                          </div>
                        )}
                        <Link
                          to={sim.href}
                          className="w-full bg-gradient-primary text-white font-semibold py-3 rounded-lg hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
                        >
                          <Play className="w-4 h-4" />
                          {sim.isCompleted ? "Play Again" : "Start Simulation"}
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tips Section */}
        <div className="mt-12 card-base bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4 flex items-center gap-2">
            <Star className="w-5 h-5" />
            Tips for Success
          </h3>
          <ul className="space-y-3 text-blue-800 dark:text-blue-200 text-sm">
            <li className="flex gap-3">
              <span className="font-bold">•</span>
              <span>Think before you act - hasty decisions often lead to losses</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold">•</span>
              <span>Watch for patterns in market behavior across multiple playthroughs</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold">•</span>
              <span>Remember: Real money decisions involve the same psychology as simulations</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold">•</span>
              <span>Check the AI feedback after each simulation - it contains valuable insights</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// Icon components
function AlertCircle({ className }: { className: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

function Heart({ className }: { className: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
      />
    </svg>
  );
}

function CreditCard({ className }: { className: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 10h18M7 15h4m4 0h4M5 21h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z"
      />
    </svg>
  );
}
