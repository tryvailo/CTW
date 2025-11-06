import { MetadataRoute } from 'next'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://comparethewait.co.uk'
  
  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/procedures`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms-of-service`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.5,
    },
  ]

  // Procedure IDs and cities (hardcoded for sitemap generation)
  const procedures = ['cataract', 'hip', 'knee']
  const cities = ['london', 'manchester', 'birmingham', 'leeds', 'bristol']

  // Procedure landing pages
  const procedurePages = procedures.map(procedureId => ({
    url: `${baseUrl}/procedures/${procedureId}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }))

  // Comparison pages (3 procedures × 5 cities = 15 pages)
  const comparisonPages = procedures.flatMap(procedureId =>
    cities.map(city => ({
      url: `${baseUrl}/comparison/${procedureId}/${city}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))
  )

  return [...staticPages, ...procedurePages, ...comparisonPages]
}

