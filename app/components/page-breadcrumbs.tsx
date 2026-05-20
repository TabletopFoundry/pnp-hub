import Link from 'next/link';

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

type PageBreadcrumbsProps = {
  items: BreadcrumbItem[];
};

export function PageBreadcrumbs({ items }: PageBreadcrumbsProps) {
  if (!items.length) return null;

  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-2 text-sm text-[var(--text-secondary)]">
        {items.map((item, index) => {
          const isCurrent = index === items.length - 1;

          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-2">
              {item.href && !isCurrent ? (
                <Link href={item.href} className="focus-ring rounded-full px-2 py-1 font-medium text-[var(--ink)] transition hover:bg-white/70">
                  {item.label}
                </Link>
              ) : (
                <span aria-current={isCurrent ? 'page' : undefined} className={isCurrent ? 'font-semibold text-[var(--ink)]' : undefined}>
                  {item.label}
                </span>
              )}
              {!isCurrent ? <span aria-hidden="true">/</span> : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
