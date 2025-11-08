import { Hero } from '@/components/sections/Hero'
import { TrustSection } from '@/components/sections/TrustSection'
import { HowItWorks } from '@/components/sections/HowItWorks'
import { QuickFind } from '@/components/sections/QuickFind'
import { DataInsights } from '@/components/sections/DataInsights'
import { SecuritySection } from '@/components/sections/SecuritySection'
import { OfficialVsRealityComparison } from '@/components/OfficialVsRealityComparison'
import { RegionalVariationComparison } from '@/components/RegionalVariationComparison'
import { SubmitExperienceForm } from '@/components/SubmitExperienceForm'
import { JsonLd } from '@/components/common/JsonLd'
import { generateHomeMetadata } from '@/lib/metadata'
import { getUKWideData, loadWaitingTimesData } from '@/lib/utils/waitingTimesLoader'
import { getAllProceduresComparisonDataFromSource } from '@/lib/utils/regionComparison'
import type { Metadata } from 'next'

export const metadata: Metadata = generateHomeMetadata()

export default function Home() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://comparethewait.co.uk'

  // Load UK-wide data for homepage (using cataract as example)
  const cataractData = getUKWideData('cataract')
  
  // Load regional comparison data
  const waitingTimesData = loadWaitingTimesData()
  const allProceduresComparisonData = getAllProceduresComparisonDataFromSource(waitingTimesData)

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

          {/* Official vs Reality Section */}
          <section className="mb-12">
            <h2 className="text-elderly-2xl font-bold text-elderly-primary mb-6 text-center">
              Official vs Reality: The Waiting Times Gap
            </h2>
            <p className="text-elderly-base text-elderly-text mb-6 text-center max-w-3xl mx-auto">
              NHS targets don't always match what patients actually experience. See the real difference
              between official targets and patient-reported wait times.
            </p>
            <OfficialVsRealityComparison data={cataractData} variant="homepage" />
          </section>

          {/* Regional Variation Section */}
          <section className="mb-12">
            <h2 className="text-elderly-2xl font-bold text-elderly-primary mb-6 text-center">
              Regional Variation: Wait Times Across UK
            </h2>
            <p className="text-elderly-base text-elderly-text mb-6 text-center max-w-3xl mx-auto">
              Wait times vary significantly by region. Compare all regions and see how much time you could save
              by choosing a different location.
            </p>
            <RegionalVariationComparison 
              data={allProceduresComparisonData}
              showAllProcedures={true}
              format="table"
              interactive={false}
            />
          </section>

          {/* Help Improve Data Section */}
          <section className="mb-12" id="submit-experience">
            <div className="bg-elderly-primary-light border-elderly border-elderly-gray-medium p-6 rounded-lg mb-6 text-center">
              <h2 className="text-elderly-xl font-bold text-elderly-primary mb-3">
                Help improve our data
              </h2>
              <p className="text-elderly-base text-elderly-text mb-4">
                <strong>3,214</strong> patients have shared their experiences. Your story matters too.
              </p>
            </div>
            <SubmitExperienceForm variant="full" />
          </section>

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

