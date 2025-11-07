import Link from 'next/link';
import { getDataInsights, formatDateForDisplay } from '@/lib/stats';

export const Footer: React.FC = () => {
  const insights = getDataInsights();

  return (
    <footer className="bg-elderly-gray-light border-t border-elderly-gray-medium mt-12">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Three-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Column 1: About Our Service */}
          <div>
            <h3 className="text-elderly-lg font-bold text-elderly-text mb-4">
              About Our Service
            </h3>
            <p className="text-elderly-sm text-elderly-text mb-4">
              CompareTheWait provides free, unbiased comparisons of NHS waiting times vs private surgery costs. We collect data from official sources and update it weekly.
            </p>
            <div className="space-y-2 text-elderly-sm text-elderly-text">
              <p>
                <strong>Data updated:</strong> Weekly
              </p>
              <p>
                <strong>Sources:</strong> NHS MyPlannedCare, PHIN
              </p>
              <p>
                <strong>Founded:</strong> 2025
              </p>
            </div>
          </div>

          {/* Column 2: Our Guarantee */}
          <div>
            <h3 className="text-elderly-lg font-bold text-elderly-text mb-4">
              Our Guarantee
            </h3>
            <div className="space-y-3 text-elderly-sm text-elderly-text">
              <div className="flex items-start gap-2">
                <span className="text-green-600 font-bold text-lg">✓</span>
                <span>100% Free - No hidden fees or charges</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-600 font-bold text-lg">✓</span>
                <span>No Commissions - We don't receive payment from clinics</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-600 font-bold text-lg">✓</span>
                <span>Your Privacy - No personal data required to compare</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-600 font-bold text-lg">✓</span>
                <span>Updated Weekly - Latest waiting times and costs</span>
              </div>
            </div>
          </div>

          {/* Column 3: Legal & Support */}
          <div>
            <h3 className="text-elderly-lg font-bold text-elderly-text mb-4">
              Legal & Support
            </h3>
            <nav className="flex flex-col gap-2 mb-4" aria-label="Footer navigation">
              <Link
                href="/privacy-policy"
                className="text-elderly-sm text-elderly-primary hover:underline"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms-of-service"
                className="text-elderly-sm text-elderly-primary hover:underline"
              >
                Terms of Service
              </Link>
              <Link
                href="/terms-of-service#medical-disclaimer"
                className="text-elderly-sm text-elderly-primary hover:underline"
              >
                Medical Disclaimer
              </Link>
              <a
                href="mailto:hello@comparethewait.co.uk"
                className="text-elderly-sm text-elderly-primary hover:underline"
              >
                Contact Us
              </a>
            </nav>
            <p className="text-elderly-sm text-elderly-text">
              Registered in England & Wales
            </p>
          </div>
        </div>

        {/* Copyright Bar */}
        <div className="border-t border-elderly-gray-medium pt-4 mt-8">
          <p className="text-elderly-sm text-elderly-gray-dark text-center">
            © 2025 CompareTheWait. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

