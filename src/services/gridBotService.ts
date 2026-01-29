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
    const { upperPrice, lowerPrice, minPrice, gridLevels, investmentAmount, profitRatePerGrid } = config;
    
    // Validate min price
    if (minPrice > lowerPrice) {
      throw new Error('Minimum price cannot be greater than lower price');
    }

    // Calculate price spacing based on profit rate percentage
    // Each grid level should be spaced to achieve the target profit rate
    const profitMultiplier = 1 + (profitRatePerGrid / 100);
    
    const levels: GridLevel[] = [];
    const amountPerGrid = investmentAmount / gridLevels;

    // Calculate geometric spacing with profit rate
    let currentPrice = lowerPrice;
    
    for (let i = 0; i < gridLevels; i++) {
      // Ensure we don't go below min price or above upper price
      if (currentPrice < minPrice) {
        console.warn(`Grid level ${i} price ${currentPrice.toFixed(4)} below min price ${minPrice.toFixed(4)}, adjusting...`);
        currentPrice = minPrice;
      }
      
      if (currentPrice > upperPrice) {
        console.warn(`Grid level ${i} price ${currentPrice.toFixed(4)} above upper price ${upperPrice.toFixed(4)}, stopping grid generation`);
        break;
      }

      levels.push({
        id: `grid-${i}`,
        price: currentPrice,
        buyAmount: amountPerGrid,
        sellAmount: amountPerGrid,
        status: 'pending' as const,
      });

      // Calculate next price level based on profit rate
      currentPrice = currentPrice * profitMultiplier;
    }

    console.log('📊 Calculated infinity grid levels:', {
      count: levels.length,
      priceRange: `${levels[0].price.toFixed(4)} - ${levels[levels.length - 1].price.toFixed(4)}`,
      minPrice: minPrice.toFixed(4),
      profitRatePerGrid: `${profitRatePerGrid}%`,
      spacing: 'geometric with profit rate',
      amountPerGrid: amountPerGrid.toFixed(2),
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
      console.log('📥 Placing', buyOrders.length, 'buy orders with', config.profitRatePerGrid + '% profit target per grid');
      
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
            price: level.price.toFixed(4),
            quantity: quantity.toFixed(4),
            profitTarget: `${config.profitRatePerGrid}%`,
            hash: response.txHash.substring(0, 8) + '...',
          });
        }
      }

      // Place sell orders for upper half of grid
      const sellOrders = gridLevels.slice(midpoint);
      console.log('📤 Placing', sellOrders.length, 'sell orders with', config.profitRatePerGrid + '% profit target per grid');
      
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
            price: level.price.toFixed(4),
            quantity: quantity.toFixed(4),
            profitTarget: `${config.profitRatePerGrid}%`,
            hash: response.txHash.substring(0, 8) + '...',
          });
        }
      }

      console.log('🎯 Infinity grid bot activated:', {
        totalOrders: orderHashes.length,
        profitRatePerGrid: `${config.profitRatePerGrid}%`,
        minPrice: config.minPrice.toFixed(4),
        priceRange: `${config.lowerPrice.toFixed(4)} - ${config.upperPrice.toFixed(4)}`,
      });

      return orderHashes;
    } catch (error) {
      console.error('❌ Failed to place infinity grid orders:', error);
      throw error;
    }
  }

  async cancelAllOrders(
    injectiveAddress: string,
    marketId: string,
    orderHashes: string[]
  ): Promise<void> {
    try {
      console.log('🗑️ Canceling', orderHashes.length, 'infinity grid orders');
      
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

      console.log('✅ All infinity grid orders canceled successfully');
    } catch (error) {
      console.error('❌ Failed to cancel infinity grid orders:', error);
      throw error;
    }
  }

  // Calculate expected profit based on grid configuration
  calculateExpectedProfit(config: GridConfig): number {
    const { investmentAmount, gridLevels, profitRatePerGrid } = config;
    
    // Expected profit per grid level
    const profitPerGrid = (investmentAmount / gridLevels) * (profitRatePerGrid / 100);
    
    // Total expected profit if all grids execute once
    return profitPerGrid * gridLevels;
  }

  // Validate grid configuration
  validateConfig(config: GridConfig): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (config.upperPrice <= config.lowerPrice) {
      errors.push('Upper price must be greater than lower price');
    }

    if (config.minPrice > config.lowerPrice) {
      errors.push('Minimum price cannot be greater than lower price');
    }

    if (config.minPrice <= 0) {
      errors.push('Minimum price must be greater than 0');
    }

    if (config.investmentAmount <= 0) {
      errors.push('Investment amount must be greater than 0');
    }

    if (config.profitRatePerGrid <= 0) {
      errors.push('Profit rate per grid must be greater than 0%');
    }

    if (config.profitRatePerGrid > 10) {
      errors.push('Profit rate per grid should not exceed 10% for optimal grid spacing');
    }

    if (config.gridLevels < 5 || config.gridLevels > 50) {
      errors.push('Grid levels must be between 5 and 50');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}
