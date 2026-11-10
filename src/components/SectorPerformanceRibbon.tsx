import React from 'react';
import { SECTOR_PERFORMANCE } from '../data/marketData';
import { useMarket } from '../context/MarketContext';
import { ArrowUpRight, ArrowDownRight, Layers } from 'lucide-react';

export const SectorPerformanceRibbon: React.FC = () => {
  const { setActiveTab } = useMarket();

  return (
    <div className="bg-[#1e222d] border border-[#2a2e39] rounded p-3 my-3">
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#2962ff]" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Sector Performance (1D)
          </h3>
        </div>
        <button
          onClick={() => setActiveTab('heatmap')}
          className="text-xs text-[#2962ff] hover:text-[#5383ff] font-medium transition-colors cursor-pointer"
        >
          View Full Heatmap →
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
        {SECTOR_PERFORMANCE.slice(0, 6).map(sec => {
          const isPositive = sec.changePercent >= 0;
          return (
            <div
              key={sec.name}
              onClick={() => setActiveTab('heatmap')}
              className="bg-[#131722] hover:bg-[#2a2e39] border border-[#2a2e39] rounded p-2 transition-colors cursor-pointer group"
            >
              <div className="flex items-center justify-between text-[11px] mb-1">
                <span className="text-[#d1d4dc] group-hover:text-white truncate font-medium max-w-[85px]">
                  {sec.name}
                </span>
                <span
                  className={`font-mono-tabular font-semibold flex items-center ${
                    isPositive ? 'text-[#089981]' : 'text-[#f23645]'
                  }`}
                >
                  {isPositive ? (
                    <ArrowUpRight className="w-3 h-3 stroke-[2.5]" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3 stroke-[2.5]" />
                  )}
                  {isPositive ? '+' : ''}
                  {sec.changePercent.toFixed(2)}%
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-[#2a2e39] h-1 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${isPositive ? 'bg-[#089981]' : 'bg-[#f23645]'}`}
                  style={{ width: `${Math.min(100, Math.abs(sec.changePercent) * 35)}%` }}
                ></div>
              </div>

              <div className="mt-1 flex items-center justify-between text-[10px] text-[#787b86]">
                <span className="truncate">Top: {sec.leadingStock}</span>
                <span className="font-mono-tabular">${(sec.marketCapBillions / 1000).toFixed(1)}T</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
