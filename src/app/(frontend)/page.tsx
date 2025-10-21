import { headers as getHeaders } from 'next/headers.js'
import Image from 'next/image'
import Link from 'next/link'
import { getPayload } from 'payload'
import React from 'react'

import config from '@/payload.config'
import type { Media } from '@/payload-types'

export default async function HomePage() {
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers })

  // Fetch products from Payload CM
  const productsResult = await payload.find({
    collection: 'productA',
    depth: 2,
    limit: 12,
  })

  const products = productsResult.docs

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
    <div className="min-h-screen flex flex-col bg-neutral-950">
      <nav className="border-b border-neutral-800 bg-black">
        <div className="max-w-7xl mx-auto px-8 py-6 flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-white">Mercatus demo</h1>
          <div className="flex items-center gap-6">
            {allPages.docs.map((page) => (
              <Link
                key={page.id}
                href={`/${page.slug}`}
                className="text-sm text-neutral-400 hover:text-white transition-colors"
              >
                {page.title}
              </Link>
            ))}
            <a
              href={payloadConfig.routes.admin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-400 hover:text-white text-sm border-l border-neutral-700 pl-6"
            >
              Admin
            </a>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-7xl w-full mx-auto px-8 py-12">
        {user && <p className="text-neutral-400 mb-8 text-sm">Hey {user.email.split('@')[0]}</p>}

        {products.length === 0 ? (
          <div className="text-center py-16 text-neutral-400">
            <p className="mb-4">No products yet</p>
            <a
              href={payloadConfig.routes.admin}
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-white"
            >
              Add one
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => {
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
                    alt={product.title}
                    className="w-full h-60 object-cover"
                    height={300}
                    src={imageUrl}
                    width={400}
                  />
                  <div className="p-5">
                    <h3 className="text-lg font-medium mb-2 text-white">{product.title}</h3>
                    <p className="text-sm text-neutral-400 mb-4 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-medium text-white">${product.price}</span>
                      <button className="bg-white text-black px-5 py-2 rounded text-sm hover:bg-neutral-200 transition-colors">
                        View
                      </button>
                    </div>
                  </div>
                </Link>
              ) : (
                <div
                  key={product.id}
                  className="bg-neutral-900 border border-neutral-800 rounded opacity-75"
                >
                  <Image
                    alt={product.title}
                    className="w-full h-60 object-cover"
                    height={300}
                    src={imageUrl}
                    width={400}
                  />
                  <div className="p-5">
                    <h3 className="text-lg font-medium mb-2 text-white">{product.title}</h3>
                    <p className="text-sm text-neutral-400 mb-4 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-medium text-white">${product.price}</span>
                      <span className="text-xs text-neutral-500">Add slug to view</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>

      <footer className="border-t border-neutral-800 py-8 text-center text-neutral-600 text-xs bg-black">
        <p>Payload CMS</p>
      </footer>
    </div>
  )
}
