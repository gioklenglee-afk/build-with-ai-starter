import React from 'react';
import { UPCOMING_EARNINGS } from '../data/marketData';
import { useMarket } from '../context/MarketContext';
import { Calendar, Clock, DollarSign, TrendingUp, BarChart2 } from 'lucide-react';

export const EarningsCalendar: React.FC = () => {
  const { setSelectedSymbol, setActiveTab, setDetailModalSymbol } = useMarket();

  return (
    <div className="bg-[#1e222d] border border-[#2a2e39] rounded overflow-hidden">
      <div className="p-3 border-b border-[#2a2e39] flex items-center justify-between bg-[#181b24]">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[#2962ff]" />
          <h3 className="text-sm font-bold text-white tracking-tight">
            Upcoming Corporate Earnings Calendar
          </h3>
        </div>
        <span className="text-xs text-[#787b86]">Q3/Q4 Consensus Expectations</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#181b24] text-[#787b86] border-b border-[#2a2e39] text-[11px] font-semibold uppercase tracking-wider">
              <th className="py-2.5 px-3">Company</th>
              <th className="py-2.5 px-3">Report Date</th>
              <th className="py-2.5 px-3">Time</th>
              <th className="py-2.5 px-3 text-right">EPS Consensus</th>
              <th className="py-2.5 px-3 text-right">Revenue Est.</th>
              <th className="py-2.5 px-3 text-right">Market Cap</th>
              <th className="py-2.5 px-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2a2e39]/60">
            {UPCOMING_EARNINGS.map(item => (
              <tr
                key={item.symbol}
                className="hover:bg-[#2a2e39]/50 transition-colors cursor-pointer group"
                onClick={() => {
                  setSelectedSymbol(item.symbol);
                  setActiveTab('chart');
                }}
              >
                <td className="py-3 px-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded bg-[#131722] border border-[#2a2e39] flex items-center justify-center font-bold text-white text-xs font-mono">
                      {item.symbol.slice(0, 2)}
                    </div>
                    <div>
                      <span className="font-bold text-white group-hover:text-[#2962ff] transition-colors">
                        {item.symbol}
                      </span>
                      <p className="text-[11px] text-[#787b86]">{item.name}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-3 font-medium text-white">{item.reportDate}</td>
                <td className="py-3 px-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#131722] text-[#d1d4dc] border border-[#2a2e39]">
                    {item.timeOfDay}
                  </span>
                </td>
                <td className="py-3 px-3 text-right font-mono-tabular font-bold text-[#089981]">
                  ${item.epsEstimate.toFixed(2)}
                </td>
                <td className="py-3 px-3 text-right font-mono-tabular text-white">{item.revEstimate}</td>
                <td className="py-3 px-3 text-right font-mono-tabular text-[#787b86]">{item.marketCap}</td>
                <td className="py-3 px-3 text-center" onClick={e => e.stopPropagation()}>
                  <button
                    onClick={() => {
                      setSelectedSymbol(item.symbol);
                      setActiveTab('chart');
                    }}
                    className="px-2.5 py-1 bg-[#131722] hover:bg-[#2962ff] hover:text-white text-[#787b86] rounded text-[11px] font-medium border border-[#2a2e39] transition-colors cursor-pointer"
                  >
                    Chart
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
