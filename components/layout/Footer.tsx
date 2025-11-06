import Link from 'next/link';
import { getDataInsights, formatDateForDisplay } from '@/lib/stats';

export const Footer: React.FC = () => {
  const insights = getDataInsights();

  return (
    <footer className="bg-elderly-gray-light border-t border-elderly-gray-medium mt-12">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-6">
          {/* Links */}
          <div>
            <h3 className="text-elderly-lg font-bold text-elderly-text mb-4">Links</h3>
            <nav className="flex flex-col gap-2" aria-label="Footer navigation">
              <Link
                href="/privacy-policy"
                className="text-elderly-base text-elderly-text hover:text-elderly-primary underline-offset-4 hover:underline"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms-of-service"
                className="text-elderly-base text-elderly-text hover:text-elderly-primary underline-offset-4 hover:underline"
              >
                Terms of Service
              </Link>
              <Link
                href="/faq"
                className="text-elderly-base text-elderly-text hover:text-elderly-primary underline-offset-4 hover:underline"
              >
                FAQ
              </Link>
              <Link
                href="/about"
                className="text-elderly-base text-elderly-text hover:text-elderly-primary underline-offset-4 hover:underline"
              >
                About
              </Link>
            </nav>
          </div>

          {/* Data & Sources */}
          <div>
            <h3 className="text-elderly-lg font-bold text-elderly-text mb-4">Data & Sources</h3>
            <div className="space-y-2 text-elderly-sm text-elderly-text">
              <p>
                <strong>Data updated:</strong> {formatDateForDisplay(insights.lastUpdatedDate)}
              </p>
              <p>
                <strong>Using official NHS data:</strong>{' '}
                <Link
                  href="https://www.myplannedcare.nhs.uk/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-elderly-primary hover:underline"
                >
                  MyPlannedCare
                </Link>
              </p>
              <p>
                <strong>Private data from:</strong>{' '}
                <Link
                  href="https://www.phin.org.uk/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-elderly-primary hover:underline"
                >
                  PHIN
                </Link>{' '}
                and clinic websites
              </p>
              <p className="text-elderly-xs text-elderly-gray-dark mt-2">
                Data refreshed weekly
              </p>
            </div>
          </div>

          {/* About */}
          <div>
            <h3 className="text-elderly-lg font-bold text-elderly-text mb-4">About</h3>
            <p className="text-elderly-sm text-elderly-text mb-2">
              Compare The Wait helps people 65+ understand their options for NHS vs private surgery.
              Free information, no pressure.
            </p>
            <p className="text-elderly-sm text-elderly-text font-semibold">
              100% Free - No hidden fees
            </p>
          </div>

          {/* Important */}
          <div>
            <h3 className="text-elderly-lg font-bold text-elderly-text mb-4">Important</h3>
            <p className="text-elderly-xs text-elderly-gray-dark mb-2">
              This website provides informational comparisons only. Not medical advice—always consult your doctor before making decisions about surgery.
            </p>
            <Link
              href="/privacy-policy"
              className="text-elderly-xs text-elderly-primary hover:underline"
            >
              Privacy Policy (GDPR)
            </Link>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-elderly-gray-medium pt-6">
          <p className="text-elderly-xs text-elderly-gray-dark text-center">
            Compare The Wait © 2025 | Helping 65+ patients understand their options | Not medical advice—always consult your doctor
          </p>
        </div>
      </div>
    </footer>
  );
};

