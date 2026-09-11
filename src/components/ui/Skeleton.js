import React from 'react';

const base = 'animate-pulse rounded bg-gray-300 dark:bg-[#2C303B]';

export default function Skeleton({ className = '' }) {
  return <div className={`${base} ${className}`} />;
}

export function SkeletonCard({ className = '' }) {
  return (
    <div className={`card-root p-6 ${className}`}>
      <Skeleton className="h-40 w-full" />
      <div className="mt-5 space-y-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
        <Skeleton className="h-3 w-2/3" />
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 6, className = '' }) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
