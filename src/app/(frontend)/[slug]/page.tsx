import { headers as getHeaders } from 'next/headers.js'
import Image from 'next/image'
import Link from 'next/link'
import { getPayload } from 'payload'
import { notFound } from 'next/navigation'
import { draftMode } from 'next/headers'
import React from 'react'

import config from '@/payload.config'
import type { Media, ProductA } from '@/payload-types'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import PageClient from './page.client'

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { isEnabled: isDraft } = await draftMode()

  const { slug } = await params

  // Fetch the page by slug
  const pagesResult = await payload.find({
    collection: 'pages',
    depth: 2,
    draft: isDraft,
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
  })

  const page = pagesResult.docs[0]

  if (!page) {
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

  return (
    <div className="min-h-screen bg-neutral-950">
      <PageClient />
      {isDraft && <LivePreviewListener />}

      <nav className="border-b border-neutral-800 bg-black">
        <div className="max-w-7xl mx-auto px-8 py-6 flex justify-between items-center">
          <Link href="/" className="text-2xl font-semibold text-white hover:text-neutral-300">
            Mercatus demo
          </Link>
          <div className="flex items-center gap-6">
            {allPages.docs.map((p) => (
              <Link
                key={p.id}
                href={`/${p.slug}`}
                className={`text-sm hover:text-white transition-colors ${
                  p.slug === slug ? 'text-white' : 'text-neutral-400'
                }`}
              >
                {p.title}
              </Link>
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

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-neutral-900 to-neutral-950 py-24">
        <div className="max-w-7xl mx-auto px-8 text-center">
          <h1 className="text-6xl font-bold text-white mb-6">
            {page.hero?.heading || 'Welcome'}
          </h1>
          <p className="text-2xl text-neutral-400 mb-8 max-w-3xl mx-auto">
            {page.hero?.subheading || ''}
          </p>
          {page.hero?.ctaText && (
            <a
              href={page.hero.ctaLink || '#'}
              className="inline-block bg-white text-black px-8 py-4 rounded-lg text-lg font-medium hover:bg-neutral-200 transition-colors"
            >
              {page.hero.ctaText}
            </a>
          )}
        </div>
      </section>

      {/* Content Sections */}
      <main className="max-w-7xl mx-auto px-8 py-16">
        {page.sections?.map((section, index) => {
          // Content Section
          if (section.type === 'content') {
            const layoutClass =
              section.layout === 'centered'
                ? 'text-center max-w-3xl mx-auto'
                : section.layout === 'two-column'
                  ? 'grid md:grid-cols-2 gap-12'
                  : 'max-w-4xl'

            return (
              <section key={index} className={`mb-16 ${layoutClass}`}>
                <h2 className="text-4xl font-bold text-white mb-6">{section.heading}</h2>
                <p className="text-lg text-neutral-400 leading-relaxed whitespace-pre-wrap">
                  {section.content}
                </p>
              </section>
            )
          }

          // Products Section
          if (section.type === 'products') {
            const products = section.products as ProductA[]
            const gridCols =
              section.columns === '2'
                ? 'md:grid-cols-2'
                : section.columns === '4'
                  ? 'md:grid-cols-2 lg:grid-cols-4'
                  : 'md:grid-cols-2 lg:grid-cols-3'

            return (
              <section key={index} className="mb-16">
                <h2 className="text-4xl font-bold text-white mb-8">{section.heading}</h2>
                <div className={`grid grid-cols-1 ${gridCols} gap-6`}>
                  {products?.map((product) => {
                    if (!product || typeof product === 'number') return null
                    const media = product.productAImage as Media
                    const imageUrl = media?.url || '/placeholder.jpg'
                    const hasSlug = product.slug

                    return hasSlug ? (
                      <Link
                        key={product.id}
                        href={`/products/${product.slug}`}
                        className="bg-neutral-900 border border-neutral-800 rounded hover:border-neutral-700 transition-colors block"
                      >
                        <Image
                          alt={product.title || ''}
                          className="w-full h-48 object-cover"
                          height={250}
                          src={imageUrl}
                          width={400}
                        />
                        <div className="p-4">
                          <h3 className="text-lg font-medium mb-2 text-white">{product.title}</h3>
                          <p className="text-sm text-neutral-400 mb-3 line-clamp-2">
                            {product.description}
                          </p>
                          <div className="flex justify-between items-center">
                            <span className="text-xl font-medium text-white">
                              ${product.price}
                            </span>
                            <span className="text-sm text-neutral-500">View →</span>
                          </div>
                        </div>
                      </Link>
                    ) : (
                      <div
                        key={product.id}
                        className="bg-neutral-900 border border-neutral-800 rounded opacity-75"
                      >
                        <Image
                          alt={product.title || ''}
                          className="w-full h-48 object-cover"
                          height={250}
                          src={imageUrl}
                          width={400}
                        />
                        <div className="p-4">
                          <h3 className="text-lg font-medium mb-2 text-white">{product.title}</h3>
                          <p className="text-sm text-neutral-400 mb-3 line-clamp-2">
                            {product.description}
                          </p>
                          <div className="flex justify-between items-center">
                            <span className="text-xl font-medium text-white">
                              ${product.price}
                            </span>
                            <span className="text-xs text-neutral-600">No slug</span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </section>
            )
          }

          return null
        })}
      </main>

      <footer className="border-t border-neutral-800 py-8 text-center text-neutral-600 text-xs bg-black">
        <p>Payload CMS</p>
      </footer>
    </div>
  )
}

export async function generateStaticParams() {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const pages = await payload.find({
    collection: 'pages',
    limit: 100,
  })

  return pages.docs.map((page) => ({
    slug: page.slug,
  }))
}
