import Link from 'next/link';
import { Button } from '../ui/Button';

export const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-elderly-gray-medium">
      <div className="container mx-auto px-4 py-4 max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Logo/Title */}
          <Link href="/" className="flex items-center">
            <h1 className="text-elderly-xl font-bold text-elderly-primary">
              Compare The Wait
            </h1>
          </Link>

          {/* Navigation */}
          <nav className="flex flex-wrap items-center gap-4" aria-label="Main navigation">
            <Link
              href="/"
              className="text-elderly-base text-elderly-text hover:text-elderly-primary underline-offset-4 hover:underline min-h-touch flex items-center"
            >
              Home
            </Link>
            <Link
              href="/procedures"
              className="text-elderly-base text-elderly-text hover:text-elderly-primary underline-offset-4 hover:underline min-h-touch flex items-center"
            >
              Procedures
            </Link>
            <Link
              href="/faq"
              className="text-elderly-base text-elderly-text hover:text-elderly-primary underline-offset-4 hover:underline min-h-touch flex items-center"
            >
              FAQ
            </Link>
            <Link
              href="/about"
              className="text-elderly-base text-elderly-text hover:text-elderly-primary underline-offset-4 hover:underline min-h-touch flex items-center"
            >
              About
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

