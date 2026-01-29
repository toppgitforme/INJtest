import { useState } from 'react';
import { Grid3x3 } from 'lucide-react';
import { WalletButton } from './components/WalletButton';
import OrderPanel from './components/OrderPanel';
import TradingChart from './components/TradingChart';
import { useWallet } from './hooks/useWallet';
import { useOrderService } from './hooks/useOrderService';
import { OrderSide } from '@injectivelabs/ts-types';

function App() {
  const { walletState, injectiveAddress, walletStrategy } = useWallet();
  const orderService = useOrderService(walletStrategy);
  
  // Example market data - replace with real data from useMarkets
  const marketId = '0x0611780ba69656949525013d947713300f56c37b6175e02f26bffa495c3208fe'; // INJ/USDT
  const baseDecimals = 18;
  const quoteDecimals = 6;
  const currentPrice = 24.50;

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
          {/* Order Panel */}
          <div className="lg:col-span-1">
            <OrderPanel
              marketId={marketId}
              baseDecimals={baseDecimals}
              quoteDecimals={quoteDecimals}
              currentPrice={currentPrice}
              onPlaceOrder={handlePlaceOrder}
              isConnected={walletState.isConnected}
            />
          </div>

          {/* Trading Chart */}
          <div className="lg:col-span-2">
            <TradingChart marketId={marketId} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
