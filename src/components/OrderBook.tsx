import { BookOpen } from 'lucide-react'
import { useEffect, useState } from 'react'
import { IndexerGrpcSpotApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'
import { BigNumberInBase } from '@injectivelabs/utils'

interface OrderBookEntry {
  price: string
  amount: string
  total: string
}

interface OrderBookProps {
  marketId?: string
}

export function OrderBook({ marketId }: OrderBookProps) {
  const [bids, setBids] = useState<OrderBookEntry[]>([])
  const [asks, setAsks] = useState<OrderBookEntry[]>([])
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
        
        const [orderbook, market] = await Promise.all([
          spotApi.fetchOrderbookV2(marketId),
          spotApi.fetchMarket(marketId)
        ])
        
        if (isMounted) {
          const quoteDecimals = market.quoteToken.decimals
          const baseDecimals = market.baseToken.decimals

          const formattedBids = orderbook.buys.slice(0, 8).map(order => {
            const price = new BigNumberInBase(order.price)
              .dividedBy(Math.pow(10, quoteDecimals - baseDecimals))
              .toFixed(4)
            const amount = new BigNumberInBase(order.quantity)
              .dividedBy(Math.pow(10, baseDecimals))
              .toFixed(2)
            const total = new BigNumberInBase(order.price)
              .times(order.quantity)
              .dividedBy(Math.pow(10, quoteDecimals + baseDecimals))
              .toFixed(2)
            
            return { price, amount, total }
          })

          const formattedAsks = orderbook.sells.slice(0, 8).map(order => {
            const price = new BigNumberInBase(order.price)
              .dividedBy(Math.pow(10, quoteDecimals - baseDecimals))
              .toFixed(4)
            const amount = new BigNumberInBase(order.quantity)
              .dividedBy(Math.pow(10, baseDecimals))
              .toFixed(2)
            const total = new BigNumberInBase(order.price)
              .times(order.quantity)
              .dividedBy(Math.pow(10, quoteDecimals + baseDecimals))
              .toFixed(2)
            
            return { price, amount, total }
          })

          setBids(formattedBids)
          setAsks(formattedAsks)
          setError(null)
          setIsLoading(false)
        }
      } catch (err: any) {
        if (isMounted) {
          setError('Failed to load orderbook')
          setIsLoading(false)
        }
      }
    }

    fetchOrderBook()
    const intervalId = setInterval(fetchOrderBook, 3000)

    return () => {
      isMounted = false
      clearInterval(intervalId)
    }
  }, [marketId])

  if (isLoading) {
    return (
      <div className="bg-[#262626] border border-[#2F2F2F] rounded-2xl p-6">
        <div className="flex items-center space-x-2 mb-4">
          <BookOpen className="w-5 h-5 text-[#9E7FFF]" />
          <h3 className="text-white font-bold">Order Book</h3>
        </div>
        <div className="text-center text-[#A3A3A3] py-8">Loading orderbook...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-[#262626] border border-[#2F2F2F] rounded-2xl p-6">
        <div className="flex items-center space-x-2 mb-4">
          <BookOpen className="w-5 h-5 text-[#9E7FFF]" />
          <h3 className="text-white font-bold">Order Book</h3>
        </div>
        <div className="text-center text-[#ef4444] py-8">{error}</div>
      </div>
    )
  }

  const spread = asks.length > 0 && bids.length > 0 
    ? new BigNumberInBase(asks[0].price).minus(bids[0].price).toFixed(6)
    : '0'

  const spreadPercent = asks.length > 0 && bids.length > 0
    ? new BigNumberInBase(asks[0].price).minus(bids[0].price).dividedBy(bids[0].price).times(100).toFixed(3)
    : '0'

  return (
    <div className="bg-[#262626] border border-[#2F2F2F] rounded-2xl overflow-hidden">
      <div className="p-4 border-b border-[#2F2F2F]">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-[#9E7FFF]" />
            <h3 className="text-white font-bold">Order Book</h3>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-[#10b981] rounded-full animate-pulse"></div>
            <span className="text-xs text-[#10b981]">Live</span>
          </div>
        </div>
      </div>

      <div className="px-4 py-2 grid grid-cols-3 text-xs text-[#A3A3A3] border-b border-[#2F2F2F]">
        <span>Price (USDT)</span>
        <span className="text-right">Amount</span>
        <span className="text-right">Total</span>
      </div>

      <div className="px-4 py-2 space-y-1">
        {asks.reverse().map((ask, idx) => (
          <div key={idx} className="relative grid grid-cols-3 text-xs py-1 hover:bg-[#171717] rounded transition-colors cursor-pointer">
            <div className="absolute inset-0 bg-[#ef4444] opacity-5 rounded" style={{ width: `${Math.min((idx + 1) * 12, 100)}%` }}></div>
            <span className="text-[#ef4444] font-medium relative z-10">{ask.price}</span>
            <span className="text-white text-right relative z-10">{ask.amount}</span>
            <span className="text-[#A3A3A3] text-right relative z-10">{ask.total}</span>
          </div>
        ))}
      </div>

      <div className="px-4 py-3 bg-[#171717] border-y border-[#2F2F2F]">
        <div className="flex items-center justify-between">
          <span className="text-xs text-[#A3A3A3]">Spread</span>
          <div className="text-right">
            <p className="text-sm font-bold text-white">{spread}</p>
            <p className="text-xs text-[#10b981]">{spreadPercent}%</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-2 space-y-1">
        {bids.map((bid, idx) => (
          <div key={idx} className="relative grid grid-cols-3 text-xs py-1 hover:bg-[#171717] rounded transition-colors cursor-pointer">
            <div className="absolute inset-0 bg-[#10b981] opacity-5 rounded" style={{ width: `${Math.min((idx + 1) * 12, 100)}%` }}></div>
            <span className="text-[#10b981] font-medium relative z-10">{bid.price}</span>
            <span className="text-white text-right relative z-10">{bid.amount}</span>
            <span className="text-[#A3A3A3] text-right relative z-10">{bid.total}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
