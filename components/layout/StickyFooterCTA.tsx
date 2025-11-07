'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Button } from '../ui/Button';

export const StickyFooterCTA: React.FC = () => {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);

  // Hide on homepage, show on other pages
  const shouldShow = pathname !== '/';

  useEffect(() => {
    if (shouldShow) {
      // Smooth entrance animation
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [shouldShow]);

  if (!shouldShow) {
    return null;
  }

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 bg-elderly-primary shadow-lg z-50 transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : 'translate-y-full'
      }`}
      style={{ height: '64px' }}
    >
      <div className="max-w-7xl mx-auto px-4 h-full flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Message */}
        <p className="text-white text-elderly-base font-semibold text-center md:text-left">
          Need help comparing your options?
        </p>

        {/* CTA Button */}
        <Link href="/#quick-find" className="flex-shrink-0">
          <Button variant="secondary" size="default">
            Get Free Comparison
          </Button>
        </Link>
      </div>
    </div>
  );
};

