import type { CollectionConfig } from 'payload'

export const ProductB: CollectionConfig = {
  slug: 'productB',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
  upload: true,
}
