import type { CollectionConfig } from 'payload'
import { generatePreviewPath } from '@/utilities/generatePreviewPath'

export const ProductA: CollectionConfig = {
  slug: 'productA',
  admin: {
    useAsTitle: 'title',
    livePreview: {
      url: ({ data, req }) =>
        generatePreviewPath({
          slug: data?.slug as string,
          collection: 'productA',
          req,
        }),
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: data?.slug as string,
        collection: 'productA',
        req,
      }),
  },
  versions: {
    drafts: true,
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Product A Title',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      label: 'Slug',
      required: false,
      unique: true,
      admin: {
        description: 'URL-friendly version of the title',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Product A Description',
      required: true,
    },
    {
      name: 'price',
      type: 'number',
      label: 'Product A Price',
      required: true,
    },
    {
      name: 'productAImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Product A Image',
      required: true,
    },
  ],
}
