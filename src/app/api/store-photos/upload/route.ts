import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const storeId = formData.get('storeId') as string

    if (!file || !storeId) {
      return NextResponse.json({ error: 'Missing file or storeId' }, { status: 400 })
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 })
    }

    // Validate file size (max 300KB after client compression)
    if (file.size > 300 * 1024) {
      return NextResponse.json({ error: 'File too large. Max 300KB.' }, { status: 400 })
    }

    // Build storage path
    const ext = file.type === 'image/png' ? 'png' : 'jpg'
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const storagePath = `owner/${storeId}/${filename}`

    // Upload to Supabase Storage
    const arrayBuffer = await file.arrayBuffer()
    const { error: uploadError } = await supabase.storage
      .from('store-photos')
      .upload(storagePath, arrayBuffer, {
        contentType: file.type,
        upsert: false,
      })

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 })
    }

    // Get current max sort_order for this store
    const { data: existing } = await supabase
      .from('store_photos')
      .select('sort_order')
      .eq('store_id', storeId)
      .eq('is_hidden', false)
      .order('sort_order', { ascending: false })
      .limit(1)

    const nextSortOrder = existing && existing.length > 0 ? existing[0].sort_order + 1 : 0

    // Insert row into store_photos
    const { data: photo, error: insertError } = await supabase
      .from('store_photos')
      .insert({
        store_id: storeId,
        source: 'owner',
        storage_path: storagePath,
        sort_order: nextSortOrder,
        is_hidden: false,
      })
      .select()
      .single()

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 })
    }

    // Return public URL
    const { data: urlData } = supabase.storage
      .from('store-photos')
      .getPublicUrl(storagePath)

    return NextResponse.json({
      success: true,
      photo: {
        ...photo,
        public_url: urlData.publicUrl,
      }
    })

  } catch (err) {
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
