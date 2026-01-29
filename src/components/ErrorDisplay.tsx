import React from 'react'
import { AlertCircle, X } from 'lucide-react'

interface ErrorDisplayProps {
  error: string | null
  detailedError?: string | null
  onDismiss?: () => void
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error, detailedError, onDismiss }) => {
  if (!error) return null

  return (
    <div className="fixed top-20 right-4 max-w-md bg-[#262626] border-2 border-[#ef4444] rounded-lg p-4 shadow-xl z-50">
      <div className="flex items-start space-x-3">
        <AlertCircle className="text-[#ef4444] flex-shrink-0 mt-0.5" size={20} />
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-white mb-2">Error</h3>
          <p className="text-xs text-[#A3A3A3] mb-2">{error}</p>
          {detailedError && (
            <pre className="text-xs text-[#A3A3A3] whitespace-pre-wrap break-words font-mono bg-[#171717] p-2 rounded">
              {detailedError}
            </pre>
          )}
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-[#A3A3A3] hover:text-white flex-shrink-0"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  )
}
