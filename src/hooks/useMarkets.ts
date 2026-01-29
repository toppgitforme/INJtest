import { useEffect, useState } from 'react'
import { IndexerGrpcSpotApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

interface Market {
  marketId: string
  ticker: string
  baseDenom: string
  quoteDenom: string
  baseToken?: {
    name: string
    symbol: string
    decimals: number
  }
  quoteToken?: {
    name: string
    symbol: string
    decimals: number
  }
}

export function useMarkets() {
  const [markets, setMarkets] = useState<Market[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    const fetchMarkets = async () => {
      try {
        const endpoints = getNetworkEndpoints(Network.Mainnet)
        const spotApi = new IndexerGrpcSpotApi(endpoints.indexer)
        
        const response = await spotApi.fetchMarkets()
        
        if (isMounted) {
          const marketsList = Array.isArray(response) ? response : []
          
          if (marketsList.length > 0) {
            const formattedMarkets = marketsList.map((market: any) => ({
              marketId: market.marketId,
              ticker: market.ticker,
              baseDenom: market.baseDenom,
              quoteDenom: market.quoteDenom,
              baseToken: market.baseToken,
              quoteToken: market.quoteToken,
            }))
            
            setMarkets(formattedMarkets)
            setError(null)
          } else {
            setError('No markets available')
          }
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err?.message || 'Failed to load markets')
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    fetchMarkets()

    return () => {
      isMounted = false
    }
  }, [])

  return { markets, isLoading, error }
}
