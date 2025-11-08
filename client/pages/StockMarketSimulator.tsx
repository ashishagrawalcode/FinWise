import { useState, useEffect, useCallback } from "react";
import { ChevronDown, ChevronUp, TrendingUp, TrendingDown, Clock, X, CheckCircle, AlertCircle } from "lucide-react";
import { MOCK_STOCKS, Stock, simulatePriceChange } from "@/data/stocks";

interface Trade {
  id: string;
  symbol: string;
  quantity: number;
  buyPrice: number;
  buyTime: string;
}

interface SimulatorState {
  stage: "rules" | "active" | "results";
  timeLeft: number;
  capital: number;
  investedCapital: number;
  portfolio: Trade[];
  stocks: Stock[];
  tradeCount: number;
  selectedStock: Stock | null;
}

export default function StockMarketSimulator() {
  const [state, setState] = useState<SimulatorState>({
    stage: "rules",
    timeLeft: 300, // 5 minutes
    capital: 100000,
    investedCapital: 0,
    portfolio: [],
    stocks: MOCK_STOCKS,
    tradeCount: 0,
    selectedStock: MOCK_STOCKS[0],
  });

  const [buyQuantity, setBuyQuantity] = useState(10);
  const [feedbackMessage, setFeedbackMessage] = useState("");

  // Timer logic
  useEffect(() => {
    if (state.stage !== "active") return;

    const timer = setInterval(() => {
      setState((prev) => {
        if (prev.timeLeft <= 1) {
          return { ...prev, timeLeft: 0, stage: "results" };
        }
        return { ...prev, timeLeft: prev.timeLeft - 1 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [state.stage]);

  // Simulate price changes every 5 seconds
  useEffect(() => {
    if (state.stage !== "active") return;

    const priceInterval = setInterval(() => {
      setState((prev) => {
        const updatedStocks = prev.stocks.map(simulatePriceChange);
        const selectedUpdated = updatedStocks.find((s) => s.id === prev.selectedStock?.id) || updatedStocks[0];
        
        return {
          ...prev,
          stocks: updatedStocks,
          selectedStock: selectedUpdated,
        };
      });
    }, 5000);

    return () => clearInterval(priceInterval);
  }, [state.stage]);

  const startSimulation = () => {
    setState((prev) => ({ ...prev, stage: "active" }));
  };

  const selectStock = (stock: Stock) => {
    setState((prev) => ({ ...prev, selectedStock: stock }));
  };

  const buyStock = () => {
    if (!state.selectedStock || state.tradeCount >= 10) {
      setFeedbackMessage("Trade limit reached!");
      setTimeout(() => setFeedbackMessage(""), 3000);
      return;
    }

    const cost = state.selectedStock.currentPrice * buyQuantity;

    if (cost > state.capital) {
      setFeedbackMessage("Insufficient capital!");
      setTimeout(() => setFeedbackMessage(""), 3000);
      return;
    }

    const newTrade: Trade = {
      id: `trade_${Date.now()}`,
      symbol: state.selectedStock.symbol,
      quantity: buyQuantity,
      buyPrice: state.selectedStock.currentPrice,
      buyTime: new Date().toLocaleTimeString(),
    };

    setState((prev) => ({
      ...prev,
      capital: prev.capital - cost,
      investedCapital: prev.investedCapital + cost,
      portfolio: [...prev.portfolio, newTrade],
      tradeCount: prev.tradeCount + 1,
    }));

    setFeedbackMessage(`Bought ${buyQuantity} shares of ${state.selectedStock.symbol}`);
    setTimeout(() => setFeedbackMessage(""), 3000);
  };

  const sellStock = (tradeId: string) => {
    const trade = state.portfolio.find((t) => t.id === tradeId);
    if (!trade) return;

    const stock = state.stocks.find((s) => s.symbol === trade.symbol);
    if (!stock) return;

    const sellValue = stock.currentPrice * trade.quantity;
    const profit = sellValue - trade.buyPrice * trade.quantity;

    setState((prev) => ({
      ...prev,
      capital: prev.capital + sellValue,
      investedCapital: prev.investedCapital - trade.buyPrice * trade.quantity,
      portfolio: prev.portfolio.filter((t) => t.id !== tradeId),
      tradeCount: prev.tradeCount + 1,
    }));

    setFeedbackMessage(
      `Sold ${trade.quantity} shares. ${profit > 0 ? "Profit" : "Loss"}: ₹${Math.abs(profit).toLocaleString("en-IN")}`
    );
    setTimeout(() => setFeedbackMessage(""), 3000);
  };

  const calculatePortfolioValue = () => {
    return state.portfolio.reduce((total, trade) => {
      const stock = state.stocks.find((s) => s.symbol === trade.symbol);
      return total + (stock ? stock.currentPrice * trade.quantity : 0);
    }, 0);
  };

  const portfolioValue = calculatePortfolioValue();
  const totalValue = state.capital + portfolioValue;
  const pnl = totalValue - 100000;
  const accuracy = totalValue >= 105000 ? 85 : totalValue >= 100000 ? 70 : 50;

  // Format timer
  const minutes = Math.floor(state.timeLeft / 60);
  const seconds = state.timeLeft % 60;
  const timerDisplay = `${minutes}:${seconds.toString().padStart(2, "0")}`;

  if (state.stage === "rules") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-900 dark:to-slate-950 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl max-w-2xl w-full p-8">
          <h1 className="text-4xl font-display font-bold text-gray-900 dark:text-white mb-6">
            Stock Market Simulator
          </h1>

          <div className="space-y-6 mb-8">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Your Challenge
              </h3>
              <p className="text-blue-800 dark:text-blue-200 text-sm">
                You have ₹1,00,000 and 5 minutes to make profitable trades in the Indian stock market.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900 dark:text-white">Rules:</h3>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300 text-sm">
                <li className="flex gap-3 items-start">
                  <span className="inline-flex items-center justify-center w-6 h-6 bg-primary-600 text-white rounded-full flex-shrink-0 text-xs font-bold">
                    1
                  </span>
                  <span>Maximum 10 trades (buys + sells combined)</span>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="inline-flex items-center justify-center w-6 h-6 bg-primary-600 text-white rounded-full flex-shrink-0 text-xs font-bold">
                    2
                  </span>
                  <span>Stock prices update every 5 seconds (realistic volatility)</span>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="inline-flex items-center justify-center w-6 h-6 bg-primary-600 text-white rounded-full flex-shrink-0 text-xs font-bold">
                    3
                  </span>
                  <span>Your goal: Maximize profit or minimize loss</span>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="inline-flex items-center justify-center w-6 h-6 bg-primary-600 text-white rounded-full flex-shrink-0 text-xs font-bold">
                    4
                  </span>
                  <span>You can't short sell - only buy and sell what you own</span>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="inline-flex items-center justify-center w-6 h-6 bg-primary-600 text-white rounded-full flex-shrink-0 text-xs font-bold">
                    5
                  </span>
                  <span>Time expires in 5 minutes - make quick decisions!</span>
                </li>
              </ul>
            </div>

            <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
              <h3 className="font-semibold text-amber-900 dark:text-amber-100 mb-2 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Learning Objective
              </h3>
              <p className="text-amber-800 dark:text-amber-200 text-sm">
                Understand how market timing, risk management, and greed/fear affect trading outcomes.
              </p>
            </div>
          </div>

          <button
            onClick={startSimulation}
            className="w-full btn-primary text-lg font-semibold"
          >
            Start Simulation
          </button>
        </div>
      </div>
    );
  }

  if (state.stage === "results") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-900 dark:to-slate-950 flex items-center justify-center p-4 pt-24">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl max-w-2xl w-full p-8">
          <div className="text-center mb-8">
            {pnl > 0 ? (
              <div className="flex justify-center mb-4">
                <CheckCircle className="w-16 h-16 text-green-500 animate-bounce" />
              </div>
            ) : (
              <div className="flex justify-center mb-4">
                <AlertCircle className="w-16 h-16 text-yellow-500 animate-bounce" />
              </div>
            )}

            <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-2">
              Simulation Complete!
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              You made {state.tradeCount} trades in 5 minutes
            </p>
          </div>

          {/* Results Cards */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="card-base">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Final Balance</p>
              <p className="text-2xl font-display font-bold text-gray-900 dark:text-white">
                ₹{totalValue.toLocaleString("en-IN")}
              </p>
            </div>
            <div className={`card-base ${pnl > 0 ? "bg-green-50 dark:bg-green-900/20" : "bg-red-50 dark:bg-red-900/20"}`}>
              <p className={`text-xs mb-1 ${pnl > 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                Profit/Loss
              </p>
              <p className={`text-2xl font-display font-bold ${pnl > 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                {pnl > 0 ? "+" : ""}₹{pnl.toLocaleString("en-IN")}
              </p>
            </div>
            <div className="card-base">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Return %</p>
              <p className="text-2xl font-display font-bold text-gray-900 dark:text-white">
                {((pnl / 100000) * 100).toFixed(2)}%
              </p>
            </div>
            <div className="card-base">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Decision Quality</p>
              <p className="text-2xl font-display font-bold text-primary-600 dark:text-primary-400">
                {accuracy}%
              </p>
            </div>
          </div>

          {/* Feedback */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800 mb-8">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">AI Coach Feedback</h3>
            <p className="text-blue-800 dark:text-blue-200 text-sm leading-relaxed">
              {pnl > 10000
                ? "Excellent trading! You showed good market timing and discipline. Your strategy of buying low-volatility stocks and holding through small dips paid off. Continue building this confidence!"
                : pnl > 0
                  ? "Good job keeping your capital safe! You made profitable trades, but could have been more aggressive. Practice reading market trends to identify better entry points."
                  : pnl > -5000
                    ? "Don't worry about the loss - even experienced traders have bad days. You learned about FOMO and panic selling. Next time, stick to a plan and avoid reactive trades."
                    : "This loss is a crucial lesson! You likely panic-sold or bought at peaks. Remember: emotions are a trader's worst enemy. Practice staying calm and following your strategy."}
            </p>
          </div>

          {/* XP Reward */}
          <div className="bg-gradient-primary p-4 rounded-lg text-white mb-8 text-center">
            <p className="text-sm opacity-90 mb-1">Experience Earned</p>
            <p className="text-3xl font-display font-bold">+150 XP</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => window.location.href = "/simulations"}
              className="btn-secondary"
            >
              Back to Simulations
            </button>
            <button
              onClick={() => setState({ ...state, stage: "rules", timeLeft: 300, capital: 100000, investedCapital: 0, portfolio: [], tradeCount: 0 })}
              className="btn-primary"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 pt-20">
      <div className="max-w-7xl mx-auto px-4 pb-20">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">
            Stock Market Simulator
          </h1>
          <div className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-lg ${
            state.timeLeft <= 60 
              ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400" 
              : "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
          }`}>
            <Clock className="w-5 h-5" />
            {timerDisplay}
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
          {/* Stock List */}
          <div className="lg:col-span-1">
            <div className="card-base sticky top-24">
              <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Indian Stocks</h2>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {state.stocks.map((stock) => (
                  <button
                    key={stock.id}
                    onClick={() => selectStock(stock)}
                    className={`w-full p-2 rounded-lg text-left transition-all ${
                      state.selectedStock?.id === stock.id
                        ? "bg-primary-100 dark:bg-primary-900/30 border-2 border-primary-500"
                        : "hover:bg-gray-100 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-xs text-gray-900 dark:text-white">
                          {stock.symbol}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{stock.name}</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <span className="font-bold text-gray-900 dark:text-white">₹{stock.currentPrice}</span>
                      <span className={`text-xs font-semibold flex items-center gap-1 ${
                        stock.change >= 0
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      }`}>
                        {stock.change >= 0 ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        {Math.abs(stock.changePercent).toFixed(2)}%
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Stock Details and Trading */}
          <div className="lg:col-span-2">
            {state.selectedStock && (
              <div className="space-y-4">
                {/* Stock Header */}
                <div className="card-base">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">
                        {state.selectedStock.symbol}
                      </h2>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {state.selectedStock.name}
                      </p>
                    </div>
                    <div className={`text-3xl font-display font-bold ${
                      state.selectedStock.change >= 0
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}>
                      ₹{state.selectedStock.currentPrice}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-slate-700">
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Change</p>
                      <p className={`font-semibold flex items-center gap-1 ${
                        state.selectedStock.change >= 0
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      }`}>
                        {state.selectedStock.change >= 0 ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        {Math.abs(state.selectedStock.change).toFixed(2)} ({Math.abs(state.selectedStock.changePercent).toFixed(2)}%)
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">P/E Ratio</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{state.selectedStock.pe}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Volume</p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {(state.selectedStock.volume / 1000000).toFixed(1)}M
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Market Cap</p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        ₹{(state.selectedStock.marketCap / 1000).toFixed(0)}K Cr
                      </p>
                    </div>
                  </div>
                </div>

                {/* Trading Interface */}
                <div className="card-base">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Place Trade</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Quantity
                      </label>
                      <input
                        type="number"
                        value={buyQuantity}
                        onChange={(e) => setBuyQuantity(Math.max(1, parseInt(e.target.value) || 0))}
                        className="w-full px-3 py-2 border border-gray-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
                        min="1"
                      />
                    </div>

                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        Total Cost: <span className="font-semibold text-gray-900 dark:text-white">
                          ₹{(state.selectedStock.currentPrice * buyQuantity).toLocaleString("en-IN")}
                        </span>
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Available Capital: ₹{state.capital.toLocaleString("en-IN")}
                      </p>
                    </div>

                    <button
                      onClick={buyStock}
                      disabled={state.tradeCount >= 10}
                      className="w-full bg-green-600 dark:bg-green-700 hover:bg-green-700 dark:hover:bg-green-800 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-all"
                    >
                      {state.tradeCount >= 10 ? "Trade Limit Reached" : "Buy"}
                    </button>
                  </div>
                </div>

                {feedbackMessage && (
                  <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-200 p-4 rounded-lg flex justify-between items-center">
                    <span>{feedbackMessage}</span>
                    <button onClick={() => setFeedbackMessage("")}>
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Portfolio */}
          <div className="lg:col-span-1">
            <div className="card-base sticky top-24">
              <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Your Portfolio</h2>

              {/* Capital Display */}
              <div className="mb-4 pb-4 border-b border-gray-200 dark:border-slate-700">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Cash</p>
                <p className="text-2xl font-display font-bold text-gray-900 dark:text-white">
                  ₹{state.capital.toLocaleString("en-IN")}
                </p>

                <p className="text-xs text-gray-600 dark:text-gray-400 mt-3 mb-1">Holdings</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  ₹{portfolioValue.toLocaleString("en-IN")}
                </p>

                <p className="text-xs text-gray-600 dark:text-gray-400 mt-3 mb-1">Total Value</p>
                <p className={`text-xl font-bold ${
                  totalValue >= 100000
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }`}>
                  ₹{totalValue.toLocaleString("en-IN")}
                </p>

                <p className={`text-xs font-semibold mt-2 ${
                  pnl >= 0
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }`}>
                  {pnl >= 0 ? "+" : ""}₹{pnl.toLocaleString("en-IN")} ({((pnl / 100000) * 100).toFixed(2)}%)
                </p>
              </div>

              {/* Trade Count */}
              <div className="mb-4 pb-4 border-b border-gray-200 dark:border-slate-700">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Trades Used</p>
                <div className="w-full h-2 bg-gray-200 dark:bg-slate-700 rounded-full">
                  <div
                    className="h-full bg-gradient-primary rounded-full transition-all"
                    style={{ width: `${(state.tradeCount / 10) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {state.tradeCount} / 10
                </p>
              </div>

              {/* Holdings */}
              <div>
                <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">Holdings</p>
                {state.portfolio.length === 0 ? (
                  <p className="text-xs text-gray-500 dark:text-gray-400 italic">No holdings yet</p>
                ) : (
                  <div className="space-y-2">
                    {state.portfolio.map((trade) => {
                      const stock = state.stocks.find((s) => s.symbol === trade.symbol);
                      const currentValue = stock ? stock.currentPrice * trade.quantity : 0;
                      const profit = currentValue - trade.buyPrice * trade.quantity;

                      return (
                        <div
                          key={trade.id}
                          className="bg-gray-50 dark:bg-slate-900 p-2 rounded border border-gray-200 dark:border-slate-700"
                        >
                          <div className="flex justify-between items-start mb-1">
                            <span className="text-xs font-semibold text-gray-900 dark:text-white">
                              {trade.symbol}
                            </span>
                            <button
                              onClick={() => sellStock(trade.id)}
                              className="text-xs bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-2 py-0.5 rounded hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                            >
                              Sell
                            </button>
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                            {trade.quantity} @ ₹{trade.buyPrice}
                          </p>
                          <p className={`text-xs font-semibold ${
                            profit >= 0
                              ? "text-green-600 dark:text-green-400"
                              : "text-red-600 dark:text-red-400"
                          }`}>
                            {profit >= 0 ? "+" : ""}₹{profit.toLocaleString("en-IN")}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
