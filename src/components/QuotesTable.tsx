import React, { useState, useMemo } from 'react';
import { useMarket } from '../context/MarketContext';
import { StockQuote } from '../types/market';
import {
  ArrowUpRight,
  ArrowDownRight,
  ArrowUpDown,
  Bookmark,
  ExternalLink,
  Search,
  Filter,
} from 'lucide-react';

type ScreenerFilter = 'all' | 'active' | 'gainers' | 'losers' | 'megacap' | 'tech';
type SortField = 'symbol' | 'price' | 'changePercent' | 'volume' | 'marketCap' | 'peRatio';
type SortOrder = 'asc' | 'desc';

export const QuotesTable: React.FC = () => {
  const {
    stocks,
    selectedSymbol,
    setSelectedSymbol,
    isInWatchlist,
    toggleWatchlist,
    setDetailModalSymbol,
    setActiveTab,
  } = useMarket();

  const [activeFilter, setActiveFilter] = useState<ScreenerFilter>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortField, setSortField] = useState<SortField>('marketCap');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  // Filter stocks
  const filteredStocks = useMemo(() => {
    let result = [...stocks];

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        s => s.symbol.toLowerCase().includes(q) || s.name.toLowerCase().includes(q) || s.sector.toLowerCase().includes(q)
      );
    }

    // Category filter
    switch (activeFilter) {
      case 'active':
        result = [...result].sort((a, b) => b.volume - a.volume).slice(0, 10);
        break;
      case 'gainers':
        result = result.filter(s => s.changePercent > 0).sort((a, b) => b.changePercent - a.changePercent);
        break;
      case 'losers':
        result = result.filter(s => s.changePercent < 0).sort((a, b) => a.changePercent - b.changePercent);
        break;
      case 'megacap':
        result = result.filter(s => s.marketCap >= 500);
        break;
      case 'tech':
        result = result.filter(s => s.sector === 'Technology');
        break;
      default:
        break;
    }

    // Sort order
    result.sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      if (valA === undefined) valA = 0;
      if (valB === undefined) valB = 0;

      if (typeof valA === 'string' && typeof valB === 'string') {
        return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return sortOrder === 'asc' ? (valA as number) - (valB as number) : (valB as number) - (valA as number);
    });

    return result;
  }, [stocks, searchQuery, activeFilter, sortField, sortOrder]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  // Sparkline renderer for 64px x 20px
  const renderSparkline = (points: number[], isPositive: boolean) => {
    if (!points || points.length === 0) return null;
    const min = Math.min(...points);
    const max = Math.max(...points);
    const range = max - min || 1;
    const color = isPositive ? '#089981' : '#f23645';

    const coords = points
      .map((val, idx) => {
        const x = (idx / (points.length - 1)) * 64;
        const y = 18 - ((val - min) / range) * 16;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');

    return (
      <svg width="64" height="20" className="overflow-visible inline-block">
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={coords}
        />
      </svg>
    );
  };

  return (
    <div className="bg-[#1e222d] border border-[#2a2e39] rounded overflow-hidden">
      {/* Controls & Screener Tab Bar */}
      <div className="p-3 border-b border-[#2a2e39] flex flex-wrap items-center justify-between gap-3 bg-[#181b24]">
        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {[
            { id: 'all', label: 'All Stocks' },
            { id: 'active', label: 'Most Active' },
            { id: 'gainers', label: 'Top Gainers' },
            { id: 'losers', label: 'Top Losers' },
            { id: 'megacap', label: 'Mega-Cap' },
            { id: 'tech', label: 'Technology' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id as ScreenerFilter)}
              className={`h-6 px-3 text-xs font-medium rounded-full transition-all cursor-pointer whitespace-nowrap ${
                activeFilter === tab.id
                  ? 'bg-[#2962ff] text-white border border-[#2962ff] font-semibold'
                  : 'text-[#787b86] hover:text-[#d1d4dc] bg-transparent border border-[#363a45]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search inside screener */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-60">
            <Search className="w-3.5 h-3.5 text-[#787b86] absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter by symbol, company..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-[#131722] border border-[#363a45] focus:border-[#2962ff] text-xs text-white pl-8 pr-2.5 py-1 rounded placeholder-[#787b86] outline-none transition-colors"
            />
          </div>
          <span className="text-xs text-[#787b86] font-mono-tabular shrink-0">
            {filteredStocks.length} symbols
          </span>
        </div>
      </div>

      {/* Responsive Quotes Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#181b24] text-[#787b86] border-b border-[#2a2e39] select-none text-[11px] font-semibold tracking-wider uppercase">
              <th className="py-2.5 px-3 w-8"></th>
              <th
                onClick={() => handleSort('symbol')}
                className="py-2.5 px-3 cursor-pointer hover:text-white"
              >
                <div className="flex items-center gap-1">
                  <span>Symbol</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th
                onClick={() => handleSort('price')}
                className="py-2.5 px-3 text-right cursor-pointer hover:text-white"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Price</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th
                onClick={() => handleSort('changePercent')}
                className="py-2.5 px-3 text-right cursor-pointer hover:text-white"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Change %</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-2.5 px-3 text-center hidden md:table-cell">Trend (1D)</th>
              <th className="py-2.5 px-3 text-right hidden lg:table-cell">High</th>
              <th className="py-2.5 px-3 text-right hidden lg:table-cell">Low</th>
              <th
                onClick={() => handleSort('volume')}
                className="py-2.5 px-3 text-right cursor-pointer hover:text-white hidden sm:table-cell"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Volume</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th
                onClick={() => handleSort('marketCap')}
                className="py-2.5 px-3 text-right cursor-pointer hover:text-white hidden xl:table-cell"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Mkt Cap</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th
                onClick={() => handleSort('peRatio')}
                className="py-2.5 px-3 text-right cursor-pointer hover:text-white hidden 2xl:table-cell"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>P/E</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-2.5 px-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2a2e39]/60">
            {filteredStocks.map(stock => {
              const isPositive = stock.changePercent >= 0;
              const isSelected = selectedSymbol === stock.symbol;
              const flashClass =
                stock.lastTickDirection === 'up'
                  ? 'flash-uptick'
                  : stock.lastTickDirection === 'down'
                  ? 'flash-downtick'
                  : '';

              return (
                <tr
                  key={stock.symbol}
                  onClick={() => setSelectedSymbol(stock.symbol)}
                  className={`transition-colors cursor-pointer group ${
                    isSelected ? 'bg-[#2a2e39]/80 border-l-2 border-[#2962ff]' : 'hover:bg-[#2a2e39]/50'
                  } ${flashClass}`}
                >
                  {/* Watchlist Star */}
                  <td className="py-2 px-3 text-center" onClick={e => e.stopPropagation()}>
                    <button
                      onClick={() => toggleWatchlist(stock.symbol)}
                      className={`cursor-pointer ${
                        isInWatchlist(stock.symbol)
                          ? 'text-[#2962ff]'
                          : 'text-[#787b86] opacity-30 group-hover:opacity-100 hover:text-white'
                      }`}
                      title={isInWatchlist(stock.symbol) ? 'Remove' : 'Add to watchlist'}
                    >
                      <Bookmark className="w-3.5 h-3.5 fill-current" />
                    </button>
                  </td>

                  {/* Symbol & Company Name */}
                  <td className="py-2 px-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded bg-[#2a2e39] text-white flex items-center justify-center font-bold text-[10px] uppercase font-mono tracking-tighter">
                        {stock.symbol.slice(0, 2)}
                      </div>
                      <div>
                        <div className="font-bold text-white group-hover:text-[#2962ff] transition-colors flex items-center gap-1.5">
                          <span>{stock.symbol}</span>
                          <span className="text-[9px] px-1 py-0.2 rounded bg-[#131722] text-[#787b86] font-mono uppercase">
                            {stock.exchange}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#787b86] truncate max-w-[140px] sm:max-w-[200px]">
                          {stock.name}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Price */}
                  <td className="py-2 px-3 text-right font-mono-tabular font-semibold text-white">
                    ${stock.price.toFixed(2)}
                  </td>

                  {/* Change % */}
                  <td className="py-2 px-3 text-right">
                    <div
                      className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded font-mono-tabular font-medium text-[11px] ${
                        isPositive ? 'text-[#089981] bg-[#089981]/15' : 'text-[#f23645] bg-[#f23645]/15'
                      }`}
                    >
                      {isPositive ? (
                        <ArrowUpRight className="w-3 h-3 stroke-[2.5]" />
                      ) : (
                        <ArrowDownRight className="w-3 h-3 stroke-[2.5]" />
                      )}
                      <span>
                        {isPositive ? '+' : ''}
                        {stock.changePercent.toFixed(2)}%
                      </span>
                    </div>
                  </td>

                  {/* Trend Sparkline */}
                  <td className="py-2 px-3 text-center hidden md:table-cell">
                    {renderSparkline(stock.sparkline, isPositive)}
                  </td>

                  {/* High */}
                  <td className="py-2 px-3 text-right font-mono-tabular text-[#d1d4dc] hidden lg:table-cell">
                    ${stock.high.toFixed(2)}
                  </td>

                  {/* Low */}
                  <td className="py-2 px-3 text-right font-mono-tabular text-[#d1d4dc] hidden lg:table-cell">
                    ${stock.low.toFixed(2)}
                  </td>

                  {/* Volume */}
                  <td className="py-2 px-3 text-right font-mono-tabular text-[#787b86] hidden sm:table-cell">
                    {(stock.volume / 1000000).toFixed(2)}M
                  </td>

                  {/* Market Cap */}
                  <td className="py-2 px-3 text-right font-mono-tabular text-[#d1d4dc] hidden xl:table-cell">
                    ${stock.marketCap >= 1000 ? `${(stock.marketCap / 1000).toFixed(2)}T` : `${stock.marketCap}B`}
                  </td>

                  {/* P/E Ratio */}
                  <td className="py-2 px-3 text-right font-mono-tabular text-[#787b86] hidden 2xl:table-cell">
                    {stock.peRatio ? stock.peRatio.toFixed(1) : '—'}
                  </td>

                  {/* Actions */}
                  <td className="py-2 px-3 text-center" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => {
                          setSelectedSymbol(stock.symbol);
                          setActiveTab('chart');
                        }}
                        className="px-2 py-1 bg-[#131722] hover:bg-[#2962ff] hover:text-white text-[#787b86] rounded text-[11px] font-medium transition-colors cursor-pointer border border-[#2a2e39]"
                        title="Open in Superchart"
                      >
                        Chart
                      </button>
                      <button
                        onClick={() => setDetailModalSymbol(stock.symbol)}
                        className="p-1 bg-[#131722] hover:bg-[#2a2e39] text-[#787b86] hover:text-white rounded transition-colors cursor-pointer border border-[#2a2e39]"
                        title="View Full Financial Profile"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
