import { Breadcrumbs } from '@/components/common/Breadcrumbs'
import { JsonLd } from '@/components/common/JsonLd'
import { generateStaticPageMetadata } from '@/lib/metadata'
import type { Metadata } from 'next'

export const metadata: Metadata = generateStaticPageMetadata('about')

export default function AboutPage() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://comparethewait.co.uk'
  const url = `${baseUrl}/about`

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'About Compare The Wait',
    description: 'Information about Compare The Wait and our mission to help people 65+ understand NHS vs private surgery options',
    url,
  }

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'About' },
  ]

  return (
    <>
      <JsonLd data={jsonLd} />
      <div className="bg-elderly-bg">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <Breadcrumbs items={breadcrumbItems} />

          <header className="mb-8">
            <h1 className="text-elderly-2xl font-bold text-elderly-primary mb-4">
              About Compare The Wait
            </h1>
          </header>

          <div className="space-y-8 text-elderly-base text-elderly-text">
            {/* Mission */}
            <section className="bg-elderly-primary-light p-6 rounded-lg border-elderly border-elderly-gray-medium">
              <h2 className="text-elderly-xl font-bold text-elderly-primary mb-4">
                Our Mission
              </h2>
              <p className="mb-4">
                Compare The Wait helps people aged 65+ understand their options for NHS vs private surgery. 
                We provide honest, free comparisons of waiting times and costs so you can make an informed decision.
              </p>
              <p>
                7.7 million people are waiting for NHS surgery right now. For common procedures like hip and 
                knee replacements, waits can be 20+ weeks. We believe everyone should have access to clear 
                information about their options.
              </p>
            </section>

            {/* What We Do */}
            <section className="bg-elderly-primary-light p-6 rounded-lg border-elderly border-elderly-gray-medium">
              <h2 className="text-elderly-xl font-bold text-elderly-primary mb-4">
                What We Do
              </h2>
              <ul className="list-disc list-inside space-y-2">
                <li>
                  Compare NHS waiting times with private surgery options
                </li>
                <li>
                  Show real costs from private clinics (no hidden fees)
                </li>
                <li>
                  Provide free information—no personal data required
                </li>
                <li>
                  Update data weekly from NHS records and clinic websites
                </li>
                <li>
                  Focus on procedures most common for people 65+: cataract surgery, hip replacement, and knee replacement
                </li>
              </ul>
            </section>

            {/* Data Sources */}
            <section className="bg-elderly-primary-light p-6 rounded-lg border-elderly border-elderly-gray-medium">
              <h2 className="text-elderly-xl font-bold text-elderly-primary mb-4">
                Our Data Sources
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-elderly-lg font-bold text-elderly-primary mb-2">
                    NHS Waiting Times
                  </h3>
                  <p>
                    We use data from <strong>My Planned Care</strong> (https://www.myplannedcare.nhs.uk/), 
                    the official NHS website that shows waiting times by procedure and location. This data is 
                    updated regularly by NHS trusts.
                  </p>
                </div>
                <div>
                  <h3 className="text-elderly-lg font-bold text-elderly-primary mb-2">
                    Private Surgery Costs
                  </h3>
                  <p>
                    We gather prices from multiple sources:
                  </p>
                  <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                    <li><strong>PHIN</strong> (Private Healthcare Information Network) - official registry of consultant fees</li>
                    <li>Clinic websites - publicly available pricing pages</li>
                    <li>Major private hospital groups (Moorfields, Circle, Spire, Practice Plus, etc.)</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Updates */}
            <section className="bg-elderly-primary-light p-6 rounded-lg border-elderly border-elderly-gray-medium">
              <h2 className="text-elderly-xl font-bold text-elderly-primary mb-4">
                How Often We Update
              </h2>
              <p>
                We update our data <strong>weekly</strong> to ensure you have the most current information. 
                NHS waiting times can change, and private clinic prices may fluctuate, so we make sure our 
                comparisons reflect the latest available data.
              </p>
            </section>

            {/* Disclaimer */}
            <section className="bg-elderly-accent-light p-6 rounded-lg border-elderly border-elderly-gray-medium">
              <h2 className="text-elderly-xl font-bold text-elderly-success mb-4">
                Important Disclaimer
              </h2>
              <p className="mb-4">
                <strong>This website provides informational comparisons only.</strong> The data shown is based 
                on publicly available information and may not reflect your personal situation.
              </p>
              <p>
                <strong>This is not medical advice—always consult your doctor or healthcare professional</strong> 
                before making decisions about surgery. Every patient's situation is unique, and only a qualified 
                medical professional can advise you on the best course of action.
              </p>
            </section>

            {/* Contact */}
            <section className="text-center">
              <p className="text-elderly-base text-elderly-text mb-4">
                Have questions or feedback? We'd love to hear from you.
              </p>
              <a 
                href="/" 
                className="text-elderly-primary underline-offset-4 hover:underline text-elderly-base"
              >
                ← Back to Homepage
              </a>
            </section>
          </div>
        </div>
      </div>
    </>
  )
}

