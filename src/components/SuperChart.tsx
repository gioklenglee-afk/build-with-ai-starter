import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useMarket } from '../context/MarketContext';
import { Timeframe, ChartType, Candle } from '../types/market';
import { generateCandlesForSymbol } from '../data/marketData';
import {
  CandlestickChart,
  LineChart,
  Sliders,
  Bookmark,
  Maximize2,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
} from 'lucide-react';

export const SuperChart: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const {
    selectedStock,
    selectedSymbol,
    isInWatchlist,
    toggleWatchlist,
    setIsOrderModalOpen,
    openPosition,
  } = useMarket();

  const [timeframe, setTimeframe] = useState<Timeframe>('1D');
  const [chartType, setChartType] = useState<ChartType>('candlestick');
  const [showMA20, setShowMA20] = useState<boolean>(true);
  const [showMA50, setShowMA50] = useState<boolean>(false);
  const [showVolume, setShowVolume] = useState<boolean>(true);
  const [showRSI, setShowRSI] = useState<boolean>(false);
  const [hoveredCandle, setHoveredCandle] = useState<Candle | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Generate realistic candles based on selected symbol and timeframe
  const candles = useMemo(() => {
    const basePrice = selectedStock ? selectedStock.price : 150;
    return generateCandlesForSymbol(selectedSymbol, timeframe, basePrice);
  }, [selectedSymbol, timeframe, selectedStock?.price]);

  // Active displayed candle (hovered or latest)
  const activeCandle = hoveredCandle || (candles.length > 0 ? candles[candles.length - 1] : null);

  // Calculate Moving Averages
  const ma20Data = useMemo(() => {
    const period = 10;
    return candles.map((c, idx, arr) => {
      if (idx < period - 1) return null;
      const slice = arr.slice(idx - period + 1, idx + 1);
      const avg = slice.reduce((sum, item) => sum + item.close, 0) / period;
      return avg;
    });
  }, [candles]);

  const ma50Data = useMemo(() => {
    const period = 20;
    return candles.map((c, idx, arr) => {
      if (idx < period - 1) return null;
      const slice = arr.slice(idx - period + 1, idx + 1);
      const avg = slice.reduce((sum, item) => sum + item.close, 0) / period;
      return avg;
    });
  }, [candles]);

  // Min and max for chart scale
  const { minPrice, maxPrice, maxVol } = useMemo(() => {
    if (candles.length === 0) return { minPrice: 0, maxPrice: 100, maxVol: 1000000 };
    let min = Infinity;
    let max = -Infinity;
    let volMax = 0;
    candles.forEach(c => {
      if (c.low < min) min = c.low;
      if (c.high > max) max = c.high;
      if (c.volume > volMax) volMax = c.volume;
    });
    // Add small 2% padding
    const padding = (max - min) * 0.04 || 1;
    return {
      minPrice: min - padding,
      maxPrice: max + padding,
      maxVol: volMax || 1,
    };
  }, [candles]);

  const priceRange = maxPrice - minPrice || 1;

  // Chart dimensions in SVG viewBox
  const chartWidth = 900;
  const chartHeight = compact ? 320 : 440;
  const priceAxisWidth = 70;
  const plotWidth = chartWidth - priceAxisWidth;
  const plotHeight = showRSI ? chartHeight - 90 : chartHeight - 35;
  const volumeHeight = plotHeight * 0.22;

  // Candle width and spacing
  const candleSlotWidth = plotWidth / candles.length;
  const candleBodyWidth = Math.max(2, Math.min(candleSlotWidth * 0.65, 12));

  // Compute points for Area chart
  const areaPoints = useMemo(() => {
    if (candles.length === 0) return '';
    return candles
      .map((c, idx) => {
        const x = idx * candleSlotWidth + candleSlotWidth / 2;
        const y = plotHeight - ((c.close - minPrice) / priceRange) * plotHeight;
        return `${x},${y}`;
      })
      .join(' ');
  }, [candles, candleSlotWidth, plotHeight, minPrice, priceRange]);

  const areaPolygonPoints = `${areaPoints} ${candles.length * candleSlotWidth - candleSlotWidth / 2},${plotHeight} ${candleSlotWidth / 2},${plotHeight}`;

  // MA 20 path
  const ma20Points = useMemo(() => {
    return ma20Data
      .map((val, idx) => {
        if (val === null) return null;
        const x = idx * candleSlotWidth + candleSlotWidth / 2;
        const y = plotHeight - ((val - minPrice) / priceRange) * plotHeight;
        return `${x},${y}`;
      })
      .filter(Boolean)
      .join(' ');
  }, [ma20Data, candleSlotWidth, plotHeight, minPrice, priceRange]);

  // Price grid levels (5 horizontal lines)
  const priceTicks = useMemo(() => {
    const ticks: { price: number; y: number }[] = [];
    const count = 5;
    for (let i = 0; i <= count; i++) {
      const price = minPrice + (priceRange * (count - i)) / count;
      const y = (plotHeight * i) / count;
      ticks.push({ price, y });
    }
    return ticks;
  }, [minPrice, priceRange, plotHeight]);

  // Handle cursor interaction
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const svgX = (mouseX / rect.width) * chartWidth;

    if (svgX < 0 || svgX > plotWidth) {
      setHoveredCandle(null);
      return;
    }

    const candleIdx = Math.floor(svgX / candleSlotWidth);
    if (candleIdx >= 0 && candleIdx < candles.length) {
      setHoveredCandle(candles[candleIdx]);
    }
  };

  const handleMouseLeave = () => {
    setHoveredCandle(null);
  };

  const isStockPositive = selectedStock ? selectedStock.changePercent >= 0 : true;
  const currentPrice = selectedStock ? selectedStock.price : (candles[candles.length - 1]?.close || 150);
  const currentPriceY = plotHeight - ((currentPrice - minPrice) / priceRange) * plotHeight;

  return (
    <div className="bg-[#1e222d] border border-[#2a2e39] rounded overflow-hidden flex flex-col">
      {/* Chart Top Toolbar */}
      <div className="p-2 sm:p-2.5 border-b border-[#2a2e39] flex flex-wrap items-center justify-between gap-2 bg-[#181b24]">
        {/* Left: Active Stock badge & quick metrics */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-base sm:text-lg font-bold text-white tracking-tight font-sans">
              {selectedSymbol}
            </span>
            <span className="text-xs text-[#787b86] hidden md:inline">
              {selectedStock?.name}
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#2a2e39] text-[#787b86]">
              {selectedStock?.exchange || 'NASDAQ'}
            </span>
            <button
              onClick={() => toggleWatchlist(selectedSymbol)}
              className={`p-1 rounded cursor-pointer transition-colors ${
                isInWatchlist(selectedSymbol)
                  ? 'text-[#2962ff] bg-[#2962ff]/10'
                  : 'text-[#787b86] hover:text-white hover:bg-[#2a2e39]'
              }`}
              title={isInWatchlist(selectedSymbol) ? 'Remove from Watchlist' : 'Add to Watchlist'}
            >
              <Bookmark className="w-3.5 h-3.5 fill-current" />
            </button>
          </div>

          <div className="flex items-baseline gap-2 pl-2 border-l border-[#2a2e39]">
            <span className="text-base sm:text-lg font-bold text-white font-mono-tabular">
              ${currentPrice.toFixed(2)}
            </span>
            {selectedStock && (
              <span
                className={`text-xs font-mono-tabular font-medium flex items-center ${
                  isStockPositive ? 'text-[#089981]' : 'text-[#f23645]'
                }`}
              >
                {isStockPositive ? '+' : ''}
                {selectedStock.change.toFixed(2)} ({isStockPositive ? '+' : ''}
                {selectedStock.changePercent.toFixed(2)}%)
              </span>
            )}
          </div>
        </div>

        {/* Center: Timeframe Selector Segmented Bar */}
        <div className="flex items-center bg-[#131722] p-0.5 rounded border border-[#2a2e39]">
          {(['1D', '5D', '1M', '3M', '1Y', 'ALL'] as Timeframe[]).map(tf => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-2 py-0.5 text-xs font-medium rounded transition-colors cursor-pointer ${
                timeframe === tf
                  ? 'bg-[#2a2e39] text-white shadow-xs font-semibold'
                  : 'text-[#787b86] hover:text-[#d1d4dc]'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>

        {/* Right: Chart Type & Indicators Controls */}
        <div className="flex items-center gap-1.5">
          {/* Chart type switch */}
          <div className="flex items-center bg-[#131722] p-0.5 rounded border border-[#2a2e39]">
            <button
              onClick={() => setChartType('candlestick')}
              className={`p-1 rounded cursor-pointer ${
                chartType === 'candlestick' ? 'bg-[#2a2e39] text-[#2962ff]' : 'text-[#787b86] hover:text-white'
              }`}
              title="Candlestick Chart"
            >
              <CandlestickChart className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setChartType('area')}
              className={`p-1 rounded cursor-pointer ${
                chartType === 'area' ? 'bg-[#2a2e39] text-[#2962ff]' : 'text-[#787b86] hover:text-white'
              }`}
              title="Area Baseline Chart"
            >
              <LineChart className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Indicators toggles */}
          <button
            onClick={() => setShowMA20(prev => !prev)}
            className={`px-2 py-1 text-[11px] font-mono rounded cursor-pointer transition-colors ${
              showMA20
                ? 'bg-[#2962ff]/20 text-[#2962ff] border border-[#2962ff]/60'
                : 'text-[#787b86] hover:text-white bg-[#131722] border border-[#2a2e39]'
            }`}
            title="Toggle 20 SMA Line"
          >
            MA 20
          </button>
          <button
            onClick={() => setShowMA50(prev => !prev)}
            className={`hidden sm:inline px-2 py-1 text-[11px] font-mono rounded cursor-pointer transition-colors ${
              showMA50
                ? 'bg-[#f59e0b]/20 text-[#f59e0b] border border-[#f59e0b]/60'
                : 'text-[#787b86] hover:text-white bg-[#131722] border border-[#2a2e39]'
            }`}
            title="Toggle 50 SMA Line"
          >
            MA 50
          </button>
          <button
            onClick={() => setShowVolume(prev => !prev)}
            className={`px-2 py-1 text-[11px] font-mono rounded cursor-pointer transition-colors ${
              showVolume
                ? 'bg-[#2a2e39] text-[#d1d4dc] border border-[#363a45]'
                : 'text-[#787b86] bg-[#131722] border border-[#2a2e39]'
            }`}
            title="Toggle Volume Bars"
          >
            VOL
          </button>
        </div>
      </div>

      {/* Crosshair Readout Bar (TradingView signature OHLC bar) */}
      <div className="px-3 py-1 bg-[#131722] border-b border-[#2a2e39]/60 flex items-center justify-between text-[11px] font-mono-tabular select-none overflow-x-auto">
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          <span className="text-[#787b86]">{activeCandle?.time || 'Live'}</span>
          <span>
            <span className="text-[#787b86]">O: </span>
            <span className="text-white font-medium">${activeCandle?.open.toFixed(2)}</span>
          </span>
          <span>
            <span className="text-[#787b86]">H: </span>
            <span className="text-white font-medium">${activeCandle?.high.toFixed(2)}</span>
          </span>
          <span>
            <span className="text-[#787b86]">L: </span>
            <span className="text-white font-medium">${activeCandle?.low.toFixed(2)}</span>
          </span>
          <span>
            <span className="text-[#787b86]">C: </span>
            <span
              className={`font-semibold ${
                (activeCandle ? activeCandle.close >= activeCandle.open : true)
                  ? 'text-[#089981]'
                  : 'text-[#f23645]'
              }`}
            >
              ${activeCandle?.close.toFixed(2)}
            </span>
          </span>
          {showVolume && (
            <span className="hidden sm:inline">
              <span className="text-[#787b86]">Vol: </span>
              <span className="text-[#d1d4dc]">
                {(activeCandle?.volume || 0).toLocaleString()}
              </span>
            </span>
          )}
        </div>

        {/* Legend */}
        <div className="hidden lg:flex items-center gap-3 text-[10px]">
          {showMA20 && (
            <span className="flex items-center gap-1 text-[#2962ff]">
              <span className="w-2.5 h-0.5 bg-[#2962ff]"></span>
              SMA 20
            </span>
          )}
          {showMA50 && (
            <span className="flex items-center gap-1 text-[#f59e0b]">
              <span className="w-2.5 h-0.5 bg-[#f59e0b]"></span>
              SMA 50
            </span>
          )}
        </div>
      </div>

      {/* Main Chart Canvas */}
      <div
        ref={containerRef}
        className="relative bg-[#131722] cursor-crosshair select-none flex-1 min-h-[300px]"
      >
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full h-full block"
          preserveAspectRatio="none"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <defs>
            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2962ff" stopOpacity="0.35" />
              <stop offset="90%" stopColor="#2962ff" stopOpacity="0.01" />
            </linearGradient>
          </defs>

          {/* Grid lines (horizontal) */}
          {priceTicks.map((tick, i) => (
            <g key={`tick-${i}`}>
              <line
                x1={0}
                y1={tick.y}
                x2={plotWidth}
                y2={tick.y}
                stroke="#2a2e39"
                strokeWidth="1"
                strokeDasharray="3 3"
                opacity="0.6"
              />
              {/* Right price axis text */}
              <text
                x={plotWidth + 8}
                y={tick.y + 4}
                fill="#787b86"
                fontSize="10"
                fontFamily="JetBrains Mono"
              >
                ${tick.price.toFixed(2)}
              </text>
            </g>
          ))}

          {/* Grid lines (vertical timestamps) */}
          {candles.map((c, i) => {
            if (i % Math.floor(candles.length / 5) !== 0) return null;
            const x = i * candleSlotWidth + candleSlotWidth / 2;
            return (
              <g key={`v-grid-${i}`}>
                <line
                  x1={x}
                  y1={0}
                  x2={x}
                  y2={plotHeight}
                  stroke="#2a2e39"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                  opacity="0.4"
                />
                <text
                  x={x}
                  y={plotHeight + 16}
                  fill="#787b86"
                  fontSize="9"
                  fontFamily="JetBrains Mono"
                  textAnchor="middle"
                >
                  {c.time}
                </text>
              </g>
            );
          })}

          {/* Volume histogram bars */}
          {showVolume &&
            candles.map((c, i) => {
              const x = i * candleSlotWidth + (candleSlotWidth - candleBodyWidth) / 2;
              const barHeight = (c.volume / maxVol) * volumeHeight;
              const y = plotHeight - barHeight;
              const isUp = c.close >= c.open;
              return (
                <rect
                  key={`vol-${i}`}
                  x={x}
                  y={y}
                  width={candleBodyWidth}
                  height={barHeight}
                  fill={isUp ? '#089981' : '#f23645'}
                  opacity={0.3}
                />
              );
            })}

          {/* Chart Rendering: Area or Candlesticks */}
          {chartType === 'area' ? (
            <g>
              <polygon points={areaPolygonPoints} fill="url(#areaGrad)" />
              <polyline
                points={areaPoints}
                fill="none"
                stroke="#2962ff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          ) : (
            // Candlesticks
            candles.map((c, i) => {
              const centerX = i * candleSlotWidth + candleSlotWidth / 2;
              const bodyX = centerX - candleBodyWidth / 2;
              const isUp = c.close >= c.open;
              const color = isUp ? '#089981' : '#f23645';

              const highY = plotHeight - ((c.high - minPrice) / priceRange) * plotHeight;
              const lowY = plotHeight - ((c.low - minPrice) / priceRange) * plotHeight;
              const openY = plotHeight - ((c.open - minPrice) / priceRange) * plotHeight;
              const closeY = plotHeight - ((c.close - minPrice) / priceRange) * plotHeight;

              const bodyTop = Math.min(openY, closeY);
              const bodyHeight = Math.max(2, Math.abs(closeY - openY));

              return (
                <g key={`candle-${i}`}>
                  {/* Wick */}
                  <line
                    x1={centerX}
                    y1={highY}
                    x2={centerX}
                    y2={lowY}
                    stroke={color}
                    strokeWidth="1.2"
                  />
                  {/* Body */}
                  <rect
                    x={bodyX}
                    y={bodyTop}
                    width={candleBodyWidth}
                    height={bodyHeight}
                    fill={color}
                    rx="1"
                  />
                </g>
              );
            })
          )}

          {/* SMA 20 Line */}
          {showMA20 && ma20Points && (
            <polyline
              points={ma20Points}
              fill="none"
              stroke="#2962ff"
              strokeWidth="1.8"
              opacity="0.9"
            />
          )}

          {/* Current Price Active Horizontal Marker */}
          <line
            x1={0}
            y1={currentPriceY}
            x2={plotWidth}
            y2={currentPriceY}
            stroke={isStockPositive ? '#089981' : '#f23645'}
            strokeWidth="1"
            strokeDasharray="4 4"
            opacity="0.8"
          />
          {/* Price Tag badge on right axis */}
          <rect
            x={plotWidth + 2}
            y={currentPriceY - 9}
            width={priceAxisWidth - 4}
            height={18}
            fill={isStockPositive ? '#089981' : '#f23645'}
            rx="2"
          />
          <text
            x={plotWidth + 6}
            y={currentPriceY + 4}
            fill="#ffffff"
            fontSize="10"
            fontFamily="JetBrains Mono"
            fontWeight="bold"
          >
            ${currentPrice.toFixed(2)}
          </text>

          {/* Hover Crosshairs when active */}
          {hoveredCandle && (
            <g>
              {(() => {
                const hoverIdx = candles.findIndex(c => c === hoveredCandle);
                const hoverX = hoverIdx * candleSlotWidth + candleSlotWidth / 2;
                const hoverY =
                  plotHeight - ((hoveredCandle.close - minPrice) / priceRange) * plotHeight;

                return (
                  <>
                    {/* Vertical line */}
                    <line
                      x1={hoverX}
                      y1={0}
                      x2={hoverX}
                      y2={plotHeight}
                      stroke="#d1d4dc"
                      strokeWidth="1"
                      strokeDasharray="3 3"
                      opacity="0.6"
                    />
                    {/* Horizontal line */}
                    <line
                      x1={0}
                      y1={hoverY}
                      x2={plotWidth}
                      y2={hoverY}
                      stroke="#d1d4dc"
                      strokeWidth="1"
                      strokeDasharray="3 3"
                      opacity="0.6"
                    />
                    {/* Hover right axis label */}
                    <rect
                      x={plotWidth + 2}
                      y={hoverY - 8}
                      width={priceAxisWidth - 4}
                      height={16}
                      fill="#2a2e39"
                      stroke="#363a45"
                      rx="2"
                    />
                    <text
                      x={plotWidth + 6}
                      y={hoverY + 4}
                      fill="#ffffff"
                      fontSize="9"
                      fontFamily="JetBrains Mono"
                    >
                      ${hoveredCandle.close.toFixed(2)}
                    </text>
                  </>
                );
              })()}
            </g>
          )}
        </svg>
      </div>

      {/* Integrated Quick Trading Execution Bar */}
      <div className="p-2 sm:p-2.5 bg-[#181b24] border-t border-[#2a2e39] flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {/* Quick Buy Button */}
          <button
            onClick={() => {
              openPosition(selectedSymbol, 'BUY', 10);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#089981] hover:bg-[#22ab94] text-white text-xs font-bold rounded cursor-pointer transition-colors shadow-sm"
          >
            <span>BUY 10x</span>
            <span className="font-mono-tabular opacity-90">${currentPrice.toFixed(2)}</span>
          </button>

          {/* Quick Sell Button */}
          <button
            onClick={() => {
              openPosition(selectedSymbol, 'SELL', 10);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#f23645] hover:bg-[#ff4957] text-white text-xs font-bold rounded cursor-pointer transition-colors shadow-sm"
          >
            <span>SELL 10x</span>
            <span className="font-mono-tabular opacity-90">${currentPrice.toFixed(2)}</span>
          </button>

          {/* Custom Order Ticket Trigger */}
          <button
            onClick={() => setIsOrderModalOpen(true)}
            className="px-2.5 py-1.5 text-xs text-[#787b86] hover:text-white bg-[#131722] hover:bg-[#2a2e39] border border-[#363a45] rounded cursor-pointer transition-colors"
          >
            Order Ticket...
          </button>
        </div>

        {/* Quick Stats Pill */}
        <div className="hidden sm:flex items-center gap-3 text-xs text-[#787b86] font-mono-tabular">
          <span>52W Low: <span className="text-[#d1d4dc]">${selectedStock?.week52Low.toFixed(2)}</span></span>
          <span className="text-[#363a45]">|</span>
          <span>52W High: <span className="text-[#d1d4dc]">${selectedStock?.week52High.toFixed(2)}</span></span>
          <span className="text-[#363a45]">|</span>
          <span>Target: <span className="text-[#089981]">${selectedStock?.targetPrice?.toFixed(2)}</span></span>
        </div>
      </div>
    </div>
  );
};
