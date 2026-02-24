'use client';

import { useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';
import { AdminSidebar } from '@/components/admin-sidebar';
import { Card } from '@/components/ui/card';

export default function Settings() {
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
      }
    };
    init();
  }, []);

  return (
    <div className="flex h-screen bg-slate-100">
      <AdminSidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <h1 className="text-3xl font-bold mb-2 text-slate-900">Settings</h1>
          <p className="text-slate-600 mb-8">Directory configuration and admin settings.</p>

          <div className="grid grid-cols-1 gap-6 max-w-2xl">
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Admin Account</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Admin Email</span>
                  <span className="font-medium text-slate-900">killerpings@gmail.com</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Auth Method</span>
                  <span className="font-medium text-slate-900">Magic Link (Supabase)</span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Directory Info</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Primary Domain</span>
                  <span className="font-medium text-slate-900">lfsdirectory.com</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Redirect Domain</span>
                  <span className="font-medium text-slate-900">localfishstore.org</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Hosting</span>
                  <span className="font-medium text-slate-900">Vercel</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Database</span>
                  <span className="font-medium text-slate-900">Supabase PostgreSQL</span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Quick Links</h2>
              <div className="space-y-2 text-sm">
                {[
                  { label: 'Supabase Dashboard', url: 'https://supabase.com/dashboard' },
                  { label: 'Vercel Dashboard', url: 'https://vercel.com/dashboard' },
                  { label: 'Google Search Console', url: 'https://search.google.com/search-console' },
                  { label: 'Cloudflare Dashboard', url: 'https://dash.cloudflare.com' },
                  { label: 'Resend Dashboard', url: 'https://resend.com' },
                ].map(link => (
                  <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer"
                    className="flex justify-between items-center p-2 hover:bg-slate-50 rounded">
                    <span className="text-slate-700">{link.label}</span>
                    <span className="text-blue-600 text-xs">Open →</span>
                  </a>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
