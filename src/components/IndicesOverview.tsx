import React from 'react';
import { useMarket } from '../context/MarketContext';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export const IndicesOverview: React.FC = () => {
  const { indices, setSelectedSymbol, setActiveTab } = useMarket();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 my-3">
      {indices.map(index => {
        const isPositive = index.changePercent >= 0;
        const color = isPositive ? '#089981' : '#f23645';

        // Normalize sparkline to SVG coordinates (width 100, height 32)
        const minVal = Math.min(...index.sparkline);
        const maxVal = Math.max(...index.sparkline);
        const range = maxVal - minVal || 1;

        const points = index.sparkline
          .map((val, idx) => {
            const x = (idx / (index.sparkline.length - 1)) * 100;
            const y = 30 - ((val - minVal) / range) * 26;
            return `${x},${y}`;
          })
          .join(' ');

        const fillPoints = `${points} 100,32 0,32`;

        return (
          <div
            key={index.symbol}
            onClick={() => {
              // If it's a tradeable symbol or index, select and allow view
              setSelectedSymbol(index.symbol);
            }}
            className="bg-[#1e222d] hover:bg-[#2a2e39] border border-[#2a2e39] hover:border-[#363a45] rounded p-2.5 transition-all cursor-pointer group flex flex-col justify-between"
          >
            {/* Header: Symbol & Name */}
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold text-white tracking-tight group-hover:text-[#2962ff] transition-colors">
                  {index.symbol}
                </span>
                <p className="text-[11px] text-[#787b86] truncate max-w-[95px] leading-tight">
                  {index.name}
                </p>
              </div>
              <span
                className={`text-[11px] font-mono-tabular font-medium flex items-center px-1.5 py-0.5 rounded ${
                  isPositive ? 'text-[#089981] bg-[#089981]/15' : 'text-[#f23645] bg-[#f23645]/15'
                }`}
              >
                {isPositive ? (
                  <ArrowUpRight className="w-3 h-3 stroke-[2.5]" />
                ) : (
                  <ArrowDownRight className="w-3 h-3 stroke-[2.5]" />
                )}
                {isPositive ? '+' : ''}
                {index.changePercent.toFixed(2)}%
              </span>
            </div>

            {/* Price & Change */}
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-sm sm:text-base font-bold text-white font-mono-tabular">
                {index.price > 1000
                  ? index.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                  : index.price.toFixed(3)}
              </span>
              <span className="text-[11px] text-[#787b86] font-mono-tabular">
                {isPositive ? '+' : ''}
                {index.change.toFixed(2)}
              </span>
            </div>

            {/* Mini SVG Sparkline Chart */}
            <div className="h-8 w-full mt-1.5 relative overflow-hidden">
              <svg viewBox="0 0 100 32" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                <defs>
                  <linearGradient id={`grad-${index.symbol}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity="0.28" />
                    <stop offset="100%" stopColor={color} stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <polygon points={fillPoints} fill={`url(#grad-${index.symbol})`} />
                <polyline
                  fill="none"
                  stroke={color}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={points}
                />
              </svg>
            </div>

            {/* Day's Range high & low */}
            <div className="mt-1 pt-1 border-t border-[#2a2e39]/60 flex items-center justify-between text-[10px] text-[#787b86] font-mono-tabular">
              <span>L: {index.low > 1000 ? index.low.toFixed(1) : index.low.toFixed(2)}</span>
              <span className="text-[#363a45]">•</span>
              <span>H: {index.high > 1000 ? index.high.toFixed(1) : index.high.toFixed(2)}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
