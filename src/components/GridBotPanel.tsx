import { useState } from 'react'
import { Grid3x3, Settings, Play, Square, Info, AlertCircle, Loader2 } from 'lucide-react'

interface GridBotPanelProps {
  address: string
  onStart: () => Promise<void>
  onStop: () => Promise<void>
  isRunning: boolean
  isStarting: boolean
  error: string | null
  config: {
    upperPrice: number
    lowerPrice: number
    gridLevels: number
    investmentAmount: number
  }
  onConfigChange: (config: any) => void
}

export default function GridBotPanel({ 
  address, 
  onStart, 
  onStop, 
  isRunning, 
  isStarting,
  error,
  config,
  onConfigChange 
}: GridBotPanelProps) {
  const [upperPrice, setUpperPrice] = useState(config.upperPrice.toString())
  const [lowerPrice, setLowerPrice] = useState(config.lowerPrice.toString())
  const [gridLevels, setGridLevels] = useState(config.gridLevels.toString())
  const [investment, setInvestment] = useState(config.investmentAmount.toString())

  const calculateProfit = () => {
    const upper = parseFloat(upperPrice) || 0
    const lower = parseFloat(lowerPrice) || 0
    const levels = parseInt(gridLevels) || 0
    const invest = parseFloat(investment) || 0
    
    if (upper <= lower || levels === 0 || invest === 0) return '0.00'
    
    const range = upper - lower
    const profitPerGrid = (range / levels) * 0.001 // 0.1% per grid
    return (profitPerGrid * levels * invest / 100).toFixed(2)
  }

  const handleStart = async () => {
    onConfigChange({
      upperPrice: parseFloat(upperPrice),
      lowerPrice: parseFloat(lowerPrice),
      gridLevels: parseInt(gridLevels),
      investmentAmount: parseFloat(investment),
      tradingPair: 'INJ/USDT',
    })
    await onStart()
  }

  const isConfigValid = () => {
    const upper = parseFloat(upperPrice)
    const lower = parseFloat(lowerPrice)
    const invest = parseFloat(investment)
    return upper > lower && invest > 0 && address
  }

  return (
    <div className="bg-[#262626] border border-[#2F2F2F] rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-[#2F2F2F]">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-[#9E7FFF] to-[#f472b6] rounded-xl">
              <Grid3x3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">Infinity Grid Bot</h3>
              <p className="text-xs text-[#A3A3A3]">Automated grid trading</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {isRunning && (
              <div className="flex items-center space-x-2 px-3 py-1 bg-[#10b981]/10 border border-[#10b981]/30 rounded-lg">
                <div className="w-2 h-2 bg-[#10b981] rounded-full animate-pulse"></div>
                <span className="text-xs text-[#10b981] font-medium">Active</span>
              </div>
            )}
            <button className="p-2 hover:bg-[#171717] rounded-lg transition-colors">
              <Settings className="w-5 h-5 text-[#A3A3A3]" />
            </button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mx-6 mt-6 p-4 bg-[#ef4444]/10 border border-[#ef4444]/30 rounded-xl flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-[#ef4444] flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-[#ef4444] font-medium">Error</p>
            <p className="text-xs text-[#ef4444]/80 mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Configuration */}
      <div className="p-6 space-y-6">
        {/* Price Range */}
        <div>
          <label className="text-sm text-[#A3A3A3] mb-2 block">Price Range</label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-[#A3A3A3] mb-1 block">Upper Price</label>
              <input
                type="text"
                value={upperPrice}
                onChange={(e) => setUpperPrice(e.target.value)}
                disabled={isRunning}
                className="w-full bg-[#171717] border border-[#2F2F2F] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#9E7FFF] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="26.00"
              />
            </div>
            <div>
              <label className="text-xs text-[#A3A3A3] mb-1 block">Lower Price</label>
              <input
                type="text"
                value={lowerPrice}
                onChange={(e) => setLowerPrice(e.target.value)}
                disabled={isRunning}
                className="w-full bg-[#171717] border border-[#2F2F2F] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#9E7FFF] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="23.00"
              />
            </div>
          </div>
        </div>

        {/* Grid Levels */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm text-[#A3A3A3]">Grid Levels</label>
            <span className="text-sm text-white font-medium">{gridLevels}</span>
          </div>
          <input
            type="range"
            min="5"
            max="50"
            value={gridLevels}
            onChange={(e) => setGridLevels(e.target.value)}
            disabled={isRunning}
            className="w-full h-2 bg-[#171717] rounded-lg appearance-none cursor-pointer slider disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: `linear-gradient(to right, #9E7FFF 0%, #9E7FFF ${(parseInt(gridLevels) - 5) / 45 * 100}%, #171717 ${(parseInt(gridLevels) - 5) / 45 * 100}%, #171717 100%)`
            }}
          />
          <div className="flex justify-between text-xs text-[#A3A3A3] mt-1">
            <span>5</span>
            <span>50</span>
          </div>
        </div>

        {/* Investment Amount */}
        <div>
          <label className="text-sm text-[#A3A3A3] mb-2 block">Investment Amount (USDT)</label>
          <div className="relative">
            <input
              type="text"
              value={investment}
              onChange={(e) => setInvestment(e.target.value)}
              disabled={isRunning}
              className="w-full bg-[#171717] border border-[#2F2F2F] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#9E7FFF] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="1000"
            />
            {!isRunning && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex space-x-2">
                <button 
                  onClick={() => setInvestment((parseFloat(investment || '0') * 0.25).toString())}
                  className="px-3 py-1 bg-[#262626] hover:bg-[#2F2F2F] rounded-lg text-xs text-[#A3A3A3] transition-colors"
                >
                  25%
                </button>
                <button 
                  onClick={() => setInvestment((parseFloat(investment || '0') * 0.5).toString())}
                  className="px-3 py-1 bg-[#262626] hover:bg-[#2F2F2F] rounded-lg text-xs text-[#A3A3A3] transition-colors"
                >
                  50%
                </button>
                <button 
                  onClick={() => setInvestment('10000')}
                  className="px-3 py-1 bg-[#262626] hover:bg-[#2F2F2F] rounded-lg text-xs text-[#A3A3A3] transition-colors"
                >
                  MAX
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Profit Estimation */}
        <div className="bg-[#171717] border border-[#2F2F2F] rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-[#A3A3A3]">Estimated Daily Profit</span>
            <Info className="w-4 h-4 text-[#A3A3A3]" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-[#10b981]">${calculateProfit()}</span>
            <span className="text-sm text-[#A3A3A3]">per day</span>
          </div>
          <div className="mt-3 pt-3 border-t border-[#2F2F2F] grid grid-cols-2 gap-4 text-xs">
            <div>
              <p className="text-[#A3A3A3] mb-1">Grid Profit/Trade</p>
              <p className="text-white font-medium">0.1%</p>
            </div>
            <div>
              <p className="text-[#A3A3A3] mb-1">Trades/Day (Est.)</p>
              <p className="text-white font-medium">{parseInt(gridLevels) * 2}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {!isRunning ? (
          <button
            onClick={handleStart}
            disabled={!isConfigValid() || isStarting}
            className={`w-full flex items-center justify-center space-x-2 py-4 rounded-xl font-bold text-white transition-all ${
              isConfigValid() && !isStarting
                ? 'bg-gradient-to-r from-[#9E7FFF] to-[#f472b6] hover:opacity-90 shadow-lg shadow-[#9E7FFF]/30 hover:scale-105'
                : 'bg-[#2F2F2F] cursor-not-allowed opacity-50'
            }`}
          >
            {isStarting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Starting Bot...</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                <span>{address ? 'Start Grid Bot' : 'Connect Wallet to Start'}</span>
              </>
            )}
          </button>
        ) : (
          <button
            onClick={onStop}
            className="w-full flex items-center justify-center space-x-2 py-4 rounded-xl font-bold text-white bg-gradient-to-r from-[#ef4444] to-[#dc2626] hover:opacity-90 shadow-lg shadow-[#ef4444]/30 transition-all hover:scale-105"
          >
            <Square className="w-5 h-5" />
            <span>Stop Grid Bot</span>
          </button>
        )}

        {address && !isRunning && (
          <p className="text-xs text-center text-[#A3A3A3]">
            Bot will execute automatically within the price range
          </p>
        )}

        {isRunning && (
          <p className="text-xs text-center text-[#10b981]">
            Grid bot is actively trading • {gridLevels} levels active
          </p>
        )}
      </div>
    </div>
  )
}
