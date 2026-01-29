import { Search } from 'lucide-react'
import { useMarketsList } from '../hooks/useMarketsList'

interface MarketSelectorProps {
  onSelectMarket: (marketId: string) => void
  currentMarketId?: string
}

export function MarketSelector({ onSelectMarket, currentMarketId }: MarketSelectorProps) {
  const { markets, isLoading, error } = useMarketsList()

  if (isLoading) {
    return (
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-white">Select Market</h3>
        <div className="text-sm text-[#A3A3A3]">Loading markets...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-white">Select Market</h3>
        <div className="text-sm text-[#ef4444]">{error}</div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-white">Select Market</h3>
      
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A3A3A3]" />
        <input
          type="text"
          placeholder="Search markets..."
          className="w-full bg-[#262626] border border-[#2F2F2F] rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-[#A3A3A3] focus:outline-none focus:border-[#9E7FFF]"
        />
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {markets.map((market) => (
          <button
            key={market.marketId}
            onClick={() => onSelectMarket(market.marketId)}
            className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
              currentMarketId === market.marketId
                ? 'bg-[#9E7FFF] text-white'
                : 'bg-[#262626] text-white hover:bg-[#2F2F2F]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-medium">{market.ticker}</span>
              <span className="text-xs text-[#A3A3A3]">{market.baseSymbol}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
