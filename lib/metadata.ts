/**
 * Metadata generation utilities for SEO optimization
 */

import type { Metadata } from 'next'
import type { ProcedureId, City } from './types'
import { getProcedure, getCityBySlug, getComparisonData } from './data'

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://comparethewait.co.uk'
const siteName = 'Compare The Wait'
const defaultDescription = 'Compare NHS waiting times vs private surgery costs for cataract, hip and knee surgery in major UK cities. Free information for patients 65+.'

/**
 * Generate metadata for homepage
 */
export function generateHomeMetadata(): Metadata {
  return {
    title: `${siteName} - NHS vs Private Surgery Comparison`,
    description: defaultDescription,
    keywords: [
      'NHS waiting times',
      'private surgery cost',
      'cataract surgery',
      'hip replacement',
      'knee replacement',
      'NHS vs private',
      'elderly surgery',
      'UK surgery comparison',
    ],
    authors: [{ name: siteName }],
    openGraph: {
      title: `${siteName} - NHS vs Private Surgery Comparison`,
      description: defaultDescription,
      url: baseUrl,
      siteName,
      type: 'website',
      locale: 'en_GB',
      images: [
        {
          url: `${baseUrl}/og-image.jpg`, // TODO: Add actual OG image
          width: 1200,
          height: 630,
          alt: 'Compare The Wait - NHS vs Private Surgery',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${siteName} - NHS vs Private Surgery Comparison`,
      description: defaultDescription,
      images: [`${baseUrl}/og-image.jpg`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      canonical: baseUrl,
    },
  }
}

/**
 * Generate metadata for comparison pages
 */
export function generateComparisonMetadata(
  procedureId: ProcedureId,
  citySlug: string
): Metadata {
  const procedure = getProcedure(procedureId)
  const cityData = getCityBySlug(citySlug)
  const comparisonData = cityData ? getComparisonData(procedureId, cityData.city) : null

  if (!procedure || !cityData || !comparisonData) {
    return {
      title: 'Page Not Found - Compare The Wait',
    }
  }

  const nhsWait = comparisonData.nhsWait?.avg_wait_weeks || 'N/A'
  const privateMin = comparisonData.privateCost?.cost_min.toLocaleString() || 'N/A'
  const privateMax = comparisonData.privateCost?.cost_max.toLocaleString() || 'N/A'

  const title = `${procedure.name} in ${cityData.city}: NHS Wait ${nhsWait} weeks vs Private £${privateMin}-£${privateMax}`
  const description = `Compare NHS waiting times (${nhsWait} weeks) vs private surgery costs (£${privateMin}-£${privateMax}) for ${procedure.name.toLowerCase()} in ${cityData.city}. Free comparison guide with real data.`
  const url = `${baseUrl}/comparison/${procedureId}/${citySlug}`

  return {
    title,
    description,
    keywords: [
      `${procedure.name} ${cityData.city}`,
      `NHS waiting time ${procedure.name} ${cityData.city}`,
      `Private ${procedure.name} cost ${cityData.city}`,
      `NHS vs private ${procedure.name} ${cityData.city}`,
      `${procedure.name} surgery ${cityData.city}`,
      `${cityData.city} ${procedure.name} waiting time`,
    ],
    openGraph: {
      title,
      description,
      url,
      siteName,
      type: 'website',
      locale: 'en_GB',
      images: [
        {
          url: `${baseUrl}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: `${procedure.name} in ${cityData.city} - NHS vs Private`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${baseUrl}/og-image.jpg`],
    },
    alternates: {
      canonical: url,
    },
  }
}

/**
 * Generate metadata for procedure landing pages
 */
export function generateProcedureMetadata(procedureId: ProcedureId): Metadata {
  const procedure = getProcedure(procedureId)

  if (!procedure) {
    return {
      title: 'Page Not Found - Compare The Wait',
    }
  }

  const title = `${procedure.name}: NHS Wait Times vs Private Costs by City`
  const description = `Compare NHS waiting times vs private surgery costs for ${procedure.name.toLowerCase()} in London, Manchester, Birmingham, Leeds, and Bristol. See how long you'll wait on NHS vs going private.`
  const url = `${baseUrl}/procedures/${procedureId}`

  return {
    title,
    description,
    keywords: [
      `${procedure.name} NHS waiting time`,
      `Private ${procedure.name} cost`,
      `${procedure.name} UK cities`,
      `NHS vs private ${procedure.name}`,
      `${procedure.name} comparison`,
    ],
    openGraph: {
      title,
      description,
      url,
      siteName,
      type: 'website',
      locale: 'en_GB',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: url,
    },
  }
}

/**
 * Generate metadata for static pages
 */
export function generateStaticPageMetadata(
  page: 'faq' | 'about' | 'privacy-policy' | 'terms-of-service' | 'procedures'
): Metadata {
  const metadataMap = {
    faq: {
      title: 'Frequently Asked Questions - Compare The Wait',
      description: 'Common questions about NHS vs private surgery, waiting times, costs, and making informed decisions. Answers for patients 65+ and their families.',
      keywords: ['NHS surgery FAQ', 'private surgery questions', 'NHS waiting times', 'surgery costs UK'],
    },
    about: {
      title: 'About Us - Compare The Wait',
      description: 'Learn about Compare The Wait - our mission to help people 65+ understand NHS vs private surgery options. Free information, no pressure.',
      keywords: ['about Compare The Wait', 'NHS surgery comparison', 'elderly surgery information'],
    },
    'privacy-policy': {
      title: 'Privacy Policy - Compare The Wait',
      description: 'Privacy policy for Compare The Wait. Learn how we handle your data and protect your privacy.',
      keywords: ['privacy policy', 'data protection', 'Compare The Wait privacy'],
    },
    'terms-of-service': {
      title: 'Terms of Service - Compare The Wait',
      description: 'Terms of service for Compare The Wait. Read our terms and conditions for using our website.',
      keywords: ['terms of service', 'terms and conditions', 'Compare The Wait terms'],
    },
    procedures: {
      title: 'Surgery Procedures: Compare NHS vs Private - Compare The Wait',
      description: 'Browse all available surgery procedures. Compare NHS waiting times vs private surgery costs for cataract, hip, and knee replacement in major UK cities.',
      keywords: ['surgery procedures', 'NHS vs private procedures', 'cataract surgery', 'hip replacement', 'knee replacement', 'procedure comparison'],
    },
  }

  const meta = metadataMap[page]
  const url = `${baseUrl}/${page}`

  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    openGraph: {
      title: meta.title,
      description: meta.description,
      url,
      siteName,
      type: 'website',
      locale: 'en_GB',
    },
    twitter: {
      card: 'summary',
      title: meta.title,
      description: meta.description,
    },
    alternates: {
      canonical: url,
    },
  }
}

