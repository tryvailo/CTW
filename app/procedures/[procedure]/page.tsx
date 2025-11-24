import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Breadcrumbs } from '@/components/common/Breadcrumbs'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { JsonLd } from '@/components/common/JsonLd'
import { EstimatedWaitTime } from '@/components/common/EstimatedWaitTime'
import { generateProcedureMetadata } from '@/lib/metadata'
import {
  getProcedure,
  loadCities,
  getNHSWait,
  getPrivateCost,
  getClinics,
} from '@/lib/data'
import { loadWaitingTimesData, getUKWideData, getPrivateComparisonData, getRegionalData, cityToRegionId } from '@/lib/utils/waitingTimesLoader'
import { getRegionalComparisonDataFromSource } from '@/lib/utils/regionComparison'
import type { ProcedureId, City } from '@/lib/types'
import type { Metadata } from 'next'

interface PageProps {
  params: {
    procedure: string
  }
}

export async function generateStaticParams() {
  return [
    { procedure: 'cataract' },
    { procedure: 'hip' },
    { procedure: 'knee' },
  ]
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { procedure } = await params
  const procedureId = procedure as ProcedureId
  return generateProcedureMetadata(procedureId)
}

export default async function ProcedurePage({ params }: PageProps) {
  const { procedure } = await params
  const procedureId = procedure as ProcedureId
  
  const procedureData = getProcedure(procedureId)
  
  if (!procedureData) {
    notFound()
  }

  const cities = loadCities()
  
  // Load regional comparison data
  const waitingTimesData = loadWaitingTimesData()
  const regionalComparisonData = getRegionalComparisonDataFromSource(waitingTimesData, procedureId)
  
  // Load UK-wide data for metrics
  const ukWideData = getUKWideData(procedureId)
  const privateComparisonData = getPrivateComparisonData(procedureId)
  
  // Calculate actual minimum price from all clinics across all cities
  const allClinics = cities.flatMap(cityData => getClinics(procedureId, cityData.city))
  const actualMinPrice = allClinics.length > 0 
    ? Math.min(...allClinics.map(c => c.price).filter(p => p > 0))
    : privateComparisonData?.cost_range_min_pounds || null
  
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://comparethewait.co.uk'
  const url = `${baseUrl}/procedures/${procedureId}`

  // JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: `${procedureData.name}: NHS vs Private by City`,
    description: `Compare NHS waiting times vs private surgery costs for ${procedureData.name.toLowerCase()} in major UK cities`,
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
          item: `${baseUrl}/procedures`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: procedureData.name,
          item: url,
        },
      ],
    },
    mainEntity: {
      '@type': 'MedicalCondition',
      name: procedureData.name,
      specialty: procedureData.specialty,
    },
  }

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Procedures', href: '/procedures' },
    { label: procedureData.name },
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
            <h1 className="text-elderly-3xl font-bold text-gray-900 mb-4">
              {procedureData.name}
            </h1>
            <p className="text-elderly-xl text-gray-600 leading-relaxed">
              {procedureData.description}
            </p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Information Panel */}
              <div className="bg-blue-50 rounded-2xl p-8 mb-10 border border-blue-100">
                <h2 className="text-elderly-2xl font-bold mb-6 text-elderly-primary flex items-center">
                  <svg className="mr-3 h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  What you need to know
                </h2>
                <div className="space-y-4 text-elderly-base text-gray-800">
                  <p>
                    <strong>The Reality:</strong> NHS waiting lists for {procedureData.name.toLowerCase()} have grown significantly. 
                    While the official target is {ukWideData?.officialTarget || 18} weeks, many patients in the UK are waiting over a year.
                  </p>
                  <p>
                    <strong>The Impact:</strong> Delaying surgery can often lead to worsening symptoms, reduced mobility, and a lower quality of life.
                  </p>
                  <p>
                    <strong>The Alternative:</strong> Private surgery is available almost immediately, but costs vary. 
                    Our tool helps you see if the cost is worth the time saved.
                  </p>
                </div>
              </div>

              {/* UK National Averages Cards */}
              <h3 className="text-elderly-xl font-bold mb-6">UK National Averages</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                <div className="bg-white border-2 border-gray-100 rounded-xl p-6 shadow-sm">
                  <div className="flex items-center mb-4 text-gray-600">
                    <svg className="mr-2 h-6 w-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-bold uppercase text-sm">NHS Wait</span>
                  </div>
                  <div className="text-4xl font-bold text-gray-900 mb-1">
                    {ukWideData?.patientAverage || 'N/A'} {ukWideData?.patientAverage ? 'Weeks' : ''}
                  </div>
                  <div className="text-sm text-gray-500">Patient reported average</div>
                </div>
                
                <div className="bg-white border-2 border-gray-100 rounded-xl p-6 shadow-sm">
                  <div className="flex items-center mb-4 text-gray-600">
                    <svg className="mr-2 h-6 w-6 text-elderly-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-bold uppercase text-sm">Private Cost</span>
                  </div>
                  <div className="text-4xl font-bold text-gray-900 mb-1">
                    £{actualMinPrice ? Math.round(actualMinPrice).toLocaleString() : 'N/A'}+
                  </div>
                  <div className="text-sm text-gray-500">Starting price estimate</div>
                </div>
              </div>

              {/* Warning about regional variation */}
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-8">
                <div className="flex items-start">
                  <svg className="text-yellow-600 mr-4 flex-shrink-0 h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <div>
                    <h4 className="font-bold text-yellow-800 text-lg mb-2">Wait times vary by location</h4>
                    <p className="text-gray-700">
                      The figures above are national averages. Waiting times in your specific city could be much longer or shorter.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar CTA */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-xl border border-blue-200 p-6 sticky top-24">
                <div className="text-center mb-6">
                  <div className="bg-elderly-primary text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                    ?
                  </div>
                  <h3 className="text-elderly-xl font-bold text-gray-900 mb-2">How long is the wait in your city?</h3>
                  <p className="text-gray-600">
                    Enter your location to see exact NHS waiting times and private costs near you.
                  </p>
                </div>

                <Link href={`/comparison/${procedureId}/${cities[0]?.slug || 'london'}`}>
                  <Button 
                    variant="accent"
                    size="xl" 
                    className="w-full shadow-lg shadow-orange-100"
                  >
                    Check My City
                  </Button>
                </Link>
                
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="flex items-center text-green-700 mb-2">
                    <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm font-bold">Free to compare</span>
                  </div>
                  <div className="flex items-center text-green-700">
                    <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm font-bold">No personal data needed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* City Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {cities.map((cityData) => {
              // Try to get regional data from JSON first (matches table data)
              const regionId = cityToRegionId(cityData.city)
              const regionalData = regionId ? getRegionalData(procedureId, regionId) : null
              
              // Fallback to CSV data if regional data not available
              const nhsWait = getNHSWait(procedureId, cityData.city)
              const privateCost = getPrivateCost(procedureId, cityData.city)
              const clinics = getClinics(procedureId, cityData.city)
              
              // Determine official and real wait times
              // Use avg_wait_weeks from CSV as official target (more accurate per city)
              const officialWait = nhsWait?.avg_wait_weeks || regionalData?.officialTarget || ukWideData?.officialTarget || 18
              // Prefer patient_reported_wait_weeks from CSV if available, otherwise use regional data
              const patientReportedWeeks = nhsWait?.patient_reported_wait_weeks
              const realWaitDisplay = patientReportedWeeks 
                ? null // Will use EstimatedWaitTime component instead
                : (regionalData?.recommendedDisplay || 
                   (regionalData?.patientAverage ? `${Math.round(regionalData.patientAverage)} weeks` : null) ||
                   (nhsWait ? `${nhsWait.avg_wait_weeks} weeks` : null))
              
              if (!realWaitDisplay && !nhsWait && !patientReportedWeeks) {
                return null
              }

              return (
                <Card key={cityData.city} hover className="flex flex-col bg-elderly-primary-light">
                  <div className="flex-grow">
                    <h2 className="text-elderly-xl font-bold text-elderly-primary mb-2">
                      {cityData.city}
                    </h2>
                    {cityData.elderly_population && (
                      <p className="text-elderly-sm text-elderly-gray-dark mb-4">
                        {cityData.elderly_population} people 65+
                      </p>
                    )}

                    <div className="space-y-3 mb-4">
                      <div>
                        <p className="text-elderly-sm text-elderly-gray-dark mb-1">
                          NHS Official Target:
                        </p>
                        <p className="text-elderly-base font-bold text-gray-700">
                          {officialWait} weeks
                        </p>
                      </div>

                      <div>
                        <p className="text-elderly-sm text-elderly-gray-dark mb-1">
                          NHS Real Wait (Patient Reported):
                        </p>
                        {patientReportedWeeks ? (
                          <p className="text-elderly-base font-bold text-elderly-warning">
                            <EstimatedWaitTime 
                              weeks={patientReportedWeeks} 
                              isEstimated={nhsWait?.is_estimated}
                              showLabel={nhsWait?.is_estimated}
                            />
                          </p>
                        ) : (
                          <p className="text-elderly-base font-bold text-elderly-warning">
                            {realWaitDisplay || 'N/A'}
                          </p>
                        )}
                      </div>

                      <div>
                        <p className="text-elderly-sm text-elderly-gray-dark mb-1">
                          Private:
                        </p>
                        <p className="text-elderly-base font-bold text-elderly-success">
                          {privateCost ? '1-2 weeks' : 'N/A'}
                        </p>
                      </div>

                      {privateCost && (
                        <div>
                          <p className="text-elderly-sm text-elderly-gray-dark mb-1">
                            Private Cost:
                          </p>
                          <p className="text-elderly-base font-bold text-elderly-text">
                            £{privateCost.cost_min.toLocaleString()} - £{privateCost.cost_max.toLocaleString()}
                          </p>
                        </div>
                      )}

                      {clinics.length > 0 && (
                        <div>
                          <p className="text-elderly-sm text-elderly-gray-dark">
                            Clinics: {clinics.length} in {cityData.city}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <Link href={`/comparison/${procedureId}/${cityData.slug}`} className="mt-auto">
                    <Button variant="primary" className="w-full">
                      Compare in {cityData.city} →
                    </Button>
                  </Link>
                </Card>
              )
            })}
          </div>

          {/* Procedure Information */}
          <section className="mb-12 bg-elderly-primary-light p-6 rounded-lg border-elderly border-elderly-gray-medium">
            <h2 className="text-elderly-xl font-bold text-elderly-primary mb-4">
              About {procedureData.name}
            </h2>
            <div className="space-y-4 text-elderly-base text-elderly-text">
              <p>
                <strong>Specialty:</strong> {procedureData.specialty}
              </p>
              <p>
                <strong>Description:</strong> {procedureData.description}
              </p>
              <p>
                <strong>NHS Code:</strong> {procedureData.nhs_code}
              </p>
            </div>
          </section>

          {/* CTA Section */}
          <section className="bg-elderly-primary-light p-6 rounded-lg border-elderly border-elderly-gray-medium text-center">
            <h2 className="text-elderly-xl font-bold text-elderly-primary mb-4">
              Ready to compare?
            </h2>
            <p className="text-elderly-base text-elderly-text mb-6">
              Select a city above to see detailed comparison of NHS waiting times vs private surgery costs.
            </p>
            <Link href="/">
              <Button variant="secondary">
                ← Back to Homepage
              </Button>
            </Link>
          </section>
        </div>
      </div>
    </>
  )
}

