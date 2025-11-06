import Link from 'next/link'
import { Breadcrumbs } from '@/components/common/Breadcrumbs'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { JsonLd } from '@/components/common/JsonLd'
import { generateStaticPageMetadata } from '@/lib/metadata'
import { loadProcedures } from '@/lib/data'
import type { Metadata } from 'next'

export const metadata: Metadata = generateStaticPageMetadata('procedures')

export default function ProceduresPage() {
  const procedures = loadProcedures()
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://comparethewait.co.uk'

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Procedures' },
  ]

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Surgery Procedures: Compare NHS vs Private',
    description: 'Browse all available surgery procedures. Compare NHS waiting times vs private surgery costs for cataract, hip, and knee replacement.',
    url: `${baseUrl}/procedures`,
    publisher: {
      '@type': 'Organization',
      name: 'Compare The Wait',
      url: baseUrl,
    },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: procedures.map((procedure, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: procedure.name,
        url: `${baseUrl}/procedures/${procedure.procedure_id}`,
      })),
    },
  }

  return (
    <>
      <JsonLd data={jsonLd} />
      <div className="bg-elderly-bg">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <Breadcrumbs items={breadcrumbItems} />

          <header className="mb-8">
            <h1 className="text-elderly-2xl font-bold text-elderly-primary mb-4">
              Surgery Procedures: Compare NHS vs Private
            </h1>
            <p className="text-elderly-base text-elderly-text">
              Browse all available procedures. Compare NHS waiting times with private surgery options in major UK cities.
            </p>
          </header>

          {/* Procedures Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {procedures.map((procedure) => (
              <Card key={procedure.procedure_id} className="flex flex-col bg-elderly-primary-light">
                <div className="flex-grow">
                  <h2 className="text-elderly-xl font-bold text-elderly-primary mb-4">
                    {procedure.name}
                  </h2>
                  <p className="text-elderly-sm text-elderly-text mb-4">
                    {procedure.description}
                  </p>
                  <div className="space-y-2 mb-4">
                    <p className="text-elderly-sm">
                      <strong className="text-elderly-text">Specialty:</strong>{' '}
                      <span className="text-elderly-text">{procedure.specialty}</span>
                    </p>
                    <p className="text-elderly-sm">
                      <strong className="text-elderly-text">NHS Code:</strong>{' '}
                      <span className="text-elderly-text">{procedure.nhs_code}</span>
                    </p>
                  </div>
                </div>
                <Link href={`/procedures/${procedure.procedure_id}`} className="mt-auto">
                  <Button variant="primary" className="w-full">
                    Compare by City →
                  </Button>
                </Link>
              </Card>
            ))}
          </div>

          {/* Information Section */}
          <section className="bg-elderly-primary-light p-6 rounded-lg border-elderly border-elderly-gray-medium">
            <h2 className="text-elderly-xl font-bold text-elderly-primary mb-4">
              How to Use This Page
            </h2>
            <div className="space-y-4 text-elderly-base text-elderly-text">
              <p>
                Select a procedure above to see detailed comparisons by city. Each procedure page shows:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>NHS waiting times for major UK cities</li>
                <li>Private surgery costs and availability</li>
                <li>City-by-city comparisons</li>
                <li>Clinic listings with contact information</li>
              </ul>
              <p>
                All data is updated weekly from NHS records and private clinic websites.
              </p>
            </div>
          </section>
        </div>
      </div>
    </>
  )
}

