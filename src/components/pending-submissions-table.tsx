'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle2, XCircle, ChevronDown, Edit2 } from 'lucide-react';

interface PendingStore {
  id: string;
  name: string;
  city: string;
  state: string;
  submittedBy: string;
  submittedDate: string;
  specialties: string[];
  address: string;
  phone?: string;
  website?: string;
}

interface PendingSubmissionsTableProps {
  stores: PendingStore[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onEdit: (id: string) => void;
}

export function PendingSubmissionsTable({
  stores,
  onApprove,
  onReject,
  onEdit,
}: PendingSubmissionsTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold mb-4 text-slate-900">Pending Submissions</h2>
      <div className="space-y-3">
        {stores.map((store) => (
          <Card key={store.id} className="overflow-hidden">
            {/* Main Row */}
            <div className="p-4 flex items-center justify-between hover:bg-slate-50 cursor-pointer transition"
              onClick={() => setExpandedId(expandedId === store.id ? null : store.id)}>
              <div className="flex-1">
                <div className="flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900 truncate">{store.name}</h3>
                    <p className="text-sm text-slate-600">{store.city}, {store.state} • Submitted by {store.submittedBy}</p>
                    <p className="text-xs text-slate-500 mt-1">{store.submittedDate}</p>
                  </div>
                </div>
              </div>
              <button className="ml-4 p-1 hover:bg-slate-100 rounded transition">
                <ChevronDown
                  size={20}
                  className={`text-slate-600 transition-transform ${
                    expandedId === store.id ? 'rotate-180' : ''
                  }`}
                />
              </button>
            </div>

            {/* Expanded Details */}
            {expandedId === store.id && (
              <div className="bg-slate-50 border-t border-slate-200 p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-600 uppercase">Address</label>
                    <p className="text-sm text-slate-900 mt-1">{store.address}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-600 uppercase">Specialties</label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {store.specialties.map((s) => (
                        <span key={s} className="inline-block px-2 py-1 bg-primary text-white text-xs rounded">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                  {store.phone && (
                    <div>
                      <label className="text-xs font-semibold text-slate-600 uppercase">Phone</label>
                      <p className="text-sm text-slate-900 mt-1">{store.phone}</p>
                    </div>
                  )}
                  {store.website && (
                    <div>
                      <label className="text-xs font-semibold text-slate-600 uppercase">Website</label>
                      <p className="text-sm text-slate-900 mt-1 truncate">{store.website}</p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2 border-t border-slate-200">
                  <Button
                    onClick={() => onApprove(store.id)}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 size={18} />
                    Approve
                  </Button>
                  <Button
                    onClick={() => onReject(store.id)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white flex items-center justify-center gap-2"
                  >
                    <XCircle size={18} />
                    Reject
                  </Button>
                  <Button
                    onClick={() => onEdit(store.id)}
                    variant="outline"
                    className="flex-1 flex items-center justify-center gap-2"
                  >
                    <Edit2 size={18} />
                    Edit
                  </Button>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
