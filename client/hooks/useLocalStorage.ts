import { useState } from "react";

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  // Initialize synchronously from localStorage to avoid auth guards redirecting before load
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.error(`Error reading from localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Write to localStorage when value changes
  const setValue = (value: T) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing to localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  age: number;
  incomeType: "salaried" | "freelance" | "business" | "student";
  onboardingComplete: boolean;
  joinedDate: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: AuthUser | null;
}

export function useAuth(): [
  AuthState,
  {
    login: (email: string, password: string) => boolean;
    signup: (
      name: string,
      email: string,
      password: string,
      age: number,
      incomeType: string
    ) => boolean;
    logout: () => void;
    updateUser: (partial: Partial<AuthUser>) => void;
  }
] {
  const [authState, setAuthState] = useLocalStorage<AuthState>("finwise_auth", {
    isAuthenticated: false,
    user: null,
  });

  const login = (email: string, password: string) => {
    // In a real app, this would call an API
    try {
      const storedUserStr = localStorage.getItem(`finwise_user_${email}`);
      if (storedUserStr) {
        const user = JSON.parse(storedUserStr) as AuthUser;
        setAuthState({
          isAuthenticated: true,
          user,
        });
        return true;
      } else {
        console.error("User not found - please sign up first");
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const signup = (name: string, email: string, password: string, age: number, incomeType: string) => {
    try {
      // In a real app, this would call an API and hash the password
      const newUser: AuthUser = {
        id: `user_${Date.now()}`,
        name,
        email,
        age: parseInt(age.toString()),
        incomeType: incomeType as any,
        onboardingComplete: false,
        joinedDate: new Date().toISOString(),
      };

      // Store user with password (in real app, this would be hashed on server)
      localStorage.setItem(`finwise_user_${email}`, JSON.stringify(newUser));
      localStorage.setItem(`finwise_password_${email}`, password);

      setAuthState({
        isAuthenticated: true,
        user: newUser,
      });
      return true;
    } catch (error) {
      console.error("Signup error:", error);
      return false;
    }
  };

  const logout = () => {
    setAuthState({
      isAuthenticated: false,
      user: null,
    });
  };

  const updateUser = (partial: Partial<AuthUser>) => {
    if (!authState.user) return;
    const updatedUser: AuthUser = { ...authState.user, ...partial };
    // Persist user record for future logins
    try {
      localStorage.setItem(`finwise_user_${updatedUser.email}`, JSON.stringify(updatedUser));
    } catch (error) {
      console.error("Error persisting user update:", error);
    }
    // Update current auth state (also persisted via useLocalStorage)
    setAuthState({ isAuthenticated: true, user: updatedUser });
  };

  return [authState, { login, signup, logout, updateUser }];
}

export function useAppState() {
  const defaultAppState = {
    user: {
      id: "user_" + Date.now(),
      name: "Guest User",
      email: "user@finwise.app",
      age: 25,
      incomeType: "salaried" as const,
      level: 1,
      xp: 0,
      badges: [],
      joinedDate: new Date().toISOString(),
      lastActive: new Date().toISOString(),
      theme: "light" as const,
    },
    financialHub: {
      accounts: [
        {
          id: "acc_1",
          type: "bank" as const,
          name: "Savings Account",
          balance: 150000,
          institution: "ICICI Bank",
          lastUpdated: new Date().toISOString(),
        },
      ],
      netWorth: 150000,
      lastCalculated: new Date().toISOString(),
    },
    transactions: [
      {
        id: "txn_1",
        type: "expense" as const,
        amount: 5000,
        category: "Food",
        date: new Date().toISOString(),
        note: "Monthly groceries",
        paymentMethod: "Debit Card",
      },
    ],
    goals: [
      {
        id: "goal_1",
        type: "emergency" as const,
        name: "Emergency Fund",
        target: 500000,
        current: 150000,
        deadline: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        priority: "high" as const,
        status: "on-track" as const,
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
          yourScore: 850,
          status: "good" as const,
          description: "Always pays on time",
        },
        {
          name: "Credit Utilization",
          weight: 30,
          yourScore: 750,
          status: "fair" as const,
          description: "Using 40% of available credit",
        },
      ],
      actionPlan: [],
      trend: "stable" as const,
    },
    simulations: {
      history: [],
      unlockedSimulations: ["stock-market", "life-scenario"],
    },
    progress: {
      lessonsCompleted: [],
      challengesActive: [
        {
          id: "ch_1",
          type: "weekly" as const,
          title: "No Food Delivery Week",
          goal: 7,
          progress: 3,
          deadline: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
          reward: 100,
          description: "Avoid food delivery for 7 days",
        },
      ],
      streaks: {
        dailyLogin: 3,
        savings: 2,
        budgetAdherence: 1,
      },
    },
    envelopes: [
      {
        id: "env_1",
        name: "Bills & Utilities",
        priority: "bills" as const,
        target: 30000,
        current: 28000,
        color: "red",
      },
      {
        id: "env_2",
        name: "Financial Goals",
        priority: "goals" as const,
        target: 20000,
        current: 12000,
        color: "green",
      },
      {
        id: "env_3",
        name: "Safe to Spend",
        priority: "safe-to-spend" as const,
        target: 15000,
        current: 8000,
        color: "blue",
      },
    ],
    lessons: [],
    chatHistory: [],
  };

  return useLocalStorage("finwise_appstate", defaultAppState);
}
