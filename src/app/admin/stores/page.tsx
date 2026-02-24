'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';
import { AdminSidebar } from '@/components/admin-sidebar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Search } from 'lucide-react';

export default function AllStores() {
  const [stores, setStores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 50;
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
      fetchStores();
    };
    init();
  }, [page, search]);

  const fetchStores = async () => {
    setLoading(true);
    let query = supabase
      .from('stores')
      .select('id, name, city, state, phone, website, is_claimed, verification_status, rating, created_at')
      .order('created_at', { ascending: false })
      .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);

    if (search) {
      query = query.ilike('name', `%${search}%`);
    }

    const { data } = await query;
    setStores(data || []);
    setLoading(false);
  };

  return (
    <div className="flex h-screen bg-slate-100">
      <AdminSidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <h1 className="text-3xl font-bold mb-2 text-slate-900">All Stores</h1>
          <p className="text-slate-600 mb-6">Browse and manage all stores in the directory.</p>

          {/* Search */}
          <div className="relative mb-6">
            <Search size={18} className="absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search by store name..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(0); }}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {loading && <p className="text-slate-500">Loading...</p>}

          <Card className="overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left p-4 font-semibold text-slate-600">Store Name</th>
                  <th className="text-left p-4 font-semibold text-slate-600">Location</th>
                  <th className="text-left p-4 font-semibold text-slate-600">Rating</th>
                  <th className="text-left p-4 font-semibold text-slate-600">Status</th>
                  <th className="text-left p-4 font-semibold text-slate-600">Claimed</th>
                  <th className="text-left p-4 font-semibold text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {stores.map((store, i) => (
                  <tr key={store.id} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                    <td className="p-4 font-medium text-slate-900">{store.name}</td>
                    <td className="p-4 text-slate-600">{store.city}, {store.state}</td>
                    <td className="p-4 text-slate-600">{store.rating ? `⭐ ${store.rating}` : '—'}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        store.verification_status === 'flagged_closed' ? 'bg-red-100 text-red-700' :
                        store.verification_status === 'pending_review' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {store.verification_status}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${store.is_claimed ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>
                        {store.is_claimed ? 'Claimed' : 'Unclaimed'}
                      </span>
                    </td>
                    <td className="p-4">
                      {store.website && (
                        <a href={store.website} target="_blank" rel="noopener noreferrer">
                          <Button variant="outline" className="h-8 px-3 text-xs">
                            <ExternalLink size={14} className="mr-1" /> Visit
                          </Button>
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>

          {/* Pagination */}
          <div className="flex items-center gap-4 mt-4">
            <Button variant="outline" disabled={page === 0} onClick={() => setPage(p => p - 1)}>Previous</Button>
            <span className="text-slate-600 text-sm">Page {page + 1}</span>
            <Button variant="outline" disabled={stores.length < PAGE_SIZE} onClick={() => setPage(p => p + 1)}>Next</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
