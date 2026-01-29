import { useEffect, useState } from 'react'

interface OrderBook {
  buys: Array<{ price: string; quantity: string; timestamp: number }>
  sells: Array<{ price: string; quantity: string; timestamp: number }>
}

interface PriceData {
  price: number
  change24h: number
  high24h: number
  low24h: number
  volume24h: number
}

export function usePriceStream(orderBook?: OrderBook) {
  const [priceData, setPriceData] = useState<PriceData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!orderBook || orderBook.buys.length === 0 || orderBook.sells.length === 0) {
      setIsLoading(false)
      return
    }

    const topBid = parseFloat(orderBook.buys[0].price)
    const topAsk = parseFloat(orderBook.sells[0].price)
    const midPrice = (topBid + topAsk) / 2

    setPriceData({
      price: midPrice,
      change24h: 0,
      high24h: topAsk,
      low24h: topBid,
      volume24h: 0,
    })
    setIsLoading(false)
  }, [orderBook])

  return { priceData, isLoading }
}
