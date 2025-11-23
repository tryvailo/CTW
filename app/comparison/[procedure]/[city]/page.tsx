import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Breadcrumbs } from '@/components/common/Breadcrumbs'
import { LastUpdated } from '@/components/common/LastUpdated'
import { ComparisonTable } from '@/components/sections/ComparisonTable'
import { SavingsCalculator } from '@/components/sections/SavingsCalculator'
import { ClinicList } from '@/components/sections/ClinicList'
import { FAQ } from '@/components/sections/FAQ'
import { MedicalDisclaimer } from '@/components/common/MedicalDisclaimer'
import { JsonLd } from '@/components/common/JsonLd'
import { OfficialVsRealityComparison } from '@/components/OfficialVsRealityComparison'
import { CancellationWarning } from '@/components/CancellationWarning'
import { SubmitExperienceForm } from '@/components/SubmitExperienceForm'
import { generateComparisonMetadata } from '@/lib/metadata'
import {
  getComparisonData,
  getProcedure,
  getCityBySlug,
  getAllComparisonCombinations,
  getFAQItems,
} from '@/lib/data'
import { getWaitingTimesData, getCancellationRiskData, getPrivateComparisonData, cityToRegionId } from '@/lib/utils/waitingTimesLoader'
import { groupFAQItems } from '@/lib/faq-utils'
import type { ProcedureId, City } from '@/lib/types'
import type { Metadata } from 'next'

interface PageProps {
  params: {
    procedure: string
    city: string
  }
}

export async function generateStaticParams() {
  const { getAllComparisonCombinations, loadCities } = await import('@/lib/data')
  const combinations = getAllComparisonCombinations()
  const cities = loadCities()
  
  return combinations.map((combo) => {
    // Find city data to get correct slug from CSV
    const cityData = cities.find(c => c.city === combo.city)
    const citySlug = cityData?.slug || combo.city.toLowerCase().replace(/\s+/g, '-')
    return {
      procedure: combo.procedureId,
      city: citySlug,
    }
  })
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { procedure, city } = await params
  const procedureId = procedure as ProcedureId
  return generateComparisonMetadata(procedureId, city)
}

