import { MsgBroadcaster } from '@injectivelabs/wallet-core';
import { 
  MsgCreateSpotLimitOrder,
  spotPriceToChainPriceToFixed,
  spotQuantityToChainQuantityToFixed,
  MsgCancelSpotOrder,
} from '@injectivelabs/sdk-ts';
import { Network, getNetworkEndpoints } from '@injectivelabs/networks';
import { WalletStrategy } from '@injectivelabs/wallet-strategy';
import { GridConfig, GridLevel } from '../types';

export class GridBotService {
  private msgBroadcaster: MsgBroadcaster;
  private walletStrategy: WalletStrategy;
  private network: Network;

  constructor(walletStrategy: WalletStrategy, network: Network = Network.Mainnet) {
    this.walletStrategy = walletStrategy;
    this.network = network;
    
    this.msgBroadcaster = new MsgBroadcaster({
      walletStrategy,
      simulateTx: true,
      network,
      endpoints: getNetworkEndpoints(network),
      gasBufferCoefficient: 1.2,
    });
  }

  calculateGridLevels(config: GridConfig): GridLevel[] {
    const { upperPrice, lowerPrice, gridLevels, investmentAmount } = config;
    
    // Calculate geometric spacing for better distribution
    const ratio = Math.pow(upperPrice / lowerPrice, 1 / (gridLevels - 1));
    const amountPerGrid = investmentAmount / gridLevels;

    const levels: GridLevel[] = [];
    
    for (let i = 0; i < gridLevels; i++) {
      const price = lowerPrice * Math.pow(ratio, i);
      
      levels.push({
        id: `grid-${i}`,
        price,
        buyAmount: amountPerGrid,
        sellAmount: amountPerGrid,
        status: 'pending' as const,
      });
    }

    console.log('📊 Calculated grid levels:', {
      count: levels.length,
      priceRange: `${levels[0].price.toExponential(4)} - ${levels[levels.length - 1].price.toExponential(4)}`,
      spacing: 'geometric',
      amountPerGrid,
    });

    return levels;
  }

  async placeGridOrders(
    config: GridConfig,
    gridLevels: GridLevel[],
    injectiveAddress: string,
    marketId: string,
    baseDecimals: number,
    quoteDecimals: number
  ): Promise<string[]> {
    const orderHashes: string[] = [];

    try {
      const midpoint = Math.floor(gridLevels.length / 2);
      
      // Place buy orders for lower half of grid
      const buyOrders = gridLevels.slice(0, midpoint);
      console.log('📥 Placing', buyOrders.length, 'buy orders');
      
      for (const level of buyOrders) {
        const quantity = level.buyAmount / level.price;
        
        const msg = MsgCreateSpotLimitOrder.fromJSON({
          marketId,
          injectiveAddress,
          orderType: 1, // Buy
          price: spotPriceToChainPriceToFixed({
            value: level.price,
            baseDecimals,
            quoteDecimals,
          }),
          quantity: spotQuantityToChainQuantityToFixed({
            value: quantity,
            baseDecimals,
          }),
        });

        const response = await this.msgBroadcaster.broadcast({
          msgs: msg,
          injectiveAddress,
        });

        if (response.txHash) {
          orderHashes.push(response.txHash);
          console.log('✅ Buy order placed:', {
            price: level.price.toExponential(4),
            quantity: quantity.toFixed(4),
            hash: response.txHash.substring(0, 8) + '...',
          });
        }
      }

      // Place sell orders for upper half of grid
      const sellOrders = gridLevels.slice(midpoint);
      console.log('📤 Placing', sellOrders.length, 'sell orders');
      
      for (const level of sellOrders) {
        const quantity = level.sellAmount / level.price;
        
        const msg = MsgCreateSpotLimitOrder.fromJSON({
          marketId,
          injectiveAddress,
          orderType: 2, // Sell
          price: spotPriceToChainPriceToFixed({
            value: level.price,
            baseDecimals,
            quoteDecimals,
          }),
          quantity: spotQuantityToChainQuantityToFixed({
            value: quantity,
            baseDecimals,
          }),
        });

        const response = await this.msgBroadcaster.broadcast({
          msgs: msg,
          injectiveAddress,
        });

        if (response.txHash) {
          orderHashes.push(response.txHash);
          console.log('✅ Sell order placed:', {
            price: level.price.toExponential(4),
            quantity: quantity.toFixed(4),
            hash: response.txHash.substring(0, 8) + '...',
          });
        }
      }

      return orderHashes;
    } catch (error) {
      console.error('❌ Failed to place grid orders:', error);
      throw error;
    }
  }

  async cancelAllOrders(
    injectiveAddress: string,
    marketId: string,
    orderHashes: string[]
  ): Promise<void> {
    try {
      console.log('🗑️ Canceling', orderHashes.length, 'orders');
      
      const cancelMsgs = orderHashes.map(orderHash => 
        MsgCancelSpotOrder.fromJSON({
          marketId,
          injectiveAddress,
          orderHash,
        })
      );

      await this.msgBroadcaster.broadcast({
        msgs: cancelMsgs,
        injectiveAddress,
      });

      console.log('✅ All orders canceled successfully');
    } catch (error) {
      console.error('❌ Failed to cancel orders:', error);
      throw error;
    }
  }
}
