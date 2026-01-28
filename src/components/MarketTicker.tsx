import React from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { useMarketsList } from '../hooks/useMarketsList'
import { usePriceStream } from '../hooks/usePriceStream'

const TickerItem: React.FC<{ marketId: string; pair: string }> = ({ marketId, pair }) => {
  const { priceData } = usePriceStream(marketId)
  const isUp = parseFloat(priceData.change24h) >= 0

  return (
    <div className="flex items-center space-x-3 min-w-fit">
      <span className="text-sm font-medium text-white">{pair}</span>
      <span className="text-sm text-[#A3A3A3]">
        ${parseFloat(priceData.price).toFixed(4)}
      </span>
      <div className={`flex items-center space-x-1 ${isUp ? 'text-[#10b981]' : 'text-[#ef4444]'}`}>
        {isUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
        <span className="text-sm font-medium">
          {isUp ? '+' : ''}{parseFloat(priceData.change24h).toFixed(2)}%
        </span>
      </div>
    </div>
  )
}

const MarketTicker: React.FC = () => {
  const { markets, isLoading } = useMarketsList()

  if (isLoading) {
    return (
      <div className="bg-[#262626] border-b border-[#2F2F2F]">
        <div className="container mx-auto px-4 py-3">
          <div className="text-sm text-[#A3A3A3] animate-pulse">Loading markets...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#262626] border-b border-[#2F2F2F] overflow-hidden">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center space-x-8 overflow-x-auto scrollbar-hide">
          {markets.slice(0, 5).map((market) => (
            <TickerItem
              key={market.marketId}
              marketId={market.marketId}
              pair={`${market.baseSymbol}/${market.quoteSymbol}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default MarketTicker
