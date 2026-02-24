'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';
import { AdminSidebar } from '@/components/admin-sidebar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, ChevronDown } from 'lucide-react';

export default function ClaimsQueue() {
  const [claims, setClaims] = useState<any[]>([]);
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
        .from('store_claims')
        .select('*, stores(name, city, state)')
        .eq('status', 'pending')
        .order('submitted_at', { ascending: false });
      setClaims(data || []);
      setLoading(false);
    };
    init();
  }, []);

  const handleApprove = async (id: string, storeId: string) => {
    await supabase.from('store_claims').update({ status: 'approved', reviewed_at: new Date().toISOString() }).eq('id', id);
    await supabase.from('stores').update({ is_claimed: true, claimed_at: new Date().toISOString() }).eq('id', storeId);
    setClaims(prev => prev.filter(c => c.id !== id));
  };

  const handleReject = async (id: string) => {
    await supabase.from('store_claims').update({ status: 'rejected', reviewed_at: new Date().toISOString() }).eq('id', id);
    setClaims(prev => prev.filter(c => c.id !== id));
  };

  return (
    <div className="flex h-screen bg-slate-100">
      <AdminSidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <h1 className="text-3xl font-bold mb-2 text-slate-900">Claims Queue</h1>
          <p className="text-slate-600 mb-8">Store owners waiting for ownership verification.</p>

          {loading && <p className="text-slate-500">Loading...</p>}

          {!loading && claims.length === 0 && (
            <Card className="p-8 text-center text-slate-500">No pending claims — all caught up! 🎉</Card>
          )}

          <div className="space-y-3">
            {claims.map((claim) => (
              <Card key={claim.id} className="overflow-hidden">
                <div
                  className="p-4 flex items-center justify-between hover:bg-slate-50 cursor-pointer"
                  onClick={() => setExpandedId(expandedId === claim.id ? null : claim.id)}
                >
                  <div>
                    <h3 className="font-semibold text-slate-900">{claim.stores?.name || 'Unknown Store'}</h3>
                    <p className="text-sm text-slate-600">{claim.stores?.city}, {claim.stores?.state} • {claim.claimant_name} ({claim.claimant_role})</p>
                    <p className="text-xs text-slate-500">{new Date(claim.submitted_at).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${claim.email_verified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {claim.email_verified ? 'Email Verified' : 'Email Pending'}
                    </span>
                    <ChevronDown size={20} className={`text-slate-600 transition-transform ${expandedId === claim.id ? 'rotate-180' : ''}`} />
                  </div>
                </div>
                {expandedId === claim.id && (
                  <div className="bg-slate-50 border-t border-slate-200 p-4 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-slate-600 uppercase">Claimant Name</label>
                        <p className="text-sm text-slate-900 mt-1">{claim.claimant_name}</p>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-600 uppercase">Email</label>
                        <p className="text-sm text-slate-900 mt-1">{claim.claimant_email}</p>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-600 uppercase">Phone</label>
                        <p className="text-sm text-slate-900 mt-1">{claim.claimant_phone || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-600 uppercase">Role</label>
                        <p className="text-sm text-slate-900 mt-1">{claim.claimant_role}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 pt-2 border-t border-slate-200">
                      <Button onClick={() => handleApprove(claim.id, claim.store_id)} className="flex-1 bg-green-600 hover:bg-green-700 text-white">
                        <CheckCircle2 size={18} className="mr-2" /> Approve Claim
                      </Button>
                      <Button onClick={() => handleReject(claim.id)} className="flex-1 bg-red-600 hover:bg-red-700 text-white">
                        <XCircle size={18} className="mr-2" /> Reject Claim
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
