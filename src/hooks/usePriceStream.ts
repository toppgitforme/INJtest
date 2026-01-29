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

// Default to INJ/USDT market
const DEFAULT_MARKET_ID = '0x0611780ba69656949525013d947713300f56c37b6175e02f26bffa495c3208fe'

export function usePriceStream(marketId?: string) {
  const [priceData, setPriceData] = useState<PriceData>(DEFAULT_PRICE_DATA)
  const [isLoading, setIsLoading] = useState(true)
  const [currentPrice, setCurrentPrice] = useState<number>(0)

  useEffect(() => {
    const activeMarketId = marketId || DEFAULT_MARKET_ID
    let intervalId: NodeJS.Timeout

    const fetchPrice = async () => {
      try {
        const endpoints = getNetworkEndpoints(Network.Mainnet)
        const spotApi = new IndexerGrpcSpotApi(endpoints.indexer)
        
        console.log('Fetching market data for:', activeMarketId)
        
        // Fetch market summary which includes price data
        const market = await spotApi.fetchMarket(activeMarketId)
        
        console.log('Market data received:', market)
        
        if (market) {
          const price = market.price || '0'
          const change = market.changePercentage || '0'
          const high = market.high || '0'
          const low = market.low || '0'
          const volume = market.volume || '0'
          
          console.log('Parsed price data:', { price, change, high, low, volume })
          
          setPriceData({
            price,
            change24h: change,
            high24h: high,
            low24h: low,
            volume24h: volume,
            lastUpdate: Date.now()
          })
          
          setCurrentPrice(parseFloat(price))
        }
        
        setIsLoading(false)
      } catch (err) {
        console.error('Error fetching price:', err)
        setIsLoading(false)
      }
    }

    // Initial fetch
    fetchPrice()

    // Poll every 3 seconds for real-time updates
    intervalId = setInterval(fetchPrice, 3000)

    return () => {
      if (intervalId) {
        clearInterval(intervalId)
      }
    }
  }, [marketId])

  return { priceData, isLoading, currentPrice }
}
