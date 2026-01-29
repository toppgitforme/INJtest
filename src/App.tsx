import { useState } from 'react'
import { TrendingUp, Settings, Activity } from 'lucide-react'
import { MarketTicker } from './components/MarketTicker'
import { WalletConnect } from './components/WalletConnect'
import { GridBotConfig } from './components/GridBotConfig'
import { ActiveBots } from './components/ActiveBots'

function App() {
  const [activeTab, setActiveTab] = useState<'config' | 'bots' | 'settings'>('config')

  return (
    <div className="min-h-screen bg-[#171717]">
      <MarketTicker />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Injective Grid Bot</h1>
            <p className="text-[#A3A3A3]">Automated grid trading on Injective Protocol</p>
          </div>
          <WalletConnect />
        </div>

        <div className="flex space-x-2 mb-6 border-b border-[#2F2F2F]">
          <button
            onClick={() => setActiveTab('config')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'config'
                ? 'text-[#9E7FFF] border-b-2 border-[#9E7FFF]'
                : 'text-[#A3A3A3] hover:text-white'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Settings className="w-4 h-4" />
              <span>Configuration</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('bots')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'bots'
                ? 'text-[#9E7FFF] border-b-2 border-[#9E7FFF]'
                : 'text-[#A3A3A3] hover:text-white'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4" />
              <span>Active Bots</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'settings'
                ? 'text-[#9E7FFF] border-b-2 border-[#9E7FFF]'
                : 'text-[#A3A3A3] hover:text-white'
            }`}
          >
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4" />
              <span>Settings</span>
            </div>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {activeTab === 'config' && <GridBotConfig />}
            {activeTab === 'bots' && <ActiveBots />}
            {activeTab === 'settings' && (
              <div className="bg-[#262626] rounded-lg p-6">
                <h3 className="text-white font-bold mb-4">Settings</h3>
                <p className="text-[#A3A3A3]">Settings panel coming soon...</p>
              </div>
            )}
          </div>
          
          <div className="space-y-6">
            <div className="bg-[#262626] rounded-lg p-6">
              <h3 className="text-white font-bold mb-4">Market Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-[#A3A3A3]">24h Volume</span>
                  <span className="text-white font-medium">$2.4M</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#A3A3A3]">Active Grids</span>
                  <span className="text-[#10b981] font-medium">3</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#A3A3A3]">Total Profit</span>
                  <span className="text-[#10b981] font-medium">+$124.50</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
