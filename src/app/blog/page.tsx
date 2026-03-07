import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

export const revalidate = 0; // rebuild every hour

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function BlogIndex() {
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('title, slug, excerpt, category, published_at, tags')
    .eq('is_published', true)
    .order('published_at', { ascending: false });

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">Aquarium Blog & Guides</h1>
      <p className="text-gray-600 mb-8">City guides, species care, equipment reviews, and tips for hobbyists.</p>
      <div className="space-y-6">
        {posts?.map(post => (
          <article key={post.slug} className="border-b pb-6">
            <span className="text-xs uppercase text-blue-600 font-semibold">{post.category}</span>
            <h2 className="text-xl font-semibold mt-1">
              <Link href={`/blog/${post.slug}`} className="hover:text-blue-600">{post.title}</Link>
            </h2>
            <p className="text-gray-600 mt-1">{post.excerpt}</p>
            <Link href={`/blog/${post.slug}`} className="text-blue-600 text-sm mt-2 inline-block">
              Read more →
            </Link>
          </article>
        ))}
      </div>
    </main>
  );
}