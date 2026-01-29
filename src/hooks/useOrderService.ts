import { useMemo } from 'react';
import { OrderService } from '../services/orderService';
import { Network } from '@injectivelabs/networks';
import { WalletStrategy } from '@injectivelabs/wallet-strategy';

export function useOrderService(walletStrategy: WalletStrategy, network: Network = Network.Mainnet) {
  const orderService = useMemo(() => {
    return new OrderService(walletStrategy, network);
  }, [walletStrategy, network]);

  return orderService;
}
