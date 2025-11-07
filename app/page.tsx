import { Hero } from '@/components/sections/Hero'
import { TrustSection } from '@/components/sections/TrustSection'
import { HowItWorks } from '@/components/sections/HowItWorks'
import { QuickFind } from '@/components/sections/QuickFind'
import { DataInsights } from '@/components/sections/DataInsights'
import { SecuritySection } from '@/components/sections/SecuritySection'
import { JsonLd } from '@/components/common/JsonLd'
import { generateHomeMetadata } from '@/lib/metadata'
import type { Metadata } from 'next'

export const metadata: Metadata = generateHomeMetadata()

export default function Home() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://comparethewait.co.uk'

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Compare The Wait',
    description: 'Compare NHS waiting times vs private surgery costs for cataract, hip and knee surgery in major UK cities.',
    url: baseUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${baseUrl}/comparison/{search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Compare The Wait',
      url: baseUrl,
    },
  }

  return (
    <>
      <JsonLd data={jsonLd} />
      <div className="bg-elderly-bg">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          {/* Hero Section */}
          <Hero />

          {/* Trust Section */}
          <TrustSection />

          {/* How It Works Section */}
          <HowItWorks />

          {/* Quick Find Section */}
          <QuickFind />

          {/* Data Insights Section */}
          <DataInsights />

          {/* Security Section */}
          <SecuritySection />

          {/* About Section */}
          <section className="mb-12 bg-elderly-primary-light p-6 rounded-lg border-elderly border-elderly-gray-medium">
            <h2 className="text-elderly-xl font-bold text-elderly-primary mb-4">
              Why compare NHS vs Private?
            </h2>
            <div className="space-y-4 text-elderly-base text-elderly-text">
              <p>
                7.7 million people are waiting for NHS surgery right now. For common procedures 
                like hip and knee replacements, waits can be 20+ weeks. Private surgery is often 
                available within 1-2 weeks.
              </p>
              <p>
                But private costs money—£2,500-£15,000 depending on procedure. This guide shows you 
                real waiting times and real costs so you can make an informed decision.
              </p>
              <p>
                We update this data every 2 weeks from NHS records and clinic websites. Everything is free 
                to compare.
              </p>
            </div>
          </section>
        </div>
      </div>
    </>
  )
}

