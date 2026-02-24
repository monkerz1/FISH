'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { BarChart3, ClipboardList, Store, MessageSquare, CheckSquare, Settings } from 'lucide-react';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: BarChart3 },
  { href: '/admin/pending', label: 'Pending Submissions', icon: ClipboardList },
  { href: '/admin/stores', label: 'All Stores', icon: Store },
  { href: '/admin/reviews', label: 'Reviews Queue', icon: MessageSquare },
  { href: '/admin/claims', label: 'Claims Queue', icon: CheckSquare },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  return (
    <aside className="w-64 bg-gradient-to-b from-slate-900 to-slate-800 text-white h-screen flex flex-col border-r border-slate-700">
      {/* Logo */}
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-2xl font-bold text-primary">LFS Admin</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary text-white'
                  : 'text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-700 space-y-2">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-slate-300 hover:bg-red-600 hover:text-white w-full"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
        <p className="text-sm text-slate-400 px-4">v0.1.0</p>
      </div>
    </aside>
  );
}
