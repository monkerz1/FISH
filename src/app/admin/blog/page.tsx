'use client';
import { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export default function BlogEditor() {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [category, setCategory] = useState('city-guide');
  const [tags, setTags] = useState('');
  const [isPublished, setIsPublished] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const editor = useEditor({
    extensions: [StarterKit],
    content: '<p>Start writing your post here...</p>',
  });

  const handleTitleChange = (val: string) => {
    setTitle(val);
    setSlug(slugify(val));
    if (!seoTitle) setSeoTitle(val);
  };

  const handleSave = async () => {
    if (!title || !slug || !editor) return;
    setSaving(true);
    const { error } = await supabase.from('blog_posts').upsert({
      title,
      slug,
      excerpt,
      content: editor.getHTML(),
      seo_title: seoTitle,
      seo_description: seoDescription,
      category,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      is_published: isPublished,
      published_at: isPublished ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'slug' });

    setSaving(false);
    setMessage(error ? `Error: ${error.message}` : '✅ Saved successfully!');
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Blog Editor</h1>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Post Title *</label>
          <input className="w-full border rounded px-3 py-2"
            value={title} onChange={e => handleTitleChange(e.target.value)} />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Slug (URL)</label>
          <input className="w-full border rounded px-3 py-2 bg-gray-50"
            value={slug} onChange={e => setSlug(e.target.value)} />
          <p className="text-xs text-gray-500 mt-1">lfsdirectory.com/blog/{slug}</p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Excerpt (shown in listings)</label>
          <textarea className="w-full border rounded px-3 py-2" rows={2}
            value={excerpt} onChange={e => setExcerpt(e.target.value)} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select className="w-full border rounded px-3 py-2"
              value={category} onChange={e => setCategory(e.target.value)}>
              <option value="city-guide">City Guide</option>
              <option value="species">Species Guide</option>
              <option value="equipment">Equipment Guide</option>
              <option value="news">News</option>
              <option value="tips">Tips & How-To</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Tags (comma separated)</label>
            <input className="w-full border rounded px-3 py-2"
              value={tags} onChange={e => setTags(e.target.value)}
              placeholder="reef, saltwater, los angeles" />
          </div>
        </div>

        <div className="border rounded p-4 bg-blue-50">
          <h3 className="font-medium mb-3">SEO Settings</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">SEO Title (max 60 chars)</label>
              <input className="w-full border rounded px-3 py-2"
                value={seoTitle} onChange={e => setSeoTitle(e.target.value)}
                maxLength={60} />
              <p className="text-xs text-gray-500">{seoTitle.length}/60 characters</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Meta Description (max 160 chars)</label>
              <textarea className="w-full border rounded px-3 py-2" rows={2}
                value={seoDescription} onChange={e => setSeoDescription(e.target.value)}
                maxLength={160} />
              <p className="text-xs text-gray-500">{seoDescription.length}/160 characters</p>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Post Content</label>
          <div className="border rounded min-h-64 p-3 prose max-w-none">
            <EditorContent editor={editor} />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Use the toolbar: Bold, Italic, Headings (H2/H3), Lists, Blockquotes
          </p>
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={isPublished}
              onChange={e => setIsPublished(e.target.checked)} />
            <span className="font-medium">Publish immediately</span>
          </label>
          <span className="text-sm text-gray-500">(uncheck to save as draft)</span>
        </div>

        <div className="flex items-center gap-4">
          <button onClick={handleSave} disabled={saving}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50">
            {saving ? 'Saving...' : 'Save Post'}
          </button>
          {message && <span className="text-sm">{message}</span>}
        </div>
      </div>
    </div>
  );
}