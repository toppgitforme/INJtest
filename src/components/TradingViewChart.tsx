import { TrendingUp } from 'lucide-react'

interface TradingViewChartProps {
  currentPrice?: number
}

export function TradingViewChart({ currentPrice }: TradingViewChartProps) {
  return (
    <div className="bg-[#262626] border border-[#2F2F2F] rounded-2xl overflow-hidden">
      <div className="p-4 border-b border-[#2F2F2F]">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-[#9E7FFF]" />
            <h3 className="text-white font-bold">Price Chart</h3>
          </div>
          {currentPrice && currentPrice > 0 && (
            <div className="text-right">
              <p className="text-sm text-[#A3A3A3]">Current Price</p>
              <p className="text-lg font-bold text-white">${currentPrice.toFixed(2)}</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="h-96 flex items-center justify-center bg-[#171717]">
        <div className="text-center">
          <TrendingUp className="w-16 h-16 text-[#9E7FFF] mx-auto mb-4 opacity-50" />
          <p className="text-[#A3A3A3]">Chart visualization coming soon</p>
          <p className="text-sm text-[#A3A3A3] mt-2">TradingView integration in progress</p>
        </div>
      </div>
    </div>
  )
}
