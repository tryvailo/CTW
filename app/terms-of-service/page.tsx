import { Breadcrumbs } from '@/components/common/Breadcrumbs'
import { generateStaticPageMetadata } from '@/lib/metadata'
import type { Metadata } from 'next'

export const metadata: Metadata = generateStaticPageMetadata('terms-of-service')

export default function TermsOfServicePage() {
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Terms of Service' },
  ]

  return (
    <div className="bg-elderly-bg">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Breadcrumbs items={breadcrumbItems} />

        <header className="mb-8">
          <h1 className="text-elderly-2xl font-bold text-elderly-primary mb-4">
            Terms of Service
          </h1>
          <p className="text-elderly-sm text-elderly-gray-dark">
            Last updated: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </header>

        <div className="space-y-8 text-elderly-base text-elderly-text">
          <section className="bg-elderly-primary-light p-6 rounded-lg border-elderly border-elderly-gray-medium mb-6">
            <h2 className="text-elderly-xl font-bold text-elderly-primary mb-4">
              Agreement to Terms
            </h2>
            <p>
              By accessing and using Compare The Wait, you agree to be bound by these Terms of Service. 
              If you do not agree to these terms, please do not use our website.
            </p>
          </section>

          <section className="bg-elderly-primary-light p-6 rounded-lg border-elderly border-elderly-gray-medium mb-6">
            <h2 className="text-elderly-xl font-bold text-elderly-primary mb-4">
              Use of Website
            </h2>
            <p>
              Compare The Wait provides informational comparisons of NHS vs private surgery options. 
              You may use this website for personal, non-commercial purposes only.
            </p>
          </section>

          <section className="bg-elderly-accent-light p-6 rounded-lg border-elderly border-elderly-gray-medium mb-6">
            <h2 className="text-elderly-xl font-bold text-elderly-success mb-4">
              Medical Disclaimer
            </h2>
            <p className="mb-4">
              <strong>This website provides informational comparisons only. This is not medical advice.</strong>
            </p>
            <p>
              The information on this website is based on publicly available data and is for informational 
              purposes only. It does not constitute medical advice, diagnosis, or treatment. Always consult 
              your doctor or healthcare professional before making decisions about surgery.
            </p>
          </section>

          <section className="bg-elderly-primary-light p-6 rounded-lg border-elderly border-elderly-gray-medium mb-6">
            <h2 className="text-elderly-xl font-bold text-elderly-primary mb-4">
              Accuracy of Information
            </h2>
            <p>
              We strive to provide accurate and up-to-date information, but we cannot guarantee the accuracy, 
              completeness, or timeliness of all data. NHS waiting times and private surgery costs may change. 
              We update our data every 2 weeks, but you should verify current information with relevant sources.
            </p>
          </section>

          <section className="bg-elderly-primary-light p-6 rounded-lg border-elderly border-elderly-gray-medium mb-6">
            <h2 className="text-elderly-xl font-bold text-elderly-primary mb-4">
              Limitation of Liability
            </h2>
            <p>
              Compare The Wait shall not be liable for any damages arising from your use of this website 
              or reliance on the information provided. We are not responsible for any decisions you make 
              based on information from this website.
            </p>
          </section>

          <section className="bg-elderly-primary-light p-6 rounded-lg border-elderly border-elderly-gray-medium mb-6">
            <h2 className="text-elderly-xl font-bold text-elderly-primary mb-4">
              Third-Party Links
            </h2>
            <p>
              Our website may contain links to third-party websites (such as clinic websites). We are not 
              responsible for the content or privacy practices of these external sites.
            </p>
          </section>

          <section className="bg-elderly-primary-light p-6 rounded-lg border-elderly border-elderly-gray-medium mb-6">
            <h2 className="text-elderly-xl font-bold text-elderly-primary mb-4">
              Intellectual Property
            </h2>
            <p>
              The content on this website, including text, graphics, and logos, is the property of Compare 
              The Wait and is protected by copyright laws. You may not reproduce or distribute this content 
              without permission.
            </p>
          </section>

          <section className="bg-elderly-primary-light p-6 rounded-lg border-elderly border-elderly-gray-medium mb-6">
            <h2 className="text-elderly-xl font-bold text-elderly-primary mb-4">
              Changes to Terms
            </h2>
            <p>
              We reserve the right to modify these Terms of Service at any time. Your continued use of 
              the website after changes are posted constitutes acceptance of the modified terms.
            </p>
          </section>

          <section className="bg-elderly-primary-light p-6 rounded-lg border-elderly border-elderly-gray-medium mb-6">
            <h2 className="text-elderly-xl font-bold text-elderly-primary mb-4">
              Contact Us
            </h2>
            <p>
              If you have questions about these Terms of Service, please contact us through our website.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}

