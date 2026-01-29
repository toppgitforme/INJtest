import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { GridLevel } from '../types';

interface GridVisualizationProps {
  gridLevels: GridLevel[];
  currentPrice: number;
}

export default function GridVisualization({ gridLevels, currentPrice }: GridVisualizationProps) {
  if (gridLevels.length === 0) {
    return (
      <div className="bg-[#262626] border border-[#2F2F2F] rounded-2xl p-6">
        <h3 className="text-white font-bold mb-4">Grid Visualization</h3>
        <div className="text-center py-12 text-[#A3A3A3]">
          Configure and start the grid bot to see visualization
        </div>
      </div>
    );
  }

  const maxPrice = Math.max(...gridLevels.map(l => l.price));
  const minPrice = Math.min(...gridLevels.map(l => l.price));
  const priceRange = maxPrice - minPrice;

  return (
    <div className="bg-[#262626] border border-[#2F2F2F] rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-white font-bold">Grid Visualization</h3>
        <div className="flex items-center space-x-4 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-[#10b981] rounded-full"></div>
            <span className="text-[#A3A3A3]">Buy</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-[#ef4444] rounded-full"></div>
            <span className="text-[#A3A3A3]">Sell</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-[#f59e0b] rounded-full"></div>
            <span className="text-[#A3A3A3]">Filled</span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {gridLevels.map((level, index) => {
          const position = ((level.price - minPrice) / priceRange) * 100;
          const isBuy = index < gridLevels.length / 2;
          const isNearPrice = Math.abs(level.price - currentPrice) / currentPrice < 0.02;

          return (
            <div
              key={level.id}
              className="relative h-12 bg-[#171717] rounded-lg overflow-hidden group hover:bg-[#1F1F1F] transition-colors"
            >
              {/* Price indicator */}
              <div
                className="absolute top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-white/20 to-transparent"
                style={{ left: `${position}%` }}
              />

              {/* Grid level info */}
              <div className="absolute inset-0 flex items-center justify-between px-4">
                <div className="flex items-center space-x-3">
                  {isBuy ? (
                    <TrendingDown className="w-4 h-4 text-[#10b981]" />
                  ) : (
                    <TrendingUp className="w-4 h-4 text-[#ef4444]" />
                  )}
                  <span className="text-sm text-white font-medium">
                    {level.price.toExponential(4)}
                  </span>
                  {isNearPrice && (
                    <span className="text-xs px-2 py-0.5 bg-[#9E7FFF]/20 text-[#9E7FFF] rounded">
                      Current
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-3 h-3 text-[#A3A3A3]" />
                    <span className="text-xs text-[#A3A3A3]">
                      {(isBuy ? level.buyAmount : level.sellAmount).toFixed(2)}
                    </span>
                  </div>
                  
                  <div className={`px-2 py-1 rounded text-xs font-medium ${
                    level.status === 'filled'
                      ? 'bg-[#f59e0b]/20 text-[#f59e0b]'
                      : level.status === 'active'
                      ? 'bg-[#10b981]/20 text-[#10b981]'
                      : 'bg-[#A3A3A3]/20 text-[#A3A3A3]'
                  }`}>
                    {level.status}
                  </div>

                  {level.profit && (
                    <span className="text-xs text-[#10b981] font-medium">
                      +${level.profit.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>

              {/* Fill animation */}
              {level.status === 'filled' && (
                <div className="absolute inset-0 bg-gradient-to-r from-[#f59e0b]/10 to-transparent animate-pulse" />
              )}
            </div>
          );
        })}
      </div>

      {/* Current price marker */}
      {currentPrice > 0 && (
        <div className="mt-4 p-3 bg-[#171717] border border-[#9E7FFF]/30 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#A3A3A3]">Current Market Price</span>
            <span className="text-sm text-white font-bold">
              {currentPrice.toExponential(4)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
