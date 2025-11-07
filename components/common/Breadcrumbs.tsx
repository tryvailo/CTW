'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

// Function to get icon based on label or href
function getBreadcrumbIcon(label: string, href?: string): string {
  const lowerLabel = label.toLowerCase();
  
  if (lowerLabel === 'home' || href === '/') {
    return '🏠';
  }
  if (lowerLabel === 'procedures' || href?.includes('/procedures')) {
    return '📋';
  }
  if (lowerLabel.includes('cataract') || lowerLabel.includes('hip') || lowerLabel.includes('knee')) {
    return '🔬';
  }
  if (lowerLabel === 'comparison' || href?.includes('/comparison')) {
    return '📊';
  }
  // City names or location-based
  if (['london', 'manchester', 'birmingham', 'leeds', 'bristol'].some(city => lowerLabel.includes(city))) {
    return '📍';
  }
  
  return '';
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  const [isStuck, setIsStuck] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const breadcrumb = document.querySelector('[data-breadcrumb]');
      if (breadcrumb) {
        const rect = breadcrumb.getBoundingClientRect();
        setIsStuck(rect.top <= 0);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      aria-label="Breadcrumb" 
      className={`sticky top-0 bg-white z-40 py-4 mb-4 transition-shadow duration-200 ${
        isStuck ? 'shadow-md' : ''
      }`}
      data-breadcrumb
    >
      <div className="container mx-auto px-4 max-w-6xl">
        <ol className="flex flex-wrap items-center gap-2 text-elderly-sm">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            const icon = getBreadcrumbIcon(item.label, item.href);

            return (
              <li key={index} className="flex items-center">
                {index > 0 && (
                  <span className="mx-2 text-elderly-gray-medium" aria-hidden="true">
                    →
                  </span>
                )}
                {item.href && !isLast ? (
                  <Link
                    href={item.href}
                    className="flex items-center gap-1 text-elderly-gray-dark hover:text-elderly-primary underline-offset-4 hover:underline transition-colors"
                  >
                    {icon && <span className="text-base">{icon}</span>}
                    <span>{item.label}</span>
                  </Link>
                ) : (
                  <span className={`flex items-center gap-1 ${
                    isLast 
                      ? 'text-elderly-primary font-bold' 
                      : 'text-elderly-gray-dark'
                  }`}>
                    {icon && <span className="text-base">{icon}</span>}
                    <span>{item.label}</span>
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
};

