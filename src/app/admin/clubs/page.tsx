'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';
import { AdminSidebar } from '@/components/admin-sidebar';
import { Plus, Pencil, Trash2, X, Check, Globe, Facebook } from 'lucide-react';

const STATE_OPTIONS = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA',
  'KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT',
  'VA','WA','WV','WI','WY'
];

const FOCUS_OPTIONS = [
  'reef', 'saltwater', 'freshwater', 'planted', 'general', 'pond', 'cichlid', 'discus'
];

const FOCUS_COLORS: Record<string, string> = {
  reef:       'bg-blue-100 text-blue-800',
  saltwater:  'bg-cyan-100 text-cyan-800',
  freshwater: 'bg-green-100 text-green-800',
  planted:    'bg-lime-100 text-lime-800',
  general:    'bg-gray-100 text-gray-700',
  pond:       'bg-teal-100 text-teal-800',
  cichlid:    'bg-orange-100 text-orange-800',
  discus:     'bg-purple-100 text-purple-800',
};

const EMPTY_FORM = {
  name: '',
  city: '',
  state: 'CA',
  website: '',
  facebook_url: '',
  email: '',
  focus: [] as string[],
  meeting_frequency: '',
  meeting_location: '',
  description: '',
  is_active: true,
  is_verified: false,
  member_count_approx: '',
  founded_year: '',
};

