import { getPayload } from 'payload'
import config from '@payload-config'
import React from 'react'
import type { Media } from '@/payload-types'

export async function ProductsA() {
  const payload = await getPayload({ config })

  const productsA = await payload.find({
    collection: 'productA',
    limit: 10,
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Product Catalog</h1>
          <p className="text-lg text-gray-600">Discover our premium collection of products</p>
        </div>

        {/* Products Grid */}
        {productsA.docs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {productsA.docs.map((product) => {
              const image = product.productAImage as Media

              return (
                <div
                  key={product.id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 flex flex-col"
                >
                  {/* Product Image */}
                  <div className="relative h-64 bg-gray-200 overflow-hidden">
                    {image?.url ? (
                      <img
                        src={image.url}
                        alt={image.alt || product.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg
                          className="w-20 h-20 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-6 flex-grow flex flex-col">
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">{product.title}</h2>

                    <p className="text-gray-600 mb-4 flex-grow line-clamp-3">
                      {product.description}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-500 uppercase tracking-wide">Price</span>
                        <span className="text-3xl font-bold text-indigo-600">
                          ${product.price.toFixed(2)}
                        </span>
                      </div>

                      <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 shadow-md hover:shadow-lg">
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-200 rounded-full mb-4">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600">Check back later for new products!</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductsA
