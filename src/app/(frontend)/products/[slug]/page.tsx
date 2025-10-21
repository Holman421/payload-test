import { headers as getHeaders } from 'next/headers.js'
import Image from 'next/image'
import { getPayload } from 'payload'
import { notFound } from 'next/navigation'
import { draftMode } from 'next/headers'
import React from 'react'

import config from '@/payload.config'
import type { Media } from '@/payload-types'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import PageClient from './page.client'

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { isEnabled: isDraft } = await draftMode()

  const { slug } = params

  // Fetch the product by slug
  const productsResult = await payload.find({
    collection: 'productA',
    depth: 2,
    draft: isDraft,
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
  })

  const product = productsResult.docs[0]

  if (!product) {
    notFound()
  }

  // Fetch all pages for navigation
  const allPages = await payload.find({
    collection: 'pages',
    where: {
      _status: {
        equals: 'published',
      },
    },
    limit: 20,
    sort: 'title',
  })

  const media = product.productAImage as Media
  const imageUrl = media?.url || '/placeholder.jpg'

  return (
    <div className="min-h-screen bg-neutral-950">
      <PageClient />
      {isDraft && <LivePreviewListener />}
      
      <nav className="border-b border-neutral-800 bg-black">
        <div className="max-w-7xl mx-auto px-8 py-6 flex justify-between items-center">
          <a href="/" className="text-2xl font-semibold text-white hover:text-neutral-300">
            Mercatus demo
          </a>
          <div className="flex items-center gap-6">
            {allPages.docs.map((page) => (
              <a
                key={page.id}
                href={`/${page.slug}`}
                className="text-sm text-neutral-400 hover:text-white transition-colors"
              >
                {page.title}
              </a>
            ))}
            <a
              href="/admin"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-400 hover:text-white text-sm border-l border-neutral-700 pl-6"
            >
              Admin
            </a>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-8 py-12">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden">
            <Image
              alt={product.title}
              className="w-full h-auto object-cover"
              height={600}
              src={imageUrl}
              width={600}
              priority
            />
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-4">{product.title}</h1>
              <p className="text-xl text-neutral-400 leading-relaxed">{product.description}</p>
            </div>

            <div className="pt-6 border-t border-neutral-800">
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-5xl font-bold text-white">${product.price}</span>
              </div>

              <button className="w-full bg-white text-black px-8 py-4 rounded-lg text-lg font-medium hover:bg-neutral-200 transition-colors">
                Add to Cart
              </button>
            </div>

            <div className="pt-6 border-t border-neutral-800">
              <a
                href="/"
                className="text-neutral-400 hover:text-white text-sm inline-flex items-center gap-2"
              >
                ← Back to all products
              </a>
            </div>
          </div>
        </div>
      </main>
      {isDraft && <LivePreviewListener />}
    </div>
  )
}

export async function generateStaticParams() {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const products = await payload.find({
    collection: 'productA',
    limit: 100,
  })

  return products.docs.map((product) => ({
    slug: product.slug,
  }))
}
