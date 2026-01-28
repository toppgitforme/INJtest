import { useEffect, useState } from 'react'
import { IndexerGrpcSpotApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

interface Market {
  marketId: string
  baseSymbol: string
  quoteSymbol: string
  ticker: string
}

export function useMarketsList() {
  const [markets, setMarkets] = useState<Market[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMarkets = async () => {
      try {
        const endpoints = getNetworkEndpoints(Network.Mainnet)
        const spotApi = new IndexerGrpcSpotApi(endpoints.indexer)
        
        const { markets: marketsList } = await spotApi.fetchMarkets()
        
        const formattedMarkets = marketsList
          .filter(m => m.quoteToken?.symbol === 'USDT' || m.quoteToken?.symbol === 'USDC')
          .slice(0, 10)
          .map(m => ({
            marketId: m.marketId,
            baseSymbol: m.baseToken?.symbol || 'UNKNOWN',
            quoteSymbol: m.quoteToken?.symbol || 'UNKNOWN',
            ticker: m.ticker || `${m.baseToken?.symbol}/${m.quoteToken?.symbol}`
          }))

        setMarkets(formattedMarkets)
        setIsLoading(false)
      } catch (err) {
        console.error('Error fetching markets:', err)
        setError('Failed to fetch markets')
        setIsLoading(false)
        
        // Fallback to mock data
        setMarkets([
          {
            marketId: '0x0611780ba69656949525013d947713300f56c37b6175e02f26bffa495c3208fe',
            baseSymbol: 'INJ',
            quoteSymbol: 'USDT',
            ticker: 'INJ/USDT'
          }
        ])
      }
    }

    fetchMarkets()
  }, [])

  return { markets, isLoading, error }
}
