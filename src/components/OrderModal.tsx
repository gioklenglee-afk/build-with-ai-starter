import React, { useState } from 'react';
import { useMarket } from '../context/MarketContext';
import { X, TrendingUp, ShieldAlert, CheckCircle2, DollarSign } from 'lucide-react';

export const OrderModal: React.FC = () => {
  const {
    isOrderModalOpen,
    setIsOrderModalOpen,
    selectedStock,
    openPosition,
    paperBalance,
  } = useMarket();

  const [orderSide, setOrderSide] = useState<'BUY' | 'SELL'>('BUY');
  const [orderType, setOrderType] = useState<'Market' | 'Limit' | 'Stop'>('Market');
  const [shares, setShares] = useState<number>(10);
  const [limitPrice, setLimitPrice] = useState<number>(selectedStock ? selectedStock.price : 100);
  const [stopLossActive, setStopLossActive] = useState<boolean>(false);
  const [stopLossPrice, setStopLossPrice] = useState<number>(
    selectedStock ? parseFloat((selectedStock.price * 0.95).toFixed(2)) : 95
  );
  const [takeProfitActive, setTakeProfitActive] = useState<boolean>(false);
  const [takeProfitPrice, setTakeProfitPrice] = useState<number>(
    selectedStock ? parseFloat((selectedStock.price * 1.10).toFixed(2)) : 110
  );
  const [executionNotice, setExecutionNotice] = useState<string | null>(null);

  if (!isOrderModalOpen || !selectedStock) return null;

  const executionPrice = orderType === 'Market' ? selectedStock.price : limitPrice;
  const totalValue = executionPrice * shares;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (orderSide === 'BUY' && totalValue > paperBalance) {
      alert('Insufficient funds in paper trading balance.');
      return;
    }

    openPosition(
      selectedStock.symbol,
      orderSide,
      shares,
      stopLossActive ? stopLossPrice : undefined,
      takeProfitActive ? takeProfitPrice : undefined
    );

    setExecutionNotice(`Order filled: ${orderSide} ${shares}x ${selectedStock.symbol} @ $${executionPrice.toFixed(2)}`);
    setTimeout(() => {
      setExecutionNotice(null);
      setIsOrderModalOpen(false);
    }, 1200);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={() => setIsOrderModalOpen(false)}
    >
      <div
        className="bg-[#1e222d] border border-[#363a45] rounded-lg max-w-md w-full shadow-2xl overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-3.5 bg-[#181b24] border-b border-[#2a2e39] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#2962ff]" />
            <h3 className="text-sm font-bold text-white tracking-tight">
              Order Ticket: {selectedStock.symbol}
            </h3>
            <span className="text-xs text-[#787b86]">(${selectedStock.price.toFixed(2)})</span>
          </div>
          <button
            onClick={() => setIsOrderModalOpen(false)}
            className="p-1 rounded text-[#787b86] hover:text-white hover:bg-[#2a2e39] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Buy / Sell Tabs */}
        <div className="grid grid-cols-2 p-2 bg-[#131722] border-b border-[#2a2e39] gap-2">
          <button
            type="button"
            onClick={() => setOrderSide('BUY')}
            className={`py-2 text-xs font-bold rounded cursor-pointer transition-all ${
              orderSide === 'BUY'
                ? 'bg-[#089981] text-white shadow-md'
                : 'bg-[#1e222d] text-[#787b86] hover:text-white'
            }`}
          >
            BUY / LONG
          </button>
          <button
            type="button"
            onClick={() => setOrderSide('SELL')}
            className={`py-2 text-xs font-bold rounded cursor-pointer transition-all ${
              orderSide === 'SELL'
                ? 'bg-[#f23645] text-white shadow-md'
                : 'bg-[#1e222d] text-[#787b86] hover:text-white'
            }`}
          >
            SELL / SHORT
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-3.5 text-xs">
          {executionNotice && (
            <div className="p-2.5 rounded bg-[#089981]/20 border border-[#089981] text-[#089981] font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{executionNotice}</span>
            </div>
          )}

          {/* Order Type */}
          <div className="flex items-center justify-between">
            <span className="text-[#787b86] font-medium">Order Type</span>
            <div className="flex bg-[#131722] p-0.5 rounded border border-[#2a2e39]">
              {(['Market', 'Limit', 'Stop'] as const).map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setOrderType(type)}
                  className={`px-3 py-1 rounded cursor-pointer ${
                    orderType === type
                      ? 'bg-[#2a2e39] text-white font-semibold'
                      : 'text-[#787b86] hover:text-[#d1d4dc]'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Shares */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-[#787b86]">
              <span>Quantity (Shares)</span>
              <span>Available Cash: ${paperBalance.toLocaleString('en-US', { minimumFractionDigits: 0 })}</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                max="10000"
                value={shares}
                onChange={e => setShares(Math.max(1, parseInt(e.target.value) || 1))}
                className="flex-1 bg-[#131722] border border-[#363a45] focus:border-[#2962ff] rounded px-3 py-1.5 text-white font-mono-tabular outline-none text-sm"
              />
              <div className="flex items-center gap-1">
                {[10, 50, 100].map(qty => (
                  <button
                    key={qty}
                    type="button"
                    onClick={() => setShares(qty)}
                    className="px-2 py-1 bg-[#131722] hover:bg-[#2a2e39] text-[#787b86] hover:text-white rounded border border-[#2a2e39] font-mono text-[11px] cursor-pointer"
                  >
                    +{qty}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Limit Price Input if not market */}
          {orderType !== 'Market' && (
            <div className="flex flex-col gap-1">
              <span className="text-[#787b86]">Execution Price ($)</span>
              <input
                type="number"
                step="0.01"
                value={limitPrice}
                onChange={e => setLimitPrice(parseFloat(e.target.value) || selectedStock.price)}
                className="bg-[#131722] border border-[#363a45] focus:border-[#2962ff] rounded px-3 py-1.5 text-white font-mono-tabular outline-none text-sm"
              />
            </div>
          )}

          {/* Stop Loss & Take Profit Toggles */}
          <div className="pt-2 border-t border-[#2a2e39] flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer text-[#d1d4dc]">
                <input
                  type="checkbox"
                  checked={stopLossActive}
                  onChange={e => setStopLossActive(e.target.checked)}
                  className="rounded bg-[#131722] border-[#363a45] text-[#2962ff] focus:ring-0"
                />
                <span>Stop Loss</span>
              </label>
              {stopLossActive && (
                <input
                  type="number"
                  step="0.01"
                  value={stopLossPrice}
                  onChange={e => setStopLossPrice(parseFloat(e.target.value) || 0)}
                  className="w-28 bg-[#131722] border border-[#363a45] rounded px-2 py-0.5 text-right font-mono-tabular text-white outline-none"
                />
              )}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer text-[#d1d4dc]">
                <input
                  type="checkbox"
                  checked={takeProfitActive}
                  onChange={e => setTakeProfitActive(e.target.checked)}
                  className="rounded bg-[#131722] border-[#363a45] text-[#2962ff] focus:ring-0"
                />
                <span>Take Profit</span>
              </label>
              {takeProfitActive && (
                <input
                  type="number"
                  step="0.01"
                  value={takeProfitPrice}
                  onChange={e => setTakeProfitPrice(parseFloat(e.target.value) || 0)}
                  className="w-28 bg-[#131722] border border-[#363a45] rounded px-2 py-0.5 text-right font-mono-tabular text-white outline-none"
                />
              )}
            </div>
          </div>

          {/* Total & Submit */}
          <div className="pt-3 border-t border-[#2a2e39] flex items-center justify-between text-xs font-mono-tabular">
            <span className="text-[#787b86]">Total Value:</span>
            <span className="text-white text-base font-bold">
              ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          <button
            type="submit"
            className={`w-full py-2.5 rounded font-bold text-white text-xs tracking-wider uppercase transition-colors cursor-pointer shadow-md ${
              orderSide === 'BUY'
                ? 'bg-[#089981] hover:bg-[#22ab94]'
                : 'bg-[#f23645] hover:bg-[#ff4957]'
            }`}
          >
            Confirm {orderSide} {shares}x {selectedStock.symbol}
          </button>
        </form>
      </div>
    </div>
  );
};
