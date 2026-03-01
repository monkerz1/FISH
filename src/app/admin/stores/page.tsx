'use client';

import { useState, useEffect, useCallback } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';
import { AdminSidebar } from '@/components/admin-sidebar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ExternalLink, Search, ChevronUp, ChevronDown,
  Pencil, Trash2, X, Save, CheckCircle, Clock, AlertTriangle
} from 'lucide-react';

const PAGE_SIZE = 50;

type Store = {
  id: string;
  name: string;
  city: string;
  state: string;
  phone: string;
  website: string;
  address: string;
  zip: string;
  is_claimed: boolean;
  verification_status: string;
  rating: number | null;
  review_count: number | null;
  description: string;
  specialty_tags: string[];
  services: string[];
  supplies_tags: string[];
  store_type: string;
  email: string;
  is_reviewed: boolean;
  created_at: string;
};

type SortField = 'name' | 'city' | 'state' | 'rating' | 'is_reviewed' | 'created_at';
type SortDir = 'asc' | 'desc';

export default function AllStores() {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [editStore, setEditStore] = useState<Store | null>(null);
  const [editForm, setEditForm] = useState<Partial<Store>>({});
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [filterReviewed, setFilterReviewed] = useState<'all' | 'reviewed' | 'not_reviewed'>('all');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [massDeleteConfirm, setMassDeleteConfirm] = useState(false);
  const [massDeleting, setMassDeleting] = useState(false);
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
  }, [page, search, sortField, sortDir, filterReviewed]);

  const fetchStores = async () => {
    setLoading(true);
    let query = supabase
      .from('stores')
      .select('id, name, city, state, phone, website, address, zip, email, is_claimed, verification_status, rating, review_count, description, specialty_tags, services, supplies_tags, store_type, is_reviewed, created_at')
      .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);

    if (search) query = query.ilike('name', `%${search}%`);
    if (filterReviewed === 'reviewed') query = query.eq('is_reviewed', true);
    if (filterReviewed === 'not_reviewed') query = query.or('is_reviewed.eq.false,is_reviewed.is.null');

    // Sort
    query = query.order(sortField, { ascending: sortDir === 'asc' });

    const { data } = await query;
    setStores(data || []);
    setSelected(new Set());
    setLoading(false);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('asc');
    }
    setPage(0);
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ChevronUp size={14} className="text-slate-300" />;
    return sortDir === 'asc'
      ? <ChevronUp size={14} className="text-blue-500" />
      : <ChevronDown size={14} className="text-blue-500" />;
  };

  const openEdit = (store: Store) => {
    setEditStore(store);
    setEditForm({ ...store });
  };

  const closeEdit = () => {
    setEditStore(null);
    setEditForm({});
  };

  const handleSave = async () => {
    if (!editStore) return;
    setSaving(true);
    const { error } = await supabase
      .from('stores')
      .update({
        name: editForm.name,
        city: editForm.city,
        state: editForm.state,
        address: editForm.address,
        zip: editForm.zip,
        phone: editForm.phone,
        website: editForm.website,
        email: editForm.email,
        description: editForm.description,
        store_type: editForm.store_type,
        verification_status: editForm.verification_status,
        is_claimed: editForm.is_claimed,
        is_reviewed: editForm.is_reviewed,
        rating: editForm.rating,
        specialty_tags: editForm.specialty_tags,
        services: editForm.services,
        supplies_tags: editForm.supplies_tags,
      })
      .eq('id', editStore.id);

    if (!error) {
      setStores(prev => prev.map(s => s.id === editStore.id ? { ...s, ...editForm } as Store : s));
      closeEdit();
    } else {
      alert('Error saving: ' + error.message);
    }
    setSaving(false);
  };

  const handleToggleReviewed = async (store: Store) => {
    const newVal = !store.is_reviewed;
    await supabase.from('stores').update({ is_reviewed: newVal }).eq('id', store.id);
    setStores(prev => prev.map(s => s.id === store.id ? { ...s, is_reviewed: newVal } : s));
  };

  const handleDelete = async (id: string) => {
    await supabase.from('stores').delete().eq('id', id);
    setStores(prev => prev.filter(s => s.id !== id));
    setSelected(prev => { const n = new Set(prev); n.delete(id); return n; });
    setDeleteConfirm(null);
  };

  const toggleSelect = (id: string) => {
    setSelected(prev => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };

  const toggleSelectAll = () => {
    if (selected.size === stores.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(stores.map(s => s.id)));
    }
  };

  const handleMassDelete = async () => {
    setMassDeleting(true);
    const ids = Array.from(selected);
    await supabase.from('stores').delete().in('id', ids);
    setStores(prev => prev.filter(s => !selected.has(s.id)));
    setSelected(new Set());
    setMassDeleteConfirm(false);
    setMassDeleting(false);
  };

  const thClass = "text-left p-3 font-semibold text-slate-600 cursor-pointer select-none hover:text-slate-900 whitespace-nowrap";

  return (
    <div className="flex h-screen bg-slate-100">
      <AdminSidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <h1 className="text-3xl font-bold mb-2 text-slate-900">All Stores</h1>
          <p className="text-slate-600 mb-6">Browse, edit, and manage all stores in the directory.</p>

          {/* Search + Filters */}
          <div className="flex flex-wrap gap-3 mb-6">
            <div className="relative flex-1 min-w-[240px]">
              <Search size={18} className="absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search by store name..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(0); }}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>

            {/* Reviewed Filter */}
            <div className="flex gap-2">
              {(['all', 'not_reviewed', 'reviewed'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => { setFilterReviewed(f); setPage(0); }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                    filterReviewed === f
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-slate-600 border-slate-300 hover:border-blue-400'
                  }`}
                >
                  {f === 'all' ? 'All' : f === 'not_reviewed' ? '🔴 Not Reviewed' : '✅ Reviewed'}
                </button>
              ))}
            </div>
          </div>

          {loading && <p className="text-slate-500 mb-4">Loading...</p>}

          {/* Mass Delete Toolbar */}
          {selected.size > 0 && (
            <div className="flex items-center justify-between bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-4">
              <span className="text-sm font-semibold text-red-700">
                {selected.size} store{selected.size > 1 ? 's' : ''} selected
              </span>
              <div className="flex gap-3">
                <button
                  onClick={() => setSelected(new Set())}
                  className="text-sm text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded border border-slate-300 bg-white hover:bg-slate-50"
                >
                  Clear Selection
                </button>
                <button
                  onClick={() => setMassDeleteConfirm(true)}
                  className="flex items-center gap-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 px-4 py-1.5 rounded transition-colors"
                >
                  <Trash2 size={14} /> Delete {selected.size} Store{selected.size > 1 ? 's' : ''}
                </button>
              </div>
            </div>
          )}

          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="p-3 w-10">
                      <input
                        type="checkbox"
                        checked={stores.length > 0 && selected.size === stores.length}
                        onChange={toggleSelectAll}
                        className="w-4 h-4 rounded border-slate-300 text-blue-600 cursor-pointer"
                      />
                    </th>
                    <th className={thClass} onClick={() => handleSort('name')}>
                      <span className="flex items-center gap-1">Store Name <SortIcon field="name" /></span>
                    </th>
                    <th className={thClass} onClick={() => handleSort('city')}>
                      <span className="flex items-center gap-1">City <SortIcon field="city" /></span>
                    </th>
                    <th className={thClass} onClick={() => handleSort('state')}>
                      <span className="flex items-center gap-1">State <SortIcon field="state" /></span>
                    </th>
                    <th className={thClass} onClick={() => handleSort('rating')}>
                      <span className="flex items-center gap-1">Rating <SortIcon field="rating" /></span>
                    </th>
                    <th className="text-left p-3 font-semibold text-slate-600 whitespace-nowrap">Website</th>
                    <th className="text-left p-3 font-semibold text-slate-600 whitespace-nowrap">Status</th>
                    <th className={thClass} onClick={() => handleSort('is_reviewed')}>
                      <span className="flex items-center gap-1">Reviewed <SortIcon field="is_reviewed" /></span>
                    </th>
                    <th className="text-left p-3 font-semibold text-slate-600 whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {stores.map((store, i) => (
                    <tr key={store.id} className={`border-b border-slate-100 ${selected.has(store.id) ? 'bg-red-50' : i % 2 === 0 ? 'bg-white' : 'bg-slate-50'} hover:bg-blue-50 transition-colors`}>
                      <td className="p-3">
                        <input
                          type="checkbox"
                          checked={selected.has(store.id)}
                          onChange={() => toggleSelect(store.id)}
                          className="w-4 h-4 rounded border-slate-300 text-blue-600 cursor-pointer"
                        />
                      </td>
                      <td className="p-3 font-medium text-slate-900 max-w-[200px] truncate">{store.name}</td>
                      <td className="p-3 text-slate-600 whitespace-nowrap">{store.city}</td>
                      <td className="p-3 text-slate-600">{store.state}</td>
                      <td className="p-3 text-slate-600">{store.rating ? `⭐ ${store.rating}` : '—'}</td>
                      <td className="p-3">
                        {store.website ? (
                          <a href={store.website.startsWith('http') ? store.website : `https://${store.website}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1 text-xs">
                            <ExternalLink size={12} /> Visit
                          </a>
                        ) : <span className="text-slate-400 text-xs">—</span>}
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          store.verification_status === 'flagged_closed' ? 'bg-red-100 text-red-700' :
                          store.verification_status === 'pending_review' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {store.verification_status || 'active'}
                        </span>
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => handleToggleReviewed(store)}
                          className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                            store.is_reviewed
                              ? 'bg-green-100 text-green-700 hover:bg-green-200'
                              : 'bg-red-100 text-red-600 hover:bg-red-200'
                          }`}
                        >
                          {store.is_reviewed ? '✅ Reviewed' : '🔴 Not Reviewed'}
                        </button>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openEdit(store)}
                            className="p-1.5 rounded hover:bg-blue-100 text-slate-500 hover:text-blue-600 transition-colors"
                            title="Edit store"
                          >
                            <Pencil size={15} />
                          </button>
                          {deleteConfirm === store.id ? (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleDelete(store.id)}
                                className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                              >
                                Confirm
                              </button>
                              <button
                                onClick={() => setDeleteConfirm(null)}
                                className="px-2 py-1 bg-slate-200 text-slate-700 text-xs rounded hover:bg-slate-300"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeleteConfirm(store.id)}
                              className="p-1.5 rounded hover:bg-red-100 text-slate-500 hover:text-red-600 transition-colors"
                              title="Delete store"
                            >
                              <Trash2 size={15} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {!loading && stores.length === 0 && (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-slate-400">No stores found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Pagination */}
          <div className="flex items-center gap-4 mt-4">
            <Button variant="outline" disabled={page === 0} onClick={() => setPage(p => p - 1)}>Previous</Button>
            <span className="text-slate-600 text-sm">Page {page + 1}</span>
            <Button variant="outline" disabled={stores.length < PAGE_SIZE} onClick={() => setPage(p => p + 1)}>Next</Button>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editStore && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200 sticky top-0 bg-white z-10">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Edit Store</h2>
                <p className="text-sm text-slate-500">{editStore.name}</p>
              </div>
              <button onClick={closeEdit} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                <X size={20} className="text-slate-500" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">

              {/* Reviewed Toggle */}
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                <div>
                  <p className="font-semibold text-slate-700">Review Status</p>
                  <p className="text-xs text-slate-500">Mark this store as reviewed by admin</p>
                </div>
                <button
                  onClick={() => setEditForm(f => ({ ...f, is_reviewed: !f.is_reviewed }))}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                    editForm.is_reviewed
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'bg-red-100 text-red-600 hover:bg-red-200'
                  }`}
                >
                  {editForm.is_reviewed ? '✅ Reviewed' : '🔴 Not Reviewed'}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Store Name</label>
                  <input
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={editForm.name || ''}
                    onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">City</label>
                  <input
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={editForm.city || ''}
                    onChange={e => setEditForm(f => ({ ...f, city: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">State</label>
                  <input
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={editForm.state || ''}
                    onChange={e => setEditForm(f => ({ ...f, state: e.target.value }))}
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Address</label>
                  <input
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={editForm.address || ''}
                    onChange={e => setEditForm(f => ({ ...f, address: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">ZIP Code</label>
                  <input
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={editForm.zip || ''}
                    onChange={e => setEditForm(f => ({ ...f, zip: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Phone</label>
                  <input
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={editForm.phone || ''}
                    onChange={e => setEditForm(f => ({ ...f, phone: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Website</label>
                  <input
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={editForm.website || ''}
                    onChange={e => setEditForm(f => ({ ...f, website: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Email</label>
                  <input
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={editForm.email || ''}
                    onChange={e => setEditForm(f => ({ ...f, email: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Rating</label>
                  <input
                    type="number"
                    min="0" max="5" step="0.1"
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={editForm.rating || ''}
                    onChange={e => setEditForm(f => ({ ...f, rating: parseFloat(e.target.value) }))}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Store Type</label>
                  <input
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={editForm.store_type || ''}
                    onChange={e => setEditForm(f => ({ ...f, store_type: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Verification Status</label>
                  <select
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={editForm.verification_status || ''}
                    onChange={e => setEditForm(f => ({ ...f, verification_status: e.target.value }))}
                  >
                    <option value="active">Active</option>
                    <option value="pending_review">Pending Review</option>
                    <option value="flagged_closed">Flagged Closed</option>
                    <option value="unverified">Unverified</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Claimed</label>
                  <select
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={editForm.is_claimed ? 'true' : 'false'}
                    onChange={e => setEditForm(f => ({ ...f, is_claimed: e.target.value === 'true' }))}
                  >
                    <option value="false">Unclaimed</option>
                    <option value="true">Claimed</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Description</label>
                  <textarea
                    rows={4}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={editForm.description || ''}
                    onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))}
                  />
                </div>

                {/* Chain Store Toggle */}
                <div className="col-span-2">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <div>
                      <p className="font-semibold text-slate-700 text-sm">Chain Store</p>
                      <p className="text-xs text-slate-500">Petco, PetSmart, Walmart, etc.</p>
                    </div>
                    <button
                      onClick={() => setEditForm(f => ({ ...f, store_type: f.store_type === 'chain' ? 'independent' : 'chain' }))}
                      className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                        editForm.store_type === 'chain'
                          ? 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      {editForm.store_type === 'chain' ? '🏪 Chain Store' : '🐠 Independent'}
                    </button>
                  </div>
                </div>

                {/* Specialty Tags */}
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-600 mb-2">Specialty Tags</label>
                  <div className="grid grid-cols-2 gap-2 p-3 border border-slate-200 rounded-lg bg-slate-50">
                    {['saltwater','reef','corals','freshwater','cichlids','live plants','invertebrates','koi & pond','goldfish','rare species'].map(tag => {
                      const checked = (editForm.specialty_tags || []).includes(tag);
                      return (
                        <label key={tag} className="flex items-center gap-2 cursor-pointer hover:text-blue-600">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => setEditForm(f => ({
                              ...f,
                              specialty_tags: checked
                                ? (f.specialty_tags || []).filter(t => t !== tag)
                                : [...(f.specialty_tags || []), tag]
                            }))}
                            className="w-4 h-4 rounded border-slate-300 text-blue-600 cursor-pointer"
                          />
                          <span className="text-sm text-slate-700 capitalize">{tag}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Services */}
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-600 mb-2">Services</label>
                  <div className="grid grid-cols-2 gap-2 p-3 border border-slate-200 rounded-lg bg-slate-50">
                    {['water testing','custom tanks','delivery','aquarium maintenance','installation','aquarium design','coral fragging','fish boarding'].map(tag => {
                      const checked = (editForm.services || []).includes(tag);
                      return (
                        <label key={tag} className="flex items-center gap-2 cursor-pointer hover:text-blue-600">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => setEditForm(f => ({
                              ...f,
                              services: checked
                                ? (f.services || []).filter(t => t !== tag)
                                : [...(f.services || []), tag]
                            }))}
                            className="w-4 h-4 rounded border-slate-300 text-blue-600 cursor-pointer"
                          />
                          <span className="text-sm text-slate-700 capitalize">{tag}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Supplies */}
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-600 mb-2">Supplies</label>
                  <div className="grid grid-cols-2 gap-2 p-3 border border-slate-200 rounded-lg bg-slate-50">
                    {['live rock','live sand','frozen food','live food','dry food','ro water','salt mix','reef supplements','lighting','filtration','ro unit','driftwood','medications','co2 systems','aquarium decor'].map(tag => {
                      const checked = (editForm.supplies_tags || []).includes(tag);
                      return (
                        <label key={tag} className="flex items-center gap-2 cursor-pointer hover:text-blue-600">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => setEditForm(f => ({
                              ...f,
                              supplies_tags: checked
                                ? (f.supplies_tags || []).filter(t => t !== tag)
                                : [...(f.supplies_tags || []), tag]
                            }))}
                            className="w-4 h-4 rounded border-slate-300 text-blue-600 cursor-pointer"
                          />
                          <span className="text-sm text-slate-700 capitalize">{tag}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between p-6 border-t border-slate-200 sticky bottom-0 bg-white">
              <button
                onClick={() => setDeleteConfirm(editStore.id)}
                className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 size={15} /> Delete Store
              </button>
              <div className="flex gap-3">
                <button onClick={closeEdit} className="px-4 py-2 text-sm border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 px-5 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors font-semibold"
                >
                  <Save size={15} /> {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal (from edit modal) */}
      {deleteConfirm && editStore && deleteConfirm === editStore.id && (
        <div className="fixed inset-0 bg-black/70 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle size={24} className="text-red-500" />
              <h3 className="text-lg font-bold text-slate-900">Delete Store?</h3>
            </div>
            <p className="text-slate-600 mb-6 text-sm">
              Are you sure you want to permanently delete <strong>{editStore.name}</strong>? This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-sm hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={() => { handleDelete(editStore.id); closeEdit(); }}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 font-semibold"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Mass Delete Confirm Modal */}
      {massDeleteConfirm && (
        <div className="fixed inset-0 bg-black/70 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle size={24} className="text-red-500" />
              <h3 className="text-lg font-bold text-slate-900">Delete {selected.size} Stores?</h3>
            </div>
            <p className="text-slate-600 mb-6 text-sm">
              You are about to permanently delete <strong>{selected.size} stores</strong>. This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setMassDeleteConfirm(false)}
                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-sm hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleMassDelete}
                disabled={massDeleting}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 font-semibold disabled:opacity-50"
              >
                {massDeleting ? 'Deleting...' : `Yes, Delete ${selected.size}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}