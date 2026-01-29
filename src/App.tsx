import { Grid3x3 } from 'lucide-react';
import { WalletButton } from './components/WalletButton';
import OrderPanel from './components/OrderPanel';
import TradingChart from './components/TradingChart';
import GridBotPanel from './components/GridBotPanel';
import { useWallet } from './hooks/useWallet';
import { useOrderService } from './hooks/useOrderService';
import { useGridBot } from './hooks/useGridBot';
import { OrderSide } from '@injectivelabs/ts-types';
import { useState, useEffect } from 'react';

function App() {
  const [debugInfo, setDebugInfo] = useState<string[]>([]);
  
  const addDebug = (msg: string) => {
    console.log('🔍', msg);
    setDebugInfo(prev => [...prev, msg]);
  };

  useEffect(() => {
    addDebug('App mounted');
  }, []);

  let walletState, injectiveAddress, walletStrategy;
  try {
    const wallet = useWallet();
    walletState = wallet.walletState;
    injectiveAddress = wallet.injectiveAddress;
    walletStrategy = wallet.walletStrategy;
    addDebug('Wallet hook OK');
  } catch (err) {
    addDebug('Wallet hook ERROR: ' + (err as Error).message);
    throw err;
  }

  let orderService;
  try {
    orderService = useOrderService(walletStrategy);
    addDebug('OrderService hook OK');
  } catch (err) {
    addDebug('OrderService hook ERROR: ' + (err as Error).message);
    throw err;
  }
  
  const marketId = '0x0611780ba69656949525013d947713300f56c37b6175e02f26bffa495c3208fe';
  const baseDecimals = 18;
  const quoteDecimals = 6;
  const currentPrice = 24.50;

  let gridBot;
  try {
    gridBot = useGridBot({
      walletStrategy,
      injectiveAddress: injectiveAddress || '',
      currentPrice,
    });
    addDebug('GridBot hook OK');
  } catch (err) {
    addDebug('GridBot hook ERROR: ' + (err as Error).message);
    throw err;
  }

  const {
    config,
    setConfig,
    isRunning,
    isStarting,
    error,
    startBot,
    stopBot,
    calculateExpectedDailyProfit,
  } = gridBot;

  const handlePlaceOrder = async (params: {
    price: number;
    quantity: number;
    orderSide: OrderSide;
    orderType: 'limit' | 'market';
  }) => {
    if (!injectiveAddress) {
      throw new Error('Wallet not connected');
    }

    const orderParams = {
      marketId,
      price: params.price,
      quantity: params.quantity,
      orderSide: params.orderSide,
      baseDecimals,
      quoteDecimals,
    };

    if (params.orderType === 'limit') {
      await orderService.placeLimitOrder(orderParams, injectiveAddress);
    } else {
      const { price, ...marketParams } = orderParams;
      await orderService.placeMarketOrder(marketParams, injectiveAddress);
    }
  };

  return (
    <div className="min-h-screen bg-[#171717]">
      {/* Debug Panel */}
      <div style={{
        position: 'fixed',
        top: '10px',
        right: '10px',
        background: '#000',
        color: '#0f0',
        padding: '10px',
        fontSize: '12px',
        fontFamily: 'monospace',
        zIndex: 9999,
        maxWidth: '300px',
        maxHeight: '200px',
        overflow: 'auto',
        border: '2px solid #0f0'
      }}>
        <div>🔍 DEBUG LOG:</div>
        {debugInfo.map((msg, i) => (
          <div key={i}>{msg}</div>
        ))}
      </div>

      <header className="border-b border-[#2F2F2F] bg-[#262626]/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-[1920px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-[#9E7FFF] to-[#f472b6] rounded-xl">
                <Grid3x3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-[#9E7FFF] to-[#f472b6] bg-clip-text text-transparent">
                  Injective Grid Bot
                </h1>
                <p className="text-xs text-[#A3A3A3]">Automated Grid Trading</p>
              </div>
            </div>
            <WalletButton />
          </div>
        </div>
      </header>

      <main className="max-w-[1920px] mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <OrderPanel
              marketId={marketId}
              baseDecimals={baseDecimals}
              quoteDecimals={quoteDecimals}
              currentPrice={currentPrice}
              onPlaceOrder={handlePlaceOrder}
              isConnected={walletState.isConnected}
            />
            
            <GridBotPanel
              address={injectiveAddress || ''}
              onStart={startBot}
              onStop={stopBot}
              isRunning={isRunning}
              isStarting={isStarting}
              error={error}
              config={config}
              onConfigChange={setConfig}
              expectedProfit={calculateExpectedDailyProfit()}
            />
          </div>

          <div className="lg:col-span-2">
            <TradingChart marketId={marketId} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
