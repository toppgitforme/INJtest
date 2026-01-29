import { Activity, Pause, Trash2 } from 'lucide-react'

export function ActiveBots() {
  const bots = [
    {
      id: 1,
      pair: 'INJ/USDT',
      range: '20.00 - 30.00',
      grids: 15,
      profit: '+12.5%',
      status: 'active'
    },
    {
      id: 2,
      pair: 'ATOM/USDT',
      range: '8.00 - 12.00',
      grids: 10,
      profit: '+8.2%',
      status: 'active'
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Activity className="w-5 h-5 text-[#9E7FFF]" />
        <h3 className="text-white font-bold">Active Bots</h3>
      </div>

      <div className="space-y-3">
        {bots.map((bot) => (
          <div key={bot.id} className="bg-[#262626] border border-[#2F2F2F] rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="text-white font-bold">{bot.pair}</h4>
                <p className="text-sm text-[#A3A3A3]">{bot.grids} grids • {bot.range}</p>
              </div>
              <div className="text-right">
                <p className="text-[#10b981] font-bold">{bot.profit}</p>
                <p className="text-xs text-[#A3A3A3]">Profit</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button className="flex-1 bg-[#171717] hover:bg-[#2F2F2F] text-white py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors">
                <Pause className="w-4 h-4" />
                <span className="text-sm">Pause</span>
              </button>
              <button className="flex-1 bg-[#171717] hover:bg-[#ef4444] text-white py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors">
                <Trash2 className="w-4 h-4" />
                <span className="text-sm">Stop</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
