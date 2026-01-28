import React, { useState } from 'react'
import { TrendingUp, TrendingDown, Activity } from 'lucide-react'

export default function TradingView() {
  const [timeframe, setTimeframe] = useState('1H')
  const timeframes = ['5M', '15M', '1H', '4H', '1D', '1W']

  return (
    <div className="bg-[#262626] border border-[#2F2F2F] rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-[#2F2F2F]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-[#9E7FFF] to-[#f472b6] rounded-full"></div>
              <div>
                <h3 className="text-white font-bold text-lg">INJ/USDT</h3>
                <p className="text-xs text-[#A3A3A3]">Injective Protocol</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div>
              <p className="text-2xl font-bold text-white">$24.58</p>
              <div className="flex items-center space-x-1 text-[#10b981]">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm font-medium">+5.24%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-[#171717] p-3 rounded-xl">
            <p className="text-xs text-[#A3A3A3] mb-1">24h High</p>
            <p className="text-sm font-bold text-white">$25.12</p>
          </div>
          <div className="bg-[#171717] p-3 rounded-xl">
            <p className="text-xs text-[#A3A3A3] mb-1">24h Low</p>
            <p className="text-sm font-bold text-white">$23.45</p>
          </div>
          <div className="bg-[#171717] p-3 rounded-xl">
            <p className="text-xs text-[#A3A3A3] mb-1">24h Volume</p>
            <p className="text-sm font-bold text-white">$12.4M</p>
          </div>
          <div className="bg-[#171717] p-3 rounded-xl">
            <p className="text-xs text-[#A3A3A3] mb-1">Market Cap</p>
            <p className="text-sm font-bold text-white">$2.1B</p>
          </div>
        </div>
      </div>

      {/* Chart Controls */}
      <div className="p-4 border-b border-[#2F2F2F] flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {timeframes.map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                timeframe === tf
                  ? 'bg-[#9E7FFF] text-white'
                  : 'text-[#A3A3A3] hover:text-white hover:bg-[#171717]'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
        
        <button className="flex items-center space-x-2 px-4 py-2 bg-[#171717] hover:bg-[#2F2F2F] rounded-lg transition-colors">
          <Activity className="w-4 h-4 text-[#A3A3A3]" />
          <span className="text-sm text-[#A3A3A3]">Indicators</span>
        </button>
      </div>

      {/* Chart Area */}
      <div className="relative h-96 p-6">
        <div className="absolute inset-0 flex items-center justify-center">
          <img 
            src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=400&fit=crop" 
            alt="Trading Chart"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        
        {/* Simulated Chart Lines */}
        <svg className="absolute inset-0 w-full h-full" style={{ filter: 'drop-shadow(0 0 8px rgba(158, 127, 255, 0.5))' }}>
          <defs>
            <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#9E7FFF" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#9E7FFF" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M 0 300 Q 100 250, 200 280 T 400 240 T 600 200 T 800 180 T 1000 150"
            stroke="#9E7FFF"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M 0 300 Q 100 250, 200 280 T 400 240 T 600 200 T 800 180 T 1000 150 L 1000 400 L 0 400 Z"
            fill="url(#chartGradient)"
          />
        </svg>
      </div>
    </div>
  )
}
