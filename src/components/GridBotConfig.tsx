import { Settings, Play } from 'lucide-react'

export function GridBotConfig() {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Settings className="w-5 h-5 text-[#9E7FFF]" />
        <h3 className="text-white font-bold">Grid Configuration</h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm text-[#A3A3A3] mb-2">Price Range</label>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              placeholder="Lower"
              className="bg-[#262626] border border-[#2F2F2F] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#9E7FFF]"
            />
            <input
              type="number"
              placeholder="Upper"
              className="bg-[#262626] border border-[#2F2F2F] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#9E7FFF]"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-[#A3A3A3] mb-2">Grid Levels</label>
          <input
            type="number"
            placeholder="10"
            className="w-full bg-[#262626] border border-[#2F2F2F] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#9E7FFF]"
          />
        </div>

        <div>
          <label className="block text-sm text-[#A3A3A3] mb-2">Investment Amount (USDT)</label>
          <input
            type="number"
            placeholder="1000"
            className="w-full bg-[#262626] border border-[#2F2F2F] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#9E7FFF]"
          />
        </div>

        <button className="w-full bg-gradient-to-r from-[#9E7FFF] to-[#38bdf8] text-white font-bold py-3 rounded-lg flex items-center justify-center space-x-2 hover:opacity-90 transition-opacity">
          <Play className="w-5 h-5" />
          <span>Start Grid Bot</span>
        </button>
      </div>
    </div>
  )
}
