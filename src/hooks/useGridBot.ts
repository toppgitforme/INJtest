import { useState, useCallback, useEffect } from 'react';
import { GridConfig, GridLevel, BotStats } from '../types';
import { GridBotService } from '../services/gridBotService';
import { WalletStrategy } from '@injectivelabs/wallet-strategy';

interface UseGridBotProps {
  walletStrategy: WalletStrategy;
  injectiveAddress: string;
  currentPrice: number;
}

export const useGridBot = ({ walletStrategy, injectiveAddress, currentPrice }: UseGridBotProps) => {
  const [config, setConfig] = useState<GridConfig>({
    upperPrice: 0,
    lowerPrice: 0,
    minPrice: 0,
    gridLevels: 10,
    investmentAmount: 1000,
    profitRatePerGrid: 0.5, // Default 0.5% profit per grid
    tradingPair: 'INJ/USDT',
  });

  const [gridLevels, setGridLevels] = useState<GridLevel[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [orderHashes, setOrderHashes] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const [stats, setStats] = useState<BotStats>({
    totalProfit: 0,
    totalTrades: 0,
    winRate: 0,
    activeGrids: 0,
    runningTime: 0,
  });

  const [gridBotService] = useState(() => new GridBotService(walletStrategy));

  // Auto-set price range based on current price
  useEffect(() => {
    if (currentPrice > 0 && config.upperPrice === 0) {
      const range = currentPrice * 0.15; // ±15% range
      const minPriceThreshold = currentPrice * 0.5; // 50% below current as min price
      
      setConfig(prev => ({
        ...prev,
        upperPrice: currentPrice + range,
        lowerPrice: currentPrice - range,
        minPrice: minPriceThreshold,
      }));
    }
  }, [currentPrice, config.upperPrice]);

  const calculateGridLevels = useCallback((cfg: GridConfig): GridLevel[] => {
    return gridBotService.calculateGridLevels(cfg);
  }, [gridBotService]);

  const validateAndStart = useCallback((): { valid: boolean; errors: string[] } => {
    if (!injectiveAddress) {
      return { valid: false, errors: ['Please connect your wallet first'] };
    }

    return gridBotService.validateConfig(config);
  }, [config, injectiveAddress, gridBotService]);

  const startBot = useCallback(async () => {
    const validation = validateAndStart();
    
    if (!validation.valid) {
      setError(validation.errors.join(', '));
      return;
    }

    setIsStarting(true);
    setError(null);

    try {
      const levels = calculateGridLevels(config);
      setGridLevels(levels);

      // Market ID for INJ/USDT on Injective Mainnet
      const marketId = '0xa508cb32923323679f12c6f6f9cfd9a09580c05a5cd2cfde5a98a3a0c9d8f1c3';
      const baseDecimals = 18; // INJ decimals
      const quoteDecimals = 6; // USDT decimals

      console.log('🤖 Starting infinity grid bot with config:', {
        levels: levels.length,
        range: `${config.lowerPrice.toFixed(4)} - ${config.upperPrice.toFixed(4)}`,
        minPrice: config.minPrice.toFixed(4),
        profitRatePerGrid: `${config.profitRatePerGrid}%`,
        investment: config.investmentAmount,
        expectedProfit: gridBotService.calculateExpectedProfit(config).toFixed(2),
      });

      // Place all grid orders
      const hashes = await gridBotService.placeGridOrders(
        config,
        levels,
        injectiveAddress,
        marketId,
        baseDecimals,
        quoteDecimals
      );

      setOrderHashes(hashes);
      setIsRunning(true);
      
      // Update grid levels to active
      setGridLevels(prev => prev.map(level => ({
        ...level,
        status: 'active' as const,
      })));

      console.log('✅ Infinity grid bot started successfully:', {
        ordersPlaced: hashes.length,
        profitRatePerGrid: `${config.profitRatePerGrid}%`,
        minPrice: config.minPrice.toFixed(4),
      });

      // Start monitoring for filled orders
      startOrderMonitoring();
      
    } catch (err) {
      console.error('❌ Failed to start infinity grid bot:', err);
      setError(err instanceof Error ? err.message : 'Failed to start infinity grid bot');
      setIsRunning(false);
    } finally {
      setIsStarting(false);
    }
  }, [config, injectiveAddress, calculateGridLevels, gridBotService, validateAndStart]);

  const stopBot = useCallback(async () => {
    try {
      if (orderHashes.length > 0) {
        const marketId = '0xa508cb32923323679f12c6f6f9cfd9a09580c05a5cd2cfde5a98a3a0c9d8f1c3';
        console.log('🛑 Stopping infinity grid bot, canceling', orderHashes.length, 'orders');
        await gridBotService.cancelAllOrders(injectiveAddress, marketId, orderHashes);
      }
      
      setIsRunning(false);
      setOrderHashes([]);
      setGridLevels([]);
      setError(null);
      console.log('✅ Infinity grid bot stopped successfully');
    } catch (err) {
      console.error('❌ Failed to stop infinity grid bot:', err);
      setError(err instanceof Error ? err.message : 'Failed to stop infinity grid bot');
    }
  }, [orderHashes, injectiveAddress, gridBotService]);

  const startOrderMonitoring = useCallback(() => {
    console.log('👀 Starting infinity grid order monitoring');
    
    // Monitor for filled orders and rebalance grid
    const interval = setInterval(() => {
      setGridLevels(prev => {
        const updated = [...prev];
        const activeOrders = updated.filter(l => l.status === 'active');
        
        // Simulate order fills (replace with real order status checks)
        if (activeOrders.length > 0 && Math.random() > 0.85) {
          const randomIndex = Math.floor(Math.random() * activeOrders.length);
          const level = activeOrders[randomIndex];
          const levelIndex = updated.findIndex(l => l.id === level.id);
          
          if (levelIndex !== -1) {
            const profit = (level.price * (config.profitRatePerGrid / 100)) * level.buyAmount;
            updated[levelIndex].status = 'filled';
            updated[levelIndex].profit = profit;
            
            console.log('💰 Infinity grid filled:', {
              price: level.price.toFixed(4),
              profit: profit.toFixed(4),
              profitRate: `${config.profitRatePerGrid}%`,
            });
            
            setStats(s => ({
              ...s,
              totalProfit: s.totalProfit + profit,
              totalTrades: s.totalTrades + 1,
              winRate: ((s.totalTrades + 1) / (s.totalTrades + 1)) * 100,
              activeGrids: updated.filter(l => l.status === 'active').length,
            }));
          }
        }
        
        return updated;
      });
    }, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, [config.profitRatePerGrid]);

  // Track running time
  useEffect(() => {
    if (isRunning) {
      const timer = setInterval(() => {
        setStats(s => ({ ...s, runningTime: s.runningTime + 1 }));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isRunning]);

  // Calculate expected daily profit
  const calculateExpectedDailyProfit = useCallback(() => {
    if (!isRunning) {
      return gridBotService.calculateExpectedProfit(config);
    }
    return stats.totalProfit;
  }, [config, isRunning, stats.totalProfit, gridBotService]);

  return {
    config,
    setConfig,
    gridLevels,
    isRunning,
    isStarting,
    stats,
    error,
    startBot,
    stopBot,
    calculateExpectedDailyProfit,
    validateConfig: () => gridBotService.validateConfig(config),
  };
};
