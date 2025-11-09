import { useEffect, useState } from 'react';

export interface StockData {
  symbol: string;
  latestPrice: number;
  change: number;
  changePercent: number;
}

export function useStockMarket(symbols: string[]) {
  const [stockData, setStockData] = useState<Record<string, StockData>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        // In a real app, this would fetch from a real stock market API
        const mockData: Record<string, StockData> = {};
        symbols.forEach(symbol => {
          const basePrice = Math.random() * 1000 + 100;
          const change = (Math.random() - 0.5) * 20;
          mockData[symbol] = {
            symbol,
            latestPrice: basePrice,
            change,
            changePercent: (change / basePrice) * 100
          };
        });
        setStockData(mockData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching stock data:', error);
        setLoading(false);
      }
    };

    fetchStockData();
    const interval = setInterval(fetchStockData, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, [symbols]);

  return { stockData, loading };
}