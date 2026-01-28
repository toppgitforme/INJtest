import React from 'react'
import { Bot, Pause, Play, Trash2, TrendingUp } from 'lucide-react'

export default function ActiveBots() {
  const bots = [
    {
      id: 1,
      pair: 'INJ/USDT',
      status: 'active',
      investment: '1000',
      profit: '+45.23',
      profitPercent: '+4.52%',
      grids: '10',
      trades: '24',
      runtime: '2d 14h'
    },
    {
      id: 2,
      pair: 'ETH/USDT',
      status: 'active',
      investment: '2500',
      profit: '+128.90',
      profitPercent: '+5.16%',
      grids: '15',
      trades: '42',
      runtime: '5d 8h'
    },
    {
      id: 3,
      pair: 'BTC/USDT',
      status: 'paused',
      investment: '5000',
      profit: '+234.56',
      profitPercent: '+4.69%',
      grids: '20',
      trades: '67',
      runtime: '7d 3h'
    }
  ]

  return (
    <div className="bg-[#262626] border border-[#2F2F2F] rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-[#2F2F2F]">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-[#38bdf8] to-[#9E7FFF] rounded-xl">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">Active Grid Bots</h3>
              <p className="text-xs text-[#A3A3A3]">{bots.filter(b => b.status === 'active').length} running, {bots.filter(b => b.status === 'paused').length} paused</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="px-3 py-1.5 bg-[#171717] rounded-lg">
              <p className="text-xs text-[#A3A3A3]">Total Profit</p>
              <p className="text-sm font-bold text-[#10b981]">+$408.69</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bots List */}
      <div className="divide-y divide-[#2F2F2F]">
        {bots.map((bot) => (
          <div key={bot.id} className="p-6 hover:bg-[#171717] transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#9E7FFF] to-[#f472b6] rounded-full"></div>
                <div>
                  <h4 className="text-white font-bold">{bot.pair}</h4>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      bot.status === 'active' 
                        ? 'bg-[#10b981]/10 text-[#10b981]' 
                        : 'bg-[#f59e0b]/10 text-[#f59e0b]'
                    }`}>
                      {bot.status === 'active' ? '● Active' : '● Paused'}
                    </span>
                    <span className="text-xs text-[#A3A3A3]">{bot.runtime}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button className="p-2 hover:bg-[#262626] rounded-lg transition-colors" title={bot.status === 'active' ? 'Pause' : 'Resume'}>
                  {bot.status === 'active' ? (
                    <Pause className="w-4 h-4 text-[#A3A3A3]" />
                  ) : (
                    <Play className="w-4 h-4 text-[#A3A3A3]" />
                  )}
                </button>
                <button className="p-2 hover:bg-[#262626] rounded-lg transition-colors" title="Stop Bot">
                  <Trash2 className="w-4 h-4 text-[#ef4444]" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-5 gap-4">
              <div className="bg-[#171717] p-3 rounded-xl">
                <p className="text-xs text-[#A3A3A3] mb-1">Investment</p>
                <p className="text-sm font-bold text-white">${bot.investment}</p>
              </div>
              <div className="bg-[#171717] p-3 rounded-xl">
                <p className="text-xs text-[#A3A3A3] mb-1">Profit</p>
                <div className="flex items-center space-x-1">
                  <TrendingUp className="w-3 h-3 text-[#10b981]" />
                  <p className="text-sm font-bold text-[#10b981]">{bot.profit}</p>
                </div>
              </div>
              <div className="bg-[#171717] p-3 rounded-xl">
                <p className="text-xs text-[#A3A3A3] mb-1">ROI</p>
                <p className="text-sm font-bold text-[#10b981]">{bot.profitPercent}</p>
              </div>
              <div className="bg-[#171717] p-3 rounded-xl">
                <p className="text-xs text-[#A3A3A3] mb-1">Grids</p>
                <p className="text-sm font-bold text-white">{bot.grids}</p>
              </div>
              <div className="bg-[#171717] p-3 rounded-xl">
                <p className="text-xs text-[#A3A3A3] mb-1">Trades</p>
                <p className="text-sm font-bold text-white">{bot.trades}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
