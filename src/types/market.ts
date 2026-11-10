export interface StockQuote {
  symbol: string;
  name: string;
  exchange: 'NASDAQ' | 'NYSE' | 'AMEX' | 'INDEX' | 'CRYPTO';
  sector: string;
  industry: string;
  price: number;
  change: number;
  changePercent: number;
  open: number;
  high: number;
  low: number;
  previousClose: number;
  volume: number;
  avgVolume: number;
  marketCap: number; // in billions
  peRatio?: number;
  eps?: number;
  dividendYield?: number; // percentage
  beta?: number;
  week52High: number;
  week52Low: number;
  sparkline: number[];
  recommendation?: 'Strong Buy' | 'Buy' | 'Hold' | 'Underperform' | 'Sell';
  targetPrice?: number;
  description?: string;
  lastTickDirection?: 'up' | 'down' | 'none';
  lastTickTime?: number;
}

export interface Candle {
  time: string;
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface MarketIndex {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  sparkline: number[];
}

export interface SectorPerformance {
  name: string;
  changePercent: number;
  marketCapBillions: number;
  leadingStock: string;
  color: string;
}

export interface NewsItem {
  id: string;
  headline: string;
  source: string;
  timestamp: string;
  relatedSymbols: string[];
  sentiment: 'bullish' | 'bearish' | 'neutral';
  readTime: string;
  summary: string;
}

export interface EarningsRelease {
  symbol: string;
  name: string;
  reportDate: string;
  timeOfDay: 'Before Open' | 'After Close';
  epsEstimate: number;
  epsActual?: number;
  revEstimate: string;
  revActual?: string;
  marketCap: string;
}

export interface Position {
  id: string;
  symbol: string;
  type: 'BUY' | 'SELL';
  shares: number;
  entryPrice: number;
  currentPrice: number;
  stopLoss?: number;
  takeProfit?: number;
  timestamp: number;
}

export type Timeframe = '1D' | '5D' | '1M' | '3M' | '1Y' | '5Y' | 'ALL';
export type ChartType = 'candlestick' | 'area' | 'line';
export type ActiveTab = 'overview' | 'chart' | 'heatmap' | 'screener' | 'earnings' | 'news';
