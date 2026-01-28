import { Activity, CheckCircle, Clock, TrendingUp } from 'lucide-react';

interface GridLevel {
  id: string;
  price: number;
  buyAmount: number;
  sellAmount: number;
  status: 'pending' | 'active' | 'filled';
  profit?: number;
}

interface GridLevelsTableProps {
  levels: GridLevel[];
  currentPrice: number;
}

const statusConfig = {
  pending: { icon: Clock, color: 'text-[#A3A3A3]', bg: 'bg-[#A3A3A3]/10' },
  active: { icon: Activity, color: 'text-[#38bdf8]', bg: 'bg-[#38bdf8]/10' },
  filled: { icon: CheckCircle, color: 'text-[#10b981]', bg: 'bg-[#10b981]/10' },
};

export default function GridLevelsTable({ levels, currentPrice }: GridLevelsTableProps) {
  return (
    <div className="gradient-border p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-gradient-to-br from-[#38bdf8] to-[#f472b6]">
          <TrendingUp className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-xl font-bold">Active Grid Levels</h2>
        <div className="ml-auto text-sm text-[#A3A3A3]">
          Current Price: <span className="text-white font-mono">${currentPrice.toFixed(2)}</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#2F2F2F]">
              <th className="text-left py-3 px-4 text-sm font-semibold text-[#A3A3A3]">Level</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-[#A3A3A3]">Price</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-[#A3A3A3]">Buy Amount</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-[#A3A3A3]">Sell Amount</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-[#A3A3A3]">Status</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-[#A3A3A3]">Profit</th>
            </tr>
          </thead>
          <tbody>
            {levels.map((level, index) => {
              const StatusIcon = statusConfig[level.status].icon;
              return (
                <tr
                  key={level.id}
                  className="border-b border-[#2F2F2F] hover:bg-[#262626]/50 transition-colors"
                >
                  <td className="py-4 px-4 text-sm font-medium">#{index + 1}</td>
                  <td className="py-4 px-4 text-sm font-mono">${level.price.toFixed(2)}</td>
                  <td className="py-4 px-4 text-sm">{level.buyAmount.toFixed(4)} INJ</td>
                  <td className="py-4 px-4 text-sm">{level.sellAmount.toFixed(4)} INJ</td>
                  <td className="py-4 px-4">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${statusConfig[level.status].bg}`}>
                      <StatusIcon className={`w-4 h-4 ${statusConfig[level.status].color}`} />
                      <span className={`text-xs font-medium ${statusConfig[level.status].color} capitalize`}>
                        {level.status}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    {level.profit ? (
                      <span className="text-[#10b981] font-semibold">+${level.profit.toFixed(2)}</span>
                    ) : (
                      <span className="text-[#A3A3A3]">-</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        
        {levels.length === 0 && (
          <div className="text-center py-12 text-[#A3A3A3]">
            <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No active grid levels. Configure and start the bot to begin trading.</p>
          </div>
        )}
      </div>
    </div>
  );
}
