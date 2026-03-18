import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  try {
    const body = await request.json()
    const { action, photoId, storeId, order } = body

    if (!action || !storeId) {
      return NextResponse.json({ error: 'Missing action or storeId' }, { status: 400 })
    }

    // HIDE a photo (works for both google and owner photos)
    if (action === 'hide') {
      if (!photoId) return NextResponse.json({ error: 'Missing photoId' }, { status: 400 })

      const { error } = await supabase
        .from('store_photos')
        .update({ is_hidden: true })
        .eq('id', photoId)
        .eq('store_id', storeId)

      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      return NextResponse.json({ success: true })
    }

    // DELETE an owner-uploaded photo permanently
    if (action === 'delete') {
      if (!photoId) return NextResponse.json({ error: 'Missing photoId' }, { status: 400 })

      // Get the storage path first
      const { data: photo, error: fetchError } = await supabase
        .from('store_photos')
        .select('storage_path, source')
        .eq('id', photoId)
        .eq('store_id', storeId)
        .single()

      if (fetchError || !photo) {
        return NextResponse.json({ error: 'Photo not found' }, { status: 404 })
      }

      // Only delete owner photos from storage
      if (photo.source === 'owner' && photo.storage_path) {
        await supabase.storage
          .from('store-photos')
          .remove([photo.storage_path])
      }

      const { error } = await supabase
        .from('store_photos')
        .delete()
        .eq('id', photoId)
        .eq('store_id', storeId)

      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      return NextResponse.json({ success: true })
    }

    // REORDER photos — accepts array of { id, sort_order }
    if (action === 'reorder') {
      if (!order || !Array.isArray(order)) {
        return NextResponse.json({ error: 'Missing order array' }, { status: 400 })
      }

      for (const item of order) {
        await supabase
          .from('store_photos')
          .update({ sort_order: item.sort_order })
          .eq('id', item.id)
          .eq('store_id', storeId)
      }

      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 })

  } catch (err) {
    return NextResponse.json({ error: 'Request failed' }, { status: 500 })
  }
}
