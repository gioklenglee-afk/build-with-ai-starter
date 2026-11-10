import React, { useState } from 'react';
import { useMarket } from '../context/MarketContext';
import {
  Bookmark,
  Briefcase,
  X,
  Plus,
  Trash2,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  CircleDollarSign,
} from 'lucide-react';

export const WatchlistSidebar: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const {
    stocks,
    watchlist,
    toggleWatchlist,
    setSelectedSymbol,
    selectedSymbol,
    positions,
    closePosition,
    paperBalance,
    portfolioValue,
    totalPnL,
    setIsOrderModalOpen,
    setIsSearchOpen,
    setActiveTab,
  } = useMarket();

  const [sidebarTab, setSidebarTab] = useState<'watchlist' | 'positions'>('watchlist');

  if (!isOpen) return null;

  // Filter stocks in watchlist
  const watchlistStocks = stocks.filter(s => watchlist.includes(s.symbol));

  const isProfitable = totalPnL >= 0;

  return (
    <div className="fixed inset-y-0 right-0 w-80 sm:w-88 bg-[#1e222d] border-l border-[#2a2e39] z-40 shadow-2xl flex flex-col pt-13">
      {/* Top Header */}
      <div className="p-3 border-b border-[#2a2e39] flex items-center justify-between bg-[#181b24]">
        {/* Tab switch */}
        <div className="flex items-center gap-1 bg-[#131722] p-0.5 rounded border border-[#2a2e39]">
          <button
            onClick={() => setSidebarTab('watchlist')}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded cursor-pointer transition-colors ${
              sidebarTab === 'watchlist'
                ? 'bg-[#2a2e39] text-white shadow-xs'
                : 'text-[#787b86] hover:text-[#d1d4dc]'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Watchlist ({watchlist.length})</span>
          </button>
          <button
            onClick={() => setSidebarTab('positions')}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded cursor-pointer transition-colors ${
              sidebarTab === 'positions'
                ? 'bg-[#2a2e39] text-white shadow-xs'
                : 'text-[#787b86] hover:text-[#d1d4dc]'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Positions ({positions.length})</span>
          </button>
        </div>

        <button
          onClick={onClose}
          className="p-1 rounded text-[#787b86] hover:text-white hover:bg-[#2a2e39] cursor-pointer"
          title="Close Panel"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Content Area */}
      {sidebarTab === 'watchlist' ? (
        <div className="flex-1 overflow-y-auto flex flex-col divide-y divide-[#2a2e39]/60">
          {/* Quick add symbol button */}
          <div className="p-2 bg-[#131722] border-b border-[#2a2e39]">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="w-full flex items-center justify-center gap-1.5 py-1.5 bg-[#1e222d] hover:bg-[#2a2e39] text-[#787b86] hover:text-white rounded border border-[#363a45] text-xs font-medium cursor-pointer transition-colors"
            >
              <Plus className="w-3.5 h-3.5 text-[#2962ff]" />
              <span>Add Symbol to Watchlist</span>
            </button>
          </div>

          {watchlistStocks.length === 0 ? (
            <div className="p-6 text-center text-xs text-[#787b86]">
              Your watchlist is currently empty. Star symbols in the table or click Add Symbol above!
            </div>
          ) : (
            watchlistStocks.map(stock => {
              const isPositive = stock.changePercent >= 0;
              const isSelected = selectedSymbol === stock.symbol;

              return (
                <div
                  key={stock.symbol}
                  onClick={() => setSelectedSymbol(stock.symbol)}
                  className={`p-2.5 flex items-center justify-between cursor-pointer transition-colors group ${
                    isSelected ? 'bg-[#2a2e39]/80 border-l-2 border-[#2962ff]' : 'hover:bg-[#2a2e39]/40'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded bg-[#131722] border border-[#2a2e39] flex items-center justify-center font-bold text-white text-[11px] font-mono">
                      {stock.symbol.slice(0, 2)}
                    </div>
                    <div>
                      <div className="font-bold text-xs text-white group-hover:text-[#2962ff] flex items-center gap-1">
                        <span>{stock.symbol}</span>
                        <span className="text-[9px] text-[#787b86] font-mono">
                          {stock.exchange}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#787b86] truncate max-w-[110px]">
                        {stock.name}
                      </p>
                    </div>
                  </div>

                  {/* Price & Change badge */}
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <div className="font-mono-tabular text-xs font-semibold text-white">
                        ${stock.price.toFixed(2)}
                      </div>
                      <div
                        className={`text-[10px] font-mono-tabular font-medium flex items-center justify-end ${
                          isPositive ? 'text-[#089981]' : 'text-[#f23645]'
                        }`}
                      >
                        {isPositive ? '+' : ''}
                        {stock.changePercent.toFixed(2)}%
                      </div>
                    </div>

                    <button
                      onClick={e => {
                        e.stopPropagation();
                        toggleWatchlist(stock.symbol);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 text-[#787b86] hover:text-[#f23645] transition-opacity cursor-pointer"
                      title="Remove from Watchlist"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      ) : (
        /* Paper Trading Positions Tab */
        <div className="flex-1 overflow-y-auto flex flex-col">
          {/* Portfolio Summary Card */}
          <div className="p-3 bg-[#131722] border-b border-[#2a2e39] flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs text-[#787b86]">
              <span>Paper Trading Account</span>
              <span className="text-[#089981] font-mono">Simulated</span>
            </div>
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#787b86]">
                  Total Value
                </span>
                <div className="text-lg font-bold text-white font-mono-tabular">
                  ${portfolioValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase tracking-wider text-[#787b86]">
                  All-Time P&L
                </span>
                <div
                  className={`text-sm font-bold font-mono-tabular flex items-center justify-end ${
                    isProfitable ? 'text-[#089981]' : 'text-[#f23645]'
                  }`}
                >
                  {isProfitable ? (
                    <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
                  ) : (
                    <ArrowDownRight className="w-3.5 h-3.5 stroke-[2.5]" />
                  )}
                  {isProfitable ? '+' : ''}${totalPnL.toFixed(2)}
                </div>
              </div>
            </div>
            <div className="pt-2 border-t border-[#2a2e39]/60 flex items-center justify-between text-[11px] text-[#787b86] font-mono-tabular">
              <span>Cash Available:</span>
              <span className="text-white">${paperBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>

          {/* Active Positions List */}
          <div className="flex-1 overflow-y-auto divide-y divide-[#2a2e39]/60">
            {positions.length === 0 ? (
              <div className="p-6 text-center text-xs text-[#787b86]">
                No active positions. Execute a trade from the Superchart or click Trade button!
              </div>
            ) : (
              positions.map(pos => {
                const pnl = (pos.currentPrice - pos.entryPrice) * pos.shares * (pos.type === 'BUY' ? 1 : -1);
                const pnlPct = ((pos.currentPrice - pos.entryPrice) / pos.entryPrice) * 100 * (pos.type === 'BUY' ? 1 : -1);
                const isWin = pnl >= 0;

                return (
                  <div key={pos.id} className="p-3 bg-[#1e222d] hover:bg-[#2a2e39]/40 flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-xs">{pos.symbol}</span>
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.2 rounded font-mono uppercase ${
                            pos.type === 'BUY' ? 'bg-[#089981]/20 text-[#089981]' : 'bg-[#f23645]/20 text-[#f23645]'
                          }`}
                        >
                          {pos.type} {pos.shares}x
                        </span>
                      </div>

                      <div
                        className={`text-xs font-mono-tabular font-bold ${
                          isWin ? 'text-[#089981]' : 'text-[#f23645]'
                        }`}
                      >
                        {isWin ? '+' : ''}${pnl.toFixed(2)} ({isWin ? '+' : ''}
                        {pnlPct.toFixed(2)}%)
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-[#787b86] font-mono-tabular">
                      <span>Entry: ${pos.entryPrice.toFixed(2)}</span>
                      <span>Now: ${pos.currentPrice.toFixed(2)}</span>
                      <button
                        onClick={() => closePosition(pos.id)}
                        className="px-2 py-0.5 bg-[#2a2e39] hover:bg-[#f23645] hover:text-white text-[#d1d4dc] rounded text-[10px] font-medium transition-colors cursor-pointer border border-[#363a45]"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Bottom Action Footer */}
      <div className="p-3 bg-[#181b24] border-t border-[#2a2e39] flex items-center justify-between gap-2">
        <button
          onClick={() => {
            setActiveTab('chart');
            onClose();
          }}
          className="flex-1 py-1.5 bg-[#131722] hover:bg-[#2a2e39] text-[#d1d4dc] text-xs font-medium rounded border border-[#363a45] transition-colors cursor-pointer text-center"
        >
          View Active Chart
        </button>
        <button
          onClick={() => setIsOrderModalOpen(true)}
          className="flex-1 py-1.5 bg-[#2962ff] hover:bg-[#1e53e5] text-white text-xs font-bold rounded transition-colors cursor-pointer text-center"
        >
          New Order
        </button>
      </div>
    </div>
  );
};
