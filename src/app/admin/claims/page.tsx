'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';
import { AdminSidebar } from '@/components/admin-sidebar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, ChevronDown, Pencil, X } from 'lucide-react';

export default function ClaimsQueue() {
  const [pendingClaims, setPendingClaims] = useState<any[]>([]);
  const [approvedClaims, setApprovedClaims] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingClaim, setEditingClaim] = useState<any | null>(null);
  const [editForm, setEditForm] = useState({ claimant_name: '', claimant_email: '', claimant_phone: '', claimant_role: '' });
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
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
      await loadClaims();
    };
    init();
  }, []);

  const loadClaims = async () => {
    setLoading(true);
    const { data: pending } = await supabase
      .from('store_claims')
      .select('*, stores(id, name, city, state)')
      .eq('status', 'pending')
      .order('submitted_at', { ascending: false });

    const { data: approved } = await supabase
      .from('store_claims')
      .select('*, stores(id, name, city, state)')
      .eq('status', 'approved')
      .order('reviewed_at', { ascending: false });

    setPendingClaims(pending || []);
    setApprovedClaims(approved || []);
    setLoading(false);
  };

  const handleApprove = async (id: string, storeId: string) => {
    const claim = pendingClaims.find(c => c.id === id);
    await fetch('/api/claims/approve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        claimId: id,
        storeId: storeId,
        claimantEmail: claim?.claimant_email,
        claimantName: claim?.claimant_name,
        storeName: claim?.stores?.name,
      }),
    });
    await loadClaims();
  };

  const handleReject = async (id: string) => {
    await supabase.from('store_claims').update({ status: 'rejected', reviewed_at: new Date().toISOString() }).eq('id', id);
    await loadClaims();
  };

  const openEdit = (claim: any) => {
    setEditingClaim(claim);
    setEditForm({
      claimant_name: claim.claimant_name || '',
      claimant_email: claim.claimant_email || '',
      claimant_phone: claim.claimant_phone || '',
      claimant_role: claim.claimant_role || '',
    });
    setSaveMsg('');
  };

  const handleSaveEdit = async () => {
    if (!editingClaim) return;
    setSaving(true);
    await supabase.from('store_claims').update({
      claimant_name: editForm.claimant_name,
      claimant_email: editForm.claimant_email,
      claimant_phone: editForm.claimant_phone,
      claimant_role: editForm.claimant_role,
    }).eq('id', editingClaim.id);
    setSaving(false);
    setSaveMsg('Saved!');
    await loadClaims();
    setTimeout(() => setSaveMsg(''), 2000);
  };
  const handleResendApproval = async () => {
    if (!editingClaim) return
    const res = await fetch('/api/claims/approve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        claimId: editingClaim.id,
        storeId: editingClaim.stores?.id,
        claimantEmail: editingClaim.claimant_email,
        claimantName: editingClaim.claimant_name,
        storeName: editingClaim.stores?.name,
      }),
    })
    if (res.ok) {
      setSaveMsg('Approval email resent!')
      setTimeout(() => setSaveMsg(''), 3000)
    } else {
      setSaveMsg('Failed to resend — check console.')
    }
  }

  const handleRevoke = async () => {
    if (!editingClaim) return;
    if (!confirm('Revoke this claim? The store will go back to unclaimed.')) return;
    await supabase.from('store_claims').update({ status: 'pending', reviewed_at: null }).eq('id', editingClaim.id);
    await supabase.from('stores').update({ is_claimed: false, claimed_at: null, owner_user_id: null }).eq('id', editingClaim.stores?.id);
    setEditingClaim(null);
    await loadClaims();
  };

  const ClaimCard = ({ claim, showActions }: { claim: any, showActions: boolean }) => (
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
            {claim.reviewed_at && (
              <div>
                <label className="text-xs font-semibold text-slate-600 uppercase">Approved On</label>
                <p className="text-sm text-slate-900 mt-1">{new Date(claim.reviewed_at).toLocaleDateString()}</p>
              </div>
            )}
          </div>
          <div className="flex gap-2 pt-2 border-t border-slate-200">
            {showActions ? (
              <>
                <Button onClick={() => handleApprove(claim.id, claim.stores?.id)} className="flex-1 bg-green-600 hover:bg-green-700 text-white">
                  <CheckCircle2 size={18} className="mr-2" /> Approve Claim
                </Button>
                <Button onClick={() => handleReject(claim.id)} className="flex-1 bg-red-600 hover:bg-red-700 text-white">
                  <XCircle size={18} className="mr-2" /> Reject Claim
                </Button>
              </>
            ) : (
              <Button onClick={() => openEdit(claim)} className="flex-1 bg-[#4A90D9] hover:bg-blue-600 text-white">
                <Pencil size={18} className="mr-2" /> Edit / Manage Claim
              </Button>
            )}
          </div>
        </div>
      )}
    </Card>
  );

  return (
    <div className="flex h-screen bg-slate-100">
      <AdminSidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <h1 className="text-3xl font-bold mb-2 text-slate-900">Claims Queue</h1>
          <p className="text-slate-600 mb-8">Manage store ownership claims.</p>

          {loading && <p className="text-slate-500">Loading...</p>}

          {!loading && (
            <>
              {/* PENDING SECTION */}
              <div className="mb-10">
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="text-xl font-bold text-slate-800">Pending Claims</h2>
                  <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2.5 py-1 rounded-full">{pendingClaims.length}</span>
                </div>
                {pendingClaims.length === 0 ? (
                  <Card className="p-6 text-center text-slate-500">No pending claims — all caught up! 🎉</Card>
                ) : (
                  <div className="space-y-3">
                    {pendingClaims.map(claim => <ClaimCard key={claim.id} claim={claim} showActions={true} />)}
                  </div>
                )}
              </div>

              {/* APPROVED SECTION */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="text-xl font-bold text-slate-800">Approved Claims</h2>
                  <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-1 rounded-full">{approvedClaims.length}</span>
                </div>
                {approvedClaims.length === 0 ? (
                  <Card className="p-6 text-center text-slate-500">No approved claims yet.</Card>
                ) : (
                  <div className="space-y-3">
                    {approvedClaims.map(claim => <ClaimCard key={claim.id} claim={claim} showActions={false} />)}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* EDIT MODAL */}
      {editingClaim && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Edit Claim</h2>
                <p className="text-sm text-slate-500 mt-0.5">{editingClaim.stores?.name} — {editingClaim.stores?.city}, {editingClaim.stores?.state}</p>
              </div>
              <button onClick={() => setEditingClaim(null)} className="text-slate-400 hover:text-slate-600">
                <X size={22} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-600 uppercase block mb-1">Owner Name</label>
                <input
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A90D9]"
                  value={editForm.claimant_name}
                  onChange={e => setEditForm(f => ({ ...f, claimant_name: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 uppercase block mb-1">Email</label>
                <input
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A90D9]"
                  value={editForm.claimant_email}
                  onChange={e => setEditForm(f => ({ ...f, claimant_email: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 uppercase block mb-1">Phone</label>
                <input
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A90D9]"
                  value={editForm.claimant_phone}
                  onChange={e => setEditForm(f => ({ ...f, claimant_phone: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 uppercase block mb-1">Role</label>
                <select
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A90D9]"
                  value={editForm.claimant_role}
                  onChange={e => setEditForm(f => ({ ...f, claimant_role: e.target.value }))}
                >
                  <option value="owner">Owner</option>
                  <option value="manager">Manager</option>
                  <option value="employee">Employee</option>
                </select>
              </div>
            </div>
            <div className="p-6 border-t border-slate-200 flex flex-col gap-3">
              <div className="flex gap-2">
                <Button onClick={handleSaveEdit} disabled={saving} className="flex-1 bg-[#4A90D9] hover:bg-blue-600 text-white">
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button onClick={() => setEditingClaim(null)} className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-800">
                  Cancel
                </Button>
              </div>
              {saveMsg && <p className="text-green-600 text-sm text-center font-medium">{saveMsg}</p>}
              <button
                onClick={handleResendApproval}
                className="text-[#4A90D9] hover:text-blue-700 text-sm underline text-center mt-1"
              >
                Resend approval email
              </button>
              <button
                onClick={handleRevoke}
                className="text-red-500 hover:text-red-700 text-sm underline text-center mt-1"
              >
                Revoke this claim (returns store to unclaimed)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
