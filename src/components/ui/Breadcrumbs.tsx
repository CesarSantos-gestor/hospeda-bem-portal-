export function Breadcrumbs() {
  const items = [
    { label: 'Home', href: '/' },
    { label: 'Capitólio', href: '/capitolio' },
    { label: 'Hospedagens', href: null },
  ];

  return (
    <nav aria-label="Breadcrumb" className="bg-gray-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <ol className="flex items-center gap-2 text-sm">
          {items.map((item, index) => (
            <li key={index} className="flex items-center gap-2">
              {index > 0 && (
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
                </svg>
              )}
              {item.href ? (
                <a href={item.href} className="text-gray-600 hover:text-gray-900 transition-colors hover:underline">
                  {item.label}
                </a>
              ) : (
                <span className="font-semibold text-gray-900" aria-current="page">
                  {item.label}
                </span>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}
