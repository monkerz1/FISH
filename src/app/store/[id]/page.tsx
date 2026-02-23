import { redirect } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default async function StoreRedirectPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params

  const { data: store } = await supabase
    .from('stores')
    .select('slug, city, state')
    .eq('id', id)
    .single()

  if (!store?.slug || !store?.city || !store?.state) redirect('/')

  const stateSlug = store.state.toLowerCase()
  const citySlug = store.city.toLowerCase().replace(/\s+/g, '-')

  redirect(`/${stateSlug}/${citySlug}/${store.slug}`)
}