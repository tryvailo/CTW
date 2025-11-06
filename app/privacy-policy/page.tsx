import { Breadcrumbs } from '@/components/common/Breadcrumbs'
import { generateStaticPageMetadata } from '@/lib/metadata'
import type { Metadata } from 'next'

export const metadata: Metadata = generateStaticPageMetadata('privacy-policy')

export default function PrivacyPolicyPage() {
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Privacy Policy' },
  ]

  return (
    <div className="bg-elderly-bg">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Breadcrumbs items={breadcrumbItems} />

        <header className="mb-8">
          <h1 className="text-elderly-2xl font-bold text-elderly-primary mb-4">
            Privacy Policy
          </h1>
          <p className="text-elderly-sm text-elderly-gray-dark">
            Last updated: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </header>

        <div className="space-y-8 text-elderly-base text-elderly-text">
          <section className="bg-elderly-primary-light p-6 rounded-lg border-elderly border-elderly-gray-medium mb-6">
            <h2 className="text-elderly-xl font-bold text-elderly-primary mb-4">
              Introduction
            </h2>
            <p>
              Compare The Wait is committed to protecting your privacy. This Privacy Policy explains 
              how we collect, use, and protect your information when you visit our website.
            </p>
          </section>

          <section className="bg-elderly-primary-light p-6 rounded-lg border-elderly border-elderly-gray-medium mb-6">
            <h2 className="text-elderly-xl font-bold text-elderly-primary mb-4">
              Information We Collect
            </h2>
            <p className="mb-4">
              <strong>We do not collect personal information on this website.</strong> You can browse 
              and compare NHS vs private surgery options without providing any personal data.
            </p>
            <p>
              We may collect anonymous usage data through analytics tools (such as Google Analytics) 
              to understand how visitors use our website. This data is aggregated and does not identify 
              individual users.
            </p>
          </section>

          <section className="bg-elderly-primary-light p-6 rounded-lg border-elderly border-elderly-gray-medium mb-6">
            <h2 className="text-elderly-xl font-bold text-elderly-primary mb-4">
              Cookies
            </h2>
            <p>
              We may use cookies to improve your experience on our website. Cookies are small text files 
              stored on your device. You can control cookies through your browser settings.
            </p>
          </section>

          <section className="bg-elderly-primary-light p-6 rounded-lg border-elderly border-elderly-gray-medium mb-6">
            <h2 className="text-elderly-xl font-bold text-elderly-primary mb-4">
              Third-Party Services
            </h2>
            <p>
              We may use third-party services (such as analytics providers) that have their own privacy 
              policies. We encourage you to review these policies.
            </p>
          </section>

          <section className="bg-elderly-primary-light p-6 rounded-lg border-elderly border-elderly-gray-medium mb-6">
            <h2 className="text-elderly-xl font-bold text-elderly-primary mb-4">
              Data Security
            </h2>
            <p>
              We take reasonable steps to protect any information we collect. However, no method of 
              transmission over the internet is 100% secure.
            </p>
          </section>

          <section className="bg-elderly-primary-light p-6 rounded-lg border-elderly border-elderly-gray-medium mb-6">
            <h2 className="text-elderly-xl font-bold text-elderly-primary mb-4">
              Your Rights
            </h2>
            <p>
              Since we do not collect personal information, there is no personal data to access, modify, 
              or delete. If you have questions about this policy, please contact us.
            </p>
          </section>

          <section className="bg-elderly-primary-light p-6 rounded-lg border-elderly border-elderly-gray-medium mb-6">
            <h2 className="text-elderly-xl font-bold text-elderly-primary mb-4">
              Changes to This Policy
            </h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes 
              by posting the new policy on this page.
            </p>
          </section>

          <section className="bg-elderly-primary-light p-6 rounded-lg border-elderly border-elderly-gray-medium mb-6">
            <h2 className="text-elderly-xl font-bold text-elderly-primary mb-4">
              Contact Us
            </h2>
            <p>
              If you have questions about this Privacy Policy, please contact us through our website.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}

