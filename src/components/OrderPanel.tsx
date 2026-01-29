import { useState } from 'react';
import { TrendingUp, TrendingDown, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { OrderSide } from '@injectivelabs/ts-types';

interface OrderPanelProps {
  marketId: string;
  baseDecimals: number;
  quoteDecimals: number;
  currentPrice: number;
  onPlaceOrder: (params: {
    price: number;
    quantity: number;
    orderSide: OrderSide;
    orderType: 'limit' | 'market';
  }) => Promise<void>;
  isConnected: boolean;
}

export default function OrderPanel({
  marketId,
  baseDecimals,
  quoteDecimals,
  currentPrice,
  onPlaceOrder,
  isConnected,
}: OrderPanelProps) {
  const [orderType, setOrderType] = useState<'limit' | 'market'>('limit');
  const [orderSide, setOrderSide] = useState<OrderSide>(OrderSide.Buy);
  const [price, setPrice] = useState(currentPrice.toString());
  const [quantity, setQuantity] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const total = orderType === 'limit' 
    ? (parseFloat(price) || 0) * (parseFloat(quantity) || 0)
    : currentPrice * (parseFloat(quantity) || 0);

  const handleSubmit = async () => {
    if (!isConnected) {
      setStatus('error');
      setErrorMessage('Please connect wallet first');
      return;
    }

    if (!quantity || parseFloat(quantity) <= 0) {
      setStatus('error');
      setErrorMessage('Invalid quantity');
      return;
    }

    if (orderType === 'limit' && (!price || parseFloat(price) <= 0)) {
      setStatus('error');
      setErrorMessage('Invalid price');
      return;
    }

    setIsSubmitting(true);
    setStatus('idle');
    setErrorMessage('');

    try {
      await onPlaceOrder({
        price: orderType === 'limit' ? parseFloat(price) : currentPrice,
        quantity: parseFloat(quantity),
        orderSide,
        orderType,
      });

      setStatus('success');
      setQuantity('');
      setTimeout(() => setStatus('idle'), 3000);
    } catch (error: any) {
      setStatus('error');
      setErrorMessage(error?.message || 'Failed to place order');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#262626] border border-[#2F2F2F] rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-[#2F2F2F]">
        <h3 className="text-white font-bold text-lg mb-4">Place Order</h3>
        
        {/* Order Type Tabs */}
        <div className="flex space-x-2 bg-[#171717] p-1 rounded-xl">
          <button
            onClick={() => setOrderType('limit')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
              orderType === 'limit'
                ? 'bg-[#9E7FFF] text-white'
                : 'text-[#A3A3A3] hover:text-white'
            }`}
          >
            Limit
          </button>
          <button
            onClick={() => setOrderType('market')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
              orderType === 'market'
                ? 'bg-[#9E7FFF] text-white'
                : 'text-[#A3A3A3] hover:text-white'
            }`}
          >
            Market
          </button>
        </div>
      </div>

      {/* Order Form */}
      <div className="p-6 space-y-4">
        {/* Buy/Sell Toggle */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setOrderSide(OrderSide.Buy)}
            className={`py-3 rounded-xl font-bold transition-all ${
              orderSide === OrderSide.Buy
                ? 'bg-[#10b981] text-white shadow-lg shadow-[#10b981]/30'
                : 'bg-[#171717] text-[#A3A3A3] hover:bg-[#2F2F2F]'
            }`}
          >
            <TrendingUp className="w-5 h-5 inline mr-2" />
            Buy
          </button>
          <button
            onClick={() => setOrderSide(OrderSide.Sell)}
            className={`py-3 rounded-xl font-bold transition-all ${
              orderSide === OrderSide.Sell
                ? 'bg-[#ef4444] text-white shadow-lg shadow-[#ef4444]/30'
                : 'bg-[#171717] text-[#A3A3A3] hover:bg-[#2F2F2F]'
            }`}
          >
            <TrendingDown className="w-5 h-5 inline mr-2" />
            Sell
          </button>
        </div>

        {/* Price Input (Limit Only) */}
        {orderType === 'limit' && (
          <div>
            <label className="text-sm text-[#A3A3A3] mb-2 block">Price (USDT)</label>
            <input
              type="text"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full bg-[#171717] border border-[#2F2F2F] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#9E7FFF] transition-colors"
              placeholder="0.00"
            />
          </div>
        )}

        {/* Quantity Input */}
        <div>
          <label className="text-sm text-[#A3A3A3] mb-2 block">Quantity (INJ)</label>
          <input
            type="text"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full bg-[#171717] border border-[#2F2F2F] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#9E7FFF] transition-colors"
            placeholder="0.00"
          />
        </div>

        {/* Total */}
        <div className="bg-[#171717] border border-[#2F2F2F] rounded-xl p-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-[#A3A3A3]">Total</span>
            <span className="text-lg font-bold text-white">{total.toFixed(2)} USDT</span>
          </div>
        </div>

        {/* Status Messages */}
        {status === 'success' && (
          <div className="flex items-center space-x-2 p-3 bg-[#10b981]/10 border border-[#10b981]/30 rounded-xl">
            <CheckCircle className="w-5 h-5 text-[#10b981]" />
            <span className="text-sm text-[#10b981]">Order placed successfully!</span>
          </div>
        )}

        {status === 'error' && (
          <div className="flex items-center space-x-2 p-3 bg-[#ef4444]/10 border border-[#ef4444]/30 rounded-xl">
            <XCircle className="w-5 h-5 text-[#ef4444]" />
            <span className="text-sm text-[#ef4444]">{errorMessage}</span>
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={!isConnected || isSubmitting}
          className={`w-full py-4 rounded-xl font-bold text-white transition-all ${
            isConnected && !isSubmitting
              ? orderSide === OrderSide.Buy
                ? 'bg-gradient-to-r from-[#10b981] to-[#059669] hover:opacity-90 shadow-lg shadow-[#10b981]/30 hover:scale-105'
                : 'bg-gradient-to-r from-[#ef4444] to-[#dc2626] hover:opacity-90 shadow-lg shadow-[#ef4444]/30 hover:scale-105'
              : 'bg-[#2F2F2F] cursor-not-allowed opacity-50'
          }`}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center space-x-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Placing Order...</span>
            </span>
          ) : !isConnected ? (
            'Connect Wallet'
          ) : (
            `${orderSide === OrderSide.Buy ? 'Buy' : 'Sell'} ${orderType === 'limit' ? 'Limit' : 'Market'}`
          )}
        </button>
      </div>
    </div>
  );
}
