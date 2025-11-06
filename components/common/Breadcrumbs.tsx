import Link from 'next/link';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex flex-wrap items-center gap-2 text-elderly-base text-elderly-gray-dark">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && <span className="mx-2" aria-hidden="true">/</span>}
            {item.href && index < items.length - 1 ? (
              <Link
                href={item.href}
                className="hover:text-elderly-primary underline-offset-4 hover:underline"
              >
                {item.label}
              </Link>
            ) : (
              <span className={index === items.length - 1 ? 'text-elderly-text font-semibold' : ''}>
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

