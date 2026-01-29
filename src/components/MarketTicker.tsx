import { TrendingUp, TrendingDown, AlertCircle } from 'lucide-react'
import { usePriceStream } from '../hooks/usePriceStream'

const TickerItem: React.FC<{ marketId: string; pair: string }> = ({ marketId, pair }) => {
  const { priceData, isLoading, error } = usePriceStream(marketId)
  const isUp = parseFloat(priceData.change24h) >= 0

  if (isLoading) {
    return (
      <div className="flex items-center space-x-3 min-w-fit animate-pulse">
        <span className="text-sm font-medium text-white">{pair}</span>
        <span className="text-sm text-[#A3A3A3]">Loading...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center space-x-2 min-w-fit">
        <span className="text-sm font-medium text-white">{pair}</span>
        <AlertCircle size={14} className="text-[#ef4444]" />
        <span className="text-xs text-[#ef4444]">Error</span>
      </div>
    )
  }

  const displayPrice = parseFloat(priceData.price)
  const displayChange = parseFloat(priceData.change24h)

  if (displayPrice === 0) {
    return (
      <div className="flex items-center space-x-3 min-w-fit">
        <span className="text-sm font-medium text-white">{pair}</span>
        <span className="text-sm text-[#A3A3A3]">Connecting...</span>
      </div>
    )
  }

  return (
    <div className="flex items-center space-x-3 min-w-fit">
      <span className="text-sm font-medium text-white">{pair}</span>
      <span className="text-sm text-white font-mono">
        ${displayPrice.toFixed(displayPrice < 1 ? 6 : 2)}
      </span>
      <div className={`flex items-center space-x-1 ${isUp ? 'text-[#10b981]' : 'text-[#ef4444]'}`}>
        {isUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
        <span className="text-sm font-medium">
          {isUp ? '+' : ''}{displayChange.toFixed(2)}%
        </span>
      </div>
    </div>
  )
}

export function MarketTicker() {
  const topMarkets = [
    { marketId: '0x0611780ba69656949525013d947713300f56c37b6175e02f26bffa495c3208fe', pair: 'INJ/USDT' },
    { marketId: '0x54d4505adef6a5cef26bc403a33d595620ded4e15b9e2bc3dd489b714813366a', pair: 'ATOM/USDT' },
    { marketId: '0x9b9980167ecc3645ff1a5517886652d94a0825e54a77d2057cbbe3ebee015963', pair: 'WETH/USDT' },
    { marketId: '0x2d8b09c6eb8d8d3f2f22e3f7e3c8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e8', pair: 'BTC/USDT' },
    { marketId: '0x1c79dac019f73e4060494ab1b4fcba734350656d6fc4d474f6a238c13c6f9ced', pair: 'WMATIC/USDT' },
  ]

  return (
    <div className="bg-[#262626] border-b border-[#2F2F2F] overflow-hidden">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center space-x-8 overflow-x-auto scrollbar-hide">
          {topMarkets.map((market) => (
            <TickerItem
              key={market.marketId}
              marketId={market.marketId}
              pair={market.pair}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
