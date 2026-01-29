import { useEffect, useRef, useState } from 'react'
import { TrendingUp, Activity } from 'lucide-react'
import { IndexerGrpcSpotApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

interface TradingViewChartProps {
  marketId?: string
}

interface Trade {
  price: number
  timestamp: number
}

export function TradingViewChart({ marketId }: TradingViewChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [trades, setTrades] = useState<Trade[]>([])
  const [currentPrice, setCurrentPrice] = useState<number>(0)
  const [priceChange, setPriceChange] = useState<number>(0)

  useEffect(() => {
    if (!marketId) return

    let isMounted = true
    const endpoints = getNetworkEndpoints(Network.Mainnet)
    const spotApi = new IndexerGrpcSpotApi(endpoints.indexer)

    const fetchData = async () => {
      try {
        const market = await spotApi.fetchMarket(marketId)
        
        if (isMounted && market) {
          const price = parseFloat(market.price || '0')
          const change = parseFloat(market.changePercentage || '0')
          
          setCurrentPrice(price)
          setPriceChange(change)
          
          setTrades(prev => {
            const newTrades = [...prev, { price, timestamp: Date.now() }]
            return newTrades.slice(-100)
          })
        }
      } catch (err) {
        console.error('Chart data fetch error:', err)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 5000)

    return () => {
      isMounted = false
      clearInterval(interval)
    }
  }, [marketId])

  useEffect(() => {
    if (!canvasRef.current || trades.length < 2) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)

    const width = rect.width
    const height = rect.height
    const padding = 40

    ctx.clearRect(0, 0, width, height)

    const prices = trades.map(t => t.price)
    const minPrice = Math.min(...prices)
    const maxPrice = Math.max(...prices)
    const priceRange = maxPrice - minPrice || 1

    // Grid
    ctx.strokeStyle = '#2F2F2F'
    ctx.lineWidth = 1
    for (let i = 0; i <= 5; i++) {
      const y = padding + (height - 2 * padding) * (i / 5)
      ctx.beginPath()
      ctx.moveTo(padding, y)
      ctx.lineTo(width - padding, y)
      ctx.stroke()
    }

    // Price labels
    ctx.fillStyle = '#A3A3A3'
    ctx.font = '11px sans-serif'
    ctx.textAlign = 'right'
    for (let i = 0; i <= 5; i++) {
      const price = maxPrice - (priceRange * i / 5)
      const y = padding + (height - 2 * padding) * (i / 5)
      ctx.fillText(price.toFixed(2), padding - 5, y + 4)
    }

    // Line chart
    ctx.strokeStyle = priceChange >= 0 ? '#10b981' : '#ef4444'
    ctx.lineWidth = 2
    ctx.beginPath()

    trades.forEach((trade, i) => {
      const x = padding + (width - 2 * padding) * (i / (trades.length - 1))
      const y = height - padding - ((trade.price - minPrice) / priceRange) * (height - 2 * padding)
      
      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })

    ctx.stroke()

    // Gradient fill
    const gradient = ctx.createLinearGradient(0, padding, 0, height - padding)
    gradient.addColorStop(0, priceChange >= 0 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)')
    gradient.addColorStop(1, 'rgba(16, 185, 129, 0)')
    
    ctx.fillStyle = gradient
    ctx.lineTo(width - padding, height - padding)
    ctx.lineTo(padding, height - padding)
    ctx.closePath()
    ctx.fill()

  }, [trades, priceChange])

  if (!marketId) {
    return (
      <div className="bg-[#262626] border border-[#2F2F2F] rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-[#2F2F2F]">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-[#9E7FFF]" />
            <h3 className="text-white font-bold">Price Chart</h3>
          </div>
        </div>
        <div className="h-96 flex items-center justify-center bg-[#171717]">
          <div className="text-center">
            <Activity className="w-16 h-16 text-[#9E7FFF] mx-auto mb-4 opacity-50" />
            <p className="text-[#A3A3A3]">Select a market to view chart</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#262626] border border-[#2F2F2F] rounded-2xl overflow-hidden">
      <div className="p-4 border-b border-[#2F2F2F]">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-[#9E7FFF]" />
            <h3 className="text-white font-bold">Price Chart</h3>
          </div>
          {currentPrice > 0 && (
            <div className="text-right">
              <p className="text-sm text-[#A3A3A3]">Current Price</p>
              <div className="flex items-center gap-2">
                <p className="text-lg font-bold text-white">${currentPrice.toFixed(4)}</p>
                <span className={`text-sm font-medium ${priceChange >= 0 ? 'text-[#10b981]' : 'text-[#ef4444]'}`}>
                  {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="h-96 bg-[#171717] p-4">
        <canvas 
          ref={canvasRef}
          className="w-full h-full"
          style={{ width: '100%', height: '100%' }}
        />
      </div>
    </div>
  )
}
