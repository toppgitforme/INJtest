import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon;
  trend: 'up' | 'down' | 'neutral';
}

export default function StatsCard({ title, value, change, icon: Icon, trend }: StatsCardProps) {
  const trendColor = trend === 'up' ? 'text-[#10b981]' : trend === 'down' ? 'text-[#ef4444]' : 'text-[#A3A3A3]';
  
  return (
    <div className="gradient-border p-6 hover:scale-105 transition-transform duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 rounded-xl bg-gradient-to-br from-[#9E7FFF] to-[#38bdf8]">
          <Icon className="w-6 h-6 text-white" strokeWidth={2} />
        </div>
      </div>
      <div className="text-[#A3A3A3] text-sm mb-1">{title}</div>
      <div className="text-2xl font-bold mb-2">{value}</div>
      <div className={`text-sm font-semibold ${trendColor}`}>
        {change}
      </div>
    </div>
  );
}
