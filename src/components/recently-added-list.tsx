'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Edit2 } from 'lucide-react';
import Link from 'next/link';

interface RecentStore {
  id: string;
  name: string;
  city: string;
  state: string;
  dateAdded: string;
}

interface RecentlyAddedProps {
  stores: RecentStore[];
}

export function RecentlyAdded({ stores }: RecentlyAddedProps) {
  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold mb-4 text-slate-900">Recently Added (Last 10)</h2>
      <Card className="overflow-hidden">
        <div className="divide-y divide-slate-200">
          {stores.map((store) => (
            <div key={store.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition">
              <div>
                <h3 className="font-semibold text-slate-900">{store.name}</h3>
                <p className="text-sm text-slate-600">{store.city}, {store.state}</p>
                <p className="text-xs text-slate-500 mt-1">Added: {store.dateAdded}</p>
              </div>
              <Link href={`/admin/stores/${store.id}/edit`}>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Edit2 size={16} />
                  Edit
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
