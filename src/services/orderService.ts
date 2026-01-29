import { MsgBroadcaster } from '@injectivelabs/wallet-core';
import { 
  MsgCreateSpotLimitOrder,
  MsgCreateSpotMarketOrder,
  MsgCancelSpotOrder,
  spotPriceToChainPriceToFixed,
  spotQuantityToChainQuantityToFixed,
} from '@injectivelabs/sdk-ts';
import { Network, getNetworkEndpoints } from '@injectivelabs/networks';
import { WalletStrategy } from '@injectivelabs/wallet-strategy';
import { OrderSide } from '@injectivelabs/ts-types';

export interface OrderParams {
  marketId: string;
  price: number;
  quantity: number;
  orderSide: OrderSide;
  baseDecimals: number;
  quoteDecimals: number;
}

export class OrderService {
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

  async placeLimitOrder(
    params: OrderParams,
    injectiveAddress: string
  ): Promise<string> {
    try {
      const { marketId, price, quantity, orderSide, baseDecimals, quoteDecimals } = params;

      const msg = MsgCreateSpotLimitOrder.fromJSON({
        marketId,
        injectiveAddress,
        orderType: orderSide === OrderSide.Buy ? 1 : 2,
        price: spotPriceToChainPriceToFixed({
          value: price,
          baseDecimals,
          quoteDecimals,
        }),
        quantity: spotQuantityToChainQuantityToFixed({
          value: quantity,
          baseDecimals,
        }),
      });

      console.log('📝 Placing limit order:', {
        side: orderSide === OrderSide.Buy ? 'BUY' : 'SELL',
        price: price.toFixed(4),
        quantity: quantity.toFixed(4),
      });

      const response = await this.msgBroadcaster.broadcast({
        msgs: msg,
        injectiveAddress,
      });

      console.log('✅ Order placed:', response.txHash);
      return response.txHash;
    } catch (error) {
      console.error('❌ Failed to place limit order:', error);
      throw error;
    }
  }

  async placeMarketOrder(
    params: Omit<OrderParams, 'price'>,
    injectiveAddress: string
  ): Promise<string> {
    try {
      const { marketId, quantity, orderSide, baseDecimals } = params;

      const msg = MsgCreateSpotMarketOrder.fromJSON({
        marketId,
        injectiveAddress,
        orderType: orderSide === OrderSide.Buy ? 1 : 2,
        quantity: spotQuantityToChainQuantityToFixed({
          value: quantity,
          baseDecimals,
        }),
      });

      console.log('📝 Placing market order:', {
        side: orderSide === OrderSide.Buy ? 'BUY' : 'SELL',
        quantity: quantity.toFixed(4),
      });

      const response = await this.msgBroadcaster.broadcast({
        msgs: msg,
        injectiveAddress,
      });

      console.log('✅ Market order placed:', response.txHash);
      return response.txHash;
    } catch (error) {
      console.error('❌ Failed to place market order:', error);
      throw error;
    }
  }

  async cancelOrder(
    marketId: string,
    orderHash: string,
    injectiveAddress: string
  ): Promise<void> {
    try {
      const msg = MsgCancelSpotOrder.fromJSON({
        marketId,
        injectiveAddress,
        orderHash,
      });

      await this.msgBroadcaster.broadcast({
        msgs: msg,
        injectiveAddress,
      });

      console.log('✅ Order canceled:', orderHash);
    } catch (error) {
      console.error('❌ Failed to cancel order:', error);
      throw error;
    }
  }
}
