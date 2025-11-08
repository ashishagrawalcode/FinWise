import { useState } from "react";
import { ChevronRight, AlertCircle, CheckCircle, TrendingDown, TrendingUp } from "lucide-react";

interface Decision {
  id: string;
  text: string;
  consequence: string;
  impact: number; // positive or negative impact on score
  resultMessage: string;
}

interface ScenarioNode {
  id: string;
  title: string;
  description: string;
  context?: string;
  decisions: Decision[];
  image?: string;
}

interface ScenarioType {
  id: string;
  name: string;
  description: string;
  timeframe: string;
  icon: string;
  nodes: ScenarioNode[];
  learningGoal: string;
}

const SCENARIOS: Record<string, ScenarioType> = {
  "job-loss": {
    id: "job-loss",
    name: "Job Loss Crisis",
    description: "Suddenly laid off without warning. You have 6 months of expenses saved.",
    timeframe: "6 months simulation",
    icon: "😰",
    learningGoal:
      "Learn how to prioritize expenses, use emergency funds wisely, and plan for income uncertainty.",
    nodes: [
      {
        id: "month1",
        title: "Month 1: The Shock",
        description: "You just lost your job. Your monthly expenses are ₹50,000.",
        context: "You have: ₹3,00,000 in savings, ₹1,50,000 in investments, no severance.",
        decisions: [
          {
            id: "d1",
            text: "Immediately start aggressively job searching (attend interviews, network)",
            consequence: "Spend ₹5,000 on coaching/courses, but increase job prospects",
            impact: 30,
            resultMessage: "Smart move! You're taking action early. This increases your chances.",
          },
          {
            id: "d2",
            text: "Take a week off to relax and recover emotionally",
            consequence: "Good for mental health, but lose 1 week of job search time",
            impact: 15,
            resultMessage: "Self-care is important, but don't lose momentum.",
          },
          {
            id: "d3",
            text: "Panic and liquidate your investments immediately",
            consequence: "Lose ₹30,000 in penalties, but have more cash",
            impact: -20,
            resultMessage: "Panic decisions often cost money. Your investments were earning returns.",
          },
        ],
      },
      {
        id: "month2",
        title: "Month 2: Reality Sets In",
        description: "Still no job offer. You've had some interviews. Bills are due.",
        context: "Savings now: ₹2,50,000. Your rent is due. What do you do?",
        decisions: [
          {
            id: "d1",
            text: "Tell landlord the truth, negotiate a 1-month rent waiver",
            consequence: "Risk: they refuse or ask you to move. Gain: save ₹50,000",
            impact: 25,
            resultMessage:
              "Honest communication often works. Your landlord appreciates transparency.",
          },
          {
            id: "d2",
            text: "Pay full rent on time - maintain your credit and reputation",
            consequence: "Spend ₹50,000 but no risk to your record",
            impact: 20,
            resultMessage: "Responsible choice. Your credit score stays intact.",
          },
          {
            id: "d3",
            text: "Borrow ₹1,00,000 from parents at high interest (15%)",
            consequence: "Get cash but owe family money with interest. Relationship risk.",
            impact: -15,
            resultMessage: "Family loans can strain relationships. Only as last resort.",
          },
        ],
      },
      {
        id: "month4",
        title: "Month 4: Turning Point",
        description: "You have 2 job offers: one at 30% lower salary, one at same salary but different city.",
        context: "Savings left: ₹1,50,000. Your confidence is shaken. Both job options available.",
        decisions: [
          {
            id: "d1",
            text: "Take the same-salary job in the new city (relocation required)",
            consequence: "No salary cut, but relocation costs ₹50,000. New city, new adventure.",
            impact: 40,
            resultMessage: "Excellent! You protected your salary and got back to work quickly.",
          },
          {
            id: "d2",
            text: "Accept the 30% pay cut to stay in your current city near family",
            consequence: "Reduced income means tighter budget, but stable location",
            impact: 20,
            resultMessage: "Family support is valuable, but your earning power matters too.",
          },
          {
            id: "d3",
            text: "Reject both and continue searching for a 'perfect' job",
            consequence: "Money runs out fast. Enter dangerous territory.",
            impact: -35,
            resultMessage: "Perfection is the enemy of good. Sometimes 'good enough' is perfect.",
          },
        ],
      },
      {
        id: "month6",
        title: "Month 6: The Outcome",
        description: "6 months have passed. Let's see how you navigated the crisis.",
        context: "Your decisions will determine your financial health and lessons learned.",
        decisions: [
          {
            id: "end",
            text: "See Results",
            consequence: "Review your journey and lessons",
            impact: 0,
            resultMessage: "",
          },
        ],
      },
    ],
  },
  "medical-emergency": {
    id: "medical-emergency",
    name: "Medical Emergency",
    description: "A family member has a serious health condition requiring ₹5,00,000+ treatment.",
    timeframe: "3 months simulation",
    icon: "🏥",
    learningGoal: "Learn about insurance, emergency funds, and major life expenses.",
    nodes: [
      {
        id: "week1",
        title: "Week 1: Crisis",
        description: "Your parent needs emergency heart surgery. Cost: ₹4,50,000.",
        context: "Savings: ₹3,00,000. Insurance might cover 60% if claimed.",
        decisions: [
          {
            id: "d1",
            text: "File insurance claim first, then arrange remaining amount",
            consequence: "Claim takes 2-3 weeks. Use personal savings as buffer.",
            impact: 35,
            resultMessage:
              "Smart! Insurance exists for this. Your planning actually paid off.",
          },
          {
            id: "d2",
            text: "Pay full amount upfront, claim insurance reimbursement later",
            consequence: "Hospital wants payment immediately. You pay ₹4,50,000.",
            impact: 20,
            resultMessage: "Works, but ties up all your savings. Good thing you had it.",
          },
          {
            id: "d3",
            text: "Check for government schemes and NGO support programs",
            consequence: "Reduce cost by 20-30% through subsidy programs",
            impact: 45,
            resultMessage: "Excellent research! These programs are underutilized.",
          },
        ],
      },
      {
        id: "week3",
        title: "Week 3: Recovery Planning",
        description: "Surgery successful! Recovery phase begins. Additional costs: ₹50,000.",
        context: "Your savings are depleted. Now: rebuild while handling ongoing costs.",
        decisions: [
          {
            id: "d1",
            text: "Pause all non-essential investments. Focus on rebuilding emergency fund.",
            consequence: "Sacrifice 6 months of growth, but rebuild safety net",
            impact: 30,
            resultMessage: "Wise priority. Emergency fund rebuilds from salary.",
          },
          {
            id: "d2",
            text: "Take personal loan at 12% to replenish savings",
            consequence: "Get cash but pay ₹50,000/year in interest for 3 years",
            impact: 10,
            resultMessage: "Debt costs money. Only when absolutely necessary.",
          },
          {
            id: "d3",
            text: "Continue investments normally, rebuild savings slowly",
            consequence: "Stick to plan, but have zero emergency cushion",
            impact: -20,
            resultMessage: "Without an emergency fund, one more crisis destroys you.",
          },
        ],
      },
    ],
  },
  wedding: {
    id: "wedding",
    name: "Wedding Planning",
    description: "You're getting married! Budget required: ₹10,00,000 (flexible).",
    timeframe: "12 months simulation",
    icon: "💍",
    learningGoal: "Learn about major expense planning, prioritization, and goal-based budgeting.",
    nodes: [
      {
        id: "month1",
        title: "Month 1: Planning Phase",
        description:
          "The wedding is 12 months away. Family expects a big celebration. Budget: ₹10,00,000.",
        context: "Your current savings: ₹5,00,000. Partner's family can contribute ₹2,00,000.",
        decisions: [
          {
            id: "d1",
            text: "Set priorities: Venue & Catering (essential), rest flexible",
            consequence: "Create realistic budget, track each expense",
            impact: 40,
            resultMessage: "Perfect! This prioritization saves money and stress.",
          },
          {
            id: "d2",
            text: "Aim for the most expensive venue and full 500-guest celebration",
            consequence: "Budget balloons to ₹15,00,000. Must borrow ₹3,00,000.",
            impact: -30,
            resultMessage: "Lifestyle inflation catches many. Your wedding isn't your net worth.",
          },
          {
            id: "d3",
            text: "Go minimalist: courthouse wedding, small celebration, save ₹7,00,000",
            consequence: "Family unhappy, but financial freedom achieved",
            impact: 25,
            resultMessage: "Unconventional but smart. Your choice defines your values.",
          },
        ],
      },
      {
        id: "month6",
        title: "Month 6: Mid-Way Check",
        description: "You're at the halfway mark. Some costs have overrun expectations.",
        context: "You've already spent ₹4,50,000. Wedding still 6 months away. Uh oh!",
        decisions: [
          {
            id: "d1",
            text: "Renegotiate with vendors, cut non-essential items",
            consequence: "Save ₹1,50,000 through negotiations",
            impact: 35,
            resultMessage: "Vendors expect negotiation. Always try!",
          },
          {
            id: "d2",
            text: "Ask family for additional contribution",
            consequence: "Additional ₹2,00,000 from extended family",
            impact: 25,
            resultMessage: "Community support is part of Indian culture. Nothing wrong with asking.",
          },
          {
            id: "d3",
            text: "Take a ₹2,00,000 personal loan to cover overruns",
            consequence: "Get cash but start married life in debt",
            impact: -25,
            resultMessage: "Starting married life with debt adds pressure. Avoid if possible.",
          },
        ],
      },
    ],
  },
};

