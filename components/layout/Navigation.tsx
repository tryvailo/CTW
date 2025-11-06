import Link from 'next/link';

interface NavigationProps {
  items: Array<{
    label: string;
    href: string;
  }>;
  className?: string;
}

export const Navigation: React.FC<NavigationProps> = ({ items, className = '' }) => {
  return (
    <nav className={className} aria-label="Navigation">
      <ul className="flex flex-wrap items-center gap-4">
        {items.map((item, index) => (
          <li key={index}>
            <Link
              href={item.href}
              className="text-elderly-base text-elderly-text hover:text-elderly-primary underline-offset-4 hover:underline min-h-touch flex items-center"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

