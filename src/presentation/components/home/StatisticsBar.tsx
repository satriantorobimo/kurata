import {
  Landmark,
  Users,
  BadgeCheck,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import type { StatisticDTO } from "@/application/dto/StatisticDTO";

const ICON_MAP: Record<string, LucideIcon> = {
  landmark: Landmark,
  users: Users,
  "badge-check": BadgeCheck,
  "trending-up": TrendingUp,
};

interface StatisticsBarProps {
  stats: StatisticDTO[];
}

function StatItem({ stat }: { stat: StatisticDTO }) {
  const Icon = ICON_MAP[stat.icon] ?? TrendingUp;

  return (
    <div className="flex items-center justify-center gap-4 px-4">
      <Icon className="w-8 h-8 text-primary shrink-0" />
      <div>
        <div className="font-headline-sm text-headline-sm text-on-surface">
          {stat.value}
        </div>
        <div className="text-label-sm text-on-surface-variant">
          {stat.label}
        </div>
      </div>
    </div>
  );
}

export function StatisticsBar({ stats }: StatisticsBarProps) {
  return (
    <section className="w-full bg-surface-container-lowest border-y border-border-subtle py-8 mb-section-gap">
      <div className="container-main">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-border-subtle">
          {stats.map((stat) => (
            <StatItem key={stat.id} stat={stat} />
          ))}
        </div>
      </div>
    </section>
  );
}