interface GameState {
  scenario: ScenarioType;
  currentNodeIndex: number;
  score: number;
  choices: Array<{ nodeId: string; decisionId: string }>;
  stage: "setup" | "playing" | "results";
}

interface ResultsData {
  score: number;
  lessonsLearned: string[];
  feedback: string;
  xpEarned: number;
}

export default function LifeScenarioSimulator({ scenarioId = "job-loss" }: { scenarioId?: string }) {
  const scenario = SCENARIOS[scenarioId];

  const [gameState, setGameState] = useState<GameState>({
    scenario,
    currentNodeIndex: 0,
    score: 100,
    choices: [],
    stage: "setup",
  });

  const [selectedDecision, setSelectedDecision] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ message: string; impact: number } | null>(null);

  const currentNode = gameState.scenario.nodes[gameState.currentNodeIndex];
  const isLastNode = gameState.currentNodeIndex === gameState.scenario.nodes.length - 1;

  const handleStartGame = () => {
    setGameState((prev) => ({ ...prev, stage: "playing" }));
  };

  const handleMakeDecision = (decision: Decision) => {
    setFeedback({ message: decision.resultMessage, impact: decision.impact });

    setTimeout(() => {
      const newScore = Math.max(0, gameState.score + decision.impact);
      const newChoices = [
        ...gameState.choices,
        { nodeId: currentNode.id, decisionId: decision.id },
      ];

      if (isLastNode) {
        setGameState((prev) => ({
          ...prev,
          score: newScore,
          choices: newChoices,
          stage: "results",
        }));
      } else {
        setGameState((prev) => ({
          ...prev,
          currentNodeIndex: prev.currentNodeIndex + 1,
          score: newScore,
          choices: newChoices,
        }));
      }
      setSelectedDecision(null);
      setFeedback(null);
    }, 2000);
  };

  const getResultsData = (): ResultsData => {
    const lessonsLearned = [];

    if (scenarioId === "job-loss") {
      if (gameState.score >= 110) {
        lessonsLearned.push(
          "Emergency funds are essential - you navigated the crisis well!",
          "Honest communication with creditors/landlords often works",
          "Getting back to work quickly (even if not perfect) beats prolonged unemployment"
        );
      } else if (gameState.score >= 90) {
        lessonsLearned.push(
          "You handled the crisis adequately - but could optimize faster",
          "Avoid liquidating investments in panic - they're your long-term backup",
          "Job search requires consistency - small improvements compound"
        );
      } else {
        lessonsLearned.push(
          "Emotional decisions cost money - stay rational under pressure",
          "Emergency funds exist for situations like this - use them wisely",
          "Pride has a cost - negotiate when necessary"
        );
      }
    } else if (scenarioId === "medical-emergency") {
      if (gameState.score >= 100) {
        lessonsLearned.push(
          "Insurance planning saves major emergencies from becoming disasters",
          "Government schemes and subsidies can reduce costs significantly",
          "Health expenses require immediate action - delayed decisions = higher costs"
        );
      } else if (gameState.score >= 80) {
        lessonsLearned.push(
          "Emergency funds exist for medical situations - always have one",
          "Insurance is not optional - it's essential financial armor",
          "Major expenses require prioritization, not panic"
        );
      } else {
        lessonsLearned.push(
          "Without insurance or emergency funds, one health crisis destroys finances",
          "Debt to cover emergencies often exceeds the original crisis cost",
          "Plan for unlikely events - they happen when least expected"
        );
      }
    } else if (scenarioId === "wedding") {
      if (gameState.score >= 110) {
        lessonsLearned.push(
          "Major expenses need clear prioritization - avoid scope creep",
          "Vendor negotiation is normal and expected",
          "Financial wisdom is more impressive than expensive celebrations"
        );
      } else if (gameState.score >= 90) {
        lessonsLearned.push(
          "Wedding budgets are famous for overruns - stay disciplined",
          "Community support is valuable - don't hesitate to ask",
          "Starting married life financially stable is more important than the party"
        );
      } else {
        lessonsLearned.push(
          "Lifestyle inflation happens during major purchases - guard against it",
          "Taking debt for celebrations shifts burden to future years",
          "Values-aligned decisions (even unconventional) lead to better outcomes"
        );
      }
    }

    const feedback =
      gameState.score >= 120
        ? "Outstanding! You made consistently smart decisions. This skill will serve you well in real life."
        : gameState.score >= 100
          ? "Very good! You managed the crisis well. A few tweaks in future situations will help."
          : gameState.score >= 80
            ? "Decent effort, but there were better choices available. Reflect on what you'd do differently."
            : "This scenario showed the real cost of panic decisions. Remember: panic is expensive.";

    const baseXP = 150;
    const bonusXP = Math.max(0, gameState.score - 80);
    const xpEarned = baseXP + bonusXP;

    return { score: gameState.score, lessonsLearned, feedback, xpEarned };
  };

  if (gameState.stage === "setup") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-slate-900 dark:to-slate-950 flex items-center justify-center p-4 pt-24">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl max-w-2xl w-full p-8">
          <div className="text-5xl mb-6">{scenario.icon}</div>

          <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-2">
            {scenario.name}
          </h1>

          <p className="text-gray-600 dark:text-gray-400 mb-6 text-lg">
            {scenario.description}
          </p>

          <div className="space-y-4 mb-8">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 rounded-lg">
              <p className="text-sm text-blue-900 dark:text-blue-100">
                <span className="font-semibold">Timeframe:</span> {scenario.timeframe}
              </p>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 p-4 rounded-lg">
              <p className="text-sm text-purple-900 dark:text-purple-100">
                <span className="font-semibold">What you'll learn:</span> {scenario.learningGoal}
              </p>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">How It Works:</h3>
            <ol className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <li className="flex gap-3">
                <span className="font-bold">1.</span>
                <span>Face realistic financial decisions</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold">2.</span>
                <span>Each choice affects your score and outcomes</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold">3.</span>
                <span>See immediate feedback on your decisions</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold">4.</span>
                <span>Learn what smart (and not-so-smart) choices look like</span>
              </li>
            </ol>
          </div>

          <button
            onClick={handleStartGame}
            className="w-full btn-primary text-lg font-semibold"
          >
            Begin Scenario
          </button>
        </div>
      </div>
    );
  }

  if (gameState.stage === "results") {
    const results = getResultsData();

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-slate-900 dark:to-slate-950 flex items-center justify-center p-4 pt-24">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl max-w-2xl w-full p-8">
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">{scenario.icon}</div>
            <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-2">
              Scenario Complete!
            </h1>

            <div className="mt-6 p-6 bg-gradient-primary text-white rounded-xl">
              <p className="text-sm opacity-90 mb-1">Your Score</p>
              <p className="text-5xl font-display font-bold">{results.score}</p>
              <p className="text-sm opacity-90 mt-2">out of 150</p>
            </div>
          </div>

          {/* Feedback */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 rounded-lg mb-6">
            <p className="text-blue-900 dark:text-blue-100">{results.feedback}</p>
          </div>

          {/* Lessons Learned */}
          <div className="mb-8">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Key Lessons
            </h3>
            <ul className="space-y-2">
              {results.lessonsLearned.map((lesson, idx) => (
                <li
                  key={idx}
                  className="flex gap-3 text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-slate-900 p-3 rounded-lg"
                >
                  <span className="font-bold text-primary-600 dark:text-primary-400">✓</span>
                  <span>{lesson}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* XP Reward */}
          <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white p-4 rounded-xl text-center mb-8">
            <p className="text-sm opacity-90 mb-1">Experience Earned</p>
            <p className="text-3xl font-display font-bold">+{results.xpEarned} XP</p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => window.location.href = "/simulations"}
              className="flex-1 btn-secondary"
            >
              Back to Simulations
            </button>
            <button
              onClick={() => {
                setGameState({
                  scenario,
                  currentNodeIndex: 0,
                  score: 100,
                  choices: [],
                  stage: "setup",
                });
              }}
              className="flex-1 btn-primary"
            >
              Play Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Playing state
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-slate-900 dark:to-slate-950 pt-24">
      <div className="max-w-2xl mx-auto px-4 pb-20">
        {/* Score and Progress */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Month {gameState.currentNodeIndex + 1}</p>
            <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">
              {currentNode.title}
            </h2>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Score</p>
            <p className="text-3xl font-display font-bold text-primary-600 dark:text-primary-400">
              {gameState.score}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8 w-full h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-primary transition-all duration-500"
            style={{
              width: `${((gameState.currentNodeIndex + 1) / gameState.scenario.nodes.length) * 100}%`,
            }}
          />
        </div>

        {/* Scenario Card */}
        <div className="card-base mb-8">
          <div className="text-5xl mb-4">{scenario.icon}</div>

          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
            {currentNode.description}
          </h3>

          {currentNode.context && (
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-4 rounded-lg mb-4">
              <p className="text-sm text-amber-900 dark:text-amber-100">
                <span className="font-semibold">Situation:</span> {currentNode.context}
              </p>
            </div>
          )}
        </div>

        {/* Feedback Message */}
        {feedback && (
          <div
            className={`p-4 rounded-lg mb-8 flex items-start gap-3 ${
              feedback.impact >= 0
                ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                : "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
            }`}
          >
            {feedback.impact >= 0 ? (
              <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
            ) : (
              <TrendingDown className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            )}
            <div>
              <p
                className={`font-semibold ${
                  feedback.impact >= 0
                    ? "text-green-900 dark:text-green-100"
                    : "text-red-900 dark:text-red-100"
                }`}
              >
                {feedback.message}
              </p>
              <p
                className={`text-sm mt-1 ${
                  feedback.impact >= 0
                    ? "text-green-700 dark:text-green-200"
                    : "text-red-700 dark:text-red-200"
                }`}
              >
                Score Impact: {feedback.impact > 0 ? "+" : ""}{feedback.impact}
              </p>
            </div>
          </div>
        )}

        {/* Decisions */}
        <div className="space-y-3">
          <p className="font-semibold text-gray-900 dark:text-white mb-4">What do you do?</p>

          {currentNode.decisions.map((decision) => (
            <button
              key={decision.id}
              onClick={() => handleMakeDecision(decision)}
              disabled={selectedDecision !== null}
              className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                selectedDecision === decision.id
                  ? "border-primary-600 bg-primary-50 dark:bg-primary-900/20"
                  : "border-gray-200 dark:border-slate-700 hover:border-primary-400 dark:hover:border-primary-600 bg-white dark:bg-slate-800"
              } ${selectedDecision !== null && selectedDecision !== decision.id ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <div className="flex gap-3 items-start">
                <ChevronRight className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                <span className="font-semibold text-gray-900 dark:text-white">{decision.text}</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 ml-8">
                {decision.consequence}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
