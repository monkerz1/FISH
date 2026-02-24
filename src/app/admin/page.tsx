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

const mockRecentlyAdded = [
  { id: '10', name: 'Aquatic Wonders', city: 'Boston', state: 'MA', dateAdded: '2024-02-10' },
  { id: '11', name: 'The Fish Tank', city: 'Chicago', state: 'IL', dateAdded: '2024-02-09' },
  { id: '12', name: 'Marine Life Center', city: 'San Diego', state: 'CA', dateAdded: '2024-02-08' },
  { id: '13', name: 'Freshwater Depot', city: 'Denver', state: 'CO', dateAdded: '2024-02-07' },
  { id: '14', name: 'Reef Specialists', city: 'Tampa', state: 'FL', dateAdded: '2024-02-06' },
  { id: '15', name: 'Garden Aquatics', city: 'Portland', state: 'OR', dateAdded: '2024-02-05' },
  { id: '16', name: 'Specialty Imports', city: 'Austin', state: 'TX', dateAdded: '2024-02-04' },
  { id: '17', name: 'Crystal Waters', city: 'Seattle', state: 'WA', dateAdded: '2024-02-03' },
  { id: '18', name: 'Exotic Fish Co', city: 'New York', state: 'NY', dateAdded: '2024-02-02' },
  { id: '19', name: 'Pet Paradise', city: 'Miami', state: 'FL', dateAdded: '2024-02-01' },
];

export default function AdminDashboard() {
  const [pendingStores, setPendingStores] = useState(mockPendingStores);
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
    };
    checkUser();
  }, []);

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
    // Would call API here
    console.log('Quick add store:', data);
    await new Promise(resolve => setTimeout(resolve, 500));
  };

  return (
    <div className="flex h-screen bg-slate-100">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
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
          <RecentlyAdded stores={mockRecentlyAdded} />

          {/* Quick Add Store */}
          <QuickAddStore onSubmit={handleQuickAdd} />
        </div>
      </div>
    </div>
  );
}
