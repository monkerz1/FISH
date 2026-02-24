'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';
import { AdminSidebar } from '@/components/admin-sidebar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, ChevronDown } from 'lucide-react';

export default function PendingSubmissions() {
  const [stores, setStores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const router = useRouter();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || user.email !== 'killerpings@gmail.com') {
        router.push('/admin/login');
        return;
      }
      const { data } = await supabase
        .from('stores')
        .select('id, name, city, state, address, phone, website, specialty_tags, created_at, verification_status')
        .eq('verification_status', 'flagged_closed')
        .order('created_at', { ascending: false });
      setStores(data || []);
      setLoading(false);
    };
    init();
  }, []);

  const handleApprove = async (id: string) => {
    await supabase.from('stores').update({ verification_status: 'pending_review' }).eq('id', id);
    setStores(prev => prev.filter(s => s.id !== id));
  };

  const handleReject = async (id: string) => {
    await supabase.from('stores').update({ verification_status: 'rejected' }).eq('id', id);
    setStores(prev => prev.filter(s => s.id !== id));
  };

  return (
    <div className="flex h-screen bg-slate-100">
      <AdminSidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <h1 className="text-3xl font-bold mb-2 text-slate-900">Pending Submissions</h1>
          <p className="text-slate-600 mb-8">Stores flagged by the community that need review.</p>

          {loading && <p className="text-slate-500">Loading...</p>}

          {!loading && stores.length === 0 && (
            <Card className="p-8 text-center text-slate-500">
              No pending submissions — you are all caught up! 🎉
            </Card>
          )}

          <div className="space-y-3">
            {stores.map((store) => (
              <Card key={store.id} className="overflow-hidden">
                <div
                  className="p-4 flex items-center justify-between hover:bg-slate-50 cursor-pointer"
                  onClick={() => setExpandedId(expandedId === store.id ? null : store.id)}
                >
                  <div>
                    <h3 className="font-semibold text-slate-900">{store.name}</h3>
                    <p className="text-sm text-slate-600">{store.city}, {store.state}</p>
                    <p className="text-xs text-slate-500">{new Date(store.created_at).toLocaleDateString()}</p>
                  </div>
                  <ChevronDown
                    size={20}
                    className={`text-slate-600 transition-transform ${expandedId === store.id ? 'rotate-180' : ''}`}
                  />
                </div>
                {expandedId === store.id && (
                  <div className="bg-slate-50 border-t border-slate-200 p-4 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-slate-600 uppercase">Address</label>
                        <p className="text-sm text-slate-900 mt-1">{store.address}</p>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-600 uppercase">Phone</label>
                        <p className="text-sm text-slate-900 mt-1">{store.phone || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-600 uppercase">Website</label>
                        <p className="text-sm text-slate-900 mt-1">{store.website || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-600 uppercase">Specialties</label>
                        <p className="text-sm text-slate-900 mt-1">{store.specialty_tags?.join(', ') || 'None'}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 pt-2 border-t border-slate-200">
                      <Button onClick={() => handleApprove(store.id)} className="flex-1 bg-green-600 hover:bg-green-700 text-white">
                        <CheckCircle2 size={18} className="mr-2" /> Keep Open
                      </Button>
                      <Button onClick={() => handleReject(store.id)} className="flex-1 bg-red-600 hover:bg-red-700 text-white">
                        <XCircle size={18} className="mr-2" /> Confirm Closed
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
