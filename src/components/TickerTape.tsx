import React from 'react';
import { useMarket } from '../context/MarketContext';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export const TickerTape: React.FC = () => {
  const { stocks, indices, setSelectedSymbol } = useMarket();

  // Combine top indices and prominent stocks for the ticker marquee
  const tickerItems = [
    ...indices.map(idx => ({
      symbol: idx.symbol,
      name: idx.name,
      price: idx.price,
      changePercent: idx.changePercent,
      isIndex: true,
      lastTickDirection: undefined,
    })),
    ...stocks.map(s => ({
      symbol: s.symbol,
      name: s.name,
      price: s.price,
      changePercent: s.changePercent,
      isIndex: false,
      lastTickDirection: s.lastTickDirection,
    })),
  ];

  // Duplicate for seamless loop
  const displayItems = [...tickerItems, ...tickerItems];

  return (
    <div className="h-9 bg-[#131722] border-b border-[#2a2e39] overflow-hidden flex items-center select-none relative z-20">
      {/* Static left mini label */}
      <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-[#1e222d] border-r border-[#2a2e39] text-[10px] font-bold tracking-wider uppercase text-[#787b86] shrink-0 z-10 shadow-md">
        <span className="w-1.5 h-1.5 rounded-full bg-[#089981] animate-pulse"></span>
        TAPE
      </div>

      {/* Marquee Track */}
      <div className="flex animate-marquee overflow-visible">
        {displayItems.map((item, index) => {
          const isPositive = item.changePercent >= 0;
          const flashClass =
            item.lastTickDirection === 'up'
              ? 'flash-uptick'
              : item.lastTickDirection === 'down'
              ? 'flash-downtick'
              : '';

          return (
            <button
              key={`${item.symbol}-${index}`}
              onClick={() => setSelectedSymbol(item.symbol)}
              className={`flex items-center gap-2 px-3 py-1 transition-colors hover:bg-[#1e222d] whitespace-nowrap cursor-pointer text-left border-r border-[#2a2e39]/50 ${flashClass}`}
              title={`${item.name} (${item.symbol}) - Click to inspect`}
            >
              <span className="text-xs font-bold text-white tracking-tight">
                {item.symbol}
              </span>
              <span className="text-xs text-[#d1d4dc] font-mono-tabular">
                {item.price > 1000
                  ? item.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                  : item.price.toFixed(2)}
              </span>
              <span
                className={`text-[11px] font-mono-tabular flex items-center font-medium ${
                  isPositive ? 'text-[#089981]' : 'text-[#f23645]'
                }`}
              >
                {isPositive ? (
                  <ArrowUpRight className="w-3 h-3 stroke-[2.5]" />
                ) : (
                  <ArrowDownRight className="w-3 h-3 stroke-[2.5]" />
                )}
                {isPositive ? '+' : ''}
                {item.changePercent.toFixed(2)}%
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
