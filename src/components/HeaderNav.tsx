import React from 'react';
import { useMarket } from '../context/MarketContext';
import { ActiveTab } from '../types/market';
import {
  Search,
  Activity,
  BarChart2,
  Grid3X3,
  ListFilter,
  Calendar,
  Newspaper,
  Bookmark,
  TrendingUp,
  CircleDollarSign,
  Play,
  Pause,
} from 'lucide-react';

export const HeaderNav: React.FC<{
  isWatchlistOpen: boolean;
  setIsWatchlistOpen: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ isWatchlistOpen, setIsWatchlistOpen }) => {
  const {
    activeTab,
    setActiveTab,
    setIsSearchOpen,
    isLiveFeedActive,
    toggleLiveFeed,
    portfolioValue,
    totalPnL,
    watchlist,
    setIsOrderModalOpen,
  } = useMarket();

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview', icon: <Activity className="w-3.5 h-3.5" /> },
    { id: 'chart', label: 'Superchart', icon: <BarChart2 className="w-3.5 h-3.5" /> },
    { id: 'heatmap', label: 'Heatmap', icon: <Grid3X3 className="w-3.5 h-3.5" /> },
    { id: 'screener', label: 'Screener', icon: <ListFilter className="w-3.5 h-3.5" /> },
    { id: 'earnings', label: 'Earnings', icon: <Calendar className="w-3.5 h-3.5" /> },
    { id: 'news', label: 'News', icon: <Newspaper className="w-3.5 h-3.5" /> },
  ];

  const isProfitable = totalPnL >= 0;

  return (
    <header className="bg-[#1e222d] border-b border-[#2a2e39] sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 flex items-center justify-between h-13 gap-2">
        {/* Left: Brand & Logo */}
        <div className="flex items-center gap-4 shrink-0">
          <div
            onClick={() => setActiveTab('overview')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            {/* TradingView-style geometric geometric logo */}
            <div className="w-7 h-7 bg-[#2962ff] rounded flex items-center justify-center shadow-sm group-hover:bg-[#1e53e5] transition-colors">
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white" aria-hidden="true">
                <path d="M4 18h3V6H4v12zm6.5 0h3V10h-3v8zm6.5 0h3V2h-3v16z" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-white text-sm tracking-tight leading-none group-hover:text-[#2962ff] transition-colors">
                MARKET<span className="text-[#2962ff]">FLOW</span>
              </span>
              <span className="text-[10px] text-[#787b86] font-medium tracking-wider uppercase leading-tight">
                TradingView Markets
              </span>
            </div>
          </div>

          {/* Quick Search Input Trigger */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="hidden md:flex items-center gap-2 bg-[#131722] hover:bg-[#2a2e39] text-[#787b86] hover:text-[#d1d4dc] border border-[#363a45] rounded px-2.5 py-1.5 text-xs transition-colors cursor-pointer w-44 lg:w-56"
          >
            <Search className="w-3.5 h-3.5 text-[#787b86]" />
            <span className="truncate">Search symbol (e.g. NVDA)...</span>
            <kbd className="ml-auto bg-[#1e222d] px-1.5 py-0.5 rounded text-[10px] text-[#787b86] border border-[#363a45] font-mono">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Center: Main Screen Navigation Pills */}
        <nav className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1">
          {navItems.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 h-7 text-xs font-medium rounded-full transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-[#2962ff] text-white border border-[#2962ff] shadow-sm'
                    : 'text-[#787b86] hover:text-[#ffffff] hover:bg-[#2a2e39] border border-transparent'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right: Telemetry & Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Mobile search trigger */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="md:hidden p-1.5 text-[#787b86] hover:text-white rounded hover:bg-[#2a2e39]"
            title="Search Symbol (⌘K)"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Market Status Pill */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#131722] border border-[#363a45] text-[11px]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#089981] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#089981]"></span>
            </span>
            <span className="text-[#089981] font-semibold text-[10px] tracking-wider uppercase">
              US MARKET OPEN
            </span>
          </div>

          {/* Live Feed Toggle */}
          <button
            onClick={toggleLiveFeed}
            className={`hidden sm:flex items-center gap-1 px-2 py-1 rounded text-[11px] font-mono-tabular border transition-colors cursor-pointer ${
              isLiveFeedActive
                ? 'bg-[#131722] border-[#2a2e39] text-[#089981] hover:bg-[#2a2e39]'
                : 'bg-[#2a2e39] border-[#363a45] text-[#787b86]'
            }`}
            title={isLiveFeedActive ? 'Pause simulated live ticks' : 'Resume simulated live ticks'}
          >
            {isLiveFeedActive ? (
              <>
                <Pause className="w-3 h-3 text-[#089981]" />
                <span className="text-[10px] font-semibold text-[#089981]">LIVE</span>
              </>
            ) : (
              <>
                <Play className="w-3 h-3 text-[#787b86]" />
                <span className="text-[10px] text-[#787b86]">PAUSED</span>
              </>
            )}
          </button>

          {/* Paper Trading Portfolio Balance */}
          <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#131722] border border-[#2a2e39] text-xs">
            <CircleDollarSign className="w-3.5 h-3.5 text-[#2962ff]" />
            <span className="text-[#787b86] text-[11px]">Paper:</span>
            <span className="text-white font-mono-tabular font-medium">
              ${portfolioValue.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </span>
            <span
              className={`text-[10px] font-mono-tabular px-1 rounded ${
                isProfitable ? 'text-[#089981] bg-[#089981]/15' : 'text-[#f23645] bg-[#f23645]/15'
              }`}
            >
              {isProfitable ? '+' : ''}
              {totalPnL >= 0 ? '+' : ''}${totalPnL.toFixed(0)}
            </span>
          </div>

          {/* Watchlist Drawer Button */}
          <button
            onClick={() => setIsWatchlistOpen(prev => !prev)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs border transition-colors cursor-pointer ${
              isWatchlistOpen
                ? 'bg-[#2962ff]/20 text-[#2962ff] border-[#2962ff]'
                : 'bg-[#131722] text-[#d1d4dc] border-[#363a45] hover:bg-[#2a2e39]'
            }`}
            title="Toggle Watchlist Panel"
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Watchlist</span>
            <span className="bg-[#2a2e39] text-[#d1d4dc] text-[10px] font-mono px-1.5 py-0.2 rounded-full">
              {watchlist.length}
            </span>
          </button>

          {/* Quick Order Button */}
          <button
            onClick={() => setIsOrderModalOpen(true)}
            className="flex items-center gap-1 px-3 py-1 bg-[#2962ff] hover:bg-[#1e53e5] active:bg-[#1848cc] text-white text-xs font-semibold rounded transition-colors cursor-pointer shadow-sm"
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Trade</span>
          </button>
        </div>
      </div>
    </header>
  );
};
