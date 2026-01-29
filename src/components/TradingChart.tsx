import { useEffect, useRef, useState } from 'react'
import { TrendingUp, Activity } from 'lucide-react'
import { IndexerGrpcSpotApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

interface TradingChartProps {
  marketId?: string
}

interface Trade {
  price: number
  timestamp: number
}

interface OHLCV {
  time: number
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export default function TradingChart({ marketId }: TradingChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [trades, setTrades] = useState<Trade[]>([])
  const [ohlcvData, setOhlcvData] = useState<OHLCV[]>([])
  const [currentPrice, setCurrentPrice] = useState<number>(0)
  const [priceChange, setPriceChange] = useState<number>(0)
  const [timeframe, setTimeframe] = useState<'1m' | '5m' | '15m' | '1h' | '4h' | '1d'>('15m')
  const [chartType, setChartType] = useState<'line' | 'candle'>('candle')

  // Fetch real-time price data
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

  // Convert trades to OHLCV candlestick data
  useEffect(() => {
    if (trades.length < 2) return

    const timeframeMs = {
      '1m': 60000,
      '5m': 300000,
      '15m': 900000,
      '1h': 3600000,
      '4h': 14400000,
      '1d': 86400000,
    }[timeframe]

    const candles: OHLCV[] = []
    const now = Date.now()
    const startTime = now - (50 * timeframeMs) // Last 50 candles

    for (let i = 0; i < 50; i++) {
      const candleStart = startTime + (i * timeframeMs)
      const candleEnd = candleStart + timeframeMs

      const candleTrades = trades.filter(
        t => t.timestamp >= candleStart && t.timestamp < candleEnd
      )

      if (candleTrades.length > 0) {
        const prices = candleTrades.map(t => t.price)
        candles.push({
          time: candleStart,
          open: candleTrades[0].price,
          high: Math.max(...prices),
          low: Math.min(...prices),
          close: candleTrades[candleTrades.length - 1].price,
          volume: candleTrades.length,
        })
      }
    }

    setOhlcvData(candles)
  }, [trades, timeframe])

  // Render chart
  useEffect(() => {
    if (!canvasRef.current) return
    const data = chartType === 'candle' ? ohlcvData : trades

    if (data.length < 2) return

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
    const padding = 60

    ctx.clearRect(0, 0, width, height)

    // Calculate price range
    let minPrice: number, maxPrice: number
    if (chartType === 'candle') {
      const lows = ohlcvData.map(c => c.low)
      const highs = ohlcvData.map(c => c.high)
      minPrice = Math.min(...lows)
      maxPrice = Math.max(...highs)
    } else {
      const prices = trades.map(t => t.price)
      minPrice = Math.min(...prices)
      maxPrice = Math.max(...prices)
    }
    const priceRange = maxPrice - minPrice || 1

    // Draw grid
    ctx.strokeStyle = '#2F2F2F'
    ctx.lineWidth = 1
    for (let i = 0; i <= 5; i++) {
      const y = padding + (height - 2 * padding) * (i / 5)
      ctx.beginPath()
      ctx.moveTo(padding, y)
      ctx.lineTo(width - padding, y)
      ctx.stroke()
    }

    // Draw price labels
    ctx.fillStyle = '#A3A3A3'
    ctx.font = '11px sans-serif'
    ctx.textAlign = 'right'
    for (let i = 0; i <= 5; i++) {
      const price = maxPrice - (priceRange * i / 5)
      const y = padding + (height - 2 * padding) * (i / 5)
      ctx.fillText(price.toFixed(4), padding - 5, y + 4)
    }

    // Draw time labels
    ctx.textAlign = 'center'
    const timeLabels = chartType === 'candle' ? ohlcvData : trades
    for (let i = 0; i < Math.min(5, timeLabels.length); i++) {
      const index = Math.floor((timeLabels.length - 1) * (i / 4))
      const x = padding + (width - 2 * padding) * (i / 4)
      const time = new Date(
        chartType === 'candle' 
          ? (ohlcvData[index] as OHLCV).time 
          : (trades[index] as Trade).timestamp
      )
      ctx.fillText(
        time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        x,
        height - padding + 20
      )
    }

    if (chartType === 'candle') {
      // Draw candlesticks
      const candleWidth = (width - 2 * padding) / ohlcvData.length * 0.8
      
      ohlcvData.forEach((candle, i) => {
        const x = padding + (width - 2 * padding) * (i / (ohlcvData.length - 1))
        const yHigh = height - padding - ((candle.high - minPrice) / priceRange) * (height - 2 * padding)
        const yLow = height - padding - ((candle.low - minPrice) / priceRange) * (height - 2 * padding)
        const yOpen = height - padding - ((candle.open - minPrice) / priceRange) * (height - 2 * padding)
        const yClose = height - padding - ((candle.close - minPrice) / priceRange) * (height - 2 * padding)

        const isGreen = candle.close >= candle.open
        ctx.strokeStyle = isGreen ? '#10b981' : '#ef4444'
        ctx.fillStyle = isGreen ? '#10b981' : '#ef4444'

        // Draw wick
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(x, yHigh)
        ctx.lineTo(x, yLow)
        ctx.stroke()

        // Draw body
        const bodyHeight = Math.abs(yClose - yOpen)
        const bodyY = Math.min(yOpen, yClose)
        
        if (bodyHeight < 1) {
          // Doji - draw line
          ctx.lineWidth = 2
          ctx.beginPath()
          ctx.moveTo(x - candleWidth / 2, yClose)
          ctx.lineTo(x + candleWidth / 2, yClose)
          ctx.stroke()
        } else {
          ctx.fillRect(x - candleWidth / 2, bodyY, candleWidth, bodyHeight)
        }
      })
    } else {
      // Draw line chart
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
    }

  }, [trades, ohlcvData, priceChange, chartType])

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
        <div className="flex items-center justify-between mb-4">
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

        {/* Chart Controls */}
        <div className="flex items-center justify-between">
          {/* Timeframe Selector */}
          <div className="flex space-x-1 bg-[#171717] p-1 rounded-lg">
            {(['1m', '5m', '15m', '1h', '4h', '1d'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                  timeframe === tf
                    ? 'bg-[#9E7FFF] text-white'
                    : 'text-[#A3A3A3] hover:text-white'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          {/* Chart Type Selector */}
          <div className="flex space-x-1 bg-[#171717] p-1 rounded-lg">
            <button
              onClick={() => setChartType('line')}
              className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                chartType === 'line'
                  ? 'bg-[#9E7FFF] text-white'
                  : 'text-[#A3A3A3] hover:text-white'
              }`}
            >
              Line
            </button>
            <button
              onClick={() => setChartType('candle')}
              className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                chartType === 'candle'
                  ? 'bg-[#9E7FFF] text-white'
                  : 'text-[#A3A3A3] hover:text-white'
              }`}
            >
              Candle
            </button>
          </div>
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
