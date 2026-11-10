import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { StockQuote, MarketIndex, Position, ActiveTab } from '../types/market';
import { INITIAL_INDICES, INITIAL_STOCKS } from '../data/marketData';

interface MarketContextType {
  stocks: StockQuote[];
  indices: MarketIndex[];
  selectedSymbol: string;
  setSelectedSymbol: (symbol: string) => void;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  watchlist: string[];
  toggleWatchlist: (symbol: string) => void;
  isInWatchlist: (symbol: string) => boolean;
  isLiveFeedActive: boolean;
  toggleLiveFeed: () => void;
  paperBalance: number;
  positions: Position[];
  openPosition: (symbol: string, type: 'BUY' | 'SELL', shares: number, stopLoss?: number, takeProfit?: number) => void;
  closePosition: (id: string) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isOrderModalOpen: boolean;
  setIsOrderModalOpen: (open: boolean) => void;
  detailModalSymbol: string | null;
  setDetailModalSymbol: (symbol: string | null) => void;
  selectedStock: StockQuote | undefined;
  portfolioValue: number;
  totalPnL: number;
}

const MarketContext = createContext<MarketContextType | undefined>(undefined);

export const MarketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stocks, setStocks] = useState<StockQuote[]>(INITIAL_STOCKS);
  const [indices, setIndices] = useState<MarketIndex[]>(INITIAL_INDICES);
  const [selectedSymbol, setSelectedSymbol] = useState<string>('NVDA');
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [watchlist, setWatchlist] = useState<string[]>(['NVDA', 'AAPL', 'MSFT', 'TSLA', 'COIN', 'PLTR']);
  const [isLiveFeedActive, setIsLiveFeedActive] = useState<boolean>(true);
  const [paperBalance, setPaperBalance] = useState<number>(100000.00);
  const [positions, setPositions] = useState<Position[]>([
    {
      id: 'p1',
      symbol: 'NVDA',
      type: 'BUY',
      shares: 100,
      entryPrice: 142.10,
      currentPrice: 147.25,
      timestamp: Date.now() - 3600000 * 4,
    },
    {
      id: 'p2',
      symbol: 'TSLA',
      type: 'BUY',
      shares: 50,
      entryPrice: 318.50,
      currentPrice: 328.50,
      timestamp: Date.now() - 3600000 * 2,
    },
  ]);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState<boolean>(false);
  const [detailModalSymbol, setDetailModalSymbol] = useState<string | null>(null);

  // Toggle watchlist
  const toggleWatchlist = useCallback((symbol: string) => {
    setWatchlist(prev => 
      prev.includes(symbol) ? prev.filter(s => s !== symbol) : [...prev, symbol]
    );
  }, []);

  const isInWatchlist = useCallback((symbol: string) => {
    return watchlist.includes(symbol);
  }, [watchlist]);

  const toggleLiveFeed = useCallback(() => {
    setIsLiveFeedActive(prev => !prev);
  }, []);

  // Live simulation tick engine
  useEffect(() => {
    if (!isLiveFeedActive) return;

    const interval = setInterval(() => {
      // Pick 1 to 3 random stocks to tick
      const countToUpdate = Math.floor(Math.random() * 3) + 1;
      const targetIndices: number[] = [];
      
      for (let i = 0; i < countToUpdate; i++) {
        const randIdx = Math.floor(Math.random() * INITIAL_STOCKS.length);
        if (!targetIndices.includes(randIdx)) {
          targetIndices.push(randIdx);
        }
      }

      setStocks(prevStocks => {
        return prevStocks.map((stock, idx) => {
          if (!targetIndices.includes(idx)) {
            // Expire flash after 1.5s
            if (stock.lastTickDirection && stock.lastTickTime && Date.now() - stock.lastTickTime > 1500) {
              return { ...stock, lastTickDirection: 'none' };
            }
            return stock;
          }

          // Generate small tick (-0.2% to +0.25%)
          const tickPct = (Math.random() - 0.46) * 0.005;
          const oldPrice = stock.price;
          const newPrice = Math.max(1, parseFloat((oldPrice * (1 + tickPct)).toFixed(2)));
          const direction: 'up' | 'down' = newPrice >= oldPrice ? 'up' : 'down';
          const newChange = parseFloat((newPrice - stock.previousClose).toFixed(2));
          const newChangePct = parseFloat(((newChange / stock.previousClose) * 100).toFixed(2));
          const newHigh = Math.max(stock.high, newPrice);
          const newLow = Math.min(stock.low, newPrice);
          const newSparkline = [...stock.sparkline.slice(-12), newPrice];

          return {
            ...stock,
            price: newPrice,
            change: newChange,
            changePercent: newChangePct,
            high: newHigh,
            low: newLow,
            sparkline: newSparkline,
            lastTickDirection: direction,
            lastTickTime: Date.now(),
          };
        });
      });

      // Also occasionally tick an index
      if (Math.random() > 0.4) {
        setIndices(prevIndices => {
          const randIdx = Math.floor(Math.random() * prevIndices.length);
          return prevIndices.map((idxItem, i) => {
            if (i !== randIdx) return idxItem;
            const delta = (Math.random() - 0.47) * (idxItem.price * 0.001);
            const newPrice = parseFloat((idxItem.price + delta).toFixed(2));
            const newChange = parseFloat((idxItem.change + delta).toFixed(2));
            const newPct = parseFloat(((newChange / (idxItem.price - idxItem.change)) * 100).toFixed(2));
            return {
              ...idxItem,
              price: newPrice,
              change: newChange,
              changePercent: newPct,
              high: Math.max(idxItem.high, newPrice),
              low: Math.min(idxItem.low, newPrice),
            };
          });
        });
      }
    }, 2400);

    return () => clearInterval(interval);
  }, [isLiveFeedActive]);

  // Update positions current price when stocks update
  useEffect(() => {
    setPositions(prev =>
      prev.map(pos => {
        const found = stocks.find(s => s.symbol === pos.symbol);
        if (found) {
          return { ...pos, currentPrice: found.price };
        }
        return pos;
      })
    );
  }, [stocks]);

  // Open position in paper trading
  const openPosition = useCallback((
    symbol: string,
    type: 'BUY' | 'SELL',
    shares: number,
    stopLoss?: number,
    takeProfit?: number
  ) => {
    const stock = stocks.find(s => s.symbol === symbol);
    if (!stock) return;

    const cost = stock.price * shares;
    if (type === 'BUY' && cost > paperBalance) {
      alert(`Insufficient funds! Order requires $${cost.toLocaleString('en-US', { minimumFractionDigits: 2 })} but balance is $${paperBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}`);
      return;
    }

    const newPosition: Position = {
      id: 'pos_' + Date.now(),
      symbol,
      type,
      shares,
      entryPrice: stock.price,
      currentPrice: stock.price,
      stopLoss,
      takeProfit,
      timestamp: Date.now(),
    };

    setPositions(prev => [newPosition, ...prev]);
    if (type === 'BUY') {
      setPaperBalance(prev => prev - cost);
    } else {
      setPaperBalance(prev => prev + cost);
    }
  }, [stocks, paperBalance]);

  // Close position
  const closePosition = useCallback((id: string) => {
    setPositions(prev => {
      const target = prev.find(p => p.id === id);
      if (!target) return prev;

      const pnl = (target.currentPrice - target.entryPrice) * target.shares * (target.type === 'BUY' ? 1 : -1);
      const returnCapital = (target.entryPrice * target.shares) + pnl;
      setPaperBalance(bal => bal + returnCapital);

      return prev.filter(p => p.id !== id);
    });
  }, []);

  // Keyboard shortcut Cmd+K / Ctrl+K for symbol search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
        setIsOrderModalOpen(false);
        setDetailModalSymbol(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const selectedStock = useMemo(() => {
    return stocks.find(s => s.symbol === selectedSymbol) || stocks[0];
  }, [stocks, selectedSymbol]);

  const portfolioValue = useMemo(() => {
    const positionsValue = positions.reduce((acc, pos) => {
      const pnl = (pos.currentPrice - pos.entryPrice) * pos.shares * (pos.type === 'BUY' ? 1 : -1);
      return acc + (pos.entryPrice * pos.shares) + pnl;
    }, 0);
    return paperBalance + positionsValue;
  }, [paperBalance, positions]);

  const totalPnL = useMemo(() => {
    return portfolioValue - 100000.00;
  }, [portfolioValue]);

  return (
    <MarketContext.Provider
      value={{
        stocks,
        indices,
        selectedSymbol,
        setSelectedSymbol,
        activeTab,
        setActiveTab,
        watchlist,
        toggleWatchlist,
        isInWatchlist,
        isLiveFeedActive,
        toggleLiveFeed,
        paperBalance,
        positions,
        openPosition,
        closePosition,
        isSearchOpen,
        setIsSearchOpen,
        isOrderModalOpen,
        setIsOrderModalOpen,
        detailModalSymbol,
        setDetailModalSymbol,
        selectedStock,
        portfolioValue,
        totalPnL,
      }}
    >
      {children}
    </MarketContext.Provider>
  );
};

export const useMarket = () => {
  const context = useContext(MarketContext);
  if (!context) {
    throw new Error('useMarket must be used within a MarketProvider');
  }
  return context;
};
