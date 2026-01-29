import { useState, useEffect } from 'react'
import { Bug, ChevronDown, ChevronUp } from 'lucide-react'

interface DebugPanelProps {
  markets?: any[]
  selectedMarketId?: string
  isLoading?: boolean
  error?: string | null
  lastClickEvent?: string
}

// Capture console logs
const consoleLogs: string[] = []
const originalLog = console.log
const originalError = console.error

console.log = (...args: any[]) => {
  const message = args.map(arg => 
    typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
  ).join(' ')
  consoleLogs.push(`[LOG] ${new Date().toLocaleTimeString()}: ${message}`)
  if (consoleLogs.length > 20) consoleLogs.shift()
  originalLog(...args)
}

console.error = (...args: any[]) => {
  const message = args.map(arg => 
    typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
  ).join(' ')
  consoleLogs.push(`[ERROR] ${new Date().toLocaleTimeString()}: ${message}`)
  if (consoleLogs.length > 20) consoleLogs.shift()
  originalError(...args)
}

export default function DebugPanel({ 
  markets = [], 
  selectedMarketId = '', 
  isLoading = false, 
  error = null, 
  lastClickEvent = '' 
}: DebugPanelProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [clickCount, setClickCount] = useState(0)
  const [logs, setLogs] = useState<string[]>([])

  useEffect(() => {
    if (lastClickEvent) {
      setClickCount(prev => prev + 1)
    }
  }, [lastClickEvent])

  useEffect(() => {
    const interval = setInterval(() => {
      setLogs([...consoleLogs])
    }, 500)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed bottom-4 right-4 bg-[#262626] border-2 border-[#9E7FFF] rounded-lg shadow-xl z-50 w-96 max-w-[calc(100vw-2rem)]">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-2 flex items-center justify-between bg-[#9E7FFF] text-white rounded-t-lg"
      >
        <div className="flex items-center gap-2">
          <Bug size={16} />
          <span className="font-semibold text-sm">Debug Panel</span>
        </div>
        {isExpanded ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
      </button>

      {isExpanded && (
        <div className="p-4 space-y-3 text-xs max-h-96 overflow-y-auto">
          <div>
            <span className="text-[#A3A3A3]">Markets Loaded:</span>
            <span className="ml-2 text-white font-mono">{markets.length}</span>
          </div>

          <div>
            <span className="text-[#A3A3A3]">Selected Market:</span>
            <span className="ml-2 text-white font-mono break-all">
              {selectedMarketId || 'NONE'}
            </span>
          </div>

          <div>
            <span className="text-[#A3A3A3]">Loading:</span>
            <span className="ml-2 text-white font-mono">{isLoading ? 'YES' : 'NO'}</span>
          </div>

          {error && (
            <div className="border-t border-[#2F2F2F] pt-3">
              <span className="text-[#ef4444] font-semibold">SDK Error Details:</span>
              <div className="mt-2 text-white font-mono bg-[#171717] p-3 rounded break-all text-[10px] leading-relaxed max-h-48 overflow-y-auto">
                {error}
              </div>
            </div>
          )}

          <div>
            <span className="text-[#A3A3A3]">Click Events:</span>
            <span className="ml-2 text-white font-mono">{clickCount}</span>
          </div>

          {lastClickEvent && (
            <div>
              <span className="text-[#A3A3A3]">Last Click:</span>
              <div className="mt-1 text-white font-mono bg-[#171717] p-2 rounded break-all">
                {lastClickEvent}
              </div>
            </div>
          )}

          {logs.length > 0 && (
            <div className="border-t border-[#2F2F2F] pt-3">
              <span className="text-[#38bdf8] font-semibold">Console Logs ({logs.length}):</span>
              <div className="mt-2 space-y-1 max-h-48 overflow-y-auto">
                {logs.map((log, i) => (
                  <div key={i} className="text-white font-mono text-[10px] bg-[#171717] p-2 rounded break-all leading-relaxed">
                    {log}
                  </div>
                ))}
              </div>
            </div>
          )}

          {markets.length > 0 && (
            <div className="border-t border-[#2F2F2F] pt-3">
              <span className="text-[#10b981] font-semibold">First 3 Markets:</span>
              <div className="mt-2 space-y-1">
                {markets.slice(0, 3).map((m, i) => (
                  <div key={i} className="text-white font-mono text-[10px] bg-[#171717] p-2 rounded">
                    {m.ticker} ({m.marketId.substring(0, 20)}...)
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
