import type { CollectionConfig } from 'payload'
import { generatePreviewPath } from '@/utilities/generatePreviewPath'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    livePreview: {
      url: ({ data, req }) =>
        generatePreviewPath({
          slug: data?.slug as string,
          collection: 'pages',
          req,
        }),
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: data?.slug as string,
        collection: 'pages',
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
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL-friendly version (e.g., "about-us")',
      },
    },
    {
      name: 'hero',
      type: 'group',
      fields: [
        {
          name: 'heading',
          type: 'text',
          required: true,
          defaultValue: 'Welcome to Our Store',
        },
        {
          name: 'subheading',
          type: 'textarea',
          required: true,
          defaultValue: 'Discover amazing products and great deals',
        },
        {
          name: 'ctaText',
          type: 'text',
          defaultValue: 'Shop Now',
        },
        {
          name: 'ctaLink',
          type: 'text',
          defaultValue: '/products',
        },
      ],
    },
    {
      name: 'sections',
      type: 'array',
      fields: [
        {
          name: 'type',
          type: 'select',
          required: true,
          options: [
            { label: 'Content Section', value: 'content' },
            { label: 'Products Grid', value: 'products' },
          ],
          defaultValue: 'content',
        },
        {
          name: 'heading',
          type: 'text',
          required: true,
        },
        // Content Section Fields
        {
          name: 'content',
          type: 'textarea',
          admin: {
            condition: (data, siblingData) => siblingData?.type === 'content',
          },
        },
        {
          name: 'layout',
          type: 'select',
          options: [
            { label: 'Text Only', value: 'text' },
            { label: 'Two Columns', value: 'two-column' },
            { label: 'Centered', value: 'centered' },
          ],
          defaultValue: 'text',
          admin: {
            condition: (data, siblingData) => siblingData?.type === 'content',
          },
        },
        // Products Section Fields
        {
          name: 'products',
          type: 'relationship',
          relationTo: 'productA',
          hasMany: true,
          admin: {
            condition: (data, siblingData) => siblingData?.type === 'products',
          },
        },
        {
          name: 'columns',
          type: 'select',
          options: [
            { label: '2 Columns', value: '2' },
            { label: '3 Columns', value: '3' },
            { label: '4 Columns', value: '4' },
          ],
          defaultValue: '3',
          admin: {
            condition: (data, siblingData) => siblingData?.type === 'products',
          },
        },
      ],
    },
  ],
}
