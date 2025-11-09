import { useState, useEffect } from "react";
import { StockHolding, Account, Transaction, Stock } from "@shared/api";
import { MOCK_STOCKS } from "@/data/stocks";
import { useFinancialState } from "./useFinancialState";
import { useAuth } from "./useLocalStorage";

export interface InvestmentStats {
  totalValue: number;
  totalReturn: number;
  returnPercent: number;
  holdings: {
    stockId: string;
    symbol: string;
    shares: number;
    currentValue: number;
    totalReturn: number;
    returnPercent: number;
    stock: Stock;
  }[];
  recentTransactions: Transaction[];
  performance: {
    day: number;
    week: number;
    month: number;
    year: number;
  };
}

export function useInvestments() {
  const [authState] = useAuth();
  const { state: financialState } = useFinancialState(authState.user?.email || "");
  const [investmentState, setInvestmentState] = useState<InvestmentStats>({
    totalValue: 0,
    totalReturn: 0,
    returnPercent: 0,
    holdings: [],
    recentTransactions: [],
    performance: {
      day: 0,
      week: 0,
      month: 0,
      year: 0,
    },
  });

  // Update stats periodically to simulate real-time market
  useEffect(() => {
    const interval = setInterval(refreshStocks, 5000);
    return () => clearInterval(interval);
  }, []);

  const buyStock = async (stockId: string, shares: number) => {
    const stock = MOCK_STOCKS.find((s) => s.id === stockId);
    if (!stock) return;

    const totalCost = stock.currentPrice * shares;
    const holding = investmentState.holdings.find((h) => h.stockId === stockId);
    
    if (holding) {
      const newShares = holding.shares + shares;
      const avgPrice = (holding.shares * holding.stock.currentPrice + totalCost) / newShares;
      const updatedHolding = {
        ...holding,
        shares: newShares,
        currentValue: stock.currentPrice * newShares,
        totalReturn: (stock.currentPrice - avgPrice) * newShares,
        returnPercent: ((stock.currentPrice - avgPrice) / avgPrice) * 100,
      };
      setInvestmentState((prev) => ({
        ...prev,
        holdings: prev.holdings.map((h) => (h.stockId === stockId ? updatedHolding : h)),
      }));
    } else {
      const newHolding = {
        stockId,
        symbol: stock.symbol,
        shares,
        currentValue: totalCost,
        totalReturn: 0,
        returnPercent: 0,
        stock,
      };
      setInvestmentState((prev) => ({
        ...prev,
        holdings: [...prev.holdings, newHolding],
      }));
    }
  };

  const sellStock = async (stockId: string, shares: number) => {
    const holding = investmentState.holdings.find((h) => h.stockId === stockId);
    if (!holding || holding.shares < shares) return;

    const remainingShares = holding.shares - shares;
    if (remainingShares === 0) {
      setInvestmentState((prev) => ({
        ...prev,
        holdings: prev.holdings.filter((h) => h.stockId !== stockId),
      }));
    } else {
      const updatedHolding = {
        ...holding,
        shares: remainingShares,
        currentValue: holding.stock.currentPrice * remainingShares,
        totalReturn: (holding.stock.currentPrice - holding.stock.basePrice) * remainingShares,
        returnPercent: ((holding.stock.currentPrice - holding.stock.basePrice) / holding.stock.basePrice) * 100,
      };
      setInvestmentState((prev) => ({
        ...prev,
        holdings: prev.holdings.map((h) => (h.stockId === stockId ? updatedHolding : h)),
      }));
    }
  };

  const refreshStocks = async () => {
    // Simulate real-time stock updates
    const updatedStats = {
      ...investmentState,
      holdings: investmentState.holdings.map((holding) => {
        const stock = MOCK_STOCKS.find((s) => s.id === holding.stockId);
        if (!stock) return holding;
        
        const priceChange = (Math.random() - 0.5) * 2;
        const updatedPrice = stock.currentPrice * (1 + priceChange / 100);
        const updatedStock = { ...stock, currentPrice: updatedPrice };
        
        return {
          ...holding,
          stock: updatedStock,
          currentValue: updatedPrice * holding.shares,
          totalReturn: (updatedPrice - stock.basePrice) * holding.shares,
          returnPercent: ((updatedPrice - stock.basePrice) / stock.basePrice) * 100,
        };
      }),
    };
    setInvestmentState(updatedStats);
  };

  return {
    stats: investmentState,
    buyStock,
    sellStock,
    refreshStocks,
  };

  const { state } = useFinancialState(authState.user?.email || "");
  const [stats, setStats] = useState<InvestmentStats>({
    totalValue: 0,
    totalReturn: 0,
    returnPercent: 0,
    holdings: [],
    recentTransactions: [],
    performance: {
      day: 0,
      week: 0,
      month: 0,
      year: 0,
    },
  });

  useEffect(() => {
    // Get investment accounts
    const investmentAccounts = state.financialHub.accounts.filter(
      (acc) => acc.type === "investment"
    );

    // Get all stock holdings
    const allHoldings = investmentAccounts.flatMap((acc) => acc.holdings || []);

    // Get stock transactions
    const stockTransactions = state.transactions
      .filter((t) => t.method === "stock")
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    // Calculate stats for each holding
    const holdingsWithStats = allHoldings.map((holding) => {
      const stock = MOCK_STOCKS.find((s) => s.symbol === holding.symbol);
      if (!stock) return null;

      const currentValue = stock.currentPrice * holding.shares;
      const totalReturn = currentValue - holding.avgPrice * holding.shares;
      const returnPercent = (totalReturn / (holding.avgPrice * holding.shares)) * 100;

      return {
        stockId: holding.stockId,
        symbol: holding.symbol,
        shares: holding.shares,
        currentValue,
        totalReturn,
        returnPercent,
        stock,
      };
    }).filter((h): h is NonNullable<typeof h> => h !== null);

    // Calculate overall performance
    const totalValue = holdingsWithStats.reduce((sum, h) => sum + h.currentValue, 0);
    const totalInvested = holdingsWithStats.reduce(
      (sum, h) => sum + h.shares * h.stock.basePrice,
      0
    );
    const totalReturn = totalValue - totalInvested;
    const returnPercent = totalInvested > 0 ? (totalReturn / totalInvested) * 100 : 0;

    // Mock performance data
    const performance = {
      day: Math.random() * 4 - 2, // -2% to +2%
      week: Math.random() * 8 - 4, // -4% to +4%
      month: Math.random() * 15 - 7.5, // -7.5% to +7.5%
      year: Math.random() * 30 - 10, // -10% to +20%
    };

    setStats({
      totalValue,
      totalReturn,
      returnPercent,
      holdings: holdingsWithStats,
      recentTransactions: stockTransactions.slice(0, 10),
      performance,
    });
  }, [state.financialHub.accounts, state.transactions]);

  return { stats };
}