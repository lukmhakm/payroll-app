import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'PERISSEIA Payroll',
    short_name: 'PERISSEIA',
    description: 'Manage payroll, track attendance, and overview your team.',
    start_url: '/',
    display: 'standalone',
    background_color: '#F4F2EC',
    theme_color: '#E64A19',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}