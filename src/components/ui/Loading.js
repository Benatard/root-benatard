import React from 'react';
import Skeleton, { SkeletonGrid } from './Skeleton';

function HeroSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-4 w-40" />
      <Skeleton className="h-12 w-3/4" />
      <Skeleton className="h-4 w-full max-w-[620px]" />
      <Skeleton className="h-4 w-2/3 max-w-[620px]" />
      <div className="flex gap-4 pt-2">
        <Skeleton className="h-12 w-40" />
        <Skeleton className="h-12 w-40" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      <div className="card-root overflow-hidden">
        <Skeleton className="h-24 w-full" />
        <div className="px-8 pb-8 pt-2 text-center">
          <Skeleton className="mx-auto h-28 w-28 rounded-full" />
          <Skeleton className="mx-auto mt-5 h-5 w-40" />
          <Skeleton className="mx-auto mt-3 h-4 w-32" />
          <Skeleton className="mx-auto mt-6 h-3 w-56" />
        </div>
      </div>
      <Skeleton className="h-40 w-full" />
      <Skeleton className="h-14 w-full" />
    </div>
  );
}

const VARIANTS = {
  hero: () => <HeroSkeleton />,
  profile: () => <ProfileSkeleton />,
  cards: ({ count = 6 }) => <SkeletonGrid count={count} />,
  cardGrid2: () => <SkeletonGrid count={4} className="md:grid-cols-2" />,
  list: ({ count = 4 }) => (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card-root p-6 space-y-3">
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-2/3" />
        </div>
      ))}
    </div>
  ),
  form: () => (
    <div className="card-root p-8 space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Skeleton className="h-11 w-full" />
        <Skeleton className="h-11 w-full" />
      </div>
      <Skeleton className="h-11 w-full" />
      <Skeleton className="h-28 w-full" />
      <Skeleton className="h-12 w-full" />
    </div>
  ),
};

export default function Loading({ variant = 'profile', count = 6, className = '' }) {
  const renderer = VARIANTS[variant] || VARIANTS.profile;
  return <div className={className}>{renderer({ count })}</div>;
}
