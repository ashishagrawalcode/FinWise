import { useState } from "react";
import { useAuth } from "@/hooks/useLocalStorage";
import { useFinancialState } from "@/hooks/useFinancialState";
import type { Account, Transaction } from "@shared/api";
import {
  PlusCircle,
  TrendingUp,
  TrendingDown,
  Send,
  Download,
  Filter,
  Eye,
  EyeOff,
  CreditCard,
  ShieldCheck,
  ArrowUpCircle,
  ArrowDownCircle,
  Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";

const EXPENSE_CATEGORIES = [
  { name: "Food & Dining", icon: "🍔", color: "from-orange-400 to-orange-600" },
  { name: "Transport", icon: "🚗", color: "from-blue-400 to-blue-600" },
  { name: "Shopping", icon: "🛍️", color: "from-pink-400 to-pink-600" },
  { name: "Bills", icon: "💡", color: "from-yellow-400 to-yellow-600" },
  { name: "Entertainment", icon: "🎬", color: "from-purple-400 to-purple-600" },
  { name: "Health", icon: "⚕️", color: "from-red-400 to-red-600" },
  { name: "Education", icon: "📚", color: "from-green-400 to-green-600" },
  { name: "Savings", icon: "💰", color: "from-emerald-400 to-emerald-600" },
];

export default function FinancialHub(): JSX.Element {
  const [authState] = useAuth();
  const { state, isLoaded, addTransaction, addIncome, getMonthlyIncome, getMonthlyExpenses, addAccount, updateAccount, removeAccount } =
    useFinancialState(authState.user?.email || "");

  const [showBalance, setShowBalance] = useState(true);
  const [mode, setMode] = useState<"view" | "add-expense" | "add-income" | "manage-accounts">("view");
  const [selectedCategory, setSelectedCategory] = useState("Food & Dining");
  const [transactionAmount, setTransactionAmount] = useState("");
  const [note, setNote] = useState("");

  const INDIAN_BANKS = [
    "State Bank of India",
    "HDFC Bank",
    "ICICI Bank",
    "Axis Bank",
    "Kotak Mahindra Bank",
    "Punjab National Bank",
    "Bank of Baroda",
    "Canara Bank",
    "Union Bank of India",
    "IDFC First Bank",
  ];

  const BANK_BRANDS: Record<string, { color: string; initials: string }> = {
    "HDFC Bank": { color: "bg-red-600", initials: "HDFC" },
    "State Bank of India": { color: "bg-blue-600", initials: "SBI" },
    "ICICI Bank": { color: "bg-orange-500", initials: "ICICI" },
    "Axis Bank": { color: "bg-red-500", initials: "AXIS" },
    "Kotak Mahindra Bank": { color: "bg-pink-600", initials: "KOTAK" },
  };

  function timeSince(date: Date) {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    const intervals: [number, string][] = [
      [31536000, 'year'],
      [2592000, 'month'],
      [86400, 'day'],
      [3600, 'hour'],
      [60, 'minute'],
      [1, 'second']
    ];
    for (const [sec, name] of intervals) {
      const count = Math.floor(seconds / sec);
      if (count >= 1) return `${count} ${name}${count > 1 ? 's' : ''} ago`;
    }
    return 'just now';
  }

  const ACCOUNT_TYPES: Account["type"][] = [
    "bank",
    "credit-card",
    "loan",
    "investment",
    "retirement",
    "insurance",
  ];

  const [newAccount, setNewAccount] = useState({
    type: "bank" as Account["type"],
    name: "Savings Account",
    balance: 0,
    institution: INDIAN_BANKS[0],
    holderName: "",
    accountSubType: "savings" as "savings" | "current" | "salary",
  });

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
      </div>
    );
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-background to-muted">
        <div className="animate-pulse space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-lg font-semibold text-muted-foreground">Loading your financial dashboard...</p>
        </div>
      </div>
    );
  }

  const mainAccount = state.financialHub.accounts[0];
  const monthlyIncome = getMonthlyIncome();
  const monthlyExpenses = getMonthlyExpenses();
  const savings = monthlyIncome - monthlyExpenses;

  const handleAddExpense = () => {
    const amount = parseFloat(transactionAmount);
    if (amount > 0 && mainAccount.balance >= amount) {
      addTransaction("expense", amount, selectedCategory, "card", note);
      setTransactionAmount("");
      setNote("");
      setMode("view");
    }
  };

  const handleAddIncome = () => {
    const amount = parseFloat(transactionAmount);
    if (amount > 0) {
      addIncome(amount, selectedCategory);
      setTransactionAmount("");
      setMode("view");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/90 to-muted/20 pt-8">
      <div className="max-w-7xl mx-auto px-4 pb-20">
        {/* Header */}
        <div className="relative mb-12 p-8 rounded-3xl bg-gradient-to-r from-primary/20 via-primary/10 to-transparent border border-primary/20 overflow-hidden">
          <div className="absolute inset-0 bg-primary/5 backdrop-blur-xl" />
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
          <div className="relative">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <ShieldCheck className="w-4 h-4" /> Secure Banking
            </div>
            <h1 className="text-5xl font-display font-bold bg-gradient-to-r from-primary to-primary-foreground bg-clip-text text-transparent mb-3">
              Financial Hub ✨
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Your secure space to manage accounts, track transactions, and monitor your finances in real-time.
            </p>
            <div className="flex gap-4 mt-6">
              <button onClick={() => setMode("add-income")} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30">
                <PlusCircle className="w-5 h-5" /> Add Income
              </button>
              <button onClick={() => setMode("manage-accounts")} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-card text-card-foreground hover:bg-card/90 transition-all border border-border shadow-lg hover:shadow-xl">
                <CreditCard className="w-5 h-5" /> Manage Accounts
              </button>
            </div>
          </div>
        </div>
        
        {/* Account Overview Cards */}
        {state.financialHub.accounts.length === 0 ? (
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-background via-card to-muted p-8 mb-8 border border-dashed border-primary/20">
            <div className="absolute inset-0 bg-primary/5 rounded-2xl"></div>
            <div className="relative max-w-md mx-auto text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No accounts yet</h3>
              <p className="text-muted-foreground mb-6">Add your bank accounts, PF, loans, and investments to get started. These accounts are interlinked across goals, budgets, and net worth.</p>
              <button 
                onClick={() => setMode("manage-accounts")} 
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30"
              >
                <PlusCircle className="w-5 h-5" /> Add Your First Account
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Main Account */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-card to-card p-6 shadow-xl transition-all hover:shadow-lg border border-primary/10">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-50"></div>
                <div className="relative">
                <div className="flex items-center justify-between mb-6 gap-4">
                  <div className="flex items-center gap-4">
                    {/* Bank logo / brand */}
                    <div className="flex items-center gap-3">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white font-semibold shadow-lg ${BANK_BRANDS[mainAccount.institution]?.color ?? 'bg-primary'}`}>
                        <span className="text-lg">{BANK_BRANDS[mainAccount.institution]?.initials ?? mainAccount.institution.split(' ').slice(0,2).map(s=>s[0]).join('')}</span>
                      </div>
                      <div>
                        <p className="text-base font-medium text-foreground mb-1">{mainAccount.name} {mainAccount.accountSubType ? `• ${mainAccount.accountSubType}` : ""}</p>
                        <p className="text-sm text-muted-foreground">{mainAccount.institution}</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center justify-end gap-2">
                    <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white">
                      {showBalance ? `₹${mainAccount.balance.toLocaleString("en-IN")}` : "••••••"}
                    </h2>
                    <button onClick={() => setShowBalance(!showBalance)}>
                      {showBalance ? (
                        <EyeOff className="w-5 h-5 text-gray-500" />
                      ) : (
                        <Eye className="w-5 h-5 text-gray-500" />
                      )}
                    </button>
                  </div>

                  <div className="flex items-center justify-end gap-3 mt-2">
                    {/* Status indicator */}
                    {mainAccount.balance < 0 ? (
                      <div className="flex items-center gap-2 text-sm text-red-600"><span className="w-2 h-2 rounded-full bg-red-600 inline-block"/> Overdrawn</div>
                    ) : mainAccount.balance < 1000 ? (
                      <div className="flex items-center gap-2 text-sm text-yellow-600"><span className="w-2 h-2 rounded-full bg-yellow-500 inline-block"/> Low Balance</div>
                    ) : (
                      <div className="flex items-center gap-2 text-sm text-green-600"><span className="w-2 h-2 rounded-full bg-green-500 inline-block"/> Active</div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  <div>Last activity: {timeSince(new Date(mainAccount.lastUpdated))}</div>
                  <div>Interest earned (this month): ₹{(mainAccount as any).interestEarned ?? 0}</div>
                </div>

                <div className="flex items-center gap-2">
                  <button className="px-3 py-2 rounded-md bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 flex items-center gap-2 text-sm">
                    <ArrowUpCircle className="w-5 h-5 text-green-600"/> Add Money
                  </button>
                  <button className="px-3 py-2 rounded-md bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 flex items-center gap-2 text-sm">
                    <Send className="w-5 h-5 text-blue-600"/> Transfer
                  </button>
                  <button className="px-3 py-2 rounded-md bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 flex items-center gap-2 text-sm">
                    <Download className="w-5 h-5 text-purple-600"/> Statement
                  </button>
                </div>
              </div>
            </div>

            {/* Net Worth */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500/10 via-card to-card p-6 shadow-xl transition-all hover:shadow-lg border border-blue-500/10 group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-transparent opacity-50"></div>
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl group-hover:w-40 group-hover:h-40 transition-all"></div>
              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <Wallet className="w-5 h-5 text-blue-500" />
                  <p className="text-sm font-medium text-muted-foreground">Total Net Worth</p>
                </div>
                <h2 className="text-4xl font-display font-bold text-foreground mb-3 group-hover:scale-105 transition-transform">
                  ₹{state.financialHub.netWorth.toLocaleString("en-IN")}
                </h2>
                <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-500/10 text-green-600">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-xs font-semibold">+2.5% this month</span>
                </div>
              </div>
            </div>

            {/* Monthly Overview */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-500/10 via-card to-card p-6 shadow-xl transition-all hover:shadow-lg border border-green-500/10">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-transparent opacity-50"></div>
              <div className="relative">
                <h3 className="text-lg font-semibold mb-4">Monthly Overview</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 rounded-lg bg-green-500/10">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                      <span className="text-sm font-medium">Income</span>
                    </div>
                    <span className="font-semibold text-green-600">
                      +₹{monthlyIncome.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-red-500/10">
                    <div className="flex items-center gap-2">
                      <TrendingDown className="w-5 h-5 text-red-600" />
                      <span className="text-sm font-medium">Expenses</span>
                    </div>
                    <span className="font-semibold text-red-600">
                      -₹{monthlyExpenses.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-primary/10 mt-2">
                    <div className="flex items-center gap-2">
                      <Wallet className="w-5 h-5 text-primary" />
                      <span className="text-sm font-medium">Savings</span>
                    </div>
                    <span className={`font-bold ${savings > 0 ? "text-green-600" : "text-red-600"}`}>
                      {savings > 0 ? "+" : ""}₹{savings.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6 p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 text-sm text-yellow-800 dark:text-yellow-200">
          Accounts are interlinked across the app. Changes here will reflect in goals, budgets, and net worth.
        </div>

        {/* Accounts grouped by type */}
        {(["bank", "credit-card", "loan", "investment", "retirement", "insurance"] as Account["type"][]).map((type) => {
          const items = state.financialHub.accounts.filter((a) => a.type === type);
          if (items.length === 0) return null;
          const titleMap: Record<Account["type"], string> = {
            bank: "Bank Accounts",
            "credit-card": "Credit Cards",
            loan: "Loans",
            investment: "Investments",
            retirement: "Retirement / PF",
            insurance: "Insurance",
          } as const;
          return (
            <div key={type} className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">{titleMap[type]}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {items.map((acc) => (
                  <div key={acc.id} className="card-base flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-md flex items-center justify-center text-white font-semibold ${BANK_BRANDS[acc.institution]?.color ?? 'bg-gray-600'}`}>
                        <span className="text-xs">{BANK_BRANDS[acc.institution]?.initials ?? acc.institution.split(' ').slice(0,2).map(s=>s[0]).join('')}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{acc.name} <span className="text-xs text-gray-500">({acc.type}{acc.accountSubType ? ` • ${acc.accountSubType}` : ""})</span></p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{acc.holderName ? `${acc.holderName} • ` : ""}{acc.institution}</p>
                        <p className="text-xs text-gray-500 mt-1">Last txn: {timeSince(new Date(acc.lastUpdated))}</p>
                      </div>
                    </div>
                    <div className="text-right flex flex-col items-end gap-1">
                      <p className={`font-bold ${acc.balance >= 0 ? "text-gray-900 dark:text-white" : "text-red-600 dark:text-red-400"}`}>
                        {acc.balance >= 0 ? "₹" : "-₹"}{Math.abs(acc.balance).toLocaleString("en-IN")}
                      </p>
                      <div className="flex items-center gap-2">
                        <button className="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-slate-800">Pay</button>
                        <button className="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-slate-800">Transfer</button>
                        <button className="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-slate-800">Stmt</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => setMode("add-income")}
              className="card-base hover:shadow-lg transition-all flex flex-col items-center justify-center py-6"
            >
              <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400 mb-2" />
              <span className="text-sm font-semibold text-gray-900 dark:text-white text-center">
                Add Income
              </span>
            </button>

            <button
              onClick={() => setMode("add-expense")}
              className="card-base hover:shadow-lg transition-all flex flex-col items-center justify-center py-6"
            >
              <TrendingDown className="w-6 h-6 text-red-600 dark:text-red-400 mb-2" />
              <span className="text-sm font-semibold text-gray-900 dark:text-white text-center">
                Add Expense
              </span>
            </button>

            <button className="card-base hover:shadow-lg transition-all flex flex-col items-center justify-center py-6">
              <Send className="w-6 h-6 text-blue-600 dark:text-blue-400 mb-2" />
              <span className="text-sm font-semibold text-gray-900 dark:text-white text-center">
                Transfer
              </span>
            </button>

            <button className="card-base hover:shadow-lg transition-all flex flex-col items-center justify-center py-6">
              <Download className="w-6 h-6 text-purple-600 dark:text-purple-400 mb-2" />
              <span className="text-sm font-semibold text-gray-900 dark:text-white text-center">
                Export
              </span>
            </button>

            <button
              onClick={() => setMode("manage-accounts")}
              className="card-base hover:shadow-lg transition-all flex flex-col items-center justify-center py-6"
            >
              <PlusCircle className="w-6 h-6 text-primary-600 dark:text-primary-400 mb-2" />
              <span className="text-sm font-semibold text-gray-900 dark:text-white text-center">
                Manage Accounts
              </span>
            </button>
          </div>
        </div>

        {/* Add Transaction Modal */}
        {mode !== "view" && (
          <div className="card-base mb-8 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-2 border-blue-200 dark:border-blue-800">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {mode === "add-expense" && "Add Expense"}
                {mode === "add-income" && "Add Income"}
                {mode === "manage-accounts" && "Manage Accounts"}
              </h3>
              <button
                onClick={() => setMode("view")}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                ✕
              </button>
            </div>

            {mode !== "manage-accounts" && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  {mode === "add-expense" ? "Expense Category" : "Income Source"}
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {EXPENSE_CATEGORIES.map((cat) => (
                    <button
                      key={cat.name}
                      onClick={() => setSelectedCategory(cat.name)}
                      className={`p-3 rounded-lg text-center transition-all ${
                        selectedCategory === cat.name
                          ? "ring-2 ring-primary-600 bg-white dark:bg-slate-800"
                          : "bg-gray-100 dark:bg-slate-900 hover:bg-gray-200 dark:hover:bg-slate-800"
                      }`}
                    >
                      <div className="text-2xl mb-1">{cat.icon}</div>
                      <p className="text-xs font-medium text-gray-900 dark:text-white">{cat.name}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {mode !== "manage-accounts" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Amount (₹)
                  </label>
                  <input
                    type="number"
                    value={transactionAmount}
                    onChange={(e) => setTransactionAmount(e.target.value)}
                    placeholder="0"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Note (optional)
                  </label>
                  <input
                    type="text"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Add a note..."
                    className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            )}

            {mode === "manage-accounts" && (
              <div className="space-y-6">
                <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-gray-200 dark:border-slate-700">
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-3 font-semibold">
                    Add New Account
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Account Type</label>
                      <div className="flex flex-wrap gap-2">
                        {ACCOUNT_TYPES.map((t) => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => setNewAccount((p) => ({ ...p, type: t }))}
                            className={`px-3 py-2 rounded-md border text-sm ${
                              newAccount.type === t
                                ? "border-primary-600 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300"
                                : "border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800"
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Institution (India)</label>
                      <select
                        value={newAccount.institution}
                        onChange={(e) => setNewAccount((p) => ({ ...p, institution: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
                      >
                        {INDIAN_BANKS.map((b) => (
                          <option key={b} value={b}>{b}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Account Holder Name</label>
                      <input
                        type="text"
                        value={newAccount.holderName}
                        onChange={(e) => setNewAccount((p) => ({ ...p, holderName: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
                        placeholder="Name on account"
                      />
                    </div>
                    {newAccount.type === "bank" && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bank Account Type</label>
                        <select
                          value={newAccount.accountSubType}
                          onChange={(e) => setNewAccount((p) => ({ ...p, accountSubType: e.target.value as any }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
                        >
                          <option value="savings">Savings</option>
                          <option value="current">Current</option>
                          <option value="salary">Salary</option>
                        </select>
                      </div>
                    )}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Account Name</label>
                      <input
                        type="text"
                        value={newAccount.name}
                        onChange={(e) => setNewAccount((p) => ({ ...p, name: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
                        placeholder="e.g., Salary Account"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Current Balance (₹)</label>
                      <input
                        type="number"
                        value={newAccount.balance}
                        onChange={(e) => setNewAccount((p) => ({ ...p, balance: parseFloat(e.target.value) || 0 }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={() => {
                        addAccount(newAccount);
                        setNewAccount({ type: "bank", name: "Savings Account", balance: 0, institution: INDIAN_BANKS[0], holderName: "", accountSubType: "savings" });
                      }}
                      className="btn-primary"
                    >
                      Add Account
                    </button>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-gray-200 dark:border-slate-700">
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-3 font-semibold">
                    Your Accounts
                  </p>
                  <div className="space-y-3">
                    {state.financialHub.accounts.length === 0 && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">No accounts yet.</p>
                    )}
                    {state.financialHub.accounts.map((acc) => (
                      <div key={acc.id} className="flex items-center gap-3 justify-between p-3 rounded-lg border border-gray-200 dark:border-slate-700">
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">{acc.name} <span className="text-xs text-gray-500">({acc.type}{acc.accountSubType ? ` • ${acc.accountSubType}` : ""})</span></p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{acc.holderName ? `${acc.holderName} • ` : ""}{acc.institution}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <input
                            type="number"
                            defaultValue={acc.balance}
                            onBlur={(e) => updateAccount(acc.id, { balance: parseFloat(e.target.value) || 0 })}
                            className="w-32 px-2 py-1 border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-900 text-gray-900 dark:text-white text-right"
                          />
                          <button onClick={() => removeAccount(acc.id)} className="text-red-600 text-sm font-semibold">Remove</button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                    Note: Accounts are interlinked across the app (budgets, goals, and net worth updates reflect account changes).
                  </p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            {mode !== "manage-accounts" && (
              <div className="flex gap-4">
                <button
                  onClick={() => setMode("view")}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={mode === "add-expense" ? handleAddExpense : handleAddIncome}
                  className="flex-1 btn-primary"
                  disabled={!transactionAmount || parseFloat(transactionAmount) <= 0}
                >
                  {mode === "add-expense" ? "Add Expense" : "Add Income"}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Recent Transactions */}
        <div className="rounded-2xl bg-gradient-to-br from-card via-card to-background p-6 border border-border">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold text-foreground">
                Recent Transactions
              </h2>
              <p className="text-sm text-muted-foreground mt-1">Track your recent income and expenses</p>
            </div>
            <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-sm font-medium">
              <Filter className="w-4 h-4" /> View All
            </button>
          </div>

          <div className="space-y-2">
            {state.transactions
              .slice()
              .reverse()
              .slice(0, 10)
              .map((txn) => {
                const icon = txn.type === "income" ? "📥" : "📤";
                const color =
                  txn.type === "income"
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400";

                return (
                  <div
                    key={txn.id}
                    className="relative overflow-hidden rounded-xl bg-gradient-to-br from-background via-card to-card p-4 transition-all hover:shadow-lg border border-border group hover:-translate-y-0.5"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative flex items-center gap-4 flex-1">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${txn.type === 'income' ? 'bg-green-500/10' : 'bg-red-500/10'} group-hover:scale-110 transition-transform`}>
                        <span className="text-2xl">{icon}</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-foreground group-hover:text-primary transition-colors">
                          {txn.category}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(txn.date).toLocaleDateString()}{" "}
                          {txn.note && `• ${txn.note}`}
                        </p>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className={`font-bold text-lg ${color} group-hover:scale-105 transition-transform`}>
                          {txn.type === "income" ? "+" : "-"}₹{txn.amount.toLocaleString("en-IN")}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          via {txn.paymentMethod}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
        )}

      </div>
    </div>
  );
}