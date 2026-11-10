import React from 'react';
import { MARKET_NEWS } from '../data/marketData';
import { useMarket } from '../context/MarketContext';
import { Newspaper, ExternalLink, TrendingUp, TrendingDown, Clock } from 'lucide-react';

export const MarketNews: React.FC = () => {
  const { setSelectedSymbol, setActiveTab } = useMarket();

  return (
    <div className="bg-[#1e222d] border border-[#2a2e39] rounded overflow-hidden">
      <div className="p-3 border-b border-[#2a2e39] flex items-center justify-between bg-[#181b24]">
        <div className="flex items-center gap-2">
          <Newspaper className="w-4 h-4 text-[#2962ff]" />
          <h3 className="text-sm font-bold text-white tracking-tight">
            Market News & Trading Desk Wire
          </h3>
        </div>
        <span className="text-xs text-[#787b86]">Real-Time Financial Feeds</span>
      </div>

      <div className="divide-y divide-[#2a2e39]/60">
        {MARKET_NEWS.map(item => {
          const isBull = item.sentiment === 'bullish';
          const isBear = item.sentiment === 'bearish';

          return (
            <div
              key={item.id}
              className="p-4 hover:bg-[#2a2e39]/40 transition-colors flex flex-col gap-2 group cursor-pointer"
            >
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-[#2962ff] text-[11px]">{item.source}</span>
                  <span className="text-[#363a45]">•</span>
                  <span className="text-[#787b86] flex items-center gap-1 text-[11px]">
                    <Clock className="w-3 h-3" />
                    {item.timestamp}
                  </span>
                  <span className="text-[#363a45]">•</span>
                  <span className="text-[#787b86] text-[11px]">{item.readTime}</span>
                </div>

                {/* Sentiment Badge */}
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    isBull
                      ? 'bg-[#089981]/15 text-[#089981]'
                      : isBear
                      ? 'bg-[#f23645]/15 text-[#f23645]'
                      : 'bg-[#2a2e39] text-[#787b86]'
                  }`}
                >
                  {item.sentiment}
                </span>
              </div>

              <h4 className="text-sm font-bold text-white group-hover:text-[#2962ff] transition-colors leading-snug">
                {item.headline}
              </h4>

              <p className="text-xs text-[#787b86] leading-relaxed">{item.summary}</p>

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-[#787b86]">Mentions:</span>
                  {item.relatedSymbols.map(sym => (
                    <button
                      key={sym}
                      onClick={e => {
                        e.stopPropagation();
                        setSelectedSymbol(sym);
                        setActiveTab('chart');
                      }}
                      className="px-1.5 py-0.2 rounded bg-[#131722] hover:bg-[#2962ff] hover:text-white text-[10px] font-mono font-bold text-[#d1d4dc] border border-[#2a2e39] transition-colors cursor-pointer"
                    >
                      ${sym}
                    </button>
                  ))}
                </div>

                <span className="text-xs text-[#787b86] group-hover:text-white transition-colors flex items-center gap-1">
                  Read full analysis <ExternalLink className="w-3 h-3" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
