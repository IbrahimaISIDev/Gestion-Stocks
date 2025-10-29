import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface Breadcrumb {
  label: string;
  path?: string;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: Breadcrumb[];
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'success' | 'danger';
  };
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  breadcrumbs,
  action,
}) => {
  const location = useLocation();

  const defaultBreadcrumbs: Breadcrumb[] = [
    { label: 'Accueil', path: '/' },
    { label: title },
  ];

  const displayBreadcrumbs = breadcrumbs || defaultBreadcrumbs;

  const getActionClasses = (variant?: string) => {
    const baseClasses =
      'inline-flex items-center px-6 py-3 rounded-lg font-semibold transition';
    switch (variant) {
      case 'success':
        return `${baseClasses} bg-green-600 text-white hover:bg-green-700`;
      case 'danger':
        return `${baseClasses} bg-red-600 text-white hover:bg-red-700`;
      case 'secondary':
        return `${baseClasses} bg-gray-200 text-gray-900 hover:bg-gray-300`;
      default:
        return `${baseClasses} bg-blue-600 text-white hover:bg-blue-700`;
    }
  };

  return (
    <div className="border-b border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 space-y-4">
        {/* Breadcrumbs */}
        {displayBreadcrumbs && displayBreadcrumbs.length > 0 && (
          <nav className="flex items-center gap-2 text-sm">
            {displayBreadcrumbs.map((crumb, index) => (
              <React.Fragment key={index}>
                {index > 0 && (
                  <ChevronRight size={16} className="text-gray-400" />
                )}
                {crumb.path ? (
                  <Link
                    to={crumb.path}
                    className="text-blue-600 hover:text-blue-700 hover:underline font-medium"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-gray-600">{crumb.label}</span>
                )}
              </React.Fragment>
            ))}
          </nav>
        )}

        {/* Title and Action */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              {title}
            </h1>
            {description && (
              <p className="text-gray-600 mt-2">{description}</p>
            )}
          </div>
          {action && (
            <button
              onClick={action.onClick}
              className={getActionClasses(action.variant)}
            >
              {action.label}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
