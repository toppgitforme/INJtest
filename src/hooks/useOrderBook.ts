import { useEffect, useState } from 'react'
import { IndexerGrpcSpotApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

interface OrderBookLevel {
  price: string
  quantity: string
  timestamp: number
}

interface OrderBook {
  buys: OrderBookLevel[]
  sells: OrderBookLevel[]
}

export function useOrderBook(marketId?: string) {
  const [orderBook, setOrderBook] = useState<OrderBook>({ buys: [], sells: [] })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!marketId) {
      setIsLoading(false)
      setError('No market selected')
      return
    }

    let isMounted = true

    const fetchOrderBook = async () => {
      try {
        const endpoints = getNetworkEndpoints(Network.Mainnet)
        const spotApi = new IndexerGrpcSpotApi(endpoints.indexer)
        
        const response = await spotApi.fetchOrderbookV2(marketId)
        
        if (isMounted) {
          setOrderBook({
            buys: response.buys.map((order: any) => ({
              price: order.price,
              quantity: order.quantity,
              timestamp: order.timestamp || Date.now(),
            })),
            sells: response.sells.map((order: any) => ({
              price: order.price,
              quantity: order.quantity,
              timestamp: order.timestamp || Date.now(),
            })),
          })
          setError(null)
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err?.message || 'Failed to load order book')
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    fetchOrderBook()
    const interval = setInterval(fetchOrderBook, 3000)

    return () => {
      isMounted = false
      clearInterval(interval)
    }
  }, [marketId])

  return { orderBook, isLoading, error }
}
