import { Store, Globe, RefreshCw } from 'lucide-react';

interface StatsBarProps {
  storeCount?: number;
}

export function StatsBar({ storeCount = 2875 }: StatsBarProps) {
  const displayCount = storeCount.toLocaleString();

  const stats = [
    { label: 'Stores Listed', value: `${displayCount}+`, icon: Store },
    { label: 'All 50 States', value: '50', icon: Globe },
    { label: 'Updated Weekly', value: 'Weekly', icon: RefreshCw },
  ];

  return (
    <section className="w-full bg-white py-12 md:py-16">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="flex flex-col items-center text-center">
                <Icon className="mb-3 h-8 w-8 text-[#4A90D9]" />
                <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                <div className="mt-1 text-gray-600">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}