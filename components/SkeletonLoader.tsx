'use client';

interface SkeletonLoaderProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string;
  height?: string;
}

export function SkeletonLoader({ 
  className = '', 
  variant = 'rectangular',
  width,
  height 
}: SkeletonLoaderProps) {
  const baseClasses = 'animate-pulse bg-gray-200 dark:bg-gray-700 rounded';
  
  const variantClasses = {
    text: 'h-4',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  };

  const style: React.CSSProperties = {};
  if (width) style.width = width;
  if (height) style.height = height;

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={style}
      aria-hidden="true"
    />
  );
}

export function AuraScoreSkeleton() {
  return (
    <section className="flex flex-col items-center justify-center py-8 sm:py-12 px-4 sm:px-6">
      <SkeletonLoader variant="circular" width="256px" height="256px" className="mb-4" />
      <SkeletonLoader variant="text" width="200px" height="32px" className="mb-2" />
      <SkeletonLoader variant="text" width="150px" height="24px" />
    </section>
  );
}

export function ActivityFeedSkeleton() {
  return (
    <section className="px-4 sm:px-6 py-6 sm:py-8">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-4 sm:p-6">
        <SkeletonLoader variant="text" width="200px" height="28px" className="mb-6" />
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
              <SkeletonLoader variant="circular" width="48px" height="48px" />
              <div className="flex-1 space-y-2">
                <SkeletonLoader variant="text" width="100px" height="20px" />
                <SkeletonLoader variant="text" width="80%" height="16px" />
                <SkeletonLoader variant="text" width="60%" height="16px" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function TrendsSkeleton() {
  return (
    <div className="space-y-6 sm:space-y-8 px-4 sm:px-6 py-6 sm:py-8">
      {[...Array(2)].map((_, i) => (
        <section key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-4 sm:p-6">
          <SkeletonLoader variant="text" width="150px" height="28px" className="mb-4" />
          <SkeletonLoader variant="rectangular" width="100%" height="300px" />
        </section>
      ))}
    </div>
  );
}

