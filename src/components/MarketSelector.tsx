import { useState, useEffect } from 'react'
import { Search, ChevronDown } from 'lucide-react'
import { useMarketsList } from '../hooks/useMarketsList'

interface MarketSelectorProps {
  onSelectMarket: (marketId: string) => void
  currentMarketId?: string
}

function MarketSelector({ onSelectMarket, currentMarketId }: MarketSelectorProps) {
  const { markets, isLoading, error } = useMarketsList()
  const [searchTerm, setSearchTerm] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  console.log('MarketSelector render:', { 
    marketsCount: markets.length, 
    isLoading, 
    error, 
    currentMarketId,
    isOpen 
  })

  const filteredMarkets = markets.filter(market =>
    market.ticker.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const currentMarket = markets.find(m => m.marketId === currentMarketId)

  useEffect(() => {
    if (markets.length > 0 && !currentMarketId) {
      const injUsdtMarket = markets.find(m => m.ticker.includes('INJ') && m.ticker.includes('USDT'))
      const defaultMarket = injUsdtMarket || markets[0]
      console.log('Auto-selecting market:', defaultMarket)
      onSelectMarket(defaultMarket.marketId)
    }
  }, [markets, currentMarketId, onSelectMarket])

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    console.log('Button clicked, toggling from', isOpen, 'to', !isOpen)
    setIsOpen(prev => !prev)
  }

  const handleSelectMarket = (marketId: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    console.log('Market button clicked:', marketId)
    onSelectMarket(marketId)
    setIsOpen(false)
  }

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-12 bg-[#2F2F2F] rounded-lg"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-4">
        <p className="text-[#ef4444] text-sm">{error}</p>
      </div>
    )
  }

  console.log('Rendering with markets:', filteredMarkets.length)

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleToggle}
        className="w-full bg-[#171717] border border-[#2F2F2F] rounded-lg px-4 py-3 flex items-center justify-between hover:border-[#9E7FFF] transition-colors cursor-pointer"
      >
        <span className="text-white font-medium">
          {currentMarket?.ticker || 'Select Market'}
        </span>
        <ChevronDown className={`w-5 h-5 text-[#A3A3A3] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[#171717] border border-[#2F2F2F] rounded-lg shadow-xl z-[9999] max-h-96 overflow-hidden">
          <div className="p-3 border-b border-[#2F2F2F]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A3A3A3]" />
              <input
                type="text"
                placeholder="Search markets..."
                value={searchTerm}
                onChange={(e) => {
                  console.log('Search changed:', e.target.value)
                  setSearchTerm(e.target.value)
                }}
                onClick={(e) => e.stopPropagation()}
                className="w-full bg-[#262626] border border-[#2F2F2F] rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-[#A3A3A3] focus:outline-none focus:border-[#9E7FFF]"
              />
            </div>
          </div>

          <div className="overflow-y-auto max-h-80">
            {filteredMarkets.length === 0 ? (
              <div className="p-4 text-center text-[#A3A3A3] text-sm">
                No markets found
              </div>
            ) : (
              filteredMarkets.map((market) => (
                <button
                  key={market.marketId}
                  type="button"
                  onClick={(e) => handleSelectMarket(market.marketId, e)}
                  className={`w-full px-4 py-3 text-left hover:bg-[#262626] transition-colors cursor-pointer ${
                    market.marketId === currentMarketId ? 'bg-[#262626]' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-white font-medium">{market.ticker}</span>
                    {market.marketId === currentMarketId && (
                      <span className="text-[#9E7FFF] text-xs">Selected</span>
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default MarketSelector
