import { Link } from "react-router-dom";
import {
  Gamepad2,
  TrendingUp,
  Brain,
  Shield,
  Zap,
  Target,
  BarChart3,
  MessageSquare,
  ArrowRight,
  CheckCircle,
  Play,
} from "lucide-react";

export default function Home() {
  const features = [
    {
      icon: Gamepad2,
      title: "Gamified Learning",
      description:
        "Earn XP, unlock badges, and level up while mastering financial concepts",
    },
    {
      icon: TrendingUp,
      title: "Market Simulations",
      description:
        "Trade in risk-free environments with real-time market conditions",
    },
    {
      icon: Brain,
      title: "AI Coach",
      description:
        "Get personalized financial advice tailored to your situation",
    },
    {
      icon: Shield,
      title: "CIBIL Health",
      description: "Track and improve your credit score with actionable insights",
    },
    {
      icon: Zap,
      title: "Fast Lessons",
      description: "Learn financial concepts in 2-3 minute bite-sized videos",
    },
    {
      icon: Target,
      title: "Smart Goals",
      description: "Set and achieve financial goals with AI-powered tracking",
    },
  ];

  const simulators = [
    {
      title: "Stock Market Simulator",
      description: "Trade 15 real Indian stocks with ₹1L starting capital",
      icon: TrendingUp,
      color: "from-blue-400 to-blue-600",
    },
    {
      title: "Life Scenarios",
      description:
        "Navigate real-life challenges like job loss and medical emergencies",
      icon: Brain,
      color: "from-purple-400 to-purple-600",
    },
    {
      title: "Crypto Sandbox",
      description: "Understand extreme volatility with Bitcoin and Ethereum",
      icon: Zap,
      color: "from-yellow-400 to-yellow-600",
    },
  ];

  const benefits = [
    "₹0 to invest - all simulations are virtual",
    "Learn at your pace - no time pressure",
    "Indian context - focuses on Indian financial system",
    "Fun & engaging - gamification keeps you motivated",
    "Real feedback - AI coach explains your decisions",
    "Build wealth - apply lessons to real money",
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-900 dark:to-slate-950 -z-10" />

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-gray-900 dark:text-white leading-tight">
                  Master Money
                  <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Through Gaming
                  </span>
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                  FinWise is a gamified financial literacy platform designed for
                  Indian youth. Learn investing, budgeting, and wealth building
                  through fun simulations and challenges.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/dashboard"
                  className="btn-primary inline-flex items-center justify-center gap-2 text-lg"
                >
                  <Play className="w-5 h-5" />
                  Start Learning
                </Link>
                <button className="btn-secondary inline-flex items-center justify-center gap-2 text-lg">
                  <MessageSquare className="w-5 h-5" />
                  Learn More
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 pt-8">
                <div>
                  <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                    10+
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Simulators & Games
                  </p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                    20+
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Micro-lessons
                  </p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                    30+
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Badges to Unlock
                  </p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                    ₹0
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Investment Needed
                  </p>
                </div>
              </div>
            </div>

            {/* Right Visual */}
            <div className="hidden md:block relative">
              <div className="relative w-full aspect-square">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-400 rounded-3xl opacity-20 blur-3xl" />
                <div className="absolute inset-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-2xl flex items-center justify-center text-white">
                  <div className="text-center">
                    <Gamepad2 className="w-24 h-24 mx-auto mb-4 opacity-80" />
                    <p className="text-2xl font-bold">Level 1</p>
                    <p className="text-sm opacity-80">Financial Newbie</p>
                    <div className="mt-4 flex gap-2">
                      {[0, 1, 2].map((i) => (
                        <div
                          key={i}
                          className="w-2 h-2 bg-white rounded-full opacity-60"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 dark:text-white mb-4">
              Why FinWise?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Everything you need to understand money and build wealth
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="card-base hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Simulators Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 dark:text-white mb-4">
              Core Simulators
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Learn by doing in our risk-free environments
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {simulators.map((sim) => {
              const Icon = sim.icon;
              return (
                <div
                  key={sim.title}
                  className="group cursor-pointer overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div
                    className={`bg-gradient-to-br ${sim.color} p-8 text-white min-h-80 flex flex-col justify-between`}
                  >
                    <div>
                      <Icon className="w-12 h-12 mb-4 opacity-80" />
                      <h3 className="text-2xl font-bold mb-3">{sim.title}</h3>
                      <p className="text-white/90">{sim.description}</p>
                    </div>
                    <div className="flex items-center gap-2 text-white/80 group-hover:text-white transition-colors">
                      <span className="text-sm font-semibold">Try Now</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-blue-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 dark:text-white mb-8">
                Built for Indian Youth
              </h2>
              <div className="space-y-4">
                {benefits.map((benefit) => (
                  <div key={benefit} className="flex gap-3 items-start">
                    <CheckCircle className="w-6 h-6 text-success-500 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-700 dark:text-gray-300 text-lg">
                      {benefit}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative hidden md:block">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-200 to-purple-200 dark:from-primary-900 dark:to-purple-900 rounded-3xl opacity-50" />
              <div className="relative bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-xl">
                <div className="space-y-4">
                  <div className="h-12 bg-gradient-primary rounded-lg flex items-center px-4 text-white font-semibold">
                    Level 5: Money Manager
                  </div>
                  <div className="space-y-2">
                    <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded-lg w-3/4" />
                    <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded-lg w-5/6" />
                    <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded-lg w-4/5" />
                  </div>
                  <div className="flex gap-2 pt-4">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 dark:text-white mb-6">
            Ready to Master Your Finances?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            Join thousands of Indian youth learning to build wealth through
            gamification and fun simulations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/dashboard"
              className="btn-primary inline-flex items-center justify-center gap-2 text-lg"
            >
              <Play className="w-5 h-5" />
              Get Started Now
            </Link>
            <button className="btn-secondary inline-flex items-center justify-center gap-2 text-lg">
              Download App
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-black text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center text-gray-400">
          <p className="mb-2">© 2024 FinWise. All rights reserved.</p>
          <p className="text-sm">
            Designed for Indian youth to learn financial literacy through
            gamification.
          </p>
        </div>
      </footer>
    </div>
  );
}
