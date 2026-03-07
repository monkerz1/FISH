'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'

const WriteReviewModal = dynamic(() => import('./WriteReviewModal'), { ssr: false })

export default function ReviewButtonClient({ storeId, storeName }: { storeId: string; storeName: string }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-sm font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-xl transition-all"
      >
        + Write a Review
      </button>
      {open && <WriteReviewModal storeId={storeId} storeName={storeName} onClose={() => setOpen(false)} />}
    </>
  )
}