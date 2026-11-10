import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useMarket } from '../context/MarketContext';
import { Search, X, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export const SymbolSearchModal: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, stocks, indices, setSelectedSymbol, setActiveTab } = useMarket();
  const [query, setQuery] = useState<string>('');
  const [filterType, setFilterType] = useState<'all' | 'stocks' | 'indices'>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isSearchOpen]);

  // Combine items
  const allItems = useMemo(() => {
    const list = [
      ...indices.map(i => ({
        symbol: i.symbol,
        name: i.name,
        type: 'Index',
        exchange: 'INDEX',
        price: i.price,
        changePercent: i.changePercent,
      })),
      ...stocks.map(s => ({
        symbol: s.symbol,
        name: s.name,
        type: 'Stock',
        exchange: s.exchange,
        price: s.price,
        changePercent: s.changePercent,
      })),
    ];
    return list;
  }, [indices, stocks]);

  const filteredItems = useMemo(() => {
    let result = allItems;
    if (filterType === 'stocks') {
      result = result.filter(item => item.type === 'Stock');
    } else if (filterType === 'indices') {
      result = result.filter(item => item.type === 'Index');
    }

    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(
        item => item.symbol.toLowerCase().includes(q) || item.name.toLowerCase().includes(q)
      );
    }
    return result;
  }, [allItems, filterType, query]);

  if (!isSearchOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={() => setIsSearchOpen(false)}
    >
      <div
        className="bg-[#1e222d] border border-[#363a45] rounded-lg max-w-xl w-full shadow-2xl overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-3 border-b border-[#2a2e39] flex items-center gap-3 bg-[#181b24]">
          <Search className="w-5 h-5 text-[#2962ff] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search symbol, company, or index (e.g. AAPL, S&P 500, TSLA)..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-white placeholder-[#787b86] outline-none"
          />
          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-1 text-[#787b86] hover:text-white rounded hover:bg-[#2a2e39] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Type Filter Pills */}
        <div className="px-3 py-2 bg-[#131722] border-b border-[#2a2e39] flex items-center gap-1.5 text-xs">
          {(['all', 'stocks', 'indices'] as const).map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-0.5 rounded-full capitalize transition-colors cursor-pointer ${
                filterType === type
                  ? 'bg-[#2962ff] text-white font-semibold'
                  : 'text-[#787b86] hover:text-white bg-[#1e222d]'
              }`}
            >
              {type}
            </button>
          ))}
          <span className="ml-auto text-[11px] text-[#787b86]">ESC to close</span>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto divide-y divide-[#2a2e39]/50">
          {filteredItems.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#787b86]">
              No instruments found matching "{query}".
            </div>
          ) : (
            filteredItems.map(item => {
              const isPositive = item.changePercent >= 0;

              return (
                <div
                  key={item.symbol}
                  onClick={() => {
                    setSelectedSymbol(item.symbol);
                    setIsSearchOpen(false);
                  }}
                  className="p-3 flex items-center justify-between hover:bg-[#2a2e39] cursor-pointer transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded bg-[#131722] border border-[#2a2e39] flex items-center justify-center font-bold text-white text-xs font-mono">
                      {item.symbol.slice(0, 2)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm group-hover:text-[#2962ff] transition-colors">
                          {item.symbol}
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#131722] text-[#787b86]">
                          {item.exchange}
                        </span>
                        <span className="text-[10px] text-[#787b86]">{item.type}</span>
                      </div>
                      <p className="text-xs text-[#787b86] truncate max-w-xs">{item.name}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-mono-tabular text-sm font-semibold text-white">
                      ${item.price > 1000 ? item.price.toLocaleString('en-US', { minimumFractionDigits: 2 }) : item.price.toFixed(2)}
                    </div>
                    <div
                      className={`text-xs font-mono-tabular font-medium flex items-center justify-end ${
                        isPositive ? 'text-[#089981]' : 'text-[#f23645]'
                      }`}
                    >
                      {isPositive ? (
                        <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
                      ) : (
                        <ArrowDownRight className="w-3.5 h-3.5 stroke-[2.5]" />
                      )}
                      {isPositive ? '+' : ''}
                      {item.changePercent.toFixed(2)}%
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
