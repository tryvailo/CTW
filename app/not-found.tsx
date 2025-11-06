import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default function NotFound() {
  return (
    <div className="bg-elderly-bg min-h-screen flex items-center justify-center">
      <div className="container mx-auto px-4 py-8 max-w-2xl text-center">
        <h1 className="text-elderly-2xl font-bold text-elderly-text mb-4">
          404 - Page Not Found
        </h1>
        <p className="text-elderly-base text-elderly-text mb-8">
          Sorry, we couldn't find the page you're looking for. The comparison 
          you're searching for might not exist, or the page may have been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button variant="primary">
              Go to Homepage
            </Button>
          </Link>
          <Link href="/procedures">
            <Button variant="secondary">
              Browse Procedures
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

