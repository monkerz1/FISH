export const revalidate = 0;
import { createClient } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { data } = await supabase
    .from('blog_posts')
    .select('seo_title, seo_description, title')
    .eq('slug', slug)
    .single();
  return {
    title: data?.seo_title || data?.title,
    description: data?.seo_description,
  };
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { data: post } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single();

  if (!post) notFound();

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <span className="text-xs uppercase text-blue-600 font-semibold">{post.category}</span>
      <h1 className="text-3xl font-bold mt-2 mb-4">{post.title}</h1>
      <p className="text-gray-500 text-sm mb-8">
        {new Date(post.published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
      </p>
      <article
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </main>
  );
}