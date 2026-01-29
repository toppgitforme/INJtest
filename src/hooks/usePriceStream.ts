import { useEffect, useState } from 'react'
import { IndexerGrpcSpotApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

interface PriceData {
  price: string
  change24h: string
  high24h: string
  low24h: string
  volume24h: string
}

export function usePriceStream(marketId?: string) {
  const [priceData, setPriceData] = useState<PriceData>({
    price: '0',
    change24h: '0',
    high24h: '0',
    low24h: '0',
    volume24h: '0'
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [detailedError, setDetailedError] = useState<string | null>(null)

  useEffect(() => {
    if (!marketId) {
      setIsLoading(false)
      return
    }

    const fetchPrice = async () => {
      try {
        setIsLoading(true)
        setError(null)
        setDetailedError(null)

        const endpoints = getNetworkEndpoints(Network.Mainnet)
        const spotApi = new IndexerGrpcSpotApi(endpoints.indexer)
        
        const market = await spotApi.fetchMarket(marketId)
        
        setPriceData({
          price: market.price || '0',
          change24h: market.changePercentage || '0',
          high24h: market.high || '0',
          low24h: market.low || '0',
          volume24h: market.volume || '0'
        })
        
        setIsLoading(false)
      } catch (err: any) {
        console.error('Price fetch error:', err)
        setError('Failed to fetch market data')
        setDetailedError(JSON.stringify(err, null, 2))
        setIsLoading(false)
      }
    }

    fetchPrice()
    const interval = setInterval(fetchPrice, 5000)

    return () => clearInterval(interval)
  }, [marketId])

  return {
    priceData,
    isLoading,
    currentPrice: parseFloat(priceData.price),
    error,
    detailedError
  }
}