export default async function ComparisonPage({ params }: PageProps) {
  const { procedure, city } = await params
  const procedureId = procedure as ProcedureId
  
  const cityData = getCityBySlug(city)
  if (!cityData) {
    notFound()
  }

  const comparisonData = getComparisonData(procedureId, cityData.city)
  
  if (!comparisonData.procedure.name || !comparisonData.nhsWait) {
    notFound()
  }

  const { procedure: procedureData, city: cityName, nhsWait, privateCost, clinics } = comparisonData

  // Load official vs reality data
  const regionId = cityToRegionId(cityName)
  const waitingTimesData = getWaitingTimesData(procedureId, regionId || undefined)
  const cancellationRiskData = getCancellationRiskData(procedureId)
  const privateComparisonData = getPrivateComparisonData(procedureId, regionId || undefined)

  // Transform waiting times data into chart format
  // Only show chart if we have valid patient average data (not 0)
  const chartData = waitingTimesData && privateComparisonData && waitingTimesData.patientAverage > 0 ? [{
    name: procedureData.name,
    Official: waitingTimesData.officialTarget,
    Real: waitingTimesData.patientAverage,
    Private: privateComparisonData.average_wait_weeks,
  }] : []

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://comparethewait.co.uk'
  const url = `${baseUrl}/comparison/${procedure}/${city}`

  // JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: `${procedureData.name} in ${cityName}: NHS vs Private`,
    description: `Compare NHS waiting times vs private surgery costs for ${procedureData.name.toLowerCase()} in ${cityName}`,
    url,
    publisher: {
      '@type': 'Organization',
      name: 'Compare The Wait',
      url: baseUrl,
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: baseUrl,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Procedures',
          item: `${baseUrl}/procedures/${procedureId}`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: procedureData.name,
          item: `${baseUrl}/procedures/${procedureId}`,
        },
        {
          '@type': 'ListItem',
          position: 4,
          name: cityName,
          item: url,
        },
      ],
    },
    mainEntity: {
      '@type': 'MedicalCondition',
      name: procedureData.name,
      treatment: {
        '@type': 'MedicalProcedure',
        name: procedureData.name,
      },
    },
  }

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Procedures', href: '/procedures' },
    { label: procedureData.name, href: `/procedures/${procedureId}` },
    { label: cityName },
  ]

  return (
    <>
      <JsonLd data={jsonLd} />
      <div className="bg-elderly-bg">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          {/* Breadcrumbs */}
          <Breadcrumbs items={breadcrumbItems} />

          {/* Page Header */}
          <header className="mb-8">
            <h1 className="text-elderly-2xl font-bold text-elderly-primary mb-4">
              {procedureData.name} in {cityName}: NHS vs Private in 2025
            </h1>
            <p className="text-elderly-base text-elderly-text mb-4">
              Compare NHS waiting times with private surgery options in {cityName}. 
              Updated {new Date().toLocaleDateString('en-GB', { month: 'long', day: 'numeric', year: 'numeric' })}.
            </p>
            <LastUpdated 
              date={nhsWait.date || new Date().toISOString().split('T')[0]} 
              source="biweekly"
            />
          </header>

          {/* Trust Badge */}
          <div className="bg-elderly-primary-light border-l-4 border-elderly-primary p-4 mb-6 rounded">
            <p className="text-elderly-sm text-elderly-text flex items-start gap-2">
              <span className="text-elderly-primary text-lg">ℹ️</span>
              <span>Independent comparison: We don't receive payment from any clinic listed below.</span>
            </p>
          </div>

          {/* Official vs Reality Comparison */}
          {chartData.length > 0 && (
            <OfficialVsRealityComparison data={chartData} />
          )}

          {/* Cancellation Warning Banner */}
          <CancellationWarning 
            data={cancellationRiskData}
            procedure={procedureId}
            region={regionId || undefined}
            variant="banner"
            procedureName={procedureData.name}
          />

          {/* Time Savings Card - Big Impact Card */}
          {waitingTimesData && privateComparisonData && (
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-blue-100 mb-12">
              <div className="bg-elderly-primary text-white p-6 text-center">
                <h2 className="text-elderly-xl font-bold">Your Potential Time Savings</h2>
              </div>
              <div className="p-8 text-center">
                {(() => {
                  const weeksSaved = Math.round(waitingTimesData.patientAverage - privateComparisonData.average_wait_weeks);
                  return weeksSaved > 0 ? (
                    <>
                      <div className="inline-flex items-center justify-center bg-green-100 text-green-800 rounded-full px-8 py-3 mb-6">
                        <svg className="mr-3 h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-2xl font-bold">You could save {weeksSaved} week{weeksSaved !== 1 ? 's' : ''}</span>
                      </div>
                      <p className="text-elderly-base text-gray-600">
                        By choosing private surgery instead of the NHS waiting list in {cityName}.
                      </p>
                    </>
                  ) : null;
                })()}
              </div>
            </div>
          )}

          {/* Main Comparison Table */}
          <ComparisonTable 
            data={comparisonData} 
            privateWaitWeeks={privateComparisonData?.average_wait_weeks}
            officialTarget={waitingTimesData?.officialTarget}
          />

          {/* Savings Calculator */}
          <SavingsCalculator data={comparisonData} privateComparison={privateComparisonData} />

          {/* Clinic List */}
          <ClinicList 
            clinics={clinics}
            procedureName={procedureData.name}
            city={cityName}
            procedureId={procedureId}
            regionId={regionId || undefined}
            cancellationRiskData={cancellationRiskData}
          />

          {/* FAQ Section */}
          {(() => {
            const faqItems = getFAQItems(procedureId);
            const grouped = groupFAQItems(faqItems);
            // If grouping returns empty, use items directly
            if (grouped.length > 0) {
              return <FAQ groupedItems={grouped} />;
            } else if (faqItems.length > 0) {
              return <FAQ items={faqItems} showTitle={true} />;
            }
            return null;
          })()}

          {/* Related Comparisons */}
          <section className="mb-12 bg-elderly-primary-light p-6 rounded-lg border-elderly border-elderly-gray-medium">
            <h2 className="text-elderly-xl font-bold text-elderly-primary mb-4">
              More comparisons for you:
            </h2>
            <div className="flex flex-wrap gap-4 text-elderly-base">
              {procedureId !== 'cataract' && (
                <Link
                  href={`/comparison/cataract/${city}`}
                  className="text-elderly-primary underline-offset-4 hover:underline"
                >
                  Cataract Surgery in {cityName}
                </Link>
              )}
              {procedureId !== 'hip' && (
                <Link
                  href={`/comparison/hip/${city}`}
                  className="text-elderly-primary underline-offset-4 hover:underline"
                >
                  Hip Replacement in {cityName}
                </Link>
              )}
              {procedureId !== 'knee' && (
                <Link
                  href={`/comparison/knee/${city}`}
                  className="text-elderly-primary underline-offset-4 hover:underline"
                >
                  Knee Replacement in {cityName}
                </Link>
              )}
              <Link
                href={`/procedures/${procedureId}`}
                className="text-elderly-primary underline-offset-4 hover:underline"
              >
                {procedureData.name} in other cities
              </Link>
            </div>
          </section>

          {/* Share Experience Section */}
          <section className="mb-12 bg-elderly-primary-light p-6 rounded-lg border-elderly border-elderly-gray-medium">
            <h2 className="text-elderly-xl font-bold text-elderly-primary mb-4">
              Just like this? Tell us how it went
            </h2>
            <p className="text-elderly-base text-elderly-text mb-4">
              Help others make informed decisions by sharing your real experience. Takes 5 minutes.
            </p>
            <SubmitExperienceForm />
          </section>

          {/* Medical Disclaimer */}
          <MedicalDisclaimer />
        </div>
      </div>
    </>
  )
}

