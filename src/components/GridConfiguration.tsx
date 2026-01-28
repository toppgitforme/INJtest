import React from 'react';
import { Settings, TrendingUp, TrendingDown, Grid3x3, DollarSign } from 'lucide-react';
import { GridConfig } from '../types';

interface GridConfigurationProps {
  config: GridConfig;
  onChange: (config: GridConfig) => void;
  onStart: () => void;
  onStop: () => void;
  isRunning: boolean;
}

export const GridConfiguration: React.FC<GridConfigurationProps> = ({
  config,
  onChange,
  onStart,
  onStop,
  isRunning,
}) => {
  return (
    <div className="gradient-border p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-gradient-to-br from-[#9E7FFF] to-[#38bdf8]">
          <Settings className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-xl font-bold">Grid Configuration</h2>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="flex items-center gap-2 text-sm text-[#A3A3A3] mb-2">
              <TrendingUp className="w-4 h-4 text-[#10b981]" />
              Upper Price (USDT)
            </label>
            <input
              type="number"
              value={config.upperPrice || ''}
              onChange={(e) => onChange({ ...config, upperPrice: parseFloat(e.target.value) || 0 })}
              className="w-full bg-[#262626] border border-[#2F2F2F] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#9E7FFF] transition-colors"
              placeholder="0.00"
              disabled={isRunning}
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm text-[#A3A3A3] mb-2">
              <TrendingDown className="w-4 h-4 text-[#ef4444]" />
              Lower Price (USDT)
            </label>
            <input
              type="number"
              value={config.lowerPrice || ''}
              onChange={(e) => onChange({ ...config, lowerPrice: parseFloat(e.target.value) || 0 })}
              className="w-full bg-[#262626] border border-[#2F2F2F] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#9E7FFF] transition-colors"
              placeholder="0.00"
              disabled={isRunning}
            />
          </div>
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm text-[#A3A3A3] mb-2">
            <Grid3x3 className="w-4 h-4 text-[#38bdf8]" />
            Grid Levels: {config.gridLevels}
          </label>
          <input
            type="range"
            min="5"
            max="50"
            value={config.gridLevels}
            onChange={(e) => onChange({ ...config, gridLevels: parseInt(e.target.value) })}
            className="w-full h-2 bg-[#262626] rounded-lg appearance-none cursor-pointer accent-[#9E7FFF]"
            disabled={isRunning}
          />
          <div className="flex justify-between text-xs text-[#A3A3A3] mt-1">
            <span>5</span>
            <span>50</span>
          </div>
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm text-[#A3A3A3] mb-2">
            <DollarSign className="w-4 h-4 text-[#f472b6]" />
            Investment Amount (USDT)
          </label>
          <input
            type="number"
            value={config.investmentAmount || ''}
            onChange={(e) => onChange({ ...config, investmentAmount: parseFloat(e.target.value) || 0 })}
            className="w-full bg-[#262626] border border-[#2F2F2F] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#9E7FFF] transition-colors"
            placeholder="0.00"
            disabled={isRunning}
          />
        </div>

        <div className="pt-4">
          {!isRunning ? (
            <button
              onClick={onStart}
              disabled={!config.upperPrice || !config.lowerPrice || !config.investmentAmount}
              className="w-full py-4 bg-gradient-to-r from-[#10b981] to-[#059669] rounded-xl font-semibold text-white hover:shadow-lg hover:shadow-[#10b981]/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
            >
              Start Grid Bot
            </button>
          ) : (
            <button
              onClick={onStop}
              className="w-full py-4 bg-gradient-to-r from-[#ef4444] to-[#dc2626] rounded-xl font-semibold text-white hover:shadow-lg hover:shadow-[#ef4444]/50 transition-all duration-300 hover:scale-105"
            >
              Stop Grid Bot
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
