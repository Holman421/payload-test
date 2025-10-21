import { PayloadRequest, CollectionSlug } from 'payload'

const collectionPrefixMap: Partial<Record<CollectionSlug, string>> = {
  productA: '/products',
  pages: '',
}

type Props = {
  collection: keyof typeof collectionPrefixMap
  slug: string | undefined | null
  req: PayloadRequest
}

export const generatePreviewPath = ({ collection, slug }: Props) => {
  // Return null if slug is missing
  if (!slug || slug === undefined || slug === null) {
    return null
  }

  const encodedSlug = encodeURIComponent(slug)

  const encodedParams = new URLSearchParams({
    slug: encodedSlug,
    collection,
    path: `${collectionPrefixMap[collection]}/${encodedSlug}`,
    previewSecret: process.env.PREVIEW_SECRET || 'your-secret-preview-token-here',
  })

  const url = `/next/preview?${encodedParams.toString()}`

  return url
}
