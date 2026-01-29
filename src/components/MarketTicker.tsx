import { TrendingUp, TrendingDown } from 'lucide-react'
import { usePriceStream } from '../hooks/usePriceStream'

interface MarketTickerProps {
  marketId?: string
}

function formatPrice(price: number): string {
  if (price === 0) return '0.0000'
  
  // For very small numbers (< 0.0001), use scientific notation
  if (price < 0.0001) {
    return price.toExponential(4)
  }
  
  // For normal numbers, use fixed decimal
  return price.toFixed(4)
}

export function MarketTicker({ marketId }: MarketTickerProps) {
  const { priceData, isLoading, error } = usePriceStream(marketId)

  console.log('MarketTicker - Render:', { marketId, priceData, isLoading, error })

  if (!marketId) {
    return (
      <div className="text-center py-8 text-[#A3A3A3]">
        Select a market to view price data
      </div>
    )
  }

  if (isLoading) {
    console.log('MarketTicker - Showing loading state')
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-[#171717] rounded-lg p-4 animate-pulse">
            <div className="h-4 bg-[#2F2F2F] rounded mb-2"></div>
            <div className="h-6 bg-[#2F2F2F] rounded"></div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    console.log('MarketTicker - Showing error state:', error)
    return (
      <div className="bg-[#171717] rounded-lg p-4">
        <p className="text-[#ef4444] mb-2">Error: {error}</p>
        <p className="text-xs text-[#A3A3A3]">Market ID: {marketId}</p>
        <p className="text-xs text-[#A3A3A3] mt-2">Data: {JSON.stringify(priceData)}</p>
      </div>
    )
  }

  const price = parseFloat(priceData.price)
  const change = parseFloat(priceData.change24h)
  const high = parseFloat(priceData.high24h)
  const low = parseFloat(priceData.low24h)
  const isPositive = change >= 0

  console.log('MarketTicker - Rendering price display:', { price, change, high, low })

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-[#171717] rounded-lg p-4">
        <div className="text-xs text-[#A3A3A3] mb-1">Current Price</div>
        <div className="text-xl font-bold text-white">
          ${formatPrice(price)}
        </div>
      </div>

      <div className="bg-[#171717] rounded-lg p-4">
        <div className="text-xs text-[#A3A3A3] mb-1">24h Change</div>
        <div className={`text-xl font-bold flex items-center gap-1 ${isPositive ? 'text-[#10b981]' : 'text-[#ef4444]'}`}>
          {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          {change.toFixed(2)}%
        </div>
      </div>

      <div className="bg-[#171717] rounded-lg p-4">
        <div className="text-xs text-[#A3A3A3] mb-1">24h High</div>
        <div className="text-xl font-bold text-white">
          ${formatPrice(high)}
        </div>
      </div>

      <div className="bg-[#171717] rounded-lg p-4">
        <div className="text-xs text-[#A3A3A3] mb-1">24h Low</div>
        <div className="text-xl font-bold text-white">
          ${formatPrice(low)}
        </div>
      </div>
    </div>
  )
}
