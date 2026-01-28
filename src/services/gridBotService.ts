import { MsgBroadcaster } from '@injectivelabs/wallet-core';
import { 
  MsgCreateSpotLimitOrder,
  spotPriceToChainPriceToFixed,
  spotQuantityToChainQuantityToFixed,
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
    const priceStep = (upperPrice - lowerPrice) / (gridLevels - 1);
    const amountPerGrid = investmentAmount / gridLevels;

    return Array.from({ length: gridLevels }, (_, i) => ({
      id: `grid-${i}`,
      price: lowerPrice + (priceStep * i),
      buyAmount: amountPerGrid,
      sellAmount: amountPerGrid,
      status: 'pending' as const,
    }));
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
      // Place buy orders for lower half of grid
      const buyOrders = gridLevels.slice(0, Math.floor(gridLevels.length / 2));
      
      for (const level of buyOrders) {
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
            value: level.buyAmount / level.price,
            baseDecimals,
          }),
        });

        const response = await this.msgBroadcaster.broadcast({
          msgs: msg,
          injectiveAddress,
        });

        if (response.txHash) {
          orderHashes.push(response.txHash);
        }
      }

      // Place sell orders for upper half of grid
      const sellOrders = gridLevels.slice(Math.floor(gridLevels.length / 2));
      
      for (const level of sellOrders) {
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
            value: level.sellAmount / level.price,
            baseDecimals,
          }),
        });

        const response = await this.msgBroadcaster.broadcast({
          msgs: msg,
          injectiveAddress,
        });

        if (response.txHash) {
          orderHashes.push(response.txHash);
        }
      }

      return orderHashes;
    } catch (error) {
      console.error('Failed to place grid orders:', error);
      throw error;
    }
  }

  async cancelAllOrders(
    injectiveAddress: string,
    marketId: string,
    orderHashes: string[]
  ): Promise<void> {
    try {
      // Implementation for canceling orders would go here
      // This would use MsgCancelSpotOrder for each order
      console.log('Canceling orders:', orderHashes);
    } catch (error) {
      console.error('Failed to cancel orders:', error);
      throw error;
    }
  }
}
