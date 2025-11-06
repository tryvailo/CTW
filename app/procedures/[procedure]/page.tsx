import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Breadcrumbs } from '@/components/common/Breadcrumbs'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { JsonLd } from '@/components/common/JsonLd'
import { generateProcedureMetadata } from '@/lib/metadata'
import {
  getProcedure,
  loadCities,
  getNHSWait,
  getPrivateCost,
} from '@/lib/data'
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
            <h1 className="text-elderly-2xl font-bold text-elderly-primary mb-4">
              {procedureData.name}: NHS Wait Times vs Private Costs by City
            </h1>
            <p className="text-elderly-base text-elderly-text">
              Compare {cities.length} UK cities. See how long you'll wait on NHS vs going private.
            </p>
          </header>

          {/* City Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {cities.map((cityData) => {
              const nhsWait = getNHSWait(procedureId, cityData.city)
              const privateCost = getPrivateCost(procedureId, cityData.city)
              
              if (!nhsWait) {
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
                          NHS Wait:
                        </p>
                        <p className="text-elderly-base font-bold text-elderly-warning">
                          {nhsWait.avg_wait_weeks} weeks
                        </p>
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

                      {privateCost && (
                        <div>
                          <p className="text-elderly-sm text-elderly-gray-dark">
                            Clinics: {privateCost.clinic_count} in {cityData.city}
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

