import { Hero } from '@/components/sections/Hero'
import { TrustSection } from '@/components/sections/TrustSection'
import { HowItWorks } from '@/components/sections/HowItWorks'
import { QuickFind } from '@/components/sections/QuickFind'
import { DataInsights } from '@/components/sections/DataInsights'
import { SecuritySection } from '@/components/sections/SecuritySection'
import { OfficialVsRealityComparisonWrapper } from '@/components/OfficialVsRealityComparisonWrapper'
import { RegionalVariationComparison } from '@/components/RegionalVariationComparison'
import { SubmitExperienceForm } from '@/components/SubmitExperienceForm'
import { JsonLd } from '@/components/common/JsonLd'
import { generateHomeMetadata } from '@/lib/metadata'
import { loadProcedures } from '@/lib/data'
import { getUKWideData, getPrivateComparisonData } from '@/lib/utils/waitingTimesLoader'
import type { Metadata } from 'next'
import type { ProcedureId } from '@/lib/types/waitingTimes'

export const metadata: Metadata = generateHomeMetadata()

export default function Home() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://comparethewait.co.uk'

  // Load procedures from CSV data
  const allProcedures = loadProcedures();
  
  // Filter to only show cataract, hip, and knee
  const procedureIds: ProcedureId[] = ['cataract', 'hip', 'knee'];
  const procedures = allProcedures.filter(p => procedureIds.includes(p.procedure_id));

  // Load data for each procedure for the chart
  const chartData = procedures.map(procedure => {
    const waitData = getUKWideData(procedure.procedure_id);
    const privateData = getPrivateComparisonData(procedure.procedure_id);
    
    return {
      name: procedure.name.split(' ')[0], // Short name (Cataract, Hip, Knee)
      Official: waitData?.officialTarget || 18,
      Real: waitData?.patientAverage || 0,
      Private: privateData?.average_wait_weeks || 2
    };
  });

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
        <OfficialVsRealityComparisonWrapper data={chartData} />

        {/* Regional Variation Section */}
        <RegionalVariationComparison />

        {/* Help Improve Data Section */}
        <SubmitExperienceForm />

        {/* Security Section */}
        <SecuritySection />

        {/* About Section */}
        <section id="about" className="py-16 bg-blue-50">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-elderly-2xl md:text-elderly-3xl font-bold mb-8 text-center">Why compare NHS vs Private?</h2>
            <div className="space-y-6 text-elderly-lg text-gray-800 leading-relaxed">
              <p>
                <span className="font-bold">7.7 million people</span> are waiting for NHS surgery right now. 
                For common procedures like hip and knee replacements, waits can be 20+ weeks. 
                Private surgery is often available within 1-2 weeks.
              </p>
              <p>
                But private costs money—£2,500-£15,000 depending on procedure. 
                This guide shows you real waiting times and real costs so you can make an informed decision.
              </p>
              <p>
                We update this data every 2 weeks from NHS records and clinic websites. 
                Everything is free to compare.
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

