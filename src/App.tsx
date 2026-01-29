import { useState } from 'react'
import Header from './components/Header'
import MarketTicker from './components/MarketTicker'
import StatsCard from './components/StatsCard'
import OrderBook from './components/OrderBook'
import TradingView from './components/TradingView'
import GridBotPanel from './components/GridBotPanel'
import ActiveBots from './components/ActiveBots'
import GridLevelsTable from './components/GridLevelsTable'
import WalletModal from './components/WalletModal'
import { useWallet } from './hooks/useWallet'
import { useGridBot } from './hooks/useGridBot'
import { usePriceStream } from './hooks/usePriceStream'
import { useMarketsList } from './hooks/useMarketsList'
import { TrendingUp, Activity, Target, Zap } from 'lucide-react'

function App() {
  const [showWalletModal, setShowWalletModal] = useState(false)
  const { walletState, injectiveAddress, connect, disconnect, isConnecting, walletStrategy } = useWallet()
  
  const { 
    config, 
    setConfig, 
    gridLevels, 
    isRunning, 
    isStarting,
    stats, 
    error,
    startBot, 
    stopBot 
  } = useGridBot({ 
    walletStrategy, 
    injectiveAddress 
  })

  const { currentPrice } = usePriceStream()
  const { markets } = useMarketsList()

  const handleConnect = async (walletType: any) => {
    try {
      await connect(walletType)
      setShowWalletModal(false)
    } catch (error) {
      console.error('Connection failed:', error)
    }
  }

  return (
    <div className="min-h-screen bg-[#171717]">
      <Header 
        address={walletState.address}
        onConnect={() => setShowWalletModal(true)}
        onDisconnect={disconnect}
      />
      
      <MarketTicker markets={markets} />

      <main className="max-w-[1920px] mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Profit"
            value={`$${stats.totalProfit.toFixed(2)}`}
            change="+12.5%"
            icon={TrendingUp}
            trend="up"
          />
          <StatsCard
            title="Active Grids"
            value={stats.activeGrids.toString()}
            change={`${gridLevels.length} total`}
            icon={Target}
            trend="neutral"
          />
          <StatsCard
            title="Total Trades"
            value={stats.totalTrades.toString()}
            change={`${stats.winRate.toFixed(1)}% win rate`}
            icon={Activity}
            trend="up"
          />
          <StatsCard
            title="Running Time"
            value={`${Math.floor(stats.runningTime / 60)}m ${stats.runningTime % 60}s`}
            change={isRunning ? 'Active' : 'Stopped'}
            icon={Zap}
            trend={isRunning ? 'up' : 'neutral'}
          />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Left Column - Trading View & Order Book */}
          <div className="lg:col-span-2 space-y-6">
            <TradingView />
            <OrderBook />
          </div>

          {/* Right Column - Grid Bot Panel */}
          <div>
            <GridBotPanel 
              address={walletState.address}
              onStart={startBot}
              onStop={stopBot}
              isRunning={isRunning}
              isStarting={isStarting}
              error={error}
              config={config}
              onConfigChange={setConfig}
            />
          </div>
        </div>

        {/* Grid Levels Table */}
        {gridLevels.length > 0 && (
          <div className="mb-8">
            <GridLevelsTable levels={gridLevels} currentPrice={currentPrice} />
          </div>
        )}

        {/* Active Bots */}
        <ActiveBots isRunning={isRunning} config={config} stats={stats} />

        <WalletModal
          isOpen={showWalletModal}
          onClose={() => setShowWalletModal(false)}
          onSelectWallet={handleConnect}
          isConnecting={isConnecting}
        />
      </main>
    </div>
  )
}

export default App
