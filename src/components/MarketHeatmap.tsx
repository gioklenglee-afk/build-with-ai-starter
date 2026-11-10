import React, { useState, useMemo } from 'react';
import { useMarket } from '../context/MarketContext';
import { StockQuote } from '../types/market';
import {
  Grid,
  Maximize2,
  TrendingUp,
  Info,
  ArrowUpRight,
  ArrowDownRight,
  ExternalLink,
} from 'lucide-react';

export const MarketHeatmap: React.FC = () => {
  const { stocks, setSelectedSymbol, setDetailModalSymbol, setActiveTab } = useMarket();
  const [selectedSector, setSelectedSector] = useState<string>('All');
  const [hoveredStock, setHoveredStock] = useState<StockQuote | null>(null);

  // Group stocks by sector
  const sectors = useMemo(() => {
    const list = Array.from(new Set(stocks.map(s => s.sector)));
    return ['All', ...list];
  }, [stocks]);

  const displayedStocks = useMemo(() => {
    if (selectedSector === 'All') return stocks;
    return stocks.filter(s => s.sector === selectedSector);
  }, [stocks, selectedSector]);

  // Group stocks into sectors for visual treemap clustering
  const groupedBySector = useMemo(() => {
    const map: Record<string, StockQuote[]> = {};
    displayedStocks.forEach(s => {
      if (!map[s.sector]) map[s.sector] = [];
      map[s.sector].push(s);
    });
    // Sort stocks in each sector by market cap descending
    Object.keys(map).forEach(sec => {
      map[sec].sort((a, b) => b.marketCap - a.marketCap);
    });
    return map;
  }, [displayedStocks]);

  // Helper to get background color based on % change
  const getTileBg = (pct: number) => {
    if (pct >= 5) return 'bg-[#089981] text-white';
    if (pct >= 3) return 'bg-[#059669] text-white';
    if (pct >= 1.5) return 'bg-[#10b981]/90 text-white';
    if (pct > 0.3) return 'bg-[#065f46] text-emerald-100';
    if (pct >= -0.3) return 'bg-[#2a2e39] text-[#d1d4dc]';
    if (pct > -1.5) return 'bg-[#991b1b] text-red-100';
    if (pct > -3) return 'bg-[#dc2626] text-white';
    return 'bg-[#f23645] text-white';
  };

  return (
    <div className="bg-[#1e222d] border border-[#2a2e39] rounded overflow-hidden flex flex-col">
      {/* Heatmap Header & Sector Filter Bar */}
      <div className="p-3 border-b border-[#2a2e39] flex flex-wrap items-center justify-between gap-3 bg-[#181b24]">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-[#2962ff]/20 text-[#2962ff] flex items-center justify-center">
            <Grid className="w-3.5 h-3.5" />
          </div>
          <span className="text-sm font-bold text-white tracking-tight">
            S&P 500 Market Heatmap
          </span>
          <span className="text-xs text-[#787b86] hidden sm:inline">
            Size by Market Cap • Color by 1D Performance
          </span>
        </div>

        {/* Sector Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {sectors.map(sec => (
            <button
              key={sec}
              onClick={() => setSelectedSector(sec)}
              className={`h-6 px-2.5 text-xs font-medium rounded transition-colors cursor-pointer whitespace-nowrap ${
                selectedSector === sec
                  ? 'bg-[#2962ff] text-white font-semibold'
                  : 'text-[#787b86] hover:text-[#d1d4dc] bg-[#131722] border border-[#2a2e39]'
              }`}
            >
              {sec}
            </button>
          ))}
        </div>
      </div>

      {/* Heatmap Legend Bar */}
      <div className="px-3 py-1.5 bg-[#131722] border-b border-[#2a2e39] flex items-center justify-between text-[11px] text-[#787b86]">
        <span className="hidden sm:inline">Click any stock to inspect chart & financial ratios</span>
        <div className="flex items-center gap-1 ml-auto">
          <span>-5%</span>
          <div className="flex h-3 rounded overflow-hidden border border-[#363a45]">
            <span className="w-4 bg-[#f23645]"></span>
            <span className="w-4 bg-[#dc2626]"></span>
            <span className="w-4 bg-[#991b1b]"></span>
            <span className="w-4 bg-[#2a2e39]"></span>
            <span className="w-4 bg-[#065f46]"></span>
            <span className="w-4 bg-[#10b981]"></span>
            <span className="w-4 bg-[#089981]"></span>
          </div>
          <span>+5%</span>
        </div>
      </div>

      {/* Treemap Container */}
      <div className="p-3 bg-[#131722] min-h-[460px] flex flex-col gap-3">
        {Object.entries(groupedBySector).map(([sectorName, sectorStocks]) => {
          // Total sector weight
          const totalSectorCap = sectorStocks.reduce((sum, s) => sum + s.marketCap, 0);

          return (
            <div
              key={sectorName}
              className="bg-[#181b24] border border-[#2a2e39] rounded p-2 flex flex-col gap-1.5"
            >
              {/* Sector Header */}
              <div className="flex items-center justify-between text-xs text-[#787b86] px-1 font-semibold uppercase tracking-wider">
                <span className="text-white text-[11px] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-xs bg-[#2962ff]"></span>
                  {sectorName}
                </span>
                <span className="text-[10px] font-mono-tabular">
                  ${(totalSectorCap / 1000).toFixed(2)}T Cap • {sectorStocks.length} Stocks
                </span>
              </div>

              {/* Responsive Treemap Tile Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-1.5">
                {sectorStocks.map(stock => {
                  const isPositive = stock.changePercent >= 0;
                  const isLarge = stock.marketCap >= 1000;
                  const isMedium = stock.marketCap >= 300 && stock.marketCap < 1000;

                  // Span columns based on market cap dominance
                  const colSpanClass = isLarge
                    ? 'col-span-2 row-span-2 min-h-[105px]'
                    : isMedium
                    ? 'col-span-2 min-h-[75px]'
                    : 'col-span-1 min-h-[65px]';

                  return (
                    <div
                      key={stock.symbol}
                      onClick={() => setSelectedSymbol(stock.symbol)}
                      onMouseEnter={() => setHoveredStock(stock)}
                      onMouseLeave={() => setHoveredStock(null)}
                      className={`${colSpanClass} ${getTileBg(
                        stock.changePercent
                      )} rounded p-2 flex flex-col justify-between cursor-pointer transition-all duration-150 hover:scale-[1.02] hover:z-10 shadow-xs relative group border border-black/20`}
                    >
                      {/* Top row: Symbol & Details button */}
                      <div className="flex items-start justify-between w-full">
                        <span className="font-bold text-xs sm:text-sm tracking-tight font-sans drop-shadow-xs">
                          {stock.symbol}
                        </span>
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            setDetailModalSymbol(stock.symbol);
                          }}
                          className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-black/20 transition-opacity"
                          title="View Full Profile"
                        >
                          <ExternalLink className="w-3 h-3 text-white" />
                        </button>
                      </div>

                      {/* Middle row: Price & % Change */}
                      <div className="flex flex-col">
                        <span className="text-[11px] sm:text-xs font-mono-tabular font-semibold leading-tight drop-shadow-xs">
                          {isPositive ? '+' : ''}
                          {stock.changePercent.toFixed(2)}%
                        </span>
                        <span className="text-[10px] sm:text-[11px] font-mono-tabular opacity-90 leading-tight">
                          ${stock.price.toFixed(2)}
                        </span>
                      </div>

                      {/* Bottom row: Name or Market Cap for larger tiles */}
                      {isLarge && (
                        <div className="text-[10px] truncate opacity-80 pt-1 border-t border-white/20">
                          {stock.name}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Hover Information Tooltip Footer */}
      {hoveredStock && (
        <div className="p-2.5 bg-[#1e222d] border-t border-[#2a2e39] flex flex-wrap items-center justify-between text-xs gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">{hoveredStock.symbol}</span>
            <span className="text-[#787b86]">{hoveredStock.name}</span>
            <span className="text-[10px] font-mono bg-[#2a2e39] px-1.5 py-0.5 rounded text-[#d1d4dc]">
              {hoveredStock.sector}
            </span>
          </div>

          <div className="flex items-center gap-4 font-mono-tabular text-[#d1d4dc]">
            <span>
              Price: <strong className="text-white">${hoveredStock.price.toFixed(2)}</strong>
            </span>
            <span>
              P/E: <strong className="text-white">{hoveredStock.peRatio || 'N/A'}</strong>
            </span>
            <span>
              Mkt Cap: <strong className="text-white">${hoveredStock.marketCap}B</strong>
            </span>
            <span>
              52W Range: <strong className="text-white">${hoveredStock.week52Low} - ${hoveredStock.week52High}</strong>
            </span>
          </div>

          <button
            onClick={() => {
              setSelectedSymbol(hoveredStock.symbol);
              setActiveTab('chart');
            }}
            className="px-2.5 py-1 bg-[#2962ff] text-white rounded text-[11px] font-semibold hover:bg-[#1e53e5] cursor-pointer"
          >
            Launch Superchart
          </button>
        </div>
      )}
    </div>
  );
};
