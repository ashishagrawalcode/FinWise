/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

// User Profile
export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  unlockedDate: string;
  category: "first-actions" | "milestones" | "mastery" | "special-events";
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  age: number;
  incomeType: "salaried" | "freelance" | "business" | "student";
  level: number;
  xp: number;
  badges: Badge[];
  joinedDate: string;
  lastActive: string;
  theme: "light" | "dark";
  completedLessons: string[];
}

// Financial Hub
export interface StockHolding {
  stockId: string;
  symbol: string;
  shares: number;
  avgPrice: number;
  totalValue: number;
  totalReturn: number;
  returnPercent: number;
  lastUpdated: string;
}

export interface Account {
  id: string;
  type: "bank" | "credit-card" | "loan" | "investment" | "retirement" | "insurance";
  name: string;
  balance: number;
  institution: string;
  lastUpdated: string;
  holderName?: string; // For accounts that have a named holder
  accountSubType?: "savings" | "current" | "salary"; // Bank-only
  holdings?: StockHolding[]; // For investment accounts
  investmentStrategy?: "conservative" | "moderate" | "aggressive"; // For investment accounts
  returns?: {
    totalReturn: number;
    returnPercent: number;
    lastMonth: number;
    lastYear: number;
  }; // For investment accounts
}

export interface FinancialHub {
  accounts: Account[];
  netWorth: number;
  lastCalculated: string;
  investments: {
    totalValue: number;
    totalReturn: number;
    returnPercent: number;
    performanceHistory: {
      date: string;
      value: number;
      return: number;
    }[];
  };
}

// Stocks
export interface Stock {
  id: string;
  symbol: string;
  name: string;
  currentPrice: number;
  basePrice: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  pe: number;
  sector: string;
  yearHigh: number;
  yearLow: number;
  holdings?: {
    shares: number;
    avgPrice: number;
    totalValue: number;
    totalReturn: number;
    returnPercent: number;
  };
}

// Transactions
export interface Transaction {
  id: string;
  amount: number;
  category: string;
  type: "expense" | "income" | "investment" | "return";
  method: "cash" | "card" | "upi" | "stock" | "mutual-fund";
  timestamp: string;
  date: string;
  stockSymbol?: string;
  shares?: number;
  pricePerShare?: number;
  note?: string;
  paymentMethod?: string;
  status: "pending" | "completed" | "failed";
  relatedTransactionId?: string; // For linking related transactions
  accountId: string; // Reference to the account
}

// Goals
export type GoalType = "emergency" | "debt" | "purchase" | "education" | "retirement";
export type GoalStatus = "on-track" | "behind" | "at-risk" | "completed";

export interface Goal {
  id: string;
  type: GoalType;
  name: string;
  target: number;
  current: number;
  deadline: string;
  priority: "high" | "medium" | "low";
  status: GoalStatus;
  createdDate: string;
  monthlyCommitment: number;
}

// CIBIL Score
export interface CIBILFactor {
  name: string;
  weight: number;
  yourScore: number;
  status: "good" | "fair" | "needs-improvement";
  description: string;
}

export interface CIBILActionPlan {
  priority: "urgent" | "important" | "maintenance";
  action: string;
  impact: number;
  estimatedDays: number;
}

export interface CIBILData {
  score: number;
  lastUpdated: string;
  factors: CIBILFactor[];
  actionPlan: CIBILActionPlan[];
  trend: "improving" | "stable" | "declining";
}

// Simulations
export interface SimulationHistory {
  id: string;
  type: "stock-market" | "life-scenario" | "crypto-sandbox";
  date: string;
  result: {
    finalPnL: number;
    finalBalance: number;
    accuracy: number;
    feedback: string;
  };
  xpEarned: number;
  lessonLearned: string;
}

export interface SimulationState {
  history: SimulationHistory[];
  unlockedSimulations: string[];
}

// Progress & Challenges
export interface Challenge {
  id: string;
  type: "weekly" | "monthly";
  title: string;
  goal: number;
  progress: number;
  deadline: string;
  reward: number;
  description: string;
}

export interface Streak {
  dailyLogin: number;
  savings: number;
  budgetAdherence: number;
}

export interface ProgressData {
  lessonsCompleted: string[];
  challengesActive: Challenge[];
  streaks: Streak;
}

// Volatile Income - Envelopes
export interface Envelope {
  id: string;
  name: string;
  priority: "bills" | "goals" | "safe-to-spend";
  target: number;
  current: number;
  color: string;
}

// Lessons
export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

export interface Lesson {
  id: string;
  title: string;
  topic: string;
  duration: number;
  videoUrl: string;
  summary: string;
  quiz: QuizQuestion[];
  status: "not-started" | "in-progress" | "completed";
  xpReward: number;
}

// AI Coach
export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  type?: "educational" | "motivational" | "actionable" | "nudge";
}

// Comprehensive App State
export interface AppState {
  user: UserProfile;
  financialHub: FinancialHub;
  transactions: Transaction[];
  goals: Goal[];
  cibil: CIBILData;
  simulations: SimulationState;
  progress: ProgressData;
  envelopes: Envelope[];
  lessons: Lesson[];
  chatHistory: ChatMessage[];
}

export interface DemoResponse {
  message: string;
}
