'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';
import { AdminSidebar } from '@/components/admin-sidebar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle } from 'lucide-react';

export default function ReviewsQueue() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
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
        .from('reviews')
        .select('*, stores(name, city, state)')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });
      setReviews(data || []);
      setLoading(false);
    };
    init();
  }, []);

  const handleApprove = async (id: string) => {
    await supabase.from('reviews').update({ status: 'approved' }).eq('id', id);
    setReviews(prev => prev.filter(r => r.id !== id));
  };

  const handleReject = async (id: string) => {
    await supabase.from('reviews').update({ status: 'rejected' }).eq('id', id);
    setReviews(prev => prev.filter(r => r.id !== id));
  };

  return (
    <div className="flex h-screen bg-slate-100">
      <AdminSidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <h1 className="text-3xl font-bold mb-2 text-slate-900">Reviews Queue</h1>
          <p className="text-slate-600 mb-8">Community reviews waiting for approval.</p>

          {loading && <p className="text-slate-500">Loading...</p>}

          {!loading && reviews.length === 0 && (
            <Card className="p-8 text-center text-slate-500">No pending reviews — all caught up! 🎉</Card>
          )}

          <div className="space-y-3">
            {reviews.map((review) => (
              <Card key={review.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900">{review.stores?.name || 'Unknown Store'}</h3>
                    <p className="text-sm text-slate-500">{review.stores?.city}, {review.stores?.state} • {new Date(review.created_at).toLocaleDateString()}</p>
                    <div className="flex gap-1 my-2">
                      {[1,2,3,4,5].map(star => (
                        <span key={star} className={star <= review.rating ? 'text-yellow-400' : 'text-slate-300'}>★</span>
                      ))}
                    </div>
                    <p className="text-sm text-slate-700 mt-2">{review.comment || review.body || 'No comment provided'}</p>
                    <p className="text-xs text-slate-500 mt-1">By: {review.reviewer_name || review.author || 'Anonymous'}</p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button onClick={() => handleApprove(review.id)} className="bg-green-600 hover:bg-green-700 text-white h-9 px-3">
                      <CheckCircle2 size={16} />
                    </Button>
                    <Button onClick={() => handleReject(review.id)} className="bg-red-600 hover:bg-red-700 text-white h-9 px-3">
                      <XCircle size={16} />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