type Club = typeof EMPTY_FORM & { id: string; slug: string };

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export default function AdminClubsPage() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filterState, setFilterState] = useState('');
  const [error, setError] = useState('');
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
      await fetchClubs();
    };
    init();
  }, []);

  const fetchClubs = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('clubs')
      .select('*')
      .order('state', { ascending: true })
      .order('name', { ascending: true });
    setClubs((data || []) as Club[]);
    setLoading(false);
  };

  const openAdd = () => {
    setForm({ ...EMPTY_FORM });
    setEditingId(null);
    setError('');
    setShowForm(true);
  };

  const openEdit = (club: Club) => {
    setForm({
      name: club.name || '',
      city: club.city || '',
      state: club.state || 'CA',
      website: club.website || '',
      facebook_url: club.facebook_url || '',
      email: club.email || '',
      focus: club.focus || [],
      meeting_frequency: club.meeting_frequency || '',
      meeting_location: club.meeting_location || '',
      description: club.description || '',
      is_active: club.is_active ?? true,
      is_verified: club.is_verified ?? false,
      member_count_approx: club.member_count_approx?.toString() || '',
      founded_year: club.founded_year?.toString() || '',
    });
    setEditingId(club.id);
    setError('');
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.city.trim() || !form.state) {
      setError('Name, city, and state are required.');
      return;
    }
    setSaving(true);
    setError('');

    const payload = {
      name: form.name.trim(),
      slug: slugify(form.name.trim()),
      city: form.city.trim(),
      state: form.state,
      website: form.website.trim() || null,
      facebook_url: form.facebook_url.trim() || null,
      email: form.email.trim() || null,
      focus: form.focus,
      meeting_frequency: form.meeting_frequency.trim() || null,
      meeting_location: form.meeting_location.trim() || null,
      description: form.description.trim() || null,
      is_active: form.is_active,
      is_verified: form.is_verified,
      member_count_approx: form.member_count_approx ? parseInt(form.member_count_approx) : null,
      founded_year: form.founded_year ? parseInt(form.founded_year) : null,
      updated_at: new Date().toISOString(),
    };

    if (editingId) {
      const { error: err } = await supabase.from('clubs').update(payload).eq('id', editingId);
      if (err) { setError(err.message); setSaving(false); return; }
    } else {
      const { error: err } = await supabase.from('clubs').insert(payload);
      if (err) { setError(err.message); setSaving(false); return; }
    }

    await fetchClubs();
    setShowForm(false);
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    await supabase.from('clubs').delete().eq('id', id);
    setDeleteConfirm(null);
    await fetchClubs();
  };

  const toggleFocus = (f: string) => {
    setForm(prev => ({
      ...prev,
      focus: prev.focus.includes(f)
        ? prev.focus.filter(x => x !== f)
        : [...prev.focus, f]
    }));
  };

  const filtered = clubs.filter(c => {
    const matchSearch = !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.city?.toLowerCase().includes(search.toLowerCase());
    const matchState = !filterState || c.state === filterState;
    return matchSearch && matchState;
  });

  return (
    <div className="flex min-h-screen bg-slate-100 items-stretch">
      <AdminSidebar />

      <div className="flex-1 overflow-auto">
        <div className="p-8 pb-16">

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Aquarium Clubs</h1>
              <p className="text-slate-500 mt-1">{clubs.length} clubs total</p>
            </div>
            <button
              onClick={openAdd}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium"
            >
              <Plus size={18} /> Add Club
            </button>
          </div>

          {/* Filters */}
          <div className="flex gap-3 mb-6">
            <input
              type="text"
              placeholder="Search clubs..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="border border-slate-300 rounded-lg px-3 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={filterState}
              onChange={e => setFilterState(e.target.value)}
              className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All States</option>
              {STATE_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* Table */}
          {loading ? (
            <div className="text-slate-500 py-12 text-center">Loading clubs...</div>
          ) : filtered.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 py-16 text-center">
              <p className="text-slate-400 text-lg mb-2">No clubs found</p>
              <button onClick={openAdd} className="text-blue-600 hover:underline text-sm">Add your first club</button>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold text-slate-700">Name</th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-700">Location</th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-700">Focus</th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-700">Links</th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-700">Status</th>
                    <th className="text-right px-4 py-3 font-semibold text-slate-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map(club => (
                    <tr key={club.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-800">{club.name}</div>
                        {club.founded_year && <div className="text-xs text-slate-400">Est. {club.founded_year}</div>}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {club.city}, {club.state}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {(club.focus || []).map(f => (
                            <span key={f} className={`text-xs px-2 py-0.5 rounded-full capitalize ${FOCUS_COLORS[f] || 'bg-gray-100 text-gray-600'}`}>
                              {f}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          {club.website && (
                            <a href={club.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700">
                              <Globe size={15} />
                            </a>
                          )}
                          {club.facebook_url && (
                            <a href={club.facebook_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700">
                              <Facebook size={15} />
                            </a>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-1">
                          <span className={`text-xs px-2 py-0.5 rounded-full w-fit ${club.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {club.is_active ? 'Active' : 'Inactive'}
                          </span>
                          {club.is_verified && (
                            <span className="text-xs px-2 py-0.5 rounded-full w-fit bg-blue-100 text-blue-700">Verified</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEdit(club)}
                            className="text-slate-400 hover:text-blue-600 p-1 rounded"
                          >
                            <Pencil size={15} />
                          </button>
                          {deleteConfirm === club.id ? (
                            <div className="flex items-center gap-1">
                              <button onClick={() => handleDelete(club.id)} className="text-red-600 hover:text-red-800 p-1"><Check size={15} /></button>
                              <button onClick={() => setDeleteConfirm(null)} className="text-slate-400 hover:text-slate-600 p-1"><X size={15} /></button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeleteConfirm(club.id)}
                              className="text-slate-400 hover:text-red-600 p-1 rounded"
                            >
                              <Trash2 size={15} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add / Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center overflow-y-auto py-10 px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl">

            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h2 className="text-xl font-bold text-slate-900">
                {editingId ? 'Edit Club' : 'Add New Club'}
              </h2>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600">
                <X size={22} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Club Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. Southern California Reefers"
                />
              </div>

              {/* City + State */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">City *</label>
                  <input
                    type="text"
                    value={form.city}
                    onChange={e => setForm(p => ({ ...p, city: e.target.value }))}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Los Angeles"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">State *</label>
                  <select
                    value={form.state}
                    onChange={e => setForm(p => ({ ...p, state: e.target.value }))}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {STATE_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              {/* Website + Facebook */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Website</label>
                  <input
                    type="url"
                    value={form.website}
                    onChange={e => setForm(p => ({ ...p, website: e.target.value }))}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Facebook URL</label>
                  <input
                    type="url"
                    value={form.facebook_url}
                    onChange={e => setForm(p => ({ ...p, facebook_url: e.target.value }))}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://facebook.com/..."
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Contact Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="club@example.com"
                />
              </div>

              {/* Focus tags */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Focus / Specialty</label>
                <div className="flex flex-wrap gap-2">
                  {FOCUS_OPTIONS.map(f => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => toggleFocus(f)}
                      className={`text-sm px-3 py-1 rounded-full capitalize border transition-colors ${
                        form.focus.includes(f)
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-slate-600 border-slate-300 hover:border-blue-400'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Meeting frequency + location */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Meeting Frequency</label>
                  <input
                    type="text"
                    value={form.meeting_frequency}
                    onChange={e => setForm(p => ({ ...p, meeting_frequency: e.target.value }))}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Monthly, Bi-monthly..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Meeting Location</label>
                  <input
                    type="text"
                    value={form.meeting_location}
                    onChange={e => setForm(p => ({ ...p, meeting_location: e.target.value }))}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Library, member homes..."
                  />
                </div>
              </div>

              {/* Member count + Founded year */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Approx. Members</label>
                  <input
                    type="number"
                    value={form.member_count_approx}
                    onChange={e => setForm(p => ({ ...p, member_count_approx: e.target.value }))}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="150"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Founded Year</label>
                  <input
                    type="number"
                    value={form.founded_year}
                    onChange={e => setForm(p => ({ ...p, founded_year: e.target.value }))}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="1998"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                  rows={3}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Brief description of the club..."
                />
              </div>

              {/* Status toggles */}
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.is_active}
                    onChange={e => setForm(p => ({ ...p, is_active: e.target.checked }))}
                    className="w-4 h-4 accent-blue-600"
                  />
                  <span className="text-sm text-slate-700">Active (show publicly)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.is_verified}
                    onChange={e => setForm(p => ({ ...p, is_verified: e.target.checked }))}
                    className="w-4 h-4 accent-blue-600"
                  />
                  <span className="text-sm text-slate-700">Verified</span>
                </label>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200">
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50"
              >
                {saving ? 'Saving...' : editingId ? 'Save Changes' : 'Add Club'}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
