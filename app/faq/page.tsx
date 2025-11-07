import { Breadcrumbs } from '@/components/common/Breadcrumbs'
import { FAQ } from '@/components/sections/FAQ'
import { JsonLd } from '@/components/common/JsonLd'
import { generateStaticPageMetadata } from '@/lib/metadata'
import { getFAQItems, getExtendedFAQItems } from '@/lib/data'
import type { Metadata } from 'next'

export const metadata: Metadata = generateStaticPageMetadata('faq')

export default function FAQPage() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://comparethewait.co.uk'
  const url = `${baseUrl}/faq`

  // Load FAQ data from CSV
  const generalFAQ = getFAQItems()
  const cataractFAQ = getFAQItems('cataract')
  const hipFAQ = getFAQItems('hip')
  const kneeFAQ = getFAQItems('knee')

  // Create JSON-LD from loaded data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: generalFAQ.slice(0, 2).map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'FAQ' },
  ]

  return (
    <>
      <JsonLd data={jsonLd} />
      <div className="bg-elderly-bg">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <Breadcrumbs items={breadcrumbItems} />

          <header className="mb-8">
            <h1 className="text-elderly-2xl font-bold text-elderly-primary mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-elderly-base text-elderly-text">
              Common questions about NHS vs private surgery, waiting times, costs, and making informed decisions.
            </p>
          </header>

          {/* Extended FAQ Section */}
          <section className="mb-12">
            <h2 className="text-elderly-xl font-bold text-elderly-primary mb-6">
              Common Questions from Patients Like You
            </h2>
            
            {(() => {
              const extendedFAQs = getExtendedFAQItems();
              const categories = {
                safety: { title: 'Safety and Quality', items: extendedFAQs.filter(f => f.category === 'safety') },
                process: { title: 'The Process', items: extendedFAQs.filter(f => f.category === 'process') },
                cost: { title: 'Costs and Payment', items: extendedFAQs.filter(f => f.category === 'cost') },
                aftercare: { title: 'After Surgery', items: extendedFAQs.filter(f => f.category === 'aftercare') },
              };

              return (
                <div className="space-y-8">
                  {Object.entries(categories).map(([key, category]) => (
                    category.items.length > 0 && (
                      <div key={key}>
                        <h3 className="text-elderly-lg font-bold text-elderly-primary mb-4">
                          {category.title}
                        </h3>
                        <div className="space-y-4">
                          {category.items.map((item, index) => (
                            <div
                              key={index}
                              className="bg-white border-elderly border-elderly-gray-medium rounded-lg"
                            >
                              <details className="group">
                                <summary className="px-6 py-4 cursor-pointer list-none flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-elderly-primary focus:ring-offset-2 rounded-lg">
                                  <span className="text-elderly-base font-semibold text-elderly-text pr-4">
                                    {item.question}
                                  </span>
                                  <span className="text-elderly-lg text-elderly-primary flex-shrink-0">
                                    <span className="group-open:hidden">+</span>
                                    <span className="group-open:inline hidden">−</span>
                                  </span>
                                </summary>
                                <div className="px-6 pb-4">
                                  <p className="text-elderly-sm text-elderly-text leading-[1.8]">
                                    {item.answer}
                                  </p>
                                </div>
                              </details>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  ))}
                </div>
              );
            })()}
          </section>

          {/* General FAQ */}
          <section className="mb-12">
            <h2 className="text-elderly-xl font-bold text-elderly-primary mb-6">
              General Questions
            </h2>
            <FAQ items={generalFAQ} />
          </section>

          {/* Procedure-specific FAQ sections */}
          <section className="mb-12">
            <h2 className="text-elderly-xl font-bold text-elderly-primary mb-6">
              Questions by Procedure
            </h2>
            
            <div className="space-y-8">
              <div>
                <h3 className="text-elderly-lg font-bold text-elderly-primary mb-4">
                  Cataract Surgery
                </h3>
                <FAQ items={cataractFAQ} />
              </div>

              <div>
                <h3 className="text-elderly-lg font-bold text-elderly-primary mb-4">
                  Hip Replacement
                </h3>
                <FAQ items={hipFAQ} />
              </div>

              <div>
                <h3 className="text-elderly-lg font-bold text-elderly-primary mb-4">
                  Knee Replacement
                </h3>
                <FAQ items={kneeFAQ} />
              </div>
            </div>
          </section>

          {/* Contact CTA */}
          <section className="bg-elderly-gray-light p-6 rounded-lg border-elderly border-elderly-gray-medium text-center">
            <p className="text-elderly-base text-elderly-text mb-4">
              Still have questions? This website provides informational comparisons only. 
              Always consult your doctor or healthcare professional for medical advice.
            </p>
            <a href="/" className="text-elderly-primary underline-offset-4 hover:underline">
              ← Back to Homepage
            </a>
          </section>
        </div>
      </div>
    </>
  )
}

