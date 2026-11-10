import React from 'react';
import { useMarket } from '../context/MarketContext';
import {
  X,
  TrendingUp,
  Bookmark,
  ExternalLink,
  BarChart2,
  ArrowUpRight,
  ArrowDownRight,
  Building,
  Target,
  DollarSign,
  Activity,
  Layers,
} from 'lucide-react';

export const StockDetailModal: React.FC = () => {
  const {
    detailModalSymbol,
    setDetailModalSymbol,
    stocks,
    isInWatchlist,
    toggleWatchlist,
    setSelectedSymbol,
    setActiveTab,
    setIsOrderModalOpen,
  } = useMarket();

  if (!detailModalSymbol) return null;

  const stock = stocks.find(s => s.symbol === detailModalSymbol);
  if (!stock) return null;

  const isPositive = stock.changePercent >= 0;
  const dayRangeSpread = stock.high - stock.low || 1;
  const dayProgress = Math.max(0, Math.min(100, ((stock.price - stock.low) / dayRangeSpread) * 100));

  const weekRangeSpread = stock.week52High - stock.week52Low || 1;
  const weekProgress = Math.max(0, Math.min(100, ((stock.price - stock.week52Low) / weekRangeSpread) * 100));

  const targetPrice = stock.targetPrice || stock.price * 1.15;
  const upsidePct = ((targetPrice - stock.price) / stock.price) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-[#1e222d] border border-[#363a45] rounded-lg max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="p-4 bg-[#181b24] border-b border-[#2a2e39] flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-[#2a2e39] border border-[#363a45] flex items-center justify-center font-bold text-white text-sm font-mono">
              {stock.symbol.slice(0, 3)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white tracking-tight">{stock.symbol}</h2>
                <span className="text-xs px-2 py-0.5 rounded bg-[#131722] text-[#787b86] font-mono border border-[#2a2e39]">
                  {stock.exchange}
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-[#2962ff]/15 text-[#2962ff] font-medium border border-[#2962ff]/30">
                  {stock.sector}
                </span>
              </div>
              <p className="text-xs text-[#787b86] mt-0.5">{stock.name} • {stock.industry}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleWatchlist(stock.symbol)}
              className={`p-1.5 rounded border transition-colors cursor-pointer ${
                isInWatchlist(stock.symbol)
                  ? 'bg-[#2962ff]/20 text-[#2962ff] border-[#2962ff]'
                  : 'bg-[#131722] text-[#787b86] border-[#363a45] hover:text-white'
              }`}
              title={isInWatchlist(stock.symbol) ? 'In Watchlist' : 'Add to Watchlist'}
            >
              <Bookmark className="w-4 h-4 fill-current" />
            </button>
            <button
              onClick={() => setDetailModalSymbol(null)}
              className="p-1.5 rounded bg-[#131722] text-[#787b86] hover:text-white border border-[#363a45] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-5 overflow-y-auto flex flex-col gap-5">
          {/* Main Price & Performance Banner */}
          <div className="bg-[#131722] border border-[#2a2e39] rounded p-4 flex flex-wrap items-baseline justify-between gap-3">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#787b86]">
                Current Real-Time Price
              </span>
              <div className="flex items-baseline gap-3 mt-1">
                <span className="text-2xl sm:text-3xl font-bold text-white font-mono-tabular">
                  ${stock.price.toFixed(2)}
                </span>
                <span
                  className={`text-sm font-mono-tabular font-bold flex items-center px-2 py-0.5 rounded ${
                    isPositive ? 'text-[#089981] bg-[#089981]/15' : 'text-[#f23645] bg-[#f23645]/15'
                  }`}
                >
                  {isPositive ? (
                    <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 stroke-[2.5]" />
                  )}
                  {isPositive ? '+' : ''}${stock.change.toFixed(2)} ({isPositive ? '+' : ''}
                  {stock.changePercent.toFixed(2)}%)
                </span>
              </div>
            </div>

            {/* Analyst Target */}
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#787b86]">
                Consensus 12M Target
              </span>
              <div className="flex items-baseline justify-end gap-1.5 mt-1">
                <span className="text-lg font-bold text-white font-mono-tabular">
                  ${targetPrice.toFixed(2)}
                </span>
                <span className="text-xs text-[#089981] font-mono-tabular font-medium">
                  (+{upsidePct.toFixed(1)}% upside)
                </span>
              </div>
            </div>
          </div>

          {/* Range Gauges (Day & 52-Week) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Day Range */}
            <div className="bg-[#131722] border border-[#2a2e39] rounded p-3">
              <div className="flex justify-between text-xs text-[#787b86] mb-1.5">
                <span>Day's Range</span>
                <span className="font-mono-tabular text-white font-medium">
                  ${stock.low.toFixed(2)} - ${stock.high.toFixed(2)}
                </span>
              </div>
              <div className="relative w-full bg-[#2a2e39] h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[#2962ff] h-full rounded-full transition-all"
                  style={{ width: `${dayProgress}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-[10px] text-[#787b86] font-mono-tabular mt-1">
                <span>Low: ${stock.low.toFixed(2)}</span>
                <span>High: ${stock.high.toFixed(2)}</span>
              </div>
            </div>

            {/* 52-Week Range */}
            <div className="bg-[#131722] border border-[#2a2e39] rounded p-3">
              <div className="flex justify-between text-xs text-[#787b86] mb-1.5">
                <span>52-Week Range</span>
                <span className="font-mono-tabular text-white font-medium">
                  ${stock.week52Low.toFixed(2)} - ${stock.week52High.toFixed(2)}
                </span>
              </div>
              <div className="relative w-full bg-[#2a2e39] h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[#089981] h-full rounded-full transition-all"
                  style={{ width: `${weekProgress}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-[10px] text-[#787b86] font-mono-tabular mt-1">
                <span>52W Low: ${stock.week52Low.toFixed(2)}</span>
                <span>52W High: ${stock.week52High.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Key Financial Metrics Grid */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-[#2962ff]" />
              Key Financial Metrics & Ratios
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="bg-[#131722] border border-[#2a2e39] p-2.5 rounded">
                <span className="text-[#787b86] text-[11px]">Market Cap</span>
                <div className="font-mono-tabular font-bold text-white mt-0.5">
                  ${stock.marketCap >= 1000 ? `${(stock.marketCap / 1000).toFixed(2)}T` : `${stock.marketCap}B`}
                </div>
              </div>
              <div className="bg-[#131722] border border-[#2a2e39] p-2.5 rounded">
                <span className="text-[#787b86] text-[11px]">P/E Ratio (TTM)</span>
                <div className="font-mono-tabular font-bold text-white mt-0.5">
                  {stock.peRatio ? stock.peRatio.toFixed(1) : '—'}
                </div>
              </div>
              <div className="bg-[#131722] border border-[#2a2e39] p-2.5 rounded">
                <span className="text-[#787b86] text-[11px]">EPS (TTM)</span>
                <div className="font-mono-tabular font-bold text-white mt-0.5">
                  {stock.eps ? `$${stock.eps.toFixed(2)}` : '—'}
                </div>
              </div>
              <div className="bg-[#131722] border border-[#2a2e39] p-2.5 rounded">
                <span className="text-[#787b86] text-[11px]">Dividend Yield</span>
                <div className="font-mono-tabular font-bold text-white mt-0.5">
                  {stock.dividendYield ? `${stock.dividendYield.toFixed(2)}%` : '0.00%'}
                </div>
              </div>
              <div className="bg-[#131722] border border-[#2a2e39] p-2.5 rounded">
                <span className="text-[#787b86] text-[11px]">Beta (1Y)</span>
                <div className="font-mono-tabular font-bold text-white mt-0.5">
                  {stock.beta ? stock.beta.toFixed(2) : '1.00'}
                </div>
              </div>
              <div className="bg-[#131722] border border-[#2a2e39] p-2.5 rounded">
                <span className="text-[#787b86] text-[11px]">Volume (Today)</span>
                <div className="font-mono-tabular font-bold text-white mt-0.5">
                  {(stock.volume / 1000000).toFixed(2)}M
                </div>
              </div>
              <div className="bg-[#131722] border border-[#2a2e39] p-2.5 rounded">
                <span className="text-[#787b86] text-[11px]">Avg Volume (30D)</span>
                <div className="font-mono-tabular font-bold text-white mt-0.5">
                  {(stock.avgVolume / 1000000).toFixed(2)}M
                </div>
              </div>
              <div className="bg-[#131722] border border-[#2a2e39] p-2.5 rounded">
                <span className="text-[#787b86] text-[11px]">Consensus Rating</span>
                <div className="font-semibold text-[#089981] mt-0.5">
                  {stock.recommendation || 'Buy'}
                </div>
              </div>
            </div>
          </div>

          {/* Company Overview Narrative */}
          {stock.description && (
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-[#2962ff]" />
                About Company
              </h4>
              <p className="text-xs text-[#d1d4dc] leading-relaxed bg-[#131722] border border-[#2a2e39] p-3 rounded">
                {stock.description}
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="p-3 bg-[#181b24] border-t border-[#2a2e39] flex items-center justify-between gap-3">
          <button
            onClick={() => {
              setSelectedSymbol(stock.symbol);
              setActiveTab('chart');
              setDetailModalSymbol(null);
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#131722] hover:bg-[#2a2e39] text-[#d1d4dc] hover:text-white rounded text-xs font-semibold border border-[#363a45] transition-colors cursor-pointer"
          >
            <BarChart2 className="w-4 h-4 text-[#2962ff]" />
            <span>Launch Superchart</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setSelectedSymbol(stock.symbol);
                setDetailModalSymbol(null);
                setIsOrderModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-5 py-2 bg-[#2962ff] hover:bg-[#1e53e5] text-white rounded text-xs font-bold transition-colors cursor-pointer shadow-sm"
            >
              <TrendingUp className="w-4 h-4" />
              <span>Trade {stock.symbol}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
