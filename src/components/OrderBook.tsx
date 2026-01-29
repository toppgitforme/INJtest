import { BookOpen } from 'lucide-react'

export function OrderBook() {
  const bids = [
    { price: '24.58', amount: '125.4', total: '3,082.93' },
    { price: '24.57', amount: '89.2', total: '2,191.64' },
    { price: '24.56', amount: '234.1', total: '5,749.50' },
    { price: '24.55', amount: '156.8', total: '3,849.64' },
    { price: '24.54', amount: '92.3', total: '2,264.64' },
  ]

  const asks = [
    { price: '24.59', amount: '98.5', total: '2,422.12' },
    { price: '24.60', amount: '145.2', total: '3,571.92' },
    { price: '24.61', amount: '67.8', total: '1,668.56' },
    { price: '24.62', amount: '189.4', total: '4,662.03' },
    { price: '24.63', amount: '112.6', total: '2,772.54' },
  ]

  return (
    <div className="bg-[#262626] border border-[#2F2F2F] rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-[#2F2F2F]">
        <div className="flex items-center space-x-2">
          <BookOpen className="w-5 h-5 text-[#9E7FFF]" />
          <h3 className="text-white font-bold">Order Book</h3>
        </div>
      </div>

      {/* Column Headers */}
      <div className="px-4 py-2 grid grid-cols-3 text-xs text-[#A3A3A3] border-b border-[#2F2F2F]">
        <span>Price (USDT)</span>
        <span className="text-right">Amount (INJ)</span>
        <span className="text-right">Total</span>
      </div>

      {/* Asks (Sell Orders) */}
      <div className="px-4 py-2 space-y-1">
        {asks.reverse().map((ask, idx) => (
          <div key={idx} className="relative grid grid-cols-3 text-xs py-1 hover:bg-[#171717] rounded transition-colors cursor-pointer">
            <div className="absolute inset-0 bg-[#ef4444] opacity-5 rounded" style={{ width: `${(idx + 1) * 20}%` }}></div>
            <span className="text-[#ef4444] font-medium relative z-10">{ask.price}</span>
            <span className="text-white text-right relative z-10">{ask.amount}</span>
            <span className="text-[#A3A3A3] text-right relative z-10">{ask.total}</span>
          </div>
        ))}
      </div>

      {/* Spread */}
      <div className="px-4 py-3 bg-[#171717] border-y border-[#2F2F2F]">
        <div className="flex items-center justify-between">
          <span className="text-xs text-[#A3A3A3]">Spread</span>
          <div className="text-right">
            <p className="text-sm font-bold text-white">24.585</p>
            <p className="text-xs text-[#10b981]">0.01 (0.04%)</p>
          </div>
        </div>
      </div>

      {/* Bids (Buy Orders) */}
      <div className="px-4 py-2 space-y-1">
        {bids.map((bid, idx) => (
          <div key={idx} className="relative grid grid-cols-3 text-xs py-1 hover:bg-[#171717] rounded transition-colors cursor-pointer">
            <div className="absolute inset-0 bg-[#10b981] opacity-5 rounded" style={{ width: `${(idx + 1) * 20}%` }}></div>
            <span className="text-[#10b981] font-medium relative z-10">{bid.price}</span>
            <span className="text-white text-right relative z-10">{bid.amount}</span>
            <span className="text-[#A3A3A3] text-right relative z-10">{bid.total}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
