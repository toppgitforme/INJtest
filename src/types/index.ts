export interface GridConfig {
  upperPrice: number
  lowerPrice: number
  gridLevels: number
  investmentAmount: number
  tradingPair: string
}

export interface GridLevel {
  id: string
  price: number
  buyAmount: number
  sellAmount: number
  status: 'pending' | 'active' | 'filled'
  profit?: number
}

export interface BotStats {
  totalProfit: number
  totalTrades: number
  winRate: number
  activeGrids: number
  runningTime: number
}
