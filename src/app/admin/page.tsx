'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';
import { AdminSidebar } from '@/components/admin-sidebar';
import { StatsRow } from '@/components/admin-stats-row';
import { PendingSubmissionsTable } from '@/components/pending-submissions-table';
import { RecentlyAdded } from '@/components/recently-added-list';
import { QuickAddStore } from '@/components/quick-add-store';

// Mock data
const mockPendingStores = [
  {
    id: '1',
    name: 'Coral Kingdom',
    city: 'Miami',
    state: 'FL',
    submittedBy: 'John Doe',
    submittedDate: '2024-02-15',
    specialties: ['Saltwater & Reef', 'Corals'],
    address: '123 Ocean Dr, Miami, FL 33139',
    phone: '(305) 555-0123',
    website: 'coralking.com',
  },
  {
    id: '2',
    name: 'Tropical Fish Paradise',
    city: 'Los Angeles',
    state: 'CA',
    submittedBy: 'Jane Smith',
    submittedDate: '2024-02-14',
    specialties: ['Freshwater Fish', 'Live Plants'],
    address: '456 Pet Ave, LA, CA 90001',
    phone: '(213) 555-0456',
    website: 'tropicalfish.com',
  },
  {
    id: '3',
    name: 'Koi Masters',
    city: 'San Jose',
    state: 'CA',
    submittedBy: 'Mike Johnson',
    submittedDate: '2024-02-13',
    specialties: ['Koi & Pond'],
    address: '789 Pond Ln, San Jose, CA 95101',
    phone: '(408) 555-0789',
  },
];


export default function AdminDashboard() {
  const [pendingStores, setPendingStores] = useState<any[]>([]);
  const [recentStores, setRecentStores] = useState<any[]>([]);
  const [stats, setStats] = useState({ totalStores: 0, flaggedClosed: 0, claimedStores: 0, unclaimedStores: 0 });
  const router = useRouter();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const ALLOWED_EMAIL = 'killerpings@gmail.com';
      if (!user || user.email !== ALLOWED_EMAIL) {
        router.push('/admin/login');
        return;
      }
      const [totalRes, flaggedRes, claimedRes, unclaimedRes] = await Promise.all([
        supabase.from('stores').select('*', { count: 'exact', head: true }),
        supabase.from('stores').select('*', { count: 'exact', head: true }).eq('verification_status', 'flagged_closed'),
        supabase.from('stores').select('*', { count: 'exact', head: true }).eq('is_claimed', true),
        supabase.from('stores').select('*', { count: 'exact', head: true }).eq('is_claimed', false),
      ]);
      setStats({
        totalStores: totalRes.count || 0,
        flaggedClosed: flaggedRes.count || 0,
        claimedStores: claimedRes.count || 0,
        unclaimedStores: unclaimedRes.count || 0,
      });

      // Fetch flagged stores for pending submissions table
      const { data: flaggedStores } = await supabase
        .from('stores')
        .select('id, name, city, state, address, phone, website, specialty_tags, created_at')
        .eq('verification_status', 'flagged_closed')
        .order('created_at', { ascending: false });

      // Fetch recently added stores
      await fetchRecentStores();

      if (flaggedStores) {
        setPendingStores(flaggedStores.map(s => ({
          id: s.id,
          name: s.name,
          city: s.city,
          state: s.state,
          address: s.address || '',
          phone: s.phone || '',
          website: s.website || '',
          specialties: s.specialty_tags || [],
          submittedBy: 'Community Report',
          submittedDate: new Date(s.created_at).toLocaleDateString(),
        })));
      }
    };
    checkUser();
  }, []);

  const fetchRecentStores = async () => {
    const { data } = await supabase
      .from('stores')
      .select('id, name, city, state, created_at')
      .order('created_at', { ascending: false })
      .limit(10);
    if (data) {
      setRecentStores(data.map(s => ({
        id: s.id,
        name: s.name,
        city: s.city,
        state: s.state,
        dateAdded: new Date(s.created_at).toLocaleDateString(),
      })));
    }
  };

  const handleApprove = (id: string) => {
    setPendingStores(prev => prev.filter(store => store.id !== id));
    // Would call API here to save approval
  };

  const handleReject = (id: string) => {
    setPendingStores(prev => prev.filter(store => store.id !== id));
    // Would call API here to save rejection
  };

  const handleEdit = (id: string) => {
    // Would navigate to edit page
    console.log('Edit store:', id);
  };

  const handleQuickAdd = async (data: any): Promise<void> => {
    const res = await fetch('/api/admin/add-store', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) {
      alert('Error adding store: ' + result.error);
      throw new Error(result.error);
    }
    // Refresh recently added list
    await fetchRecentStores();
  };

  return (
    <div className="flex h-screen bg-slate-100">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8 pb-16">
          <h1 className="text-3xl font-bold mb-2 text-slate-900">Admin Dashboard</h1>
          <p className="text-slate-600 mb-8">Welcome back! Here's what's happening with your directory.</p>

          {/* Stats Row */}
          <StatsRow
            totalStores={stats.totalStores}
            pendingReview={stats.flaggedClosed}
            claimedStores={stats.claimedStores}
            thisWeekAdded={stats.unclaimedStores}
          />

          {/* Pending Submissions */}
          <PendingSubmissionsTable
            stores={pendingStores}
            onApprove={handleApprove}
            onReject={handleReject}
            onEdit={handleEdit}
          />

          {/* Recently Added */}
          <RecentlyAdded stores={recentStores} />

          {/* Quick Add Store */}
          <QuickAddStore onSubmit={handleQuickAdd} />
        </div>
      </div>
    </div>
  );
}
