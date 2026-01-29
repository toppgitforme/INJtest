export interface GridConfig {
  upperPrice: number
  lowerPrice: number
  minPrice: number // New: minimum price threshold
  gridLevels: number
  investmentAmount: number
  profitRatePerGrid: number // New: profit rate per grid in percentage (e.g., 0.5 = 0.5%)
  tradingPair: string
}

export interface GridLevel {
  id: string
  price: number
  buyAmount: number
  sellAmount: number
  status: 'pending' | 'active' | 'filled'
  profit?: number
  buyOrderHash?: string
  sellOrderHash?: string
}

export interface BotStats {
  totalProfit: number
  totalTrades: number
  winRate: number
  activeGrids: number
  runningTime: number
}
