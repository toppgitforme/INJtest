import { useState, useCallback, useMemo } from 'react';
import { ChainId, EvmChainId } from '@injectivelabs/ts-types';
import { Network, getNetworkEndpoints } from '@injectivelabs/networks';
import { WalletStrategy } from '@injectivelabs/wallet-strategy';
import { Wallet } from '@injectivelabs/wallet-base';
import { getInjectiveAddress } from '@injectivelabs/sdk-ts';

const alchemyRpcEndpoint = 'https://sentry.evm-rpc.injective.network/';

const walletStrategy = new WalletStrategy({
  chainId: ChainId.Mainnet,
  evmOptions: {
    rpcUrl: alchemyRpcEndpoint,
    evmChainId: EvmChainId.Mainnet,
  },
  strategies: {},
});

export interface WalletState {
  address: string;
  balance: string;
  isConnected: boolean;
}

export const useWallet = () => {
  const [walletState, setWalletState] = useState<WalletState>({
    address: '',
    balance: '0',
    isConnected: false,
  });
  const [isConnecting, setIsConnecting] = useState(false);

  const injectiveAddress = useMemo(() => {
    if (walletState.address) {
      return getInjectiveAddress(walletState.address);
    }
    return '';
  }, [walletState.address]);

  const connect = useCallback(async (walletType: Wallet) => {
    setIsConnecting(true);
    try {
      walletStrategy.setWallet(walletType);
      const addresses = await walletStrategy.getAddresses();
      
      setWalletState({
        address: addresses[0],
        balance: '0',
        isConnected: true,
      });
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw error;
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    setWalletState({
      address: '',
      balance: '0',
      isConnected: false,
    });
  }, []);

  return {
    walletState,
    injectiveAddress,
    connect,
    disconnect,
    isConnecting,
    walletStrategy,
  };
};
