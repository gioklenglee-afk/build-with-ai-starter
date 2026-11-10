import React, { useState } from 'react';
import { MarketProvider, useMarket } from './context/MarketContext';
import { TickerTape } from './components/TickerTape';
import { HeaderNav } from './components/HeaderNav';
import { IndicesOverview } from './components/IndicesOverview';
import { SuperChart } from './components/SuperChart';
import { SectorPerformanceRibbon } from './components/SectorPerformanceRibbon';
import { QuotesTable } from './components/QuotesTable';
import { MarketHeatmap } from './components/MarketHeatmap';
import { EarningsCalendar } from './components/EarningsCalendar';
import { MarketNews } from './components/MarketNews';
import { WatchlistSidebar } from './components/WatchlistSidebar';
import { StockDetailModal } from './components/StockDetailModal';
import { SymbolSearchModal } from './components/SymbolSearchModal';
import { OrderModal } from './components/OrderModal';
import {
  TrendingUp,
  Activity,
  Layers,
  BarChart2,
  ListFilter,
  Grid,
  ShieldCheck,
  Zap,
} from 'lucide-react';

const MarketAppContent: React.FC = () => {
  const { activeTab, selectedSymbol } = useMarket();
  const [isWatchlistOpen, setIsWatchlistOpen] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-[#131722] text-[#d1d4dc] flex flex-col font-sans selection:bg-[#2962ff]/30 selection:text-white">
      {/* 1. Ticker Tape Top Marquee */}
      <TickerTape />

      {/* 2. Main Navigation Header */}
      <HeaderNav
        isWatchlistOpen={isWatchlistOpen}
        setIsWatchlistOpen={setIsWatchlistOpen}
      />

      {/* 3. Screen Views based on activeTab */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-4 py-3 sm:py-4 flex flex-col gap-4">
        {/* VIEW 1: MARKETS OVERVIEW (Flagship TradingView Markets Screen) */}
        {activeTab === 'overview' && (
          <div className="flex flex-col gap-4">
            {/* Top benchmark indices cards */}
            <IndicesOverview />

            {/* Split row: Featured Superchart + Quick Screener */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* Chart panel */}
              <div className="lg:col-span-8 flex flex-col gap-2">
                <SuperChart compact={false} />
              </div>

              {/* Side Widget: Sector Performance & News snapshot */}
              <div className="lg:col-span-4 flex flex-col gap-4">
                <div className="bg-[#1e222d] border border-[#2a2e39] rounded p-3 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-[#2962ff]" />
                      Market Summary
                    </span>
                    <span className="text-[10px] text-[#089981] font-mono font-semibold">
                      BULLISH BIAS
                    </span>
                  </div>
                  <p className="text-xs text-[#787b86] leading-relaxed">
                    S&P 500 tests fresh record levels above 5,980 anchored by mega-cap semiconductor demand, lower volatility index (VIX: 14.2), and treasury yields consolidating near 4.41%.
                  </p>
                  <div className="pt-2 border-t border-[#2a2e39] flex items-center justify-between text-[11px] text-[#787b86]">
                    <span>Advancing: <strong className="text-[#089981]">342</strong></span>
                    <span>Declining: <strong className="text-[#f23645]">158</strong></span>
                    <span>Total Vol: <strong className="text-white">3.4B</strong></span>
                  </div>
                </div>

                {/* News snapshot */}
                <div className="flex-1">
                  <MarketNews />
                </div>
              </div>
            </div>

            {/* 1D Sector Performance Ribbon */}
            <SectorPerformanceRibbon />

            {/* Full Stock Quotes Table Screener */}
            <QuotesTable />
          </div>
        )}

        {/* VIEW 2: SUPERCHART FULL VIEW */}
        {activeTab === 'chart' && (
          <div className="flex flex-col gap-4">
            <SuperChart compact={false} />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2">
                <QuotesTable />
              </div>
              <div className="lg:col-span-1">
                <MarketNews />
              </div>
            </div>
          </div>
        )}

        {/* VIEW 3: S&P 500 HEATMAP */}
        {activeTab === 'heatmap' && (
          <div className="flex flex-col gap-4">
            <MarketHeatmap />
          </div>
        )}

        {/* VIEW 4: STOCK SCREENER */}
        {activeTab === 'screener' && (
          <div className="flex flex-col gap-4">
            <QuotesTable />
          </div>
        )}

        {/* VIEW 5: EARNINGS CALENDAR */}
        {activeTab === 'earnings' && (
          <div className="flex flex-col gap-4">
            <EarningsCalendar />
          </div>
        )}

        {/* VIEW 6: MARKET NEWS */}
        {activeTab === 'news' && (
          <div className="flex flex-col gap-4">
            <MarketNews />
          </div>
        )}
      </main>

      {/* 4. Watchlist & Paper Trading Sidebar */}
      <WatchlistSidebar
        isOpen={isWatchlistOpen}
        onClose={() => setIsWatchlistOpen(false)}
      />

      {/* 5. Modals & Dialogs */}
      <StockDetailModal />
      <SymbolSearchModal />
      <OrderModal />

      {/* 6. Institutional Footer */}
      <footer className="mt-auto bg-[#181b24] border-t border-[#2a2e39] py-3 text-xs text-[#787b86]">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#089981]" />
            <span>TradingView Market Feed • Live Sub-Second Real-Time Ticks Simulated</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-mono-tabular">
            <span>NYSE / NASDAQ Data</span>
            <span className="text-[#363a45]">•</span>
            <span>Latency: 14ms</span>
            <span className="text-[#363a45]">•</span>
            <span>Press <kbd className="bg-[#131722] px-1 py-0.5 rounded border border-[#363a45]">⌘K</kbd> to search</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <MarketProvider>
      <MarketAppContent />
    </MarketProvider>
  );
}
