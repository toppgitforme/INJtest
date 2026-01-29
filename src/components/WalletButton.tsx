import { useState } from 'react';
import { Wallet, LogOut } from 'lucide-react';
import WalletModal from './WalletModal';
import { useWallet } from '../hooks/useWallet';
import { Wallet as WalletType } from '@injectivelabs/wallet-base';

export function WalletButton() {
  const [showModal, setShowModal] = useState(false);
  const { walletState, connect, disconnect, isConnecting } = useWallet();

  const handleConnect = async (walletType: WalletType) => {
    try {
      await connect(walletType);
      setShowModal(false);
    } catch (error) {
      console.error('Connection failed:', error);
    }
  };

  if (walletState.isConnected) {
    return (
      <div className="flex items-center space-x-3">
        <div className="px-4 py-2 bg-[#171717] border border-[#2F2F2F] rounded-xl">
          <p className="text-xs text-[#A3A3A3] mb-1">Connected</p>
          <p className="text-sm text-white font-mono">
            {walletState.address.substring(0, 6)}...{walletState.address.substring(walletState.address.length - 4)}
          </p>
        </div>
        <button
          onClick={disconnect}
          className="p-3 bg-[#171717] hover:bg-[#ef4444]/20 border border-[#2F2F2F] hover:border-[#ef4444]/30 rounded-xl transition-all"
        >
          <LogOut className="w-5 h-5 text-[#A3A3A3] hover:text-[#ef4444]" />
        </button>
      </div>
    );
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-[#9E7FFF] to-[#f472b6] rounded-xl font-semibold text-white hover:opacity-90 transition-all hover:scale-105 shadow-lg shadow-[#9E7FFF]/30"
      >
        <Wallet className="w-5 h-5" />
        <span>Connect Wallet</span>
      </button>

      <WalletModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSelectWallet={handleConnect}
        isConnecting={isConnecting}
      />
    </>
  );
}
