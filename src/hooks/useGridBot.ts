import { useState, useCallback, useEffect } from 'react';
import { GridConfig, GridLevel, BotStats } from '../types';
import { GridBotService } from '../services/gridBotService';
import { WalletStrategy } from '@injectivelabs/wallet-strategy';

interface UseGridBotProps {
  walletStrategy: WalletStrategy;
  injectiveAddress: string;
}

export const useGridBot = ({ walletStrategy, injectiveAddress }: UseGridBotProps) => {
  const [config, setConfig] = useState<GridConfig>({
    upperPrice: 26,
    lowerPrice: 23,
    gridLevels: 10,
    investmentAmount: 1000,
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

  const calculateGridLevels = useCallback((cfg: GridConfig): GridLevel[] => {
    return gridBotService.calculateGridLevels(cfg);
  }, [gridBotService]);

  const startBot = useCallback(async () => {
    if (!injectiveAddress) {
      setError('Please connect your wallet first');
      return;
    }

    if (config.upperPrice <= config.lowerPrice) {
      setError('Upper price must be greater than lower price');
      return;
    }

    if (config.investmentAmount <= 0) {
      setError('Investment amount must be greater than 0');
      return;
    }

    setIsStarting(true);
    setError(null);

    try {
      const levels = calculateGridLevels(config);
      setGridLevels(levels);

      // Market ID for INJ/USDT on Injective Mainnet
      const marketId = '0x0611780ba69656949525013d947713300f56c37b6175e02f26bffa495c3208fe';
      const baseDecimals = 18; // INJ decimals
      const quoteDecimals = 6; // USDT decimals

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

      // Start monitoring for filled orders
      startOrderMonitoring();
      
    } catch (err) {
      console.error('Failed to start grid bot:', err);
      setError(err instanceof Error ? err.message : 'Failed to start grid bot');
      setIsRunning(false);
    } finally {
      setIsStarting(false);
    }
  }, [config, injectiveAddress, calculateGridLevels, gridBotService]);

  const stopBot = useCallback(async () => {
    try {
      if (orderHashes.length > 0) {
        const marketId = '0x0611780ba69656949525013d947713300f56c37b6175e02f26bffa495c3208fe';
        await gridBotService.cancelAllOrders(injectiveAddress, marketId, orderHashes);
      }
      
      setIsRunning(false);
      setOrderHashes([]);
      setGridLevels([]);
      setError(null);
    } catch (err) {
      console.error('Failed to stop grid bot:', err);
      setError(err instanceof Error ? err.message : 'Failed to stop grid bot');
    }
  }, [orderHashes, injectiveAddress, gridBotService]);

  const startOrderMonitoring = useCallback(() => {
    // Simulate order monitoring and updates
    const interval = setInterval(() => {
      setGridLevels(prev => {
        const updated = [...prev];
        const activeOrders = updated.filter(l => l.status === 'active');
        
        if (activeOrders.length > 0 && Math.random() > 0.7) {
          const randomIndex = Math.floor(Math.random() * activeOrders.length);
          const level = activeOrders[randomIndex];
          const levelIndex = updated.findIndex(l => l.id === level.id);
          
          if (levelIndex !== -1) {
            updated[levelIndex].status = 'filled';
            updated[levelIndex].profit = Math.random() * 10;
            
            setStats(s => ({
              ...s,
              totalProfit: s.totalProfit + (updated[levelIndex].profit || 0),
              totalTrades: s.totalTrades + 1,
              winRate: ((s.totalTrades + 1) / (s.totalTrades + 1)) * 100,
              activeGrids: updated.filter(l => l.status === 'active').length,
            }));
          }
        }
        
        return updated;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isRunning) {
      const timer = setInterval(() => {
        setStats(s => ({ ...s, runningTime: s.runningTime + 1 }));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isRunning]);

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
  };
};
