'use client'

import dynamic from 'next/dynamic'

const SrushtiWordle = dynamic(() => import('../components/SrushtiWordle'), { ssr: false })

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <SrushtiWordle />
    </main>
  )
}

