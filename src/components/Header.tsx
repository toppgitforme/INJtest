import { Zap, Wallet } from 'lucide-react';

interface HeaderProps {
  address: string;
  onConnect: () => void;
  onDisconnect: () => void;
}

export default function Header({ address, onConnect, onDisconnect }: HeaderProps) {
  return (
    <header className="relative overflow-hidden border-b border-[#2F2F2F]">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#9E7FFF]/10 via-[#38bdf8]/10 to-[#f472b6]/10 animate-pulse-slow"></div>
      
      <div className="relative max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-[#9E7FFF] blur-xl opacity-50 animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-[#9E7FFF] to-[#38bdf8] p-3 rounded-2xl">
                <Zap className="w-8 h-8 text-white" strokeWidth={2.5} />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-[#9E7FFF] via-[#38bdf8] to-[#f472b6] bg-clip-text text-transparent">
                Infinity Grid Bot
              </h1>
              <p className="text-[#A3A3A3] text-sm mt-1">Automated Trading on Injective</p>
            </div>
          </div>

          <button
            onClick={address ? onDisconnect : onConnect}
            className="group relative px-6 py-3 bg-gradient-to-r from-[#9E7FFF] to-[#38bdf8] rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-[#9E7FFF]/50 hover:scale-105"
          >
            <div className="flex items-center gap-2">
              <Wallet className="w-5 h-5" />
              <span>
                {address 
                  ? `${address.slice(0, 6)}...${address.slice(-4)}`
                  : 'Connect Wallet'
                }
              </span>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}
