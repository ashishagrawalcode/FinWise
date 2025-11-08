import { useState, useEffect } from "react";
import type { AppState, Transaction, Goal, Account } from "@shared/api";

const DEFAULT_STATE: AppState = {
  user: {
    id: "default_user",
    name: "User",
    email: "user@finwise.app",
    age: 25,
    incomeType: "salaried",
    level: 1,
    xp: 0,
    badges: [],
    joinedDate: new Date().toISOString(),
    lastActive: new Date().toISOString(),
    theme: "light",
  },
  financialHub: {
    accounts: [
      {
        id: "acc_main",
        type: "bank",
        name: "Savings Account",
        balance: 100000,
        institution: "Your Bank",
        lastUpdated: new Date().toISOString(),
      },
    ],
    netWorth: 100000,
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
      {
        name: "Credit Utilization",
        weight: 30,
        yourScore: 750,
        status: "good",
        description: "Using 25% of available credit",
      },
      {
        name: "Credit History",
        weight: 15,
        yourScore: 750,
        status: "good",
        description: "3+ years of credit history",
      },
      {
        name: "Credit Mix",
        weight: 10,
        yourScore: 750,
        status: "good",
        description: "Good mix of credit types",
      },
      {
        name: "Recent Inquiries",
        weight: 10,
        yourScore: 750,
        status: "good",
        description: "No recent credit inquiries",
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
  envelopes: [],
  lessons: [],
  chatHistory: [],
};

export function useFinancialState(userEmail: string) {
  const [state, setState] = useState<AppState>(DEFAULT_STATE);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load state from localStorage
  useEffect(() => {
    try {
      const savedState = localStorage.getItem(`finwise_appstate_${userEmail}`);
      if (savedState) {
        setState(JSON.parse(savedState));
      } else {
        // Create new state for this user
        setState((prev) => ({ ...prev }));
      }
      setIsLoaded(true);
    } catch (error) {
      console.error("Error loading financial state:", error);
      setIsLoaded(true);
    }
  }, [userEmail]);

  // Auto-seed starter data once if user has no accounts/goals
  useEffect(() => {
    if (!isLoaded) return;
    try {
      const seededKey = `finwise_seeded_${userEmail}`;
      const alreadySeeded = localStorage.getItem(seededKey);
      if (alreadySeeded) return;

      const hasNoAccounts = state.financialHub.accounts.length === 0;
      const hasNoGoals = state.goals.length === 0;
      if (hasNoAccounts && hasNoGoals) {
        const now = new Date().toISOString();
        const starterAccounts: Account[] = [
          {
            id: `acc_${Date.now()}_savings`,
            type: "bank",
            name: "Primary Savings",
            balance: 25000,
            institution: "State Bank of India",
            lastUpdated: now,
          },
          {
            id: `acc_${Date.now()}_salary`,
            type: "bank",
            name: "Salary Account",
            balance: 15000,
            institution: "HDFC Bank",
            lastUpdated: now,
          },
          {
            id: `acc_${Date.now()}_pf`,
            type: "retirement",
            name: "Provident Fund",
            balance: 80000,
            institution: "EPFO",
            lastUpdated: now,
          },
          {
            id: `acc_${Date.now()}_mf`,
            type: "investment",
            name: "Mutual Funds",
            balance: 30000,
            institution: "Kotak AMC",
            lastUpdated: now,
          },
          {
            id: `acc_${Date.now()}_loan`,
            type: "loan",
            name: "Personal Loan",
            balance: -20000,
            institution: "ICICI Bank",
            lastUpdated: now,
          },
        ];

        const starterGoals: Goal[] = [
          {
            id: `goal_${Date.now()}_emergency`,
            type: "emergency",
            name: "Emergency Fund",
            target: 300000,
            current: 35000,
            deadline: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
            priority: "high",
            status: "on-track",
            createdDate: now,
            monthlyCommitment: 10000,
          },
          {
            id: `goal_${Date.now()}_loanpay`,
            type: "debt",
            name: "Pay off Personal Loan",
            target: 20000,
            current: 2000,
            deadline: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
            priority: "medium",
            status: "behind",
            createdDate: now,
            monthlyCommitment: 5000,
          },
        ];

        const netWorth = starterAccounts.reduce((sum, a) => sum + a.balance, 0);
        const seeded: AppState = {
          ...state,
          financialHub: {
            accounts: starterAccounts,
            netWorth,
            lastCalculated: now,
          },
          goals: starterGoals,
        };
        saveState(seeded);
        localStorage.setItem(seededKey, "1");
      }
    } catch (e) {
      console.error("Error seeding starter data:", e);
    }
  }, [isLoaded, state, userEmail]);

  // Save state to localStorage
  const saveState = (newState: AppState) => {
    setState(newState);
    localStorage.setItem(`finwise_appstate_${userEmail}`, JSON.stringify(newState));
  };

  // Accounts management
  const recalcNetWorth = (accounts: Account[]) =>
    accounts.reduce((sum, acc) => sum + acc.balance, 0);

  const addAccount = (account: Omit<Account, "id" | "lastUpdated">) => {
    const newAccount: Account = {
      ...account,
      id: `acc_${Date.now()}`,
      lastUpdated: new Date().toISOString(),
    };
    const newAccounts = [...state.financialHub.accounts, newAccount];
    const newState: AppState = {
      ...state,
      financialHub: {
        ...state.financialHub,
        accounts: newAccounts,
        netWorth: recalcNetWorth(newAccounts),
        lastCalculated: new Date().toISOString(),
      },
    };
    saveState(newState);
    return newAccount;
  };

  const updateAccount = (accountId: string, update: Partial<Account>) => {
    const newAccounts = state.financialHub.accounts.map((a) =>
      a.id === accountId ? { ...a, ...update, lastUpdated: new Date().toISOString() } : a
    );
    const newState: AppState = {
      ...state,
      financialHub: {
        ...state.financialHub,
        accounts: newAccounts,
        netWorth: recalcNetWorth(newAccounts),
        lastCalculated: new Date().toISOString(),
      },
    };
    saveState(newState);
  };

  const removeAccount = (accountId: string) => {
    const newAccounts = state.financialHub.accounts.filter((a) => a.id !== accountId);
    const newState: AppState = {
      ...state,
      financialHub: {
        ...state.financialHub,
        accounts: newAccounts,
        netWorth: recalcNetWorth(newAccounts),
        lastCalculated: new Date().toISOString(),
      },
    };
    saveState(newState);
  };

  // Add transaction and auto-update interconnected systems
  const addTransaction = (
    type: "income" | "expense",
    amount: number,
    category: string,
    paymentMethod: string,
    note?: string,
    goalId?: string
  ) => {
    const transaction: Transaction = {
      id: `txn_${Date.now()}`,
      type,
      amount,
      category,
      date: new Date().toISOString(),
      note: note || "",
      paymentMethod,
      goalId,
    };

    let newState = { ...state };
    newState.transactions = [...state.transactions, transaction];

    // Update bank balance
    const mainAccount = newState.financialHub.accounts[0];
    if (mainAccount) {
      if (type === "income") {
        mainAccount.balance += amount;
      } else {
        mainAccount.balance = Math.max(0, mainAccount.balance - amount);
      }
      mainAccount.lastUpdated = new Date().toISOString();
    }

    // Update net worth
    newState.financialHub.netWorth = newState.financialHub.accounts.reduce(
      (sum, acc) => sum + acc.balance,
      0
    );

    // If expense is savings/goal, update goal progress
    if (type === "expense" && goalId) {
      const goal = newState.goals.find((g) => g.id === goalId);
      if (goal) {
        goal.current += amount;
        if (goal.current >= goal.target) {
          goal.status = "completed";
        } else {
          const daysLeft =
            (new Date(goal.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
          const monthsLeft = Math.ceil(daysLeft / 30);
          const monthlyNeeded = (goal.target - goal.current) / monthsLeft;
          if (monthlyNeeded > goal.monthlyCommitment * 1.2) {
            goal.status = "behind";
          } else {
            goal.status = "on-track";
          }
        }
      }
    }

    // Add XP for transaction
    if (type === "expense" && ["savings", "investment", "bill"].includes(category)) {
      newState.user.xp += 10;
    }

    saveState(newState);
    return transaction;
  };

  // Add income and auto-allocate to accounts/goals
  const addIncome = (
    amount: number,
    source: string,
    allocateToGoal?: string
  ) => {
    const allocation = {
      toAccount: amount * 0.7,
      toGoal: amount * 0.2,
      toBuffer: amount * 0.1,
    };

    let newState = { ...state };

    // Credit to main account
    const mainAccount = newState.financialHub.accounts[0];
    if (mainAccount) {
      mainAccount.balance += allocation.toAccount;
      mainAccount.lastUpdated = new Date().toISOString();
    }

    // Add income transaction
    const transaction: Transaction = {
      id: `txn_${Date.now()}`,
      type: "income",
      amount,
      category: source,
      date: new Date().toISOString(),
      note: `Income: ${source}`,
      paymentMethod: "bank-transfer",
    };

    newState.transactions = [...state.transactions, transaction];

    // Update goals if specified
    if (allocateToGoal) {
      const goal = newState.goals.find((g) => g.id === allocateToGoal);
      if (goal) {
        goal.current += allocation.toGoal;
      }
    }

    // Update net worth
    newState.financialHub.netWorth = newState.financialHub.accounts.reduce(
      (sum, acc) => sum + acc.balance,
      0
    );

    // Award XP for income
    newState.user.xp += 30;

    saveState(newState);
    return transaction;
  };

  // Create or update goal
  const addGoal = (goal: Omit<Goal, "id" | "status" | "createdDate">) => {
    const newGoal: Goal = {
      ...goal,
      id: `goal_${Date.now()}`,
      status: "on-track",
      createdDate: new Date().toISOString(),
    };

    const newState = {
      ...state,
      goals: [...state.goals, newGoal],
      user: {
        ...state.user,
        xp: state.user.xp + 50, // XP for creating goal
      },
    };

    saveState(newState);
    return newGoal;
  };

  const updateGoal = (goalId: string, update: Partial<Goal>) => {
    const newGoals = state.goals.map((g) => (g.id === goalId ? { ...g, ...update } : g));
    const newState: AppState = { ...state, goals: newGoals };
    saveState(newState);
  };

  const removeGoal = (goalId: string) => {
    const newGoals = state.goals.filter((g) => g.id !== goalId);
    const newState: AppState = { ...state, goals: newGoals };
    saveState(newState);
  };

  // Update CIBIL score based on actions
  const updateCIBIL = (change: "payment-on-time" | "missed-payment" | "reduce-utilization") => {
    let newState = { ...state };
    let scoreChange = 0;

    switch (change) {
      case "payment-on-time":
        scoreChange = 5;
        break;
      case "missed-payment":
        scoreChange = -20;
        break;
      case "reduce-utilization":
        scoreChange = 3;
        break;
    }

    newState.cibil.score = Math.min(900, Math.max(300, newState.cibil.score + scoreChange));
    newState.cibil.lastUpdated = new Date().toISOString();

    saveState(newState);
  };

  // Add XP and check for level up
  const addXP = (amount: number, reason: string) => {
    let newState = { ...state };
    const oldLevel = newState.user.level;
    newState.user.xp += amount;

    // Check level up (1000 XP per level)
    const newLevel = Math.floor(newState.user.xp / 1000) + 1;
    if (newLevel > oldLevel) {
      newState.user.level = newLevel;
      // Could award badge here
    }

    saveState(newState);
  };

  // Add badge
  const addBadge = (badgeData: { id: string; name: string; icon: string; description: string }) => {
    const newBadge = {
      ...badgeData,
      unlockedDate: new Date().toISOString(),
      // map new badges to an allowed category
      category: "milestones" as const,
    };

    const newState: AppState = {
      ...state,
      user: {
        ...state.user,
        badges: [...state.user.badges, newBadge as any],
      },
    };

    saveState(newState);
  };

  // Chat helpers
  const ruleBasedReply = (message: string, current: AppState) => {
    const text = message.toLowerCase();
    if (text.includes("net worth") || text.includes("worth")) {
      return `Your current net worth is ₹${current.financialHub.netWorth.toLocaleString("en-IN")}.`;
    }
    if (text.includes("goal") || text.includes("emergency")) {
      const g = current.goals[0];
      return g
        ? `Your goal “${g.name}” is ₹${g.current.toLocaleString("en-IN")} / ₹${g.target.toLocaleString("en-IN")}.`
        : "You don't have goals yet. Create one in the Financial Hub.";
    }
    if (text.includes("account") || text.includes("bank")) {
      const a = current.financialHub.accounts;
      return a.length
        ? `You have ${a.length} account(s). The first is “${a[0].name}” at ${a[0].institution} with balance ₹${a[0].balance.toLocaleString("en-IN")}.`
        : "No accounts yet. Use Manage Accounts to add bank, PF, loans, or investments.";
    }
    if (text.includes("hello") || text.includes("hi") || text.includes("hey")) {
      return "Hello! How can I assist with your finances today?";
    }
    return "I can help with accounts, goals, budgets, and simulations.";
  };

  const sendCoachMessage = (message: string, role: "user" | "assistant" = "user") => {
    const now = new Date().toISOString();
    let newState: AppState = state;
    if (role === "user") {
      newState = {
        ...state,
        chatHistory: [
          ...state.chatHistory,
          { id: `msg_${Date.now()}_u`, role: "user", content: message, timestamp: now, type: "nudge" },
        ],
      };
      const reply = ruleBasedReply(message, newState);
      newState = {
        ...newState,
        chatHistory: [
          ...newState.chatHistory,
          { id: `msg_${Date.now()}_a`, role: "assistant", content: reply, timestamp: new Date().toISOString(), type: "actionable" },
        ],
      };
      saveState(newState);
      return reply;
    } else {
      // Assistant message provided directly
      newState = {
        ...state,
        chatHistory: [
          ...state.chatHistory,
          { id: `msg_${Date.now()}_a`, role: "assistant", content: message, timestamp: now, type: "actionable" },
        ],
      };
      saveState(newState);
      return message;
    }
  };

  // Get account balance
  const getAccountBalance = (accountId?: string) => {
    if (accountId) {
      return state.financialHub.accounts.find((a) => a.id === accountId)?.balance || 0;
    }
    return state.financialHub.accounts[0]?.balance || 0;
  };

  // Get spending by category for current month
  const getMonthlySpendingByCategory = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const categorySpending: Record<string, number> = {};

    state.transactions.forEach((txn) => {
      const txnDate = new Date(txn.date);
      if (
        txn.type === "expense" &&
        txnDate.getMonth() === currentMonth &&
        txnDate.getFullYear() === currentYear
      ) {
        categorySpending[txn.category] = (categorySpending[txn.category] || 0) + txn.amount;
      }
    });

    return categorySpending;
  };

  // Get monthly income
  const getMonthlyIncome = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return state.transactions.reduce((sum, txn) => {
      const txnDate = new Date(txn.date);
      if (
        txn.type === "income" &&
        txnDate.getMonth() === currentMonth &&
        txnDate.getFullYear() === currentYear
      ) {
        return sum + txn.amount;
      }
      return sum;
    }, 0);
  };

  // Get monthly expenses
  const getMonthlyExpenses = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return state.transactions.reduce((sum, txn) => {
      const txnDate = new Date(txn.date);
      if (
        txn.type === "expense" &&
        txnDate.getMonth() === currentMonth &&
        txnDate.getFullYear() === currentYear
      ) {
        return sum + txn.amount;
      }
      return sum;
    }, 0);
  };

  return {
    state,
    isLoaded,
    addTransaction,
    addIncome,
    addGoal,
    updateGoal,
    removeGoal,
    updateCIBIL,
    addXP,
    addBadge,
    getAccountBalance,
    getMonthlySpendingByCategory,
    getMonthlyIncome,
    getMonthlyExpenses,
    saveState,
    addAccount,
    updateAccount,
    removeAccount,
    sendCoachMessage,
  };
}
