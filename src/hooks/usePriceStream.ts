import { useEffect, useState } from 'react'
import { IndexerGrpcSpotApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

interface PriceData {
  price: string
  change24h: string
  high24h: string
  low24h: string
  volume24h: string
  lastUpdate: number
}

const DEFAULT_PRICE_DATA: PriceData = {
  price: '0.00',
  change24h: '0.00',
  high24h: '0.00',
  low24h: '0.00',
  volume24h: '0',
  lastUpdate: Date.now()
}

export function usePriceStream(marketId: string) {
  const [priceData, setPriceData] = useState<PriceData>(DEFAULT_PRICE_DATA)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!marketId) {
      setIsLoading(false)
      return
    }

    let intervalId: NodeJS.Timeout

    const fetchPrice = async () => {
      try {
        const endpoints = getNetworkEndpoints(Network.Mainnet)
        const spotApi = new IndexerGrpcSpotApi(endpoints.indexer)
        
        const market = await spotApi.fetchMarket(marketId)
        
        if (market) {
          setPriceData({
            price: market.price || '0.00',
            change24h: market.changePercentage || '0.00',
            high24h: market.high || '0.00',
            low24h: market.low || '0.00',
            volume24h: market.volume || '0',
            lastUpdate: Date.now()
          })
        }
        
        setIsLoading(false)
      } catch (err) {
        console.error('Error fetching price:', err)
        setIsLoading(false)
      }
    }

    // Initial fetch
    fetchPrice()

    // Poll every 5 seconds
    intervalId = setInterval(fetchPrice, 5000)

    return () => {
      if (intervalId) {
        clearInterval(intervalId)
      }
    }
  }, [marketId])

  return { priceData, isLoading }
}
