'use client';
import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';
import { AdminSidebar } from '@/components/admin-sidebar';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

type Post = {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  seo_title: string;
  seo_description: string;
  category: string;
  tags: string;
  is_published: boolean;
};

const emptyPost: Post = {
  title: '', slug: '', excerpt: '', content: '',
  seo_title: '', seo_description: '', category: 'city-guide', tags: '', is_published: false,
};

export default function BlogAdmin() {
  const [posts, setPosts] = useState<any[]>([]);
  const [view, setView] = useState<'list' | 'editor'>('list');
  const [post, setPost] = useState<Post>(emptyPost);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();
  const supabase = createBrowserClient(supabaseUrl, supabaseKey);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || user.email !== 'killerpings@gmail.com') {
        router.push('/admin/login');
        return;
      }
      fetchPosts();
    };
    checkUser();
  }, []);

  const fetchPosts = async () => {
    const { data } = await supabase
      .from('blog_posts')
      .select('id, title, slug, category, is_published, published_at, excerpt')
      .order('created_at', { ascending: false });
    if (data) setPosts(data);
  };

  const handleTitleChange = (val: string) => {
    setPost(p => ({ ...p, title: val, slug: slugify(val), seo_title: p.seo_title || val }));
  };

  const handleSave = async () => {
    if (!post.title || !post.slug) {
      setMessage('❌ Title and slug are required.');
      return;
    }
    setSaving(true);
    setMessage('');
    const payload = {
      ...post,
      tags: post.tags.split(',').map((t: string) => t.trim()).filter(Boolean),
      published_at: post.is_published ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    };
    const { error } = post.id
      ? await supabase.from('blog_posts').update(payload).eq('id', post.id)
      : await supabase.from('blog_posts').insert(payload);
    setSaving(false);
    if (error) {
      setMessage('❌ Error: ' + error.message);
    } else {
      setMessage('✅ Saved!');
      fetchPosts();
      setTimeout(() => { setView('list'); setMessage(''); }, 1200);
    }
  };

  const handleEdit = async (p: any) => {
    const { data } = await supabase.from('blog_posts').select('*').eq('id', p.id).single();
    if (data) {
      setPost({
        ...data,
        tags: Array.isArray(data.tags) ? data.tags.join(', ') : (data.tags || ''),
        seo_title: data.seo_title || '',
        seo_description: data.seo_description || '',
        excerpt: data.excerpt || '',
        content: data.content || '',
      });
    }
    setView('editor');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this post?')) return;
    await supabase.from('blog_posts').delete().eq('id', id);
    fetchPosts();
  };

  const handleTogglePublish = async (id: string, current: boolean) => {
    await supabase.from('blog_posts').update({
      is_published: !current,
      published_at: !current ? new Date().toISOString() : null,
    }).eq('id', id);
    fetchPosts();
  };

  const handleNew = () => {
    setPost(emptyPost);
    setView('editor');
    setMessage('');
  };

  if (view === 'list') return (
    <div className="flex min-h-screen bg-slate-100 items-stretch">
      <AdminSidebar />
      <div className="flex-1 overflow-auto p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Blog Posts</h1>
            <p className="text-slate-600 mt-1">{posts.length} posts total</p>
          </div>
          <button onClick={handleNew}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            <Plus size={18} /> New Post
          </button>
        </div>
        <div className="bg-white rounded-xl shadow overflow-hidden">
          {posts.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              <p className="text-lg mb-2">No posts yet</p>
              <p className="text-sm">Click "New Post" to write your first blog post.</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-slate-700">Title</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-700">Category</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-700">Status</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-700">Date</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((p, i) => (
                  <tr key={p.id} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-900">{p.title}</div>
                      <div className="text-xs text-slate-400">/blog/{p.slug}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">{p.category}</span>
                    </td>
                    <td className="px-4 py-3">
                      {p.is_published
                        ? <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">Published</span>
                        : <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full">Draft</span>}
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-xs">
                      {p.published_at ? new Date(p.published_at).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleEdit(p)} title="Edit"
                          className="text-blue-600 hover:text-blue-800"><Edit size={16} /></button>
                        <button onClick={() => handleTogglePublish(p.id, p.is_published)} title={p.is_published ? 'Unpublish' : 'Publish'}
                          className="text-slate-500 hover:text-slate-800">
                          {p.is_published ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                        <button onClick={() => handleDelete(p.id)} title="Delete"
                          className="text-red-500 hover:text-red-700"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-slate-100 items-stretch">
      <AdminSidebar />
      <div className="flex-1 overflow-auto p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <button onClick={() => { setView('list'); setMessage(''); }}
              className="text-blue-600 hover:underline text-sm mb-1 block">← Back to Posts</button>
            <h1 className="text-3xl font-bold text-slate-900">{post.id ? 'Edit Post' : 'New Post'}</h1>
          </div>
          <div className="flex items-center gap-3">
            {message && <span className="text-sm">{message}</span>}
            <button onClick={handleSave} disabled={saving}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50">
              {saving ? 'Saving...' : 'Save Post'}
            </button>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 space-y-4">
            <div className="bg-white rounded-xl shadow p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Post Title *</label>
                <input className="w-full border rounded-lg px-3 py-2 text-lg font-medium"
                  placeholder="e.g. Best Fish Stores in Los Angeles"
                  value={post.title} onChange={e => handleTitleChange(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Slug (URL)</label>
                <div className="flex items-center border rounded-lg overflow-hidden">
                  <span className="bg-slate-100 px-3 py-2 text-slate-500 text-sm border-r">/blog/</span>
                  <input className="flex-1 px-3 py-2 text-sm"
                    value={post.slug} onChange={e => setPost(p => ({ ...p, slug: e.target.value }))} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Excerpt</label>
                <textarea className="w-full border rounded-lg px-3 py-2 text-sm" rows={2}
                  placeholder="Short summary shown in blog listings..."
                  value={post.excerpt} onChange={e => setPost(p => ({ ...p, excerpt: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Post Content</label>
                <textarea className="w-full border rounded-lg px-3 py-2 text-sm font-mono" rows={20}
                  placeholder="Write your post here. HTML supported — use <h2>, <p>, <ul><li>, <strong>, <a href=''> etc."
                  value={post.content} onChange={e => setPost(p => ({ ...p, content: e.target.value }))} />
                <p className="text-xs text-slate-400 mt-1">HTML supported. Use &lt;h2&gt; for headings, &lt;p&gt; for paragraphs, &lt;ul&gt;&lt;li&gt; for lists.</p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow p-5">
              <h3 className="font-semibold text-slate-700 mb-3">Publish</h3>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={post.is_published}
                  onChange={e => setPost(p => ({ ...p, is_published: e.target.checked }))}
                  className="w-4 h-4" />
                <div>
                  <div className="font-medium text-sm">{post.is_published ? '✅ Published' : '📝 Draft'}</div>
                  <div className="text-xs text-slate-400">{post.is_published ? 'Visible to the public' : 'Not visible yet'}</div>
                </div>
              </label>
            </div>
            <div className="bg-white rounded-xl shadow p-5 space-y-3">
              <h3 className="font-semibold text-slate-700">Category & Tags</h3>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Category</label>
                <select className="w-full border rounded-lg px-3 py-2 text-sm"
                  value={post.category} onChange={e => setPost(p => ({ ...p, category: e.target.value }))}>
                  <option value="city-guide">City Guide</option>
                  <option value="species">Species Guide</option>
                  <option value="equipment">Equipment Guide</option>
                  <option value="tips">Tips & How-To</option>
                  <option value="news">News</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Tags (comma separated)</label>
                <input className="w-full border rounded-lg px-3 py-2 text-sm"
                  placeholder="reef, saltwater, los angeles"
                  value={post.tags} onChange={e => setPost(p => ({ ...p, tags: e.target.value }))} />
              </div>
            </div>
            <div className="bg-white rounded-xl shadow p-5 space-y-3">
              <h3 className="font-semibold text-slate-700">SEO Settings</h3>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  SEO Title <span className={post.seo_title.length > 60 ? 'text-red-500' : 'text-slate-400'}>({post.seo_title.length}/60)</span>
                </label>
                <input className="w-full border rounded-lg px-3 py-2 text-sm"
                  placeholder="Defaults to post title if blank"
                  value={post.seo_title} onChange={e => setPost(p => ({ ...p, seo_title: e.target.value }))}
                  maxLength={65} />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Meta Description <span className={post.seo_description.length > 160 ? 'text-red-500' : 'text-slate-400'}>({post.seo_description.length}/160)</span>
                </label>
                <textarea className="w-full border rounded-lg px-3 py-2 text-sm" rows={3}
                  placeholder="What this post is about (shown in Google results)"
                  value={post.seo_description} onChange={e => setPost(p => ({ ...p, seo_description: e.target.value }))}
                  maxLength={165} />
              </div>
              <div className="bg-slate-50 rounded-lg p-3 text-xs text-slate-500">
                <p className="font-medium text-slate-600 mb-1">Google Preview:</p>
                <p className="text-blue-600 truncate">{post.seo_title || post.title || 'Post Title'}</p>
                <p className="text-green-700">lfsdirectory.com/blog/{post.slug || 'post-slug'}</p>
                <p className="text-slate-500 line-clamp-2">{post.seo_description || post.excerpt || 'Meta description will appear here...'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}