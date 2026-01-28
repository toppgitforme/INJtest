import { X } from 'lucide-react';
import { Wallet } from '@injectivelabs/wallet-base';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectWallet: (wallet: Wallet) => void;
  isConnecting: boolean;
}

const wallets = [
  { type: Wallet.Keplr, name: 'Keplr', icon: '🔷' },
  { type: Wallet.Leap, name: 'Leap', icon: '🦘' },
  { type: Wallet.Metamask, name: 'MetaMask', icon: '🦊' },
  { type: Wallet.Rabby, name: 'Rabby', icon: '🐰' },
];

function WalletModal({ isOpen, onClose, onSelectWallet, isConnecting }: WalletModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md gradient-border p-6 animate-in fade-in zoom-in duration-300">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-[#262626] rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-bold mb-6">Connect Wallet</h2>

        <div className="space-y-3">
          {wallets.map((wallet) => (
            <button
              key={wallet.type}
              onClick={() => onSelectWallet(wallet.type)}
              disabled={isConnecting}
              className="w-full flex items-center gap-4 p-4 bg-[#262626] hover:bg-[#2F2F2F] border border-[#2F2F2F] rounded-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="text-3xl">{wallet.icon}</span>
              <span className="font-semibold text-lg">{wallet.name}</span>
            </button>
          ))}
        </div>

        {isConnecting && (
          <div className="mt-4 text-center text-[#A3A3A3]">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-[#9E7FFF] mb-2"></div>
            <p>Connecting...</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default WalletModal;
