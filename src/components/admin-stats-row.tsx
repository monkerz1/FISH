'use client';

import { TrendingUp, Clock, CheckCircle2, Zap } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface StatCard {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  subtext?: string;
  color: string;
}

interface StatsRowProps {
  totalStores: number;
  pendingReview: number;
  claimedStores: number;
  thisWeekAdded: number;
}

export function StatsRow({ totalStores, pendingReview, claimedStores, thisWeekAdded }: StatsRowProps) {
  const stats: StatCard[] = [
    {
      label: 'Total Stores',
      value: totalStores,
      icon: <Store size={24} />,
      color: 'text-blue-600',
    },
    {
      label: 'Flagged Closed',
      value: pendingReview,
      icon: <Clock size={24} />,
      color: 'text-amber-600',
    },
    {
      label: 'Claimed Stores',
      value: claimedStores,
      icon: <CheckCircle2 size={24} />,
      color: 'text-green-600',
    },
    {
      label: 'Unclaimed Stores',
      value: thisWeekAdded,
      icon: <Zap size={24} />,
      color: 'text-purple-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat) => (
        <Card key={stat.label} className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 mb-2">{stat.label}</p>
              <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
              {stat.subtext && <p className="text-xs text-slate-500 mt-2">{stat.subtext}</p>}
            </div>
            <div className={`${stat.color} opacity-80`}>{stat.icon}</div>
          </div>
        </Card>
      ))}
    </div>
  );
}

import { Store } from 'lucide-react';
