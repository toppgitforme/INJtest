import { Wallet } from 'lucide-react'

export function WalletConnect() {
  return (
    <button className="flex items-center space-x-2 bg-gradient-to-r from-[#9E7FFF] to-[#38bdf8] text-white px-6 py-2 rounded-lg hover:opacity-90 transition-opacity">
      <Wallet className="w-4 h-4" />
      <span className="font-medium">Connect Wallet</span>
    </button>
  )
}
